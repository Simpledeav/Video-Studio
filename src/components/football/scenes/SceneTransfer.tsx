import { AbsoluteFill } from "remotion";
import { COPY, FC, FONT, MONO } from "../../../config/football";
import {
  Beam,
  Camera,
  Counter,
  Glow,
  Grain,
  Hairline,
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
import { ClubCard, StadiumBackdrop, TransferToast } from "../visuals";

const CLUBS = [
  { name: COPY.transferClubs[0], initials: "AT" },
  { name: COPY.transferClubs[1], initials: "NG" },
  { name: COPY.transferClubs[2], initials: "RE" },
  { name: COPY.transferClubs[3], initials: "R4" },
  { name: COPY.transferClubs[4], initials: "MI" },
];

const FEED = [
  { time: "23:41", club: "ATLAS FC", line: "“let's see where this goes.”" },
  { time: "23:43", club: "NORTHGATE", line: "“hey stranger.”" },
  { time: "23:44", club: "RIVER END", line: "“wyd.”" },
];

export const SceneTransfer: React.FC = () => {
  const { t } = useTime();
  const negotiating = t > 4.6;
  const stamp = progress(t, 7.0, 0.45, (value) => value);

  return (
    <AbsoluteFill style={{ background: FC.black, overflow: "hidden" }}>
      <StadiumBackdrop accent={FC.cyan} intensity={0.7} pitch={false} />
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${FC.lineSoft} 1px, transparent 1px), linear-gradient(90deg, ${FC.lineSoft} 1px, transparent 1px)`,
          backgroundSize: "86px 86px",
          opacity: 0.4,
          maskImage: "radial-gradient(ellipse at 50% 36%, black 12%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 36%, black 12%, transparent 78%)",
        }}
      />
      <Glow x="82%" y="18%" size={44} color={FC.cyan} opacity={0.12} />
      <Glow x="12%" y="78%" size={48} color={FC.cyan} opacity={0.06} />

      <Camera from={1.02} to={1.0} duration={8.4} origin="50% 42%">
        <div style={{ position: "absolute", left: 76, top: 96 }}>
          <Kicker start={0.05} color={FC.cyan} rule={FC.cyan}>
            {COPY.transferKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: 76, top: 138 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 64,
              fontWeight: 800,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: FC.white,
            }}
          >
            THE TRANSFER
            <br />
            MARKET<span style={{ color: FC.cyan }}>.</span>
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 8, alignItems: "center" }}>
            <Tag color={FC.cyan} background={FC.cyanSoft}>
              RELATIONSHIP DIVISION
            </Tag>
            <Mono size={8} color={FC.mute}>
              WINDOW OPEN · 24H COVERAGE
            </Mono>
          </div>
        </div>

        <Panel
          start={0.4}
          accent={`${FC.cyan}33`}
          glow
          style={{ position: "absolute", left: 60, right: 60, top: 322, height: 1080 }}
        >
          <PanelHeader
            left="RELATIONSHIP TRANSFER DESK"
            right={
              <div style={{ display: "flex", gap: 6 }}>
                <Tag color={FC.cyan} background={FC.cyanSoft} style={{ fontSize: 8 }}>
                  LIVE
                </Tag>
                <Tag color={FC.gold} background={FC.goldSoft} style={{ fontSize: 8 }}>
                  DEADLINE
                </Tag>
              </div>
            }
            accent={FC.cyan}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", padding: "24px 22px 20px", gap: 14 }}>
            {[
              { label: "CLUBS SCOUTED", value: 5, color: FC.cyan, start: 1.1, hint: "DMs sent" },
              { label: "IN NEGOTIATION", value: 3, color: FC.gold, start: 4.4, hint: "Talks open" },
              { label: "EXCLUSIVE DEALS", value: 0, color: FC.red, start: 7.0, hint: "Signed" },
            ].map((metric) => (
              <div
                key={metric.label}
                style={{
                  borderLeft: `1px solid ${metric.color}44`,
                  paddingLeft: 14,
                  opacity: progress(t, metric.start - 0.2, 0.5),
                }}
              >
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: 62,
                    fontWeight: 800,
                    letterSpacing: "-0.06em",
                    lineHeight: 0.85,
                    color: metric.color,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <Counter value={metric.value} start={metric.start} duration={0.7} />
                </div>
                <Mono size={8} color={FC.dim} style={{ display: "block", marginTop: 7 }}>
                  {metric.label}
                </Mono>
                <Mono size={7} color={FC.mute} style={{ display: "block", marginTop: 2 }}>
                  {metric.hint}
                </Mono>
              </div>
            ))}
          </div>

          <Hairline start={1.2} color={FC.lineSoft} />

          <div style={{ padding: "22px 22px 8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <Mono size={8} color={FC.mute}>
                CLUB SHORTLIST · FICTIONAL
              </Mono>
              <div style={{ display: "flex", gap: 6 }}>
                {["SCOUT", "TALK", "SIGN"].map((phase, index) => (
                  <Tag
                    key={phase}
                    color={index === 0 ? FC.cyan : index === 1 && negotiating ? FC.gold : FC.dim}
                    background={index === 0 ? FC.cyanSoft : index === 1 && negotiating ? FC.goldSoft : "rgba(245,247,250,0.04)"}
                    style={{ fontSize: 7 }}
                  >
                    {phase}
                  </Tag>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 14, justifyContent: "center", width: 640, margin: "0 auto" }}>
              {CLUBS.map((club, index) => {
                const active = t > 0.9 + index * 0.3;
                const status = !active
                  ? "SCOUTING"
                  : negotiating && index < 3
                    ? "NEGOTIATING"
                    : "SCOUTED";
                return (
                  <Reveal key={club.name} start={0.8 + index * 0.12} y={28}>
                    <ClubCard
                      name={club.name}
                      initials={club.initials}
                      status={status}
                      accent={negotiating && index < 3 ? FC.gold : FC.cyan}
                      active={active}
                      width={186}
                    />
                  </Reveal>
                );
              })}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              top: 520,
              opacity: progress(t, 1.1, 0.6),
              transform: `translateY(${(1 - progress(t, 1.1, 0.6)) * 14}px)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <Mono size={8} color={FC.mute}>
                NEGOTIATION FEED · UNREAD
              </Mono>
              <Mono size={8} color={FC.cyan}>
                03 OPEN
              </Mono>
            </div>
            <div style={{ borderTop: `1px solid ${FC.lineSoft}` }}>
              {FEED.map((row, index) => (
                <div
                  key={row.club}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "58px 1fr auto",
                    gap: 10,
                    alignItems: "center",
                    padding: "10px 0",
                    borderBottom: `1px solid ${FC.lineSoft}`,
                    opacity: progress(t, 1.3 + index * 0.14, 0.4),
                  }}
                >
                  <Mono size={8} color={FC.mute}>
                    {row.time}
                  </Mono>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: FC.white }}>{row.club}</span>
                    <span style={{ fontFamily: FONT, fontSize: 12, fontStyle: "italic", color: FC.silver }}>{row.line}</span>
                  </div>
                  <Mono size={7} color={FC.gold}>
                    TALKING
                  </Mono>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 692,
              transform: "translateX(-50%)",
              textAlign: "center",
              opacity: progress(t, 2.2, 0.6),
            }}
          >
            <svg width={136} height={136} viewBox="0 0 136 136">
              <circle cx="68" cy="68" r="58" fill="none" stroke={FC.line} strokeWidth="6" />
              <circle
                cx="68"
                cy="68"
                r="58"
                fill="none"
                stroke={FC.red}
                strokeWidth="6"
                strokeDasharray="3.6 360"
                strokeLinecap="round"
                transform="rotate(-90 68 68)"
              />
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div style={{ fontFamily: FONT, fontSize: 36, fontWeight: 800, letterSpacing: "-0.05em", color: FC.white, lineHeight: 1 }}>
                0<span style={{ color: FC.red, fontSize: 20 }}>%</span>
              </div>
              <Mono size={7} color={FC.mute} style={{ marginTop: 3 }}>
                EXCLUSIVITY
              </Mono>
            </div>
          </div>

          <div style={{ position: "absolute", left: 22, right: 22, bottom: 118 }}>
            <Hairline start={2.2} color={FC.lineSoft} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 18 }}>
              {[
                { label: "SCOUTING", value: "05", color: FC.cyan },
                { label: "NEGOTIATIONS", value: "03", color: FC.gold },
                { label: "UNSIGNED", value: "05", color: FC.red },
              ].map((step, index) => (
                <div key={step.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: MONO, fontSize: 26, fontWeight: 600, color: step.color, lineHeight: 1 }}>
                      {step.value}
                    </div>
                    <Mono size={7} color={FC.mute} style={{ display: "block", marginTop: 4 }}>
                      {step.label}
                    </Mono>
                  </div>
                  {index < 2 ? (
                    <div style={{ color: FC.mute, fontFamily: MONO, fontSize: 16, opacity: 0.6 }}>→</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: `1px solid ${FC.lineSoft}`,
              paddingTop: 12,
            }}
          >
            <Mono size={8} color={FC.mute}>
              DM 01 ✓ · DM 02 ✓ · DM 03 ✓ · DM 04 ✓ · DM 05 ✓
            </Mono>
            <Mono size={8} color={FC.red}>
              NO EXCLUSIVE DEAL
            </Mono>
          </div>

          <div
            style={{
              position: "absolute",
              right: 24,
              top: 250,
              padding: "9px 14px",
              border: `2px solid ${FC.red}`,
              color: FC.red,
              fontFamily: MONO,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.14em",
              transform: `rotate(-8deg) scale(${stamp})`,
              opacity: stamp * 0.9,
              background: "rgba(8,10,15,0.55)",
            }}
          >
            SIGNED: NOBODY
          </div>
        </Panel>

        <div style={{ position: "absolute", left: 76, right: 76, top: 1500 }}>
          <Reveal start={4.0} y={18}>
            <TransferToast
              label="TRANSFER DESK · UPDATE"
              title="THREE NEGOTIATIONS. ZERO SIGNATURES."
              accent={FC.gold}
              width={928}
            />
          </Reveal>
        </div>

        <LowerThird
          label="TRANSFER MARKET"
          value="SCOUTS FIVE. NEGOTIATES THREE. SIGNS NOWHERE."
          accent={FC.cyan}
          start={1.6}
          style={{ bottom: 104 }}
        />

        <div
          style={{
            position: "absolute",
            left: 76,
            right: 76,
            bottom: 56,
            display: "flex",
            justifyContent: "space-between",
            borderTop: `1px solid ${FC.line}`,
            paddingTop: 12,
          }}
        >
          <Mono size={8} color={FC.mute}>
            RELATIONSHIP TRANSFER MARKET · ILLUSTRATIVE
          </Mono>
          <Mono size={8} color={FC.mute}>
            WINDOW: STILL OPEN
          </Mono>
        </div>
      </Camera>

      <Beam start={4.5} duration={1.4} color={FC.cyan} opacity={0.08} />
      <Scanlines opacity={0.03} />
      <Vignette strength={0.95} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
