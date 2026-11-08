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
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { AccountCard, ApiInspector, DataRain, EvidencePanel } from "../visuals";

export const SceneMistake: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 9.8, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 9.64, 0.3, easeIn);
  const travel = progress(frame, fps, 2.2, 2.0, (x) => x);
  const missing = progress(frame, fps, 3.8, 0.7);

  return (
    <AbsoluteFill style={{ background: "#0A0B10", overflow: "hidden" }}>
      <Glow x="78%" y="12%" size={58} opacity={0.08} color={C.orange} />
      <Glow x="14%" y="76%" size={54} opacity={0.07} color={C.red} />
      <DataRain opacity={0.035} columns={4} color={C.orange} speed={0.8} />
      <GridField opacity={0.24} size={90} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateY(${-camera * 8}px) scale(${1 + camera * 0.025})`,
          transformOrigin: "50% 48%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 92 }}>
          <Kicker start={0.12} color={C.silver} rule={C.orange}>
            {COPY.mistakeKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: margin, top: 146, width: 910 }}>
          <MaskLine start={0.22} duration={0.7} style={{ fontFamily: FONT, fontSize: v(60), fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.silver }}>
            {COPY.mistakeOne}
          </MaskLine>
          <MaskLine
            start={0.36}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(88),
              fontWeight: 700,
              letterSpacing: "-0.065em",
              lineHeight: 0.96,
              color: C.orange,
              textShadow: `0 0 50px ${C.orangeSoft}`,
            }}
          >
            {COPY.mistakeTwo}
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: margin, top: 380, display: "flex", gap: 32, width: 928 }}>
          <div style={{ width: 448 }}>
            <AccountCard start={0.5} label="CUSTOMER A" id="CUST-A-1042" accent={C.cyan} active records={12806} />
          </div>
          <div style={{ width: 448 }}>
            <AccountCard start={0.62} label="CUSTOMER B" id="CUST-B-2087" accent={C.orange} records={12806} />
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 560, width: 928, height: 54, opacity: progress(frame, fps, 1.4, 0.6) }}>
          <div style={{ position: "absolute", left: 80, right: 80, top: 26, height: 1, background: `linear-gradient(90deg, ${C.cyan}44, ${C.orange}44)` }} />
          <div
            style={{
              position: "absolute",
              left: 80 + travel * 690,
              top: 20,
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: C.white,
              boxShadow: `0 0 16px ${C.cyan}, 0 0 32px ${C.orange}55`,
              opacity: travel > 0 && travel < 0.99 ? 1 : 0,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Tag color={missing > 0.4 ? C.orange : C.silver} background={missing > 0.4 ? C.orangeSoft : "rgba(255,255,255,0.035)"} style={{ fontSize: 7, padding: "4px 8px" }}>
              {missing > 0.4 ? "CROSS-ACCOUNT REQUEST" : "REQUEST PATH"}
            </Tag>
          </div>
        </div>

        <div style={{ position: "absolute", left: margin, top: 670, width: 928 }}>
          <ApiInspector start={1.1} width={928} height={480} />
        </div>

        <div style={{ position: "absolute", left: margin, right: margin, top: 1240, display: "flex", gap: 9, opacity: progress(frame, fps, 4.8, 0.7) }}>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
            ACCESS CONTROL FAILURE
          </Tag>
          <Tag color={C.red} background={C.redSoft} style={{ fontSize: 8, padding: "6px 9px" }}>
            PRIVATE DATA
          </Tag>
          <Tag color={C.silver} background="rgba(255,255,255,0.035)" style={{ fontSize: 8, padding: "6px 9px" }}>
            NO OBJECT-LEVEL CHECK
          </Tag>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1320, width: 870 }}>
          <Reveal start={5.2} y={10}>
            <div style={{ fontFamily: FONT, fontSize: v(18), fontWeight: 500, letterSpacing: "0.055em", lineHeight: 1.7, color: C.dim }}>
              {COPY.mistakeSub}
            </div>
          </Reveal>
        </div>

        <div style={{ position: "absolute", left: margin, top: 1420, width: 900, opacity: progress(frame, fps, 6.2, 0.8) * 0.9 }}>
          <div style={{ borderLeft: `2px solid ${C.orange}66`, paddingLeft: 14, fontFamily: MONO, fontSize: 9, letterSpacing: "0.1em", lineHeight: 1.8, color: C.mute }}>
            THE SERVER CHECKED THE TOKEN.
            <br />
            IT NEVER CHECKED THE RECORD OWNER.
          </div>
        </div>
        <div style={{ position: "absolute", left: margin, top: 1520, width: 928 }}>
          <EvidencePanel
            start={5.8}
            title="ACCESS CONTROL / EVIDENCE"
            accent={C.orange}
            items={[
              { label: "REQUESTER", value: "CUST-A-1042", color: C.cyan },
              { label: "RECORD OWNER", value: "CUST-B-2087", color: C.orange },
              { label: "OWNERSHIP CHECK", value: "NOT ENFORCED", color: C.red },
            ]}
          />
        </div>
      </div>

      <Beam start={4.0} duration={1.8} color={C.orange} opacity={0.07} />
      <Scanlines opacity={0.045} spacing={5} />
      <Vignette strength={1.0} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
