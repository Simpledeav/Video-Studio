import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, PHOTO, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glow,
  Grain,
  GridField,
  Headline,
  Kicker,
  Machine,
  MonoLabel,
  Photo,
  ReconstructionLabel,
  Rule,
  Scanlines,
  Spark,
  Vignette,
  WifiGlyph,
  photoSrc,
  progress,
} from "../kit";

export const Scene02Dream: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const enter = spring({ frame, fps, config: { damping: 26, stiffness: 90 } });
  const officeOpacity = 1 - progress(t, BEATS.dream.cad - 0.5, 0.5);
  const cadOpacity =
    progress(t, BEATS.dream.cad - 0.4, 0.5) * (1 - progress(t, BEATS.dream.assembly - 0.5, 0.5));
  const assemblyOpacity =
    progress(t, BEATS.dream.assembly - 0.4, 0.5) * (1 - progress(t, BEATS.dream.machine - 0.5, 0.5));
  const machineOpacity = progress(t, BEATS.dream.machine - 0.3, 0.55);
  const machineScale = 0.92 + progress(t, BEATS.dream.machine, 5, (x: number) => x) * 0.05;

  const cards = [
    { text: COPY.dream.cards[0], at: BEATS.dream.card1, color: C.orange },
    { text: COPY.dream.cards[1], at: BEATS.dream.card2, color: C.lime },
    { text: COPY.dream.cards[2], at: BEATS.dream.card3, color: C.cream },
  ];
  const taglineIn = progress(t, BEATS.dream.tagline, 0.6);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 72% 18%, rgba(255,106,20,0.18), transparent 46%), radial-gradient(ellipse at 12% 80%, rgba(199,232,76,0.08), transparent 44%), linear-gradient(160deg, #15100B 0%, #080604 62%, #050403 100%)",
        }}
      />
      <GridField opacity={0.3} size={84} color="rgba(247,243,234,0.045)" />

      {/* Photo montage: office, engineering, assembly */}
      <div
        style={{
          position: "absolute",
          left: wide ? "48%" : 0,
          right: 0,
          top: 0,
          bottom: wide ? 0 : "42%",
          overflow: "hidden",
          borderLeft: wide ? "1px solid rgba(247,243,234,0.12)" : "none",
          borderBottom: wide ? "none" : "1px solid rgba(247,243,234,0.12)",
        }}
      >
        {officeOpacity > 0 ? (
          <AbsoluteFill style={{ opacity: officeOpacity }}>
            <Photo
              src={photoSrc(PHOTO.office)}
              grade="warm"
              objectPosition={wide ? "52% 44%" : "50% 42%"}
              scale={1.04 + t * 0.012}
            />
          </AbsoluteFill>
        ) : null}
        {cadOpacity > 0 ? (
          <AbsoluteFill style={{ opacity: cadOpacity }}>
            <Photo
              src={photoSrc(PHOTO.factory)}
              grade="cool"
              objectPosition="50% 46%"
              scale={1.05 + t * 0.01}
            />
          </AbsoluteFill>
        ) : null}
        {assemblyOpacity > 0 ? (
          <AbsoluteFill style={{ opacity: assemblyOpacity }}>
            <Photo
              src={photoSrc(PHOTO.assembly)}
              grade="silver"
              objectPosition="54% 42%"
              scale={1.04 + t * 0.01}
            />
          </AbsoluteFill>
        ) : null}
        <AbsoluteFill
          style={{
            background: wide
              ? "linear-gradient(90deg, rgba(5,4,3,0.92) 0%, rgba(5,4,3,0.2) 26%, rgba(5,4,3,0.1) 72%, rgba(5,4,3,0.56) 100%), linear-gradient(180deg, rgba(5,4,3,0.46), transparent 28%, rgba(5,4,3,0.62))"
              : "linear-gradient(180deg, rgba(5,4,3,0.5) 0%, transparent 30%, rgba(5,4,3,0.36) 62%, rgba(5,4,3,0.96) 100%)",
          }}
        />
        {wide ? (
          <div
            style={{
              position: "absolute",
              left: 28,
              bottom: 28,
              width: 360,
              padding: "14px 16px",
              border: "1px solid rgba(247,243,234,0.16)",
              background: "rgba(5,4,3,0.62)",
              backdropFilter: "blur(6px)",
            }}
          >
            <MonoLabel size={11} color={C.lime}>
              {t < BEATS.dream.cad
                ? "THE STARTUP OFFICE  ·  PALO ALTO"
                : t < BEATS.dream.assembly
                  ? "MECHANICAL DESIGN  ·  PRECISION PARTS"
                  : "PRODUCTION LINE  ·  PRODUCE PACKS"}
            </MonoLabel>
            <div style={{ marginTop: 8, height: 1, background: "rgba(247,243,234,0.14)" }} />
            <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 15, color: C.creamSoft, lineHeight: 1.4 }}>
              {t < BEATS.dream.cad
                ? "A very confident team, a very expensive machine."
                : t < BEATS.dream.assembly
                  ? "CAD screens, machined aluminium, and a growing bill."
                  : "Fresh produce, sealed packs, a cold chain."}
            </div>
          </div>
        ) : null}
        <ReconstructionLabel
          text="ILLUSTRATIVE STARTUP RECONSTRUCTION"
          style={{ position: "absolute", left: wide ? 24 : 18, top: wide ? 24 : 18 }}
        />
      </div>

      {/* Machine + connected juice */}
      <AbsoluteFill style={{ opacity: machineOpacity, pointerEvents: "none" }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 62% 40%, rgba(255,106,20,0.22), transparent 44%), linear-gradient(160deg, rgba(8,6,4,0.2), rgba(5,4,3,0.94) 74%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "70%" : "50%",
            top: wide ? "46%" : "30%",
            transform: `translate(-50%,-50%) scale(${machineScale})`,
            filter: "drop-shadow(0 0 54px rgba(255,106,20,0.18))",
          }}
        >
          <Machine
            scale={wide ? 0.8 : 0.95}
            screen={
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WifiGlyph size={wide ? 16 : 17} progress={progress(t, BEATS.dream.wifi, 0.8)} />
                  <MonoLabel size={wide ? 9 : 10} color={C.lime}>
                    CONNECTED
                  </MonoLabel>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, color: C.creamSoft, marginTop: 4 }}>
                  FRESHNESS CHECK
                </div>
              </div>
            }
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "59%" : "50%",
            top: wide ? "18%" : "8%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: progress(t, BEATS.dream.wifi, 0.8),
          }}
        >
          <WifiGlyph size={wide ? 48 : 42} progress={progress(t, BEATS.dream.wifi, 1)} />
          <MonoLabel size={12} color={C.lime}>
            ONLINE  ·  WAITING FOR ORANGES
          </MonoLabel>
        </div>
      </AbsoluteFill>

      {/* Copy column */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 96 : undefined,
          bottom: wide ? undefined : 242,
          width: wide ? 760 : "auto",
          right: wide ? undefined : margin,
          opacity: enter,
        }}
      >
        <Kicker color={C.orange}>{COPY.dream.kicker}</Kicker>
        <Headline size={wide ? 86 : 76} style={{ marginTop: 18 }}>
          {COPY.dream.title}
        </Headline>
        <div style={{ marginTop: 18, maxWidth: wide ? 620 : 780 }}>
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 28 : 27,
              lineHeight: 1.34,
              color: C.creamSoft,
            }}
          >
            {COPY.dream.sub}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: wide ? 36 : 26 }}>
          {cards.map((card, index) => {
            const p = progress(t, card.at, 0.45);
            return (
              <div
                key={card.text}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  opacity: p,
                  transform: `translateX(${(1 - p) * -18}px)`,
                }}
              >
                <span
                  style={{
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: card.color,
                    boxShadow: `0 0 12px ${card.color}`,
                  }}
                />
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: wide ? 30 : 26,
                    letterSpacing: "-0.02em",
                    color: index === 2 ? C.cream : C.white,
                    textTransform: "uppercase",
                  }}
                >
                  {card.text}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: wide ? 34 : 24, opacity: taglineIn }}>
          <Rule width={wide ? 430 : 360} color="rgba(247,243,234,0.18)" />
          <div
            style={{
              marginTop: 14,
              fontFamily: FONT,
              fontWeight: 600,
              fontSize: wide ? 24 : 21,
              letterSpacing: "0.12em",
              color: C.orange,
              textTransform: "uppercase",
            }}
          >
            {COPY.dream.tagline}
          </div>
          {!wide ? (
            <MonoLabel size={12} color={C.muted} style={{ marginTop: 10 }}>
              {COPY.dream.label}
            </MonoLabel>
          ) : null}
        </div>
        {wide ? (
          <MonoLabel size={12} color={C.muted} style={{ marginTop: 18 }}>
            {COPY.dream.label}
          </MonoLabel>
        ) : null}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: wide ? 18 : 14,
            opacity: 0.72,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.orange }} />
          <MonoLabel size={10} color={C.dim} style={{ letterSpacing: "0.14em" }}>
            FOUNDED 2013  ·  $120M RAISED  ·  2017 SHUTDOWN
          </MonoLabel>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: wide ? 104 : 42,
          top: wide ? 40 : 38,
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Spark size={16} color={C.orange} />
        <MonoLabel size={11} color={C.creamSoft}>
          SERIES B  ·  THE FUTURE OF JUICE
        </MonoLabel>
      </div>

      <Glow x="70%" y="35%" color={C.orange} opacity={0.12} />
      <Scanlines opacity={0.03} />
      <Grain opacity={0.05} />
      <Vignette strength={0.95} warm />
    </AbsoluteFill>
  );
};
