import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { SubtitleCue } from "../../config/episode.schema";
import type { Palette } from "../../config/theme";

type SubtitleTrackProps = {
  cues: SubtitleCue[];
  palette: Palette;
};

const MAX_CHARACTERS_PER_LINE = 47;

const splitCue = (text: string): string[] => {
  if (text.length <= MAX_CHARACTERS_PER_LINE) return [text];
  const words = text.split(/\s+/);
  let bestIndex = 1;
  let bestDifference = Number.POSITIVE_INFINITY;
  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const difference = Math.abs(first.length - second.length);
    if (difference < bestDifference && first.length <= MAX_CHARACTERS_PER_LINE + 8) {
      bestDifference = difference;
      bestIndex = index;
    }
  }
  return [words.slice(0, bestIndex).join(" "), words.slice(bestIndex).join(" ")];
};

export const SubtitleTrack: React.FC<SubtitleTrackProps> = ({ cues, palette }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const active = cues.find((cue) => time >= cue.start && time < cue.end);

  if (!active) return null;

  const lines = splitCue(active.text);
  const cueFrame = (time - active.start) * fps;
  const opacity = interpolate(cueFrame, [0, 4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 78,
        right: 78,
        bottom: 132,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        opacity,
      }}
    >
      <div
        style={{
          maxWidth: 924,
          padding: "12px 24px 13px",
          borderRadius: 10,
          background: palette.captionBackground,
          color: palette.captionText,
          fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
          fontSize: 38,
          lineHeight: 1.26,
          fontWeight: 500,
          letterSpacing: "-0.012em",
          textAlign: "center",
          textShadow: palette.captionShadow,
          boxShadow: palette.isDark ? "0 10px 40px rgba(0,0,0,0.16)" : "0 8px 30px rgba(40,30,20,0.1)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
    </div>
  );
};
