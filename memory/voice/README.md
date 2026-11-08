# Voice memory

## The one rule

**`SD_VOICE_03 — Nathan Cole` is the default voice for every video.**

Use `SD_VOICE_09 — James Carter` only when the brief explicitly names it.
Never silently substitute one voice for another. If an asset is missing, stop
and report it.

| Role | ID | Name | Engine voice | Accent | Best for |
| --- | --- | --- | --- | --- | --- |
| **Default** | `SD_VOICE_03` | Nathan Cole | `en-US-AndrewMultilingualNeural` | American (General US) | SaaS, business case studies, product explainers, technology documentaries |
| **Alternate** | `SD_VOICE_09` | James Carter | `en-CA-LiamNeural` | Canadian (General Canadian) | Founder stories, emotional brand films, customer stories |

Both are permanent identities from the SIMPLEDEAV Male Deep Voice Identity
Library. The names and IDs never change.

## Where the audio lives

```text
public/audio/voice-library/
  manifest.json                         # curated two-voice manifest
  SD_VOICE_03_Nathan_Cole/
    identity.wav                        # full test narration
    calm.wav  curiosity.wav  suspense.wav  excitement.wav
    seriousness.wav  concern.wav  confidence.wav  reflection.wav
    dramatic.wav  friendly.wav
    description.md
  SD_VOICE_09_James_Carter/
    ...same structure
```

All files are 48 kHz / 24-bit PCM / mono WAV, mastered to about **−16 LUFS**
integrated with true peak at or below **−1.5 dBTP**.

The audio files are **gitignored** because they are heavy. The manifest and
identity sheets stay tracked. See [`../assets/README.md`](../assets/README.md)
for the restore policy.

## Use in a composition

```tsx
import { VoiceNarration } from "../../voice-library/VoiceNarration";

// The default. Do not pass a voice unless the brief asks for another one.
<VoiceNarration emotion="calm" />
```

Explicit alternate:

```tsx
<VoiceNarration voice="SD_VOICE_09" emotion="reflection" />
```

Resolve a path without rendering:

```ts
import { getVoiceAssetPath, DEFAULT_VOICE } from "../../memory";

const src = getVoiceAssetPath(DEFAULT_VOICE, "suspense");
```

## Generate a new narration line

```bash
python3 scripts/voice-say.py \
  --voice "SD_VOICE_03 — Nathan Cole" \
  --emotion suspense \
  --text "Your new narration line." \
  --out out/voice-lines/line.wav
```

The generator uses Microsoft Edge Neural TTS through `edge-tts`. The delivered
WAV is trimmed, high-passed and loudness-normalised to the library standard.
Do not time-stretch it afterwards.

## Look up a voice or emotion

```bash
node scripts/voice-lookup.mjs "SD_VOICE_03"
node scripts/voice-lookup.mjs "SD_VOICE_03" --emotion=calm
node scripts/voice-lookup.mjs --list
node scripts/voice-lookup.mjs --emotions
```

The lookup is strict. Unknown voices, unknown emotions and missing files exit
non-zero. There is no fallback voice.

## Emotion vocabulary

`identity`, `calm`, `curiosity`, `suspense`, `excitement`, `seriousness`,
`concern`, `confidence`, `reflection`, `dramatic`, `friendly`.

Defaults per film:

- **Hook** — `curiosity` or `suspense`
- **Explanation** — `calm` or `confidence`
- **Warning / failure** — `concern` or `seriousness`
- **Recovery** — `reflection` or `confidence`
- **Close** — `confidence` or `friendly`

## Voice direction rules

- One identity per film. Do not mix `SD_VOICE_03` and `SD_VOICE_09` in one cut.
- Narration is the master clock. Cut picture to the voice; never stretch audio.
- Keep the read conversational. No trailer voice, no shouted emphasis.
- Use punctuation and segment breaks before reaching for extreme rate changes.
- The voice is synthetic neural speech. Do not claim it is indistinguishable
  from a human recording.
