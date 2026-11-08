export const VOICE_PATH = "audio/episodes/replit/voice.mp3";
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
 * One intentional sound per story beat. The voice is the master clock.
 * All assets already exist in the project; no new audio library is introduced.
 */
export const SFX: SfxCue[] = [
  sfx("open-impact", `${AIRBNB}/opening-impact.mp3`, 0.08, 1.8, 0.36),
  sfx("open-tick", `${BLACKBERRY}/data-tick.mp3`, 1.42, 0.12, 0.16),
  sfx("delete-impact", `${AIRBNB}/low-impact.mp3`, 1.66, 1.7, 0.38),
  sfx("delete-fall", `${BLACKBERRY}/chart-fall.mp3`, 1.8, 1.4, 0.16),
  sfx("hook-cut", `${AIRBNB}/soft-whoosh.mp3`, 2.95, 1.1, 0.18),
  sfx("hook-tick", `${BLACKBERRY}/data-tick.mp3`, 4.2, 0.12, 0.14),
  sfx("hook-transition", `${AIRBNB}/transition-whoosh.mp3`, 5.2, 1.2, 0.22),

  sfx("build-keys-1", `${BLACKBERRY}/keyboard-burst.mp3`, 8.55, 0.45, 0.18),
  sfx("build-keys-2", `${BLACKBERRY}/keyboard-burst.mp3`, 9.2, 0.45, 0.14),
  sfx("build-click", `${BLACKBERRY}/digital-click.mp3`, 10.4, 0.08, 0.16),
  sfx("build-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 11.7, 0.35, 0.22),
  sfx("build-tick", `${BLACKBERRY}/data-tick.mp3`, 13.0, 0.12, 0.14),
  sfx("build-transform", `${BLACKBERRY}/system-transform.mp3`, 14.6, 0.7, 0.2),
  sfx("build-cut", `${AIRBNB}/transition-whoosh.mp3`, 17.3, 1.1, 0.2),

  sfx("data-tick-1", `${BLACKBERRY}/data-tick.mp3`, 18.55, 0.12, 0.16),
  sfx("data-tick-2", `${BLACKBERRY}/data-tick.mp3`, 19.7, 0.12, 0.16),
  sfx("data-tick-3", `${BLACKBERRY}/data-tick.mp3`, 21.1, 0.12, 0.16),
  sfx("data-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 22.9, 0.35, 0.24),
  sfx("data-cut", `${AIRBNB}/soft-whoosh.mp3`, 25.3, 1.1, 0.2),

  sfx("freeze-transform", `${BLACKBERRY}/system-transform.mp3`, 26.65, 0.7, 0.22),
  sfx("freeze-pulse", `${BLACKBERRY}/low-pulse.mp3`, 27.4, 0.6, 0.22),
  sfx("freeze-click", `${BLACKBERRY}/digital-click.mp3`, 28.4, 0.08, 0.2),
  sfx("freeze-tick", `${BLACKBERRY}/data-tick.mp3`, 30.5, 0.12, 0.14),
  sfx("freeze-cut", `${AIRBNB}/soft-whoosh.mp3`, 32.5, 1.1, 0.2),

  sfx("failure-pulse", `${BLACKBERRY}/low-pulse.mp3`, 33.5, 0.6, 0.22),
  sfx("failure-riser", `${AIRBNB}/riser.mp3`, 34.4, 2.2, 0.1),
  sfx("failure-hit", `${AI_AGENT}/tension-hit.mp3`, 35.15, 3.4, 0.26),
  sfx("failure-fall", `${BLACKBERRY}/chart-fall.mp3`, 36.5, 1.4, 0.2),
  sfx("failure-drop", `${KODAK}/data-drop.mp3`, 37.7, 0.8, 0.24),
  sfx("failure-impact", `${AIRBNB}/low-impact.mp3`, 38.9, 1.8, 0.28),
  sfx("failure-tick", `${BLACKBERRY}/data-tick.mp3`, 40.1, 0.12, 0.14),
  sfx("failure-cut", `${AIRBNB}/soft-whoosh.mp3`, 42.3, 1.1, 0.2),

  sfx("recovery-tick", `${BLACKBERRY}/data-tick.mp3`, 43.9, 0.12, 0.16),
  sfx("recovery-transform", `${BLACKBERRY}/system-transform.mp3`, 45.2, 0.7, 0.18),
  sfx("recovery-drop", `${KODAK}/data-drop.mp3`, 46.2, 0.8, 0.16),
  sfx("recovery-click", `${BLACKBERRY}/digital-click.mp3`, 47.2, 0.08, 0.18),
  sfx("recovery-success", `${AI_AGENT}/success-notification.mp3`, 48.3, 2.4, 0.16),
  sfx("recovery-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 50.1, 0.35, 0.22),
  sfx("recovery-cut", `${AIRBNB}/transition-whoosh.mp3`, 50.75, 1.1, 0.2),

  sfx("lesson-pulse", `${BLACKBERRY}/low-pulse.mp3`, 52.2, 0.6, 0.2),
  sfx("lesson-tick-1", `${BLACKBERRY}/data-tick.mp3`, 53.7, 0.12, 0.14),
  sfx("lesson-click", `${BLACKBERRY}/digital-click.mp3`, 55.1, 0.08, 0.16),
  sfx("lesson-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 56.8, 0.35, 0.2),
  sfx("lesson-tick-2", `${BLACKBERRY}/data-tick.mp3`, 58.5, 0.12, 0.14),
  sfx("lesson-click-2", `${BLACKBERRY}/digital-click.mp3`, 60.0, 0.08, 0.16),
  sfx("lesson-transform", `${BLACKBERRY}/system-transform.mp3`, 62.0, 0.7, 0.18),
  sfx("lesson-cut", `${AIRBNB}/soft-whoosh.mp3`, 64.7, 1.1, 0.2),

  sfx("close-success", `${AI_AGENT}/success-notification.mp3`, 66.2, 2.4, 0.14),
  sfx("close-impact", `${AIRBNB}/low-impact.mp3`, 68.5, 1.8, 0.18),
  sfx("close-tick", `${BLACKBERRY}/data-tick.mp3`, 71.0, 0.12, 0.12),
  sfx("close-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 73.8, 0.35, 0.18),
  sfx("close-question", `${AIRBNB}/transition-whoosh.mp3`, 76.7, 1.2, 0.18),
  sfx("close-riser", `${AIRBNB}/riser.mp3`, 78.0, 2.2, 0.09),
  sfx("brand-signature", `${BLACKBERRY}/brand-signature.mp3`, 79.3, 1.2, 0.28),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 80.2, 3.2, 0.22),
];

export const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.08 },
  { timeSeconds: 7.6, volume: 0.13 },
  { timeSeconds: 17.4, volume: 0.15 },
  { timeSeconds: 25.4, volume: 0.16 },
  { timeSeconds: 33.0, volume: 0.18 },
  { timeSeconds: 42.2, volume: 0.15 },
  { timeSeconds: 50.8, volume: 0.17 },
  { timeSeconds: 64.8, volume: 0.14 },
  { timeSeconds: 79.8, volume: 0.1 },
  { timeSeconds: 84.6, volume: 0.0 },
] as const;
