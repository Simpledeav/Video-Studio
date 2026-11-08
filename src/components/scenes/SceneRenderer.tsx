import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import type { Episode, Scene } from "../../config/episode.schema";
import { getPalette, paletteHexWithAlpha } from "../../config/theme";
import { CameraMotion } from "../camera/CameraMotion";
import { Stickman } from "../character/Stickman";
import { Headline } from "../typography/Headline";
import { SceneBackground } from "./SceneBackground";
import { SceneVisuals } from "./SceneVisuals";
import { SceneForeground } from "./SceneForeground";
import { SceneTransition } from "../transitions/Transitions";
import { SocialEndCard } from "../branding/SocialEndCard";

type SceneRendererProps = {
  scene: Scene;
  episode: Episode;
};

const PLACEMENTS = {
  top: 208,
  middle: 690,
  lower: 1160,
} as const;

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, episode }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const palette = getPalette(episode.themeId);
  const sceneFrames = Math.max(1, Math.round(scene.durationSeconds * fps));
  const signatureStart = Math.round((episode.brand.startSeconds - scene.startSeconds) * fps);
  const characterIn = interpolate(frame, [0, 7], [0.72, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sceneEnd = scene.startSeconds + scene.durationSeconds;
  const isBrandScene =
    episode.brand.enabled &&
    episode.brand.signatureEnabled &&
    episode.brand.startSeconds >= scene.startSeconds &&
    episode.brand.startSeconds < sceneEnd;

  return (
    <AbsoluteFill
      className="simpledeav-root"
      style={{ backgroundColor: palette.background, overflow: "hidden" }}
    >
      <SceneBackground
        background={scene.background}
        frame={frame}
        durationInFrames={sceneFrames}
        palette={palette}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 760,
          background: `linear-gradient(180deg, ${paletteHexWithAlpha(
            palette.background,
            0.8,
          )} 0%, ${paletteHexWithAlpha(palette.background, 0.34)} 48%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      <CameraMotion camera={scene.camera} frame={frame} durationInFrames={sceneFrames}>
        <SceneVisuals
          scene={scene}
          character={scene.character}
          visual={scene.visual}
          palette={palette}
          frame={frame}
          fps={fps}
        />
        <Stickman
          action={scene.character.action}
          frame={frame}
          fps={fps}
          x={scene.character.x}
          y={scene.character.y}
          scale={scene.character.scale}
          facing={scene.character.facing}
          expression={scene.character.expression}
          palette={palette}
          opacity={characterIn}
        />
        <SceneForeground scene={scene} palette={palette} frame={frame} />
      </CameraMotion>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: `linear-gradient(0deg, ${paletteHexWithAlpha(
            palette.background,
            0.82,
          )} 0%, ${paletteHexWithAlpha(palette.background, 0.28)} 21%, transparent 43%)`,
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

        {isBrandScene ? (
          <SocialEndCard
            enabled={episode.brand.enabled}
            signatureEnabled={episode.brand.signatureEnabled}
            avatarEnabled={episode.brand.avatarEnabled}
            startFrame={signatureStart}
            frame={frame}
            fps={fps}
            palette={palette}
          />
        ) : null}
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          boxShadow: palette.isDark
            ? "inset 0 0 260px 40px rgba(0,0,0,0.55)"
            : "inset 0 0 220px 30px rgba(255,255,255,0.22)",
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          right: -170,
          top: 480,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${paletteHexWithAlpha(palette.accent, 0.14)}, transparent 67%)`,
          filter: "blur(24px)",
          pointerEvents: "none",
        }}
      />

      <SceneTransition type={scene.transitionIn} frame={frame} palette={palette} />
    </AbsoluteFill>
  );
};
