import { useVideoConfig } from "remotion";

/**
 * Coinbase × Cursor — editorial design system.
 *
 * Near-black canvas, warm-white type, graphite surfaces, one electric-lime
 * accent. Every scene is tuned independently for 9:16 and 16:9; the wide cut
 * is a re-composition, not a stretched portrait.
 */

export const CB = {
  fps: 30,
  durationSeconds: 94,
  durationFrames: 94 * 30,
  portrait: { width: 1080, height: 1920 },
  wide: { width: 1920, height: 1080 },
} as const;

export const C = {
  black: "#070809",
  blackSoft: "#0A0B0D",
  graphite: "#101214",
  graphite2: "#16191C",
  graphite3: "#1D2124",
  white: "#F4F1E8",
  dim: "#A6A59C",
  mute: "#70726C",
  faint: "rgba(244, 241, 232, 0.42)",
  lime: "#C8F65B",
  limeDeep: "#9CCB35",
  limeSoft: "rgba(200, 246, 91, 0.14)",
  limeGhost: "rgba(200, 246, 91, 0.06)",
  amber: "#E0A25C",
  red: "#E06A50",
  blueGrey: "#8FA6B2",
  line: "rgba(244, 241, 232, 0.11)",
  lineSoft: "rgba(244, 241, 232, 0.055)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export type SceneId =
  | "hook"
  | "bottleneck"
  | "shift"
  | "seventyfive"
  | "speed"
  | "productivity"
  | "conclusion";

export type SceneDef = {
  id: SceneId;
  title: string;
  start: number;
  end: number;
  startFrame: number;
  durationFrames: number;
};

const scene = (
  id: SceneId,
  title: string,
  start: number,
  end: number,
): SceneDef => ({
  id,
  title,
  start,
  end,
  startFrame: Math.round(start * CB.fps),
  durationFrames: Math.round((end - start) * CB.fps),
});

/** Scene boundaries are also the visual act cuts. Narration sits inside them. */
export const SCENES: SceneDef[] = [
  scene("hook", "THE HOOK", 0, 7),
  scene("bottleneck", "THE OLD BOTTLENECK", 7, 20),
  scene("shift", "THE SHIFT", 20, 35),
  scene("seventyfive", "THE 75 PERCENT REVEAL", 35, 48),
  scene("speed", "THE SPEED TRANSFORMATION", 48, 62),
  scene("productivity", "THE PRODUCTIVITY REVEAL", 62, 76),
  scene("conclusion", "THE CONCLUSION", 76, 88),
];

export const SIGN_OFF_START_SECONDS = 88;
export const FINAL_LINE_START_SECONDS = 84.4;

export const frameAt = (seconds: number, fps = CB.fps) =>
  Math.round(seconds * fps);

export const sceneById = (id: SceneId): SceneDef => {
  const found = SCENES.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown Coinbase scene: ${id}`);
  return found;
};

export type Stage = {
  wide: boolean;
  width: number;
  height: number;
  /** Safe horizontal margin. */
  margin: number;
  /** Caption baseline offset from the bottom edge. */
  captionBottom: number;
  /** Resolve a portrait value for the active aspect ratio. */
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

/** Copy deck — the narration is the spine, this is the picture. */
export const COPY = {
  hookKicker: "COINBASE  ·  ENGINEERING",
  hookLines: ["COINBASE", "CHANGED HOW", "SOFTWARE", "GETS BUILT."],
  hookSub: "AN AGENT-FIRST ENGINEERING MODEL",
  oldKicker: "THE OLD DEFAULT",
  oldHeadline: ["20 DAYS", "TO SHIP."],
  oldNote: "ILLUSTRATIVE  ·  A TYPICAL ENGINEERING CYCLE",
  oldStatement: ["THE PROCESS", "WAS THE BOTTLENECK."],
  shiftKicker: "THE SHIFT",
  shiftHeadline: ["THEN THEY CHANGED", "THE WORKFLOW."],
  shiftMetric: "2,400+",
  shiftMetricLabel: "DEVELOPERS USING CURSOR",
  shiftAgentsLabel: "5–7 AGENTS IN PARALLEL",
  shiftHumanLabel: "THE HUMAN ROLE",
  shiftHuman: ["DEFINE INTENT", "REVIEW OUTPUT", "VALIDATE RESULTS"],
  statKicker: "COINBASE  ·  REPORTED WORKFLOW",
  statSupport: ["OF PULL REQUESTS", "CREATED BY AGENTS"],
  statNote: "THREE OUT OF FOUR  ·  ACROSS CLOUD AND LOCAL",
  speedKicker: "THE SPEED TRANSFORMATION",
  speedBefore: "20 DAYS",
  speedAfter: "< 2",
  speedAfterWord: "DAYS",
  speedSupport: "IDEA TO PRODUCTION",
  speedNote: "SOME TEAMS  ·  REPORTED",
  speedReduction: ">90% REDUCTION",
  speedLineOne: "NOT BY TYPING FASTER.",
  speedLineTwo: "BY REMOVING HANDOFFS.",
  productivityKicker: "THE PRODUCTIVITY REVEAL",
  productivityTop: "+55%",
  productivityTopLabel: ["MORE PULL REQUESTS MERGED", "PER ENGINEER"],
  productivityBottom: "7 HOURS",
  productivityBottomLabel: ["SAVED PER ENGINEER", "EVERY WEEK"],
  productivityNote: "TEAMS OF 1–2 NOW SHIP WHAT ONCE TOOK A FULL TEAM.",
  conclusionKicker: "THE IMPLICATION",
  conclusionOne: ["THE FUTURE ISN'T", "JUST WRITING CODE."],
  conclusionTwo: ["IT'S", "DIRECTING THE", "SYSTEMS THAT BUILD IT."],
  finalLine: ["THE NEXT ERA OF SOFTWARE", "IS ALREADY HERE."],
  source: "SOURCE: CURSOR CUSTOMER CASE STUDY, COINBASE, 2026  ·  REPORTED OUTCOMES",
} as const;

/** Break a caption line into words for optional emphasis. */
export const isEmphasisWord = (word: string): boolean =>
  /(^|\b)(75|55|7|20|1\.8|2,400|24|ninety|twenty|seven|fifty-five|three|four|next era|already here)(\b|$)/i.test(
    word.replace(/[.,!?]/g, ""),
  );
