#!/usr/bin/env python3
"""Original Foley for the McDonald's AI drive-thru episode.

All sounds are synthesised locally with numpy, then encoded to MP3 with ffmpeg.
No external sample libraries are used. Cues are intentionally short so they can
be placed frame-accurately under the narration.
"""
from __future__ import annotations

import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path("public/audio/episodes/mcdonalds/sfx")
RNG = np.random.default_rng(20260617)


def t(seconds: float) -> np.ndarray:
    return np.arange(int(seconds * SR), dtype=np.float64) / SR


def env(n: int, attack: float, decay: float) -> np.ndarray:
    a = max(1, int(attack * SR))
    d = max(1, int(decay * SR))
    e = np.ones(n)
    e[:a] = np.linspace(0, 1, a) ** 1.6
    tail = min(d, n)
    e[-tail:] *= np.linspace(1, 0, tail) ** 2.2
    return e


def sine(freq: float, seconds: float, amp: float = 0.5) -> np.ndarray:
    return amp * np.sin(2 * np.pi * freq * t(seconds))


def sweep(f0: float, f1: float, seconds: float, amp: float = 0.5) -> np.ndarray:
    x = t(seconds)
    freq = np.linspace(f0, f1, len(x))
    phase = 2 * np.pi * np.cumsum(freq) / SR
    return amp * np.sin(phase)


def noise(seconds: float, amp: float = 0.4) -> np.ndarray:
    return amp * RNG.standard_normal(int(seconds * SR))


def lowpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    """Simple one-pole cascade; enough for Foley shaping."""
    alpha = 1 - np.exp(-2 * np.pi * cutoff / SR)
    y = x.copy()
    for _ in range(order):
        z = 0.0
        out = np.empty_like(y)
        for i, value in enumerate(y):
            z += alpha * (value - z)
            out[i] = z
        y = out
    return y


def highpass(x: np.ndarray, cutoff: float, order: int = 2) -> np.ndarray:
    return x - lowpass(x, cutoff, order)


def add(*parts: np.ndarray) -> np.ndarray:
    n = max(len(p) for p in parts)
    out = np.zeros(n)
    for p in parts:
        out[: len(p)] += p
    return out


def reverb(x: np.ndarray, delay: float, feedback: float, mix: float) -> np.ndarray:
    d = int(delay * SR)
    out = x.copy()
    for tap in range(1, 5):
        shift = d * tap
        if shift >= len(out):
            break
        out[shift:] += x[:-shift] * (feedback**tap) * mix
    return out


def normalise(x: np.ndarray, peak: float = 0.82) -> np.ndarray:
    m = np.max(np.abs(x)) or 1.0
    return x / m * peak


