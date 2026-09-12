"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RadarChartTheme = "light" | "dark";

export interface RadarChartSeries {
  visible?: boolean;
  label: string;
  color: string;
  style?: "solid" | "dashed";
  showMarkers?: boolean;
}

export interface RadarChartAxisPoint {
  label: string;
  v1: number;
  v2: number;
  v3: number;
}

export interface RadarChartProps {
  theme?: RadarChartTheme;
  title?: string;
  subtitle?: string;
  chartHeight?: number;
  showLegend?: boolean;
  max?: number;
  rings?: number;
  outerRadius?: number;
  series1?: RadarChartSeries;
  series2?: RadarChartSeries;
  series3?: RadarChartSeries;
  axes?: RadarChartAxisPoint[];
  enableHover?: boolean;
  className?: string;
}

const VB_W = 1200;
const VB_H = 560;
const PAD_TOP = 26;
const PAD_BOTTOM = 44;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round(n: number): number {
  return Math.round(n * 1000) / 1000;
}

function pointOnCircle(cx: number, cy: number, r: number, angle: number) {
  return { x: round(cx + r * Math.cos(angle)), y: round(cy + r * Math.sin(angle)) };
}

const DEFAULT_SERIES1: Required<RadarChartSeries> = { visible: true, label: "Launch build", color: "#8B5CF6", style: "solid", showMarkers: true };
const DEFAULT_SERIES2: Required<RadarChartSeries> = { visible: true, label: "Target bar", color: "#2DD4BF", style: "dashed", showMarkers: false };
const DEFAULT_SERIES3: Required<RadarChartSeries> = { visible: true, label: "Buyer benchmark", color: "#FBBF24", style: "solid", showMarkers: true };

const DEFAULT_AXES: RadarChartAxisPoint[] = [
  { label: "SSO", v1: 78, v2: 80, v3: 60 },
  { label: "Data residency", v1: 55, v2: 82, v3: 58 },
  { label: "Audit exports", v1: 60, v2: 85, v3: 92 },
  { label: "Key rotation", v1: 58, v2: 88, v3: 90 },
  { label: "RPO drills", v1: 42, v2: 85, v3: 88 },
  { label: "Admin guardrails", v1: 50, v2: 82, v3: 70 },
  { label: "Procurement", v1: 48, v2: 80, v3: 65 },
  { label: "Support SLA", v1: 72, v2: 85, v3: 78 },
];

