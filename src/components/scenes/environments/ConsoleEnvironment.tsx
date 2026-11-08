import { AbsoluteFill, Img, interpolate, spring, staticFile } from "remotion";
import type {
  CharacterConfig,
  SceneVisualConfig,
} from "../../../config/episode.schema";
import { SPRINGS } from "../../../config/motion";
import { paletteHexWithAlpha, type Palette } from "../../../config/theme";
import { POSE_ANCHORS } from "../../character/poses";

type ConsoleEnvironmentProps = {
  palette: Palette;
  frame: number;
  fps: number;
  character: CharacterConfig;
  visual?: SceneVisualConfig;
};

const SCREEN = { left: 452, top: 824, width: 514, height: 440 } as const;

const MiniLabel: React.FC<{
  children: React.ReactNode;
  palette: Palette;
  color?: string;
  size?: number;
}> = ({ children, palette, color, size = 13 }) => (
  <div
    style={{
      fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
      fontSize: size,
      lineHeight: 1.15,
      fontWeight: 700,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: color ?? palette.textSecondary,
    }}
  >
    {children}
  </div>
);

const Check: React.FC<{ palette: Palette; color?: string; size?: number }> = ({
  palette,
  color,
  size = 20,
}) => (
  <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
    <circle
      cx="10"
      cy="10"
      r="8.4"
      fill={paletteHexWithAlpha(color ?? palette.positive, 0.12)}
      stroke={color ?? palette.positive}
      strokeWidth="1.1"
    />
    <path
      d="M 5.7 10.2 L 8.5 13 L 14.2 7"
      fill="none"
      stroke={color ?? palette.positive}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Row: React.FC<{
  label: string;
  palette: Palette;
  done?: boolean;
  color?: string;
  detail?: string;
  delay?: number;
  frame: number;
  fps: number;
}> = ({
  label,
  palette,
  done = false,
  color,
  detail,
  delay = 0,
  frame,
  fps,
}) => {
  const reveal = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: SPRINGS.soft,
  });
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        padding: "10px 0",
        borderBottom: `1px solid ${paletteHexWithAlpha(palette.border, 0.52)}`,
        opacity: reveal,
        transform: `translateY(${interpolate(reveal, [0, 1], [7, 0])}px)`,
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}
      >
        {done ? (
          <Check palette={palette} color={color} size={19} />
        ) : (
          <span
            style={{
              width: 19,
              height: 19,
              borderRadius: 10,
              border: `1px solid ${paletteHexWithAlpha(color ?? palette.border, 0.8)}`,
              flexShrink: 0,
            }}
          />
        )}
        <span
          style={{
            fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
            fontSize: 18,
            lineHeight: 1.1,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: done
              ? palette.textPrimary
              : (color ?? palette.textSecondary),
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {label}
        </span>
      </div>
      {detail ? (
        <span
          style={{
            fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
            fontSize: 11,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: color ?? palette.textSecondary,
            opacity: 0.7,
            whiteSpace: "nowrap",
          }}
        >
          {detail}
        </span>
      ) : null}
    </div>
  );
};

const ScreenHeader: React.FC<{
  title: string;
  time: string;
  palette: Palette;
  color?: string;
}> = ({ title, time, palette, color }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      paddingBottom: 14,
      borderBottom: `1px solid ${paletteHexWithAlpha(palette.border, 0.66)}`,
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 9,
          background: color ?? palette.accent,
          boxShadow: `0 0 14px ${paletteHexWithAlpha(color ?? palette.accent, 0.8)}`,
        }}
      />
      <MiniLabel
        palette={palette}
        color={color ?? palette.textPrimary}
        size={12}
      >
        {title}
      </MiniLabel>
    </div>
    <span
      style={{
        fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.16em",
        color: palette.textSecondary,
        opacity: 0.72,
      }}
    >
      {time}
    </span>
  </div>
);

