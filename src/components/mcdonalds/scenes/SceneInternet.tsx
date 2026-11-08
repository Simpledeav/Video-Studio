import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, useStage } from "../../../config/mcdonalds";
import {
  Display,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Meta,
  Reveal,
  Rule,
  Scratches,
  Vignette,
  progress,
  useTime,
} from "../kit";
import {
  HeadlineCard,
  ScreenFrame,
  ScreenHeader,
  ScreenRow,
  SocialCard,
  Waveform,
} from "../visuals";

export const SceneInternet: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.internet;

  const reality = progress(t, b.reality, 0.6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <Glow x={wide ? "24%" : "50%"} y="18%" color={C.blue} opacity={0.1} size={58} />
      <Glow x={wide ? "82%" : "20%"} y="78%" color={C.red} opacity={0.08} size={50} />
      <Vignette strength={1.02} />
      <Scratches opacity={0.42} />
      <Grain opacity={0.055} />

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 58 : 72,
          zIndex: 10,
        }}
      >
        <Kicker start={b.kicker} color={C.bone} rule={C.blue}>
          {COPY.internetKicker}
        </Kicker>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 150 : 160,
          zIndex: 10,
          maxWidth: wide ? 760 : 900,
        }}
      >
        {COPY.internetTitle.map((line, index) => (
          <MaskLine
            key={line}
            start={b.title + index * 0.1}
            duration={0.8}
            style={{ marginTop: index === 0 ? 0 : -10 }}
          >
            <Display
              size={wide ? 100 : 74}
              lineHeight={0.9}
              tracking="-0.06em"
              color={index === 0 ? C.white : C.blue}
            >
              {line}
            </Display>
          </MaskLine>
        ))}
        <Reveal start={b.title + 0.5} duration={0.6} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 1, background: C.blue }} />
            <Meta size={9} color={C.silver}>
              CUSTOMER VIDEOS · REPORTED BY CBS NEWS
            </Meta>
          </div>
        </Reveal>
      </div>

      {/* Social cards */}
      <div
        style={{
          position: "absolute",
          left: wide ? 950 : stage.margin,
          right: wide ? 70 : 40,
          top: wide ? 190 : 470,
          zIndex: 12,
          display: "flex",
          flexDirection: wide ? "row" : "column",
          gap: wide ? 18 : 14,
          alignItems: "flex-start",
        }}
      >
        <SocialCard
          quote={COPY.internetQuoteOne}
          source={COPY.internetQuoteOneSource}
          start={b.quoteOne}
          accent={C.redBright}
          index={0}
          style={{
            width: wide ? 360 : "100%",
            transform: `rotate(${wide ? -1.5 : -0.8}deg)`,
          }}
        />
        <SocialCard
          quote={COPY.internetQuoteTwo}
          source={COPY.internetQuoteTwoSource}
          start={b.quoteTwo}
          accent={C.yellow}
          index={1}
          style={{
            width: wide ? 360 : "94%",
            alignSelf: wide ? "flex-start" : "flex-end",
            transform: `rotate(${wide ? 1.8 : 1.2}deg)`,
          }}
        />
      </div>

      {/* Promised vs reality */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 690 : 1060,
          zIndex: 14,
          opacity: reality,
          transform: `translateY(${(1 - reality) * 18}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Rule color={C.line} style={{ flex: 1 }} />
          <Meta size={8} color={C.muted}>
            THE GAP BETWEEN THE DEMO AND THE DRIVE-THRU
          </Meta>
          <Rule color={C.line} style={{ flex: 1 }} />
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: wide ? "row" : "column",
            gap: wide ? 0 : 12,
            border: `1px solid ${C.line}`,
            borderRadius: 6,
            background: "rgba(10,10,13,0.82)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: 1,
              padding: wide ? "22px 24px" : "16px 18px",
              borderRight: wide ? `1px solid ${C.line}` : "none",
              borderBottom: wide ? "none" : `1px solid ${C.line}`,
              background:
                "linear-gradient(180deg, rgba(61,116,255,0.09) 0%, transparent 100%)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Meta size={9} color={C.blue}>
                {COPY.internetPromise}
              </Meta>
              <Meta size={8} color={C.dim}>
                THE PITCH
              </Meta>
            </div>
            <div
              style={{
                marginTop: 12,
                fontFamily: FONT,
                fontSize: wide ? 30 : 24,
                fontWeight: 600,
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: C.white,
                textTransform: "uppercase",
              }}
            >
              FAST. ACCURATE.
              <br />
              AUTOMATIC.
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <Waveform t={t} active color={C.blue} width={wide ? 190 : 160} height={26} bars={22} />
              <Meta size={8} color={C.blue}>
                AI LISTENING
              </Meta>
            </div>
          </div>

          <div
            style={{
              flex: 1.2,
              padding: wide ? "22px 24px" : "16px 18px",
              background:
                "linear-gradient(180deg, rgba(218,26,50,0.09) 0%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              gap: 18,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Meta size={9} color={C.redBright}>
                  {COPY.internetReality}
                </Meta>
                <Meta size={8} color={C.dim}>
                  THE ORDER
                </Meta>
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: FONT,
                  fontSize: wide ? 26 : 21,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  color: C.white,
                  textTransform: "uppercase",
                }}
              >
                ONE REQUEST.
                <br />
                <span style={{ color: C.redBright }}>NINE SWEET TEAS.</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <Meta size={8} color={C.muted}>
                  CUSTOMER-REPORTED ORDER · 2023
                </Meta>
              </div>
            </div>
            <ScreenFrame width={wide ? 280 : 230} accent={C.redBright} scale={1} glow={false}>
              <ScreenHeader title="ORDER" status="FLAGGED" warning />
              <ScreenRow name="SWEET TEA" qty="× 9" appear={1} accent={C.redBright} compact />
              <ScreenRow name="BUTTER" qty="× 2" appear={1} accent={C.red} compact />
              <ScreenRow name="KETCHUP" qty="× 4" appear={1} accent={C.red} compact />
            </ScreenFrame>
          </div>
        </div>
      </div>

      {/* Real headline, clearly sourced */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 900 : 1590,
          zIndex: 12,
          width: wide ? 480 : 760,
        }}
      >
        <HeadlineCard
          kicker="CBS NEWS · JUNE 17, 2024"
          headline="McDonald's ends AI drive-thru orders — for now"
          source="REPORTED HEADLINE · CBS MONEYWATCH"
          start={b.reality + 0.3}
          accent={C.yellow}
        />
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
          opacity: progress(t, 1.4, 0.7),
        }}
      >
        <Meta size={8} color={C.dim}>
          {COPY.sourceFinePrint}
        </Meta>
        <Meta size={8} color={C.dim}>
          ACT 04 · THE REACTION
        </Meta>
      </div>
    </AbsoluteFill>
  );
};
