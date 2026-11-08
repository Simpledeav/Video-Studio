/**
 * Design system, palette, timing, and typography constants for the
 * Kodak Business Case Study: "The Future It Invented, But Failed to Master"
 *
 * Visual identity: Modern Swiss Editorial + Minimalist Technology Documentary
 * - Dominant warm ivory canvas (#F7F7F4)
 * - Deep neutral black typography (#171717)
 * - Secondary editorial text (#737373)
 * - Electric Accent Blue (#315EFF) for digital concepts, pixels, sensors
 * - Kodak Accent Yellow (#FFD84D) for film, analog highlights, brand markers
 * - Dark Contrast (#202124) for camera bodies, darkroom contrasts
 */

export const PALETTE = {
  warmIvory: "#F7F7F4",
  primaryText: "#171717",
  secondaryText: "#737373",
  accentBlue: "#315EFF",
  accentYellow: "#FFD84D",
  darkContrast: "#202124",
  white: "#FFFFFF",
  lightGrey: "#EAEAE6",
  border: "rgba(23, 23, 23, 0.09)",
  gridHairline: "rgba(23, 23, 23, 0.05)",
  blueTint: "rgba(49, 94, 255, 0.08)",
  yellowTint: "rgba(255, 216, 77, 0.12)",
  darkTint: "rgba(32, 33, 36, 0.06)",
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

export type KodakScene = {
  id: string;
  title: string;
  category: string;
  timeCode: string;
  startSecond: number;
  endSecond: number;
  startFrame: number;
  endFrame: number;
  durationFrames: number;
};

/**
 * 7 Scenes · Exactly 80 Seconds · Exactly 2,400 Frames
 */
export const SCENES: KodakScene[] = [
  {
    id: "contradiction",
    title: "THE CONTRADICTION",
    category: "01 / PROLOGUE",
    timeCode: "00:00 – 00:08",
    startSecond: 0,
    endSecond: 8,
    startFrame: 0,
    endFrame: 240,
    durationFrames: 240,
  },
  {
    id: "dominance",
    title: "THE FILM GIANT",
    category: "02 / THE EMPIRE",
    timeCode: "00:08 – 00:19",
    startSecond: 8,
    endSecond: 19,
    startFrame: 240,
    endFrame: 570,
    durationFrames: 330,
  },
  {
    id: "invention",
    title: "THE INVENTION",
    category: "03 / 1975 PROTOTYPE",
    timeCode: "00:19 – 00:32",
    startSecond: 19,
    endSecond: 32,
    startFrame: 570,
    endFrame: 960,
    durationFrames: 390,
  },
  {
    id: "conflict",
    title: "THE BUSINESS CONFLICT",
    category: "04 / TRANSITION",
    timeCode: "00:32 – 00:44",
    startSecond: 32,
    endSecond: 44,
    startFrame: 960,
    endFrame: 1320,
    durationFrames: 360,
  },
  {
    id: "collapse",
    title: "THE COLLAPSE",
    category: "05 / CHAPTER 11",
    timeCode: "00:44 – 00:56",
    startSecond: 44,
    endSecond: 56,
    startFrame: 1320,
    endFrame: 1680,
    durationFrames: 360,
  },
  {
    id: "lesson",
    title: "THE REAL LESSON",
    category: "06 / INNOVATION",
    timeCode: "00:56 – 01:11",
    startSecond: 56,
    endSecond: 71,
    startFrame: 1680,
    endFrame: 2130,
    durationFrames: 450,
  },
  {
    id: "closing",
    title: "THE FUTURE",
    category: "07 / CONCLUSION",
    timeCode: "01:11 – 01:20",
    startSecond: 71,
    endSecond: 80,
    startFrame: 2130,
    endFrame: 2400,
    durationFrames: 270,
  },
];
