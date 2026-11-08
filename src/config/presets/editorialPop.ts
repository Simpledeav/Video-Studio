import { useVideoConfig } from "remotion";

/**
 * EDITORIAL POP — reusable visual preset.
 *
 * Derived from the Walmart Chicken Purse case study. Bright retail blue,
 * spark yellow, roast orange and purple; huge Poppins display; clean white
 * product cards; halftone, grain and hard-cut kinetic edits.
 *
 * The preset is intentionally brand-agnostic at the token level. Swap
 * `brand.primary`, `brand.secondary` and the artwork paths for another
 * retailer without changing the layout or motion grammar.
 */

export const EP = {
  fps: 30,
  width: 1080,
  height: 1920,
  margin: 68,
  captionBottom: 168,
} as const;

export const C = {
  blue: "#0071DC",
  blueDeep: "#003B8E",
  blueInk: "#041E42",
  blueNight: "#02132B",
  yellow: "#FFC220",
  yellowSoft: "#FFE08A",
  orange: "#E07A2F",
  orangeDeep: "#B4531F",
  purple: "#4B2A8A",
  purpleLight: "#7B5BB8",
  cream: "#FFF8EC",
  cream2: "#F6EBD8",
  white: "#FFFFFF",
  ink: "#07182F",
  inkSoft: "#0B2447",
  muted: "rgba(255,255,255,0.62)",
  dim: "rgba(255,255,255,0.4)",
  line: "rgba(255,255,255,0.16)",
  lineSoft: "rgba(255,255,255,0.07)",
  red: "#E23B2E",
  green: "#2E9E6B",
  shadow: "rgba(0,0,0,0.38)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

export const BRAND = {
  spark: "brand/walmart/spark-yellow.svg",
  wordmark: "brand/walmart/wordmark-black.svg",
} as const;

export const STAGE = {
  width: EP.width,
  height: EP.height,
  margin: EP.margin,
  captionBottom: EP.captionBottom,
} as const;

export const useStage = () => {
  const { width, height } = useVideoConfig();
  return { width, height, wide: width > height, margin: STAGE.margin };
};

/** Suggested palette rotations for future episodes. */
export const PALETTE_ROTATIONS = {
  walmartChicken: { primary: C.blue, secondary: C.yellow, accent: C.orange, support: C.purple },
  citrus: { primary: "#0B7A5A", secondary: "#FFD166", accent: "#F26B38", support: "#6A4C93" },
  berry: { primary: "#3B2A8F", secondary: "#FF5C8A", accent: "#F2A03D", support: "#00A6A6" },
  midnight: { primary: "#132A4A", secondary: "#FFC220", accent: "#FF6B35", support: "#8E6BBF" },
} as const;
