import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { GF } from "../../config/garageflow";
import voiceData from "../../../public/audio/episodes/garageflow/voice.words.json";

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
    interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [total - fadeOut, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return <Audio src={localFile(cue.path)} volume={cue.volume * gain * SFX_GAIN} trimAfter={total} />;
};

const VOICE = "/audio/episodes/garageflow/voice.mp3";
const MUSIC = "/audio/episodes/coinbase/music/coinbase-bed-88s.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.08 },
  { timeSeconds: 8, volume: 0.12 },
  { timeSeconds: 16, volume: 0.13 },
  { timeSeconds: 22.8, volume: 0.11 },
  { timeSeconds: 33, volume: 0.155 },
  { timeSeconds: 43, volume: 0.16 },
  { timeSeconds: 56.5, volume: 0.175 },
  { timeSeconds: 67, volume: 0.19 },
  { timeSeconds: 77.4, volume: 0.155 },
  { timeSeconds: 84, volume: 0.13 },
  { timeSeconds: 87.3, volume: 0.08 },
  { timeSeconds: 90, volume: 0 },
];

const GARAGE = "/audio/episodes/garageflow/sfx";
const AIRBNB = "/audio/episodes/airbnb/sfx";
const BLACKBERRY = "/audio/episodes/blackberry/sfx";
const AI_AGENT = "/audio/episodes/ai-agent/sfx";
const KODAK = "/audio/episodes/kodak/sfx";
const FOOTBALL = "/audio/episodes/football/sfx";
const MCD = "/audio/episodes/mcdonalds/sfx";

const sfx = (
  id: string,
  file: string,
  startSeconds: number,
  durationSeconds: number,
  volume: number,
  fadeOutSeconds?: number,
): SfxCue => ({ id, path: file, startSeconds, durationSeconds, volume, fadeOutSeconds });

