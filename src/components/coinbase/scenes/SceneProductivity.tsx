import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/coinbase";
import {
  BackdropGrid,
  Counter,
  Dot,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  progress,
  Reveal,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { GrowthBars, WeekHours } from "../instruments";

export const SceneProductivity: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();

  return (
    <AbsoluteFill style={{ background: C.blackSoft, overflow: "hidden" }}>
      <Glow x="28%" y="26%" size={66} opacity={0.08} />
      <BackdropGrid opacity={0.25} size={wide ? 106 : 88} />
      <Vignette strength={0.86} />

      <div style={{ position: "absolute", left: margin, top: wide ? 100 : 104 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Kicker start={-0.5}>{COPY.productivityKicker}</Kicker>
          <Tag style={{ padding: "4px 7px", fontSize: 8 }}>Reported</Tag>
        </div>
      </div>

      {/* Top metric */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 166 : 184,
          width: wide ? 780 : 928,
        }}
      >
        <MaskLine
          start={-0.55}
          duration={0.8}
          style={{
            display: "flex",
            alignItems: "baseline",
            fontFamily: FONT,
            fontSize: wide ? 268 : 250,
            fontWeight: 700,
            letterSpacing: "-0.07em",
            lineHeight: 0.8,
            color: C.white,
          }}
        >
          <span style={{ color: C.lime }}>+</span>
          <Counter
            value={55}
            start={0.05}
            duration={1.2}
            style={{
              fontSize: wide ? 268 : 250,
              fontWeight: 700,
              letterSpacing: "-0.07em",
              lineHeight: 0.8,
              color: C.white,
            }}
          />
          <span
            style={{
              fontSize: wide ? 128 : 118,
              color: C.dim,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              marginLeft: 8,
            }}
          >
            %
          </span>
        </MaskLine>
        <Reveal
          start={1.4}
          duration={0.7}
          style={{ marginTop: wide ? 22 : 30, display: "flex", gap: 12 }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(15, 14),
              fontWeight: 500,
              letterSpacing: "0.13em",
              lineHeight: 1.5,
              color: C.white,
            }}
          >
            {COPY.productivityTopLabel[0]}
            <br />
            <span style={{ color: C.mute }}>{COPY.productivityTopLabel[1]}</span>
          </div>
        </Reveal>
        <GrowthBars
          start={0.5}
          width={wide ? 700 : 928}
          height={132}
          highlight={2}
          style={{ marginTop: wide ? 44 : 50, opacity: 0.9 }}
        />
      </div>

      {/* Divider */}
      <div
        style={{
          position: "absolute",
          left: wide ? 980 : margin,
          top: wide ? 150 : 744,
          width: wide ? 1 : 928,
          height: wide ? 700 : 1,
          background: C.line,
          opacity: 0.6 + progress(frame, fps, 3.8, 0.6) * 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: wide ? 980 : "50%",
          top: wide ? 470 : 726,
          transform: "translateX(-50%)",
          padding: "0 14px",
          background: C.blackSoft,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: C.mute,
          opacity: progress(frame, fps, 3.9, 0.5),
        }}
      >
        AND
      </div>

      {/* Ghost of the second beat keeps the frame balanced before it lands. */}
      <div
        style={{
          position: "absolute",
          left: wide ? 1050 : margin,
          top: wide ? 166 : 836,
          display: "flex",
          alignItems: "baseline",
          gap: wide ? 14 : 10,
          opacity: 0.045,
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: wide ? 250 : 300,
            fontWeight: 700,
            letterSpacing: "-0.07em",
            lineHeight: 0.78,
            color: C.white,
          }}
        >
          7
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: wide ? 80 : 84,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            color: C.white,
          }}
        >
          HOURS
        </span>
      </div>

      {/* Bottom metric */}
      <div
        style={{
          position: "absolute",
          left: wide ? 1050 : margin,
          top: wide ? 166 : 836,
          width: wide ? 780 : 928,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: wide ? 14 : 10,
            opacity: progress(frame, fps, 4.4, 0.6),
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: wide ? 250 : 300,
              fontWeight: 700,
              letterSpacing: "-0.07em",
              lineHeight: 0.78,
              color: C.lime,
            }}
          >
            7
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: wide ? 80 : 84,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: C.white,
            }}
          >
            HOURS
          </span>
        </div>
        <Reveal
          start={4.8}
          duration={0.7}
          style={{ marginTop: wide ? 22 : 26 }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(15, 14),
              fontWeight: 500,
              letterSpacing: "0.13em",
              lineHeight: 1.5,
              color: C.white,
            }}
          >
            {COPY.productivityBottomLabel[0]}
            <br />
            <span style={{ color: C.mute }}>{COPY.productivityBottomLabel[1]}</span>
          </div>
        </Reveal>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 1050 : 588,
          top: wide ? 566 : 890,
        }}
      >
        <WeekHours start={4.6} width={wide ? 440 : 388} height={wide ? 260 : 300} />
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: progress(frame, fps, 7.1, 0.5),
          }}
        >
          <Dot size={4} color={C.lime} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.12em",
              color: C.mute,
            }}
          >
            7 HOURS RETURNED EACH WEEK
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 648 : 1300,
          opacity: progress(frame, fps, 7.2, 0.7),
          maxWidth: wide ? 700 : 928,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 28, height: 1, background: C.lime, opacity: 0.75 }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.16em",
              color: C.mute,
            }}
          >
            THE COMPOUNDING EFFECT
          </span>
        </div>
        <div
          style={{
            marginTop: wide ? 14 : 18,
            fontFamily: FONT,
            fontSize: v(44, 34),
            fontWeight: 600,
            letterSpacing: "-0.035em",
            color: C.white,
            lineHeight: 1.05,
          }}
        >
          TEAMS OF <span style={{ color: C.lime }}>1–2</span> ENGINEERS
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT,
            fontSize: v(16, 13),
            fontWeight: 500,
            letterSpacing: "0.12em",
            color: C.dim,
          }}
        >
          {COPY.productivityNote.replace("TEAMS OF 1–2 ", "")}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: margin,
          top: wide ? 100 : undefined,
          bottom: wide ? undefined : 230,
          opacity: progress(frame, fps, 3.4, 0.7) * 0.6,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: 8,
            letterSpacing: "0.12em",
            color: C.mute,
          }}
        >
          {COPY.source}
        </span>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
