import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, useStage } from "../../../config/replit";
import {
  Beam,
  Divider,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { AppShell, CodeEditorPanel, DatabaseCylinder, DataRain } from "../visuals";

export const SceneExperiment: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 9.4, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 9.4, 0.4);

  return (
    <AbsoluteFill style={{ background: C.graphite, overflow: "hidden" }}>
      <Glow x="88%" y="16%" size={60} opacity={0.1} color={C.blue} />
      <Glow x="12%" y="78%" size={54} opacity={0.08} color={C.cyan} />
      <DataRain opacity={0.045} columns={4} color={C.cyan} start={1} speed={0.7} />
      <GridField opacity={0.26} size={86} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-camera * 12}px) scale(${1 + camera * 0.025})`,
          transformOrigin: "52% 48%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 100 }}>
          <Kicker start={0.2} color={C.silver} rule={C.cyan}>
            {COPY.experimentKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            right: margin,
            top: 44,
            fontFamily: FONT,
            fontSize: v(168),
            fontWeight: 800,
            letterSpacing: "-0.08em",
            lineHeight: 0.8,
            color: "rgba(245,247,250,0.035)",
            pointerEvents: "none",
          }}
        >
          2025
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 176,
            width: 820,
          }}
        >
          <MaskLine
            start={0.35}
            duration={0.8}
            style={{
              fontFamily: FONT,
              fontSize: v(64),
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              color: C.silver,
            }}
          >
            {COPY.experimentTitle[0]}
          </MaskLine>
          <MaskLine
            start={0.48}
            duration={0.8}
            style={{
              fontFamily: FONT,
              fontSize: v(72),
              fontWeight: 700,
              letterSpacing: "-0.055em",
              lineHeight: 1,
              color: C.white,
            }}
          >
            REAL <span style={{ color: C.cyan }}>DATA.</span>
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 342,
            width: 928,
            height: 382,
          }}
        >
          <CodeEditorPanel
            start={0.8}
            width={928}
            height={382}
            fontSize={12.5}
            title="replit / workspace / app.ts"
          />
          <div style={{ position: "absolute", right: 14, top: -14 }}>
            <Reveal start={2.0}>
              <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 8 }}>
                AI-ASSISTED BUILD
              </Tag>
            </Reveal>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 770,
            width: 548,
            height: 570,
          }}
        >
          <AppShell start={1.25} width={548} height={570} compact />
        </div>

        <div
          style={{
            position: "absolute",
            left: 672,
            top: 830,
            width: 270,
            height: 360,
          }}
        >
          <DatabaseCylinder
            size={270}
            start={2.4}
            health={1}
            label="CONTACTS"
            accent={C.cyan}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 664,
            top: 1204,
            width: 280,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Divider color={`${C.cyan}44`} style={{ width: 170 }} />
          <Mono size={9} color={C.cyan} style={{ letterSpacing: "0.18em" }}>
            REAL BUSINESS DATA
          </Mono>
          <Mono size={8} color={C.mute} style={{ letterSpacing: "0.12em" }}>
            CONTACT RECORDS
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1400,
            borderTop: `1px solid ${C.line}`,
            paddingTop: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: progress(frame, fps, 3.0, 0.8),
          }}
        >
          <div style={{ display: "flex", gap: 10 }}>
            {COPY.experimentLabels.map((label, i) => (
              <Tag
                key={label}
                color={i === 2 ? C.cyan : C.silver}
                background={i === 2 ? C.cyanSoft : "rgba(255,255,255,0.035)"}
                style={{ fontSize: 8, padding: "5px 8px" }}
              >
                {label}
              </Tag>
            ))}
          </div>
          <Mono size={8} color={C.mute}>
            US-EAST · LIVE
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 1496,
            width: 880,
            opacity: progress(frame, fps, 5.6, 0.9) * 0.85,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(18),
              fontWeight: 500,
              letterSpacing: "0.08em",
              lineHeight: 1.7,
              color: C.dim,
            }}
          >
            A working application, built in public, with a real contact database
            underneath.
          </div>
        </div>
      </div>

      <Beam start={4.1} duration={1.8} color={C.blue} opacity={0.08} />
      <Scanlines opacity={0.04} spacing={5} />
      <Vignette strength={0.96} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
