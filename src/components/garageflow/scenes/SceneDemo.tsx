import { AbsoluteFill } from "remotion";
import { BEATS, C, COPY, FONT, MONO } from "../../../config/garageflow";
import {
  AppFrame,
  clamp,
  Glow,
  Grain,
  GridField,
  Kicker,
  MaskLine,
  Mono,
  PhoneFrame,
  Photo,
  progress,
  Sweep,
  Tag,
  useTime,
  Vignette,
} from "../kit";
import {
  ApprovalPhoneScreen,
  BookingPhoneScreen,
  InspectionScreen,
  InvoiceScreen,
  JobCardScreen,
  TimelineScreen,
} from "../ui";

const phaseOpacity = (t: number, start: number, end: number, fade = 0.35) => {
  const inn = progress(t, start, fade);
  const out = 1 - progress(t, end, fade);
  return clamp(Math.min(inn, out));
};

type Phase = {
  label: string;
  start: number;
  end: number;
};

const PHASES: Phase[] = [
  { label: COPY.demo.stepLabels.booking, start: 0, end: 2.3 },
  { label: COPY.demo.stepLabels.card, start: 2.3, end: 4.75 },
  { label: COPY.demo.stepLabels.inspection, start: 4.75, end: 9.2 },
  { label: COPY.demo.stepLabels.approval, start: 9.2, end: 13.4 },
  { label: COPY.demo.stepLabels.timeline, start: 13.4, end: 17.45 },
  { label: COPY.demo.stepLabels.invoice, start: 17.45, end: 24 },
];

