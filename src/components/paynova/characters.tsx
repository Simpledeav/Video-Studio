import type { CSSProperties } from "react";
import { C } from "../../config/paynova";

type Pose = "standing" | "sitting" | "typing" | "pointing" | "concerned" | "relieved" | "thinking";
type Character = "daniel" | "maya" | "alex";

type CharacterProps = {
  character: Character;
  pose: Pose;
  x: number;
  y: number;
  scale?: number;
  facing?: "left" | "right";
  style?: CSSProperties;
};

const PALETTES: Record<
  Character,
  { skin: string; skinShadow: string; hair: string; hairHighlight: string; shirt: string; shirtShadow: string; pants: string; pantsShadow: string; accent: string }
> = {
  daniel: {
    skin: "#F2D2C1",
    skinShadow: "#DDB09C",
    hair: "#252018",
    hairHighlight: "#3A322A",
    shirt: "#4A5D7A",
    shirtShadow: "#36455C",
    pants: "#2A3342",
    pantsShadow: "#1C222D",
    accent: C.cyan,
  },
  maya: {
    skin: "#C99776",
    skinShadow: "#A8765A",
    hair: "#15100D",
    hairHighlight: "#2A2019",
    shirt: "#6A5A82",
    shirtShadow: "#4F4263",
    pants: "#3A3348",
    pantsShadow: "#282336",
    accent: C.amber,
  },
  alex: {
    skin: "#E6C3AD",
    skinShadow: "#CBA28A",
    hair: "#46382F",
    hairHighlight: "#5E4D41",
    shirt: "#4E6E62",
    shirtShadow: "#3A544A",
    pants: "#2B3632",
    pantsShadow: "#1E2522",
    accent: C.green,
  },
};

