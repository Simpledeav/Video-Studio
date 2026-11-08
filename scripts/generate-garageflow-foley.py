#!/usr/bin/env python3
"""Generate original garage foley for the GarageFlow film.

No downloaded audio is used. Every cue is synthesised locally with numpy so the
workshop sound design stays licence-clean and can be regenerated.

Output: public/audio/episodes/garageflow/sfx/*.wav (48 kHz mono)
"""
from __future__ import annotations

import math
import wave
from pathlib import Path

import numpy as np

SR = 48_000
OUT = Path("public/audio/episodes/garageflow/sfx")


def write_wav(name: str, signal: np.ndarray) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    peak = float(np.max(np.abs(signal))) or 1.0
    signal = (signal / peak) * 0.86
    pcm = np.clip(signal, -1.0, 1.0)
    data = (pcm * 32767).astype("<i2").tobytes()
    with wave.open(str(OUT / name), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(data)


def t(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR)) / SR


def envelope(length: int, attack: float, decay: float, curve: float = 2.0) -> np.ndarray:
    attack_n = max(1, int(attack * SR))
    env = np.ones(length)
    env[:attack_n] = np.linspace(0, 1, attack_n) ** 0.55
    tail = np.linspace(1, 0, max(1, length - attack_n)) ** curve
    env[attack_n:] = tail[: length - attack_n]
    if decay > 0:
        env *= np.exp(-np.arange(length) / (decay * SR))
    return env


def one_pole_lowpass(x: np.ndarray, cutoff: float) -> np.ndarray:
    alpha = 1 - math.exp(-2 * math.pi * cutoff / SR)
    out = np.empty_like(x)
    acc = 0.0
    for i, sample in enumerate(x):
        acc += alpha * (sample - acc)
        out[i] = acc
    return out


