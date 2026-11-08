import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/coinbase";
import {
  BackdropGrid,
  Dot,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  progress,
  useTime,
  Vignette,
} from "../kit";

const NODES = ["PLAN", "BUILD", "TEST", "REVIEW", "SHIP", "LEARN"] as const;

const AgentRing: React.FC<{ size: number; opacity: number }> = ({ size, opacity }) => {
  const { frame, fps } = useTime();
  const t = frame / fps;
  const cx = size / 2;
  const cy = size * 0.54;
  const rx1 = size * 0.42;
  const ry1 = size * 0.165;
  const rx2 = size * 0.31;
  const ry2 = size * 0.118;
  const rx3 = size * 0.2;
  const ry3 = size * 0.074;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "visible", opacity, filter: "drop-shadow(0 0 28px rgba(200,246,91,0.08))" }}
    >
      <defs>
        <radialGradient id="floor" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={C.lime} stopOpacity="0.14" />
          <stop offset="100%" stopColor={C.lime} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx={cx} cy={cy + size * 0.2} rx={rx1 * 1.16} ry={ry1 * 1.2} fill="url(#floor)" />
      {[
        [rx1, ry1, 0.14],
        [rx2, ry2, 0.2],
        [rx3, ry3, 0.28],
      ].map(([rx, ry, o], i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy + size * 0.2}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={i === 0 ? C.line : "rgba(200,246,91,0.22)"}
          strokeWidth={1}
          opacity={o}
        />
      ))}

      <ellipse
        cx={cx}
        cy={cy + size * 0.2}
        rx={rx2}
        ry={ry2}
        fill="none"
        stroke={C.lime}
        strokeWidth={1}
        strokeDasharray="2 12"
        opacity={0.32}
        transform={`rotate(${t * 9} ${cx} ${cy + size * 0.2})`}
      />

      {NODES.map((label, i) => {
        const angle = (i / NODES.length) * Math.PI * 2 + t * 0.16;
        const x = cx + Math.cos(angle) * rx1;
        const y = cy + size * 0.2 + Math.sin(angle) * ry1;
        const front = (Math.sin(angle) + 1) / 2;
        const lx = cx + Math.cos(angle) * (rx1 + size * 0.055);
        const ly = cy + size * 0.2 + Math.sin(angle) * (ry1 + size * 0.04);
        return (
          <g key={label} opacity={0.4 + front * 0.6}>
            <line
              x1={cx}
              y1={cy + size * 0.08}
              x2={x}
              y2={y}
              stroke={C.lime}
              strokeWidth={0.8}
              opacity={0.08 + front * 0.12}
            />
            <circle cx={x} cy={y} r={3.4 + front * 1.6} fill={C.lime} opacity={0.7 + front * 0.3} />
            <circle cx={x} cy={y} r={10} fill="none" stroke={C.lime} strokeWidth={0.8} opacity={0.18} />
            <text
              x={lx}
              y={ly}
              fill={front > 0.55 ? C.white : C.mute}
              fontFamily={FONT}
              fontSize={size * 0.0125}
              fontWeight={500}
              letterSpacing="0.14em"
              textAnchor={Math.cos(angle) > 0.2 ? "start" : Math.cos(angle) < -0.2 ? "end" : "middle"}
              dominantBaseline="middle"
              opacity={0.55 + front * 0.45}
            >
              {label}
            </text>
          </g>
        );
      })}

      {/* Human figure, drawn as a continuous light line */}
      <g
        stroke={C.white}
        strokeWidth={size * 0.0034}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity={0.92}
      >
        <circle cx={cx} cy={cy - size * 0.135} r={size * 0.027} />
        <path d={`M ${cx} ${cy - size * 0.108} L ${cx} ${cy - size * 0.085}`} />
        <path
          d={`M ${cx - size * 0.052} ${cy - size * 0.084} Q ${cx} ${cy - size * 0.1} ${cx + size * 0.052} ${cy - size * 0.084}`}
        />
        <path
          d={`M ${cx - size * 0.04} ${cy - size * 0.082} L ${cx - size * 0.026} ${cy + size * 0.016} L ${cx + size * 0.026} ${cy + size * 0.016} L ${cx + size * 0.04} ${cy - size * 0.082}`}
        />
        <path
          d={`M ${cx - size * 0.045} ${cy - size * 0.074} L ${cx - size * 0.082} ${cy - size * 0.012} L ${cx - size * 0.09} ${cy + size * 0.062}`}
        />
        <path
          d={`M ${cx + size * 0.045} ${cy - size * 0.074} L ${cx + size * 0.082} ${cy - size * 0.012} L ${cx + size * 0.09} ${cy + size * 0.062}`}
        />
        <path d={`M ${cx - size * 0.014} ${cy + size * 0.016} L ${cx - size * 0.032} ${cy + size * 0.145}`} />
        <path d={`M ${cx + size * 0.014} ${cy + size * 0.016} L ${cx + size * 0.032} ${cy + size * 0.145}`} />
        <path d={`M ${cx - size * 0.046} ${cy + size * 0.146} L ${cx - size * 0.02} ${cy + size * 0.146}`} />
        <path d={`M ${cx + size * 0.02} ${cy + size * 0.146} L ${cx + size * 0.046} ${cy + size * 0.146}`} />
      </g>
      <circle
        cx={cx}
        cy={cy - size * 0.032}
        r={size * 0.009}
        fill={C.lime}
        opacity={0.75 + Math.sin(t * 3) * 0.2}
      />
      <circle
        cx={cx}
        cy={cy - size * 0.032}
        r={size * 0.026}
        fill="none"
        stroke={C.lime}
        strokeWidth={1}
        opacity={0.25 + Math.sin(t * 3) * 0.1}
      />

      <text
        x={cx}
        y={cy + size * 0.205}
        fill={C.lime}
        fontFamily={FONT}
        fontSize={size * 0.011}
        fontWeight={600}
        letterSpacing="0.26em"
        textAnchor="middle"
      >
        DIRECTION
      </text>
      <text
        x={cx}
        y={cy + size * 0.235}
        fill={C.mute}
        fontFamily={MONO}
        fontSize={size * 0.0075}
        letterSpacing="0.16em"
        textAnchor="middle"
      >
        INTENT · JUDGMENT · REVIEW
      </text>
    </svg>
  );
};

