import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

/* ------------------------------------------------------------------ */
/* Canvas + palette                                                    */
/* ------------------------------------------------------------------ */

export const FONT =
  '"Poppins", "SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';
export const MONO =
  '"SF Mono", "SFMono-Regular", ui-monospace, Menlo, "Courier New", monospace';

export const C = {
  black: "#060504",
  ink: "#0B0907",
  espresso: "#14110D",
  charcoal: "#1C1915",
  graphite: "#2A2621",
  silver: "#C9CDD2",
  silverMid: "#8D939B",
  silverDark: "#565C63",
  white: "#F7F3EA",
  cream: "#F0E6D6",
  creamSoft: "#D8CBB7",
  muted: "#9A958C",
  dim: "#6A655C",
  orange: "#FF6A14",
  orangeBright: "#FF8A3D",
  orangeDeep: "#D74400",
  orangeSoft: "rgba(255, 106, 20, 0.14)",
  lime: "#C7E84C",
  limeSoft: "rgba(199, 232, 76, 0.14)",
  blue: "#4D8DFF",
  blueSoft: "rgba(77, 141, 255, 0.15)",
  red: "#E23A32",
  redDeep: "#7E1717",
  redSoft: "rgba(226, 58, 50, 0.14)",
  green: "#41C98B",
  line: "rgba(247, 243, 234, 0.12)",
  lineSoft: "rgba(247, 243, 234, 0.055)",
} as const;

export const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

export const progress = (
  t: number,
  startSeconds: number,
  durationSeconds: number,
  easing: (value: number) => number = easeOut,
) => easing(clamp((t - startSeconds) / Math.max(0.001, durationSeconds)));

export const useTime = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return { frame, fps, t: frame / fps };
};

/* ------------------------------------------------------------------ */
/* Atmosphere                                                          */
/* ------------------------------------------------------------------ */

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
  <AbsoluteFill style={{ opacity, mixBlendMode: "overlay", pointerEvents: "none", zIndex: 90 }}>
    <Img
      src={staticFile("images/grain.png")}
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
  </AbsoluteFill>
);

export const Vignette: React.FC<{ strength?: number; warm?: boolean }> = ({
  strength = 1,
  warm = false,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 80,
      background: `radial-gradient(ellipse at 50% 42%, transparent 22%, rgba(0,0,0,${
        0.56 * strength
      }) 100%),
        ${
          warm
            ? "linear-gradient(180deg, rgba(38,13,0,0.32) 0%, transparent 24%, transparent 68%, rgba(16,5,0,0.62) 100%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.36) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.62) 100%)"
        }`,
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
}> = ({ x = "50%", y = "32%", size = 62, color = C.orange, opacity = 0.18, zIndex = 0 }) => (
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
      zIndex: 85,
      backgroundImage: `repeating-linear-gradient(180deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent ${spacing}px)`,
      opacity,
      mixBlendMode: "overlay",
    }}
  />
);

