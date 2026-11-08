import { AbsoluteFill, Sequence } from "remotion";
import { useLocalFonts } from "../hooks/useLocalFonts";
import { C, SCENES, SEC, SIGN_OFF_START_SECONDS } from "../config/security";
import { SimpledeavSignOff } from "../components/branding/SimpledeavSignOff";
import { SecurityScore } from "../components/security/SecurityScore";
import { SceneHook } from "../components/security/scenes/SceneHook";
import { SceneBusiness } from "../components/security/scenes/SceneBusiness";
import { SceneAuthentication } from "../components/security/scenes/SceneAuthentication";
import { SceneMistake } from "../components/security/scenes/SceneMistake";
import { SceneExposure } from "../components/security/scenes/SceneExposure";
import { SceneImpact } from "../components/security/scenes/SceneImpact";
import { SceneSolution } from "../components/security/scenes/SceneSolution";
import { SceneTakeaway } from "../components/security/scenes/SceneTakeaway";

const SCENE_COMPONENTS = {
  hook: SceneHook,
  business: SceneBusiness,
  authentication: SceneAuthentication,
  mistake: SceneMistake,
  exposure: SceneExposure,
  impact: SceneImpact,
  solution: SceneSolution,
  takeaway: SceneTakeaway,
} as const;

/**
 * ONE SMALL SECURITY MISTAKE THAT EXPOSED AN ENTIRE BUSINESS
 *
 * A fictional but technically realistic broken-access-control incident.
 * Authentication succeeds; object-level authorization is never enforced.
 * The reconstruction is illustrative, not a screenshot of a real company.
 */
export const AccessControlCaseStudy: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black }}>
      <SecurityScore />

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

      <SimpledeavSignOff startSeconds={SIGN_OFF_START_SECONDS} />
    </AbsoluteFill>
  );
};

export const ACCESS_CONTROL_DURATION = SEC.durationFrames;
