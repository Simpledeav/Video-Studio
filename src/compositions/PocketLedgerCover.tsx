import { AbsoluteFill } from "remotion";
import { C, FONT, IMG, MONO } from "../config/pocketLedger";
import {
  Grain,
  LedgerIcon,
  Notebook,
  Photo,
  Vignette,
} from "../components/pocketledger/kit";
import { PocketLedgerPhone } from "../components/pocketledger/PocketLedgerUI";

export const PocketLedgerCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(118deg, #202319 0%, #12140F 38%, #0A0C08 68%, #181B12 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -160,
          top: -220,
          width: 1100,
          height: 1500,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(122,203,154,0.22), transparent 58%)",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: -240,
          bottom: -280,
          width: 1000,
          height: 1100,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(217,164,94,0.16), transparent 62%)",
          filter: "blur(26px)",
        }}
      />

      {/* Owner side. */}
      <AbsoluteFill style={{ width: "58%", overflow: "hidden" }}>
        <Photo
          src={IMG.owner}
          start={-10}
          duration={1}
          scaleFrom={1.16}
          scaleTo={1.16}
          objectPosition="50% 26%"
          grade="warm"
          style={{ position: "absolute", inset: 0 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(12,14,11,0.2) 0%, rgba(12,14,11,0.46) 46%, rgba(12,14,11,0.96) 100%), linear-gradient(180deg, rgba(12,14,11,0.66) 0%, transparent 28%, transparent 56%, rgba(12,14,11,0.92) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Notebook on the near edge. */}
      <div
        style={{
          position: "absolute",
          left: 34,
          bottom: -54,
          width: 640,
          opacity: 0.96,
          transform: "rotate(-4deg)",
          filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.55))",
        }}
      >
        <Notebook width={640} height={460} closeProgress={0.18} />
      </div>

      {/* Headline. */}
      <div style={{ position: "absolute", left: 92, top: 64, zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <LedgerIcon size={38} />
          <span style={{ fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: "0.02em", color: C.white }}>
            POCKET<span style={{ color: C.greenBright }}>LEDGER</span>
          </span>
        </div>
      </div>

      <div style={{ position: "absolute", left: 94, top: 342, width: 980, zIndex: 10 }}>
        <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: "0.18em", color: C.greenBright }}>
          YOU DON&apos;T NEED A BILLION-DOLLAR IDEA
        </div>
        <div style={{ height: 18 }} />
        <div
          style={{
            fontFamily: FONT,
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 0.88,
            letterSpacing: "-0.06em",
            color: C.white,
            textTransform: "uppercase",
            textShadow: "0 8px 40px rgba(0,0,0,0.55)",
          }}
        >
          THE SMALL IDEA
          <br />
          THAT COULD
          <br />
          <span style={{ color: C.greenBright }}>CHANGE EVERYTHING</span>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 96,
          top: 132,
          display: "flex",
          alignItems: "center",
          gap: 14,
          zIndex: 11,
        }}
      >
        <span style={{ width: 44, height: 2, background: C.greenBright }} />
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.16em", color: C.muted }}>
          A 90-SECOND PRODUCT CASE STUDY
        </span>
      </div>

      {/* Product side. */}
      <div
        style={{
          position: "absolute",
          right: 132,
          top: 104,
          zIndex: 12,
          filter: "drop-shadow(0 40px 70px rgba(0,0,0,0.55))",
        }}
      >
        <PocketLedgerPhone width={398} screen="home" screenStart={-10} />
      </div>

      <div
        style={{
          position: "absolute",
          right: 118,
          top: 64,
          zIndex: 13,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.greenBright }} />
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.muted }}>
          CONCEPT PRODUCT · ILLUSTRATIVE UI
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 150,
          bottom: 66,
          zIndex: 13,
          textAlign: "right",
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.dim }}>
          FOR SMALL SHOPS
        </div>
        <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 18, fontWeight: 600, color: C.cream }}>
          Sales. Expenses. What is left.
        </div>
      </div>

      <Grain opacity={0.065} />
      <Vignette strength={1} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${C.greenBright}, transparent)`,
          opacity: 0.5,
        }}
      />
    </AbsoluteFill>
  );
};
