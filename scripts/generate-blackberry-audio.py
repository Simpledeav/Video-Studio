#!/usr/bin/env python3
"""Generate original soundtrack and sound effects for the BlackBerry case study.

Composes:
  1. `blackberry-score-80s.mp3`: 80-second modern editorial electronic soundtrack.
     Progression:
       00:00–00:19: Minimal electronic pulse, warm analog sub-bass, subtle texture.
       00:19–00:43: Gradually introduce crisp minimalist rhythm, warm electric piano chords.
       00:43–00:56: Electronic tension during data chart (staccato synth arps, rhythmic clock).
       00:56–01:09: Open, optimistic transformation (warm harmonic pads, shimmering accents).
       01:09–01:20: Minimal, memorable harmonic resolution and decay.
  2. Precision sound effects:
     - `keyboard-tap.mp3`, `keyboard-burst.mp3` (tactile BlackBerry micro-clicks)
     - `touch-tap.mp3` (soft glass smartphone tap)
     - `digital-click.mp3` (clean editorial interface click)
     - `data-tick.mp3` (subtle numerical counter tick)
     - `chart-fall.mp3` (data drop tone)
     - `system-transform.mp3` (clean modular network shimmer)
     - `editorial-reveal.mp3` (clean paper-light geometric shift)
     - `low-pulse.mp3` (restrained 60Hz subtle accent)
     - `brand-signature.mp3` (Simpledeav editorial sign-off)
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
SCORE_OUT = ROOT / "public/audio/episodes/blackberry/music"
SFX_OUT = ROOT / "public/audio/episodes/blackberry/sfx"
SCORE_OUT.mkdir(parents=True, exist_ok=True)
SFX_OUT.mkdir(parents=True, exist_ok=True)

rng = np.random.default_rng(42)


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
    m = 1.0 / (1.0 + np.exp((f - cut) / (cut * 0.18 + 1)))
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
# 1. COMPOSE THE 80-SECOND ELECTRONIC EDITORIAL SCORE
# ============================================================================
def generate_soundtrack() -> None:
    score = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    time = np.linspace(0, TOTAL_DUR, TOTAL_SAMPLES, endpoint=False)

    # Global harmonic foundation: D minor -> Bb maj7 -> F maj7 -> C maj
    # BPM = 112 -> 1 beat = 60/112 = 0.5357s, 1 bar (4 beats) = 2.1428s
    beat_dur = 60.0 / 112.0
    bar_dur = beat_dur * 4.0
    total_bars = int(TOTAL_DUR / bar_dur) + 1

    # Frequency tables (D minor palette)
    # D3=146.83, F3=174.61, A3=220.00, C4=261.63, E4=329.63, G4=392.00
    # Bass: D1=36.71, D2=73.42, Bb1=58.27, F1=43.65, C2=65.41, A1=55.00
    chords = [
        # Dm9: D, F, A, C, E
        ([146.83, 174.61, 220.0, 261.63, 329.63], 73.42),
        # Bbmaj7: Bb, D, F, A
        ([116.54, 146.83, 174.61, 220.0], 58.27),
        # Fmaj7: F, A, C, E
        ([174.61, 220.0, 261.63, 329.63], 43.65),
        # C/A: A, C, E, G
        ([110.0, 130.81, 164.81, 196.0], 55.0),
    ]

    # --- TRACK 1: Warm Analog Sub-Bass & Mid Bass ---
    bass_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    for bar_idx in range(total_bars):
        bar_start = bar_idx * bar_dur
        chord_idx = bar_idx % len(chords)
        root_freq = chords[chord_idx][1]

        # In section 5 (00:43–00:56), bass drops down with tense octaves
        t_sec = bar_start
        if 43.0 <= t_sec < 56.0:
            root_freq = 55.0 if (bar_idx % 2 == 0) else 43.65

        bar_len = int(bar_dur * SR)
        b_idx_start = int(bar_start * SR)
        if b_idx_start + bar_len > TOTAL_SAMPLES:
            bar_len = TOTAL_SAMPLES - b_idx_start
        if bar_len <= 0:
            break

        # Synth bass tone (sine + gentle 2nd harmonic + filtered saw)
        t_bar = np.linspace(0, bar_len / SR, bar_len, endpoint=False)
        bass_note = np.sin(2 * np.pi * root_freq * t_bar) * 0.7 + \
                    np.sin(2 * np.pi * root_freq * 2 * t_bar) * 0.25
        # Soft envelope per bar with gentle re-trigger at beat 1 and beat 3
        env_bar = (0.7 + 0.3 * np.cos(2 * np.pi * (t_bar / (beat_dur * 2)))) * \
                  np.exp(-t_bar / (bar_dur * 1.4))
        bass_track[b_idx_start: b_idx_start + bar_len] += bass_note * env_bar

    bass_track = lp(bass_track, 220.0)

    # --- TRACK 2: Minimal Electronic Pulse (Ticks, Micro-Shakers, Analogue Clocks) ---
    pulse_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    total_16ths = int(TOTAL_DUR / (beat_dur / 4))
    sixteenth_dur = beat_dur / 4.0

    for step in range(total_16ths):
        step_time = step * sixteenth_dur
        step_idx = int(step_time * SR)
        if step_idx >= TOTAL_SAMPLES:
            break

        # Section 1 (00:00–00:19): subtle, quiet pulse on 8th notes
        # Section 2 (00:19–00:43): crisp 16th groove with gentle accents
        # Section 3 (00:43–00:56): tense, clock-like ticking
        # Section 4 (00:56–01:09): smooth rolling pulse
        # Section 5 (01:09–01:20): fading away to silence
        vol = 0.0
        if 0.0 <= step_time < 19.0:
            if step % 4 == 0:  # quarter note
                vol = 0.16
            elif step % 2 == 0:  # eighth note
                vol = 0.08
        elif 19.0 <= step_time < 43.0:
            if step % 4 == 0:
                vol = 0.26
            elif step % 2 == 0:
                vol = 0.14
            else:
                vol = 0.07
        elif 43.0 <= step_time < 56.0:
            # Tense clockwork
            vol = 0.32 if (step % 2 == 0) else 0.18
        elif 56.0 <= step_time < 69.0:
            vol = 0.22 if (step % 2 == 0) else 0.10
        elif 69.0 <= step_time < 77.0:
            # Fading resolve
            fade = max(0.0, (77.0 - step_time) / 8.0)
            vol = 0.12 * fade if (step % 4 == 0) else 0.05 * fade

        if vol <= 0.001:
            continue

        tick_len = int(0.025 * SR)
        if step_idx + tick_len > TOTAL_SAMPLES:
            tick_len = TOTAL_SAMPLES - step_idx
        # Filtered analog tick: noise + resonant ping
        t_tick = np.linspace(0, tick_len / SR, tick_len, endpoint=False)
        tick_wave = (rng.standard_normal(tick_len) * 0.4 +
                     np.sin(2 * np.pi * 3200 * t_tick) * 0.6) * np.exp(-t_tick / 0.005)
        pulse_track[step_idx: step_idx + tick_len] += tick_wave * vol

    # --- TRACK 3: Rhodes / Analog Electric Piano Chords ---
    chord_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    for bar_idx in range(total_bars):
        bar_start = bar_idx * bar_dur
        chord_idx = bar_idx % len(chords)
        chord_freqs = chords[chord_idx][0]

        t_sec = bar_start
        chord_len = int(bar_dur * 1.2 * SR)
        c_idx_start = int(bar_start * SR)
        if c_idx_start + chord_len > TOTAL_SAMPLES:
            chord_len = TOTAL_SAMPLES - c_idx_start
        if chord_len <= 0:
            break

        # Section-specific chord gain & mood
        gain = 0.0
        if 0.0 <= t_sec < 19.0:
            gain = 0.14  # delicate, sparse
        elif 19.0 <= t_sec < 43.0:
            gain = 0.22  # rich and full
        elif 43.0 <= t_sec < 56.0:
            gain = 0.12  # thin, tense, minor focus
            chord_freqs = [146.83, 220.0, 293.66]  # hollow Dm
        elif 56.0 <= t_sec < 69.0:
            gain = 0.26  # bright, optimistic (Fmaj9, Bbmaj7)
            chord_freqs = [174.61, 220.0, 261.63, 329.63, 392.0]
        elif 69.0 <= t_sec < 78.0:
            fade = max(0.0, (78.0 - t_sec) / 9.0)
            gain = 0.18 * fade
            chord_freqs = [146.83, 220.0, 261.63, 329.63]

        if gain <= 0.001:
            continue

        t_c = np.linspace(0, chord_len / SR, chord_len, endpoint=False)
        chord_sound = np.zeros(chord_len, dtype=np.float32)
        for f in chord_freqs:
            # Gentle electric piano bell/body
            harmonic = np.sin(2 * np.pi * f * t_c) * 0.5 + \
                       np.sin(2 * np.pi * f * 2 * t_c) * 0.25 * np.exp(-t_c / 0.8) + \
                       np.sin(2 * np.pi * f * 3 * t_c) * 0.1 * np.exp(-t_c / 0.3)
            chord_sound += harmonic * np.exp(-t_c / (bar_dur * 0.95))

        chord_track[c_idx_start: c_idx_start + chord_len] += chord_sound * gain

    chord_track = bp(chord_track, 120.0, 4500.0)

    # --- TRACK 4: Data Tension Arpeggiator (active in 00:43–00:56) ---
    arp_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    arp_notes = [440.0, 523.25, 587.33, 659.25, 783.99, 880.0]
    arp_dur = beat_dur / 4.0  # 16th note arp

    t_arp_start = 43.0
    t_arp_end = 56.0
    s_arp_start = int(t_arp_start * SR)
    s_arp_end = int(t_arp_end * SR)

    arp_step = 0
    t_curr = t_arp_start
    while t_curr < t_arp_end:
        idx = int(t_curr * SR)
        note_freq = arp_notes[arp_step % len(arp_notes)]
        n_len = int(0.12 * SR)
        if idx + n_len > TOTAL_SAMPLES:
            break
        t_n = np.linspace(0, n_len / SR, n_len, endpoint=False)
        # Staccato synth pulse
        note_wave = (np.sin(2 * np.pi * note_freq * t_n) * 0.6 +
                     np.sin(2 * np.pi * note_freq * 2 * t_n) * 0.3) * np.exp(-t_n / 0.04)
        # Tension swell towards 52s then drop
        progress = (t_curr - t_arp_start) / (t_arp_end - t_arp_start)
        arp_gain = 0.18 + 0.15 * math.sin(progress * math.pi)
        arp_track[idx: idx + n_len] += note_wave * arp_gain

        arp_step += 1
        t_curr += arp_dur

    arp_track = bp(arp_track, 400.0, 5000.0)

    # --- TRACK 5: Atmospheric Shimmer Pad & Air Bed ---
    air_track = np.zeros(TOTAL_SAMPLES, dtype=np.float32)
    # Slow gentle evolving filter on subtle noise
    base_noise = rng.standard_normal(TOTAL_SAMPLES).astype(np.float32)
    air_track = bp(base_noise, 800.0, 3200.0) * 0.04
    # Modulate air volume: slightly elevated in transformation (00:56–01:09)
    air_env = 0.03 * np.ones(TOTAL_SAMPLES, dtype=np.float32)
    s_trans = int(56.0 * SR)
    s_end = int(72.0 * SR)
    air_env[s_trans:s_end] += 0.04 * np.sin(np.linspace(0, np.pi, s_end - s_trans))
    air_track *= air_env

    # Sum all stems
    score = bass_track * 0.45 + pulse_track * 0.35 + chord_track * 0.40 + arp_track * 0.45 + air_track * 0.25

    # Overall master fade-in and gentle fade-out
    fade_in = int(0.8 * SR)
    fade_out = int(2.5 * SR)
    score[:fade_in] *= np.linspace(0, 1, fade_in)
    score[-fade_out:] *= np.linspace(1, 0, fade_out)

    write_mp3(SCORE_OUT / "blackberry-score-80s.mp3", score, bitrate="192k")


# ============================================================================
# 2. SYNTHESIZE PRECISE SOUND EFFECTS
# ============================================================================
def generate_sound_effects() -> None:
    # 1. Keyboard Tap (tactile physical micro-switch click)
    dur = 0.06
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    # Sharp initial transient click + resonant body at 2.8kHz
    click = (rng.standard_normal(n) * 0.4 +
             np.sin(2 * np.pi * 2800 * t) * 0.6) * np.exp(-t / 0.008)
    write_mp3(SFX_OUT / "keyboard-tap.mp3", click)

    # 2. Keyboard Rapid Burst (typing a short message)
    dur = 0.45
    n = int(dur * SR)
    burst = np.zeros(n, dtype=np.float32)
    key_times = [0.0, 0.065, 0.12, 0.19, 0.27, 0.34, 0.39]
    for kt in key_times:
        s_idx = int(kt * SR)
        k_len = int(0.04 * SR)
        if s_idx + k_len > n:
            continue
        t_k = np.linspace(0, k_len / SR, k_len, endpoint=False)
        pitch = 2600 + rng.random() * 600
        k_sound = (rng.standard_normal(k_len) * 0.35 +
                   np.sin(2 * np.pi * pitch * t_k) * 0.65) * np.exp(-t_k / 0.007)
        burst[s_idx: s_idx + k_len] += k_sound * (0.7 + rng.random() * 0.3)
    write_mp3(SFX_OUT / "keyboard-burst.mp3", burst)

    # 3. Touch Tap (soft rounded glass screen tap)
    dur = 0.08
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    # Rounded low-mid thud at 850Hz + soft surface tick
    touch = (np.sin(2 * np.pi * 850 * t) * 0.7 +
             np.sin(2 * np.pi * 1400 * t) * 0.3) * np.exp(-t / 0.018)
    write_mp3(SFX_OUT / "touch-tap.mp3", touch)

    # 4. Digital Click (clean Swiss editorial interface select)
    dur = 0.05
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    dclick = np.sin(2 * np.pi * 4200 * t) * np.exp(-t / 0.006)
    write_mp3(SFX_OUT / "digital-click.mp3", dclick)

    # 5. Data Tick (clean numerical counter blip)
    dur = 0.04
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    dtick = np.sin(2 * np.pi * 5800 * t) * np.exp(-t / 0.004)
    write_mp3(SFX_OUT / "data-tick.mp3", dtick)

    # 6. Chart Fall (smooth descending sine sweep with gentle flutter)
    dur = 1.4
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    # Sweep from 520Hz down to 110Hz exponentially
    freq_sweep = 110.0 + 410.0 * np.exp(-t / 0.45)
    phase = 2 * np.pi * np.cumsum(freq_sweep) / SR
    sweep_sound = np.sin(phase) * (0.8 + 0.2 * np.sin(2 * np.pi * 8 * t)) * np.exp(-t / 0.8)
    sweep_sound = lp(sweep_sound, 700.0)
    write_mp3(SFX_OUT / "chart-fall.mp3", sweep_sound)

    # 7. System Transform (modular geometric shimmer)
    dur = 0.7
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    shimmer = (np.sin(2 * np.pi * 1200 * t) * 0.4 +
               np.sin(2 * np.pi * 1800 * t) * 0.3 +
               np.sin(2 * np.pi * 2400 * t) * 0.2 +
               rng.standard_normal(n) * 0.1) * np.sin(np.pi * t / dur) * np.exp(-t / 0.35)
    write_mp3(SFX_OUT / "system-transform.mp3", shimmer)

    # 8. Editorial Reveal (air-light geometric slide)
    dur = 0.35
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    air = bp(rng.standard_normal(n), 1800.0, 7000.0) * np.sin(np.pi * t / dur) ** 2
    write_mp3(SFX_OUT / "editorial-reveal.mp3", air)

    # 9. Low Pulse (restrained 60Hz subtle accent)
    dur = 0.6
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    pulse = np.sin(2 * np.pi * 65.0 * t) * np.exp(-t / 0.14)
    write_mp3(SFX_OUT / "low-pulse.mp3", pulse)

    # 10. Brand Signature (Simpledeav crystalline 2-tone closing chime)
    dur = 1.2
    n = int(dur * SR)
    t = np.linspace(0, dur, n, endpoint=False)
    chime1 = np.sin(2 * np.pi * 880.0 * t) * np.exp(-t / 0.5)
    # 2nd tone enters at 0.15s
    chime2 = np.zeros(n, dtype=np.float32)
    s2 = int(0.16 * SR)
    t2 = np.linspace(0, (n - s2) / SR, n - s2, endpoint=False)
    chime2[s2:] = (np.sin(2 * np.pi * 1318.51 * t2) * 0.7 +
                   np.sin(2 * np.pi * 1760.0 * t2) * 0.3) * np.exp(-t2 / 0.65)
    brand = chime1 * 0.5 + chime2 * 0.5
    write_mp3(SFX_OUT / "brand-signature.mp3", brand)


if __name__ == "__main__":
    print("Synthesizing original electronic score...")
    generate_soundtrack()
    print("Synthesizing precision sound effects...")
    generate_sound_effects()
    print("All audio generated successfully!")
