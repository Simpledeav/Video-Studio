import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { DEFAULT_END_CARD_TEMPLATE, type EndCardTemplateId } from "../config/brand";
import { PL, SCENES } from "../config/pocketLedger";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { PocketLedgerScore } from "../components/pocketledger/Score";
import { PocketLedgerCaptions } from "../components/pocketledger/Captions";
import { Scene01Hook } from "../components/pocketledger/scenes/Scene01Hook";
import { Scene02Owner } from "../components/pocketledger/scenes/Scene02Owner";
import { Scene03Evidence } from "../components/pocketledger/scenes/Scene03Evidence";
import { Scene04Idea } from "../components/pocketledger/scenes/Scene04Idea";
import { Scene05Demo } from "../components/pocketledger/scenes/Scene05Demo";
import { Scene06Lesson } from "../components/pocketledger/scenes/Scene06Lesson";
import { Scene07Ending } from "../components/pocketledger/scenes/Scene07Ending";

const SCENE_COMPONENTS = {
  hook: Scene01Hook,
  owner: Scene02Owner,
  evidence: Scene03Evidence,
  idea: Scene04Idea,
  demo: Scene05Demo,
  lesson: Scene06Lesson,
  ending: Scene07Ending,
} as const;

export type PocketLedgerProps = {
  endCardTemplate?: EndCardTemplateId;
};

/**
 * POCKETLEDGER — NOT EVERY STARTUP NEEDS TO BE A UNICORN.
 *
 * A 90-second documentary about a small, useful product for Nigerian
 * micro-businesses. Two recomposed masters (9:16 and 16:9) share one
 * timeline; the cover is a standalone 16:9 composition.
 *
 * PocketLedger is explicitly a hypothetical concept. Demo figures are
 * illustrative. Research is attributed on screen.
 */
export const PocketLedgerCaseStudy: React.FC<PocketLedgerProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();
  useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0E0B" }}>
      <PocketLedgerScore />

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

      <PocketLedgerCaptions />

      <SimpledeavSignOff
        startSeconds={PL.signOffStartFrame / PL.fps}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};
