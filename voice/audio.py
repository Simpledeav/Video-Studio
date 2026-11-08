"""Audio post-production helpers built on ffmpeg/soundfile."""
from __future__ import annotations

import json
import math
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf

FFMPEG = shutil.which("ffmpeg") or "ffmpeg"
FFPROBE = shutil.which("ffprobe") or "ffprobe"


class AudioError(RuntimeError):
    pass


def run(command: list[str], *, capture: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        command,
        check=False,
        capture_output=capture,
        text=True,
    )
    if result.returncode != 0:
        stderr = (result.stderr or "").strip()
        raise AudioError(f"Command failed ({result.returncode}): {' '.join(command)}\n{stderr[-4000:]}")
    return result


def probe_info(path: Path) -> dict[str, float | int]:
    result = run(
        [
            FFPROBE,
            "-v",
            "error",
            "-select_streams",
            "a:0",
            "-show_entries",
            "stream=sample_rate,channels,duration",
            "-show_entries",
            "format=duration",
            "-of",
            "json",
            str(path),
        ]
    )
    data = json.loads(result.stdout)
    stream = (data.get("streams") or [{}])[0]
    duration = float(stream.get("duration") or data.get("format", {}).get("duration") or 0.0)
    return {
        "sample_rate": int(stream.get("sample_rate") or 0),
        "channels": int(stream.get("channels") or 0),
        "duration_seconds": duration,
    }


def probe_duration(path: Path) -> float:
    return float(probe_info(path)["duration_seconds"])


def measure_loudness(path: Path) -> dict[str, float]:
    result = subprocess.run(
        [FFMPEG, "-hide_banner", "-nostats", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"],
        check=False,
        capture_output=True,
        text=True,
    )
    text = (result.stderr or "") + (result.stdout or "")
    integrated = None
    peak = None
    for line in text.splitlines():
        stripped = line.strip()
        if stripped.startswith("I:") and "LUFS" in stripped:
            try:
                integrated = float(stripped.split()[1])
            except (IndexError, ValueError):
                pass
        if stripped.startswith("Peak:") and "dBFS" in stripped:
            try:
                peak = float(stripped.split()[1])
            except (IndexError, ValueError):
                pass
    return {"integrated_lufs": integrated or 0.0, "true_peak_dbfs": peak or 0.0}


def read_wav(path: Path) -> tuple[np.ndarray, int]:
    samples, sample_rate = sf.read(str(path), dtype="float32", always_2d=False)
    if samples.ndim > 1:
        samples = samples[:, 0]
    return samples, int(sample_rate)


def write_wav(path: Path, samples: np.ndarray, sample_rate: int, subtype: str = "PCM_16") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    sf.write(str(path), samples, sample_rate, subtype=subtype)


def to_engine_wav(source: Path, target: Path, sample_rate: int = 24000) -> Path:
    """Mono float WAV at the engine's preferred rate."""
    target.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            FFMPEG,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-ac",
            "1",
            "-ar",
            str(sample_rate),
            "-c:a",
            "pcm_s16le",
            str(target),
        ]
    )
    return target


def normalize_master(
    source: Path,
    target: Path,
    *,
    filter_chain: list[str],
    sample_rate: int = 48000,
    subtype: str = "PCM_24",
) -> Path:
    """Apply the house narration chain and write the master WAV."""
    target.parent.mkdir(parents=True, exist_ok=True)
    filters = ",".join(filter_chain)
    run(
        [
            FFMPEG,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-af",
            filters,
            "-ac",
            "1",
            "-ar",
            str(sample_rate),
            "-c:a",
            f"pcm_s24le" if subtype == "PCM_24" else "pcm_s16le",
            str(target),
        ]
    )
    return target


def to_mp3(source: Path, target: Path, bitrate: str = "192k") -> Path:
    target.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            FFMPEG,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-ac",
            "1",
            "-ar",
            "48000",
            "-c:a",
            "libmp3lame",
            "-b:a",
            bitrate,
            str(target),
        ]
    )
    return target


def make_silence(path: Path, seconds: float, sample_rate: int = 48000) -> Path:
    path.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            FFMPEG,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-f",
            "lavfi",
            "-i",
            f"anullsrc=r={sample_rate}:cl=mono",
            "-t",
            f"{max(0.0, seconds):.3f}",
            "-c:a",
            "pcm_s24le",
            str(path),
        ]
    )
    return path


def concat_wavs(paths: list[Path], target: Path, sample_rate: int = 48000) -> Path:
    """Concatenate identical-format WAVs without re-encoding."""
    if not paths:
        raise AudioError("Cannot concatenate an empty list of WAV files.")
    target.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.NamedTemporaryFile("w", suffix=".txt", delete=False, encoding="utf-8") as handle:
        list_path = Path(handle.name)
        for path in paths:
            handle.write(f"file '{path.resolve().as_posix()}'\n")
    try:
        run(
            [
                FFMPEG,
                "-hide_banner",
                "-loglevel",
                "error",
                "-y",
                "-f",
                "concat",
                "-safe",
                "0",
                "-i",
                str(list_path),
                "-ar",
                str(sample_rate),
                "-ac",
                "1",
                "-c:a",
                "pcm_s24le",
                str(target),
            ]
        )
    finally:
        list_path.unlink(missing_ok=True)
    return target


def trim_silence_edges(source: Path, target: Path, threshold_db: float = -45.0) -> Path:
    target.parent.mkdir(parents=True, exist_ok=True)
    run(
        [
            FFMPEG,
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-af",
            f"silenceremove=start_periods=1:start_threshold={threshold_db}dB:start_silence=0.05:"
            f"stop_periods=1:stop_threshold={threshold_db}dB:stop_silence=0.08",
            "-ar",
            "48000",
            "-ac",
            "1",
            "-c:a",
            "pcm_s24le",
            str(target),
        ]
    )
    return target


def audio_stats(path: Path) -> dict[str, float]:
    samples, sample_rate = read_wav(path)
    if samples.size == 0:
        return {
            "duration_seconds": 0.0,
            "peak_dbfs": -120.0,
            "rms_dbfs": -120.0,
            "clipped_samples": 0.0,
            "sample_rate": sample_rate,
        }
    peak = float(np.max(np.abs(samples)))
    rms = float(np.sqrt(np.mean(np.square(samples))))
    clipped = int(np.count_nonzero(np.abs(samples) >= 0.999))
    return {
        "duration_seconds": round(len(samples) / sample_rate, 3),
        "peak_dbfs": round(20 * math.log10(max(peak, 1e-12)), 2),
        "rms_dbfs": round(20 * math.log10(max(rms, 1e-12)), 2),
        "clipped_samples": clipped,
        "sample_rate": sample_rate,
    }


def silence_ratio(path: Path, threshold_db: float = -40.0, frame_seconds: float = 0.02) -> float:
    samples, sample_rate = read_wav(path)
    if samples.size == 0:
        return 0.0
    frame = max(1, int(frame_seconds * sample_rate))
    usable = (samples.size // frame) * frame
    if usable == 0:
        return 0.0
    frames = samples[:usable].reshape(-1, frame)
    rms = np.sqrt(np.mean(np.square(frames), axis=1))
    quiet = rms < (10 ** (threshold_db / 20))
    return float(np.mean(quiet))
