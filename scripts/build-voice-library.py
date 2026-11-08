#!/usr/bin/env python3
"""Build the SIMPLEDEAV male deep-voice identity library.

This is the reproducible source of truth for the permanent voice identities in
``public/audio/voice-library``. It uses the Microsoft Edge Neural TTS service
through ``edge-tts`` (the same engine already used by the Notion / NVIDIA /
Scaling films in this project), then masters every clip to:

    48 kHz, 24-bit PCM, mono WAV
    -16 LUFS integrated (tolerance ~1 LU)
    true peak <= -1.5 dBTP
    speech-boundary trimmed, 65 Hz high-pass, short fades
    no reverb, no artificial echo, no voice cloning

The source service returns 24 kHz mono MP3. We document that limitation in the
manifest and QA report; we do not claim a 24 kHz source is a true 48 kHz
recording.

Usage:
    python3 scripts/build-voice-library.py
    python3 scripts/build-voice-library.py --force
    python3 scripts/build-voice-library.py --only SD_VOICE_01
    python3 scripts/build-voice-library.py --qa-only

Requirements: python3, edge-tts, ffmpeg/ffprobe.
"""

from __future__ import annotations

import argparse
import array
import asyncio
import hashlib
import json
import math
import os
import re
import shutil
import statistics
import subprocess
import sys
import tempfile
from datetime import datetime, timezone
from pathlib import Path

try:
    import edge_tts
except ImportError as exc:  # pragma: no cover - explicit environment failure
    raise SystemExit(
        "edge-tts is required. Install it with: python3 -m pip install edge-tts"
    ) from exc

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
LIB = PUBLIC / "audio" / "voice-library"
TMP = ROOT / "scripts" / ".voice-library-tmp"

SR = 48_000
TARGET_LUFS = -16.0
TRUE_PEAK_LIMIT_DB = -1.5
LIMITER_DB = -2.5  # sample-peak limit, leaves true-peak headroom
HEAD_PAD = 0.25
TAIL_PAD = 0.45
SILENCE_THRESHOLD = 0.0056  # approx -45 dBFS
MIN_DURATION = 0.4

IDENTITY_TEXT = (
    "Every successful business begins with a decision. But sometimes, the "
    "smallest decision creates the biggest problem. When thousands of customers "
    "depend on your system, one mistake can change everything. The question is "
    "not whether your business will face a challenge. The question is whether "
    "you are prepared when it happens."
)

# ---------------------------------------------------------------------------
# Permanent identities
# ---------------------------------------------------------------------------
# Base prosody is deliberately conservative. edge-tts exposes rate/pitch/volume
# only; the distinctness comes from ten different neural base voices, their
# native timbre, and a documented pitch/rate treatment. No two identities use
# the same engine voice.

