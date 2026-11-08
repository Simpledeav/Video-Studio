import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { CityWindow, Silhouette } from "../figures";
import { MarketplaceUI } from "../interface";
import { Kicker, LightPool, MaskedLines, Vignette, clamp, easeInOut, progress } from "../primitives";

/**
 * ACT 3 — The struggle (18.7 - 27.6s)
 *
 * Over-the-shoulder at a laptop that will not ring, then a slow pullback to two
 * founders in a very small room. Cold, quiet, no melodrama: the empty calendar
 * and the rent notice do the work.
 */
export const SceneStruggle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const pull = easeInOut(clamp((t - 5.9) / 2.6));
  const deskScale = 1.2 - pull * 0.2;
  const noticeIn = progress(frame, 4.4 * fps, 0.8 * fps);
  const lamp = interpolate(t, [0, 1.2], [0.55, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#08090C", overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${deskScale})`,
          transformOrigin: "54% 54%",
        }}
      >
        {/* room */}
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 62% 34%, rgba(48,62,80,0.75) 0%, rgba(18,21,26,0.96) 46%, #07080A 100%)",
          }}
        />
        <CityWindow x={wide ? "58%" : "48%"} y={wide ? "10%" : "9%"} width={wide ? 520 : 400} height={wide ? 320 : 330} dim={1.05} />

        {/* desk lamp beam */}
        <div
          style={{
            position: "absolute",
            left: "6%",
            top: "18%",
            width: "58%",
            height: "52%",
            background:
              "linear-gradient(168deg, rgba(255,206,152,0.2) 0%, rgba(255,196,140,0.06) 42%, transparent 72%)",
            filter: "blur(26px)",
            opacity: lamp,
          }}
        />

        {/* desk */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "40%",
            background: "linear-gradient(180deg, #241A13 0%, #150F0C 58%, #080606 100%)",
            boxShadow: "inset 0 26px 60px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 34% 0%, rgba(255,206,150,0.3) 0%, transparent 58%)",
              mixBlendMode: "screen",
              opacity: lamp,
            }}
          />
        </div>


        {/* laptop */}
        <div
          style={{
            position: "absolute",
            left: wide ? "34%" : "9%",
            top: wide ? "32%" : "33%",
            width: wide ? 700 : 520,
            height: wide ? 510 : 380,
            transform: "perspective(1600px) rotateX(6deg) rotateZ(-1.8deg)",
            transformOrigin: "50% 85%",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 8,
              background: "linear-gradient(160deg, #2A2D33, #101216 58%, #08090B)",
              padding: 9,
              boxShadow:
                "0 44px 100px rgba(0,0,0,0.82), 0 0 0 1px rgba(255,255,255,0.07), 0 0 130px rgba(96,146,196,0.2)",
            }}
          >
            <div style={{ width: "100%", height: "100%", borderRadius: 3, overflow: "hidden", background: "#0A0E14" }}>
              <MarketplaceUI start={0.3} compact />
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              left: "-5%",
              right: "-5%",
              bottom: -16,
              height: 24,
              borderRadius: 5,
              background: "linear-gradient(180deg, #1E2026, #0B0C0E)",
              boxShadow: "0 16px 36px rgba(0,0,0,0.7)",
            }}
          />
        </div>

        {/* mug */}
        <div
          style={{
            position: "absolute",
            left: wide ? "58%" : "64%",
            top: wide ? "54%" : "58%",
            width: 52,
            height: 62,
            borderRadius: "3px 3px 12px 12px",
            background: "linear-gradient(180deg, #3A322A, #1B1713)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 14px 26px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -14,
              top: 14,
              width: 18,
              height: 24,
              borderRadius: "0 8px 8px 0",
              border: "5px solid #241E19",
              borderLeft: "none",
            }}
          />
        </div>

        {/* rent notice */}
        <div
          style={{
            position: "absolute",
            left: wide ? "72%" : "54%",
            top: wide ? "50%" : "44%",
            width: wide ? 340 : 310,
            transform: `rotate(-4deg) translateY(${(1 - noticeIn) * 26}px)`,
            opacity: noticeIn,
          }}
        >
          <div
            style={{
              background: "#EDE5D6",
              padding: "22px 24px 26px",
              boxShadow: "0 34px 70px rgba(0,0,0,0.65)",
              fontFamily: FONT_STACK,
              color: "#1B1916",
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: "0.28em", color: "#8A8378" }}>PAST DUE</div>
            <div style={{ marginTop: 8, fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>RENT · $1,150</div>
            <div style={{ marginTop: 4, fontSize: 13, color: "#6C665C" }}>Due in 3 days</div>
            <div style={{ marginTop: 16, height: 1, background: "rgba(0,0,0,0.16)" }} />
            <div
              style={{
                marginTop: 12,
                display: "flex",
                justifyContent: "space-between",
                fontSize: 11,
                letterSpacing: "0.14em",
              }}
            >
              <span>BALANCE</span>
              <span style={{ color: "#C0392B", fontWeight: 700 }}>— $0.00</span>
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: -22,
              top: 40,
              width: 170,
              height: 7,
              background: "#2A2620",
              opacity: 0.5,
              transform: "rotate(6deg)",
            }}
          />
        </div>

        {/* papers */}
        <div
          style={{
            position: "absolute",
            left: wide ? "8%" : "-2%",
            bottom: wide ? "12%" : "16%",
            width: 190,
            height: 120,
            background: "rgba(232,224,210,0.1)",
            border: "1px solid rgba(232,224,210,0.16)",
            transform: "rotate(6deg)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "14%" : "5%",
            bottom: wide ? "15%" : "19%",
            width: 160,
            height: 104,
            background: "rgba(232,224,210,0.08)",
            border: "1px solid rgba(232,224,210,0.13)",
            transform: "rotate(-5deg)",
          }}
        />

        {/* foreground shoulder */}
        <div
          style={{
            position: "absolute",
            right: wide ? "-4%" : "-16%",
            bottom: wide ? "-16%" : "-18%",
            opacity: 0.98,
            filter: "blur(3.4px)",
          }}
        >
          <Silhouette
            pose="seated"
            x={wide ? 1720 : 1080}
            y={wide ? 1240 : 2080}
            height={wide ? 700 : 980}
            color="#040404"
            rim="#8FB0CE"
            rimOpacity={0.18}
          />
        </div>

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: "46%",
            background: "linear-gradient(0deg, rgba(4,5,7,0.94), rgba(4,5,7,0.35) 55%, transparent)",
          }}
        />
      </div>

      {/* failure list */}
      <div
        style={{
          position: "absolute",
          left: wide ? "6%" : 78,
          top: wide ? "20%" : "9%",
          width: wide ? 560 : 700,
          fontFamily: FONT_STACK,
          color: palette.textPrimary,
        }}
      >
        <Kicker text="THE FIRST YEAR" start={1.0} color="rgba(243,238,229,0.5)" ruleColor="rgba(243,238,229,0.3)" />
        <div style={{ marginTop: wide ? 14 : 20, display: "flex", flexDirection: "column", gap: wide ? 12 : 16 }}>
          {COPY.struggle.map((line, index) => {
            const start = 2.2 + index * 1.25;
            const p = progress(frame, start * fps, 0.7 * fps);
            return (
              <div key={line} style={{ display: "flex", alignItems: "center", gap: 16, opacity: p }}>
                <div
                  style={{
                    width: 30 * p,
                    height: 1,
                    backgroundColor: index === 2 ? palette.accent : "rgba(243,238,229,0.42)",
                  }}
                />
                <div
                  style={{
                    fontSize: wide ? 28 : 36,
                    fontWeight: 600,
                    letterSpacing: "0.01em",
                    color: index === 2 ? "#EFE9DE" : "rgba(243,238,229,0.85)",
                    transform: `translateX(${(1 - p) * 16}px)`,
                    whiteSpace: "nowrap",
                  }}
                >
                  {line}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            marginTop: wide ? 22 : 28,
            display: "flex",
            gap: 34,
            opacity: interpolate(t, [5.2, 6.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          {[
            { k: "BOOKINGS", v: "0" },
            { k: "RUNWAY", v: "6 WKS" },
            { k: "SPARE ROOM", v: "1" },
          ].map((stat) => (
            <div key={stat.k}>
              <div style={{ fontSize: 9, letterSpacing: "0.26em", color: "rgba(243,238,229,0.4)" }}>{stat.k}</div>
              <div style={{ marginTop: 4, fontSize: 24, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>{stat.v}</div>
            </div>
          ))}
        </div>
      </div>

      <MaskedLines
        lines={["THIS IS THE PART", "NOBODY PUTS", "IN THE PITCH DECK."]}
        start={6.7}
        stagger={0.16}
        durationSeconds={0.8}
        style={{
          position: "absolute",
          left: wide ? "7%" : 78,
          bottom: wide ? "14%" : "11%",
          fontFamily: FONT_STACK,
          fontSize: wide ? 22 : 24,
          fontWeight: 500,
          letterSpacing: "0.18em",
          lineHeight: 1.55,
          color: "rgba(243,238,229,0.5)",
        }}
      />

      <LightPool x={wide ? 42 : 34} y={wide ? 50 : 44} size={1000} color="rgba(74,116,156,0.22)" intensity={0.4} />
      <Vignette strength={0.5} />
    </AbsoluteFill>
  );
};
