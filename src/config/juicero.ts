import { useVideoConfig } from "remotion";

/**
 * JUICERO — THE $120 MILLION JUICE MACHINE THAT DIDN'T NEED TO EXIST.
 *
 * An 90-second premium business documentary with a dry comic edge. The same
 * component renders a genuine 9:16 and 16:9 recomposition. Product objects are
 * built in code so the film stays light. Human scenes are licensed editorial
 * photography, labelled as illustrative reconstruction — never presented as
 * archival Juicero footage.
 *
 * Facts on screen follow the public 2017 reporting: about $120M raised, a $699
 * launch price later reduced to $399, refunds and suspended sales in September
 * 2017, then shutdown. The machine's intended value (consistency, convenience,
 * freshness checks) is stated explicitly so the joke lands on unnecessary
 * complexity, not on a false claim that the product did nothing.
 */

export const JG = {
  fps: 30,
  durationSeconds: 90,
  durationFrames: 2700,
  /** The branded close begins as the final narration lands. */
  signOffStartFrame: 2622,
  portrait: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
} as const;

export type SceneId =
  | "hook"
  | "dream"
  | "millions"
  | "reveal"
  | "collapse"
  | "lesson"
  | "ending";

export type SceneDef = {
  id: SceneId;
  title: string;
  startFrame: number;
  durationFrames: number;
  startSeconds: number;
  endSeconds: number;
};

const frame = (seconds: number) => Math.round(seconds * JG.fps);

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

