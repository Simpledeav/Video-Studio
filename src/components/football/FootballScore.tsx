import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FR } from "../../config/football";
import {
  CROWD_PATH,
  MUSIC_A_PATH,
  MUSIC_A_POINTS,
  MUSIC_B_PATH,
  MUSIC_B_POINTS,
  MUSIC_B_START_SECONDS,
  SFX,
  VOICE_PATH,
  type SfxCue,
} from "../../config/football-audio";
import voiceData from "../../../public/audio/episodes/football/voice.words.json";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? 0.05) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.25) * fps));
  const gain = Math.min(
    Math.min(1, frame / fadeIn),
    Math.min(1, (total - frame) / fadeOut),
  );
  return (
    <Audio
      src={localFile(cue.path)}
      volume={cue.volume * Math.max(0, gain) * 0.88}
      trimAfter={total}
    />
  );
};

const pointsVolume = (
  points: readonly { timeSeconds: number; volume: number }[],
  time: number,
): number => {
  if (time <= points[0].timeSeconds) return points[0].volume;
  for (let index = 1; index < points.length; index += 1) {
    const previous = points[index - 1];
    const next = points[index];
    if (time <= next.timeSeconds) {
      const span = Math.max(0.001, next.timeSeconds - previous.timeSeconds);
      const p = Math.min(1, Math.max(0, (time - previous.timeSeconds) / span));
      return previous.volume + (next.volume - previous.volume) * p;
    }
  }
  return points[points.length - 1].volume;
};

export const FootballScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = FR.durationSeconds * fps;

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
      for (let index = from; index <= to; index += 1) targets[index] = 1;
    }
    let current = 0;
    for (let index = 0; index <= totalFrames; index += 1) {
      const target = targets[index];
      const rate = target > current ? 1 / attack : 1 / release;
      current += (target - current) * rate;
      values[index] = current;
    }
    return values;
  }, [voiceWindows, fps, totalFrames]);

  const frame = useCurrentFrame();
  const time = frame / fps;
  const duck = duckValues[Math.min(frame, totalFrames)] ?? 0;
  const duckGain = 1 - duck * 0.54;

  const musicA = pointsVolume(MUSIC_A_POINTS, time) * duckGain;
  const musicB = pointsVolume(MUSIC_B_POINTS, time - MUSIC_B_START_SECONDS) * duckGain;

  const crowdFadeIn = Math.min(1, time / 2.5);
  const crowdFadeOut = Math.min(1, (FR.durationSeconds - time) / 4);
  const crowd = 0.055 * Math.max(0, Math.min(crowdFadeIn, crowdFadeOut)) * (1 - duck * 0.25);

  return (
    <>
      <Audio src={localFile(VOICE_PATH)} volume={0.92} />
      <Audio src={localFile(MUSIC_A_PATH)} volume={musicA} />
      <Audio src={localFile(CROWD_PATH)} volume={crowd} loop />

      <Sequence
        from={Math.round(MUSIC_B_START_SECONDS * fps)}
        durationInFrames={Math.round((FR.durationSeconds - MUSIC_B_START_SECONDS) * fps)}
        layout="none"
      >
        <Audio src={localFile(MUSIC_B_PATH)} volume={musicB} />
      </Sequence>

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
