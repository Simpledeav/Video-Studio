#!/usr/bin/env python3
"""Generate an arbitrary narration line with a permanent library voice.

This reuses the exact engine voice, prosody and mastering chain documented in
``public/audio/voice-library/manifest.json``. It never substitutes a different
voice: an unknown ID/name or emotion exits non-zero.

Examples:
    python3 scripts/voice-say.py \
        --voice "SD_VOICE_03 — Nathan Cole" \
        --emotion suspense \
        --text "When thousands of customers depend on your system, one mistake can change everything." \
        --out out/voice-lines/nathan-suspense.wav

    python3 scripts/voice-say.py --voice SD_VOICE_01 --emotion calm \
        --text-file docs/line.txt --out out/voice-lines/marcus-calm.wav --mp3

The output is 48 kHz / 24-bit PCM / mono WAV, trimmed, high-passed, and
loudness-normalized to the same target as the library.
"""

from __future__ import annotations

import argparse
import asyncio
import importlib.util
import json
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

# Reuse the build script's mastering helpers so the sound is identical.
_spec = importlib.util.spec_from_file_location(
    "build_voice_library", Path(__file__).with_name("build-voice-library.py")
)
if _spec is None or _spec.loader is None:  # pragma: no cover
    raise SystemExit("Could not load scripts/build-voice-library.py")
bvl = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(bvl)


def normalize(value: str) -> str:
    return (
        value.lower()
        .replace("—", " ")
        .replace("–", " ")
        .replace("_", " ")
        .replace("-", " ")
        .strip()
    )


def compact(value: str) -> str:
    import re

    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9]+", " ", normalize(value))).strip()


def fail(message: str, code: int = 2) -> None:
    sys.stderr.write(message + "\n")
    raise SystemExit(code)


def resolve_voice(manifest: dict, query: str) -> dict:
    q = compact(query)
    voices = manifest["voices"]
    for field in ("voice_id", "voice_name"):
        for voice in voices:
            if compact(voice[field]) == q:
                return voice
    for voice in voices:
        if compact(f"{voice['voice_id']} {voice['voice_name']}") == q:
            return voice
    matches = [
        voice
        for voice in voices
        if compact(voice["voice_id"]).startswith(q)
        or compact(voice["voice_name"]).startswith(q)
    ]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        fail(
            f'Voice query "{query}" is ambiguous: '
            + ", ".join(f"{v['voice_id']} — {v['voice_name']}" for v in matches)
            + ". Use the permanent ID."
        )
    fail(
        f'Voice "{query}" not found. Available: '
        + ", ".join(f"{v['voice_id']} — {v['voice_name']}" for v in voices)
        + ". No substitute voice was used."
    )


async def synthesize(text: str, voice: str, rate: int, pitch: int, volume: int, out: Path) -> None:
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
            with open(out, "wb") as handle:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        handle.write(chunk["data"])
                        written += len(chunk["data"])
            if written > 4000 and bvl.probe_duration(out) > bvl.MIN_DURATION:
                return
            last_error = f"empty/short audio ({written} bytes)"
        except Exception as exc:  # noqa: BLE001 - public service is flaky
            last_error = f"{type(exc).__name__}: {exc}"
        await asyncio.sleep(0.8 + attempt * 0.9)
    raise SystemExit(
        f"Edge TTS failed for {voice} after 10 attempts: {last_error}. "
        "No substitute voice was used."
    )


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--voice", required=True, help="permanent ID, name, or combined form")
    parser.add_argument(
        "--emotion",
        default="identity",
        help="identity or one of the ten library emotions (default: identity)",
    )
    parser.add_argument("--text", help="narration text")
    parser.add_argument("--text-file", help="read narration text from a UTF-8 file")
    parser.add_argument(
        "--out",
        help="output WAV path (default: out/voice-lines/<voice>_<emotion>.wav)",
    )
    parser.add_argument("--mp3", action="store_true", help="also write a 320 kbps MP3")
    args = parser.parse_args()

    if not MANIFEST.exists():
        raise SystemExit(
            f"Voice manifest not found at {MANIFEST}. Run: python3 scripts/build-voice-library.py"
        )
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    voice = resolve_voice(manifest, args.voice)

    emotion = args.emotion.strip().lower()
    if emotion == "identity":
        prosody = voice["prosody"]["base"]
    else:
        prosody = voice["prosody"]["emotions"].get(emotion)
        if prosody is None:
            valid = ["identity", *manifest["emotion_definitions"].keys()]
            fail(
                f'Unknown emotion "{args.emotion}" for {voice["voice_id"]}. '
                f'Valid: {", ".join(valid)}. No substitute voice was used.'
            )

    if args.text and args.text_file:
        raise SystemExit("Use either --text or --text-file, not both.")
    if args.text_file:
        text = Path(args.text_file).read_text(encoding="utf-8").strip()
    elif args.text:
        text = args.text.strip()
    else:
        text = sys.stdin.read().strip()
    if not text:
        raise SystemExit("No narration text supplied (use --text, --text-file, or stdin).")

    if args.out:
        out = Path(args.out)
    else:
        out = ROOT / "out/voice-lines" / f"{voice['voice_id']}_{emotion}.wav"
    if not out.is_absolute():
        out = (Path.cwd() / out).resolve()
    out.parent.mkdir(parents=True, exist_ok=True)

    tmp_dir = Path(tempfile.mkdtemp(prefix="voice-say-", dir=ROOT / "scripts"))
    try:
        raw = tmp_dir / "raw.mp3"
        asyncio.run(
            synthesize(
                text,
                voice["engine_voice"],
                int(prosody["rate_percent"]),
                int(prosody["pitch_hz"]),
                int(prosody["volume_percent"]),
                raw,
            )
        )

        start, end = bvl.speech_bounds(raw)
        if end <= start:
            raise SystemExit("No speech detected in the generated audio.")
        start = max(0.0, start - bvl.HEAD_PAD)
        end = end + bvl.TAIL_PAD
        trimmed = tmp_dir / "trim.wav"
        duration = bvl.decode_trim_highpass(raw, trimmed, start, end)
        bvl.normalize(trimmed, out, duration)

        result = {
            "voice_id": voice["voice_id"],
            "voice_name": voice["voice_name"],
            "engine_voice": voice["engine_voice"],
            "emotion": emotion,
            "prosody": prosody,
            "text": text,
            "output_wav": str(out),
            "duration_seconds": round(bvl.probe_duration(out), 3),
            "sample_rate_hz": 48000,
            "bit_depth": 24,
            "channels": 1,
            **bvl.measure_loudness(out),
        }

        if args.mp3:
            mp3 = out.with_suffix(".mp3")
            bvl.ffmpeg(
                [
                    "-i",
                    str(out),
                    "-c:a",
                    "libmp3lame",
                    "-b:a",
                    "320k",
                    str(mp3),
                ]
            )
            result["output_mp3"] = str(mp3)

        print(json.dumps(result, indent=2, ensure_ascii=False))
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


if __name__ == "__main__":
    main()
