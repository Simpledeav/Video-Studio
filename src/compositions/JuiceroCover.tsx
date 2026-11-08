import { AbsoluteFill, Img, staticFile } from "remotion";
import { COPY } from "../config/juicero";
import { BRAND } from "../config/brand";
import {
  C,
  FONT,
  Glass,
  Glow,
  Grain,
  Headline,
  JuicePack,
  Kicker,
  Machine,
  MonoLabel,
  Orange,
  ReconstructionLabel,
  Vignette,
} from "../components/juicero/kit";

const AVATAR = staticFile("brand/simpledeav-avatar.png");

export const JuiceroCover: React.FC = () => {
  return (
    <AbsoluteFill style={{ width: 1080, height: 1350, backgroundColor: C.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 74% 34%, rgba(255,106,20,0.26) 0%, rgba(86,32,0,0.12) 36%, rgba(5,4,3,0.98) 72%), linear-gradient(168deg, #1A0E06 0%, #080604 56%, #040302 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          top: 940,
          height: 410,
          background:
            "linear-gradient(180deg, rgba(255,132,48,0.18) 0%, rgba(21,12,6,0.82) 20%, rgba(4,3,2,0.98) 100%)",
          borderTop: "1px solid rgba(255,160,90,0.2)",
          transform: "perspective(900px) rotateX(58deg)",
          transformOrigin: "top center",
        }}
      />
      <Glow x="74%" y="42%" color={C.orange} opacity={0.2} />
      <Glow x="16%" y="80%" color={C.lime} opacity={0.06} />

      <div style={{ position: "absolute", left: 72, right: 72, top: 84 }}>
        <Kicker color={C.orange}>{COPY.cover.kicker}</Kicker>
        <Headline size={112} style={{ marginTop: 22 }}>
          {COPY.cover.line1}
          <br />
          <span style={{ color: C.orange }}>{COPY.cover.line2}</span>
          <br />
          {COPY.cover.line3}
        </Headline>
        <div
          style={{
            marginTop: 24,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ width: 54, height: 2, background: C.orange }} />
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: 24,
              letterSpacing: "0.16em",
              color: C.creamSoft,
              textTransform: "uppercase",
            }}
          >
            {COPY.cover.sub}
          </div>
        </div>
      </div>

      {/* Product composition */}
      <div style={{ position: "absolute", left: 610, bottom: 96, transform: "scale(1.08)", transformOrigin: "bottom center" }}>
        <Machine
          scale={1}
          screen={
            <div>
              <MonoLabel size={10} color={C.lime}>
                READY
              </MonoLabel>
              <div style={{ fontFamily: FONT, fontWeight: 700, fontSize: 17, color: C.white, marginTop: 4 }}>
                COLD PRESS
              </div>
            </div>
          }
        />
      </div>
      <div style={{ position: "absolute", left: 548, bottom: 150 }}>
        <Orange size={118} />
      </div>
      <div style={{ position: "absolute", left: 430, bottom: 150 }}>
        <JuicePack scale={0.56} rotate={-8} />
      </div>
      <div style={{ position: "absolute", left: 812, bottom: 120 }}>
        <Glass size={0.92} fill={0.78} />
      </div>

      {/* Price sticker */}
      <div
        style={{
          position: "absolute",
          left: 74,
          bottom: 258,
          transform: "rotate(-4deg)",
          padding: "12px 18px",
          border: `2px solid ${C.orange}`,
          background: "rgba(10,7,4,0.78)",
          display: "flex",
          alignItems: "baseline",
          gap: 8,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 62,
            letterSpacing: "-0.05em",
            color: C.white,
          }}
        >
          {COPY.cover.price}
        </span>
        <span
          style={{
            fontFamily: FONT,
            fontWeight: 800,
            fontSize: 26,
            color: C.orange,
          }}
        >
          FOR THIS?!
        </span>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 34,
          display: "flex",
          alignItems: "center",
          gap: 12,
          paddingTop: 18,
          borderTop: "1px solid rgba(247,243,234,0.14)",
        }}
      >
        <Img
          src={AVATAR}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid rgba(255,106,20,0.45)",
          }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: 17,
              letterSpacing: "0.26em",
              color: C.white,
            }}
          >
            {BRAND.monogram.wordmark}
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontSize: 11,
              letterSpacing: "0.22em",
              color: C.muted,
            }}
          >
            {COPY.cover.footer}
          </span>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <MonoLabel size={10} color={C.dim} style={{ textAlign: "right" }}>
            OCTOBER 2026
            <br />
            BUSINESS CASE STUDY
          </MonoLabel>
        </div>
      </div>

      <ReconstructionLabel
        text={COPY.cover.note}
        style={{ position: "absolute", left: 72, bottom: 116 }}
      />

      <Grain opacity={0.07} />
      <Vignette strength={1.1} warm />
    </AbsoluteFill>
  );
};
