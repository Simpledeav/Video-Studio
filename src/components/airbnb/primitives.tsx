import type { CSSProperties, ReactNode } from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Easing } from "remotion";
import { FONT_STACK, useStage } from "../../config/airbnb";

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Frames -> 0..1 progress with an eased curve. */
export const progress = (
  frame: number,
  startFrame: number,
  durationFrames: number,
  easing: (t: number) => number = easeOut,
) => easing(clamp((frame - startFrame) / Math.max(1, durationFrames)));

export type TextLine = string;

const wordKey = (word: string) => word.replace(/[^A-Za-z0-9'’$%]/g, "").toUpperCase();

/** Renders one line, colouring any word that appears in `accentWords`. */
export const AccentLine: React.FC<{
  text: string;
  accentWords?: string[];
  accentColor: string;
  style?: CSSProperties;
}> = ({ text, accentWords, accentColor, style }) => {
  if (!accentWords || accentWords.length === 0) return <span style={style}>{text}</span>;
  const accents = new Set(accentWords.map((word) => wordKey(word)));
  return (
    <span style={style}>
      {text.split(" ").map((word, index) => {
        const active = accents.has(wordKey(word));
        return (
          <span key={`${word}-${index}`} style={active ? { color: accentColor } : undefined}>
            {word}
            {index < text.split(" ").length - 1 ? " " : ""}
          </span>
        );
      })}
    </span>
  );
};

/**
 * Masked, staggered line reveal. Each line rises inside its own clipping box —
 * the signature editorial move of the film.
 */
export const MaskedLines: React.FC<{
  lines: TextLine[];
  start: number;
  /** Seconds between lines. */
  stagger?: number;
  durationSeconds?: number;
  exitSeconds?: number;
  style?: CSSProperties;
  lineStyle?: CSSProperties;
  accentWords?: string[];
  accentColor?: string;
  align?: "left" | "center" | "right";
  rise?: number;
}> = ({
  lines,
  start,
  stagger = 0.12,
  durationSeconds = 0.85,
  exitSeconds,
  style,
  lineStyle,
  accentWords,
  accentColor = "#FF5A5F",
  align = "left",
  rise = 108,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const exit = exitSeconds
    ? interpolate(t, [exitSeconds, exitSeconds + 0.4], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;

  return (
    <div style={{ textAlign: align, opacity: exit, ...style }}>
      {lines.map((line, index) => {
        const lineStart = start + index * stagger;
        const p = progress(frame, lineStart * fps, durationSeconds * fps);
        return (
          <div
            key={`${line}-${index}`}
            style={{ overflow: "hidden", paddingBottom: "0.06em", marginBottom: "-0.06em" }}
          >
            <div
              style={{
                transform: `translate3d(0, ${(1 - p) * rise}%, 0)`,
                opacity: Math.min(1, p * 1.8),
                willChange: "transform",
                ...lineStyle,
              }}
            >
              <AccentLine text={line} accentWords={accentWords} accentColor={accentColor} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Fades a whole layer in and out relative to a local window. */
export const TimeWindow: React.FC<{
  from: number;
  to: number;
  fadeIn?: number;
  fadeOut?: number;
  children: ReactNode;
  style?: CSSProperties;
  zIndex?: number;
}> = ({ from, to, fadeIn = 0.45, fadeOut = 0.35, children, style, zIndex }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const inP = interpolate(t, [from, from + fadeIn], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const outP = interpolate(t, [to - fadeOut, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const opacity = Math.min(inP, outP);
  if (opacity <= 0.001) return null;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, zIndex, ...style }}>{children}</div>
  );
};

export const Kicker: React.FC<{
  text: string;
  start: number;
  color: string;
  ruleColor?: string;
  size?: number;
  tracking?: number;
  align?: "left" | "center";
  style?: CSSProperties;
}> = ({ text, start, color, ruleColor, size, tracking = 0.26, align = "left", style }) => {
  const { type } = useStage();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = progress(frame, start * fps, 0.7 * fps);
  const rule = progress(frame, start * fps, 0.9 * fps);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        justifyContent: align === "center" ? "center" : "flex-start",
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      <span
        style={{
          width: 26 * rule,
          height: 1,
          backgroundColor: ruleColor ?? color,
          opacity: 0.7,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: FONT_STACK,
          fontSize: size ?? type.kicker,
          fontWeight: 600,
          letterSpacing: `${tracking}em`,
          textTransform: "uppercase",
          color,
          whiteSpace: "nowrap",
          lineHeight: 1.2,
        }}
      >
        {text}
      </span>
    </div>
  );
};

export const Rule: React.FC<{ progress: number; color: string; width: number; height?: number }> = ({
  progress: p,
  color,
  width,
  height = 1,
}) => (
  <div style={{ width: width * p, height, backgroundColor: color, opacity: 0.55 }} />
);

export type Grade = "warm" | "cool" | "daylight" | "night" | "flat" | "faded" | "interior";

const GRADES: Record<Grade, string> = {
  warm: "brightness(0.62) contrast(1.12) saturate(0.82) sepia(0.14) hue-rotate(-8deg)",
  cool: "brightness(0.48) contrast(1.2) saturate(0.55) hue-rotate(8deg)",
  night: "brightness(0.4) contrast(1.22) saturate(0.5)",
  daylight: "brightness(0.92) contrast(1.04) saturate(0.96)",
  flat: "brightness(0.7) contrast(0.86) saturate(0.6)",
  faded: "brightness(0.55) contrast(0.9) saturate(0.42) sepia(0.08)",
  interior: "brightness(0.5) contrast(1.14) saturate(0.86) sepia(0.07) hue-rotate(-4deg)",
};

/**
 * Graded photographic plate with a slow Ken Burns move, light wraps and a
 * bottom scrim so type always sits on a readable bed.
 */
export const PhotoPlate: React.FC<{
  src: string;
  from: number;
  to: number;
  objectPosition?: string;
  grade?: Grade;
  scaleFrom?: number;
  scaleTo?: number;
  opacity?: number;
  blur?: number;
  scrim?: "bottom" | "top" | "both" | "none";
  light?: string;
  fit?: "cover" | "contain";
  style?: CSSProperties;
}> = ({
  src,
  from,
  to,
  objectPosition = "50% 50%",
  grade = "warm",
  scaleFrom = 1.02,
  scaleTo = 1.1,
  opacity = 1,
  blur = 0,
  scrim = "both",
  light,
  fit = "cover",
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < from - 0.1 || t > to + 0.1) return null;
  const local = clamp((t - from) / Math.max(0.001, to - from));
  const scale = scaleFrom + (scaleTo - scaleFrom) * easeInOut(local);
  const fadeIn = interpolate(t, [from, from + 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fadeOut = interpolate(t, [to - 0.5, to], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        opacity: Math.min(fadeIn, fadeOut) * opacity,
        ...style,
      }}
    >
      {fit === "contain" ? (
        <Img
          src={staticFile(src)}
          style={{
            position: "absolute",
            inset: -80,
            width: "calc(100% + 160px)",
            height: "calc(100% + 160px)",
            objectFit: "cover",
            objectPosition,
            filter: `brightness(0.22) saturate(0.5) blur(26px)`,
            transform: "scale(1.05)",
          }}
        />
      ) : null}
      <Img
        src={staticFile(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: fit,
          objectPosition,
          transform: `scale(${scale}) translate3d(0,0,0)`,
          filter: `${GRADES[grade]}${blur ? ` blur(${blur}px)` : ""}`,
          willChange: "transform",
          boxShadow: fit === "contain" ? "0 40px 120px rgba(0,0,0,0.8)" : undefined,
        }}
      />
      {light ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: light,
            mixBlendMode: "screen",
            opacity: 0.5,
          }}
        />
      ) : null}
      {scrim === "bottom" || scrim === "both" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(20,18,16,0.55) 0%, rgba(20,18,16,0.05) 32%, rgba(20,18,16,0.25) 62%, rgba(20,18,16,0.9) 100%)",
          }}
        />
      ) : null}
      {scrim === "top" || scrim === "both" ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(0deg, transparent 40%, rgba(16,14,12,0.45) 100%)",
          }}
        />
      ) : null}
    </div>
  );
};

