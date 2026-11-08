# Reusable New-Episode Prompt

Copy the block below into DeepSeek Harness for each new episode. Fill in the
bracketed placeholders, then remove the ones you do not need.

---

```text
PROJECT: Simpledeav cinematic stickman episode
PROJECT ROOT: /Users/mac/Documents/WORK VIDEO/VideoStudio/simpledeav-studio

Read these first, in this order:
0. defaults/README.md — the audio system and the closing screen are already decided; use them unchanged
1. docs/TEMPLATE-GUIDE.md
2. docs/AUDIO-GUIDE.md
3. content/episode-template.json
4. src/config/episode.schema.ts
5. src/config/brand.ts and src/config/theme.ts

TASK
Create a new episode using the existing Simpledeav engine. Do not rebuild the
animation system. Do not modify the character rig or shared components unless a
defect requires it. Keep the existing template intact.

STORY BRIEF
- Topic: [STORY TOPIC]
- Central question / promise: [WHAT THE VIEWER SHOULD WONDER OR LEARN]
- Duration: [60–90] seconds (default 90)
- Mood: [e.g. cold-open curiosity, tense, hopeful, cautionary]
- Audience: [e.g. founders, creators, operators]
- Narration style: [conversational, measured, 200–240 words]

CREATIVE DIRECTION
- Theme palette: [MIDNIGHT_CYAN | GRAPHITE_LIME | BURGUNDY_GOLD | IVORY_INK | ELECTRIC_VIOLET]
- Visual assets available locally: [LIST FILES IN public/images OR "none — use vector environments"]
- Main character actions to feature: [idle, type, point, surprise, think,
  reconsider, walk, sit, celebrate, lookAtScreen, turn, sleep]
- Signature behavior: integrated closing reveal using the shared
  `SimpledeavSignOff` template (avatar + bold SIMPLEDEAV only); no persistent
  watermark, no social icons, no monogram, no handle
- Avoid: on-screen scene IDs, frame IDs, progress indicators, technical labels,
  generic stock-template look, long animated paragraphs, flashy subtitles

AUDIO REQUIREMENTS
- Generate a voice sample first, then the full narration.
- Use Edge TTS with a natural conversational voice at a measured rate.
- Write the script to content/episode-narration.txt.
- Run: python3 scripts/generate-voice.py --text-file content/episode-narration.txt
- Use the actual word-boundary timings to build subtitle cues and scene anchors.
- Add actual local music and SFX. Record source URL, creator, and license in the
  episode assets array and public/asset-manifest.json.
- Place SFX on their visible story actions. Use music ducking under narration.
- Do not synthesize fake realistic sound effects.

IMPLEMENTATION
- Create content/<episode-id>.json based on content/episode-template.json.
- Choose a layout for each scene from:
  city, office, agentGrid, chart, threshold, catch, closing.
- Keep scene times contiguous and inside the total duration.
- Use the existing text presets, character actions, camera motions, transitions,
  audio timeline, subtitles, and SimpledeavSignature.
- Only change shared code if a genuine reusable improvement is required.
- If the Studio needs to show this new episode as the default, update the
  episode import in src/Root.tsx; otherwise document how to switch to it.
- Preserve the previous demo episode and template.

VERIFY
- Run npm run check.
- Start/reuse Remotion Studio and open the composition.
- Play representative frames: opening, typing/pointing, data moment, closing
  headline, and signature reveal.
- Test the selected palette. If time allows, test one alternate palette.
- Confirm the signature is in the closing scene and not a watermark.
- Confirm subtitles use actual audio timings, fit two lines, and clear the screen
  during pauses.
- Do not render an MP4, export video, run a render queue, or create an image
  sequence. This is a Studio preview task unless I explicitly ask for a render.

DELIVER
Report the episode JSON path, composition ID, Studio URL, theme, asset additions,
tests performed, and any unresolved issues. Keep the report concise.
```

---

## Placeholder notes

- **Topic:** e.g. “AI agents replacing middle management”, “the economics of
  infinite content”, “what happens when software builds itself”.
- **Duration:** 60–90 seconds. 90 is the default. Keep the closing signature
  after the final narration line, inside the 8–10% closing tail.
- **Mood:** choose the palette deliberately from the episode's emotional logic.
- **Assets:** only local files under `public/images/` or `public/video/`.
  Never point a scene at a remote URL.
- **Actions:** at least one intentional physical action per major beat. Prefer
  stillness and one clear gesture over constant motion.
