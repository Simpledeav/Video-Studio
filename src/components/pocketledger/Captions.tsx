import { useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/pocketledger/voice.cues.json";
import { C, FONT, useStage } from "../../config/pocketLedger";
import { clamp } from "./kit";

const GREEN = new Set([
  "sale",
  "sales",
  "profit",
  "record",
  "records",
  "record-keeping",
  "summary",
  "separate",
  "separated",
  "business",
  "simple",
  "useful",
  "value",
  "pocketledger",
]);

const AMBER = new Set([
  "expense",
  "expenses",
  "personal",
  "withdrawal",
  "suppliers",
  "transport",
  "cash",
  "money",
  "naira",
]);

const pretty = (word: string): string => {
  const clean = word.replace(/[.,!?;:]/g, "").toLowerCase();
  if (clean === "sixty-four") return "64%";
  if (clean === "thirty-two") return "32%";
  if (clean === "pocketledger") return "PocketLedger";
  return word;
};

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

export const PocketLedgerCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage();
  const time = frame / fps;
  const cues = cuesData.cues;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.12);

  if (!active) return null;

  const max = stage.wide ? 64 : 40;
  const lines = splitLine(active.text, max);
  const local = (time - active.start) * fps;
  const enter = clamp(local / 5);
  const fontSize = stage.wide ? 27 : 32;

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
          maxWidth: stage.wide ? 1260 : 930,
          padding: stage.wide ? "10px 20px 11px" : "13px 21px 14px",
          borderRadius: 7,
          background: "rgba(10, 11, 8, 0.78)",
          border: `1px solid ${C.lineSoft}`,
          boxShadow: "0 14px 40px rgba(0,0,0,0.34)",
          backdropFilter: "blur(7px)",
          fontFamily: FONT,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.34,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: "rgba(246,242,232,0.84)",
          textShadow: "0 2px 14px rgba(0,0,0,0.8)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>
            {line.split(" ").map((word, wordIndex) => {
              const clean = word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
              const color = GREEN.has(clean) ? C.greenBright : AMBER.has(clean) ? C.amber : undefined;
              const shown = pretty(word);
              return (
                <span key={`${word}-${wordIndex}`} style={color ? { color, fontWeight: 600 } : undefined}>
                  {shown}
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
