"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type RangeAreaChartTheme = "light" | "dark";

export interface RangeAreaChartPoint {
  time: string;
  min: number;
  max: number;
  coreMin: number;
  coreMax: number;
  value: number;
}

export interface RangeAreaChartZone {
  visible?: boolean;
  label: string;
  color: string;
  startIndex: number;
  endIndex: number;
}

export interface RangeAreaChartReferenceLine {
  visible?: boolean;
  value: number;
  label: string;
  color: string;
}

export interface RangeAreaChartAnnotation {
  visible?: boolean;
  title: string;
  subtitle: string;
  atIndex: number;
  value: number;
  color: string;
}

export interface RangeAreaChartEndpoint {
  visible?: boolean;
  suffix: string;
  color: string;
}

export interface RangeAreaChartProps {
  theme?: RangeAreaChartTheme;
  title?: string;
  subtitle?: string;
  chartHeight?: number;
  unit?: string;
  yMin?: number;
  yMax?: number;
  yStep?: number;
  actualColor?: string;
  forecastColor?: string;
  bandColor?: string;
  coreBandColor?: string;
  forecastStartIndex?: number;
  dataPoints?: RangeAreaChartPoint[];
  zones?: RangeAreaChartZone[];
  referenceLine?: RangeAreaChartReferenceLine;
  annotation?: RangeAreaChartAnnotation;
  endpoint?: RangeAreaChartEndpoint;
  enableHover?: boolean;
  className?: string;
}

interface Pt {
  x: number;
  y: number;
}

const VB_W = 1200;
const VB_H = 560;
const PAD_LEFT = 72;
const PAD_RIGHT = 150;
const PAD_TOP = 26;
const PAD_BOTTOM = 58;

