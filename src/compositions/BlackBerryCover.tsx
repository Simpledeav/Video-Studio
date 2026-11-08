import React from "react";
import { AbsoluteFill } from "remotion";
import { PALETTE } from "../config/blackberry";
import { SwissGrid } from "../components/blackberry/SwissGrid";
import { BlackBerryDevice } from "../components/blackberry/BlackBerryDevice";
import { useLocalFonts } from "../hooks/useLocalFonts";

export const BlackBerryCover: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: PALETTE.warmWhite }}>
      <SwissGrid
        title="CASE STUDY NO. 04"
        category="BUSINESS STRATEGY / INNOVATION"
        timeCode="80 SECONDS · SWISS EDITORIAL"
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "40px 10px 20px",
            fontFamily: '"Poppins", sans-serif',
            boxSizing: "border-box",
          }}
        >
          {/* Top Section: Orange Editorial Pill & Issue Marker */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: PALETTE.signalOrange,
                color: "#FFF",
                padding: "6px 16px",
                borderRadius: 4,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                marginBottom: 20,
              }}
            >
              <span>●</span>
              <span>BUSINESS CASE STUDY</span>
            </div>

            {/* Oversized Poppins Editorial Headline */}
            <h1
              style={{
                fontSize: 72,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.0,
                color: PALETTE.inkBlack,
                margin: "0 0 16px",
                maxWidth: 720,
              }}
            >
              BLACKBERRY SAW THE FUTURE.
            </h1>

            {/* Supporting line */}
            <h2
              style={{
                fontSize: 36,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                color: PALETTE.electricCobalt,
                margin: 0,
                maxWidth: 640,
              }}
            >
              BUT COULDN&apos;T CATCH UP.
            </h2>
          </div>

          {/* Center / Asymmetrical Product Visual */}
          <div
            style={{
              position: "absolute",
              right: -30,
              bottom: 120,
              transform: "rotate(-6deg) scale(1.15)",
              zIndex: 20,
            }}
          >
            <BlackBerryDevice screenContent="market" />
          </div>

          {/* Cobalt-Blue Geometric Accent Block */}
          <div
            style={{
              position: "absolute",
              left: 10,
              bottom: 140,
              width: 320,
              background: "#FFFFFF",
              border: `2px solid ${PALETTE.electricCobalt}`,
              borderRadius: 16,
              padding: "20px 24px",
              boxShadow: "0 16px 40px rgba(36, 87, 255, 0.14)",
              zIndex: 25,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: PALETTE.electricCobalt, letterSpacing: "0.14em" }}>
              THE CORE LESSON
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: PALETTE.inkBlack, margin: "6px 0", lineHeight: 1.25 }}>
              Your biggest advantage today can become your biggest weakness tomorrow.
            </div>
            <div style={{ fontSize: 12, color: PALETTE.neutralGrey, fontWeight: 500, marginTop: 4 }}>
              19.9% in 2009 → 0.05% in 2016
            </div>
          </div>

          {/* Bottom Footer Signature */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `1px solid ${PALETTE.border}`,
              paddingTop: 16,
              zIndex: 30,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: PALETTE.electricCobalt,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#FFF",
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                S
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color: PALETTE.inkBlack, letterSpacing: "0.06em" }}>
                SIMPLEDEAV
              </span>
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, color: PALETTE.neutralGrey, letterSpacing: "0.1em" }}>
              #BLACKBERRY #STRATEGY
            </div>
          </div>
        </div>
      </SwissGrid>
    </AbsoluteFill>
  );
};
