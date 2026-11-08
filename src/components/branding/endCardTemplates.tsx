import type { CSSProperties } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BRAND, type EndCardTemplateId } from "../../config/brand";
import { FONT_STACK } from "../../config/airbnb";

/**
 * The five closing-screen templates.
 *
 * Every template renders exactly two brand elements: the avatar image and the
 * bold SIMPLEDEAV wordmark. The variants change composition, scale, light and
 * reveal only. Do not add labels, handles, monograms, tags, URLs or fine print.
 *
 * Visual grammar:
 *  - Aurora    · centred portrait, ring of light, small precise signature
 *  - Atlas     · architectural grid, small seal, measured baseline
 *  - Axis      · horizontal lockup, squared portrait, hairline rule
 *  - Editorial · left-aligned stack, margin frame, directional light
 *  - Orbit     · orbital rings, star field, wide-tracked signature
 */

export type EndCardRenderProps = {
  displayName: string;
  accent: string;
  wide: boolean;
  avatarHidden: boolean;
  avatarOk: boolean;
  onAvatarError: () => void;
  /** Scene-local frame. */
  localFrame: number;
  fps: number;
  markProgress: number;
  wordProgress: number;
  settle: number;
  transparentBackground: boolean;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const alpha = (hex: string, value: number) => {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${value})`;
};

/* ------------------------------------------------------------------ */
/* Shared stage                                                       */
/* ------------------------------------------------------------------ */

const Stage: React.FC<{
  accent: string;
  transparentBackground: boolean;
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ accent, transparentBackground, children, style }) => (
  <AbsoluteFill
    style={{
      backgroundColor: transparentBackground ? "transparent" : "#040506",
      overflow: "hidden",
      ...style,
    }}
  >
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background: `radial-gradient(ellipse at 50% 68%, ${alpha(
          accent,
          0.055,
        )} 0%, transparent 48%)`,
      }}
    />
    {children}
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        background:
          "radial-gradient(ellipse at 50% 46%, transparent 34%, rgba(0,0,0,0.7) 100%)",
        zIndex: 70,
      }}
    />
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        backgroundImage:
          "repeating-linear-gradient(180deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 6px)",
        opacity: 0.018,
        mixBlendMode: "overlay",
        zIndex: 75,
      }}
    />
    <AbsoluteFill
      style={{
        pointerEvents: "none",
        opacity: 0.05,
        mixBlendMode: "overlay",
        zIndex: 80,
      }}
    >
      <Img
        src={staticFile("images/grain.png")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </AbsoluteFill>
  </AbsoluteFill>
);

const Glow: React.FC<{
  x: string;
  y: string;
  size: number;
  color: string;
  opacity: number;
  zIndex?: number;
}> = ({ x, y, size, color, opacity, zIndex = 0 }) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(circle at ${x} ${y}, ${color} 0%, transparent ${size}%)`,
      opacity,
      zIndex,
    }}
  />
);

const Rule: React.FC<{
  width: number | string;
  accent: string;
  progress: number;
  thickness?: number;
  style?: CSSProperties;
}> = ({ width, accent, progress, thickness = 1, style }) => (
  <div
    style={{
      width,
      maxWidth: "100%",
      height: thickness,
      background: `linear-gradient(90deg, transparent 0%, ${alpha(
        accent,
        0.12,
      )} 18%, ${alpha(accent, 0.9)} 50%, ${alpha(accent, 0.12)} 82%, transparent 100%)`,
      transform: `scaleX(${clamp01(progress)})`,
      opacity: clamp01(progress * 1.4),
      ...style,
    }}
  />
);

const Cross: React.FC<{
  accent: string;
  progress: number;
  size?: number;
  style?: CSSProperties;
}> = ({ accent, progress, size = 14, style }) => (
  <div
    style={{
      position: "absolute",
      width: size,
      height: size,
      opacity: clamp01(progress * 1.5) * 0.7,
      ...style,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: 0,
        bottom: 0,
        width: 1,
        backgroundColor: alpha(accent, 0.55),
        transform: "translateX(-0.5px)",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: alpha(accent, 0.55),
        transform: "translateY(-0.5px)",
      }}
    />
  </div>
);

/* ------------------------------------------------------------------ */
/* Shared brand elements                                              */
/* ------------------------------------------------------------------ */

