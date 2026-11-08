import type { ReactNode } from "react";
import { AbsoluteFill, Img, staticFile } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/liquidDeath";
import {
  Backdrop,
  Can,
  Headline,
  Kicker,
  Reveal,
  SkullEmblem,
  Tag,
  UtilityNote,
  clamp,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const file = (path: string) => staticFile(path.replace(/^\//, ""));

const BrowserChrome: React.FC<{ children: ReactNode; width: number; height: number }> = ({
  children,
  width,
  height,
}) => (
  <div
    style={{
      width,
      height,
      background: "linear-gradient(180deg, #15171A, #0B0C0E)",
      border: `1px solid ${C.line}`,
      boxShadow: "0 40px 90px rgba(0,0,0,0.62)",
      overflow: "hidden",
      position: "relative",
    }}
  >
    <div
      style={{
        height: 38,
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "0 14px",
        borderBottom: `1px solid ${C.lineSoft}`,
        background: "rgba(255,255,255,0.02)",
      }}
    >
      {["#5C6066", "#5C6066", "#5C6066"].map((color, index) => (
        <span key={index} style={{ width: 7, height: 7, borderRadius: "50%", background: color }} />
      ))}
      <div
        style={{
          marginLeft: 14,
          flex: 1,
          height: 20,
          border: `1px solid ${C.lineSoft}`,
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          fontFamily: MONO,
          fontSize: 8.5,
          letterSpacing: "0.1em",
          color: C.dim,
        }}
      >
        social / liquid-death / launch-film
      </div>
      <span style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.16em", color: C.redBright }}>
        RECONSTRUCTION
      </span>
    </div>
    {children}
  </div>
);

const Avatar: React.FC<{ size: number }> = ({ size }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#0A0A0B",
      border: `1px solid ${C.line}`,
      display: "grid",
      placeItems: "center",
      overflow: "hidden",
      flexShrink: 0,
    }}
  >
    <SkullEmblem size={size * 0.92} color="#D4CFC3" opacity={0.9} glow={0.2} />
  </div>
);

const ViewsGraph: React.FC<{ start: number; width: number; height: number }> = ({
  start,
  width,
  height,
}) => {
  const { t } = useTime();
  const count = 18;
  return (
    <div style={{ width, height, position: "relative" }}>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 1, background: C.line }} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 5, height: "100%" }}>
        {Array.from({ length: count }, (_, index) => {
          const p = progress(t, start + index * 0.075, 0.6, easeOut);
          const target = 0.12 + Math.pow(index / (count - 1), 1.8) * 0.82;
          const wobble = 1 + Math.sin(t * 2.2 + index) * 0.02;
          return (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${target * p * 100 * wobble}%`,
                background:
                  index > count - 5
                    ? `linear-gradient(180deg, ${C.redBright}, ${C.red})`
                    : `linear-gradient(180deg, ${C.silver}, ${C.dim})`,
                opacity: 0.35 + (index / count) * 0.65,
                minHeight: 2,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

const PostWindow: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const forW = wide ? 760 : 930;
  const forH = wide ? 700 : 990;
  const play = progress(t, BEATS.attention.video, 0.5, easeOut);
  const watch = progress(t, 3.1, 0.7, easeOut);
  const comments = progress(t, 3.7, 0.7, easeOut);
  return (
    <BrowserChrome width={forW} height={forH}>
      <div style={{ padding: wide ? "18px 20px 0" : "20px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Avatar size={wide ? 42 : 46} />
          <div>
            <div style={{ fontFamily: FONT, fontSize: wide ? 15 : 17, fontWeight: 700, color: C.white, letterSpacing: "0.04em" }}>
              LIQUID DEATH
            </div>
            <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.14em", color: C.muted }}>
              @LIQUIDDEATH · BRAND FILM
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <Tag color={C.white} background="rgba(255,255,255,0.06)" style={{ fontSize: 8.5 }}>
              FOLLOW
            </Tag>
          </div>
        </div>
        <div
          style={{
            marginTop: 15,
            fontFamily: FONT,
            fontSize: wide ? 17 : 19,
            lineHeight: 1.45,
            color: C.silver,
            letterSpacing: "-0.01em",
          }}
        >
          Don&apos;t drink water. <span style={{ color: C.white, fontWeight: 600 }}>Murder your thirst.</span>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          margin: wide ? "14px 20px 0" : "16px 22px 0",
          height: wide ? 286 : 430,
          overflow: "hidden",
          border: `1px solid ${C.lineSoft}`,
          background: "#060607",
        }}
      >
        <Img
          src={file(IMG.campaign)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "58% 50%",
            filter: "brightness(0.72) contrast(1.08) saturate(0.9)",
            transform: `scale(${1.02 + play * 0.03})`,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(5,5,6,0.16), transparent 30%, rgba(5,5,6,0.72) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${0.84 + play * 0.16})`,
            width: wide ? 66 : 74,
            height: wide ? 66 : 74,
            borderRadius: "50%",
            border: "1.5px solid rgba(255,255,255,0.8)",
            background: "rgba(8,8,9,0.5)",
            display: "grid",
            placeItems: "center",
            opacity: 0.92,
            boxShadow: "0 12px 34px rgba(0,0,0,0.4)",
          }}
        >
          <div
            style={{
              width: 0,
              height: 0,
              borderTop: `${wide ? 10 : 12}px solid transparent`,
              borderBottom: `${wide ? 10 : 12}px solid transparent`,
              borderLeft: `${wide ? 17 : 19}px solid #FFFFFF`,
              marginLeft: 4,
            }}
          />
        </div>
        <div
          style={{
            position: "absolute",
            left: 14,
            bottom: 12,
            right: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontFamily: MONO,
            fontSize: 8.5,
            letterSpacing: "0.16em",
            color: "rgba(255,255,255,0.78)",
          }}
        >
          <span>LAUNCH FILM</span>
          <span>00:42</span>
        </div>
        {watch > 0 ? (
          <div
            style={{
              position: "absolute",
              left: 14,
              top: 12,
              opacity: watch,
              transform: `translateY(${(1 - watch) * -6}px)`,
            }}
          >
            <Tag color={C.white} background="rgba(210,31,53,0.9)" border="transparent" style={{ fontSize: 8.5 }}>
              MILLIONS WATCHED
            </Tag>
          </div>
        ) : null}
      </div>

      <div style={{ padding: wide ? "14px 20px 0" : "16px 22px 0" }}>
        <div style={{ display: "flex", gap: wide ? 22 : 28, alignItems: "center" }}>
          <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.16em", color: C.redBright }}>VIEWS ↑</span>
          <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.16em", color: C.muted }}>SHARES ↑</span>
          <span style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.16em", color: C.muted }}>COMMENTS ↑</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginTop: 10 }}>
          <ViewsGraph start={2.5} width={wide ? 400 : 520} height={wide ? 66 : 86} />
          <div style={{ paddingBottom: 4 }}>
            <div style={{ fontFamily: FONT, fontSize: wide ? 30 : 34, fontWeight: 800, color: C.white, letterSpacing: "-0.04em" }}>
              ATTENTION
            </div>
            <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.16em", color: C.muted }}>
              NO PAID DISTRIBUTION REQUIRED
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 20 : 22,
          right: wide ? 20 : 22,
          bottom: wide ? 16 : 18,
          opacity: comments,
          transform: `translateY(${(1 - comments) * 10}px)`,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {[
            ["Is this beer?", "00:12"],
            ["Wait. It's water?", "00:41"],
            ["I need this in my life.", "01:08"],
          ].map(([text, time], index) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "7px 10px",
                background: "rgba(255,255,255,0.028)",
                border: `1px solid ${C.lineSoft}`,
                opacity: 1 - index * 0.16,
              }}
            >
              <Avatar size={18} />
              <span style={{ fontFamily: FONT, fontSize: 11.5, color: C.silver }}>{text}</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 7.5, color: C.dim }}>{time}</span>
            </div>
          ))}
        </div>
      </div>
    </BrowserChrome>
  );
};

