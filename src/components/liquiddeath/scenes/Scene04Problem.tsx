import type { CSSProperties, ReactNode } from "react";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  Can,
  Glow,
  Headline,
  Kicker,
  Reveal,
  Tag,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const EmptyCan: React.FC<{ height: number; opacity?: number }> = ({ height, opacity = 1 }) => {
  const width = height * 0.46;
  return (
    <div style={{ width, height, position: "relative", opacity, flexShrink: 0 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: height * 0.09,
          borderRadius: "42% 42% 12% 12% / 70% 70% 30% 30%",
          background: "linear-gradient(180deg, #E1E5E8, #8E959C 48%, #4E545A)",
          border: "1px solid rgba(255,255,255,0.24)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "4%",
          right: "4%",
          top: height * 0.07,
          bottom: height * 0.025,
          borderRadius: `${width * 0.16}px ${width * 0.16}px ${width * 0.12}px ${width * 0.12}px`,
          background:
            "linear-gradient(90deg, #4C5258 0%, #AEB4BA 18%, #E7EAEC 36%, #C4C9CD 52%, #747A81 76%, #3D4248 100%)",
          boxShadow:
            "inset 8px 0 16px rgba(255,255,255,0.22), inset -10px 0 20px rgba(0,0,0,0.42)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "10%",
            top: 0,
            bottom: 0,
            width: "10%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)",
            filter: "blur(2px)",
          }}
        />
      </div>
    </div>
  );
};

