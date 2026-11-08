# Video record specification

Every video gets a dedicated writing record in `videos/<slug>/`. The record is
part of the deliverable. It is how the studio remembers what was made, why, and
what was published.

## Folder structure

```text
videos/
  _template/                 # copied by `npm run new:video`
  <slug>/
    metadata.json            # machine-readable index
    prompt.md                # the prompt the user actually passed
    description.md           # short description of the film
    social/
      linkedin.md            # professional caption
      x.md                   # X / Twitter caption
      tiktok.md              # TikTok caption
      instagram.md           # Instagram caption
    notes.md                 # optional production notes
    references/              # optional source links, screenshots, briefs
```

## File contracts

### `prompt.md`

- The user's actual prompt, **verbatim**. Do not rewrite it.
- If the prompt arrived in pieces, put the final assembled brief here and keep
  the raw messages under `references/`.
- Add a `## Derived decisions` section for anything the agent chose (preset,
  voice, length, act spine).

### `description.md`

- 2–4 sentences.
- State the subject, the story turn and the visual system.
- No marketing fluff. This is an internal record.
- Example: "An 80-second vertical case study on Walmart's limited-edition
  rotisserie chicken purse. The film follows the joke from social listening to a
  5,000-unit drop and a 90-minute sell-out. Built with the Walmart Editorial Pop
  preset and the default SD_VOICE_03 narration."

### `social/linkedin.md`

- 2–4 short paragraphs.
- Lead with the business lesson, not the product.
- One clear takeaway. Optional question at the end.
- 3–5 hashtags at the bottom.
- No emoji spam. One emoji maximum.

### `social/x.md`

- Under 280 characters.
- One idea, one turn, one reason to watch.
- No hashtags unless they add meaning.
- Optionally include a second line with 1–2 hashtags.

### `social/tiktok.md`

- Hook in the first line.
- 2–4 short lines of curiosity and payoff.
- 3–6 hashtags.
- Write for the ear, not the page.

### `social/instagram.md`

- Visual-first opening line.
- 2–4 short paragraphs or a 3–5 line list.
- One saveable takeaway.
- 3–6 hashtags.
- One emoji maximum.

### `metadata.json`

```json
{
  "slug": "my-video",
  "title": "My Video",
  "created": "2026-11-08",
  "status": "draft",
  "preset": "house",
  "voice": "SD_VOICE_03",
  "durationSeconds": 80,
  "formats": ["vertical", "horizontal", "cover"],
  "compositions": {
    "vertical": "MyVideo",
    "horizontal": "MyVideoWide",
    "cover": "MyVideoCover"
  },
  "tags": ["business", "technology"],
  "source": "user brief"
}
```

`status` is one of `draft`, `review`, `approved`, `published`.

## Caption voice

- Short sentences.
- Concrete nouns and numbers.
- No "in today's fast-paced world".
- No fake urgency.
- No claim that is not in the film or the source.
- Platform-native: LinkedIn teaches, X provokes, TikTok hooks, Instagram saves.

## Naming

- Folder slug: lowercase, hyphenated, no dates unless needed.
- Composition IDs: PascalCase, base + `Wide` + `Cover`.
- Voice segment files: `content/<slug>-voice-segments.json`.
- Audio: `public/audio/episodes/<slug>/`.

## Scaffold

```bash
npm run new:video -- \
  --slug my-video \
  --title "My Video" \
  --preset house \
  --voice SD_VOICE_03
```

The script copies [`../templates/video-record/`](../templates/video-record/) and
fills the date, slug, title, preset and voice.
