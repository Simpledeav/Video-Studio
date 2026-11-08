import { BEATS, C, COPY, FONT, MONO, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Glow,
  Headline,
  Kicker,
  Notebook,
  PocketLedgerLogo,
  Sweep,
  Tag,
  clamp,
  easeInOut,
  easeOut,
  progress,
  useTime,
} from "../kit";
import { PocketLedgerPhone } from "../PocketLedgerUI";

const FEATURES = [
  { icon: "+", title: "Quick sale", note: "Amount and payment method in seconds." },
  { icon: "−", title: "Expense", note: "Supplies, transport, electricity." },
  { icon: "↗", title: "Owner withdrawal", note: "Personal money, kept separate." },
  { icon: "▤", title: "Today's summary", note: "Sales, expenses, cash left." },
];

export const Scene04Idea: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const notebookOut = progress(t, BEATS.idea.phone, 0.8, easeInOut);
  const phoneIn = progress(t, BEATS.idea.phone, 1.0, easeOut);
  const logoIn = progress(t, BEATS.idea.logo, 0.8, easeOut);
  const featureIn = progress(t, BEATS.idea.features, 0.7);
  const titleSize = wide ? 60 : 46;

  return (
    <Backdrop glowX="72%" glowY="44%" glowOpacity={0.14}>
      <div style={{ position: "absolute", left: stage.margin, right: stage.margin, top: wide ? 70 : 120, zIndex: 8 }}>
        <Kicker start={0.2}>THE SMALL IDEA</Kicker>
        <div style={{ height: 16 }} />
        <Headline lines={COPY.ideaHead} size={titleSize} start={0.3} colorLast={C.greenBright} />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 100 : 40,
          top: wide ? 300 : 560,
          width: wide ? 600 : 860,
          height: wide ? 460 : 500,
          opacity: 0.45 * (1 - notebookOut),
          transform: `translateX(${-notebookOut * 40}px) scale(${1 - notebookOut * 0.08}) rotate(${-1 - notebookOut * 3}deg)`,
          zIndex: 3,
        }}
      >
        <Notebook width={wide ? 600 : 860} height={wide ? 430 : 500} />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "57%" : "50%",
          top: wide ? 150 : 420,
          transform: `translateX(-50%) translateY(${(1 - phoneIn) * 34}px) scale(${0.9 + phoneIn * 0.1})`,
          opacity: clamp(phoneIn * 1.2),
          zIndex: 7,
        }}
      >
        <PocketLedgerPhone
          width={wide ? 368 : 398}
          screen="home"
          screenStart={BEATS.idea.phone}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          top: wide ? 268 : 1180,
          zIndex: 8,
          opacity: logoIn,
          transform: `translateY(${(1 - logoIn) * 16}px)`,
        }}
      >
        <PocketLedgerLogo size={wide ? 50 : 42} />
        <div
          style={{
            marginTop: 14,
            fontFamily: FONT,
            fontSize: wide ? 21 : 19,
            fontWeight: 600,
            letterSpacing: "0.12em",
            color: C.greenBright,
          }}
        >
          {COPY.ideaSub}
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT,
            fontSize: wide ? 16 : 15,
            lineHeight: 1.55,
            color: C.muted,
            maxWidth: wide ? 420 : 720,
          }}
        >
          {COPY.ideaLine}
        </div>
        <div style={{ marginTop: 14 }}>
          <Tag color={C.cream} background="rgba(246,242,232,0.05)" style={{ fontSize: 9 }}>
            {COPY.concept}
          </Tag>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: wide ? "47%" : stage.margin,
          top: wide ? 560 : 1380,
          display: "grid",
          gridTemplateColumns: wide ? "1fr" : "1fr 1fr",
          gap: wide ? 12 : 12,
          zIndex: 8,
          opacity: featureIn,
        }}
      >
        {FEATURES.map((feature, index) => {
          const p = progress(t, BEATS.idea.features + index * 0.12, 0.5, easeOut);
          return (
            <div
              key={feature.title}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: "11px 12px",
                border: `1px solid ${C.lineSoft}`,
                background: "rgba(18,20,15,0.48)",
                opacity: p,
                transform: `translateY(${(1 - p) * 12}px)`,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 9,
                  background: C.greenSoft,
                  border: `1px solid ${C.greenBright}33`,
                  color: C.greenBright,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: FONT,
                  fontSize: 15,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {feature.icon}
              </div>
              <div>
                <div style={{ fontFamily: FONT, fontSize: 14.5, fontWeight: 600, color: C.cream }}>{feature.title}</div>
                <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 12, lineHeight: 1.4, color: C.muted }}>{feature.note}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: "absolute",
          left: stage.margin,
          right: stage.margin,
          bottom: wide ? 40 : 170,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          opacity: progress(t, BEATS.idea.tagline, 0.7),
          zIndex: 9,
        }}
      >
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.muted }}>
          DESIGN GOALS · OFFLINE-FIRST ENTRY · LOW DATA
        </div>
        <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.greenBright }}>
          NOT A FULL ACCOUNTING SUITE
        </div>
      </div>

      <Sweep start={1.2} duration={1.8} color={C.greenBright} opacity={0.09} />
      <Glow x="60%" y="48%" size={42} color={C.greenBright} opacity={0.07 * phoneIn} />
    </Backdrop>
  );
};
