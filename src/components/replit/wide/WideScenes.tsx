import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO } from "../../../config/replit";
import {
  Beam,
  Divider,
  easeIn,
  GlitchText,
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
import {
  AppShell,
  ArchitectureMap,
  CodeEditorPanel,
  DataRain,
  DatabaseCylinder,
  DatabaseDashboard,
  FailureTelemetry,
  FreezeLock,
  FreezePanel,
  RecoveryConsole,
  SeparationDiagram,
} from "../visuals";

const M = 96;

const WideFooter: React.FC<{
  left: string;
  right?: string;
  color?: string;
  top?: number;
}> = ({ left, right, color = C.mute, top = 984 }) => (
  <div
    style={{
      position: "absolute",
      left: M,
      right: M,
      top,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderTop: `1px solid ${C.lineSoft}`,
      paddingTop: 14,
    }}
  >
    <Mono size={10} color={color} style={{ letterSpacing: "0.16em" }}>
      {left}
    </Mono>
    {right ? (
      <Mono size={9} color={C.mute} style={{ letterSpacing: "0.12em" }}>
        {right}
      </Mono>
    ) : null}
  </div>
);

const TopTags: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      position: "absolute",
      right: M,
      top: 62,
      display: "flex",
      alignItems: "center",
      gap: 10,
    }}
  >
    {children}
  </div>
);

/* ------------------------------------------------------------------ */
/* 01 · THE HOOK                                                       */
/* ------------------------------------------------------------------ */

export const WideHook: React.FC = () => {
  const { frame, fps } = useTime();
  const deletion = progress(frame, fps, 1.65, 0.55, easeIn);
  const camera = progress(frame, fps, 0.4, 7.2, (x) => x);
  const sub = progress(frame, fps, 3.35, 0.75);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="78%" y="12%" size={68} opacity={0.1} color={C.cyan} />
      <Glow x="8%" y="82%" size={62} opacity={0.12} color={C.red} />
      <DataRain opacity={0.07} columns={9} color={C.cyan} start={0} speed={1.3} />
      <GridField opacity={0.26} size={110} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.025})`,
          transformOrigin: "46% 46%",
        }}
      >
        <div style={{ position: "absolute", left: M, top: 62 }}>
          <Kicker start={0.1} color={deletion > 0.3 ? C.red : C.silver} rule={deletion > 0.3 ? C.red : C.cyan} style={{ fontSize: 17 }}>
            {deletion > 0.3 ? "PRODUCTION  /  INCIDENT" : COPY.hookKicker}
          </Kicker>
        </div>
        <TopTags>
          <Tag color={C.red} background={C.redSoft} style={{ fontSize: 11 }}>
            LIVE INCIDENT · JULY 2025
          </Tag>
        </TopTags>

        <div style={{ position: "absolute", left: M, top: 146, width: 980 }}>
          <MaskLine
            start={1.15}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: 95,
              fontWeight: 600,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: C.silver,
            }}
          >
            {COPY.hookLineOne}
          </MaskLine>
          <MaskLine
            start={1.25}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: 95,
              fontWeight: 600,
              letterSpacing: "-0.055em",
              lineHeight: 0.95,
              color: C.silver,
            }}
          >
            {COPY.hookLineTwo}
          </MaskLine>
          <div style={{ marginTop: 4 }}>
            <MaskLine
              start={1.45}
              duration={0.72}
              style={{
                fontFamily: FONT,
                fontSize: 208,
                fontWeight: 800,
                letterSpacing: "-0.075em",
                lineHeight: 0.82,
                color: C.red,
                textShadow: `0 0 70px ${C.redGlow}, 0 10px 44px rgba(0,0,0,0.9)`,
              }}
            >
              <GlitchText
                start={1.45}
                color={C.red}
                glitch={1}
                style={{
                  fontFamily: FONT,
                  fontSize: 208,
                  fontWeight: 800,
                  letterSpacing: "-0.075em",
                  lineHeight: 0.82,
                }}
              >
                {COPY.hookLineThree}
              </GlitchText>
            </MaskLine>
            <div
              style={{
                height: 2,
                marginTop: 8,
                background: `linear-gradient(90deg, ${C.red}, transparent 78%)`,
                opacity: progress(frame, fps, 2.6, 0.6) * 0.8,
              }}
            />
          </div>
        </div>

        <div style={{ position: "absolute", left: M, top: 646, width: 820 }}>
          <WordReveal
            text={COPY.hookSub}
            start={3.35}
            stagger={0.07}
            style={{
              fontFamily: FONT,
              fontSize: 32,
              fontWeight: 600,
              letterSpacing: "0.06em",
              lineHeight: 1.35,
              color: C.white,
            }}
            wordStyle={{ fontFamily: FONT, fontSize: 32, fontWeight: 600, letterSpacing: "0.06em" }}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            top: 768,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: progress(frame, fps, 1.9, 0.6),
          }}
        >
          <Tag color={C.red} background={C.redSoft} style={{ fontSize: 12 }}>
            ROWS 1,206 → 0
          </Tag>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 12 }}>
            STATUS: CRITICAL
          </Tag>
          <Mono size={11} color={C.mute} style={{ letterSpacing: "0.16em" }}>
            PRODUCTION · LIVE
          </Mono>
        </div>

        <div style={{ position: "absolute", left: M, top: 852, width: 850, opacity: sub * 0.8 }}>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: "0.14em",
              color: C.mute,
              lineHeight: 1.8,
            }}
          >
            THE INSTRUCTION WAS EXPLICIT. THE ACTION HAPPENED ANYWAY.
          </div>
        </div>

        <div style={{ position: "absolute", right: M, top: 152, width: 730 }}>
          <DatabaseDashboard
            start={0.1}
            width={730}
            height={610}
            compact
            vanishAt={deletion > 0.2 ? 1.72 : undefined}
            accent={deletion > 0.3 ? C.red : C.cyan}
          />
          <div
            style={{
              marginTop: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: progress(frame, fps, 2.2, 0.6),
            }}
          >
            <Mono size={11} color={deletion > 0.3 ? C.red : C.green} style={{ letterSpacing: "0.16em" }}>
              {deletion > 0.3 ? "0 RECORDS" : "1,206 RECORDS"}
            </Mono>
            <Mono size={10} color={C.mute} style={{ letterSpacing: "0.14em" }}>
              ILLUSTRATIVE RECONSTRUCTION
            </Mono>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 300 + deletion * 430,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.red}, ${C.orange}, transparent)`,
          boxShadow: `0 0 24px ${C.red}`,
          opacity: deletion > 0 && deletion < 0.98 ? 0.9 : 0,
          zIndex: 50,
        }}
      />
      <Scanlines opacity={0.045} spacing={5} />
      <Beam start={2.4} duration={1.4} color={C.red} opacity={0.1} />
      <Vignette strength={1.0} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 02 · THE EXPERIMENT                                                 */
