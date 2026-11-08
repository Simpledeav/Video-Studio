import { AbsoluteFill, interpolate } from "remotion";
import type { Palette } from "../../../config/theme";
import { paletteHexWithAlpha } from "../../../config/theme";
import { seeded, seededRange } from "../../../utils/deterministic";

type CityEnvironmentProps = {
  palette: Palette;
  frame: number;
  variant: "night" | "dawn";
};

const BUILDING_COUNT = 16;

export const CityEnvironment: React.FC<CityEnvironmentProps> = ({ palette, frame, variant }) => {
  const glow = variant === "dawn" ? palette.accentSecondary : palette.accent;

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: variant === "dawn" ? "48%" : "58%",
          width: 940,
          height: 940,
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${paletteHexWithAlpha(glow, variant === "dawn" ? 0.34 : 0.18)}, transparent 64%)`,
          filter: "blur(18px)",
        }}
      />

      <svg
        width={1080}
        height={1920}
        viewBox="0 0 1080 1920"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <linearGradient id="city-haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.background} stopOpacity={0} />
            <stop offset="72%" stopColor={palette.background} stopOpacity={0.36} />
            <stop offset="100%" stopColor={palette.background} stopOpacity={0.96} />
          </linearGradient>
          <linearGradient id="building-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={palette.backgroundSecondary} stopOpacity={0.92} />
            <stop offset="100%" stopColor={palette.background} stopOpacity={1} />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={1080} height={1920} fill="url(#city-haze)" />

        {Array.from({ length: BUILDING_COUNT }, (_, index) => {
          const width = seededRange(index, 46, 108, 3);
          const x = index * (1080 / BUILDING_COUNT) - 22 + seededRange(index, -10, 10, 7);
          const height = seededRange(index, 92, 272, 2);
          const y = 1920 - height - 34 + seededRange(index, -12, 16, 8);
          const windowRows = Math.max(2, Math.round(height / 29));
          const windowCols = Math.max(2, Math.round(width / 22));
          return (
            <g key={index}>
              <rect
                x={x}
                y={y}
                width={width}
                height={height + 50}
                rx={3}
                fill="url(#building-fill)"
                opacity={0.92}
              />
              {Array.from({ length: windowRows }, (_, row) =>
                Array.from({ length: windowCols }, (_, column) => {
                  const lit = seeded(index * 100 + row * 10 + column, 5) > 0.63;
                  if (!lit) return null;
                  const flicker =
                    variant === "night"
                      ? 0.44 + 0.34 * seeded(index * 100 + row * 7 + column, 9)
                      : 0.22 + 0.18 * seeded(index * 100 + row * 7 + column, 9);
                  return (
                    <rect
                      key={`${row}-${column}`}
                      x={x + 10 + column * 18}
                      y={y + 14 + row * 25}
                      width={3.8}
                      height={7.2}
                      rx={0.8}
                      fill={column % 5 === 0 ? glow : palette.textPrimary}
                      opacity={flicker}
                    />
                  );
                }),
              )}
            </g>
          );
        })}

        <rect x={0} y={1870} width={1080} height={50} fill={palette.background} />
      </svg>

      {Array.from({ length: 18 }, (_, index) => {
        const x = seededRange(index, 40, 1040, 11);
        const y = seededRange(index, 260, 1300, 13);
        const size = seededRange(index, 1.4, 3.2, 17);
        const speed = seededRange(index, 0.15, 0.38, 19);
        const drift = Math.sin(frame / 30 / 5 + index) * 12;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: x + drift,
              top: y - ((frame * speed) % 190),
              width: size,
              height: size,
              borderRadius: "50%",
              backgroundColor: index % 4 === 0 ? glow : palette.textPrimary,
              opacity: interpolate(index % 5, [0, 4], [0.08, 0.28]),
              boxShadow: `0 0 8px ${paletteHexWithAlpha(glow, 0.4)}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
