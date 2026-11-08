/**
 * Drop-in narration audio for the curated Simpledeav voice library.
 *
 * The default is SD_VOICE_03 — Nathan Cole. Pass `voice` only when the brief
 * explicitly names SD_VOICE_09 — James Carter. An unknown voice or emotion
 * throws; there is no silent fallback.
 */
import type React from "react";
import { Audio } from "@remotion/media";
import {
  DEFAULT_VOICE,
  getVoiceAssetPath,
  type Emotion,
} from "../memory";

export type VoiceNarrationProps = {
  /** Permanent ID, name, or combined form. Defaults to SD_VOICE_03. */
  voice?: string;
  /** Defaults to `identity` (the full test narration). */
  emotion?: Emotion;
  volume?: number;
  /** Trim the start of the audio, in frames. */
  trimBefore?: number;
  playbackRate?: number;
  loop?: boolean;
  muted?: boolean;
};

export const VoiceNarration: React.FC<VoiceNarrationProps> = ({
  voice = DEFAULT_VOICE,
  emotion = "identity",
  volume,
  trimBefore,
  playbackRate,
  loop,
  muted,
}) => {
  const src = getVoiceAssetPath(voice, emotion);

  return (
    <Audio
      src={src}
      volume={volume}
      trimBefore={trimBefore}
      playbackRate={playbackRate}
      loop={loop}
      muted={muted}
    />
  );
};
