"""Text preparation shared by every voice engine.

The engines do not all accept phonemes or SSML, so pronunciation is controlled
with a conservative dictionary plus deterministic number/currency expansion.
"""
from __future__ import annotations

import re
from typing import Iterable

_MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]

_CURRENCY_WORDS = {
    "₦": ("naira", "naira"),
    "$": ("dollar", "dollars"),
    "£": ("pound", "pounds"),
    "€": ("euro", "euros"),
}

_ABBREVIATIONS = [
    (re.compile(r"\be\.g\.", re.I), "for example"),
    (re.compile(r"\bi\.e\.", re.I), "that is"),
    (re.compile(r"\bvs\.?", re.I), "versus"),
    (re.compile(r"\betc\.", re.I), "et cetera"),
    (re.compile(r"\bMr\.", re.I), "Mister"),
    (re.compile(r"\bMrs\.", re.I), "Missus"),
    (re.compile(r"\bDr\.", re.I), "Doctor"),
    (re.compile(r"\bSt\.", re.I), "Saint"),
    (re.compile(r"\bNo\.\s*(?=\d)", re.I), "number "),
]

# Only whole-word, unambiguous initialisms. Do not add ordinary words here.
_INITIALISMS = [
    (re.compile(r"\bAI\b"), "A I"),
    (re.compile(r"\bAPI\b"), "A P I"),
    (re.compile(r"\bCEO\b"), "C E O"),
    (re.compile(r"\bCTO\b"), "C T O"),
    (re.compile(r"\bCFO\b"), "C F O"),
    (re.compile(r"\bGDP\b"), "G D P"),
    (re.compile(r"\bSaaS\b", re.I), "Sass"),
    (re.compile(r"\bUS\b"), "U S"),
    (re.compile(r"\bUK\b"), "U K"),
    (re.compile(r"\bNGN\b"), "naira"),
    (re.compile(r"\bUSD\b"), "U S dollars"),
    (re.compile(r"\bGB\b"), "gigabytes"),
    (re.compile(r"\bTB\b"), "terabytes"),
    (re.compile(r"\bMB\b"), "megabytes"),
]

# A few number words that read more naturally in a documentary than digits.
_SMALL_NUMBERS = {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
    10: "ten",
    11: "eleven",
    12: "twelve",
    13: "thirteen",
    14: "fourteen",
    15: "fifteen",
    16: "sixteen",
    17: "seventeen",
    18: "eighteen",
    19: "nineteen",
    20: "twenty",
}


