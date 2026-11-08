import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  BrandMark,
  Can,
  Display,
  Glow,
  Kicker,
  MaskLine,
  Reveal,
  Scratches,
  SkullEmblem,
  Sweep,
  Tag,
  clamp,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const file = (path: string) => staticFile(path.replace(/^\//, ""));

const PullTab: React.FC<{ open: number }> = ({ open }) => (
  <svg
    width="126"
    height="168"
    viewBox="0 0 126 168"
    style={{
      position: "absolute",
      left: "50%",
      top: "3.4%",
      transform: `translateX(-50%) translateY(${-open * 18}px) rotateX(${open * 62}deg)`,
      transformOrigin: "50% 82%",
      filter: "drop-shadow(0 8px 10px rgba(0,0,0,0.55))",
      opacity: 0.92,
      zIndex: 4,
    }}
  >
    <defs>
      <linearGradient id="tabMetal" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#F4E7C4" />
        <stop offset="34%" stopColor="#C9A96A" />
        <stop offset="62%" stopColor="#8C6A36" />
        <stop offset="100%" stopColor="#E6D3A4" />
      </linearGradient>
    </defs>
    <path
      d="M63 6 C92 6 112 27 112 56 C112 77 98 93 78 101 L78 124 C78 140 71 153 63 160 C55 153 48 140 48 124 L48 101 C28 93 14 77 14 56 C14 27 34 6 63 6 Z"
      fill="url(#tabMetal)"
      stroke="rgba(255,255,255,0.36)"
      strokeWidth="1.4"
    />
    <ellipse cx="63" cy="53" rx="24" ry="17" fill="rgba(30,24,16,0.6)" />
    <ellipse cx="63" cy="53" rx="18" ry="12" fill="rgba(10,10,10,0.8)" />
    <path d="M48 91 L78 91" stroke="rgba(60,45,24,0.5)" strokeWidth="1.2" />
  </svg>
);

const PourMoment: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const open = progress(t, BEATS.impossible.open, 0.42, easeOut);
  const pour = progress(t, BEATS.impossible.pour, 0.3, easeOut);
  const splash = progress(t, BEATS.impossible.pour + 0.35, 1.4, easeOut);
  const push = progress(t, BEATS.impossible.open, 2.5, easeInOut);
  const flash = progress(t, BEATS.impossible.flash, 0.16);

  return (
    <AbsoluteFill style={{ backgroundColor: "#040405", zIndex: 30, overflow: "hidden" }}>
      <Glow x="50%" y="18%" size={54} color="#FFFFFF" opacity={0.09} />
      <Glow x="50%" y="78%" size={42} color={C.red} opacity={0.09} />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: wide ? -180 : -120,
          transform: `translateX(-50%) scale(${1.04 + push * 0.08})`,
          height: wide ? 1760 : 2280,
          opacity: 0.98,
        }}
      >
        <Img
          src={file(IMG.sparkling)}
          style={{
            height: "100%",
            width: "auto",
            filter: "brightness(0.92) contrast(1.08) drop-shadow(0 40px 80px rgba(0,0,0,0.8))",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "2.5%",
          width: wide ? 640 : 520,
          height: wide ? 250 : 230,
          transform: "translateX(-50%)",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(255,255,255,0.20), transparent 62%)",
          filter: "blur(14px)",
        }}
      />
      <PullTab open={open} />

      {/* The pour. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "11.5%",
          width: wide ? 74 : 62,
          height: `${pour * 76}%`,
          transform: "translateX(-50%)",
          background:
            "linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(238,246,248,0.72) 22%, rgba(255,255,255,0.96) 50%, rgba(210,227,232,0.62) 78%, rgba(255,255,255,0.04) 100%)",
          filter: "blur(0.7px)",
          boxShadow: "0 0 26px rgba(220,240,245,0.25)",
          opacity: pour,
          transformOrigin: "top center",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "11.5%",
          width: wide ? 210 : 170,
          height: `${pour * 72}%`,
          transform: "translateX(-50%)",
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.1) 40%, rgba(255,255,255,0.16) 50%, rgba(255,255,255,0.08) 60%, transparent)",
          filter: "blur(9px)",
          opacity: pour * 0.8,
        }}
      />

      {/* Splash. */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "84%",
          width: (wide ? 420 : 330) * (0.5 + splash * 0.9),
          height: (wide ? 68 : 54) * (0.5 + splash * 0.8),
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          border: `2px solid rgba(235,247,250,${0.55 * (1 - splash)})`,
          opacity: splash > 0 ? 1 : 0,
          filter: "blur(1px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "85%",
          width: wide ? 280 : 220,
          height: wide ? 38 : 30,
          transform: "translate(-50%, -50%)",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(255,255,255,0.55), transparent 70%)",
          filter: "blur(6px)",
          opacity: pour,
        }}
      />
      {Array.from({ length: 18 }, (_, index) => {
        const angle = (index / 18) * Math.PI * 2;
        const radius = (wide ? 90 : 70) + index * 3.4;
        const lift = 34 + (index % 5) * 12;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `calc(50% + ${Math.cos(angle) * radius * splash}px)`,
              top: `calc(84% - ${Math.sin(angle) * lift * splash}px)`,
              width: 5 + (index % 4),
              height: 7 + (index % 3),
              borderRadius: "50%",
              background: "rgba(255,255,255,0.8)",
              boxShadow: "0 0 8px rgba(255,255,255,0.3)",
              opacity: splash > 0.1 ? 0.75 * (1 - splash * 0.65) : 0,
              transform: "rotate(18deg)",
            }}
          />
        );
      })}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 54 : 130,
          textAlign: "center",
          fontFamily: FONT,
          fontSize: wide ? 18 : 16,
          fontWeight: 600,
          letterSpacing: "0.42em",
          color: C.silver,
          opacity: 0.72,
        }}
      >
        OPEN. POUR. REPEAT.
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#FFFFFF",
          opacity: flash * 0.28,
          pointerEvents: "none",
        }}
      />
      <Scratches opacity={0.4} />
    </AbsoluteFill>
  );
};