VOICES = [
    {
        "voice_id": "SD_VOICE_01",
        "voice_name": "Marcus Stone",
        "folder": "SD_VOICE_01_Marcus_Stone",
        "engine_voice": "en-US-ChristopherNeural",
        "gender": "male",
        "vocal_register": "deep bass-baritone",
        "vocal_texture": "warm, rounded, slightly grainy",
        "accent": "American (General US)",
        "personality": "calm, authoritative, reassuring",
        "narration_style": (
            "premium documentary narration; measured pacing, clear diction, "
            "natural pauses, controlled emphasis"
        ),
        "emotional_strength": "Authority — calm confidence, trust, gravity",
        "primary_emotion": "authority",
        "ideal_video_types": [
            "technology documentaries",
            "company origin stories",
            "premium brand films",
            "serious explainers",
        ],
        "preferred_emotions": ["calm", "confidence", "seriousness", "dramatic"],
        "voice_description": (
            "A deep, warm, authoritative narrator with the kind of calm "
            "confidence that makes complex or high-stakes material feel "
            "under control. Clear diction and natural pauses; never rushed."
        ),
        "base_rate_percent": -4,
        "base_pitch_hz": -8,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_02",
        "voice_name": "Adrian Cross",
        "folder": "SD_VOICE_02_Adrian_Cross",
        "engine_voice": "en-US-GuyNeural",
        "gender": "male",
        "vocal_register": "deep baritone with a dark edge",
        "vocal_texture": "slightly textured, resonant, cinematic",
        "accent": "American (General US)",
        "personality": "intense, mysterious, controlled",
        "narration_style": (
            "cinematic suspense and slow-burn storytelling; deliberate pauses, "
            "restrained drama, strong sentence endings"
        ),
        "emotional_strength": "Suspense — tension, consequence, dramatic gravity",
        "primary_emotion": "suspense",
        "ideal_video_types": [
            "technology crisis stories",
            "cyber and security narratives",
            "dramatic hooks",
            "investigative documentaries",
        ],
        "preferred_emotions": ["suspense", "seriousness", "dramatic", "concern"],
        "voice_description": (
            "A deep cinematic baritone with a slightly textured edge. It is "
            "built for tension, technology crises, and stories where the next "
            "sentence carries consequence."
        ),
        "base_rate_percent": -7,
        "base_pitch_hz": -20,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_03",
        "voice_name": "Nathan Cole",
        "folder": "SD_VOICE_03_Nathan_Cole",
        "engine_voice": "en-US-AndrewMultilingualNeural",
        "gender": "male",
        "vocal_register": "rich low-mid baritone",
        "vocal_texture": "smooth, clean, polished",
        "accent": "American (General US)",
        "personality": "intelligent, approachable, confident",
        "narration_style": (
            "modern technology narrator; natural and conversational, lightly "
            "optimistic, clear without sounding corporate"
        ),
        "emotional_strength": "Professional confidence — clarity, credibility, composure",
        "primary_emotion": "professional confidence",
        "ideal_video_types": [
            "SaaS storytelling",
            "startup and business case studies",
            "product explainers",
            "technology documentaries",
        ],
        "preferred_emotions": ["calm", "confidence", "curiosity", "friendly"],
        "voice_description": (
            "A rich, smooth, intelligent male voice for professional American "
            "technology narration. Conversational enough for a founder story, "
            "polished enough for a product film."
        ),
        "base_rate_percent": 2,
        "base_pitch_hz": -2,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_04",
        "voice_name": "Daniel Hayes",
        "folder": "SD_VOICE_04_Daniel_Hayes",
        "engine_voice": "en-US-BrianMultilingualNeural",
        "gender": "male",
        "vocal_register": "deep, warm baritone",
        "vocal_texture": "friendly, rounded, slightly soft",
        "accent": "American (General US)",
        "personality": "patient, mature, trustworthy",
        "narration_style": (
            "educational and approachable; clear explanations, gentle emphasis, "
            "room for the listener to follow the idea"
        ),
        "emotional_strength": "Warmth — approachability, patience, trust",
        "primary_emotion": "warmth",
        "ideal_video_types": [
            "educational content",
            "tutorials",
            "complex technical explanations",
            "onboarding and product education",
        ],
        "preferred_emotions": ["friendly", "calm", "curiosity", "confidence"],
        "voice_description": (
            "A deep, friendly, mature male voice that makes technical material "
            "feel human. Approachable and clear, with the patience of a good "
            "teacher rather than the pressure of a sales pitch."
        ),
        "base_rate_percent": -3,
        "base_pitch_hz": -8,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_05",
        "voice_name": "Victor Black",
        "folder": "SD_VOICE_05_Victor_Black",
        "engine_voice": "en-US-SteffanNeural",
        "gender": "male",
        "vocal_register": "dark bass-baritone",
        "vocal_texture": "resonant, controlled, slightly austere",
        "accent": "American (General US)",
        "personality": "powerful, serious, unflinching",
        "narration_style": (
            "controlled dramatic delivery; low, deliberate pacing; no shouting, "
            "no exaggerated trailer voice"
        ),
        "emotional_strength": "Intensity — power, stakes, resolve",
        "primary_emotion": "intensity",
        "ideal_video_types": [
            "cinematic hooks",
            "business crisis narratives",
            "high-stakes introductions",
            "serious commentary",
        ],
        "preferred_emotions": ["dramatic", "seriousness", "confidence", "suspense"],
        "voice_description": (
            "A dark, powerful, resonant male voice with controlled dramatic "
            "delivery. It carries weight without tipping into caricature, making "
            "it useful for cinematic hooks and business crisis stories."
        ),
        "base_rate_percent": -9,
        "base_pitch_hz": -16,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_06",
        "voice_name": "Ethan Brooks",
        "folder": "SD_VOICE_06_Ethan_Brooks",
        "engine_voice": "en-US-RogerNeural",
        "gender": "male",
        "vocal_register": "deep low-mid tenor-baritone",
        "vocal_texture": "bright, youthful, conversational",
        "accent": "American (General US)",
        "personality": "curious, energetic, modern",
        "narration_style": (
            "engaging social-media narration; upbeat but intelligible, modern "
            "conversational rhythm, clean sentence openings"
        ),
        "emotional_strength": "Curiosity — energy, discovery, momentum",
        "primary_emotion": "curiosity",
        "ideal_video_types": [
            "cinematic social media videos",
            "startup launch videos",
            "product reveals",
            "short-form explainers",
        ],
        "preferred_emotions": ["curiosity", "excitement", "friendly", "confidence"],
        "voice_description": (
            "A deep but youthful male voice with modern, conversational energy. "
            "It keeps the low register of the library while sounding curious, "
            "current, and ready to move."
        ),
        "base_rate_percent": 7,
        "base_pitch_hz": -12,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_07",
        "voice_name": "Samuel Reed",
        "folder": "SD_VOICE_07_Samuel_Reed",
        "engine_voice": "en-US-EricNeural",
        "gender": "male",
        "vocal_register": "deep, steady baritone",
        "vocal_texture": "calm, dry, intimate",
        "accent": "American (General US)",
        "personality": "thoughtful, grounded, reflective",
        "narration_style": (
            "reflective storytelling; slow, measured pacing; space around "
            "important lines; understated conclusions"
        ),
        "emotional_strength": "Reflection — thoughtfulness, perspective, closure",
        "primary_emotion": "reflection",
        "ideal_video_types": [
            "reflective documentaries",
            "lessons-learned sequences",
            "thoughtful conclusions",
            "essay-style brand films",
        ],
        "preferred_emotions": ["reflection", "calm", "seriousness", "concern"],
        "voice_description": (
            "A calm, measured, deep male voice for reflective storytelling and "
            "thoughtful conclusions. It sounds like someone who has considered "
            "the idea before speaking, not someone reading a script."
        ),
        "base_rate_percent": -8,
        "base_pitch_hz": -6,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_08",
        "voice_name": "Oliver Grant",
        "folder": "SD_VOICE_08_Oliver_Grant",
        "engine_voice": "en-GB-ThomasNeural",
        "gender": "male",
        "vocal_register": "deep low-mid baritone",
        "vocal_texture": "refined, articulate, slightly formal",
        "accent": "British (Received Pronunciation)",
        "personality": "sophisticated, precise, composed",
        "narration_style": (
            "British documentary narration; refined articulation, natural "
            "pronunciation, elegant pacing, restrained emotion"
        ),
        "emotional_strength": "Sophistication — refinement, precision, calm status",
        "primary_emotion": "sophistication",
        "ideal_video_types": [
            "British documentaries",
            "luxury and premium brands",
            "cultural films",
            "high-end explainers",
        ],
        "preferred_emotions": ["calm", "confidence", "reflection", "seriousness"],
        "voice_description": (
            "A deep British-style male voice: refined, articulate, and "
            "documentary-oriented, with natural pronunciation and an elegant "
            "sense of restraint."
        ),
        "base_rate_percent": -3,
        "base_pitch_hz": -8,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_09",
        "voice_name": "James Carter",
        "folder": "SD_VOICE_09_James_Carter",
        "engine_voice": "en-CA-LiamNeural",
        "gender": "male",
        "vocal_register": "deep, natural baritone",
        "vocal_texture": "expressive, conversational, slightly breathy",
        "accent": "Canadian (General Canadian, close to American)",
        "personality": "empathetic, sincere, adaptable",
        "narration_style": (
            "emotional storytelling; natural conversational pacing, intimate "
            "close-mic feel, honest emphasis without melodrama"
        ),
        "emotional_strength": "Emotional storytelling — empathy, sincerity, flexibility",
        "primary_emotion": "emotional storytelling",
        "ideal_video_types": [
            "founder stories",
            "emotional brand films",
            "customer stories",
            "human-interest documentaries",
        ],
        "preferred_emotions": ["reflection", "concern", "friendly", "confidence"],
        "voice_description": (
            "A deep, expressive male voice with a natural conversational "
            "texture. It moves easily between warmth, concern, and quiet "
            "confidence, which makes it the most emotionally flexible identity "
            "in the library."
        ),
        "base_rate_percent": 0,
        "base_pitch_hz": -4,
        "base_volume_percent": 0,
    },
    {
        "voice_id": "SD_VOICE_10",
        "voice_name": "Alexander Wolfe",
        "folder": "SD_VOICE_10_Alexander_Wolfe",
        "engine_voice": "en-GB-RyanNeural",
        "gender": "male",
        "vocal_register": "rich, cinematic bass-baritone",
        "vocal_texture": "smooth, rich, cinematic",
        "accent": "British (Modern RP)",
        "personality": "commanding, cinematic, composed",
        "narration_style": (
            "premium trailer narration; smooth low register, strong "
            "articulation, dramatic presence without excessive exaggeration"
        ),
        "emotional_strength": "Cinematic impact — scale, presence, premium drama",
        "primary_emotion": "cinematic impact",
        "ideal_video_types": [
            "cinematic trailers",
            "premium brand films",
            "dramatic reveals",
            "epic introductions",
        ],
        "preferred_emotions": ["dramatic", "confidence", "seriousness", "suspense"],
        "voice_description": (
            "An extra-rich cinematic male voice with a smooth low register, "
            "dramatic presence, and strong articulation. It is trailer-like "
            "without tipping into a parody of trailer narration."
        ),
        "base_rate_percent": -7,
        "base_pitch_hz": -15,
        "base_volume_percent": 0,
    },
]

# The emotion set is identical for every voice so the samples can be compared
# fairly. Prosody deltas are relative to each identity's base prosody.
EMOTIONS = [
    {
        "key": "calm",
        "label": "Calm professional narration",
        "text": "Every successful business begins with a decision.",
        "rate_delta": 0,
        "pitch_delta": 0,
        "volume_delta": 0,
    },
    {
        "key": "curiosity",
        "label": "Curiosity",
        "text": "But what if the smallest decision is the one that changes everything?",
        "rate_delta": 4,
        "pitch_delta": 3,
        "volume_delta": 0,
    },
    {
        "key": "suspense",
        "label": "Suspense",
        "text": (
            "When thousands of customers depend on your system, one mistake can "
            "change everything."
        ),
        "rate_delta": -5,
        "pitch_delta": -2,
        "volume_delta": 0,
    },
    {
        "key": "excitement",
        "label": "Excitement",
        "text": "This is where the real opportunity begins.",
        "rate_delta": 8,
        "pitch_delta": 4,
        "volume_delta": 3,
    },
    {
        "key": "seriousness",
        "label": "Seriousness",
        "text": "The question is not whether your business will face a challenge.",
        "rate_delta": -3,
        "pitch_delta": -1,
        "volume_delta": 0,
    },
    {
        "key": "concern",
        "label": "Concern",
        "text": "But sometimes, the smallest decision creates the biggest problem.",
        "rate_delta": -5,
        "pitch_delta": 1,
        "volume_delta": 0,
    },
    {
        "key": "confidence",
        "label": "Confidence",
        "text": "The question is whether you are prepared when it happens.",
        "rate_delta": -1,
        "pitch_delta": 0,
        "volume_delta": 2,
    },
    {
        "key": "reflection",
        "label": "Reflective storytelling",
        "text": "Every successful business begins with a decision.",
        "rate_delta": -7,
        "pitch_delta": -1,
        "volume_delta": -1,
    },
    {
        "key": "dramatic",
        "label": "Dramatic emphasis",
        "text": "One mistake can change everything.",
        "rate_delta": -9,
        "pitch_delta": -3,
        "volume_delta": 5,
    },
    {
        "key": "friendly",
        "label": "Friendly explanation",
        "text": "Let me show you how this actually works.",
        "rate_delta": 3,
        "pitch_delta": 2,
        "volume_delta": 1,
    },
]

