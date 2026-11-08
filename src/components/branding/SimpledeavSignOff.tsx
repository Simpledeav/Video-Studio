import { useState } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import {
  BRAND,
  DEFAULT_END_CARD_TEMPLATE,
  type EndCardTemplateId,
} from "../../config/brand";
import { type Palette } from "../../config/theme";
import { END_CARD_TEMPLATE_COMPONENTS } from "./endCardTemplates";

const clamp = (value: number) => Math.min(1, Math.max(0, value));

export const SIGN_OFF_DEFAULTS = {
  /** Minimum on-screen time. The reveal itself is ~1.3s. */
  minimumSeconds: 2.5,
} as const;

type SignOffProps = {
  /** Composition-relative seconds. Ignored when startFrame is supplied. */
  startSeconds?: number;
  /** Scene-local frame to start the reveal. Takes precedence over startSeconds. */
  startFrame?: number;
  /** Optional current-frame override for compositions that already track frames. */
  frame?: number;
  /** Optional fps override paired with `frame`. */
  fps?: number;
  palette?: Palette;
  displayName?: string;
  /** Kept for episode-schema compatibility; templates are logo-only. */
  tag?: string;
  /** Kept for episode-schema compatibility; templates are logo-only. */
  finePrint?: string;
  /** Kept for episode-schema compatibility; templates are logo-only. */
  topLabel?: string;
  /** Skip the avatar for channels that should not show a face. */
  avatarHidden?: boolean;
  /** Skip the black background when the scene is already black. */
  transparentBackground?: boolean;
  /** Kept for backward compatibility; all templates are logo-only. */
  minimal?: boolean;
  /**
   * Which closing-screen template to use. Defaults to
   * `BRAND.defaults.endCardTemplate` (see `src/config/brand.ts`).
   */
  template?: EndCardTemplateId;
};

/**
 * THE CLOSING SCREEN.
 *
 * Five closing-screen templates live in `endCardTemplates.tsx`. Every one
 * renders exactly the avatar image and the bold SIMPLEDEAV wordmark — no label,
 * monogram, handle, tag, URL or fine print.
 *
 * Change the default once in `src/config/brand.ts`, or pass `template` per film.
 * Spec: defaults/brand-signoff.md
 */
export const SimpledeavSignOff: React.FC<SignOffProps> = ({
  startSeconds,
  startFrame,
  frame: frameOverride,
  fps: fpsOverride,
  palette,
  displayName = "SIMPLEDEAV",
  avatarHidden = false,
  transparentBackground = false,
  template,
}) => {
  const currentFrame = useCurrentFrame();
  const config = useVideoConfig();
  const fps = fpsOverride ?? config.fps;
  const wide = config.width > config.height;
  const [avatarOk, setAvatarOk] = useState(true);

  const absoluteFrame = frameOverride ?? currentFrame;
  const start = startFrame ?? Math.round((startSeconds ?? 0) * fps);
  const local = absoluteFrame - start;
  if (local < 0) return null;

  const templateId =
    template ?? BRAND.defaults.endCardTemplate ?? DEFAULT_END_CARD_TEMPLATE;
  const Template = END_CARD_TEMPLATE_COMPONENTS[templateId];

  const accent = palette?.accent ?? BRAND.accent;
  const blackIn = interpolate(local, [0, 0.42 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const markProgress = clamp((local / fps - 0.08) / 0.9);
  const wordProgress = clamp((local / fps - 0.36) / 0.8);
  const settle = spring({
    frame: Math.max(0, local - 4),
    fps,
    config: { damping: 24, mass: 0.9, stiffness: 110 },
  });

  return (
    <AbsoluteFill style={{ opacity: blackIn, zIndex: 40 }}>
      <Template
        displayName={displayName}
        accent={accent}
        wide={wide}
        avatarHidden={avatarHidden}
        avatarOk={avatarOk}
        onAvatarError={() => setAvatarOk(false)}
        localFrame={local}
        fps={fps}
        markProgress={markProgress}
        wordProgress={wordProgress}
        settle={settle}
        transparentBackground={transparentBackground}
      />
    </AbsoluteFill>
  );
};
