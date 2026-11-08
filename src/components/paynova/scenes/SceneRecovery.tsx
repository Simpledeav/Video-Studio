import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C } from "../../../config/paynova";
import { BackgroundGradient, GridLines, OfficeEnvironment, MonitorScreen, MonitoringDashboard, ComparisonCard } from "../visuals";
import { IllustratedCharacter } from "../characters";

export const SceneRecovery: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const zoom = interpolate(frame, [0, 330], [1.12, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const dashboardOpacity = interpolate(frame, [30, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const compareOpacity = interpolate(frame, [100, 160], [0, 1], {
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
          transform: `scale(${zoom})`,
          transformOrigin: "50% 55%",
          willChange: "transform",
        }}
      >
        <IllustratedCharacter character="daniel" pose="relieved" x={width * 0.30} y={height * 0.74} scale={0.86} facing="right" />
        <IllustratedCharacter character="maya" pose="relieved" x={width * 0.70} y={height * 0.74} scale={0.84} facing="left" />

        <MonitorScreen x={width * 0.30} y={height * 0.22} width={420} height={300} glow={C.greenSoft}>
          <div style={{ opacity: dashboardOpacity }}>
            <MonitoringDashboard recovering />
          </div>
        </MonitorScreen>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          top: 92,
          display: "flex",
          gap: 20,
          opacity: compareOpacity,
          pointerEvents: "none",
        }}
      >
        <div style={{ flex: 1 }}>
          <ComparisonCard type="before" title="BEFORE" items={["Inefficient query", "Full table scan", "Increasing latency"]} />
        </div>
        <div style={{ flex: 1 }}>
          <ComparisonCard type="after" title="AFTER" items={["Optimized query", "Appropriate index", "Efficient retrieval"]} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
