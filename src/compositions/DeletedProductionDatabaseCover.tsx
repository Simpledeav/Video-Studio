import { AbsoluteFill, Img, staticFile } from "remotion";
import { C, FONT, MONO } from "../config/replit";
import { Glow, Grain, GridField, Scanlines } from "../components/replit/kit";
import { useLocalFonts } from "../hooks/useLocalFonts";

/**
 * Social cover (4:5) for THE DELETED PRODUCTION DATABASE.
 *
 * A still, not a video frame: oversized editorial type, one draining record
 * ledger, and a database canister on the red line. Everything is static so the
 * cover reads identically whenever it is rendered.
 */

const M = 76;

const ROWS = [
  "ACME HOLDINGS",
  "NORTHWIND LABS",
  "BRIGHTLINE CO",
  "MERIDIAN GROUP",
  "HALCYON VENTURES",
  "SUMMIT PARTNERS",
];

const chip: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  padding: "7px 13px",
  borderRadius: 3,
  fontFamily: MONO,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
};

const Ledger: React.FC = () => (
  <div
    style={{
      width: 500,
      border: `1px solid ${C.line}`,
      borderRadius: 6,
      background: "linear-gradient(180deg, rgba(17,21,27,0.94), rgba(9,11,15,0.94))",
      boxShadow: "0 34px 90px rgba(0,0,0,0.66)",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "13px 16px",
        borderBottom: `1px solid ${C.line}`,
        background: "rgba(255,53,72,0.055)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: C.red,
            boxShadow: `0 0 12px ${C.red}`,
          }}
        />
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.16em",
            color: C.silver,
          }}
        >
          PRODUCTION / CONTACTS
        </span>
      </div>
      <span style={{ fontFamily: MONO, fontSize: 10, color: C.red, letterSpacing: "0.1em" }}>
        0 ROWS
      </span>
    </div>

    <div style={{ padding: "10px 16px 14px" }}>
      {ROWS.map((row, i) => (
        <div
          key={row}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: i === ROWS.length - 1 ? "none" : `1px solid ${C.lineSoft}`,
            opacity: 0.9 - i * 0.13,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: 1,
                background: i < 2 ? C.red : C.mute,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.08em",
                color: C.silver,
                textDecoration: i < 4 ? "line-through" : "none",
                textDecorationColor: C.red,
                textDecorationThickness: 1,
              }}
            >
              {row}
            </span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 10, color: i < 4 ? C.red : C.mute }}>
            {i < 4 ? "DELETED" : "NULL"}
          </span>
        </div>
      ))}

      <div
        style={{
          marginTop: 12,
          height: 3,
          borderRadius: 2,
          background: `linear-gradient(90deg, ${C.red}, ${C.orange} 42%, transparent 92%)`,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 9,
          fontFamily: MONO,
          fontSize: 9,
          letterSpacing: "0.12em",
          color: C.mute,
        }}
      >
        <span>1,206 RECORDS</span>
        <span style={{ color: C.red }}>WIPED</span>
      </div>
    </div>
  </div>
);

