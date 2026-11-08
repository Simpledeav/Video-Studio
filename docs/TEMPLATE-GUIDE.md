# Simpledeav Studio — Template Guide

This is a small, reusable Remotion production system for vertical cinematic
stickman stories. The demo is fully playable in Remotion Studio and no video is
rendered by the template.

## 1. Start here

```bash
cd "$HOME/Documents/WORK VIDEO/VideoStudio/simpledeav-studio"
npm run dev
```

Studio normally opens at `http://localhost:3000`. The original demo composition
is `StickmanStory`; the AI-agent episode is registered separately as
`AIAgentGuardrails`. See `docs/AI-AGENT-GUARDRAILS.md` for its scene and audio map.

Before changing an episode:

```bash
npm run check
```

**Visual language:** every new episode starts from the house style in
[`../defaults/visual-style.md`](../defaults/visual-style.md) — eight-act spine,
palette, typography, motion grammar, dedicated 16:9 layouts and a 4:5 cover.
Do not invent a new look unless the brief asks for one.

## 2. Core files

```
src/
  index.ts                         Remotion entry + global CSS
  Root.tsx                         registers StickmanStory
  compositions/
    StickmanStory.tsx              duration, scenes, audio, subtitles, grain
  components/
    character/
      StickmanRig.ts               connected joint geometry + two-bone arm IK
      Stickman.tsx                 SVG rendering, faces, hands, feet, shadows
      poses.ts                     poses and action animation
      motion.ts                    deterministic facing and turn behavior
    scenes/
      SceneRenderer.tsx            composition of one scene
      SceneBackground.tsx          local photo/video background + grading
      SceneVisuals.tsx             layout registry
      environments/                city, office, agent, chart, catch visuals
    typography/
      Headline.tsx                 headline layout with semantic accents
      TextAnimation.tsx            eight reusable text presets
      SubtitleTrack.tsx            ordinary two-line subtitles
      NumericCounter.tsx           animated numbers
    camera/CameraMotion.tsx         push, pull, pan, drift
    audio/AudioTimeline.tsx         narration, music, ducking, SFX, fades
    branding/SimpledeavSignature.tsx
    transitions/Transitions.tsx
  config/
    brand.ts                       brand identity and signature defaults
    theme.ts                       semantic palettes
    motion.ts                      dimensions, springs, easing
    audio.ts                       volume and ducking defaults
    episode.schema.ts              types, runtime validation, scene schema
  utils/                           timing, text and asset helpers
content/
  demo-episode.json                working 90-second demo
  episode-template.json            documented starting point for a new episode
public/                            local assets only
scripts/
  generate-voice.py                Edge TTS + real word-boundary subtitles
  validate-episode.mjs             source/asset validator
defaults/                          shared audio preset + brand sign-off (read first)
docs/
```

## 3. Composition and duration

- Width: 1080
- Height: 1920
- FPS: 30
- Duration: 60–90 seconds (`durationSeconds` in the episode JSON)
- Default: 90 seconds

Scene times are in seconds and must be contiguous from `0` to
`durationSeconds`. The validator rejects gaps, overlaps, and scenes that run
past the composition.

## 4. Brand configuration

**The closing screen is fixed by template, not redesigned per episode.** Every
episode renders `src/components/branding/SimpledeavSignOff.tsx` (via
`SocialEndCard`): avatar + bold `SIMPLEDEAV` wordmark on black, in one of five
built-in layouts. Do not add monograms, handles, tags, URLs or fine print. The
spec lives in `defaults/brand-signoff.md`; the episode only supplies
`brand.startSeconds` and `revealDurationSeconds`.

`src/config/brand.ts` is the single source of truth:

- Brand name, handle and accent light
- Instagram and GitHub URLs
- Local avatar path (460 × 460)
- Wordmark spelling and tracking
- The five closing-screen templates and their metadata
- `DEFAULT_END_CARD_TEMPLATE` — the template every film inherits
- Default reveal duration
- Whether the avatar and signature are enabled

The sign-off is placed only in a scene whose layout is `closing`. It is never a
persistent corner watermark and never appears before the last 20% of the film.
Its accent comes from the active palette, falling back to the brand accent. The
avatar is loaded locally from `public/brand/simpledeav-avatar.png`.

The avatar is a 460×460 PNG downloaded from
`https://avatars.githubusercontent.com/u/88326987?s=460&v=4`. It is large enough
for a 150 px portrait at video resolution without visible softening.

## 5. Themes

`src/config/theme.ts` exports semantic palettes. Select one through the episode:

```json
"themeId": "GRAPHITE_LIME"
```

Available IDs:

| ID | Mood |
| --- | --- |
| `MIDNIGHT_CYAN` | technical, nocturnal, precise |
| `GRAPHITE_LIME` | focused, modern, quietly optimistic |
| `BURGUNDY_GOLD` | intimate, consequential, human |
| `IVORY_INK` | editorial, candid, daylight clarity |
| `ELECTRIC_VIOLET` | future-facing, inventive, electric |

Each palette provides background, secondary background, primary/secondary text,
primary/secondary accent, positive, warning, surface, border, character line,
character fill, caption text/shadow/background, and glow tokens.

Changing the palette updates scene backgrounds, type, charts, interfaces,
character color, transitions, subtitles, and the signature. Do not change
`themeId` mid-episode; choose one palette per film.

