import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { CerealBox } from "../CerealBox";
import { Doorway, DustMotes, Silhouette } from "../figures";
import { SalesTally, SoldStamp } from "../interface";
import {
  Kicker,
  LightPool,
  MaskedLines,
  NumberTicker,
  Vignette,
  clamp,
  easeOut,
  progress,
} from "../primitives";

/**
 * ACT 5 — The unexpected funding (40.5 - 51.5s)
 *
 * A sold stamp, a clean financial graphic over a bokeh stack of boxes, then the
 * box carried toward the interview. The number is money raised through cereal
 * sales — explicitly not profit.
 */
export const SceneFunding: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const stampOut = 1 - clamp((t - 1.5) / 0.6);
  const moneyIn = interpolate(t, [1.55, 2.0, 5.5, 5.9], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const storyIn = interpolate(t, [5.7, 6.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const doorOpen = easeOut(clamp((t - 8.4) / 1.3));
  const counter = progress(frame, 2.1 * fps, 2.0 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#121110", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 46% 40%, rgba(62,48,38,0.6) 0%, rgba(20,18,16,0.94) 48%, #0A0908 100%)",
        }}
      />

      {/* bokeh stack of boxes behind the number */}
      <div
        style={{
          position: "absolute",
          right: wide ? "8%" : "4%",
          bottom: wide ? "-6%" : "4%",
          display: "flex",
          gap: 18,
          opacity: moneyIn * 0.42,
          filter: "blur(10px)",
          transform: "rotate(-8deg) scale(0.95)",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ marginTop: i % 2 === 0 ? 0 : 40 }}>
            <CerealBox
              variant={i % 2 === 0 ? "obama" : "mccain"}
              width={wide ? 150 : 170}
              height={wide ? 232 : 264}
              depth={wide ? 40 : 46}
              rotateY={-18 + i * 8}
              rotateX={7}
              glow={0.4}
              shadow={false}
            />
          </div>
        ))}
      </div>

      {/* sold box */}
      <div
        style={{
          position: "absolute",
          left: wide ? "64%" : "50%",
          top: wide ? "50%" : "46%",
          transform: `translate(-50%, -50%) scale(${1 + (1 - stampOut) * 0.04})`,
          opacity: stampOut,
        }}
      >
        <CerealBox
          variant="obama"
          width={wide ? 330 : 340}
          height={wide ? 512 : 527}
          depth={wide ? 90 : 92}
          rotateY={-14}
          rotateX={7}
          glow={0.8}
        />
        <div style={{ position: "absolute", left: "50%", top: "58%", transform: "translate(-50%, -50%)" }}>
          <SoldStamp start={0.5} />
        </div>
      </div>

      {/* financial graphic */}
      <div
        style={{
          position: "absolute",
          left: wide ? "6%" : 78,
          top: wide ? "28%" : "22%",
          width: wide ? 820 : 920,
          opacity: moneyIn,
          fontFamily: FONT_STACK,
          color: palette.textPrimary,
        }}
      >
        <Kicker text={COPY.fundingKicker} start={1.7} color="rgba(243,238,229,0.55)" ruleColor={palette.accent} />
        <div
          style={{
            marginTop: wide ? 16 : 24,
            fontSize: wide ? 132 : 150,
            fontWeight: 800,
            letterSpacing: "-0.055em",
            lineHeight: 0.9,
          }}
        >
          <NumberTicker from={0} to={30000} start={2.1} end={4.1} prefix="$" />
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 14,
            opacity: clamp((t - 2.5) / 0.7),
          }}
        >
          <div style={{ width: 44, height: 2, background: palette.accent }} />
          <div style={{ fontSize: wide ? 13 : 14, letterSpacing: "0.28em", fontWeight: 600 }}>
            {COPY.fundingNote}
          </div>
        </div>
        <div
          style={{
            marginTop: 30,
            display: "flex",
            gap: 30,
            alignItems: "flex-end",
            opacity: clamp((t - 3.0) / 0.7),
          }}
        >
          <div>
            <div style={{ fontSize: 9, letterSpacing: "0.26em", color: "rgba(243,238,229,0.4)" }}>THE MATH</div>
            <div style={{ marginTop: 6, fontSize: wide ? 20 : 23, fontWeight: 500, letterSpacing: "0.04em" }}>
              {COPY.fundingFormula}
            </div>
          </div>
          <div style={{ flex: 1 }} />
          <SalesTally start={3.0} />
        </div>
        <div
          style={{
            marginTop: 22,
            maxWidth: 560,
            fontSize: wide ? 13 : 14,
            lineHeight: 1.6,
            color: "rgba(243,238,229,0.5)",
            opacity: clamp((t - 3.5) / 0.7),
          }}
        >
          Not a scalable business — a bridge. Enough to keep the marketplace alive, and a story
          investors would remember.
        </div>
        <div
          style={{
            marginTop: 24,
            height: 2,
            width: `${counter * 100}%`,
            maxWidth: "100%",
            background: `linear-gradient(90deg, ${palette.accent}, rgba(255,90,95,0.08))`,
          }}
        />
      </div>

      {/* corridor + box carried to the interview */}
      <div style={{ position: "absolute", inset: 0, opacity: storyIn }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #070605 0%, #120E0A 44%, #1C140D 100%)",
          }}
        />
        <Doorway
          x={wide ? 1150 : 300}
          y={wide ? 150 : 280}
          width={wide ? 330 : 400}
          height={wide ? 700 : 1020}
          open={doorOpen}
          intensity={0.9}
          color="#FFD9AE"
        />

        {/* figures heading to the door, blurred background */}
        <div style={{ filter: "blur(2.6px)", opacity: 0.9 }}>
          <Silhouette pose="walk" x={wide ? 1290 : 520} y={wide ? 790 : 1330} height={wide ? 400 : 540} color="#070605" rim="#FFC48C" rimOpacity={0.35} bag />
          <Silhouette pose="stand" x={wide ? 1420 : 640} y={wide ? 800 : 1340} height={wide ? 380 : 510} color="#070605" flip rim="#FFC48C" rimOpacity={0.25} />
        </div>
        <DustMotes count={20} start={5.8} area={[wide ? 58 : 14, 20, 30, 46]} />

        {/* the box, foreground hero */}
        <div
          style={{
            position: "absolute",
            right: wide ? "16%" : "6%",
            bottom: wide ? "-6%" : "-2%",
            transform: "rotate(-10deg)",
            filter: "drop-shadow(0 40px 60px rgba(0,0,0,0.75))",
          }}
        >
          <CerealBox
            variant="obama"
            width={wide ? 230 : 236}
            height={wide ? 356 : 366}
            depth={wide ? 62 : 64}
            rotateY={-28}
            rotateX={10}
            glow={1}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            bottom: wide ? "16%" : "18%",
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <MaskedLines
            lines={[COPY.fundingStory]}
            start={6.9}
            durationSeconds={0.8}
            style={{ fontSize: wide ? 44 : 54, fontWeight: 700, letterSpacing: "-0.01em" }}
          />
          <div
            style={{
              marginTop: 10,
              fontSize: 11,
              letterSpacing: "0.3em",
              color: palette.accent,
              opacity: clamp((t - 7.4) / 0.6),
            }}
          >
            INTERVIEW · WINTER 2009
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            top: wide ? "18%" : "12%",
            maxWidth: wide ? 420 : 470,
            fontSize: wide ? 15 : 17,
            lineHeight: 1.6,
            fontFamily: FONT_STACK,
            color: "rgba(243,238,229,0.55)",
            opacity: clamp((t - 7.6) / 0.8),
          }}
        >
          The box was not a business model. But it was proof that these founders would try
          anything to keep going.
        </div>
      </div>

      <LightPool x={wide ? 30 : 34} y={57} size={800} color="rgba(255,180,120,0.22)" intensity={0.4} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
