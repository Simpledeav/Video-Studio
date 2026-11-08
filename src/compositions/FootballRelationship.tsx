import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { FC, FR, SCENES, SIGN_OFF_START_SECONDS } from "../config/football";
import {
  DEFAULT_END_CARD_TEMPLATE,
  type EndCardTemplateId,
} from "../config/brand";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { FootballScore } from "../components/football/FootballScore";
import { SceneHook } from "../components/football/scenes/SceneHook";
import { SceneTransfer } from "../components/football/scenes/SceneTransfer";
import { SceneSigning } from "../components/football/scenes/SceneSigning";
import { ScenePreseason } from "../components/football/scenes/ScenePreseason";
import { SceneLeague } from "../components/football/scenes/SceneLeague";
import { SceneSale } from "../components/football/scenes/SceneSale";
import { SceneReturn } from "../components/football/scenes/SceneReturn";
import { SceneReveal } from "../components/football/scenes/SceneReveal";
import { ScenePunchline } from "../components/football/scenes/ScenePunchline";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  transfer: SceneTransfer,
  signing: SceneSigning,
  preseason: ScenePreseason,
  league: SceneLeague,
  sale: SceneSale,
  return: SceneReturn,
  reveal: SceneReveal,
  punchline: ScenePunchline,
} as const;

/**
 * RONALDO RETIRED. SOME MEN ARE STILL PLAYING THE LEAGUE.
 *
 * A football-documentary spoof that reveals itself as a relationship comedy.
 * Every club, contract and player card is fictional. No likenesses, no real
 * badges, no match footage.
 */
export type FootballRelationshipProps = {
  /** Choose one of the five house closing screens. Defaults to Aurora. */
  endCardTemplate?: EndCardTemplateId;
};

export const FootballRelationship: React.FC<FootballRelationshipProps> = ({
  endCardTemplate = DEFAULT_END_CARD_TEMPLATE,
}) => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: FC.black }}>
      <FootballScore />

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

export const FOOTBALL_RELATIONSHIP_DURATION = FR.durationFrames;