const ActivationScreen: React.FC<{
  palette: Palette;
  frame: number;
  visual?: SceneVisualConfig;
}> = ({ palette, frame, visual }) => {
  const labels = visual?.labels ?? ["Orders", "Offers", "FAQs", "Checkout"];
  const orb = 1 + Math.sin(frame / 19) * 0.025;
  return (
    <>
      <ScreenHeader title="Agent" time="08:00" palette={palette} />
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 24,
        }}
      >
        <div
          style={{
            width: 126,
            height: 126,
            borderRadius: "50%",
            border: `1px solid ${paletteHexWithAlpha(palette.accent, 0.55)}`,
            background: `radial-gradient(circle at 40% 35%, ${paletteHexWithAlpha(
              palette.accent,
              0.36,
            )}, ${paletteHexWithAlpha(palette.background, 0.14)} 63%, transparent 70%)`,
            boxShadow: `0 0 52px ${paletteHexWithAlpha(palette.accent, 0.25)}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${orb})`,
          }}
        >
          <div
            style={{
              width: 45,
              height: 45,
              borderRadius: "50%",
              background: `radial-gradient(circle at 38% 32%, ${palette.textPrimary}, ${palette.accent} 46%, ${paletteHexWithAlpha(palette.accent, 0.18)} 76%)`,
              boxShadow: `0 0 28px ${paletteHexWithAlpha(palette.accent, 0.7)}`,
            }}
          />
        </div>
        <div style={{ marginTop: 18, textAlign: "center" }}>
          <div
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: "-0.04em",
              color: palette.textPrimary,
            }}
          >
            READY TO WORK
          </div>
          <div
            style={{
              marginTop: 5,
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              color: palette.positive,
              textTransform: "uppercase",
            }}
          >
            Context loaded
          </div>
        </div>
        <div
          style={{
            marginTop: 22,
            display: "flex",
            gap: 7,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {labels.slice(0, 4).map((label, index) => {
            const reveal = spring({
              frame: Math.max(0, frame - 20 - index * 6),
              fps: 30,
              config: SPRINGS.soft,
            });
            return (
              <span
                key={label}
                style={{
                  fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: palette.textSecondary,
                  border: `1px solid ${paletteHexWithAlpha(palette.border, 0.8)}`,
                  padding: "7px 9px",
                  borderRadius: 30,
                  opacity: reveal * 0.9,
                }}
              >
                {label}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

const MissionScreen: React.FC<{
  palette: Palette;
  frame: number;
  visual?: SceneVisualConfig;
}> = ({ palette, frame, visual }) => {
  const labels = visual?.labels ?? ["Increase sales", "Control costs"];
  return (
    <>
      <ScreenHeader title="Mission" time="08:00" palette={palette} />
      <div style={{ paddingTop: 24 }}>
        <MiniLabel palette={palette} color={palette.accent} size={11}>
          Assigned by Maya
        </MiniLabel>
        <div style={{ marginTop: 17 }}>
          <Row
            label={labels[0]}
            detail="Primary"
            palette={palette}
            done
            delay={14}
            frame={frame}
            fps={30}
          />
          <Row
            label={labels[1]}
            detail="Constraint"
            palette={palette}
            done
            delay={22}
            frame={frame}
            fps={30}
          />
        </div>
        <div
          style={{
            marginTop: 22,
            padding: "14px 16px",
            border: `1px solid ${paletteHexWithAlpha(palette.accent, 0.25)}`,
            borderRadius: 9,
            background: paletteHexWithAlpha(palette.accent, 0.055),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 13,
              color: palette.textSecondary,
              lineHeight: 1.3,
            }}
          >
            One day. No cost increase.
          </span>
          <span
            style={{
              width: 38,
              height: 2,
              background: palette.accent,
              boxShadow: `0 0 12px ${paletteHexWithAlpha(palette.accent, 0.8)}`,
            }}
          />
        </div>
      </div>
    </>
  );
};

const DashboardScreen: React.FC<{ palette: Palette; frame: number }> = ({
  palette,
  frame,
}) => {
  const draw = interpolate(frame, [18, 96], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 0.65 + Math.sin(frame / 16) * 0.2;
  return (
    <>
      <ScreenHeader
        title="Live"
        time="12:00"
        palette={palette}
        color={palette.positive}
      />
      <div style={{ paddingTop: 19 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <MiniLabel palette={palette} size={11}>
            Conversions
          </MiniLabel>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.12em",
              color: palette.positive,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 6,
                background: palette.positive,
                opacity: pulse,
                boxShadow: `0 0 10px ${paletteHexWithAlpha(palette.positive, 0.8)}`,
              }}
            />
            RISING
          </span>
        </div>
        <div
          style={{
            marginTop: 9,
            height: 126,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            viewBox="0 0 440 126"
            width="100%"
            height="126"
            style={{ overflow: "visible" }}
          >
            <defs>
              <linearGradient id="sd-console-area" x1="0" x2="0" y1="0" y2="1">
                <stop
                  offset="0"
                  stopColor={palette.positive}
                  stopOpacity="0.28"
                />
                <stop offset="1" stopColor={palette.positive} stopOpacity="0" />
              </linearGradient>
            </defs>
            {[26, 62, 98].map((y) => (
              <line
                key={y}
                x1="0"
                x2="440"
                y1={y}
                y2={y}
                stroke={paletteHexWithAlpha(palette.border, 0.4)}
                strokeWidth="1"
              />
            ))}
            <path
              d="M 0 104 C 65 101 82 87 128 90 C 176 93 188 66 226 70 C 264 74 274 48 316 53 C 358 58 375 23 440 18 L 440 126 L 0 126 Z"
              fill="url(#sd-console-area)"
              opacity={draw}
            />
            <path
              d="M 0 104 C 65 101 82 87 128 90 C 176 93 188 66 226 70 C 264 74 274 48 316 53 C 358 58 375 23 440 18"
              fill="none"
              stroke={palette.positive}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="560"
              strokeDashoffset={560 * (1 - draw)}
              style={{
                filter: `drop-shadow(0 0 7px ${paletteHexWithAlpha(palette.positive, 0.6)})`,
              }}
            />
            <circle
              cx="440"
              cy="18"
              r="4"
              fill={palette.positive}
              opacity={draw}
            />
          </svg>
        </div>
        <div
          style={{
            marginTop: 12,
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 9,
          }}
        >
          {["Checkout / active", "Margin / stable"].map((line, index) => (
            <div
              key={line}
              style={{
                border: `1px solid ${paletteHexWithAlpha(palette.border, 0.6)}`,
                background: paletteHexWithAlpha(palette.surface, 0.45),
                borderRadius: 8,
                padding: "10px 11px",
              }}
            >
              <MiniLabel
                palette={palette}
                color={index === 1 ? palette.positive : palette.textSecondary}
                size={9}
              >
                {line.split(" / ")[0]}
              </MiniLabel>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: palette.textPrimary,
                }}
              >
                {line.split(" / ")[1]}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const RiskScreen: React.FC<{
  palette: Palette;
  frame: number;
  visual?: SceneVisualConfig;
}> = ({ palette, frame, visual }) => {
  const labels = visual?.labels ?? ["Discount", "Margin", "Promise"];
  const riskIn = spring({
    frame: Math.max(0, frame - 16),
    fps: 30,
    config: SPRINGS.soft,
  });
  const promiseIn = spring({
    frame: Math.max(0, frame - 250),
    fps: 30,
    config: SPRINGS.soft,
  });
  return (
    <>
      <ScreenHeader
        title="Campaign draft"
        time="12:00"
        palette={palette}
        color={palette.warning}
      />
      <div style={{ paddingTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div>
            <MiniLabel palette={palette} color={palette.warning} size={10}>
              {labels[0]}
            </MiniLabel>
            <div
              style={{
                marginTop: 3,
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 34,
                lineHeight: 0.95,
                letterSpacing: "-0.06em",
                fontWeight: 650,
                color: palette.textPrimary,
              }}
            >
              EVERY
              <br />
              CUSTOMER
            </div>
          </div>
          <div
            style={{
              padding: "7px 9px",
              borderRadius: 5,
              border: `1px solid ${paletteHexWithAlpha(palette.warning, 0.55)}`,
              background: paletteHexWithAlpha(palette.warning, 0.1),
              color: palette.warning,
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 10,
              fontWeight: 800,
              letterSpacing: "0.12em",
            }}
          >
            ALL
          </div>
        </div>
        <div style={{ marginTop: 16 }}>
          <div
            style={{
              height: 3,
              background: paletteHexWithAlpha(palette.warning, 0.22),
              borderRadius: 3,
            }}
          >
            <div
              style={{
                width: "86%",
                height: 3,
                background: palette.warning,
                borderRadius: 3,
                boxShadow: `0 0 12px ${paletteHexWithAlpha(palette.warning, 0.6)}`,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 6,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <MiniLabel palette={palette} size={9}>
              Discount
            </MiniLabel>
            <span
              style={{
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 11,
                fontWeight: 700,
                color: palette.warning,
              }}
            >
              TOO BROAD
            </span>
          </div>
        </div>
        <div
          style={{
            marginTop: 18,
            padding: "12px 13px",
            borderRadius: 8,
            border: `1px solid ${paletteHexWithAlpha(palette.warning, 0.5)}`,
            background: `linear-gradient(120deg, ${paletteHexWithAlpha(palette.warning, 0.14)}, ${paletteHexWithAlpha(palette.warning, 0.03)})`,
            opacity: riskIn,
            transform: `translateY(${interpolate(riskIn, [0, 1], [9, 0])}px)`,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <MiniLabel palette={palette} color={palette.warning} size={10}>
              {labels[1]}
            </MiniLabel>
            <span
              style={{
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: palette.warning,
              }}
            >
              AT RISK
            </span>
          </div>
          <div
            style={{
              marginTop: 7,
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 14,
              lineHeight: 1.3,
              color: palette.textSecondary,
            }}
          >
            The margin can collapse before the win is real.
          </div>
        </div>
        <div
          style={{
            marginTop: 9,
            padding: "11px 13px",
            borderRadius: 8,
            border: `1px solid ${paletteHexWithAlpha(palette.warning, 0.34)}`,
            background: paletteHexWithAlpha(palette.background, 0.35),
            opacity: promiseIn,
            transform: `translateY(${interpolate(promiseIn, [0, 1], [9, 0])}px)`,
          }}
        >
          <div
            style={{ display: "flex", justifyContent: "space-between", gap: 8 }}
          >
            <MiniLabel palette={palette} color={palette.warning} size={10}>
              {labels[2]}
            </MiniLabel>
            <span
              style={{
                fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.1em",
                color: palette.warning,
              }}
            >
              UNVERIFIED
            </span>
          </div>
          <div
            style={{
              marginTop: 6,
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 13,
              lineHeight: 1.3,
              color: palette.textSecondary,
            }}
          >
            A public promise the business cannot keep.
          </div>
        </div>
      </div>
    </>
  );
};

const PauseScreen: React.FC<{
  palette: Palette;
  frame: number;
  fps: number;
  character: CharacterConfig;
}> = ({ palette, frame, fps, character }) => {
  const pauseX = character.x + POSE_ANCHORS.sitPause.x * character.scale;
  const pauseY = character.y + POSE_ANCHORS.sitPause.y * character.scale;
  const pressFrame = Math.round(fps * 0.55);
  const pressed = frame >= pressFrame;
  const buttonIn = spring({
    frame: Math.max(0, frame - 3),
    fps,
    config: SPRINGS.settle,
  });
  return (
    <>
      <ScreenHeader
        title={pressed ? "Campaign paused" : "Campaign ready"}
        time="12:00"
        palette={palette}
        color={pressed ? palette.positive : palette.warning}
      />
      <div style={{ paddingTop: 20, paddingLeft: 112, paddingRight: 8 }}>
        <MiniLabel
          palette={palette}
          color={pressed ? palette.positive : palette.warning}
          size={10}
        >
          {pressed ? "Held before publish" : "Ready to publish"}
        </MiniLabel>
        <div
          style={{
            marginTop: 6,
            fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
            fontSize: 33,
            lineHeight: 0.98,
            fontWeight: 650,
            letterSpacing: "-0.055em",
            color: palette.textPrimary,
          }}
        >
          EVERY
          <br />
          CUSTOMER
        </div>
        <div style={{ marginTop: 17 }}>
          <Row
            label="Public promise"
            detail="Unverified"
            palette={palette}
            color={palette.warning}
            frame={frame}
            fps={fps}
            delay={0}
          />
          <Row
            label="Margin"
            detail="At risk"
            palette={palette}
            color={palette.warning}
            frame={frame}
            fps={fps}
            delay={4}
          />
        </div>
        <div
          style={{
            marginTop: 16,
            fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
            fontSize: 12,
            lineHeight: 1.35,
            color: pressed ? palette.positive : palette.textSecondary,
          }}
        >
          {pressed
            ? "The campaign is on hold. Nothing was sent."
            : "One action still sits between a draft and the public."}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: pauseX - SCREEN.left - 48,
          top: pauseY - SCREEN.top - 48,
          width: 96,
          height: 96,
          borderRadius: "50%",
          border: `1px solid ${paletteHexWithAlpha(pressed ? palette.positive : palette.warning, 0.62)}`,
          background: `radial-gradient(circle, ${paletteHexWithAlpha(pressed ? palette.positive : palette.warning, 0.2)}, ${paletteHexWithAlpha(palette.background, 0.6)})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${buttonIn * (pressed ? 0.94 : 1)})`,
          boxShadow: `0 0 30px ${paletteHexWithAlpha(pressed ? palette.positive : palette.warning, pressed ? 0.2 : 0.26)}`,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <span
            style={{
              width: 7,
              height: 26,
              borderRadius: 3,
              background: pressed ? palette.positive : palette.warning,
            }}
          />
          <span
            style={{
              width: 7,
              height: 26,
              borderRadius: 3,
              background: pressed ? palette.positive : palette.warning,
            }}
          />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: pauseX - SCREEN.left - 51,
          top: pauseY - SCREEN.top + 57,
          width: 102,
          textAlign: "center",
          fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
          fontSize: 11,
          fontWeight: 800,
          letterSpacing: "0.16em",
          color: pressed ? palette.positive : palette.warning,
          opacity: 0.8,
        }}
      >
        {pressed ? "PAUSED" : "HOLD"}
      </div>
    </>
  );
};

const ObjectiveScreen: React.FC<{
  palette: Palette;
  frame: number;
  visual?: SceneVisualConfig;
}> = ({ palette, frame, visual }) => {
  const labels = visual?.labels ?? ["Profit", "Inventory", "Approval"];
  const rowReveal = (index: number) =>
    spring({
      frame: Math.max(0, frame - 8 - index * 7),
      fps: 30,
      config: SPRINGS.soft,
    });
  return (
    <>
      <ScreenHeader
        title="Objective review"
        time="12:00"
        palette={palette}
        color={palette.warning}
      />
      <div style={{ paddingTop: 19 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <Check palette={palette} size={20} />
          <div
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 23,
              fontWeight: 650,
              letterSpacing: "-0.04em",
              color: palette.textPrimary,
            }}
          >
            INCREASE SALES
          </div>
        </div>
        <div
          style={{
            marginTop: 15,
            padding: "12px 13px",
            borderRadius: 8,
            border: `1px solid ${paletteHexWithAlpha(palette.warning, 0.3)}`,
            background: paletteHexWithAlpha(palette.warning, 0.055),
          }}
        >
          <MiniLabel palette={palette} color={palette.warning} size={10}>
            Not specified
          </MiniLabel>
          <div style={{ marginTop: 8 }}>
            {labels.slice(0, 3).map((label, index) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "7px 0",
                  borderBottom:
                    index < 2
                      ? `1px solid ${paletteHexWithAlpha(palette.border, 0.45)}`
                      : undefined,
                  opacity: rowReveal(index),
                  transform: `translateY(${interpolate(rowReveal(index), [0, 1], [6, 0])}px)`,
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                    fontSize: 14,
                    fontWeight: 600,
                    color: palette.textPrimary,
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.12em",
                    color: palette.warning,
                  }}
                >
                  MISSING
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const OperationsScreen: React.FC<{
  palette: Palette;
  frame: number;
  visual?: SceneVisualConfig;
}> = ({ palette, frame, visual }) => {
  const labels = visual?.labels ?? ["Research", "Draft", "Recommend"];
  return (
    <>
      <ScreenHeader
        title="Operations"
        time="17:30"
        palette={palette}
        color={palette.positive}
      />
      <div style={{ paddingTop: 18 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <MiniLabel palette={palette} color={palette.positive} size={10}>
            Controlled
          </MiniLabel>
          <span
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.1em",
              color: palette.textSecondary,
            }}
          >
            AUDIT ON
          </span>
        </div>
        <div
          style={{
            marginTop: 4,
            fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
            fontSize: 30,
            lineHeight: 1,
            letterSpacing: "-0.05em",
            fontWeight: 650,
            color: palette.textPrimary,
          }}
        >
          USEFUL.
          <br />
          BOUNDED.
        </div>
        <div style={{ marginTop: 16 }}>
          {labels.slice(0, 3).map((label, index) => (
            <Row
              key={label}
              label={label}
              palette={palette}
              done
              delay={8 + index * 8}
              frame={frame}
              fps={30}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            padding: "11px 12px",
            border: `1px solid ${paletteHexWithAlpha(palette.accent, 0.34)}`,
            borderRadius: 7,
            background: paletteHexWithAlpha(palette.accent, 0.06),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 14,
              fontWeight: 600,
              color: palette.textPrimary,
            }}
          >
            Publish
          </span>
          <span
            style={{
              fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
              fontSize: 9,
              fontWeight: 800,
              letterSpacing: "0.12em",
              color: palette.accent,
            }}
          >
            APPROVAL
          </span>
        </div>
      </div>
    </>
  );
};

const ScreenBody: React.FC<{
  mode: NonNullable<SceneVisualConfig["consoleMode"]>;
  palette: Palette;
  frame: number;
  fps: number;
  character: CharacterConfig;
  visual?: SceneVisualConfig;
}> = ({ mode, palette, frame, fps, character, visual }) => {
  switch (mode) {
    case "mission":
      return <MissionScreen palette={palette} frame={frame} visual={visual} />;
    case "dashboard":
      return <DashboardScreen palette={palette} frame={frame} />;
    case "risk":
      return <RiskScreen palette={palette} frame={frame} visual={visual} />;
    case "pause":
      return (
        <PauseScreen
          palette={palette}
          frame={frame}
          fps={fps}
          character={character}
        />
      );
    case "objective":
      return (
        <ObjectiveScreen palette={palette} frame={frame} visual={visual} />
      );
    case "operations":
      return (
        <OperationsScreen palette={palette} frame={frame} visual={visual} />
      );
    case "activation":
    default:
      return (
        <ActivationScreen palette={palette} frame={frame} visual={visual} />
      );
  }
};

export const ConsoleEnvironment: React.FC<ConsoleEnvironmentProps> = ({
  palette,
  frame,
  fps,
  character,
  visual,
}) => {
  const mode = visual?.consoleMode ?? "activation";
  return (
    <AbsoluteFill style={{ pointerEvents: "none", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(168deg, ${paletteHexWithAlpha(palette.background, 0.3)} 0%, ${paletteHexWithAlpha(palette.backgroundSecondary, 0.44)} 46%, ${paletteHexWithAlpha(palette.background, 0.82)} 100%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 54,
          top: 262,
          width: 365,
          height: 730,
          borderRadius: 4,
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.54)}`,
          overflow: "hidden",
          opacity: 0.56,
          boxShadow: `inset 0 0 80px rgba(0,0,0,0.55), 0 0 40px ${paletteHexWithAlpha(palette.accent, 0.05)}`,
        }}
      >
        <Img
          src={staticFile("images/city-fog.jpg")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter:
              "brightness(0.42) contrast(1.14) saturate(0.58) hue-rotate(18deg)",
            transform: "scale(1.06)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${paletteHexWithAlpha(palette.background, 0.1)}, ${paletteHexWithAlpha(palette.background, 0.6)})`,
          }}
        />
        {[0.34, 0.67].map((left) => (
          <div
            key={left}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${left * 100}%`,
              width: 1,
              background: paletteHexWithAlpha(palette.textPrimary, 0.13),
            }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "52%",
            height: 1,
            background: paletteHexWithAlpha(palette.textPrimary, 0.13),
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 196,
          top: 1200,
          width: 218,
          height: 350,
          borderRadius: "96px 96px 18px 18px",
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.62)}`,
          background: `linear-gradient(155deg, ${paletteHexWithAlpha(palette.surface, 0.34)}, ${paletteHexWithAlpha(palette.background, 0.95)})`,
          opacity: 0.78,
          boxShadow: `inset 0 1px 0 ${paletteHexWithAlpha(palette.textPrimary, 0.08)}, 0 18px 40px rgba(0,0,0,0.3)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 18,
            right: 18,
            top: 16,
            height: 2,
            borderRadius: 2,
            background: `linear-gradient(90deg, transparent, ${paletteHexWithAlpha(palette.accent, 0.38)}, transparent)`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 15,
            right: 15,
            bottom: 26,
            height: 120,
            borderRadius: "18px 18px 8px 8px",
            background: `linear-gradient(180deg, ${paletteHexWithAlpha(palette.surface, 0.34)}, transparent)`,
            borderTop: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.06)}`,
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 338,
          top: 1258,
          width: 680,
          height: 120,
          background: `radial-gradient(ellipse at 33% 42%, ${paletteHexWithAlpha(palette.accent, 0.09)}, transparent 66%)`,
          filter: "blur(14px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: SCREEN.left - 18,
          top: SCREEN.top - 18,
          width: SCREEN.width + 36,
          height: SCREEN.height + 78,
          borderRadius: 20,
          background: `radial-gradient(ellipse at 40% 38%, ${paletteHexWithAlpha(palette.accent, 0.2)}, transparent 68%)`,
          filter: "blur(24px)",
          opacity: 0.72,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: SCREEN.left,
          top: SCREEN.top,
          width: SCREEN.width,
          height: SCREEN.height,
          borderRadius: 12,
          background: `linear-gradient(145deg, ${paletteHexWithAlpha(palette.surface, 0.98)}, ${paletteHexWithAlpha(palette.background, 0.98)})`,
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.78)}`,
          boxShadow: `0 34px 90px rgba(0,0,0,0.52), inset 0 1px 0 ${paletteHexWithAlpha(palette.textPrimary, 0.07)}, 0 0 70px ${paletteHexWithAlpha(palette.accent, 0.07)}`,
          overflow: "hidden",
          padding: "19px 22px 20px",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(126deg, ${paletteHexWithAlpha(palette.textPrimary, 0.035)} 0%, transparent 31%, transparent 70%, ${paletteHexWithAlpha(palette.accent, 0.035)} 100%)`,
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", zIndex: 1 }}>
          <ScreenBody
            mode={mode}
            palette={palette}
            frame={frame}
            fps={fps}
            character={character}
            visual={visual}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 1,
            background: paletteHexWithAlpha(palette.border, 0.4),
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: SCREEN.left - 10,
          top: SCREEN.top + SCREEN.height + 5,
          width: SCREEN.width + 20,
          height: 24,
          borderRadius: 5,
          background: `linear-gradient(180deg, ${paletteHexWithAlpha(palette.surface, 0.9)}, ${paletteHexWithAlpha(palette.background, 0.98)})`,
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.5)}`,
          transform: "perspective(900px) rotateX(38deg)",
          transformOrigin: "top center",
          opacity: 0.78,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 292,
          top: 1314,
          width: 670,
          height: 78,
          borderRadius: 7,
          background: `linear-gradient(168deg, ${paletteHexWithAlpha(palette.surface, 0.98)}, ${paletteHexWithAlpha(palette.background, 0.99)})`,
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.7)}`,
          transform: "perspective(900px) rotateX(42deg)",
          transformOrigin: "top center",
          boxShadow: "0 16px 34px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
          opacity: 0.96,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 22,
            right: 22,
            top: 12,
            bottom: 30,
            backgroundImage: `repeating-linear-gradient(90deg, ${paletteHexWithAlpha(palette.textPrimary, 0.18)} 0 22px, transparent 22px 28px), repeating-linear-gradient(0deg, ${paletteHexWithAlpha(palette.textPrimary, 0.12)} 0 1px, transparent 1px 10px)`,
            opacity: 0.7,
            borderRadius: 3,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 196,
            top: 35,
            width: 122,
            height: 11,
            borderRadius: 3,
            border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.14)}`,
            opacity: 0.6,
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          left: 952,
          top: 1268,
          width: 64,
          height: 78,
          borderRadius: "8px 8px 12px 12px",
          border: `1px solid ${paletteHexWithAlpha(palette.border, 0.7)}`,
          background: `linear-gradient(165deg, ${paletteHexWithAlpha(palette.surface, 0.95)}, ${paletteHexWithAlpha(palette.background, 0.98)})`,
          boxShadow: "0 14px 28px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 10,
            top: 10,
            right: 10,
            height: 7,
            borderRadius: 4,
            background: paletteHexWithAlpha(palette.accent, 0.19),
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 121,
          top: 1552,
          width: 640,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${paletteHexWithAlpha(palette.accent, 0.28)}, transparent)`,
          opacity: 0.44,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 862,
          top: 812,
          width: 118,
          height: 118,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${paletteHexWithAlpha(palette.accent, 0.1)}, transparent 70%)`,
          filter: "blur(12px)",
        }}
      />
    </AbsoluteFill>
  );
};
