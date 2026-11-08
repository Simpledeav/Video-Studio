# Default audio system

This is the exact sound of **Airbnb — The Startup That Sold Cereal**
(`AirbnbCereal`). Use it for every new documentary episode unless the brief
explicitly asks for something else. Machine-readable values live in
[`audio-preset.json`](./audio-preset.json); this file is the execution guide.

**Principle:** one deep male narrator, one licensed cinematic bed, restrained
Foley. The voice is the master clock, the music is 16 dB underneath it, and
nothing is added just to fill space.

---

## 0. Prerequisites

```bash
python3 -m venv .venv-audio && .venv-audio/bin/pip install edge-tts numpy
ffmpeg -version   # needs loudnorm, ebur128, acompressor, aecho
```

On this machine `edge-tts` is also installed globally; `numpy` may need the venv.

---

## 1. Write for the voice

- 215–230 words for 80 seconds, 240–260 for 90 seconds.
- Contractions, commas you would actually breathe at, one thought per paragraph.
- No trailer lines. No rhetorical question stacks. No "in a world where".
- Keep the last sentence under ~14 words so the brand reveal can breathe.

If the approved script runs long, raise the TTS rate before cutting a word.

---

## 2. Generate the narration

Create `content/<episode>-voice-segments.json`:

```json
{
  "voice": "en-US-BrianMultilingualNeural",
  "leadInSeconds": 0.5,
  "totalDurationSeconds": 80,
  "maxInternalPauseSeconds": 0.3,
  "segments": [
    { "id": "hook", "text": "…", "rate": "+8%", "pitch": "-2Hz" },
    { "id": "idea", "text": "…", "rate": "+8%", "pitch": "-2Hz" }
  ]
}
```

One segment per story act. Then:

```bash
.venv-audio/bin/python scripts/generate-airbnb-voice.py \
  --segments-file content/<episode>-voice-segments.json \
  --out-media public/audio/episodes/<episode>/voice.mp3 \
  --out-vtt   public/audio/episodes/<episode>/voice.vtt \
  --out-words public/audio/episodes/<episode>/voice.words.json \
  --out-cues  content/<episode>-cues.json
```

That script is the reference implementation of the preset:

1. Edge TTS per act with `+8%` rate, `-2Hz` pitch, word boundaries on.
2. Internal silences capped at 0.30 s; edges trimmed to 0.05 s.
3. One broadcast chain over the assembled timeline:
   high-pass 68 Hz, +1.6 dB at 118 Hz, −1.4 dB at 340 Hz, −0.8 dB at 2.6 kHz,
   2.4:1 compression, 22 ms room tail, `loudnorm I=-16 TP=-1.8`, limiter 0.94.
4. 48 kHz mono MP3 at 144 kbps.
5. Subtitles grouped from real word boundaries (12 words max, weak words moved
   forward, two balanced lines).

Never time-stretch after generation. Never invent subtitle timings.

### Verify

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/audio/episodes/<episode>/voice.mp3
ffmpeg -hide_banner -nostats -i public/audio/episodes/<episode>/voice.mp3 \
  -filter_complex ebur128 -f null - 2>&1 | grep -A3 Integrated
```

Expect the duration to match the film, integrated ≈ **−16 LUFS**, true peak
≈ **−1.8 dBFS**.

---

## 3. Prepare the music bed

One track. Licensed. Cinematic documentary, not a trailer.

```bash
ffmpeg -y -ss <start> -t <filmSeconds> -i source.mp3 \
  -af "highpass=f=36,equalizer=f=2600:t=q:w=1.1:g=-1.8,equalizer=f=420:t=q:w=1.2:g=-1.0,afade=t=in:st=0:d=2.6,afade=t=out:st=<film-3.8>:d=3.8,loudnorm=I=-19:TP=-2.5:LRA=9" \
  -ar 48000 -ac 2 -c:a libmp3lame -b:a 192k \
  public/audio/episodes/<episode>/music/<episode>-bed.mp3
