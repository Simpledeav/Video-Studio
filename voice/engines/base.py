"""Shared types for the local voice-cloning engines."""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Protocol


@dataclass(frozen=True)
class EngineCapabilities:
    """What an engine can actually control, not what we wish it controlled."""

    emotion: bool = False
    speed: bool = False
    exaggeration: bool = False
    reference_audio: bool = True
    reference_text: bool = False
    word_timings: bool = False
    seed: bool = False
    sample_rate: int = 24000
    commercial_use: bool = False
    license_name: str = "unknown"
    license_url: str = ""
    weights_license: str = ""
    notes: str = ""


@dataclass
class VoiceProfile:
    id: str
    display_name: str
    language: str
    accent: str
    gender: str
    reference_wav: Path
    reference_text: str
    raw: dict[str, Any]
    reference_override: Path | None = None

    @property
    def effective_reference(self) -> Path:
        return self.reference_override or self.reference_wav


@dataclass
class SynthesisSettings:
    """Normalised settings passed to every engine.

    Engines read only the keys they support. Unknown keys are ignored and kept
    in the generation metadata so the take is reproducible.
    """

    preset: str = "business_explanation"
    emotion: str = "neutral"
    delivery_style: str = "cinematic documentary"
    speed: float = 1.0
    silence_scale: float = 1.0
    num_steps: int = 8
    exaggeration: float = 0.5
    cfg_weight: float = 0.5
    temperature: float = 0.8
    top_p: float = 0.9
    repetition_penalty: float = 1.2
    seed: int = 20261106
    pronunciation_dictionary: dict[str, str] = field(default_factory=dict)
    extra: dict[str, Any] = field(default_factory=dict)

    def as_dict(self) -> dict[str, Any]:
        return {
            "preset": self.preset,
            "emotion": self.emotion,
            "deliveryStyle": self.delivery_style,
            "speed": self.speed,
            "silenceScale": self.silence_scale,
            "numSteps": self.num_steps,
            "exaggeration": self.exaggeration,
            "cfgWeight": self.cfg_weight,
            "temperature": self.temperature,
            "topP": self.top_p,
            "repetitionPenalty": self.repetition_penalty,
            "seed": self.seed,
            **self.extra,
        }


@dataclass
class EngineSynthesis:
    wav_path: Path
    sample_rate: int
    duration_seconds: float
    settings: dict[str, Any]
    warnings: list[str] = field(default_factory=list)


class VoiceEngine(Protocol):
    id: str
    display_name: str
    capabilities: EngineCapabilities

    def synthesize(
        self,
        text: str,
        profile: VoiceProfile,
        settings: SynthesisSettings,
        output_wav: Path,
    ) -> EngineSynthesis:
        ...
