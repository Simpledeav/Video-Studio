import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/replit";
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
} from "../kit";
import { ArchitectureMap } from "../visuals";

const PRINCIPLES = [
  { label: "LEAST PRIVILEGE", color: C.cyan, start: 5.9 },
  { label: "HUMAN APPROVAL", color: C.orange, start: 7.7 },
  { label: "TESTED RECOVERY", color: C.green, start: 9.4 },
];

export const SceneLesson: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 13.8, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 13.6, 0.3, easeIn);
  const sweep = progress(frame, fps, 8.2, 2.0);

  return (
    <AbsoluteFill style={{ background: "#070A0F", overflow: "hidden" }}>
      <Glow x="20%" y="12%" size={58} opacity={0.09} color={C.cyan} />
      <Glow x="84%" y="54%" size={56} opacity={0.06} color={C.blue} />
      <Glow x="50%" y="94%" size={50} opacity={0.05} color={C.green} />
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
        <div style={{ position: "absolute", left: margin, top: 88 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan}>
            {COPY.lessonKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 146,
            width: 928,
          }}
        >
          <MaskLine
            start={0.25}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(60),
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              color: C.silver,
            }}
          >
            {COPY.lessonTitle[0]}
          </MaskLine>
          <MaskLine
            start={0.36}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(60),
              fontWeight: 600,
              letterSpacing: "-0.05em",
              lineHeight: 0.98,
              color: C.white,
            }}
          >
            {COPY.lessonTitle[1]}
          </MaskLine>
          <MaskLine
            start={0.47}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: v(66),
              fontWeight: 700,
              letterSpacing: "-0.05em",
              lineHeight: 1.02,
              color: C.cyan,
            }}
          >
            SECURITY <span style={{ color: C.white }}>CONTROLS.</span>
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 128,
            top: 408,
            width: 828,
            height: 1010,
            transform: "scale(0.92)",
            transformOrigin: "top center",
          }}
        >
          <ArchitectureMap start={3.4} scale={1} />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: 260,
            display: "flex",
            gap: 9,
          }}
        >
          {PRINCIPLES.map((item) => (
            <div
              key={item.label}
              style={{
                flex: 1,
                border: `1px solid ${item.color}33`,
                background: `${item.color}0D`,
                borderRadius: 5,
                padding: "10px 10px",
                opacity: progress(frame, fps, item.start, 0.6),
                transform: `translateY(${(1 - progress(frame, fps, item.start, 0.6)) * 10}px)`,
              }}
            >
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.12em",
                  color: item.color,
                  lineHeight: 1.4,
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: 188,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: progress(frame, fps, 10.2, 0.8),
          }}
        >
          <Divider color={`${C.cyan}44`} style={{ width: 60 }} />
          <Mono size={9} color={C.dim} style={{ letterSpacing: "0.14em" }}>
            INSTRUCTIONS ARE CONTEXT. PERMISSIONS ARE CONTROL.
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: progress(frame, fps, 11.2, 0.8) * 0.7,
          }}
        >
          <Mono size={8} color={C.mute}>
            ARCHITECTURE · NOT URGENCY
          </Mono>
          <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 7, padding: "4px 7px" }}>
            ISOLATED BY DEFAULT
          </Tag>
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
      <Beam start={8.0} duration={2.2} color={C.cyan} opacity={0.06} />
      <Scanlines opacity={0.03} spacing={6} />
      <Vignette strength={0.92} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
