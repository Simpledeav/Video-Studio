# Video creation workflow

This is the path from a brief to a browser-ready film. Follow it in order.

## 0. Read the memory

- [`rules.md`](./rules.md)
- [`../voice/default.json`](../voice/default.json)
- [`../presets/README.md`](../presets/README.md)

If the brief names a voice or preset, use it. If it does not, use
`SD_VOICE_03` and the house preset.

## 1. Scaffold the writing record

```bash
npm run new:video -- \
  --slug walmart-chicken-purse \
  --title "Walmart — The Chicken Purse That Sold Out in 90 Minutes" \
  --preset walmart \
  --voice SD_VOICE_03
```

This creates `videos/<slug>/` with `prompt.md`, `description.md`,
`social/*.md` and `metadata.json`. Fill the prompt with the user's actual brief
before you start designing. The record is part of the deliverable, not an
afterthought.

## 2. Choose the system

| Decision | Default | Alternate |
| --- | --- | --- |
| Voice | `SD_VOICE_03 — Nathan Cole` | `SD_VOICE_09 — James Carter` |
| Preset | `house` | `walmart` (Editorial Pop) |
| Formats | Vertical 1080×1920 | Horizontal 1920×1080 + cover 1080×1350 |

## 3. Write the narration first

- 215–230 words for 80 seconds, 240–260 for 90 seconds.
- One idea per sentence. Contractions. Commas you would breathe at.
- No trailer lines, no rhetorical question stacks.
- Keep the last sentence under about 14 words so the brand reveal can breathe.
- Break the script into act-sized segments and assign an emotion to each.
- Generate or place the audio under
  `public/audio/episodes/<slug>/` using the default voice.

Narration is the master clock. If the read runs long, raise the TTS rate or
trim the script; never time-stretch the audio.

## 4. Build the vertical film

- Create `src/config/<slug>.ts` (or a folder under `src/videos/<slug>/` for a
  new, clean build) with the canvas, palette, copy and scene boundaries.
- Keep one idea per scene.
- Use the preset's kit instead of one-off styles.
- Author scene times in seconds; derive frames from the film FPS.
- Cut the picture a beat before each narration sentence.
- End every scene on a held frame.

## 5. Recompose the horizontal film

- Same script, same score, same act boundaries.
- New layout: split columns, wider panels, more negative space.
- **Never** crop, stretch or letterbox the vertical.
- Keep the headline within about 820 px so it never crowds the evidence panel.

## 6. Build the cover

- `1080 × 1350`, `durationInFrames={1}`.
- One oversized headline stack, one evidence object, one quiet detail.
- Same palette and type as the film.
- Footer: avatar + `SIMPLEDEAV` + `@simpledeav` + date/source.
- Do not rely on animated primitives that start at zero.

## 7. Register the three compositions

In `src/Root.tsx`:

```tsx
<Composition id="MyFilm" component={MyFilm} durationInFrames={2400} fps={30} width={1080} height={1920} />
<Composition id="MyFilmWide" component={MyFilmWide} durationInFrames={2400} fps={30} width={1920} height={1080} />
<Composition id="MyFilmCover" component={MyFilmCover} durationInFrames={1} fps={30} width={1080} height={1350} />
```

Verify in Studio that all three appear and play.

## 8. Preview and QA

```bash
npm run dev
```

Open the composition in the browser. Check the key beats against
[`qa.md`](./qa.md). Do not render an MP4.

## 9. Finish the record

Fill in:

- `prompt.md` — the user's actual prompt, verbatim.
- `description.md` — 2–4 sentences on the story and the look.
- `social/linkedin.md` — professional lesson framing.
- `social/x.md` — short, punchy, one idea.
- `social/tiktok.md` — hook + curiosity + payoff.
- `social/instagram.md` — visual-first, saveable, 3–6 hashtags.
- `metadata.json` — titles, voice, preset, formats, composition IDs.

## 10. Stop

Report the composition IDs, the record folder and the memory files used. Do not
render, do not leave a server running, and do not create extra videos.
