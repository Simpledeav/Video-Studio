import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import {
  Glow,
  Grain,
  GridField,
  IconArrow,
  IconClipboard,
  IconGauge,
  IconWrench,
  Kicker,
  MaskLine,
  Mono,
  Photo,
  progress,
  Tag,
  useTime,
  Vignette,
} from "../kit";

const BUILDS = [
  { icon: IconGauge, title: COPY.offer.dashboard, note: "The numbers you actually run the business on." },
  { icon: IconClipboard, title: COPY.offer.workflow, note: "The steps your team already follows, made visible." },
  { icon: IconWrench, title: COPY.offer.software, note: "One place for the work, the customer and the invoice." },
];

export const SceneOffer: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const ctaIn = progress(t, BEATS.offer.line3, 0.75);
  const cardIn = progress(t, BEATS.offer.dashboard - 0.3, 0.7);
  const weeksIn = progress(t, BEATS.offer.weeks, 0.6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Photo
        src="headlight-rain.jpg"
        position={wide ? "72% 48%" : "52% 42%"}
        brightness={0.5}
        saturation={0.46}
        style={{ opacity: wide ? 0.5 : 0.36 }}
      />
      <AbsoluteFill
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(4,7,12,0.99) 0%, rgba(4,7,12,0.92) 40%, rgba(4,7,12,0.58) 100%)"
            : "linear-gradient(180deg, rgba(4,7,12,0.78) 0%, rgba(4,7,12,0.92) 54%, rgba(4,7,12,0.99) 100%)",
        }}
      />
      <Glow x="42%" y="46%" size={54} color={C.blue} opacity={0.16} />
      <GridField opacity={0.3} size={wide ? 96 : 74} />

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? undefined : 70,
          top: wide ? 86 : 122,
          width: wide ? 880 : undefined,
        }}
      >
        <Kicker start={BEATS.offer.kicker}>{COPY.offer.kicker}</Kicker>

        <div style={{ marginTop: wide ? 32 : 26 }}>
          <MaskLine start={BEATS.offer.line1} duration={0.72}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 62 : 52, fontWeight: 500, letterSpacing: "-0.045em", lineHeight: 1.02, color: C.silver }}>
              {COPY.offer.line1}
            </div>
          </MaskLine>
          <MaskLine start={BEATS.offer.line2} duration={0.72}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 72 : 60, fontWeight: 700, letterSpacing: "-0.055em", lineHeight: 1.0, color: C.white }}>
              {COPY.offer.line2}
            </div>
          </MaskLine>
          <div
            style={{
              marginTop: wide ? 10 : 8,
              fontFamily: FONT,
              fontSize: wide ? 88 : 72,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.98,
              color: C.blueBright,
              opacity: ctaIn,
              transform: `translateY(${(1 - ctaIn) * 22}px)`,
              textShadow: `0 0 60px ${C.blue}33`,
            }}
          >
            {COPY.offer.line3}
          </div>
        </div>

        <div
          style={{
            marginTop: wide ? 26 : 22,
            maxWidth: wide ? 620 : 900,
            fontFamily: FONT,
            fontSize: wide ? 19 : 16,
            lineHeight: 1.6,
            color: C.muted,
            opacity: progress(t, BEATS.offer.line3 + 0.2, 0.6),
          }}
        >
          We design and build the dashboard, workflow and software around how your company actually works — not a
          template with your logo on it.
        </div>

        <div style={{ marginTop: wide ? 34 : 26, display: "flex", alignItems: "center", gap: 14, opacity: weeksIn }}>
          <div
            style={{
              width: wide ? 44 : 40,
              height: wide ? 44 : 40,
              borderRadius: "50%",
              background: C.blueSoft,
              border: `1px solid ${C.blue}44`,
              display: "grid",
              placeItems: "center",
            }}
          >
            <IconArrow size={wide ? 18 : 16} color={C.blueBright} strokeWidth={2} />
          </div>
          <div>
            <div style={{ fontFamily: MONO, fontSize: wide ? 8.6 : 8, letterSpacing: "0.16em", color: C.muted }}>
              {COPY.offer.weeksLabel}
            </div>
            <div style={{ marginTop: 3, fontFamily: FONT, fontSize: wide ? 17 : 15, fontWeight: 600, color: C.white, letterSpacing: "-0.01em" }}>
              {COPY.offer.weeks}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 1090 : 70,
          right: wide ? 108 : 70,
          top: wide ? 168 : 1030,
          opacity: cardIn,
          transform: `translateY(${(1 - cardIn) * 28}px)`,
        }}
      >
        <div
          style={{
            borderRadius: 10,
            background: "rgba(7, 13, 21, 0.82)",
            border: `1px solid ${C.line}`,
            backdropFilter: "blur(14px)",
            boxShadow: "0 34px 90px rgba(0,0,0,0.48)",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "15px 18px 13px", borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center" }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: 8.6, letterSpacing: "0.18em", color: C.muted }}>WHAT WE BUILD</div>
              <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.white }}>
                A system that fits the business.
              </div>
            </div>
            <Tag color={C.blueBright} background={C.blueSoft} border="rgba(92,157,255,0.3)" style={{ marginLeft: "auto" }}>
              SIMPLEDEAV
            </Tag>
          </div>

          {BUILDS.map((build, index) => {
            const Icon = build.icon;
            const p = progress(t, BEATS.offer.dashboard + index * 0.85, 0.5);
            return (
              <div
                key={build.title}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 13,
                  padding: wide ? "14px 18px" : "13px 16px",
                  borderBottom: index === BUILDS.length - 1 ? "none" : `1px solid ${C.lineSoft}`,
                  opacity: p,
                  transform: `translateX(${(1 - p) * 14}px)`,
                }}
              >
                <div
                  style={{
                    width: wide ? 34 : 31,
                    height: wide ? 34 : 31,
                    borderRadius: 7,
                    background: C.blueSoft,
                    border: `1px solid ${C.blue}33`,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={wide ? 16 : 15} color={C.blueBright} />
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: wide ? 15 : 14, fontWeight: 600, letterSpacing: "0.01em", color: C.white }}>
                    {build.title}
                  </div>
                  <div style={{ marginTop: 3, fontFamily: FONT, fontSize: wide ? 11.5 : 10.8, lineHeight: 1.45, color: C.muted }}>
                    {build.note}
                  </div>
                </div>
              </div>
            );
          })}

          <div
            style={{
              padding: wide ? "15px 18px 17px" : "14px 16px 16px",
              borderTop: `1px solid ${C.lineSoft}`,
              background: "rgba(46,123,255,0.055)",
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: weeksIn,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: MONO, fontSize: wide ? 8 : 7.4, letterSpacing: "0.14em", color: C.blueBright }}>
                {COPY.offer.weeksLabel}
              </div>
              <div style={{ marginTop: 3, fontFamily: FONT, fontSize: wide ? 19 : 17, fontWeight: 700, letterSpacing: "-0.02em", color: C.white }}>
                {COPY.offer.weeks}
              </div>
            </div>
            <IconArrow size={wide ? 18 : 16} color={C.blueBright} />
          </div>
        </div>

        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "center",
            gap: 10,
            opacity: weeksIn,
          }}
        >
          <span style={{ width: 26, height: 1, background: C.blue }} />
          <Mono size={wide ? 8.5 : 8} color={C.silver} style={{ letterSpacing: "0.16em" }}>
            {COPY.offer.footer}
          </Mono>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? 108 : 70,
          bottom: wide ? 40 : 96,
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: progress(t, BEATS.offer.footer, 0.5),
        }}
      >
        <span style={{ fontFamily: MONO, fontSize: wide ? 8.5 : 8, letterSpacing: "0.14em", color: C.dim }}>
          CUSTOM BUSINESS SYSTEMS  ·  DESIGNED AND BUILT BY SIMPLEDEAV
        </span>
      </div>

      <Vignette strength={wide ? 0.8 : 0.94} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