def band_noise(length: int, low: float, high: float, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    noise = rng.standard_normal(length)
    # Cheap band shaping: subtract two one-pole filters.
    lo = one_pole_lowpass(noise, high)
    hi = one_pole_lowpass(noise, low)
    return lo - hi


def engine_start() -> np.ndarray:
    seconds = 2.6
    n = int(seconds * SR)
    time = np.arange(n) / SR
    out = np.zeros(n)

    # Starter motor: dry, uneven crank pulses.
    starter = envelope(n, 0.02, 0.9, 1.4)
    crank = 0.5 + 0.5 * np.sin(2 * math.pi * 11.0 * time)
    starter_noise = band_noise(n, 90, 1800, 11) * (0.6 + 0.4 * crank)
    out += starter_noise * starter * 0.34

    # Engine catch: low harmonic stack that settles into an idle.
    catch = 1 / (1 + np.exp(-(time - 0.92) * 16))
    idle = 0.5 + 0.5 * np.sin(2 * math.pi * 1.7 * time)
    low = (
        np.sin(2 * math.pi * 46 * time) * 0.55
        + np.sin(2 * math.pi * 92 * time) * 0.3
        + np.sin(2 * math.pi * 138 * time) * 0.16
        + np.sin(2 * math.pi * 184 * time) * 0.08
    )
    low *= 0.72 + 0.28 * idle
    low = one_pole_lowpass(low, 420)
    out += low * catch * 0.62

    # Combustion texture.
    texture = band_noise(n, 60, 900, 17)
    texture = one_pole_lowpass(texture, 640)
    out += texture * catch * (0.18 + 0.1 * idle)

    # A single mechanical clunk when the bonnet is opened.
    clunk_at = int(2.05 * SR)
    clunk_len = int(0.22 * SR)
    clunk = band_noise(clunk_len, 40, 900, 23) * envelope(clunk_len, 0.004, 0.06, 2.8)
    out[clunk_at : clunk_at + clunk_len] += clunk * 0.28

    out *= envelope(n, 0.01, 0.0, 0.0)
    out[-int(0.15 * SR) :] *= np.linspace(1, 0, int(0.15 * SR))
    return out


def workshop_ambience() -> np.ndarray:
    seconds = 5.0
    n = int(seconds * SR)
    rng = np.random.default_rng(41)
    base = one_pole_lowpass(rng.standard_normal(n), 180) * 0.55
    base += one_pole_lowpass(rng.standard_normal(n), 520) * 0.18
    # Distant metallic ticks.
    for at, gain in [(0.7, 0.05), (1.9, 0.04), (3.4, 0.055), (4.3, 0.03)]:
        start = int(at * SR)
        length = int(0.5 * SR)
        tick = band_noise(length, 700, 3400, int(at * 100)) * envelope(length, 0.002, 0.18, 3.2)
        base[start : start + length] += tick * gain
    fade = np.ones(n)
    fade[: int(0.3 * SR)] = np.linspace(0, 1, int(0.3 * SR))
    fade[-int(0.6 * SR) :] = np.linspace(1, 0, int(0.6 * SR))
    return base * fade


def phone_ring() -> np.ndarray:
    seconds = 2.2
    n = int(seconds * SR)
    time = np.arange(n) / SR
    out = np.zeros(n)
    # Two classic ring bursts.
    for start in (0.05, 1.1):
        start_n = int(start * SR)
        length = int(0.82 * SR)
        local = np.arange(length) / SR
        tone = (
            np.sin(2 * math.pi * 440 * local) * 0.6
            + np.sin(2 * math.pi * 480 * local) * 0.4
        )
        warble = 0.5 + 0.5 * np.sin(2 * math.pi * 20 * local)
        tone *= 0.55 + 0.45 * warble
        tone *= envelope(length, 0.01, 0.0, 0.0)
        tone[-int(0.03 * SR) :] *= np.linspace(1, 0, int(0.03 * SR))
        out[start_n : start_n + length] += tone * 0.5
    return out


def ratchet() -> np.ndarray:
    seconds = 0.95
    n = int(seconds * SR)
    out = np.zeros(n)
    rng = np.random.default_rng(7)
    for i in range(9):
        at = int((0.035 + i * 0.095) * SR)
        length = int(0.085 * SR)
        tick = band_noise(length, 1200, 5200, 70 + i) * envelope(length, 0.001, 0.045, 3.6)
        tick += np.sin(2 * math.pi * 1350 * np.arange(length) / SR) * envelope(
            length, 0.001, 0.025, 4.0
        ) * 0.35
        out[at : at + length] += tick * (1 - i * 0.06)
    out += one_pole_lowpass(rng.standard_normal(n), 200) * 0.06
    return out


def tool_drop() -> np.ndarray:
    n = int(0.9 * SR)
    out = np.zeros(n)
    for at, gain, pitch in [(0.02, 0.8, 220), (0.18, 0.35, 180), (0.33, 0.18, 140)]:
        start = int(at * SR)
        length = int(0.5 * SR)
        local = np.arange(length) / SR
        metal = (
            np.sin(2 * math.pi * pitch * local) * 0.3
            + np.sin(2 * math.pi * pitch * 2.41 * local) * 0.18
            + np.sin(2 * math.pi * pitch * 3.77 * local) * 0.1
        )
        metal *= envelope(length, 0.002, 0.18, 3.4)
        out[start : start + length] += metal * gain
    return out


def approval_tone() -> np.ndarray:
    seconds = 1.6
    n = int(seconds * SR)
    time = np.arange(n) / SR
    notes = [(784.0, 0.0), (1046.5, 0.18), (1318.5, 0.36)]
    out = np.zeros(n)
    for freq, at in notes:
        start = int(at * SR)
        length = int((seconds - at) * SR)
        local = np.arange(length) / SR
        tone = (
            np.sin(2 * math.pi * freq * local) * 0.7
            + np.sin(2 * math.pi * freq * 2 * local) * 0.18
        )
        tone *= envelope(length, 0.008, 0.7, 2.4)
        out[start : start + length] += tone * 0.32
    return out


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    write_wav("engine-start.wav", engine_start())
    write_wav("workshop-ambience.wav", workshop_ambience())
    write_wav("phone-ring.wav", phone_ring())
    write_wav("ratchet.wav", ratchet())
    write_wav("tool-drop.wav", tool_drop())
    write_wav("approval-tone.wav", approval_tone())
    for path in sorted(OUT.glob("*.wav")):
        print(path, f"{path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
