import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { BT, SCENES } from "../config/bankTransfer";
import { DEFAULT_END_CARD_TEMPLATE, type EndCardTemplateId } from "../config/brand";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { BankTransferScore } from "../components/banktransfer/Score";
import { BankTransferCaptions } from "../components/banktransfer/Captions";
import { SceneMissing } from "../components/banktransfer/scenes/SceneMissing";
import { SceneNetwork } from "../components/banktransfer/scenes/SceneNetwork";
import { SceneRoute } from "../components/banktransfer/scenes/SceneRoute";
import { SceneFailure } from "../components/banktransfer/scenes/SceneFailure";
import { SceneAlert } from "../components/banktransfer/scenes/SceneAlert";
import { SceneTrace } from "../components/banktransfer/scenes/SceneTrace";
import { SceneRights } from "../components/banktransfer/scenes/SceneRights";
import { SceneReveal } from "../components/banktransfer/scenes/SceneReveal";

const SCENE_COMPONENTS = {
  missing: SceneMissing,
  network: SceneNetwork,
  route: SceneRoute,
  failure: SceneFailure,
  alert: SceneAlert,
  trace: SceneTrace,
  rights: SceneRights,
  reveal: SceneReveal,
} as const;

export type BankTransferProps = {
  endCardTemplate?: EndCardTemplateId;
};

/**
 * WHY YOUR BANK TRANSFER SAYS SUCCESSFUL — BUT THE RECEIVER GETS NOTHING.
 *
 * Vertical 9:16 master (1080×1920). A fictional ₦250,000 transfer between two
 * fictional banks, used to explain interbank messaging, unresolved states and
 * the NIBSS NIP tracker. NIBSS is payment infrastructure, not a place where
 * money is stored. Not financial advice; no real bank UI is reproduced.
 */
export const BankTransfer: React.FC<BankTransferProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();
  const { width, height } = useVideoConfig();
  const wide = width > height;

  return (
    <AbsoluteFill style={{ backgroundColor: "#03060A" }}>
      <BankTransferScore />

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

      <BankTransferCaptions />

      <SimpledeavSignOff
        startSeconds={BT.signOffStartFrame / BT.fps}
        template={endCardTemplate}
      />
    </AbsoluteFill>
  );
};

/**
 * 16:9 recomposition for YouTube, Facebook and LinkedIn. Same narration,
 * score, cuts and story beats; every act is laid out again for landscape.
 */
export const BankTransferWide: React.FC<BankTransferProps> = (props) => (
  <BankTransfer {...props} />
);
