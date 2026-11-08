#!/usr/bin/env node
/**
 * Apply generated voiceover timing and subtitle cues to an episode manifest.
 *
 * The audio is the master clock. Scene visuals expand to the generated read;
 * narration is never time-stretched. The script also adds an intro hold when
 * the voiceover has a cold-open lead-in, and a brand tail after the last word.
 *
 * Usage:
 *   node voice/scripts/apply_voiceover_to_episode.mjs \
 *     --episode content/episode-voice-profile-demo.json \
 *     --metadata public/audio/voiceovers/voice-profile-demo/voiceover-metadata.json \
 *     --out content/episode-voice-profile-demo.json
 */
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 1) {
  const key = process.argv[index];
  if (!key.startsWith("--")) continue;
  const value = process.argv[index + 1];
  if (!value || value.startsWith("--")) {
    args.set(key.slice(2), "true");
  } else {
    args.set(key.slice(2), value);
    index += 1;
  }
}

const episodePath = args.get("episode");
const metadataPath = args.get("metadata");
if (!episodePath || !metadataPath) {
  console.error("Usage: --episode <draft.json> --metadata <voiceover-metadata.json> [--out <file>]");
  process.exit(2);
}

const outPath = args.get("out") || episodePath;
const minDuration = Number(args.get("min-duration") || 60);
const tailHold = Number(args.get("tail-hold") || 8);
const brandTail = Number(args.get("brand-tail") || 4.8);

const episode = JSON.parse(fs.readFileSync(episodePath, "utf8"));
const metadata = JSON.parse(fs.readFileSync(metadataPath, "utf8"));
const records = Array.isArray(metadata.scenes) ? metadata.scenes : [];
if (records.length === 0) {
  console.error("Voiceover metadata has no scenes.");
  process.exit(1);
}

const leadIn = Number(metadata.leadInSeconds || 0);
const firstRecordedStart = Number(records[0].startSeconds || 0);
const wantsIntro = leadIn >= 0.75;

if (wantsIntro && episode.scenes[0]?.id !== "intro") {
  episode.scenes.unshift({
    id: "intro",
    startSeconds: 0,
    durationSeconds: leadIn,
    layout: "city",
    background: {
      imagePath: "/images/city-fog.jpg",
      imageObjectPosition: "50% 46%",
      imageOpacity: 0.3,
      grade: "night",
      parallax: 0.05,
    },
    headlines: [
      {
        kicker: "SIMPLEDEAV VOICE PROFILE",
        text: "DAVID NIGERIAN ENGLISH",
        accentWords: ["DAVID", "NIGERIAN"],
        preset: "maskedUp",
        startSeconds: 0.2,
        size: "display",
        align: "left",
        maxWidth: 900,
        placement: "top",
      },
    ],
    character: {
      action: "idle",
      x: 770,
      y: 1490,
      scale: 1.12,
      facing: "front",
      expression: "neutral",
    },
    camera: { motion: "static", intensity: 0.03 },
    transitionIn: "fade",
    visual: { kind: "none" },
  });
}

const byId = new Map(records.map((record, index) => [record.id, { record, index }]));
const used = new Set();
for (const [index, scene] of episode.scenes.entries()) {
  if (scene.id === "intro") {
    scene.startSeconds = 0;
    scene.durationSeconds = wantsIntro ? leadIn : 0.1;
    continue;
  }
  const match = byId.get(scene.id) || { record: records[index - (wantsIntro ? 1 : 0)], index };
  if (!match.record) {
    throw new Error(`No voiceover record for episode scene '${scene.id}'`);
  }
  const record = match.record;
  used.add(record.id);
  scene.startSeconds = Number(record.startSeconds);
  scene.durationSeconds = Number(record.durationSeconds);
}

if (used.size !== records.length) {
  const missing = records.filter((record) => !used.has(record.id)).map((record) => record.id);
  throw new Error(`Episode is missing scenes for voiceover records: ${missing.join(", ")}`);
}

