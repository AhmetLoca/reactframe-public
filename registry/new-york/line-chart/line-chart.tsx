"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type LineChartLineStyle = "solid" | "dashed" | "dotted";
export type LineChartTheme = "light" | "dark";

export interface LineChartSeries {
  visible?: boolean;
  label: string;
  color: string;
  style?: LineChartLineStyle;
  area?: boolean;
  showBadge?: boolean;
}

export interface LineChartDataPoint {
  x: string;
  date: string;
  v1: number;
  v2: number;
  v3: number;
  v4: number;
}

export interface LineChartZone {
  visible?: boolean;
  label: string;
  startIndex: number;
  endIndex: number;
}

export interface LineChartReferenceLine {
  visible?: boolean;
  value: number;
  label: string;
}

export interface LineChartStartLabel {
  visible?: boolean;
  text: string;
}

export interface LineChartProps {
  theme?: LineChartTheme;
  title?: string;
  subtitle?: string;
  chartHeight?: number;
  showLegend?: boolean;
  yMin?: number;
  yMax?: number;
  yStep?: number;
  series1?: LineChartSeries;
  series2?: LineChartSeries;
  series3?: LineChartSeries;
  series4?: LineChartSeries;
  dataPoints?: LineChartDataPoint[];
  zone?: LineChartZone;
  referenceLine?: LineChartReferenceLine;
  startLabel?: LineChartStartLabel;
  markerIndices?: number[];
  enableHover?: boolean;
  className?: string;
}

interface Pt {
  x: number;
  y: number;
}

const VB_W = 1200;
const VB_H = 560;
const PAD_LEFT = 58;
const PAD_RIGHT = 150;
const PAD_TOP = 26;
const PAD_BOTTOM = 44;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function buildTicks(yMin: number, yMax: number, step: number): number[] {
  const ticks: number[] = [];
  let v = Math.ceil(yMin / step) * step;
  for (; v <= yMax; v += step) ticks.push(v);
  return ticks;
}

function makeGeometry(count: number, plotTop: number, yMin: number, yMax: number) {
  const plotLeft = PAD_LEFT;
  const plotRight = VB_W - PAD_RIGHT;
  const plotBottom = VB_H - PAD_BOTTOM;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const xAt = (i: number) => plotLeft + (count > 1 ? (i / (count - 1)) * plotWidth : plotWidth / 2);
  const yAt = (v: number) => plotBottom - clamp((v - yMin) / (yMax - yMin), 0, 1) * plotHeight;
  return { plotLeft, plotRight, plotTop, plotBottom, plotWidth, plotHeight, xAt, yAt };
}

function dashArray(style?: LineChartLineStyle): string | undefined {
  if (style === "dashed") return "10 7";
  if (style === "dotted") return "1.5 7";
  return undefined;
}

