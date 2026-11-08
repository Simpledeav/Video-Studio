import { useVideoConfig } from "remotion";

export type TypeScale = {
  display: number;
  hero: number;
  statement: number;
  lead: number;
  kicker: number;
  micro: number;
  caption: number;
  numeral: number;
};
import manifest from "../../content/episode-airbnb-cereal.json";

/**
 * Airbnb case study: single source of truth for timing, type and layout.
 *
 * The narration is the spine of the edit. Act boundaries sit a beat before each
 * narration sentence so the picture lands just ahead of the line; the seven
 * storyboard acts are preserved in order and the film is still exactly 80s.
 */

export const FILM = {
  fps: manifest.fps,
  durationSeconds: manifest.durationSeconds,
  durationInFrames: manifest.totalFrames,
  portrait: { width: manifest.aspects.primary.width, height: manifest.aspects.primary.height },
  wide: { width: manifest.aspects.secondary.width, height: manifest.aspects.secondary.height },
} as const;

export type Act = {
  id: "hook" | "idea" | "struggle" | "cereal" | "funding" | "breakthrough" | "lesson";
  /** Composition-relative seconds. */
  start: number;
  end: number;
  label: string;
};

export const ACTS: Act[] = manifest.acts.map((act) => ({
  id: act.id as Act["id"],
  start: act.startSeconds,
  end: act.endSeconds,
  label: act.label,
}));

export const BRAND_REVEAL_SECONDS = manifest.brand.revealSeconds;

/** Narration sentence starts, measured from the generated voice track. */
export const VOICE_CUES = manifest.voiceCues;

export const frameAt = (seconds: number, fps = FILM.fps) => Math.round(seconds * fps);
export const secondsAt = (frame: number, fps = FILM.fps) => frame / fps;

export const actById = (id: Act["id"]): Act => {
  const act = ACTS.find((item) => item.id === id);
  if (!act) throw new Error(`Unknown act: ${id}`);
  return act;
};

export type Stage = {
  /** True for the 16:9 adaptation. */
  wide: boolean;
  width: number;
  height: number;
  /** Layout unit: 1 at portrait width 1080, 1.42 at wide height 1080. */
  u: number;
  /** Typography sizes resolved for the current aspect. */
  type: TypeScale;
  /** Safe horizontal margin. */
  margin: number;
};

const PORTRAIT_TYPE: TypeScale = {
  display: 104,
  hero: 76,
  statement: 50,
  lead: 40,
  kicker: 22,
  micro: 17,
  caption: 33,
  numeral: 168,
};

const resolveType = (wide: boolean): TypeScale => ({
  display: wide ? 92 : PORTRAIT_TYPE.display,
  hero: wide ? 68 : PORTRAIT_TYPE.hero,
  statement: wide ? 46 : PORTRAIT_TYPE.statement,
  lead: wide ? 38 : PORTRAIT_TYPE.lead,
  kicker: wide ? 20 : PORTRAIT_TYPE.kicker,
  micro: wide ? 16 : PORTRAIT_TYPE.micro,
  caption: wide ? 30 : PORTRAIT_TYPE.caption,
  numeral: wide ? 132 : PORTRAIT_TYPE.numeral,
});

export const useStage = (): Stage => {
  const { width, height } = useVideoConfig();
  const wide = width > height;
  return {
    wide,
    width,
    height,
    u: wide ? 1.42 : 1,
    type: resolveType(wide),
    margin: wide ? 104 : 78,
  };
};

export const FONT_STACK =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

/** Copy deck. Kept here so scenes stay purely presentational. */
export const COPY = {
  hookLine1: "THE STARTUP THAT",
  hookLine2: "SOLD CEREAL.",
  hookLine3: "TO SURVIVE.",
  hookKicker: "SIMPLEDEAV  ·  CASE STUDY 03",
  ideaYear: "2007",
  ideaMattresses: "THREE AIR MATTRESSES.",
  ideaIdea: "ONE UNUSUAL IDEA.",
  ideaCity: "SAN FRANCISCO",
  ideaCoords: "37.7749° N  122.4194° W",
  struggle: ["LOW BOOKINGS.", "LIMITED CASH.", "NO CLEAR WAY FORWARD."],
  cerealYear: "2008",
  cerealObama: "OBAMA O'S.",
  cerealMccain: "CAP'N McCAIN'S.",
  cerealPrice: "$40 PER BOX.",
  cerealTag: "COLLECTOR'S EDITION · HAND PACKED",
  fundingKicker: "APPROXIMATELY",
  fundingAmount: "$30,000",
  fundingNote: "RAISED THROUGH CEREAL SALES",
  fundingFormula: "≈ 750 BOXES  ×  $40",
  fundingStory: "THE CEREAL STORY.",
  breakthroughAccepted: "GET ACCEPTED.",
  breakthroughCustomer: "UNDERSTAND THE CUSTOMER.",
  breakthroughExperience: "IMPROVE THE EXPERIENCE.",
  lessonWords: ["CREATIVITY.", "PERSISTENCE.", "UNDERSTAND YOUR CUSTOMERS."],
  lessonClose: "FIND ANOTHER DOOR.",
  brand: "SIMPLEDEAV",
  brandTag: "CASE STUDY 03  ·  AIRBNB",
} as const;
