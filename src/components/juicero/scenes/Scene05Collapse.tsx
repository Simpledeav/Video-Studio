import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, PHOTO, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glow,
  Grain,
  Headline,
  Kicker,
  MONO,
  Machine,
  MonoLabel,
  Photo,
  ReconstructionLabel,
  Rule,
  Scanlines,
  Vignette,
  photoSrc,
  progress,
} from "../kit";

export const Scene05Collapse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const empty = progress(t, BEATS.collapse.empty, 0.45) * (1 - progress(t, BEATS.collapse.end - 0.4, 0.45));
  const end = progress(t, BEATS.collapse.end - 0.35, 0.5) * (1 - progress(t, BEATS.collapse.lesson - 0.4, 0.4));
  const lesson = progress(t, BEATS.collapse.lesson - 0.35, 0.55);
  const yearP = progress(t, BEATS.collapse.year, 0.4);
  const counterP = progress(t, BEATS.collapse.counter - 0.2, 0.9);
  const redP = progress(t, 2.6, 1.2);

  return (
    <AbsoluteFill style={{ backgroundColor: "#070505", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 34%, rgba(126,23,23,0.2), transparent 44%), linear-gradient(170deg, #0D0808 0%, #060404 60%, #030202 100%)",
        }}
      />

      {/* Empty boardroom */}
      <AbsoluteFill style={{ opacity: empty }}>
        <Photo
          src={photoSrc(PHOTO.emptyroom)}
          grade="silver"
          objectPosition="50% 52%"
          scale={1.06}
          style={{ filter: "brightness(0.78) contrast(1.14) saturate(0.62) sepia(0.08)" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(3,2,2,0.94) 0%, rgba(3,2,2,0.28) 48%, rgba(3,2,2,0.6) 100%), linear-gradient(180deg, rgba(3,2,2,0.42), rgba(3,2,2,0.9))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            bottom: wide ? 92 : 240,
            maxWidth: wide ? 760 : 860,
          }}
        >
          <Kicker color={C.red}>{COPY.collapse.kicker}</Kicker>
          <Headline size={wide ? 86 : 78} style={{ marginTop: 16 }}>
            {COPY.collapse.title1}
            <br />
            {COPY.collapse.title2}
          </Headline>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontSize: wide ? 26 : 24,
              lineHeight: 1.4,
              color: C.creamSoft,
            }}
          >
            {COPY.collapse.sub}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: wide ? 104 : 30,
            top: wide ? 44 : 64,
            opacity: yearP,
            transform: `rotate(-6deg) scale(${0.92 + yearP * 0.08})`,
            border: `2px solid ${C.red}`,
            padding: wide ? "12px 20px" : "10px 16px",
            color: C.red,
            fontFamily: MONO,
            fontSize: wide ? 24 : 20,
            letterSpacing: "0.2em",
            background: "rgba(226,58,50,0.08)",
          }}
        >
          2017
        </div>
        <div
          style={{
            position: "absolute",
            right: wide ? 84 : 10,
            bottom: wide ? 8 : 180,
            transform: "scale(0.36)",
            transformOrigin: "bottom right",
            opacity: 0.42,
            filter: "grayscale(1) brightness(0.6)",
          }}
        >
          <Machine
            scale={1}
            dim
            freeze
            screen={
              <div>
                <MonoLabel size={9} color={C.red}>
                  OFFLINE
                </MonoLabel>
                <div style={{ fontFamily: MONO, fontSize: 14, color: C.red, marginTop: 3 }}>—</div>
              </div>
            }
          />
        </div>
        <ReconstructionLabel
          text={COPY.collapse.note}
          style={{ position: "absolute", left: margin, top: wide ? 36 : 54 }}
        />
      </AbsoluteFill>

      {/* THE END */}
      <AbsoluteFill style={{ opacity: end }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 46%, rgba(126,23,23,0.18), transparent 44%), linear-gradient(170deg, #0B0605, #030202 74%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: wide ? "34%" : "28%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: wide ? 22 : 18,
              letterSpacing: "0.32em",
              color: C.red,
              marginBottom: 14,
            }}
          >
            2017
          </div>
          <Headline size={wide ? 176 : 142} align="center" color={C.white}>
            {COPY.collapse.title3}
          </Headline>
          <div
            style={{
              marginTop: 22,
              fontFamily: FONT,
              fontSize: wide ? 26 : 23,
              color: C.muted,
              maxWidth: wide ? 760 : 720,
              lineHeight: 1.4,
            }}
          >
            The company shut down. The machine became a museum piece before it became
            a habit.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            right: wide ? undefined : margin,
            bottom: wide ? 66 : 200,
            display: "flex",
            justifyContent: "center",
            alignItems: "baseline",
            gap: 18,
            opacity: counterP,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: wide ? 66 : 52,
              letterSpacing: "-0.04em",
              color: "rgba(247,243,234,0.16)",
              textDecoration: "line-through",
              textDecorationColor: C.red,
              textDecorationThickness: 3,
            }}
          >
            $120M
          </div>
          <MonoLabel size={12} color={C.dim}>
            {COPY.collapse.counterLabel}
          </MonoLabel>
        </div>
      </AbsoluteFill>

      {/* The lesson stamp */}
      <AbsoluteFill style={{ opacity: lesson }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 52% 46%, rgba(255,106,20,0.16), transparent 40%), linear-gradient(160deg, #100A06, #040302 74%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: wide ? "8%" : "-8%",
            top: "30%",
            transform: "scale(0.6)",
            opacity: 0.1,
            filter: "grayscale(0.8)",
          }}
        >
          <Machine scale={1} dim />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            right: wide ? undefined : margin,
            top: wide ? "48%" : "34%",
            width: wide ? 1080 : undefined,
            transform: wide ? "translate(-50%,-50%)" : undefined,
            textAlign: wide ? "center" : "left",
          }}
        >
          <Kicker color={C.orange} style={{ justifyContent: wide ? "center" : "flex-start" }}>
            THE TAKEAWAY
          </Kicker>
          <Headline size={wide ? 122 : 96} style={{ marginTop: 18 }}>
            A $120M
            <br />
            <span style={{ color: C.orange }}>LESSON.</span>
          </Headline>
          <div
            style={{
              marginTop: 24,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 30 : 26,
              lineHeight: 1.4,
              color: C.creamSoft,
              maxWidth: wide ? 760 : 800,
              marginLeft: wide ? "auto" : undefined,
              marginRight: wide ? "auto" : undefined,
            }}
          >
            Complexity can raise money. It cannot create value the customer can feel.
          </div>
        </div>
        <Rule
          width={wide ? 520 : 240}
          color={C.orange}
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            bottom: wide ? 120 : 210,
            transform: wide ? "translateX(-50%)" : undefined,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            bottom: wide ? 80 : 168,
            transform: wide ? "translateX(-50%)" : undefined,
            fontFamily: MONO,
            fontSize: 12,
            letterSpacing: "0.18em",
            color: C.muted,
          }}
        >
          REFUNDS  ·  SUSPENDED SALES  ·  SHUTDOWN
        </div>
      </AbsoluteFill>

      {/* red wash at collapse */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(126,23,23,0.24), transparent 56%)",
          opacity: redP * 0.8,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />
      <Glow x="50%" y="62%" color={C.red} opacity={0.08} />
      <Scanlines opacity={0.04} />
      <Grain opacity={0.06} />
      <Vignette strength={1.15} />
    </AbsoluteFill>
  );
};
