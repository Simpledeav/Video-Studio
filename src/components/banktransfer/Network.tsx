import type { CSSProperties } from "react";
import { C, FONT, MONO } from "../../config/bankTransfer";
import { BankMark, clamp, Mono, Tag } from "./kit";

export type FlowStatus = "idle" | "live" | "success" | "timeout" | "pending" | "missing";

const statusColor = (status: FlowStatus) => {
  switch (status) {
    case "success":
      return C.green;
    case "timeout":
    case "missing":
      return C.red;
    case "pending":
      return C.amber;
    case "live":
      return C.cyan;
    default:
      return C.dim;
  }
};

export const NodeIcon: React.FC<{ kind: "bank" | "hub" | "account"; size: number; color: string }> = ({
  kind,
  size,
  color,
}) => {
  if (kind === "hub") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4 9.5L12 4L20 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M4 20H20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6.5 20V12.2M12 20V12.2M17.5 20V12.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "account") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={color} strokeWidth="1.5" />
        <path d="M3 10H21" stroke={color} strokeWidth="1.5" />
        <path d="M7 15H11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M3 10L12 4L21 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 10V20H19.5V10" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 20V14H15V20" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
};

export type FlowNodeProps = {
  kind: "bank" | "hub" | "account";
  label: string;
  name: string;
  detail?: string;
  width: number;
  active?: boolean;
  status?: FlowStatus;
  bank?: "sender" | "receiver";
  style?: CSSProperties;
  compact?: boolean;
};

