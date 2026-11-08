import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import { AppFrame, Glow, Grain, GridField, Kicker, MaskLine, Mono, progress, Reveal, Sweep, useTime, Vignette } from "../kit";
import { DashboardScreen } from "../ui";

export const SceneReveal: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const windowIn = progress(t, BEATS.reveal.window, 1.1);
  const pipelineIn = progress(t, BEATS.reveal.pipeline, 0.8);
  const appWidth = wide ? 920 : 954;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Glow x="50%" y="28%" size={58} color={C.blue} opacity={0.2} />
      <Glow x="50%" y="78%" size={52} color={C.blueDeep} opacity={0.16} />
      <GridField opacity={0.36} size={wide ? 92 : 72} />
      <Sweep start={2.6} duration={1.8} color={C.blueBright} opacity={0.13} />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: wide ? 58 : 118,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Kicker start={BEATS.reveal.mark} color={C.silver} rule={C.blue} style={{ justifyContent: "center" }}>
          {COPY.reveal.kicker}
        </Kicker>

        <Reveal start={BEATS.reveal.mark} y={18} scaleFrom={0.94} style={{ marginTop: wide ? 18 : 22 }}>
          <div style={{ display: "flex", alignItems: "center", gap: wide ? 18 : 15 }}>
            <div
              style={{
                width: wide ? 78 : 72,
                height: wide ? 78 : 72,
                borderRadius: wide ? 19 : 18,
                background: "linear-gradient(145deg, #5C9DFF 0%, #2E7BFF 52%, #1450C8 100%)",
                display: "grid",
                placeItems: "center",
                boxShadow: `0 18px 50px ${C.blue}44, inset 0 1px 0 rgba(255,255,255,0.24)`,
              }}
            >
              <svg width={wide ? 46 : 42} height={wide ? 46 : 42} viewBox="0 0 48 48" fill="none">
                <path d="M13 17.2h12.6a6.8 6.8 0 0 1 0 13.6h-4.4" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M13 30.8h7.1" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="33.4" cy="17.2" r="2.15" fill="#FFFFFF" />
              </svg>
            </div>
            <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: wide ? 64 : 58, letterSpacing: "-0.035em", lineHeight: 1 }}>
              <span style={{ color: C.white }}>GARAGE</span>
              <span style={{ color: C.blueBright }}>FLOW</span>
            </div>
          </div>
        </Reveal>

        <MaskLine start={BEATS.reveal.tagline} duration={0.7} style={{ marginTop: wide ? 18 : 20 }}>
          <div style={{ fontFamily: MONO, fontSize: wide ? 14 : 13, letterSpacing: "0.26em", color: C.silver, textAlign: "center" }}>
            {COPY.reveal.tagline}
          </div>
        </MaskLine>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 106 : 70,
          right: wide ? 106 : 70,
          top: wide ? 248 : 470,
          display: "flex",
          justifyContent: "center",
          opacity: pipelineIn,
        }}
      >
        <div style={{ width: wide ? 1080 : 900, position: "relative" }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 10, height: 1, background: C.lineSoft }} />
          <div style={{ position: "absolute", left: 40, top: 10, height: 1, width: `${pipelineIn * 82}%`, background: C.blue, opacity: 0.7 }} />
          <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
            {COPY.reveal.pipeline.map((step, index) => {
              const p = progress(t, BEATS.reveal.pipeline + index * 0.12, 0.45);
              return (
                <div key={step} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, opacity: p }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: index <= 2 ? C.blue : C.graphite2,
                      border: `1px solid ${index <= 2 ? C.blueBright : C.line}`,
                      boxShadow: index === 2 ? `0 0 16px ${C.blue}` : "none",
                    }}
                  />
                  <span style={{ fontFamily: MONO, fontSize: wide ? 8.5 : 7.6, letterSpacing: "0.14em", color: index <= 2 ? C.white : C.dim }}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: wide ? 306 : 566,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            opacity: windowIn,
            transform: `translateY(${(1 - windowIn) * 48}px) scale(${0.975 + windowIn * 0.025})`,
            transformOrigin: "50% 0%",
          }}
        >
          <AppFrame width={appWidth}>
            <DashboardScreen />
          </AppFrame>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 38 : 108,
          display: "flex",
          justifyContent: "center",
          opacity: progress(t, BEATS.reveal.note, 0.5),
        }}
      >
        <Mono size={wide ? 8.5 : 8} color={C.dim} style={{ letterSpacing: "0.16em", textAlign: "center" }}>
          {COPY.reveal.note}
        </Mono>
      </div>

      <Vignette strength={wide ? 0.72 : 0.82} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
