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
import { C, FONT, HAND, MONO, useStage } from "../../config/pocketLedger";

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);
export const snap = Easing.bezier(0.2, 0.9, 0.24, 1.16);

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

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 90 }}>
    <Img src={staticFile("images/grain.png")} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number }> = ({ strength = 1 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 80,
      background: `radial-gradient(ellipse at 50% 44%, transparent 36%, rgba(0,0,0,${0.46 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.36 * strength}) 0%, transparent 18%, transparent 76%, rgba(0,0,0,${0.56 * strength}) 100%)`,
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
}> = ({ x = "50%", y = "36%", size = 60, color = C.green, opacity = 0.12, zIndex = 0 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex,
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
    }}
  />
);

export const GridField: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ opacity = 0.45, size = 84, color = C.lineSoft, style }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage: "radial-gradient(ellipse at 50% 40%, black 2%, rgba(0,0,0,0.45) 58%, transparent 92%)",
      WebkitMaskImage: "radial-gradient(ellipse at 50% 40%, black 2%, rgba(0,0,0,0.45) 58%, transparent 92%)",
      zIndex: 1,
      ...style,
    }}
  />
);

export const LightLeak: React.FC<{
  x?: string;
  y?: string;
  color?: string;
  opacity?: number;
  rotate?: number;
}> = ({ x = "70%", y = "20%", color = C.amber, opacity = 0.15, rotate = 18 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 700,
      height: 1400,
      transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
      background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
      filter: "blur(48px)",
      opacity,
      mixBlendMode: "screen",
      pointerEvents: "none",
      zIndex: 1,
    }}
  />
);

export const Sweep: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
  angle?: number;
}> = ({ start = 0, duration = 1.5, color = "#FFFFFF", opacity = 0.12, angle = 12 }) => {
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
        width: "24%",
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        transform: `rotate(${angle}deg)`,
        filter: "blur(28px)",
        opacity,
        mixBlendMode: "screen",
        pointerEvents: "none",
        zIndex: 60,
      }}
    />
  );
};

