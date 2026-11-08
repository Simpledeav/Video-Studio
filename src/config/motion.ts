import { Easing, type SpringConfig } from "remotion";

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

export const SPRINGS = {
  settle: { damping: 20, mass: 0.8, stiffness: 120, overshootClamping: false } satisfies SpringConfig,
  soft: { damping: 26, mass: 1, stiffness: 90, overshootClamping: false } satisfies SpringConfig,
  snap: { damping: 16, mass: 0.55, stiffness: 190, overshootClamping: false } satisfies SpringConfig,
} as const;

export const EASINGS = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  enter: Easing.bezier(0.22, 1, 0.36, 1),
  exit: Easing.bezier(0.55, 0, 0.9, 0.4),
} as const;

export const DURATIONS = {
  sceneInFrames: 12,
  headlineFade: 16,
  cameraSettle: 42,
  signatureLine: 22,
} as const;
