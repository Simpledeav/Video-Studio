import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO } from "../config/garageflow";
import { useLocalFonts } from "../hooks/useLocalFonts";
import {
  AppFrame,
  Glow,
  Grain,
  GridField,
  Photo,
  Tag,
  Vignette,
} from "../components/garageflow/kit";
import { DashboardScreen } from "../components/garageflow/ui";

/**
 * 16:9 social cover. A still composition, not a paused video frame:
 * the headline owns the left, the product owns the right, and one floating
 * job card supplies a human detail.
 */
export const GarageFlowCover: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Photo src="lift-wide.jpg" position="42% 48%" brightness={0.48} saturation={0.46} drift={false} />
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(90deg, rgba(4,7,12,0.985) 0%, rgba(4,7,12,0.94) 36%, rgba(4,7,12,0.62) 68%, rgba(4,7,12,0.48) 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          background: "linear-gradient(180deg, rgba(4,7,12,0.2) 0%, transparent 28%, rgba(4,7,12,0.6) 100%)",
        }}
      />
      <Glow x="30%" y="44%" size={54} color={C.blue} opacity={0.14} />
      <Glow x="80%" y="56%" size={48} color={C.blueDeep} opacity={0.12} />
      <GridField opacity={0.3} size={96} />

      <div style={{ position: "absolute", left: 108, top: 76, display: "flex", alignItems: "center", gap: 13 }}>
        <span style={{ width: 34, height: 1, background: C.blue }} />
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: "0.22em", color: C.silver }}>
          {COPY.cover.kicker}
        </span>
        <Tag color={C.blueBright} background={C.blueSoft} border="rgba(92,157,255,0.34)" style={{ marginLeft: 4 }}>
          PRODUCT FILM
        </Tag>
      </div>

      <div style={{ position: "absolute", left: 106, top: 142, display: "flex", gap: 10 }}>
        <span style={{ width: 4, height: 244, background: C.blue, flexShrink: 0, marginTop: 4 }} />
        <div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "-0.062em",
              lineHeight: 0.9,
              color: C.white,
              textShadow: "0 18px 70px rgba(0,0,0,0.6)",
            }}
          >
            {COPY.cover.headline1}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 132,
              fontWeight: 700,
              letterSpacing: "-0.062em",
              lineHeight: 0.92,
              color: C.blueBright,
              textShadow: `0 0 70px ${C.blue}44`,
            }}
          >
            {COPY.cover.headline2}
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 120, top: 470 }}>
        <div style={{ fontFamily: MONO, fontSize: 14, fontWeight: 600, letterSpacing: "0.18em", color: C.amber }}>
          {COPY.cover.secondary}
        </div>
        <div style={{ marginTop: 16, fontFamily: MONO, fontSize: 15, letterSpacing: "0.2em", color: C.blueBright }}>
          {COPY.cover.tagline}
        </div>
        <div style={{ marginTop: 22, display: "flex", gap: 16 }}>
          {["JOB CARDS", "APPROVALS", "INVOICES"].map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.blue }} />
              <span style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", color: C.muted }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: "absolute", left: 968, top: 188 }}>
        <div
          style={{
            position: "absolute",
            inset: -34,
            borderRadius: 26,
            background: `radial-gradient(ellipse at 50% 50%, ${C.blue}22 0%, transparent 70%)`,
            filter: "blur(18px)",
          }}
        />
        <AppFrame width={852}>
          <DashboardScreen />
        </AppFrame>
      </div>

      <div
        style={{
          position: "absolute",
          left: 884,
          top: 650,
          width: 408,
          borderRadius: 10,
          background: "rgba(255,255,255,0.97)",
          border: `1px solid ${C.uiLine}`,
          boxShadow: "0 28px 70px rgba(0,0,0,0.52), 0 2px 6px rgba(0,0,0,0.18)",
          padding: "15px 17px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
          <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.14em", color: C.ink3 }}>JOB JC-2481  ·  VW GOLF GTI</span>
          <span
            style={{
              marginLeft: "auto",
              padding: "3px 6px",
              borderRadius: 3,
              background: C.greenSoft,
              fontFamily: MONO,
              fontSize: 7.5,
              letterSpacing: "0.1em",
              color: C.green,
            }}
          >
            APPROVED
          </span>
        </div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "flex-end", gap: 8 }}>
          <span style={{ fontFamily: FONT, fontSize: 31, fontWeight: 700, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1 }}>
            £440
          </span>
          <span style={{ fontFamily: FONT, fontSize: 10.5, color: C.ink3, paddingBottom: 3 }}>
            pads, discs and labour
          </span>
        </div>
        <div style={{ marginTop: 7, fontFamily: FONT, fontSize: 9.5, color: C.ink2 }}>
          Customer approved from their phone at 10:42.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 108,
          bottom: 58,
          fontFamily: MONO,
          fontSize: 9.5,
          letterSpacing: "0.12em",
          color: "rgba(182,194,209,0.46)",
        }}
      >
        {COPY.cover.credit}
      </div>
      <div
        style={{
          position: "absolute",
          right: 108,
          bottom: 58,
          fontFamily: MONO,
          fontSize: 9.5,
          letterSpacing: "0.14em",
          color: C.silver,
        }}
      >
        {COPY.cover.note}
      </div>

      <Vignette strength={0.92} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
