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
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { FlowDiagram } from "../Network";

export const SceneReveal: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 110 : 64;
  const flowIn = progress(t, 0.05, 0.85);
  const completed = t >= BEATS.reveal.complete;
  const packet = progress(t, 1.9, 1.5);
  const finalIn = progress(t, BEATS.reveal.final, 0.85);
  const accentIn = progress(t, BEATS.reveal.accent, 0.8);
  const confirmIn = progress(t, BEATS.reveal.complete + 0.25, 0.6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="50%" y="44%" size={68} color={completed ? C.green : C.cyan} opacity={0.1} />
      <GridField opacity={0.32} size={wide ? 94 : 72} />
      <Scanlines opacity={0.03} />

      <div style={{ position: "absolute", left: margin, top: wide ? 66 : 112, width: wide ? 720 : undefined, right: wide ? undefined : margin }}>
        <Kicker start={0.05} color={C.silver} rule={C.green}>
          THE FINAL REVELATION
        </Kicker>
        <div style={{ marginTop: 14 }}>
          <MaskLine start={0.12} duration={0.8}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 50 : 48,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.98,
                color: C.white,
              }}
            >
              DON'T JUST CHECK
              <br />
              <span style={{ color: C.silver }}>THE RECEIPT.</span>
            </div>
          </MaskLine>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 760 : 54,
          right: wide ? 90 : 54,
          top: wide ? 218 : 368,
          opacity: flowIn,
        }}
      >
        <FlowDiagram
          orientation={wide ? "horizontal" : "vertical"}
          width={wide ? 1070 : 972}
          scale={wide ? 1.1 : 1.32}
          reveal={flowIn}
          activeIndex={completed ? 3 : 2}
          packet={packet}
          status={completed ? "success" : "live"}
          senderActive
          hubActive
          receiverActive
          beneficiaryActive={completed}
          showMessageTag={false}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? margin : 0,
          right: wide ? undefined : 0,
          top: wide ? 646 : 1305,
          width: wide ? 680 : undefined,
          opacity: finalIn,
          transform: `translateY(${(1 - finalIn) * 18}px)`,
          textAlign: wide ? "left" : "center",
        }}
      >
        <div style={{ display: "flex", justifyContent: wide ? "flex-start" : "center", marginBottom: 18 }}>
          <Tag
            color={completed ? C.green : C.cyan}
            background={completed ? C.greenSoft : C.cyanSoft}
            border={`${completed ? C.green : C.cyan}44`}
            style={{ fontSize: 9.5, opacity: confirmIn }}
          >
            {completed ? "CREDIT CONFIRMED AT DESTINATION" : "TRACING THE TRANSACTION"}
          </Tag>
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: wide ? 74 : 62,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 0.94,
            color: C.cyan,
          }}
        >
          TRACE THE
          <br />
          TRANSACTION.
        </div>
        <div
          style={{
            marginTop: 18,
            opacity: accentIn,
            transform: `translateY(${(1 - accentIn) * 12}px)`,
            fontFamily: FONT,
            fontSize: wide ? 18 : 21,
            lineHeight: 1.5,
            color: C.silver,
            maxWidth: 520,
            marginLeft: wide ? 0 : "auto",
            marginRight: wide ? 0 : "auto",
          }}
        >
          Ask for the transaction trail — not just the confirmation on your screen.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          bottom: wide ? 126 : 268,
          display: wide ? "flex" : "none",
          alignItems: "center",
          gap: 12,
          opacity: accentIn * 0.8,
        }}
      >
        <span style={{ width: 28, height: 1, background: C.cyan }} />
        <Mono size={9.5} color={C.dim} style={{ letterSpacing: "0.14em" }}>
          SENDER BANK → NIBSS / NIP → RECEIVING BANK → BENEFICIARY
        </Mono>
      </div>

      <Vignette strength={0.92} />
      <Grain />
    </AbsoluteFill>
  );
};
