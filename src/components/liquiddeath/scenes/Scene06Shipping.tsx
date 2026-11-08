import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  Container,
  Glow,
  Headline,
  Kicker,
  Numeral,
  Tag,
  UtilityNote,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const file = (path: string) => staticFile(path.replace(/^\//, ""));

const MAP = { x1: 54.0, y1: 23.6, cx: 39.5, cy: 9.5, x2: 23.0, y2: 28.2 };

const pointOnRoute = (u: number) => {
  const v = 1 - u;
  return {
    x: v * v * MAP.x1 + 2 * v * u * MAP.cx + u * u * MAP.x2,
    y: v * v * MAP.y1 + 2 * v * u * MAP.cy + u * u * MAP.y2,
  };
};

const MapPanel: React.FC<{ wide: boolean; compact?: boolean }> = ({ wide, compact = false }) => {
  const { t } = useTime();
  const route = progress(t, BEATS.shipping.route, 2.1, easeInOut);
  const u = ((t - BEATS.shipping.route) * 0.05) % 1;
  const containers = [0, 0.18, 0.36, 0.54, 0.72].map((offset) => pointOnRoute((u + offset) % 1));
  const marker = (x: number, y: number, color: string, delay: number) => {
    const p = progress(t, delay, 0.55, easeOut);
    return (
      <div
        key={`${x}-${y}`}
        style={{
          position: "absolute",
          left: `${x}%`,
          top: `${y}%`,
          width: 14,
          height: 14,
          transform: "translate(-50%, -50%)",
          opacity: p,
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: -10,
            borderRadius: "50%",
            border: `1px solid ${color}66`,
            transform: `scale(${0.7 + Math.sin(t * 2.4 + delay) * 0.12})`,
          }}
        />
        <div
          style={{
            width: 7,
            height: 7,
            margin: 3.5,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 16px ${color}`,
          }}
        />
      </div>
    );
  };

  return (
    <div
      style={{
        width: wide ? 980 : 920,
        height: compact && wide ? 560 : wide ? 630 : 510,
        position: "relative",
        border: `1px solid ${C.line}`,
        background: "linear-gradient(155deg, #0C0D10 0%, #08090B 60%, #060607 100%)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          opacity: 0.5,
        }}
      />
      <div style={{ position: "absolute", inset: "8% 5% 10%" }}>
        <Img
          src={file(IMG.worldMap)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "fill",
            filter: "invert(1) brightness(1.45) contrast(0.9)",
            mixBlendMode: "screen",
            opacity: 0.26,
          }}
        />
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", overflow: "visible" }}
        >
          <path
            d={`M ${MAP.x1} ${MAP.y1} Q ${MAP.cx} ${MAP.cy} ${MAP.x2} ${MAP.y2}`}
            fill="none"
            stroke="rgba(210,31,53,0.2)"
            strokeWidth="0.5"
            strokeDasharray="1.4 1.8"
          />
          <path
            d={`M ${MAP.x1} ${MAP.y1} Q ${MAP.cx} ${MAP.cy} ${MAP.x2} ${MAP.y2}`}
            fill="none"
            stroke={C.redBright}
            strokeWidth="0.75"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            strokeDashoffset={1 - route}
            style={{ filter: "drop-shadow(0 0 3px rgba(240,51,75,0.8))" }}
          />
          <path
            d={`M ${MAP.x1} ${MAP.y1} Q ${MAP.cx} ${MAP.cy} ${MAP.x2} ${MAP.y2}`}
            fill="none"
            stroke="rgba(255,255,255,0.32)"
            strokeWidth="0.22"
            pathLength={1}
            strokeDasharray="0.04 0.12"
            strokeDashoffset={0.03 - route * 0.14}
          />
        </svg>
        {marker(MAP.x1, MAP.y1, C.redBright, 0.35)}
        {marker(MAP.x2, MAP.y2, C.white, 0.55)}
      </div>

      <div style={{ position: "absolute", left: "56%", top: "11%", transform: "translateX(-50%)" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.redBright, whiteSpace: "nowrap" }}>
          AUSTRIA
        </div>
        <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>
          CANNING
        </div>
      </div>
      <div style={{ position: "absolute", left: "21%", top: "30%", transform: "translate(-50%, 0)" }}>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.white, whiteSpace: "nowrap" }}>
          USA
        </div>
        <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: "0.12em", color: C.dim, whiteSpace: "nowrap" }}>
          DISTRIBUTION
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: "36%",
          top: "12.5%",
          fontFamily: MONO,
          fontSize: 7.5,
          letterSpacing: "0.24em",
          color: "rgba(255,255,255,0.42)",
        }}
      >
        ATLANTIC
      </div>

      {containers.map((point, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            left: `${point.x}%`,
            top: `${point.y}%`,
            transform: "translate(-50%, -50%) rotate(-6deg)",
            opacity: 0.7 - index * 0.06,
            zIndex: 4,
          }}
        >
          <Container width={wide ? 34 : 28} color={index % 2 === 0 ? "#8E3A2F" : "#5E646B"} />
        </div>
      ))}

      <div style={{ position: "absolute", left: 16, bottom: 14, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 24, height: 1, background: C.red }} />
        <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: C.muted }}>
          OCEAN FREIGHT · PER CONTAINER
        </span>
      </div>
      <div style={{ position: "absolute", right: 16, top: 14, fontFamily: MONO, fontSize: 8, letterSpacing: "0.16em", color: C.dim }}>
        MAP: PUBLIC DOMAIN
      </div>
    </div>
  );
};

const CostPanel: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, BEATS.shipping.cost, 0.7, easeOut);
  const rise = progress(t, BEATS.shipping.impact, 1.3, easeOut);
  const fromH = 26;
  const toH = 26 + rise * 74;
  return (
    <div
      style={{
        width: wide ? 720 : 920,
        padding: wide ? "26px 28px 24px" : "22px 24px 22px",
        border: `1px solid ${C.line}`,
        background: "linear-gradient(160deg, rgba(23,24,28,0.95), rgba(9,10,12,0.96))",
        boxShadow: "0 30px 64px rgba(0,0,0,0.5)",
        opacity: p,
        transform: `translateY(${(1 - p) * 20}px)`,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.muted }}>
          OCEAN FREIGHT · CONTAINER COST
        </span>
        <Tag color={C.redBright} background={C.redSoft} style={{ fontSize: 8 }}>
          REPORTED
        </Tag>
      </div>
      <div style={{ height: 18 }} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: wide ? 24 : 18 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: C.dim }}>BEFORE</div>
          <Numeral style={{ fontSize: wide ? 60 : 54, color: C.silver, marginTop: 8, display: "block" }}>
            {COPY.costFrom}
          </Numeral>
          <div style={{ marginTop: 12, height: fromH, width: "56%", background: "linear-gradient(180deg, #8B9197, #3D4248)" }} />
        </div>
        <div style={{ paddingBottom: wide ? 38 : 32, color: C.redBright, fontFamily: FONT, fontSize: 28 }}>→</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: C.redBright }}>DURING COVID</div>
          <Numeral style={{ fontSize: wide ? 76 : 70, color: C.redBright, marginTop: 8, display: "block", textShadow: `0 0 30px ${C.red}44` }}>
            {COPY.costTo}
          </Numeral>
          <div
            style={{
              marginTop: 12,
              height: fromH + (toH - fromH),
              width: "92%",
              background: `linear-gradient(180deg, ${C.redBright}, ${C.red} 54%, #5D0E19)`,
              boxShadow: `0 0 26px ${C.red}44`,
            }}
          />
        </div>
      </div>
      <div style={{ height: 16 }} />
      <div style={{ fontFamily: FONT, fontSize: wide ? 14 : 13, lineHeight: 1.55, color: C.muted }}>
        Container costs reportedly jumped from around four thousand to
        thirteen thousand dollars. The product still sold. The maths stopped
        working.
      </div>
      <div
        style={{
          position: "absolute",
          right: 18,
          top: 52,
          fontFamily: MONO,
          fontSize: 7.5,
          letterSpacing: "0.12em",
          color: C.dim,
          writingMode: "vertical-rl",
        }}
      >
        REPORTED FIGURE · COVID DISRUPTION
      </div>
    </div>
  );
};

const Dashboard: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, BEATS.shipping.dashboard, 0.8, easeOut);
  const bars = 16;
  return (
    <div
      style={{
        width: wide ? 720 : 920,
        padding: wide ? "24px 26px" : "22px 24px",
        border: `1px solid ${C.line}`,
        background: "linear-gradient(160deg, rgba(20,21,25,0.96), rgba(9,10,12,0.96))",
        opacity: p,
        transform: `translateY(${(1 - p) * 18}px)`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.muted }}>
          UNIT ECONOMICS
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.redBright }}>
          UNDER PRESSURE
        </span>
      </div>
      <div style={{ height: 20 }} />
      <div style={{ display: "flex", gap: wide ? 34 : 26 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.white }}>SALES VOLUME</span>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.green }}>↑</span>
          </div>
          <div style={{ height: wide ? 104 : 120, display: "flex", alignItems: "flex-end", gap: 4 }}>
            {Array.from({ length: bars }, (_, index) => {
              const bp = progress(t, BEATS.shipping.dashboard + 0.2 + index * 0.035, 0.45);
              const h = 12 + (index / bars) * 78;
              return (
                <div
                  key={index}
                  style={{
                    flex: 1,
                    height: `${h * bp}%`,
                    background: `linear-gradient(180deg, ${C.silver}, ${C.dim})`,
                    opacity: 0.4 + (index / bars) * 0.6,
                  }}
                />
              );
            })}
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontFamily: FONT, fontSize: 13, fontWeight: 600, color: C.white }}>PROFIT / CASE</span>
            <span style={{ fontFamily: MONO, fontSize: 9, color: C.redBright }}>↓</span>
          </div>
          <div style={{ height: wide ? 104 : 120, position: "relative" }}>
            <svg viewBox="0 0 200 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%" }}>
              <defs>
                <linearGradient id="profitFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.red} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={C.red} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0 26 L32 30 L64 48 L96 62 L128 74 L160 86 L200 94 L200 100 L0 100 Z" fill="url(#profitFill)" />
              <path
                d="M0 26 L32 30 L64 48 L96 62 L128 74 L160 86 L200 94"
                fill="none"
                stroke={C.redBright}
                strokeWidth="2.2"
                strokeDasharray="260"
                strokeDashoffset={260 - progress(t, BEATS.shipping.dashboard + 0.3, 1.5, easeInOut) * 260}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
        <Tag color={C.green} background="rgba(102,199,154,0.08)" style={{ fontSize: 8 }}>VOLUME UP</Tag>
        <Tag color={C.redBright} background={C.redSoft} style={{ fontSize: 8 }}>MARGIN DOWN</Tag>
      </div>
    </div>
  );
};

