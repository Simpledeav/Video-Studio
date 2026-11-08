import type { CSSProperties, ReactNode } from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { C, COPY, FONT, MONO } from "../../config/bankTransfer";

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

export const Grain: React.FC<{ opacity?: number }> = ({ opacity = 0.055 }) => (
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
      background: `radial-gradient(ellipse at 50% 42%, transparent 32%, rgba(0,0,0,${0.52 * strength}) 100%),
        linear-gradient(180deg, rgba(0,0,0,${0.42 * strength}) 0%, transparent 18%, transparent 76%, rgba(0,0,0,${0.6 * strength}) 100%)`,
    }}
  />
);

export const GridField: React.FC<{
  opacity?: number;
  size?: number;
  color?: string;
}> = ({ opacity = 0.55, size = 72, color = C.lineSoft }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
      backgroundSize: `${size}px ${size}px`,
      opacity,
      pointerEvents: "none",
      maskImage:
        "radial-gradient(ellipse at 50% 40%, black 6%, rgba(0,0,0,0.55) 58%, transparent 90%)",
      WebkitMaskImage:
        "radial-gradient(ellipse at 50% 40%, black 6%, rgba(0,0,0,0.55) 58%, transparent 90%)",
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
}> = ({ x = "50%", y = "30%", size = 68, color = C.cyan, opacity = 0.12, zIndex = 0 }) => (
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
  opacity = 0.05,
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

/** Soft horizontal light sweep used on scene changes. */
export const Sweep: React.FC<{
  start?: number;
  duration?: number;
  color?: string;
  opacity?: number;
}> = ({ start = 0, duration = 1.6, color = C.cyan, opacity = 0.1 }) => {
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
        filter: "blur(22px)",
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
}> = ({ children, color = C.cyan, background = C.cyanSoft, border, style }) => (
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
/* Phone hardware                                                      */
/* ------------------------------------------------------------------ */

const StatusBar: React.FC<{ scale: number; light?: boolean }> = ({ scale, light = true }) => (
  <div
    style={{
      height: scale * 25,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `0 ${scale * 18}px`,
      color: light ? "rgba(255,255,255,0.92)" : "rgba(8,16,26,0.82)",
      fontFamily: FONT,
      fontSize: scale * 9.6,
      fontWeight: 600,
      letterSpacing: "0.01em",
    }}
  >
    <span>9:41</span>
    <div style={{ display: "flex", alignItems: "center", gap: scale * 5 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: scale * 1.4, height: scale * 8 }}>
        {[0.38, 0.58, 0.78, 1].map((h, i) => (
          <span
            key={i}
            style={{ width: scale * 1.9, height: scale * 8 * h, borderRadius: scale, background: "currentColor" }}
          />
        ))}
      </div>
      <span style={{ fontSize: scale * 9, fontWeight: 700 }}>5G</span>
      <div
        style={{
          width: scale * 17,
          height: scale * 8,
          borderRadius: scale * 2.5,
          border: `1px solid currentColor`,
          padding: scale * 1,
          opacity: 0.9,
        }}
      >
        <div style={{ width: "72%", height: "100%", borderRadius: scale, background: C.green }} />
      </div>
    </div>
  </div>
);

export type PhoneFrameProps = {
  width: number;
  children: ReactNode;
  glow?: string;
  style?: CSSProperties;
  screenStyle?: CSSProperties;
};

export const PhoneFrame: React.FC<PhoneFrameProps> = ({
  width,
  children,
  glow = C.cyan,
  style,
  screenStyle,
}) => {
  const height = width * 2.09;
  const bezel = Math.max(5, width * 0.026);
  const radius = width * 0.148;
  return (
    <div style={{ width, height, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          inset: -width * 0.06,
          borderRadius: radius * 1.24,
          background: `radial-gradient(ellipse at 50% 50%, ${glow}30 0%, transparent 68%)`,
          filter: "blur(18px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: radius,
          background: "linear-gradient(145deg, #46525F 0%, #171D24 28%, #0A0E13 62%, #303A45 100%)",
          boxShadow:
            "0 44px 90px rgba(0,0,0,0.62), 0 8px 22px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.32)",
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
            background: "linear-gradient(180deg, #303A45, #12171D)",
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
            background: "linear-gradient(180deg, #303A45, #12171D)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: radius * 0.9,
            overflow: "hidden",
            background: C.bgNavy,
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
              width: width * 0.245,
              height: width * 0.063,
              borderRadius: width * 0.04,
              background: "#020406",
              boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08)",
              zIndex: 30,
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: radius * 0.9,
              background:
                "linear-gradient(118deg, rgba(255,255,255,0.055) 0%, transparent 26%, transparent 72%, rgba(255,255,255,0.025) 100%)",
              pointerEvents: "none",
              zIndex: 31,
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Fictional banking UI                                                */
/* ------------------------------------------------------------------ */

export const BankMark: React.FC<{
  bank: "sender" | "receiver";
  size?: number;
}> = ({ bank, size = 26 }) => {
  const sender = bank === "sender";
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.26,
        display: "grid",
        placeItems: "center",
        background: sender
          ? "linear-gradient(145deg, #3ADEFF, #0C8FAE)"
          : "linear-gradient(145deg, #7A8FFF, #3B4CC4)",
        color: "#041018",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: size * 0.52,
        boxShadow: `0 4px 12px ${sender ? C.cyan : "#6B7BFF"}33`,
        flexShrink: 0,
      }}
    >
      {sender ? "N" : "M"}
    </div>
  );
};

export const ScreenHeader: React.FC<{
  bank: "sender" | "receiver";
  title: string;
  scale: number;
  right?: ReactNode;
}> = ({ bank, title, scale, right }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: scale * 10,
      padding: `${scale * 8}px ${scale * 17}px ${scale * 12}px`,
      borderBottom: `1px solid ${C.lineSoft}`,
    }}
  >
    <BankMark bank={bank} size={scale * 24} />
    <div style={{ display: "flex", flexDirection: "column", gap: scale * 1 }}>
      <span style={{ fontFamily: FONT, fontSize: scale * 11.5, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>
        {bank === "sender" ? "NORTHSTAR" : "MERIDIAN"}
      </span>
      <span style={{ fontFamily: MONO, fontSize: scale * 7, letterSpacing: "0.14em", color: C.muted }}>
        {title}
      </span>
    </div>
    <div style={{ marginLeft: "auto" }}>{right}</div>
  </div>
);

const CheckRing: React.FC<{ scale: number; color?: string; progress: number }> = ({
  scale,
  color = C.green,
  progress: p,
}) => (
  <div
    style={{
      width: scale * 58,
      height: scale * 58,
      borderRadius: "50%",
      border: `2px solid ${color}`,
      display: "grid",
      placeItems: "center",
      boxShadow: `0 0 ${scale * 22}px ${color}55, inset 0 0 ${scale * 16}px ${color}22`,
      opacity: p,
      transform: `scale(${0.82 + p * 0.18})`,
    }}
  >
    <svg width={scale * 26} height={scale * 26} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 12.5L10 17.4L19 7.6"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="26"
        strokeDashoffset={26 * (1 - p)}
      />
    </svg>
  </div>
);

export const ReceiptScreen: React.FC<{
  scale: number;
  success?: number;
  highlightSession?: number;
}> = ({ scale, success = 1, highlightSession = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #081321 0%, #050B13 100%)" }}>
    <StatusBar scale={scale} />
    <ScreenHeader
      bank="sender"
      title="TRANSFER RECEIPT"
      scale={scale}
      right={
        <div style={{ width: scale * 8, height: scale * 8, borderRadius: "50%", background: C.green, boxShadow: `0 0 ${scale * 8}px ${C.green}` }} />
      }
    />
    <div style={{ padding: `${scale * 18}px ${scale * 17}px 0`, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <CheckRing scale={scale} progress={success} />
      <div
        style={{
          marginTop: scale * 13,
          fontFamily: MONO,
          fontSize: scale * 7.6,
          letterSpacing: "0.2em",
          color: C.muted,
          opacity: success,
        }}
      >
        TRANSFER STATUS
      </div>
      <div
        style={{
          marginTop: scale * 4,
          fontFamily: FONT,
          fontSize: scale * 13,
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: C.green,
          opacity: success,
        }}
      >
        SUCCESSFUL
      </div>
      <div
        style={{
          marginTop: scale * 12,
          fontFamily: FONT,
          fontSize: scale * 31,
          fontWeight: 700,
          letterSpacing: "-0.04em",
          color: C.white,
          opacity: success,
        }}
      >
        ₦250,000
        <span style={{ fontSize: scale * 15, color: C.silver }}>.00</span>
      </div>
      <div style={{ marginTop: scale * 4, fontFamily: MONO, fontSize: scale * 7, color: C.dim, letterSpacing: "0.12em" }}>
        SENT · {COPY.receiptDate}
      </div>
    </div>
    <div
      style={{
        margin: `${scale * 17}px ${scale * 15}px 0`,
        borderRadius: scale * 10,
        border: `1px solid ${highlightSession > 0 ? `${C.cyan}88` : C.lineSoft}`,
        background: highlightSession > 0 ? C.cyanGhost : "rgba(255,255,255,0.022)",
        padding: `${scale * 10}px ${scale * 11}px`,
        boxShadow: highlightSession > 0 ? `0 0 ${scale * 20}px ${C.cyan}22` : "none",
      }}
    >
      {[
        ["TO", `${COPY.receiver} · MERIDIAN BANK`],
        ["FROM", `${COPY.sender} · NORTHSTAR BANK`],
        ["SESSION ID", COPY.sessionId],
      ].map(([label, value]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: scale * 8, padding: `${scale * 4.6}px 0` }}>
          <span style={{ fontFamily: MONO, fontSize: scale * 7, letterSpacing: "0.14em", color: C.dim }}>{label}</span>
          <span
            style={{
              fontFamily: label === "SESSION ID" ? MONO : FONT,
              fontSize: label === "SESSION ID" ? scale * 7.4 : scale * 8.6,
              fontWeight: label === "SESSION ID" ? 600 : 500,
              color: label === "SESSION ID" ? C.cyan : C.white,
              letterSpacing: label === "SESSION ID" ? "0.04em" : "0",
              textAlign: "right",
            }}
          >
            {value}
          </span>
        </div>
      ))}
    </div>
    <div
      style={{
        marginTop: scale * 11,
        textAlign: "center",
        fontFamily: MONO,
        fontSize: scale * 6.8,
        letterSpacing: "0.14em",
        color: C.dim,
      }}
    >
      FUNDS DEBITED · STATUS REPORTED BY SENDING BANK
    </div>
    <div style={{ position: "absolute", left: scale * 16, right: scale * 16, bottom: scale * 16 }}>
      <div
        style={{
          height: scale * 30,
          borderRadius: scale * 8,
          background: "rgba(58,222,255,0.08)",
          border: `1px solid ${C.cyan}33`,
          display: "grid",
          placeItems: "center",
          fontFamily: FONT,
          fontSize: scale * 8.6,
          fontWeight: 600,
          color: C.cyan,
          letterSpacing: "0.1em",
        }}
      >
        SHARE RECEIPT
      </div>
    </div>
  </div>
);

export const ReceiverHomeScreen: React.FC<{
  scale: number;
  emptyPulse?: number;
}> = ({ scale, emptyPulse = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0A1524 0%, #060B13 100%)" }}>
    <StatusBar scale={scale} />
    <ScreenHeader bank="receiver" title="PERSONAL ACCOUNT" scale={scale} />
    <div style={{ padding: `${scale * 18}px ${scale * 17}px 0` }}>
      <div style={{ fontFamily: MONO, fontSize: scale * 7, letterSpacing: "0.16em", color: C.muted }}>
        AVAILABLE BALANCE
      </div>
      <div
        style={{
          marginTop: scale * 6,
          fontFamily: FONT,
          fontSize: scale * 27,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: C.white,
        }}
      >
        ₦86,420<span style={{ fontSize: scale * 15, color: C.silver }}>.55</span>
      </div>
      <div style={{ marginTop: scale * 7, display: "flex", gap: scale * 5, alignItems: "center" }}>
        <span style={{ width: scale * 5, height: scale * 5, borderRadius: "50%", background: C.dim }} />
        <span style={{ fontFamily: MONO, fontSize: scale * 6.8, color: C.muted, letterSpacing: "0.1em" }}>
          NO NEW CREDIT
        </span>
      </div>
    </div>
    <div
      style={{
        margin: `${scale * 16}px ${scale * 15}px 0`,
        height: scale * 88,
        borderRadius: scale * 10,
        border: `1px dashed ${C.line}`,
        background: `rgba(255,255,255,${0.012 + emptyPulse * 0.018})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: scale * 5,
      }}
    >
      <div
        style={{
          width: scale * 22,
          height: scale * 22,
          borderRadius: "50%",
          border: `1px solid ${C.dim}`,
          display: "grid",
          placeItems: "center",
          color: C.dim,
          fontFamily: FONT,
          fontSize: scale * 13,
        }}
      >
        ↓
      </div>
      <div style={{ fontFamily: FONT, fontSize: scale * 8, fontWeight: 500, color: C.muted }}>
        No incoming transaction
      </div>
    </div>
    <div style={{ padding: `${scale * 14}px ${scale * 16}px 0` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: FONT, fontSize: scale * 9.4, fontWeight: 600, color: C.white }}>Recent activity</span>
        <span style={{ fontFamily: MONO, fontSize: scale * 6.6, color: C.dim, letterSpacing: "0.1em" }}>TODAY</span>
      </div>
      {[
        ["Card payment", "− ₦4,200.00", C.silver],
        ["Airtime", "− ₦1,000.00", C.silver],
        ["Transfer out", "− ₦25,000.00", C.silver],
      ].map(([name, amount, color], i) => (
        <div
          key={name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: `${scale * 7}px 0`,
            borderBottom: `1px solid ${C.lineSoft}`,
            opacity: 0.9 - i * 0.08,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: scale * 7 }}>
            <span style={{ width: scale * 15, height: scale * 15, borderRadius: scale * 4, background: "rgba(255,255,255,0.05)" }} />
            <span style={{ fontFamily: FONT, fontSize: scale * 8.2, color: C.silver }}>{name}</span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: scale * 7.2, color }}>{amount}</span>
        </div>
      ))}
    </div>
  </div>
);

export const BankHistoryScreen: React.FC<{
  scale: number;
  reveal?: number;
  balance?: string;
}> = ({ scale, reveal = 1, balance = COPY.receiverAfter }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0A1524 0%, #060B13 100%)" }}>
    <StatusBar scale={scale} />
    <ScreenHeader bank="receiver" title="ACCOUNT HISTORY" scale={scale} />
    <div style={{ padding: `${scale * 15}px ${scale * 17}px 0` }}>
      <div style={{ fontFamily: MONO, fontSize: scale * 7, letterSpacing: "0.16em", color: C.muted }}>
        AVAILABLE BALANCE
      </div>
      <div
        style={{
          marginTop: scale * 5,
          fontFamily: FONT,
          fontSize: scale * 24,
          fontWeight: 600,
          letterSpacing: "-0.04em",
          color: reveal > 0.5 ? C.green : C.white,
          textShadow: reveal > 0.5 ? `0 0 ${scale * 16}px ${C.green}44` : "none",
        }}
      >
        {balance}
      </div>
      <div
        style={{
          marginTop: scale * 4,
          display: "inline-flex",
          alignItems: "center",
          gap: scale * 4,
          padding: `${scale * 3}px ${scale * 6}px`,
          borderRadius: scale * 3,
          background: C.greenSoft,
          opacity: reveal,
        }}
      >
        <span style={{ width: scale * 4, height: scale * 4, borderRadius: "50%", background: C.green }} />
        <span style={{ fontFamily: MONO, fontSize: scale * 6.2, color: C.green, letterSpacing: "0.09em" }}>
          BALANCE UPDATED
        </span>
      </div>
    </div>
    <div style={{ margin: `${scale * 13}px ${scale * 15}px 0` }}>
      <div style={{ fontFamily: MONO, fontSize: scale * 6.6, letterSpacing: "0.14em", color: C.dim, marginBottom: scale * 5 }}>
        TRANSACTION HISTORY
      </div>
      <div
        style={{
          borderRadius: scale * 9,
          border: `1px solid ${C.green}33`,
          background: C.greenSoft,
          padding: `${scale * 9}px ${scale * 10}px`,
          opacity: reveal,
          transform: `translateY(${(1 - reveal) * scale * 8}px)`,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: FONT, fontSize: scale * 9.2, fontWeight: 600, color: C.white }}>
            Incoming transfer
          </span>
          <span style={{ fontFamily: MONO, fontSize: scale * 8.6, fontWeight: 700, color: C.green }}>+₦250,000.00</span>
        </div>
        <div style={{ marginTop: scale * 3, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontFamily: FONT, fontSize: scale * 7.4, color: C.silver }}>AMARA O. · NORTHSTAR BANK</span>
          <span style={{ fontFamily: MONO, fontSize: scale * 6.4, color: C.muted }}>09:41</span>
        </div>
        <div style={{ marginTop: scale * 5, display: "flex", alignItems: "center", gap: scale * 4 }}>
          <span style={{ width: scale * 4, height: scale * 4, borderRadius: "50%", background: C.green }} />
          <span style={{ fontFamily: MONO, fontSize: scale * 6.2, letterSpacing: "0.08em", color: C.green }}>COMPLETED</span>
          <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: scale * 6.2, color: C.dim }}>{COPY.sessionId}</span>
        </div>
      </div>
      {[
        ["Transfer out", "− ₦25,000.00"],
        ["Card payment", "− ₦4,200.00"],
      ].map(([name, amount]) => (
        <div
          key={name}
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: `${scale * 8}px ${scale * 2}px`,
            borderBottom: `1px solid ${C.lineSoft}`,
            opacity: 0.5 * reveal,
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: scale * 8, color: C.silver }}>{name}</span>
          <span style={{ fontFamily: MONO, fontSize: scale * 7, color: C.muted }}>{amount}</span>
        </div>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        left: scale * 15,
        right: scale * 15,
        bottom: scale * 15,
        borderRadius: scale * 7,
        border: `1px solid ${C.amber}33`,
        background: C.amberSoft,
        padding: `${scale * 6}px ${scale * 8}px`,
        display: "flex",
        alignItems: "center",
        gap: scale * 6,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: scale * 7.4, color: C.amber }}>!</span>
      <span style={{ fontFamily: FONT, fontSize: scale * 6.9, color: C.amber }}>No SMS alert was delivered for this credit.</span>
    </div>
  </div>
);

export const NoSmsScreen: React.FC<{ scale: number; pulse?: number }> = ({ scale, pulse = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #10131A 0%, #05080D 100%)" }}>
    <StatusBar scale={scale} />
    <div style={{ padding: `${scale * 12}px ${scale * 16}px 0`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontFamily: FONT, fontSize: scale * 9, color: C.silver }}>Messages</span>
      <span style={{ fontFamily: MONO, fontSize: scale * 6.8, color: C.dim, letterSpacing: "0.1em" }}>SMS</span>
    </div>
    <div
      style={{
        margin: `${scale * 12}px ${scale * 14}px 0`,
        height: scale * 122,
        borderRadius: scale * 12,
        border: `1px dashed ${C.line}`,
        background: `rgba(255,255,255,${0.01 + pulse * 0.022})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: scale * 7,
      }}
    >
      <div
        style={{
          width: scale * 34,
          height: scale * 34,
          borderRadius: scale * 9,
          border: `1px solid ${C.dim}`,
          display: "grid",
          placeItems: "center",
          color: C.dim,
          fontFamily: FONT,
          fontSize: scale * 17,
        }}
      >
        ✕
      </div>
      <span style={{ fontFamily: FONT, fontSize: scale * 10, fontWeight: 500, color: C.silver }}>No new SMS</span>
      <span style={{ fontFamily: MONO, fontSize: scale * 6.6, color: C.dim, letterSpacing: "0.08em" }}>NO CREDIT ALERT RECEIVED</span>
    </div>
    <div style={{ padding: `${scale * 14}px ${scale * 16}px 0` }}>
      <div style={{ fontFamily: MONO, fontSize: scale * 6.6, letterSpacing: "0.14em", color: C.dim }}>TODAY</div>
      {[
        ["Northstar Bank", "Your transfer of ₦250,000.00 was successful.", "09:41"],
        ["Meridian Bank", "Your account was debited ₦4,200.00.", "08:12"],
      ].map(([from, body, time], i) => (
        <div
          key={from}
          style={{
            marginTop: scale * 9,
            padding: `${scale * 8}px ${scale * 9}px`,
            borderRadius: scale * 8,
            background: i === 0 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.022)",
            border: `1px solid ${C.lineSoft}`,
            opacity: i === 0 ? 0.9 : 0.5,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontFamily: FONT, fontSize: scale * 7.6, fontWeight: 600, color: C.white }}>{from}</span>
            <span style={{ fontFamily: MONO, fontSize: scale * 6, color: C.dim }}>{time}</span>
          </div>
          <div style={{ marginTop: scale * 3, fontFamily: FONT, fontSize: scale * 7.2, lineHeight: 1.4, color: C.silver }}>{body}</div>
        </div>
      ))}
    </div>
  </div>
);

export const ComplaintScreen: React.FC<{
  scale: number;
  submitted?: number;
}> = ({ scale, submitted = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0A1524 0%, #060B13 100%)" }}>
    <StatusBar scale={scale} />
    <ScreenHeader bank="receiver" title="SUPPORT" scale={scale} />
    <div style={{ padding: `${scale * 18}px ${scale * 17}px 0` }}>
      <div style={{ fontFamily: FONT, fontSize: scale * 15, fontWeight: 600, color: C.white, letterSpacing: "-0.02em" }}>
        Dispute a transfer
      </div>
      <div style={{ marginTop: scale * 4, fontFamily: FONT, fontSize: scale * 7.6, lineHeight: 1.45, color: C.muted }}>
        Tell us which transaction you want us to trace.
      </div>
      <div style={{ marginTop: scale * 12, display: "flex", flexDirection: "column", gap: scale * 7 }}>
        {[
          ["TRANSACTION REFERENCE", COPY.sessionId],
          ["REASON", "Transfer not received"],
          ["AMOUNT", "₦250,000.00"],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              borderRadius: scale * 7,
              border: `1px solid ${C.lineSoft}`,
              background: "rgba(255,255,255,0.025)",
              padding: `${scale * 7}px ${scale * 9}px`,
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: scale * 5.8, letterSpacing: "0.13em", color: C.dim }}>{label}</div>
            <div style={{ marginTop: scale * 3, fontFamily: label === "REASON" ? FONT : MONO, fontSize: scale * 7.8, color: C.white }}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          marginTop: scale * 12,
          height: scale * 32,
          borderRadius: scale * 8,
          background: submitted > 0 ? C.greenSoft : C.cyanSoft,
          border: `1px solid ${submitted > 0 ? C.green : C.cyan}55`,
          display: "grid",
          placeItems: "center",
          fontFamily: FONT,
          fontSize: scale * 9,
          fontWeight: 600,
          color: submitted > 0 ? C.green : C.cyan,
          letterSpacing: "0.06em",
        }}
      >
        {submitted > 0 ? "COMPLAINT SUBMITTED" : "SUBMIT COMPLAINT"}
      </div>
      <div
        style={{
          marginTop: scale * 10,
          borderRadius: scale * 8,
          border: `1px solid ${C.green}33`,
          background: C.greenSoft,
          padding: `${scale * 8}px ${scale * 9}px`,
          opacity: submitted,
          transform: `translateY(${(1 - submitted) * scale * 8}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: scale * 5.8, letterSpacing: "0.13em", color: C.green }}>TICKET NUMBER</div>
        <div style={{ marginTop: scale * 3, fontFamily: MONO, fontSize: scale * 9.6, fontWeight: 600, color: C.white }}>CMP-2026-0417</div>
        <div style={{ marginTop: scale * 3, fontFamily: FONT, fontSize: scale * 6.6, color: C.muted }}>Keep this reference for follow-up.</div>
      </div>
    </div>
  </div>
);

/** Small 3D card used as a supporting object. */
export const MiniCard: React.FC<{
  width: number;
  bank?: "sender" | "receiver";
  style?: CSSProperties;
}> = ({ width, bank = "sender", style }) => (
  <div
    style={{
      width,
      height: width * 0.62,
      borderRadius: width * 0.075,
      background:
        bank === "sender"
          ? "linear-gradient(135deg, #123A4A 0%, #0A1B2A 54%, #163A47 100%)"
          : "linear-gradient(135deg, #20294F 0%, #0C1228 54%, #26305C 100%)",
      border: `1px solid ${bank === "sender" ? C.cyan : "#7A8FFF"}33`,
      boxShadow: `0 ${width * 0.1}px ${width * 0.22}px rgba(0,0,0,0.48), inset 0 1px 0 rgba(255,255,255,0.12)`,
      padding: width * 0.08,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontFamily: FONT, fontSize: width * 0.055, fontWeight: 700, letterSpacing: "0.1em", color: C.white }}>
        {bank === "sender" ? "NORTHSTAR" : "MERIDIAN"}
      </span>
      <BankMark bank={bank} size={width * 0.105} />
    </div>
    <div>
      <div style={{ width: width * 0.15, height: width * 0.105, borderRadius: width * 0.018, background: "linear-gradient(135deg,#FFD98A,#C99A45)", opacity: 0.85 }} />
      <div style={{ marginTop: width * 0.035, fontFamily: MONO, fontSize: width * 0.045, letterSpacing: "0.18em", color: "rgba(255,255,255,0.72)" }}>
        •••• 5521
      </div>
    </div>
  </div>
);
