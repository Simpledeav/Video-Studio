"""PocketTTS (Kyutai) through sherpa-onnx.

This is the CPU-first commercial engine: 100M parameters, int8 ONNX, zero-shot
voice cloning from a reference WAV, no reference transcript. Model weights are
CC BY 4.0; the sherpa-onnx runtime is Apache-2.0.
"""
from __future__ import annotations

import os
from pathlib import Path

import numpy as np
import soundfile as sf

from ..audio import AudioError, write_wav
from ..text import chunk_text
from .base import (
    EngineCapabilities,
    EngineSynthesis,
    SynthesisSettings,
    VoiceProfile,
)

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_MODEL_ROOT = Path(os.environ.get("VOICE_MODEL_ROOT", _PROJECT_ROOT / "models"))
_TTS = None
_MODEL_SIGNATURE: tuple[str, ...] | None = None


class PocketTTSEngine:
    id = "pocket_tts"
    display_name = "PocketTTS 100M (sherpa-onnx int8)"
    capabilities = EngineCapabilities(
        emotion=False,
        speed=True,
        exaggeration=False,
        reference_audio=True,
        reference_text=False,
        word_timings=False,
        seed=False,
        sample_rate=24000,
        commercial_use=True,
        license_name="CC BY 4.0 (model weights) / Apache-2.0 (sherpa-onnx)",
        license_url="https://huggingface.co/kyutai/pocket-tts",
        weights_license="CC-BY-4.0",
        notes=(
            "No emotion or exaggeration control. Delivery presets change speed, "
            "silence scale, quality steps and sentence segmentation. Voice clone "
            "identity is moderate on this reference; use Chatterbox when maximum "
            "identity is required."
        ),
    )

    def _model_dir(self) -> Path:
        return Path(os.environ.get("POCKET_TTS_MODEL_DIR", _MODEL_ROOT / "pocket-tts"))

    def _load(self):
        global _TTS, _MODEL_SIGNATURE
        import sherpa_onnx

        directory = self._model_dir()
        required = [
            directory / "lm_flow.int8.onnx",
            directory / "lm_main.int8.onnx",
            directory / "encoder.onnx",
            directory / "decoder.int8.onnx",
            directory / "text_conditioner.onnx",
            directory / "vocab.json",
            directory / "token_scores.json",
        ]
        missing = [str(path) for path in required if not path.is_file()]
        if missing:
            raise AudioError(
                "PocketTTS model files are missing:\n  "
                + "\n  ".join(missing)
                + "\nRun voice/install.sh (or download sherpa-onnx-pocket-tts-int8-2026-01-26)."
            )
        signature = tuple(str(path) for path in required)
        if _TTS is None or _MODEL_SIGNATURE != signature:
            config = sherpa_onnx.OfflineTtsConfig(
                model=sherpa_onnx.OfflineTtsModelConfig(
                    pocket=sherpa_onnx.OfflineTtsPocketModelConfig(
                        lm_flow=str(required[0]),
                        lm_main=str(required[1]),
                        encoder=str(required[2]),
                        decoder=str(required[3]),
                        text_conditioner=str(required[4]),
                        vocab_json=str(required[5]),
                        token_scores_json=str(required[6]),
                        voice_embedding_cache_capacity=8,
                    ),
                    num_threads=max(2, min(4, os.cpu_count() or 2)),
                    provider="cpu",
                    debug=False,
                )
            )
            if not config.validate():
                raise AudioError("PocketTTS configuration did not validate.")
            _TTS = sherpa_onnx.OfflineTts(config)
            _MODEL_SIGNATURE = signature
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

        reference_samples, reference_rate = sf.read(str(reference), dtype="float32", always_2d=False)
        if reference_samples.ndim > 1:
            reference_samples = reference_samples[:, 0]
        if reference_samples.size == 0:
            raise AudioError(f"Voice reference is empty: {reference}")

        chunks = chunk_text(text, max_words=34)
        if not chunks:
            raise AudioError("Cannot synthesize empty text.")

        pieces: list[np.ndarray] = []
        pause_seconds = max(0.0, 0.18 * float(settings.silence_scale))
        sample_rate = int(getattr(tts, "sample_rate", 24000) or 24000)

        for chunk in chunks:
            generation = _generation_config(
                reference_samples,
                reference_rate,
                speed=float(settings.speed),
                silence_scale=float(settings.silence_scale),
                num_steps=int(settings.num_steps),
            )
            audio = tts.generate(chunk, generation)
            samples = np.asarray(audio.samples, dtype=np.float32)
            if samples.size == 0:
                raise AudioError(f"PocketTTS returned no audio for chunk: {chunk[:80]!r}")
            sample_rate = int(audio.sample_rate)
            samples = _edge_fade(samples, sample_rate)
            pieces.append(samples)
            if pause_seconds > 0:
                pieces.append(np.zeros(int(round(pause_seconds * sample_rate)), dtype=np.float32))

        combined = np.concatenate(pieces[:-1] if pieces and pieces[-1].size == 0 else pieces)
        write_wav(output_wav, combined, sample_rate, subtype="PCM_16")

        return EngineSynthesis(
            wav_path=output_wav,
            sample_rate=sample_rate,
            duration_seconds=len(combined) / sample_rate,
            settings={
                "engine": self.id,
                "model": "pocket-tts-int8-2026-01-26",
                "reference": str(reference),
                "chunks": len(chunks),
                "pauseSeconds": round(pause_seconds, 3),
                "requestedSpeed": settings.speed,
                "numSteps": settings.num_steps,
                "silenceScale": settings.silence_scale,
            },
            warnings=[
                "PocketTTS has no emotion/exaggeration control; the preset was applied through pace, pauses and sentence segmentation."
            ],
        )


def _generation_config(
    reference_samples: np.ndarray,
    reference_rate: int,
    *,
    speed: float,
    silence_scale: float,
    num_steps: int,
):
    import sherpa_onnx

    config = sherpa_onnx.GenerationConfig()
    config.reference_audio = np.ascontiguousarray(reference_samples, dtype=np.float32)
    config.reference_sample_rate = int(reference_rate)
    config.num_steps = int(max(4, min(20, num_steps)))
    config.speed = float(max(0.80, min(1.20, speed)))
    config.silence_scale = float(max(0.6, min(1.6, silence_scale)))
    return config


def _edge_fade(samples: np.ndarray, sample_rate: int, milliseconds: float = 6.0) -> np.ndarray:
    count = min(samples.size // 2, max(1, int(sample_rate * milliseconds / 1000)))
    if count <= 0:
        return samples
    window = np.linspace(0.0, 1.0, count, dtype=np.float32)
    samples = samples.copy()
    samples[:count] *= window
    samples[-count:] *= window[::-1]
    return samples
