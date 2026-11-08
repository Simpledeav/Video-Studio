# Browser QA checklist

QA happens in Remotion Studio. No MP4 is rendered.

## Before preview

- [ ] `npm run typecheck` passes.
- [ ] Targeted `npx eslint` on new scene files passes.
- [ ] `npx remotion compositions` lists the vertical, wide and cover IDs.
- [ ] The video record exists and `metadata.json` is valid.
- [ ] The default voice is `SD_VOICE_03` unless the brief named another.

## Frame checks

Scrub each act and check:

- [ ] One idea per frame.
- [ ] The headline is the first thing the eye finds.
- [ ] No text collision; no clipped descenders.
- [ ] Safe margins respected (76 px vertical, 96 px wide).
- [ ] Accent count per frame is 2 or fewer.
- [ ] Red is used only for a destructive beat.
- [ ] Evidence panels have a 1 px 11% white border and a status dot.
- [ ] Footer does not overlap panels.
- [ ] Captions are legible at 50% scale and clear the caption band.
- [ ] No placeholder text, debug labels or scene numbers.

## Motion checks

- [ ] Headline rises inside a mask, about 0.7 s.
- [ ] Word stagger is 0.055–0.09 s.
- [ ] Camera push is 1.8–2.5%.
- [ ] Every scene ends on a held frame.
- [ ] No bounce or elastic on type.
- [ ] One impact per act maximum.

## Format checks

- [ ] Vertical 1080 × 1920, 30 fps.
- [ ] Horizontal 1920 × 1080, 30 fps, recomposed.
- [ ] Cover 1080 × 1350, 1 frame, static.
- [ ] Horizontal never crops or letterboxes the vertical.
- [ ] Cover has the headline stack, one evidence object and the footer.

## Brand checks

- [ ] Close is avatar + bold `SIMPLEDEAV` only.
- [ ] No label, handle, monogram, URL or second logo.
- [ ] Close holds at least 2.5 s.
- [ ] Music and SFX stop at the tag.

## Copy checks

- [ ] Every number matches the narration.
- [ ] Every claim is traceable to a source.
- [ ] Reconstructed UI is labelled.
- [ ] No invented quotes, SQL, reasoning or losses.
- [ ] Headlines are present tense; body copy is plain.

## Final

- [ ] The video record is complete.
- [ ] The social captions are written.
- [ ] The Studio preview is the approved delivery.
- [ ] No render was started.
