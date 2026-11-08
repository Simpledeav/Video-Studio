import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, useStage } from "../../../config/coinbase";
import {
  BackdropGrid,
  Glow,
  Grain,
  Kicker,
  MaskLine,
  progress,
  useTime,
  Vignette,
} from "../kit";
import { CodeField, PullRequestPanel, ScanLine } from "../instruments";

export const SceneHook: React.FC = () => {
  const { frame, fps } = useTime();
  const { wide, margin, v } = useStage();
  const freeze = 2.15;
  const camera = progress(frame, fps, 2.2, 4.8, (x) => x);
  const headlineSize = v(116, 88);
  const lineSize = v(92, 70);

  return (
    <AbsoluteFill style={{ background: C.black, overflow: "hidden" }}>
      <Glow x="82%" y="12%" size={62} opacity={0.09} />
      <CodeField
        frozenAt={freeze}
        opacity={wide ? 0.11 : 0.14}
        columns={wide ? 7 : 4}
        fontSize={wide ? 14 : 15}
        style={{ top: wide ? -150 : -60 }}
      />
      <BackdropGrid opacity={0.34} size={wide ? 108 : 90} />
      <Vignette strength={0.9} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.035})`,
          transformOrigin: "50% 55%",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 118 : 112,
          }}
        >
          <Kicker start={0.15} color={C.dim}>
            {COPY.hookKicker}
          </Kicker>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 218 : 196,
            width: wide ? 820 : 940,
          }}
        >
          <MaskLine
            start={0.28}
            duration={0.9}
            style={{
              fontFamily: FONT,
              fontSize: headlineSize,
              fontWeight: 700,
              letterSpacing: "-0.055em",
              lineHeight: 0.93,
              color: C.lime,
            }}
          >
            {COPY.hookLines[0]}
          </MaskLine>
          {COPY.hookLines.slice(1).map((line, i) => (
            <MaskLine
              key={line}
              start={0.42 + i * 0.13}
              duration={0.9}
              style={{
                fontFamily: FONT,
                fontSize: lineSize,
                fontWeight: 600,
                letterSpacing: "-0.05em",
                lineHeight: 0.96,
                color: i === 2 ? C.dim : C.white,
              }}
            >
              {line}
            </MaskLine>
          ))}
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: wide ? 610 : 676,
            display: "flex",
            alignItems: "center",
            gap: 13,
            opacity: progress(frame, fps, 1.25, 0.7),
          }}
        >
          <div
            style={{
              width: 42,
              height: 1,
              background: C.lime,
              opacity: 0.8,
            }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: v(13, 12),
              fontWeight: 500,
              letterSpacing: "0.2em",
              color: C.dim,
            }}
          >
            {COPY.hookSub}
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? 1010 : margin,
            top: wide ? 195 : 936,
            width: wide ? 790 : 928,
          }}
        >
          <PullRequestPanel
            start={2.2}
            height={wide ? 540 : 540}
            compact={false}
          />
        </div>

      </div>

      <ScanLine at={2.08} duration={0.55} />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.lime}88, transparent)`,
          opacity: progress(frame, fps, 2.15, 0.2) * 0.5,
        }}
      />
      <Grain />
    </AbsoluteFill>
  );
};
