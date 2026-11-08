#!/usr/bin/env python3
"""Generate an episode voiceover from scene segments with word-accurate cues.

Each scene can carry its own delivery rate, pitch and post-line pause. The
segments are concatenated into one local MP3, and word timings are offset to the
final timeline. Subtitles are grouped from those real word timings.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import re
import subprocess
import tempfile
from pathlib import Path

import edge_tts

PUNCT = ".,!?;:—–…"
DEFAULT_VOICE = "en-US-AndrewMultilingualNeural"
TOKEN_RE = re.compile(r"\S+")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--segments-file", default="content/ai-agent-voice-segments.json")
    parser.add_argument("--out-media", default="public/audio/episodes/ai-agent/voice.mp3")
    parser.add_argument("--out-vtt", default="public/audio/episodes/ai-agent/voice.vtt")
    parser.add_argument("--out-words", default="public/audio/episodes/ai-agent/voice.words.json")
    parser.add_argument("--out-cues", default="public/audio/episodes/ai-agent/voice.cues.json")
    return parser.parse_args()


def clean_word(token: str) -> str:
    return token.strip(PUNCT + '"“”‘’()[]')


def fmt_vtt_time(seconds: float) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, ms = divmod(remainder, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{ms:03d}"


def make_cues(tokens: list[dict]) -> list[dict]:
    cues: list[dict] = []
    current: list[dict] = []

    def flush() -> None:
        if not current:
            return
        start = current[0]["start"]
        end = current[-1]["end"] + 0.16
        text = " ".join(word["text"] for word in current)
        cues.append({"start": round(start, 3), "end": round(end, 3), "text": text})
        current.clear()

    for index, word in enumerate(tokens):
        current.append(word)
        duration = current[-1]["end"] - current[0]["start"]
        at_sentence_end = bool(re.search(r"[.!?]['\"”’]?$", word["text"])) or word["text"].endswith("...")
        at_comma = word["text"].endswith(",")
        if at_sentence_end or (at_comma and len(current) >= 5) or len(current) >= 10 or duration >= 4.2:
            flush()
    flush()

    compacted: list[dict] = []
    for cue in cues:
        previous_ends_sentence = bool(
            compacted and re.search(r"[.!?]['\"”’]?$", compacted[-1]["text"].strip())
        )
        if compacted and len(cue["text"].split()) <= 3 and not previous_ends_sentence:
            previous = compacted[-1]
            combined_text = f"{previous['text']} {cue['text']}"
            combined_duration = cue["end"] - previous["start"]
            if len(combined_text) <= 76 and combined_duration <= 5.25:
                previous["text"] = combined_text
                previous["end"] = cue["end"]
                continue
        compacted.append(dict(cue))
    cues = compacted

    for index, cue in enumerate(cues[:-1]):
        cue["end"] = min(cue["end"], cues[index + 1]["start"] - 0.12)
    return cues


def make_vtt(cues: list[dict]) -> str:
    lines = ["WEBVTT", ""]
    for index, cue in enumerate(cues, start=1):
        lines.append(str(index))
        lines.append(f"{fmt_vtt_time(cue['start'])} --> {fmt_vtt_time(cue['end'])}")
        lines.append(cue["text"])
        lines.append("")
    return "\n".join(lines)


def duration_of(path: Path) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    return float(result.stdout.strip())


def make_silence(path: Path, seconds: float) -> None:
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-f", "lavfi", "-i", "anullsrc=r=24000:cl=mono",
            "-t", f"{seconds:.3f}", "-q:a", "9", str(path),
        ],
        check=True,
    )


async def render_segment(segment: dict, voice: str, path: Path) -> list[dict]:
    last_error = None
    for attempt in range(1, 4):
        try:
            communicate = edge_tts.Communicate(
                segment["text"],
                voice=voice,
                rate=segment.get("rate", "+0%"),
                pitch=segment.get("pitch", "+0Hz"),
                volume=segment.get("volume", "+0%"),
                boundary="WordBoundary",
            )
            audio = bytearray()
            raw_words: list[dict] = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio.extend(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    raw_words.append(
                        {
                            "text": chunk["text"],
                            "start": chunk["offset"] / 10_000_000,
                            "end": (chunk["offset"] + chunk["duration"]) / 10_000_000,
                        }
                    )
            if audio and raw_words:
                path.write_bytes(audio)
                return raw_words
            raise RuntimeError("No audio or word boundaries received")
        except Exception as error:
            last_error = error
            await asyncio.sleep(1.2 * attempt)
    raise RuntimeError(f"TTS failed for segment {segment['id']}: {last_error}")


def normalize_word(token: str) -> str:
    return clean_word(token).strip("'").lower().replace("’", "'")


def split_compound(token: str) -> list[str]:
    """Split em-dashed compounds that Edge TTS emits as separate words."""
    parts = [normalize_word(part) for part in re.split(r"[—–]", token)]
    return [part for part in parts if part]


def align_source_words(raw_words: list[dict], source_text: str) -> list[dict]:
    """Attach exact source punctuation to real Edge word boundaries.

    Edge can emit "spike—but" as two boundaries and strips punctuation. Map
    the authoritative source tokens onto those boundaries without inventing
    timing. Source text is never rewritten.
    """
    source_tokens = source_text.split()

    # Edge occasionally returns a single boundary for a number/year phrase
    # ("By 2004", "35.8 billion"). Split those into components while sharing
    # the boundary's timing so source punctuation can still be preserved.
    expanded_raw: list[dict] = []
    for word in raw_words:
        pieces = word["text"].split()
        if len(pieces) <= 1:
            expanded_raw.append(word)
        else:
            for piece in pieces:
                expanded_raw.append(
                    {"text": piece, "start": word["start"], "end": word["end"]}
                )
    raw_norm = [normalize_word(word["text"]) for word in expanded_raw]
    aligned: list[dict] = []
    raw_index = 0

    for token in source_tokens:
        full = normalize_word(token)
        parts = split_compound(token)
        matched_start = None
        matched_end = None

        if raw_index < len(raw_norm) and raw_norm[raw_index] == full:
            matched_start = raw_index
            matched_end = raw_index
        elif len(parts) > 1 and raw_index + len(parts) <= len(raw_norm):
            if raw_norm[raw_index : raw_index + len(parts)] == parts:
                matched_start = raw_index
                matched_end = raw_index + len(parts) - 1

        if matched_start is None:
            # Tolerate one extra split/merged boundary by searching a short
            # window, but never jump over an entire phrase.
            for probe in range(raw_index + 1, min(len(raw_norm), raw_index + 5)):
                if raw_norm[probe] == full:
                    matched_start = matched_end = probe
                    break
                if len(parts) > 1 and probe + len(parts) <= len(raw_norm):
                    if raw_norm[probe : probe + len(parts)] == parts:
                        matched_start = probe
                        matched_end = probe + len(parts) - 1
                        break

        if matched_start is None:
            raise RuntimeError(
                f"Could not align source token {token!r} after boundary {raw_index} "
                f"in {source_text!r}"
            )

        start = expanded_raw[matched_start]["start"]
        end = expanded_raw[matched_end]["end"]
        aligned.append(
            {
                "text": token,
                "start": round(start, 3),
                "end": round(end, 3),
            }
        )
        raw_index = matched_end + 1

    if raw_index != len(raw_norm):
        raise RuntimeError(
            f"Unused word boundaries ({raw_index}/{len(raw_norm)}) for {source_text!r}"
        )
    return aligned


async def main() -> None:
    args = parse_args()
    spec = json.loads(Path(args.segments_file).read_text(encoding="utf-8"))
    voice = spec.get("voice", DEFAULT_VOICE)
    lead_in = float(spec.get("leadInSeconds", 0))

    output_media = Path(args.out_media)
    output_vtt = Path(args.out_vtt)
    output_words = Path(args.out_words)
    output_cues = Path(args.out_cues)
    for path in [output_media, output_vtt, output_words, output_cues]:
        path.parent.mkdir(parents=True, exist_ok=True)

    with tempfile.TemporaryDirectory(prefix="simpledeav-aiagent-voice-") as temp:
        temp_path = Path(temp)
        list_lines: list[str] = []
        timeline_cursor = lead_in
        words: list[dict] = []
        segment_manifest: list[dict] = []

        if lead_in > 0:
            lead_silence = temp_path / "00-lead.mp3"
            make_silence(lead_silence, lead_in)
            list_lines.append(f"file '{lead_silence}'")

        total_duration = float(spec.get("totalDurationSeconds", 0))
        for index, segment in enumerate(spec["segments"], start=1):
            audio_path = temp_path / f"{index:02d}-{segment['id']}.mp3"
            raw_words = await render_segment(segment, voice, audio_path)
            source_words = align_source_words(raw_words, segment["text"])
            segment_duration = duration_of(audio_path)

            scene_start = segment.get("sceneStartSeconds")
            if scene_start is not None:
                voice_start = float(scene_start) + float(segment.get("voiceOffsetSeconds", 0.25))
                if voice_start < timeline_cursor - 0.001:
                    raise RuntimeError(
                        f"Segment {segment['id']} would overlap the previous segment "
                        f"({voice_start:.3f} < {timeline_cursor:.3f})."
                    )
                if voice_start > timeline_cursor + 0.001:
                    gap_path = temp_path / f"{index:02d}-scene-gap.mp3"
                    make_silence(gap_path, voice_start - timeline_cursor)
                    list_lines.append(f"file '{gap_path}'")
                    timeline_cursor = voice_start
                segment_start = timeline_cursor
            else:
                segment_start = timeline_cursor

            adjusted_words = []
            for word in source_words:
                adjusted_words.append(
                    {
                        "text": word["text"],
                        "start": round(segment_start + word["start"], 3),
                        "end": round(segment_start + word["end"], 3),
                    }
                )
            words.extend(adjusted_words)
            segment_manifest.append(
                {
                    "id": segment["id"],
                    "text": segment.get("text", ""),
                    "emotion": segment.get("emotion", "identity"),
                    "rate": segment.get("rate", "+0%"),
                    "pitch": segment.get("pitch", "+0Hz"),
                    "start": round(segment_start, 3),
                    "duration": round(segment_duration, 3),
                    "end": round(segment_start + segment_duration, 3),
                    "words": len(source_words),
                }
            )
            list_lines.append(f"file '{audio_path}'")
            timeline_cursor += segment_duration
            # Edge TTS occasionally drops a request when segments are fired
            # back-to-back. A short beat between lines keeps generation stable.
            await asyncio.sleep(0.9)

            pause = float(segment.get("pauseAfterSeconds", 0))
            if pause > 0:
                silence_path = temp_path / f"{index:02d}-pause.mp3"
                make_silence(silence_path, pause)
                list_lines.append(f"file '{silence_path}'")
                timeline_cursor += pause

        if total_duration > 0:
            if timeline_cursor > total_duration + 0.001:
                raise RuntimeError(
                    f"Narration is {timeline_cursor:.3f}s, longer than the {total_duration:.1f}s composition."
                )
            if timeline_cursor < total_duration - 0.001:
                tail_path = temp_path / "99-tail.mp3"
                make_silence(tail_path, total_duration - timeline_cursor)
                list_lines.append(f"file '{tail_path}'")
                timeline_cursor = total_duration

        concat_file = temp_path / "concat.txt"
        concat_file.write_text("\n".join(list_lines) + "\n", encoding="utf-8")
        subprocess.run(
            [
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-f", "concat", "-safe", "0", "-i", str(concat_file),
                "-ar", "48000", "-ac", "1",
                "-af", "loudnorm=I=-16:TP=-1.5:LRA=11",
                "-c:a", "libmp3lame", "-b:a", "192k",
                str(output_media),
            ],
            check=True,
        )

    cues = make_cues(words)
    output_vtt.write_text(make_vtt(cues), encoding="utf-8")
    output_words.write_text(
        json.dumps(
            {
                "voice": voice,
                "leadInSeconds": lead_in,
                "segments": segment_manifest,
                "words": words,
            },
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )
    output_cues.write_text(
        json.dumps(
            {
                "source": str(output_media),
                "voice": voice,
                "segments": segment_manifest,
                "cues": cues,
            },
            indent=2,
        ) + "\n",
        encoding="utf-8",
    )

    print(f"voice={voice}")
    print(f"audio={output_media} duration={words[-1]['end']:.3f}s words={len(words)} cues={len(cues)}")
    for segment in segment_manifest:
        print(f"  {segment['id']}: {segment['start']:.3f} - {segment['end']:.3f}s")


if __name__ == "__main__":
    asyncio.run(main())
