#!/usr/bin/env python3
"""CLI for the reusable voice-generation service.

Examples:
  python voice/scripts/generate_voiceover.py --status
  python voice/scripts/generate_voiceover.py \
      --script content/voice-profile-demo-scenes.json --engine chatterbox_onnx
  python voice/scripts/generate_voiceover.py \
      --text "A short test." --scene-id test --preset documentary_hook \
      --out public/audio/voice-tests/test.wav
"""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from voice.service import VoiceService, summarize_result  # noqa: E402


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate narration with David's cloned voice.")
    parser.add_argument("--profile", default="david_nigerian_english")
    parser.add_argument(
        "--engine",
        default=None,
        choices=["chatterbox_onnx", "pocket_tts", "openvoice_v2", "xtts_v2"],
        help="Default comes from the voice profile (chatterbox_onnx).",
    )
    parser.add_argument("--script", help="Batch scene JSON.")
    parser.add_argument("--slug", help="Override the output slug.")
    parser.add_argument("--format", default="wav", choices=["wav", "mp3", "both"])
    parser.add_argument("--no-mp3", action="store_true", help="Do not create the delivery MP3.")
    parser.add_argument("--no-subtitles", action="store_true", help="Skip Whisper alignment.")
    parser.add_argument("--force", action="store_true", help="Ignore the cache for this run.")
    parser.add_argument("--status", action="store_true", help="Print profile/engine status as JSON.")
    parser.add_argument("--text", help="Generate one scene without a batch script.")
    parser.add_argument("--scene-id", default="test")
    parser.add_argument("--preset", default="business_explanation")
    parser.add_argument("--emotion", default=None)
    parser.add_argument("--speed", type=float, default=None)
    parser.add_argument("--seed", type=int, default=20261106)
    parser.add_argument("--out", help="Output WAV path for a single scene.")
    parser.add_argument("--reference-audio", help="Optional reference WAV override.")
    parser.add_argument("--whisper-model", default="base.en")
    parser.add_argument("--json", action="store_true", help="Print machine-readable JSON.")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    service = VoiceService(
        profile_id=args.profile,
        engine_id=args.engine,
        align_subtitles=not args.no_subtitles,
        whisper_model=args.whisper_model,
    )

    if args.status:
        print(json.dumps(service.status(), indent=2))
        return 0

    if args.script:
        try:
            metadata = service.generate_voiceover(
                script_path=Path(args.script),
                slug=args.slug,
                output_format=args.format,
                make_mp3=not args.no_mp3,
                force=args.force,
            )
        except Exception as error:
            print(json.dumps({"ok": False, "error": str(error)}, indent=2), file=sys.stderr)
            return 1
        print(json.dumps(metadata, indent=2))
        return 0

    if not args.text:
        print("Provide --status, --script, or --text.", file=sys.stderr)
        return 2

    output = Path(args.out) if args.out else None
    result = service.generate_scene(
        text=args.text,
        scene_id=args.scene_id,
        preset=args.preset,
        emotion=args.emotion,
        speed=args.speed,
        output_format=args.format,
        output_path=output,
        reference_audio=Path(args.reference_audio) if args.reference_audio else None,
        seed=args.seed,
        with_subtitles=not args.no_subtitles,
    )
    payload = summarize_result(result)
    print(json.dumps(payload, indent=2) if args.json else json.dumps(payload, indent=2))
    return 0 if result.ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
