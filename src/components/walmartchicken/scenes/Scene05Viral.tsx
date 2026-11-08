import { AbsoluteFill, Img } from "remotion";
import { C, FONT, IMG } from "../../../config/walmartChicken";
import {
  Confetti,
  Cursor,
  Display,
  Dot,
  Kicker,
  MaskLine,
  PhotoCard,
  Pill,
  Reveal,
  Spark,
  Stage,
  Stamp,
  Sweep,
  Tag,
  easeInOut,
  easeOut,
  file,
  progress,
  useTime,
} from "../../presets/editorialPop/kit";

const FillBar: React.FC<{
  p: number;
  color?: string;
  height?: number;
  style?: React.CSSProperties;
}> = ({ p, color = C.yellow, height = 16, style }) => (
  <div
    style={{
      width: "100%",
      height,
      borderRadius: 99,
      background: "rgba(255,255,255,0.14)",
      overflow: "hidden",
      ...style,
    }}
  >
    <div
      style={{
        width: `${p * 100}%`,
        height: "100%",
        borderRadius: 99,
        background: color,
        boxShadow: `0 0 22px ${color}`,
      }}
    />
  </div>
);

const Toast: React.FC<{
  children: React.ReactNode;
  x: number;
  y: number;
  start: number;
  hideAt?: number;
  accent?: string;
}> = ({ children, x, y, start, hideAt = 3.75, accent = C.green }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.4, easeOut) * (1 - progress(t, hideAt, 0.25, easeInOut));
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        borderRadius: 99,
        background: "rgba(255,255,255,0.96)",
        color: C.ink,
        fontFamily: FONT,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.02em",
        boxShadow: "0 12px 28px rgba(0,0,0,0.22)",
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px) scale(${0.92 + p * 0.08})`,
        zIndex: 50,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: accent, fontSize: 16 }}>✓</span>
      {children}
    </div>
  );
};

export const Scene05Viral: React.FC = () => {
  const { t } = useTime();

  const toSold = progress(t, 3.85, 0.4, easeInOut);
  const toResale = progress(t, 6.2, 0.45, easeInOut);
  const toEnd = progress(t, 13.5, 0.5, easeInOut);

  // 90:00 -> 00:00 across 3.2s, then hold.
  const clock = Math.max(0, 90 - progress(t, 1.2, 2.6, easeInOut) * 90);
  const minutes = Math.floor(clock);
  const seconds = Math.floor((clock - minutes) * 60);
  const stock = Math.max(0, 1 - progress(t, 1.2, 2.6, easeInOut));
  const sold = t >= 3.85;

  return (
    <AbsoluteFill style={{ backgroundColor: C.blueInk }}>
      {/* ================= LAUNCH UI ================= */}
      <AbsoluteFill
        style={{
          opacity: 1 - toResale,
          transform: `scale(${1 + toResale * 0.05})`,
        }}
      >
        <Stage variant="blue" accent={C.yellow} accent2={C.orange} glowX="50%" glowY="18%">
          {/* header */}
          <div
            style={{
              position: "absolute",
              left: 52,
              right: 52,
              top: 88,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              zIndex: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Spark size={36} />
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 800,
                  letterSpacing: "0.03em",
                  color: C.white,
                }}
              >
                SparkShop
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 99,
                background: "rgba(226,59,46,0.92)",
                color: C.white,
                fontFamily: FONT,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.18em",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  background: C.white,
                  opacity: 0.6 + Math.sin(t * 7) * 0.4,
                }}
              />
              LIVE DROP
            </div>
          </div>

          {/* product panel */}
          <div
            style={{
              position: "absolute",
              left: 52,
              right: 52,
              top: 190,
              padding: "24px 24px 26px",
              borderRadius: 24,
              background: "rgba(255,255,255,0.97)",
              boxShadow: "0 34px 80px rgba(0,0,0,0.34)",
              zIndex: 15,
            }}
          >
            <div style={{ display: "flex", gap: 18 }}>
              <div
                style={{
                  width: 244,
                  height: 244,
                  borderRadius: 16,
                  overflow: "hidden",
                  flexShrink: 0,
                  background: C.cream,
                }}
              >
                <Img
                  src={file(IMG.purseTraditional)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
              <div style={{ flex: 1, paddingTop: 4 }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "5px 9px",
                    background: C.purple,
                    color: C.white,
                    borderRadius: 3,
                    fontFamily: FONT,
                    fontSize: 9,
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                  }}
                >
                  LIMITED EDITION
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 29,
                    fontWeight: 800,
                    lineHeight: 1.02,
                    letterSpacing: "-0.035em",
                    color: C.ink,
                    marginTop: 10,
                  }}
                >
                  ROTISSERIE
                  <br />
                  CHICKEN PURSE
                </div>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.17em",
                    color: "rgba(7,24,47,0.5)",
                    marginTop: 8,
                    textTransform: "uppercase",
                  }}
                >
                  TRADITIONAL · PURPLE TRIM
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 10,
                    marginTop: 12,
                  }}
                >
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 47,
                      fontWeight: 800,
                      letterSpacing: "-0.05em",
                      color: C.ink,
                    }}
                  >
                    $5.97
                  </span>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: 12,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "rgba(7,24,47,0.44)",
                    }}
                  >
                    SAME AS THE CHICKEN
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: 20 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: FONT,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "rgba(7,24,47,0.46)",
                  marginBottom: 8,
                }}
              >
                <span>STOCK</span>
                <span>{Math.round(stock * 5000).toLocaleString("en-US")} / 5,000</span>
              </div>
              <FillBar p={stock} color={stock > 0.2 ? C.orange : C.red} height={13} />
            </div>

            <div
              style={{
                marginTop: 18,
                height: 74,
                borderRadius: 12,
                background: sold ? "rgba(7,24,47,0.12)" : C.yellow,
                color: sold ? C.red : C.ink,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "0.04em",
                boxShadow: sold ? "none" : "0 18px 40px rgba(255,194,32,0.32)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {sold ? "SOLD OUT" : "ADD TO CART"}
              {!sold ? (
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 100,
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                    transform: `translateX(${-140 + ((t * 240) % 700)}px) skewX(-18deg)`,
                  }}
                />
              ) : null}
            </div>
          </div>

          {/* countdown + tagline */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 780,
              textAlign: "center",
              zIndex: 14,
            }}
          >
            <Reveal start={0.15} y={14}>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 18,
                  fontWeight: 700,
                  letterSpacing: "0.26em",
                  color: C.white,
                  textTransform: "uppercase",
                  opacity: 0.82,
                }}
              >
                WHEN IT LAUNCHED ONLINE
              </div>
            </Reveal>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 118,
                fontWeight: 800,
                letterSpacing: "-0.06em",
                lineHeight: 0.92,
                color: C.yellow,
                marginTop: 8,
                textShadow: "0 8px 40px rgba(0,0,0,0.3)",
              }}
            >
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </div>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.6)",
                textTransform: "uppercase",
                marginTop: 2,
              }}
            >
              MINUTES TO SOLD OUT
            </div>
          </div>

          {/* live order feed */}
          <div
            style={{
              position: "absolute",
              left: 52,
              right: 52,
              top: 1000,
              padding: "18px 20px 16px",
              borderRadius: 16,
              background: "rgba(4,22,48,0.45)",
              border: "1px solid rgba(255,255,255,0.16)",
              backdropFilter: "blur(8px)",
              opacity: 1 - progress(t, 3.78, 0.25, easeInOut),
              zIndex: 12,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Dot color={C.green} size={8} />
                <span style={{ fontFamily: FONT, fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: C.white }}>
                  LIVE ORDERS
                </span>
              </div>
              <span style={{ fontFamily: FONT, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "rgba(255,255,255,0.44)" }}>
                ILLUSTRATIVE FEED
              </span>
            </div>
            {[10482, 10483, 10484, 10485, 10486].map((order, index) => {
              const p = progress(t, 1.0 + index * 0.24, 0.35, easeOut);
              return (
                <div
                  key={order}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "9px 0",
                    borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.08)",
                    opacity: p,
                    transform: `translateX(${(1 - p) * -16}px)`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ color: C.green, fontSize: 13 }}>✓</span>
                    <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
                      ORDER #{order.toLocaleString("en-US")}
                    </span>
                  </div>
                  <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", color: "rgba(255,255,255,0.55)" }}>
                    {index % 2 === 0 ? "TRADITIONAL" : "LEMON PEPPER"} · 1 PURSE
                  </span>
                </div>
              );
            })}
          </div>

          {/* toasts */}
          <Toast x={620} y={704} start={1.2} hideAt={3.6}>Order confirmed</Toast>

          <Cursor x={620} y={642} scale={1.1} click={0.84 + progress(t, 1.15, 0.2, easeOut) * 0.16} />

          {/* sold-out slam */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1040,
              display: "flex",
              justifyContent: "center",
              zIndex: 40,
              pointerEvents: "none",
            }}
          >
            <div style={{ opacity: toSold }}>
              <Stamp start={3.95} color={C.white} size={102} rotate={-7} style={{ background: C.red, borderColor: C.white, outlineColor: C.white }}>
                SOLD OUT
              </Stamp>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 1300,
              textAlign: "center",
              zIndex: 18,
            }}
          >
            <MaskLine start={4.1} duration={0.55}>
              <Display size={148} color={C.yellow} style={{ textAlign: "center" }}>
                90 MINUTES.
              </Display>
            </MaskLine>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 17,
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.7)",
                textTransform: "uppercase",
                marginTop: 12,
                opacity: progress(t, 4.15, 0.3),
              }}
            >
              5,000 PURSES · GONE
            </div>
          </div>

          <Confetti start={4.0} count={44} />
          <Sweep start={4.0} duration={1.0} opacity={0.3} />
        </Stage>
      </AbsoluteFill>

      {/* ================= SECOND DROP / RESALE ================= */}
      <AbsoluteFill
        style={{
          opacity: toResale * (1 - toEnd),
          transform: `translateY(${(1 - toResale) * 90}px)`,
        }}
      >
        <Stage variant="night" accent={C.orange} accent2={C.purpleLight} glowX="62%" glowY="26%">
          <div style={{ position: "absolute", left: 58, top: 120, zIndex: 10 }}>
            <Kicker start={6.3} color={C.yellow}>
              AFTER THE SOLD-OUT
            </Kicker>
          </div>

          <div style={{ position: "absolute", left: 58, top: 230, zIndex: 10 }}>
            <MaskLine start={6.4} duration={0.55}>
              <Display size={92} color={C.white}>
                A SECOND
              </Display>
            </MaskLine>
            <MaskLine start={6.51} duration={0.55}>
              <Display size={92} color={C.white}>
                DROP. AND A
              </Display>
            </MaskLine>
            <MaskLine start={6.62} duration={0.55}>
              <Display size={92} color={C.yellow}>
                RESALE MARKET.
              </Display>
            </MaskLine>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 620,
              zIndex: 14,
            }}
          >
            <div
              style={{
                padding: "28px 28px 24px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.96)",
                boxShadow: "0 34px 80px rgba(0,0,0,0.3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.18em",
                      color: "rgba(7,24,47,0.44)",
                    }}
                  >
                    SECONDHAND LISTINGS
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 58,
                      fontWeight: 800,
                      letterSpacing: "-0.06em",
                      color: C.ink,
                      lineHeight: 0.95,
                      marginTop: 8,
                    }}
                  >
                    7×+
                  </div>
                  <div
                    style={{
                      fontFamily: FONT,
                      fontSize: 13,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      color: "rgba(7,24,47,0.48)",
                    }}
                  >
                    THE ORIGINAL $5.97
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px 14px",
                    borderRadius: 6,
                    background: C.yellow,
                    color: C.ink,
                    fontFamily: FONT,
                    fontSize: 12,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    transform: "rotate(2deg)",
                  }}
                >
                  LISTED AT 7×+
                </div>
              </div>

              {/* simple rising chart */}
              <svg width="100%" height="260" viewBox="0 0 860 260" style={{ marginTop: 18 }}>
                {[0, 1, 2, 3].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={30 + i * 58}
                    x2="860"
                    y2={30 + i * 58}
                    stroke="rgba(7,24,47,0.1)"
                    strokeWidth="1"
                  />
                ))}
                <path
                  d="M10 220 L210 216 L360 205 L500 178 L640 128 L748 86 L850 48"
                  fill="none"
                  stroke={C.orange}
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1200"
                  strokeDashoffset={1200 * (1 - progress(t, 6.9, 1.6, easeOut))}
                />
                <circle
                  cx="850"
                  cy="48"
                  r="14"
                  fill={C.yellow}
                  stroke={C.ink}
                  strokeWidth="4"
                  opacity={progress(t, 8.2, 0.3)}
                />
                <text x="10" y="250" fill="rgba(7,24,47,0.42)" fontFamily={FONT} fontSize="15" fontWeight="700">
                  SEPT 1
                </text>
                <text x="756" y="250" fill="rgba(7,24,47,0.42)" fontFamily={FONT} fontSize="15" fontWeight="700">
                  AFTER
                </text>
              </svg>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 54,
              right: 54,
              top: 1180,
              display: "flex",
              gap: 16,
              justifyContent: "center",
              zIndex: 14,
            }}
          >
            <PhotoCard
              src={IMG.purseLemon}
              width={330}
              height={230}
              start={7.1}
              rotate={-3}
              grade="vivid"
              scaleFrom={1.14}
              scaleTo={1.02}
              label="LEMON PEPPER"
              labelColor={C.orangeDeep}
            />
            <div
              style={{
                width: 330,
                height: 230,
                borderRadius: 18,
                background: "rgba(255,255,255,0.16)",
                border: "1px dashed rgba(255,255,255,0.4)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                transform: "rotate(3deg)",
              }}
            >
              <div style={{ fontFamily: FONT, fontSize: 44, fontWeight: 800, color: C.yellow }}>?</div>
              <div
                style={{
                  fontFamily: FONT,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.16em",
                  color: "rgba(255,255,255,0.66)",
                  textAlign: "center",
                }}
              >
                NEXT DROP
                <br />
                NOT ANNOUNCED HERE
              </div>
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 112,
              display: "flex",
              justifyContent: "center",
              zIndex: 16,
            }}
          >
            <Tag start={7.6} color={C.white} background="rgba(7,24,47,0.5)">
              SOURCE: MARKETING BREW · WALMART
            </Tag>
          </div>
        </Stage>
      </AbsoluteFill>

      {/* ================= THE INTERNET DID THIS ================= */}
      <AbsoluteFill
        style={{
          zIndex: 30,
          opacity: toEnd,
          transform: `translateX(${(1 - toEnd) * 200}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(150deg, ${C.yellow} 0%, #F1A228 48%, ${C.orange} 100%)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 42%, transparent 18%, rgba(180,83,31,0.18) 78%, rgba(120,50,10,0.3) 100%)",
          }}
        />

        <AbsoluteFill
          style={{
            padding: "160px 56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Reveal start={13.7} scaleFrom={0.8}>
            <Pill color={C.ink} style={{ background: C.white, fontSize: 13 }}>
              <Dot color={C.red} size={9} /> THE INTERNET DID THIS
            </Pill>
          </Reveal>
          <div style={{ height: 30 }} />
          <MaskLine start={13.85} duration={0.5}>
            <Display size={78} color={C.ink} style={{ textAlign: "center" }}>
              A DELI BAG
            </Display>
          </MaskLine>
          <MaskLine start={13.96} duration={0.5}>
            <Display size={78} color={C.ink} style={{ textAlign: "center" }}>
              BECAME A
            </Display>
          </MaskLine>
          <MaskLine start={14.07} duration={0.5}>
            <Display size={112} color={C.white} style={{ textAlign: "center" }}>
              STATUS SYMBOL.
            </Display>
          </MaskLine>
          <Reveal start={14.4} style={{ marginTop: 26 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 19,
                fontWeight: 600,
                letterSpacing: "0.15em",
                color: "rgba(7,24,47,0.66)",
                textTransform: "uppercase",
              }}
            >
              AND IT STARTED WITH A JOKE.
            </div>
          </Reveal>
        </AbsoluteFill>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
