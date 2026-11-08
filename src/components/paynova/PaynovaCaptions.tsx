import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/paynova/voice.cues.json";
import { C, FONT } from "../../config/paynova";

const MAX_CHARACTERS_PER_LINE = 46;

const splitCue = (text: string): string[] => {
  if (text.length <= MAX_CHARACTERS_PER_LINE) return [text];
  const words = text.split(/\s+/);
  let bestIndex = 1;
  let bestDifference = Number.POSITIVE_INFINITY;
  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const difference = Math.abs(first.length - second.length);
    if (difference < bestDifference && first.length <= MAX_CHARACTERS_PER_LINE + 8) {
      bestDifference = difference;
      bestIndex = index;
    }
  }
  return [words.slice(0, bestIndex).join(" "), words.slice(bestIndex).join(" ")];
};

export const PaynovaCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const cues = cuesData.cues;
  const active = cues.find((cue) => time >= cue.start && time < cue.end);

  if (!active) return null;

  const lines = splitCue(active.text);
  const cueFrame = (time - active.start) * fps;
  const opacity = interpolate(cueFrame, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 72,
        right: 72,
        bottom: 124,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 936,
          padding: "14px 26px 15px",
          borderRadius: 12,
          background: "rgba(7, 10, 18, 0.52)",
          border: "1px solid rgba(84, 217, 245, 0.12)",
          color: C.white,
          fontFamily: FONT,
          fontSize: 36,
          lineHeight: 1.28,
          fontWeight: 500,
          letterSpacing: "-0.01em",
          textAlign: "center",
          textShadow: "0 2px 14px rgba(0,0,0,0.7)",
          boxShadow: "0 14px 44px rgba(0,0,0,0.24)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
    </div>
  );
};
