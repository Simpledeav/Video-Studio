import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Headline,
  Kicker,
  Photo,
  Reveal,
  SourceNote,
  Tag,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";

const MiniCard: React.FC<{
  label: string;
  value: string;
  note: string;
  start: number;
  color?: string;
  children?: React.ReactNode;
}> = ({ label, value, note, start, color = C.cream, children }) => {
  const { t } = useTime();
  const p = progress(t, start, 0.6, easeOut);
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        padding: "14px 15px",
        border: `1px solid ${C.line}`,
        background: "rgba(18,20,15,0.74)",
        backdropFilter: "blur(6px)",
        opacity: p,
        transform: `translateY(${(1 - p) * 16}px)`,
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}
    >
      {children}
      <div style={{ minWidth: 0 }}>
        <div style={{ fontFamily: MONO, fontSize: 8, letterSpacing: "0.14em", color: C.dim }}>{label}</div>
        <div style={{ fontFamily: FONT, fontSize: 19, fontWeight: 650, color, letterSpacing: "-0.02em", marginTop: 3, whiteSpace: "nowrap" }}>
          {value}
        </div>
        <div style={{ fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.1em", color: C.muted, marginTop: 2 }}>{note}</div>
      </div>
    </div>
  );
};

const TransferCard: React.FC<{ start: number }> = ({ start }) => (
  <MiniCard label="TRANSFER RECEIVED" value="₦12,500" note="BANK · 09:12" start={start} color={C.greenBright}>
    <div
      style={{
        width: 34,
        height: 34,
        borderRadius: 10,
        background: C.greenSoft,
        border: `1px solid ${C.greenBright}44`,
        display: "grid",
        placeItems: "center",
        color: C.greenBright,
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      ✓
    </div>
  </MiniCard>
);

export const Scene02Owner: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const wideCut = progress(t, BEATS.owner.wide - 0.1, 0.45, easeInOut);
  const titleSize = wide ? 70 : 50;

  return (
    <Backdrop glowX="14%" glowY="40%" glowOpacity={0.07}>
      {!wide ? null : (
        <>
          <AbsoluteFill style={{ left: 0, width: "58%", overflow: "hidden" }}>
            <Photo
              src={IMG.owner}
              start={BEATS.owner.portrait}
              duration={8.8}
              scaleFrom={1.02}
              scaleTo={1.12}
              objectPosition="50% 30%"
              grade="warm"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(90deg, transparent 38%, rgba(12,14,11,0.86) 100%), linear-gradient(180deg, rgba(12,14,11,0.2), transparent 30%, rgba(12,14,11,0.42))",
              }}
            />
          </AbsoluteFill>

          <div
            style={{
              position: "absolute",
              left: "61%",
              right: stage.margin,
              top: 150,
              opacity: 1 - wideCut,
              zIndex: 6,
            }}
          >
            <Kicker start={0.3}>THE PERSON BEHIND THE PROBLEM</Kicker>
            <div style={{ height: 26 }} />
            <Headline lines={COPY.ownerHead} size={titleSize} start={BEATS.owner.headline} colorLast={C.amber} />
            <div style={{ height: 24 }} />
            <Reveal start={2.0} duration={0.7}>
              <div style={{ fontFamily: FONT, fontSize: 21, lineHeight: 1.6, color: C.cream, maxWidth: 600 }}>
                {COPY.ownerLine}
              </div>
            </Reveal>
            <div style={{ height: 28 }} />
            <Reveal start={2.5} duration={0.7}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <MiniCard label="CASH SALES" value="A HANDFUL OF NOTES" note="COUNTED, THEN SPENT" start={2.6}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: C.amberSoft, border: `1px solid ${C.amber}44`, display: "grid", placeItems: "center", color: C.amber, fontSize: 16, flexShrink: 0 }}>
                    ₦
                  </div>
                </MiniCard>
                <MiniCard label="THE NOTEBOOK" value="SOME DAYS, SOME SALES" note="THE REST LIVES IN MEMORY" start={3.2}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.06)", border: `1px solid ${C.line}`, display: "grid", placeItems: "center", color: C.cream, fontSize: 15, flexShrink: 0 }}>
                    ✎
                  </div>
                </MiniCard>
                <TransferCard start={6.9} />
              </div>
            </Reveal>
            <div style={{ height: 22 }} />
            <Reveal start={5.0} duration={0.7}>
              <Tag color={C.cream} background="rgba(246,242,232,0.06)">
                SAME HAND · SAME POCKET · NO SEPARATION
              </Tag>
            </Reveal>
          </div>

          <div style={{ position: "absolute", left: 30, bottom: 36, zIndex: 8 }}>
            <SourceNote>PHOTO: WIKIMEDIA COMMONS · CC BY-SA 4.0</SourceNote>
          </div>
        </>
      )}

      {!wide ? (
        <>
          <AbsoluteFill style={{ bottom: "44%", overflow: "hidden" }}>
            <Photo
              src={IMG.owner}
              start={BEATS.owner.portrait}
              duration={8.8}
              scaleFrom={1.02}
              scaleTo={1.1}
              objectPosition="50% 30%"
              grade="warm"
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(12,14,11,0.18), transparent 38%, rgba(12,14,11,0.88) 100%)",
              }}
            />
          </AbsoluteFill>
          <div style={{ position: "absolute", left: stage.margin, right: stage.margin, top: "48%", zIndex: 5 }}>
            <Kicker start={0.3}>THE PERSON BEHIND THE PROBLEM</Kicker>
            <div style={{ height: 16 }} />
            <Headline lines={COPY.ownerHead} size={titleSize} start={BEATS.owner.headline} colorLast={C.amber} />
            <div style={{ height: 16 }} />
            <Reveal start={2.0} duration={0.7}>
              <div style={{ fontFamily: FONT, fontSize: 20, lineHeight: 1.55, color: C.cream, maxWidth: 900 }}>
                {COPY.ownerLine}
              </div>
            </Reveal>
          </div>
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              right: stage.margin,
              bottom: 170,
              display: "flex",
              gap: 10,
              zIndex: 6,
            }}
          >
            <MiniCard label="CASH" value="NOTES" note="SPENT FAST" start={2.6}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: C.amberSoft, color: C.amber, display: "grid", placeItems: "center", flexShrink: 0 }}>₦</div>
            </MiniCard>
            <MiniCard label="NOTEBOOK" value="PARTIAL" note="MEMORY, TOO" start={3.2}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: "rgba(255,255,255,0.06)", color: C.cream, display: "grid", placeItems: "center", flexShrink: 0 }}>✎</div>
            </MiniCard>
            <MiniCard label="TRANSFER" value="₦12,500" note="09:12" start={6.9} color={C.greenBright}>
              <div style={{ width: 30, height: 30, borderRadius: 9, background: C.greenSoft, color: C.greenBright, display: "grid", placeItems: "center", flexShrink: 0 }}>✓</div>
            </MiniCard>
          </div>
          <div style={{ position: "absolute", left: 30, top: 60, zIndex: 8 }}>
            <SourceNote>PHOTO: WIKIMEDIA COMMONS · CC BY-SA 4.0</SourceNote>
          </div>
        </>
      ) : null}

      {t >= BEATS.owner.wide ? (
        <AbsoluteFill style={{ opacity: wideCut, zIndex: 20 }}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <Photo
              src={IMG.ownerWide}
              start={BEATS.owner.wide}
              duration={3.6}
              scaleFrom={1.03}
              scaleTo={1.13}
              objectPosition="50% 44%"
              grade="soft"
            />
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(90deg, rgba(12,14,11,0.95) 0%, rgba(12,14,11,0.62) 46%, rgba(12,14,11,0.2) 100%), linear-gradient(180deg, rgba(12,14,11,0.5), transparent 30%, rgba(12,14,11,0.75))",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: stage.margin,
              right: wide ? "45%" : stage.margin,
              top: wide ? "33%" : "30%",
              zIndex: 4,
            }}
          >
            <Kicker start={0.2} color={C.amber}>A MONTH OF MOVEMENT</Kicker>
            <div style={{ height: 22 }} />
            <Headline
              lines={wide ? ["CASH. TRANSFERS.", "SUPPLIERS.", "ALL IN ONE HAND."] : ["CASH.", "TRANSFERS.", "SUPPLIERS.", "ONE HAND."]}
              size={wide ? 66 : 48}
              start={0.3}
              colorLast={C.amber}
            />
            <div style={{ height: 22 }} />
            <Reveal start={1.3} duration={0.7}>
              <div style={{ fontFamily: FONT, fontSize: wide ? 22 : 20, lineHeight: 1.55, color: C.cream, maxWidth: 720 }}>
                And at the end of the month, the number that matters most is
                still a guess.
              </div>
            </Reveal>
          </div>
          <div style={{ position: "absolute", right: stage.margin, bottom: wide ? 50 : 170, zIndex: 6 }}>
            <SourceNote>PHOTO: WIKIMEDIA COMMONS · CC BY-SA 4.0</SourceNote>
          </div>
        </AbsoluteFill>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${C.amber}, transparent)`,
          opacity: 0.35,
          zIndex: 30,
        }}
      />
    </Backdrop>
  );
};
