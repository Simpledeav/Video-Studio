"""Engine registry."""
from __future__ import annotations

from pathlib import Path

from .base import EngineCapabilities, EngineSynthesis, SynthesisSettings, VoiceEngine, VoiceProfile
from .chatterbox_onnx import ChatterboxONNXEngine
from .openvoice_v2 import OpenVoiceV2Engine
from .pocket_tts import PocketTTSEngine
from .xtts_v2 import XTTSv2Engine

ENGINE_FACTORIES = {
    "chatterbox_onnx": ChatterboxONNXEngine,
    "pocket_tts": PocketTTSEngine,
    "openvoice_v2": OpenVoiceV2Engine,
    "xtts_v2": XTTSv2Engine,
}

# Engines that may be used for monetised work. XTTS is deliberately excluded.
COMMERCIAL_ENGINE_IDS = ("chatterbox_onnx", "pocket_tts", "openvoice_v2")
DEFAULT_ENGINE_ID = "chatterbox_onnx"


def get_engine(engine_id: str) -> VoiceEngine:
    try:
        factory = ENGINE_FACTORIES[engine_id]
    except KeyError as error:
        raise ValueError(
            f"Unknown voice engine '{engine_id}'. Available: {', '.join(ENGINE_FACTORIES)}"
        ) from error
    return factory()


def engine_summary() -> list[dict[str, object]]:
    output: list[dict[str, object]] = []
    for engine_id, factory in ENGINE_FACTORIES.items():
        engine = factory()
        capabilities: EngineCapabilities = engine.capabilities
        output.append(
            {
                "id": engine_id,
                "name": engine.display_name,
                "commercialUse": capabilities.commercial_use,
                "license": capabilities.license_name,
                "weightsLicense": capabilities.weights_license,
                "emotion": capabilities.emotion,
                "speed": capabilities.speed,
                "exaggeration": capabilities.exaggeration,
                "sampleRate": capabilities.sample_rate,
                "notes": capabilities.notes,
            }
        )
    return output


def resolve_default_engine(profile: dict, requested: str | None = None) -> str:
    if requested:
        return requested
    preference = (profile.get("enginePreference") or {}).get("default")
    if preference in ENGINE_FACTORIES:
        return preference
    return DEFAULT_ENGINE_ID
