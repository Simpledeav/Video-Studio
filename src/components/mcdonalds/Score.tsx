import { useMemo } from "react";
import { Audio } from "@remotion/media";
import {
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { MD } from "../../config/mcdonalds";
import voiceData from "../../../public/audio/episodes/mcdonalds/voice.words.json";

const localFile = (path: string) => staticFile(path.replace(/^\//, ""));

type SfxCue = {
  id: string;
  path: string;
  startSeconds: number;
  durationSeconds: number;
  volume: number;
  fadeInSeconds?: number;
  fadeOutSeconds?: number;
};

const SFX_GAIN = 0.72;

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? 0.035) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.16) * fps));
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

const VOICE = "/audio/episodes/mcdonalds/voice.mp3";
const MUSIC = "/audio/episodes/coinbase/music/coinbase-bed-88s.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.08 },
  { timeSeconds: 8.95, volume: 0.13 },
  { timeSeconds: 24.2, volume: 0.16 },
  { timeSeconds: 33.8, volume: 0.15 },
  { timeSeconds: 44.0, volume: 0.1 },
  { timeSeconds: 54.5, volume: 0.13 },
  { timeSeconds: 62.0, volume: 0.17 },
  { timeSeconds: 75.7, volume: 0.15 },
  { timeSeconds: 82.0, volume: 0.18 },
  { timeSeconds: 85.0, volume: 0.12 },
  { timeSeconds: 87.6, volume: 0.0 },
];

const AIRBNB = "/audio/episodes/airbnb/sfx";
const BLACKBERRY = "/audio/episodes/blackberry/sfx";
const AI_AGENT = "/audio/episodes/ai-agent/sfx";
const FOOTBALL = "/audio/episodes/football/sfx";
const MCD = "/audio/episodes/mcdonalds/sfx";

const sfx = (
  id: string,
  file: string,
  startSeconds: number,
  durationSeconds: number,
  volume: number,
  fadeOutSeconds?: number,
): SfxCue => ({
  id,
  path: file,
  startSeconds,
  durationSeconds,
  volume,
  fadeOutSeconds,
});

