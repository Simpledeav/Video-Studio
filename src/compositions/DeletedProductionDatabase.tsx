import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { C, RP, SCENES, SIGN_OFF_START_SECONDS } from "../config/replit";
import {
  DEFAULT_END_CARD_TEMPLATE,
  type EndCardTemplateId,
} from "../config/brand";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { ReplitScore } from "../components/replit/ReplitScore";
import { SceneHook } from "../components/replit/scenes/SceneHook";
import { SceneExperiment } from "../components/replit/scenes/SceneExperiment";
import { SceneData } from "../components/replit/scenes/SceneData";
import { SceneWarning } from "../components/replit/scenes/SceneWarning";
import { SceneFailure } from "../components/replit/scenes/SceneFailure";
import { SceneRecovery } from "../components/replit/scenes/SceneRecovery";
import { SceneLesson } from "../components/replit/scenes/SceneLesson";
import { SceneConclusion } from "../components/replit/scenes/SceneConclusion";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  experiment: SceneExperiment,
  data: SceneData,
  warning: SceneWarning,
  failure: SceneFailure,
  recovery: SceneRecovery,
  lesson: SceneLesson,
  conclusion: SceneConclusion,
} as const;

/**
 * THE AI CODING AGENT THAT DELETED A PRODUCTION DATABASE
 *
 * A reported July 2025 incident: a Replit AI coding agent deleted a live
 * production database while the user had instructed a code/action freeze.
 * The film is an editorial reconstruction, not a screenshot reproduction.
 */
export type DeletedProductionDatabaseProps = {
  /**
   * Which closing screen to use. Defaults to the house default in
   * `src/config/brand.ts`. Pick another in the Studio props panel to audition
   * it for this film only.
   */
  endCardTemplate?: EndCardTemplateId;
};

export const DeletedProductionDatabase: React.FC<
  DeletedProductionDatabaseProps
> = ({ endCardTemplate = DEFAULT_END_CARD_TEMPLATE }) => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <ReplitScore />

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

      <SimpledeavSignOff
        startSeconds={SIGN_OFF_START_SECONDS}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};

export const DELETED_DATABASE_DURATION = RP.durationFrames;
