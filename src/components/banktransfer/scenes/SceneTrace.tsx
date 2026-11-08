import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/bankTransfer";
import {
  BankMark,
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
  Tag,
  useTime,
  Vignette,
} from "../kit";

const STEP_LABELS = ["DON'T PAY TWICE", "SAVE THE SESSION ID", "TRACE THE TRANSFER"];

const StepRail: React.FC<{ active: number; wide: boolean }> = ({ active, wide }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: wide ? 10 : 8,
      justifyContent: wide ? "flex-end" : "center",
    }}
  >
    {STEP_LABELS.map((label, index) => {
      const on = index + 1 === active;
      const done = index + 1 < active;
      return (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: wide ? 10 : 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: wide ? "7px 11px" : "7px 10px",
              borderRadius: 4,
              border: `1px solid ${on ? `${C.cyan}66` : C.lineSoft}`,
              background: on ? C.cyanSoft : "rgba(255,255,255,0.02)",
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: done ? C.green : on ? C.cyan : C.dim,
              }}
            >
              0{index + 1}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: wide ? 8.5 : 8.5,
                letterSpacing: "0.09em",
                color: on ? C.white : C.muted,
                whiteSpace: "nowrap",
              }}
            >
              {label}
            </span>
          </div>
          {index < STEP_LABELS.length - 1 ? (
            <span style={{ width: wide ? 22 : 14, height: 1, background: C.line }} />
          ) : null}
        </div>
      );
    })}
  </div>
);

const DuplicateWarning: React.FC<{ wide: boolean; play: number }> = ({ wide, play }) => (
  <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: wide ? 14 : 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: wide ? 42 : 54,
          height: wide ? 42 : 54,
          borderRadius: "50%",
          border: `1px solid ${C.red}55`,
          background: C.redSoft,
          display: "grid",
          placeItems: "center",
          color: C.red,
          fontFamily: FONT,
          fontSize: wide ? 16 : 22,
          fontWeight: 700,
          letterSpacing: "-0.05em",
        }}
      >
        II
      </div>
      <div>
        <div style={{ fontFamily: FONT, fontSize: wide ? 21 : 30, fontWeight: 600, color: C.white, letterSpacing: "-0.02em" }}>
          Don't send it again.
        </div>
        <div style={{ marginTop: 2, fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.13em", color: C.red }}>
          DUPLICATE PAYMENT RISK
        </div>
      </div>
    </div>
    <div
      style={{
        borderRadius: 9,
        border: `1px solid ${C.line}`,
        background: "rgba(255,255,255,0.022)",
        overflow: "hidden",
      }}
    >
      {[0, 1].map((row) => (
        <div
          key={row}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: wide ? "12px 13px" : "18px 18px",
            borderTop: row === 0 ? "none" : `1px dashed ${C.line}`,
            opacity: 0.9 - row * 0.25,
            background: row === 1 ? "rgba(255,98,109,0.045)" : "transparent",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <BankMark bank="sender" size={wide ? 22 : 24} />
            <div>
              <div style={{ fontFamily: FONT, fontSize: wide ? 11 : 15, fontWeight: 500, color: C.white }}>
                {COPY.receiver} · {COPY.receiverBank}
              </div>
              <div style={{ marginTop: 2, fontFamily: MONO, fontSize: wide ? 7.5 : 9, color: C.dim, letterSpacing: "0.08em" }}>
                {COPY.sessionId}
              </div>
            </div>
          </div>
          <div style={{ fontFamily: MONO, fontSize: wide ? 11 : 17, fontWeight: 600, color: row === 1 ? C.red : C.white }}>
            ₦250,000
          </div>
        </div>
      ))}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 8, opacity: play }}>
      <span style={{ width: 20, height: 1, background: C.amber }} />
      <span style={{ fontFamily: MONO, fontSize: wide ? 8.5 : 10, letterSpacing: "0.12em", color: C.amber }}>
        VERIFY FIRST · THEN PAY
      </span>
    </div>
  </div>
);

