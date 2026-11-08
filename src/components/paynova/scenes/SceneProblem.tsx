import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, COPY, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines, MonitorScreen, DatabaseTable, CodeBlock } from "../visuals";

export const SceneProblem: React.FC = () => {
  const frame = useCurrentFrame();

  const zoom = interpolate(frame, [0, 90, 240, 300], [1, 1.18, 1.18, 1.05], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const scanProgress = interpolate(frame, [30, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const codeOpacity = interpolate(frame, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const labelOpacity = interpolate(frame, [140, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundGradient />
      <GridLines opacity={0.04} density={70} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: "50% 45%",
          willChange: "transform",
        }}
      >
        <MonitorScreen x={60} y={280} width={960} height={560} glow={C.amberGlow}>
          <DatabaseTable rows={14} scanProgress={scanProgress} highlightRow={3} />
        </MonitorScreen>

        <div
          style={{
            position: "absolute",
            left: 100,
            right: 100,
            bottom: 170,
            opacity: codeOpacity,
          }}
        >
          <CodeBlock code={COPY.query} highlighted label="SLOW QUERY" />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 130,
            textAlign: "center",
            opacity: labelOpacity,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "10px 22px",
              borderRadius: 8,
              background: C.amberSoft,
              border: `1px solid ${C.amber}44`,
              color: C.amber,
              fontFamily: FONT,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            FULL TABLE SCAN
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
