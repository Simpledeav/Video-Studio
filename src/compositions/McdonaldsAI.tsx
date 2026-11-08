import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { C, MD, SCENES, SIGN_OFF_START_SECONDS } from "../config/mcdonalds";
import {
  DEFAULT_END_CARD_TEMPLATE,
  type EndCardTemplateId,
} from "../config/brand";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { McDonaldsScore } from "../components/mcdonalds/Score";
import { McDonaldsCaptions } from "../components/mcdonalds/Captions";
import { SceneHook } from "../components/mcdonalds/scenes/SceneHook";
import { SceneIdea } from "../components/mcdonalds/scenes/SceneIdea";
import { SceneChaos } from "../components/mcdonalds/scenes/SceneChaos";
import { SceneInternet } from "../components/mcdonalds/scenes/SceneInternet";
import { SceneDecision } from "../components/mcdonalds/scenes/SceneDecision";
import { SceneLesson } from "../components/mcdonalds/scenes/SceneLesson";
import { SceneTakeaway } from "../components/mcdonalds/scenes/SceneTakeaway";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  idea: SceneIdea,
  chaos: SceneChaos,
  internet: SceneInternet,
  decision: SceneDecision,
  lesson: SceneLesson,
  takeaway: SceneTakeaway,
} as const;

export type McDonaldsAIProps = {
  endCardTemplate?: EndCardTemplateId;
};

/**
 * McDONALD'S TRIED AI. THEN THINGS GOT WEIRD.
 *
 * A 90-second business and technology case study. The same component renders
 * the 9:16 and 16:9 cuts; every act reads the canvas and recomposes rather than
 * cropping the other version. Source reporting is credited on screen.
 */
export const McDonaldsAI: React.FC<McDonaldsAIProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <McDonaldsScore />

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

      <McDonaldsCaptions />

      <SimpledeavSignOff
        startSeconds={SIGN_OFF_START_SECONDS}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};

export const MCDONALDS_DURATION = MD.durationFrames;
