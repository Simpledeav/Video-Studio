# Default visual system — Kinetic Tech Incident

**This is the house style for every new Simpledeav documentary episode.** Use it
unless the brief explicitly asks for a different look. The reference film is
**THE AI CODING AGENT THAT DELETED A PRODUCTION DATABASE** — vertical
(`DeletedProductionDatabase`) and wide (`DeletedProductionDatabaseWide`).

The system is editorial, not decorative: oversized statements, real-looking
evidence panels, one accent per act, and a dark stage that keeps the story
legible on a phone and a laptop.

---

## 1. The thesis

1. **One idea per scene.** If a scene needs two headlines, it is two scenes.
2. **Type is the hero.** Evidence panels support the claim; they never compete
   with it.
3. **One accent per act.** Cyan sets up, orange warns, red destroys, green
   recovers. Never rainbow a single frame.
4. **Build the interface, not a screenshot.** Everything is an illustrative
   reconstruction and is labelled as one.
5. **Restraint is part of the brand.** Black space is a feature.

---

## 2. Canvas and clocks

| Property | Vertical | Wide | Cover |
| --- | --- | --- | --- |
| Size | 1080 × 1920 | 1920 × 1080 | 1080 × 1350 |
| FPS | 30 | 30 | 30 (still) |
| Runtime | 80.0 s | 80.0 s | 1 frame |
| Frames | 2,400 | 2,400 | 1 |

- Scene timings are authored in **story seconds** (an 85 s read) and divided by
  `RP.pace` (`85 / 80 = 1.0625`) so the film plays 6.25 % faster without
  rewriting a single animation milestone.
- Every scene reads time through `useTime()`, which returns
  `frame * RP.pace`. Never read `useCurrentFrame()` directly inside a Replit
  scene.
- SFX cue starts are divided by `RP.pace`; their durations stay natural.
- Music automation is authored in story seconds and compared against
  `time * RP.pace`.

---

## 3. Palette

Tokens live in `src/config/replit.ts` as `C`.

| Token | Hex | Role |
| --- | --- | --- |
| `black` | `#050608` | Stage, closing card |
| `graphite` | `#0B0D12` | Data / lesson stage |
| `graphite2` | `#11151B` | Panels |
| `white` | `#F5F7FA` | Primary statement |
| `silver` | `#A7B0BC` | Secondary statement |
| `dim` | `#6D7784` | Body copy |
| `mute` | `#4D5662` | Micro labels, footers |
| `cyan` | `#00D9FF` | Setup, data, recovery, development |
| `blue` | `#456BFF` | Architecture, secondary systems |
| `orange` | `#FF9B38` | Warning, restriction, approval |
| `red` | `#FF3548` | Failure, deletion, critical |
| `green` | `#52E0A4` | Recovery, verified success |

**Act mapping**

| Act | Accent |
| --- | --- |
| Hook | cyan → red as the deletion lands |
| Experiment | cyan |
| Data | cyan (orange "reported" tag) |
| Warning | orange |
| Failure | red |
| Recovery | cyan → green |
| Lesson | cyan / blue |
| Conclusion | cyan + green |

Rules: red is reserved for destructive story beats. Use at most two accents in
one frame; the second must be a tag or a rule, not a headline. Never place cyan
and green body text side by side without separating them by a panel.

---

## 4. Typography

- **Display:** Poppins 600 / 700 / 800, SF Pro Display fallback.
- **Micro / data:** `MONO` (SF Mono → Menlo), uppercase, tracked wide.
- Display type tightens as it grows: `-0.045em` at 52 px down to `-0.075em` at
  208 px.
- Micro labels track between `+0.12em` and `+0.24em`.
- Never use more than three type sizes in one scene.

| Role | Vertical | Wide |
| --- | --- | --- |
| Kicker | 15–17 px mono | 16–17 px mono |
| Hook display | 95–208 px | 92–208 px |
| Act headline | 78–184 px | 78–184 px |
| Body / sub | 18–32 px | 20–32 px |
| Micro label | 9–12 px mono | 9–12 px mono |
| Footer | 9–10 px mono | 9–10 px mono |

---

## 5. Layout

### Vertical (1080 × 1920)

