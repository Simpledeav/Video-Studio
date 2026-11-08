import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, PHOTO, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glow,
  Grain,
  GridField,
  Headline,
  Kicker,
  MONO,
  Machine,
  MonoLabel,
  Photo,
  ReconstructionLabel,
  Rule,
  Scanlines,
  Vignette,
  WifiGlyph,
  clamp,
  easeOut,
  photoSrc,
  progress,
} from "../kit";

export const Scene03Millions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const counterP = progress(t, BEATS.millions.counter, BEATS.millions.counterEnd - BEATS.millions.counter, easeOut);
  const value = interpolate(counterP, [0, 1], [400_000, 120_000_000]);
  const counterExit = 1 - progress(t, BEATS.millions.applause - 0.45, 0.45);
  const applause = progress(t, BEATS.millions.applause - 0.35, 0.5) * (1 - progress(t, BEATS.millions.pedestal - 0.45, 0.45));
  const pedestal = progress(t, BEATS.millions.pedestal - 0.35, 0.5) * (1 - progress(t, BEATS.millions.kitchen - 0.4, 0.45));
  const kitchen = progress(t, BEATS.millions.kitchen - 0.35, 0.5) * (1 - progress(t, BEATS.millions.customer - 0.35, 0.45));
  const customer = progress(t, BEATS.millions.customer - 0.3, 0.45);
  const priceChange = progress(t, BEATS.millions.priceChange, 0.45);
  const wifiP = progress(t, BEATS.millions.wifi, 0.8);

  const milestones = [
    { value: 1_000_000, at: 0.15 },
    { value: 10_000_000, at: 0.85 },
    { value: 50_000_000, at: 1.7 },
    { value: 120_000_000, at: 2.8 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 48% 34%, rgba(255,106,20,0.2) 0%, rgba(66,27,0,0.18) 34%, rgba(5,4,3,0.98) 72%), linear-gradient(170deg, #160D07 0%, #070504 62%, #040302 100%)",
        }}
      />
      <GridField opacity={0.26} size={92} />

      {/* Giant investment counter */}
      <AbsoluteFill style={{ opacity: counterExit }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: wide ? "26%" : "26%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Kicker color={C.orange} style={{ marginBottom: 16 }}>
            {COPY.millions.kicker}
          </Kicker>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: wide ? 246 : 212,
              lineHeight: 0.82,
              letterSpacing: "-0.07em",
              color: C.white,
              fontVariantNumeric: "tabular-nums",
              textShadow: "0 22px 80px rgba(0,0,0,0.55)",
            }}
          >
            ${(value / 1_000_000).toFixed(0)}M
          </div>
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: MONO,
              fontSize: wide ? 18 : 15,
              letterSpacing: "0.18em",
              color: C.orange,
              textTransform: "uppercase",
            }}
          >
            <span style={{ width: 40, height: 1, background: C.orange }} />
            APPROXIMATELY $120,000,000 RAISED
            <span style={{ width: 40, height: 1, background: C.orange }} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: wide ? 42 : 20,
              marginTop: wide ? 34 : 28,
            }}
          >
            {milestones.map((m) => {
              const p = progress(t, m.at, 0.35);
              return (
                <div
                  key={m.value}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    opacity: p * 0.9,
                    transform: `translateY(${(1 - p) * 8}px)`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: FONT,
                      fontWeight: 700,
                      fontSize: wide ? 25 : 19,
                      color: m.value === 120_000_000 ? C.orange : C.creamSoft,
                    }}
                  >
                    ${m.value / 1_000_000}M
                  </div>
                  <div
                    style={{
                      width: 2,
                      height: m.value === 120_000_000 ? 18 : 10,
                      background: m.value === 120_000_000 ? C.orange : "rgba(247,243,234,0.24)",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: wide ? 74 : 220,
            height: wide ? 120 : 170,
            display: "flex",
            alignItems: "flex-end",
            gap: wide ? 8 : 5,
            opacity: 0.55,
          }}
        >
          {Array.from({ length: 24 }).map((_, index) => {
            const bar = clamp((counterP * 24 - index) / 4);
            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: `${10 + bar * (18 + (index % 5) * 14)}%`,
                  background:
                    index > 19
                      ? "linear-gradient(180deg, rgba(255,106,20,0.9), rgba(255,106,20,0.12))"
                      : "linear-gradient(180deg, rgba(247,243,234,0.22), rgba(247,243,234,0.03))",
                  borderTop: index > 19 ? `1px solid ${C.orange}` : "1px solid rgba(247,243,234,0.14)",
                }}
              />
            );
          })}
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: wide ? 42 : 180,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <MonoLabel size={10} color={C.dim}>
            CAPITAL RAISED
          </MonoLabel>
          <MonoLabel size={10} color={C.dim}>
            APPROXIMATE  ·  PUBLIC REPORTING
          </MonoLabel>
        </div>
      </AbsoluteFill>

      {/* Applause */}
      <AbsoluteFill style={{ opacity: applause }}>
        <Photo src={photoSrc(PHOTO.team)} grade="warm" objectPosition="50% 42%" scale={1.05} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(4,3,2,0.9) 0%, rgba(4,3,2,0.24) 52%, rgba(4,3,2,0.42) 100%), linear-gradient(180deg, rgba(4,3,2,0.24), rgba(4,3,2,0.82))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            bottom: wide ? 92 : 280,
            maxWidth: wide ? 760 : 860,
          }}
        >
          <Kicker color={C.lime}>THE ROOM BELIEVED IT.</Kicker>
          <Headline size={wide ? 82 : 76} style={{ marginTop: 16 }}>
            VERY SERIOUS
            <br />
            PEOPLE.
          </Headline>
          <div
            style={{
              marginTop: 18,
              fontFamily: MONO,
              fontSize: 17,
              letterSpacing: "0.12em",
              color: C.creamSoft,
            }}
          >
            SERIES B  ·  SERIES C  ·  A LOT OF HANDSHAKES
          </div>
        </div>
        <ReconstructionLabel
          text="ILLUSTRATIVE BOARDROOM RECONSTRUCTION"
          style={{ position: "absolute", right: wide ? 104 : 28, bottom: wide ? 46 : 150 }}
        />
      </AbsoluteFill>

      {/* Product pedestal + price */}
      <AbsoluteFill style={{ opacity: pedestal }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(255,106,20,0.22), transparent 46%), linear-gradient(180deg, #120C07, #050403 78%)",
          }}
        />
        <AbsoluteFill
          style={{
            top: "58%",
            height: "42%",
            background: "linear-gradient(180deg, rgba(255,130,45,0.14), rgba(4,3,2,0.98) 32%)",
            transform: "perspective(800px) rotateX(58deg)",
            transformOrigin: "top center",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "42%" : "50%",
            top: wide ? "63%" : "60%",
            width: wide ? 330 : 360,
            height: wide ? 44 : 52,
            transform: "translateX(-50%)",
            borderRadius: "12px 12px 26px 26px",
            background: "linear-gradient(180deg, #5C626A 0%, #202327 34%, #090A0B 100%)",
            boxShadow: "0 26px 50px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.24)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "42%" : "50%",
            top: wide ? "38%" : "46%",
            transform: `translate(-50%,-50%) scale(${wide ? 0.96 : 0.94})`,
            filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.6))",
          }}
        >
          <Machine
            scale={1}
            screen={
              <div>
                <MonoLabel size={11} color={C.lime}>
                  READY
                </MonoLabel>
                <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 18, color: C.white, marginTop: 4 }}>
                  $699
                </div>
              </div>
            }
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "62%" : margin,
            right: wide ? 104 : margin,
            top: wide ? "28%" : "72%",
            opacity: progress(t, BEATS.millions.price, 0.5),
          }}
        >
          <Kicker color={C.orange}>{COPY.millions.priceLabel}</Kicker>
          <div style={{ display: "flex", alignItems: "baseline", gap: wide ? 30 : 20, marginTop: 12 }}>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: wide ? 66 : 54,
                color: C.muted,
                textDecoration: "line-through",
                textDecorationThickness: 5,
                textDecorationColor: C.red,
                opacity: 1 - priceChange * 0.5,
              }}
            >
              {COPY.millions.priceFrom}
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: wide ? 104 : 82,
                lineHeight: 0.9,
                letterSpacing: "-0.05em",
                color: priceChange > 0.3 ? C.orange : C.white,
                transform: `scale(${0.86 + priceChange * 0.14})`,
                transformOrigin: "left center",
              }}
            >
              {COPY.millions.priceTo}
            </span>
          </div>
          <MonoLabel size={12} color={C.muted} style={{ marginTop: 14 }}>
            {COPY.millions.note}
          </MonoLabel>
        </div>
      </AbsoluteFill>

      {/* Luxury kitchen + wifi comedy */}
      <AbsoluteFill style={{ opacity: kitchen }}>
        <Photo src={photoSrc(PHOTO.kitchen)} grade="warm" objectPosition="50% 54%" scale={1.06} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, rgba(4,3,2,0.46), transparent 34%, rgba(4,3,2,0.68) 100%), linear-gradient(90deg, rgba(4,3,2,0.72), transparent 54%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: wide ? "20%" : "0%",
            top: wide ? "30%" : "31%",
            transform: "scale(0.62)",
            transformOrigin: "top right",
          }}
        >
          <Machine
            scale={1}
            screen={
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WifiGlyph size={19} progress={wifiP} />
                  <MonoLabel size={10} color={C.blue}>
                    WIFI
                  </MonoLabel>
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 600,
                    fontSize: 18,
                    color: C.white,
                    marginTop: 5,
                  }}
                >
                  CONNECTING…
                </div>
              </div>
            }
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 110 : 180,
            maxWidth: wide ? 640 : 690,
          }}
        >
          <Kicker color={C.blue}>{COPY.millions.wifi}</Kicker>
          <Headline size={wide ? 72 : 66} style={{ marginTop: 14 }}>
            PLEASE WAIT.
            <br />
            IT'S PREMIUM.
          </Headline>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontFamily: MONO,
              fontSize: 16,
              letterSpacing: "0.14em",
              color: C.creamSoft,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: C.blue,
                boxShadow: `0 0 14px ${C.blue}`,
              }}
            />
            00:47  ·  STILL CONNECTING
          </div>
        </div>
      </AbsoluteFill>

      {/* Customer deadpan */}
      <AbsoluteFill style={{ opacity: customer }}>
        <Photo
          src={photoSrc(PHOTO.owner)}
          grade="warm"
          objectPosition={wide ? "50% 34%" : "50% 30%"}
          scale={1.03}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(4,3,2,0.94) 0%, rgba(4,3,2,0.46) 48%, rgba(4,3,2,0.18) 100%), linear-gradient(180deg, rgba(4,3,2,0.3), rgba(4,3,2,0.78))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            bottom: wide ? 92 : 300,
            maxWidth: wide ? 640 : 780,
          }}
        >
          <Kicker color={C.orange}>THE CUSTOMER</Kicker>
          <Headline size={wide ? 82 : 76} style={{ marginTop: 14 }}>
            {COPY.millions.customer}
          </Headline>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 27 : 25,
              lineHeight: 1.4,
              color: C.creamSoft,
            }}
          >
            He paid for a connected experience.
            <br />
            He got a very expensive waiting room.
          </div>
        </div>
      </AbsoluteFill>

      <Rule width="100%" />
      <Glow x="50%" y="35%" color={C.orange} opacity={0.1} />
      <Scanlines opacity={0.03} />
      <Grain opacity={0.05} />
      <Vignette strength={1} warm />
    </AbsoluteFill>
  );
};
