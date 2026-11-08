# Simpledeav Studio v2

A well-structured Remotion studio for Simpledeav videos. It keeps the working
compositions, presets and voice system from `VideoStudio/simpledeav-studio` and
adds a permanent **memory** layer so every new film starts from the same
decisions.

**The delivery is the browser preview.** This project does not render MP4, WebM,
4K or any heavy export.

## Quick start

```bash
cd "$HOME/Documents/WORK VIDEO/simpledeav-studio-v2"
npm run dev
```

Open the Studio URL printed by Remotion (normally `http://localhost:3000`).
Every film has three compositions: vertical, horizontal and cover.

```bash
npm run typecheck     # TypeScript
npm run check:memory  # validate the memory folder
```

## The four defaults

| Decision | Default | Alternate |
| --- | --- | --- |
| **Voice** | `SD_VOICE_03 — Nathan Cole` | Only this voice is permitted |
| **Preset** | `house` — Kinetic Tech Incident | `walmart` — Editorial Pop |
| **Formats** | Vertical 1080×1920 | Horizontal 1920×1080 + cover 1080×1350 |
| **Output** | Browser preview | No MP4, no 4K, no render queue |

## Start here

| File | Why |
| --- | --- |
| [`AGENTS.md`](./AGENTS.md) | The operating contract for any agent. |
| [`memory/README.md`](./memory/README.md) | The memory index and read order. |
| [`memory/process/rules.md`](./memory/process/rules.md) | The non-negotiable rules. |
| [`memory/process/video-creation.md`](./memory/process/video-creation.md) | End-to-end workflow. |
| [`memory/voice/default.json`](./memory/voice/default.json) | Voice identities, prosody and audio paths. |
| [`memory/presets/house/style.json`](./memory/presets/house/style.json) | The default look. |
| [`memory/presets/walmart/style.json`](./memory/presets/walmart/style.json) | The Walmart Editorial Pop look. |
| [`videos/README.md`](./videos/README.md) | Per-video writing records. |

## Architecture

```text
simpledeav-studio-v2/
├── AGENTS.md                 Agent contract: rules, voice, presets, stop conditions
├── README.md                 This file
├── memory/                   Canonical design + production memory
│   ├── index.json            Machine-readable manifest of every default
│   ├── voice/                Voice identities, default, alternate, audio paths
│   ├── design/               House style document + design tokens
│   ├── presets/              house/ and walmart/ visual systems
│   ├── brand/                Five logo-only closing screens
│   ├── process/              Rules, workflow, QA, video-record spec
│   ├── templates/            Starter files for a video record
│   └── assets/               Asset policy and restore notes
├── videos/                   One writing record per video
│   └── <slug>/
│       ├── metadata.json
│       ├── prompt.md
│       ├── description.md
│       ├── social/
│       │   ├── linkedin.md
│       │   ├── x.md
│       │   ├── tiktok.md
│       │   └── instagram.md
│       └── notes.md
├── src/                      Remotion code
│   ├── Root.tsx              Composition registry
│   ├── memory/               Typed bridge to memory/ (voice + presets + formats)
│   ├── voice-library/        Strict voice resolver and VoiceNarration
│   ├── compositions/         Vertical, wide and cover compositions
│   ├── components/           Shared and film-specific components
│   ├── config/               Tokens, episode schema, brand, audio
│   ├── hooks/ styles/ utils/
│   └── index.ts
├── content/                  Episode JSON, cue sheets, voice segments
├── public/                   Local assets (heavy media gitignored)
│   ├── audio/voice-library/  SD_VOICE_03 only
│   ├── brand/ fonts/ images/ video/
│   └── asset-manifest.json
├── scripts/                  Voice, validation, scaffolding
├── docs/                     Long-form production notes
├── defaults/                 Legacy reference (memory/ wins on conflict)
├── presets/                  Legacy preset source (memory/presets/ is canonical)
├── package.json
├── remotion.config.ts
├── tsconfig.json
└── .gitignore
```

## Voice

The default is **`SD_VOICE_03 — Nathan Cole`** (`en-US-AndrewMultilingualNeural`).
No alternate voice is permitted.

```bash
node scripts/voice-lookup.mjs "SD_VOICE_03"
node scripts/voice-lookup.mjs "SD_VOICE_03" --emotion=calm
```

```tsx
import { VoiceNarration } from "../../voice-library/VoiceNarration";

// Default — no voice prop needed.
<VoiceNarration emotion="calm" />

// Alternate, only when the brief names it.
<VoiceNarration voice="SD_VOICE_03" emotion="reflection" />
```

Audio lives in `public/audio/voice-library/` and is gitignored because it is
heavy. The manifest and identity sheets are tracked. See
[`memory/assets/README.md`](./memory/assets/README.md) to restore the audio.

## Presets

- **House** — near-black stage, oversized Poppins, one accent per act, evidence
  panels, eight-act incident spine. Default for most films.
- **Walmart / Editorial Pop** — saturated retail blue, huge Poppins, white
  product cards, price tags, receipts, sold-out stamps, 2–4 second hard cuts.
  Use when the brief asks for that look.

Full documents: [`memory/presets/`](./memory/presets/).

## Create a video record

Every video gets a folder:

```bash
npm run new:video -- \
  --slug my-video \
  --title "My Video" \
  --preset house \
  --voice SD_VOICE_03
```

This creates `videos/my-video/` with the prompt, description, social captions
and metadata. Fill them in before calling the film done.

## Compositions

The project currently carries one film and its three registered formats:

| Composition | Format | Size |
| --- | --- | --- |
| `JuiceroFilm` | Vertical | 1080×1920 |
| `JuiceroFilmWide` | Horizontal | 1920×1080 |
| `JuiceroCover` | Cover | 1080×1350 |

The old archive compositions were removed. The design system, memory, presets,
voice library and brand close were kept intact for future films.

New films must register all three formats:

```tsx
<Composition id="MyFilm" component={MyFilm} durationInFrames={2400} fps={30} width={1080} height={1920} />
<Composition id="MyFilmWide" component={MyFilmWide} durationInFrames={2400} fps={30} width={1920} height={1080} />
<Composition id="MyFilmCover" component={MyFilmCover} durationInFrames={1} fps={30} width={1080} height={1350} />
```

## Git

The `.gitignore` keeps heavy files out:

- `node_modules/`, `out/`, `dist/`, `.remotion/`
- `public/audio/**/*.wav`, `*.mp3` and other audio
- `public/images/**`, `public/video/**`
- `models/`, `.models/`, `.venv*/`
- `docs/preview/**`

Verify:

```bash
git status --short
git check-ignore -v public/audio/voice-library/SD_VOICE_03_Nathan_Cole/identity.wav
```

## What changed from the previous studio

- Added the canonical `memory/` layer.
- Added `videos/` writing records with a scaffold script.
- Added the single-voice library (`SD_VOICE_03`) with a strict
  resolver and a `VoiceNarration` component.
- Added a typed `src/memory/` bridge.
- Added a memory validator and video-record scaffold.
- Replaced the permissive `.gitignore` with a heavy-asset-aware one.
- Kept every working composition and asset from the previous project.

## Legacy notes

`defaults/` and `presets/` from the previous studio are kept for reference. When
they disagree with `memory/`, **memory wins**.

The old project lives at `../VideoStudio/simpledeav-studio/` and remains the
source for restoring heavy assets.
