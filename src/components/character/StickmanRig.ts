/**
 * Connected stickman geometry.
 *
 * Every limb is solved from a joint chain with fixed segment lengths. Hands are
 * never positioned independently: they always begin at the solved wrist. Object
 * interactions can give the rig a target, and the arm is solved backwards so the
 * palm lands on that target.
 */

export type Point = { x: number; y: number };

export type HandShape = "relaxed" | "open" | "point" | "hold" | "type";

export type ExpressionName =
  | "neutral"
  | "focused"
  | "surprised"
  | "thoughtful"
  | "smile"
  | "concerned"
  | "closed";

type ArmAngles = {
  kind: "angles";
  upperAngle: number;
  forearmAngle: number;
  handAngle: number;
  handShape: HandShape;
};

type ArmTarget = {
  kind: "target";
  /** Where the palm/hand anchor should land, in rig-local pixels. */
  target: Point;
  handAngle: number;
  handShape: HandShape;
  bend?: 1 | -1;
};

export type ArmPose = ArmAngles | ArmTarget;

export type LegPose = {
  thighAngle: number;
  shinAngle: number;
  footAngle: number;
};

export type RigPose = {
  lean: number;
  headTilt: number;
  headTurn: number;
  rootOffset: Point;
  arms: { left: ArmPose; right: ArmPose };
  legs: { left: LegPose; right: LegPose };
  expression: ExpressionName;
  farLimbOpacity?: number;
};

export const RIG = {
  torsoLength: 150,
  neckLength: 19,
  headRadius: 48,
  shoulderWidth: 82,
  hipWidth: 46,
  upperArm: 92,
  forearm: 84,
  hand: 16,
  thumb: 9,
  pointingFinger: 27,
  thigh: 112,
  shin: 106,
  foot: 37,
  heel: 10,
} as const;

const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

export const pointFrom = (origin: Point, angleDegrees: number, length: number): Point => {
  const radians = degToRad(angleDegrees);
  return {
    x: origin.x + Math.cos(radians) * length,
    y: origin.y + Math.sin(radians) * length,
  };
};

export const distance = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const solveTwoBone = (
  origin: Point,
  target: Point,
  upperLength: number,
  lowerLength: number,
  bend: 1 | -1,
) => {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  const rawDistance = Math.hypot(dx, dy);
  const minReach = Math.abs(upperLength - lowerLength) + 0.001;
  const maxReach = upperLength + lowerLength - 0.001;
  const solvedDistance = clamp(rawDistance, minReach, maxReach);
  const direction = rawDistance === 0 ? { x: 1, y: 0 } : { x: dx / rawDistance, y: dy / rawDistance };
  const along = (upperLength * upperLength - lowerLength * lowerLength + solvedDistance * solvedDistance) /
    (2 * solvedDistance);
  const height = Math.sqrt(Math.max(0, upperLength * upperLength - along * along));
  const perpendicular = { x: -direction.y * bend, y: direction.x * bend };
  const elbow = {
    x: origin.x + direction.x * along + perpendicular.x * height,
    y: origin.y + direction.y * along + perpendicular.y * height,
  };
  const wrist = {
    x: origin.x + direction.x * solvedDistance,
    y: origin.y + direction.y * solvedDistance,
  };
  return { elbow, wrist, reachable: rawDistance <= maxReach + 0.01 };
};

export type HandGeometry = {
  wrist: Point;
  palm: Point;
  tip: Point;
  handAngle: number;
  shape: HandShape;
  fingers: Array<{ from: Point; to: Point }>;
  thumb: { from: Point; to: Point };
};

export type FootGeometry = {
  ankle: Point;
  heel: Point;
  toe: Point;
  footAngle: number;
};

export type Skeleton = {
  pelvis: Point;
  chest: Point;
  neck: Point;
  headCenter: Point;
  headRadius: number;
  shoulderLeft: Point;
  shoulderRight: Point;
  hipLeft: Point;
  hipRight: Point;
  elbowLeft: Point;
  elbowRight: Point;
  wristLeft: Point;
  wristRight: Point;
  handLeft: HandGeometry;
  handRight: HandGeometry;
  kneeLeft: Point;
  kneeRight: Point;
  ankleLeft: Point;
  ankleRight: Point;
  footLeft: FootGeometry;
  footRight: FootGeometry;
  toeLeft: Point;
  toeRight: Point;
};

const buildHand = (
  wrist: Point,
  handAngle: number,
  shape: HandShape,
  mirrored: boolean,
): HandGeometry => {
  const side = mirrored ? -1 : 1;
  const palm = pointFrom(wrist, handAngle, RIG.hand * 0.55);
  const tip = pointFrom(wrist, handAngle, RIG.hand);
  const normal = handAngle + 90 * side;
  const fingers: Array<{ from: Point; to: Point }> = [];
  const thumb = {
    from: pointFrom(wrist, handAngle, RIG.hand * 0.42),
    to: pointFrom(pointFrom(wrist, handAngle, RIG.hand * 0.45), normal, RIG.thumb),
  };

  if (shape === "open") {
    for (const spread of [-25, 0, 25]) {
      fingers.push({
        from: tip,
        to: pointFrom(tip, handAngle + spread, 17),
      });
    }
  } else if (shape === "point") {
    fingers.push({
      from: tip,
      to: pointFrom(tip, handAngle, RIG.pointingFinger),
    });
    fingers.push({
      from: pointFrom(wrist, handAngle, RIG.hand * 0.8),
      to: pointFrom(tip, handAngle + 65 * side, 10),
    });
  } else if (shape === "type") {
    for (const spread of [-2, 5, 12]) {
      fingers.push({
        from: tip,
        to: pointFrom(tip, handAngle + spread, 10),
      });
    }
  } else if (shape === "hold") {
    fingers.push({
      from: tip,
      to: pointFrom(tip, handAngle + 70 * side, 13),
    });
    fingers.push({
      from: tip,
      to: pointFrom(tip, handAngle - 35 * side, 9),
    });
  } else {
    fingers.push({
      from: tip,
      to: pointFrom(tip, handAngle + 75 * side, 8),
    });
  }

  return { wrist, palm, tip, handAngle, shape, fingers, thumb };
};

