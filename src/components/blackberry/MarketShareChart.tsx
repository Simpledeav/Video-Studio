import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PALETTE } from "../../config/blackberry";

type DataPoint = {
  year: number;
  share: number;
};

const DATA: DataPoint[] = [
  { year: 2009, share: 19.9 },
  { year: 2010, share: 16.0 },
  { year: 2011, share: 10.5 },
  { year: 2012, share: 4.6 },
  { year: 2013, share: 1.9 },
  { year: 2014, share: 0.6 },
  { year: 2015, share: 0.2 },
  { year: 2016, share: 0.05 },
];

export const MarketShareChart: React.FC<{ isWide?: boolean }> = ({ isWide = false }) => {
  const frame = useCurrentFrame();

  // Animation timeline within Scene 5 (390 frames total)
  // 0-45: Grid and axis entrance
  // 45-210: Path animation draw across the years
  // 210-390: Final 2016 beacon pulse and data lock
  const drawProgress = interpolate(frame, [45, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const fadeGrid = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const chartWidth = isWide ? 1340 : 880;
  const chartHeight = isWide ? 580 : 720;
  const padding = {
    top: isWide ? 60 : 80,
    right: isWide ? 80 : 60,
    bottom: isWide ? 80 : 100,
    left: isWide ? 100 : 80,
  };

  const plotW = chartWidth - padding.left - padding.right;
  const plotH = chartHeight - padding.top - padding.bottom;

  // Scale: X = 2009..2016, Y = 0..22%
  const getX = (year: number) => padding.left + ((year - 2009) / (2016 - 2009)) * plotW;
  const getY = (share: number) => padding.top + (1 - share / 22) * plotH;

  // Build SVG path points
  const points = DATA.map((d) => ({
    x: getX(d.year),
    y: getY(d.share),
    ...d,
  }));

  // Cubic bezier smooth curve
  const pathD = points.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = arr[i - 1];
    const cpX = (prev.x + pt.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, "");

  // Area under curve
  const areaD = `${pathD} L ${points[points.length - 1].x} ${padding.top + plotH} L ${points[0].x} ${padding.top + plotH} Z`;

  // Total path length approximate
  const totalLength = 1200;
  const strokeDashoffset = totalLength * (1 - drawProgress);

  // Current animated metric counter
  const activeIndex = Math.min(DATA.length - 1, Math.floor(drawProgress * (DATA.length - 1)));
  const nextIndex = Math.min(DATA.length - 1, activeIndex + 1);
  const localProg = (drawProgress * (DATA.length - 1)) % 1;
  const currentShare =
    drawProgress >= 1
      ? 0.05
      : DATA[activeIndex].share + (DATA[nextIndex].share - DATA[activeIndex].share) * localProg;

  const currentYear =
    drawProgress >= 1
      ? 2016
      : Math.round(DATA[activeIndex].year + (DATA[nextIndex].year - DATA[activeIndex].year) * localProg);

  const gridY = [0, 5, 10, 15, 20];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      {/* Editorial Section Headline & Key Metric Banner */}
      <div
        style={{
          width: chartWidth,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 16,
          padding: "0 10px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: isWide ? 12 : 13,
              fontWeight: 700,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: PALETTE.signalOrange,
              marginBottom: 4,
            }}
          >
            ● HISTORICAL DATA ANALYSIS
          </div>
          <h2
            style={{
              fontSize: isWide ? 34 : 38,
              fontWeight: 800,
              letterSpacing: "-0.03em",
              margin: 0,
              lineHeight: 1.1,
              color: PALETTE.inkBlack,
            }}
          >
            GLOBAL SMARTPHONE UNIT MARKET SHARE
          </h2>
          <div
            style={{
              fontSize: isWide ? 13 : 14,
              color: PALETTE.neutralGrey,
              fontWeight: 500,
              marginTop: 4,
            }}
          >
            Annual worldwide unit shipments · Gartner &amp; IDC historical datasets
          </div>
        </div>

        {/* Live Big Metric Counter */}
        <div
          style={{
            textAlign: "right",
            background: PALETTE.warmWhite,
            border: `2px solid ${drawProgress >= 0.95 ? PALETTE.signalOrange : PALETTE.electricCobalt}`,
            borderRadius: 12,
            padding: "10px 20px",
            boxShadow: "0 8px 24px rgba(23, 23, 23, 0.06)",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", color: PALETTE.neutralGrey }}>
            YEAR {currentYear}
          </div>
          <div
            style={{
              fontSize: isWide ? 42 : 46,
              fontWeight: 800,
              color: drawProgress >= 0.95 ? PALETTE.signalOrange : PALETTE.electricCobalt,
              lineHeight: 1.05,
              fontFeatureSettings: '"tnum"',
            }}
          >
            {currentShare.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Main Chart Canvas */}
      <div
        style={{
          width: chartWidth,
          height: chartHeight,
          background: "#FFFFFF",
          border: `1px solid ${PALETTE.border}`,
          borderRadius: 16,
          boxShadow: "0 24px 60px rgba(23, 23, 23, 0.06), 0 4px 12px rgba(23, 23, 23, 0.03)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg width={chartWidth} height={chartHeight} style={{ position: "absolute", inset: 0 }}>
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={PALETTE.electricCobalt} stopOpacity="0.28" />
              <stop offset="70%" stopColor={PALETTE.paleBlue} stopOpacity="0.12" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
            </linearGradient>

            <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={PALETTE.electricCobalt} />
              <stop offset="65%" stopColor={PALETTE.electricCobalt} />
              <stop offset="90%" stopColor={PALETTE.signalOrange} />
              <stop offset="100%" stopColor={PALETTE.signalOrange} />
            </linearGradient>

            <clipPath id="chartClip">
              <rect x={padding.left} y={padding.top} width={plotW * drawProgress} height={plotH} />
            </clipPath>
          </defs>

          {/* Grid Lines & Y-axis labels */}
          <g opacity={fadeGrid}>
            {gridY.map((val) => {
              const y = getY(val);
              return (
                <g key={val}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={val === 0 ? PALETTE.inkBlack : PALETTE.border}
                    strokeWidth={val === 0 ? 1.5 : 1}
                    strokeDasharray={val === 0 ? "none" : "4 4"}
                  />
                  <text
                    x={padding.left - 14}
                    y={y + 4}
                    textAnchor="end"
                    fontFamily="Poppins"
                    fontSize={11}
                    fontWeight={600}
                    fill={PALETTE.neutralGrey}
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* X-axis year ticks */}
            {DATA.map((d) => {
              const x = getX(d.year);
              return (
                <g key={d.year}>
                  <line x1={x} y1={padding.top} x2={x} y2={padding.top + plotH} stroke={PALETTE.gridHairline} strokeWidth={1} />
                  <text
                    x={x}
                    y={padding.top + plotH + 28}
                    textAnchor="middle"
                    fontFamily="Poppins"
                    fontSize={12}
                    fontWeight={d.year === 2009 || d.year === 2016 ? 800 : 500}
                    fill={d.year === 2016 ? PALETTE.signalOrange : d.year === 2009 ? PALETTE.electricCobalt : PALETTE.inkBlack}
                  >
                    {d.year}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Area Fill beneath curve */}
          <path d={areaD} fill="url(#chartGradient)" clipPath="url(#chartClip)" />

          {/* Animated Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineStroke)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: totalLength,
              strokeDashoffset,
            }}
          />

          {/* Data Markers */}
          {points.map((pt, i) => {
            const isVisible = drawProgress >= i / (points.length - 1);
            if (!isVisible) return null;

            const isStart = i === 0;
            const isEnd = i === points.length - 1;

            return (
              <g key={pt.year} transform={`translate(${pt.x}, ${pt.y})`}>
                {/* Glow ring on end point */}
                {isEnd && (
                  <circle
                    r={18 + Math.sin(frame * 0.15) * 4}
                    fill="none"
                    stroke={PALETTE.signalOrange}
                    strokeWidth={2}
                    opacity={0.6}
                  />
                )}
                <circle
                  r={isStart || isEnd ? 8 : 4.5}
                  fill={isEnd ? PALETTE.signalOrange : isStart ? PALETTE.electricCobalt : "#FFF"}
                  stroke={isEnd ? "#FFF" : isStart ? "#FFF" : PALETTE.electricCobalt}
                  strokeWidth={2.5}
                />
              </g>
            );
          })}
        </svg>

        {/* 2009 Starting Callout Badge */}
        <div
          style={{
            position: "absolute",
            left: points[0].x - 10,
            top: points[0].y - 68,
            backgroundColor: PALETTE.electricCobalt,
            color: "#FFF",
            padding: "6px 12px",
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 800,
            boxShadow: "0 6px 16px rgba(36, 87, 255, 0.35)",
            pointerEvents: "none",
          }}
        >
          2009: 19.9%
        </div>

        {/* 2016 Final Collapse Callout Badge */}
        {drawProgress >= 0.85 && (
          <div
            style={{
              position: "absolute",
              right: padding.right - 10,
              top: points[points.length - 1].y - 74,
              backgroundColor: PALETTE.signalOrange,
              color: "#FFF",
              padding: "8px 14px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 800,
              boxShadow: "0 6px 20px rgba(255, 90, 54, 0.45)",
              animation: "fadeIn 0.3s ease",
            }}
          >
            2016: 0.05%
            <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.9, marginTop: 1 }}>END OF HARDWARE ERA</div>
          </div>
        )}
      </div>

      {/* Footnote citation */}
      <div
        style={{
          width: chartWidth,
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: PALETTE.neutralGrey,
          fontWeight: 500,
        }}
      >
        <span>* Figures reflect approx. worldwide unit sales share, not total company revenue.</span>
        <span>BLACKBERRY CASE STUDY · SIMPLEDEAV</span>
      </div>
    </div>
  );
};
