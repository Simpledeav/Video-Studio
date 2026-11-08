import { AbsoluteFill, interpolate } from "remotion";
import type { TransitionType } from "../../config/episode.schema";
import { paletteHexWithAlpha, type Palette } from "../../config/theme";

type SceneTransitionProps = {
  type: TransitionType;
  frame: number;
  palette: Palette;
};

export const SceneTransition: React.FC<SceneTransitionProps> = ({ type, frame, palette }) => {
  if (type === "cut") return null;

  const fade = interpolate(frame, [0, 12], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (type === "fade") {
    return (
      <AbsoluteFill
        style={{
          backgroundColor: palette.background,
          opacity: fade,
          pointerEvents: "none",
        }}
      />
    );
  }

  if (type === "bloom") {
    return (
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 48%, ${paletteHexWithAlpha(
            palette.glow,
            0.9,
          )}, transparent 52%)`,
          opacity: interpolate(frame, [0, 8, 17], [0.82, 0.44, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
    );
  }

  const sweep = interpolate(frame, [0, 15], [-26, 126], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sweep}%`,
          width: "26%",
          background: `linear-gradient(90deg, transparent, ${paletteHexWithAlpha(
            palette.accent,
            0.6,
          )}, transparent)`,
          filter: "blur(16px)",
          opacity: fade,
        }}
      />
      <AbsoluteFill style={{ backgroundColor: palette.background, opacity: fade * 0.38 }} />
    </AbsoluteFill>
  );
};
