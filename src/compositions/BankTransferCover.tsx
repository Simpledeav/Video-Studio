import { AbsoluteFill } from "remotion";
import { C, FONT, MONO } from "../config/bankTransfer";
import {
  Glow,
  Grain,
  GridField,
  PhoneFrame,
  ReceiptScreen,
  ReceiverHomeScreen,
  Scanlines,
  Tag,
  Vignette,
} from "../components/banktransfer/kit";
import { useLocalFonts } from "../hooks/useLocalFonts";

/**
 * 16:9 social cover. A still composition, not a paused video frame:
 * sender phone on the left, receiver phone on the right, and a transaction
 * path that visibly fails to complete between them.
 */
export const BankTransferCover: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, fontFamily: FONT }}>
      <Glow x="22%" y="62%" size={58} color={C.cyan} opacity={0.13} />
      <Glow x="78%" y="62%" size={54} color={C.amber} opacity={0.08} />
      <Glow x="50%" y="44%" size={36} color={C.red} opacity={0.07} />
      <GridField opacity={0.42} size={92} />
      <Scanlines opacity={0.045} />

      <div style={{ position: "absolute", left: 112, top: 70, display: "flex", alignItems: "center", gap: 14 }}>
        <Tag color={C.amber} background={C.amberSoft} border={`${C.amber}55`} style={{ fontSize: 12 }}>
          TRANSFER SUCCESSFUL?
        </Tag>
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.18em", color: C.muted }}>
          NIGERIA · INTERBANK TRANSFER
        </span>
      </div>

      <div style={{ position: "absolute", left: 108, top: 126 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 122,
            fontWeight: 700,
            letterSpacing: "-0.06em",
            lineHeight: 0.9,
            color: C.white,
            textShadow: "0 20px 70px rgba(0,0,0,0.6)",
          }}
        >
          WHERE DID
        </div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 20 }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 122,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.94,
              color: C.cyan,
              textShadow: `0 0 70px ${C.cyan}33`,
            }}
          >
            THE MONEY
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 122,
              fontWeight: 700,
              letterSpacing: "-0.06em",
              lineHeight: 0.94,
              color: C.red,
              textShadow: `0 0 60px ${C.red}33`,
            }}
          >
            GO?
          </div>
        </div>
      </div>

      <div style={{ position: "absolute", left: 176, top: 392 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.cyan, boxShadow: `0 0 10px ${C.cyan}` }} />
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color: C.cyan }}>SENDER</span>
        </div>
        <PhoneFrame width={302} glow={C.cyan}>
          <ReceiptScreen scale={302 / 390} success={1} highlightSession={0} />
        </PhoneFrame>
        <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", color: C.green }}>
          DEBIT POSTED · STATUS: SUCCESSFUL
        </div>
      </div>

      <div style={{ position: "absolute", right: 176, top: 392 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 9, marginBottom: 14 }}>
          <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.2em", color: C.amber }}>RECEIVER</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.amber, boxShadow: `0 0 10px ${C.amber}` }} />
        </div>
        <PhoneFrame width={302} glow={C.amber}>
          <ReceiverHomeScreen scale={302 / 390} emptyPulse={0.55} />
        </PhoneFrame>
        <div style={{ marginTop: 14, textAlign: "right", fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", color: C.red }}>
          NO CREDIT · NO ALERT
        </div>
      </div>

      <div style={{ position: "absolute", left: 462, top: 528, width: 996, height: 300 }}>
        <svg width={996} height={300} viewBox="0 0 996 300" style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="coverPathLeft" x1="0" x2="1">
              <stop offset="0%" stopColor={C.cyan} stopOpacity="0.14" />
              <stop offset="100%" stopColor={C.cyan} stopOpacity="0.82" />
            </linearGradient>
            <linearGradient id="coverPathRight" x1="0" x2="1">
              <stop offset="0%" stopColor={C.amber} stopOpacity="0.75" />
              <stop offset="100%" stopColor={C.amber} stopOpacity="0.12" />
            </linearGradient>
            <filter id="pathGlow" x="-60%" y="-300%" width="220%" height="700%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line x1="24" y1="132" x2="398" y2="132" stroke="url(#coverPathLeft)" strokeWidth="2.5" filter="url(#pathGlow)" />
          <line x1="590" y1="132" x2="972" y2="132" stroke="url(#coverPathRight)" strokeWidth="2.5" filter="url(#pathGlow)" opacity="0.4" strokeDasharray="5 9" />

          <circle cx="24" cy="132" r="7" fill={C.cyan} filter="url(#pathGlow)" />
          <circle cx="972" cy="132" r="7" fill="none" stroke={C.red} strokeWidth="1.5" opacity="0.6" />
          <circle cx="590" cy="132" r="4" fill={C.amber} opacity="0.8" />

          {[0, 1, 2, 3, 4].map((i) => (
            <rect
              key={i}
              x={406 + i * 34 + (i % 2) * 8}
              y={122 + (i % 3) * 9}
              width={17 + (i % 2) * 9}
              height="2.5"
              rx="1"
              fill={i % 2 === 0 ? C.red : C.amber}
              opacity={0.8 - i * 0.12}
              transform={`rotate(${(i % 2 === 0 ? -1 : 1) * (8 + i * 4)} ${414 + i * 34} 132)`}
            />
          ))}

          <path d="M 408 96 L 432 132 L 408 168" stroke={C.red} strokeWidth="1.4" fill="none" opacity="0.5" />
          <path d="M 580 96 L 556 132 L 580 168" stroke={C.red} strokeWidth="1.4" fill="none" opacity="0.5" />

          <text x="494" y="214" textAnchor="middle" fill={C.red} fontFamily={MONO} fontSize="11" letterSpacing="3.2">
            CONFIRMATION NOT RECEIVED
          </text>
          <text x="494" y="244" textAnchor="middle" fill={C.dim} fontFamily={MONO} fontSize="9" letterSpacing="2.6">
            TRANSACTION PATH INTERRUPTED
          </text>
        </svg>

        <div
          style={{
            position: "absolute",
            left: 24,
            top: 62,
            padding: "6px 9px",
            borderRadius: 3,
            border: `1px solid ${C.cyan}33`,
            background: "rgba(5,12,20,0.72)",
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.14em",
            color: C.cyan,
          }}
        >
          DEBIT
        </div>
        <div
          style={{
            position: "absolute",
            right: 16,
            top: 62,
            padding: "6px 9px",
            borderRadius: 3,
            border: `1px solid ${C.red}33`,
            background: "rgba(5,12,20,0.72)",
            fontFamily: MONO,
            fontSize: 9,
            letterSpacing: "0.14em",
            color: C.red,
          }}
        >
          NO CREDIT
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 108,
          bottom: 54,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span style={{ width: 40, height: 1, background: C.cyan }} />
        <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.16em", color: C.silver }}>
          ₦250,000 SENT · NOTHING ARRIVED
        </span>
      </div>

      <div
        style={{
          position: "absolute",
          right: 108,
          bottom: 54,
          fontFamily: MONO,
          fontSize: 10,
          letterSpacing: "0.14em",
          color: C.dim,
        }}
      >
        A FICTIONAL TRANSACTION · SIMPLEDEAV
      </div>

      <Vignette strength={0.95} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