const EnquiryCard: React.FC<{ label: string; index: number; start: number; wide: boolean }> = ({
  label,
  index,
  start,
  wide,
}) => {
  const { t } = useTime();
  const p = progress(t, start, 0.55, easeOut);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: wide ? "13px 14px" : "16px 16px",
        border: `1px solid ${C.lineSoft}`,
        background: "rgba(255,255,255,0.028)",
        opacity: p,
        transform: `translateX(${(1 - p) * 18}px)`,
      }}
    >
      <div
        style={{
          width: 30,
          height: 30,
          display: "grid",
          placeItems: "center",
          background: C.redSoft,
          border: `1px solid ${C.red}44`,
          color: C.redBright,
          fontFamily: MONO,
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        {String(index + 1).padStart(2, "0")}
      </div>
      <div>
        <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.16em", color: C.dim }}>
          INBOUND
        </div>
        <div style={{ fontFamily: FONT, fontSize: wide ? 13 : 14, fontWeight: 600, color: C.silver, letterSpacing: "0.03em" }}>
          {label}
        </div>
      </div>
      <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: C.redBright }} />
    </div>
  );
};

const SignalPanel: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, 4.8, 0.8);
  return (
    <div style={{ width: wide ? 380 : 920, opacity: p }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.2em", color: C.muted }}>
          WHAT HAPPENED NEXT
        </span>
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.redBright }}>
          LIVE
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        <EnquiryCard wide={wide} label="RETAILER ENQUIRY" index={0} start={5.2} />
        <EnquiryCard wide={wide} label="DISTRIBUTOR REQUEST" index={1} start={5.65} />
        <EnquiryCard wide={wide} label="PRESS REQUEST" index={2} start={6.1} />
      </div>
      <div style={{ height: 18 }} />
      <div
        style={{
          padding: "13px 14px",
          border: `1px solid ${C.red}3A`,
          background: C.redGhost,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.18em", color: C.redBright }}>
          SEQUENCE
        </div>
        <div style={{ marginTop: 6, fontFamily: FONT, fontSize: wide ? 17 : 18, fontWeight: 600, color: C.white, lineHeight: 1.35 }}>
          Brand first.
          <br />
          Cans second.
        </div>
        <div style={{ marginTop: 8, fontFamily: FONT, fontSize: 12, lineHeight: 1.5, color: C.muted }}>
          The launch film went live before the first cans went on sale in 2019.
        </div>
      </div>
    </div>
  );
};

