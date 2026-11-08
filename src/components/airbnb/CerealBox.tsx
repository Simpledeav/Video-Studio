import type { CSSProperties } from "react";
import { FONT_STACK } from "../../config/airbnb";

export type CerealVariant = "obama" | "mccain";

type CerealBoxProps = {
  variant?: CerealVariant;
  width?: number;
  height?: number;
  depth?: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  /** 0 = flat dieline on the table, 1 = fully assembled box. */
  fold?: number;
  price?: string;
  showPrice?: boolean;
  glow?: number;
  shadow?: boolean;
  style?: CSSProperties;
};

const PALETTES = {
  obama: {
    paper: "#F2EBDD",
    paperEdge: "#E2D8C4",
    ink: "#1C2340",
    accent: "#FF5A5F",
    accentDeep: "#E8474C",
    band: "#1F2A4D",
    reverse: "#F3EEE5",
  },
  mccain: {
    paper: "#1E2842",
    paperEdge: "#151C31",
    ink: "#F3EEE5",
    accent: "#FF5A5F",
    accentDeep: "#D94A4F",
    band: "#F3EEE5",
    reverse: "#1E2842",
  },
} as const;

const Star: React.FC<{ size: number; color: string; opacity?: number }> = ({ size, color, opacity = 1 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block", opacity }}>
    <path
      d="M12 2.2l2.9 6.1 6.7.9-4.9 4.7 1.2 6.6L12 17.3 6.1 20.5l1.2-6.6L2.4 9.2l6.7-.9z"
      fill={color}
    />
  </svg>
);

const Face: React.FC<{
  width: number;
  height: number;
  transform: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}> = ({ width, height, transform, style, children }) => (
  <div
    style={{
      position: "absolute",
      left: "50%",
      top: "50%",
      width,
      height,
      marginLeft: -width / 2,
      marginTop: -height / 2,
      transform,
      transformStyle: "preserve-3d",
      backfaceVisibility: "hidden",
      ...style,
    }}
  >
    {children}
  </div>
);

/**
 * The cereal box is the film's visual thread: a physical, paper-textured object
 * built entirely in CSS 3D so it can rotate, fold and be lit without stock art.
 * The designs are original illustrative re-creations, not campaign artwork.
 */
export const CerealBox: React.FC<CerealBoxProps> = ({
  variant = "obama",
  width = 400,
  height = 620,
  depth = 116,
  rotateX = 6,
  rotateY = -16,
  rotateZ = 0,
  fold = 1,
  price,
  showPrice = false,
  glow = 0,
  shadow = true,
  style,
}) => {
  const c = PALETTES[variant];
  const p = Math.min(1, Math.max(0, fold));
  const foldFront = (1 - p) * 86;
  const foldSide = (1 - p) * 84;
  const isObama = variant === "obama";
  const brandLine = isObama ? "OBAMA" : "CAP'N";
  const productLine = isObama ? "O'S" : "McCAIN'S";
  const sheen = `linear-gradient(${115 + rotateY * 0.8}deg, rgba(255,255,255,0) 18%, rgba(255,255,255,0.36) 43%, rgba(255,255,255,0.05) 52%, rgba(255,255,255,0) 66%)`;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        perspective: 1900,
        perspectiveOrigin: "50% 42%",
        ...style,
      }}
    >
      {glow > 0 ? (
        <div
          style={{
            position: "absolute",
            left: -width * 0.35,
            top: -height * 0.2,
            width: width * 1.7,
            height: height * 1.4,
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(255,120,105,${0.3 * glow}) 0%, transparent 66%)`,
            filter: "blur(46px)",
            pointerEvents: "none",
          }}
        />
      ) : null}

      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
        }}
      >
        {/* right side panel */}
        <Face
          width={depth}
          height={height}
          transform={`rotateY(90deg) translateZ(${width / 2}px) rotateY(${-foldSide}deg)`}
          style={{ transformOrigin: "left center" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(90deg, rgba(0,0,0,0.45) 0%, ${c.paperEdge} 62%, ${c.paper} 100%)`,
              boxShadow: "inset 0 0 32px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                writingMode: "vertical-rl",
                fontFamily: FONT_STACK,
                fontWeight: 700,
                fontSize: depth * 0.24,
                letterSpacing: "0.08em",
                color: c.ink,
                opacity: 0.82,
                textTransform: "uppercase",
              }}
            >
              {isObama ? "Obama O's · 12 oz" : "Cap'n McCain's · 12 oz"}
            </div>
          </div>
        </Face>

        {/* left side panel */}
        <Face
          width={depth}
          height={height}
          transform={`rotateY(-90deg) translateZ(${width / 2}px) rotateY(${foldSide}deg)`}
          style={{ transformOrigin: "right center" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(270deg, rgba(0,0,0,0.4) 0%, ${c.paperEdge} 62%, ${c.paper} 100%)`,
              boxShadow: "inset 0 0 32px rgba(0,0,0,0.3)",
            }}
          />
        </Face>

        {/* top flap */}
        <Face
          width={width}
          height={depth}
          transform={`rotateX(90deg) translateZ(${height / 2}px) rotateX(${(1 - p) * -80}deg)`}
          style={{ transformOrigin: "center bottom" }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(180deg, ${c.paper}, ${c.paperEdge})`,
              borderTop: `1px solid rgba(0,0,0,0.14)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: FONT_STACK,
              fontSize: depth * 0.2,
              fontWeight: 600,
              letterSpacing: "0.3em",
              color: c.ink,
              opacity: 0.6,
            }}
          >
            OPEN HERE
          </div>
        </Face>

        {/* bottom */}
        <Face
          width={width}
          height={depth}
          transform={`rotateX(-90deg) translateZ(${height / 2}px)`}
          style={{ background: c.paperEdge }}
        >
          <div style={{ width: "100%", height: "100%", background: c.paperEdge }} />
        </Face>

        {/* front panel */}
        <Face
          width={width}
          height={height}
          transform={`translateZ(${depth / 2}px) rotateX(${foldFront}deg)`}
          style={{ transformOrigin: "center bottom" }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              overflow: "hidden",
              background: `linear-gradient(168deg, ${c.paper} 0%, ${c.paperEdge} 100%)`,
              boxShadow: "0 0 0 1px rgba(0,0,0,0.18), inset 0 0 60px rgba(0,0,0,0.12)",
              borderRadius: 3,
            }}
          >
            {/* paper fibre texture */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.5,
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 1px, transparent 1px, transparent 3px), repeating-linear-gradient(90deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 1px, transparent 1px, transparent 4px)",
                mixBlendMode: "multiply",
              }}
            />
            {/* soft edge wear */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                boxShadow: "inset 0 0 30px rgba(60,40,20,0.18), inset 0 -18px 30px rgba(0,0,0,0.12)",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                padding: `${height * 0.055}px ${width * 0.075}px`,
                display: "flex",
                flexDirection: "column",
                color: c.ink,
                fontFamily: FONT_STACK,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: `1.5px solid ${c.ink}`,
                  paddingBottom: height * 0.012,
                  opacity: 0.85,
                }}
              >
                <span style={{ fontSize: width * 0.042, fontWeight: 600, letterSpacing: "0.26em" }}>
                  {isObama ? "LIMITED" : "CAP'N"}
                </span>
                <span style={{ fontSize: width * 0.036, fontWeight: 500, letterSpacing: "0.16em" }}>
                  EST. 2008
                </span>
              </div>

              <div style={{ marginTop: height * 0.055 }}>
                <div
                  style={{
                    fontSize: width * (isObama ? 0.2 : 0.175),
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 0.92,
                    color: isObama ? c.ink : c.reverse,
                    textTransform: "uppercase",
                    whiteSpace: "nowrap",
                  }}
                >
                  {brandLine}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: width * 0.03,
                    marginTop: height * 0.01,
                  }}
                >
                  <span
                    style={{
                      fontSize: width * (isObama ? 0.3 : 0.152),
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                      lineHeight: 0.95,
                      color: c.accent,
                      textShadow: "0 1px 0 rgba(0,0,0,0.18)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {productLine}
                  </span>
                </div>
              </div>

              <div
                style={{
                  marginTop: height * 0.03,
                  padding: `${height * 0.012}px ${width * 0.03}px`,
                  background: c.band,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: width * 0.02,
                }}
              >
                {[0, 1, 2, 3, 4].map((i) => (
                  <Star key={i} size={width * 0.036} color={c.reverse} opacity={0.9} />
                ))}
                <span
                  style={{
                    fontSize: width * 0.033,
                    letterSpacing: "0.2em",
                    fontWeight: 600,
                    color: c.reverse,
                    whiteSpace: "nowrap",
                  }}
                >
                  {isObama ? "CHANGE YOU CAN TASTE" : "MAVERICK MUNCH"}
                </span>
                {[0, 1, 2].map((i) => (
                  <Star key={`b${i}`} size={width * 0.036} color={c.reverse} opacity={0.9} />
                ))}
              </div>

              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: height * 0.16,
                }}
              >
                <svg
                  viewBox="0 0 200 120"
                  width={width * 0.62}
                  height={height * 0.19}
                  style={{ overflow: "visible" }}
                  aria-hidden="true"
                >
                  {/* floating O's */}
                  {[
                    [44, 18, 9],
                    [78, 8, 7],
                    [112, 16, 10],
                    [146, 7, 6],
                    [162, 26, 8],
                  ].map(([cx, cy, r], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r={r} fill="none" stroke={c.accent} strokeWidth={r * 0.62} />
                    </g>
                  ))}
                  {/* bowl */}
                  <ellipse cx="100" cy="62" rx="74" ry="13" fill={c.paperEdge} />
                  <ellipse cx="100" cy="60" rx="66" ry="9" fill="#FBF6EA" />
                  <path d="M 28 62 Q 100 80 172 62 L 156 104 Q 100 120 44 104 Z" fill={c.accentDeep} />
                  <path d="M 28 62 Q 100 80 172 62 L 168 70 Q 100 88 32 70 Z" fill={c.accent} opacity={0.9} />
                  <path d="M 40 74 Q 100 90 160 74" fill="none" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
                  {/* spoon */}
                  <g transform="rotate(24 150 52)">
                    <rect x="146" y="30" width="5" height="46" rx="2.5" fill={c.ink} opacity={0.75} />
                    <ellipse cx="148.5" cy="28" rx="10" ry="13" fill={c.ink} opacity={0.75} />
                  </g>
                </svg>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  gap: 8,
                  borderTop: `1px solid ${c.ink}`,
                  paddingTop: height * 0.014,
                  opacity: 0.8,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: width * 0.038,
                      fontWeight: 700,
                      letterSpacing: "0.12em",
                      lineHeight: 1.4,
                    }}
                  >
                    {isObama ? "OAT & HONEY O'S" : "CINNAMON STARS"}
                  </div>
                  <div
                    style={{
                      fontSize: width * 0.028,
                      fontWeight: 500,
                      letterSpacing: "0.1em",
                      opacity: 0.7,
                    }}
                  >
                    SAN FRANCISCO · COLLECTOR'S EDITION
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: width * 0.028, letterSpacing: "0.1em", opacity: 0.7 }}>
                    NET WT
                  </div>
                  <div style={{ fontSize: width * 0.04, fontWeight: 700, letterSpacing: "0.06em" }}>
                    12 OZ
                  </div>
                </div>
              </div>
            </div>

            {/* printed barcode block */}
            <div
              style={{
                position: "absolute",
                right: width * 0.06,
                bottom: height * 0.055,
                width: width * 0.16,
                height: height * 0.075,
                display: "flex",
                gap: 1.5,
                opacity: 0.55,
              }}
            >
              {Array.from({ length: 14 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: i % 3 === 0 ? 3 : 1.5,
                    height: "100%",
                    backgroundColor: c.ink,
                  }}
                />
              ))}
            </div>

            {/* sheen */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: sheen,
                opacity: isObama ? 0.75 : 0.4,
                mixBlendMode: "soft-light",
                pointerEvents: "none",
              }}
            />

            {showPrice && price ? (
              <div
                style={{
                  position: "absolute",
                  left: width * 0.06,
                  bottom: height * 0.2,
                  transform: "rotate(-6deg)",
                  background: c.accent,
                  color: "#FFF7EE",
                  fontFamily: FONT_STACK,
                  fontWeight: 700,
                  fontSize: width * 0.085,
                  letterSpacing: "-0.02em",
                  padding: `${width * 0.022}px ${width * 0.05}px`,
                  borderRadius: 4,
                  boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
                }}
              >
                {price}
              </div>
            ) : null}
          </div>
        </Face>
      </div>

      {shadow ? (
        <div
          style={{
            position: "absolute",
            left: "6%",
            right: "2%",
            bottom: -height * 0.055,
            height: height * 0.1,
            background: "radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.62), transparent 70%)",
            filter: "blur(14px)",
            opacity: Math.max(0.25, p),
          }}
        />
      ) : null}
    </div>
  );
};
