# Airbnb — The Startup That Sold Cereal

A cinematic case-study film for Simpledeav. **Preview only:** this episode is
built for Remotion Studio review and no video is rendered or exported by this
repository.

## At a glance

| Spec | Value |
| --- | --- |
| Composition (9:16) | `AirbnbCereal` |
| Composition (16:9) | `AirbnbCerealWide` |
| Social cover (4:5) | `AirbnbCerealCover` (1080×1350 still) |
| Duration | **80.000 s** |
| Frame rate | **30 fps** |
| Frames | **2,400** |
| Portrait | 1080 × 1920 |
| Wide | 1920 × 1080 |
| Font | Poppins 400/500/600/700/800 + italic, local TTFs |
| Fallback | SF Pro Display → SF Pro Text → system sans |
| Voice | `en-US-BrianMultilingualNeural`, deep documentary read |
| Music | Mixkit "Dreaming Big" (Ahjay Stelino), edited to 80 s |
| Manifest | `content/episode-airbnb-cereal.json` |
| Storyboard | `content/airbnb-voice-segments.json`, `content/airbnb-cues.json` |

```bash
cd "$HOME/Documents/WORK VIDEO/VideoStudio/simpledeav-studio"
npm run dev
# Studio: http://localhost:3000/AirbnbCereal
#         http://localhost:3000/AirbnbCerealWide
```

Checks:

```bash
npm run lint       # ESLint + TypeScript
npm run validate   # all episodes + the Airbnb manifest
```

**Review route:** open `AirbnbCereal`, then scrub these frames first —
`0` (impact), `140` (title), `300` (air mattress), `900` (cereal boxes),
`1240` ("$30,000"), `1630` (YC interview), `1930` (listings), `2140` (world map),
`2350` (signature). Then switch to `AirbnbCerealWide` at `140`, `800`, `1240`
and `2310` to check the 16:9 reframe.

## Structure of the edit

The narration is the spine. Act boundaries sit ~0.2 s before each narration
sentence so the picture lands a hair ahead of the line. The seven storyboard
acts run in order; only their exact durations flex (≤ 4 s) to protect sync.

| Act | Time | VO in | Visual beats |
| --- | --- | --- | --- |
| 1 · The unexpected hook | 0.0 – 6.0 | 0.50 – 5.78 | darkness → hero cereal box → macro cardboard cut → `TO SURVIVE.` |
| 2 · The original idea | 6.0 – 18.7 | 5.78 – 18.90 | SF exterior, `2007`, air mattress + floor plan, breakfast + early marketplace screen, guests at the door |
| 3 · The struggle | 18.7 – 27.6 | 18.90 – 27.87 | night desk, `0 bookings`, rent notice `$1,150`, pullback to two founders |
| 4 · The cereal idea | 27.6 – 40.5 | 27.87 – 40.74 | cream flash `2008`, Obama O's / Cap'n McCain's, cereal pour, flat dieline → assembled box, `$40 PER BOX.` |
| 5 · The unexpected funding | 40.5 – 51.5 | 40.74 – 51.77 | `SOLD` stamp, `$30,000` count-up, cereal story, box carried to the interview |
| 6 · The real breakthrough | 51.5 – 65.6 | 51.77 – 65.82 | YC interview room, `NEW YORK`, host meeting, camera shutter, before/after split, listings grid |
| 7 · The lesson | 65.6 – 80.0 | 65.82 – 77.29 | loft, `CREATIVITY / PERSISTENCE / UNDERSTAND YOUR CUSTOMERS`, dot world map, door, box return, Simpledeav signature at 77.0 |

The first two seconds are deliberately designed to stop a scroll: a deep
restrained impact, a warm practical, and one object rotating out of darkness.

## Voiceover

`scripts/generate-airbnb-voice.py` builds the read:

1. Seven scene segments through Edge TTS with `en-US-BrianMultilingualNeural`,
   `+8%` rate and `-2 Hz` pitch for a slightly deeper register.
