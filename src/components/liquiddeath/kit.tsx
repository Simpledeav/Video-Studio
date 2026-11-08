import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, FONT, IMG, MONO, useStage } from "../../config/liquidDeath";

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

const file = (path: string) => staticFile(path.replace(/^\//, ""));

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.06 }) => (
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
      background: `radial-gradient(ellipse at 50% 44%, transparent 30%, rgba(0,0,0,${0.5 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.46 * strength}) 0%, transparent 20%, transparent 74%, rgba(0,0,0,${0.62 * strength}) 100%)`,
    }}
  />
);

export const Scratches: React.FC<{ opacity?: number }> = ({ opacity = 0.5 }) => {
  const { width, height } = useVideoConfig();
  const lines = Array.from({ length: 16 }, (_, index) => {
    const x = seeded(index + 3) * width;
    const y = seeded(index + 17) * height;
    const length = 40 + seeded(index + 31) * 300;
    return { x, y, length, angle: -32 + seeded(index + 7) * 64, alpha: 0.05 + seeded(index + 41) * 0.1 };
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

export const Halftone: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ opacity = 0.18, size = 7, color = "rgba(255,255,255,0.22)", style }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity,
      backgroundImage: `radial-gradient(${color} ${size * 0.23}px, transparent ${size * 0.24}px)`,
      backgroundSize: `${size}px ${size}px`,
      zIndex: 2,
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
}> = ({ x = "50%", y = "34%", size = 62, color = C.red, opacity = 0.14, zIndex = 0 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex,
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
    }}
  />
);

export const LightBeams: React.FC<{
  intensity?: number;
  color?: string;
  opacity?: number;
}> = ({ intensity = 1, color = C.red, opacity = 0.24 }) => {
  const { t } = useTime();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 1, opacity }}>
      {[0, 1, 2, 3, 4].map((index) => {
        const x = 12 + index * 19;
        const sway = Math.sin(t * 0.42 + index) * 2.4;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${x + sway}%`,
              top: "-26%",
              width: `${8 + index * 2.4}%`,
              height: "102%",
              background: `linear-gradient(180deg, ${color}88 0%, ${color}22 42%, transparent 86%)`,
              transform: `rotate(${-12 + index * 5.8}deg)`,
              filter: "blur(28px)",
              opacity: 0.22 + (index % 3) * 0.08,
              mixBlendMode: "screen",
              transformOrigin: "top center",
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

export const BrushedField: React.FC<{ opacity?: number; style?: CSSProperties }> = ({
  opacity = 0.5,
  style,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      opacity,
      backgroundImage:
        "repeating-linear-gradient(92deg, rgba(255,255,255,0.028) 0px, rgba(255,255,255,0.028) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(88deg, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 2px, transparent 2px, transparent 7px)",
      zIndex: 1,
      ...style,
    }}
  />
);

export const GridField: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ opacity = 0.5, size = 80, color = C.lineSoft, style }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(ellipse at 50% 42%, black 4%, rgba(0,0,0,0.5) 56%, transparent 92%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 42%, black 4%, rgba(0,0,0,0.5) 56%, transparent 92%)",
      zIndex: 1,
      ...style,
    }}
  />
);

export const Sweep: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({ start = 0, duration = 1.6, color = "#FFFFFF", opacity = 0.14, angle = 14 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration, easeInOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: "-30%",
        bottom: "-30%",
        left: `${-60 + p * 190}%`,
        width: "22%",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        transform: `rotate(${angle}deg)`,
        filter: "blur(26px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
};

export const CornerMarks: React.FC<{ opacity?: number; inset?: number }> = ({
  opacity = 0.4,
  inset = 46,
}) => {
  const mark = (style: CSSProperties) => (
    <div style={{ position: "absolute", width: 15, height: 15, opacity, ...style }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 3 }}>
      {mark({ left: inset, top: inset, borderTop: `1px solid ${C.line}`, borderLeft: `1px solid ${C.line}` })}
      {mark({ right: inset, top: inset, borderTop: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}` })}
      {mark({ left: inset, bottom: inset, borderBottom: `1px solid ${C.line}`, borderLeft: `1px solid ${C.line}` })}
      {mark({ right: inset, bottom: inset, borderBottom: `1px solid ${C.line}`, borderRight: `1px solid ${C.line}` })}
    </AbsoluteFill>
  );
};

