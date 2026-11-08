import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, MONO } from "../../config/coinbase";

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const snap = Easing.bezier(0.2, 0.9, 0.24, 1.16);

/** Seconds-based local progress helper. */
export const progress = (
  frame: number,
  fps: number,
  startSeconds: number,
  durationSeconds: number,
  easing: (t: number) => number = easeOut,
) =>
  easing(
    clamp((frame / fps - startSeconds) / Math.max(0.001, durationSeconds)),
  );

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number; blend?: CSSProperties["mixBlendMode"] }> = ({
  opacity = 0.055,
  blend = "overlay",
}) => (
  <AbsoluteFill
    style={{
      opacity,
      mixBlendMode: blend,
      pointerEvents: "none",
      zIndex: 30,
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
      background: `radial-gradient(ellipse at 50% 42%, transparent 38%, rgba(0,0,0,${0.48 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.42 * strength}) 0%, transparent 20%, transparent 76%, rgba(0,0,0,${0.55 * strength}) 100%)`,
      zIndex: 25,
    }}
  />
);

export const BackdropGrid: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
}> = ({ opacity = 0.5, size = 90, color = C.lineSoft }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(ellipse at 50% 42%, black 10%, rgba(0,0,0,0.5) 55%, transparent 88%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 42%, black 10%, rgba(0,0,0,0.5) 55%, transparent 88%)",
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
}> = ({ x = "50%", y = "30%", size = 70, color = C.lime, opacity = 0.1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
      zIndex: 0,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Editorial type                                                      */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{
  children: ReactNode;
  color?: string;
  start?: number;
  dot?: boolean;
  style?: CSSProperties;
}> = ({ children, color = C.dim, start = 0, dot = true, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.6);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: FONT,
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.26em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {dot ? (
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: 2,
            background: C.lime,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
      ) : null}
      <span style={{ paddingLeft: dot ? 0 : "0.26em" }}>{children}</span>
    </div>
  );
};

/**
 * One line of kinetic type rising inside a clipping mask. The signature move.
 */
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
  duration = 0.86,
  style,
  innerStyle,
  rise = 115,
  exitAt,
  exitDuration = 0.4,
  exitRise = -40,
}) => {
  const { frame, fps } = useTime();
  const inP = progress(frame, fps, start, duration);
  const outP =
    exitAt === undefined
      ? 0
      : progress(frame, fps, exitAt, exitDuration, easeIn);
  return (
    <div
      style={{
        overflow: "hidden",
        paddingBottom: "0.1em",
        marginBottom: "-0.1em",
        ...style,
      }}
    >
      <div
        style={{
          transform: `translate3d(0, ${(1 - inP) * rise + outP * exitRise}%, 0)`,
          opacity: Math.min(1, inP * 1.7) * (1 - outP),
          willChange: "transform",
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
  exitAt?: number;
  exitDuration?: number;
}> = ({
  children,
  start,
  duration = 0.7,
  y = 16,
  x = 0,
  scaleFrom = 1,
  style,
  exitAt,
  exitDuration = 0.4,
}) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, duration);
  const out =
    exitAt === undefined
      ? 0
      : progress(frame, fps, exitAt, exitDuration, easeIn);
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
  return (
    <div
      style={{
        height: thickness,
        background: color,
        width: `${p * 100}%`,
        ...style,
      }}
    />
  );
};

export const Tag: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  style?: CSSProperties;
}> = ({ children, color = C.lime, background = C.limeSoft, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "7px 11px",
      borderRadius: 3,
      border: `1px solid ${color}33`,
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
}> = ({ children, color = C.mute, size = 12, style }) => (
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
}> = ({ color = C.lime, size = 6, style }) => (
  <span
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: color,
      display: "inline-block",
      flexShrink: 0,
      ...style,
    }}
  />
);

/** A small animated equaliser used as a quiet "system is alive" motif. */
export const ActivityBars: React.FC<{
  color?: string;
  width?: number;
  height?: number;
  bars?: number;
  start?: number;
  style?: CSSProperties;
}> = ({
  color = C.lime,
  width = 46,
  height = 16,
  bars = 5,
  start = 0,
  style,
}) => {
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
              Math.sin(t * (2.2 + i * 0.35) + i * 1.3) *
                Math.cos(t * 1.15 + i * 0.6),
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
