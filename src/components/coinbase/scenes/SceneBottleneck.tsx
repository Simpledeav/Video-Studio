import { AbsoluteFill, interpolate } from "remotion";
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

const STEPS = [
  { label: "IDEA", detail: "Brief, scope, alignment", days: 1 },
  { label: "PLANNING", detail: "Tickets, priorities, estimates", days: 3 },
  { label: "CODING", detail: "Implementation and local tests", days: 5 },
  { label: "TESTING", detail: "QA, integration, edge cases", days: 4 },
  { label: "REVIEW", detail: "Human review and revisions", days: 5 },
  { label: "PRODUCTION", detail: "Deploy, monitor, follow-up", days: 2 },
] as const;

export const SceneBottleneck: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();
  const t = frame / fps;

  const dayValue = interpolate(
    t,
    [0.7, 5.5, 8.0, 8.85, 13.0],
    [0, 14, 15, 20, 20],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const reviewStall = t > 5.4 && t < 8.3;
  const headlineOut = progress(frame, fps, 9.15, 0.45, (x) => x);
  const statementIn = progress(frame, fps, 9.35, 0.7);
  const timelineDim = 1 - progress(frame, fps, 9.1, 0.7) * 0.68;

  const rowTop = wide ? 300 : 748;
  const rowGap = wide ? 100 : 148;

  return (
    <AbsoluteFill style={{ background: C.blackSoft, overflow: "hidden" }}>
      <Glow x="20%" y="18%" size={70} color={C.amber} opacity={0.05} />
      <BackdropGrid opacity={0.3} size={wide ? 104 : 88} />
      <Vignette strength={0.85} />

      <div style={{ position: "absolute", left: margin, top: wide ? 112 : 108 }}>
        <Kicker start={-0.5} color={C.dim}>
          {COPY.oldKicker}
        </Kicker>
      </div>

      {/* Headline beat 1 */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 190 : 176,
          opacity: 1,
          transform: `translateY(${-headlineOut * 24}px)`,
        }}
      >
        <div style={{ opacity: 1 - headlineOut }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: v(14, 12),
              fontFamily: FONT,
              color: C.white,
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            <MaskLine
              start={-0.4}
              duration={0.85}
              style={{ fontSize: v(172, 132), fontWeight: 700 }}
            >
              20
            </MaskLine>
            <MaskLine
              start={-0.3}
              duration={0.85}
              style={{ fontSize: v(104, 80), fontWeight: 600, color: C.dim }}
            >
              DAYS
            </MaskLine>
          </div>
          <MaskLine
            start={0.0}
            duration={0.85}
            style={{
              fontSize: v(94, 72),
              fontWeight: 600,
              fontFamily: FONT,
              color: C.white,
              letterSpacing: "-0.045em",
              lineHeight: 1,
            }}
          >
            {COPY.oldHeadline[1]}
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            opacity: statementIn,
            transform: `translateY(${(1 - statementIn) * 24}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(66, 56),
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: C.white,
              whiteSpace: "nowrap",
            }}
          >
            THE PROCESS
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(54, 46),
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.05,
              color: C.lime,
              whiteSpace: "nowrap",
            }}
          >
            WAS THE BOTTLENECK.
          </div>
        </div>
      </div>

      {/* Day counter */}
      <div
        style={{
          position: "absolute",
          right: margin,
          top: wide ? 116 : 108,
          textAlign: "right",
          opacity: progress(frame, fps, 0.6, 0.6),
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: v(10, 9),
            letterSpacing: "0.2em",
            color: C.mute,
          }}
        >
          CYCLE CLOCK
        </div>
        <div
          style={{
            marginTop: 6,
            fontFamily: FONT,
            fontSize: v(34, 30),
            fontWeight: 600,
            color: reviewStall ? C.amber : C.white,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {String(Math.round(dayValue)).padStart(2, "0")}
          <span
            style={{
              marginLeft: 7,
              fontFamily: MONO,
              fontSize: v(9, 8),
              letterSpacing: "0.15em",
              color: C.mute,
            }}
          >
            DAYS
          </span>
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          position: "absolute",
          left: wide ? 830 : margin,
          top: rowTop,
          width: wide ? 978 : 928,
          opacity: timelineDim,
          transform: `translateY(${progress(frame, fps, 9.1, 0.7) * 26}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 6,
            bottom: 8,
            width: 1,
            background: C.lineSoft,
          }}
        />
        {STEPS.map((step, i) => {
          const start = 0.6 + i * 0.42;
          const p = progress(frame, fps, start, 0.5);
          const cumulativeBefore = STEPS.slice(0, i).reduce((a, b) => a + b.days, 0);
          const fill = Math.min(1, Math.max(0, (dayValue - cumulativeBefore) / step.days));
          const isReview = step.label === "REVIEW";
          const stalled = isReview && reviewStall;
          return (
            <div
              key={step.label}
              style={{
                height: rowGap,
                paddingLeft: 24,
                opacity: p,
                transform: `translateX(${(1 - p) * 18}px)`,
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -3,
                  top: 7,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: fill > 0.9 ? (isReview ? C.amber : C.white) : C.blackSoft,
                  border: `1px solid ${isReview ? C.amber : C.line}`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 9,
                      color: C.mute,
                      letterSpacing: "0.12em",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: v(26, 23),
                      fontWeight: 600,
                      letterSpacing: "0.01em",
                      color: C.white,
                    }}
                  >
                    {step.label}
                  </span>
                </div>
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: stalled ? C.amber : C.mute,
                  }}
                >
                  {stalled ? "WAITING" : `${step.days}D`}
                </span>
              </div>
              <div
                style={{
                  marginTop: 9,
                  marginLeft: 24,
                  height: 2,
                  background: C.lineSoft,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${fill * 100}%`,
                    background: isReview ? C.amber : "rgba(244,241,232,0.66)",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 8,
                  marginLeft: 24,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: FONT,
                    fontSize: v(13, 12),
                    fontWeight: 400,
                    letterSpacing: "0.01em",
                    color: C.mute,
                  }}
                >
                  {step.detail}
                </span>
                {isReview && stalled ? (
                  <Tag color={C.amber} background="rgba(224,162,92,0.08)" style={{ padding: "4px 7px", fontSize: 8 }}>
                    <Dot size={4} color={C.amber} /> QUEUE
                  </Tag>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 560 : undefined,
          bottom: wide ? undefined : 1260,
          display: "flex",
          alignItems: "center",
          gap: 11,
          opacity: progress(frame, fps, 1.1, 0.7) * 0.8,
        }}
      >
        <div style={{ width: 28, height: 1, background: C.mute, opacity: 0.7 }} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: v(9, 8),
            letterSpacing: "0.13em",
            color: C.mute,
          }}
        >
          {COPY.oldNote}
        </span>
      </div>

      <Reveal
        start={9.5}
        duration={0.8}
        style={{
          position: "absolute",
          right: margin,
          bottom: wide ? 44 : 208,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Dot size={6} color={C.amber} />
        <span
          style={{
            fontFamily: FONT,
            fontSize: v(11, 10),
            letterSpacing: "0.16em",
            color: C.amber,
          }}
        >
          EFFORT WAS NEVER THE PROBLEM
        </span>
      </Reveal>

      <Grain />
    </AbsoluteFill>
  );
};
