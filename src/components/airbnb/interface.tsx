import type { CSSProperties } from "react";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK, useStage } from "../../config/airbnb";
import { clamp, easeInOut, easeOut, progress } from "./primitives";

const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  border: "1px solid rgba(243,238,229,0.12)",
  borderRadius: 6,
  overflow: "hidden",
  backdropFilter: "blur(6px)",
};

/** Early Airbnb marketplace inside a laptop screen. Deliberately sparse. */
export const MarketplaceUI: React.FC<{
  start: number;
  mode?: "early" | "growth";
  compact?: boolean;
}> = ({ start, mode = "early", compact = false }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const typed = clamp((t - start) / 1.1);
  const url = mode === "early" ? "airbedandbreakfast.com" : "airbnb.com";
  const shown = url.slice(0, Math.ceil(url.length * typed));
  const p = progress(frame, (start + 0.4) * fps, 0.8 * fps);
  const priceIn = progress(frame, (start + 0.9) * fps, 0.6 * fps);
  const bookingPulse = 0.55 + 0.45 * Math.sin((t - start) * 2.2);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "linear-gradient(180deg, #12161C 0%, #0A0D12 100%)",
        fontFamily: FONT_STACK,
        color: "#EDEAE3",
        display: "flex",
        flexDirection: "column",
        padding: compact ? "3.2% 3.6%" : "4% 4.2%",
        gap: "3%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2.5%",
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 4,
          padding: "2% 3%",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />
          ))}
        </div>
        <span style={{ fontSize: compact ? 11 : 13, letterSpacing: "0.02em", opacity: 0.78 }}>
          {shown}
          <span style={{ opacity: 0.5 }}>|</span>
        </span>
      </div>

      <div style={{ display: "flex", gap: "4%", alignItems: "flex-start", opacity: p }}>
        <div style={{ width: "44%", ...cardStyle, border: "none", borderRadius: 4 }}>
          <Img
            src={staticFile(mode === "early" ? "images/airbnb/living-room-flat.jpg" : "images/airbnb/loft-bedroom.jpg")}
            style={{
              width: "100%",
              height: compact ? 78 : 118,
              objectFit: "cover",
              filter: mode === "early" ? "brightness(0.55) contrast(0.9) saturate(0.7)" : "brightness(0.86) saturate(1) contrast(1.04)",
            }}
          />
        </div>
        <div style={{ flex: 1, paddingTop: 2 }}>
          <div style={{ fontSize: compact ? 13 : 16, fontWeight: 600, letterSpacing: "-0.01em" }}>
            Airbed in living room
          </div>
          <div style={{ fontSize: compact ? 10 : 12, opacity: 0.55, marginTop: 3, letterSpacing: "0.02em" }}>
            3 airbeds · 1 shared bath
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 5, marginTop: compact ? 8 : 12, opacity: priceIn }}>
            <span style={{ fontSize: compact ? 19 : 24, fontWeight: 700, letterSpacing: "-0.03em" }}>$80</span>
            <span style={{ fontSize: compact ? 10 : 11, opacity: 0.55 }}>/ night</span>
          </div>
          <div
            style={{
              marginTop: compact ? 8 : 12,
              display: "inline-block",
              background: mode === "early" ? "#FF5A5F" : "#F3EEE5",
              color: mode === "early" ? "#FFF" : "#171717",
              fontSize: compact ? 10 : 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: compact ? "5px 10px" : "7px 12px",
              borderRadius: 3,
            }}
          >
            REQUEST TO BOOK
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid rgba(243,238,229,0.12)",
          paddingTop: "3%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: 0.9,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: mode === "early" ? "#FF5A5F" : "#8FE3B0",
              opacity: mode === "early" ? bookingPulse : 1,
            }}
          />
          <span style={{ fontSize: compact ? 10 : 12, letterSpacing: "0.14em", opacity: 0.7 }}>
            {mode === "early" ? "0 BOOKINGS THIS WEEK" : "1,240 BOOKINGS THIS WEEK"}
          </span>
        </div>
        <span style={{ fontSize: compact ? 9 : 11, letterSpacing: "0.16em", opacity: 0.35 }}>
          {mode === "early" ? "BETA" : "LIVE"}
        </span>
      </div>
    </div>
  );
};

