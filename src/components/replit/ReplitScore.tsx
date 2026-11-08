import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { RP } from "../../config/replit";
import {
  MUSIC_PATH,
  MUSIC_POINTS,
  SFX,
  VOICE_PATH,
  type SfxCue,
} from "../../config/replit-audio";
import voiceData from "../../../public/audio/episodes/replit/voice.words.json";

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

export const ReplitScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = RP.durationSeconds * fps;

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
  // Music points are authored in story seconds (85s). The edit runs at pace,
  // so compare them against story time rather than the 80s playback clock.
  const storyTime = time * RP.pace;

  const baseMusic = useMemo(() => {
    const points = MUSIC_POINTS;
    if (storyTime <= points[0].timeSeconds) return points[0].volume;
    for (let i = 1; i < points.length; i += 1) {
      const prev = points[i - 1];
      const next = points[i];
      if (storyTime <= next.timeSeconds) {
        const span = Math.max(0.001, next.timeSeconds - prev.timeSeconds);
        const p = Math.min(1, Math.max(0, (storyTime - prev.timeSeconds) / span));
        return prev.volume + (next.volume - prev.volume) * p;
      }
    }
    return points[points.length - 1].volume;
  }, [storyTime]);

  const duck = duckValues[Math.min(frame, totalFrames)] ?? 0;
  const musicVolume = baseMusic * (1 - duck * 0.54);

  return (
    <>
      <Audio src={localFile(VOICE_PATH)} volume={0.92} />
      <Audio src={localFile(MUSIC_PATH)} volume={musicVolume} />
      {SFX.map((cue) => {
        // Cue starts scale with the picture; the natural SFX tail is kept intact.
        const startFrame = Math.round((cue.startSeconds / RP.pace) * fps);
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
