import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, MONO, useStage } from "../../../config/replit";
import {
  Beam,
  Divider,
  easeIn,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { DatabaseDashboard, DataRain } from "../visuals";

export const SceneData: React.FC = () => {
  const { frame, fps } = useTime();
  const { margin, v } = useStage();
  const camera = progress(frame, fps, 0, 8, (x) => x);
  const sceneOut = 1 - progress(frame, fps, 7.7, 0.34, easeIn);
  const scan = progress(frame, fps, 2.8, 2.6, (x) => x);

  return (
    <AbsoluteFill style={{ background: C.graphite, overflow: "hidden" }}>
      <Glow x="26%" y="14%" size={58} opacity={0.11} color={C.cyan} />
      <Glow x="84%" y="66%" size={56} opacity={0.06} color={C.blue} />
      <DataRain opacity={0.05} columns={5} color={C.cyan} start={1.6} speed={0.8} />
      <GridField opacity={0.24} size={84} />

      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `scale(${1 + camera * 0.022})`,
          transformOrigin: "50% 54%",
          opacity: sceneOut,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: margin,
            top: 100,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <Kicker start={0.1} color={C.silver} rule={C.cyan}>
            {COPY.dataKicker}
          </Kicker>
          <Tag color={C.orange} background={C.orangeSoft} style={{ fontSize: 8 }}>
            REPORTED
          </Tag>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 188,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: 430 }}>
            <MaskLine
              start={0.4}
              duration={0.75}
              style={{
                fontFamily: FONT,
                fontSize: v(132),
                fontWeight: 700,
                letterSpacing: "-0.075em",
                lineHeight: 0.82,
                color: C.white,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              1,206
            </MaskLine>
            <div
              style={{
                marginTop: 14,
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: "0.24em",
                color: C.cyan,
              }}
            >
              {COPY.dataExecLabel}
            </div>
          </div>

          <div
            style={{
              width: 1,
              height: 172,
              background: C.line,
              marginTop: 8,
            }}
          />

          <div style={{ width: 430, textAlign: "right" }}>
            <MaskLine
              start={0.58}
              duration={0.75}
              style={{
                fontFamily: FONT,
                fontSize: v(126),
                fontWeight: 700,
                letterSpacing: "-0.075em",
                lineHeight: 0.82,
                color: C.white,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              1,196<span style={{ color: C.cyan }}>+</span>
            </MaskLine>
            <div
              style={{
                marginTop: 14,
                fontFamily: MONO,
                fontSize: 13,
                letterSpacing: "0.24em",
                color: C.cyan,
              }}
            >
              {COPY.dataCompLabel}
            </div>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 438,
            display: "flex",
            alignItems: "center",
            gap: 12,
            opacity: progress(frame, fps, 1.6, 0.7),
          }}
        >
          <Divider color={`${C.cyan}55`} style={{ flex: 1 }} />
          <Mono size={9} color={C.dim} style={{ letterSpacing: "0.18em" }}>
            BUSINESS CONTACT RECORDS
          </Mono>
          <Divider color={`${C.cyan}55`} style={{ flex: 1 }} />
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 512,
            width: 928,
            height: 846,
          }}
        >
          <DatabaseDashboard
            start={1.0}
            width={928}
            height={846}
            accent={C.cyan}
            title="PRODUCTION / CONTACTS"
          />
          <div
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              top: 232 + scan * 500,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${C.cyan}, transparent)`,
              opacity: 0.35 * (scan > 0 && scan < 1 ? 1 : 0),
              boxShadow: `0 0 18px ${C.cyanSoft}`,
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 18,
              top: 16,
            }}
          >
            <Tag color={C.cyan} background={C.cyanSoft} style={{ fontSize: 8 }}>
              1,206 ROWS
            </Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            top: 1436,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            opacity: progress(frame, fps, 3.2, 0.7),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: C.cyan,
                boxShadow: `0 0 14px ${C.cyan}`,
              }}
            />
            <Mono size={9} color={C.cyan} style={{ letterSpacing: "0.16em" }}>
              EXECUTIVE RECORDS
            </Mono>
          </div>
          <Mono size={9} color={C.mute} style={{ letterSpacing: "0.16em" }}>
            ORGANIZATIONS LINKED
          </Mono>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            top: 1510,
            width: 880,
            opacity: progress(frame, fps, 5.2, 0.8) * 0.9,
          }}
        >
          <div
            style={{
              fontFamily: FONT,
              fontSize: v(19),
              fontWeight: 500,
              letterSpacing: "0.06em",
              lineHeight: 1.6,
              color: C.dim,
            }}
          >
            Names and companies are withheld. The scale is the story.
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: margin,
            right: margin,
            bottom: 130,
            height: 32,
            overflow: "hidden",
            borderTop: `1px solid ${C.lineSoft}`,
            paddingTop: 12,
            opacity: 0.55,
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 26,
              transform: `translateX(${-((frame / fps) * 44) % 700}px)`,
              whiteSpace: "nowrap",
            }}
          >
            {new Array(10).fill(0).map((_, i) => (
              <span
                key={i}
                style={{
                  fontFamily: MONO,
                  fontSize: 9,
                  letterSpacing: "0.14em",
                  color: i % 3 === 0 ? C.cyan : C.mute,
                }}
              >
                EXEC-{String(1040 + i * 17).padStart(4, "0")} · VP · ORG-
                {String(220 + i * 31).padStart(3, "0")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <Beam start={5.5} duration={1.6} color={C.cyan} opacity={0.08} />
      <Scanlines opacity={0.04} spacing={5} />
      <Vignette strength={0.94} />
      <Grain opacity={0.055} />
    </AbsoluteFill>
  );
};
