import { useState } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { Video } from "@remotion/media";
import type { BackgroundConfig } from "../../config/episode.schema";
import { paletteHexWithAlpha, type Palette } from "../../config/theme";
import { normalizePublicAssetPath } from "../../utils/assetValidation";

type SceneBackgroundProps = {
  background: BackgroundConfig;
  frame: number;
  durationInFrames: number;
  palette: Palette;
};

const gradeFilter = (grade: BackgroundConfig["grade"]) => {
  switch (grade) {
    case "night":
      return "brightness(0.48) contrast(1.18) saturate(0.72)";
    case "dawn":
      return "brightness(0.7) contrast(1.06) saturate(0.94) sepia(0.12)";
    case "noir":
      return "grayscale(1) brightness(0.52) contrast(1.22)";
    case "warm":
      return "brightness(0.72) contrast(1.06) saturate(1.02) sepia(0.18)";
    default:
      return "brightness(0.8) contrast(1.04) saturate(0.92)";
  }
};

export const SceneBackground: React.FC<SceneBackgroundProps> = ({
  background,
  frame,
  durationInFrames,
  palette,
}) => {
  const [imageFailed, setImageFailed] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const progress = durationInFrames <= 1 ? 0 : frame / durationInFrames;
  const parallax = background.parallax ?? 0.04;
  const drift = (progress - 0.5) * parallax * 58;

  const showImage = Boolean(background.imagePath) && !imageFailed;
  const showVideo = Boolean(background.videoPath) && !videoFailed;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: palette.background,
        backgroundImage: `
          radial-gradient(ellipse at 78% 8%, ${paletteHexWithAlpha(palette.accent, 0.14)}, transparent 45%),
          radial-gradient(ellipse at 12% 95%, ${paletteHexWithAlpha(
            palette.accentSecondary,
            0.1,
          )}, transparent 48%),
          linear-gradient(168deg, ${palette.backgroundSecondary} 0%, ${palette.background} 58%, ${palette.background} 100%)
        `,
        overflow: "hidden",
      }}
    >
      {showVideo ? (
        <Video
          src={staticFile(normalizePublicAssetPath(background.videoPath!).replace(/^\//, ""))}
          muted
          loop
          objectFit="cover"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectPosition: background.videoObjectPosition ?? "center",
            filter: gradeFilter(background.grade),
            transform: `scale(1.08) translateX(${drift}px)`,
            opacity: background.imageOpacity ?? 0.55,
          }}
          onError={() => {
            setVideoFailed(true);
            return "fallback";
          }}
        />
      ) : null}

      {showImage ? (
        <Img
          src={staticFile(normalizePublicAssetPath(background.imagePath!).replace(/^\//, ""))}
          onError={() => setImageFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: background.imageObjectPosition ?? "50% 46%",
            filter: gradeFilter(background.grade),
            opacity: background.imageOpacity ?? 0.42,
            transform: `scale(1.09) translateX(${drift}px)`,
          }}
        />
      ) : null}

      <AbsoluteFill
        style={{
          background: `
            linear-gradient(180deg, ${paletteHexWithAlpha(palette.background, 0.78)} 0%, ${paletteHexWithAlpha(
              palette.background,
              0.22,
            )} 28%, ${paletteHexWithAlpha(palette.background, 0.06)} 52%, ${paletteHexWithAlpha(
              palette.background,
              0.86,
            )} 100%)
          `,
        }}
      />

      <AbsoluteFill
        style={{
          background:
            background.grade === "dawn"
              ? `radial-gradient(ellipse at 50% 78%, ${paletteHexWithAlpha(
                  palette.accentSecondary,
                  0.24,
                )}, transparent 44%)`
              : `radial-gradient(ellipse at 50% 52%, transparent 44%, ${paletteHexWithAlpha(
                  palette.background,
                  0.32,
                )} 100%)`,
          mixBlendMode: "screen",
          opacity: 0.72,
        }}
      />
    </AbsoluteFill>
  );
};
