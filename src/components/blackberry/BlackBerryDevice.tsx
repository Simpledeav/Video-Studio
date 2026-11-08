import React from "react";
import { PALETTE } from "../../config/blackberry";

export type BlackBerryDeviceProps = {
  scale?: number;
  highlightKey?: string;
  isTyping?: boolean;
  screenContent?: "bbm" | "market" | "email" | "quote" | "security";
  style?: React.CSSProperties;
};

export const BlackBerryDevice: React.FC<BlackBerryDeviceProps> = ({
  scale = 1.0,
  highlightKey,
  isTyping = false,
  screenContent = "bbm",
  style,
}) => {
  const width = 360;
  const height = 580;

  // 35-key keyboard definition
  const row1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
  const row2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L", "del"];
  const row3 = ["alt", "Z", "X", "C", "V", "B", "N", "M", "$", "enter"];

  const altMap: Record<string, string> = {
    W: "1",
    E: "2",
    R: "3",
    S: "4",
    D: "5",
    F: "6",
    Z: "7",
    X: "8",
    C: "9",
  };

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        position: "relative",
        transformOrigin: "center center",
        filter: "drop-shadow(0 28px 48px rgba(23, 23, 23, 0.16)) drop-shadow(0 8px 16px rgba(23, 23, 23, 0.08))",
        ...style,
      }}
    >
      <div
        style={{
          width,
          height,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "relative",
          borderRadius: 44,
          background: "linear-gradient(180deg, #2A2A2A 0%, #151515 40%, #0F0F0F 100%)",
          border: "4px solid #D8D8D8",
          boxShadow: "inset 0 0 0 2px #444, inset 0 2px 4px rgba(255,255,255,0.4), 0 0 0 1px #888",
          boxSizing: "border-box",
          padding: "20px 22px 24px",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Poppins", sans-serif',
          color: "#fff",
          userSelect: "none",
        }}
      >
        {/* Top Header: Earpiece & Status LED */}
        <div style={{ position: "relative", height: 26, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {/* Chrome Earpiece Speaker Grille */}
          <div
            style={{
              width: 58,
              height: 5,
              borderRadius: 3,
              background: "linear-gradient(180deg, #A0A0A0 0%, #E8E8E8 50%, #707070 100%)",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8), 0 1px 1px rgba(255,255,255,0.3)",
            }}
          />
          {/* Classic BlackBerry Status LED (Pulsing Red) */}
          <div
            style={{
              position: "absolute",
              right: 20,
              top: 8,
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: PALETTE.signalOrange,
              boxShadow: `0 0 8px ${PALETTE.signalOrange}, 0 0 2px #FFF`,
              opacity: 0.9,
            }}
          />
        </div>

        {/* Wordmark beneath earpiece */}
        <div
          style={{
            textAlign: "center",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.22em",
            color: "#A5A5A5",
            marginBottom: 8,
          }}
        >
          BlackBerry
        </div>

        {/* Color Screen */}
        <div
          style={{
            width: "100%",
            height: 205,
            borderRadius: 8,
            backgroundColor: "#0D1117",
            border: "2px solid #222",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.9)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Status Bar */}
          <div
            style={{
              height: 22,
              backgroundColor: "#161B22",
              borderBottom: "1px solid #30363D",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 10px",
              fontSize: 9,
              fontWeight: 600,
              color: "#8B949E",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: PALETTE.electricCobalt, fontWeight: 700 }}>3G</span>
              <span>📶 5 BARS</span>
            </div>
            <div style={{ color: "#FFF", fontWeight: 700, letterSpacing: "0.05em" }}>12:47</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <span>🔋 94%</span>
            </div>
          </div>

          {/* Screen Body */}
          <div style={{ flex: 1, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            {screenContent === "bbm" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #222", paddingBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: PALETTE.electricCobalt }} />
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#F0F6FC" }}>BBM / Global Team</span>
                  </div>
                  <span style={{ fontSize: 9, color: "#8B949E" }}>Connected</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, margin: "auto 0" }}>
                  <div
                    style={{
                      background: "rgba(36, 87, 255, 0.15)",
                      border: `1px solid ${PALETTE.electricCobalt}`,
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 10,
                      color: "#FFF",
                    }}
                  >
                    <div style={{ fontWeight: 600, color: PALETTE.paleBlue, fontSize: 8, marginBottom: 2 }}>Q3 ENTERPRISE UPDATE</div>
                    <div>&quot;19.9% global smartphone share reached.&quot;</div>
                    <div style={{ textAlign: "right", fontSize: 8, color: PALETTE.paleBlue, marginTop: 2 }}>12:44 · Delivered ✓✓</div>
                  </div>
                  <div
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: 6,
                      padding: "6px 8px",
                      fontSize: 10,
                      color: "#C9D1D9",
                    }}
                  >
                    <div>Full QWERTY hardware keyboard locked.</div>
                  </div>
                </div>
              </>
            )}

            {screenContent === "market" && (
              <div style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <div style={{ fontSize: 9, letterSpacing: "0.14em", color: PALETTE.paleBlue, textTransform: "uppercase" }}>Global Market Share</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: "#FFF", margin: "4px 0" }}>19.9%</div>
                <div style={{ fontSize: 9, color: "#8B949E" }}>2009 Smartphone Unit Sales</div>
              </div>
            )}

            {screenContent === "email" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#FFF" }}>Inbox (3 new)</div>
                <div style={{ background: "#1F242C", borderRadius: 4, padding: "5px 8px", fontSize: 9 }}>
                  <div style={{ fontWeight: 600, color: PALETTE.paleBlue }}>SECURE ENTERPRISE SERVER</div>
                  <div style={{ color: "#8B949E" }}>End-to-end encryption verified.</div>
                </div>
                <div style={{ background: "#161B22", borderRadius: 4, padding: "5px 8px", fontSize: 9 }}>
                  <div style={{ fontWeight: 600, color: "#FFF" }}>BOARD OF DIRECTORS</div>
                  <div style={{ color: "#8B949E" }}>Competitor touchscreen preview...</div>
                </div>
              </div>
            )}

            {screenContent === "quote" && (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF", lineHeight: 1.35 }}>
                  &quot;THE FUTURE IS HERE.&quot;
                </div>
                <div style={{ fontSize: 9, color: PALETTE.paleBlue, marginTop: 6 }}>BLACKBERRY 2009</div>
              </div>
            )}

            {screenContent === "security" && (
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%", textAlign: "center" }}>
                <div style={{ fontSize: 24 }}>🛡️</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: PALETTE.paleBlue, marginTop: 4 }}>QNX & CYBERSECURITY</div>
                <div style={{ fontSize: 8, color: "#8B949E", marginTop: 2 }}>MISSION CRITICAL SOFTWARE</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Bar (Call, Menu, Optical Trackpad, Back, End) */}
        <div
          style={{
            margin: "12px 0 8px",
            height: 38,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 8px",
          }}
        >
          {/* Call Key */}
          <div
            style={{
              width: 38,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(180deg, #2D333B 0%, #1A1F26 100%)",
              border: "1px solid #444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#3FB950",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            📞
          </div>

          {/* Menu Key (7 dots) */}
          <div
            style={{
              width: 34,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(180deg, #2D333B 0%, #1A1F26 100%)",
              border: "1px solid #444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFF",
              fontSize: 10,
              fontWeight: 700,
            }}
          >
            ░░
          </div>

          {/* Optical Trackpad */}
          <div
            style={{
              width: 38,
              height: 32,
              borderRadius: 8,
              background: "radial-gradient(circle, #2A2A2A 0%, #000 90%)",
              border: `2px solid ${PALETTE.electricCobalt}`,
              boxShadow: `0 0 10px rgba(36, 87, 255, 0.45)`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ width: 14, height: 12, borderRadius: 3, backgroundColor: "#FFF", opacity: 0.85 }} />
          </div>

          {/* Back Key */}
          <div
            style={{
              width: 34,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(180deg, #2D333B 0%, #1A1F26 100%)",
              border: "1px solid #444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#FFF",
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            ↩
          </div>

          {/* End Call Key */}
          <div
            style={{
              width: 38,
              height: 26,
              borderRadius: 6,
              background: "linear-gradient(180deg, #2D333B 0%, #1A1F26 100%)",
              border: "1px solid #444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: "#F85149",
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            ⏻
          </div>
        </div>

        {/* Chrome Fret 1 */}
        <div style={{ height: 2, background: "linear-gradient(90deg, #555 0%, #DDD 50%, #555 100%)", margin: "2px 0 4px" }} />

        {/* Physical QWERTY Keyboard */}
        <div style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1, justifyContent: "center" }}>
          {/* Row 1 */}
          <div style={{ display: "flex", gap: 2.5, justifyContent: "center" }}>
            {row1.map((k) => (
              <KeyCap key={k} label={k} alt={altMap[k]} isHighlighted={highlightKey === k || (isTyping && ["E", "R", "T", "Y"].includes(k))} />
            ))}
          </div>

          {/* Chrome Fret 2 */}
          <div style={{ height: 2, background: "linear-gradient(90deg, #555 0%, #DDD 50%, #555 100%)", margin: "1px 0" }} />

          {/* Row 2 */}
          <div style={{ display: "flex", gap: 2.5, justifyContent: "center" }}>
            {row2.map((k) => (
              <KeyCap key={k} label={k} alt={altMap[k]} isHighlighted={highlightKey === k} />
            ))}
          </div>

          {/* Chrome Fret 3 */}
          <div style={{ height: 2, background: "linear-gradient(90deg, #555 0%, #DDD 50%, #555 100%)", margin: "1px 0" }} />

          {/* Row 3 */}
          <div style={{ display: "flex", gap: 2.5, justifyContent: "center" }}>
            {row3.map((k) => (
              <KeyCap key={k} label={k} alt={altMap[k]} isHighlighted={highlightKey === k} />
            ))}
          </div>

          {/* Row 4 (Spacebar row) */}
          <div style={{ display: "flex", gap: 3, justifyContent: "center", marginTop: 2 }}>
            <KeyCap label="aA" width={32} />
            <KeyCap label="0" />
            <KeyCap label="―" width={116} isHighlighted={isTyping} />
            <KeyCap label="sym" width={36} />
            <KeyCap label="↵" width={32} />
          </div>
        </div>
      </div>
    </div>
  );
};

const KeyCap: React.FC<{
  label: string;
  alt?: string;
  width?: number;
  isHighlighted?: boolean;
}> = ({ label, alt, width = 28, isHighlighted = false }) => {
  return (
    <div
      style={{
        width,
        height: 27,
        borderRadius: 4,
        background: isHighlighted
          ? "linear-gradient(180deg, #2457FF 0%, #1538B8 100%)"
          : "linear-gradient(180deg, #2C2C2C 0%, #1A1A1A 60%, #121212 100%)",
        borderTop: isHighlighted ? "1px solid #7399FF" : "1px solid #555",
        boxShadow: isHighlighted
          ? "0 0 10px rgba(36, 87, 255, 0.7), inset 0 1px 1px rgba(255,255,255,0.4)"
          : "inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 2px rgba(0,0,0,0.6)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        boxSizing: "border-box",
      }}
    >
      {alt && (
        <span
          style={{
            position: "absolute",
            top: 1,
            left: 3,
            fontSize: 7,
            fontWeight: 700,
            color: isHighlighted ? "#FFF" : PALETTE.signalOrange,
          }}
        >
          {alt}
        </span>
      )}
      <span
        style={{
          fontSize: label.length > 2 ? 8 : 10,
          fontWeight: 700,
          color: "#FFF",
          letterSpacing: "-0.02em",
          marginTop: alt ? 4 : 0,
        }}
      >
        {label}
      </span>
    </div>
  );
};