/* ------------------------------------------------------------------ */

export const WideExperiment: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 9.2, (x) => x);
  return (
    <AbsoluteFill style={{ background: "#07090E", overflow: "hidden" }}>
      <Glow x="14%" y="18%" size={64} opacity={0.1} color={C.cyan} />
      <Glow x="86%" y="78%" size={58} opacity={0.07} color={C.blue} />
      <GridField opacity={0.22} size={110} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + camera * 0.02})` }}>
        <div style={{ position: "absolute", left: M, top: 62 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan} style={{ fontSize: 16 }}>
            {COPY.experimentKicker}
          </Kicker>
        </div>
        <TopTags>
          <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 10 }}>
            REAL APPLICATION · REAL DATA
          </Tag>
        </TopTags>

        <div style={{ position: "absolute", left: M, top: 132, width: 820 }}>
          <MaskLine
            start={0.25}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: 92,
              fontWeight: 600,
              letterSpacing: "-0.06em",
              lineHeight: 0.96,
              color: C.silver,
            }}
          >
            A REAL APP.
          </MaskLine>
          <MaskLine
            start={0.38}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: 100,
              fontWeight: 700,
              letterSpacing: "-0.065em",
              lineHeight: 0.98,
              color: C.white,
            }}
          >
            REAL <span style={{ color: C.cyan }}>DATA.</span>
          </MaskLine>
          <div style={{ marginTop: 24, maxWidth: 620, opacity: progress(frame, fps, 0.8, 0.7) }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: "0.04em",
                lineHeight: 1.55,
                color: C.dim,
              }}
            >
              A working contact application, built in public — with a live database underneath.
            </div>
          </div>
        </div>

        <div style={{ position: "absolute", left: M, top: 500 }}>
          <CodeEditorPanel start={0.9} width={840} height={420} fontSize={15} />
        </div>

        <div style={{ position: "absolute", right: M, top: 168, width: 790 }}>
          <AppShell start={0.6} width={790} height={610} />
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            top: 946,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          {COPY.experimentLabels.map((label, i) => (
            <Tag
              key={label}
              color={i === 2 ? C.cyan : C.dim}
              background={i === 2 ? C.cyanSoft : "rgba(255,255,255,0.03)"}
              style={{ fontSize: 10 }}
            >
              {label}
            </Tag>
          ))}
        </div>
        <WideFooter left="JULY 2025 · SAASTR / REPLIT" right="ILLUSTRATIVE RECONSTRUCTION" top={990} />
      </div>

      <Scanlines opacity={0.025} spacing={6} />
      <Vignette strength={0.9} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 03 · THE DATA                                                       */
/* ------------------------------------------------------------------ */

export const WideData: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 8, (x) => x);
  return (
    <AbsoluteFill style={{ background: C.graphite, overflow: "hidden" }}>
      <Glow x="22%" y="20%" size={66} opacity={0.1} color={C.cyan} />
      <Glow x="86%" y="74%" size={58} opacity={0.06} color={C.blue} />
      <DataRain opacity={0.04} columns={8} color={C.cyan} start={1.6} speed={0.8} />
      <GridField opacity={0.22} size={108} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + camera * 0.018})` }}>
        <div style={{ position: "absolute", left: M, top: 64, display: "flex", alignItems: "center", gap: 16 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan} style={{ fontSize: 16 }}>
            {COPY.dataKicker}
          </Kicker>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 10 }}>
            REPORTED
          </Tag>
        </div>

        <div style={{ position: "absolute", left: M, top: 160, width: 600 }}>
          <MaskLine
            start={0.35}
            duration={0.75}
            style={{
              fontFamily: FONT,
              fontSize: 196,
              fontWeight: 700,
              letterSpacing: "-0.075em",
              lineHeight: 0.82,
              color: C.white,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            1,206
          </MaskLine>
          <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 17, letterSpacing: "0.24em", color: C.cyan }}>
            EXECUTIVES
          </div>

          <div style={{ marginTop: 58, height: 1, background: C.line }} />

          <MaskLine
            start={0.55}
            duration={0.75}
            style={{
              marginTop: 44,
              fontFamily: FONT,
              fontSize: 186,
              fontWeight: 700,
              letterSpacing: "-0.075em",
              lineHeight: 0.82,
              color: C.white,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            1,196<span style={{ color: C.cyan }}>+</span>
          </MaskLine>
          <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 17, letterSpacing: "0.24em", color: C.cyan }}>
            COMPANIES
          </div>
        </div>

        <div style={{ position: "absolute", right: M, top: 146, width: 1030 }}>
          <DatabaseDashboard start={0.9} width={1030} height={760} accent={C.cyan} title="PRODUCTION / CONTACTS" />
          <div style={{ position: "absolute", right: 18, top: 16 }}>
            <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 10 }}>
              1,206 ROWS
            </Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            top: 914,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: progress(frame, fps, 3.2, 0.7),
          }}
        >
          <span style={{ width: 9, height: 9, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 14px ${C.cyan}` }} />
          <Mono size={12} color={C.cyan} style={{ letterSpacing: "0.16em" }}>
            BUSINESS CONTACT RECORDS
          </Mono>
          <Divider color={`${C.cyan}44`} style={{ width: 120 }} />
          <Mono size={11} color={C.mute} style={{ letterSpacing: "0.14em" }}>
            NAMES AND COMPANIES WITHHELD
          </Mono>
        </div>
        <WideFooter left="THE SCALE IS THE STORY" right="SOURCE: REPORTED FIGURES" top={998} />
      </div>

      <Scanlines opacity={0.03} spacing={6} />
      <Vignette strength={0.9} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 04 · THE WARNING                                                    */
/* ------------------------------------------------------------------ */

export const WideWarning: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 7.6, (x) => x);
  return (
    <AbsoluteFill style={{ background: "#06080D", overflow: "hidden" }}>
      <Glow x="72%" y="24%" size={64} opacity={0.09} color={C.orange} />
      <Glow x="12%" y="78%" size={56} opacity={0.05} color={C.blue} />
      <GridField opacity={0.24} size={108} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + camera * 0.02})` }}>
        <div style={{ position: "absolute", left: M, top: 62 }}>
          <Kicker start={0.1} color={C.silver} rule={C.orange} style={{ fontSize: 16 }}>
            {COPY.warningKicker}
          </Kicker>
        </div>
        <TopTags>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 10 }}>
            CONTROL LAYER · ENGAGED
          </Tag>
        </TopTags>

        <div style={{ position: "absolute", left: M, top: 138, width: 780 }}>
          <MaskLine
            start={0.3}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: 138,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              color: C.silver,
            }}
          >
            CODE
          </MaskLine>
          <MaskLine
            start={0.42}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: 158,
              fontWeight: 800,
              letterSpacing: "-0.07em",
              lineHeight: 0.9,
              color: C.white,
            }}
          >
            FREEZE
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: M, top: 470, width: 740 }}>
          {COPY.warningLines.map((line, i) => (
            <div key={line} style={{ display: "flex", alignItems: "center", gap: 14, marginTop: i === 0 ? 0 : 14, opacity: progress(frame, fps, 1.6 + i * 0.2, 0.6) }}>
              <span style={{ width: 8, height: 8, borderRadius: 1, background: C.orange }} />
              <Mono size={13} color={i === 0 ? C.white : C.silver} style={{ letterSpacing: "0.18em" }}>
                {line}
              </Mono>
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", left: M, top: 612 }}>
          <FreezePanel start={1.0} width={740} />
        </div>

        <div style={{ position: "absolute", right: M, top: 150, width: 620, height: 620 }}>
          <FreezeLock size={560} start={0.7} style={{ position: "absolute", left: 30, top: 0 }} />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 600,
              display: "flex",
              justifyContent: "center",
              gap: 10,
              opacity: progress(frame, fps, 2.3, 0.7),
            }}
          >
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 10 }}>BLOCKED</Tag>
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 10 }}>HUMAN REQUIRED</Tag>
            <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 10 }}>NO CHANGES</Tag>
          </div>
          <div
            style={{
              position: "absolute",
              left: 40,
              right: 40,
              top: 672,
              fontFamily: FONT,
              fontSize: 18,
              fontWeight: 500,
              letterSpacing: "0.05em",
              lineHeight: 1.55,
              color: C.dim,
              textAlign: "center",
              opacity: progress(frame, fps, 3.4, 0.7),
            }}
          >
            A clear instruction. A boundary that was supposed to hold.
          </div>
        </div>

        <WideFooter left="INSTRUCTIONS ARE CONTEXT" right="PERMISSIONS ARE CONTROL" top={998} />
      </div>

      <Scanlines opacity={0.03} spacing={6} />
      <Beam start={4.6} duration={1.6} color={C.orange} opacity={0.06} />
      <Vignette strength={0.92} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 05 · THE FAILURE                                                    */