EMOTION_KEYS = [e["key"] for e in EMOTIONS]
ASSET_KEYS = ["identity", *EMOTION_KEYS]


# ---------------------------------------------------------------------------
# Shell / media helpers
# ---------------------------------------------------------------------------
def run(args: list[str], **kwargs) -> subprocess.CompletedProcess:
    return subprocess.run(args, check=True, capture_output=True, **kwargs)


def ffmpeg(args: list[str]) -> None:
    subprocess.run(
        ["ffmpeg", "-y", "-hide_banner", "-loglevel", "error", *args],
        check=True,
    )


def probe_duration(path: Path) -> float:
    out = run(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "default=noprint_wrappers=1:nokey=1",
            str(path),
        ]
    ).stdout.decode().strip()
    return float(out) if out else 0.0


def speech_bounds(path: Path) -> tuple[float, float]:
    """Return first/last sample above the silence threshold, in seconds."""
    raw = run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            str(path),
            "-f",
            "f32le",
            "-ac",
            "1",
            "-ar",
            str(SR),
            "-",
        ]
    ).stdout
    samples = array.array("f")
    samples.frombytes(raw)
    if not samples:
        return 0.0, 0.0
    first, last = 0, len(samples) - 1
    while first < last and abs(samples[first]) < SILENCE_THRESHOLD:
        first += 1
    while last > first and abs(samples[last]) < SILENCE_THRESHOLD:
        last -= 1
    return first / SR, (last + 1) / SR


def measure_loudness(path: Path) -> dict:
    """Integrated loudness, true peak and LRA via ffmpeg ebur128."""
    text = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-i",
            str(path),
            "-af",
            "ebur128=peak=true",
            "-f",
            "null",
            "-",
        ],
        capture_output=True,
        text=True,
    ).stderr
    integrated = re.findall(r"I:\s+(-?\d+(?:\.\d+)?)\s+LUFS", text)
    peaks = re.findall(r"Peak:\s+(-?\d+(?:\.\d+)?)\s+dBFS", text)
    lra = re.findall(r"LRA:\s+(-?\d+(?:\.\d+)?)\s+LU", text)
    return {
        "loudness_lufs": float(integrated[-1]) if integrated else 0.0,
        "true_peak_dbtp": float(peaks[-1]) if peaks else 0.0,
        "lra_lu": float(lra[-1]) if lra else 0.0,
    }


def decode_trim_highpass(src: Path, dst: Path, start: float, end: float) -> float:
    ffmpeg(
        [
            "-i",
            str(src),
            "-af",
            (
                f"atrim=start={start:.4f}:end={end:.4f},"
                "asetpts=PTS-STARTPTS,highpass=f=65"
            ),
            "-ar",
            str(SR),
            "-ac",
            "1",
            "-c:a",
            "pcm_f32le",
            str(dst),
        ]
    )
    return probe_duration(dst)


def normalize(src: Path, dst: Path, duration: float) -> dict:
    """Two-pass gain + true-peak-safe limiter. Returns final measurements."""
    measured = measure_loudness(src)
    gain = TARGET_LUFS - measured["loudness_lufs"]
    fade_out_start = max(0.0, duration - 0.02)
    result = measured
    for _ in range(3):
        ffmpeg(
            [
                "-i",
                str(src),
                "-af",
                (
                    f"volume={gain:.3f}dB,"
                    f"alimiter=limit={LIMITER_DB}dB:attack=5:release=50:level=false,"
                    "afade=t=in:st=0:d=0.015,"
                    f"afade=t=out:st={fade_out_start:.4f}:d=0.02"
                ),
                "-ar",
                str(SR),
                "-ac",
                "1",
                "-c:a",
                "pcm_s24le",
                str(dst),
            ]
        )
        result = measure_loudness(dst)
        error = TARGET_LUFS - result["loudness_lufs"]
        if abs(error) <= 0.15:
            break
        gain += error
    return result


def file_metadata(path: Path) -> dict:
    info = json.loads(
        run(
            [
                "ffprobe",
                "-v",
                "error",
                "-show_entries",
                "stream=codec_name,sample_rate,channels,bits_per_sample,duration:format=duration",
                "-of",
                "json",
                str(path),
            ]
        ).stdout
    )
    stream = info["streams"][0]
    duration = stream.get("duration") or info["format"].get("duration")
    loud = measure_loudness(path)
    raw = run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            str(path),
            "-f",
            "f32le",
            "-ac",
            "1",
            "-ar",
            str(SR),
            "-",
        ]
    ).stdout
    samples = array.array("f")
    samples.frombytes(raw)
    peak_abs = max((abs(x) for x in samples), default=0.0)
    clipped = sum(1 for x in samples if abs(x) >= 0.999) if peak_abs >= 0.999 else 0
    return {
        "sample_rate_hz": int(stream["sample_rate"]),
        "channels": int(stream["channels"]),
        "bit_depth": int(stream.get("bits_per_sample") or 0),
        "codec": stream["codec_name"],
        "duration_seconds": round(float(duration), 3),
        "loudness_lufs": round(loud["loudness_lufs"], 2),
        "true_peak_dbtp": round(loud["true_peak_dbtp"], 2),
        "lra_lu": round(loud["lra_lu"], 2),
        "peak_dbfs": round(20 * math.log10(peak_abs), 2) if peak_abs > 0 else -120.0,
        "clipped_samples": clipped,
    }


def pitch_median(path: Path) -> float | None:
    """Median F0 via autocorrelation on 16 kHz mono. Identity QA only."""
    sr = 16_000
    raw = run(
        [
            "ffmpeg",
            "-v",
            "error",
            "-i",
            str(path),
            "-f",
            "s16le",
            "-ac",
            "1",
            "-ar",
            str(sr),
            "-",
        ]
    ).stdout
    samples = array.array("h")
    samples.frombytes(raw)
    win = int(0.04 * sr)
    hop = int(0.02 * sr)
    values: list[float] = []
    for start in range(0, max(0, len(samples) - win), hop):
        frame = samples[start : start + win]
        rms = math.sqrt(sum(x * x for x in frame) / win)
        if rms < 300:
            continue
        best, best_lag = 0.0, 0
        for lag in range(int(sr / 300), int(sr / 60) + 1):
            corr = sum(
                frame[i] * frame[i + lag] for i in range(0, win - lag, 2)
            )
            if corr > best:
                best, best_lag = corr, lag
        if best_lag:
            values.append(sr / best_lag)
    if not values:
        return None
    return round(statistics.median(values), 1)


def spectral_features(path: Path) -> dict:
    """Median spectral centroid / flatness / rolloff over voiced frames."""
    proc = subprocess.run(
        [
            "ffmpeg",
            "-hide_banner",
            "-i",
            str(path),
            "-af",
            "aspectralstats=measure=all:win_size=2048:overlap=0.5,"
            "ametadata=print:file=-",
            "-f",
            "null",
            "-",
        ],
        capture_output=True,
        text=True,
    )
    frames: list[dict] = []
    current: dict = {}
    for line in proc.stdout.splitlines():
        match = re.search(r"aspectralstats\.1\.(\w+)=(-?[\d.eE+-]+)$", line)
        if not match:
            continue
        key, value = match.group(1), float(match.group(2))
        current[key] = value
        if key == "rolloff":
            frames.append(current)
            current = {}
    measured = [
        f
        for f in frames
        if f.get("mean", 0) > 1e-6
        and f.get("centroid", 0) > 10
        and math.isfinite(f.get("flatness", 0))
    ]
    if not measured:
        return {
            "spectral_centroid_hz": None,
            "spectral_flatness": None,
            "spectral_rolloff_hz": None,
        }
    return {
        "spectral_centroid_hz": round(
            statistics.median(f["centroid"] for f in measured), 1
        ),
        "spectral_flatness": round(
            statistics.median(f["flatness"] for f in measured), 4
        ),
        "spectral_rolloff_hz": round(
            statistics.median(f["rolloff"] for f in measured), 1
        ),
    }


