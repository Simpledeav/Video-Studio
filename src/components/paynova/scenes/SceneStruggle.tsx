import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines, OfficeEnvironment, MonitorScreen, MonitoringDashboard, APIRequestFlow } from "../visuals";
import { IllustratedCharacter } from "../characters";

export const SceneStruggle: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const camX = interpolate(frame, [0, 330], [0, -60], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const alertOpacity = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flowOpacity = interpolate(frame, [30, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundGradient />
      <OfficeEnvironment blur={1} people={false} />
      <GridLines opacity={0.03} density={90} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${camX}px)`,
          transformOrigin: "50% 55%",
          willChange: "transform",
        }}
      >
        <IllustratedCharacter character="maya" pose="concerned" x={width * 0.68} y={height * 0.74} scale={0.9} facing="left" />
        <IllustratedCharacter character="daniel" pose="standing" x={width * 0.32} y={height * 0.74} scale={0.88} facing="right" />

        <MonitorScreen x={width * 0.12} y={height * 0.22} width={420} height={320} glow={C.redSoft}>
          <div style={{ opacity: alertOpacity }}>
            <MonitoringDashboard alert />
          </div>
        </MonitorScreen>

        <MonitorScreen x={width * 0.52} y={height * 0.24} width={400} height={300} glow={C.redSoft}>
          <div style={{ opacity: flowOpacity, padding: 12 }}>
            <APIRequestFlow count={24} congested />
          </div>
        </MonitorScreen>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 100,
          textAlign: "center",
          opacity: interpolate(frame, [60, 100], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "10px 22px",
            borderRadius: 8,
            background: C.redSoft,
            border: `1px solid ${C.red}44`,
            color: C.red,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.1em",
          }}
        >
          SYSTEM UNDER PRESSURE
        </div>
      </div>
    </AbsoluteFill>
  );
};
