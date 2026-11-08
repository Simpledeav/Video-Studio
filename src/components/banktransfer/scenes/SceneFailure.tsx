import { AbsoluteFill } from "remotion";
import { BEATS, C, FONT, MONO } from "../../../config/bankTransfer";
import {
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  progress,
  Reveal,
  Scanlines,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import { FlowDiagram, MiniFlow } from "../Network";

type FailureCard = {
  index: string;
  title: string;
  status: string;
  color: string;
  background: string;
  body: string;
  detail: string;
  start: number;
  statusKind: "timeout" | "pending" | "missing";
};

const CARDS: FailureCard[] = [
  {
    index: "A",
    title: "TIMEOUT",
    status: "TIMEOUT",
    color: C.red,
    background: C.redSoft,
    body: "The receiving institution does not respond in time. The transaction line freezes.",
    detail: "NO FINAL RESPONSE",
    start: BEATS.failure.timeout,
    statusKind: "timeout",
  },
  {
    index: "B",
    title: "PROCESSING DELAY",
    status: "PENDING",
    color: C.amber,
    background: C.amberSoft,
    body: "The transaction remains unresolved while the system establishes its final status.",
    detail: "PENDING / UNRESOLVED",
    start: BEATS.failure.pending,
    statusKind: "pending",
  },
  {
    index: "C",
    title: "CREDIT NOT CONFIRMED",
    status: "UNCONFIRMED",
    color: C.red,
    background: C.redSoft,
    body: "The sender sees a completed status, but the beneficiary cannot see the credit.",
    detail: "TRACE AT RECEIVING BANK",
    start: BEATS.failure.credit,
    statusKind: "missing",
  },
];

export const SceneFailure: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const margin = wide ? 110 : 64;
  const flowIn = progress(t, BEATS.failure.flow, 0.8);
  const noteIn = progress(t, BEATS.failure.investigation, 0.8);
  const active = t < BEATS.failure.timeout ? -1 : t < BEATS.failure.pending ? 1 : t < BEATS.failure.credit ? 2 : 3;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, fontFamily: FONT }}>
      <Glow x="18%" y="24%" size={52} color={C.red} opacity={0.06} />
      <Glow x="82%" y="70%" size={58} color={C.amber} opacity={0.05} />
      <GridField opacity={0.3} size={wide ? 92 : 74} />
      <Scanlines opacity={0.035} />

      <div style={{ position: "absolute", left: margin, right: margin, top: wide ? 62 : 108 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20 }}>
          <div>
            <Kicker start={0.05} color={C.silver} rule={C.amber}>
              WHERE THINGS CAN GO WRONG
            </Kicker>
            <div style={{ marginTop: 14 }}>
              <MaskLine start={0.12} duration={0.8}>
                <div
                  style={{
                    fontFamily: FONT,
                    fontSize: wide ? 52 : 50,
                    fontWeight: 700,
                    letterSpacing: "-0.045em",
                    lineHeight: 0.98,
                    color: C.white,
                  }}
                >
                  SAME TRANSFER.
                  <br />
                  <span style={{ color: C.amber }}>DIFFERENT INFORMATION.</span>
                </div>
              </MaskLine>
            </div>
          </div>
          {wide ? (
            <div style={{ maxWidth: 380, textAlign: "right", opacity: progress(t, 0.4, 0.7) }}>
              <Mono size={10} color={C.dim}>THREE FAILURE PATTERNS</Mono>
              <div style={{ marginTop: 7, fontFamily: FONT, fontSize: 14, lineHeight: 1.5, color: C.silver }}>
                A debit on one side does not automatically prove a credit on the other.
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 180 : 112,
          right: wide ? 180 : 112,
          top: wide ? 252 : 366,
          opacity: flowIn,
        }}
      >
        <FlowDiagram
          orientation="horizontal"
          width={wide ? 1560 : 856}
          scale={wide ? 1.1 : 1.16}
          reveal={flowIn}
          activeIndex={active}
          packet={0.55}
          status={active >= 3 ? "missing" : active >= 2 ? "pending" : "timeout"}
          compact
          showMessageTag={false}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          top: wide ? 440 : 556,
          display: "flex",
          flexDirection: wide ? "row" : "column",
          gap: wide ? 26 : 18,
        }}
      >
        {CARDS.map((card) => {
          const p = progress(t, card.start, 0.7);
          const isActive = t >= card.start;
          return (
            <Reveal
              key={card.title}
              start={card.start}
              duration={0.7}
              y={wide ? 26 : 34}
              style={{ flex: wide ? 1 : undefined }}
            >
              <div
                style={{
                  borderRadius: wide ? 10 : 12,
                  border: `1px solid ${isActive ? `${card.color}55` : C.line}`,
                  background: isActive
                    ? `linear-gradient(160deg, ${card.background}, rgba(7,14,24,0.92))`
                    : "rgba(10,20,33,0.6)",
                  boxShadow: isActive ? `0 18px 50px rgba(0,0,0,0.35)` : "none",
                  padding: wide ? "20px 22px 18px" : "22px 24px",
                  minHeight: wide ? 392 : 244,
                  display: "flex",
                  flexDirection: "column",
                  opacity: 0.42 + p * 0.58,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: wide ? 24 : 26,
                        height: wide ? 24 : 26,
                        borderRadius: 4,
                        display: "grid",
                        placeItems: "center",
                        border: `1px solid ${card.color}55`,
                        color: card.color,
                        fontFamily: MONO,
                        fontSize: wide ? 10 : 11,
                        fontWeight: 700,
                      }}
                    >
                      {card.index}
                    </span>
                    <Tag
                      color={card.color}
                      background={card.background}
                      border={`${card.color}44`}
                      style={{ fontSize: wide ? 9 : 10 }}
                    >
                      {card.status}
                    </Tag>
                  </div>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: card.color,
                      boxShadow: `0 0 10px ${card.color}`,
                      opacity: isActive ? 1 : 0.3,
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: wide ? 18 : 15,
                    fontFamily: FONT,
                    fontSize: wide ? 24 : 25,
                    fontWeight: 600,
                    letterSpacing: "-0.025em",
                    lineHeight: 1.05,
                    color: C.white,
                  }}
                >
                  {card.title}
                </div>
                <div
                  style={{
                    marginTop: 10,
                    fontFamily: FONT,
                    fontSize: wide ? 13.5 : 14.5,
                    lineHeight: 1.5,
                    color: C.silver,
                  }}
                >
                  {card.body}
                </div>

                <div style={{ marginTop: "auto", paddingTop: wide ? 16 : 14 }}>
                  <MiniFlow width={wide ? 430 : 470} status={card.statusKind} packet={isActive ? 0.55 : 0.1} scale={wide ? 0.78 : 0.86} />
                  <div
                    style={{
                      marginTop: 8,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      fontFamily: MONO,
                      fontSize: wide ? 8.5 : 9.5,
                      letterSpacing: "0.12em",
                      color: card.color,
                    }}
                  >
                    <span style={{ width: 18, height: 1, background: card.color }} />
                    {card.detail}
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: margin,
          right: margin,
          bottom: wide ? 66 : 152,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: noteIn * 0.9,
        }}
      >
        <Mono size={wide ? 10 : 9.5} color={C.dim} style={{ letterSpacing: "0.16em", textAlign: "center" }}>
          A SUCCESS STATUS IS NOT THE SAME AS AN INDEPENDENTLY CONFIRMED CREDIT
        </Mono>
      </div>

      <Vignette strength={0.9} />
      <Grain />
    </AbsoluteFill>
  );
};