# ---------------------------------------------------------------------------
# Synthesis
# ---------------------------------------------------------------------------
def clamp(value: int, low: int, high: int) -> int:
    return max(low, min(high, value))


async def synthesize(job: dict, semaphore: asyncio.Semaphore) -> Path:
    raw = TMP / f"{job['key']}.mp3"
    async with semaphore:
        last_error = "unknown"
        for attempt in range(10):
            try:
                communicate = edge_tts.Communicate(
                    job["text"],
                    job["engine_voice"],
                    rate=f"{job['rate']:+d}%",
                    pitch=f"{job['pitch']:+d}Hz",
                    volume=f"{job['volume']:+d}%",
                )
                written = 0
                with open(raw, "wb") as handle:
                    async for chunk in communicate.stream():
                        if chunk["type"] == "audio":
                            handle.write(chunk["data"])
                            written += len(chunk["data"])
                if written > 4000 and probe_duration(raw) > MIN_DURATION:
                    return raw
                last_error = f"empty/short audio ({written} bytes)"
            except Exception as exc:  # noqa: BLE001 - public service is flaky
                last_error = f"{type(exc).__name__}: {exc}"
            await asyncio.sleep(0.8 + attempt * 0.9)
        raise RuntimeError(
            f"Edge TTS failed for {job['voice_id']} / {job['emotion']} after "
            f"10 attempts: {last_error}"
        )


def build_jobs(selected: set[str] | None) -> list[dict]:
    jobs: list[dict] = []
    for voice in VOICES:
        if selected and voice["voice_id"] not in selected:
            continue
        jobs.append(
            {
                "key": f"{voice['voice_id']}_identity",
                "voice_id": voice["voice_id"],
                "emotion": "identity",
                "text": IDENTITY_TEXT,
                "engine_voice": voice["engine_voice"],
                "rate": voice["base_rate_percent"],
                "pitch": voice["base_pitch_hz"],
                "volume": voice["base_volume_percent"],
            }
        )
        for emotion in EMOTIONS:
            jobs.append(
                {
                    "key": f"{voice['voice_id']}_{emotion['key']}",
                    "voice_id": voice["voice_id"],
                    "emotion": emotion["key"],
                    "text": emotion["text"],
                    "engine_voice": voice["engine_voice"],
                    "rate": clamp(
                        voice["base_rate_percent"] + emotion["rate_delta"], -20, 20
                    ),
                    "pitch": clamp(
                        voice["base_pitch_hz"] + emotion["pitch_delta"], -30, 10
                    ),
                    "volume": clamp(
                        voice["base_volume_percent"] + emotion["volume_delta"],
                        -10,
                        10,
                    ),
                }
            )
    return jobs


# ---------------------------------------------------------------------------
# Manifest / documentation
# ---------------------------------------------------------------------------
def public_path(path: Path) -> str:
    return path.relative_to(PUBLIC).as_posix()


def emotion_prosody(voice: dict, emotion: dict | None) -> dict:
    if emotion is None:
        return {
            "rate_percent": voice["base_rate_percent"],
            "pitch_hz": voice["base_pitch_hz"],
            "volume_percent": voice["base_volume_percent"],
        }
    return {
        "rate_percent": clamp(
            voice["base_rate_percent"] + emotion["rate_delta"], -20, 20
        ),
        "pitch_hz": clamp(voice["base_pitch_hz"] + emotion["pitch_delta"], -30, 10),
        "volume_percent": clamp(
            voice["base_volume_percent"] + emotion["volume_delta"], -10, 10
        ),
    }


def build_manifest(voice_meta: dict[str, dict[str, dict]]) -> dict:
    voices_out = []
    for voice in VOICES:
        meta = voice_meta[voice["voice_id"]]
        identity = meta["identity"]
        wpm = round(50 / identity["duration_seconds"] * 60, 1)
        audio_file_paths = {
            key: public_path(LIB / voice["folder"] / f"{key}.wav")
            for key in ASSET_KEYS
        }
        files = {
            key: {
                "path": audio_file_paths[key],
                **{
                    field: meta[key][field]
                    for field in (
                        "duration_seconds",
                        "sample_rate_hz",
                        "bit_depth",
                        "channels",
                        "loudness_lufs",
                        "true_peak_dbtp",
                        "lra_lu",
                        "peak_dbfs",
                        "clipped_samples",
                    )
                },
            }
            for key in ASSET_KEYS
        }
        voices_out.append(
            {
                "voice_id": voice["voice_id"],
                "voice_name": voice["voice_name"],
                "gender": voice["gender"],
                "vocal_register": voice["vocal_register"],
                "vocal_texture": voice["vocal_texture"],
                "accent": voice["accent"],
                "personality": voice["personality"],
                "narration_style": voice["narration_style"],
                "emotional_strength": voice["emotional_strength"],
                "primary_emotion": voice["primary_emotion"],
                "emotional_range": (
                    "all ten library emotions; strongest in "
                    + ", ".join(voice["preferred_emotions"])
                ),
                "available_emotions": EMOTION_KEYS,
                "speaking_speed": f"measured, {wpm:g} wpm (identity sample)",
                "speaking_speed_wpm": wpm,
                "ideal_video_types": voice["ideal_video_types"],
                "preferred_emotions": voice["preferred_emotions"],
                "audio_file_paths": audio_file_paths,
                "voice_description": voice["voice_description"],
                "usage_instructions": (
                    f"Select with `resolveVoice(\"{voice['voice_id']}\")` or "
                    f"`resolveVoice(\"{voice['voice_id']} — {voice['voice_name']}\")`. "
                    "In Remotion use "
                    f"`<VoiceNarration voice=\"{voice['voice_id']}\" emotion=\"calm\" />`. "
                    "Paths are relative to `public/`. This identity is permanent; "
                    "do not rename it. If the asset is missing, fail loudly — never "
                    "substitute another voice."
                ),
                "folder": voice["folder"],
                "folder_path": public_path(LIB / voice["folder"]),
                "engine_voice": voice["engine_voice"],
                "prosody": {
                    "base": emotion_prosody(voice, None),
                    "emotions": {
                        e["key"]: emotion_prosody(voice, e) for e in EMOTIONS
                    },
                },
                "identity_version": "1.0.0",
                "immutable": True,
                "files": files,
            }
        )

    return {
        "schema_version": "1.0.0",
        "library_id": "simpledeav-male-deep-voice-library",
        "library_name": "SIMPLEDEAV Male Deep Voice Identity Library",
        "version": "1.0.0",
        "created": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "engine": {
            "name": "Microsoft Edge Neural TTS",
            "client": "edge-tts",
            "client_version": getattr(edge_tts, "__version__", "unknown"),
            "source_format": "MP3, 24 kHz, mono, 48 kbps",
            "voice_cloning": False,
            "note": (
                "Ten distinct neural base voices. Each identity is treated with "
                "documented pitch/rate prosody and mastered locally. No specific "
                "real person is imitated, and no cloning is used."
            ),
        },
        "audio_spec": {
            "format": "WAV",
            "codec": "PCM signed 24-bit little-endian",
            "sample_rate_hz": 48000,
            "bit_depth": 24,
            "channels": 1,
            "layout": "mono",
            "loudness_target_lufs": TARGET_LUFS,
            "true_peak_target_dbtp": TRUE_PEAK_LIMIT_DB,
            "processing": (
                "speech-boundary trim; 65 Hz high-pass; measured gain; true-peak-"
                "safe limiter; 15 ms fade-in; 20 ms fade-out. No reverb, no echo, "
                "no artificial room, no voice cloning."
            ),
            "source_limitation": (
                "Edge TTS delivers 24 kHz mono MP3. The WAV files are 48 kHz / "
                "24-bit PCM containers produced from that source, not native "
                "48 kHz recordings. This is the best quality available without "
                "a paid TTS provider."
            ),
        },
        "selection": {
            "syntax": "Use SD_VOICE_03 — Nathan Cole.",
            "accepted_forms": [
                "SD_VOICE_03",
                "SD_VOICE_03 — Nathan Cole",
                "Nathan Cole",
                "nathan cole",
            ],
            "strict": True,
            "fallback": "none",
            "behaviour": (
                "Unknown voices and missing emotion assets raise an error. The "
                "system never silently substitutes a different voice."
            ),
            "resolver": "src/voice-library/selectVoice.ts",
            "remotion_component": "src/voice-library/VoiceNarration.tsx",
            "cli": "node scripts/voice-lookup.mjs \"SD_VOICE_03 — Nathan Cole\"",
        },
        "test_narration": IDENTITY_TEXT,
        "emotion_definitions": {
            e["key"]: {
                "label": e["label"],
                "text": e["text"],
                "rate_delta_percent": e["rate_delta"],
                "pitch_delta_hz": e["pitch_delta"],
                "volume_delta_percent": e["volume_delta"],
            }
            for e in EMOTIONS
        },
        "voices": voices_out,
        "comparison": {
            "audio_wav": public_path(LIB / "comparison.wav"),
            "audio_mp3": public_path(LIB / "comparison.mp3"),
            "cues_json": public_path(LIB / "comparison-cues.json"),
            "gap_seconds": 1.0,
            "lead_in_seconds": 1.0,
            "order": [v["voice_id"] for v in VOICES],
        },
        "documentation": {
            "readme": public_path(LIB / "README.md"),
            "qa_report": public_path(LIB / "QA_REPORT.md"),
            "quality_report_json": public_path(LIB / "quality-report.json"),
            "comparison_report": public_path(LIB / "COMPARISON.md"),
            "checksums": public_path(LIB / "CHECKSUMS.sha256"),
        },
    }


