import { BRAND, C, EP, FONT, STAGE, useStage } from "./presets/editorialPop";

export { C, FONT, STAGE, useStage };

/**
 * WALMART — THE CHICKEN PURSE THAT SOLD OUT IN 90 MINUTES
 *
 * An 80-second vertical case study about Walmart's limited-edition rotisserie
 * Chicken Purse (National Chicken Month, Sept. 1, 2026).
 *
 * Editorial rules:
 * — All product photography and the Walmart marks are official Walmart
 *   corporate press assets, used here for an editorial case study.
 * — The social feed is an illustrative reconstruction. Quotes are paraphrased,
 *   never presented as verbatim customer posts.
 * — Every number on screen traces to Walmart's press release or Marketing Brew:
 *   $5.97, 5,000 units, 90 minutes, 15,000 social mentions, two flavors.
 */

export const WC = {
  fps: EP.fps,
  durationSeconds: 80,
  durationFrames: 2400,
  width: EP.width,
  height: EP.height,
} as const;


export const IMG = {
  purseTraditional: "images/walmart-chicken/purse-2.png",
  purseLemon: "images/walmart-chicken/purse-1.png",
  lead: "images/walmart-chicken/lead.png",
  leadCutout: "images/walmart-chicken/lead-cutout.png",
  purseTraditionalCutout: "images/walmart-chicken/purse-2-cutout.png",
  purseLemonCutout: "images/walmart-chicken/purse-1-cutout.png",
  charmTraditional: "images/walmart-chicken/purse-3.png",
  charmLemon: "images/walmart-chicken/purse-4.png",
  chicken: "images/walmart-chicken/rotisserie.jpg",
  deli: "images/walmart-chicken/walmart-deli.jpg",
  aisle: "images/walmart-chicken/walmart-aisle.jpg",
  needle: "images/walmart-chicken/needle.jpg",
  walk: "images/walmart-chicken/walk-1.jpg",
  bagPrint: "images/walmart-chicken/bag-traditional-crop-cutout.png",
  bagPrintLemon: "images/walmart-chicken/bag-lemon-crop-cutout.png",
  spark: BRAND.spark,
  wordmark: BRAND.wordmark,
} as const;

export const COPY = {
  hook: ["THIS CHICKEN BAG", "SOLD OUT?!"],
  hookTag: "WALMART'S ROTISSERIE CHICKEN PURSE",
  storyHead: ["PEOPLE CARRIED", "THE BAG LIKE", "A PURSE."],
  socialHead: "SOCIAL LISTENING",
  socialCount: 15000,
  socialNote: "ILLUSTRATIVE RECREATION · PUBLIC POSTS PARAPHRASED",
  listenHead: ["THE INTERNET", "CALLED IT", "A PURSE."],
  decisionHead: ["WHAT IF", "WE MADE", "ONE?"],
  specHead: ["SAME TYPE.", "SAME COLORS.", "SAME CHICKEN."],
  sketchHead: ["THE SPEC", "BECAME", "A PRODUCT."],
  fabricHead: ["REAL FABRIC.", "REAL ZIPPER.", "REAL STRAP."],
  flavorsHead: ["TWO", "FLAVORS."],
  priceHead: "THE PRICE",
  samePrice: "SAME AS THE CHICKEN.",
  compareHead: ["SAME ENERGY.", "DIFFERENT BUDGET."],
  dropHead: ["5,000", "PURSES."],
  dropLine: "ONE DROP · SEPT 1 · 8 A.M. ET",
  charmsHead: "PLUS BAG CHARMS",
  viralHead: "IT WENT LIVE.",
  soldOut: "SOLD OUT",
  minutes: "90 MINUTES",
  resaleHead: ["RESALE", "LISTINGS", "7×+"],
  endingOne: ["SOMETIMES, YOUR", "NEXT BIG PRODUCT", "ISN'T HIDING", "IN A BOARDROOM."],
  endingTwo: ["IT'S HIDING INSIDE", "A CUSTOMER JOKE."],
  lesson: ["LISTEN TO", "YOUR CUSTOMERS."],
  cta: "WOULD YOU CARRY THIS PURSE?",
} as const;

export type SceneId = "hook" | "story" | "build" | "price" | "viral" | "ending";

export type SceneDef = {
  id: SceneId;
  title: string;
  startSeconds: number;
  endSeconds: number;
  startFrame: number;
  durationFrames: number;
};

const frame = (seconds: number) => Math.round(seconds * WC.fps);

const scene = (
  id: SceneId,
  title: string,
  startSeconds: number,
  endSeconds: number,
): SceneDef => ({
  id,
  title,
  startSeconds,
  endSeconds,
  startFrame: frame(startSeconds),
  durationFrames: frame(endSeconds) - frame(startSeconds),
});

export const SCENES: SceneDef[] = [
  scene("hook", "THIS CHICKEN BAG SOLD OUT", 0, 5),
  scene("story", "THE INTERNET CALLED IT A PURSE", 5, 20),
  scene("build", "THE JOKE BECOMES A PRODUCT", 20, 40),
  scene("price", "FIVE NINETY-SEVEN", 40, 55),
  scene("viral", "SOLD OUT IN 90 MINUTES", 55, 70),
  scene("ending", "LISTEN TO YOUR CUSTOMERS", 70, 80),
];