export function RadarChart({
  theme = "dark",
  title = "Security posture comparison",
  subtitle = "",
  chartHeight = 420,
  showLegend = true,
  max = 100,
  rings = 4,
  outerRadius = 150,
  series1 = DEFAULT_SERIES1,
  series2 = DEFAULT_SERIES2,
  series3 = DEFAULT_SERIES3,
  axes = DEFAULT_AXES,
  enableHover = true,
  className,
}: RadarChartProps) {
  const isDark = theme === "dark";
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // preserveAspectRatio="none" stretches the SVG to fill its box; on a narrow
  // container that non-uniform scaling thins axis-label text to illegibility, so
  // below the viewBox's natural aspect ratio we shrink the box to match it.
  const effectiveHeight = containerWidth > 0 ? Math.min(chartHeight, containerWidth * (VB_H / VB_W)) : chartHeight;

  const palette = {
    cardBg: isDark ? "#15161b" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    textPrimary: isDark ? "#f4f5f7" : "#111317",
    textSub: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,19,23,0.55)",
    gridLine: isDark ? "rgba(255,255,255,0.07)" : "rgba(17,19,23,0.08)",
    axisText: isDark ? "rgba(255,255,255,0.45)" : "rgba(17,19,23,0.45)",
    badgeBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
  };

  const headerHeight = (title ? 30 : 0) + (subtitle ? 22 : 0);
  const series = [series1, series2, series3];
  const valueKeys: Array<keyof RadarChartAxisPoint> = ["v1", "v2", "v3"];
  const n = axes.length;
  const cx = VB_W / 2;
  const cy = PAD_TOP + (showLegend ? 34 : 0) + headerHeight + (VB_H - PAD_TOP - (showLegend ? 34 : 0) - headerHeight - PAD_BOTTOM) / 2;
  const step = n > 0 ? (Math.PI * 2) / n : 0;
  const angleAt = (i: number) => -Math.PI / 2 + i * step;
  const pointFor = (i: number, value: number) => {
    const r = clamp(value / max, 0, 1) * outerRadius;
    return pointOnCircle(cx, cy, r, angleAt(i));
  };

  const ringPolygons = React.useMemo(() => {
    const result: string[] = [];
    for (let ring = 1; ring <= rings; ring++) {
      const r = (ring / rings) * outerRadius;
      const pts = Array.from({ length: n }, (_, i) => pointOnCircle(cx, cy, r, angleAt(i)));
      result.push(pts.map((p) => `${p.x},${p.y}`).join(" "));
    }
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, rings, outerRadius, cx, cy]);

  const seriesPolygons = React.useMemo(() => {
    return valueKeys.map((key) => axes.map((d, i) => pointFor(i, (d[key] as number) ?? 0)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axes, n, max, outerRadius, cx, cy]);

  const hoverAxis = hoverIndex !== null ? clamp(hoverIndex, 0, n - 1) : null;

  const hover = React.useMemo(() => {
    if (hoverAxis === null) return null;
    const d = axes[hoverAxis];
    if (!d) return null;
    const items = series
      .map((s, i) => ({ s, value: (d[valueKeys[i]] as number) ?? 0 }))
      .filter((it) => it.s.visible !== false);
    return { label: d.label, items };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverAxis, axes, series1, series2, series3]);

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

      {showLegend && (
        <div className="mt-3.5 flex flex-wrap justify-center gap-[22px]">
          {series.map(
            (s, i) =>
              s.visible !== false && (
                <div key={i} className="flex items-center gap-[7px]">
                  <span className="inline-block h-[9px] w-[9px] rounded-[3px]" style={{ backgroundColor: s.color }} />
                  <span className="text-[12.5px] font-semibold" style={{ color: palette.textPrimary }}>
                    {s.label}
                  </span>
                </div>
              ),
          )}
        </div>
      )}

      <div ref={containerRef} className="relative mt-3 w-full" style={{ height: effectiveHeight }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="block overflow-visible">
          {ringPolygons.map((pts, ri) => (
            <polygon
              key={`ring-${ri}`}
              points={pts}
              fill="none"
              stroke={palette.gridLine}
              strokeWidth={1}
              strokeDasharray={ri === rings - 1 ? "4 4" : undefined}
            />
          ))}

          {axes.map((d, i) => {
            const outer = pointOnCircle(cx, cy, outerRadius, angleAt(i));
            return <line key={`spoke-${i}`} x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke={palette.gridLine} strokeWidth={1} />;
          })}

          {axes.map((d, i) => {
            const pos = pointOnCircle(cx, cy, outerRadius + 22, angleAt(i));
            const cosA = Math.cos(angleAt(i));
            const anchor = cosA > 0.3 ? "start" : cosA < -0.3 ? "end" : "middle";
            return (
              <text key={`axislabel-${i}`} x={pos.x} y={pos.y} textAnchor={anchor} dominantBaseline="middle" fontSize={12} fill={palette.axisText}>
                {d.label}
              </text>
            );
          })}

          {series.map(
            (s, si) =>
              s.visible !== false && (
                <polygon
                  key={`radarpoly-${si}`}
                  points={seriesPolygons[si].map((p) => `${p.x},${p.y}`).join(" ")}
                  fill={s.color}
                  fillOpacity={isDark ? 0.14 : 0.1}
                  stroke={s.color}
                  strokeWidth={2}
                  strokeDasharray={s.style === "dashed" ? "7 5" : undefined}
                  strokeLinejoin="round"
                />
              ),
          )}

          {series.map(
            (s, si) =>
              s.visible !== false &&
              s.showMarkers &&
              seriesPolygons[si].map((p, i) => <circle key={`radarmk-${si}-${i}`} cx={p.x} cy={p.y} r={3.4} fill={s.color} />),
          )}

          {enableHover &&
            axes.map((d, i) => {
              const halfStep = step / 2;
              const p1 = pointOnCircle(cx, cy, outerRadius + 30, angleAt(i) - halfStep);
              const p2 = pointOnCircle(cx, cy, outerRadius + 30, angleAt(i) + halfStep);
              const largeArc = halfStep * 2 > Math.PI ? 1 : 0;
              const wedge = `M ${cx} ${cy} L ${p1.x} ${p1.y} A ${outerRadius + 30} ${outerRadius + 30} 0 ${largeArc} 1 ${p2.x} ${p2.y} Z`;
              return (
                <path
                  key={`radarhit-${i}`}
                  d={wedge}
                  fill="transparent"
                  stroke="none"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoverIndex(i)}
                  onMouseLeave={() => setHoverIndex(null)}
                />
              );
            })}
        </svg>

        {enableHover && hoverAxis !== null && hover && (
          <div
            className="absolute min-w-[150px] rounded-[10px] px-3 py-2 pointer-events-none whitespace-nowrap"
            style={{
              left: `${(pointOnCircle(cx, cy, outerRadius + 30, angleAt(hoverAxis)).x / VB_W) * 100}%`,
              top: `${(pointOnCircle(cx, cy, outerRadius + 30, angleAt(hoverAxis)).y / VB_H) * 100}%`,
              transform: `translate(${Math.cos(angleAt(hoverAxis)) >= 0 ? "0%" : "-100%"}, -50%)`,
              backgroundColor: isDark ? "rgba(10,10,14,0.94)" : "rgba(255,255,255,0.97)",
              border: `1px solid ${palette.badgeBorder}`,
              boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div className="mb-1.5 text-[11.5px] font-bold" style={{ color: palette.textPrimary }}>
              {hover.label}
            </div>
            {hover.items.map((it, ri) => (
              <div key={ri} className="mt-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: it.s.color }} />
                  <span className="text-[11.5px]" style={{ color: palette.textSub }}>
                    {it.s.label}
                  </span>
                </div>
                <span className="text-[11.5px] font-bold" style={{ color: palette.textPrimary }}>
                  {Math.round(it.value)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
