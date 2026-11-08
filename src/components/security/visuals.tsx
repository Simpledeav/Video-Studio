import type { CSSProperties, ReactNode } from "react";
import { C, FONT, MONO } from "../../config/security";
import {
  ActivityBars,
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
/* Ambient field                                                       */
/* ------------------------------------------------------------------ */

const GLYPHS = ["0x7F3A", "REQ", "AUTH", "ACL", "200", "DENY", "ROW", "ID", "TOKEN", "API", "GET", "DB"];

export const DataRain: React.FC<{
  opacity?: number;
  color?: string;
  columns?: number;
  start?: number;
  speed?: number;
  style?: CSSProperties;
}> = ({ opacity = 0.13, color = C.cyan, columns = 5, start = 0, speed = 1, style }) => {
  const { frame, fps } = useTime();
  const t = Math.max(0, frame / fps - start);
  return (
    <div
      style={{
        position: "absolute",
        inset: -60,
        display: "flex",
        gap: "7%",
        paddingLeft: "2%",
        overflow: "hidden",
        pointerEvents: "none",
        opacity,
        ...style,
      }}
    >
      {new Array(columns).fill(0).map((_, col) => {
        const offset = (t * (10 + col * 4) * speed * 28) % 640;
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
            {new Array(38).fill(0).map((__, i) => (
              <div
                key={i}
                style={{
                  opacity:
                    0.1 +
                    0.48 *
                      Math.abs(Math.sin((i + col * 3) * 0.4)) *
                      (i % 5 === 0 ? 1 : 0.55),
                }}
              >
                {GLYPHS[Math.floor(seeded(col * 31 + i) * GLYPHS.length)]}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Database cylinder                                                   */
/* ------------------------------------------------------------------ */

export const DatabaseStack: React.FC<{
  size?: number;
  start?: number;
  label?: string;
  sublabel?: string;
  accent?: string;
  breached?: number;
  style?: CSSProperties;
}> = ({
  size = 320,
  start = 0,
  label = "CUSTOMER DB",
  sublabel = "PRODUCTION",
  accent = C.cyan,
  breached = 0,
  style,
}) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.75);
  const t = frame / fps;
  const w = size;
  const h = size * 1.2;
  const cx = w / 2;
  const rx = w * 0.36;
  const ry = w * 0.105;
  const top = h * 0.2;
  const bottom = h * 0.8;
  const color = breached > 0.45 ? C.red : breached > 0.15 ? C.orange : accent;
  const levels = 7;

  return (
    <div
      style={{
        width: w,
        height: h,
        position: "relative",
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px)`,
        filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.6))",
        ...style,
      }}
    >
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={`sec-db-${start}-${size}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(8,11,16,0.98)" />
            <stop offset="38%" stopColor="rgba(29,37,48,0.98)" />
            <stop offset="64%" stopColor="rgba(20,26,34,0.98)" />
            <stop offset="100%" stopColor="rgba(6,8,12,0.98)" />
          </linearGradient>
        </defs>
        <ellipse cx={cx} cy={bottom + ry * 0.6} rx={rx * 1.2} ry={ry * 0.8} fill={color} opacity={0.1} />
        <rect
          x={cx - rx}
          y={top}
          width={rx * 2}
          height={bottom - top}
          fill={`url(#sec-db-${start}-${size})`}
          stroke={`${color}55`}
          strokeWidth={1.2}
        />
        <ellipse cx={cx} cy={top} rx={rx} ry={ry} fill="rgba(20,27,36,0.98)" stroke={color} strokeWidth={1.3} />
        <ellipse cx={cx} cy={top} rx={rx * 0.78} ry={ry * 0.62} fill="none" stroke={`${color}55`} strokeWidth={1} />
        <ellipse cx={cx} cy={bottom} rx={rx} ry={ry} fill="rgba(9,12,17,0.98)" stroke={`${color}55`} strokeWidth={1.1} />
        {new Array(levels).fill(0).map((_, i) => {
          const y = top + ((i + 1) / (levels + 1)) * (bottom - top);
          return (
            <g key={i} opacity={0.35 + (i / levels) * 0.55}>
              <ellipse cx={cx} cy={y} rx={rx * 0.92} ry={ry * 0.7} fill="none" stroke={`${color}44`} strokeWidth={0.8} />
              <rect x={cx - rx * 0.7} y={y - 1} width={rx * 1.4} height={2} fill={color} opacity={0.26} />
            </g>
          );
        })}
        <ellipse
          cx={cx}
          cy={top + ((bottom - top) * (0.15 + (t * 0.12) % 0.7))}
          rx={rx * 0.96}
          ry={ry * 0.72}
          fill={color}
          opacity={0.08}
        />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: h * 0.42, textAlign: "center" }}>
        <div style={{ fontFamily: MONO, fontSize: size * 0.036, letterSpacing: "0.2em", color }}>
          {label}
        </div>
        <div style={{ marginTop: 7, fontFamily: FONT, fontSize: size * 0.068, fontWeight: 600, letterSpacing: "-0.03em", color: C.white }}>
          <Counter value={12806} start={start + 0.2} duration={1.1} grouping />
        </div>
        <div style={{ marginTop: 4, fontFamily: MONO, fontSize: size * 0.026, letterSpacing: "0.16em", color: breached > 0.45 ? C.red : C.dim }}>
          {sublabel} · {breached > 0.45 ? "EXPOSED" : "PRIVATE"}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: cx - rx * 0.5,
          width: rx,
          bottom: h * 0.015,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Mono size={size * 0.025} color={color}>
          ● {breached > 0.45 ? "OPEN" : "LIVE"}
        </Mono>
        <ActivityBars color={color} width={size * 0.12} height={size * 0.04} bars={5} start={start} />
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Application shell                                                   */
/* ------------------------------------------------------------------ */

export const AppWindow: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  title?: string;
  accent?: string;
  status?: ReactNode;
  children: ReactNode;
  style?: CSSProperties;
}> = ({
  start = 0,
  width = 928,
  height = 500,
  title = "NORTHSTAR / WORKSPACE",
  accent = C.cyan,
  status,
  children,
  style,
}) => (
  <Panel start={start} accent={`${accent}44`} glow style={{ width, height, ...style }}>
    <PanelHeader
      left={title}
      accent={accent}
      right={
        status ?? (
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Dot color={C.green} size={6} pulse />
            <Mono size={9} color={C.green}>
              LIVE
            </Mono>
          </span>
        )
      }
    />
    {children}
  </Panel>
);

const METRICS = [
  { label: "CUSTOMERS", value: 8420, color: C.cyan },
  { label: "ACTIVE RECORDS", value: 12806, color: C.blue },
  { label: "UPTIME", value: 99.98, suffix: "%", color: C.green, decimals: 2 },
];

export const BusinessDashboard: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  accent?: string;
  compact?: boolean;
  compromised?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 928, height = 480, accent = C.cyan, compact = false, compromised = 0, style }) => {
  const { frame, fps } = useTime();
  const exposed = compromised > 0.4;
  const chart = progress(frame, fps, start + 1.1, 1.2, easeInOut);
  const points = [0.35, 0.42, 0.38, 0.55, 0.62, 0.58, 0.72, 0.8, 0.76, 0.9];
  const chartW = width - 48;
  const chartH = compact ? 92 : 128;
  const path = points
    .map((value, i) => {
      const x = (i / (points.length - 1)) * chartW * chart;
      const y = chartH - value * chartH;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <AppWindow
      start={start}
      width={width}
      height={height}
      accent={accent}
      style={style}
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Dot color={exposed ? C.red : C.green} size={6} pulse />
          <Mono size={9} color={exposed ? C.red : C.green}>
            {exposed ? "EXPOSED" : "LIVE"}
          </Mono>
        </span>
      }
    >
      <div style={{ padding: compact ? "14px 18px" : "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <Mono size={9} color={C.mute}>
              BUSINESS OVERVIEW
            </Mono>
            <div
              style={{
                marginTop: 6,
                fontFamily: FONT,
                fontSize: compact ? 26 : 34,
                fontWeight: 600,
                letterSpacing: "-0.045em",
                color: C.white,
                lineHeight: 1,
              }}
            >
              Customer operations
            </div>
          </div>
          <Tag color={accent} background={`${accent}14`} style={{ fontSize: 8 }}>
            PRODUCTION
          </Tag>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 9 }}>
          {METRICS.map((metric, i) => {
            const p = progress(frame, fps, start + 0.35 + i * 0.1, 0.5);
            return (
              <div
                key={metric.label}
                style={{
                  border: `1px solid ${C.lineSoft}`,
                  background: "rgba(255,255,255,0.025)",
                  borderRadius: 8,
                  padding: compact ? "10px 10px" : "12px 12px",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 10}px)`,
                }}
              >
                <Mono size={7} color={C.mute}>
                  {metric.label}
                </Mono>
                <div
                  style={{
                    marginTop: 6,
                    fontFamily: FONT,
                    fontSize: compact ? 18 : 22,
                    fontWeight: 600,
                    letterSpacing: "-0.035em",
                    color: metric.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <Counter
                    value={metric.value}
                    start={start + 0.5 + i * 0.1}
                    duration={1.1}
                    decimals={metric.decimals ?? 0}
                    suffix={metric.suffix ?? ""}
                    grouping={metric.decimals === undefined}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, border: `1px solid ${C.lineSoft}`, borderRadius: 8, padding: "10px 12px 6px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono size={7} color={C.mute}>
              DATA ACCESS VOLUME
            </Mono>
            <Mono size={7} color={accent}>
              LAST 24H
            </Mono>
          </div>
          <svg width={chartW - 24} height={chartH} viewBox={`0 0 ${chartW - 24} ${chartH}`} style={{ display: "block", marginTop: 4 }}>
            <defs>
              <linearGradient id={`sec-chart-${start}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
                <stop offset="100%" stopColor={accent} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d={`${path} L ${chartW * chart} ${chartH} L 0 ${chartH} Z`}
              fill={`url(#sec-chart-${start})`}
              opacity={chart}
            />
            <path d={path} fill="none" stroke={accent} strokeWidth={1.6} opacity={0.9} />
          </svg>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
          {exposed ? (
            <>
              <Tag color={C.red} background={C.redSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
                <Dot color={C.red} size={5} /> BOUNDARY OPEN
              </Tag>
              <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
                ACCESS UNRESTRICTED
              </Tag>
              <Tag color={C.red} background={C.redSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
                AUDIT GAP
              </Tag>
            </>
          ) : (
            <>
              <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
                <Dot color={C.green} size={5} /> SECURE CONNECTION
              </Tag>
              <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 7, padding: "5px 8px" }}>
                ENCRYPTED AT REST
              </Tag>
              <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 7, padding: "5px 8px" }}>
                AUDITED
              </Tag>
            </>
          )}
        </div>
      </div>
    </AppWindow>
  );
};

/* ------------------------------------------------------------------ */
/* Authentication                                                      */
/* ------------------------------------------------------------------ */

export const LoginCard: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 410, height = 520, style }) => {
  const { frame, fps } = useTime();
  const success = progress(frame, fps, start + 2.4, 0.7);
  const typed = progress(frame, fps, start + 1.1, 1.0);
  const email = "analyst@northstar.app";
  const chars = Math.round(email.length * typed);

  return (
    <AppWindow
      start={start}
      width={width}
      height={height}
      title="NORTHSTAR / SIGN IN"
      accent={success > 0.4 ? C.green : C.cyan}
      status={
        <Mono size={9} color={success > 0.4 ? C.green : C.mute}>
          {success > 0.4 ? "IDENTITY VERIFIED" : "SECURE LOGIN"}
        </Mono>
      }
      style={style}
    >
      <div style={{ padding: "20px 20px 18px" }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            border: `1px solid ${C.cyan}55`,
            background: C.cyanSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: C.cyan,
            fontFamily: MONO,
            fontSize: 16,
          }}
        >
          ◈
        </div>
        <div style={{ marginTop: 14, fontFamily: FONT, fontSize: 24, fontWeight: 600, letterSpacing: "-0.04em", color: C.white }}>
          Welcome back.
        </div>
        <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 12, color: C.dim }}>
          Sign in to the customer workspace.
        </div>

        <div style={{ marginTop: 20 }}>
          <Mono size={8} color={C.mute}>
            WORK EMAIL
          </Mono>
          <div
            style={{
              marginTop: 7,
              height: 42,
              border: `1px solid ${C.line}`,
              borderRadius: 6,
              background: "rgba(255,255,255,0.025)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              fontFamily: MONO,
              fontSize: 11,
              color: C.silver,
            }}
          >
            {email.slice(0, chars)}
            <span style={{ width: 1, height: 14, background: C.cyan, marginLeft: 2, opacity: typed > 0 && typed < 1 ? 0.8 : 0 }} />
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <Mono size={8} color={C.mute}>
            PASSWORD
          </Mono>
          <div
            style={{
              marginTop: 7,
              height: 42,
              border: `1px solid ${C.line}`,
              borderRadius: 6,
              background: "rgba(255,255,255,0.025)",
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              gap: 5,
            }}
          >
            {new Array(11).fill(0).map((_, i) => (
              <span key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: C.silver, opacity: 0.5 }} />
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            height: 42,
            borderRadius: 6,
            border: `1px solid ${success > 0.4 ? C.green : C.cyan}55`,
            background: success > 0.4 ? C.greenSoft : C.cyanSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: success > 0.4 ? C.green : C.cyan,
          }}
        >
          {success > 0.4 ? "✓  AUTHENTICATED" : "SIGN IN"}
        </div>

        <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, opacity: success }}>
          <Dot color={C.green} size={6} pulse />
          <Mono size={8} color={C.green}>
            TOKEN ISSUED · SESSION ACTIVE
          </Mono>
        </div>

        <div style={{ marginTop: 14, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 10 }}>
          <StatusRow label="MFA" value="VERIFIED" color={C.green} />
          <StatusRow label="SESSION" value="ENCRYPTED" color={C.cyan} style={{ marginTop: 7 }} />
        </div>
      </div>
    </AppWindow>
  );
};

