import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { CerealBox } from "../CerealBox";
import { KeysOnTable, Silhouette } from "../figures";
import { BeforeAfter, ListingGrid } from "../interface";
import { Kicker, LightPool, MaskedLines, PhotoPlate, Vignette, clamp, progress } from "../primitives";

/**
 * ACT 6 — The real breakthrough (51.5 - 65.6s)
 *
 * Accepted, then back to the actual problem: hosts, photographs, listings. The
 * camera is an object here, not a metaphor — the shutter is the turning point.
 */
export const SceneBreakthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const interviewIn = interpolate(t, [0, 0.55, 3.2, 3.6], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cameraIn = interpolate(t, [7.35, 7.75, 8.85, 9.25], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const flash = interpolate(t, [7.85, 7.95, 8.4], [0, 0.8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const listingsIn = progress(frame, 11.4 * fps, 0.8 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#0C0B0A", overflow: "hidden" }}>
      {/* ---------- interview room ---------- */}
      <div style={{ position: "absolute", inset: 0, opacity: interviewIn }}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(180deg, #1B1510 0%, #15100C 42%, #0C0A08 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "58%" : "48%",
            top: wide ? "8%" : "7%",
            width: wide ? 520 : 500,
            height: wide ? 330 : 380,
            background: "radial-gradient(ellipse at 50% 40%, rgba(120,146,168,0.16), transparent 68%)",
            filter: "blur(18px)",
          }}
        />
        <LightPool x={wide ? 72 : 52} y={wide ? 24 : 20} size={wide ? 700 : 900} color="rgba(255,196,140,0.22)" intensity={0.4} />

        {/* interviewers behind the table */}
        <LightPool x={wide ? 58 : 52} y={wide ? 44 : 40} size={wide ? 900 : 760} color="rgba(255,196,140,0.3)" intensity={0.55} />
        <Silhouette pose="seated" x={wide ? 880 : 430} y={wide ? 860 : 1480} height={wide ? 640 : 780} color="#0A0806" />
        <Silhouette pose="seated" x={wide ? 1120 : 660} y={wide ? 868 : 1496} height={wide ? 620 : 760} color="#090705" />
        <Silhouette pose="seated" x={wide ? 1360 : 890} y={wide ? 876 : 1512} height={wide ? 600 : 740} color="#090705" />

        {/* table surface */}
        <div
          style={{
            position: "absolute",
            left: "-6%",
            right: "-6%",
            top: wide ? "58%" : "61%",
            height: "45%",
            background:
              "linear-gradient(180deg, #4A3523 0%, #2A1D13 22%, #150F0A 68%, #080606 100%)",
            boxShadow: "0 -1px 0 rgba(255,214,170,0.2), inset 0 30px 70px rgba(0,0,0,0.5)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse at 44% 0%, rgba(255,206,150,0.4) 0%, transparent 56%)",
              mixBlendMode: "screen",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: "6%",
              right: "6%",
              top: 6,
              height: 1,
              background: "linear-gradient(90deg, transparent, rgba(255,224,190,0.45), transparent)",
            }}
          />
        </div>

        {/* objects on the table */}
        <div
          style={{
            position: "absolute",
            left: wide ? "58%" : "44%",
            top: wide ? "58%" : "65%",
            transform: "translate(-50%, -50%) rotate(-4deg)",
          }}
        >
          <CerealBox
            variant="obama"
            width={wide ? 240 : 190}
            height={wide ? 372 : 294}
            depth={wide ? 66 : 52}
            rotateY={-20}
            rotateX={6}
            glow={1}
          />
          <div style={{ position: "absolute", left: "-24%", right: "-24%", bottom: -26, height: 34, background: "radial-gradient(ellipse at 50% 0%, rgba(0,0,0,0.85), transparent 72%)", filter: "blur(8px)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "64%" : "66%",
            top: wide ? "66%" : "70%",
            width: wide ? 150 : 176,
            height: wide ? 102 : 118,
            background: "#EDE5D6",
            transform: "rotate(7deg) skewX(-7deg)",
            boxShadow: "0 20px 34px rgba(0,0,0,0.55)",
          }}
        >
          <div style={{ position: "absolute", left: 14, top: 16, right: 40, height: 1, background: "rgba(0,0,0,0.16)" }} />
          <div style={{ position: "absolute", left: 14, top: 30, right: 56, height: 1, background: "rgba(0,0,0,0.12)" }} />
          <div style={{ position: "absolute", left: 14, top: 44, right: 30, height: 1, background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "72%" : "78%",
            top: wide ? "74%" : "76%",
            width: 54,
            height: 62,
            borderRadius: "3px 3px 9px 9px",
            background: "linear-gradient(180deg, #E9DEC9, #C7B59A)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "60%" : "58%",
            top: wide ? "78%" : "80%",
            width: 90,
            height: 10,
            background: "rgba(255,255,255,0.08)",
            transform: "rotate(-12deg)",
            filter: "blur(3px)",
          }}
        />

        {/* founders, foreground shoulders */}
        <div style={{ position: "absolute", left: wide ? "2%" : "-42%", bottom: wide ? -330 : -420, filter: "blur(5px)", opacity: 0.98 }}>
          <Silhouette pose="seated" x={wide ? 260 : 250} y={wide ? 1440 : 2300} height={wide ? 760 : 1020} color="#040403" />
        </div>
        <div style={{ position: "absolute", left: wide ? "20%" : "-18%", bottom: wide ? -360 : -450, filter: "blur(6px)", opacity: 0.95 }}>
          <Silhouette pose="seated" x={wide ? 520 : 460} y={wide ? 1470 : 2330} height={wide ? 740 : 1000} color="#050403" flip />
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            top: wide ? "18%" : "10%",
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <Kicker text="Y COMBINATOR · WINTER 2009" start={0.35} color="rgba(243,238,229,0.55)" ruleColor={palette.accent} />
          <div style={{ marginTop: wide ? 16 : 22, width: wide ? 480 : 520 }}>
            <MaskedLines
              lines={[COPY.breakthroughAccepted]}
              start={0.6}
              durationSeconds={0.8}
              style={{ fontSize: wide ? 54 : 64, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.02 }}
            />
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: wide ? 13 : 14,
              lineHeight: 1.65,
              color: "rgba(243,238,229,0.55)",
              maxWidth: 400,
              opacity: clamp((t - 1.4) / 0.8),
            }}
          >
            Three months of pressure, a cereal box on the table, and one question:
            why is nobody booking?
          </div>
        </div>
      </div>

      {/* ---------- New York ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(t, [3.4, 3.9, 6.2, 6.6], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <PhotoPlate src="images/airbnb/nyc-building.jpg" from={3.4} to={6.6} objectPosition="50% 36%" grade="cool" scaleFrom={1.05} scaleTo={1.16} scrim="both" />
        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            top: wide ? "24%" : "15%",
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <Kicker text="THE HOSTS" start={3.6} color="rgba(243,238,229,0.6)" ruleColor={palette.accent} />
          <div
            style={{
              marginTop: 12,
              fontSize: wide ? 92 : 116,
              fontWeight: 800,
              letterSpacing: "-0.045em",
              lineHeight: 0.92,
              opacity: progress(frame, 3.7 * fps, 0.9 * fps),
              textShadow: "0 10px 40px rgba(0,0,0,0.6)",
            }}
          >
            NEW YORK
          </div>
          <div style={{ marginTop: 14, width: wide ? 460 : 560 }}>
            <MaskedLines
              lines={[COPY.breakthroughCustomer]}
              start={4.35}
              durationSeconds={0.8}
              style={{ fontSize: wide ? 30 : 34, fontWeight: 600, letterSpacing: "0.04em", lineHeight: 1.25 }}
            />
          </div>
        </div>
      </div>

      {/* ---------- host meeting: keys on a table ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(t, [6.4, 6.9, 7.35, 7.75], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          backgroundColor: "#0B0907",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 54% 44%, rgba(92,64,40,0.7) 0%, rgba(22,16,12,0.95) 52%, #080605 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "52%",
            background: "linear-gradient(180deg, #3A2818 0%, #1A110B 46%, #080605 100%)",
            boxShadow: "inset 0 26px 60px rgba(0,0,0,0.55)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            bottom: "48%",
            height: 2,
            background: "linear-gradient(90deg, transparent, rgba(255,214,170,0.35), transparent)",
          }}
        />
        <KeysOnTable x={wide ? 1030 : 470} y={wide ? 760 : 1310} scale={wide ? 0.9 : 1.05} rotate={-9} light={1.1} />
        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            top: wide ? "16%" : "12%",
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <Kicker text="MEETING HOSTS IN PERSON" start={6.5} color="rgba(243,238,229,0.6)" ruleColor={palette.accent} />
          <div
            style={{
              marginTop: 12,
              fontSize: wide ? 30 : 34,
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "rgba(243,238,229,0.9)",
            }}
          >
            Keys. Coffee. A real apartment.
          </div>
        </div>
        <LightPool x={wide ? 54 : 46} y={wide ? 44 : 46} size={900} color="rgba(255,190,130,0.28)" intensity={0.5} />
      </div>

      {/* ---------- camera / photography ---------- */}
      <div style={{ position: "absolute", inset: 0, opacity: cameraIn }}>
        <PhotoPlate src="images/airbnb/camera-tripod.jpg" from={7.35} to={9.3} objectPosition="54% 46%" grade="warm" scaleFrom={1.02} scaleTo={1.08} scrim="bottom" />
        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            bottom: wide ? "24%" : "26%",
            fontFamily: FONT_STACK,
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "rgba(243,238,229,0.6)",
          }}
        >
          PROFESSIONAL PHOTOGRAPHY · FIRST TIME
        </div>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "#FFFFFF", opacity: flash }} />
      </div>

      {/* ---------- before / after ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(t, [8.9, 9.35, 11.4, 11.8], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <BeforeAfter start={9.0} />
        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : 78,
            bottom: wide ? "18%" : "12%",
            width: wide ? 560 : 760,
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <MaskedLines
            lines={[COPY.breakthroughExperience]}
            start={9.2}
            durationSeconds={0.8}
            accentWords={["EXPERIENCE."]}
            accentColor={palette.accent}
            style={{
              fontSize: wide ? 36 : 42,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
              textShadow: "0 8px 30px rgba(0,0,0,0.7)",
            }}
          />
        </div>
      </div>

      {/* ---------- listings growth ---------- */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: interpolate(t, [11.5, 12.0], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          backgroundColor: "#111010",
        }}
      >
        <AbsoluteFill
          style={{
            background: "radial-gradient(ellipse at 62% 40%, rgba(58,46,36,0.6), rgba(16,15,14,0.97) 62%, #080807 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: wide ? "6%" : "4%",
            top: wide ? "20%" : "30%",
            width: wide ? 900 : 760,
            opacity: listingsIn,
          }}
        >
          <ListingGrid start={11.55} columns={wide ? 3 : 2} imageHeight={wide ? 104 : 132} />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "6%" : 78,
            top: wide ? "22%" : "11%",
            maxWidth: wide ? 480 : 620,
            fontFamily: FONT_STACK,
            color: palette.textPrimary,
          }}
        >
          <Kicker text="THE MARKETPLACE" start={11.6} color="rgba(243,238,229,0.55)" ruleColor={palette.accent} />
          <div
            style={{
              marginTop: 16,
              fontSize: wide ? 40 : 48,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.06,
            }}
          >
            MORE LISTINGS.
            <br />
            BETTER LISTINGS.
          </div>
          <div
            style={{
              marginTop: 16,
              fontSize: wide ? 12 : 13,
              lineHeight: 1.65,
              letterSpacing: "0.02em",
              color: "rgba(243,238,229,0.55)",
              maxWidth: 400,
            }}
          >
            Nice photographs, honest descriptions, real hosts. The product finally
            looked like somewhere you would actually stay.
          </div>
        </div>
      </div>

      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
