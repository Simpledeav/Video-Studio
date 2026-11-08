import { useVideoConfig } from "remotion";

/**
 * PAYNOVA — The $5 Million Mistake.
 *
 * Cinematic fintech case-study design system.
 * Deep midnight canvas, cyan data accent, amber warning accent,
 * premium documentary typography using Poppins.
 */

export const PN = {
  fps: 30,
  durationSeconds: 80,
  durationFrames: 80 * 30,
  portrait: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
} as const;

export const C = {
  bg: "#0A0F1C",
  bgSecondary: "#0F1627",
  bgGradientTop: "#0C1322",
  bgGradientBottom: "#070A12",
  surface: "#131B2E",
  surfaceLight: "#1B253D",
  panel: "rgba(19, 27, 46, 0.78)",
  white: "#F5F7FA",
  cream: "#E8ECF2",
  muted: "#8A9BB5",
  dim: "#5A6A85",
  cyan: "#54D9F5",
  cyanSoft: "rgba(84, 217, 245, 0.16)",
  cyanGlow: "rgba(84, 217, 245, 0.45)",
  amber: "#FFB454",
  amberSoft: "rgba(255, 180, 84, 0.16)",
  amberGlow: "rgba(255, 180, 84, 0.45)",
  red: "#FF7C78",
  redSoft: "rgba(255, 124, 120, 0.16)",
  green: "#62E6B0",
  greenSoft: "rgba(98, 230, 176, 0.16)",
  violet: "#A78BFA",
  line: "rgba(245, 247, 250, 0.10)",
  lineSoft: "rgba(245, 247, 250, 0.05)",
  shadow: "rgba(0, 0, 0, 0.45)",
};

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export type SceneId =
  | "hook"
  | "growth"
  | "problem"
  | "struggle"
  | "discovery"
  | "solution"
  | "recovery"
  | "cta";

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
  startFrame: Math.round(start * PN.fps),
  durationFrames: Math.round((end - start) * PN.fps),
});

/**
 * Scene boundaries derived from the generated narration segment manifest.
 * Audio segment ends are padded slightly so visuals can breathe before cuts.
 */
export const SCENES: SceneDef[] = [
  scene("hook", "THE HOOK", 0, 7),
  scene("growth", "THE GROWTH", 7, 16),
  scene("problem", "THE PROBLEM", 16, 27),
  scene("struggle", "THE SYSTEM STRUGGLES", 27, 39),
  scene("discovery", "THE DISCOVERY", 39, 49),
  scene("solution", "THE SOLUTION", 49, 61),
  scene("recovery", "RECOVERY", 61, 73),
  scene("cta", "THE QUESTION", 73, 80),
];

export const frameAt = (seconds: number, fps = PN.fps) => Math.round(seconds * fps);

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown PAYNOVA scene: ${id}`);
  return found;
};

export type Stage = {
  wide: boolean;
  width: number;
  height: number;
  margin: number;
  captionBottom: number;
  v: (portrait: number, wide: number) => number;
};

export const useStage = (): Stage => {
  const { width, height } = useVideoConfig();
  const wide = width > height;
  return {
    wide,
    width,
    height,
    margin: wide ? 112 : 76,
    captionBottom: wide ? 44 : 94,
    v: (portrait, wideValue) => (wide ? wideValue : portrait),
  };
};

export const COPY = {
  title: "THE $5 MILLION MISTAKE",
  subtitle: "THE DATABASE QUERY THAT COULD HAVE DESTROYED A FINTECH STARTUP",
  company: "PAYNOVA",
  query: "SELECT *\nFROM transactions\nWHERE user_id = 219493\nORDER BY created_at DESC;",
  index: "CREATE INDEX idx_transactions_user_created\nON transactions (user_id, created_at DESC);",
} as const;
