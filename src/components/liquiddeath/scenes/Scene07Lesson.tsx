import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEATS, C, FONT, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  BrandMark,
  Can,
  Display,
  Glow,
  Headline,
  Kicker,
  MaskLine,
  SkullEmblem,
  Tag,
  UtilityNote,
  clamp,
  easeOut,
  progress,
  useTime,
} from "../kit";

const file = (path: string) => staticFile(path.replace(/^\//, ""));

const Lineup: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const items = [
    { src: IMG.still, label: "STILL", h: wide ? 400 : 360 },
    { src: IMG.sparkling, label: "SPARKLING", h: wide ? 460 : 400 },
    { src: IMG.mango, label: "MANGO CHAINSAW", h: wide ? 390 : 350 },
    { src: IMG.lime, label: "SEVERED LIME", h: wide ? 380 : 340 },
    { src: IMG.grave, label: "GRAVE FRUIT", h: wide ? 390 : 350 },
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: wide ? 0 : 160,
        height: wide ? 620 : 760,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: wide ? 300 : 380,
          background: "linear-gradient(180deg, #101114 0%, #08090B 52%, #050506 100%)",
          borderTop: `1px solid ${C.line}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 210 : 280,
          height: 10,
          background: "linear-gradient(180deg, rgba(220,225,230,0.24), #1B1D21 52%, #070809)",
          borderTop: "1px solid rgba(255,255,255,0.17)",
          boxShadow: "0 20px 38px rgba(0,0,0,0.6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: wide ? 226 : 296,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: wide ? 62 : 22,
        }}
      >
        {items.map((item, index) => {
          const enter = progress(t, BEATS.lesson.lineup + index * 0.12, 0.8, easeOut);
          return (
            <div
              key={item.label}
              style={{
                opacity: clamp(enter * 1.2),
                transform: `translateY(${(1 - enter) * 26}px)`,
              }}
            >
              <Can
                src={item.src}
                height={item.h}
                rotateY={-10 + (index % 2) * 18}
                sweep={(Math.sin(t * 0.35 + index * 0.7) + 1) / 2}
                droplets={0.5}
                glow={index === 1 ? C.red : "#D8DCE0"}
                reflection={false}
                shadow={false}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: wide ? 318 : 392,
          transform: "translateX(-50%)",
          display: "flex",
          gap: wide ? 62 : 22,
          opacity: 0.75,
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            style={{
              width: wide ? 128 : 84,
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 7,
              letterSpacing: "0.12em",
              color: C.dim,
              borderTop: `1px solid ${C.lineSoft}`,
              paddingTop: 5,
            }}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

const ContextPanel: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, BEATS.lesson.shelf, 0.9, easeOut);
  const eventP = progress(t, BEATS.lesson.event, 0.8, easeOut);
  return (
    <AbsoluteFill style={{ opacity: p }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(5,5,6,0.9) 0%, rgba(5,5,6,0.4) 52%, rgba(5,5,6,0.92) 100%)",
        }}
      />
      <Img
        src={file(IMG.campaign)}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "72% 50%",
          filter: "brightness(0.58) contrast(1.12) saturate(0.72) grayscale(0.15)",
          transform: `scale(${1.02 + p * 0.04})`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.5) 0%, transparent 34%, transparent 58%, rgba(5,5,6,0.95) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: wide ? 104 : 64,
          top: wide ? 118 : 150,
          zIndex: 5,
        }}
      >
        <Kicker start={0.2}>SHELF · LIFESTYLE · EVENT</Kicker>
        <div style={{ height: 18 }} />
        <Headline
          lines={wide ? ["NOT JUST", "A DRINK."] : ["NOT JUST", "A DRINK."]}
          size={wide ? 72 : 54}
          start={0.3}
          accentLast
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: wide ? 104 : 64,
          bottom: wide ? 94 : 230,
          width: wide ? 330 : 400,
          padding: "16px 18px",
          border: `1px solid ${C.line}`,
          background: "rgba(7,8,9,0.72)",
          backdropFilter: "blur(6px)",
          opacity: eventP,
          transform: `translateY(${(1 - eventP) * 16}px)`,
          zIndex: 6,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: C.redBright }}>
            BRAND EVENT IDENTITY
          </span>
          <span style={{ fontFamily: MONO, fontSize: 8, color: C.dim }}>LIVE</span>
        </div>
        <Img
          src={file(IMG.event)}
          style={{ width: "100%", height: "auto", display: "block", border: `1px solid ${C.lineSoft}` }}
        />
        <div style={{ marginTop: 10, fontFamily: FONT, fontSize: 12.5, lineHeight: 1.5, color: C.muted }}>
          A skull and a scythe do more for a can of water than another
          picture of a mountain.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 104 : 64,
          bottom: wide ? 90 : 210,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 6,
          opacity: eventP,
        }}
      >
        <Tag color={C.white} background="rgba(255,255,255,0.06)" style={{ fontSize: 8 }}>
          RETAIL
        </Tag>
        <Tag color={C.white} background="rgba(255,255,255,0.06)" style={{ fontSize: 8 }}>
          LIFESTYLE
        </Tag>
        <Tag color={C.white} background="rgba(255,255,255,0.06)" style={{ fontSize: 8 }}>
          EVENTS
        </Tag>
      </div>
    </AbsoluteFill>
  );
};

const Statement: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, 0, 0.7, easeOut);
  return (
    <AbsoluteFill style={{ opacity: p, justifyContent: "center", alignItems: "center" }}>
      <div style={{ position: "absolute", opacity: 0.16 }}>
        <SkullEmblem size={wide ? 760 : 680} color="#C8C1B4" glow={1.1} />
      </div>
      <Glow x="50%" y="48%" size={52} color={C.red} opacity={0.18} />
      <div style={{ position: "relative", textAlign: "center", zIndex: 4 }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.26em", color: C.muted, marginBottom: 18 }}>
          THE REAL DIFFERENTIATOR
        </div>
        <BrandMark width={wide ? 540 : 460} opacity={0.96} />
        <div style={{ height: wide ? 34 : 28 }} />
        <MaskLine start={0.25} duration={0.8}>
          <Display size={wide ? 50 : 38} color={C.silver} weight={600} style={{ letterSpacing: "0.01em" }}>
            THE PRODUCT WAS WATER.
          </Display>
        </MaskLine>
        <div style={{ height: 10 }} />
        <MaskLine start={0.45} duration={0.8}>
          <Display size={wide ? 46 : 34} accent style={{ letterSpacing: "0.01em" }}>
            THE DIFFERENTIATION WAS THE BRAND.
          </Display>
        </MaskLine>
        <div style={{ height: 26 }} />
        <div
          style={{
            width: wide ? 300 : 240,
            height: 2,
            margin: "0 auto",
            background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
            opacity: 0.8,
          }}
        />
      </div>
      <div style={{ position: "absolute", bottom: wide ? 52 : 190, left: 0, right: 0, textAlign: "center" }}>
        <UtilityNote start={0.8}>
          THE CAN IS REAL · THE IDENTITY IS THE PRODUCT
        </UtilityNote>
      </div>
    </AbsoluteFill>
  );
};

export const Scene07Lesson: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const statementIn = t >= BEATS.lesson.brand;

  return (
    <Backdrop glowX="52%" glowY="48%" glowOpacity={0.12}>
      {!statementIn ? (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              right: stage.margin,
              top: wide ? 70 : 130,
              zIndex: 8,
            }}
          >
            <Kicker start={0.2}>THE PART PEOPLE MISS</Kicker>
            <div style={{ height: 16 }} />
            <Headline
              lines={wide ? ["A BRAND CAN", "ATTRACT ATTENTION."] : ["A BRAND CAN", "ATTRACT", "ATTENTION."]}
              size={wide ? 62 : 46}
              start={0.3}
            />
          </div>
          <Lineup wide={wide} />
          {t >= BEATS.lesson.shelf ? <ContextPanel wide={wide} /> : null}
        </AbsoluteFill>
      ) : null}
      {statementIn ? <Statement wide={wide} /> : null}

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 38 : 176,
          zIndex: 30,
          display: "flex",
          justifyContent: "space-between",
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: C.dim,
        }}
      >
        <span>MANUFACTURING · DISTRIBUTION · MARGINS</span>
        <span style={{ color: C.redBright }}>IDENTITY</span>
      </div>
    </Backdrop>
  );
};
