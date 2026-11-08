import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { C, FONT, IMG, MONO, useStage } from "../../config/mcdonalds";
import {
  clamp,
  lerp,
  progress,
  seeded,
  useTime,
} from "./kit";

export const file = (path: string) => staticFile(path.replace(/^\//, ""));

/* ------------------------------------------------------------------ */
/* Brand marks                                                         */
/* ------------------------------------------------------------------ */

export const Arches: React.FC<{
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}> = ({ size = 120, color = C.yellow, opacity = 1, style }) => (
  <svg
    viewBox="0 0 272.7 238.5"
    width={size}
    height={(size * 238.5) / 272.7}
    style={{ display: "block", opacity, ...style }}
    aria-label="McDonald's Golden Arches"
  >
    <path
      fill={color}
      d="m195.8 17.933c23.3 0 42.2 98.3 42.2 219.7h34c0-130.7-34.3-236.5-76.3-236.5-24 0-45.2 31.7-59.2 81.5-14-49.8-35.2-81.5-59-81.5-42 0-76.2 105.7-76.2 236.4h34c0-121.4 18.7-219.6 42-219.6s42.2 90.8 42.2 202.8h33.8c0-112 19-202.8 42.3-202.8"
    />
  </svg>
);

export const IBMWordmark: React.FC<{
  width?: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ width = 120, opacity = 1, style }) => (
  <Img
    src={file(IMG.ibm)}
    style={{
      width,
      height: "auto",
      display: "block",
      opacity,
      filter: "brightness(1.1)",
      ...style,
    }}
  />
);

export const McDonaldsWordmark: React.FC<{
  size?: number;
  color?: string;
  opacity?: number;
  style?: CSSProperties;
}> = ({ size = 28, color = C.white, opacity = 1, style }) => (
  <div
    style={{
      fontFamily: FONT,
      fontSize: size,
      fontWeight: 700,
      letterSpacing: "-0.04em",
      color,
      opacity,
      lineHeight: 1,
      ...style,
    }}
  >
    McDonald&apos;s
  </div>
);

/* ------------------------------------------------------------------ */
/* Audio / AI                                                          */
/* ------------------------------------------------------------------ */

export const Waveform: React.FC<{
  t: number;
  active?: boolean;
  color?: string;
  width?: number;
  height?: number;
  bars?: number;
  seed?: number;
  idle?: number;
}> = ({
  t,
  active = true,
  color = C.yellow,
  width = 260,
  height = 42,
  bars = 34,
  seed = 7,
  idle = 0.18,
}) => (
  <div
    style={{
      width,
      height,
      display: "flex",
      alignItems: "center",
      gap: 3,
      overflow: "hidden",
    }}
  >
    {Array.from({ length: bars }, (_, index) => {
      const base = seeded(index + seed);
      const wave = active
        ? 0.35 + Math.abs(Math.sin(t * 7.2 + index * 0.62 + base * 4)) * 0.65
        : idle + base * idle;
      const value = clamp(wave * (0.55 + base * 0.8));
      return (
        <div
          key={index}
          style={{
            flex: 1,
            height: Math.max(2, value * height),
            borderRadius: 2,
            background: color,
            opacity: active ? 0.85 : 0.35,
          }}
        />
      );
    })}
  </div>
);

/* ------------------------------------------------------------------ */
/* Order screen                                                        */
/* ------------------------------------------------------------------ */

export const ScreenFrame: React.FC<{
  children: ReactNode;
  width?: number;
  style?: CSSProperties;
  accent?: string;
  scale?: number;
  glow?: boolean;
}> = ({ children, width = 520, style, accent = C.yellow, scale = 1, glow = true }) => (
  <div
    style={{
      width,
      border: `1px solid rgba(247,243,234,0.16)`,
      borderRadius: 8,
      background:
        "linear-gradient(180deg, rgba(24,24,29,0.998) 0%, rgba(9,9,12,0.998) 100%)",
      boxShadow: glow
        ? `0 34px 90px rgba(0,0,0,0.62), 0 0 0 1px ${accent}12, 0 0 58px ${accent}10`
        : "0 30px 80px rgba(0,0,0,0.6)",
      overflow: "hidden",
      transform: `scale(${scale})`,
      transformOrigin: "center center",
      ...style,
    }}
  >
    {children}
  </div>
);

export const ScreenHeader: React.FC<{
  title?: string;
  status?: string;
  accent?: string;
  warning?: boolean;
}> = ({
  title = "DRIVE-THRU · ORDER 0421",
  status = "LIVE",
  accent = C.yellow,
  warning = false,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px",
      background: "rgba(255,255,255,0.025)",
      borderBottom: `1px solid rgba(247,243,234,0.09)`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: warning ? C.red : accent,
          boxShadow: `0 0 10px ${warning ? C.red : accent}`,
        }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.16em",
          color: C.bone,
        }}
      >
        {title}
      </span>
    </div>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.18em",
        color: warning ? C.redBright : accent,
        border: `1px solid ${warning ? "rgba(218,26,50,0.45)" : `${accent}44`}`,
        background: warning ? C.redSoft : `${accent}12`,
        borderRadius: 3,
        padding: "4px 7px",
      }}
    >
      {status}
    </span>
  </div>
);

