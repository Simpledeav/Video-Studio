import React from "react";
import { PALETTE } from "../../config/blackberry";

export type TouchscreenDeviceProps = {
  scale?: number;
  activeApp?: string;
  style?: React.CSSProperties;
};

export const TouchscreenDevice: React.FC<TouchscreenDeviceProps> = ({
  scale = 1.0,
  activeApp,
  style,
}) => {
  const width = 360;
  const height = 580;

  const apps = [
    { name: "Phone", icon: "📞", color: "#34C759" },
    { name: "Mail", icon: "✉️", color: "#007AFF" },
    { name: "Safari", icon: "🧭", color: "#007AFF" },
    { name: "iPod", icon: "🎵", color: "#FF9500" },
    { name: "Maps", icon: "🗺️", color: "#5856D6" },
    { name: "Weather", icon: "☀️", color: "#32ADE6" },
    { name: "Notes", icon: "📝", color: "#FFCC00" },
    { name: "Stocks", icon: "📈", color: "#1C1C1E" },
    { name: "Camera", icon: "📷", color: "#8E8E93" },
    { name: "Photos", icon: "🖼️", color: "#FF2D55" },
    { name: "YouTube", icon: "▶️", color: "#FF3B30" },
    { name: "Settings", icon: "⚙️", color: "#8E8E93" },
  ];

  return (
    <div
      style={{
        width: width * scale,
        height: height * scale,
        position: "relative",
        transformOrigin: "center center",
        filter: "drop-shadow(0 28px 48px rgba(36, 87, 255, 0.18)) drop-shadow(0 8px 16px rgba(23, 23, 23, 0.08))",
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
          borderRadius: 48,
          background: "linear-gradient(180deg, #1C1C1E 0%, #0A0A0C 100%)",
          border: "4px solid #C4C4C6",
          boxShadow: "inset 0 0 0 2px #555, inset 0 2px 4px rgba(255,255,255,0.4), 0 0 0 1px #888",
          boxSizing: "border-box",
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          fontFamily: '"Poppins", sans-serif',
          color: "#fff",
          userSelect: "none",
        }}
      >
        {/* Top Speaker Slot & Camera */}
        <div style={{ height: 16, display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 12 }}>
          <div
            style={{
              width: 50,
              height: 4,
              borderRadius: 2,
              backgroundColor: "#2C2C2E",
              boxShadow: "inset 0 1px 2px rgba(0,0,0,0.8)",
            }}
          />
        </div>

        {/* Large Touchscreen Display (Occupies 78% of the surface!) */}
        <div
          style={{
            flex: 1,
            borderRadius: 16,
            background: "radial-gradient(ellipse at center, #1E293B 0%, #0F172A 100%)",
            border: "1px solid #334155",
            boxShadow: "inset 0 2px 8px rgba(0,0,0,0.8)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* iOS Top Status Bar */}
          <div
            style={{
              height: 22,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0 12px",
              fontSize: 10,
              fontWeight: 600,
              color: "#FFF",
              background: "rgba(0,0,0,0.4)",
            }}
          >
            <span>AT&T 3G</span>
            <span>9:41 AM</span>
            <span>🔋 100%</span>
          </div>

          {/* App Icons Grid (4 columns x 3 rows) */}
          <div
            style={{
              flex: 1,
              padding: "16px 14px",
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gridTemplateRows: "repeat(3, 1fr)",
              gap: "14px 10px",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            {apps.map((app) => {
              const isTarget = activeApp === app.name;
              return (
                <div
                  key={app.name}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    transform: isTarget ? "scale(1.15)" : "scale(1)",
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      backgroundColor: app.color,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 22,
                      boxShadow: isTarget
                        ? `0 0 16px ${PALETTE.electricCobalt}, 0 4px 8px rgba(0,0,0,0.5)`
                        : "0 3px 6px rgba(0,0,0,0.35)",
                      border: "1px solid rgba(255,255,255,0.25)",
                    }}
                  >
                    {app.icon}
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 500, color: "#E2E8F0" }}>{app.name}</span>
                </div>
              );
            })}
          </div>

          {/* Dock at bottom of screen */}
          <div
            style={{
              height: 60,
              background: "linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)",
              borderTop: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              padding: "0 10px",
            }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#34C759", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 }}>📞</div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#007AFF", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 }}>✉️</div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#007AFF", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 }}>🧭</div>
            <div style={{ width: 44, height: 44, borderRadius: 10, background: "#FF9500", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 20 }}>🎵</div>
          </div>
        </div>

        {/* Circular Hardware Home Button */}
        <div style={{ height: 54, display: "flex", justifyContent: "center", alignItems: "center", marginTop: 8 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "radial-gradient(circle, #1E1E20 0%, #0A0A0C 90%)",
              border: "1.5px solid #444",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                border: "1.5px solid #888",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
