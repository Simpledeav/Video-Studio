import type { CharacterAction, CharacterExpression } from "../../config/episode.schema";
import type { Palette } from "../../config/theme";
import { getCharacterMotion } from "./motion";
import {
  buildSkeleton,
  getGroundY,
  RIG,
  type HandGeometry,
  type Point,
  type Skeleton,
} from "./StickmanRig";

type StickmanProps = {
  action: CharacterAction;
  frame: number;
  fps: number;
  x: number;
  y: number;
  scale: number;
  facing: "front" | "left" | "right";
  expression?: CharacterExpression;
  palette: Palette;
  opacity?: number;
  glow?: boolean;
};

const lineProps = {
  fill: "none",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
};

const polyline = (points: Point[], color: string, width: number, opacity = 1) => (
  <polyline
    points={points.map((point) => `${point.x},${point.y}`).join(" ")}
    stroke={color}
    strokeWidth={width}
    opacity={opacity}
    {...lineProps}
  />
);

const Hand = ({
  hand,
  color,
  accent,
}: {
  hand: HandGeometry;
  color: string;
  accent: string;
}) => {
  const fingerColor = hand.shape === "point" ? accent : color;
  return (
    <g {...lineProps}>
      <line
        x1={hand.wrist.x}
        y1={hand.wrist.y}
        x2={hand.tip.x}
        y2={hand.tip.y}
        stroke={color}
        strokeWidth={7.2}
      />
      <line
        x1={hand.thumb.from.x}
        y1={hand.thumb.from.y}
        x2={hand.thumb.to.x}
        y2={hand.thumb.to.y}
        stroke={color}
        strokeWidth={3.4}
      />
      {hand.fingers.map((finger, index) => (
        <line
          key={index}
          x1={finger.from.x}
          y1={finger.from.y}
          x2={finger.to.x}
          y2={finger.to.y}
          stroke={fingerColor}
          strokeWidth={hand.shape === "point" && index === 0 ? 3.6 : 3}
        />
      ))}
    </g>
  );
};

const Foot = ({ skeleton, side, color }: { skeleton: Skeleton; side: "left" | "right"; color: string }) => {
  const foot = side === "left" ? skeleton.footLeft : skeleton.footRight;
  return (
    <g {...lineProps}>
      <line
        x1={foot.ankle.x}
        y1={foot.ankle.y}
        x2={foot.heel.x}
        y2={foot.heel.y}
        stroke={color}
        strokeWidth={6.5}
      />
      <line
        x1={foot.ankle.x}
        y1={foot.ankle.y}
        x2={foot.toe.x}
        y2={foot.toe.y}
        stroke={color}
        strokeWidth={7}
      />
    </g>
  );
};

const Face = ({
  skeleton,
  expression,
  color,
  accent,
  headTilt,
  headTurn,
}: {
  skeleton: Skeleton;
  expression: string;
  color: string;
  accent: string;
  headTilt: number;
  headTurn: number;
}) => {
  const { headCenter, headRadius } = skeleton;
  const look = headTurn * 7;
  const eyeY = headCenter.y - headRadius * 0.12 + (expression === "thoughtful" ? 2 : 0);
  const leftEyeX = headCenter.x - 15 + look;
  const rightEyeX = headCenter.x + 15 + look;
  const eyeStyle = { stroke: color, strokeWidth: 2.8, strokeLinecap: "round" as const, fill: "none" };
  const mouthY = headCenter.y + headRadius * 0.38;

  return (
    <g transform={`rotate(${headTilt} ${headCenter.x} ${headCenter.y})`}>
      {expression === "surprised" ? (
        <>
          <circle cx={leftEyeX} cy={eyeY} r={4.1} {...eyeStyle} />
          <circle cx={rightEyeX} cy={eyeY} r={4.1} {...eyeStyle} />
        </>
      ) : expression === "closed" ? (
        <>
          <path d={`M ${leftEyeX - 5} ${eyeY} Q ${leftEyeX} ${eyeY + 3} ${leftEyeX + 5} ${eyeY}`} {...eyeStyle} />
          <path d={`M ${rightEyeX - 5} ${eyeY} Q ${rightEyeX} ${eyeY + 3} ${rightEyeX + 5} ${eyeY}`} {...eyeStyle} />
        </>
      ) : expression === "focused" || expression === "concerned" ? (
        <>
          <path d={`M ${leftEyeX - 5} ${eyeY + 1} L ${leftEyeX + 4} ${eyeY - 2}`} {...eyeStyle} />
          <path d={`M ${rightEyeX - 4} ${eyeY - 2} L ${rightEyeX + 5} ${eyeY + 1}`} {...eyeStyle} />
        </>
      ) : expression === "thoughtful" ? (
        <>
          <circle cx={leftEyeX} cy={eyeY} r={2.2} fill={color} />
          <path d={`M ${rightEyeX - 4} ${eyeY} L ${rightEyeX + 4} ${eyeY}`} {...eyeStyle} />
        </>
      ) : (
        <>
          <circle cx={leftEyeX} cy={eyeY} r={2.4} fill={color} />
          <circle cx={rightEyeX} cy={eyeY} r={2.4} fill={color} />
        </>
      )}

      {expression === "smile" ? (
        <path d={`M ${headCenter.x - 7 + look} ${mouthY} Q ${headCenter.x + look} ${mouthY + 8} ${headCenter.x + 7 + look} ${mouthY}`} {...eyeStyle} />
      ) : expression === "surprised" ? (
        <circle cx={headCenter.x + look} cy={mouthY + 2} r={2.8} {...eyeStyle} />
      ) : expression === "concerned" ? (
        <path d={`M ${headCenter.x - 6 + look} ${mouthY + 3} Q ${headCenter.x + look} ${mouthY - 2} ${headCenter.x + 6 + look} ${mouthY + 3}`} {...eyeStyle} />
      ) : (
        <path d={`M ${headCenter.x - 5 + look} ${mouthY + 2} L ${headCenter.x + 5 + look} ${mouthY + 2}`} {...eyeStyle} />
      )}

      <path
        d={`M ${headCenter.x - headRadius * 0.55} ${headCenter.y - headRadius * 0.58} Q ${headCenter.x - headRadius * 0.2} ${headCenter.y - headRadius * 0.82} ${headCenter.x + headRadius * 0.2} ${headCenter.y - headRadius * 0.72}`}
        fill="none"
        stroke={accent}
        strokeWidth={2.2}
        strokeLinecap="round"
        opacity={0.5}
      />
    </g>
  );
};

