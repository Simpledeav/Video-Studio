import { AbsoluteFill } from "remotion";
import { BEATS, C, FONT } from "../../../config/bankTransfer";
import {
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { FlowDiagram } from "../Network";

export const SceneRoute: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 110 : 64;
  const titleIn = progress(t, 0.05, 0.8);
  const diagramIn = progress(t, 0.2, 0.9);
  const activeIndex =
    t < BEATS.route.stage2 ? 0 : t < BEATS.route.stage3 ? 1 : t < BEATS.route.stage4 ? 2 : 3;
  const packet = t < 3.4 ? 0 : ((t - 3.4) % 2.4) / 2.4;
  const noteIn = progress(t, BEATS.route.cashNote, 0.8);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="50%" y="38%" size={74} color={C.cyan} opacity={0.09} />
      <GridField opacity={0.36} size={wide ? 90 : 72} />
      <Scanlines opacity={0.03} />

      <div style={{ position: "absolute", left: margin, right: margin, top: wide ? 72 : 112 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 24 }}>
          <div>
            <Kicker start={0.05}>FOLLOW THE MESSAGE</Kicker>
            <div style={{ marginTop: 16 }}>
              <MaskLine start={0.12} duration={0.8}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: wide ? 60 : 56,
                    fontWeight: 700,
                    letterSpacing: "-0.045em",
                    lineHeight: 0.98,
                    color: C.white,
                  }}
                >
                  ONE INSTRUCTION.
                  <br />
                  <span style={{ color: C.cyan }}>FOUR STAGES.</span>
                </div>
              </MaskLine>
            </div>
          </div>
          {wide ? (
            <Reveal start={0.4} y={10}>
              <div style={{ textAlign: "right", opacity: titleIn }}>
                <Mono size={11} color={C.dim}>THE TRANSACTION JOURNEY</Mono>
                <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 14, color: C.silver }}>
                  Debit instruction → interbank message → credit confirmation
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 160 : 64,
          right: wide ? 160 : 64,
          top: wide ? 430 : 466,
          opacity: diagramIn,
          transform: `translateY(${(1 - diagramIn) * 20}px)`,
        }}
      >
        <FlowDiagram
          orientation={wide ? "horizontal" : "vertical"}
          width={wide ? 1600 : 952}
          scale={wide ? 1.3 : 1.35}
          reveal={diagramIn}
          activeIndex={activeIndex}
          packet={packet}
          status="success"
          compact={false}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          bottom: wide ? 112 : 250,
          display: "flex",
          flexDirection: wide ? "row" : "column",
          alignItems: wide ? "center" : "stretch",
          justifyContent: wide ? "space-between" : "flex-start",
          gap: wide ? 24 : 14,
          opacity: noteIn,
          transform: `translateY(${(1 - noteIn) * 14}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <Tag color={C.cyan} background={C.cyanSoft} border={`${C.cyan}44`} style={{ fontSize: 10 }}>
            MESSAGE
          </Tag>
          <span style={{ fontFamily: FONT, fontSize: wide ? 15 : 14, color: C.silver }}>
            An instruction to debit and credit — not a bundle of cash.
          </span>
        </div>
        <Mono size={10} color={C.dim} style={{ letterSpacing: "0.14em" }}>
          SENDER BANK → NIBSS / NIP → RECEIVING BANK → BENEFICIARY
        </Mono>
      </div>

      <Vignette strength={0.85} />
      <Grain />
    </AbsoluteFill>
  );
};
