import { useVideoConfig } from "remotion";

/**
 * LIQUID DEATH — THE MAN WHO MADE WATER LOOK LIKE BEER
 *
 * A 90-second premium business documentary. One master timeline, two
 * recompositions (16:9 and 9:16) and a standalone 16:9 cover.
 *
 * Editorial rules:
 * — Real Liquid Death packaging only. No invented logo or substitute product.
 * — Mike Cessario's press photograph is credited on screen.
 * — The early social feed is explicitly labelled as a reconstruction.
 * — Shipping-cost figures are attributed as reported, never presented as audited.
 */

export const LD = {
  fps: 30,
  durationSeconds: 90,
  durationFrames: 2700,
  /** The Simpledeav close begins after the final narration word. */
  signOffStartFrame: 2610,
  wide: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
} as const;

export const C = {
  black: "#050506",
  bg: "#08090B",
  graphite: "#0D0E11",
  graphite2: "#121317",
  panel: "rgba(18, 19, 23, 0.86)",
  panelSoft: "rgba(23, 24, 29, 0.62)",
  white: "#F4F4F1",
  silver: "#CDD1D5",
  aluminium: "#A7ADB4",
  muted: "#8A8E94",
  dim: "#565B61",
  line: "rgba(244, 244, 241, 0.12)",
  lineSoft: "rgba(244, 244, 241, 0.055)",
  red: "#D21F35",
  redBright: "#F0334B",
  redSoft: "rgba(210, 31, 53, 0.14)",
  redGhost: "rgba(210, 31, 53, 0.055)",
  amber: "#D8A45A",
  green: "#66C79A",
  shadow: "rgba(0, 0, 0, 0.62)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export const IMG = {
  still: "images/liquid-death/still-can-hi.webp",
  sparkling: "images/liquid-death/sparkling-official.webp",
  mango: "images/liquid-death/mango-cut.png",
  grave: "images/liquid-death/grave-fruit-cut.png",
  lime: "images/liquid-death/lime-cut.png",
  logoHorizontal: "images/liquid-death/logo-mask.png",
  logoSvg: "images/liquid-death/logo.svg",
  skull: "images/liquid-death/skull-mask.png",
  founder: "images/liquid-death/founder-cnbc.jpg",
  campaign: "images/liquid-death/campaign-mountain.jpg",
  worldMap: "images/liquid-death/world-map.svg",
  energyBanner: "images/liquid-death/energy-banner.jpg",
  event: "images/liquid-death/event.webp",
} as const;

export type SceneId =
  | "impossible"
  | "aisle"
  | "idea"
  | "problem"
  | "attention"
  | "shipping"
  | "lesson"
  | "finale";

export type SceneDef = {
  id: SceneId;
  title: string;
  startFrame: number;
  durationFrames: number;
  startSeconds: number;
  endSeconds: number;
};

const frame = (seconds: number) => Math.round(seconds * LD.fps);

const scene = (
  id: SceneId,
  title: string,
  startSeconds: number,
  endSeconds: number,
): SceneDef => ({
  id,
  title,
  startFrame: frame(startSeconds),
  durationFrames: frame(endSeconds) - frame(startSeconds),
  startSeconds,
  endSeconds,
});

/** Cuts follow the real narration timings in voice.words.json. */
export const SCENES: SceneDef[] = [
  scene("impossible", "THE IMPOSSIBLE PRODUCT", 0, 7.0),
  scene("aisle", "THE WATER AISLE WAS BORING", 7.0, 17.1),
  scene("idea", "THE CRAZY IDEA", 17.1, 28.0),
  scene("problem", "NO EASY MANUFACTURING", 28.0, 42.0),
  scene("attention", "ATTENTION FIRST", 42.0, 55.0),
  scene("shipping", "THE HIDDEN COST", 55.0, 69.5),
  scene("lesson", "THE REAL LESSON", 69.5, 81.0),
  scene("finale", "THE PUNCHLINE", 81.0, 87.0),
];

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown Liquid Death scene: ${id}`);
  return found;
};

export type Stage = {
  wide: boolean;
  width: number;
  height: number;
  margin: number;
  captionBottom: number;
  /** Resolve a 9:16-aware size. */
  v: (portrait: number, wideValue?: number) => number;
};

export const useStage = (): Stage => {
  const { width, height } = useVideoConfig();
  const wide = width > height;
  return {
    wide,
    width,
    height,
    margin: wide ? 104 : 64,
    captionBottom: wide ? 44 : 158,
    v: (portrait, wideValue = portrait) => (wide ? wideValue : portrait),
  };
};

export const COPY = {
  title: ["LIQUID", "DEATH"],
  tagline: "IT'S JUST WATER.",
  founder: "MIKE CESSARIO",
  founderRole: "FOUNDER, LIQUID DEATH",
  founderCredit: "PHOTO: CNBC",
  aisle: ["THE WATER AISLE", "WAS BORING."],
  idea: "MURDER YOUR THIRST.",
  problem: ["NO EASY", "MANUFACTURING."],
  demand: ["NO GUARANTEED", "DEMAND."],
  attention: ["ATTENTION FIRST.", "PRODUCT NEXT."],
  costFrom: "$4,000",
  costTo: "$13,000",
  costNote:
    "Reported container-cost increase during the COVID shipping disruption. Figure as reported, not an audited company statement.",
  losses: ["MORE SALES.", "MORE LOSSES."],
  lesson: ["THE PRODUCT WAS WATER.", "THE DIFFERENTIATION", "WAS THE BRAND."],
  final: ["DON'T JUST SELL", "A PRODUCT."],
  finalAccent: ["BUILD A BRAND", "PEOPLE REMEMBER."],
  coverHeadline: ["HE MADE WATER", "LOOK COOL."],
  coverSub: "THE LIQUID DEATH STORY",
  coverKicker: "A BUSINESS CASE STUDY",
  disclaimer: "Editorial reconstruction. Product imagery © Liquid Death.",
} as const;

/**
 * Beat map inside each scene, scene-local seconds. Picture and sound are cut
 * against this one clock.
 */
export const BEATS = {
  impossible: {
    canIn: 0.25,
    reveal: 1.55,
    tagline: 2.7,
    open: 4.35,
    pour: 4.95,
    flash: 6.65,
  },
  aisle: {
    wall: 0.15,
    headline: 0.7,
    shift: 4.15,
    energy: 4.5,
    founder: 6.55,
    credit: 7.2,
  },
  idea: {
    notebook: 0.2,
    scribble: 1.2,
    logo: 2.6,
    can: 4.2,
    tagline: 7.0,
    hold: 9.4,
  },
  problem: {
    line: 0.2,
    cans: 1.0,
    docs: 4.4,
    funding: 8.0,
    pitch: 10.8,
  },
  attention: {
    feed: 0.2,
    video: 1.4,
    heat: 3.0,
    enquiries: 5.2,
    shelf: 8.2,
    headline: 9.2,
  },
  shipping: {
    map: 0.2,
    route: 1.3,
    containers: 2.6,
    cost: 4.4,
    impact: 6.4,
    dashboard: 8.2,
    losses: 11.2,
  },
  lesson: {
    lineup: 0.2,
    shelf: 3.4,
    event: 5.6,
    brand: 7.4,
    statement: 8.4,
  },
  finale: {
    can: 0.15,
    skull: 1.2,
    line1: 2.2,
    line2: 3.1,
    hold: 5.4,
  },
} as const;
