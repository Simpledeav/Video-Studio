import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { DEFAULT_END_CARD_TEMPLATE, type EndCardTemplateId } from "../config/brand";
import { JG, SCENES } from "../config/juicero";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { JuiceroScore } from "../components/juicero/Score";
import { JuiceroCaptions } from "../components/juicero/Captions";
import { Scene01Hook } from "../components/juicero/scenes/Scene01Hook";
import { Scene02Dream } from "../components/juicero/scenes/Scene02Dream";
import { Scene03Millions } from "../components/juicero/scenes/Scene03Millions";
import { Scene04Reveal } from "../components/juicero/scenes/Scene04Reveal";
import { Scene05Collapse } from "../components/juicero/scenes/Scene05Collapse";
import { Scene06Lesson } from "../components/juicero/scenes/Scene06Lesson";
import { Scene07Ending } from "../components/juicero/scenes/Scene07Ending";

const SCENE_COMPONENTS = {
  hook: Scene01Hook,
  dream: Scene02Dream,
  millions: Scene03Millions,
  reveal: Scene04Reveal,
  collapse: Scene05Collapse,
  lesson: Scene06Lesson,
  ending: Scene07Ending,
} as const;

export type JuiceroProps = {
  endCardTemplate?: EndCardTemplateId;
};

/**
 * JUICERO — THE $120 MILLION JUICE MACHINE THAT DIDN'T NEED TO EXIST.
 *
 * A 90-second premium business case study with a dry comic edge. The same
 * component renders both the 9:16 and 16:9 cuts; every act recomposes from the
 * canvas rather than cropping the other version. Product objects (machine,
 * pack, glass, orange) are code-built; human scenes are licensed editorial
 * photography labelled as illustrative reconstruction.
 */
export const JuiceroFilm: React.FC<JuiceroProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();
  useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050403" }}>
      <JuiceroScore />

      {SCENES.map((scene) => {
        const SceneComponent = SCENE_COMPONENTS[scene.id];
        return (
          <Sequence
            key={scene.id}
            from={scene.startFrame}
            durationInFrames={scene.durationFrames}
            name={scene.title}
            layout="none"
          >
            <SceneComponent />
          </Sequence>
        );
      })}

      <JuiceroCaptions />

      <SimpledeavSignOff
        startSeconds={JG.signOffStartFrame / JG.fps}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};