const Shelf: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const p = progress(t, BEATS.attention.shelf, 0.9, easeOut);
  const heights = wide ? [300, 340, 310, 330, 300] : [260, 300, 280, 270];
  const srcs = [IMG.sparkling, IMG.still, IMG.sparkling, IMG.still, IMG.sparkling];
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: wide ? 0 : 150,
        height: wide ? 440 : 660,
        opacity: p,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: wide ? 300 : 480,
          background: "linear-gradient(180deg, #0E0F12 0%, #070708 100%)",
          borderTop: `1px solid ${C.line}`,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 214 : 370,
          height: 10,
          background: "linear-gradient(180deg, rgba(210,215,220,0.26), #1A1C20 55%, #08090B)",
          borderTop: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 18px 34px rgba(0,0,0,0.55)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: wide ? 232 : 390,
          transform: "translateX(-50%)",
          display: "flex",
          alignItems: "flex-end",
          gap: wide ? 52 : 26,
        }}
      >
        {srcs.map((src, index) => (
          <div
            key={index}
            style={{
              opacity: clamp((p - index * 0.08) * 1.4),
              transform: `translateY(${(1 - clamp((p - index * 0.08) * 1.4)) * 18}px)`,
            }}
          >
            <Can
              src={src}
              height={heights[index]}
              droplets={0.6}
              rotateY={index % 2 === 0 ? -8 : 7}
              glow={index % 2 === 0 ? C.red : "#FFFFFF"}
              reflection={false}
              sweep={(Math.sin(t * 0.4 + index) + 1) / 2}
            />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: wide ? 300 : 500,
          transform: "translateX(-50%)",
          display: "flex",
          gap: wide ? 52 : 26,
          opacity: 0.7,
        }}
      >
        {srcs.map((_, index) => (
          <div
            key={index}
            style={{
              width: wide ? 120 : 92,
              padding: "5px 0",
              borderTop: `1px solid ${C.lineSoft}`,
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 7.5,
              letterSpacing: "0.12em",
              color: C.dim,
            }}
          >
            {index % 2 === 0 ? "SPARKLING" : "STILL"}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: wide ? 250 : 420,
          height: 18,
          background: `radial-gradient(ellipse at 50% 50%, ${C.red}22, transparent 70%)`,
          filter: "blur(8px)",
        }}
      />
    </div>
  );
};

