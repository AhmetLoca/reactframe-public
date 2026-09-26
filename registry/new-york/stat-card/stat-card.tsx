"use client";

import * as React from "react";
import { motion, animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type StatCardSize = "sm" | "md" | "lg";
export type StatCardTrend = "up" | "down" | "neutral";

export interface StatCardProps {
  label: string;
  value: number;
  /** Used to auto-compute a percentage delta when `delta` isn't given directly. */
  previousValue?: number;
  /** Percentage change; overrides one derived from previousValue. */
  delta?: number;
  deltaLabel?: string;
  /** Overrides the up/down/neutral arrow direction the sign of delta would otherwise imply. */
  trend?: StatCardTrend;
  /** Whether an "up" trend is the good outcome (revenue) or the bad one (error rate, latency, disk usage). */
  goodDirection?: "up" | "down";
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  formatValue?: (value: number) => string;
  /** A handful of recent values, oldest first, rendered as a small drawn-in line. */
  sparkline?: number[];
  /** "sharp" connects points with straight segments; "smooth" runs a curve through them. */
  sparklineStyle?: "sharp" | "smooth";
  animateValue?: boolean;
  size?: StatCardSize;
  theme?: "dark" | "light";
  accentColor?: string;
  width?: number | string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.09)", text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", faint: "rgba(245,244,241,0.3)", iconBg: "rgba(255,255,255,0.06)", good: "#87FFE3", bad: "#FF7A6B", neutralBadge: "rgba(245,244,241,0.08)", tooltipBg: "#1A1A1C", tooltipBorder: "rgba(255,255,255,0.12)", crosshair: "rgba(245,244,241,0.35)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.1)", text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", faint: "rgba(10,10,10,0.3)", iconBg: "rgba(10,10,10,0.05)", good: "#0F9F7F", bad: "#E5484D", neutralBadge: "rgba(10,10,10,0.06)", tooltipBg: "#FFFFFF", tooltipBorder: "rgba(10,10,10,0.1)", crosshair: "rgba(10,10,10,0.3)" },
};

const SIZES: Record<StatCardSize, { pad: number; radius: number; label: number; value: number; icon: number; gap: number; sparkH: number }> = {
  sm: { pad: 16, radius: 14, label: 12, value: 22, icon: 30, gap: 8, sparkH: 28 },
  md: { pad: 20, radius: 16, label: 12.5, value: 28, icon: 36, gap: 10, sparkH: 36 },
  lg: { pad: 24, radius: 18, label: 13.5, value: 34, icon: 42, gap: 12, sparkH: 44 },
};

type Size = (typeof SIZES)["md"];
type Palette = (typeof PALETTES)["dark"];

