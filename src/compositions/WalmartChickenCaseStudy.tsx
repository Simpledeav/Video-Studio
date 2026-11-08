import { AbsoluteFill, Sequence } from "remotion";
import { C, SCENES } from "../config/walmartChicken";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { WalmartChickenCaptions } from "../components/walmartchicken/Captions";
import { WalmartChickenScore } from "../components/walmartchicken/Score";
import { Scene01Hook } from "../components/walmartchicken/scenes/Scene01Hook";
import { Scene02Story } from "../components/walmartchicken/scenes/Scene02Story";
import { Scene03Build } from "../components/walmartchicken/scenes/Scene03Build";
import { Scene04Price } from "../components/walmartchicken/scenes/Scene04Price";
import { Scene05Viral } from "../components/walmartchicken/scenes/Scene05Viral";
import { Scene06Ending } from "../components/walmartchicken/scenes/Scene06Ending";

const SCENE_COMPONENTS = {
  hook: Scene01Hook,
  story: Scene02Story,
  build: Scene03Build,
  price: Scene04Price,
  viral: Scene05Viral,
  ending: Scene06Ending,
} as const;

/**
 * WALMART — THE CHICKEN PURSE THAT SOLD OUT IN 90 MINUTES.
 *
 * 80-second vertical business case study. Official product photography,
 * kinetic retail graphics, and a fast six-act edit.
 */
export const WalmartChickenCaseStudy: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.blueInk }}>
      <WalmartChickenScore />

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

      <WalmartChickenCaptions />
    </AbsoluteFill>
  );
};
