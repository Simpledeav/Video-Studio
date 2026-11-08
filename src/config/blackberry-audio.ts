/**
 * Sound design map for the BlackBerry case study.
 *
 * All cues are referenced to composition seconds.
 * Audio stems:
 * - voice: /public/audio/episodes/blackberry/voice.mp3 (EBU R128 mastered)
 * - score: /public/audio/episodes/blackberry/music/blackberry-score-80s.mp3
 * - sfx: /public/audio/episodes/blackberry/sfx/*.mp3
 */

export type SfxCue = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
  note?: string;
};

export type MusicPoint = {
  timeSeconds: number;
  volume: number;
};

export const MUSIC_PATH = "audio/episodes/blackberry/music/blackberry-score-80s.mp3";
export const VOICE_PATH = "audio/episodes/blackberry/voice.mp3";

/**
 * Music volume points for dynamic ducking and dramatic structure:
 * - 00:00–00:19: Intimate, clean pulse under opening questions (0.16)
 * - 00:19–00:43: Subtle lift as industry changes (0.19)
 * - 00:43–00:56: Electronic tension builds during the market share chart (0.24)
 * - 00:56–01:09: Warm, open transformation (0.22)
 * - 01:09–01:20: Calm resolution into Simpledeav signature (0.16 -> 0.05)
 */
export const MUSIC_POINTS: MusicPoint[] = [
  { timeSeconds: 0.0, volume: 0.16 },
  { timeSeconds: 8.0, volume: 0.16 },
  { timeSeconds: 19.0, volume: 0.19 },
  { timeSeconds: 31.0, volume: 0.18 },
  { timeSeconds: 43.0, volume: 0.24 },
  { timeSeconds: 53.0, volume: 0.22 },
  { timeSeconds: 56.0, volume: 0.23 },
  { timeSeconds: 67.0, volume: 0.20 },
  { timeSeconds: 69.0, volume: 0.17 },
  { timeSeconds: 78.0, volume: 0.14 },
  { timeSeconds: 80.0, volume: 0.0 },
];

