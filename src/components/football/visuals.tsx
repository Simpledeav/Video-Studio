import type { CSSProperties, ReactNode } from "react";
import { FC, FONT, MONO } from "../../config/football";
import {
  clamp,
  Counter,
  Dot,
  easeOut,
  Kicker,
  Mono,
  progress,
  Reveal,
  seeded,
  Tag,
  useTime,
} from "./kit";

/* ------------------------------------------------------------------ */
/* Stadium                                                             */
/* ------------------------------------------------------------------ */

export const StadiumBackdrop: React.FC<{
  accent?: string;
  intensity?: number;
  variant?: "night" | "gold" | "black";
  pitch?: boolean;
  children?: ReactNode;
}> = ({ accent = FC.pitchLight, intensity = 1, variant = "night", pitch = true, children }) => {
  const { t } = useTime();
  const gold = variant === "gold";
  const black = variant === "black";
  const crowd = Array.from({ length: 170 }, (_, index) => {
    const row = index % 10;
    const col = Math.floor(index / 10);
    return {
      x: 40 + col * 66 + seeded(index) * 34,
      y: 430 + row * 18 + seeded(index + 20) * 10,
      r: 1.1 + seeded(index + 40) * 1.5,
      o: 0.14 + seeded(index + 60) * 0.5,
    };
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: FC.black }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: black
            ? "radial-gradient(ellipse at 50% 46%, #12141A 0%, #080A0F 62%, #050608 100%)"
            : gold
              ? "radial-gradient(ellipse at 50% 34%, #252118 0%, #111318 46%, #080A0F 100%)"
              : "radial-gradient(ellipse at 50% 30%, #15251F 0%, #0B1114 42%, #080A0F 100%)",
        }}
      />

      {/* floodlight cones */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.5 * intensity,
          background: `conic-gradient(from 196deg at 4% -8%, transparent 0deg, ${accent}22 15deg, transparent 30deg),
            conic-gradient(from 128deg at 96% -8%, transparent 0deg, ${accent}1c 15deg, transparent 30deg)`,
          filter: "blur(18px)",
        }}
      />

      {/* stand geometry + crowd */}
      <svg
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <defs>
          <linearGradient id="stand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gold ? "#1B1710" : "#0C1311"} />
            <stop offset="100%" stopColor={black ? "#080A0F" : "#111A17"} />
          </linearGradient>
          <linearGradient id="pitch" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gold ? "#20402E" : "#174D33"} />
            <stop offset="100%" stopColor={black ? "#0A1410" : "#0C2A1D"} />
          </linearGradient>
        </defs>
        <path d="M -80 560 L 1160 560 L 1080 250 L 0 250 Z" fill="url(#stand)" opacity="0.9" />
        {Array.from({ length: 7 }, (_, row) => (
          <path
            key={row}
            d={`M ${-20 + row * 10} ${270 + row * 38} L ${1100 - row * 10} ${270 + row * 38}`}
            stroke={FC.lineSoft}
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        {crowd.map((dot, index) => (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={dot.r}
            fill={index % 17 === 0 ? accent : FC.white}
            opacity={dot.o * 0.5 * intensity}
          />
        ))}
        <path d="M -40 620 L 1120 620 L 1080 560 L 0 560 Z" fill={FC.black} opacity="0.85" />
        {pitch ? (
          <>
            <path d="M -60 1200 L 1140 1200 L 1240 1920 L -160 1920 Z" fill="url(#pitch)" />
            {Array.from({ length: 9 }, (_, index) => (
              <path
                key={index}
                d={`M ${-60 + index * 150} 1200 L ${-160 + index * 175} 1920 L ${-160 + (index + 1) * 175} 1920 L ${-60 + (index + 1) * 150} 1200 Z`}
                fill={FC.black}
                opacity={index % 2 === 0 ? 0.08 : 0.02}
              />
            ))}
            <g opacity="0.5" stroke={FC.white} strokeWidth="2" fill="none">
              <path d="M 90 1340 L 990 1340 L 1080 1920 L 0 1920 Z" />
              <path d="M 250 1340 L 330 1920" opacity="0.35" />
              <path d="M 830 1340 L 750 1920" opacity="0.35" />
              <path d="M 540 1340 L 540 1920" opacity="0.22" />
            </g>
            <ellipse cx="540" cy="1230" rx="470" ry="46" fill={FC.black} opacity="0.28" />
          </>
        ) : null}
      </svg>

      {/* late-night / gold atmosphere */}
      {gold ? (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 38%, ${FC.gold}18 0%, transparent 55%)`,
            opacity: 0.8,
          }}
        />
      ) : null}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${accent}88, transparent)`,
          opacity: 0.4 + Math.sin(t * 0.7) * 0.08,
        }}
      />
      {children}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Tactical pitch                                                      */
/* ------------------------------------------------------------------ */

export const PitchLines: React.FC<{
  width?: number;
  height?: number;
  color?: string;
  draw?: number;
  opacity?: number;
  style?: CSSProperties;
}> = ({ width = 860, height = 1200, color = "rgba(245,247,250,0.5)", draw = 1, opacity = 1, style }) => {
  const dash = `1 ${clamp(1 - draw) * 4 + 0.0001}`;
  const line = {
    stroke: color,
    strokeWidth: 2,
    fill: "none",
    pathLength: 1,
    strokeDasharray: draw >= 1 ? undefined : dash,
    opacity,
  } as const;
  return (
    <svg
      viewBox="0 0 860 1200"
      width={width}
      height={height}
      style={{ position: "absolute", ...style }}
    >
      <rect x="30" y="30" width="800" height="1140" {...line} />
      <line x1="30" y1="600" x2="830" y2="600" {...line} />
      <circle cx="430" cy="600" r="122" {...line} />
      <circle cx="430" cy="600" r="5" fill={color} opacity={0.8 * opacity} />
      <rect x="210" y="30" width="440" height="176" {...line} />
      <rect x="330" y="30" width="200" height="72" {...line} />
      <rect x="210" y="994" width="440" height="176" {...line} />
      <rect x="330" y="1098" width="200" height="72" {...line} />
      <path d="M 330 206 A 122 122 0 0 0 530 206" {...line} />
      <path d="M 330 994 A 122 122 0 0 1 530 994" {...line} />
      <path d="M 30 70 A 40 40 0 0 0 70 30" {...line} />
      <path d="M 790 30 A 40 40 0 0 1 830 70" {...line} />
      <path d="M 830 1130 A 40 40 0 0 1 790 1170" {...line} />
      <path d="M 70 1170 A 40 40 0 0 1 30 1130" {...line} />
    </svg>
  );
};

export const TacticalArrow: React.FC<{
  d: string;
  color?: string;
  start?: number;
  width?: number;
  dashed?: boolean;
}> = ({ d, color = FC.gold, start = 0, width = 2.2, dashed = true }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.9, easeOut);
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeDasharray={dashed ? "7 8" : undefined}
      pathLength={1}
      strokeDashoffset={1 - p}
      opacity={0.7 * p}
      markerEnd="url(#arrowhead)"
    />
  );
};

