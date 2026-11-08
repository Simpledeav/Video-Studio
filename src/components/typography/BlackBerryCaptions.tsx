import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { PALETTE } from "../../config/blackberry";
import cuesData from "../../../public/audio/episodes/blackberry/voice.cues.json";

type Cue = {
  start: number;
  end: number;
  text: string;
};

const KEYWORDS_ORANGE = new Set([
  "underestimated",
  "disappeared",
  "weakness",
  "leaves",
  "consequences",
  "stopped",
  "lose",
]);

const KEYWORDS_COBALT = new Set([
  "blackberry",
  "smartphone",
  "smartphones",
  "iphone",
  "android",
  "ecosystem",
  "software",
  "cybersecurity",
  "adapting",
  "success",
  "2009",
  "2016",
  "20",
  "percent",
  "advantage",
]);

export const BlackBerryCaptions: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;

  const cues: Cue[] = cuesData.cues;
  const currentCue = cues.find((c) => time >= c.start && time <= c.end);

  if (!currentCue) return null;

  // Render tokens with selective editorial emphasis
  const words = currentCue.text.split(" ");

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: isWide ? 48 : 88,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 900,
        pointerEvents: "none",
        padding: "0 36px",
      }}
    >
      <div
        style={{
          background: "rgba(246, 245, 240, 0.94)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: `1px solid ${PALETTE.border}`,
          borderRadius: 8,
          padding: isWide ? "10px 24px" : "12px 20px",
          maxWidth: isWide ? 880 : 760,
          boxShadow: "0 8px 24px rgba(23, 23, 23, 0.06)",
          textAlign: "center",
        }}
      >
        <span
          style={{
            fontFamily: '"Poppins", sans-serif',
            fontWeight: 500,
            fontSize: isWide ? 22 : 24,
            lineHeight: 1.45,
            color: PALETTE.inkBlack,
            letterSpacing: "-0.01em",
            display: "inline-block",
          }}
        >
          {words.map((word, i) => {
            const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
            const isCobalt = KEYWORDS_COBALT.has(clean);
            const isOrange = KEYWORDS_ORANGE.has(clean);

            let color: string = PALETTE.inkBlack;
            let fontWeight: 500 | 600 = 500;

            if (isCobalt) {
              color = PALETTE.electricCobalt;
              fontWeight = 600;
            } else if (isOrange) {
              color = PALETTE.signalOrange;
              fontWeight = 600;
            }

            return (
              <React.Fragment key={i}>
                <span style={{ color, fontWeight }}>{word}</span>
                {i < words.length - 1 ? " " : ""}
              </React.Fragment>
            );
          })}
        </span>
      </div>
    </div>
  );
};
