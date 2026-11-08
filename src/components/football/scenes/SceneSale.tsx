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
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { ClubCrest, ContractDoc, StadiumBackdrop } from "../visuals";

export const SceneSale: React.FC = () => {
  const { t } = useTime();
  const sold = progress(t, 4.35, 0.42, (value) => value);
  const loan = progress(t, 4.8, 0.7);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.red} intensity={0.95} pitch={false} />
      <Glow x="22%" y="24%" size={48} color={FC.red} opacity={0.15} />
      <Glow x="80%" y="70%" size={48} color={FC.orange} opacity={0.09} />

      <Camera from={1.03} to={1.0} duration={10.8} origin="50% 44%">
        <div style={{ position: "absolute", left: 76, top: 92 }}>
          <Kicker start={0.05} color={FC.red} rule={FC.red}>
            {COPY.saleKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: 76, top: 138, width: 720 }}>
          <MaskLine
            start={0.2}
            duration={0.6}
            style={{
              fontFamily: FONT,
              fontSize: 60,
              fontWeight: 600,
              letterSpacing: "-0.03em",
              lineHeight: 1,
              color: FC.silver,
            }}
          >
            THE BREAKUP.
          </MaskLine>
          <MaskLine
            start={0.45}
            duration={0.65}
            style={{
              fontFamily: FONT,
              fontSize: 74,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.88,
              color: FC.white,
            }}
          >
            CONTRACT
            <br />
            <span style={{ color: FC.red }}>TERMINATED.</span>
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            top: 342,
            width: 660,
            opacity: progress(t, 1.1, 0.6),
          }}
        >
          <Mono size={8} color={FC.mute}>
            OFFICIAL STATEMENT
          </Mono>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 19,
              fontWeight: 400,
              fontStyle: "italic",
              lineHeight: 1.35,
              color: FC.silver,
              marginTop: 6,
            }}
          >
            “We have mutually agreed to terminate the contract.”
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            top: 480,
            transform: "rotate(2deg)",
          }}
        >
          <ContractDoc
            width={604}
            accent={FC.red}
            signed={1}
            terminated
            stampText="TERMINATED"
            statusText="PLAYER REGISTRATION · TERMINATED"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 584,
            top: 690,
            transform: `rotate(-7deg) scale(${0.9 + sold * 0.1})`,
            opacity: sold,
            padding: "12px 22px",
            border: `3px solid ${FC.orange}`,
            background: "rgba(8,10,15,0.62)",
            color: FC.orange,
            fontFamily: FONT,
            fontSize: 64,
            fontWeight: 800,
            letterSpacing: "-0.04em",
            lineHeight: 0.9,
            boxShadow: `0 0 70px ${FC.orange}22`,
          }}
        >
          PLAYER
          <br />
          SOLD.
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1120,
            display: "flex",
            gap: 10,
            alignItems: "center",
            opacity: progress(t, 2.0, 0.6),
          }}
        >
          <Tag color={FC.red} background={FC.redSoft} style={{ fontSize: 8 }}>
            CONTRACT: TERMINATED
          </Tag>
          <Tag color={FC.orange} background={FC.orangeSoft} style={{ fontSize: 8 }}>
            STATUS: FREE AGENT
          </Tag>
          <Tag color={FC.dim} background="rgba(245,247,250,0.04)" style={{ fontSize: 8 }}>
            FEELINGS: COMPLICATED
          </Tag>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1182,
            padding: "20px 22px 18px",
            border: `1px solid ${FC.orange}44`,
            background: "linear-gradient(155deg, rgba(38,27,18,0.8), rgba(8,10,15,0.96))",
            opacity: loan,
            transform: `translateY(${(1 - loan) * 34}px)`,
            boxShadow: `0 34px 90px rgba(0,0,0,0.55), 0 0 60px ${FC.orange}12`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: 2, background: FC.orange }} />
              <Mono size={9} color={FC.orange}>
                THE LOOPHOLE
              </Mono>
            </div>
            <Mono size={8} color={FC.mute}>
              LOAN AGREEMENT · STILL ACTIVE
            </Mono>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 18 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <ClubCrest initials="AT" color={FC.silver} size={46} />
              <Mono size={7} color={FC.mute}>
                FORMER CLUB
              </Mono>
            </div>
            <div style={{ flex: 1, position: "relative", height: 54 }}>
              <svg width="100%" height="54" viewBox="0 0 440 54" preserveAspectRatio="none">
                <path
                  d="M 6 27 L 434 27"
                  stroke={FC.orange}
                  strokeWidth="2"
                  strokeDasharray="8 8"
                  pathLength={1}
                  strokeDashoffset={1 - progress(t, 7.2, 0.8)}
                />
                <path d="M 424 18 L 438 27 L 424 36" fill="none" stroke={FC.orange} strokeWidth="2" />
              </svg>
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: -1,
                  transform: "translateX(-50%)",
                  padding: "4px 10px",
                  background: FC.black,
                  border: `1px solid ${FC.orange}55`,
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.14em",
                  color: FC.orange,
                }}
              >
                LOAN
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <ClubCrest initials="RE" color={FC.orange} size={46} />
              <Mono size={7} color={FC.mute}>
                LOAN CLUB
              </Mono>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: FONT, fontSize: 54, fontWeight: 800, letterSpacing: "-0.055em", lineHeight: 0.9, color: FC.white }}>
                {COPY.saleSubTwo}
              </div>
              <div style={{ fontFamily: FONT, fontSize: 15, color: FC.silver, marginTop: 5 }}>
                Still available for friendly matches.
              </div>
            </div>
            <Tag color={FC.orange} background={FC.orangeSoft} style={{ fontSize: 7 }}>
              AVAILABILITY: YES
            </Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1584,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 14,
          }}
        >
          <Mono size={8} color={FC.mute}>
            PLAYER SOLD · LOAN INTACT · FEELINGS PENDING
          </Mono>
          <Mono size={8} color={FC.mute}>
            TRANSFER DESK · 23:59
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 56,
            display: "flex",
            alignItems: "center",
            gap: 10,
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 14,
          }}
        >
          <Mono size={8} color={FC.mute}>
            {COPY.saleTitle}
          </Mono>
          <div style={{ flex: 1, height: 1, background: FC.line }} />
          <Mono size={8} color={FC.orange}>
            {COPY.saleSub}
          </Mono>
        </div>
      </Camera>

      <Beam start={4.3} duration={1.4} color={FC.orange} opacity={0.1} />
      <Scanlines opacity={0.03} />
      <Vignette strength={1.04} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
