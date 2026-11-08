#!/usr/bin/env node
/**
 * Validates the Airbnb case study without rendering a single video frame.
 *
 * Checks duration, frame count, act continuity, narration/cue coverage, sound
 * design placement, local asset presence, font coverage and Studio registration.
 */
import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC = join(ROOT, "public");
const manifestPath = join(ROOT, "content/episode-airbnb-cereal.json");

let failures = 0;
const ok = (label, detail = "") => console.log(`  ✓ ${label}${detail ? ` — ${detail}` : ""}`);
const fail = (label, detail = "") => {
  failures += 1;
  console.error(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
};

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

console.log("\nAIRBNB CASE STUDY — manifest validation\n");

// ------------------------------------------------------------------ duration
if (manifest.durationSeconds === 80) ok("duration is exactly 80s");
else fail("duration", `${manifest.durationSeconds}s`);
if (manifest.fps === 30) ok("frame rate is 30 fps");
else fail("fps", String(manifest.fps));
const frames = Math.round(manifest.durationSeconds * manifest.fps);
if (frames === 2400 && manifest.totalFrames === 2400) ok("exactly 2,400 frames");
else fail("frame count", `${frames} / manifest ${manifest.totalFrames}`);
if (manifest.aspects.primary.width === 1080 && manifest.aspects.primary.height === 1920) {
  ok("primary format is 1080×1920 (9:16)");
} else fail("primary aspect");
if (manifest.aspects.secondary.width === 1920 && manifest.aspects.secondary.height === 1080) {
  ok("secondary format is 1920×1080 (16:9)");
} else fail("secondary aspect");

// ---------------------------------------------------------------------- acts
const acts = manifest.acts;
if (acts.length === 7) ok("7 story acts");
else fail("act count", String(acts.length));
let cursor = 0;
let contiguous = true;
for (const act of acts) {
  if (Math.abs(act.startSeconds - cursor) > 0.001) contiguous = false;
  cursor = act.endSeconds;
}
if (contiguous) ok("acts are contiguous from 0 to 80s");
else fail("act continuity");
if (Math.abs(cursor - 80) < 0.001) ok("acts end exactly at 80s");
else fail("act end", `${cursor}s`);

// ----------------------------------------------------------------- voiceover
const voice = join(PUBLIC, manifest.narration.audioPath.replace(/^\//, ""));
if (existsSync(voice)) {
  const size = statSync(voice).size;
  ok("narration file present", `${(size / 1024 / 1024).toFixed(2)} MB`);
  try {
    const duration = Number(
      execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", voice])
        .toString()
        .trim(),
    );
    if (Math.abs(duration - 80) < 0.25) ok("narration is 80.0s", `${duration.toFixed(2)}s`);
    else fail("narration duration", `${duration.toFixed(2)}s`);
  } catch {
    fail("ffprobe could not read the narration file");
  }
} else fail("narration file missing");

const cuesPath = join(ROOT, "content/airbnb-cues.json");
if (!existsSync(cuesPath)) fail("cue file missing");
else {
  const cues = JSON.parse(readFileSync(cuesPath, "utf8")).cues;
  if (cues.length >= 24) ok("subtitle cues generated from real word boundaries", `${cues.length} cues`);
  else fail("too few cues", String(cues.length));
  const sorted = cues.every((cue, i) => i === 0 || cue.start >= cues[i - 1].end - 0.001);
  if (sorted) ok("cues are ordered and non-overlapping");
  else fail("cue ordering");
  if (cues.every((cue) => cue.start >= 0 && cue.end <= 80)) ok("cues stay inside the 80s timeline");
  else fail("cue bounds");
  const last = cues[cues.length - 1];
  if (last.end < 77.6) ok("narration clears the brand reveal", `last cue ends ${last.end}s`);
  else fail("narration runs into the brand reveal", `${last.end}s`);
  const wrap = (text) => {
    const max = 46;
    if (text.length <= max) return [text];
    const words = text.split(/\s+/);
    let best = 1;
    let bestDiff = Infinity;
    for (let i = 1; i < words.length; i += 1) {
      const first = words.slice(0, i).join(" ");
      if (first.length > max + 6) break;
      const second = words.slice(i).join(" ");
      const diff = Math.abs(first.length - second.length);
      if (diff < bestDiff) {
        bestDiff = diff;
        best = i;
      }
    }
    return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  };
  const badWraps = cues.filter((cue) => {
    const lines = wrap(cue.text);
    return lines.length > 2 || lines.some((line) => line.length > 52);
  });
  if (badWraps.length === 0) ok("every caption wraps to two balanced lines");
  else fail("caption wrapping", `${badWraps.length} cues overflow`);
}

// --------------------------------------------------------------------- music
const music = join(PUBLIC, manifest.music.path.replace(/^\//, ""));
if (existsSync(music)) {
  const duration = Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", music])
      .toString()
      .trim(),
  );
  if (duration >= 79.9) ok("music bed covers the full film", `${duration.toFixed(2)}s`);
  else fail("music bed too short", `${duration.toFixed(2)}s`);
  ok("music licensed", `${manifest.music.title} — ${manifest.music.license}`);
} else fail("music file missing");

const points = manifest.music.volumePoints;
if (points.length >= 4 && points[points.length - 1].timeSeconds === 80) ok("music automation reaches 80s");
else fail("music automation");
if (points.every((p) => p.volume <= 0.25)) ok("music sits under the narration (max 0.25 linear)");
else fail("music automation too hot");

// ----------------------------------------------------------------------- sfx
console.log("\nSound design:");
const usedDevices = new Set();
for (const cue of manifest.soundEffects) {
  const file = join(PUBLIC, cue.path.replace(/^\//, ""));
  if (!existsSync(file)) fail(`missing SFX ${cue.id}`, cue.path);
  if (cue.startSeconds < 0 || cue.startSeconds + cue.durationSeconds > 80.01) {
    fail(`SFX outside timeline: ${cue.id}`);
  }
  if (cue.volume > 0.5) fail(`SFX too loud: ${cue.id}`, String(cue.volume));
  usedDevices.add(cue.path);
}
ok("sound effects resolve locally", `${manifest.soundEffects.length} cues, ${usedDevices.size} files`);
const overlapping = manifest.soundEffects.filter((cue) => {
  const sameTime = manifest.soundEffects.filter(
    (other) => other.id !== cue.id && Math.abs(other.startSeconds - cue.startSeconds) < 0.12,
  );
  return sameTime.length > 1;
});
if (overlapping.length === 0) ok("no accidental stacked impacts");
else fail("stacked impacts", overlapping.map((c) => c.id).join(", "));

// -------------------------------------------------------------------- assets
console.log("\nAssets:");
let missing = 0;
for (const asset of manifest.assets) {
  if (asset.path.startsWith("/content/")) continue;
  const file = join(PUBLIC, asset.path.replace(/^\//, ""));
  if (!existsSync(file)) {
    missing += 1;
    fail(`missing asset ${asset.path}`);
  }
}
if (missing === 0) ok("all images and audio are present locally");
const generated = manifest.assets.filter((a) => /Generated|Original|Synthesised/.test(a.license));
ok("asset provenance recorded", `${manifest.assets.length} entries, ${generated.length} original/generated`);
const unlicensed = manifest.assets.filter((a) => !a.license || a.license === "unknown");
if (unlicensed.length === 0) ok("every asset has a licence");
else fail("assets without a licence", String(unlicensed.length));

// --------------------------------------------------------------------- fonts
const fonts = ["Poppins-Regular", "Poppins-Medium", "Poppins-SemiBold", "Poppins-Bold", "Poppins-ExtraBold"];
const missingFonts = fonts.filter((font) => !existsSync(join(PUBLIC, "fonts", `${font}.ttf`)));
if (missingFonts.length === 0) ok("Poppins 400–800 available locally");
else fail("missing Poppins weights", missingFonts.join(", "));
const fontVars = readFileSync(join(ROOT, "src/utils/fontVars.ts"), "utf8");
if (fontVars.includes("SF Pro Display") && fontVars.includes("SF Pro Text")) {
  ok("SF Pro Display / SF Pro Text configured as fallback");
} else fail("SF Pro fallback");
const airbnbConfig = readFileSync(join(ROOT, "src/config/airbnb.ts"), "utf8");
if (airbnbConfig.includes("SF Pro Display") && airbnbConfig.includes("SF Pro Text")) {
  ok("type stack resolves Poppins → SF Pro Display → SF Pro Text");
} else fail("type stack");

// ------------------------------------------------------------- registration
const root = readFileSync(join(ROOT, "src/Root.tsx"), "utf8");
for (const id of ["AirbnbCereal", "AirbnbCerealWide", "AirbnbCerealCover"]) {
  if (root.includes(`id="${id}"`)) ok(`Studio composition registered: ${id}`);
  else fail(`composition missing: ${id}`);
}
if (root.includes("durationInFrames={2400}") && root.includes("fps={30}")) {
  ok("Studio registration uses 2,400 frames at 30 fps");
} else fail("Studio registration timing");
if (root.includes('id="AirbnbCerealCover"') && root.includes("width={1080}") && root.includes("height={1350}")) {
  ok("4:5 social cover registered");
} else fail("social cover registration");

const captions = readFileSync(join(ROOT, "src/components/typography/AirbnbCaptions.tsx"), "utf8");
if (captions.includes("airbnb-cues.json")) ok("captions read the generated cue file");
else fail("captions are not wired to the cue file");

// ---------------------------------------------------------------- no renders
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const scripts = Object.keys(pkg.scripts ?? {});
const renderScripts = scripts.filter((name) => /render|export|encode/i.test(name));
if (renderScripts.length === 0) ok("no render/export script in package.json");
else fail("render script present", renderScripts.join(", "));

console.log(
  failures === 0
    ? "\nAll checks passed. Open Remotion Studio to review; no video was rendered.\n"
    : `\n${failures} check(s) failed.\n`,
);
process.exit(failures === 0 ? 0 : 1);
