#!/usr/bin/env python3
"""Generate original soundtrack and sound effects for the Kodak case study.

Composes:
  1. `kodak-score-80s.mp3`: 80-second modern minimalist technology documentary soundtrack.
     Progression:
       00:00–00:19: Minimal electronic ambience, delicate warm piano, subtle analog sub-bass.
       00:19–00:32: Subtle technological pulse as Steven Sasson's 1975 prototype appears.
       00:32–00:44: Restrained tension: analog warmth vs digital precision.
       00:44–00:56: Darker harmonic movement during Chapter 11 bankruptcy.
       00:56–01:11: Open, forward-looking transformation (bright chords, modern clarity).
       01:11–01:20: Soft, elegant resolution into Simpledeav signature.
  2. Precision sound effects:
     - `camera-shutter.mp3` (tactile mechanical SLR shutter click)
     - `film-wind.mp3` (classic 35mm film advance lever)
     - `film-roll-place.mp3` (tactile film canister set down)
     - `sensor-hum.mp3` (subtle CCD sensor frequency chime)
     - `pixel-grid-scan.mp3` (soft digital scanning raster sound)
     - `interface-shift.mp3` (clean Swiss editorial layout transition)
     - `calendar-tick.mp3` (crisp date/time advance tick)
     - `data-drop.mp3` (restrained financial inflection impact)
     - `paper-slide.mp3` (smooth physical photograph movement)
     - `brand-signature.mp3` (warm, resonant Simpledeav closing chime)
"""
from __future__ import annotations

import math
import subprocess
import wave
from pathlib import Path

import numpy as np

SR = 48000
TOTAL_DUR = 80.0
TOTAL_SAMPLES = int(TOTAL_DUR * SR)

ROOT = Path(__file__).resolve().parent.parent
SCORE_OUT = ROOT / "public/audio/episodes/kodak/music"
SFX_OUT = ROOT / "public/audio/episodes/kodak/sfx"
SCORE_OUT.mkdir(parents=True, exist_ok=True)
SFX_OUT.mkdir(parents=True, exist_ok=True)

rng = np.random.default_rng(1975)


def adsr(length: int, a: float, d: float, s: float, r: float) -> np.ndarray:
    env = np.zeros(length, dtype=np.float32)
    na = int(a * SR)
    nd = int(d * SR)
    nr = int(r * SR)
    ns = max(0, length - na - nd - nr)

    idx = 0
    if na > 0:
        env[idx: idx + na] = np.linspace(0, 1, na)
        idx += na
    if nd > 0:
        env[idx: idx + nd] = np.linspace(1, s, nd)
        idx += nd
    if ns > 0:
        env[idx: idx + ns] = s
        idx += ns
    rem = length - idx
    if rem > 0:
        env[idx:] = np.linspace(s if ns > 0 else (1 if nd == 0 else s), 0, rem)
    return env


def bp(x: np.ndarray, lo: float, hi: float) -> np.ndarray:
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1.0 / SR)
    mask = 1.0 / (1.0 + np.exp(-(f - lo) / (lo * 0.15 + 1))) * 1.0 / (1.0 + np.exp((f - hi) / (hi * 0.15 + 1)))
    return np.fft.irfft(X * mask, len(x))


def lp(x: np.ndarray, cut: float) -> np.ndarray:
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1.0 / SR)
    m = 1.0 / (1.0 + np.exp(-(f - cut) / (cut * 0.18 + 1)))
    return np.fft.irfft(X * m, len(x))


