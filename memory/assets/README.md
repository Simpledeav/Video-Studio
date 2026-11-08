# Asset policy

The project uses local assets only. Nothing is loaded from the network during
playback. Heavy media is **never committed** to Git.

## What is tracked

| Path | Tracked? | Why |
| --- | --- | --- |
| `memory/**` | Yes | The design and production memory. |
| `src/**` | Yes | Compositions, components and config. |
| `content/**` | Yes | Episode data and cue sheets. |
| `scripts/**` | Yes | Voice, validation and scaffolding tools. |
| `public/fonts/**` | Yes | Local Poppins, Manrope and Instrument Serif. |
| `public/brand/**` | Yes | Avatar and brand SVGs. Small and essential. |
| `public/audio/voice-library/manifest.json` | Yes | Voice index. Small. |
| `public/audio/voice-library/**/description.md` | Yes | Voice identity sheets. |
| `public/audio/**/*.wav`, `*.mp3` | No | Heavy audio. |
| `public/images/**` | No | Episode photography. |
| `public/video/**` | No | Episode footage. |
| `docs/preview/**` | No | Preview stills. |
| `out/**`, `dist/**` | No | Render output. |
| `node_modules/**` | No | Dependencies. |
| `models/**`, `.models/**`, `.venv*/**` | No | Local models and environments. |

## Restoring the voice library

The canonical library lives outside this project at:

```text
~/Documents/MOTION DESIGN/motion-studio/public/audio/voice-library/
```

Restore the two identities this studio uses:

```bash
rsync -a "$HOME/Documents/MOTION DESIGN/motion-studio/public/audio/voice-library/SD_VOICE_03_Nathan_Cole" public/audio/voice-library/
rsync -a "$HOME/Documents/MOTION DESIGN/motion-studio/public/audio/voice-library/SD_VOICE_09_James_Carter" public/audio/voice-library/
```

The curated `public/audio/voice-library/manifest.json` in this project already
points at those two folders.

Verify:

```bash
node scripts/voice-lookup.mjs "SD_VOICE_03"
```

## Restoring episode images and audio

The previous working project is the source of truth:

```text
~/Documents/WORK VIDEO/VideoStudio/simpledeav-studio/public/
```

Copy only the folders the new film needs:

```bash
rsync -a "$HOME/Documents/WORK VIDEO/VideoStudio/simpledeav-studio/public/images/<folder>" public/images/
rsync -a "$HOME/Documents/WORK VIDEO/VideoStudio/simpledeav-studio/public/audio/episodes/<slug>" public/audio/episodes/
```

## What may be committed

- Small SVG logos and icons.
- Fonts.
- JSON manifests, cue sheets and metadata.
- Markdown documentation.
- Source code.

## What must not be committed

- Any `.mp4`, `.mov`, `.webm`, `.mkv`, `.gif`.
- Any `.wav`, `.mp3`, `.m4a`, `.aac`, `.flac`.
- 4K stills or large PNG/JPG sequences.
- Model weights, virtual environments or caches.

If a heavy file appears in `git status`, stop and fix `.gitignore` first.
