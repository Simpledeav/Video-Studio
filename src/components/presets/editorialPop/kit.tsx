import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
} from "remotion";
import { BRAND, C, FONT, useStage } from "../../../config/presets/editorialPop";

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const snap = Easing.bezier(0.2, 0.9, 0.24, 1.16);

export const useTime = () => {
  const frame = useCurrentFrameSafe();
  const { fps } = useVideoConfigSafe();
  return { frame, fps, t: frame / fps };
};

/* Local aliases keep the kit import surface small. */
import { useCurrentFrame, useVideoConfig } from "remotion";
const useCurrentFrameSafe = useCurrentFrame;
const useVideoConfigSafe = useVideoConfig;

export const progress = (
  t: number,
  startSeconds: number,
  durationSeconds: number,
  easing: (value: number) => number = easeOut,
) => easing(clamp((t - startSeconds) / Math.max(0.001, durationSeconds)));

export const exit = (
  t: number,
  startSeconds: number,
  durationSeconds = 0.32,
  easing: (value: number) => number = easeIn,
) => 1 - easing(clamp((t - startSeconds) / Math.max(0.001, durationSeconds)));

export const seeded = (seed: number): number => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const file = (path: string) => staticFile(path.replace(/^\//, ""));

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 90 }}>
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
      background: `radial-gradient(ellipse at 50% 42%, transparent 34%, rgba(0,0,0,${0.42 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.24 * strength}) 0%, transparent 16%, transparent 78%, rgba(0,0,0,${0.46 * strength}) 100%)`,
    }}
  />
);

