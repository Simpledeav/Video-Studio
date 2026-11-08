import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT } from "../../../config/football";
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
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { ContractDoc, JerseySeven, PlayerCard, StadiumBackdrop } from "../visuals";

export const SceneSigning: React.FC = () => {
  const { t } = useTime();
  const signed = progress(t, 2.05, 0.9);
  const stamp = progress(t, 2.55, 0.35, (value) => value);
  const firstTeam = t > 3.4;
  const cardIn = progress(t, 2.2, 0.8);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.gold} intensity={0.92} pitch={false} variant="gold" />
      <Glow x="76%" y="24%" size={54} color={FC.gold} opacity={0.16} />
      <Glow x="18%" y="72%" size={46} color={FC.gold} opacity={0.08} />

      <div
        style={{
          position: "absolute",
          right: -70,
          top: 160,
          opacity: 0.1,
          transform: "rotate(8deg)",
        }}
      >
        <JerseySeven width={620} accent={FC.gold} tone="gold" number="7" />
      </div>

      <Camera from={1.03} to={1.0} duration={8.4} origin="50% 48%">
        <div style={{ position: "absolute", left: 76, top: 92 }}>
          <Kicker start={0.05} color={FC.gold} rule={FC.gold}>
            {COPY.signingKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", right: 76, top: 84, display: "flex", gap: 6 }}>
          <Tag color={FC.pitchLight} background={`${FC.pitchLight}16`} style={{ fontSize: 8 }}>
            01 SCOUTED
          </Tag>
          <Tag
            color={t > 2.4 ? FC.gold : FC.dim}
            background={t > 2.4 ? FC.goldSoft : "rgba(245,247,250,0.03)"}
            style={{ fontSize: 8 }}
          >
            02 SIGNED
          </Tag>
          <Tag
            color={firstTeam ? FC.white : FC.dim}
            background={firstTeam ? "rgba(245,247,250,0.1)" : "rgba(245,247,250,0.03)"}
            style={{ fontSize: 8 }}
          >
            03 FIRST TEAM
          </Tag>
        </div>

        <div style={{ position: "absolute", left: 76, top: 148, width: 700 }}>
          <MaskLine
            start={0.25}
            duration={0.6}
            style={{
              fontFamily: FONT,
              fontSize: 46,
              fontWeight: 600,
              letterSpacing: "0.01em",
              lineHeight: 1,
              color: FC.silver,
            }}
          >
            THE TALKING STAGE IS OVER.
          </MaskLine>
          <MaskLine
            start={0.42}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 0.88,
              color: FC.white,
            }}
          >
            {COPY.signingTitle}
          </MaskLine>
          <div
            style={{
              width: `${signed * 100}%`,
              maxWidth: 420,
              height: 2,
              background: FC.gold,
              marginTop: 14,
              boxShadow: `0 0 23px ${FC.gold}88`,
            }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            top: 438,
            transform: "rotate(-2.2deg)",
          }}
        >
          <ContractDoc
            width={600}
            accent={FC.gold}
            signed={stamp}
            stampText="SIGNED"
            statusText="PLAYER REGISTRATION · FIRST TEAM"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 646,
            top: 540,
            opacity: cardIn,
            transform: `translateY(${(1 - cardIn) * 90}px) rotate(${3.2 - cardIn * 0.6}deg)`,
          }}
        >
          <PlayerCard
            width={324}
            accent={FC.gold}
            status={firstTeam ? "FIRST TEAM" : "CONTRACT"}
            statusColor={firstTeam ? FC.pitchLight : FC.gold}
            variant="gold"
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1038,
            opacity: progress(t, 2.2, 0.6),
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
            <Mono size={7} color={FC.mute}>
              18:24 · SCOUTED
            </Mono>
            <Mono size={7} color={FC.gold}>
              19:05 · SIGNED
            </Mono>
            <Mono size={7} color={FC.pitchLight}>
              19:06 · FIRST TEAM
            </Mono>
          </div>
          <div style={{ position: "relative", height: 2, background: FC.line }}>
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: 2,
                width: `${progress(t, 2.3, 1.1) * 100}%`,
                background: FC.gold,
                boxShadow: `0 0 18px ${FC.gold}88`,
              }}
            />
            {[0, 50, 100].map((left, index) => (
              <span
                key={left}
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: -4,
                  width: 10,
                  height: 10,
                  marginLeft: left === 100 ? -10 : 0,
                  borderRadius: "50%",
                  background: index === 0 ? FC.silver : index === 1 ? FC.gold : FC.pitchLight,
                  boxShadow: `0 0 14px ${index === 0 ? FC.silver : index === 1 ? FC.gold : FC.pitchLight}`,
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1236,
            display: "flex",
            alignItems: "stretch",
            gap: 0,
            borderTop: `1px solid ${FC.gold}44`,
            borderBottom: `1px solid ${FC.gold}44`,
            background: "rgba(8,10,15,0.72)",
            opacity: progress(t, 2.8, 0.6),
            transform: `translateY(${(1 - progress(t, 2.8, 0.6)) * 18}px)`,
          }}
        >
          <div
            style={{
              width: 92,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRight: `1px solid ${FC.gold}33`,
              fontFamily: FONT,
              fontSize: 50,
              fontWeight: 800,
              color: FC.gold,
            }}
          >
            1
          </div>
          <div style={{ flex: 1, padding: "16px 20px" }}>
            <Mono size={8} color={FC.mute}>
              RELATIONSHIP REGISTRATION CONFIRMED
            </Mono>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 29,
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1,
                color: FC.white,
                marginTop: 5,
              }}
            >
              OFFICIALLY HIS NUMBER ONE STRIKER.
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", paddingRight: 18 }}>
            <Tag color={FC.gold} background={FC.goldSoft} style={{ fontSize: 8 }}>
              EXCLUSIVE
            </Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1408,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 18,
          }}
        >
          {[
            { value: "01", label: "TALKING STAGE", color: FC.silver },
            { value: "01", label: "SIGNING CEREMONY", color: FC.gold },
            { value: "100%", label: "EXCLUSIVITY", color: FC.pitchLight },
          ].map((stat, index) => (
            <Reveal key={stat.label} start={3.2 + index * 0.12} y={16}>
              <div style={{ borderTop: `1px solid ${FC.line}`, paddingTop: 12 }}>
                <div style={{ fontFamily: FONT, fontSize: 34, fontWeight: 800, letterSpacing: "-0.04em", color: stat.color }}>
                  {stat.value}
                </div>
                <Mono size={8} color={FC.mute} style={{ display: "block", marginTop: 4 }}>
                  {stat.label}
                </Mono>
              </div>
            </Reveal>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 66,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 14,
          }}
        >
          <Mono size={9} color={FC.mute}>
            CONTRACT STATUS: PRESTIGIOUS · TERMS: EMOTIONAL
          </Mono>
          <Mono size={9} color={FC.gold}>
            NUMBER 7 · FIRST TEAM
          </Mono>
        </div>
      </Camera>

      <Beam start={2.35} duration={1.5} color={FC.gold} opacity={0.16} />
      <Scanlines opacity={0.028} />
      <Vignette strength={1.0} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
