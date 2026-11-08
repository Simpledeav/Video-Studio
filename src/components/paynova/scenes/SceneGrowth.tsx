import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, COPY, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines, OfficeEnvironment, MonitorScreen, MonitoringDashboard, APIRequestFlow } from "../visuals";
import { IllustratedCharacter } from "../characters";

export const SceneGrowth: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const camX = interpolate(frame, [0, 270], [80, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });
  const camScale = interpolate(frame, [0, 270], [1.08, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const dashboardOpacity = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const flowOpacity = interpolate(frame, [120, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundGradient />
      <OfficeEnvironment blur={1.5} people />
      <GridLines opacity={0.03} density={90} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${camScale}) translateX(${camX}px)`,
          transformOrigin: "50% 55%",
          willChange: "transform",
        }}
      >
        <IllustratedCharacter character="alex" pose="standing" x={width * 0.18} y={height * 0.68} scale={0.72} facing="right" />
        <IllustratedCharacter character="daniel" pose="typing" x={width * 0.38} y={height * 0.74} scale={0.85} facing="right" />
        <IllustratedCharacter character="maya" pose="typing" x={width * 0.78} y={height * 0.74} scale={0.82} facing="left" />

        <MonitorScreen x={width * 0.08} y={height * 0.34} width={360} height={260} glow={C.cyanGlow}>
          <div style={{ opacity: dashboardOpacity }}>
            <MonitoringDashboard />
          </div>
        </MonitorScreen>

        <MonitorScreen x={width * 0.54} y={height * 0.32} width={400} height={280} glow={C.cyanGlow}>
          <div style={{ opacity: flowOpacity, padding: 16 }}>
            <APIRequestFlow count={14} congested={false} />
          </div>
        </MonitorScreen>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          top: 92,
          opacity: interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          pointerEvents: "none",
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 15, color: C.cyan, letterSpacing: "0.14em", fontWeight: 700 }}>
          CASE STUDY
        </div>
        <div style={{ fontFamily: FONT, fontSize: 42, color: C.white, fontWeight: 800, marginTop: 8, letterSpacing: "-0.02em" }}>
          {COPY.company}
        </div>
      </div>
    </AbsoluteFill>
  );
};
