import type { CSSProperties, ReactNode } from "react";
import { C, FONT, LEDGER, MONO, naira } from "../../config/pocketLedger";
import {
  CheckMark,
  LedgerIcon,
  Money,
  PhoneFrame,
  StatusBar,
  TapRipple,
  progress,
  useTime,
} from "./kit";

export type LedgerScreen =
  | "home"
  | "sale"
  | "expense"
  | "personal"
  | "summary"
  | "success"
  | "reminder";

type ScreenProps = {
  width: number;
  screen: LedgerScreen;
  screenStart?: number;
  amount?: number;
  amountProgress?: number;
  successLabel?: string;
  successAmount?: string;
  profitProgress?: number;
  press?: string;
  style?: CSSProperties;
};

const Row: React.FC<{
  label: string;
  value: string;
  color?: string;
  strong?: boolean;
  size: number;
  style?: CSSProperties;
}> = ({ label, value, color = C.ink, strong = false, size, style }) => (
  <div
    style={{
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      gap: size * 0.7,
      ...style,
    }}
  >
    <span
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: strong ? 600 : 500,
        color: strong ? C.ink : "rgba(12,14,11,0.64)",
        letterSpacing: "-0.015em",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontFamily: FONT,
        fontSize: size,
        fontWeight: strong ? 700 : 600,
        color,
        letterSpacing: "-0.02em",
        fontVariantNumeric: "tabular-nums",
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  </div>
);

const ActionTile: React.FC<{
  label: string;
  hint: string;
  icon: ReactNode;
  color: string;
  background: string;
  border: string;
  pressed?: boolean;
  ink?: string;
  size: number;
}> = ({ label, hint, icon, color, background, border, pressed = false, ink, size }) => (
  <div
    style={{
      flex: 1,
      minWidth: 0,
      overflow: "hidden",
      minHeight: size * 1.15,
      borderRadius: size * 0.35,
      background,
      border: `1px solid ${border}`,
      padding: size * 0.16,
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transform: `scale(${pressed ? 0.96 : 1})`,
      boxShadow: pressed ? `0 0 0 3px ${border}` : "none",
    }}
  >
    <div
      style={{
        width: size * 0.5,
        height: size * 0.5,
        borderRadius: size * 0.22,
        background: `${color}1F`,
        border: `1px solid ${color}33`,
        display: "grid",
        placeItems: "center",
        color,
        fontSize: size * 0.3,
        fontWeight: 700,
      }}
    >
      {icon}
    </div>
    <div>
      <div style={{ fontFamily: FONT, fontSize: size * 0.34, fontWeight: 650, color: ink ?? C.ink, lineHeight: 1.1 }}>
        {label}
      </div>
      <div style={{ marginTop: size * 0.06, fontFamily: MONO, fontSize: size * 0.12, letterSpacing: "0.08em", color: "rgba(12,14,11,0.45)" }}>
        {hint}
      </div>
    </div>
  </div>
);

const HomeTab: React.FC<{ size: number; active: number }> = ({ size, active }) => (
  <div
    style={{
      height: size * 1.05,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-around",
      borderTop: `1px solid rgba(12,14,11,0.08)`,
      background: "rgba(255,255,255,0.32)",
      paddingBottom: size * 0.18,
    }}
  >
    {[
      ["Home", "◉"],
      ["Records", "≡"],
      ["Summary", "▤"],
    ].map(([label, icon], index) => (
      <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: size * 0.06 }}>
        <span style={{ fontSize: size * 0.34, color: index === active ? C.green : "rgba(12,14,11,0.38)" }}>{icon}</span>
        <span
          style={{
            fontFamily: FONT,
            fontSize: size * 0.16,
            fontWeight: index === active ? 600 : 500,
            color: index === active ? C.ink : "rgba(12,14,11,0.4)",
          }}
        >
          {label}
        </span>
      </div>
    ))}
  </div>
);

