import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../../config/blackberry";
import { SwissGrid } from "../SwissGrid";
import { BlackBerryDevice } from "../BlackBerryDevice";
import { TouchscreenDevice } from "../TouchscreenDevice";

export const Scene3IndustryChanges: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Timing inside Scene 3 (360 frames total):
  // 0-60: Split screen comparison locks in at 50/50 balance
  // 60-180: Product philosophies comparison (keyboard vs touch)
  // 180-320: Touchscreen side gradually expands from 50% to 68%, old side contracts
  const enterProgress = interpolate(frame, [0, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Split position: starts at 50%, shifts to 34% (so touchscreen occupies 66%!)
  const splitPos = interpolate(frame, [160, 290], [50, isWide ? 34 : 30], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const touchAppHighlight = frame > 120 ? (frame > 220 ? "Safari" : "Mail") : undefined;

  return (
    <SwissGrid title="THE INDUSTRY CHANGES" category="03 / SHIFTING PARADIGMS" timeCode="00:19 – 00:31" isWide={isWide}>
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Top Editorial Headline Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            margin: "12px 0 16px",
            opacity: enterProgress,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: PALETTE.signalOrange,
                marginBottom: 4,
              }}
            >
              ● TWO OPPOSING PHILOSOPHIES
            </div>
            <h1
              style={{
                fontSize: isWide ? 40 : 36,
                fontWeight: 800,
                letterSpacing: "-0.03em",
                margin: 0,
                lineHeight: 1.1,
                color: PALETTE.inkBlack,
              }}
            >
              {splitPos < 42 ? "TO TOUCHSCREENS & APPS." : "FROM KEYBOARDS..."}
            </h1>
          </div>

          <div
            style={{
              padding: "6px 14px",
              background: splitPos < 42 ? PALETTE.electricCobalt : PALETTE.inkBlack,
              color: "#FFF",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            {splitPos < 42 ? "EXPANDING TOUCH ECOSYSTEM" : "THE MARKET WAS CHANGING"}
          </div>
        </div>

        {/* Split Screen Stage */}
        <div
          style={{
            flex: 1,
            display: "flex",
            position: "relative",
            background: "#FFFFFF",
            border: `1.5px solid ${PALETTE.border}`,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 16px 48px rgba(23, 23, 23, 0.05)",
          }}
        >
          {/* Left Panel: The Old Standard (Physical Keyboard) */}
          <div
            style={{
              width: `${splitPos}%`,
              height: "100%",
              background: "#FBFBFA",
              borderRight: `2px solid ${PALETTE.border}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isWide ? 24 : 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Header Tag */}
            <div
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                fontSize: isWide ? 11 : 9,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: PALETTE.neutralGrey,
                textTransform: "uppercase",
              }}
            >
              01 / PHYSICAL TYPING
            </div>

            {/* Device */}
            <div
              style={{
                transform: `scale(${isWide ? (splitPos < 40 ? 0.65 : 0.78) : splitPos < 40 ? 0.5 : 0.6})`,
                transformOrigin: "center center",
              }}
            >
              <BlackBerryDevice screenContent="email" />
            </div>

            {/* Attributes list */}
            {splitPos > 36 && (
              <div
                style={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  fontSize: isWide ? 11 : 9,
                  fontWeight: 600,
                  color: PALETTE.neutralGrey,
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                <div>✓ 35 Ergonomic Hardware Keys</div>
                <div>✓ Fixed Screen Ratio (4:3)</div>
                <div>✓ Business Email &amp; Text First</div>
              </div>
            )}
          </div>

          {/* Right Panel: The New Standard (Full Touchscreen & App Grid) */}
          <div
            style={{
              width: `${100 - splitPos}%`,
              height: "100%",
              background: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: isWide ? 24 : 12,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Header Tag */}
            <div
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                fontSize: isWide ? 11 : 9,
                fontWeight: 800,
                letterSpacing: "0.14em",
                color: PALETTE.electricCobalt,
                textTransform: "uppercase",
              }}
            >
              02 / MULTI-TOUCH ECOSYSTEM (IPHONE &amp; ANDROID)
            </div>

            {/* Device */}
            <div
              style={{
                transform: `scale(${isWide ? (splitPos < 40 ? 0.88 : 0.78) : splitPos < 40 ? 0.72 : 0.6})`,
                transformOrigin: "center center",
              }}
            >
              <TouchscreenDevice activeApp={touchAppHighlight} />
            </div>

            {/* Attributes list */}
            <div
              style={{
                position: "absolute",
                bottom: 16,
                left: 20,
                right: 20,
                fontSize: isWide ? 12 : 10,
                fontWeight: 700,
                color: PALETTE.electricCobalt,
                display: "flex",
                justifyContent: "space-around",
                background: "rgba(36, 87, 255, 0.06)",
                padding: "8px 12px",
                borderRadius: 8,
              }}
            >
              <div>✦ Full-Surface Touch</div>
              <div>✦ App Store Platform</div>
              <div>✦ Rich Multimedia Web</div>
            </div>
          </div>

          {/* Center Dividing Line Handle */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${splitPos}%`,
              width: 4,
              backgroundColor: PALETTE.electricCobalt,
              transform: "translateX(-2px)",
              zIndex: 30,
              boxShadow: "0 0 12px rgba(36, 87, 255, 0.4)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 24,
                height: 24,
                borderRadius: "50%",
                backgroundColor: PALETTE.electricCobalt,
                border: "2px solid #FFF",
                boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#FFF",
                fontSize: 10,
                fontWeight: 800,
              }}
            >
              ⇋
            </div>
          </div>
        </div>
      </div>
    </SwissGrid>
  );
};
