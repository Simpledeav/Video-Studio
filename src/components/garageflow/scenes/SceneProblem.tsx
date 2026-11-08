import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import {
  Grain,
  Hairline,
  Kicker,
  MaskLine,
  Mono,
  Photo,
  progress,
  Tag,
  useTime,
  Vignette,
} from "../kit";

const LEDGER = [
  { label: "Customer calls", value: "6 waiting", tone: C.amber },
  { label: "Repair estimates", value: "3 drafts", tone: C.silver },
  { label: "Mechanics", value: "2 bays", tone: C.silver },
  { label: "Spare parts", value: "1 backorder", tone: C.amber },
  { label: "Payment confirmations", value: "2 unmarked", tone: C.silver },
  { label: "Job updates", value: "Sent by text?", tone: C.muted },
];

const NotebookCard: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(150deg, #F4EDDC 0%, #E9DFC9 100%)",
      borderRadius: 8,
      padding: "20px 22px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 15,
        background: "linear-gradient(90deg, #C8B99D, #E2D6BF)",
      }}
    />
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: "#8A7655" }}>NOTEBOOK · TUESDAY</span>
      <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 8, color: "#A08E6D" }}>PAGE 14</span>
    </div>
    <div style={{ marginTop: 15, fontFamily: FONT, fontSize: 22, fontWeight: 600, color: "#2C2820", letterSpacing: "-0.02em" }}>
      Golf GTI — brake noise
    </div>
    <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 9 }}>
      {[
        ["Call Emma back", true],
        ["Order front pads?", false],
        ["Check discs", false],
        ["Quote — £440?", false],
      ].map(([label, done]) => (
        <div key={String(label)} style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span
            style={{
              width: 13,
              height: 13,
              borderRadius: 2,
              border: "1.5px solid #8A7655",
              display: "grid",
              placeItems: "center",
              fontFamily: FONT,
              fontSize: 10,
              color: "#2E5FA8",
            }}
          >
            {done ? "✓" : ""}
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 13,
              fontStyle: "italic",
              color: done ? "#8A7655" : "#3C352A",
              textDecoration: done ? "line-through" : "none",
            }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
    <div
      style={{
        position: "absolute",
        right: 20,
        bottom: 18,
        fontFamily: FONT,
        fontSize: 11,
        fontStyle: "italic",
        color: "#2E5FA8",
        transform: "rotate(-3deg)",
      }}
    >
      “who has the keys?”
    </div>
  </div>
);

const SpreadsheetCard: React.FC = () => {
  const rows = [
    ["JC-2481", "Golf GTI", "Brake noise", "£440?", "WAITING"],
    ["JC-2480", "320d", "Suspension", "£265", "SENT"],
    ["JC-2479", "Yaris", "Service", "£180", "PAID"],
    ["JC-2478", "Octavia", "Timing belt", "£620", "BOOKED"],
  ];
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "#F7F9FB",
        borderRadius: 8,
        border: "1px solid #D6DEE8",
        boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: 26,
          background: "#E8EEF5",
          borderBottom: "1px solid #D6DEE8",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 10px",
        }}
      >
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#5BA76F" }} />
        <span style={{ fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.08em", color: "#5C6B7D" }}>
          jobs_may_2026_FINAL_v3.xlsx
        </span>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "58px 1fr 1fr 62px 66px", gap: 0 }}>
          {["JOB", "VEHICLE", "CONCERN", "QUOTE", "STATUS"].map((head) => (
            <div
              key={head}
              style={{
                background: "#E8EEF5",
                border: "1px solid #D6DEE8",
                padding: "5px 6px",
                fontFamily: MONO,
                fontSize: 7,
                letterSpacing: "0.08em",
                color: "#5C6B7D",
              }}
            >
              {head}
            </div>
          ))}
          {rows.map((row) =>
            row.map((cell, cellIndex) => (
              <div
                key={`${row[0]}-${cellIndex}`}
                style={{
                  border: "1px solid #E2E8EF",
                  background: cell === "£440?" ? "#FFF4DE" : cellIndex === 4 && cell === "WAITING" ? "#FFF4DE" : "#fff",
                  padding: "6px",
                  fontFamily: cellIndex === 0 ? MONO : FONT,
                  fontSize: 7.6,
                  color: cell === "£440?" ? "#A86B16" : "#33404F",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                }}
              >
                {cell}
              </div>
            )),
          )}
        </div>
        <div
          style={{
            marginTop: 10,
            borderRadius: 3,
            background: "#FFF4DE",
            border: "1px solid #E8C98E",
            padding: "6px 8px",
            fontFamily: MONO,
            fontSize: 7,
            letterSpacing: "0.04em",
            color: "#A86B16",
          }}
        >
          ! 2 QUOTES UNCONFIRMED · LAST EDIT 11:48
        </div>
      </div>
    </div>
  );
};

