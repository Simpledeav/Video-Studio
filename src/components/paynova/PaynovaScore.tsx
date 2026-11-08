import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PN } from "../../config/paynova";
import voiceData from "../../../public/audio/episodes/paynova/voice.words.json";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

const SFX_GAIN = 0.72;

type SfxCue = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
};

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

const MUSIC_PATH = "/audio/episodes/ai-agent/music/silent-descent-90s.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.12 },
  { timeSeconds: 6, volume: 0.15 },
  { timeSeconds: 16, volume: 0.16 },
  { timeSeconds: 27, volume: 0.22 },
  { timeSeconds: 35, volume: 0.24 },
  { timeSeconds: 42, volume: 0.18 },
  { timeSeconds: 52, volume: 0.16 },
  { timeSeconds: 66, volume: 0.14 },
  { timeSeconds: 73, volume: 0.10 },
  { timeSeconds: 80, volume: 0 },
];

const SFX: SfxCue[] = [
  { id: "open-impact", path: "/audio/episodes/lego/sfx/impact-deep.mp3", startSeconds: 0.2, durationSeconds: 2.5, volume: 0.38, fadeInSeconds: 0.1, fadeOutSeconds: 1.2 },
  { id: "ui-notification", path: "/audio/sfx/interface-select.mp3", startSeconds: 3.8, durationSeconds: 0.6, volume: 0.28 },
  { id: "transition-1", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 6.5, durationSeconds: 1.4, volume: 0.18 },
  { id: "typing-1", path: "/audio/sfx/typing-loop.mp3", startSeconds: 8.5, durationSeconds: 2.4, volume: 0.09, fadeInSeconds: 0.2, fadeOutSeconds: 0.4 },
  { id: "data-tick", path: "/audio/episodes/blackberry/sfx/data-tick.mp3", startSeconds: 11.2, durationSeconds: 0.5, volume: 0.16 },
  { id: "transition-2", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 15.6, durationSeconds: 1.4, volume: 0.18 },
  { id: "sci-fi-click", path: "/audio/sfx/sci-fi-click.mp3", startSeconds: 18.5, durationSeconds: 0.5, volume: 0.22 },
  { id: "database-scan", path: "/audio/episodes/blackberry/sfx/low-pulse.mp3", startSeconds: 20.0, durationSeconds: 4.0, volume: 0.16, fadeInSeconds: 0.4, fadeOutSeconds: 1.0 },
  { id: "transition-3", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 26.5, durationSeconds: 1.4, volume: 0.18 },
  { id: "alert", path: "/audio/episodes/ai-agent/sfx/tension-hit.mp3", startSeconds: 29.5, durationSeconds: 1.8, volume: 0.24, fadeInSeconds: 0.05, fadeOutSeconds: 1.0 },
  { id: "queue-build", path: "/audio/episodes/blackberry/sfx/low-pulse.mp3", startSeconds: 31.0, durationSeconds: 5.0, volume: 0.18, fadeInSeconds: 0.3, fadeOutSeconds: 1.2 },
  { id: "typing-2", path: "/audio/sfx/typing-loop.mp3", startSeconds: 40.5, durationSeconds: 2.0, volume: 0.08, fadeInSeconds: 0.2, fadeOutSeconds: 0.4 },
  { id: "transition-4", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 38.5, durationSeconds: 1.4, volume: 0.18 },
  { id: "reveal", path: "/audio/episodes/blackberry/sfx/system-transform.mp3", startSeconds: 44.0, durationSeconds: 2.0, volume: 0.30, fadeInSeconds: 0.05, fadeOutSeconds: 1.0 },
  { id: "transition-5", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 48.5, durationSeconds: 1.4, volume: 0.18 },
  { id: "keyboard-burst", path: "/audio/episodes/blackberry/sfx/keyboard-burst.mp3", startSeconds: 51.0, durationSeconds: 1.5, volume: 0.12 },
  { id: "success", path: "/audio/episodes/ai-agent/sfx/success-notification.mp3", startSeconds: 58.0, durationSeconds: 1.2, volume: 0.24 },
  { id: "transition-6", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 60.5, durationSeconds: 1.4, volume: 0.18 },
  { id: "resolution", path: "/audio/episodes/blackberry/sfx/system-transform.mp3", startSeconds: 64.5, durationSeconds: 2.5, volume: 0.22, fadeInSeconds: 0.1, fadeOutSeconds: 1.5 },
  { id: "transition-7", path: "/audio/sfx/transition-whoosh.mp3", startSeconds: 72.5, durationSeconds: 1.4, volume: 0.18 },
  { id: "end-click", path: "/audio/sfx/interface-select.mp3", startSeconds: 75.8, durationSeconds: 0.5, volume: 0.22 },
];

export const PaynovaScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = PN.durationSeconds * fps;

  const voiceWindows = useMemo(() => {
    return voiceData.segments.map((seg) => ({ start: seg.start, end: seg.end }));
  }, []);

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.18 * fps);
    const release = Math.round(0.42 * fps);
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
    if (seconds <= MUSIC_POINTS[0].timeSeconds) return MUSIC_POINTS[0].volume;
    for (let i = 1; i < MUSIC_POINTS.length; i += 1) {
      const prev = MUSIC_POINTS[i - 1];
      const next = MUSIC_POINTS[i];
      if (seconds <= next.timeSeconds) {
        const span = Math.max(0.001, next.timeSeconds - prev.timeSeconds);
        const p = Math.min(1, Math.max(0, (seconds - prev.timeSeconds) / span));
        return prev.volume + (next.volume - prev.volume) * p;
      }
    }
    return MUSIC_POINTS[MUSIC_POINTS.length - 1].volume;
  };

  const currentDucking = duckValues[Math.min(frame, totalFrames)] ?? 0;
  const duckMultiplier = 1.0 - currentDucking * 0.46;
  const musicVolume = getBaseMusicVolume(time) * duckMultiplier;

  return (
    <>
      <Audio src={localFile("/audio/episodes/paynova/voice.mp3")} volume={1.0} />
      <Audio src={localFile(MUSIC_PATH)} volume={musicVolume} />
      {SFX.map((cue) => {
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