const buildArm = (
  shoulder: Point,
  pose: ArmPose,
  mirrored: boolean,
): { elbow: Point; wrist: Point; hand: HandGeometry } => {
  if (pose.kind === "target") {
    const bend = pose.bend ?? (mirrored ? -1 : 1);
    const handVector = pointFrom({ x: 0, y: 0 }, pose.handAngle, RIG.hand);
    const wristTarget = {
      x: pose.target.x - handVector.x,
      y: pose.target.y - handVector.y,
    };
    const solved = solveTwoBone(shoulder, wristTarget, RIG.upperArm, RIG.forearm, bend);
    const hand = buildHand(solved.wrist, pose.handAngle, pose.handShape, mirrored);
    // The IK clamps unreachable targets. We keep the palm on the solved chain,
    // not floating at the requested point.
    return { elbow: solved.elbow, wrist: solved.wrist, hand };
  }

  const elbow = pointFrom(shoulder, pose.upperAngle, RIG.upperArm);
  const wrist = pointFrom(elbow, pose.forearmAngle, RIG.forearm);
  const hand = buildHand(wrist, pose.handAngle, pose.handShape, mirrored);
  return { elbow, wrist, hand };
};

export const buildSkeleton = (pose: RigPose): Skeleton => {
  const root = pose.rootOffset;
  const pelvis = { x: root.x, y: root.y };
  const torsoAngle = -90 + pose.lean;
  const chest = pointFrom(pelvis, torsoAngle, RIG.torsoLength - 7);
  const neck = pointFrom(chest, torsoAngle, RIG.neckLength);
  const headCenter = pointFrom(neck, torsoAngle + pose.headTilt, RIG.headRadius + 1);
  const shoulderAxis = torsoAngle + 90;
  const hipAxis = torsoAngle + 90;

  const shoulderLeft = pointFrom(chest, shoulderAxis + 180, RIG.shoulderWidth / 2);
  const shoulderRight = pointFrom(chest, shoulderAxis, RIG.shoulderWidth / 2);
  const hipLeft = pointFrom(pelvis, hipAxis + 180, RIG.hipWidth / 2);
  const hipRight = pointFrom(pelvis, hipAxis, RIG.hipWidth / 2);

  const armLeft = buildArm(shoulderLeft, pose.arms.left, true);
  const armRight = buildArm(shoulderRight, pose.arms.right, false);

  const kneeLeft = pointFrom(hipLeft, pose.legs.left.thighAngle, RIG.thigh);
  const kneeRight = pointFrom(hipRight, pose.legs.right.thighAngle, RIG.thigh);
  const ankleLeft = pointFrom(kneeLeft, pose.legs.left.shinAngle, RIG.shin);
  const ankleRight = pointFrom(kneeRight, pose.legs.right.shinAngle, RIG.shin);
  const toeLeft = pointFrom(ankleLeft, pose.legs.left.footAngle, RIG.foot);
  const toeRight = pointFrom(ankleRight, pose.legs.right.footAngle, RIG.foot);
  const heelLeft = pointFrom(ankleLeft, pose.legs.left.footAngle + 180, RIG.heel);
  const heelRight = pointFrom(ankleRight, pose.legs.right.footAngle + 180, RIG.heel);

  return {
    pelvis,
    chest,
    neck,
    headCenter,
    headRadius: RIG.headRadius,
    shoulderLeft,
    shoulderRight,
    hipLeft,
    hipRight,
    elbowLeft: armLeft.elbow,
    elbowRight: armRight.elbow,
    wristLeft: armLeft.wrist,
    wristRight: armRight.wrist,
    handLeft: armLeft.hand,
    handRight: armRight.hand,
    kneeLeft,
    kneeRight,
    ankleLeft,
    ankleRight,
    footLeft: {
      ankle: ankleLeft,
      heel: heelLeft,
      toe: toeLeft,
      footAngle: pose.legs.left.footAngle,
    },
    footRight: {
      ankle: ankleRight,
      heel: heelRight,
      toe: toeRight,
      footAngle: pose.legs.right.footAngle,
    },
    toeLeft,
    toeRight,
  };
};

export const getHandAnchor = (skeleton: Skeleton, side: "left" | "right"): Point =>
  side === "left" ? skeleton.handLeft.tip : skeleton.handRight.tip;

export const getGroundY = (skeleton: Skeleton): number =>
  Math.max(skeleton.footLeft.toe.y, skeleton.footLeft.heel.y, skeleton.footRight.toe.y, skeleton.footRight.heel.y);
