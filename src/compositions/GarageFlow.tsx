import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { GF, SCENES } from "../config/garageflow";
import { DEFAULT_END_CARD_TEMPLATE, type EndCardTemplateId } from "../config/brand";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { GarageFlowScore } from "../components/garageflow/Score";
import { GarageFlowCaptions } from "../components/garageflow/Captions";
import { SceneHook } from "../components/garageflow/scenes/SceneHook";
import { SceneProblem } from "../components/garageflow/scenes/SceneProblem";
import { SceneResearch } from "../components/garageflow/scenes/SceneResearch";
import { SceneReveal } from "../components/garageflow/scenes/SceneReveal";
import { SceneDemo } from "../components/garageflow/scenes/SceneDemo";
import { SceneOpportunity } from "../components/garageflow/scenes/SceneOpportunity";
import { SceneOffer } from "../components/garageflow/scenes/SceneOffer";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  problem: SceneProblem,
  research: SceneResearch,
  reveal: SceneReveal,
  demo: SceneDemo,
  opportunity: SceneOpportunity,
  offer: SceneOffer,
} as const;

export type GarageFlowProps = {
  endCardTemplate?: EndCardTemplateId;
};

/**
 * GARAGEFLOW — EVERY REPAIR. ONE WORKSPACE.
 *
 * A 90-second product film for a fictional garage operating system, presented
 * as a SimpleDeav product concept. The same component renders both the 9:16
 * and 16:9 cuts; each act reads the canvas and recomposes rather than cropping.
 * Demo data, pricing and timestamps are fictional.
 */
export const GarageFlow: React.FC<GarageFlowProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();
  const { width, height } = useVideoConfig();
  const wide = width > height;

  return (
    <AbsoluteFill style={{ backgroundColor: "#04070C" }}>
      <GarageFlowScore />

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
            <SceneComponent wide={wide} />
          </Sequence>
        );
      })}

      <GarageFlowCaptions />

      <SimpledeavSignOff
        startSeconds={GF.signOffStartFrame / GF.fps}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};

/**
 * 16:9 recomposition for YouTube, LinkedIn and the web. Same narration,
 * score, cuts and story beats; every act is laid out again for landscape.
 */
export const GarageFlowWide: React.FC<GarageFlowProps> = (props) => <GarageFlow {...props} />;
