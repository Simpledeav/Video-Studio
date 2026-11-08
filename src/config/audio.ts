/**
 * Shared mix defaults for every episode.
 *
 * The numbers come from `defaults/audio-preset.json` (documented in
 * `defaults/audio.md`). Episodes can still override per-cue values; these are
 * the floor that keeps narration on top and music underneath.
 */
import preset from "../../defaults/audio-preset.json";

export const AUDIO_DEFAULTS = {
  narrationVolume: preset.voice.mixGainInRemotion,
  musicVolume: preset.music.mix.baseVolume,
  musicDuckedVolume: preset.music.mix.baseVolume * (1 - preset.music.mix.duckDepth),
  duckAttackSeconds: preset.music.mix.duckAttackSeconds,
  duckReleaseSeconds: preset.music.mix.duckReleaseSeconds,
  sfxVolume: 0.32,
  overallMaster: 0.94,
} as const;

export const AUDIO_LIMITS = {
  maxMusicVolume: 1,
  maxSfxVolume: 1,
  maxNarrationVolume: 1.3,
} as const;
