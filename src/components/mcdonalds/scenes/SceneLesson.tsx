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
  Photo,
  Scratches,
  Tag,
  Vignette,
  easeInOut,
  progress,
  useTime,
} from "../kit";
import { ProtocolRow } from "../visuals";

const PAPER = "#EFE8DB";
const INK = "#0B0B0D";

export const SceneLesson: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.lesson;

  const title = progress(t, b.title, 0.8);
  const build = progress(t, b.build, 0.7);
  const protocol = progress(t, b.protocol, 0.6);
  const quote = progress(t, b.quote, 0.8);
  const protocolOut = 1 - progress(t, b.quote - 0.5, 0.5, easeInOut);
  const buildOut = 1 - progress(t, b.protocol - 0.4, 0.45, easeInOut);

  return (
    <AbsoluteFill style={{ backgroundColor: PAPER, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 82% 8%, rgba(255,199,44,0.22) 0%, transparent 42%), radial-gradient(ellipse at 8% 88%, rgba(218,26,50,0.08) 0%, transparent 50%)",
        }}
      />
      <GridField opacity={0.7} size={wide ? 96 : 72} color="rgba(5,5,6,0.055)" />
      <div
        style={{
          position: "absolute",
          right: wide ? -160 : -220,
          top: wide ? -220 : -260,
          width: wide ? 520 : 460,
          height: wide ? 520 : 460,
          borderRadius: "50%",
          border: `1px solid rgba(218,26,50,0.16)`,
          background: "rgba(218,26,50,0.035)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: wide ? -60 : -120,
          top: wide ? -120 : -160,
          width: wide ? 320 : 280,
          height: wide ? 320 : 280,
          borderRadius: "50%",
          border: `1px solid rgba(218,26,50,0.12)`,
        }}
      />
      <Vignette strength={0.42} />
      <Grain opacity={0.05} />
      <Scratches opacity={0.18} />

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 50 : 64,
          zIndex: 10,
        }}
      >
        <Kicker start={b.kicker} color="rgba(5,5,6,0.62)" rule={C.red}>
          {COPY.lessonKicker}
        </Kicker>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 118 : 150,
          zIndex: 12,
          maxWidth: wide ? 880 : 940,
        }}
      >
        {COPY.lessonTitle.map((line, index) => (
          <MaskLine
            key={line}
            start={b.title + index * 0.1}
            duration={0.8}
            style={{ marginTop: index === 0 ? 0 : -10 }}
          >
            <Display
              size={wide ? 80 : 66}
              lineHeight={0.92}
              tracking="-0.06em"
              color={index === 0 ? INK : C.red}
              style={{ opacity: title }}
            >
              {line}
            </Display>
          </MaskLine>
        ))}
      </div>

      {/* Build vs reliable */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: wide ? "46%" : stage.margin,
          top: wide ? 330 : 500,
          zIndex: 12,
          opacity: build * buildOut,
          transform: `translateY(${(1 - build) * 18}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: wide ? "row" : "column", gap: 12 }}>
          <div
            style={{
              flex: 1,
              padding: wide ? "18px 20px" : "16px 18px",
              background: INK,
              borderRadius: 5,
              border: `1px solid rgba(5,5,6,0.2)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Meta size={8} color={C.yellow}>
                01 · BUILD
              </Meta>
              <Meta size={8} color={C.dim}>
                THE EASY PART
              </Meta>
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT,
                fontSize: wide ? 24 : 22,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.98,
                color: C.white,
                textTransform: "uppercase",
              }}
            >
              {COPY.lessonBuild}
              <br />
              <span style={{ color: C.yellow }}>{COPY.lessonBuildLine}</span>
            </div>
          </div>

          <div
            style={{
              flex: 1,
              padding: wide ? "18px 20px" : "16px 18px",
              background: C.green,
              borderRadius: 5,
              border: `1px solid rgba(79,216,160,0.6)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Meta size={8} color="rgba(5,5,6,0.6)">
                02 · PROVE
              </Meta>
              <Meta size={8} color="rgba(5,5,6,0.52)">
                THE REAL PART
              </Meta>
            </div>
            <div
              style={{
                marginTop: 10,
                fontFamily: FONT,
                fontSize: wide ? 24 : 22,
                fontWeight: 700,
                letterSpacing: "-0.045em",
                lineHeight: 0.98,
                color: C.black,
                textTransform: "uppercase",
              }}
            >
              {COPY.lessonReliable}
              <br />
              <span style={{ color: "rgba(5,5,6,0.62)" }}>{COPY.lessonReliableLine}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Protocol */}
      <div
        style={{
          position: "absolute",
          left: wide ? "52%" : stage.margin,
          right: stage.margin,
          top: wide ? 320 : 500,
          zIndex: 13,
          opacity: protocol * protocolOut,
          transform: `translateY(${(1 - protocol) * 20}px)`,
        }}
      >
        <div
          style={{
            background: "#0C0C0F",
            border: `1px solid rgba(5,5,6,0.24)`,
            borderRadius: 6,
            padding: wide ? "18px 20px" : "16px 16px",
            boxShadow: "0 30px 70px rgba(20,16,10,0.18)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 10px ${C.green}` }} />
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: wide ? 10 : 9,
                  letterSpacing: "0.18em",
                  color: C.white,
                }}
              >
                {COPY.lessonProtocolTitle}
              </span>
            </div>
            <Tag
              color={C.green}
              background={C.greenSoft}
              border="rgba(79,216,160,0.4)"
              style={{ fontSize: 7, padding: "4px 7px" }}
            >
              PROPOSED
            </Tag>
          </div>

          <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 7 }}>
            {COPY.lessonProtocol.map((step, index) => (
              <ProtocolRow
                key={step.id}
                id={step.id}
                title={step.title}
                body={step.body}
                appear={progress(t, b.protocol + 0.3 + index * 0.22, 0.35)}
                compact={!wide}
                active={index === 3}
              />
            ))}
          </div>

          <div
            style={{
              marginTop: 11,
              paddingTop: 10,
              borderTop: `1px solid ${C.lineSoft}`,
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                border: `1px solid ${C.yellow}`,
                color: C.yellow,
                fontFamily: MONO,
                fontSize: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              i
            </span>
            <Meta size={8} color={C.silver}>
              {COPY.proposal}
            </Meta>
          </div>
        </div>
      </div>

      {/* Evidence strip: the human in the loop. Vertical only; in the wide
          cut the protocol panel and the quote share the right column. */}
      {!wide ? (
        <div
          style={{
            position: "absolute",
            left: stage.margin,
            right: stage.margin,
            top: 920,
            height: 500,
            zIndex: 12,
            opacity: protocol * protocolOut * progress(t, 8.4, 0.65),
            transform: `translateY(${(1 - progress(t, 8.4, 0.65)) * 24}px)`,
            border: `1px solid rgba(5,5,6,0.18)`,
            borderRadius: 5,
            overflow: "hidden",
            background: "#0B0B0D",
            boxShadow: "0 28px 70px rgba(20,16,10,0.16)",
          }}
        >
          <Photo
            src={IMG.crew}
            objectPosition="48% 44%"
            brightness={0.62}
            contrast={1.1}
            saturation={0.72}
            style={{ width: "100%", height: "100%" }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(5,5,6,0.16) 0%, transparent 38%, rgba(5,5,6,0.9) 100%)",
            }}
          />
          <div style={{ position: "absolute", left: 18, right: 18, bottom: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
            <div>
              <Tag color={C.green} background={C.greenSoft} border="rgba(79,216,160,0.4)" style={{ fontSize: 8, padding: "6px 9px" }}>
                HUMAN HANDOFF
              </Tag>
              <div
                style={{
                  marginTop: 10,
                  fontFamily: FONT,
                  fontSize: 26,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  lineHeight: 1.02,
                  color: C.white,
                  textTransform: "uppercase",
                }}
              >
                The crew stays in the loop.
              </div>
            </div>
            <Meta size={8} color={C.silver} style={{ textAlign: "right" }}>
              STEP 04
              <br />
              ESCALATE
            </Meta>
          </div>
        </div>
      ) : null}

      {/* The quote */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 720 : 430,
          zIndex: 16,
          opacity: quote,
          transform: `translateY(${(1 - quote) * 22}px)`,
        }}
      >
        <div
          style={{
            background: "#0B0B0D",
            borderRadius: 6,
            border: `1px solid rgba(5,5,6,0.22)`,
            padding: wide ? "28px 32px" : "24px 24px",
            display: "flex",
            flexDirection: wide ? "row" : "column",
            gap: wide ? 34 : 18,
            alignItems: wide ? "center" : "flex-start",
            boxShadow: "0 40px 90px rgba(20,16,10,0.26)",
          }}
        >
          <div style={{ flex: 1 }}>
            <Meta size={8} color={C.green} style={{ marginBottom: 12 }}>
              THE PRINCIPLE
            </Meta>
            {COPY.lessonQuote.map((line) => (
              <div
                key={line}
                style={{
                  fontFamily: FONT,
                  fontSize: wide ? 42 : 34,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: 1.02,
                  textTransform: "uppercase",
                  color: C.white,
                }}
              >
                {line}
              </div>
            ))}
            <div style={{ height: 12 }} />
            {COPY.lessonQuoteAccent.map((line) => (
              <div
                key={line}
                style={{
                  fontFamily: FONT,
                  fontSize: wide ? 42 : 34,
                  fontWeight: 700,
                  letterSpacing: "-0.05em",
                  lineHeight: 1.02,
                  textTransform: "uppercase",
                  color: C.green,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div
            style={{
              width: wide ? 300 : "100%",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: "relative",
                height: wide ? 260 : 300,
                borderRadius: 4,
                overflow: "hidden",
                border: `1px solid rgba(79,216,160,0.24)`,
              }}
            >
              <Photo
                src={IMG.counter}
                objectPosition="46% 46%"
                brightness={0.68}
                contrast={1.1}
                saturation={0.72}
                style={{ width: "100%", height: "100%" }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, transparent 35%, rgba(5,5,6,0.9) 100%)",
                }}
              />
              <div style={{ position: "absolute", left: 12, bottom: 10 }}>
                <Meta size={7} color={C.green}>
                  HUMAN HANDOFF
                </Meta>
                <div
                  style={{
                    marginTop: 3,
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: "-0.01em",
                    color: C.white,
                  }}
                >
                  The crew stays in the loop.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 40 : 82,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 12,
          opacity: progress(t, 1.2, 0.7),
        }}
      >
        <Meta size={8} color="rgba(5,5,6,0.38)">
          {COPY.sourceFinePrint}
        </Meta>
        <Tag
          color="rgba(5,5,6,0.52)"
          background="rgba(5,5,6,0.04)"
          border="rgba(5,5,6,0.12)"
          style={{ fontSize: 8, padding: "6px 9px" }}
        >
          ACT 06 · THE LESSON
        </Tag>
      </div>

      <Glow x="82%" y="18%" color={C.yellow} opacity={0.18} size={40} />
    </AbsoluteFill>
  );
};
