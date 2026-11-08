import { useVideoConfig } from "remotion";

/**
 * McDONALD'S TRIED AI. THEN THINGS GOT WEIRD.
 *
 * A 90-second editorial business case study about the McDonald's × IBM
 * Automated Order Taker test (2021–2024). One master timeline, two dedicated
 * recompositions (16:9 and 9:16) and a standalone 16:9 thumbnail.
 *
 * Editorial rules:
 * — Report only what the sourced reporting says. The nine sweet teas and the
 *   butter/ketchup order are customer-reported incidents covered by CBS News.
 * — The order screens are illustrative reconstructions, never fake screenshots.
 * — The improved design in Act 6 is a proposal, not a McDonald's system.
 * — McDonald's did not abandon voice AI; the film says so explicitly.
 */

export const MD = {
  fps: 30,
  durationSeconds: 90,
  durationFrames: 90 * 30,
  /** The Simpledeav close begins after the final narration word. */
  signOffStartSeconds: 85,
  signOffStartFrame: 85 * 30,
  portrait: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
  cover: { width: 1920, height: 1080 },
} as const;

export const C = {
  black: "#050506",
  bg: "#08080A",
  graphite: "#0D0D10",
  graphite2: "#131317",
  graphite3: "#1A1A20",
  panel: "rgba(19, 19, 23, 0.92)",
  panelSoft: "rgba(27, 27, 33, 0.68)",
  white: "#F7F3EA",
  bone: "#E8E2D4",
  silver: "#BDB6A8",
  muted: "#8D877C",
  dim: "#5E594F",
  line: "rgba(247, 243, 234, 0.12)",
  lineSoft: "rgba(247, 243, 234, 0.06)",
  red: "#DA1A32",
  redBright: "#F02742",
  redSoft: "rgba(218, 26, 50, 0.16)",
  redGhost: "rgba(218, 26, 50, 0.06)",
  yellow: "#FFC72C",
  yellowSoft: "rgba(255, 199, 44, 0.16)",
  yellowGhost: "rgba(255, 199, 44, 0.06)",
  blue: "#3D74FF",
  blueSoft: "rgba(61, 116, 255, 0.16)",
  blueGhost: "rgba(61, 116, 255, 0.06)",
  green: "#4FD8A0",
  greenSoft: "rgba(79, 216, 160, 0.14)",
  shadow: "rgba(0, 0, 0, 0.62)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export const IMG = {
  storeNight: "images/mcdonalds/store-night.jpg",
  storeStreet: "images/mcdonalds/store-street.jpg",
  storeModern: "images/mcdonalds/store-modern.jpg",
  driveThru: "images/mcdonalds/drive-thru.jpg",
  sweetTea: "images/mcdonalds/sweet-tea-cup.jpg",
  fries: "images/mcdonalds/fries.jpg",
  crew: "images/mcdonalds/crew.jpg",
  counter: "images/mcdonalds/counter.jpg",
  windshield: "images/mcdonalds/windshield-night.jpg",
  arches: "images/mcdonalds/golden-arches.svg",
  ibm: "images/mcdonalds/ibm.svg",
} as const;

export type SceneId =
  | "hook"
  | "idea"
  | "chaos"
  | "internet"
  | "decision"
  | "lesson"
  | "takeaway";

export type SceneDef = {
  id: SceneId;
  title: string;
  start: number;
  end: number;
  startFrame: number;
  durationFrames: number;
};

const frame = (seconds: number) => Math.round(seconds * MD.fps);

const scene = (
  id: SceneId,
  title: string,
  start: number,
  end: number,
  nextStart: number,
): SceneDef => ({
  id,
  title,
  start,
  end,
  startFrame: frame(start),
  durationFrames: frame(nextStart) - frame(start),
});

