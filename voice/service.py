"""Reusable voice-generation service.

Public API:
    service = VoiceService(profile_id="david_nigerian_english", engine_id="chatterbox_onnx")
    result = service.generate_scene(text="...", scene_id="hook", preset="documentary_hook")
    batch = service.generate_voiceover(script_path="content/demo-voice-scenes.json")

The service owns the cache, pronunciation pass, post-production chain, subtitle
alignment and metadata. Engines only turn text into a raw WAV.
"""
from __future__ import annotations

import hashlib
import json
import shutil
import tempfile
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

from . import audio
from .alignment import (
    WordTiming,
    align_script,
    build_cues,
    cues_to_vtt,
    offset_cues,
    offset_words,
    transcribe_words,
)
from .engines import engine_summary, get_engine, resolve_default_engine
from .engines.base import EngineSynthesis, SynthesisSettings, VoiceProfile
from .text import prepare_text, split_sentences, word_count

PROJECT_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = PROJECT_ROOT / "public"
VOICE_ROOT = PROJECT_ROOT / "voice"
DEFAULT_CACHE_ROOT = Path(__import__("os").environ.get("VOICE_CACHE_DIR", VOICE_ROOT / "cache"))


@dataclass
class GenerationResult:
    ok: bool
    audio_path: Path | None = None
    mp3_path: Path | None = None
    duration_seconds: float = 0.0
    metadata: dict[str, Any] = field(default_factory=dict)
    cached: bool = False
    error: str | None = None


def _public_path(value: str | Path) -> Path:
    raw = str(value)
    if raw.startswith("/") and not raw.startswith("//"):
        return PUBLIC_ROOT / raw.lstrip("/")
    path = Path(value)
    if path.is_absolute():
        return path
    if path.exists():
        return path
    return PUBLIC_ROOT / path


def _asset_url(path: Path) -> str:
    try:
        relative = path.resolve().relative_to(PUBLIC_ROOT.resolve())
        return "/" + relative.as_posix()
    except ValueError:
        return str(path)


def load_json(path: Path) -> dict[str, Any]:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, payload: dict[str, Any]) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return path


def load_presets() -> dict[str, Any]:
    return load_json(VOICE_ROOT / "presets.json")["presets"]


def load_pronunciations() -> list[dict[str, str]]:
    path = VOICE_ROOT / "pronunciations.json"
    if not path.is_file():
        return []
    return list(load_json(path).get("entries", []))


def load_profile(profile_id: str) -> VoiceProfile:
    candidates = [
        VOICE_ROOT / "profiles" / profile_id / "profile.json",
        PUBLIC_ROOT / "audio" / "voice-profile" / profile_id / "profile.json",
    ]
    path = next((candidate for candidate in candidates if candidate.is_file()), None)
    if path is None:
        raise FileNotFoundError(f"Voice profile '{profile_id}' was not found in {candidates}")
    raw = load_json(path)
    reference = raw["reference"]
    engine_clip = _public_path(reference.get("engineClip") or reference.get("clean") or reference["original"])
    if not engine_clip.is_file():
        engine_clip = _public_path(reference.get("clean") or reference["original"])
    if not engine_clip.is_file():
        engine_clip = _public_path(reference["original"])
    transcript_path = _public_path(reference.get("transcript", ""))
    transcript = transcript_path.read_text(encoding="utf-8").strip() if transcript_path.is_file() else ""
    return VoiceProfile(
        id=raw["id"],
        display_name=raw["displayName"],
        language=raw.get("speaker", {}).get("language", "en-NG"),
        accent=raw.get("speaker", {}).get("accent", "Nigerian English"),
        gender=raw.get("speaker", {}).get("gender", "male"),
        reference_wav=engine_clip,
        reference_text=transcript,
        raw=raw,
    )


