import { AbsoluteFill, Img, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import type { Episode, Scene } from "../config/episode.schema";
import { getPalette, paletteHexWithAlpha } from "../config/theme";
import { AudioTimeline } from "../components/audio/AudioTimeline";
import { CameraMotion } from "../components/camera/CameraMotion";
import { SocialEndCard } from "../components/branding/SocialEndCard";
import { LegoVisuals } from "../components/lego/LegoVisuals";
import { SceneBackground } from "../components/scenes/SceneBackground";
import { SceneTransition } from "../components/transitions/Transitions";
import { Headline } from "../components/typography/Headline";
import { SubtitleTrack } from "../components/typography/SubtitleTrack";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { getEpisodeFontVars } from "../utils/fontVars";

export type LegoCaseStudyProps = {
  episode: Episode;
};

const PLACEMENTS = {
  top: 208,
  middle: 690,
  lower: 1160,
} as const;

const LegoScene: React.FC<{ scene: Scene; episode: Episode }> = ({ scene, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = getPalette(episode.themeId);
  const sceneFrames = Math.max(1, Math.round(scene.durationSeconds * fps));
  const sceneEnd = scene.startSeconds + scene.durationSeconds;
  const signatureStart = Math.round((episode.brand.startSeconds - scene.startSeconds) * fps);
  const isBrandScene =
    episode.brand.enabled &&
    episode.brand.signatureEnabled &&
    episode.brand.startSeconds >= scene.startSeconds &&
    episode.brand.startSeconds < sceneEnd;
  const mode = scene.visual?.documentaryMode ?? "hook";

  return (
    <AbsoluteFill style={{ backgroundColor: palette.background, overflow: "hidden" }}>
      <SceneBackground
        background={scene.background}
        frame={frame}
        durationInFrames={sceneFrames}
        palette={palette}
      />

      <CameraMotion camera={scene.camera} frame={frame} durationInFrames={sceneFrames}>
        <LegoVisuals
          mode={mode}
          palette={palette}
          frame={frame}
          fps={fps}
          visual={scene.visual}
        />
      </CameraMotion>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${paletteHexWithAlpha(palette.background, 0.84)} 0%, ${paletteHexWithAlpha(
            palette.background,
            0.2,
          )} 34%, transparent 53%)`,
        }}
      />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(0deg, ${paletteHexWithAlpha(palette.background, 0.9)} 0%, ${paletteHexWithAlpha(
            palette.background,
            0.23,
          )} 25%, transparent 48%)`,
        }}
      />

      <AbsoluteFill style={{ pointerEvents: "none" }}>
        {scene.headlines.map((headline, index) => (
          <div
            key={`${headline.text}-${index}`}
            style={{
              position: "absolute",
              left: 84,
              right: 84,
              top: PLACEMENTS[headline.placement ?? (index === 0 ? "top" : "middle")],
              zIndex: 2,
            }}
          >
            <Headline
              headline={headline}
              sceneFrame={frame}
              fps={fps}
              palette={palette}
              style={{
                maxWidth: headline.maxWidth ?? 912,
                marginLeft: headline.align === "center" ? "auto" : 0,
                marginRight: headline.align === "center" ? "auto" : 0,
              }}
            />
          </div>
        ))}
      </AbsoluteFill>

      {isBrandScene ? (
        <SocialEndCard
          enabled={episode.brand.enabled}
          signatureEnabled={episode.brand.signatureEnabled}
          avatarEnabled={episode.brand.avatarEnabled}
          startFrame={signatureStart}
          frame={frame}
          fps={fps}
          palette={palette}
          displayName="SIMPLEDEAV"
          finePrint="Illustrative re-creation. Some imagery is licensed stock."
        />
      ) : null}

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: "inset 0 0 260px 40px rgba(0,0,0,0.48)",
        }}
      />

      <SceneTransition type={scene.transitionIn} frame={frame} palette={palette} />
    </AbsoluteFill>
  );
};

export const LegoCaseStudy: React.FC<LegoCaseStudyProps> = ({ episode }) => {
  const ready = useLocalFonts();
  const palette = getPalette(episode.themeId);

  if (!ready) {
    return <AbsoluteFill style={{ backgroundColor: palette.background }} />;
  }

  return (
    <AbsoluteFill
      className="simpledeav-root"
      style={{
        backgroundColor: palette.background,
        ...getEpisodeFontVars(episode.fontFamily),
      }}
    >
      {episode.scenes.map((scene) => {
        const from = Math.round(scene.startSeconds * episode.fps);
        const duration = Math.max(1, Math.round(scene.durationSeconds * episode.fps));
        return (
          <Sequence key={scene.id} from={from} durationInFrames={duration} name={scene.layout}>
            <LegoScene scene={scene} episode={episode} />
          </Sequence>
        );
      })}

      <AudioTimeline episode={episode} />
      <SubtitleTrack cues={episode.narration.subtitles} palette={palette} />

      <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay", opacity: 0.05 }}>
        <Img
          src={staticFile("images/grain.png")}
          style={{ width: "100%", height: "100%", objectFit: "cover", imageRendering: "pixelated" }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.05)}`,
        }}
      />
    </AbsoluteFill>
  );
};

/**
 * Optional 16:9 adaptation. The 9:16 story is preserved at full height inside a
 * cinematic, blurred safe-area fill rather than awkwardly cropping the text.
 */
export const LegoCaseStudyWide: React.FC<LegoCaseStudyProps> = ({ episode }) => {
  const width = 1920;
  const height = 1080;
  const contentWidth = 1080;
  const contentHeight = 1920;
  const scale = height / contentHeight;
  const left = (width - contentWidth * scale) / 2;
  const palette = getPalette(episode.themeId);
  return (
    <AbsoluteFill style={{ backgroundColor: palette.background }}>
      <Img
        src={staticFile("images/lego/bricks-scattered.jpg")}
        style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.3) blur(24px) saturate(0.6)" }}
      />
      <AbsoluteFill style={{ background: "rgba(10,8,7,0.52)" }} />
      <div
        style={{
          position: "absolute",
          left,
          top: 0,
          width: contentWidth,
          height: contentHeight,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          boxShadow: "0 0 80px rgba(0,0,0,0.55)",
        }}
      >
        <LegoCaseStudy episode={episode} />
      </div>
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.34) 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};
