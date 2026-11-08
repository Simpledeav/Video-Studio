import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FILM } from "../../config/blackberry";
import type { MusicPoint, SfxCue } from "../../config/blackberry-audio";
import voiceData from "../../../public/audio/episodes/blackberry/voice.words.json";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

const SFX_GAIN = 0.72;

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? 0.04) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.18) * fps));
  const gain = Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [total - fadeOut, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return <Audio src={localFile(cue.path)} volume={cue.volume * gain * SFX_GAIN} trimAfter={total} />;
};

export const BlackBerryScore: React.FC<{
  voicePath: string;
  musicPath: string;
  musicPoints: MusicPoint[];
  sfx: SfxCue[];
}> = ({ voicePath, musicPath, musicPoints, sfx }) => {
  const { fps } = useVideoConfig();
  const totalFrames = FILM.durationSeconds * fps;

  // Extract voice segments from words/manifest to create ducking envelope
  const voiceWindows = useMemo(() => {
    return voiceData.segments.map((seg) => ({
      start: seg.start,
      end: seg.end,
    }));
  }, []);

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.2 * fps);
    const release = Math.round(0.4 * fps);
    const targets = new Array<number>(totalFrames + 1).fill(0);

    for (const win of voiceWindows) {
      const from = Math.max(0, Math.round(win.start * fps) - attack);
      const to = Math.min(totalFrames, Math.round(win.end * fps) + release);
      for (let i = from; i <= to; i += 1) {
        targets[i] = 1;
      }
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

  const getBaseMusicVolume = (seconds: number) => {
    if (musicPoints.length === 0) return 0.16;
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

  const currentDucking = duckValues[Math.min(frame, totalFrames)] ?? 0;
  // Duck music by ~40% during active voiceover lines to keep narration pristine
  const duckMultiplier = 1.0 - currentDucking * 0.42;
  const musicVolume = getBaseMusicVolume(time) * duckMultiplier;

  return (
    <>
      {/* 1. Voice Narration */}
      <Audio src={localFile(voicePath)} volume={1.0} />

      {/* 2. Custom 80-second Electronic Score with Dynamic Ducking */}
      <Audio src={localFile(musicPath)} volume={musicVolume} />

      {/* 3. Synchronized Precision Foley & SFX */}
      {sfx.map((cue) => {
        const startFrame = Math.round(cue.startSeconds * fps);
        const durationFrames = Math.max(1, Math.round(cue.durationSeconds * fps));
        return (
          <Sequence key={cue.id} from={startFrame} durationInFrames={durationFrames} layout="none">
            <Sfx cue={cue} fps={fps} />
          </Sequence>
        );
      })}
    </>
  );
};
