import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { COPY, FONT_STACK, useStage } from "../../../config/airbnb";
import { getPalette } from "../../../config/theme";
import { CerealBox } from "../CerealBox";
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

const FLAKES = Array.from({ length: 54 }).map((_, i) => {
  const seed = (i * 9301 + 49297) % 233280;
  const r = seed / 233280;
  const r2 = ((i * 7919 + 104729) % 233280) / 233280;
  return {
    left: 22 + r * 56,
    delay: r2 * 1.2,
    speed: 0.8 + r2 * 0.7,
    size: 13 + r * 14,
    spin: (r - 0.5) * 220,
    drift: (r2 - 0.5) * 90,
  };
});

/**
 * ACT 4 — The cereal idea (27.6 - 40.5s)
 *
 * The film's tonal turn: cream paper, warm table light, snappy assembly. Two
 * original interpretive box designs (no campaign artwork), a pour, a fold, and
 * a price. Fast, tactile, satisfying — never comic.
 */
export const SceneCereal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  const { wide } = useStage();
  const palette = getPalette("CORAL_DOCUMENTARY");

  const flash = interpolate(t, [0, 0.1, 0.42, 0.85], [0, 1, 0.82, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pairIn = easeOut(clamp((t - 0.9) / 1.2));
  const pourIn = interpolate(t, [4.9, 5.3, 7.3, 7.7], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const tableIn = easeOut(clamp((t - 10.0) / 1.1));
  const priceIn = progress(frame, 10.6 * fps, 0.7 * fps);

  return (
    <AbsoluteFill style={{ backgroundColor: "#EDE5D7", overflow: "hidden" }}>
      {/* warm paper room */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, #FBF6EC 0%, #EFE6D6 42%, #D8CBB8 78%, #B7A791 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.42,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(80,60,40,0.055) 0px, rgba(80,60,40,0.055) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(80,60,40,0.04) 0px, rgba(80,60,40,0.04) 1px, transparent 1px, transparent 5px)",
          mixBlendMode: "multiply",
        }}
      />
      <LightPool x={50} y={22} size={1200} color="rgba(255,214,160,0.55)" intensity={0.5} blur={120} />

      {/* the two boxes */}
      <div
        style={{
          position: "absolute",
          left: wide ? "60%" : "50%",
          top: wide ? "54%" : "46%",
          transform: `translate(-50%, -50%) translateY(${(1 - pairIn) * 40}px)`,
          opacity: pairIn * (1 - clamp((t - 4.8) / 0.5)),
          width: wide ? 980 : 880,
          display: "flex",
          justifyContent: "center",
          gap: wide ? 90 : 54,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
          <CerealBox
            variant="obama"
            width={wide ? 360 : 316}
            height={wide ? 558 : 490}
            depth={wide ? 100 : 88}
            rotateY={-14}
            rotateX={8}
            rotateZ={-2}
            glow={0.9}
          />
          <div style={{ textAlign: "center", fontFamily: FONT_STACK, color: "#2A241C" }}>
            <div style={{ fontSize: wide ? 20 : 24, fontWeight: 700, letterSpacing: "0.02em" }}>{COPY.cerealObama}</div>
            <div style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.24em", color: "rgba(42,36,28,0.55)" }}>
              OAT &amp; HONEY · 12 OZ
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18, marginTop: 34 }}>
          <CerealBox
            variant="mccain"
            width={wide ? 360 : 316}
            height={wide ? 558 : 490}
            depth={wide ? 100 : 88}
            rotateY={12}
            rotateX={8}
            rotateZ={1.6}
            glow={0.5}
          />
          <div style={{ textAlign: "center", fontFamily: FONT_STACK, color: "#2A241C" }}>
            <div style={{ fontSize: wide ? 20 : 24, fontWeight: 700, letterSpacing: "0.02em" }}>{COPY.cerealMccain}</div>
            <div style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.24em", color: "rgba(42,36,28,0.55)" }}>
              CINNAMON STARS · 12 OZ
            </div>
          </div>
        </div>
      </div>

      {/* cereal pour */}
      <div style={{ position: "absolute", inset: 0, opacity: pourIn }}>
        <PhotoPlate
          src="images/airbnb/cereal-bowl.jpg"
          from={4.9}
          to={7.8}
          objectPosition="50% 62%"
          grade="warm"
          scaleFrom={1.16}
          scaleTo={1.05}
          scrim="bottom"
        />
        <div
          style={{
            position: "absolute",
            left: "12%",
            right: "12%",
            top: "2%",
            height: "74%",
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {FLAKES.map((flake, i) => {
            const local = (t - 5.0 - flake.delay) * flake.speed;
            if (local < 0) return null;
            const y = -10 + local * 118;
            if (y > 108) return null;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${flake.left}%`,
                  top: `${y}%`,
                  width: flake.size * 1.35,
                  height: flake.size * 0.8,
                  borderRadius: 2,
                  background: "linear-gradient(140deg, #F4C97A, #C98E3F)",
                  transform: `translateX(${Math.sin(local * 6 + i) * 10 + flake.drift * 0.2}px) rotate(${local * flake.spin}deg)`,
                  opacity: 0.95,
                  boxShadow: "0 3px 8px rgba(90,50,20,0.35)",
                  filter: "blur(0.4px)",
                }}
              />
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "34%",
          background: "linear-gradient(180deg, rgba(70,52,36,0.22) 0%, rgba(120,92,64,0.34) 100%)",
          opacity: interpolate(t, [7.4, 7.8, 8.5, 8.9], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      />

      {/* flat dieline, then the assembled box */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: wide ? "46%" : "43%",
          transform: "translate(-50%, -50%)",
          opacity: interpolate(t, [7.55, 7.85, 8.35, 8.7], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
          width: wide ? 640 : 720,
          height: wide ? 440 : 500,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: wide ? 520 : 600,
            height: wide ? 380 : 430,
            transform: "translate(-50%, -50%)",
            background: "linear-gradient(160deg, #F7F0E3, #E7DCC9)",
            border: "1px solid rgba(40,32,24,0.35)",
            boxShadow: "0 26px 60px rgba(90,60,30,0.28), inset 0 0 40px rgba(120,90,60,0.12)",
          }}
        >
          <div style={{ position: "absolute", left: "8%", right: "8%", top: "7%", bottom: "7%", border: "1px dashed rgba(40,32,24,0.35)" }} />
          <div style={{ position: "absolute", left: "50%", top: "7%", bottom: "7%", width: 1, background: "rgba(40,32,24,0.25)" }} />
          <div style={{ position: "absolute", left: "8%", right: "8%", top: "50%", height: 1, background: "rgba(40,32,24,0.25)" }} />
          <div style={{ position: "absolute", left: 26, top: 24, fontFamily: FONT_STACK, fontSize: 9, letterSpacing: "0.24em", color: "rgba(40,32,24,0.5)" }}>
            DIELINE · 12 OZ
          </div>
          <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%) rotate(-2deg)", fontFamily: FONT_STACK, fontSize: wide ? 34 : 40, fontWeight: 800, letterSpacing: "-0.02em", color: "#C0392B", opacity: 0.8 }}>
            OBAMA O&#39;S
          </div>
          <div style={{ position: "absolute", left: 26, bottom: 20, fontFamily: FONT_STACK, fontSize: 8, letterSpacing: "0.22em", color: "rgba(40,32,24,0.4)" }}>
            11.5 × 7.5 × 3 IN
          </div>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: -34,
              textAlign: "center",
              fontFamily: FONT_STACK,
              fontSize: 10,
              letterSpacing: "0.3em",
              color: "rgba(40,32,24,0.55)",
            }}
          >
            FLAT-PACKED · FOLDED BY HAND
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: wide ? "48%" : "46%",
          transform: "translate(-50%, -50%)",
          opacity: interpolate(t, [8.4, 8.9, 9.9, 10.3], [0, 1, 1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <CerealBox
          variant="obama"
          width={wide ? 300 : 360}
          height={wide ? 465 : 558}
          depth={wide ? 86 : 102}
          rotateY={-24}
          rotateX={9}
          glow={0.6}
        />
        <div
          style={{
            position: "absolute",
            left: -220,
            top: 420,
            width: 440,
            textAlign: "center",
            fontFamily: FONT_STACK,
            fontSize: 10,
            letterSpacing: "0.28em",
            color: "rgba(42,36,28,0.5)",
          }}
        >
          FOLD · FILL · SEAL · BY HAND
        </div>
      </div>

      {/* stacked boxes + price */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: wide ? "46%" : "44%",
          transform: `translate(-50%, -50%) translateY(${(1 - tableIn) * 30}px)`,
          opacity: tableIn * (1 - clamp((t - 12.4) / 0.5)),
          display: "grid",
          gridTemplateColumns: "repeat(3, auto)",
          gap: wide ? 26 : 30,
          alignItems: "end",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              opacity: clamp(tableIn * 1.4 - i * 0.08),
              transform: `translateY(${(1 - clamp(tableIn * 1.3 - i * 0.1)) * 26}px) rotate(${(i % 2 === 0 ? -1 : 1) * (1 + i * 0.4)}deg)`,
            }}
          >
            <CerealBox
              variant={i % 2 === 0 ? "obama" : "mccain"}
              width={wide ? 150 : 180}
              height={wide ? 232 : 279}
              depth={wide ? 44 : 52}
              rotateY={i % 2 === 0 ? -18 : 16}
              rotateX={8}
              glow={0}
              shadow
            />
          </div>
        ))}
      </div>

      {/* price tag */}
      <div
        style={{
          position: "absolute",
          left: wide ? "20%" : "9%",
          top: wide ? "64%" : "56%",
          opacity: priceIn,
          transform: `rotate(-7deg) scale(${0.9 + priceIn * 0.1})`,
        }}
      >
        <div
          style={{
            background: palette.accent,
            color: "#FFF7EE",
            fontFamily: FONT_STACK,
            padding: "10px 18px",
            boxShadow: "0 16px 40px rgba(90,30,20,0.35)",
            transform: "translateZ(0)",
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: "0.3em", opacity: 0.8 }}>SOLD FOR</div>
          <div style={{ fontSize: wide ? 40 : 48, fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>$40</div>
          <div style={{ fontSize: 9, letterSpacing: "0.3em", opacity: 0.8 }}>PER BOX</div>
        </div>
      </div>

      {/* titles */}
      <div
        style={{
          position: "absolute",
          left: wide ? "6%" : 78,
          top: wide ? "14%" : "8%",
          fontFamily: FONT_STACK,
          color: "#221D16",
        }}
      >
        <div
          style={{
            opacity: 1 - interpolate(t, [4.7, 5.3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
        <Kicker text="THE US ELECTION" start={0.5} color="rgba(34,29,22,0.6)" ruleColor={palette.accent} />
        <div
          style={{
            marginTop: 8,
            fontSize: wide ? 92 : 128,
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 0.9,
            opacity: interpolate(t, [0.4, 1.1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          2008
        </div>
        <div
          style={{
            marginTop: 12,
            maxWidth: wide ? 480 : 600,
            fontSize: wide ? 16 : 18,
            lineHeight: 1.5,
            fontWeight: 500,
            color: "rgba(34,29,22,0.62)",
            opacity: interpolate(t, [1.2, 2.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
          }}
        >
          Two candidates. Two limited-edition cereal boxes. Assembled by hand in a San Francisco apartment.
        </div>
        </div>
      </div>

      <MaskedLines
        lines={[COPY.cerealPrice]}
        start={10.6}
        durationSeconds={0.8}
        accentWords={["$40"]}
        accentColor="#C0392B"
        style={{
          position: "absolute",
          left: wide ? "7%" : 78,
          bottom: wide ? "16%" : "14%",
          fontFamily: FONT_STACK,
          fontSize: wide ? 40 : 46,
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "#221D16",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: wide ? "7%" : 78,
          bottom: wide ? "10%" : "9%",
          fontFamily: FONT_STACK,
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(34,29,22,0.45)",
          opacity: clamp((t - 2.4) / 0.8),
        }}
      >
        {COPY.cerealTag}
      </div>

      {/* 2008 flash into the act */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "#F6EFE2", opacity: flash * 0.9 }} />
      <Vignette strength={0.35} color="40,30,20" />
    </AbsoluteFill>
  );
};
