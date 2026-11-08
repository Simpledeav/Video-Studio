# New video code

New films should live in `src/videos/<slug>/` so the source stays as tidy as the
writing records. Archive films from the previous studio remain where they are
(`src/components/<film>/` + `src/compositions/`).

## Preferred layout for a new film

```text
src/videos/<slug>/
  config.ts            Canvas, palette, copy, scene boundaries, voice segment map
  scenes/
    Scene01Hook.tsx
    Scene02Story.tsx
    ...
  Wide.tsx             Dedicated 16:9 recomposition
  Cover.tsx            Static 1080x1350 composition
  Score.tsx            Voice, music and SFX
  Captions.tsx         Word-timed captions
  README.md            Film-specific notes
```

Then register three compositions in `src/Root.tsx`:

```tsx
<Composition id="MyFilm" component={MyFilm} durationInFrames={2400} fps={30} width={1080} height={1920} />
<Composition id="MyFilmWide" component={MyFilmWide} durationInFrames={2400} fps={30} width={1920} height={1080} />
<Composition id="MyFilmCover" component={MyFilmCover} durationInFrames={1} fps={30} width={1080} height={1350} />
```

## Rules

- Import the preset from `src/config/presets/editorialPop.ts` (for the Walmart
  look) or the house tokens from `src/config/replit.ts`.
- Import the voice from `src/voice-library/VoiceNarration.tsx`; leave the voice
  prop off to use `SD_VOICE_03`.
- Keep scene times in seconds and derive frames from the film FPS.
- Do not crop the vertical for the wide cut.
- Do not render an MP4. Preview in Studio.
- Create the writing record in `videos/<slug>/` with `npm run new:video`.

## Archive films

| Film | Location |
| --- | --- |
| Walmart Chicken Purse | `src/components/walmartchicken/`, `src/compositions/WalmartChickenCaseStudy.tsx` |
| Deleted Production Database | `src/components/replit/`, `src/compositions/DeletedProductionDatabase*.tsx` |
| Airbnb Cereal | `src/components/airbnb/`, `src/compositions/AirbnbCaseStudy.tsx` |
| Coinbase × Cursor | `src/components/coinbase/`, `src/compositions/CoinbaseCaseStudy.tsx` |
| Liquid Death | `src/components/liquiddeath/`, `src/compositions/LiquidDeathCaseStudy.tsx` |
| McDonald's AI | `src/components/mcdonalds/`, `src/compositions/McdonaldsAI.tsx` |
| GarageFlow | `src/components/garageflow/`, `src/compositions/GarageFlow.tsx` |
| Bank Transfer | `src/components/banktransfer/`, `src/compositions/BankTransfer.tsx` |
| BlackBerry | `src/components/blackberry/`, `src/compositions/BlackBerryCaseStudy.tsx` |
| PocketLedger | `src/components/pocketledger/`, `src/compositions/PocketLedgerCaseStudy.tsx` |
| Paynova | `src/components/paynova/`, `src/compositions/PaynovaCaseStudy.tsx` |
| Football Relationship | `src/components/football/`, `src/compositions/FootballRelationship.tsx` |
| Access Control | `src/components/security/`, `src/compositions/AccessControlCaseStudy.tsx` |
| Stickman / AI Agent / Lego | `src/components/scenes/`, `src/compositions/StickmanStory.tsx`, `src/compositions/LegoCaseStudy.tsx` |
