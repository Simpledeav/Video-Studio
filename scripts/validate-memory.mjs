#!/usr/bin/env node
/**
 * Validate the memory layer and the project's non-negotiable defaults.
 * This is a text/JSON check only. It never renders or starts a server.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [];
const checks = [];

const readJson = (path) => {
  const full = resolve(ROOT, path);
  if (!existsSync(full)) {
    errors.push(`Missing JSON file: ${path}`);
    return null;
  }
  try {
    return JSON.parse(readFileSync(full, "utf8"));
  } catch (error) {
    errors.push(`Invalid JSON in ${path}: ${error.message}`);
    return null;
  }
};

const requireFile = (path) => {
  if (!existsSync(resolve(ROOT, path))) errors.push(`Missing file: ${path}`);
};

const check = (name, condition, detail) => {
  checks.push({ name, ok: Boolean(condition), detail });
  if (!condition) errors.push(`${name}${detail ? ` — ${detail}` : ""}`);
};

// Required files
[
  "AGENTS.md",
  "README.md",
  "memory/README.md",
  "memory/index.json",
  "memory/voice/README.md",
  "memory/voice/default.json",
  "memory/voice/voices/SD_VOICE_03.md",
  "memory/design/README.md",
  "memory/design/house-style.md",
  "memory/design/tokens.json",
  "memory/presets/README.md",
  "memory/presets/house/style.json",
  "memory/presets/house/README.md",
  "memory/presets/walmart/style.json",
  "memory/presets/walmart/README.md",
  "memory/brand/README.md",
  "memory/brand/signoff.json",
  "memory/process/rules.md",
  "memory/process/video-creation.md",
  "memory/process/video-record.md",
  "memory/process/qa.md",
  "memory/assets/README.md",
  "memory/templates/video-record/prompt.md",
  "memory/templates/video-record/description.md",
  "memory/templates/video-record/metadata.json",
  "memory/templates/video-record/social/linkedin.md",
  "memory/templates/video-record/social/x.md",
  "memory/templates/video-record/social/tiktok.md",
  "memory/templates/video-record/social/instagram.md",
  "memory/templates/voice-segments.json",
  "videos/README.md",
  "public/audio/voice-library/manifest.json",
].forEach(requireFile);

// Index and defaults
const index = readJson("memory/index.json");
if (index) {
  check("index schemaVersion is 1.0.0", index.schemaVersion === "1.0.0");
  check("default voice is SD_VOICE_03", index.defaults?.voice?.id === "SD_VOICE_03");
  check(
    "no alternate voice is configured",
    !index.defaults?.alternateVoice || index.defaults.alternateVoice.id === "SD_VOICE_03",
  );
  check("default preset is house", index.defaults?.preset?.id === "house");
  check("alternate preset is walmart", index.defaults?.alternatePreset?.id === "walmart");
  check("rendering is browser-only", index.defaults?.rendering?.browserPreviewOnly === true);
  check("MP4 rendering is disabled", index.defaults?.rendering?.renderMp4 === false);
  check("4K rendering is disabled", index.defaults?.rendering?.render4k === false);

  const formats = Array.isArray(index.defaults?.formats) ? index.defaults.formats : [];
  const byId = Object.fromEntries(formats.map((item) => [item.id, item]));
  check("vertical is 1080x1920", byId.vertical?.width === 1080 && byId.vertical?.height === 1920);
  check("horizontal is 1920x1080", byId.horizontal?.width === 1920 && byId.horizontal?.height === 1080);
  check("cover is 1080x1350", byId.cover?.width === 1080 && byId.cover?.height === 1350);
  check("cover is one frame", byId.cover?.durationInFrames === 1);
  check(
    "no 4K format",
    formats.every((item) => item.width < 3840 && item.height < 3840),
  );
}

// Voice memory
const voice = readJson("memory/voice/default.json");
if (voice) {
  check("voice default is SD_VOICE_03", voice.default === "SD_VOICE_03");
  check("voice alternate is SD_VOICE_03", voice.alternate === "SD_VOICE_03");
  const ids = (voice.voices ?? []).map((item) => item.id);
  check("voice file lists SD_VOICE_03", ids.includes("SD_VOICE_03"));
  check("voice file lists no other voice", ids.every((id) => id === "SD_VOICE_03"));
  check(
    "voice files have audio paths",
    (voice.voices ?? []).every(
      (item) =>
        typeof item.publicPathPattern === "string" &&
        item.publicPathPattern.startsWith("audio/voice-library/"),
    ),
  );
}

// Curated manifest
const manifest = readJson("public/audio/voice-library/manifest.json");
if (manifest) {
  const ids = (manifest.voices ?? []).map((item) => item.voice_id);
  check("manifest contains SD_VOICE_03", ids.includes("SD_VOICE_03"));
  check("manifest contains no other voice", ids.every((id) => id === "SD_VOICE_03"));
  check("manifest has no fallback", manifest.selection?.fallback === "none");
}

// Presets
const house = readJson("memory/presets/house/style.json");
if (house) {
  check("house preset id", house.id === "house");
  check("house preset voice", house.voice?.default === "SD_VOICE_03");
}
const walmart = readJson("memory/presets/walmart/style.json");
if (walmart) {
  check("walmart preset id", walmart.id === "walmart");
  check("walmart preset aliases editorial-pop", (walmart.aliases ?? []).includes("editorial-pop"));
  check("walmart preset voice", walmart.voice?.default === "SD_VOICE_03");
  check("walmart preset has palette", Boolean(walmart.palette?.roles));
  check("walmart preset has scene spine", Boolean(walmart.sceneSpine));
}

// Design tokens
const tokens = readJson("memory/design/tokens.json");
if (tokens) {
  check("house tokens id", tokens.id === "house");
  check("house tokens have palette", Boolean(tokens.palette?.cyan));
  check("house tokens have motion", Boolean(tokens.motion?.easing?.easeOut));
}

// Brand
const signoff = readJson("memory/brand/signoff.json");
if (signoff) {
  check("brand default is aurora", signoff.default === "aurora");
  check("brand has five templates", (signoff.templates ?? []).length === 5);
}

// Package scripts
const pkg = readJson("package.json");
if (pkg) {
  check("package has new:video", Boolean(pkg.scripts?.["new:video"]));
  check("package has check:memory", Boolean(pkg.scripts?.["check:memory"]));
  check("package has voice:lookup", Boolean(pkg.scripts?.["voice:lookup"]));
}

// Gitignore policy
const gitignorePath = resolve(ROOT, ".gitignore");
if (existsSync(gitignorePath)) {
  const gitignore = readFileSync(gitignorePath, "utf8");
  [
    "node_modules/",
    "out/",
    "public/audio/**/*.wav",
    "public/audio/**/*.mp3",
    "public/images/**",
    "public/video/**",
    "models/",
    ".venv",
  ].forEach((pattern) => {
    check(`gitignore contains ${pattern}`, gitignore.includes(pattern));
  });
} else {
  errors.push("Missing .gitignore");
}

// Report
const failed = checks.filter((item) => !item.ok);
if (failed.length === 0 && errors.length === 0) {
  process.stdout.write(
    `\nmemory OK — ${checks.length} checks passed.\n` +
      "Default voice: SD_VOICE_03. Default preset: house. Formats: vertical, horizontal, cover.\n" +
      "Rendering: disabled. Git: heavy media ignored.\n\n",
  );
  process.exit(0);
}

process.stderr.write("\nmemory validation failed:\n");
for (const error of errors) process.stderr.write(`  - ${error}\n`);
process.stderr.write("\n");
process.exit(1);
