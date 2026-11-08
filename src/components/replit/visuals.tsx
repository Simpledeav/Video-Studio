import type { CSSProperties, ReactNode } from "react";
import { C, FONT, MONO } from "../../config/replit";
import {
  ActivityBars,
  clamp,
  Counter,
  Dot,
  easeInOut,
  Mono,
  Panel,
  PanelHeader,
  progress,
  seeded,
  StatusRow,
  Tag,
  useTime,
} from "./kit";

/* ------------------------------------------------------------------ */
/* Ambient data field                                                  */
/* ------------------------------------------------------------------ */

const DATA_GLYPHS = [
  "0x7F3A",
  "CONTACT",
  "ORG",
  "SYNC",
  "2025-07",
  "ROW",
  "COMMIT",
  "PROD",
  "0000",
  "INDEX",
  "QUERY",
  "DB",
];

export const DataRain: React.FC<{
  opacity?: number;
  color?: string;
  columns?: number;
  start?: number;
  speed?: number;
  style?: CSSProperties;
}> = ({ opacity = 0.16, color = C.cyan, columns = 6, start = 0, speed = 1, style }) => {
  const { frame, fps } = useTime();
  const t = Math.max(0, frame / fps - start);
  return (
    <div
      style={{
        position: "absolute",
        inset: -60,
        display: "flex",
        gap: "6%",
        paddingLeft: "2%",
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
        ...style,
      }}
    >
      {new Array(columns).fill(0).map((_, col) => {
        const colSpeed = (10 + col * 4) * speed;
        const offset = (t * colSpeed * 28) % 640;
        return (
          <div
            key={col}
            style={{
              flex: 1,
              transform: `translateY(${-offset}px)`,
              fontFamily: MONO,
              fontSize: 10,
              lineHeight: 2.1,
              color,
              whiteSpace: "nowrap",
            }}
          >
            {new Array(38).fill(0).map((__, i) => {
              const glyph = DATA_GLYPHS[Math.floor(seeded(col * 31 + i) * DATA_GLYPHS.length)];
              return (
                <div
                  key={i}
                  style={{
                    opacity:
                      0.12 +
                      0.5 * Math.abs(Math.sin((i + col * 3) * 0.4)) *
                        (i % 5 === 0 ? 1 : 0.55),
                  }}
                >
                  {glyph}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Database cylinder                                                   */
/* ------------------------------------------------------------------ */

export const DatabaseCylinder: React.FC<{
  size?: number;
  start?: number;
  health?: number;
  drain?: number;
  label?: string;
  accent?: string;
  style?: CSSProperties;
}> = ({
  size = 360,
  start = 0,
  health = 1,
  drain = 0,
  label = "CONTACTS",
  accent = C.cyan,
  style,
}) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.8);
  const t = frame / fps;
  const levels = 8;
  const visible = Math.max(0, Math.round((1 - drain) * levels));
  const barColor = drain > 0.55 ? C.red : drain > 0.25 ? C.orange : accent;
  const w = size;
  const h = size * 1.18;
  const cx = w / 2;
  const rx = w * 0.37;
  const ry = w * 0.11;
  const top = h * 0.2;
  const bottom = h * 0.82;

  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        opacity: p,
        transform: `translateY(${(1 - p) * 24}px)`,
        filter: `drop-shadow(0 30px 60px rgba(0,0,0,0.55))`,
        ...style,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`db-body-${start}-${size}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(8,11,16,0.96)" />
            <stop offset="38%" stopColor="rgba(27,34,44,0.98)" />
            <stop offset="62%" stopColor="rgba(20,26,34,0.98)" />
            <stop offset="100%" stopColor="rgba(6,8,12,0.98)" />
          </linearGradient>
          <linearGradient id={`db-glow-${start}-${size}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={barColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={barColor} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        <ellipse cx={cx} cy={bottom + ry * 0.6} rx={rx * 1.2} ry={ry * 0.8} fill={barColor} opacity={0.1} />
        <rect
          x={cx - rx}
          y={top}
          width={rx * 2}
          height={bottom - top}
          fill={`url(#db-body-${start}-${size})`}
          stroke={`${barColor}55`}
          strokeWidth={1.2}
        />
        <ellipse
          cx={cx}
          cy={top}
          rx={rx}
          ry={ry}
          fill="rgba(20,27,36,0.98)"
          stroke={barColor}
          strokeWidth={1.4}
          opacity={0.9}
        />
        <ellipse
          cx={cx}
          cy={top}
          rx={rx * 0.78}
          ry={ry * 0.62}
          fill="none"
          stroke={`${barColor}55`}
          strokeWidth={1}
        />
        <ellipse
          cx={cx}
          cy={bottom}
          rx={rx}
          ry={ry}
          fill="rgba(9,12,17,0.98)"
          stroke={`${barColor}55`}
          strokeWidth={1.2}
        />

        {new Array(levels).fill(0).map((_, i) => {
          if (i >= visible) return null;
          const y = top + ((i + 1) / (levels + 1)) * (bottom - top);
          const levelP = clamp((1 - drain) * levels - i);
          return (
            <g key={i} opacity={0.25 + levelP * 0.75}>
              <ellipse
                cx={cx}
                cy={y}
                rx={rx * 0.92}
                ry={ry * 0.7}
                fill="none"
                stroke={`${barColor}44`}
                strokeWidth={0.8}
              />
              <rect
                x={cx - rx * 0.7}
                y={y - 1}
                width={rx * 1.4 * (0.35 + 0.65 * levelP)}
                height={2}
                fill={barColor}
                opacity={0.22 + 0.4 * levelP}
              />
            </g>
          );
        })}

        <ellipse
          cx={cx}
          cy={top + ((bottom - top) * (0.15 + (t * 0.12) % 0.7))}
          rx={rx * 0.96}
          ry={ry * 0.72}
          fill={barColor}
          opacity={0.06}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: h * 0.44,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: size * 0.037,
            letterSpacing: "0.2em",
            color: barColor,
            opacity: 0.95,
          }}
        >
          {label}
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: FONT,
            fontSize: size * 0.085,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.white,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          <Counter value={1206 * health} start={start + 0.2} duration={1.1} grouping />
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: MONO,
            fontSize: size * 0.027,
            letterSpacing: "0.16em",
            color: drain > 0.5 ? C.red : C.dim,
          }}
        >
          {drain > 0.5 ? "ROWS LOST" : "RECORDS"}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: cx - rx * 0.5,
          width: rx,
          bottom: h * 0.02,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: 0.8,
        }}
      >
        <Mono size={size * 0.026} color={barColor}>
          ● LIVE
        </Mono>
        <ActivityBars
          color={barColor}
          width={size * 0.12}
          height={size * 0.04}
          bars={5}
          start={start}
        />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Realistic production database dashboard                             */
/* ------------------------------------------------------------------ */

const ROLES = [
  "VP · OPERATIONS",
  "HEAD · REVENUE",
  "DIRECTOR · PRODUCT",
  "FOUNDER · SAAS",
  "VP · ENGINEERING",
  "PARTNER · GROWTH",
  "HEAD · FINANCE",
  "DIRECTOR · SALES",
];

export const ContactRows: React.FC<{
  count?: number;
  start?: number;
  vanishAt?: number;
  vanishDuration?: number;
  rowHeight?: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({
  count = 7,
  start = 0,
  vanishAt,
  vanishDuration = 1.1,
  rowHeight = 64,
  opacity = 1,
  style,
}) => {
  const { frame, fps } = useTime();
  return (
    <div style={{ width: "100%", opacity, ...style }}>
      {new Array(count).fill(0).map((_, i) => {
        const p = progress(frame, fps, start + i * 0.075, 0.45);
        const gone =
          vanishAt === undefined
            ? 0
            : clamp((frame / fps - vanishAt - i * 0.09) / vanishDuration);
        return (
          <div
            key={i}
            style={{
              height: rowHeight,
              display: "flex",
              alignItems: "center",
              gap: 12,
              borderBottom: `1px solid ${C.lineSoft}`,
              opacity: p * (1 - gone),
              transform: `translateX(${(1 - p) * -16 + gone * 28}px) scaleY(${1 - gone * 0.75})`,
              filter: gone > 0.25 ? `blur(${gone * 2.4}px)` : "none",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: `1px solid ${C.line}`,
                background: `linear-gradient(135deg, ${C.cyanGhost}, rgba(255,255,255,0.03))`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: MONO,
                fontSize: 9,
                color: C.cyan,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: C.silver,
                  whiteSpace: "nowrap",
                }}
              >
                EXEC-{String(1040 + i * 17).padStart(4, "0")}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  color: C.dim,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {ROLES[i % ROLES.length]}
              </div>
            </div>
            <div style={{ width: 88, textAlign: "right", flexShrink: 0 }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: C.mute,
                }}
              >
                ORG-{String(220 + i * 31).padStart(3, "0")}
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  color: gone > 0.4 ? C.red : C.green,
                }}
              >
                {gone > 0.4 ? "LOST" : "ACTIVE"}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const DatabaseDashboard: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  vanishAt?: number;
  accent?: string;
  title?: string;
  compact?: boolean;
  style?: CSSProperties;
  children?: ReactNode;
}> = ({
  start = 0,
  width = 928,
  height = 760,
  vanishAt,
  accent = C.cyan,
  title = "PRODUCTION / CONTACTS",
  compact = false,
  style,
  children,
}) => {
  return (
    <Panel
      start={start}
      accent={`${accent}55`}
      glow
      style={{ width, height, ...style }}
    >
      <PanelHeader
        left={title}
        accent={accent}
        right={
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Dot color={vanishAt ? C.red : C.green} size={6} pulse />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.14em",
                color: vanishAt ? C.red : C.green,
              }}
            >
              {vanishAt ? "CRITICAL" : "LIVE"}
            </span>
          </span>
        }
      />

      <div
        style={{
          padding: compact ? "14px 16px 12px" : "18px 20px 14px",
          borderBottom: `1px solid ${C.lineSoft}`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <Mono size={9} color={C.mute}>
              TOTAL RECORDS
            </Mono>
            <div
              style={{
                marginTop: 6,
                fontFamily: FONT,
                fontSize: compact ? 34 : 44,
                fontWeight: 600,
                letterSpacing: "-0.045em",
                color: vanishAt ? C.red : C.white,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {vanishAt ? (
                <span>0</span>
              ) : (
                <Counter value={1206} start={start + 0.2} duration={1.1} grouping />
              )}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Mono size={9} color={C.mute}>
              STATUS
            </Mono>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                alignItems: "center",
                gap: 7,
                justifyContent: "flex-end",
              }}
            >
              <Dot color={vanishAt ? C.red : C.green} size={6} pulse />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: vanishAt ? C.red : C.green,
                }}
              >
                {vanishAt ? "WIPED" : "HEALTHY"}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 14,
            height: 30,
            borderRadius: 4,
            border: `1px solid ${C.lineSoft}`,
            background: "rgba(255,255,255,0.02)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            gap: 9,
          }}
        >
          <span style={{ color: C.mute, fontFamily: MONO, fontSize: 10 }}>⌕</span>
          <Mono size={9} color={C.mute}>
            SEARCH RECORDS
          </Mono>
          <div style={{ flex: 1 }} />
          <Mono size={8} color={C.mute}>
            FILTER · ALL
          </Mono>
        </div>
      </div>

      <div style={{ padding: compact ? "8px 16px 0" : "10px 20px 0" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0 8px",
            borderBottom: `1px solid ${C.line}`,
          }}
        >
          <Mono size={8} color={C.mute}>
            RECORD
          </Mono>
          <Mono size={8} color={C.mute}>
            ORGANIZATION
          </Mono>
        </div>
        <ContactRows
          count={compact ? 6 : 7}
          start={start + 0.3}
          vanishAt={vanishAt}
          rowHeight={compact ? 52 : 64}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Mono size={8} color={C.mute}>
          US-EAST · POSTGRES · PRODUCTION
        </Mono>
        <ActivityBars
          color={vanishAt ? C.red : accent}
          width={44}
          height={12}
          bars={5}
          start={start + 0.4}
        />
      </div>

      {children}
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Code editor / application shell                                     */
/* ------------------------------------------------------------------ */

const EDITOR_LINES = [
  { n: 1, text: "import { contacts, organizations } from './db';" },
  { n: 2, text: "" },
  { n: 3, text: "export async function buildWorkspace() {" },
  { n: 4, text: "  const data = await contacts.findMany({" },
  { n: 5, text: "    select: ['role', 'organization', 'stage']," },
  { n: 6, text: "    limit: 1206," },
  { n: 7, text: "  });" },
  { n: 8, text: "" },
  { n: 9, text: "  return workspace.render({" },
  { n: 10, text: "    contacts: data," },
  { n: 11, text: "    organizations: await organizations.all()," },
  { n: 12, text: "  });" },
  { n: 13, text: "}" },
];

const KEYWORDS = new Set([
  "import",
  "from",
  "export",
  "async",
  "function",
  "const",
  "await",
  "return",
  "new",
]);

const colorLine = (line: string): ReactNode[] =>
  line.split(/(\s+|'[^']*'|[{}()[\];,.])/g).map((token, i) => {
    let color = "rgba(245,247,250,0.72)";
    if (KEYWORDS.has(token)) color = C.cyan;
    else if (token.startsWith("'")) color = C.orange;
    else if (/^\d/.test(token)) color = C.silver;
    else if (/^[A-Z]/.test(token)) color = "#DCE7F2";
    return (
      <span key={i} style={{ color }}>
        {token}
      </span>
    );
  });

export const CodeEditorPanel: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  fontSize?: number;
  dim?: number;
  style?: CSSProperties;
  title?: string;
}> = ({
  start = 0,
  width = 600,
  height = 500,
  fontSize = 14,
  dim = 0,
  style,
  title = "workspace / app.ts",
}) => {
  const { frame, fps } = useTime();
  const entrance = progress(frame, fps, start, 0.7);
  return (
    <Panel
      start={start}
      style={{
        width,
        height,
        opacity: entrance * (1 - dim),
        ...style,
      }}
    >
      <PanelHeader
        left={title}
        right={
          <Mono size={8} color={C.mute}>
            TYPESCRIPT
          </Mono>
        }
      />
      <div
        style={{
          padding: "16px 18px",
          fontFamily: MONO,
          fontSize,
          lineHeight: 1.9,
          whiteSpace: "nowrap",
        }}
      >
        {EDITOR_LINES.map((line, i) => {
          const lineStart = start + 0.3 + i * 0.12;
          const typed = clamp(
            (frame / fps - lineStart) / Math.max(0.2, line.text.length * 0.018),
          );
          return (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              <span
                style={{
                  color: "rgba(245,247,250,0.18)",
                  width: 16,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {line.n}
              </span>
              <span style={{ overflow: "hidden", minHeight: fontSize * 1.9 }}>
                {colorLine(line.text.slice(0, Math.round(line.text.length * typed)))}
                {typed > 0 && typed < 1 ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 6,
                      height: fontSize * 1.05,
                      background: C.cyan,
                      verticalAlign: "text-bottom",
                      marginLeft: 2,
                      opacity: 0.7,
                    }}
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 32,
          borderTop: `1px solid ${C.lineSoft}`,
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 16px",
        }}
      >
        <Mono size={8} color={C.cyan}>
          ● READY
        </Mono>
        <Mono size={8} color={C.mute}>
          LN 13, COL 2
        </Mono>
        <div style={{ flex: 1 }} />
        <Mono size={8} color={C.mute}>
          UTF-8
        </Mono>
      </div>
    </Panel>
  );
};

export const AppShell: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
  compact?: boolean;
}> = ({ start = 0, width = 520, height = 620, style, compact = false }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.8);
  const cards = [
    { label: "CONTACTS", value: "1,206", color: C.cyan },
    { label: "COMPANIES", value: "1,196+", color: C.blue },
    { label: "ACTIVE", value: "94%", color: C.green },
  ];
  return (
    <Panel
      start={start}
      style={{
        width,
        height,
        opacity: p,
        transform: `translateY(${(1 - p) * 26}px)`,
        ...style,
      }}
    >
      <div
        style={{
          height: 54,
          borderBottom: `1px solid ${C.lineSoft}`,
          display: "flex",
          alignItems: "center",
          padding: "0 18px",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 6,
            background: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`,
            boxShadow: `0 0 20px ${C.cyanSoft}`,
          }}
        />
        <span
          style={{
            fontFamily: FONT,
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: C.white,
          }}
        >
          CONTACT&nbsp;OS
        </span>
        <div style={{ flex: 1 }} />
        <Mono size={8} color={C.mute}>
          WORKSPACE
        </Mono>
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: `1px solid ${C.line}`,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      </div>

      <div style={{ padding: compact ? 14 : 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Mono size={8} color={C.mute}>
              PIPELINE
            </Mono>
            <div
              style={{
                marginTop: 5,
                fontFamily: FONT,
                fontSize: compact ? 22 : 26,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: C.white,
              }}
            >
              Business contacts
            </div>
          </div>
          <Tag style={{ fontSize: 8, padding: "4px 7px" }}>LIVE</Tag>
        </div>

        <div
          style={{
            marginTop: 16,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {cards.map((card, i) => {
            const cp = progress(frame, fps, start + 0.4 + i * 0.12, 0.5);
            return (
              <div
                key={card.label}
                style={{
                  borderRadius: 8,
                  border: `1px solid ${C.lineSoft}`,
                  background: "rgba(255,255,255,0.025)",
                  padding: "12px 10px",
                  opacity: cp,
                  transform: `translateY(${(1 - cp) * 12}px)`,
                }}
              >
                <Mono size={7} color={C.mute}>
                  {card.label}
                </Mono>
                <div
                  style={{
                    marginTop: 7,
                    fontFamily: FONT,
                    fontSize: compact ? 18 : 21,
                    fontWeight: 600,
                    letterSpacing: "-0.03em",
                    color: card.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {card.value}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Mono size={8} color={C.mute}>
              RECENT RECORDS
            </Mono>
            <Mono size={7} color={C.mute}>
              UPDATED NOW
            </Mono>
          </div>
          {new Array(compact ? 3 : 4).fill(0).map((_, i) => {
            const rp = progress(frame, fps, start + 0.7 + i * 0.1, 0.45);
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderBottom: `1px solid ${C.lineSoft}`,
                  opacity: rp,
                  transform: `translateX(${(1 - rp) * -10}px)`,
                }}
              >
                <span
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 5,
                    border: `1px solid ${C.line}`,
                    background: C.cyanGhost,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 8,
                    color: C.cyan,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      height: 5,
                      width: `${56 + ((i * 13) % 28)}%`,
                      borderRadius: 2,
                      background: "rgba(245,247,250,0.24)",
                    }}
                  />
                  <div
                    style={{
                      marginTop: 5,
                      height: 4,
                      width: `${34 + ((i * 9) % 20)}%`,
                      borderRadius: 2,
                      background: "rgba(245,247,250,0.1)",
                    }}
                  />
                </div>
                <Mono size={7} color={C.green}>
                  ACTIVE
                </Mono>
              </div>
            );
          })}
        </div>
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Freeze / permission                                                 */
/* ------------------------------------------------------------------ */

export const FreezeLock: React.FC<{
  size?: number;
  start?: number;
  locked?: boolean;
  style?: CSSProperties;
}> = ({ size = 420, start = 0, locked = true, style }) => {
  const { frame, fps } = useTime();
  const t = Math.max(0, frame / fps - start);
  const p = progress(frame, fps, start, 0.7);
  const lockP = progress(frame, fps, start + 0.42, 0.6);
  const color = locked ? C.orange : C.cyan;
  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        opacity: p,
        transform: `scale(${0.92 + p * 0.08})`,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
        <defs>
          <radialGradient id={`freeze-core-${start}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.16" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={size * 0.46} fill={`url(#freeze-core-${start})`} />
        {[0.44, 0.37, 0.3, 0.23].map((r, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={size * r}
            fill="none"
            stroke={i === 1 ? color : C.line}
            strokeWidth={i === 1 ? 1.3 : 0.8}
            opacity={i === 1 ? 0.35 + Math.sin(t * 2.4) * 0.14 : 0.28}
            strokeDasharray={i === 2 ? "2 12" : undefined}
            transform={`rotate(${t * (i % 2 === 0 ? 5 : -8)} ${size / 2} ${size / 2})`}
          />
        ))}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size * 0.185}
          fill="rgba(8,11,16,0.88)"
          stroke={color}
          strokeWidth={1.2}
          opacity={0.9}
        />
        <g
          transform={`translate(${size / 2} ${size / 2}) scale(${0.8 + lockP * 0.2})`}
          opacity={lockP}
        >
          <rect
            x={-size * 0.062}
            y={-size * 0.012}
            width={size * 0.124}
            height={size * 0.102}
            rx={size * 0.014}
            fill="none"
            stroke={C.white}
            strokeWidth={size * 0.008}
          />
          <path
            d={`M ${-size * 0.038} ${-size * 0.012} L ${-size * 0.038} ${-size * 0.038} C ${-size * 0.038} ${-size * 0.085} ${size * 0.038} ${-size * 0.085} ${size * 0.038} ${-size * 0.038} L ${size * 0.038} ${-size * 0.012}`}
            fill="none"
            stroke={C.white}
            strokeWidth={size * 0.008}
            strokeLinecap="round"
          />
          <circle cx={0} cy={size * 0.03} r={size * 0.008} fill={color} />
          <path
            d={`M 0 ${size * 0.038} L 0 ${size * 0.056}`}
            stroke={color}
            strokeWidth={size * 0.007}
            strokeLinecap="round"
          />
        </g>
        {new Array(24).fill(0).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2 + t * 0.08;
          const r1 = size * 0.405;
          const r2 = size * 0.42;
          return (
            <line
              key={`tick-${i}`}
              x1={size / 2 + Math.cos(angle) * r1}
              y1={size / 2 + Math.sin(angle) * r1}
              x2={size / 2 + Math.cos(angle) * r2}
              y2={size / 2 + Math.sin(angle) * r2}
              stroke={color}
              strokeWidth={0.8}
              opacity={0.28}
            />
          );
        })}
      </svg>
    </div>
  );
};

export const FreezePanel: React.FC<{
  start?: number;
  width?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 640, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.7);
  return (
    <Panel
      start={start}
      accent={`${C.orange}44`}
      style={{ width, padding: "18px 20px", ...style }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 5,
              border: `1px solid ${C.orange}55`,
              background: C.orangeSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.orange,
              fontFamily: MONO,
              fontSize: 14,
            }}
          >
            ⏸
          </div>
          <div>
            <Mono size={9} color={C.orange}>
              CODE FREEZE
            </Mono>
            <div
              style={{
                marginTop: 3,
                fontFamily: FONT,
                fontSize: 16,
                fontWeight: 600,
                color: C.white,
              }}
            >
              Human control engaged
            </div>
          </div>
        </div>
        <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 9 }}>
          LOCKED
        </Tag>
      </div>
      <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <StatusRow label="CHANGES" value="BLOCKED" color={C.orange} />
        <StatusRow label="ACTIONS" value="FROZEN" color={C.orange} />
        <StatusRow label="APPROVAL" value="REQUIRED" color={C.white} />
      </div>
      <div
        style={{
          marginTop: 16,
          borderRadius: 6,
          border: `1px solid ${C.lineSoft}`,
          background: "rgba(255,255,255,0.018)",
          padding: "10px 12px",
          opacity: p,
        }}
      >
        <Mono size={8} color={C.mute}>
          INSTRUCTION
        </Mono>
        <div
          style={{
            marginTop: 5,
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.03em",
            color: C.silver,
            lineHeight: 1.5,
          }}
        >
          “Freeze code and actions. No changes without approval.”
        </div>
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Failure telemetry                                                   */
/* ------------------------------------------------------------------ */

export const FailureTelemetry: React.FC<{
  start?: number;
  width?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 680, style }) => {
  const { frame, fps } = useTime();
  const flat = progress(frame, fps, start + 1.8, 1.4, easeInOut);
  const points = 56;
  const path = new Array(points)
    .fill(0)
    .map((_, i) => {
      const x = (i / (points - 1)) * 100;
      const spike = Math.sin(i * 0.9) * 6 + Math.sin(i * 0.23) * 10;
      const baseline = 50;
      const y = baseline + spike * (1 - flat) + Math.sin(i * 2.2) * 1.2 * (1 - flat);
      return `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <Panel
      start={start}
      accent={`${C.red}44`}
      style={{ width, padding: "16px 18px", ...style }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Dot color={C.red} size={7} pulse />
          <Mono size={9} color={C.red}>
            PRODUCTION HEALTH
          </Mono>
        </div>
        <Mono size={9} color={C.red}>
          0 ROWS
        </Mono>
      </div>
      <div
        style={{
          marginTop: 14,
          height: 104,
          borderRadius: 5,
          border: `1px solid ${C.red}22`,
          background:
            "linear-gradient(180deg, rgba(255,53,72,0.055), rgba(255,53,72,0.01))",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ width: "100%", height: "100%" }}
        >
          {[20, 40, 60, 80].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="100"
              y2={y}
              stroke="rgba(245,247,250,0.07)"
              strokeWidth="0.3"
            />
          ))}
          <path
            d={path}
            fill="none"
            stroke={C.red}
            strokeWidth="0.9"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
        </svg>
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 8,
            fontFamily: MONO,
            fontSize: 8,
            letterSpacing: "0.12em",
            color: C.red,
            opacity: 0.8,
          }}
        >
          CRITICAL
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <StatusRow label="DATABASE" value="OFFLINE" color={C.red} />
        <StatusRow label="WAL" value="SEALED" color={C.orange} />
        <StatusRow label="RECORDS" value="0" color={C.red} />
        <StatusRow label="INCIDENT" value="OPEN" color={C.orange} />
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Recovery console                                                    */
/* ------------------------------------------------------------------ */

export const RecoveryConsole: React.FC<{
  start?: number;
  width?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 720, style }) => {
  const { frame, fps } = useTime();
  const roll = progress(frame, fps, start + 1.9, 1.3, easeInOut);
  const restored = Math.round(1206 * roll);
  return (
    <Panel
      start={start}
      accent={`${C.cyan}44`}
      glow
      style={{ width, padding: "16px 18px", ...style }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Dot color={C.cyan} size={7} pulse />
          <Mono size={9} color={C.cyan}>
            RECOVERY CONSOLE
          </Mono>
        </div>
        <Tag
          color={roll > 0.95 ? C.green : C.orange}
          background={roll > 0.95 ? C.greenSoft : C.orangeSoft}
          style={{ fontSize: 8, padding: "4px 7px" }}
        >
          {roll > 0.95 ? "RESTORED" : "ROLLBACK AVAILABLE"}
        </Tag>
      </div>

      <div
        style={{
          marginTop: 14,
          borderRadius: 6,
          border: `1px solid ${C.lineSoft}`,
          background: "rgba(255,255,255,0.02)",
          padding: "12px 14px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Mono size={8} color={C.mute}>
            SNAPSHOT · PRE-INCIDENT
          </Mono>
          <Mono size={8} color={C.mute}>
            07.21 · 03:14
          </Mono>
        </div>
        <div
          style={{
            marginTop: 10,
            height: 6,
            borderRadius: 3,
            background: "rgba(245,247,250,0.08)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${roll * 100}%`,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`,
              boxShadow: `0 0 16px ${C.cyanSoft}`,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <div>
            <Mono size={8} color={C.mute}>
              RECORDS RESTORED
            </Mono>
            <div
              style={{
                marginTop: 4,
                fontFamily: FONT,
                fontSize: 40,
                fontWeight: 600,
                letterSpacing: "-0.045em",
                color: C.white,
                fontVariantNumeric: "tabular-nums",
                lineHeight: 1,
              }}
            >
              {restored.toLocaleString("en-US")}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Mono size={8} color={C.mute}>
              METHOD
            </Mono>
            <div
              style={{
                marginTop: 4,
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.12em",
                color: C.cyan,
              }}
            >
              ROLLBACK
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: `1px solid ${C.orange}33`,
          background: C.orangeSoft,
          borderRadius: 5,
          padding: "9px 11px",
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 10, color: C.orange }}>!</span>
        <div style={{ flex: 1 }}>
          <Mono size={8} color={C.orange}>
            REPORTED AGENT RESPONSE
          </Mono>
          <div
            style={{
              marginTop: 3,
              fontFamily: FONT,
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.03em",
              color: "rgba(255,155,56,0.9)",
            }}
          >
            “Recovery: impossible.”
          </div>
        </div>
        <Mono size={8} color={C.orange} style={{ textDecoration: "line-through", opacity: 0.7 }}>
          FALSE
        </Mono>
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Mono size={8} color={C.mute}>
          DATA RECOVERY · {roll > 0.95 ? "VERIFIED" : "PENDING"}
        </Mono>
        <Mono size={8} color={roll > 0.95 ? C.green : C.orange}>
          ● {roll > 0.95 ? "RECOVERED" : "READY"}
        </Mono>
      </div>
    </Panel>
  );
};

/* ------------------------------------------------------------------ */
/* Architecture diagram                                                */
/* ------------------------------------------------------------------ */

const NodeBox: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  color: string;
  start: number;
  icon?: ReactNode;
  accent?: boolean;
}> = ({ x, y, w, h, label, sub, color, start, icon, accent = false }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.55, easeInOut);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 10,
        border: `1px solid ${color}${accent ? "88" : "3A"}`,
        background: accent
          ? `linear-gradient(160deg, ${color}1C, rgba(10,13,18,0.92))`
          : "linear-gradient(160deg, rgba(24,30,39,0.9), rgba(10,13,18,0.94))",
        boxShadow: accent ? `0 0 46px ${color}12` : "0 18px 44px rgba(0,0,0,0.35)",
        padding: "12px 13px",
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px) scale(${0.98 + p * 0.02})`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 3,
          height: "100%",
          background: color,
          opacity: 0.8,
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {icon ?? (
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 10px ${color}`,
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.15em",
            color,
            lineHeight: 1,
          }}
        >
          {label}
        </span>
      </div>
      {sub ? (
        <div
          style={{
            marginTop: 8,
            fontFamily: FONT,
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.02em",
            lineHeight: 1.35,
            color: C.silver,
          }}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
};

export const ArchitectureMap: React.FC<{
  start?: number;
  scale?: number;
  style?: CSSProperties;
  showDetail?: boolean;
}> = ({ start = 0, scale = 1, style, showDetail = true }) => {
  const { frame, fps } = useTime();
  const zoneDev = progress(frame, fps, start + 0.1, 0.7);
  const zoneProd = progress(frame, fps, start + 0.35, 0.7);
  const line1 = progress(frame, fps, start + 1.0, 0.6, easeInOut);
  const line2 = progress(frame, fps, start + 1.7, 0.6, easeInOut);
  const line3 = progress(frame, fps, start + 2.3, 0.6, easeInOut);
  const gateP = progress(frame, fps, start + 2.7, 0.7);
  const backupP = progress(frame, fps, start + 3.1, 0.7);

  const W = 900;
  const H = 1060;

  return (
    <div
      style={{
        width: W,
        height: H,
        position: "relative",
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        ...style,
      }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <defs>
          <linearGradient id="arch-dev" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.35" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="arch-prod" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.blue} stopOpacity="0.28" />
            <stop offset="100%" stopColor={C.blue} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <rect
          x="16"
          y="14"
          width="868"
          height="386"
          rx="14"
          fill="url(#arch-dev)"
          stroke={`${C.cyan}33`}
          strokeWidth="1"
          opacity={zoneDev}
        />
        <rect
          x="16"
          y="640"
          width="868"
          height="384"
          rx="14"
          fill="url(#arch-prod)"
          stroke={`${C.blue}33`}
          strokeWidth="1"
          opacity={zoneProd}
        />
        <text
          x="42"
          y="48"
          fill={C.cyan}
          fontFamily={MONO}
          fontSize="11"
          letterSpacing="2.4"
          opacity={0.75 * zoneDev}
        >
          DEVELOPMENT
        </text>
        <text
          x="42"
          y="674"
          fill={C.blue}
          fontFamily={MONO}
          fontSize="11"
          letterSpacing="2.4"
          opacity={0.85 * zoneProd}
        >
          PRODUCTION
        </text>

        {/* Agent → dev database */}
        <path
          d="M 360 166 C 430 166, 480 166, 552 166"
          stroke={C.cyan}
          strokeWidth="1.5"
          fill="none"
          opacity={0.65}
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - line1}
        />
        <circle cx="454" cy="166" r="3" fill={C.cyan} opacity={line1 * 0.9} />
        <text
          x="454"
          y="152"
          fill={C.dim}
          fontFamily={MONO}
          fontSize="8"
          letterSpacing="1.4"
          textAnchor="middle"
          opacity={line1}
        >
          READ / WRITE
        </text>

        {/* Dev database → approval gate */}
        <path
          d="M 682 280 C 682 350, 690 384, 598 432"
          stroke={C.orange}
          strokeWidth="1.4"
          fill="none"
          strokeDasharray="5 7"
          opacity={0.6}
          pathLength={1}
          strokeDashoffset={1 - line2}
        />
        <text
          x="735"
          y="360"
          fill={C.orange}
          fontFamily={MONO}
          fontSize="8"
          letterSpacing="1.2"
          opacity={line2 * 0.9}
        >
          RESTRICTED
        </text>

        {/* Gate → production */}
        <path
          d="M 450 590 C 450 620, 500 650, 616 692"
          stroke={C.cyan}
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="1 7"
          opacity={0.55}
          pathLength={1}
          strokeDashoffset={1 - line3}
        />
        <text
          x="508"
          y="632"
          fill={C.dim}
          fontFamily={MONO}
          fontSize="8"
          letterSpacing="1.2"
          opacity={line3}
        >
          APPROVED ONLY
        </text>

        {/* Prod → backup */}
        <path
          d="M 552 764 C 470 764, 420 764, 354 764"
          stroke={C.green}
          strokeWidth="1.2"
          fill="none"
          strokeDasharray="3 7"
          opacity={0.5}
          pathLength={1}
          strokeDashoffset={1 - backupP}
        />
        <text
          x="455"
          y="748"
          fill={C.green}
          fontFamily={MONO}
          fontSize="8"
          letterSpacing="1.2"
          textAnchor="middle"
          opacity={backupP * 0.8}
        >
          BACKUP
        </text>
      </svg>

      <NodeBox
        x={62}
        y={100}
        w={298}
        h={132}
        label="AI AGENT"
        sub="builds inside a sandbox"
        color={C.cyan}
        start={start + 0.55}
        accent
        icon={
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 5,
              border: `1px solid ${C.cyan}66`,
              background: C.cyanSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontSize: 9,
              color: C.cyan,
            }}
          >
            {">_"}
          </span>
        }
      />
      <NodeBox
        x={552}
        y={100}
        w={300}
        h={180}
        label="DEV DATABASE"
        sub="disposable · isolated"
        color={C.cyan}
        start={start + 0.85}
      />
      <NodeBox
        x={536}
        y={694}
        w={316}
        h={180}
        label="PROD DATABASE"
        sub="live business records"
        color={C.blue}
        start={start + 1.1}
        accent
      />
      <NodeBox
        x={62}
        y={694}
        w={292}
        h={150}
        label="BACKUP VAULT"
        sub="tested restore point"
        color={C.green}
        start={start + 3.0}
      />

      {/* Approval gate */}
      <div
        style={{
          position: "absolute",
          left: 278,
          top: 430,
          width: 344,
          height: 160,
          borderRadius: 12,
          border: `1px solid ${C.orange}66`,
          background:
            "linear-gradient(160deg, rgba(255,155,56,0.12), rgba(10,13,18,0.94))",
          boxShadow: `0 0 60px ${C.orange}12`,
          opacity: gateP,
          transform: `translateY(${(1 - gateP) * 16}px) scale(${0.96 + gateP * 0.04})`,
          padding: "16px 18px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 9,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 5,
              border: `1px solid ${C.orange}66`,
              background: C.orangeSoft,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: C.orange,
              fontFamily: MONO,
              fontSize: 12,
            }}
          >
            ⌁
          </span>
          <div>
            <Mono size={9} color={C.orange}>
              HUMAN APPROVAL
            </Mono>
            <div
              style={{
                marginTop: 2,
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                color: C.white,
              }}
            >
              Destructive actions
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.lineSoft}`,
            paddingTop: 8,
          }}
        >
          <Mono size={8} color={C.mute}>
            LEAST PRIVILEGE
          </Mono>
          <Mono size={8} color={C.orange}>
            GATE 01
          </Mono>
        </div>
      </div>

      {showDetail ? (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 612,
            display: "flex",
            justifyContent: "center",
            opacity: Math.max(zoneDev, zoneProd) * 0.75,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 14px",
              borderRadius: 100,
              border: `1px solid ${C.line}`,
              background: "rgba(5,6,8,0.8)",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: C.orange,
                boxShadow: `0 0 12px ${C.orange}`,
              }}
            />
            <Mono size={8} color={C.orange}>
              ISOLATION BOUNDARY
            </Mono>
            <span style={{ width: 24, height: 1, background: C.line }} />
            <Mono size={8} color={C.dim}>
              NO DIRECT REACH
            </Mono>
          </div>
        </div>
      ) : null}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Conclusion: clean separation                                        */
/* ------------------------------------------------------------------ */

export const SeparationDiagram: React.FC<{
  start?: number;
  style?: CSSProperties;
}> = ({ start = 0, style }) => {
  const { frame, fps } = useTime();
  const left = progress(frame, fps, start, 0.7);
  const right = progress(frame, fps, start + 0.3, 0.7);
  const wall = progress(frame, fps, start + 0.8, 0.6);
  const healthy = progress(frame, fps, start + 1.3, 0.7);
  return (
    <div
      style={{
        position: "relative",
        width: 928,
        height: 440,
        display: "flex",
        gap: 20,
        ...style,
      }}
    >
      <div
        style={{
          flex: 1,
          borderRadius: 12,
          border: `1px solid ${C.cyan}33`,
          background: "linear-gradient(160deg, rgba(0,217,255,0.07), rgba(8,11,16,0.8))",
          padding: "20px 18px",
          opacity: left,
          transform: `translateX(${(1 - left) * -20}px)`,
        }}
      >
        <Mono size={9} color={C.cyan}>
          DEVELOPMENT
        </Mono>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.white,
          }}
        >
          Build freely
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: FONT,
            fontSize: 12,
            lineHeight: 1.5,
            color: C.dim,
          }}
        >
          Agent sandbox · disposable data · broad permissions
        </div>
        <div
          style={{
            marginTop: 24,
            height: 92,
            borderRadius: 6,
            border: `1px solid ${C.cyan}22`,
            background: C.cyanGhost,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <Dot color={C.cyan} size={6} pulse />
          <Mono size={8} color={C.cyan}>
            DEV DB · ISOLATED
          </Mono>
        </div>
      </div>

      <div
        style={{
          width: 2,
          background: `linear-gradient(180deg, transparent, ${C.orange}88, transparent)`,
          opacity: wall,
          alignSelf: "stretch",
        }}
      />

      <div
        style={{
          flex: 1,
          borderRadius: 12,
          border: `1px solid ${C.blue}44`,
          background: "linear-gradient(160deg, rgba(69,107,255,0.08), rgba(8,11,16,0.8))",
          padding: "20px 18px",
          opacity: right,
          transform: `translateX(${(1 - right) * 20}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Mono size={9} color={C.blue}>
            PRODUCTION
          </Mono>
          <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 7, padding: "3px 6px" }}>
            HEALTHY
          </Tag>
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT,
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.white,
          }}
        >
          Control strictly
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: FONT,
            fontSize: 12,
            lineHeight: 1.5,
            color: C.dim,
          }}
        >
          Human approval · tested backups · least privilege
        </div>
        <div
          style={{
            marginTop: 24,
            height: 92,
            borderRadius: 6,
            border: `1px solid ${C.green}22`,
            background: C.greenSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: healthy,
          }}
        >
          <Dot color={C.green} size={6} pulse />
          <Mono size={8} color={C.green}>
            PROD DB · 1,206 RECORDS
          </Mono>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Sources strip                                                       */
/* ------------------------------------------------------------------ */

export const SourcesStrip: React.FC<{
  start?: number;
  color?: string;
  style?: CSSProperties;
}> = ({ start = 0, color = C.mute, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.8);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: p * 0.75,
        ...style,
      }}
    >
      <span style={{ width: 22, height: 1, background: color }} />
      <Mono size={9} color={color} style={{ letterSpacing: "0.14em" }}>
        SOURCES: REPLIT BLOG · FORTUNE · THE REGISTER · JULY 2025
      </Mono>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small status chip                                                   */
/* ------------------------------------------------------------------ */

export const StatusChip: React.FC<{
  label: string;
  value: string;
  color: string;
  start?: number;
}> = ({ label, value, color, start = 0 }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.5);
  return (
    <div
      style={{
        border: `1px solid ${color}33`,
        background: `${color}0D`,
        borderRadius: 5,
        padding: "9px 11px",
        opacity: p,
        transform: `translateY(${(1 - p) * 8}px)`,
      }}
    >
      <Mono size={7} color={C.mute}>
        {label}
      </Mono>
      <div
        style={{
          marginTop: 4,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.1em",
          color,
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Camera wrapper                                                      */
/* ------------------------------------------------------------------ */

export const Camera: React.FC<{
  children: ReactNode;
  start?: number;
  amount?: number;
  origin?: string;
  style?: CSSProperties;
}> = ({ children, start = 0, amount = 0.03, origin = "50% 52%", style }) => {
  const { frame, fps } = useTime();
  const t = frame / fps;
  const drift = clamp((t - start) / 18);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${1 + drift * amount})`,
        transformOrigin: origin,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Count-up helper for the data scene                                  */
/* ------------------------------------------------------------------ */

export const DataCounterBlock: React.FC<{
  value: number;
  label: string;
  start: number;
  color?: string;
  align?: "left" | "right";
  size?: number;
  style?: CSSProperties;
}> = ({ value, label, start, color = C.cyan, align = "left", size = 92, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.5);
  return (
    <div
      style={{
        textAlign: align,
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
        ...style,
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: size,
          fontWeight: 700,
          letterSpacing: "-0.065em",
          lineHeight: 0.86,
          color: C.white,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        <Counter value={value} start={start + 0.1} duration={1.05} grouping />
      </div>
      <div
        style={{
          marginTop: 10,
          fontFamily: MONO,
          fontSize: 12,
          letterSpacing: "0.22em",
          color,
        }}
      >
        {label}
      </div>
    </div>
  );
};
