import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { C, PN, SCENES } from "../config/paynova";
import { PaynovaScore } from "../components/paynova/PaynovaScore";
import { PaynovaCaptions } from "../components/paynova/PaynovaCaptions";
import { SceneHook } from "../components/paynova/scenes/SceneHook";
import { SceneGrowth } from "../components/paynova/scenes/SceneGrowth";
import { SceneProblem } from "../components/paynova/scenes/SceneProblem";
import { SceneStruggle } from "../components/paynova/scenes/SceneStruggle";
import { SceneDiscovery } from "../components/paynova/scenes/SceneDiscovery";
import { SceneSolution } from "../components/paynova/scenes/SceneSolution";
import { SceneRecovery } from "../components/paynova/scenes/SceneRecovery";
import { SceneCTA } from "../components/paynova/scenes/SceneCTA";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  growth: SceneGrowth,
  problem: SceneProblem,
  struggle: SceneStruggle,
  discovery: SceneDiscovery,
  solution: SceneSolution,
  recovery: SceneRecovery,
  cta: SceneCTA,
} as const;

export const PaynovaCaseStudy: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <div style={{ position: "absolute", inset: 0, backgroundColor: C.bg }} />
      <PaynovaScore />

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

      <PaynovaCaptions />
    </AbsoluteFill>
  );
};

export const PaynovaCaseStudyWide: React.FC = () => <PaynovaCaseStudy />;

export const PAYNOVA_DURATION = PN.durationFrames;
