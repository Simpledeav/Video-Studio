import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/mcdonalds";
import {
  Display,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Meta,
  Photo,
  Reveal,
  Scratches,
  Tag,
  Vignette,
  easeInOut,
  easeOut,
  lerp,
  progress,
  seeded,
  useTime,
} from "../kit";
import {
  CupGlyph,
  ScreenCustomerLine,
  ScreenError,
  ScreenFooter,
  ScreenFrame,
  ScreenHeader,
  ScreenRow,
  Waveform,
} from "../visuals";

const TeaGrid: React.FC<{ t: number; start: number; count: number }> = ({
  t,
  start,
  count,
}) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(9, 1fr)",
      gap: 5,
      padding: "12px 16px 15px",
    }}
  >
    {Array.from({ length: 9 }, (_, index) => {
      const p = progress(t, start + index * 0.075, 0.22, easeOut);
      return (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 30,
            borderRadius: 4,
            border: `1px solid ${index < count ? "rgba(218,26,50,0.42)" : "rgba(247,243,234,0.07)"}`,
            background: index < count ? "rgba(218,26,50,0.12)" : "transparent",
            opacity: 0.25 + p * 0.75,
            transform: `scale(${0.8 + p * 0.2})`,
          }}
        >
          <CupGlyph size={15} color={index < count ? C.redBright : C.dim} />
        </div>
      );
    })}
  </div>
);

const GlitchBars: React.FC<{ t: number }> = ({ t }) => {
  const { width, height } = useStage();
  return (
    <AbsoluteFill style={{ pointerEvents: "none", zIndex: 30, opacity: 0.55 }}>
      {Array.from({ length: 7 }, (_, index) => {
        const seed = seeded(index + 21);
        const active = Math.sin(t * 18 + index * 2.1) > 0.35;
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: `${seed * 50}%`,
              top: `${seeded(index + 8) * 90}%`,
              width: `${18 + seeded(index + 4) * 42}%`,
              height: 2 + Math.floor(seed * 4),
              background: index % 2 === 0 ? C.red : C.yellow,
              opacity: active ? 0.32 : 0.07,
              mixBlendMode: "screen",
              transform: `translateX(${Math.sin(t * 12 + index) * 14}px)`,
            }}
          />
        );
      })}
      <div style={{ width, height, position: "absolute" }} />
    </AbsoluteFill>
  );
};

