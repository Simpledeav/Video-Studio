# Presets

A preset is a complete visual system: palette roles, typography, layout, motion
grammar, component kit and scene spine. Pick one preset per film. Do not mix
two presets in one cut.

| Preset | ID | Status | Use when |
| --- | --- | --- | --- |
| [House](./house/) | `house` | **Default** | Serious business, technology, incident, lesson, founder and product stories. |
| [Walmart](./walmart/) | `walmart` | Approved alternate | Bright retail documentary, viral product storytelling, price/receipt proof, sold-out urgency, Walmart/retail case studies. |

## How to choose

1. Read the brief.
2. If it asks for the Walmart look, retail colour, product cards, price tags or
   a viral commercial rhythm, use `walmart`.
3. Otherwise use `house`.
4. If the brief asks for a genuinely new language, add a new folder here. Never
   edit an existing preset in place.

## What every preset must define

- `formats` — vertical, horizontal and cover sizes.
- `voice` — `SD_VOICE_03` only.
- `palette` — named roles, not raw hex sprinkled through components.
- `typography` — display family, weights, tracking, size ranges.
- `layout` — margins, safe zones, panel rules, caption band.
- `motion` — easing, entrance, camera, holds.
- `sceneSpine` — the act order and the job of each act.
- `sound` — voice gain, music level, ducking, SFX palette.
- `rules` — do and do not.
- `code` — where the tokens, kit and reference film live.

## Shared rules

Both presets inherit the same non-negotiables:

- One idea per scene.
- The headline is the first thing the eye finds.
- Max two accent colours per frame.
- Every number on screen matches the narration and a named source.
- Reconstructed UI is labelled.
- Captions are real word timings and never cover the caption band.
- The brand close is avatar + bold `SIMPLEDEAV` only.
- No MP4 or 4K render. Browser preview only.