/** Standard scene stage. */
export const Backdrop: React.FC<{
  children: ReactNode;
  accent?: string;
  glowX?: string;
  glowY?: string;
  glowOpacity?: number;
  style?: CSSProperties;
}> = ({
  children,
  accent = C.red,
  glowX = "62%",
  glowY = "38%",
  glowOpacity = 0.13,
  style,
}) => (
  <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden", ...style }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(155deg, #0E1013 0%, ${C.bg} 44%, #070708 100%)`,
      }}
    />
    <Glow x={glowX} y={glowY} size={58} color={accent} opacity={glowOpacity} />
    <Glow x="18%" y="82%" size={46} color="#FFFFFF" opacity={0.022} />
    <BrushedField opacity={0.34} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "54%",
        height: 1,
        background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)`,
      }}
    />
    {children}
    <CornerMarks />
    <Scratches opacity={0.55} />
    <Grain opacity={0.055} />
    <Vignette strength={0.92} />
  </AbsoluteFill>
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
}> = ({ children, color = C.silver, rule = C.red, start = 0, style }) => {
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
        transform: `translateY(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      <span style={{ width: 26 * p, height: 2, background: rule, display: "inline-block", flexShrink: 0 }} />
      <span style={{ paddingLeft: "0.14em" }}>{children}</span>
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
}> = ({ children, start, duration = 0.8, style, innerStyle, rise = 112 }) => {
  const { t } = useTime();
  const p = progress(t, start, duration);
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.1em", marginBottom: "-0.1em", ...style }}>
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

export const Display: React.FC<{
  children: ReactNode;
  size: number;
  color?: string;
  accent?: boolean;
  weight?: number;
  tracking?: string;
  style?: CSSProperties;
}> = ({
  children,
  size,
  color = C.white,
  accent = false,
  weight = 800,
  tracking = "-0.045em",
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      lineHeight: 0.9,
      letterSpacing: tracking,
      textTransform: "uppercase",
      color: accent ? C.redBright : color,
      ...(accent
        ? {}
        : {
            backgroundImage:
              "linear-gradient(176deg, #FFFFFF 0%, #F1F1EE 42%, #CFD3D7 70%, #9EA4AA 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }),
      filter: "drop-shadow(0 4px 22px rgba(0,0,0,0.5))",
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
  accentLast?: boolean;
  stagger?: number;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({ lines, size, start, accentLast = false, stagger = 0.11, align = "left", style }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: align === "center" ? "center" : "flex-start", ...style }}>
    {lines.map((line, index) => (
      <MaskLine key={line} start={start + index * stagger} duration={0.75} rise={108}>
        <Display
          size={size}
          accent={accentLast && index === lines.length - 1}
          style={{ textAlign: align, whiteSpace: "nowrap" }}
        >
          {line}
        </Display>
      </MaskLine>
    ))}
  </div>
);

export const Tag: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
  style?: CSSProperties;
}> = ({ children, color = C.white, background = "rgba(10,10,12,0.66)", border, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
      padding: "9px 13px",
      border: `1px solid ${border ?? C.line}`,
      background,
      color,
      fontFamily: MONO,
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      lineHeight: 1,
      backdropFilter: "blur(4px)",
      ...style,
    }}
  >
    {children}
  </div>
);

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

export const Numeral: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <span
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontVariantNumeric: "tabular-nums",
      letterSpacing: "-0.055em",
      lineHeight: 0.9,
      ...style,
    }}
  >
    {children}
  </span>
);

