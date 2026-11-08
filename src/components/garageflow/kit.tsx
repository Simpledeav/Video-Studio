import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO } from "../../config/garageflow";

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const snap = Easing.bezier(0.2, 0.9, 0.24, 1.16);

/** Scene-local clock in seconds. */
export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

export const progress = (
  t: number,
  startSeconds: number,
  durationSeconds: number,
  easing: (value: number) => number = easeOut,
) => easing(clamp((t - startSeconds) / Math.max(0.001, durationSeconds)));

export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.05 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 80 }}>
    <Img
      src={staticFile("images/grain.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 70,
      background: `radial-gradient(ellipse at 50% 42%, transparent 30%, rgba(0,0,0,${0.5 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.4 * strength}) 0%, transparent 18%, transparent 74%, rgba(0,0,0,${0.58 * strength}) 100%)`,
    }}
  />
);

export const GridField: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
}> = ({ opacity = 0.5, size = 76, color = C.lineSoft }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(ellipse at 50% 40%, black 8%, rgba(0,0,0,0.5) 60%, transparent 92%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 40%, black 8%, rgba(0,0,0,0.5) 60%, transparent 92%)",
      zIndex: 1,
    }}
  />
);

export const Glow: React.FC<{
  x?: string;
  y?: string;
  size?: number;
  color?: string;
  opacity?: number;
  zIndex?: number;
}> = ({ x = "50%", y = "30%", size = 68, color = C.blue, opacity = 0.13, zIndex = 0 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex,
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
    }}
  />
);

export const Scanlines: React.FC<{ opacity?: number; spacing?: number }> = ({
  opacity = 0.04,
  spacing = 4,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 75,
      backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent ${spacing}px)`,
      opacity,
      mixBlendMode: "overlay",
    }}
  />
);

/** Soft light sweep used on the biggest beat of an act, never every cut. */
export const Sweep: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
}> = ({ start = 0, duration = 1.6, color = C.blue, opacity = 0.1 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration, easeInOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: -240,
        bottom: -240,
        left: `${-40 + p * 150}%`,
        width: 320,
        background: `linear-gradient(90deg, transparent, ${color}55, transparent)`,
        transform: "rotate(14deg)",
        filter: "blur(24px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
};

/**
 * Workshop photography with a consistent cinematic grade: desaturated,
 * low-key, cooled toward the product navy without hiding the real workshop.
 */
export const Photo: React.FC<{
  src: string;
  position?: string;
  brightness?: number;
  saturation?: number;
  drift?: boolean;
  style?: CSSProperties;
  imgStyle?: CSSProperties;
}> = ({
  src,
  position = "50% 50%",
  brightness = 0.68,
  saturation = 0.62,
  drift = true,
  style,
  imgStyle,
}) => {
  const { t } = useTime();
  const scale = drift ? 1.025 + Math.min(0.03, t * 0.0024) : 1.01;
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", ...style }}>
      <Img
        src={staticFile(`images/garageflow/${src}`)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: position,
          filter: `saturate(${saturation}) contrast(1.06) brightness(${brightness})`,
          transform: `scale(${scale})`,
          ...imgStyle,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(4,10,18,0.18) 0%, rgba(4,10,18,0.5) 55%, rgba(4,9,16,0.88) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(18, 58, 112, 0.2)",
          mixBlendMode: "color",
          opacity: 0.8,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Editorial type                                                      */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{
  children: ReactNode;
  color?: string;
  rule?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ children, color = C.silver, rule = C.blue, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.55);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: MONO,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.22em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 9}px)`,
        ...style,
      }}
    >
      <span style={{ width: 30 * p, height: 1, background: rule, display: "inline-block", flexShrink: 0 }} />
      <span style={{ paddingLeft: "0.16em" }}>{children}</span>
    </div>
  );
};

