import { AbsoluteFill, Img, interpolate, spring, staticFile } from "remotion";
import type { DocumentaryMode, SceneVisualConfig } from "../../config/episode.schema";
import { paletteHexWithAlpha, type Palette } from "../../config/theme";
import { Brick, BrickTower } from "./Brick";

type Props = {
  mode: DocumentaryMode;
  palette: Palette;
  frame: number;
  fps: number;
  visual?: SceneVisualConfig;
};

const font = 'var(--sd-font, "Poppins", sans-serif)';
const Label: React.FC<{
  children: React.ReactNode;
  palette: Palette;
  color?: string;
  size?: number;
  style?: React.CSSProperties;
}> = ({ children, palette, color, size = 13, style }) => (
  <div
    style={{
      fontFamily: font,
      fontSize: size,
      fontWeight: 500,
      letterSpacing: "0.17em",
      lineHeight: 1.25,
      textTransform: "uppercase",
      color: color ?? palette.textSecondary,
      ...style,
    }}
  >
    {children}
  </div>
);

const Tag: React.FC<{
  children: React.ReactNode;
  palette: Palette;
  color?: string;
  style?: React.CSSProperties;
}> = ({ children, palette, color, style }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "8px 12px",
      border: `1px solid ${paletteHexWithAlpha(palette.border, 0.82)}`,
      borderRadius: 3,
      background: paletteHexWithAlpha(palette.background, 0.58),
      fontFamily: font,
      fontSize: 12,
      fontWeight: 500,
      letterSpacing: "0.13em",
      textTransform: "uppercase",
      color: color ?? palette.textPrimary,
      ...style,
    }}
  >
    {children}
  </div>
);

const Paper: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      position: "absolute",
      background: "#F4F1E9",
      color: "#171717",
      boxShadow: "0 30px 80px rgba(0,0,0,0.38), 0 2px 0 rgba(255,255,255,0.45) inset",
      borderRadius: 3,
      overflow: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

