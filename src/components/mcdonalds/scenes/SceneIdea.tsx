import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, useStage } from "../../../config/mcdonalds";
import {
  Beam,
  Display,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  Meta,
  Photo,
  Reveal,
  Rule,
  Scratches,
  Tag,
  Vignette,
  easeOut,
  progress,
  useTime,
} from "../kit";
import {
  Arches,
  FlowDiagram,
  IBMWordmark,
  LocationDots,
  McDonaldsWordmark,
} from "../visuals";

export const SceneIdea: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const b = BEATS.idea;

  const photoIn = progress(t, 0.05, 1.1, easeOut);
  const push = progress(t, 0, 15.3, easeOut);
  const partner = progress(t, b.partner, 0.7);
  const locations = progress(t, b.locations, 0.8);

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      {/* Photographic left / top plate */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: wide ? "48%" : "100%",
          height: wide ? "100%" : 720,
          overflow: "hidden",
          opacity: photoIn,
        }}
      >
        <Photo
          src={IMG.storeNight}
          objectPosition={wide ? "48% 50%" : "50% 44%"}
          brightness={0.52}
          contrast={1.12}
          saturation={0.82}
          style={{
            width: "100%",
            height: "100%",
            transform: `scale(${1.04 + push * 0.07})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: wide
              ? "linear-gradient(180deg, rgba(4,4,5,0.62) 0%, transparent 35%, rgba(4,4,5,0.88) 100%), linear-gradient(90deg, transparent 60%, rgba(4,4,5,0.98) 100%)"
              : "linear-gradient(180deg, rgba(4,4,5,0.55) 0%, transparent 34%, rgba(5,5,6,0.92) 100%)",
          }}
        />
      </div>

      <Glow x={wide ? "24%" : "50%"} y={wide ? "52%" : "28%"} color={C.yellow} opacity={0.09} size={50} />
      <Vignette strength={1.02} />
      <Scratches opacity={0.4} />
      <Grain opacity={0.055} />

      {/* Kicker */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 58 : 72,
          zIndex: 8,
        }}
      >
        <Kicker start={b.title} color={C.bone} rule={C.yellow}>
          {COPY.ideaKicker}
        </Kicker>
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 196 : 430,
          zIndex: 9,
          maxWidth: wide ? 760 : 880,
        }}
      >
        {COPY.ideaTitle.map((line, index) => (
          <MaskLine
            key={line}
            start={b.title + index * 0.1}
            duration={0.8}
            style={{ marginTop: index === 0 ? 0 : -12 }}
          >
            <Display
              size={wide ? 104 : 96}
              lineHeight={0.88}
              tracking="-0.06em"
              color={index === 1 ? C.yellow : C.white}
            >
              {line}
            </Display>
          </MaskLine>
        ))}
        <Reveal start={b.title + 0.5} duration={0.6} style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 1, background: C.red }} />
            <Meta size={9} color={C.silver}>
              VOICE ORDERING · DRIVE-THRU
            </Meta>
          </div>
        </Reveal>
      </div>

      {/* Partner / number panel */}
      <div
        style={{
          position: "absolute",
          left: wide ? "52%" : stage.margin,
          right: stage.margin,
          top: wide ? 140 : 760,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: wide ? 20 : 16,
            opacity: partner,
            transform: `translateY(${(1 - partner) * 12}px)`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Arches size={wide ? 46 : 40} />
            <McDonaldsWordmark size={wide ? 27 : 23} />
          </div>
          <span
            style={{
              fontFamily: FONT,
              fontSize: wide ? 22 : 18,
              color: C.yellow,
              fontWeight: 300,
            }}
          >
            ×
          </span>
          <IBMWordmark width={wide ? 96 : 82} opacity={0.95} />
        </div>

        <div style={{ height: wide ? 40 : 30 }} />

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: wide ? 40 : 24,
          }}
        >
          <div style={{ opacity: locations }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 64 : 58,
                fontWeight: 700,
                letterSpacing: "-0.06em",
                lineHeight: 0.9,
                color: C.white,
              }}
            >
              2021
            </div>
            <Meta size={9} color={C.muted} style={{ marginTop: 6 }}>
              THE TEST BEGINS
            </Meta>
          </div>
          <div style={{ width: 1, alignSelf: "stretch", background: C.line }} />
          <div style={{ opacity: locations }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 86 : 76,
                fontWeight: 800,
                letterSpacing: "-0.07em",
                lineHeight: 0.82,
                color: C.yellow,
              }}
            >
              {COPY.ideaLocations}
            </div>
            <Meta size={9} color={C.bone} style={{ marginTop: 8 }}>
              {COPY.ideaLocationsLabel}
            </Meta>
          </div>
        </div>

        <div style={{ marginTop: wide ? 26 : 20 }}>
          <LocationDots
            t={t}
            start={b.locations + 0.2}
            count={100}
            columns={wide ? 20 : 14}
            wide={wide}
            color={C.yellow}
            dot={wide ? 5 : 5}
            gap={wide ? 7 : 6}
          />
        </div>
      </div>

      {/* Flow */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 600 : 1120,
          zIndex: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <Rule color={C.line} style={{ flex: 1 }} />
          <Meta size={8} color={C.muted}>
            HOW IT WAS SUPPOSED TO WORK
          </Meta>
          <Rule color={C.line} style={{ flex: 1 }} />
        </div>
        <FlowDiagram
          t={t}
          start={b.flow}
          labels={COPY.ideaFlow}
          wide={wide}
          color={C.yellow}
        />
      </div>

      {/* Benefit chips */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          top: wide ? 878 : 1430,
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          zIndex: 12,
        }}
      >
        {COPY.ideaBenefit.map((label, index) => (
          <Reveal key={label} start={b.benefit + index * 0.16} duration={0.55}>
            <Tag
              color={index === 0 ? C.black : C.blue}
              background={index === 0 ? C.yellow : C.blueSoft}
              border={index === 0 ? C.yellow : "rgba(61,116,255,0.35)"}
              style={{ fontSize: 10, padding: "10px 14px" }}
            >
              {index === 0 ? "01" : "02"} · {label}
            </Tag>
          </Reveal>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 44 : 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 8,
          opacity: progress(t, 2.2, 0.8),
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
          ACT 02 · THE IDEA
        </Tag>
      </div>

      <Beam start={b.locations} duration={2.2} color={C.yellow} opacity={0.09} />
    </AbsoluteFill>
  );
};
