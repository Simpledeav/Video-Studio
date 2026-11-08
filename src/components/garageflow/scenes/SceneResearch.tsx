import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import {
  Glow,
  Grain,
  GridField,
  IconCheck,
  Kicker,
  MaskLine,
  progress,
  Tag,
  useTime,
  Vignette,
} from "../kit";

const STAT_COLORS = [C.blueBright, C.white, C.amber];

export const SceneResearch: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const starts = [BEATS.research.stat1, BEATS.research.stat2, BEATS.research.stat3];
  const sourceIn = progress(t, BEATS.research.source, 0.55);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="18%" y="24%" size={62} color={C.blue} opacity={0.12} />
      <Glow x="84%" y="76%" size={54} color={C.blue} opacity={0.07} />
      <GridField opacity={0.44} size={wide ? 96 : 74} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(180deg, rgba(4,8,14,0.18) 0%, transparent 30%, transparent 70%, rgba(4,8,14,0.72) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? undefined : 70,
          top: wide ? 78 : 112,
          width: wide ? 760 : undefined,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Kicker start={BEATS.research.kicker}>{COPY.research.kicker}</Kicker>
          <Tag color={C.blueBright} background={C.blueSoft} border="rgba(92,157,255,0.3)" style={{ marginLeft: 10 }}>
            CUSTOMER EXPECTATION
          </Tag>
        </div>

        <div style={{ marginTop: wide ? 32 : 26 }}>
          <MaskLine start={BEATS.research.line} duration={0.8}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 80 : 66,
                fontWeight: 700,
                letterSpacing: "-0.058em",
                lineHeight: 0.96,
                color: C.white,
              }}
            >
              {COPY.research.line1}
            </div>
          </MaskLine>
          <MaskLine start={BEATS.research.line + 0.14} duration={0.8}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 80 : 66,
                fontWeight: 700,
                letterSpacing: "-0.058em",
                lineHeight: 0.96,
                color: C.blueBright,
              }}
            >
              {COPY.research.line2}
            </div>
          </MaskLine>
        </div>

        <div
          style={{
            marginTop: wide ? 24 : 20,
            maxWidth: wide ? 590 : 920,
            fontFamily: FONT,
            fontSize: wide ? 19 : 17,
            lineHeight: 1.55,
            color: C.muted,
            opacity: progress(t, BEATS.research.line + 0.6, 0.6),
          }}
        >
          {COPY.research.sub}
        </div>

        <div style={{ marginTop: wide ? 34 : 28, display: "flex", gap: wide ? 10 : 8, flexWrap: "wrap" }}>
          {COPY.research.wants.map((want, index) => {
            const p = progress(t, BEATS.research.wants + index * 0.14, 0.45);
            return (
              <div
                key={want}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: wide ? "9px 13px" : "9px 11px",
                  borderRadius: 4,
                  border: `1px solid ${C.green}2E`,
                  background: C.greenSoft,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 10}px)`,
                }}
              >
                <IconCheck size={wide ? 12 : 11} color={C.green} strokeWidth={2.6} />
                <span style={{ fontFamily: MONO, fontSize: wide ? 9.5 : 8.6, letterSpacing: "0.1em", color: C.green }}>
                  {want}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 940 : 70,
          right: wide ? 108 : 70,
          top: wide ? 148 : 598,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: wide ? 12 : 10 }}>
          <span style={{ fontFamily: MONO, fontSize: 8.6, letterSpacing: "0.18em", color: C.dim }}>SHARE OF RESPONDENTS</span>
          <span style={{ height: 1, flex: 1, background: C.lineSoft }} />
          <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.12em", color: C.dim }}>DEALERSHIP SERVICE</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: wide ? 10 : 12 }}>
          {COPY.research.stats.map((stat, index) => {
            const p = progress(t, starts[index], 0.75);
            const value = Math.round(stat.value * p);
            const color = STAT_COLORS[index];
            return (
              <div
                key={stat.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: wide ? 22 : 16,
                  padding: wide ? "16px 20px" : "14px 16px",
                  borderRadius: 6,
                  border: `1px solid ${index === 0 ? "rgba(92,157,255,0.28)" : C.lineSoft}`,
                  background: index === 0 ? "rgba(46,123,255,0.07)" : "rgba(255,255,255,0.018)",
                  opacity: p,
                  transform: `translateX(${(1 - p) * 24}px)`,
                }}
              >
                <div style={{ width: wide ? 200 : 168, display: "flex", alignItems: "baseline", gap: 2 }}>
                  <span
                    style={{
                      fontFamily: FONT,
                      fontSize: wide ? 86 : 70,
                      fontWeight: 700,
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.065em",
                      lineHeight: 0.84,
                      color,
                    }}
                  >
                    {value}
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: wide ? 38 : 31, fontWeight: 700, color, opacity: 0.8 }}>%</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: FONT, fontSize: wide ? 16 : 14.5, fontWeight: 500, lineHeight: 1.35, color: C.white }}>
                    {stat.label}
                  </div>
                  <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: "rgba(245,248,252,0.08)", overflow: "hidden" }}>
                    <div style={{ width: `${stat.value * p}%`, height: "100%", background: color, borderRadius: 2, opacity: 0.82 }} />
                  </div>
                  <div style={{ marginTop: 7, fontFamily: MONO, fontSize: wide ? 8.5 : 7.8, letterSpacing: "0.12em", color: C.dim }}>
                    {stat.note}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? 108 : 70,
          bottom: wide ? 96 : 176,
          opacity: sourceIn,
          transform: `translateY(${(1 - sourceIn) * 8}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span style={{ width: 3, height: 30, background: C.amber, flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontFamily: MONO, fontSize: wide ? 8.6 : 8, letterSpacing: "0.14em", color: C.amber }}>
              SOURCE: COX AUTOMOTIVE — DEALERSHIP FIXED OPS OWNERSHIP STUDY
            </div>
            <div style={{ marginTop: 3, fontFamily: FONT, fontSize: wide ? 11 : 10, lineHeight: 1.45, color: C.muted }}>
              Respondents are dealership service customers, not independent garage customers. Figures show three separate
              findings from the same study.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: wide ? 108 : 70,
          bottom: wide ? 46 : 112,
          fontFamily: MONO,
          fontSize: 8,
          letterSpacing: "0.14em",
          color: C.dim,
          opacity: sourceIn,
        }}
      >
        RESEARCH ACT  ·  45 / 13 / 12
      </div>

      <Vignette strength={wide ? 0.78 : 0.9} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
