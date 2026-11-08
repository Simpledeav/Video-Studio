import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../../config/blackberry";
import { SwissGrid } from "../SwissGrid";
import { BlackBerryDevice } from "../BlackBerryDevice";

export const Scene1Question: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Timing inside Scene 1 (240 frames total):
  // 0-40: Phone enters center, subtle scale up 0.9 -> 1.0
  // 40-100: Headline 1: "EVERYONE WANTED ONE." enters from left
  // 100-160: Phone moves to right; Headline 2: "THEN THE WORLD MOVED ON." enters
  // 160-240: Geometric blue reveal and transition
  const phoneScale = interpolate(frame, [0, 40], [0.88, 1.0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phoneX = interpolate(frame, [90, 140], [0, isWide ? 260 : 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headline1Progress = interpolate(frame, [35, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headline2Progress = interpolate(frame, [115, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const blueShapeScale = interpolate(frame, [180, 240], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SwissGrid title="THE QUESTION" category="01 / PROLOGUE" timeCode="00:00 – 00:08" isWide={isWide}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {/* Editorial Pill Badges */}
        <div
          style={{
            position: "absolute",
            top: isWide ? 30 : 40,
            left: 0,
            display: "flex",
            gap: 12,
            zIndex: 30,
          }}
        >
          <div
            style={{
              padding: "4px 12px",
              background: PALETTE.inkBlack,
              color: "#FFF",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
            }}
          >
            BLACKBERRY
          </div>
          <div
            style={{
              padding: "4px 12px",
              background: PALETTE.electricCobalt,
              color: "#FFF",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
            }}
          >
            THE RISE
          </div>
          <div
            style={{
              padding: "4px 12px",
              background: PALETTE.signalOrange,
              color: "#FFF",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.14em",
            }}
          >
            THE DECLINE
          </div>
        </div>

        {/* Headlines Area on Left */}
        <div
          style={{
            position: "absolute",
            left: isWide ? 40 : 20,
            top: isWide ? "36%" : "22%",
            maxWidth: isWide ? 700 : 580,
            zIndex: 25,
          }}
        >
          {/* Headline 1 */}
          <div
            style={{
              opacity: headline1Progress,
              transform: `translateX(${(1 - headline1Progress) * -40}px)`,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: PALETTE.electricCobalt, marginBottom: 6 }}>
              ● 2000–2009
            </div>
            <h1
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: isWide ? 64 : 52,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                margin: 0,
                color: PALETTE.inkBlack,
              }}
            >
              EVERYONE WANTED ONE.
            </h1>
          </div>

          {/* Headline 2 */}
          <div
            style={{
              opacity: headline2Progress,
              transform: `translateX(${(1 - headline2Progress) * -40}px)`,
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.2em", color: PALETTE.signalOrange, marginBottom: 6 }}>
              ● THE INFLECTION
            </div>
            <h2
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: isWide ? 54 : 44,
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1.08,
                margin: 0,
                color: PALETTE.signalOrange,
              }}
            >
              THEN THE WORLD MOVED ON.
            </h2>
          </div>
        </div>

        {/* Central Moving BlackBerry Device */}
        <div
          style={{
            position: "absolute",
            transform: `translate(${phoneX}px, 0px) scale(${phoneScale * (isWide ? 1.05 : 0.95)})`,
            zIndex: 20,
          }}
        >
          <BlackBerryDevice screenContent="bbm" isTyping={frame > 40 && frame < 120} />
        </div>

        {/* Geometric Blue Transformation Shape (Reveals at end of Scene 1) */}
        {blueShapeScale > 0.01 && (
          <div
            style={{
              position: "absolute",
              right: isWide ? "10%" : "5%",
              bottom: isWide ? "10%" : "6%",
              width: 140 * blueShapeScale,
              height: 140 * blueShapeScale,
              backgroundColor: PALETTE.paleBlue,
              border: `2px solid ${PALETTE.electricCobalt}`,
              borderRadius: 16,
              transform: `rotate(${blueShapeScale * 45}deg)`,
              opacity: blueShapeScale,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <span style={{ fontSize: 24, fontWeight: 800, color: PALETTE.electricCobalt, transform: `rotate(-${blueShapeScale * 45}deg)` }}>
              20%
            </span>
          </div>
        )}
      </div>
    </SwissGrid>
  );
};