const SFX: SfxCue[] = [
  // Hook — the car, the workshop, the unanswered calls
  sfx("engine", `${GARAGE}/engine-start.wav`, 0.12, 2.6, 0.28, 0.5),
  sfx("ambience-hook", `${GARAGE}/workshop-ambience.wav`, 0.45, 5.2, 0.07, 1.2),
  sfx("ring-1", `${GARAGE}/phone-ring.wav`, 2.35, 2.2, 0.14, 0.4),
  sfx("call-1", `${FOOTBALL}/phone-notification.mp3`, 2.52, 0.7, 0.1, 0.2),
  sfx("call-2", `${FOOTBALL}/phone-notification.mp3`, 2.7, 0.7, 0.09, 0.2),
  sfx("call-3", `${FOOTBALL}/phone-notification.mp3`, 2.88, 0.7, 0.09, 0.2),
  sfx("call-4", `${FOOTBALL}/phone-notification.mp3`, 3.06, 0.7, 0.08, 0.2),
  sfx("call-5", `${FOOTBALL}/phone-notification.mp3`, 3.24, 0.7, 0.08, 0.2),
  sfx("hook-hit", `${AIRBNB}/low-impact.mp3`, 5.05, 1.2, 0.2, 0.6),
  sfx("hook-cut", `${AIRBNB}/transition-whoosh.mp3`, 7.86, 1.0, 0.18, 0.4),

  // Problem — the workshop ledger and the three fragments
  sfx("problem-impact", `${AIRBNB}/low-impact.mp3`, 8.1, 1.4, 0.18, 0.7),
  sfx("ambience-problem", `${GARAGE}/workshop-ambience.wav`, 8.2, 6.0, 0.05, 1.4),
  sfx("tool-1", `${GARAGE}/tool-drop.wav`, 9.4, 0.9, 0.1, 0.3),
  sfx("notebook-tick", `${BLACKBERRY}/data-tick.mp3`, 16.34, 0.2, 0.12, 0.06),
  sfx("spreadsheet-tick", `${BLACKBERRY}/data-tick.mp3`, 18.38, 0.2, 0.12, 0.06),
  sfx("phone-tick", `${BLACKBERRY}/data-tick.mp3`, 20.44, 0.2, 0.12, 0.06),
  sfx("problem-cut", `${AIRBNB}/transition-whoosh.mp3`, 22.64, 1.0, 0.16, 0.4),

  // Research — the numbers land one at a time
  sfx("research-scan", `${MCD}/ui-scan.mp3`, 22.95, 0.9, 0.12, 0.3),
  sfx("stat-1", `${BLACKBERRY}/data-tick.mp3`, 24.1, 0.2, 0.14, 0.06),
  sfx("stat-2", `${BLACKBERRY}/data-tick.mp3`, 25.3, 0.2, 0.13, 0.06),
  sfx("stat-3", `${BLACKBERRY}/data-tick.mp3`, 26.5, 0.2, 0.13, 0.06),
  sfx("research-pulse", `${BLACKBERRY}/low-pulse.mp3`, 27.8, 1.0, 0.1, 0.4),
  sfx("research-cut", `${AIRBNB}/transition-whoosh.mp3`, 32.86, 1.0, 0.16, 0.4),

  // Reveal — the product arrives
  sfx("reveal-open", `${BLACKBERRY}/editorial-reveal.mp3`, 33.08, 0.45, 0.2, 0.15),
  sfx("reveal-riser", `${AIRBNB}/riser.mp3`, 33.25, 2.2, 0.14, 0.4),
  sfx("reveal-bell", `${AI_AGENT}/warm-bell.mp3`, 34.55, 1.6, 0.1, 0.5),
  sfx("reveal-transform", `${BLACKBERRY}/system-transform.mp3`, 35.35, 0.9, 0.14, 0.3),
  sfx("reveal-cut", `${AIRBNB}/transition-whoosh.mp3`, 42.86, 1.0, 0.16, 0.4),

  // Demo — booking, job card, inspection, approval, status, invoice
  sfx("booking-notify", `${FOOTBALL}/phone-notification.mp3`, 43.35, 0.8, 0.12, 0.25),
  sfx("booking-click", `${BLACKBERRY}/digital-click.mp3`, 44.1, 0.14, 0.11, 0.05),
  sfx("card-tick", `${BLACKBERRY}/data-tick.mp3`, 45.42, 0.2, 0.12, 0.06),
  sfx("card-open", `${BLACKBERRY}/digital-click.mp3`, 45.55, 0.14, 0.12, 0.05),
  sfx("ratchet", `${GARAGE}/ratchet.wav`, 47.92, 0.95, 0.2, 0.25),
  sfx("photo-1", `${KODAK}/camera-shutter.mp3`, 49.05, 0.4, 0.13, 0.12),
  sfx("photo-2", `${KODAK}/camera-shutter.mp3`, 49.55, 0.4, 0.12, 0.12),
  sfx("photo-3", `${KODAK}/camera-shutter.mp3`, 50.05, 0.4, 0.11, 0.12),
  sfx("send-estimate", `${KODAK}/data-drop.mp3`, 51.2, 0.8, 0.13, 0.3),
  sfx("approval-tone", `${GARAGE}/approval-tone.wav`, 52.35, 1.6, 0.22, 0.5),
  sfx("approval-confirm", `${MCD}/ai-confirm.mp3`, 52.5, 0.8, 0.1, 0.25),
  sfx("everyone-pulse", `${BLACKBERRY}/low-pulse.mp3`, 54.72, 0.8, 0.1, 0.3),
  sfx("status-1", `${BLACKBERRY}/data-tick.mp3`, 56.45, 0.2, 0.1, 0.06),
  sfx("status-2", `${BLACKBERRY}/data-tick.mp3`, 57.45, 0.2, 0.1, 0.06),
  sfx("status-3", `${BLACKBERRY}/data-tick.mp3`, 58.45, 0.2, 0.1, 0.06),
  sfx("status-4", `${BLACKBERRY}/data-tick.mp3`, 59.45, 0.2, 0.1, 0.06),
  sfx("invoice-print", `${MCD}/receipt-print.mp3`, 60.55, 0.9, 0.12, 0.25),
  sfx("payment-success", `${AI_AGENT}/success-notification.mp3`, 63.35, 1.4, 0.2, 0.5),
  sfx("coins", `${AIRBNB}/coins-handling.mp3`, 63.75, 1.1, 0.08, 0.35),
  sfx("handover", `${GARAGE}/tool-drop.wav`, 65.1, 0.9, 0.1, 0.3),
  sfx("demo-cut", `${AIRBNB}/transition-whoosh.mp3`, 66.86, 1.0, 0.16, 0.4),

  // Opportunity — one problem, repeated
  sfx("opportunity-open", `${AIRBNB}/soft-whoosh.mp3`, 67.04, 1.0, 0.16, 0.4),
  sfx("opportunity-tick-1", `${BLACKBERRY}/data-tick.mp3`, 69.4, 0.2, 0.11, 0.06),
  sfx("opportunity-tick-2", `${BLACKBERRY}/data-tick.mp3`, 70.9, 0.2, 0.11, 0.06),
  sfx("opportunity-scan", `${MCD}/ui-scan.mp3`, 72.55, 0.9, 0.11, 0.3),
  sfx("opportunity-pulse", `${BLACKBERRY}/low-pulse.mp3`, 74.6, 0.9, 0.1, 0.35),
  sfx("opportunity-cut", `${AIRBNB}/transition-whoosh.mp3`, 77.24, 1.0, 0.16, 0.4),

  // Offer — build it
  sfx("offer-bell", `${AI_AGENT}/warm-bell.mp3`, 78.1, 1.6, 0.09, 0.5),
  sfx("offer-riser", `${AIRBNB}/riser.mp3`, 80.0, 1.8, 0.11, 0.4),
  sfx("offer-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 82.9, 0.35, 0.14, 0.12),
  sfx("offer-tick-1", `${BLACKBERRY}/data-tick.mp3`, 83.85, 0.2, 0.1, 0.06),
  sfx("offer-tick-2", `${BLACKBERRY}/data-tick.mp3`, 84.65, 0.2, 0.1, 0.06),
  sfx("offer-confirm", `${AI_AGENT}/success-notification.mp3`, 85.65, 1.2, 0.11, 0.4),
  sfx("brand-signature", `${BLACKBERRY}/brand-signature.mp3`, 87.36, 1.2, 0.26, 0.4),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 87.68, 2.3, 0.2, 1.0),
];

export const GarageFlowScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = GF.durationFrames;

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
      <Audio src={localFile(VOICE)} volume={1.0} />
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
