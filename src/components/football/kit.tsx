import type { CSSProperties, ReactNode } from "react";
import { Easing, Img, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FC, FONT, MONO } from "../../config/football";

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const snap = Easing.bezier(0.2, 0.9, 0.24, 1.16);

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

export const progress = (
  t: number,
  start: number,
  duration: number,
  easing: (value: number) => number = easeOut,
) => easing(clamp((t - start) / Math.max(0.001, duration)));

export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
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
  </div>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 50% 42%, transparent 30%, rgba(0,0,0,${0.5 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.46 * strength}) 0%, transparent 20%, transparent 74%, rgba(0,0,0,${0.66 * strength}) 100%)`,
      zIndex: 80,
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
}> = ({ x = "50%", y = "30%", size = 70, color = FC.cyan, opacity = 0.1, zIndex = 0 }) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
      zIndex,
    }}
  />
);

export const Scanlines: React.FC<{ opacity?: number; spacing?: number }> = ({
  opacity = 0.045,
  spacing = 4,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent ${spacing}px)`,
      opacity,
      mixBlendMode: "overlay",
      zIndex: 85,
    }}
  />
);

export const Beam: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({ start = 0, duration = 1.6, color = FC.white, opacity = 0.1, angle = 16 }) => {
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
        width: 300,
        background: `linear-gradient(90deg, transparent, ${color}44, transparent)`,
        transform: `rotate(${angle}deg)`,
        filter: "blur(22px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 70,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Broadcast type                                                      */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{
  children: ReactNode;
  color?: string;
  rule?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ children, color = FC.silver, rule = FC.gold, start = 0, style }) => {
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
        letterSpacing: "0.21em",
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
  rise?: number;
  exitAt?: number;
  exitDuration?: number;
}> = ({ children, start, duration = 0.72, style, rise = 112, exitAt, exitDuration = 0.36 }) => {
  const { t } = useTime();
  const inP = progress(t, start, duration);
  const outP = exitAt === undefined ? 0 : progress(t, exitAt, exitDuration, easeIn);
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
          transform: `translate3d(0, ${(1 - inP) * rise - outP * 34}%, 0)`,
          opacity: Math.min(1, inP * 1.8) * (1 - outP),
          willChange: "transform",
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
}> = ({ text, start, stagger = 0.07, style, wordStyle, emphasis = [], emphasisStyle }) => {
  const { t } = useTime();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0 0.24em", ...style }}>
      {text.split(" ").map((word, index) => {
        const p = progress(t, start + index * stagger, 0.48);
        const em = emphasis.some(
          (item) => word.replace(/[^A-Z0-9]/gi, "").toUpperCase() === item,
        );
        return (
          <span key={`${word}-${index}`} style={{ overflow: "hidden", display: "inline-block" }}>
            <span
              style={{
                display: "inline-block",
                transform: `translateY(${(1 - p) * 108}%)`,
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
  style?: CSSProperties;
  exitAt?: number;
}> = ({ children, start, duration = 0.6, y = 18, style, exitAt }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  const out = exitAt === undefined ? 0 : progress(t, exitAt, 0.35, easeIn);
  return (
    <div
      style={{
        opacity: p * (1 - out),
        transform: `translate3d(0, ${(1 - p) * y}px, 0)`,
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
}> = ({ children, color = FC.cyan, background = FC.cyanSoft, border, style }) => (
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
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: "0.11em",
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
}> = ({ children, color = FC.dim, size = 11, style }) => (
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

export const Hairline: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ start = 0, duration = 0.8, color = FC.line, style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div style={{ height: 1, background: color, width: `${p * 100}%`, ...style }} />
  );
};

export const Dot: React.FC<{
  color?: string;
  size?: number;
  pulse?: boolean;
  style?: CSSProperties;
}> = ({ color = FC.pitchLight, size = 6, pulse = false, style }) => {
  const { t } = useTime();
  return (
    <span
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        display: "inline-block",
        flexShrink: 0,
        boxShadow: `0 0 ${size * 2}px ${color}`,
        opacity: pulse ? 0.7 + Math.sin(t * 6) * 0.3 : 1,
        ...style,
      }}
    />
  );
};

export const Counter: React.FC<{
  value: number;
  start: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  style?: CSSProperties;
}> = ({ value, start, duration = 1.1, decimals = 0, prefix = "", suffix = "", style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <span
      style={{
        fontVariantNumeric: "tabular-nums",
        fontFeatureSettings: '"tnum" 1',
        ...style,
      }}
    >
      {prefix}
      {(value * p).toFixed(decimals)}
      {suffix}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Broadcast chrome                                                    */
/* ------------------------------------------------------------------ */

export const Panel: React.FC<{
  children: ReactNode;
  style?: CSSProperties;
  accent?: string;
  start?: number;
  glow?: boolean;
}> = ({ children, style, accent = FC.line, start = 0, glow = false }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.65);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 8,
        border: `1px solid ${accent}`,
        background:
          "linear-gradient(155deg, rgba(30,35,43,0.94) 0%, rgba(12,14,19,0.97) 58%, rgba(8,10,15,0.99) 100%)",
        boxShadow: glow
          ? "0 34px 90px rgba(0,0,0,0.62), 0 0 90px rgba(0,217,255,0.05)"
          : "0 34px 90px rgba(0,0,0,0.58)",
        overflow: "hidden",
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "linear-gradient(118deg, rgba(255,255,255,0.05) 0%, transparent 34%, transparent 72%, rgba(255,255,255,0.02) 100%)",
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
}> = ({ left, right, accent = FC.cyan, style }) => (
  <div
    style={{
      height: 44,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "0 15px",
      borderBottom: `1px solid ${FC.lineSoft}`,
      background: "rgba(255,255,255,0.014)",
      ...style,
    }}
  >
    <span style={{ display: "flex", gap: 5 }}>
      {[FC.red, FC.gold, FC.pitchLight].map((color, index) => (
        <span
          key={index}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
            opacity: 0.55,
          }}
        />
      ))}
    </span>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.13em",
        color: FC.silver,
        marginLeft: 4,
      }}
    >
      {left}
    </span>
    <div style={{ flex: 1 }} />
    {right ?? <span style={{ width: 1, height: 11, background: accent, opacity: 0.7 }} />}
  </div>
);

export const StatusRow: React.FC<{
  label: string;
  value: string;
  color?: string;
  style?: CSSProperties;
}> = ({ label, value, color = FC.pitchLight, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 12,
      ...style,
    }}
  >
    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", color: FC.mute }}>
      {label}
    </span>
    <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <Dot color={color} size={4} />
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", color }}>
        {value}
      </span>
    </span>
  </div>
);

/** A quick broadcast wipe that covers the hard cut at the head of a scene. */
export const SceneWipe: React.FC<{ color?: string; delay?: number }> = ({
  color = FC.pitch,
  delay = 0,
}) => {
  const { t } = useTime();
  const p = progress(t, delay, 0.42, easeOut);
  if (p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 95,
        pointerEvents: "none",
        background: `linear-gradient(180deg, transparent 0%, ${color} 48%, ${color} 52%, transparent 100%)`,
        transform: `translateY(${(1 - p) * 110 - 5}%)`,
        opacity: 0.5,
        mixBlendMode: "screen",
      }}
    />
  );
};

