import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Display,
  Glow,
  Headline,
  Kicker,
  MaskLine,
  Photo,
  Reveal,
  Tag,
  easeIn,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const FUNDING_CARDS = [
  { label: "SERIES C", value: "$120M", note: "RAISED", at: 0.35, x: "8%", y: "18%" },
  { label: "VALUATION", value: "$1.2B", note: "PRE-MONEY", at: 0.85, x: "62%", y: "12%" },
  { label: "GROWTH", value: "10×", note: "YEAR ON YEAR", at: 1.35, x: "14%", y: "60%" },
  { label: "CATEGORY", value: "UNICORN", note: "STATUS", at: 1.85, x: "58%", y: "62%" },
];

export const Scene01Hook: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const cut = progress(t, BEATS.hook.cut - 0.05, 0.16, easeInOut);
  const shopIn = progress(t, BEATS.hook.cut, 0.9, easeOut);
  const titleSize = wide ? 104 : 70;

  return (
    <Backdrop glowX="66%" glowY="38%" glowOpacity={0.13}>
      {t < BEATS.hook.cut + 0.25 ? (
        <AbsoluteFill style={{ opacity: 1 - cut }}>
          <Glow x="50%" y="44%" size={52} color={C.greenBright} opacity={0.12} />
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              top: wide ? 86 : 150,
              zIndex: 5,
            }}
          >
            <Kicker start={0.15}>THE STARTUP DREAM</Kicker>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: wide ? "38%" : "36%",
              textAlign: "center",
              zIndex: 4,
              transform: `scale(${1 + progress(t, 0.2, 3.8, easeInOut) * 0.08})`,
            }}
          >
            <MaskLine start={0.25} duration={0.8}>
              <Display size={wide ? 92 : 62} color={C.cream} weight={700} style={{ letterSpacing: "0.02em" }}>
                THE NEXT BIG THING
              </Display>
            </MaskLine>
            <div style={{ height: 18 }} />
            <MaskLine start={0.5} duration={0.8}>
              <Display size={wide ? 34 : 24} color={C.greenBright} weight={500} style={{ letterSpacing: "0.2em" }}>
                BILLIONS · UNICORNS · SCALE
              </Display>
            </MaskLine>
          </div>

          {FUNDING_CARDS.map((card, index) => {
            const p = progress(t, card.at, 0.55, easeOut);
            const out = progress(t, BEATS.hook.cut - 0.35, 0.5, easeIn);
            return (
              <div
                key={card.label}
                style={{
                  position: "absolute",
                  left: card.x,
                  top: card.y,
                  width: wide ? 330 : 290,
                  padding: wide ? "18px 20px" : "15px 16px",
                  background: "rgba(18,20,15,0.72)",
                  border: `1px solid ${C.line}`,
                  backdropFilter: "blur(6px)",
                  opacity: p * (1 - out),
                  transform: `translateY(${(1 - p) * 24 - out * 26}px) rotate(${index % 2 === 0 ? -1.4 : 1.2}deg)`,
                  zIndex: 6,
                  boxShadow: "0 20px 40px rgba(0,0,0,0.24)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: C.muted }}>{card.label}</span>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.greenBright }} />
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: FONT,
                    fontSize: wide ? 42 : 32,
                    fontWeight: 750,
                    color: C.white,
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  {card.value}
                </div>
                <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 8, letterSpacing: "0.16em", color: C.dim }}>
                  {card.note}
                </div>
              </div>
            );
          })}

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: wide ? 70 : 190,
              display: "flex",
              justifyContent: "center",
              gap: 18,
              opacity: progress(t, 2.6, 0.7),
              zIndex: 7,
            }}
          >
            <Tag color={C.greenBright} background={C.greenGhost} border={`${C.green}55`}>
              THE STORY EVERYONE TELLS
            </Tag>
            <Tag color={C.muted} background="transparent" border={C.line}>
              ILLUSTRATIVE GRAPHICS
            </Tag>
          </div>
        </AbsoluteFill>
      ) : null}

      {t >= BEATS.hook.cut ? (
        <AbsoluteFill style={{ opacity: shopIn }}>
          <AbsoluteFill
            style={{
              left: wide ? "42%" : 0,
              right: 0,
              top: 0,
              bottom: wide ? 0 : "38%",
              overflow: "hidden",
            }}
          >
            <Photo
              src={IMG.owner}
              start={BEATS.hook.cut}
              duration={3.5}
              scaleFrom={1.02}
              scaleTo={1.12}
              objectPosition="50% 34%"
              grade="warm"
            />
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: wide ? "40%" : 0,
              top: 0,
              bottom: wide ? 0 : "38%",
              background:
                "linear-gradient(90deg, rgba(12,14,11,0.94) 0%, rgba(12,14,11,0.72) 42%, rgba(12,14,11,0.1) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              top: wide ? "32%" : "20%",
              width: wide ? "56%" : "86%",
              zIndex: 5,
            }}
          >
            <Kicker start={BEATS.hook.headline - 0.1}>BUT WHAT IF THE IDEA IS SMALLER?</Kicker>
            <div style={{ height: wide ? 24 : 16 }} />
            <Headline lines={COPY.hook} size={titleSize} start={BEATS.hook.headline} colorLast={C.greenBright} />
            <div style={{ height: wide ? 22 : 14 }} />
            <Reveal start={BEATS.hook.small} duration={0.7}>
              <div style={{ fontFamily: MONO, fontSize: wide ? 12 : 11, letterSpacing: "0.2em", color: C.cream }}>
                {COPY.hookSmall}
              </div>
            </Reveal>
          </div>

          <div
            style={{
              position: "absolute",
              right: stage.margin,
              bottom: wide ? 42 : 168,
              zIndex: 6,
              opacity: 0.7,
              textAlign: "right",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.muted }}>
              A NEIGHBOURHOOD BUSINESS · NOT A KEYNOTE STAGE
            </div>
            <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 8, letterSpacing: "0.12em", color: C.dim }}>
              PHOTO: WIKIMEDIA COMMONS · CC BY-SA 4.0
            </div>
          </div>
        </AbsoluteFill>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          background: `linear-gradient(180deg, transparent, ${C.greenBright}, transparent)`,
          opacity: 0.45,
          zIndex: 20,
        }}
      />
    </Backdrop>
  );
};
