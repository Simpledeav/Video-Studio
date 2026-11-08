# SD_VOICE_03 — Nathan Cole

**Permanent voice identity. Do not rename. Do not substitute.**

## Identity

| Field | Value |
| --- | --- |
| Voice ID | `SD_VOICE_03` |
| Voice name | Nathan Cole |
| Gender | male |
| Vocal register | rich low-mid baritone |
| Vocal texture | smooth, clean, polished |
| Accent | American (General US) |
| Personality | intelligent, approachable, confident |
| Narration style | modern technology narrator; natural and conversational, lightly optimistic, clear without sounding corporate |
| Emotional strength | Professional confidence — clarity, credibility, composure |
| Primary emotion | professional confidence |
| Emotional range | all ten library emotions; strongest in calm, confidence, curiosity, friendly |
| Speaking speed | measured, 156.3 wpm (identity sample) |
| Engine voice | `en-US-AndrewMultilingualNeural` |
| Base prosody | rate `+2%`, pitch `-2 Hz`, volume `+0%` |

## Description

A rich, smooth, intelligent male voice for professional American technology narration. Conversational enough for a founder story, polished enough for a product film.

## Ideal video types

- SaaS storytelling
- startup and business case studies
- product explainers
- technology documentaries

## Preferred emotions

- calm
- confidence
- curiosity
- friendly

## Files

All files are 48 kHz, 24-bit PCM, mono WAV, mastered to approximately
-16 LUFS integrated with a true peak at or below
-1.5 dBTP.

| Emotion | File | Duration | Loudness | True peak |
| --- | --- | --- | --- | --- |
| identity | `identity.wav` | 19.20 s | -16.0 LUFS | -2.3 dBTP |
| calm | `calm.wav` | 3.48 s | -16.1 LUFS | -2.5 dBTP |
| curiosity | `curiosity.wav` | 4.18 s | -16.1 LUFS | -2.2 dBTP |
| suspense | `suspense.wav` | 5.78 s | -16.1 LUFS | -2.5 dBTP |
| excitement | `excitement.wav` | 2.38 s | -16.1 LUFS | -2.5 dBTP |
| seriousness | `seriousness.wav` | 3.79 s | -16.1 LUFS | -2.5 dBTP |
| concern | `concern.wav` | 4.66 s | -16.0 LUFS | -2.2 dBTP |
| confidence | `confidence.wav` | 3.02 s | -16.1 LUFS | -2.5 dBTP |
| reflection | `reflection.wav` | 3.60 s | -16.1 LUFS | -2.5 dBTP |
| dramatic | `dramatic.wav` | 2.50 s | -16.1 LUFS | -2.5 dBTP |
| friendly | `friendly.wav` | 2.14 s | -16.0 LUFS | -2.5 dBTP |

## Use in Remotion

```tsx
import { VoiceNarration } from "../voice-library/VoiceNarration";

<VoiceNarration voice="SD_VOICE_03 — Nathan Cole" emotion="calm" />
```

Programmatic lookup:

```ts
import { resolveVoice, getVoiceAssetPath } from "../voice-library/selectVoice";

const profile = resolveVoice("SD_VOICE_03");
const src = getVoiceAssetPath("SD_VOICE_03", "suspense");
```

CLI lookup:

```bash
node scripts/voice-lookup.mjs "SD_VOICE_03 — Nathan Cole"
```

## Identity rules

- The voice ID and name are permanent.
- Use the requested voice. Do not silently fall back to another identity.
- If an asset is missing or unreadable, report the problem and stop.
- This is a synthetic neural voice. Do not claim it is 100% indistinguishable
  from a human recording.