const Avatar: React.FC<{
  size: number;
  accent: string;
  progress: number;
  ok: boolean;
  onError: () => void;
  shape?: "circle" | "squircle";
  style?: CSSProperties;
}> = ({ size, accent, progress, ok, onError, shape = "circle", style }) => {
  const radius = shape === "circle" ? "50%" : Math.round(size * 0.27);
  const visible = clamp01(progress * 1.7);
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        padding: Math.max(3, Math.round(size * 0.026)),
        background: `linear-gradient(145deg, rgba(255,255,255,0.28), rgba(255,255,255,0.05) 46%, ${alpha(
          accent,
          0.24,
        )})`,
        boxShadow: `0 0 0 1px rgba(255,255,255,0.13), 0 0 ${Math.round(
          size * 0.42,
        )}px ${alpha(accent, 0.2)}, 0 22px ${Math.round(size * 0.34)}px rgba(0,0,0,0.55)`,
        opacity: visible,
        transform: `scale(${0.84 + visible * 0.16})`,
        ...style,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          borderRadius: radius,
          overflow: "hidden",
          backgroundColor: "#0C0F13",
        }}
      >
        {ok ? (
          <Img
            src={staticFile(BRAND.avatarPath.replace(/^\//, ""))}
            onError={onError}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: radius,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, transparent 34%, transparent 68%, rgba(0,0,0,0.34) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
};

const Wordmark: React.FC<{
  text: string;
  size: number;
  weight: number;
  tracking: number;
  progress: number;
  align?: CSSProperties["textAlign"];
  style?: CSSProperties;
}> = ({
  text,
  size,
  weight,
  tracking,
  progress,
  align = "center",
  style,
}) => {
  const visible = clamp01(progress * 1.6);
  const trackingNow = tracking + 0.055 * (1 - clamp01(progress));
  return (
    <div
      style={{
        overflow: "hidden",
        paddingBottom: size * 0.1,
        marginBottom: -size * 0.1,
        width: "100%",
        ...style,
      }}
    >
      <div
        style={{
          transform: `translateY(${(1 - clamp01(progress)) * 116}%)`,
          opacity: visible,
          fontFamily: FONT_STACK,
          fontSize: size,
          fontWeight: weight,
          letterSpacing: `${trackingNow}em`,
          lineHeight: 0.92,
          whiteSpace: "nowrap",
          textTransform: "uppercase",
          textAlign: align,
          paddingLeft: `${trackingNow}em`,
          backgroundImage:
            "linear-gradient(180deg, #FFFFFF 0%, #FFFFFF 44%, #E3E7ED 74%, #B9C2CE 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          WebkitTextFillColor: "transparent",
          filter:
            "drop-shadow(0 3px 16px rgba(0,0,0,0.55)) drop-shadow(0 0 34px rgba(255,255,255,0.08))",
        }}
      >
        {text}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* 01 · AURORA                                                        */
/* ------------------------------------------------------------------ */

const Aurora: React.FC<EndCardRenderProps> = ({
  displayName,
  accent,
  wide,
  avatarHidden,
  avatarOk,
  onAvatarError,
  localFrame,
  fps,
  markProgress,
  wordProgress,
  settle,
  transparentBackground,
}) => {
  const avatarSize = wide ? 148 : 152;
  const wordSize = wide ? 66 : 52;
  const outerRing = avatarSize + (wide ? 206 : 208);
  const seconds = localFrame / fps;
  const breathe = Math.sin(seconds * 1.15) * 2.2;
  const shear = `rotate(${seconds * 7}deg)`;

  return (
    <Stage accent={accent} transparentBackground={transparentBackground}>
      <Glow x="50%" y="43%" size={54} color={accent} opacity={0.09} />
      <Glow x="50%" y="61%" size={34} color="#FFFFFF" opacity={0.035} />
      <AbsoluteFill
        style={{
          left: "50%",
          top: "-12%",
          width: wide ? 280 : 360,
          height: "124%",
          transform: `translateX(-50%) scaleY(${0.86 + markProgress * 0.14})`,
          background: `linear-gradient(180deg, transparent 6%, ${alpha(
            accent,
            0.075,
          )} 46%, ${alpha(accent, 0.03)} 74%, transparent 96%)`,
          filter: "blur(26px)",
          opacity: clamp01(markProgress * 1.2),
        }}
      />
      <AbsoluteFill
        style={{
          left: "50%",
          top: "58%",
          width: wide ? 900 : 860,
          height: wide ? 190 : 280,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(ellipse, ${alpha(
            accent,
            0.085,
          )} 0%, transparent 66%)`,
          opacity: clamp01(markProgress * 0.9),
          filter: "blur(8px)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `translateY(${(1 - settle) * 16}px) scale(${0.975 + settle * 0.025})`,
        }}
      >
        {avatarHidden ? null : (
          <div
            style={{
              position: "relative",
              width: outerRing,
              height: outerRing,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: `translateY(${breathe}px)`,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: outerRing + 44,
                height: outerRing + 44,
                borderRadius: "50%",
                border: `1px solid ${alpha(accent, 0.1)}`,
                opacity: clamp01(markProgress * 1.1),
              }}
            />
            <div
              style={{
                position: "absolute",
                width: outerRing,
                height: outerRing,
                borderRadius: "50%",
                border: `1px solid ${alpha("#FFFFFF", 0.07)}`,
                opacity: clamp01(markProgress * 1.2),
              }}
            />
            <svg
              viewBox="0 0 200 200"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                transform: shear,
                opacity: clamp01(markProgress * 1.4),
              }}
            >
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke={alpha(accent, 0.16)}
                strokeWidth="0.55"
              />
              <circle
                cx="100"
                cy="100"
                r="78"
                fill="none"
                stroke={alpha(accent, 0.8)}
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeDasharray="30 460"
              />
              <circle
                cx="100"
                cy="100"
                r="92"
                fill="none"
                stroke={alpha(accent, 0.28)}
                strokeWidth="0.45"
                strokeDasharray="1 7"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                width: avatarSize + 70,
                height: avatarSize + 70,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(
                  accent,
                  0.18,
                )} 0%, transparent 67%)`,
                opacity: clamp01(markProgress * 1.1),
                filter: "blur(2px)",
              }}
            />
            <Avatar
              size={avatarSize}
              accent={accent}
              progress={markProgress}
              ok={avatarOk}
              onError={onAvatarError}
            />
          </div>
        )}
        <div style={{ height: wide ? 36 : 46 }} />
        <Wordmark
          text={displayName}
          size={wordSize}
          weight={800}
          tracking={0.12}
          progress={wordProgress}
        />
        <div style={{ height: wide ? 24 : 30 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: wide ? 190 : 170,
            opacity: clamp01((wordProgress - 0.35) * 1.7),
          }}
        >
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${alpha(
                accent,
                0.6,
              )})`,
            }}
          />
          <div
            style={{
              width: 5,
              height: 5,
              margin: "0 10px",
              transform: "rotate(45deg)",
              backgroundColor: alpha(accent, 0.9),
              boxShadow: `0 0 14px ${alpha(accent, 0.7)}`,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${alpha(
                accent,
                0.6,
              )}, transparent)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 02 · ATLAS                                                         */
/* ------------------------------------------------------------------ */

const Atlas: React.FC<EndCardRenderProps> = ({
  displayName,
  accent,
  wide,
  avatarHidden,
  avatarOk,
  onAvatarError,
  markProgress,
  wordProgress,
  settle,
  transparentBackground,
}) => {
  const avatarSize = wide ? 84 : 78;
  const wordSize = wide ? 103 : 66;
  const bracket = avatarSize + 42;

  return (
    <Stage accent={accent} transparentBackground={transparentBackground}>
      <Glow x="50%" y="52%" size={58} color={accent} opacity={0.1} />
      <AbsoluteFill
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: `${wide ? 112 : 96}px ${wide ? 112 : 96}px`,
          opacity: 0.3,
          maskImage:
            "radial-gradient(ellipse at 50% 52%, black 8%, transparent 74%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at 50% 52%, black 8%, transparent 74%)",
        }}
      />
      <AbsoluteFill
        style={{
          left: "13%",
          top: "9%",
          bottom: "9%",
          width: 1,
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
      />
      <AbsoluteFill
        style={{
          right: "13%",
          top: "9%",
          bottom: "9%",
          width: 1,
          backgroundColor: "rgba(255,255,255,0.07)",
        }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${0.965 + settle * 0.035})`,
        }}
      >
        <div
          style={{
            position: "absolute",
            fontFamily: FONT_STACK,
            fontWeight: 800,
            fontSize: wide ? 520 : 380,
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: "transparent",
            WebkitTextStroke: "1px rgba(255,255,255,0.035)",
            whiteSpace: "nowrap",
            opacity: clamp01(markProgress * 0.9),
            userSelect: "none",
          }}
        >
          {displayName}
        </div>
        {avatarHidden ? null : (
          <div
            style={{
              position: "relative",
              width: bracket,
              height: bracket,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: wide ? 32 : 38,
              opacity: clamp01(markProgress * 1.5),
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 15,
                height: 15,
                borderTop: `1px solid ${alpha(accent, 0.7)}`,
                borderLeft: `1px solid ${alpha(accent, 0.7)}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 15,
                height: 15,
                borderTop: `1px solid ${alpha(accent, 0.7)}`,
                borderRight: `1px solid ${alpha(accent, 0.7)}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: 15,
                height: 15,
                borderBottom: `1px solid ${alpha(accent, 0.7)}`,
                borderLeft: `1px solid ${alpha(accent, 0.7)}`,
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 15,
                height: 15,
                borderBottom: `1px solid ${alpha(accent, 0.7)}`,
                borderRight: `1px solid ${alpha(accent, 0.7)}`,
              }}
            />
            <Avatar
              size={avatarSize}
              accent={accent}
              progress={markProgress}
              ok={avatarOk}
              onError={onAvatarError}
            />
          </div>
        )}
        <Wordmark
          text={displayName}
          size={wordSize}
          weight={800}
          tracking={0.025}
          progress={wordProgress}
        />
        <div style={{ height: wide ? 26 : 32 }} />
        <div
          style={{
            width: wide ? "37%" : "42%",
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: clamp01((wordProgress - 0.4) * 1.7),
          }}
        >
          <div
            style={{
              flex: 1,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${alpha(
                accent,
                0.5,
              )} 24%, ${alpha(accent, 0.95)} 50%, ${alpha(
                accent,
                0.5,
              )} 76%, transparent)`,
              filter: `drop-shadow(0 0 10px ${alpha(accent, 0.5)})`,
            }}
          />
        </div>
      </AbsoluteFill>
      <Cross
        accent={accent}
        progress={markProgress}
        style={{ top: "11%", right: "11%" }}
      />
      <Cross
        accent={accent}
        progress={markProgress}
        style={{ bottom: "11%", left: "11%" }}
      />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 03 · AXIS                                                          */
/* ------------------------------------------------------------------ */

const Axis: React.FC<EndCardRenderProps> = ({
  displayName,
  accent,
  wide,
  avatarHidden,
  avatarOk,
  onAvatarError,
  markProgress,
  wordProgress,
  settle,
  transparentBackground,
}) => {
  const avatarSize = wide ? 150 : 118;
  const wordSize = wide ? 58 : 44;
  const frameInset = wide ? 72 : 58;

  return (
    <Stage accent={accent} transparentBackground={transparentBackground}>
      <Glow x="50%" y="50%" size={52} color={accent} opacity={0.11} />
      <Glow x="82%" y="78%" size={40} color={accent} opacity={0.035} />
      <AbsoluteFill
        style={{
          top: "50%",
          height: 1,
          background: `linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 22%, ${alpha(
            accent,
            0.32,
          )} 50%, rgba(255,255,255,0.1) 78%, transparent 100%)`,
          transform: `scaleX(${clamp01(settle)})`,
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: frameInset,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          opacity: clamp01(markProgress * 1.2),
        }}
      />
      <Cross
        accent={accent}
        progress={markProgress}
        style={{ top: frameInset - 7, left: frameInset - 7 }}
      />
      <Cross
        accent={accent}
        progress={markProgress}
        style={{ bottom: frameInset - 7, right: frameInset - 7 }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: wide ? 46 : 34,
          transform: `translateY(${(1 - settle) * 10}px)`,
        }}
      >
        {avatarHidden ? null : (
          <div style={{ position: "relative", flexShrink: 0 }}>
            <div
              style={{
                position: "absolute",
                inset: -14,
                borderRadius: 30,
                border: `1px solid ${alpha(accent, 0.15)}`,
                opacity: clamp01(markProgress * 1.2),
              }}
            />
            <Avatar
              size={avatarSize}
              accent={accent}
              progress={markProgress}
              ok={avatarOk}
              onError={onAvatarError}
              shape="squircle"
            />
            <div
              style={{
                position: "absolute",
                right: -4,
                bottom: -4,
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: accent,
                boxShadow: `0 0 18px ${alpha(accent, 0.8)}`,
                opacity: clamp01((markProgress - 0.5) * 2),
              }}
            />
          </div>
        )}
        <div
          style={{
            width: 1,
            height: wide ? 104 : 86,
            backgroundColor: "rgba(255,255,255,0.16)",
            opacity: clamp01(markProgress * 1.4),
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            opacity: clamp01(markProgress * 1.4),
          }}
        >
          <div
            style={{
              width: 54,
              height: 3,
              marginBottom: wide ? 18 : 14,
              backgroundColor: accent,
              boxShadow: `0 0 16px ${alpha(accent, 0.65)}`,
              transform: `scaleX(${clamp01(markProgress * 1.2)})`,
              transformOrigin: "left center",
            }}
          />
          <Wordmark
            text={displayName}
            size={wordSize}
            weight={800}
            tracking={0.1}
            progress={wordProgress}
            align="left"
            style={{ width: "auto" }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 04 · EDITORIAL                                                     */
/* ------------------------------------------------------------------ */

const Editorial: React.FC<EndCardRenderProps> = ({
  displayName,
  accent,
  wide,
  avatarHidden,
  avatarOk,
  onAvatarError,
  markProgress,
  wordProgress,
  settle,
  transparentBackground,
}) => {
  const avatarSize = wide ? 104 : 94;
  const wordSize = wide ? 88 : 59;
  const inset = wide ? 170 : 96;

  return (
    <Stage accent={accent} transparentBackground={transparentBackground}>
      <AbsoluteFill
        style={{
          background: `linear-gradient(132deg, rgba(255,255,255,0.075) 0%, transparent 42%, transparent 100%)`,
          opacity: clamp01(markProgress * 1.2),
        }}
      />
      <Glow x="12%" y="20%" size={46} color={accent} opacity={0.07} />
      <Glow x="88%" y="60%" size={44} color={accent} opacity={0.05} />
      <div
        style={{
          position: "absolute",
          width: wide ? 880 : 720,
          height: wide ? 880 : 720,
          right: wide ? -220 : -330,
          top: "50%",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          border: `1px solid ${alpha(accent, 0.13)}`,
          opacity: clamp01(markProgress * 1.1),
        }}
      />
      <div
        style={{
          position: "absolute",
          width: wide ? 620 : 500,
          height: wide ? 620 : 500,
          right: wide ? -90 : -220,
          top: "50%",
          transform: "translateY(-50%)",
          borderRadius: "50%",
          border: `1px solid rgba(255,255,255,0.05)`,
          opacity: clamp01(markProgress * 1.1),
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: wide ? 62 : 50,
          border: "1px solid rgba(255,255,255,0.055)",
          opacity: clamp01(markProgress * 1.15),
        }}
      />
      <Cross
        accent={accent}
        progress={markProgress}
        style={{ top: wide ? 92 : 78, right: wide ? 94 : 78 }}
      />
      <Cross
        accent={accent}
        progress={markProgress}
        style={{ bottom: wide ? 92 : 78, left: wide ? 94 : 78 }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: inset,
          paddingRight: inset,
          transform: `translateX(${(1 - settle) * 22}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: wide ? 28 : 22,
            marginBottom: wide ? 44 : 38,
            opacity: clamp01(markProgress * 1.5),
          }}
        >
          <div
            style={{
              width: wide ? 88 : 70,
              height: 2,
              backgroundColor: accent,
              boxShadow: `0 0 14px ${alpha(accent, 0.55)}`,
              transform: `scaleX(${clamp01(markProgress * 1.3)})`,
              transformOrigin: "left center",
            }}
          />
          {avatarHidden ? null : (
            <Avatar
              size={avatarSize}
              accent={accent}
              progress={markProgress}
              ok={avatarOk}
              onError={onAvatarError}
            />
          )}
        </div>
        <Wordmark
          text={displayName}
          size={wordSize}
          weight={800}
          tracking={0.015}
          progress={wordProgress}
          align="left"
        />
        <div style={{ height: wide ? 24 : 28 }} />
        <div
          style={{
            width: wide ? "34%" : "42%",
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: clamp01((wordProgress - 0.35) * 1.7),
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              backgroundColor: accent,
              boxShadow: `0 0 14px ${alpha(accent, 0.6)}`,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${alpha(
                accent,
                0.7,
              )}, ${alpha("#FFFFFF", 0.16)} 30%, transparent)`,
            }}
          />
        </div>
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 05 · ORBIT                                                         */
/* ------------------------------------------------------------------ */

const STARS = Array.from({ length: 44 }, (_, index) => {
  const x = ((index * 37 + 11) % 97) + 1.5;
  const y = ((index * 53 + 7) % 91) + 3.5;
  const size = index % 7 === 0 ? 2.2 : index % 3 === 0 ? 1.6 : 1;
  const opacity = 0.14 + ((index * 13) % 7) * 0.045;
  return { x, y, size, opacity };
});

const Orbit: React.FC<EndCardRenderProps> = ({
  displayName,
  accent,
  wide,
  avatarHidden,
  avatarOk,
  onAvatarError,
  localFrame,
  fps,
  markProgress,
  wordProgress,
  settle,
  transparentBackground,
}) => {
  const avatarSize = wide ? 142 : 148;
  const ringSize = wide ? 366 : 370;
  const wordSize = wide ? 54 : 42;
  const seconds = localFrame / fps;
  const spin = seconds * 9;
  const innerSpin = -seconds * 5;

  return (
    <Stage accent={accent} transparentBackground={transparentBackground}>
      <Glow x="50%" y="42%" size={48} color={accent} opacity={0.12} />
      <AbsoluteFill style={{ opacity: clamp01(markProgress * 1.1) }}>
        {STARS.map((star, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              opacity: star.opacity,
              boxShadow:
                index % 7 === 0
                  ? `0 0 8px ${alpha(accent, 0.5)}`
                  : undefined,
            }}
          />
        ))}
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${0.965 + settle * 0.035})`,
        }}
      >
        {avatarHidden ? null : (
          <div
            style={{
              position: "relative",
              width: ringSize,
              height: ringSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: ringSize + 56,
                height: ringSize + 56,
                borderRadius: "50%",
                background: `radial-gradient(circle, ${alpha(
                  accent,
                  0.14,
                )} 0%, transparent 64%)`,
                opacity: clamp01(markProgress * 1.1),
              }}
            />
            <svg
              viewBox="0 0 200 200"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                opacity: clamp01(markProgress * 1.4),
              }}
            >
              <circle
                cx="100"
                cy="100"
                r="96"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="0.5"
              />
              <circle
                cx="100"
                cy="100"
                r="83"
                fill="none"
                stroke={alpha(accent, 0.18)}
                strokeWidth="0.55"
              />
              <circle
                cx="100"
                cy="100"
                r="68"
                fill="none"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth="0.5"
              />
              <g transform={`rotate(${spin} 100 100)`}>
                <circle
                  cx="100"
                  cy="100"
                  r="83"
                  fill="none"
                  stroke={alpha(accent, 0.8)}
                  strokeWidth="1.1"
                  strokeLinecap="round"
                  strokeDasharray="42 480"
                />
                <circle cx="183" cy="100" r="2.4" fill={accent} />
              </g>
              <g transform={`rotate(${innerSpin} 100 100)`}>
                <circle
                  cx="100"
                  cy="100"
                  r="68"
                  fill="none"
                  stroke={alpha(accent, 0.5)}
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeDasharray="18 410"
                />
              </g>
            </svg>
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                style={{
                  position: "absolute",
                  inset: 0,
                  transform: `rotate(${angle}deg)`,
                  opacity: clamp01(markProgress * 1.2),
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 2,
                    left: "50%",
                    width: 1,
                    height: 9,
                    backgroundColor: alpha(accent, 0.55),
                    transform: "translateX(-50%)",
                  }}
                />
              </div>
            ))}
            <Avatar
              size={avatarSize}
              accent={accent}
              progress={markProgress}
              ok={avatarOk}
              onError={onAvatarError}
            />
          </div>
        )}
        <div style={{ height: wide ? 38 : 46 }} />
        <Wordmark
          text={displayName}
          size={wordSize}
          weight={700}
          tracking={0.26}
          progress={wordProgress}
        />
        <div style={{ height: wide ? 22 : 28 }} />
        <Rule
          width={wide ? 150 : 120}
          accent={accent}
          progress={clamp01((wordProgress - 0.35) * 1.6)}
        />
      </AbsoluteFill>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Registry                                                           */
/* ------------------------------------------------------------------ */

export const END_CARD_TEMPLATE_COMPONENTS: Record<
  EndCardTemplateId,
  React.FC<EndCardRenderProps>
> = {
  aurora: Aurora,
  atlas: Atlas,
  axis: Axis,
  editorial: Editorial,
  orbit: Orbit,
};
