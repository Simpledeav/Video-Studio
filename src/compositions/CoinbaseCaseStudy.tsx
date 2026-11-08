import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { CB, C, SCENES, useStage } from "../config/coinbase";
import { THEMES } from "../config/theme";
import { CoinbaseCaptions } from "../components/coinbase/CoinbaseCaptions";
import { CoinbaseScore } from "../components/coinbase/CoinbaseScore";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { SceneHook } from "../components/coinbase/scenes/SceneHook";
import { SceneBottleneck } from "../components/coinbase/scenes/SceneBottleneck";
import { SceneShift } from "../components/coinbase/scenes/SceneShift";
import { SceneSeventyFive } from "../components/coinbase/scenes/SceneSeventyFive";
import { SceneSpeed } from "../components/coinbase/scenes/SceneSpeed";
import { SceneProductivity } from "../components/coinbase/scenes/SceneProductivity";
import { SceneConclusion } from "../components/coinbase/scenes/SceneConclusion";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  bottleneck: SceneBottleneck,
  shift: SceneShift,
  seventyfive: SceneSeventyFive,
  speed: SceneSpeed,
  productivity: SceneProductivity,
  conclusion: SceneConclusion,
} as const;

const signOffPalette = {
  ...THEMES.GRAPHITE_LIME,
  accent: C.lime,
  textPrimary: C.white,
};

export const CoinbaseCaseStudy: React.FC = () => {
  useLocalFonts();
  const { wide } = useStage();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <CoinbaseScore />

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

      <CoinbaseCaptions />

      <SimpledeavSignOff
        startSeconds={88}
        palette={signOffPalette}
        topLabel="SIMPLEDEAV PRESENTS"
        tag="SIMPLEDEAV · DOCUMENTARY SERIES"
        finePrint={
          wide
            ? "SOURCE: CURSOR CUSTOMER CASE STUDY, COINBASE, 2026 · REPORTED OUTCOMES"
            : undefined
        }
      />
    </AbsoluteFill>
  );
};

export const COINBASE_DURATION = CB.durationFrames;
