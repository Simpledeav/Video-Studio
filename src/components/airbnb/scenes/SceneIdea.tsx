import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { Doorway, Silhouette, DustMotes } from "../figures";
import { MarketplaceUI, MattressPlan } from "../interface";
import {
  Kicker,
  LightPool,
  MaskedLines,
  PhotoPlate,
  Vignette,
  clamp,
  easeOut,
  progress,
} from "../primitives";

/**
 * ACT 2 — The original idea (6.0 - 18.7s)
 *
 * San Francisco, rent pressure, three air mattresses, a breakfast table, an
 * early marketplace screen, and three guests arriving. Photographic plates are
 * illustrative licensed stock; the guests are deliberately anonymous.
 */
export const SceneIdea: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const yearIn = progress(frame, 0.35 * fps, 1.1 * fps);
  const guestIn = interpolate(t, [9.2, 9.8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0A09", overflow: "hidden" }}>
      {/* 6.0 - 8.8 : San Francisco exterior */}
      <PhotoPlate
        src="images/airbnb/sf-exterior.jpg"
        from={0}
        to={2.9}
        objectPosition="52% 58%"
        grade="warm"
        scaleFrom={1.06}
        scaleTo={1.16}
        light="radial-gradient(ellipse at 74% 18%, rgba(255,196,140,0.5), transparent 55%)"
      />

      {/* 8.4 - 12.4 : air mattress */}
      <PhotoPlate
        src="images/airbnb/air-mattress.jpg"
        from={2.5}
        to={6.5}
        objectPosition="50% 52%"
        fit="contain"
        grade="warm"
        scaleFrom={1.02}
        scaleTo={1.1}
        light="radial-gradient(ellipse at 26% 34%, rgba(255,196,150,0.42), transparent 62%)"
      />

      {/* 12.2 - 15.4 : breakfast + laptop */}
      <PhotoPlate
        src="images/airbnb/cereal-bowl.jpg"
        from={6.1}
        to={9.4}
        objectPosition="56% 44%"
        grade="warm"
        scaleFrom={1.05}
        scaleTo={1.16}
        light="radial-gradient(ellipse at 30% 20%, rgba(255,210,160,0.4), transparent 60%)"
      />

      {/* 15.2 - 18.7 : guests at the door */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#0B0907",
          opacity: interpolate(t, [9.0, 9.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #0A0806 0%, #120E0A 42%, #1A130D 100%)",
          }}
        />
        <Doorway
          x={wide ? 1180 : 300}
          y={wide ? 120 : 330}
          width={wide ? 340 : 390}
          height={wide ? 760 : 1000}
          open={easeOut(clamp((t - 9.2) / 0.9))}
          intensity={0.95}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "34%",
            background: "linear-gradient(180deg, #181009 0%, #080605 100%)",
          }}
        />
        <Silhouette pose="walk" x={wide ? 1310 : 520} y={wide ? 800 : 1290} height={wide ? 360 : 560} opacity={guestIn * 0.95} rim="#FFC790" bag />
        <Silhouette pose="carry" x={wide ? 1420 : 640} y={wide ? 795 : 1285} height={wide ? 350 : 540} opacity={guestIn * 0.92} flip rim="#FFC790" blur={0.8} />
        <Silhouette pose="stand" x={wide ? 1200 : 420} y={wide ? 800 : 1300} height={wide ? 340 : 520} opacity={guestIn * 0.8} blur={2.4} rim="#FFC790" rimOpacity={0.2} />
        <DustMotes count={18} start={9.2} area={[wide ? 60 : 20, 30, 26, 36]} />
        <LightPool x={wide ? 72 : 36} y={wide ? 44 : 38} size={760} color="rgba(255,180,120,0.34)" intensity={0.55} />
      </div>

      {/* mattress diagram overlay */}
      <div
        style={{
          position: "absolute",
          left: wide ? "58%" : "50%",
          top: wide ? "42%" : "42%",
          width: wide ? 620 : 460,
          height: wide ? 320 : 300,
          opacity: interpolate(t, [2.9, 3.4, 6.0, 6.4], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <MattressPlan start={3.1} />
      </div>

      {/* early marketplace screen */}
      <div
        style={{
          position: "absolute",
          right: wide ? "6%" : "5%",
          top: wide ? "26%" : "61%",
          width: wide ? 520 : 380,
          height: wide ? 380 : 300,
          opacity: interpolate(t, [6.5, 7.2, 9.0, 9.4], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          transform: `perspective(1200px) rotateY(${wide ? -8 : -9}deg) rotateX(3deg) translateY(${(1 - clamp((t - 6.5) / 1.2)) * 26}px)`,
          boxShadow: "0 40px 90px rgba(0,0,0,0.72), 0 0 0 1px rgba(243,238,229,0.14)",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <MarketplaceUI start={6.7} compact />
      </div>

      {/* titles */}
      <div
        style={{
          position: "absolute",
          left: wide ? "6%" : 78,
          top: wide ? "17%" : "11%",
          fontFamily: FONT_STACK,
          color: palette.textPrimary,
        }}
      >
        <div style={{ opacity: interpolate(t, [0, 2.2, 2.7], [1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
          <Kicker text={COPY.ideaCity} start={0.25} color="rgba(243,238,229,0.72)" ruleColor={palette.accent} />
          <div
            style={{
              marginTop: wide ? 10 : 14,
              fontSize: wide ? 108 : 148,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 0.9,
              opacity: yearIn,
              transform: `translateY(${(1 - yearIn) * 26}px)`,
              textShadow: "0 10px 50px rgba(0,0,0,0.55)",
            }}
          >
            {COPY.ideaYear}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: wide ? 12 : 13,
              letterSpacing: "0.24em",
              fontWeight: 500,
              color: "rgba(243,238,229,0.55)",
              opacity: yearIn,
            }}
          >
            {COPY.ideaCoords}
          </div>
        </div>

        <div style={{ position: "absolute", top: wide ? 250 : 380, left: 0, width: wide ? 560 : 820 }}>
          {t >= 2.7 && t < 6.3 ? (
            <MaskedLines
              lines={[COPY.ideaMattresses]}
              start={2.75}
              durationSeconds={0.8}
              exitSeconds={6.0}
              style={{
                fontSize: wide ? 44 : 54,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textShadow: "0 6px 30px rgba(0,0,0,0.7)",
              }}
            />
          ) : null}
          {t >= 6.3 ? (
            <MaskedLines
              lines={[COPY.ideaIdea]}
              start={6.35}
              durationSeconds={0.8}
              exitSeconds={9.2}
              accentWords={["UNUSUAL"]}
              accentColor={palette.accent}
              style={{
                fontSize: wide ? 44 : 54,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                textShadow: "0 6px 30px rgba(0,0,0,0.7)",
              }}
            />
          ) : null}
        </div>
      </div>

      {/* original name detail */}
      <div
        style={{
          position: "absolute",
          left: wide ? "7%" : 78,
          bottom: wide ? "10%" : "25%",
          opacity: interpolate(t, [9.7, 10.4, 11.7, 12.1], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          fontFamily: FONT_STACK,
          color: "rgba(243,238,229,0.8)",
        }}
      >
        <div style={{ fontSize: 11, letterSpacing: "0.34em", color: "rgba(243,238,229,0.45)" }}>
          THE FIRST NAME
        </div>
        <div style={{ marginTop: 8, fontSize: wide ? 30 : 36, fontWeight: 600, letterSpacing: "-0.01em" }}>
          AIRBED &amp; BREAKFAST
        </div>
        <div style={{ marginTop: 6, fontSize: 11, letterSpacing: "0.24em", color: palette.accent }}>
          THREE GUESTS · THREE AIRBEDS
        </div>
      </div>

      <Vignette strength={0.68} />
    </AbsoluteFill>
  );
};