def write_description(voice: dict, files: dict[str, dict], wpm: float) -> str:
    rows = []
    for key in ASSET_KEYS:
        meta = files[key]
        rows.append(
            f"| {key} | `{key}.wav` | {meta['duration_seconds']:.2f} s | "
            f"{meta['loudness_lufs']:.1f} LUFS | {meta['true_peak_dbtp']:.1f} dBTP |"
        )
    return f"""# {voice['voice_id']} — {voice['voice_name']}

**Permanent voice identity. Do not rename. Do not substitute.**

## Identity

| Field | Value |
| --- | --- |
| Voice ID | `{voice['voice_id']}` |
| Voice name | {voice['voice_name']} |
| Gender | {voice['gender']} |
| Vocal register | {voice['vocal_register']} |
| Vocal texture | {voice['vocal_texture']} |
| Accent | {voice['accent']} |
| Personality | {voice['personality']} |
| Narration style | {voice['narration_style']} |
| Emotional strength | {voice['emotional_strength']} |
| Primary emotion | {voice['primary_emotion']} |
| Emotional range | all ten library emotions; strongest in {', '.join(voice['preferred_emotions'])} |
| Speaking speed | measured, {wpm:g} wpm (identity sample) |
| Engine voice | `{voice['engine_voice']}` |
| Base prosody | rate `{voice['base_rate_percent']:+d}%`, pitch `{voice['base_pitch_hz']:+d} Hz`, volume `{voice['base_volume_percent']:+d}%` |

## Description

{voice['voice_description']}

## Ideal video types

{chr(10).join(f"- {item}" for item in voice['ideal_video_types'])}

## Preferred emotions

{chr(10).join(f"- {item}" for item in voice['preferred_emotions'])}

## Files

All files are 48 kHz, 24-bit PCM, mono WAV, mastered to approximately
{TARGET_LUFS:.0f} LUFS integrated with a true peak at or below
{TRUE_PEAK_LIMIT_DB:.1f} dBTP.

| Emotion | File | Duration | Loudness | True peak |
| --- | --- | --- | --- | --- |
{chr(10).join(rows)}

## Use in Remotion

```tsx
import {{ VoiceNarration }} from "../voice-library/VoiceNarration";

<VoiceNarration voice="{voice['voice_id']} — {voice['voice_name']}" emotion="calm" />
```

Programmatic lookup:

```ts
import {{ resolveVoice, getVoiceAssetPath }} from "../voice-library/selectVoice";

const profile = resolveVoice("{voice['voice_id']}");
const src = getVoiceAssetPath("{voice['voice_id']}", "suspense");
```

CLI lookup:

```bash
node scripts/voice-lookup.mjs "{voice['voice_id']} — {voice['voice_name']}"
```

## Identity rules

- The voice ID and name are permanent.
- Use the requested voice. Do not silently fall back to another identity.
- If an asset is missing or unreadable, report the problem and stop.
- This is a synthetic neural voice. Do not claim it is 100% indistinguishable
  from a human recording.
"""


def write_readme(manifest: dict) -> str:
    table = "\n".join(
        f"| `{v['voice_id']}` | {v['voice_name']} | {v['vocal_register']} | "
        f"{v['accent']} | {v['primary_emotion']} |"
        for v in manifest["voices"]
    )
    return f"""# SIMPLEDEAV Male Deep Voice Identity Library

Permanent, reusable male narration voices for the Remotion production system.
All audio lives in this folder and is referenced from `manifest.json`.

## Voices

| ID | Name | Register | Accent | Primary emotion |
| --- | --- | --- | --- | --- |
{table}

## Structure

```text
public/audio/voice-library/
  manifest.json
  README.md
  QA_REPORT.md
  COMPARISON.md
  quality-report.json
  CHECKSUMS.sha256
  comparison.wav
  comparison.mp3
  comparison-cues.json
  SD_VOICE_01_Marcus_Stone/
    identity.wav
    calm.wav
    curiosity.wav
    suspense.wav
    excitement.wav
    seriousness.wav
    concern.wav
    confidence.wav
    reflection.wav
    dramatic.wav
    friendly.wav
    description.md
  ... (one folder per voice)
```

## Selection

The canonical selector is `src/voice-library/selectVoice.ts`. It accepts the
permanent ID, the full name, or the combined form:

```ts
import {{ resolveVoice, getVoiceAssetPath }} from "./voice-library/selectVoice";

const voice = resolveVoice("SD_VOICE_03 — Nathan Cole");
const src = getVoiceAssetPath(voice.voice_id, "calm");
```

In a Remotion composition:

```tsx
import {{ VoiceNarration }} from "./voice-library/VoiceNarration";

<VoiceNarration voice="SD_VOICE_03 — Nathan Cole" emotion="suspense" />
```

The selector is strict. An unknown voice or a missing emotion asset throws an
error. It never silently substitutes a different voice.

## Emotions

Every voice has the same ten emotion samples, generated from the same test
phrases so they can be compared fairly:

`calm`, `curiosity`, `suspense`, `excitement`, `seriousness`, `concern`,
`confidence`, `reflection`, `dramatic`, `friendly`.

Emotion is applied with rate/pitch/volume prosody relative to the identity's
base. This is expression shaping, not full actor-level performance.

## Comparison

- `comparison.wav` — all ten identity samples consecutively, 48 kHz / 24-bit mono
- `comparison.mp3` — 320 kbps listening copy
- `comparison-cues.json` — exact start/end time for each voice

## Rebuild

```bash
cd motion-studio
python3 scripts/build-voice-library.py            # skip valid existing files
python3 scripts/build-voice-library.py --force    # regenerate everything
python3 scripts/build-voice-library.py --only SD_VOICE_03
python3 scripts/build-voice-library.py --qa-only  # rebuild manifest + report only
```

The Remotion preview composition is `VoiceLibraryComparison`.

## Generate a new narration line

```bash
python3 scripts/voice-say.py \
  --voice "SD_VOICE_03 — Nathan Cole" \
  --emotion suspense \
  --text "When thousands of customers depend on your system, one mistake can change everything." \
  --out out/voice-lines/nathan-suspense.wav
```

`--mp3` also writes a 320 kbps copy. The generator uses the selected identity's
exact engine voice and documented prosody, then applies the same mastering
chain. Unknown voices and emotions exit non-zero; nothing is substituted.

## Engine and limitations

- Engine: Microsoft Edge Neural TTS via `edge-tts` (free, no API key).
- Source audio: 24 kHz mono MP3, 48 kbps.
- Delivered audio: 48 kHz / 24-bit PCM mono WAV. The delivery format is
  48/24, but the source bandwidth is 24 kHz. This is documented rather than
  misrepresented as a native 48 kHz recording.
- No voice cloning and no imitation of a specific real person.
- Synthetic speech is not guaranteed to be indistinguishable from a human.
- Emotion is shaped with prosody, not by a full acting model.

## QA

See `QA_REPORT.md` for duration, sample rate, bit depth, loudness, true peak,
clipping, name/folder matching, manifest-path validation, and distinctness
checks. The machine-readable version is `quality-report.json`.

## Integrity

`CHECKSUMS.sha256` covers every artifact in this library. From the
`motion-studio` project root:

```bash
shasum -a 256 -c public/audio/voice-library/CHECKSUMS.sha256
```
"""


