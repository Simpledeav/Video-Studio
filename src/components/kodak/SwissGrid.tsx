import React from "react";
import { Img, staticFile } from "remotion";
import { PALETTE } from "../../config/kodak";

export const SwissGrid: React.FC<{
  title?: string;
  category?: string;
  timeCode?: string;
  isWide?: boolean;
  children?: React.ReactNode;
}> = ({
  title = "KODAK",
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
        backgroundColor: PALETTE.warmIvory,
        color: PALETTE.primaryText,
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
          opacity: 0.035,
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
          <pattern
            id="kodak-swiss-dots"
            width={isWide ? 80 : 60}
            height={isWide ? 80 : 60}
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1" fill={PALETTE.gridHairline} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#kodak-swiss-dots)" />

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
          color: PALETTE.primaryText,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: PALETTE.accentYellow, fontSize: 16 }}>●</span>
          <span style={{ color: PALETTE.secondaryText }}>{category}</span>
          <span style={{ color: PALETTE.border }}>/</span>
          <span style={{ fontWeight: 800, color: PALETTE.primaryText }}>{title}</span>
        </div>

        {timeCode && (
          <div
            style={{
              fontFamily: '"SF Mono", "Menlo", monospace',
              fontSize: isWide ? 12 : 13,
              fontWeight: 600,
              color: PALETTE.secondaryText,
              letterSpacing: "0.08em",
            }}
          >
            {timeCode}
          </div>
        )}
      </div>

      {/* Main Content Area */}
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

      {/* Footer Editorial Sub-bar */}
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
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: PALETTE.secondaryText,
          zIndex: 20,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: PALETTE.accentBlue }}>▪</span>
          <span>KODAK: THE FUTURE IT INVENTED</span>
        </div>
        <div>SIMPLEDEAV STUDIO · 80.0S / 30 FPS</div>
      </div>
    </div>
  );
};
