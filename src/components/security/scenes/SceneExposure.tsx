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
  PulseRing,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { BoundaryGate, DatabaseStack, DataRain, DataRecordCard, EvidencePanel } from "../visuals";

export const SceneExposure: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const breakAt = 3.1;
  const broken = progress(frame, fps, breakAt, 0.55, easeIn);
  const flash = progress(frame, fps, breakAt, 0.08) * (1 - progress(frame, fps, breakAt + 0.08, 0.4));
  const shake = broken > 0 ? 1 - progress(frame, fps, breakAt, 1.0) : 0;
  const camera = progress(frame, fps, 0, 11.6, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 11.65, 0.32, easeIn);
  const sweepY = 420 + progress(frame, fps, breakAt, 2.4) * 680;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="80%" y="10%" size={58} opacity={0.1} color={C.red} />
      <Glow x="14%" y="78%" size={54} opacity={0.09} color={C.orange} />
      <DataRain opacity={0.08} columns={5} color={C.red} speed={1.5} />
      <GridField opacity={0.22} size={88} color="rgba(255,53,72,0.055)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translate(${Math.sin(frame * 1.8) * 5 * shake}px, ${Math.cos(frame * 2.2) * 3 * shake}px) scale(${1 + camera * 0.05})`,
          transformOrigin: "50% 44%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={broken > 0.3 ? C.red : C.silver} rule={C.red}>
            {COPY.exposureKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 146, width: 920 }}>
          <MaskLine start={0.2} duration={0.62} style={{ fontFamily: FONT, fontSize: v(56), fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.96, color: C.silver }}>
            {COPY.exposureOne}
          </MaskLine>
          <MaskLine start={0.3} duration={0.62} style={{ fontFamily: FONT, fontSize: v(56), fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.96, color: C.white }}>
            {COPY.exposureTwo}
          </MaskLine>
          <div style={{ marginTop: 2 }}>
            <MaskLine
              start={breakAt - 0.2}
              duration={0.55}
              style={{
                fontFamily: FONT,
                fontSize: v(146),
                fontWeight: 800,
                letterSpacing: "-0.075em",
                lineHeight: 0.82,
                color: C.red,
                textShadow: `0 0 70px ${C.redGlow}, 0 8px 40px rgba(0,0,0,0.9)`,
              }}
            >
              <GlitchText
                start={breakAt - 0.2}
                color={C.red}
                glitch={1}
                style={{ fontFamily: FONT, fontSize: v(146), fontWeight: 800, letterSpacing: "-0.075em", lineHeight: 0.82 }}
              >
                {COPY.exposureThree}
              </GlitchText>
            </MaskLine>
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 560, width: 928 }}>
          <BoundaryGate start={1.0} broken={broken} width={928} color={C.red} label="DATA BOUNDARY" />
        </div>

        <div style={{ position: "absolute", left: margin, top: 660, width: 310 }}>
          <DatabaseStack size={310} start={0.7} label="CUSTOMER DB" sublabel="PRIVATE" accent={C.cyan} breached={broken} />
          <PulseRing x={155} y={195} size={360} color={C.red} start={breakAt} opacity={0.16} speed={0.5} />
        </div>

        <div style={{ position: "absolute", left: 432, top: 646, width: 572, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {new Array(8).fill(0).map((_, i) => (
            <DataRecordCard key={i} start={1.4 + i * 0.14} index={i} exposed={broken} />
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 388,
            top: 646,
            height: 390,
            width: 1,
            background: `linear-gradient(180deg, transparent, ${C.red}66, transparent)`,
            opacity: progress(frame, fps, 1.4, 0.7),
          }}
        />

        <div style={{ position: "absolute", left: margin, right: margin, top: 1160, display: "flex", alignItems: "center", justifyContent: "space-between", opacity: progress(frame, fps, 3.4, 0.7) }}>
          <div style={{ display: "flex", gap: 9 }}>
            <Tag color={C.red} background={C.redSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
              ACCESS: UNAUTHORIZED
            </Tag>
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
              DATA EXPOSED
            </Tag>
          </div>
          <Mono size={8} color={C.mute}>
            SESSION: VALID · OWNER: MISMATCH
          </Mono>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1240, width: 860 }}>
          <div style={{ fontFamily: FONT, fontSize: v(18), fontWeight: 500, letterSpacing: "0.055em", lineHeight: 1.7, color: C.dim }}>
            {COPY.exposureSub}
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1340, opacity: progress(frame, fps, 5.4, 0.8) }}>
          <Mono size={8} color={C.mute} style={{ letterSpacing: "0.14em" }}>
            {COPY.reconstruction}
          </Mono>
        </div>
        <div style={{ position: "absolute", left: margin, top: 1440, width: 928 }}>
          <EvidencePanel
            start={5.8}
            title="EXPOSURE / EVIDENCE"
            accent={C.red}
            items={[
              { label: "PRIVATE RECORDS", value: "ACCESSIBLE", color: C.red },
              { label: "REQUEST", value: "UNAUTHORIZED", color: C.orange },
              { label: "BOUNDARY", value: "BYPASSED", color: C.red },
            ]}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: sweepY,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.red}, ${C.orange}, transparent)`,
          boxShadow: `0 0 26px ${C.red}`,
          opacity: broken > 0.2 && broken < 0.98 ? 0.85 : 0,
          zIndex: 50,
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: C.red, opacity: flash * 0.18, mixBlendMode: "screen", zIndex: 55 }} />
      <Beam start={breakAt} duration={1.6} color={C.red} opacity={0.11} />
      <Scanlines opacity={0.055} spacing={4} />
      <Vignette strength={1.1} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
