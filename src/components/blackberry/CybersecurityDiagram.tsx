import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../config/blackberry";

export const CybersecurityDiagram: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Animation timeline across Scene 6 (390 frames total)
  // 0-60: Hardware era archiver locks, transition banner slides in
  // 60-200: Architecture matrix modules reveal
  // 200-390: Enterprise network and data encryption streams pulse
  const pivotProgress = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const modulesProgress = interpolate(frame, [60, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const pulse = Math.sin(frame * 0.12) * 0.5 + 0.5;

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
      }}
    >
      {/* Strategic Transition Header Bar */}
      <div
        style={{
          width: isWide ? 1120 : 880,
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#FFFFFF",
          border: `1.5px solid ${PALETTE.border}`,
          borderRadius: 16,
          padding: "16px 28px",
          boxShadow: "0 8px 30px rgba(23, 23, 23, 0.05)",
          opacity: pivotProgress,
          transform: `translateY(${(1 - pivotProgress) * 16}px)`,
        }}
      >
        {/* Old Era: Strikethrough */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              padding: "6px 14px",
              background: "rgba(23, 23, 23, 0.05)",
              borderRadius: 6,
              color: PALETTE.neutralGrey,
              fontWeight: 700,
              fontSize: isWide ? 15 : 14,
              textDecoration: "line-through",
              letterSpacing: "0.06em",
            }}
          >
            SMARTPHONE HARDWARE
          </div>
          <span style={{ fontSize: 11, color: PALETTE.neutralGrey, fontWeight: 600 }}>2016 ARCHIVED</span>
        </div>

        {/* Pivot Arrow */}
        <div style={{ fontSize: 20, color: PALETTE.electricCobalt, fontWeight: 800 }}>➔</div>

        {/* New Era: Software & Security */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              padding: "6px 18px",
              background: PALETTE.electricCobalt,
              borderRadius: 6,
              color: "#FFF",
              fontWeight: 800,
              fontSize: isWide ? 15 : 14,
              letterSpacing: "0.08em",
              boxShadow: "0 4px 16px rgba(36, 87, 255, 0.3)",
            }}
          >
            SOFTWARE + CYBERSECURITY
          </div>
          <span style={{ fontSize: 11, color: PALETTE.electricCobalt, fontWeight: 700 }}>PIVOT ACTIVE</span>
        </div>
      </div>

      {/* Main Architecture Matrix */}
      <div
        style={{
          width: isWide ? 1120 : 880,
          display: "grid",
          gridTemplateColumns: isWide ? "repeat(3, 1fr)" : "1fr",
          gap: isWide ? 24 : 16,
          margin: "auto 0",
          opacity: modulesProgress,
          transform: `translateY(${(1 - modulesProgress) * 20}px)`,
        }}
      >
        {/* Module 1: QNX Operating System */}
        <div
          style={{
            background: "#FFFFFF",
            border: `1.5px solid ${PALETTE.border}`,
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 12px 32px rgba(23, 23, 23, 0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🚗</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: PALETTE.electricCobalt,
                  background: PALETTE.cobaltTint,
                  padding: "4px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.1em",
                }}
              >
                EMBEDDED OS
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: PALETTE.inkBlack }}>
              BlackBerry QNX
            </h3>
            <p style={{ fontSize: 13, color: PALETTE.neutralGrey, lineHeight: 1.5, margin: 0 }}>
              Mission-critical microkernel OS powering over 235 million connected vehicles, medical robots, and aerospace systems.
            </p>
          </div>
          <div style={{ marginTop: 18, borderTop: `1px solid ${PALETTE.border}`, paddingTop: 12, fontSize: 11, fontWeight: 700, color: PALETTE.inkBlack }}>
            &gt; 235M VEHICLES WORLDWIDE
          </div>
        </div>

        {/* Module 2: AI Cybersecurity & Zero Trust */}
        <div
          style={{
            background: "#FFFFFF",
            border: `1.5px solid ${PALETTE.electricCobalt}`,
            borderRadius: 16,
            padding: "24px",
            boxShadow: `0 16px 40px rgba(36, 87, 255, ${0.1 + pulse * 0.12})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -10,
              right: 20,
              background: PALETTE.electricCobalt,
              color: "#FFF",
              fontSize: 9,
              fontWeight: 800,
              padding: "2px 8px",
              borderRadius: 4,
              letterSpacing: "0.1em",
            }}
          >
            CORE CAPABILITY
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🛡️</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: PALETTE.signalOrange,
                  background: PALETTE.orangeTint,
                  padding: "4px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.1em",
                }}
              >
                AI ENDPOINT DEFENSE
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: PALETTE.inkBlack }}>
              BlackBerry Cylance
            </h3>
            <p style={{ fontSize: 13, color: PALETTE.neutralGrey, lineHeight: 1.5, margin: 0 }}>
              Predictive AI threat prevention and Zero Trust network access stopping zero-day ransomware before execution.
            </p>
          </div>
          <div style={{ marginTop: 18, borderTop: `1px solid ${PALETTE.border}`, paddingTop: 12, fontSize: 11, fontWeight: 700, color: PALETTE.electricCobalt }}>
            PREDICTIVE ZERO-TRUST ARCHITECTURE
          </div>
        </div>

        {/* Module 3: Secure Communications */}
        <div
          style={{
            background: "#FFFFFF",
            border: `1.5px solid ${PALETTE.border}`,
            borderRadius: 16,
            padding: "24px",
            boxShadow: "0 12px 32px rgba(23, 23, 23, 0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 24 }}>🔐</span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: PALETTE.electricCobalt,
                  background: PALETTE.cobaltTint,
                  padding: "4px 8px",
                  borderRadius: 4,
                  letterSpacing: "0.1em",
                }}
              >
                GOV-GRADE CRYPTO
              </span>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 6px", color: PALETTE.inkBlack }}>
              SecuSUITE &amp; AtHoc
            </h3>
            <p style={{ fontSize: 13, color: PALETTE.neutralGrey, lineHeight: 1.5, margin: 0 }}>
              Encrypted voice and emergency crisis management trusted by G7 governments, defense agencies, and central banks.
            </p>
          </div>
          <div style={{ marginTop: 18, borderTop: `1px solid ${PALETTE.border}`, paddingTop: 12, fontSize: 11, fontWeight: 700, color: PALETTE.inkBlack }}>
            FIPS 140-2 CERTIFIED ENCRYPTION
          </div>
        </div>
      </div>

      {/* Editorial Concluding Message */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: isWide ? 13 : 14,
            fontWeight: 800,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: PALETTE.electricCobalt,
            marginBottom: 4,
          }}
        >
          ● STRATEGIC TRANSFORMATION
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
          THE COMPANY CHANGED WHAT IT WAS.
        </h2>
      </div>
    </div>
  );
};