function readableTextOn(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0A0A0A" : "#FFFFFF";
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function buildTicks(yMin: number, yMax: number, step: number): number[] {
  const ticks: number[] = [];
  let v = Math.ceil(yMin / step) * step;
  for (; v <= yMax; v += step) ticks.push(v);
  return ticks;
}

function makeGeometry(count: number, plotTop: number, yMin: number, yMax: number, vbW: number, padLeft: number, padRight: number) {
  const plotLeft = padLeft;
  const plotRight = vbW - padRight;
  const plotBottom = VB_H - PAD_BOTTOM;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;
  const xAt = (i: number) => plotLeft + (count > 1 ? (i / (count - 1)) * plotWidth : plotWidth / 2);
  const yAt = (v: number) => plotBottom - clamp((v - yMin) / (yMax - yMin), 0, 1) * plotHeight;
  return { plotLeft, plotRight, plotTop, plotBottom, plotWidth, plotHeight, xAt, yAt };
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

function smoothBandPath(topPts: Pt[], bottomPts: Pt[]): string {
  if (topPts.length < 2 || bottomPts.length < 2) return "";
  const bottomRev = [...bottomPts].reverse();
  let d = smoothLinePath(topPts);
  d += `L ${bottomRev[0].x} ${bottomRev[0].y} `;
  for (let i = 0; i < bottomRev.length - 1; i++) {
    const p0 = bottomRev[i - 1] ?? bottomRev[i];
    const p1 = bottomRev[i];
    const p2 = bottomRev[i + 1];
    const p3 = bottomRev[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y} `;
  }
  d += "Z";
  return d;
}

const DEFAULT_DATA: RangeAreaChartPoint[] = [
  { time: "06:00", min: 85, max: 155, coreMin: 110, coreMax: 130, value: 120 },
  { time: "07:00", min: 88, max: 150, coreMin: 110, coreMax: 128, value: 120 },
  { time: "08:00", min: 100, max: 170, coreMin: 125, coreMax: 148, value: 138 },
  { time: "09:00", min: 115, max: 195, coreMin: 138, coreMax: 165, value: 152 },
  { time: "10:00", min: 140, max: 280, coreMin: 175, coreMax: 240, value: 208 },
  { time: "11:00", min: 120, max: 220, coreMin: 150, coreMax: 200, value: 178 },
  { time: "12:00", min: 110, max: 200, coreMin: 140, coreMax: 180, value: 163 },
  { time: "13:00", min: 115, max: 230, coreMin: 145, coreMax: 190, value: 170 },
  { time: "14:00", min: 130, max: 255, coreMin: 0, coreMax: 0, value: 196 },
  { time: "15:00", min: 140, max: 291, coreMin: 0, coreMax: 0, value: 210 },
  { time: "16:00", min: 135, max: 260, coreMin: 0, coreMax: 0, value: 196 },
  { time: "17:00", min: 120, max: 235, coreMin: 0, coreMax: 0, value: 169 },
];

const DEFAULT_ZONES: RangeAreaChartZone[] = [
  { visible: true, label: "Release train", color: "#B8A6FF", startIndex: 3, endIndex: 5 },
  { visible: true, label: "Forecast", color: "#F2A841", startIndex: 7, endIndex: 9 },
];

const DEFAULT_REF_LINE: Required<RangeAreaChartReferenceLine> = { visible: true, value: 262, label: "p95 SLO", color: "#FF7A6B" };
const DEFAULT_ANNOTATION: Required<RangeAreaChartAnnotation> = { visible: true, title: "Risk crest", subtitle: "291 ms p95 band", atIndex: 9, value: 291, color: "#FF7A6B" };
const DEFAULT_ENDPOINT: Required<RangeAreaChartEndpoint> = { visible: true, suffix: "now", color: "#87FFE3" };

const LIGHT_ZONES: RangeAreaChartZone[] = DEFAULT_ZONES.map((z, i) => ({ ...z, color: ["#7C5CE0", "#D9822B"][i] ?? z.color }));
const LIGHT_REF_LINE: Required<RangeAreaChartReferenceLine> = { ...DEFAULT_REF_LINE, color: "#E5484D" };
const LIGHT_ANNOTATION: Required<RangeAreaChartAnnotation> = { ...DEFAULT_ANNOTATION, color: "#E5484D" };
const LIGHT_ENDPOINT: Required<RangeAreaChartEndpoint> = { ...DEFAULT_ENDPOINT, color: "#0E9F80" };

export function RangeAreaChart({
  theme = "dark",
  title = "Latency envelope",
  subtitle = "",
  chartHeight = 420,
  unit = "ms",
  yMin = 70,
  yMax = 300,
  yStep = 50,
  actualColor = theme === "light" ? "#0E9F80" : "#87FFE3",
  forecastColor = theme === "light" ? "#D9822B" : "#F2A841",
  bandColor = theme === "light" ? "#3B6FD8" : "#8FB8FF",
  coreBandColor = theme === "light" ? "#0E9F80" : "#87FFE3",
  forecastStartIndex = 7,
  dataPoints = DEFAULT_DATA,
  zones = theme === "light" ? LIGHT_ZONES : DEFAULT_ZONES,
  referenceLine = theme === "light" ? LIGHT_REF_LINE : DEFAULT_REF_LINE,
  annotation = theme === "light" ? LIGHT_ANNOTATION : DEFAULT_ANNOTATION,
  endpoint = theme === "light" ? LIGHT_ENDPOINT : DEFAULT_ENDPOINT,
  enableHover = true,
  className,
}: RangeAreaChartProps) {
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
  // container that non-uniform scaling thins axis-label text to illegibility, so
  // below the viewBox's natural aspect ratio we shrink the box to match it.
  const compact = containerWidth > 0 && containerWidth < 560;
  const vbW = compact ? 640 : VB_W;
  const labelStep = compact ? 3 : 1;
  const effectiveHeight = containerWidth > 0 ? Math.min(chartHeight, containerWidth * (VB_H / vbW)) : chartHeight;

  // Keep axis labels a readable ~11px on screen regardless of how far the viewBox is scaled down.
  const viewScale = containerWidth > 0 ? Math.min(containerWidth / vbW, effectiveHeight / VB_H) : 0.5;
  const axisFontSize = Math.min(24, Math.max(11, 11 / viewScale));

  const palette = {
    cardBg: isDark ? "#0E0E0E" : "#ffffff",
    cardBorder: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    textPrimary: isDark ? "#f4f5f7" : "#111317",
    textSub: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,19,23,0.55)",
    gridLine: isDark ? "rgba(255,255,255,0.07)" : "rgba(17,19,23,0.08)",
    axisText: isDark ? "rgba(255,255,255,0.7)" : "rgba(17,19,23,0.7)",
    badgeBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
    hoverLine: isDark ? "rgba(255,255,255,0.55)" : "rgba(17,19,23,0.45)",
    tooltipBg: isDark ? "rgba(14,14,14,0.96)" : "rgba(255,255,255,0.97)",
    tooltipText: isDark ? "#f4f5f7" : "#111317",
  };

  const headerHeight = (title ? 30 : 0) + (subtitle ? 22 : 0);
  const n = dataPoints.length;
  const plotTop = PAD_TOP + headerHeight;
  const geo = makeGeometry(n, plotTop, yMin, yMax, vbW, compact ? 96 : PAD_LEFT, compact ? 24 : PAD_RIGHT);

  const yTicks = React.useMemo(() => buildTicks(yMin, yMax, yStep), [yMin, yMax, yStep]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const outerTop = React.useMemo(() => dataPoints.map((d, i) => ({ x: geo.xAt(i), y: geo.yAt(d.max) })), [dataPoints, n, yMin, yMax, vbW, compact]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const outerBottom = React.useMemo(() => dataPoints.map((d, i) => ({ x: geo.xAt(i), y: geo.yAt(d.min) })), [dataPoints, n, yMin, yMax, vbW, compact]);

  const forecastIdx = clamp(forecastStartIndex, 0, n - 1);
  const coreSlice = dataPoints.slice(0, forecastIdx + 1);
  const coreTop = coreSlice.map((d, i) => ({ x: geo.xAt(i), y: geo.yAt(d.coreMax) }));
  const coreBottom = coreSlice.map((d, i) => ({ x: geo.xAt(i), y: geo.yAt(d.coreMin) }));

  const actualSlice = dataPoints.slice(0, forecastIdx + 1);
  const forecastSlice = dataPoints.slice(forecastIdx);
  const actualPts = actualSlice.map((d, i) => ({ x: geo.xAt(i), y: geo.yAt(d.value) }));
  const forecastPts = forecastSlice.map((d, i) => ({ x: geo.xAt(i + forecastIdx), y: geo.yAt(d.value) }));

  const lastIdx = n - 1;
  const endpointValue = dataPoints[lastIdx]?.value ?? 0;
  const annotationX = geo.xAt(clamp(annotation.atIndex, 0, n - 1));
  const annotationY = geo.yAt(annotation.value) - 46;

  const hover = React.useMemo(() => {
    if (hoverIndex === null) return null;
    const idx = clamp(hoverIndex, 0, n - 1);
    const d = dataPoints[idx];
    if (!d) return null;
    const isForecast = idx > forecastIdx;
    const valueColor = isForecast ? forecastColor : actualColor;
    const items = [
      { key: "max", label: "Max", value: d.max, y: geo.yAt(d.max), color: bandColor },
      { key: "value", label: isForecast ? "Forecast" : "Now", value: d.value, y: geo.yAt(d.value), color: valueColor },
      { key: "min", label: "Min", value: d.min, y: geo.yAt(d.min), color: bandColor },
    ].sort((a, b) => a.y - b.y);
    const minGap = 20;
    for (let i = 1; i < items.length; i++) {
      if (items[i].y - items[i - 1].y < minGap) items[i].y = items[i - 1].y + minGap;
    }
    return { time: d.time, items };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverIndex, dataPoints, forecastIdx, bandColor, actualColor, forecastColor, yMin, yMax]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHover || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const svgX = relX * vbW;
    if (svgX < geo.plotLeft || svgX > geo.plotRight) {
      setHoverIndex(null);
      return;
    }
    const idx = Math.round(((svgX - geo.plotLeft) / geo.plotWidth) * (n - 1));
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

      <div ref={containerRef} onMouseMove={handleMove} onMouseLeave={handleLeave} className="relative mt-3 w-full" style={{ height: effectiveHeight }}>
        <svg width="100%" height="100%" viewBox={`0 0 ${vbW} ${VB_H}`} preserveAspectRatio="none" className="block overflow-visible">
          {zones.map(
            (z, zi) =>
              z.visible !== false && (
                <g key={`zone-${zi}`}>
                  <rect
                    x={geo.xAt(clamp(z.startIndex, 0, n - 1))}
                    y={geo.plotTop}
                    width={geo.xAt(clamp(z.endIndex, 0, n - 1)) - geo.xAt(clamp(z.startIndex, 0, n - 1))}
                    height={geo.plotHeight}
                    fill={z.color}
                    opacity={isDark ? 0.14 : 0.08}
                  />
                  <text
                    x={(geo.xAt(clamp(z.startIndex, 0, n - 1)) + geo.xAt(clamp(z.endIndex, 0, n - 1))) / 2}
                    y={geo.plotTop + axisFontSize + 8}
                    textAnchor="middle"
                    fontSize={axisFontSize}
                    fill={palette.axisText}
                  >
                    {compact ? "" : z.label}
                  </text>
                </g>
              ),
          )}

          {yTicks.map((v) => (
            <g key={v}>
              <line x1={geo.plotLeft} x2={geo.plotRight} y1={geo.yAt(v)} y2={geo.yAt(v)} stroke={palette.gridLine} strokeWidth={1} />
              <text x={geo.plotLeft - 14} y={geo.yAt(v) + axisFontSize * 0.35} textAnchor="end" fontSize={axisFontSize} fill={palette.axisText}>
                {v} {unit}
              </text>
            </g>
          ))}

          {dataPoints.map((d, i) =>
            i % labelStep !== 0 ? null : (
            <text key={i} x={geo.xAt(i)} y={geo.plotBottom + 12 + axisFontSize} textAnchor="middle" fontSize={axisFontSize} fill={palette.axisText}>
              {d.time}
            </text>
          ))}

          <path d={smoothBandPath(outerTop, outerBottom)} fill={bandColor} opacity={isDark ? 0.22 : 0.14} stroke="none" />
          {coreTop.length > 1 && <path d={smoothBandPath(coreTop, coreBottom)} fill={coreBandColor} opacity={isDark ? 0.3 : 0.18} stroke="none" />}

          {referenceLine.visible && (
            <>
              <line x1={geo.plotLeft} x2={geo.plotRight} y1={geo.yAt(referenceLine.value)} y2={geo.yAt(referenceLine.value)} stroke={referenceLine.color} strokeWidth={1.3} strokeDasharray="6 5" opacity={0.7} />
              <text x={geo.plotLeft + 4} y={geo.yAt(referenceLine.value) - 8} fontSize={axisFontSize} fontWeight={700} fill={referenceLine.color}>
                {referenceLine.label}
              </text>
            </>
          )}

          <path d={smoothLinePath(actualPts)} fill="none" stroke={actualColor} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          <path d={smoothLinePath(forecastPts)} fill="none" stroke={forecastColor} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />

          {dataPoints.map((d, i) => (
            <circle key={`dot-${i}`} cx={geo.xAt(i)} cy={geo.yAt(d.value)} r={3.2} fill={i <= forecastIdx ? actualColor : forecastColor} />
          ))}

          {enableHover && hoverIndex !== null && (
            <line
              x1={geo.xAt(clamp(hoverIndex, 0, n - 1))}
              x2={geo.xAt(clamp(hoverIndex, 0, n - 1))}
              y1={geo.plotTop}
              y2={geo.plotBottom}
              stroke={palette.hoverLine}
              strokeWidth={1.3}
              strokeDasharray="5 5"
            />
          )}
        </svg>

        {annotation.visible && !compact && (
          <div
            className="absolute min-w-[150px] max-w-[220px] rounded-[10px] px-3.5 py-2"
            style={{
              left: `${(annotationX / vbW) * 100}%`,
              top: `${(annotationY / VB_H) * 100}%`,
              transform: "translate(-30%, -100%)",
              backgroundColor: isDark ? "rgba(14,14,14,0.94)" : "rgba(255,255,255,0.96)",
              border: `1px solid ${annotation.color}55`,
              boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div className="text-[10.5px] font-extrabold tracking-[0.6px] uppercase" style={{ color: annotation.color }}>
              {annotation.title}
            </div>
            <div className="mt-0.5 text-[12.5px] font-bold whitespace-nowrap" style={{ color: palette.textPrimary }}>
              {annotation.subtitle}
            </div>
          </div>
        )}

        {endpoint.visible && (
          <div
            className="absolute rounded-full px-3.5 py-1.5 text-[12px] font-extrabold whitespace-nowrap"
            style={{
              left: `${(geo.xAt(lastIdx) / vbW) * 100}%`,
              top: `${((compact ? geo.plotTop : geo.yAt(endpointValue)) / VB_H) * 100}%`,
              transform: compact ? "translate(-100%, calc(-100% - 8px))" : "translate(8px, -50%)",
              backgroundColor: endpoint.color,
              color: readableTextOn(endpoint.color),
              boxShadow: `0 0 16px ${endpoint.color}55`,
            }}
          >
            {Math.round(endpointValue)} {unit} {endpoint.suffix}
          </div>
        )}

        {enableHover &&
          hover &&
          hover.items.map((it) => (
            <div
              key={`hb-${it.key}`}
              className="absolute flex items-center gap-1 rounded-[5px] px-[7px] py-0.5 text-[10.5px] font-bold whitespace-nowrap"
              style={{
                left: `${(geo.plotLeft / vbW) * 100}%`,
                top: `${(it.y / VB_H) * 100}%`,
                transform: "translate(-100%, -50%)",
                backgroundColor: it.key === "value" ? it.color : `${it.color}cc`,
                color: readableTextOn(it.color),
              }}
            >
              <span className="opacity-85">{it.label}</span>
              <span>{Math.round(it.value)}</span>
            </div>
          ))}

        {enableHover && hoverIndex !== null && hover && (
          <div
            className="absolute rounded-[7px] px-[11px] py-[5px] text-[11.5px] font-semibold whitespace-nowrap pointer-events-none"
            style={{
              left: `${(geo.xAt(clamp(hoverIndex, 0, n - 1)) / vbW) * 100}%`,
              top: `${(geo.plotBottom / VB_H) * 100}%`,
              transform: "translate(-50%, 6px)",
              backgroundColor: palette.tooltipBg,
              border: `1px solid ${palette.badgeBorder}`,
              color: palette.tooltipText,
              boxShadow: isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.1)",
            }}
          >
            {hover.time}
          </div>
        )}
      </div>
    </div>
  );
}
