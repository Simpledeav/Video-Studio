import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT, MONO } from "../../../config/football";
import {
  Beam,
  Camera,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Scanlines,
  useTime,
  Vignette,
} from "../kit";

export const ScenePunchline: React.FC = () => {
  const { t } = useTime();
  const flash = progress(t, 1.55, 0.1) * (1 - progress(t, 1.66, 0.35));
  const hold = progress(t, 3.8, 0.7);
  const emoji = progress(t, 3.2, 0.45);

  return (
    <AbsoluteFill style={{ background: "#050608", overflow: "hidden" }}>
      <Glow x="50%" y="48%" size={38} color={FC.cyan} opacity={0.07} />

      <Camera from={1.02} to={1.0} duration={6.6} origin="50% 50%">
        <div style={{ position: "absolute", left: 76, top: 96 }}>
          <Kicker start={0.2} color={FC.gold} rule={FC.gold}>
            {COPY.punchlineKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            right: 76,
            top: 96,
            textAlign: "right",
            opacity: progress(t, 0.8, 0.6),
          }}
        >
          <Mono size={9} color={FC.mute}>
            84:00 · ANALYSIS COMPLETE
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 300,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: progress(t, 0.6, 0.8),
          }}
        >
          <div style={{ width: 44, height: 1, background: FC.cyan }} />
          <Mono size={10} color={FC.silver}>
            AND SOMEHOW...
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 700,
          }}
        >
          <MaskLine
            start={1.7}
            duration={0.55}
            style={{
              fontFamily: FONT,
              fontSize: 52,
              fontWeight: 500,
              letterSpacing: "0.02em",
              lineHeight: 1.1,
              color: FC.silver,
            }}
          >
            …IT IS NOT
          </MaskLine>
          <MaskLine
            start={1.86}
            duration={0.62}
            style={{
              fontFamily: FONT,
              fontSize: 91,
              fontWeight: 800,
              letterSpacing: "-0.065em",
              lineHeight: 0.9,
              color: FC.white,
            }}
          >
            A FOOTBALL
          </MaskLine>
          <MaskLine
            start={2.02}
            duration={0.66}
            style={{
              fontFamily: FONT,
              fontSize: 91,
              fontWeight: 800,
              letterSpacing: "-0.065em",
              lineHeight: 0.9,
              color: FC.cyan,
              textShadow: `0 0 70px ${FC.cyan}33`,
            }}
          >
            CONVERSATION.
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1040,
            display: "flex",
            alignItems: "center",
            gap: 16,
            opacity: emoji,
            transform: `translateY(${(1 - emoji) * 16}px)`,
          }}
        >
          <div
            style={{
              fontSize: 58,
              lineHeight: 1,
              filter: "drop-shadow(0 8px 22px rgba(0,0,0,0.6))",
            }}
          >
            😂
          </div>
          <div>
            <Mono size={8} color={FC.mute}>
              FINAL WHISTLE
            </Mono>
            <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 600, letterSpacing: "0.02em", color: FC.white, marginTop: 4 }}>
              {COPY.punchlineTag}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1240,
            height: 1,
            background: `linear-gradient(90deg, ${FC.cyan}, ${FC.line} 42%, transparent 100%)`,
            opacity: progress(t, 3.0, 0.8),
          }}
        />

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1300,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            opacity: hold,
            transform: `translateY(${(1 - hold) * 18}px)`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 500, lineHeight: 1.3, color: FC.silver, maxWidth: 660 }}>
            IT WAS A SITUATIONSHIP
            <br />
            <span style={{ color: FC.white }}>WEARING A NUMBER 7 SHIRT.</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <Mono size={8} color={FC.mute}>
              END OF ANALYSIS
            </Mono>
            <div style={{ fontFamily: MONO, fontSize: 10, color: FC.cyan, marginTop: 6, letterSpacing: "0.16em" }}>
              FULL-TIME
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 92,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 14,
            opacity: progress(t, 3.4, 0.7),
          }}
        >
          <Mono size={8} color={FC.mute}>
            NO LEAGUE TABLE WAS HARMED.
          </Mono>
          <Mono size={8} color={FC.cyan}>
            CASE CLOSED.
          </Mono>
        </div>
      </Camera>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: FC.white,
          opacity: flash * 0.12,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <Beam start={1.6} duration={1.5} color={FC.cyan} opacity={0.12} />
      <Scanlines opacity={0.022} />
      <Vignette strength={1.12} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
