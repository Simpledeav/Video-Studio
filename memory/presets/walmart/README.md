# Walmart preset — Editorial Pop

**Status:** approved alternate. Code name: `editorial-pop`.

**One-line definition:** a premium business documentary cut like a viral retail
commercial — saturated Walmart blue, huge Poppins statements, clean white
product cards, price tags, receipts, sold-out stamps, halftone + grain and a
hard-cut 2–4 second edit rhythm.

This is the look of **Walmart — The Chicken Purse That Sold Out in 90 Minutes**,
packaged so the next film starts from the same system instead of rebuilding it.

| File | Use |
| --- | --- |
| [`style.json`](./style.json) | Full machine-readable preset. |
| `src/config/presets/editorialPop.ts` | Code tokens (`C`, `FONT`, `BRAND`, `STAGE`, `useStage`). |
| `src/components/presets/editorialPop/kit.tsx` | Reusable component kit. |
| `src/compositions/WalmartChickenCaseStudy.tsx` | Reference film. |
| `src/components/walmartchicken/scenes/` | Reference scenes. |

## When to use it

- The brief is a retail, consumer-product or viral-commerce story.
- The brief asks for the Walmart look, bright retail colour, product cards,
  price tags, receipts, sold-out urgency or a fast commercial rhythm.
- The story has a physical product that can be treated as an object.

Do **not** use it for a serious incident, security, finance or engineering
lesson unless the brief explicitly asks for the retail treatment.

## What makes it feel like this

1. **Retail blue is the stage.** The frame is a saturated Walmart-blue gradient,
   not a neutral dark studio. Cream is the pause. Orange is the food/heat beat.
   Purple is the fashion counterpoint.
2. **Type is the hook.** Display type is 78–150 px, Poppins 800, uppercase,
   tight tracking. One word or line can sit on a yellow highlighter block.
3. **The product is a physical object.** It is never a flat logo. It sits in a
   white-bordered card with a hard shadow, or as a cutout, or as a photo inside
   a white product panel.
4. **Information behaves like retail.** Price tags spin in. Receipts print.
   Stamps slam. Stock bars drain. Comment cards stack. Nothing is a generic
   lower-third.
5. **The edit is the energy.** A new visual every 2–4 seconds: hard cut, flash,
   whip pan, mask reveal, product slam. No slow crossfades between scenes.
6. **Texture stops it looking like a template.** Grain 0.055–0.08, halftone dots
   0.22–0.28, vignette 0.9, one soft sweep per act.

## Use it

```tsx
import { AbsoluteFill } from "remotion";
import { C, STAGE, useStage } from "../../config/presets/editorialPop";
import {
  Stage,
  Headline,
  PriceTag,
  Stamp,
  useTime,
} from "../../components/presets/editorialPop/kit";

export const Scene: React.FC = () => {
  const { t } = useTime();

  return (
    <Stage variant="blue" accent={C.yellow} accent2={C.orange}>
      <div style={{ position: "absolute", left: STAGE.margin, top: 120 }}>
        <Headline
          lines={["THE PRICE", "WAS THE", "PUNCHLINE."]}
          size={104}
          start={0.1}
          highlight={C.yellow}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: 660,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <PriceTag value="$5.97" start={0.4} size={230} />
      </div>

      <div
        style={{
          position: "absolute",
          top: 1000,
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Stamp start={1.6} color={C.red} size={102}>
          SOLD OUT
        </Stamp>
      </div>
    </Stage>
  );
};
```

`useTime()` and all entrance timings are **local to the wrapping `<Sequence>`**.
Do not read `useCurrentFrame()` directly inside a scene.

### Stage variants

| Variant | Use |
| --- | --- |
| `blue` | Main stage, brand moments, product UI |
| `night` | Data, resale, consequence, quiet tension |
| `cream` | Editorial pause, paper, receipts, comparison |
| `orange` | Food, heat, launch energy |
| `purple` | Fashion, premium counterpoint, flavour |

### Component map