export const TacticalArrowDefs: React.FC<{ color?: string }> = ({ color = FC.gold }) => (
  <defs>
    <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M 0 0 L 8 4 L 0 8 Z" fill={color} />
    </marker>
  </defs>
);

export const Cone: React.FC<{ x: number; y: number; color?: string; opacity?: number }> = ({
  x,
  y,
  color = FC.orange,
  opacity = 0.85,
}) => (
  <g transform={`translate(${x} ${y})`} opacity={opacity}>
    <ellipse cx="0" cy="9" rx="19" ry="6" fill="rgba(0,0,0,0.45)" />
    <path d="M -16 8 L 0 -24 L 16 8 Z" fill={color} opacity="0.9" />
    <path d="M -8 -10 L 8 -10" stroke={FC.black} strokeWidth="3" opacity="0.35" />
  </g>
);

/* ------------------------------------------------------------------ */
/* Objects                                                             */
/* ------------------------------------------------------------------ */

export const JerseySeven: React.FC<{
  width?: number;
  accent?: string;
  number?: string;
  tone?: "gold" | "white" | "dark";
  opacity?: number;
  style?: CSSProperties;
}> = ({ width = 360, accent = FC.gold, number = "7", tone = "gold", opacity = 1, style }) => {
  const body = tone === "white" ? FC.white : tone === "gold" ? accent : FC.graphite2;
  const trim = tone === "white" ? FC.black : FC.black;
  const ink = tone === "gold" ? FC.black : tone === "white" ? FC.black : accent;
  return (
    <svg
      viewBox="0 0 600 500"
      width={width}
      height={width * (500 / 600)}
      style={{ opacity, ...style }}
    >
      <defs>
        <linearGradient id={`jersey-${tone}`} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor={body} stopOpacity="0.98" />
          <stop offset="55%" stopColor={body} stopOpacity="0.86" />
          <stop offset="100%" stopColor={body} stopOpacity="0.66" />
        </linearGradient>
        <linearGradient id={`shine-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={FC.white} stopOpacity="0.24" />
          <stop offset="45%" stopColor={FC.white} stopOpacity="0" />
          <stop offset="100%" stopColor={FC.black} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <ellipse cx="300" cy="472" rx="170" ry="20" fill="rgba(0,0,0,0.5)" />
      <path
        d="M 186 38 L 252 10 L 300 58 L 348 10 L 414 38 L 522 118 L 466 204 L 404 174 L 404 424 Q 300 462 196 424 L 196 174 L 134 204 L 78 118 Z"
        fill={`url(#jersey-${tone})`}
        stroke={trim}
        strokeWidth="4"
      />
      <path
        d="M 252 10 L 300 58 L 348 10 L 330 4 L 300 34 L 270 4 Z"
        fill={trim}
        opacity="0.9"
      />
      <path d="M 522 118 L 466 204 L 404 174" fill="none" stroke={trim} strokeWidth="3" opacity="0.7" />
      <path d="M 78 118 L 134 204 L 196 174" fill="none" stroke={trim} strokeWidth="3" opacity="0.7" />
      <path
        d="M 186 38 L 252 10 L 300 58 L 348 10 L 414 38 L 522 118 L 466 204 L 404 174 L 404 424 Q 300 462 196 424 L 196 174 L 134 204 L 78 118 Z"
        fill={`url(#shine-${tone})`}
      />
      <rect x="196" y="174" width="208" height="250" fill="none" stroke={FC.white} strokeWidth="1.5" opacity="0.1" />
      <text
        x="300"
        y="356"
        textAnchor="middle"
        fontFamily={FONT}
        fontSize="218"
        fontWeight="800"
        letterSpacing="-12"
        fill={ink}
        opacity="0.96"
      >
        {number}
      </text>
      <text
        x="300"
        y="404"
        textAnchor="middle"
        fontFamily={MONO}
        fontSize="18"
        letterSpacing="7"
        fill={ink}
        opacity="0.65"
      >
        VII
      </text>
      <g opacity="0.7">
        <path d="M 356 236 L 376 226 L 392 242 L 386 264 L 362 264 L 354 247 Z" fill="none" stroke={ink} strokeWidth="3" />
        <path d="M 365 240 L 381 254" stroke={ink} strokeWidth="3" />
        <path d="M 365 254 L 381 240" stroke={ink} strokeWidth="3" />
      </g>
    </svg>
  );
};

export const Football: React.FC<{
  size?: number;
  rotate?: number;
  style?: CSSProperties;
  opacity?: number;
}> = ({ size = 100, rotate = 0, style, opacity = 1 }) => (
  <svg
    viewBox="0 0 200 200"
    width={size}
    height={size}
    style={{ opacity, filter: "drop-shadow(0 18px 20px rgba(0,0,0,0.55))", ...style }}
  >
    <defs>
      <radialGradient id="ball" cx="34%" cy="26%" r="78%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="58%" stopColor="#E7EAEF" />
        <stop offset="100%" stopColor="#9AA3AF" />
      </radialGradient>
    </defs>
    <g transform={`rotate(${rotate} 100 100)`}>
      <circle cx="100" cy="100" r="86" fill="url(#ball)" stroke="#5C6672" strokeWidth="2" />
      <g fill="#14181E">
        <path d="M100 54 L126 73 L116 104 L84 104 L74 73 Z" />
        <path d="M100 146 L126 127 L140 148 L124 172 L76 172 L60 148 L74 127 Z" opacity="0.92" />
        <path d="M38 70 L58 54 L72 74 L64 104 L36 104 L24 84 Z" opacity="0.9" />
        <path d="M162 70 L176 84 L164 104 L136 104 L128 74 L142 54 Z" opacity="0.9" />
        <path d="M84 24 L116 24 L124 44 L100 60 L76 44 Z" opacity="0.86" />
        <path d="M84 176 L116 176 L124 156 L100 140 L76 156 Z" opacity="0.86" />
      </g>
      <g stroke="#8C96A2" strokeWidth="2" opacity="0.7" fill="none">
        <path d="M100 54 L100 24" />
        <path d="M126 73 L162 70" />
        <path d="M116 104 L140 148" />
        <path d="M84 104 L60 148" />
        <path d="M74 73 L38 70" />
      </g>
      <circle cx="100" cy="100" r="86" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
    </g>
  </svg>
);

export const Trophy: React.FC<{
  width?: number;
  accent?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ width = 260, accent = FC.gold, start = 0, style }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.9, easeOut);
  return (
    <svg
      viewBox="0 0 300 460"
      width={width}
      height={width * (460 / 300)}
      style={{
        opacity: p,
        transform: `translateY(${(1 - p) * 28}px)`,
        filter: `drop-shadow(0 22px 40px ${accent}44)`,
        ...style,
      }}
    >
      <defs>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF0C2" />
          <stop offset="32%" stopColor={accent} />
          <stop offset="68%" stopColor="#A97F2E" />
          <stop offset="100%" stopColor="#F3D691" />
        </linearGradient>
      </defs>
      <ellipse cx="150" cy="438" rx="118" ry="18" fill="rgba(0,0,0,0.55)" />
      <path d="M 76 38 L 224 38 L 216 130 Q 212 218 150 244 Q 88 218 84 130 Z" fill="url(#gold)" />
      <path d="M 76 58 Q 24 58 26 128 Q 28 200 92 214 L 96 186 Q 50 174 50 124 Q 50 88 80 88 Z" fill="url(#gold)" opacity="0.92" />
      <path d="M 224 58 Q 276 58 274 128 Q 272 200 208 214 L 204 186 Q 250 174 250 124 Q 250 88 220 88 Z" fill="url(#gold)" opacity="0.92" />
      <path d="M 150 242 L 150 342" stroke="url(#gold)" strokeWidth="18" />
      <path d="M 112 352 Q 150 332 188 352 L 198 388 L 102 388 Z" fill="url(#gold)" />
      <rect x="82" y="388" width="136" height="26" rx="4" fill="url(#gold)" />
      <rect x="64" y="414" width="172" height="20" rx="4" fill="#8A6524" />
      <path d="M 150 78 L 158 100 L 182 100 L 163 114 L 170 137 L 150 123 L 130 137 L 137 114 L 118 100 L 142 100 Z" fill={FC.black} opacity="0.55" />
      <path d="M 100 70 Q 150 90 200 70" fill="none" stroke="#FFF4CE" strokeWidth="3" opacity="0.65" />
      <text x="150" y="185" textAnchor="middle" fontFamily={MONO} fontSize="19" letterSpacing="5" fill={FC.black} opacity="0.6">
        No. 7
      </text>
    </svg>
  );
};

