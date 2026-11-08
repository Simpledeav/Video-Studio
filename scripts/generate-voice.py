#!/usr/bin/env python3
"""Generate Simpledeav narration plus word-accurate WebVTT subtitles.

Edge TTS is used only as the initial local production voice. The word
boundaries emitted by the service are the timing source; subtitle cues are
never divided evenly across the video.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import re
from pathlib import Path

import edge_tts

PUNCT = ".,!?;:—–…"
TOKEN_RE = re.compile(r"\S+")


def clean_word(token: str) -> str:
    return token.strip(PUNCT + '"“”‘’()[]')


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--text-file", default="content/demo-narration.txt")
    parser.add_argument("--voice", default="en-US-AndrewMultilingualNeural")
    parser.add_argument("--rate", default="-4%")
    parser.add_argument("--pitch", default="-2Hz")
    parser.add_argument("--out-media", default="public/audio/voice.mp3")
    parser.add_argument("--out-vtt", default="public/audio/voice.vtt")
    parser.add_argument("--out-words", default="public/audio/voice.words.json")
    parser.add_argument("--out-cues", default="public/audio/voice.cues.json")
    return parser.parse_args()


def fmt_vtt_time(seconds: float) -> str:
    milliseconds = max(0, round(seconds * 1000))
    h, remainder = divmod(milliseconds, 3_600_000)
    m, remainder = divmod(remainder, 60_000)
    s, ms = divmod(remainder, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def make_cues(tokens: list[dict]) -> list[dict]:
    """Group real word timings into readable, two-line-friendly cues."""
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
        if (
            at_sentence_end
            or (at_comma and len(current) >= 5)
            or len(current) >= 10
            or duration >= 4.3
        ):
            flush()
    flush()

    # A tiny orphan cue ("work.", "alone.") is not professional. Merge it into
    # the previous cue when the combined cue still fits on two lines and in time.
    compacted: list[dict] = []
    for cue in cues:
        word_count = len(cue["text"].split())
        previous_ends_sentence = bool(
            compacted and re.search(r"[.!?]['\"”’]?$", compacted[-1]["text"].strip())
        )
        if compacted and word_count <= 3 and not previous_ends_sentence:
            previous = compacted[-1]
            combined_text = f"{previous['text']} {cue['text']}"
            combined_duration = cue["end"] - previous["start"]
            if len(combined_text) <= 68 and combined_duration <= 4.9:
                previous["text"] = combined_text
                previous["end"] = cue["end"]
                continue
        compacted.append(dict(cue))
    cues = compacted

    # Keep cues from overlapping and leave a readable pause between sentences.
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


async def main() -> None:
    args = parse_args()
    text = Path(args.text_file).read_text(encoding="utf-8").strip()
    tokens = TOKEN_RE.findall(text)

    communicate = edge_tts.Communicate(
        text,
        voice=args.voice,
        rate=args.rate,
        pitch=args.pitch,
        boundary="WordBoundary",
    )

    raw_words: list[dict] = []
    audio = bytearray()
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

    if not audio or not raw_words:
        raise RuntimeError("Edge TTS returned no audio or no word boundaries.")

    # Re-attach punctuation from the source text while keeping service timings.
    token_index = 0
    words: list[dict] = []
    for raw in raw_words:
        target = clean_word(raw["text"]).lower()
        matched = None
        for probe in range(token_index, len(tokens)):
            if clean_word(tokens[probe]).lower() == target:
                matched = probe
                break
        if matched is None:
            matched = token_index
        original = tokens[matched] if matched < len(tokens) else raw["text"]
        words.append(
            {
                "text": original,
                "start": round(raw["start"], 3),
                "end": round(raw["end"], 3),
            }
        )
        token_index = max(token_index, matched + 1)

    words_path = Path(args.out_words)
    words_path.parent.mkdir(parents=True, exist_ok=True)
    words_path.write_text(
        json.dumps({"voice": args.voice, "rate": args.rate, "pitch": args.pitch, "words": words}, indent=2) + "\n",
        encoding="utf-8",
    )
    Path(args.out_media).write_bytes(audio)

    cues = make_cues(words)
    Path(args.out_vtt).write_text(make_vtt(cues), encoding="utf-8")
    Path(args.out_cues).write_text(
        json.dumps(
            {
                "source": args.out_media,
                "voice": args.voice,
                "cues": cues,
            },
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )

    print(f"audio={args.out_media} words={len(words)} cues={len(cues)} duration={words[-1]['end']:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