const HomeScreen: React.FC<{ size: number; press?: string; screenStart: number }> = ({
  size,
  press,
  screenStart,
}) => {
  const { t } = useTime();
  const p = progress(t, screenStart, 0.4);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.paper }}>
      <StatusBar />
      <div style={{ padding: `${size * 0.18}px ${size * 0.45}px 0`, flex: 1, overflow: "hidden", opacity: p }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: size * 0.22 }}>
            <LedgerIcon size={size * 0.7} />
            <div>
              <div style={{ fontFamily: FONT, fontSize: size * 0.28, fontWeight: 700, color: C.ink, lineHeight: 1 }}>
                My shop
              </div>
              <div style={{ marginTop: size * 0.06, fontFamily: MONO, fontSize: size * 0.15, letterSpacing: "0.1em", color: "rgba(12,14,11,0.45)" }}>
                MON · 14 APR
              </div>
            </div>
          </div>
          <div
            style={{
              width: size * 0.72,
              height: size * 0.72,
              borderRadius: "50%",
              background: "rgba(12,14,11,0.06)",
              display: "grid",
              placeItems: "center",
              fontFamily: FONT,
              fontSize: size * 0.32,
              color: C.ink,
            }}
          >
            ☺
          </div>
        </div>

        <div
          style={{
            marginTop: size * 0.28,
            borderRadius: size * 0.4,
            background: "linear-gradient(145deg, #1E221A, #12140F)",
            padding: size * 0.32,
            color: C.cream,
            boxShadow: "0 14px 28px rgba(12,14,11,0.22)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: -size * 0.5,
              top: -size * 0.5,
              width: size * 2.2,
              height: size * 2.2,
              borderRadius: "50%",
              border: `1px solid ${C.greenBright}33`,
              opacity: 0.6,
            }}
          />
          <div style={{ fontFamily: MONO, fontSize: size * 0.16, letterSpacing: "0.14em", color: "rgba(246,242,232,0.52)" }}>
            TODAY&apos;S SALES
          </div>
          <Money value={naira(LEDGER.sales)} size={size * 0.58} color={C.white} style={{ marginTop: size * 0.12 }} />
          <div style={{ display: "flex", gap: size * 0.5, marginTop: size * 0.3 }}>
            <div>
              <div style={{ fontFamily: MONO, fontSize: size * 0.14, color: "rgba(246,242,232,0.45)" }}>EXPENSES</div>
              <div style={{ fontFamily: FONT, fontSize: size * 0.26, fontWeight: 600, color: C.amber, marginTop: 2 }}>
                {naira(LEDGER.expenses)}
              </div>
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: size * 0.14, color: "rgba(246,242,232,0.45)" }}>PERSONAL</div>
              <div style={{ fontFamily: FONT, fontSize: size * 0.26, fontWeight: 600, color: C.amber, marginTop: 2 }}>
                {naira(LEDGER.personal)}
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: size * 0.32,
              display: "inline-flex",
              alignItems: "center",
              gap: size * 0.14,
              padding: `${size * 0.14}px ${size * 0.22}px`,
              borderRadius: size,
              background: C.greenSoft,
              border: `1px solid ${C.greenBright}33`,
            }}
          >
            <span style={{ width: size * 0.1, height: size * 0.1, borderRadius: "50%", background: C.greenBright }} />
            <span style={{ fontFamily: MONO, fontSize: size * 0.16, letterSpacing: "0.08em", color: C.greenBright }}>
              CASH LEFT {naira(LEDGER.cashLeft)}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: size * 0.2, marginTop: size * 0.22 }}>
          <ActionTile
            label="Add Sale"
            hint="IN"
            icon="+"
            color={C.green}
            background={C.green}
            border={C.green}
            ink={C.white}
            pressed={press === "sale"}
            size={size}
          />
          <ActionTile
            label="Add Expense"
            hint="OUT"
            icon="−"
            color={C.ink}
            background="rgba(255,255,255,0.42)"
            border="rgba(12,14,11,0.1)"
            pressed={press === "expense"}
            size={size}
          />
        </div>
        <div style={{ display: "flex", gap: size * 0.2, marginTop: size * 0.14 }}>
          <ActionTile
            label="Personal"
            hint="OWNER"
            icon="↗"
            color={C.amber}
            background="rgba(217,164,94,0.12)"
            border="rgba(217,164,94,0.32)"
            pressed={press === "personal"}
            size={size}
          />
          <ActionTile
            label="Summary"
            hint="TODAY"
            icon="▤"
            color={C.cream}
            background="#1C1F18"
            border="#1C1F18"
            ink={C.white}
            pressed={press === "summary"}
            size={size}
          />
        </div>

        <div style={{ marginTop: size * 0.2, fontFamily: MONO, fontSize: size * 0.13, letterSpacing: "0.08em", color: "rgba(12,14,11,0.3)" }}>
          ILLUSTRATIVE INTERFACE
        </div>
      </div>
    </div>
  );
};

