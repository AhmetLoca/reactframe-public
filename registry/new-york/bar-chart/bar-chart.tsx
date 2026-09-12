"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BarChartTheme = "light" | "dark";

export interface BarChartSeries {
  visible?: boolean;
  label: string;
  color: string;
}

export interface BarChartDataPoint {
  label: string;
  note?: string;
  v1: number;
  v2: number;
  v3: number;
  v4: number;
  v5: number;
}

export interface BarChartReferenceLine {
  visible?: boolean;
  value: number;
  label: string;
  color: string;
}

export interface BarChartAnnotation {
  visible?: boolean;
  label: string;
  atIndex: number;
  value: number;
  suffix?: string;
  color: string;
}

export interface BarChartProps {
  theme?: BarChartTheme;
  title?: string;
  subtitle?: string;
  chartHeight?: number;
  showLegend?: boolean;
  yMin?: number;
  yMax?: number;
  yStep?: number;
  gapPx?: number;
  widthRatio?: number;
  series1?: BarChartSeries;
  series2?: BarChartSeries;
  series3?: BarChartSeries;
  series4?: BarChartSeries;
  series5?: BarChartSeries;
  dataPoints?: BarChartDataPoint[];
  referenceLine?: BarChartReferenceLine;
  annotation?: BarChartAnnotation;
  enableHover?: boolean;
  className?: string;
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

const DEFAULT_SERIES1: Required<BarChartSeries> = { visible: true, label: "Critical", color: "#f87171" };
const DEFAULT_SERIES2: Required<BarChartSeries> = { visible: true, label: "Migration", color: "#8b5cf6" };
const DEFAULT_SERIES3: Required<BarChartSeries> = { visible: true, label: "Product", color: "#38bdf8" };
const DEFAULT_SERIES4: Required<BarChartSeries> = { visible: true, label: "Onboarding", color: "#fbbf24" };
const DEFAULT_SERIES5: Required<BarChartSeries> = { visible: true, label: "Deflected", color: "#34d399" };

const DEFAULT_DATA: BarChartDataPoint[] = [
  { label: "01", note: "", v1: 16, v2: 25, v3: 28, v4: 17, v5: 32 },
  { label: "02", note: "", v1: 18, v2: 29, v3: 33, v4: 20, v5: 38 },
  { label: "03", note: "", v1: 20, v2: 32, v3: 35, v4: 21, v5: 40 },
  { label: "04", note: "", v1: 21, v2: 34, v3: 37, v4: 22, v5: 44 },
  { label: "05", note: "", v1: 25, v2: 40, v3: 45, v4: 27, v5: 53 },
  { label: "06", note: "", v1: 25, v2: 39, v3: 44, v4: 26, v5: 51 },
  { label: "07", note: "", v1: 25, v2: 40, v3: 44, v4: 27, v5: 51 },
  { label: "08", note: "reporting incident", v1: 28, v2: 45, v3: 50, v4: 30, v5: 58 },
  { label: "09", note: "", v1: 26, v2: 42, v3: 47, v4: 28, v5: 55 },
  { label: "10", note: "", v1: 27, v2: 44, v3: 49, v4: 29, v5: 56 },
  { label: "11", note: "", v1: 28, v2: 45, v3: 50, v4: 30, v5: 57 },
  { label: "12", note: "", v1: 27, v2: 43, v3: 47, v4: 28, v5: 55 },
  { label: "13", note: "", v1: 27, v2: 44, v3: 49, v4: 29, v5: 56 },
  { label: "14", note: "", v1: 31, v2: 49, v3: 55, v4: 33, v5: 64 },
  { label: "15", note: "", v1: 29, v2: 46, v3: 52, v4: 31, v5: 60 },
  { label: "16", note: "", v1: 30, v2: 49, v3: 54, v4: 32, v5: 63 },
  { label: "17", note: "", v1: 27, v2: 43, v3: 47, v4: 28, v5: 55 },
  { label: "18", note: "", v1: 30, v2: 48, v3: 53, v4: 32, v5: 62 },
  { label: "19", note: "", v1: 30, v2: 47, v3: 53, v4: 32, v5: 60 },
  { label: "20", note: "", v1: 27, v2: 44, v3: 49, v4: 29, v5: 56 },
  { label: "21", note: "", v1: 32, v2: 52, v3: 58, v4: 35, v5: 66 },
  { label: "22", note: "", v1: 31, v2: 50, v3: 56, v4: 33, v5: 65 },
  { label: "23", note: "", v1: 32, v2: 51, v3: 56, v4: 34, v5: 65 },
  { label: "24", note: "", v1: 34, v2: 54, v3: 60, v4: 36, v5: 69 },
];

const DEFAULT_REF_LINE: Required<BarChartReferenceLine> = { visible: true, value: 205, label: "Escalation desk", color: "#9ca3af" };
const DEFAULT_ANNOTATION: Required<BarChartAnnotation> = { visible: true, label: "Peak", atIndex: 23, value: 253, suffix: "cases", color: "#9ca3af" };

export function BarChart({
  theme = "dark",
  title = "Support case volume",
  subtitle = "",
  chartHeight = 420,
  showLegend = true,
  yMin = 0,
  yMax = 280,
  yStep = 80,
  gapPx = 5,
  widthRatio = 0.46,
  series1 = DEFAULT_SERIES1,
  series2 = DEFAULT_SERIES2,
  series3 = DEFAULT_SERIES3,
  series4 = DEFAULT_SERIES4,
  series5 = DEFAULT_SERIES5,
  dataPoints = DEFAULT_DATA,
  referenceLine = DEFAULT_REF_LINE,
  annotation = DEFAULT_ANNOTATION,
  enableHover = true,
  className,
}: BarChartProps) {
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
    badgeBorder: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
  };

