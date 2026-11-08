import { AbsoluteFill } from "remotion";
import { C, FONT, IMG } from "../../../config/walmartChicken";
import {
  Display,
  Grain,
  MaskLine,
  Photo,
  Pill,
  Spark,
  easeIn,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../../presets/editorialPop/kit";

export const Scene01Hook: React.FC = () => {
  const { t } = useTime();

  const handIn = progress(t, 1.85, 0.85, easeOut);
  const push = progress(t, 2.35, 1.9, easeInOut);
  const textOut = progress(t, 4.15, 0.45, easeIn);
  const wipe = progress(t, 4.35, 0.62, easeInOut);
  const flicker = 0.78 + Math.sin(t * 58) * 0.22;

  return (
    <AbsoluteFill style={{ backgroundColor: C.blueInk, overflow: "hidden" }}>
      {/* Hot chicken close-up */}
      <AbsoluteFill style={{ opacity: 1 - wipe }}>
        <Photo
          src={IMG.chicken}
          start={0}
          duration={4.4}
          scaleFrom={1.26}
          scaleTo={1.02}
          grade="vivid"
          objectPosition="50% 48%"
          overlay="linear-gradient(180deg, rgba(4,30,66,0.44) 0%, rgba(4,30,66,0.06) 38%, rgba(4,30,66,0.82) 100%)"
        />
      </AbsoluteFill>

      {/* Heat glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 52% 44%, rgba(255,138,45,${0.22 + Math.sin(t * 4) * 0.05}) 0%, transparent 46%)`,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* The official product shot, swinging in like the bag is grabbed */}
      <div
        style={{
          position: "absolute",
          width: 820,
          height: 470,
          left: 130 + (1 - handIn) * 720 - push * 42,
          top: 1010 + (1 - handIn) * 180 - push * 34,
          transform: `rotate(${16 - handIn * 10 + push * 2}deg) scale(${0.72 + handIn * 0.3 + push * 0.5})`,
          opacity: handIn,
          filter: `drop-shadow(0 46px 60px rgba(0,0,0,0.48)) blur(${(1 - handIn) * 10}px)`,
          zIndex: 12,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 26,
            overflow: "hidden",
            border: "8px solid rgba(255,248,236,0.92)",
            boxShadow: "0 26px 80px rgba(0,0,0,0.42)",
          }}
        >
          <Photo
            src={IMG.purseTraditional}
            start={0}
            duration={3}
            grade="vivid"
            scaleFrom={1.1}
            scaleTo={1.02}
            objectPosition="50% 42%"
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 26,
            bottom: -28,
            transform: "rotate(-4deg)",
          }}
        >
          <Pill color={C.ink} style={{ background: C.yellow, fontSize: 16, padding: "12px 18px" }}>
            <Spark size={20} /> 5,000 MADE
          </Pill>
        </div>
      </div>

      {/* Giant hook type */}
      <AbsoluteFill
        style={{
          zIndex: 20,
          padding: "128px 54px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          opacity: 1 - textOut,
          transform: `translateY(${-textOut * 90}px)`,
        }}
      >
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 26, opacity: 0.95 }}>
          <Spark size={58} />
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "0.26em",
              color: C.white,
              textShadow: "0 2px 16px rgba(0,0,0,0.55)",
            }}
          >
            WALMART · NATIONAL CHICKEN MONTH
          </div>
        </div>

        <MaskLine start={0.32} duration={0.62}>
          <Display
            size={82}
            color={C.white}
            style={{ textAlign: "center", textShadow: "0 4px 28px rgba(0,0,0,0.55)" }}
          >
            THIS CHICKEN BAG
          </Display>
        </MaskLine>

        <div
          style={{
            marginTop: 8,
            transform: `rotate(-2deg) scale(${1 + Math.sin(t * 47) * 0.008 * flicker})`,
          }}
        >
          <MaskLine start={0.52} duration={0.58}>
            <Display
              size={150}
              color={C.ink}
              style={{
                textAlign: "center",
                background: C.yellow,
                padding: "0.03em 0.12em 0.07em",
                borderRadius: 10,
                boxShadow: "0 22px 60px rgba(0,0,0,0.32)",
              }}
            >
              SOLD OUT?!
            </Display>
          </MaskLine>
        </div>

        <div
          style={{
            marginTop: 22,
            fontFamily: FONT,
            fontSize: 21,
            fontWeight: 600,
            letterSpacing: "0.2em",
            color: C.cream,
            textTransform: "uppercase",
            textAlign: "center",
            opacity: progress(t, 0.9, 0.4),
            textShadow: "0 2px 18px rgba(0,0,0,0.6)",
          }}
        >
          IN 90 MINUTES
        </div>
      </AbsoluteFill>

      {/* Wipe */}
      <AbsoluteFill
        style={{
          zIndex: 75,
          background: `linear-gradient(110deg, ${C.blue} 0%, ${C.blueDeep} 60%, ${C.yellow} 140%)`,
          transform: `translateX(${-112 + wipe * 112}%) skewX(-8deg)`,
          width: "130%",
        }}
      />

      <Grain opacity={0.08} />
    </AbsoluteFill>
  );
};
