import { useVideoConfig } from "remotion";

/**
 * POCKETLEDGER — THE SMALL IDEA
 *
 * A 90-second startup documentary about building a small, useful product for
 * Nigerian micro-businesses, anchored in two published research findings.
 *
 * Editorial rules:
 * — PocketLedger is a hypothetical concept, labelled on screen.
 * — All UI figures are illustrative, never presented as real customer data.
 * — Research is attributed to Research ICT Africa (2024), n = 718.
 * — Photography is credited to Wikimedia Commons contributors (CC BY-SA).
 */

export const PL = {
  fps: 30,
  durationSeconds: 90,
  durationFrames: 2700,
  /** The existing Simpledeav close begins after the last narration word. */
  signOffStartFrame: 2601,
  wide: { width: 1920, height: 1080 },
  portrait: { width: 1080, height: 1920 },
} as const;

export const C = {
  ink: "#0C0E0B",
  bg: "#12140F",
  bgWarm: "#171912",
  charcoal: "#1C1F18",
  charcoal2: "#23261E",
  panel: "rgba(30, 33, 26, 0.9)",
  panelSoft: "rgba(35, 38, 30, 0.62)",
  paper: "#F3EDDF",
  paper2: "#E7DFCE",
  white: "#F6F2E8",
  cream: "#E9E2D2",
  muted: "#A6A399",
  dim: "#73766B",
  line: "rgba(246, 242, 232, 0.12)",
  lineSoft: "rgba(246, 242, 232, 0.055)",
  green: "#3C8B5F",
  greenBright: "#7ACB9A",
  greenSoft: "rgba(122, 203, 154, 0.13)",
  greenGhost: "rgba(122, 203, 154, 0.055)",
  amber: "#D9A45E",
  amberSoft: "rgba(217, 164, 94, 0.13)",
  red: "#D76A5C",
  redSoft: "rgba(215, 106, 92, 0.12)",
  shadow: "rgba(0, 0, 0, 0.55)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';
export const HAND = '"Bradley Hand", "Marker Felt", "Segoe Print", cursive';

export const IMG = {
  owner: "images/pocketledger/owner-portrait.jpg",
  ownerWide: "images/pocketledger/owner-01.jpg",
  ownerWide2: "images/pocketledger/owner-02.jpg",
  cash: "images/pocketledger/naira.jpg",
  cashStack: "images/pocketledger/naira-notes.jpg",
  kiosk: "images/pocketledger/kiosk.jpg",
  shopKano: "images/pocketledger/shop-kano.jpg",
  foodSeller: "images/pocketledger/food-seller.jpg",
  market: "images/pocketledger/stall.jpg",
} as const;

export type SceneId =
  | "hook"
  | "owner"
  | "evidence"
  | "idea"
  | "demo"
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

const frame = (seconds: number) => Math.round(seconds * PL.fps);

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
  scene("hook", "NOT EVERY IDEA NEEDS TO BE HUGE", 0, 8.0),
  scene("owner", "THE PERSON BEHIND THE PROBLEM", 8.0, 20.0),
  scene("evidence", "THE EVIDENCE", 20.0, 32.8),
  scene("idea", "THE SMALL IDEA", 32.8, 43.3),
  scene("demo", "SHOW THE SOLUTION WORKING", 43.3, 66.2),
  scene("lesson", "THE BIGGER LESSON", 66.2, 79.2),
  scene("ending", "THE ENDING", 79.2, 86.7),
];

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
    margin: wide ? 100 : 62,
    captionBottom: wide ? 42 : 154,
    v: (portrait, wideValue = portrait) => (wide ? wideValue : portrait),
  };
};

