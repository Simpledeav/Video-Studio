import type { Palette } from "../../config/theme";
import { SimpledeavSignOff } from "./SimpledeavSignOff";

export type SocialEndCardProps = {
  enabled: boolean;
  signatureEnabled: boolean;
  avatarEnabled: boolean;
  /** Frame relative to the scene in which the reveal starts. */
  startFrame: number;
  frame: number;
  fps: number;
  palette: Palette;
  displayName?: string;
  finePrint?: string;
};

/**
 * Episode adapter for the default Simpledeav closing screen.
 *
 * Every composition (StickmanStory, AIAgentGuardrails, LegoCaseStudy,
 * AirbnbCereal) routes through here or through `SimpledeavSignOff` directly, so
 * the end card is identical across videos. This file only translates the
 * episode schema's frame-based props; the design lives in `SimpledeavSignOff`
 * and is documented in `defaults/brand-signoff.md`.
 */
export const SocialEndCard: React.FC<SocialEndCardProps> = ({
  enabled,
  signatureEnabled,
  avatarEnabled,
  startFrame,
  frame,
  fps,
  palette,
  displayName,
  finePrint,
}) => {
  if (!enabled || !signatureEnabled) return null;

  return (
    <SimpledeavSignOff
      startFrame={startFrame}
      frame={frame}
      fps={fps}
      palette={palette}
      displayName={displayName ?? "SIMPLEDEAV"}
      finePrint={finePrint}
      avatarHidden={!avatarEnabled}
    />
  );
};