export const MaskLine: React.FC<{
  children: ReactNode;
  start: number;
  duration?: number;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
  rise?: number;
}> = ({ children, start, duration = 0.8, style, innerStyle, rise = 110 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em", ...style }}>
      <div
        style={{
          transform: `translate3d(0, ${(1 - p) * rise}%, 0)`,
          opacity: Math.min(1, p * 1.8),
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Reveal: React.FC<{
  children: ReactNode;
  start: number;
  duration?: number;
  y?: number;
  x?: number;
  scaleFrom?: number;
  style?: CSSProperties;
}> = ({ children, start, duration = 0.62, y = 16, x = 0, scaleFrom = 1, style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div
      style={{
        opacity: p,
        transform: `translate3d(${(1 - p) * x}px, ${(1 - p) * y}px, 0) scale(${lerp(scaleFrom, 1, p)})`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Hairline: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  thickness?: number;
  style?: CSSProperties;
}> = ({ start = 0, duration = 0.7, color = C.line, thickness = 1, style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return <div style={{ height: thickness, background: color, width: `${p * 100}%`, ...style }} />;
};

export const Tag: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
  style?: CSSProperties;
}> = ({ children, color = C.blueBright, background = C.blueSoft, border, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "7px 11px",
      borderRadius: 3,
      border: `1px solid ${border ?? `${color}33`}`,
      background,
      color,
      fontFamily: MONO,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      lineHeight: 1,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Mono: React.FC<{
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}> = ({ children, color = C.muted, size = 12, style }) => (
  <span style={{ fontFamily: MONO, fontSize: size, letterSpacing: "0.1em", color, ...style }}>
    {children}
  </span>
);

export const Numeral: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
}> = ({ children, style }) => (
  <span
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.045em",
      lineHeight: 0.92,
      ...style,
    }}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Brand                                                               */
/* ------------------------------------------------------------------ */

export const GarageFlowMark: React.FC<{ size?: number; style?: CSSProperties }> = ({
  size = 40,
  style,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    style={{ flexShrink: 0, ...style }}
  >
    <defs>
      <linearGradient id="gfMark" x1="4" y1="2" x2="44" y2="46" gradientUnits="userSpaceOnUse">
        <stop stopColor="#5C9DFF" />
        <stop offset="0.52" stopColor="#2E7BFF" />
        <stop offset="1" stopColor="#1450C8" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#gfMark)" />
    <path
      d="M13 17.2h12.6a6.8 6.8 0 0 1 0 13.6h-4.4"
      stroke="#FFFFFF"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path d="M13 30.8h7.1" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
    <circle cx="33.4" cy="17.2" r="2.15" fill="#FFFFFF" />
  </svg>
);

export const GarageFlowLogo: React.FC<{
  size?: number;
  light?: boolean;
  markOnly?: boolean;
  style?: CSSProperties;
}> = ({ size = 28, light = false, markOnly = false, style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: size * 0.34, ...style }}>
    <GarageFlowMark size={size * 1.5} />
    {markOnly ? null : (
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: size,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        <span style={{ color: light ? C.ink : C.white }}>GARAGE</span>
        <span style={{ color: C.blue }}>FLOW</span>
      </div>
    )}
  </div>
);

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */

type IconProps = { size?: number; color?: string; strokeWidth?: number; style?: CSSProperties };

const IconBase: React.FC<IconProps & { children: ReactNode }> = ({
  size = 18,
  color = C.ink2,
  strokeWidth = 1.7,
  style,
  children,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ flexShrink: 0, ...style }}
  >
    {children}
  </svg>
);

export const IconGauge: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 15a8 8 0 1 1 16 0" />
    <path d="M12 15l3.2-3.6" />
    <path d="M4 19h16" />
  </IconBase>
);

export const IconClipboard: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="5" y="4" width="14" height="17" rx="2.2" />
    <path d="M9 4.5V3h6v1.5" />
    <path d="M8.6 10h6.8M8.6 13.6h6.8M8.6 17.2h4.2" />
  </IconBase>
);

export const IconWrench: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M14.8 6.2a4.4 4.4 0 0 0-5.9 5.4L4.4 16.1a2 2 0 0 0 2.8 2.8l4.5-4.5a4.4 4.4 0 0 0 5.4-5.9l-2.7 2.7-2.5-.4-.4-2.5 2.7-2.7Z" />
  </IconBase>
);

export const IconCar: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4.5 14.2 6 9.4A2.4 2.4 0 0 1 8.3 7.8h7.4A2.4 2.4 0 0 1 18 9.4l1.5 4.8" />
    <path d="M4.2 14.2h15.6a1.6 1.6 0 0 1 1.6 1.6v2.4H2.6v-2.4a1.6 1.6 0 0 1 1.6-1.6Z" />
    <circle cx="7.2" cy="18.2" r="1.5" />
    <circle cx="16.8" cy="18.2" r="1.5" />
    <path d="M5.6 11.4h12.8" />
  </IconBase>
);

export const IconCamera: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4 8.6h3l1.4-2h7.2l1.4 2h3v10.2H4Z" />
    <circle cx="12" cy="13.4" r="3.1" />
  </IconBase>
);

export const IconCheck: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M5 12.5 9.6 17 19 7.3" />
  </IconBase>
);

export const IconCard: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.4" />
    <path d="M3 9.5h18" />
    <path d="M6.6 14.8h4.2" />
  </IconBase>
);

export const IconBell: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M7 10.2a5 5 0 0 1 10 0c0 4 1.5 5.2 1.5 5.2h-13S7 14.2 7 10.2Z" />
    <path d="M10.4 18a1.8 1.8 0 0 0 3.2 0" />
  </IconBase>
);

export const IconSearch: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="10.8" cy="10.8" r="5.8" />
    <path d="m15.2 15.2 4.2 4.2" />
  </IconBase>
);

