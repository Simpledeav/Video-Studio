import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/coinbase";
import {
  ActivityBars,
  BackdropGrid,
  Dot,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  progress,
  Reveal,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { AgentTask, CodeEditor, HumanRail, ScanLine } from "../instruments";

const TASKS = [
  { label: "Implement checkout flow", detail: "6 files · branch agent/checkout" },
  { label: "Write integration tests", detail: "14 cases · 92% coverage" },
  { label: "Migrate legacy schema", detail: "3 tables · reversible" },
  { label: "Fix failing builds", detail: "2 services · green" },
  { label: "Update API contracts", detail: "8 endpoints · typed" },
  { label: "Draft release notes", detail: "1 document · reviewed" },
] as const;

export const SceneShift: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();

  const editorOut = progress(frame, fps, 4.85, 0.55, (x) => x);
  const queueIn = progress(frame, fps, 5.05, 0.7);
  const railIn = progress(frame, fps, 9.1, 0.7);
  const chipsIn = progress(frame, fps, 9.3, 0.7);

  const panelTop = wide ? 170 : 548;
  const panelWidth = wide ? 1042 : 928;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="74%" y="40%" size={64} opacity={0.08} />
      <BackdropGrid opacity={0.34} size={wide ? 108 : 88} />
      <Vignette strength={0.9} />

      <div style={{ position: "absolute", left: margin, top: wide ? 108 : 104 }}>
        <Kicker start={-0.5}>{COPY.shiftKicker}</Kicker>
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 174 : 158,
          width: wide ? 600 : 900,
        }}
      >
        {COPY.shiftHeadline.map((line, i) => (
          <MaskLine
            key={line}
            start={-0.4 + i * 0.12}
            duration={0.85}
            style={{
              fontFamily: FONT,
              fontSize: i === 0 ? v(58, 58) : v(82, 72),
              fontWeight: 600,
              letterSpacing: "-0.045em",
              lineHeight: 0.95,
              color: i === 0 ? C.dim : C.white,
            }}
          >
            {line}
          </MaskLine>
        ))}
      </div>

      <Reveal
        start={2.55}
        duration={0.75}
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 402 : 398,
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: v(66, 58),
            fontWeight: 600,
            letterSpacing: "-0.045em",
            color: C.lime,
            lineHeight: 0.9,
          }}
        >
          2,400<span style={{ fontSize: v(40, 36) }}>+</span>
        </div>
        <div style={{ paddingBottom: 6 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(12, 11),
              fontWeight: 500,
              letterSpacing: "0.14em",
              color: C.dim,
              whiteSpace: "nowrap",
            }}
          >
            {COPY.shiftMetricLabel}
          </div>
          <div
            style={{
              marginTop: 5,
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.16em",
              color: C.mute,
            }}
          >
            REPORTED  ·  AGENT-FIRST MODEL
          </div>
        </div>
      </Reveal>

      {/* Panel stage */}
      <div
        style={{
          position: "absolute",
          left: wide ? 762 : margin,
          top: panelTop,
          width: panelWidth,
          height: wide ? 500 : 580,
        }}
      >
        {/* Before: code editor */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 1 - editorOut,
            transform: `translateY(${-editorOut * 40}px) scale(${1 - editorOut * 0.025})`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              padding: "0 2px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Dot size={5} color={C.mute} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.16em",
                  color: C.mute,
                }}
              >
                BEFORE  ·  EVERY LINE, BY HAND
              </span>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 8, color: C.mute }}>
              1,204 LINES
            </span>
          </div>
          <CodeEditor
            start={1.6}
            height={wide ? 470 : 520}
            fontSize={wide ? 14 : 13}
            width="100%"
          />
        </div>

        {/* After: agent queue */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: queueIn,
            transform: `translateY(${(1 - queueIn) * 44}px)`,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              height: "100%",
              borderRadius: 10,
              border: `1px solid ${C.line}`,
              background:
                "linear-gradient(165deg, rgba(20,24,27,0.97) 0%, rgba(9,11,13,0.98) 100%)",
              boxShadow: "0 30px 90px rgba(0,0,0,0.4)",
              padding: wide ? "18px 22px" : "16px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ActivityBars width={34} height={13} start={5.1} />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  color: C.white,
                }}
              >
                AGENT QUEUE
              </span>
              <div style={{ flex: 1 }} />
              <Tag style={{ padding: "5px 8px", fontSize: 9 }}>
                {COPY.shiftAgentsLabel}
              </Tag>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: wide ? "1fr 204px" : "1fr 186px",
                gap: wide ? 26 : 18,
                flex: 1,
                minHeight: 0,
              }}
            >
              <div style={{ minWidth: 0 }}>
                {TASKS.map((task, i) => (
                  <AgentTask
                    key={task.label}
                    index={i}
                    label={task.label}
                    detail={task.detail}
                    start={5.25 + i * 0.22}
                    duration={1.5 + (i % 3) * 0.45}
                    status={i % 2 === 0 ? "RUNNING" : "QUEUED"}
                  />
                ))}
                <div
                  style={{
                    marginTop: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    opacity: progress(frame, fps, 8.2, 0.6),
                  }}
                >
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 8,
                      letterSpacing: "0.14em",
                      color: C.mute,
                    }}
                  >
                    REVIEW GATE  ·  HUMAN APPROVAL REQUIRED
                  </span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: 8,
                      letterSpacing: "0.14em",
                      color: C.lime,
                    }}
                  >
                    READY
                  </span>
                </div>
              </div>

              <div
                style={{
                  opacity: railIn,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  paddingTop: wide ? 36 : 34,
                }}
              >
                <HumanRail start={9.1} items={COPY.shiftHuman} />
                <div
                  style={{
                    border: `1px dashed ${C.lineSoft}`,
                    borderRadius: 6,
                    padding: "10px 10px",
                    opacity: 0.85,
                  }}
                >
                  <div
                    style={{
                      fontFamily: MONO,
                      fontSize: 8,
                      letterSpacing: "0.14em",
                      color: C.mute,
                      marginBottom: 7,
                    }}
                  >
                    WORK MOVES UP
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 9,
                      lineHeight: 1.55,
                      color: C.dim,
                    }}
                  >
                    From writing every line to directing the system that writes it.
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: "auto",
                paddingTop: 11,
                borderTop: `1px solid ${C.lineSoft}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                opacity: progress(frame, fps, 7.9, 0.6),
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.16em",
                  color: C.mute,
                }}
              >
                AGENT RUN  ·  COMPLETE
              </span>
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.12em",
                  color: C.dim,
                }}
              >
                12 FILES CHANGED  ·  +428 −96
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 716 : 1238,
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          width: wide ? 600 : 928,
          opacity: chipsIn,
          transform: `translateY(${(1 - chipsIn) * 14}px)`,
        }}
      >
        {COPY.shiftHuman.map((item, i) => (
          <div
            key={item}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: `1px solid ${C.line}`,
              borderRadius: 30,
              padding: wide ? "9px 16px" : "10px 17px",
              background: "rgba(255,255,255,0.015)",
              opacity: 0.55 + progress(frame, fps, 9.3 + i * 0.12, 0.5) * 0.45,
            }}
          >
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.lime }} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: wide ? 11 : 12,
                fontWeight: 600,
                letterSpacing: "0.1em",
                color: C.white,
              }}
            >
              {item}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? margin : undefined,
          right: wide ? undefined : margin,
          top: wide ? 838 : 1360,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: progress(frame, fps, 9.6, 0.7) * 0.8,
        }}
      >
        <Dot size={5} />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.14em",
            color: C.mute,
          }}
        >
          DEVELOPER AS ORCHESTRATOR
        </span>
      </div>

      <ScanLine at={13.0} duration={0.5} />
      <Grain />
    </AbsoluteFill>
  );
};
