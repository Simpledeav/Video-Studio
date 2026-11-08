import React from "react";
import { Img, staticFile } from "remotion";
import { PALETTE } from "../../config/blackberry";

export const SwissGrid: React.FC<{
  title?: string;
  category?: string;
  timeCode?: string;
  isWide?: boolean;
  children?: React.ReactNode;
}> = ({
  title = "BLACKBERRY",
  category = "BUSINESS CASE STUDY / TECH STRATEGY",
  timeCode,
  isWide = false,
  children,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: PALETTE.warmWhite,
        color: PALETTE.inkBlack,
        fontFamily: '"Poppins", sans-serif',
        overflow: "hidden",
      }}
    >
      {/* Subtle fine paper texture */}
      <Img
        src={staticFile("images/grain.png")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.032,
          mixBlendMode: "multiply",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />

      {/* Swiss Editorial Coordinate Lines & Hairline Grid */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <defs>
          <pattern id="swiss-dots" width={isWide ? 80 : 60} height={isWide ? 80 : 60} patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1" fill={PALETTE.gridHairline} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#swiss-dots)" />

        {/* Structural Margin Hairlines */}
        {isWide ? (
          <>
            <line x1="80" y1="0" x2="80" y2="1080" stroke={PALETTE.border} strokeWidth="1" />
            <line x1="1840" y1="0" x2="1840" y2="1080" stroke={PALETTE.border} strokeWidth="1" />
            <line x1="0" y1="72" x2="1920" y2="72" stroke={PALETTE.border} strokeWidth="1" />
            <line x1="0" y1="1008" x2="1920" y2="1008" stroke={PALETTE.border} strokeWidth="1" />
          </>
        ) : (
          <>
            <line x1="64" y1="0" x2="64" y2="1920" stroke={PALETTE.border} strokeWidth="1" />
            <line x1="1016" y1="0" x2="1016" y2="1920" stroke={PALETTE.border} strokeWidth="1" />
            <line x1="0" y1="96" x2="1080" y2="96" stroke={PALETTE.border} strokeWidth="1" />
            <line x1="0" y1="1824" x2="1080" y2="1824" stroke={PALETTE.border} strokeWidth="1" />
          </>
        )}
      </svg>

      {/* Header Editorial Meta Bar */}
      <div
        style={{
          position: "absolute",
          top: isWide ? 28 : 44,
          left: isWide ? 80 : 64,
          right: isWide ? 80 : 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: isWide ? 13 : 14,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: PALETTE.inkBlack,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: PALETTE.signalOrange }}>●</span>
          <span>SIMPLEDEAV</span>
          <span style={{ color: PALETTE.neutralGrey }}>/</span>
          <span style={{ color: PALETTE.neutralGrey }}>REPORT NO. 04</span>
        </div>
        <div>
          <span style={{ color: PALETTE.electricCobalt, fontWeight: 700 }}>{title}</span>
        </div>
        <div style={{ color: PALETTE.neutralGrey, fontFamily: '"SF Mono", monospace', fontSize: 12 }}>
          {timeCode ?? "30 FPS · 80.0S"}
        </div>
      </div>

      {/* Footer Category Meta Bar */}
      <div
        style={{
          position: "absolute",
          bottom: isWide ? 24 : 36,
          left: isWide ? 80 : 64,
          right: isWide ? 80 : 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: isWide ? 11 : 12,
          fontWeight: 500,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: PALETTE.neutralGrey,
          zIndex: 20,
        }}
      >
        <div>{category}</div>
        <div>SWISS EDITORIAL SYSTEM · 2026</div>
      </div>

      {/* Scene Content Container */}
      <div
        style={{
          position: "absolute",
          top: isWide ? 72 : 96,
          bottom: isWide ? 72 : 96,
          left: isWide ? 80 : 64,
          right: isWide ? 80 : 64,
          zIndex: 15,
        }}
      >
        {children}
      </div>
    </div>
  );
};