def _two_digit_words(value: int) -> str:
    if value <= 20:
        return _SMALL_NUMBERS[value]
    tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    remainder = value % 10
    return tens[value // 10] if remainder == 0 else f"{tens[value // 10]}-{_SMALL_NUMBERS[remainder]}"


def _year_words(year: int) -> str:
    if year == 2000:
        return "two thousand"
    if 2001 <= year <= 2009:
        return f"two thousand and {_SMALL_NUMBERS[year - 2000]}"
    if 2010 <= year <= 2099:
        return f"twenty {_two_digit_words(year - 2000)}"
    if year == 1900:
        return "nineteen hundred"
    if 1901 <= year <= 1999:
        return f"nineteen {_two_digit_words(year - 1900)}"
    return str(year)


def expand_numbers(text: str) -> str:
    """Expand currency, percentages, dates and year-like numbers.

    Ordinary quantities keep their digits; modern TTS engines read them
    correctly and expanding every number risks making the copy harder to
    follow.
    """

    # ISO date: 2026-11-06 -> the sixth of November, twenty twenty-six.
    def iso_date(match: re.Match[str]) -> str:
        year, month, day = (int(part) for part in match.groups())
        if not (1 <= month <= 12 and 1 <= day <= 31):
            return match.group(0)
        suffix = "th" if 11 <= day <= 13 else {1: "st", 2: "nd", 3: "rd"}.get(day % 10, "th")
        return f"the {day}{suffix} of {_MONTHS[month - 1]}, {_year_words(year)}"

    text = re.sub(r"\b(\d{4})-(\d{2})-(\d{2})\b", iso_date, text)

    # Currency with optional scale suffix: ₦15,500 / $1.2bn / £3 million.
    currency_pattern = re.compile(
        r"([₦$£€])\s?([\d,]+(?:\.\d+)?)\s?(bn|b|m|k|billion|million|thousand)?\b",
        re.I,
    )

    def currency(match: re.Match[str]) -> str:
        symbol, amount, scale = match.groups()
        singular, plural = _CURRENCY_WORDS[symbol]
        spoken_scale = {
            "bn": "billion",
            "b": "billion",
            "m": "million",
            "k": "thousand",
            "billion": "billion",
            "million": "million",
            "thousand": "thousand",
        }.get((scale or "").lower(), "")
        unit = singular if amount in {"1", "1.0"} and not spoken_scale else plural
        return " ".join(part for part in (amount, spoken_scale, unit) if part)

    text = currency_pattern.sub(currency, text)

    # Bare symbols.
    text = text.replace("₦", " naira ").replace("$", " dollars ").replace("£", " pounds ").replace("€", " euros ")

    # Percentages: 64% -> 64 percent.
    text = re.sub(r"(\d+(?:\.\d+)?)\s?%", r"\1 percent", text)

    # Storage and speeds.
    text = re.sub(r"\b(\d+)\s?GB\b", r"\1 gigabytes", text, flags=re.I)
    text = re.sub(r"\b(\d+)\s?TB\b", r"\1 terabytes", text, flags=re.I)
    text = re.sub(r"\b(\d+)\s?MB\b", r"\1 megabytes", text, flags=re.I)
    text = re.sub(r"\b(\d+)\s?K\b", r"\1 K", text)
    text = re.sub(r"\b(\d+)\s?fps\b", r"\1 frames per second", text, flags=re.I)

    # Standalone years. Do not touch numbers that are clearly quantities or
    # money because the currency pass already handled them.
    def year(match: re.Match[str]) -> str:
        value = int(match.group(0))
        if 1900 <= value <= 2099:
            return _year_words(value)
        return match.group(0)

    text = re.sub(r"(?<![\d,.$₦£€])\b(?:19|20)\d{2}\b(?![\d,.%])", year, text)

    return text


def apply_pronunciations(text: str, entries: Iterable[dict[str, str]]) -> str:
    """Replace whole terms with their spoken form, longest term first."""
    prepared = [entry for entry in entries if entry.get("spoken") and entry.get("term")]
    prepared.sort(key=lambda entry: len(entry["term"]), reverse=True)
    output = text
    for entry in prepared:
        term = entry["term"]
        spoken = entry["spoken"]
        if term.lower() == spoken.lower():
            continue
        pattern = re.compile(rf"(?<![\w]){re.escape(term)}(?![\w])", re.IGNORECASE)
        output = pattern.sub(spoken, output)
    return output


def prepare_text(text: str, entries: Iterable[dict[str, str]] | None = None) -> str:
    cleaned = " ".join(text.replace("\u00a0", " ").split())
    cleaned = expand_numbers(cleaned)
    for pattern, replacement in _ABBREVIATIONS:
        cleaned = pattern.sub(replacement, cleaned)
    for pattern, replacement in _INITIALISMS:
        cleaned = pattern.sub(replacement, cleaned)
    if entries:
        cleaned = apply_pronunciations(cleaned, entries)
    cleaned = re.sub(r"\s+([,.;:!?])", r"\1", cleaned)
    cleaned = re.sub(r"\s{2,}", " ", cleaned)
    return cleaned.strip()


_SENTENCE_RE = re.compile(r"(?<=[.!?…])\s+(?=[\"'“‘(\[]?[A-Z0-9])")


def split_sentences(text: str) -> list[str]:
    parts = [part.strip() for part in _SENTENCE_RE.split(text.strip()) if part.strip()]
    if not parts:
        return [text.strip()] if text.strip() else []
    # Merge tiny fragments into the previous sentence so the engine does not
    # generate a one-word utterance with a full stop.
    merged: list[str] = []
    for part in parts:
        if merged and len(part.split()) <= 2 and not part.endswith(("?", "!")):
            merged[-1] = f"{merged[-1]} {part}"
        else:
            merged.append(part)
    return merged


def chunk_text(text: str, max_words: int = 38) -> list[str]:
    """Group whole sentences into chunks that fit an engine's context."""
    sentences = split_sentences(text)
    chunks: list[str] = []
    current: list[str] = []
    current_words = 0
    for sentence in sentences:
        words = len(sentence.split())
        if current and current_words + words > max_words:
            chunks.append(" ".join(current))
            current = [sentence]
            current_words = words
        else:
            current.append(sentence)
            current_words += words
    if current:
        chunks.append(" ".join(current))
    return chunks


def word_count(text: str) -> int:
    return len(re.findall(r"[\w’'-]+", text))


def estimate_speech_seconds(text: str, wpm: float = 150.0, pause_seconds: float = 0.25) -> float:
    sentences = max(1, len(split_sentences(text)))
    return word_count(text) / max(60.0, wpm) * 60.0 + max(0, sentences - 1) * pause_seconds
