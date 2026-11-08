import { useVideoConfig } from "remotion";

/**
 * ONE SMALL SECURITY MISTAKE — CINEMATIC SECURITY INCIDENT
 *
 * A fictional business platform, a real class of vulnerability: missing
 * object-level authorization (broken access control). The film is an
 * illustrative reconstruction, not a screenshot of a real company.
 */

export const SEC = {
  fps: 30,
  durationSeconds: 85,
  durationFrames: 85 * 30,
  width: 1080,
  height: 1920,
} as const;

export const C = {
  black: "#050608",
  graphite: "#0B0D12",
  graphite2: "#11151B",
  graphite3: "#171D25",
  white: "#F5F7FA",
  silver: "#A7B0BC",
  dim: "#6D7784",
  mute: "#4D5662",
  cyan: "#00D9FF",
  cyanSoft: "rgba(0, 217, 255, 0.14)",
  cyanGhost: "rgba(0, 217, 255, 0.055)",
  blue: "#456BFF",
  blueSoft: "rgba(69, 107, 255, 0.16)",
  orange: "#FF9B38",
  orangeSoft: "rgba(255, 155, 56, 0.15)",
  red: "#FF3548",
  redSoft: "rgba(255, 53, 72, 0.14)",
  redGlow: "rgba(255, 53, 72, 0.4)",
  green: "#52E0A4",
  greenSoft: "rgba(82, 224, 164, 0.14)",
  line: "rgba(245, 247, 250, 0.11)",
  lineSoft: "rgba(245, 247, 250, 0.055)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export type SceneId =
  | "hook"
  | "business"
  | "authentication"
  | "mistake"
  | "exposure"
  | "impact"
  | "solution"
  | "takeaway";

export type SceneDef = {
  id: SceneId;
  title: string;
  start: number;
  end: number;
  startFrame: number;
  durationFrames: number;
};

const scene = (id: SceneId, title: string, start: number, end: number): SceneDef => ({
  id,
  title,
  start,
  end,
  startFrame: Math.round(start * SEC.fps),
  durationFrames: Math.round((end - start) * SEC.fps),
});

/** Scene boundaries follow the approved 85-second story clock. */
export const SCENES: SceneDef[] = [
  scene("hook", "ONE MISSING RULE", 0, 5.5),
  scene("business", "THE BUSINESS", 5.5, 14),
  scene("authentication", "AUTHENTICATED, NOT AUTHORIZED", 14, 23),
  scene("mistake", "THE SMALL MISTAKE", 23, 33),
  scene("exposure", "THE EXPOSURE", 33, 45),
  scene("impact", "THE BUSINESS IMPACT", 45, 55),
  scene("solution", "SECURITY BY DESIGN", 55, 72.5),
  scene("takeaway", "THE TAKEAWAY", 72.5, 80),
];

export const SIGN_OFF_START_SECONDS = 80;

export const COPY = {
  reconstruction: "ILLUSTRATIVE RECONSTRUCTION · FICTIONAL COMPANY · NOT A VERIFIED SCREENSHOT",
  hookKicker: "PRODUCTION  /  CUSTOMER DATA",
  hookOne: "ONE MISSING",
  hookTwo: "RULE",
  hookThree: "EXPOSED",
  hookSub: "THE PLATFORM WAS POLISHED. THE BOUNDARY WAS NOT ENFORCED.",

  businessKicker: "THE BUSINESS  /  LIVE PLATFORM",
  businessOne: "THOUSANDS OF",
  businessTwo: "CUSTOMERS.",
  businessThree: "ONE PRODUCTION SYSTEM.",
  businessTags: ["THOUSANDS OF CUSTOMERS", "BUSINESS DATA", "PRODUCTION SYSTEM"],

  authKicker: "LOGIN  /  REQUEST PATH",
  authOne: "AUTHENTICATED.",
  authTwo: "BUT NOT",
  authThree: "AUTHORIZED.",
  authSub: "IDENTITY IS NOT PERMISSION.",

  mistakeKicker: "BROKEN ACCESS CONTROL",
  mistakeOne: "OWNERSHIP CHECK",
  mistakeTwo: "MISSING.",
  mistakeSub: "A REQUEST COULD REACH A RECORD IT DID NOT OWN.",

  exposureKicker: "UNAUTHORIZED ACCESS",
  exposureOne: "PRIVATE",
  exposureTwo: "DATA",
  exposureThree: "EXPOSED",
  exposureSub: "INVOICES · CUSTOMER RECORDS · CONFIDENTIAL NOTES",

  impactKicker: "BUSINESS IMPACT",
  impactOne: "THE DAMAGE",
  impactTwo: "GOES BEYOND DATA.",
  impactWords: ["TRUST", "REPUTATION", "BUSINESS RISK"],

  solutionKicker: "SECURITY BY DESIGN",
  solutionOne: "VERIFY EVERY",
  solutionTwo: "REQUEST.",
  solutionSteps: [
    "USER REQUEST",
    "AUTHENTICATION",
    "SERVER-SIDE AUTHORIZATION",
    "OWNERSHIP CHECK",
    "RESTRICTED DATABASE ACCESS",
    "AUTHORIZED RESPONSE",
  ],
  solutionPrinciples: ["VERIFY EVERY REQUEST", "DENY BY DEFAULT", "LEAST PRIVILEGE", "SECURITY BY DESIGN"],

  takeawayKicker: "THE TAKEAWAY",
  takeawayOne: "BUILD WITH",
  takeawayTwo: "SECURITY.",
  takeawayThree: "NOT JUST FEATURES.",
  takeawaySub: "SECURITY IS DESIGNED IN. NOT ADDED AFTER THE DAMAGE.",
} as const;

export type Stage = {
  width: number;
  height: number;
  margin: number;
  v: (value: number) => number;
};

export const useStage = (): Stage => {
  const { width, height } = useVideoConfig();
  return {
    width,
    height,
    margin: 76,
    v: (value: number) => (width / 1080) * value,
  };
};

export const frameAt = (seconds: number, fps = SEC.fps) => Math.round(seconds * fps);
export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown scene: ${id}`);
  return found;
};