export const Scene06Shipping: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const costIn = t >= BEATS.shipping.cost;
  const dashIn = t >= BEATS.shipping.dashboard;
  const finalIn = progress(t, BEATS.shipping.losses, 0.7, easeOut);
  const mapOut = progress(t, BEATS.shipping.losses - 0.2, 0.6, easeInOut);

  return (
    <Backdrop glowX="46%" glowY="30%" glowOpacity={0.1}>
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 64 : 120,
          zIndex: 8,
        }}
      >
        <Kicker start={0.25}>THE HIDDEN BUSINESS PROBLEM</Kicker>
        <div style={{ height: 16 }} />
        <Headline
          lines={wide ? ["THE COST OF", "GETTING IT THERE."] : ["THE COST OF", "GETTING IT", "THERE."]}
          size={wide ? 64 : 48}
          start={0.35}
        />
      </div>

      {wide ? (
        <>
          <div style={{ position: "absolute", left: stage.margin, top: 292, opacity: 1 - mapOut * 0.5 }}>
            <MapPanel wide />
          </div>
          <div style={{ position: "absolute", right: stage.margin, top: 292, display: "flex", flexDirection: "column", gap: 18 }}>
            {costIn ? <CostPanel wide /> : null}
            {dashIn ? <Dashboard wide /> : null}
          </div>
        </>
      ) : (
        <AbsoluteFill>
          {!costIn ? (
            <div style={{ position: "absolute", left: stage.margin, top: 400 }}>
              <MapPanel wide={false} />
            </div>
          ) : null}
          {costIn && !dashIn ? (
            <div style={{ position: "absolute", left: stage.margin, top: 480 }}>
              <CostPanel wide={false} />
            </div>
          ) : null}
          {dashIn ? (
            <div style={{ position: "absolute", left: stage.margin, top: 440 }}>
              <Dashboard wide={false} />
            </div>
          ) : null}
        </AbsoluteFill>
      )}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(5,5,6,0.2) 0%, rgba(5,5,6,0.72) 58%, rgba(5,5,6,0.96) 100%)",
          opacity: finalIn,
          zIndex: 20,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 110 : 330,
          zIndex: 22,
          opacity: finalIn,
          transform: `translateY(${(1 - finalIn) * 26}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 20,
          }}
        >
          <div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.22em", color: C.redBright, marginBottom: 12 }}>
              THE CONTRADICTION
            </div>
            <Headline
              lines={COPY.losses}
              size={wide ? 94 : 62}
              start={BEATS.shipping.losses + 0.1}
              accentLast
            />
          </div>
          <div style={{ maxWidth: wide ? 420 : 300, paddingBottom: 8 }}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 18 : 16, lineHeight: 1.55, color: C.muted }}>
              Demand was not the problem. The cost of getting the product to
              the customer was.
            </div>
            <UtilityNote style={{ marginTop: 12 }}>
              REPORTED COST JUMP · NOT AN AUDITED FIGURE
            </UtilityNote>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: stage.margin,
          bottom: wide ? 44 : 180,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: C.dim,
          zIndex: 23,
        }}
      >
        AUSTRIA → UNITED STATES · OCEAN FREIGHT
      </div>

      <Glow x="50%" y="82%" size={46} color={C.red} opacity={finalIn * 0.16} zIndex={21} />
    </Backdrop>
  );
};
