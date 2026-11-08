#!/usr/bin/env python3
"""Generate timed narration for a film with the permanent library voice.

Reads ``content/<slug>-voice-segments.json``, synthesises every segment with the
exact SD_VOICE_03 engine voice and mastering chain used by the voice library,
captures Edge TTS word boundaries, and writes:

  public/audio/episodes/<slug>/voice/<file>.wav
  public/audio/episodes/<slug>/voice.cues.json

The JSON contains segment-level absolute times and grouped caption cues, so the
Remotion captions and picture share the narration clock.

This tool never substitutes a voice. An unknown voice or emotion exits non-zero.
"""

from __future__ import annotations

import argparse
import asyncio
import importlib.util
import json
import re
import shutil
import sys
import tempfile
from pathlib import Path

try:
    import edge_tts
except ImportError as exc:  # pragma: no cover
    raise SystemExit(
        "edge-tts is required. Install it with: python3 -m pip install edge-tts"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "public/audio/voice-library/manifest.json"

_spec = importlib.util.spec_from_file_location(
    "build_voice_library", Path(__file__).with_name("build-voice-library.py")
)
if _spec is None or _spec.loader is None:  # pragma: no cover
    raise SystemExit("Could not load scripts/build-voice-library.py")
bvl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bvl)


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", value.lower())).strip()


def resolve_voice(manifest: dict, query: str) -> dict:
    q = compact(query)
    for voice in manifest["voices"]:
        if compact(voice["voice_id"]) == q or compact(voice["voice_name"]) == q:
            return voice
        if compact(f"{voice['voice_id']} {voice['voice_name']}") == q:
            return voice
    raise SystemExit(
        f'Voice "{query}" not found. No substitute voice was used. '
        "Available: "
        + ", ".join(f"{v['voice_id']} — {v['voice_name']}" for v in manifest["voices"])
    )


