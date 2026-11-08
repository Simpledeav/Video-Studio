import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import cues from "../../../content/airbnb-cues.json";
import { FONT_STACK, useStage } from "../../config/airbnb";

type Cue = { start: number; end: number; text: string };

const MAX_CHARS = 46;

const splitLines = (text: string): string[] => {
  if (text.length <= MAX_CHARS) return [text];
  const words = text.split(/\s+/);
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i += 1) {
    const first = words.slice(0, i).join(" ");
    const second = words.slice(i).join(" ");
    if (first.length > MAX_CHARS + 6) break;
    const diff = Math.abs(first.length - second.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

/**
 * Subtitles: quiet, bottom-weighted, two lines maximum, no background box.
 * They sit under the editorial type and never compete with it.
 */
export const AirbnbCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide } = useStage();
  const time = frame / fps;
  const list = cues.cues as Cue[];
  const active = list.find((cue) => time >= cue.start && time < cue.end);
  if (!active) return null;

  const lines = splitLines(active.text);
  const local = (time - active.start) * fps;
  const opacity = Math.min(
    interpolate(local, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate((active.end - time) * fps, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: wide ? "50%" : 76,
          right: wide ? undefined : 76,
          width: wide ? 880 : undefined,
          bottom: wide ? 56 : 124,
          transform: wide ? "translateX(-50%)" : undefined,
          display: "flex",
          justifyContent: "center",
          opacity,
        }}
      >
        <div
          style={{
            maxWidth: wide ? 860 : 900,
            padding: "10px 22px 12px",
            borderRadius: 6,
            background: "linear-gradient(180deg, rgba(10,9,8,0.18), rgba(10,9,8,0.42))",
            backdropFilter: "blur(2px)",
            textAlign: "center",
            fontFamily: FONT_STACK,
            fontSize: wide ? 27 : 31,
            lineHeight: 1.34,
            fontWeight: 500,
            letterSpacing: "-0.005em",
            color: "#F5F1E9",
            textShadow: "0 2px 16px rgba(0,0,0,0.85)",
          }}
        >
          {lines.map((line, index) => (
            <div key={`${line}-${index}`}>{line}</div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
