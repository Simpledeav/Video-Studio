import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/mcdonalds";
import {
  Display,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Meta,
  Panel,
  Photo,
  Reveal,
  Rule,
  Scratches,
  Tag,
  Vignette,
  easeOut,
  progress,
  useTime,
} from "../kit";

const Check: React.FC<{ color?: string; size?: number }> = ({ color = C.green, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <path
      d="M3.5 9.4 7 12.8 14.5 5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SceneTakeaway: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.takeaway;

  const title = progress(t, b.title, 0.8);
  const accent = progress(t, b.accent, 0.75);
  const question = progress(t, 6.05, 0.65);
  const cursor = Math.sin(t * 3.6) > 0;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      {/* Photo plate */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: wide ? "46%" : "100%",
          height: wide ? "100%" : 760,
          overflow: "hidden",
          opacity: progress(t, 0.05, 1.0, easeOut),
        }}
      >
        <Photo
          src={IMG.crew}
          objectPosition={wide ? "54% 38%" : "52% 34%"}
          brightness={0.42}
          contrast={1.12}
          saturation={0.62}
          style={{ width: "100%", height: "100%", transform: `scale(${1.04 + progress(t, 0, 9.4) * 0.06})` }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: wide
              ? "linear-gradient(90deg, #050506 0%, rgba(5,5,6,0.55) 48%, rgba(5,5,6,0.18) 100%)"
              : "linear-gradient(180deg, rgba(5,5,6,0.42) 0%, rgba(5,5,6,0.35) 48%, #050506 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(61,116,255,0.12) 0%, transparent 55%, rgba(79,216,160,0.06) 100%)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      <GridField opacity={0.22} size={wide ? 108 : 80} />
      <Glow x={wide ? "22%" : "50%"} y="18%" color={C.blue} opacity={0.09} size={54} />
      <Glow x={wide ? "80%" : "80%"} y="76%" color={C.green} opacity={0.07} size={46} />
      <Vignette strength={1.04} />
      <Scratches opacity={0.4} />
      <Grain opacity={0.055} />

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 54 : 70,
          zIndex: 10,
        }}
      >
        <Kicker start={b.kicker} color={C.bone} rule={C.green}>
          {COPY.takeawayKicker}
        </Kicker>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 176 : 184,
          zIndex: 12,
          maxWidth: wide ? 820 : 930,
        }}
      >
        {COPY.takeawayTitle.map((line, index) => (
          <MaskLine
            key={line}
            start={b.title + index * 0.1}
            duration={0.8}
            style={{ marginTop: index === 0 ? 0 : -12 }}
          >
            <Display
              size={wide ? 100 : 86}
              lineHeight={0.88}
              tracking="-0.065em"
              color={C.white}
              style={{ opacity: title }}
            >
              {line}
            </Display>
          </MaskLine>
        ))}

        <div style={{ height: wide ? 22 : 18 }} />

        {COPY.takeawayAccent.map((line, index) => (
          <div
            key={line}
            style={{
              overflow: "hidden",
              marginTop: index === 0 ? 0 : -6,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 54 : 42,
                fontWeight: 700,
                letterSpacing: "-0.055em",
                lineHeight: 0.96,
                textTransform: "uppercase",
                color: C.green,
                opacity: accent,
                transform: `translateY(${(1 - accent) * 110}%)`,
              }}
            >
              {line}
            </div>
          </div>
        ))}

        <div style={{ height: wide ? 22 : 18 }} />

        <Reveal start={b.sub} duration={0.6}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, maxWidth: wide ? 620 : 780 }}>
            <div style={{ width: 2, alignSelf: "stretch", background: C.yellow, flexShrink: 0 }} />
            <div
              style={{
                fontFamily: MONO,
                fontSize: wide ? 10 : 10,
                letterSpacing: "0.12em",
                lineHeight: 1.7,
                color: C.silver,
              }}
            >
              {COPY.takeawaySub}
            </div>
          </div>
        </Reveal>
      </div>

      {/* Question panel */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: wide ? "48%" : stage.margin,
          top: wide ? 700 : 1080,
          zIndex: 16,
          opacity: question,
          transform: `translateY(${(1 - question) * 22}px)`,
        }}
      >
        <Panel
          background="rgba(10,10,13,0.9)"
          color="rgba(79,216,160,0.28)"
          padding={wide ? "20px 22px" : "18px 18px"}
          glow="rgba(79,216,160,0.16)"
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <Meta size={8} color={C.green}>
              YOUR TURN
            </Meta>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green }} />
              <Meta size={7} color={C.dim}>
                OPEN QUESTION
              </Meta>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {COPY.question.map((line) => (
              <div
                key={line}
                style={{
                  fontFamily: FONT,
                  fontSize: wide ? 30 : 26,
                  fontWeight: 600,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.05,
                  color: C.white,
                  textTransform: "uppercase",
                }}
              >
                {line}
              </div>
            ))}
            <span
              style={{
                display: "inline-block",
                width: 2,
                height: wide ? 26 : 22,
                marginLeft: 3,
                background: C.green,
                opacity: cursor ? 1 : 0,
                verticalAlign: "middle",
              }}
            />
          </div>

          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Tag color={C.green} background={C.greenSoft} border="rgba(79,216,160,0.4)" style={{ fontSize: 8 }}>
              <Check size={11} /> YES, WITH GUARDRAILS
            </Tag>
            <Tag color={C.silver} background="rgba(247,243,234,0.04)" border={C.line} style={{ fontSize: 8 }}>
              NOT YET
            </Tag>
          </div>
        </Panel>
      </div>

      {/* Reliability card */}
      <div
        style={{
          position: "absolute",
          right: wide ? 96 : 62,
          top: wide ? 520 : 860,
          width: wide ? 330 : 300,
          zIndex: 15,
          opacity: progress(t, 3.7, 0.7),
          transform: `translateY(${(1 - progress(t, 3.7, 0.7)) * 18}px) rotate(${wide ? 1.2 : -1.4}deg)`,
        }}
      >
        <Panel background="rgba(8,8,11,0.86)" color="rgba(79,216,160,0.26)" padding="14px 15px">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Meta size={7} color={C.green}>
              ORDER CONFIRMED
            </Meta>
            <Check size={13} />
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT,
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: C.white,
            }}
          >
            1 vanilla cone
          </div>
          <div
            style={{
              marginTop: 4,
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.12em",
              color: C.muted,
            }}
          >
            READ BACK · CORRECTED · SENT
          </div>
          <Rule color="rgba(79,216,160,0.16)" style={{ marginTop: 12 }} />
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 7 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: C.green,
                boxShadow: `0 0 8px ${C.green}`,
              }}
            />
            <Meta size={7} color={C.green}>
              HUMAN BACKUP READY
            </Meta>
          </div>
        </Panel>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 42 : 86,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 12,
          opacity: progress(t, 1.2, 0.7),
        }}
      >
        <Meta size={8} color={C.dim}>
          {COPY.sourceFinePrint}
        </Meta>
        <Meta size={8} color={C.dim}>
          ACT 07 · THE TAKEAWAY
        </Meta>
      </div>
    </AbsoluteFill>
  );
};
