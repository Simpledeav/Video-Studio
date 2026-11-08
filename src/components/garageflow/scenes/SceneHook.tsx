import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import {
  Kicker,
  MaskLine,
  Mono,
  Photo,
  progress,
  Reveal,
  Tag,
  useTime,
  Vignette,
  Grain,
} from "../kit";

const CALLS = [
  { time: "09:12", note: "No answer" },
  { time: "10:04", note: "Ringing out" },
  { time: "11:26", note: "No answer" },
  { time: "13:41", note: "Left a message" },
  { time: "15:08", note: "Still waiting" },
];

export const SceneHook: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const callsIn = progress(t, BEATS.hook.calls, 0.55);
  const questionIn = progress(t, BEATS.hook.question, 0.7);
  const headlineOut = 1 - progress(t, BEATS.hook.question - 0.25, 0.45) * 0.82;

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Photo
        src="lift-wide.jpg"
        position={wide ? "58% 50%" : "60% 44%"}
        brightness={wide ? 0.62 : 0.55}
        saturation={0.6}
      />
      <AbsoluteFill
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(4,7,12,0.97) 0%, rgba(4,7,12,0.88) 34%, rgba(4,7,12,0.4) 62%, rgba(4,7,12,0.12) 100%)"
            : "linear-gradient(180deg, rgba(4,7,12,0.52) 0%, rgba(4,7,12,0.24) 28%, rgba(4,7,12,0.86) 58%, rgba(4,7,12,0.98) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? undefined : 70,
          top: wide ? 76 : 116,
          width: wide ? 760 : undefined,
          opacity: headlineOut,
        }}
      >
        <Kicker start={0.12}>{COPY.hook.kicker}</Kicker>

        <MaskLine start={BEATS.hook.line} duration={0.8} style={{ marginTop: wide ? 36 : 30 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 58 : 46,
              fontWeight: 500,
              letterSpacing: "-0.035em",
              lineHeight: 1.02,
              color: C.silver,
            }}
          >
            {COPY.hook.line1}
          </div>
        </MaskLine>
        <MaskLine start={BEATS.hook.line + 0.16} duration={0.8}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: wide ? 96 : 82,
              fontWeight: 700,
              letterSpacing: "-0.055em",
              lineHeight: 0.94,
              color: C.white,
            }}
          >
            {COPY.hook.line2}
          </div>
        </MaskLine>

        {wide ? (
          <Reveal start={BEATS.hook.line + 0.55} y={12} style={{ marginTop: 22, display: "flex", gap: 8 }}>
            <Tag color={C.blueBright} background={C.blueSoft} border="rgba(92,157,255,0.3)">
              THE CUSTOMER IS WAITING
            </Tag>
          </Reveal>
        ) : null}
      </div>

      {wide ? (
        <div
          style={{
            position: "absolute",
            right: 112,
            top: 210,
            width: 486,
            opacity: callsIn,
            transform: `translateY(${(1 - callsIn) * 26}px)`,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              background: "rgba(7, 12, 20, 0.78)",
              border: `1px solid ${C.line}`,
              backdropFilter: "blur(14px)",
              boxShadow: "0 34px 90px rgba(0,0,0,0.52)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "15px 17px 13px",
                borderBottom: `1px solid ${C.lineSoft}`,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: C.muted }}>
                  CALL LOG · TODAY
                </span>
                <span style={{ marginTop: 4, fontFamily: FONT, fontSize: 19, fontWeight: 700, color: C.white }}>
                  Five missed calls
                </span>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <Tag color={C.amber} background={C.amberSoft} border={`${C.amber}44`}>
                  0 ANSWERS
                </Tag>
              </div>
            </div>
            {CALLS.map((call, index) => {
              const p = progress(t, BEATS.hook.calls + index * BEATS.hook.callStep, 0.38);
              return (
                <div
                  key={call.time}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "12px 17px",
                    borderBottom: index === CALLS.length - 1 ? "none" : `1px solid ${C.lineSoft}`,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 18}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: "50%",
                      background: "rgba(232,169,79,0.12)",
                      border: `1px solid ${C.amber}33`,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: FONT,
                      fontSize: 12,
                      color: C.amber,
                    }}
                  >
                    ↙
                  </span>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 600, color: C.white }}>
                      Manchester Auto
                    </div>
                    <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 9.5, color: C.muted }}>{call.note}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 10, color: C.silver }}>
                    {call.time}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ width: 30, height: 1, background: C.blue }} />
            <Mono size={9.5} color={C.blueBright}>
              {COPY.hook.callsSub}
            </Mono>
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: 70,
            right: 70,
            top: 1010,
            opacity: callsIn,
            transform: `translateY(${(1 - callsIn) * 30}px)`,
          }}
        >
          <div
            style={{
              borderRadius: 12,
              background: "rgba(7, 12, 20, 0.82)",
              border: `1px solid ${C.line}`,
              backdropFilter: "blur(14px)",
              boxShadow: "0 34px 90px rgba(0,0,0,0.52)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "14px 16px 12px", borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center" }}>
              <div>
                <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.18em", color: C.muted }}>
                  CALL LOG · TODAY
                </span>
                <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 18, fontWeight: 700, color: C.white }}>
                  Five missed calls
                </div>
              </div>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 9, color: C.amber }}>0 ANSWERS</span>
            </div>
            {CALLS.map((call, index) => {
              const p = progress(t, BEATS.hook.calls + index * BEATS.hook.callStep, 0.38);
              return (
                <div
                  key={call.time}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 11,
                    padding: "11px 16px",
                    borderBottom: index === CALLS.length - 1 ? "none" : `1px solid ${C.lineSoft}`,
                    opacity: p,
                    transform: `translateX(${(1 - p) * 18}px)`,
                  }}
                >
                  <span
                    style={{
                      width: 25,
                      height: 25,
                      borderRadius: "50%",
                      background: "rgba(232,169,79,0.12)",
                      border: `1px solid ${C.amber}33`,
                      display: "grid",
                      placeItems: "center",
                      fontFamily: FONT,
                      fontSize: 12,
                      color: C.amber,
                    }}
                  >
                    ↙
                  </span>
                  <div>
                    <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600, color: C.white }}>Manchester Auto</div>
                    <div style={{ marginTop: 1, fontFamily: FONT, fontSize: 9.2, color: C.muted }}>{call.note}</div>
                  </div>
                  <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 9.6, color: C.silver }}>{call.time}</span>
                </div>
              );
            })}
          </div>
          <div style={{ marginTop: 14, textAlign: "center" }}>
            <Mono size={9.5} color={C.blueBright}>
              {COPY.hook.callsSub}
            </Mono>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          left: wide ? 108 : 70,
          right: wide ? 480 : 70,
          top: wide ? 430 : 1200,
          opacity: questionIn,
          transform: `translateY(${(1 - questionIn) * 24}px)`,
        }}
      >
        <div
          style={{
            fontFamily: FONT,
            fontSize: wide ? 84 : 66,
            fontWeight: 700,
            letterSpacing: "-0.055em",
            lineHeight: 0.98,
            color: C.white,
          }}
        >
          {COPY.hook.question1}
          <br />
          <span style={{ color: C.blueBright }}>{COPY.hook.question2}</span>
        </div>
        <div style={{ marginTop: wide ? 22 : 18, display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 34, height: 1, background: C.blue }} />
          <Mono size={wide ? 10 : 9} color={C.silver} style={{ letterSpacing: "0.16em" }}>
            THE WORKSHOP IS STILL DOING GREAT WORK.
          </Mono>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: wide ? 108 : 70,
          bottom: wide ? 42 : 110,
          fontFamily: MONO,
          fontSize: wide ? 9 : 8,
          letterSpacing: "0.12em",
          color: "rgba(182,194,209,0.42)",
          textAlign: "right",
        }}
      >
        WORKSHOP PHOTOGRAPHY: SHIXART1985 · CC BY 2.0
      </div>

      <Vignette strength={wide ? 0.8 : 0.95} />
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
