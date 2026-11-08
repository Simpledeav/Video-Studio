import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines, OfficeEnvironment, MonitorScreen, QueryExecutionPlan } from "../visuals";
import { IllustratedCharacter } from "../characters";

export const SceneDiscovery: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const zoom = interpolate(frame, [0, 120, 240, 300], [1, 1.35, 1.35, 1.1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const planOpacity = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [80, 130], [0, 1], {
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
          transform: `scale(${zoom})`,
          transformOrigin: "50% 45%",
          willChange: "transform",
        }}
      >
        <IllustratedCharacter character="daniel" pose="pointing" x={width * 0.35} y={height * 0.74} scale={0.9} facing="right" />
        <IllustratedCharacter character="maya" pose="concerned" x={width * 0.68} y={height * 0.74} scale={0.88} facing="left" />

        <MonitorScreen x={width * 0.16} y={height * 0.24} width={720} height={420} glow={C.amberGlow}>
          <div style={{ opacity: planOpacity }}>
            <QueryExecutionPlan showScan />
          </div>
        </MonitorScreen>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 110,
          textAlign: "center",
          opacity: badgeOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "12px 26px",
            borderRadius: 8,
            background: C.amberSoft,
            border: `1px solid ${C.amber}44`,
            color: C.amber,
            fontFamily: FONT,
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.1em",
          }}
        >
          QUERY BOTTLENECK IDENTIFIED
        </div>
      </div>
    </AbsoluteFill>
  );
};
