"""Coqui XTTS v2 — evaluation-only engine.

XTTS v2 is the strongest zero-shot cloner tested on this machine, but its model
weights are released under the Coqui Public Model License (CPML), which does not
permit commercial use of the generated audio. It is kept behind an explicit
`evaluation_only` flag and is never the default for monetised videos.
"""
from __future__ import annotations

import os
from pathlib import Path

import numpy as np
import soundfile as sf

from ..audio import AudioError, write_wav
from .base import (
    EngineCapabilities,
    EngineSynthesis,
    SynthesisSettings,
    VoiceProfile,
)

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_MODEL_ROOT = Path(os.environ.get("VOICE_MODEL_ROOT", _PROJECT_ROOT / "models"))
_TTS = None


class XTTSv2Engine:
    id = "xtts_v2"
    display_name = "Coqui XTTS v2 (CPU, evaluation only)"
    capabilities = EngineCapabilities(
        emotion=False,
        speed=True,
        exaggeration=False,
        reference_audio=True,
        reference_text=False,
        word_timings=False,
        seed=False,
        sample_rate=24000,
        commercial_use=False,
        license_name="Coqui Public Model License (non-commercial model weights)",
        license_url="https://coqui.ai/cpml",
        weights_license="CPML",
        notes=(
            "Best identity similarity of the tested engines, but the CPML forbids "
            "commercial use of the model and its outputs. Evaluation/benchmark only."
        ),
    )

    def _model_dir(self) -> Path:
        return Path(os.environ.get("XTTS_MODEL_DIR", _MODEL_ROOT / "xtts-v2"))

    def _load(self):
        global _TTS
        if _TTS is not None:
            return _TTS
        os.environ.setdefault("COQUI_TOS_AGREED", "1")
        from TTS.api import TTS

        directory = self._model_dir()
        required = ["model.pth", "config.json", "vocab.json", "speakers_xtts.pth", "mel_stats.pth", "dvae.pth"]
        missing = [name for name in required if not (directory / name).is_file()]
        if missing:
            raise AudioError(
                f"XTTS v2 files are missing in {directory}: {', '.join(missing)}. "
                "Run voice/install.sh --with-evaluation-engine."
            )
        _TTS = TTS(
            model_path=str(directory),
            config_path=str(directory / "config.json"),
            gpu=False,
        )
        return _TTS

    def synthesize(
        self,
        text: str,
        profile: VoiceProfile,
        settings: SynthesisSettings,
        output_wav: Path,
    ) -> EngineSynthesis:
        tts = self._load()
        reference = profile.effective_reference
        if not reference.is_file():
            raise AudioError(f"Voice reference not found: {reference}")

        # XTTS exposes a native speed control. Keep the range conservative so the
        # delivery stays natural.
        speed = float(max(0.85, min(1.15, settings.speed)))
        try:
            tts.tts_to_file(
                text=text,
                speaker_wav=str(reference),
                language="en",
                file_path=str(output_wav),
                split_sentences=True,
                speed=speed,
            )
        except TypeError:
            tts.tts_to_file(
                text=text,
                speaker_wav=str(reference),
                language="en",
                file_path=str(output_wav),
                split_sentences=True,
            )

        samples, sample_rate = sf.read(str(output_wav), dtype="float32", always_2d=False)
        if samples.ndim > 1:
            samples = samples[:, 0]
        if samples.size == 0:
            raise AudioError("XTTS v2 returned empty audio.")
        write_wav(output_wav, samples, int(sample_rate), subtype="PCM_16")
        return EngineSynthesis(
            wav_path=output_wav,
            sample_rate=int(sample_rate),
            duration_seconds=len(samples) / int(sample_rate),
            settings={
                "engine": self.id,
                "model": "xtts-v2",
                "reference": str(reference),
                "speed": speed,
                "license": "CPML (non-commercial)",
            },
            warnings=[
                "XTTS v2 is evaluation-only: the CPML restricts commercial use of the weights and outputs."
            ],
        )
