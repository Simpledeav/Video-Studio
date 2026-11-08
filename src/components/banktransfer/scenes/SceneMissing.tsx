import { AbsoluteFill } from "remotion";
import { BEATS, C, FONT, MONO } from "../../../config/bankTransfer";
import {
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  PhoneFrame,
  progress,
  ReceiptScreen,
  ReceiverHomeScreen,
  Reveal,
  Scanlines,
  seeded,
  Tag,
  useTime,
  Vignette,
} from "../kit";

const AmountLockup: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const appear = progress(t, BEATS.missing.amount, 0.55);
  const glitchIn = progress(t, BEATS.missing.glitch, 0.32, (x) => x);
  const gone = t > BEATS.missing.glitch + 0.55;
  const jitter = t >= BEATS.missing.glitch && t < BEATS.missing.glitch + 0.55 ? (seeded(Math.floor(t * 60)) - 0.5) * 18 : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: appear * (gone ? 0 : 1),
        transform: `translateX(${jitter}px) scale(${1 - glitchIn * 0.04})`,
        filter: gone ? "blur(8px)" : "none",
      }}
    >
      <div
        style={{
          fontFamily: FONT,
          fontSize: wide ? 132 : 112,
          fontWeight: 700,
          letterSpacing: "-0.055em",
          lineHeight: 0.9,
          color: C.white,
          textShadow:
            t >= BEATS.missing.glitch
              ? `${jitter * 0.7}px 0 ${C.red}66, ${-jitter * 0.7}px 0 ${C.cyan}66`
              : `0 0 60px ${C.cyan}22`,
        }}
      >
        ₦250,000
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: wide ? 18 : 15 }}>
        <Tag color={C.green} background={C.greenSoft} border={`${C.green}44`} style={{ fontSize: wide ? 12 : 11 }}>
          SENT
        </Tag>
        <Tag color={C.red} background={C.redSoft} border={`${C.red}44`} style={{ fontSize: wide ? 12 : 11 }}>
          NOT RECEIVED?
        </Tag>
      </div>
    </div>
  );
};

const SenderPhone: React.FC<{ width: number; t: number; fade: number }> = ({ width, t, fade }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 10px ${C.cyan}` }} />
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", color: C.cyan }}>SENDER</span>
    </div>
    <PhoneFrame width={width} glow={C.cyan} style={{ opacity: 1 - fade }}>
      <ReceiptScreen scale={width / 390} success={progress(t, BEATS.missing.success, 0.65)} />
    </PhoneFrame>
  </div>
);

const ReceiverPhone: React.FC<{ width: number; t: number }> = ({ width, t }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber, boxShadow: `0 0 10px ${C.amber}` }} />
      <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", color: C.amber }}>RECEIVER</span>
    </div>
    <div style={{ position: "relative" }}>
      <PhoneFrame width={width} glow={C.amber}>
        <ReceiverHomeScreen scale={width / 390} emptyPulse={0.4 + Math.sin(t * 3) * 0.25} />
      </PhoneFrame>
      <div
        style={{
          position: "absolute",
          top: width * 0.42,
          left: -width * 0.13,
          padding: "7px 11px",
          borderRadius: 4,
          border: `1px solid ${C.amber}55`,
          background: "rgba(8,15,24,0.92)",
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.12em",
          color: C.amber,
          opacity: progress(t, BEATS.missing.secondPhone + 0.4, 0.4),
          whiteSpace: "nowrap",
        }}
      >
        NO CREDIT
      </div>
    </div>
  </div>
);

export const SceneMissing: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 110 : 64;
  const phoneW = wide ? 316 : 370;
  const phoneTop = wide ? 208 : 392;
  const questionIn = progress(t, BEATS.missing.question, 0.7);
  const senderOut = progress(t, BEATS.missing.glitch, 0.55) * 0.25;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Glow x="20%" y="44%" size={72} color={C.cyan} opacity={0.09} />
      <Glow x="82%" y="50%" size={60} color={C.amber} opacity={0.07} />
      <GridField opacity={0.32} size={wide ? 96 : 74} />
      <Scanlines opacity={0.04} />

      <div style={{ position: "absolute", left: margin, top: wide ? 64 : 118, right: margin }}>
        <Kicker start={0.1}>NIGERIA · INTERBANK TRANSFER</Kicker>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "flex-end",
            gap: 20,
            justifyContent: "space-between",
          }}
        >
          <MaskLine start={0.2} duration={0.8}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 52 : 50,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.02,
                color: C.white,
              }}
            >
              The money left.
              <br />
              <span style={{ color: C.silver }}>It never arrived.</span>
            </div>
          </MaskLine>
          {wide ? (
            <Mono size={11} color={C.dim} style={{ paddingBottom: 8, textAlign: "right" }}>
              A FICTIONAL TRANSACTION
              <br />
              BETWEEN TWO NIGERIAN BANKS
            </Mono>
          ) : null}
        </div>
      </div>

      {wide ? (
        <>
          <Reveal start={BEATS.missing.phoneIn} duration={0.9} y={60} style={{ position: "absolute", left: 138, top: 304 }}>
            <SenderPhone width={292} t={t} fade={senderOut} />
          </Reveal>
          <Reveal start={BEATS.missing.secondPhone} duration={0.8} y={70} style={{ position: "absolute", right: 138, top: 304 }}>
            <ReceiverPhone width={292} t={t} />
          </Reveal>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: phoneTop,
            display: "flex",
            justifyContent: "center",
            gap: 34,
          }}
        >
          <Reveal start={BEATS.missing.phoneIn} duration={0.9} y={100}>
            <SenderPhone width={phoneW} t={t} fade={senderOut} />
          </Reveal>
          <Reveal start={BEATS.missing.secondPhone} duration={0.8} y={120}>
            <ReceiverPhone width={phoneW} t={t} />
          </Reveal>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: wide ? 352 : 1188,
          display: "flex",
          justifyContent: "center",
          opacity: 1,
        }}
      >
        <AmountLockup wide={wide} />
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          top: wide ? 634 : 1440,
          textAlign: "center",
          opacity: questionIn,
          transform: `translateY(${(1 - questionIn) * 18}px)`,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: wide ? 12 : 11, letterSpacing: "0.24em", color: C.cyan }}>
          ONE DEBIT · TWO DIFFERENT REALITIES
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: FONT,
            fontSize: wide ? 58 : 56,
            fontWeight: 700,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            color: C.white,
          }}
        >
          WHERE DID
          <br />
          <span style={{ color: C.red }}>THE MONEY GO?</span>
        </div>
      </div>

      <Vignette strength={wide ? 0.8 : 1} />
      <Grain />
    </AbsoluteFill>
  );
};