export const ScreenCustomerLine: React.FC<{
  text: string;
  t: number;
  listen?: boolean;
  color?: string;
  compact?: boolean;
}> = ({ text, t, listen = true, color = C.yellow, compact = false }) => (
  <div style={{ padding: compact ? "12px 16px 10px" : "16px 18px 14px" }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: compact ? 15 : 17,
          fontWeight: 500,
          color: C.bone,
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
        }}
      >
        {text}
      </div>
      <Waveform
        t={t}
        active={listen}
        color={color}
        width={compact ? 76 : 96}
        height={compact ? 22 : 26}
        bars={14}
        seed={11}
      />
    </div>
  </div>
);

export const ScreenRow: React.FC<{
  name: string;
  qty: string;
  appear: number;
  accent?: string;
  muted?: boolean;
  compact?: boolean;
  shake?: number;
}> = ({ name, qty, appear, accent = C.yellow, muted = false, compact = false, shake = 0 }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 14,
      padding: compact ? "10px 16px" : "13px 18px",
      borderTop: `1px solid rgba(247,243,234,0.06)`,
      opacity: appear,
      transform: `translateX(${(1 - appear) * 18 + Math.sin(shake * 34) * shake * 5}px)`,
      background:
        accent === C.red
          ? `rgba(218,26,50,${0.06 + shake * 0.08})`
          : "transparent",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: muted ? C.dim : accent,
          flexShrink: 0,
          boxShadow: muted ? "none" : `0 0 8px ${accent}`,
        }}
      />
      <span
        style={{
          fontFamily: MONO,
          fontSize: compact ? 10 : 11,
          letterSpacing: "0.12em",
          color: muted ? C.muted : C.bone,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {name}
      </span>
    </div>
    <span
      style={{
        fontFamily: FONT,
        fontSize: compact ? 16 : 18,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: muted ? C.muted : accent,
        whiteSpace: "nowrap",
      }}
    >
      {qty}
    </span>
  </div>
);

export const ScreenError: React.FC<{
  text: string;
  appear: number;
  color?: string;
}> = ({ text, appear, color = C.redBright }) => (
  <div
    style={{
      margin: 14,
      padding: "10px 12px",
      border: `1px solid ${color}66`,
      background: `${color}14`,
      borderRadius: 4,
      display: "flex",
      alignItems: "center",
      gap: 9,
      opacity: appear,
      transform: `translateY(${(1 - appear) * 8}px)`,
    }}
  >
    <span
      style={{
        width: 16,
        height: 16,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        color,
        fontFamily: MONO,
        fontSize: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      !
    </span>
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.12em",
        color,
      }}
    >
      {text}
    </span>
  </div>
);

export const ScreenFooter: React.FC<{
  label?: string;
  value?: string;
  accent?: string;
}> = ({ label = "TOTAL", value = "—", accent = C.yellow }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 18px 16px",
      borderTop: `1px solid rgba(247,243,234,0.09)`,
      background: "rgba(255,255,255,0.02)",
    }}
  >
    <span
      style={{
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.2em",
        color: C.muted,
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: FONT,
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: "-0.02em",
        color: accent,
      }}
    >
      {value}
    </span>
  </div>
);

/* ------------------------------------------------------------------ */
/* Order-flow diagram                                                  */
/* ------------------------------------------------------------------ */

