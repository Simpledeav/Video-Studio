#!/usr/bin/env node
/**
 * Source-level validation for the Simpledeav template.
 * Intentionally does not render frames or start a render queue.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const failures = [];
const notes = [];

const fail = (message) => failures.push(message);
const note = (message) => notes.push(message);
const argIndex = process.argv.indexOf("--episode");
const episodeFile = argIndex >= 0 ? process.argv[argIndex + 1] : "content/demo-episode.json";
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(read(relativePath));
const abs = (publicPath) => path.join(root, "public", publicPath.replace(/^\//, ""));

const requiredFiles = [
  "src/index.ts",
  "src/Root.tsx",
  "src/compositions/StickmanStory.tsx",
  "src/components/character/Stickman.tsx",
  "src/components/character/StickmanRig.ts",
  "src/components/character/poses.ts",
  "src/components/character/motion.ts",
  "src/components/scenes/SceneRenderer.tsx",
  "src/components/scenes/SceneBackground.tsx",
  "src/components/scenes/SceneVisuals.tsx",
  "src/components/typography/Headline.tsx",
  "src/components/typography/TextAnimation.tsx",
  "src/components/typography/SubtitleTrack.tsx",
  "src/components/camera/CameraMotion.tsx",
  "src/components/audio/AudioTimeline.tsx",
  "src/components/branding/SimpledeavSignature.tsx",
  "src/components/transitions/Transitions.tsx",
  "src/config/brand.ts",
  "src/config/theme.ts",
  "src/config/motion.ts",
  "src/config/audio.ts",
  "src/config/episode.schema.ts",
  "src/utils/timing.ts",
  "src/utils/assetValidation.ts",
  "src/utils/textLayout.ts",
  "content/episode-template.json",
  "content/demo-episode.json",
  "content/episode-ai-agent-guardrails.json",
  "content/episode-lego-turnaround.json",
  "src/compositions/LegoCaseStudy.tsx",
  "src/components/lego/Brick.tsx",
  "src/components/lego/LegoVisuals.tsx",
  "src/components/scenes/SceneForeground.tsx",
  "src/components/scenes/environments/ConsoleEnvironment.tsx",
  "scripts/generate-episode-voice.py",
  "public/brand/simpledeav-avatar.png",
  "public/audio/voice.mp3",
  "public/audio/voice.vtt",
  "public/audio/voice.words.json",
  "public/audio/voice.cues.json",
  "public/audio/music/vastness-92s.mp3",
  "public/audio/sfx/transition-whoosh.mp3",
  "public/audio/sfx/interface-select.mp3",
  "public/audio/sfx/sci-fi-click.mp3",
  "public/audio/sfx/typing-loop.mp3",
  "public/images/city-fog.jpg",
  "public/images/grain.png",
  "public/fonts/Manrope-Regular.ttf",
  "public/fonts/Manrope-Medium.ttf",
  "public/fonts/Manrope-SemiBold.ttf",
  "public/fonts/InstrumentSerif-Regular.ttf",
  "public/asset-manifest.json",
  "docs/TEMPLATE-GUIDE.md",
  "docs/NEW-EPISODE-PROMPT.md",
  "docs/AUDIO-GUIDE.md",
  "scripts/generate-voice.py",
  "README.md",
  "tsconfig.json",
  "package.json",
];

for (const relativePath of requiredFiles) {
  if (!exists(relativePath)) fail(`Required file missing: ${relativePath}`);
}

const parseConstArray = (source, name) => {
  const match = new RegExp(`${name}\\s*=\\s*\\[([\\s\\S]*?)\\]\\s*as const`).exec(source);
  if (!match) return null;
  return [...match[1].matchAll(/"([^"]+)"/g)].map((entry) => entry[1]);
};

const schemaSource = exists("src/config/episode.schema.ts") ? read("src/config/episode.schema.ts") : "";
const themeSource = exists("src/config/theme.ts") ? read("src/config/theme.ts") : "";
const rootSource = exists("src/Root.tsx") ? read("src/Root.tsx") : "";
const motionSource = exists("src/config/motion.ts") ? read("src/config/motion.ts") : "";
const actions = parseConstArray(schemaSource, "CHARACTER_ACTIONS");
const layouts = parseConstArray(schemaSource, "SCENE_LAYOUTS");
const presets = parseConstArray(schemaSource, "TEXT_PRESETS");
const cameraMotions = parseConstArray(schemaSource, "CAMERA_MOTIONS");
const transitions = parseConstArray(schemaSource, "TRANSITIONS");
const palettes = parseConstArray(themeSource, "PALETTE_IDS");

if (!actions || !layouts || !presets || !cameraMotions || !transitions || !palettes) {
  fail("Could not read one or more schema/theme ID arrays from source.");
}

if (!rootSource.includes('id="StickmanStory"')) fail("Main composition id StickmanStory is not registered in src/Root.tsx.");
if (!rootSource.includes('id="AIAgentGuardrails"')) fail("AIAgentGuardrails is not registered in src/Root.tsx.");
if (!rootSource.includes('id="LegoCaseStudy"')) fail("LegoCaseStudy is not registered in src/Root.tsx.");
if (!rootSource.includes('id="LegoCaseStudyWide"')) fail("LegoCaseStudyWide is not registered in src/Root.tsx.");
if (!/WIDTH\s*=\s*1080/.test(motionSource) || !/HEIGHT\s*=\s*1920/.test(motionSource) || !/FPS\s*=\s*30/.test(motionSource)) {
  fail("Composition source constants are not 1080x1920 at 30 FPS.");
}

const durationForFile = (absolutePath) => {
  const result = spawnSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", absolutePath],
    { encoding: "utf8" },
  );
  if (result.status !== 0) return null;
  const value = Number.parseFloat(result.stdout.trim());
  return Number.isFinite(value) ? value : null;
};

const fileKind = (absolutePath) => {
  const result = spawnSync("file", ["-b", absolutePath], { encoding: "utf8" });
  return result.status === 0 ? result.stdout.trim() : "";
};

const isImagePath = (value) => /\.(png|jpe?g|webp|avif)$/i.test(value);
const isAudioPath = (value) => /\.(mp3|m4a|aac|wav|ogg|flac)$/i.test(value);
const isVideoPath = (value) => /\.(mp4|webm|mov)$/i.test(value);
const isFontPath = (value) => /\.(ttf|otf|woff2?)$/i.test(value);

let episode;
try {
  episode = readJson(episodeFile);
} catch (error) {
  fail(`${episodeFile} is not valid JSON: ${error.message}`);
}

if (episode) {
  if (!/^[a-z0-9-]+$/.test(episode.episodeId)) fail("episodeId must be kebab-case.");
  if (typeof episode.durationSeconds !== "number" || episode.durationSeconds < 60 || episode.durationSeconds > 90) {
    fail("durationSeconds must be between 60 and 90.");
  }
  if (episode.fps !== 30) fail("fps must be 30.");
  if (!palettes.includes(episode.themeId)) fail(`Unknown themeId: ${episode.themeId}`);
  if (episode.narration.audioDurationSeconds > episode.durationSeconds) fail("Narration exceeds composition duration.");

  const themeId = episode.themeId;
  if (!themeId) fail("themeId is missing.");

  const voicePath = path.join(root, "public", episode.narration.voiceAudioPath.replace(/^\//, ""));
  const audioDuration = fs.existsSync(voicePath) ? durationForFile(voicePath) : null;
  if (audioDuration === null) {
    fail("Narration audio cannot be read with ffprobe.");
  } else if (Math.abs(audioDuration - episode.narration.audioDurationSeconds) > 0.12) {
    fail(`Narration duration mismatch: JSON ${episode.narration.audioDurationSeconds}s, file ${audioDuration}s.`);
  }

  const cues = episode.narration.subtitles;
  if (!Array.isArray(cues) || cues.length === 0) {
    fail("No subtitle cues found.");
  } else {
    let previousEnd = -1;
    cues.forEach((cue, index) => {
      if (typeof cue.start !== "number" || typeof cue.end !== "number" || typeof cue.text !== "string") {
        fail(`Subtitle cue ${index} is malformed.`);
      } else {
        if (cue.end <= cue.start) fail(`Subtitle cue ${index} ends before it starts.`);
        if (cue.start < previousEnd - 0.001) fail(`Subtitle cue ${index} overlaps the previous cue.`);
        if (audioDuration !== null && cue.end > audioDuration + 0.05) fail(`Subtitle cue ${index} runs past the audio.`);
        previousEnd = cue.end;
        if (cue.text.length > 76) note(`Long subtitle cue ${index} (${cue.text.length} chars): ${cue.text}`);
      }
    });
  }

  if (!Array.isArray(episode.scenes) || episode.scenes.length === 0) {
    fail("No scenes found.");
  } else {
    let previousEnd = 0;
    episode.scenes.forEach((scene, index) => {
      if (!layouts.includes(scene.layout)) fail(`Scene ${index} has unknown layout "${scene.layout}".`);
      if (!actions.includes(scene.character.action)) fail(`Scene ${index} has unknown action "${scene.character.action}".`);
      if (!cameraMotions.includes(scene.camera.motion)) fail(`Scene ${index} has unknown camera motion.`);
      if (!transitions.includes(scene.transitionIn)) fail(`Scene ${index} has unknown transition.`);
      if (Math.abs(scene.startSeconds - previousEnd) > 0.02) fail(`Scene ${index} is not contiguous with the previous scene.`);
      if (scene.durationSeconds <= 0) fail(`Scene ${index} has an invalid duration.`);
      if (scene.startSeconds + scene.durationSeconds > episode.durationSeconds + 0.02) fail(`Scene ${index} exceeds duration.`);
      previousEnd = scene.startSeconds + scene.durationSeconds;

      scene.headlines.forEach((headline, headlineIndex) => {
        if (!presets.includes(headline.preset)) fail(`Scene ${index} headline ${headlineIndex} has unknown preset "${headline.preset}".`);
        if (headline.startSeconds < 0 || headline.startSeconds >= scene.durationSeconds) fail(`Scene ${index} headline ${headlineIndex} starts outside its scene.`);
        if (headline.endSeconds !== undefined && headline.endSeconds > scene.durationSeconds + 0.001) fail(`Scene ${index} headline ${headlineIndex} ends outside its scene.`);
        if (/\b(scene|text|frame)\s*\d{2,}/i.test(headline.text) || /\b(step|progress)\s*\d+/i.test(headline.text)) {
          fail(`Scene ${index} contains production metadata in on-screen text: "${headline.text}".`);
        }
      });

      const background = scene.background;
      for (const key of ["imagePath", "videoPath"]) {
        const value = background[key];
        if (value) {
          if (/^https?:/i.test(value)) fail(`Scene ${index}.${key} is remote; download it locally.`);
          if (!exists(`public${value}`)) fail(`Scene ${index}.${key} does not resolve: ${value}`);
        }
      }
    });
    if (Math.abs(previousEnd - episode.durationSeconds) > 0.05) fail("Scenes do not cover the full composition duration.");
  }

  const brand = episode.brand;
  if (brand.enabled && brand.signatureEnabled) {
    if (brand.startSeconds < episode.durationSeconds * 0.8) {
      fail("Brand reveal must live in the closing portion, not as a persistent watermark.");
    }
    if (brand.startSeconds + brand.revealDurationSeconds > episode.durationSeconds + 0.02) {
      fail("Brand reveal extends past the composition.");
    }
    const brandScene = episode.scenes.find(
      (scene) => brand.startSeconds >= scene.startSeconds &&
        brand.startSeconds < scene.startSeconds + scene.durationSeconds,
    );
    if (!brandScene) fail("Brand reveal does not fall inside a registered scene.");
  }

  if (!episode.narration.voiceAudioPath.startsWith("/audio/")) fail("Narration audio should live under /audio/.");
  if (!episode.narration.subtitlePath.startsWith("/audio/")) fail("Subtitle file should live under /audio/.");
  if (!episode.narration.wordTimingsPath.startsWith("/audio/")) fail("Word timing file should live under /audio/.");

  const audioPaths = new Set([episode.narration.voiceAudioPath, episode.music.path, ...episode.soundEffects.map((effect) => effect.path)]);
  for (const publicPath of audioPaths) {
    const absolutePath = abs(publicPath);
    if (!fs.existsSync(absolutePath)) {
      fail(`Audio path does not resolve: ${publicPath}`);
      continue;
    }
    const duration = durationForFile(absolutePath);
    if (duration === null) fail(`Audio file cannot be read: ${publicPath}`);
  }

  const musicDuration = exists(episode.music.path.replace(/^\//, "")) ? null : null;
  if (musicDuration === null && fs.existsSync(abs(episode.music.path))) {
    const probed = durationForFile(abs(episode.music.path));
    if (probed !== null && probed < episode.durationSeconds - 0.1) fail("Music is shorter than the composition.");
  }

  for (const [index, effect] of episode.soundEffects.entries()) {
    if (effect.startSeconds + effect.durationSeconds > episode.durationSeconds + 0.02) {
      fail(`Sound effect ${index} (${effect.id}) runs past the composition.`);
    }
    if (typeof effect.volume !== "number" || effect.volume < 0 || effect.volume > 1) {
      fail(`Sound effect ${index} volume must be 0-1.`);
    }
    const sourceDuration = fs.existsSync(abs(effect.path)) ? durationForFile(abs(effect.path)) : null;
    if (sourceDuration !== null && sourceDuration + 0.02 < effect.durationSeconds) {
      fail(`Sound effect ${index} (${effect.id}) is longer than its source file.`);
    }
  }

  const assets = Array.isArray(episode.assets) ? episode.assets : [];
  if (assets.length === 0) fail("Episode asset manifest is empty.");
  for (const [index, asset] of assets.entries()) {
    if (!asset.path || !asset.license || !asset.sourceUrl) fail(`Asset manifest entry ${index} needs path, license and sourceUrl.`);
    if (!asset.path.startsWith("/")) fail(`Asset manifest entry ${index} path must start with "/".`);
    const absolutePath = abs(asset.path);
    if (!fs.existsSync(absolutePath)) {
      fail(`Manifest asset missing on disk: ${asset.path}`);
      continue;
    }
    const size = fs.statSync(absolutePath).size;
    if (size < 64) fail(`Manifest asset is unexpectedly empty: ${asset.path}`);
    if (isAudioPath(asset.path)) {
      if (durationForFile(absolutePath) === null) fail(`Manifest audio is unreadable: ${asset.path}`);
    } else if (isImagePath(asset.path)) {
      const kind = fileKind(absolutePath);
      if (!/image|PNG|JPEG|WebP/i.test(kind)) fail(`Manifest image is unreadable: ${asset.path} (${kind})`);
    } else if (isFontPath(asset.path)) {
      const kind = fileKind(absolutePath);
      if (!/TrueType|OpenType|Web Open Font/i.test(kind)) fail(`Manifest font is unreadable: ${asset.path} (${kind})`);
    } else if (isVideoPath(asset.path)) {
      if (!/video|MP4|WebM|QuickTime/i.test(fileKind(absolutePath))) fail(`Manifest video is unreadable: ${asset.path}`);
    }
  }

  if (exists("public/asset-manifest.json")) {
    const manifest = readJson("public/asset-manifest.json");
    if (!Array.isArray(manifest.assets)) {
      fail("public/asset-manifest.json has no assets array.");
    } else {
      const manifestPaths = new Set(manifest.assets.map((asset) => asset.path));
      for (const asset of assets) {
        if (!manifestPaths.has(asset.path)) {
          fail(`public/asset-manifest.json is missing episode asset: ${asset.path}`);
        }
      }
    }
  }

  if (exists("out")) {
    const existingOutputs = fs
      .readdirSync(path.join(root, "out"), { withFileTypes: true })
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name);
    note(
      existingOutputs.length
        ? `Existing out/ artifact(s) found and left untouched: ${existingOutputs.join(", ")}. This validation does not render.`
        : "An empty out/ directory exists; this validation does not render.",
    );
  }
}

console.log(`Simpledeav Studio validation — ${episodeFile}`);
console.log("=============================================");
if (notes.length) {
  console.log("Notes:");
  for (const item of notes) console.log(`  - ${item}`);
}
if (failures.length) {
  console.error(`\nFAILED (${failures.length})`);
  for (const item of failures) console.error(`  ✗ ${item}`);
  process.exit(1);
}
console.log(`✓ ${requiredFiles.length} required files present`);
console.log("✓ Episode schema, scenes, themes, assets, audio and subtitles");
console.log("✓ Composition registered at 1080x1920 / 30 FPS");
console.log("✓ No new render output was produced by validation");
process.exit(0);
