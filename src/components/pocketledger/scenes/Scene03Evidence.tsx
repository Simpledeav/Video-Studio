import { BEATS, C, COPY, FONT, MONO, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Display,
  Kicker,
  Sweep,
  Tag,
  easeOut,
  progress,
  useTime,
} from "../kit";

const Ticks: React.FC<{
  count: number;
  filled: number;
  progress: number;
  color: string;
  wide: boolean;
}> = ({ count, filled, progress: p, color, wide }) => {
  return (
    <div style={{ display: "flex", gap: wide ? 3 : 2.5, alignItems: "flex-end", height: wide ? 42 : 32 }}>
      {Array.from({ length: count }, (_, index) => {
        const lit = index < filled && index / count < p;
        return (
          <div
            key={index}
            style={{
              flex: 1,
              height: lit ? "100%" : "42%",
              background: lit ? color : "rgba(246,242,232,0.13)",
              borderRadius: 1,
              transition: "none",
              boxShadow: lit ? `0 0 6px ${color}44` : "none",
            }}
          />
        );
      })}
    </div>
  );
};

const StatBlock: React.FC<{
  value: number;
  label: string;
  color: string;
  start: number;
  barStart: number;
  wide: boolean;
  compact?: boolean;
}> = ({ value, label, color, start, barStart, wide, compact = false }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.8, easeOut);
  const count = Math.round(value * progress(t, start, 1.4, easeOut));
  const bar = progress(t, barStart, 1.4, easeOut);
  return (
    <div style={{ opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
        <Display size={wide ? (compact ? 150 : 230) : compact ? 120 : 176} color={color} style={{ letterSpacing: "-0.07em", lineHeight: 0.8 }}>
          {count}%
        </Display>
      </div>
      <div
        style={{
          marginTop: wide ? 12 : 10,
          fontFamily: FONT,
          fontSize: wide ? 18 : 15,
          fontWeight: 600,
          letterSpacing: "0.12em",
          color: C.cream,
          maxWidth: wide ? 700 : 820,
        }}
      >
        {label}
      </div>
      <div style={{ marginTop: wide ? 20 : 14 }}>
        <Ticks count={wide ? 50 : 40} filled={Math.round((value / 100) * (wide ? 50 : 40))} progress={bar} color={color} wide={wide} />
      </div>
      <div style={{ marginTop: 6, display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.14em", color: C.dim }}>0%</span>
        <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.14em", color: C.dim }}>100%</span>
      </div>
    </div>
  );
};

export const Scene03Evidence: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const sourceIn = progress(t, BEATS.evidence.source, 0.7);

  return (
    <Backdrop glowX="24%" glowY="42%" glowOpacity={0.1}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(8,9,7,0.35)" }} />
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 70 : 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 6,
        }}
      >
        <Kicker start={0.2}>THE EVIDENCE</Kicker>
        <Tag color={C.greenBright} background={C.greenGhost} border={`${C.green}44`} style={{ opacity: progress(t, 0.4, 0.6) }}>
          NIGERIA · MICROENTERPRISES
        </Tag>
      </div>

      {wide ? (
        <>
          <div style={{ position: "absolute", left: stage.margin, top: 220, width: "49%" }}>
            <StatBlock value={COPY.statA} label={COPY.statALabel} color={C.cream} start={BEATS.evidence.statA} barStart={BEATS.evidence.barA} wide />
          </div>
          <div
            style={{
              position: "absolute",
              left: "52.5%",
              top: 210,
              width: 1,
              height: 470,
              background: C.line,
              opacity: 0.7,
            }}
          />
          <div style={{ position: "absolute", right: stage.margin, top: 280, width: "42%" }}>
            <StatBlock value={COPY.statB} label={COPY.statBLabel} color={C.greenBright} start={BEATS.evidence.statB} barStart={BEATS.evidence.barB} wide compact />
          </div>
        </>
      ) : (
        <div style={{ position: "absolute", left: stage.margin, right: stage.margin, top: 330, display: "flex", flexDirection: "column", gap: 70 }}>
          <StatBlock value={COPY.statA} label={COPY.statALabel} color={C.cream} start={BEATS.evidence.statA} barStart={BEATS.evidence.barA} wide={false} />
          <div style={{ height: 1, background: C.line }} />
          <StatBlock value={COPY.statB} label={COPY.statBLabel} color={C.greenBright} start={BEATS.evidence.statB} barStart={BEATS.evidence.barB} wide={false} compact />
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 94 : 210,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 30,
          opacity: sourceIn,
          zIndex: 8,
        }}
      >
        <div style={{ maxWidth: wide ? 720 : 640 }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.greenBright, marginBottom: 8 }}>
            SOURCE
          </div>
          <div style={{ fontFamily: FONT, fontSize: wide ? 15 : 13, lineHeight: 1.6, color: C.cream }}>
            {COPY.source}
          </div>
          <div style={{ marginTop: 10, fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.12em", color: C.dim }}>
            BARRIERS CITED: DIGITAL SKILLS · ELECTRICITY · AFFORDABILITY
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.dim }}>
            TWO NUMBERS
          </div>
          <div style={{ marginTop: 6, fontFamily: FONT, fontSize: wide ? 18 : 15, fontWeight: 600, color: C.cream }}>
            One quiet problem.
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${C.greenBright}, transparent)`,
          opacity: 0.4,
          zIndex: 10,
        }}
      />
      <Sweep start={0.4} duration={2.4} opacity={0.07} />
    </Backdrop>
  );
};
