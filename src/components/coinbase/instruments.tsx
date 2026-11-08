import type { CSSProperties, ReactNode } from "react";
import { interpolate } from "remotion";
import { C, FONT, MONO } from "../../config/coinbase";
import { clamp, Dot, easeOut, Mono, progress, Tag, useTime } from "./kit";

/* ------------------------------------------------------------------ */
/* Decorative code field                                               */
/* ------------------------------------------------------------------ */

const CODE_LINES = [
  "export async function reconcile(batch: Batch) {",
  "  const result = await ledger.verify({",
  "    source: batch.origin,",
  "    target: batch.destination,",
  "    currency: 'USD',",
  "  });",
  "",
  "  if (!result.settled) return retry(result);",
  "  await audit.record(result.id);",
  "  return result.ok;",
  "}",
  "",
  "const agent = await orchestrator.spawn({",
  "  task: 'implement',",
  "  scope: ['api', 'tests', 'migration'],",
  "  review: human.approval,",
  "});",
  "",
  "export const intent = define({",
  "  outcome: 'one clean handoff',",
  "  constraints: ['no regressions'],",
  "});",
  "",
  "while (queue.length > 0) {",
  "  const task = queue.shift();",
  "  await agent.execute(task);",
  "}",
  "",
  "const checks = await test.run({",
  "  suites: ['unit', 'integration'],",
  "  coverage: 0.92,",
  "});",
  "",
  "await review.request({",
  "  author: 'agent-04',",
  "  reviewer: 'engineer',",
  "  files: 12,",
  "});",
];

