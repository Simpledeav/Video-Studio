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
  WordReveal,
} from "../kit";
import { DatabaseCylinder, RecoveryConsole } from "../visuals";

export const SceneRecovery: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 8.4, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 8.3, 0.3, easeIn);
  const restore = progress(frame, fps, 2.4, 2.1);
  const beam = progress(frame, fps, 4.2, 1.6);

  return (
    <AbsoluteFill style={{ background: "#06090D", overflow: "hidden" }}>
      <Glow x="22%" y="14%" size={58} opacity={0.11} color={C.cyan} />
      <Glow x="82%" y="70%" size={54} opacity={0.08} color={C.green} />
      <GridField opacity={0.24} size={88} color="rgba(82,224,164,0.055)" />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1.035 - camera * 0.035})`,
          transformOrigin: "50% 50%",
          opacity: sceneOut,
        }}
      >
        <div style={{ position: "absolute", left: margin, top: 100 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan}>
            {COPY.recoveryKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            right: margin,
            top: 92,
            display: "flex",
            gap: 8,
          }}
        >
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8 }}>
            REPORTED
          </Tag>
          <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 8 }}>
            RECOVERY
          </Tag>
        </div>

        <div
          style={{
            position: "absolute",
            left: 90,
            top: 190,
            width: 900,
          }}
        >
          <RecoveryConsole start={0.5} width={900} />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 690,
            width: 928,
          }}
        >
          <MaskLine
            start={2.55}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: v(142),
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: C.cyan,
              textShadow: `0 0 60px ${C.cyanSoft}`,
            }}
          >
            {COPY.recoveryAction}
          </MaskLine>
          <div
            style={{
              marginTop: 10,
              height: 2,
              width: `${progress(frame, fps, 2.7, 0.75) * 100}%`,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.green}, transparent)`,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 860,
            width: 700,
          }}
        >
          <WordReveal
            text={COPY.recoveryTitle}
            start={3.65}
            stagger={0.09}
            style={{
              fontFamily: FONT,
              fontSize: v(40),
              fontWeight: 600,
              letterSpacing: "0.08em",
              color: C.white,
            }}
            wordStyle={{
              fontFamily: FONT,
              fontSize: v(40),
              fontWeight: 600,
              letterSpacing: "0.08em",
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 950,
            width: 760,
          }}
        >
          <WordReveal
            text={COPY.recoveryResult}
            start={5.15}
            stagger={0.07}
            style={{
              fontFamily: FONT,
              fontSize: v(52),
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: C.white,
            }}
            emphasis={["RESTORED"]}
            emphasisStyle={{ color: C.green }}
            wordStyle={{
              fontFamily: FONT,
              fontSize: v(52),
              fontWeight: 600,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 724,
            top: 1010,
            width: 250,
            height: 320,
            opacity: 0.9,
          }}
        >
          <DatabaseCylinder
            size={250}
            start={2.6}
            health={restore}
            label="CONTACTS"
            accent={C.green}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1370,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: progress(frame, fps, 3.2, 0.7),
          }}
        >
          <Mono size={9} color={C.cyan}>
            1,206
          </Mono>
          <div
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.green})`,
              opacity: 0.35,
            }}
          />
          <Mono size={9} color={C.green}>
            RECOVERED
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1410,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
            opacity: progress(frame, fps, 4.0, 0.7),
          }}
        >
          {[
            { label: "SNAPSHOT", value: "FOUND", color: C.cyan },
            { label: "ROLLBACK", value: "WORKED", color: C.green },
            { label: "DATA", value: "RESTORED", color: C.green },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                border: `1px solid ${item.color}33`,
                background: `${item.color}0C`,
                borderRadius: 6,
                padding: "11px 12px",
              }}
            >
              <Mono size={8} color={C.mute}>
                {item.label}
              </Mono>
              <div
                style={{
                  marginTop: 5,
                  fontFamily: MONO,
                  fontSize: 11,
                  letterSpacing: "0.1em",
                  color: item.color,
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 1540,
            width: 880,
            opacity: progress(frame, fps, 5.6, 0.8) * 0.9,
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
            The reported claim was wrong. A rollback restored the records.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1660,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: progress(frame, fps, 4.5, 0.8),
          }}
        >
          <Divider color={`${C.green}44`} style={{ width: 90 }} />
          <Mono size={8} color={C.mute}>
            {COPY.reconstruction}
          </Mono>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: beam > 0 && beam < 1 ? Math.sin(beam * Math.PI) * 0.045 : 0,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <Beam start={4.1} duration={1.8} color={C.green} opacity={0.1} />
      <Scanlines opacity={0.035} spacing={5} />
      <Vignette strength={0.94} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
