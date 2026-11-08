import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, COPY, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines, MonitorScreen, TransactionAppScreen } from "../visuals";

export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();

  // Camera push-in on app screen, then pull back
  const zoom = interpolate(frame, [0, 70, 180, 210], [1.55, 1.7, 1.1, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });
  const panY = interpolate(frame, [0, 70, 180, 210], [-40, -70, 0, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const titleOpacity = interpolate(frame, [140, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundGradient />
      <GridLines opacity={0.04} density={80} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom}) translateY(${panY}px)`,
          transformOrigin: "50% 40%",
          willChange: "transform",
        }}
      >
        <MonitorScreen x={190} y={520} width={700} height={880} glow={C.cyanGlow}>
          <TransactionAppScreen loading showNotification />
        </MonitorScreen>
      </div>

      <div
        style={{
          position: "absolute",
          top: 140,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleOpacity,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "12px 24px",
            borderRadius: 8,
            background: C.redSoft,
            border: `1px solid ${C.red}44`,
            color: C.red,
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          TRANSACTION DELAY
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 260,
          textAlign: "center",
          opacity: titleOpacity,
          pointerEvents: "none",
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 800, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
          {COPY.title}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 20, color: C.muted, marginTop: 14, fontWeight: 500 }}>
          {COPY.subtitle}
        </div>
      </div>
    </AbsoluteFill>
  );
};
