"""Word-timing and subtitle helpers.

The cloned-voice engines do not expose word boundaries. We therefore transcribe
the generated audio with a local Whisper model and align those real timings back
to the written script. Subtitle cues are never distributed evenly across a
scene when a real timing is available.
"""
from __future__ import annotations

import difflib
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Iterable

_WHISPER_MODEL = None
_WHISPER_KEY: tuple[str, str] | None = None


@dataclass
class WordTiming:
    text: str
    start: float
    end: float
    probability: float = 1.0

    def as_dict(self) -> dict[str, Any]:
        return {
            "text": self.text,
            "start": round(self.start, 3),
            "end": round(self.end, 3),
            "probability": round(self.probability, 3),
        }


def _normalise_token(token: str) -> str:
    return re.sub(r"[^a-z0-9']", "", token.lower())


def transcribe_words(
    audio_path: Path,
    *,
    model_size: str = "base.en",
    model_root: Path | None = None,
    language: str = "en",
) -> list[WordTiming]:
    """Transcribe with local faster-whisper and return word-level timings."""
    global _WHISPER_MODEL, _WHISPER_KEY
    from faster_whisper import WhisperModel  # lazy heavy import

    root = str(model_root) if model_root else "models/whisper"
    key = (model_size, root)
    if _WHISPER_MODEL is None or _WHISPER_KEY != key:
        _WHISPER_MODEL = WhisperModel(
            model_size,
            device="cpu",
            compute_type="int8",
            download_root=root,
        )
        _WHISPER_KEY = key

    segments, _info = _WHISPER_MODEL.transcribe(
        str(audio_path),
        language=language,
        beam_size=5,
        vad_filter=True,
        word_timestamps=True,
        condition_on_previous_text=False,
    )
    words: list[WordTiming] = []
    for segment in segments:
        for word in segment.words or []:
            text = (word.word or "").strip()
            if not text:
                continue
            words.append(
                WordTiming(
                    text=text,
                    start=max(0.0, float(word.start)),
                    end=max(float(word.start), float(word.end)),
                    probability=float(getattr(word, "probability", 1.0) or 1.0),
                )
            )
    return words


def _weighted_split(start: float, end: float, tokens: list[str]) -> list[tuple[float, float]]:
    if not tokens:
        return []
    weights = [max(1, len(_normalise_token(token)) or 1) for token in tokens]
    total = float(sum(weights))
    span = max(0.001, end - start)
    cursor = start
    output: list[tuple[float, float]] = []
    for weight in weights:
        duration = span * (weight / total)
        output.append((cursor, cursor + duration))
        cursor += duration
    return output


def align_script(
    script: str,
    asr_words: Iterable[WordTiming],
    *,
    min_word_seconds: float = 0.06,
) -> list[WordTiming]:
    """Align written script tokens to real ASR word timings."""
    script_tokens = [token for token in re.findall(r"\S+", script) if _normalise_token(token)]
    asr_list = list(asr_words)
    if not script_tokens:
        return []
    if not asr_list:
        raise ValueError("No ASR words were produced; cannot build subtitle timing.")

    script_norm = [_normalise_token(token) for token in script_tokens]
    asr_norm = [_normalise_token(word.text) for word in asr_list]
    matcher = difflib.SequenceMatcher(None, script_norm, asr_norm, autojunk=False)
    timings: list[WordTiming | None] = [None] * len(script_tokens)

    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == "equal" and (i2 - i1) == (j2 - j1):
            for offset in range(i2 - i1):
                src = i1 + offset
                dst = j1 + offset
                timings[src] = WordTiming(
                    text=script_tokens[src],
                    start=asr_list[dst].start,
                    end=asr_list[dst].end,
                    probability=asr_list[dst].probability,
                )
        elif tag == "replace" and j2 > j1:
            span_start = asr_list[j1].start
            span_end = asr_list[j2 - 1].end
            distributed = _weighted_split(span_start, span_end, script_tokens[i1:i2])
            for offset, (start, end) in enumerate(distributed):
                src = i1 + offset
                timings[src] = WordTiming(
                    text=script_tokens[src],
                    start=start,
                    end=end,
                    probability=0.5,
                )

    # Fill unmatched runs from the nearest real anchors.
    known = [index for index, timing in enumerate(timings) if timing is not None]
    if not known:
        raise ValueError("The script and the ASR transcript do not share any words.")
    total_start = asr_list[0].start
    total_end = asr_list[-1].end
    for index, timing in enumerate(timings):
        if timing is not None:
            continue
        previous = max((item for item in known if item < index), default=None)
        following = min((item for item in known if item > index), default=None)
        if previous is None and following is None:
            start, end = total_start, total_end
        elif previous is None:
            end = max(total_start + 0.001, timings[following].start)  # type: ignore[index]
            start = max(total_start, end - 0.18)
        elif following is None:
            start = timings[previous].end  # type: ignore[index]
            end = max(start + 0.08, total_end)
        else:
            start = timings[previous].end  # type: ignore[index]
            end = max(start + 0.05, timings[following].start)  # type: ignore[index]
        timings[index] = WordTiming(
            text=script_tokens[index],
            start=start,
            end=end,
            probability=0.25,
        )

    # Monotonicity and a minimum visible duration.
    output: list[WordTiming] = []
    for index, timing in enumerate(timings):
        assert timing is not None
        start = max(timing.start, output[-1].end if output else 0.0)
        end = max(timing.end, start + min_word_seconds)
        if index + 1 < len(timings) and timings[index + 1] is not None:
            next_start = timings[index + 1].start  # type: ignore[index]
            if next_start > start:
                end = min(end, next_start)
        output.append(WordTiming(text=timing.text, start=start, end=end, probability=timing.probability))
    return output


