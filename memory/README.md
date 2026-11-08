# Memory

`memory/` is the permanent design and production memory of this studio. It is
the first thing a human or an agent should read before creating a video.

It replaces guesswork with four decisions that are already made:

1. **Voice** — `SD_VOICE_03 — Nathan Cole` is the default for every video.
2. **Look** — start from the house preset; use the Walmart preset when the
   brief asks for that bright retail-documentary style.
3. **Delivery** — design and preview in the browser. Never render MP4 or 4K.
4. **Record** — every video gets a writing record in `videos/<slug>/`.

## Read order

| Order | File | Why |
| --- | --- | --- |
| 1 | [`process/rules.md`](./process/rules.md) | Non-negotiable production rules. |
| 2 | [`voice/default.json`](./voice/default.json) | Default voice, alternate voice, emotions, audio paths. |
| 3 | [`presets/house/style.json`](./presets/house/style.json) | The house look used by most films. |
| 4 | [`presets/walmart/style.json`](./presets/walmart/style.json) | The Walmart Editorial Pop look. |
| 5 | [`design/tokens.json`](./design/tokens.json) | Shared canvas, type, colour and motion tokens. |
| 6 | [`process/video-creation.md`](./process/video-creation.md) | The end-to-end production workflow. |
| 7 | [`process/video-record.md`](./process/video-record.md) | The per-video writing record specification. |

## Folder map

```text
memory/
  index.json                  Machine-readable manifest of every default.
  voice/                      Voice identities, audio paths, prosody, rules.
    default.json              ONLY = SD_VOICE_03.
    voices/                   Human-readable identity sheets.
  design/                     The shared visual language.
    house-style.md            Full house-style document.
    tokens.json               Canvas, palette, type, layout and motion tokens.
  presets/                    Reusable visual systems.
    house/                    The Kinetic Tech Incident house look.
    walmart/                  Walmart Editorial Pop (bright retail documentary).
  brand/                      Closing screen and brand-safe rules.
  process/                    Rules, workflow, QA and record specification.
  templates/video-record/     Starter files for a new video record.
  assets/                     Asset policy and restore notes.
```

## Precedence

`memory/` wins over older notes in `defaults/` and `presets/` when they
disagree. `src/config/` and `src/components/` remain the executable reference
implementations. If a code token and a memory token disagree, treat the memory
file as the design intent and update the code in the same task.

## Quick commands

```bash
npm run dev                 # open Remotion Studio in the browser
npm run new:video -- --slug my-video --title "My Video"
npm run check:memory        # validate the memory files
node scripts/voice-lookup.mjs "SD_VOICE_03"
```

## The four hard rules

- **No rendering.** No MP4, WebM, 4K or render queue. Browser preview only.
- **Voice is `SD_VOICE_03 — Nathan Cole` only.**
- **Three formats per film.** Vertical, horizontal and cover.
- **No heavy files in Git.** Audio, images and video stay local.
