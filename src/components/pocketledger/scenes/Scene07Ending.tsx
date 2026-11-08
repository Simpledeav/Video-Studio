import { BEATS, C, COPY, FONT, MONO, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Glow,
  Kicker,
  MaskLine,
  PocketLedgerLogo,
  Tag,
  clamp,
  easeOut,
  progress,
  useTime,
} from "../kit";
import { PocketLedgerPhone } from "../PocketLedgerUI";

export const Scene07Ending: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const phoneIn = progress(t, BEATS.ending.product, 1.2, easeOut);
  const questionIn = progress(t, BEATS.ending.question, 0.8, easeOut);
  const float = Math.sin(t * 0.8) * 3;
  const titleSize = wide ? 76 : 46;

  return (
    <Backdrop glowX="70%" glowY="44%" glowOpacity={0.16}>
      <Glow x="50%" y="52%" size={46} color={C.amber} opacity={0.07} />
      <div style={{ position: "absolute", left: stage.margin, top: wide ? 92 : 140, zIndex: 8 }}>
        <PocketLedgerLogo size={wide ? 42 : 36} />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "68%" : "50%",
          top: wide ? "48%" : "38%",
          transform: `translate(-50%, -50%) translateY(${float}px) scale(${0.9 + phoneIn * 0.1})`,
          opacity: clamp(phoneIn * 1.2),
          zIndex: 6,
        }}
      >
        <PocketLedgerPhone width={wide ? 380 : 390} screen="summary" screenStart={BEATS.ending.product} profitProgress={1} />
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: wide ? "48%" : stage.margin,
          top: wide ? 250 : 1120,
          zIndex: 8,
          textAlign: wide ? "left" : "center",
        }}
      >
        <Kicker start={0.4} style={{ justifyContent: wide ? "flex-start" : "center" }}>
          WHAT ACTUALLY MATTERS
        </Kicker>
        <div style={{ height: 22 }} />
        <MaskLine start={BEATS.ending.line1} duration={0.8}>
          <div style={{ fontFamily: FONT, fontSize: titleSize, fontWeight: 750, lineHeight: 0.96, letterSpacing: "-0.05em", color: C.cream }}>
            SMALL PROBLEMS.
          </div>
        </MaskLine>
        <MaskLine start={BEATS.ending.line2} duration={0.8}>
          <div style={{ fontFamily: FONT, fontSize: titleSize, fontWeight: 750, lineHeight: 0.96, letterSpacing: "-0.05em", color: C.cream }}>
            USEFUL PRODUCTS.
          </div>
        </MaskLine>
        <MaskLine start={BEATS.ending.line3} duration={0.8}>
          <div style={{ fontFamily: FONT, fontSize: titleSize, fontWeight: 750, lineHeight: 0.96, letterSpacing: "-0.05em", color: C.greenBright }}>
            REAL VALUE.
          </div>
        </MaskLine>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: wide ? "48%" : stage.margin,
          bottom: wide ? 96 : 220,
          zIndex: 9,
          opacity: questionIn,
          transform: `translateY(${(1 - questionIn) * 18}px)`,
        }}
      >
        <div
          style={{
            borderTop: `1px solid ${C.line}`,
            paddingTop: 16,
            fontFamily: MONO,
            fontSize: wide ? 11 : 10,
            lineHeight: 1.7,
            letterSpacing: "0.14em",
            color: C.muted,
            maxWidth: wide ? 700 : 900,
            textAlign: wide ? "left" : "center",
            margin: wide ? 0 : "0 auto",
          }}
        >
          {COPY.question}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: stage.margin,
          bottom: wide ? 44 : 168,
          zIndex: 9,
          display: "flex",
          gap: 8,
        }}
      >
        <Tag color={C.cream} background="rgba(246,242,232,0.05)" style={{ fontSize: 8 }}>
          CONCEPT PRODUCT
        </Tag>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.greenBright}, transparent)`,
          opacity: 0.45,
          zIndex: 20,
        }}
      />
    </Backdrop>
  );
};