export const Halftone: React.FC<{ opacity?: number; size?: number }> = ({
  opacity = 0.1,
  size = 7,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      zIndex: 3,
      opacity,
      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1.2px)`,
      backgroundSize: `${size}px ${size}px`,
      maskImage: "linear-gradient(180deg, black, transparent 74%)",
      WebkitMaskImage: "linear-gradient(180deg, black, transparent 74%)",
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Type                                                                */
/* ------------------------------------------------------------------ */

export const Kicker: React.FC<{
  children: ReactNode;
  color?: string;
  style?: CSSProperties;
  line?: boolean;
}> = ({ children, color = C.orange, style, line = true }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      fontFamily: MONO,
      fontSize: 19,
      fontWeight: 500,
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      color,
      ...style,
    }}
  >
    {line ? (
      <span style={{ width: 34, height: 2, background: color, flexShrink: 0 }} />
    ) : null}
    <span>{children}</span>
  </div>
);

export const Headline: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({ children, size = 92, color = C.white, align = "left", style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 800,
      fontSize: size,
      lineHeight: 0.95,
      letterSpacing: "-0.032em",
      textTransform: "uppercase",
      color,
      textAlign: align,
      textWrap: "balance",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Subhead: React.FC<{
  children: ReactNode;
  size?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ children, size = 32, color = C.creamSoft, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 500,
      fontSize: size,
      lineHeight: 1.32,
      letterSpacing: "-0.01em",
      color,
      ...style,
    }}
  >
    {children}
  </div>
);

export const MonoLabel: React.FC<{
  children: ReactNode;
  color?: string;
  size?: number;
  style?: CSSProperties;
}> = ({ children, color = C.muted, size = 16, style }) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color,
      lineHeight: 1.4,
      ...style,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* Product objects                                                     */
/* ------------------------------------------------------------------ */

export const Orange: React.FC<{
  size?: number;
  style?: CSSProperties;
  dim?: boolean;
}> = ({ size = 120, style, dim = false }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      position: "relative",
      background:
        "radial-gradient(circle at 34% 27%, #FFC46A 0%, #FF9724 18%, #FF6A14 48%, #D74400 78%, #8F2700 100%)",
      boxShadow: `inset -${size * 0.12}px -${size * 0.16}px ${size * 0.22}px rgba(80,20,0,0.55),
        inset ${size * 0.07}px ${size * 0.07}px ${size * 0.12}px rgba(255,220,170,0.45),
        0 ${size * 0.14}px ${size * 0.28}px rgba(0,0,0,0.5)`,
      filter: dim ? "brightness(0.5) saturate(0.5)" : "none",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "50%",
        opacity: 0.34,
        backgroundImage:
          "radial-gradient(circle at 50% 50%, rgba(120,45,0,0.32) 0.7px, transparent 1.1px)",
        backgroundSize: `${Math.max(4, size * 0.035)}px ${Math.max(4, size * 0.035)}px`,
        mixBlendMode: "multiply",
      }}
    />
    <div
      style={{
        position: "absolute",
        left: "18%",
        top: "12%",
        width: "30%",
        height: "20%",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,245,220,0.58), transparent 72%)",
        filter: "blur(2px)",
      }}
    />
    <svg
      viewBox="0 0 100 60"
      style={{
        position: "absolute",
        width: size * 0.5,
        height: size * 0.3,
        left: size * 0.34,
        top: -size * 0.12,
        transform: "rotate(-18deg)",
      }}
    >
      <path d="M4 40 C18 8 48 2 76 12 C58 30 30 46 4 40 Z" fill="#4F7A22" />
      <path d="M12 38 C30 20 50 12 68 14" stroke="#8CB84A" strokeWidth="2" fill="none" />
    </svg>
  </div>
);

export const JuicePack: React.FC<{
  scale?: number;
  rotate?: number;
  style?: CSSProperties;
  dim?: boolean;
}> = ({ scale = 1, rotate = 0, style, dim = false }) => (
  <div
    style={{
      width: 170,
      height: 250,
      position: "relative",
      transform: `rotate(${rotate}deg) scale(${scale})`,
      filter: dim ? "brightness(0.55) saturate(0.55)" : "none",
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "18px 18px 24px 24px",
        background:
          "linear-gradient(155deg, rgba(255,255,255,0.32) 0%, rgba(255,255,255,0.08) 22%, rgba(255,255,255,0.02) 46%, rgba(0,0,0,0.22) 100%), linear-gradient(180deg, #FF8A2B 0%, #F45A0A 58%, #B93400 100%)",
        boxShadow:
          "inset 0 0 0 1px rgba(255,230,200,0.3), 0 26px 50px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: 34,
          bottom: 20,
          borderRadius: 12,
          background:
            "linear-gradient(180deg, rgba(50,22,0,0.38), rgba(120,40,0,0.2))",
          boxShadow: "inset 0 0 22px rgba(0,0,0,0.42)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 18,
          right: 18,
          top: 46,
          height: 10,
          borderRadius: 6,
          background: "rgba(255,240,215,0.2)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          top: 68,
          width: 4,
          height: 120,
          borderRadius: 4,
          background: "linear-gradient(180deg, rgba(255,255,255,0.55), transparent)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          bottom: 30,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.18em",
          color: "rgba(255,238,215,0.72)",
          textTransform: "uppercase",
        }}
      >
        COLD PRESSED
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        top: -8,
        left: 30,
        right: 30,
        height: 18,
        borderRadius: "4px 4px 2px 2px",
        background: "linear-gradient(180deg, #D8DDE2, #7D848C)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
      }}
    />
  </div>
);

export const Glass: React.FC<{
  size?: number;
  fill?: number;
  style?: CSSProperties;
}> = ({ size = 1, fill = 0.7, style }) => {
  const height = 230 * size;
  const width = 128 * size;
  return (
    <div style={{ width, height, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "10px 10px 18px 18px",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.04) 18%, rgba(255,255,255,0.02) 60%, rgba(255,255,255,0.16) 100%)",
          border: "1px solid rgba(255,255,255,0.26)",
          boxShadow: "inset 0 0 26px rgba(255,255,255,0.08), 0 22px 40px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 6,
            right: 6,
            bottom: 6,
            height: `${clamp(fill) * 84}%`,
            borderRadius: "4px 4px 12px 12px",
            background:
              "linear-gradient(180deg, #FFB43D 0%, #FF7A12 38%, #DD4B00 100%)",
            boxShadow: "inset 0 8px 18px rgba(255,190,90,0.28)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: -3,
              height: 6,
              background: "rgba(255,220,150,0.7)",
              filter: "blur(1px)",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 14,
            top: 10,
            width: 8,
            height: "74%",
            borderRadius: 6,
            background: "linear-gradient(180deg, rgba(255,255,255,0.6), transparent)",
            opacity: 0.38,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: -6,
          right: -6,
          bottom: -8,
          height: 14,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.55), transparent 70%)",
          filter: "blur(3px)",
        }}
      />
    </div>
  );
};

export const Machine: React.FC<{
  scale?: number;
  screen?: ReactNode;
  press?: number;
  open?: number;
  dim?: boolean;
  freeze?: boolean;
  style?: CSSProperties;
}> = ({ scale = 1, screen, press = 0, open = 0, dim = false, freeze = false, style }) => {
  const jaw = clamp(press);
  const gap = 132 + open * 34 - jaw * 86;
  return (
    <div
      style={{
        width: 360,
        height: 560,
        transform: `scale(${scale})`,
        transformOrigin: "center bottom",
        position: "relative",
        filter: dim ? "brightness(0.38) saturate(0.45)" : "none",
        ...style,
      }}
    >
      {/* body */}
      <div
        style={{
          position: "absolute",
          inset: "0 18px 28px",
          borderRadius: "44px 44px 26px 26px",
          background:
            "linear-gradient(100deg, #3B4046 0%, #8B9299 10%, #E8EBEE 24%, #A7ADB4 38%, #F4F6F8 48%, #B8BEC5 58%, #777E86 76%, #353A40 100%)",
          boxShadow:
            "inset 6px 0 14px rgba(255,255,255,0.38), inset -10px 0 24px rgba(0,0,0,0.42), 0 42px 80px rgba(0,0,0,0.62)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.32,
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(255,255,255,0.22) 0px, rgba(255,255,255,0.22) 1px, transparent 1px, transparent 3px)",
            mixBlendMode: "overlay",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 18,
            height: 54,
            borderRadius: 26,
            background: "linear-gradient(180deg, rgba(28,30,33,0.76), rgba(10,11,12,0.92))",
            boxShadow: "inset 0 -2px 0 rgba(255,255,255,0.16), 0 2px 6px rgba(0,0,0,0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 22,
              fontFamily: MONO,
              fontSize: 12,
              letterSpacing: "0.32em",
              color: "rgba(247,243,234,0.56)",
            }}
          >
            JUICERO
          </div>
          <div
            style={{
              position: "absolute",
              right: 18,
              top: 18,
              width: 18,
              height: 18,
              borderRadius: "50%",
              border: `1px solid ${freeze ? C.red : C.lime}`,
              background: freeze ? C.red : C.lime,
              boxShadow: `0 0 14px ${freeze ? C.red : C.lime}`,
              opacity: 0.9,
            }}
          />
        </div>

        {/* screen */}
        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            top: 92,
            height: 122,
            borderRadius: 14,
            background:
              "linear-gradient(160deg, rgba(9,12,14,0.98), rgba(3,4,5,1) 58%, rgba(14,18,21,0.98))",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "inset 0 0 30px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.2), 0 10px 24px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at 78% 20%, ${
                freeze ? "rgba(226,58,50,0.2)" : "rgba(255,106,20,0.18)"
              }, transparent 55%)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.18,
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 4px)",
            }}
          />
          <div style={{ position: "absolute", inset: 16, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            {screen}
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: "40%",
              background: "linear-gradient(180deg, rgba(255,255,255,0.07), transparent)",
              transform: "skewY(-8deg)",
              transformOrigin: "top left",
            }}
          />
        </div>

        {/* press slot */}
        <div
          style={{
            position: "absolute",
            left: 34,
            right: 34,
            top: 234,
            height: 190,
            borderRadius: 22,
            background: "linear-gradient(180deg, #0B0C0D, #16191C 50%, #08090A)",
            boxShadow:
              "inset 0 10px 26px rgba(0,0,0,0.92), inset 0 -4px 10px rgba(255,255,255,0.08), 0 0 0 1px rgba(255,255,255,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              top: 8,
              height: gap / 2,
              borderRadius: 8,
              background:
                "linear-gradient(180deg, #D7DCE1 0%, #8D949B 42%, #4C5258 100%)",
              boxShadow: "0 6px 12px rgba(0,0,0,0.6)",
              transform: `translateY(${jaw * 8}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 8,
              height: gap / 2,
              borderRadius: 8,
              background:
                "linear-gradient(0deg, #D7DCE1 0%, #8D949B 42%, #4C5258 100%)",
              boxShadow: "0 -6px 12px rgba(0,0,0,0.6)",
              transform: `translateY(-${jaw * 8}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 2,
              height: 150,
              background: `linear-gradient(180deg, transparent, ${C.orange}, transparent)`,
              opacity: 0.18 + jaw * 0.32,
              transform: "translate(-50%,-50%)",
              filter: "blur(1px)",
            }}
          />
        </div>

        {/* drip tray */}
        <div
          style={{
            position: "absolute",
            left: 44,
            right: 44,
            bottom: 16,
            height: 46,
            borderRadius: 10,
            background:
              "linear-gradient(180deg, #202327, #0C0E10 52%, #2A2D31 100%)",
            boxShadow: "inset 0 6px 14px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 24,
              right: 24,
              top: 12,
              height: 3,
              borderRadius: 3,
              background: "rgba(255,255,255,0.12)",
            }}
          />
        </div>
      </div>

      {/* feet */}
      <div
        style={{
          position: "absolute",
          left: 62,
          bottom: 10,
          width: 44,
          height: 18,
          borderRadius: 8,
          background: "linear-gradient(180deg, #2B2E32, #0B0C0D)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 62,
          bottom: 10,
          width: 44,
          height: 18,
          borderRadius: 8,
          background: "linear-gradient(180deg, #2B2E32, #0B0C0D)",
        }}
      />

      {/* reflection */}
      <div
        style={{
          position: "absolute",
          left: 26,
          right: 26,
          bottom: -12,
          height: 20,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.66), transparent 72%)",
          filter: "blur(4px)",
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Photography / reconstruction                                        */
/* ------------------------------------------------------------------ */

export const photoSrc = (name: string) => staticFile(`images/juicero/${name}`);

export const Photo: React.FC<{
  src: string;
  style?: CSSProperties;
  objectPosition?: string;
  grade?: "warm" | "cool" | "noir" | "silver" | "bleak";
  opacity?: number;
  scale?: number;
}> = ({ src, style, objectPosition = "50% 50%", grade = "warm", opacity = 1, scale = 1 }) => {
  const filters: Record<string, string> = {
    warm: "brightness(0.78) contrast(1.08) saturate(0.94) sepia(0.08)",
    cool: "brightness(0.72) contrast(1.12) saturate(0.82) hue-rotate(-8deg)",
    noir: "grayscale(1) brightness(0.54) contrast(1.24)",
    silver: "grayscale(0.72) brightness(0.66) contrast(1.16) sepia(0.06)",
    bleak: "grayscale(0.4) brightness(0.4) contrast(1.2) saturate(0.72)",
  };
  return (
    <Img
      src={src}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        objectPosition,
        filter: filters[grade],
        opacity,
        transform: `scale(${scale})`,
        ...style,
      }}
    />
  );
};

export const ReconstructionLabel: React.FC<{
  text?: string;
  style?: CSSProperties;
  light?: boolean;
}> = ({ text = "ILLUSTRATIVE RECONSTRUCTION  ·  NOT VERIFIED FOOTAGE", style, light = false }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      padding: "6px 10px",
      background: light ? "rgba(247,243,234,0.86)" : "rgba(6,5,4,0.62)",
      border: `1px solid ${light ? "rgba(6,5,4,0.12)" : "rgba(247,243,234,0.16)"}`,
      borderRadius: 4,
      fontFamily: MONO,
      fontSize: 11,
      letterSpacing: "0.12em",
      color: light ? "rgba(6,5,4,0.66)" : "rgba(247,243,234,0.62)",
      textTransform: "uppercase",
      ...style,
    }}
  >
    <span
      style={{
        width: 5,
        height: 5,
        borderRadius: "50%",
        background: C.orange,
        flexShrink: 0,
      }}
    />
    {text}
  </div>
);

/* ------------------------------------------------------------------ */
/* Small data objects                                                  */
/* ------------------------------------------------------------------ */

export const MoneyCounter: React.FC<{
  value: number;
  label?: string;
  size?: number;
  color?: string;
}> = ({ value, label, size = 104, color = C.white }) => {
  const millions = value / 1_000_000;
  const display = millions >= 1 ? `$${Math.round(millions)}M` : `$${Math.round(value)}`;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div
        style={{
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: size,
          lineHeight: 0.9,
          letterSpacing: "-0.05em",
          color,
          fontVariantNumeric: "tabular-nums",
          textShadow: "0 8px 32px rgba(0,0,0,0.45)",
        }}
      >
        {display}
      </div>
      {label ? (
        <MonoLabel size={14} color={C.muted} style={{ letterSpacing: "0.18em" }}>
          {label}
        </MonoLabel>
      ) : null}
    </div>
  );
};

export const WifiGlyph: React.FC<{
  size?: number;
  color?: string;
  progress?: number;
  style?: CSSProperties;
}> = ({ size = 42, color = C.lime, progress: p = 1, style }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    style={{ overflow: "visible", ...style }}
  >
    <circle cx="24" cy="24" r="22" stroke={color} strokeOpacity="0.2" />
    {[0, 1, 2].map((index) => (
      <path
        key={index}
        d={`M ${12 + index * 5} ${23 + index * 5} Q 24 ${12 + index * 3} ${36 - index * 5} ${
          23 + index * 5
        }`}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        opacity={clamp((p - index * 0.18) * 2.4)}
      />
    ))}
    <circle cx="24" cy="35" r="3.4" fill={color} opacity={clamp(p * 2)} />
  </svg>
);

export const Spark: React.FC<{ size?: number; color?: string; style?: CSSProperties }> = ({
  size = 30,
  color = C.lime,
  style,
}) => (
  <svg width={size} height={size} viewBox="0 0 40 40" style={style}>
    <path d="M20 2 L23.4 15.6 L37 19 L23.4 22.4 L20 36 L16.6 22.4 L3 19 L16.6 15.6 Z" fill={color} />
  </svg>
);

export const Rule: React.FC<{ width?: number | string; color?: string; style?: CSSProperties }> = ({
  width = "100%",
  color = C.line,
  style,
}) => <div style={{ width, height: 1, background: color, ...style }} />;

export const useCamera = (push = 0.022, drift = 0) => {
  const { frame } = useTime();
  const { durationInFrames } = useVideoConfig();
  const p = durationInFrames <= 1 ? 0 : frame / durationInFrames;
  return {
    transform: `scale(${1 + push + p * push}) translate3d(${drift * p}px, ${-drift * 0.4 * p}px, 0)`,
  };
};

export const SceneStage: React.FC<{ children: ReactNode; style?: CSSProperties }> = ({
  children,
  style,
}) => (
  <AbsoluteFill style={{ overflow: "hidden", backgroundColor: C.black, ...style }}>
    {children}
  </AbsoluteFill>
);
