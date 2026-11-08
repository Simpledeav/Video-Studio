import { AbsoluteFill, interpolate, spring } from "remotion";
import type { SceneVisualConfig } from "../../../config/episode.schema";
import { SPRINGS } from "../../../config/motion";
import { paletteHexWithAlpha, type Palette } from "../../../config/theme";
import { seeded } from "../../../utils/deterministic";
import { NumericCounter } from "../../typography/NumericCounter";

type BaseProps = {
  palette: Palette;
  frame: number;
  fps: number;
  visual?: SceneVisualConfig;
};

const Panel: React.FC<{
  children: React.ReactNode;
  palette: Palette;
  style: React.CSSProperties;
}> = ({ children, palette, style }) => (
  <div
    style={{
      position: "absolute",
      borderRadius: 16,
      border: `1px solid ${paletteHexWithAlpha(palette.border, 0.6)}`,
      background: `linear-gradient(158deg, ${paletteHexWithAlpha(
        palette.surface,
        0.82,
      )}, ${paletteHexWithAlpha(palette.background, 0.72)})`,
      boxShadow: `0 30px 90px rgba(0,0,0,0.22), inset 0 1px 0 ${paletteHexWithAlpha(
        palette.textPrimary,
        0.06,
      )}`,
      backdropFilter: "blur(2px)",
      ...style,
    }}
  >
    {children}
  </div>
);

const SmallLabel: React.FC<{
  children: React.ReactNode;
  palette: Palette;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, palette, color, style }) => (
  <div
    style={{
      fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
      fontSize: 13,
      lineHeight: 1.25,
      fontWeight: 600,
      letterSpacing: "0.17em",
      textTransform: "uppercase",
      color: color ?? palette.textSecondary,
      ...style,
    }}
  >
    {children}
  </div>
);

const Check: React.FC<{ palette: Palette; progress: number }> = ({ palette, progress }) => (
  <svg width={24} height={24} viewBox="0 0 24 24" style={{ opacity: progress }}>
    <circle
      cx={12}
      cy={12}
      r={10}
      fill={paletteHexWithAlpha(palette.accent, 0.16)}
      stroke={palette.accent}
      strokeWidth={1.2}
    />
    <path
      d="M 7 12.5 L 10.4 15.8 L 17 8.8"
      fill="none"
      stroke={palette.accent}
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={18}
      strokeDashoffset={18 * (1 - progress)}
    />
  </svg>
);