function TrendArrow({ trend, size }: { trend: StatCardTrend; size: number }) {
  if (trend === "neutral") {
    return (
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M2.5 6h7" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: trend === "down" ? "rotate(180deg)" : undefined }}>
      <path d="M6 9.5V2.3M2.8 5.3L6 2L9.2 5.3" />
    </svg>
  );
}

type Point = readonly [number, number];

/** Monotone cubic Hermite interpolation (Fritsch-Carlson), converted to
 * cubic Beziers. A plain Catmull-Rom curve can overshoot past a point's
 * own value on a sharp direction change — e.g. the last point in a chart
 * that's flat and then spikes up would get a curve that bulges *above*
 * that final point, pushing it outside the sparkline's own drawable area
 * and into a clipped-looking sliver above the card. This construction is
 * mathematically guaranteed not to overshoot between any two consecutive
 * points, which is why charting libraries (D3, Recharts) use it for
 * exactly this "smooth line through real data" case. */
function smoothPath(points: Point[]): string {
  const n = points.length;
  if (n < 3) return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

  const dx: number[] = [];
  const secant: number[] = [];
  for (let i = 0; i < n - 1; i++) {
    dx[i] = points[i + 1][0] - points[i][0];
    secant[i] = dx[i] === 0 ? 0 : (points[i + 1][1] - points[i][1]) / dx[i];
  }

  const tangent: number[] = new Array(n);
  tangent[0] = secant[0];
  tangent[n - 1] = secant[n - 2];
  for (let i = 1; i < n - 1; i++) {
    tangent[i] = secant[i - 1] === 0 || secant[i] === 0 || secant[i - 1] < 0 !== secant[i] < 0 ? 0 : (secant[i - 1] + secant[i]) / 2;
  }
  for (let i = 0; i < n - 1; i++) {
    if (secant[i] === 0) {
      tangent[i] = 0;
      tangent[i + 1] = 0;
      continue;
    }
    const a = tangent[i] / secant[i];
    const b = tangent[i + 1] / secant[i];
    const s = a * a + b * b;
    if (s > 9) {
      const tau = 3 / Math.sqrt(s);
      tangent[i] = tau * a * secant[i];
      tangent[i + 1] = tau * b * secant[i];
    }
  }

  let d = `M${points[0][0].toFixed(2)},${points[0][1].toFixed(2)}`;
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    const h = dx[i];
    const c1x = x0 + h / 3;
    const c1y = y0 + (tangent[i] * h) / 3;
    const c2x = x1 - h / 3;
    const c2y = y1 - (tangent[i + 1] * h) / 3;
    d += ` C${c1x.toFixed(2)},${c1y.toFixed(2)} ${c2x.toFixed(2)},${c2y.toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
  }
  return d;
}

function sharpPath(points: Point[]): string {
  return points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function formatSparkPoint(v: number, prefix?: string, suffix?: string, formatValue?: (v: number) => string) {
  if (formatValue) return formatValue(v);
  const decimals = Number.isInteger(v) ? 0 : 2;
  return `${prefix ?? ""}${v.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix ?? ""}`;
}

interface SparklineProps {
  data: number[];
  s: Size;
  p: Palette;
  color: string;
  style: "sharp" | "smooth";
  prefix?: string;
  suffix?: string;
  formatValue?: (v: number) => string;
  label: string;
}

function Sparkline({ data, s, p, color, style, prefix, suffix, formatValue, label }: SparklineProps) {
  const width = 100;
  const height = s.sparkH;
  const pad = 4;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const toPoints = (values: number[]): Point[] =>
    values.map((v, i) => [
      values.length === 1 ? width / 2 : (i / (values.length - 1)) * (width - pad * 2) + pad,
      height - pad - ((v - min) / range) * (height - pad * 2),
    ]);
  const points = toPoints(data);
  const linePath = style === "smooth" ? smoothPath(points) : sharpPath(points);
  const last = points[points.length - 1];
  const areaPath = `${linePath} L${last[0].toFixed(2)},${height} L${points[0][0].toFixed(2)},${height} Z`;
  const gradId = React.useId();
  const glowId = React.useId();

  const [hover, setHover] = React.useState<number | null>(null);
  const [entered, setEntered] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const interactive = data.length > 1;

  const nearestIndex = (clientX: number) => {
    const el = containerRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * width;
    let best = 0;
    let bestDist = Infinity;
    points.forEach((pt, i) => {
      const d = Math.abs(pt[0] - x);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    return best;
  };

  const summary = `${label} trend from ${formatSparkPoint(data[0], prefix, suffix, formatValue)} to ${formatSparkPoint(data[data.length - 1], prefix, suffix, formatValue)}, peak ${formatSparkPoint(max, prefix, suffix, formatValue)}`;

  return (
    <div
      ref={containerRef}
      role={interactive ? "img" : undefined}
      aria-label={interactive ? summary : undefined}
      tabIndex={interactive ? 0 : undefined}
      className="relative outline-none focus-visible:ring-2 rounded-lg"
      style={{ height, cursor: interactive ? "crosshair" : undefined, ["--tw-ring-color" as string]: color }}
      onMouseMove={interactive ? (e) => setHover(nearestIndex(e.clientX)) : undefined}
      onMouseLeave={interactive ? () => setHover(null) : undefined}
      onFocus={interactive ? () => setHover((h) => h ?? points.length - 1) : undefined}
      onBlur={interactive ? () => setHover(null) : undefined}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                setHover((h) => Math.min(points.length - 1, (h ?? -1) + 1));
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                setHover((h) => Math.max(0, (h ?? points.length) - 1));
              } else if (e.key === "Home") {
                e.preventDefault();
                setHover(0);
              } else if (e.key === "End") {
                e.preventDefault();
                setHover(points.length - 1);
              } else if (e.key === "Escape") {
                setHover(null);
              }
            }
          : undefined
      }
    >
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" style={{ overflow: "visible", display: "block" }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.38" />
            <stop offset="55%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <filter id={glowId} x="-30%" y="-60%" width="160%" height="220%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <motion.path d={areaPath} fill={`url(#${gradId})`} stroke="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.15 }} />
        <motion.path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          vectorEffect="non-scaling-stroke"
          filter={`url(#${glowId})`}
        />
        {hover !== null && (
          <line x1={points[hover][0]} x2={points[hover][0]} y1={points[hover][1]} y2={height} stroke={p.crosshair} strokeWidth="0.6" strokeDasharray="1.5 2" />
        )}
        {/* Kept mounted (never swapped out) so the spring pop-in only ever
         * plays once, on first mount — toggling it off and back on via
         * hover would otherwise restart that same entrance transition,
         * including its 0.75s delay, every time the pointer leaves. */}
        <motion.circle
          cx={last[0]}
          cy={last[1]}
          r="2.6"
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: hover === null ? 1 : 0 }}
          transition={entered ? { duration: 0.15 } : { delay: 0.75, duration: 0.25, ease: "backOut" }}
          onAnimationComplete={() => setEntered(true)}
          style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
        />
        <motion.circle
          cx={last[0]}
          cy={last[1]}
          r="2.6"
          fill="none"
          stroke={color}
          strokeWidth="1.4"
          initial={{ opacity: 0 }}
          animate={hover === null ? { scale: [1, 2.6], opacity: [0.6, 0] } : { opacity: 0 }}
          transition={hover === null ? { delay: entered ? 0 : 0.9, duration: 1.6, repeat: Infinity, ease: "easeOut" } : { duration: 0.15 }}
          style={{ transformOrigin: `${last[0]}px ${last[1]}px` }}
        />
        {hover !== null && <circle cx={points[hover][0]} cy={points[hover][1]} r="2.8" fill={p.tooltipBg} stroke={color} strokeWidth="1.6" />}
      </svg>

      {hover !== null && (
        <div
          role="status"
          className="pointer-events-none absolute whitespace-nowrap rounded-lg font-semibold"
          style={{
            left: `${(points[hover][0] / width) * 100}%`,
            top: Math.max(0, (points[hover][1] / height) * height - 34),
            transform: "translateX(-50%)",
            background: p.tooltipBg,
            border: `1px solid ${p.tooltipBorder}`,
            color: p.text,
            fontSize: s.label - 2,
            padding: "4px 7px",
            boxShadow: "0 8px 22px rgba(0,0,0,0.28)",
            zIndex: 2,
          }}
        >
          {formatSparkPoint(data[hover], prefix, suffix, formatValue)}
        </div>
      )}
    </div>
  );
}