def write_comparison_report(manifest: dict, comparison: dict, report: dict) -> str:
    cue_by_id = {cue["voice_id"]: cue for cue in comparison["cues"]}
    rows = []
    for voice in manifest["voices"]:
        cue = cue_by_id[voice["voice_id"]]
        rows.append(
            f"| `{voice['voice_id']}` | {voice['voice_name']} | "
            f"{voice['vocal_register']} | {voice['vocal_texture']} | "
            f"{voice['accent']} | {voice['speaking_speed_wpm']:g} wpm | "
            f"{voice['primary_emotion']} | {cue['start_seconds']:.1f}s |"
        )

    def ideal(voice_id: str) -> str:
        voice = next(v for v in manifest["voices"] if v["voice_id"] == voice_id)
        return ", ".join(voice["ideal_video_types"][:2])

    return f"""# Voice Comparison Report

Listen to `comparison.wav` (or `comparison.mp3`) for the ten identity samples
in order. Every sample uses the same narration, so differences in timbre,
accent, pacing, and weight are directly comparable.

## At a glance

| ID | Name | Register | Texture | Accent | Pace | Primary emotion | Cue |
| --- | --- | --- | --- | --- | --- | --- | --- |
{chr(10).join(rows)}

## How to choose

| If the video needs… | Start with |
| --- | --- |
| Premium documentary authority | `SD_VOICE_01` Marcus Stone |
| Suspense, crisis, or a dark tech story | `SD_VOICE_02` Adrian Cross |
| Modern SaaS / startup confidence | `SD_VOICE_03` Nathan Cole |
| Warm, patient technical teaching | `SD_VOICE_04` Daniel Hayes |
| A powerful cinematic hook | `SD_VOICE_05` Victor Black |
| Young, energetic social-first delivery | `SD_VOICE_06` Ethan Brooks |
| A reflective lesson or conclusion | `SD_VOICE_07` Samuel Reed |
| Refined British documentary tone | `SD_VOICE_08` Oliver Grant |
| Emotional founder or customer story | `SD_VOICE_09` James Carter |
| Premium trailer-scale impact | `SD_VOICE_10` Alexander Wolfe |

## Distinctness

- Ten different neural base voices; no two identities share an engine voice.
- Median F0 range across the identity samples:
  {report['distinctness']['f0_range_hz'][0]:.1f}–{report['distinctness']['f0_range_hz'][1]:.1f} Hz.
- Minimum normalized timbre distance:
  {report['distinctness']['minimum_pair_distance']}
  ({', '.join(report['distinctness']['minimum_pair'] or [])}).
- The closest pair still differs in base voice, texture, and delivery; the
  distance metric is supporting evidence, not a substitute for listening.

## Listening order and cues

| # | Voice | Start | End |
| --- | --- | --- | --- |
{chr(10).join(
    f"| {index + 1} | {cue['voice_id']} — {cue['voice_name']} | "
    f"{cue['start_seconds']:.2f}s | {cue['end_seconds']:.2f}s |"
    for index, cue in enumerate(comparison['cues'])
)}

## Identity notes

- `SD_VOICE_01` Marcus Stone — {ideal('SD_VOICE_01')}.
- `SD_VOICE_02` Adrian Cross — {ideal('SD_VOICE_02')}.
- `SD_VOICE_03` Nathan Cole — {ideal('SD_VOICE_03')}.
- `SD_VOICE_04` Daniel Hayes — {ideal('SD_VOICE_04')}.
- `SD_VOICE_05` Victor Black — {ideal('SD_VOICE_05')}.
- `SD_VOICE_06` Ethan Brooks — {ideal('SD_VOICE_06')}.
- `SD_VOICE_07` Samuel Reed — {ideal('SD_VOICE_07')}.
- `SD_VOICE_08` Oliver Grant — {ideal('SD_VOICE_08')}.
- `SD_VOICE_09` James Carter — {ideal('SD_VOICE_09')}.
- `SD_VOICE_10` Alexander Wolfe — {ideal('SD_VOICE_10')}.

## Selection

Use the permanent ID or exact name:

```ts
resolveVoice("SD_VOICE_03 — Nathan Cole");
```

The resolver is strict. If a voice or emotion asset is unavailable, it raises
an error instead of silently using another identity.
"""


# ---------------------------------------------------------------------------
# Comparison / QA
# ---------------------------------------------------------------------------
def build_comparison(voice_meta: dict[str, dict[str, dict]]) -> dict:
    gap = 1.0
    lead = 1.0
    silence = TMP / "silence_1s.wav"
    ffmpeg(
        [
            "-f",
            "lavfi",
            "-i",
            "anullsrc=r=48000:cl=mono",
            "-t",
            f"{gap}",
            "-c:a",
            "pcm_s24le",
            str(silence),
        ]
    )
    parts = [silence]
    for voice in VOICES:
        parts.append(LIB / voice["folder"] / "identity.wav")
        parts.append(silence)
    list_file = TMP / "comparison.txt"
    list_file.write_text(
        "\n".join(f"file '{p.as_posix()}'" for p in parts) + "\n",
        encoding="utf-8",
    )
    wav = LIB / "comparison.wav"
    ffmpeg(
        [
            "-f",
            "concat",
            "-safe",
            "0",
            "-i",
            str(list_file),
            "-c",
            "copy",
            str(wav),
        ]
    )
    mp3 = LIB / "comparison.mp3"
    ffmpeg(
        [
            "-i",
            str(wav),
            "-c:a",
            "libmp3lame",
            "-b:a",
            "320k",
            str(mp3),
        ]
    )
    cues = []
    cursor = lead
    for voice in VOICES:
        duration = voice_meta[voice["voice_id"]]["identity"]["duration_seconds"]
        cues.append(
            {
                "voice_id": voice["voice_id"],
                "voice_name": voice["voice_name"],
                "start_seconds": round(cursor, 3),
                "end_seconds": round(cursor + duration, 3),
                "duration_seconds": round(duration, 3),
                "file": public_path(LIB / voice["folder"] / "identity.wav"),
            }
        )
        cursor += duration + gap
    payload = {
        "audio_wav": public_path(wav),
        "audio_mp3": public_path(mp3),
        "cues_json": public_path(LIB / "comparison-cues.json"),
        "lead_in_seconds": lead,
        "gap_seconds": gap,
        "total_duration_seconds": round(cursor, 3),
        "order": [v["voice_id"] for v in VOICES],
        "cues": cues,
    }
    (LIB / "comparison-cues.json").write_text(
        json.dumps(payload, indent=2) + "\n", encoding="utf-8"
    )
    return payload


