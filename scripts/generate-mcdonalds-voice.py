#!/usr/bin/env python3
"""Generate the McDonald's AI drive-thru narration with word-accurate cues.

Features:
  - SD_VOICE_03 — Nathan Cole (en-US-AndrewMultilingualNeural).
  - Scene-anchored 90s timeline; the voice is the master clock.
  - Per-line volume, rate and pitch. Internal pauses capped.
  - Broadcast chain, subtitles and word-boundary JSON.
  - Controlled pauses to maintain natural cadence without rushing.
  - Broadcast chain: highpass, warm EQ, gentle compression, room tail, loudnorm (-16 LUFS).
  - Aligned subtitles and word boundary JSON.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import re
import subprocess
import tempfile
import wave
from pathlib import Path

import edge_tts
import numpy as np

SR = 48000
PUNCT = ".,!?;:—–…"
TOKEN_RE = re.compile(r"\S+")


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser()
    p.add_argument("--segments-file", default="content/mcdonalds-voice-segments.json")
    p.add_argument("--out-media", default="public/audio/episodes/mcdonalds/voice.mp3")
    p.add_argument("--out-vtt", default="public/audio/episodes/mcdonalds/voice.vtt")
    p.add_argument("--out-words", default="public/audio/episodes/mcdonalds/voice.words.json")
    p.add_argument("--out-cues", default="public/audio/episodes/mcdonalds/voice.cues.json")
    p.add_argument("--dry-run", action="store_true", help="Measure only, do not write media")
    return p.parse_args()


def run(cmd: list[str]) -> None:
    subprocess.run(cmd, check=True, capture_output=True, text=True)


def decode(path: Path) -> np.ndarray:
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        check=True,
        capture_output=True,
    ).stdout
    return np.frombuffer(out, dtype=np.float32).copy()


def measure_silence(x: np.ndarray, threshold_db: float = -46.0) -> list[tuple[int, int]]:
    win = int(0.02 * SR)
    frames = len(x) // win
    if frames == 0:
        return []
    rms = np.sqrt(np.mean(x[: frames * win].reshape(frames, win) ** 2, axis=1) + 1e-12)
    db = 20 * np.log10(rms + 1e-9)
    silent = db < threshold_db
    spans: list[tuple[int, int]] = []
    i = 0
    while i < frames:
        if not silent[i]:
            i += 1
            continue
        j = i
        while j < frames and silent[j]:
            j += 1
        spans.append((i * win, min(j * win, len(x))))
        i = j
    return spans


def tighten(x: np.ndarray, max_pause: float, keep_edge: float) -> tuple[np.ndarray, list[tuple[float, float, float]]]:
    spans = measure_silence(x)
    cuts: list[tuple[float, float, float]] = []
    for start, end in spans:
        length = (end - start) / SR
        at_start = start <= int(keep_edge * SR)
        at_end = end >= len(x) - int(keep_edge * SR)
        if at_start or at_end:
            continue
        if length > max_pause:
            new_len = max_pause
            cut_from = start + int((new_len + 0.02) * SR)
            cuts.append((cut_from / SR, end / SR, 0.0))
    if not cuts:
        return x, []

    keep = np.ones(len(x), dtype=bool)
    for start_s, end_s, _ in cuts:
        keep[int(start_s * SR): int(end_s * SR)] = False
    y = x[keep]
    return y, cuts


def shift_time(t: float, cuts: list[tuple[float, float, float]]) -> float:
    removed = 0.0
    for start, end, _ in cuts:
        if t >= end:
            removed += end - start
        elif t > start:
            removed += t - start
            break
    return t - removed


def clean_word(token: str) -> str:
    return token.strip(PUNCT + '"“”‘’()[]')


def normalize_word(token: str) -> str:
    return clean_word(token).strip("'").lower().replace("’", "'")


def split_compound(token: str) -> list[str]:
    parts = [normalize_word(p) for p in re.split(r"[—–]", token)]
    return [p for p in parts if p]


def align_source_words(raw_words: list[dict], source_text: str) -> list[dict]:
    source_tokens = source_text.split()
    expanded: list[dict] = []
    for word in raw_words:
        pieces = word["text"].split()
        if len(pieces) <= 1:
            expanded.append(word)
        else:
            for piece in pieces:
                expanded.append({"text": piece, "start": word["start"], "end": word["end"]})
    raw_norm = [normalize_word(w["text"]) for w in expanded]
    aligned: list[dict] = []
    idx = 0
    for token in source_tokens:
        full = normalize_word(token)
        parts = split_compound(token)
        start = end = None
        if idx < len(raw_norm) and raw_norm[idx] == full:
            start = end = idx
        elif len(parts) > 1 and idx + len(parts) <= len(raw_norm) and raw_norm[idx: idx + len(parts)] == parts:
            start, end = idx, idx + len(parts) - 1
        if start is None:
            for probe in range(idx + 1, min(len(raw_norm), idx + 6)):
                if raw_norm[probe] == full:
                    start = end = probe
                    break
                if len(parts) > 1 and probe + len(parts) <= len(raw_norm) and raw_norm[probe: probe + len(parts)] == parts:
                    start, end = probe, probe + len(parts) - 1
                    break
        if start is None:
            # Fallback if edge-tts omitted a token boundary
            start = end = min(idx, len(expanded) - 1)
        aligned.append({"text": token, "start": expanded[start]["start"], "end": expanded[end]["end"]})
        idx = min(end + 1, len(raw_norm))
    return aligned


async def render_segment(text: str, voice: str, rate: str, pitch: str, volume: str, path: Path) -> list[dict]:
    last_error: Exception | None = None
    for attempt in range(1, 5):
        try:
            communicate = edge_tts.Communicate(text, voice=voice, rate=rate, pitch=pitch, volume=volume, boundary="WordBoundary")
            audio = bytearray()
            words: list[dict] = []
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio.extend(chunk["data"])
                elif chunk["type"] == "WordBoundary":
                    words.append({
                        "text": chunk["text"],
                        "start": chunk["offset"] / 10_000_000,
                        "end": (chunk["offset"] + chunk["duration"]) / 10_000_000,
                    })
            if audio and words:
                path.write_bytes(audio)
                return words
            raise RuntimeError("No audio or word boundaries received")
        except Exception as error:
            last_error = error
            await asyncio.sleep(1.4 * attempt)
    raise RuntimeError(f"TTS failed: {last_error}")


def make_cues(words: list[dict]) -> list[dict]:
    groups: list[list[dict]] = []
    current: list[dict] = []

    for word in words:
        current.append(word)
        text = word["text"]
        duration = current[-1]["end"] - current[0]["start"]
        sentence_end = bool(re.search(r"[.!?]['\"”’]?$", text))
        if sentence_end or (text.endswith(",") and len(current) >= 5) or len(current) >= 10 or duration >= 4.5:
            groups.append(current)
            current = []
    if current:
        groups.append(current)

    merged: list[list[dict]] = []
    for group in groups:
        if merged:
            combined = " ".join(w["text"] for w in merged[-1] + group)
            if (len(group) <= 2 or len(merged[-1]) <= 3) and len(combined) <= 72:
                merged[-1] = merged[-1] + group
                continue
        merged.append(group)

    weak = {
        "the", "a", "an", "and", "but", "or", "of", "to", "for", "with", "that",
        "when", "in", "on", "at", "by", "as", "is", "was", "can", "your",
        "their", "its", "from", "into", "they", "we", "he", "she", "which",
    }
    for index in range(len(merged) - 1):
        group = merged[index]
        moved: list[dict] = []
        while len(group) > 3 and group[-1]["text"].strip(".,!?").lower() in weak:
            moved.insert(0, group.pop())
        if moved:
            merged[index + 1] = moved + merged[index + 1]

    cues = []
    for group in merged:
        if not group:
            continue
        cues.append({
            "start": round(group[0]["start"], 3),
            "end": round(group[-1]["end"] + 0.1, 3),
            "text": " ".join(w["text"] for w in group),
        })
    for index, cue in enumerate(cues[:-1]):
        cue["end"] = min(cue["end"], cues[index + 1]["start"] - 0.08)
    return cues


def fmt_vtt(t: float) -> str:
    ms = max(0, round(t * 1000))
    h, rem = divmod(ms, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def write_wav(path: Path, x: np.ndarray) -> None:
    pcm = (np.clip(x, -1.0, 1.0) * 32767).astype(np.int16)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())


async def main() -> None:
    args = parse_args()
    spec = json.loads(Path(args.segments_file).read_text(encoding="utf-8"))
    voice = spec["voice"]
    lead_in = float(spec.get("leadInSeconds", 0.6))
    total = float(spec.get("totalDurationSeconds", 80.0))
    max_pause = float(spec.get("maxInternalPauseSeconds", 0.32))

    out_media = Path(args.out_media)
    out_vtt = Path(args.out_vtt)
    out_words = Path(args.out_words)
    out_cues = Path(args.out_cues)
    for path in (out_media, out_vtt, out_words, out_cues):
        path.parent.mkdir(parents=True, exist_ok=True)

    timeline = np.zeros(int(total * SR) + SR, dtype=np.float32)
    words_out: list[dict] = []
    manifest: list[dict] = []
    cursor = lead_in

    with tempfile.TemporaryDirectory(prefix="mcd-voice-") as tmp:
        tmp_path = Path(tmp)
        for index, segment in enumerate(spec["segments"], start=1):
            raw_path = tmp_path / f"{index:02d}.mp3"
            raw_words = await render_segment(
                segment["text"], voice, segment.get("rate", "+2%"), segment.get("pitch", "-1Hz"), segment.get("volume", "+0%"), raw_path
            )
            source_words = align_source_words(raw_words, segment["text"])
            original = decode(raw_path)
            tightened, cuts = tighten(original, max_pause=max_pause, keep_edge=0.05)
            duration = len(tightened) / SR

            anchor = segment.get("sceneStartSeconds")
            start = cursor
            if anchor is not None:
                start = max(cursor, float(anchor) + float(segment.get("voiceOffsetSeconds", 0.4)))
            if start + duration > total - 0.02:
                raise RuntimeError(
                    f"{segment['id']} ends at {start + duration:.3f}s (limit {total:.2f}s). "
                    "Increase rate or move the scene anchor."
                )

            pad_start = int(start * SR)
            timeline[pad_start: pad_start + len(tightened)] += tightened

            for word in source_words:
                words_out.append({
                    "text": word["text"],
                    "start": round(start + shift_time(word["start"], cuts), 3),
                    "end": round(start + shift_time(word["end"], cuts), 3),
                })
            manifest.append({
                "id": segment["id"],
                "start": round(start, 3),
                "end": round(start + duration, 3),
                "duration": round(duration, 3),
                "rawDuration": round(len(original) / SR, 3),
                "trimmedSilence": round(len(original) / SR - duration, 3),
                "rate": segment.get("rate", "+2%"),
                "words": len(source_words),
            })
            cursor = start + duration + float(segment.get("pauseAfterSeconds", 0.0))

        timeline = timeline[: int(total * SR)]
        wav_path = tmp_path / "voice-raw.wav"
        write_wav(wav_path, timeline)
        processed = tmp_path / "voice-processed.wav"
        run([
            "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(wav_path),
            "-af",
            "highpass=f=75,"
            "equalizer=f=120:t=q:w=1.2:g=1.8,"
            "equalizer=f=360:t=q:w=1.2:g=-1.5,"
            "equalizer=f=2800:t=q:w=1.5:g=-0.8,"
            "acompressor=threshold=-20dB:ratio=2.5:attack=10:release=160:makeup=1.5,"
            "aecho=0.9:0.75:20:0.04,"
            "loudnorm=I=-16:TP=-1.8:LRA=7,"
            "alimiter=limit=0.94",
            "-ar", "48000", "-ac", "1", str(processed),
        ])
        if not args.dry_run:
            run([
                "ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", str(processed),
                "-ar", "48000", "-ac", "1", "-c:a", "libmp3lame", "-b:a", "144k", str(out_media),
            ])

    cues = make_cues(words_out)
    if not args.dry_run:
        vtt = ["WEBVTT", ""]
        for i, cue in enumerate(cues, start=1):
            vtt += [str(i), f"{fmt_vtt(cue['start'])} --> {fmt_vtt(cue['end'])}", cue["text"], ""]
        out_vtt.write_text("\n".join(vtt), encoding="utf-8")
        out_words.write_text(json.dumps({
            "voice": voice, "leadInSeconds": lead_in, "segments": manifest, "words": words_out,
        }, indent=2) + "\n", encoding="utf-8")
        out_cues.write_text(json.dumps({
            "source": str(out_media), "voice": voice, "segments": manifest, "cues": cues,
        }, indent=2) + "\n", encoding="utf-8")

    print(f"voice={voice} total={total:.2f}s words={len(words_out)} cues={len(cues)}")
    for seg in manifest:
        print(f"  {seg['id']:<20} {seg['start']:>6.2f} -> {seg['end']:>6.2f}  "
              f"({seg['duration']:.2f}s, trimmed {seg['trimmedSilence']:.2f}s, {seg['rate']})")
    print(f"  last word ends {words_out[-1]['end']:.2f}s")


if __name__ == "__main__":
    asyncio.run(main())
