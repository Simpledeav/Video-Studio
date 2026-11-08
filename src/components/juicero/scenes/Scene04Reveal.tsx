import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, PHOTO, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glow,
  Grain,
  GridField,
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
  WifiGlyph,
  photoSrc,
  progress,
} from "../kit";

const glitchOffset = (frame: number, seed: number) =>
  Math.sin(frame * (0.7 + seed * 0.13) + seed * 4.2) * (6 + seed * 4);

export const Scene04Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const newsroom = progress(t, BEATS.reveal.newsroom, 0.45) * (1 - progress(t, BEATS.reveal.hand - 0.35, 0.4));
  const hand = progress(t, BEATS.reveal.hand - 0.3, 0.45) * (1 - progress(t, BEATS.reveal.glass - 0.35, 0.4));
  const glass = progress(t, BEATS.reveal.glass - 0.3, 0.45) * (1 - progress(t, BEATS.reveal.idle - 0.3, 0.4));
  const idle = progress(t, BEATS.reveal.idle - 0.3, 0.45) * (1 - progress(t, BEATS.reveal.nuance - 0.35, 0.4));
  const mvp = progress(t, BEATS.reveal.mvp - 0.35, 0.5) * (1 - progress(t, BEATS.reveal.nuance - 0.4, 0.4));
  const nuance = progress(t, BEATS.reveal.nuance - 0.35, 0.5) * (1 - progress(t, BEATS.reveal.story - 0.35, 0.4));
  const story = progress(t, BEATS.reveal.story - 0.3, 0.5);

  const errorP = progress(t, BEATS.reveal.error, 0.4);
  const handScale = 1.05 + progress(t, BEATS.reveal.hand, 1.4, (x: number) => x) * 0.05;
  const glassFill = progress(t, BEATS.reveal.glass + 0.1, 0.9);

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 52% 24%, rgba(76,141,255,0.14), transparent 42%), radial-gradient(ellipse at 18% 78%, rgba(226,58,50,0.1), transparent 44%), linear-gradient(170deg, #0B0C0E 0%, #050505 58%, #030303 100%)",
        }}
      />
      <GridField opacity={0.24} size={88} color="rgba(247,243,234,0.04)" />

      {/* Newsroom test */}
      <AbsoluteFill style={{ opacity: newsroom }}>
        <Photo
          src={photoSrc(PHOTO.newsroom)}
          grade="warm"
          objectPosition="50% 48%"
          scale={1.06}
          style={{ filter: "brightness(0.92) contrast(1.1) saturate(0.8) sepia(0.12)" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(3,4,6,0.94) 0%, rgba(3,4,6,0.36) 48%, rgba(3,4,6,0.5) 100%), linear-gradient(180deg, rgba(3,4,6,0.3), rgba(3,4,6,0.84))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            bottom: wide ? 90 : 260,
            maxWidth: wide ? 720 : 850,
          }}
        >
          <Kicker color={C.blue}>{COPY.reveal.kicker}</Kicker>
          <Headline size={wide ? 84 : 78} style={{ marginTop: 16 }}>
            THE TEST
            <br />
            <span style={{ color: C.white }}>NOBODY WANTED.</span>
          </Headline>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 25 : 22,
              color: C.creamSoft,
              lineHeight: 1.4,
              maxWidth: wide ? 620 : 720,
            }}
          >
            A field test. A pack. A very awkward finding.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: wide ? 104 : 28,
            top: wide ? 48 : 80,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 8,
          }}
        >
          <MonoLabel size={11} color={C.blue}>
            FIELD TEST  ·  PACK 01
          </MonoLabel>
          <div
            style={{
              display: "flex",
              gap: 6,
            }}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                style={{
                  width: 28,
                  height: 4,
                  background: i < 3 ? C.blue : "rgba(247,243,234,0.16)",
                  boxShadow: i < 3 ? `0 0 12px ${C.blue}` : "none",
                }}
              />
            ))}
          </div>
        </div>
        <ReconstructionLabel
          text="EDITORIAL RECONSTRUCTION  ·  NOT ARCHIVAL FOOTAGE"
          style={{ position: "absolute", left: wide ? 104 : 24, top: wide ? 40 : 54 }}
        />
      </AbsoluteFill>

      {/* Hand squeeze */}
      <AbsoluteFill style={{ opacity: hand }}>
        <Photo
          src={photoSrc(PHOTO.hand)}
          grade="warm"
          objectPosition={wide ? "50% 30%" : "50% 30%"}
          scale={handScale}
          style={{ filter: "brightness(0.94) contrast(1.08) saturate(0.9) sepia(0.08)" }}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(4,3,2,0.9) 0%, rgba(4,3,2,0.32) 44%, rgba(4,3,2,0.5) 100%), linear-gradient(180deg, rgba(4,3,2,0.22), rgba(4,3,2,0.8))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 92 : 150,
            maxWidth: wide ? 700 : 820,
          }}
        >
          <Kicker color={C.orange}>THE UNCOMFORTABLE PART</Kicker>
          <Headline size={wide ? 84 : 80} style={{ marginTop: 16 }}>
            {COPY.reveal.title1}
            <br />
            <span style={{ color: C.orange }}>{COPY.reveal.title2}</span>
          </Headline>
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            bottom: wide ? 92 : 250,
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          {[
            { value: "02", label: "HANDS" },
            { value: "00", label: "MACHINES" },
            { value: "1", label: "RESULT" },
          ].map((item) => (
            <div key={item.label} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <div
                style={{
                  fontFamily: FONT,
                  fontWeight: 800,
                  fontSize: wide ? 52 : 42,
                  lineHeight: 0.9,
                  color: C.white,
                }}
              >
                {item.value}
              </div>
              <MonoLabel size={11} color={C.muted}>
                {item.label}
              </MonoLabel>
            </div>
          ))}
        </div>
        <ReconstructionLabel
          text="HAND-SQUEEZE RECONSTRUCTION  ·  ILLUSTRATIVE"
          style={{ position: "absolute", right: wide ? 104 : 24, top: wide ? 42 : 54 }}
        />
      </AbsoluteFill>

      {/* Same result in a glass */}
      <AbsoluteFill style={{ opacity: glass }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 52% 38%, rgba(255,106,20,0.16), transparent 38%), linear-gradient(160deg, #110B07, #050403 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "20%" : "50%",
            top: wide ? "52%" : "44%",
            transform: "translate(-50%,-50%)",
          }}
        >
          <div
            style={{
              width: wide ? 300 : 240,
              height: wide ? 520 : 460,
              position: "relative",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: wide ? 190 : 160,
                height: wide ? 380 : 330,
                border: "1px solid rgba(247,243,234,0.3)",
                borderTop: "none",
                borderRadius: "0 0 28px 28px",
                background:
                  "linear-gradient(90deg, rgba(255,255,255,0.16), rgba(255,255,255,0.02) 20%, rgba(255,255,255,0.03) 76%, rgba(255,255,255,0.14))",
                overflow: "hidden",
                position: "relative",
                boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 8,
                  right: 8,
                  bottom: 8,
                  height: `${18 + glassFill * 68}%`,
                  borderRadius: "4px 4px 20px 20px",
                  background: "linear-gradient(180deg, #FFB43D, #FF7A12 42%, #D74400)",
                  boxShadow: "inset 0 10px 22px rgba(255,205,120,0.32)",
                }}
              />
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -16,
                left: "12%",
                right: "12%",
                height: 26,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(0,0,0,0.62), transparent 70%)",
                filter: "blur(5px)",
              }}
            />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "48%" : margin,
            top: wide ? "31%" : "10%",
            maxWidth: wide ? 700 : 820,
          }}
        >
          <Kicker color={C.lime}>SAME JUICE. ZERO WIFI.</Kicker>
          <Headline size={wide ? 74 : 72} style={{ marginTop: 16 }}>
            THE MACHINE
            <br />
            WASN'T NEEDED
            <br />
            <span style={{ color: C.lime }}>FOR THE BASIC RESULT.</span>
          </Headline>
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "48%" : margin,
            bottom: wide ? 92 : 260,
            maxWidth: wide ? 600 : 760,
            fontFamily: FONT,
            fontSize: wide ? 26 : 25,
            lineHeight: 1.42,
            color: C.creamSoft,
          }}
        >
          It still promised consistency, convenience and freshness checks.
          <br />
          But the internet only saw the hands.
        </div>
      </AbsoluteFill>

      {/* Error 404 / idle machine */}
      <AbsoluteFill style={{ opacity: idle }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 64% 38%, rgba(226,58,50,0.18), transparent 40%), linear-gradient(160deg, #0D0707, #040303 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: wide ? "6%" : "-4%",
            bottom: wide ? "4%" : "20%",
            transform: `scale(${wide ? 0.72 : 0.7})`,
            opacity: 0.55,
          }}
        >
          <Machine
            scale={1}
            dim
            freeze
            screen={
              <div>
                <MonoLabel size={10} color={C.red}>
                  ERROR
                </MonoLabel>
                <div style={{ fontFamily: MONO, fontSize: 18, color: C.red, marginTop: 4 }}>404</div>
              </div>
            }
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? "18%" : "12%",
            maxWidth: wide ? 850 : 850,
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              border: `1px solid ${C.red}`,
              background: "rgba(226,58,50,0.1)",
              opacity: errorP,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: C.red }} />
            <MonoLabel size={12} color={C.red}>
              SYSTEM DIAGNOSTIC
            </MonoLabel>
          </div>
          <Headline
            size={wide ? 104 : 86}
            color={C.red}
            style={{
              marginTop: 18,
              opacity: errorP,
              transform: `translateY(${(1 - errorP) * 10}px)`,
            }}
          >
            {COPY.reveal.error}
            <br />
            <span style={{ color: C.white, fontSize: wide ? 68 : 58, lineHeight: 1.02 }}>
              {COPY.reveal.error2}
            </span>
          </Headline>
          <div
            style={{
              marginTop: 22,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: errorP,
            }}
          >
            <span style={{ width: 44, height: 1, background: C.muted }} />
            <MonoLabel size={12} color={C.creamSoft}>
              THE MACHINE IS STILL CONNECTED. JUST NOT NECESSARY.
            </MonoLabel>
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: wide ? 104 : 26,
            top: wide ? 46 : 70,
            opacity: 0.8,
          }}
        >
          <WifiGlyph size={38} color={C.red} progress={1} />
        </div>
        <ReconstructionLabel
          text="ILLUSTRATIVE RECONSTRUCTION  ·  NOT A VERIFIED SCREENSHOT"
          style={{ position: "absolute", left: margin, bottom: wide ? 38 : 52 }}
        />
        {errorP > 0.2 ? (
          <AbsoluteFill style={{ pointerEvents: "none", opacity: 0.6 }}>
            {[0.26, 0.44, 0.61, 0.73].map((top, index) => (
              <div
                key={top}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: `${top * 100}%`,
                  height: index === 1 ? 3 : 1,
                  background: index === 1 ? "rgba(226,58,50,0.5)" : "rgba(247,243,234,0.16)",
                  transform: `translateX(${glitchOffset(frame, index)}px)`,
                  boxShadow: index === 1 ? `0 0 16px ${C.red}` : "none",
                }}
              />
            ))}
          </AbsoluteFill>
        ) : null}
      </AbsoluteFill>

      {/* The hands were the MVP */}
      <AbsoluteFill style={{ opacity: mvp }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 38%, rgba(199,232,76,0.12), transparent 42%), linear-gradient(160deg, #0B0A06, #040403 72%)",
          }}
        />
        <Photo
          src={photoSrc(PHOTO.handOrange)}
          grade="warm"
          objectPosition={wide ? "50% 34%" : "50% 30%"}
          scale={1.02}
          opacity={0.2}
        />
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(90deg, rgba(4,3,2,0.9), rgba(4,3,2,0.3) 52%, rgba(4,3,2,0.84))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            top: wide ? "50%" : "32%",
            width: wide ? 820 : undefined,
            right: wide ? undefined : margin,
            transform: wide ? "translate(-50%,-50%)" : undefined,
            textAlign: wide ? "center" : "left",
          }}
        >
          <Kicker color={C.lime} style={{ justifyContent: wide ? "center" : "flex-start" }}>
            THE VERDICT
          </Kicker>
          <Headline size={wide ? 102 : 88} style={{ marginTop: 18 }}>
            {COPY.reveal.mvp}
          </Headline>
          <div
            style={{
              marginTop: 22,
              fontFamily: FONT,
              fontSize: wide ? 28 : 25,
              lineHeight: 1.42,
              color: C.creamSoft,
              maxWidth: wide ? 700 : 800,
              marginLeft: wide ? "auto" : undefined,
              marginRight: wide ? "auto" : undefined,
            }}
          >
            A seven-hundred-dollar machine. Two free hands. One very awkward board meeting.
          </div>
        </div>
        <ReconstructionLabel
          text="ILLUSTRATIVE RECONSTRUCTION  ·  NOT ARCHIVAL FOOTAGE"
          style={{ position: "absolute", left: wide ? "50%" : margin, bottom: wide ? 38 : 52, transform: wide ? "translateX(-50%)" : undefined }}
        />
      </AbsoluteFill>

      {/* Nuance panel */}
      <AbsoluteFill style={{ opacity: nuance }}>
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(160deg, #10100C 0%, #070604 58%, #040403 100%)",
          }}
        />
        <GridField opacity={0.2} size={72} />
        <div
          style={{
            position: "absolute",
            left: margin,
            right: wide ? "42%" : margin,
            top: wide ? "17%" : "12%",
          }}
        >
          <Kicker color={C.cream}>FACT CHECK</Kicker>
          <Headline size={wide ? 62 : 54} style={{ marginTop: 16 }}>
            TO BE FAIR —
            <br />
            <span style={{ color: C.creamSoft }}>THE MACHINE DID HAVE VALUE.</span>
          </Headline>
          <div
            style={{
              marginTop: 18,
              fontFamily: FONT,
              fontSize: wide ? 24 : 22,
              lineHeight: 1.44,
              color: C.muted,
              maxWidth: wide ? 620 : 780,
            }}
          >
            The joke isn't that it did nothing. It's that the value was hard to feel
            next to the price, the packs, and the subscription.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            right: wide ? "42%" : margin,
            bottom: wide ? 110 : 300,
            display: "flex",
            flexDirection: wide ? "row" : "column",
            gap: wide ? 14 : 10,
          }}
        >
          {COPY.reveal.nuance.map((item: string, index: number) => (
            <div
              key={item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: wide ? "14px 18px" : "12px 16px",
                border: "1px solid rgba(199,232,76,0.28)",
                background: "rgba(199,232,76,0.06)",
              }}
            >
              <span
                style={{
                  fontFamily: MONO,
                  fontSize: 11,
                  color: C.lime,
                  letterSpacing: "0.12em",
                }}
              >
                0{index + 1}
              </span>
              <span
                style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: wide ? 24 : 22,
                  letterSpacing: "-0.01em",
                  color: C.white,
                  textTransform: "uppercase",
                }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            left: margin,
            right: wide ? "42%" : margin,
            bottom: wide ? 50 : 86,
          }}
        >
          <Rule width="100%" color="rgba(247,243,234,0.14)" />
          <div
            style={{
              marginTop: 10,
              fontFamily: FONT,
              fontWeight: 500,
              fontSize: wide ? 17 : 15,
              lineHeight: 1.45,
              color: C.muted,
            }}
          >
            Real intended value: consistency, convenience, and a freshness check on
            the pack. None of it required a $400 press.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: wide ? "6%" : 24,
            top: wide ? "12%" : 32,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.14em",
            color: C.dim,
          }}
        >
          SOURCE: 2017 BLOOMBERG FIELD TEST  ·  PUBLIC REPORTING
        </div>
      </AbsoluteFill>

      {/* The story */}
      <AbsoluteFill style={{ opacity: story }}>
        <AbsoluteFill
          style={{
            background:
              "radial-gradient(ellipse at 50% 48%, rgba(255,106,20,0.15), transparent 42%), linear-gradient(160deg, #100B07, #040302 72%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: wide ? "10%" : "2%",
            top: wide ? "16%" : "40%",
            transform: "scale(0.56)",
            opacity: 0.12,
            filter: "grayscale(0.6)",
          }}
        >
          <Machine scale={1} dim />
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            top: wide ? "50%" : "20%",
            width: wide ? 1000 : undefined,
            right: wide ? undefined : margin,
            transform: wide ? "translate(-50%,-50%)" : undefined,
            textAlign: wide ? "center" : "left",
          }}
        >
          <Kicker color={C.orange} style={{ justifyContent: wide ? "center" : "flex-start" }}>
            THE REAL PROBLEM
          </Kicker>
          <Headline size={wide ? 78 : 70} style={{ marginTop: 18 }}>
            THE STORY WASN'T
            <br />
            THE FEATURE SET.
          </Headline>
          <div
            style={{
              marginTop: 20,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: wide ? 44 : 38,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: C.orange,
              textTransform: "uppercase",
            }}
          >
            IT WAS THE UNNECESSARY COMPLEXITY.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: wide ? "50%" : margin,
            bottom: wide ? 84 : 348,
            right: wide ? undefined : margin,
            width: wide ? 1000 : undefined,
            transform: wide ? "translateX(-50%)" : undefined,
            display: "flex",
            flexDirection: wide ? "row" : "column",
            gap: wide ? 18 : 10,
            justifyContent: "center",
          }}
        >
          {[
            "WHAT IT DID: SQUEEZE, CHILL, CHECK FRESHNESS.",
            "WHAT PEOPLE SAW: $400 TO DO WHAT HANDS COULD DO.",
          ].map((line, index) => (
            <div
              key={line}
              style={{
                flex: wide ? 1 : undefined,
                padding: wide ? "16px 20px" : "12px 16px",
                borderLeft: `2px solid ${index === 0 ? C.creamSoft : C.orange}`,
                background: "rgba(247,243,234,0.035)",
                fontFamily: MONO,
                fontSize: wide ? 14 : 12,
                letterSpacing: "0.08em",
                lineHeight: 1.5,
                color: index === 0 ? C.muted : C.cream,
              }}
            >
              {line}
            </div>
          ))}
        </div>
      </AbsoluteFill>

      <Glow x="50%" y="40%" color={C.red} opacity={0.05} />
      <Scanlines opacity={0.04} />
      <Grain opacity={0.06} />
      <Vignette strength={1.05} />
    </AbsoluteFill>
  );
};
