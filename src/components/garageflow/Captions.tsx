import { useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/garageflow/voice.cues.json";
import { C, FONT, GF, useStage } from "../../config/garageflow";
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
    if (diff < bestDiff && a.length <= max + 7) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

const highlight = (word: string): string | undefined => {
  const key = word.replace(/[^a-zA-Z0-9']/g, "").toLowerCase();
  if (["garage", "system", "software", "dashboard", "workflow", "garageflow"].includes(key)) return C.blueBright;
  if (["approve", "approved", "ready", "simple", "simpledeav", "transparency"].includes(key)) return C.green;
  if (["frustrating", "chasing", "calls", "notebook", "spreadsheet", "problem", "wrong"].includes(key)) {
    return C.amber;
  }
  if (["five", "one", "two"].includes(key)) return C.blueBright;
  return undefined;
};

export const GarageFlowCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage();
  const time = frame / fps;
  const cues = cuesData.cues;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.14);

  if (!active || time >= GF.signOffStartFrame / GF.fps - 0.15) return null;

  const max = stage.wide ? 62 : 42;
  const lines = splitLine(active.text, max);
  const local = (time - active.start) * fps;
  const enter = clamp(local / 5);
  const fontSize = stage.wide ? 29 : 33;

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
          maxWidth: stage.wide ? 1210 : 930,
          padding: stage.wide ? "11px 20px 12px" : "13px 21px 14px",
          borderRadius: 6,
          background: "rgba(4, 8, 14, 0.74)",
          border: `1px solid rgba(245,248,252,0.11)`,
          boxShadow: "0 16px 44px rgba(0,0,0,0.36)",
          backdropFilter: "blur(8px)",
          fontFamily: FONT,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.34,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: "rgba(245,248,252,0.88)",
          textShadow: "0 2px 14px rgba(0,0,0,0.8)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>
            {line.split(" ").map((word, wordIndex) => {
              const color = highlight(word);
              return (
                <span key={`${word}-${wordIndex}`} style={color ? { color, fontWeight: 600 } : undefined}>
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
