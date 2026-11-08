import type { CSSProperties, ReactNode } from "react";
import { Img, staticFile } from "remotion";
import { C, COPY, FONT, MONO } from "../../config/garageflow";
import {
  GarageFlowLogo,
  GarageFlowMark,
  IconBell,
  IconCalendar,
  IconCamera,
  IconCard,
  IconCar,
  IconCheck,
  IconClipboard,
  IconGauge,
  IconLock,
  IconPhone,
  IconSearch,
  IconUser,
  IconWrench,
} from "./kit";

/* ------------------------------------------------------------------ */
/* Shared app chrome                                                   */
/* ------------------------------------------------------------------ */

const NAV = [
  { label: "Dashboard", icon: IconGauge },
  { label: "Jobs", icon: IconClipboard },
  { label: "Customers", icon: IconUser },
  { label: "Vehicles", icon: IconCar },
  { label: "Inspections", icon: IconCamera },
  { label: "Invoices", icon: IconCard },
] as const;

export const Sidebar: React.FC<{ active?: string }> = ({ active = "Jobs" }) => (
  <div
    style={{
      width: 178,
      flexShrink: 0,
      background: "linear-gradient(180deg, #0E1825 0%, #0A121C 100%)",
      display: "flex",
      flexDirection: "column",
      padding: "18px 14px 15px",
      borderRight: "1px solid rgba(255,255,255,0.05)",
    }}
  >
    <GarageFlowLogo size={14.5} />
    <div
      style={{
        marginTop: 8,
        fontFamily: MONO,
        fontSize: 6.6,
        letterSpacing: "0.2em",
        color: "rgba(182,194,209,0.42)",
      }}
    >
      WORKSHOP OS
    </div>

    <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 3 }}>
      {NAV.map(({ label, icon: Icon }) => {
        const on = label === active;
        return (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              height: 31,
              padding: "0 9px",
              borderRadius: 6,
              background: on ? "rgba(46,123,255,0.16)" : "transparent",
              border: `1px solid ${on ? "rgba(92,157,255,0.2)" : "transparent"}`,
              color: on ? C.white : "rgba(182,194,209,0.58)",
            }}
          >
            <Icon size={13} color={on ? C.blueBright : "rgba(182,194,209,0.5)"} strokeWidth={1.8} />
            <span style={{ fontFamily: FONT, fontSize: 9.6, fontWeight: on ? 600 : 500 }}>{label}</span>
            {label === "Jobs" ? (
              <span
                style={{
                  marginLeft: "auto",
                  fontFamily: MONO,
                  fontSize: 7,
                  color: on ? C.blueBright : C.dim,
                }}
              >
                6
              </span>
            ) : null}
          </div>
        );
      })}
    </div>

    <div style={{ marginTop: "auto" }}>
      <div
        style={{
          borderRadius: 7,
          border: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(255,255,255,0.03)",
          padding: "9px 9px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: "linear-gradient(145deg, #31527A, #16283E)",
            display: "grid",
            placeItems: "center",
            fontFamily: FONT,
            fontSize: 8.6,
            fontWeight: 700,
            color: C.white,
          }}
        >
          DM
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: FONT, fontSize: 8.4, fontWeight: 600, color: C.white }}>Dave Miller</div>
          <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.08em", color: "rgba(182,194,209,0.42)" }}>
            WORKSHOP MANAGER
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ContentHeader: React.FC<{
  title: string;
  meta?: string;
  right?: ReactNode;
}> = ({ title, meta, right }) => (
  <div
    style={{
      height: 52,
      flexShrink: 0,
      background: C.card,
      borderBottom: `1px solid ${C.uiLine}`,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 22px",
    }}
  >
    <div>
      <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 700, letterSpacing: "-0.02em", color: C.ink }}>
        {title}
      </div>
      {meta ? (
        <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: "0.1em", color: C.ink3, marginTop: 1.5 }}>
          {meta}
        </div>
      ) : null}
    </div>
    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
      {right}
      <div
        style={{
          width: 150,
          height: 27,
          borderRadius: 5,
          background: C.paper,
          border: `1px solid ${C.uiLine}`,
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 8px",
        }}
      >
        <IconSearch size={11} color={C.ink3} />
        <span style={{ fontFamily: FONT, fontSize: 8.2, color: C.ink3 }}>Search jobs, plates…</span>
      </div>
      <div style={{ position: "relative" }}>
        <IconBell size={15} color={C.ink2} />
        <span
          style={{
            position: "absolute",
            top: -2,
            right: -2,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: C.blue,
          }}
        />
      </div>
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "linear-gradient(145deg, #DFE9F5, #C2D3E7)",
          display: "grid",
          placeItems: "center",
          fontFamily: FONT,
          fontSize: 8.4,
          fontWeight: 700,
          color: C.ink2,
        }}
      >
        DM
      </div>
    </div>
  </div>
);

const AppBody: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div style={{ flex: 1, minHeight: 0, display: "flex", background: C.paper }}>{children}</div>
);

const Chip: React.FC<{
  children: ReactNode;
  color?: string;
  background?: string;
  border?: string;
  style?: CSSProperties;
}> = ({ children, color = C.blue, background = C.uiBlueSoft, border, style }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 4,
      padding: "3px 6px",
      borderRadius: 3,
      background,
      border: `1px solid ${border ?? "transparent"}`,
      fontFamily: MONO,
      fontSize: 6.6,
      fontWeight: 600,
      letterSpacing: "0.1em",
      color,
      lineHeight: 1,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {children}
  </span>
);

