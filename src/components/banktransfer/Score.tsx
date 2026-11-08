import { useMemo } from "react";
import { Audio } from "@remotion/media";
import { Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { BT } from "../../config/bankTransfer";
import voiceData from "../../../public/audio/episodes/bank-transfer/voice.words.json";

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
  const fadeIn = Math.max(1, Math.round((cue.fadeInSeconds ?? 0.035) * fps));
  const fadeOut = Math.max(1, Math.round((cue.fadeOutSeconds ?? 0.16) * fps));
  const gain = Math.min(
    interpolate(frame, [0, fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [total - fadeOut, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  return <Audio src={localFile(cue.path)} volume={cue.volume * gain * SFX_GAIN} trimAfter={total} />;
};

const VOICE = "/audio/episodes/bank-transfer/voice.mp3";
const MUSIC = "/audio/episodes/ai-agent/music/silent-descent-90s.mp3";

const MUSIC_POINTS = [
  { timeSeconds: 0, volume: 0.1 },
  { timeSeconds: 7, volume: 0.13 },
  { timeSeconds: 16, volume: 0.15 },
  { timeSeconds: 26.5, volume: 0.17 },
  { timeSeconds: 38.5, volume: 0.19 },
  { timeSeconds: 48.6, volume: 0.115 },
  { timeSeconds: 56, volume: 0.135 },
  { timeSeconds: 69.3, volume: 0.17 },
  { timeSeconds: 80, volume: 0.145 },
  { timeSeconds: 87.5, volume: 0.1 },
  { timeSeconds: 90.5, volume: 0 },
];

const AIRBNB = "/audio/episodes/airbnb/sfx";
const BLACKBERRY = "/audio/episodes/blackberry/sfx";
const AI_AGENT = "/audio/episodes/ai-agent/sfx";
const KODAK = "/audio/episodes/kodak/sfx";
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
  // Scene 1 — the missing transfer
  sfx("phone-in", `${FOOTBALL}/phone-notification.mp3`, 0.22, 0.9, 0.3, 0.35),
  sfx("success-chime", `${AI_AGENT}/success-notification.mp3`, 1.15, 1.1, 0.16, 0.4),
  sfx("amount-tick", `${BLACKBERRY}/data-tick.mp3`, 3.12, 0.18, 0.16, 0.08),
  sfx("money-impact", `${LEGO}/impact-deep.mp3`, 4.5, 2.2, 0.48, 1.2),
  sfx("question-pulse", `${BLACKBERRY}/low-pulse.mp3`, 5.2, 1.2, 0.14, 0.6),

  // Scene 2 — the invisible network
  sfx("network-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 6.95, 1.1, 0.18, 0.5),
  sfx("network-scan", `${BLACKBERRY}/system-transform.mp3`, 7.15, 1.4, 0.2, 0.6),
  sfx("network-click", `${BLACKBERRY}/digital-click.mp3`, 9.3, 0.12, 0.13, 0.05),
  sfx("network-tick", `${BLACKBERRY}/data-tick.mp3`, 12.05, 0.2, 0.12, 0.06),

  // Scene 3 — follow the message
  sfx("route-whoosh", `${BLACKBERRY}/digital-click.mp3`, 15.5, 0.14, 0.16, 0.05),
  sfx("route-node-1", `${BLACKBERRY}/data-tick.mp3`, 15.72, 0.2, 0.15, 0.06),
  sfx("route-node-2", `${BLACKBERRY}/data-tick.mp3`, 16.5, 0.2, 0.14, 0.06),
  sfx("route-node-3", `${BLACKBERRY}/data-tick.mp3`, 17.4, 0.2, 0.13, 0.06),
  sfx("route-node-4", `${BLACKBERRY}/data-tick.mp3`, 18.3, 0.2, 0.14, 0.06),
  sfx("route-packet", `${KODAK}/data-drop.mp3`, 19.9, 0.7, 0.12, 0.3),

  // Scene 4 — timeout / pending / credit not confirmed
  sfx("failure-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 26.45, 1.1, 0.2, 0.5),
  sfx("failure-drop", `${KODAK}/data-drop.mp3`, 26.82, 0.8, 0.2, 0.3),
  sfx("timeout-glitch", `${BLACKBERRY}/chart-fall.mp3`, 28.32, 0.55, 0.18, 0.25),
  sfx("pending-alert", `${AI_AGENT}/tension-hit.mp3`, 31.6, 1.8, 0.2, 0.8),
  sfx("unconfirmed-tick", `${BLACKBERRY}/data-tick.mp3`, 35.1, 0.2, 0.15, 0.06),
  sfx("unconfirmed-low", `${AIRBNB}/low-impact.mp3`, 37.5, 1.0, 0.16, 0.5),

  // Scene 5 — no alert, but the credit is there
  sfx("alert-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 38.55, 1.0, 0.17, 0.4),
  sfx("no-sms-tick", `${BLACKBERRY}/data-tick.mp3`, 39.1, 0.18, 0.12, 0.05),
  sfx("credit-confirmed", `${AI_AGENT}/success-notification.mp3`, 43.5, 2.4, 0.24, 0.8),
  sfx("history-tick", `${BLACKBERRY}/digital-click.mp3`, 46.2, 0.12, 0.12, 0.05),

  // Scene 6 — the three-step trace
  sfx("trace-whoosh", `${AIRBNB}/transition-whoosh.mp3`, 48.65, 1.1, 0.18, 0.5),
  sfx("step-1", `${BLACKBERRY}/digital-click.mp3`, 49.3, 0.12, 0.15, 0.05),
  sfx("step-1-pause", `${BLACKBERRY}/low-pulse.mp3`, 50.85, 0.5, 0.14, 0.2),
  sfx("step-2", `${BLACKBERRY}/digital-click.mp3`, 52.85, 0.12, 0.15, 0.05),
  sfx("step-2-tick", `${BLACKBERRY}/data-tick.mp3`, 53.6, 0.2, 0.13, 0.06),
  sfx("step-3", `${BLACKBERRY}/digital-click.mp3`, 55.55, 0.12, 0.15, 0.05),
  sfx("ussd-typing", `${BLACKBERRY}/keyboard-burst.mp3`, 56.0, 1.3, 0.13, 0.4),
  sfx("tracker-scan", `${BLACKBERRY}/low-pulse.mp3`, 59.0, 2.0, 0.12, 0.8),
  sfx("outcome-success", `${AI_AGENT}/success-notification.mp3`, 63.45, 1.6, 0.17, 0.6),
  sfx("outcome-fail", `${AIRBNB}/low-impact.mp3`, 66.85, 0.9, 0.15, 0.4),

  // Scene 7 — rights and escalation
  sfx("rights-whoosh", `${AI_AGENT}/tension-hit.mp3`, 69.35, 1.6, 0.13, 0.7),
  sfx("complaint-click", `${BLACKBERRY}/digital-click.mp3`, 69.6, 0.12, 0.14, 0.05),
  sfx("ticket-reveal", `${BLACKBERRY}/editorial-reveal.mp3`, 71.6, 0.4, 0.18, 0.15),
  sfx("cbn-reveal", `${BLACKBERRY}/system-transform.mp3`, 73.35, 0.8, 0.16, 0.35),
  sfx("cbn-tick", `${BLACKBERRY}/data-tick.mp3`, 75.4, 0.2, 0.12, 0.06),

  // Scene 8 — the trail reaches the destination
  sfx("final-whoosh", `${AIRBNB}/soft-whoosh.mp3`, 80.1, 1.1, 0.19, 0.5),
  sfx("final-scan", `${BLACKBERRY}/system-transform.mp3`, 81.0, 1.2, 0.16, 0.5),
  sfx("credit-final", `${AI_AGENT}/success-notification.mp3`, 84.3, 2.4, 0.27, 0.9),
  sfx("brand-signature", `${BLACKBERRY}/brand-signature.mp3`, 87.55, 1.2, 0.26, 0.4),
  sfx("brand-sting", `${AIRBNB}/brand-sting.mp3`, 88.0, 2.3, 0.2, 1.2),
];

export const BankTransferScore: React.FC = () => {
  const { fps } = useVideoConfig();
  const totalFrames = BT.durationFrames;

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