def quality_check(voice_meta: dict[str, dict[str, dict]], manifest: dict, comparison: dict) -> dict:
    checks: list[dict] = []

    def add(name: str, passed: bool, detail: str) -> None:
        checks.append({"check": name, "passed": bool(passed), "detail": detail})

    add("voice count", len(VOICES) == 10, f"{len(VOICES)} voices defined")
    add(
        "unique voice ids",
        len({v["voice_id"] for v in VOICES}) == len(VOICES),
        f"{len({v['voice_id'] for v in VOICES})} unique IDs",
    )
    add(
        "unique voice names",
        len({v["voice_name"] for v in VOICES}) == len(VOICES),
        f"{len({v['voice_name'] for v in VOICES})} unique names",
    )
    add(
        "unique engine voices",
        len({v["engine_voice"] for v in VOICES}) == len(VOICES),
        f"{len({v['engine_voice'] for v in VOICES})} unique base voices",
    )

    expected_files = 10 * len(ASSET_KEYS)
    present_files = 0
    bad_files: list[str] = []
    for voice in VOICES:
        folder = LIB / voice["folder"]
        for key in ASSET_KEYS:
            path = folder / f"{key}.wav"
            if path.exists():
                present_files += 1
            else:
                bad_files.append(str(path))
        if not (folder / "description.md").exists():
            bad_files.append(str(folder / "description.md"))
    add(
        "expected audio files",
        present_files == expected_files and not bad_files,
        f"{present_files}/{expected_files} present" + (f"; missing: {bad_files}" if bad_files else ""),
    )

    format_failures = []
    loudness_failures = []
    peak_failures = []
    clipping_failures = []
    duration_failures = []
    for voice in VOICES:
        for key in ASSET_KEYS:
            meta = voice_meta[voice["voice_id"]][key]
            path = f"{voice['voice_id']}/{key}.wav"
            if (
                meta["sample_rate_hz"] != 48000
                or meta["channels"] != 1
                or meta["bit_depth"] != 24
            ):
                format_failures.append(
                    f"{path}: {meta['sample_rate_hz']} Hz/{meta['bit_depth']}-bit/"
                    f"{meta['channels']}ch"
                )
            if abs(meta["loudness_lufs"] - TARGET_LUFS) > 1.0:
                loudness_failures.append(f"{path}: {meta['loudness_lufs']} LUFS")
            if meta["true_peak_dbtp"] > TRUE_PEAK_LIMIT_DB + 0.1:
                peak_failures.append(f"{path}: {meta['true_peak_dbtp']} dBTP")
            if meta["clipped_samples"] > 0:
                clipping_failures.append(f"{path}: {meta['clipped_samples']} samples")
            if meta["duration_seconds"] < MIN_DURATION:
                duration_failures.append(f"{path}: {meta['duration_seconds']} s")
    add("48 kHz / 24-bit / mono", not format_failures, "; ".join(format_failures) or "all files")
    add(
        "loudness within 1 LU of -16",
        not loudness_failures,
        "; ".join(loudness_failures) or "all files",
    )
    add(
        "true peak <= -1.5 dBTP",
        not peak_failures,
        "; ".join(peak_failures) or "all files",
    )
    add("no clipped samples", not clipping_failures, "; ".join(clipping_failures) or "all files")
    add(
        "minimum duration",
        not duration_failures,
        "; ".join(duration_failures) or "all files >= 0.4 s",
    )

    folder_failures = []
    for voice in VOICES:
        expected = f"{voice['voice_id']}_{voice['voice_name'].replace(' ', '_')}"
        if voice["folder"] != expected or not (LIB / voice["folder"]).is_dir():
            folder_failures.append(f"{voice['voice_id']}: {voice['folder']} != {expected}")
    add("names match folders", not folder_failures, "; ".join(folder_failures) or "all folders match")

    manifest_failures = []
    for profile in manifest["voices"]:
        for key, path in profile["audio_file_paths"].items():
            if not (PUBLIC / path).exists():
                manifest_failures.append(path)
    add(
        "manifest paths exist",
        not manifest_failures,
        "; ".join(manifest_failures) or f"{len(manifest['voices']) * len(ASSET_KEYS)} paths valid",
    )

    comparison_failures = []
    for key in ("audio_wav", "audio_mp3", "cues_json"):
        if not (PUBLIC / comparison[key]).exists():
            comparison_failures.append(comparison[key])
    add(
        "comparison assets",
        not comparison_failures,
        "; ".join(comparison_failures) or "WAV, MP3 and cue sheet present",
    )

    # Distinctness: unique base voices plus a timbre/f0 vector distance.
    vectors = []
    for profile in manifest["voices"]:
        identity_meta = voice_meta[profile["voice_id"]]["identity"]
        vectors.append(
            {
                "voice_id": profile["voice_id"],
                "f0": identity_meta.get("f0_hz") or 0.0,
                "centroid": identity_meta.get("spectral_centroid_hz") or 0.0,
                "flatness": (identity_meta.get("spectral_flatness") or 0.0) * 100,
                "rolloff": identity_meta.get("spectral_rolloff_hz") or 0.0,
            }
        )
    dimensions = ["f0", "centroid", "flatness", "rolloff"]
    scales = {}
    for dim in dimensions:
        values = [v[dim] for v in vectors]
        mean = sum(values) / len(values)
        variance = sum((x - mean) ** 2 for x in values) / len(values)
        scales[dim] = math.sqrt(variance) or 1.0
    min_pair = None
    for i in range(len(vectors)):
        for j in range(i + 1, len(vectors)):
            distance = math.sqrt(
                sum(
                    ((vectors[i][dim] - vectors[j][dim]) / scales[dim]) ** 2
                    for dim in dimensions
                )
            )
            if min_pair is None or distance < min_pair[0]:
                min_pair = (distance, vectors[i]["voice_id"], vectors[j]["voice_id"])
    distinct = len({v["engine_voice"] for v in VOICES}) == 10 and (min_pair is None or min_pair[0] > 0.15)
    add(
        "voices are distinct",
        distinct,
        (
            f"10 unique base voices; minimum normalized timbre distance "
            f"{min_pair[0]:.3f} ({min_pair[1]} vs {min_pair[2]})"
            if min_pair
            else "10 unique base voices"
        ),
    )

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "library_path": public_path(LIB),
        "audio_spec": manifest["audio_spec"],
        "summary": {
            "voices": len(VOICES),
            "audio_files": expected_files,
            "emotion_samples_per_voice": len(EMOTION_KEYS),
            "checks_passed": sum(1 for c in checks if c["passed"]),
            "checks_total": len(checks),
            "all_passed": all(c["passed"] for c in checks),
            "comparison_duration_seconds": comparison["total_duration_seconds"],
        },
        "checks": checks,
        "distinctness": {
            "unique_engine_voices": len({v["engine_voice"] for v in VOICES}),
            "f0_range_hz": [
                min(v["f0"] for v in vectors),
                max(v["f0"] for v in vectors),
            ],
            "minimum_pair_distance": round(min_pair[0], 3) if min_pair else None,
            "minimum_pair": [min_pair[1], min_pair[2]] if min_pair else None,
            "vectors": vectors,
        },
        "voices": [
            {
                "voice_id": v["voice_id"],
                "voice_name": v["voice_name"],
                "folder": v["folder"],
                "identity": voice_meta[v["voice_id"]]["identity"],
                "files": {
                    key: voice_meta[v["voice_id"]][key] for key in ASSET_KEYS
                },
            }
            for v in VOICES
        ],
    }


