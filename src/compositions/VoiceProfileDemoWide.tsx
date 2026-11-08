import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import episodeJson from "../../content/episode-voice-profile-demo.json";
import { AudioTimeline } from "../components/audio/AudioTimeline";
import { VoiceoverCaptions } from "../components/captions/VoiceoverCaptions";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { parseEpisode, type Scene } from "../config/episode.schema";
import { getPalette, paletteHexWithAlpha } from "../config/theme";
import { useLocalFonts } from "../hooks/useLocalFonts";

const episode = parseEpisode(episodeJson);
const palette = getPalette(episode.themeId);

const HIGHLIGHT = "#F0B36B";

const splitAccentWords = (text: string, accentWords?: string[]) => {
  const accents = new Set((accentWords ?? []).map((word) => word.toUpperCase()));
  return text.split(/\s+/).map((word, index) => {
    const clean = word.replace(/[^A-Za-z0-9$%.-]/g, "").toUpperCase();
    return {
      word,
      accent: accents.has(clean) || accents.has(clean.replace(/[^A-Z0-9]/g, "")),
      key: `${word}-${index}`,
    };
  });
};

const SceneCard: React.FC<{ scene: Scene; index: number; total: number }> = ({
  scene,
  index,
  total,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headline = scene.headlines[0];
  const second = scene.headlines[1];
  if (!headline) return null;
  const enter = interpolate(frame, [0, Math.round(fps * 0.55)], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rise = interpolate(frame, [0, Math.round(fps * 0.7)], [22, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const isConclusion = scene.id === "conclusion";
  const isRevelation = scene.id === "revelation";
  const words = splitAccentWords(headline.text, headline.accentWords);
  const size = headline.size === "hero" ? 86 : headline.size === "display" ? 72 : 58;

  return (
    <>
      <AbsoluteFill
        style={{
          background: `linear-gradient(90deg, ${paletteHexWithAlpha(
            palette.background,
            0.93,
          )} 0%, ${paletteHexWithAlpha(palette.background, 0.72)} 42%, ${paletteHexWithAlpha(
            palette.background,
            0.18,
          )} 74%, transparent 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: isConclusion ? 0 : 118,
          right: isConclusion ? 0 : 118,
          top: isConclusion ? 300 : 196,
          display: "flex",
          justifyContent: isConclusion ? "center" : "flex-start",
          opacity: enter,
          transform: `translateY(${rise}px)`,
        }}
      >
        <div style={{ width: isConclusion ? 1320 : 1120, textAlign: isConclusion ? "center" : "left" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isConclusion ? "center" : "flex-start",
              gap: 18,
              marginBottom: 26,
            }}
          >
            <div style={{ width: 46, height: 2, background: palette.accent }} />
            <div
              style={{
                fontFamily: '"Poppins", sans-serif',
                fontSize: 17,
                fontWeight: 600,
                letterSpacing: "0.28em",
                color: palette.accent,
                textTransform: "uppercase",
              }}
            >
              {headline.kicker || "PAYSTACK"}
            </div>
          </div>
          <div
            style={{
              fontFamily: '"Poppins", sans-serif',
              fontSize: size,
              lineHeight: 1.03,
              fontWeight: 600,
              letterSpacing: "-0.045em",
              color: palette.textPrimary,
              textTransform: "uppercase",
            }}
          >
            {words.map(({ word, accent, key }) => (
              <span key={key} style={{ color: accent ? HIGHLIGHT : undefined }}>
                {word}{" "}
              </span>
            ))}
          </div>
          {isRevelation && second ? (
            <div
              style={{
                marginTop: 54,
                display: "flex",
                alignItems: "flex-end",
                gap: 20,
                opacity: interpolate(frame, [Math.round(fps * 1.8), Math.round(fps * 2.8)], [0, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              <div
                style={{
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: 132,
                  lineHeight: 0.88,
                  fontWeight: 600,
                  letterSpacing: "-0.06em",
                  color: HIGHLIGHT,
                }}
              >
                $200M
              </div>
              <div
                style={{
                  paddingBottom: 10,
                  fontFamily: '"Poppins", sans-serif',
                  fontSize: 17,
                  letterSpacing: "0.18em",
                  color: palette.textSecondary,
                  textTransform: "uppercase",
                }}
              >
                Stripe acquires Paystack
                <br />
                2020
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 92,
          top: 84,
          fontFamily: '"SF Mono", ui-monospace, monospace',
          fontSize: 16,
          letterSpacing: "0.2em",
          color: paletteHexWithAlpha(palette.textSecondary, 0.72),
        }}
      >
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
      <div
        style={{
          position: "absolute",
          left: 118,
          right: 118,
          bottom: 34,
          height: 1,
          background: paletteHexWithAlpha(palette.textPrimary, 0.14),
        }}
      >
        <div
          style={{
            height: 1,
            width: `${((index + 1) / total) * 100}%`,
            background: palette.accent,
          }}
        />
      </div>
    </>
  );
};

export const VoiceProfileDemoWide: React.FC = () => {
  useLocalFonts();
  const { fps, durationInFrames } = useVideoConfig();
  const frame = useCurrentFrame();
  const progress = durationInFrames <= 1 ? 0 : frame / durationInFrames;

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, overflow: "hidden" }}>
      <Img
        src={staticFile("images/city-fog.jpg")}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "50% 42%",
          filter: "brightness(0.5) contrast(1.06) saturate(0.86)",
          transform: `scale(${1.1 + progress * 0.05}) translateY(${progress * -12}px)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 78% 22%, ${paletteHexWithAlpha(
            palette.accent,
            0.16,
          )}, transparent 42%), linear-gradient(180deg, rgba(6,6,5,0.5) 0%, transparent 28%, rgba(6,6,5,0.72) 100%)`,
        }}
      />

      {episode.scenes.map((scene, index) => {
        const from = Math.round(scene.startSeconds * fps);
        const duration = Math.max(1, Math.round(scene.durationSeconds * fps));
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration} name={scene.id}>
            <SceneCard scene={scene} index={index} total={episode.scenes.length} />
          </Sequence>
        );
      })}

      <AudioTimeline episode={episode} />
      <VoiceoverCaptions cues={episode.narration.subtitles} bottom={44} maxWidth={1320} />

      <SimpledeavSignOff
        startSeconds={episode.brand.startSeconds}
        palette={palette}
      />

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.05)}`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 260px 60px rgba(0,0,0,0.55)",
        }}
      />
    </AbsoluteFill>
  );
};