/** Cuts sit a beat before each narration phrase. */
export const SCENES: SceneDef[] = [
  scene("hook", "THE HOOK", 0, 8.95, 8.95),
  scene("idea", "THE BIG IDEA", 8.95, 24.2, 24.2),
  scene("chaos", "OFF SCRIPT", 24.2, 33.8, 33.8),
  scene("internet", "THE INTERNET REACTS", 33.8, 44.0, 44.0),
  scene("decision", "THE BUSINESS DECISION", 44.0, 54.5, 54.5),
  scene("lesson", "THE REAL LESSON", 54.5, 75.7, 75.7),
  scene("takeaway", "THE TAKEAWAY", 75.7, 85.0, 85.0),
];

export const SIGN_OFF_START_SECONDS = MD.signOffStartSeconds;

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown McDonald's scene: ${id}`);
  return found;
};

export const COPY = {
  sourceFinePrint:
    "SOURCES: ASSOCIATED PRESS · CBS NEWS · RESTAURANT BUSINESS · JUNE 2024",
  reconstruction:
    "ILLUSTRATIVE ORDER-SCREEN RECONSTRUCTION · NOT A VERIFIED SCREENSHOT",
  proposal:
    "ILLUSTRATIVE DESIGN PROPOSAL · NOT A MCDONALD'S SYSTEM",
  hookKicker: "McDONALD'S × IBM · 2021–2024",
  hookLines: ["WHEN AI", "TAKES YOUR", "ORDER…"],
  hookSub: "THE MACHINE HAD OTHER IDEAS.",
  hookItems: [
    { name: "VANILLA CONE", qty: "× 1" },
    { name: "SWEET TEA", qty: "× 9" },
    { name: "BUTTER", qty: "× 2" },
    { name: "KETCHUP", qty: "× 4" },
  ],
  hookShout: "9 SWEET TEAS?!",
  ideaKicker: "THE BIG IDEA · 2021",
  ideaTitle: ["THE IDEA", "WAS SMART."],
  ideaPartners: ["McDONALD'S", "IBM"],
  ideaLocations: "100+",
  ideaLocationsLabel: "U.S. TEST LOCATIONS",
  ideaFlow: ["SPEAK", "AI UNDERSTANDS", "ORDER REACHES KITCHEN"],
  ideaBenefit: ["FASTER SERVICE", "LESS MANUAL WORK"],
  chaosKicker: "AUTOMATED ORDER TAKER · LIVE",
  chaosTitle: ["BUT THE AI", "WENT OFF SCRIPT."],
  chaosTeaLine: ["ONE SWEET TEA", "BECAME NINE."],
  chaosReceipt: [
    { name: "WATER", qty: "× 1" },
    { name: "VANILLA ICE CREAM", qty: "× 1" },
    { name: "BUTTER", qty: "× 2" },
    { name: "KETCHUP", qty: "× 4" },
  ],
  chaosReceiptTitle: "RECEIPT · AS REPORTED",
  internetKicker: "THE CLIPS SPREAD",
  internetTitle: ["THE FUTURE", "WENT PUBLIC."],
  internetQuoteOne:
    "“The AI cashier mistakenly added nine sweet teas to Adams' order.”",
  internetQuoteOneSource: "CBS NEWS · MARCH 2023 TIKTOK",
  internetQuoteTwo:
    "“The AI bot inexplicably added two sides of butter and four ketchup packets.”",
  internetQuoteTwoSource: "CBS NEWS · CUSTOMER VIDEO",
  internetPromise: "PROMISED",
  internetReality: "REALITY",
  decisionKicker: "JUNE 2024 · THE DECISION",
  decisionTitle: ["THE TEST", "ENDED."],
  decisionSub: "THE CURRENT IBM AUTOMATED ORDER-TAKING TEST.",
  decisionTimeline: [
    { year: "2021", label: "TEST BEGINS" },
    { year: "100+", label: "U.S. LOCATIONS" },
    { year: "2024", label: "TEST ENDS" },
  ],
  decisionTurn: ["BUT VOICE AI", "WASN'T OVER."],
  decisionQuote:
    "“An opportunity to explore voice ordering solutions more broadly.”",
  decisionQuoteSource: "McDONALD'S STATEMENT · JUNE 2024",
  lessonKicker: "THE REAL LESSON",
  lessonTitle: ["THE LESSON ISN'T", "THAT AI IS USELESS."],
  lessonBuild: "BUILDING AI",
  lessonReliable: "MAKING IT RELIABLE",
  lessonBuildLine: "ONE THING.",
  lessonReliableLine: "SOMETHING ELSE.",
  lessonProtocolTitle: "DESIGN FOR THE REAL WORLD",
  lessonProtocol: [
    { id: "01", title: "CONFIRM", body: "Read the order back before it is sent." },
    { id: "02", title: "DETECT", body: "Know when the audio or intent is uncertain." },
    { id: "03", title: "CORRECT", body: "Let the customer fix it in one step." },
    { id: "04", title: "ESCALATE", body: "Hand hard cases to a human crew member." },
    { id: "05", title: "CONNECT", body: "Write a clean order into the restaurant system." },
  ],
  lessonQuote: ["THE SMARTEST SOFTWARE", "ISN'T THE ONE THAT", "DOES EVERYTHING."],
  lessonQuoteAccent: ["IT'S THE ONE THAT KNOWS", "WHEN TO ASK FOR HELP."],
  takeawayKicker: "FOR FOUNDERS & DEVELOPERS",
  takeawayTitle: ["AI IS", "IMPRESSIVE."],
  takeawayAccent: ["BUT RELIABILITY", "BUILDS BUSINESSES."],
  takeawaySub:
    "DON'T BUILD AI BECAUSE IT SOUNDS IMPRESSIVE. BUILD SOMETHING PEOPLE CAN TRUST.",
  question: ["WOULD YOU TRUST AI", "TO TAKE YOUR FOOD ORDER?"],
  coverHeadline: ["AI GOT", "THE ORDER", "WRONG"],
  coverSub: "THE McDONALD'S EXPERIMENT",
  coverKicker: "A REAL BUSINESS STORY · 2021–2024",
  coverCaption: "9 SWEET TEAS. 2 BUTTER. 4 KETCHUP.",
} as const;