class VoiceService:
    def __init__(
        self,
        *,
        profile_id: str = "david_nigerian_english",
        engine_id: str | None = None,
        cache_root: Path | None = None,
        align_subtitles: bool = True,
        whisper_model: str = "base.en",
    ) -> None:
        self.profile = load_profile(profile_id)
        self.engine_id = resolve_default_engine(self.profile.raw, engine_id)
        self.engine = get_engine(self.engine_id)
        self.presets = load_presets()
        self.pronunciations = load_pronunciations()
        self.cache_root = Path(cache_root or DEFAULT_CACHE_ROOT)
        self.align_subtitles = align_subtitles
        self.whisper_model = whisper_model

    # ------------------------------------------------------------------
    # Settings
    # ------------------------------------------------------------------
    def build_settings(
        self,
        *,
        preset: str = "business_explanation",
        emotion: str | None = None,
        delivery_style: str = "cinematic documentary",
        speed: float | None = None,
        seed: int = 20261106,
        extra: dict[str, Any] | None = None,
    ) -> SynthesisSettings:
        if preset not in self.presets:
            raise ValueError(
                f"Unknown delivery preset '{preset}'. Available: {', '.join(self.presets)}"
            )
        preset_data = self.presets[preset]
        effective_speed = float(speed if speed is not None else preset_data.get("speed", 1.0))
        effective_speed = max(0.85, min(1.15, effective_speed))
        settings = SynthesisSettings(
            preset=preset,
            emotion=emotion or preset_data["label"],
            delivery_style=delivery_style,
            speed=effective_speed,
            silence_scale=float(preset_data.get("silenceScale", 1.0)),
            num_steps=int(preset_data.get("numSteps", 8)),
            exaggeration=float(preset_data.get("exaggeration", 0.5)),
            cfg_weight=float(preset_data.get("cfgWeight", 0.5)),
            seed=int(seed),
            extra={
                "presetLabel": preset_data["label"],
                "presetDescription": preset_data["description"],
                "punctuationGuidance": preset_data["punctuation"],
                "maxSentenceWords": preset_data["maxSentenceWords"],
                "openvoiceRate": preset_data.get("openvoiceRate", "+0%"),
                "openvoicePitch": preset_data.get("openvoicePitch", "-2Hz"),
                **(extra or {}),
            },
        )
        return settings

    # ------------------------------------------------------------------
    # Generation
    # ------------------------------------------------------------------
    def generate_scene(
        self,
        *,
        text: str,
        scene_id: str,
        preset: str = "business_explanation",
        emotion: str | None = None,
        delivery_style: str = "cinematic documentary",
        speed: float | None = None,
        output_format: str = "wav",
        output_path: Path | None = None,
        reference_audio: Path | None = None,
        pronunciation_dictionary: dict[str, str] | None = None,
        seed: int = 20261106,
        with_subtitles: bool | None = None,
    ) -> GenerationResult:
        settings = self.build_settings(
            preset=preset,
            emotion=emotion,
            delivery_style=delivery_style,
            speed=speed,
            seed=seed,
            extra={"sceneId": scene_id},
        )
        entries = list(self.pronunciations)
        if pronunciation_dictionary:
            entries.extend(
                {"term": term, "spoken": spoken}
                for term, spoken in pronunciation_dictionary.items()
            )
        spoken_text = prepare_text(text, entries)
        return self._generate(
            display_text=text,
            spoken_text=spoken_text,
            scene_id=scene_id,
            settings=settings,
            output_format=output_format,
            output_path=output_path,
            reference_audio=reference_audio,
            with_subtitles=with_subtitles,
        )

    def _cache_key(
        self,
        *,
        spoken_text: str,
        settings: SynthesisSettings,
        reference: Path,
    ) -> str:
        payload = {
            "engine": self.engine_id,
            "engineVersion": self.engine.capabilities.notes,
            "profile": self.profile.id,
            "referenceSha": _sha256(reference),
            "text": spoken_text,
            "settings": settings.as_dict(),
            "postChain": self.profile.raw.get("delivery", {}).get("postChain", []),
        }
        return hashlib.sha256(json.dumps(payload, sort_keys=True).encode("utf-8")).hexdigest()

    def _generate(
        self,
        *,
        display_text: str,
        spoken_text: str,
        scene_id: str,
        settings: SynthesisSettings,
        output_format: str,
        output_path: Path | None,
        reference_audio: Path | None,
        with_subtitles: bool | None,
    ) -> GenerationResult:
        reference = Path(reference_audio) if reference_audio else self.profile.effective_reference
        if not reference.is_file():
            return GenerationResult(
                ok=False,
                error=f"Voice reference audio not found: {reference}",
                metadata={"sceneId": scene_id, "profile": self.profile.id, "engine": self.engine_id},
            )
        cache_key = self._cache_key(spoken_text=spoken_text, settings=settings, reference=reference)
        cache_dir = self.cache_root / "audio" / self.profile.id / self.engine_id / cache_key[:2]
        cached_wav = cache_dir / f"{cache_key}.wav"
        cached_json = cache_dir / f"{cache_key}.json"
        output = Path(output_path) if output_path else None
        generated_at = datetime.now(timezone.utc).isoformat()
        warnings: list[str] = []
        cached = False

        try:
            if cached_wav.is_file() and cached_json.is_file():
                cached = True
                info = load_json(cached_json)
                duration = float(info.get("durationSeconds") or audio.probe_duration(cached_wav))
                warnings = list(info.get("warnings", []))
                if output:
                    output.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(cached_wav, output)
                else:
                    output = cached_wav
                metadata = info
            else:
                cache_dir.mkdir(parents=True, exist_ok=True)
                with tempfile.TemporaryDirectory(prefix="voice-") as temporary:
                    temporary_path = Path(temporary)
                    raw_wav = temporary_path / "raw.wav"
                    synthesis: EngineSynthesis = self.engine.synthesize(
                        spoken_text,
                        self.profile,
                        settings,
                        raw_wav,
                    )
                    warnings.extend(synthesis.warnings)
                    atempo = self._tempo_filter(settings)
                    if atempo:
                        warnings.append(
                            f"Applied a {atempo:.3f}x tempo correction because {self.engine_id} has no native speed control."
                        )
                    filter_chain = list(self.profile.raw.get("delivery", {}).get("postChain", []))
                    if atempo:
                        filter_chain.insert(0, f"atempo={atempo:.4f}")
                    master = temporary_path / "master.wav"
                    audio.normalize_master(
                        synthesis.wav_path,
                        master,
                        filter_chain=filter_chain,
                        sample_rate=48000,
                        subtype="PCM_24",
                    )
                    shutil.copy2(master, cached_wav)
                    duration = audio.probe_duration(cached_wav)
                    loudness = audio.measure_loudness(cached_wav)
                    if output:
                        output.parent.mkdir(parents=True, exist_ok=True)
                        shutil.copy2(cached_wav, output)
                    else:
                        output = cached_wav

                    metadata = {
                        "schemaVersion": "1.0.0",
                        "generatedAt": generated_at,
                        "sceneId": scene_id,
                        "text": display_text,
                        "spokenText": spoken_text,
                        "profile": {
                            "id": self.profile.id,
                            "displayName": self.profile.display_name,
                            "language": self.profile.language,
                            "accent": self.profile.accent,
                            "reference": _asset_url(reference),
                        },
                        "engine": {
                            "id": self.engine_id,
                            "name": self.engine.display_name,
                            "license": self.engine.capabilities.license_name,
                            "commercialUse": self.engine.capabilities.commercial_use,
                        },
                        "settings": {
                            **settings.as_dict(),
                            "engineSettings": synthesis.settings,
                        },
                        "cacheKey": cache_key,
                        "durationSeconds": round(duration, 3),
                        "sampleRate": 48000,
                        "channels": 1,
                        "format": "wav",
                        "master": {
                            "codec": "pcm_s24le",
                            "integratedLufs": loudness["integrated_lufs"],
                            "truePeakDbfs": loudness["true_peak_dbfs"],
                        },
                        "warnings": warnings,
                    }
                    write_json(cached_json, metadata)
                cached = False

            if output is None:
                raise RuntimeError("No output path was resolved.")

            mp3_path: Path | None = None
            if output_format.lower() in {"mp3", "both"} or output.suffix.lower() == ".mp3":
                mp3_target = output.with_suffix(".mp3")
                audio.to_mp3(output, mp3_target)
                mp3_path = mp3_target

            result_metadata = dict(metadata)
            result_metadata.update(
                {
                    "cached": cached,
                    "audioPath": _asset_url(output),
                    "mp3Path": _asset_url(mp3_path) if mp3_path else None,
                    "durationSeconds": round(duration, 3),
                    "sceneId": scene_id,
                }
            )

            if (with_subtitles if with_subtitles is not None else self.align_subtitles):
                try:
                    words = self.align_audio(output, display_text)
                    cues = build_cues(words)
                    result_metadata["words"] = [word.as_dict() for word in words]
                    result_metadata["cues"] = cues
                except Exception as error:  # subtitle failure must not lose the audio
                    warnings.append(f"Subtitle alignment failed: {error}")
                    result_metadata["warnings"] = warnings

            if output.suffix.lower() == ".mp3" and mp3_path is None:
                mp3_path = output
            return GenerationResult(
                ok=True,
                audio_path=output,
                mp3_path=mp3_path,
                duration_seconds=round(duration, 3),
                metadata=result_metadata,
                cached=cached,
            )
        except Exception as error:
            return GenerationResult(
                ok=False,
                error=str(error),
                metadata={
                    "sceneId": scene_id,
                    "profile": self.profile.id,
                    "engine": self.engine_id,
                    "text": display_text,
                    "cached": False,
                },
            )

    def _tempo_filter(self, settings: SynthesisSettings) -> float | None:
        if self.engine.capabilities.speed:
            return None
        if abs(settings.speed - 1.0) < 0.02:
            return None
        # Chatterbox has no native speed control. Cap the correction so the
        # narrator never sounds time-stretched.
        return max(0.94, min(1.06, float(settings.speed)))

    def align_audio(self, audio_path: Path, display_text: str) -> list[WordTiming]:
        words = transcribe_words(
            audio_path,
            model_size=self.whisper_model,
            model_root=PROJECT_ROOT / "models" / "whisper",
        )
        return align_script(display_text, words)

    # ------------------------------------------------------------------
    # Batch
    # ------------------------------------------------------------------
    def generate_voiceover(
        self,
        *,
        script_path: Path,
        slug: str | None = None,
        output_format: str = "wav",
        make_mp3: bool = True,
        force: bool = False,
    ) -> dict[str, Any]:
        script = load_json(script_path)
        slug = slug or script["slug"]
        output_dir = PUBLIC_ROOT / "audio" / "voiceovers" / slug
        output_dir.mkdir(parents=True, exist_ok=True)
        scenes = script.get("scenes", [])
        if not scenes:
            raise ValueError(f"No scenes in {script_path}")
        lead_in = float(script.get("leadInSeconds", 0.25))
        default_gap = float(script.get("sceneGapSeconds", 0.2))
        target_total = script.get("targetDurationSeconds")
        warnings: list[str] = []
        scene_records: list[dict[str, Any]] = []
        full_parts: list[Path] = []
        all_words: list[WordTiming] = []
        all_cues: list[dict[str, Any]] = []
        cursor = lead_in

        with tempfile.TemporaryDirectory(prefix="voiceover-") as temporary:
            temporary_path = Path(temporary)
            if lead_in > 0:
                lead_path = temporary_path / "lead.wav"
                audio.make_silence(lead_path, lead_in, 48000)
                full_parts.append(lead_path)

            for index, scene in enumerate(scenes, start=1):
                scene_id = str(scene.get("id") or f"scene-{index:03d}")
                text = str(scene["text"]).strip()
                preset = str(scene.get("preset", "business_explanation"))
                scene_wav = output_dir / f"scene-{index:03d}.wav"
                result = self.generate_scene(
                    text=text,
                    scene_id=scene_id,
                    preset=preset,
                    emotion=scene.get("emotion"),
                    delivery_style=scene.get("deliveryStyle", "cinematic documentary"),
                    speed=scene.get("speed"),
                    output_format="wav",
                    output_path=scene_wav,
                    pronunciation_dictionary=scene.get("pronunciations"),
                    seed=int(scene.get("seed", script.get("seed", 20261106))),
                    with_subtitles=True,
                )
                if not result.ok:
                    raise RuntimeError(f"Scene {scene_id} failed: {result.error}")

                scene_words = [
                    WordTiming(**word) for word in result.metadata.get("words", [])
                ]
                scene_cues = result.metadata.get("cues", [])
                scene_words = offset_words(scene_words, cursor)
                scene_cues = offset_cues(scene_cues, cursor)
                all_words.extend(scene_words)
                all_cues.extend(scene_cues)
                full_parts.append(scene_wav)

                target_seconds = scene.get("targetSeconds")
                duration = result.duration_seconds
                review = None
                if target_seconds is not None and duration > float(target_seconds) + 0.35:
                    review = (
                        f"Scene '{scene_id}' runs {duration - float(target_seconds):.2f}s "
                        f"longer than its {float(target_seconds):.2f}s target; scene timing must expand."
                    )
                    warnings.append(review)
                scene_records.append(
                    {
                        "id": scene_id,
                        "index": index,
                        "text": text,
                        "preset": preset,
                        "startSeconds": round(cursor, 3),
                        "endSeconds": round(cursor + duration, 3),
                        "durationSeconds": round(duration, 3),
                        "targetSeconds": target_seconds,
                        "audioPath": _asset_url(scene_wav),
                        "cacheKey": result.metadata.get("cacheKey"),
                        "cached": result.cached,
                        "review": review,
                    }
                )
                cursor += duration

                gap = float(scene.get("gapAfterSeconds", default_gap))
                if index < len(scenes) and gap > 0:
                    gap_path = temporary_path / f"gap-{index:03d}.wav"
                    audio.make_silence(gap_path, gap, 48000)
                    full_parts.append(gap_path)
                    cursor += gap

            tail = float(script.get("tailSeconds", 0.45))
            if tail > 0:
                tail_path = temporary_path / "tail.wav"
                audio.make_silence(tail_path, tail, 48000)
                full_parts.append(tail_path)

            full_wav = output_dir / "voiceover-full.wav"
            audio.concat_wavs(full_parts, full_wav, 48000)
            full_mp3 = output_dir / "voiceover-full.mp3"
            if make_mp3 or output_format.lower() in {"mp3", "both"}:
                audio.to_mp3(full_wav, full_mp3)
            duration = audio.probe_duration(full_wav)

            # Sanity: the assembled audio must match the scene arithmetic.
            expected = cursor + tail
            if abs(duration - expected) > 0.35:
                warnings.append(
                    f"Assembled duration {duration:.2f}s differs from scene arithmetic {expected:.2f}s."
                )

            words_path = output_dir / "voiceover.words.json"
            cues_path = output_dir / "voiceover.cues.json"
            vtt_path = output_dir / "voiceover.vtt"
            write_json(
                words_path,
                {
                    "schemaVersion": "1.0.0",
                    "slug": slug,
                    "words": [word.as_dict() for word in all_words],
                },
            )
            write_json(
                cues_path,
                {"schemaVersion": "1.0.0", "slug": slug, "cues": all_cues},
            )
            vtt_path.write_text(cues_to_vtt(all_cues) + "\n", encoding="utf-8")

            needs_review = bool(warnings)
            metadata = {
                "schemaVersion": "1.0.0",
                "slug": slug,
                "title": script.get("title", slug),
                "generatedAt": datetime.now(timezone.utc).isoformat(),
                "profile": {
                    "id": self.profile.id,
                    "displayName": self.profile.display_name,
                    "language": self.profile.language,
                    "accent": self.profile.accent,
                    "reference": _asset_url(self.profile.effective_reference),
                },
                "engine": {
                    "id": self.engine_id,
                    "name": self.engine.display_name,
                    "license": self.engine.capabilities.license_name,
                    "commercialUse": self.engine.capabilities.commercial_use,
                },
                "totalDurationSeconds": round(duration, 3),
                "leadInSeconds": lead_in,
                "sceneGapSeconds": default_gap,
                "targetDurationSeconds": target_total,
                "scenes": scene_records,
                "files": {
                    "fullWav": _asset_url(full_wav),
                    "fullMp3": _asset_url(full_mp3) if full_mp3.is_file() else None,
                    "words": _asset_url(words_path),
                    "cues": _asset_url(cues_path),
                    "vtt": _asset_url(vtt_path),
                    "metadata": _asset_url(output_dir / "voiceover-metadata.json"),
                },
                "review": {
                    "needsReview": needs_review,
                    "warnings": warnings,
                    "rule": "Narration is never time-stretched to fit a scene. Expand the scene or approve the flagged read.",
                },
                "quality": {
                    "integratedLufs": audio.measure_loudness(full_wav)["integrated_lufs"],
                    "truePeakDbfs": audio.measure_loudness(full_wav)["true_peak_dbfs"],
                    "clippedSamples": audio.audio_stats(full_wav)["clipped_samples"],
                },
            }
            metadata_path = output_dir / "voiceover-metadata.json"
            write_json(metadata_path, metadata)
            # A small pointer beside the script makes the apply-timing step
            # independent of the absolute project path.
            write_json(script_path.with_suffix(".generated.json"), {
                "slug": slug,
                "metadata": _asset_url(metadata_path),
                "totalDurationSeconds": metadata["totalDurationSeconds"],
            })
            return metadata

    # ------------------------------------------------------------------
    # Diagnostics
    # ------------------------------------------------------------------
    def status(self) -> dict[str, Any]:
        return {
            "profile": {
                "id": self.profile.id,
                "displayName": self.profile.display_name,
                "reference": str(self.profile.effective_reference),
                "referenceExists": self.profile.effective_reference.is_file(),
            },
            "engine": {
                "id": self.engine_id,
                "name": self.engine.display_name,
                "commercialUse": self.engine.capabilities.commercial_use,
                "license": self.engine.capabilities.license_name,
            },
            "engines": engine_summary(),
            "presets": list(self.presets),
            "cacheRoot": str(self.cache_root),
        }


def _sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def summarize_result(result: GenerationResult) -> dict[str, Any]:
    return {
        "ok": result.ok,
        "audioPath": str(result.audio_path) if result.audio_path else None,
        "mp3Path": str(result.mp3_path) if result.mp3_path else None,
        "durationSeconds": result.duration_seconds,
        "cached": result.cached,
        "error": result.error,
        "metadata": result.metadata,
    }
