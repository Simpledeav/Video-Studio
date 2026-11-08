import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/juicero/voice.cues.json";
import { FONT, clamp } from "./kit";

type Cue = { start: number; end: number; text: string };

const cues = cuesData.cues as Cue[];

const splitLines = (text: string, maxCharacters: number): string[] => {
  if (text.length <= maxCharacters) return [text];
  const words = text.split(/\s+/);
  let best = 1;
  let bestDifference = Number.POSITIVE_INFINITY;
  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const difference = Math.abs(first.length - second.length);
    if (difference < bestDifference && first.length <= maxCharacters + 10) {
      bestDifference = difference;
      best = index;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

export const JuiceroCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height;
  const time = frame / fps;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.08);
  if (!active) return null;

  const lines = splitLines(active.text, wide ? 64 : 40);
  const enter = clamp((time - active.start) / 0.16);
  const exit = clamp((active.end - time) / 0.14);

  return (
    <AbsoluteFill style={{ zIndex: 150, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: wide ? 120 : 46,
          right: wide ? 120 : 46,
          bottom: wide ? 30 : 128,
          display: "flex",
          justifyContent: "center",
          opacity: Math.min(enter, exit),
          transform: `translateY(${(1 - enter) * 6}px)`,
        }}
      >
        <div
          style={{
            maxWidth: wide ? 1240 : 950,
            padding: wide ? "8px 18px 10px" : "9px 16px 11px",
            background:
              "linear-gradient(180deg, rgba(4,3,2,0.34), rgba(4,3,2,0.56))",
            borderRadius: 6,
            backdropFilter: "blur(5px)",
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: wide ? 31 : 29,
            lineHeight: 1.34,
            letterSpacing: "-0.012em",
            color: "rgba(247,243,234,0.94)",
            textAlign: "center",
            textShadow: "0 2px 16px rgba(0,0,0,0.9), 0 1px 2px rgba(0,0,0,0.9)",
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