export type Stage = {
  wide: boolean;
  width: number;
  height: number;
  margin: number;
  captionBottom: number;
  /** Resolve a portrait value, with an optional wide override. */
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
    captionBottom: wide ? 78 : 162,
    v: (portrait, wideValue = portrait) => (wide ? wideValue : portrait),
  };
};

/**
 * Scene-local beat map, in seconds from the start of each act. Picture and
 * sound are cut against this one clock.
 */
export const BEATS = {
  hook: {
    mark: 0.05,
    photo: 0.5,
    kicker: 0.85,
    headline: 0.62,
    screen: 3.55,
    firstItem: 4.35,
    shout: 5.75,
    cut: 8.55,
  },
  idea: {
    title: 0.15,
    partner: 1.9,
    locations: 3.0,
    flow: 7.4,
    benefit: 11.8,
    hold: 14.8,
  },
  chaos: {
    glitch: 0.1,
    title: 0.35,
    tea: 1.6,
    multiply: 2.4,
    shout: 4.1,
    receipt: 5.6,
    hold: 8.9,
  },
  internet: {
    kicker: 0.1,
    title: 0.45,
    quoteOne: 0.9,
    quoteTwo: 2.2,
    reality: 5.2,
    hold: 9.8,
  },
  decision: {
    kicker: 0.1,
    title: 0.4,
    power: 0.7,
    timeline: 2.4,
    turn: 5.4,
    quote: 7.6,
    hold: 10.2,
  },
  lesson: {
    kicker: 0.1,
    title: 0.35,
    build: 3.2,
    protocol: 7.6,
    quote: 15.3,
    hold: 20.7,
  },
  takeaway: {
    kicker: 0.1,
    title: 0.35,
    accent: 3.6,
    sub: 5.2,
    question: 7.7,
    hold: 9.1,
  },
} as const;