export const SceneChaos: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.chaos;

  const screenIn = progress(t, b.tea, 0.6, easeOut);
  const multiply = progress(t, b.multiply, 1.35, easeInOut);
  const teaCount = Math.max(1, Math.round(lerp(1, 9, multiply)));
  const shout = progress(t, b.shout, 0.34, easeOut);
  const receiptIn = progress(t, b.receipt, 0.55, easeOut);
  const teaOut = 1 - progress(t, b.receipt - 0.25, 0.4, easeInOut);
  const shake = t > b.shout ? Math.max(0, Math.sin((t - b.shout) * 44) * (1 - progress(t, b.shout, 0.4))) : 0;

  const screenW = wide ? 650 : 640;
  const screenLeft = wide ? stage.margin : stage.margin + 4;
  const screenTop = wide ? 190 : 470;

  return (
    <AbsoluteFill style={{ backgroundColor: "#080506", overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 42%, rgba(218,26,50,0.16) 0%, transparent 55%), linear-gradient(180deg, #0B0607 0%, #050506 70%)",
        }}
      />
      <Glow x="18%" y="18%" color={C.red} opacity={0.16} size={58} />
      <Glow x="86%" y="72%" color={C.yellow} opacity={0.07} size={50} />
      <Vignette strength={1.05} />
      <Scratches opacity={0.55} />
      <Grain opacity={0.065} />
      <GlitchBars t={t} />

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 58 : 72,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 10,
        }}
      >
        <Kicker start={b.title} color={C.bone} rule={C.red}>
          {COPY.chaosKicker}
        </Kicker>
        <Tag
          color={C.redBright}
          background={C.redSoft}
          border="rgba(218,26,50,0.45)"
          style={{ fontSize: 8, padding: "5px 8px" }}
        >
          ERROR
        </Tag>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 900 : stage.margin,
          top: wide ? 150 : 180,
          zIndex: 12,
          maxWidth: wide ? 860 : 900,
        }}
      >
        {COPY.chaosTitle.map((line, index) => (
          <MaskLine
            key={line}
            start={b.title + index * 0.09}
            duration={0.78}
            style={{ marginTop: index === 0 ? 0 : -10 }}
          >
            <Display
              size={wide ? 104 : 78}
              lineHeight={0.9}
              tracking="-0.06em"
              color={index === 0 ? C.white : C.redBright}
              style={{ textShadow: "0 10px 40px rgba(0,0,0,0.7)" }}
            >
              {line}
            </Display>
          </MaskLine>
        ))}
        <Reveal start={b.title + 0.5} duration={0.6} style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 2, background: C.red }} />
            <Meta size={9} color={C.silver}>
              CUSTOMER-REPORTED ORDER ERRORS
            </Meta>
          </div>
        </Reveal>
      </div>

      {/* Screen stack */}
      <div
        style={{
          position: "absolute",
          left: screenLeft,
          top: wide ? screenTop : screenTop,
          width: screenW,
          height: wide ? 720 : 650,
          zIndex: 16,
          opacity: screenIn,
          transform: `translateY(${(1 - screenIn) * 28}px)`,
        }}
      >
        {/* Tea screen */}
        <div style={{ position: "absolute", inset: 0, opacity: teaOut }}>
          <ScreenFrame width={screenW} accent={C.redBright} glow>
            <ScreenHeader
              title="AUTOMATED ORDER TAKER"
              status={multiply > 0.1 ? "QUANTITY FLAGGED" : "LISTENING"}
              warning={multiply > 0.1}
            />
            <ScreenCustomerLine
              t={t}
              text="“Just a sweet tea, please.”"
              listen={t < b.multiply}
              compact={!wide}
              color={C.redBright}
            />
            <div style={{ padding: "0 12px 4px" }}>
              <ScreenRow
                name="SWEET TEA"
                qty={`× ${teaCount}`}
                appear={progress(t, b.tea + 0.35, 0.3)}
                accent={C.redBright}
                compact={!wide}
                shake={multiply > 0.15 ? 0.5 : 0}
              />
              <ScreenRow
                name="BUTTER"
                qty="× 2"
                appear={progress(t, b.multiply + 0.8, 0.3)}
                accent={C.red}
                compact={!wide}
              />
              <ScreenRow
                name="KETCHUP"
                qty="× 4"
                appear={progress(t, b.multiply + 1.0, 0.3)}
                accent={C.red}
                compact={!wide}
              />
            </div>
            <TeaGrid t={t} start={b.multiply} count={teaCount} />
            <ScreenError
              text="QUANTITY MISMATCH · CUSTOMER ASKED FOR ONE"
              appear={progress(t, b.multiply + 0.35, 0.35)}
            />
            <ScreenFooter label="SWEET TEAS" value={`${teaCount}`} accent={C.redBright} />
          </ScreenFrame>
        </div>

        {/* Receipt screen */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: receiptIn,
            transform: `translateY(${(1 - receiptIn) * 26}px)`,
          }}
        >
          <ScreenFrame width={screenW} accent={C.red} glow>
            <ScreenHeader title="RECEIPT · AS REPORTED" status="UNEXPECTED ITEMS" warning />
            <ScreenCustomerLine
              t={t}
              text="“Water and a vanilla ice cream, please.”"
              listen={false}
              compact={!wide}
              color={C.redBright}
            />
            <div style={{ padding: "0 12px 4px" }}>
              {COPY.chaosReceipt.map((item, index) => (
                <ScreenRow
                  key={item.name}
                  name={item.name}
                  qty={item.qty}
                  appear={progress(t, b.receipt + 0.2 + index * 0.18, 0.3)}
                  accent={index < 2 ? C.bone : C.redBright}
                  compact={!wide}
                />
              ))}
            </div>
            <div style={{ padding: "10px 16px 4px" }}>
              <Waveform t={t} active={false} color={C.red} width={wide ? 260 : 220} height={20} bars={22} idle={0.12} />
            </div>
            <ScreenFooter label="ITEMS ADDED BY AI" value="+6" accent={C.redBright} />
          </ScreenFrame>
          <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", gap: 10 }}>
            <Meta size={8} color={C.dim}>
              {COPY.reconstruction}
            </Meta>
            <Meta size={8} color={C.red}>
              CBS NEWS · CUSTOMER VIDEO
            </Meta>
          </div>
        </div>
      </div>

      {/* The sweet tea photo */}
      <div
        style={{
          position: "absolute",
          right: wide ? 96 : 34,
          top: wide ? 470 : 1040,
          width: wide ? 300 : 280,
          height: wide ? 420 : 380,
          zIndex: 14,
          opacity: progress(t, b.tea + 0.2, 0.6),
          transform: `rotate(${wide ? 3 : -4}deg) translateY(${shake * 4}px)`,
          border: `1px solid rgba(255,199,44,0.4)`,
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          overflow: "hidden",
        }}
      >
        <Photo
          src={IMG.sweetTea}
          objectPosition="50% 46%"
          brightness={0.72}
          contrast={1.06}
          saturation={0.85}
          style={{ width: "100%", height: "100%" }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "8px 10px",
            background: "linear-gradient(180deg, transparent, rgba(4,4,5,0.9))",
            fontFamily: MONO,
            fontSize: 8,
            letterSpacing: "0.14em",
            color: C.bone,
          }}
        >
          ONE CUP · ONE ORDER
        </div>
      </div>

      {/* Sticker */}
      <div
        style={{
          position: "absolute",
          left: wide ? 760 : 40,
          top: wide ? 740 : 1040,
          zIndex: 22,
          opacity: shout * (1 - progress(t, b.receipt - 0.4, 0.4, easeInOut)),
          transform: `scale(${0.82 + shout * 0.18 - shake * 0.04}) rotate(${2.4 + shake * 1.4}deg)`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: C.yellow,
            color: C.black,
            padding: wide ? "16px 24px 18px" : "14px 18px 16px",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.2em",
              color: "rgba(5,5,6,0.62)",
              marginBottom: 3,
            }}
          >
            ONE ORDER · NINE CUPS
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 76 : 62,
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

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 44 : 88,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 12,
          opacity: progress(t, 1.2, 0.7),
        }}
      >
        <Meta size={8} color={C.dim}>
          {COPY.sourceFinePrint}
        </Meta>
        <Tag
          color={C.silver}
          background="rgba(247,243,234,0.04)"
          border={C.line}
          style={{ fontSize: 8, padding: "6px 9px" }}
        >
          ACT 03 · OFF SCRIPT
        </Tag>
      </div>
    </AbsoluteFill>
  );
};
