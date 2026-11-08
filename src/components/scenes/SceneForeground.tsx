import { AbsoluteFill } from "remotion";
import type { Scene } from "../../config/episode.schema";
import { paletteHexWithAlpha, type Palette } from "../../config/theme";

type SceneForegroundProps = {
  scene: Scene;
  palette: Palette;
  frame: number;
};

/**
 * Foreground furniture for the founder console. It is drawn after the rig so
 * the seated lower body disappears behind the desk while the hands stay above
 * the desk plane. The integrated signature lands on this surface in the close.
 */
export const SceneForeground: React.FC<SceneForegroundProps> = ({ scene, palette, frame }) => {
  if (scene.layout !== "console") return null;

  const reflection = 0.32 + Math.sin(frame / 42) * 0.04;
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          left: 176,
          top: 1392,
          width: 864,
          height: 528,
          borderRadius: "10px 10px 0 0",
          background: `
            linear-gradient(180deg, ${paletteHexWithAlpha(palette.surface, 0.94)} 0%, ${paletteHexWithAlpha(
              palette.background,
              0.98,
            )} 23%, ${paletteHexWithAlpha(palette.background, 0.99)} 100%)
          `,
          borderTop: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.16)}`,
          boxShadow: `0 -18px 55px rgba(0,0,0,0.34), inset 0 2px 0 ${paletteHexWithAlpha(
            palette.accent,
            0.09,
          )}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${paletteHexWithAlpha(
              palette.accent,
              0.34,
            )}, transparent)`,
            opacity: 0.8,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 70,
            top: 46,
            width: 480,
            height: 1,
            background: `linear-gradient(90deg, ${paletteHexWithAlpha(palette.textPrimary, 0.12)}, transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 94,
            top: 22,
            width: 240,
            height: 160,
            background: `radial-gradient(ellipse at 40% 30%, ${paletteHexWithAlpha(
              palette.accent,
              reflection * 0.1,
            )}, transparent 68%)`,
            filter: "blur(16px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 170,
            background: `linear-gradient(0deg, rgba(0,0,0,0.32), transparent)`,
            opacity: 0.7,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 232,
            top: 0,
            width: 530,
            height: 390,
            background: `radial-gradient(ellipse at 45% 4%, ${paletteHexWithAlpha(
              palette.accent,
              0.13,
            )}, transparent 62%)`,
            filter: "blur(15px)",
            opacity: 0.7,
          }}
        />
        {[486, 586, 690].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              left: 26,
              right: 26,
              top,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${paletteHexWithAlpha(
                palette.textPrimary,
                0.055,
              )}, transparent)`,
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 92,
            top: 174,
            width: 1,
            height: 78,
            background: `linear-gradient(180deg, ${paletteHexWithAlpha(palette.accent, 0.18)}, transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 300,
            width: 1,
            height: 110,
            background: paletteHexWithAlpha(palette.textPrimary, 0.1),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 34,
            top: 328,
            width: 72,
            height: 1,
            background: paletteHexWithAlpha(palette.textPrimary, 0.08),
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 160,
          top: 1300,
          width: 132,
          height: 88,
          borderRadius: "4px 4px 7px 7px",
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.74)}`,
          background: `linear-gradient(155deg, ${paletteHexWithAlpha(palette.surface, 0.92)}, ${paletteHexWithAlpha(
            palette.background,
            0.98,
          )})`,
          transform: "rotate(-2.4deg)",
          boxShadow: "0 16px 28px rgba(0,0,0,0.32), inset 0 1px 0 rgba(255,255,255,0.06)",
          opacity: 0.9,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 13,
            right: 13,
            top: 17,
            height: 1,
            background: paletteHexWithAlpha(palette.textPrimary, 0.14),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 13,
            right: 34,
            top: 31,
            height: 1,
            background: paletteHexWithAlpha(palette.textPrimary, 0.08),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 13,
            right: 50,
            top: 45,
            height: 1,
            background: paletteHexWithAlpha(palette.textPrimary, 0.06),
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 302,
          top: 1356,
          width: 74,
          height: 3,
          borderRadius: 3,
          background: paletteHexWithAlpha(palette.accent, 0.42),
          transform: "rotate(-8deg)",
          opacity: 0.8,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 982,
          top: 1328,
          width: 54,
          height: 64,
          borderRadius: "6px 6px 10px 10px",
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.72)}`,
          background: `linear-gradient(165deg, ${paletteHexWithAlpha(palette.surface, 0.95)}, ${paletteHexWithAlpha(
            palette.background,
            0.98,
          )})`,
          boxShadow: "0 12px 24px rgba(0,0,0,0.36), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 9,
            top: 10,
            right: 9,
            height: 6,
            borderRadius: 4,
            background: paletteHexWithAlpha(palette.accent, 0.2),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 20,
            top: -32,
            width: 12,
            height: 32,
            borderRadius: "50%",
            borderLeft: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.16)}`,
            opacity: 0.45,
            filter: "blur(1px)",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
