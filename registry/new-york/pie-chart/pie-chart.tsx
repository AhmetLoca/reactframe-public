"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PieChartTheme = "light" | "dark";

export interface PieChartSlice {
  visible?: boolean;
  label: string;
  color: string;
  arr: number;
  accounts: number;
  avgContract: number;
}

export interface PieChartProps {
  theme?: PieChartTheme;
  title?: string;
  subtitle?: string;
  chartHeight?: number;
  centerLabel?: string;
  centerCaption?: string;
  outerRadius?: number;
  innerRadiusRatio?: number;
  gapDeg?: number;
  slices?: PieChartSlice[];
  enableHover?: boolean;
  className?: string;
}

const VB_W = 1200;
const VB_H = 560;
const PAD_TOP = 26;
const PAD_BOTTOM = 44;

function formatMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  return `$${Math.round(n / 1000)}K`;
}

function formatAvgContract(n: number): string {
  return `$${(n / 1000).toFixed(1)}K`;
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function pointOnCircle(cx: number, cy: number, r: number, angle: number) {
  return { x: round(cx + r * Math.cos(angle)), y: round(cy + r * Math.sin(angle)) };
}

const DEFAULT_SLICES: PieChartSlice[] = [
  { visible: true, label: "Enterprise", color: "#FB7C66", arr: 437500, accounts: 85, avgContract: 5147 },
  { visible: true, label: "Scale", color: "#D97706", arr: 325000, accounts: 210, avgContract: 1548 },
  { visible: true, label: "Growth", color: "#EC4899", arr: 214000, accounts: 146, avgContract: 1466 },
  { visible: true, label: "Partner", color: "#8B5CF6", arr: 125000, accounts: 60, avgContract: 2083 },
  { visible: true, label: "Starter", color: "#38BDF8", arr: 87500, accounts: 175, avgContract: 500 },
  { visible: true, label: "Legacy", color: "#34D399", arr: 61000, accounts: 40, avgContract: 1525 },
];

export function PieChart({
  theme = "dark",
  title = "ARR by plan tier",
  subtitle = "",
  chartHeight = 420,
  centerLabel = "ARR Mix",
  centerCaption = "plans tracked",
  outerRadius = 150,
  innerRadiusRatio = 0.5,
  gapDeg = 6,
  slices = DEFAULT_SLICES,
  enableHover = true,
  className,
}: PieChartProps) {
  const isDark = theme === "dark";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [hidden, setHidden] = React.useState<Set<number>>(new Set());
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // preserveAspectRatio="none" stretches the SVG to fill its box; on a narrow
  // container that non-uniform scaling squishes the donut into an ellipse, so
  // below the viewBox's natural aspect ratio we shrink the box to match it.
  const effectiveHeight = containerWidth > 0 ? Math.min(chartHeight, containerWidth * (VB_H / VB_W)) : chartHeight;

  const palette = {
    cardBg: isDark ? "#15161b" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    textPrimary: isDark ? "#f4f5f7" : "#111317",
    textSub: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,19,23,0.55)",
    badgeBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
  };

  const headerHeight = (title ? 30 : 0) + (subtitle ? 22 : 0);

  const cx = VB_W / 2;
  const cy = PAD_TOP + headerHeight + (VB_H - PAD_TOP - headerHeight - PAD_BOTTOM) / 2;
  const innerR = outerRadius * innerRadiusRatio;
  const ringR = (outerRadius + innerR) / 2;
  const ringWidth = outerRadius - innerR;
  const gapRad = (gapDeg * Math.PI) / 180;

  const active = React.useMemo(
    () => slices.map((s, i) => ({ ...s, i })).filter((s) => s.visible !== false && !hidden.has(s.i)),
    [slices, hidden],
  );
  const total = active.reduce((sum, s) => sum + s.arr, 0);

  const arcs = React.useMemo(() => {
    const result: Array<PieChartSlice & { i: number; fraction: number; start: number; end: number; mid: number }> = [];
    let cursor = -Math.PI / 2;
    for (const s of active) {
      const fraction = total > 0 ? s.arr / total : 0;
      const sweep = fraction * Math.PI * 2;
      const start = cursor + gapRad / 2;
      const end = cursor + sweep - gapRad / 2;
      const mid = cursor + sweep / 2;
      cursor += sweep;
      result.push({ ...s, fraction, start: Math.min(start, end), end: Math.max(start, end), mid });
    }
    return result;
  }, [active, total, gapRad]);

  const hovered = hoverIndex !== null ? arcs.find((a) => a.i === hoverIndex) : undefined;

  const toggleSlice = (i: number) => {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div
      className={cn("box-border flex w-full flex-col gap-1 overflow-hidden rounded-[20px]", className)}
      style={{ backgroundColor: palette.cardBg, border: `1px solid ${palette.cardBorder}`, padding: "28px 32px", fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif" }}
    >
      {title && <div className="text-center text-[17px] font-bold" style={{ color: palette.textPrimary }}>{title}</div>}
      {subtitle && (
        <div className="mx-auto mt-0.5 max-w-[760px] text-center text-[12.5px] leading-[1.5]" style={{ color: palette.textSub }}>
          {subtitle}
        </div>
      )}

      <div ref={containerRef} className="relative mt-3 w-full" style={{ height: effectiveHeight }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="block overflow-visible">
          {arcs.map((a) => {
            if (a.end - a.start <= 0) return null;
            const p1 = pointOnCircle(cx, cy, ringR, a.start);
            const p2 = pointOnCircle(cx, cy, ringR, a.end);
            const largeArc = a.end - a.start > Math.PI ? 1 : 0;
            const d = `M ${p1.x} ${p1.y} A ${ringR} ${ringR} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
            return (
              <path
                key={a.i}
                d={d}
                fill="none"
                stroke={a.color}
                strokeWidth={ringWidth}
                strokeLinecap="round"
                opacity={hoverIndex === null || hoverIndex === a.i ? 1 : 0.45}
                style={{ cursor: enableHover ? "pointer" : "default" }}
                onMouseEnter={() => enableHover && setHoverIndex(a.i)}
                onMouseLeave={() => enableHover && setHoverIndex(null)}
              />
            );
          })}
        </svg>

        {arcs.map((a) => {
          if (a.fraction <= 0) return null;
          const pos = pointOnCircle(cx, cy, outerRadius + 22, a.mid);
          return (
            <div
              key={`pct-${a.i}`}
              className="pointer-events-none absolute rounded-full text-[11px] font-extrabold whitespace-nowrap"
              style={{
                left: `${(pos.x / VB_W) * 100}%`,
                top: `${(pos.y / VB_H) * 100}%`,
                transform: "translate(-50%, -50%)",
                padding: "2px 8px",
                backgroundColor: `${a.color}33`,
                border: `1px solid ${a.color}77`,
                color: palette.textPrimary,
              }}
            >
              {Math.round(a.fraction * 100)}%
            </div>
          );
        })}

        <div
          className="absolute pointer-events-none text-center"
          style={{
            left: `${(cx / VB_W) * 100}%`,
            top: `${(cy / VB_H) * 100}%`,
            transform: "translate(-50%, -50%)",
            width: innerR * 1.7,
          }}
        >
          <div className="text-[11px] font-bold uppercase tracking-[0.8px]" style={{ color: palette.textSub }}>
            {hovered ? hovered.label : centerLabel}
          </div>
          <div className="mt-1 text-[24px] font-extrabold" style={{ color: palette.textPrimary }}>
            {formatMoney(hovered ? hovered.arr : total)}
          </div>
          <div className="mt-0.5 text-[11px]" style={{ color: palette.textSub }}>
            {hovered ? `${Math.round(hovered.fraction * 100)}% of total` : `${active.length} plans tracked`}
          </div>
          <div className="sr-only">{centerCaption}</div>
        </div>

        {enableHover && hoverIndex !== null && hovered && (
          <div
            className="absolute min-w-[170px] rounded-[10px] px-3.5 py-2.5 pointer-events-none"
            style={{
              left: `${(pointOnCircle(cx, cy, outerRadius + 40, hovered.mid).x / VB_W) * 100}%`,
              top: `${(pointOnCircle(cx, cy, outerRadius + 40, hovered.mid).y / VB_H) * 100}%`,
              transform: `translate(${Math.cos(hovered.mid) >= 0 ? "0%" : "-100%"}, -50%)`,
              backgroundColor: isDark ? "rgba(10,10,14,0.94)" : "rgba(255,255,255,0.97)",
              border: `1px solid ${palette.badgeBorder}`,
              boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div className="mb-1.5 text-[12px] font-bold" style={{ color: palette.textPrimary }}>
              {hovered.label}
            </div>
            <div className="flex items-center justify-between gap-3.5">
              <span className="text-[11.5px]" style={{ color: palette.textSub }}>ARR</span>
              <span className="text-[11.5px] font-bold" style={{ color: palette.textPrimary }}>{formatMoney(hovered.arr)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3.5">
              <span className="text-[11.5px]" style={{ color: palette.textSub }}>Accounts</span>
              <span className="text-[11.5px] font-bold" style={{ color: palette.textPrimary }}>{hovered.accounts}</span>
            </div>
            <div className="mt-1 flex items-center justify-between gap-3.5">
              <span className="text-[11.5px]" style={{ color: palette.textSub }}>Avg contract</span>
              <span className="text-[11.5px] font-bold" style={{ color: palette.textPrimary }}>{formatAvgContract(hovered.avgContract)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-4.5">
        {slices.map((s, i) => {
          const isHidden = hidden.has(i);
          return (
            <div
              key={i}
              onClick={() => toggleSlice(i)}
              className="flex cursor-pointer items-center gap-[7px]"
              style={{ opacity: isHidden ? 0.4 : 1 }}
            >
              <span className="inline-block h-[9px] w-[9px] rounded-full" style={{ backgroundColor: s.color }} />
              <span
                className="text-[12.5px] font-semibold"
                style={{ color: palette.textPrimary, textDecoration: isHidden ? "line-through" : "none" }}
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