const Field: React.FC<{ label: string; value: ReactNode; style?: CSSProperties }> = ({
  label,
  value,
  style,
}) => (
  <div style={style}>
    <div style={{ fontFamily: MONO, fontSize: 6.4, letterSpacing: "0.12em", color: C.ink3 }}>{label}</div>
    <div style={{ marginTop: 2.5, fontFamily: FONT, fontSize: 9.2, fontWeight: 600, color: C.ink }}>{value}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Dashboard                                                           */
/* ------------------------------------------------------------------ */

const KPI = [
  { label: "TODAY'S REVENUE", value: "£2,860", note: "+ £440 from JC-2481", accent: C.blue },
  { label: "IN PROGRESS", value: "6", note: "3 bays occupied", accent: C.ink },
  { label: "AWAITING APPROVAL", value: "2", note: "Oldest 1h 12m", accent: C.amber },
  { label: "READY", value: "4", note: "2 collected today", accent: C.green },
];

const BOARD = [
  {
    title: "CHECKED IN",
    count: 3,
    cards: [
      { job: "JC-2484", car: "Ford Fiesta", plate: "YK18 FDS", note: "MOT + service", time: "08:55" },
      { job: "JC-2483", car: "Audi A3", plate: "LP69 WRT", note: "Clutch inspection", time: "08:40" },
      { job: "JC-2482", car: "Vauxhall Corsa", plate: "FD17 KMM", note: "Warning light", time: "08:31" },
    ],
  },
  {
    title: "INSPECTION",
    count: 2,
    cards: [
      { job: "JC-2481", car: "VW Golf GTI", plate: "GK19 XLR", note: "Brake noise", time: "09:05", hot: true },
      { job: "JC-2480", car: "BMW 320d", plate: "YE20 NNB", note: "Suspension knock", time: "09:18" },
    ],
  },
  {
    title: "AWAITING APPROVAL",
    count: 2,
    cards: [
      { job: "JC-2479", car: "Toyota Yaris", plate: "GX18 PLO", note: "£265 estimate", time: "10:12" },
      { job: "JC-2477", car: "Mini Cooper", plate: "OU17 TRV", note: "£380 estimate", time: "10:04" },
    ],
  },
  {
    title: "IN REPAIR",
    count: 2,
    cards: [
      { job: "JC-2478", car: "Skoda Octavia", plate: "MF16 CZX", note: "Timing belt", time: "10:44" },
      { job: "JC-2476", car: "Honda Civic", plate: "LR19 VBN", note: "Front brakes", time: "11:02" },
    ],
  },
];

export const DashboardScreen: React.FC = () => (
  <>
    <Sidebar active="Dashboard" />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <ContentHeader
        title="Tuesday, 12 May"
        meta="GOOD MORNING, DAVE  ·  7 JOBS TODAY"
        right={<Chip color={C.green} background={C.greenSoft}>ALL SYSTEMS LIVE</Chip>}
      />
      <AppBody>
        <div style={{ flex: 1, padding: "16px 18px 14px", display: "flex", flexDirection: "column", gap: 13 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9 }}>
            {KPI.map((item) => (
              <div
                key={item.label}
                style={{
                  borderRadius: 7,
                  background: C.card,
                  border: `1px solid ${C.uiLine}`,
                  padding: "9px 10px 10px",
                }}
              >
                <div style={{ fontFamily: MONO, fontSize: 6.3, letterSpacing: "0.1em", color: C.ink3 }}>
                  {item.label}
                </div>
                <div
                  style={{
                    marginTop: 3,
                    fontFamily: FONT,
                    fontSize: 21,
                    fontWeight: 700,
                    letterSpacing: "-0.04em",
                    color: item.accent,
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </div>
                <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 7.1, color: C.ink3 }}>{item.note}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: C.ink }}>Workshop board</span>
            <Chip color={C.blue} background={C.uiBlueSoft}>TODAY</Chip>
            <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.6, color: C.ink3 }}>DRAG TO MOVE · AUTO-SAVED</span>
          </div>

          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 9, minHeight: 0 }}>
            {BOARD.map((column) => (
              <div
                key={column.title}
                style={{
                  borderRadius: 7,
                  background: "rgba(255,255,255,0.5)",
                  border: `1px solid ${C.uiLine}`,
                  padding: "8px 7px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  minHeight: 0,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "0 2px 1px" }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: column.title === "AWAITING APPROVAL" ? C.amber : C.blue }} />
                  <span style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.08em", color: C.ink2 }}>{column.title}</span>
                  <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.2, color: C.ink3 }}>{column.count}</span>
                </div>
                {column.cards.map((card) => (
                  <div
                    key={card.job}
                    style={{
                      borderRadius: 5,
                      background: card.hot ? C.uiBlueSoft : C.card,
                      border: `1px solid ${card.hot ? "rgba(46,123,255,0.34)" : C.uiLine}`,
                      padding: "7px 7px 6px",
                      boxShadow: "0 1px 2px rgba(12,21,32,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontFamily: MONO, fontSize: 6.2, color: card.hot ? C.blue : C.ink3 }}>{card.job}</span>
                      <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6, color: C.ink3 }}>{card.time}</span>
                    </div>
                    <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 8.4, fontWeight: 600, color: C.ink }}>{card.car}</div>
                    <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.06em", color: C.ink3 }}>{card.plate}</div>
                    <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 7, color: C.ink2 }}>{card.note}</div>
                    {card.hot ? (
                      <div style={{ marginTop: 5, display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.blue }} />
                        <span style={{ fontFamily: MONO, fontSize: 5.9, letterSpacing: "0.08em", color: C.blue }}>INSPECTION OPEN</span>
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </AppBody>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/* Job card                                                            */
/* ------------------------------------------------------------------ */

export const JobCardScreen: React.FC<{ status?: string; approved?: boolean }> = ({
  status = "IN INSPECTION",
  approved = false,
}) => {
  const statusColor = status === "AWAITING APPROVAL" ? C.amber : status === "READY FOR COLLECTION" ? C.green : C.blue;
  const statusBg = status === "AWAITING APPROVAL" ? C.amberSoft : status === "READY FOR COLLECTION" ? C.greenSoft : C.uiBlueSoft;
  return (
  <>
    <Sidebar active="Jobs" />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <ContentHeader
        title={`Job ${COPY.demo.job}`}
        meta={`${COPY.demo.customer}  ·  ${COPY.demo.plate}  ·  CREATED 08:42`}
        right={<Chip color={statusColor} background={statusBg} border={`${statusColor}33`}>{status}</Chip>}
      />
      <AppBody>
        <div style={{ flex: 1, padding: "14px 17px", display: "grid", gridTemplateColumns: "1fr 236px", gap: 12 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
            <div
              style={{
                borderRadius: 7,
                background: C.card,
                border: `1px solid ${C.uiLine}`,
                padding: "11px 12px",
                display: "grid",
                gridTemplateColumns: "1.2fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontFamily: MONO, fontSize: 6.3, letterSpacing: "0.1em", color: C.ink3 }}>CUSTOMER</div>
                <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 11.5, fontWeight: 700, color: C.ink }}>
                  {COPY.demo.customer}
                </div>
                <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 7.6, color: C.ink2 }}>{COPY.demo.phone}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 5 }}>
                  <Chip color={C.green} background={C.greenSoft}>SMS UPDATES ON</Chip>
                  <Chip color={C.ink2} background={C.paper}>RETURNING</Chip>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 6.3, letterSpacing: "0.1em", color: C.ink3 }}>VEHICLE</div>
                <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 10.2, fontWeight: 700, color: C.ink }}>
                  {COPY.demo.vehicle}
                </div>
                <div style={{ marginTop: 3, display: "flex", gap: 10 }}>
                  <Field label="REG" value={COPY.demo.plate} />
                  <Field label="MILEAGE" value={COPY.demo.mileage} />
                </div>
              </div>
            </div>

            <div
              style={{
                borderRadius: 7,
                background: C.card,
                border: `1px solid ${C.uiLine}`,
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconWrench size={12} color={C.blue} />
                <span style={{ fontFamily: MONO, fontSize: 6.4, letterSpacing: "0.1em", color: C.ink3 }}>REPORTED CONCERN</span>
              </div>
              <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 10.4, fontWeight: 600, color: C.ink }}>
                {COPY.demo.concern}
              </div>
              <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 7.3, color: C.ink3 }}>
                Customer reports a grinding noise when braking at low speed. Road test completed.
              </div>
            </div>

            <div
              style={{
                flex: 1,
                borderRadius: 7,
                background: C.card,
                border: `1px solid ${C.uiLine}`,
                padding: "10px 12px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconClipboard size={12} color={C.blue} />
                <span style={{ fontFamily: MONO, fontSize: 6.4, letterSpacing: "0.1em", color: C.ink3 }}>JOB CHECKLIST</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.2, color: C.green }}>{approved ? "4 OF 4 COMPLETE" : "3 OF 4 COMPLETE"}</span>
              </div>
              <div style={{ marginTop: 7, display: "flex", flexDirection: "column" }}>
                {[
                  ["Vehicle checked in", "08:42", true],
                  ["Inspection completed", "09:05", true],
                  ["Estimate prepared", "10:12", true],
                  ["Customer approval", approved ? "10:42" : "PENDING", approved],
                ].map(([label, time, done]) => (
                  <div
                    key={String(label)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5.5px 0",
                      borderTop: `1px solid ${label === "Vehicle checked in" ? "transparent" : C.uiLineSoft}`,
                    }}
                  >
                    <span
                      style={{
                        width: 11,
                        height: 11,
                        borderRadius: "50%",
                        background: done ? C.blue : "transparent",
                        border: `1px solid ${done ? C.blue : C.uiLine}`,
                        display: "grid",
                        placeItems: "center",
                      }}
                    >
                      {done ? <IconCheck size={7} color="#fff" strokeWidth={3} /> : null}
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: 7.8, color: done ? C.ink : C.ink3 }}>{label}</span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: MONO,
                        fontSize: 6.2,
                        color: done ? C.ink3 : C.amber,
                      }}
                    >
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                borderRadius: 7,
                background: "linear-gradient(160deg, #F7FAFF 0%, #EDF3FC 100%)",
                border: "1px solid rgba(46,123,255,0.2)",
                padding: "11px 11px 12px",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.1em", color: C.blue }}>ESTIMATE</div>
              <div style={{ marginTop: 3, display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: FONT, fontSize: 27, fontWeight: 700, letterSpacing: "-0.05em", color: C.ink }}>£440</span>
                <span style={{ fontFamily: MONO, fontSize: 6.4, color: C.ink3 }}>INC. VAT</span>
              </div>
              <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 7.1, color: C.ink2 }}>Front brake overhaul</div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4.5 }}>
                {COPY.demo.lineItems.map((item) => (
                  <div key={item.label} style={{ display: "flex", justifyContent: "space-between", gap: 6 }}>
                    <span style={{ fontFamily: FONT, fontSize: 7.1, color: C.ink2 }}>{item.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 6.8, color: C.ink }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 9,
                  height: 24,
                  borderRadius: 4,
                  background: C.blue,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: FONT,
                  fontSize: 7.4,
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.04em",
                }}
              >
                SEND TO CUSTOMER
              </div>
            </div>

            <div
              style={{
                borderRadius: 7,
                background: C.card,
                border: `1px solid ${C.uiLine}`,
                padding: "10px 11px",
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.1em", color: C.ink3 }}>ASSIGNED TO</div>
              <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 23,
                    height: 23,
                    borderRadius: "50%",
                    background: "linear-gradient(145deg, #CCE0F8, #9EBDDF)",
                    display: "grid",
                    placeItems: "center",
                    fontFamily: FONT,
                    fontSize: 7.8,
                    fontWeight: 700,
                    color: C.ink2,
                  }}
                >
                  JM
                </div>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 8.2, fontWeight: 600, color: C.ink }}>James Morgan</div>
                  <div style={{ fontFamily: MONO, fontSize: 6, color: C.ink3 }}>TECHNICIAN · BAY 2</div>
                </div>
              </div>
              <div style={{ marginTop: 8, borderTop: `1px solid ${C.uiLineSoft}`, paddingTop: 7 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONT, fontSize: 7, color: C.ink3 }}>Photos</span>
                  <span style={{ fontFamily: MONO, fontSize: 6.6, color: C.ink }}>4</span>
                </div>
                <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONT, fontSize: 7, color: C.ink3 }}>Customer views</span>
                  <span style={{ fontFamily: MONO, fontSize: 6.6, color: C.ink }}>2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppBody>
    </div>
  </>
  );
};