export function StatCard({
  label,
  value,
  previousValue,
  delta,
  deltaLabel,
  trend,
  goodDirection = "up",
  icon,
  prefix,
  suffix,
  formatValue,
  sparkline,
  sparklineStyle = "smooth",
  animateValue = true,
  size = "md",
  theme = "dark",
  accentColor,
  width = 260,
  className,
}: StatCardProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();

  const resolvedDelta = delta ?? (previousValue !== undefined && previousValue !== 0 ? ((value - previousValue) / Math.abs(previousValue)) * 100 : undefined);
  const resolvedTrend: StatCardTrend = trend ?? (resolvedDelta === undefined || Math.abs(resolvedDelta) < 0.05 ? "neutral" : resolvedDelta > 0 ? "up" : "down");
  const isGood = resolvedTrend === "neutral" ? null : (resolvedTrend === "up") === (goodDirection === "up");
  const trendColor = resolvedTrend === "neutral" ? p.muted : isGood ? p.good : p.bad;

  const mv = useMotionValue(0);
  const [shown, setShown] = React.useState(animateValue ? 0 : value);
  useMotionValueEvent(mv, "change", (v) => setShown(v));
  React.useEffect(() => {
    if (!animateValue) {
      // mv.jump sets the motion value immediately (no animation) but still
      // fires the "change" subscription above, which is what actually
      // updates `shown` — calling setShown directly here instead would be
      // a same-render setState-in-effect, exactly what the "external
      // system" pattern (subscribe, let its callback setState) exists to
      // avoid.
      mv.jump(value);
      return;
    }
    const controls = animate(mv, value, { duration: 0.9, ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [value, animateValue, mv]);

  const decimals = Number.isInteger(value) ? 0 : 2;
  const text = formatValue ? formatValue(shown) : `${prefix ?? ""}${shown.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix ?? ""}`;

  const sparkColor = accentColor ?? (resolvedTrend === "neutral" ? p.muted : trendColor);

  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ width, maxWidth: "100%", padding: s.pad, borderRadius: s.radius, background: p.bg, border: `1px solid ${p.border}`, fontFamily: "Inter, sans-serif", gap: s.gap }}
    >
      <div className="flex items-center" style={{ gap: 10 }}>
        {icon && (
          <span className="flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.icon, borderRadius: Math.round(s.icon * 0.32), background: p.iconBg, color: accentColor ?? sparkColor }}>
            {icon}
          </span>
        )}
        <span id={`${uid}-label`} className="font-medium" style={{ color: p.muted, fontSize: s.label, lineHeight: 1.4 }}>
          {label}
        </span>
      </div>

      <span aria-labelledby={`${uid}-label`} className="font-semibold tabular-nums tracking-[-0.02em]" style={{ color: p.text, fontSize: s.value, lineHeight: 1.1 }}>
        {text}
      </span>

      {(resolvedDelta !== undefined || deltaLabel) && (
        <div className="flex items-center" style={{ gap: 6 }}>
          {resolvedDelta !== undefined && (
            <span className="inline-flex items-center font-semibold tabular-nums" style={{ gap: 3, color: trendColor, fontSize: s.label - 0.5 }}>
              <TrendArrow trend={resolvedTrend} size={s.label - 3} />
              {Math.abs(resolvedDelta).toFixed(Math.abs(resolvedDelta) < 10 ? 1 : 0)}%
            </span>
          )}
          {deltaLabel && (
            <span style={{ color: p.faint, fontSize: s.label - 0.5 }}>{deltaLabel}</span>
          )}
        </div>
      )}

      {sparkline && sparkline.length > 1 && (
        <div style={{ marginTop: sparkline ? 2 : 0 }}>
          <Sparkline data={sparkline} s={s} p={p} color={sparkColor} style={sparklineStyle} prefix={prefix} suffix={suffix} formatValue={formatValue} label={label} />
        </div>
      )}
    </div>
  );
}
