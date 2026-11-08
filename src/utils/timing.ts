import type { Episode, Scene } from "../config/episode.schema";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const secondsToFrames = (seconds: number, fps: number) =>
  Math.round(seconds * fps);

export const framesToSeconds = (frames: number, fps: number) => frames / fps;

export const frameToScene = (scene: Scene, frame: number, fps: number) =>
  frame - secondsToFrames(scene.startSeconds, fps);

export const sceneDurationInFrames = (scene: Scene, fps: number) =>
  Math.max(1, secondsToFrames(scene.durationSeconds, fps));

export const getSceneAtFrame = (episode: Episode, frame: number) => {
  const fps = episode.fps;
  return episode.scenes.find((scene) => {
    const start = secondsToFrames(scene.startSeconds, fps);
    const end = start + sceneDurationInFrames(scene, fps);
    return frame >= start && frame < end;
  });
};

export const normalize = (value: number, inputMin: number, inputMax: number) =>
  inputMax === inputMin ? 0 : clamp((value - inputMin) / (inputMax - inputMin), 0, 1);

export const smoothstep = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

export const interpolateWithEase = (
  frame: number,
  inputRange: [number, number],
  outputRange: [number, number],
) => {
  const t = smoothstep(normalize(frame, inputRange[0], inputRange[1]));
  return outputRange[0] + (outputRange[1] - outputRange[0]) * t;
};