/* ------------------------------------------------------------------ */
/* Inspection                                                          */
/* ------------------------------------------------------------------ */

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const color = status === "REPLACE" ? C.amber : status === "PASS" ? C.green : C.ink2;
  const bg = status === "REPLACE" ? C.amberSoft : status === "PASS" ? C.greenSoft : C.paper;
  return <Chip color={color} background={bg}>{status}</Chip>;
};

const Thumb: React.FC<{ src: string; label: string; position?: string }> = ({ src, label, position = "50% 50%" }) => (
  <div style={{ position: "relative", borderRadius: 5, overflow: "hidden", background: C.graphite2, aspectRatio: "4 / 3" }}>
    <Img
      src={staticFile(`images/garageflow/${src}`)}
      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: position, filter: "saturate(0.55) contrast(1.05) brightness(0.82)" }}
    />
    <div style={{ position: "absolute", left: 5, bottom: 4, padding: "2px 4px", borderRadius: 2, background: "rgba(5,9,15,0.7)", fontFamily: MONO, fontSize: 5.4, letterSpacing: "0.08em", color: "#fff" }}>
      {label}
    </div>
  </div>
);

export const InspectionScreen: React.FC<{ sent?: number }> = ({ sent = 0 }) => (
  <>
    <Sidebar active="Inspections" />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <ContentHeader
        title={`Inspection  ·  ${COPY.demo.job}`}
        meta={`${COPY.demo.vehicleShort}  ·  ${COPY.demo.plate}  ·  JAMES MORGAN`}
        right={<Chip color={C.blue} background={C.uiBlueSoft}>{sent > 0 ? "ESTIMATE SENT" : "4 PHOTOS · 1 VIDEO"}</Chip>}
      />
      <AppBody>
        <div style={{ flex: 1, padding: "13px 16px", display: "grid", gridTemplateColumns: "1fr 258px", gap: 11 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, minWidth: 0 }}>
            <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "10px 11px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconCamera size={12} color={C.blue} />
                <span style={{ fontFamily: MONO, fontSize: 6.4, letterSpacing: "0.1em", color: C.ink3 }}>PHOTO EVIDENCE</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.1, color: C.ink3 }}>UPLOADED 09:05</span>
              </div>
              <div style={{ marginTop: 7, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
                <Thumb src="brake-worn.jpg" label="FRONT BRAKE · OSF" />
                <Thumb src="mechanic-suspension.jpg" label="UNDERSIDE · NS" position="50% 45%" />
                <Thumb src="hammers.jpg" label="TOOL CHECK" position="50% 40%" />
              </div>
            </div>

            <div style={{ flex: 1, borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "9px 11px", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <IconClipboard size={12} color={C.blue} />
                <span style={{ fontFamily: MONO, fontSize: 6.4, letterSpacing: "0.1em", color: C.ink3 }}>INSPECTION CHECKLIST</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.1, color: C.ink3 }}>FRONT BRAKE OVERHAUL</span>
              </div>
              <div style={{ marginTop: 5, display: "flex", flexDirection: "column" }}>
                {COPY.demo.checks.map((check, index) => (
                  <div
                    key={check.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6.2px 0",
                      borderTop: `1px solid ${index === 0 ? "transparent" : C.uiLineSoft}`,
                    }}
                  >
                    <span style={{ fontFamily: FONT, fontSize: 7.9, fontWeight: 600, color: C.ink, width: 90 }}>{check.label}</span>
                    <span style={{ fontFamily: FONT, fontSize: 7.1, color: C.ink3, flex: 1 }}>{check.detail}</span>
                    <StatusPill status={check.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div
              style={{
                borderRadius: 7,
                background: "linear-gradient(160deg, #F7FAFF 0%, #EDF3FC 100%)",
                border: "1px solid rgba(46,123,255,0.2)",
                padding: "10px 11px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <IconWrench size={12} color={C.blue} />
                <span style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.1em", color: C.blue }}>ESTIMATE</span>
                <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6, color: C.ink3 }}>VAT INCLUDED</span>
              </div>
              <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 28, fontWeight: 700, letterSpacing: "-0.05em", color: C.ink, lineHeight: 1 }}>£440</div>
              <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 7.2, color: C.ink3 }}>Ready in 1 working day</div>
              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 4 }}>
                {COPY.demo.lineItems.map((item) => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ fontFamily: FONT, fontSize: 7.1, color: C.ink2, flex: 1 }}>{item.label}</span>
                    <span style={{ fontFamily: MONO, fontSize: 6.9, color: C.ink }}>{item.value}</span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: 9,
                  height: 26,
                  borderRadius: 4,
                  background: sent > 0 ? C.green : C.blue,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: FONT,
                  fontSize: 7.4,
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "0.04em",
                  transition: "background 0.2s",
                }}
              >
                {sent > 0 ? "SENT TO EMMA · SMS + EMAIL" : "SEND ESTIMATE TO CUSTOMER"}
              </div>
            </div>

            <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "9px 11px" }}>
              <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.1em", color: C.ink3 }}>CUSTOMER PREVIEW</div>
              <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 8.2, fontWeight: 600, color: C.ink }}>“Brake pads are at 3 mm.”</div>
              <div style={{ marginTop: 3, fontFamily: FONT, fontSize: 7, lineHeight: 1.45, color: C.ink3 }}>
                Photos, measurements and the itemised price are attached to the approval link.
              </div>
              <div style={{ marginTop: 7, display: "flex", alignItems: "center", gap: 5 }}>
                <IconCheck size={10} color={C.green} strokeWidth={2.4} />
                <span style={{ fontFamily: MONO, fontSize: 6.1, letterSpacing: "0.08em", color: C.green }}>CUSTOMER CAN REPLY IN THREAD</span>
              </div>
            </div>
          </div>
        </div>
      </AppBody>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/* Status timeline                                                     */
