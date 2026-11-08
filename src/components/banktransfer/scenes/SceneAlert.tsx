import { AbsoluteFill } from "remotion";
import { BEATS, C, FONT, MONO } from "../../../config/bankTransfer";
import {
  BankHistoryScreen,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  NoSmsScreen,
  PhoneFrame,
  progress,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";

const Equation: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, BEATS.alert.equation, 0.8);
  return (
    <div
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
        display: "flex",
        flexDirection: wide ? "column" : "row",
        alignItems: wide ? "flex-start" : "center",
        justifyContent: "center",
        gap: wide ? 6 : 18,
        flexWrap: "wrap",
      }}
    >
      <div style={{ fontFamily: FONT, fontSize: wide ? 62 : 58, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.95, color: C.amber }}>
        NO ALERT
      </div>
      <div style={{ fontFamily: FONT, fontSize: wide ? 58 : 54, fontWeight: 500, color: C.white, lineHeight: 0.95 }}>≠</div>
      <div style={{ fontFamily: FONT, fontSize: wide ? 62 : 58, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.95, color: C.green }}>
        NO CREDIT
      </div>
    </div>
  );
};

export const SceneAlert: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 110 : 64;
  const phoneIn = progress(t, BEATS.alert.noSms, 0.8);
  const reveal = progress(t, BEATS.alert.history, 1.1);
  const subIn = progress(t, BEATS.alert.equation + 0.7, 0.8);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="24%" y="42%" size={60} color={C.amber} opacity={0.06} />
      <Glow x="78%" y="52%" size={64} color={C.green} opacity={0.07} />
      <GridField opacity={0.28} size={wide ? 96 : 74} />
      <Scanlines opacity={0.03} />

      <div style={{ position: "absolute", left: margin, top: wide ? 74 : 112, width: wide ? 600 : undefined, right: wide ? undefined : margin }}>
        <Kicker start={0.05} color={C.silver} rule={C.amber}>
          THE OTHER TWIST
        </Kicker>
        <div style={{ marginTop: 15 }}>
          <MaskLine start={0.12} duration={0.8}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 54 : 50,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.98,
                color: C.white,
              }}
            >
              THE MONEY ARRIVED.
              <br />
              <span style={{ color: C.amber }}>THE SMS DIDN'T.</span>
            </div>
          </MaskLine>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 744 : 0,
          right: wide ? 74 : 0,
          top: wide ? 176 : 360,
          display: "flex",
          justifyContent: "center",
          gap: wide ? 26 : 26,
        }}
      >
        <Reveal start={BEATS.alert.noSms} duration={0.75} y={70} style={{ opacity: 0.55 + phoneIn * 0.45 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.amber }} />
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: C.amber }}>SMS INBOX</span>
            </div>
            <PhoneFrame width={wide ? 288 : 320} glow={C.amber}>
              <NoSmsScreen scale={(wide ? 288 : 320) / 390} pulse={0.35 + Math.sin(t * 2.4) * 0.2} />
            </PhoneFrame>
            <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color: C.muted }}>NO CREDIT ALERT</div>
          </div>
        </Reveal>

        <Reveal start={BEATS.alert.app} duration={0.75} y={70}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 13 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: C.green }}>BANKING APP</span>
            </div>
            <PhoneFrame width={wide ? 288 : 320} glow={C.green}>
              <BankHistoryScreen scale={(wide ? 288 : 320) / 390} reveal={reveal} />
            </PhoneFrame>
            <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color: reveal > 0.6 ? C.green : C.muted }}>
              CREDIT CONFIRMED IN HISTORY
            </div>
          </div>
        </Reveal>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? margin : 0,
          right: wide ? undefined : 0,
          top: wide ? 706 : 1156,
          width: wide ? 570 : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: wide ? "flex-start" : "center",
          gap: 18,
        }}
      >
        <Tag color={C.white} background="rgba(255,255,255,0.05)" border={C.line} style={{ fontSize: 10 }}>
          A MISSING ALERT IS NOT PROOF
        </Tag>
        <Equation wide={wide} />
        <div
          style={{
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 12}px)`,
            textAlign: wide ? "left" : "center",
            fontFamily: FONT,
            fontSize: wide ? 18 : 21,
            lineHeight: 1.45,
            color: C.silver,
            maxWidth: 470,
          }}
        >
          Check the account balance and the transaction history before you conclude the money is missing.
        </div>
      </div>

      <Vignette strength={0.85} />
      <Grain />
    </AbsoluteFill>
  );
};
