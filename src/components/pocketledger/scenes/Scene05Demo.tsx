import { BEATS, C, COPY, FONT, MONO, naira, useStage } from "../../../config/pocketLedger";
import {
  Backdrop,
  Glow,
  Headline,
  Kicker,
  SourceNote,
  Tag,
  progress,
  useTime,
} from "../kit";
import { PocketLedgerPhone } from "../PocketLedgerUI";

type DemoState = {
  screen: "home" | "sale" | "expense" | "personal" | "summary" | "success" | "reminder";
  amount: number;
  amountProgress: number;
  successLabel: string;
  successAmount: string;
  profitProgress: number;
  screenStart: number;
  press?: string;
};

const stateAt = (t: number): DemoState => {
  const base = {
    amount: 0,
    amountProgress: 0,
    successLabel: "Sale saved",
    successAmount: naira(12500),
    profitProgress: 0,
    screenStart: BEATS.demo.home,
    press: undefined as string | undefined,
  };
  if (t < 1.5) return { ...base, screen: "home", screenStart: 0.2, press: t >= 1.2 ? "sale" : undefined };
  if (t < 5.2) {
    return {
      ...base,
      screen: "sale",
      amount: 12500,
      amountProgress: progress(t, BEATS.demo.amount, 0.8),
      screenStart: BEATS.demo.saleSheet,
      press: t >= BEATS.demo.transfer && t < BEATS.demo.transfer + 0.35 ? "method" : t >= 5.0 ? "save" : undefined,
    };
  }
  if (t < 6.8) return { ...base, screen: "success", successLabel: "Sale saved", successAmount: naira(12500), screenStart: BEATS.demo.successSale };
  if (t < 7.1) return { ...base, screen: "home", screenStart: 6.8, press: "expense" };
  if (t < 9.4) {
    return {
      ...base,
      screen: "expense",
      amount: 1800,
      amountProgress: progress(t, BEATS.demo.expenseAmount, 0.7),
      screenStart: BEATS.demo.expenseSheet,
      press: t >= 9.4 ? "save" : undefined,
    };
  }
  if (t < 10.9) return { ...base, screen: "success", successLabel: "Expense saved", successAmount: naira(1800), screenStart: BEATS.demo.successExpense };
  if (t < 11.2) return { ...base, screen: "home", screenStart: 10.9, press: "personal" };
  if (t < 13.4) {
    return {
      ...base,
      screen: "personal",
      amount: 4000,
      amountProgress: progress(t, BEATS.demo.personalAmount, 0.6),
      screenStart: BEATS.demo.personalSheet,
      press: t >= 13.4 ? "save" : undefined,
    };
  }
  if (t < 14.6) return { ...base, screen: "success", successLabel: "Withdrawal recorded", successAmount: naira(4000), screenStart: BEATS.demo.successPersonal };
  if (t < 19.4) {
    return {
      ...base,
      screen: "summary",
      screenStart: BEATS.demo.summary,
      profitProgress: progress(t, BEATS.demo.profit, 0.8),
    };
  }
  return { ...base, screen: "reminder", screenStart: BEATS.demo.reminder };
};

const STEPS = [
  {
    id: "sale",
    label: "ADD A SALE",
    title: "IN",
    line: "Amount, payment method, save. Seconds.",
    accent: C.greenBright,
    at: 1.2,
  },
  {
    id: "expense",
    label: "ADD AN EXPENSE",
    title: "OUT",
    line: "Transport, supplies, electricity. One tap.",
    accent: C.amber,
    at: 6.8,
  },
  {
    id: "personal",
    label: "PERSONAL WITHDRAWAL",
    title: "SEPARATE",
    line: "Owner money stays distinct from business money.",
    accent: C.red,
    at: 10.9,
  },
  {
    id: "summary",
    label: "TODAY'S SUMMARY",
    title: "CLEAR",
    line: "Sales, expenses, personal — and what is left.",
    accent: C.greenBright,
    at: 14.6,
  },
  {
    id: "reminder",
    label: "A DAILY REMINDER",
    title: "HABIT",
    line: "Two minutes now beats an hour of guessing.",
    accent: C.greenBright,
    at: 19.4,
  },
];

