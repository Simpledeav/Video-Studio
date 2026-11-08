import type { CSSProperties, ReactNode } from "react";
import type { CameraConfig } from "../../config/episode.schema";
import { EASINGS } from "../../config/motion";

type CameraMotionProps = {
  camera: CameraConfig;
  frame: number;
  durationInFrames: number;
  children: ReactNode;
};

export const CameraMotion: React.FC<CameraMotionProps> = ({
  camera,
  frame,
  durationInFrames,
  children,
}) => {
  const duration = Math.max(1, durationInFrames - 1);
  const progress = Math.min(1, Math.max(0, frame / duration));
  const eased = EASINGS.inOut(progress);
  const amount = Math.max(0, Math.min(0.12, camera.intensity));
  let transform = "translate3d(0,0,0) scale(1)";
  let origin = "center center";

  if (camera.motion === "pushIn") {
    transform = `translate3d(0, ${-eased * amount * 38}px, 0) scale(${1 + eased * amount})`;
  } else if (camera.motion === "pullOut") {
    transform = `translate3d(0, ${eased * amount * 22}px, 0) scale(${1 + amount - eased * amount})`;
  } else if (camera.motion === "panLeft") {
    transform = `translate3d(${-eased * amount * 210}px, 0, 0) scale(${1 + amount * 0.55})`;
  } else if (camera.motion === "panRight") {
    transform = `translate3d(${eased * amount * 210}px, 0, 0) scale(${1 + amount * 0.55})`;
  } else if (camera.motion === "drift") {
    const sway = Math.sin(eased * Math.PI) * amount * 34;
    transform = `translate3d(${sway}px, ${-eased * amount * 28}px, 0) scale(${1 + eased * amount * 0.62})`;
    origin = "52% 42%";
  }

  const style: CSSProperties = {
    position: "absolute",
    inset: 0,
    transform,
    transformOrigin: origin,
    willChange: "transform",
  };

  return <div style={style}>{children}</div>;
};
