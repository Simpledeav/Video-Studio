import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { JG } from "../../config/juicero";
import voiceData from "../../../public/audio/episodes/juicero/voice.words.json";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

type SfxCue = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeOutSeconds?: number;
};

const SFX_GAIN = 0.7;

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round(0.03 * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.14) * fps));
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
  return <Audio src={localFile(cue.path)} volume={cue.volume * gain * SFX_GAIN} trimAfter={total} />;
};

const MusicBed: React.FC<{
  src: string;
  startSeconds: number;
  durationSeconds: number;
  trimBeforeSeconds?: number;
  points: Array<{ t: number; v: number }>;
  duck: number;
}> = ({ src, startSeconds, durationSeconds, trimBeforeSeconds = 0, points, duck }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const base = interpolate(
    t,
    points.map((point) => point.t),
    points.map((point) => point.v),
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const volume = base * (1 - duck * 0.48);
  return (
    <Sequence from={Math.round(startSeconds * fps)} durationInFrames={Math.round(durationSeconds * fps)} layout="none">
      <Audio
        src={localFile(src)}
        volume={volume}
        trimBefore={Math.round(trimBeforeSeconds * fps)}
        trimAfter={Math.round((trimBeforeSeconds + durationSeconds) * fps)}
      />
    </Sequence>
  );
};

const VOICE = "/audio/episodes/juicero/voice.mp3";

const MUSIC_A = "/audio/episodes/juicero/music/documentary-bed-88s.mp3";
export const MUSIC_B = "/audio/episodes/juicero/music/dark-score-80s.mp3";
const MUSIC_C = "/audio/music/vastness-92s.mp3";

const J = "/audio/episodes/juicero/sfx";
const A = J;
const B = J;
const M = J;
const L = J;
const G = J;
const K = J;
const F = J;
const AI = J;
const ROOT = J;

const sfx = (
  id: string,
  file: string,
  startSeconds: number,
  durationSeconds: number,
  volume: number,
  fadeOutSeconds?: number,
): SfxCue => ({ id, path: file, startSeconds, durationSeconds, volume, fadeOutSeconds });

const SFX: SfxCue[] = [
  // Hook — machine theatre, hydraulic press, hand reveal, price slam
  sfx("hook-open", `${A}/opening-impact.mp3`, 0.18, 1.5, 0.24, 0.4),
  sfx("hook-hum", `${G}/engine-start.wav`, 0.45, 2.4, 0.14, 0.5),
  sfx("hook-roll", `${L}/metal-spin.mp3`, 0.9, 1.1, 0.1, 0.3),
  sfx("hook-whoosh", `${A}/transition-whoosh.mp3`, 1.5, 0.8, 0.12, 0.2),
  sfx("hook-rumble", `${L}/container-rumble.mp3`, 2.42, 0.9, 0.24, 0.25),
  sfx("hook-impact", `${A}/low-impact.mp3`, 2.88, 1.1, 0.34, 0.5),
  sfx("hook-metal", `${L}/metal-spin.mp3`, 3.0, 0.7, 0.16, 0.2),
  sfx("hook-shutter", `${K}/camera-shutter.mp3`, 3.45, 0.4, 0.16, 0.12),
  sfx("hook-pour", `${L}/pour.mp3`, 4.35, 1.25, 0.2, 0.3),
  sfx("hook-drop", `${L}/water-drop.mp3`, 4.8, 0.5, 0.12, 0.12),
  sfx("hook-freeze", `${M}/power-down.mp3`, 5.35, 1.1, 0.2, 0.3),
  sfx("hook-glitch", `${M}/glitch.mp3`, 5.55, 0.5, 0.16, 0.12),
  sfx("hook-slam", `${A}/low-impact.mp3`, 5.75, 1.2, 0.24, 0.4),

  // Dream — the confident startup montage
  sfx("dream-whoosh", `${A}/transition-whoosh.mp3`, 7.1, 0.9, 0.14, 0.2),
  sfx("dream-scan", `${M}/ui-scan.mp3`, 7.6, 0.9, 0.08, 0.2),
  sfx("dream-tick-1", `${B}/data-tick.mp3`, 10.3, 0.2, 0.1, 0.05),
  sfx("dream-keys", `${B}/keyboard-burst.mp3`, 10.55, 0.7, 0.08, 0.2),
  sfx("dream-tick-2", `${B}/data-tick.mp3`, 11.45, 0.2, 0.11, 0.05),
  sfx("dream-tick-3", `${B}/data-tick.mp3`, 12.6, 0.2, 0.11, 0.05),
  sfx("dream-riser", `${A}/riser.mp3`, 13.2, 1.7, 0.1, 0.4),
  sfx("dream-bell", `${AI}/warm-bell.mp3`, 14.3, 1.4, 0.08, 0.4),

  // Millions — the counter, the applause, the price cut, the wifi
  sfx("money-open", `${A}/soft-whoosh.mp3`, 22.5, 1.0, 0.12, 0.25),
  sfx("money-tick-1", `${B}/data-tick.mp3`, 23.0, 0.2, 0.12, 0.05),
  sfx("money-tick-2", `${B}/data-tick.mp3`, 23.9, 0.2, 0.12, 0.05),
  sfx("money-tick-3", `${B}/data-tick.mp3`, 24.8, 0.2, 0.12, 0.05),
  sfx("money-pulse", `${B}/low-pulse.mp3`, 26.0, 0.8, 0.12, 0.25),
  sfx("money-riser", `${A}/riser.mp3`, 28.6, 1.5, 0.1, 0.4),
  sfx("money-impact", `${A}/low-impact.mp3`, 30.0, 1.0, 0.16, 0.3),
  sfx("money-notify", `${F}/phone-notification.mp3`, 34.0, 0.7, 0.12, 0.2),
  sfx("money-down", `${M}/power-down.mp3`, 34.5, 1.0, 0.1, 0.25),

  // Reveal — the most important beat
  sfx("reveal-whoosh", `${A}/transition-whoosh.mp3`, 35.6, 0.9, 0.16, 0.2),
  sfx("reveal-shutter-1", `${K}/camera-shutter.mp3`, 38.0, 0.4, 0.14, 0.12),
  sfx("reveal-shutter-2", `${K}/camera-shutter.mp3`, 40.2, 0.4, 0.12, 0.12),
  sfx("reveal-pulse", `${B}/low-pulse.mp3`, 41.0, 1.0, 0.14, 0.25),
  sfx("reveal-drop", `${L}/water-drop.mp3`, 43.0, 0.6, 0.14, 0.15),
  sfx("reveal-pour", `${L}/pour.mp3`, 44.4, 1.2, 0.14, 0.3),
  sfx("reveal-down", `${M}/power-down.mp3`, 46.0, 1.1, 0.12, 0.2),
  sfx("reveal-glitch", `${M}/glitch.mp3`, 47.2, 0.5, 0.16, 0.12),
  sfx("reveal-error", `${M}/error-buzz.mp3`, 50.4, 1.5, 0.2, 0.4),
  sfx("reveal-cut", `${M}/power-down.mp3`, 51.4, 0.7, 0.14, 0.2),
  sfx("reveal-reverse", `${J}/reverse-reveal.mp3`, 52.6, 0.7, 0.12, 0.15),
  sfx("reveal-pulse-2", `${B}/low-pulse.mp3`, 54.0, 1.0, 0.1, 0.3),
  sfx("reveal-out", `${A}/transition-whoosh.mp3`, 55.0, 0.9, 0.14, 0.2),

  // Collapse — backwards cash register and shutdown
  sfx("collapse-coins", `${J}/reverse-coins.mp3`, 56.3, 1.3, 0.24, 0.3),
  sfx("collapse-rumble", `${L}/container-rumble.mp3`, 57.0, 1.2, 0.16, 0.3),
  sfx("collapse-impact", `${A}/low-impact.mp3`, 58.4, 1.4, 0.18, 0.4),
  sfx("collapse-tick", `${K}/calendar-tick.mp3`, 60.0, 0.3, 0.12, 0.05),
  sfx("collapse-down", `${M}/power-down.mp3`, 61.4, 1.0, 0.1, 0.25),
  sfx("collapse-pulse", `${B}/low-pulse.mp3`, 63.0, 1.2, 0.12, 0.3),
  sfx("collapse-fall", `${B}/chart-fall.mp3`, 64.8, 1.5, 0.14, 0.4),

  // Lesson — typing, transformation, one click
  sfx("lesson-whoosh", `${A}/transition-whoosh.mp3`, 67.6, 0.9, 0.14, 0.2),
  sfx("lesson-keys", `${B}/keyboard-burst.mp3`, 67.9, 0.7, 0.12, 0.2),
  sfx("lesson-typing", `${ROOT}/typing-loop.mp3`, 68.5, 2.4, 0.06, 0.3),
  sfx("lesson-tick-1", `${B}/data-tick.mp3`, 69.5, 0.2, 0.1, 0.05),
  sfx("lesson-tick-2", `${B}/data-tick.mp3`, 70.7, 0.2, 0.1, 0.05),
  sfx("lesson-tick-3", `${B}/data-tick.mp3`, 71.9, 0.2, 0.1, 0.05),
  sfx("lesson-glitch", `${M}/glitch.mp3`, 73.0, 0.5, 0.1, 0.15),
  sfx("lesson-transform", `${B}/system-transform.mp3`, 74.0, 1.0, 0.18, 0.25),
  sfx("lesson-click", `${B}/data-tick.mp3`, 75.6, 0.2, 0.14, 0.05),
  sfx("lesson-success", `${AI}/success-notification.mp3`, 76.0, 1.3, 0.16, 0.35),
  sfx("lesson-bell", `${AI}/warm-bell.mp3`, 77.2, 1.3, 0.09, 0.4),
  sfx("lesson-pulse", `${B}/low-pulse.mp3`, 78.6, 0.9, 0.1, 0.25),

  // Ending
  sfx("end-riser", `${A}/riser.mp3`, 80.5, 1.8, 0.12, 0.4),
  sfx("end-impact", `${A}/low-impact.mp3`, 81.0, 1.2, 0.16, 0.4),
  sfx("end-bell", `${AI}/warm-bell.mp3`, 83.0, 1.6, 0.08, 0.4),
  sfx("end-signature", `${B}/brand-signature.mp3`, 85.0, 1.0, 0.16, 0.3),
  sfx("brand-sting", `${A}/brand-sting.mp3`, 87.1, 2.3, 0.24, 0.8),
  sfx("brand-signature", `${B}/brand-signature.mp3`, 87.7, 1.2, 0.18, 0.4),
];

export const JuiceroScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = JG.durationFrames;

  const voiceWindows = useMemo(
    () => voiceData.segments.map((segment) => ({ start: segment.start, end: segment.end })),
    [],
  );

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const targets = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.14 * fps);
    const release = Math.round(0.42 * fps);

    for (const win of voiceWindows) {
      const from = Math.max(0, Math.round(win.start * fps) - attack);
      const to = Math.min(totalFrames, Math.round(win.end * fps) + release);
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
  const duck = duckValues[Math.min(frame, totalFrames)] ?? 0;

  return (
    <>
      <Audio src={localFile(VOICE)} volume={0.98} />

      <MusicBed
        src={MUSIC_A}
        startSeconds={0}
        durationSeconds={56.6}
        duck={duck}
        points={[
          { t: 0, v: 0.08 },
          { t: 7, v: 0.13 },
          { t: 21.5, v: 0.16 },
          { t: 35.5, v: 0.17 },
          { t: 44, v: 0.14 },
          { t: 52, v: 0.1 },
          { t: 56.6, v: 0 },
        ]}
      />
      <MusicBed
        src={MUSIC_B}
        startSeconds={55.8}
        durationSeconds={22.6}
        duck={duck}
        points={[
          { t: 0, v: 0 },
          { t: 1.2, v: 0.1 },
          { t: 5, v: 0.12 },
          { t: 10, v: 0.11 },
          { t: 16, v: 0.13 },
          { t: 22.6, v: 0 },
        ]}
      />
      <MusicBed
        src={MUSIC_C}
        startSeconds={75.4}
        durationSeconds={14.6}
        trimBeforeSeconds={8}
        duck={duck}
        points={[
          { t: 0, v: 0 },
          { t: 2.5, v: 0.08 },
          { t: 6, v: 0.11 },
          { t: 10, v: 0.13 },
          { t: 13, v: 0.1 },
          { t: 14.6, v: 0 },
        ]}
      />

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