function smoothLinePath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  if (pts.length === 2) return `M ${pts[0].x} ${pts[0].y} L ${pts[1].x} ${pts[1].y}`;

  let d = `M ${pts[0].x} ${pts[0].y} `;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y} `;
  }
  return d;
}

function smoothAreaPath(pts: Pt[], baseY: number): string {
  const line = smoothLinePath(pts);
  if (!line) return "";
  const last = pts[pts.length - 1];
  const first = pts[0];
  return `${line} L ${last.x} ${baseY} L ${first.x} ${baseY} Z`;
}

const DEFAULT_SERIES1: Required<LineChartSeries> = { visible: true, label: "Expansion ARR", color: "#8b5cf6", style: "solid", area: true, showBadge: true };
const DEFAULT_SERIES2: Required<LineChartSeries> = { visible: true, label: "Activation rate", color: "#6366f1", style: "solid", area: false, showBadge: true };
const DEFAULT_SERIES3: Required<LineChartSeries> = { visible: true, label: "Week 8 retention", color: "#34d399", style: "dashed", area: false, showBadge: true };
const DEFAULT_SERIES4: Required<LineChartSeries> = { visible: true, label: "Support risk", color: "#f87171", style: "dotted", area: false, showBadge: true };

const DEFAULT_DATA: LineChartDataPoint[] = [
  { x: "2024", date: "Monday, Jan 1, 2024", v1: 100, v2: 100, v3: 100, v4: 100 },
  { x: "Mar 2024", date: "Friday, Mar 1, 2024", v1: 108, v2: 112, v3: 92, v4: 80 },
  { x: "May 2024", date: "Wednesday, May 1, 2024", v1: 120, v2: 120, v3: 98, v4: 78 },
  { x: "Jul 2024", date: "Monday, Jul 1, 2024", v1: 135, v2: 135, v3: 104, v4: 113 },
  { x: "Sep 2024", date: "Sunday, Sep 1, 2024", v1: 150, v2: 145, v3: 108, v4: 95 },
  { x: "Nov 2024", date: "Friday, Nov 1, 2024", v1: 205, v2: 170, v3: 118, v4: 88 },
  { x: "2025", date: "Wednesday, Jan 1, 2025", v1: 230, v2: 185, v3: 128, v4: 98 },
  { x: "Mar 2025", date: "Saturday, Mar 1, 2025", v1: 268, v2: 205, v3: 140, v4: 128 },
  { x: "May 2025", date: "Thursday, May 1, 2025", v1: 318, v2: 226, v3: 146, v4: 92 },
];

const DEFAULT_ZONE: Required<LineChartZone> = { visible: true, label: "Scale zone", startIndex: 3, endIndex: 6 };
const DEFAULT_REF_LINE: Required<LineChartReferenceLine> = { visible: true, value: 100, label: "Risk floor" };
const DEFAULT_START_LABEL: Required<LineChartStartLabel> = { visible: true, text: "Beta baseline" };
const DEFAULT_MARKER_INDICES = [3, 5, 7];

export function LineChart({
  theme = "dark",
  title = "Release-room health index",
  subtitle = "",
  chartHeight = 420,
  showLegend = true,
  yMin = 50,
  yMax = 350,
  yStep = 50,
  series1 = DEFAULT_SERIES1,
  series2 = DEFAULT_SERIES2,
  series3 = DEFAULT_SERIES3,
  series4 = DEFAULT_SERIES4,
  dataPoints = DEFAULT_DATA,
  zone = DEFAULT_ZONE,
  referenceLine = DEFAULT_REF_LINE,
  startLabel = DEFAULT_START_LABEL,
  markerIndices = DEFAULT_MARKER_INDICES,
  enableHover = true,
  className,
}: LineChartProps) {
  const isDark = theme === "dark";
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoverIndex, setHoverIndex] = React.useState<number | null>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // preserveAspectRatio="none" stretches the SVG to fill its box; on a narrow
  // container that non-uniform scaling squishes axis text near-illegibly, so
  // below the viewBox's natural aspect ratio we shrink the box to match it.
  const effectiveHeight = containerWidth > 0 ? Math.min(chartHeight, containerWidth * (VB_H / VB_W)) : chartHeight;

  const palette = {
    cardBg: isDark ? "#15161b" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    textPrimary: isDark ? "#f4f5f7" : "#111317",
    textSub: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,19,23,0.55)",
    gridLine: isDark ? "rgba(255,255,255,0.07)" : "rgba(17,19,23,0.08)",
    axisText: isDark ? "rgba(255,255,255,0.45)" : "rgba(17,19,23,0.45)",
    zoneFill: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)",
    refLine: isDark ? "rgba(255,255,255,0.35)" : "rgba(17,19,23,0.3)",
    hoverLine: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,19,23,0.45)",
    badgeBg: isDark ? "rgba(28,30,38,0.85)" : "rgba(255,255,255,0.92)",
    badgeBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    tooltipBg: isDark ? "rgba(22,23,29,0.95)" : "rgba(255,255,255,0.97)",
    tooltipText: isDark ? "#f4f5f7" : "#111317",
  };

  const headerHeight = (title ? 30 : 0) + (subtitle ? 22 : 0);

  const series = [series1, series2, series3, series4];
  const valueKeys: Array<keyof LineChartDataPoint> = ["v1", "v2", "v3", "v4"];
  const n = dataPoints.length;
  const plotTopY = PAD_TOP + (showLegend ? 34 : 0) + headerHeight;
  const geo = makeGeometry(n, plotTopY, yMin, yMax);
  const { plotLeft, plotRight, plotTop, plotBottom, plotWidth, plotHeight, xAt, yAt } = geo;

  const yTicks = React.useMemo(() => buildTicks(yMin, yMax, yStep), [yMin, yMax, yStep]);

  const seriesPoints = React.useMemo(() => {
    return valueKeys.map((key) => dataPoints.map((d, i) => ({ x: xAt(i), y: yAt(d[key] as number) })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPoints, n, plotLeft, plotRight, plotTop, plotBottom, yMin, yMax]);

  const markerIdxList = React.useMemo(() => markerIndices.filter((i) => i >= 0 && i < n), [markerIndices, n]);

  const badges = React.useMemo(() => {
    const items = series
      .map((s, i) => ({ s, i, value: dataPoints[n - 1]?.[valueKeys[i]] as number, y: yAt(dataPoints[n - 1]?.[valueKeys[i]] as number) }))
      .filter((b) => b.s.visible && b.s.showBadge)
      .sort((a, b) => a.y - b.y);

    const minGap = 30;
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < minGap) items[i].y = items[i - 1].y + minGap;
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series1, series2, series3, series4, dataPoints, n, yMin, yMax]);

  const hoverBadges = React.useMemo(() => {
    if (hoverIndex === null) return [];
    const items = series
      .map((s, i) => ({ s, i, value: dataPoints[hoverIndex]?.[valueKeys[i]] as number, y: yAt(dataPoints[hoverIndex]?.[valueKeys[i]] as number) }))
      .filter((b) => b.s.visible)
      .sort((a, b) => a.y - b.y);

    const minGap = 22;
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < minGap) items[i].y = items[i - 1].y + minGap;
    }
    return items;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [series1, series2, series3, series4, dataPoints, hoverIndex, yMin, yMax]);

  const gradientId = React.useId().replace(/[^a-zA-Z0-9]/g, "");
  const gradientIds = series.map((_, i) => `lc-grad-${gradientId}-${i}`);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHover || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const svgX = relX * VB_W;
    if (svgX < plotLeft || svgX > plotRight) {
      setHoverIndex(null);
      return;
    }
    const idx = Math.round(((svgX - plotLeft) / plotWidth) * (n - 1));
    setHoverIndex(clamp(idx, 0, n - 1));
  };

  const handleLeave = () => setHoverIndex(null);

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
              s.visible && (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="inline-block h-[9px] w-[9px] rounded-[3px]" style={{ backgroundColor: s.color }} />
                  <span className="text-[12.5px] font-semibold" style={{ color: palette.textPrimary }}>
                    {s.label}
                  </span>
                </div>
              ),
          )}
        </div>
      )}

      <div ref={containerRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className="relative mt-3 w-full" style={{ height: effectiveHeight }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="none" className="block overflow-visible">
          <defs>
            {series.map((s, i) => (
              <linearGradient key={gradientIds[i]} id={gradientIds[i]} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color} stopOpacity={isDark ? 0.38 : 0.28} />
                <stop offset="100%" stopColor={s.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>

          {zone.visible && (
            <>
              <rect
                x={xAt(clamp(zone.startIndex, 0, n - 1))}
                y={plotTop}
                width={xAt(clamp(zone.endIndex, 0, n - 1)) - xAt(clamp(zone.startIndex, 0, n - 1))}
                height={plotHeight}
                fill={palette.zoneFill}
              />
              <text x={(xAt(clamp(zone.startIndex, 0, n - 1)) + xAt(clamp(zone.endIndex, 0, n - 1))) / 2} y={plotTop + 18} textAnchor="middle" fontSize={12} fill={palette.axisText}>
                {zone.label}
              </text>
            </>
          )}

          {yTicks.map((v) => (
            <g key={v}>
              <line x1={plotLeft} x2={plotRight} y1={yAt(v)} y2={yAt(v)} stroke={palette.gridLine} strokeWidth={1} />
              <text x={plotLeft - 14} y={yAt(v) + 4} textAnchor="end" fontSize={12} fill={palette.axisText}>
                {v}
              </text>
            </g>
          ))}

          {dataPoints.map((d, i) => (
            <text key={i} x={xAt(i)} y={plotBottom + 26} textAnchor="middle" fontSize={12} fill={palette.axisText}>
              {d.x}
            </text>
          ))}

          {referenceLine.visible && (
            <>
              <line x1={plotLeft} x2={plotRight} y1={yAt(referenceLine.value)} y2={yAt(referenceLine.value)} stroke={palette.refLine} strokeWidth={1.3} strokeDasharray="6 5" />
              <text x={plotLeft + plotWidth * 0.5} y={yAt(referenceLine.value) + 16} textAnchor="middle" fontSize={11.5} fill={palette.axisText}>
                {referenceLine.label}
              </text>
            </>
          )}

          {startLabel.visible && (
            <text x={plotLeft + 4} y={yAt(dataPoints[0]?.v1 ?? yMin) - 10} fontSize={11.5} fill={palette.axisText}>
              {startLabel.text}
            </text>
          )}

          {series.map((s, i) => s.visible && s.area && <path key={`area-${i}`} d={smoothAreaPath(seriesPoints[i], plotBottom)} fill={`url(#${gradientIds[i]})`} stroke="none" />)}

          {series.map(
            (s, i) =>
              s.visible && (
                <path key={`line-${i}`} d={smoothLinePath(seriesPoints[i])} fill="none" stroke={s.color} strokeWidth={2.2} strokeDasharray={dashArray(s.style)} strokeLinecap="round" strokeLinejoin="round" />
              ),
          )}

          {series[0].visible &&
            markerIdxList.map((i) => (
              <g key={`mk-${i}`}>
                <circle cx={xAt(i)} cy={yAt(dataPoints[i].v1)} r={6} fill={palette.cardBg} stroke={series[0].color} strokeWidth={2} />
                <circle cx={xAt(i)} cy={yAt(dataPoints[i].v1)} r={2} fill={series[0].color} />
              </g>
            ))}

          {enableHover && hoverIndex !== null && (
            <line x1={xAt(hoverIndex)} x2={xAt(hoverIndex)} y1={plotTop} y2={plotBottom} stroke={palette.hoverLine} strokeWidth={1.3} strokeDasharray="5 5" />
          )}
        </svg>

        {badges.map((b) => (
          <div
            key={`badge-${b.i}`}
            className="absolute right-0 flex items-center gap-1.5 overflow-hidden rounded-full py-1 pr-2.5 pl-2 backdrop-blur-[6px]"
            style={{
              left: `${(xAt(n - 1) / VB_W) * 100}%`,
              top: `${(b.y / VB_H) * 100}%`,
              transform: "translate(8px, -50%)",
              backgroundColor: palette.badgeBg,
              border: `1px solid ${b.s.color}55`,
              boxShadow: isDark ? `0 0 14px ${b.s.color}33` : `0 2px 8px rgba(0,0,0,0.08)`,
            }}
          >
            <span className="inline-block h-[7px] w-[7px] shrink-0 rounded-full" style={{ backgroundColor: b.s.color }} />
            <span className="truncate text-[11.5px] font-bold whitespace-nowrap" style={{ color: palette.textPrimary }}>
              {b.s.label} {Math.round(b.value)}
            </span>
          </div>
        ))}

        {enableHover &&
          hoverIndex !== null &&
          hoverBadges.map((b) => (
            <div
              key={`hb-${b.i}`}
              className="absolute rounded-[5px] px-[7px] py-0.5 text-[11px] font-bold whitespace-nowrap text-white"
              style={{ left: `${(plotLeft / VB_W) * 100}%`, top: `${(b.y / VB_H) * 100}%`, transform: "translate(-100%, -50%)", backgroundColor: b.s.color }}
            >
              {Math.round(b.value)}
            </div>
          ))}

        {enableHover && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute rounded-[7px] px-[11px] py-[5px] text-[11.5px] font-semibold whitespace-nowrap"
            style={{
              left: `${(xAt(hoverIndex) / VB_W) * 100}%`,
              top: `${(plotBottom / VB_H) * 100}%`,
              transform: "translate(-50%, 6px)",
              backgroundColor: palette.tooltipBg,
              border: `1px solid ${palette.badgeBorder}`,
              color: palette.tooltipText,
              boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            {dataPoints[hoverIndex].date}
          </div>
        )}
      </div>
    </div>
  );
}
