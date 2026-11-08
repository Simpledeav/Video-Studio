#!/usr/bin/env python3
"""Synthesise the small original Foley set for the football episode.

Nothing here is sampled or downloaded. The crowd bed is filtered noise with
slow, decorrelated swells; the whistle, ball strike, contract stamp and
notification are simple deterministic synth voices. Lightweight by design:
mono/stereo 48 kHz MP3s under 250 KB each.
"""
from __future__ import annotations

import subprocess
from pathlib import Path

import numpy as np

SR = 48000
OUT = Path("public/audio/episodes/football/sfx")
RNG = np.random.default_rng(7)


def write(name: str, signal: np.ndarray, bitrate: str = "128k") -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    signal = np.asarray(signal, dtype=np.float32)
    peak = float(np.max(np.abs(signal))) or 1.0
    signal = signal / peak * 0.92
    wav = OUT / f"{name}.wav"
    mp3 = OUT / f"{name}.mp3"
    pcm = (np.clip(signal, -1, 1) * 32767).astype(np.int16)
    channels = 2 if signal.ndim == 2 else 1
    if channels == 2:
        interleaved = np.stack([pcm[0], pcm[1]], axis=1).reshape(-1)
    else:
        interleaved = pcm
    import wave

    with wave.open(str(wav), "wb") as handle:
        handle.setnchannels(channels)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(interleaved.tobytes())
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav),
         "-c:a", "libmp3lame", "-b:a", bitrate, str(mp3)],
        check=True,
    )
    wav.unlink()
    print(f"{mp3} {mp3.stat().st_size / 1024:.0f} KB")


def env(n: int, attack: float, decay: float, power: float = 2.0) -> np.ndarray:
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    d = np.exp(-np.maximum(0, t - attack) / max(decay, 1e-4))
    return (a * d) ** power


def lowpass(x: np.ndarray, alpha: float) -> np.ndarray:
    y = np.empty_like(x)
    acc = 0.0
    for i, value in enumerate(x):
        acc += alpha * (value - acc)
        y[i] = acc
    return y


def crowd() -> None:
    seconds = 14.0
    n = int(seconds * SR)
    t = np.arange(n) / SR
    left = np.zeros(n)
    right = np.zeros(n)
    for channel, target in ((0, left), (1, right)):
        noise = RNG.standard_normal(n)
        rumble = lowpass(noise, 0.0022)
        murmur = lowpass(RNG.standard_normal(n), 0.045) * 0.55
        air = lowpass(RNG.standard_normal(n), 0.14) * 0.18
        body = rumble * 1.0 + murmur + air
        # slow stand-level swells, different phase per channel
        swell = (
            0.72
            + 0.16 * np.sin(2 * np.pi * (0.071 + channel * 0.004) * t + 0.4)
            + 0.08 * np.sin(2 * np.pi * 0.19 * t + 1.7 + channel)
        )
        target[:] = body * swell
    stereo = np.stack([left, right])
    stereo = np.tanh(stereo * 1.4) * 0.55
    # fade the loop edges so it can be looped in Remotion without a click
    fade = int(0.8 * SR)
    ramp = np.linspace(0, 1, fade)
    stereo[:, :fade] *= ramp
    stereo[:, -fade:] *= ramp[::-1]
    write("crowd-loop", stereo, "112k")


def whistle() -> None:
    seconds = 0.78
    n = int(seconds * SR)
    t = np.arange(n) / SR
    f = 2320 + 26 * np.sin(2 * np.pi * 22 * t) - 220 * np.clip((t - 0.5) / 0.28, 0, 1)
    phase = 2 * np.pi * np.cumsum(f) / SR
    tone = np.sin(phase) * 0.6 + np.sin(phase * 1.32) * 0.22 + np.sin(phase * 1.98) * 0.08
    breath = lowpass(RNG.standard_normal(n), 0.28) * 0.28
    e = env(n, 0.018, 0.3, 1.1)
    e[-int(0.09 * SR):] *= np.linspace(1, 0, int(0.09 * SR))
    write("referee-whistle", (tone + breath) * e, "128k")


def kick() -> None:
    seconds = 0.34
    n = int(seconds * SR)
    t = np.arange(n) / SR
    f = 150 * np.exp(-t * 18) + 42
    thump = np.sin(2 * np.pi * np.cumsum(f) / SR)
    click = lowpass(RNG.standard_normal(n), 0.5) * np.exp(-t * 90) * 0.8
    e = env(n, 0.004, 0.12, 1.4)
    write("ball-kick", (thump * 0.9 + click) * e, "128k")


def stamp() -> None:
    seconds = 0.46
    n = int(seconds * SR)
    t = np.arange(n) / SR
    thud = np.sin(2 * np.pi * 86 * t) * np.exp(-t * 28)
    slap = lowpass(RNG.standard_normal(n), 0.32) * np.exp(-t * 55) * 0.9
    paper = lowpass(RNG.standard_normal(n), 0.08) * np.exp(-t * 12) * 0.35
    write("contract-stamp", (thud + slap + paper), "128k")


def notification() -> None:
    seconds = 1.05
    n = int(seconds * SR)
    out = np.zeros(n)
    for start, freq, gain in ((0.0, 880, 0.5), (0.16, 1318, 0.4)):
        offset = int(start * SR)
        length = min(n - offset, int(0.8 * SR))
        t = np.arange(length) / SR
        tone = np.sin(2 * np.pi * freq * t) + 0.2 * np.sin(2 * np.pi * freq * 2 * t)
        e = env(length, 0.006, 0.19, 1.5)
        out[offset:offset + length] += tone * e * gain
    click = lowpass(RNG.standard_normal(n), 0.5) * np.exp(-np.arange(n) / SR * 90) * 0.25
    write("phone-notification", out + click, "128k")


def crowd_swell() -> None:
    seconds = 3.2
    n = int(seconds * SR)
    t = np.arange(n) / SR
    noise = lowpass(RNG.standard_normal(n), 0.02)
    swell = np.clip(t / 1.4, 0, 1) ** 1.4 * np.exp(-np.maximum(0, t - 1.5) / 0.55)
    tone = np.sin(2 * np.pi * 110 * t) * 0.2 + np.sin(2 * np.pi * 220 * t) * 0.08
    write("crowd-swell", (noise * 0.8 + tone) * swell, "112k")


if __name__ == "__main__":
    crowd()
    whistle()
    kick()
    stamp()
    notification()
    crowd_swell()