export const Scene01Impossible: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const canIn = progress(t, BEATS.impossible.canIn, 1.25, easeOut);
  const reveal = progress(t, BEATS.impossible.reveal, 0.9, easeOut);
  const sweep = progress(t, 0.8, 4.0, easeInOut);
  const float = Math.sin(t * 0.9) * 5;
  const titleSize = wide ? 158 : 104;
  const canHeight = wide ? 790 : 690;
  const heroOpacity = 1 - progress(t, BEATS.impossible.open - 0.08, 0.26, easeInOut);

  const titleStyle: CSSProperties = wide
    ? { position: "absolute", left: stage.margin, top: 246, zIndex: 6 }
    : { position: "absolute", left: stage.margin, top: 236, zIndex: 6 };

  return (
    <Backdrop glowX="70%" glowY="44%" glowOpacity={0.14}>
      <div style={{ opacity: heroOpacity }}>
        <div
          style={{
            position: "absolute",
            left: wide ? "52%" : "50%",
            top: wide ? "50%" : "55%",
            transform: "translate(-50%, -50%)",
            opacity: 0.26,
            zIndex: 2,
          }}
        >
          <SkullEmblem size={wide ? 720 : 700} color="#C9C4B9" glow={0.9} />
        </div>

        <div style={titleStyle}>
          <Kicker start={0.55}>LIQUID DEATH · BUSINESS CASE STUDY</Kicker>
          <div style={{ height: wide ? 34 : 24 }} />
          {COPY.title.map((line, index) => (
            <MaskLine
              key={line}
              start={0.75 + index * 0.14}
              duration={0.9}
              style={{ marginTop: index === 0 ? 0 : wide ? -18 : -10 }}
            >
              <Display
                size={titleSize}
                accent={index === 1}
                style={{ letterSpacing: "-0.06em", lineHeight: 0.82 }}
              >
                {line}
              </Display>
            </MaskLine>
          ))}
          <div style={{ height: wide ? 34 : 26 }} />
          <Reveal start={1.6} duration={0.6}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <BrandMark width={wide ? 280 : 220} opacity={0.95} />
            </div>
          </Reveal>
          <div style={{ height: wide ? 28 : 22 }} />
          <Reveal start={BEATS.impossible.tagline} duration={0.6}>
            <Tag
              style={{
                fontSize: wide ? 14 : 12,
                padding: wide ? "12px 16px" : "10px 13px",
                letterSpacing: "0.2em",
                color: C.white,
                border: `1px solid ${C.red}55`,
                background: C.redSoft,
              }}
            >
              {COPY.tagline}
            </Tag>
          </Reveal>
        </div>

        <div
          style={{
            position: "absolute",
            right: wide ? "7%" : "50%",
            top: wide ? "50%" : "58%",
            transform: wide
              ? `translate(0, -50%) translateY(${float}px) scale(${0.86 + canIn * 0.14})`
              : `translate(50%, -50%) translateY(${float}px) scale(${0.84 + canIn * 0.16})`,
            opacity: clamp(canIn * 1.15),
            zIndex: 5,
          }}
        >
          <Can
            src={IMG.sparkling}
            height={canHeight}
            rotateY={-18 + canIn * 10}
            sweep={sweep}
            droplets={1}
            glow={C.red}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: stage.margin,
            bottom: wide ? 66 : 220,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: reveal,
            zIndex: 7,
          }}
        >
          <div style={{ width: 34, height: 1, background: C.red }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.2em",
              color: C.muted,
            }}
          >
            90 SECONDS · ONE BRAND
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            right: stage.margin,
            bottom: wide ? 66 : 220,
            textAlign: "right",
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.16em",
            color: C.dim,
            opacity: 0.8,
          }}
        >
          PRODUCT IMAGERY © LIQUID DEATH
        </div>

        <Sweep start={0.9} duration={1.8} opacity={0.12} />
      </div>

      {t >= BEATS.impossible.open ? <PourMoment wide={wide} /> : null}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.red}, transparent)`,
          opacity: 0.5,
          zIndex: 100,
        }}
      />
    </Backdrop>
  );
};
