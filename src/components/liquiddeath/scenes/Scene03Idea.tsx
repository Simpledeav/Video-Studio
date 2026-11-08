import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  BrandMark,
  Can,
  Headline,
  Kicker,
  SkullEmblem,
  StackedLogo,
  Sweep,
  clamp,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const NAME_IDEAS = [
  { text: "PURE.", at: 0.55 },
  { text: "HYDRATE.", at: 0.95 },
  { text: "AQUA.", at: 1.35 },
  { text: "REFRESH.", at: 1.75 },
];

const Notebook: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const finalIn = progress(t, 2.0, 0.7, easeOut);
  return (
    <div
      style={{
        width: wide ? 720 : 900,
        height: wide ? 600 : 440,
        position: "relative",
        transform: `rotate(${wide ? -1.6 : -1.1}deg)`,
        background:
          "linear-gradient(155deg, #17181B 0%, #101114 48%, #0B0C0E 100%)",
        border: `1px solid ${C.line}`,
        boxShadow: "0 38px 80px rgba(0,0,0,0.62), inset 0 1px 0 rgba(255,255,255,0.06)",
        padding: wide ? 38 : 32,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.14) 0.7px, transparent 0.8px)",
          backgroundSize: "22px 22px",
          opacity: 0.28,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 2,
          background: C.red,
          opacity: 0.65,
        }}
      />
      <div
        style={{
          position: "relative",
          fontFamily: MONO,
          fontSize: wide ? 11 : 10,
          letterSpacing: "0.22em",
          color: C.muted,
        }}
      >
        NOTEBOOK / NAMING
      </div>
      <div style={{ height: wide ? 18 : 12 }} />
      <div
        style={{
          position: "relative",
          fontFamily: FONT,
          fontSize: wide ? 22 : 20,
          color: C.silver,
          fontWeight: 500,
          letterSpacing: "0.01em",
        }}
      >
        What do you call water that
        <br />
        doesn&apos;t sound like water?
      </div>
      <div style={{ height: wide ? 22 : 16 }} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: wide ? 4 : 2 }}>
        {NAME_IDEAS.map((idea, index) => {
          const p = progress(t, idea.at, 0.28, easeOut);
          const strike = progress(t, idea.at + 0.15, 0.32, easeInOut);
          return (
            <div
              key={idea.text}
              style={{
                position: "relative",
                width: "fit-content",
                fontFamily: FONT,
                fontSize: wide ? 44 : 38,
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: C.dim,
                opacity: 0.35 + p * 0.65,
                transform: `translateX(${(1 - p) * -12}px)`,
              }}
            >
              {idea.text}
              <div
                style={{
                  position: "absolute",
                  left: "-2%",
                  top: "52%",
                  height: 2.5,
                  width: `${strike * 104}%`,
                  background: C.red,
                  transform: "rotate(-1.4deg)",
                  boxShadow: `0 0 10px ${C.red}66`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: wide ? 38 : 32,
          right: wide ? 38 : 32,
          bottom: wide ? 32 : 26,
          opacity: finalIn,
          transform: `translateY(${(1 - finalIn) * 16}px) rotate(-1deg)`,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.24em",
              color: C.redBright,
              marginBottom: 6,
            }}
          >
            THE ONE THAT STUCK
          </div>
          <BrandMark width={wide ? 330 : 380} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: wide ? 72 : 64,
            fontWeight: 700,
            color: C.red,
            lineHeight: 0.8,
            transform: "rotate(8deg)",
            opacity: 0.8,
          }}
        >
          ?
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 14,
          top: 14,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: C.dim,
        }}
      >
        LD / 01
      </div>
    </div>
  );
};

export const Scene03Idea: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const canIn = progress(t, BEATS.idea.can, 1.2, easeOut);
  const logoIn = progress(t, BEATS.idea.logo, 0.8, easeOut);
  const taglineIn = progress(t, BEATS.idea.tagline, 0.6, easeOut);
  const sweep = progress(t, 4.4, 2.8, easeInOut);
  const float = Math.sin(t * 0.8 + 1) * 4;
  const taglineSize = wide ? 82 : 52;

  return (
    <Backdrop glowX="72%" glowY="46%" glowOpacity={0.16}>
      <div
        style={{
          position: "absolute",
          left: wide ? "57%" : "50%",
          top: wide ? "48%" : "58%",
          transform: "translate(-50%, -50%)",
          opacity: 0.22 * logoIn,
          zIndex: 1,
        }}
      >
        <SkullEmblem size={wide ? 620 : 620} color="#C6C0B4" />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "66%" : "50%",
          top: wide ? "49%" : "56%",
          transform: `translate(-50%, -50%) translateY(${float}px) scale(${0.88 + canIn * 0.12})`,
          opacity: clamp(canIn * 1.2),
          zIndex: 6,
        }}
      >
        <Can
          src={IMG.sparkling}
          height={wide ? 720 : 650}
          rotateY={-22 + canIn * 16}
          sweep={sweep}
          glow={C.red}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 180 : 230,
          zIndex: 8,
        }}
      >
        <Kicker start={0.25}>THE CRAZY IDEA</Kicker>
        <div style={{ height: wide ? 24 : 18 }} />
        <Headline
          lines={wide ? ["WHAT IF WATER", "HAD A SHOW?"] : ["WHAT IF", "WATER HAD", "A SHOW?"]}
          size={wide ? 66 : 48}
          start={0.35}
          accentLast
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 380 : 640,
          zIndex: 8,
        }}
      >
        <Notebook wide={wide} />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "58%" : stage.margin,
          right: wide ? stage.margin : stage.margin,
          top: wide ? 220 : 1210,
          textAlign: wide ? "left" : "center",
          opacity: logoIn,
          zIndex: 7,
        }}
      >
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.24em",
            color: C.muted,
            marginBottom: 12,
          }}
        >
          OUTRAGEOUS BY DESIGN
        </div>
        <StackedLogo height={wide ? 250 : 220} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 90 : 230,
          zIndex: 9,
          opacity: taglineIn,
          transform: `translateY(${(1 - taglineIn) * 22}px)`,
        }}
      >
        <div
          style={{
            background: `linear-gradient(90deg, ${C.red} 0%, #8F1224 62%, rgba(90,10,20,0.2) 100%)`,
            padding: wide ? "18px 0 20px" : "15px 0 17px",
            transform: "rotate(-1.2deg)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontFamily: FONT,
              fontSize: taglineSize,
              fontWeight: 800,
              letterSpacing: wide ? "0.06em" : "0.04em",
              color: "#FFFFFF",
              lineHeight: 0.9,
              textShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
          >
            {COPY.idea}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: stage.margin,
          bottom: wide ? 40 : 180,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.18em",
          color: C.dim,
          zIndex: 10,
        }}
      >
        LIQUID DEATH MOUNTAIN WATER · 12 FL OZ
      </div>

      <Sweep start={2.5} duration={1.7} opacity={0.1} />
      <Sweep start={4.6} duration={2.4} color={C.redBright} opacity={0.08} />
    </Backdrop>
  );
};
