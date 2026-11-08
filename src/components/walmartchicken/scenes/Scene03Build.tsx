import type { CSSProperties, ReactNode } from "react";
import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, IMG } from "../../../config/walmartChicken";
import {
  Display,
  Headline,
  Kicker,
  MaskLine,
  Photo,
  PhotoCard,
  PurseSketch,
  Reveal,
  Spark,
  Stage,
  Sweep,
  Tag,
  easeIn,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../../presets/editorialPop/kit";

const Sticky: React.FC<{
  children: ReactNode;
  background: string;
  color: string;
  rotate: number;
  start: number;
  style?: CSSProperties;
}> = ({ children, background, color, rotate, start, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.55, easeOut);
  return (
    <div
      style={{
        width: 250,
        minHeight: 220,
        padding: "26px 22px",
        background,
        color,
        boxShadow: "0 18px 42px rgba(0,0,0,0.2)",
        transform: `rotate(${rotate}deg) translateY(${(1 - p) * 30}px) scale(${lerp(0.9, 1, p)})`,
        opacity: p,
        fontFamily: FONT,
        fontSize: 30,
        fontWeight: 700,
        lineHeight: 1.12,
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        display: "flex",
        alignItems: "flex-end",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const SpecChip: React.FC<{
  label: string;
  value: string;
  color: string;
  start: number;
  style?: CSSProperties;
}> = ({ label, value, color, start, style }) => (
  <Reveal start={start} y={22} style={style}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "16px 18px",
        borderRadius: 10,
        background: "rgba(7,24,47,0.62)",
        border: "1px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: 99,
          background: color,
          boxShadow: `0 0 16px ${color}`,
          flexShrink: 0,
        }}
      />
      <div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.56)",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 19,
            fontWeight: 700,
            letterSpacing: "0.02em",
            color: C.white,
            marginTop: 3,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  </Reveal>
);

export const Scene03Build: React.FC = () => {
  const { t } = useTime();

  const toSpec = progress(t, 4.0, 0.52, easeInOut);
  const toSketch = progress(t, 8.45, 0.52, easeInOut);
  const toFabric = progress(t, 11.4, 0.45, easeInOut);
  const toFlavors = progress(t, 13.3, 0.45, easeInOut);
  const stitch = progress(t, 12.1, 1.4, easeInOut);

  return (
    <AbsoluteFill style={{ backgroundColor: C.blueInk }}>
      {/* ================= 20.0 – 24.0  THE BRAINSTORM ================= */}
      <AbsoluteFill style={{ opacity: 1 - toSpec, transform: `scale(${1 + toSpec * 0.08})` }}>
        <Stage variant="cream" accent={C.yellow} accent2={C.purple} glowX="70%" glowY="24%">
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(7,24,47,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(7,24,47,0.055) 1px, transparent 1px)",
              backgroundSize: "52px 52px",
              maskImage: "linear-gradient(180deg, black 0%, rgba(0,0,0,0.38) 80%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(180deg, black 0%, rgba(0,0,0,0.38) 80%, transparent 100%)",
            }}
          />

          <div style={{ position: "absolute", left: 58, top: 124, zIndex: 10 }}>
            <Kicker start={0.08} color={C.purple} rule={C.purple}>
              THE MARKETING ROOM
            </Kicker>
          </div>

          <div style={{ position: "absolute", left: 54, top: 250, zIndex: 10 }}>
            <Headline
              lines={COPY.decisionHead}
              size={104}
              start={0.18}
              color={C.blueInk}
              highlight={C.yellow}
              highlightColor={C.blueInk}
              stagger={0.1}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 60,
              top: 740,
              width: 560,
              display: "flex",
              flexWrap: "wrap",
              gap: 22,
              zIndex: 11,
            }}
          >
            <Sticky background={C.yellow} color={C.ink} rotate={-4} start={0.55}>
              A PURSE?
            </Sticky>
            <Sticky background={C.purpleLight} color={C.white} rotate={3} start={0.7}>
              SAME BAG
            </Sticky>
            <Sticky background={C.orange} color={C.white} rotate={2.5} start={0.86}>
              ADD A STRAP
            </Sticky>
            <Sticky background={C.blue} color={C.white} rotate={-3} start={1.02}>
              WHY NOT?
            </Sticky>
          </div>

          <div
            style={{
              position: "absolute",
              right: -76,
              top: 1180,
              width: 620,
              zIndex: 12,
              transform: "rotate(-4deg)",
            }}
          >
            <PhotoCard
              src={IMG.purseTraditional}
              width={620}
              height={348}
              start={1.15}
              rotate={-4}
              radius={18}
              label="THE JOKE"
              labelColor={C.blueInk}
              grade="vivid"
              scaleFrom={1.12}
              scaleTo={1.02}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 60,
              top: 596,
              zIndex: 14,
              maxWidth: 600,
            }}
          >
            <Reveal start={1.55} y={20}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 25,
                  fontWeight: 600,
                  lineHeight: 1.38,
                  letterSpacing: "-0.015em",
                  color: "rgba(7,24,47,0.76)",
                }}
              >
                A silly idea in an average day. The social team took it to merchandising.
              </div>
            </Reveal>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              bottom: 300,
              display: "flex",
              gap: 12,
              zIndex: 14,
            }}
          >
            <Tag start={1.75} color={C.blueInk} background="rgba(255,255,255,0.72)" border="1px solid rgba(7,24,47,0.12)">
              REAL PRODUCT IDEA
            </Tag>
            <Tag start={1.9} color={C.blueInk} background="rgba(255,255,255,0.72)" border="1px solid rgba(7,24,47,0.12)">
              NO BOARDROOM DECK
            </Tag>
          </div>
        </Stage>
      </AbsoluteFill>

      {/* ================= 24.0 – 28.5  THE PACKAGING ================= */}
      <AbsoluteFill
        style={{
          opacity: toSpec * (1 - toSketch),
          transform: `translateX(${(1 - toSpec) * 160}px)`,
        }}
      >
        <Photo
          src={IMG.bagPrint}
          start={0}
          duration={5}
          scaleFrom={1.24}
          scaleTo={1.0}
          grade="vivid"
          objectPosition="48% 44%"
          overlay="linear-gradient(180deg, rgba(4,30,66,0.84) 0%, rgba(4,30,66,0.24) 38%, rgba(4,30,66,0.92) 100%)"
        />

        <AbsoluteFill style={{ padding: "124px 58px", zIndex: 12 }}>
          <Kicker start={4.1} color={C.yellow}>
            THE PACKAGING BECAME THE BLUEPRINT
          </Kicker>
          <div style={{ marginTop: 44 }}>
            <Headline
              lines={COPY.specHead}
              size={94}
              start={4.2}
              color={C.white}
              highlight={C.yellow}
              highlightColor={C.ink}
              stagger={0.11}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 58,
              right: 58,
              bottom: 280,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <SpecChip label="TYPEFACE" value="STRAIGHT FROM THE BAG" color={C.yellow} start={4.8} />
            <SpecChip label="COLOR" value="TRADITIONAL PURPLE / LEMON PEPPER ORANGE" color={C.purpleLight} start={4.98} />
            <SpecChip label="PRINT" value="THE SAME ROTISSERIE CHICKEN" color={C.orange} start={5.16} />
          </div>

          <div
            style={{
              position: "absolute",
              right: 58,
              top: 720,
              width: 340,
              padding: "18px 20px",
              background: "rgba(255,248,236,0.94)",
              color: C.ink,
              borderRadius: 12,
              transform: "rotate(3deg)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.28)",
              fontFamily: FONT,
              fontSize: 17,
              fontWeight: 600,
              lineHeight: 1.4,
              zIndex: 14,
            }}
          >
            “Send production the exact specs. Mimic the look exactly.”
            <div
              style={{
                marginTop: 10,
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "0.14em",
                color: "rgba(7,24,47,0.48)",
              }}
            >
              PARAPHRASED FROM MARKETING BREW
            </div>
          </div>
        </AbsoluteFill>
        <Sweep start={4.9} duration={1.2} opacity={0.22} />
      </AbsoluteFill>

      {/* ================= 28.5 – 33.3  THE SKETCH ================= */}
      <AbsoluteFill
        style={{
          opacity: toSketch * (1 - toFabric),
          transform: `translateY(${(1 - toSketch) * 120}px)`,
        }}
      >
        <Stage variant="night" accent={C.yellow} accent2={C.purpleLight} glowX="34%" glowY="44%">
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          <div style={{ position: "absolute", left: 58, top: 124, zIndex: 10 }}>
            <Kicker start={8.5} color={C.yellow}>
              SKETCH → SAMPLE → PRODUCT
            </Kicker>
            <div style={{ marginTop: 22 }}>
              <MaskLine start={8.6} duration={0.6}>
                <Display size={86} color={C.white}>
                  THE SPEC
                </Display>
              </MaskLine>
              <MaskLine start={8.72} duration={0.6}>
                <Display size={86} color={C.white}>
                  BECAME A
                </Display>
              </MaskLine>
              <MaskLine start={8.84} duration={0.6}>
                <Display size={86} color={C.yellow}>
                  PRODUCT.
                </Display>
              </MaskLine>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 50,
              right: 50,
              top: 610,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <PurseSketch
              start={9.0}
              width={720}
              color="rgba(255,248,236,0.92)"
              accent={C.yellow}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 58,
              bottom: 280,
              display: "flex",
              gap: 10,
              zIndex: 14,
            }}
          >
            <Tag start={10.1} color={C.white} background="rgba(7,24,47,0.6)">
              TRADITIONAL · PURPLE
            </Tag>
            <Tag start={10.25} color={C.white} background="rgba(7,24,47,0.6)">
              LEMON PEPPER · ORANGE
            </Tag>
            <Tag start={10.4} color={C.ink} background={C.yellow} border="none">
              ADD STRAP
            </Tag>
          </div>

          <div
            style={{
              position: "absolute",
              right: 60,
              top: 300,
              fontFamily: FONT,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.18em",
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.9,
              textAlign: "right",
              textTransform: "uppercase",
            }}
          >
            ILLUSTRATIVE DESIGN SKETCH
            <br />
            NOT AN OFFICIAL WALMART DRAWING
          </div>
        </Stage>
      </AbsoluteFill>

      {/* ================= 33.3 – 36.9  MATERIAL ================= */}
      <AbsoluteFill
        style={{
          opacity: toFabric * (1 - toFlavors),
          transform: `translateX(${(1 - toFabric) * -140}px)`,
        }}
      >
        <Stage variant="orange" accent={C.yellow} accent2={C.purple} glowX="66%" glowY="26%">
          <AbsoluteFill style={{ padding: "120px 56px" }}>
            <Kicker start={11.45} color={C.cream} rule={C.white}>
              PROTOTYPE MATERIAL
            </Kicker>
            <div style={{ marginTop: 28 }}>
              <Headline
                lines={COPY.fabricHead}
                size={82}
                start={11.55}
                color={C.white}
                highlight={C.yellow}
                highlightColor={C.ink}
                stagger={0.1}
              />
            </div>

            <div style={{ position: "absolute", left: 56, top: 620, display: "flex", gap: 18 }}>
              <PhotoCard
                src={IMG.needle}
                width={470}
                height={610}
                start={11.9}
                rotate={-2.5}
                grade="warm"
                label="STITCH"
                scaleFrom={1.12}
                scaleTo={1}
              />
              <PhotoCard
                src={IMG.purseTraditional}
                width={470}
                height={610}
                start={12.05}
                rotate={2.2}
                grade="vivid"
                label="PRINT"
                scaleFrom={1.18}
                scaleTo={1.02}
              />
            </div>

            <svg
              width={960}
              height={90}
              viewBox="0 0 960 90"
              style={{ position: "absolute", left: 56, top: 1270, zIndex: 20 }}
            >
              <path
                d="M10 52 Q160 8 320 52 T640 52 T950 52"
                fill="none"
                stroke={C.yellow}
                strokeWidth={5}
                strokeDasharray="18 14"
                strokeLinecap="round"
                strokeDashoffset={900 * (1 - stitch)}
              />
            </svg>

            <div
              style={{
                position: "absolute",
                left: 56,
                top: 1380,
                display: "flex",
                gap: 10,
              }}
            >
              <Tag start={12.3} color={C.ink} background={C.cream} border="none">
                PRINTED FABRIC
              </Tag>
              <Tag start={12.45} color={C.ink} background={C.cream} border="none">
                ZIPPER
              </Tag>
              <Tag start={12.6} color={C.ink} background={C.cream} border="none">
                STRAP
              </Tag>
            </div>
          </AbsoluteFill>
        </Stage>
      </AbsoluteFill>

      {/* ================= 36.9 – 40.0  TWO FLAVORS ================= */}
      <AbsoluteFill
        style={{
          opacity: toFlavors,
          transform: `translateY(${(1 - toFlavors) * 100}px)`,
        }}
      >
        <Stage variant="purple" accent={C.yellow} accent2={C.orange} glowX="50%" glowY="30%">
          <div style={{ position: "absolute", left: 56, top: 118, zIndex: 10 }}>
            <Kicker start={13.35} color={C.yellow}>
              TWO FLAVORS · TWO TRIMS
            </Kicker>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 220,
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <MaskLine start={13.45} duration={0.55}>
              <Display size={150} color={C.white} style={{ textAlign: "center" }}>
                TWO
              </Display>
            </MaskLine>
            <MaskLine start={13.56} duration={0.55}>
              <Display size={150} color={C.yellow} style={{ textAlign: "center" }}>
                FLAVORS.
              </Display>
            </MaskLine>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 610,
              display: "flex",
              gap: 24,
              justifyContent: "center",
            }}
          >
            <div style={{ transform: "rotate(-3.5deg)" }}>
              <PhotoCard
                src={IMG.purseTraditional}
                width={462}
                height={556}
                start={13.7}
                rotate={-3.5}
                radius={20}
                border="5px solid rgba(255,248,236,0.9)"
                label="TRADITIONAL"
                labelColor={C.purple}
                grade="vivid"
                scaleFrom={1.22}
                scaleTo={1.02}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    padding: "8px 11px",
                    background: C.purple,
                    color: C.white,
                    borderRadius: 4,
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}
                >
                  PURPLE TRIM
                </div>
              </PhotoCard>
            </div>
            <div style={{ transform: "rotate(3.2deg) translateY(40px)" }}>
              <PhotoCard
                src={IMG.purseLemon}
                width={462}
                height={556}
                start={13.85}
                rotate={3.2}
                radius={20}
                border="5px solid rgba(255,248,236,0.9)"
                label="LEMON PEPPER"
                labelColor={C.orangeDeep}
                grade="vivid"
                scaleFrom={1.22}
                scaleTo={1.02}
              >
                <div
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 16,
                    padding: "8px 11px",
                    background: C.orange,
                    color: C.white,
                    borderRadius: 4,
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}
                >
                  ORANGE TRIM
                </div>
              </PhotoCard>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 290,
              display: "flex",
              justifyContent: "center",
              zIndex: 14,
            }}
          >
            <Reveal start={14.4} y={16}>
              <div
                style={{
                  padding: "16px 24px",
                  background: C.yellow,
                  color: C.ink,
                  borderRadius: 10,
                  fontFamily: FONT,
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "0.02em",
                  transform: "rotate(-2deg)",
                  boxShadow: "0 22px 54px rgba(0,0,0,0.28)",
                }}
              >
                Not a chicken. A purse.
              </div>
            </Reveal>
          </div>

          <div
            style={{
              position: "absolute",
              right: 56,
              top: 120,
              zIndex: 12,
            }}
          >
            <Spark size={62} />
          </div>
        </Stage>
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          zIndex: 80,
          background: C.yellow,
          transform: `translateX(${-112 + progress(t, 19.55, 0.4, easeIn) * 112}%) skewX(-7deg)`,
          width: "120%",
        }}
      />
    </AbsoluteFill>
  );
};
