import { useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/walmart-chicken/voice.cues.json";
import { C, FONT, STAGE, useStage } from "../../config/walmartChicken";
import { clamp } from "../presets/editorialPop/kit";

const HIGHLIGHT = new Set([
  "15,000",
  "5,000",
  "90",
  "5.97",
  "five",
  "ninety-seven",
  "ninety",
  "purse",
  "purses",
  "chicken",
  "sold",
  "out",
  "walmart",
  "joke",
  "straps",
  "strap",
]);

const splitLine = (text: string, max: number): string[] => {
  if (text.length <= max) return [text];
  const words = text.split(/\s+/);
  let best = 1;
  let bestDiff = Number.POSITIVE_INFINITY;
  for (let i = 1; i < words.length; i += 1) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff && a.length <= max + 6) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

const clean = (word: string) =>
  word.replace(/^[^a-zA-Z0-9$]+/, "").replace(/[^a-zA-Z0-9]+$/, "").toLowerCase();

export const WalmartChickenCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage();
  const time = frame / fps;
  const active = cuesData.cues.find((cue) => time >= cue.start - 0.04 && time < cue.end + 0.12);

  if (!active) return null;

  const lines = splitLine(active.text, 42);
  const local = (time - active.start) * fps;
  const enter = clamp(local / 5);
  const fontSize = stage.wide ? 27 : 30;

  return (
    <div
      style={{
        position: "absolute",
        left: STAGE.margin,
        right: STAGE.margin,
        bottom: STAGE.captionBottom,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 120,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 8}px)`,
      }}
    >
      <div
        style={{
          maxWidth: 930,
          padding: "14px 22px 15px",
          borderRadius: 10,
          background: "rgba(4, 22, 48, 0.82)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow: "0 18px 46px rgba(0,0,0,0.38)",
          backdropFilter: "blur(8px)",
          fontFamily: FONT,
          fontSize,
          fontWeight: 600,
          lineHeight: 1.3,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: "rgba(255,255,255,0.94)",
          textShadow: "0 2px 14px rgba(0,0,0,0.55)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>
            {line.split(" ").map((word, wordIndex) => {
              const key = clean(word);
              const highlight = HIGHLIGHT.has(key) || /^\$?\d/.test(key);
              return (
                <span
                  key={`${word}-${wordIndex}`}
                  style={highlight ? { color: C.yellow, fontWeight: 700 } : undefined}
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