export const SceneDemo: React.FC<{ wide: boolean }> = ({ wide }) => {
  const { t } = useTime();
  const activePhase = PHASES.find((phase) => t >= phase.start && t < phase.end) ?? PHASES[PHASES.length - 1];
  const bookingOut = 1 - progress(t, 2.15, 0.3);
  const appIn = progress(t, 2.25, 0.5);
  const approved = t >= 10.15;
  const sent = progress(t, 6.65, 0.4);
  const timelineActive = Math.min(4, Math.max(0, Math.floor((t - 13.4) / 0.72)));
  const paid = t >= 20.1 ? 1 : 0;
  const showPhone = t >= 9.15 && t < 13.45;
  const phoneIn = progress(t, 9.2, 0.5);

  const appWidth = wide ? (showPhone ? 1080 : 1200) : 960;
  const appTop = wide ? 168 : 292;
  const appLeft = wide ? (showPhone ? 96 : (1920 - appWidth) / 2) : 60;

  const windows: Array<{ key: string; start: number; end: number; node: React.ReactNode }> = [
    {
      key: "card",
      start: 2.3,
      end: 4.75,
      node: <JobCardScreen status={t >= 4.6 ? "INSPECTION COMPLETE" : "IN INSPECTION"} />,
    },
    {
      key: "inspection",
      start: 4.75,
      end: 9.2,
      node: <InspectionScreen sent={sent > 0.2 ? 1 : 0} />,
    },
    {
      key: "approval",
      start: 9.2,
      end: 13.4,
      node: <JobCardScreen status={approved ? "APPROVED · IN REPAIR" : "AWAITING APPROVAL"} approved={approved} />,
    },
    {
      key: "timeline",
      start: 13.4,
      end: 17.45,
      node: <TimelineScreen active={timelineActive} />,
    },
    {
      key: "invoice",
      start: 17.45,
      end: 24,
      node: <InvoiceScreen paid={paid} />,
    },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Photo
        src="mechanic-suspension.jpg"
        position={wide ? "18% 45%" : "50% 24%"}
        brightness={0.32}
        saturation={0.42}
        style={{ opacity: wide ? 0.26 : 0.18 }}
      />
      <AbsoluteFill
        style={{
          background: wide
            ? "linear-gradient(90deg, rgba(5,9,15,0.95) 0%, rgba(5,9,15,0.72) 34%, rgba(5,9,15,0.94) 100%)"
            : "linear-gradient(180deg, rgba(5,9,15,0.86) 0%, rgba(5,9,15,0.92) 48%, rgba(5,9,15,0.99) 100%)",
        }}
      />
      <Glow x={wide ? "72%" : "50%"} y="62%" size={54} color={C.blue} opacity={0.14} />
      <GridField opacity={0.34} size={wide ? 96 : 74} />
      <Sweep start={9.15} duration={1.4} color={C.blueBright} opacity={0.1} />
      <Sweep start={17.4} duration={1.4} color={C.blueBright} opacity={0.08} />

      <div
        style={{
          position: "absolute",
          left: wide ? 104 : 70,
          right: wide ? 104 : 70,
          top: wide ? 58 : 100,
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        <div>
          <Kicker start={0.1} color={C.silver} rule={C.blue}>
            GARAGEFLOW  ·  LIVE WORKFLOW
          </Kicker>
          <div style={{ marginTop: 9, display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.green, boxShadow: `0 0 8px ${C.green}` }} />
            <Mono size={wide ? 8.5 : 8} color={C.green} style={{ letterSpacing: "0.16em" }}>
              WORKSHOP LIVE  ·  JC-2481
            </Mono>
          </div>
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <Tag color={C.blueBright} background={C.blueSoft} border="rgba(92,157,255,0.3)">
            {activePhase.label}
          </Tag>
          <div
            style={{
              marginTop: 9,
              fontFamily: MONO,
              fontSize: wide ? 8 : 7.4,
              letterSpacing: "0.1em",
              color: C.dim,
              lineHeight: 1.5,
              maxWidth: wide ? 340 : 260,
            }}
          >
            {COPY.demo.note}
          </div>
        </div>
      </div>

      {/* The customer app: booking */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: bookingOut,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: wide ? 104 : 70,
            right: wide ? 980 : 70,
            top: wide ? 274 : 196,
            opacity: progress(t, 0.2, 0.6),
          }}
        >
          <div style={{ fontFamily: MONO, fontSize: wide ? 9.5 : 8.6, letterSpacing: "0.2em", color: C.blueBright }}>
            CUSTOMER APP
          </div>
          <MaskLine start={0.3} duration={0.75} style={{ marginTop: 14 }}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: wide ? 66 : 54,
                fontWeight: 700,
                letterSpacing: "-0.055em",
                lineHeight: 0.98,
                color: C.white,
              }}
            >
              BOOKED IN
              <br />
              <span style={{ color: C.blueBright }}>40 SECONDS.</span>
            </div>
          </MaskLine>
          <div style={{ marginTop: 18, maxWidth: wide ? 560 : 900, fontFamily: FONT, fontSize: wide ? 18 : 15, lineHeight: 1.55, color: C.muted }}>
            No call. No paper diary. The job lands in the workshop, with the customer, vehicle and concern attached.
          </div>
          <div style={{ marginTop: 24, display: "flex", gap: 8 }}>
            <Tag color={C.green} background={C.greenSoft} border={`${C.green}33`}>
              BOOKING RECEIVED
            </Tag>
            <Tag color={C.silver} background="rgba(255,255,255,0.03)" border={C.line}>
              09:00 · TUE 12 MAY
            </Tag>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            left: wide ? 0 : 0,
            right: 0,
            top: wide ? 132 : 432,
            display: "flex",
            justifyContent: wide ? "flex-end" : "center",
            paddingRight: wide ? 148 : 0,
          }}
        >
          <div style={{ opacity: progress(t, BEATS.demo.booking, 0.6), transform: `translateY(${(1 - progress(t, BEATS.demo.booking, 0.6)) * 34}px)` }}>
            <PhoneFrame width={wide ? 336 : 330} glow={C.blue}>
              <BookingPhoneScreen confirmed={t >= 1.55 ? 1 : 0} />
            </PhoneFrame>
          </div>
        </div>
      </div>

      {/* The workshop app: job card through invoice */}
      <div
        style={{
          position: "absolute",
          left: appLeft,
          top: appTop,
          opacity: appIn * (showPhone && wide ? 0.5 : 1),
          transform: `translateY(${(1 - appIn) * 26}px)`,
        }}
      >
        <AppFrame width={appWidth}>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            {windows.map((win) => {
              const op = phaseOpacity(t, win.start, win.end);
              if (op <= 0.001) return null;
              return (
                <div key={win.key} style={{ position: "absolute", inset: 0, opacity: op }}>
                  {win.node}
                </div>
              );
            })}
          </div>
        </AppFrame>
      </div>

      {/* Customer approval on the phone */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: showPhone ? phoneIn : 0,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: wide ? undefined : 0,
            right: wide ? 150 : 0,
            top: wide ? 140 : 650,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: C.blue, boxShadow: `0 0 9px ${C.blue}` }} />
              <Mono size={wide ? 9 : 8.5} color={C.blueBright} style={{ letterSpacing: "0.18em" }}>
                CUSTOMER PHONE  ·  APPROVAL
              </Mono>
            </div>
            <PhoneFrame width={wide ? 342 : 342} glow={approved ? C.green : C.blue}>
              <ApprovalPhoneScreen approved={progress(t, 10.0, 0.6)} />
            </PhoneFrame>
            <div
              style={{
                opacity: progress(t, 10.5, 0.4),
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 10px",
                borderRadius: 3,
                border: `1px solid ${C.green}33`,
                background: C.greenSoft,
              }}
            >
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: C.green }} />
              <Mono size={8} color={C.green} style={{ letterSpacing: "0.12em" }}>
                APPROVED AT 10:42  ·  WORK AUTHORISED
              </Mono>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: wide ? 104 : 70,
          bottom: wide ? 130 : 108,
          opacity: progress(t, 1.2, 0.6),
        }}
      >
        <Mono size={wide ? 8 : 7.6} color={C.dim} style={{ letterSpacing: "0.14em" }}>
          ILLUSTRATIVE PRODUCT DEMO  ·  FICTIONAL CUSTOMER, VEHICLE AND PRICING
        </Mono>
      </div>

      <Vignette strength={wide ? 0.7 : 0.82} />
      <Grain opacity={0.045} />
    </AbsoluteFill>
  );
};
