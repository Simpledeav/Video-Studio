import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../../config/blackberry";
import { SwissGrid } from "../SwissGrid";
import { BlackBerryDevice } from "../BlackBerryDevice";

export const Scene7Lesson: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Timing inside Scene 7 (330 frames total):
  // 0-80: Phone at left, "WHAT WORKS TODAY" enters on right
  // 80-160: Line extends across, "WHAT THE FUTURE NEEDS" reveals and expands
  // 160-240: "NEVER STOP ADAPTING" locks in
  // 240-330: Clean Simpledeav signature sign-off
  const phrase1Progress = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phrase2Progress = interpolate(frame, [80, 135], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineProgress = interpolate(frame, [70, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Scale transition: phrase 1 shrinks, phrase 2 grows
  const phrase1Scale = interpolate(frame, [90, 150], [1.0, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phrase1Opacity = interpolate(frame, [90, 150], [1.0, 0.45], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phrase2Scale = interpolate(frame, [90, 160], [0.85, 1.08], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lessonBadge = interpolate(frame, [160, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final Simpledeav Sign-off overlay (frames 240 to 330)
  const signoffOpacity = interpolate(frame, [240, 265], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SwissGrid title="THE BUSINESS LESSON" category="07 / CONCLUSION" timeCode="01:09 – 01:20" isWide={isWide}>
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
        {/* Left Side: Original BlackBerry Phone */}
        <div
          style={{
            position: isWide ? "relative" : "absolute",
            left: isWide ? 40 : 20,
            bottom: isWide ? undefined : 60,
            zIndex: 20,
            transform: `scale(${isWide ? 0.88 : 0.68})`,
            transformOrigin: "center center",
          }}
        >
          <BlackBerryDevice screenContent="quote" />
        </div>

        {/* Right Side: Editorial Comparative Lesson */}
        <div
          style={{
            position: isWide ? "relative" : "absolute",
            right: isWide ? 60 : 20,
            top: isWide ? undefined : 60,
            maxWidth: isWide ? 760 : 620,
            zIndex: 25,
            padding: "20px 0",
          }}
        >
          {/* Section Marker */}
          <div
            style={{
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.18em",
              color: PALETTE.signalOrange,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            ● STRATEGIC TAKEAWAY
          </div>

          {/* Phrase 1: "WHAT WORKS TODAY" */}
          <div
            style={{
              opacity: phrase1Progress * phrase1Opacity,
              transform: `scale(${phrase1Scale})`,
              transformOrigin: "left center",
              marginBottom: 20,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.neutralGrey, letterSpacing: "0.12em" }}>
              STEP 01
            </div>
            <h2
              style={{
                fontSize: isWide ? 48 : 38,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                color: PALETTE.inkBlack,
                lineHeight: 1.1,
              }}
            >
              WHAT WORKS TODAY
            </h2>
          </div>

          {/* Thin Extending Line */}
          <div
            style={{
              width: `${lineProgress * 100}%`,
              height: 2,
              background: `linear-gradient(90deg, ${PALETTE.neutralGrey} 0%, ${PALETTE.electricCobalt} 100%)`,
              margin: "16px 0 24px",
            }}
          />

          {/* Phrase 2: "WHAT THE FUTURE NEEDS" */}
          <div
            style={{
              opacity: phrase2Progress,
              transform: `scale(${phrase2Scale})`,
              transformOrigin: "left center",
              marginBottom: 28,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 800, color: PALETTE.electricCobalt, letterSpacing: "0.14em" }}>
              CRITICAL ADAPTATION
            </div>
            <h1
              style={{
                fontSize: isWide ? 64 : 48,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                margin: "4px 0 0",
                color: PALETTE.electricCobalt,
                lineHeight: 1.05,
              }}
            >
              WHAT THE FUTURE NEEDS.
            </h1>
          </div>

          {/* On-screen text badge: "NEVER STOP ADAPTING." */}
          <div
            style={{
              opacity: lessonBadge,
              transform: `translateY(${(1 - lessonBadge) * 16}px)`,
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              background: PALETTE.signalOrange,
              color: "#FFF",
              padding: "10px 24px",
              borderRadius: 8,
              boxShadow: "0 8px 24px rgba(255, 90, 54, 0.35)",
            }}
          >
            <span style={{ fontSize: 16 }}>⚡</span>
            <span style={{ fontSize: isWide ? 18 : 16, fontWeight: 800, letterSpacing: "0.08em" }}>
              NEVER STOP ADAPTING.
            </span>
          </div>
        </div>

        {/* Clean Simpledeav Closing Signature (Frames 240–330) */}
        {signoffOpacity > 0.01 && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: PALETTE.warmWhite,
              opacity: signoffOpacity,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 100,
              fontFamily: '"Poppins", sans-serif',
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                backgroundColor: PALETTE.electricCobalt,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#FFF",
                fontSize: 32,
                fontWeight: 800,
                boxShadow: "0 12px 32px rgba(36, 87, 255, 0.35)",
                marginBottom: 20,
              }}
            >
              S
            </div>
            <h1
              style={{
                fontSize: isWide ? 56 : 48,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: PALETTE.inkBlack,
                margin: 0,
              }}
            >
              SIMPLEDEAV
            </h1>
            <div
              style={{
                fontSize: isWide ? 14 : 13,
                fontWeight: 600,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: PALETTE.neutralGrey,
                marginTop: 8,
              }}
            >
              INTELLIGENT BUSINESS DOCUMENTARIES
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginTop: 28,
                fontSize: 12,
                color: PALETTE.electricCobalt,
                fontWeight: 700,
              }}
            >
              <span>CASE STUDY NO. 04</span>
              <span>·</span>
              <span>BLACKBERRY</span>
            </div>
          </div>
        )}
      </div>
    </SwissGrid>
  );
};
