# Default brand sign-off

**The closing screen is one of five built-in templates.** Every template shows
exactly two things: the avatar image and the bold `SIMPLEDEAV` wordmark. There
are no labels, monograms, handles, series tags, URLs, QR codes or fine print.

Pick a template once, set it as the default, and every future film inherits it.
The current default is **Aurora**.

---

## 1. The five templates

| # | Template | Character | Best for |
| --- | --- | --- | --- |
| 01 | **Aurora** *(default)* | Portrait held in a soft ring of light, small precise wordmark, one luminous horizon. | The house default. Every channel, vertical and wide. |
| 02 | **Atlas** | Architectural grid, small avatar seal and a precise wordmark on a measured baseline. | Films that want a quiet, architectural close. |
| 03 | **Axis** | Horizontal lockup with a squared portrait, hairline rule and precise accent mark. | Wide films, YouTube end screens, sponsor-facing cuts. |
| 04 | **Editorial** | Asymmetric left-aligned stack, margin frame, fine rules and directional light. | Case studies, documentary closes, designed title cards. |
| 05 | **Orbit** | Portrait inside a slowly turning orbital system, star field, wide-tracked signature. | Premium documentary closes, series finales, launch films. |

Template metadata lives in `src/config/brand.ts` as `END_CARD_TEMPLATES`; the
renderers live in `src/components/branding/endCardTemplates.tsx`.

The wordmark is intentionally small — roughly half the previous scale. The
portrait carries the frame; the name signs it. Do not enlarge the wordmark until
it competes with the avatar.

---

## 2. Choose the default

One line in `src/config/brand.ts`:

```ts
export const DEFAULT_END_CARD_TEMPLATE: EndCardTemplateId = "aurora";
```

Change it to `"atlas"`, `"axis"`, `"editorial"` or `"orbit"`. Every composition
that does not pass an explicit `template` uses it immediately.

### Per-film override

```tsx
<SimpledeavSignOff startSeconds={75.1} template="orbit" />
```

Use this when one film deserves a different close. Keep the default unchanged.

### Per-film picker in Studio

`DeletedProductionDatabase` and `DeletedProductionDatabaseWide` expose an
`endCardTemplate` dropdown in the Studio props panel. It defaults to the house
default, so both versions open on the same closing screen; change the dropdown
to audition any of the five without editing code.

Any other composition can opt into the same picker by accepting an
`EndCardTemplateId` prop and passing it to `SimpledeavSignOff`.

### Preview all five

| Composition | Size |
| --- | --- |
| `EndCardAurora` | 1080 × 1920, 5 s |
| `EndCardAtlas` | 1080 × 1920, 5 s |
| `EndCardAxis` | 1080 × 1920, 5 s |
| `EndCardEditorial` | 1080 × 1920, 5 s |
| `EndCardOrbit` | 1080 × 1920, 5 s |
| `EndCardWidePreview` | 1920 × 1080, 5 s — choose the template in the props panel |

---

## 3. What each template is allowed to change

| Allowed | Not allowed |
| --- | --- |
| Composition and alignment | Adding copy, tags, handles or URLs |
| Avatar size, shape and ring treatment | Replacing the avatar or wordmark |
| Wordmark scale, weight and tracking | Changing the spelling of `SIMPLEDEAV` |
| Glow, texture, vignette, grain | Adding a second logo or icon |
| Reveal timing within the template | New elements entering after the settle |

The wordmark is always uppercase **SIMPLEDEAV**, weight 700–800, white-to-silver,
with tightened tracking. The avatar is always
`public/brand/simpledeav-avatar.png` (460 × 460).

---

## 4. The reveal

| Time | Beat |
| --- | --- |
| 0.00 s | black card fades in over 0.42 s |
| 0.08 s | avatar and its rings scale in |
| 0.36 s | wordmark rises inside a clipping mask, tracking tightens |
| 1.16 s | locked; hold until the end of the film |

A spring settle (damping 24, stiffness 110) pulls the composition into place.
Aurora, Orbit and the background glows may keep an almost imperceptible ambient
drift after the settle; no new element may appear.

**Minimum on-screen time: 2.5 s.** Ideally 3 s or more. In the Replit film the
card starts at ~75.1 s and holds ~4.9 s.

---

## 5. Where it lives

| Piece | Path |
| --- | --- |
| Template renderers | `src/components/branding/endCardTemplates.tsx` |
| Public component + timing | `src/components/branding/SimpledeavSignOff.tsx` |
| Template registry + default | `src/config/brand.ts` |
| Episode adapter | `src/components/branding/SocialEndCard.tsx` |
| Studio previews + wide picker | `src/compositions/EndCardPreview.tsx` |
| Registry in Studio | `src/Root.tsx` |

`SceneRenderer`, `LegoCaseStudy` and every case-study composition route through
`SocialEndCard` or `SimpledeavSignOff`, so the close is identical across the
archive.

---

## 6. Do not

- Do not add a label, handle, monogram, tag, URL, QR code or second logo.
- Do not create a sixth template outside this system.
- Do not move the lockup to a corner or overlay it on footage.
- Do not change the avatar or the spelling of the wordmark.
- Do not add new elements after the lockup settles.
- Do not let music or SFX continue past the tag; the sting lands as the
  wordmark settles and the film ends on black.
