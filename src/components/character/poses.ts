import type { CharacterAction, CharacterExpression } from "../../config/episode.schema";
import type {
  ArmPose,
  ExpressionName,
  HandShape,
  Point,
  RigPose,
} from "./StickmanRig";

const TAU = Math.PI * 2;

const smoothstep = (value: number) => {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
};

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpPoint = (a: Point, b: Point, t: number): Point => ({
  x: lerp(a.x, b.x, t),
  y: lerp(a.y, b.y, t),
});

const idleLegs = (sway = 0): RigPose["legs"] => ({
  left: { thighAngle: 97 + sway, shinAngle: 89, footAngle: 153 },
  right: { thighAngle: 83 - sway, shinAngle: 91, footAngle: 27 },
});

const sideLegs = (sway = 0): RigPose["legs"] => ({
  left: { thighAngle: 91 + sway, shinAngle: 90, footAngle: 2 },
  right: { thighAngle: 87 - sway, shinAngle: 90, footAngle: 8 },
});

const sittingLegs: RigPose["legs"] = {
  left: { thighAngle: 6, shinAngle: 91, footAngle: 2 },
  right: { thighAngle: 11, shinAngle: 89, footAngle: 6 },
};

const relaxedArms = (sway = 0): RigPose["arms"] => ({
  left: {
    kind: "angles",
    upperAngle: 104 + sway,
    forearmAngle: 94 + sway * 0.5,
    handAngle: 91,
    handShape: "relaxed",
  },
  right: {
    kind: "angles",
    upperAngle: 76 - sway,
    forearmAngle: 86 - sway * 0.5,
    handAngle: 89,
    handShape: "relaxed",
  },
});

const armTarget = (
  target: Point,
  handAngle: number,
  handShape: HandShape,
  bend?: 1 | -1,
): ArmPose => ({ kind: "target", target, handAngle, handShape, bend });

const asExpression = (
  requested: CharacterExpression | undefined,
  fallback: ExpressionName,
): ExpressionName =>
  requested === "neutral" || requested === undefined ? fallback : (requested as ExpressionName);

const base = (): Omit<RigPose, "arms" | "legs" | "expression" | "headTilt" | "headTurn" | "lean"> => ({
  rootOffset: { x: 0, y: 0 },
  farLimbOpacity: 0.72,
});

