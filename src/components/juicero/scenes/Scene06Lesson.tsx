import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, PHOTO, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glow,
  Grain,
  Headline,
  Kicker,
  MONO,
  MonoLabel,
  Photo,
  ReconstructionLabel,
  Scanlines,
  Spark,
  Vignette,
  photoSrc,
  progress,
} from "../kit";

const Widget: React.FC<{ index: number; wide: boolean }> = ({ index, wide }) => {
  const kind = index % 6;
  const height = wide ? 44 : 34;
  return (
    <div
      style={{
        borderRadius: 4,
        background: "rgba(12,18,28,0.86)",
        border: "1px solid rgba(247,243,234,0.08)",
        padding: wide ? "7px 8px" : "5px 6px",
        height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: 3 }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              width: wide ? 4 : 3,
              height: wide ? 4 : 3,
              borderRadius: "50%",
              background:
                i === index % 3
                  ? index % 2 === 0
                    ? C.orange
                    : C.blue
                  : "rgba(247,243,234,0.16)",
            }}
          />
        ))}
      </div>
      {kind < 3 ? (
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: height * 0.45 }}>
          {[0.3, 0.62, 0.42, 0.86, 0.54, 0.7].map((h, i) => (
            <span
              key={i}
              style={{
                width: wide ? 4 : 3,
                height: `${h * 100}%`,
                background: i === 3 ? C.orange : "rgba(77,141,255,0.6)",
                borderRadius: 1,
              }}
            />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <span style={{ height: 3, width: "70%", background: "rgba(247,243,234,0.16)", borderRadius: 2 }} />
          <span style={{ height: 3, width: "42%", background: "rgba(247,243,234,0.1)", borderRadius: 2 }} />
        </div>
      )}
    </div>
  );
};

