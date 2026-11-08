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
  progress,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { EvidencePanel, SecureStack } from "../visuals";

export const SceneTakeaway: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 7.2, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 7.2, 0.3, easeIn);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="50%" y="22%" size={62} opacity={0.08} color={C.cyan} />
      <Glow x="82%" y="80%" size={54} opacity={0.06} color={C.blue} />
      <GridField opacity={0.2} size={96} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.025})`,
          transformOrigin: "50% 46%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={C.silver} rule={C.cyan}>
            {COPY.takeawayKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 150, width: 920 }}>
          <MaskLine start={0.22} duration={0.68} style={{ fontFamily: FONT, fontSize: v(54), fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.98, color: C.silver }}>
            {COPY.takeawayOne}
          </MaskLine>
          <MaskLine
            start={0.32}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: v(92),
              fontWeight: 700,
              letterSpacing: "-0.065em",
              lineHeight: 0.94,
              color: C.white,
              textShadow: `0 0 60px ${C.cyanGhost}`,
            }}
          >
            {COPY.takeawayTwo}
          </MaskLine>
          <MaskLine start={0.46} duration={0.7} style={{ marginTop: 8, fontFamily: FONT, fontSize: v(34), fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.cyan }}>
            {COPY.takeawayThree}
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: margin, top: 470, width: 928 }}>
          <SecureStack start={0.7} width={928} />
        </div>

        <div style={{ position: "absolute", left: margin, right: margin, top: 880, display: "flex", gap: 9, opacity: progress(frame, fps, 2.4, 0.7) }}>
          <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
            PROTECTED
          </Tag>
          <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
            AUTHORIZED
          </Tag>
          <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 8, padding: "6px 9px" }}>
            MONITORED
          </Tag>
        </div>

        <div style={{ position: "absolute", left: margin, top: 950, width: 880, opacity: progress(frame, fps, 3.0, 0.8) }}>
          <div style={{ fontFamily: FONT, fontSize: v(20), fontWeight: 500, letterSpacing: "0.06em", lineHeight: 1.65, color: C.dim }}>
            {COPY.takeawaySub}
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1040, width: 900, opacity: progress(frame, fps, 3.6, 0.8) }}>
          <div style={{ fontFamily: FONT, fontSize: v(38), fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: C.white }}>
            THE BOUNDARY IS THE PRODUCT.
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1160, width: 928 }}>
          <EvidencePanel
            start={4.0}
            title="SECURE / EVIDENCE"
            accent={C.cyan}
            items={[
              { label: "AUTHENTICATION", value: "REQUIRED", color: C.cyan },
              { label: "AUTHORIZATION", value: "ENFORCED", color: C.green },
              { label: "DATA ACCESS", value: "RESTRICTED", color: C.cyan },
            ]}
          />
        </div>

        <div style={{ position: "absolute", left: margin, top: 1380, width: 880, opacity: progress(frame, fps, 4.4, 0.8) * 0.9 }}>
          <div style={{ borderLeft: `2px solid ${C.cyan}55`, paddingLeft: 14, fontFamily: MONO, fontSize: 9, letterSpacing: "0.12em", lineHeight: 1.8, color: C.mute }}>
            A BEAUTIFUL APPLICATION IS NOT A SECURE APPLICATION.
            <br />
            SECURITY IS DESIGNED IN.
          </div>
        </div>
      </div>

      <Beam start={1.2} duration={2.6} color={C.white} opacity={0.05} angle={14} />
      <Scanlines opacity={0.025} spacing={6} />
      <Vignette strength={0.9} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