export const FlowNode: React.FC<FlowNodeProps> = ({
  kind,
  label,
  name,
  detail,
  width,
  active = false,
  status = "idle",
  bank = "sender",
  style,
  compact = false,
}) => {
  const color = statusColor(status);
  const isHub = kind === "hub";
  // Type scales with the node's visual density, not its full vertical width.
  const u = Math.min(width, compact ? 270 : 340);
  return (
    <div
      style={{
        width,
        position: "relative",
        borderRadius: u * 0.045,
        border: `1px solid ${active ? `${color}88` : C.line}`,
        background: active
          ? `linear-gradient(160deg, ${color}16, rgba(8,17,29,0.94))`
          : "linear-gradient(160deg, rgba(18,35,56,0.72), rgba(8,17,29,0.9))",
        boxShadow: active ? `0 0 ${u * 0.12}px ${color}22, 0 ${u * 0.05}px ${u * 0.1}px rgba(0,0,0,0.42)` : `0 ${u * 0.035}px ${u * 0.08}px rgba(0,0,0,0.34)`,
        padding: compact ? u * 0.075 : u * 0.085,
        display: "flex",
        flexDirection: "column",
        gap: compact ? u * 0.035 : u * 0.045,
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: u * 0.05 }}>
        {kind === "bank" ? (
          <BankMark bank={bank} size={u * 0.13} />
        ) : (
          <div
            style={{
              width: u * 0.13,
              height: u * 0.13,
              borderRadius: u * 0.034,
              background: `${color}18`,
              border: `1px solid ${color}44`,
              display: "grid",
              placeItems: "center",
              flexShrink: 0,
            }}
          >
            <NodeIcon kind={kind} size={u * 0.075} color={color} />
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: u * 0.04, letterSpacing: "0.1em", color: C.muted }}>
            {label}
          </div>
          <div
            style={{
              fontFamily: FONT,
              fontSize: u * 0.072,
              fontWeight: 600,
              color: C.white,
              lineHeight: 1.15,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </div>
        </div>
      </div>
      {detail ? (
        <div
          style={{
            fontFamily: MONO,
            fontSize: u * 0.038,
            letterSpacing: "0.07em",
            color: isHub && active ? color : C.dim,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {detail}
        </div>
      ) : null}
      {active ? (
        <span
          style={{
            position: "absolute",
            top: u * 0.05,
            right: u * 0.05,
            width: u * 0.018,
            height: u * 0.018,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${u * 0.035}px ${color}`,
          }}
        />
      ) : null}
    </div>
  );
};

export type FlowDiagramProps = {
  orientation: "horizontal" | "vertical";
  width: number;
  scale?: number;
  reveal?: number;
  activeIndex?: number;
  packet?: number;
  status?: FlowStatus;
  showMessageTag?: boolean;
  compact?: boolean;
  senderActive?: boolean;
  hubActive?: boolean;
  receiverActive?: boolean;
  beneficiaryActive?: boolean;
  style?: CSSProperties;
};

const NODE_GAP = 0.036;

/**
 * The four-stage interbank route. Deliberately draws a *message* path, not a
 * cable carrying cash: the tag above the line says TRANSACTION MESSAGE.
 */
export const FlowDiagram: React.FC<FlowDiagramProps> = ({
  orientation,
  width,
  scale = 1,
  reveal = 1,
  activeIndex = -1,
  packet = 0,
  status = "live",
  showMessageTag = true,
  compact = false,
  senderActive,
  hubActive,
  receiverActive,
  beneficiaryActive,
  style,
}) => {
  const horizontal = orientation === "horizontal";
  const nodeW = horizontal ? (width * (1 - NODE_GAP * 3)) / 4 : width;
  const nodeH = compact ? 96 * scale : 126 * scale;
  const gap = horizontal ? width * NODE_GAP : 54 * scale;
  const total = horizontal ? width : nodeH * 4 + gap * 3;
  const color = statusColor(status);
  const packetPos = clamp(packet);

  const nodes = [
    {
      kind: "bank" as const,
      label: "STAGE 01",
      name: "SENDER'S BANK",
      detail: "NORTHSTAR · DEBIT POSTED",
      bank: "sender" as const,
      active: senderActive ?? activeIndex >= 0,
    },
    {
      kind: "hub" as const,
      label: "STAGE 02",
      name: "NIBSS / NIP",
      detail: "INTERBANK MESSAGE EXCHANGE",
      bank: "sender" as const,
      active: hubActive ?? activeIndex >= 1,
    },
    {
      kind: "bank" as const,
      label: "STAGE 03",
      name: "RECEIVING BANK",
      detail: "MERIDIAN · CREDIT CHECK",
      bank: "receiver" as const,
      active: receiverActive ?? activeIndex >= 2,
    },
    {
      kind: "account" as const,
      label: "STAGE 04",
      name: "BENEFICIARY",
      detail: "TUNDE B. · ACCOUNT •••• 4821",
      bank: "receiver" as const,
      active: beneficiaryActive ?? activeIndex >= 3,
    },
  ];

  const packetLeft = horizontal ? width * 0.1125 + (width * 0.775) * packetPos : 0;
  const packetTop = horizontal ? 0 : nodeH * 0.5 + (nodeH + gap) * 3 * packetPos;

  return (
    <div style={{ width: horizontal ? width : nodeW, height: horizontal ? nodeH : total, position: "relative", ...style }}>
      {showMessageTag ? (
        <div
          style={{
            position: "absolute",
            top: horizontal ? -44 * scale : -40 * scale,
            left: horizontal ? width * 0.14 : 0,
            display: "flex",
            alignItems: "center",
            gap: 8 * scale,
            opacity: reveal,
          }}
        >
          <Tag color={color} background={`${color}14`} border={`${color}33`} style={{ fontSize: 10 * scale, padding: `${5 * scale}px ${8 * scale}px` }}>
            TRANSACTION MESSAGE
          </Tag>
          <Mono size={9 * scale} color={C.dim}>
            NOT PHYSICAL CASH
          </Mono>
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          left: horizontal ? width * 0.11 : nodeW * 0.5,
          top: horizontal ? nodeH * 0.5 : nodeH * 0.5,
          width: horizontal ? width * 0.78 : 1,
          height: horizontal ? 1 : nodeH * 3 + gap * 3,
          background: `linear-gradient(${horizontal ? "90deg" : "180deg"}, ${color}11, ${color}55, ${color}11)`,
          opacity: reveal,
          transformOrigin: horizontal ? "left center" : "center top",
          transform: horizontal ? `scaleX(${reveal})` : `scaleY(${reveal})`,
        }}
      />
      {horizontal ? (
        <div
          style={{
            position: "absolute",
            left: width * 0.11,
            top: nodeH * 0.5 - 0.5,
            width: width * 0.78,
            height: 1,
            backgroundImage: `repeating-linear-gradient(90deg, ${color}88 0 6px, transparent 6px 13px)`,
            opacity: 0.38 * reveal,
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            left: nodeW * 0.5 - 0.5,
            top: nodeH * 0.5,
            width: 1,
            height: nodeH * 3 + gap * 3,
            backgroundImage: `repeating-linear-gradient(180deg, ${color}88 0 6px, transparent 6px 13px)`,
            opacity: 0.38 * reveal,
          }}
        />
      )}

      {nodes.map((node, index) => (
        <FlowNode
          key={node.name}
          {...node}
          width={nodeW}
          status={index <= activeIndex ? status : "idle"}
          compact={compact}
          style={
            horizontal
              ? { position: "absolute", left: index * (nodeW + gap), top: 0 }
              : { position: "absolute", left: 0, top: index * (nodeH + gap) }
          }
        />
      ))}

      {reveal > 0.2 ? (
        <div
          style={{
            position: "absolute",
            left: horizontal ? packetLeft : nodeW * 0.5 - 7 * scale,
            top: horizontal ? nodeH * 0.5 - 7 * scale : packetTop - 7 * scale,
            width: 14 * scale,
            height: 14 * scale,
            borderRadius: "50%",
            background: color,
            boxShadow: `0 0 ${20 * scale}px ${color}, 0 0 ${48 * scale}px ${color}66`,
            opacity: packetPos > 0 && packetPos < 1 ? 1 : 0,
            zIndex: 5,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -7 * scale,
              borderRadius: "50%",
              border: `1px solid ${color}55`,
            }}
          />
        </div>
      ) : null}

      <div
        style={{
          position: "absolute",
          right: 0,
          bottom: horizontal ? -30 * scale : -30 * scale,
          fontFamily: MONO,
          fontSize: 9 * scale,
          letterSpacing: "0.13em",
          color: C.dim,
          opacity: 0.8 * reveal,
        }}
      >
        MESSAGE ONLY · NO CASH IN TRANSIT
      </div>
    </div>
  );
};

/** Compact three-node route used inside the failure cards. */
export const MiniFlow: React.FC<{
  width: number;
  status: FlowStatus;
  packet?: number;
  scale?: number;
}> = ({ width, status, packet = 0.5, scale = 1 }) => {
  const color = statusColor(status);
  return (
    <div style={{ width, height: 56 * scale, position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: 27 * scale,
          left: width * 0.12,
          right: width * 0.12,
          height: 1,
          background: `linear-gradient(90deg, ${C.cyan}44, ${color}, ${color}55)`,
        }}
      />
      {[0, 0.5, 1].map((p, i) => (
        <div
          key={p}
          style={{
            position: "absolute",
            left: width * 0.06 + (width * 0.88 - 30 * scale) * p,
            top: 15 * scale,
            width: 26 * scale,
            height: 26 * scale,
            borderRadius: i === 1 ? 7 * scale : 13 * scale,
            border: `1px solid ${i === 1 ? color : C.line}`,
            background: i === 1 ? `${color}18` : "rgba(255,255,255,0.03)",
            display: "grid",
            placeItems: "center",
            color: i === 1 ? color : C.muted,
            fontFamily: MONO,
            fontSize: 8 * scale,
            fontWeight: 700,
          }}
        >
          {i === 0 ? "B1" : i === 1 ? "NIP" : "B2"}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: width * 0.12 + (width * 0.76 - 8 * scale) * clamp(packet),
          top: 23 * scale,
          width: 8 * scale,
          height: 8 * scale,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 ${10 * scale}px ${color}`,
        }}
      />
    </div>
  );
};

/** A network field: two institutions around the central infrastructure hub. */
export const NetworkField: React.FC<{
  width: number;
  scale?: number;
  reveal?: number;
  pulse?: number;
  style?: CSSProperties;
}> = ({ width, scale = 1, reveal = 1, pulse = 0, style }) => {
  const size = width * 0.34;
  return (
    <div style={{ width, height: width * 0.55, position: "relative", ...style }}>
      <svg width={width} height={width * 0.55} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="netLine" x1="0" x2="1">
            <stop offset="0%" stopColor={C.cyan} stopOpacity="0.07" />
            <stop offset="50%" stopColor={C.cyan} stopOpacity="0.7" />
            <stop offset="100%" stopColor={C.cyan} stopOpacity="0.07" />
          </linearGradient>
        </defs>
        {[0, 1, 2].map((i) => (
          <path
            key={i}
            d={`M ${width * 0.2} ${width * 0.275 + i * 22 * scale} C ${width * 0.36} ${width * 0.275 - 40 * scale}, ${width * 0.64} ${width * 0.275 + 40 * scale}, ${width * 0.8} ${width * 0.275 + i * 22 * scale}`}
            stroke="url(#netLine)"
            strokeWidth={1.2 * scale}
            fill="none"
            strokeDasharray="350"
            strokeDashoffset={350 * (1 - reveal)}
            opacity={0.9 - i * 0.2}
          />
        ))}
        <circle cx={width * 0.5} cy={width * 0.275} r={size * 0.34 + pulse * 10 * scale} fill="none" stroke={C.cyan} strokeOpacity={0.16} strokeWidth={1} />
        <circle cx={width * 0.5} cy={width * 0.275} r={size * 0.46 + pulse * 16 * scale} fill="none" stroke={C.cyan} strokeOpacity={0.08} strokeWidth={1} />
      </svg>

      <div style={{ position: "absolute", left: 0, top: width * 0.16 }}>
        <FlowNode kind="bank" label="INSTITUTION A" name="SENDER'S BANK" detail="NORTHSTAR" width={width * 0.23} status="live" bank="sender" compact />
      </div>
      <div style={{ position: "absolute", right: 0, top: width * 0.16 }}>
        <FlowNode kind="bank" label="INSTITUTION B" name="RECEIVING BANK" detail="MERIDIAN" width={width * 0.23} status="live" bank="receiver" compact />
      </div>
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: width * 0.275,
          transform: "translate(-50%, -50%)",
          width: size,
          height: size,
          borderRadius: size * 0.2,
          border: `1px solid ${C.cyan}55`,
          background: "radial-gradient(circle at 50% 35%, rgba(58,222,255,0.18), rgba(6,14,24,0.96))",
          boxShadow: `0 0 ${60 * scale}px ${C.cyan}22, inset 0 0 ${30 * scale}px ${C.cyan}12`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 7 * scale,
          opacity: reveal,
          transformOrigin: "center",
        }}
      >
        <NodeIcon kind="hub" size={size * 0.24} color={C.cyan} />
        <div style={{ fontFamily: FONT, fontSize: size * 0.13, fontWeight: 700, letterSpacing: "0.04em", color: C.white }}>
          NIBSS / NIP
        </div>
        <div style={{ fontFamily: MONO, fontSize: size * 0.052, letterSpacing: "0.14em", color: C.muted, textAlign: "center" }}>
          INTERBANK PAYMENT
          <br />
          INFRASTRUCTURE
        </div>
      </div>
    </div>
  );
};