To add a palette, append an ID to `PALETTE_IDS` and add a matching entry to
`THEMES` with every semantic token. The validator reads the ID list from source.

## 6. Character rig

`StickmanRig.ts` defines the required geometry:

- Pelvis, hips, knees, ankles, feet
- Torso, chest, neck, head center/radius
- Shoulders, elbows, wrists, hand anchors
- Fixed segment lengths and rounded SVG caps/joins

Arms can be authored as angle chains or as a hand target. Target arms use
two-bone IK; the wrist is solved first and the hand is always built from the
solved wrist. The palm lands on the target for typing and object interactions.

`poses.ts` implements: idle, walk, sit, type, point, lookAtScreen, surprise,
think, celebrate, turn, sleep, reconsider. Animation is frame-deterministic:
the same action and frame always produce the same pose. There is no random
movement and no `Math.random`.

Typing anchors are exported as `POSE_ANCHORS.typing` and consumed by the office
environment so the keyboard is positioned around the hands rather than guessed.

## 7. Scenes

Scene layouts are reusable components selected by name:

| `layout` | Purpose |
| --- | --- |
| `city` | photo/vector night city |
| `office` | local vector desk, laptop, UI, typing pose |
| `agentGrid` | AI agent task cards |
| `chart` | animated output chart and numeric counter |
| `threshold` | two-line cost/judgment chart |
| `catch` | branching consequence visual |
| `closing` | dawn city, final line, integrated signature |

A scene contains:

```json
{
  "id": "scene-id",
  "startSeconds": 12.5,
  "durationSeconds": 8.4,
  "layout": "agentGrid",
  "background": { "grade": "neutral", "parallax": 0.02 },
  "headlines": [
    {
      "kicker": "THE WORK",
      "text": "An army that\nnever sleeps.",
      "accentWords": ["never sleeps."],
      "preset": "kineticEmphasis",
      "startSeconds": 0.4,
      "size": "display",
      "align": "left",
      "placement": "top"
    }
  ],
  "character": {
    "action": "point",
    "x": 270,
    "y": 1500,
    "scale": 1.15,
    "facing": "right",
    "expression": "focused"
  },
  "camera": { "motion": "drift", "intensity": 0.04 },
  "transitionIn": "bloom",
  "visual": { "kind": "agents", "labels": ["Support", "Code", "Invoices", "Updates"] }
}
```

`background` can use a local `imagePath` and/or `videoPath`, plus
`imageOpacity`, `imageObjectPosition`, `videoObjectPosition`, `grade`, and
`parallax`. If a photo is missing or fails to load, the deliberate vector
environment remains.

Never put scene numbers, frame IDs, progress values, or production metadata on
screen. Headlines should be story content, not labels.

## 8. Typography

`TextAnimation.tsx` supports:

1. `wordByWord`
2. `staggeredPhrase`
3. `maskedUp`
4. `charReveal` (short headlines only)
5. `scaleSettle`
6. `splitLine`
7. `kineticEmphasis`
8. `finalReveal`

`NumericCounter` handles clean numeric reveals. Use a small number of presets
with intention; do not animate every line identically. Use `\n` for deliberate
line breaks in headlines. Accent words are rendered in Instrument Serif italic
with the primary accent color.

## 9. Subtitles

`SubtitleTrack.tsx` is intentionally simple:

- White/high-contrast text on a restrained scrim
- Max two lines in normal cases
- Bottom safe margin
- Fade only; no bouncing or per-word color changes
- Active cue disappears at its actual end, so pauses do not keep old captions

The demo's 36 cues come from real Edge TTS word boundaries, not equal divisions
of the duration. See `docs/AUDIO-GUIDE.md`.

## 10. Audio

`AudioTimeline.tsx` supports:

- Narration
- Music with fade in/out
- Per-SFX start, duration, volume, and fades
- Optional music ducking under each subtitle interval
- Master gain

The voiceover is the master clock. Scene anchors are chosen after the narration
is generated. SFX are placed at their visual events. All audio is local and
recorded in the manifest.

## 11. Creating a new episode

1. Copy `content/episode-template.json` to a new file.
2. Update the episode ID, title, topic, theme, narration, scenes, and assets.
3. Generate the voice and subtitles with `scripts/generate-voice.py`.
4. Read actual sentence timings and set scene boundaries around pauses.
5. Place SFX on the corresponding visual actions.
6. Update `src/Root.tsx` only if you want a different episode as the Studio
   default. The composition engine itself should not need to change.
7. Run `npm run check`.
8. Preview in Remotion Studio.
9. Do not render or export unless explicitly requested in a future task.

## 12. Signature

The production close is `SimpledeavSignOff` with one of five templates:
`aurora` (default), `atlas`, `axis`, `editorial`, `orbit`. Preview them in
Studio with `EndCardAurora` … `EndCardOrbit`, choose the default in
`src/config/brand.ts`, or pass `template` per film. The old
`SimpledeavSignature.tsx` is a legacy component kept only so older compositions
remain reproducible; do not use it for new work.

## 13. Validation limits

`npm run validate` checks source files, the JSON schema essentials, scene
continuity, theme IDs, local asset resolution, audio readability, subtitle
timing, composition registration, and the absence of an `out/` render directory.
It does not render frames. Browser preview is the visual verification step.