export const COPY = {
  hook: ["NOT EVERY IDEA", "NEEDS TO BE", "HUGE."],
  hookSmall: "SOMETIMES IT JUST NEEDS TO BE USEFUL.",
  ownerHead: ["SALES ALL DAY.", "NO CLEAR PICTURE."],
  ownerLine:
    "Cash, transfers, suppliers, transport, family needs — all moving through the same hand.",
  evidenceHead: "THE EVIDENCE",
  statA: 64,
  statALabel: "KEPT NO FINANCIAL RECORDS",
  statB: 32,
  statBLabel: "SEPARATED BUSINESS AND PERSONAL MONEY",
  source:
    "Research ICT Africa, 2024 · Digital Technology Adoption by Microenterprises: Nigeria · n = 718",
  ideaHead: ["NOT ACCOUNTING", "SOFTWARE."],
  ideaSub: "A DAILY HABIT.",
  ideaLine:
    "One place to record what comes in, what goes out, and what is left.",
  demoHead: ["A SALE.", "AN EXPENSE.", "A CLEAR PICTURE."],
  lessonHead: ["NOTICE THE FRICTION.", "REMOVE IT."],
  lessonSub: ["SMALL TOOLS.", "REAL RELIEF."],
  ending: ["SMALL PROBLEMS.", "USEFUL PRODUCTS.", "REAL VALUE."],
  question: "WHAT EVERYDAY PROBLEM DO YOU THINK DESERVES A SIMPLE APP?",
  coverHead: ["THE SMALL IDEA", "THAT COULD CHANGE", "EVERYTHING"],
  coverSub: "YOU DON'T NEED A BILLION-DOLLAR IDEA",
  concept: "CONCEPT PRODUCT",
  disclaimer: "PocketLedger is a hypothetical product concept. Interface figures are illustrative.",
  photoCredit: "PHOTOGRAPHY: WIKIMEDIA COMMONS CONTRIBUTORS · CC BY-SA 4.0",
} as const;

export const LEDGER = {
  sales: 27000,
  expenses: 7500,
  personal: 4000,
  cashLeft: 15500,
  profit: 19500,
  transactions: [
    { time: "09:12", type: "sale", label: "Sale · Bank transfer", amount: 12500 },
    { time: "11:40", type: "sale", label: "Sale · Cash", amount: 8000 },
    { time: "13:05", type: "expense", label: "Supplies", amount: -4500 },
    { time: "15:22", type: "sale", label: "Sale · Cash", amount: 6500 },
    { time: "16:10", type: "expense", label: "Transport", amount: -1800 },
    { time: "17:35", type: "personal", label: "Owner withdrawal", amount: -4000 },
    { time: "18:02", type: "expense", label: "Electricity", amount: -1200 },
  ],
} as const;

export const naira = (value: number, decimals = false) => {
  const formatted = Math.abs(value).toLocaleString("en-NG", {
    minimumFractionDigits: decimals ? 2 : 0,
    maximumFractionDigits: decimals ? 2 : 0,
  });
  return `${value < 0 ? "−" : ""}₦${formatted}`;
};

export const BEATS = {
  hook: {
    card1: 0.25,
    card2: 0.75,
    card3: 1.3,
    unicorn: 2.1,
    cut: 4.0,
    headline: 5.0,
    small: 6.3,
  },
  owner: {
    portrait: 0.2,
    cash: 2.9,
    notebook: 4.9,
    transfer: 6.9,
    wide: 9.0,
    headline: 1.0,
    line: 9.8,
  },
  evidence: {
    statA: 0.5,
    barA: 1.6,
    statB: 2.6,
    barB: 3.2,
    source: 5.4,
    note: 7.0,
  },
  idea: {
    notebook: 0.2,
    phone: 1.2,
    logo: 2.4,
    home: 4.5,
    features: 5.4,
    tagline: 7.4,
  },
  demo: {
    home: 0.2,
    tapSale: 1.2,
    saleSheet: 1.5,
    amount: 1.8,
    transfer: 3.7,
    saveSale: 5.0,
    successSale: 5.2,
    tapExpense: 6.8,
    expenseSheet: 7.1,
    expenseAmount: 7.5,
    saveExpense: 9.4,
    successExpense: 9.6,
    tapPersonal: 10.9,
    personalSheet: 11.2,
    personalAmount: 11.8,
    savePersonal: 13.4,
    successPersonal: 13.6,
    tapSummary: 14.6,
    summary: 14.9,
    profit: 15.6,
    reminder: 19.4,
    hold: 21.0,
  },
  lesson: {
    portrait: 0.2,
    notebook: 3.2,
    summary: 5.2,
    wide: 7.4,
    statement: 9.4,
  },
  ending: {
    product: 0.2,
    line1: 1.6,
    line2: 2.2,
    line3: 2.8,
    question: 4.3,
    hold: 6.2,
  },
} as const;