async def synthesize(
    text: str,
    voice: str,
    rate: int,
    pitch: int,
    volume: int,
    out: Path,
) -> list[dict]:
    last_error = "unknown"
    for attempt in range(10):
        try:
            communicate = edge_tts.Communicate(
                text,
                voice,
                rate=f"{rate:+d}%",
                pitch=f"{pitch:+d}Hz",
                volume=f"{volume:+d}%",
            )
            written = 0
            words: list[dict] = []
            with open(out, "wb") as handle:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        handle.write(chunk["data"])
                        written += len(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        start = chunk["offset"] / 10_000_000
                        end = (chunk["offset"] + chunk["duration"]) / 10_000_000
                        words.append(
                            {
                                "text": chunk["text"],
                                "start": round(start, 4),
                                "end": round(end, 4),
                            }
                        )
            if written > 4000 and bvl.probe_duration(out) > bvl.MIN_DURATION:
                return words
            last_error = f"empty/short audio ({written} bytes)"
        except Exception as exc:  # noqa: BLE001 - public service is flaky
            last_error = f"{type(exc).__name__}: {exc}"
        await asyncio.sleep(0.8 + attempt * 0.9)
    raise SystemExit(
        f"Edge TTS failed for {voice} after 10 attempts: {last_error}. "
        "No substitute voice was used."
    )


def group_cues(words: list[dict], max_words: int = 7, max_chars: int = 46) -> list[dict]:
    cues: list[dict] = []
    current: list[dict] = []

    def flush() -> None:
        if not current:
            return
        cues.append(
            {
                "start": current[0]["start"],
                "end": current[-1]["end"],
                "text": " ".join(word["text"] for word in current),
            }
        )
        current.clear()

    for word in words:
        current.append(word)
        text = word["text"].strip()
        ends_sentence = bool(re.search(r"[.!?]$", text))
        ends_clause = bool(re.search(r"[,;:]$", text))
        too_long = len(current) >= max_words or len(
            " ".join(item["text"] for item in current)
        ) >= max_chars
        if ends_sentence or too_long or (ends_clause and len(current) >= 4):
            flush()
    flush()
    return cues


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--slug", required=True)
    args = parser.parse_args()

    segments_path = ROOT / "content" / f"{args.slug}-voice-segments.json"
    if not segments_path.exists():
        raise SystemExit(f"Missing segment file: {segments_path}")
    spec = json.loads(segments_path.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    voice = resolve_voice(manifest, spec["voiceId"])

    out_dir = ROOT / "public" / "audio" / "episodes" / args.slug / "voice"
    out_dir.mkdir(parents=True, exist_ok=True)
    tmp_dir = Path(tempfile.mkdtemp(prefix="voice-timed-", dir=ROOT / "scripts"))

    try:
        result_segments = []
        for segment in spec["segments"]:
            emotion = segment.get("emotion", "calm")
            base = voice["prosody"]["emotions"].get(emotion)
            if base is None:
                raise SystemExit(
                    f'Unknown emotion "{emotion}" for {voice["voice_id"]}. '
                    "No substitute voice was used."
                )
            rate = int(segment.get("rate", base["rate_percent"]))
            pitch = int(segment.get("pitch", base["pitch_hz"]))
            volume = int(segment.get("volume", base["volume_percent"]))
            raw = tmp_dir / f"{segment['id']}.mp3"
            words_raw = asyncio.run(
                synthesize(segment["text"], voice["engine_voice"], rate, pitch, volume, raw)
            )

            speech_start, speech_end = bvl.speech_bounds(raw)
            if speech_end <= speech_start:
                raise SystemExit(f"No speech detected in {segment['id']}.")
            trim_start = max(0.0, speech_start - bvl.HEAD_PAD)
            trim_end = speech_end + bvl.TAIL_PAD
            trimmed = tmp_dir / f"{segment['id']}.wav"
            duration = bvl.decode_trim_highpass(raw, trimmed, trim_start, trim_end)
            output = out_dir / segment["file"]
            bvl.normalize(trimmed, output, duration)

            words = []
            for word in words_raw:
                start = max(0.0, word["start"] - trim_start)
                end = max(start + 0.04, word["end"] - trim_start)
                words.append(
                    {
                        "text": word["text"],
                        "start": round(min(start, duration), 4),
                        "end": round(min(end, duration), 4),
                    }
                )

            scene_start = float(segment["sceneStartSeconds"])
            file_start = scene_start - bvl.HEAD_PAD
            cues = group_cues(words)
            for cue in cues:
                cue["start"] = round(cue["start"] + file_start, 4)
                cue["end"] = round(cue["end"] + file_start, 4)

            result_segments.append(
                {
                    "id": segment["id"],
                    "text": segment["text"],
                    "emotion": emotion,
                    "rate": rate,
                    "pitch": pitch,
                    "volume": volume,
                    "file": f"audio/episodes/{args.slug}/voice/{segment['file']}",
                    "fileStartSeconds": round(file_start, 4),
                    "speechStartSeconds": round(scene_start, 4),
                    "speechEndSeconds": round(scene_start + (speech_end - speech_start), 4),
                    "durationSeconds": round(duration, 4),
                    "words": words,
                    "cues": cues,
                }
            )
            print(
                f"{segment['id']}: {duration:.2f}s file, "
                f"speech {scene_start:.2f}–{scene_start + (speech_end - speech_start):.2f}s"
            )

        payload = {
            "slug": args.slug,
            "voiceId": voice["voice_id"],
            "voiceName": voice["voice_name"],
            "engineVoice": voice["engine_voice"],
            "direction": spec.get("direction", ""),
            "segments": result_segments,
            "cues": [cue for segment in result_segments for cue in segment["cues"]],
        }
        cues_path = ROOT / "public" / "audio" / "episodes" / args.slug / "voice.cues.json"
        cues_path.write_text(
            json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        print(f"Wrote {cues_path}")
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
