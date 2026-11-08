import type {
  CharacterAction,
  CharacterExpression,
} from "../../config/episode.schema";
import { getActionPose } from "./poses";
import type { RigPose } from "./StickmanRig";

export type CharacterFacing = "front" | "left" | "right";

export type CharacterMotion = {
  pose: RigPose;
  scaleX: number;
  bodyRotation: number;
};

/**
 * Deterministic motion. Same scene frame + action => identical pose.
 * A "turn" squashes through the vertical axis and flips once; no random values
 * or time-based animation are used anywhere.
 */
export const getCharacterMotion = ({
  action,
  frame,
  fps,
  facing,
  expression,
}: {
  action: CharacterAction;
  frame: number;
  fps: number;
  facing: CharacterFacing;
  expression?: CharacterExpression;
}): CharacterMotion => {
  const pose = getActionPose(action, frame, fps, expression);
  const facingScale = facing === "left" ? -1 : 1;
  let scaleX = facingScale;
  let bodyRotation = 0;

  if (action === "turn") {
    const progress = Math.min(1, Math.max(0, frame / (fps * 1.15)));
    const eased = progress * progress * (3 - 2 * progress);
    scaleX = facingScale * (eased < 0.5 ? 1 : -1) * Math.abs(Math.cos(eased * Math.PI));
    bodyRotation = Math.sin(eased * Math.PI) * 2.2;
  }

  return { pose, scaleX, bodyRotation };
};