export const Stickman: React.FC<StickmanProps> = ({
  action,
  frame,
  fps,
  x,
  y,
  scale,
  facing,
  expression,
  palette,
  opacity = 1,
  glow = true,
}) => {
  const { pose, scaleX, bodyRotation } = getCharacterMotion({
    action,
    frame,
    fps,
    facing,
    expression,
  });
  const skeleton = buildSkeleton(pose);
  const groundY = getGroundY(skeleton) + 5;
  const color = palette.characterLine;
  const accent = palette.accent;
  const farOpacity = pose.farLimbOpacity ?? 0.7;
  const strokeWidth = 7;

  return (
    <svg
      width={1080}
      height={1920}
      viewBox="0 0 1080 1920"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      <g
        transform={`translate(${x} ${y}) scale(${scaleX * scale} ${scale}) rotate(${bodyRotation})`}
        opacity={opacity}
        style={{
          filter: glow
            ? `drop-shadow(4px 8px 7px rgba(0,0,0,0.26)) drop-shadow(0 0 18px ${palette.glow})`
            : "drop-shadow(4px 8px 7px rgba(0,0,0,0.26))",
        }}
      >
        <ellipse cx={0} cy={groundY} rx={86} ry={13} fill="#000" opacity={0.18} />
        <ellipse cx={0} cy={groundY} rx={54} ry={8} fill="#000" opacity={0.2} />

        <g opacity={farOpacity}>
          {polyline(
            [skeleton.shoulderLeft, skeleton.elbowLeft, skeleton.wristLeft],
            color,
            strokeWidth,
          )}
          <Hand hand={skeleton.handLeft} color={color} accent={accent} />
          {polyline([skeleton.hipLeft, skeleton.kneeLeft, skeleton.ankleLeft], color, strokeWidth)}
          <Foot skeleton={skeleton} side="left" color={color} />
        </g>

        {polyline([skeleton.hipLeft, skeleton.hipRight], color, strokeWidth * 0.82)}
        {polyline([skeleton.pelvis, skeleton.chest], color, strokeWidth)}
        {polyline([skeleton.shoulderLeft, skeleton.shoulderRight], color, strokeWidth * 0.9)}
        {polyline([skeleton.chest, skeleton.neck], color, strokeWidth * 0.95)}

        <circle cx={skeleton.pelvis.x} cy={skeleton.pelvis.y} r={4.4} fill={color} />
        <circle cx={skeleton.shoulderLeft.x} cy={skeleton.shoulderLeft.y} r={3.7} fill={color} />
        <circle cx={skeleton.shoulderRight.x} cy={skeleton.shoulderRight.y} r={3.7} fill={color} />
        <circle cx={skeleton.hipLeft.x} cy={skeleton.hipLeft.y} r={3.4} fill={color} />
        <circle cx={skeleton.hipRight.x} cy={skeleton.hipRight.y} r={3.4} fill={color} />

        {polyline([skeleton.hipRight, skeleton.kneeRight, skeleton.ankleRight], color, strokeWidth)}
        <Foot skeleton={skeleton} side="right" color={color} />

        {polyline(
          [skeleton.shoulderRight, skeleton.elbowRight, skeleton.wristRight],
          color,
          strokeWidth,
        )}
        <Hand hand={skeleton.handRight} color={color} accent={accent} />

        <circle
          cx={skeleton.headCenter.x}
          cy={skeleton.headCenter.y}
          r={RIG.headRadius}
          fill={palette.characterFill}
          fillOpacity={0.72}
          stroke={color}
          strokeWidth={strokeWidth}
        />
        <Face
          skeleton={skeleton}
          expression={pose.expression}
          color={color}
          accent={accent}
          headTilt={pose.headTilt}
          headTurn={pose.headTurn}
        />
      </g>
    </svg>
  );
};
