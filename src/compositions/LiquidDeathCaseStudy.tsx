import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { DEFAULT_END_CARD_TEMPLATE, type EndCardTemplateId } from "../config/brand";
import { LD, SCENES } from "../config/liquidDeath";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { LiquidDeathScore } from "../components/liquiddeath/Score";
import { LiquidDeathCaptions } from "../components/liquiddeath/Captions";
import { Scene01Impossible } from "../components/liquiddeath/scenes/Scene01Impossible";
import { Scene02Aisle } from "../components/liquiddeath/scenes/Scene02Aisle";
import { Scene03Idea } from "../components/liquiddeath/scenes/Scene03Idea";
import { Scene04Problem } from "../components/liquiddeath/scenes/Scene04Problem";
import { Scene05Attention } from "../components/liquiddeath/scenes/Scene05Attention";
import { Scene06Shipping } from "../components/liquiddeath/scenes/Scene06Shipping";
import { Scene07Lesson } from "../components/liquiddeath/scenes/Scene07Lesson";
import { Scene08Finale } from "../components/liquiddeath/scenes/Scene08Finale";

const SCENE_COMPONENTS = {
  impossible: Scene01Impossible,
  aisle: Scene02Aisle,
  idea: Scene03Idea,
  problem: Scene04Problem,
  attention: Scene05Attention,
  shipping: Scene06Shipping,
  lesson: Scene07Lesson,
  finale: Scene08Finale,
} as const;

export type LiquidDeathProps = {
  endCardTemplate?: EndCardTemplateId;
};

/**
 * HE PUT WATER IN A BEER CAN, CALLED IT LIQUID DEATH,
 * AND BUILT A BILLION-DOLLAR BRAND.
 *
 * A 90-second documentary case study. Two responsive compositions are
 * registered from this component: 1080×1920 vertical and 1920×1080 wide.
 * Every scene recomposes for its canvas rather than cropping the other cut.
 *
 * Product imagery is Liquid Death's own published packaging. The founder
 * photograph is a credited CNBC press still. The early social feed is a
 * labelled reconstruction, not archival footage.
 */
export const LiquidDeathCaseStudy: React.FC<LiquidDeathProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();
  useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#050506" }}>
      <LiquidDeathScore />

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

      <LiquidDeathCaptions />

      <SimpledeavSignOff
        startSeconds={LD.signOffStartFrame / LD.fps}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};