export const CornerMarks: React.FC<{ inset?: number; opacity?: number }> = ({
  inset = 42,
  opacity = 0.4,
}) => {
  const mark = (style: CSSProperties) => (
    <div style={{ position: "absolute", width: 14, height: 14, opacity, ...style }} />
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

export const Backdrop: React.FC<{
  children: ReactNode;
  glowX?: string;
  glowY?: string;
  glowOpacity?: number;
  accent?: string;
  style?: CSSProperties;
}> = ({
  children,
  glowX = "68%",
  glowY = "38%",
  glowOpacity = 0.12,
  accent = C.green,
  style,
}) => (
  <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden", ...style }}>
    <AbsoluteFill
      style={{
        background: `linear-gradient(152deg, #1A1C15 0%, ${C.bg} 46%, #090B08 100%)`,
      }}
    />
    <Glow x={glowX} y={glowY} size={58} color={accent} opacity={glowOpacity} />
    <Glow x="14%" y="84%" size={44} color={C.amber} opacity={0.045} />
    <LightLeak opacity={0.06} />
    <GridField opacity={0.32} />
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "56%",
        height: 1,
        background: "linear-gradient(90deg, transparent, rgba(246,242,232,0.07), transparent)",
      }}
    />
    {children}
    <CornerMarks />
    <Grain opacity={0.05} />
    <Vignette strength={0.86} />
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
}> = ({ children, color = C.cream, rule = C.greenBright, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.55);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        fontFamily: MONO,
        fontSize: 13,
        fontWeight: 600,
        letterSpacing: "0.22em",
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
        ...style,
      }}
    >
      <span style={{ width: 28 * p, height: 2, background: rule, display: "inline-block", flexShrink: 0 }} />
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
  weight?: number;
  tracking?: string;
  style?: CSSProperties;
}> = ({ children, size, color = C.white, weight = 800, tracking = "-0.045em", style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      lineHeight: 0.94,
      letterSpacing: tracking,
      color,
      textTransform: "uppercase",
      filter: "drop-shadow(0 4px 20px rgba(0,0,0,0.4))",
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
  colorLast?: string;
  stagger?: number;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({ lines, size, start, colorLast, stagger = 0.11, align = "left", style }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: align === "center" ? "center" : "flex-start",
      ...style,
    }}
  >
    {lines.map((line, index) => (
      <MaskLine key={line} start={start + index * stagger} duration={0.75} rise={108}>
        <Display
          size={size}
          color={colorLast && index === lines.length - 1 ? colorLast : C.white}
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
}> = ({ children, color = C.cream, background = "rgba(18,20,15,0.66)", border, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      padding: "8px 12px",
      border: `1px solid ${border ?? C.line}`,
      background,
      color,
      fontFamily: MONO,
      fontSize: 11,
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

export const SourceNote: React.FC<{
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
        fontSize: 10,
        lineHeight: 1.65,
        letterSpacing: "0.16em",
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

/* ------------------------------------------------------------------ */
/* Photography                                                        */
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
  grade?: "warm" | "neutral" | "soft";
  style?: CSSProperties;
  children?: ReactNode;
}> = ({
  src,
  width = "100%",
  height = "100%",
  objectPosition = "50% 50%",
  start = 0,
  duration = 1,
  scaleFrom = 1.06,
  scaleTo = 1,
  grade = "warm",
  style,
  children,
}) => {
  const { t } = useTime();
  const p = progress(t, start, duration, easeOut);
  const filters = {
    warm: "grayscale(0.08) contrast(1.07) saturate(0.82) brightness(0.9) sepia(0.06)",
    neutral: "grayscale(0.05) contrast(1.06) saturate(0.92) brightness(0.9)",
    soft: "grayscale(0.18) contrast(1.02) saturate(0.72) brightness(0.86)",
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
            grade === "warm"
              ? "linear-gradient(180deg, rgba(18,20,15,0.06), transparent 44%, rgba(18,20,15,0.5)), linear-gradient(96deg, rgba(217,164,94,0.08), transparent 52%)"
              : "linear-gradient(180deg, rgba(18,20,15,0.12), transparent 52%, rgba(18,20,15,0.5))",
          pointerEvents: "none",
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Brand                                                              */
/* ------------------------------------------------------------------ */

export const LedgerIcon: React.FC<{ size: number; color?: string; background?: string }> = ({
  size,
  color = C.ink,
  background = C.greenBright,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.26,
      background,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: size * 0.09,
      boxShadow: `0 ${size * 0.08}px ${size * 0.24}px rgba(0,0,0,0.28)`,
      flexShrink: 0,
    }}
  >
    {[0.56, 0.42, 0.62].map((w, index) => (
      <div
        key={index}
        style={{
          width: size * w,
          height: Math.max(1.5, size * 0.055),
          borderRadius: size,
          background: color,
          opacity: 0.9 - index * 0.12,
        }}
      />
    ))}
    <div
      style={{
        width: size * 0.16,
        height: size * 0.16,
        borderRadius: "50%",
        border: `${Math.max(1.5, size * 0.035)}px solid ${color}`,
        marginTop: size * 0.02,
      }}
    />
  </div>
);

export const PocketLedgerLogo: React.FC<{
  size?: number;
  stacked?: boolean;
  color?: string;
  style?: CSSProperties;
}> = ({ size = 44, stacked = false, color = C.white, style }) => (
  <div
    style={{
      display: "flex",
      flexDirection: stacked ? "column" : "row",
      alignItems: "center",
      gap: size * 0.34,
      ...style,
    }}
  >
    <LedgerIcon size={size} />
    <div
      style={{
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size * 0.62,
        letterSpacing: "0.02em",
        color,
        lineHeight: 1,
        whiteSpace: "nowrap",
      }}
    >
      POCKET<span style={{ color: C.greenBright }}>LEDGER</span>
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Professional notebook prop                                          */
/* ------------------------------------------------------------------ */

export const Notebook: React.FC<{
  width: number;
  height: number;
  open?: boolean;
  closeProgress?: number;
  style?: CSSProperties;
}> = ({ width, height, open = true, closeProgress = 0, style }) => {
  const pageW = open ? width : width * 0.5;
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        perspective: 1400,
        transform: `rotate(${-2 + (1 - closeProgress) * 1.4}deg) scale(${1 - closeProgress * 0.05})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: "3% 2% 0",
          background: "#241F18",
          borderRadius: 6,
          boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          transform: "translateY(12px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: pageW,
          height: "100%",
          background:
            "linear-gradient(150deg, #F7F0DF 0%, #EDE4D0 56%, #DFD3BC 100%)",
          borderRadius: "5px 2px 2px 5px",
          boxShadow: "inset -10px 0 18px rgba(90,70,40,0.14), 0 26px 60px rgba(0,0,0,0.45)",
          overflow: "hidden",
          transformOrigin: "left center",
          transform: `rotateY(${-closeProgress * 10}deg)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 2,
            background: "rgba(180,160,120,0.5)",
          }}
        />
        {Array.from({ length: 18 }, (_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: "8%",
              right: "6%",
              top: `${10 + index * 4.9}%`,
              height: 1,
              background: "rgba(90,110,120,0.16)",
            }}
          />
        ))}
        <div style={{ position: "absolute", left: "8%", right: "7%", top: "7%" }}>
          <div
            style={{
              fontFamily: HAND,
              fontSize: width * 0.038,
              color: "#3A372E",
              opacity: 0.86,
              transform: "rotate(-0.8deg)",
            }}
          >
            Monday sales
          </div>
          <div
            style={{
              marginTop: height * 0.035,
              display: "flex",
              flexDirection: "column",
              gap: height * 0.012,
              fontFamily: HAND,
              fontSize: width * 0.052,
              lineHeight: 1.1,
              color: "#2E332E",
              transform: "rotate(-0.5deg)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>bread + eggs</span>
              <span>8,000</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>transfer</span>
              <span>12,500</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.8 }}>
              <span>transport</span>
              <span style={{ textDecoration: "line-through" }}>1,800</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>supplies</span>
              <span>4,500</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.72 }}>
              <span>light</span>
              <span>1,200</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", opacity: 0.72 }}>
              <span>home</span>
              <span>4,000</span>
            </div>
          </div>
          <div
            style={{
              marginTop: height * 0.04,
              fontFamily: HAND,
              fontSize: width * 0.045,
              color: "#6A3F34",
              transform: "rotate(-1.4deg)",
              opacity: 0.8,
            }}
          >
            total??
          </div>
          <div
            style={{
              position: "absolute",
              right: "2%",
              top: height * 0.25,
              width: width * 0.14,
              height: width * 0.14,
              borderRadius: "50%",
              border: `2px solid rgba(150,70,50,0.35)`,
              transform: "rotate(-12deg)",
              display: "grid",
              placeItems: "center",
              fontFamily: MONO,
              fontSize: width * 0.014,
              letterSpacing: "0.08em",
              color: "rgba(150,70,50,0.55)",
            }}
          >
            PAID
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 18,
            background: "linear-gradient(90deg, transparent, rgba(90,70,40,0.14))",
          }}
        />
      </div>

      {open ? (
        <div
          style={{
            position: "absolute",
            left: width * 0.5,
            top: 0,
            width: width * 0.5,
            height: "100%",
            background:
              "linear-gradient(210deg, #F2E9D7 0%, #E8DDC8 62%, #D6C8AE 100%)",
            borderRadius: "2px 5px 5px 2px",
            boxShadow: "inset 10px 0 18px rgba(90,70,40,0.13), 0 26px 60px rgba(0,0,0,0.42)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              top: "10%",
              fontFamily: HAND,
              fontSize: width * 0.04,
              color: "#3A372E",
              opacity: 0.8,
              transform: "rotate(0.6deg)",
            }}
          >
            What came in?
          </div>
          <div
            style={{
              position: "absolute",
              left: "8%",
              right: "8%",
              top: "25%",
              fontFamily: HAND,
              fontSize: width * 0.062,
              lineHeight: 1.55,
              color: "#2E332E",
              transform: "rotate(0.4deg)",
            }}
          >
            <div>cash 8,000</div>
            <div>transfer 12,500</div>
            <div>cash 6,500</div>
            <div style={{ opacity: 0.5 }}>?</div>
            <div style={{ opacity: 0.5 }}>?</div>
          </div>
          <div
            style={{
              position: "absolute",
              left: "8%",
              bottom: "12%",
              fontFamily: HAND,
              fontSize: width * 0.045,
              color: "#6A3F34",
              transform: "rotate(-1deg)",
              opacity: 0.8,
            }}
          >
            did I make profit?
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Phone                                                              */
/* ------------------------------------------------------------------ */

export const StatusBar: React.FC<{ light?: boolean }> = ({ light = false }) => {
  const color = light ? "rgba(246,242,232,0.86)" : "rgba(12,14,11,0.72)";
  return (
    <div
      style={{
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        fontFamily: FONT,
        fontSize: 11,
        fontWeight: 600,
        color,
        flexShrink: 0,
      }}
    >
      <span>9:41</span>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 1.4, height: 8 }}>
          {[0.4, 0.6, 0.8, 1].map((h, i) => (
            <span key={i} style={{ width: 2, height: 8 * h, borderRadius: 1, background: "currentColor" }} />
          ))}
        </div>
        <span style={{ fontSize: 9.5, fontWeight: 700 }}>5G</span>
        <div
          style={{
            width: 18,
            height: 9,
            borderRadius: 2.5,
            border: "1px solid currentColor",
            padding: 1,
          }}
        >
          <div style={{ width: "78%", height: "100%", borderRadius: 1, background: C.greenBright }} />
        </div>
      </div>
    </div>
  );
};

