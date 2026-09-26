"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value?: number | [number, number];
  defaultValue?: number | [number, number];
  onValueChange?: (value: number | [number, number]) => void;
  range?: boolean;
  label?: string;
  unit?: string;
  unitPosition?: "prefix" | "suffix";
  showValue?: boolean;
  showTooltip?: boolean;
  showMarks?: boolean;
  theme?: "dark" | "light";
  disabled?: boolean;
  width?: number;
  trackHeight?: number;
  thumbSize?: number;
  accentColor?: string;
  className?: string;
}

const PALETTES = {
  dark: {
    track: "rgba(255,255,255,0.1)",
    text: "#F5F4F1",
    muted: "rgba(245,244,241,0.5)",
    thumb: "#F5F4F1",
    tooltipBg: "#F5F4F1",
    tooltipText: "#0A0A0A",
    mark: "rgba(255,255,255,0.22)",
  },
  light: {
    track: "rgba(10,10,10,0.1)",
    text: "#0A0A0A",
    muted: "rgba(10,10,10,0.5)",
    thumb: "#FFFFFF",
    tooltipBg: "#0A0A0A",
    tooltipText: "#F5F4F1",
    mark: "rgba(10,10,10,0.2)",
  },
};

export function Slider({
  min = 0,
  max = 100,
  step = 1,
  value,
  defaultValue,
  onValueChange,
  range = false,
  label,
  unit = "",
  unitPosition = "suffix",
  showValue = true,
  showTooltip = true,
  showMarks = false,
  theme = "dark",
  disabled = false,
  width = 320,
  trackHeight = 6,
  thumbSize = 20,
  accentColor = "#F2A841",
  className,
}: SliderProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [internal, setInternal] = React.useState<number[]>(() => {
    if (defaultValue !== undefined) return Array.isArray(defaultValue) ? [...defaultValue] : [defaultValue];
    return range ? [min + (max - min) * 0.2, min + (max - min) * 0.7] : [min + (max - min) * 0.4];
  });
  const [dragIdx, setDragIdx] = React.useState<number | null>(null);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const [focusIdx, setFocusIdx] = React.useState<number | null>(null);
  const isControlled = value !== undefined;
  const raw = isControlled ? (Array.isArray(value) ? value : [value]) : internal;
  const vals = range ? [raw[0] ?? min, raw[1] ?? max] : [raw[0] ?? min];
  const span = max - min || 1;
  const decimals = (String(step).split(".")[1] || "").length;
  const pct = (v: number) => ((v - min) / span) * 100;

  const snap = (v: number) => {
    const stepped = Math.round((v - min) / step) * step + min;
    return Number(Math.min(max, Math.max(min, stepped)).toFixed(decimals));
  };

  const update = (idx: number, next: number) => {
    const out = [...vals];
    let nv = snap(next);
    if (range) nv = idx === 0 ? Math.min(nv, out[1]) : Math.max(nv, out[0]);
    if (nv === out[idx]) return;
    out[idx] = nv;
    if (!isControlled) setInternal(out);
    onValueChange?.(range ? [out[0], out[1]] : out[0]);
  };

  const valueFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return min;
    return min + Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * span;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (disabled) return;
    const v = valueFromPointer(e.clientX);
    let idx = 0;
    if (range) {
      const d0 = Math.abs(v - vals[0]);
      const d1 = Math.abs(v - vals[1]);
      idx = d0 < d1 ? 0 : d0 > d1 ? 1 : v > vals[1] ? 1 : 0;
    }
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragIdx(idx);
    update(idx, v);
    (e.currentTarget.querySelector(`[data-thumb="${idx}"]`) as HTMLElement | null)?.focus({ preventScroll: true });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragIdx === null) return;
    update(dragIdx, valueFromPointer(e.clientX));
  };

  const endDrag = () => setDragIdx(null);

  const onKeyDown = (idx: number) => (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    const cur = vals[idx];
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = cur + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = cur - step;
    else if (e.key === "PageUp") next = cur + step * 10;
    else if (e.key === "PageDown") next = cur - step * 10;
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    if (next === null) return;
    e.preventDefault();
    update(idx, next);
  };

  const format = (v: number) => (unitPosition === "prefix" ? `${unit}${v}` : `${v}${unit}`);
  const fillStart = range ? pct(vals[0]) : 0;
  const fillEnd = pct(vals[vals.length - 1]);
  const markCount = Math.round(span / step);
  const marks = showMarks && markCount <= 20 ? Array.from({ length: markCount + 1 }, (_, i) => (i / markCount) * 100) : [];
  const hit = thumbSize + 16;

  return (
    <div className={cn("inline-flex flex-col", className)} style={{ width, fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {(label || showValue) && (
        <div className="flex items-baseline justify-between" style={{ marginBottom: 6 }}>
          {label && (
            <span id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: 14 }}>
              {label}
            </span>
          )}
          {showValue && (
            <span className="ml-auto font-medium tabular-nums" style={{ color: p.muted, fontSize: 13 }}>
              {range ? `${format(vals[0])} – ${format(vals[1])}` : format(vals[0])}
            </span>
          )}
        </div>
      )}

      <div
        className="relative w-full touch-none select-none"
        style={{ height: hit, cursor: disabled ? "default" : "pointer" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <div ref={trackRef} className="absolute right-0 left-0" style={{ top: "50%", height: trackHeight, marginTop: -trackHeight / 2, borderRadius: trackHeight, background: p.track }}>
          <div
            className="absolute inset-y-0"
            style={{
              left: `${fillStart}%`,
              width: `${fillEnd - fillStart}%`,
              borderRadius: trackHeight,
              background: accentColor,
              transition: dragIdx === null ? "left 0.15s ease, width 0.15s ease" : "none",
            }}
          />
          {marks.map((m) => (
            <span key={m} className="absolute rounded-full" style={{ left: `${m}%`, top: "50%", width: 2, height: 2, marginLeft: -1, marginTop: -1, background: p.mark }} />
          ))}

          {vals.map((v, i) => {
            const active = dragIdx === i || hoverIdx === i || focusIdx === i;
            return (
              <div
                key={i}
                data-thumb={i}
                role="slider"
                tabIndex={disabled ? -1 : 0}
                aria-orientation="horizontal"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={v}
                aria-valuetext={format(v)}
                aria-disabled={disabled}
                aria-labelledby={label ? `${uid}-label` : undefined}
                aria-label={label ? undefined : range ? (i === 0 ? "Minimum" : "Maximum") : "Value"}
                onKeyDown={onKeyDown(i)}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
                onFocus={(e) => setFocusIdx(e.currentTarget.matches(":focus-visible") || dragIdx !== null ? i : null)}
                onBlur={() => setFocusIdx(null)}
                className="absolute outline-none"
                style={{
                  left: `${pct(v)}%`,
                  top: "50%",
                  width: thumbSize,
                  height: thumbSize,
                  marginLeft: -thumbSize / 2,
                  marginTop: -thumbSize / 2,
                  borderRadius: "50%",
                  background: p.thumb,
                  border: `${Math.max(2, thumbSize * 0.16)}px solid ${accentColor}`,
                  boxSizing: "border-box",
                  boxShadow: focusIdx === i || dragIdx === i ? `0 0 0 4px color-mix(in srgb, ${accentColor} 28%, transparent)` : "0 2px 8px rgba(0,0,0,0.35)",
                  transform: dragIdx === i ? "scale(1.12)" : "scale(1)",
                  transition: `${dragIdx === null ? "left 0.15s ease, " : ""}transform 0.15s ease, box-shadow 0.15s ease`,
                  zIndex: active ? 3 : 2,
                }}
              >
                <AnimatePresence>
                  {showTooltip && active && (
                    <motion.div
                      className="pointer-events-none absolute left-1/2 rounded-md px-2 py-1 font-semibold whitespace-nowrap tabular-nums"
                      style={{ bottom: thumbSize + 6, x: "-50%", background: p.tooltipBg, color: p.tooltipText, fontSize: 12 }}
                      initial={{ opacity: 0, y: 4, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.9 }}
                      transition={{ duration: 0.14 }}
                    >
                      {format(v)}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
