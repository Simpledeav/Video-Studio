#!/usr/bin/env node
/**
 * Strict lookup for the permanent SIMPLEDEAV voice library.
 *
 * Usage:
 *   node scripts/voice-lookup.mjs "SD_VOICE_03 — Nathan Cole"
 *   node scripts/voice-lookup.mjs "Nathan Cole" --emotion=suspense
 *   node scripts/voice-lookup.mjs --list
 *   node scripts/voice-lookup.mjs --emotions
 *
 * Output is JSON on stdout. Unknown voices, unknown emotions, and missing
 * files exit non-zero. There is no fallback voice.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST_PATH = resolve(
  ROOT,
  "public/audio/voice-library/manifest.json",
);

const fail = (message, code = 1) => {
  process.stderr.write(`${message}\n`);
  process.exit(code);
};

if (!existsSync(MANIFEST_PATH)) {
  fail(
    `Voice manifest not found at ${MANIFEST_PATH}. Run: python3 scripts/build-voice-library.py`,
  );
}

const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
const args = process.argv.slice(2);
const normalize = (value) =>
  value
    .toLowerCase()
    .replace(/[—–]/g, " ")
    .replace(/[_-]+/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

if (args.includes("--list")) {
  process.stdout.write(
    JSON.stringify(
      manifest.voices.map((voice) => ({
        voice_id: voice.voice_id,
        voice_name: voice.voice_name,
        gender: voice.gender,
        vocal_register: voice.vocal_register,
        accent: voice.accent,
        primary_emotion: voice.primary_emotion,
        speaking_speed: voice.speaking_speed,
        engine_voice: voice.engine_voice,
      })),
      null,
      2,
    ) + "\n",
  );
  process.exit(0);
}

if (args.includes("--emotions")) {
  process.stdout.write(
    JSON.stringify(manifest.emotion_definitions, null, 2) + "\n",
  );
  process.exit(0);
}

const emotionArg = args.find((arg) => arg.startsWith("--emotion="));
const emotion = emotionArg ? emotionArg.split("=").slice(1).join("=") : "identity";
const query = args
  .filter((arg) => !arg.startsWith("--"))
  .join(" ")
  .trim();

if (!query) {
  fail(
    'Usage: node scripts/voice-lookup.mjs "SD_VOICE_03 — Nathan Cole" [--emotion=calm]\n' +
      "       node scripts/voice-lookup.mjs --list\n" +
      "       node scripts/voice-lookup.mjs --emotions",
  );
}

if (
  emotion !== "identity" &&
  !Object.prototype.hasOwnProperty.call(manifest.emotion_definitions, emotion)
) {
  fail(
    `Unknown emotion "${emotion}". Valid: identity, ${Object.keys(
      manifest.emotion_definitions,
    ).join(", ")}`,
    2,
  );
}

const q = normalize(query);
const voices = manifest.voices;
let voice = voices.find((item) => normalize(item.voice_id) === q);
if (!voice) {
  voice = voices.find((item) => normalize(item.voice_name) === q);
}
if (!voice) {
  voice = voices.find(
    (item) => normalize(`${item.voice_id} ${item.voice_name}`) === q,
  );
}
if (!voice) {
  const prefixMatches = voices.filter(
    (item) =>
      normalize(item.voice_id).startsWith(q) ||
      normalize(item.voice_name).startsWith(q),
  );
  if (prefixMatches.length === 1) {
    voice = prefixMatches[0];
  } else if (prefixMatches.length > 1) {
    fail(
      `Voice query "${query}" is ambiguous: ${prefixMatches
        .map((item) => `${item.voice_id} — ${item.voice_name}`)
        .join(", ")}. Use the permanent ID.`,
      2,
    );
  }
}
if (!voice) {
  fail(
    `Voice "${query}" not found. Available: ${voices
      .map((item) => `${item.voice_id} — ${item.voice_name}`)
      .join(", ")}. No substitute voice was selected.`,
    2,
  );
}

const publicPath = voice.audio_file_paths[emotion];
const file = voice.files[emotion];
if (!publicPath || !file) {
  fail(
    `Voice ${voice.voice_id} has no "${emotion}" asset. Regenerate the library; do not substitute another voice.`,
    2,
  );
}

const absolutePath = resolve(ROOT, "public", publicPath);
if (!existsSync(absolutePath)) {
  fail(
    `Asset for ${voice.voice_id} / ${emotion} is missing: ${absolutePath}. Do not substitute another voice.`,
    2,
  );
}

process.stdout.write(
  JSON.stringify(
    {
      query,
      voice_id: voice.voice_id,
      voice_name: voice.voice_name,
      gender: voice.gender,
      vocal_register: voice.vocal_register,
      vocal_texture: voice.vocal_texture,
      accent: voice.accent,
      personality: voice.personality,
      primary_emotion: voice.primary_emotion,
      speaking_speed: voice.speaking_speed,
      emotion,
      public_path: publicPath,
      absolute_path: absolutePath,
      exists: true,
      duration_seconds: file.duration_seconds,
      sample_rate_hz: file.sample_rate_hz,
      bit_depth: file.bit_depth,
      channels: file.channels,
      loudness_lufs: file.loudness_lufs,
      true_peak_dbtp: file.true_peak_dbtp,
      usage: voice.usage_instructions,
    },
    null,
    2,
  ) + "\n",
);
