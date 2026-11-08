import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { CerealBox } from "../CerealBox";
import { DustMotes } from "../figures";
import {
  AccentLine,
  Kicker,
  LightPool,
  MaskedLines,
  Vignette,
  clamp,
  easeOut,
} from "../primitives";

/**
 * ACT 1 — The unexpected hook (0.0 - 6.0s)
 *
 * Darkness, a warm practical, and one object: the cereal box. The camera pushes
 * in; an editorial macro insert reveals the cardboard while the title lands.
 */
export const SceneHook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const push = easeOut(clamp(t / 6.0));
  const boxIn = easeOut(clamp((t - 0.35) / 1.5));
  const rotateY = -22 + push * 16 + Math.sin(t * 0.9) * 1.2;
  const sweep = interpolate(t, [3.4, 4.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const macro = interpolate(t, [2.0, 2.5, 3.2, 3.7], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const title1 = t >= 1.05;
  const title2 = t >= 3.75;

  return (
    <AbsoluteFill style={{ backgroundColor: "#0A0908", overflow: "hidden" }}>
      {/* warm room wash */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 18% 8%, rgba(90,62,40,0.55) 0%, rgba(20,16,13,0.9) 46%, #070606 100%)",
        }}
      />
      <LightPool x={26} y={22} size={900} color="rgba(255,196,140,0.5)" intensity={0.5} blur={110} />

      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + macro * 1.25})`, transformOrigin: "50% 42%" }}>
      {/* table */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "46%",
          background: "linear-gradient(180deg, #241811 0%, #120C09 58%, #080606 100%)",
          boxShadow: "inset 0 22px 60px rgba(0,0,0,0.6)",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "6%",
            right: "6%",
            top: 0,
            height: "70%",
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(255,196,144,0.34) 0%, rgba(255,150,90,0.06) 45%, transparent 72%)",
            filter: "blur(16px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(92deg, rgba(255,220,180,0.035) 0px, rgba(255,220,180,0.035) 1px, transparent 1px, transparent 26px)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* hero box */}
      <div
        style={{
          position: "absolute",
          left: wide ? "72%" : "50%",
          top: wide ? "58%" : "52%",
          transform: `translate(-50%, -46%) scale(${1 + push * 0.09})`,
          opacity: boxIn,
        }}
      >
        <CerealBox
          width={wide ? 370 : 372}
          height={wide ? 569 : 576}
          depth={wide ? 104 : 106}
          rotateY={rotateY}
          rotateX={7 + push * 2}
          rotateZ={-1.6 + sweep * 1.2}
          glow={0.5 + push * 0.5}
        />
        {/* light sweep from the practical, as if the box is turned by hand */}
        <div
          style={{
            position: "absolute",
            inset: "-6%",
            background: `linear-gradient(${100 + sweep * 24}deg, transparent 26%, rgba(255,225,190,${0.18 + sweep * 0.16}) 48%, transparent 62%)`,
            mixBlendMode: "screen",
            pointerEvents: "none",
            filter: "blur(6px)",
          }}
        />
      </div>

      <DustMotes count={22} start={0} area={[20, 24, 66, 44]} />
      </div>

      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse at 50% 44%, rgba(10,8,7,0.12) 0%, rgba(10,8,7,0.82) 100%)",
          opacity: macro * 0.9,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(90deg, rgba(8,6,5,0.86) 0%, rgba(8,6,5,0.45) 34%, transparent 62%)",
          opacity: macro,
          pointerEvents: "none",
        }}
      />

      {/* second box, foreground, out of focus */}
      <div
        style={{
          position: "absolute",
          left: wide ? "8%" : "-16%",
          bottom: wide ? "-14%" : "-8%",
          transform: "rotate(-14deg)",
          filter: "blur(7px)",
          opacity: 0.9,
        }}
      >
        <CerealBox
          variant="mccain"
          width={wide ? 260 : 320}
          height={wide ? 403 : 496}
          depth={wide ? 70 : 84}
          rotateY={26}
          rotateX={12}
          glow={0}
          shadow={false}
        />
      </div>

      <Vignette strength={0.5} />

      {/* titles */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            top: wide ? "50%" : "17%",
            transform: wide ? "translateY(-50%)" : undefined,
            width: wide ? 700 : 880,
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          {title1 ? (
            <MaskedLines
              lines={[COPY.hookLine1, COPY.hookLine2]}
              start={1.05}
              stagger={0.18}
              durationSeconds={0.95}
              accentWords={["CEREAL."]}
              accentColor={palette.accent}
              exitSeconds={title2 ? 3.62 : undefined}
              style={{
                fontSize: wide ? 86 : 82,
                fontWeight: 800,
                letterSpacing: "-0.035em",
                lineHeight: 1.0,
                textTransform: "uppercase",
                textShadow: "0 8px 40px rgba(0,0,0,0.65)",
              }}
            />
          ) : null}

          {title2 ? (
            <div style={{ marginTop: wide ? 14 : 22 }}>
              <div
                style={{
                  fontFamily: FONT_STACK,
                  fontSize: wide ? 34 : 44,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  color: palette.accent,
                  opacity: easeOut(clamp((t - 3.75) / 0.7)),
                  transform: `translateY(${(1 - easeOut(clamp((t - 3.75) / 0.7))) * 18}px)`,
                  lineHeight: 1.15,
                }}
              >
                {COPY.hookLine3}
              </div>
              <div style={{ marginTop: 18, maxWidth: 420 }}>
                <Kicker
                  text={COPY.hookKicker}
                  start={4.55}
                  color="rgba(243,238,229,0.55)"
                  ruleColor="rgba(243,238,229,0.4)"
                  tracking={0.3}
                  style={{ opacity: 0.9 }}
                />
              </div>
            </div>
          ) : null}
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            bottom: wide ? "14%" : "24%",
            opacity: interpolate(t, [0.9, 1.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
            fontFamily: FONT_STACK,
            fontSize: 11,
            letterSpacing: "0.34em",
            color: "rgba(243,238,229,0.34)",
          }}
        >
          <AccentLine
            text="ONE OBJECT · ONE STORY"
            accentColor={palette.accent}
          />
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
