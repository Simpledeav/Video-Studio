import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, useStage } from "../../../config/security";
import {
  Beam,
  easeIn,
  GlitchText,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Scanlines,
  StatusRow,
  Tag,
  useTime,
  Vignette,
  WordReveal,
} from "../kit";
import { BoundaryGate, BusinessDashboard, DatabaseStack, DataRain, EvidencePanel } from "../visuals";

export const SceneHook: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();

  const breakAt = 2.55;
  const broken = progress(frame, fps, breakAt, 0.6, easeIn);
  const flash = progress(frame, fps, breakAt, 0.08) * (1 - progress(frame, fps, breakAt + 0.08, 0.4));
  const shake = broken > 0 ? 1 - progress(frame, fps, breakAt, 1.0) : 0;
  const camera = progress(frame, fps, 0.2, 5.1, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 5.15, 0.34, easeIn);
  const typeIn = 2.0;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="84%" y="8%" size={58} opacity={0.1} color={C.cyan} />
      <Glow x="12%" y="74%" size={54} opacity={0.1} color={C.red} />
      <DataRain opacity={0.08} columns={5} color={C.cyan} speed={1.35} />
      <GridField opacity={0.3} size={88} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${Math.sin(frame * 1.6) * 4 * shake}px, ${Math.cos(frame * 2.1) * 3 * shake}px) scale(${1 + camera * 0.045})`,
          transformOrigin: "50% 44%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={broken > 0.3 ? C.red : C.silver} rule={broken > 0.3 ? C.red : C.cyan}>
            {broken > 0.3 ? "PRODUCTION  /  INCIDENT" : COPY.hookKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 160, display: "flex", gap: 22, width: 928 }}>
          <div style={{ width: 626, position: "relative" }}>
            <BusinessDashboard start={0.15} width={626} height={520} compact compromised={broken} accent={broken > 0.3 ? C.red : C.cyan} />
            <div style={{ position: "absolute", left: 20, right: 20, bottom: 16 }}>
              <StatusRow label="AUTHORIZATION" value={broken > 0.3 ? "NOT ENFORCED" : "ENFORCED"} color={broken > 0.3 ? C.red : C.green} />
              <StatusRow label="DATA ACCESS" value={broken > 0.3 ? "UNRESTRICTED" : "RESTRICTED"} color={broken > 0.3 ? C.orange : C.cyan} style={{ marginTop: 8 }} />
            </div>
          </div>
          <div style={{ width: 280, paddingTop: 26 }}>
            <DatabaseStack
              size={280}
              start={0.55}
              label="CUSTOMER DB"
              sublabel="PRODUCTION"
              accent={broken > 0.3 ? C.red : C.cyan}
              breached={broken}
            />
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 700, width: 928 }}>
          <BoundaryGate start={1.0} broken={broken} width={928} color={C.cyan} />
        </div>

        <div style={{ position: "absolute", left: margin, top: 790, width: 900 }}>
          <MaskLine
            start={typeIn}
            duration={0.62}
            style={{ fontFamily: FONT, fontSize: v(76), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.95, color: C.silver }}
          >
            {COPY.hookOne}
          </MaskLine>
          <MaskLine
            start={typeIn + 0.09}
            duration={0.62}
            style={{ fontFamily: FONT, fontSize: v(76), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.95, color: C.white }}
          >
            {COPY.hookTwo}
          </MaskLine>

          <div style={{ marginTop: 4, position: "relative" }}>
            <MaskLine
              start={breakAt}
              duration={0.55}
              style={{
                fontFamily: FONT,
                fontSize: v(176),
                fontWeight: 800,
                letterSpacing: "-0.08em",
                lineHeight: 0.8,
                color: C.red,
                textShadow: `0 0 70px ${C.redGlow}, 0 8px 40px rgba(0,0,0,0.9)`,
              }}
            >
              <GlitchText
                start={breakAt}
                color={C.red}
                glitch={1}
                style={{ fontFamily: FONT, fontSize: v(196), fontWeight: 800, letterSpacing: "-0.08em", lineHeight: 0.8 }}
              >
                {COPY.hookThree}
              </GlitchText>
            </MaskLine>
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: -8,
                height: 2,
                background: `linear-gradient(90deg, ${C.red}, transparent 84%)`,
                opacity: progress(frame, fps, 3.0, 0.5) * 0.85,
              }}
            />
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1270, width: 820 }}>
          <WordReveal
            text={COPY.hookSub}
            start={3.5}
            stagger={0.045}
            style={{ fontFamily: FONT, fontSize: v(23), fontWeight: 600, letterSpacing: "0.06em", lineHeight: 1.4, color: C.white }}
            wordStyle={{ fontFamily: FONT, fontSize: v(23), fontWeight: 600, letterSpacing: "0.06em" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1380,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${C.line}`,
            paddingTop: 14,
            opacity: progress(frame, fps, 2.8, 0.6),
          }}
        >
          <div style={{ display: "flex", gap: 9 }}>
            <Tag color={C.red} background={C.redSoft} style={{ fontSize: 8, padding: "5px 8px" }}>
              ACCESS: EXPOSED
            </Tag>
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8, padding: "5px 8px" }}>
              BOUNDARY: MISSING
            </Tag>
          </div>
          <Mono size={8} color={C.mute}>
            PRODUCTION · LIVE DATA
          </Mono>
        </div>
        <div style={{ position: "absolute", left: margin, top: 1480, width: 928 }}>
          <EvidencePanel
            start={3.9}
            title="EXPOSURE / EVIDENCE"
            accent={C.red}
            items={[
              { label: "AUTHENTICATION", value: "PRESENT", color: C.green },
              { label: "AUTHORIZATION", value: "MISSING", color: C.red },
              { label: "CUSTOMER DATA", value: "EXPOSED", color: C.orange },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.red,
          opacity: flash * 0.18,
          mixBlendMode: "screen",
          zIndex: 55,
        }}
      />
      <Beam start={breakAt} duration={1.4} color={C.red} opacity={0.1} />
      <Scanlines opacity={0.055} spacing={4} />
      <Vignette strength={1.08} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
