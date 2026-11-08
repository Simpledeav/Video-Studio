import { interpolate, spring } from "remotion";
import type { Palette } from "../../config/theme";
import { SPRINGS } from "../../config/motion";

type NumericCounterProps = {
  from: number;
  to: number;
  sceneFrame: number;
  startFrame: number;
  fps: number;
  palette: Palette;
  prefix?: string;
  suffix?: string;
  color?: string;
  fontSize?: number;
};

export const NumericCounter: React.FC<NumericCounterProps> = ({
  from,
  to,
  sceneFrame,
  startFrame,
  fps,
  palette,
  prefix = "",
  suffix = "",
  color,
  fontSize = 118,
}) => {
  const progress = spring({
    frame: Math.max(0, sceneFrame - startFrame),
    fps,
    config: SPRINGS.soft,
  });
  const value = Math.round(interpolate(progress, [0, 1], [from, to]));
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 2,
        color: color ?? palette.accent,
        fontFamily: 'var(--sd-font, "Manrope", sans-serif)',
        fontSize,
        lineHeight: 0.95,
        fontWeight: 600,
        letterSpacing: "-0.07em",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {prefix}
      {value.toLocaleString("en-US")}
      {suffix ? <span style={{ fontSize: "0.54em", letterSpacing: "-0.02em" }}>{suffix}</span> : null}
    </span>
  );
};
