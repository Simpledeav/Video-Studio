import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import {
  Glow,
  Grain,
  GridField,
  IconCar,
  IconWrench,
  Kicker,
  MaskLine,
  Mono,
  Photo,
  progress,
  seeded,
  useTime,
  Vignette,
} from "../kit";

const COLS = 12;
const ROWS = 7;
const TILES = Array.from({ length: COLS * ROWS }, (_, index) => index);

export const SceneOpportunity: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const line4 = progress(t, 3.75, 0.7);
  const gridIn = progress(t, BEATS.opportunity.grid, 0.6);
  const catsIn = progress(t, BEATS.opportunity.categories, 0.6);
  const noteIn = progress(t, BEATS.opportunity.note, 0.5);

  const tile = wide ? 44 : 48;
  const gap = wide ? 10 : 9;
  const gridWidth = COLS * tile + (COLS - 1) * gap;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Photo src="business-desk.jpg" position="72% 46%" brightness={0.34} saturation={0.4} style={{ opacity: 0.28 }} />
      <AbsoluteFill
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(5,9,16,0.98) 0%, rgba(5,9,16,0.88) 46%, rgba(5,9,16,0.58) 100%)"
            : "linear-gradient(180deg, rgba(5,9,16,0.9) 0%, rgba(5,9,16,0.95) 58%, rgba(5,9,16,0.99) 100%)",
        }}
      />
      <Glow x="72%" y="40%" size={58} color={C.blue} opacity={0.12} />
      <GridField opacity={0.4} size={wide ? 96 : 74} />

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? undefined : 70,
          top: wide ? 80 : 108,
          width: wide ? 780 : undefined,
        }}
      >
        <Kicker start={BEATS.opportunity.line1}>{COPY.opportunity.kicker}</Kicker>

        <div style={{ marginTop: wide ? 28 : 24 }}>
          <MaskLine start={BEATS.opportunity.line1} duration={0.7}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 54 : 46, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.02, color: C.silver }}>
              {COPY.opportunity.line1}
            </div>
          </MaskLine>
          <MaskLine start={BEATS.opportunity.line2} duration={0.7}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 78 : 64, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 0.98, color: C.white }}>
              {COPY.opportunity.line2}
            </div>
          </MaskLine>
          <MaskLine start={BEATS.opportunity.line3} duration={0.7} style={{ marginTop: wide ? 10 : 8 }}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 54 : 46, fontWeight: 500, letterSpacing: "-0.04em", lineHeight: 1.02, color: C.silver }}>
              {COPY.opportunity.line3}
            </div>
          </MaskLine>
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 80 : 66,
              fontWeight: 700,
              letterSpacing: "-0.058em",
              lineHeight: 0.98,
              color: C.blueBright,
              opacity: line4,
              transform: `translateY(${(1 - line4) * 18}px)`,
            }}
          >
            {COPY.opportunity.line4}
          </div>
        </div>

        <div
          style={{
            marginTop: wide ? 28 : 22,
            maxWidth: wide ? 590 : 900,
            fontFamily: FONT,
            fontSize: wide ? 18 : 15.5,
            lineHeight: 1.55,
            color: C.muted,
            opacity: progress(t, 5.6, 0.6),
          }}
        >
          {COPY.opportunity.sub}
        </div>

        <div style={{ marginTop: wide ? 22 : 18, display: "flex", flexWrap: "wrap", gap: 8, opacity: catsIn }}>
          {COPY.opportunity.categories.map((category, index) => {
            const p = progress(t, BEATS.opportunity.categories + index * 0.08, 0.4);
            return (
              <div
                key={category}
                style={{
                  padding: wide ? "6px 9px" : "6px 8px",
                  borderRadius: 3,
                  border: `1px solid ${index === 0 ? "rgba(92,157,255,0.3)" : C.lineSoft}`,
                  background: index === 0 ? C.blueSoft : "rgba(255,255,255,0.025)",
                  fontFamily: MONO,
                  fontSize: wide ? 8 : 7.4,
                  letterSpacing: "0.1em",
                  color: index === 0 ? C.blueBright : C.muted,
                  opacity: p,
                }}
              >
                {category}
              </div>
            );
          })}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 1010 : 70,
          right: wide ? 108 : 70,
          top: wide ? 226 : 820,
          display: "flex",
          justifyContent: "center",
          opacity: gridIn,
          transform: `translateY(${(1 - gridIn) * 26}px)`,
        }}
      >
        <div style={{ width: gridWidth }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 13 }}>
            <span style={{ fontFamily: MONO, fontSize: wide ? 8.5 : 8, letterSpacing: "0.16em", color: C.dim }}>
              SERVICE BUSINESSES
            </span>
            <span style={{ height: 1, flex: 1, background: C.lineSoft }} />
            <span style={{ fontFamily: MONO, fontSize: wide ? 8 : 7.4, letterSpacing: "0.14em", color: C.blueBright }}>
              SAME WORKFLOW
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${COLS}, ${tile}px)`,
              gap,
            }}
          >
            {TILES.map((index) => {
              const lit = seeded(index * 2.7) > 0.86;
              const p = progress(t, BEATS.opportunity.grid + index * 0.012, 0.35);
              const Icon = index % 3 === 0 ? IconCar : IconWrench;
              return (
                <div
                  key={index}
                  style={{
                    width: tile,
                    height: tile,
                    borderRadius: 7,
                    background: lit ? "rgba(46,123,255,0.18)" : "rgba(255,255,255,0.028)",
                    border: `1px solid ${lit ? "rgba(92,157,255,0.34)" : C.lineSoft}`,
                    display: "grid",
                    placeItems: "center",
                    opacity: p * (lit ? 1 : 0.72),
                  }}
                >
                  <Icon size={wide ? 15 : 17} color={lit ? C.blueBright : C.dim} strokeWidth={1.5} />
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.blue }} />
            <Mono size={wide ? 8 : 7.4} color={C.dim} style={{ letterSpacing: "0.12em" }}>
              ONE OPERATING PROBLEM  ·  MANY SPECIALISMS
            </Mono>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? 108 : 70,
          bottom: wide ? 110 : 190,
          opacity: noteIn,
          transform: `translateY(${(1 - noteIn) * 10}px)`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 3, height: 34, background: C.blue, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: MONO, fontSize: wide ? 9 : 8.4, letterSpacing: "0.14em", color: C.blueBright }}>
              THE SAME OPERATING PROBLEM, REPEATED.
            </div>
            <div style={{ marginTop: 3, fontFamily: FONT, fontSize: wide ? 12 : 10.5, color: C.muted }}>
              Different trades. Different bays. The same broken workflow between the customer, the job and the invoice.
            </div>
          </div>
        </div>
      </div>

      <Vignette strength={wide ? 0.8 : 0.92} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
