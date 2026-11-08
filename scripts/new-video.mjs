#!/usr/bin/env node
/**
 * Scaffold a per-video writing record from memory/templates/video-record.
 *
 * Usage:
 *   npm run new:video -- --slug my-video --title "My Video"
 *   npm run new:video -- --slug my-video --title "My Video" --preset walmart --voice SD_VOICE_09
 *
 * Creates videos/<slug>/ with prompt.md, description.md, social captions and
 * metadata.json. It never touches src/ and never renders anything.
 */
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATE = resolve(ROOT, "memory/templates/video-record");
const VOICE_FILE = resolve(ROOT, "memory/voice/default.json");

const fail = (message) => {
  process.stderr.write(`\n${message}\n\n`);
  process.exit(1);
};

const parseArgs = (argv) => {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith("--")) {
      out[key] = true;
      continue;
    }
    out[key] = value;
    i += 1;
  }
  return out;
};

const titleCase = (slug) =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

const pascalCase = (value) =>
  value
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

const today = () => {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const walk = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });

const args = parseArgs(process.argv.slice(2));
const slug = String(args.slug ?? "").trim().toLowerCase();

if (!slug) fail("Missing --slug. Example: npm run new:video -- --slug my-video");
if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  fail(`Invalid slug "${slug}". Use lowercase letters, numbers and hyphens.`);
}
if (!existsSync(TEMPLATE)) fail(`Template not found: ${TEMPLATE}`);
if (!existsSync(VOICE_FILE)) fail(`Voice memory not found: ${VOICE_FILE}`);

const voiceMemory = JSON.parse(readFileSync(VOICE_FILE, "utf8"));
const preset = String(args.preset ?? "house").trim();
if (!["house", "walmart"].includes(preset)) {
  fail(`Unknown preset "${preset}". Use "house" or "walmart".`);
}

const voice = String(args.voice ?? voiceMemory.default).trim();
const knownVoices = voiceMemory.voices.map((item) => item.id);
if (!knownVoices.includes(voice)) {
  fail(`Unknown voice "${voice}". Use one of: ${knownVoices.join(", ")}.`);
}

const title = String(args.title ?? titleCase(slug)).trim();
const composition = String(args.composition ?? pascalCase(title));
const description =
  String(args.description ?? "").trim() ||
  `A short description of ${title}. Replace this placeholder with 2-4 sentences on the story, the turn and the visual system.`;
const prompt =
  String(args.prompt ?? "").trim() ||
  `Paste the user's actual prompt here, verbatim.\n\nTitle: ${title}\nPreset: ${preset}\nVoice: ${voice}`;

const target = resolve(ROOT, "videos", slug);
if (existsSync(target)) {
  fail(`Video record already exists: ${relative(ROOT, target)}`);
}

mkdirSync(target, { recursive: true });
cpSync(TEMPLATE, target, { recursive: true });

const replacements = {
  "{{SLUG}}": slug,
  "{{TITLE}}": title,
  "{{DATE}}": today(),
  "{{PRESET}}": preset,
  "{{VOICE}}": voice,
  "{{PROMPT}}": prompt,
  "{{DESCRIPTION}}": description,
  "{{COMPOSITION}}": composition,
  "{{LINKEDIN_CAPTION}}": "[Write the LinkedIn caption here: lead with the business lesson.]",
  "{{X_CAPTION}}": "[Write the X caption here: one idea, one turn, 280 characters max.]",
  "{{TIKTOK_CAPTION}}": "[Write the TikTok caption here: hook, curiosity, payoff.]",
  "{{INSTAGRAM_CAPTION}}": "[Write the Instagram caption here: visual-first, one saveable takeaway.]",
};

for (const file of walk(target)) {
  const text = readFileSync(file, "utf8");
  let next = text;
  for (const [token, value] of Object.entries(replacements)) {
    next = next.split(token).join(value);
  }
  writeFileSync(file, next);
}

// metadata.json is the only file that needs a structured rewrite: keep the
// generated values consistent even if the template changes.
const metadataPath = join(target, "metadata.json");
const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
metadata.slug = slug;
metadata.title = title;
metadata.created = today();
metadata.preset = preset;
metadata.voice = voice;
metadata.compositions = {
  vertical: composition,
  horizontal: `${composition}Wide`,
  cover: `${composition}Cover`,
};
writeFileSync(metadataPath, `${JSON.stringify(metadata, null, 2)}\n`);

process.stdout.write(
  [
    "",
    `Created ${relative(ROOT, target)}/`,
    "",
    `  prompt.md       the user's prompt`,
    `  description.md  short film description`,
    `  social/         linkedin, x, tiktok, instagram`,
    `  metadata.json   ${composition}, ${composition}Wide, ${composition}Cover`,
    "",
    `Preset: ${preset}`,
    `Voice:  ${voice}`,
    "",
    "Next: fill the prompt and captions, then build the film.",
    "Do not render. Preview in Studio.",
    "",
  ].join("\n"),
);
