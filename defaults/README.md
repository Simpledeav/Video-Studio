# Simpledeav defaults

> **Legacy reference.** The canonical, current defaults live in
> [`../memory/`](../memory/README.md). When this folder and `memory/` disagree,
> **memory wins** — most importantly the default voice is now
> `SD_VOICE_03 — Nathan Cole` (not the older `en-US-BrianMultilingualNeural`
> note below).

Canonical, no-decisions-needed settings for every new Simpledeav video. If a
task does not explicitly ask to change the sound or the end card, use exactly
what is in this folder.

| File | Use |
| --- | --- |
| [`visual-style.md`](./visual-style.md) | The house look: palette, type, layout, motion grammar, act spine, wide and cover rules, QA checklist. |
| [`audio-preset.json`](./audio-preset.json) | Machine-readable audio system: voice, processing chain, music mix, ducking, SFX gain and palette, loudness targets. |
| [`audio.md`](./audio.md) | The practical audio playbook: how to execute the preset, commands, checklist. |
| [`brand-signoff.md`](./brand-signoff.md) | The five approved closing screens (all logo-only), how to preview them, and how to set the default. |
| [`../presets/editorial-pop/`](../presets/editorial-pop/) | **Editorial Pop** — the bright retail-documentary visual preset from the Walmart Chicken Purse film. Tokens, reusable kit, motion grammar and scene spine. |

Code entry points:

- `src/config/audioPreset.ts` — typed access to `audio-preset.json`.
- `src/components/audio/AirbnbScore.tsx` — reference implementation of the preset.
- `src/components/branding/SimpledeavSignOff.tsx` — the default closing screen.
- `src/components/branding/SocialEndCard.tsx` — the adapter every episode uses;
  it now renders the default closing screen.
- `src/config/presets/editorialPop.ts` — Editorial Pop tokens.
- `src/components/presets/editorialPop/kit.tsx` — Editorial Pop reusable kit.

Reference film: **Airbnb — The Startup That Sold Cereal** (`AirbnbCereal`),
`content/episode-airbnb-cereal.json`.

Visual reference film: **THE AI CODING AGENT THAT DELETED A PRODUCTION DATABASE**
(`DeletedProductionDatabase` / `DeletedProductionDatabaseWide`). Its palette,
type, motion and act spine are the house style described in
[`visual-style.md`](./visual-style.md).

## Rules for agents

1. **Do not redesign the end card.** It is one component with five approved
   templates, all logo-only: avatar + bold `SIMPLEDEAV`. Change the template,
   never the content.
2. **Do not swap the voice** unless the brief names a different voice. The
   default is `en-US-BrianMultilingualNeural` at `+8%` / `-2Hz`.
3. **Do not invent a mix.** Music stays under 0.25 linear, narration at 0.92,
   Foley through the fixed 0.62 gain.
4. **Do not render an MP4** to check audio. Measure with `ffprobe`/`ffmpeg`
   `ebur128`, or review in Remotion Studio.
5. If a new film needs a different *sound*, add a new preset file next to
   `audio-preset.json` and point the episode at it — never edit the default in
   place, so previous films stay reproducible.
6. **Do not invent a new look.** Start from
   [`visual-style.md`](./visual-style.md): the eight-act spine, one accent per
   act, black stage, oversized Poppins display, mono micro labels, dedicated
   16:9 compositions and a 4:5 still cover. Add a new style preset only when the
   brief explicitly asks for a different visual language. **Editorial Pop** is
   the approved bright retail alternative: use
   [`../presets/editorial-pop/`](../presets/editorial-pop/) when the brief wants
   colorful, funny, high-retention retail storytelling.
