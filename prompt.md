# TASK: Build a Reusable AI Voice Cloning Template Using My Real Voice

You are working on my existing AI-powered Remotion video production system.

I have already recorded voice samples of my own voice. I want to use those recordings to create a reusable AI voice profile that can generate future video narration from text scripts.

The objective is to generate voiceovers that sound like my own voice, preserve my Nigerian English accent as much as the selected model supports, and remain consistent across all my future videos.

## 1. Inspect the Existing Project

Before writing code:

- Inspect the existing Remotion project structure.
- Identify the existing voiceover template, audio-generation modules, scene scripts, subtitle utilities, sound effects, background music handling, and rendering/preview system.
- Identify the location of my recorded voice sample.
- Check the existing Python and Node.js environments.
- Check the available hardware and memory on my Intel MacBook with 16GB RAM.
- Do not rebuild or replace my existing video production system.
- Do not break existing video templates or workflows.

## 2. Select a Local Voice Cloning Engine

Evaluate locally runnable voice cloning engines.

Prioritize:

- Natural-sounding speech.
- Similarity to my recorded voice.
- Nigerian English accent retention.
- Intelligible pronunciation.
- Consistent voice identity between generations.
- Emotional delivery and expressive narration.
- Compatibility with my Intel MacBook.
- Reasonable inference speed and memory requirements.
- License that permits commercial use of generated narration for my monetized social media videos.

Do not select a model merely because it is open-source.

Review the license for the source code, model weights, and generated audio usage.

If the best-quality model is non-commercial, do not use it for my commercial production workflow without identifying the limitation.

Test available candidates using my actual voice sample before choosing the default engine.

If no suitable model can run reliably on my MacBook, implement an engine abstraction that can later support a compatible local or self-hosted model.

## 3. Create My Permanent Voice Profile

Create a reusable profile named:

David Nigerian English — Cinematic Documentary Voice

Profile characteristics:

- Male Nigerian English voice.
- My actual recorded voice as the speaker reference.
- Natural Nigerian accent.
- Clear and intelligible speech.
- Human-like conversational delivery.
- Cinematic documentary narration.
- Professional technology and business storytelling.
- Warm, confident and expressive.
- Natural pauses and breathing rhythm.
- Avoid robotic delivery.
- Avoid exaggerated Nigerian accent stereotypes.
- Avoid excessive speed.
- Avoid overdramatic delivery unless the scene requires it.

The system must use my original recorded sample as its voice reference.

Do not create a generic Nigerian voice and label it as mine.

## 4. Implement the Voice Generation Module

Build a reusable voice generation service.

It should accept:

- narration text
- voice profile ID
- scene ID
- emotion
- delivery style
- speaking speed
- output format
- optional pronunciation dictionary
- optional reference audio override

It should return:

- generated audio file
- duration
- generation metadata
- selected model
- voice profile used
- generation settings
- success or failure information

Support WAV as the master format and MP3 as an optional delivery format.

Use a persistent cache so that unchanged narration is not regenerated unnecessarily.

Never regenerate every scene when only one scene has changed.

## 5. Create Delivery Presets

Create reusable delivery presets:

### documentary_hook
Confident, engaging, intriguing, emotionally expressive opening.

### business_explanation
Professional, clear, conversational, informative.

### tension
Slightly slower, serious, suspenseful, controlled.

### revelation
Emphasize the important discovery or turning point.

### reflection
Warm, thoughtful, natural pacing.

### conclusion
Confident, memorable, natural CTA delivery.

These presets should influence generation settings where the selected model supports them.

Do not assume every model supports emotion control. Where unsupported, use punctuation, sentence structure, and carefully segmented narration.

## 6. Remotion Integration

Integrate the generated voiceover into my existing Remotion template.

Requirements:

- Generate narration per scene.
- Use the same voice profile across all scenes.
- Use the actual generated audio duration to calculate scene timing.
- Synchronize subtitles with the generated audio.
- Do not force narration to fit a scene by stretching the audio unnaturally.
- If the narration is too long, adjust the scene duration or flag it for review.
- Keep background music and sound effects on separate audio layers.
- Preserve the existing visual animation and cinematic sound design.
- Support both horizontal and vertical video layouts.
- Keep the existing preview workflow.
- Do not automatically render final 4K videos.

## 7. Create a Reusable Future Workflow

I want to be able to give my coding agent a new video case study and have it:

1. Write the video narration.
2. Break the narration into scenes.
3. Assign the appropriate delivery preset to each scene.
4. Generate the narration using my saved voice profile.
5. Save the audio assets in an organized folder.
6. Synchronize subtitles.
7. Calculate scene timing from the generated audio.
8. Integrate the narration with the Remotion video.
9. Generate horizontal and vertical previews.
10. Run quality checks.

Example asset structure:

public/audio/voiceovers/[video-slug]/

- scene-001.wav
- scene-002.wav
- scene-003.wav
- voiceover-full.wav
- voiceover-metadata.json

## 8. Voice Quality Testing

Create a test suite using my recorded sample.

Generate the following test clips:

- An engaging startup documentary hook.
- A calm business explanation.
- A suspenseful sentence.
- An emotional revelation.
- A reflective conclusion.
- A Nigerian business name pronunciation test.
- A test involving numbers, currency, dates and percentages.

Evaluate the output for:

- Voice identity similarity.
- Nigerian English accent retention.
- Naturalness.
- Pronunciation accuracy.
- Emotional expression.
- Pacing.
- Audio artifacts.
- Consistency across clips.

Do not claim 100% voice similarity or 100% human-like output.

Provide a comparison of the tested models and recommend the best one.

## 9. Final Deliverables

Deliver:

- A working reusable voice profile.
- The local voice generation service.
- Voice profile configuration.
- A reusable Remotion voiceover component or utility.
- Scene-based narration generation.
- Audio caching.
- Subtitle synchronization integration.
- A test script.
- A clear installation and usage guide.
- An example video using my actual voice sample.

Do not stop at writing documentation or creating placeholder files.

The system must actually generate a test narration from my recorded voice.

Preserve the existing project architecture and implement this as a reusable extension of the current system.


SD_VOICE_03 — Nathan Cole

I love the design style used for this walmart chicken video can you save it as a design style preset for me so that my subsequent videos can look just in that fashion.