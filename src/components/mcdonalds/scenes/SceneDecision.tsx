import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, useStage } from "../../../config/mcdonalds";
import {
  Display,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Meta,
  Photo,
  Reveal,
  Rule,
  Scratches,
  Tag,
  Vignette,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";
import {
  Arches,
  IBMWordmark,
  McDonaldsWordmark,
  ScreenFrame,
  ScreenHeader,
  ScreenRow,
  Timeline,
} from "../visuals";

export const SceneDecision: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.decision;

  const power = progress(t, b.power, 0.9, easeInOut);
  const timeline = progress(t, b.timeline, 0.7);
  const turn = progress(t, b.turn, 0.75);
  const quote = progress(t, b.quote, 0.7);

  const screenW = wide ? 500 : 600;

  return (
    <AbsoluteFill style={{ backgroundColor: "#060607", overflow: "hidden" }}>
      <Glow x={wide ? "78%" : "50%"} y={wide ? "46%" : "26%"} color={C.red} opacity={0.08} size={56} />
      <Vignette strength={1.05} />
      <Scratches opacity={0.4} />
      <Grain opacity={0.055} />

      {/* Photo plate */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: wide ? "38%" : "100%",
          height: wide ? "100%" : 560,
          overflow: "hidden",
          opacity: progress(t, 0.05, 1.1, easeOut),
        }}
      >
        <Photo
          src={IMG.storeStreet}
          objectPosition={wide ? "54% 50%" : "50% 46%"}
          brightness={0.4}
          contrast={1.15}
          saturation={0.6}
          style={{ width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: wide
              ? "linear-gradient(90deg, #060607 0%, rgba(6,6,7,0.35) 55%, rgba(6,6,7,0.72) 100%)"
              : "linear-gradient(180deg, rgba(6,6,7,0.35) 0%, rgba(6,6,7,0.62) 55%, #060607 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(218,26,50,0.16) 0%, transparent 60%)",
            mixBlendMode: "multiply",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 58 : 72,
          display: "flex",
          alignItems: "center",
          gap: 14,
          zIndex: 10,
        }}
      >
        <Kicker start={b.kicker} color={C.bone} rule={C.red}>
          {COPY.decisionKicker}
        </Kicker>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 146 : 160,
          zIndex: 12,
          maxWidth: wide ? 760 : 900,
        }}
      >
        {COPY.decisionTitle.map((line, index) => (
          <MaskLine
            key={line}
            start={b.title + index * 0.1}
            duration={0.8}
            style={{ marginTop: index === 0 ? 0 : -10 }}
          >
            <Display
              size={wide ? 108 : 88}
              lineHeight={0.9}
              tracking="-0.06em"
              color={index === 0 ? C.white : C.redBright}
            >
              {line}
            </Display>
          </MaskLine>
        ))}
        <Reveal start={b.title + 0.55} duration={0.6} style={{ marginTop: 16 }}>
          <Meta size={9} color={C.silver}>
            {COPY.decisionSub}
          </Meta>
        </Reveal>

        <div style={{ marginTop: wide ? 30 : 26, display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Arches size={wide ? 38 : 34} opacity={0.9} />
            <McDonaldsWordmark size={wide ? 22 : 20} opacity={0.95} />
          </div>
          <span style={{ fontFamily: FONT, fontSize: 18, color: C.muted, fontWeight: 300 }}>×</span>
          <IBMWordmark width={wide ? 74 : 68} opacity={0.75} />
        </div>
      </div>

      {/* Timeline */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 560 : 620,
          width: wide ? 820 : "auto",
          right: wide ? undefined : stage.margin,
          zIndex: 12,
          opacity: timeline,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <Rule color={C.line} style={{ flex: 1 }} />
          <Meta size={8} color={C.muted}>
            THE TEST · 2021 — 2024
          </Meta>
          <Rule color={C.line} style={{ flex: 1 }} />
        </div>
        <Timeline
          t={t}
          start={b.timeline}
          steps={COPY.decisionTimeline}
          wide={wide}
          accent={C.red}
          turn={turn}
        />
      </div>

      {/* Power-down screen */}
      <div
        style={{
          position: "absolute",
          right: wide ? stage.margin : stage.margin,
          top: wide ? 250 : 1000,
          width: screenW,
          zIndex: 14,
          opacity: progress(t, b.power - 0.2, 0.6),
          transform: `rotate(${wide ? 1 : 0}deg)`,
        }}
      >
        <ScreenFrame
          width={screenW}
          accent={power > 0.35 ? C.red : C.yellow}
          glow
          style={{
            filter: `grayscale(${power * 0.6}) brightness(${1 - power * 0.22})`,
          }}
        >
          <ScreenHeader
            title="AUTOMATED ORDER TAKER"
            status={power > 0.35 ? "OFFLINE" : "ACTIVE"}
            warning={power > 0.35}
          />
          <div style={{ padding: "14px 16px 4px", opacity: 1 - power * 0.55 }}>
            <ScreenRow name="SWEET TEA" qty="× 9" appear={1} accent={C.redBright} compact={!wide} />
            <ScreenRow name="BUTTER" qty="× 2" appear={1} accent={C.red} compact={!wide} muted />
            <ScreenRow name="KETCHUP" qty="× 4" appear={1} accent={C.red} compact={!wide} muted />
          </div>
          <div
            style={{
              padding: "14px 16px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${C.lineSoft}`,
            }}
          >
            <Meta size={8} color={power > 0.35 ? C.redBright : C.muted}>
              {power > 0.35 ? "TEST ENDED" : "PROCESSING"}
            </Meta>
            <div style={{ display: "flex", gap: 4 }}>
              {Array.from({ length: 5 }, (_, index) => (
                <span
                  key={index}
                  style={{
                    width: 14,
                    height: 3,
                    background:
                      power > 0.35
                        ? index < 2
                          ? C.red
                          : C.dim
                        : index < 4
                          ? C.yellow
                          : C.dim,
                    opacity: 0.7,
                  }}
                />
              ))}
            </div>
          </div>
        </ScreenFrame>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
          <Meta size={8} color={C.dim}>
            {COPY.reconstruction}
          </Meta>
          <Meta size={8} color={C.red}>
            JUNE 2024
          </Meta>
        </div>
      </div>

      {/* The turn */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: wide ? "42%" : stage.margin,
          top: wide ? 790 : 1440,
          zIndex: 16,
          opacity: turn,
          transform: `translateY(${(1 - turn) * 18}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 30, height: 2, background: C.green }} />
          <Meta size={9} color={C.green}>
            THE PART THAT GETS MISSED
          </Meta>
        </div>
        {COPY.decisionTurn.map((line, index) => (
          <div
            key={line}
            style={{
              fontFamily: FONT,
              fontSize: wide ? 58 : 46,
              fontWeight: 700,
              letterSpacing: "-0.055em",
              lineHeight: 0.98,
              textTransform: "uppercase",
              color: index === 0 ? C.white : C.green,
              marginTop: index === 0 ? 0 : 2,
            }}
          >
            {line}
          </div>
        ))}

        <div
          style={{
            marginTop: 18,
            padding: "16px 18px",
            borderLeft: `2px solid ${C.green}`,
            background: "rgba(79,216,160,0.06)",
            opacity: quote,
            transform: `translateY(${(1 - quote) * 10}px)`,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 21 : 18,
              fontWeight: 500,
              lineHeight: 1.4,
              color: C.bone,
              letterSpacing: "-0.01em",
            }}
          >
            {COPY.decisionQuote}
          </div>
          <Meta size={8} color={C.green} style={{ marginTop: 8 }}>
            {COPY.decisionQuoteSource}
          </Meta>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 44 : 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 12,
          opacity: progress(t, 1.6, 0.7),
        }}
      >
        <Meta size={8} color={C.dim}>
          {COPY.sourceFinePrint}
        </Meta>
        <Tag
          color={C.silver}
          background="rgba(247,243,234,0.04)"
          border={C.line}
          style={{ fontSize: 8, padding: "6px 9px" }}
        >
          ACT 05 · THE DECISION
        </Tag>
      </div>
    </AbsoluteFill>
  );
};