const StepRail: React.FC<{ wide: boolean; t: number }> = ({ wide, t }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {STEPS.map((step, index) => {
        const active = t >= step.at && (index === STEPS.length - 1 || t < STEPS[index + 1].at);
        const p = progress(t, step.at, 0.45);
        return (
          <div
            key={step.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: active ? 1 : 0.32,
              transform: `translateX(${active ? 6 : 0}px)`,
              transition: "none",
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: active ? step.accent : C.dim,
                boxShadow: active ? `0 0 10px ${step.accent}` : "none",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: wide ? 10 : 9,
                letterSpacing: "0.16em",
                color: active ? C.cream : C.dim,
                whiteSpace: "nowrap",
              }}
            >
              {step.label}
            </span>
            {active ? (
              <span
                style={{
                  flex: 1,
                  height: 1,
                  background: `linear-gradient(90deg, ${step.accent}66, transparent)`,
                  opacity: p,
                }}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export const Scene05Demo: React.FC = () => {
  const { t } = useTime();
  const stage = useStage();
  const { wide } = stage;
  const state = stateAt(t);
  const activeStep = STEPS.reduce((acc, step) => (t >= step.at ? step : acc), STEPS[0]);
  const titleSize = wide ? 58 : 40;

  return (
    <Backdrop glowX="72%" glowY="42%" glowOpacity={0.13}>
      <div style={{ position: "absolute", left: stage.margin, right: stage.margin, top: wide ? 66 : 110, zIndex: 8 }}>
        <Kicker start={0.2}>SHOW THE SOLUTION WORKING</Kicker>
        <div style={{ height: 14 }} />
        <Headline
          lines={wide ? COPY.demoHead : ["A SALE.", "AN EXPENSE.", "A CLEAR PICTURE."]}
          size={titleSize}
          start={0.3}
          colorLast={C.greenBright}
          style={{ maxWidth: wide ? 800 : 820 }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? stage.margin : stage.margin,
          top: wide ? 470 : 1180,
          width: wide ? 660 : 950,
          zIndex: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ width: 28, height: 2, background: activeStep.accent }} />
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.2em", color: activeStep.accent }}>
            {activeStep.label}
          </span>
        </div>
        <div
          style={{
            marginTop: 12,
            fontFamily: FONT,
            fontSize: wide ? 30 : 24,
            fontWeight: 650,
            color: C.cream,
            letterSpacing: "-0.02em",
          }}
        >
          {activeStep.line}
        </div>
        <div style={{ marginTop: 18 }}>
          <StepRail wide={wide} t={t} />
        </div>
        <div style={{ marginTop: 24, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <Tag color={C.cream} background="rgba(246,242,232,0.05)" style={{ fontSize: 8 }}>
            ILLUSTRATIVE FIGURES
          </Tag>
          <Tag color={C.greenBright} background={C.greenGhost} border={`${C.green}44`} style={{ fontSize: 8 }}>
            HYPOTHETICAL PRODUCT
          </Tag>
        </div>
        <div style={{ marginTop: 18 }}>
          <SourceNote>{COPY.disclaimer}</SourceNote>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? "68%" : "50%",
          top: wide ? 76 : 350,
          transform: "translateX(-50%)",
          zIndex: 7,
        }}
      >
        <PocketLedgerPhone
          width={wide ? 382 : 430}
          screen={state.screen}
          screenStart={state.screenStart}
          amount={state.amount}
          amountProgress={state.amountProgress}
          successLabel={state.successLabel}
          successAmount={state.successAmount}
          profitProgress={state.profitProgress}
          press={state.press}
        />
      </div>

      <div
        style={{
          position: "absolute",
          right: stage.margin,
          bottom: wide ? 38 : 168,
          display: "flex",
          alignItems: "center",
          gap: 10,
          zIndex: 9,
        }}
      >
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.greenBright }} />
        <span style={{ fontFamily: MONO, fontSize: 9, letterSpacing: "0.16em", color: C.muted }}>
          ONE DAY · FOUR NUMBERS · FEWER GUESSES
        </span>
      </div>

      <Glow x="68%" y="48%" size={38} color={C.greenBright} opacity={0.06} />
    </Backdrop>
  );
};
