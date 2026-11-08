export const VOICE_PATH = "audio/episodes/security/voice.mp3";
/** Existing licensed cinematic bed, reused rather than sourcing a new track. */
export const MUSIC_PATH = "audio/episodes/ai-agent/music/silent-descent-90s.mp3";

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
  fadeInSeconds: 0.04,
  fadeOutSeconds: Math.min(0.32, durationSeconds * 0.4),
});

const AIRBNB = "audio/episodes/airbnb/sfx";
const BLACKBERRY = "audio/episodes/blackberry/sfx";
const AI_AGENT = "audio/episodes/ai-agent/sfx";
const KODAK = "audio/episodes/kodak/sfx";

/**
 * One sound per story beat. Every file already exists in the project.
 * Cue starts are authored in film seconds; the voice remains the master clock.
 */
export const SFX: SfxCue[] = [
  sfx("open-impact", `${AIRBNB}/opening-impact.mp3`, 0.25, 1.8, 0.34),
  sfx("open-tick", `${BLACKBERRY}/data-tick.mp3`, 1.2, 0.12, 0.14),
  sfx("boundary-break", `${AIRBNB}/low-impact.mp3`, 2.55, 1.7, 0.32),
  sfx("hook-tick", `${BLACKBERRY}/data-tick.mp3`, 3.15, 0.12, 0.13),
  sfx("hook-cut", `${AIRBNB}/transition-whoosh.mp3`, 5.45, 1.2, 0.2),

  sfx("business-click", `${BLACKBERRY}/digital-click.mp3`, 6.5, 0.08, 0.14),
  sfx("business-tick", `${BLACKBERRY}/data-tick.mp3`, 8.2, 0.12, 0.14),
  sfx("business-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 10.4, 0.35, 0.2),
  sfx("business-cut", `${AIRBNB}/transition-whoosh.mp3`, 13.8, 1.2, 0.2),

  sfx("auth-click", `${BLACKBERRY}/digital-click.mp3`, 14.3, 0.08, 0.14),
  sfx("auth-success", `${AI_AGENT}/success-notification.mp3`, 16.9, 2.0, 0.12),
  sfx("auth-missing", `${BLACKBERRY}/data-tick.mp3`, 18.8, 0.12, 0.16),
  sfx("auth-cut", `${AIRBNB}/soft-whoosh.mp3`, 21.8, 1.1, 0.18),

  sfx("mistake-transform", `${BLACKBERRY}/system-transform.mp3`, 23.1, 0.7, 0.2),
  sfx("mistake-click", `${BLACKBERRY}/digital-click.mp3`, 25.0, 0.08, 0.14),
  sfx("mistake-tick", `${BLACKBERRY}/data-tick.mp3`, 26.6, 0.12, 0.14),
  sfx("mistake-cut", `${AIRBNB}/transition-whoosh.mp3`, 30.2, 1.1, 0.2),

  sfx("exposure-hit", `${AI_AGENT}/tension-hit.mp3`, 33.05, 3.4, 0.26),
  sfx("exposure-fall", `${BLACKBERRY}/chart-fall.mp3`, 34.8, 1.4, 0.18),
  sfx("exposure-drop", `${KODAK}/data-drop.mp3`, 36.2, 0.8, 0.22),
  sfx("exposure-impact", `${AIRBNB}/low-impact.mp3`, 38.0, 1.8, 0.26),
  sfx("exposure-cut", `${AIRBNB}/soft-whoosh.mp3`, 40.8, 1.1, 0.18),

  sfx("impact-pulse", `${BLACKBERRY}/low-pulse.mp3`, 45.05, 0.6, 0.2),
  sfx("impact-tick", `${BLACKBERRY}/data-tick.mp3`, 46.4, 0.12, 0.14),
  sfx("impact-click", `${BLACKBERRY}/digital-click.mp3`, 48.0, 0.08, 0.14),
  sfx("impact-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 50.2, 0.35, 0.18),
  sfx("impact-cut", `${AIRBNB}/transition-whoosh.mp3`, 53.2, 1.1, 0.18),

  sfx("solution-transform", `${BLACKBERRY}/system-transform.mp3`, 55.05, 0.7, 0.22),
  sfx("solution-click", `${BLACKBERRY}/digital-click.mp3`, 57.0, 0.08, 0.14),
  sfx("solution-tick", `${BLACKBERRY}/data-tick.mp3`, 59.0, 0.12, 0.14),
  sfx("solution-success", `${AI_AGENT}/success-notification.mp3`, 61.0, 2.4, 0.14),
  sfx("solution-click-2", `${BLACKBERRY}/digital-click.mp3`, 64.0, 0.08, 0.14),
  sfx("solution-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 66.0, 0.35, 0.18),
  sfx("solution-tick-2", `${BLACKBERRY}/data-tick.mp3`, 69.0, 0.12, 0.14),
  sfx("solution-cut", `${AIRBNB}/soft-whoosh.mp3`, 72.4, 1.1, 0.18),

  sfx("close-success", `${AI_AGENT}/success-notification.mp3`, 73.0, 2.4, 0.12),
  sfx("close-tick", `${BLACKBERRY}/data-tick.mp3`, 76.0, 0.12, 0.12),
  sfx("brand-signature", `${BLACKBERRY}/brand-signature.mp3`, 79.5, 1.2, 0.26),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 80.2, 3.2, 0.22),
];

export const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.08 },
  { timeSeconds: 5.5, volume: 0.13 },
  { timeSeconds: 14, volume: 0.15 },
  { timeSeconds: 23, volume: 0.16 },
  { timeSeconds: 33, volume: 0.185 },
  { timeSeconds: 45, volume: 0.155 },
  { timeSeconds: 55, volume: 0.15 },
  { timeSeconds: 72.5, volume: 0.14 },
  { timeSeconds: 80, volume: 0.11 },
  { timeSeconds: 84.6, volume: 0 },
] as const;
