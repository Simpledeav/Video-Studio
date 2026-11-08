# Brand memory

The Simpledeav close is **one component with five approved layouts**, not a
per-video design decision.

| File | Use |
| --- | --- |
| [`signoff.json`](./signoff.json) | Machine-readable closing-screen contract. |
| [`end-cards.md`](./end-cards.md) | Full specification for the five templates. |

## The rule

Every film ends with exactly two things:

1. The avatar image from `public/brand/simpledeav-avatar.png`.
2. The bold uppercase `SIMPLEDEAV` wordmark.

No labels, monograms, handles, series tags, URLs, QR codes, fine print or second
logos. Change the **template**, never the content.

## The five templates

| # | Template | Character | Best for |
| --- | --- | --- | --- |
| 01 | **Aurora** *(default)* | Portrait in a soft ring of light, small precise wordmark, one luminous horizon. | Every channel, vertical and wide. |
| 02 | **Atlas** | Architectural grid, small avatar seal, measured baseline. | Quiet, architectural closes. |
| 03 | **Axis** | Horizontal lockup, squared portrait, hairline rule. | Wide films, YouTube end screens. |
| 04 | **Editorial** | Asymmetric left-aligned stack, margin frame, fine rules. | Case studies and designed title cards. |
| 05 | **Orbit** | Portrait in a slowly turning orbital system, star field. | Premium documentary closes. |

## Set the default

One line in `src/config/brand.ts`:

```ts
export const DEFAULT_END_CARD_TEMPLATE: EndCardTemplateId = "aurora";
```

Change it to `"atlas"`, `"axis"`, `"editorial"` or `"orbit"`. Every composition
without an explicit template inherits it.

Per-film override:

```tsx
<SimpledeavSignOff startSeconds={75.1} template="orbit" />
```

## Timing

| Time | Beat |
| --- | --- |
| 0.00 s | Black card fades in over 0.42 s |
| 0.08 s | Avatar and rings scale in |
| 0.36 s | Wordmark rises inside a clipping mask |
| 1.16 s | Locked; hold until the end |

Minimum on-screen time: **2.5 s**. Ideally 3 s or more.

## Do not

- Do not add copy, tags, handles or URLs.
- Do not replace the avatar or change the wordmark spelling.
- Do not create a sixth template outside this system.
- Do not overlay the lockup on footage or move it to a corner.
- Do not let music or SFX continue past the tag.
