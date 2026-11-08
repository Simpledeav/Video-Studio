/**
 * Sound design map for the Kodak case study:
 * "The Future It Invented, But Failed to Master"
 *
 * All cues are referenced to composition seconds.
 * Audio stems:
 * - voice: /public/audio/episodes/kodak/voice.mp3 (EBU R128 mastered, -16 LUFS)
 * - score: /public/audio/episodes/kodak/music/kodak-score-80s.mp3
 * - sfx: /public/audio/episodes/kodak/sfx/*.mp3
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

export const MUSIC_PATH = "audio/episodes/kodak/music/kodak-score-80s.mp3";
export const VOICE_PATH = "audio/episodes/kodak/voice.mp3";

/**
 * Music volume points for dynamic ducking and dramatic structure:
 * - 00:00–00:19: Intimate, minimal ambience under opening contradiction & history (0.16)
 * - 00:19–00:32: Subtle technological pulse as 1975 prototype appears (0.20)
 * - 00:32–00:44: Dual tension building (analog vs digital transition) (0.22)
 * - 00:44–00:56: Darker financial tension during Chapter 11 (0.24)
 * - 00:56–01:11: Open, bright modern transformation (0.24)
 * - 01:11–01:20: Calm, elegant resolution into Simpledeav signature (0.16 -> 0.0)
 */
export const MUSIC_POINTS: MusicPoint[] = [
  { timeSeconds: 0.0, volume: 0.16 },
  { timeSeconds: 8.0, volume: 0.16 },
  { timeSeconds: 19.0, volume: 0.20 },
  { timeSeconds: 32.0, volume: 0.22 },
  { timeSeconds: 44.0, volume: 0.24 },
  { timeSeconds: 53.0, volume: 0.22 },
  { timeSeconds: 56.0, volume: 0.24 },
  { timeSeconds: 67.0, volume: 0.22 },
  { timeSeconds: 71.0, volume: 0.18 },
  { timeSeconds: 77.0, volume: 0.14 },
  { timeSeconds: 80.0, volume: 0.0 },
];