/* ------------------------------------------------------------------ */
/* Brand marks                                                        */
/* ------------------------------------------------------------------ */

export const BrandMark: React.FC<{
  width: number;
  opacity?: number;
  style?: CSSProperties;
  glow?: number;
}> = ({ width, opacity = 1, style, glow = 0.35 }) => (
  <div
    style={{
      width,
      height: width * (450 / 800),
      opacity,
      backgroundImage:
        "linear-gradient(176deg, #FFFFFF 0%, #F2F3F1 34%, #C9CDD1 66%, #979DA4 100%)",
      WebkitMaskImage: `url(${file(IMG.logoHorizontal)})`,
      maskImage: `url(${file(IMG.logoHorizontal)})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      filter: `drop-shadow(0 6px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 ${24 * glow}px rgba(255,255,255,0.18))`,
      ...style,
    }}
  />
);

export const StackedLogo: React.FC<{
  height: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ height, opacity = 1, style }) => (
  <div
    style={{
      height,
      width: height * (1488 / 1304),
      opacity,
      backgroundImage:
        "linear-gradient(176deg, #FFFFFF 0%, #EDEEEC 42%, #B9BEC3 74%, #8D939A 100%)",
      WebkitMaskImage: `url(${file(IMG.logoSvg)})`,
      maskImage: `url(${file(IMG.logoSvg)})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      ...style,
    }}
  />
);