export const PhoneFrame: React.FC<{
  width: number;
  children: ReactNode;
  style?: CSSProperties;
  screenStyle?: CSSProperties;
  lightScreen?: boolean;
}> = ({ width, children, style, screenStyle, lightScreen = true }) => {
  const height = width * 2.03;
  const radius = width * 0.13;
  const bezel = Math.max(7, width * 0.028);
  return (
    <div style={{ width, height, position: "relative", flexShrink: 0, ...style }}>
      <div
        style={{
          position: "absolute",
          inset: -width * 0.08,
          borderRadius: radius * 1.2,
          background: "radial-gradient(ellipse at 50% 50%, rgba(122,203,154,0.22), transparent 70%)",
          filter: "blur(22px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: "linear-gradient(145deg, #565A50 0%, #1B1D18 26%, #0A0B09 62%, #3E423A 100%)",
          boxShadow:
            "0 46px 90px rgba(0,0,0,0.62), 0 8px 18px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.26)",
          padding: bezel,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: -bezel * 0.8,
            top: height * 0.19,
            width: bezel * 1.1,
            height: height * 0.055,
            borderRadius: 2,
            background: "linear-gradient(180deg, #3E423A, #12140F)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: -bezel * 0.8,
            top: height * 0.23,
            width: bezel * 1.1,
            height: height * 0.09,
            borderRadius: 2,
            background: "linear-gradient(180deg, #3E423A, #12140F)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: radius * 0.92,
            overflow: "hidden",
            background: lightScreen ? C.paper : C.ink,
            ...screenStyle,
          }}
        >
          {children}
          <div
            style={{
              position: "absolute",
              top: width * 0.018,
              left: "50%",
              transform: "translateX(-50%)",
              width: width * 0.22,
              height: width * 0.056,
              borderRadius: width * 0.04,
              background: "#0A0B09",
              zIndex: 40,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: radius * 0.92,
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.05) 0%, transparent 26%, transparent 74%, rgba(255,255,255,0.02) 100%)",
              pointerEvents: "none",
              zIndex: 41,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Interaction                                                        */
/* ------------------------------------------------------------------ */

export const TapRipple: React.FC<{
  x: number;
  y: number;
  start: number;
  size?: number;
  color?: string;
}> = ({ x, y, start, size = 54, color = C.greenBright }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.55, easeOut);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: "translate(-50%, -50%)",
        borderRadius: "50%",
        border: `2px solid ${color}`,
        opacity: 0.75 * (1 - p),
        scale: 0.6 + p * 0.8,
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
};

export const CheckMark: React.FC<{ size: number; progress: number; color?: string }> = ({
  size,
  progress: p,
  color = C.greenBright,
}) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `2px solid ${color}`,
      display: "grid",
      placeItems: "center",
      opacity: p,
      transform: `scale(${0.86 + p * 0.14})`,
      boxShadow: `0 0 ${size * 0.35}px ${color}44`,
    }}
  >
    <svg width={size * 0.46} height={size * 0.46} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5L10 17.4L19 7.6"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="26"
        strokeDashoffset={26 * (1 - p)}
      />
    </svg>
  </div>
);

export const Money: React.FC<{
  value: string;
  size: number;
  color?: string;
  weight?: number;
  style?: CSSProperties;
}> = ({ value, size, color = C.ink, weight = 700, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: weight,
      letterSpacing: "-0.055em",
      lineHeight: 1,
      color,
      fontVariantNumeric: "tabular-nums",
      ...style,
    }}
  >
    {value}
  </div>
);

export const EXIT_FADE: React.FC<{ children: ReactNode; frames?: number }> = ({
  children,
  frames = 8,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(frame, [durationInFrames - frames, durationInFrames - 1], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};

export const useType = () => {
  const stage = useStage();
  return {
    stage,
    display: (portrait: number, wide: number) => stage.v(portrait, wide),
  };
};
