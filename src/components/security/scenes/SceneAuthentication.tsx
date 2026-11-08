import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, useStage } from "../../../config/security";
import {
  Beam,
  Divider,
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
  WordReveal,
} from "../kit";
import { EvidencePanel, LoginCard, RequestTrace } from "../visuals";

export const SceneAuthentication: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 8.8, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 8.64, 0.3, easeIn);
  const warn = progress(frame, fps, 4.3, 0.7);

  return (
    <AbsoluteFill style={{ background: "#080B12", overflow: "hidden" }}>
      <Glow x="22%" y="14%" size={58} opacity={0.09} color={C.cyan} />
      <Glow x="80%" y="72%" size={54} opacity={0.08 + warn * 0.04} color={C.orange} />
      <GridField opacity={0.25} size={92} color="rgba(167,176,188,0.06)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.03})`,
          transformOrigin: "50% 46%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={C.silver} rule={C.cyan}>
            {COPY.authKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 146, width: 910 }}>
          <MaskLine start={0.22} duration={0.7} style={{ fontFamily: FONT, fontSize: v(62), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.white }}>
            {COPY.authOne}
          </MaskLine>
          <MaskLine start={0.38} duration={0.68} style={{ fontFamily: FONT, fontSize: v(58), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.silver }}>
            {COPY.authTwo}
          </MaskLine>
          <MaskLine
            start={0.52}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(82),
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.98,
              color: C.orange,
              textShadow: `0 0 50px ${C.orangeSoft}`,
            }}
          >
            {COPY.authThree}
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: margin, top: 470, display: "flex", gap: 24, width: 928 }}>
          <LoginCard start={0.55} width={412} height={560} />
          <RequestTrace start={0.8} width={492} height={560} />
        </div>

        <div style={{ position: "absolute", left: margin, right: margin, top: 1100, display: "flex", alignItems: "center", gap: 12, opacity: progress(frame, fps, 3.2, 0.7) }}>
          <Divider color={`${C.cyan}55`} style={{ width: 64 }} />
          <Mono size={9} color={C.cyan} style={{ letterSpacing: "0.18em" }}>
            AUTHENTICATION CONFIRMS WHO YOU ARE.
          </Mono>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1150, width: 900 }}>
          <WordReveal
            text={COPY.authSub}
            start={3.5}
            stagger={0.06}
            style={{ fontFamily: FONT, fontSize: v(44), fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1.05, color: C.white }}
            wordStyle={{ fontFamily: FONT, fontSize: v(44), fontWeight: 700, letterSpacing: "-0.04em" }}
            emphasis={["PERMISSION"]}
            emphasisStyle={{ color: C.orange }}
          />
        </div>

        <div style={{ position: "absolute", left: margin, right: margin, top: 1280, display: "flex", gap: 10, opacity: progress(frame, fps, 4.6, 0.7) }}>
          <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
            AUTHENTICATION: PASS
          </Tag>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
            AUTHORIZATION: NOT ENFORCED
          </Tag>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1370, width: 820, opacity: progress(frame, fps, 5.4, 0.8) * 0.9 }}>
          <Reveal start={5.4} y={10}>
            <div style={{ fontFamily: FONT, fontSize: v(17), fontWeight: 500, letterSpacing: "0.06em", lineHeight: 1.7, color: C.dim }}>
              The login worked. The session was valid. The backend never asked whether
              this identity was allowed to open this specific record.
            </div>
          </Reveal>
        </div>
        <div style={{ position: "absolute", left: margin, top: 1490, width: 928 }}>
          <EvidencePanel
            start={5.0}
            title="ACCESS DECISION"
            accent={C.orange}
            items={[
              { label: "AUTHENTICATION", value: "PASS", color: C.green },
              { label: "AUTHORIZATION", value: "FAIL", color: C.orange },
              { label: "OBJECT CHECK", value: "MISSING", color: C.red },
            ]}
          />
        </div>
      </div>

      <Beam start={4.4} duration={1.8} color={C.orange} opacity={0.07} />
      <Scanlines opacity={0.045} spacing={5} />
      <Vignette strength={1.0} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
