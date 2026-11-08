import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FILM } from "../../config/airbnb";
import type { SfxCue } from "../../config/airbnb-audio";
import {
  DUCK_ATTACK_SECONDS,
  DUCK_DEPTH,
  DUCK_RELEASE_SECONDS,
  SFX_DEFAULT_FADE_IN,
  SFX_DEFAULT_FADE_OUT,
  SFX_GAIN,
  VOICE_GAIN,
} from "../../config/audioPreset";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? SFX_DEFAULT_FADE_IN) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? SFX_DEFAULT_FADE_OUT) * fps));
  const gain = Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [total - fadeOut, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return <Audio src={localFile(cue.path)} volume={cue.volume * gain * SFX_GAIN} trimAfter={total} />;
};

export type MusicPoint = { timeSeconds: number; volume: number };

/**
 * Score: one narration stem, one licensed music bed with frame-accurate
 * automation and narration ducking, and a restrained set of synchronised
 * Foley/impacts. Music is deliberately 12-18 dB under the voice.
 */
export const AirbnbScore: React.FC<{
  voicePath: string;
  musicPath: string;
  musicPoints: MusicPoint[];
  sfx: SfxCue[];
  voiceWindows: { start: number; end: number }[];
}> = ({ voicePath, musicPath, musicPoints, sfx, voiceWindows }) => {
  const { fps } = useVideoConfig();
  const totalFrames = FILM.durationSeconds * fps;

  const duck = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(DUCK_ATTACK_SECONDS * fps);
    const release = Math.round(DUCK_RELEASE_SECONDS * fps);
    const targets = new Array<number>(totalFrames + 1).fill(0);
    for (const window of voiceWindows) {
      const from = Math.max(0, Math.round(window.start * fps) - attack);
      const to = Math.min(totalFrames, Math.round(window.end * fps) + release);
      for (let i = from; i <= to; i += 1) targets[i] = 1;
    }
    let current = 0;
    for (let i = 0; i <= totalFrames; i += 1) {
      const target = targets[i];
      const rate = target > current ? 1 / attack : 1 / release;
      current += (target - current) * rate;
      values[i] = current;
    }
    return values;
  }, [voiceWindows, fps, totalFrames]);

  const baseVolume = (seconds: number) => {
    if (musicPoints.length === 0) return 0.18;
    if (seconds <= musicPoints[0].timeSeconds) return musicPoints[0].volume;
    for (let i = 1; i < musicPoints.length; i += 1) {
      const prev = musicPoints[i - 1];
      const next = musicPoints[i];
      if (seconds <= next.timeSeconds) {
        const span = Math.max(0.001, next.timeSeconds - prev.timeSeconds);
        const p = Math.min(1, Math.max(0, (seconds - prev.timeSeconds) / span));
        return prev.volume + (next.volume - prev.volume) * p;
      }
    }
    return musicPoints[musicPoints.length - 1].volume;
  };

  return (
    <>
      <Audio src={localFile(voicePath)} volume={VOICE_GAIN} />
      <Audio
        src={localFile(musicPath)}
        volume={(frame) => {
          const base = baseVolume(frame / fps);
          const duckGain = 1 - (duck[Math.round(frame)] ?? 0) * DUCK_DEPTH;
          const fadeIn = interpolate(frame, [0, 2.2 * fps], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(frame, [totalFrames - 2.4 * fps, totalFrames], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          return base * duckGain * fadeIn * fadeOut;
        }}
      />
      {sfx.map((cue) => (
        <Sequence
          key={cue.id}
          from={Math.max(0, Math.round(cue.startSeconds * fps))}
          durationInFrames={Math.max(1, Math.round(cue.durationSeconds * fps))}
          layout="none"
          name={`sfx:${cue.id}`}
        >
          <Sfx cue={cue} fps={fps} />
        </Sequence>
      ))}
    </>
  );
};
