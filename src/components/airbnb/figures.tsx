import type { CSSProperties } from "react";
import { Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { FONT_STACK } from "../../config/airbnb";
import { clamp, easeInOut, easeOut } from "./primitives";

/**
 * Cinematic re-enactment figures.
 *
 * The founders and hosts are deliberately unidentifiable silhouettes: this is an
 * illustrative re-creation, never fake archival photography of real people.
 */
export type Pose = "stand" | "seated" | "walk" | "carry" | "host";

type Figure = {
  head: { cx: number; cy: number; rx: number; ry: number; rotate: number };
  torso: string;
  arms: string[];
  legs: string[];
};

/**
 * Anatomically proportioned silhouettes (head ≈ 1/7.5 of standing height) with
 * separated arms and legs so they read as people, not pictograms.
 */
const FIGURES: Record<Pose, Figure> = {
  stand: {
    head: { cx: 100, cy: 55, rx: 27, ry: 32, rotate: -3 },
    torso:
      "M100 96 C116 96 128 105 132 121 L139 184 C141 204 137 221 131 238 L129 272 L71 272 L69 238 C63 221 59 204 61 184 L68 121 C72 105 84 96 100 96 Z",
    arms: [
      "M66 124 C57 150 53 180 51 214 L48 240",
      "M134 124 C143 150 147 180 149 214 L152 240",
    ],
    legs: ["M84 270 L80 340 L75 418", "M116 270 L120 340 L125 418"],
  },
  seated: {
    head: { cx: 100, cy: 58, rx: 27, ry: 32, rotate: -2 },
    torso:
      "M100 100 C117 100 130 110 133 127 L138 190 C140 212 135 232 128 250 L126 300 L74 300 L72 250 C65 232 60 212 62 190 L67 127 C70 110 83 100 100 100 Z",
    arms: [
      "M67 130 C57 156 55 186 56 216 L58 246",
      "M133 130 C143 156 145 186 144 216 L142 246",
    ],
    legs: [],
  },
  walk: {
    head: { cx: 102, cy: 55, rx: 27, ry: 32, rotate: -6 },
    torso:
      "M102 96 C118 96 130 105 134 121 L141 184 C143 204 139 221 133 238 L131 272 L73 272 L71 238 C65 221 61 204 63 184 L70 121 C74 105 86 96 102 96 Z",
    arms: [
      "M68 126 C56 150 48 178 44 206",
      "M136 126 C146 150 152 176 154 204",
    ],
    legs: ["M86 270 L66 336 L50 412", "M118 270 L136 338 L156 414"],
  },
  carry: {
    head: { cx: 98, cy: 55, rx: 27, ry: 32, rotate: 2 },
    torso:
      "M98 96 C114 96 126 105 130 121 L137 184 C139 204 135 221 129 238 L127 272 L69 272 L67 238 C61 221 57 204 59 184 L66 121 C70 105 82 96 98 96 Z",
    arms: [
      "M65 124 C57 146 62 168 78 184 L88 196",
      "M131 124 C139 146 134 168 118 184 L108 196",
    ],
    legs: ["M82 270 L78 340 L73 418", "M114 270 L118 340 L123 418"],
  },
  host: {
    head: { cx: 100, cy: 55, rx: 27, ry: 32, rotate: 3 },
    torso:
      "M100 96 C116 96 128 105 132 121 L139 184 C141 204 137 221 131 238 L129 272 L71 272 L69 238 C63 221 59 204 61 184 L68 121 C72 105 84 96 100 96 Z",
    arms: [
      "M66 124 C58 148 62 170 76 186",
      "M134 124 C142 148 138 170 124 186",
    ],
    legs: ["M84 270 L80 340 L75 418", "M116 270 L120 340 L125 418"],
  },
};

const SILHOUETTE_STYLE = (color: string): CSSProperties => ({ fill: color });

export const Silhouette: React.FC<{
  pose?: Pose;
  x: number;
  y: number;
  height: number;
  color?: string;
  opacity?: number;
  blur?: number;
  flip?: boolean;
  rim?: string;
  rimOpacity?: number;
  bag?: boolean;
  style?: CSSProperties;
}> = ({
  pose = "stand",
  x,
  y,
  height,
  color = "#080807",
  opacity = 1,
  blur = 0,
  flip = false,
  rim,
  rimOpacity = 0.55,
  bag = false,
  style,
}) => {
  const fig = FIGURES[pose];
  const width = height * 0.46;
  const legStroke = 20;
  return (
    <div
      style={{
        position: "absolute",
        left: x - width / 2,
        top: y - height,
        width,
        height,
        opacity,
        filter: blur ? `blur(${blur}px)` : undefined,
        transform: `scaleX(${flip ? -1 : 1})`,
        ...style,
      }}
    >
      {rim ? (
        <div
          style={{
            position: "absolute",
            left: "-24%",
            top: "-4%",
            width: "148%",
            height: "108%",
            background: `radial-gradient(ellipse at 62% 26%, ${rim} 0%, transparent 58%)`,
            opacity: rimOpacity * 0.55,
            filter: "blur(26px)",
          }}
        />
      ) : null}
      <svg viewBox="0 0 200 460" width="100%" height="100%" style={{ display: "block" }}>
        <ellipse
          cx={fig.head.cx}
          cy={fig.head.cy}
          rx={fig.head.rx}
          ry={fig.head.ry}
          transform={`rotate(${fig.head.rotate} ${fig.head.cx} ${fig.head.cy})`}
          style={SILHOUETTE_STYLE(color)}
        />
        <rect x="92" y="82" width="16" height="22" style={SILHOUETTE_STYLE(color)} />
        <path d={fig.torso} style={SILHOUETTE_STYLE(color)} />
        {fig.arms.map((arm, i) => (
          <path
            key={`arm-${i}`}
            d={arm}
            fill="none"
            stroke={color}
            strokeWidth={16}
            strokeLinecap="round"
          />
        ))}
        {fig.legs.map((leg, i) => (
          <path
            key={`leg-${i}`}
            d={leg}
            fill="none"
            stroke={color}
            strokeWidth={legStroke}
            strokeLinecap="round"
          />
        ))}
        {bag ? (
          <rect x="58" y="196" width="62" height="74" rx="6" transform="rotate(-8 89 233)" style={SILHOUETTE_STYLE(color)} />
        ) : null}
        {rim ? (
          <g fill="none" stroke={rim} strokeWidth={1.6} opacity={rimOpacity * 0.5} strokeLinecap="round">
            <path d={fig.torso} />
            <ellipse cx={fig.head.cx} cy={fig.head.cy} rx={fig.head.rx} ry={fig.head.ry} transform={`rotate(${fig.head.rotate} ${fig.head.cx} ${fig.head.cy})`} />
          </g>
        ) : null}
      </svg>
    </div>
  );
};

/** Warm doorway with volumetric spill — the film's recurring "threshold" motif. */
export const Doorway: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  color?: string;
  intensity?: number;
  open?: number;
  spill?: boolean;
  frame?: boolean;
}> = ({ x, y, width, height, color = "#FFD3A1", intensity = 1, open = 1, spill = true, frame = true }) => (
  <>
    {frame ? (
      <>
        <div
          style={{
            position: "absolute",
            left: x - 16,
            top: y - 18,
            width: width + 32,
            height: height + 18,
            border: "10px solid #16100B",
            borderBottom: "none",
            boxSizing: "border-box",
            boxShadow: "0 0 60px rgba(0,0,0,0.7)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: x - 16,
            top: y - 18,
            width: width + 32,
            height: 10,
            background: "rgba(255,214,170,0.18)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: x - 52,
            top: y,
            width: 46,
            height: height * 0.98,
            background: "linear-gradient(90deg, #0C0907, #1B130D)",
            borderLeft: "1px solid rgba(255,200,150,0.12)",
            boxShadow: "10px 0 30px rgba(0,0,0,0.6)",
            opacity: 1 - open * 0.35,
          }}
        />
      </>
    ) : null}
    {spill ? (
      <div
        style={{
          position: "absolute",
          left: x - width * 0.9,
          top: y,
          width: width * 2.8,
          height: height * 0.62,
          background: `radial-gradient(ellipse at 50% 0%, ${color} 0%, transparent 64%)`,
          opacity: 0.34 * intensity * open,
          filter: "blur(34px)",
          pointerEvents: "none",
        }}
      />
    ) : null}
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        overflow: "hidden",
        borderRadius: 3,
        background: `linear-gradient(180deg, ${color} 0%, #F6B979 58%, #B9773F 100%)`,
        opacity: 0.94 * intensity,
        boxShadow: `0 0 90px 18px ${color}55, inset 0 0 60px rgba(255,255,255,0.35)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, rgba(255,255,255,${0.24 * open}) 0%, transparent 28%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: `${(1 - open) * 100}%`,
          background: "#0C0B0A",
          boxShadow: "18px 0 40px rgba(0,0,0,0.8)",
        }}
      />
    </div>
  </>
);

/**
 * Two brass keys on a dark surface — the "meeting a host" beat without putting
 * an invented face on screen.
 */
export const KeysOnTable: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  light?: number;
}> = ({ x, y, scale = 1, rotate = -6, light = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width: 420,
      height: 320,
      marginLeft: -210,
      marginTop: -160,
      transform: `rotate(${rotate}deg) scale(${scale})`,
    }}
  >
    <div
      style={{
        position: "absolute",
        left: -60,
        top: -60,
        width: 540,
        height: 440,
        background: `radial-gradient(ellipse at 46% 42%, rgba(255,198,140,${0.3 * light}) 0%, transparent 64%)`,
        filter: "blur(28px)",
      }}
    />
    <svg width="420" height="320" viewBox="0 0 420 320">
      <defs>
        <radialGradient id="coffee" cx="0.42" cy="0.36" r="0.7">
          <stop offset="0%" stopColor="#6B4A2E" />
          <stop offset="70%" stopColor="#3A2517" />
          <stop offset="100%" stopColor="#241610" />
        </radialGradient>
        <linearGradient id="ceramic" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F2E9DA" />
          <stop offset="60%" stopColor="#DCCFBB" />
          <stop offset="100%" stopColor="#B9A88F" />
        </linearGradient>
        <linearGradient id="brass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4CE7C" />
          <stop offset="45%" stopColor="#CD9A47" />
          <stop offset="100%" stopColor="#7E5522" />
        </linearGradient>
      </defs>

      {/* notebook */}
      <g transform="rotate(-9 300 118)">
        <rect x="242" y="58" width="126" height="168" rx="5" fill="#0E0B08" opacity="0.55" transform="translate(6 8)" />
        <rect x="242" y="58" width="126" height="168" rx="5" fill="#E8DDC8" />
        <rect x="242" y="58" width="18" height="168" rx="4" fill="#C7B79B" />
        <rect x="274" y="86" width="70" height="2" fill="rgba(60,45,30,0.35)" />
        <rect x="274" y="100" width="82" height="2" fill="rgba(60,45,30,0.25)" />
        <rect x="274" y="114" width="58" height="2" fill="rgba(60,45,30,0.25)" />
      </g>

      {/* saucer + cup */}
      <g>
        <ellipse cx="112" cy="176" rx="82" ry="76" fill="rgba(0,0,0,0.45)" transform="translate(4 8)" />
        <circle cx="112" cy="172" r="76" fill="url(#ceramic)" />
        <circle cx="112" cy="170" r="58" fill="#F7F0E4" />
        <circle cx="112" cy="170" r="46" fill="url(#coffee)" />
        <ellipse cx="94" cy="152" rx="18" ry="10" fill="rgba(255,235,205,0.16)" />
        <path d="M172 148 C206 148 206 196 172 196" fill="none" stroke="url(#ceramic)" strokeWidth="13" strokeLinecap="round" />
        <ellipse cx="112" cy="118" rx="34" ry="10" fill="rgba(255,240,220,0.1)" />
      </g>

      {/* key ring + two keys */}
      <g transform="rotate(12 210 250)">
        <circle cx="176" cy="248" r="16" fill="none" stroke="url(#brass)" strokeWidth="7" />
        <g transform="rotate(-16 200 248)">
          <rect x="190" y="243" width="112" height="11" rx="4" fill="url(#brass)" />
          <circle cx="276" cy="248" r="5" fill="#1A120A" opacity="0.8" />
          <rect x="286" y="254" width="12" height="20" rx="2" fill="url(#brass)" />
          <rect x="302" y="254" width="9" height="13" rx="2" fill="url(#brass)" />
          <circle cx="194" cy="248" r="10" fill="none" stroke="#8A5F27" strokeWidth="2" opacity="0.5" />
        </g>
        <g transform="rotate(28 200 248)">
          <rect x="196" y="243" width="86" height="9" rx="4" fill="url(#brass)" opacity="0.95" />
          <rect x="268" y="252" width="10" height="16" rx="2" fill="url(#brass)" opacity="0.95" />
          <circle cx="200" cy="247" r="8" fill="none" stroke="#8A5F27" strokeWidth="2" opacity="0.45" />
        </g>
      </g>
    </svg>
  </div>
);

/** Deterministic dust motes that drift through a light beam. */
export const DustMotes: React.FC<{ count?: number; start: number; color?: string; area?: [number, number, number, number] }> = ({
  count = 26,
  start,
  color = "#F6E5CC",
  area = [32, 30, 62, 55],
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = (frame / fps - start) * fps;
  const [ax, ay, aw, ah] = area;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }).map((_, i) => {
        const seed = (i * 9301 + 49297) % 233280;
        const rnd = seed / 233280;
        const rnd2 = ((i * 7919 + 104729) % 233280) / 233280;
        const x = ax + rnd * aw + Math.sin((t + i * 13) / 34) * 1.6;
        const y = ay + ((rnd2 * ah + t * 0.16 * (0.3 + rnd)) % ah);
        const size = 1.4 + rnd2 * 2.6;
        const op = 0.12 + rnd * 0.3;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${x}%`,
              top: `${y}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: color,
              opacity: op,
              filter: "blur(0.6px)",
            }}
          />
        );
      })}
    </div>
  );
};

/** Blurred city window with practical bokeh — the view from the apartment. */
export const CityWindow: React.FC<{
  x: number | string;
  y: number | string;
  width: number | string;
  height: number | string;
  dim?: number;
}> = ({ x, y, width, height, dim = 0.5 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height,
      overflow: "hidden",
      borderRadius: 2,
      opacity: 0.9,
    }}
  >
    <Img
      src={staticFile("images/city-fog.jpg")}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        filter: `brightness(${0.3 * dim + 0.1}) contrast(1.1) saturate(0.55) blur(3px)`,
        transform: "scale(1.12)",
      }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(180deg, rgba(18,20,26,0.45), rgba(10,10,12,0.75))",
      }}
    />
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          left: `${(i * 37) % 92}%`,
          top: `${(i * 23) % 78}%`,
          width: 4 + (i % 3) * 3,
          height: 4 + (i % 3) * 3,
          borderRadius: "50%",
          backgroundColor: "#FFC98C",
          opacity: 0.25 + (i % 4) * 0.12,
          filter: "blur(1.4px)",
        }}
      />
    ))}
  </div>
);

/** A simple, believable desk for the late-night workspace. */
export const DeskPlane: React.FC<{ color?: string; reflection?: number }> = ({
  color = "#1A1512",
  reflection = 0.5,
}) => (
  <div
    style={{
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      height: "42%",
      background: `linear-gradient(180deg, ${color} 0%, #0B0908 100%)`,
      boxShadow: "inset 0 24px 60px rgba(0,0,0,0.6)",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(180deg, rgba(255,210,160,${0.14 * reflection}) 0%, transparent 42%)`,
        mixBlendMode: "screen",
      }}
    />
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: "rgba(255,220,180,0.16)",
      }}
    />
  </div>
);

/** Laptop seen from behind/above with a glowing screen. */
export const Laptop: React.FC<{
  x: number;
  y: number;
  width: number;
  rotate?: number;
  screen: React.ReactNode;
  glow?: number;
  bezel?: string;
}> = ({ x, y, width, rotate = -4, screen, glow = 0.7, bezel = "#15161A" }) => {
  const height = width * 1.52;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        transform: `perspective(1400px) rotateX(9deg) rotateZ(${rotate}deg)`,
        transformOrigin: "50% 100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: -width * 0.05,
          top: -height * 0.04,
          width: width * 1.1,
          height: height * 1.08,
          borderRadius: width * 0.045,
          background: `linear-gradient(160deg, #2A2C31, ${bezel} 55%, #0A0B0D)`,
          boxShadow: `0 40px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.06), 0 0 ${width * 0.5}px rgba(120,170,220,${0.16 * glow})`,
          padding: width * 0.028,
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            borderRadius: width * 0.02,
            overflow: "hidden",
            background: "#0C1016",
            boxShadow: "inset 0 0 40px rgba(0,0,0,0.8)",
          }}
        >
          {screen}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(112deg, rgba(255,255,255,0.10) 0%, transparent 32%, transparent 68%, rgba(255,255,255,0.05) 100%)",
              pointerEvents: "none",
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: width * 0.008,
            left: "50%",
            width: width * 0.12,
            height: 3,
            marginLeft: -width * 0.06,
            borderRadius: 2,
            backgroundColor: "rgba(255,255,255,0.12)",
          }}
        />
      </div>
    </div>
  );
};

