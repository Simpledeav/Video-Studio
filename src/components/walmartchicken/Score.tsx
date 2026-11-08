import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { WC } from "../../config/walmartChicken";
import voiceData from "../../../public/audio/episodes/walmart-chicken/voice.words.json";

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

const SFX_GAIN = 0.7;

const Sfx: React.FC<{ cue: SfxCue; fps: number }> = ({ cue, fps }) => {
  const frame = useCurrentFrame();
  const total = Math.max(1, Math.round(cue.durationSeconds * fps));
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? 0.03) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.15) * fps));
  const gain = Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [total - fadeOut, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return <Audio src={localFile(cue.path)} volume={cue.volume * gain * SFX_GAIN} trimAfter={total} />;
};

const VOICE = "/audio/episodes/walmart-chicken/voice.mp3";
const MUSIC = "/audio/episodes/walmart-chicken/music/walmart-chicken-bed.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.16 },
  { timeSeconds: 5, volume: 0.17 },
  { timeSeconds: 12, volume: 0.18 },
  { timeSeconds: 20, volume: 0.2 },
  { timeSeconds: 30, volume: 0.22 },
  { timeSeconds: 40, volume: 0.21 },
  { timeSeconds: 50, volume: 0.23 },
  { timeSeconds: 55, volume: 0.24 },
  { timeSeconds: 62, volume: 0.24 },
  { timeSeconds: 68, volume: 0.2 },
  { timeSeconds: 72, volume: 0.18 },
  { timeSeconds: 76, volume: 0.14 },
  { timeSeconds: 80, volume: 0 },
];