/** Slow camera push with optional shake. */
export const Camera: React.FC<{
  children: ReactNode;
  from?: number;
  to?: number;
  duration?: number;
  origin?: string;
  shake?: number;
  style?: CSSProperties;
}> = ({ children, from = 1, to = 1.035, duration = 8, origin = "50% 44%", shake = 0, style }) => {
  const { t, frame } = useTime();
  const p = progress(t, 0, duration, (value) => value);
  const sx = shake ? Math.sin(frame * 1.9) * shake : 0;
  const sy = shake ? Math.cos(frame * 2.3) * shake * 0.6 : 0;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translate(${sx}px, ${sy}px) scale(${lerp(from, to, p)})`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Scoreboard: React.FC<{
  left?: string;
  right?: string;
  accent?: string;
  style?: CSSProperties;
  start?: number;
}> = ({ left = "7", right = "0", accent = FC.gold, style, start = 0 }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.5);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "stretch",
        border: `1px solid ${FC.line}`,
        background: "rgba(8,10,15,0.82)",
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        ...style,
      }}
    >
      {[left, right].map((value, index) => (
        <div
          key={index}
          style={{
            minWidth: 54,
            padding: "8px 12px",
            borderRight: index === 0 ? `1px solid ${FC.line}` : undefined,
            textAlign: "center",
            fontFamily: MONO,
            fontSize: 22,
            fontWeight: 600,
            color: index === 0 ? accent : FC.white,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
};

export const Jerseys: React.FC<{ size?: number; opacity?: number }> = ({
  size = 26,
  opacity = 0.5,
}) => (
  <div style={{ display: "flex", gap: 5, opacity }}>
    {[0, 1, 2, 3, 4].map((index) => (
      <span
        key={index}
        style={{
          width: size * 0.62,
          height: size,
          background: index === 0 ? FC.gold : FC.line,
          clipPath:
            "polygon(22% 0, 38% 12%, 62% 12%, 78% 0, 100% 20%, 82% 42%, 78% 32%, 78% 100%, 22% 100%, 22% 32%, 18% 42%, 0 20%)",
        }}
      />
    ))}
  </div>
);

/** Bottom broadcast caption strip — one line, never a paragraph. */
export const LowerThird: React.FC<{
  label: string;
  value: string;
  accent?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ label, value, accent = FC.cyan, start = 0, style }) => (
  <Reveal
    start={start}
    y={14}
    style={{
      position: "absolute",
      left: FR_MARGIN,
      right: FR_MARGIN,
      bottom: 92,
      display: "flex",
      alignItems: "center",
      gap: 14,
      borderTop: `1px solid ${FC.line}`,
      paddingTop: 12,
      ...style,
    }}
  >
    <span
      style={{
        width: 3,
        height: 26,
        background: accent,
        boxShadow: `0 0 14px ${accent}`,
      }}
    />
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: FC.mute }}>
        {label}
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 600,
          letterSpacing: "0.05em",
          color: FC.white,
          marginTop: 3,
        }}
      >
        {value}
      </div>
    </div>
  </Reveal>
);

const FR_MARGIN = 76;