/** Warm practical light pool, used for tables, doorways and rooms. */
export const LightPool: React.FC<{
  x: number;
  y: number;
  size: number;
  color: string;
  intensity?: number;
  blur?: number;
}> = ({ x, y, size, color, intensity = 0.55, blur = 80 }) => (
  <div
    style={{
      position: "absolute",
      left: `calc(${x}% - ${size / 2}px)`,
      top: `calc(${y}% - ${size / 2}px)`,
      width: size,
      height: size,
      borderRadius: "50%",
      background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
      opacity: intensity,
      filter: `blur(${blur}px)`,
      pointerEvents: "none",
    }}
  />
);

export const Vignette: React.FC<{ strength?: number; color?: string }> = ({
  strength = 0.55,
  color = "0,0,0",
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      pointerEvents: "none",
      background: `radial-gradient(ellipse at 50% 46%, transparent 34%, rgba(${color},${strength * 0.55}) 76%, rgba(${color},${strength}) 100%)`,
    }}
  />
);

/** Frame-accurate counting number with tabular figures. */
export const NumberTicker: React.FC<{
  from: number;
  to: number;
  start: number;
  end: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: boolean;
  style?: CSSProperties;
}> = ({ from, to, start, end, decimals = 0, prefix = "", suffix = "", separator = true, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const p = easeInOut(clamp((t - start) / Math.max(0.001, end - start)));
  const value = from + (to - from) * p;
  const fixed = value.toFixed(decimals);
  const formatted = separator
    ? fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    : fixed;
  return (
    <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

/**
 * Film grain that drifts one pixel per frame so the texture never looks frozen.
 * Kept to a single blended layer for Intel-GPU-friendly playback.
 */
export const FilmGrain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const x = (frame * 37) % 160;
  const y = (frame * 53) % 160;
  return (
    <div
      style={{
        position: "absolute",
        inset: -160,
        width: width + 320,
        height: height + 320,
        transform: `translate3d(${-x}px, ${-y}px, 0)`,
        opacity,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <Img
        src={staticFile("images/grain.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }}
      />
    </div>
  );
};
