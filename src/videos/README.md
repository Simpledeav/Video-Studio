# New video code

The project currently contains one film. Its source lives in
`src/components/juicero/`, with the composition entry points in
`src/compositions/Juicero.tsx` and `src/compositions/JuiceroCover.tsx`.

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

- Use the house tokens in `src/config/theme.ts`, `src/config/motion.ts` and the
  brand close in `src/components/branding/`.
- Use `SD_VOICE_03 — Nathan Cole` only. Import from
  `src/voice-library/VoiceNarration.tsx`; leave the voice prop off.
- Keep scene times in seconds and derive frames from the film FPS.
- Do not crop the vertical for the wide cut.
- Do not render an MP4. Preview in Studio.
- Create the writing record in `videos/<slug>/` with `npm run new:video`.

## Current film

| Film | Location |
| --- | --- |
| Juicero — The $120M Machine | `src/components/juicero/`, `src/compositions/Juicero.tsx`, `src/compositions/JuiceroCover.tsx` |
