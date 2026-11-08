# Coinbase × Cursor — agent-first engineering

**Film:** *Coinbase Changed How Software Is Built. Here's What Happened.*
**Format:** 94.0 s · 30 fps · 1080 × 1920 (9:16) and 1920 × 1080 (16:9)
**Compositions:** `CoinbaseCaseStudy` · `CoinbaseCaseStudyWide`
**Source:** [Cursor customer case study — Coinbase](https://cursor.com/blog/coinbase), published 23 June 2026.

This is an editorial case study, not a Coinbase product demo. The software
interfaces in the film are deliberately generic and labelled **ILLUSTRATIVE
INTERFACE**. No supplied interface is presented as authentic Coinbase
software. Every number on screen is a reported customer outcome from the
Cursor case study, not a universal industry benchmark.

## Verified claims used in the film

| Claim | On-screen treatment |
| --- | --- |
| More than 2,400 developers at Coinbase use Cursor | `2,400+` · "developers using Cursor" |
| 75% of all PRs are created by agents, cloud and local | `75%` · "of pull requests created by agents" |
| 55% increase in PRs merged per engineer | `+55%` · "more pull requests merged per engineer" |
| Some teams reduced idea-to-production from 20 days to under 2 (1.8 days, >90% reduction) | `20 DAYS` → `< 2 DAYS` · "1.8 days for some teams" · `>90% REDUCTION` |
| 7 hours of manual coding saved per engineer per week | `7 HOURS` · "saved per engineer, every week" |
| Many engineers run 5–7 asynchronous agents in parallel | `5–7 AGENTS IN PARALLEL` |
| Teams of 1–2 engineers now ship work that once needed a full team | "Teams of 1–2 engineers" closing insight |

The 20-day figure is introduced as an **illustrative typical engineering
cycle** and is explicitly qualified as **some teams** when it becomes a
Coinbase claim.

## Structure

| Time | Scene | Beat |
| --- | --- | --- |
| 0.0–7.0 | Hook | Code freezes; a pull request is assembled by agents |
| 7.0–20.0 | The old bottleneck | Illustrative 20-day cycle; review becomes the queue |
| 20.0–35.0 | The shift | 2,400+ developers; agent queue; human rail (intent / review / validate) |
| 35.0–48.0 | The 75% reveal | Twelve PR cards, nine agent-authored; oversized 75% |
| 48.0–62.0 | The speed transformation | Twenty-day strip collapses into `< 2 DAYS` |
| 62.0–76.0 | The productivity reveal | `+55%` merged PRs; `7 HOURS` returned; 1–2 engineer teams |
| 76.0–88.0 | Conclusion | Human at the centre of the agent system; final thesis |
| 88.0–94.0 | Signature | Established Simpledeav lockup |

## Narration

`en-US-BrianMultilingualNeural`, `+10%` rate, `-2 Hz` pitch, one segment per
scene, word-boundary captions. Voice ends at **84.25 s**; the last caption ends
at **84.01 s**, before the brand reveal.

Generated with:

```bash
.venv-audio/bin/python scripts/generate-airbnb-voice.py \
  --segments-file content/coinbase-voice-segments.json \
  --out-media public/audio/episodes/coinbase/voice.mp3 \
  --out-vtt   public/audio/episodes/coinbase/voice.vtt \
  --out-words public/audio/episodes/coinbase/voice.words.json \
  --out-cues  public/audio/episodes/coinbase/voice.cues.json
```

The voice file is **94.02 s**, **−15.9 LUFS**, mono 48 kHz. Captions were
regrouped by hand from the real word timings into two-line, sentence-level
cues (22 cues) so that no cue breaks a phrase such as "pull requests".

## Sound

- **Music:** Mixkit "Vastness", trimmed to 88.5 s, 2.6 kHz speech carve,
  `−20 LUFS`, fade-out under the closing line, ducked 50% under narration.
- **Foley:** licensed Mixkit impact / whoosh / riser / brand sting cues plus
  precision UI ticks and keyboard bursts. One intentional sound per beat; no
  impacts stack inside 0.12 s.
- **Mix:** narration 0.94 linear, music ≤ 0.205, SFX fixed 0.72 gain.
- **Silence:** music resolves before the final card; the signature has its own
  short brand sting.

## Design system

- Near-black `#070809`; warm white `#F4F1E8`; graphite `#101214`.
- Restrained electric lime `#C8F65B`.
- Poppins throughout; SF Pro Display fallback; SF Mono for software labels.
- Full-frame editorial layouts, masked type, large negative space, no scene
  numbers, no progress bars, no debug overlays.
- 16:9 is a separate composition: split editorial columns, a horizontal
  timeline, and a right-side operator ring rather than a stretched portrait.

## QC

- [x] 2820 frames / 94.0 s / 30 fps in both aspects.
- [x] Voice and captions end before the signature.
- [x] All five reported figures checked against the Cursor case study.
- [x] 20-day figure labelled illustrative and later qualified as "some teams".
- [x] PR panels labelled illustrative; no fake Coinbase dashboard.
- [x] Captions readable at 9:16 (33 px) and 16:9 (26 px), safe margins.
- [x] No top/bottom bars, scene labels, frame counters, or progress overlays.
- [x] All local fonts and audio; no remote assets at render time.
- [x] Both compositions render and are inspected as stills and a draft.

## Render

```bash
npx remotion render CoinbaseCaseStudy      out/CoinbaseCaseStudy.mp4      --crf=18
npx remotion render CoinbaseCaseStudyWide  out/CoinbaseCaseStudyWide.mp4  --crf=18
```

Outputs:

- `out/CoinbaseCaseStudy.mp4` — 1080 × 1920, 30 fps, 94.0 s
- `out/CoinbaseCaseStudyWide.mp4` — 1920 × 1080, 30 fps, 94.0 s

Useful stills:

```bash
npx remotion still CoinbaseCaseStudy out/still.png --frame=1150
```

Preview stills used in the README live in `docs/preview/coinbase/`.