export const SFX: SfxCue[] = [
  // Scene 1: The Contradiction (00:00–00:08)
  {
    id: "s1-photo-shutter",
    path: "audio/episodes/kodak/sfx/camera-shutter.mp3",
    startSeconds: 0.8,
    durationSeconds: 0.45,
    volume: 0.65,
    note: "Shutter click as film photograph appears center",
  },
  {
    id: "s1-photo-slide",
    path: "audio/episodes/kodak/sfx/paper-slide.mp3",
    startSeconds: 3.2,
    durationSeconds: 0.4,
    volume: 0.45,
    note: "Photograph slides left",
  },
  {
    id: "s1-pixel-grid",
    path: "audio/episodes/kodak/sfx/sensor-hum.mp3",
    startSeconds: 4.2,
    durationSeconds: 0.7,
    volume: 0.45,
    note: "Digital pixel grid forms on the right",
  },
  {
    id: "s1-bankruptcy-reveal",
    path: "audio/episodes/kodak/sfx/interface-shift.mp3",
    startSeconds: 5.8,
    durationSeconds: 0.3,
    volume: 0.4,
    note: "Question reveal: SO WHY DID IT FILE FOR BANKRUPTCY?",
  },

  // Scene 2: The Film Giant (00:08–00:19)
  {
    id: "s2-film-wind",
    path: "audio/episodes/kodak/sfx/film-wind.mp3",
    startSeconds: 8.2,
    durationSeconds: 0.65,
    volume: 0.55,
    note: "Tactile film advance lever opens Scene 2",
  },
  {
    id: "s2-roll-place",
    path: "audio/episodes/kodak/sfx/film-roll-place.mp3",
    startSeconds: 9.8,
    durationSeconds: 0.35,
    volume: 0.5,
    note: "Kodak film canister lands into modular grid",
  },
  {
    id: "s2-prints-slide",
    path: "audio/episodes/kodak/sfx/paper-slide.mp3",
    startSeconds: 12.4,
    durationSeconds: 0.4,
    volume: 0.45,
    note: "Printed photographs reveal in grid",
  },
  {
    id: "s2-lab-shift",
    path: "audio/episodes/kodak/sfx/interface-shift.mp3",
    startSeconds: 15.2,
    durationSeconds: 0.3,
    volume: 0.4,
    note: "Film negatives & printing machine label",
  },

  // Scene 3: The Invention (00:19–00:32)
  {
    id: "s3-prototype-enter",
    path: "audio/episodes/kodak/sfx/interface-shift.mp3",
    startSeconds: 19.1,
    durationSeconds: 0.3,
    volume: 0.45,
    note: "1975 prototype entrance",
  },
  {
    id: "s3-sensor-hum",
    path: "audio/episodes/kodak/sfx/sensor-hum.mp3",
    startSeconds: 22.2,
    durationSeconds: 0.8,
    volume: 0.55,
    note: "CCD sensor breakdown callout line",
  },
  {
    id: "s3-pixel-scan",
    path: "audio/episodes/kodak/sfx/pixel-grid-scan.mp3",
    startSeconds: 25.4,
    durationSeconds: 0.7,
    volume: 0.5,
    note: "Zoom into 100x100 pixel B&W image raster",
  },
  {
    id: "s3-data-tick",
    path: "audio/episodes/kodak/sfx/calendar-tick.mp3",
    startSeconds: 28.2,
    durationSeconds: 0.15,
    volume: 0.45,
    note: "23 SECONDS data label locks in",
  },

  // Scene 4: The Business Conflict (00:32–00:44)
  {
    id: "s4-split-enter",
    path: "audio/episodes/kodak/sfx/interface-shift.mp3",
    startSeconds: 32.1,
    durationSeconds: 0.3,
    volume: 0.45,
    note: "Split screen layout reveals: AN ESTABLISHED BUSINESS vs A NEW TECHNOLOGY",
  },
  {
    id: "s4-analog-film",
    path: "audio/episodes/kodak/sfx/film-wind.mp3",
    startSeconds: 35.2,
    durationSeconds: 0.5,
    volume: 0.4,
    note: "Analog film side representation",
  },
  {
    id: "s4-digital-expand",
    path: "audio/episodes/kodak/sfx/pixel-grid-scan.mp3",
    startSeconds: 37.8,
    durationSeconds: 0.65,
    volume: 0.48,
    note: "Digital side expands as analog side contracts",
  },
  {
    id: "s4-conflict-label",
    path: "audio/episodes/kodak/sfx/interface-shift.mp3",
    startSeconds: 41.2,
    durationSeconds: 0.3,
    volume: 0.4,
    note: "THE TRANSITION WAS DIFFICULT locks in",
  },

  // Scene 5: The Collapse (00:44–00:56)
  {
    id: "s5-calendar-tick",
    path: "audio/episodes/kodak/sfx/calendar-tick.mp3",
    startSeconds: 44.2,
    durationSeconds: 0.15,
    volume: 0.5,
    note: "Calendar animation flips to JANUARY 2012",
  },
  {
    id: "s5-data-drop",
    path: "audio/episodes/kodak/sfx/data-drop.mp3",
    startSeconds: 47.6,
    durationSeconds: 0.8,
    volume: 0.65,
    note: "Financial revenue/market cap drop chart",
  },
  {
    id: "s5-chapter11-doc",
    path: "audio/episodes/kodak/sfx/paper-slide.mp3",
    startSeconds: 50.8,
    durationSeconds: 0.4,
    volume: 0.45,
    note: "Chapter 11 filing document placement",
  },

  // Scene 6: The Real Lesson (00:56–01:11)
  {
    id: "s6-transform-scan",
    path: "audio/episodes/kodak/sfx/pixel-grid-scan.mp3",
    startSeconds: 56.2,
    durationSeconds: 0.7,
    volume: 0.48,
    note: "Digital camera morphs into modern smartphone",
  },
  {
    id: "s6-smartphone-shutter",
    path: "audio/episodes/kodak/sfx/camera-shutter.mp3",
    startSeconds: 60.2,
    durationSeconds: 0.45,
    volume: 0.55,
    note: "Instant photo capture on smartphone screen",
  },
  {
    id: "s6-grid-expand",
    path: "audio/episodes/kodak/sfx/interface-shift.mp3",
    startSeconds: 63.8,
    durationSeconds: 0.3,
    volume: 0.45,
    note: "Cloud photo library expansion",
  },
  {
    id: "s6-timeline-tick",
    path: "audio/episodes/kodak/sfx/calendar-tick.mp3",
    startSeconds: 67.2,
    durationSeconds: 0.15,
    volume: 0.4,
    note: "Visual timeline locks: FILM -> DIGITAL CAMERA -> SMARTPHONE",
  },

  // Scene 7: The Closing (01:11–01:20)
  {
    id: "s7-single-photo",
    path: "audio/episodes/kodak/sfx/paper-slide.mp3",
    startSeconds: 71.2,
    durationSeconds: 0.4,
    volume: 0.45,
    note: "Single physical photograph appears on clean ivory canvas",
  },
  {
    id: "s7-pixel-transform",
    path: "audio/episodes/kodak/sfx/sensor-hum.mp3",
    startSeconds: 73.2,
    durationSeconds: 0.8,
    volume: 0.45,
    note: "Photo transforms to digital image and joins grid",
  },
  {
    id: "s7-brand-bell",
    path: "audio/episodes/kodak/sfx/brand-signature.mp3",
    startSeconds: 76.4,
    durationSeconds: 2.4,
    volume: 0.65,
    note: "Warm Simpledeav closing sign-off bell",
  },
];
