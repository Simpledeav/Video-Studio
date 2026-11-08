import { AbsoluteFill, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BEATS, COPY, PHOTO, useStage } from "../../../config/juicero";
import {
  C,
  FONT,
  Glass,
  Grain,
  Headline,
  Kicker,
  Machine,
  MonoLabel,
  Orange,
  Photo,
  JuicePack,
  ReconstructionLabel,
  Scanlines,
  Vignette,
  clamp,
  easeOut,
  photoSrc,
  progress,
} from "../kit";

export const Scene01Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { wide, margin } = useStage();
  const t = frame / fps;

  const reveal = spring({ frame: frame - Math.round(BEATS.hook.machine * fps), fps, config: { damping: 24, stiffness: 80 } });
  const orangeIn = progress(t, BEATS.hook.orange, 1.2);
  const packIn = progress(t, BEATS.hook.pack, 0.9);
  const press = progress(t, BEATS.hook.press, 0.5, easeOut);
  const handIn = progress(t, BEATS.hook.hand, 0.28);
  const glassFill = progress(t, BEATS.hook.glass, 0.95);
  const freeze = progress(t, BEATS.hook.freeze, 0.3);
  const priceIn = progress(t, BEATS.hook.price, 0.4);

  const shake =
    t > BEATS.hook.impact && t < BEATS.hook.impact + 0.28
      ? Math.sin(t * 140) * (1 - (t - BEATS.hook.impact) / 0.28) * 7
      : 0;

  const showHand = t >= BEATS.hook.hand && t < BEATS.hook.glass - 0.05;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 28%, rgba(255,106,20,0.2) 0%, rgba(70,24,0,0.16) 36%, rgba(6,5,4,0.98) 72%), linear-gradient(180deg, #180D05 0%, #0A0705 44%, #050403 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          top: wide ? "54%" : "58%",
          height: wide ? "46%" : "42%",
          background:
            "linear-gradient(180deg, rgba(255,142,59,0.16) 0%, rgba(19,11,6,0.82) 18%, rgba(4,3,2,0.98) 100%)",
          borderTop: "1px solid rgba(255,160,90,0.18)",
          transform: "perspective(900px) rotateX(62deg)",
          transformOrigin: "top center",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 26%, rgba(0,0,0,0.64) 100%)",
        }}
      />

      {/* Machine + product choreography */}
      <AbsoluteFill
        style={{
          transform: `translate3d(${shake}px, ${-shake * 0.35}px, 0) scale(${1 + reveal * 0.02})`,
        }}
      >
        {/* Studio plinth */}
        <div
          style={{
            position: "absolute",
            left: wide ? "23%" : "50%",
            bottom: wide ? "6.4%" : "15.2%",
            width: wide ? 430 : 440,
            height: 30,
            transform: "translateX(-50%)",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at 50% 40%, rgba(93,99,107,0.9), rgba(12,13,15,0.98) 62%, transparent 100%)",
            boxShadow: "0 28px 60px rgba(0,0,0,0.7), 0 0 40px rgba(255,106,20,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: wide ? "23%" : "50%",
            bottom: wide ? "9%" : "19%",
            transform: "translateX(-50%)",
            filter: `drop-shadow(0 0 60px rgba(255,106,20,${0.18 + press * 0.16}))`,
          }}
        >
          <Machine
            scale={wide ? 0.96 : 1.04}
            press={press}
            open={1 - packIn}
            dim={freeze > 0.5}
            freeze={freeze > 0.5}
            screen={
              <div>
                <MonoLabel size={wide ? 11 : 12} color={freeze > 0.5 ? C.red : C.lime}>
                  {freeze > 0.5 ? "SYSTEM PAUSED" : "READY"}
                </MonoLabel>
                <div
                  style={{
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: wide ? 17 : 19,
                    letterSpacing: "-0.02em",
                    color: C.white,
                    marginTop: 4,
                  }}
                >
                  {freeze > 0.5 ? "HANDS: 1  ·  MACHINE: 0" : "COLD PRESS"}
                </div>
                {freeze > 0.5 ? (
                  <div
                    style={{
                      marginTop: 6,
                      width: 42,
                      height: 2,
                      background: C.red,
                      boxShadow: `0 0 10px ${C.red}`,
                    }}
                  />
                ) : null}
              </div>
            }
          />
        </div>

        {/* Orange rolls toward the machine */}
        <div
          style={{
            position: "absolute",
            left: wide ? "7%" : "3%",
            bottom: wide ? "8%" : "15%",
            transform: `translateX(${orangeIn * (wide ? 250 : 215)}px) rotate(${orangeIn * 220}deg)`,
            opacity: clamp(orangeIn * 3),
          }}
        >
          <Orange size={wide ? 92 : 104} />
        </div>

        {/* Pack enters the press */}
        { !showHand ? (
          <div
            style={{
              position: "absolute",
              left: wide ? "23%" : "50%",
              bottom: wide ? "35%" : "45%",
              transform: `translate(-50%, ${(1 - packIn) * -130}px) scale(${0.7 + packIn * 0.3})`,
              opacity: clamp(packIn * 2.4) * (t < BEATS.hook.glass ? 1 : 0),
              zIndex: 12,
            }}
          >
            <JuicePack scale={wide ? 0.62 : 0.62} rotate={packIn * 4} />
          </div>
        ) : null}

        {/* Glasses */}
        <div
          style={{
            position: "absolute",
            left: wide ? "36%" : "69%",
            bottom: wide ? "6.6%" : "10%",
            display: "flex",
            alignItems: "flex-end",
            gap: wide ? 30 : 18,
            opacity: glassFill,
            transform: `translateY(${(1 - glassFill) * 26}px)`,
          }}
        >
          <Glass size={wide ? 0.9 : 0.92} fill={0.08 + glassFill * 0.78} />
          <Glass size={wide ? 0.74 : 0.72} fill={0.04 + Math.max(0, glassFill - 0.16) * 0.8} />
        </div>
      </AbsoluteFill>

      {/* The hand reveal */}
      {showHand ? (
        <AbsoluteFill style={{ zIndex: 20 }}>
          <Photo
            src={photoSrc(PHOTO.hand)}
            grade="warm"
            objectPosition={wide ? "50% 38%" : "54% 38%"}
            scale={1.06 + handIn * 0.04}
            style={{ filter: "brightness(0.94) contrast(1.06) saturate(0.94) sepia(0.06)" }}
          />
          <AbsoluteFill
            style={{
              background:
                "linear-gradient(90deg, rgba(4,3,2,0.84) 0%, rgba(4,3,2,0.24) 46%, rgba(4,3,2,0.6) 100%), linear-gradient(180deg, rgba(4,3,2,0.12), rgba(4,3,2,0.7))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: wide ? 120 : margin,
              bottom: wide ? 90 : 260,
              maxWidth: wide ? 720 : 820,
            }}
          >
            <Kicker color={C.lime}>NO APP. NO WIFI. NO SUBSCRIPTION.</Kicker>
            <Headline size={wide ? 78 : 72} style={{ marginTop: 18 }}>
              YOUR HANDS
              <br />
              WERE FREE.
            </Headline>
          </div>
          <ReconstructionLabel
            text="HAND-SQUEEZE RECONSTRUCTION  ·  ILLUSTRATIVE"
            style={{ position: "absolute", right: wide ? 104 : 26, top: wide ? 44 : 40 }}
          />
        </AbsoluteFill>
      ) : null}

      {/* Headline block */}
      <div
        style={{
          position: "absolute",
          left: margin,
          top: wide ? 94 : 142,
          opacity: 1 - Math.max(priceIn, handIn),
        }}
      >
        <Kicker>{COPY.hook.kicker}</Kicker>
        <Headline size={wide ? 74 : 78} style={{ marginTop: 18 }}>
          {COPY.hook.title1}
          <br />
          <span style={{ color: C.orange }}>{COPY.hook.title2}</span>
        </Headline>
        {wide ? (
          <MonoLabel size={17} color={C.creamSoft} style={{ marginTop: 18 }}>
            {COPY.hook.sub}
          </MonoLabel>
        ) : null}
      </div>

      {!wide ? (
        <MonoLabel
          size={15}
          color={C.creamSoft}
          style={{
            position: "absolute",
            left: margin,
            top: 324,
            opacity: 1 - Math.max(priceIn, handIn),
          }}
        >
          {COPY.hook.sub}
        </MonoLabel>
      ) : null}

      {/* Price slam */}
      <div
        style={{
          position: "absolute",
          left: wide ? 104 : 0,
          right: wide ? undefined : 0,
          top: wide ? 190 : 770,
          width: wide ? 640 : undefined,
          display: "flex",
          flexDirection: "column",
          alignItems: wide ? "flex-start" : "center",
          transform: `scale(${0.9 + priceIn * 0.1})`,
          opacity: priceIn,
          zIndex: 30,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: wide ? 18 : 10,
            padding: wide ? "22px 30px" : "26px 36px",
            background: "rgba(8,6,4,0.66)",
            border: `1px solid ${C.orangeSoft}`,
            boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        >
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: wide ? 128 : 132,
              lineHeight: 0.82,
              letterSpacing: "-0.06em",
              color: C.white,
            }}
          >
            {COPY.hook.price}
          </span>
          <span
            style={{
              fontFamily: FONT,
              fontWeight: 800,
              fontSize: wide ? 58 : 56,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              color: C.orange,
              transform: "rotate(-3deg)",
            }}
          >
            {COPY.hook.priceTail}
          </span>
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: C.red }} />
          <MonoLabel size={14} color={C.creamSoft}>
            {COPY.hook.freeze}  ·  THE INTERNET IS WATCHING
          </MonoLabel>
        </div>
      </div>

      {/* Freeze glitch bars */}
      {freeze > 0.4 ? (
        <AbsoluteFill style={{ zIndex: 25, pointerEvents: "none", opacity: clamp((freeze - 0.4) * 2.2) }}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "31%",
              height: 3,
              background: "rgba(226,58,50,0.55)",
              boxShadow: `0 0 18px ${C.red}`,
              transform: `translateX(${Math.sin(t * 37) * 18}px)`,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: "52%",
              height: 1,
              background: "rgba(247,243,234,0.25)",
              transform: `translateX(${Math.cos(t * 41) * 26}px)`,
            }}
          />
        </AbsoluteFill>
      ) : null}

      <Scanlines opacity={0.035} />
      <Grain />
      <Vignette strength={1.05} warm />
    </AbsoluteFill>
  );
};
