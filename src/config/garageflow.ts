import { useVideoConfig } from "remotion";

/**
 * GARAGEFLOW — EVERY REPAIR. ONE WORKSPACE.
 *
 * A 90-second product film for a fictional auto-garage operating system,
 * presented as a SimpleDeav product concept. One narration track, one score,
 * and two genuinely recomposed layouts: 1080×1920 and 1920×1080.
 *
 * Research shown on screen is dealership fixed-ops data, not independent
 * garage data. The demo customer, vehicle, job, prices and timestamps are
 * fictional and labelled as an illustrative product demo.
 */

export const GF = {
  fps: 30,
  durationSeconds: 90,
  durationFrames: 2700,
  /** The branded close starts as the last narration word lands. */
  signOffStartFrame: 2619,
  portrait: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
} as const;

export const C = {
  black: "#04070C",
  bg: "#060A11",
  graphite: "#0A0F17",
  graphite2: "#101722",
  navy: "#08131F",
  navy2: "#0B1A2B",
  navy3: "#0E2135",
  white: "#F5F8FC",
  silver: "#B6C2D1",
  muted: "#7E8DA1",
  dim: "#4E5D72",
  blue: "#2E7BFF",
  blueBright: "#5C9DFF",
  blueDeep: "#1450C8",
  blueSoft: "rgba(46, 123, 255, 0.14)",
  blueGhost: "rgba(46, 123, 255, 0.06)",
  green: "#39C79B",
  greenSoft: "rgba(57, 199, 155, 0.13)",
  amber: "#E8A94F",
  amberSoft: "rgba(232, 169, 79, 0.13)",
  red: "#FF5A6A",
  redSoft: "rgba(255, 90, 106, 0.13)",
  line: "rgba(245, 248, 252, 0.11)",
  lineSoft: "rgba(245, 248, 252, 0.055)",
  shadow: "rgba(0, 0, 0, 0.55)",
  /* Light product UI */
  paper: "#F1F4F8",
  paper2: "#E7ECF3",
  card: "#FFFFFF",
  ink: "#0C1520",
  ink2: "#3B4B5F",
  ink3: "#77879B",
  uiLine: "#DCE3EC",
  uiLineSoft: "#EAF0F6",
  uiBlueSoft: "#EAF1FF",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export type SceneId =
  | "hook"
  | "problem"
  | "research"
  | "reveal"
  | "demo"
  | "opportunity"
  | "offer";

export type SceneDef = {
  id: SceneId;
  title: string;
  startFrame: number;
  durationFrames: number;
  startSeconds: number;
  endSeconds: number;
};

const frame = (seconds: number) => Math.round(seconds * GF.fps);

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
  scene("hook", "FIVE PHONE CALLS", 0, 8.0),
  scene("problem", "THE GARAGE RUNS ON MEMORY", 8.0, 22.8),
  scene("research", "TRANSPARENCY IS THE BASELINE", 22.8, 33.0),
  scene("reveal", "GARAGEFLOW", 33.0, 43.0),
  scene("demo", "EVERY REPAIR, ONE WORKSPACE", 43.0, 67.0),
  scene("opportunity", "A SOFTWARE OPPORTUNITY", 67.0, 77.4),
  scene("offer", "BUILT AROUND YOUR BUSINESS", 77.4, 87.3),
];

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown GarageFlow scene: ${id}`);
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
    margin: wide ? 104 : 70,
    captionBottom: wide ? 42 : 146,
    v: (portrait, wideValue = portrait) => (wide ? wideValue : portrait),
  };
};

export const COPY = {
  product: "GARAGEFLOW",
  tagline: "EVERY REPAIR. ONE WORKSPACE.",
  concept: "A SIMPLEDEAV PRODUCT CONCEPT",
  category: "AUTO-GARAGE OPERATING SYSTEM",
  hook: {
    kicker: "SIMPLEDEAV  ·  PRODUCT CONCEPT",
    line1: "YOUR MECHANIC FOUND",
    line2: "A PROBLEM.",
    calls: "FIVE PHONE CALLS",
    callsSub: "TO FIND OUT WHAT IT IS.",
    question1: "WHY IS THIS",
    question2: "STILL NORMAL?",
  },
  problem: {
    kicker: "BEHIND THE SCENES",
    line1: "THE GARAGE RUNS",
    line2: "ON MEMORY.",
    late1: "NOTHING LIVES",
    late2: "IN ONE PLACE.",
  },
  research: {
    kicker: "THE CUSTOMER HAS CHANGED",
    line1: "TRANSPARENCY IS",
    line2: "THE BASELINE.",
    sub: "Customers want to understand the repair, see the price, and approve the work without chasing the garage.",
    source:
      "SOURCE: COX AUTOMOTIVE — DEALERSHIP FIXED OPS OWNERSHIP STUDY. RESPONDENTS ARE DEALERSHIP SERVICE CUSTOMERS, NOT INDEPENDENT GARAGE CUSTOMERS.",
    stats: [
      { value: 45, label: "find the service visit frustrating", note: "SERVICE EXPERIENCE" },
      { value: 13, label: "say pricing is not clear", note: "PRICE TRANSPARENCY" },
      { value: 12, label: "have paid more than the estimate", note: "ESTIMATE ACCURACY" },
    ],
    wants: ["KNOW WHAT'S WRONG", "SEE THE PRICE", "APPROVE WITHOUT CHASING"],
  },
  reveal: {
    kicker: "ONE SYSTEM",
    tagline: "EVERY REPAIR. ONE WORKSPACE.",
    line: "FROM ARRIVAL TO HANDOVER.",
    pipeline: ["ARRIVAL", "INSPECTION", "APPROVAL", "REPAIR", "HANDOVER"],
    note: "SIMPLEDEAV PRODUCT CONCEPT  ·  FICTIONAL DEMO DATA",
  },
  opportunity: {
    kicker: "THE INTERESTING PART",
    line1: "THIS ISN'T A",
    line2: "GARAGE PROBLEM.",
    line3: "IT'S A SOFTWARE",
    line4: "OPPORTUNITY.",
    sub: "The same operating problem, repeated across thousands of service businesses.",
    categories: [
      "GARAGES",
      "TYRE SHOPS",
      "DETAILERS",
      "MOBILE MECHANICS",
      "BODYWORKS",
      "EV SPECIALISTS",
    ],
  },
  offer: {
    kicker: "SIMPLEDEAV  ·  CUSTOM BUSINESS SYSTEMS",
    line1: "NEED A CUSTOM",
    line2: "BUSINESS SYSTEM?",
    line3: "LET'S BUILD IT.",
    dashboard: "YOUR DASHBOARD.",
    workflow: "YOUR WORKFLOW.",
    software: "YOUR SOFTWARE.",
    weeksLabel: "A FOCUSED FIRST VERSION",
    weeks: "READY IN UNDER TWO WEEKS.",
    footer: "SIMPLEDEAV  ·  @SIMPLEDEAV",
  },
  cover: {
    kicker: "SIMPLEDEAV  ·  PRODUCT CONCEPT",
    headline1: "YOUR GARAGE",
    headline2: "NEEDS THIS.",
    secondary: "STOP MANAGING REPAIRS MANUALLY.",
    tagline: "EVERY REPAIR. ONE WORKSPACE.",
    note: "GARAGEFLOW  ·  A SIMPLEDEAV PRODUCT CONCEPT",
    credit: "WORKSHOP PHOTOGRAPHY: SHIXART1985  ·  CC BY 2.0",
  },
  demo: {
    customer: "EMMA CLARKE",
    customerShort: "EMMA C.",
    phone: "07700 900 412",
    vehicle: "2019 VOLKSWAGEN GOLF GTI",
    vehicleShort: "VW GOLF GTI",
    plate: "GK19 XLR",
    mileage: "84,210 MI",
    job: "JC-2481",
    invoice: "INV-2481",
    concern: "Brake noise under light braking",
    estimate: "£440",
    approve: "APPROVE £440",
    paid: "£440.00",
    method: "VISA  ····  4242",
    revenueBefore: "£2,860",
    revenueAfter: "£3,300",
    lineItems: [
      { label: "Front brake pads", detail: "Parts", value: "£180" },
      { label: "Front brake discs", detail: "Parts", value: "£140" },
      { label: "Labour", detail: "2.0 hours", value: "£120" },
    ],
    checks: [
      { label: "Front brake pads", detail: "3 mm — replacement required", status: "REPLACE" },
      { label: "Front brake discs", detail: "Lipless, scored — replacement required", status: "REPLACE" },
      { label: "Tyre tread", detail: "4 mm — monitor at next service", status: "ADVISORY" },
      { label: "Brake fluid", detail: "Within specification", status: "PASS" },
    ],
    timeline: [
      { label: "Vehicle received", time: "08:42", note: "Keys logged · condition recorded" },
      { label: "Inspection", time: "09:05", note: "Photos and measurements added" },
      { label: "Awaiting approval", time: "10:12", note: "Estimate sent to customer" },
      { label: "Repairing", time: "10:44", note: "Pads and discs replaced" },
      { label: "Ready for collection", time: "15:20", note: "Invoice and payment link sent" },
    ],
    statusAtApproval: "APPROVED",
    stepLabels: {
      booking: "BOOKING",
      card: "JOB CARD",
      inspection: "INSPECTION",
      approval: "CUSTOMER APPROVAL",
      timeline: "STATUS",
      invoice: "INVOICE & PAYMENT",
    },
    note: "ILLUSTRATIVE PRODUCT DEMO  ·  FICTIONAL CUSTOMER, VEHICLE AND PRICING",
  },
} as const;

/**
 * Beat map for the animation inside each scene, in scene-local seconds.
 * Kept in one place so picture and sound are cut to the same clock.
 */
export const BEATS = {
  hook: {
    photo: 0.05,
    line: 0.3,
    calls: 2.24,
    callStep: 0.14,
    question: 5.12,
  },
  problem: {
    ledger: 0.25,
    rows: 0.9,
    notebook: 8.3,
    spreadsheet: 10.34,
    phone: 12.39,
    switchLine: 12.25,
  },
  research: {
    kicker: 0.12,
    line: 0.3,
    stat1: 1.45,
    stat2: 2.65,
    stat3: 3.85,
    wants: 5.9,
    source: 6.55,
  },
  reveal: {
    mark: 0.2,
    wordmark: 0.55,
    tagline: 1.05,
    window: 2.1,
    pipeline: 5.1,
    note: 7.6,
  },
  demo: {
    booking: 0.25,
    card: 2.3,
    inspection: 4.75,
    approval: 9.2,
    everyone: 11.65,
    timeline: 13.4,
    invoice: 17.45,
    payment: 20.1,
    revenue: 21.3,
  },
  opportunity: {
    line1: 0.2,
    line2: 1.35,
    line3: 2.9,
    grid: 3.1,
    categories: 5.1,
    note: 7.9,
  },
  offer: {
    kicker: 0.2,
    line1: 0.45,
    line2: 1.15,
    line3: 2.4,
    dashboard: 3.15,
    workflow: 4.1,
    software: 5.05,
    weeks: 6.45,
    footer: 7.2,
  },
} as const;
