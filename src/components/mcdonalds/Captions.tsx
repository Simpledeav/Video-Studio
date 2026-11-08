import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, useStage } from "../../config/mcdonalds";
import cuesData from "../../../public/audio/episodes/mcdonalds/voice.cues.json";
import { clamp } from "./kit";

const splitLine = (text: string, max: number): string[] => {
  if (text.length <= max) return [text];
  const words = text.split(/\s+/);
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i += 1) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff && a.length <= max + 8) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

const highlight = (word: string): string | undefined => {
  const key = word.replace(/[^a-zA-Z0-9+]/g, "").toLowerCase();
  if (key === "ai") return C.yellow;
  if (key === "reliability" || key === "reliable" || key === "trust" || key === "human" || key === "help") {
    return C.green;
  }
  if (key === "nine" || key === "sweet" || key === "teas" || key === "tea") return C.redBright;
  if (key === "butter" || key === "ketchup") return C.yellow;
  return undefined;
};

export const McDonaldsCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage();
  const time = frame / fps;
  const cues = cuesData.cues;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.12);

  if (!active) return null;

  const max = stage.wide ? 64 : 42;
  const lines = splitLine(active.text, max);
  const local = (time - active.start) * fps;
  const enter = clamp(local / 5);
  const fontSize = stage.wide ? 26 : 28;

  return (
    <div
      style={{
        position: "absolute",
        left: stage.margin,
        right: stage.margin,
        bottom: stage.captionBottom,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 120,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 7}px)`,
      }}
    >
      <div
        style={{
          maxWidth: stage.wide ? 1180 : 920,
          padding: stage.wide ? "10px 18px 11px" : "12px 18px 13px",
          borderRadius: 5,
          background: "rgba(4,4,5,0.74)",
          border: `1px solid rgba(247,243,234,0.1)`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.34)",
          backdropFilter: "blur(8px)",
          fontFamily: FONT,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.36,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: "rgba(247,243,234,0.86)",
          textShadow: "0 2px 14px rgba(0,0,0,0.8)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>
            {line.split(" ").map((word, wordIndex) => {
              const color = highlight(word);
              return (
                <span
                  key={`${word}-${wordIndex}`}
                  style={color ? { color, fontWeight: 600 } : undefined}
                >
                  {word}
                  {wordIndex < line.split(" ").length - 1 ? " " : ""}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
