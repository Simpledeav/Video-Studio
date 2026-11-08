import { useVideoConfig } from "remotion";

/**
 * CINEMATIC TECH INCIDENT — KINETIC EDITORIAL
 *
 * The Replit / SaaStr production database incident, July 2025.
 * One canvas, one type system, one editorial spine. The palette shifts with
 * the story: cyan setup, cold blue freeze, crimson failure, clean recovery.
 */

export const RP = {
  fps: 30,
  /** Final runtime after the editorial speed pass (85s story → 80s film). */
  durationSeconds: 80,
  durationFrames: 80 * 30,
  /** Global pace: 1.0625 = a 6.25% faster cut without dropping frames. */
  pace: 85 / 80,
  storyDurationSeconds: 85,
  width: 1080,
  height: 1920,
} as const;

export const C = {
  black: "#050608",
  graphite: "#0B0D12",
  graphite2: "#11151B",
  graphite3: "#171D25",
  surface: "rgba(17, 21, 27, 0.9)",
  surfaceSoft: "rgba(23, 29, 37, 0.66)",
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
  | "experiment"
  | "data"
  | "warning"
  | "failure"
  | "recovery"
  | "lesson"
  | "conclusion";

export type SceneDef = {
  id: SceneId;
  title: string;
  start: number;
  end: number;
  startFrame: number;
  durationFrames: number;
};

const scene = (id: SceneId, title: string, start: number, end: number): SceneDef => {
  // Scene definitions stay in story seconds so the animation milestones inside
  // each scene do not need to be rewritten when the global pace changes.
  const pacedStart = start / RP.pace;
  const pacedEnd = end / RP.pace;
  return {
    id,
    title,
    start: pacedStart,
    end: pacedEnd,
    startFrame: Math.round(pacedStart * RP.fps),
    durationFrames: Math.round((pacedEnd - pacedStart) * RP.fps),
  };
};

/** Act cuts sit a beat before each narration sentence. */
export const SCENES: SceneDef[] = [
  scene("hook", "THE HOOK", 0, 7.6),
  scene("experiment", "THE EXPERIMENT", 7.6, 17.4),
  scene("data", "THE DATA", 17.4, 25.4),
  scene("warning", "THE WARNING", 25.4, 33.0),
  scene("failure", "THE FAILURE", 33.0, 42.2),
  scene("recovery", "THE SECOND FAILURE", 42.2, 50.8),
  scene("lesson", "THE ENGINEERING LESSON", 50.8, 64.8),
  scene("conclusion", "THE CONCLUSION", 64.8, 79.8),
];

export const SIGN_OFF_START_SECONDS = 79.8 / RP.pace;
export const FINAL_QUESTION_SECONDS = 77.0 / RP.pace;

export const COPY = {
  sourceFinePrint:
    "SOURCES: REPLIT OFFICIAL BLOG · FORTUNE · THE REGISTER · FAST COMPANY · JULY 2025 · REPORTED INCIDENT",
  reconstruction: "ILLUSTRATIVE RECONSTRUCTION · NOT A VERIFIED SCREENSHOT",
  hookKicker: "PRODUCTION  /  LIVE DATA",
  hookLineOne: "PRODUCTION",
  hookLineTwo: "DATABASE",
  hookLineThree: "DELETED",
  hookSub: "THE DEVELOPER TOLD IT NOT TO.",
  experimentKicker: "JULY 2025  /  AI-ASSISTED DEVELOPMENT",
  experimentTitle: ["A REAL APP.", "REAL DATA."],
  experimentLabels: ["CODE EDITOR", "APPLICATION", "CONTACTS DATABASE"],
  dataKicker: "PRODUCTION RECORDS  /  REPORTED",
  dataExecutives: 1206,
  dataCompanies: 1196,
  dataExecLabel: "EXECUTIVES",
  dataCompLabel: "COMPANIES",
  dataNote: "BUSINESS CONTACT RECORDS INSIDE THE APPLICATION",
  warningKicker: "INSTRUCTION  /  RESTRICTION",
  warningTitle: ["CODE", "FREEZE"],
  warningLines: ["NO CHANGES", "HUMAN APPROVAL REQUIRED"],
  failureKicker: "PRODUCTION  /  DESTRUCTIVE ACTION",
  failureTitle: "DATA DELETED",
  failureSub: "THE DATABASE WAS WIPED.",
  failureStatus: ["ACCESS: PRODUCTION", "STATUS: CRITICAL"],
  recoveryKicker: "RECOVERY  /  REPORTED RESPONSE",
  recoveryClaim: "RECOVERY: IMPOSSIBLE",
  recoveryAction: "ROLLBACK",
  recoveryTitle: "RECOVERY AVAILABLE",
  recoveryResult: "THE DATA WAS RESTORED.",
  lessonKicker: "THE ENGINEERING LESSON",
  lessonTitle: ["INSTRUCTIONS", "ARE NOT", "SECURITY"],
  lessonSub: "CONTROLS.",
  lessonLabels: {
    dev: "DEVELOPMENT",
    prod: "PRODUCTION",
    agent: "AI AGENT",
    devDb: "DEV DATABASE",
    prodDb: "PROD DATABASE",
    privilege: "LEAST PRIVILEGE",
    approval: "HUMAN APPROVAL",
    recovery: "TESTED RECOVERY",
  },
  conclusionKicker: "SEPARATION  /  CONTROL",
  conclusionOne: "AI CAN BUILD.",
  conclusionTwo: ["ENGINEERING", "MUST PROTECT."],
  finalQuestion: ["WOULD YOU TRUST", "AN AGENT WITH", "PRODUCTION?"],
} as const;

export type Stage = {
  width: number;
  height: number;
  margin: number;
  /** Resolve a size for the 9:16 canvas. */
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

export const frameAt = (seconds: number, fps = RP.fps) => Math.round(seconds * fps);
export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown scene: ${id}`);
  return found;
};
