import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, IMG } from "../../../config/walmartChicken";
import {
  Display,
  Dot,
  Grain,
  Halftone,
  MaskLine,
  Photo,
  PhotoCard,
  Pill,
  Reveal,
  Spark,
  Stage,
  Sweep,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../../presets/editorialPop/kit";

export const Scene06Ending: React.FC = () => {
  const { t } = useTime();

  const toJoke = progress(t, 3.9, 0.6, easeInOut);
  const toLesson = progress(t, 6.2, 0.7, easeInOut);
  const toCta = progress(t, 8.0, 0.6, easeOut);
  const fade = 1 - progress(t, 9.55, 0.45, easeInOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.blueInk, overflow: "hidden", opacity: fade }}>
      {/* ================= PRODUCT HERO ================= */}
      <AbsoluteFill
        style={{
          opacity: 1 - toJoke,
          transform: `scale(${1 + toJoke * 0.06})`,
        }}
      >
        <Photo
          src={IMG.lead}
          start={0}
          duration={4.6}
          scaleFrom={1.18}
          scaleTo={1.0}
          grade="vivid"
          objectPosition="50% 46%"
          overlay="linear-gradient(180deg, rgba(4,30,66,0.86) 0%, rgba(4,30,66,0.42) 38%, rgba(4,30,66,0.95) 100%)"
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(75,42,138,0.24), transparent 38%, rgba(224,122,47,0.18))",
            mixBlendMode: "screen",
          }}
        />

        <AbsoluteFill style={{ padding: "128px 56px", zIndex: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Spark size={34} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: C.white,
              }}
            >
              THE TAKEAWAY
            </span>
          </div>

          <div style={{ marginTop: 92 }}>
            <MaskLine start={0.2} duration={0.58}>
              <Display size={80} color={C.white}>
                SOMETIMES, YOUR
              </Display>
            </MaskLine>
            <MaskLine start={0.31} duration={0.58}>
              <Display size={80} color={C.white}>
                NEXT BIG PRODUCT
              </Display>
            </MaskLine>
            <MaskLine start={0.42} duration={0.58}>
              <Display size={80} color={C.white}>
                ISN'T HIDING
              </Display>
            </MaskLine>
            <MaskLine start={0.53} duration={0.58}>
              <Display
                size={80}
                color={C.yellow}
                style={{
                  background: "rgba(4,30,66,0.78)",
                  padding: "0.04em 0.12em 0.08em",
                  borderRadius: 8,
                  display: "inline-block",
                }}
              >
                IN A BOARDROOM.
              </Display>
            </MaskLine>
          </div>

          <Reveal start={1.15} y={16} style={{ marginTop: 30 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "0.04em",
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.45,
                maxWidth: 760,
              }}
            >
              It was already in the comment section.
            </div>
          </Reveal>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 54,
            right: 54,
            bottom: 300,
            zIndex: 14,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <PhotoCard
            src={IMG.purseTraditional}
            width={760}
            height={400}
            start={1.4}
            rotate={-2.5}
            radius={20}
            grade="vivid"
            scaleFrom={1.16}
            scaleTo={1.02}
            label="THE PRODUCT"
            labelColor={C.blueInk}
          />
        </div>
        <Sweep start={1.2} duration={1.4} opacity={0.2} />
      </AbsoluteFill>

      {/* ================= THE JOKE ================= */}
      <AbsoluteFill
        style={{
          opacity: toJoke * (1 - toLesson),
          transform: `translateY(${(1 - toJoke) * 120}px)`,
        }}
      >
        <Stage variant="orange" accent={C.yellow} accent2={C.purple} glowX="50%" glowY="30%">
          <div style={{ position: "absolute", left: 58, top: 122, zIndex: 10 }}>
            <Pill color={C.ink} style={{ background: C.yellow, fontSize: 12 }}>
              <Dot color={C.red} size={8} /> THE REAL INSIGHT
            </Pill>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 300,
              textAlign: "center",
              zIndex: 12,
            }}
          >
            <MaskLine start={4.0} duration={0.55}>
              <Display size={98} color={C.white} style={{ textAlign: "center" }}>
                IT'S HIDING
              </Display>
            </MaskLine>
            <MaskLine start={4.12} duration={0.55}>
              <Display size={98} color={C.white} style={{ textAlign: "center" }}>
                INSIDE A
              </Display>
            </MaskLine>
            <MaskLine start={4.24} duration={0.6}>
              <Display
                size={108}
                color={C.ink}
                style={{
                  textAlign: "center",
                  background: C.yellow,
                  padding: "0.04em 0.1em 0.07em",
                  borderRadius: 12,
                  boxShadow: "0 24px 70px rgba(0,0,0,0.28)",
                }}
              >
                CUSTOMER JOKE.
              </Display>
            </MaskLine>
            <Reveal start={4.65} y={14} style={{ marginTop: 28 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 19,
                  fontWeight: 600,
                  letterSpacing: "0.17em",
                  color: "rgba(255,255,255,0.78)",
                  textTransform: "uppercase",
                }}
              >
                YOU JUST HAVE TO LISTEN.
              </div>
            </Reveal>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              bottom: 300,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PhotoCard
              src={IMG.purseLemon}
              width={760}
              height={400}
              start={4.35}
              rotate={2.6}
              radius={20}
              grade="vivid"
              scaleFrom={1.18}
              scaleTo={1.02}
              label="LEMON PEPPER"
              labelColor={C.orangeDeep}
            />
          </div>
        </Stage>
      </AbsoluteFill>

      {/* ================= THE LESSON ================= */}
      <AbsoluteFill
        style={{
          opacity: toLesson,
          transform: `scale(${lerp(1.12, 1, toLesson)})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(160deg, ${C.blue} 0%, ${C.blueDeep} 58%, #001B45 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-20%",
            right: "-20%",
            top: "16%",
            height: 1200,
            background: `conic-gradient(from ${t * 12}deg at 50% 50%, rgba(255,194,32,0.22), transparent 18%, rgba(75,42,138,0.24) 34%, transparent 55%, rgba(255,194,32,0.18) 72%, transparent 88%)`,
            filter: "blur(34px)",
            opacity: 0.8,
          }}
        />
        <Halftone color="rgba(255,255,255,0.24)" opacity={0.22} />

        <AbsoluteFill
          style={{
            padding: "150px 58px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            zIndex: 10,
          }}
        >
          <Reveal start={6.35} scaleFrom={0.7}>
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 99,
                background: C.blue,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 26px 70px rgba(0,0,0,0.26)",
              }}
            >
              <Spark size={78} />
            </div>
          </Reveal>

          <div style={{ height: 40 }} />
          <MaskLine start={6.5} duration={0.62}>
            <Display size={104} color={C.white} style={{ textAlign: "center" }}>
              LISTEN TO
            </Display>
          </MaskLine>
          <MaskLine start={6.62} duration={0.62}>
            <Display size={104} color={C.yellow} style={{ textAlign: "center" }}>
              YOUR CUSTOMERS.
            </Display>
          </MaskLine>

          <Reveal start={7.0} y={18} style={{ marginTop: 30 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.68)",
                textTransform: "uppercase",
                maxWidth: 780,
                lineHeight: 1.55,
              }}
            >
              THE NEXT BIG IDEA IS ALREADY IN THE COMMENTS.
            </div>
          </Reveal>

          <div style={{ height: 56 }} />

          <div
            style={{
              opacity: toCta,
              transform: `translateY(${(1 - toCta) * 26}px)`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "18px 26px",
                borderRadius: 99,
                background: C.white,
                color: C.blueInk,
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.01em",
                boxShadow: "0 28px 60px rgba(0,0,0,0.28)",
              }}
            >
              <span style={{ fontSize: 24 }}>💬</span>
              {COPY.cta}
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 12,
              opacity: toCta * 0.9,
            }}
          >
            <Pill color={C.white} style={{ background: "rgba(255,255,255,0.12)", fontSize: 12 }}>
              $5.97
            </Pill>
            <Pill color={C.white} style={{ background: "rgba(255,255,255,0.12)", fontSize: 12 }}>
              90 MINUTES
            </Pill>
            <Pill color={C.white} style={{ background: "rgba(255,255,255,0.12)", fontSize: 12 }}>
              5,000 UNITS
            </Pill>
          </div>
        </AbsoluteFill>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 82,
            textAlign: "center",
            fontFamily: FONT,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.22em",
            color: "rgba(255,255,255,0.38)",
            textTransform: "uppercase",
            zIndex: 20,
          }}
        >
          A SIMPLEDEAV CASE STUDY · SOURCES: WALMART · MARKETING BREW
        </div>
      </AbsoluteFill>

      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
