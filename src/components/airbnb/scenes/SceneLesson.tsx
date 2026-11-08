import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BRAND_REVEAL_SECONDS, COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { CerealBox } from "../CerealBox";
import { Doorway, DustMotes } from "../figures";
import { WorldMap } from "../interface";
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
import { SimpledeavSignOff } from "../../branding/SimpledeavSignOff";

/**
 * ACT 7 — The lesson (65.6 - 80.0s)
 *
 * Light, air, and a return to the object that started everything. The film ends
 * on the Simpledeav signature rather than a hard sell.
 */
export const SceneLesson: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const mapIn = interpolate(t, [3.5, 4.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const boxIn = interpolate(t, [9.2, 9.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#0E0C0A", overflow: "hidden" }}>
      {/* ---------- beautiful accommodation ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(t, [0, 0.8, 3.4, 3.9], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <PhotoPlate src="images/airbnb/loft-bedroom.jpg" from={0} to={3.9} objectPosition="58% 52%" grade="interior" scaleFrom={1.06} scaleTo={1.16} scrim="both" />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(9,8,7,0.97) 0%, rgba(9,8,7,0.86) 34%, rgba(9,8,7,0.32) 62%, rgba(9,8,7,0.08) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            top: wide ? "50%" : "20%",
            transform: wide ? "translateY(-50%)" : undefined,
            width: wide ? 620 : 700,
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <Kicker text="THE EARLY LESSON" start={0.5} color="rgba(243,238,229,0.6)" ruleColor={palette.accent} />
          <div style={{ marginTop: wide ? 18 : 26, display: "flex", flexDirection: "column", gap: wide ? 12 : 18 }}>
            {COPY.lessonWords.map((word, index) => {
              const start = 0.45 + index * 0.8;
              const p = progress(frame, start * fps, 0.7 * fps);
              return (
                <div key={word} style={{ display: "flex", alignItems: "baseline", gap: 18, opacity: p }}>
                  <span
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.2em",
                      color: index === 2 ? palette.accent : "rgba(243,238,229,0.4)",
                      width: 26,
                    }}
                  >
                    0{index + 1}
                  </span>
                  <span
                    style={{
                      fontSize: wide ? 40 : index === 2 ? 38 : 44,
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.08,
                      color: index === 2 ? palette.textPrimary : "rgba(243,238,229,0.9)",
                      transform: `translateY(${(1 - p) * 18}px)`,
                    }}
                  >
                    {word}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- world map ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: mapIn,
          backgroundColor: "#0B0A09",
        }}
      >
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 50% 46%, rgba(40,32,28,0.6), #0A0908 72%)",
          }}
        />
        <WorldMap start={3.8} />
        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            top: wide ? "12%" : "8%",
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <Kicker text="A GLOBAL TRAVEL PLATFORM" start={4.1} color="rgba(243,238,229,0.55)" ruleColor={palette.accent} />
          <div
            style={{
              marginTop: 14,
              fontSize: 15,
              lineHeight: 1.6,
              color: "rgba(243,238,229,0.5)",
              maxWidth: 330,
              opacity: progress(frame, 4.4 * fps, 0.8 * fps),
            }}
          >
            What began as three airbeds in one apartment became a network of homes
            across the world.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            bottom: wide ? "14%" : "16%",
            fontFamily: FONT_STACK,
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "rgba(243,238,229,0.35)",
            opacity: progress(frame, 4.6 * fps, 0.8 * fps),
          }}
        >
          FROM THREE AIR MATTRESSES TO A WORLD OF DOORS
        </div>
      </div>

      {/* ---------- door ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(t, [6.3, 6.9, 9.1, 9.5], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          backgroundColor: "#0A0807",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(90deg, #080605 0%, #100C08 52%, #1A130C 100%)",
          }}
        />
        <Doorway x={wide ? 1240 : 430} y={wide ? 100 : 200} width={wide ? 440 : 430} height={wide ? 880 : 1060} open={easeOut(clamp((t - 6.5) / 1.1))} intensity={1} />
        <div
          style={{
            position: "absolute",
            left: wide ? "56.6%" : "40.6%",
            top: wide ? "30%" : "26%",
            width: wide ? 330 : 380,
            height: 3,
            background: "rgba(255,255,255,0.55)",
            boxShadow: "0 0 24px 6px rgba(255,236,200,0.55)",
            opacity: 0.7,
          }}
        />
        <DustMotes count={26} start={6.5} area={[wide ? 58 : 24, 20, 26, 52]} />
        <div
          style={{
            position: "absolute",
            left: wide ? "52%" : "18%",
            right: wide ? "34%" : "8%",
            bottom: 0,
            height: "34%",
            background:
              "linear-gradient(180deg, transparent 0%, rgba(255,196,140,0.16) 42%, rgba(255,196,140,0.28) 100%)",
            filter: "blur(18px)",
            opacity: easeOut(clamp((t - 6.7) / 1.2)),
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            bottom: wide ? "18%" : "13%",
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
            width: wide ? 620 : 720,
          }}
        >
          <MaskedLines
            lines={[COPY.lessonClose]}
            start={7.5}
            durationSeconds={0.9}
            accentWords={["ANOTHER"]}
            accentColor={palette.accent}
            style={{
              fontSize: wide ? 60 : 74,
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.02,
              textShadow: "0 12px 50px rgba(0,0,0,0.6)",
            }}
          />
        </div>
      </div>

      {/* ---------- the box returns ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: boxIn,
          backgroundColor: "#0B0908",
        }}
      >
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 50% 44%, rgba(88,60,40,0.65) 0%, #120D09 48%, #070606 100%)",
          }}
        />
        <LightPool x={50} y={42} size={900} color="rgba(255,190,140,0.42)" intensity={0.5} />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "47%",
            transform: "translate(-50%, -50%) scale(0.9)",
          }}
        >
          <CerealBox
            variant="obama"
            width={wide ? 330 : 340}
            height={wide ? 512 : 527}
            depth={wide ? 92 : 94}
            rotateY={-12 + (t - 9.3) * 3}
            rotateX={7}
            glow={0.85}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: wide ? "14%" : "18%",
            textAlign: "center",
            fontFamily: FONT_STACK,
            fontSize: 10,
            letterSpacing: "0.32em",
            color: "rgba(243,238,229,0.42)",
          }}
        >
          IT STARTED WITH A BOX
        </div>
      </div>

      {/* ---------- signature ---------- */}
      <SimpledeavSignOff startSeconds={BRAND_REVEAL_SECONDS - 65.6} tag={COPY.brandTag} />

      <Vignette strength={0.4} />
    </AbsoluteFill>
  );
};
