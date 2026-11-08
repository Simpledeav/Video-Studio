import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT, MONO } from "../../../config/football";
import {
  Beam,
  Camera,
  Glow,
  Grain,
  Kicker,
  LowerThird,
  MaskLine,
  Mono,
  progress,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { PhoneNotification, StadiumBackdrop, TransferToast } from "../visuals";

export const SceneReturn: React.FC = () => {
  const { t } = useTime();
  const phone = progress(t, 1.0, 0.8);
  const typing = progress(t, 3.4, 0.4);
  const reopen = progress(t, 6.4, 0.6);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.pink} intensity={0.8} pitch={false} />
      <Glow x="50%" y="36%" size={44} color={FC.pink} opacity={0.12} />
      <Glow x="16%" y="78%" size={44} color={FC.cyan} opacity={0.05} />

      <div
        style={{
          position: "absolute",
          right: -50,
          top: 620,
          fontFamily: FONT,
          fontSize: 330,
          fontWeight: 800,
          letterSpacing: "-0.08em",
          color: "rgba(245,247,250,0.028)",
          lineHeight: 0.8,
          pointerEvents: "none",
        }}
      >
        OPEN
      </div>

      <Camera from={1.025} to={1.0} duration={10.8} origin="50% 42%">
        <div style={{ position: "absolute", left: 76, top: 92 }}>
          <Kicker start={0.05} color={FC.pink} rule={FC.pink}>
            {COPY.returnKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: 76, top: 138, width: 760 }}>
          <MaskLine
            start={0.2}
            duration={0.6}
            style={{
              fontFamily: FONT,
              fontSize: 54,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1,
              color: FC.silver,
            }}
          >
            THE TRANSFER WINDOW
          </MaskLine>
          <MaskLine
            start={0.36}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: 94,
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: FC.white,
            }}
          >
            IS <span style={{ color: FC.red }}>CLOSED.</span>
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            right: 76,
            top: 112,
            textAlign: "right",
            opacity: progress(t, 0.6, 0.6),
          }}
        >
          <Mono size={8} color={FC.mute}>
            DEADLINE PASSED
          </Mono>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 38,
              fontWeight: 600,
              letterSpacing: "0.06em",
              color: FC.red,
              fontVariantNumeric: "tabular-nums",
              marginTop: 4,
              textShadow: `0 0 24px ${FC.red}55`,
            }}
          >
            00:00:00
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 200,
            right: 200,
            top: 680,
            display: "flex",
            justifyContent: "center",
            opacity: phone,
            transform: `translateY(${(1 - phone) * 46}px) scale(${0.96 + phone * 0.04})`,
          }}
        >
          <PhoneNotification
            width={680}
            time="23:47"
            title="FORMER CLUB"
            message="Can we talk?"
            accent={FC.pink}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 200,
            right: 200,
            top: 906,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            opacity: typing,
          }}
        >
          <Mono size={8} color={FC.mute}>
            SEEN 23:48
          </Mono>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <Mono size={8} color={FC.pink}>
              TYPING
            </Mono>
            <div style={{ display: "flex", gap: 3 }}>
              {[0, 1, 2].map((index) => (
                <span
                  key={index}
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: FC.pink,
                    opacity: 0.4 + 0.6 * Math.abs(Math.sin(t * 4 + index * 0.7)),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 200,
            right: 200,
            top: 1000,
            opacity: progress(t, 1.4, 0.6),
          }}
        >
          <div
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${FC.line}, ${FC.pink}66, ${FC.line})`,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 12 }}>
            <div>
              <Mono size={7} color={FC.mute}>
                23:41
              </Mono>
              <div style={{ fontFamily: FONT, fontSize: 12, color: FC.silver, marginTop: 3 }}>Window closes</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <Mono size={7} color={FC.pink}>
                23:47
              </Mono>
              <div style={{ fontFamily: FONT, fontSize: 12, color: FC.white, marginTop: 3 }}>Message received</div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 200,
            right: 200,
            top: 1120,
            opacity: progress(t, 4.7, 0.55),
            transform: `translateY(${(1 - progress(t, 4.7, 0.55)) * 22}px)`,
          }}
        >
          <TransferToast
            label="TRANSFER DESK · 23:47"
            title="NEW OFFER RECEIVED"
            accent={FC.cyan}
            width={680}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1280,
            opacity: reopen,
            transform: `translateY(${(1 - reopen) * 30}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Tag color={FC.cyan} background={FC.cyanSoft} style={{ fontSize: 8 }}>
              STATUS UPDATE
            </Tag>
            <Mono size={8} color={FC.mute}>
              THE WINDOW WAS NEVER REALLY CLOSED
            </Mono>
          </div>
          <MaskLine
            start={6.5}
            duration={0.6}
            style={{
              fontFamily: FONT,
              fontSize: 74,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: FC.silver,
            }}
          >
            NEGOTIATIONS
          </MaskLine>
          <MaskLine
            start={6.65}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.84,
              color: FC.cyan,
              textShadow: `0 0 60px ${FC.cyan}33`,
            }}
          >
            REOPENED.
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1540,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 16,
            opacity: progress(t, 7.4, 0.6),
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 500, color: FC.white }}>
            “CAN WE TALK?” — THE MOST EXPENSIVE FOUR WORDS IN FOOTBALL.
          </div>
          <Mono size={8} color={FC.mute}>
            CONTRACT: REOPENED
          </Mono>
        </div>

        <LowerThird
          label="TRANSFER WINDOW"
          value="CLOSED AT 23:41. REOPENED AT 23:47."
          accent={FC.pink}
          start={1.0}
          style={{ bottom: 98 }}
        />

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 52,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 12,
          }}
        >
          <Mono size={8} color={FC.mute}>
            LATE-NIGHT OFFER · ILLUSTRATIVE
          </Mono>
          <Mono size={8} color={FC.mute}>
            DO NOT DISTURB · EXCEPT HIM
          </Mono>
        </div>
      </Camera>

      <Beam start={6.2} duration={1.6} color={FC.cyan} opacity={0.09} />
      <Scanlines opacity={0.03} />
      <Vignette strength={1.0} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
