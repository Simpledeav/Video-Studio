# Audio & Subtitle Guide

> **Default preset — use this unless the brief says otherwise.**
> `defaults/audio-preset.json` and `defaults/audio.md` are the canonical sound
> system (voice, processing chain, music mix, ducking, SFX gain, loudness
> targets). The reference implementation is
> `scripts/generate-airbnb-voice.py` + `src/components/audio/AirbnbScore.tsx`.
> The notes below explain the generic template; the defaults file wins on any
> conflict.

The voiceover is the master timing source. Do not estimate all subtitle times by
dividing the video duration, and do not create a separate timing system for
scenes, captions, and SFX.

## 1. Write the script

- Conversational, not theatrical.
- Use contractions and natural punctuation.
- Aim for about 200–240 words for an 80–88 second read at the default voice.
- Put one complete thought per paragraph.
- Keep the final sentence short enough for the closing signature to breathe.

Final script location for the demo: `content/demo-narration.txt`.

## 2. Choose and sample a voice

The default male voice for new episodes is
**`en-US-BrianMultilingualNeural` at rate `+8%`, pitch `-2Hz`** (see
`defaults/audio-preset.json`). It is deeper and more documentary than the older
demo voice; the demo episode still uses `en-US-AndrewNeural` at `-4%` for
reproducibility. Do not pick a new voice without a brief that names one.

Always generate a sample before the full script:

```bash
edge-tts \
  --voice en-US-AndrewMultilingualNeural \
  --rate=+2% \
  --pitch=-1Hz \
  --text "Every company is about to discover the same uncomfortable truth." \
  --write-media /tmp/voice-sample.mp3
ffprobe -v error -show_entries format=duration -of default=nw=1:nk=1 /tmp/voice-sample.mp3
```

Inspect available voices first:

```bash
edge-tts --list-voices | grep -E 'en-US|en-GB'
```

## 3. Generate narration and real subtitle timings

```bash
cd "$HOME/Documents/WORK VIDEO/VideoStudio/simpledeav-studio"
python3 scripts/generate-voice.py
```

Outputs:

- `public/audio/voice.mp3`
- `public/audio/voice.words.json` — real Edge TTS word boundaries
- `public/audio/voice.cues.json` — subtitle cues grouped from those boundaries
- `public/audio/voice.vtt` — portable WebVTT copy

The generator merges orphan fragments (`"work."`, `"alone."`) into the previous
cue when appropriate, and avoids tiny single-word captions. It never invents
timings.

Copy `voice.cues.json` cues into the episode's `narration.subtitles` array, and
keep `audioDurationSeconds` in sync with the actual MP3. The validator checks the
difference.

Subtitles are sentence/phrase-level, not word-level karaoke. Do not claim
word-by-word synchronization. Word boundaries are used to build the phrases.

## 4. Establish scene anchors

Print sentence-level timings from the word file and place scene boundaries in
the pauses:

```bash
python3 - <<'PY'
import json, re
words = json.load(open('public/audio/voice.words.json'))['words']
current = []
for word in words:
    current.append(word)
    if re.search(r"[.!?]['\"”’]?$", word['text']):
        print(f"{current[0]['start']:7.3f} - {current[-1]['end']:7.3f}  {' '.join(w['text'] for w in current)}")
        current = []
PY
```

Use the resulting times in `content/*.json`:

- `scenes[].startSeconds`
- `scenes[].durationSeconds`
- `headlines[].startSeconds` (scene-relative)
- brand reveal `startSeconds` (global)

## 5. Sound effects

The demo uses actual local recordings:

| Sound | Source | Use |
| --- | --- | --- |
| Cinematic whoosh fast transition | Mixkit SFX 1492 | scene transitions |
| Interface option select | Mixkit SFX 2573 | agent-card reveals |
| Sci fi click | Mixkit SFX 900 | chart/section accent |
| Keyboard typing | Mixkit SFX 1386 | typing scene |

Record every asset's source URL and license in `public/asset-manifest.json` and
the episode `assets` array. Do not synthesize a fake "realistic" effect.

SFX placements in the demo:

- Music begins at 0 with a 2.5s fade.
- Typing begins at 6.05s, aligned to the typing pose.
- Interface sounds land near agent-card animations.
- Transition whooshes land at scene cuts, not at random.
- Music ducks under each subtitle interval and returns in pauses.

## 6. Music

The demo music is Mixkit "Vastness" (`music/184`), trimmed to 92 seconds with a
2.2s fade-in and 2.5s fade-out. It is placed at 0.16 volume and ducked to roughly
0.065 under speech by `AudioTimeline.tsx`.

License reference: <https://mixkit.co/license/> (Mixkit Stock Music Free License).
Keep the track and license notes in the manifest.

## 7. Ducking and fades

`src/components/audio/AudioTimeline.tsx` builds a frame-level ducking envelope
from the subtitle intervals:

- attack 0.28s
- release 0.65s
- music fades in and out independently
- every SFX supports its own fade in/out and volume

`src/config/audio.ts` centralizes defaults. Episode-specific music/SFX volume and
fades live in the episode JSON.

## 8. Sync checks

Before delivery:

1. Confirm all audio paths resolve and probe with `ffprobe`.
2. Play the composition in Studio and confirm the playhead advances.
3. Confirm typing SFX lands on the typing hand motion.
4. Confirm captions disappear during pauses and never linger.
5. Confirm the closing signature starts after the final line and after narration.
6. Run `npm run validate`.

Current demo verification: Studio playhead advanced from 10.00s to 13.05s during
a 3.5s playback test; `voice.mp3`, music, and SFX resources returned HTTP 206
partial content. This is browser playback verification, not a render.

## 9. Licensing caution

The project records provenance, not legal advice.

- Mixkit assets are covered by the applicable Mixkit Free License. Review the
  current terms before publishing.
- Edge TTS is a Microsoft service. Review Microsoft's terms before commercial
  use of synthetic speech.
- The local fonts are under the SIL Open Font License 1.1.
- The city photo is public domain (Jon Sullivan / Wikimedia Commons).
