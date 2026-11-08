import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, COPY, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines, OfficeEnvironment, MonitorScreen, QueryExecutionPlan, DatabaseIndexVisualization, CodeBlock } from "../visuals";
import { IllustratedCharacter } from "../characters";

export const SceneSolution: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const camX = interpolate(frame, [0, 360], [40, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const indexOpacity = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const planOpacity = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const codeOpacity = interpolate(frame, [140, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundGradient />
      <OfficeEnvironment blur={1.5} people={false} />
      <GridLines opacity={0.03} density={90} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${camX}px)`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        <IllustratedCharacter character="daniel" pose="typing" x={width * 0.28} y={height * 0.76} scale={0.86} facing="right" />
        <IllustratedCharacter character="maya" pose="pointing" x={width * 0.74} y={height * 0.74} scale={0.86} facing="left" />

        <MonitorScreen x={width * 0.08} y={height * 0.20} width={460} height={340} glow={C.cyanGlow}>
          <div style={{ opacity: indexOpacity, padding: 16 }}>
            <DatabaseIndexVisualization />
          </div>
        </MonitorScreen>

        <MonitorScreen x={width * 0.52} y={height * 0.22} width={440} height={320} glow={C.greenSoft}>
          <div style={{ opacity: planOpacity }}>
            <QueryExecutionPlan showIndex />
          </div>
        </MonitorScreen>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 150,
          opacity: codeOpacity,
        }}
      >
        <CodeBlock code={COPY.index} highlighted label="OPTIMIZED INDEX" />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 100,
          textAlign: "center",
          opacity: interpolate(frame, [200, 260], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            gap: 12,
            alignItems: "center",
            padding: "12px 26px",
            borderRadius: 8,
            background: C.greenSoft,
            border: `1px solid ${C.green}44`,
            color: C.green,
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.08em",
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: 5, background: C.green }} />
          PERFORMANCE TEST PASSED
        </div>
      </div>
    </AbsoluteFill>
  );
};