  const headerHeight = (title ? 30 : 0) + (subtitle ? 22 : 0);
  const series = [series1, series2, series3, series4, series5];
  const valueKeys: Array<keyof BarChartDataPoint> = ["v1", "v2", "v3", "v4", "v5"];
  const nBar = dataPoints.length;
  const plotTopY = PAD_TOP + (showLegend ? 34 : 0) + headerHeight;
  const geo = makeGeometry(nBar, plotTopY, yMin, yMax);
  const slotWidth = nBar > 1 ? geo.plotWidth / (nBar - 1) : geo.plotWidth;
  const barWidth = slotWidth * widthRatio;

  const yTicks = React.useMemo(() => buildTicks(yMin, yMax, yStep), [yMin, yMax, yStep]);

  const barStacks = React.useMemo(() => {
    return dataPoints.map((d, i) => {
      const cx = geo.xAt(i);
      let cursorBottom = geo.plotBottom;
      let total = 0;
      const segments = valueKeys.map((key, si) => {
        const v = (d[key] as number) ?? 0;
        total += v;
        const segH = Math.max(0, (v / (yMax - yMin)) * geo.plotHeight);
        const segTop = cursorBottom - segH;
        const seg = { key, color: series[si].color, visible: series[si].visible, x: cx - barWidth / 2, y: segTop, height: segH };
        cursorBottom = segTop - gapPx;
        return seg;
      });
      const topY = geo.plotBottom - (total / (yMax - yMin)) * geo.plotHeight;
      return { x: cx, segments, total, topY };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataPoints, nBar, yMin, yMax, barWidth, gapPx, series1, series2, series3, series4, series5]);

  const annotationX = geo.xAt(clamp(annotation.atIndex, 0, nBar - 1));
  const annotationY = geo.yAt(annotation.value) - 14;

  const hover = React.useMemo(() => {
    if (hoverIndex === null) return null;
    const idx = clamp(hoverIndex, 0, nBar - 1);
    const d = dataPoints[idx];
    if (!d) return null;
    const rows = valueKeys.map((key, si) => ({ label: series[si].label, color: series[si].color, value: (d[key] as number) ?? 0 }));
    const total = rows.reduce((sum, r) => sum + r.value, 0);
    return { label: d.label, note: d.note, rows, total, topY: barStacks[idx]?.topY ?? geo.plotTop };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hoverIndex, dataPoints, nBar, barStacks, series1, series2, series3, series4, series5]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableHover || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const relX = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    const svgX = relX * VB_W;
    if (svgX < geo.plotLeft || svgX > geo.plotRight) {
      setHoverIndex(null);
      return;
    }
    const idx = Math.round(((svgX - geo.plotLeft) / geo.plotWidth) * (nBar - 1));
    setHoverIndex(clamp(idx, 0, nBar - 1));
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
        <div className="mt-3.5 flex flex-wrap justify-center gap-5">
          {series.map(
            (s, i) =>
              s.visible && (
                <div key={i} className="flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded" style={{ backgroundColor: s.color }} />
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
          {yTicks.map((v) => (
            <g key={v}>
              <line x1={geo.plotLeft} x2={geo.plotRight} y1={geo.yAt(v)} y2={geo.yAt(v)} stroke={palette.gridLine} strokeWidth={1} />
              <text x={geo.plotLeft - 14} y={geo.yAt(v) + 4} textAnchor="end" fontSize={12} fill={palette.axisText}>
                {v}
              </text>
            </g>
          ))}

          {dataPoints.map((d, i) => (
            <text key={i} x={geo.xAt(i)} y={geo.plotBottom + 26} textAnchor="middle" fontSize={11.5} fill={palette.axisText}>
              {d.label}
            </text>
          ))}

          {referenceLine.visible && (
            <>
              <line x1={geo.plotLeft} x2={geo.plotRight} y1={geo.yAt(referenceLine.value)} y2={geo.yAt(referenceLine.value)} stroke={referenceLine.color} strokeWidth={1.3} strokeDasharray="6 5" opacity={0.7} />
              <text x={geo.plotLeft + 4} y={geo.yAt(referenceLine.value) - 8} fontSize={11.5} fill={referenceLine.color}>
                {referenceLine.label}
              </text>
            </>
          )}

          {barStacks.map((stack, i) => (
            <g key={`barstack-${i}`} opacity={hoverIndex === null || hoverIndex === i ? 1 : 0.35}>
              {stack.segments.map((seg) => seg.visible && seg.height > 0 && <rect key={seg.key} x={seg.x} y={seg.y} width={barWidth} height={seg.height} rx={barWidth / 2} fill={seg.color} />)}
            </g>
          ))}
        </svg>

        {annotation.visible && (
          <div
            className="absolute right-0 overflow-hidden text-ellipsis rounded-lg px-3 py-1.5 text-[12.5px] font-bold whitespace-nowrap"
            style={{
              left: `${(annotationX / VB_W) * 100}%`,
              top: `${(annotationY / VB_H) * 100}%`,
              transform: "translate(8px, -100%)",
              backgroundColor: isDark ? "rgba(10,10,14,0.92)" : "rgba(255,255,255,0.96)",
              border: `1px solid ${annotation.color}55`,
              boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 6px 20px rgba(0,0,0,0.12)",
              color: palette.textPrimary,
            }}
          >
            {annotation.label} {dataPoints[clamp(annotation.atIndex, 0, nBar - 1)]?.label}: {Math.round(annotation.value)} {annotation.suffix}
          </div>
        )}

        {enableHover && hoverIndex !== null && hover && (
          <div
            className="absolute mb-2 min-w-[190px] rounded-[10px] px-3.5 py-2.5 pointer-events-none"
            style={{
              left: `${(geo.xAt(clamp(hoverIndex, 0, nBar - 1)) / VB_W) * 100}%`,
              top: `${(hover.topY / VB_H) * 100}%`,
              transform: "translate(-30%, -100%)",
              backgroundColor: isDark ? "rgba(10,10,14,0.94)" : "rgba(255,255,255,0.97)",
              border: `1px solid ${palette.badgeBorder}`,
              boxShadow: isDark ? "0 10px 28px rgba(0,0,0,0.5)" : "0 6px 20px rgba(0,0,0,0.12)",
            }}
          >
            <div className="mb-1.5 text-[11.5px] font-bold whitespace-nowrap" style={{ color: palette.textPrimary }}>
              Day {hover.label}
              {hover.note ? ` - ${hover.note}` : ""}
            </div>
            {hover.rows.map((r, ri) => (
              <div key={ri} className="mt-1 flex items-center justify-between gap-3.5">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-[11.5px]" style={{ color: palette.textSub }}>
                    {r.label}
                  </span>
                </div>
                <span className="text-[11.5px] font-bold" style={{ color: palette.textPrimary }}>
                  {Math.round(r.value)}
                </span>
              </div>
            ))}
            <div className="mt-2 flex justify-between pt-1.5" style={{ borderTop: `1px solid ${palette.badgeBorder}` }}>
              <span className="text-[11.5px]" style={{ color: palette.textSub }}>
                Total
              </span>
              <span className="text-[11.5px] font-extrabold" style={{ color: palette.textPrimary }}>
                {Math.round(hover.total)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