const LISTINGS = [
  { img: "images/airbnb/loft-bedroom.jpg", price: "$145", rating: "4.92" },
  { img: "images/airbnb/living-room-flat.jpg", price: "$96", rating: "4.78" },
  { img: "images/airbnb/air-mattress.jpg", price: "$42", rating: "4.61" },
  { img: "images/airbnb/loft-bedroom.jpg", price: "$210", rating: "4.95" },
  { img: "images/airbnb/living-room-flat.jpg", price: "$68", rating: "4.55" },
  { img: "images/airbnb/air-mattress.jpg", price: "$39", rating: "4.70" },
];

/** Growing collection of listings. */
export const ListingGrid: React.FC<{ start: number; columns?: number; imageHeight?: number }> = ({
  start,
  columns = 2,
  imageHeight = 104,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 14,
        fontFamily: FONT_STACK,
      }}
    >
      {LISTINGS.map((item, i) => {
        const p = progress(frame, (start + i * 0.1) * fps, 0.5 * fps);
        if (t < start + i * 0.1) return <div key={i} />;
        return (
          <div
            key={i}
            style={{
              ...cardStyle,
              opacity: p,
              transform: `translateY(${(1 - p) * 26}px) scale(${0.96 + p * 0.04})`,
            }}
          >
            <div style={{ position: "relative" }}>
              <Img
                src={staticFile(item.img)}
                style={{
                  width: "100%",
                  height: imageHeight,
                  objectFit: "cover",
                  filter: "brightness(0.86) saturate(0.95)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 7,
                  top: 7,
                  background: "rgba(10,9,8,0.72)",
                  border: "1px solid rgba(243,238,229,0.16)",
                  borderRadius: 2,
                  padding: "2px 6px",
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: "#F3EEE5",
                }}
              >
                ★ {item.rating}
              </div>
            </div>
            <div style={{ padding: "9px 10px 10px", display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{item.price}</span>
              <span style={{ fontSize: 9, letterSpacing: "0.16em", color: "#A6A6A6" }}>NIGHT</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Before/after property photography with a moving wipe. */
export const BeforeAfter: React.FC<{ start: number; wipeSeconds?: number }> = ({ start, wipeSeconds = 1.1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const wipe = easeInOut(clamp((t - start) / wipeSeconds));
  const leftWidth = 18 + wipe * 34;
  const flash = interpolate(t, [start - 0.05, start + 0.08, start + 0.5], [0, 0.55, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0 }}>
        <Img
          src={staticFile("images/airbnb/living-room-flat.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "42% 52%",
            filter: "brightness(0.55) contrast(0.86) saturate(0.45)",
          }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(20,18,16,0.35)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          clipPath: `inset(0 0 0 ${leftWidth}%)`,
        }}
      >
        <Img
          src={staticFile("images/airbnb/loft-bedroom.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.95) contrast(1.04) saturate(1.02)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 40%, rgba(20,16,12,0.35) 100%)",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: `${leftWidth}%`,
          top: 0,
          bottom: 0,
          width: 2,
          background: "linear-gradient(180deg, transparent, #F3EEE5, transparent)",
          opacity: 0.9,
          boxShadow: "0 0 24px rgba(255,255,255,0.4)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          top: "17.4%",
          fontFamily: FONT_STACK,
          fontSize: 15,
          letterSpacing: "0.24em",
          fontWeight: 600,
          color: "rgba(243,238,229,0.9)",
          padding: "4px 9px",
          borderRadius: 3,
          background: "rgba(10,9,8,0.45)",
        }}
      >
        BEFORE
      </div>
      <div
        style={{
          position: "absolute",
          right: 18,
          top: "17.4%",
          padding: "4px 9px",
          borderRadius: 3,
          background: "rgba(10,9,8,0.55)",
          fontFamily: FONT_STACK,
          fontSize: 15,
          letterSpacing: "0.24em",
          fontWeight: 600,
          color: "#F3EEE5",
          opacity: clamp((t - start - 0.5) / 0.5),
        }}
      >
        AFTER
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFFFF",
          opacity: flash,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

const MAP_W = 1400;
const MAP_H = 500;
const LAT0 = 74;
const LAT1 = -54;
const project = (lon: number, lat: number) => ({
  x: ((lon + 180) / 360) * MAP_W,
  y: ((LAT0 - lat) / (LAT0 - LAT1)) * MAP_H,
});

type MapCity = {
  name: string;
  lon: number;
  lat: number;
  delay: number;
  dx: number;
  dy: number;
  align: "left" | "right";
};

const CITIES: MapCity[] = [
  { name: "SAN FRANCISCO", lon: -122.42, lat: 37.77, delay: 0, dx: 12, dy: 24, align: "left" as const },
  { name: "NEW YORK", lon: -74.0, lat: 40.71, delay: 0.25, dx: 12, dy: -14, align: "left" as const },
  { name: "LONDON", lon: -0.13, lat: 51.5, delay: 0.55, dx: 10, dy: -18, align: "left" as const },
  { name: "PARIS", lon: 2.35, lat: 48.86, delay: 0.7, dx: 12, dy: 22, align: "left" as const },
  { name: "TOKYO", lon: 139.69, lat: 35.69, delay: 0.95, dx: 12, dy: -14, align: "left" as const },
  { name: "SYDNEY", lon: 151.21, lat: -33.87, delay: 1.15, dx: 12, dy: 18, align: "left" as const },
  { name: "RIO", lon: -43.17, lat: -22.91, delay: 1.3, dx: 12, dy: 26, align: "left" as const },
];

/** Dot-matrix world map with animated travel arcs. */
export const WorldMap: React.FC<{ start: number; opacity?: number }> = ({ start, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const mapIn = progress(frame, start * fps, 1.1 * fps);
  const origin = project(CITIES[0].lon, CITIES[0].lat);
  const { width } = useStage();
  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "45%",
        width: "112%",
        transform: `translate(-50%, -50%) scale(${0.94 + mapIn * 0.06})`,
        opacity: mapIn * opacity,
      }}
    >
      <div style={{ position: "relative", width: "100%" }}>
        <Img src={staticFile("images/airbnb/world-dots.svg")} style={{ width: "100%", display: "block", opacity: 0.85 }} />
        <svg
          viewBox={`0 0 ${MAP_W} ${MAP_H}`}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          {CITIES.slice(1).map((city) => {
            const to = project(city.lon, city.lat);
            const arc = progress(frame, (start + 0.55 + city.delay) * fps, 0.9 * fps);
            const mx = (origin.x + to.x) / 2;
            const my = Math.min(origin.y, to.y) - Math.abs(to.x - origin.x) * 0.22 - 26;
            const path = `M ${origin.x} ${origin.y} Q ${mx} ${my} ${to.x} ${to.y}`;
            return (
              <g key={city.name}>
                <path
                  d={path}
                  fill="none"
                  stroke="#FF5A5F"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  strokeDasharray={1}
                  pathLength={1}
                  strokeDashoffset={1 - arc}
                  opacity={0.75}
                />
                <circle
                  cx={to.x}
                  cy={to.y}
                  r={arc > 0.92 ? 5.5 : 3.2}
                  fill="#F3EEE5"
                  opacity={arc > 0.92 ? 0.95 : 0.5}
                />
              </g>
            );
          })}
          <circle cx={origin.x} cy={origin.y} r={4.5} fill="#FF5A5F" />
        </svg>
        {CITIES.map((city) => {
          const pos = project(city.lon, city.lat);
          const p = progress(frame, (start + 0.5 + city.delay) * fps, 0.6 * fps);
          return (
            <div
              key={city.name}
              style={{
                position: "absolute",
                left: `${(pos.x / MAP_W) * 100}%`,
                top: `${(pos.y / MAP_H) * 100}%`,
                marginLeft: city.dx,
                marginTop: city.dy,
                transform: city.align === "right" ? "translateX(-100%)" : undefined,
                fontFamily: FONT_STACK,
                fontSize: width > 1200 ? 13 : 12,
                fontWeight: 500,
                letterSpacing: "0.18em",
                color: "#F3EEE5",
                opacity: p * 0.72,
                whiteSpace: "nowrap",
                textShadow: "0 1px 10px rgba(0,0,0,0.8)",
              }}
            >
              {city.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Stamp that lands on the first sold box. */
export const SoldStamp: React.FC<{ start: number; label?: string }> = ({ start, label = "SOLD" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const local = frame - start * fps;
  if (local < 0) return null;
  const s = spring({ frame: local, fps, config: { damping: 16, mass: 0.7, stiffness: 190 } });
  const scale = interpolate(s, [0, 1], [2.6, 1]);
  const opacity = clamp(local / (fps * 0.12));
  return (
    <div
      style={{
        transform: `rotate(-9deg) scale(${scale})`,
        opacity,
        border: "3px solid #FF5A5F",
        color: "#FF5A5F",
        padding: "10px 22px",
        fontFamily: FONT_STACK,
        fontWeight: 800,
        fontSize: 44,
        letterSpacing: "0.12em",
        borderRadius: 4,
        textShadow: "0 0 30px rgba(255,90,95,0.35)",
        boxShadow: "0 0 0 1px rgba(255,90,95,0.3), 0 0 40px rgba(255,90,95,0.18)",
      }}
    >
      {label}
    </div>
  );
};

/** Three-mattress floor plan drawn as an editorial diagram. */
export const MattressPlan: React.FC<{ start: number }> = ({ start }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beds = [
    { x: 8, y: 14, label: "AIRBED 01" },
    { x: 46, y: 22, label: "AIRBED 02" },
    { x: 22, y: 58, label: "AIRBED 03" },
  ];
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {beds.map((bed, i) => {
        const p = progress(frame, (start + i * 0.3) * fps, 0.7 * fps);
        return (
          <div
            key={bed.label}
            style={{
              position: "absolute",
              left: `${bed.x}%`,
              top: `${bed.y}%`,
              width: "36%",
              height: "26%",
              border: "1px solid rgba(243,238,229,0.55)",
              borderRadius: 10,
              background: "rgba(243,238,229,0.05)",
              opacity: p * 0.9,
              transform: `scale(${0.92 + p * 0.08})`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 10,
                top: 8,
                right: "58%",
                height: 14,
                border: "1px solid rgba(243,238,229,0.35)",
                borderRadius: 4,
              }}
            />
            <span
              style={{
                position: "absolute",
                left: 10,
                bottom: 8,
                fontFamily: FONT_STACK,
                fontSize: 9,
                letterSpacing: "0.22em",
                color: "rgba(243,238,229,0.72)",
              }}
            >
              {bed.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/** 750 boxes at $40 = $30,000. Decorative tally, clearly not profit. */
export const SalesTally: React.FC<{ start: number; count?: number }> = ({ start, count = 24 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const litCount = Math.max(0, Math.floor((t - start) * 22));
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap", width: 320 }}>
      {Array.from({ length: count }).map((_, i) => {
        const lit = i < litCount;
        return (
          <div
            key={i}
            style={{
              width: 9,
              height: 14,
              borderRadius: 1,
              background: lit ? "#FF5A5F" : "rgba(243,238,229,0.14)",
              opacity: lit ? 0.9 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
};

export const easeInOutClamp = easeInOut;
export const easeOutClamp = easeOut;