const FlowIcon: React.FC<{ kind: "speak" | "ai" | "kitchen"; color: string }> = ({
  kind,
  color,
}) => {
  if (kind === "speak") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="9" y="3" width="10" height="15" rx="5" stroke={color} strokeWidth="1.5" />
        <path d="M5 13a9 9 0 0 0 18 0" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 22v3M10 25h8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "ai") {
    return (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="4" y="7" width="20" height="15" rx="3" stroke={color} strokeWidth="1.5" />
        <path d="M10 12v5M14 10v9M18 13v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 3v4" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d="M4 11h20l-2 12H6L4 11Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M4 11 6 5h16l2 6" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M11 16v3M17 16v3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export const FlowDiagram: React.FC<{
  t: number;
  start: number;
  labels: readonly [string, string, string];
  wide?: boolean;
  color?: string;
}> = ({ t, start, labels, wide = false, color = C.yellow }) => {
  const kinds = ["speak", "ai", "kitchen"] as const;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: wide ? "row" : "column",
        alignItems: "stretch",
        gap: wide ? 10 : 9,
        width: "100%",
      }}
    >
      {labels.map((label, index) => {
        const p = progress(t, start + index * 0.55, 0.55);
        return (
          <div
            key={label}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: wide ? "column" : "row",
              alignItems: "center",
              gap: wide ? 12 : 14,
              padding: wide ? "18px 14px" : "13px 14px",
              border: `1px solid ${C.line}`,
              borderRadius: 5,
              background: "rgba(10,10,13,0.7)",
              opacity: p,
              transform: `translateY(${(1 - p) * 12}px)`,
              minHeight: wide ? 130 : 58,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 21,
                border: `1px solid ${color}55`,
                background: `${color}10`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FlowIcon kind={kinds[index]} color={color} />
            </div>
            <div
              style={{
                fontFamily: MONO,
                fontSize: wide ? 10 : 10,
                letterSpacing: "0.16em",
                color: C.bone,
                lineHeight: 1.5,
                textAlign: wide ? "center" : "left",
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Timeline                                                            */
/* ------------------------------------------------------------------ */

export const Timeline: React.FC<{
  t: number;
  start: number;
  steps: readonly { year: string; label: string }[];
  wide?: boolean;
  accent?: string;
  turn?: number;
}> = ({ t, start, steps, wide = false, accent = C.yellow, turn = 0 }) => {
  const lineP = progress(t, start, 1.4);
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <div
        style={{
          position: "absolute",
          left: wide ? 0 : 9,
          right: 0,
          top: wide ? 10 : 10,
          height: 1,
          background: C.line,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: wide ? 0 : 9,
          top: wide ? 10 : 10,
          width: wide ? `${lineP * 100}%` : 1,
          height: wide ? 1 : `${lineP * 100}%`,
          background: `linear-gradient(90deg, ${accent}, ${C.blue})`,
          boxShadow: `0 0 12px ${accent}55`,
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: wide ? "row" : "column",
          gap: wide ? 0 : 18,
          justifyContent: "space-between",
        }}
      >
        {steps.map((step, index) => {
          const p = progress(t, start + 0.35 + index * 0.5, 0.5);
          const active = turn > 0 && index === steps.length - 1;
          return (
            <div
              key={step.year}
              style={{
                position: "relative",
                paddingLeft: wide ? 0 : 34,
                paddingTop: wide ? 34 : 0,
                flex: wide ? 1 : undefined,
                opacity: p,
                transform: `translateY(${(1 - p) * 10}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: wide ? 0 : 2,
                  top: wide ? 3 : 3,
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                  border: `1px solid ${active ? C.yellow : accent}`,
                  background: active ? C.yellow : C.black,
                  boxShadow: `0 0 14px ${active ? C.yellow : accent}66`,
                }}
              />
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: wide ? 38 : 34,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: active ? C.yellow : C.white,
                  lineHeight: 1,
                }}
              >
                {step.year}
              </div>
              <div
                style={{
                  marginTop: 6,
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.18em",
                  color: active ? C.yellow : C.muted,
                }}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Social / headline cards                                             */
/* ------------------------------------------------------------------ */

export const SocialCard: React.FC<{
  quote: string;
  source: string;
  start: number;
  style?: CSSProperties;
  accent?: string;
  index?: number;
}> = ({ quote, source, start, style, accent = C.redBright, index = 0 }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.55);
  return (
    <div
      style={{
        padding: "15px 16px 14px",
        border: `1px solid ${C.line}`,
        borderRadius: 6,
        background: "rgba(15,15,18,0.94)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) rotate(${(index % 2 === 0 ? -1 : 1) * (1 - p) * 1.6}deg)`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: `${accent}22`,
            border: `1px solid ${accent}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: MONO,
            fontSize: 8,
            color: accent,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 8,
            letterSpacing: "0.18em",
            color: C.muted,
          }}
        >
          REPORTED · SOCIAL VIDEO
        </span>
      </div>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 15,
          fontWeight: 500,
          lineHeight: 1.38,
          color: C.bone,
          letterSpacing: "-0.01em",
        }}
      >
        {quote}
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: MONO,
          fontSize: 8,
          letterSpacing: "0.14em",
          color: accent,
        }}
      >
        {source}
      </div>
    </div>
  );
};

export const HeadlineCard: React.FC<{
  kicker: string;
  headline: string;
  source: string;
  start: number;
  accent?: string;
  style?: CSSProperties;
}> = ({ kicker, headline, source, start, accent = C.yellow, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.6);
  return (
    <div
      style={{
        borderTop: `2px solid ${accent}`,
        paddingTop: 10,
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: MONO,
          fontSize: 8,
          letterSpacing: "0.2em",
          color: accent,
        }}
      >
        {kicker}
      </div>
      <div
        style={{
          marginTop: 7,
          fontFamily: FONT,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: C.white,
          textTransform: "uppercase",
        }}
      >
        {headline}
      </div>
      <div
        style={{
          marginTop: 7,
          fontFamily: MONO,
          fontSize: 8,
          letterSpacing: "0.14em",
          color: C.dim,
        }}
      >
        {source}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Design protocol                                                     */
/* ------------------------------------------------------------------ */

export const ProtocolRow: React.FC<{
  id: string;
  title: string;
  body: string;
  appear: number;
  accent?: string;
  compact?: boolean;
  active?: boolean;
}> = ({ id, title, body, appear, accent = C.green, compact = false, active = false }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: compact ? "10px 12px" : "12px 14px",
      border: `1px solid ${active ? `${accent}66` : C.line}`,
      borderRadius: 5,
      background: active ? `${accent}0F` : "rgba(9,9,11,0.55)",
      opacity: appear,
      transform: `translateY(${(1 - appear) * 14}px)`,
    }}
  >
    <span
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        border: `1px solid ${accent}66`,
        background: `${accent}12`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: MONO,
        fontSize: 8,
        color: accent,
        flexShrink: 0,
      }}
    >
      {id}
    </span>
    <div style={{ minWidth: 0 }}>
      <div
        style={{
          fontFamily: MONO,
          fontSize: compact ? 9 : 10,
          letterSpacing: "0.18em",
          color: active ? accent : C.white,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 3,
          fontFamily: FONT,
          fontSize: compact ? 10 : 11,
          fontWeight: 400,
          lineHeight: 1.35,
          color: C.muted,
        }}
      >
        {body}
      </div>
    </div>
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      style={{ marginLeft: "auto", flexShrink: 0, opacity: appear * 0.9 }}
    >
      <path
        d="M4 9.5 7.2 12.6 14 5.4"
        stroke={accent}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

/* ------------------------------------------------------------------ */
/* Small food glyphs                                                   */
/* ------------------------------------------------------------------ */

export const CupGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = C.red,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M7 6h14l-1.7 18H8.7L7 6Z" stroke={color} strokeWidth="1.4" />
    <path d="M6 10h16" stroke={color} strokeWidth="1.4" />
    <path d="M12 3h4" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    <path d="M10 14h8" stroke={color} strokeWidth="1.1" opacity="0.6" />
  </svg>
);

export const ConeGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = C.yellow,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M9 12h10l-5 13-5-13Z" stroke={color} strokeWidth="1.3" />
    <path
      d="M9.5 12c1-5 8-5 9 0M11 8.5c1.5-4 5.5-4 6.5 0"
      stroke={color}
      strokeWidth="1.3"
      strokeLinecap="round"
    />
  </svg>
);

export const ButterGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = C.yellow,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M5 12 8 7h13l2 5v8H5v-8Z" stroke={color} strokeWidth="1.3" />
    <path d="M5 12h18M10 7v5M17 7v5" stroke={color} strokeWidth="1.2" />
  </svg>
);

export const KetchupGlyph: React.FC<{ size?: number; color?: string }> = ({
  size = 28,
  color = C.red,
}) => (
  <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <path d="M10 8h8v17h-8V8Z" stroke={color} strokeWidth="1.3" />
    <path d="M12 8V5h4v3M12 3h4" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    <path d="M10 12h8" stroke={color} strokeWidth="1.1" opacity="0.6" />
  </svg>
);

export const LocationDots: React.FC<{
  t: number;
  start: number;
  count?: number;
  color?: string;
  columns?: number;
  gap?: number;
  dot?: number;
  wide?: boolean;
}> = ({
  t,
  start,
  count = 100,
  color = C.yellow,
  columns = 20,
  gap = 7,
  dot = 5,
  wide = false,
}) => {
  const { width } = useStage();
  const visible = Math.floor(progress(t, start, 1.6) * count);
  const cols = wide ? columns : Math.min(columns, 14);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, ${dot}px)`,
        gap,
        opacity: 0.95,
        maxWidth: wide ? width * 0.6 : undefined,
      }}
    >
      {Array.from({ length: count }, (_, index) => {
        const on = index < visible;
        return (
          <span
            key={index}
            style={{
              width: dot,
              height: dot,
              borderRadius: "50%",
              background: on ? color : "rgba(247,243,234,0.1)",
              boxShadow: on ? `0 0 6px ${color}55` : "none",
              }}
          />
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export const CountUp: React.FC<{
  value: number;
  start: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  style?: CSSProperties;
}> = ({ value, start, duration = 1.1, suffix = "", prefix = "", style }) => {
  const { t } = useTime();
  const p = progress(t, start, duration, (x) => x);
  const shown = Math.round(lerp(0, value, p));
  return (
    <span style={style}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
};
