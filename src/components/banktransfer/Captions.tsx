import { useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/bank-transfer/voice.cues.json";
import { C, FONT, useStage } from "../../config/bankTransfer";
import { clamp } from "./kit";

const INTERESTING = new Set([
  "successful",
  "success",
  "timeout",
  "pending",
  "unresolved",
  "alert",
  "credit",
  "session",
  "receipt",
  "trace",
  "transaction",
  "nibss",
  "nip",
  "confirmed",
  "reversal",
  "cbn",
  "protection",
  "forty-eight",
  "48",
  "two-week",
  "consumer",
  "debit",
  "debited",
]);

const colorFor = (word: string): string | undefined => {
  const key = word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
  if (key === "timeout" || key === "unresolved") return C.red;
  if (key === "pending" || key === "alert") return C.amber;
  if (key === "successful" || key === "confirmed" || key === "credit") return C.green;
  if (key === "nibss" || key === "nip" || key === "trace" || key === "transaction" || key === "session") return C.cyan;
  if (INTERESTING.has(key)) return C.white;
  return undefined;
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
    if (diff < bestDiff && a.length <= max + 6) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

export const BankTransferCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const stage = useStage();
  const time = frame / fps;
  const cues = cuesData.cues;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.18);

  if (!active) return null;

  const max = stage.wide ? 58 : 42;
  const lines = splitLine(active.text, max);
  const local = (time - active.start) * fps;
  const enter = clamp(local / 5);
  const fontSize = stage.wide ? 31 : 37;

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
        zIndex: 60,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 8}px)`,
      }}
    >
      <div
        style={{
          maxWidth: stage.wide ? 1280 : 940,
          padding: stage.wide ? "13px 22px 14px" : "15px 24px 16px",
          borderRadius: 10,
          background: "rgba(4, 9, 15, 0.68)",
          border: `1px solid ${C.lineSoft}`,
          boxShadow: "0 16px 42px rgba(0,0,0,0.28)",
          backdropFilter: "blur(6px)",
          fontFamily: FONT,
          fontSize,
          fontWeight: 500,
          lineHeight: 1.34,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: C.white,
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
