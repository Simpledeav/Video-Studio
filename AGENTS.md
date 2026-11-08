# AGENTS.md — Simpledeav Studio v2

This file is the operating contract for any agent working in this project.
Read it before touching a composition.

## First read

1. `memory/README.md`
2. `memory/process/rules.md`
3. `memory/voice/default.json`
4. `memory/presets/README.md`
5. `memory/process/video-creation.md`

## Non-negotiable rules

- **Never render.** Do not render MP4, WebM, GIF or 4K. Do not start a render
  queue. The delivery is Remotion Studio in the browser.
- **Three formats per film.** Vertical 1080×1920, horizontal 1920×1080 and cover
  1080×1350 (1 frame). The horizontal is recomposed, never cropped.
- **Voice is `SD_VOICE_03 — Nathan Cole` only.** No other voice is permitted.
  One voice per film.
- **Default preset is `house`.** Use `walmart` (Editorial Pop) only when the
  brief asks for the bright retail-documentary look.
- **Every film gets a record** in `videos/<slug>/` with the prompt, description
  and LinkedIn/X/TikTok/Instagram captions.
- **No heavy files in Git.** Audio, images, video, models, venvs and render
  output stay untracked.
- **Stop when done.** Do not start a dev server and leave it running. Do not
  create extra demo films. Report paths and finish.

## Voice

- Read `memory/voice/default.json`.
- Use `VoiceNarration` from `src/voice-library/VoiceNarration.tsx` or
  `getVoiceAssetPath()` from `src/memory/index.ts`.
- Resolve with `node scripts/voice-lookup.mjs "SD_VOICE_03"`.
- Generate with `python3 scripts/voice-say.py ...`.
- Never substitute a voice silently. Missing asset = stop and report.

## Presets

- `memory/presets/house/style.json` — default.
- `memory/presets/walmart/style.json` — Walmart Editorial Pop.
- Code tokens: `src/config/presets/editorialPop.ts` and
  `src/components/presets/editorialPop/kit.tsx`.
- Do not mix presets. Do not edit an existing preset in place; add a new folder.

## New video checklist

- [ ] `npm run new:video -- --slug <slug> --title "<title>"`
- [ ] Fill `videos/<slug>/prompt.md` with the user's actual prompt.
- [ ] Choose voice and preset.
- [ ] Write narration and voice segments.
- [ ] Build vertical, horizontal and cover.
- [ ] Register all three in `src/Root.tsx`.
- [ ] Preview in Studio.
- [ ] Fill `description.md` and `social/*.md`.
- [ ] `npm run typecheck`.
- [ ] Stop. No render.

## Commands

```bash
npm run dev
npm run typecheck
npm run check:memory
npm run new:video -- --slug my-video --title "My Video"
node scripts/voice-lookup.mjs "SD_VOICE_03"
```

## Project map

```text
memory/        Canonical defaults, presets, voice, process, templates
videos/        Per-video writing records
src/           Remotion code
content/       Episode data and cue sheets
public/        Local assets (heavy media gitignored)
scripts/       Voice, validation and scaffolding
docs/          Long-form production notes
defaults/      Legacy reference notes (memory wins on conflict)
presets/       Legacy preset source (memory/presets is canonical)
```
