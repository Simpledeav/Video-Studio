# Voice library (code)

The executable side of [`memory/voice/`](../../memory/voice/README.md).

| File | Use |
| --- | --- |
| `VoiceNarration.tsx` | Drop-in `<Audio>` for the default or alternate voice. |
| `../memory/index.ts` | Strict resolver, `DEFAULT_VOICE`, `EMOTIONS`, `getVoiceAssetPath()`. |

## Default

```tsx
import { VoiceNarration } from "../../voice-library/VoiceNarration";

// SD_VOICE_03 — Nathan Cole
<VoiceNarration emotion="calm" />
```

## Alternate (only when the brief names it)

```tsx
<VoiceNarration voice="SD_VOICE_09" emotion="reflection" />
```

## Resolve a path

```ts
import { DEFAULT_VOICE, getVoiceAssetPath } from "../../memory";

const src = getVoiceAssetPath(DEFAULT_VOICE, "suspense");
```

Unknown voices and emotions throw. There is no fallback voice.

## Asset location

`public/audio/voice-library/SD_VOICE_03_Nathan_Cole/` and
`public/audio/voice-library/SD_VOICE_09_James_Carter/`.

The audio is gitignored. Restore it with the commands in
[`memory/assets/README.md`](../../memory/assets/README.md).