- Side margin: **76 px**.
- Safe top: **62 px**; safe bottom: **60 px**.
- Header row: kicker left, tags right.
- Primary type block begins around **140–180 px**.
- Evidence panel: **928 px** wide is the default; compact panels **730–840 px**.
- Footer rule sits at **~1,820 px** with one mono line left and one right.

### Wide (1920 × 1080)

- Side margin: **96 px**.
- Safe top: **62 px**; footer rule at **984–998 px**.
- Two-column grammar: **left = statement**, **right = evidence**. Keep the
  headline within ~820 px so it never crowds the panel.
- Panel widths: **730–1,030 px**; architecture maps scale to ~0.86 and anchor
  top-right.
- Dedicated wide layouts only. Never crop, stretch or letterbox the vertical.

### Panels

- 1 px border at 11 % white; 5–6 px radius; near-black fill.
- Header row with a coloured dot, uppercase mono title, right-side status.
- Body rows separated by 5.5 % white rules.
- Status chips: tinted background at 14–15 % accent, accent text, mono uppercase.

---

## 6. Motion grammar

| Element | Motion |
| --- | --- |
| Headline | rises inside a clipping mask, **0.7 s**, `easeOut` |
| Word reveal | 0.055–0.09 s stagger, optional emphasis colour |
| Impact beat | fast red rule / `GlitchText`, 0.35–0.55 s `easeIn` |
| Camera | 1.8–2.5 % slow push across the scene |
| Panel entrance | 0.6–0.9 s fade + 10–24 px rise |
| Ambient | grid 0.2–0.32, glow 0.05–0.12, scanlines 0.025–0.055, grain 0.045–0.055, vignette 0.9–1.02 |
| Sweep | one soft `Beam` on the act's biggest beat, never on every cut |
| Brand close | spring settle only; no loop, no shimmer |

- Easing: `easeOut = cubic-bezier(0.16, 1, 0.3, 1)`, `easeInOut =
  cubic-bezier(0.65, 0, 0.35, 1)`, `snap = cubic-bezier(0.2, 0.9, 0.24, 1.16)`.
- No bounce, no elastic, no rotation on type. One exception: the brand spring.
- Every scene ends on a held frame; motion stops before the cut.

---

## 7. Narrative spine

Eight acts, in this order. Cut a beat **before** the narration sentence so the
picture lands first.

| # | Act | Job | Story length |
| --- | --- | --- | --- |
| 01 | Hook | State the impossible fact, then the contradiction | 7–8 s |
| 02 | Experiment | Show the normal work that made the incident possible | 8–10 s |
| 03 | Data | Make the stakes countable | 7–8 s |
| 04 | Warning | Show the control that was supposed to hold | 7–8 s |
| 05 | Failure | Execute the destructive beat in red | 8–9 s |
| 06 | Recovery | Correct the record; relief, not triumph | 8–9 s |
| 07 | Lesson | Name the architectural principle, not the moral | 12–14 s |
| 08 | Conclusion | One sentence of hope, one sentence of warning, then the question | 14–15 s |

The final brand card starts at **79.8 / pace ≈ 75.1 s** and holds ~4.9 s.

### Brand close

The close is one of five built-in logo-only templates — **Aurora** (default),
**Atlas**, **Axis**, **Editorial**, **Orbit**. Every one renders only the avatar
image and the bold `SIMPLEDEAV` wordmark. Change the default once in
`src/config/brand.ts` (`DEFAULT_END_CARD_TEMPLATE`) or pass `template` per film.
Preview them in Studio with `EndCardAurora`, `EndCardAtlas`, `EndCardAxis`,
`EndCardEditorial` and `EndCardOrbit`; use `EndCardWidePreview` for 16:9. Full
spec: [`brand-signoff.md`](./brand-signoff.md).

---

## 8. Sound

Follow [`audio.md`](./audio.md) and [`audio-preset.json`](./audio-preset.json).

- Narration is the master clock. Do not time-stretch after generation.
- This episode uses **SD_VOICE_03 — Nathan Cole**
  (`en-US-AndrewMultilingualNeural`), directed line by line with per-line
  emotion, rate, pitch and volume. See
  `content/replit-voice-segments.json`.
- Use the project voice preset in [`audio.md`](./audio.md) unless the brief
  names a different voice.
- SFX starts scale with picture; tails keep their natural length.
- Music sits well under the voice and ducks at every narration segment.
- No SFX on every cut. One impact per act maximum.

