import { AbsoluteFill, spring } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/coinbase";
import {
  BackdropGrid,
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

const COLUMNS = new Array(20).fill(0);

export const SceneSpeed: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();
  const compress = progress(frame, fps, 4.42, 0.46, (x) => x);
  const beforeOut = progress(frame, fps, 4.4, 0.35, (x) => x);
  const afterIn = progress(frame, fps, 4.95, 0.55);
  const reveal = spring({
    frame: Math.max(0, frame - Math.round(4.95 * fps)),
    fps,
    config: { damping: 15, mass: 0.65, stiffness: 150 },
  });

  const stripWidth = wide ? 1668 : 928;
  const colWidth = wide ? 72 : 37;
  const gap = wide ? 12 : 8;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="70%" y="30%" size={70} opacity={0.09} />
      <BackdropGrid opacity={0.28} size={wide ? 108 : 88} />
      <Vignette strength={0.88} />

      <div style={{ position: "absolute", left: margin, top: wide ? 100 : 104 }}>
        <Kicker start={-0.5}>{COPY.speedKicker}</Kicker>
      </div>

      {/* Before beat */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 168 : 220,
          opacity: 1 - beforeOut,
          transform: `translateY(${-beforeOut * 26}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: v(12, 14) }}>
          <MaskLine
            start={-0.5}
            duration={0.85}
            style={{
              fontFamily: FONT,
              fontSize: wide ? 232 : 304,
              fontWeight: 700,
              letterSpacing: "-0.07em",
              lineHeight: 0.8,
              color: C.white,
            }}
          >
            20
          </MaskLine>
          <MaskLine
            start={-0.35}
            duration={0.85}
            style={{
              fontFamily: FONT,
              fontSize: wide ? 82 : 94,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: C.dim,
            }}
          >
            DAYS
          </MaskLine>
        </div>
        <Reveal start={1.0} duration={0.7} style={{ marginTop: wide ? 22 : 26 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(15, 14),
              fontWeight: 500,
              letterSpacing: "0.22em",
              color: C.dim,
            }}
          >
            {COPY.speedSupport}
          </div>
        </Reveal>
      </div>

      {/* After beat */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 160 : 210,
          opacity: afterIn,
          transform: `translateY(${(1 - afterIn) * 28}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: v(40, 30),
            transform: `translateY(${(1 - reveal) * 22}px) scale(${0.86 + reveal * 0.14})`,
            transformOrigin: "left bottom",
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 320 : 372,
              fontWeight: 700,
              letterSpacing: "-0.075em",
              lineHeight: 0.78,
              color: C.lime,
              whiteSpace: "nowrap",
            }}
          >
            {COPY.speedAfter}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 88 : 102,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: C.white,
            }}
          >
            {COPY.speedAfterWord}
          </div>
        </div>
        <Reveal start={5.2} duration={0.65} style={{ marginTop: wide ? 24 : 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span
              style={{
                fontFamily: FONT,
                fontSize: v(15, 14),
                fontWeight: 500,
                letterSpacing: "0.2em",
                color: C.dim,
              }}
            >
              IDEA TO PRODUCTION
            </span>
            <Dot size={4} color={C.mute} />
            <span
              style={{
                fontFamily: MONO,
                fontSize: v(11, 10),
                letterSpacing: "0.12em",
                color: C.mute,
              }}
            >
              1.8 DAYS FOR SOME TEAMS
            </span>
          </div>
        </Reveal>
      </div>

      {/* 20-day strip */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 674 : 780,
          width: stripWidth,
          height: wide ? 224 : 414,
          transform: `scaleX(${1 - compress * 0.94})`,
          transformOrigin: "left center",
          opacity: (1 - compress * 0.98) * (1 - progress(frame, fps, 5.6, 0.5) * 0.9),
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap, height: "100%" }}>
          {COLUMNS.map((_, i) => {
            const p = progress(frame, fps, 0.65 + i * 0.105, 0.45);
            const dim = i / 20;
            return (
              <div
                key={i}
                style={{
                  width: colWidth,
                  flexShrink: 0,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  gap: 8,
                  opacity: p,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: `${28 + dim * 54}%`,
                    background:
                      i === 19
                        ? `linear-gradient(180deg, ${C.lime} 0%, rgba(200,246,91,0.2) 100%)`
                        : `linear-gradient(180deg, rgba(244,241,232,${0.34 + dim * 0.2}) 0%, rgba(244,241,232,0.03) 100%)`,
                    borderTop: `2px solid ${i === 19 ? C.lime : "rgba(244,241,232,0.6)"}`,
                    transform: `scaleY(${p})`,
                    transformOrigin: "bottom",
                  }}
                />
                {wide ? null : (
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: i % 5 === 0 || i === 19 ? 8 : 0,
                      color: i === 19 ? C.lime : C.mute,
                      textAlign: "center",
                      height: 10,
                    }}
                  >
                    {i + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: wide ? 0 : 18,
            height: 1,
            background: C.line,
          }}
        />
      </div>

      {/* The 20-day strip collapses into one bright day-zero mark. */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 674 : 780,
          width: 3,
          height: wide ? 224 : 414,
          background: C.lime,
          opacity: compress * (1 - progress(frame, fps, 5.8, 0.5) * 0.85),
          boxShadow: `0 0 34px ${C.lime}88`,
          transform: `scaleY(${0.12 + compress * 0.88})`,
          transformOrigin: "bottom",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 560 : 1218,
          display: "flex",
          alignItems: "center",
          gap: 11,
          opacity: progress(frame, fps, 1.1, 0.6) * 0.85 * (1 - beforeOut),
        }}
      >
        <Dot size={5} color={C.amber} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: v(9, 8),
            letterSpacing: "0.13em",
            color: C.mute,
          }}
        >
          SOME TEAMS  ·  REPORTED  ·  A TYPICAL CYCLE SHOWN ABOVE
        </span>
      </div>

      {/* Reduction badge and closing lines */}
      <div
        style={{
          position: "absolute",
          left: wide ? undefined : margin,
          right: wide ? margin : undefined,
          top: wide ? 248 : 1240,
          display: "flex",
          flexDirection: "column",
          alignItems: wide ? "flex-end" : "flex-start",
          gap: 16,
          opacity: afterIn,
        }}
      >
        <Tag style={{ padding: "9px 13px", fontSize: 12 }}>{COPY.speedReduction}</Tag>
        <div style={{ display: "grid", gap: 4 }}>
          <MaskLine
            start={7.05}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(24, 20),
              fontWeight: 500,
              letterSpacing: "0.03em",
              color: C.dim,
              textAlign: wide ? "right" : "left",
            }}
          >
            {COPY.speedLineOne}
          </MaskLine>
          <MaskLine
            start={7.85}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(28, 23),
              fontWeight: 600,
              letterSpacing: "0.01em",
              color: C.white,
              textAlign: wide ? "right" : "left",
            }}
          >
            {COPY.speedLineTwo}
          </MaskLine>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? undefined : margin,
          right: wide ? margin : undefined,
          top: wide ? 100 : undefined,
          bottom: wide ? undefined : 235,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: progress(frame, fps, 8.9, 0.7) * 0.75,
        }}
      >
        <div style={{ width: 46, height: 1, background: C.lime, opacity: 0.7 }} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: v(9, 8),
            letterSpacing: "0.12em",
            color: C.mute,
          }}
        >
          20 DAYS → 1.8 DAYS  ·  A REPORTED 90% REDUCTION
        </span>
      </div>

      <Grain />
    </AbsoluteFill>
  );
};
