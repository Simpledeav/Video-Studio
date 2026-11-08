#!/usr/bin/env python3
"""Rebuild subtitle cues from the generated word boundaries.

The TTS word timings are authoritative. This script only regroups them:
  1. Sentence boundaries always start a new cue.
  2. Long sentences split at the largest natural pause near the middle, or at a
     comma/semicolon that leaves at least four words on each side.
  3. No cue crosses an act cut.
  4. Weak trailing words move forward so a line never ends on "the".

Audio is never touched.
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path("public/audio/episodes/mcdonalds")
WORDS = ROOT / "voice.words.json"
CUES = ROOT / "voice.cues.json"
VTT = ROOT / "voice.vtt"

SCENE_CUTS = [8.95, 24.2, 33.8, 44.0, 54.5, 75.7, 85.0]
SENTENCE_END = re.compile(r"[.!?]['\"”’]?$")
WEAK = {
    "the", "a", "an", "and", "but", "or", "of", "to", "for", "with", "that",
    "when", "in", "on", "at", "by", "as", "is", "was", "can", "your",
    "their", "its", "from", "into", "they", "we", "he", "she", "which",
    "this", "these", "those", "it", "be", "are", "were", "has", "have",
}


def fmt_vtt(t: float) -> str:
    ms = max(0, round(t * 1000))
    h, rem = divmod(ms, 3_600_000)
    m, rem = divmod(rem, 60_000)
    s, ms = divmod(rem, 1000)
    return f"{h:02d}:{m:02d}:{s:02d}.{ms:03d}"


def words_between(words: list[dict], start: int, end: int) -> list[dict]:
    return words[start:end]


def split_long(group: list[dict]) -> list[list[dict]]:
    """Recursively split a long sentence at a natural pause."""
    if len(group) <= 12 and (group[-1]["end"] - group[0]["start"]) <= 5.0:
        return [group]

    best_index = None
    best_score = 0.0
    for i in range(4, len(group) - 4):
        gap = group[i]["start"] - group[i - 1]["end"]
        # Prefer a real pause, then a comma, then proximity to the middle.
        punctuation = 0.12 if re.search(r"[,;:]$", group[i - 1]["text"]) else 0.0
        balance = 1 - abs((i / len(group)) - 0.5)
        score = gap + punctuation + balance * 0.04
        if score > best_score:
            best_score = score
            best_index = i

    if best_index is None:
        return [group]
    return split_long(group[:best_index]) + split_long(group[best_index:])


def main() -> None:
    data = json.loads(WORDS.read_text(encoding="utf-8"))
    words = data["words"]

    # 1. Sentences.
    sentences: list[list[dict]] = []
    current: list[dict] = []
    for word in words:
        current.append(word)
        if SENTENCE_END.search(word["text"]):
            sentences.append(current)
            current = []
    if current:
        sentences.append(current)

    # 2. Long sentences.
    groups: list[list[dict]] = []
    for sentence in sentences:
        groups.extend(split_long(sentence))

    # 3. Never cross an act cut.
    cut_groups: list[list[dict]] = []
    for group in groups:
        cut = next(
            (c for c in SCENE_CUTS if group[0]["start"] < c < group[-1]["end"]),
            None,
        )
        if cut is None:
            cut_groups.append(group)
            continue
        left = [w for w in group if w["end"] <= cut]
        right = [w for w in group if w["start"] >= cut]
        if left and right:
            cut_groups.extend([left, right])
        else:
            cut_groups.append(group)

    # 4. Move weak trailing words forward.
    for index in range(len(cut_groups) - 1):
        group = cut_groups[index]
        moved: list[dict] = []
        while len(group) > 4 and group[-1]["text"].strip(".,!?;:").lower() in WEAK:
            moved.insert(0, group.pop())
        if moved:
            cut_groups[index + 1] = moved + cut_groups[index + 1]

    cues = []
    for group in cut_groups:
        text = " ".join(w["text"] for w in group)
        cues.append(
            {
                "start": round(group[0]["start"], 3),
                "end": round(group[-1]["end"] + 0.1, 3),
                "text": text,
            }
        )

    for index, cue in enumerate(cues[:-1]):
        cue["end"] = min(cue["end"], cues[index + 1]["start"] - 0.06)

    payload = {
        "source": str(ROOT / "voice.mp3"),
        "voice": data["voice"],
        "segments": data["segments"],
        "cues": cues,
    }
    CUES.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")

    lines = ["WEBVTT", ""]
    for i, cue in enumerate(cues, start=1):
        lines += [str(i), f"{fmt_vtt(cue['start'])} --> {fmt_vtt(cue['end'])}", cue["text"], ""]
    VTT.write_text("\n".join(lines), encoding="utf-8")

    print(f"cues={len(cues)}")
    for cue in cues:
        print(f"  {cue['start']:6.2f} - {cue['end']:6.2f}  {cue['text']}")


if __name__ == "__main__":
    main()