const SFX: SfxCue[] = [
  // Act 01 — the hook
  sfx("open-impact", `${AIRBNB}/opening-impact.mp3`, 0.02, 1.8, 0.34, 0.9),
  sfx("car-idle", `${MCD}/car-idle.mp3`, 0.42, 4.0, 0.16, 1.2),
  sfx("drive-thru-bed", `${MCD}/drive-thru-ambience.mp3`, 0.9, 8.0, 0.08, 1.4),
  sfx("ai-listen-hook", `${MCD}/ai-listen.mp3`, 3.62, 1.05, 0.2, 0.35),
  sfx("item-pop-1", `${MCD}/item-pop.mp3`, 4.35, 0.26, 0.2, 0.08),
  sfx("item-pop-2", `${MCD}/item-pop.mp3`, 4.62, 0.26, 0.2, 0.08),
  sfx("item-pop-3", `${MCD}/item-pop.mp3`, 4.89, 0.26, 0.2, 0.08),
  sfx("error-buzz-hook", `${MCD}/error-buzz.mp3`, 5.5, 0.55, 0.22, 0.2),
  sfx("tension-hook", `${AI_AGENT}/tension-hit.mp3`, 5.66, 2.0, 0.16, 0.8),
  sfx("shout-impact", `${AIRBNB}/low-impact.mp3`, 5.8, 1.4, 0.22, 0.6),
  sfx("hook-cut", `${AIRBNB}/transition-whoosh.mp3`, 8.4, 1.0, 0.18, 0.35),

  // Act 02 — the big idea
  sfx("idea-scan", `${MCD}/ui-scan.mp3`, 8.95, 0.9, 0.14, 0.3),
  sfx("idea-tick-1", `${BLACKBERRY}/data-tick.mp3`, 10.9, 0.2, 0.13, 0.06),
  sfx("idea-tick-2", `${BLACKBERRY}/data-tick.mp3`, 11.9, 0.2, 0.12, 0.06),
  sfx("idea-confirm", `${MCD}/ai-confirm.mp3`, 15.35, 0.85, 0.16, 0.25),
  sfx("idea-click", `${BLACKBERRY}/digital-click.mp3`, 17.25, 0.14, 0.12, 0.05),
  sfx("idea-ticket", `${MCD}/receipt-print.mp3`, 18.4, 0.8, 0.12, 0.2),
  sfx("idea-success", `${AI_AGENT}/success-notification.mp3`, 21.45, 1.0, 0.14, 0.3),
  sfx("idea-cut", `${AIRBNB}/transition-whoosh.mp3`, 24.05, 1.0, 0.16, 0.35),

  // Act 03 — off script
  sfx("chaos-buzz", `${MCD}/error-buzz.mp3`, 24.32, 0.55, 0.2, 0.2),
  sfx("chaos-glitch", `${MCD}/glitch.mp3`, 24.55, 0.42, 0.16, 0.12),
  sfx("chaos-listen", `${MCD}/ai-listen.mp3`, 26.4, 1.05, 0.16, 0.3),
  sfx("tea-pop-1", `${MCD}/item-pop.mp3`, 26.9, 0.26, 0.18, 0.08),
  sfx("tea-pop-2", `${MCD}/item-pop.mp3`, 27.2, 0.26, 0.2, 0.08),
  sfx("tea-pop-3", `${MCD}/item-pop.mp3`, 27.5, 0.26, 0.2, 0.08),
  sfx("tea-pop-4", `${MCD}/item-pop.mp3`, 27.8, 0.26, 0.2, 0.08),
  sfx("chaos-error", `${MCD}/error-buzz.mp3`, 28.3, 0.55, 0.18, 0.2),
  sfx("receipt-ticket", `${MCD}/receipt-print.mp3`, 29.85, 1.0, 0.14, 0.2),
  sfx("receipt-pop-1", `${MCD}/item-pop.mp3`, 30.7, 0.26, 0.15, 0.08),
  sfx("receipt-pop-2", `${MCD}/item-pop.mp3`, 31.1, 0.26, 0.14, 0.08),
  sfx("chaos-cut", `${AIRBNB}/transition-whoosh.mp3`, 33.55, 1.0, 0.16, 0.35),

  // Act 04 — the internet reacts
  sfx("social-1", `${FOOTBALL}/phone-notification.mp3`, 33.95, 0.8, 0.15, 0.25),
  sfx("social-2", `${FOOTBALL}/phone-notification.mp3`, 34.55, 0.8, 0.14, 0.25),
  sfx("social-3", `${FOOTBALL}/phone-notification.mp3`, 35.15, 0.8, 0.13, 0.25),
  sfx("internet-scan", `${MCD}/ui-scan.mp3`, 36.8, 0.9, 0.1, 0.3),
  sfx("internet-pulse", `${BLACKBERRY}/low-pulse.mp3`, 40.2, 0.6, 0.13, 0.2),
  sfx("internet-cut", `${AIRBNB}/soft-whoosh.mp3`, 43.9, 1.0, 0.14, 0.35),

  // Act 05 — the decision
  sfx("power-down", `${MCD}/power-down.mp3`, 44.02, 1.7, 0.28, 0.5),
  sfx("decision-impact", `${AIRBNB}/low-impact.mp3`, 44.22, 1.6, 0.2, 0.6),
  sfx("timeline-1", `${BLACKBERRY}/data-tick.mp3`, 46.4, 0.2, 0.13, 0.06),
  sfx("timeline-2", `${BLACKBERRY}/data-tick.mp3`, 47.4, 0.2, 0.13, 0.06),
  sfx("timeline-3", `${BLACKBERRY}/data-tick.mp3`, 48.4, 0.2, 0.13, 0.06),
  sfx("decision-transform", `${BLACKBERRY}/system-transform.mp3`, 49.3, 0.7, 0.16, 0.2),
  sfx("decision-riser", `${AIRBNB}/riser.mp3`, 51.1, 1.6, 0.12, 0.3),
  sfx("decision-success", `${AI_AGENT}/success-notification.mp3`, 52.2, 1.0, 0.14, 0.3),
  sfx("decision-cut", `${AIRBNB}/soft-whoosh.mp3`, 54.3, 1.0, 0.14, 0.35),

  // Act 06 — the lesson
  sfx("lesson-scan", `${MCD}/ui-scan.mp3`, 54.6, 0.9, 0.12, 0.3),
  sfx("lesson-pulse", `${BLACKBERRY}/low-pulse.mp3`, 57.6, 0.6, 0.14, 0.2),
  sfx("lesson-confirm", `${MCD}/ai-confirm.mp3`, 58.3, 0.85, 0.12, 0.25),
  sfx("protocol-1", `${BLACKBERRY}/digital-click.mp3`, 62.2, 0.14, 0.12, 0.05),
  sfx("protocol-2", `${BLACKBERRY}/digital-click.mp3`, 63.0, 0.14, 0.12, 0.05),
  sfx("protocol-3", `${BLACKBERRY}/digital-click.mp3`, 63.8, 0.14, 0.12, 0.05),
  sfx("protocol-4", `${BLACKBERRY}/digital-click.mp3`, 64.6, 0.14, 0.12, 0.05),
  sfx("protocol-5", `${BLACKBERRY}/digital-click.mp3`, 65.4, 0.14, 0.12, 0.05),
  sfx("human-transfer", `${MCD}/human-transfer.mp3`, 69.7, 1.5, 0.18, 0.4),
  sfx("lesson-warm", `${AI_AGENT}/warm-bell.mp3`, 71.9, 1.6, 0.1, 0.5),
  sfx("lesson-cut", `${AIRBNB}/soft-whoosh.mp3`, 75.4, 1.0, 0.14, 0.35),

  // Act 07 — the takeaway
  sfx("takeaway-scan", `${MCD}/ui-scan.mp3`, 75.8, 0.9, 0.1, 0.3),
  sfx("takeaway-impact", `${AIRBNB}/low-impact.mp3`, 79.4, 1.2, 0.18, 0.5),
  sfx("takeaway-riser", `${AIRBNB}/riser.mp3`, 80.5, 1.8, 0.12, 0.4),
  sfx("question-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 82.1, 0.35, 0.14, 0.1),
  sfx("question-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 84.1, 1.0, 0.14, 0.35),
  sfx("brand-signature", `${BLACKBERRY}/brand-signature.mp3`, 85.05, 1.4, 0.26, 0.4),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 85.35, 2.4, 0.2, 0.9),
];

export const McDonaldsScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = MD.durationFrames;

  const voiceWindows = useMemo(
    () => voiceData.segments.map((segment) => ({ start: segment.start, end: segment.end })),
    [],
  );

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const targets = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.16 * fps);
    const release = Math.round(0.4 * fps);

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
  const time = frame / fps;

  const baseMusicVolume = (seconds: number) => {
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

  const duck = duckValues[Math.min(frame, totalFrames)] ?? 0;
  const musicVolume = baseMusicVolume(time) * (1 - duck * 0.55);

  return (
    <>
      <Audio src={localFile(VOICE)} volume={0.95} />
      <Audio src={localFile(MUSIC)} volume={musicVolume} />
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
