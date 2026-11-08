/**
 * Sound design map for the Airbnb case study.
 *
 * The manifest in `content/episode-airbnb-cereal.json` is the single source of
 * truth so the validator, the score and the documentation cannot drift apart.
 * All times are composition-relative seconds.
 */
import manifest from "../../content/episode-airbnb-cereal.json";

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

export type MusicPoint = { timeSeconds: number; volume: number };

export const MUSIC_POINTS: MusicPoint[] = manifest.music.volumePoints;
export const MUSIC_PATH = manifest.music.path;
export const SFX: SfxCue[] = manifest.soundEffects;
