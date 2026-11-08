import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, MONO } from "../../config/security";

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const snap = Easing.bezier(0.2, 0.9, 0.24, 1.16);

export const progress = (
  frame: number,
  fps: number,
  startSeconds: number,
  durationSeconds: number,
  easing: (t: number) => number = easeOut,
) => easing(clamp((frame / fps - startSeconds) / Math.max(0.001, durationSeconds)));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{
  opacity?: number;
  blend?: CSSProperties["mixBlendMode"];
}> = ({ opacity = 0.055, blend = "overlay" }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: blend, pointerEvents: "none", zIndex: 80 }}>
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
      background: `radial-gradient(ellipse at 50% 42%, transparent 34%, rgba(0,0,0,${0.5 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.38 * strength}) 0%, transparent 18%, transparent 76%, rgba(0,0,0,${0.62 * strength}) 100%)`,
      zIndex: 70,
    }}
  />
);

export const GridField: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
}> = ({ opacity = 0.5, size = 88, color = C.lineSoft }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(ellipse at 50% 42%, black 8%, rgba(0,0,0,0.55) 55%, transparent 88%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 42%, black 8%, rgba(0,0,0,0.55) 55%, transparent 88%)",
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
}> = ({ x = "50%", y = "30%", size = 70, color = C.cyan, opacity = 0.1, zIndex = 0 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
      zIndex,
    }}
  />
);

export const Scanlines: React.FC<{ opacity?: number; spacing?: number }> = ({
  opacity = 0.05,
  spacing = 4,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0.065) 0px, rgba(255,255,255,0.065) 1px, transparent 1px, transparent ${spacing}px)`,
      opacity,
      mixBlendMode: "overlay",
      zIndex: 75,
    }}
  />
);

export const Beam: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({ start = 0, duration = 2.2, color = C.cyan, opacity = 0.12, angle = 18 }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, duration, easeInOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: -400,
        bottom: -400,
        left: `${-35 + p * 140}%`,
        width: 260,
        background: `linear-gradient(90deg, transparent, ${color}55, transparent)`,
        transform: `rotate(${angle}deg)`,
        filter: "blur(18px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
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
}> = ({ children, color = C.silver, rule = C.cyan, start = 0, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.55);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: MONO,
        fontSize: 15,
        fontWeight: 500,
        letterSpacing: "0.2em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
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
          opacity: 0.9,
        }}
      />
      <span style={{ paddingLeft: "0.2em" }}>{children}</span>
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
  exitAt?: number;
  exitDuration?: number;
  exitRise?: number;
}> = ({
  children,
  start,
  duration = 0.82,
  style,
  innerStyle,
  rise = 112,
  exitAt,
  exitDuration = 0.4,
  exitRise = -34,
}) => {
  const { frame, fps } = useTime();
  const inP = progress(frame, fps, start, duration);
  const outP =
    exitAt === undefined ? 0 : progress(frame, fps, exitAt, exitDuration, easeIn);
  return (
    <div
      style={{
        overflow: "hidden",
        paddingBottom: "0.09em",
        marginBottom: "-0.09em",
        ...style,
      }}
    >
      <div
        style={{
          transform: `translate3d(0, ${(1 - inP) * rise + outP * exitRise}%, 0)`,
          opacity: Math.min(1, inP * 1.8) * (1 - outP),
          willChange: "transform",
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
};

export const WordReveal: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  style?: CSSProperties;
  wordStyle?: CSSProperties;
  emphasis?: string[];
  emphasisStyle?: CSSProperties;
}> = ({ text, start, stagger = 0.08, style, wordStyle, emphasis = [], emphasisStyle }) => {
  const { frame, fps } = useTime();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.24em", ...style }}>
      {text.split(" ").map((word, i) => {
        const p = progress(frame, fps, start + i * stagger, 0.5, easeOut);
        const em = emphasis.some(
          (e) => word.replace(/[^A-Z0-9]/gi, "").toUpperCase() === e,
        );
        return (
          <span key={`${word}-${i}`} style={{ overflow: "hidden", display: "inline-block" }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 105}%)`,
                opacity: Math.min(1, p * 1.6),
                ...wordStyle,
                ...(em ? emphasisStyle : null),
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
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
  exitAt?: number;
  exitDuration?: number;
}> = ({
  children,
  start,
  duration = 0.68,
  y = 18,
  x = 0,
  scaleFrom = 1,
  style,
  exitAt,
  exitDuration = 0.4,
}) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, duration);
  const out = exitAt === undefined ? 0 : progress(frame, fps, exitAt, exitDuration, easeIn);
  return (
    <div
      style={{
        opacity: p * (1 - out),
        transform: `translate3d(${(1 - p) * x}px, ${(1 - p) * y}px, 0) scale(${lerp(
          scaleFrom,
          1,
          p,
        )})`,
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
}> = ({ start = 0, duration = 0.8, color = C.line, thickness = 1, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, duration);
  return <div style={{ height: thickness, background: color, width: `${p * 100}%`, ...style }} />;
};

export const Tag: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
  style?: CSSProperties;
}> = ({ children, color = C.cyan, background = C.cyanSoft, border, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "7px 10px",
      borderRadius: 3,
      border: `1px solid ${border ?? `${color}33`}`,
      background,
      color,
      fontFamily: MONO,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.1em",
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
}> = ({ children, color = C.dim, size = 12, style }) => (
  <span
    style={{
      fontFamily: MONO,
      fontSize: size,
      letterSpacing: "0.1em",
      color,
      ...style,
    }}
  >
    {children}
  </span>
);

export const Divider: React.FC<{ color?: string; style?: CSSProperties }> = ({
  color = C.line,
  style,
}) => <div style={{ height: 1, background: color, width: "100%", ...style }} />;

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export const Counter: React.FC<{
  value: number;
  start: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: CSSProperties;
  grouping?: boolean;
}> = ({
  value,
  start,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  style,
  grouping = false,
}) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, duration, easeOut);
  const current = value * p;
  const body = grouping
    ? Math.round(current).toLocaleString("en-US")
    : current.toFixed(decimals);
  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum" 1',
        ...style,
      }}
    >
      {prefix}
      {body}
      {suffix}
    </span>
  );
};

