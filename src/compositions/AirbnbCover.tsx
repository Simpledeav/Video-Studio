import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { COPY, FONT_STACK } from "../config/airbnb";
import { CerealBox } from "../components/airbnb/CerealBox";

/**
 * Social cover (4:5) for the Airbnb case study.
 *
 * One oversized box, a warm spotlight, charcoal texture and a single coral
 * accent — designed as a still cover, not a video frame.
 */
export const AirbnbCover: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 1.4;

  return (
    <AbsoluteFill style={{ backgroundColor: "#141210", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 62% 34%, rgba(92,62,42,0.72) 0%, rgba(26,20,16,0.96) 46%, #0B0908 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.35,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 5px), repeating-linear-gradient(90deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 6px)",
          mixBlendMode: "overlay",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "18%",
          top: "30%",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,196,140,0.34) 0%, transparent 62%)",
          filter: "blur(80px)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: "38%",
          background: "linear-gradient(180deg, rgba(40,26,18,0.5) 0%, rgba(10,8,7,0.96) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: 76,
          top: 84,
          width: 620,
          fontFamily: FONT_STACK,
          color: "#F3EEE5",
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.4em", color: "rgba(243,238,229,0.5)" }}>
          SIMPLEDEAV · CASE STUDY 03
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 70,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 0.98,
            textTransform: "uppercase",
          }}
        >
          THE STARTUP
          <br />
          THAT <span style={{ color: "#FF5A5F" }}>SOLD</span>
          <br />
          CEREAL
          <br />
          TO SURVIVE.
        </div>
        <div style={{ marginTop: 26, width: 64, height: 2, background: "#FF5A5F" }} />
        <div
          style={{
            marginTop: 22,
            fontSize: 19,
            fontWeight: 500,
            letterSpacing: "0.16em",
            color: "rgba(243,238,229,0.62)",
            lineHeight: 1.5,
          }}
        >
          HOW AIRBNB FOUND A WAY
          <br />
          TO KEEP GOING.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: -64,
          top: 414 + drift,
          transform: "rotate(-3deg)",
        }}
      >
        <CerealBox variant="obama" width={540} height={835} depth={150} rotateY={-18} rotateX={8} glow={1} />
      </div>

      <div
        style={{
          position: "absolute",
          left: 76,
          bottom: 74,
          display: "flex",
          alignItems: "center",
          gap: 16,
          fontFamily: FONT_STACK,
        }}
      >
        <Img
          src={staticFile("brand/simpledeav-avatar.png")}
          style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid rgba(255,90,95,0.5)" }}
        />
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.22em", color: "rgba(243,238,229,0.75)" }}>
          {COPY.brand}
        </span>
        <span style={{ width: 26, height: 1, background: "rgba(255,90,95,0.6)" }} />
        <span style={{ fontSize: 12, fontWeight: 500, letterSpacing: "0.22em", color: "rgba(243,238,229,0.4)" }}>
          @SIMPLEDEAV
        </span>
      </div>

      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background: "radial-gradient(ellipse at 50% 44%, transparent 40%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
