/**
 * Typed access to `defaults/audio-preset.json`.
 *
 * This is the single source of truth for narration gain, music level, ducking
 * and Foley headroom. Do not hard-code these numbers inside components; import
 * them here so every episode mixes identically.
 */
import preset from "../../defaults/audio-preset.json";

export const AUDIO_PRESET = preset;

export const VOICE_GAIN = preset.voice.mixGainInRemotion;
export const SFX_GAIN = preset.sfx.globalGain;
export const DUCK_DEPTH = preset.music.mix.duckDepth;
export const DUCK_ATTACK_SECONDS = preset.music.mix.duckAttackSeconds;
export const DUCK_RELEASE_SECONDS = preset.music.mix.duckReleaseSeconds;
export const MUSIC_BASE_VOLUME = preset.music.mix.baseVolume;
export const MUSIC_MAX_VOLUME = preset.music.mix.neverAboveLinear;
export const SFX_DEFAULT_FADE_IN = preset.sfx.defaultFadeInSeconds;
export const SFX_DEFAULT_FADE_OUT = preset.sfx.defaultFadeOutSeconds;

export type VoiceProfile = {
  voice: string;
  rate: string;
  pitch: string;
  maxInternalPauseSeconds: number;
  leadInSeconds: number;
  chain: string[];
  output: { sampleRate: number; channels: number; bitrate: string; integratedLufs: number; truePeakDbfs: number };
};

export const VOICE_PROFILE: VoiceProfile = {
  voice: preset.voice.voice,
  rate: preset.voice.rate,
  pitch: preset.voice.pitch,
  maxInternalPauseSeconds: preset.voice.maxInternalPauseSeconds,
  leadInSeconds: preset.voice.leadInSeconds,
  chain: preset.voice.postChain,
  output: {
    sampleRate: preset.voice.output.sampleRate,
    channels: preset.voice.output.channels,
    bitrate: preset.voice.output.bitrate,
    integratedLufs: preset.voice.output.integratedLufs,
    truePeakDbfs: preset.voice.output.truePeakDbfs,
  },
};