const SessionCard: React.FC<{ wide: boolean; highlight: number }> = ({ wide, highlight }) => (
  <div
    style={{
      width: "100%",
      borderRadius: 10,
      border: `1px solid ${highlight > 0 ? `${C.cyan}77` : C.line}`,
      background: "linear-gradient(160deg, rgba(14,30,49,0.95), rgba(5,11,19,0.96))",
      boxShadow: highlight > 0 ? `0 0 44px ${C.cyan}18` : "none",
      padding: wide ? "16px 18px" : "28px 28px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BankMark bank="sender" size={wide ? 24 : 32} />
        <span style={{ fontFamily: MONO, fontSize: wide ? 8.5 : 10, letterSpacing: "0.14em", color: C.muted }}>TRANSFER RECEIPT</span>
      </div>
      <Tag color={C.green} background={C.greenSoft} border={`${C.green}44`} style={{ fontSize: 7.5 }}>
        SUCCESSFUL
      </Tag>
    </div>
    <div style={{ marginTop: wide ? 14 : 16, fontFamily: FONT, fontSize: wide ? 30 : 52, fontWeight: 700, letterSpacing: "-0.04em", color: C.white }}>
      ₦250,000<span style={{ fontSize: wide ? 15 : 24, color: C.silver }}>.00</span>
    </div>
    <div style={{ marginTop: 4, fontFamily: MONO, fontSize: wide ? 8 : 10, letterSpacing: "0.1em", color: C.dim }}>
      TO {COPY.receiver} · {COPY.receiverBank}
    </div>
    <div
      style={{
        marginTop: wide ? 14 : 16,
        borderRadius: 7,
        border: `1px solid ${C.cyan}66`,
        background: C.cyanSoft,
        padding: wide ? "9px 10px" : "16px 18px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: MONO, fontSize: wide ? 7.5 : 9.5, letterSpacing: "0.15em", color: C.cyan }}>SESSION ID / REFERENCE</span>
        <span style={{ fontFamily: MONO, fontSize: wide ? 7 : 8.5, letterSpacing: "0.1em", color: C.dim }}>SAVE THIS</span>
      </div>
      <div style={{ marginTop: 5, fontFamily: MONO, fontSize: wide ? 12 : 20, fontWeight: 600, letterSpacing: "0.035em", color: C.white }}>
        {COPY.sessionId}
      </div>
    </div>
    <div style={{ marginTop: wide ? 10 : 16, fontFamily: FONT, fontSize: wide ? 9 : 12, color: C.muted }}>
      Keep the receipt. The reference is how the transaction gets traced.
    </div>
  </div>
);

const UssdScreen: React.FC<{ scale: number; typed: number }> = ({ scale, typed }) => {
  const code = "*565*5#";
  const shown = code.slice(0, Math.floor(typed * code.length));
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #0A1523 0%, #05090F 100%)" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: `${scale * 18}px ${scale * 20}px 0`,
          fontFamily: FONT,
          fontSize: scale * 9,
          fontWeight: 600,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        <span>9:41</span>
        <span style={{ fontFamily: MONO, fontSize: scale * 8, color: C.muted }}>NIBSS NIP</span>
      </div>
      <div style={{ padding: `${scale * 24}px ${scale * 18}px 0` }}>
        <div style={{ fontFamily: MONO, fontSize: scale * 7.6, letterSpacing: "0.18em", color: C.muted }}>PHONE</div>
        <div style={{ marginTop: scale * 6, fontFamily: FONT, fontSize: scale * 15, fontWeight: 600, color: C.white }}>Enter USSD code</div>
        <div
          style={{
            marginTop: scale * 16,
            height: scale * 46,
            borderRadius: scale * 9,
            border: `1px solid ${C.cyan}66`,
            background: C.cyanSoft,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${scale * 12}px`,
          }}
        >
          <span style={{ fontFamily: MONO, fontSize: scale * 17, fontWeight: 600, color: C.white, letterSpacing: "0.08em" }}>
            {shown}
            <span style={{ color: C.cyan }}>{shown.length < code.length ? "|" : ""}</span>
          </span>
          <span style={{ fontFamily: MONO, fontSize: scale * 7, color: C.cyan }}>CALL</span>
        </div>
        <div style={{ marginTop: scale * 9, fontFamily: FONT, fontSize: scale * 8, lineHeight: 1.4, color: C.silver }}>
          NIBSS NIP transaction tracker. Eligible transfers only.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: scale * 22,
          right: scale * 22,
          bottom: scale * 22,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: scale * 8,
        }}
      >
        {keys.map((key) => (
          <div
            key={key}
            style={{
              height: scale * 31,
              borderRadius: scale * 7,
              background: "rgba(255,255,255,0.045)",
              border: `1px solid ${C.lineSoft}`,
              display: "grid",
              placeItems: "center",
              fontFamily: FONT,
              fontSize: scale * 12,
              fontWeight: 500,
              color: C.white,
            }}
          >
            {key}
          </div>
        ))}
      </div>
    </div>
  );
};

const OutcomeCard: React.FC<{
  kind: "success" | "fail";
  wide: boolean;
  start: number;
}> = ({ kind, wide, start }) => {
  const success = kind === "success";
  const color = success ? C.green : C.amber;
  return (
    <Reveal start={start} duration={0.65} y={22} style={{ flex: 1 }}>
      <div
        style={{
          borderRadius: 10,
          border: `1px solid ${color}55`,
          background: `linear-gradient(160deg, ${color}12, rgba(7,14,24,0.94))`,
          padding: wide ? "15px 17px" : "18px 18px",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, boxShadow: `0 0 9px ${color}` }} />
          <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.12em", color }}>
            {success ? "IF CONFIRMED SUCCESSFUL" : "IF UNSUCCESSFUL"}
          </span>
        </div>
        <div style={{ fontFamily: FONT, fontSize: wide ? 17 : 18, fontWeight: 600, lineHeight: 1.25, color: C.white }}>
          {success ? "The receiver asks their bank to trace the credit." : "The sender contacts their bank about the reversal."}
        </div>
        <div style={{ marginTop: "auto", fontFamily: MONO, fontSize: 8, letterSpacing: "0.1em", color: C.muted }}>
          {success ? "RECEIVER → RECEIVING BANK" : "SENDER → SENDING BANK"}
        </div>
      </div>
    </Reveal>
  );
};

export const SceneTrace: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 96 : 64;
  const showStep1 = t < BEATS.trace.step2;
  const showStep2 = t >= BEATS.trace.step2 && t < BEATS.trace.step3;
  const showStep3 = t >= BEATS.trace.step3;
  const showOutcomes = t >= BEATS.trace.outcome;
  const stepOut = progress(t, BEATS.trace.outcome - 0.25, 0.35);
  const active = t < BEATS.trace.step2 ? 1 : t < BEATS.trace.step3 ? 2 : 3;
  const typed = progress(t, BEATS.trace.ussd + 0.2, 1.5);
  const disclaimerIn = progress(t, BEATS.trace.disclaimer, 0.7);

  const stepContent = (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div style={{ position: "absolute", inset: 0, opacity: showStep1 ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            width: "100%",
            borderRadius: 14,
            border: `1px solid ${C.red}33`,
            background: "linear-gradient(160deg, rgba(24,15,22,0.82), rgba(7,12,20,0.9))",
            padding: wide ? "22px 24px" : "34px 32px",
          }}
        >
          <DuplicateWarning wide={wide} play={progress(t, BEATS.trace.step1 + 0.8, 0.6)} />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: showStep2 ? 1 : 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <SessionCard wide={wide} highlight={showStep2 ? 1 : 0} />
      </div>

      <div style={{ position: "absolute", inset: 0, opacity: showStep3 && !showOutcomes ? 1 : 0, transform: `scale(${1 - stepOut * 0.06})` }}>
        <div
          style={{
            height: "100%",
            padding: wide ? "16px" : "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: wide ? 18 : 22,
          }}
        >
          <PhoneFrame width={wide ? 206 : 330} glow={C.cyan}>
            <UssdScreen scale={(wide ? 206 : 330) / 390} typed={typed} />
          </PhoneFrame>
          {wide ? (
            <div style={{ width: 250 }}>
              <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.15em", color: C.cyan }}>USSD TRACKER</div>
              <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 19, fontWeight: 600, color: C.white, letterSpacing: "-0.02em" }}>
                Dial the NIP tracker.
              </div>
              <div style={{ marginTop: 9, fontFamily: FONT, fontSize: 11, lineHeight: 1.5, color: C.silver }}>
                Enter the session ID if prompted, then follow the transaction status.
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: wide ? 0 : 60,
          height: wide ? "100%" : 560,
          opacity: showOutcomes ? 1 : 0,
          display: "flex",
          flexDirection: wide ? "row" : "column",
          gap: wide ? 16 : 14,
          transform: `translateY(${(1 - progress(t, BEATS.trace.outcome, 0.6)) * 18}px)`,
        }}
      >
        <OutcomeCard kind="success" wide={wide} start={BEATS.trace.outcome} />
        <OutcomeCard kind="fail" wide={wide} start={BEATS.trace.outcome + 0.5} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="30%" y="40%" size={64} color={C.cyan} opacity={0.08} />
      <Glow x="76%" y="66%" size={52} color={C.amber} opacity={0.05} />
      <GridField opacity={0.3} size={wide ? 92 : 72} />
      <Scanlines opacity={0.03} />

      <div style={{ position: "absolute", left: margin, right: margin, top: wide ? 54 : 108 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div>
            <Kicker start={0.05} color={C.silver} rule={C.green}>
              HOW TO TRACE YOUR MONEY
            </Kicker>
            <div style={{ marginTop: 13 }}>
              <MaskLine start={0.12} duration={0.8}>
                <div style={{ fontFamily: FONT, fontSize: wide ? 46 : 48, fontWeight: 700, letterSpacing: "-0.045em", lineHeight: 0.98, color: C.white }}>
                  THREE STEPS.
                  <span style={{ color: C.cyan }}> NO GUESSWORK.</span>
                </div>
              </MaskLine>
            </div>
          </div>
          {wide ? <StepRail active={active} wide={wide} /> : null}
        </div>
      </div>

      {!wide ? (
        <div style={{ position: "absolute", left: margin, right: margin, top: 288 }}>
          <StepRail active={active} wide={wide} />
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          top: wide ? 262 : 392,
          height: wide ? undefined : 840,
          bottom: wide ? 330 : undefined,
          display: wide ? "grid" : "block",
          gridTemplateColumns: wide ? "repeat(3, 1fr)" : undefined,
          gap: wide ? 22 : 0,
          opacity: progress(t, 0.3, 0.7),
        }}
      >
        {wide ? (
          <>
            <div style={{ opacity: 1, filter: active === 1 ? "none" : "brightness(0.62)" }}>
              <div style={{ height: "100%", borderRadius: 12, border: `1px solid ${active === 1 ? `${C.red}44` : C.line}`, background: "linear-gradient(160deg, rgba(24,15,22,0.82), rgba(7,12,20,0.9))", padding: "20px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <DuplicateWarning wide={wide} play={1} />
              </div>
            </div>
            <div style={{ opacity: 1, filter: active === 2 ? "none" : "brightness(0.62)" }}>
              <div style={{ height: "100%", borderRadius: 12, border: `1px solid ${active === 2 ? `${C.cyan}44` : C.line}`, background: "linear-gradient(160deg, rgba(10,23,38,0.86), rgba(6,11,19,0.94))", padding: "20px 20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <SessionCard wide={wide} highlight={active === 2 ? 1 : 0} />
              </div>
            </div>
            <div style={{ opacity: 1, filter: active === 3 ? "none" : "brightness(0.62)" }}>
              <div style={{ height: "100%", borderRadius: 12, border: `1px solid ${active === 3 ? `${C.cyan}44` : C.line}`, background: "linear-gradient(160deg, rgba(10,23,38,0.82), rgba(6,11,19,0.94))", padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
                <PhoneFrame width={196} glow={C.cyan}>
                  <UssdScreen scale={196 / 390} typed={typed} />
                </PhoneFrame>
                <div style={{ width: 210 }}>
                  <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.14em", color: C.cyan }}>USSD TRACKER</div>
                  <div style={{ marginTop: 7, fontFamily: FONT, fontSize: 17, fontWeight: 600, lineHeight: 1.2, color: C.white }}>
                    Dial {COPY.ussd}
                  </div>
                  <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 10.5, lineHeight: 1.5, color: C.silver }}>
                    NIBSS NIP transaction tracker for eligible transfers.
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          stepContent
        )}
      </div>

      {wide ? (
        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 790,
            height: 146,
            display: "flex",
            gap: 18,
            opacity: progress(t, BEATS.trace.outcome - 0.1, 0.6),
          }}
        >
          <OutcomeCard kind="success" wide={wide} start={BEATS.trace.outcome} />
          <OutcomeCard kind="fail" wide={wide} start={BEATS.trace.outcome + 0.5} />
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: wide ? 1100 : margin,
          right: margin,
          top: wide ? 218 : undefined,
          bottom: wide ? undefined : 246,
          textAlign: wide ? "right" : "center",
          opacity: disclaimerIn,
        }}
      >
        <Mono size={wide ? 8.5 : 8.5} color={C.dim} style={{ letterSpacing: "0.1em", lineHeight: 1.6 }}>
          NIP TRACKER: ELIGIBLE TRANSFERS ONLY · WITHIN 48 HOURS · NOT EVERY TRANSFER TYPE
        </Mono>
      </div>

      <Vignette strength={0.9} />
      <Grain />
    </AbsoluteFill>
  );
};
