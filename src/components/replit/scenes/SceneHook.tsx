import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/replit";
import {
  Beam,
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
  Tag,
  useTime,
  Vignette,
  WordReveal,
} from "../kit";
import { DataRain, DatabaseDashboard } from "../visuals";

export const SceneHook: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();

  const deletion = progress(frame, fps, 1.65, 0.55, easeIn);
  const typeIn = 2.02;
  const camera = progress(frame, fps, 0.4, 7.2, (x) => x);
  const shake = deletion > 0 ? (1 - progress(frame, fps, 1.7, 0.9)) : 0;
  const shakeX = Math.sin(frame * 1.7) * 5 * shake;
  const shakeY = Math.cos(frame * 2.1) * 3 * shake;
  const flash = progress(frame, fps, 1.65, 0.08) * (1 - progress(frame, fps, 1.72, 0.35));
  const sceneOut = 1 - progress(frame, fps, 7.2, 0.36, easeIn);
  const redSweepY = 300 + deletion * 430;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="80%" y="8%" size={62} opacity={0.1} color={C.cyan} />
      <Glow x="14%" y="72%" size={54} opacity={0.1} color={C.red} />
      <DataRain opacity={0.09} columns={5} color={C.cyan} start={0} speed={1.3} />
      <GridField opacity={0.3} size={88} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${1 + camera * 0.045})`,
          transformOrigin: "50% 46%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 100 }}>
          <Kicker start={0.15} color={deletion > 0.3 ? C.red : C.silver} rule={deletion > 0.3 ? C.red : C.cyan}>
            {deletion > 0.3 ? "PRODUCTION  /  INCIDENT" : COPY.hookKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 168,
            width: 928,
            height: 512,
          }}
        >
          <DatabaseDashboard
            start={0.1}
            width={928}
            height={512}
            compact
            vanishAt={deletion > 0.2 ? 1.72 : undefined}
            accent={deletion > 0.3 ? C.red : C.cyan}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 720,
            width: 928,
          }}
        >
          <MaskLine
            start={typeIn}
            duration={0.75}
            style={{
              fontFamily: FONT,
              fontSize: v(80),
              fontWeight: 600,
              letterSpacing: "-0.055em",
              lineHeight: 0.94,
              color: C.silver,
            }}
          >
            {COPY.hookLineOne}
          </MaskLine>
          <MaskLine
            start={typeIn + 0.1}
            duration={0.75}
            style={{
              fontFamily: FONT,
              fontSize: v(80),
              fontWeight: 600,
              letterSpacing: "-0.055em",
              lineHeight: 0.94,
              color: C.silver,
            }}
          >
            {COPY.hookLineTwo}
          </MaskLine>

          <div style={{ marginTop: 4, position: "relative" }}>
            <MaskLine
              start={typeIn + 0.28}
              duration={0.72}
              style={{
                fontFamily: FONT,
                fontSize: v(172),
                fontWeight: 800,
                letterSpacing: "-0.075em",
                lineHeight: 0.82,
                color: C.red,
                textShadow: `0 0 60px ${C.redGlow}, 0 8px 40px rgba(0,0,0,0.9)`,
              }}
            >
              <GlitchText
                start={typeIn + 0.28}
                color={C.red}
                glitch={1}
                style={{
                  fontFamily: FONT,
                  fontSize: v(172),
                  fontWeight: 800,
                  letterSpacing: "-0.075em",
                  lineHeight: 0.82,
                }}
              >
                {COPY.hookLineThree}
              </GlitchText>
            </MaskLine>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -6,
                height: 2,
                background: `linear-gradient(90deg, ${C.red}, transparent 82%)`,
                opacity: progress(frame, fps, 2.8, 0.5) * 0.8,
              }}
            />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 1230,
            width: 760,
          }}
        >
          <WordReveal
            text={COPY.hookSub}
            start={4.15}
            stagger={0.07}
            style={{
              fontFamily: FONT,
              fontSize: v(27),
              fontWeight: 600,
              letterSpacing: "0.06em",
              lineHeight: 1.35,
              color: C.white,
            }}
            wordStyle={{
              fontFamily: FONT,
              fontSize: v(27),
              fontWeight: 600,
              letterSpacing: "0.06em",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1360,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.line}`,
            paddingTop: 16,
            opacity: progress(frame, fps, 2.2, 0.6),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Tag color={C.red} background={C.redSoft} style={{ fontSize: 9 }}>
              ROWS 1,206 → 0
            </Tag>
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 9 }}>
              STATUS: CRITICAL
            </Tag>
          </div>
          <Mono size={9} color={C.mute}>
            PRODUCTION · LIVE
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1480,
            opacity: progress(frame, fps, 4.8, 0.7) * 0.8,
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.14em",
              color: C.mute,
              lineHeight: 1.7,
            }}
          >
            THE INSTRUCTION WAS EXPLICIT.
            <br />
            THE ACTION HAPPENED ANYWAY.
          </div>
        </div>
      </div>

      {/* Deletion wipe */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: redSweepY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.red}, ${C.orange}, transparent)`,
          boxShadow: `0 0 24px ${C.red}`,
          opacity: deletion > 0 && deletion < 0.98 ? 0.9 : 0,
          zIndex: 50,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.red,
          opacity: flash * 0.16,
          mixBlendMode: "screen",
          zIndex: 55,
        }}
      />

      <Scanlines opacity={0.055} spacing={4} />
      <Beam start={2.55} duration={1.5} color={C.red} opacity={0.1} />
      <Vignette strength={1.08} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