def build_cues(
    words: Iterable[WordTiming],
    *,
    max_words: int = 12,
    max_duration: float = 4.8,
    max_chars: int = 88,
    pause_threshold: float = 0.32,
    cue_gap: float = 0.06,
) -> list[dict[str, Any]]:
    words_list = list(words)
    if not words_list:
        return []

    raw: list[dict[str, Any]] = []
    current: list[WordTiming] = []

    def flush() -> None:
        if not current:
            return
        text = " ".join(word.text for word in current).strip()
        text = re.sub(r"\s+([,.;:!?])", r"\1", text)
        raw.append(
            {
                "start": round(current[0].start, 3),
                "end": round(current[-1].end + 0.08, 3),
                "text": text,
            }
        )
        current.clear()

    for index, word in enumerate(words_list):
        current.append(word)
        duration = current[-1].end - current[0].start
        chars = len(" ".join(item.text for item in current))
        at_sentence_end = bool(re.search(r"[.!?…]['\"”’]?$", word.text))
        at_comma = word.text.endswith(",")
        gap_after = 0.0
        if index + 1 < len(words_list):
            gap_after = max(0.0, words_list[index + 1].start - word.end)
        if (
            at_sentence_end
            or (at_comma and len(current) >= 5)
            or len(current) >= max_words
            or duration >= max_duration
            or chars >= max_chars
            or gap_after >= pause_threshold
        ):
            flush()

    compacted: list[dict[str, Any]] = []
    for cue in raw:
        word_count = len(cue["text"].split())
        previous_ends_sentence = bool(
            compacted and re.search(r"[.!?…]['\"”’]?$", compacted[-1]["text"].strip())
        )
        if compacted and word_count <= 3 and not previous_ends_sentence:
            previous = compacted[-1]
            combined = f"{previous['text']} {cue['text']}"
            combined_duration = cue["end"] - previous["start"]
            if len(combined) <= max_chars + 10 and combined_duration <= max_duration + 0.5:
                previous["text"] = combined
                previous["end"] = cue["end"]
                continue
        compacted.append(dict(cue))

    for index, cue in enumerate(compacted[:-1]):
        cue["end"] = min(cue["end"], compacted[index + 1]["start"] - cue_gap)
        if cue["end"] <= cue["start"] + 0.2:
            cue["end"] = cue["start"] + 0.2
    return compacted


def offset_words(words: Iterable[WordTiming], offset_seconds: float) -> list[WordTiming]:
    return [
        WordTiming(
            text=word.text,
            start=word.start + offset_seconds,
            end=word.end + offset_seconds,
            probability=word.probability,
        )
        for word in words
    ]


def offset_cues(cues: Iterable[dict[str, Any]], offset_seconds: float) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    for cue in cues:
        output.append(
            {
                "start": round(float(cue["start"]) + offset_seconds, 3),
                "end": round(float(cue["end"]) + offset_seconds, 3),
                "text": cue["text"],
            }
        )
    return output


def fmt_vtt_time(seconds: float) -> str:
    milliseconds = max(0, round(seconds * 1000))
    hours, remainder = divmod(milliseconds, 3_600_000)
    minutes, remainder = divmod(remainder, 60_000)
    secs, ms = divmod(remainder, 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d}.{ms:03d}"


def cues_to_vtt(cues: Iterable[dict[str, Any]]) -> str:
    lines = ["WEBVTT", ""]
    for index, cue in enumerate(cues, start=1):
        lines.append(str(index))
        lines.append(f"{fmt_vtt_time(float(cue['start']))} --> {fmt_vtt_time(float(cue['end']))}")
        lines.append(str(cue["text"]))
        lines.append("")
    return "\n".join(lines)