export const SceneConclusion: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();

  const oneOut = progress(frame, fps, 3.15, 0.42, (x) => x);
  const twoIn = progress(frame, fps, 3.35, 0.7);
  const sceneOut = 1 - progress(frame, fps, 6.0, 0.4, (x) => x);
  const finalIn = progress(frame, fps, 6.45, 0.7);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="50%" y="58%" size={72} opacity={0.07} />
      <BackdropGrid opacity={0.2} size={wide ? 108 : 90} />
      <Vignette strength={0.95} />

      <div style={{ position: "absolute", left: margin, top: wide ? 104 : 106, opacity: sceneOut }}>
        <Kicker start={-0.5}>{COPY.conclusionKicker}</Kicker>
      </div>

      {/* First headline */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 168 : 166,
          width: wide ? 720 : 920,
          opacity: (1 - oneOut) * sceneOut,
          transform: `translateY(${-oneOut * 30}px)`,
        }}
      >
        {COPY.conclusionOne.map((line, i) => (
          <MaskLine
            key={line}
            start={-0.4 + i * 0.12}
            duration={0.86}
            style={{
              fontFamily: FONT,
              fontSize: i === 0 ? v(80, 66) : v(86, 70),
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              color: i === 0 ? C.dim : C.white,
            }}
          >
            {line}
          </MaskLine>
        ))}
      </div>

      {/* Second headline */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 168 : 166,
          width: wide ? 760 : 920,
          opacity: twoIn * sceneOut,
          transform: `translateY(${(1 - twoIn) * 26}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: v(38, 32),
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: C.dim,
            marginBottom: v(10, 8),
          }}
        >
          IT'S
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: v(82, 68),
            fontWeight: 600,
            letterSpacing: "-0.05em",
            lineHeight: 0.98,
            color: C.white,
          }}
        >
          <span style={{ color: C.lime }}>DIRECTING</span> THE
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: v(72, 60),
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 1,
            color: C.white,
          }}
        >
          SYSTEMS THAT BUILD IT.
        </div>
      </div>

      {/* Ring and operator */}
      <div
        style={{
          position: "absolute",
          left: wide ? 760 : "50%",
          top: wide ? 30 : 662,
          width: wide ? 900 : 900,
          height: wide ? 900 : 900,
          transform: wide ? "none" : "translateX(-50%)",
          opacity: sceneOut,
        }}
      >
        <AgentRing size={900} opacity={0.18 + twoIn * 0.8} />
      </div>

      {/* Final signature line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: wide ? 430 : 790,
          textAlign: "center",
          opacity: finalIn,
          transform: `translateY(${(1 - finalIn) * 20}px)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            alignItems: "center",
            marginBottom: 22,
            opacity: 0.8,
          }}
        >
          <div style={{ width: 40, height: 1, background: C.lime, opacity: 0.7 }} />
          <Dot size={5} />
          <div style={{ width: 40, height: 1, background: C.lime, opacity: 0.7 }} />
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: v(27, 24),
            fontWeight: 500,
            letterSpacing: "0.22em",
            color: C.dim,
          }}
        >
          {COPY.finalLine[0]}
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: FONT,
            fontSize: v(54, 46),
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: C.white,
          }}
        >
          {COPY.finalLine[1]}
        </div>
      </div>

      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
