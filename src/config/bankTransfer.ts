import { useVideoConfig } from "remotion";

/**
 * WHY YOUR BANK TRANSFER SAYS SUCCESSFUL — BUT THE RECEIVER GETS NOTHING
 *
 * A 90.5-second cinematic fintech explainer. One story, two layouts:
 * 1080×1920 for social, 1920×1080 for YouTube / LinkedIn, plus a 16:9 cover.
 *
 * The film follows a fictional ₦250,000 transfer between two fictional banks.
 * NIBSS / NIP is shown as payment infrastructure, never as a place where money
 * is stored or lost. Fictional data only; no real bank interface is reproduced.
 */

export const BT = {
  fps: 30,
  durationSeconds: 90.5,
  durationFrames: 2715,
  /** The branded close starts as the last narration word lands. */
  signOffStartFrame: 2625,
  portrait: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
} as const;

export const C = {
  black: "#03060A",
  bg: "#05090F",
  bgNavy: "#08111D",
  navy: "#0B1727",
  navy2: "#0E1D30",
  surface: "#0D1928",
  surface2: "#122338",
  panel: "rgba(10, 22, 36, 0.86)",
  panelSoft: "rgba(14, 29, 48, 0.62)",
  white: "#F3F7FC",
  silver: "#A8B8CB",
  muted: "#74879E",
  dim: "#4B5E75",
  cyan: "#3ADEFF",
  cyanSoft: "rgba(58, 222, 255, 0.14)",
  cyanGhost: "rgba(58, 222, 255, 0.05)",
  green: "#4BE3A2",
  greenSoft: "rgba(75, 227, 162, 0.13)",
  amber: "#FFB45C",
  amberSoft: "rgba(255, 180, 92, 0.13)",
  red: "#FF626D",
  redSoft: "rgba(255, 98, 109, 0.13)",
  line: "rgba(243, 247, 252, 0.11)",
  lineSoft: "rgba(243, 247, 252, 0.055)",
  shadow: "rgba(0, 0, 0, 0.55)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export type SceneId =
  | "missing"
  | "network"
  | "route"
  | "failure"
  | "alert"
  | "trace"
  | "rights"
  | "reveal";

export type SceneDef = {
  id: SceneId;
  title: string;
  startFrame: number;
  durationFrames: number;
  startSeconds: number;
  endSeconds: number;
};

const frame = (seconds: number) => Math.round(seconds * BT.fps);

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

/** Cuts sit a beat after each narration sentence. */
export const SCENES: SceneDef[] = [
  scene("missing", "THE MISSING ₦250,000", 0, 7.0),
  scene("network", "THE INVISIBLE NETWORK", 7.0, 15.5),
  scene("route", "FOLLOW THE MESSAGE", 15.5, 26.45),
  scene("failure", "WHERE IT CAN GO WRONG", 26.45, 38.55),
  scene("alert", "NO ALERT ≠ NO CREDIT", 38.55, 48.65),
  scene("trace", "HOW TO TRACE IT", 48.65, 69.35),
  scene("rights", "YOUR RIGHTS", 69.35, 80.1),
  scene("reveal", "THE TRANSACTION TRAIL", 80.1, 87.5),
];

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown bank-transfer scene: ${id}`);
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
    margin: wide ? 96 : 68,
    captionBottom: wide ? 40 : 138,
    v: (portrait, wideValue = portrait) => (wide ? wideValue : portrait),
  };
};

export const COPY = {
  senderBank: "NORTHSTAR BANK",
  receiverBank: "MERIDIAN BANK",
  sender: "AMARA O.",
  receiver: "TUNDE B.",
  amount: "₦250,000.00",
  amountShort: "₦250,000",
  amountDigits: "250,000",
  sessionId: "NIP-8842-7710-5521",
  receiptDate: "12 MAR 2026 · 09:41",
  senderBalance: "₦412,680.20",
  receiverBalance: "₦86,420.55",
  receiverAfter: "₦336,420.55",
  ussd: "*565*5#",
  cbnEmail: "cpd@cbn.gov.ng",
  coverHeadline: ["WHERE DID", "THE MONEY GO?"],
  final: ["DON'T JUST CHECK", "THE RECEIPT."],
  finalAccent: "TRACE THE TRANSACTION.",
} as const;

/**
 * Beat map for the animation inside each scene, in scene-local seconds.
 * Kept in one place so picture and sound are cut to the same clock.
 */
export const BEATS = {
  missing: {
    phoneIn: 0.2,
    success: 1.0,
    secondPhone: 2.65,
    amount: 3.1,
    glitch: 4.55,
    question: 5.2,
  },
  network: {
    zoom: 0.15,
    institutions: 1.1,
    network: 2.3,
    label: 4.1,
    packets: 4.8,
  },
  route: {
    stage1: 0.25,
    stage2: 1.0,
    stage3: 1.85,
    stage4: 2.7,
    packet: 3.5,
    cashNote: 6.1,
  },
  failure: {
    flow: 0.15,
    timeout: 2.6,
    pending: 4.7,
    credit: 7.0,
    investigation: 9.1,
  },
  alert: {
    noSms: 0.2,
    app: 2.4,
    history: 4.2,
    balance: 5.3,
    equation: 6.6,
  },
  trace: {
    title: 0.15,
    step1: 0.55,
    step2: 4.3,
    step3: 7.2,
    ussd: 7.9,
    outcome: 14.4,
    disclaimer: 18.2,
  },
  rights: {
    complaint: 0.2,
    ticket: 2.3,
    cbn: 4.2,
    path: 6.0,
    email: 7.6,
  },
  reveal: {
    trail: 0.2,
    complete: 2.5,
    final: 3.5,
    accent: 4.4,
  },
} as const;