export const AgentGrid: React.FC<BaseProps> = ({ palette, frame, fps, visual }) => {
  const labels = visual?.labels ?? ["Support", "Code", "Invoices", "Updates"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 598,
          top: 796,
          width: 388,
          display: "flex",
          flexDirection: "column",
          gap: 17,
        }}
      >
        {labels.slice(0, 4).map((label, index) => {
          const baseDelay = visual?.revealSeconds?.[index] !== undefined
            ? visual.revealSeconds[index] * fps
            : 7 + index * 9;
          const enter = spring({
            frame: Math.max(0, frame - baseDelay),
            fps,
            config: SPRINGS.soft,
          });
          const check = spring({
            frame: Math.max(0, frame - baseDelay - 17),
            fps,
            config: SPRINGS.settle,
          });
          const bar = interpolate(
            frame,
            [baseDelay + 7, baseDelay + 29],
            [0, 0.42 + seeded(index, 3) * 0.5],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );
          return (
            <div
              key={label}
              style={{
                height: 121,
                padding: "19px 20px",
                borderRadius: 14,
                border: `1px solid ${paletteHexWithAlpha(palette.border, 0.68)}`,
                background: `linear-gradient(150deg, ${paletteHexWithAlpha(
                  palette.surface,
                  0.9,
                )}, ${paletteHexWithAlpha(palette.background, 0.72)})`,
                boxShadow: `0 16px 50px rgba(0,0,0,0.2), inset 0 1px 0 ${paletteHexWithAlpha(
                  palette.textPrimary,
                  0.05,
                )}`,
                opacity: enter,
                transform: `translateX(${interpolate(enter, [0, 1], [36, 0])}px) translateY(${
                  interpolate(enter, [0, 1], [10, 0])
                }px)`,
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 29,
                      height: 29,
                      borderRadius: 9,
                      border: `1px solid ${paletteHexWithAlpha(palette.accent, 0.55)}`,
                      background: paletteHexWithAlpha(palette.accent, 0.1),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: palette.accent,
                        boxShadow: `0 0 12px ${paletteHexWithAlpha(palette.accent, 0.7)}`,
                        opacity: 0.72 + Math.sin(frame / 14 + index) * 0.18,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                      color: palette.textPrimary,
                      fontSize: 23,
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {label}
                  </div>
                </div>
                <Check palette={palette} progress={check} />
              </div>

              <div
                style={{
                  height: 3,
                  width: "100%",
                  borderRadius: 2,
                  backgroundColor: paletteHexWithAlpha(palette.border, 0.74),
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${bar * 100}%`,
                    height: "100%",
                    borderRadius: 2,
                    background: `linear-gradient(90deg, ${paletteHexWithAlpha(
                      palette.accent,
                      0.4,
                    )}, ${palette.accent})`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <path
          d="M 556 1260 C 585 1260 585 858 616 858"
          fill="none"
          stroke={paletteHexWithAlpha(palette.accent, 0.4)}
          strokeWidth={1.3}
          strokeDasharray="3 8"
        />
        <path
          d="M 556 1260 C 585 1260 585 1138 616 1138"
          fill="none"
          stroke={paletteHexWithAlpha(palette.accent, 0.3)}
          strokeWidth={1.2}
          strokeDasharray="3 8"
        />
        <circle cx={556} cy={1260} r={4} fill={palette.accent} opacity={0.72} />
        <circle
          cx={556}
          cy={1260}
          r={10 + Math.sin(frame / 8) * 2}
          fill="none"
          stroke={palette.accent}
          strokeWidth={1}
          opacity={0.2}
        />
      </svg>
    </AbsoluteFill>
  );
};

const buildLine = (width: number, height: number, points: Array<[number, number]>) =>
  points
    .map(([x, y], index) => `${index === 0 ? "M" : "L"} ${x * width} ${y * height}`)
    .join(" ");

export const ChartPanel: React.FC<BaseProps> = ({ palette, frame, fps, visual }) => {
  const start = visual?.metricStart ?? 1;
  const end = visual?.metricEnd ?? 50;
  const chartProgress = spring({
    frame: Math.max(0, frame - 8),
    fps,
    config: SPRINGS.soft,
  });
  const width = 650;
  const height = 430;
  const points = Array.from({ length: 22 }, (_, index) => {
    const t = index / 21;
    return [0.05 + t * 0.88, 0.92 - Math.pow(t, 0.63) * 0.73] as [number, number];
  });
  const path = buildLine(width, height, points);
  const area = `${path} L ${0.93 * width} ${0.95 * height} L ${0.05 * width} ${0.95 * height} Z`;
  const endpoint = points[points.length - 1];
  const dashLength = 1250;

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 92,
          top: 690,
          display: "flex",
          alignItems: "flex-end",
          gap: 18,
          opacity: interpolate(frame, [4, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <NumericCounter
          from={start}
          to={end}
          sceneFrame={frame}
          startFrame={8}
          fps={fps}
          palette={palette}
          suffix={visual?.metricSuffix ?? "×"}
          fontSize={112}
        />
        <div style={{ paddingBottom: 16 }}>
          <SmallLabel palette={palette} color={palette.textSecondary}>
            person
          </SmallLabel>
          <SmallLabel palette={palette} color={palette.accent} style={{ marginTop: 6 }}>
            output
          </SmallLabel>
        </div>
      </div>

      <Panel
        palette={palette}
        style={{
          left: 70,
          top: 892,
          width: 706,
          height: 492,
          padding: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <SmallLabel palette={palette}>{visual?.title ?? "LEVERAGE"}</SmallLabel>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  backgroundColor: dot === 0 ? palette.accent : palette.border,
                  opacity: dot === 0 ? 0.9 : 0.55,
                }}
              />
            ))}
          </div>
        </div>

        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ marginTop: 18 }}>
          <defs>
            <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={palette.accent} stopOpacity={0.3} />
              <stop offset="100%" stopColor={palette.accent} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="chart-stroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={palette.accentSecondary} />
              <stop offset="100%" stopColor={palette.accent} />
            </linearGradient>
          </defs>

          {[0.2, 0.4, 0.6, 0.8].map((line) => (
            <line
              key={line}
              x1={0.04 * width}
              x2={0.96 * width}
              y1={line * height}
              y2={line * height}
              stroke={paletteHexWithAlpha(palette.border, 0.46)}
              strokeWidth={1}
              strokeDasharray="2 9"
            />
          ))}
          <path d={area} fill="url(#chart-area)" opacity={chartProgress} />
          <path
            d={path}
            fill="none"
            stroke="url(#chart-stroke)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeDasharray={dashLength}
            strokeDashoffset={dashLength * (1 - chartProgress)}
            style={{ filter: `drop-shadow(0 0 8px ${paletteHexWithAlpha(palette.accent, 0.4)})` }}
          />
          <circle
            cx={endpoint[0] * width}
            cy={endpoint[1] * height}
            r={7}
            fill={palette.accent}
            opacity={chartProgress}
          />
          <circle
            cx={endpoint[0] * width}
            cy={endpoint[1] * height}
            r={16 + Math.sin(frame / 9) * 2}
            fill="none"
            stroke={palette.accent}
            strokeWidth={1.2}
            opacity={chartProgress * 0.32}
          />
        </svg>
      </Panel>
    </AbsoluteFill>
  );
};

export const ThresholdPanel: React.FC<BaseProps> = ({ palette, frame, fps, visual }) => {
  const progress = spring({
    frame: Math.max(0, frame - 9),
    fps,
    config: SPRINGS.soft,
  });
  const width = 402;
  const height = 480;
  const rising = buildLine(width, height, [
    [0.07, 0.88],
    [0.35, 0.7],
    [0.6, 0.57],
    [0.78, 0.25],
    [0.93, 0.12],
  ]);
  const falling = buildLine(width, height, [
    [0.07, 0.26],
    [0.3, 0.38],
    [0.55, 0.48],
    [0.75, 0.72],
    [0.93, 0.85],
  ]);
  const labels = visual?.labels ?? ["coordination", "judgment"];

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Panel
        palette={palette}
        style={{
          left: 545,
          top: 770,
          width: 466,
          height: 622,
          padding: 22,
        }}
      >
        <SmallLabel palette={palette}>{visual?.title ?? "WHAT GETS SCARCE"}</SmallLabel>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ marginTop: 24, overflow: "hidden" }}>
          <defs>
            <filter id="soft-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[0.15, 0.32, 0.49, 0.66, 0.83].map((line) => (
            <line
              key={line}
              x1={0.04 * width}
              x2={0.96 * width}
              y1={line * height}
              y2={line * height}
              stroke={paletteHexWithAlpha(palette.border, 0.38)}
              strokeWidth={1}
              strokeDasharray="2 10"
            />
          ))}

          <path
            d={falling}
            fill="none"
            stroke={palette.accentSecondary}
            strokeWidth={3}
            strokeLinecap="round"
            strokeDasharray={700}
            strokeDashoffset={700 * (1 - progress)}
            opacity={0.85}
          />
          <path
            d={rising}
            fill="none"
            stroke={palette.accent}
            strokeWidth={3.4}
            strokeLinecap="round"
            strokeDasharray={700}
            strokeDashoffset={700 * (1 - progress)}
            filter="url(#soft-glow)"
          />
          <circle cx={0.93 * width} cy={0.12 * height} r={6} fill={palette.accent} opacity={progress} />
          <circle
            cx={0.93 * width}
            cy={0.85 * height}
            r={9 + Math.sin(frame / 11) * 1.6}
            fill="none"
            stroke={palette.accentSecondary}
            strokeWidth={1.3}
            opacity={progress * 0.55}
          />
        </svg>

        <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 2, backgroundColor: palette.accent }} />
            <span
              style={{
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 13,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: palette.textPrimary,
              }}
            >
              {labels[1] ?? "judgment"}
            </span>
            <span style={{ marginLeft: "auto", color: palette.accent, fontSize: 13 }}>SCARCE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 28, height: 2, backgroundColor: palette.accentSecondary }} />
            <span
              style={{
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 13,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: palette.textSecondary,
              }}
            >
              {labels[0] ?? "coordination"}
            </span>
            <span style={{ marginLeft: "auto", color: palette.textSecondary, fontSize: 13 }}>CHEAP</span>
          </div>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};

export const CatchEnvironment: React.FC<BaseProps> = ({ palette, frame, fps }) => {
  const settle = spring({ frame, fps, config: SPRINGS.soft });
  const width = 1080;
  const height = 1020;
  const center = { x: 540, y: 30 };
  const makeBranch = (side: -1 | 1, color: string) => {
    const nodes = Array.from({ length: 18 }, (_, index) => {
      const t = (index + 1) / 18;
      const x = center.x + side * (40 + t * 380 + Math.sin(index * 1.8) * 30);
      const y = center.y + 88 + t * (360 + seeded(index, side) * 270);
      const radius = 2.2 + seeded(index, side + 4) * 5.4;
      return { x, y, radius, opacity: 0.18 + seeded(index, 8) * 0.56 };
    });
    const path =
      `M ${center.x} ${center.y} ` +
      nodes
        .map((node, index) => {
          const previous = index === 0 ? center : nodes[index - 1];
          return `Q ${previous.x} ${previous.y} ${node.x} ${node.y}`;
        })
        .join(" ");
    return { nodes, path, color };
  };
  const good = makeBranch(1, palette.accent);
  const bad = makeBranch(-1, palette.warning);

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 500,
          width: 1080,
          height: 1020,
          background: `radial-gradient(ellipse at 50% 28%, ${paletteHexWithAlpha(
            palette.warning,
            0.12,
          )}, transparent 52%)`,
        }}
      />
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", left: 0, top: 540 }}>
        <defs>
          <filter id="catch-glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx={center.x}
          cy={center.y}
          r={18 + Math.sin(frame / 9) * 2.4}
          fill={paletteHexWithAlpha(palette.textPrimary, 0.05)}
          stroke={palette.textPrimary}
          strokeWidth={1.2}
          opacity={0.55}
        />
        <circle cx={center.x} cy={center.y} r={4} fill={palette.textPrimary} opacity={0.9} />

        {[good, bad].map((branch, branchIndex) => (
          <g key={branchIndex}>
            <path
              d={branch.path}
              fill="none"
              stroke={branch.color}
              strokeWidth={2.1}
              opacity={0.2 + settle * 0.44}
              strokeDasharray="4 10"
              filter="url(#catch-glow)"
            />
            {branch.nodes.map((node, index) => {
              const pulse = 0.72 + Math.sin(frame / 12 + index * 0.7) * 0.2;
              return (
                <g key={index}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.radius * (0.7 + settle * 0.3)}
                    fill={branch.color}
                    opacity={node.opacity * settle * pulse}
                  />
                  {index % 3 === 0 ? (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius + 6 + Math.sin(frame / 15 + index) * 2}
                      fill="none"
                      stroke={branch.color}
                      strokeWidth={0.8}
                      opacity={0.16 * settle}
                    />
                  ) : null}
                </g>
              );
            })}
          </g>
        ))}

        <text
          x={center.x + 140}
          y={center.y + 72}
          fill={palette.accent}
          fontFamily="var(--sd-font, Manrope, sans-serif)"
          fontSize={12}
          letterSpacing={3.6}
          opacity={0.72}
        >
          GOOD CALL
        </text>
        <text
          x={center.x - 262}
          y={center.y + 72}
          fill={palette.warning}
          fontFamily="var(--sd-font, Manrope, sans-serif)"
          fontSize={12}
          letterSpacing={3.6}
          opacity={0.72}
        >
          BAD CALL
        </text>
      </svg>
    </AbsoluteFill>
  );
};
