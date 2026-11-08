import { AbsoluteFill } from "remotion";
import { C, FONT, IMG } from "../../../config/walmartChicken";
import {
  CommentCard,
  Display,
  Kicker,
  MaskLine,
  Photo,
  Reveal,
  Spark,
  Stage,
  Sweep,
  easeIn,
  easeInOut,
  easeOut,
  progress,
  seeded,
  useTime,
} from "../../presets/editorialPop/kit";

const COMMENTS = [
  {
    handle: "@weeknightdinner",
    text: "That bag is basically a designer purse.",
    avatar: "W",
    accent: C.yellow,
    at: 7.6,
    y: 560,
    rotate: -2.2,
  },
  {
    handle: "@sparkcart",
    text: "Rotisserie chicken. But make it fashion.",
    avatar: "S",
    accent: C.orange,
    at: 8.5,
    y: 790,
    rotate: 1.6,
  },
  {
    handle: "@dinnerwithjess",
    text: "I would carry this. Unironically.",
    avatar: "J",
    accent: C.purpleLight,
    at: 9.4,
    y: 1020,
    rotate: -1.1,
  },
];

export const Scene02Story: React.FC = () => {
  const { t } = useTime();

  const toFeed = progress(t, 6.2, 0.6, easeInOut);
  const toCount = progress(t, 10.4, 0.5, easeInOut);
  const feedOn = t < 10.4;
  const countOn = t >= 10.4;
  const toListen = progress(t, 12.7, 0.45, easeInOut);
  const counter = Math.round(15000 * progress(t, 10.45, 1.5, easeOut));
  const pulse = 0.86 + Math.sin(t * 5.2) * 0.14;

  return (
    <Stage variant="blue" accent={C.orange} accent2={C.yellow} glowX="70%" glowY="30%">
      {/* ---------- 5.0 – 11.0 : shoppers + social feed ---------- */}
      <AbsoluteFill style={{ opacity: feedOn ? 1 : 0, transform: `scale(${1 + toCount * 0.06})` }}>
        <Photo
          src={IMG.deli}
          start={0}
          duration={6.4}
          scaleFrom={1.24}
          scaleTo={1.02}
          grade="vivid"
          objectPosition="62% 54%"
          overlay="linear-gradient(180deg, rgba(4,30,66,0.82) 0%, rgba(4,30,66,0.22) 34%, rgba(4,30,66,0.9) 100%)"
        />

        <AbsoluteFill style={{ padding: "112px 54px", zIndex: 12, opacity: 1 - toFeed }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Spark size={38} />
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: 15,
                  letterSpacing: "0.23em",
                  color: C.white,
                }}
              >
                THE DELI AISLE
              </span>
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.18em",
                color: C.white,
                background: "rgba(226,59,46,0.94)",
                padding: "8px 12px",
                borderRadius: 3,
              }}
            >
              ● LIVE CULTURE
            </div>
          </div>

          <div style={{ marginTop: 420 }}>
            <MaskLine start={0.2} duration={0.62}>
              <Display size={86} color={C.white}>
                PEOPLE DIDN'T
              </Display>
            </MaskLine>
            <MaskLine start={0.32} duration={0.62}>
              <Display size={86} color={C.white}>
                JUST BUY
              </Display>
            </MaskLine>
            <MaskLine start={0.44} duration={0.62}>
              <Display size={108} color={C.yellow} style={{ marginTop: 2 }}>
                THE CHICKEN.
              </Display>
            </MaskLine>
          </div>

          <Reveal start={0.9} y={18} style={{ marginTop: 30 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "13px 18px",
                borderRadius: 6,
                background: "rgba(7,24,47,0.58)",
                border: `1px solid ${C.line}`,
                color: C.cream,
                fontFamily: FONT,
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.03em",
                backdropFilter: "blur(8px)",
              }}
            >
              They carried the bag like a purse.
            </div>
          </Reveal>
        </AbsoluteFill>

        {/* social listening panel */}
        <AbsoluteFill
          style={{
            zIndex: 14,
            opacity: toFeed,
            transform: `translateY(${(1 - toFeed) * 90}px)`,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 118,
              borderRadius: 26,
              background: `linear-gradient(160deg, ${C.blueInk} 0%, #0A2D61 100%)`,
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 40px 90px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "26px 28px 22px",
                borderBottom: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 28 }}>
                  {Array.from({ length: 14 }, (_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 4,
                        height: 6 + seeded(i + 2) * 20 * (0.6 + Math.abs(Math.sin(t * 4 + i)) * 0.8),
                        background: C.yellow,
                        borderRadius: 3,
                        opacity: 0.9,
                      }}
                    />
                  ))}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: "0.22em",
                      color: C.yellow,
                    }}
                  >
                    SOCIAL LISTENING
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.15em",
                      color: "rgba(255,255,255,0.5)",
                      marginTop: 4,
                    }}
                  >
                    ROTISSERIE CHICKEN · LAST 12 MONTHS
                  </div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: "-0.04em",
                    color: C.white,
                  }}
                >
                  15,000
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    color: "rgba(255,255,255,0.52)",
                  }}
                >
                  MENTIONS
                </div>
              </div>
            </div>

            <div style={{ position: "relative", height: 940, padding: "22px 24px" }}>
              <div
                style={{
                  position: "absolute",
                  left: 24,
                  right: 24,
                  top: 22,
                  height: 900,
                  borderRadius: 20,
                  background:
                    "radial-gradient(circle at 24% 16%, rgba(255,194,32,0.18), transparent 34%), linear-gradient(160deg, rgba(255,255,255,0.06), transparent 60%)",
                }}
              />
              {COMMENTS.map((comment) => (
                <CommentCard
                  key={comment.handle}
                  handle={comment.handle}
                  text={comment.text}
                  start={comment.at - 6.2}
                  y={comment.y - 430}
                  x={0}
                  rotate={comment.rotate}
                  avatar={comment.avatar}
                  accent={comment.accent}
                />
              ))}
              <div
                style={{
                  position: "absolute",
                  left: 20,
                  bottom: 2,
                  fontFamily: FONT,
                  fontSize: 9,
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  color: "rgba(255,255,255,0.42)",
                  textTransform: "uppercase",
                }}
              >
                ILLUSTRATIVE RECREATION · PUBLIC POSTS PARAPHRASED
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* ---------- 11.0 – 16.9 : the number ---------- */}
      <AbsoluteFill
        style={{
          opacity: countOn ? 1 : 0,
          zIndex: 20,
        }}
      >
        <Photo
          src={IMG.bagPrint}
          start={0}
          duration={5}
          scaleFrom={1.18}
          scaleTo={1}
          grade="vivid"
          objectPosition="50% 42%"
          overlay="linear-gradient(180deg, rgba(4,30,66,0.8) 0%, rgba(4,30,66,0.52) 46%, rgba(4,30,66,0.92) 100%)"
        />

        <AbsoluteFill style={{ padding: "128px 54px", zIndex: 22 }}>
          <Kicker start={10.5} color={C.yellow}>
            15,000 ORGANIC MENTIONS
          </Kicker>

          <div style={{ marginTop: 360, textAlign: "center" }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 210,
                fontWeight: 800,
                lineHeight: 0.82,
                letterSpacing: "-0.08em",
                color: C.white,
                textShadow: "0 10px 44px rgba(0,0,0,0.36)",
                transform: `scale(${0.96 + pulse * 0.04})`,
              }}
            >
              {counter.toLocaleString("en-US")}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 21,
                fontWeight: 700,
                letterSpacing: "0.26em",
                color: C.yellow,
                marginTop: 18,
              }}
            >
              ONE DELI ITEM. ONE VERY ONLINE FAN BASE.
            </div>
          </div>

          <div
            style={{
              marginTop: 92,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                padding: "18px 24px",
                background: "rgba(255,248,236,0.95)",
                color: C.ink,
                borderRadius: 12,
                fontFamily: FONT,
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "-0.01em",
                transform: "rotate(-2deg)",
                boxShadow: "0 24px 60px rgba(0,0,0,0.3)",
              }}
            >
              The internet called it a purse.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              bottom: 300,
              fontFamily: FONT,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.17em",
              color: "rgba(255,255,255,0.52)",
              lineHeight: 1.7,
              textTransform: "uppercase",
            }}
          >
            SOURCE: WALMART CORPORATE, AUG 31 2026 · MARKETING BREW, OCT 8 2026
          </div>
        </AbsoluteFill>
        <Sweep start={10.9} duration={1.1} opacity={0.22} />
      </AbsoluteFill>

      {/* ---------- 16.9 – 20 : Walmart listened ---------- */}
      <AbsoluteFill
        style={{
          zIndex: 30,
          opacity: 1,
          transform: `translateY(${(1 - toListen) * 100}%)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(155deg, ${C.yellow} 0%, #F6A623 58%, ${C.orange} 100%)`,
            borderTop: "6px solid rgba(255,255,255,0.65)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 42%, transparent 24%, rgba(180,83,31,0.18) 76%, rgba(120,50,10,0.34) 100%)",
          }}
        />
        <AbsoluteFill
          style={{
            padding: "160px 62px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Reveal start={12.8} scaleFrom={0.7}>
            <div
              style={{
                width: 156,
                height: 156,
                borderRadius: 99,
                background: C.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
              }}
            >
              <Spark size={82} />
            </div>
          </Reveal>
          <div style={{ height: 34 }} />
          <MaskLine start={12.95} duration={0.55}>
            <Display size={96} color={C.ink} style={{ textAlign: "center" }}>
              WALMART
            </Display>
          </MaskLine>
          <MaskLine start={13.08} duration={0.55}>
            <Display size={96} color={C.ink} style={{ textAlign: "center" }}>
              LISTENED.
            </Display>
          </MaskLine>
          <Reveal start={13.4} style={{ marginTop: 28 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 600,
                letterSpacing: "0.17em",
                color: "rgba(7,24,47,0.72)",
                textTransform: "uppercase",
                textAlign: "center",
                maxWidth: 760,
                lineHeight: 1.5,
              }}
            >
              Instead of ignoring the joke, the brand made it real.
            </div>
          </Reveal>
        </AbsoluteFill>
        <AbsoluteFill
          style={{
            zIndex: 60,
            background: C.yellow,
            opacity: progress(t, 10.36, 0.05, easeOut) * (1 - progress(t, 10.5, 0.22, easeIn)),
            pointerEvents: "none",
          }}
        />
      </AbsoluteFill>
    </Stage>
  );
};