// Expand each visual scene through the gap to the next scene. The last scene
// holds through the brand tail.
const realScenes = episode.scenes.filter((scene) => scene.id !== "intro");
for (let index = 0; index < realScenes.length - 1; index += 1) {
  const scene = realScenes[index];
  const next = realScenes[index + 1];
  const audioEnd = scene.startSeconds + scene.durationSeconds;
  scene.durationSeconds = Math.max(scene.durationSeconds, next.startSeconds - scene.startSeconds);
  if (scene.startSeconds + scene.durationSeconds < audioEnd) {
    scene.durationSeconds = audioEnd - scene.startSeconds;
  }
}

const audioEnd = Number(metadata.totalDurationSeconds);
const desiredTotal = Math.max(minDuration, Math.ceil(audioEnd + tailHold));
const duration = Math.min(90, desiredTotal);
const brandStart = Math.max(audioEnd + 1.2, duration - brandTail);
const lastScene = realScenes[realScenes.length - 1];
lastScene.startSeconds = Number(lastScene.startSeconds);
lastScene.durationSeconds = Math.max(
  lastScene.durationSeconds,
  brandStart - lastScene.startSeconds,
  duration - lastScene.startSeconds,
);

episode.durationSeconds = Math.round(duration * 100) / 100;
episode.totalFrames = Math.round(episode.durationSeconds * episode.fps);
episode.narration = {
  text: records.map((record) => record.text).join(" "),
  voice: metadata.profile?.displayName || "David Nigerian English — Cinematic Documentary Voice",
  voiceAudioPath: metadata.files.fullWav,
  subtitlePath: metadata.files.vtt,
  wordTimingsPath: metadata.files.words,
  audioDurationSeconds: audioEnd,
  subtitles: (() => {
    const cuesPath = path.join(process.cwd(), "public", metadata.files.cues.replace(/^\//, ""));
    if (!fs.existsSync(cuesPath)) return [];
    return JSON.parse(fs.readFileSync(cuesPath, "utf8")).cues || [];
  })(),
};

episode.brand = {
  ...episode.brand,
  startSeconds: Math.round(brandStart * 100) / 100,
  revealDurationSeconds: Math.min(4.2, episode.durationSeconds - brandStart),
};

episode.music = {
  ...episode.music,
  volumeAutomation: [
    { timeSeconds: 0, volume: 0.1 },
    { timeSeconds: Math.round(episode.durationSeconds * 0.2), volume: 0.14 },
    { timeSeconds: Math.round(episode.durationSeconds * 0.45), volume: 0.18 },
    { timeSeconds: Math.round(episode.durationSeconds * 0.7), volume: 0.2 },
    { timeSeconds: Math.round(brandStart), volume: 0.16 },
    { timeSeconds: episode.durationSeconds, volume: 0 },
  ],
};

// One transition whoosh per scene start, one data tick at the revelation, and
// a restrained brand sting. All layers stay separate from the narration.
const sfx = [];
const whoosh = { path: "/audio/sfx/transition-whoosh.mp3", durationSeconds: 1.334 };
for (const [index, scene] of realScenes.entries()) {
  if (scene.startSeconds <= 0.05) continue;
  sfx.push({
    id: `scene-${index + 1}-whoosh`,
    path: whoosh.path,
    startSeconds: Math.round(scene.startSeconds * 100) / 100,
    durationSeconds: whoosh.durationSeconds,
    volume: index === 4 ? 0.26 : 0.18,
    fadeInSeconds: 0.03,
    fadeOutSeconds: 0.22,
  });
}
const revelation = realScenes.find((scene) => scene.id === "revelation");
if (revelation) {
  sfx.push({
    id: "revelation-tick",
    path: "/audio/sfx/sci-fi-click.mp3",
    startSeconds: Math.round((revelation.startSeconds + 2.6) * 100) / 100,
    durationSeconds: 0.696,
    volume: 0.2,
    fadeInSeconds: 0.01,
    fadeOutSeconds: 0.12,
  });
}
sfx.push({
  id: "brand-sting",
  path: "/audio/sfx/transition-whoosh.mp3",
  startSeconds: Math.round((brandStart - 0.2) * 100) / 100,
  durationSeconds: 1.334,
  volume: 0.24,
  fadeInSeconds: 0.03,
  fadeOutSeconds: 0.3,
});
episode.soundEffects = sfx;

const engine = metadata.engine || {};
const assets = Array.isArray(episode.assets) ? episode.assets : [];
const asset = (pathName, kind, notes) => ({
  path: pathName,
  kind,
  sourceUrl: "generated-locally",
  creator: "Simpledeav voice service",
  license: engine.license || "See voice profile",
  notes,
});
const existing = new Set(assets.map((entry) => entry.path));
const add = (entry) => {
  if (!existing.has(entry.path)) {
    assets.push(entry);
    existing.add(entry.path);
  }
};
add(asset(metadata.files.fullWav, "audio", `Cloned narration, ${audioEnd.toFixed(2)}s. Engine: ${engine.id}. Profile: ${metadata.profile?.id}.`));
add(asset(metadata.files.vtt, "subtitle", "Subtitle cues aligned to the generated audio with local Whisper word timings."));
add(asset(metadata.files.words, "data", "Word-level timings from the generated audio."));
add(asset(metadata.files.cues, "data", "Grouped subtitle cues derived from real word timings."));
for (const record of records) {
  add(asset(record.audioPath, "audio", `Per-scene master for '${record.id}' (${record.durationSeconds.toFixed(2)}s).`));
}
add(asset(metadata.profile?.reference || "/audio/voice-profile/david_nigerian_english/reference.wav", "audio", "David's original recorded speaker reference. Not modified."));
add({
  path: "/images/city-fog.jpg",
  kind: "image",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:City_fog.jpg",
  creator: "Jon Sullivan / Wikimedia Commons",
  license: "Public domain",
  notes: "Existing Simpledeav background plate.",
});
add({
  path: "/images/grain.png",
  kind: "image",
  sourceUrl: "generated-locally",
  creator: "Simpledeav Studio",
  license: "Generated asset for this project",
  notes: "Film-grain overlay.",
});
add({
  path: "/audio/music/vastness-92s.mp3",
  kind: "audio",
  sourceUrl: "https://assets.mixkit.co/music/184/184.mp3",
  creator: "Mixkit",
  license: "Mixkit Stock Music Free License",
  notes: "Existing licensed documentary bed; kept on a separate music layer.",
});
for (const effect of sfx) {
  add({
    path: effect.path,
    kind: "audio",
    sourceUrl: "https://mixkit.co/license/",
    creator: "Mixkit",
    license: "Mixkit Sound Effects Free License",
    notes: "Existing Simpledeav Foley layer.",
  });
}
add({
  path: "/brand/simpledeav-avatar.png",
  kind: "avatar",
  sourceUrl: "https://avatars.githubusercontent.com/u/88326987?s=64&v=4",
  creator: "Simpledeav",
  license: "Channel owner profile image; used with authorization",
  notes: "Closing signature avatar.",
});
episode.assets = assets;

episode.voiceover = {
  slug: metadata.slug,
  metadataPath: metadata.files.metadata,
  engine: engine.id,
  engineName: engine.name,
  license: engine.license,
  commercialUse: Boolean(engine.commercialUse),
  profile: metadata.profile?.id,
  review: metadata.review,
};

const review = {
  episode: episode.episodeId,
  slug: metadata.slug,
  generatedAt: new Date().toISOString(),
  audioDurationSeconds: audioEnd,
  videoDurationSeconds: episode.durationSeconds,
  brandStartSeconds: episode.brand.startSeconds,
  sceneCount: realScenes.length,
  warnings: metadata.review?.warnings || [],
  notes: [
    "Scene visuals expand to the generated audio; audio is never time-stretched to hit a target.",
    "Narration, music and SFX remain separate Remotion audio layers.",
  ],
};

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, `${JSON.stringify(episode, null, 2)}\n`);
const reviewPath = path.join(path.dirname(outPath), `${path.basename(outPath, ".json")}.review.json`);
fs.writeFileSync(reviewPath, `${JSON.stringify(review, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      ok: true,
      out: outPath,
      review: reviewPath,
      durationSeconds: episode.durationSeconds,
      audioDurationSeconds: audioEnd,
      scenes: realScenes.length,
      brandStartSeconds: episode.brand.startSeconds,
      warnings: review.warnings,
    },
    null,
    2,
  ),
);
