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
  Scanlines,
  Tag,
  useTime,
  Vignette,
  WordReveal,
} from "../kit";
import { SeparationDiagram } from "../visuals";

export const SceneConclusion: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 14.4, (x) => x);
  const question = progress(frame, fps, 12.15, 0.7);
  const questionOut = progress(frame, fps, 14.45, 0.45, easeIn);
  const main = 1 - question;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="50%" y="36%" size={62} opacity={0.07} color={C.cyan} />
      <Glow x="18%" y="78%" size={48} opacity={0.05} color={C.green} />
      <GridField opacity={0.2} size={92} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1.018 - camera * 0.018})`,
          transformOrigin: "50% 46%",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: main,
          }}
        >
          <div style={{ position: "absolute", left: margin, top: 96 }}>
            <Kicker start={0.15} color={C.silver} rule={C.cyan}>
              {COPY.conclusionKicker}
            </Kicker>
          </div>

          <div
            style={{
              position: "absolute",
              left: margin,
              top: 160,
              width: 928,
            }}
          >
            <MaskLine
              start={0.3}
              duration={0.75}
              style={{
                fontFamily: FONT,
                fontSize: v(82),
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 0.96,
                color: C.white,
              }}
            >
              AI CAN <span style={{ color: C.cyan }}>BUILD.</span>
            </MaskLine>
            <MaskLine
              start={0.44}
              duration={0.75}
              style={{
                fontFamily: FONT,
                fontSize: v(76),
                fontWeight: 600,
                letterSpacing: "-0.055em",
                lineHeight: 1.02,
                color: C.silver,
              }}
            >
              ENGINEERING
            </MaskLine>
            <MaskLine
              start={0.56}
              duration={0.75}
              style={{
                fontFamily: FONT,
                fontSize: v(76),
                fontWeight: 700,
                letterSpacing: "-0.055em",
                lineHeight: 1.02,
                color: C.white,
              }}
            >
              MUST PROTECT.
            </MaskLine>
          </div>

          <div
            style={{
              position: "absolute",
              left: margin,
              top: 500,
              width: 928,
            }}
          >
            <SeparationDiagram start={1.1} />
          </div>

          <div
            style={{
              position: "absolute",
              left: margin,
              right: margin,
              top: 968,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: progress(frame, fps, 2.7, 0.7),
            }}
          >
            <Mono size={9} color={C.cyan} style={{ letterSpacing: "0.16em" }}>
              SEPARATE ENVIRONMENTS
            </Mono>
            <Mono size={9} color={C.dim} style={{ letterSpacing: "0.14em" }}>
              SEPARATE RISK
            </Mono>
          </div>

          <div
            style={{
              position: "absolute",
              left: margin,
              top: 1040,
              width: 880,
            }}
          >
            <WordReveal
              text="BUT YOUR PRODUCTION DATA SHOULD NEVER DEPEND ON AN INSTRUCTION ALONE."
              start={8.8}
              stagger={0.055}
              style={{
                fontFamily: FONT,
                fontSize: v(27),
                fontWeight: 500,
                letterSpacing: "0.06em",
                lineHeight: 1.55,
                color: C.silver,
              }}
              emphasis={["PRODUCTION", "NEVER", "INSTRUCTION"]}
              emphasisStyle={{ color: C.white }}
              wordStyle={{
                fontFamily: FONT,
                fontSize: v(27),
                fontWeight: 500,
                letterSpacing: "0.06em",
              }}
            />
          </div>

          <div
            style={{
              position: "absolute",
              left: margin,
              right: margin,
              top: 1330,
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: progress(frame, fps, 4.2, 0.8),
            }}
          >
            <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 8 }}>
              ISOLATED DEV
            </Tag>
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8 }}>
              RESTRICTED PERMISSIONS
            </Tag>
            <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 8 }}>
              TESTED BACKUPS
            </Tag>
          </div>

          <div
            style={{
              position: "absolute",
              left: margin,
              right: margin,
              bottom: 92,
              opacity: progress(frame, fps, 10.2, 0.8),
            }}
          >
            <Divider color={C.lineSoft} />
            <div style={{ marginTop: 14, maxWidth: 850 }}>
              <Mono size={8} color={C.mute} style={{ letterSpacing: "0.12em", lineHeight: 1.7 }}>
                {COPY.sourceFinePrint}
              </Mono>
            </div>
          </div>
        </div>

        {/* Final question — the hand-off into the branded close */}
        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 560,
            opacity: question * (1 - questionOut),
            transform: `translateY(${(1 - question) * 26}px)`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 38,
              opacity: 0.8,
            }}
          >
            <div style={{ width: 40, height: 1, background: C.cyan }} />
            <Mono size={9} color={C.cyan}>
              THE QUESTION
            </Mono>
          </div>
          <MaskLine
            start={12.2}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: v(58),
              fontWeight: 500,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: C.silver,
            }}
          >
            {COPY.finalQuestion[0]}
          </MaskLine>
          <MaskLine
            start={12.3}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: v(58),
              fontWeight: 600,
              letterSpacing: "-0.04em",
              lineHeight: 1.02,
              color: C.white,
            }}
          >
            {COPY.finalQuestion[1]}
          </MaskLine>
          <MaskLine
            start={12.42}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(116),
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.92,
              color: C.cyan,
              textShadow: `0 0 60px ${C.cyanSoft}`,
            }}
          >
            {COPY.finalQuestion[2]}
          </MaskLine>
          <div
            style={{
              marginTop: 34,
              height: 2,
              width: `${progress(frame, fps, 12.7, 0.7) * 76}%`,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.blue}, transparent)`,
            }}
          />
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "#000000",
          opacity: questionOut * 0.85,
          pointerEvents: "none",
          zIndex: 90,
        }}
      />
      <Beam start={6.4} duration={2.4} color={C.cyan} opacity={0.06} />
      <Scanlines opacity={0.025} spacing={6} />
      <Vignette strength={0.9} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
