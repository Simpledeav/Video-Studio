export const VOICE_PATH = "audio/episodes/football/voice.mp3";

/** Dark, cinematic documentary bed for the setup. */
export const MUSIC_A_PATH = "audio/episodes/blackberry/music/blackberry-score-80s.mp3";
/** Warmer, playful bed that takes over once the joke becomes obvious. */
export const MUSIC_B_PATH = "audio/episodes/airbnb/music/airbnb-bed-80s.mp3";
export const MUSIC_B_START_SECONDS = 16;
export const CROWD_PATH = "audio/episodes/football/sfx/crowd-loop.mp3";

export type SfxCue = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
};

const sfx = (
  id: string,
  file: string,
  startSeconds: number,
  durationSeconds: number,
  volume: number,
): SfxCue => ({
  id,
  path: file,
  startSeconds,
  durationSeconds,
  volume,
  fadeInSeconds: 0.05,
  fadeOutSeconds: Math.min(0.3, durationSeconds * 0.35),
});

const AIRBNB = "audio/episodes/airbnb/sfx";
const BLACKBERRY = "audio/episodes/blackberry/sfx";
const AI_AGENT = "audio/episodes/ai-agent/sfx";
const KODAK = "audio/episodes/kodak/sfx";
const FOOTBALL = "audio/episodes/football/sfx";

/**
 * One intentional sound per beat. The whistle opens, paper and stamps carry the
 * contract jokes, and the last cue lands on the punchline — never on every cut.
 */
