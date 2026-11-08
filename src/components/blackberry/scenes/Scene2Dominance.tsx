import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../../config/blackberry";
import { SwissGrid } from "../SwissGrid";
import { BlackBerryDevice } from "../BlackBerryDevice";

export const Scene2Dominance: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Timing inside Scene 2 (330 frames total):
  // 0-60: Devices slide diagonally into editorial grid
  // 60-150: Macro keyboard typing highlight and animated keys
  // 150-240: 19.9% market share number counter reveals with scale spring
  // 240-330: Data connection lines and metric annotations lock
  const deviceSlide = interpolate(frame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numberScale = interpolate(frame, [140, 190], [0.8, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const numberOpacity = interpolate(frame, [140, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linesProgress = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Animated counter for 19.9%
  const currentPercent = interpolate(frame, [145, 210], [0, 19.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SwissGrid title="THE DOMINANCE" category="02 / MARKET PEAK" timeCode="00:08 – 00:19" isWide={isWide}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: isWide ? "space-between" : "center",
          overflow: "hidden",
        }}
      >
        {/* Left Side: Editorial Typography & 19.9% Showcase */}
        <div
          style={{
            position: isWide ? "relative" : "absolute",
            top: isWide ? undefined : 40,
            left: isWide ? 40 : 20,
            zIndex: 30,
            maxWidth: isWide ? 620 : 600,
          }}
        >
          {/* Year pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 14px",
              background: PALETTE.electricCobalt,
              color: "#FFF",
              borderRadius: 4,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.14em",
              marginBottom: 14,
            }}
          >
            <span>YEAR 2009</span>
          </div>

          {/* Huge 19.9% Number Reveal */}
          <div
            style={{
              opacity: numberOpacity,
              transform: `scale(${numberScale})`,
              transformOrigin: "left center",
            }}
          >
            <div
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: isWide ? 110 : 88,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 0.95,
                color: PALETTE.inkBlack,
                fontFeatureSettings: '"tnum"',
              }}
            >
              {currentPercent.toFixed(1)}%
            </div>
            <h2
              style={{
                fontSize: isWide ? 28 : 24,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: PALETTE.electricCobalt,
                marginTop: 8,
                marginBottom: 4,
              }}
            >
              GLOBAL SMARTPHONE MARKET SHARE
            </h2>
            <div
              style={{
                fontSize: 12,
                color: PALETTE.neutralGrey,
                fontWeight: 500,
                maxWidth: 480,
                lineHeight: 1.4,
              }}
            >
              Approximate share of global smartphone unit sales in 2009 (Source: Gartner)
            </div>
          </div>

          {/* 3 Core Strengths Pillar Badges */}
          <div
            style={{
              display: "flex",
              flexDirection: isWide ? "row" : "column",
              gap: 10,
              marginTop: isWide ? 36 : 24,
            }}
          >
            {[
              { icon: "🔒", title: "SECURE MESSAGING", desc: "BBM & AES-256 Encryption" },
              { icon: "⌨️", title: "PHYSICAL KEYBOARDS", desc: "Ergonomic 35-Key Tactile Frets" },
              { icon: "💼", title: "ENTERPRISE COMMUNICATION", desc: "Direct BES Corporate Push" },
            ].map((item, idx) => (
              <div
                key={item.title}
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid ${PALETTE.border}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  boxShadow: "0 6px 16px rgba(23, 23, 23, 0.04)",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: interpolate(frame, [60 + idx * 25, 90 + idx * 25], [0, 1], {
                    extrapolateLeft: "clamp",
                    extrapolateRight: "clamp",
                  }),
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: PALETTE.inkBlack }}>{item.title}</div>
                  <div style={{ fontSize: 10, color: PALETTE.neutralGrey }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Editorial Diagonal Product Showcase */}
        <div
          style={{
            position: isWide ? "relative" : "absolute",
            bottom: isWide ? undefined : 60,
            right: isWide ? 80 : 0,
            zIndex: 20,
            width: isWide ? 560 : 480,
            height: isWide ? 640 : 540,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Background Shadow Device (creates editorial magazine spread depth) */}
          <div
            style={{
              position: "absolute",
              transform: `translate(${isWide ? "-80px, -60px" : "-60px, -40px"}) rotate(-8deg) scale(${isWide ? 0.8 : 0.65})`,
              opacity: deviceSlide * 0.45,
              filter: "blur(2px) grayscale(50%)",
              zIndex: 10,
            }}
          >
            <BlackBerryDevice screenContent="quote" />
          </div>

          {/* Foreground Hero Device */}
          <div
            style={{
              position: "absolute",
              transform: `translate(${(1 - deviceSlide) * 120}px, ${(1 - deviceSlide) * 60}px) rotate(4deg) scale(${isWide ? 1.0 : 0.85})`,
              zIndex: 20,
            }}
          >
            <BlackBerryDevice
              screenContent="market"
              isTyping={frame > 70 && frame < 160}
              highlightKey={frame > 80 && frame < 110 ? "B" : undefined}
            />
          </div>

          {/* Precision Connecting Data Line */}
          {linesProgress > 0 && (
            <svg
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 25,
              }}
            >
              <line
                x1={isWide ? -120 : -40}
                y1={isWide ? 220 : 160}
                x2={isWide ? 180 : 140}
                y2={isWide ? 260 : 200}
                stroke={PALETTE.electricCobalt}
                strokeWidth={2}
                strokeDasharray="4 4"
                opacity={linesProgress}
              />
              <circle cx={isWide ? 180 : 140} cy={isWide ? 260 : 200} r={5} fill={PALETTE.electricCobalt} />
            </svg>
          )}
        </div>
      </div>
    </SwissGrid>
  );
};
