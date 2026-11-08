# Video records

Every video gets its own folder here. The folder is the permanent writing record:
the prompt, a short description, and the social captions for LinkedIn, X,
TikTok and Instagram.

```text
videos/
  README.md
  _template/                 # optional local copy; the source is memory/templates/video-record
  <slug>/
    metadata.json
    prompt.md
    description.md
    social/
      linkedin.md
      x.md
      tiktok.md
      instagram.md
    notes.md
```

## Create one

```bash
npm run new:video -- \
  --slug my-video \
  --title "My Video" \
  --preset house \
  --voice SD_VOICE_03
```

This copies `memory/templates/video-record/` into `videos/my-video/` and fills
the date, slug, title, preset, voice and composition IDs.

## Rules

- The prompt is stored **verbatim**.
- The description is 2–4 sentences.
- Each platform gets its own caption, not one caption copied four times.
- No heavy files. Link to assets instead of committing them.
- Set `status` in `metadata.json` to `draft`, `review`, `approved` or
  `published`.

Full specification: [`../memory/process/video-record.md`](../memory/process/video-record.md).
