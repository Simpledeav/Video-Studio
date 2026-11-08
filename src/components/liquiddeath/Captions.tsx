import { useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/liquid-death/voice.cues.json";
import { C, FONT, useStage } from "../../config/liquidDeath";
import { clamp } from "./kit";

const HOT = new Set([
  "water",
  "beer",
  "liquid",
  "death",
  "brand",
  "branding",
  "identity",
  "manufacturing",
  "distribution",
  "margins",
  "profit",
  "austria",
  "america",
  "covid",
  "cans",
  "can",
  "thirst",
]);

const MONEY = new Set(["$4,000", "$13,000", "four", "thirteen", "thousand"]);

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

const colorFor = (word: string): string | undefined => {
  const key = word.replace(/[^a-zA-Z0-9$,-]/g, "").toLowerCase();
  if (MONEY.has(key)) return C.redBright;
  if (HOT.has(key)) return C.white;
  if (key === "brand" || key === "identity") return C.redBright;
  return undefined;
};

export const LiquidDeathCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage();
  const time = frame / fps;
  const cues = cuesData.cues;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.12);

  if (!active) return null;

  const max = stage.wide ? 62 : 40;
  const lines = splitLine(active.text, max);
  const local = (time - active.start) * fps;
  const enter = clamp(local / 5);
  const fontSize = stage.wide ? 28 : 33;

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
          maxWidth: stage.wide ? 1240 : 930,
          padding: stage.wide ? "11px 20px 12px" : "14px 22px 15px",
          borderRadius: 6,
          background: "rgba(4, 4, 5, 0.72)",
          border: `1px solid ${C.lineSoft}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.34)",
          backdropFilter: "blur(7px)",
          fontFamily: FONT,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.34,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: "rgba(244,244,241,0.82)",
          textShadow: "0 2px 14px rgba(0,0,0,0.8)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>
            {line.split(" ").map((word, wordIndex) => {
              const color = colorFor(word);
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