export const SFX: SfxCue[] = [
  // Scene 1: The Question
  {
    id: "s1-open-pulse",
    path: "audio/episodes/blackberry/sfx/low-pulse.mp3",
    startSeconds: 0.1,
    durationSeconds: 0.6,
    volume: 0.65,
    note: "Opening restrained editorial pulse",
  },
  {
    id: "s1-headline-reveal",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 1.6,
    durationSeconds: 0.35,
    volume: 0.45,
    note: "Headline entrance: EVERYONE WANTED ONE",
  },
  {
    id: "s1-phone-shift",
    path: "audio/episodes/blackberry/sfx/digital-click.mp3",
    startSeconds: 4.2,
    durationSeconds: 0.1,
    volume: 0.4,
    note: "Phone shift to THEN THE WORLD MOVED ON",
  },

  // Scene 2: The Dominance
  {
    id: "s2-grid-reveal",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 8.1,
    durationSeconds: 0.35,
    volume: 0.4,
    note: "Device showcase grid enter",
  },
  {
    id: "s2-keyboard-typing",
    path: "audio/episodes/blackberry/sfx/keyboard-burst.mp3",
    startSeconds: 10.4,
    durationSeconds: 0.45,
    volume: 0.55,
    note: "Tactile keyboard typing close-up",
  },
  {
    id: "s2-data-tick",
    path: "audio/episodes/blackberry/sfx/data-tick.mp3",
    startSeconds: 13.8,
    durationSeconds: 0.1,
    volume: 0.5,
    note: "19.9% metric counter trigger",
  },
  {
    id: "s2-badge-click",
    path: "audio/episodes/blackberry/sfx/digital-click.mp3",
    startSeconds: 14.5,
    durationSeconds: 0.1,
    volume: 0.4,
    note: "Market share badge lock",
  },

  // Scene 3: The Industry Changes
  {
    id: "s3-split-reveal",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 19.1,
    durationSeconds: 0.35,
    volume: 0.4,
    note: "Comparison split screen enter",
  },
  {
    id: "s3-key-tap",
    path: "audio/episodes/blackberry/sfx/keyboard-tap.mp3",
    startSeconds: 21.2,
    durationSeconds: 0.1,
    volume: 0.45,
    note: "Keyboard philosophy highlight",
  },
  {
    id: "s3-touch-tap",
    path: "audio/episodes/blackberry/sfx/touch-tap.mp3",
    startSeconds: 24.6,
    durationSeconds: 0.12,
    volume: 0.55,
    note: "Touchscreen interaction pulse",
  },
  {
    id: "s3-shift-panel",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 27.2,
    durationSeconds: 0.35,
    volume: 0.4,
    note: "Touchscreen panel expansion",
  },

  // Scene 4: The Missed Shift
  {
    id: "s4-diagram-reveal",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 31.2,
    durationSeconds: 0.35,
    volume: 0.4,
    note: "Ecosystem diagram components enter",
  },
  {
    id: "s4-node-click",
    path: "audio/episodes/blackberry/sfx/digital-click.mp3",
    startSeconds: 34.0,
    durationSeconds: 0.1,
    volume: 0.42,
    note: "App ecosystem node connects",
  },
  {
    id: "s4-network-transform",
    path: "audio/episodes/blackberry/sfx/system-transform.mp3",
    startSeconds: 37.8,
    durationSeconds: 0.7,
    volume: 0.5,
    note: "Ecosystem outgrows device",
  },

  // Scene 5: The Numbers Tell the Story
  {
    id: "s5-chart-enter",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 43.1,
    durationSeconds: 0.35,
    volume: 0.45,
    note: "Swiss chart grid draw",
  },
  {
    id: "s5-chart-drop",
    path: "audio/episodes/blackberry/sfx/chart-fall.mp3",
    startSeconds: 46.2,
    durationSeconds: 1.4,
    volume: 0.6,
    note: "Market share line drop 19.9% to 0.05%",
  },
  {
    id: "s5-drop-tick",
    path: "audio/episodes/blackberry/sfx/data-tick.mp3",
    startSeconds: 50.4,
    durationSeconds: 0.1,
    volume: 0.5,
    note: "0.05% callout badge locks",
  },

  // Scene 6: The Transformation
  {
    id: "s6-transform-shimmer",
    path: "audio/episodes/blackberry/sfx/system-transform.mp3",
    startSeconds: 56.2,
    durationSeconds: 0.7,
    volume: 0.55,
    note: "Pivot from phone hardware to cybersecurity",
  },
  {
    id: "s6-software-click",
    path: "audio/episodes/blackberry/sfx/digital-click.mp3",
    startSeconds: 60.8,
    durationSeconds: 0.1,
    volume: 0.4,
    note: "Enterprise security architecture locks",
  },
  {
    id: "s6-security-pulse",
    path: "audio/episodes/blackberry/sfx/low-pulse.mp3",
    startSeconds: 64.2,
    durationSeconds: 0.6,
    volume: 0.45,
    note: "Software & Security badge confirmation",
  },

  // Scene 7: The Business Lesson
  {
    id: "s7-lesson-reveal",
    path: "audio/episodes/blackberry/sfx/editorial-reveal.mp3",
    startSeconds: 69.1,
    durationSeconds: 0.35,
    volume: 0.4,
    note: "WHAT WORKS TODAY statement enter",
  },
  {
    id: "s7-pivot-click",
    path: "audio/episodes/blackberry/sfx/digital-click.mp3",
    startSeconds: 73.8,
    durationSeconds: 0.1,
    volume: 0.42,
    note: "Focus shifts to WHAT THE FUTURE NEEDS",
  },
  {
    id: "s7-brand-signature",
    path: "audio/episodes/blackberry/sfx/brand-signature.mp3",
    startSeconds: 78.6,
    durationSeconds: 1.2,
    volume: 0.7,
    note: "Simpledeav closing signature chime",
  },
];
