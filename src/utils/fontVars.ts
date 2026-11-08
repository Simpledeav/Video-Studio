import type { CSSProperties } from "react";
import type { Episode } from "../config/episode.schema";

export const POPPINS_STACK =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';
export const MANROPE_STACK =
  '"Manrope", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", sans-serif';
export const INSTRUMENT_STACK = '"Instrument Serif", "Times New Roman", serif';

export const getEpisodeFontVars = (
  fontFamily: Episode["fontFamily"] | undefined,
): CSSProperties => {
  const poppins = fontFamily === "poppins";
  return {
    "--sd-font": poppins ? POPPINS_STACK : MANROPE_STACK,
    "--sd-accent-font": poppins ? POPPINS_STACK : INSTRUMENT_STACK,
    "--sd-accent-style": poppins ? "normal" : "italic",
    "--sd-accent-weight": poppins ? "700" : "400",
  } as CSSProperties;
};