/* ------------------------------------------------------------------ */
/* Cards / data                                                        */
/* ------------------------------------------------------------------ */

export const ClubCrest: React.FC<{ initials: string; color?: string; size?: number }> = ({
  initials,
  color = FC.cyan,
  size = 46,
}) => (
  <svg viewBox="0 0 100 116" width={size} height={size * 1.16}>
    <path d="M 50 4 L 92 18 L 92 62 Q 92 92 50 112 Q 8 92 8 62 L 8 18 Z" fill="none" stroke={color} strokeWidth="3" />
    <path d="M 50 12 L 84 23 L 84 60 Q 84 85 50 102 Q 16 85 16 60 L 16 23 Z" fill={`${color}18`} />
    <text x="50" y="68" textAnchor="middle" fontFamily={MONO} fontSize="28" fontWeight="700" fill={color}>
      {initials}
    </text>
  </svg>
);

export const ClubCard: React.FC<{
  name: string;
  initials: string;
  status: string;
  accent?: string;
  width?: number;
  active?: boolean;
  style?: CSSProperties;
}> = ({ name, initials, status, accent = FC.cyan, width = 190, active = false, style }) => (
  <div
    style={{
      width,
      padding: "14px 14px 12px",
      borderRadius: 7,
      border: `1px solid ${active ? accent : FC.line}`,
      background: active
        ? `linear-gradient(155deg, ${accent}1A, rgba(10,13,18,0.96))`
        : "linear-gradient(155deg, rgba(28,33,40,0.9), rgba(10,13,18,0.96))",
      boxShadow: active ? `0 0 34px ${accent}22` : "0 16px 40px rgba(0,0,0,0.4)",
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <ClubCrest initials={initials} color={active ? accent : FC.dim} size={34} />
      <Mono size={8} color={FC.mute}>
        {active ? "LIVE" : "SCOUT"}
      </Mono>
    </div>
    <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 700, color: FC.white, marginTop: 12 }}>
      {name}
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 5 }}>
      <Dot color={active ? accent : FC.mute} size={4} />
      <Mono size={8} color={active ? accent : FC.mute}>
        {status}
      </Mono>
    </div>
  </div>
);