export const RequestTrace: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 450, height = 520, style }) => {
  const { frame, fps } = useTime();
  const steps = [
    { label: "USER REQUEST", value: "GET /records/2087", color: C.cyan, at: 0.5 },
    { label: "AUTHENTICATION", value: "IDENTITY VERIFIED", color: C.green, at: 1.2 },
    { label: "AUTHORIZATION", value: "OWNERSHIP NOT CHECKED", color: C.orange, at: 2.6 },
    { label: "DATABASE", value: "RECORD RETURNED", color: C.red, at: 3.4 },
  ];

  return (
    <AppWindow
      start={start}
      width={width}
      height={height}
      title="REQUEST / TRACE"
      accent={C.orange}
      status={<Mono size={9} color={C.orange}>TRACE 04A</Mono>}
      style={style}
    >
      <div style={{ padding: "18px 18px" }}>
        <Mono size={8} color={C.mute}>
          REQUEST PATH
        </Mono>
        <div style={{ marginTop: 14, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: 13,
              top: 16,
              bottom: 20,
              width: 1,
              background: `linear-gradient(180deg, ${C.cyan}, ${C.orange}, ${C.red})`,
              opacity: 0.45,
            }}
          />
          {steps.map((step, i) => {
            const p = progress(frame, fps, start + step.at, 0.55);
            return (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: i === steps.length - 1 ? 0 : 18,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -12}px)`,
                }}
              >
                <span
                  style={{
                    width: 27,
                    height: 27,
                    borderRadius: "50%",
                    border: `1px solid ${step.color}77`,
                    background: `${step.color}18`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: step.color,
                    fontFamily: MONO,
                    fontSize: 9,
                    flexShrink: 0,
                    zIndex: 2,
                  }}
                >
                  {i + 1}
                </span>
                <div style={{ flex: 1, paddingTop: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <Mono size={8} color={C.silver}>
                      {step.label}
                    </Mono>
                    <Mono size={7} color={step.color}>
                      {i === 3 ? "200 OK" : i === 2 ? "MISSING" : "OK"}
                    </Mono>
                  </div>
                  <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 9, letterSpacing: "0.04em", color: step.color, lineHeight: 1.45 }}>
                    {step.value}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: 18,
            borderTop: `1px solid ${C.lineSoft}`,
            paddingTop: 12,
            opacity: progress(frame, fps, start + 3.8, 0.6),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.orange, fontFamily: MONO, fontSize: 13 }}>!</span>
            <Mono size={8} color={C.orange} style={{ lineHeight: 1.6 }}>
              AUTHENTICATED, BUT NOT AUTHORIZED
            </Mono>
          </div>
        </div>

        <div style={{ marginTop: 20, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 12, opacity: progress(frame, fps, start + 4.3, 0.6) }}>
          <Mono size={7} color={C.mute}>
            EXPECTED POLICY
          </Mono>
          <div style={{ marginTop: 7, fontFamily: MONO, fontSize: 8, lineHeight: 1.8, color: C.dim }}>
            <span style={{ color: C.orange }}>if</span> (record.ownerId !== user.id)
            <br />
            &nbsp;&nbsp;<span style={{ color: C.red }}>return deny</span>();
          </div>
        </div>
      </div>
    </AppWindow>
  );
};

/* ------------------------------------------------------------------ */
/* Accounts + API                                                      */
/* ------------------------------------------------------------------ */

export const AccountCard: React.FC<{
  start?: number;
  label: string;
  id: string;
  accent?: string;
  active?: boolean;
  records?: number;
  style?: CSSProperties;
}> = ({ start = 0, label, id, accent = C.cyan, active = false, records = 12806, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.6);
  return (
    <div
      style={{
        border: `1px solid ${active ? `${accent}77` : C.line}`,
        background: active
          ? `linear-gradient(160deg, ${accent}12, rgba(10,13,18,0.96))`
          : "linear-gradient(160deg, rgba(27,34,44,0.8), rgba(10,13,18,0.96))",
        borderRadius: 10,
        padding: "14px 15px",
        opacity: p,
        transform: `translateY(${(1 - p) * 14}px)`,
        boxShadow: active ? `0 0 40px ${accent}0F` : "none",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              border: `1px solid ${accent}55`,
              background: `${accent}14`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: MONO,
              fontSize: 10,
              color: accent,
            }}
          >
            {label.slice(-1)}
          </span>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.white }}>{label}</div>
            <Mono size={8} color={C.mute}>
              {id}
            </Mono>
          </div>
        </div>
        <Tag color={active ? accent : C.silver} background={active ? `${accent}14` : "rgba(255,255,255,0.035)"} style={{ fontSize: 7, padding: "4px 7px" }}>
          {active ? "REQUESTER" : "OWNER"}
        </Tag>
      </div>
      <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.lineSoft}`, paddingTop: 9 }}>
        <Mono size={7} color={C.mute}>
          AUTHENTICATED
        </Mono>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Dot color={C.green} size={5} />
          <Mono size={7} color={C.green}>
            YES
          </Mono>
        </div>
      </div>
      <div style={{ marginTop: 7, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono size={7} color={C.mute}>
          RECORDS
        </Mono>
        <Mono size={8} color={C.silver}>
          {records.toLocaleString("en-US")}
        </Mono>
      </div>
    </div>
  );
};

export const ApiInspector: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 928, height = 430, style }) => {
  const { frame, fps } = useTime();
  const miss = progress(frame, fps, start + 2.0, 0.7);
  const returned = progress(frame, fps, start + 3.4, 0.6);

  return (
    <AppWindow
      start={start}
      width={width}
      height={height}
      title="API INSPECTOR / REQUEST 04A"
      accent={C.orange}
      status={<Mono size={9} color={C.orange}>OBJECT-LEVEL ACCESS</Mono>}
      style={style}
    >
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 8, padding: "5px 8px" }}>
            GET
          </Tag>
          <Mono size={11} color={C.white} style={{ letterSpacing: "0.03em" }}>
            /api/v1/records/CUST-B-2087
          </Mono>
          <div style={{ flex: 1 }} />
          <Mono size={8} color={returned > 0.3 ? C.red : C.mute}>
            {returned > 0.3 ? "200 OK" : "PENDING"}
          </Mono>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ border: `1px solid ${C.lineSoft}`, borderRadius: 7, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <Mono size={7} color={C.mute}>
              REQUEST IDENTITY
            </Mono>
            <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 10, color: C.cyan }}>CUST-A-1042</div>
            <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 8, color: C.dim }}>token: valid · scope: records:read</div>
          </div>
          <div style={{ border: `1px solid ${miss > 0.3 ? `${C.red}55` : C.lineSoft}`, borderRadius: 7, padding: "10px 12px", background: miss > 0.3 ? C.redSoft : "rgba(255,255,255,0.02)" }}>
            <Mono size={7} color={C.mute}>
              RECORD OWNER
            </Mono>
            <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 10, color: C.silver }}>CUST-B-2087</div>
            <div style={{ marginTop: 4, fontFamily: MONO, fontSize: 8, color: C.orange }}>owner ≠ requester</div>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            border: `1px solid ${miss > 0.3 ? `${C.orange}66` : C.lineSoft}`,
            borderRadius: 7,
            padding: "11px 12px",
            background: miss > 0.3 ? C.orangeSoft : "rgba(255,255,255,0.02)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <Mono size={7} color={C.mute}>
              AUTHORIZATION RULE
            </Mono>
            <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 9, color: miss > 0.3 ? C.orange : C.dim }}>
              {miss > 0.3 ? "ownership check: NOT ENFORCED" : "ownership check: evaluating…"}
            </div>
          </div>
          <div
            style={{
              padding: "6px 9px",
              borderRadius: 3,
              border: `1px solid ${miss > 0.3 ? `${C.red}55` : C.line}`,
              background: miss > 0.3 ? C.redSoft : "rgba(255,255,255,0.03)",
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.12em",
              color: miss > 0.3 ? C.red : C.mute,
            }}
          >
            {miss > 0.3 ? "BYPASSED" : "CHECKING"}
          </div>
        </div>

        <div style={{ marginTop: 12, display: "flex", gap: 8, opacity: progress(frame, fps, start + 1.4, 0.6) }}>
          <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 7, padding: "5px 8px" }}>
            SERVER-SIDE ROUTE
          </Tag>
          <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 7, padding: "5px 8px" }}>
            OBJECT ID: CUST-B-2087
          </Tag>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
            PRIVATE DATA
          </Tag>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 10, opacity: progress(frame, fps, start + 3.8, 0.6) }}>
          <div style={{ border: `1px solid ${C.lineSoft}`, borderRadius: 7, padding: "10px 12px", background: "rgba(255,255,255,0.02)" }}>
            <Mono size={7} color={C.mute}>
              RESPONSE PREVIEW
            </Mono>
            <div style={{ marginTop: 7, fontFamily: MONO, fontSize: 8, lineHeight: 1.8, color: C.dim }}>
              {"{"} "record": "CUST-B-2087",
              <br />
              &nbsp;&nbsp;"invoice": "INV-8842" {"}"}
            </div>
          </div>
          <div style={{ border: `1px solid ${C.red}44`, borderRadius: 7, padding: "10px 12px", background: C.redSoft }}>
            <Mono size={7} color={C.mute}>
              EXPECTED RESULT
            </Mono>
            <div style={{ marginTop: 7, fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", color: C.red }}>
              403 FORBIDDEN
            </div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
};

/* ------------------------------------------------------------------ */
/* Boundary + records                                                  */
/* ------------------------------------------------------------------ */

export const BoundaryGate: React.FC<{
  start?: number;
  width?: number;
  broken?: number;
  label?: string;
  color?: string;
  style?: CSSProperties;
}> = ({ start = 0, width = 928, broken = 0, label = "AUTHORIZATION BOUNDARY", color = C.cyan, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.7);
  const gap = broken * 0.42;
  return (
    <div style={{ width, height: 54, position: "relative", opacity: p, ...style }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 26, display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${color}88)` }} />
        <div style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${color}88, transparent)`, opacity: 1 - gap }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 12,
          transform: `translateX(-50%) scale(${1 + gap * 0.16})`,
          border: `1px solid ${broken > 0.4 ? `${C.red}77` : `${color}55`}`,
          background: broken > 0.4 ? C.redSoft : "rgba(5,6,8,0.92)",
          borderRadius: 100,
          padding: "6px 13px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          boxShadow: `0 0 30px ${broken > 0.4 ? C.red : color}22`,
        }}
      >
        <span style={{ color: broken > 0.4 ? C.red : color, fontFamily: MONO, fontSize: 11 }}>
          {broken > 0.4 ? "⚠" : "⌁"}
        </span>
        <Mono size={8} color={broken > 0.4 ? C.red : color}>
          {broken > 0.4 ? "BOUNDARY OPEN" : label}
        </Mono>
      </div>
    </div>
  );
};

