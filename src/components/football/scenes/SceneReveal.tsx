import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT, MONO } from "../../../config/football";
import {
  Beam,
  Camera,
  Glow,
  Grain,
  Kicker,
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
import { StadiumBackdrop, VerticalRule } from "../visuals";

const TERMS = ["PREMIER LEAGUE", "CHAMPIONS LEAGUE", "TRANSFER WINDOW"];

export const SceneReveal: React.FC = () => {
  const { t } = useTime();
  const dissolve = 1 - progress(t, 0.2, 2.2) * 0.82;
  const hero = progress(t, 1.8, 0.9);
  const final = progress(t, 4.2, 0.6);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, opacity: dissolve }}>
        <StadiumBackdrop accent={FC.pitchLight} intensity={0.55} pitch={false} />
      </div>
      <Glow x="50%" y="34%" size={48} color={FC.cyan} opacity={0.12} />
      <Glow x="16%" y="76%" size={40} color={FC.white} opacity={0.035} />

      <div
        style={{
          position: "absolute",
          right: -30,
          top: 120,
          fontFamily: FONT,
          fontSize: 520,
          fontWeight: 800,
          letterSpacing: "-0.08em",
          lineHeight: 0.8,
          color: "rgba(245,247,250,0.035)",
          pointerEvents: "none",
        }}
      >
        7
      </div>

      <Camera from={1.015} to={1.0} duration={8.4} origin="50% 44%">
        <div style={{ position: "absolute", left: 76, top: 96 }}>
          <Kicker start={0.05} color={FC.cyan} rule={FC.cyan}>
            {COPY.revealKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: 76, top: 158 }}>
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 600, letterSpacing: "-0.025em", color: FC.silver }}>
            FORGET THE LEAGUE TABLES.
          </div>
          <div style={{ fontFamily: FONT, fontSize: 52, fontWeight: 600, letterSpacing: "-0.025em", color: FC.silver }}>
            THIS WAS NEVER FOOTBALL.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 318,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {TERMS.map((term, index) => {
            const p = progress(t, 0.9 + index * 0.2, 0.5);
            const line = progress(t, 1.5 + index * 0.32, 0.45);
            return (
              <div
                key={term}
                style={{
                  position: "relative",
                  width: "fit-content",
                  opacity: p * (1 - progress(t, 4.4, 0.5) * 0.4),
                  transform: `translateY(${(1 - p) * 12}px)`,
                }}
              >
                <div
                  style={{
                    fontFamily: MONO,
                    fontSize: 25,
                    letterSpacing: "0.18em",
                    color: FC.dim,
                    padding: "9px 0",
                  }}
                >
                  {term}
                </div>
                <div
                  style={{
                    position: "absolute",
                    left: -6,
                    top: "50%",
                    height: 2,
                    width: `${line * 104}%`,
                    background: FC.red,
                    boxShadow: `0 0 18px ${FC.red}66`,
                  }}
                />
              </div>
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 618,
            opacity: hero,
            transform: `translateY(${(1 - hero) * 28}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Tag color={FC.cyan} background={FC.cyanSoft} style={{ fontSize: 8 }}>
              CORRECT TERM
            </Tag>
            <Mono size={8} color={FC.mute}>
              NOT A LEAGUE. NOT A CLUB. A SITUATION.
            </Mono>
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 104,
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.86,
              color: FC.white,
              textShadow: `0 0 80px ${FC.cyan}18`,
            }}
          >
            {COPY.revealTitle}
            <span style={{ color: FC.cyan }}>.</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14 }}>
            <div style={{ height: 2, width: 180, background: FC.cyan, boxShadow: `0 0 24px ${FC.cyan}88` }} />
            <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 500, color: FC.cyan, letterSpacing: "0.04em" }}>
              {COPY.revealSub}
            </div>
          </div>
        </div>

        <Panel
          start={2.0}
          accent={`${FC.cyan}33`}
          style={{ position: "absolute", left: 76, right: 76, top: 930, height: 466 }}
        >
          <PanelHeader
            left="RELATIONSHIP STATUS DASHBOARD"
            accent={FC.cyan}
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: FC.cyan, boxShadow: `0 0 12px ${FC.cyan}` }} />
                <Mono size={8} color={FC.cyan}>
                  UNDEFINED
                </Mono>
              </div>
            }
          />
          <div style={{ padding: "22px 22px", display: "grid", gap: 20 }}>
            {[
              { label: "RELATIONSHIP STATUS", value: "UNDEFINED", color: FC.cyan },
              { label: "CONTRACT TYPE", value: "EMOTIONAL", color: FC.white },
              { label: "TRANSFER WINDOW", value: "ALWAYS OPEN", color: FC.gold },
              { label: "EXCLUSIVITY", value: "0%", color: FC.red },
            ].map((row, index) => (
              <Reveal key={row.label} start={1.9 + index * 0.12} y={10}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${FC.lineSoft}`, paddingBottom: 11 }}>
                  <Mono size={9} color={FC.dim}>
                    {row.label}
                  </Mono>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontFamily: FONT, fontSize: 17, fontWeight: 700, letterSpacing: "0.02em", color: row.color }}>
                      {row.value}
                    </span>
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: row.color,
                        boxShadow: `0 0 10px ${row.color}`,
                      }}
                    />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <div style={{ position: "absolute", left: 22, right: 22, bottom: 14, display: "flex", justifyContent: "space-between" }}>
            <Mono size={7} color={FC.mute}>
              DATA SOURCE: OBVIOUS
            </Mono>
            <Mono size={7} color={FC.mute}>
              LAST UPDATED: WHENEVER HE TEXTS
            </Mono>
          </div>
        </Panel>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1452,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 24,
            opacity: final,
            transform: `translateY(${(1 - final) * 20}px)`,
          }}
        >
          <div style={{ maxWidth: 700 }}>
            <Mono size={8} color={FC.mute}>
              THE ANALOGY, FULLY TRANSLATED
            </Mono>
            <div style={{ fontFamily: FONT, fontSize: 30, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1, color: FC.white, marginTop: 6 }}>
              A SITUATIONSHIP WITH FOOTBALL TERMINOLOGY.
            </div>
          </div>
          <VerticalRule start={4.5} color={FC.cyan} style={{ height: 64 }} />
        </div>

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
            PREMIER LEAGUE: NOT FOUND
          </Mono>
          <Mono size={8} color={FC.mute}>
            CHAMPIONS LEAGUE: NOT FOUND
          </Mono>
          <Mono size={8} color={FC.cyan}>
            SITUATIONSHIP: FOUND
          </Mono>
        </div>
      </Camera>

      <Beam start={4.2} duration={1.8} color={FC.cyan} opacity={0.1} />
      <Scanlines opacity={0.025} />
      <Vignette strength={0.98} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
