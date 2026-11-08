import { AbsoluteFill } from "remotion";
import { BEATS, C, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  BrandMark,
  Can,
  Display,
  Glow,
  Kicker,
  MaskLine,
  SkullEmblem,
  Sweep,
  WaterDrop,
  clamp,
  easeInOut,
  easeOut,
  progress,
  seeded,
  useTime,
} from "../kit";

export const Scene08Finale: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const canIn = progress(t, BEATS.finale.can, 1.4, easeOut);
  const skullIn = progress(t, BEATS.finale.skull, 1.1, easeOut);
  const sweep = progress(t, 1.4, 3.6, easeInOut);
  const float = Math.sin(t * 0.7) * 4;
  const lineSize = wide ? 66 : 46;

  return (
    <Backdrop glowX="58%" glowY="46%" glowOpacity={0.18}>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 58% 46%, rgba(210,31,53,0.08) 0%, transparent 46%)",
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: wide ? "66%" : "50%",
          top: wide ? "50%" : "42%",
          transform: "translate(-50%, -50%)",
          opacity: 0.42 * skullIn,
          zIndex: 2,
        }}
      >
        <SkullEmblem size={wide ? 860 : 760} color="#CFC8BA" glow={1.2} />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "66%" : "50%",
          top: wide ? "50%" : "43%",
          transform: `translate(-50%, -50%) translateY(${float}px) scale(${0.9 + canIn * 0.1})`,
          opacity: clamp(canIn * 1.2),
          zIndex: 6,
        }}
      >
        <Can
          src={IMG.sparkling}
          height={wide ? 790 : 660}
          rotateY={-8 + canIn * 14}
          sweep={sweep}
          droplets={1.2}
          glow={C.red}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 210 : 250,
          zIndex: 8,
          textAlign: wide ? "left" : "center",
          right: wide ? "46%" : stage.margin,
        }}
      >
        <Kicker start={0.6} style={{ justifyContent: wide ? "flex-start" : "center" }}>
          ONE LAST THING
        </Kicker>
        <div style={{ height: wide ? 26 : 18 }} />
        <MaskLine start={BEATS.finale.line1} duration={0.8}>
          <Display size={lineSize} color={C.silver} weight={600} style={{ lineHeight: 1.02 }}>
            DON&apos;T JUST SELL
          </Display>
        </MaskLine>
        <MaskLine start={BEATS.finale.line1 + 0.12} duration={0.8}>
          <Display size={lineSize} color={C.silver} weight={600} style={{ lineHeight: 1.02 }}>
            A PRODUCT.
          </Display>
        </MaskLine>
        <div style={{ height: wide ? 26 : 16 }} />
        <MaskLine start={BEATS.finale.line2} duration={0.85}>
          <Display size={wide ? 78 : 54} accent style={{ lineHeight: 0.98 }}>
            BUILD A BRAND
          </Display>
        </MaskLine>
        <MaskLine start={BEATS.finale.line2 + 0.13} duration={0.85}>
          <Display size={wide ? 78 : 54} accent style={{ lineHeight: 0.98 }}>
            PEOPLE REMEMBER.
          </Display>
        </MaskLine>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 46 : 180,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 9,
          opacity: progress(t, 2.8, 0.8),
        }}
      >
        <BrandMark width={wide ? 230 : 190} opacity={0.9} />
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.dim }}>
          LIQUID DEATH · THE BRAND CASE
        </span>
      </div>

      {Array.from({ length: 12 }, (_, index) => (
        <WaterDrop
          key={index}
          size={3 + seeded(index + 2) * 5}
          opacity={0.12 + seeded(index + 19) * 0.28}
          style={{
            position: "absolute",
            left: `${8 + seeded(index + 7) * 84}%`,
            top: `${10 + ((t * 5 + seeded(index + 31) * 100) % 86)}%`,
            zIndex: 4,
          }}
        />
      ))}

      <Sweep start={1.2} duration={2.8} opacity={0.14} />
      <Glow x="66%" y="72%" size={42} color={C.red} opacity={0.1} zIndex={5} />
    </Backdrop>
  );
};
