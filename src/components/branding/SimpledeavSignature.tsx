/**
 * LEGACY inline signature.
 *
 * Do not use for new episodes. The approved closing screen is
 * `SimpledeavSignOff` (see `defaults/brand-signoff.md`). This component is kept
 * only so older compositions remain reproducible.
 */
import { useState } from "react";
import { Img, interpolate, spring, staticFile } from "remotion";
import { BRAND, type SignatureTreatment } from "../../config/brand";
import { SPRINGS } from "../../config/motion";
import { paletteHexWithAlpha, type Palette } from "../../config/theme";
import { normalizePublicAssetPath } from "../../utils/assetValidation";

type SimpledeavSignatureProps = {
  enabled: boolean;
  signatureEnabled: boolean;
  avatarEnabled: boolean;
  treatment: SignatureTreatment;
  revealDurationSeconds: number;
  /** Frame relative to the scene in which the reveal starts. */
  startFrame: number;
  frame: number;
  fps: number;
  palette: Palette;
  style?: React.CSSProperties;
};

const clamped = (value: number) => Math.min(1, Math.max(0, value));

const MonogramMark = ({
  progress,
  palette,
  size = 68,
}: {
  progress: number;
  palette: Palette;
  size?: number;
}) => {
  const draw = (delay: number) => clamped((progress - delay) / 0.52);
  const stroke = palette.textPrimary;
  const accent = palette.accent;
  const strokeWidth = BRAND.monogram.strokeWidth;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    >
      <path
        d="M 15 61 C 15 36 33 16 60 16 C 84 16 101 30 106 53"
        stroke={accent}
        strokeWidth={BRAND.monogram.strokeWidth * 0.41}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw(0)}
        opacity={0.8}
      />
      <path
        d="M 57 34 C 45 25 27 31 27 45 C 27 58 57 52 56 68 C 55 81 36 83 25 72"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw(0.08)}
      />
      <path
        d="M 81 27 L 81 78"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw(0.2)}
      />
      <path
        d="M 81 78 C 102 72 102 42 81 37"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw(0.3)}
      />
      <path
        d="M 74 27 L 87 27"
        stroke={stroke}
        strokeWidth={BRAND.monogram.strokeWidth * 0.56}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw(0.4)}
      />
      <circle
        cx={106}
        cy={57}
        r={4}
        fill={accent}
        opacity={draw(0.44)}
        style={{ transformOrigin: "106px 57px", transform: `scale(${0.4 + draw(0.44) * 0.6})` }}
      />
    </svg>
  );
};

const Avatar = ({
  palette,
  visible,
  size = 58,
}: {
  palette: Palette;
  visible: number;
  size?: number;
}) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        padding: 3,
        border: `1px solid ${paletteHexWithAlpha(palette.accent, 0.6)}`,
        opacity: visible,
        transform: `scale(${0.82 + visible * 0.18})`,
        boxShadow: `0 0 28px ${paletteHexWithAlpha(palette.accent, 0.18)}`,
        flexShrink: 0,
      }}
    >
      <Img
        src={staticFile(normalizePublicAssetPath(BRAND.avatarPath).replace(/^\//, ""))}
        onError={() => setFailed(true)}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>
  );
};

export const SimpledeavSignature: React.FC<SimpledeavSignatureProps> = ({
  enabled,
  signatureEnabled,
  avatarEnabled,
  treatment,
  revealDurationSeconds,
  startFrame,
  frame,
  fps,
  palette,
  style,
}) => {
  if (!enabled || !signatureEnabled) return null;
  const local = frame - startFrame;
  if (local < 0) return null;

  const durationFrames = Math.max(12, Math.round(revealDurationSeconds * fps));
  const progress = clamped(local / durationFrames);
  const settle = spring({
    frame: Math.max(0, local - 2),
    fps,
    config: SPRINGS.settle,
  });
  const lineProgress = interpolate(progress, [0, 0.62], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const wordmarkOpacity = interpolate(progress, [0.18, 0.5], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const avatarOpacity = interpolate(progress, [0.04, 0.32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const showMark = treatment !== "avatar";
  const showAvatar = avatarEnabled && treatment !== "monogram";
  const wordmarkSize = showAvatar && showMark ? 25 : showMark ? 28 : 29;
  const markSize = showAvatar ? BRAND.monogram.markSize * 0.72 : BRAND.monogram.markSize;

  return (
    <div
      style={{
        position: "absolute",
        left: 120,
        right: 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        opacity: interpolate(progress, [0, 0.12], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: showAvatar && showMark ? 18 : 14,
          transform: `translateY(${interpolate(settle, [0, 1], [14, 0])}px)`,
        }}
      >
        {showAvatar ? <Avatar palette={palette} visible={avatarOpacity} /> : null}
        {showAvatar && showMark ? (
          <span
            style={{
              width: 1,
              height: 42,
              backgroundColor: paletteHexWithAlpha(palette.border, 0.72),
              opacity: wordmarkOpacity,
            }}
          />
        ) : null}
        {showMark ? <MonogramMark progress={progress} palette={palette} size={markSize} /> : null}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: 5,
            opacity: wordmarkOpacity,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontWeight: 600,
              fontSize: wordmarkSize,
              letterSpacing: `${BRAND.monogram.wordmarkTracking * (1 + (1 - progress) * 0.4)}em`,
              color: palette.textPrimary,
              lineHeight: 1,
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textShadow: palette.isDark ? "0 2px 18px rgba(0,0,0,0.55)" : "none",
            }}
          >
            {BRAND.monogram.wordmark}
          </span>
          <span
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.22em",
              color: palette.textSecondary,
              lineHeight: 1.2,
            }}
          >
            {BRAND.handle}
          </span>
        </div>
      </div>

      <div
        style={{
          marginTop: 22,
          width: 440 * lineProgress,
          maxWidth: "76%",
          height: 1,
          background: `linear-gradient(90deg, transparent, ${paletteHexWithAlpha(
            palette.accent,
            0.8,
          )}, transparent)`,
          opacity: 0.72,
        }}
      />
    </div>
  );
};