export const IllustratedCharacter: React.FC<CharacterProps> = ({
  character,
  pose,
  x,
  y,
  scale = 1,
  facing = "right",
  style,
}) => {
  const p = PALETTES[character];
  const sx = facing === "left" ? -scale : scale;
  const isSitting = pose === "sitting" || pose === "typing";

  const headY = isSitting ? -188 : -212;
  const shoulderY = isSitting ? -118 : -132;
  const torsoHeight = isSitting ? 138 : 168;
  const leftArmAngle = pose === "typing" ? 22 : pose === "pointing" ? -35 : 10;
  const rightArmAngle = pose === "typing" ? -22 : pose === "pointing" ? 25 : -10;

  const expression: "focused" | "concerned" | "relieved" | "neutral" | "thinking" =
    pose === "concerned" ? "concerned" : pose === "relieved" ? "relieved" : pose === "typing" ? "focused" : pose === "thinking" ? "thinking" : "neutral";

  return (
    <svg
      width={460 * scale}
      height={560 * scale}
      viewBox="-230 -380 460 560"
      style={{
        position: "absolute",
        left: x - 230 * scale,
        top: y - 180 * scale,
        overflow: "visible",
        pointerEvents: "none",
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`skin-${character}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={p.skin} />
          <stop offset="100%" stopColor={p.skinShadow} />
        </linearGradient>
        <linearGradient id={`shirt-${character}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.shirt} />
          <stop offset="100%" stopColor={p.shirtShadow} />
        </linearGradient>
        <linearGradient id={`pants-${character}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.pants} />
          <stop offset="100%" stopColor={p.pantsShadow} />
        </linearGradient>
        <linearGradient id={`hair-${character}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.hairHighlight} />
          <stop offset="100%" stopColor={p.hair} />
        </linearGradient>
        <filter id={`char-shadow-${character}`}>
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#000" floodOpacity="0.35" />
        </filter>
      </defs>

      <g transform={`scale(${sx}, 1)`} filter={`url(#char-shadow-${character})`}>
        {/* Ground shadow */}
        <ellipse cx={0} cy={138} rx={92} ry={16} fill="#000" opacity={0.28} />

        {/* Legs / chair */}
        {isSitting ? (
          <>
            <path d="M -40 0 L -44 108 L -18 108 L -12 0 Z" fill={`url(#pants-${character})`} />
            <path d="M 40 0 L 44 108 L 18 108 L 12 0 Z" fill={`url(#pants-${character})`} />
            <rect x={-52} y={95} width={104} height={26} rx={7} fill="#121820" />
          </>
        ) : (
          <>
            <path d="M -34 0 L -46 134 L -20 134 L -10 0 Z" fill={`url(#pants-${character})`} />
            <path d="M 34 0 L 46 134 L 20 134 L 10 0 Z" fill={`url(#pants-${character})`} />
            {/* Shoes */}
            <path d="M -52 132 L -16 132 Q -10 132 -10 124 L -10 118 L -52 118 Q -62 118 -62 126 Q -62 132 -52 132 Z" fill="#151A24" />
            <path d="M 52 132 L 16 132 Q 10 132 10 124 L 10 118 L 52 118 Q 62 118 62 126 Q 62 132 52 132 Z" fill="#151A24" />
          </>
        )}

        {/* Torso */}
        <path
          d={`M -60 ${shoulderY} Q -68 ${shoulderY + torsoHeight * 0.5} -56 ${shoulderY + torsoHeight} L 56 ${shoulderY + torsoHeight} Q 68 ${shoulderY + torsoHeight * 0.5} 60 ${shoulderY} Z`}
          fill={`url(#shirt-${character})`}
        />
        {/* Shirt collar detail */}
        <path d={`M -18 ${shoulderY} L 0 ${shoulderY + 22} L 18 ${shoulderY}`} fill="none" stroke={p.shirtShadow} strokeWidth={3} />

        {/* Arms with hands */}
        <g transform={`rotate(${leftArmAngle} -60 ${shoulderY + 14})`}>
          <path d={`M -60 ${shoulderY + 14} L -96 ${shoulderY + 84} L -78 ${shoulderY + 92} L -48 ${shoulderY + 28} Z`} fill={p.shirtShadow} />
          {/* Hand */}
          <g transform={`translate(-88 ${shoulderY + 88})`}>
            <ellipse cx={0} cy={0} rx={11} ry={13} fill={`url(#skin-${character})`} />
            <rect x={-3} y={-10} width={2} height={7} rx={1} fill={p.skinShadow} />
            <rect x={0} y={-11} width={2} height={8} rx={1} fill={p.skinShadow} />
            <rect x={3} y={-10} width={2} height={7} rx={1} fill={p.skinShadow} />
          </g>
        </g>
        <g transform={`rotate(${rightArmAngle} 60 ${shoulderY + 14})`}>
          <path d={`M 60 ${shoulderY + 14} L 96 ${shoulderY + 84} L 78 ${shoulderY + 92} L 48 ${shoulderY + 28} Z`} fill={p.shirtShadow} />
          {/* Hand */}
          <g transform={`translate(88 ${shoulderY + 88})`}>
            <ellipse cx={0} cy={0} rx={11} ry={13} fill={`url(#skin-${character})`} />
            <rect x={-3} y={-10} width={2} height={7} rx={1} fill={p.skinShadow} />
            <rect x={0} y={-11} width={2} height={8} rx={1} fill={p.skinShadow} />
            <rect x={3} y={-10} width={2} height={7} rx={1} fill={p.skinShadow} />
          </g>
        </g>

        {/* Neck */}
        <rect x={-19} y={headY + 58} width={38} height={30} rx={4} fill={p.skinShadow} />

        {/* Head */}
        <ellipse cx={0} cy={headY} rx={56} ry={66} fill={`url(#skin-${character})`} />

        {/* Hair */}
        {character === "maya" ? (
          <path
            d={`M -58 ${headY - 6} C -68 ${headY - 55} -25 ${headY - 72} 15 ${headY - 70} C 55 ${headY - 66} 66 ${headY - 28} 60 ${headY + 4} C 60 ${headY - 20} 35 ${headY - 42} 0 ${headY - 46} C -35 ${headY - 42} -58 ${headY - 22} -58 ${headY + 4} Z`}
            fill={`url(#hair-${character})`}
          />
        ) : (
          <path
            d={`M -60 ${headY - 4} C -68 ${headY - 58} -20 ${headY - 74} 25 ${headY - 70} C 62 ${headY - 62} 68 ${headY - 24} 62 ${headY + 6} C 60 ${headY - 24} 38 ${headY - 46} 0 ${headY - 50} C -38 ${headY - 46} -60 ${headY - 24} -60 ${headY + 6} Z`}
            fill={`url(#hair-${character})`}
          />
        )}

        {/* Face features - symmetric so mirroring for left-facing characters stays consistent */}
        {expression === "focused" ? (
          <>
            {/* Eyebrows - neutral/softly raised for concentration */}
            <path d={`M -28 ${headY - 16} L -10 ${headY - 16}`} stroke={p.hair} strokeWidth={3} strokeLinecap="round" />
            <path d={`M 10 ${headY - 16} L 28 ${headY - 16}`} stroke={p.hair} strokeWidth={3} strokeLinecap="round" />
            {/* Eyes - looking down at screen (downward arcs, symmetric) */}
            <path d={`M -26 ${headY - 6} Q -18 ${headY + 2} -10 ${headY - 6}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M 10 ${headY - 6} Q 18 ${headY + 2} 26 ${headY - 6}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
            {/* Nose */}
            <path d={`M -2 ${headY + 6} L -4 ${headY + 22} L 4 ${headY + 22}`} fill="none" stroke={p.skinShadow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            {/* Mouth - neutral concentration */}
            <path d={`M -8 ${headY + 38} L 8 ${headY + 38}`} stroke="#3A2820" strokeWidth={3} strokeLinecap="round" />
          </>
        ) : expression === "concerned" ? (
          <>
            {/* Eyebrows - raised inner edges, symmetric */}
            <path d={`M -28 ${headY - 12} Q -18 ${headY - 20} -8 ${headY - 12}`} stroke={p.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M 8 ${headY - 12} Q 18 ${headY - 20} 28 ${headY - 12}`} stroke={p.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
            <circle cx={-18} cy={headY - 2} r={4} fill="#3A2820" />
            <circle cx={18} cy={headY - 2} r={4} fill="#3A2820" />
            <path d={`M -2 ${headY + 6} L -4 ${headY + 22} L 4 ${headY + 22}`} fill="none" stroke={p.skinShadow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M -10 ${headY + 38} Q 0 ${headY + 30} 10 ${headY + 38}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        ) : expression === "relieved" ? (
          <>
            <path d={`M -28 ${headY - 16} Q -18 ${headY - 22} -8 ${headY - 16}`} stroke={p.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M 8 ${headY - 16} Q 18 ${headY - 22} 28 ${headY - 16}`} stroke={p.hair} strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M -28 ${headY - 4} Q -18 ${headY - 10} -8 ${headY - 4}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M 8 ${headY - 4} Q 18 ${headY - 10} 28 ${headY - 4}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
            <path d={`M -2 ${headY + 6} L -4 ${headY + 22} L 4 ${headY + 22}`} fill="none" stroke={p.skinShadow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M -12 ${headY + 34} Q 0 ${headY + 44} 12 ${headY + 34}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        ) : expression === "thinking" ? (
          <>
            <path d={`M -28 ${headY - 16} L -10 ${headY - 16}`} stroke={p.hair} strokeWidth={3} strokeLinecap="round" />
            <path d={`M 10 ${headY - 16} L 28 ${headY - 16}`} stroke={p.hair} strokeWidth={3} strokeLinecap="round" />
            <circle cx={-18} cy={headY - 2} r={3.5} fill="#3A2820" />
            <path d={`M 10 ${headY - 4} L 26 ${headY - 4}`} stroke="#3A2820" strokeWidth={3} strokeLinecap="round" />
            <path d={`M -2 ${headY + 6} L -4 ${headY + 22} L 4 ${headY + 22}`} fill="none" stroke={p.skinShadow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M -6 ${headY + 36} L 6 ${headY + 36}`} stroke="#3A2820" strokeWidth={3} strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d={`M -28 ${headY - 16} L -10 ${headY - 16}`} stroke={p.hair} strokeWidth={3} strokeLinecap="round" />
            <path d={`M 10 ${headY - 16} L 28 ${headY - 16}`} stroke={p.hair} strokeWidth={3} strokeLinecap="round" />
            <circle cx={-18} cy={headY - 2} r={3.5} fill="#3A2820" />
            <circle cx={18} cy={headY - 2} r={3.5} fill="#3A2820" />
            <path d={`M -2 ${headY + 6} L -4 ${headY + 22} L 4 ${headY + 22}`} fill="none" stroke={p.skinShadow} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
            <path d={`M -10 ${headY + 36} Q 0 ${headY + 40} 10 ${headY + 36}`} stroke="#3A2820" strokeWidth={3} fill="none" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
};
