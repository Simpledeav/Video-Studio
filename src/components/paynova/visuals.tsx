import { useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, MONO } from "../../config/paynova";

export const BackgroundGradient: React.FC = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: `linear-gradient(180deg, ${C.bgGradientTop} 0%, ${C.bg} 50%, ${C.bgGradientBottom} 100%)`,
    }}
  />
);

export const GridLines: React.FC<{ opacity?: number; density?: number }> = ({ opacity = 0.06, density = 60 }) => {
  const { width, height } = useVideoConfig();
  const cols = Math.ceil(width / density);
  const rows = Math.ceil(height / density);
  return (
    <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity, pointerEvents: "none" }}>
      {Array.from({ length: cols }).map((_, i) => (
        <line key={`c-${i}`} x1={i * density} y1={0} x2={i * density} y2={height} stroke={C.white} strokeWidth={1} />
      ))}
      {Array.from({ length: rows }).map((_, i) => (
        <line key={`r-${i}`} x1={0} y1={i * density} x2={width} y2={i * density} stroke={C.white} strokeWidth={1} />
      ))}
    </svg>
  );
};

export const OfficeEnvironment: React.FC<{ blur?: number; people?: boolean }> = ({ blur = 0, people = false }) => {
  const { width, height } = useVideoConfig();
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        opacity: blur > 0 ? 0.55 : 1,
      }}
    >
      {/* Far wall */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: height * 0.42, background: C.bgSecondary }} />
      {/* Floor */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: height * 0.58,
          background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`,
        }}
      />
      {/* Glass wall reflection */}
      <div
        style={{
          position: "absolute",
          left: width * 0.05,
          right: width * 0.05,
          top: height * 0.08,
          height: height * 0.34,
          background: `linear-gradient(135deg, rgba(84,217,245,0.04) 0%, transparent 50%, rgba(84,217,245,0.03) 100%)`,
          border: `1px solid ${C.line}`,
          borderRadius: 8,
        }}
      />
      {/* Desk silhouettes */}
      <div
        style={{
          position: "absolute",
          left: width * 0.08,
          right: width * 0.08,
          bottom: height * 0.18,
          height: height * 0.22,
          background: C.surfaceLight,
          borderRadius: 12,
          opacity: 0.35,
        }}
      />
      {people && (
        <>
          <div
            style={{
              position: "absolute",
              left: width * 0.22,
              bottom: height * 0.28,
              width: 64,
              height: 140,
              background: C.surface,
              borderRadius: "32px 32px 0 0",
              opacity: 0.25,
            }}
          />
          <div
            style={{
              position: "absolute",
              right: width * 0.22,
              bottom: height * 0.28,
              width: 64,
              height: 140,
              background: C.surface,
              borderRadius: "32px 32px 0 0",
              opacity: 0.2,
            }}
          />
        </>
      )}
    </div>
  );
};

export const MonitorScreen: React.FC<{
  x: number;
  y: number;
  width: number;
  height: number;
  children: React.ReactNode;
  glow?: string;
}> = ({ x, y, width, height, children, glow = C.cyanGlow }) => {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width,
        height,
        borderRadius: 14,
        background: C.surface,
        border: `1px solid ${C.line}`,
        boxShadow: `0 0 60px ${glow}, 0 20px 60px ${C.shadow}`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 28,
          background: "rgba(255,255,255,0.03)",
          borderBottom: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          gap: 6,
        }}
      >
        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.red }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.amber }} />
        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />
      </div>
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>{children}</div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: -14,
          transform: "translateX(-50%)",
          width: width * 0.35,
          height: 14,
          background: C.surfaceLight,
          borderRadius: "0 0 4px 4px",
        }}
      />
    </div>
  );
};

export const TransactionAppScreen: React.FC<{ loading?: boolean; showNotification?: boolean }> = ({
  loading = false,
  showNotification = false,
}) => {
  const frame = useCurrentFrame();
  const spin = ((frame % 60) / 60) * 360;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 28,
        fontFamily: FONT,
        color: C.white,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>PAYNOVA</div>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.surfaceLight }} />
      </div>
      <div style={{ fontSize: 14, color: C.muted }}>Current Balance</div>
      <div style={{ fontSize: 42, fontWeight: 700, marginTop: -12 }}>$12,845.00</div>
      <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
        <div style={{ flex: 1, height: 44, borderRadius: 8, background: C.cyanSoft, display: "flex", alignItems: "center", justifyContent: "center", color: C.cyan, fontWeight: 600 }}>
          Send
        </div>
        <div style={{ flex: 1, height: 44, borderRadius: 8, background: C.surfaceLight, display: "flex", alignItems: "center", justifyContent: "center", color: C.white, fontWeight: 600 }}>
          Request
        </div>
      </div>
      <div style={{ marginTop: 8, fontSize: 14, color: C.muted }}>Recent Transactions</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          { name: "Coffee Shop", amount: "-$5.40", time: "Today" },
          { name: "Salary Deposit", amount: "+$4,200.00", time: "Yesterday" },
          { name: "Grocery Store", amount: "-$124.30", time: "Yesterday" },
        ].map((tx, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "14px 16px",
              borderRadius: 10,
              background: C.surfaceLight,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{tx.name}</div>
              <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{tx.time}</div>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, color: tx.amount.startsWith("+") ? C.green : C.white }}>{tx.amount}</div>
          </div>
        ))}
      </div>
      {loading && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,15,28,0.82)",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              border: `3px solid ${C.line}`,
              borderTopColor: C.cyan,
              transform: `rotate(${spin}deg)`,
            }}
          />
          <div style={{ color: C.muted, fontSize: 15 }}>Processing transaction...</div>
        </div>
      )}
      {showNotification && (
        <div
          style={{
            position: "absolute",
            top: 70,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 18px",
            borderRadius: 20,
            background: C.redSoft,
            border: `1px solid ${C.red}44`,
            color: C.red,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: 4, background: C.red }} />
          TRANSACTION DELAY
        </div>
      )}
    </div>
  );
};

export const CodeBlock: React.FC<{ code: string; highlighted?: boolean; label?: string }> = ({
  code,
  highlighted = false,
  label,
}) => (
  <div
    style={{
      padding: "18px 22px",
      borderRadius: 12,
      background: "rgba(0,0,0,0.35)",
      border: `1px solid ${highlighted ? C.cyan : C.line}`,
      fontFamily: MONO,
      fontSize: 16,
      lineHeight: 1.6,
      color: C.cream,
      whiteSpace: "pre-wrap",
      boxShadow: highlighted ? `0 0 30px ${C.cyanGlow}` : undefined,
    }}
  >
    {label && (
      <div style={{ fontFamily: FONT, fontSize: 11, color: C.muted, marginBottom: 8, letterSpacing: "0.08em" }}>{label}</div>
    )}
    {code.split("\n").map((line, i) => (
      <div key={i} style={{ display: "flex" }}>
        <span style={{ color: C.dim, width: 26, flexShrink: 0, userSelect: "none" }}>{i + 1}</span>
        <span>
          {line.split(" ").map((word, j) => {
            const isKeyword = /^(SELECT|FROM|WHERE|ORDER|BY|CREATE|INDEX|ON|DESC)$/i.test(word);
            const isString = /^['"]/.test(word);
            const isNumber = /^\d/.test(word);
            let color = C.cream;
            if (isKeyword) color = C.cyan;
            else if (isString) color = C.amber;
            else if (isNumber) color = C.violet;
            return (
              <span key={j} style={{ color }}>
                {word}{" "}
              </span>
            );
          })}
        </span>
      </div>
    ))}
  </div>
);

export const DatabaseTable: React.FC<{ rows?: number; scanProgress?: number; highlightRow?: number }> = ({
  rows = 12,
  scanProgress = 0,
  highlightRow = -1,
}) => {
  const visibleRows = Math.min(rows, Math.floor(rows * scanProgress));
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 20,
        fontFamily: MONO,
        fontSize: 13,
        color: C.cream,
        display: "flex",
        flexDirection: "column",
        gap: 6,
      }}
    >
      <div style={{ display: "flex", gap: 8, paddingBottom: 8, borderBottom: `1px solid ${C.line}`, color: C.muted, fontSize: 12 }}>
        <span style={{ width: 70 }}>id</span>
        <span style={{ width: 110 }}>user_id</span>
        <span style={{ width: 140 }}>amount</span>
        <span style={{ flex: 1 }}>created_at</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5, overflow: "hidden" }}>
        {Array.from({ length: rows }).map((_, i) => {
          const isTarget = i === highlightRow;
          const isScanned = i < visibleRows;
          return (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                padding: "7px 10px",
                borderRadius: 6,
                background: isTarget ? C.cyanSoft : isScanned ? C.amberSoft : "transparent",
                border: `1px solid ${isTarget ? C.cyan : isScanned ? C.amber : "transparent"}`,
                opacity: isScanned || isTarget ? 1 : 0.35,
                transition: "all 0.1s",
              }}
            >
              <span style={{ width: 70, color: C.dim }}>{10001 + i}</span>
              <span style={{ width: 110 }}>{219400 + i}</span>
              <span style={{ width: 140, color: C.green }}>${(Math.random() * 200).toFixed(2)}</span>
              <span style={{ flex: 1, color: C.muted }}>2024-{(i % 12) + 1}-{(i % 28) + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const QueryExecutionPlan: React.FC<{ showScan?: boolean; showIndex?: boolean }> = ({ showScan = true, showIndex = false }) => {
  const frame = useCurrentFrame();
  const pulse = (frame % 30) / 30;
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 24,
        fontFamily: FONT,
        color: C.white,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div style={{ fontSize: 14, color: C.muted, letterSpacing: "0.06em" }}>QUERY EXECUTION PLAN</div>
      <svg width="100%" height={180} viewBox="0 0 400 180" style={{ overflow: "visible" }}>
        {/* Result node */}
        <rect x={140} y={10} width={120} height={34} rx={6} fill={C.surfaceLight} stroke={C.line} />
        <text x={200} y={32} textAnchor="middle" fill={C.white} fontSize={12} fontFamily={FONT}>
          Result
        </text>
        {/* Sort node */}
        <rect x={140} y={58} width={120} height={34} rx={6} fill={C.surfaceLight} stroke={C.line} />
        <text x={200} y={80} textAnchor="middle" fill={C.white} fontSize={12} fontFamily={FONT}>
          Sort: created_at DESC
        </text>
        {/* Filter node */}
        <rect x={140} y={106} width={120} height={34} rx={6} fill={C.surfaceLight} stroke={C.line} />
        <text x={200} y={128} textAnchor="middle" fill={C.white} fontSize={12} fontFamily={FONT}>
          Filter: user_id
        </text>
        {/* Scan/Index node */}
        <rect
          x={110}
          y={154}
          width={180}
          height={34}
          rx={6}
          fill={showIndex ? C.greenSoft : C.redSoft}
          stroke={showIndex ? C.green : C.red}
          strokeWidth={2}
        />
        <text
          x={200}
          y={176}
          textAnchor="middle"
          fill={showIndex ? C.green : C.red}
          fontSize={13}
          fontWeight={700}
          fontFamily={FONT}
        >
          {showIndex ? "Index Scan: idx_user_created" : "Seq Scan: transactions"}
        </text>
        {/* Connector lines */}
        <line x1={200} y1={44} x2={200} y2={58} stroke={C.line} strokeWidth={2} />
        <line x1={200} y1={92} x2={200} y2={106} stroke={C.line} strokeWidth={2} />
        <line x1={200} y1={140} x2={200} y2={154} stroke={C.line} strokeWidth={2} />
        {showScan && !showIndex && (
          <circle cx={200} cy={154} r={6 + pulse * 4} fill="none" stroke={C.red} strokeWidth={2} opacity={1 - pulse} />
        )}
        {showIndex && <circle cx={200} cy={154} r={6 + pulse * 4} fill="none" stroke={C.green} strokeWidth={2} opacity={1 - pulse} />}
      </svg>
      <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
        <div style={{ flex: 1, padding: 14, borderRadius: 8, background: C.surfaceLight }}>
          <div style={{ fontSize: 12, color: C.muted }}>Cost</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: showIndex ? C.green : C.red }}>{showIndex ? "142" : "42,850"}</div>
        </div>
        <div style={{ flex: 1, padding: 14, borderRadius: 8, background: C.surfaceLight }}>
          <div style={{ fontSize: 12, color: C.muted }}>Rows</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: C.white }}>{showIndex ? "24" : "2,400,000"}</div>
        </div>
      </div>
    </div>
  );
};

export const APIRequestFlow: React.FC<{ count?: number; congested?: boolean }> = ({ count = 16, congested = false }) => {
  const frame = useCurrentFrame();
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
      {/* App */}
      <rect x={20} y={80} width={80} height={80} rx={12} fill={C.surfaceLight} stroke={C.line} />
      <text x={60} y={125} textAnchor="middle" fill={C.white} fontSize={12} fontFamily={FONT}>
        APP
      </text>
      {/* API */}
      <rect x={160} y={80} width={80} height={80} rx={12} fill={C.surfaceLight} stroke={C.line} />
      <text x={200} y={125} textAnchor="middle" fill={C.white} fontSize={12} fontFamily={FONT}>
        API
      </text>
      {/* DB */}
      <rect x={300} y={80} width={80} height={80} rx={12} fill={C.surfaceLight} stroke={C.line} />
      <text x={340} y={125} textAnchor="middle" fill={C.white} fontSize={12} fontFamily={FONT}>
        DB
      </text>

      {/* Request particles */}
      {Array.from({ length: count }).map((_, i) => {
        const offset = (i / count) * 120;
        const loopFrame = (frame + offset) % 120;
        const pathProgress = loopFrame / 120;
        const x = 100 + pathProgress * 200;
        const y = 120 + Math.sin(pathProgress * Math.PI * 2 + i) * 12;
        const isStuck = congested && pathProgress > 0.6 && pathProgress < 0.95;
        return (
          <circle
            key={i}
            cx={isStuck ? 270 + Math.sin(frame * 0.3 + i) * 10 : x}
            cy={isStuck ? 120 + Math.cos(frame * 0.3 + i) * 10 : y}
            r={congested && isStuck ? 5 : 4}
            fill={isStuck ? C.red : C.cyan}
            opacity={isStuck ? 0.9 : 0.75}
          />
        );
      })}

      {/* Queue indicator */}
      {congested && (
        <g>
          <rect x={250} y={40} width={100} height={28} rx={6} fill={C.redSoft} stroke={C.red} />
          <text x={300} y={58} textAnchor="middle" fill={C.red} fontSize={11} fontWeight={700} fontFamily={FONT}>
            QUEUE BUILDING
          </text>
        </g>
      )}
    </svg>
  );
};

export const MonitoringDashboard: React.FC<{ alert?: boolean; recovering?: boolean }> = ({ alert = false, recovering = false }) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: 22,
        fontFamily: FONT,
        color: C.white,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gridTemplateRows: "auto 1fr 1fr",
        gap: 14,
      }}
    >
      <div style={{ gridColumn: "1 / -1", fontSize: 14, color: C.muted, letterSpacing: "0.06em" }}>MONITORING DASHBOARD</div>
      {[
        { label: "Query Latency", value: alert ? "2.4s" : recovering ? "120ms" : "45ms", color: alert ? C.red : recovering ? C.green : C.cyan },
        { label: "DB CPU", value: alert ? "94%" : recovering ? "32%" : "18%", color: alert ? C.red : recovering ? C.green : C.cyan },
        { label: "API Response", value: alert ? "1.8s" : recovering ? "180ms" : "95ms", color: alert ? C.amber : recovering ? C.green : C.cyan },
        { label: "Queue Depth", value: alert ? "1,240" : recovering ? "12" : "0", color: alert ? C.red : recovering ? C.green : C.cyan },
      ].map((metric, i) => (
        <div key={i} style={{ padding: 14, borderRadius: 10, background: C.surfaceLight, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 12, color: C.muted }}>{metric.label}</div>
          <div style={{ fontSize: 26, fontWeight: 700, color: metric.color }}>{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

export const DatabaseIndexVisualization: React.FC = () => {
  return (
    <svg width="100%" height="100%" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
      {/* B-tree levels */}
      {[
        { x: 200, y: 30, w: 80, label: "root" },
        { x: 120, y: 90, w: 70, label: "2194xx" },
        { x: 280, y: 90, w: 70, label: "2195xx" },
        { x: 70, y: 160, w: 50, label: "219490" },
        { x: 140, y: 160, w: 50, label: "219493" },
        { x: 250, y: 160, w: 50, label: "219498" },
        { x: 320, y: 160, w: 50, label: "219499" },
      ].map((node, i) => (
        <g key={i}>
          <rect x={node.x - node.w / 2} y={node.y} width={node.w} height={32} rx={6} fill={C.surfaceLight} stroke={C.cyan} strokeWidth={1.5} />
          <text x={node.x} y={node.y + 21} textAnchor="middle" fill={C.cyan} fontSize={11} fontWeight={600} fontFamily={FONT}>
            {node.label}
          </text>
        </g>
      ))}
      {/* Connections */}
      <line x1={200} y1={62} x2={120} y2={90} stroke={C.line} strokeWidth={2} />
      <line x1={200} y1={62} x2={280} y2={90} stroke={C.line} strokeWidth={2} />
      <line x1={120} y1={122} x2={70} y2={160} stroke={C.line} strokeWidth={2} />
      <line x1={120} y1={122} x2={140} y2={160} stroke={C.line} strokeWidth={2} />
      <line x1={280} y1={122} x2={250} y2={160} stroke={C.line} strokeWidth={2} />
      <line x1={280} y1={122} x2={320} y2={160} stroke={C.line} strokeWidth={2} />

      {/* Highlight target */}
      <rect x={115} y={160} width={50} height={32} rx={6} fill={C.cyanSoft} stroke={C.cyan} strokeWidth={2} />
      <text x={140} y={181} textAnchor="middle" fill={C.cyan} fontSize={11} fontWeight={700} fontFamily={FONT}>
        219493
      </text>

      {/* Pointer arrow */}
      <path d="M 140 210 L 140 235" stroke={C.amber} strokeWidth={3} markerEnd="url(#arrow)" />
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={C.amber} />
        </marker>
      </defs>
      <text x={140} y={252} textAnchor="middle" fill={C.amber} fontSize={12} fontWeight={600} fontFamily={FONT}>
        Direct lookup
      </text>
    </svg>
  );
};

export const ComparisonCard: React.FC<{ type: "before" | "after"; title: string; items: string[] }> = ({
  type,
  title,
  items,
}) => {
  const accent = type === "before" ? C.red : C.green;
  return (
    <div
      style={{
        padding: 22,
        borderRadius: 14,
        background: C.surface,
        border: `1px solid ${accent}44`,
        boxShadow: `0 0 30px ${type === "before" ? C.redSoft : C.greenSoft}`,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 13, color: accent, fontWeight: 700, letterSpacing: "0.08em" }}>{title}</div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, color: C.cream, fontSize: 15 }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: accent }} />
          {item}
        </div>
      ))}
    </div>
  );
};
