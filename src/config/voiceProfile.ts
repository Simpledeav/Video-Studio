/**
 * Voice-profile metadata shared by the Remotion side of the voice extension.
 *
 * The generated voiceover manifest is the source of truth for timing, audio
 * paths and subtitle cues. Nothing is estimated from word counts at render time.
 */
export type VoiceoverCue = {
  start: number;
  end: number;
  text: string;
};

export type VoiceoverScene = {
  id: string;
  index: number;
  text: string;
  preset: string;
  startSeconds: number;
  endSeconds: number;
  durationSeconds: number;
  audioPath: string;
  cacheKey?: string;
  cached?: boolean;
  review?: string | null;
};

export type VoiceoverMetadata = {
  schemaVersion: string;
  slug: string;
  title: string;
  profile: {
    id: string;
    displayName: string;
    language: string;
    accent: string;
    reference: string;
  };
  engine: {
    id: string;
    name: string;
    license: string;
    commercialUse: boolean;
  };
  totalDurationSeconds: number;
  leadInSeconds: number;
  scenes: VoiceoverScene[];
  files: {
    fullWav: string;
    fullMp3?: string | null;
    words: string;
    cues: string;
    vtt: string;
    metadata: string;
  };
  review: {
    needsReview: boolean;
    warnings: string[];
    rule?: string;
  };
  quality?: Record<string, number>;
};

export const VOICE_PROFILE_ID = "david_nigerian_english";
export const VOICE_PROFILE_NAME = "David Nigerian English — Cinematic Documentary Voice";

/** Scene-relative seconds -> frames, rounded like the rest of the template. */
export const voiceSecondsToFrames = (seconds: number, fps: number) =>
  Math.round(seconds * fps);