export const getActionPose = (
  action: CharacterAction,
  frame: number,
  fps: number,
  requestedExpression?: CharacterExpression,
): RigPose => {
  const seconds = frame / fps;
  const breath = Math.sin((seconds / 4.6) * TAU);
  const sway = breath * 1.2;

  if (action === "walk") {
    const phase = Math.sin(seconds * 1.45 * TAU);
    const bob = Math.abs(Math.sin(seconds * 1.45 * TAU)) * -4;
    return {
      ...base(),
      lean: 4,
      headTilt: -1,
      headTurn: 0.15,
      rootOffset: { x: 0, y: bob },
      expression: asExpression(requestedExpression, "focused"),
      legs: {
        left: {
          thighAngle: 92 + phase * 25,
          shinAngle: 91 + Math.max(0, -phase) * 30,
          footAngle: 4 + phase * 12,
        },
        right: {
          thighAngle: 88 - phase * 25,
          shinAngle: 89 + Math.max(0, phase) * 30,
          footAngle: 8 - phase * 12,
        },
      },
      arms: {
        left: {
          kind: "angles",
          upperAngle: 96 - phase * 19,
          forearmAngle: 94 - phase * 10,
          handAngle: 91,
          handShape: "relaxed",
        },
        right: {
          kind: "angles",
          upperAngle: 84 + phase * 19,
          forearmAngle: 86 + phase * 10,
          handAngle: 89,
          handShape: "relaxed",
        },
      },
    };
  }

  if (action === "sit") {
    return {
      ...base(),
      lean: 8,
      headTilt: 1,
      headTurn: 0.2,
      rootOffset: { x: 0, y: breath * 0.7 },
      expression: asExpression(requestedExpression, "neutral"),
      legs: sittingLegs,
      arms: {
        left: armTarget({ x: 38, y: -36 }, 82, "relaxed", 1),
        right: armTarget({ x: 82, y: -43 }, 88, "relaxed", -1),
      },
    };
  }

  if (action === "sitType") {
    const reach = smoothstep((frame - 2) / 12);
    const tap = Math.sin(frame / 2.8) * 1.8;
    return {
      ...base(),
      lean: 10,
      headTilt: 3,
      headTurn: 0.36,
      rootOffset: { x: 0, y: breath * 0.8 },
      expression: asExpression(requestedExpression, "focused"),
      farLimbOpacity: 0.56,
      legs: sittingLegs,
      arms: {
        left: armTarget(
          lerpPoint({ x: 44, y: -22 }, { x: POSE_ANCHORS.sitTyping.left.x, y: POSE_ANCHORS.sitTyping.left.y + tap }, reach),
          88,
          "type",
          1,
        ),
        right: armTarget(
          lerpPoint({ x: 64, y: -22 }, { x: POSE_ANCHORS.sitTyping.right.x, y: POSE_ANCHORS.sitTyping.right.y - tap * 0.8 }, reach),
          88,
          "type",
          -1,
        ),
      },
    };
  }

  if (action === "sitPause") {
    const reach = smoothstep((frame - 1) / 15);
    return {
      ...base(),
      lean: 6,
      headTilt: 2,
      headTurn: 0.72,
      rootOffset: { x: 0, y: breath * 0.7 },
      expression: asExpression(requestedExpression, "concerned"),
      farLimbOpacity: 0.56,
      legs: sittingLegs,
      arms: {
        left: armTarget({ x: POSE_ANCHORS.sitTyping.left.x, y: POSE_ANCHORS.sitTyping.left.y }, 88, "type", 1),
        right: armTarget(
          lerpPoint(
            { x: POSE_ANCHORS.sitTyping.right.x, y: POSE_ANCHORS.sitTyping.right.y },
            { x: POSE_ANCHORS.sitPause.x, y: POSE_ANCHORS.sitPause.y },
            reach,
          ),
          6,
          "point",
          -1,
        ),
      },
    };
  }

  if (action === "sitReact") {
    const react = smoothstep((frame - 3) / 13);
    return {
      ...base(),
      lean: 10 - react * 15,
      headTilt: 3 - react * 8,
      headTurn: 0.3,
      rootOffset: { x: 0, y: breath * 0.5 - react * 2.5 },
      expression: asExpression(requestedExpression, "surprised"),
      farLimbOpacity: 0.56,
      legs: sittingLegs,
      arms: {
        left: armTarget({ x: POSE_ANCHORS.sitTyping.left.x, y: POSE_ANCHORS.sitTyping.left.y }, 88, "type", 1),
        right: armTarget(
          lerpPoint(
            { x: POSE_ANCHORS.sitTyping.right.x, y: POSE_ANCHORS.sitTyping.right.y },
            { x: POSE_ANCHORS.sitReact.right.x, y: POSE_ANCHORS.sitReact.right.y },
            react,
          ),
          -18,
          "open",
          -1,
        ),
      },
    };
  }

  if (action === "type") {
    const reach = smoothstep((frame - 3) / 14);
    const tap = Math.sin(frame / 2.6) * 2.3;
    return {
      ...base(),
      lean: 12,
      headTilt: 4,
      headTurn: 0.38,
      rootOffset: { x: 0, y: breath * 1.1 },
      expression: asExpression(requestedExpression, "focused"),
      farLimbOpacity: 0.52,
      legs: sideLegs(0.5),
      arms: {
        left: armTarget(
          lerpPoint({ x: 30, y: -14 }, { x: POSE_ANCHORS.typing.left.x, y: POSE_ANCHORS.typing.left.y + tap }, reach),
          92,
          "type",
          1,
        ),
        right: armTarget(
          lerpPoint({ x: 58, y: -12 }, { x: POSE_ANCHORS.typing.right.x, y: POSE_ANCHORS.typing.right.y - tap * 0.8 }, reach),
          90,
          "type",
          -1,
        ),
      },
    };
  }

  if (action === "point") {
    const reach = smoothstep((frame - 2) / 16);
    const pointY = -198 + Math.sin(seconds * 1.8) * 2.4;
    return {
      ...base(),
      lean: -2,
      headTilt: -1,
      headTurn: 0.65,
      rootOffset: { x: 0, y: breath * 0.9 },
      expression: asExpression(requestedExpression, "focused"),
      legs: idleLegs(1.2),
      arms: {
        left: {
          kind: "angles",
          upperAngle: 101,
          forearmAngle: 92,
          handAngle: 90,
          handShape: "relaxed",
        },
        right: armTarget(
          lerpPoint({ x: 38, y: -22 }, { x: 221, y: pointY }, reach),
          -22,
          "point",
          -1,
        ),
      },
    };
  }

  if (action === "lookAtScreen") {
    return {
      ...base(),
      lean: 7,
      headTilt: 3.5,
      headTurn: 0.55,
      rootOffset: { x: 0, y: breath * 1.2 },
      expression: asExpression(requestedExpression, "focused"),
      legs: sideLegs(0.6),
      arms: {
        left: {
          kind: "angles",
          upperAngle: 100,
          forearmAngle: 88,
          handAngle: 92,
          handShape: "relaxed",
        },
        right: armTarget({ x: 73, y: -101 }, 82, "relaxed", -1),
      },
    };
  }

  if (action === "surprise") {
    const recoil = smoothstep((frame - 2) / 11);
    const settle = smoothstep((frame - 13) / 22);
    const lift = recoil * (1 - settle * 0.18);
    return {
      ...base(),
      lean: -8 * lift,
      headTilt: -5.5,
      headTurn: 0.15,
      rootOffset: { x: 0, y: -5 * lift },
      expression: asExpression(requestedExpression, "surprised"),
      legs: {
        left: { thighAngle: 99, shinAngle: 88, footAngle: 151 },
        right: { thighAngle: 82, shinAngle: 93, footAngle: 31 },
      },
      arms: {
        left: armTarget(
          lerpPoint({ x: -53, y: 15 }, { x: -132, y: -242 }, lift),
          -76,
          "open",
          1,
        ),
        right: armTarget(
          lerpPoint({ x: 54, y: 14 }, { x: 131, y: -244 }, lift),
          -84,
          "open",
          -1,
        ),
      },
    };
  }

  if (action === "think" || action === "reconsider") {
    const shake = action === "reconsider" ? Math.sin(seconds * 4.2) * 0.32 : 0;
    return {
      ...base(),
      lean: 5,
      headTilt: 6.5,
      headTurn: 0.12 + shake,
      rootOffset: { x: 0, y: breath * 0.6 },
      expression: asExpression(requestedExpression, "thoughtful"),
      legs: idleLegs(0.8),
      farLimbOpacity: 0.62,
      arms: {
        // A clean hands-on-hips thinking silhouette. The older hand-to-chin
        // solve made the forearm cross the chest at shoulder height.
        left: {
          kind: "angles",
          upperAngle: 112,
          forearmAngle: 60,
          handAngle: 90,
          handShape: "relaxed",
        },
        right: {
          kind: "angles",
          upperAngle: 68,
          forearmAngle: 120,
          handAngle: 90,
          handShape: "relaxed",
        },
      },
    };
  }

  if (action === "celebrate") {
    const bounce = Math.sin(seconds * 2.2 * TAU) * 3;
    return {
      ...base(),
      lean: -5,
      headTilt: -4,
      headTurn: 0,
      rootOffset: { x: 0, y: -8 + bounce },
      expression: asExpression(requestedExpression, "smile"),
      legs: {
        left: { thighAngle: 100, shinAngle: 86, footAngle: 143 },
        right: { thighAngle: 80, shinAngle: 94, footAngle: 37 },
      },
      arms: {
        left: armTarget({ x: -132, y: -248 + bounce }, -72, "open", 1),
        right: armTarget({ x: 132, y: -248 - bounce }, -108, "open", -1),
      },
    };
  }

  if (action === "sleep") {
    return {
      ...base(),
      lean: 24,
      headTilt: 18,
      headTurn: 0.1,
      rootOffset: { x: 0, y: 9 + breath * 0.9 },
      expression: asExpression(requestedExpression, "closed"),
      legs: sittingLegs,
      arms: {
        left: armTarget({ x: 45, y: -17 }, 82, "relaxed", 1),
        right: armTarget({ x: 86, y: -23 }, 88, "relaxed", -1),
      },
    };
  }

  if (action === "turn") {
    return {
      ...base(),
      lean: 0,
      headTilt: -1,
      headTurn: 0,
      rootOffset: { x: 0, y: breath * 0.7 },
      expression: asExpression(requestedExpression, "thoughtful"),
      legs: sideLegs(0.3),
      arms: relaxedArms(sway * 0.5),
    };
  }

  return {
    ...base(),
    lean: 2 + breath * 0.35,
    headTilt: -1 + breath * 0.5,
    headTurn: 0.08,
    rootOffset: { x: 0, y: breath * 1.1 },
    expression: asExpression(requestedExpression, "neutral"),
    legs: idleLegs(sway * 0.6),
    arms: relaxedArms(sway),
  };
};

/** Shared anchors so props meet the character's hands instead of floating nearby. */
export const POSE_ANCHORS = {
  typing: {
    left: { x: 88, y: -78 },
    right: { x: 148, y: -78 },
  },
  sitTyping: {
    left: { x: 52, y: -60 },
    right: { x: 100, y: -60 },
  },
  sitPause: { x: 198, y: -190 },
  sitReact: { right: { x: 104, y: -184 } },
} as const;
