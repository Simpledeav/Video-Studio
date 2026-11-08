import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { LD } from "../../config/liquidDeath";
import voiceData from "../../../public/audio/episodes/liquid-death/voice.words.json";

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

const VOICE = "/audio/episodes/liquid-death/voice.mp3";
const MUSIC = "/audio/episodes/ai-agent/music/silent-descent-90s.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.11 },
  { timeSeconds: 6.8, volume: 0.13 },
  { timeSeconds: 17, volume: 0.155 },
  { timeSeconds: 28, volume: 0.175 },
  { timeSeconds: 42, volume: 0.195 },
  { timeSeconds: 55, volume: 0.16 },
  { timeSeconds: 62, volume: 0.185 },
  { timeSeconds: 69.5, volume: 0.165 },
  { timeSeconds: 76, volume: 0.2 },
  { timeSeconds: 81, volume: 0.15 },
  { timeSeconds: 87, volume: 0.12 },
  { timeSeconds: 90, volume: 0 },
];

const LD_SFX = "/audio/episodes/liquid-death/sfx";
const AIRBNB = "/audio/episodes/airbnb/sfx";
const BLACKBERRY = "/audio/episodes/blackberry/sfx";
const AI_AGENT = "/audio/episodes/ai-agent/sfx";
const LEGO = "/audio/episodes/lego/sfx";
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
  // Scene 1 — the impossible product
  sfx("hook-low", `${BLACKBERRY}/low-pulse.mp3`, 0.0, 1.3, 0.16, 0.6),
  sfx("can-spin", `${LD_SFX}/metal-spin.mp3`, 0.35, 3.4, 0.3, 1.0),
  sfx("hero-impact", `${LEGO}/impact-deep.mp3`, 1.5, 2.4, 0.38, 1.2),
  sfx("can-open", `${LD_SFX}/can-open.mp3`, 4.34, 0.6, 0.5, 0.25),
  sfx("pour", `${LD_SFX}/pour.mp3`, 4.9, 2.7, 0.48, 0.8),
  sfx("drop-1", `${LD_SFX}/water-drop.mp3`, 5.35, 0.4, 0.28, 0.1),
  sfx("drop-2", `${LD_SFX}/water-drop.mp3`, 5.9, 0.4, 0.22, 0.1),
  sfx("cut-1", `${AIRBNB}/transition-whoosh.mp3`, 6.6, 1.0, 0.22, 0.44),

  // Scene 2 — the boring aisle
  sfx("aisle-tone", `${AI_AGENT}/office-room-tone.mp3`, 7.1, 3.2, 0.1, 1.2),
  sfx("paper-aisle", `${AIRBNB}/paper-slide.mp3`, 7.25, 0.55, 0.16, 0.2),
  sfx("energy-riser", `${AIRBNB}/riser.mp3`, 10.9, 1.8, 0.2, 0.5),
  sfx("shutter", `${AIRBNB}/camera-shutter.mp3`, 13.5, 0.4, 0.2, 0.12),
  sfx("photo-warm", `${AI_AGENT}/warm-bell.mp3`, 13.7, 1.8, 0.1, 0.8),

  // Scene 3 — the crazy idea
  sfx("notebook-paper", `${AIRBNB}/paper-slide.mp3`, 17.15, 0.7, 0.18, 0.25),
  sfx("idea-click-1", `${BLACKBERRY}/digital-click.mp3`, 18.45, 0.14, 0.14, 0.05),
  sfx("idea-click-2", `${BLACKBERRY}/data-tick.mp3`, 18.85, 0.18, 0.14, 0.06),
  sfx("idea-click-3", `${BLACKBERRY}/digital-click.mp3`, 19.25, 0.14, 0.14, 0.05),
  sfx("logo-sting", `${AIRBNB}/brand-sting.mp3`, 19.7, 2.0, 0.26, 1.0),
  sfx("can-reveal", `${LD_SFX}/metal-spin.mp3`, 21.2, 2.0, 0.24, 0.8),
  sfx("tagline-impact", `${AIRBNB}/low-impact.mp3`, 24.0, 1.2, 0.3, 0.6),

  // Scene 4 — manufacturing
  sfx("factory-hit", `${LEGO}/factory-hit.mp3`, 28.1, 0.9, 0.34, 0.35),
  sfx("line-loop", `${LEGO}/mechanical-move.mp3`, 28.7, 5.6, 0.2, 0.8),
  sfx("docs-paper", `${AIRBNB}/paper-slide.mp3`, 32.4, 0.7, 0.18, 0.25),
  sfx("funding-tick", `${BLACKBERRY}/data-tick.mp3`, 36.1, 0.2, 0.13, 0.06),
  sfx("problem-pulse", `${BLACKBERRY}/low-pulse.mp3`, 38.2, 1.4, 0.18, 0.6),
  sfx("pitch-riser", `${AIRBNB}/riser.mp3`, 38.7, 1.5, 0.18, 0.4),
  sfx("idea-stamp", `${FOOTBALL}/contract-stamp.mp3`, 39.2, 0.4, 0.16, 0.12),

  // Scene 5 — attention first
  sfx("phone-in", `${FOOTBALL}/phone-notification.mp3`, 42.25, 0.8, 0.26, 0.3),
  sfx("watch-start", `${AIRBNB}/transition-whoosh.mp3`, 43.2, 0.9, 0.16, 0.4),
  sfx("watch-chime", `${AI_AGENT}/success-notification.mp3`, 45.1, 0.8, 0.18, 0.4),
  sfx("views-tick", `${BLACKBERRY}/data-tick.mp3`, 46.0, 0.2, 0.12, 0.06),
  sfx("retail-1", `${FOOTBALL}/phone-notification.mp3`, 47.2, 0.7, 0.2, 0.25),
  sfx("retail-2", `${FOOTBALL}/phone-notification.mp3`, 47.7, 0.7, 0.18, 0.25),
  sfx("retail-3", `${FOOTBALL}/phone-notification.mp3`, 48.2, 0.7, 0.17, 0.25),
  sfx("shelf-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 50.1, 1.1, 0.2, 0.5),
  sfx("shelf-click", `${BLACKBERRY}/editorial-reveal.mp3`, 52.1, 0.5, 0.16, 0.15),
  sfx("attention-sting", `${AIRBNB}/brand-sting.mp3`, 53.3, 1.8, 0.2, 0.8),

  // Scene 6 — the hidden cost
  sfx("shipping-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 55.0, 1.1, 0.2, 0.5),
  sfx("ship-rumble", `${LD_SFX}/container-rumble.mp3`, 55.8, 6.7, 0.36, 1.4),
  sfx("route-tick", `${BLACKBERRY}/data-tick.mp3`, 57.15, 0.2, 0.13, 0.06),
  sfx("cost-impact", `${LEGO}/impact-deep.mp3`, 59.95, 2.6, 0.52, 1.3),
  sfx("chart-fall", `${BLACKBERRY}/chart-fall.mp3`, 60.8, 0.8, 0.22, 0.3),
  sfx("economics-pulse", `${BLACKBERRY}/low-pulse.mp3`, 63.2, 1.6, 0.16, 0.7),
  sfx("losses-riser", `${AIRBNB}/riser.mp3`, 65.7, 1.3, 0.17, 0.35),
  sfx("losses-hit", `${AIRBNB}/low-impact.mp3`, 66.3, 1.3, 0.24, 0.6),

  // Scene 7 — the real lesson
  sfx("lesson-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 69.5, 1.2, 0.2, 0.5),
  sfx("lineup-tick", `${BLACKBERRY}/data-tick.mp3`, 70.6, 0.2, 0.12, 0.06),
  sfx("shelf-tick", `${BLACKBERRY}/data-tick.mp3`, 73.2, 0.2, 0.12, 0.06),
  sfx("brand-riser", `${AIRBNB}/riser.mp3`, 76.1, 2.0, 0.2, 0.6),
  sfx("brand-sting", `${BLACKBERRY}/brand-signature.mp3`, 76.9, 1.5, 0.26, 0.7),
  sfx("brand-warm", `${AI_AGENT}/warm-bell.mp3`, 78.6, 1.6, 0.12, 0.7),

  // Scene 8 — the punchline
  sfx("finale-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 81.0, 1.1, 0.2, 0.5),
  sfx("finale-impact", `${AIRBNB}/low-impact.mp3`, 82.0, 1.2, 0.3, 0.6),
  sfx("signature", `${BLACKBERRY}/brand-signature.mp3`, 87.0, 1.4, 0.3, 0.5),
  sfx("signature-sting", `${AIRBNB}/brand-sting.mp3`, 87.35, 2.2, 0.22, 1.1),
];

export const LiquidDeathScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = LD.durationFrames;

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