```

The 2.6 kHz dip is the speech carve — do not skip it. Normalise the bed once.

In the episode manifest, automate the level rather than a constant:

| Beat | Linear |
| --- | --- |
| open | 0.10 |
| setup | 0.145–0.16 |
| growth | 0.185–0.225 |
| resolution | 0.15–0.17 |
| final frame | 0 |

Ducking: **54%** reduction under narration, 0.18 s attack, 0.45 s release. The
result is ≈ −32 LUFS under voice and ≈ −28 LUFS in gaps. Music must never
exceed **0.25 linear**.

---

## 4. Build the sound design

- Licensed one-shots from Mixkit, plus original synthesised Foley for objects.
- Global SFX gain **0.62** in the score (headroom), per-cue **0.07–0.5**.
- Default envelope 0.06 s in / 0.35 s out.
- One sound per beat; never two impacts within 0.12 s.
- ≤ 42 cues per 80 s.

Role palette (all Mixkit IDs are in `audio-preset.json`):

| Beat | Sound |
| --- | --- |
| open | big cinematic impact |
| act cuts | cinematic whoosh |
| tension | low impact, ticking clock, room tone |
| objects | original cereal pour / cardboard crease / air pump / box set-down |
| proof | camera shutter, transaction |
| close | original brand sting + low impact |

Synthesise object Foley when no sample is right:

```bash
.venv-audio/bin/python scripts/generate-airbnb-foley.py
```

Outputs `cereal-pour`, `cardboard-fold`, `air-inflate`, `box-set`,
`soft-whoosh`, `brand-sting` into the episode's `sfx/` folder.

---

## 5. Wire it in Remotion

Use `src/components/audio/AirbnbScore.tsx` as-is. It already implements:

```tsx
<AirbnbScore
  voicePath="audio/episodes/<episode>/voice.mp3"
  musicPath="audio/episodes/<episode>/music/<episode>-bed.mp3"
  musicPoints={MUSIC_POINTS}   // from the episode manifest
  sfx={SFX}                    // from the episode manifest
  voiceWindows={cues}          // subtitle cues drive the ducking
/>
```

Values come from `src/config/audioPreset.ts`, which reads
`defaults/audio-preset.json`, so the constants cannot drift.

Mix targets:

| Layer | Target |
| --- | --- |
| narration | −16 LUFS, −1.8 dBTP, Remotion gain 0.92 |
| music under voice | ≈ −32 LUFS |
| music in gaps | ≈ −28 LUFS |
| SFX peaks | −14 to −6 dBFS |
| sum | below −1 dBTP |

Remotion sums without a master limiter, so those gains are structural, not
cosmetic.

---

## 6. Reusing the exact reference assets

The Airbnb episode's audio is the working reference. Copy it when you want the
same bed and the same furniture rather than sourcing new files:

```bash
SRC=public/audio/episodes/airbnb
DST=public/audio/episodes/<episode>
cp "$SRC/music/airbnb-bed-80s.mp3" "$DST/music/<episode>-bed.mp3"
cp "$SRC"/sfx/*.mp3 "$DST/sfx/"
```

| Asset | Licence | Reuse |
| --- | --- | --- |
| `music/airbnb-bed-80s.mp3` | Mixkit Stock Music Free License | the exact "Dreaming Big" edit |
| `sfx/opening-impact`, `transition-whoosh`, `riser`, `low-impact` | Mixkit SFX Free License | transitions and accents |
| `sfx/camera-shutter`, `door-open`, `typing`, `clock-tick`, `paper-*`, `coins-handling`, `room-ambience` | Mixkit SFX Free License | scene Foley |
| `sfx/cereal-pour`, `cardboard-fold`, `air-inflate`, `box-set`, `soft-whoosh`, `brand-sting` | Original (this project) | object Foley and the brand sting |
| `voice.mp3` | Synthetic (Edge TTS) | do **not** reuse; regenerate per script |

If you want a different bed, replace only the music file and keep every other
setting in the preset. The mix is tuned for a −19 LUFS bed with the 2.6 kHz dip.

A quick voice sample before committing to a script:

```bash
edge-tts --voice en-US-BrianMultilingualNeural --rate=+8% --pitch=-2Hz \
  --text "Every company is about to discover the same uncomfortable truth." \
  --write-media /tmp/voice-sample.mp3
```

---

## 7. Quality gates

Run `node scripts/validate-airbnb-episode.mjs` (or your episode's equivalent)
and check:

1. narration matches the composition duration;
2. the last subtitle cue ends before the brand reveal;
3. the music bed covers the film and automation ends at 0;
4. no two SFX cues start within 0.12 s;
5. every cue is inside the timeline and every file exists locally;
6. every audio asset has a licence recorded in the manifest.

---

## 8. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Voice sounds rushed | rate above +10% or pauses capped too hard | regenerate at +8%, keep 0.30 s cap |
| Voice sounds muddy | skipped the 340 Hz cut | apply the full chain |
| Music fights the voice | bed too hot, no 2.6 kHz dip | renormalise to −19 LUFS with the dip, cap at 0.25 |
| Clipping on impacts | no headroom | keep SFX gain 0.62 and narration 0.92 |
| Captions show stray words | weak-word list not applied | update `make_cues` in the voice script |
| Ducking pumps | attack/release mismatch | 0.18 s attack, 0.45 s release |
