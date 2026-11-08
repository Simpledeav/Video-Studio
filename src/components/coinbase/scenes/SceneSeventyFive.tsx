import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/coinbase";
import {
  BackdropGrid,
  Counter,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  progress,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { PRCard } from "../instruments";

const AGENT_PATTERN = [true, true, false, true, true, true, false, true, true, true, false, true];

export const SceneSeventyFive: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();
  const camera = progress(frame, fps, 0, 12, (x) => x);

  const gridStart = 0.15;
  const cardW = wide ? 276 : 214;
  const cardH = wide ? 166 : 154;
  const gapX = wide ? 18 : 17;
  const gapY = wide ? 16 : 16;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="24%" y="36%" size={62} opacity={0.08} />
      <BackdropGrid opacity={0.24} size={wide ? 104 : 86} />
      <Vignette strength={0.86} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.012})`,
          transformOrigin: "50% 58%",
        }}
      >
        <div style={{ position: "absolute", left: margin, top: wide ? 120 : 110 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Kicker start={-0.5} color={C.dim}>
              {COPY.statKicker}
            </Kicker>
            <Tag style={{ padding: "4px 7px", fontSize: 8 }}>Reported</Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 232 : 222,
            display: "flex",
            alignItems: "flex-start",
            gap: wide ? 8 : 6,
          }}
        >
          <MaskLine
            start={-0.55}
            duration={0.8}
            style={{
              fontFamily: FONT,
              fontSize: wide ? 330 : 380,
              fontWeight: 700,
              letterSpacing: "-0.075em",
              lineHeight: 0.78,
              color: C.white,
            }}
          >
            <Counter
              value={75}
              start={0.1}
              duration={1.15}
              style={{
                color: C.white,
                fontSize: wide ? 330 : 380,
                fontWeight: 700,
                letterSpacing: "-0.075em",
                lineHeight: 0.78,
                display: "inline-block",
                width: wide ? 370 : 430,
              }}
            />
          </MaskLine>
          <MaskLine
            start={-0.35}
            duration={0.8}
            style={{
              fontFamily: FONT,
              fontSize: wide ? 148 : 168,
              fontWeight: 600,
              lineHeight: 1,
              color: C.lime,
              marginTop: wide ? 22 : 26,
              letterSpacing: "-0.04em",
            }}
          >
            %
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 622 : 700,
            width: wide ? 580 : 900,
          }}
        >
          {COPY.statSupport.map((line, i) => (
            <MaskLine
              key={line}
              start={1.1 + i * 0.12}
              duration={0.8}
              style={{
                fontFamily: FONT,
                fontSize: wide ? 26 : 30,
                fontWeight: 500,
                letterSpacing: "0.13em",
                lineHeight: 1.55,
                color: i === 0 ? C.white : C.dim,
              }}
            >
              {line}
            </MaskLine>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 760 : 872,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: progress(frame, fps, 1.8, 0.6) * 0.9,
          }}
        >
          <div style={{ width: 30, height: 1, background: C.lime, opacity: 0.75 }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: v(9, 8),
              letterSpacing: "0.14em",
              color: C.mute,
            }}
          >
            {COPY.statNote}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? 924 : margin,
            top: wide ? 176 : 970,
            display: "grid",
            gridTemplateColumns: `repeat(${wide ? 3 : 4}, ${cardW}px)`,
            gap: `${gapY}px ${gapX}px`,
            transform: `translateY(${progress(frame, fps, 6, 5) * (wide ? -8 : -14)}px)`,
          }}
        >
          {AGENT_PATTERN.map((agent, i) => (
            <PRCard
              key={i}
              index={i}
              agent={agent}
              start={gridStart}
              width={cardW}
              height={cardH}
            />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? 924 : margin,
            top: wide ? 928 : 1510,
            display: "flex",
            alignItems: "center",
            gap: 9,
            opacity: progress(frame, fps, 3.6, 0.7),
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontSize: v(11, 10),
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: C.lime,
            }}
          >
            9 AGENT PULL REQUESTS
          </span>
          <span style={{ color: C.mute, fontFamily: MONO, fontSize: 9 }}>·</span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: v(11, 10),
              fontWeight: 500,
              letterSpacing: "0.18em",
              color: C.mute,
            }}
          >
            3 HUMAN
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? undefined : margin,
          right: margin,
          top: wide ? 118 : undefined,
          bottom: wide ? undefined : 230,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: progress(frame, fps, 2.4, 0.7) * 0.7,
        }}
      >
        <span
          style={{
            fontFamily: MONO,
            fontSize: v(8, 8),
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
