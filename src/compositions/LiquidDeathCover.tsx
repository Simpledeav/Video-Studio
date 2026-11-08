import { AbsoluteFill } from "remotion";
import { C, FONT, IMG, MONO } from "../config/liquidDeath";
import { BrandMark, Can, Grain, SkullEmblem, Vignette } from "../components/liquiddeath/kit";


export const LiquidDeathCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      {/* Industrial stage. */}
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(118deg, #111317 0%, #08090B 38%, #050506 68%, #0B0C0E 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, rgba(255,255,255,0.026) 0px, rgba(255,255,255,0.026) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(88deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 3px, transparent 3px, transparent 9px)",
          opacity: 0.55,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -180,
          top: -260,
          width: 720,
          height: 1700,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.015) 58%, transparent)",
          transform: "rotate(18deg)",
          filter: "blur(28px)",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -60,
          top: -260,
          width: 900,
          height: 1650,
          background:
            "radial-gradient(ellipse at 50% 20%, rgba(210,31,53,0.2), transparent 56%)",
          filter: "blur(16px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 760,
          top: -320,
          width: 760,
          height: 1500,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.13), rgba(255,255,255,0.015) 62%, transparent)",
          transform: "rotate(-12deg)",
          filter: "blur(22px)",
          opacity: 0.38,
        }}
      />

      {/* Atmospheric smoke. */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${54 + index * 13}%`,
            bottom: -240 + index * 60,
            width: 700,
            height: 520,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(210,215,222,0.08), transparent 66%)",
            filter: "blur(34px)",
            opacity: 0.6 - index * 0.12,
          }}
        />
      ))}

      {/* The skull as a background seal. */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 40,
          opacity: 0.24,
        }}
      >
        <SkullEmblem size={860} color="#D4CDBF" glow={1.4} />
      </div>

      {/* The real can. */}
      <div
        style={{
          position: "absolute",
          right: 170,
          bottom: -90,
          filter: "drop-shadow(0 60px 90px rgba(0,0,0,0.7))",
        }}
      >
        <Can
          src={IMG.sparkling}
          height={1120}
          rotateY={-9}
          sweep={0.52}
          droplets={1.4}
          glow={C.red}
          reflection={false}
        />
      </div>

      {/* Editorial block. */}
      <div
        style={{
          position: "absolute",
          left: 104,
          top: 94,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: MONO,
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: "0.22em",
          color: C.silver,
        }}
      >
        <span style={{ width: 28, height: 2, background: C.red, display: "inline-block" }} />
        A BUSINESS CASE STUDY
      </div>

      <div
        style={{
          position: "absolute",
          left: 102,
          top: 226,
          width: 980,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: 148,
            fontWeight: 800,
            lineHeight: 0.84,
            letterSpacing: "-0.06em",
            textTransform: "uppercase",
            backgroundImage:
              "linear-gradient(176deg, #FFFFFF 0%, #F2F2EF 46%, #D2D6DA 74%, #A2A8AE 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 8px 30px rgba(0,0,0,0.55))",
          }}
        >
          HE MADE
          <br />
          WATER
          <br />
          <span
            style={{
              color: C.redBright,
              WebkitTextFillColor: C.redBright,
              backgroundImage: "none",
              textShadow: `0 0 44px ${C.red}44`,
            }}
          >
            LOOK COOL.
          </span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 106,
          bottom: 196,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <div style={{ width: 54, height: 2, background: C.red }} />
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: C.white,
            }}
          >
            THE LIQUID DEATH STORY
          </div>
          <div
            style={{
              marginTop: 7,
              fontFamily: MONO,
              fontSize: 10,
              letterSpacing: "0.18em",
              color: C.muted,
            }}
          >
            WATER · ALUMINUM · A SKULL · A BILLION-DOLLAR BRAND
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 106,
          bottom: 74,
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <BrandMark width={210} opacity={0.82} />
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: C.dim }}>
          PRODUCT IMAGERY © LIQUID DEATH
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 74,
          top: 66,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.38)",
          textAlign: "right",
        }}
      >
        FOUNDED 2017
        <br />
        CANNED WATER
      </div>

      {/* Water on the lens. */}
      {[
        [252, 164, 14],
        [318, 842, 8],
        [806, 706, 11],
        [1452, 338, 7],
        [1610, 890, 12],
        [1190, 148, 6],
        [430, 1006, 6],
      ].map(([left, top, size], index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left,
            top,
            width: size,
            height: size * 1.22,
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 34% 26%, rgba(255,255,255,0.9), rgba(255,255,255,0.2) 44%, rgba(255,255,255,0.03) 72%)",
            opacity: 0.5,
            filter: "blur(0.4px)",
          }}
        />
      ))}

      <Grain opacity={0.075} />
      <Vignette strength={1.05} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          opacity: 0.62,
        }}
      />
    </AbsoluteFill>
  );
};