def write_mp3(name: str, x: np.ndarray) -> None:
    x = normalise(x.astype(np.float64))
    pcm = (np.clip(x, -1, 1) * 32767).astype(np.int16)
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="mcd-foley-") as tmp:
        wav = Path(tmp) / "sound.wav"
        with wave.open(str(wav), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(SR)
            w.writeframes(pcm.tobytes())
        subprocess.run(
            [
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(wav), "-ar", "48000", "-ac", "1",
                "-c:a", "libmp3lame", "-b:a", "160k", str(OUT / f"{name}.mp3"),
            ],
            check=True,
        )
    print(f"{name}.mp3  {len(x) / SR:.2f}s")


def drive_thru_ambience() -> np.ndarray:
    seconds = 12.0
    n = int(seconds * SR)
    # Low city / parking-lot hum.
    hum = 0.12 * np.sin(2 * np.pi * 52 * t(seconds))
    hum += 0.05 * np.sin(2 * np.pi * 104 * t(seconds))
    rumble = lowpass(noise(seconds, 0.22), 160, 2)
    air = lowpass(noise(seconds, 0.06), 1400, 1)
    # Distant cars passing.
    passes = np.zeros(n)
    for start_s, length_s, amp in [(1.1, 2.8, 0.1), (6.0, 3.4, 0.075)]:
        start = int(start_s * SR)
        length = int(length_s * SR)
        p = lowpass(noise(length_s, amp), 420, 2)
        p *= np.sin(np.linspace(0, np.pi, length)) ** 2
        passes[start:start + length] += p
    bed = add(hum, rumble, air, passes)
    fade = np.ones(n)
    fade[: int(0.8 * SR)] = np.linspace(0, 1, int(0.8 * SR))
    fade[-int(0.8 * SR):] = np.linspace(1, 0, int(0.8 * SR))
    return bed * fade


def car_idle() -> np.ndarray:
    seconds = 4.0
    base = 0.26 * np.sin(2 * np.pi * 38 * t(seconds))
    base += 0.1 * np.sin(2 * np.pi * 76 * t(seconds))
    texture = lowpass(noise(seconds, 0.26), 220, 2)
    wobble = 1 + 0.08 * np.sin(2 * np.pi * 0.7 * t(seconds))
    return (base + texture) * wobble * env(len(base), 0.35, 0.7)


def ai_listen() -> np.ndarray:
    seconds = 1.05
    a = sine(640, seconds, 0.24) * env(int(seconds * SR), 0.02, 0.45)
    b = sine(960, seconds, 0.2) * env(int(seconds * SR), 0.02, 0.45)
    b[: int(0.22 * SR)] = 0
    x = add(a, b)
    x = reverb(x, 0.07, 0.28, 0.25)
    return x


def ai_confirm() -> np.ndarray:
    seconds = 0.85
    n = int(seconds * SR)
    x = np.zeros(n)
    first = sine(880, 0.32, 0.3) * env(int(0.32 * SR), 0.01, 0.1)
    second = sine(1320, 0.45, 0.26) * env(int(0.45 * SR), 0.01, 0.2)
    x[: len(first)] += first
    offset = int(0.18 * SR)
    x[offset: offset + len(second)] += second
    return reverb(x, 0.055, 0.22, 0.18)


def item_pop() -> np.ndarray:
    seconds = 0.26
    x = sweep(520, 180, seconds, 0.5) * env(int(seconds * SR), 0.004, 0.16)
    click = highpass(noise(0.03, 0.25), 1800, 1)
    x[: len(click)] += click
    return x


def error_buzz() -> np.ndarray:
    seconds = 0.55
    x = t(seconds)
    buzz = 0.22 * np.sign(np.sin(2 * np.pi * 138 * x))
    buzz += 0.1 * np.sin(2 * np.pi * 276 * x)
    buzz *= 1 + 0.18 * np.sin(2 * np.pi * 8 * x)
    return lowpass(buzz, 2200, 1) * env(len(buzz), 0.01, 0.22)


def receipt_print() -> np.ndarray:
    seconds = 1.0
    n = int(seconds * SR)
    x = np.zeros(n)
    # Stepper motor buzz.
    motor = 0.1 * np.sign(np.sin(2 * np.pi * 62 * t(seconds)))
    motor = lowpass(motor, 900, 2)
    x += motor
    # Paper feed ticks.
    for i in range(14):
        pos = int((0.05 + i * 0.055) * SR)
        tick = highpass(noise(0.018, 0.18), 2200, 1)
        x[pos: pos + len(tick)] += tick
    x *= env(n, 0.01, 0.18)
    return x


def power_down() -> np.ndarray:
    seconds = 1.7
    x = sweep(420, 48, seconds, 0.36) * env(int(seconds * SR), 0.02, 0.9)
    air = lowpass(noise(seconds, 0.16), 700, 2) * env(int(seconds * SR), 0.01, 1.1)
    thud = sine(54, 0.5, 0.3) * env(int(0.5 * SR), 0.004, 0.3)
    out = add(x, air)
    out[-len(thud):] += thud
    return out


def human_transfer() -> np.ndarray:
    seconds = 1.5
    n = int(seconds * SR)
    x = np.zeros(n)
    for i, freq in enumerate([523.25, 659.25, 783.99]):
        note = sine(freq, 1.4, 0.16) * env(int(1.4 * SR), 0.02, 1.0)
        offset = int(i * 0.06 * SR)
        end = min(n, offset + len(note))
        x[offset:end] += note[: end - offset]
    return reverb(x, 0.09, 0.3, 0.28)


def ui_scan() -> np.ndarray:
    seconds = 0.9
    x = sweep(220, 1600, seconds, 0.16)
    x *= np.sin(np.linspace(0, np.pi, len(x))) ** 1.4
    air = highpass(noise(seconds, 0.08), 1200, 1)
    air *= np.linspace(0, 1, len(air)) ** 2
    return add(x, air)


def glitch() -> np.ndarray:
    seconds = 0.42
    n = int(seconds * SR)
    x = np.zeros(n)
    for i in range(9):
        length = int(RNG.uniform(0.018, 0.05) * SR)
        pos = int(RNG.uniform(0, seconds - 0.05) * SR)
        burst = np.sign(RNG.standard_normal(length)) * RNG.uniform(0.1, 0.3)
        x[pos: pos + length] += burst
    x = lowpass(x, 3200, 1)
    return x * env(n, 0.005, 0.12)


def main() -> None:
    write_mp3("drive-thru-ambience", drive_thru_ambience())
    write_mp3("car-idle", car_idle())
    write_mp3("ai-listen", ai_listen())
    write_mp3("ai-confirm", ai_confirm())
    write_mp3("item-pop", item_pop())
    write_mp3("error-buzz", error_buzz())
    write_mp3("receipt-print", receipt_print())
    write_mp3("power-down", power_down())
    write_mp3("human-transfer", human_transfer())
    write_mp3("ui-scan", ui_scan())
    write_mp3("glitch", glitch())


if __name__ == "__main__":
    main()
