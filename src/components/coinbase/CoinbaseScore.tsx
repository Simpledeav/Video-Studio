import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { CB } from "../../config/coinbase";
import {
  MUSIC_POINTS,
  MUSIC_PATH,
  SFX,
  VOICE_PATH,
  type SfxCue,
} from "../../config/coinbase-audio";
import voiceData from "../../../public/audio/episodes/coinbase/voice.words.json";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? 0.04) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.18) * fps));
  const gain = Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [total - fadeOut, total], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  return (
    <Audio
      src={localFile(cue.path)}
      volume={cue.volume * gain * 0.72}
      trimAfter={total}
    />
  );
};

export const CoinbaseScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = CB.durationSeconds * fps;

  const voiceWindows = useMemo(
    () =>
      voiceData.segments.map((segment) => ({
        start: segment.start,
        end: segment.end,
      })),
    [],
  );

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const targets = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.18 * fps);
    const release = Math.round(0.45 * fps);
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

  const frame = useCurrentFrame();
  const time = frame / fps;

  const baseMusic = useMemo(() => {
    const points = MUSIC_POINTS;
    if (time <= points[0].timeSeconds) return points[0].volume;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const next = points[i];
      if (time <= next.timeSeconds) {
        const span = Math.max(0.001, next.timeSeconds - prev.timeSeconds);
        const p = Math.min(1, Math.max(0, (time - prev.timeSeconds) / span));
        return prev.volume + (next.volume - prev.volume) * p;
      }
    }
    return points[points.length - 1].volume;
  }, [time]);

  const duck = duckValues[Math.min(frame, totalFrames)] ?? 0;
  const musicVolume = baseMusic * (1 - duck * 0.5);

  return (
    <>
      <Audio src={localFile(VOICE_PATH)} volume={0.94} />
      <Audio src={localFile(MUSIC_PATH)} volume={musicVolume} />
      {SFX.map((cue) => {
        const startFrame = Math.round(cue.startSeconds * fps);
        const durationFrames = Math.max(1, Math.round(cue.durationSeconds * fps));
        return (
          <Sequence
            key={cue.id}
            from={startFrame}
            durationInFrames={durationFrames}
            layout="none"
          >
            <Sfx cue={cue} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};
