import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, IMG, MONO, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Display,
  Glow,
  Headline,
  Kicker,
  MaskLine,
  Notebook,
  Photo,
  Reveal,
  SourceNote,
  Tag,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";
import { PocketLedgerPhone } from "../PocketLedgerUI";

export const Scene06Lesson: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const notebookIn = progress(t, BEATS.lesson.notebook, 0.8, easeOut);
  const summaryIn = progress(t, BEATS.lesson.summary, 0.8, easeOut);
  const wideIn = progress(t, BEATS.lesson.wide, 0.9, easeOut);
  const statementIn = progress(t, BEATS.lesson.statement, 0.8, easeOut);
  const closeProgress = progress(t, BEATS.lesson.notebook + 0.3, 1.6, easeInOut);
  const titleSize = wide ? 72 : 50;

  return (
    <Backdrop glowX="24%" glowY="44%" glowOpacity={0.08}>
      {!wide ? (
        <>
          <AbsoluteFill style={{ opacity: 1 - progress(t, BEATS.lesson.notebook - 0.2, 0.5) }}>
            <Photo src={IMG.owner} start={0.2} duration={3.6} scaleFrom={1.02} scaleTo={1.1} objectPosition="50% 30%" grade="warm" />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(12,14,11,0.2), transparent 36%, rgba(12,14,11,0.92))" }} />
            <div style={{ position: "absolute", left: stage.margin, right: stage.margin, bottom: 260, zIndex: 5 }}>
              <Kicker start={0.3}>THE BIGGER LESSON</Kicker>
              <div style={{ height: 16 }} />
              <Headline lines={COPY.lessonHead} size={titleSize} start={0.4} colorLast={C.greenBright} />
            </div>
          </AbsoluteFill>
        </>
      ) : (
        <>
          <AbsoluteFill style={{ opacity: 1 - progress(t, BEATS.lesson.notebook - 0.25, 0.5) }}>
            <AbsoluteFill style={{ left: "34%", overflow: "hidden" }}>
              <Photo src={IMG.owner} start={0.2} duration={3.6} scaleFrom={1.02} scaleTo={1.1} objectPosition="50% 30%" grade="warm" />
            </AbsoluteFill>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(12,14,11,0.95) 0%, rgba(12,14,11,0.72) 38%, rgba(12,14,11,0.18) 100%)" }} />
            <div style={{ position: "absolute", left: stage.margin, top: 250, width: "46%", zIndex: 5 }}>
              <Kicker start={0.3}>THE BIGGER LESSON</Kicker>
              <div style={{ height: 22 }} />
              <Headline lines={COPY.lessonHead} size={titleSize} start={0.4} colorLast={C.greenBright} />
              <div style={{ height: 22 }} />
              <Reveal start={1.3} duration={0.7}>
                <div style={{ fontFamily: FONT, fontSize: 21, lineHeight: 1.55, color: C.cream, maxWidth: 620 }}>
                  The insight is not a bigger dashboard. It is one less moment
                  of friction at the end of a long day.
                </div>
              </Reveal>
            </div>
          </AbsoluteFill>
        </>
      )}

      {t >= BEATS.lesson.notebook ? (
        <AbsoluteFill style={{ opacity: notebookIn, zIndex: 14 }}>
          {wide ? (
            <>
              <div style={{ position: "absolute", left: "8%", top: 150 }}>
                <Notebook width={760} height={560} closeProgress={closeProgress} />
              </div>
              <div style={{ position: "absolute", right: stage.margin, top: 280, width: "38%" }}>
                <Kicker start={0.2}>THE CHANGE</Kicker>
                <div style={{ height: 20 }} />
                <Headline lines={["CLOSE THE", "GUESSWORK."]} size={64} start={0.3} colorLast={C.amber} />
                <div style={{ height: 18 }} />
                <div style={{ fontFamily: FONT, fontSize: 20, lineHeight: 1.55, color: C.cream }}>
                  A notebook records some of the day. A simple habit can
                  record the part that matters.
                </div>
              </div>
            </>
          ) : (
            <>
              <div style={{ position: "absolute", left: "50%", top: 260, transform: "translateX(-50%)" }}>
                <Notebook width={860} height={620} closeProgress={closeProgress} />
              </div>
              <div style={{ position: "absolute", left: stage.margin, right: stage.margin, bottom: 250, zIndex: 5 }}>
                <Headline lines={["CLOSE THE", "GUESSWORK."]} size={50} start={0.3} colorLast={C.amber} />
              </div>
            </>
          )}
        </AbsoluteFill>
      ) : null}

      {t >= BEATS.lesson.summary ? (
        <AbsoluteFill style={{ opacity: summaryIn, zIndex: 16 }}>
          <AbsoluteFill style={{ background: "linear-gradient(90deg, rgba(12,14,11,0.98), rgba(18,20,15,0.72))" }} />
          <Glow x="68%" y="48%" size={46} color={C.greenBright} opacity={0.16} />
          <div style={{ position: "absolute", left: stage.margin, top: wide ? 210 : 260, width: wide ? "44%" : "88%", zIndex: 8 }}>
            <Kicker start={0.2}>AT CLOSING TIME</Kicker>
            <div style={{ height: 22 }} />
            <Headline lines={["A CLEARER", "DAY."]} size={wide ? 86 : 62} start={0.3} colorLast={C.greenBright} />
            <div style={{ height: 22 }} />
            <div style={{ fontFamily: FONT, fontSize: wide ? 21 : 19, lineHeight: 1.55, color: C.cream, maxWidth: 560 }}>
              Sales. Expenses. Personal money. What is left. Four numbers,
              written down before the day disappears.
            </div>
            <div style={{ marginTop: 22, display: "flex", gap: 8 }}>
              <Tag color={C.greenBright} background={C.greenGhost} border={`${C.green}44`} style={{ fontSize: 8 }}>
                SALES {Intl.NumberFormat("en-NG").format(27000)}
              </Tag>
              <Tag color={C.cream} background="rgba(246,242,232,0.05)" style={{ fontSize: 8 }}>
                ILLUSTRATIVE
              </Tag>
            </div>
          </div>
          <div style={{ position: "absolute", left: wide ? "66%" : "50%", top: wide ? 80 : 760, transform: "translateX(-50%)", zIndex: 7 }}>
            <PocketLedgerPhone width={wide ? 370 : 430} screen="summary" screenStart={BEATS.lesson.summary} profitProgress={1} />
          </div>
        </AbsoluteFill>
      ) : null}

      {t >= BEATS.lesson.wide ? (
        <AbsoluteFill style={{ opacity: wideIn, zIndex: 18 }}>
          <AbsoluteFill style={{ overflow: "hidden" }}>
            <Photo src={IMG.ownerWide2} start={BEATS.lesson.wide} duration={3.6} scaleFrom={1.04} scaleTo={1.14} objectPosition="50% 46%" grade="warm" />
          </AbsoluteFill>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(12,14,11,0.94) 0%, rgba(12,14,11,0.52) 46%, rgba(12,14,11,0.2) 100%), linear-gradient(180deg, rgba(12,14,11,0.42), transparent 40%, rgba(12,14,11,0.78))" }} />
          <div style={{ position: "absolute", left: stage.margin, right: wide ? "44%" : stage.margin, top: wide ? "34%" : "28%", zIndex: 5 }}>
            <Kicker start={0.2}>SMALL TOOLS</Kicker>
            <div style={{ height: 20 }} />
            <Headline lines={COPY.lessonSub} size={wide ? 82 : 56} start={0.3} colorLast={C.greenBright} />
            <div style={{ height: 20 }} />
            <div style={{ fontFamily: FONT, fontSize: wide ? 21 : 19, lineHeight: 1.55, color: C.cream, maxWidth: 620 }}>
              A little less friction. A little more confidence. That is a
              product people can feel.
            </div>
          </div>
          <div style={{ position: "absolute", right: stage.margin, bottom: wide ? 48 : 170, zIndex: 6 }}>
            <SourceNote>PHOTO: WIKIMEDIA COMMONS · CC BY-SA 4.0</SourceNote>
          </div>
        </AbsoluteFill>
      ) : null}

      {t >= BEATS.lesson.statement ? (
        <AbsoluteFill style={{ opacity: statementIn, zIndex: 22, justifyContent: "center", alignItems: "center" }}>
          <AbsoluteFill style={{ background: "rgba(8,9,7,0.92)" }} />
          <Glow x="50%" y="48%" size={52} color={C.greenBright} opacity={0.12} />
          <div style={{ textAlign: "center", zIndex: 5 }}>
            <Kicker start={0.1} style={{ justifyContent: "center" }}>THE POINT</Kicker>
            <div style={{ height: 26 }} />
            <MaskLine start={0.2} duration={0.8}>
              <Display size={wide ? 92 : 58} color={C.cream} weight={750}>
                NOTICE THE FRICTION.
              </Display>
            </MaskLine>
            <MaskLine start={0.4} duration={0.8}>
              <Display size={wide ? 92 : 58} color={C.greenBright} weight={750}>
                REMOVE IT.
              </Display>
            </MaskLine>
            <div style={{ height: 26 }} />
            <div style={{ fontFamily: MONO, fontSize: wide ? 12 : 10, letterSpacing: "0.22em", color: C.muted }}>
              SMALL TOOLS · REAL RELIEF
            </div>
          </div>
        </AbsoluteFill>
      ) : null}
    </Backdrop>
  );
};
