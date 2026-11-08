# Production rules

These rules are non-negotiable. They exist to keep video creation fast, cheap
and predictable. Read them before every task.

## 1. No rendering

- **Do not render an MP4, WebM, GIF or image sequence.**
- **Do not produce 4K, 2K or any high-resolution export.**
- **Do not start a render queue, render farm or batch export.**
- Design, preview and QA in **Remotion Studio in the browser**.
- A still (`npx remotion still`) is allowed only when a specific QA frame is
  requested. It is not part of the normal workflow.

Why: rendering is the slowest, heaviest part of video creation. The browser
preview is the delivery. The user exports only when they choose to.

## 2. Three formats per film

Every film gets exactly three registered compositions:

| Format | Composition suffix | Size | FPS | Duration |
| --- | --- | --- | --- | --- |
| Vertical | *(base id)* | 1080 × 1920 | 30 | Film length |
| Horizontal | `Wide` | 1920 × 1080 | 30 | Film length |
| Cover | `Cover` | 1080 × 1350 | 30 | 1 frame |

- The horizontal is a **dedicated recomposition**, never a crop, stretch or
  letterbox of the vertical.
- The cover is a **static** composition (`durationInFrames={1}`).
- Register all three in `src/Root.tsx` and verify they appear in Studio.

## 3. Default voice

- Use **`SD_VOICE_03 — Nathan Cole`** for every video.
- No other voice is permitted.
- One voice identity per film.
- Never substitute a voice silently. If an asset is missing, stop and report it.
- Narration is the master clock. Do not time-stretch after generation.

## 4. Default preset

- Start from the **house** preset.
- Use the **Walmart / Editorial Pop** preset only when the brief asks for that
  bright retail-documentary look.
- Do not mix presets in one film.
- Add a new preset as a new folder; never edit an existing preset in place.

## 5. Every video gets a record

Create `videos/<slug>/` with:

- `prompt.md` — the prompt the user actually passed.
- `description.md` — a short description of the film.
- `social/linkedin.md`
- `social/x.md`
- `social/tiktok.md`
- `social/instagram.md`
- `metadata.json` — machine-readable index.

Scaffold it:

```bash
npm run new:video -- --slug my-video --title "My Video"
```

Full spec: [`video-record.md`](./video-record.md).

## 6. Keep Git light

Never commit:

- `node_modules/`
- `out/`, `dist/`, `.remotion/`
- `public/audio/**` audio files
- `public/images/**` episode images
- `public/video/**`
- `models/`, `.models/`, `.venv*/`
- `docs/preview/**`

The `.gitignore` is configured. Verify with:

```bash
git status --short
git check-ignore -v public/audio/voice-library/SD_VOICE_03_Nathan_Cole/identity.wav
```

If a heavy file appears in `git status`, fix `.gitignore` before committing.

## 7. Stop when the deliverable is done

- Do not start the Studio server and leave it running unless the user asked.
- Do not render, re-render or "just check" an export.
- Do not run long validation loops after the type check passes.
- Do not create extra demo videos or placeholder compositions.
- Finish the requested work, report the paths, and stop.

## 8. Factual restraint

- Report only what sources reported.
- Use "reportedly" where the claim is contested.
- Never invent numbers, quotes, SQL, agent reasoning or losses.
- Label reconstructions: `ILLUSTRATIVE RECONSTRUCTION · NOT A VERIFIED SCREENSHOT`.
- On-screen numbers must match the narration.

## 9. Quality gate

Before calling a film done:

1. `npm run typecheck` passes.
2. Targeted `npx eslint` on new scene files passes.
3. `npx remotion compositions` lists the vertical, wide and cover IDs.
4. Studio preview plays without errors at the key beats.
5. No text collision, clipped descenders or caption-band overlap.
6. The headline is the first thing the eye finds.
7. Accent count per frame is 2 or fewer.
8. The brand close is avatar + bold `SIMPLEDEAV` only.
9. The video record is filled in.