const Canister: React.FC = () => (
  <div style={{ position: "relative", width: 300, height: 330 }}>
    {/* Body */}
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 44,
        height: 232,
        background:
          "linear-gradient(90deg, #081318 0%, #0B2530 34%, #0E3140 50%, #0B2530 66%, #081318 100%)",
        borderLeft: `1px solid ${C.cyan}44`,
        borderRight: `1px solid ${C.cyan}44`,
        boxShadow: `inset 0 0 60px rgba(0,217,255,0.08), 0 26px 70px rgba(0,0,0,0.55)`,
      }}
    />

    {/* Data bands */}
    {[78, 116, 146, 212, 240].map((top, i) => (
      <div
        key={top}
        style={{
          position: "absolute",
          left: 30,
          right: 30,
          top,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${C.cyan}${i === 2 ? "55" : "22"}, transparent)`,
        }}
      />
    ))}

    {/* Bottom disc */}
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 250,
        height: 60,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 40%, rgba(0,217,255,0.12), rgba(5,8,10,0.96) 70%)",
        border: `1px solid ${C.cyan}33`,
        boxShadow: `0 20px 50px rgba(0,0,0,0.7)`,
      }}
    />

    {/* Top disc */}
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 18,
        height: 60,
        borderRadius: "50%",
        background:
          "radial-gradient(ellipse at 50% 36%, rgba(0,217,255,0.34), rgba(6,20,26,0.98) 72%)",
        border: `1px solid ${C.cyan}88`,
        boxShadow: `0 0 34px rgba(0,217,255,0.18), inset 0 0 24px rgba(0,217,255,0.16)`,
      }}
    />

    {/* Failure cut */}
    <div
      style={{
        position: "absolute",
        left: 18,
        right: 18,
        top: 160,
        height: 2,
        background: `linear-gradient(90deg, transparent, ${C.red} 14%, ${C.orange} 50%, ${C.red} 86%, transparent)`,
        boxShadow: `0 0 26px ${C.red}, 0 0 60px ${C.redGlow}`,
      }}
    />
    <div
      style={{
        position: "absolute",
        left: 30,
        right: 30,
        top: 162,
        height: 30,
        background: "linear-gradient(180deg, rgba(255,53,72,0.14), transparent)",
      }}
    />

    {/* Empty core readout */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 84,
        textAlign: "center",
        fontFamily: FONT,
        fontSize: 64,
        fontWeight: 800,
        letterSpacing: "-0.05em",
        lineHeight: 0.9,
        color: "#FFFFFF",
        textShadow: `0 0 30px ${C.redGlow}`,
      }}
    >
      0
    </div>
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 172,
        textAlign: "center",
        fontFamily: MONO,
        fontSize: 9,
        letterSpacing: "0.24em",
        color: C.red,
      }}
    >
      ROWS REMAINING
    </div>

    {/* Caption */}
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 2,
        textAlign: "center",
        fontFamily: MONO,
        fontSize: 10,
        letterSpacing: "0.2em",
        color: C.mute,
      }}
    >
      CONTACTS DB · OFFLINE
    </div>
  </div>
);

export const DeletedProductionDatabaseCover: React.FC = () => {
  useLocalFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: C.black, overflow: "hidden" }}>
      {/* Base light */}
      <Glow x="82%" y="8%" size={62} color={C.cyan} opacity={0.12} />
      <Glow x="12%" y="94%" size={58} color={C.red} opacity={0.1} />
      <Glow x="58%" y="62%" size={54} color={C.blue} opacity={0.05} />
      <GridField opacity={0.32} size={84} />

      {/* Fine texture wash */}
      <AbsoluteFill
        style={{
          opacity: 0.5,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(255,255,255,0.018) 0px, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 4px)",
          mixBlendMode: "overlay",
          pointerEvents: "none",
        }}
      />

      {/* Corner rules */}
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          top: 60,
          height: 1,
          background: `linear-gradient(90deg, ${C.line}, transparent 78%)`,
        }}
      />

      {/* Header */}
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          top: 82,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <span
            style={{
              width: 30,
              height: 1,
              background: C.cyan,
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: "0.24em",
              color: C.silver,
            }}
          >
            SIMPLEDEAV · CASE STUDY 04
          </span>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.18em",
            color: C.mute,
          }}
        >
          80 SEC · DOCUMENTARY
        </span>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: M, top: 176, width: 930 }}>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 52,
            fontWeight: 600,
            letterSpacing: "-0.045em",
            lineHeight: 0.98,
            color: C.silver,
          }}
        >
          AN AI AGENT
          <br />
          DELETED A LIVE
        </div>
        <div
          style={{
            marginTop: 10,
            fontFamily: FONT,
            fontSize: 126,
            fontWeight: 800,
            letterSpacing: "-0.07em",
            lineHeight: 0.86,
            color: C.white,
            textShadow: "0 14px 60px rgba(0,0,0,0.8)",
          }}
        >
          PRODUCTION
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 126,
            fontWeight: 800,
            letterSpacing: "-0.07em",
            lineHeight: 0.86,
            color: C.red,
            textShadow: `0 0 74px ${C.redGlow}, 0 14px 60px rgba(0,0,0,0.8)`,
          }}
        >
          DATABASE.
        </div>

        <div
          style={{
            marginTop: 26,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ width: 52, height: 2, background: C.red }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 14,
              letterSpacing: "0.16em",
              color: C.white,
            }}
          >
            THE DEVELOPER TOLD IT NOT TO.
          </span>
        </div>
      </div>

      {/* Visual row */}
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          top: 648,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 34,
        }}
      >
        <Ledger />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 18,
            paddingBottom: 6,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ ...chip, color: C.red, background: C.redSoft, border: `1px solid ${C.red}44` }}>
              1,206 → 0
            </span>
            <span style={{ ...chip, color: C.orange, background: C.orangeSoft, border: `1px solid ${C.orange}44` }}>
              CRITICAL
            </span>
          </div>
          <Canister />
        </div>
      </div>

      {/* Insight strip */}
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          top: 1082,
          borderTop: `1px solid ${C.line}`,
          borderBottom: `1px solid ${C.line}`,
          padding: "17px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <span
          style={{
            fontFamily: FONT,
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: C.white,
            lineHeight: 1.25,
            maxWidth: 620,
          }}
        >
          Instructions are not{" "}
          <span style={{ color: C.cyan }}>security controls.</span>
        </span>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: C.mute,
            textAlign: "right",
            lineHeight: 1.8,
            whiteSpace: "nowrap",
          }}
        >
          ISOLATED ENVIRONMENTS
          <br />
          RESTRICTED PERMISSIONS · TESTED BACKUPS
        </span>
      </div>

      {/* Footer signature */}
      <div
        style={{
          position: "absolute",
          left: M,
          right: M,
          bottom: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
          <Img
            src={staticFile("brand/simpledeav-avatar.png")}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: `1px solid ${C.cyan}55`,
            }}
          />
          <span
            style={{
              fontFamily: FONT,
              fontSize: 15,
              fontWeight: 700,
              letterSpacing: "0.22em",
              color: C.white,
            }}
          >
            SIMPLEDEAV
          </span>
          <span style={{ width: 24, height: 1, background: `${C.cyan}66` }} />
          <span
            style={{
              fontFamily: MONO,
              fontSize: 11,
              letterSpacing: "0.18em",
              color: C.mute,
            }}
          >
            @SIMPLEDEAV
          </span>
        </div>
        <span
          style={{
            fontFamily: MONO,
            fontSize: 10,
            letterSpacing: "0.14em",
            color: C.mute,
          }}
        >
          JULY 2025 · REPORTED INCIDENT
        </span>
      </div>

      <Scanlines opacity={0.04} spacing={5} />
      <Grain opacity={0.05} />
      <AbsoluteFill
        style={{
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 42%, transparent 42%, rgba(0,0,0,0.5) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
