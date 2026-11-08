import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, useStage } from "../../../config/security";
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
  useTime,
  Vignette,
} from "../kit";
import { DataRain, EvidencePanel, ImpactDashboard } from "../visuals";

export const SceneImpact: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 9.8, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 9.64, 0.3, easeIn);

  return (
    <AbsoluteFill style={{ background: C.graphite, overflow: "hidden" }}>
      <Glow x="18%" y="12%" size={56} opacity={0.08} color={C.blue} />
      <Glow x="82%" y="74%" size={54} opacity={0.08} color={C.orange} />
      <DataRain opacity={0.035} columns={4} color={C.blue} speed={0.65} />
      <GridField opacity={0.24} size={92} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-camera * 10}px) scale(${1 + camera * 0.025})`,
          transformOrigin: "50% 46%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={C.silver} rule={C.orange}>
            {COPY.impactKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 146, width: 920 }}>
          <MaskLine start={0.22} duration={0.7} style={{ fontFamily: FONT, fontSize: v(58), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.silver }}>
            {COPY.impactOne}
          </MaskLine>
          <MaskLine start={0.34} duration={0.72} style={{ fontFamily: FONT, fontSize: v(66), fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 1.0, color: C.white }}>
            {COPY.impactTwo}
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: margin, top: 380, width: 928 }}>
          <ImpactDashboard start={0.5} width={928} height={600} />
        </div>

        <div style={{ position: "absolute", left: margin, top: 1050, display: "flex", gap: 12, width: 928 }}>
          {COPY.impactWords.map((word, i) => {
            const p = progress(frame, fps, 3.2 + i * 0.35, 0.65);
            return (
              <div
                key={word}
                style={{
                  flex: 1,
                  borderTop: `2px solid ${i === 0 ? C.red : i === 1 ? C.orange : C.silver}`,
                  paddingTop: 12,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 14}px)`,
                }}
              >
                <div style={{ fontFamily: FONT, fontSize: v(26), fontWeight: 700, letterSpacing: "-0.03em", color: i === 0 ? C.red : i === 1 ? C.orange : C.white }}>
                  {word}
                </div>
                <div style={{ marginTop: 5, fontFamily: FONT, fontSize: v(12), fontWeight: 500, letterSpacing: "0.06em", color: C.dim, lineHeight: 1.5 }}>
                  {i === 0
                    ? "Customer confidence is hard to rebuild."
                    : i === 1
                      ? "The incident becomes the story."
                      : "Legal and operational exposure."}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ position: "absolute", left: margin, top: 1190, width: 860, opacity: progress(frame, fps, 5.0, 0.7) * 0.9 }}>
          <Reveal start={5.0} y={10}>
            <div style={{ fontFamily: FONT, fontSize: v(17), fontWeight: 500, letterSpacing: "0.055em", lineHeight: 1.7, color: C.dim }}>
              No dollar figure is required to explain the risk. Trust, reputation,
              legal exposure and continuity are affected together.
            </div>
          </Reveal>
        </div>

        <div style={{ position: "absolute", left: margin, right: margin, top: 1280, display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${C.line}`, paddingTop: 13, opacity: progress(frame, fps, 4.2, 0.7) }}>
          <Mono size={8} color={C.mute}>
            INCIDENT RESPONSE · CONTAINMENT
          </Mono>
          <Mono size={8} color={C.orange}>
            NO FINANCIAL ESTIMATE
          </Mono>
        </div>
        <div style={{ position: "absolute", left: margin, top: 1380, width: 928 }}>
          <EvidencePanel
            start={5.4}
            title="IMPACT / SIGNALS"
            accent={C.orange}
            items={[
              { label: "CUSTOMER TRUST", value: "DECLINING", color: C.red },
              { label: "REPUTATION", value: "AT RISK", color: C.orange },
              { label: "OPERATIONS", value: "DEGRADED", color: C.orange },
            ]}
          />
        </div>
      </div>

      <Beam start={3.8} duration={1.8} color={C.orange} opacity={0.06} />
      <Scanlines opacity={0.04} spacing={5} />
      <Vignette strength={0.98} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
