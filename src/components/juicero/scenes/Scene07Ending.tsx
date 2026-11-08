import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glow,
  Grain,
  Headline,
  Kicker,
  MONO,
  MonoLabel,
  Rule,
  Scanlines,
  Spark,
  Vignette,
  easeOut,
  progress,
} from "../kit";

export const Scene07Ending: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const line1 = progress(t, BEATS.ending.line1, 0.7, easeOut);
  const line2 = progress(t, BEATS.ending.line2, 0.6, easeOut);
  const question = progress(t, BEATS.ending.question, 0.7);
  const cta = progress(t, BEATS.ending.cta, 0.6);
  const settle = progress(t, BEATS.ending.settle, 0.7);
  const fade = 1 - settle;

  return (
    <AbsoluteFill style={{ backgroundColor: "#050504", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 32%, rgba(255,106,20,0.12) 0%, transparent 46%), radial-gradient(ellipse at 20% 86%, rgba(199,232,76,0.05), transparent 40%), linear-gradient(170deg, #100C07 0%, #060504 58%, #030302 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          top: "72%",
          height: "28%",
          background: "linear-gradient(180deg, rgba(255,106,20,0.07), transparent 70%)",
          transform: "perspective(900px) rotateX(68deg)",
          transformOrigin: "top center",
        }}
      />
      <Glow x="50%" y="28%" color={C.orange} opacity={0.13} />
      <Glow x="18%" y="82%" color={C.lime} opacity={0.04} />

      <div
        style={{
          position: "absolute",
          left: wide ? "50%" : margin,
          right: wide ? undefined : margin,
          top: wide ? "16%" : "19%",
          width: wide ? 1180 : undefined,
          transform: wide ? "translateX(-50%)" : undefined,
          opacity: fade,
          textAlign: wide ? "center" : "left",
        }}
      >
        <Kicker
          color={C.orange}
          style={{ justifyContent: wide ? "center" : "flex-start", opacity: line1 }}
        >
          {COPY.ending.kicker}
        </Kicker>
        <Headline size={wide ? 130 : 92} style={{ marginTop: 22 }}>
          <span style={{ display: "inline-block", opacity: line1, transform: `translateY(${(1 - line1) * 16}px)` }}>
            {COPY.ending.line1}
          </span>
          <br />
          <span
            style={{
              display: "inline-block",
              opacity: line2,
              transform: `translateY(${(1 - line2) * 16}px)`,
              color: C.orange,
            }}
          >
            {COPY.ending.line2}
          </span>
        </Headline>

        <div
          style={{
            marginTop: wide ? 28 : 24,
            maxWidth: wide ? 820 : 840,
            marginLeft: wide ? "auto" : undefined,
            marginRight: wide ? "auto" : undefined,
            opacity: question,
            transform: `translateY(${(1 - question) * 10}px)`,
          }}
        >
          <Rule width={wide ? 520 : 200} color="rgba(247,243,234,0.2)" />
          <div
            style={{
              marginTop: 14,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 30 : 27,
              lineHeight: 1.4,
              color: C.creamSoft,
            }}
          >
            {COPY.ending.question}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "50%" : margin,
          right: wide ? undefined : margin,
          top: wide ? "62%" : "45%",
          transform: wide ? "translateX(-50%)" : undefined,
          display: "flex",
          alignItems: "center",
          gap: 14,
          opacity: question * 0.72,
        }}
      >
        <span style={{ width: 48, height: 1, background: C.orange }} />
        <MonoLabel size={11} color={C.creamSoft} style={{ letterSpacing: "0.18em" }}>
          THE QUESTION BEFORE YOU BUILD
        </MonoLabel>
      </div>

      {/* CTA card */}
      <div
        style={{
          position: "absolute",
          left: wide ? "50%" : margin,
          right: wide ? undefined : margin,
          bottom: wide ? 84 : 596,
          width: wide ? 760 : undefined,
          transform: `translateX(${wide ? "-50%" : "0"}) translateY(${(1 - cta) * 18}px)`,
          opacity: cta * fade,
          display: "flex",
          alignItems: "center",
          gap: 18,
          padding: wide ? "18px 22px" : "16px 18px",
          background: "rgba(247,243,234,0.045)",
          border: "1px solid rgba(247,243,234,0.14)",
          borderRadius: 8,
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,106,20,0.12)",
            border: "1px solid rgba(255,106,20,0.36)",
            flexShrink: 0,
          }}
        >
          <Spark size={16} color={C.orange} />
        </div>
        <div style={{ minWidth: 0 }}>
          <MonoLabel size={10} color={C.orange} style={{ letterSpacing: "0.18em" }}>
            {COPY.ending.ctaLabel}
          </MonoLabel>
          <div
            style={{
              marginTop: 4,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 22 : 20,
              lineHeight: 1.38,
              color: C.white,
            }}
          >
            {COPY.ending.cta}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "50%" : margin,
          bottom: wide ? 34 : 48,
          transform: wide ? "translateX(-50%)" : undefined,
          fontFamily: MONO,
          fontSize: 11,
          letterSpacing: "0.18em",
          color: C.dim,
          opacity: fade * 0.8,
        }}
      >
        {COPY.ending.footer}
      </div>

      <Scanlines opacity={0.02} />
      <Grain opacity={0.055} />
      <Vignette strength={1.05} warm />
    </AbsoluteFill>
  );
};