export const IconPhone: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M7.1 4.5 9.4 8l-1.6 2a12 12 0 0 0 6.2 6.2l2-1.6 3.5 2.3-.8 2.1a1.6 1.6 0 0 1-1.7 1.1C10.1 19.4 4.6 13.9 3.9 7a1.6 1.6 0 0 1 1.1-1.7l2.1-.8Z" />
  </IconBase>
);

export const IconCalendar: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="4" y="5.5" width="16" height="15" rx="2.2" />
    <path d="M8 3.6v3.6M16 3.6v3.6M4 9.8h16" />
  </IconBase>
);

export const IconUser: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <circle cx="12" cy="8.2" r="3.4" />
    <path d="M5.4 20c.5-3.6 3.1-5.6 6.6-5.6s6.1 2 6.6 5.6" />
  </IconBase>
);

export const IconArrow: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <path d="M4.5 12h14" />
    <path d="m13.5 6.8 5.2 5.2-5.2 5.2" />
  </IconBase>
);

export const IconLock: React.FC<IconProps> = (p) => (
  <IconBase {...p}>
    <rect x="5.2" y="10" width="13.6" height="10" rx="2.2" />
    <path d="M8.4 10V7.8a3.6 3.6 0 0 1 7.2 0V10" />
  </IconBase>
);

/* ------------------------------------------------------------------ */
/* Product hardware                                                    */
/* ------------------------------------------------------------------ */

export const AppFrame: React.FC<{
  width: number;
  children: ReactNode;
  style?: CSSProperties;
}> = ({ width, children, style }) => {
  const scale = width / 1000;
  return (
    <div
      style={{
        width,
        height: 620 * scale,
        position: "relative",
        borderRadius: 16 * scale,
        overflow: "hidden",
        background: C.graphite,
        boxShadow:
          "0 46px 110px rgba(0,0,0,0.58), 0 10px 28px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.12)",
        ...style,
      }}
    >
      <div
        style={{
          width: 1000,
          height: 620,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          display: "flex",
          flexDirection: "column",
          background: C.paper,
        }}
      >
        <div
          style={{
            height: 34,
            flexShrink: 0,
            background: "linear-gradient(180deg, #131C28 0%, #0B121B 100%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 14px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {["#E8695F", "#E8B45F", "#57C27A"].map((color) => (
            <span key={color} style={{ width: 8, height: 8, borderRadius: "50%", background: color, opacity: 0.85 }} />
          ))}
          <div
            style={{
              marginLeft: 12,
              height: 20,
              flex: 1,
              maxWidth: 330,
              borderRadius: 5,
              background: "rgba(255,255,255,0.055)",
              border: "1px solid rgba(255,255,255,0.055)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "0 9px",
            }}
          >
            <IconLock size={10} color="rgba(245,248,252,0.4)" strokeWidth={2} />
            <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.04em", color: "rgba(245,248,252,0.44)" }}>
              app.garageflow.co.uk
            </span>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
            <span style={{ fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.12em", color: "rgba(245,248,252,0.44)" }}>
              LIVE
            </span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", minHeight: 0 }}>{children}</div>
      </div>
    </div>
  );
};

export const PhoneFrame: React.FC<{
  width: number;
  children: ReactNode;
  style?: CSSProperties;
  glow?: string;
}> = ({ width, children, style, glow = C.blue }) => {
  const bezel = width * 0.026;
  const radius = width * 0.155;
  const innerWidth = width - bezel * 2;
  const scale = innerWidth / 360;
  return (
    <div
      style={{
        width,
        height: width * 2.0,
        position: "relative",
        borderRadius: radius,
        background: "linear-gradient(148deg, #4B5867 0%, #1A222C 26%, #080C12 68%, #354250 100%)",
        padding: bezel,
        boxShadow: `0 42px 90px rgba(0,0,0,0.62), 0 10px 24px rgba(0,0,0,0.45), inset 0 1px 1px rgba(255,255,255,0.34), 0 0 0 1px rgba(255,255,255,0.06), 0 0 60px ${glow}22`,
        ...style,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: radius * 0.86,
          overflow: "hidden",
          position: "relative",
          background: C.paper,
        }}
      >
        <div
          style={{
            width: 360,
            height: 740,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "relative",
          }}
        >
          {children}
        </div>
        <div
          style={{
            position: "absolute",
            top: 9,
            left: "50%",
            transform: "translateX(-50%)",
            width: 92,
            height: 22,
            borderRadius: 12,
            background: "#05080C",
            zIndex: 40,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius * 0.86,
            background:
              "linear-gradient(118deg, rgba(255,255,255,0.06) 0%, transparent 24%, transparent 74%, rgba(255,255,255,0.025) 100%)",
            pointerEvents: "none",
            zIndex: 41,
          }}
        />
      </div>
    </div>
  );
};
