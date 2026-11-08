import { useId } from "react";
import { interpolate } from "remotion";

type BrickProps = {
  color: string;
  width: number;
  style?: React.CSSProperties;
  opacity?: number;
  /** 0-1 horizontal light sweep. */
  sweep?: number;
  rotate?: number;
  className?: string;
  shadow?: boolean;
};

const W = 360;
const H = 220;

const clamp = (v: number) => Math.max(0, Math.min(1, v));

const shade = (hex: string, amount: number) => {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value) || normalized.length !== 6) return hex;
  const channels = [
    (value >> 16) & 255,
    (value >> 8) & 255,
    value & 255,
  ].map((channel) =>
    Math.max(0, Math.min(255, Math.round(channel + (amount < 0 ? channel * amount : (255 - channel) * amount)))),
  );
  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
};

const A = { x: 48, y: 64 };
const B = { x: 262, y: 28 };
const C = { x: 330, y: 72 };
const D = { x: 116, y: 108 };
const C2 = { x: 330, y: 158 };
const D2 = { x: 116, y: 194 };
const A2 = { x: 48, y: 150 };
const B2 = { x: 262, y: 114 };

const point = (p: { x: number; y: number }) => `${p.x},${p.y}`;

const studPositions = () => {
  const positions: Array<{ x: number; y: number }> = [];
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      const u = (col + 0.5) / 4;
      const v = (row + 0.5) / 2;
      positions.push({
        x: A.x + (B.x - A.x) * u + (D.x - A.x) * v,
        y: A.y + (B.y - A.y) * u + (D.y - A.y) * v,
      });
    }
  }
  return positions;
};

