import { AbsoluteFill, interpolate, spring } from "remotion";
import type { CharacterConfig, SceneVisualConfig } from "../../../config/episode.schema";
import type { Palette } from "../../../config/theme";
import { paletteHexWithAlpha } from "../../../config/theme";
import { SPRINGS } from "../../../config/motion";
import { POSE_ANCHORS } from "../../character/poses";

type OfficeEnvironmentProps = {
  palette: Palette;
  frame: number;
  fps: number;
  character: CharacterConfig;
  visual?: SceneVisualConfig;
};

export const OfficeEnvironment: React.FC<OfficeEnvironmentProps> = ({
  palette,
  frame,
  fps,
  character,
  visual,
}) => {
  const scale = character.scale;
  const leftHand = {
    x: character.x + POSE_ANCHORS.typing.left.x * scale,
    y: character.y + POSE_ANCHORS.typing.left.y * scale,
  };
  const rightHand = {
    x: character.x + POSE_ANCHORS.typing.right.x * scale,
    y: character.y + POSE_ANCHORS.typing.right.y * scale,
  };
  const keyboardTop = Math.max(leftHand.y, rightHand.y) + 7;
  const keyboardCenter = (leftHand.x + rightHand.x) / 2 + 58;
  const screenWidth = 330;
  const screenHeight = 210;
  const labels = visual?.labels ?? ["Build", "Reply", "Ship"];
  const glow = spring({ frame, fps, config: SPRINGS.soft });

  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 552,
          top: 700,
          width: 468,
          height: 620,
          borderRadius: 10,
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.72)}`,
          background: `linear-gradient(155deg, ${paletteHexWithAlpha(
            palette.backgroundSecondary,
            0.65,
          )}, ${paletteHexWithAlpha(palette.surface, 0.3)})`,
          overflow: "hidden",
          boxShadow: `inset 0 0 90px ${paletteHexWithAlpha(palette.accent, 0.04)}`,
        }}
      >
        {[0, 1, 2, 3].map((column) => (
          <div
            key={column}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${14 + column * 24}%`,
              width: 18,
              background: paletteHexWithAlpha(palette.background, 0.24),
            }}
          />
        ))}
        {Array.from({ length: 22 }, (_, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              left: 20 + ((index * 61) % 420),
              top: 50 + ((index * 89) % 510),
              width: 3 + (index % 4),
              height: 3 + (index % 4),
              borderRadius: 2,
              backgroundColor: index % 7 === 0 ? palette.accentSecondary : palette.accent,
              opacity: 0.12 + (index % 5) * 0.045,
              filter: "blur(1px)",
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, transparent, ${paletteHexWithAlpha(
              palette.background,
              0.66,
            )})`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: keyboardCenter - screenWidth / 2,
          top: keyboardTop - screenHeight - 25,
          width: screenWidth,
          height: screenHeight,
          borderRadius: "7px 7px 3px 3px",
          backgroundColor: palette.background,
          border: `2px solid ${paletteHexWithAlpha(palette.border, 0.9)}`,
          boxShadow: `0 18px 70px ${paletteHexWithAlpha(palette.accent, 0.16)}`,
          overflow: "hidden",
          transform: "perspective(900px) rotateY(-8deg) rotateX(3deg)",
          transformOrigin: "bottom center",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 12,
            borderRadius: 4,
            background: `linear-gradient(145deg, ${paletteHexWithAlpha(
              palette.surface,
              0.96,
            )}, ${paletteHexWithAlpha(palette.background, 0.96)})`,
            padding: "18px 18px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 18,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 13,
                letterSpacing: "0.16em",
                color: palette.textSecondary,
                fontWeight: 600,
              }}
            >
              {labels[0] ?? "Build"}
            </span>
            <span style={{ display: "flex", gap: 5 }}>
              {[0, 1, 2].map((dot) => (
                <span
                  key={dot}
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    backgroundColor: dot === 0 ? palette.accent : palette.border,
                    opacity: dot === 0 ? 0.9 : 0.5,
                  }}
                />
              ))}
            </span>
          </div>

          {[0, 1, 2, 3, 4].map((line) => {
            const width = 46 + ((line * 37 + 23) % 52);
            const height = line === 4 ? 9 : 5;
            return (
              <div
                key={line}
                style={{
                  width: `${Math.min(100, width + (line === 2 ? 28 : 0))}%`,
                  height,
                  borderRadius: 2,
                  marginBottom: height + 8,
                  backgroundColor:
                    line === 2 ? palette.accent : paletteHexWithAlpha(palette.textSecondary, 0.28),
                  opacity: line === 2 ? 0.76 : 0.5,
                  transform: `scaleX(${interpolate(
                    frame,
                    [line * 5, 24 + line * 8],
                    [0.3, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  )})`,
                  transformOrigin: "left center",
                }}
              />
            );
          })}

          <div
            style={{
              position: "absolute",
              right: 16,
              bottom: 15,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: 7,
            }}
          >
            {labels.slice(1, 3).map((label, index) => (
              <span
                key={label}
                style={{
                  fontSize: 11,
                  color: index === 0 ? palette.accent : palette.textSecondary,
                  fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  opacity: 0.8,
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: keyboardCenter - 205,
          top: keyboardTop,
          width: 410,
          height: 31,
          borderRadius: "4px 4px 8px 8px",
          backgroundColor: palette.surface,
          border: `1.5px solid ${paletteHexWithAlpha(palette.border, 0.86)}`,
          boxShadow: `0 12px 35px rgba(0,0,0,0.28)`,
          transform: "perspective(900px) rotateX(51deg)",
          transformOrigin: "top center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 3,
            padding: "5px 10px",
            opacity: 0.53,
          }}
        >
          {Array.from({ length: 21 }, (_, index) => (
            <span
              key={index}
              style={{
                flex: 1,
                height: 13,
                borderRadius: 2,
                backgroundColor: palette.border,
              }}
            />
          ))}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: keyboardCenter - 265,
          top: keyboardTop + 54,
          width: 530,
          height: 460,
          borderRadius: 8,
          background: `linear-gradient(180deg, ${paletteHexWithAlpha(
            palette.surface,
            0.88,
          )}, ${paletteHexWithAlpha(palette.background, 0.92)})`,
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.52)}`,
          boxShadow: `0 0 100px ${paletteHexWithAlpha(palette.accent, 0.06)}`,
          opacity: 0.82,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: keyboardCenter + 170,
          top: keyboardTop - 52,
          width: 220,
          height: 220,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${paletteHexWithAlpha(palette.accentSecondary, 0.3)}, transparent 68%)`,
          filter: "blur(18px)",
          opacity: 0.55 * glow,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 670,
          top: 920,
          display: "flex",
          flexDirection: "column",
          gap: 9,
          alignItems: "flex-end",
        }}
      >
        {labels.map((label, index) => {
          const enter = spring({
            frame: Math.max(0, frame - 24 - index * 8),
            fps,
            config: SPRINGS.soft,
          });
          return (
            <div
              key={label}
              style={{
                padding: "8px 13px",
                borderRadius: 40,
                border: `1px solid ${paletteHexWithAlpha(palette.border, 0.76)}`,
                backgroundColor: paletteHexWithAlpha(palette.background, 0.48),
                color: index === 0 ? palette.accent : palette.textSecondary,
                fontSize: 14,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontWeight: 600,
                opacity: enter * 0.84,
                transform: `translateX(${interpolate(enter, [0, 1], [16, 0])}px)`,
              }}
            >
              {label}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
