import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { C, RP, SCENES, SIGN_OFF_START_SECONDS } from "../config/replit";
import {
  DEFAULT_END_CARD_TEMPLATE,
  type EndCardTemplateId,
} from "../config/brand";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { ReplitScore } from "../components/replit/ReplitScore";
import {
  WideConclusion,
  WideData,
  WideExperiment,
  WideFailure,
  WideHook,
  WideLesson,
  WideRecovery,
  WideWarning,
} from "../components/replit/wide/WideScenes";

const SCENE_COMPONENTS = {
  hook: WideHook,
  experiment: WideExperiment,
  data: WideData,
  warning: WideWarning,
  failure: WideFailure,
  recovery: WideRecovery,
  lesson: WideLesson,
  conclusion: WideConclusion,
} as const;

/**
 * THE AI CODING AGENT THAT DELETED A PRODUCTION DATABASE — 16:9
 *
 * Same narration, score and editorial spine as the vertical film, with
 * dedicated 1920×1080 layout compositions per act. No reframing or crop.
 */
export type DeletedProductionDatabaseWideProps = {
  endCardTemplate?: EndCardTemplateId;
};

export const DeletedProductionDatabaseWide: React.FC<
  DeletedProductionDatabaseWideProps
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

export const DELETED_DATABASE_WIDE_DURATION = RP.durationFrames;