| Need | Component |
| --- | --- |
| Full-bleed background + grain + vignette | `Stage` |
| Oversized statement | `Display`, `Headline`, `MaskLine` |
| Small uppercase label | `Kicker`, `Tag`, `Pill` |
| Brand mark | `Spark`, `Wordmark` |
| Ken Burns photo | `Photo` |
| White-bordered product card | `PhotoCard` |
| Floating cutout | `ProductCutout` |
| Price | `PriceTag` |
| Sold-out / urgency | `Stamp` |
| Receipt proof | `Receipt` |
| Social listening | `CommentCard`, `Cursor` |
| Celebration | `Confetti` |
| Blueprint drawing | `PurseSketch` |
| Luxury comparison | `LuxuryBag` |
| Barcode | `Barcode` |
| Texture | `Halftone`, `Grain`, `Vignette`, `Sweep`, `SpeedLines` |

## Format and safe zones

- **1080 × 1920**, 30 fps.
- Side margin **68 px**.
- Keep scene content above **y = 260 px from the bottom**. The caption band
  occupies the bottom 168 px; bottom chips and labels must clear it.
- Captions: max 2 lines, 30 px, Poppins 600, dark-blue glass box, yellow
  highlight for numbers and product words.
- No progress bar, no scene numbers, no top/bottom title bars.

## Scene spine (80 s)

| Act | Seconds | Job |
| --- | --- | --- |
| Hook | 0–5 | Impossible product claim; product slams into camera; record scratch + cluck |
| Story | 5–20 | Real context; social-listening UI; one countable proof point |
| Build | 20–40 | Idea → packaging spec → sketch → material → product reveal |
| Price | 40–55 | Price tag → grounded comparison → receipt → unit count → accessories |
| Viral | 55–70 | Launch UI → countdown → sold-out stamp → second drop / resale |
| Ending | 70–80 | Product hero → customer-joke insight → lesson card → CTA |

**Rule:** cut the picture *before* the narration sentence. The visual lands,
then the voice explains it.

## Retheme it for another brand

Open `src/config/presets/editorialPop.ts` and change:

```ts
export const C = {
  blue: "#0071DC",     // primary stage
  yellow: "#FFC220",   // emphasis / price / CTA
  orange: "#E07A2F",   // food / energy
  purple: "#4B2A8A",   // fashion / premium
  // ...
};

export const BRAND = {
  spark: "brand/walmart/spark-yellow.svg",
  wordmark: "brand/walmart/wordmark-black.svg",
};
```

Keep the roles, not the literal colours. If the new brand is green, map green to
`blue`, a warm gold to `yellow`, and a deep berry to `purple`. The layout and
motion grammar do not change.

Suggested rotations live in `PALETTE_ROTATIONS`:

- `walmartChicken` — blue / yellow / orange / purple
- `citrus` — deep green / gold / tangerine / plum
- `berry` — indigo / pink / apricot / teal
- `midnight` — navy / spark yellow / ember / lilac

## Sound

- Default voice: **`SD_VOICE_03 — Nathan Cole`**.
- Alternate: **`SD_VOICE_09 — James Carter`**, only when the brief names it.
- Voice gain 0.92.
- Energetic funk-pop bed, licensed, normalised to **−19 LUFS** with a 2.6 kHz
  speech carve.
- Duck **54%** under narration; music never above **0.24 linear**.
- SFX palette: record scratch, chicken cluck, cash register, receipt print,
  camera shutter, whoosh, riser, crowd laugh/cheer, UI pop, brand sting.
- One sound per beat. No two impacts within **0.12 s**.

The reference score is `src/components/walmartchicken/Score.tsx`.

## QA checklist

1. Every frame has one idea and no more than two accent colours.
2. Headline is the first thing the eye finds; no clipped descenders.
3. Product cards have a white border, hard shadow and at least 16 px radius.
4. Bottom chips clear the caption band (content above 260 px from bottom).
5. No two scenes use the same transition twice in a row.
6. A new visual element appears every 2–4 seconds.
7. Every number on screen matches the narration and a named source.
8. Any reconstructed feed or illustrative UI is labelled.
9. Captions are real word timings, max 2 lines, numbers in yellow.
10. The final frame holds for at least 0.4 s.

## Reference stills

Rendered with `npx remotion still` only when a still is explicitly needed:

```bash
npx remotion still WalmartChickenCaseStudy out/qa/walmart/hook-030.png --frame=30
```

Key beats: `30` hook, `90` product slam, `380` social feed, `650` brainstorm,
`930` sketch, `1060` flavours, `1230` price, `1690` launch, `1770` sold out,
`2180` ending, `2360` CTA.

> Stills are the only export allowed. Do not render an MP4.
