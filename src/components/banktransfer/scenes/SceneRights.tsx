import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/bankTransfer";
import {
  ComplaintScreen,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  PhoneFrame,
  progress,
  Reveal,
  Scanlines,
  useTime,
  Vignette,
} from "../kit";

const EscalationPath: React.FC<{ wide: boolean; start: number }> = ({ wide, start }) => {
  const { t } = useTime();
  const steps = [
    { title: "YOU", detail: "CUSTOMER" },
    { title: "YOUR BANK", detail: "COMPLAINT · TWO-WEEK WINDOW" },
    { title: "CBN CPD", detail: "ESCALATION" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", gap: 0 }}>
      {steps.map((step, index) => {
        const p = progress(t, start + index * 0.45, 0.55);
        return (
          <div key={step.title} style={{ display: "flex", alignItems: "center", flex: index < 2 ? 1 : 0 }}>
            <div style={{ opacity: p, transform: `translateY(${(1 - p) * 10}px)`, minWidth: wide ? 190 : 188 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  style={{
                    width: wide ? 20 : 18,
                    height: wide ? 20 : 18,
                    borderRadius: "50%",
                    border: `1px solid ${index === 2 ? C.green : C.cyan}66`,
                    background: index === 2 ? C.greenSoft : C.cyanSoft,
                    display: "grid",
                    placeItems: "center",
                    fontFamily: MONO,
                    fontSize: 8,
                    color: index === 2 ? C.green : C.cyan,
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ fontFamily: FONT, fontSize: wide ? 15 : 14, fontWeight: 600, color: C.white }}>{step.title}</span>
              </div>
              <div style={{ marginTop: 4, marginLeft: wide ? 28 : 26, fontFamily: MONO, fontSize: wide ? 7.5 : 7, letterSpacing: "0.08em", color: C.muted }}>
                {step.detail}
              </div>
            </div>
            {index < 2 ? (
              <div style={{ flex: 1, height: 1, margin: `0 ${wide ? 10 : 8}px`, background: `linear-gradient(90deg, ${C.cyan}55, ${C.line})`, opacity: p }} />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const SceneRights: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 108 : 64;
  const phoneIn = progress(t, 0.1, 0.75);
  const cbnIn = progress(t, BEATS.rights.cbn, 0.9);
  const ticketIn = progress(t, BEATS.rights.ticket, 0.7);
  const pathIn = progress(t, BEATS.rights.path, 0.7);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="24%" y="36%" size={58} color={C.cyan} opacity={0.07} />
      <Glow x="76%" y="58%" size={62} color={C.green} opacity={0.06} />
      <GridField opacity={0.28} size={wide ? 96 : 74} />
      <Scanlines opacity={0.03} />

      <div style={{ position: "absolute", left: margin, top: wide ? 62 : 108, width: wide ? 690 : undefined, right: wide ? undefined : margin }}>
        <Kicker start={0.05} color={C.silver} rule={C.green}>
          YOU HAVE RIGHTS AS A CUSTOMER
        </Kicker>
        <div style={{ marginTop: 14 }}>
          <MaskLine start={0.12} duration={0.8}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 58 : 52,
                fontWeight: 700,
                letterSpacing: "-0.05em",
                lineHeight: 0.96,
                color: C.white,
              }}
            >
              COMPLAIN TO YOUR
              <br />
              <span style={{ color: C.green }}>BANK FIRST.</span>
            </div>
          </MaskLine>
        </div>
        {wide ? (
          <Reveal start={0.55} y={12}>
            <div style={{ marginTop: 18, maxWidth: 520, fontFamily: FONT, fontSize: 17, lineHeight: 1.55, color: C.silver }}>
              If the bank does not resolve it, escalate. The CBN Consumer Protection Department is the next step after the applicable two-week period.
            </div>
          </Reveal>
        ) : null}
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 742 : 0,
          right: wide ? undefined : 0,
          top: wide ? 150 : 344,
          display: "flex",
          justifyContent: "center",
          opacity: phoneIn,
          transform: `translateY(${(1 - phoneIn) * 50}px)`,
        }}
      >
        <PhoneFrame width={wide ? 292 : 316} glow={C.cyan}>
          <ComplaintScreen scale={(wide ? 292 : 316) / 390} submitted={ticketIn} />
        </PhoneFrame>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 1112 : margin,
          right: wide ? 96 : margin,
          top: wide ? 152 : 1050,
          opacity: cbnIn,
          transform: `translateY(${(1 - cbnIn) * 24}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 12,
            border: `1px solid ${C.green}33`,
            background: "linear-gradient(160deg, rgba(10,26,30,0.86), rgba(5,12,18,0.95))",
            boxShadow: `0 24px 70px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)`,
            padding: wide ? "22px 24px" : "24px 26px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: wide ? 54 : 58,
                height: wide ? 54 : 58,
                borderRadius: "50%",
                border: `1px solid ${C.green}66`,
                background: "radial-gradient(circle at 40% 30%, rgba(75,227,162,0.18), rgba(5,20,18,0.9))",
                display: "grid",
                placeItems: "center",
                fontFamily: FONT,
                fontSize: wide ? 14 : 15,
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: C.green,
              }}
            >
              CBN
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: wide ? 8 : 8.5, letterSpacing: "0.16em", color: C.green }}>
                CENTRAL BANK OF NIGERIA
              </div>
              <div style={{ marginTop: 4, fontFamily: FONT, fontSize: wide ? 23 : 24, fontWeight: 600, letterSpacing: "-0.025em", color: C.white }}>
                Consumer Protection
              </div>
              <div style={{ marginTop: 2, fontFamily: MONO, fontSize: wide ? 8 : 8.5, letterSpacing: "0.11em", color: C.muted }}>
                ESCALATION DEPARTMENT
              </div>
            </div>
          </div>

          <div style={{ marginTop: 18, height: 1, background: C.line }} />

          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: wide ? 9 : 11 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <Mono size={wide ? 8.5 : 9} color={C.muted}>COMPLAINT TICKET</Mono>
              <Mono size={wide ? 8.5 : 9} color={ticketIn > 0.6 ? C.white : C.dim}>CMP-2026-0417</Mono>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <Mono size={wide ? 8.5 : 9} color={C.muted}>BANK RESPONSE WINDOW</Mono>
              <Mono size={wide ? 8.5 : 9} color={C.white}>14 DAYS</Mono>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <Mono size={wide ? 8.5 : 9} color={C.muted}>ESCALATION CONTACT</Mono>
              <Mono size={wide ? 8.5 : 9} color={C.green}>{COPY.cbnEmail}</Mono>
            </div>
          </div>

          <div
            style={{
              marginTop: 18,
              borderRadius: 8,
              border: `1px solid ${C.cyan}22`,
              background: C.cyanGhost,
              padding: wide ? "10px 12px" : "12px 14px",
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: wide ? 11 : 12, lineHeight: 1.5, color: C.silver }}>
              Escalate only after the applicable two-week period, and keep your ticket number and transaction reference.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          bottom: wide ? 126 : 262,
          opacity: pathIn,
        }}
      >
        <div style={{ marginBottom: wide ? 12 : 14 }}>
          <Mono size={8.5} color={C.dim} style={{ letterSpacing: "0.16em" }}>ESCALATION PATH</Mono>
        </div>
        <EscalationPath wide={wide} start={BEATS.rights.path} />
      </div>

      <Vignette strength={0.9} />
      <Grain />
    </AbsoluteFill>
  );
};
