import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT, MONO } from "../../../config/football";
import {
  Beam,
  Camera,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Reveal,
  Scanlines,
  Scoreboard,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { JerseySeven, StadiumBackdrop } from "../visuals";

export const SceneHook: React.FC = () => {
  const { t } = useTime();
  const jar = progress(t, 3.2, 0.5);
  const push = progress(t, 0, 7);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.gold} intensity={1.05} />
      <Glow x="50%" y="33%" size={46} color={FC.gold} opacity={0.11} />
      <Glow x="78%" y="72%" size={50} color={FC.pitchLight} opacity={0.06} />

      <Camera from={1.075} to={1.0} duration={7} origin="50% 38%">
        <div style={{ position: "absolute", left: 76, top: 96 }}>
          <Kicker start={0.1} color={FC.silver} rule={FC.gold}>
            {COPY.hookKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", right: 76, top: 88, textAlign: "right" }}>
          <Mono size={9} color={FC.mute}>
            INTERNATIONAL WINDOW · CLOSED
          </Mono>
          <Scoreboard left="7" right="0" start={0.4} style={{ marginTop: 10 }} />
        </div>

        {/* the number seven, alone under the lights */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 208,
            transform: `translateX(-50%) scale(${1 + push * 0.035})`,
            opacity: 0.94,
            filter: "drop-shadow(0 50px 70px rgba(0,0,0,0.7))",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: "-18%",
              background: `radial-gradient(circle at 50% 42%, ${FC.gold}1F 0%, transparent 66%)`,
              filter: "blur(12px)",
            }}
          />
          <JerseySeven width={420} accent={FC.gold} tone="gold" number="7" />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            top: 730,
            width: 928,
          }}
        >
          <MaskLine
            start={0.55}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: 70,
              fontWeight: 600,
              letterSpacing: "0.02em",
              lineHeight: 0.98,
              color: FC.silver,
            }}
          >
            {COPY.hookLineOne}
          </MaskLine>
          <MaskLine
            start={0.66}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: 158,
              fontWeight: 800,
              letterSpacing: "-0.075em",
              lineHeight: 0.82,
              color: FC.white,
              textShadow: "0 10px 60px rgba(0,0,0,0.8)",
            }}
          >
            {COPY.hookLineTwo}
          </MaskLine>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              alignItems: "center",
              gap: 14,
              opacity: progress(t, 2.4, 0.5),
            }}
          >
            <Tag color={FC.gold} background={FC.goldSoft}>
              INTERNATIONAL RETIREMENT
            </Tag>
            <Mono size={9} color={FC.mute}>
              OFFICIAL. EMOTIONAL. FINAL.
            </Mono>
          </div>
        </div>

        {/* second thought */}
        <div
          style={{
            position: "absolute",
            left: 76,
            top: 1180,
            width: 928,
            opacity: jar,
          }}
        >
          <div style={{ height: 1, background: FC.line, marginBottom: 24 }} />
          <MaskLine
            start={3.3}
            duration={0.55}
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: FC.silver,
            }}
          >
            {COPY.hookLineThree}
          </MaskLine>
          <MaskLine
            start={3.4}
            duration={0.55}
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: FC.silver,
            }}
          >
            {COPY.hookLineFour}
          </MaskLine>
          <MaskLine
            start={3.5}
            duration={0.6}
            style={{
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.05em",
              lineHeight: 0.95,
              color: FC.gold,
            }}
          >
            {COPY.hookLineFive}
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1550,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            opacity: progress(t, 4.55, 0.55),
            transform: `translateY(${(1 - progress(t, 4.55, 0.55)) * 14}px)`,
          }}
        >
          <div
            style={{
              border: `1px solid ${FC.gold}55`,
              background: "rgba(8,10,15,0.78)",
              padding: "13px 16px",
              fontFamily: MONO,
              fontSize: 15,
              letterSpacing: "0.16em",
              color: FC.gold,
              boxShadow: `0 0 44px ${FC.gold}12`,
            }}
          >
            {COPY.hookSub}
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["L1", "L2", "L3"].map((league, index) => (
              <Reveal key={league} start={4.9 + index * 0.12} y={10}>
                <div
                  style={{
                    width: 46,
                    height: 46,
                    border: `1px solid ${FC.line}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: MONO,
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    color: index === 0 ? FC.gold : FC.silver,
                    background: index === 0 ? FC.goldSoft : "rgba(8,10,15,0.7)",
                  }}
                >
                  {league}
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 14,
            opacity: progress(t, 1.0, 0.7),
          }}
        >
          <Mono size={9} color={FC.mute}>
            {COPY.hookFooter}
          </Mono>
          <Mono size={9} color={FC.mute}>
            STADIUM 07 · 20:45
          </Mono>
        </div>
      </Camera>

      <Beam start={3.05} duration={1.5} color={FC.gold} opacity={0.1} />
      <Scanlines opacity={0.035} />
      <Vignette strength={1.04} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
