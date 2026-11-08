import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT } from "../../../config/football";
import {
  Beam,
  Camera,
  Glow,
  Grain,
  Kicker,
  lerp,
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
  BroadcastScoreBug,
  Cone,
  Football,
  PitchLines,
  StadiumBackdrop,
  StatMeter,
  TacticalArrow,
  TacticalArrowDefs,
} from "../visuals";

export const ScenePreseason: React.FC = () => {
  const { t } = useTime();
  const draw = progress(t, 0.5, 1.6);
  const travel = progress(t, 1.2, 5.2, (value) => value);
  const ballX = lerp(142, 742, travel);
  const ballY = lerp(806, 286, travel) + Math.sin(travel * Math.PI) * 92;
  const chemistry = t > 4.2 ? 100 : Math.min(100, 28 + t * 12);
  const finalLine = progress(t, 5.4, 0.6);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.pitchLight} intensity={0.8} pitch={false} />
      <Glow x="50%" y="38%" size={50} color={FC.pitchLight} opacity={0.12} />
      <Glow x="84%" y="70%" size={42} color={FC.gold} opacity={0.08} />

      <Camera from={1.025} to={1.0} duration={9.2} origin="50% 44%">
        <div style={{ position: "absolute", left: 76, top: 92 }}>
          <Kicker start={0.05} color={FC.pitchLight} rule={FC.pitchLight}>
            {COPY.preseasonKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: 76, top: 138 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: FC.white,
            }}
          >
            PRE-SEASON<span style={{ color: FC.pitchLight }}>.</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 12 }}>
            <Tag color={FC.pitchLight} background={`${FC.pitchLight}16`} style={{ fontSize: 8 }}>
              TRAINING GROUND
            </Tag>
            <Mono size={8} color={FC.mute}>
              4 FRIENDLIES · 1 DREAM
            </Mono>
          </div>
        </div>

        <div style={{ position: "absolute", right: 76, top: 84 }}>
          <BroadcastScoreBug
            home="FRIENDLY"
            away="PRE-SEASON"
            score="3 - 0"
            minute="90'"
            accent={FC.pitchLight}
            start={0.4}
          />
        </div>

        <Panel
          start={0.3}
          accent={`${FC.pitchLight}33`}
          style={{ position: "absolute", left: 76, right: 76, top: 324, height: 980 }}
        >
          <PanelHeader
            left="TACTICAL BOARD · CHEMISTRY SESSION"
            accent={FC.pitchLight}
            right={
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: FC.pitchLight, boxShadow: `0 0 12px ${FC.pitchLight}` }} />
                <Mono size={8} color={FC.pitchLight}>
                  LIVE SESSION
                </Mono>
              </div>
            }
          />

          <div style={{ position: "absolute", left: 30, right: 30, top: 62, bottom: 24 }}>
            <PitchLines
              width={868}
              height={894}
              draw={draw}
              color="rgba(245,247,250,0.42)"
              style={{ left: 0, top: 0 }}
            />
            <svg viewBox="0 0 868 894" width={868} height={894} style={{ position: "absolute", inset: 0 }}>
              <TacticalArrowDefs color={FC.gold} />
              <TacticalArrow d="M 142 806 Q 430 220 742 286" color={FC.gold} start={1.4} width={2.6} />
              <TacticalArrow d="M 400 660 Q 560 520 690 430" color={FC.pitchLight} start={3.1} width={1.8} />
            </svg>
            <svg viewBox="0 0 868 894" width={868} height={894} style={{ position: "absolute", inset: 0 }}>
              <Cone x={180} y={760} />
              <Cone x={382} y={620} color={FC.gold} />
              <Cone x={600} y={458} color={FC.pitchLight} />
              <Cone x={744} y={300} color={FC.orange} />
            </svg>

            <div
              style={{
                position: "absolute",
                left: ballX,
                top: ballY,
                transform: "translate(-50%, -50%)",
                zIndex: 4,
              }}
            >
              <Football size={92} rotate={travel * 680} />
            </div>

            <div
              style={{
                position: "absolute",
                left: 50,
                top: 120,
                padding: "12px 16px",
                border: `1px solid ${FC.line}`,
                background: "rgba(8,10,15,0.78)",
                opacity: progress(t, 2.2, 0.5),
              }}
            >
              <Mono size={8} color={FC.mute}>
                SESSION FOCUS
              </Mono>
              <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 700, color: FC.white, marginTop: 3 }}>
                CHEMISTRY, OBVIOUSLY.
              </div>
            </div>

            <div
              style={{
                position: "absolute",
                right: 54,
                bottom: 112,
                textAlign: "right",
                opacity: progress(t, 4.9, 0.5),
              }}
            >
              <Mono size={8} color={FC.mute}>
                TOUCHES IN THE BOX
              </Mono>
              <div style={{ fontFamily: FONT, fontSize: 58, fontWeight: 800, letterSpacing: "-0.05em", color: FC.gold, lineHeight: 0.9 }}>
                27
              </div>
            </div>

          </div>
        </Panel>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1322,
            padding: "12px 16px",
            background: "rgba(8,10,15,0.78)",
            border: `1px solid ${FC.line}`,
          }}
        >
          <StatMeter label="TEAM CHEMISTRY" value={`${Math.round(chemistry)}%`} pct={chemistry} start={1.4} color={FC.pitchLight} height={8} />
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1410,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
          }}
        >
          {[
            { value: "04", label: "FRIENDLY MATCHES", color: FC.white, note: "all away" },
            { value: "100%", label: "CHEMISTRY", color: FC.pitchLight, note: "allegedly" },
            { value: "01", label: "BALLON D'OR", color: FC.gold, note: "in his head" },
          ].map((stat, index) => (
            <Reveal key={stat.label} start={0.8 + index * 0.14} y={18}>
              <div style={{ borderTop: `1px solid ${FC.line}`, paddingTop: 13 }}>
                <div style={{ fontFamily: FONT, fontSize: 45, fontWeight: 800, letterSpacing: "-0.055em", color: stat.color, lineHeight: 0.9 }}>
                  {stat.value}
                </div>
                <Mono size={8} color={FC.dim} style={{ display: "block", marginTop: 6 }}>
                  {stat.label}
                </Mono>
                <div style={{ fontFamily: FONT, fontSize: 11, color: FC.mute, marginTop: 2 }}>{stat.note}</div>
              </div>
            </Reveal>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            top: 1560,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 16,
            opacity: finalLine,
            transform: `translateY(${(1 - finalLine) * 16}px)`,
          }}
        >
          <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 600, letterSpacing: "0.01em", color: FC.white }}>
            {COPY.preseasonSub}
          </div>
          <Tag color={FC.gold} background={FC.goldSoft} style={{ fontSize: 8 }}>
            BALLON D'OR ENERGY
          </Tag>
        </div>

        <LowerThird
          label="PRE-SEASON"
          value="TRAINING SESSIONS · FRIENDLY MATCHES · UNREALISTIC HOPE."
          accent={FC.pitchLight}
          start={1.2}
          style={{ bottom: 96 }}
        />

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 50,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 12,
          }}
        >
          <Mono size={8} color={FC.mute}>
            TRAINING GROUND · CLOSED SESSION
          </Mono>
          <Mono size={8} color={FC.mute}>
            MATCH FITNESS: OPTIMISTIC
          </Mono>
        </div>
      </Camera>

      <Beam start={1.5} duration={1.6} color={FC.pitchLight} opacity={0.08} />
      <Scanlines opacity={0.028} />
      <Vignette strength={0.95} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
