export const VOICE_PATH = "audio/episodes/coinbase/voice.mp3";
export const MUSIC_PATH = "audio/episodes/coinbase/music/coinbase-bed-88s.mp3";

export type SfxCue = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
};

const AIRBNB_SFX = new Set([
  "opening-impact.mp3",
  "low-impact.mp3",
  "riser.mp3",
  "soft-whoosh.mp3",
  "transition-whoosh.mp3",
  "brand-sting.mp3",
]);

const sfx = (
  id: string,
  file: string,
  startSeconds: number,
  durationSeconds: number,
  volume: number,
): SfxCue => ({
  id,
  path: `audio/episodes/${AIRBNB_SFX.has(file) ? "airbnb" : "blackberry"}/sfx/${file}`,
  startSeconds,
  durationSeconds,
  volume,
  fadeInSeconds: 0.03,
  fadeOutSeconds: Math.min(0.3, durationSeconds * 0.4),
});

/**
 * One intentional sound per story beat. Impacts never stack inside 0.12s.
 * The voice is the master clock; these cues sit under it.
 */
export const SFX: SfxCue[] = [
  sfx("open-impact", "opening-impact.mp3", 0.1, 1.8, 0.38),
  sfx("keys-1", "keyboard-burst.mp3", 0.62, 0.45, 0.22),
  sfx("keys-2", "keyboard-burst.mp3", 1.35, 0.45, 0.16),
  sfx("freeze-tick", "data-tick.mp3", 2.1, 0.12, 0.3),
  sfx("pr-whoosh", "soft-whoosh.mp3", 2.42, 1.1, 0.3),
  sfx("pr-ready", "editorial-reveal.mp3", 4.55, 0.35, 0.3),
  sfx("cut-1", "transition-whoosh.mp3", 6.65, 1.1, 0.3),
  sfx("old-pulse", "low-pulse.mp3", 7.55, 0.6, 0.3),
  sfx("old-tick-1", "data-tick.mp3", 9.0, 0.14, 0.16),
  sfx("old-tick-2", "data-tick.mp3", 12.4, 0.14, 0.16),
  sfx("review-stall", "data-tick.mp3", 15.55, 0.18, 0.18),
  sfx("process-pulse", "low-pulse.mp3", 16.45, 0.6, 0.34),
  sfx("shift-transform", "system-transform.mp3", 19.55, 0.7, 0.3),
  sfx("shift-keys", "keyboard-burst.mp3", 22.75, 0.45, 0.28),
  sfx("shift-click", "digital-click.mp3", 25.35, 0.12, 0.22),
  sfx("queue-tick", "data-tick.mp3", 27.4, 0.14, 0.22),
  sfx("human-rail", "editorial-reveal.mp3", 29.55, 0.35, 0.26),
  sfx("agents-done", "data-tick.mp3", 31.2, 0.14, 0.18),
  sfx("cut-2", "transition-whoosh.mp3", 33.65, 1.1, 0.26),
  sfx("stat-impact", "low-impact.mp3", 35.15, 1.3, 0.32),
  sfx("stat-tick-1", "data-tick.mp3", 36.15, 0.14, 0.2),
  sfx("stat-tick-2", "data-tick.mp3", 38.2, 0.14, 0.2),
  sfx("stat-tick-3", "data-tick.mp3", 40.2, 0.14, 0.2),
  sfx("stat-reveal", "editorial-reveal.mp3", 42.0, 0.35, 0.32),
  sfx("cut-3", "soft-whoosh.mp3", 43.6, 1.1, 0.26),
  sfx("speed-impact", "low-impact.mp3", 48.15, 1.3, 0.36),
  sfx("speed-tick-1", "data-tick.mp3", 49.0, 0.14, 0.2),
  sfx("speed-tick-2", "data-tick.mp3", 50.55, 0.14, 0.18),
  sfx("compress-fall", "chart-fall.mp3", 52.65, 1.4, 0.16),
  sfx("speed-snap", "low-impact.mp3", 53.35, 1.1, 0.36),
  sfx("speed-reveal", "editorial-reveal.mp3", 55.1, 0.35, 0.24),
  sfx("cut-4", "soft-whoosh.mp3", 57.85, 1.1, 0.24),
  sfx("prod-impact", "low-impact.mp3", 62.1, 1.2, 0.28),
  sfx("prod-tick-1", "data-tick.mp3", 63.2, 0.14, 0.2),
  sfx("prod-tick-2", "data-tick.mp3", 65.1, 0.14, 0.22),
  sfx("prod-tick-3", "data-tick.mp3", 68.15, 0.14, 0.2),
  sfx("prod-reveal", "editorial-reveal.mp3", 70.0, 0.35, 0.28),
  sfx("cut-5", "soft-whoosh.mp3", 73.3, 1.1, 0.24),
  sfx("close-impact", "low-impact.mp3", 76.05, 1.4, 0.3),
  sfx("close-pulse", "low-pulse.mp3", 77.5, 0.6, 0.24),
  sfx("close-riser", "riser.mp3", 82.0, 3.2, 0.1),
  sfx("close-whoosh", "soft-whoosh.mp3", 84.2, 1.1, 0.2),
  sfx("brand-signature", "brand-signature.mp3", 88.3, 1.2, 0.3),
  sfx("brand-sting", "brand-sting.mp3", 89.1, 2.6, 0.26),
];

export const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.1 },
  { timeSeconds: 6.9, volume: 0.145 },
  { timeSeconds: 20, volume: 0.165 },
  { timeSeconds: 35, volume: 0.2 },
  { timeSeconds: 48, volume: 0.205 },
  { timeSeconds: 62, volume: 0.18 },
  { timeSeconds: 76, volume: 0.16 },
  { timeSeconds: 84, volume: 0.12 },
  { timeSeconds: 88, volume: 0.0 },
] as const;