export const Scene05Attention: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const shelfIn = t >= BEATS.attention.shelf;
  const feedOut = progress(t, BEATS.attention.shelf - 0.25, 0.5, easeInOut);
  const size = wide ? 74 : 48;

  return (
    <Backdrop glowX="42%" glowY="34%" glowOpacity={0.12}>
      {!shelfIn ? (
        <AbsoluteFill style={{ opacity: 1 - feedOut }}>
          <div style={{ position: "absolute", left: stage.margin, top: wide ? 70 : 130 }}>
            <Kicker start={0.25}>THE UNFAIR ADVANTAGE</Kicker>
            <div style={{ height: 16 }} />
            <Headline lines={["SELL THE IDEA", "BEFORE THE CANS."]} size={size} start={0.4} accentLast />
          </div>

          <div
            style={
              wide
                ? { position: "absolute", left: stage.margin, top: 258 }
                : { position: "absolute", left: "50%", top: 430, transform: "translateX(-50%)" }
            }
          >
            <PostWindow wide={wide} />
          </div>

          <div
            style={
              wide
                ? { position: "absolute", right: stage.margin, top: 258 }
                : { position: "absolute", left: stage.margin, right: stage.margin, top: 1440 }
            }
          >
            <SignalPanel wide={wide} />
          </div>

          <div
            style={{
              position: "absolute",
              left: stage.margin,
              bottom: wide ? 40 : 168,
              opacity: progress(t, 5.0, 0.7),
            }}
          >
            <UtilityNote>RECONSTRUCTION · NOT ARCHIVAL FOOTAGE</UtilityNote>
          </div>
        </AbsoluteFill>
      ) : null}

      {shelfIn ? (
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              top: wide ? 104 : 170,
              zIndex: 8,
            }}
          >
            <Kicker start={0.3}>FROM FEED TO SHELF</Kicker>
            <div style={{ height: 18 }} />
            <Headline lines={COPY.attention} size={wide ? 80 : 52} start={0.4} accentLast />
            <div style={{ height: 20 }} />
            <Reveal start={1.2} duration={0.7}>
              <div style={{ fontFamily: FONT, fontSize: wide ? 20 : 18, color: C.muted, maxWidth: 620, lineHeight: 1.5 }}>
                Demand showed up before distribution did. The next job was
                getting the product onto shelves.
              </div>
            </Reveal>
          </div>
          <Shelf wide={wide} />
          <div
            style={{
              position: "absolute",
              right: stage.margin,
              top: wide ? 104 : 170,
              zIndex: 8,
            }}
          >
            <Tag color={C.white} background="rgba(255,255,255,0.06)" style={{ fontSize: 9 }}>
              FIRST CANS · 2019
            </Tag>
          </div>
        </AbsoluteFill>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          bottom: wide ? 40 : 150,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.18em",
          color: C.dim,
          zIndex: 20,
        }}
      >
        ATTENTION IS NOT THE SAME AS REVENUE
      </div>
    </Backdrop>
  );
};
