import { AbsoluteFill } from "remotion";
import { C, COPY, FONT, IMG, MONO } from "../config/mcdonalds";
import { Grain, Photo, Scratches, Vignette } from "../components/mcdonalds/kit";
import {
  Arches,
  IBMWordmark,
  McDonaldsWordmark,
  ScreenError,
  ScreenFooter,
  ScreenFrame,
  ScreenHeader,
  ScreenRow,
} from "../components/mcdonalds/visuals";

/**
 * THE THUMBNAIL.
 *
 * A static 1920×1080 cover. The left plate is the real drive-thru speaker and
 * car; the right plate is a clearly illustrative order screen. One headline,
 * one order, one joke. Readable at 320 px wide.
 */
export const McDonaldsAICover: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#070708", overflow: "hidden" }}>
      {/* Left photographic plate */}
      <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1080, overflow: "hidden" }}>
        <Photo
          src={IMG.driveThru}
          objectPosition="42% 50%"
          brightness={0.58}
          contrast={1.18}
          saturation={0.78}
          style={{ width: "100%", height: "100%", transform: "scale(1.14)" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(90deg, rgba(4,4,5,0.9) 0%, rgba(4,4,5,0.46) 46%, rgba(4,4,5,0.12) 78%, rgba(4,4,5,0.72) 100%), linear-gradient(180deg, rgba(4,4,5,0.55) 0%, transparent 32%, rgba(4,4,5,0.72) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: 10,
            height: "100%",
            background: C.red,
          }}
        />
      </div>

      {/* Right product panel */}
      <div
        style={{
          position: "absolute",
          left: 1020,
          top: 0,
          width: 900,
          height: 1080,
          background:
            "radial-gradient(ellipse at 32% 22%, rgba(218,26,50,0.16) 0%, transparent 54%), linear-gradient(180deg, #0D0D11 0%, #070708 100%)",
          borderLeft: `1px solid rgba(247,243,234,0.1)`,
        }}
      />

      <div style={{ position: "absolute", left: 1020, top: 0, width: 900, height: 1080, opacity: 0.18 }}>
        <div
          style={{
            position: "absolute",
            right: -60,
            top: 80,
            fontFamily: FONT,
            fontSize: 560,
            fontWeight: 800,
            letterSpacing: "-0.1em",
            lineHeight: 0.8,
            color: C.yellow,
          }}
        >
          9
        </div>
      </div>

      {/* Kicker + brand row */}
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 54,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <Arches size={52} />
        <div style={{ width: 1, height: 28, background: "rgba(247,243,234,0.22)" }} />
        <McDonaldsWordmark size={21} color={C.white} opacity={0.95} />
        <span style={{ fontFamily: FONT, fontSize: 16, color: C.muted, fontWeight: 300 }}>×</span>
        <IBMWordmark width={58} opacity={0.7} />
        <span
          style={{
            marginLeft: 8,
            fontFamily: MONO,
            fontSize: 11,
            letterSpacing: "0.2em",
            color: C.muted,
          }}
        >
          2021–2024
        </span>
      </div>

      {/* Headline */}
      <div style={{ position: "absolute", left: 66, top: 128 }}>
        <div
          style={{
            fontFamily: MONO,
            fontSize: 13,
            letterSpacing: "0.22em",
            color: C.yellow,
            marginBottom: 14,
          }}
        >
          {COPY.coverKicker}
        </div>
        <div
          style={{
            fontFamily: FONT,
            fontSize: 164,
            fontWeight: 800,
            letterSpacing: "-0.075em",
            lineHeight: 0.82,
            textTransform: "uppercase",
            color: C.white,
            textShadow: "0 12px 50px rgba(0,0,0,0.55)",
          }}
        >
          <div>AI GOT</div>
          <div>THE ORDER</div>
          <div style={{ color: C.yellow, fontSize: 186 }}>WRONG</div>
        </div>

        <div style={{ marginTop: 22, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 52, height: 3, background: C.red }} />
          <div
            style={{
              fontFamily: FONT,
              fontSize: 28,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: C.white,
              textTransform: "uppercase",
            }}
          >
            {COPY.coverSub}
          </div>
        </div>
      </div>

      {/* Order screen */}
      <div
        style={{
          position: "absolute",
          left: 1120,
          top: 126,
          width: 660,
          transform: "rotate(1.2deg)",
        }}
      >
        <ScreenFrame width={660} accent={C.redBright} glow>
          <ScreenHeader title="AUTOMATED ORDER TAKER" status="ORDER WRONG" warning />
          <div
            style={{
              padding: "15px 18px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
            }}
          >
            <div
              style={{
                fontFamily: FONT,
                fontSize: 20,
                fontWeight: 500,
                color: C.bone,
                letterSpacing: "-0.01em",
              }}
            >
              “Just a vanilla ice cream, please.”
            </div>
            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              {[12, 22, 30, 18, 26, 14, 8].map((h, i) => (
                <span key={i} style={{ width: 3, height: h, background: C.yellow, opacity: 0.8 }} />
              ))}
            </div>
          </div>
          <div style={{ padding: "0 14px 4px" }}>
            <ScreenRow name="VANILLA CONE" qty="× 1" appear={1} accent={C.bone} />
            <ScreenRow name="SWEET TEA" qty="× 9" appear={1} accent={C.redBright} />
            <ScreenRow name="BUTTER" qty="× 2" appear={1} accent={C.red} />
            <ScreenRow name="KETCHUP" qty="× 4" appear={1} accent={C.red} />
          </div>
          <ScreenError text="ITEMS NOT REQUESTED · CUSTOMER CONFUSED" appear={1} />
          <ScreenFooter label="ITEMS IN ORDER" value="16" accent={C.redBright} />
        </ScreenFrame>
      </div>

      {/* Sticker */}
      <div
        style={{
          position: "absolute",
          left: 1084,
          top: 704,
          transform: "rotate(-2.4deg)",
        }}
      >
        <div
          style={{
            background: C.yellow,
            color: C.black,
            padding: "14px 24px 16px",
            boxShadow: "0 30px 70px rgba(0,0,0,0.55)",
          }}
        >
          <div
            style={{
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.2em",
              color: "rgba(5,5,6,0.6)",
              marginBottom: 3,
            }}
          >
            ONE CUSTOMER · NINE CUPS
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 72,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.88,
              textTransform: "uppercase",
            }}
          >
            9 SWEET TEAS?!
          </div>
        </div>
      </div>

      {/* Bottom line */}
      <div
        style={{
          position: "absolute",
          left: 72,
          right: 72,
          bottom: 46,
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: 13,
              letterSpacing: "0.18em",
              color: C.yellow,
            }}
          >
            {COPY.coverCaption}
          </div>
          <div
            style={{
              marginTop: 8,
              fontFamily: MONO,
              fontSize: 9,
              letterSpacing: "0.16em",
              color: C.muted,
            }}
          >
            {COPY.sourceFinePrint}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: C.white,
            }}
          >
            SIMPLEDEAV
          </div>
          <div
            style={{
              marginTop: 3,
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.16em",
              color: C.dim,
            }}
          >
            BUSINESS & TECHNOLOGY CASE STUDY
          </div>
        </div>
      </div>

      <Vignette strength={0.92} />
      <Scratches opacity={0.34} />
      <Grain opacity={0.06} />
    </AbsoluteFill>
  );
};