const Hook: React.FC<Props> = ({ palette, frame }) => {
  const enter = spring({ frame, fps: 30, config: { damping: 24, stiffness: 90, mass: 0.9 } });
  const sweep = interpolate(frame, [12, 88], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fade = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 120,
          top: 620,
          width: 850,
          height: 900,
          background: `radial-gradient(ellipse at 50% 46%, ${paletteHexWithAlpha(palette.accentSecondary, 0.12)}, transparent 60%)`,
          filter: "blur(24px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 86,
          top: 650,
          width: 760,
          opacity: fade * (0.6 + enter * 0.4),
          transform: `translateY(${interpolate(enter, [0, 1], [42, 0])}px) scale(${interpolate(enter, [0, 1], [0.9, 1])})`,
        }}
      >
        <Brick color={palette.accent} width={660} sweep={sweep} rotate={-2.5} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 160,
          top: 1390,
          width: 520,
          height: 1,
          background: `linear-gradient(90deg, ${paletteHexWithAlpha(palette.accentSecondary, 0.5)}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Crisis: React.FC<Props> = ({ palette, frame }) => {
  const enter = spring({ frame: Math.max(0, frame - 8), fps: 30, config: { damping: 26, stiffness: 90 } });
  const loss = interpolate(frame, [24, 66], [0, 1.931], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line = interpolate(frame, [44, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <Paper
        style={{
          left: 72,
          top: 666,
          width: 592,
          minHeight: 430,
          opacity: enter,
          transform: `translateY(${interpolate(enter, [0, 1], [28, 0])}px)`,
        }}
      >
        <div style={{ padding: "30px 34px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Label palette={palette} color="#6D665D" size={11}>
              Financial report
            </Label>
            <span style={{ fontFamily: font, fontSize: 12, fontWeight: 600, color: "#8B8175" }}>2004</span>
          </div>
          <div
            style={{
              marginTop: 30,
              fontFamily: font,
              fontSize: 74,
              lineHeight: 0.94,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              color: "#171717",
            }}
          >
            {loss.toFixed(3)}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: font,
              fontSize: 17,
              lineHeight: 1.2,
              fontWeight: 600,
              letterSpacing: "0.13em",
              color: "#D62828",
            }}
          >
            DKK BILLION LOSS
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{ width: 22, height: 2, background: "#D62828" }} />
            <span style={{ fontFamily: font, fontSize: 15, color: "#6D665D" }}>LEGO Group net loss</span>
          </div>
          <svg viewBox="0 0 520 80" width="100%" height="80" style={{ marginTop: 24 }}>
            <line x1="0" x2="520" y1="66" y2="66" stroke="#D8D0C4" strokeWidth="1" />
            <line x1="0" x2="520" y1="36" y2="36" stroke="#E6DFD2" strokeWidth="1" strokeDasharray="3 4" />
            <path
              d="M 0 20 C 70 24 105 31 160 33 C 218 35 245 44 300 48 C 360 52 407 57 520 69"
              fill="none"
              stroke="#D62828"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeDasharray="540"
              strokeDashoffset={540 * (1 - line)}
            />
          </svg>
          <div style={{ marginTop: 3, fontFamily: font, fontSize: 11, letterSpacing: "0.12em", color: "#9A8F80" }}>
            A BUSINESS THAT HAD BECOME TOO COMPLICATED
          </div>
        </div>
      </Paper>

      <div
        style={{
          position: "absolute",
          right: 58,
          top: 728,
          width: 318,
          height: 218,
          borderRadius: 2,
          overflow: "hidden",
          border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.18)}`,
          boxShadow: "0 24px 50px rgba(0,0,0,0.4)",
          opacity: interpolate(frame, [16, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateX(${interpolate(frame, [16, 34], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        <Img
          src={staticFile("images/lego/factory.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.68) saturate(0.7)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.7), transparent 65%)" }} />
        <div style={{ position: "absolute", left: 14, bottom: 14 }}>
          <Label palette={palette} color="#F4F1E9" size={10}>
            Manufacturing / archives
          </Label>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 1118,
          width: 592,
          height: 1,
          background: `linear-gradient(90deg, ${paletteHexWithAlpha(palette.accent, 0.5)}, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Complexity: React.FC<Props> = ({ palette, frame, fps }) => {
  const tags = ["Products", "Packaging", "Licensing", "Retail", "Costs", "SKUs"];
  const positions = [
    { left: 70, top: 690 },
    { left: 760, top: 710 },
    { left: 54, top: 890 },
    { left: 738, top: 918 },
    { left: 84, top: 1094 },
    { left: 752, top: 1110 },
  ];
  const central = interpolate(frame, [42, 120], [0.9, 0.34], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 250,
          top: 760,
          width: 580,
          opacity: central,
          transform: `scale(${interpolate(frame, [0, 110], [1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })})`,
        }}
      >
        <Brick color={palette.accentSecondary} width={520} sweep={0.4} rotate={3} />
      </div>
      {tags.map((tag, index) => {
        const enter = spring({ frame: Math.max(0, frame - 8 - index * 7), fps, config: { damping: 22, stiffness: 95 } });
        return (
          <div
            key={tag}
            style={{
              position: "absolute",
              left: positions[index].left,
              top: positions[index].top,
              opacity: enter * 0.92,
              transform: `translateY(${interpolate(enter, [0, 1], [18, 0])}px)`,
            }}
          >
            <Tag palette={palette}>{tag}</Tag>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 318,
          top: 626,
          width: 455,
          borderTop: `1px solid ${paletteHexWithAlpha(palette.accentSecondary, 0.35)}`,
          opacity: 0.7,
        }}
      />
      <div style={{ position: "absolute", left: 80, top: 600 }}>
        <Tag palette={palette} color={palette.accentSecondary}>More products.</Tag>
      </div>
      <div style={{ position: "absolute", left: 690, top: 600 }}>
        <Tag palette={palette} color={palette.accentSecondary}>More complexity.</Tag>
      </div>
    </AbsoluteFill>
  );
};

const Turning: React.FC<Props> = ({ palette, frame, fps }) => {
  const docIn = spring({ frame: Math.max(0, frame - 72), fps, config: { damping: 24, stiffness: 90 } });
  const brickIn = spring({ frame: Math.max(0, frame - 24), fps, config: { damping: 26, stiffness: 100 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", background: `linear-gradient(180deg, ${palette.background} 0%, ${palette.backgroundSecondary} 56%, #0E0C0B 100%)` }}>
      {/* window with the existing city texture, used as an original documentary set */}
      <div
        style={{
          position: "absolute",
          left: 58,
          top: 380,
          width: 520,
          height: 570,
          border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.16)}`,
          background: "#0B0B0B",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          overflow: "hidden",
          opacity: 0.85,
        }}
      >
        <Img
          src={staticFile("images/city-fog.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.42) saturate(0.55) sepia(0.18)", transform: "scale(1.06)" }}
        />
        {[0.34, 0.68].map((left) => (
          <div key={left} style={{ position: "absolute", top: 0, bottom: 0, left: `${left * 100}%`, width: 1, background: "rgba(244,241,233,0.12)" }} />
        ))}
        <div style={{ position: "absolute", left: 0, right: 0, top: "48%", height: 1, background: "rgba(244,241,233,0.1)" }} />
      </div>

      {/* table */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 280,
          height: 260,
          background: "linear-gradient(180deg, #2B211C 0%, #17110E 100%)",
          boxShadow: "0 -24px 50px rgba(0,0,0,0.3), inset 0 1px 0 rgba(244,241,233,0.1)",
        }}
      />

      {/* non-identifying executive silhouette, intentionally unlit and without facial features */}
      <div
        style={{
          position: "absolute",
          right: 132,
          top: 582,
          width: 250,
          height: 500,
          opacity: 0.8,
          filter: "blur(0.4px)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 77,
            top: 18,
            width: 96,
            height: 114,
            borderRadius: "48% 48% 42% 42%",
            background: "linear-gradient(120deg, #070706, #17130F 55%, #2B2118)",
            borderLeft: `1px solid ${paletteHexWithAlpha(palette.accentSecondary, 0.2)}`,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 30,
            top: 132,
            width: 190,
            height: 280,
            borderRadius: "46% 46% 14% 14%",
            background: "linear-gradient(110deg, #060606, #15110E 58%, #251B15)",
            clipPath: "polygon(24% 0, 76% 0, 100% 100%, 0 100%)",
            borderLeft: `1px solid ${paletteHexWithAlpha(palette.accentSecondary, 0.16)}`,
          }}
        />
      </div>

      {/* paper and a single brick on the table */}
      <Paper
        style={{
          left: 160,
          top: 1020,
          width: 398,
          height: 256,
          opacity: docIn,
          transform: `translateY(${interpolate(docIn, [0, 1], [30, 0])}px) rotate(-1.2deg)`,
        }}
      >
        <div style={{ padding: "20px 24px" }}>
          <Label palette={palette} color="#80766B" size={10}>2004 / BOARD NOTE</Label>
          <div style={{ marginTop: 18, fontFamily: font, fontSize: 34, lineHeight: 1, fontWeight: 700, letterSpacing: "-0.04em" }}>
            A NEW CEO.
          </div>
          <div style={{ marginTop: 10, fontFamily: font, fontSize: 15, lineHeight: 1.35, color: "#6D665D" }}>
            Make the business stronger — not bigger in every direction.
          </div>
          <div style={{ marginTop: 17, display: "flex", gap: 6 }}>
            {["FOCUS", "SIMPLIFY", "RECONNECT"].map((label) => (
              <span key={label} style={{ fontFamily: font, fontSize: 8, letterSpacing: "0.12em", border: "1px solid #D8D0C4", padding: "5px 6px", color: "#6D665D" }}>{label}</span>
            ))}
          </div>
        </div>
      </Paper>
      <div
        style={{
          position: "absolute",
          left: 598,
          top: 1074,
          width: 312,
          opacity: brickIn,
          transform: `translateY(${interpolate(brickIn, [0, 1], [28, 0])}px)`,
        }}
      >
        <Brick color={palette.accent} width={300} sweep={0.46} rotate={-7} />
      </div>
      <div style={{ position: "absolute", right: 80, top: 1110, width: 190, textAlign: "right" }}>
        <Label palette={palette} color={palette.textSecondary} size={9} style={{ opacity: 0.7 }}>
          Illustrative re-creation
        </Label>
      </div>
    </AbsoluteFill>
  );
};

const Strategy: React.FC<Props> = ({ palette, frame, fps, visual }) => {
  const labels = visual?.labels ?? ["Simplify", "Focus", "Reconnect"];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 678,
          width: 570,
          padding: "20px 26px 18px",
          borderLeft: `2px solid ${palette.accentSecondary}`,
          background: `linear-gradient(90deg, ${paletteHexWithAlpha(palette.background, 0.82)}, transparent)`,
        }}
      >
        <Label palette={palette} color={palette.accentSecondary} size={11}>The reset</Label>
        <div style={{ marginTop: 12 }}>
          {labels.slice(0, 3).map((label, index) => {
            const enter = spring({ frame: Math.max(0, frame - 24 - index * 36), fps, config: { damping: 24, stiffness: 86 } });
            return (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 17,
                  padding: "13px 0",
                  borderBottom: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.15)}`,
                  opacity: enter,
                  transform: `translateX(${interpolate(enter, [0, 1], [-20, 0])}px)`,
                }}
              >
                <span style={{ fontFamily: font, fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", color: palette.accentSecondary, width: 24 }}>
                  0{index + 1}
                </span>
                <span style={{ fontFamily: font, fontSize: 34, lineHeight: 1, fontWeight: 600, letterSpacing: "-0.04em", color: palette.textPrimary }}>
                  {label.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 56,
          top: 690,
          width: 380,
          height: 218,
          border: `1px solid ${paletteHexWithAlpha(palette.textPrimary, 0.17)}`,
          overflow: "hidden",
          opacity: interpolate(frame, [100, 126], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <Img
          src={staticFile("images/lego/factory.jpg")}
          style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.78) saturate(0.75)" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(0deg, rgba(0,0,0,0.72), transparent 65%)" }} />
        <div style={{ position: "absolute", left: 14, bottom: 14 }}>
          <Label palette={palette} color="#F4F1E9" size={10}>Production / simplified</Label>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 78,
          top: 1000,
          width: 330,
          opacity: interpolate(frame, [124, 152], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          transform: `translateY(${interpolate(frame, [124, 152], [26, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}
      >
        <Brick color={palette.accent} width={330} sweep={0.52} rotate={3} />
      </div>
      <div style={{ position: "absolute", right: 74, top: 1376, width: 330, textAlign: "right" }}>
        <Label palette={palette} color={palette.accentSecondary} size={11}>Back to the brick</Label>
      </div>
    </AbsoluteFill>
  );
};

const Comeback: React.FC<Props> = ({ palette, frame, fps }) => {
  const revenue = interpolate(frame, [34, 92], [0, 35.8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line = interpolate(frame, [24, 114], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const warm = spring({ frame: Math.max(0, frame - 6), fps, config: { damping: 26, stiffness: 82 } });
  return (
    <AbsoluteFill style={{ pointerEvents: "none", background: `radial-gradient(ellipse at 33% 48%, ${paletteHexWithAlpha(palette.accentSecondary, 0.09)}, transparent 55%)` }}>
      <div
        style={{
          position: "absolute",
          left: 36,
          top: 650,
          opacity: warm,
          transform: `translateY(${interpolate(warm, [0, 1], [30, 0])}px)`,
        }}
      >
        <BrickTower
          paletteAccent={palette.accent}
          accentSecondary={palette.accentSecondary}
          ivory={palette.textPrimary}
          frame={frame}
          fps={fps}
        />
      </div>
      <div
        style={{
          position: "absolute",
          right: 54,
          top: 704,
          width: 406,
          borderTop: `1px solid ${paletteHexWithAlpha(palette.accentSecondary, 0.5)}`,
          paddingTop: 18,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Label palette={palette} color={palette.accentSecondary} size={11}>2015</Label>
          <Label palette={palette} color={palette.textSecondary} size={10}>Revenue</Label>
        </div>
        <div style={{ marginTop: 13, fontFamily: font, fontSize: 63, lineHeight: 1, fontWeight: 600, letterSpacing: "-0.06em", color: palette.textPrimary }}>
          {revenue.toFixed(1)}
        </div>
        <div style={{ marginTop: 8, fontFamily: font, fontSize: 13, fontWeight: 500, letterSpacing: "0.14em", color: palette.accentSecondary }}>
          DKK BILLION
        </div>
        <svg viewBox="0 0 380 122" width="100%" height="122" style={{ marginTop: 18 }}>
          <defs>
            <linearGradient id="comeback-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor={palette.accentSecondary} stopOpacity="0.28" />
              <stop offset="1" stopColor={palette.accentSecondary} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[32, 68, 102].map((y) => (
            <line key={y} x1="0" x2="380" y1={y} y2={y} stroke={paletteHexWithAlpha(palette.textPrimary, 0.16)} strokeWidth="1" />
          ))}
          <path d="M 0 106 C 55 102 80 96 122 88 C 168 79 190 70 226 57 C 264 44 300 26 380 13 L 380 122 L 0 122 Z" fill="url(#comeback-area)" opacity={line} />
          <path
            d="M 0 106 C 55 102 80 96 122 88 C 168 79 190 70 226 57 C 264 44 300 26 380 13"
            fill="none"
            stroke={palette.accentSecondary}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="560"
            strokeDashoffset={560 * (1 - line)}
          />
          <circle cx="380" cy="13" r="4" fill={palette.accentSecondary} opacity={line} />
        </svg>
        <div style={{ fontFamily: font, fontSize: 10, letterSpacing: "0.12em", color: palette.textSecondary }}>
          THE COMEBACK
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Lesson: React.FC<Props> = ({ palette, frame }) => {
  const drop = interpolate(frame, [88, 118], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glow = interpolate(frame, [102, 124], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: 100,
          top: 740,
          width: 730,
          height: 600,
          background: `radial-gradient(ellipse at 48% 48%, ${paletteHexWithAlpha(palette.accent, 0.1)}, transparent 62%)`,
          filter: "blur(24px)",
          opacity: 0.7 + glow * 0.3,
        }}
      />
      <div style={{ position: "absolute", left: 142, top: 1150, width: 600, opacity: 0.92 }}>
        <Brick color={palette.accent} width={560} sweep={0.5} rotate={0} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 242,
          top: 930 - (1 - drop) * 300,
          width: 380,
          opacity: 0.22 + drop * 0.78,
          transform: `rotate(${(1 - drop) * -5}deg)`,
        }}
      >
        <Brick color={palette.accentSecondary} width={360} sweep={0.58} />
      </div>
      <div
        style={{
          position: "absolute",
          left: 395,
          top: 1115,
          width: 90,
          height: 90,
          borderRadius: "50%",
          border: `1px solid ${paletteHexWithAlpha(palette.accentSecondary, 0.65)}`,
          opacity: glow,
          boxShadow: `0 0 45px ${paletteHexWithAlpha(palette.accentSecondary, 0.2)}`,
        }}
      />
      <div style={{ position: "absolute", left: 56, top: 650, width: 280 }}>
        <Tag palette={palette} color={palette.accentSecondary}>One brick at a time</Tag>
      </div>
    </AbsoluteFill>
  );
};

export const LegoVisuals: React.FC<Props> = ({ mode, palette, frame, fps, visual }) => {
  if (mode === "hook") return <Hook mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
  if (mode === "crisis") return <Crisis mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
  if (mode === "complexity") return <Complexity mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
  if (mode === "turning") return <Turning mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
  if (mode === "strategy") return <Strategy mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
  if (mode === "comeback") return <Comeback mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
  return <Lesson mode={mode} palette={palette} frame={frame} fps={fps} visual={visual} />;
};
