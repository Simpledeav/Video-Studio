import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { PL } from "../../config/pocketLedger";
import voiceData from "../../../public/audio/episodes/pocketledger/voice.words.json";

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

const VOICE = "/audio/episodes/pocketledger/voice.mp3";
const MUSIC = "/audio/episodes/ai-agent/music/silent-descent-90s.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.1 },
  { timeSeconds: 8, volume: 0.12 },
  { timeSeconds: 20, volume: 0.13 },
  { timeSeconds: 32, volume: 0.16 },
  { timeSeconds: 43, volume: 0.18 },
  { timeSeconds: 55, volume: 0.17 },
  { timeSeconds: 66, volume: 0.2 },
  { timeSeconds: 76, volume: 0.22 },
  { timeSeconds: 82, volume: 0.18 },
  { timeSeconds: 86.7, volume: 0.14 },
  { timeSeconds: 90, volume: 0 },
];

const AIRBNB = "/audio/episodes/airbnb/sfx";
const BLACKBERRY = "/audio/episodes/blackberry/sfx";
const AI_AGENT = "/audio/episodes/ai-agent/sfx";
const FOOTBALL = "/audio/episodes/football/sfx";

const sfx = (
  id: string,
  file: string,
  startSeconds: number,
  durationSeconds: number,
  volume: number,
  fadeOutSeconds?: number,
): SfxCue => ({ id, path: file, startSeconds, durationSeconds, volume, fadeOutSeconds });