export const SkullEmblem: React.FC<{
  size: number;
  opacity?: number;
  color?: string;
  style?: CSSProperties;
  glow?: number;
}> = ({ size, opacity = 0.5, color = "#D8D3C8", style, glow = 0.4 }) => (
  <div
    style={{
      width: size,
      height: size * 0.78,
      opacity,
      backgroundColor: color,
      WebkitMaskImage: `url(${file(IMG.skull)})`,
      maskImage: `url(${file(IMG.skull)})`,
      WebkitMaskSize: "contain",
      maskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      maskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      maskPosition: "center",
      filter: `drop-shadow(0 0 ${size * 0.16 * glow}px rgba(210,31,53,0.55))`,
      ...style,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Real product                                                       */
/* ------------------------------------------------------------------ */

const CAN_ASPECT = 0.7727;

export const Can: React.FC<{
  src?: string;
  height: number;
  rotateY?: number;
  rotateZ?: number;
  sweep?: number;
  glow?: string;
  droplets?: number;
  reflection?: boolean;
  shadow?: boolean;
  style?: CSSProperties;
  filter?: string;
}> = ({
  src = IMG.sparkling,
  height,
  rotateY = 0,
  rotateZ = 0,
  sweep,
  glow = C.red,
  droplets = 1,
  reflection = true,
  shadow = true,
  style,
  filter,
}) => {
  const width = height * CAN_ASPECT;
  const dropCount = Math.round(22 * droplets);
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        flexShrink: 0,
        transform: `perspective(${height * 2.2}px) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        transformStyle: "preserve-3d",
        ...style,
      }}
    >
      {glow ? (
        <div
          style={{
            position: "absolute",
            left: "-26%",
            right: "-26%",
            top: "6%",
            bottom: "-8%",
            background: `radial-gradient(ellipse at 50% 52%, ${glow}44 0%, ${glow}12 42%, transparent 70%)`,
            filter: "blur(24px)",
            zIndex: 0,
          }}
        />
      ) : null}
      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: "-4%",
            right: "-4%",
            bottom: "-7%",
            height: "9%",
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.9) 0%, transparent 68%)",
            filter: "blur(12px)",
            zIndex: 0,
          }}
        />
      ) : null}
      <Img
        src={file(src)}
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          objectFit: "contain",
          zIndex: 2,
          filter: filter ?? "drop-shadow(0 26px 34px rgba(0,0,0,0.55))",
        }}
      />
      {/* Specular sweep clipped to the real can silhouette. */}
      {sweep !== undefined ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 4,
            background: `linear-gradient(100deg, transparent ${sweep * 100 - 18}%, rgba(255,255,255,0.62) ${sweep * 100}%, transparent ${sweep * 100 + 18}%)`,
            WebkitMaskImage: `url(${file(src)})`,
            maskImage: `url(${file(src)})`,
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            mixBlendMode: "screen",
            opacity: 0.55,
          }}
        />
      ) : null}
      {/* Rim light on the real silhouette. */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          background:
            "linear-gradient(104deg, rgba(255,255,255,0.34) 0%, transparent 16%, transparent 78%, rgba(255,255,255,0.2) 100%)",
          WebkitMaskImage: `url(${file(src)})`,
          maskImage: `url(${file(src)})`,
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          mixBlendMode: "screen",
          opacity: 0.45,
        }}
      />
      {dropCount > 0
        ? Array.from({ length: dropCount }, (_, index) => {
            const x = 18 + seeded(index + 1) * 64;
            const y = 9 + seeded(index + 11) * 78;
            const size = 1.6 + seeded(index + 21) * 4.2;
            const alpha = 0.18 + seeded(index + 31) * 0.46;
            return (
              <span
                key={index}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  width: size,
                  height: size * 1.22,
                  borderRadius: "50%",
                  background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.95), rgba(255,255,255,${alpha * 0.6}) 44%, rgba(255,255,255,0.04) 70%)`,
                  boxShadow: `0 0 ${size * 2}px rgba(255,255,255,0.2)`,
                  opacity: alpha + 0.25,
                  zIndex: 5,
                  pointerEvents: "none",
                  transform: "rotate(12deg)",
                }}
              />
            );
          })
        : null}
      {reflection ? (
        <div
          style={{
            position: "absolute",
            top: "99%",
            left: "3%",
            width: "94%",
            height: "32%",
            overflow: "hidden",
            opacity: 0.15,
            WebkitMaskImage: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent 78%)",
            maskImage: "linear-gradient(180deg, rgba(0,0,0,0.8), transparent 78%)",
            zIndex: 1,
          }}
        >
          <Img
            src={file(src)}
            style={{
              width: "100%",
              height: "auto",
              transform: "scaleY(-1)",
              objectFit: "contain",
              filter: "blur(1px) grayscale(0.3)",
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Reusable objects                                                   */
/* ------------------------------------------------------------------ */

/** Generic, unbranded bottle for the water-aisle reconstruction. */
export const GenericBottle: React.FC<{
  width: number;
  height: number;
  tone?: "clear" | "blue" | "grey";
  opacity?: number;
}> = ({ width, height, tone = "clear", opacity = 1 }) => {
  const body =
    tone === "blue"
      ? "linear-gradient(90deg, rgba(90,130,150,0.42), rgba(180,210,222,0.34) 34%, rgba(70,110,130,0.38))"
      : tone === "grey"
        ? "linear-gradient(90deg, rgba(120,125,130,0.38), rgba(210,214,218,0.28) 34%, rgba(90,95,100,0.34))"
        : "linear-gradient(90deg, rgba(130,150,158,0.32), rgba(230,238,240,0.26) 34%, rgba(105,125,132,0.3))";
  return (
    <div style={{ width, height, opacity, position: "relative", flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          left: "34%",
          top: 0,
          width: "32%",
          height: height * 0.075,
          borderRadius: `${width * 0.08}px ${width * 0.08}px 2px 2px`,
          background: "linear-gradient(180deg, #E7EAEC, #9BA2A8 60%, #6B7178)",
          boxShadow: "inset 1px 0 2px rgba(255,255,255,0.5)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "25%",
          top: height * 0.055,
          width: "50%",
          height: height * 0.09,
          borderRadius: "3px 3px 0 0",
          background: "linear-gradient(90deg, #8B9298, #D4D8DB 48%, #7C8389)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "7%",
          top: height * 0.13,
          width: "86%",
          height: height * 0.87,
          borderRadius: `${width * 0.22}px ${width * 0.22}px ${width * 0.16}px ${width * 0.16}px`,
          background: body,
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow:
            "inset 5px 0 12px rgba(255,255,255,0.12), inset -8px 0 18px rgba(0,0,0,0.25), 0 12px 30px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            top: "38%",
            height: "22%",
            background: "rgba(245,245,240,0.13)",
            borderTop: "1px solid rgba(255,255,255,0.14)",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "20%",
            top: "15%",
            width: "7%",
            height: "62%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.3), transparent)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
};

/** 3D-ish shipping container used on the Atlantic route. */
export const Container: React.FC<{ width: number; color?: string; opacity?: number }> = ({
  width,
  color = "#8E3A2F",
  opacity = 1,
}) => (
  <div
    style={{
      width,
      height: width * 0.42,
      opacity,
      display: "flex",
      filter: "drop-shadow(0 10px 16px rgba(0,0,0,0.5))",
    }}
  >
    <div
      style={{
        flex: 1,
        background: `linear-gradient(180deg, ${color}, #3A1A16 82%)`,
        border: "1px solid rgba(255,255,255,0.12)",
        backgroundImage: `repeating-linear-gradient(90deg, rgba(0,0,0,0.26) 0 2px, transparent 2px ${width * 0.035}px), linear-gradient(180deg, ${color}, #3A1A16 82%)`,
      }}
    />
    <div
      style={{
        width: "14%",
        background: `linear-gradient(90deg, #2A1310, ${color})`,
        borderTop: "1px solid rgba(255,255,255,0.16)",
        borderBottom: "1px solid rgba(0,0,0,0.5)",
      }}
    />
  </div>
);

/** Press photograph, art-directed but not altered beyond colour grading. */
export const FounderPhoto: React.FC<{
  width: number;
  height: number;
  start?: number;
  style?: CSSProperties;
}> = ({ width, height, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.9);
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        border: `1px solid ${C.line}`,
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) scale(${0.97 + p * 0.03})`,
        boxShadow: "0 34px 70px rgba(0,0,0,0.55)",
        ...style,
      }}
    >
      <Img
        src={file(IMG.founder)}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 34%",
          filter: "grayscale(0.28) contrast(1.08) brightness(0.86) saturate(0.82)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.05) 0%, transparent 38%, rgba(5,5,6,0.72) 100%), linear-gradient(96deg, rgba(210,31,53,0.13), transparent 46%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: 64,
          height: 3,
          background: C.red,
        }}
      />
    </div>
  );
};

export const WaterDrop: React.FC<{
  size: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ size, opacity = 0.5, style }) => (
  <div
    style={{
      width: size,
      height: size * 1.24,
      borderRadius: "50% 50% 48% 48% / 62% 62% 38% 38%",
      background:
        "radial-gradient(circle at 34% 26%, rgba(255,255,255,0.92), rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.03) 74%)",
      boxShadow: "inset -1px -2px 4px rgba(255,255,255,0.14), 0 0 10px rgba(255,255,255,0.12)",
      opacity,
      ...style,
    }}
  />
);

/** Centred, small utility strip for credits and reconstruction labels. */
export const UtilityNote: React.FC<{
  children: ReactNode;
  start?: number;
  style?: CSSProperties;
}> = ({ children, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.6);
  return (
    <div
      style={{
        fontFamily: MONO,
        fontSize: 11,
        letterSpacing: "0.18em",
        lineHeight: 1.6,
        textTransform: "uppercase",
        color: C.muted,
        opacity: p * 0.9,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Stage-aware text sizes helper. */
export const useType = () => {
  const stage = useStage();
  return {
    stage,
    display: (portrait: number, wide: number) => stage.v(portrait, wide),
  };
};

export const EXIT_FADE: React.FC<{ children: ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [durationInFrames - 8, durationInFrames - 1],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