const EntryScreen: React.FC<{
  size: number;
  kind: "sale" | "expense" | "personal";
  amount: number;
  amountProgress: number;
  press?: string;
  screenStart: number;
}> = ({ size, kind, amount, amountProgress, press, screenStart }) => {
  const { t } = useTime();
  const p = progress(t, screenStart, 0.35);
  const isSale = kind === "sale";
  const isPersonal = kind === "personal";
  const accent = isSale ? C.green : isPersonal ? C.amber : C.red;
  const title = isSale ? "Add sale" : isPersonal ? "Personal withdrawal" : "Add expense";
  const shown = Math.round(amount * amountProgress);
  const chips = isSale ? ["Cash", "Transfer", "POS"] : isPersonal ? ["Owner draw", "Home", "Other"] : ["Supplies", "Transport", "Electricity", "Other"];
  const activeChip = isSale ? "Transfer" : isPersonal ? "Owner draw" : "Transport";
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.paper }}>
      <StatusBar />
      <div style={{ padding: `0 ${size * 0.7}px`, flex: 1, overflow: "hidden", opacity: p, transform: `translateY(${(1 - p) * size * 0.3}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.26 }}>
          <span style={{ fontFamily: FONT, fontSize: size * 0.42, color: "rgba(12,14,11,0.55)" }}>‹</span>
          <span style={{ fontFamily: FONT, fontSize: size * 0.32, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em" }}>{title}</span>
          {isPersonal ? (
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: size * 0.14, letterSpacing: "0.06em", color: C.amber }}>
              NOT A BUSINESS EXPENSE
            </span>
          ) : null}
        </div>

        <div
          style={{
            marginTop: size * 0.34,
            borderRadius: size * 0.34,
            background: "rgba(255,255,255,0.4)",
            border: "1px solid rgba(12,14,11,0.08)",
            padding: `${size * 0.36}px ${size * 0.38}px`,
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: size * 0.15, letterSpacing: "0.14em", color: "rgba(12,14,11,0.42)" }}>
            AMOUNT
          </div>
          <Money value={naira(shown)} size={size * 0.7} color={C.ink} style={{ marginTop: size * 0.14 }} />
          <div style={{ marginTop: size * 0.18, display: "flex", gap: size * 0.16 }}>
            <span style={{ fontFamily: MONO, fontSize: size * 0.14, color: "rgba(12,14,11,0.4)" }}>NGN</span>
            <span style={{ fontFamily: MONO, fontSize: size * 0.14, color: accent }}>TODAY</span>
          </div>
        </div>

        <div style={{ marginTop: size * 0.3, fontFamily: FONT, fontSize: size * 0.21, fontWeight: 600, color: C.ink }}>
          {isSale ? "Payment method" : isPersonal ? "Reason" : "Category"}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: size * 0.16, marginTop: size * 0.14 }}>
          {chips.map((chip) => {
            const active = chip === activeChip;
            return (
              <div
                key={chip}
                style={{
                  padding: `${size * 0.14}px ${size * 0.22}px`,
                  borderRadius: size,
                  border: `1px solid ${active ? accent : "rgba(12,14,11,0.12)"}`,
                  background: active ? `${accent}1C` : "rgba(255,255,255,0.36)",
                  fontFamily: FONT,
                  fontSize: size * 0.17,
                  fontWeight: active ? 600 : 500,
                  color: active ? accent : "rgba(12,14,11,0.6)",
                }}
              >
                {chip}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: size * 0.28 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: size * 0.12 }}>
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "·", "0", "⌫"].map((key) => (
              <div
                key={key}
                style={{
                  height: size * 0.62,
                  borderRadius: size * 0.18,
                  background: "rgba(255,255,255,0.38)",
                  border: "1px solid rgba(12,14,11,0.06)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: FONT,
                  fontSize: size * 0.26,
                  fontWeight: 550,
                  color: "rgba(12,14,11,0.7)",
                }}
              >
                {key}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            marginTop: size * 0.28,
            height: size * 0.72,
            borderRadius: size * 0.24,
            background: press === "save" ? accent : C.ink,
            color: C.white,
            display: "grid",
            placeItems: "center",
            fontFamily: FONT,
            fontSize: size * 0.24,
            fontWeight: 650,
            boxShadow: press === "save" ? `0 0 0 4px ${accent}33` : "0 10px 22px rgba(12,14,11,0.16)",
          }}
        >
          {isPersonal ? "Record withdrawal" : "Save"}
        </div>
        <div style={{ marginTop: size * 0.18, textAlign: "center", fontFamily: MONO, fontSize: size * 0.13, letterSpacing: "0.08em", color: "rgba(12,14,11,0.3)" }}>
          ILLUSTRATIVE FIGURES
        </div>
      </div>
    </div>
  );
};

const SummaryScreen: React.FC<{
  size: number;
  profitProgress: number;
  screenStart: number;
}> = ({ size, profitProgress, screenStart }) => {
  const { t } = useTime();
  const p = progress(t, screenStart, 0.45);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", background: C.paper }}>
      <StatusBar />
      <div style={{ padding: `0 ${size * 0.7}px`, flex: 1, overflow: "hidden", opacity: p }}>
        <div style={{ display: "flex", alignItems: "center", gap: size * 0.26 }}>
          <span style={{ fontFamily: FONT, fontSize: size * 0.42, color: "rgba(12,14,11,0.55)" }}>‹</span>
          <span style={{ fontFamily: FONT, fontSize: size * 0.27, fontWeight: 700, color: C.ink, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>Today&apos;s summary</span>
        </div>
        <div style={{ marginTop: size * 0.08, fontFamily: MONO, fontSize: size * 0.15, letterSpacing: "0.12em", color: "rgba(12,14,11,0.42)" }}>
          MON · 14 APR · 18:10
        </div>

        <div style={{ marginTop: size * 0.3, display: "flex", flexDirection: "column", gap: size * 0.2 }}>
          <Row label="Sales" value={naira(LEDGER.sales)} size={size * 0.26} strong />
          <Row label="Expenses" value={naira(-LEDGER.expenses)} size={size * 0.24} />
          <Row label="Personal withdrawal" value={naira(-LEDGER.personal)} size={size * 0.24} />
          <div style={{ height: 1, background: "rgba(12,14,11,0.12)" }} />
          <Row label="Cash left in business" value={naira(LEDGER.cashLeft)} size={size * 0.26} strong />
          <div
            style={{
              marginTop: size * 0.08,
              borderRadius: size * 0.28,
              background: C.greenSoft,
              border: `1px solid ${C.greenBright}40`,
              padding: `${size * 0.22}px ${size * 0.26}px`,
              opacity: profitProgress,
              transform: `translateY(${(1 - profitProgress) * size * 0.2}px)`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: FONT, fontSize: size * 0.2, fontWeight: 600, color: C.green }}>Profit estimate</span>
              <span style={{ fontFamily: FONT, fontSize: size * 0.32, fontWeight: 750, color: C.green, letterSpacing: "-0.04em" }}>
                {naira(LEDGER.profit)}
              </span>
            </div>
            <div style={{ marginTop: size * 0.08, fontFamily: FONT, fontSize: size * 0.14, lineHeight: 1.4, color: "rgba(12,14,11,0.52)" }}>
              Sales minus expenses. Add product costs for a sharper number.
            </div>
          </div>
        </div>

        <div style={{ marginTop: size * 0.26, display: "flex", alignItems: "center", gap: size * 0.12 }}>
          <span style={{ width: size * 0.12, height: size * 0.12, borderRadius: "50%", background: C.greenBright }} />
          <span style={{ fontFamily: MONO, fontSize: size * 0.14, letterSpacing: "0.06em", color: "rgba(12,14,11,0.48)" }}>
            YOUR DAY, IN FOUR NUMBERS
          </span>
        </div>
      </div>
      <HomeTab size={size} active={2} />
    </div>
  );
};

const SuccessScreen: React.FC<{
  size: number;
  label: string;
  amount: string;
  screenStart: number;
}> = ({ size, label, amount, screenStart }) => {
  const { t } = useTime();
  const p = progress(t, screenStart, 0.6);
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: C.paper,
        padding: size * 0.7,
      }}
    >
      <CheckMark size={size * 1.25} progress={p} />
      <div style={{ marginTop: size * 0.34, fontFamily: FONT, fontSize: size * 0.34, fontWeight: 700, color: C.ink, letterSpacing: "-0.03em" }}>
        {label}
      </div>
      <Money value={amount} size={size * 0.6} color={C.green} style={{ marginTop: size * 0.18 }} />
      <div style={{ marginTop: size * 0.2, fontFamily: FONT, fontSize: size * 0.18, color: "rgba(12,14,11,0.5)" }}>
        Today&apos;s sales {naira(LEDGER.sales)}
      </div>
      <div
        style={{
          marginTop: size * 0.46,
          padding: `${size * 0.18}px ${size * 0.5}px`,
          borderRadius: size,
          background: C.ink,
          color: C.white,
          fontFamily: FONT,
          fontSize: size * 0.2,
          fontWeight: 600,
        }}
      >
        Done
      </div>
      <div style={{ marginTop: size * 0.24, fontFamily: MONO, fontSize: size * 0.13, letterSpacing: "0.08em", color: "rgba(12,14,11,0.3)" }}>
        ILLUSTRATIVE FIGURES
      </div>
    </div>
  );
};

const ReminderScreen: React.FC<{ size: number; screenStart: number }> = ({ size, screenStart }) => {
  const { t } = useTime();
  const p = progress(t, screenStart, 0.6);
  return (
    <div style={{ position: "absolute", inset: 0, background: C.paper }}>
      <StatusBar />
      <div style={{ padding: `${size * 0.2}px ${size * 0.7}px`, opacity: 0.28 }}>
        <div style={{ fontFamily: FONT, fontSize: size * 0.28, fontWeight: 700, color: C.ink }}>My shop</div>
        <div style={{ marginTop: size * 0.2, height: size * 1.8, borderRadius: size * 0.3, background: C.ink }} />
        <div style={{ marginTop: size * 0.2, height: size * 0.8, borderRadius: size * 0.2, background: "rgba(12,14,11,0.1)" }} />
      </div>
      <div
        style={{
          position: "absolute",
          left: size * 0.5,
          right: size * 0.5,
          top: "28%",
          opacity: p,
          transform: `translateY(${(1 - p) * size * 0.3}px) scale(${0.96 + p * 0.04})`,
        }}
      >
        <div
          style={{
            borderRadius: size * 0.36,
            background: "rgba(252,249,242,0.98)",
            border: "1px solid rgba(12,14,11,0.1)",
            boxShadow: "0 24px 50px rgba(12,14,11,0.22)",
            padding: size * 0.16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: size * 0.2 }}>
            <div
              style={{
                width: size * 0.62,
                height: size * 0.62,
                borderRadius: size * 0.18,
                background: C.green,
                display: "grid",
                placeItems: "center",
                color: C.white,
                fontSize: size * 0.3,
              }}
            >
              ◔
            </div>
            <div>
              <div style={{ fontFamily: MONO, fontSize: size * 0.14, letterSpacing: "0.12em", color: "rgba(12,14,11,0.42)" }}>
                POCKETLEDGER · NOW
              </div>
              <div style={{ fontFamily: FONT, fontSize: size * 0.24, fontWeight: 700, color: C.ink, marginTop: 2 }}>
                Finish today&apos;s records
              </div>
            </div>
          </div>
          <div style={{ marginTop: size * 0.22, fontFamily: FONT, fontSize: size * 0.19, lineHeight: 1.5, color: "rgba(12,14,11,0.6)" }}>
            Two minutes now saves an hour of guessing later.
          </div>
          <div
            style={{
              marginTop: size * 0.26,
              height: size * 0.6,
              borderRadius: size * 0.18,
              background: C.ink,
              color: C.white,
              display: "grid",
              placeItems: "center",
              fontFamily: FONT,
              fontSize: size * 0.19,
              fontWeight: 600,
            }}
          >
            Open
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: size * 0.48, textAlign: "center", fontFamily: MONO, fontSize: size * 0.13, letterSpacing: "0.08em", color: "rgba(12,14,11,0.32)" }}>
        ILLUSTRATIVE INTERFACE
      </div>
    </div>
  );
};

export const PocketLedgerPhone: React.FC<ScreenProps> = ({
  width,
  screen,
  screenStart = 0,
  amount = 12500,
  amountProgress = 0,
  successLabel = "Sale saved",
  successAmount = naira(12500),
  profitProgress = 0,
  press,
  style,
}) => {
  const size = width * 0.215;
  return (
    <PhoneFrame width={width} style={style}>
      {screen === "home" ? <HomeScreen size={size} press={press} screenStart={screenStart} /> : null}
      {screen === "sale" ? (
        <EntryScreen size={size} kind="sale" amount={amount} amountProgress={amountProgress} press={press} screenStart={screenStart} />
      ) : null}
      {screen === "expense" ? (
        <EntryScreen size={size} kind="expense" amount={amount} amountProgress={amountProgress} press={press} screenStart={screenStart} />
      ) : null}
      {screen === "personal" ? (
        <EntryScreen size={size} kind="personal" amount={amount} amountProgress={amountProgress} press={press} screenStart={screenStart} />
      ) : null}
      {screen === "summary" ? <SummaryScreen size={size} profitProgress={profitProgress} screenStart={screenStart} /> : null}
      {screen === "success" ? (
        <SuccessScreen size={size} label={successLabel} amount={successAmount} screenStart={screenStart} />
      ) : null}
      {screen === "reminder" ? <ReminderScreen size={size} screenStart={screenStart} /> : null}
    </PhoneFrame>
  );
};

/** Tap ripples at the four main action positions, scaled to the phone width. */
export const HomeTaps: React.FC<{ width: number; saleStart: number; expenseStart: number; personalStart: number; summaryStart: number }> = ({
  width,
  saleStart,
  expenseStart,
  personalStart,
  summaryStart,
}) => {
  const left = width * 0.5 - width * 0.43;
  return (
    <>
      <TapRipple x={left + width * 0.18} y={width * 1.32} start={saleStart} size={width * 0.16} />
      <TapRipple x={left + width * 0.47} y={width * 1.32} start={expenseStart} size={width * 0.16} color={C.cream} />
      <TapRipple x={left + width * 0.18} y={width * 1.62} start={personalStart} size={width * 0.16} color={C.amber} />
      <TapRipple x={left + width * 0.47} y={width * 1.62} start={summaryStart} size={width * 0.16} color={C.greenBright} />
    </>
  );
};

export const ScreenLabel: React.FC<{ size: number; children: ReactNode }> = ({ size, children }) => (
  <div
    style={{
      fontFamily: MONO,
      fontSize: size,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: C.muted,
    }}
  >
    {children}
  </div>
);
