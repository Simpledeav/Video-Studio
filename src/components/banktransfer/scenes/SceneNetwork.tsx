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
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { NetworkField } from "../Network";

export const SceneNetwork: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 110 : 64;
  const phoneFade = 1 - progress(t, BEATS.network.institutions + 0.2, 0.8);
  const networkIn = progress(t, BEATS.network.network, 1.1);
  const titleIn = progress(t, BEATS.network.institutions, 0.9);
  const labelIn = progress(t, BEATS.network.label, 0.7);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="52%" y="44%" size={72} color={C.cyan} opacity={0.11} />
      <GridField opacity={0.4} size={wide ? 88 : 70} />
      <Scanlines opacity={0.035} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${C.cyan}88, transparent)` }} />

      {wide ? (
        <>
          <div style={{ position: "absolute", left: margin, top: 116, width: 470 }}>
            <Kicker start={0.05}>THE THING MOST PEOPLE DON'T SEE</Kicker>
            <div style={{ marginTop: 26 }}>
              <MaskLine start={0.15} duration={0.85}>
                <div style={{ fontFamily: FONT, fontSize: 76, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.96, color: C.white }}>
                  THE
                  <br />
                  INVISIBLE
                  <br />
                  <span style={{ color: C.cyan }}>PAYMENT</span>
                  <br />
                  NETWORK
                </div>
              </MaskLine>
            </div>
            <Reveal start={1.4} y={16}>
              <div style={{ marginTop: 28, maxWidth: 420, fontFamily: FONT, fontSize: 18, lineHeight: 1.55, color: C.silver }}>
                A success screen is a local message from your bank. Behind it, institutions are exchanging transaction instructions.
              </div>
            </Reveal>
            <Reveal start={2.1} y={12}>
              <div style={{ marginTop: 26, display: "flex", gap: 9, flexWrap: "wrap" }}>
                <Tag color={C.cyan} background={C.cyanSoft}>NIBSS INSTANT PAYMENT · NIP</Tag>
                <Tag color={C.silver} background="rgba(255,255,255,0.04)" border={C.line}>INTERBANK</Tag>
              </div>
            </Reveal>
          </div>

          <div style={{ position: "absolute", left: 600, top: 220, width: 1210, opacity: networkIn }}>
            <NetworkField width={1210} scale={1.35} reveal={networkIn} pulse={Math.sin(t * 2.2) * 0.5 + 0.5} />
          </div>

          <div style={{ position: "absolute", left: margin, bottom: 92, display: "flex", alignItems: "center", gap: 14, opacity: labelIn }}>
            <span style={{ width: 36, height: 1, background: C.cyan }} />
            <Mono size={12} color={C.silver}>BANKS EXCHANGE MESSAGES · NOT BANKNOTES</Mono>
          </div>

          <div style={{ position: "absolute", left: 150, top: 486, opacity: phoneFade * 0.9, transform: `scale(${0.92})` }}>
            <PhoneFrame width={270} glow={C.cyan}>
              <ReceiptScreen scale={270 / 390} success={1} />
            </PhoneFrame>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: margin, right: margin, top: 118 }}>
            <Kicker start={0.05}>THE THING MOST PEOPLE DON'T SEE</Kicker>
            <div style={{ marginTop: 18 }}>
              <MaskLine start={0.15} duration={0.85}>
                <div style={{ fontFamily: FONT, fontSize: 60, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 0.96, color: C.white }}>
                  THE INVISIBLE
                  <br />
                  <span style={{ color: C.cyan }}>PAYMENT</span> NETWORK
                </div>
              </MaskLine>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 338,
              display: "flex",
              justifyContent: "center",
              opacity: phoneFade,
              transform: `translateY(${-progress(t, BEATS.network.institutions, 0.8) * 30}px) scale(${1 - progress(t, BEATS.network.institutions, 0.8) * 0.08})`,
            }}
          >
            <PhoneFrame width={300} glow={C.cyan}>
              <ReceiptScreen scale={300 / 390} success={1} />
            </PhoneFrame>
          </div>

          <div style={{ position: "absolute", left: 52, right: 52, top: 592, opacity: networkIn }}>
            <NetworkField width={976} scale={1.5} reveal={networkIn} pulse={Math.sin(t * 2.2) * 0.5 + 0.5} />
          </div>

          <div style={{ position: "absolute", left: margin, right: margin, top: 1290, opacity: titleIn, transform: `translateY(${(1 - titleIn) * 16}px)` }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Tag color={C.cyan} background={C.cyanSoft} border={`${C.cyan}44`} style={{ fontSize: 11 }}>
                NIBSS INSTANT PAYMENT · NIP
              </Tag>
            </div>
            <div style={{ marginTop: 22, textAlign: "center", fontFamily: FONT, fontSize: 25, lineHeight: 1.5, color: C.silver }}>
              Your bank sends an instruction. The receiving bank must confirm the credit.
            </div>
            <div
              style={{
                marginTop: 18,
                textAlign: "center",
                fontFamily: MONO,
                fontSize: 10,
                letterSpacing: "0.2em",
                color: C.dim,
              }}
            >
              MESSAGES TRAVEL · CASH DOES NOT
            </div>
          </div>
        </>
      )}

      <Vignette strength={0.9} />
      <Grain />
    </AbsoluteFill>
  );
};