def write_qa_report(report: dict, manifest: dict, comparison: dict) -> str:
    summary = report["summary"]
    check_rows = "\n".join(
        f"| {'PASS' if c['passed'] else 'FAIL'} | {c['check']} | {c['detail']} |"
        for c in report["checks"]
    )
    voice_rows = []
    for v in manifest["voices"]:
        identity = v["files"]["identity"]
        voice_rows.append(
            f"| `{v['voice_id']}` | {v['voice_name']} | {v['vocal_register']} | "
            f"{v['speaking_speed_wpm']:g} | {identity['duration_seconds']:.2f} s | "
            f"{identity['loudness_lufs']:.1f} | {identity['true_peak_dbtp']:.1f} | "
            f"{v['engine_voice']} |"
        )
    file_rows = []
    for v in manifest["voices"]:
        for key in ASSET_KEYS:
            f = v["files"][key]
            file_rows.append(
                f"| {v['voice_id']} | {key} | {f['duration_seconds']:.2f} | "
                f"{f['loudness_lufs']:.1f} | {f['true_peak_dbtp']:.1f} | "
                f"{f['clipped_samples']} |"
            )

    return f"""# Voice Library QA Report

Generated: {report['generated_at']}
Library: `{report['library_path']}`

## Summary

| Metric | Value |
| --- | --- |
| Voices | {summary['voices']} |
| Audio files | {summary['audio_files']} |
| Emotion samples per voice | {summary['emotion_samples_per_voice']} |
| Checks passed | {summary['checks_passed']} / {summary['checks_total']} |
| Overall | {'PASS' if summary['all_passed'] else 'FAIL'} |
| Comparison duration | {summary['comparison_duration_seconds']:.2f} s |

## Checks

| Result | Check | Detail |
| --- | --- | --- |
{check_rows}

## Identity overview

| ID | Name | Register | WPM | Duration | LUFS | dBTP | Engine voice |
| --- | --- | --- | --- | --- | --- | --- | --- |
{chr(10).join(voice_rows)}

## Per-file measurements

All files are 48 kHz / 24-bit PCM / mono WAV. Loudness target is -16 LUFS;
true peak target is <= -1.5 dBTP; clipping count must be zero.

| Voice | File | Duration (s) | LUFS | dBTP | Clipped |
| --- | --- | --- | --- | --- | --- |
{chr(10).join(file_rows)}

## Distinctness

- Unique base voices: {report['distinctness']['unique_engine_voices']}
- Median F0 range: {report['distinctness']['f0_range_hz'][0]:.1f}–{report['distinctness']['f0_range_hz'][1]:.1f} Hz
- Minimum normalized timbre distance: {report['distinctness']['minimum_pair_distance']}
- Closest pair: {', '.join(report['distinctness']['minimum_pair'] or [])}

Distinctness is based on ten different neural base voices plus documented pitch
and rate treatment. The F0 and spectral measurements are supporting evidence,
not a perceptual listening test.

## Comparison preview

- `comparison.wav` — {comparison['total_duration_seconds']:.2f} s, all ten identity samples consecutively
- `comparison.mp3` — 320 kbps listening copy
- `comparison-cues.json` — exact cue times for each voice

## Source and limitations

- TTS engine: Microsoft Edge Neural TTS via `edge-tts`.
- Source format: 24 kHz mono MP3 at 48 kbps.
- Delivery format: 48 kHz / 24-bit PCM mono WAV. The delivery container is
  48/24, but the source bandwidth is 24 kHz. This is the best available
  quality without a paid provider.
- No voice cloning and no imitation of a specific real person.
- Emotion is shaped through rate, pitch, and volume prosody, not a full acting
  model. Synthetic speech is not guaranteed to be indistinguishable from a
  human recording.
"""


def write_checksums() -> int:
    """SHA-256 integrity manifest for every permanent artifact."""
    target = LIB / "CHECKSUMS.sha256"
    files = sorted(
        path
        for path in LIB.rglob("*")
        if path.is_file() and path.name != target.name
    )
    lines = []
    for path in files:
        digest = hashlib.sha256()
        with open(path, "rb") as handle:
            for chunk in iter(lambda: handle.read(1024 * 1024), b""):
                digest.update(chunk)
        lines.append(
            f"{digest.hexdigest()}  {path.relative_to(ROOT).as_posix()}"
        )
    target.write_text("\n".join(lines) + "\n", encoding="utf-8")
    return len(files)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def ensure_prerequisites() -> None:
    for tool in ("ffmpeg", "ffprobe"):
        if shutil.which(tool) is None:
            raise SystemExit(f"{tool} is required but was not found on PATH.")
    if not (PUBLIC / "audio").is_dir():
        raise SystemExit(f"Expected Remotion project at {ROOT} (public/audio missing).")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--force", action="store_true", help="regenerate existing WAVs")
    parser.add_argument(
        "--only",
        action="append",
        default=None,
        help="limit to a voice ID (repeatable), e.g. --only SD_VOICE_01",
    )
    parser.add_argument(
        "--qa-only",
        action="store_true",
        help="skip synthesis; rebuild manifest, comparison and QA from existing files",
    )
    args = parser.parse_args()

    ensure_prerequisites()
    LIB.mkdir(parents=True, exist_ok=True)
    TMP.mkdir(parents=True, exist_ok=True)
    selected = set(args.only) if args.only else None
    if selected:
        unknown = selected - {v["voice_id"] for v in VOICES}
        if unknown:
            raise SystemExit(f"Unknown voice ID(s): {', '.join(sorted(unknown))}")

    jobs = build_jobs(selected)
    if not args.qa_only:
        print(f"Synthesizing {len(jobs)} clips with Edge TTS …", flush=True)
        semaphore = asyncio.Semaphore(3)

        async def run_all() -> list[Path]:
            return await asyncio.gather(*(synthesize(job, semaphore) for job in jobs))

        raw_paths = asyncio.run(run_all())
        print(f"Generated {len(raw_paths)} source clips.", flush=True)

        for index, job in enumerate(jobs, 1):
            voice = next(v for v in VOICES if v["voice_id"] == job["voice_id"])
            folder = LIB / voice["folder"]
            folder.mkdir(parents=True, exist_ok=True)
            out = folder / f"{job['emotion']}.wav"
            if out.exists() and not args.force:
                print(f"  [{index}/{len(jobs)}] skip existing {out.name} ({job['voice_id']})", flush=True)
                continue
            raw = TMP / f"{job['key']}.mp3"
            start, end = speech_bounds(raw)
            if end <= start:
                raise RuntimeError(f"No speech detected in {raw}")
            start = max(0.0, start - HEAD_PAD)
            end = end + TAIL_PAD
            trimmed = TMP / f"{job['key']}_trim.wav"
            duration = decode_trim_highpass(raw, trimmed, start, end)
            normalize(trimmed, out, duration)
            print(
                f"  [{index}/{len(jobs)}] {job['voice_id']} {job['emotion']:<11} "
                f"{probe_duration(out):6.2f}s -> {out.relative_to(ROOT)}",
                flush=True,
            )

    # Build metadata for every asset. This also re-validates existing files.
    print("Measuring files …", flush=True)
    voice_meta: dict[str, dict[str, dict]] = {}
    for voice in VOICES:
        meta: dict[str, dict] = {}
        for key in ASSET_KEYS:
            path = LIB / voice["folder"] / f"{key}.wav"
            if not path.exists():
                raise SystemExit(f"Missing audio file: {path}")
            info = file_metadata(path)
            if key == "identity":
                info["f0_hz"] = pitch_median(path)
                info.update(spectral_features(path))
            meta[key] = info
        voice_meta[voice["voice_id"]] = meta

    manifest = build_manifest(voice_meta)
    (LIB / "manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )

    for voice in VOICES:
        wpm = round(50 / voice_meta[voice["voice_id"]]["identity"]["duration_seconds"] * 60, 1)
        (LIB / voice["folder"] / "description.md").write_text(
            write_description(voice, voice_meta[voice["voice_id"]], wpm),
            encoding="utf-8",
        )

    print("Building comparison preview …", flush=True)
    comparison = build_comparison(voice_meta)
    report = quality_check(voice_meta, manifest, comparison)
    (LIB / "quality-report.json").write_text(
        json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8"
    )
    (LIB / "README.md").write_text(write_readme(manifest), encoding="utf-8")
    (LIB / "QA_REPORT.md").write_text(
        write_qa_report(report, manifest, comparison), encoding="utf-8"
    )
    (LIB / "COMPARISON.md").write_text(
        write_comparison_report(manifest, comparison, report), encoding="utf-8"
    )
    checksummed = write_checksums()

    shutil.rmtree(TMP, ignore_errors=True)
    print(
        f"\nDone. {report['summary']['checks_passed']}/{report['summary']['checks_total']} "
        f"checks passed. Comparison: {comparison['total_duration_seconds']:.1f}s.",
        flush=True,
    )
    print(f"Library: {LIB}", flush=True)
    print(f"Checksums: {checksummed} files -> {LIB / 'CHECKSUMS.sha256'}", flush=True)
    if not report["summary"]["all_passed"]:
        for check in report["checks"]:
            if not check["passed"]:
                print(f"  FAIL: {check['check']} — {check['detail']}", file=sys.stderr)
        raise SystemExit(1)


if __name__ == "__main__":
    main()
