# Design memory

This folder stores the shared visual language that most Simpledeav videos are
built from. It is intentionally small: one full document and one token file.

| File | Use |
| --- | --- |
| [`house-style.md`](./house-style.md) | The complete house-style document: thesis, canvas, palette, type, layout, motion, act spine, wide rules, cover rules, QA. |
| [`tokens.json`](./tokens.json) | The same system as machine-readable tokens for components and agents. |

## The house look in one paragraph

An editorial, kinetic tech-incident documentary: a near-black stage, oversized
Poppins display type, one accent per act, evidence panels that look like real
interfaces, restrained ambient texture, and a dedicated 16:9 recomposition plus
a 4:5 still cover. Type is the hero. Black space is a feature. Every scene has
one idea.

## Two approved looks

| Preset | Use when |
| --- | --- |
| [`house`](../presets/house/style.json) | Default. Serious business/technology stories, incident breakdowns, lessons, founder stories. |
| [`walmart`](../presets/walmart/style.json) | The brief wants bright retail colour, huge Poppins statements, white product cards, price tags, receipts and a 2–4 second hard-cut rhythm. |

Both presets share the same rules for factual restraint, captions, sound, QA
and the three delivery formats.

## Canvas contract

| Format | Size | FPS | Duration |
| --- | --- | --- | --- |
| Vertical | 1080 × 1920 | 30 | 60–90 s typical |
| Horizontal | 1920 × 1080 | 30 | Same script, new layout |
| Cover | 1080 × 1350 | 30 | 1 frame (static) |

The horizontal film is **not** a crop, stretch or letterbox of the vertical. It
is recomposed. The cover is a static composition, not an animated first frame.

## Change control

- A new preset is allowed only when the brief explicitly asks for a different
  visual language. Add it under `memory/presets/<id>/`; do not edit an existing
  preset in place.
- Do not change the house palette, type scale or act spine without a clear
  instruction.
- When a code token changes, update `tokens.json` and the relevant preset in the
  same task so memory and code never drift.