const EP = "/audio/episodes/walmart-chicken/sfx";
const AIRBNB = "/audio/episodes/airbnb/sfx";
const BLACKBERRY = "/audio/episodes/blackberry/sfx";
const AI_AGENT = "/audio/episodes/ai-agent/sfx";
const LEGO = "/audio/episodes/lego/sfx";
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
  // Hook
  sfx("open-impact", `${AIRBNB}/opening-impact.mp3`, 0, 1.8, 0.4, 0.6),
  sfx("cluck-open", `${EP}/cluck.mp3`, 0.22, 1.1, 0.58, 0.2),
  sfx("scratch", `${EP}/scratch.mp3`, 2.32, 0.9, 0.62, 0.18),
  sfx("cluck-swing", `${EP}/cluck.mp3`, 2.5, 0.8, 0.4, 0.15),
  sfx("swing-whoosh", `${EP}/whoosh.mp3`, 2.68, 1.0, 0.55, 0.4),
  sfx("hook-out", `${AIRBNB}/transition-whoosh.mp3`, 4.35, 1.1, 0.4, 0.45),

  // Story
  sfx("deli-tone", `${AI_AGENT}/office-room-tone.mp3`, 5.1, 4.2, 0.08, 1.2),
  sfx("comment-1", `${EP}/pop.mp3`, 5.95, 0.5, 0.3, 0.1),
  sfx("comment-2", `${EP}/pop.mp3`, 6.65, 0.5, 0.28, 0.1),
  sfx("comment-3", `${EP}/pop.mp3`, 7.35, 0.5, 0.28, 0.1),
  sfx("internet-laugh", `${EP}/crowd-laugh.mp3`, 9.4, 1.7, 0.16, 0.5),
  sfx("count-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 10.9, 1.0, 0.34, 0.4),
  sfx("count-tick", `${BLACKBERRY}/data-tick.mp3`, 11.9, 0.2, 0.18, 0.05),
  sfx("count-riser", `${AIRBNB}/riser.mp3`, 12.2, 2.4, 0.2, 0.6),
  sfx("listen-sting", `${AIRBNB}/brand-sting.mp3`, 16.85, 2.0, 0.3, 0.8),
  sfx("listen-in", `${AIRBNB}/transition-whoosh.mp3`, 16.9, 1.0, 0.4, 0.4),
  sfx("listen-chime", `${AI_AGENT}/success-notification.mp3`, 17.35, 0.9, 0.2, 0.35),

  // Build
  sfx("build-in", `${AIRBNB}/transition-whoosh.mp3`, 19.65, 1.1, 0.42, 0.45),
  sfx("sticky-1", `${AIRBNB}/paper-slide.mp3`, 20.15, 0.8, 0.22, 0.2),
  sfx("sticky-2", `${AIRBNB}/paper-crinkle.mp3`, 21.0, 0.7, 0.18, 0.2),
  sfx("board-shot", `${AIRBNB}/camera-shutter.mp3`, 23.35, 0.4, 0.26, 0.08),
  sfx("spec-in", `${AIRBNB}/transition-whoosh.mp3`, 23.95, 1.0, 0.42, 0.4),
  sfx("sketch-in", `${AIRBNB}/soft-whoosh.mp3`, 28.45, 1.0, 0.4, 0.4),
  sfx("spec-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 30.35, 0.6, 0.22, 0.15),
  sfx("fabric-in", `${EP}/whoosh2.mp3`, 33.3, 1.0, 0.42, 0.4),
  sfx("stitch-1", `${LEGO}/mechanical-move.mp3`, 34.0, 0.7, 0.2, 0.2),
  sfx("stitch-2", `${LEGO}/mechanical-move.mp3`, 35.0, 0.7, 0.18, 0.2),
  sfx("flavor-in", `${AIRBNB}/transition-whoosh.mp3`, 36.85, 1.0, 0.42, 0.4),
  sfx("flavor-pop", `${EP}/pop.mp3`, 37.4, 0.5, 0.26, 0.1),
  sfx("price-riser", `${AIRBNB}/riser.mp3`, 39.5, 2.2, 0.25, 0.5),

  // Price
  sfx("cash-coins", `${EP}/coins.mp3`, 39.98, 1.2, 0.38, 0.3),
  sfx("receipt-1", `${MCD}/receipt-print.mp3`, 40.15, 1.1, 0.26, 0.2),
  sfx("price-impact", `${AIRBNB}/low-impact.mp3`, 40.32, 1.3, 0.34, 0.6),
  sfx("receipt-2", `${MCD}/receipt-print.mp3`, 46.0, 1.1, 0.24, 0.2),
  sfx("drop-coins", `${EP}/coins.mp3`, 49.0, 1.0, 0.26, 0.25),
  sfx("charms-riser", `${AIRBNB}/riser.mp3`, 52.0, 2.0, 0.22, 0.5),

  // Viral
  sfx("viral-in", `${EP}/whoosh.mp3`, 55.0, 0.9, 0.46, 0.35),
  sfx("ui-click", `${BLACKBERRY}/touch-tap.mp3`, 55.6, 0.2, 0.24, 0.05),
  sfx("sellout-cheer", `${EP}/crowd-cheer.mp3`, 58.0, 2.6, 0.32, 0.8),
  sfx("sellout-impact", `${AIRBNB}/low-impact.mp3`, 58.18, 1.4, 0.42, 0.6),
  sfx("sellout-shot", `${EP}/shutter.mp3`, 59.0, 0.4, 0.28, 0.08),
  sfx("resale-in", `${AIRBNB}/soft-whoosh.mp3`, 61.0, 1.0, 0.34, 0.4),
  sfx("internet-laugh-2", `${EP}/crowd-laugh.mp3`, 64.8, 1.4, 0.12, 0.4),
  sfx("viral-out", `${AIRBNB}/soft-whoosh.mp3`, 66.6, 1.0, 0.34, 0.4),

  // Ending
  sfx("ending-sting", `${AIRBNB}/brand-sting.mp3`, 70.0, 2.4, 0.38, 0.9),
  sfx("ending-low", `${AIRBNB}/low-impact.mp3`, 72.0, 1.4, 0.24, 0.6),
  sfx("ending-pulse", `${BLACKBERRY}/low-pulse.mp3`, 74.2, 1.6, 0.14, 0.6),
  sfx("ending-riser", `${AIRBNB}/riser.mp3`, 75.5, 2.0, 0.2, 0.6),
  sfx("signature", `${BLACKBERRY}/brand-signature.mp3`, 77.0, 1.5, 0.3, 0.6),
];

export const WalmartChickenScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = WC.durationFrames;

  const voiceWindows = useMemo(
    () => voiceData.segments.map((segment) => ({ start: segment.start, end: segment.end })),
    [],
  );

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.16 * fps);
    const release = Math.round(0.42 * fps);
    const targets = new Array<number>(totalFrames + 1).fill(0);

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
        const p = (seconds - prev.timeSeconds) / (next.timeSeconds - prev.timeSeconds);
        return prev.volume + (next.volume - prev.volume) * p;
      }
    }
    return MUSIC_POINTS[MUSIC_POINTS.length - 1].volume;
  };

  const musicVolume = baseMusicVolume(time) * (1 - (duckValues[Math.min(frame, totalFrames)] ?? 0) * 0.54);

  return (
    <>
      <Audio src={localFile(MUSIC)} volume={musicVolume} />
      <Audio src={localFile(VOICE)} volume={0.92} />
      {SFX.map((cue) => (
        <Sequence
          key={cue.id}
          from={Math.round(cue.startSeconds * fps)}
          durationInFrames={Math.round(cue.durationSeconds * fps)}
          layout="none"
          name={cue.id}
        >
          <Sfx cue={cue} fps={fps} />
        </Sequence>
      ))}
    </>
  );
};
