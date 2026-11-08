import React from "react";
import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { SCENES } from "../config/blackberry";
import { MUSIC_PATH, MUSIC_POINTS, SFX, VOICE_PATH } from "../config/blackberry-audio";
import { BlackBerryScore } from "../components/audio/BlackBerryScore";
import { BlackBerryCaptions } from "../components/typography/BlackBerryCaptions";
import { useLocalFonts } from "../hooks/useLocalFonts";

// Individual Scene Components
import { Scene1Question } from "../components/blackberry/scenes/Scene1Question";
import { Scene2Dominance } from "../components/blackberry/scenes/Scene2Dominance";
import { Scene3IndustryChanges } from "../components/blackberry/scenes/Scene3IndustryChanges";
import { Scene4MissedShift } from "../components/blackberry/scenes/Scene4MissedShift";
import { Scene5Numbers } from "../components/blackberry/scenes/Scene5Numbers";
import { Scene6Transformation } from "../components/blackberry/scenes/Scene6Transformation";
import { Scene7Lesson } from "../components/blackberry/scenes/Scene7Lesson";

const SCENE_COMPONENTS: Record<string, React.FC<{ isWide?: boolean }>> = {
  question: Scene1Question,
  dominance: Scene2Dominance,
  industry_changes: Scene3IndustryChanges,
  missed_shift: Scene4MissedShift,
  numbers: Scene5Numbers,
  transformation: Scene6Transformation,
  lesson: Scene7Lesson,
};

export const BlackBerryCaseStudy: React.FC = () => {
  const { width, height } = useVideoConfig();
  const isWide = width > height;

  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: "#F6F5F0" }}>
      {/* 1. Full Audio Timeline (Voiceover, Custom 80s Score, Precision Foley/SFX) */}
      <BlackBerryScore
        voicePath={VOICE_PATH}
        musicPath={MUSIC_PATH}
        musicPoints={MUSIC_POINTS}
        sfx={SFX}
      />

      {/* 2. Visual Scenes Timeline (7 Scenes · 2,400 Frames · 80.0 Seconds) */}
      {SCENES.map((scene) => {
        const SceneComponent = SCENE_COMPONENTS[scene.id];
        if (!SceneComponent) return null;

        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationFrames}
            name={scene.title}
          >
            <SceneComponent isWide={isWide} />
          </Sequence>
        );
      })}

      {/* 3. Swiss Editorial Subtitle Captions */}
      <BlackBerryCaptions isWide={isWide} />
    </AbsoluteFill>
  );
};
