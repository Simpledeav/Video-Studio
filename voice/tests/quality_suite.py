#!/usr/bin/env python3
"""Generate the eight required voice-quality clips with David's profile."""
from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from voice.service import VoiceService, write_json  # noqa: E402

CLIPS = [
    {
        "id": "01-documentary-hook",
        "label": "Engaging startup documentary hook",
        "preset": "documentary_hook",
        "text": "In 2017, a small team in Lagos made a decision that almost broke them.",
        "expectedAsr": "In 2017, a small team in Lagos made a decision that almost broke them.",
    },
    {
        "id": "02-business-explanation",
        "label": "Calm business explanation",
        "preset": "business_explanation",
        "text": "The business looked simple: buy, sell, and keep a clear record of every naira that moved.",
        "expectedAsr": "The business looked simple: buy, sell, and keep a clear record of every naira that moved.",
    },
    {
        "id": "03-tension",
        "label": "Suspenseful sentence",
        "preset": "tension",
        "text": "But the money was disappearing. Not into one big loss. Into a hundred small ones.",
        "expectedAsr": "But the money was disappearing. Not into one big loss. Into a hundred small ones.",
    },
    {
        "id": "04-revelation",
        "label": "Emotional revelation",
        "preset": "revelation",
        "text": "Then they found it. The leak was not in the market. It was in the notebook.",
        "expectedAsr": "Then they found it. The leak was not in the market. It was in the notebook.",
    },
    {
        "id": "05-reflection",
        "label": "Reflective conclusion",
        "preset": "reflection",
        "text": "Every founder learns this eventually. The product is only half the story.",
        "expectedAsr": "Every founder learns this eventually. The product is only half the story.",
    },
    {
        "id": "06-nigerian-names",
        "label": "Nigerian business name pronunciation",
        "preset": "business_explanation",
        "text": "Ngozi Okonjo-Iweala met Aliko Dangote in Lagos, and they talked about Paystack, Flutterwave, and PiggyVest.",
        "expectedAsr": "Ngozi Okonjo-Iweala met Aliko Dangote in Lagos, and they talked about Paystack, Flutterwave, and PiggyVest.",
    },
    {
        "id": "07-numbers-currency",
        "label": "Numbers, currency, dates and percentages",
        "preset": "business_explanation",
        "text": "In 2024, the company raised ₦15,500,000. That was 64 percent more than 2023.",
        "expectedAsr": "In 2024, the company raised 15,500,000 naira. That was 64 percent more than 2023.",
    },
    {
        "id": "08-conclusion",
        "label": "Confident closing line",
        "preset": "conclusion",
        "text": "Maybe the next big idea is smaller than you think. And closer than you realise.",
        "expectedAsr": "Maybe the next big idea is smaller than you think. And closer than you realise.",
    },
]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--engine",
        default="chatterbox_onnx",
        choices=["chatterbox_onnx", "pocket_tts", "openvoice_v2", "xtts_v2"],
    )
    parser.add_argument("--only", nargs="*", help="Clip ids to generate.")
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--no-mp3", action="store_true")
    parser.add_argument("--seed", type=int, default=20261106)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    service = VoiceService(engine_id=args.engine)
    output_dir = PROJECT_ROOT / "public" / "audio" / "voice-tests" / args.engine
    output_dir.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, object] = {
        "engine": args.engine,
        "engineName": service.engine.display_name,
        "license": service.engine.capabilities.license_name,
        "commercialUse": service.engine.capabilities.commercial_use,
        "profile": service.profile.id,
        "clips": [],
    }
    selected = set(args.only or [])
    for clip in CLIPS:
        if selected and clip["id"] not in selected:
            continue
        target = output_dir / f"{clip['id']}.wav"
        result = service.generate_scene(
            text=clip["text"],
            scene_id=clip["id"],
            preset=clip["preset"],
            output_format="wav",
            output_path=target,
            seed=args.seed,
            with_subtitles=True,
        )
        record = {
            **clip,
            "ok": result.ok,
            "error": result.error,
            "durationSeconds": result.duration_seconds,
            "cached": result.cached,
            "audioPath": str(target),
            "metadata": result.metadata,
        }
        manifest["clips"].append(record)  # type: ignore[union-attr]
        print(
            f"{clip['id']:24s} {'OK' if result.ok else 'FAIL'} "
            f"{result.duration_seconds:6.2f}s {'cached' if result.cached else 'new'}"
        )
        if not result.ok:
            print(f"  {result.error}", file=sys.stderr)
    write_json(output_dir / "quality-suite.json", manifest)
    return 0 if all(clip["ok"] for clip in manifest["clips"]) else 1  # type: ignore[index]


if __name__ == "__main__":
    raise SystemExit(main())