/* ------------------------------------------------------------------ */

export const TimelineScreen: React.FC<{ active?: number }> = ({ active = 4 }) => (
  <>
    <Sidebar active="Jobs" />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <ContentHeader
        title={`Job ${COPY.demo.job}`}
        meta={`${COPY.demo.customer}  ·  ${COPY.demo.vehicleShort}  ·  ${COPY.demo.plate}`}
        right={<Chip color={C.green} background={C.greenSoft}>READY FOR COLLECTION</Chip>}
      />
      <AppBody>
        <div style={{ flex: 1, padding: "14px 17px", display: "grid", gridTemplateColumns: "1fr 246px", gap: 12 }}>
          <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "13px 15px", minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <IconGauge size={13} color={C.blue} />
              <span style={{ fontFamily: MONO, fontSize: 6.5, letterSpacing: "0.1em", color: C.ink3 }}>JOB TIMELINE</span>
              <span style={{ marginLeft: "auto", fontFamily: MONO, fontSize: 6.2, color: C.ink3 }}>EVERY UPDATE IS SHARED WITH THE CUSTOMER</span>
            </div>
            <div style={{ marginTop: 11, position: "relative" }}>
              <div style={{ position: "absolute", left: 7, top: 8, bottom: 16, width: 1, background: C.uiLine }} />
              <div style={{ position: "absolute", left: 7, top: 8, height: `${(Math.min(active, 4) / 4) * 100}%`, width: 1, background: C.blue }} />
              {COPY.demo.timeline.map((item, index) => {
                const done = index <= active;
                const current = index === active;
                return (
                  <div key={item.label} style={{ display: "flex", gap: 11, padding: "0 0 14px", position: "relative" }}>
                    <div
                      style={{
                        width: 15,
                        height: 15,
                        borderRadius: "50%",
                        background: done ? C.blue : C.card,
                        border: `2px solid ${done ? C.blue : C.uiLine}`,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                        zIndex: 1,
                        boxShadow: current ? `0 0 0 4px ${C.uiBlueSoft}` : "none",
                      }}
                    >
                      {done ? <IconCheck size={8} color="#fff" strokeWidth={3.2} /> : null}
                    </div>
                    <div style={{ flex: 1, display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontFamily: FONT, fontSize: 9.4, fontWeight: current ? 700 : 600, color: done ? C.ink : C.ink3 }}>
                        {item.label}
                      </span>
                      <span style={{ fontFamily: MONO, fontSize: 6.6, color: done ? C.blue : C.ink3 }}>{item.time}</span>
                      <span style={{ marginLeft: "auto", fontFamily: FONT, fontSize: 6.9, color: C.ink3 }}>{item.note}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "11px 12px" }}>
              <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.1em", color: C.ink3 }}>CUSTOMER VIEW</div>
              <div style={{ marginTop: 6, fontFamily: FONT, fontSize: 9.8, fontWeight: 600, color: C.ink, lineHeight: 1.35 }}>
                “Your Golf is ready to collect.”
              </div>
              <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 7.1, color: C.ink3 }}>SMS + email sent at 15:20</div>
              <div style={{ marginTop: 8, borderRadius: 5, background: C.paper, border: `1px solid ${C.uiLineSoft}`, padding: "7px 8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.green }} />
                  <span style={{ fontFamily: MONO, fontSize: 5.9, letterSpacing: "0.08em", color: C.green }}>DELIVERED · OPENED 15:21</span>
                </div>
                <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 6.9, lineHeight: 1.4, color: C.ink2 }}>
                  “We've replaced the front pads and discs. Your invoice is attached — pay online or at collection.”
                </div>
              </div>
            </div>

            <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 7.4, color: C.ink3 }}>Total approved</span>
                <span style={{ fontFamily: MONO, fontSize: 7.4, color: C.ink }}>£440</span>
              </div>
              <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 7.4, color: C.ink3 }}>Approved by</span>
                <span style={{ fontFamily: FONT, fontSize: 7.4, color: C.ink }}>Emma Clarke</span>
              </div>
              <div style={{ marginTop: 5, display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: FONT, fontSize: 7.4, color: C.ink3 }}>Approved at</span>
                <span style={{ fontFamily: MONO, fontSize: 7, color: C.ink }}>10:42</span>
              </div>
            </div>
          </div>
        </div>
      </AppBody>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/* Invoice                                                             */
