"""OpenVoice V2 tone-colour conversion with a Nigerian English base voice.

OpenVoice V2 (MIT) is used as a commercially-cleared fallback. It transfers the
timbre of David's reference onto a base read from Microsoft Edge TTS's Nigerian
English voice (`en-NG-AbeoNeural`). The base TTS is a cloud service, so review
Microsoft's terms before monetised use; the default Chatterbox engine is fully
local.
"""
from __future__ import annotations

import asyncio
import hashlib
import os
import sys
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

from ..audio import AudioError, run, write_wav
from .base import (
    EngineCapabilities,
    EngineSynthesis,
    SynthesisSettings,
    VoiceProfile,
)

_PROJECT_ROOT = Path(__file__).resolve().parents[2]
_MODEL_ROOT = Path(os.environ.get("VOICE_MODEL_ROOT", _PROJECT_ROOT / "models"))
_CACHE_ROOT = Path(os.environ.get("VOICE_CACHE_DIR", _PROJECT_ROOT / "voice" / "cache"))
_VENDOR = _PROJECT_ROOT / "voice" / "vendor" / "OpenVoice"
_CONVERTER = None


class OpenVoiceV2Engine:
    id = "openvoice_v2"
    display_name = "OpenVoice V2 + Edge en-NG base"
    capabilities = EngineCapabilities(
        emotion=False,
        speed=True,
        exaggeration=False,
        reference_audio=True,
        reference_text=False,
        word_timings=False,
        seed=False,
        sample_rate=22050,
        commercial_use=True,
        license_name="MIT (OpenVoice V2) / Microsoft Edge TTS terms for the base voice",
        license_url="https://github.com/myshell-ai/OpenVoice",
        weights_license="MIT",
        notes=(
            "Tone-colour cloning only. Accent comes from the en-NG-AbeoNeural base. "
            "The base TTS is a cloud service, so this engine is a fallback rather "
            "than the fully local default. Identity similarity is lower than "
            "Chatterbox/XTTS."
        ),
    )

    def _model_dir(self) -> Path:
        return Path(os.environ.get("OPENVOICE_MODEL_DIR", _MODEL_ROOT / "openvoice-v2"))

    def _load(self):
        global _CONVERTER
        if _CONVERTER is not None:
            return _CONVERTER
        directory = self._model_dir()
        required = ["checkpoint.pth", "config.json"]
        missing = [name for name in required if not (directory / name).is_file()]
        if missing:
            raise AudioError(
                f"OpenVoice V2 files are missing in {directory}: {', '.join(missing)}."
            )
        if str(_VENDOR) not in sys.path:
            sys.path.insert(0, str(_VENDOR))
        try:
            from openvoice.api import ToneColorConverter
        except Exception as error:  # pragma: no cover - import diagnostics
            raise AudioError(f"Could not import the vendored OpenVoice package: {error}") from error

        converter = ToneColorConverter(
            config_path=str(directory / "config.json"),
            device="cpu",
            enable_watermark=False,
        )
        converter.load_ckpt(str(directory / "checkpoint.pth"))
        _CONVERTER = converter
        return converter

    def synthesize(
        self,
        text: str,
        profile: VoiceProfile,
        settings: SynthesisSettings,
        output_wav: Path,
    ) -> EngineSynthesis:
        converter = self._load()
        reference = profile.effective_reference
        if not reference.is_file():
            raise AudioError(f"Voice reference not found: {reference}")
        if not _VENDOR.is_dir():
            raise AudioError(
                "OpenVoice V2 source is not vendored. Run: "
                "git clone https://github.com/myshell-ai/OpenVoice.git voice/vendor/OpenVoice"
            )

        base_voice = str(settings.extra.get("openvoiceBaseVoice", "en-NG-AbeoNeural"))
        base_rate = str(settings.extra.get("openvoiceRate", "+0%"))
        base_pitch = str(settings.extra.get("openvoicePitch", "-2Hz"))
        tau = float(settings.extra.get("openvoiceTau", 0.7))

        with tempfile.TemporaryDirectory(prefix="openvoice-") as temporary:
            temporary_path = Path(temporary)
            base_mp3 = temporary_path / "base.mp3"
            base_wav = temporary_path / "base.wav"
            _edge_tts(text, base_voice, base_rate, base_pitch, base_mp3)
            run(
                [
                    "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                    "-i", str(base_mp3), "-ar", "22050", "-ac", "1",
                    "-c:a", "pcm_s16le", str(base_wav),
                ]
            )
            source_embedding = converter.extract_se(str(base_wav))
            target_embedding = _target_embedding(converter, reference)
            converter.convert(
                str(base_wav),
                source_embedding,
                target_embedding,
                str(output_wav),
                tau=tau,
            )

        samples, sample_rate = sf.read(str(output_wav), dtype="float32", always_2d=False)
        if samples.ndim > 1:
            samples = samples[:, 0]
        if samples.size == 0:
            raise AudioError("OpenVoice V2 returned empty audio.")
        write_wav(output_wav, samples, int(sample_rate), subtype="PCM_16")
        return EngineSynthesis(
            wav_path=output_wav,
            sample_rate=int(sample_rate),
            duration_seconds=len(samples) / int(sample_rate),
            settings={
                "engine": self.id,
                "model": "openvoice-v2",
                "reference": str(reference),
                "baseVoice": base_voice,
                "baseRate": base_rate,
                "basePitch": base_pitch,
                "tau": tau,
            },
            warnings=[
                "OpenVoice V2 clones timbre, not accent. The Nigerian accent comes from the Edge TTS base voice.",
                "Edge TTS is an online service; review Microsoft's terms before commercial use.",
            ],
        )


def _target_embedding(converter, reference: Path):
    digest = hashlib.sha256(reference.read_bytes()).hexdigest()[:16]
    cache_dir = _CACHE_ROOT / "openvoice"
    cache_dir.mkdir(parents=True, exist_ok=True)
    cache_path = cache_dir / f"target-{digest}.pt"
    if cache_path.is_file():
        return __import__("torch").load(str(cache_path), map_location="cpu")
    import torch

    embedding = converter.extract_se(str(reference))
    torch.save(embedding, str(cache_path))
    return embedding


def _edge_tts(text: str, voice: str, rate: str, pitch: str, target: Path) -> None:
    try:
        import edge_tts
    except ImportError as error:
        raise AudioError("edge-tts is not installed in the voice environment.") from error

    async def _save() -> None:
        communicator = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch)
        await communicator.save(str(target))

    try:
        asyncio.run(_save())
    except Exception as error:
        raise AudioError(f"Edge TTS base voice failed: {error}") from error
    if not target.is_file() or target.stat().st_size == 0:
        raise AudioError("Edge TTS returned an empty base audio file.")