export const Dot: React.FC<{
  color?: string;
  size?: number;
  style?: CSSProperties;
  pulse?: boolean;
}> = ({ color = C.green, size = 7, style, pulse = false }) => {
  const { frame, fps } = useTime();
  const t = frame / fps;
  const glow = pulse ? 0.45 + Math.sin(t * 5) * 0.2 : 0.35;
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
        boxShadow: `0 0 ${size * 1.6}px ${color}${Math.round(glow * 255)
          .toString(16)
          .padStart(2, "0")}`,
        opacity: pulse ? 0.75 + Math.sin(t * 5) * 0.25 : 1,
        ...style,
      }}
    />
  );
};

export const ActivityBars: React.FC<{
  color?: string;
  width?: number;
  height?: number;
  bars?: number;
  start?: number;
  style?: CSSProperties;
}> = ({ color = C.cyan, width = 46, height = 16, bars = 5, start = 0, style }) => {
  const { frame, fps } = useTime();
  const t = frame / fps;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 3,
        width,
        height,
        opacity: progress(frame, fps, start, 0.4),
        ...style,
      }}
    >
      {new Array(bars).fill(0).map((_, i) => {
        const h =
          0.28 +
          0.62 *
            Math.abs(
              Math.sin(t * (2.2 + i * 0.35) + i * 1.3) * Math.cos(t * 1.15 + i * 0.6),
            );
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${Math.min(1, h) * 100}%`,
              background: color,
              borderRadius: 1,
              opacity: 0.35 + i * 0.12,
            }}
          />
        );
      })}
    </div>
  );
};

export const PulseRing: React.FC<{
  x: number;
  y: number;
  size: number;
  color?: string;
  start?: number;
  rings?: number;
  speed?: number;
  opacity?: number;
}> = ({
  x,
  y,
  size,
  color = C.cyan,
  start = 0,
  rings = 3,
  speed = 1,
  opacity = 0.35,
}) => {
  const { frame, fps } = useTime();
  const t = Math.max(0, frame / fps - start);
  return (
    <div
      style={{
        position: "absolute",
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      {new Array(rings).fill(0).map((_, i) => {
        const phase = (t * speed * 0.45 + i / rings) % 1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              border: `1px solid ${color}`,
              opacity: (1 - phase) * opacity,
              transform: `scale(${0.35 + phase * 0.85})`,
            }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Interface chrome                                                    */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
  glow?: boolean;
  start?: number;
}> = ({ children, style, accent = C.line, glow = false, start = 0 }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.68);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 12,
        border: `1px solid ${accent}`,
        background:
          "linear-gradient(160deg, rgba(27,34,44,0.92) 0%, rgba(10,13,18,0.96) 62%, rgba(8,10,14,0.98) 100%)",
        boxShadow: glow
          ? "0 34px 90px rgba(0,0,0,0.6), 0 0 80px rgba(0,217,255,0.04)"
          : "0 34px 90px rgba(0,0,0,0.55)",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.045) 0%, transparent 34%, transparent 70%, rgba(255,255,255,0.02) 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

export const PanelHeader: React.FC<{
  left: ReactNode;
  right?: ReactNode;
  accent?: string;
  style?: CSSProperties;
}> = ({ left, right, accent = C.cyan, style }) => (
  <div
    style={{
      height: 46,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 16px",
      borderBottom: `1px solid ${C.lineSoft}`,
      background: "rgba(255,255,255,0.012)",
      ...style,
    }}
  >
    <span style={{ display: "flex", gap: 6 }}>
      {[C.red, C.orange, C.green].map((color, i) => (
        <span
          key={i}
          style={{ width: 7, height: 7, borderRadius: "50%", background: color, opacity: 0.5 }}
        />
      ))}
    </span>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.12em",
        color: C.silver,
        marginLeft: 4,
      }}
    >
      {left}
    </span>
    <div style={{ flex: 1 }} />
    {right ?? <span style={{ width: 1, height: 12, background: accent, opacity: 0.6 }} />}
  </div>
);

export const StatusRow: React.FC<{
  label: string;
  value: string;
  color?: string;
  mono?: string;
  style?: CSSProperties;
}> = ({ label, value, color = C.green, mono, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      ...style,
    }}
  >
    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", color: C.mute }}>
      {label}
    </span>
    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <Dot color={color} size={5} />
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", color }}>
        {value}
      </span>
      {mono ? <span style={{ fontFamily: MONO, fontSize: 9, color: C.mute }}>{mono}</span> : null}
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Failure / glitch                                                    */
/* ------------------------------------------------------------------ */

export const GlitchText: React.FC<{
  children: string;
  start: number;
  color?: string;
  glitch?: number;
  style?: CSSProperties;
}> = ({ children, start, color = C.white, glitch = 1, style }) => {
  const { frame, fps } = useTime();
  const t = Math.max(0, frame / fps - start);
  const amount = glitch * (0.4 + 0.6 * Math.max(0, 1 - t / 1.4));
  const jitter = Math.sin(t * 43) * 8 * amount;
  const jitter2 = Math.cos(t * 31) * 5 * amount;
  return (
    <div style={{ position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          color: C.red,
          transform: `translate(${jitter}px, ${jitter2}px)`,
          opacity: 0.55 * amount,
          mixBlendMode: "screen",
        }}
      >
        {children}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          color: C.cyan,
          transform: `translate(${-jitter * 0.7}px, ${-jitter2 * 0.8}px)`,
          opacity: 0.45 * amount,
          mixBlendMode: "screen",
        }}
      >
        {children}
      </div>
      <div style={{ position: "relative", color }}>{children}</div>
    </div>
  );
};
