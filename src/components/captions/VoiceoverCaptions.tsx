import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { VoiceoverCue } from "../../config/voiceProfile";

type VoiceoverCaptionsProps = {
  cues: VoiceoverCue[];
  bottom?: number;
  maxWidth?: number;
  fontSize?: number;
};

const splitLines = (text: string, maxCharacters: number): string[] => {
  if (text.length <= maxCharacters) return [text];
  const words = text.split(/\s+/);
  let best = 1;
  let bestDifference = Number.POSITIVE_INFINITY;
  for (let index = 1; index < words.length; index += 1) {
    const first = words.slice(0, index).join(" ");
    const second = words.slice(index).join(" ");
    const difference = Math.abs(first.length - second.length);
    if (difference < bestDifference && first.length <= maxCharacters + 8) {
      bestDifference = difference;
      best = index;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
};

/**
 * Captions driven by real word timings from the generated audio. This is a
 * cross-aspect variant of `SubtitleTrack`: it adapts to 9:16 and 16:9 without
 * assuming the portrait-safe bottom inset.
 */
export const VoiceoverCaptions: React.FC<VoiceoverCaptionsProps> = ({
  cues,
  bottom,
  maxWidth,
  fontSize,
}) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const wide = width > height;
  const time = frame / fps;
  const active = cues.find((cue) => time >= cue.start && time < cue.end + 0.1);
  if (!active) return null;

  const lines = splitLines(active.text, wide ? 66 : 42);
  const local = (time - active.start) * fps;
  const enter = interpolate(local, [0, 5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const exit = interpolate(
    (active.end - time) * fps,
    [0, 4],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: wide ? 92 : 64,
        right: wide ? 92 : 64,
        bottom: bottom ?? (wide ? 54 : 148),
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 120,
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - enter) * 8}px)`,
      }}
    >
      <div
        style={{
          maxWidth: maxWidth ?? (wide ? 1280 : 940),
          padding: wide ? "11px 24px 12px" : "13px 22px 14px",
          borderRadius: 8,
          background: "rgba(9, 10, 8, 0.78)",
          border: "1px solid rgba(246, 242, 232, 0.1)",
          boxShadow: "0 16px 44px rgba(0,0,0,0.34)",
          backdropFilter: "blur(8px)",
          fontFamily: '"Poppins", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: fontSize ?? (wide ? 33 : 31),
          fontWeight: 500,
          lineHeight: 1.33,
          letterSpacing: "-0.012em",
          textAlign: "center",
          color: "rgba(246, 242, 232, 0.9)",
          textShadow: "0 2px 14px rgba(0,0,0,0.75)",
        }}
      >
        {lines.map((line, index) => (
          <div key={`${line}-${index}`}>{line}</div>
        ))}
      </div>
    </div>
  );
};
