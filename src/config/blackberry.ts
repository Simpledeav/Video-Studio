/**
 * Design system, palette, timing, and typography constants for the
 * BlackBerry Business Case Study.
 *
 * Swiss Editorial Data Journalism Style:
 * - Dominant warm white canvas (#F6F5F0)
 * - Ink black typography & grids (#171717)
 * - Electric cobalt blue (#2457FF) for the future & tech disruption
 * - Signal orange (#FF5A36) for warnings, pivots & inflection points
 * - Pale blue (#DCE6FF) and Neutral grey (#858585) for editorial structure
 */

export const PALETTE = {
  warmWhite: "#F6F5F0",
  inkBlack: "#171717",
  electricCobalt: "#2457FF",
  signalOrange: "#FF5A36",
  paleBlue: "#DCE6FF",
  neutralGrey: "#858585",
  lightGrey: "#EBEAE4",
  border: "rgba(23, 23, 23, 0.09)",
  gridHairline: "rgba(23, 23, 23, 0.05)",
  cobaltTint: "rgba(36, 87, 255, 0.08)",
  orangeTint: "rgba(255, 90, 54, 0.08)",
} as const;

export const FONT_STACK = {
  primary: '"Poppins", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif',
  mono: '"SF Mono", "Menlo", "Courier New", monospace',
} as const;

export const FILM = {
  fps: 30,
  durationSeconds: 80,
  totalFrames: 2400,
  vertical: { width: 1080, height: 1920 },
  horizontal: { width: 1920, height: 1080 },
  cover: { width: 1080, height: 1350 },
} as const;

/**
 * Scene timing breakdown:
 * Exactly matches creative brief 80-second documentary structure.
 */
export const SCENES = [
  {
    id: "question",
    title: "THE QUESTION",
    startSecond: 0,
    endSecond: 8,
    startFrame: 0,
    endFrame: 240,
    durationFrames: 240,
  },
  {
    id: "dominance",
    title: "THE DOMINANCE",
    startSecond: 8,
    endSecond: 19,
    startFrame: 240,
    endFrame: 570,
    durationFrames: 330,
  },
  {
    id: "industry_changes",
    title: "THE INDUSTRY CHANGES",
    startSecond: 19,
    endSecond: 31,
    startFrame: 570,
    endFrame: 930,
    durationFrames: 360,
  },
  {
    id: "missed_shift",
    title: "THE MISSED SHIFT",
    startSecond: 31,
    endSecond: 43,
    startFrame: 930,
    endFrame: 1290,
    durationFrames: 360,
  },
  {
    id: "numbers",
    title: "THE NUMBERS TELL THE STORY",
    startSecond: 43,
    endSecond: 56,
    startFrame: 1290,
    endFrame: 1680,
    durationFrames: 390,
  },
  {
    id: "transformation",
    title: "THE TRANSFORMATION",
    startSecond: 56,
    endSecond: 69,
    startFrame: 1680,
    endFrame: 2070,
    durationFrames: 390,
  },
  {
    id: "lesson",
    title: "THE BUSINESS LESSON",
    startSecond: 69,
    endSecond: 80,
    startFrame: 2070,
    endFrame: 2400,
    durationFrames: 330,
  },
] as const;

export type SceneId = (typeof SCENES)[number]["id"];

/** Frame at given time in seconds */
export const frameAt = (seconds: number): number => Math.round(seconds * FILM.fps);
