import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import cuesData from "../../../public/audio/episodes/coinbase/voice.cues.json";
import { FONT, useStage } from "../../config/coinbase";
import { clamp } from "./kit";

type Cue = {
  start: number;
  end: number;
  text: string;
  lines: string[];
};

const CUES = cuesData.cues as Cue[];

export const CoinbaseCaptions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, captionBottom } = useStage();
  const t = frame / fps;

  const cue = CUES.find((item) => t >= item.start - 0.04 && t <= item.end + 0.1);
  if (!cue) return null;

  const inP = clamp((t - cue.start) / 0.16);
  const outP = clamp((cue.end + 0.1 - t) / 0.18);
  const opacity = Math.min(inP, outP);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 900 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: wide ? 250 : 360,
          background:
            "linear-gradient(180deg, rgba(7,8,9,0) 0%, rgba(7,8,9,0.42) 46%, rgba(7,8,9,0.82) 100%)",
          opacity: opacity * 0.9,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: captionBottom,
          display: "flex",
          justifyContent: "center",
          padding: "0 42px",
          opacity,
          transform: `translateY(${(1 - inP) * 8}px)`,
        }}
      >
        <div
          style={{
            maxWidth: wide ? 1040 : 900,
            textAlign: "center",
          }}
        >
          {cue.lines.map((line, i) => (
            <div
              key={`${line}-${i}`}
              style={{
                fontFamily: FONT,
                fontSize: wide ? 26 : 33,
                lineHeight: 1.4,
                fontWeight: 500,
                letterSpacing: "0.005em",
                color: "rgba(255,255,255,0.96)",
                textShadow: "0 2px 18px rgba(0,0,0,0.85), 0 1px 2px rgba(0,0,0,0.9)",
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
