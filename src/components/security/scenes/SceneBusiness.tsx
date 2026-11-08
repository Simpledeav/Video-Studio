import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/security";
import {
  Beam,
  easeIn,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { BusinessDashboard, DataRain, EvidencePanel } from "../visuals";

const INFRA = [
  { label: "APPLICATION BACKEND", value: "API · 2.4K REQ/MIN", color: C.cyan, at: 1.9 },
  { label: "DATABASE", value: "12,806 PRIVATE RECORDS", color: C.blue, at: 2.2 },
  { label: "BUSINESS ANALYTICS", value: "LIVE · INTERNAL", color: C.green, at: 2.5 },
];

export const SceneBusiness: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 8.4, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 8.12, 0.3, easeIn);

  return (
    <AbsoluteFill style={{ background: C.graphite, overflow: "hidden" }}>
      <Glow x="88%" y="12%" size={60} opacity={0.1} color={C.blue} />
      <Glow x="10%" y="80%" size={54} opacity={0.08} color={C.cyan} />
      <DataRain opacity={0.04} columns={4} color={C.cyan} start={1} speed={0.7} />
      <GridField opacity={0.26} size={86} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${-camera * 10}px) scale(${1 + camera * 0.025})`,
          transformOrigin: "52% 48%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={C.silver} rule={C.cyan}>
            {COPY.businessKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", right: margin, top: 34, fontFamily: FONT, fontSize: v(168), fontWeight: 800, letterSpacing: "-0.08em", lineHeight: 0.8, color: "rgba(245,247,250,0.03)", pointerEvents: "none" }}>
          SCALE
        </div>

        <div style={{ position: "absolute", left: margin, top: 150, width: 900 }}>
          <MaskLine start={0.24} duration={0.7} style={{ fontFamily: FONT, fontSize: v(62), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.96, color: C.silver }}>
            {COPY.businessOne}
          </MaskLine>
          <MaskLine start={0.34} duration={0.72} style={{ fontFamily: FONT, fontSize: v(72), fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 0.98, color: C.white }}>
            {COPY.businessTwo}
          </MaskLine>
          <MaskLine start={0.48} duration={0.7} style={{ marginTop: 6, fontFamily: FONT, fontSize: v(30), fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, color: C.cyan }}>
            {COPY.businessThree}
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: margin, top: 410, width: 928 }}>
          <BusinessDashboard start={0.55} width={928} height={560} accent={C.cyan} />
        </div>

        <div style={{ position: "absolute", left: margin, top: 1010, width: 928, display: "flex", gap: 10 }}>
          {INFRA.map((item) => {
            const p = progress(frame, fps, item.at, 0.55);
            return (
              <div
                key={item.label}
                style={{
                  flex: 1,
                  border: `1px solid ${item.color}33`,
                  background: `linear-gradient(150deg, ${item.color}0B, rgba(10,13,18,0.9))`,
                  borderRadius: 8,
                  padding: "12px 12px",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 12}px)`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                  <Mono size={7} color={item.color}>
                    {item.label}
                  </Mono>
                </div>
                <div style={{ marginTop: 8, fontFamily: MONO, fontSize: 9, letterSpacing: "0.06em", color: C.silver, lineHeight: 1.5 }}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1180,
            borderTop: `1px solid ${C.line}`,
            paddingTop: 15,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: progress(frame, fps, 2.9, 0.7),
          }}
        >
          <div style={{ display: "flex", gap: 9 }}>
            {COPY.businessTags.map((label, i) => (
              <Tag key={label} color={i === 1 ? C.cyan : C.silver} background={i === 1 ? C.cyanSoft : "rgba(255,255,255,0.035)"} style={{ fontSize: 8, padding: "5px 8px" }}>
                {label}
              </Tag>
            ))}
          </div>
          <Mono size={8} color={C.mute}>
            US-EAST · LIVE
          </Mono>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1270, width: 860, opacity: progress(frame, fps, 3.4, 0.7) * 0.85 }}>
          <div style={{ fontFamily: FONT, fontSize: v(17), fontWeight: 500, letterSpacing: "0.06em", lineHeight: 1.7, color: C.dim }}>
            A polished product, a trusted brand, and a production database holding the
            information customers expect to stay private.
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1380, opacity: progress(frame, fps, 4.4, 0.8) }}>
          <Reveal start={4.4} y={8}>
            <Mono size={8} color={C.mute} style={{ letterSpacing: "0.14em" }}>
              {COPY.reconstruction}
            </Mono>
          </Reveal>
        </div>
        <div style={{ position: "absolute", left: margin, top: 1470, width: 928 }}>
          <EvidencePanel
            start={4.0}
            title="BUSINESS / DATA LAYER"
            accent={C.cyan}
            items={[
              { label: "CUSTOMERS", value: "8,420", color: C.cyan },
              { label: "PRIVATE RECORDS", value: "12,806", color: C.blue },
              { label: "ACCESS PLANE", value: "APP · API · DB", color: C.green },
            ]}
          />
        </div>
      </div>

      <Beam start={3.6} duration={1.8} color={C.blue} opacity={0.08} />
      <Scanlines opacity={0.04} spacing={5} />
      <Vignette strength={0.96} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
