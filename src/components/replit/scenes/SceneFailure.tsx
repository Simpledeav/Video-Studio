import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/replit";
import {
  clamp,
  easeIn,
  GlitchText,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Scanlines,
  seeded,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import {
  DatabaseCylinder,
  DatabaseDashboard,
  DataRain,
  FailureTelemetry,
} from "../visuals";

export const SceneFailure: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const wipe = progress(frame, fps, 2.65, 3.4, easeIn);
  const impact = progress(frame, fps, 2.85, 0.35);
  const impactOut = 1 - progress(frame, fps, 2.9, 1.6);
  const shake = impactOut * impact;
  const shakeX = Math.sin(frame * 2.2) * 12 * shake;
  const shakeY = Math.cos(frame * 1.8) * 7 * shake;
  const sceneOut = 1 - progress(frame, fps, 8.9, 0.3, easeIn);
  const camera = progress(frame, fps, 0, 9.2, (x) => x);
  const flash = progress(frame, fps, 2.7, 0.08) * (1 - progress(frame, fps, 2.78, 0.4));

  const bars = new Array(7).fill(0).map((_, i) => {
    const y = seeded(i * 7.3) * 100;
    const w = 18 + seeded(i * 3.1) * 70;
    const x = seeded(i * 11.7) * 70;
    return { y, w, x, delay: seeded(i * 5.9) };
  });

  return (
    <AbsoluteFill style={{ background: "#070508", overflow: "hidden" }}>
      <Glow x="18%" y="18%" size={58} opacity={0.16} color={C.red} />
      <Glow x="80%" y="76%" size={54} opacity={0.11} color={C.orange} />
      <DataRain opacity={0.07} columns={5} color={C.red} start={1.0} speed={1.7} />
      <GridField opacity={0.22} size={84} color="rgba(255,53,72,0.055)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${1 + camera * 0.038})`,
          transformOrigin: "50% 50%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 100 }}>
          <Kicker start={0.1} color={C.red} rule={C.red}>
            {COPY.failureKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            right: margin,
            top: 96,
            display: "flex",
            alignItems: "center",
            gap: 8,
            opacity: progress(frame, fps, 0.6, 0.6),
          }}
        >
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8 }}>
            FREEZE: ACTIVE
          </Tag>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 178,
            width: 536,
            height: 300,
          }}
        >
          <FailureTelemetry start={0.4} width={536} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 668,
            top: 208,
            width: 270,
            height: 340,
          }}
        >
          <DatabaseCylinder
            size={270}
            start={0.3}
            health={Math.max(0, 1 - wipe)}
            drain={clamp(wipe * 1.25)}
            label="PRODUCTION"
            accent={C.red}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 540,
            width: 928,
          }}
        >
          <MaskLine
            start={2.95}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: v(92),
              fontWeight: 600,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: C.silver,
            }}
          >
            PRODUCTION
          </MaskLine>
          <div style={{ position: "relative", marginTop: 2 }}>
            <MaskLine
              start={3.05}
              duration={0.7}
              style={{
                fontFamily: FONT,
                fontSize: v(170),
                fontWeight: 800,
                letterSpacing: "-0.075em",
                lineHeight: 0.84,
                color: C.red,
                textShadow: `0 0 70px ${C.redGlow}, 0 10px 40px rgba(0,0,0,0.9)`,
              }}
            >
              <GlitchText
                start={3.05}
                color={C.red}
                glitch={1.25}
                style={{
                  fontFamily: FONT,
                  fontSize: v(170),
                  fontWeight: 800,
                  letterSpacing: "-0.075em",
                  lineHeight: 0.84,
                }}
              >
                DATA DELETED
              </GlitchText>
            </MaskLine>
            <div
              style={{
                height: 3,
                width: `${progress(frame, fps, 3.2, 0.8) * 100}%`,
                background: `linear-gradient(90deg, ${C.red}, ${C.orange})`,
                marginTop: 10,
                boxShadow: `0 0 22px ${C.redGlow}`,
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 900,
            display: "flex",
            alignItems: "stretch",
            border: `1px solid ${C.red}44`,
            background: "rgba(255,53,72,0.06)",
            opacity: progress(frame, fps, 3.4, 0.6),
          }}
        >
          {COPY.failureStatus.map((label, i) => (
            <div
              key={label}
              style={{
                flex: 1,
                padding: "12px 14px",
                borderRight: i < COPY.failureStatus.length - 1 ? `1px solid ${C.red}33` : "none",
              }}
            >
              <Mono size={8} color={C.mute}>
                {label.split(":")[0]}
              </Mono>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: i === 0 ? C.orange : C.red,
                }}
              >
                {label.split(":")[1]}
              </div>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0 14px",
              background: C.red,
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: C.black,
              }}
            >
              FAILURE
            </span>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 1008,
            width: 928,
            height: 532,
          }}
        >
          <DatabaseDashboard
            start={0.5}
            width={928}
            height={532}
            compact
            vanishAt={2.9}
            accent={C.red}
            title="PRODUCTION / CONTACTS"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1580,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: progress(frame, fps, 3.4, 0.7),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Tag color={C.red} background={C.redSoft} style={{ fontSize: 8 }}>
              PRODUCTION FAILURE
            </Tag>
            <Mono size={9} color={C.mute}>
              1,206 → 0
            </Mono>
          </div>
          <Mono size={8} color={C.mute}>
            STATUS: CRITICAL
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1666,
            opacity: progress(frame, fps, 4.0, 0.7) * 0.72,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.14em",
              lineHeight: 1.7,
              color: C.mute,
            }}
          >
            {COPY.reconstruction}
          </div>
        </div>
      </div>

      {/* Destructive impact language: scan wipe, flash, glitch bars */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: `${35 + wipe * 48}%`,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.red}, ${C.orange}, transparent)`,
          boxShadow: `0 0 30px ${C.red}`,
          opacity: wipe > 0 && wipe < 1 ? 0.85 : 0,
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.red,
          opacity: flash * 0.2,
          mixBlendMode: "screen",
          zIndex: 55,
        }}
      />
      {impact > 0.1
        ? bars.map((bar, i) => {
            const p = progress(frame, fps, 2.9 + bar.delay * 1.4, 0.3);
            if (p <= 0) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${bar.x}%`,
                  top: `${bar.y}%`,
                  width: `${bar.w}%`,
                  height: 2 + seeded(i * 2.2) * 4,
                  background: i % 2 === 0 ? C.red : C.orange,
                  opacity: p * (1 - progress(frame, fps, 3.4 + bar.delay, 0.5)) * 0.5,
                  mixBlendMode: "screen",
                  zIndex: 52,
                }}
              />
            );
          })
        : null}

      <Scanlines opacity={0.08} spacing={4} />
      <Vignette strength={1.18} />
      <Grain opacity={0.075} />
    </AbsoluteFill>
  );
};
