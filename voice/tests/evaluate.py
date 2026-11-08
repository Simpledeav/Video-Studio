#!/usr/bin/env python3
"""Objective evaluation of generated voice clips.

Metrics are proxies, not proof of identity. A speaker-embedding cosine of 1.0
would mean identical embeddings, not a perfect human clone. Always listen to the
clips before publishing.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

import numpy as np

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from voice import audio  # noqa: E402
from voice.tests.quality_suite import CLIPS  # noqa: E402
from voice.text import word_count  # noqa: E402

_ECAPA = None
_WHISPER = None


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--engine", default="chatterbox_onnx")
    parser.add_argument("--dir", help="Override the clip directory.")
    parser.add_argument("--out", help="Override the report directory.")
    return parser.parse_args()


def normalise_text(value: str) -> str:
    value = value.lower().replace("’", "'")
    value = re.sub(r"([₦$£€])\s?([\d,]+)", r"\2 naira", value)
    value = re.sub(r"(\d),(\d{3})", r"\1\2", value)
    value = re.sub(r"[^a-z0-9' ]+", " ", value)
    return re.sub(r"\s+", " ", value).strip()


def get_whisper():
    global _WHISPER
    if _WHISPER is None:
        from faster_whisper import WhisperModel

        _WHISPER = WhisperModel(
            "base.en",
            device="cpu",
            compute_type="int8",
            download_root=str(PROJECT_ROOT / "models" / "whisper"),
        )
    return _WHISPER


def get_ecapa():
    global _ECAPA
    if _ECAPA is None:
        from speechbrain.pretrained import EncoderClassifier

        _ECAPA = EncoderClassifier.from_hparams(
            source="speechbrain/spkrec-ecapa-voxceleb",
            savedir=str(PROJECT_ROOT / "models" / "speechbrain" / "spkrec"),
            run_opts={"device": "cpu"},
        )
    return _ECAPA


def embed(path: Path) -> np.ndarray:
    import librosa
    import torch

    model = get_ecapa()
    samples, _ = librosa.load(str(path), sr=16000, mono=True)
    with torch.no_grad():
        embedding = model.encode_batch(torch.tensor(samples).unsqueeze(0)).squeeze().numpy()
    return embedding / max(float(np.linalg.norm(embedding)), 1e-9)


def transcribe(path: Path) -> str:
    segments, _ = get_whisper().transcribe(
        str(path), language="en", beam_size=5, vad_filter=True, condition_on_previous_text=False
    )
    return " ".join(segment.text.strip() for segment in segments).strip()


def wer(reference: str, hypothesis: str) -> float:
    try:
        import jiwer

        return float(jiwer.wer(normalise_text(reference), normalise_text(hypothesis)))
    except Exception:
        return float("nan")


def main() -> int:
    args = parse_args()
    clip_dir = Path(args.dir) if args.dir else PROJECT_ROOT / "public" / "audio" / "voice-tests" / args.engine
    out_dir = Path(args.out) if args.out else PROJECT_ROOT / "voice" / "tests" / "results"
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest_path = clip_dir / "quality-suite.json"
    manifest = json.loads(manifest_path.read_text(encoding="utf-8")) if manifest_path.is_file() else {}
    heldout = PROJECT_ROOT / "public" / "audio" / "voice-profile" / "david_nigerian_english" / "reference-heldout.wav"
    if not heldout.is_file():
        print(f"Missing held-out reference: {heldout}", file=sys.stderr)
        return 1
    reference_embedding = embed(heldout)
    records = []
    embeddings = []

    for clip in CLIPS:
        path = clip_dir / f"{clip['id']}.wav"
        if not path.is_file():
            records.append({**clip, "ok": False, "error": "missing audio"})
            continue
        stats = audio.audio_stats(path)
        loudness = audio.measure_loudness(path)
        hypothesis = transcribe(path)
        embedding = embed(path)
        embeddings.append(embedding)
        similarity = float(np.dot(reference_embedding, embedding))
        minutes = max(stats["duration_seconds"] / 60.0, 1e-6)
        record = {
            **clip,
            "ok": True,
            "durationSeconds": stats["duration_seconds"],
            "wordsPerMinute": round(word_count(clip["text"]) / minutes, 1),
            "integratedLufs": loudness["integrated_lufs"],
            "truePeakDbfs": loudness["true_peak_dbfs"],
            "silenceRatio": round(audio.silence_ratio(path), 3),
            "clippedSamples": stats["clipped_samples"],
            "transcript": hypothesis,
            "wer": round(wer(clip["expectedAsr"], hypothesis), 4),
            "speakerCosine": round(similarity, 4),
        }
        records.append(record)
        print(
            f"{clip['id']:24s} dur={record['durationSeconds']:5.2f}s "
            f"wer={record['wer']:.3f} cos={record['speakerCosine']:.3f} "
            f"lufs={record['integratedLufs']:.1f}"
        )

    consistency = None
    if len(embeddings) > 1:
        matrix = np.stack(embeddings)
        sims = matrix @ matrix.T
        count = sims.shape[0]
        consistency = float((sims.sum() - np.trace(sims)) / (count * (count - 1)))

    values = [record for record in records if record.get("ok")]
    summary = {
        "engine": args.engine,
        "clipCount": len(values),
        "meanWer": round(float(np.mean([record["wer"] for record in values])), 4) if values else None,
        "meanSpeakerCosine": round(float(np.mean([record["speakerCosine"] for record in values])), 4)
        if values
        else None,
        "meanDurationSeconds": round(float(np.mean([record["durationSeconds"] for record in values])), 2)
        if values
        else None,
        "consistencyCosine": round(consistency, 4) if consistency is not None else None,
        "meanIntegratedLufs": round(float(np.mean([record["integratedLufs"] for record in values])), 2)
        if values
        else None,
        "clippedSamples": int(sum(record["clippedSamples"] for record in values)),
    }
    report = {
        "engine": args.engine,
        "generatedAt": __import__("datetime").datetime.now(__import__("datetime").timezone.utc).isoformat(),
        "profile": "david_nigerian_english",
        "heldOutReference": str(heldout),
        "summary": summary,
        "clips": records,
        "caveats": [
            "Speaker cosine is an ECAPA speaker-verification proxy, not a measure of perceived identity.",
            "WER is computed against the expected spoken form and can be inflated by ASR number formatting.",
            "Accent retention is not objectively scored; listen to the clips and compare with the reference.",
            "No automated metric can prove that a clip is indistinguishable from a human recording.",
        ],
    }
    json_path = out_dir / f"{args.engine}-report.json"
    json_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")

    lines = [
        f"# Voice quality report — {args.engine}",
        "",
        f"Profile: `david_nigerian_english`  ",
        f"Clips: {summary['clipCount']}  ",
        f"Mean WER: {summary['meanWer']}  ",
        f"Mean speaker cosine vs held-out reference: {summary['meanSpeakerCosine']}  ",
        f"Consistency cosine across clips: {summary['consistencyCosine']}  ",
        f"Mean integrated loudness: {summary['meanIntegratedLufs']} LUFS  ",
        f"Clipped samples: {summary['clippedSamples']}",
        "",
        "| Clip | Duration | WPM | WER | Speaker cos | LUFS | Peak dBFS | Silence | Clipped |",
        "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ]
    for record in records:
        if not record.get("ok"):
            lines.append(f"| {record['id']} | — | — | — | — | — | — | — | missing |")
            continue
        lines.append(
            f"| {record['id']} | {record['durationSeconds']:.2f}s | {record['wordsPerMinute']:.0f} | "
            f"{record['wer']:.3f} | {record['speakerCosine']:.3f} | {record['integratedLufs']:.1f} | "
            f"{record['truePeakDbfs']:.2f} | {record['silenceRatio']:.2f} | {record['clippedSamples']} |"
        )
    lines += [
        "",
        "## Caveats",
        "",
        "- Speaker cosine is an ECAPA speaker-verification proxy, not a measure of perceived identity.",
        "- WER is computed against the expected spoken form and can be inflated by ASR number formatting.",
        "- Accent retention is not objectively scored; listen to the clips and compare with the reference.",
        "- No automated metric can prove that a clip is indistinguishable from a human recording.",
        "",
    ]
    markdown_path = out_dir / f"{args.engine}-report.md"
    markdown_path.write_text("\n".join(lines), encoding="utf-8")
    print(json.dumps(summary, indent=2))
    print(f"Report: {markdown_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
