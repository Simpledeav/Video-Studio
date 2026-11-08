import { AbsoluteFill, Img } from "remotion";
import { C, COPY, FONT, IMG } from "../../../config/walmartChicken";
import {
  Display,
  Kicker,
  LuxuryBag,
  MaskLine,
  PhotoCard,
  PriceTag,
  Receipt,
  Reveal,
  Spark,
  Stage,
  Sweep,
  Tag,
  easeIn,
  easeInOut,
  easeOut,
  file,
  progress,
  useTime,
} from "../../presets/editorialPop/kit";

export const Scene04Price: React.FC = () => {
  const { t } = useTime();

  const toCompare = progress(t, 4.2, 0.5, easeInOut);
  const toReceipt = progress(t, 6.2, 0.45, easeInOut);
  const toCharms = progress(t, 11.2, 0.45, easeInOut);
  const units = Math.round(5000 * progress(t, 8.4, 1.4, easeOut));
  const dropOn = t >= 8.2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.blueInk }}>
      {/* ================= PRICE REVEAL ================= */}
      <AbsoluteFill
        style={{
          opacity: 1 - toCompare,
          transform: `scale(${1 + toCompare * 0.07})`,
        }}
      >
        <Stage variant="blue" accent={C.yellow} accent2={C.orange} glowX="50%" glowY="30%">
          <div style={{ position: "absolute", left: 58, top: 120, zIndex: 10 }}>
            <Kicker start={0.05} color={C.yellow}>
              {COPY.priceHead}
            </Kicker>
          </div>

          <div
            style={{
              position: "absolute",
              right: 58,
              top: 112,
              display: "flex",
              alignItems: "center",
              gap: 8,
              opacity: progress(t, 0.2, 0.4),
            }}
          >
            <Spark size={38} />
            <span
              style={{
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.22em",
                color: C.white,
              }}
            >
              SPARK SHOP
            </span>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 270,
              display: "flex",
              justifyContent: "center",
              zIndex: 12,
            }}
          >
            <PriceTag value="$5.97" start={0.18} size={236} rotate="-7deg" />
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 610,
              textAlign: "center",
              zIndex: 12,
            }}
          >
            <MaskLine start={0.55} duration={0.58}>
              <Display size={78} color={C.white} style={{ textAlign: "center" }}>
                SAME PRICE
              </Display>
            </MaskLine>
            <MaskLine start={0.68} duration={0.58}>
              <Display size={78} color={C.yellow} style={{ textAlign: "center" }}>
                AS THE CHICKEN.
              </Display>
            </MaskLine>
            <Reveal start={0.95} y={14} style={{ marginTop: 20 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 17,
                  fontWeight: 600,
                  letterSpacing: "0.18em",
                  color: "rgba(255,255,255,0.66)",
                  textTransform: "uppercase",
                }}
              >
                THE SAME $5.97. ON PURPOSE.
              </div>
            </Reveal>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 910,
              display: "flex",
              justifyContent: "center",
              zIndex: 14,
            }}
          >
            <PhotoCard
              src={IMG.lead}
              width={860}
              height={430}
              start={0.7}
              rotate={2.4}
              radius={20}
              grade="vivid"
              scaleFrom={1.16}
              scaleTo={1.02}
              label="TWO FLAVORS · $5.97 EACH"
              labelColor={C.blueInk}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 1390,
              display: "flex",
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Tag start={1.0} color={C.ink} background={C.yellow} border="none">
              5,000 MADE
            </Tag>
            <Tag start={1.12} color={C.white} background="rgba(7,24,47,0.46)">
              2 FLAVORS
            </Tag>
            <Tag start={1.24} color={C.white} background="rgba(7,24,47,0.46)">
              ADDED STRAP
            </Tag>
          </div>
        </Stage>
        <Sweep start={0.4} duration={1.4} opacity={0.26} />
      </AbsoluteFill>

      {/* ================= COMPARISON ================= */}
      <AbsoluteFill
        style={{
          opacity: toCompare * (1 - toReceipt),
          transform: `translateY(${(1 - toCompare) * 100}px)`,
        }}
      >
        <Stage variant="cream" accent={C.purple} accent2={C.yellow} glowX="50%" glowY="22%">
          <div style={{ position: "absolute", left: 58, top: 116, zIndex: 10 }}>
            <Kicker start={4.25} color={C.blue} rule={C.orange}>
              THE OBVIOUS COMPARISON
            </Kicker>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 200,
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <MaskLine start={4.35} duration={0.55}>
              <Display size={70} color={C.blueInk} style={{ textAlign: "center" }}>
                SAME ENERGY.
              </Display>
            </MaskLine>
            <MaskLine start={4.46} duration={0.55}>
              <Display size={70} color={C.orangeDeep} style={{ textAlign: "center" }}>
                DIFFERENT BUDGET.
              </Display>
            </MaskLine>
          </div>

          {/* luxury card */}
          <div
            style={{
              position: "absolute",
              left: 58,
              right: 58,
              top: 430,
              height: 430,
              borderRadius: 22,
              background: "linear-gradient(150deg, #1D1D1D 0%, #090909 100%)",
              boxShadow: "0 30px 70px rgba(0,0,0,0.28)",
              overflow: "hidden",
              transform: `translateX(${(1 - progress(t, 4.6, 0.6, easeOut)) * -90}px)`,
              opacity: progress(t, 4.6, 0.5),
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "radial-gradient(circle at 50% 38%, rgba(199,163,90,0.22), transparent 54%)",
              }}
            />
            <div style={{ position: "absolute", left: 30, top: 28 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                THE STATUS BAG
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: C.white,
                  marginTop: 7,
                }}
              >
                LUXURY PRICE
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: 40,
                top: 92,
                transform: "rotate(6deg)",
              }}
            >
              <LuxuryBag width={340} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 30,
                bottom: 28,
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.17em",
                color: "rgba(255,255,255,0.42)",
                textTransform: "uppercase",
              }}
            >
              QUIET. EXPENSIVE. EVERYWHERE.
            </div>
          </div>

          {/* vs */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 842,
              display: "flex",
              justifyContent: "center",
              zIndex: 20,
            }}
          >
            <Reveal start={4.8} scaleFrom={0.5}>
              <div
                style={{
                  width: 92,
                  height: 92,
                  borderRadius: 99,
                  background: C.blue,
                  color: C.white,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: FONT,
                  fontSize: 31,
                  fontWeight: 800,
                  boxShadow: "0 14px 34px rgba(0,0,0,0.24)",
                  border: "4px solid rgba(255,255,255,0.9)",
                }}
              >
                VS
              </div>
            </Reveal>
          </div>

          {/* chicken card */}
          <div
            style={{
              position: "absolute",
              left: 58,
              right: 58,
              top: 910,
              height: 430,
              borderRadius: 22,
              background: C.cream,
              boxShadow: "0 30px 70px rgba(0,0,0,0.22)",
              overflow: "hidden",
              transform: `translateX(${(1 - progress(t, 4.55, 0.6, easeOut)) * 90}px)`,
              opacity: progress(t, 4.55, 0.5),
            }}
          >
            <div style={{ position: "absolute", left: 30, top: 26, zIndex: 4 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  color: "rgba(7,24,47,0.46)",
                }}
              >
                THE PEOPLE'S BAG
              </div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 32,
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: C.ink,
                  marginTop: 7,
                }}
              >
                $5.97
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: -30,
                top: 26,
                width: 430,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  top: 42,
                  width: 400,
                  height: 316,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "3px solid rgba(255,255,255,0.92)",
                  boxShadow: "0 22px 50px rgba(0,0,0,0.22)",
                  transform: "rotate(3deg)",
                }}
              >
                <Img
                  src={file(IMG.purseTraditional)}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 44%" }}
                />
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                left: 30,
                bottom: 26,
                fontFamily: FONT,
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: "rgba(7,24,47,0.5)",
                textTransform: "uppercase",
              }}
            >
              LOUD. FUNNY. SOLD OUT.
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 280,
              display: "flex",
              justifyContent: "center",
              zIndex: 24,
            }}
          >
            <Reveal start={4.95} y={12}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 17,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: "rgba(7,24,47,0.82)",
                  textTransform: "uppercase",
                }}
              >
                IT WAS NEVER TRYING TO BE QUIET.
              </div>
            </Reveal>
          </div>
        </Stage>
      </AbsoluteFill>

      {/* ================= RECEIPT ================= */}
      <AbsoluteFill
        style={{
          opacity: toReceipt * (dropOn ? 0 : 1),
          transform: `translateY(${(1 - toReceipt) * 80}px)`,
        }}
      >
        <Stage variant="night" accent={C.yellow} accent2={C.orange} glowX="50%" glowY="40%">
          <div style={{ position: "absolute", left: 58, top: 118, zIndex: 10 }}>
            <Kicker start={6.25} color={C.yellow}>
              THE RECEIPT DIDN'T CHANGE
            </Kicker>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 200,
              textAlign: "center",
              zIndex: 10,
            }}
          >
            <MaskLine start={6.35} duration={0.5}>
              <Display size={84} color={C.white} style={{ textAlign: "center" }}>
                ONE IS A
              </Display>
            </MaskLine>
            <MaskLine start={6.46} duration={0.5}>
              <Display size={84} color={C.yellow} style={{ textAlign: "center" }}>
                CHICKEN.
              </Display>
            </MaskLine>
            <MaskLine start={6.57} duration={0.5}>
              <Display size={84} color={C.white} style={{ textAlign: "center" }}>
                ONE IS A PURSE.
              </Display>
            </MaskLine>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 620,
              display: "flex",
              justifyContent: "center",
              zIndex: 15,
            }}
          >
            <Receipt start={6.3} />
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 300,
              display: "flex",
              justifyContent: "center",
              zIndex: 16,
            }}
          >
            <Reveal start={6.8} y={14}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 20px",
                  background: C.yellow,
                  color: C.ink,
                  borderRadius: 6,
                  fontFamily: FONT,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "0.04em",
                  transform: "rotate(-2deg)",
                }}
              >
                <Spark size={24} /> SAME $5.97. SAME JOY.
              </div>
            </Reveal>
          </div>
        </Stage>
      </AbsoluteFill>

      {/* ================= 5,000 + CHARMS ================= */}
      <AbsoluteFill
        style={{
          opacity: dropOn ? 1 : 0,
          transform: `translateX(0px)`,
        }}
      >
        <Stage variant="purple" accent={C.yellow} accent2={C.orange} glowX="56%" glowY="24%">
          <div style={{ position: "absolute", left: 58, top: 118, zIndex: 10 }}>
            <Kicker start={8.25} color={C.yellow}>
              LIMITED EDITION · SEPT 1
            </Kicker>
          </div>

          <div style={{ position: "absolute", left: 58, top: 230, zIndex: 10 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 190,
                fontWeight: 800,
                lineHeight: 0.8,
                letterSpacing: "-0.08em",
                color: C.white,
                transform: `scale(${0.94 + progress(t, 8.4, 1.2, easeOut) * 0.06})`,
              }}
            >
              {units.toLocaleString("en-US")}
            </div>
            <MaskLine start={8.35} duration={0.48}>
              <Display size={72} color={C.yellow}>
                PURSES.
              </Display>
            </MaskLine>
            <div
              style={{
                marginTop: 18,
                fontFamily: FONT,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "0.19em",
                color: "rgba(255,255,255,0.72)",
                textTransform: "uppercase",
              }}
            >
              ONE DROP · 8 A.M. ET
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 720,
              display: "flex",
              justifyContent: "center",
              zIndex: 14,
            }}
          >
            <div style={{ opacity: 1 - toCharms, transform: `scale(${1 - toCharms * 0.04})` }}>
              <PhotoCard
                src={IMG.purseLemon}
                width={720}
                height={404}
                start={8.5}
                rotate={2.2}
                grade="vivid"
                label="LEMON PEPPER · $5.97"
                labelColor={C.orangeDeep}
                scaleFrom={1.16}
                scaleTo={1.02}
              />
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1170,
              textAlign: "center",
              zIndex: 15,
              opacity: 1 - toCharms,
            }}
          >
            <MaskLine start={8.9} duration={0.48}>
              <Display size={54} color={C.white} style={{ textAlign: "center" }}>
                PLUS MATCHING BAG CHARMS.
              </Display>
            </MaskLine>
            <div
              style={{
                marginTop: 12,
                fontFamily: FONT,
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: "0.16em",
                color: "rgba(255,255,255,0.62)",
                textTransform: "uppercase",
              }}
            >
              BECAUSE OF COURSE.
            </div>
          </div>

          <AbsoluteFill
            style={{
              opacity: toCharms,
              transform: `translateY(${(1 - toCharms) * 60}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 54,
                right: 54,
                top: 760,
                display: "flex",
                gap: 18,
                justifyContent: "center",
              }}
            >
              <PhotoCard
                src={IMG.charmTraditional}
                width={456}
                height={440}
                start={11.3}
                rotate={-4}
                grade="vivid"
                label="CHICKEN CHARM"
                labelColor={C.purple}
                scaleFrom={1.14}
                scaleTo={1.02}
              />
              <PhotoCard
                src={IMG.charmLemon}
                width={456}
                height={440}
                start={11.45}
                rotate={4}
                grade="vivid"
                label="LEMON CHARM"
                labelColor={C.orangeDeep}
                scaleFrom={1.14}
                scaleTo={1.02}
              />
            </div>

            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 1210,
                textAlign: "center",
              }}
            >
              <MaskLine start={11.6} duration={0.55}>
                <Display size={58} color={C.yellow} style={{ textAlign: "center" }}>
                  THE FULL CHICKEN FIT.
                </Display>
              </MaskLine>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: FONT,
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.16em",
                  color: "rgba(255,255,255,0.62)",
                  textTransform: "uppercase",
                }}
              >
                HOT SAUCE + LEMON PEPPER SEASONING CHARMS · $4
              </div>
            </div>
          </AbsoluteFill>
        </Stage>
        <Sweep start={11.2} duration={1.1} opacity={0.2} />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          zIndex: 72,
          background: C.yellow,
          opacity: progress(t, 4.18, 0.1, easeOut) * (1 - progress(t, 4.32, 0.22, easeIn)),
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          zIndex: 73,
          background: C.yellow,
          opacity: progress(t, 6.18, 0.08, easeOut) * (1 - progress(t, 6.32, 0.22, easeIn)),
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          zIndex: 73,
          background: C.yellow,
          opacity: progress(t, 8.18, 0.08, easeOut) * (1 - progress(t, 8.34, 0.22, easeIn)),
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill
        style={{
          zIndex: 80,
          background: C.blue,
          transform: `translateX(${-112 + progress(t, 14.7, 0.4, easeIn) * 112}%) skewX(-7deg)`,
          width: "120%",
        }}
      />
    </AbsoluteFill>
  );
};