const RECORD_TYPES = [
  { type: "INVOICE", id: "INV-8842", detail: "BILLING · PDF" },
  { type: "CUSTOMER", id: "CUST-2087", detail: "PROFILE · CONTACT" },
  { type: "CONTRACT", id: "CTR-114", detail: "LEGAL · PDF" },
  { type: "PAYMENT", id: "PMT-903", detail: "METHOD · TOKEN" },
  { type: "NOTE", id: "NOTE-77", detail: "INTERNAL · PRIVATE" },
  { type: "AUDIT", id: "LOG-552", detail: "ACCESS · EVENT" },
  { type: "MESSAGE", id: "MSG-318", detail: "SUPPORT · PRIVATE" },
  { type: "ADDRESS", id: "ADR-641", detail: "PROFILE · PRIVATE" },
];

export const DataRecordCard: React.FC<{
  start?: number;
  index?: number;
  exposed?: number;
  style?: CSSProperties;
}> = ({ start = 0, index = 0, exposed = 0, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.5);
  const record = RECORD_TYPES[index % RECORD_TYPES.length];
  const color = exposed > 0.45 ? C.red : C.cyan;
  return (
    <div
      style={{
        border: `1px solid ${color}44`,
        background: `linear-gradient(150deg, ${color}0E, rgba(10,13,18,0.94))`,
        borderRadius: 8,
        padding: "11px 13px",
        opacity: p,
        transform: `translateY(${(1 - p) * 12}px)`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Mono size={7} color={color}>
          {record.type}
        </Mono>
        <Mono size={7} color={exposed > 0.45 ? C.red : C.mute}>
          {exposed > 0.45 ? "EXPOSED" : "PRIVATE"}
        </Mono>
      </div>
      <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 11, letterSpacing: "0.06em", color: C.white }}>
        {record.id}
      </div>
      <div style={{ marginTop: 3, fontFamily: MONO, fontSize: 7, color: C.dim, letterSpacing: "0.1em" }}>
        {record.detail}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Business impact                                                     */
/* ------------------------------------------------------------------ */

export const ImpactDashboard: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 928, height = 560, style }) => {
  const { frame, fps } = useTime();
  const decline = progress(frame, fps, start + 1.2, 2.2, easeInOut);
  const alert = progress(frame, fps, start + 0.9, 0.7);
  const trustPath = [
    [0, 0.82],
    [0.12, 0.78],
    [0.24, 0.8],
    [0.38, 0.68],
    [0.5, 0.54],
    [0.64, 0.42],
    [0.78, 0.28],
    [1, 0.14],
  ];
  const chartW = width - 52;
  const chartH = 230;
  const path = trustPath
    .map(([x, y], i) => {
      const px = x * chartW * decline;
      const py = chartH - y * chartH;
      return `${i === 0 ? "M" : "L"} ${px} ${py}`;
    })
    .join(" ");

  return (
    <AppWindow
      start={start}
      width={width}
      height={height}
      title="INCIDENT / BUSINESS IMPACT"
      accent={C.orange}
      status={
        <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <Dot color={C.red} size={6} pulse />
          <Mono size={9} color={C.red}>
            INVESTIGATING
          </Mono>
        </span>
      }
      style={style}
    >
      <div style={{ padding: "16px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.25fr 1fr", gap: 12 }}>
          <div style={{ border: `1px solid ${C.lineSoft}`, borderRadius: 8, padding: "12px 13px", background: "rgba(255,255,255,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Mono size={8} color={C.mute}>
                CUSTOMER TRUST
              </Mono>
              <Mono size={8} color={C.red}>
                DECLINING
              </Mono>
            </div>
            <svg width={chartW * 0.56} height={chartH} viewBox={`0 0 ${chartW * 0.56} ${chartH}`} style={{ display: "block", marginTop: 8 }}>
              <defs>
                <linearGradient id={`trust-${start}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity="0.24" />
                  <stop offset="100%" stopColor={C.red} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={`${path} L ${chartW * 0.56 * decline} ${chartH} L 0 ${chartH} Z`} fill={`url(#trust-${start})`} />
              <path d={path} fill="none" stroke={C.red} strokeWidth={1.8} />
              <circle cx={chartW * 0.56 * decline} cy={chartH - 0.14 * chartH} r={3.5} fill={C.red} />
            </svg>
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <Tag color={C.red} background={C.redSoft} style={{ fontSize: 7, padding: "4px 7px" }}>
                TRUST
              </Tag>
              <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 7, padding: "4px 7px" }}>
                REPUTATION
              </Tag>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {[
              { label: "SECURITY INCIDENT", value: "ACCESS CONTROL", color: C.red, at: 0.9 },
              { label: "DATA PROTECTION", value: "UNDER REVIEW", color: C.orange, at: 1.4 },
              { label: "OPERATIONS", value: "DEGRADED", color: C.orange, at: 1.9 },
              { label: "LEGAL EXPOSURE", value: "ASSESSING", color: C.red, at: 2.4 },
            ].map((row) => {
              const p = progress(frame, fps, start + row.at, 0.5);
              return (
                <div
                  key={row.label}
                  style={{
                    border: `1px solid ${row.color}33`,
                    background: `${row.color}0B`,
                    borderRadius: 7,
                    padding: "10px 11px",
                    opacity: p,
                    transform: `translateX(${(1 - p) * 10}px)`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <Mono size={7} color={C.mute}>
                      {row.label}
                    </Mono>
                    <Dot color={row.color} size={5} pulse />
                  </div>
                  <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em", color: row.color }}>
                    {row.value}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            borderTop: `1px solid ${C.lineSoft}`,
            paddingTop: 11,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: alert,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.orange, fontFamily: MONO, fontSize: 12 }}>!</span>
            <Mono size={8} color={C.dim}>
              INCIDENT RESPONSE · CONTAINMENT IN PROGRESS
            </Mono>
          </div>
          <Mono size={8} color={C.mute}>
            NO FINANCIAL ESTIMATE
          </Mono>
        </div>

        <div style={{ marginTop: 14, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 12, opacity: progress(frame, fps, start + 2.2, 0.7) }}>
          <Mono size={7} color={C.mute}>
            RESPONSE TIMELINE
          </Mono>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
            {["DETECT", "CONTAIN", "NOTIFY", "REVIEW"].map((step, i) => (
              <div key={step} style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: i < 2 ? C.orange : C.mute, flexShrink: 0 }} />
                <Mono size={7} color={i < 2 ? C.silver : C.mute}>
                  {step}
                </Mono>
                {i < 3 ? <span style={{ flex: 1, height: 1, background: C.lineSoft }} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppWindow>
  );
};

/* ------------------------------------------------------------------ */
/* Secure architecture                                                 */
/* ------------------------------------------------------------------ */

export const ArchitectureFlow: React.FC<{
  start?: number;
  width?: number;
  height?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 520, height = 980, style }) => {
  const { frame, fps } = useTime();
  const steps = [
    { label: "USER REQUEST", detail: "authenticated session", color: C.cyan, at: 0.2 },
    { label: "AUTHENTICATION", detail: "identity verified", color: C.cyan, at: 0.8 },
    { label: "SERVER-SIDE AUTHORIZATION", detail: "policy enforced", color: C.blue, at: 1.4 },
    { label: "OWNERSHIP CHECK", detail: "record.owner = requester", color: C.blue, at: 2.0 },
    { label: "RESTRICTED DATABASE ACCESS", detail: "least-privilege role", color: C.cyan, at: 2.6 },
    { label: "AUTHORIZED RESPONSE", detail: "only permitted fields", color: C.green, at: 3.2 },
  ];
  const line = progress(frame, fps, start + 0.4, 3.4, easeInOut);
  const travel = progress(frame, fps, start + 0.6, 3.2, easeInOut);
  const nodeGap = (height - 90) / steps.length;
  const nodeH = 88;

  return (
    <div style={{ width, height, position: "relative", ...style }}>
      <div
        style={{
          position: "absolute",
          left: 31,
          top: 44,
          bottom: 34,
          width: 2,
          background: `linear-gradient(180deg, ${C.cyan}, ${C.blue}, ${C.green})`,
          opacity: 0.24,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 31,
          top: 44,
          width: 2,
          height: `${line * 100}%`,
          background: `linear-gradient(180deg, ${C.cyan}, ${C.blue}, ${C.green})`,
          boxShadow: `0 0 18px ${C.cyan}55`,
        }}
      />
      {steps.map((step, i) => {
        const p = progress(frame, fps, start + step.at, 0.55);
        const active = travel * steps.length >= i;
        const y = 44 + i * nodeGap;
        return (
          <div
            key={step.label}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: y,
              height: nodeH,
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: p,
              transform: `translateX(${(1 - p) * 14}px)`,
            }}
          >
            <span
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                border: `1px solid ${active ? `${step.color}88` : C.line}`,
                background: active
                  ? `linear-gradient(145deg, ${step.color}20, rgba(10,13,18,0.96))`
                  : "rgba(10,13,18,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: active ? step.color : C.mute,
                fontFamily: MONO,
                fontSize: 17,
                flexShrink: 0,
                boxShadow: active ? `0 0 32px ${step.color}18` : "none",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <div
              style={{
                flex: 1,
                border: `1px solid ${active ? `${step.color}44` : C.lineSoft}`,
                background: active
                  ? `linear-gradient(120deg, ${step.color}0D, rgba(10,13,18,0.9))`
                  : "rgba(10,13,18,0.82)",
                borderRadius: 9,
                padding: "12px 14px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <Mono size={9} color={active ? step.color : C.silver} style={{ letterSpacing: "0.14em" }}>
                  {step.label}
                </Mono>
                {active ? (
                  <span style={{ color: C.green, fontFamily: MONO, fontSize: 11 }}>✓</span>
                ) : (
                  <Mono size={8} color={C.mute}>
                    WAIT
                  </Mono>
                )}
              </div>
              <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 8, letterSpacing: "0.08em", color: C.dim }}>
                {step.detail}
              </div>
            </div>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 28,
          top: 44 + travel * (height - 90),
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: C.white,
          boxShadow: `0 0 18px ${C.cyan}, 0 0 40px ${C.cyan}66`,
          opacity: travel > 0 && travel < 0.99 ? 1 : 0,
        }}
      />
    </div>
  );
};

export const PolicyPanel: React.FC<{
  start?: number;
  width?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 380, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start + 1.6, 0.8);
  const denied = progress(frame, fps, start + 2.6, 0.6);
  const allowed = progress(frame, fps, start + 3.5, 0.6);

  return (
    <Panel start={start} accent={`${C.cyan}33`} style={{ width, ...style }}>
      <PanelHeader left="POLICY / OBJECT ACCESS" accent={C.cyan} right={<Mono size={8} color={C.cyan}>DEFAULT: DENY</Mono>} />
      <div style={{ padding: "16px 16px" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, lineHeight: 1.9, color: C.dim }}>
          <span style={{ color: C.cyan }}>authorize</span>(user, record) {"{"}
          <br />
          &nbsp;&nbsp;<span style={{ color: C.orange }}>if</span> (record.ownerId !== user.id)
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: C.red }}>return deny</span>();
          <br />
          &nbsp;&nbsp;<span style={{ color: C.orange }}>if</span> (!user.canRead(record))
          <br />
          &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: C.red }}>return deny</span>();
          <br />
          &nbsp;&nbsp;<span style={{ color: C.green }}>return allow</span>();
          <br />
          {"}"}
        </div>

        <div style={{ marginTop: 16, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 12, opacity: p }}>
          <StatusRow label="OWNER MATCH" value="REQUIRED" color={C.cyan} />
          <StatusRow label="DEFAULT" value="DENY" color={C.orange} style={{ marginTop: 8 }} />
          <StatusRow label="DATABASE ROLE" value="READ ONLY" color={C.green} style={{ marginTop: 8 }} />
        </div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 7 }}>
          <div
            style={{
              border: `1px solid ${C.red}44`,
              background: C.redSoft,
              borderRadius: 5,
              padding: "7px 9px",
              opacity: denied,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Mono size={7} color={C.red}>OTHER USER'S RECORD</Mono>
            <Mono size={8} color={C.red}>DENIED</Mono>
          </div>
          <div
            style={{
              border: `1px solid ${C.green}44`,
              background: C.greenSoft,
              borderRadius: 5,
              padding: "7px 9px",
              opacity: allowed,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Mono size={7} color={C.green}>OWN RECORD</Mono>
            <Mono size={8} color={C.green}>ALLOWED</Mono>
          </div>
        </div>
      </div>
    </Panel>
  );
};

export const SecureStack: React.FC<{
  start?: number;
  width?: number;
  style?: CSSProperties;
}> = ({ start = 0, width = 928, style }) => {
  const { frame, fps } = useTime();
  const sweep = progress(frame, fps, start + 1.0, 2.2, easeInOut);
  const protect = progress(frame, fps, start + 0.8, 0.8);
  return (
    <div style={{ width, position: "relative", ...style }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ flex: 1 }}>
          <AppWindow
            start={start}
            width={520}
            height={360}
            title="NORTHSTAR / SECURE WORKSPACE"
            accent={C.cyan}
            status={
              <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <Dot color={C.green} size={6} pulse />
                <Mono size={9} color={C.green}>
                  PROTECTED
                </Mono>
              </span>
            }
          >
            <div style={{ padding: "16px 18px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <Mono size={8} color={C.mute}>CUSTOMER WORKSPACE</Mono>
                  <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 24, fontWeight: 600, letterSpacing: "-0.04em", color: C.white }}>
                    Authorized view
                  </div>
                </div>
                <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
                  OWNER VERIFIED
                </Tag>
              </div>
              <div style={{ marginTop: 14, border: `1px solid ${C.lineSoft}`, borderRadius: 7, padding: "10px 11px", background: "rgba(255,255,255,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Mono size={7} color={C.mute}>RECORD</Mono>
                  <Mono size={7} color={C.green}>ACCESS GRANTED</Mono>
                </div>
                <div style={{ marginTop: 7, fontFamily: MONO, fontSize: 10, color: C.silver }}>CUST-A-1042 / INVOICE INV-8842</div>
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 7 }}>
                {["AUTHENTICATED", "AUTHORIZED", "AUDITED"].map((label) => (
                  <Tag key={label} color={C.cyan} background={C.cyanSoft} style={{ fontSize: 7, padding: "5px 7px" }}>
                    {label}
                  </Tag>
                ))}
              </div>
              <div style={{ marginTop: 14, borderTop: `1px solid ${C.lineSoft}`, paddingTop: 10 }}>
                <StatusRow label="AUTHORIZATION" value="SERVER-SIDE" color={C.cyan} />
                <StatusRow label="DATABASE ROLE" value="READ ONLY" color={C.green} style={{ marginTop: 7 }} />
              </div>
            </div>
          </AppWindow>
        </div>

        <div style={{ width: 260, position: "relative" }}>
          <div
            style={{
              position: "absolute",
              left: -34,
              top: 50,
              bottom: 50,
              width: 2,
              background: `linear-gradient(180deg, transparent, ${C.cyan}, ${C.green}, transparent)`,
              opacity: protect,
              boxShadow: `0 0 20px ${C.cyan}55`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: -55,
              top: 130,
              border: `1px solid ${C.cyan}55`,
              background: "rgba(5,6,8,0.94)",
              borderRadius: 100,
              padding: "6px 10px",
              opacity: protect,
              zIndex: 2,
            }}
          >
            <Mono size={7} color={C.cyan}>AUTHZ</Mono>
          </div>
          <DatabaseStack size={260} start={start + 0.5} label="CUSTOMER DB" sublabel="RESTRICTED" accent={C.cyan} />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: -20,
          bottom: -20,
          left: `${-30 + sweep * 130}%`,
          width: 180,
          background: `linear-gradient(90deg, transparent, ${C.white}18, transparent)`,
          transform: "rotate(16deg)",
          filter: "blur(12px)",
          opacity: sweep > 0 && sweep < 1 ? 0.8 : 0,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Small evidence row                                                  */
/* ------------------------------------------------------------------ */

export const EvidencePanel: React.FC<{
  start?: number;
  title: string;
  accent?: string;
  items: Array<{ label: string; value: string; color?: string }>;
  width?: number;
  style?: CSSProperties;
}> = ({ start = 0, title, accent = C.cyan, items, width = 928, style }) => {
  const { frame, fps } = useTime();
  return (
    <Panel start={start} accent={`${accent}33`} style={{ width, ...style }}>
      <PanelHeader
        left={title}
        accent={accent}
        right={
          <Mono size={8} color={accent}>
            EVIDENCE
          </Mono>
        }
      />
      <div style={{ padding: "14px 18px", display: "flex", gap: 10 }}>
        {items.map((item, i) => {
          const p = progress(frame, fps, start + 0.2 + i * 0.1, 0.5);
          const color = item.color ?? accent;
          return (
            <div
              key={item.label}
              style={{
                flex: 1,
                borderLeft: `1px solid ${color}44`,
                paddingLeft: 10,
                opacity: p,
                transform: `translateY(${(1 - p) * 8}px)`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Dot color={color} size={5} />
                <Mono size={7} color={C.mute}>
                  {item.label}
                </Mono>
              </div>
              <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 9, letterSpacing: "0.08em", color, lineHeight: 1.4 }}>
                {item.value}
              </div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
};

export const EvidenceRow: React.FC<{
  label: string;
  value: string;
  color?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ label, value, color = C.cyan, start = 0, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.5);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        borderBottom: `1px solid ${C.lineSoft}`,
        padding: "9px 0",
        opacity: p,
        ...style,
      }}
    >
      <Mono size={8} color={C.mute}>
        {label}
      </Mono>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <Dot color={color} size={5} />
        <Mono size={8} color={color}>
          {value}
        </Mono>
      </div>
    </div>
  );
};