const SFX: SfxCue[] = [
  // Scene 1 — the startup dream
  sfx("open-pulse", `${BLACKBERRY}/low-pulse.mp3`, 0.0, 1.4, 0.16, 0.6),
  sfx("ticker-1", `${BLACKBERRY}/data-tick.mp3`, 0.4, 0.2, 0.12, 0.06),
  sfx("ticker-2", `${BLACKBERRY}/digital-click.mp3`, 0.9, 0.14, 0.12, 0.05),
  sfx("ticker-3", `${BLACKBERRY}/data-tick.mp3`, 1.45, 0.2, 0.12, 0.06),
  sfx("ticker-4", `${BLACKBERRY}/digital-click.mp3`, 1.95, 0.14, 0.11, 0.05),
  sfx("dream-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 3.85, 1.1, 0.22, 0.45),
  sfx("shop-tone-1", `${AI_AGENT}/office-room-tone.mp3`, 4.2, 3.4, 0.12, 1.0),

  // Scene 2 — the person behind the problem
  sfx("shop-tone-2", `${AI_AGENT}/office-room-tone.mp3`, 8.2, 4.0, 0.1, 1.2),
  sfx("cash-count", `${AIRBNB}/coins-handling.mp3`, 10.9, 1.8, 0.24, 0.5),
  sfx("notebook-paper", `${AIRBNB}/paper-slide.mp3`, 12.9, 0.8, 0.18, 0.25),
  sfx("transfer-in", `${FOOTBALL}/phone-notification.mp3`, 14.9, 0.9, 0.26, 0.3),
  sfx("market-ambience", `${FOOTBALL}/crowd-loop.mp3`, 17.0, 2.6, 0.1, 0.8),

  // Scene 3 — the evidence
  sfx("evidence-pulse", `${BLACKBERRY}/low-pulse.mp3`, 20.0, 1.5, 0.17, 0.7),
  sfx("stat-64", `${BLACKBERRY}/data-tick.mp3`, 20.6, 0.2, 0.15, 0.06),
  sfx("stat-bar", `${BLACKBERRY}/system-transform.mp3`, 21.6, 1.2, 0.18, 0.5),
  sfx("stat-32", `${BLACKBERRY}/data-tick.mp3`, 24.3, 0.2, 0.15, 0.06),
  sfx("stat-impact", `${AIRBNB}/low-impact.mp3`, 25.0, 1.2, 0.22, 0.6),
  sfx("source-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 26.8, 0.5, 0.14, 0.15),

  // Scene 4 — the small idea
  sfx("idea-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 32.8, 1.0, 0.2, 0.45),
  sfx("idea-click", `${BLACKBERRY}/digital-click.mp3`, 33.05, 0.14, 0.14, 0.05),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 35.2, 2.0, 0.25, 0.9),
  sfx("home-chime", `${AI_AGENT}/success-notification.mp3`, 37.3, 0.9, 0.15, 0.4),
  sfx("feature-tick", `${BLACKBERRY}/data-tick.mp3`, 39.4, 0.2, 0.12, 0.06),

  // Scene 5 — product demo
  sfx("tap-sale", `${BLACKBERRY}/touch-tap.mp3`, 44.5, 0.18, 0.2, 0.05),
  sfx("save-sale", `${BLACKBERRY}/digital-click.mp3`, 48.3, 0.16, 0.18, 0.05),
  sfx("sale-saved", `${AI_AGENT}/success-notification.mp3`, 48.5, 0.8, 0.18, 0.35),
  sfx("tap-expense", `${BLACKBERRY}/touch-tap.mp3`, 50.1, 0.18, 0.2, 0.05),
  sfx("save-expense", `${BLACKBERRY}/digital-click.mp3`, 52.7, 0.16, 0.18, 0.05),
  sfx("expense-saved", `${AI_AGENT}/success-notification.mp3`, 52.9, 0.8, 0.18, 0.35),
  sfx("tap-personal", `${BLACKBERRY}/touch-tap.mp3`, 54.2, 0.18, 0.2, 0.05),
  sfx("save-personal", `${BLACKBERRY}/digital-click.mp3`, 56.7, 0.16, 0.18, 0.05),
  sfx("personal-saved", `${AI_AGENT}/success-notification.mp3`, 56.9, 0.8, 0.16, 0.35),
  sfx("tap-summary", `${BLACKBERRY}/touch-tap.mp3`, 57.9, 0.18, 0.2, 0.05),
  sfx("summary-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 58.3, 0.5, 0.16, 0.15),
  sfx("profit-tick", `${BLACKBERRY}/data-tick.mp3`, 60.2, 0.2, 0.14, 0.06),
  sfx("reminder", `${FOOTBALL}/phone-notification.mp3`, 62.7, 0.9, 0.22, 0.3),

  // Scene 6 — the bigger lesson
  sfx("lesson-warm", `${AI_AGENT}/warm-bell.mp3`, 66.3, 1.8, 0.14, 0.8),
  sfx("notebook-close", `${AIRBNB}/paper-slide.mp3`, 69.4, 0.8, 0.16, 0.25),
  sfx("relief-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 71.4, 1.0, 0.18, 0.45),
  sfx("lesson-riser", `${AIRBNB}/riser.mp3`, 73.0, 2.2, 0.18, 0.6),
  sfx("lesson-sting", `${BLACKBERRY}/brand-signature.mp3`, 75.5, 1.6, 0.24, 0.7),

  // Scene 7 — the ending
  sfx("ending-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 79.2, 1.1, 0.2, 0.45),
  sfx("ending-warm", `${AI_AGENT}/warm-bell.mp3`, 80.2, 1.8, 0.16, 0.8),
  sfx("signature", `${BLACKBERRY}/brand-signature.mp3`, 86.7, 1.4, 0.28, 0.5),
  sfx("signature-sting", `${AIRBNB}/brand-sting.mp3`, 87.0, 2.2, 0.2, 1.0),
];

export const PocketLedgerScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = PL.durationFrames;

  const voiceWindows = useMemo(
    () => voiceData.segments.map((segment) => ({ start: segment.start, end: segment.end })),
    [],
  );

  const duckValues = useMemo(() => {
    const values = new Array<number>(totalFrames + 1).fill(0);
    const attack = Math.round(0.16 * fps);
    const release = Math.round(0.4 * fps);
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