2. Internal silences capped at 0.30 s so 224 words fit an 80 s cut without an
   unnatural read.
3. One broadcast chain over the assembled timeline: high-pass at 68 Hz, +1.6 dB
   warmth at 118 Hz, −1.4 dB mud cut at 340 Hz, gentle presence cut, 2.4:1
   compression, a 22 ms room tail and `loudnorm` to −16 LUFS / −1.8 dBTP.
4. Subtitles are generated from real word boundaries (26 cues, two lines max).

```bash
python3 scripts/generate-airbnb-voice.py \
  --segments-file content/airbnb-voice-segments.json \
  --out-cues content/airbnb-cues.json
```

The voice is synthetic and labelled as such in the manifest. It is not a human
recording and is not presented as archival audio.

## Music and sound

- **Music:** one licensed bed, `Dreaming Big` (Mixkit), cut from 26.0 – 106.0 s,
  2.6 s fade in, 3.8 s fade out, −19 LUFS. In the mix it runs at 0.145 – 0.225
  linear with a 54% duck under narration, so it never fights the voice.
- **Sound effects:** 40 cues, frame-accurate, sourced from Mixkit (licensed) or
  synthesised for this project. All SFX pass through a fixed −4.2 dB mix gain so
  the narration peak and the impacts never sum past 0 dBFS.
- **Original Foley:** `scripts/generate-airbnb-foley.py` synthesises the cereal
  pour, cardboard crease, air-mattress pump, box set-down, whoosh and brand
  signature with numpy (no sample library).

Beat map (composition seconds):

| Time | Sound |
| --- | --- |
| 0.00 | deep opening impact |
| 1.45 / 3.90 | cardboard movement, box placed |
| 8.70 | air mattress inflation |
| 15.30 | guests at the door + room tone |
| 20.20 | ticking clock |
| 27.55 | cut into the cereal act |
| 32.55 | cereal pour |
| 35.60 | cardboard folding |
| 40.55 / 44.75 | SOLD stamp, restrained financial impact |
| 51.45 | cut into the interview |
| 59.42 | camera shutter |
| 65.65 | cut into the lesson |
| 71.95 | door opening |
| 76.70 | final brand signature |

## Art direction

- Charcoal `#171717` bed, warm cream `#F3EEE5` type, coral `#FF5A5F` used only
  for emphasis, muted peach `#E6A49C` for secondary warmth, soft grey `#A6A6A6`
  for microcopy.
- Warm practical light and cream paper in the early acts; cooler, restrained
  grade in the struggle; natural daylight in the growth sequence.
- One hero object built entirely in CSS 3D (`CerealBox.tsx`): paper fibre
  texture, printed bands, barcode, fold-flat state, sheen that tracks the
  rotation, and variant artwork for both boxes.
- Cinematic re-enactments use licensed photographic plates and anonymous
  silhouettes. No founder is depicted, and no fictional archival footage is
  labelled as historical.

## Defaults adopted from this film

The audio system in this episode is now the project default
(`defaults/audio.md`, `defaults/audio-preset.json`), and its closing screen is
the standard end card for every Simpledeav video
(`defaults/brand-signoff.md`). New episodes should reuse both unchanged.

## Social packaging

`AirbnbCerealCover` renders the 4:5 cover: charcoal texture, warm spotlight,
one oversized box and the headline `THE STARTUP THAT SOLD CEREAL TO SURVIVE.`
with the supporting line `HOW AIRBNB FOUND A WAY TO KEEP GOING.`

Caption (publish alongside the film):

> Before Airbnb became a global travel platform, its founders were struggling to
> keep the business alive. Their solution? Sell limited-edition cereal boxes.
> It sounds ridiculous, but the idea helped them raise around $30,000 and keep
> going. The bigger lesson came later: persistence gets you through difficult
> moments, but understanding your customers helps you build something that lasts.
> Sometimes, the opportunity is hiding somewhere you never expected.
>
> What is the most unusual way you've seen a business raise money?
>
> #Airbnb #StartupStories #BusinessCaseStudy #Entrepreneurship #BusinessGrowth
> #Innovation #Simpledeav

