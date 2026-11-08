# House preset — Kinetic Tech Incident

**Status:** default. Use this for most videos.

**One-line definition:** an editorial, kinetic tech-incident documentary with a
near-black stage, oversized Poppins display, one accent per act, evidence panels
that look like real interfaces, restrained texture, a dedicated 16:9
recomposition and a 4:5 cover.

| File | Use |
| --- | --- |
| [`style.json`](./style.json) | Machine-readable preset summary and code pointers. |
| [`../../design/tokens.json`](../../design/tokens.json) | Full palette, type, layout, motion and QA tokens. |
| [`../../design/house-style.md`](../../design/house-style.md) | The complete house-style document. |

## When to use it

- Business and technology case studies.
- Incident breakdowns and post-mortems.
- Engineering lessons and explainers.
- Founder stories and product films.
- Any brief that does not explicitly ask for the bright Walmart retail look.

## The feel

- **Stage:** near-black `#050608` to graphite `#11151B`.
- **Type:** Poppins 600/700/800, uppercase display, tight tracking, SF Mono
  micro labels.
- **Accent:** one per act. Cyan sets up, orange warns, red destroys, green
  recovers.
- **Evidence:** panels with 1px 11% white borders, a coloured status dot,
  uppercase mono titles and 5.5% white row rules.
- **Motion:** masked headline rises, word stagger, slow camera push, held final
  frame. No bounce on type.
- **Texture:** grid, glow, scanlines, grain and vignette at restrained opacity.
- **Close:** one of the five logo-only brand templates, default Aurora.

## The eight-act spine

`hook → experiment → data → warning → failure → recovery → lesson → conclusion`

Cut the picture a beat before the narration sentence so the visual lands first.

## Code

| Piece | Path |
| --- | --- |
| Tokens, copy, scene boundaries, pace | `src/config/replit.ts` |
| Motion and typography primitives | `src/components/replit/kit.tsx` |
| Evidence visuals | `src/components/replit/visuals.tsx` |
| Vertical acts | `src/components/replit/scenes/` |
| Wide acts | `src/components/replit/wide/WideScenes.tsx` |
| Reference vertical | `src/compositions/DeletedProductionDatabase.tsx` |
| Reference wide | `src/compositions/DeletedProductionDatabaseWide.tsx` |
| Reference cover | `src/compositions/DeletedProductionDatabaseCover.tsx` |

## Do not

- Do not add a second headline to a scene.
- Do not use red for anything except a destructive beat.
- Do not rainbow a single frame.
- Do not reuse vertical coordinates for the 16:9 cut.
- Do not render an MP4 to check the look. Preview in Studio.
