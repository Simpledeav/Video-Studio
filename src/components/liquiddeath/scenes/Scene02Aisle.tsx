import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  Display,
  FounderPhoto,
  GenericBottle,
  Glow,
  Halftone,
  Headline,
  Kicker,
  LightBeams,
  Reveal,
  Sweep,
  UtilityNote,
  easeInOut,
  easeOut,
  progress,
  seeded,
  useTime,
} from "../kit";

const AisleWall: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const pan = Math.sin(t * 0.38) * 16 - 34;
  const cols = wide ? 8 : 4;
  const rows = wide ? 4 : 7;
  const bottleW = wide ? 58 : 64;
  const bottleH = wide ? 178 : 168;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background:
          "linear-gradient(160deg, #101215 0%, #0A0B0D 46%, #070708 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          top: 0,
          bottom: 0,
          transform: `translateX(${pan}px)`,
          display: "flex",
          flexDirection: "column",
          gap: wide ? 18 : 24,
          padding: wide ? "54px 34px" : "120px 20px 60px",
        }}
      >
        {Array.from({ length: rows }, (_, row) => {
          const scale = 1 - row * 0.06;
          const opacity = 0.62 - row * 0.055;
          return (
            <div key={row} style={{ position: "relative" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: wide ? 16 : 12,
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  opacity,
                  filter: row > 1 ? "blur(0.6px)" : undefined,
                }}
              >
                {Array.from({ length: cols }, (_, col) => {
                  const h = bottleH * (0.9 + seeded(row * 17 + col * 3) * 0.22);
                  const tone = (row + col) % 5 === 0 ? "blue" : (row + col) % 3 === 0 ? "grey" : "clear";
                  return (
                    <GenericBottle
                      key={`${row}-${col}`}
                      width={bottleW}
                      height={h}
                      tone={tone}
                      opacity={0.72 + seeded(row + col + 9) * 0.24}
                    />
                  );
                })}
              </div>
              <div
                style={{
                  marginTop: wide ? 10 : 8,
                  height: 7,
                  background:
                    "linear-gradient(180deg, rgba(205,209,213,0.22), rgba(20,21,24,0.9) 54%, rgba(0,0,0,0.9))",
                  borderTop: "1px solid rgba(255,255,255,0.13)",
                  boxShadow: "0 8px 18px rgba(0,0,0,0.5)",
                }}
              />
              <div
                style={{
                  marginTop: 14,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.05 + seeded(row) * 0.06}), transparent)`,
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(4,4,5,0.8) 0%, transparent 30%, transparent 70%, rgba(4,4,5,0.84) 100%), linear-gradient(180deg, rgba(4,4,5,0.7), transparent 24%, transparent 70%, rgba(4,4,5,0.9))",
        }}
      />
      <Halftone opacity={0.14} size={6} />
    </div>
  );
};

const EnergyPanel: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const pulse = 0.8 + Math.sin(t * 5.4) * 0.12;
  const enter = progress(t, 0, 0.55, easeOut);
  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(180deg, #12070A 0%, #070506 60%, #050506 100%)",
        opacity: enter,
        overflow: "hidden",
      }}
    >
      <LightBeams opacity={0.6} />
      <Glow x="50%" y="34%" size={58} color={C.red} opacity={0.22 * pulse} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 40 : 66,
          height: wide ? 330 : 380,
          background:
            "linear-gradient(180deg, transparent, rgba(0,0,0,0.72) 50%, #050506 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 54 : 70,
          height: wide ? 210 : 280,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: wide ? 9 : 6,
          opacity: 0.9,
        }}
      >
        {Array.from({ length: wide ? 34 : 22 }, (_, index) => {
          const h = 80 + seeded(index + 51) * 94;
          const phone = index % 5 === 0;
          return (
            <div key={index} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: wide ? 22 : 18,
                  height: wide ? 24 : 20,
                  borderRadius: "50%",
                  background: "#060607",
                  boxShadow: "inset 0 2px 4px rgba(255,255,255,0.05)",
                }}
              />
              <div
                style={{
                  width: wide ? 42 : 32,
                  height: h,
                  borderRadius: "45% 45% 0 0",
                  background: "linear-gradient(180deg, #0A0A0C, #030304)",
                  marginTop: -2,
                }}
              />
              {phone ? (
                <div
                  style={{
                    position: "absolute",
                    top: -18,
                    right: wide ? 0 : -2,
                    width: 5,
                    height: 8,
                    borderRadius: 1,
                    background: "rgba(240,244,246,0.8)",
                    boxShadow: "0 0 10px rgba(255,255,255,0.5)",
                    opacity: 0.7 + Math.sin(t * 4 + index) * 0.2,
                  }}
                />
              ) : null}
            </div>
          );
        })}
      </div>
      <div
        style={{
          position: "absolute",
          left: wide ? 130 : 56,
          top: wide ? 200 : 250,
          zIndex: 5,
        }}
      >
        <Kicker start={0.15} color={C.silver}>
          EVERY OTHER DRINK HAD A SHOW
        </Kicker>
        <div style={{ height: 30 }} />
        <Headline
          lines={["BEER HAD", "ATTITUDE."]}
          size={wide ? 116 : 76}
          start={0.28}
          accentLast
        />
        <div style={{ height: wide ? 30 : 24 }} />
        <Reveal start={0.75} duration={0.6}>
          <Display size={wide ? 46 : 32} color={C.silver} weight={600} style={{ letterSpacing: "0.02em" }}>
            WATER HAD NOTHING.
          </Display>
        </Reveal>
      </div>
      <div
        style={{
          position: "absolute",
          right: wide ? 120 : 48,
          bottom: wide ? 120 : 430,
          textAlign: "right",
          fontFamily: MONO,
          fontSize: 11,
          lineHeight: 1.8,
          letterSpacing: "0.18em",
          color: C.muted,
          opacity: 0.8,
        }}
      >
        ENERGY · MUSIC · CULTURE
        <br />
        WATER · PLAIN PLASTIC
      </div>
      <Sweep start={0.1} duration={1.4} color={C.redBright} opacity={0.18} />
    </AbsoluteFill>
  );
};

const FounderBlock: React.FC<{ wide: boolean }> = ({ wide }) => {
  const stage = useStage();
  return (
    <AbsoluteFill style={{ background: "transparent" }}>
      {wide ? (
        <>
          <div style={{ position: "absolute", left: stage.margin, top: 132 }}>
            <FounderPhoto width={660} height={806} start={0.1} />
            <UtilityNote start={0.7} style={{ marginTop: 14, textAlign: "right" }}>
              {COPY.founderCredit} · PRESS IMAGE
            </UtilityNote>
          </div>
          <div
            style={{
              position: "absolute",
              left: 860,
              top: 258,
              right: stage.margin,
            }}
          >
            <Kicker start={0.3}>THE PERSON WHO NOTICED</Kicker>
            <div style={{ height: 28 }} />
            <Headline lines={["MIKE", "CESSARIO"]} size={88} start={0.4} />
            <div style={{ height: 22 }} />
            <Reveal start={0.85} duration={0.6}>
              <div style={{ fontFamily: FONT, fontSize: 19, letterSpacing: "0.16em", color: C.redBright, fontWeight: 600 }}>
                {COPY.founderRole}
              </div>
            </Reveal>
            <div style={{ height: 26, width: 60, background: C.red, opacity: 0.8 }} />
            <div style={{ height: 26 }} />
            <Reveal start={1.15} duration={0.7}>
              <div style={{ fontFamily: FONT, fontSize: 26, lineHeight: 1.55, color: C.silver, maxWidth: 720 }}>
                A former advertising creative who saw a category with no
                cultural energy — and a product everybody already understood.
              </div>
            </Reveal>
          </div>
        </>
      ) : (
        <>
          <div style={{ position: "absolute", left: stage.margin, top: 224 }}>
            <Kicker start={0.2}>THE PERSON WHO NOTICED</Kicker>
            <div style={{ height: 22 }} />
            <Headline lines={["MIKE", "CESSARIO"]} size={62} start={0.3} />
          </div>
          <div style={{ position: "absolute", left: "50%", top: 620, transform: "translateX(-50%)" }}>
            <FounderPhoto width={620} height={720} start={0.15} />
          </div>
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              right: stage.margin,
              top: 1380,
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: FONT, fontSize: 18, letterSpacing: "0.16em", color: C.redBright, fontWeight: 600 }}>
              {COPY.founderRole}
            </div>
            <div style={{ height: 20 }} />
            <div style={{ fontFamily: FONT, fontSize: 28, lineHeight: 1.55, color: C.silver }}>
              A former advertising creative who saw a category with no
              cultural energy.
            </div>
            <UtilityNote style={{ marginTop: 22 }}>{COPY.founderCredit} · PRESS IMAGE</UtilityNote>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

export const Scene02Aisle: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const founderIn = t >= BEATS.aisle.founder;
  const energyIn = t >= BEATS.aisle.shift && !founderIn;
  const aisleOut = progress(t, BEATS.aisle.shift - 0.3, 0.45, easeInOut);
  const headlineSize = wide ? 92 : 58;

  return (
    <Backdrop glowX="28%" glowY="40%" glowOpacity={0.07}>
      {!energyIn && !founderIn ? (
        <AbsoluteFill style={{ opacity: 1 - aisleOut }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: wide ? "54%" : "100%",
              height: wide ? "100%" : "54%",
              overflow: "hidden",
            }}
          >
            <AisleWall wide={wide} />
          </div>
          <div
            style={
              wide
                ? { position: "absolute", left: "57%", right: stage.margin, top: 270 }
                : { position: "absolute", left: stage.margin, right: stage.margin, top: 190 }
            }
          >
            <Kicker start={BEATS.aisle.headline - 0.2}>2017 · THE BEVERAGE AISLE</Kicker>
            <div style={{ height: wide ? 30 : 22 }} />
            <Headline lines={COPY.aisle} size={headlineSize} start={BEATS.aisle.headline} />
            <div style={{ height: wide ? 32 : 20 }} />
            <Reveal start={1.4} duration={0.7}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: wide ? 24 : 22,
                  lineHeight: 1.55,
                  color: C.muted,
                  maxWidth: wide ? 640 : 880,
                }}
              >
                Rows of near-identical bottles. Safe claims. Quiet design.
                Nothing worth talking about.
              </div>
            </Reveal>
          </div>
          {!wide ? (
            <div style={{ position: "absolute", left: 0, right: 0, top: "54%", height: 1, background: C.line }} />
          ) : null}
        </AbsoluteFill>
      ) : null}

      {energyIn ? <EnergyPanel wide={wide} /> : null}
      {founderIn ? <FounderBlock wide={wide} /> : null}

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 66 : 92,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.22em",
          color: C.dim,
          zIndex: 20,
        }}
      >
        LIQUID DEATH · THE BRAND CASE
      </div>
      <div
        style={{
          position: "absolute",
          right: stage.margin,
          top: wide ? 66 : 92,
          display: "flex",
          gap: 8,
          zIndex: 20,
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            style={{
              width: i === 1 ? 26 : 7,
              height: 3,
              background: i === 1 ? C.red : C.dim,
              opacity: i === 1 ? 0.9 : 0.5,
            }}
          />
        ))}
      </div>
    </Backdrop>
  );
};