export const CodeField: React.FC<{
  frozenAt?: number;
  opacity?: number;
  columns?: number;
  fontSize?: number;
  style?: CSSProperties;
}> = ({ frozenAt = 2.15, opacity = 0.16, columns = 5, fontSize = 15, style }) => {
  const { frame, fps } = useTime();
  const t = Math.min(frame / fps, frozenAt);
  return (
    <div
      style={{
        position: "absolute",
        inset: -80,
        overflow: "hidden",
        opacity,
        pointerEvents: "none",
        display: "flex",
        gap: "7%",
        paddingLeft: "2%",
        ...style,
      }}
    >
      {new Array(columns).fill(0).map((_, col) => {
        const speed = 8 + col * 3.5;
        const offset = (t * speed * fontSize * 1.7) % 900;
        return (
          <div
            key={col}
            style={{
              flex: 1,
              transform: `translateY(${-offset}px)`,
              fontFamily: MONO,
              fontSize,
              lineHeight: 1.85,
              color: col % 2 === 0 ? C.white : C.lime,
              whiteSpace: "nowrap",
              filter: col % 2 === 0 ? "none" : "blur(0.35px)",
            }}
          >
            {[...CODE_LINES, ...CODE_LINES].map((line, i) => (
              <div
                key={`${col}-${i}`}
                style={{
                  opacity:
                    0.16 +
                    0.4 * Math.abs(Math.sin((i + col * 3) * 0.37)) *
                      (i % 7 === 0 ? 1 : 0.55),
                }}
              >
                {line || " "}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Syntax-coloured editor                                              */
/* ------------------------------------------------------------------ */

const KEYWORDS = new Set([
  "export",
  "async",
  "function",
  "const",
  "await",
  "return",
  "if",
  "while",
  "new",
  "import",
  "from",
  "type",
]);

const colorLine = (line: string): ReactNode[] =>
  line.split(/(\s+|'[^']*'|[{}()[\];,.])/g).map((token, i) => {
    let color = "rgba(244,241,232,0.72)";
    if (KEYWORDS.has(token)) color = C.lime;
    else if (token.startsWith("'")) color = C.amber;
    else if (/^\d/.test(token)) color = C.blueGrey;
    else if (token.startsWith("//")) color = C.mute;
    else if (/^[A-Z]/.test(token)) color = "#DFE9D0";
    return (
      <span key={i} style={{ color }}>
        {token}
      </span>
    );
  });

export const CodeEditor: React.FC<{
  start?: number;
  width?: number | string;
  height?: number;
  fontSize?: number;
  style?: CSSProperties;
  dim?: number;
}> = ({ start = 0, width = "100%", height = 430, fontSize = 15, style, dim = 0 }) => {
  const { frame, fps } = useTime();
  const entrance = progress(frame, fps, start, 0.7);
  const lines = CODE_LINES.slice(0, 12);
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 10,
        border: `1px solid ${C.line}`,
        background:
          "linear-gradient(180deg, rgba(28,32,35,0.94) 0%, rgba(14,16,18,0.96) 100%)",
        boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
        overflow: "hidden",
        opacity: entrance * (1 - dim),
        transform: `translateY(${(1 - entrance) * 24}px)`,
        ...style,
      }}
    >
      <div
        style={{
          height: 44,
          borderBottom: `1px solid ${C.lineSoft}`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          gap: 7,
        }}
      >
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: i === 0 ? C.red : i === 1 ? C.amber : C.lime,
              opacity: 0.55,
            }}
          />
        ))}
        <Mono size={11} color={C.dim} style={{ marginLeft: 12 }}>
          checkout / agent.ts
        </Mono>
        <div style={{ flex: 1 }} />
        <Mono size={10} color={C.mute}>
          TYPESCRIPT
        </Mono>
      </div>
      <div
        style={{
          padding: "20px 22px",
          fontFamily: MONO,
          fontSize,
          lineHeight: 1.85,
          whiteSpace: "nowrap",
        }}
      >
        {lines.map((line, i) => {
          const lineStart = start + 0.55 + i * 0.18;
          const typed = clamp(
            (frame / fps - lineStart) / Math.max(0.2, line.length * 0.022),
          );
          return (
            <div key={i} style={{ display: "flex", gap: 18 }}>
              <span
                style={{
                  color: "rgba(244,241,232,0.2)",
                  width: 18,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {i + 1}
              </span>
              <span style={{ overflow: "hidden" }}>
                {colorLine(line.slice(0, Math.round(line.length * typed)))}
                {typed > 0 && typed < 1 ? (
                  <span
                    style={{
                      display: "inline-block",
                      width: 7,
                      height: fontSize * 1.1,
                      background: C.lime,
                      verticalAlign: "text-bottom",
                      marginLeft: 2,
                      opacity: 0.8,
                    }}
                  />
                ) : null}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Pull-request hero panel (illustrative interface)                    */
/* ------------------------------------------------------------------ */

const PR_TASKS = [
  { label: "Implement reconciliation worker", files: "6 files" },
  { label: "Add integration coverage", files: "3 files" },
  { label: "Run type and lint checks", files: "passed" },
  { label: "Draft migration notes", files: "1 file" },
];

export const PullRequestPanel: React.FC<{
  start?: number;
  width?: number | string;
  height?: number;
  compact?: boolean;
  style?: CSSProperties;
}> = ({ start = 0, width = "100%", height = 560, compact = false, style }) => {
  const { frame, fps } = useTime();
  const t = frame / fps;
  const entrance = progress(frame, fps, start, 0.8);
  const status = progress(frame, fps, start + 2.25, 0.7);
  const progressWidth = progress(frame, fps, start + 0.4, 2.8);

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 12,
        border: `1px solid ${C.line}`,
        background:
          "linear-gradient(155deg, rgba(26,30,33,0.97) 0%, rgba(11,13,15,0.98) 72%)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.55)",
        overflow: "hidden",
        opacity: entrance,
        transform: `translateY(${(1 - entrance) * 90}px) scale(${0.98 + entrance * 0.02})`,
        ...style,
      }}
    >
      <div
        style={{
          height: 54,
          padding: "0 22px",
          borderBottom: `1px solid ${C.lineSoft}`,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <circle cx="6" cy="5" r="2.4" stroke={C.lime} strokeWidth="1.4" />
          <circle cx="6" cy="19" r="2.4" stroke={C.lime} strokeWidth="1.4" />
          <circle cx="18" cy="8" r="2.4" stroke={C.lime} strokeWidth="1.4" />
          <path d="M6 7.4v9.2M18 10.4c0 3-3 3.6-6 3.6H6" stroke={C.lime} strokeWidth="1.4" />
        </svg>
        <Mono size={11} color={C.dim}>
          PULL REQUEST 4127
        </Mono>
        <div style={{ flex: 1 }} />
        <Tag>Agent</Tag>
      </div>

      <div style={{ padding: compact ? "18px 20px" : "24px 24px" }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: compact ? 22 : 27,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: C.white,
            lineHeight: 1.2,
          }}
        >
          Add real-time balance reconciliation
        </div>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Mono size={10} color={C.mute}>
            ledger-service
          </Mono>
          <Dot size={3} color={C.mute} />
          <Mono size={10} color={C.mute}>
            12 FILES
          </Mono>
          <span style={{ color: C.lime, fontFamily: MONO, fontSize: 10 }}>+428</span>
          <span style={{ color: C.red, fontFamily: MONO, fontSize: 10 }}>−96</span>
        </div>

        <div style={{ marginTop: compact ? 14 : 20, display: "grid", gap: compact ? 8 : 11 }}>
          {PR_TASKS.map((task, i) => {
            const rowP = progress(frame, fps, start + 0.35 + i * 0.42, 0.5);
            const check = progress(frame, fps, start + 0.9 + i * 0.52, 0.32);
            return (
              <div
                key={task.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: rowP,
                  transform: `translateX(${(1 - rowP) * -14}px)`,
                  padding: compact ? "7px 0" : "9px 0",
                  borderBottom: i < PR_TASKS.length - 1 ? `1px solid ${C.lineSoft}` : "none",
                }}
              >
                <div
                  style={{
                    width: 17,
                    height: 17,
                    borderRadius: 3,
                    border: `1px solid ${check > 0.1 ? C.lime : C.line}`,
                    background: check > 0.1 ? C.lime : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transform: `scale(${0.8 + check * 0.2})`,
                  }}
                >
                  {check > 0.35 ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6.2 4.7 9 10 3"
                        stroke={C.black}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : null}
                </div>
                <div
                  style={{
                    flex: 1,
                    fontFamily: FONT,
                    fontSize: compact ? 13 : 15,
                    fontWeight: 400,
                    color: C.white,
                    opacity: 0.9,
                  }}
                >
                  {task.label}
                </div>
                <Mono size={9} color={C.mute}>
                  {task.files}
                </Mono>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: compact ? 14 : 20 }}>
          <div
            style={{
              height: 3,
              width: "100%",
              background: C.lineSoft,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressWidth * 100}%`,
                background: C.lime,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 13,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: 0.55 + status * 0.45,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <Dot size={6} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.12em",
                  color: status > 0.4 ? C.lime : C.dim,
                }}
              >
                {status > 0.4 ? "READY FOR REVIEW" : "AGENTS WORKING"}
              </span>
            </div>
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9,
                letterSpacing: "0.1em",
                color: C.mute,
                opacity: 0.55,
              }}
            >
              ILLUSTRATIVE INTERFACE
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 14,
            borderTop: `1px solid ${C.lineSoft}`,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            opacity: progress(frame, fps, start + 1.0, 0.7),
          }}
        >
          {[
            ["AGENTS", "4 ACTIVE"],
            ["CHECKS", "14 PASSED"],
            ["REVIEW", "HUMAN"],
          ].map(([label, value]) => (
            <div key={label}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.16em",
                  color: C.mute,
                  marginBottom: 5,
                }}
              >
                {label}
              </div>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  color: label === "REVIEW" ? C.lime : C.white,
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 54,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.lime}55, transparent)`,
          opacity: t > start ? 0.7 : 0,
        }}
      />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* PR cards                                                            */
/* ------------------------------------------------------------------ */

export const PRCard: React.FC<{
  index: number;
  agent: boolean;
  start: number;
  width: number;
  height: number;
  style?: CSSProperties;
}> = ({ index, agent, start, width, height, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start + index * 0.075, 0.55);
  const lit = progress(frame, fps, start + 0.7 + index * 0.09, 0.35);
  const pulse = 0.72 + 0.28 * Math.sin(frame / fps * 1.8 + index * 0.85);
  const num = 2700 + index * 137;
  return (
    <div
      style={{
        width,
        height,
        borderRadius: 7,
        border: `1px solid ${agent ? `rgba(200,246,91,${0.18 + lit * 0.36})` : C.lineSoft}`,
        background: agent
          ? `linear-gradient(160deg, rgba(200,246,91,${0.07 + lit * 0.05}) 0%, rgba(13,15,17,0.94) 60%)`
          : "rgba(18,21,23,0.82)",
        opacity: p * (agent ? 1 : 0.6),
        transform: `translateY(${(1 - p) * 26}px) scale(${0.94 + p * 0.06})`,
        position: "relative",
        overflow: "hidden",
        padding: width * 0.075,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Mono size={Math.max(8, width * 0.043)} color={agent ? C.lime : C.mute}>
          PR · {num}
        </Mono>
        <div
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: agent ? C.lime : C.mute,
            opacity: agent ? 0.4 + lit * 0.6 : 0.4,
          }}
        />
      </div>
      <div style={{ display: "grid", gap: height * 0.06 }}>
        <div
          style={{
            height: 3,
            width: `${58 + ((index * 13) % 32)}%`,
            background: C.white,
            opacity: agent ? 0.55 : 0.18,
          }}
        />
        <div
          style={{
            height: 3,
            width: `${34 + ((index * 17) % 28)}%`,
            background: C.white,
            opacity: agent ? 0.3 : 0.1,
          }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontFamily: MONO,
            fontSize: Math.max(7, width * 0.038),
            letterSpacing: "0.12em",
            color: agent ? C.lime : C.mute,
          }}
        >
          {agent ? "AGENT" : "HUMAN"}
        </span>
        {agent ? (
          <svg width={width * 0.1} height={width * 0.1} viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6.2 4.7 9 10 3"
              stroke={C.lime}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={lit * pulse}
            />
          </svg>
        ) : null}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Agent task row                                                      */
/* ------------------------------------------------------------------ */

export const AgentTask: React.FC<{
  index: number;
  label: string;
  detail: string;
  start: number;
  duration: number;
  status: string;
  style?: CSSProperties;
}> = ({ index, label, detail, start, duration, status, style }) => {
  const { frame, fps } = useTime();
  const rowP = progress(frame, fps, start, 0.5);
  const fill = progress(frame, fps, start + 0.15, duration);
  const done = fill > 0.94;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${C.lineSoft}`,
        opacity: rowP,
        transform: `translateY(${(1 - rowP) * 12}px)`,
        ...style,
      }}
    >
      <Mono size={9} color={C.mute} style={{ width: 18 }}>
        {String(index + 1).padStart(2, "0")}
      </Mono>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 14,
            fontWeight: 500,
            color: C.white,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.04em",
            color: C.mute,
            marginTop: 3,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {detail}
        </div>
      </div>
      <div style={{ width: 92, flexShrink: 0 }}>
        <div style={{ height: 2, background: C.lineSoft, overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${fill * 100}%`,
              background: done ? C.lime : "rgba(200,246,91,0.55)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 5,
            fontFamily: MONO,
            fontSize: 8,
            letterSpacing: "0.08em",
            color: done ? C.lime : C.mute,
            textAlign: "right",
          }}
        >
          {done ? "DONE" : status}
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Human role rail                                                     */
/* ------------------------------------------------------------------ */

export const HumanRail: React.FC<{
  start: number;
  items: readonly string[];
  style?: CSSProperties;
}> = ({ start, items, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.65);
  return (
    <div
      style={{
        border: `1px solid rgba(200,246,91,0.3)`,
        background: "rgba(200,246,91,0.045)",
        borderRadius: 8,
        padding: "14px 13px",
        opacity: p,
        transform: `translateX(${(1 - p) * 20}px)`,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Dot size={6} />
        <Mono size={9} color={C.lime} style={{ letterSpacing: "0.16em" }}>
          HUMAN
        </Mono>
      </div>
      <div style={{ display: "grid", gap: 9 }}>
        {items.map((item, i) => {
          const itemP = progress(frame, fps, start + 0.3 + i * 0.16, 0.4);
          return (
            <div
              key={item}
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.08em",
                color: C.white,
                opacity: itemP * 0.94,
                display: "flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: C.lime,
                  flexShrink: 0,
                }}
              />
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Simple metric chip                                                  */
/* ------------------------------------------------------------------ */

export const MetricReadout: React.FC<{
  value: ReactNode;
  label: string;
  start: number;
  style?: CSSProperties;
}> = ({ value, label, start, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.6);
  return (
    <div style={{ opacity: p, ...style }}>
      <div
        style={{
          fontFamily: FONT,
          fontSize: 30,
          fontWeight: 600,
          color: C.white,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          marginTop: 8,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.14em",
          color: C.mute,
        }}
      >
        {label}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Weekly hour strip (scene 6)                                         */
/* ------------------------------------------------------------------ */

const SAVED_HOURS = new Set([
  "0-7",
  "1-6",
  "2-5",
  "3-4",
  "4-3",
  "0-3",
  "2-2",
]);

export const WeekHours: React.FC<{
  start: number;
  width: number;
  height: number;
  style?: CSSProperties;
}> = ({ start, width, height, style }) => {
  const { frame, fps } = useTime();
  const p = progress(frame, fps, start, 0.6);
  const lift = progress(frame, fps, start + 2.3, 0.8);
  const days = ["M", "T", "W", "T", "F"];
  const savedList = [...SAVED_HOURS];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 7,
        width,
        height,
        opacity: p,
        ...style,
      }}
    >
      {days.map((day, d) => (
        <div key={`${day}-${d}`} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ flex: 1, display: "grid", gridTemplateRows: "repeat(8, 1fr)", gap: 3 }}>
            {new Array(8).fill(0).map((_, h) => {
              const key = `${d}-${h}`;
              const saved = SAVED_HOURS.has(key);
              const index = savedList.indexOf(key);
              const reveal = saved
                ? progress(frame, fps, start + 0.55 + index * 0.13, 0.32)
                : 0;
              return (
                <div
                  key={h}
                  style={{
                    background:
                      saved && reveal > 0.05
                        ? C.lime
                        : saved
                          ? "rgba(200,246,91,0.16)"
                          : "rgba(244,241,232,0.08)",
                    opacity: saved ? 0.35 + reveal * 0.65 : 0.42,
                    borderRadius: 1,
                    transform: saved
                      ? `translateY(${-lift * 9}px) scale(${0.82 + reveal * 0.18})`
                      : "none",
                    boxShadow: saved && reveal > 0.5 ? `0 0 12px ${C.lime}44` : "none",
                  }}
                />
              );
            })}
          </div>
          <Mono size={8} color={C.mute} style={{ textAlign: "center" }}>
            {day}
          </Mono>
        </div>
      ))}
    </div>
  );
};

/** Bar chart used behind +55%. Grows on a 0..1 progress. */
export const GrowthBars: React.FC<{
  start: number;
  count?: number;
  width: number;
  height: number;
  highlight?: number;
  style?: CSSProperties;
}> = ({ start, count = 9, width, height, highlight = 9, style }) => {
  const { frame, fps } = useTime();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 5,
        width,
        height,
        ...style,
      }}
    >
      {new Array(count).fill(0).map((_, i) => {
        const p = progress(frame, fps, start + i * 0.06, 0.7, easeOut);
        const target = 0.2 + (i / Math.max(1, count - 1)) * 0.72;
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${target * p * 100}%`,
              background: i >= count - highlight ? C.lime : "rgba(244,241,232,0.14)",
              borderRadius: 1,
              opacity: i >= count - highlight ? 0.85 : 1,
            }}
          />
        );
      })}
    </div>
  );
};

/** Deterministic horizontal scan used at act cuts. */
export const ScanLine: React.FC<{
  at: number;
  duration?: number;
  color?: string;
}> = ({ at, duration = 0.55, color = C.lime }) => {
  const { frame, fps } = useTime();
  const p = clamp((frame / fps - at) / duration);
  if (p <= 0 || p >= 1) return null;
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${p * 100}%`,
        height: 2,
        background: color,
        boxShadow: `0 0 24px ${color}`,
        opacity: interpolate(p, [0, 0.2, 0.8, 1], [0, 0.55, 0.55, 0]),
        zIndex: 20,
      }}
    />
  );
};
