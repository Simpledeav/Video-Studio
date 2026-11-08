import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/mcdonalds";
import {
  Beam,
  Display,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Meta,
  Photo,
  PhotoScrim,
  Reveal,
  Scratches,
  Vignette,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";
import {
  Arches,
  ScreenCustomerLine,
  ScreenError,
  ScreenFooter,
  ScreenFrame,
  ScreenHeader,
  ScreenRow,
} from "../visuals";

const items = COPY.hookItems;

export const SceneHook: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.hook;

  const intro = progress(t, 0, 0.42, easeOut);
  const introOut = 1 - progress(t, 0.48, 0.4, easeInOut);
  const markIn = progress(t, 0, 0.46, easeOut);
  const introFlash = progress(t, 0.5, 0.08) * (1 - progress(t, 0.58, 0.32));
  const photoIn = progress(t, b.photo, 1.1, easeOut);
  const push = progress(t, 0, 9.1, easeInOut);
  const headline = progress(t, b.headline, 0.8, easeOut);
  const screenIn = progress(t, b.screen, 0.65, easeOut);
  const shout = progress(t, b.shout, 0.38, easeOut);
  const shake = t > b.shout ? Math.max(0, Math.sin((t - b.shout) * 46) * (1 - progress(t, b.shout, 0.42))) : 0;
  const flash = progress(t, b.shout, 0.12, easeInOut) * (1 - progress(t, b.shout + 0.12, 0.4));

  const itemAppear = (index: number) =>
    progress(t, b.firstItem + index * 0.27, 0.32, easeOut);

  const screenWidth = wide ? 610 : 590;
  const screenY = wide ? 150 : 1010;
  const screenX = wide ? stage.width - stage.margin - screenWidth : stage.margin;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1.035 + push * 0.11}) translateY(${wide ? 0 : 12}px)`,
          opacity: photoIn,
        }}
      >
        <Photo
          src={IMG.driveThru}
          objectPosition={wide ? "50% 52%" : "46% 50%"}
          brightness={0.62}
          contrast={1.14}
          saturation={0.82}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <AbsoluteFill
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(4,4,5,0.94) 0%, rgba(4,4,5,0.7) 42%, rgba(4,4,5,0.16) 70%, rgba(4,4,5,0.62) 100%)"
            : "linear-gradient(180deg, rgba(4,4,5,0.82) 0%, rgba(4,4,5,0.28) 34%, rgba(4,4,5,0.5) 58%, rgba(4,4,5,0.94) 100%)",
        }}
      />
      <PhotoScrim from={wide ? "left" : "bottom"} strength={0.9} />
      <Glow x={wide ? "78%" : "50%"} y={wide ? "20%" : "16%"} color={C.yellow} opacity={0.12} size={54} />
      <Vignette strength={1.1} />
      <Scratches opacity={0.46} />
      <Grain opacity={0.06} />

      {/* Opening mark. The first half-second is a brand flash, then the
          drive-thru photograph takes over. */}
      <AbsoluteFill
        style={{
          backgroundColor: C.black,
          zIndex: 50,
          opacity: introOut,
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <Glow x="50%" y="44%" color={C.yellow} opacity={0.16} size={44} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Meta size={10} color={C.muted} style={{ letterSpacing: "0.26em", marginBottom: 22 }}>
            McDONALD&apos;S × IBM
          </Meta>
          <Arches size={196 * (0.88 + markIn * 0.12)} opacity={0.98} />
          <div
            style={{
              marginTop: 26,
              fontFamily: FONT,
              fontSize: 26,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: C.white,
            }}
          >
            TRIED AI
          </div>
          <Meta size={9} color={C.yellow} style={{ marginTop: 12, letterSpacing: "0.22em" }}>
            THEN THINGS GOT WEIRD
          </Meta>
        </div>
      </AbsoluteFill>

      {/* Top row */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 58 : 74,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: intro,
          zIndex: 8,
        }}
      >
        <Kicker start={b.kicker} color={C.bone} rule={C.yellow}>
          {COPY.hookKicker}
        </Kicker>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.2em",
              color: C.muted,
            }}
          >
            A REAL BUSINESS STORY
          </span>
          <Arches size={wide ? 62 : 56} opacity={0.95} />
        </div>
      </div>

      {/* Headline */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 214 : 330,
          zIndex: 10,
          maxWidth: wide ? 820 : 900,
        }}
      >
        {COPY.hookLines.map((line, index) => (
          <MaskLine
            key={line}
            start={b.headline + index * 0.1}
            duration={0.85}
            style={{ marginTop: index === 0 ? 0 : wide ? -16 : -12 }}
          >
            <Display
              size={wide ? 118 : 112}
              lineHeight={0.88}
              tracking="-0.065em"
              color={line.includes("AI") ? C.yellow : C.white}
              style={{
                textShadow: "0 8px 40px rgba(0,0,0,0.62)",
                opacity: headline,
              }}
            >
              {line}
            </Display>
          </MaskLine>
        ))}
        <Reveal start={b.headline + 0.55} duration={0.65} style={{ marginTop: wide ? 20 : 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 44, height: 2, background: C.red }} />
            <span
              style={{
                fontFamily: MONO,
                fontSize: wide ? 11 : 11,
                letterSpacing: "0.22em",
                color: C.bone,
              }}
            >
              {COPY.hookSub}
            </span>
          </div>
        </Reveal>
      </div>

      {/* The order screen */}
      <div
        style={{
          position: "absolute",
          left: screenX,
          top: screenY,
          zIndex: 14,
          opacity: screenIn,
          transform: `translateX(${(1 - screenIn) * (wide ? 80 : 40)}px) translateY(${(1 - screenIn) * 30}px) rotate(${wide ? 1.2 : -1.2}deg)`,
        }}
      >
        <ScreenFrame
          width={screenWidth}
          accent={C.yellow}
          glow
          style={{ boxShadow: "0 50px 120px rgba(0,0,0,0.72)" }}
        >
          <ScreenHeader
            title="AUTOMATED ORDER TAKER"
            status={t > b.firstItem ? "ORDER FLAGGED" : "LISTENING"}
            warning={t > b.firstItem}
          />
          <ScreenCustomerLine
            t={t}
            text="“A vanilla ice cream, please.”"
            listen={t < b.firstItem}
            compact={!wide}
          />
          <div style={{ padding: "0 12px 4px" }}>
            {items.map((item, index) => (
              <ScreenRow
                key={item.name}
                name={item.name}
                qty={item.qty}
                appear={itemAppear(index)}
                accent={index === 0 ? C.bone : C.redBright}
                compact={!wide}
                shake={index > 0 ? shake : 0}
              />
            ))}
          </div>
          <ScreenError
            text="ORDER MISMATCH · ITEMS NOT REQUESTED"
            appear={progress(t, b.firstItem + 0.8, 0.4)}
          />
          <ScreenFooter label="ITEMS IN ORDER" value={t > b.firstItem ? "16" : "1"} accent={C.redBright} />
        </ScreenFrame>

        <div style={{ marginTop: 10, paddingRight: 4 }}>
          <Meta size={8} color={C.dim}>
            {COPY.reconstruction}
          </Meta>
        </div>
      </div>

      {/* The shout */}
      <div
        style={{
          position: "absolute",
          left: wide ? 1176 : 54,
          top: wide ? 690 : 760,
          zIndex: 20,
          opacity: shout,
          transform: `scale(${0.84 + shout * 0.16 - shake * 0.03}) rotate(${-3 + shake * 1.2}deg)`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.red,
            color: C.yellow,
            padding: wide ? "18px 26px 20px" : "16px 22px 18px",
            borderRadius: 4,
            boxShadow: "0 28px 70px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,199,44,0.25)",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(255,199,44,0.85)",
              marginBottom: 4,
            }}
          >
            CONFIRMED ORDER · 16 ITEMS
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 82 : 76,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              textTransform: "uppercase",
            }}
          >
            {COPY.hookShout}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 46 : 104,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 18,
          zIndex: 18,
          opacity: progress(t, 1.6, 0.7),
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 26, height: 1, background: C.red }} />
          <Meta size={8} color={C.silver}>
            {COPY.sourceFinePrint}
          </Meta>
        </div>
        <Meta size={8} color={C.dim} style={{ textAlign: "right" }}>
          90 SECONDS · 7 ACTS
        </Meta>
      </div>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: flash * 0.18,
          pointerEvents: "none",
          zIndex: 60,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: C.white,
          opacity: introFlash * 0.24,
          pointerEvents: "none",
          zIndex: 60,
        }}
      />
      <Beam start={0.9} duration={2.1} color={C.yellow} opacity={0.1} />
    </AbsoluteFill>
  );
};