export const PlayerCard: React.FC<{
  width?: number;
  accent?: string;
  status?: string;
  statusColor?: string;
  dim?: number;
  style?: CSSProperties;
  variant?: "gold" | "graphite";
}> = ({
  width = 340,
  accent = FC.gold,
  status = "SIGNED",
  statusColor = FC.pitchLight,
  dim = 1,
  style,
  variant = "gold",
}) => {
  const dark = variant === "graphite";
  return (
    <div
      style={{
        width,
        padding: 2,
        borderRadius: 16,
        background: dark
          ? `linear-gradient(155deg, ${FC.line}, rgba(8,10,15,0.7))`
          : `linear-gradient(155deg, ${accent}, ${accent}22 42%, ${FC.line} 100%)`,
        boxShadow: `0 40px 100px rgba(0,0,0,0.66), 0 0 60px ${accent}18`,
        opacity: dim,
        ...style,
      }}
    >
      <div
        style={{
          borderRadius: 14,
          background:
            "linear-gradient(170deg, #20252D 0%, #111419 46%, #080A0F 100%)",
          padding: "18px 20px 16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 32%, ${accent}1F 0%, transparent 58%)`,
          }}
        />
        <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontFamily: FONT, fontSize: width * 0.16, fontWeight: 800, lineHeight: 0.83, color: accent }}>
              {dark ? "07" : "7"}
            </div>
            <Mono size={8} color={FC.mute} style={{ letterSpacing: "0.18em" }}>
              POSITION
            </Mono>
            <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: FC.white, letterSpacing: "0.06em" }}>
              STRIKER
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Tag color={statusColor} background={`${statusColor}16`} border={`${statusColor}44`} style={{ fontSize: 8 }}>
              {status}
            </Tag>
            <div style={{ fontFamily: MONO, fontSize: 8, color: FC.mute, letterSpacing: "0.14em", marginTop: 9 }}>
              REL. LEAGUE
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginTop: -6, marginBottom: -14 }}>
          <JerseySeven width={width * 0.56} accent={accent} tone={dark ? "dark" : "gold"} number="7" opacity={0.95} />
        </div>

        <div style={{ position: "relative", textAlign: "center", marginTop: -6 }}>
          <div style={{ fontFamily: FONT, fontSize: 21, fontWeight: 800, letterSpacing: "0.02em", color: FC.white }}>
            THE STRIKER
          </div>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.22em", color: FC.mute, marginTop: 3 }}>
            NO REAL PLAYER · NO REAL CLUB
          </div>
        </div>

        <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { label: "CHAT", value: 92 },
            { label: "CHARM", value: 88 },
            { label: "EXCLUSIVE", value: dark ? 9 : 74 },
          ].map((stat) => (
            <div key={stat.label}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <Mono size={7} color={FC.mute}>
                  {stat.label}
                </Mono>
                <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 700, color: accent }}>{stat.value}</span>
              </div>
              <div style={{ height: 2, background: FC.line, marginTop: 4 }}>
                <div style={{ width: `${stat.value}%`, height: "100%", background: accent }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const StatMeter: React.FC<{
  label: string;
  value: string;
  pct: number;
  start?: number;
  color?: string;
  height?: number;
}> = ({ label, value, pct, start = 0, color = FC.cyan, height = 6 }) => {
  const { t } = useTime();
  const p = progress(t, start, 1.1, easeOut);
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <Mono size={9} color={FC.dim}>
          {label}
        </Mono>
        <span style={{ fontFamily: MONO, fontSize: 11, color, fontVariantNumeric: "tabular-nums" }}>{value}</span>
      </div>
      <div style={{ height, background: "rgba(245,247,250,0.09)", overflow: "hidden" }}>
        <div
          style={{
            width: `${pct * p}%`,
            height: "100%",
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 14px ${color}55`,
          }}
        />
      </div>
    </div>
  );
};

export const LeagueTable: React.FC<{
  width?: number;
  accent?: string;
  dimFrom?: number;
  start?: number;
}> = ({ width = 640, accent = FC.red, dimFrom = 0.55, start = 0 }) => {
  const { t } = useTime();
  const rows = [
    { pos: 1, club: "ATLAS FC", p: 12, pts: 30 },
    { pos: 2, club: "NORTHGATE", p: 12, pts: 27 },
    { pos: 3, club: "RIVER END", p: 12, pts: 24 },
    { pos: 4, club: "ROYAL 04", p: 12, pts: 21 },
    { pos: 5, club: "YOUR CLUB", p: 12, pts: 18, us: true },
    { pos: 6, club: "MIDNIGHT", p: 12, pts: 15 },
  ];
  return (
    <div style={{ width, opacity: progress(t, start, 0.6) }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr 42px 42px 54px",
          gap: 8,
          padding: "0 12px 8px",
          borderBottom: `1px solid ${FC.line}`,
        }}
      >
        {["#", "CLUB", "P", "W", "PTS"].map((label) => (
          <Mono key={label} size={8} color={FC.mute}>
            {label}
          </Mono>
        ))}
      </div>
      {rows.map((row, index) => {
        const active = Boolean(row.us);
        const p = progress(t, start + 0.12 + index * 0.07, 0.55);
        return (
          <div
            key={row.club}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 42px 42px 54px",
              gap: 8,
              alignItems: "center",
              padding: "12px 12px",
              borderBottom: `1px solid ${FC.lineSoft}`,
              background: active ? `${accent}12` : "transparent",
              borderLeft: active ? `2px solid ${accent}` : "2px solid transparent",
              opacity: p * (active ? 1 : dimFrom),
            }}
          >
            <span style={{ fontFamily: MONO, fontSize: 12, color: active ? accent : FC.dim }}>
              {active ? "↓" : row.pos}
            </span>
            <span style={{ fontFamily: FONT, fontSize: 14, fontWeight: active ? 700 : 500, color: active ? FC.white : FC.silver }}>
              {row.club}
            </span>
            <Mono size={10} color={FC.dim}>
              {row.p}
            </Mono>
            <Mono size={10} color={FC.dim}>
              {index % 2 === 0 ? 7 : 6}
            </Mono>
            <span style={{ fontFamily: MONO, fontSize: 13, color: active ? accent : FC.white, textAlign: "right" }}>
              {row.pts}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Documents                                                           */
/* ------------------------------------------------------------------ */

export const ContractDoc: React.FC<{
  width?: number;
  accent?: string;
  signed?: number;
  terminated?: boolean;
  stampText?: string;
  statusText?: string;
  style?: CSSProperties;
}> = ({
  width = 620,
  accent = FC.gold,
  signed = 1,
  terminated = false,
  stampText = "SIGNED",
  statusText = "PLAYER REGISTRATION · PRIVATE",
  style,
}) => {
  const { t } = useTime();
  const line = progress(t, 0.1, 0.8);
  const signature = progress(t, 0.65, 0.9);
  return (
    <div
      style={{
        width,
        background: "linear-gradient(165deg, #F4EFE2 0%, #E8E0CF 68%, #DCD2BE 100%)",
        color: "#15171B",
        boxShadow: "0 40px 100px rgba(0,0,0,0.62)",
        padding: "38px 40px 32px",
        position: "relative",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(21,23,27,0.028) 0px, rgba(21,23,27,0.028) 1px, transparent 1px, transparent 4px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "2px solid #15171B",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: 15,
            }}
          >
            7
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.22em", color: "#5A5F68" }}>
              PLAYER REGISTRATION
            </div>
            <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 800, letterSpacing: "-0.03em" }}>
              RELATIONSHIP LEAGUE
            </div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: "#5A5F68" }}>FORM 07-B</div>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: "#5A5F68" }}>CONFIDENTIAL</div>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(21,23,27,0.25)", margin: "24px 0 20px" }} />

      <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: "#5A5F68" }}>{statusText}</div>

      <div style={{ fontFamily: FONT, fontSize: width * 0.062, fontWeight: 800, letterSpacing: "-0.045em", lineHeight: 0.95, marginTop: 8 }}>
        {terminated ? "MUTUAL" : "EXCLUSIVE"}
        <br />
        {terminated ? "TERMINATION" : "AGREEMENT"}
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 11 }}>
        {[
          ["CLUB", "ATLAS FC"],
          ["PLAYER", "THE STRIKER"],
          ["TERM", terminated ? "TERMINATED" : "ROLLING · WEEK TO WEEK"],
          ["STATUS", terminated ? "FREE AGENT" : "FIRST TEAM"],
          ["LOAN CLAUSE", terminated ? "STILL AVAILABLE?" : "NONE"],
        ].map(([label, value], index) => {
          const p = clamp(line * 1.4 - index * 0.1);
          return (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(21,23,27,0.14)",
                paddingBottom: 6,
                opacity: p,
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: "#5A5F68" }}>{label}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", fontWeight: 600 }}>{value}</span>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.16em", color: "#5A5F68" }}>SIGNED FOR THE CLUB</div>
          <svg width={230} height={64} viewBox="0 0 230 64" style={{ marginTop: 4 }}>
            <path
              d="M 8 48 C 24 16, 38 12, 46 30 C 52 44, 38 56, 32 46 C 30 38, 56 20, 74 38 C 86 50, 98 22, 112 30 C 126 38, 118 52, 138 34 C 150 22, 160 22, 170 34 C 182 50, 198 14, 222 26"
              fill="none"
              stroke="#1B2A63"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1 - signature}
            />
          </svg>
        </div>
        <div
          style={{
            width: 116,
            height: 116,
            borderRadius: "50%",
            border: `3px solid ${accent}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            transform: `rotate(-11deg) scale(${signed})`,
            opacity: signed * 0.9,
            color: accent,
            fontFamily: MONO,
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.12em",
            lineHeight: 1.3,
          }}
        >
          {stampText}
          <br />
          <span style={{ fontSize: 8 }}>07 / REL.</span>
        </div>
      </div>

      <div style={{ marginTop: 22, borderTop: "1px solid rgba(21,23,27,0.22)", paddingTop: 8, display: "flex", justifyContent: "space-between" }}>
        <Mono size={7} color="#6A6F78">
          ILLUSTRATIVE DOCUMENT · NOT A REAL CONTRACT
        </Mono>
        <Mono size={7} color="#6A6F78">
          PAGE 1 / 1
        </Mono>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Phone / notifications                                               */
/* ------------------------------------------------------------------ */

export const PhoneNotification: React.FC<{
  width?: number;
  time?: string;
  title?: string;
  message?: string;
  accent?: string;
  scale?: number;
  style?: CSSProperties;
}> = ({
  width = 660,
  time = "23:47",
  title = "FORMER CLUB",
  message = "Can we talk?",
  accent = FC.pink,
  scale = 1,
  style,
}) => (
  <div
    style={{
      width,
      borderRadius: 28,
      border: "1px solid rgba(245,247,250,0.16)",
      background: "linear-gradient(165deg, rgba(37,41,50,0.88) 0%, rgba(13,15,20,0.96) 100%)",
      backdropFilter: "blur(24px)",
      boxShadow: "0 46px 120px rgba(0,0,0,0.72), 0 0 80px rgba(255,126,168,0.08)",
      padding: "20px 22px 18px",
      transform: `scale(${scale})`,
      ...style,
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 18, height: 18, borderRadius: 4, background: accent, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: FONT, fontSize: 11, fontWeight: 800, color: FC.black }}>
          7
        </span>
        <Mono size={9} color={FC.silver}>
          MESSAGES
        </Mono>
      </div>
      <Mono size={9} color={FC.dim}>
        {time}
      </Mono>
    </div>
    <div style={{ height: 1, background: FC.lineSoft, margin: "14px 0" }} />
    <div style={{ display: "flex", gap: 14 }}>
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: "50%",
          background: `linear-gradient(150deg, ${accent}, ${accent}33)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT,
          fontWeight: 800,
          fontSize: 18,
          color: FC.black,
          flexShrink: 0,
        }}
      >
        7
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: FC.white }}>{title}</span>
          <Mono size={8} color={FC.mute}>
            NOW
          </Mono>
        </div>
        <div style={{ fontFamily: FONT, fontSize: 17, fontWeight: 500, color: FC.white, marginTop: 5, letterSpacing: "-0.01em" }}>
          “{message}”
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 7, background: "rgba(245,247,250,0.07)", fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", color: FC.silver }}>
            NOT NOW
          </div>
          <div style={{ flex: 1, textAlign: "center", padding: "8px 0", borderRadius: 7, background: accent, fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", color: FC.black, fontWeight: 700 }}>
            REPLY
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TransferToast: React.FC<{
  width?: number;
  label?: string;
  title?: string;
  accent?: string;
  style?: CSSProperties;
}> = ({ width = 520, label = "TRANSFER DESK", title = "NEW OFFER RECEIVED", accent = FC.cyan, style }) => (
  <div
    style={{
      width,
      display: "flex",
      alignItems: "center",
      gap: 13,
      padding: "14px 16px",
      borderRadius: 10,
      border: `1px solid ${accent}44`,
      background: "linear-gradient(150deg, rgba(24,29,36,0.96), rgba(8,10,15,0.98))",
      boxShadow: `0 26px 70px rgba(0,0,0,0.62), 0 0 50px ${accent}14`,
      ...style,
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 8,
        background: `${accent}18`,
        border: `1px solid ${accent}44`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: FONT,
        fontWeight: 800,
        fontSize: 17,
        color: accent,
      }}
    >
      7
    </div>
    <div style={{ flex: 1 }}>
      <Mono size={8} color={FC.mute}>
        {label}
      </Mono>
      <div style={{ fontFamily: FONT, fontSize: 15, fontWeight: 700, color: FC.white, marginTop: 2 }}>{title}</div>
    </div>
    <Dot color={accent} size={6} pulse />
  </div>
);

export const BigStat: React.FC<{
  value: ReactNode;
  label: string;
  accent?: string;
  start?: number;
}> = ({ value, label, accent = FC.cyan, start = 0 }) => (
  <Reveal start={start} y={14}>
    <div style={{ fontFamily: FONT, fontSize: 54, fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.9, color: accent }}>
      {value}
    </div>
    <Mono size={8} color={FC.mute} style={{ display: "block", marginTop: 7 }}>
      {label}
    </Mono>
  </Reveal>
);

export const DashboardHeader: React.FC<{ accent?: string; label?: string; right?: string }> = ({
  accent = FC.cyan,
  label = "TRANSFER MARKET",
  right = "LIVE",
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 18px",
      height: 52,
      borderBottom: `1px solid ${FC.lineSoft}`,
      background: "rgba(255,255,255,0.018)",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: accent }} />
      <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.18em", color: FC.white }}>{label}</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
      <Dot color={FC.pitchLight} size={5} pulse />
      <Mono size={8} color={FC.pitchLight}>
        {right}
      </Mono>
    </div>
  </div>
);

export const MetricRow: React.FC<{
  label: string;
  value: string;
  hint?: string;
  accent?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ label, value, hint, accent = FC.white, start = 0, style }) => (
  <Reveal start={start} y={10} style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, ...style }}>
    <div>
      <Mono size={9} color={FC.dim}>
        {label}
      </Mono>
      {hint ? (
        <div style={{ fontFamily: FONT, fontSize: 12, color: FC.mute, marginTop: 2 }}>{hint}</div>
      ) : null}
    </div>
    <span style={{ fontFamily: FONT, fontSize: 24, fontWeight: 800, letterSpacing: "-0.04em", color: accent }}>{value}</span>
  </Reveal>
);

/** One clean vertical rule used as a scene divider in the editorial reveal. */
export const VerticalRule: React.FC<{ start?: number; color?: string; style?: CSSProperties }> = ({
  start = 0,
  color = FC.cyan,
  style,
}) => {
  const { t } = useTime();
  const p = progress(t, start, 0.7);
  return <div style={{ width: 1, height: `${p * 100}%`, background: `linear-gradient(180deg, ${color}, transparent)`, ...style }} />;
};

export const HeadlineStack: React.FC<{
  lines: string[];
  start?: number;
  size?: number;
  color?: string;
  accentColor?: string;
  accentIndex?: number;
  align?: "left" | "center";
}> = ({ lines, start = 0, size = 92, color = FC.white, accentColor = FC.cyan, accentIndex = -1, align = "left" }) => (
  <div style={{ textAlign: align }}>
    {lines.map((line, index) => (
      <Reveal key={line} start={start + index * 0.1} y={26} duration={0.7}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: size,
            fontWeight: 800,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            color: index === accentIndex ? accentColor : color,
          }}
        >
          {line}
        </div>
      </Reveal>
    ))}
  </div>
);

export const MiniForm: React.FC<{ results?: ("W" | "D" | "L")[]; start?: number }> = ({
  results = ["W", "W", "W", "D", "L"],
  start = 0,
}) => {
  const { t } = useTime();
  return (
    <div style={{ display: "flex", gap: 5, opacity: progress(t, start, 0.5) }}>
      {results.map((result, index) => (
        <div
          key={index}
          style={{
            width: 22,
            height: 22,
            borderRadius: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              result === "W" ? `${FC.pitchLight}22` : result === "D" ? `${FC.gold}1C` : `${FC.red}22`,
            border: `1px solid ${result === "W" ? FC.pitchLight : result === "D" ? FC.gold : FC.red}44`,
            fontFamily: MONO,
            fontSize: 9,
            color: result === "W" ? FC.pitchLight : result === "D" ? FC.gold : FC.red,
          }}
        >
          {result}
        </div>
      ))}
    </div>
  );
};

export const BroadcastScoreBug: React.FC<{
  home?: string;
  away?: string;
  score?: string;
  minute?: string;
  accent?: string;
  start?: number;
  style?: CSSProperties;
}> = ({ home = "ATLAS", away = "YOUR CLUB", score = "1 - 0", minute = "67'", accent = FC.gold, start = 0, style }) => (
  <Reveal
    start={start}
    y={-12}
    style={{
      display: "inline-flex",
      alignItems: "stretch",
      border: `1px solid ${FC.line}`,
      background: "rgba(8,10,15,0.86)",
      ...style,
    }}
  >
    <div style={{ padding: "9px 14px", borderRight: `1px solid ${FC.line}`, fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: FC.white }}>
      {home}
    </div>
    <div style={{ padding: "9px 12px", fontFamily: MONO, fontSize: 12, letterSpacing: "0.1em", color: accent, fontWeight: 700 }}>
      {score}
    </div>
    <div style={{ padding: "9px 12px", borderLeft: `1px solid ${FC.line}`, fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: FC.white }}>
      {away}
    </div>
    <div style={{ padding: "9px 10px", borderLeft: `1px solid ${FC.line}`, fontFamily: MONO, fontSize: 10, color: FC.mute }}>
      {minute}
    </div>
  </Reveal>
);

export { Counter, Kicker };