const ComplexDashboard: React.FC<{ wide: boolean; t: number }> = ({ wide, t }) => {
  const toasts = [
    { at: 2.9, title: "AI INSIGHT", body: "Customer engagement is 0.4% above baseline." },
    { at: 3.7, title: "AI NOTIFICATION", body: "An AI noticed you opened the dashboard." },
    { at: 4.4, title: "AI SUGGESTION", body: "Enable AI to enable more AI." },
  ];
  return (
    <div
      style={{
        width: wide ? 820 : 930,
        borderRadius: 12,
        background: "linear-gradient(160deg, rgba(13,18,27,0.98), rgba(7,10,16,0.98))",
        border: "1px solid rgba(247,243,234,0.14)",
        boxShadow: "0 44px 100px rgba(0,0,0,0.6)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: wide ? 44 : 38,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 14px",
          background: "rgba(247,243,234,0.04)",
          borderBottom: "1px solid rgba(247,243,234,0.08)",
        }}
      >
        {[C.red, C.creamSoft, C.lime].map((color) => (
          <span key={color} style={{ width: 7, height: 7, borderRadius: "50%", background: color, opacity: 0.7 }} />
        ))}
        <div
          style={{
            marginLeft: 10,
            flex: 1,
            height: 18,
            borderRadius: 3,
            background: "rgba(247,243,234,0.06)",
            border: "1px solid rgba(247,243,234,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 8px",
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.1em",
            color: C.dim,
          }}
        >
          app.internal/workspace/dashboard/v47
        </div>
        <div
          style={{
            padding: "4px 7px",
            borderRadius: 3,
            background: "rgba(77,141,255,0.16)",
            color: C.blue,
            fontFamily: MONO,
            fontSize: 9,
          }}
        >
          47 WIDGETS
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: wide ? 140 : 130,
            padding: "10px 8px",
            borderRight: "1px solid rgba(247,243,234,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {["OVERVIEW", "ANALYTICS", "AUTOMATION", "AUDIENCE", "SETTINGS", "AUTH", "BILLING", "AI LAB", "EXPORTS"].map(
            (item, index) => (
              <div
                key={item}
                style={{
                  fontFamily: MONO,
                  fontSize: 8,
                  letterSpacing: "0.08em",
                  padding: "5px 6px",
                  borderRadius: 3,
                  background: index === 6 ? "rgba(226,58,50,0.12)" : "transparent",
                  color: index === 6 ? C.red : C.muted,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {item}
                {index === 6 ? <span>5</span> : null}
              </div>
            ),
          )}
        </div>
        <div style={{ flex: 1, padding: wide ? 12 : 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <MonoLabel size={9} color={C.creamSoft}>
              WORKSPACE OVERVIEW
            </MonoLabel>
            <MonoLabel size={8} color={C.red}>
              5 AUTH LAYERS REQUIRED
            </MonoLabel>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: wide ? 5 : 4,
            }}
          >
            {Array.from({ length: 47 }).map((_, index) => (
              <Widget key={index} index={index} wide={wide} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 9 }}>
            {["SSO", "2FA", "PASSKEY", "EMAIL", "ADMIN APPROVAL"].map((item) => (
              <div
                key={item}
                style={{
                  flex: 1,
                  padding: "5px 4px",
                  borderRadius: 3,
                  border: "1px solid rgba(226,58,50,0.22)",
                  background: "rgba(226,58,50,0.06)",
                  fontFamily: MONO,
                  fontSize: 7,
                  letterSpacing: "0.04em",
                  color: C.red,
                  textAlign: "center",
                }}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AI toasts */}
      {toasts.map((toast) => {
        const p = progress(t, toast.at, 0.45);
        return (
          <div
            key={toast.title}
            style={{
              position: "absolute",
              right: wide ? 24 : 16,
              top: wide ? 74 : 58,
              width: wide ? 280 : 250,
              padding: "9px 11px",
              borderRadius: 6,
              background: "rgba(16,22,33,0.96)",
              border: "1px solid rgba(77,141,255,0.32)",
              boxShadow: "0 16px 34px rgba(0,0,0,0.4)",
              opacity: p,
              transform: `translateY(${(1 - p) * 14}px)`,
              marginTop: toasts.indexOf(toast) * 58,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Spark size={10} color={C.blue} />
              <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.1em", color: C.blue }}>
                {toast.title}
              </span>
            </div>
            <div style={{ fontFamily: FONT, fontSize: 11, lineHeight: 1.35, color: C.creamSoft, marginTop: 4 }}>
              {toast.body}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const CleanApp: React.FC<{ wide: boolean; t: number }> = ({ wide, t }) => {
  const click = progress(t, BEATS.lesson.click, 0.2);
  const solved = progress(t, BEATS.lesson.solved, 0.4);
  return (
    <div
      style={{
        width: wide ? 760 : 820,
        borderRadius: 14,
        background: "linear-gradient(165deg, #F9F5EC, #ECE2D1)",
        boxShadow: "0 50px 110px rgba(0,0,0,0.58)",
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.6)",
      }}
    >
      <div
        style={{
          height: wide ? 42 : 38,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 16px",
          borderBottom: "1px solid rgba(30,22,12,0.1)",
          background: "rgba(255,255,255,0.44)",
        }}
      >
        {["#E7DECE", "#E7DECE", "#E7DECE"].map((color, i) => (
          <span key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
        ))}
        <div style={{ marginLeft: 10, fontFamily: MONO, fontSize: 10, letterSpacing: "0.12em", color: "rgba(30,22,12,0.44)" }}>
          app.internal / simple
        </div>
        <div
          style={{
            marginLeft: "auto",
            padding: "4px 8px",
            borderRadius: 4,
            background: "rgba(65,201,139,0.14)",
            color: "#20865B",
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.08em",
          }}
        >
          1 SCREEN
        </div>
      </div>
      <div style={{ padding: wide ? "44px 56px" : "42px 44px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            color: "rgba(30,22,12,0.44)",
          }}
        >
          YOUR CUSTOMER'S ONLY JOB
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: wide ? 42 : 38,
            letterSpacing: "-0.03em",
            color: "#17110A",
          }}
        >
          SOLVE THE PROBLEM.
        </div>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "relative",
              width: wide ? 300 : 280,
              height: 64,
              borderRadius: 8,
              background: click > 0.4 ? "#20865B" : C.orange,
              color: "#FFF8EC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 18,
              letterSpacing: "0.02em",
              boxShadow: "0 14px 26px rgba(0,0,0,0.18)",
              transform: `scale(${1 - click * 0.04})`,
            }}
          >
            {solved > 0.4 ? "DONE." : "FIX MY PROBLEM"}
            <div
              style={{
                position: "absolute",
                right: 26,
                bottom: -28,
                width: 18,
                height: 26,
                opacity: progress(t, BEATS.lesson.click - 0.4, 0.2) * (1 - progress(t, BEATS.lesson.click + 0.2, 0.2)),
              }}
            >
              <svg viewBox="0 0 20 30" width="18" height="26">
                <path d="M2 2 L2 24 L8 18 L12 28 L17 26 L13 16 L20 15 Z" fill="#17110A" stroke="#FFF8EC" strokeWidth="1.4" />
              </svg>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: FONT,
            fontSize: 16,
            color: solved > 0.4 ? "#20865B" : "rgba(30,22,12,0.46)",
            opacity: 0.9,
          }}
        >
          {solved > 0.4 ? "One click. No dashboard. No subscription." : "No setup. No auth maze. No AI."}
        </div>
      </div>
    </div>
  );
};

export const Scene06Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const workspace = progress(t, BEATS.lesson.workspace, 0.5);
  const dashboard = progress(t, BEATS.lesson.dashboard - 0.3, 0.5) * (1 - progress(t, BEATS.lesson.wipe - 0.2, 0.4));
  const owner = progress(t, BEATS.lesson.owner - 0.3, 0.45) * (1 - progress(t, BEATS.lesson.wipe - 0.1, 0.35));
  const clean = progress(t, BEATS.lesson.clean - 0.3, 0.5);
  const equation = progress(t, BEATS.lesson.equation, 0.5) * (1 - progress(t, BEATS.lesson.final - 0.3, 0.4));
  const final = progress(t, BEATS.lesson.final - 0.25, 0.5);
  const flash = progress(t, BEATS.lesson.wipe - 0.12, 0.18) * (1 - progress(t, BEATS.lesson.wipe + 0.08, 0.22));
  const dashboardScale = 1 - progress(t, BEATS.lesson.wipe, 0.4) * 0.04;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050609", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 72% 26%, rgba(77,141,255,0.14), transparent 42%), radial-gradient(ellipse at 16% 76%, rgba(255,106,20,0.12), transparent 42%), linear-gradient(165deg, #0B0E13 0%, #050608 62%, #030304 100%)",
        }}
      />

      <AbsoluteFill style={{ opacity: workspace }}>
        <Photo src={photoSrc(PHOTO.developer)} grade="cool" objectPosition="50% 42%" scale={1.04} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(3,4,6,0.94) 0%, rgba(3,4,6,0.32) 50%, rgba(3,4,6,0.62) 100%), linear-gradient(180deg, rgba(3,4,6,0.32), rgba(3,4,6,0.9))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 92 : 124,
            maxWidth: wide ? 660 : 820,
          }}
        >
          <Kicker color={C.blue}>{COPY.lesson.kicker}</Kicker>
          <Headline size={wide ? 78 : 72} style={{ marginTop: 16 }}>
            {COPY.lesson.title1}
            <br />
            {COPY.lesson.title2}
          </Headline>
          <div
            style={{
              marginTop: 16,
              fontFamily: FONT,
              fontSize: wide ? 26 : 24,
              color: C.creamSoft,
              lineHeight: 1.4,
            }}
          >
            {COPY.lesson.sub}
          </div>
        </div>
        <ReconstructionLabel
          text={COPY.lesson.note}
          style={{ position: "absolute", left: margin, bottom: wide ? 44 : 150 }}
        />
      </AbsoluteFill>

      {/* Complex dashboard */}
      <AbsoluteFill style={{ opacity: dashboard }}>
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : "50%",
            top: wide ? "54%" : "57%",
            transform: `translate(-50%,-50%) scale(${(wide ? 0.98 : 0.88) * dashboardScale})`,
          }}
        >
          <ComplexDashboard wide={wide} t={t} />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? 104 : margin,
            bottom: wide ? 84 : 314,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            width: wide ? 420 : undefined,
            right: wide ? undefined : margin,
          }}
        >
          {[
            { label: COPY.lesson.widgets, at: BEATS.lesson.widgets },
            { label: COPY.lesson.ai, at: BEATS.lesson.ai },
            { label: COPY.lesson.auth, at: BEATS.lesson.auth },
            { label: COPY.lesson.settings, at: BEATS.lesson.auth + 0.7 },
          ].map((item) => {
            const p = progress(t, item.at, 0.35);
            return (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -14}px)`,
                }}
              >
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.red }} />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: wide ? 13 : 11,
                    letterSpacing: "0.1em",
                    color: C.creamSoft,
                  }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>

      {/* Frustrated owner */}
      <AbsoluteFill style={{ opacity: owner }}>
        <Photo src={photoSrc(PHOTO.owner)} grade="silver" objectPosition="50% 30%" scale={1.04} />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(3,4,6,0.92) 0%, rgba(3,4,6,0.3) 52%, rgba(3,4,6,0.84) 100%), linear-gradient(180deg, rgba(3,4,6,0.2), rgba(3,4,6,0.82))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            bottom: wide ? 90 : 260,
            maxWidth: wide ? 680 : 780,
          }}
        >
          <Kicker color={C.orange}>{COPY.lesson.owner}</Kicker>
          <Headline size={wide ? 78 : 72} style={{ marginTop: 14 }}>
            HE DOESN'T WANT
            <br />
            A DASHBOARD.
          </Headline>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontSize: wide ? 27 : 24,
              lineHeight: 1.4,
              color: C.creamSoft,
            }}
          >
            He wants the invoice sent, the booking confirmed, and the problem gone.
          </div>
        </div>
      </AbsoluteFill>

      {/* Clean app */}
      <AbsoluteFill style={{ opacity: clean }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(65,201,139,0.12), transparent 42%), linear-gradient(160deg, #0A100C, #040504 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: wide ? "54%" : "57%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <CleanApp wide={wide} t={t} />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? 104 : margin,
            top: wide ? 92 : 174,
          }}
        >
          <Kicker color={C.green}>{COPY.lesson.clean}</Kicker>
          <div
            style={{
              marginTop: 12,
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: wide ? 62 : 54,
              letterSpacing: "-0.03em",
              color: C.white,
              textTransform: "uppercase",
            }}
          >
            {COPY.lesson.solved}
          </div>
        </div>
      </AbsoluteFill>

      {/* Equation */}
      <AbsoluteFill style={{ opacity: equation }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 46%, rgba(255,106,20,0.14), transparent 46%), linear-gradient(160deg, #0E0A06, #040302 74%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: wide ? "38%" : "34%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 14,
          }}
        >
          <Kicker color={C.orange} style={{ justifyContent: "center" }}>
            THE EQUATION
          </Kicker>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: wide ? 28 : 16,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: wide ? 94 : 78,
                letterSpacing: "-0.04em",
                color: C.white,
              }}
            >
              {COPY.lesson.equation1}
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: wide ? 94 : 78,
                color: C.orange,
              }}
            >
              {COPY.lesson.equation2}
            </span>
            <span
              style={{
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: wide ? 94 : 78,
                letterSpacing: "-0.04em",
                color: C.orange,
              }}
            >
              {COPY.lesson.equation3}
            </span>
          </div>
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT,
              fontSize: wide ? 28 : 24,
              color: C.creamSoft,
              maxWidth: wide ? 820 : 760,
              lineHeight: 1.42,
            }}
          >
            The customer does not pay for the number of screens. They pay for the
            problem to disappear.
          </div>
          <div
            style={{
              marginTop: wide ? 34 : 30,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={index}
                style={{
                  width: wide ? 7 : 6,
                  height: wide ? 7 : 6,
                  borderRadius: 1,
                  background: "rgba(247,243,234,0.16)",
                }}
              />
            ))}
            <span style={{ marginLeft: 10, fontFamily: MONO, fontSize: 10, color: C.dim }}>
              →
            </span>
            <span
              style={{
                marginLeft: 10,
                padding: "9px 16px",
                borderRadius: 5,
                background: C.orange,
                color: "#FFF8EC",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: wide ? 17 : 15,
              }}
            >
              1 BUTTON
            </span>
          </div>
        </div>
      </AbsoluteFill>

      {/* Final line */}
      <AbsoluteFill style={{ opacity: final }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 46%, rgba(199,232,76,0.12), transparent 44%), linear-gradient(160deg, #0B0D07, #040403 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            right: wide ? undefined : margin,
            top: wide ? "49%" : "34%",
            width: wide ? 1000 : undefined,
            transform: wide ? "translate(-50%,-50%)" : undefined,
            textAlign: wide ? "center" : "left",
          }}
        >
          <Kicker color={C.lime} style={{ justifyContent: wide ? "center" : "flex-start" }}>
            THE PRACTICAL RULE
          </Kicker>
          <Headline size={wide ? 112 : 90} style={{ marginTop: 18 }}>
            SOLVE THE
            <br />
            PROBLEM
            <br />
            <span style={{ color: C.lime }}>FIRST.</span>
          </Headline>
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT,
              fontSize: wide ? 27 : 24,
              lineHeight: 1.42,
              color: C.creamSoft,
              maxWidth: wide ? 760 : 780,
              marginLeft: wide ? "auto" : undefined,
              marginRight: wide ? "auto" : undefined,
            }}
          >
            Then earn the right to add the AI, the dashboards, and the five
            authentication layers.
          </div>
        </div>
      </AbsoluteFill>

      {/* wipe flash */}
      <AbsoluteFill
        style={{
          background: "rgba(247,243,234,0.86)",
          opacity: flash * 0.5,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      <Glow x="62%" y="42%" color={C.blue} opacity={0.07} />
      <Scanlines opacity={0.03} />
      <Grain opacity={0.05} />
      <Vignette strength={1} />
    </AbsoluteFill>
  );
};