const PhoneCard: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, #0D1622 0%, #080D15 100%)",
      borderRadius: 8,
      border: "1px solid rgba(245,248,252,0.12)",
      boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
      overflow: "hidden",
      padding: "16px 18px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #31527A, #16283E)",
          display: "grid",
          placeItems: "center",
          fontFamily: FONT,
          fontSize: 7.5,
          fontWeight: 700,
          color: C.white,
        }}
      >
        DM
      </span>
      <div>
        <div style={{ fontFamily: FONT, fontSize: 10, fontWeight: 600, color: C.white }}>Dave · Manchester Auto</div>
        <div style={{ fontFamily: MONO, fontSize: 6.6, letterSpacing: "0.1em", color: C.muted }}>SMS · TODAY</div>
      </div>
    </div>
    <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
      <div style={{ alignSelf: "flex-start", maxWidth: "82%", borderRadius: "9px 9px 9px 3px", background: "rgba(255,255,255,0.075)", padding: "7px 9px" }}>
        <div style={{ fontFamily: FONT, fontSize: 8.6, lineHeight: 1.4, color: C.silver }}>Any update on the Golf?</div>
        <div style={{ marginTop: 3, fontFamily: MONO, fontSize: 5.8, color: C.dim }}>09:41</div>
      </div>
      <div style={{ alignSelf: "flex-end", maxWidth: "82%", borderRadius: "9px 9px 3px 9px", background: "rgba(46,123,255,0.24)", padding: "7px 9px" }}>
        <div style={{ fontFamily: FONT, fontSize: 8.6, lineHeight: 1.4, color: C.white }}>Still waiting on parts.</div>
        <div style={{ marginTop: 3, fontFamily: MONO, fontSize: 5.8, color: "rgba(245,248,252,0.45)" }}>14:12</div>
      </div>
      <div style={{ alignSelf: "flex-start", maxWidth: "82%", borderRadius: "9px 9px 9px 3px", background: "rgba(255,255,255,0.075)", padding: "7px 9px" }}>
        <div style={{ fontFamily: FONT, fontSize: 8.6, lineHeight: 1.4, color: C.silver }}>Can you call me?</div>
        <div style={{ marginTop: 3, fontFamily: MONO, fontSize: 5.8, color: C.dim }}>15:08</div>
      </div>
    </div>
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        bottom: 14,
        borderRadius: 4,
        border: `1px solid ${C.amber}33`,
        background: C.amberSoft,
        padding: "5px 7px",
        fontFamily: MONO,
        fontSize: 6.4,
        letterSpacing: "0.06em",
        color: C.amber,
      }}
    >
      UNREAD · 1 MESSAGE
    </div>
  </div>
);

const ARTIFACTS = [
  { label: "NOTEBOOK", note: "written down, then forgotten", node: <NotebookCard /> },
  { label: "SPREADSHEET", note: "edited by three people", node: <SpreadsheetCard /> },
  { label: "SOMEONE'S PHONE", note: "the only copy of the answer", node: <PhoneCard /> },
];

