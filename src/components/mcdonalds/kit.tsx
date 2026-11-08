import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO, useStage } from "../../config/mcdonalds";

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

export const file = (path: string) => staticFile(path.replace(/^\//, ""));

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
  <AbsoluteFill
    style={{
      opacity,
      mixBlendMode: "overlay",
      pointerEvents: "none",
      zIndex: 90,
    }}
  >
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
      zIndex: 80,
      background: `radial-gradient(ellipse at 50% 44%, transparent 28%, rgba(0,0,0,${0.52 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.46 * strength}) 0%, transparent 20%, transparent 72%, rgba(0,0,0,${0.68 * strength}) 100%)`,
    }}
  />
);

export const Scratches: React.FC<{ opacity?: number }> = ({ opacity = 0.5 }) => {
  const { width, height } = useVideoConfig();
  const lines = Array.from({ length: 18 }, (_, index) => {
    const x = seeded(index + 3) * width;
    const y = seeded(index + 17) * height;
    const length = 30 + seeded(index + 31) * 260;
    return {
      x,
      y,
      length,
      angle: -34 + seeded(index + 7) * 68,
      alpha: 0.03 + seeded(index + 41) * 0.09,
    };
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", opacity, zIndex: 84 }}>
      {lines.map((line, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: line.x,
            top: line.y,
            width: line.length,
            height: 1,
            background: `rgba(255,255,255,${line.alpha})`,
            transform: `rotate(${line.angle}deg)`,
            transformOrigin: "left center",
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

export const GridField: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
}> = ({ opacity = 0.5, size = 84, color = C.lineSoft }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(ellipse at 50% 42%, black 8%, rgba(0,0,0,0.5) 58%, transparent 90%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 42%, black 8%, rgba(0,0,0,0.5) 58%, transparent 90%)",
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
}> = ({
  x = "50%",
  y = "34%",
  size = 62,
  color = C.yellow,
  opacity = 0.14,
  zIndex = 0,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex,
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
    }}
  />
);

export const Beam: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({ start = 0, duration = 2.2, color = C.yellow, opacity = 0.13, angle = 16 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration, easeInOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: -500,
        bottom: -500,
        left: `${-40 + p * 150}%`,
        width: 280,
        background: `linear-gradient(90deg, transparent, ${color}66, transparent)`,
        transform: `rotate(${angle}deg)`,
        filter: "blur(22px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
};

export const Scanlines: React.FC<{ opacity?: number; spacing?: number }> = ({
  opacity = 0.05,
  spacing = 4,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent ${spacing}px)`,
      opacity,
      mixBlendMode: "overlay",
      zIndex: 75,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Type                                                                */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{
  children: ReactNode;
  color?: string;
  rule?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ children, color = C.silver, rule = C.yellow, start = 0, style }) => {
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
        fontWeight: 500,
        letterSpacing: "0.22em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 9}px)`,
        ...style,
      }}
    >
      <span
        style={{
          width: 34 * p,
          height: 1,
          background: rule,
          display: "inline-block",
          flexShrink: 0,
          opacity: 0.95,
        }}
      />
      <span>{children}</span>
    </div>
  );
};

export const MaskLine: React.FC<{
  children: ReactNode;
  start?: number;
  duration?: number;
  style?: CSSProperties;
}> = ({ children, start = 0, duration = 0.8, style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div style={{ overflow: "hidden", ...style }}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 108}%)`,
          opacity: p > 0.01 ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const Display: React.FC<{
  children: ReactNode;
  size: number;
  color?: string;
  weight?: number;
  tracking?: string;
  lineHeight?: number;
  style?: CSSProperties;
}> = ({
  children,
  size,
  color = C.white,
  weight = 700,
  tracking = "-0.055em",
  lineHeight = 0.9,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: tracking,
      lineHeight,
      color,
      textTransform: "uppercase",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Reveal: React.FC<{
  children: ReactNode;
  start?: number;
  duration?: number;
  y?: number;
  style?: CSSProperties;
}> = ({ children, start = 0, duration = 0.6, y = 14, style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * y}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Tag: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
  style?: CSSProperties;
}> = ({
  children,
  color = C.yellow,
  background = C.yellowSoft,
  border = "rgba(255,199,44,0.28)",
  style,
}) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "8px 12px",
      borderRadius: 4,
      border: `1px solid ${border}`,
      background,
      color,
      fontFamily: MONO,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.18em",
      lineHeight: 1,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Meta: React.FC<{
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}> = ({ children, color = C.muted, size = 10, style }) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: size,
      letterSpacing: "0.16em",
      color,
      lineHeight: 1.5,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Rule: React.FC<{ color?: string; opacity?: number; style?: CSSProperties }> = ({
  color = C.line,
  opacity = 1,
  style,
}) => <div style={{ height: 1, background: color, opacity, ...style }} />;

/* ------------------------------------------------------------------ */
/* Panels                                                              */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  color?: string;
  background?: string;
  padding?: number | string;
  glow?: string;
}> = ({
  children,
  style,
  color = C.line,
  background = "rgba(12, 12, 15, 0.9)",
  padding = 18,
  glow,
}) => (
  <div
    style={{
      border: `1px solid ${color}`,
      borderRadius: 6,
      background,
      padding,
      boxShadow: glow
        ? `0 24px 70px rgba(0,0,0,0.5), 0 0 60px ${glow}`
        : "0 24px 70px rgba(0,0,0,0.45)",
      backdropFilter: "blur(8px)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const PanelHeader: React.FC<{
  title: string;
  status?: string;
  color?: string;
  right?: ReactNode;
}> = ({ title, status, color = C.yellow, right }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      paddingBottom: 11,
      borderBottom: `1px solid ${C.lineSoft}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 10px ${color}`,
        }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.18em",
          color: C.bone,
        }}
      >
        {title}
      </span>
    </div>
    {right ?? (status ? <Tag color={color} background="transparent" border={`${color}44`}>{status}</Tag> : null)}
  </div>
);

/* ------------------------------------------------------------------ */
/* Photography                                                         */
/* ------------------------------------------------------------------ */

export const Photo: React.FC<{
  src: string;
  style?: CSSProperties;
  objectPosition?: string;
  brightness?: number;
  contrast?: number;
  saturation?: number;
  sepia?: number;
}> = ({
  src,
  style,
  objectPosition = "50% 50%",
  brightness = 0.78,
  contrast = 1.08,
  saturation = 0.9,
  sepia = 0.06,
}) => (
  <Img
    src={file(src)}
    style={{
      objectFit: "cover",
      objectPosition,
      filter: `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) sepia(${sepia})`,
      ...style,
    }}
  />
);

export const PhotoScrim: React.FC<{
  from?: "left" | "bottom" | "right";
  strength?: number;
  color?: string;
}> = ({ from = "bottom", strength = 0.9, color = "#050506" }) => {
  const direction =
    from === "left"
      ? "90deg"
      : from === "right"
        ? "270deg"
        : "180deg";
  return (
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `linear-gradient(${direction}, ${color} 0%, rgba(5,5,6,${0.2 * strength}) 46%, transparent 82%)`,
        zIndex: 2,
      }}
    />
  );
};

export const SectionNumber: React.FC<{
  value: string;
  start?: number;
  color?: string;
  size?: number;
  style?: CSSProperties;
}> = ({ value, start = 0, color = C.dim, size = 12, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.5);
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: size,
        letterSpacing: "0.22em",
        color,
        opacity: p,
        ...style,
      }}
    >
      {value}
    </div>
  );
};

/** Shared backdrop for the dark acts. */
export const DarkStage: React.FC<{
  children: ReactNode;
  glowX?: string;
  glowY?: string;
  glowColor?: string;
  glowOpacity?: number;
}> = ({ children, glowX = "72%", glowY = "18%", glowColor = C.yellow, glowOpacity = 0.08 }) => {
  const stage = useStage();
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <Glow x={glowX} y={glowY} color={glowColor} opacity={glowOpacity} size={58} />
      <GridField opacity={0.26} size={stage.wide ? 110 : 86} />
      {children}
      <Vignette strength={1.02} />
      <Grain opacity={0.055} />
      <Scratches opacity={0.4} />
    </AbsoluteFill>
  );
};
