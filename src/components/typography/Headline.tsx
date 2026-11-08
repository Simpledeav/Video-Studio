import { interpolate } from "remotion";
import type { CSSProperties } from "react";
import type { HeadlineConfig } from "../../config/episode.schema";
import type { Palette } from "../../config/theme";
import { DURATIONS } from "../../config/motion";
import { AnimatedText } from "./TextAnimation";

type HeadlineProps = {
  headline: HeadlineConfig;
  sceneFrame: number;
  fps: number;
  palette: Palette;
  style?: CSSProperties;
};

const FONT_SIZES = {
  hero: 94,
  display: 79,
  statement: 64,
} as const;

export const Headline: React.FC<HeadlineProps> = ({
  headline,
  sceneFrame,
  fps,
  palette,
  style,
}) => {
  const startFrame = Math.round(headline.startSeconds * fps);
  const endFrame = headline.endSeconds ? Math.round(headline.endSeconds * fps) : null;
  const fadeOut = endFrame
    ? interpolate(sceneFrame, [endFrame - 12, endFrame], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 1;
  const kickerOpacity = interpolate(sceneFrame, [startFrame - 6, startFrame + 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fontSize = FONT_SIZES[headline.size ?? "display"];
  const align = headline.align ?? "left";
  const accentColor =
    headline.accentTone === "warning"
      ? palette.warning
      : headline.accentTone === "positive"
        ? palette.positive
        : palette.accent;

  return (
    <div
      style={{
        opacity: fadeOut,
        width: "100%",
        maxWidth: headline.maxWidth ?? 900,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
        ...style,
      }}
    >
      {headline.kicker ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            opacity: kickerOpacity,
            justifyContent: align === "center" ? "center" : "flex-start",
          }}
        >
          <span
            style={{
              width: 34,
              height: 1.5,
              backgroundColor: palette.accent,
              display: "inline-block",
            }}
          />
          <span
            className="simpledeav-kicker"
            style={{
              color: palette.textSecondary,
              fontSize: 19,
              lineHeight: 1.2,
            }}
          >
            {headline.kicker}
          </span>
        </div>
      ) : null}

      <div
        style={{
          fontSize,
          lineHeight: 0.99,
          fontWeight: 600,
          letterSpacing: "-0.048em",
          color: palette.textPrimary,
          textShadow: palette.isDark
            ? "0 6px 34px rgba(0,0,0,0.34)"
            : "0 1px 20px rgba(255,255,255,0.38)",
        }}
      >
        <AnimatedText
          text={headline.text}
          preset={headline.preset}
          frame={sceneFrame}
          fps={fps}
          startFrame={startFrame}
          accentWords={headline.accentWords}
          accentColor={accentColor}
          align={align}
          style={{ maxWidth: headline.maxWidth ?? 900 }}
        />
      </div>

      {sceneFrame > startFrame ? (
        <div
          style={{
            marginTop: 30,
            width: 58,
            height: 2,
            backgroundColor: accentColor,
            opacity: interpolate(
              sceneFrame,
              [startFrame + DURATIONS.headlineFade, startFrame + DURATIONS.headlineFade + 20],
              [0, 0.72],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            ),
            marginLeft: align === "center" ? "auto" : 0,
            marginRight: align === "center" ? "auto" : 0,
          }}
        />
      ) : null}
    </div>
  );
};
