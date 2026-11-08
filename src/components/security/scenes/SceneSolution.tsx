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
import { ArchitectureFlow, DataRain, EvidencePanel, PolicyPanel } from "../visuals";

const TESTS = [
  { label: "CROSS-USER ACCESS", value: "DENIED", at: 10.6 },
  { label: "ROLE ESCALATION", value: "DENIED", at: 11.1 },
  { label: "OWNERSHIP BYPASS", value: "DENIED", at: 11.6 },
];

export const SceneSolution: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 17.2, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 17.2, 0.3, easeIn);
  const sweep = progress(frame, fps, 9.2, 2.4);

  return (
    <AbsoluteFill style={{ background: "#070A0F", overflow: "hidden" }}>
      <Glow x="18%" y="10%" size={58} opacity={0.09} color={C.cyan} />
      <Glow x="84%" y="52%" size={56} opacity={0.06} color={C.blue} />
      <Glow x="52%" y="96%" size={50} opacity={0.05} color={C.green} />
      <DataRain opacity={0.03} columns={4} color={C.cyan} speed={0.55} />
      <GridField opacity={0.24} size={92} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1.02 - camera * 0.02})`,
          transformOrigin: "50% 42%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 86 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan}>
            {COPY.solutionKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 140, width: 700 }}>
          <MaskLine start={0.22} duration={0.68} style={{ fontFamily: FONT, fontSize: v(54), fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.98, color: C.silver }}>
            {COPY.solutionOne}
          </MaskLine>
          <MaskLine start={0.32} duration={0.7} style={{ fontFamily: FONT, fontSize: v(76), fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 0.96, color: C.cyan }}>
            {COPY.solutionTwo}
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: margin, top: 330, width: 520 }}>
          <ArchitectureFlow start={0.7} width={520} height={1020} />
        </div>

        <div style={{ position: "absolute", left: 624, top: 330, width: 380 }}>
          <PolicyPanel start={2.0} width={380} />
        </div>

        <div style={{ position: "absolute", left: 624, top: 820, width: 380, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {COPY.solutionPrinciples.map((principle, i) => {
            const p = progress(frame, fps, 5.6 + i * 0.3, 0.6);
            return (
              <div
                key={principle}
                style={{
                  border: `1px solid ${C.cyan}33`,
                  background: "rgba(0,217,255,0.045)",
                  borderRadius: 5,
                  padding: "9px 9px",
                  opacity: p,
                  transform: `translateY(${(1 - p) * 10}px)`,
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.1em", lineHeight: 1.45, color: C.cyan }}>
                  {principle}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 624,
            top: 980,
            width: 380,
            border: `1px solid ${C.lineSoft}`,
            borderRadius: 8,
            padding: "12px 13px",
            background: "rgba(10,13,18,0.9)",
            opacity: progress(frame, fps, 9.6, 0.7),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Mono size={8} color={C.mute}>
              SECURITY TESTS
            </Mono>
            <Mono size={8} color={C.green}>
              BEFORE DEPLOY
            </Mono>
          </div>
          <div style={{ marginTop: 8 }}>
            {TESTS.map((test) => {
              const p = progress(frame, fps, test.at, 0.5);
              return (
                <div
                  key={test.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                    padding: "6px 0",
                    borderBottom: `1px solid ${C.lineSoft}`,
                    opacity: p,
                  }}
                >
                  <Mono size={7} color={C.silver}>
                    {test.label}
                  </Mono>
                  <Mono size={7} color={C.green}>
                    {test.value}
                  </Mono>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1380, width: 900, opacity: progress(frame, fps, 13.8, 0.8) * 0.9 }}>
          <Reveal start={13.8} y={10}>
            <div style={{ fontFamily: FONT, fontSize: v(17), fontWeight: 500, letterSpacing: "0.055em", lineHeight: 1.7, color: C.dim }}>
              The fix is not a single rule. It is an architecture that verifies every
              request, limits every credential and tests the boundary before release.
            </div>
          </Reveal>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1480, display: "flex", gap: 8, opacity: progress(frame, fps, 13.0, 0.7) }}>
          <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
            LEAST PRIVILEGE
          </Tag>
          <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 7, padding: "5px 8px" }}>
            MONITORING
          </Tag>
          <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 7, padding: "5px 8px" }}>
            ACCESS REVIEWS
          </Tag>
        </div>

        <div style={{ position: "absolute", left: 624, top: 1140, width: 380, border: `1px solid ${C.lineSoft}`, borderRadius: 8, padding: "12px 13px", background: "rgba(10,13,18,0.9)", opacity: progress(frame, fps, 11.8, 0.7) }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Mono size={8} color={C.mute}>MONITORING</Mono>
            <Mono size={8} color={C.cyan}>CONTINUOUS</Mono>
          </div>
          <div style={{ marginTop: 8, fontFamily: FONT, fontSize: v(12), fontWeight: 500, letterSpacing: "0.04em", lineHeight: 1.5, color: C.dim }}>
            Log denied requests. Alert on ownership mismatches. Review access rules
            after every change.
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1550, width: 928 }}>
          <EvidencePanel
            start={13.2}
            title="CONTROL / EVIDENCE"
            accent={C.green}
            items={[
              { label: "AUTHORIZATION", value: "SERVER-SIDE", color: C.cyan },
              { label: "DATABASE ROLE", value: "LEAST PRIVILEGE", color: C.green },
              { label: "SECURITY TESTS", value: "PASSING", color: C.green },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(90deg, transparent, ${C.cyan}0A, transparent)`,
          transform: `translateX(${-100 + sweep * 200}%)`,
          opacity: sweep > 0 && sweep < 1 ? 0.8 : 0,
          pointerEvents: "none",
        }}
      />
      <Beam start={9.0} duration={2.2} color={C.cyan} opacity={0.06} />
      <Scanlines opacity={0.03} spacing={6} />
      <Vignette strength={0.92} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