export const SCENES: SceneDef[] = [
  scene("hook", "THE $400 QUESTION", 0, 7.0),
  scene("dream", "THE STARTUP DREAM", 7.0, 22.5),
  scene("millions", "THE MILLIONS", 22.5, 35.5),
  scene("reveal", "THE INTERNET BREAKS IT", 35.5, 56.0),
  scene("collapse", "THE COLLAPSE", 56.0, 67.5),
  scene("lesson", "THE LESSON", 67.5, 80.5),
  scene("ending", "BUILD SOLUTIONS", 80.5, 90.0),
];

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown Juicero scene: ${id}`);
  return found;
};

export type Stage = {
  wide: boolean;
  width: number;
  height: number;
  margin: number;
  captionBottom: number;
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
    captionBottom: wide ? 34 : 138,
    v: (portrait, wideValue = portrait) => (wide ? wideValue : portrait),
  };
};

export const COPY = {
  product: "JUICERO",
  hook: {
    kicker: "A BUSINESS STORY  ·  2017",
    title1: "THE $120 MILLION",
    title2: "JUICE MACHINE.",
    sub: "THAT DIDN'T NEED TO EXIST.",
    price: "$400",
    priceTail: "FOR THIS?!",
    hand: "YOUR HANDS WERE FREE.",
    freeze: "SYSTEM PAUSED",
  },
  dream: {
    kicker: "SILICON VALLEY  ·  2013",
    title: "MEET JUICERO.",
    sub: "A startup that wanted to reinvent fresh juice.",
    cards: ["CONNECTED JUICE.", "SMART PRESS.", "PREMIUM TECHNOLOGY."],
    tagline: "FRESH JUICE. WITHOUT THE MESS.",
    label: "THE PITCH DECK LOOKED INCREDIBLE.",
  },
  millions: {
    kicker: "THE FUNDING STORY",
    title: "THEY RAISED",
    titleAccent: "$120M.",
    sub: "APPROXIMATELY. FROM VERY SERIOUS PEOPLE.",
    priceFrom: "$699",
    priceTo: "$399",
    priceLabel: "LAUNCH PRICE  →  REDUCED PRICE",
    wifi: "CONNECTING TO WIFI…",
    wifiSub: "PLEASE WAIT. IT'S PREMIUM.",
    customer: "THE CUSTOMER IS THRILLED.",
    note: "PRICE CHANGE AS REPORTED IN 2017",
  },
  reveal: {
    kicker: "BLOOMBERG  ·  THE FIELD TEST",
    title1: "THE PACK",
    title2: "SQUEEZES BY HAND.",
    sub: "Nobody wanted to admit it.",
    error: "ERROR 404:",
    error2: "CUSTOMER VALUE NOT FOUND.",
    mvp: "THE HANDS WERE THE MVP.",
    nuanceTitle: "TO BE FAIR — THE MACHINE DID HAVE VALUE.",
    nuance: ["CONSISTENCY", "CONVENIENCE", "FRESHNESS CHECKS"],
    story: "THE STORY WASN'T THE FEATURE SET.",
    story2: "IT WAS THE UNNECESSARY COMPLEXITY.",
    note: "HAND-SQUEEZE RECONSTRUCTION  ·  ILLUSTRATIVE",
  },
  collapse: {
    kicker: "SEPTEMBER 2017",
    title1: "REFUNDS.",
    title2: "SALES SUSPENDED.",
    title3: "THE END.",
    sub: "A spectacular fall for the future of breakfast.",
    counterLabel: "TOTAL RAISED",
    lesson: "A $120M LESSON.",
    note: "EDITORIAL RECONSTRUCTION  ·  NO FABRICATED NEWS FOOTAGE",
  },
  lesson: {
    kicker: "THE DEVELOPER LESSON",
    title1: "COMPLEXITY",
    title2: "FEELS LIKE PROGRESS.",
    sub: "Until the customer tries to use it.",
    widgets: "47 WIDGETS",
    ai: "AI-POWERED NOTIFICATIONS",
    auth: "5 AUTHENTICATION LAYERS",
    settings: "COMPLICATED SETTINGS",
    owner: "THE BUSINESS OWNER",
    equation1: "COMPLEXITY",
    equation2: "≠",
    equation3: "VALUE.",
    clean: "ONE BUTTON.",
    solved: "PROBLEM SOLVED.",
    final: "SOLVE THE PROBLEM FIRST.",
    note: "ILLUSTRATIVE PRODUCT DEMO  ·  FICTIONAL DASHBOARD",
  },
  ending: {
    kicker: "SIMPLEDEAV  ·  A PRACTICAL LESSON",
    line1: "BUILD SOLUTIONS.",
    line2: "NOT COMPLEXITY.",
    question: "Would they still need it without the technology?",
    ctaLabel: "YOUR TURN",
    cta: "What is the most unnecessarily complicated app you've ever used?",
    footer: "SIMPLEDEAV  ·  @SIMPLEDEAV",
  },
  cover: {
    kicker: "A $120 MILLION BUSINESS LESSON",
    line1: "THE MACHINE",
    line2: "NOBODY",
    line3: "NEEDED.",
    price: "$400",
    sub: "THE JUICE WAS IN THE BAG.",
    footer: "SIMPLEDEAV  ·  @SIMPLEDEAV",
    note: "ILLUSTRATIVE PRODUCT RECONSTRUCTION",
  },
} as const;

/** Scene-local beat map. Picture, captions and SFX share this clock. */
export const BEATS = {
  hook: {
    machine: 0.08,
    orange: 0.45,
    pack: 1.6,
    press: 2.45,
    impact: 2.9,
    hand: 3.45,
    glass: 4.45,
    freeze: 5.35,
    price: 5.75,
  },
  dream: {
    kicker: 0.12,
    title: 0.3,
    office: 1.15,
    cad: 3.7,
    assembly: 5.9,
    machine: 7.9,
    wifi: 8.5,
    card1: 10.3,
    card2: 11.45,
    card3: 12.6,
    tagline: 13.8,
  },
  millions: {
    counter: 0.15,
    counterEnd: 3.4,
    applause: 3.8,
    pedestal: 5.9,
    price: 6.3,
    priceChange: 7.5,
    kitchen: 8.85,
    wifi: 9.3,
    customer: 10.3,
    pack: 11.7,
  },
  reveal: {
    newsroom: 0.15,
    title: 1.35,
    hand: 2.9,
    glass: 4.15,
    idle: 5.2,
    error: 6.15,
    mvp: 8.9,
    nuance: 11.4,
    story: 14.5,
    hold: 17.8,
  },
  collapse: {
    empty: 0.2,
    machine: 1.6,
    year: 3.4,
    end: 5.0,
    counter: 7.0,
    lesson: 9.1,
  },
  lesson: {
    workspace: 0.15,
    dashboard: 0.7,
    widgets: 1.8,
    ai: 3.2,
    auth: 4.6,
    owner: 6.0,
    equation: 7.2,
    wipe: 8.2,
    clean: 9.0,
    click: 10.5,
    solved: 11.4,
    final: 12.2,
  },
  ending: {
    line1: 0.25,
    line2: 1.15,
    question: 2.6,
    cta: 3.4,
    settle: 6.3,
  },
} as const;

export const PHOTO = {
  office: "boardroom.jpg",
  team: "boardroom2.jpg",
  factory: "factory.jpg",
  assembly: "assembly.jpg",
  kitchen: "kitchen2.jpg",
  newsroom: "newsroom.jpg",
  emptyroom: "emptyroom.jpg",
  developer: "developer.jpg",
  owner: "owner.jpg",
  hand: "squeezing-lemon.jpg",
  handOrange: "hand-squeezed.jpg",
} as const;
