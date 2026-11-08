#!/usr/bin/env node
/**
 * Merge an episode's local asset provenance into public/asset-manifest.json.
 * Existing entries are preserved; only missing paths are appended.
 */
import fs from "node:fs";
import process from "node:process";

const episodePath = process.argv[2];
if (!episodePath) {
  console.error("Usage: node voice/scripts/update_asset_manifest.mjs <episode.json>");
  process.exit(2);
}
const episode = JSON.parse(fs.readFileSync(episodePath, "utf8"));
const manifestPath = "public/asset-manifest.json";
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const existing = new Set(manifest.assets.map((asset) => asset.path));
let added = 0;
for (const asset of episode.assets || []) {
  if (!asset?.path || existing.has(asset.path)) continue;
  manifest.assets.push(asset);
  existing.add(asset.path);
  added += 1;
}
manifest.updatedFor = `${manifest.updatedFor || "Simpledeav Studio"} + ${episode.title || episode.episodeId}`;
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Added ${added} asset(s) to ${manifestPath}`);
