#!/usr/bin/env node
/**
 * QC gate for the Coinbase × Cursor deliverables.
 * Usage: node scripts/check-coinbase.mjs
 */
import { execFileSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const targets = [
  { file: "out/CoinbaseCaseStudy.mp4", width: 1080, height: 1920 },
  { file: "out/CoinbaseCaseStudyWide.mp4", width: 1920, height: 1080 },
];

const probe = (file, args) =>
  execFileSync("ffprobe", ["-v", "error", ...args, file], {
    encoding: "utf8",
  }).trim();

let failed = false;
for (const target of targets) {
  const path = resolve(target.file);
  if (!existsSync(path)) {
    console.error(`MISSING  ${target.file}`);
    failed = true;
    continue;
  }
  const streams = JSON.parse(
    probe(path, [
      "-show_entries",
      "stream=codec_type,width,height,r_frame_rate",
      "-of",
      "json",
    ]),
  ).streams;
  const video = streams.find((s) => s.codec_type === "video");
  const audio = streams.find((s) => s.codec_type === "audio");
  const duration = Number(
    probe(path, ["-show_entries", "format=duration", "-of", "csv=p=0"]),
  );
  const checks = [
    ["video", Boolean(video)],
    ["audio", Boolean(audio)],
    ["width", video?.width === target.width],
    ["height", video?.height === target.height],
    ["fps", video?.r_frame_rate === "30/1"],
    ["duration", Math.abs(duration - 94) < 0.12],
  ];
  const ok = checks.every(([, pass]) => pass);
  if (!ok) failed = true;
  const sizeMb = (statSync(path).size / 1024 / 1024).toFixed(1);
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${target.file}  ${video?.width}×${video?.height}  ${video?.r_frame_rate}  ${duration.toFixed(3)}s  ${sizeMb} MB`,
  );
  for (const [name, pass] of checks) {
    if (!pass) console.log(`      failed: ${name}`);
  }
}

const cues = resolve("public/audio/episodes/coinbase/voice.cues.json");
const vtt = resolve("public/audio/episodes/coinbase/voice.vtt");
for (const file of [cues, vtt]) {
  if (!existsSync(file)) {
    console.error(`MISSING  ${file}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
