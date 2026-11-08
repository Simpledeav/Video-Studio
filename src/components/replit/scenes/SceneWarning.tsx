import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, useStage } from "../../../config/replit";
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
  PulseRing,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { FreezeLock, FreezePanel, StatusChip } from "../visuals";

export const SceneWarning: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 7.4, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 7.25, 0.35, easeIn);
  const tension = progress(frame, fps, 6.0, 1.2, (x) => x);

  return (
    <AbsoluteFill style={{ background: "#080B12", overflow: "hidden" }}>
      <Glow x="50%" y="32%" size={58} opacity={0.11} color={C.blue} />
      <Glow x="50%" y="86%" size={48} opacity={0.06 + tension * 0.06} color={C.orange} />
      <GridField opacity={0.28} size={92} color="rgba(167,176,188,0.06)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.03})`,
          transformOrigin: "50% 52%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 100 }}>
          <Kicker start={0.15} color={C.silver} rule={C.orange}>
            {COPY.warningKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 176,
            width: 928,
            textAlign: "center",
          }}
        >
          <MaskLine
            start={0.35}
            duration={0.8}
            style={{
              fontFamily: FONT,
              fontSize: v(108),
              fontWeight: 600,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: C.silver,
            }}
          >
            {COPY.warningTitle[0]}
          </MaskLine>
          <MaskLine
            start={0.5}
            duration={0.82}
            style={{
              fontFamily: FONT,
              fontSize: v(122),
              fontWeight: 700,
              letterSpacing: "-0.065em",
              lineHeight: 0.9,
              color: C.white,
              textShadow: `0 0 60px ${C.blueSoft}`,
            }}
          >
            {COPY.warningTitle[1]}
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 432,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <FreezeLock size={400} start={0.9} locked />
          <PulseRing x={540} y={632} size={520} color={C.orange} start={1.4} opacity={0.14} speed={0.55} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 160,
            top: 850,
            width: 760,
          }}
        >
          <FreezePanel start={1.5} width={760} />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1210,
            display: "flex",
            gap: 10,
          }}
        >
          <StatusChip label="CODE" value="FROZEN" color={C.orange} start={2.1} />
          <StatusChip label="ACTIONS" value="FROZEN" color={C.orange} start={2.3} />
          <StatusChip label="APPROVAL" value="REQUIRED" color={C.white} start={2.5} />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1320,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: progress(frame, fps, 3.0, 0.7),
          }}
        >
          <Divider color={`${C.orange}44`} style={{ width: 70 }} />
          <Mono size={9} color={C.dim} style={{ letterSpacing: "0.16em" }}>
            {COPY.warningLines[0]} · {COPY.warningLines[1]}
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 1400,
            width: 820,
            opacity: progress(frame, fps, 4.4, 0.8) * 0.9,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(18),
              fontWeight: 500,
              letterSpacing: "0.07em",
              lineHeight: 1.65,
              color: C.dim,
            }}
          >
            A controlled environment. A clear instruction. A boundary that was
            supposed to hold.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 1540,
            display: "flex",
            justifyContent: "center",
            opacity: tension,
          }}
        >
          <Reveal start={6.0} y={10}>
            <Tag
              color={C.orange}
              background={C.orangeSoft}
              style={{
                fontSize: 9,
                padding: "7px 12px",
                boxShadow: tension > 0.6 ? `0 0 30px ${C.orangeSoft}` : "none",
              }}
            >
              AWAITING APPROVAL
            </Tag>
          </Reveal>
        </div>
      </div>

      <Beam start={2.0} duration={1.8} color={C.blue} opacity={0.07} />
      <Scanlines opacity={0.045} spacing={5} />
      <Vignette strength={1.0} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