export const SceneProblem: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const active = t >= BEATS.problem.phone ? 2 : t >= BEATS.problem.spreadsheet ? 1 : t >= BEATS.problem.notebook ? 0 : -1;
  const late = progress(t, BEATS.problem.switchLine, 0.5);
  const ledgerOpacity = 1 - progress(t, BEATS.problem.notebook - 0.35, 0.55) * 0.88;

  const cardW = wide ? 420 : 880;
  const cardH = wide ? 318 : 390;

  return (
    <AbsoluteFill style={{ backgroundColor: C.graphite, fontFamily: FONT }}>
      <Photo src="old-mechanic.jpg" position="50% 38%" brightness={0.32} saturation={0.45} style={{ opacity: 0.42 }} />
      <AbsoluteFill
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(6,10,17,0.97) 0%, rgba(6,10,17,0.9) 42%, rgba(6,10,17,0.62) 100%)"
            : "linear-gradient(180deg, rgba(6,10,17,0.86) 0%, rgba(6,10,17,0.92) 62%, rgba(6,10,17,0.98) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? undefined : 70,
          top: wide ? 82 : 122,
          width: wide ? 720 : undefined,
        }}
      >
        <Kicker start={0.12}>{COPY.problem.kicker}</Kicker>
        <div style={{ marginTop: wide ? 34 : 26, position: "relative" }}>
          <div style={{ opacity: 1 - late }}>
            <MaskLine start={0.25} duration={0.75}>
              <div style={{ fontSize: wide ? 76 : 62, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.white }}>
                {COPY.problem.line1}
              </div>
            </MaskLine>
            <MaskLine start={0.4} duration={0.75}>
              <div style={{ fontSize: wide ? 76 : 62, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.silver }}>
                {COPY.problem.line2}
              </div>
            </MaskLine>
          </div>
          <div style={{ position: "absolute", inset: 0, opacity: late }}>
            <div style={{ fontSize: wide ? 76 : 62, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.white }}>
              {COPY.problem.late1}
            </div>
            <div style={{ fontSize: wide ? 76 : 62, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.amber }}>
              {COPY.problem.late2}
            </div>
          </div>
        </div>
        <div style={{ marginTop: wide ? 24 : 20, maxWidth: wide ? 540 : 900, fontFamily: FONT, fontSize: wide ? 19 : 17, lineHeight: 1.55, color: C.muted, opacity: late }}>
          The workshop is busy. The customer is patient. The information is everywhere.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 950 : 70,
          right: wide ? 108 : 70,
          top: wide ? 266 : 612,
          opacity: ledgerOpacity,
        }}
      >
        <div
          style={{
            borderRadius: 10,
            background: "rgba(9, 15, 24, 0.86)",
            border: `1px solid ${C.line}`,
            backdropFilter: "blur(12px)",
            boxShadow: "0 28px 70px rgba(0,0,0,0.4)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "13px 15px 11px", borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 8.6, letterSpacing: "0.18em", color: C.muted }}>TODAY'S WORKSHOP LEDGER</div>
              <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 17, fontWeight: 700, color: C.white }}>Six jobs. Six places.</div>
            </div>
            <Tag color={C.amber} background={C.amberSoft} border={`${C.amber}44`} style={{ marginLeft: "auto" }}>
              NO SINGLE RECORD
            </Tag>
          </div>
          {LEDGER.map((row, index) => {
            const p = progress(t, BEATS.problem.rows + index * 0.18, 0.45);
            return (
              <div
                key={row.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: wide ? "9px 15px" : "11px 15px",
                  borderBottom: index === LEDGER.length - 1 ? "none" : `1px solid ${C.lineSoft}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 12}px)`,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: row.tone, marginRight: 9 }} />
                <span style={{ fontFamily: FONT, fontSize: wide ? 12 : 12.5, color: C.silver }}>{row.label}</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: wide ? 8.5 : 9, letterSpacing: "0.06em", color: row.tone }}>{row.value}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 950 : 70,
          right: wide ? 108 : 70,
          top: wide ? 260 : 708,
          height: wide ? 500 : 760,
          pointerEvents: "none",
        }}
      >
        {ARTIFACTS.map((artifact, index) => {
          const depth = active - index;
          if (depth < 0 || active < 0) return null;
          const clampedDepth = Math.min(depth, 2);
          const isTop = clampedDepth === 0;
          return (
            <div
              key={artifact.label}
              style={{
                position: "absolute",
                left: 0,
                top: wide ? clampedDepth * 26 : clampedDepth * 30,
                width: cardW,
                height: cardH,
                opacity: isTop ? 1 : 0.5 - clampedDepth * 0.12,
                transform: `scale(${1 - clampedDepth * 0.045})`,
                transformOrigin: "50% 0%",
                zIndex: 10 - clampedDepth,
                transition: "none",
              }}
            >
              <div style={{ position: "relative", width: "100%", height: "100%" }}>{artifact.node}</div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: -26,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  opacity: isTop ? 1 : 0,
                }}
              >
                <span style={{ width: 22, height: 1, background: index === 0 ? C.amber : C.blue }} />
                <span style={{ fontFamily: MONO, fontSize: wide ? 9 : 10, letterSpacing: "0.16em", color: index === 0 ? C.amber : C.blueBright }}>
                  {artifact.label}
                </span>
                <span style={{ fontFamily: FONT, fontSize: wide ? 9 : 10, color: C.muted }}>{artifact.note}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", left: wide ? 108 : 70, bottom: wide ? 46 : 108 }}>
        <Hairline start={0.4} duration={0.8} color={C.lineSoft} style={{ width: wide ? 470 : 300, marginBottom: 12 }} />
        <Mono size={wide ? 9 : 8} color={C.dim} style={{ letterSpacing: "0.14em" }}>
          ILLUSTRATIVE WORKSHOP  ·  FICTIONAL RECORDS
        </Mono>
      </div>

      <Vignette strength={wide ? 0.86 : 0.98} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