/* ------------------------------------------------------------------ */

export const InvoiceScreen: React.FC<{ paid?: number }> = ({ paid = 0 }) => (
  <>
    <Sidebar active="Invoices" />
    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
      <ContentHeader
        title={`Invoice  ·  ${COPY.demo.invoice}`}
        meta={`JOB ${COPY.demo.job}  ·  ${COPY.demo.customer}  ·  12 MAY 2026`}
        right={<Chip color={paid > 0 ? C.green : C.amber} background={paid > 0 ? C.greenSoft : C.amberSoft}>{paid > 0 ? "PAID" : "PAYMENT LINK SENT"}</Chip>}
      />
      <AppBody>
        <div style={{ flex: 1, padding: "14px 17px", display: "grid", gridTemplateColumns: "1fr 248px", gap: 12 }}>
          <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "13px 16px", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <div>
                <GarageFlowLogo size={12} />
                <div style={{ marginTop: 5, fontFamily: MONO, fontSize: 5.9, letterSpacing: "0.1em", color: C.ink3 }}>
                  14 HIGH STREET  ·  MANCHESTER M4 1HQ
                </div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.12em", color: C.ink3 }}>INVOICE</div>
                <div style={{ fontFamily: MONO, fontSize: 10, fontWeight: 600, color: C.ink }}>{COPY.demo.invoice}</div>
              </div>
            </div>

            <div style={{ marginTop: 13, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Field label="BILLED TO" value={COPY.demo.customer} />
              <Field label="VEHICLE" value={`${COPY.demo.vehicleShort} · ${COPY.demo.plate}`} />
            </div>

            <div style={{ marginTop: 12, borderTop: `1px solid ${C.uiLine}`, paddingTop: 8 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 52px 60px", gap: 6, paddingBottom: 4 }}>
                {["DESCRIPTION", "DETAIL", "AMOUNT"].map((head, i) => (
                  <span key={head} style={{ fontFamily: MONO, fontSize: 5.9, letterSpacing: "0.08em", color: C.ink3, textAlign: i === 2 ? "right" : "left" }}>
                    {head}
                  </span>
                ))}
              </div>
              {COPY.demo.lineItems.map((item) => (
                <div key={item.label} style={{ display: "grid", gridTemplateColumns: "1fr 52px 60px", gap: 6, padding: "6px 0", borderTop: `1px solid ${C.uiLineSoft}` }}>
                  <span style={{ fontFamily: FONT, fontSize: 7.7, fontWeight: 500, color: C.ink }}>{item.label}</span>
                  <span style={{ fontFamily: FONT, fontSize: 7, color: C.ink3 }}>{item.detail}</span>
                  <span style={{ fontFamily: MONO, fontSize: 7.1, color: C.ink, textAlign: "right" }}>{item.value}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: "auto", paddingTop: 9, borderTop: `1px solid ${C.uiLine}`, display: "flex", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontFamily: MONO, fontSize: 6, color: C.ink3 }}>PAYMENT</div>
                <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 7.2, color: C.ink2 }}>{paid > 0 ? COPY.demo.method : "Awaiting payment"}</div>
              </div>
              <div style={{ marginLeft: "auto", textAlign: "right" }}>
                <div style={{ fontFamily: MONO, fontSize: 6, letterSpacing: "0.08em", color: C.ink3 }}>TOTAL PAID</div>
                <div style={{ fontFamily: FONT, fontSize: 26, fontWeight: 700, letterSpacing: "-0.05em", color: paid > 0 ? C.green : C.ink, lineHeight: 1.05 }}>
                  {COPY.demo.paid}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div
              style={{
                borderRadius: 7,
                background: paid > 0 ? "linear-gradient(160deg, #F1FBF7 0%, #E7F7F0 100%)" : C.card,
                border: `1px solid ${paid > 0 ? "rgba(57,199,155,0.28)" : C.uiLine}`,
                padding: "12px 12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: paid > 0 ? C.green : C.paper,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {paid > 0 ? <IconCheck size={12} color="#fff" strokeWidth={3} /> : <IconCard size={12} color={C.blue} />}
                </span>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: 9.2, fontWeight: 700, color: C.ink }}>{paid > 0 ? "Payment received" : "Payment link sent"}</div>
                  <div style={{ fontFamily: MONO, fontSize: 6, color: C.ink3 }}>{paid > 0 ? "11:08 · CARD PAYMENT" : "SMS + EMAIL · 15:20"}</div>
                </div>
              </div>
              <div style={{ marginTop: 9, borderRadius: 5, background: "rgba(255,255,255,0.7)", border: `1px solid ${C.uiLineSoft}`, padding: "7px 8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONT, fontSize: 7, color: C.ink3 }}>Method</span>
                  <span style={{ fontFamily: MONO, fontSize: 6.8, color: C.ink }}>{COPY.demo.method}</span>
                </div>
                <div style={{ marginTop: 4, display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: FONT, fontSize: 7, color: C.ink3 }}>Reference</span>
                  <span style={{ fontFamily: MONO, fontSize: 6.6, color: C.ink }}>GF-8841-2210</span>
                </div>
              </div>
            </div>

            <div style={{ borderRadius: 7, background: C.card, border: `1px solid ${C.uiLine}`, padding: "11px 12px" }}>
              <div style={{ fontFamily: MONO, fontSize: 6.1, letterSpacing: "0.1em", color: C.ink3 }}>TODAY'S REVENUE</div>
              <div style={{ marginTop: 4, fontFamily: FONT, fontSize: 24, fontWeight: 700, letterSpacing: "-0.05em", color: C.ink }}>
                {paid > 0 ? COPY.demo.revenueAfter : COPY.demo.revenueBefore}
              </div>
              <div style={{ marginTop: 2, fontFamily: MONO, fontSize: 6.2, color: paid > 0 ? C.green : C.ink3 }}>
                {paid > 0 ? "+ £440  ·  14 JOBS" : "12 JOBS  ·  £440 PENDING"}
              </div>
              <div style={{ marginTop: 8, height: 4, borderRadius: 2, background: C.paper2, overflow: "hidden" }}>
                <div style={{ width: paid > 0 ? "88%" : "76%", height: "100%", background: paid > 0 ? C.green : C.blue, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        </div>
      </AppBody>
    </div>
  </>
);

/* ------------------------------------------------------------------ */
/* Customer phone screens                                              */
/* ------------------------------------------------------------------ */

const PhoneStatus: React.FC = () => (
  <div
    style={{
      height: 30,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 20px",
      fontFamily: FONT,
      fontSize: 10,
      fontWeight: 600,
      color: C.ink,
    }}
  >
    <span>9:41</span>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span style={{ fontSize: 9, fontWeight: 700 }}>5G</span>
      <div style={{ width: 18, height: 8, borderRadius: 2, border: `1px solid ${C.ink}`, padding: 1 }}>
        <div style={{ width: "76%", height: "100%", borderRadius: 1, background: C.green }} />
      </div>
    </div>
  </div>
);

const PhoneNav: React.FC<{ label: string }> = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 18px 10px" }}>
    <span style={{ fontSize: 16, color: C.ink3, lineHeight: 1 }}>‹</span>
    <span style={{ fontFamily: FONT, fontSize: 12.5, fontWeight: 700, color: C.ink }}>{label}</span>
    <div style={{ marginLeft: "auto" }}>
      <GarageFlowMark size={22} />
    </div>
  </div>
);

export const BookingPhoneScreen: React.FC<{ confirmed?: number }> = ({ confirmed = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: C.paper, fontFamily: FONT }}>
    <PhoneStatus />
    <PhoneNav label="Book a repair" />
    <div style={{ padding: "2px 18px 0" }}>
      <div style={{ fontFamily: MONO, fontSize: 7, letterSpacing: "0.14em", color: C.blue }}>NEW BOOKING</div>
      <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 23, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.08, color: C.ink }}>
        What can we
        <br />
        look at?
      </div>

      <div style={{ marginTop: 14, borderRadius: 10, background: C.card, border: `1px solid ${C.uiLine}`, padding: "11px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 30, height: 30, borderRadius: 7, background: C.uiBlueSoft, display: "grid", placeItems: "center" }}>
            <IconCar size={17} color={C.blue} />
          </div>
          <div>
            <div style={{ fontFamily: FONT, fontSize: 10.4, fontWeight: 700, color: C.ink }}>{COPY.demo.vehicleShort}</div>
            <div style={{ fontFamily: MONO, fontSize: 7, color: C.ink3 }}>{COPY.demo.plate} · {COPY.demo.mileage}</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 6.8, letterSpacing: "0.12em", color: C.ink3 }}>WHAT'S HAPPENING?</div>
      <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {["Brake noise", "Warning light", "Service", "Tyre", "Something else"].map((item, i) => (
          <span
            key={item}
            style={{
              padding: "6px 9px",
              borderRadius: 20,
              background: i === 0 ? C.blue : C.card,
              border: `1px solid ${i === 0 ? C.blue : C.uiLine}`,
              fontFamily: FONT,
              fontSize: 8,
              fontWeight: 500,
              color: i === 0 ? "#fff" : C.ink2,
            }}
          >
            {item}
          </span>
        ))}
      </div>

      <div style={{ marginTop: 12, fontFamily: MONO, fontSize: 6.8, letterSpacing: "0.12em", color: C.ink3 }}>PICK A TIME</div>
      <div style={{ marginTop: 6, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
        {[
          ["TUE 12", "09:00"],
          ["TUE 12", "11:30"],
          ["WED 13", "08:30"],
        ].map(([day, time], i) => (
          <div
            key={`${day}-${time}`}
            style={{
              borderRadius: 7,
              background: i === 0 ? C.uiBlueSoft : C.card,
              border: `1px solid ${i === 0 ? "rgba(46,123,255,0.34)" : C.uiLine}`,
              padding: "7px 3px",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: MONO, fontSize: 6.2, color: i === 0 ? C.blue : C.ink3 }}>{day}</div>
            <div style={{ marginTop: 2, fontFamily: FONT, fontSize: 9, fontWeight: 700, color: C.ink }}>{time}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, borderRadius: 8, background: C.card, border: `1px solid ${C.uiLine}`, padding: "9px 10px", display: "flex", gap: 7 }}>
        <IconPhone size={13} color={C.blue} />
        <div style={{ fontFamily: FONT, fontSize: 7.4, lineHeight: 1.4, color: C.ink2 }}>
          We'll text you when your car is checked in, inspected and ready.
        </div>
      </div>
    </div>

    <div style={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
      <div
        style={{
          height: 40,
          borderRadius: 9,
          background: confirmed > 0 ? C.green : C.blue,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: FONT,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.03em",
          color: "#fff",
          boxShadow: `0 8px 20px ${confirmed > 0 ? C.green : C.blue}33`,
        }}
      >
        {confirmed > 0 ? <IconCheck size={14} color="#fff" strokeWidth={3} /> : null}
        {confirmed > 0 ? "BOOKING CONFIRMED" : "REQUEST BOOKING"}
      </div>
      <div style={{ marginTop: 8, textAlign: "center", fontFamily: MONO, fontSize: 6.4, letterSpacing: "0.08em", color: C.ink3 }}>
        NO PAYMENT NEEDED TO BOOK
      </div>
    </div>
  </div>
);

export const ApprovalPhoneScreen: React.FC<{ approved?: number }> = ({ approved = 0 }) => {
  const done = approved > 0.55;
  return (
    <div style={{ position: "absolute", inset: 0, background: C.paper, fontFamily: FONT }}>
      <PhoneStatus />
      <div style={{ padding: "4px 18px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GarageFlowMark size={24} />
          <div>
            <div style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.12em", color: C.blue }}>GARAGEFLOW</div>
            <div style={{ fontFamily: FONT, fontSize: 8.6, fontWeight: 600, color: C.ink }}>Update from Manchester Auto</div>
          </div>
        </div>

        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 6.8, letterSpacing: "0.12em", color: C.ink3 }}>
          JOB {COPY.demo.job} · {COPY.demo.plate}
        </div>
        <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 22, fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.1, color: C.ink }}>
          Your estimate
          <br />
          is ready.
        </div>
        <div style={{ marginTop: 5, fontFamily: FONT, fontSize: 8.2, lineHeight: 1.45, color: C.ink2 }}>
          We found worn front brake pads and scored discs. Here's exactly what we recommend.
        </div>
      </div>

      <div style={{ margin: "12px 18px 0", borderRadius: 10, overflow: "hidden", border: `1px solid ${C.uiLine}`, background: C.card }}>
        <div style={{ position: "relative", height: 92 }}>
          <Img
            src={staticFile("images/garageflow/brake-worn.jpg")}
            style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.55) contrast(1.06) brightness(0.86)" }}
          />
          <div style={{ position: "absolute", left: 8, bottom: 7, padding: "3px 6px", borderRadius: 3, background: "rgba(5,9,15,0.72)", fontFamily: MONO, fontSize: 6, color: "#fff", letterSpacing: "0.08em" }}>
            FRONT BRAKE · PHOTO 1 OF 4
          </div>
        </div>
        <div style={{ padding: "10px 12px 12px" }}>
          {COPY.demo.lineItems.map((item) => (
            <div key={item.label} style={{ display: "flex", justifyContent: "space-between", padding: "3px 0" }}>
              <span style={{ fontFamily: FONT, fontSize: 8.2, color: C.ink2 }}>{item.label}</span>
              <span style={{ fontFamily: MONO, fontSize: 8, color: C.ink }}>{item.value}</span>
            </div>
          ))}
          <div style={{ marginTop: 7, paddingTop: 7, borderTop: `1px solid ${C.uiLine}`, display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <span style={{ fontFamily: MONO, fontSize: 6.6, letterSpacing: "0.1em", color: C.ink3 }}>TOTAL</span>
            <span style={{ fontFamily: FONT, fontSize: 23, fontWeight: 700, letterSpacing: "-0.05em", color: C.ink }}>£440</span>
          </div>
        </div>
      </div>

      <div style={{ margin: "10px 18px 0", display: "flex", alignItems: "center", gap: 6 }}>
        <IconCalendar size={12} color={C.blue} />
        <span style={{ fontFamily: FONT, fontSize: 7.2, color: C.ink2 }}>Ready in 1 working day · no hidden extras</span>
      </div>

      <div style={{ position: "absolute", left: 18, right: 18, bottom: 18 }}>
        <div
          style={{
            height: 42,
            borderRadius: 9,
            background: done ? C.green : C.blue,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            fontFamily: FONT,
            fontSize: 10.2,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "#fff",
            boxShadow: `0 10px 24px ${done ? C.green : C.blue}38`,
          }}
        >
          {done ? <IconCheck size={14} color="#fff" strokeWidth={3} /> : null}
          {done ? "APPROVED · THANK YOU" : COPY.demo.approve}
        </div>
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
          <IconLock size={9} color={C.ink3} />
          <span style={{ fontFamily: MONO, fontSize: 6.2, letterSpacing: "0.07em", color: C.ink3 }}>
            SECURE APPROVAL · NO PAYMENT YET
          </span>
        </div>
      </div>
    </div>
  );
};
