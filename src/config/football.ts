import { useVideoConfig } from "remotion";

/**
 * RONALDO RETIRED. SOME MEN ARE STILL PLAYING THE LEAGUE.
 *
 * A football-documentary spoof that slowly reveals itself as a relationship
 * comedy. One canvas, one broadcast type system, nine acts. The palette shifts
 * with the story: turf and silver in the hook, cyan in the transfer market,
 * gold at the signing, crimson when the minutes disappear, and electric cyan
 * for the reveal.
 */

export const FR = {
  fps: 30,
  durationSeconds: 84,
  durationFrames: 84 * 30,
  width: 1080,
  height: 1920,
  margin: 76,
} as const;

export const FC = {
  black: "#080A0F",
  graphite: "#111318",
  graphite2: "#171B22",
  pitch: "#1B6B45",
  pitchDark: "#0B2A1D",
  pitchLight: "#2E9B68",
  cyan: "#00D9FF",
  cyanSoft: "rgba(0, 217, 255, 0.13)",
  gold: "#D8B15A",
  goldSoft: "rgba(216, 177, 90, 0.15)",
  orange: "#FF9B38",
  orangeSoft: "rgba(255, 155, 56, 0.15)",
  red: "#FF3548",
  redSoft: "rgba(255, 53, 72, 0.14)",
  pink: "#FF7EA8",
  pinkSoft: "rgba(255, 126, 168, 0.13)",
  white: "#F5F7FA",
  silver: "#A7B0BC",
  dim: "#6D7784",
  mute: "#4D5662",
  line: "rgba(245, 247, 250, 0.11)",
  lineSoft: "rgba(245, 247, 250, 0.055)",
  surface: "rgba(17, 19, 24, 0.92)",
  surfaceSoft: "rgba(23, 27, 34, 0.7)",
} as const;

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export type SceneId =
  | "hook"
  | "transfer"
  | "signing"
  | "preseason"
  | "league"
  | "sale"
  | "return"
  | "reveal"
  | "punchline";

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
  startFrame: Math.round(start * FR.fps),
  durationFrames: Math.round((end - start) * FR.fps),
});

export const SCENES: SceneDef[] = [
  scene("hook", "THE RETIREMENT", 0, 7.0),
  scene("transfer", "THE TRANSFER MARKET", 7.0, 15.4),
  scene("signing", "THE SIGNING", 15.4, 23.8),
  scene("preseason", "PRE-SEASON", 23.8, 33.0),
  scene("league", "THE LEAGUE", 33.0, 44.2),
  scene("sale", "THE SALE", 44.2, 55.0),
  scene("return", "THE RETURN", 55.0, 65.8),
  scene("reveal", "THE REVEAL", 65.8, 74.2),
  scene("punchline", "THE PUNCHLINE", 74.2, 80.8),
];

export const SIGN_OFF_START_SECONDS = 80.8;

export const COPY = {
  hookKicker: "INTERNATIONAL  /  RETIREMENT",
  hookLineOne: "RONALDO",
  hookLineTwo: "RETIRED.",
  hookLineThree: "SOME MEN",
  hookLineFour: "ARE STILL",
  hookLineFive: "PLAYING.",
  hookSub: "THREE DIFFERENT LEAGUES?",
  hookFooter: "NO GREETING. NO LOGO. KICK-OFF.",
  transferKicker: "RELATIONSHIP TRANSFER MARKET  /  LIVE",
  transferTitle: ["SCOUTING", "NEGOTIATIONS", "UNSIGNED"],
  transferClubs: ["ATLAS FC", "NORTHGATE", "RIVER END", "ROYAL 04", "MIDNIGHT"],
  signingKicker: "REGISTRATION  /  SIGNING CEREMONY",
  signingTitle: "CONTRACT SIGNED",
  signingSub: "OFFICIALLY HIS NUMBER ONE STRIKER.",
  preseasonKicker: "PRE-SEASON  /  CHEMISTRY",
  preseasonTitle: ["FRIENDLIES", "CHEMISTRY", "BALLON D'OR"],
  preseasonSub: "EVERYBODY IS PLAYING LIKE IT'S A FINAL.",
  leagueKicker: "DOMESTIC LEAGUE  /  MATCHDAY 12",
  leagueTitle: "MINUTES REDUCED",
  leagueSub: "THE TROPHY WAS THE FULL-TIME WHISTLE.",
  leagueRumours: ["TRANSFER RUMOURS", "BENCH", "UNHAPPY", "AGENT SPOTTED"],
  saleKicker: "TRANSFER  /  MUTUAL AGREEMENT",
  saleTitle: "CONTRACT TERMINATED",
  saleSub: "PLAYER SOLD.",
  saleSubTwo: "LOAN DEAL?",
  returnKicker: "TRANSFER WINDOW  /  CLOSED",
  returnTitle: "NEW OFFER RECEIVED",
  returnSub: "NEGOTIATIONS REOPENED.",
  revealKicker: "RELATIONSHIP STATUS  /  UNDEFINED",
  revealTitle: "SITUATIONSHIP",
  revealSub: "WITH FOOTBALL TERMINOLOGY.",
  punchlineKicker: "FULL-TIME",
  punchlineLine: "\u2026IT IS NOT A FOOTBALL CONVERSATION.",
  punchlineTag: "NOT A DRILL. NOT A DERBY.",
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
    margin: FR.margin,
    v: (value: number) => (width / 1080) * value,
  };
};