def write_mp3(path: Path, x: np.ndarray, bitrate="192k") -> None:
    peak = np.max(np.abs(x)) + 1e-9
    x_norm = (x / peak * 0.92) if peak > 0.92 else x
    pcm = (np.clip(x_norm, -1.0, 1.0) * 32767).astype(np.int16)
    tmp_wav = path.with_suffix(".wav")
    with wave.open(str(tmp_wav), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    subprocess.run(
        [
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
            "-i", str(tmp_wav), "-ar", "48000", "-ac", "2",
            "-c:a", "libmp3lame", "-b:a", bitrate, str(path)
        ],
        check=True,
    )
    tmp_wav.unlink(missing_ok=True)
    print(f"Generated {path.name} ({len(x)/SR:.2f}s)")


# ============================================================================
# 1. COMPOSE THE 80-SECOND KODAK EDITORIAL SCORE
# ============================================================================
def generate_soundtrack() -> None:
    score = np.zeros(TOTAL_SAMPLES, dtype=np.float32)

    # BPM = 110 -> 1 beat = 0.5454s, 1 bar (4 beats) = 2.1818s
    beat_dur = 60.0 / 110.0
    bar_dur = beat_dur * 4.0
    total_bars = int(TOTAL_DUR / bar_dur) + 1

    # Harmonic palette:
    # Warm contemplative foundation (analog warmth): Fmaj9 -> Am7 -> Cmaj7 -> Gsus4
    # Invention section (1975 prototype): crisp technological motif
    # Conflict/Collapse: Dm7 -> Am9 -> Bbmaj7 -> F tension
    # Resolution: Cmaj9 -> Fmaj7/A -> C/E -> Cmaj (bright, forward)
    chords_warm = [
        ([174.61, 220.0, 261.63, 329.63, 392.0], 43.65),   # Fmaj9 (F1 root)
        ([110.0, 164.81, 220.0, 261.63, 329.63], 55.0),    # Am9 (A1 root)
        ([130.81, 164.81, 196.0, 246.94, 293.66], 65.41),  # Cmaj9 (C2 root)
        ([98.0, 146.83, 196.0, 261.63, 293.66], 49.0),     # Gsus4 (G1 root)
    ]

    # --- TRACK 1: Sub Bass & Warm Moog-style Foundation ---
    bass_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    for bar_idx in range(total_bars):
        bar_start = bar_idx * bar_dur
        chord_idx = bar_idx % len(chords_warm)
        root_freq = chords_warm[chord_idx][1]

        t_sec = bar_start
        if 44.0 <= t_sec < 56.0:
            # Tense bankruptcy section: lower Dm/A tension
            root_freq = 36.71 if (bar_idx % 2 == 0) else 55.0
        elif 56.0 <= t_sec < 71.0:
            # Open, clean F to C
            root_freq = 43.65 if (bar_idx % 2 == 0) else 65.41

        bar_len = int(bar_dur * SR)
        b_idx_start = int(bar_start * SR)
        if b_idx_start + bar_len > TOTAL_SAMPLES:
            bar_len = TOTAL_SAMPLES - b_idx_start
        if bar_len <= 0:
            break

        t_bar = np.linspace(0, bar_len / SR, bar_len, endpoint=False)
        bass_note = np.sin(2 * np.pi * root_freq * t_bar) * 0.72 + \
                    np.sin(2 * np.pi * root_freq * 2 * t_bar) * 0.22
        env_bar = (0.7 + 0.3 * np.cos(2 * np.pi * (t_bar / (beat_dur * 2)))) * \
                  np.exp(-t_bar / (bar_dur * 1.5))
        bass_track[b_idx_start: b_idx_start + bar_len] += bass_note * env_bar

    bass_track = lp(bass_track, 200.0)

    # --- TRACK 2: Minimalist Technological Pulse & Shimmer ---
    pulse_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    sixteenth_dur = beat_dur / 4.0
    total_16ths = int(TOTAL_DUR / sixteenth_dur)

    for step in range(total_16ths):
        step_time = step * sixteenth_dur
        step_idx = int(step_time * SR)
        if step_idx >= TOTAL_SAMPLES:
            break

        vol = 0.0
        if 0.0 <= step_time < 19.0:
            # Very subtle atmospheric pulse
            vol = 0.12 if (step % 4 == 0) else (0.05 if step % 2 == 0 else 0.0)
        elif 19.0 <= step_time < 32.0:
            # Subtle digital pulse as Steven Sasson builds prototype
            vol = 0.24 if (step % 4 == 0) else (0.12 if step % 2 == 0 else 0.06)
        elif 32.0 <= step_time < 44.0:
            # Restrained dual rhythm (analog vs digital)
            vol = 0.26 if (step % 2 == 0) else 0.10
        elif 44.0 <= step_time < 56.0:
            # Tense clockwork during collapse
            vol = 0.30 if (step % 2 == 0) else 0.14
        elif 56.0 <= step_time < 71.0:
            # Fluid, rolling modern pulse
            vol = 0.22 if (step % 4 == 0) else 0.12
        elif 71.0 <= step_time < 78.0:
            # Soft resolution fade
            fade = max(0.0, (78.0 - step_time) / 7.0)
            vol = 0.10 * fade if (step % 4 == 0) else 0.0

        if vol <= 0.001:
            continue

        tick_len = int(0.022 * SR)
        if step_idx + tick_len > TOTAL_SAMPLES:
            tick_len = TOTAL_SAMPLES - step_idx
        t_tick = np.linspace(0, tick_len / SR, tick_len, endpoint=False)
        tick_wave = (rng.standard_normal(tick_len) * 0.35 +
                     np.sin(2 * np.pi * 3800 * t_tick) * 0.65) * np.exp(-t_tick / 0.004)
        pulse_track[step_idx: step_idx + tick_len] += tick_wave * vol

    # --- TRACK 3: Ambient Electric Piano & Synthesizer Textures ---
    piano_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    for bar_idx in range(total_bars):
        bar_start = bar_idx * bar_dur
        chord_idx = bar_idx % len(chords_warm)
        chord_freqs = chords_warm[chord_idx][0]

        t_sec = bar_start
        gain = 0.0
        if 0.0 <= t_sec < 19.0:
            gain = 0.16  # soft and intimate
        elif 19.0 <= t_sec < 32.0:
            gain = 0.22  # curious, technological
            chord_freqs = [220.0, 261.63, 329.63, 440.0]  # clean A minor chime
        elif 32.0 <= t_sec < 44.0:
            gain = 0.20  # analytical
        elif 44.0 <= t_sec < 56.0:
            gain = 0.14  # stark, darker
            chord_freqs = [146.83, 220.0, 293.66, 349.23]  # Dm tension
        elif 56.0 <= t_sec < 71.0:
            gain = 0.26  # bright, forward-looking
            chord_freqs = [174.61, 220.0, 261.63, 329.63, 392.0]  # Fmaj9
        elif 71.0 <= t_sec < 78.5:
            fade = max(0.0, (78.5 - t_sec) / 8.0)
            gain = 0.18 * fade
            chord_freqs = [130.81, 196.0, 261.63, 329.63]  # Cmaj resolve

        if gain <= 0.001:
            continue

        chord_len = int(bar_dur * 1.3 * SR)
        c_idx_start = int(bar_start * SR)
        if c_idx_start + chord_len > TOTAL_SAMPLES:
            chord_len = TOTAL_SAMPLES - c_idx_start
        if chord_len <= 0:
            break

        t_c = np.linspace(0, chord_len / SR, chord_len, endpoint=False)
        chord_sound = np.zeros(chord_len, dtype=np.float32)
        for f in chord_freqs:
            note = (np.sin(2 * np.pi * f * t_c) * 0.7 +
                    np.sin(2 * np.pi * f * 2 * t_c) * 0.22 +
                    np.sin(2 * np.pi * f * 3 * t_c) * 0.08) * np.exp(-t_c / (bar_dur * 0.9))
            chord_sound += note

        piano_track[c_idx_start: c_idx_start + chord_len] += chord_sound * gain

    # Master Sum & Filter
    score = bass_track * 0.85 + pulse_track * 0.70 + piano_track * 0.80

    # Gentle broadcast normalization for documentary bed
    peak = np.max(np.abs(score)) + 1e-9
    score = score / peak * 0.88

    write_mp3(SCORE_OUT / "kodak-score-80s.mp3", score)


# ============================================================================
# 2. GENERATE KODAK PRECISION SOUND DESIGN & FOLEY
# ============================================================================
def generate_sfx() -> None:
    # 1. Camera Shutter (Tactile mechanical SLR shutter click & mirror flip)
    dur = 0.45
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    # Two crisp impulses: mirror release (0ms) and shutter curtain close (65ms)
    s1 = np.exp(-t / 0.008) * np.sin(2 * np.pi * 1800 * t) * 0.8
    s1 += rng.standard_normal(n) * np.exp(-t / 0.012) * 0.5
    t2 = np.maximum(0, t - 0.065)
    s2 = np.exp(-t2 / 0.015) * np.sin(2 * np.pi * 950 * t2) * 0.9
    s2 += rng.standard_normal(n) * np.exp(-t2 / 0.02) * 0.6
    shutter = bp(s1 + s2, 300, 7500)
    write_mp3(SFX_OUT / "camera-shutter.mp3", shutter)

    # 2. Film Winding (Classic ratcheting film advance lever)
    dur = 0.65
    n = int(dur * SR)
    wind = np.zeros(n, dtype=np.float32)
    clicks = 8
    for i in range(clicks):
        c_time = i * (dur / clicks)
        c_idx = int(c_time * SR)
        c_len = int(0.025 * SR)
        if c_idx + c_len > n:
            break
        tc = np.linspace(0, 0.025, c_len, endpoint=False)
        click_sound = (np.sin(2 * np.pi * (2400 + i * 150) * tc) * 0.6 +
                       rng.standard_normal(c_len) * 0.4) * np.exp(-tc / 0.005)
        wind[c_idx: c_idx + c_len] += click_sound
    wind = bp(wind, 800, 6000)
    write_mp3(SFX_OUT / "film-wind.mp3", wind)

    # 3. Film Roll Placement (Solid tactile canister set-down)
    dur = 0.35
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    thud = np.sin(2 * np.pi * 140 * t) * np.exp(-t / 0.04) * 0.8
    click = (np.sin(2 * np.pi * 3200 * t) * 0.5 + rng.standard_normal(n) * 0.5) * np.exp(-t / 0.008)
    place = lp(thud + click * 0.4, 2500)
    write_mp3(SFX_OUT / "film-roll-place.mp3", place)

    # 4. Sensor Hum / Electronic Activation (CCD sensor frequency chime)
    dur = 0.85
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    hum = (np.sin(2 * np.pi * 1760 * t) * 0.4 +
           np.sin(2 * np.pi * 3520 * t) * 0.25 +
           np.sin(2 * np.pi * 5280 * t) * 0.15) * adsr(n, 0.04, 0.2, 0.4, 0.3)
    write_mp3(SFX_OUT / "sensor-hum.mp3", hum)

    # 5. Pixel Grid Scan (Soft digital raster scan)
    dur = 0.70
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    freq = np.linspace(800, 4200, n)
    scan = np.sin(2 * np.pi * freq * t) * 0.3 * adsr(n, 0.05, 0.15, 0.6, 0.2)
    scan += rng.standard_normal(n) * 0.15 * adsr(n, 0.05, 0.1, 0.4, 0.2)
    scan = bp(scan, 600, 5000)
    write_mp3(SFX_OUT / "pixel-grid-scan.mp3", scan)

    # 6. Interface Shift (Clean Swiss editorial layout transition)
    dur = 0.30
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    shift = (rng.standard_normal(n) * np.exp(-t / 0.04) * 0.3 +
             np.sin(2 * np.pi * 880 * t) * np.exp(-t / 0.02) * 0.7)
    shift = bp(shift, 400, 4500)
    write_mp3(SFX_OUT / "interface-shift.mp3", shift)

    # 7. Calendar Tick (Crisp date / calendar advance tick)
    dur = 0.15
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    tick = (np.sin(2 * np.pi * 2800 * t) * 0.7 + rng.standard_normal(n) * 0.3) * np.exp(-t / 0.01)
    write_mp3(SFX_OUT / "calendar-tick.mp3", tick)

    # 8. Data Drop (Restrained low-frequency financial inflection impact)
    dur = 0.80
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    f_drop = np.linspace(95, 38, n)
    sub = np.sin(2 * np.pi * f_drop * t) * np.exp(-t / 0.28) * 0.85
    click = np.sin(2 * np.pi * 1200 * t) * np.exp(-t / 0.008) * 0.35
    drop = lp(sub + click, 800)
    write_mp3(SFX_OUT / "data-drop.mp3", drop)

    # 9. Paper Slide (Smooth physical photograph / print movement)
    dur = 0.40
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    paper = rng.standard_normal(n) * adsr(n, 0.04, 0.1, 0.7, 0.15) * 0.4
    paper = bp(paper, 1200, 6500)
    write_mp3(SFX_OUT / "paper-slide.mp3", paper)

    # 10. Brand Signature (Warm, resonant Simpledeav closing bell)
    dur = 2.4
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    # Warm C major 9th chord (C4, E4, G4, B4, D5)
    bell = (np.sin(2 * np.pi * 261.63 * t) * 0.40 * np.exp(-t / 1.4) +
            np.sin(2 * np.pi * 329.63 * t) * 0.25 * np.exp(-t / 1.2) +
            np.sin(2 * np.pi * 392.00 * t) * 0.20 * np.exp(-t / 1.1) +
            np.sin(2 * np.pi * 493.88 * t) * 0.15 * np.exp(-t / 0.9) +
            np.sin(2 * np.pi * 587.33 * t) * 0.10 * np.exp(-t / 0.8))
    write_mp3(SFX_OUT / "brand-signature.mp3", bell)


if __name__ == "__main__":
    print("Synthesizing 80-second soundtrack for Kodak case study...")
    generate_soundtrack()
    print("Synthesizing Kodak sound design and Foley library...")
    generate_sfx()
    print("All Kodak audio assets successfully composed!")
