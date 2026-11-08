import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT, MONO } from "../../../config/football";
import {
  Beam,
  Camera,
  Counter,
  Dot,
  Glow,
  Grain,
  Kicker,
  LowerThird,
  Mono,
  Panel,
  PanelHeader,
  progress,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import {
  LeagueTable,
  MiniForm,
  PlayerCard,
  StadiumBackdrop,
  StatMeter,
  Trophy,
} from "../visuals";

export const SceneLeague: React.FC = () => {
  const { t } = useTime();
  const bench = progress(t, 7.3, 0.45);
  const cardDim = 1 - progress(t, 7.2, 1.2) * 0.5;

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.red} intensity={1.0} variant="night" />
      <Glow x="20%" y="26%" size={46} color={FC.red} opacity={0.13} />
      <Glow x="80%" y="62%" size={44} color={FC.orange} opacity={0.07} />

      <Camera from={1.03} to={1.0} duration={11.2} origin="50% 40%">
        <div style={{ position: "absolute", left: 76, top: 92 }}>
          <Kicker start={0.05} color={FC.red} rule={FC.red}>
            {COPY.leagueKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: 76, top: 140, width: 640 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 70,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: FC.white,
            }}
          >
            MINUTES
            <br />
            <span style={{ color: FC.red }}>REDUCED.</span>
          </div>
          <div style={{ fontFamily: FONT, fontSize: 17, color: FC.silver, marginTop: 12, letterSpacing: "0.01em" }}>
            {COPY.leagueSub}
          </div>
        </div>

        <div style={{ position: "absolute", right: 88, top: 170 }}>
          <Trophy width={176} accent={FC.gold} start={0.6} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 358,
            display: "grid",
            gridTemplateColumns: "1.1fr 1.1fr 0.8fr",
            gap: 18,
          }}
        >
          {[
            { label: "MINUTES / MATCH", value: "90 → 12", color: FC.red, start: 0.8 },
            { label: "MANAGER INTEREST", value: "94 → 22%", color: FC.orange, start: 1.5 },
            { label: "TROPHIES", value: "01", color: FC.gold, start: 2.1 },
          ].map((stat) => (
            <Reveal key={stat.label} start={stat.start} y={16}>
              <div style={{ borderTop: `1px solid ${FC.line}`, paddingTop: 11 }}>
                <div style={{ fontFamily: FONT, fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", color: stat.color, lineHeight: 0.95 }}>
                  {stat.value}
                </div>
                <Mono size={7} color={FC.mute} style={{ display: "block", marginTop: 5 }}>
                  {stat.label}
                </Mono>
              </div>
            </Reveal>
          ))}
        </div>

        <Panel
          start={1.1}
          accent={`${FC.red}33`}
          style={{ position: "absolute", left: 76, top: 500, width: 680 }}
        >
          <PanelHeader
            left="DOMESTIC LEAGUE · TABLE"
            accent={FC.red}
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Dot color={FC.red} size={5} pulse />
                <Mono size={8} color={FC.red}>
                  LIVE
                </Mono>
              </div>
            }
          />
          <div style={{ padding: "8px 8px 6px" }}>
            <LeagueTable width={664} accent={FC.red} dimFrom={0.55} start={1.5} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 18px 14px" }}>
            <Mono size={8} color={FC.mute}>
              MATCHDAY 12 · FORM
            </Mono>
            <MiniForm results={["W", "W", "W", "D", "L"]} start={3.2} />
          </div>
        </Panel>

        <div
          style={{
            position: "absolute",
            left: 770,
            top: 550,
            transform: "rotate(2.4deg)",
            opacity: cardDim,
          }}
        >
          <PlayerCard
            width={278}
            accent={FC.red}
            status="BENCH"
            statusColor={FC.red}
            variant="graphite"
            dim={0.9}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            top: 1030,
            width: 700,
            display: "grid",
            gap: 14,
          }}
        >
          <StatMeter label="MANAGER INTEREST" value="22%" pct={22} start={3.4} color={FC.red} />
          <StatMeter label="STARTING XI PROBABILITY" value="8%" pct={8} start={3.8} color={FC.orange} height={5} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Mono size={8} color={FC.mute}>
              SQUAD STATUS
            </Mono>
            <Tag color={FC.red} background={FC.redSoft} style={{ fontSize: 7 }}>
              SURPLUS TO REQUIREMENTS
            </Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 790,
            top: 890,
            width: 190,
            padding: "14px 16px",
            border: `1px solid ${FC.red}44`,
            background: "rgba(8,10,15,0.72)",
            opacity: progress(t, 4.6, 0.6),
          }}
        >
          <Mono size={8} color={FC.mute}>
            MINUTES
          </Mono>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <div style={{ fontFamily: FONT, fontSize: 56, fontWeight: 800, letterSpacing: "-0.06em", color: FC.red, lineHeight: 0.95 }}>
              <Counter value={12} start={4.6} duration={1.2} />
            </div>
            <Mono size={8} color={FC.mute}>
              / 90
            </Mono>
          </div>
          <div style={{ height: 4, background: FC.line, marginTop: 8 }}>
            <div style={{ width: `${progress(t, 4.6, 1.2) * 13}%`, height: "100%", background: FC.red }} />
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 790,
            top: 1060,
            width: 190,
            textAlign: "center",
            transform: `rotate(-7deg) scale(${bench})`,
            opacity: bench,
            border: `2px solid ${FC.red}`,
            padding: "9px 0",
            fontFamily: MONO,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: "0.2em",
            color: FC.red,
            background: "rgba(8,10,15,0.6)",
          }}
        >
          BENCH
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1270,
            borderTop: `1px solid ${FC.line}`,
            borderBottom: `1px solid ${FC.line}`,
            padding: "16px 0",
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: progress(t, 5.6, 0.6),
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              paddingRight: 16,
              borderRight: `1px solid ${FC.line}`,
              flexShrink: 0,
            }}
          >
            <Dot color={FC.red} size={5} pulse />
            <Mono size={8} color={FC.red}>
              RUMOUR MILL
            </Mono>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {COPY.leagueRumours.map((rumour, index) => (
              <Reveal key={rumour} start={5.8 + index * 0.16} y={8}>
                <Tag
                  color={index === 0 ? FC.white : FC.dim}
                  background={index === 0 ? "rgba(245,247,250,0.09)" : "rgba(245,247,250,0.03)"}
                  style={{ fontSize: 7 }}
                >
                  {rumour}
                </Tag>
              </Reveal>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <Mono size={8} color={FC.mute}>
            UPDATED 00:12
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1392,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 18,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 23, fontWeight: 600, letterSpacing: "-0.02em", color: FC.white, maxWidth: 640 }}>
            THE TROPHY WAS THE FULL-TIME WHISTLE.
          </div>
          <Mono size={8} color={FC.mute} style={{ textAlign: "right" }}>
            SOME MANAGERS
            <br />
            LOSE INTEREST.
          </Mono>
        </div>

        <LowerThird
          label="DOMESTIC LEAGUE"
          value="FEWER MINUTES. MORE RUMOURS. SAME NUMBER 7."
          accent={FC.red}
          start={2.2}
          style={{ bottom: 104 }}
        />

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 54,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 12,
          }}
        >
          <Mono size={8} color={FC.mute}>
            LEAGUE TABLE · ILLUSTRATIVE
          </Mono>
          <Mono size={8} color={FC.mute}>
            POSITION: 5TH · MOOD: 12TH
          </Mono>
        </div>
      </Camera>

      <Beam start={4.0} duration={1.5} color={FC.red} opacity={0.1} />
      <Scanlines opacity={0.03} />
      <Vignette strength={1.02} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