/* ------------------------------------------------------------------ */

export const WideFailure: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 9.2, (x) => x);
  return (
    <AbsoluteFill style={{ background: "#0A0507", overflow: "hidden" }}>
      <Glow x="18%" y="46%" size={64} opacity={0.11} color={C.red} />
      <Glow x="86%" y="18%" size={52} opacity={0.06} color={C.orange} />
      <GridField opacity={0.22} size={108} color="rgba(255,53,72,0.05)" />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + camera * 0.022})` }}>
        <div style={{ position: "absolute", left: M, top: 62 }}>
          <Kicker start={0.1} color={C.red} rule={C.red} style={{ fontSize: 16 }}>
            {COPY.failureKicker}
          </Kicker>
        </div>
        <TopTags>
          <Tag color={C.red} background={C.redSoft} style={{ fontSize: 10 }}>
            FAILURE · CRITICAL
          </Tag>
        </TopTags>

        <div style={{ position: "absolute", left: M, top: 150, width: 760 }}>
          <MaskLine
            start={0.55}
            duration={0.7}
            style={{
              fontFamily: FONT,
              fontSize: 108,
              fontWeight: 600,
              letterSpacing: "-0.055em",
              lineHeight: 0.9,
              color: C.silver,
            }}
          >
            PRODUCTION
          </MaskLine>
          <MaskLine
            start={0.72}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: 184,
              fontWeight: 800,
              letterSpacing: "-0.075em",
              lineHeight: 0.82,
              color: C.red,
              textShadow: `0 0 64px ${C.redGlow}`,
            }}
          >
            DATA
          </MaskLine>
          <MaskLine
            start={0.86}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: 184,
              fontWeight: 800,
              letterSpacing: "-0.075em",
              lineHeight: 0.82,
              color: C.red,
              textShadow: `0 0 64px ${C.redGlow}`,
            }}
          >
            DELETED
          </MaskLine>
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            top: 636,
            width: 720,
            fontFamily: FONT,
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: C.white,
            opacity: progress(frame, fps, 3.0, 0.7),
          }}
        >
          {COPY.failureSub}
        </div>

        <div style={{ position: "absolute", left: M, top: 704, display: "flex", gap: 10 }}>
          <Tag color={C.red} background={C.redSoft} style={{ fontSize: 11 }}>1,206 → 0</Tag>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 11 }}>STATUS: CRITICAL</Tag>
          <Tag color={C.dim} background="rgba(255,255,255,0.03)" style={{ fontSize: 11 }}>NO APPROVAL</Tag>
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            top: 816,
            width: 720,
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.14em",
            lineHeight: 1.8,
            color: C.mute,
            opacity: progress(frame, fps, 5.2, 0.8),
          }}
        >
          DESTRUCTIVE ACTION EXECUTED AGAINST PRODUCTION.
          <br />
          ILLUSTRATIVE RECONSTRUCTION · NOT A VERIFIED SCREENSHOT.
        </div>

        <div style={{ position: "absolute", right: M, top: 118, width: 900 }}>
          <FailureTelemetry start={0.6} width={900} />
          <div style={{ marginTop: 22 }}>
            <DatabaseDashboard
              start={1.2}
              width={900}
              height={360}
              compact
              vanishAt={2.9}
              accent={C.red}
              title="PRODUCTION / CONTACTS"
            />
          </div>
          <div
            style={{
              marginTop: 46,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              gap: 20,
              opacity: progress(frame, fps, 3.3, 0.7),
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 176,
                fontWeight: 800,
                letterSpacing: "-0.075em",
                lineHeight: 0.78,
                color: C.red,
                textShadow: `0 0 60px ${C.redGlow}`,
              }}
            >
              0
            </div>
            <div style={{ textAlign: "right", paddingBottom: 8 }}>
              <Mono size={12} color={C.red} style={{ letterSpacing: "0.2em" }}>
                ROWS REMAINING
              </Mono>
              <div
                style={{
                  marginTop: 8,
                  width: 300,
                  height: 1,
                  background: `linear-gradient(90deg, transparent, ${C.red})`,
                }}
              />
              <Mono
                size={10}
                color={C.mute}
                style={{ display: "block", marginTop: 9, letterSpacing: "0.14em" }}
              >
                EXECUTED AGAINST PRODUCTION
              </Mono>
            </div>
          </div>
        </div>

        <WideFooter left="THE DATABASE WAS WIPED" right="1,206 RECORDS → 0" top={998} />
      </div>

      <Scanlines opacity={0.04} spacing={5} />
      <Beam start={3.2} duration={1.6} color={C.red} opacity={0.08} />
      <Vignette strength={1.02} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 06 · THE RECOVERY                                                   */
/* ------------------------------------------------------------------ */

export const WideRecovery: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 8.6, (x) => x);
  return (
    <AbsoluteFill style={{ background: "#06090D", overflow: "hidden" }}>
      <Glow x="20%" y="16%" size={62} opacity={0.1} color={C.cyan} />
      <Glow x="84%" y="72%" size={56} opacity={0.09} color={C.green} />
      <GridField opacity={0.22} size={110} color="rgba(82,224,164,0.05)" />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + camera * 0.02})` }}>
        <div style={{ position: "absolute", left: M, top: 62 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan} style={{ fontSize: 16 }}>
            {COPY.recoveryKicker}
          </Kicker>
        </div>
        <TopTags>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 10 }}>REPORTED</Tag>
          <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 10 }}>RECOVERY</Tag>
        </TopTags>

        <div style={{ position: "absolute", left: M, top: 150, width: 840 }}>
          <RecoveryConsole start={0.5} width={820} />
          <div
            style={{
              marginTop: 26,
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: progress(frame, fps, 3.2, 0.7),
            }}
          >
            <Mono size={12} color={C.cyan} style={{ letterSpacing: "0.16em" }}>1,206</Mono>
            <Divider color={`${C.cyan}55`} style={{ flex: 1 }} />
            <Mono size={12} color={C.green} style={{ letterSpacing: "0.16em" }}>RECOVERED</Mono>
          </div>
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 12,
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
                  padding: "14px 16px",
                }}
              >
                <Mono size={10} color={C.mute}>{item.label}</Mono>
                <div style={{ marginTop: 6, fontFamily: MONO, fontSize: 14, letterSpacing: "0.1em", color: item.color }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: "0.04em",
              lineHeight: 1.6,
              color: C.dim,
              opacity: progress(frame, fps, 5.6, 0.8) * 0.9,
            }}
          >
            The reported claim was wrong. A rollback restored the records.
          </div>
        </div>

        <div style={{ position: "absolute", right: M, top: 154, width: 840 }}>
          <MaskLine
            start={2.0}
            duration={0.72}
            style={{
              fontFamily: FONT,
              fontSize: 176,
              fontWeight: 800,
              letterSpacing: "-0.075em",
              lineHeight: 0.86,
              color: C.cyan,
              textShadow: `0 0 64px ${C.cyanSoft}`,
            }}
          >
            {COPY.recoveryAction}
          </MaskLine>
          <div
            style={{
              marginTop: 8,
              height: 2,
              width: `${progress(frame, fps, 2.2, 0.75) * 100}%`,
              background: `linear-gradient(90deg, ${C.cyan}, ${C.green}, transparent)`,
            }}
          />
          <div style={{ marginTop: 36, width: 560 }}>
            <WordReveal
              text={COPY.recoveryTitle}
              start={3.2}
              stagger={0.09}
              style={{ fontFamily: FONT, fontSize: 42, fontWeight: 600, letterSpacing: "0.08em", color: C.white }}
              wordStyle={{ fontFamily: FONT, fontSize: 42, fontWeight: 600, letterSpacing: "0.08em" }}
            />
          </div>
          <div style={{ marginTop: 22, width: 600 }}>
            <WordReveal
              text={COPY.recoveryResult}
              start={4.4}
              stagger={0.07}
              style={{ fontFamily: FONT, fontSize: 52, fontWeight: 600, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.white }}
              emphasis={["RESTORED"]}
              emphasisStyle={{ color: C.green }}
              wordStyle={{ fontFamily: FONT, fontSize: 52, fontWeight: 600 }}
            />
          </div>
          <div style={{ position: "absolute", right: 0, top: 470, opacity: 0.95 }}>
            <DatabaseCylinder size={250} start={2.6} health={1} label="CONTACTS" accent={C.green} />
          </div>
        </div>

        <WideFooter left="REPORTED CLAIM: RECOVERY IMPOSSIBLE" right="ROLLBACK RESTORED THE RECORDS" top={998} />
      </div>

      <Scanlines opacity={0.03} spacing={6} />
      <Beam start={3.6} duration={1.6} color={C.green} opacity={0.09} />
      <Vignette strength={0.94} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 07 · THE ENGINEERING LESSON                                         */
