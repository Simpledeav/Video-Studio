import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";
import fs from "node:fs";

const root = process.cwd();
const outDir = path.join(root, "out/qa");
fs.mkdirSync(outDir, { recursive: true });

const frames = [
  45, 90, 135, 205,
  225, 300, 430,
  480, 600, 750,
  810, 900, 1040, 1130,
  1170, 1260, 1400,
  1470, 1560, 1620, 1700, 1890, 2000, 2070,
  2090, 2160, 2280, 2390,
  2410, 2500, 2610,
];

const serveUrl = await bundle({ entryPoint: path.join(root, "src/index.ts") });

for (const id of ["BankTransfer", "BankTransferWide"]) {
  const composition = await selectComposition({ serveUrl, id });
  for (const frame of frames) {
    const output = path.join(outDir, `${id === "BankTransfer" ? "v" : "w"}-${String(frame).padStart(4, "0")}.png`);
    await renderStill({ composition, serveUrl, output, frame, imageFormat: "png" });
    console.log(output);
  }
}

const cover = await selectComposition({ serveUrl, id: "BankTransferCover" });
await renderStill({
  composition: cover,
  serveUrl,
  output: path.join(outDir, "cover.png"),
  frame: 0,
  imageFormat: "png",
});
console.log("cover done");