/** Table edge with a subtle top-light, used for the interview and kitchen beats. */
export const TableTop: React.FC<{
  y: number;
  color?: string;
  light?: number;
  height?: string;
}> = ({ y, color = "#241A14", light = 0.4, height = "60%" }) => (
  <div
    style={{
      position: "absolute",
      left: "-10%",
      right: "-10%",
      top: `${y}%`,
      height,
      background: `linear-gradient(180deg, ${color} 0%, #0A0807 78%)`,
      transform: "perspective(900px) rotateX(38deg)",
      transformOrigin: "top center",
      boxShadow: "0 -1px 0 rgba(255,225,190,0.14)",
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse at 50% 0%, rgba(255,206,150,${0.22 * light}), transparent 62%)`,
        mixBlendMode: "screen",
      }}
    />
  </div>
);

/** Interview-room light bar / wall practical. */
export const LightBar: React.FC<{ x: number; y: number; width: number; color?: string; intensity?: number }> = ({
  x,
  y,
  width,
  color = "#FFCFA0",
  intensity = 0.5,
}) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      width,
      height: 3,
      backgroundColor: color,
      opacity: intensity,
      boxShadow: `0 0 40px 8px ${color}88`,
      borderRadius: 2,
    }}
  />
);

/** Progress helper shared by scenes that animate in-place. */
export const useLocalProgress = (start: number, duration: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return easeOut(clamp((frame / fps - start) / Math.max(0.001, duration)));
};

export const HandwrittenNote: React.FC<{
  text: string;
  x: number;
  y: number;
  rotate?: number;
  color?: string;
  size?: number;
  opacity?: number;
}> = ({ text, x, y, rotate = -3, color = "#E9DFCC", size = 22, opacity = 0.8 }) => (
  <div
    style={{
      position: "absolute",
      left: `${x}%`,
      top: `${y}%`,
      transform: `rotate(${rotate}deg)`,
      fontFamily: FONT_STACK,
      fontStyle: "italic",
      fontWeight: 500,
      fontSize: size,
      color,
      opacity,
      letterSpacing: "0.02em",
      whiteSpace: "pre-line",
      lineHeight: 1.35,
    }}
  >
    {text}
  </div>
);

/** Fades a block of children based on local time, without mounting overhead. */
export const FadeAt: React.FC<{
  start: number;
  end: number;
  fadeIn?: number;
  fadeOut?: number;
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ start, end, fadeIn = 0.4, fadeOut = 0.3, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  if (t < start - 0.05 || t > end + 0.05) return null;
  const opacity =
    Math.min(
      interpolate(t, [start, start + fadeIn], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      interpolate(t, [end - fadeOut, end], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    ) * easeInOut(0.4 + 0.6 * clamp((t - start) / 1.2));
  return <div style={{ position: "absolute", inset: 0, opacity, ...style }}>{children}</div>;
};