const Conveyor: React.FC<{ wide: boolean; speed?: number }> = ({ wide, speed = 1 }) => {
  const { t } = useTime();
  const beltY = wide ? "70%" : "78%";
  const canH = wide ? 126 : 110;
  const offset = ((t * 128 * speed) % 190) - 190;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: beltY, height: wide ? 300 : 260 }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: canH + 24,
          height: wide ? 74 : 62,
          background:
            "linear-gradient(180deg, #2A2D31 0%, #15171A 18%, #0B0C0E 52%, #1A1C20 100%)",
          borderTop: "2px solid rgba(220,225,230,0.22)",
          boxShadow: "0 24px 44px rgba(0,0,0,0.6)",
        }}
      />
      <div style={{ position: "absolute", left: 0, right: 0, top: canH + 46, height: 26, overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            gap: 0,
            transform: `translateX(${-((t * 90 * speed) % 52)}px)`,
            opacity: 0.7,
          }}
        >
          {Array.from({ length: 90 }, (_, index) => (
            <div
              key={index}
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.16)",
                background: "radial-gradient(circle at 40% 32%, #3A3E43, #101113 68%)",
                marginRight: 26,
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 14,
          height: canH + 4,
          overflow: "hidden",
          maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: wide ? 70 : 46, transform: `translateX(${offset}px)` }}>
          {Array.from({ length: wide ? 15 : 12 }, (_, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <EmptyCan height={canH} opacity={0.9} />
              <div
                style={{
                  width: canH * 0.48,
                  height: 6,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  filter: "blur(2px)",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {[12, 40, 68, 88].map((x, index) => (
        <div
          key={x}
          style={{
            position: "absolute",
            left: `${x}%`,
            top: -230,
            bottom: 0,
            width: 2,
            background: "linear-gradient(180deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 54,
              left: -5,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: index % 2 === 0 ? C.red : C.amber,
              boxShadow: `0 0 16px ${index % 2 === 0 ? C.red : C.amber}`,
              opacity: 0.5 + Math.sin(t * 3 + index) * 0.3,
            }}
          />
        </div>
      ))}
    </div>
  );
};

const CardShell: React.FC<{
  children: ReactNode;
  width: number;
  height: number;
  start: number;
  style?: CSSProperties;
  label: string;
  index: string;
}> = ({ children, width, height, start, style, label, index }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.72, easeOut);
  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        opacity: p,
        transform: `translateY(${(1 - p) * 22}px) scale(${0.98 + p * 0.02})`,
        background: "linear-gradient(158deg, rgba(23,25,29,0.94), rgba(10,11,13,0.94))",
        border: `1px solid ${C.line}`,
        boxShadow: "0 28px 64px rgba(0,0,0,0.48)",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          borderBottom: `1px solid ${C.lineSoft}`,
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.2em", color: C.muted }}>{label}</span>
        <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.2em", color: C.redBright }}>{index}</span>
      </div>
      <div style={{ position: "absolute", inset: "54px 18px 18px" }}>{children}</div>
    </div>
  );
};

const DocPanel: React.FC<{ wide: boolean; start: number }> = ({ wide, start }) => {
  const { t } = useTime();
  const scan = progress(t, start + 0.3, 2.4, easeInOut);
  const rows = [
    ["MEDIUM", "STILL WATER + ALUMINUM"],
    ["FORMAT", "12 FL OZ SLEEK CAN"],
    ["SCALE", "NATIONAL LAUNCH"],
    ["STATUS", "NO SIMPLE MATCH"],
  ];
  return (
    <CardShell
      width={wide ? 520 : 920}
      height={wide ? 390 : 400}
      start={start}
      label="PRODUCTION REQUIREMENTS"
      index="01"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: wide ? 13 : 14 }}>
        {rows.map(([key, value], index) => {
          const p = progress(t, start + 0.2 + index * 0.14, 0.4);
          const bad = index === 3;
          return (
            <div
              key={key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 18,
                paddingBottom: 10,
                borderBottom: `1px solid ${C.lineSoft}`,
                opacity: p,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.dim }}>{key}</span>
              <span
                style={{
                  fontFamily: FONT,
                  fontSize: wide ? 13 : 14,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: bad ? C.redBright : C.silver,
                  textAlign: "right",
                }}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 8.5, color: C.dim, letterSpacing: "0.16em" }}>SEARCH</span>
          <span style={{ fontFamily: MONO, fontSize: 8.5, color: C.redBright, letterSpacing: "0.16em" }}>HARD</span>
        </div>
        <div style={{ height: 4, background: "rgba(255,255,255,0.07)", position: "relative", overflow: "hidden" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${scan * 100}%`,
              background: `linear-gradient(90deg, ${C.red}, ${C.redBright})`,
            }}
          />
        </div>
      </div>
    </CardShell>
  );
};

const FundingPanel: React.FC<{ wide: boolean; start: number }> = ({ wide, start }) => {
  const { t } = useTime();
  const fill = progress(t, start + 0.6, 1.6, easeOut) * 0.16;
  return (
    <CardShell
      width={wide ? 430 : 920}
      height={wide ? 390 : 380}
      start={start}
      label="PITCH / 2017"
      index="02"
    >
      <div style={{ fontFamily: FONT, fontSize: wide ? 26 : 30, fontWeight: 700, color: C.white, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
        Water.
        <br />
        In a can.
        <br />
        With a skull.
      </div>
      <div style={{ height: 18 }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.16em", color: C.dim }}>CONVICTION</span>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", color: C.redBright }}>UNPROVEN</span>
      </div>
      <div style={{ height: 8 }} />
      <div style={{ height: 12, border: `1px solid ${C.line}`, background: "rgba(255,255,255,0.025)", position: "relative" }}>
        <div
          style={{
            width: `${fill * 100}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${C.red}, ${C.redBright})`,
            boxShadow: `0 0 16px ${C.red}55`,
          }}
        />
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 8 }}>
        {Array.from({ length: 24 }, (_, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: 2,
              background: index < Math.round(fill * 24) ? C.red : "rgba(255,255,255,0.07)",
            }}
          />
        ))}
      </div>
      <div style={{ marginTop: 18, fontFamily: FONT, fontSize: wide ? 13 : 14, lineHeight: 1.5, color: C.muted }}>
        Investors were not automatically convinced anyone wanted this product.
      </div>
    </CardShell>
  );
};

const PitchIllustration: React.FC<{ wide: boolean; start: number }> = ({ wide, start }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.8, easeOut);
  const beam = 0.8 + Math.sin(t * 1.6) * 0.08;
  return (
    <div
      style={{
        width: wide ? 560 : 920,
        height: wide ? 300 : 330,
        position: "relative",
        opacity: p,
        overflow: "hidden",
        border: `1px solid ${C.line}`,
        background: "linear-gradient(180deg, #0B0C0E, #060607)",
      }}
    >
      <Glow x="50%" y="10%" size={44} color="#FFFFFF" opacity={0.06} />
      <div
        style={{
          position: "absolute",
          left: "-16%",
          right: "-16%",
          top: "-26%",
          height: "120%",
          background: `linear-gradient(180deg, rgba(210,31,53,${0.18 * beam}) 0%, transparent 66%)`,
          clipPath: "polygon(42% 0%, 58% 0%, 96% 100%, 4% 100%)",
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 26,
          transform: "translateX(-50%)",
          width: wide ? 180 : 220,
          height: wide ? 104 : 120,
          border: `1px solid ${C.line}`,
          background: "rgba(10,11,13,0.75)",
          padding: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Can src={IMG.sparkling} height={wide ? 84 : 96} droplets={0} reflection={false} shadow={false} glow="" />
      </div>
      <div
        style={{
          position: "absolute",
          left: wide ? "52%" : "56%",
          bottom: 0,
          width: wide ? 34 : 40,
          height: wide ? 112 : 128,
          background: "linear-gradient(180deg, #101113, #050506)",
          borderRadius: "50% 50% 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: wide ? "36%" : "40%",
          bottom: 0,
          width: wide ? 30 : 34,
          height: wide ? 100 : 112,
          background: "linear-gradient(180deg, #0C0D0F, #050506)",
          borderRadius: "50% 50% 0 0",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 20,
          right: 20,
          bottom: 18,
          display: "flex",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {Array.from({ length: 18 }, (_, index) => (
          <div
            key={index}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "#15171A",
              opacity: 0.8,
            }}
          />
        ))}
      </div>
      <div style={{ position: "absolute", left: 14, top: 12, fontFamily: MONO, fontSize: 8, letterSpacing: "0.16em", color: C.dim }}>
        ILLUSTRATION
      </div>
    </div>
  );
};

export const Scene04Problem: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const docsIn = progress(t, BEATS.problem.docs, 0.8);
  const fundingIn = progress(t, BEATS.problem.funding, 0.8);
  const pitchIn = progress(t, BEATS.problem.pitch, 0.8);
  const headlineSize = wide ? 78 : 52;

  return (
    <Backdrop glowX="24%" glowY="24%" glowOpacity={0.09} accent={C.red}>
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 78 : 150,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div>
          <Kicker start={0.2}>THE BUSINESS REALITY</Kicker>
          <div style={{ height: 18 }} />
          <Headline
            lines={["NO EASY", "MANUFACTURING."]}
            size={headlineSize}
            start={0.35}
            style={{ maxWidth: wide ? 780 : 900 }}
          />
        </div>
        <Reveal start={0.6} duration={0.6} style={{ display: wide ? "block" : "none" }}>
          <Tag color={C.redBright} background={C.redSoft} border={`${C.red}55`}>
            HARD PROBLEM · NOT HYPE
          </Tag>
        </Reveal>
      </div>

      <Conveyor wide={wide} />

      {wide ? (
        <>
          <div style={{ position: "absolute", left: stage.margin, top: 360 }}>
            {docsIn > 0 ? <DocPanel wide start={BEATS.problem.docs} /> : null}
          </div>
          <div style={{ position: "absolute", left: 672, top: 360 }}>
            {fundingIn > 0 ? <FundingPanel wide start={BEATS.problem.funding} /> : null}
          </div>
          <div style={{ position: "absolute", left: 1150, top: 400 }}>
            {pitchIn > 0 ? <PitchIllustration wide start={BEATS.problem.pitch} /> : null}
          </div>
        </>
      ) : (
        <div
          style={{
            position: "absolute",
            left: stage.margin,
            right: stage.margin,
            top: 430,
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {docsIn > 0 ? <DocPanel wide={false} start={BEATS.problem.docs} /> : null}
          {fundingIn > 0 ? <FundingPanel wide={false} start={BEATS.problem.funding} /> : null}
          {pitchIn > 0 ? <PitchIllustration wide={false} start={BEATS.problem.pitch} /> : null}
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 38 : 190,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          opacity: progress(t, 3.4, 0.8),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 6, height: 6, background: C.red }} />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: C.muted }}>
            SUPPLY · CAPITAL · CONVICTION
          </span>
        </div>
        <span style={{ fontFamily: FONT, fontSize: wide ? 15 : 13, color: C.muted }}>
          {COPY.demand[0]}
        </span>
      </div>
    </Backdrop>
  );
};
