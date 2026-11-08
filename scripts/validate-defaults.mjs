#!/usr/bin/env node
/**
 * Guards the shared defaults so future episodes cannot quietly fork them.
 *
 * Checks the audio preset, the sign-off, and that every episode still routes
 * through the single closing-screen component. Rendering is never involved.
 */
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let failures = 0;
const ok = (label, detail = "") => console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
const fail = (label, detail = "") => {
  failures += 1;
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
};
const read = (path) => readFileSync(join(ROOT, path), "utf8");

console.log("\nSIMPLEDEAV DEFAULTS\n");

// ------------------------------------------------------------------- files
for (const file of ["defaults/README.md", "defaults/audio.md", "defaults/audio-preset.json", "defaults/brand-signoff.md"]) {
  if (existsSync(join(ROOT, file))) ok(`present: ${file}`);
  else fail(`missing: ${file}`);
}

// ------------------------------------------------------------------ preset
let preset;
try {
  preset = JSON.parse(read("defaults/audio-preset.json"));
  ok("audio preset parses", `${preset.id} v${preset.version}`);
} catch (error) {
  fail("audio preset does not parse", String(error));
}

if (preset) {
  if (preset.voice?.voice === "en-US-BrianMultilingualNeural") ok("default voice is Brian Multilingual");
  else fail("default voice changed", preset.voice?.voice);
  if (preset.voice?.rate === "+8%" && preset.voice?.pitch === "-2Hz") ok("default delivery is +8% / -2Hz");
  else fail("delivery settings changed");
  if (Array.isArray(preset.voice?.postChain) && preset.voice.postChain.length >= 6) {
    ok("narration processing chain documented", `${preset.voice.postChain.length} stages`);
  } else fail("narration chain incomplete");
  if (preset.voice?.output?.integratedLufs === -16) ok("narration target is -16 LUFS");
  else fail("narration loudness target changed");
  if (preset.music?.mix?.duckDepth === 0.54) ok("music duck depth is 54%");
  else fail("duck depth changed", String(preset.music?.mix?.duckDepth));
  if (preset.music?.mix?.neverAboveLinear <= 0.25) ok("music ceiling is 0.25 linear or lower");
  else fail("music ceiling too hot");
  if (preset.sfx?.globalGain === 0.62) ok("SFX headroom gain is 0.62");
  else fail("SFX gain changed", String(preset.sfx?.globalGain));
  if (preset.voice?.mixGainInRemotion === 0.92) ok("narration mix gain is 0.92");
  else fail("narration mix gain changed");
  if (Array.isArray(preset.sfx?.palette) && preset.sfx.palette.length >= 8) {
    ok("SFX role palette documented", `${preset.sfx.palette.length} roles`);
  } else fail("SFX palette incomplete");
  if (Array.isArray(preset.qualityGates) && preset.qualityGates.length >= 4) ok("quality gates documented");
  else fail("quality gates missing");
}

// ---------------------------------------------------------------- wiring
const presetTs = read("src/config/audioPreset.ts");
if (presetTs.includes("defaults/audio-preset.json")) ok("src/config/audioPreset.ts reads the shared preset");
else fail("audioPreset.ts is not wired to the preset");

const audioTs = read("src/config/audio.ts");
if (audioTs.includes("defaults/audio-preset.json")) ok("shared AUDIO_DEFAULTS derive from the preset");
else fail("AUDIO_DEFAULTS no longer derive from the preset");

const score = read("src/components/audio/AirbnbScore.tsx");
for (const token of ["SFX_GAIN", "VOICE_GAIN", "DUCK_DEPTH"]) {
  if (score.includes(token)) ok(`reference score uses ${token}`);
  else fail(`reference score does not use ${token}`);
}

// ------------------------------------------------------------- end screen
const signOff = read("src/components/branding/SimpledeavSignOff.tsx");
if (signOff.includes("avatarHidden") && signOff.includes("finePrint")) ok("sign-off exposes the documented props");
else fail("sign-off props drifted");

const social = read("src/components/branding/SocialEndCard.tsx");
if (social.includes('from "./SimpledeavSignOff"')) ok("SocialEndCard delegates to the default sign-off");
else fail("SocialEndCard is no longer the adapter");

const renderer = read("src/components/scenes/SceneRenderer.tsx");
if (renderer.includes("SocialEndCard")) ok("SceneRenderer uses the default end card");
else fail("SceneRenderer bypasses the default end card");
if (!renderer.includes("SimpledeavSignature")) ok("SceneRenderer no longer forks the old inline signature");
else fail("SceneRenderer still branches to the legacy signature");

const lego = read("src/compositions/LegoCaseStudy.tsx");
if (lego.includes("SocialEndCard")) ok("Lego composition uses the default end card");
else fail("Lego composition bypasses the end card");

const airbnb = read("src/components/airbnb/scenes/SceneLesson.tsx");
if (airbnb.includes("SimpledeavSignOff")) ok("Airbnb composition uses the default sign-off");
else fail("Airbnb composition bypasses the sign-off");

// --------------------------------------------------------------- docs
const readme = read("README.md");
if (readme.includes("defaults/audio.md") && readme.includes("defaults/brand-signoff.md")) {
  ok("README points at both defaults");
} else fail("README missing defaults links");

const template = read("docs/TEMPLATE-GUIDE.md");
if (template.includes("defaults/brand-signoff.md")) ok("template guide points at the sign-off spec");
else fail("template guide missing sign-off spec");

console.log(
  failures === 0
    ? "\nDefaults are intact. Use them unchanged for the next video.\n"
    : `\n${failures} defaults check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
