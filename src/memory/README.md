# Memory bridge (code)

This folder is the typed bridge to the canonical `memory/` folder at the project
root. Compositions should import from here instead of hard-coding defaults.

```ts
import {
  DEFAULT_VOICE,        // "SD_VOICE_03"
  // Only SD_VOICE_03 is permitted.
  DEFAULT_PRESET,       // "house"
  PRESETS,              // { house, walmart }
  FORMATS,              // vertical, horizontal, cover
  HOUSE_TOKENS,         // design tokens
  getVoiceAssetPath,    // strict resolver -> staticFile URL
  resolveVoice,         // strict voice profile lookup
  listVoices,
} from "../../memory";
```

## Rules

- The default voice is `SD_VOICE_03`. Do not pass a voice unless the brief names
  `SD_VOICE_03`.
- `resolveVoice` and `getVoiceAssetPath` throw on unknown voices or emotions.
  There is no fallback voice.
- `FORMATS` is the single source for canvas sizes. Do not invent a fourth
  format or a 4K size.
- `RENDERING` documents the no-MP4, no-4K rule. It is not a switch.
