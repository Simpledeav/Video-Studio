import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../config/blackberry";
import { BlackBerryDevice } from "./BlackBerryDevice";

export const EcosystemDiagram: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Animation timeline across Scene 4 (360 frames total)
  // 0-60: Labels "HARDWARE", "SOFTWARE", "ECOSYSTEM" enter
  // 60-180: Outer ecosystem nodes orbit and connect
  // 180-360: Ecosystem expands outward; center hardware becomes visually isolated
  const labelProgress = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const expansion = interpolate(frame, [60, 260], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const isolation = interpolate(frame, [180, 320], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const nodes = [
    { title: "App Store (500k+ Apps)", icon: "🛒", angle: 0 },
    { title: "Mobile Gaming & 3D", icon: "🎮", angle: 45 },
    { title: "Social Streams", icon: "💬", angle: 90 },
    { title: "Full HTML5 Web", icon: "🌐", angle: 135 },
    { title: "Cloud Sync & Media", icon: "☁️", angle: 180 },
    { title: "Maps & Location", icon: "📍", angle: 225 },
    { title: "Streaming Video", icon: "🎬", angle: 270 },
    { title: "Multi-Touch UI", icon: "✨", angle: 315 },
  ];

  const baseRadius = isWide ? 260 : 280;
  const expandedRadius = isWide ? 380 : 360;
  const currentRadius = baseRadius + (expandedRadius - baseRadius) * expansion;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: '"Poppins", sans-serif',
        position: "relative",
      }}
    >
      {/* Three Editorial Pillar Labels */}
      <div
        style={{
          display: "flex",
          gap: isWide ? 40 : 20,
          marginTop: 16,
          opacity: labelProgress,
          transform: `translateY(${(1 - labelProgress) * 20}px)`,
        }}
      >
        {[
          { num: "01", name: "HARDWARE", active: isolation < 0.6 },
          { num: "02", name: "SOFTWARE", active: true },
          { num: "03", name: "ECOSYSTEM", active: true, highlight: true },
        ].map((pillar) => (
          <div
            key={pillar.num}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 18px",
              background: pillar.highlight ? PALETTE.electricCobalt : "#FFF",
              color: pillar.highlight ? "#FFF" : PALETTE.inkBlack,
              border: `1.5px solid ${pillar.highlight ? PALETTE.electricCobalt : PALETTE.border}`,
              borderRadius: 30,
              boxShadow: pillar.highlight
                ? "0 8px 24px rgba(36, 87, 255, 0.25)"
                : "0 4px 12px rgba(23, 23, 23, 0.04)",
              fontWeight: 700,
              fontSize: isWide ? 14 : 15,
              letterSpacing: "0.08em",
            }}
          >
            <span style={{ opacity: 0.6, fontSize: 11 }}>{pillar.num}</span>
            <span>{pillar.name}</span>
          </div>
        ))}
      </div>

      {/* Center Diagram Stage */}
      <div
        style={{
          position: "relative",
          width: isWide ? 900 : 700,
          height: isWide ? 580 : 680,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* SVG Network Connector Lines */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            overflow: "visible",
            pointerEvents: "none",
          }}
        >
          {/* Outer Orbit Ring */}
          <circle
            cx="50%"
            cy="50%"
            r={currentRadius}
            fill="none"
            stroke={PALETTE.electricCobalt}
            strokeWidth={1.5}
            strokeDasharray="6 6"
            opacity={0.35 + expansion * 0.3}
          />

          {/* Connectors Between Orbiting Nodes */}
          {nodes.map((node, i) => {
            const rad1 = (node.angle * Math.PI) / 180;
            const x1 = Math.cos(rad1) * currentRadius;
            const y1 = Math.sin(rad1) * currentRadius;

            const next = nodes[(i + 1) % nodes.length];
            const rad2 = (next.angle * Math.PI) / 180;
            const x2 = Math.cos(rad2) * currentRadius;
            const y2 = Math.sin(rad2) * currentRadius;

            return (
              <g key={node.title} transform={`translate(${isWide ? 450 : 350}, ${isWide ? 290 : 340})`}>
                {/* Cross-mesh network line */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={PALETTE.electricCobalt}
                  strokeWidth={2}
                  opacity={0.25 + expansion * 0.45}
                />
                {/* Thin dashed line from center to node */}
                <line
                  x1={0}
                  y1={0}
                  x2={x1}
                  y2={y1}
                  stroke={isolation > 0.5 ? PALETTE.neutralGrey : PALETTE.border}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                  opacity={1 - isolation * 0.65}
                />
              </g>
            );
          })}
        </svg>

        {/* Central BlackBerry Device */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            transform: `scale(${isWide ? 0.68 : 0.62})`,
            filter: isolation > 0.5 ? "grayscale(40%) opacity(0.85)" : "none",
          }}
        >
          {/* Isolation Boundary Box */}
          {isolation > 0.3 && (
            <div
              style={{
                position: "absolute",
                inset: -24,
                borderRadius: 56,
                border: `2px dashed ${PALETTE.signalOrange}`,
                opacity: (isolation - 0.3) * 1.4,
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: PALETTE.signalOrange,
                  color: "#FFF",
                  fontSize: 10,
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.1em",
                }}
              >
                ISOLATED HARDWARE
              </div>
            </div>
          )}
          <BlackBerryDevice screenContent="bbm" />
        </div>

        {/* Orbiting Ecosystem Nodes */}
        {nodes.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const x = Math.cos(rad) * currentRadius;
          const y = Math.sin(rad) * currentRadius;

          return (
            <div
              key={node.title}
              style={{
                position: "absolute",
                transform: `translate(${x}px, ${y}px)`,
                zIndex: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#FFF",
                border: `1.5px solid ${PALETTE.electricCobalt}`,
                borderRadius: 24,
                padding: "6px 14px",
                boxShadow: "0 8px 24px rgba(36, 87, 255, 0.16)",
                whiteSpace: "nowrap",
                fontSize: isWide ? 12 : 11,
                fontWeight: 700,
                color: PALETTE.inkBlack,
              }}
            >
              <span>{node.icon}</span>
              <span>{node.title}</span>
            </div>
          );
        })}
      </div>

      {/* Editorial Concluding Statements */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 16,
          zIndex: 30,
        }}
      >
        <div
          style={{
            fontSize: isWide ? 14 : 15,
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: PALETTE.signalOrange,
            marginBottom: 4,
          }}
        >
          {isolation > 0.4 ? "● MARKET REALITY" : "● INDUSTRY PARADIGM"}
        </div>
        <h2
          style={{
            fontSize: isWide ? 38 : 42,
            fontWeight: 800,
            letterSpacing: "-0.03em",
            margin: 0,
            lineHeight: 1.15,
            color: PALETTE.inkBlack,
          }}
        >
          {isolation > 0.5 ? "THE ECOSYSTEM MATTERED." : "THE PRODUCT WASN'T ENOUGH."}
        </h2>
      </div>
    </div>
  );
};