export const Brick: React.FC<BrickProps> = ({
  color,
  width,
  style,
  opacity = 1,
  sweep = 0,
  rotate = 0,
  className,
  shadow = true,
}) => {
  const rawId = useId().replace(/:/g, "");
  const top = shade(color, 0.24);
  const topDeep = shade(color, 0.12);
  const front = shade(color, -0.1);
  const side = shade(color, -0.34);
  const dark = shade(color, -0.54);
  const sweepX = interpolate(clamp(sweep), [0, 1], [-340, 500]);
  const studs = studPositions();

  return (
    <div
      className={className}
      style={{
        width,
        height: (width * H) / W,
        position: "relative",
        opacity,
        transform: `rotate(${rotate}deg)`,
        filter: shadow ? "drop-shadow(0 34px 34px rgba(0,0,0,0.42))" : undefined,
        ...style,
      }}
    >
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" aria-hidden="true">
        <defs>
          <linearGradient id={`${rawId}-top`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={top} />
            <stop offset="0.55" stopColor={topDeep} />
            <stop offset="1" stopColor={front} />
          </linearGradient>
          <linearGradient id={`${rawId}-front`} x1="0" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor={front} />
            <stop offset="1" stopColor={side} />
          </linearGradient>
          <linearGradient id={`${rawId}-side`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={side} />
            <stop offset="1" stopColor={dark} />
          </linearGradient>
          <linearGradient id={`${rawId}-stud`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={shade(top, 0.22)} />
            <stop offset="0.55" stopColor={top} />
            <stop offset="1" stopColor={front} />
          </linearGradient>
          <clipPath id={`${rawId}-clip`}>
            <polygon points={`${point(A)} ${point(B)} ${point(C)} ${point(C2)} ${point(D2)} ${point(D)}`} />
          </clipPath>
          <filter id={`${rawId}-blur`}>
            <feGaussianBlur stdDeviation="7" />
          </filter>
        </defs>

        <ellipse cx="182" cy="203" rx="142" ry="13" fill="#000" opacity="0.38" filter={`url(#${rawId}-blur)`} />

        {/* visible body faces */}
        <polygon points={`${point(A)} ${point(D)} ${point(D2)} ${point(A2)}`} fill={`url(#${rawId}-side)`} />
        <polygon points={`${point(D)} ${point(C)} ${point(C2)} ${point(D2)}`} fill={`url(#${rawId}-front)`} />
        <polygon points={`${point(B)} ${point(C)} ${point(C2)} ${point(B2)}`} fill={`url(#${rawId}-side)`} opacity="0.94" />

        {/* top plane */}
        <polygon points={`${point(A)} ${point(B)} ${point(C)} ${point(D)}`} fill={`url(#${rawId}-top)`} />

        {/* eight studs, drawn as shallow cylinders on the top plane */}
        {studs.map((stud, index) => {
          const rx = 15.5;
          const ry = 7.6;
          const height = 10;
          return (
            <g key={`stud-${index}`}>
              <path
                d={`M ${stud.x - rx} ${stud.y} L ${stud.x - rx} ${stud.y + height} Q ${stud.x} ${stud.y + height + ry} ${stud.x + rx} ${stud.y + height} L ${stud.x + rx} ${stud.y} Q ${stud.x} ${stud.y + ry} ${stud.x - rx} ${stud.y} Z`}
                fill={`url(#${rawId}-stud)`}
                opacity="0.96"
              />
              <ellipse cx={stud.x} cy={stud.y} rx={rx} ry={ry} fill={shade(top, 0.18)} />
              <ellipse cx={stud.x - 4} cy={stud.y - 2.2} rx={7.5} ry={3.2} fill="#FFF" opacity="0.15" />
            </g>
          );
        })}

        {/* bevel and edge light */}
        <polyline
          points={`${point(A)} ${point(B)} ${point(C)}`}
          fill="none"
          stroke="#FFF"
          strokeWidth="1.2"
          opacity="0.22"
        />
        <polyline
          points={`${point(A)} ${point(D)} ${point(C)}`}
          fill="none"
          stroke="#000"
          strokeWidth="1.6"
          opacity="0.12"
        />
        <line x1={D.x} y1={D.y} x2={C.x} y2={C.y} stroke="#FFF" strokeWidth="1.1" opacity="0.13" />
        <line x1={A2.x} y1={A2.y} x2={D2.x} y2={D2.y} stroke="#000" strokeWidth="2" opacity="0.2" />

        {/* restrained moving light sweep */}
        <g clipPath={`url(#${rawId}-clip)`}>
          <polygon
            points={`${sweepX},0 ${sweepX + 92},0 ${sweepX - 20},220 ${sweepX - 112},220`}
            fill="#FFFFFF"
            opacity="0.12"
          />
        </g>

        {/* faint plastic dust */}
        {[18, 49, 87, 120, 163, 204, 240, 284].map((x, i) => (
          <circle key={x} cx={x} cy={42 + ((i * 23) % 98)} r={i % 3 === 0 ? 1.1 : 0.65} fill="#FFF" opacity="0.1" />
        ))}
      </svg>
    </div>
  );
};

export const BrickTower: React.FC<{
  paletteAccent: string;
  accentSecondary: string;
  ivory: string;
  frame: number;
  fps: number;
}> = ({ paletteAccent, accentSecondary, ivory, frame, fps }) => {
  const drop = interpolate(frame, [fps * 8.8, fps * 10.2], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div style={{ position: "relative", width: 620, height: 740 }}>
      <div
        style={{
          position: "absolute",
          left: 70,
          top: 20,
          width: 460,
          height: 560,
          background: `radial-gradient(ellipse, ${paletteAccent}22, transparent 66%)`,
          filter: "blur(20px)",
        }}
      />
      <Brick color={paletteAccent} width={440} style={{ position: "absolute", left: 100, top: 450 }} sweep={0.45} />
      <Brick color={accentSecondary} width={350} style={{ position: "absolute", left: 156, top: 300 }} sweep={0.55} />
      <Brick color={ivory} width={250} style={{ position: "absolute", left: 216, top: 186 }} sweep={0.62} />
      <Brick
        color={paletteAccent}
        width={150}
        style={{
          position: "absolute",
          left: 296,
          top: 90 - (1 - drop) * 420,
          opacity: 0.3 + drop * 0.7,
        }}
        sweep={0.7}
      />
    </div>
  );
};
