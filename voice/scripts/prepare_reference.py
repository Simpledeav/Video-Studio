#!/usr/bin/env python3
"""Derive the clean speaker prompts from the original reference recording.

The original is never modified. Running this is safe and idempotent.
"""
from __future__ import annotations

import argparse
import subprocess
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from voice import audio  # noqa: E402
from voice.alignment import transcribe_words  # noqa: E402

PROFILE_DIR = PROJECT_ROOT / "public" / "audio" / "voice-profile" / "david_nigerian_english"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--profile-dir", default=str(PROFILE_DIR))
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--start-seconds", type=float, default=5.0)
    parser.add_argument("--clip-seconds", type=float, default=16.0)
    parser.add_argument("--heldout-start", type=float, default=41.0)
    parser.add_argument("--heldout-seconds", type=float, default=22.0)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    directory = Path(args.profile_dir)
    original = directory / "reference.wav"
    if not original.is_file():
        print(f"Original reference not found: {original}", file=sys.stderr)
        return 1

    clean = directory / "reference-clean.wav"
    clip = directory / "reference-16s.wav"
    heldout = directory / "reference-heldout.wav"
    transcript = directory / "reference.txt"

    if args.force or not clean.is_file():
        subprocess.run(
            [
                audio.FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(original),
                "-af", "highpass=f=60,loudnorm=I=-20:TP=-2:LRA=9",
                "-ar", "48000", "-ac", "1", "-c:a", "pcm_s24le", str(clean),
            ],
            check=True,
        )
    if args.force or not clip.is_file():
        subprocess.run(
            [
                audio.FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
                "-ss", str(args.start_seconds), "-t", str(args.clip_seconds),
                "-i", str(clean), "-ar", "24000", "-ac", "1",
                "-c:a", "pcm_s16le", str(clip),
            ],
            check=True,
        )
    if args.force or not heldout.is_file():
        subprocess.run(
            [
                audio.FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
                "-ss", str(args.heldout_start), "-t", str(args.heldout_seconds),
                "-i", str(clean), "-ar", "24000", "-ac", "1",
                "-c:a", "pcm_s16le", str(heldout),
            ],
            check=True,
        )
    if args.force or not transcript.is_file() or transcript.stat().st_size == 0:
        words = transcribe_words(original, model_size="base.en", model_root=PROJECT_ROOT / "models" / "whisper")
        transcript.write_text(" ".join(word.text for word in words).strip() + "\n", encoding="utf-8")

    info = audio.probe_info(original)
    stats = audio.audio_stats(original)
    print(
        {
            "original": str(original),
            "durationSeconds": info["duration_seconds"],
            "sampleRate": info["sample_rate"],
            "channels": info["channels"],
            "peakDbfs": stats["peak_dbfs"],
            "clean": str(clean),
            "clip": str(clip),
            "heldout": str(heldout),
            "transcriptWords": len(transcript.read_text(encoding="utf-8").split()),
        }
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