export const Halftone: React.FC<{
  color?: string;
  size?: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ color = "rgba(255,255,255,0.24)", size = 16, opacity = 0.32, style }) => (
  <AbsoluteFill
    style={{
      zIndex: 1,
      pointerEvents: "none",
      opacity,
      backgroundImage: `radial-gradient(circle, ${color} 1.1px, transparent 1.5px)`,
      backgroundSize: `${size}px ${size}px`,
      maskImage:
        "radial-gradient(ellipse at 50% 36%, rgba(0,0,0,0.95) 4%, rgba(0,0,0,0.45) 58%, transparent 92%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 36%, rgba(0,0,0,0.95) 4%, rgba(0,0,0,0.45) 58%, transparent 92%)",
      ...style,
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
}> = ({ x = "50%", y = "30%", size = 58, color = C.blue, opacity = 0.3, zIndex = 0 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex,
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
    }}
  />
);

export const Sweep: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({ start = 0, duration = 1.4, color = "#FFFFFF", opacity = 0.18, angle = 12 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration, easeInOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "-30%",
        bottom: "-30%",
        left: `${-70 + p * 210}%`,
        width: "26%",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        transform: `rotate(${angle}deg)`,
        filter: "blur(32px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
};

export const SpeedLines: React.FC<{ start?: number; opacity?: number; color?: string }> = ({
  start = 0,
  opacity = 0.35,
  color = "rgba(255,255,255,0.85)",
}) => {
  const { t } = useTime();
  const p = progress(t, start, 0.9, easeOut);
  const lines = Array.from({ length: 13 }, (_, index) => index);
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 40, opacity: p * opacity }}>
      {lines.map((line) => {
        const y = 90 + line * 138 + seeded(line + 2) * 40;
        const width = 180 + seeded(line + 9) * 520;
        const x = -40 - seeded(line + 4) * 320 + p * 140;
        return (
          <div
            key={line}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width,
              height: 2 + Math.round(seeded(line + 6) * 3),
              borderRadius: 999,
              background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
              transform: `rotate(${-6 + seeded(line) * 12}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const Stage: React.FC<{
  children: ReactNode;
  accent?: string;
  accent2?: string;
  variant?: "blue" | "cream" | "orange" | "purple" | "night";
  glowX?: string;
  glowY?: string;
  style?: CSSProperties;
}> = ({
  children,
  accent = C.blue,
  accent2 = C.yellow,
  variant = "blue",
  glowX = "64%",
  glowY = "26%",
  style,
}) => {
  const palettes: Record<string, string> = {
    blue: `linear-gradient(156deg, #0A57B8 0%, ${C.blue} 36%, ${C.blueDeep} 76%, #00245C 100%)`,
    cream: `linear-gradient(156deg, #FFFDF7 0%, ${C.cream} 48%, #EFDFC2 100%)`,
    orange: `linear-gradient(156deg, #F19A45 0%, ${C.orange} 44%, ${C.orangeDeep} 100%)`,
    purple: `linear-gradient(156deg, #6E4BB0 0%, ${C.purple} 48%, #2A1454 100%)`,
    night: `linear-gradient(156deg, #082D63 0%, ${C.blueInk} 48%, ${C.blueNight} 100%)`,
  };
  return (
    <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.blueInk, ...style }}>
      <AbsoluteFill style={{ background: palettes[variant] }} />
      <Glow x={glowX} y={glowY} size={52} color={accent} opacity={variant === "cream" ? 0.16 : 0.36} />
      <Glow x="12%" y="88%" size={48} color={accent2} opacity={variant === "cream" ? 0.2 : 0.2} />
      <Halftone color={variant === "cream" ? "rgba(7,24,47,0.16)" : "rgba(255,255,255,0.26)"} opacity={variant === "cream" ? 0.28 : 0.26} />
      {children}
      <Grain opacity={0.055} />
      <Vignette strength={0.9} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Brand marks                                                         */
/* ------------------------------------------------------------------ */

export const Spark: React.FC<{ size?: number; style?: CSSProperties }> = ({
  size = 98,
  style,
}) => (
  <Img
    src={file(BRAND.spark)}
    style={{ width: size, height: size * 1.128, objectFit: "contain", display: "block", ...style }}
  />
);

export const Wordmark: React.FC<{
  width?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ width = 230, color = C.white, style }) => (
  <Img
    src={file(BRAND.wordmark)}
    style={{
      width,
      height: "auto",
      display: "block",
      filter: `brightness(0) saturate(100%) ${color === C.white ? "invert(1)" : ""}`,
      ...style,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Editorial type                                                      */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{
  children: ReactNode;
  color?: string;
  rule?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ children, color = C.cream, rule = C.yellow, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.5);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: FONT,
        fontSize: 16,
        fontWeight: 600,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      <span style={{ width: 32 * p, height: 3, background: rule, display: "inline-block", flexShrink: 0 }} />
      <span style={{ paddingLeft: "0.12em" }}>{children}</span>
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
}> = ({ children, start, duration = 0.72, style, innerStyle, rise = 108 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em", marginBottom: "-0.08em", ...style }}>
      <div
        style={{
          transform: `translate3d(0, ${(1 - p) * rise}%, 0)`,
          opacity: Math.min(1, p * 1.7),
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
}> = ({ children, start, duration = 0.55, y = 18, x = 0, scaleFrom = 1, style }) => {
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
  weight = 800,
  tracking = "-0.045em",
  lineHeight = 0.92,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      lineHeight,
      letterSpacing: tracking,
      color,
      textTransform: "uppercase",
      filter: "drop-shadow(0 5px 24px rgba(0,0,0,0.28))",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Headline: React.FC<{
  lines: readonly string[];
  size: number;
  start: number;
  color?: string;
  highlight?: string;
  highlightColor?: string;
  stagger?: number;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({
  lines,
  size,
  start,
  color = C.white,
  highlight,
  highlightColor = C.ink,
  stagger = 0.1,
  align = "left",
  style,
}) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      ...style,
    }}
  >
    {lines.map((line, index) => {
      const isLast = index === lines.length - 1;
      const useHighlight = Boolean(highlight && isLast);
      return (
        <MaskLine key={line} start={start + index * stagger} duration={0.68} rise={110}>
          <div style={{ display: "inline-block", transform: "skewX(-2deg)" }}>
            <Display
              size={size}
              color={useHighlight ? highlightColor : color}
              style={{
                textAlign: align,
                whiteSpace: "nowrap",
                background: useHighlight ? highlight : undefined,
                padding: useHighlight ? "0.04em 0.14em 0.06em" : undefined,
                borderRadius: useHighlight ? 8 : undefined,
                boxShadow: useHighlight ? "0 12px 36px rgba(0,0,0,0.24)" : undefined,
              }}
            >
              {line}
            </Display>
          </div>
        </MaskLine>
      );
    })}
  </div>
);

export const Tag: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ children, color = C.white, background = "rgba(7,24,47,0.42)", border, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.45);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 4,
        border: `1px solid ${border ?? C.line}`,
        background,
        color,
        fontFamily: FONT,
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        lineHeight: 1,
        backdropFilter: "blur(6px)",
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Photography                                                         */
/* ------------------------------------------------------------------ */

export const Photo: React.FC<{
  src: string;
  width?: number | string;
  height?: number | string;
  objectPosition?: string;
  start?: number;
  duration?: number;
  scaleFrom?: number;
  scaleTo?: number;
  grade?: "warm" | "neutral" | "cool" | "vivid";
  overlay?: string;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({
  src,
  width = "100%",
  height = "100%",
  objectPosition = "50% 50%",
  start = 0,
  duration = 1,
  scaleFrom = 1.08,
  scaleTo = 1,
  grade = "warm",
  overlay,
  style,
  children,
}) => {
  const { t } = useTime();
  const p = progress(t, start, duration, easeOut);
  const filters = {
    warm: "grayscale(0.03) contrast(1.06) saturate(1.08) brightness(0.94) sepia(0.05)",
    neutral: "grayscale(0.02) contrast(1.06) saturate(1.0) brightness(0.94)",
    cool: "grayscale(0.04) contrast(1.08) saturate(0.94) brightness(0.9) hue-rotate(-6deg)",
    vivid: "grayscale(0) contrast(1.1) saturate(1.28) brightness(1.0)",
  };
  return (
    <div style={{ width, height, position: "relative", overflow: "hidden", ...style }}>
      <Img
        src={file(src)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition,
          filter: filters[grade],
          transform: `scale(${lerp(scaleFrom, scaleTo, p)})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            overlay ??
            "linear-gradient(180deg, rgba(4,30,66,0.18) 0%, transparent 34%, rgba(4,30,66,0.62) 100%)",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

export const PhotoCard: React.FC<{
  src: string;
  width: number | string;
  height: number | string;
  start?: number;
  rotate?: number;
  radius?: number;
  border?: string;
  objectPosition?: string;
  scaleFrom?: number;
  scaleTo?: number;
  grade?: "warm" | "neutral" | "cool" | "vivid";
  label?: string;
  labelColor?: string;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({
  src,
  width,
  height,
  start = 0,
  rotate = 0,
  radius = 18,
  border = "1px solid rgba(255,255,255,0.22)",
  objectPosition = "50% 50%",
  scaleFrom = 1.14,
  scaleTo = 1,
  grade = "warm",
  label,
  labelColor = C.ink,
  style,
  children,
}) => {
  const { t } = useTime();
  const p = progress(t, start, 0.7, snap);
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        borderRadius: radius,
        overflow: "hidden",
        border,
        boxShadow: "0 34px 90px rgba(0,0,0,0.34)",
        opacity: Math.min(1, p * 1.4),
        transform: `translateY(${(1 - p) * 26}px) rotate(${rotate}deg) scale(${lerp(0.94, 1, p)})`,
        ...style,
      }}
    >
      <Photo
        src={src}
        start={start}
        duration={2.6}
        scaleFrom={scaleFrom}
        scaleTo={scaleTo}
        grade={grade}
        objectPosition={objectPosition}
        height="100%"
        width="100%"
      />
      {label ? (
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 18,
            padding: "9px 13px",
            borderRadius: 4,
            background: C.cream,
            color: labelColor,
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
};

export const ProductCutout: React.FC<{
  src: string;
  width: number;
  start?: number;
  rotate?: number;
  float?: number;
  style?: CSSProperties;
}> = ({ src, width, start = 0, rotate = 0, float = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.65, snap);
  const bob = Math.sin(t * 2.1 + start * 3) * float;
  return (
    <Img
      src={file(src)}
      style={{
        width,
        height: "auto",
        display: "block",
        opacity: Math.min(1, p * 1.5),
        transform: `translateY(${(1 - p) * 30 + bob}px) rotate(${rotate * (1 - p) + rotate}deg) scale(${lerp(0.9, 1, p)})`,
        filter: "drop-shadow(0 42px 54px rgba(0,0,0,0.36))",
        ...style,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Retail props                                                        */
/* ------------------------------------------------------------------ */

export const Barcode: React.FC<{
  height?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}> = ({ height = 54, color = C.ink, opacity = 0.85, style }) => {
  const bars = Array.from({ length: 36 }, (_, index) => index);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", height, opacity, ...style }}>
      {bars.map((bar) => {
        const w = 2 + Math.round(seeded(bar + 3) * 4);
        const gap = 2 + Math.round(seeded(bar + 11) * 3);
        const h = height * (0.62 + seeded(bar + 7) * 0.38);
        const el = (
          <div
            key={bar}
            style={{
              width: w,
              height: h,
              marginRight: gap,
              background: color,
              borderRadius: 0.5,
            }}
          />
        );
        return el;
      })}
    </div>
  );
};

export const PriceTag: React.FC<{
  value: string;
  start?: number;
  size?: number;
  rotate?: string;
  style?: CSSProperties;
}> = ({ value, start = 0, size = 260, rotate = "-8deg", style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.7, snap);
  const spin = progress(t, start, 1.1, easeOut);
  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: size * 1.7,
        padding: `${size * 0.12}px ${size * 0.22}px`,
        background: `linear-gradient(140deg, ${C.yellowSoft}, ${C.yellow})`,
        color: C.ink,
        borderRadius: 18,
        transform: `perspective(900px) rotate(${rotate}) rotateY(${(1 - spin) * 76}deg) scale(${lerp(0.62, 1, p)})`,
        boxShadow: "0 30px 80px rgba(0,0,0,0.36), inset 0 2px 0 rgba(255,255,255,0.7)",
        opacity: Math.min(1, p * 1.7),
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 22,
          top: 22,
          width: 18,
          height: 18,
          borderRadius: 99,
          background: C.blueInk,
          boxShadow: "inset 0 2px 5px rgba(0,0,0,0.5)",
        }}
      />
      <div
        style={{
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 800,
          letterSpacing: "-0.07em",
          lineHeight: 0.9,
          transform: "translateY(-0.02em)",
        }}
      >
        {value}
      </div>
      <div
        style={{
          position: "absolute",
          right: 18,
          top: 16,
          padding: "5px 9px",
          background: C.blue,
          color: C.white,
          borderRadius: 3,
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.16em",
        }}
      >
        WALMART
      </div>
    </div>
  );
};

export const Stamp: React.FC<{
  children: ReactNode;
  start?: number;
  color?: string;
  size?: number;
  rotate?: number;
  style?: CSSProperties;
}> = ({ children, start = 0, color = C.red, size = 74, rotate = -9, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.38, easeIn);
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${size * 0.18}px ${size * 0.32}px`,
        border: `7px solid ${color}`,
        outline: `2px solid ${color}`,
        outlineOffset: 6,
        color,
        fontFamily: FONT,
        fontSize: size,
        fontWeight: 800,
        letterSpacing: "-0.03em",
        textTransform: "uppercase",
        lineHeight: 0.9,
        transform: `rotate(${rotate}deg) scale(${lerp(2.4, 1, p)})`,
        opacity: p,
        textShadow: `0 2px 0 rgba(255,255,255,0.16)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Receipt: React.FC<{
  start?: number;
  style?: CSSProperties;
}> = ({ start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.7, easeOut);
  return (
    <div
      style={{
        width: 620,
        padding: "34px 36px 26px",
        background: "#FFFDF7",
        color: C.ink,
        fontFamily: FONT,
        boxShadow: "0 30px 70px rgba(0,0,0,0.32)",
        clipPath:
          "polygon(0 0, 100% 0, 100% calc(100% - 14px), 97% 100%, 94% calc(100% - 12px), 91% 100%, 88% calc(100% - 12px), 85% 100%, 82% calc(100% - 12px), 79% 100%, 76% calc(100% - 12px), 73% 100%, 70% calc(100% - 12px), 67% 100%, 64% calc(100% - 12px), 61% 100%, 58% calc(100% - 12px), 55% 100%, 52% calc(100% - 12px), 49% 100%, 46% calc(100% - 12px), 43% 100%, 40% calc(100% - 12px), 37% 100%, 34% calc(100% - 12px), 31% 100%, 28% calc(100% - 12px), 25% 100%, 22% calc(100% - 12px), 19% 100%, 16% calc(100% - 12px), 13% 100%, 10% calc(100% - 12px), 7% 100%, 4% calc(100% - 12px), 1% 100%, 0 calc(100% - 14px))",
        transform: `translateY(${(1 - p) * 42}px) rotate(${-2.2 + (1 - p) * 3}deg)`,
        opacity: p,
        ...style,
      }}
    >
      <div style={{ textAlign: "center", fontSize: 15, fontWeight: 700, letterSpacing: "0.24em" }}>
        WALMART
      </div>
      <div style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.18em", opacity: 0.55, marginTop: 5 }}>
        SPARK SHOP · BENTONVILLE, AR
      </div>
      <div style={{ height: 1, background: "rgba(7,24,47,0.22)", margin: "20px 0" }} />
      {[
        ["ROTISSERIE CHICKEN", "$5.97"],
        ["CHICKEN PURSE", "$5.97"],
      ].map(([label, value]) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 600,
            marginBottom: 14,
            letterSpacing: "-0.01em",
          }}
        >
          <span>{label}</span>
          <span style={{ fontWeight: 800 }}>{value}</span>
        </div>
      ))}
      <div style={{ height: 1, background: "rgba(7,24,47,0.22)", margin: "18px 0" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, letterSpacing: "0.16em", fontWeight: 700 }}>SAME PRICE</span>
        <span
          style={{
            fontSize: 13,
            fontWeight: 800,
            background: C.yellow,
            padding: "6px 11px",
            borderRadius: 3,
            letterSpacing: "0.1em",
          }}
        >
          $5.97
        </span>
      </div>
      <div style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
        <Barcode height={48} color={C.ink} opacity={0.8} />
      </div>
      <div style={{ textAlign: "center", fontSize: 10, letterSpacing: "0.22em", marginTop: 9, opacity: 0.5 }}>
        SEPT 01 2026 · 08:00 ET
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Illustration                                                        */
/* ------------------------------------------------------------------ */

export const PurseSketch: React.FC<{
  start?: number;
  width?: number;
  color?: string;
  accent?: string;
  style?: CSSProperties;
}> = ({ start = 0, width = 760, color = C.blueInk, accent = C.purple, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 1.6, easeInOut);
  const dash = 2600;
  return (
    <svg
      viewBox="0 0 760 900"
      width={width}
      style={{ overflow: "visible", ...style }}
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g opacity={0.28} strokeWidth={1}>
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`h${i}`} x1="24" y1={40 + i * 50} x2="736" y2={40 + i * 50} />
        ))}
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={40 + i * 56} y1="20" x2={40 + i * 56} y2="860" />
        ))}
      </g>
      <g
        strokeDasharray={dash}
        strokeDashoffset={dash * (1 - p)}
        stroke={color}
        strokeWidth={4}
      >
        {/* body */}
        <path d="M148 334 Q134 760 182 790 L578 790 Q626 760 612 334 Z" />
        {/* top zip band */}
        <path d="M148 334 Q380 300 612 334" />
        <path d="M166 372 Q380 340 594 372" stroke={accent} strokeWidth={3} strokeDasharray="8 8" />
        {/* zipper */}
        <path d="M150 334 L612 334" stroke={accent} strokeWidth={7} />
        {Array.from({ length: 26 }, (_, i) => (
          <line
            key={`z${i}`}
            x1={160 + i * 17}
            y1="326"
            x2={160 + i * 17}
            y2="342"
            stroke={accent}
            strokeWidth={2}
          />
        ))}
        {/* handle */}
        <path d="M296 330 Q300 214 380 210 Q460 214 464 330" />
        <path d="M318 330 Q322 244 380 240 Q438 244 442 330" strokeWidth={2} opacity={0.55} />
        {/* chicken body inside print */}
        <path d="M260 468 Q252 432 296 412 Q354 388 420 400 Q476 410 506 450 Q540 496 524 548 Q512 596 468 620 Q430 640 388 640 Q334 640 296 608 Q258 574 258 522 Z" />
        <path d="M500 452 Q548 442 566 470 Q582 496 556 516" />
        <path d="M524 548 Q566 556 576 588" />
        <path d="M300 612 Q268 650 236 650 M468 620 Q502 654 534 656" />
        {/* label panel */}
        <path d="M196 432 L196 606 L338 606 L338 432 Z" stroke={accent} strokeWidth={3} />
        <path d="M214 462 L314 462 M214 486 L292 486 M214 512 L306 512 M214 536 L286 536" stroke={accent} strokeWidth={2} opacity={0.7} />
        {/* stitching */}
        <path d="M170 758 Q380 786 590 758" strokeDasharray="10 10" strokeWidth={2} opacity={0.7} />
        <path d="M170 774 Q380 802 590 774" strokeDasharray="10 10" strokeWidth={2} opacity={0.7} />
      </g>
      {/* strap */}
      <path
        d="M196 380 Q120 544 150 710"
        stroke={accent}
        strokeWidth={8}
        strokeDasharray={900}
        strokeDashoffset={900 * (1 - progress(t, start + 0.55, 1.1, easeOut))}
      />
      <path
        d="M568 380 Q648 544 614 710"
        stroke={accent}
        strokeWidth={8}
        strokeDasharray={900}
        strokeDashoffset={900 * (1 - progress(t, start + 0.55, 1.1, easeOut))}
      />
      <g opacity={progress(t, start + 1.04, 0.5)}>
        <line x1="646" y1="334" x2="728" y2="334" stroke={accent} strokeWidth={2} />
        <text x="632" y="318" fill={accent} stroke="none" fontFamily={FONT} fontSize="17" fontWeight="700" letterSpacing="2">
          ZIP
        </text>
        <line x1="464" y1="212" x2="620" y2="150" stroke={accent} strokeWidth={2} />
        <text x="566" y="136" fill={accent} stroke="none" fontFamily={FONT} fontSize="17" fontWeight="700" letterSpacing="2">
          ADD STRAP
        </text>
        <line x1="570" y1="690" x2="690" y2="744" stroke={accent} strokeWidth={2} />
        <text x="634" y="776" fill={accent} stroke="none" fontFamily={FONT} fontSize="17" fontWeight="700" letterSpacing="2">
          SAME PRINT
        </text>
      </g>
    </svg>
  );
};

export const LuxuryBag: React.FC<{ width?: number; style?: CSSProperties }> = ({
  width = 260,
  style,
}) => (
  <svg viewBox="0 0 300 260" width={width} style={{ overflow: "visible", ...style }}>
    <defs>
      <linearGradient id="lux" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#2B2B2B" />
        <stop offset="0.55" stopColor="#101010" />
        <stop offset="1" stopColor="#353535" />
      </linearGradient>
      <pattern id="quilt" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <path d="M0 0 L0 34" stroke="rgba(255,255,255,0.13)" strokeWidth="1.4" />
        <path d="M0 0 L34 0" stroke="rgba(255,255,255,0.13)" strokeWidth="1.4" />
      </pattern>
    </defs>
    <path d="M52 84 Q50 66 68 60 L232 60 Q250 66 248 84 L260 214 Q260 238 236 238 L64 238 Q40 238 40 214 Z" fill="url(#lux)" stroke="#C7A35A" strokeWidth="3" />
    <path d="M52 84 Q50 66 68 60 L232 60 Q250 66 248 84 L260 214 Q260 238 236 238 L64 238 Q40 238 40 214 Z" fill="url(#quilt)" />
    <path d="M104 62 Q104 18 150 18 Q196 18 196 62" fill="none" stroke="#C7A35A" strokeWidth="7" />
    <rect x="132" y="138" width="36" height="26" rx="4" fill="#C7A35A" />
    <circle cx="150" cy="151" r="4" fill="#101010" />
  </svg>
);

export const Confetti: React.FC<{ start?: number; count?: number }> = ({ start = 0, count = 46 }) => {
  const { t } = useTime();
  const p = progress(t, start, 1.6, easeOut);
  const colors = [C.yellow, C.orange, C.purpleLight, C.white, C.cream];
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 70, overflow: "hidden" }}>
      {Array.from({ length: count }, (_, index) => {
        const x = seeded(index + 4) * 1080;
        const delay = seeded(index + 18) * 0.5;
        const local = clamp((p - delay) / 0.75);
        const y = -80 + local * 2100;
        const drift = Math.sin(local * 8 + index) * 40;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x + drift,
              top: y,
              width: 8 + seeded(index + 7) * 10,
              height: 14 + seeded(index + 13) * 18,
              background: colors[index % colors.length],
              borderRadius: 2,
              opacity: p > delay ? 1 : 0,
              transform: `rotate(${local * 560 + index * 13}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Interface                                                           */
/* ------------------------------------------------------------------ */

export const Cursor: React.FC<{ x: number; y: number; scale?: number; click?: number }> = ({
  x,
  y,
  scale = 1,
  click = 1,
}) => (
  <svg
    width={44 * scale}
    height={52 * scale}
    viewBox="0 0 44 52"
    style={{
      position: "absolute",
      left: x,
      top: y,
      zIndex: 68,
      transform: `scale(${click})`,
      filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.35))",
    }}
  >
    <path d="M4 2 L4 42 L14 32 L21 49 L29 46 L22 29 L38 29 Z" fill="#FFFFFF" stroke="#0A1B33" strokeWidth="2.5" />
  </svg>
);

export const CommentCard: React.FC<{
  handle: string;
  text: string;
  start?: number;
  x?: number;
  y?: number;
  rotate?: number;
  avatar?: string;
  accent?: string;
  style?: CSSProperties;
}> = ({
  handle,
  text,
  start = 0,
  x = 0,
  y = 0,
  rotate = 0,
  avatar = "M",
  accent = C.yellow,
  style,
}) => {
  const { t } = useTime();
  const p = progress(t, start, 0.5, snap);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 720,
        padding: "24px 26px 22px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.97)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.26)",
        transform: `translateY(${(1 - p) * 34}px) rotate(${rotate}deg) scale(${lerp(0.92, 1, p)})`,
        opacity: p,
        zIndex: 20,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 99,
            background: accent,
            color: C.ink,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 19,
          }}
        >
          {avatar}
        </div>
        <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.ink }}>{handle}</div>
        <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(7,24,47,0.42)" }}>
          JUST NOW
        </div>
      </div>
      <div style={{ fontFamily: FONT, fontSize: 31, fontWeight: 600, lineHeight: 1.22, letterSpacing: "-0.02em", color: C.ink }}>
        {text}
      </div>
      <div style={{ display: "flex", gap: 22, marginTop: 16, fontFamily: FONT, fontSize: 14, fontWeight: 600, color: "rgba(7,24,47,0.46)" }}>
        <span>♡ 2.4K</span>
        <span>↻ 318</span>
        <span>💬 96</span>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tiny utilities                                                      */
/* ------------------------------------------------------------------ */

export const Pill: React.FC<{ children: ReactNode; style?: CSSProperties; color?: string }> = ({
  children,
  style,
  color = C.ink,
}) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      padding: "11px 16px",
      borderRadius: 99,
      background: C.white,
      color,
      fontFamily: FONT,
      fontSize: 14,
      fontWeight: 700,
      letterSpacing: "0.12em",
      textTransform: "uppercase",
      boxShadow: "0 10px 26px rgba(0,0,0,0.18)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Dot: React.FC<{ color?: string; size?: number; style?: CSSProperties }> = ({
  color = C.yellow,
  size = 9,
  style,
}) => (
  <span
    style={{
      display: "inline-block",
      width: size,
      height: size,
      borderRadius: 99,
      background: color,
      boxShadow: `0 0 14px ${color}`,
      ...style,
    }}
  />
);

export const useSafeStage = () => {
  const stage = useStage();
  return stage;
};
