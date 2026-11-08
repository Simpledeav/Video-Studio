import {
  AbsoluteFill,
  Img,
  Sequence,
  staticFile,
} from "remotion";
import type { Episode } from "../config/episode.schema";
import { getPalette, paletteHexWithAlpha } from "../config/theme";
import { AudioTimeline } from "../components/audio/AudioTimeline";
import { SceneRenderer } from "../components/scenes/SceneRenderer";
import { SubtitleTrack } from "../components/typography/SubtitleTrack";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { getEpisodeFontVars } from "../utils/fontVars";

export type StickmanStoryProps = {
  episode: Episode;
};

export const StickmanStory: React.FC<StickmanStoryProps> = ({ episode }) => {
  const ready = useLocalFonts();
  const palette = getPalette(episode.themeId);
  const fontVars = getEpisodeFontVars(episode.fontFamily);

  if (!ready) {
    return <AbsoluteFill style={{ backgroundColor: palette.background }} />;
  }

  return (
    <AbsoluteFill
      className="simpledeav-root"
      style={{
        backgroundColor: palette.background,
        ...fontVars,
      }}
    >
      {episode.scenes.map((scene) => {
        const from = Math.round(scene.startSeconds * episode.fps);
        const duration = Math.max(1, Math.round(scene.durationSeconds * episode.fps));
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration} name={scene.layout}>
            <SceneRenderer scene={scene} episode={episode} />
          </Sequence>
        );
      })}

      <AudioTimeline episode={episode} />
      <SubtitleTrack cues={episode.narration.subtitles} palette={palette} />

      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.045 }}>
        <Img
          src={staticFile("images/grain.png")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            imageRendering: "pixelated",
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.035)}`,
        }}
      />

    </AbsoluteFill>
  );
};