## Historical accuracy

- 2007: Brian Chesky and Joe Gebbia hosted guests on air mattresses during a
  busy design conference in San Francisco; Nathan Blecharczyk joined as the third
  co-founder. The film says "two founders" in the apartment and keeps the third
  out of frame rather than inventing him.
- 2008: limited-edition `Obama O's` and `Cap'n McCain's` boxes sold at $40.
- The cereal effort is reported to have raised roughly **$30,000**. The film
  presents it as money raised — the graphic says `RAISED THROUGH CEREAL SALES`
  and the copy explicitly calls it "not a scalable business" and "not profit".
- 2009: Airbnb joined Y Combinator's winter batch.
- The New York host visits and the push for better property photography are
  presented as the later operational breakthrough, not the cereal.
- Box artwork is an original illustrative re-creation. No campaign logo,
  candidate likeness or official branding is reproduced.

## Assets and licences

All media is local under `public/`. Full provenance is in
`content/episode-airbnb-cereal.json` → `assets`.

| Asset | Creator | Licence |
| --- | --- | --- |
| San Francisco row houses | King of Hearts | CC BY-SA 3.0 |
| New York corner building | Mike Peel | CC BY-SA 4.0 |
| Air mattress | W.carter | CC BY-SA 4.0 |
| Cereal bowl | The Eloquent Peasant | CC BY 4.0 |
| Flat living room (BEFORE) | Shixart1985 | CC BY 2.0 |
| Loft bedroom (AFTER) | Kotivalo | CC BY-SA 4.0 |
| Camera on tripod | Shixart1985 | CC BY 2.0 |
| World dot map | Generated from NASA Blue Marble land mask (public domain) | Original asset |
| Music "Dreaming Big" | Ahjay Stelino / Mixkit | Mixkit Stock Music Free License |
| Mixkit effects (12 files) | Mixkit | Mixkit SFX Free License |
| Cereal/cardboard/pump/box/sting Foley | Simpledeav Studio | Original |
| Voice | Edge TTS (Brian Multilingual) | Synthetic narration |
| Poppins | Indian Type Foundry / Jonny Pinhorn | SIL OFL 1.1 |

Attribution for the CC BY / CC BY-SA photographs must remain in the description
when the film is published.

## 16:9 adaptation

`AirbnbCerealWide` renders the same 2,400 frames at 1920 × 1080. Scenes branch on
aspect through `useStage()`: type sizes step down, copy columns narrow, the split
screen, listings grid and interview room re-compose rather than letterbox. No
portrait crop is stretched.

## Quality control

`node scripts/validate-airbnb-episode.mjs` verifies:

1. exactly 80 s, 30 fps, 2,400 frames, 9:16 + 16:9;
2. seven contiguous acts from 0 to 80;
3. narration file present and 80.0 s, 32 ordered cues that clear the brand
   reveal;
4. music bed ≥ 80 s, automation under the voice;
5. every SFX file exists, sits inside the timeline and is not stacked;
6. every image/audio asset exists and is licensed;
7. Poppins 400–800 local, SF Pro fallback configured;
8. both Studio compositions registered at 2,400 frames / 30 fps;
9. no render or export script exists in `package.json`.

Preview stills live in `docs/preview/airbnb/` and are captured with
`remotion still` (single frames only — never a video render).

The cover is a single-frame composition (`AirbnbCerealCover`, 1080 × 1350) and
is intentionally outside the 2,400-frame film.

## Deliberate limits

- **No MP4 is rendered or exported.** Rendering is left to the reviewer.
- No remote asset is fetched at playback; every frame is local.
- The silhouettes are illustrative and deliberately anonymous.