---

## 9. Wide version rules

- Same script, same score, same act boundaries, **new layout**.
- Re-compose for 16:9: split columns, wider panels, larger negative space.
- The wide film is not a zoomed crop and does not reuse vertical coordinates.
- Footer text is always factual: source or reconstruction note, never a slogan.

---

## 10. Cover rules

- **1080 × 1350**, matching the archive covers.
- Same palette and type system as the film.
- One oversized headline stack, one evidence object, one quiet detail.
- Use a **static** composition (`durationInFrames={1}`); do not rely on animated
  primitives that start at zero.
- Footer: avatar + `SIMPLEDEAV` + `@simpledeav` + date/source.
- Cover type may be larger than any in-film type; that is the one place to
  exaggerate.

---

## 11. Copy and factual restraint

- Report only what sources reported. Use "reportedly" where the claim is
  contested.
- Never invent a database engine, SQL statement, agent reasoning, permanent
  data loss, or financial loss.
- Label reconstructions: `ILLUSTRATIVE RECONSTRUCTION · NOT A VERIFIED
  SCREENSHOT`.
- Numbers must match the narration. If the voice says 1,206, the panel says
  1,206.
- Keep headlines in the present tense; keep body copy in plain language.

---

## 12. QA checklist

Before calling an episode done:

1. `npm run typecheck` passes.
2. Targeted `npx eslint` on new scene files passes.
3. `npx remotion compositions` lists the vertical, wide and cover IDs.
4. Render stills at every act beat (see frame list below) and inspect:
   - no text collision, no clipped descenders;
   - safe margins respected;
   - headline is the first thing the eye finds;
   - accent count per frame is ≤ 2;
   - footer does not overlap panels;
   - closed captions and micro labels remain legible at 50 % scale.
5. Brand close is avatar + bold `SIMPLEDEAV` only.
6. No MP4 export. Stills are the sign-off.

Suggested still frames for an 80 s / 30 fps film:
`90, 300, 570, 810, 1050, 1320, 1620, 1980, 2100, 2340`.

---

## 13. Code map

| Piece | Path |
| --- | --- |
| Tokens, copy, scene boundaries, pace | `src/config/replit.ts` |
| Motion + typography primitives | `src/components/replit/kit.tsx` |
| Evidence visuals (DB, panels, architecture) | `src/components/replit/visuals.tsx` |
| Vertical acts | `src/components/replit/scenes/` |
| Wide acts | `src/components/replit/wide/WideScenes.tsx` |
| Vertical composition | `src/compositions/DeletedProductionDatabase.tsx` |
| Wide composition | `src/compositions/DeletedProductionDatabaseWide.tsx` |
| Cover | `src/compositions/DeletedProductionDatabaseCover.tsx` |
| Score / ducking / SFX | `src/components/replit/ReplitScore.tsx` |

Registration: `src/Root.tsx` — `DeletedProductionDatabase` (1080 × 1920),
`DeletedProductionDatabaseWide` (1920 × 1080),
`DeletedProductionDatabaseCover` (1080 × 1350, 1 frame).

---

## 14. Approved alternative preset

**Editorial Pop** is the bright retail-documentary look from the Walmart
Chicken Purse film. Use it when the brief wants saturated retail color, huge
Poppins display on blue, white product cards, price tags, receipts, sold-out
stamps and a 2–4 second hard-cut rhythm.

- Spec and usage: [`../presets/editorial-pop/README.md`](../presets/editorial-pop/README.md)
- Tokens: [`../presets/editorial-pop/style.json`](../presets/editorial-pop/style.json)
- Code: `src/config/presets/editorialPop.ts` and `src/components/presets/editorialPop/kit.tsx`

It keeps this document's rules for factual restraint, captions, sound and QA.

---

## 15. Start a new episode

1. Copy `src/config/replit.ts` to `src/config/<episode>.ts`; keep `RP`, `C`,
   `FONT`, `MONO`, `SCENES`, `COPY`, `useStage`.
2. Write the voice segments first (`content/<episode>-voice-segments.json`);
   let the narration set the act lengths.
3. Build vertical scenes act by act against real word timings.
4. Recompose each act for 16:9; do not crop.
5. Build the cover last, once the palette and headline are locked.
6. Run the QA checklist above.
