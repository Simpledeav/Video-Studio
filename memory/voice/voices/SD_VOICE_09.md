# SD_VOICE_09 — James Carter

**Permanent voice identity. Do not rename. Do not substitute.**

## Identity

| Field | Value |
| --- | --- |
| Voice ID | `SD_VOICE_09` |
| Voice name | James Carter |
| Gender | male |
| Vocal register | deep, natural baritone |
| Vocal texture | expressive, conversational, slightly breathy |
| Accent | Canadian (General Canadian, close to American) |
| Personality | empathetic, sincere, adaptable |
| Narration style | emotional storytelling; natural conversational pacing, intimate close-mic feel, honest emphasis without melodrama |
| Emotional strength | Emotional storytelling — empathy, sincerity, flexibility |
| Primary emotion | emotional storytelling |
| Emotional range | all ten library emotions; strongest in reflection, concern, friendly, confidence |
| Speaking speed | measured, 161.5 wpm (identity sample) |
| Engine voice | `en-CA-LiamNeural` |
| Base prosody | rate `+0%`, pitch `-4 Hz`, volume `+0%` |

## Description

A deep, expressive male voice with a natural conversational texture. It moves easily between warmth, concern, and quiet confidence, which makes it the most emotionally flexible identity in the library.

## Ideal video types

- founder stories
- emotional brand films
- customer stories
- human-interest documentaries

## Preferred emotions

- reflection
- concern
- friendly
- confidence

## Files

All files are 48 kHz, 24-bit PCM, mono WAV, mastered to approximately
-16 LUFS integrated with a true peak at or below
-1.5 dBTP.

| Emotion | File | Duration | Loudness | True peak |
| --- | --- | --- | --- | --- |
| identity | `identity.wav` | 18.58 s | -16.1 LUFS | -2.5 dBTP |
| calm | `calm.wav` | 2.93 s | -16.1 LUFS | -2.5 dBTP |
| curiosity | `curiosity.wav` | 3.32 s | -16.1 LUFS | -2.5 dBTP |
| suspense | `suspense.wav` | 4.85 s | -16.1 LUFS | -2.5 dBTP |
| excitement | `excitement.wav` | 2.53 s | -16.1 LUFS | -2.5 dBTP |
| seriousness | `seriousness.wav` | 3.42 s | -16.2 LUFS | -2.4 dBTP |
| concern | `concern.wav` | 3.80 s | -16.1 LUFS | -2.5 dBTP |
| confidence | `confidence.wav` | 2.89 s | -16.2 LUFS | -2.5 dBTP |
| reflection | `reflection.wav` | 3.12 s | -16.2 LUFS | -2.5 dBTP |
| dramatic | `dramatic.wav` | 2.52 s | -16.0 LUFS | -2.5 dBTP |
| friendly | `friendly.wav` | 2.53 s | -16.1 LUFS | -2.4 dBTP |

## Use in Remotion

```tsx
import { VoiceNarration } from "../voice-library/VoiceNarration";

<VoiceNarration voice="SD_VOICE_09 — James Carter" emotion="calm" />
```

Programmatic lookup:

```ts
import { resolveVoice, getVoiceAssetPath } from "../voice-library/selectVoice";

const profile = resolveVoice("SD_VOICE_09");
const src = getVoiceAssetPath("SD_VOICE_09", "suspense");
```

CLI lookup:

```bash
node scripts/voice-lookup.mjs "SD_VOICE_09 — James Carter"
```

## Identity rules

- The voice ID and name are permanent.
- Use the requested voice. Do not silently fall back to another identity.
- If an asset is missing or unreadable, report the problem and stop.
- This is a synthetic neural voice. Do not claim it is 100% indistinguishable
  from a human recording.
