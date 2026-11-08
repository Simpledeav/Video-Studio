# Process

The production workflow is deliberately short. The goal is a browser-ready
design, not an export.

| File | Use |
| --- | --- |
| [`rules.md`](./rules.md) | The non-negotiable rules. Read first. |
| [`video-creation.md`](./video-creation.md) | End-to-end workflow for a new film. |
| [`video-record.md`](./video-record.md) | The per-video writing record specification. |
| [`qa.md`](./qa.md) | The browser QA checklist. |

## The short version

1. Scaffold a video record.
2. Choose the preset and the voice.
3. Write the narration, then the scenes.
4. Build vertical → horizontal → cover.
5. Register all three in `src/Root.tsx`.
6. Preview in the browser.
7. Fill the record.
8. Stop. Do not render.
