import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { EASINGS } from "../../../config/motion";
import { C, FONT } from "../../../config/paynova";
import { BackgroundGradient, GridLines } from "../visuals";

export const SceneCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const zoom = interpolate(frame, [0, 210], [1.05, 1.18], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASINGS.inOut,
  });

  const titleOpacity = interpolate(frame, [20, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const optionsOpacity = interpolate(frame, [90, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <BackgroundGradient />
      <GridLines opacity={0.05} density={70} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${zoom})`,
          transformOrigin: "50% 50%",
          willChange: "transform",
        }}
      >
        {/* Abstract architecture illustration */}
        <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
          <defs>
            <linearGradient id="archGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.cyan} stopOpacity={0.3} />
              <stop offset="100%" stopColor={C.violet} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <rect x={width * 0.15} y={height * 0.25} width={width * 0.7} height={height * 0.45} rx={20} fill="url(#archGrad)" stroke={C.line} strokeWidth={1} />
          {/* Client nodes */}
          {Array.from({ length: 5 }).map((_, i) => (
            <circle key={i} cx={width * (0.22 + i * 0.14)} cy={height * 0.34} r={22} fill={C.surfaceLight} stroke={C.cyan} strokeWidth={1.5} />
          ))}
          {/* API layer */}
          <rect x={width * 0.25} y={height * 0.45} width={width * 0.5} height={54} rx={8} fill={C.surfaceLight} stroke={C.amber} strokeWidth={1.5} />
          <text x={width * 0.5} y={height * 0.48 + 18} textAnchor="middle" fill={C.amber} fontSize={16} fontWeight={700} fontFamily={FONT}>
            API LAYER
          </text>
          {/* DB layer */}
          <rect x={width * 0.3} y={height * 0.58} width={width * 0.4} height={54} rx={8} fill={C.surfaceLight} stroke={C.cyan} strokeWidth={1.5} />
          <text x={width * 0.5} y={height * 0.61 + 18} textAnchor="middle" fill={C.cyan} fontSize={16} fontWeight={700} fontFamily={FONT}>
            DATABASE
          </text>
          {/* Queue */}
          <rect x={width * 0.62} y={height * 0.58} width={width * 0.12} height={54} rx={8} fill={C.surfaceLight} stroke={C.violet} strokeWidth={1.5} />
          <text x={width * 0.68} y={height * 0.61 + 18} textAnchor="middle" fill={C.violet} fontSize={14} fontWeight={700} fontFamily={FONT}>
            QUEUE
          </text>
          {/* Connecting lines */}
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={width * (0.22 + i * 0.14)} y1={height * 0.36} x2={width * 0.5} y2={height * 0.45} stroke={C.line} strokeWidth={1.5} />
          ))}
          <line x1={width * 0.5} y1={height * 0.495} x2={width * 0.5} y2={height * 0.58} stroke={C.line} strokeWidth={2} />
          <line x1={width * 0.66} y1={height * 0.495} x2={width * 0.68} y2={height * 0.58} stroke={C.line} strokeWidth={2} />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: 60,
          right: 60,
          bottom: 360,
          textAlign: "center",
          opacity: titleOpacity,
          pointerEvents: "none",
        }}
      >
        <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 800, color: C.white, letterSpacing: "-0.02em", lineHeight: 1.12 }}>
          WHAT WOULD YOU CHECK FIRST?
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 230,
          display: "flex",
          justifyContent: "center",
          gap: 20,
          opacity: optionsOpacity,
          pointerEvents: "none",
        }}
      >
        {["DATABASE", "API", "QUEUE"].map((label, i) => (
          <div
            key={label}
            style={{
              padding: "14px 32px",
              borderRadius: 10,
              background: C.surface,
              border: `1px solid ${C.line}`,
              color: i === 0 ? C.cyan : C.muted,
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.08em",
              boxShadow: i === 0 ? `0 0 30px ${C.cyanGlow}` : undefined,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