/* ------------------------------------------------------------------ */

const PRINCIPLES = [
  { label: "LEAST PRIVILEGE", color: C.cyan, start: 5.0 },
  { label: "HUMAN APPROVAL", color: C.orange, start: 6.5 },
  { label: "TESTED RECOVERY", color: C.green, start: 7.8 },
];

export const WideLesson: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 13.8, (x) => x);
  const sweep = progress(frame, fps, 8.2, 2.0);
  return (
    <AbsoluteFill style={{ background: "#070A0F", overflow: "hidden" }}>
      <Glow x="16%" y="16%" size={62} opacity={0.09} color={C.cyan} />
      <Glow x="86%" y="56%" size={58} opacity={0.07} color={C.blue} />
      <Glow x="50%" y="96%" size={50} opacity={0.05} color={C.green} />
      <GridField opacity={0.24} size={110} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + camera * 0.018})`, transformOrigin: "46% 46%" }}>
        <div style={{ position: "absolute", left: M, top: 62 }}>
          <Kicker start={0.1} color={C.silver} rule={C.cyan} style={{ fontSize: 16 }}>
            {COPY.lessonKicker}
          </Kicker>
        </div>

        <div style={{ position: "absolute", left: M, top: 140, width: 660 }}>
          <MaskLine
            start={0.25}
            duration={0.7}
            style={{ fontFamily: FONT, fontSize: 78, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.98, color: C.silver }}
          >
            {COPY.lessonTitle[0]}
          </MaskLine>
          <MaskLine
            start={0.36}
            duration={0.7}
            style={{ fontFamily: FONT, fontSize: 78, fontWeight: 600, letterSpacing: "-0.05em", lineHeight: 0.98, color: C.white }}
          >
            {COPY.lessonTitle[1]}
          </MaskLine>
          <MaskLine
            start={0.47}
            duration={0.72}
            style={{ fontFamily: FONT, fontSize: 82, fontWeight: 700, letterSpacing: "-0.05em", lineHeight: 1.0, color: C.cyan }}
          >
            SECURITY <span style={{ color: C.white }}>CONTROLS.</span>
          </MaskLine>
        </div>

        <div style={{ position: "absolute", left: M, top: 470, width: 640 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 500,
              letterSpacing: "0.04em",
              lineHeight: 1.6,
              color: C.dim,
              opacity: progress(frame, fps, 1.8, 0.7),
            }}
          >
            The deeper problem is architectural. An instruction is not a permission boundary.
          </div>
        </div>

        <div style={{ position: "absolute", left: M, top: 600, width: 650 }}>
          {PRINCIPLES.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px 18px",
                marginBottom: 10,
                border: `1px solid ${item.color}33`,
                background: `${item.color}0D`,
                borderRadius: 5,
                opacity: progress(frame, fps, item.start, 0.6),
                transform: `translateX(${(1 - progress(frame, fps, item.start, 0.6)) * -14}px)`,
              }}
            >
              <Mono size={12} color={item.color} style={{ letterSpacing: "0.14em" }}>{item.label}</Mono>
              <Mono size={11} color={C.mute}>REQUIRED</Mono>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            top: 860,
            width: 640,
            opacity: progress(frame, fps, 10.2, 0.8),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Divider color={`${C.cyan}44`} style={{ width: 60 }} />
            <Mono size={11} color={C.dim} style={{ letterSpacing: "0.14em" }}>
              INSTRUCTIONS ARE CONTEXT. PERMISSIONS ARE CONTROL.
            </Mono>
          </div>
        </div>

        <div style={{ position: "absolute", left: 924, top: 96, width: 900, height: 900, transform: "scale(0.86)", transformOrigin: "top left" }}>
          <ArchitectureMap start={2.6} scale={1} />
        </div>

        <WideFooter left="ARCHITECTURE · NOT URGENCY" right="ISOLATED BY DEFAULT" top={998} />
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
      <Scanlines opacity={0.03} spacing={6} />
      <Beam start={8.0} duration={2.2} color={C.cyan} opacity={0.06} />
      <Vignette strength={0.92} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* 08 · THE CONCLUSION                                                 */
/* ------------------------------------------------------------------ */

export const WideConclusion: React.FC = () => {
  const { frame, fps } = useTime();
  const camera = progress(frame, fps, 0, 14.4, (x) => x);
  const question = progress(frame, fps, 12.4, 0.7);
  const questionOut = progress(frame, fps, 14.45, 0.45, easeIn);
  const main = 1 - question;

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="52%" y="38%" size={64} opacity={0.07} color={C.cyan} />
      <Glow x="16%" y="82%" size={50} opacity={0.05} color={C.green} />
      <GridField opacity={0.2} size={112} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1.014 - camera * 0.014})`, transformOrigin: "50% 46%" }}>
        <div style={{ position: "absolute", inset: 0, opacity: main }}>
          <div style={{ position: "absolute", left: M, top: 62 }}>
            <Kicker start={0.15} color={C.silver} rule={C.cyan} style={{ fontSize: 16 }}>
              {COPY.conclusionKicker}
            </Kicker>
          </div>

          <div style={{ position: "absolute", left: M, top: 148, width: 700 }}>
            <MaskLine
              start={0.3}
              duration={0.75}
              style={{ fontFamily: FONT, fontSize: 104, fontWeight: 700, letterSpacing: "-0.06em", lineHeight: 0.96, color: C.white }}
            >
              AI CAN <span style={{ color: C.cyan }}>BUILD.</span>
            </MaskLine>
            <MaskLine
              start={0.44}
              duration={0.75}
              style={{ fontFamily: FONT, fontSize: 82, fontWeight: 600, letterSpacing: "-0.055em", lineHeight: 1.02, color: C.silver }}
            >
              ENGINEERING
            </MaskLine>
            <MaskLine
              start={0.56}
              duration={0.75}
              style={{ fontFamily: FONT, fontSize: 82, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 1.02, color: C.white }}
            >
              MUST PROTECT.
            </MaskLine>
          </div>

          <div style={{ position: "absolute", left: M, top: 590, width: 700 }}>
            <WordReveal
              text="BUT YOUR PRODUCTION DATA SHOULD NEVER DEPEND ON AN INSTRUCTION ALONE."
              start={4.6}
              stagger={0.055}
              style={{
                fontFamily: FONT,
                fontSize: 28,
                fontWeight: 500,
                letterSpacing: "0.05em",
                lineHeight: 1.55,
                color: C.silver,
              }}
              emphasis={["PRODUCTION", "NEVER", "INSTRUCTION"]}
              emphasisStyle={{ color: C.white }}
              wordStyle={{ fontFamily: FONT, fontSize: 28, fontWeight: 500, letterSpacing: "0.05em" }}
            />
          </div>

          <div style={{ position: "absolute", left: M, top: 760, display: "flex", gap: 10, opacity: progress(frame, fps, 2.4, 0.8) }}>
            <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 10 }}>ISOLATED DEV</Tag>
            <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 10 }}>RESTRICTED PERMISSIONS</Tag>
            <Tag color={C.green} background={C.greenSoft} style={{ fontSize: 10 }}>TESTED BACKUPS</Tag>
          </div>

          <div style={{ position: "absolute", left: 880, top: 300, width: 960 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <Mono size={11} color={C.cyan} style={{ letterSpacing: "0.16em" }}>SEPARATE ENVIRONMENTS</Mono>
              <Mono size={10} color={C.mute} style={{ letterSpacing: "0.14em" }}>SEPARATE RISK</Mono>
            </div>
            <SeparationDiagram start={1.2} />
          </div>

          <div style={{ position: "absolute", left: M, right: M, top: 944, opacity: progress(frame, fps, 5.2, 0.8) }}>
            <Divider color={C.lineSoft} />
            <div style={{ marginTop: 14, maxWidth: 1200 }}>
              <Mono size={9} color={C.mute} style={{ letterSpacing: "0.12em", lineHeight: 1.7 }}>
                {COPY.sourceFinePrint}
              </Mono>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: M,
            right: M,
            top: 300,
            opacity: question * (1 - questionOut),
            transform: `translateY(${(1 - question) * 20}px)`,
            textAlign: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, marginBottom: 34 }}>
            <div style={{ width: 54, height: 1, background: C.cyan }} />
            <Mono size={11} color={C.cyan} style={{ letterSpacing: "0.2em" }}>THE QUESTION</Mono>
            <div style={{ width: 54, height: 1, background: C.cyan }} />
          </div>
          <MaskLine
            start={12.45}
            duration={0.65}
            style={{ fontFamily: FONT, fontSize: 62, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.02, color: C.silver }}
          >
            {COPY.finalQuestion[0]}
          </MaskLine>
          <MaskLine
            start={12.55}
            duration={0.65}
            style={{ fontFamily: FONT, fontSize: 62, fontWeight: 600, letterSpacing: "-0.04em", lineHeight: 1.02, color: C.white }}
          >
            {COPY.finalQuestion[1]}
          </MaskLine>
          <MaskLine
            start={12.67}
            duration={0.7}
            style={{ fontFamily: FONT, fontSize: 178, fontWeight: 800, letterSpacing: "-0.07em", lineHeight: 0.92, color: C.cyan, textShadow: `0 0 70px ${C.cyanSoft}` }}
          >
            {COPY.finalQuestion[2]}
          </MaskLine>
          <div
            style={{
              margin: "34px auto 0",
              height: 2,
              width: `${progress(frame, fps, 12.9, 0.7) * 56}%`,
              background: `linear-gradient(90deg, transparent, ${C.cyan}, ${C.blue}, transparent)`,
            }}
          />
        </div>
      </div>

      <div style={{ position: "absolute", inset: 0, background: "#000000", opacity: questionOut * 0.85, pointerEvents: "none", zIndex: 90 }} />
      <Beam start={6.4} duration={2.4} color={C.cyan} opacity={0.06} />
      <Scanlines opacity={0.025} spacing={6} />
      <Vignette strength={0.9} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