export const SFX: SfxCue[] = [
  sfx("open-impact", `${AIRBNB}/opening-impact.mp3`, 0.05, 1.9, 0.34),
  sfx("open-whistle", `${FOOTBALL}/referee-whistle.mp3`, 0.62, 0.8, 0.22),
  sfx("hook-low", `${AIRBNB}/low-impact.mp3`, 3.25, 1.8, 0.3),
  sfx("hook-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 6.15, 1.2, 0.2),

  sfx("market-tick-1", `${BLACKBERRY}/data-tick.mp3`, 7.35, 0.12, 0.15),
  sfx("market-tick-2", `${BLACKBERRY}/data-tick.mp3`, 8.25, 0.12, 0.14),
  sfx("market-tick-3", `${BLACKBERRY}/data-tick.mp3`, 9.2, 0.12, 0.15),
  sfx("market-tick-4", `${BLACKBERRY}/data-tick.mp3`, 10.25, 0.12, 0.14),
  sfx("market-tick-5", `${BLACKBERRY}/data-tick.mp3`, 11.25, 0.12, 0.15),
  sfx("market-click", `${BLACKBERRY}/digital-click.mp3`, 12.55, 0.1, 0.16),
  sfx("market-stamp", `${FOOTBALL}/contract-stamp.mp3`, 13.15, 0.5, 0.18),
  sfx("market-cut", `${AIRBNB}/transition-whoosh.mp3`, 14.55, 1.2, 0.2),

  sfx("sign-paper", `${AIRBNB}/paper-slide.mp3`, 15.65, 0.8, 0.14),
  sfx("sign-pen", `${BLACKBERRY}/keyboard-tap.mp3`, 17.05, 0.16, 0.16),
  sfx("sign-stamp", `${FOOTBALL}/contract-stamp.mp3`, 17.95, 0.55, 0.3),
  sfx("sign-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 18.75, 0.4, 0.22),
  sfx("sign-card", `${AIRBNB}/camera-shutter.mp3`, 19.55, 0.5, 0.2),
  sfx("sign-success", `${AI_AGENT}/success-notification.mp3`, 20.7, 1.6, 0.13),
  sfx("sign-cut", `${AIRBNB}/soft-whoosh.mp3`, 22.75, 1.1, 0.18),

  sfx("pre-whistle", `${FOOTBALL}/referee-whistle.mp3`, 24.45, 0.8, 0.16),
  sfx("pre-kick-1", `${FOOTBALL}/ball-kick.mp3`, 25.35, 0.4, 0.24),
  sfx("pre-kick-2", `${FOOTBALL}/ball-kick.mp3`, 27.6, 0.4, 0.2),
  sfx("pre-cheer", `${FOOTBALL}/crowd-swell.mp3`, 29.2, 2.6, 0.14),
  sfx("pre-tick", `${BLACKBERRY}/data-tick.mp3`, 31.0, 0.12, 0.12),
  sfx("pre-cut", `${AIRBNB}/transition-whoosh.mp3`, 32.15, 1.15, 0.19),

  sfx("league-pulse", `${BLACKBERRY}/low-pulse.mp3`, 33.35, 0.7, 0.2),
  sfx("league-tick", `${BLACKBERRY}/data-tick.mp3`, 34.6, 0.12, 0.14),
  sfx("league-fall", `${BLACKBERRY}/chart-fall.mp3`, 36.9, 1.4, 0.18),
  sfx("league-low", `${AIRBNB}/low-impact.mp3`, 39.15, 1.7, 0.22),
  sfx("league-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 40.35, 0.4, 0.18),
  sfx("league-cut", `${AIRBNB}/soft-whoosh.mp3`, 43.25, 1.15, 0.19),

  sfx("sale-paper", `${AIRBNB}/paper-crinkle.mp3`, 44.45, 0.9, 0.16),
  sfx("sale-stamp", `${FOOTBALL}/contract-stamp.mp3`, 48.35, 0.6, 0.32),
  sfx("sale-low", `${AIRBNB}/low-impact.mp3`, 49.05, 1.7, 0.24),
  sfx("sale-tick", `${BLACKBERRY}/data-tick.mp3`, 51.3, 0.12, 0.13),
  sfx("sale-loan", `${BLACKBERRY}/system-transform.mp3`, 52.2, 0.7, 0.18),
  sfx("sale-cut", `${AIRBNB}/transition-whoosh.mp3`, 53.9, 1.1, 0.18),

  sfx("return-notify", `${FOOTBALL}/phone-notification.mp3`, 55.55, 1.1, 0.3),
  sfx("return-tick", `${BLACKBERRY}/data-tick.mp3`, 57.1, 0.12, 0.13),
  sfx("return-offer", `${FOOTBALL}/phone-notification.mp3`, 60.35, 1.1, 0.22),
  sfx("return-transform", `${BLACKBERRY}/system-transform.mp3`, 61.85, 0.7, 0.18),
  sfx("return-reopen", `${BLACKBERRY}/editorial-reveal.mp3`, 62.75, 0.4, 0.2),
  sfx("return-cut", `${AIRBNB}/transition-whoosh.mp3`, 64.35, 1.15, 0.18),

  sfx("reveal-pulse", `${BLACKBERRY}/low-pulse.mp3`, 66.2, 0.7, 0.18),
  sfx("reveal-strike", `${BLACKBERRY}/digital-click.mp3`, 67.2, 0.1, 0.15),
  sfx("reveal-drop", `${KODAK}/data-drop.mp3`, 68.3, 0.9, 0.2),
  sfx("reveal-status", `${AI_AGENT}/success-notification.mp3`, 70.4, 1.4, 0.12),
  sfx("reveal-riser", `${AIRBNB}/riser.mp3`, 72.2, 2.4, 0.09),

  sfx("punch-low", `${AIRBNB}/low-impact.mp3`, 75.25, 2.0, 0.28),
  sfx("punch-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 76.2, 1.1, 0.16),
  sfx("punch-crowd", `${FOOTBALL}/crowd-swell.mp3`, 77.0, 2.6, 0.12),
  sfx("brand-signature", `${BLACKBERRY}/brand-signature.mp3`, 80.9, 1.2, 0.26),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 81.35, 2.6, 0.2),
];

export const MUSIC_A_POINTS = [
  { timeSeconds: 0, volume: 0.07 },
  { timeSeconds: 7.0, volume: 0.12 },
  { timeSeconds: 15.4, volume: 0.14 },
  { timeSeconds: 23.8, volume: 0.13 },
  { timeSeconds: 33.0, volume: 0.11 },
  { timeSeconds: 40.0, volume: 0.05 },
  { timeSeconds: 46.0, volume: 0.0 },
  { timeSeconds: 84.0, volume: 0.0 },
] as const;

/** Bed B starts at 16s; these points are measured from its own first frame. */
export const MUSIC_B_POINTS = [
  { timeSeconds: 0, volume: 0.0 },
  { timeSeconds: 7.0, volume: 0.055 },
  { timeSeconds: 17.0, volume: 0.1 },
  { timeSeconds: 28.0, volume: 0.105 },
  { timeSeconds: 39.0, volume: 0.09 },
  { timeSeconds: 49.8, volume: 0.12 },
  { timeSeconds: 58.8, volume: 0.13 },
  { timeSeconds: 64.8, volume: 0.09 },
  { timeSeconds: 68.0, volume: 0.13 },
  { timeSeconds: 74.2, volume: 0.16 },
  { timeSeconds: 80.8, volume: 0.07 },
  { timeSeconds: 84.0, volume: 0.0 },
] as const;
