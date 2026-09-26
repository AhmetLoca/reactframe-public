"use client";

import * as React from "react";
import { motion, animate, useMotionValue, useMotionValueEvent } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MeterVariant = "bar" | "gauge" | "segments";
export type MeterSize = "sm" | "md" | "lg";

export interface MeterProps {
  value?: number;
  min?: number;
  max?: number;
  low?: number;
  high?: number;
  /** "up": high values are good (score, battery). "down": high values are bad (disk usage, load). */
  goodDirection?: "up" | "down";
  variant?: MeterVariant;
  segments?: number;
  label?: string;
  description?: string;
  unit?: string;
  showValue?: boolean;
  formatValue?: (value: number) => string;
  size?: MeterSize;
  theme?: "dark" | "light";
  width?: number | string;
  className?: string;
}

const ZONES = {
  bad: { dark: "#FF7A6B", light: "#E5484D" },
  mid: { dark: "#F2A841", light: "#B7791F" },
  good: { dark: "#87FFE3", light: "#0F9F7F" },
  neutral: { dark: "#F5F4F1", light: "#0A0A0A" },
};

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", track: "rgba(255,255,255,0.09)", tick: "rgba(255,255,255,0.35)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", track: "rgba(10,10,10,0.09)", tick: "rgba(10,10,10,0.35)" },
};

const SIZES: Record<MeterSize, { font: number; bar: number; big: number; seg: number }> = {
  sm: { font: 13, bar: 6, big: 26, seg: 14 },
  md: { font: 14.5, bar: 10, big: 34, seg: 20 },
  lg: { font: 16, bar: 14, big: 44, seg: 28 },
};

const SPRING = { type: "spring", stiffness: 140, damping: 22 } as const;

export function Meter({
  value = 0,
  min = 0,
  max = 100,
  low,
  high,
  goodDirection = "up",
  variant = "bar",
  segments = 12,
  label,
  description,
  unit,
  showValue = true,
  formatValue,
  size = "md",
  theme = "dark",
  width,
  className,
}: MeterProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const clamped = Math.min(max, Math.max(min, value));
  const frac = max === min ? 0 : (clamped - min) / (max - min);

  const zone = (() => {
    if (low === undefined && high === undefined) return "neutral" as const;
    const lo = low ?? min;
    const hi = high ?? max;
    const band = clamped < lo ? "low" : clamped > hi ? "high" : "mid";
    if (band === "mid") return "mid" as const;
    const highIsGood = goodDirection === "up";
    return (band === "high") === highIsGood ? ("good" as const) : ("bad" as const);
  })();
  const color = ZONES[zone][theme];

  const mv = useMotionValue(min);
  const [shown, setShown] = React.useState(min);
  useMotionValueEvent(mv, "change", (v) => setShown(v));
  React.useEffect(() => {
    const controls = animate(mv, clamped, { type: "spring", stiffness: 110, damping: 20 });
    return () => controls.stop();
  }, [clamped, mv]);

  const decimals = Number.isInteger(value) && Number.isInteger(min) && Number.isInteger(max) ? 0 : 1;
  const text = formatValue ? formatValue(shown) : `${shown.toFixed(decimals)}${unit ?? ""}`;
  const finalText = formatValue ? formatValue(clamped) : `${clamped.toFixed(decimals)}${unit ?? ""}`;
  const pos = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);

  const header = (label || (showValue && variant !== "gauge")) && (
    <div className="flex items-baseline justify-between" style={{ gap: 12 }}>
      {label ? (
        <span id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </span>
      ) : (
        <span />
      )}
      {showValue && variant !== "gauge" && (
        <span aria-hidden="true" className="font-semibold tabular-nums" style={{ color: p.text, fontSize: s.font }}>
          {text}
        </span>
      )}
    </div>
  );

  return (
    <div
      role="meter"
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={clamped}
      aria-valuetext={finalText}
      aria-labelledby={label ? `${uid}-label` : undefined}
      aria-label={label ? undefined : "Meter"}
      className={cn("inline-flex flex-col", className)}
      style={{ gap: 10, width: width ?? (variant === "gauge" ? 240 : 320), maxWidth: "100%", fontFamily: "Inter, sans-serif" }}
    >
      {variant !== "gauge" && header}

      {variant === "bar" && (
        <div className="relative" style={{ height: s.bar }}>
          <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: s.bar, background: p.track }}>
            <motion.div initial={{ width: "0%" }} animate={{ width: `${frac * 100}%` }} transition={SPRING} style={{ height: "100%", borderRadius: s.bar, background: color, transition: "background 0.3s ease" }} />
          </div>
          {[low, high].map((t, i) =>
            t !== undefined && t > min && t < max ? (
              <span key={i} aria-hidden="true" className="absolute" style={{ left: `${pos(t)}%`, top: -3, bottom: -3, width: 2, marginLeft: -1, borderRadius: 2, background: p.tick, mixBlendMode: theme === "dark" ? "screen" : "multiply", opacity: 0.6 }} />
            ) : null,
          )}
        </div>
      )}

      {variant === "segments" && (
        <div className="flex" style={{ gap: 4 }} aria-hidden="true">
          {Array.from({ length: segments }).map((_, i) => {
            const lit = i < Math.round(frac * segments);
            return (
              <motion.span
                key={i}
                className="flex-1"
                initial={{ opacity: 0.4, scaleY: 0.6 }}
                animate={{ opacity: 1, scaleY: lit ? 1 : 0.75, backgroundColor: lit ? color : p.track }}
                transition={{ type: "spring", stiffness: 380, damping: 26, delay: i * 0.025 }}
                style={{ height: s.seg, borderRadius: Math.min(6, s.seg / 3), transformOrigin: "bottom" }}
              />
            );
          })}
        </div>
      )}

      {variant === "gauge" && (
        <div className="relative w-full" style={{ aspectRatio: "200 / 118" }}>
          <svg viewBox="0 0 200 118" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
            <path d="M20 100 A80 80 0 0 1 180 100" stroke={p.track} strokeWidth={14} strokeLinecap="round" />
            <motion.path d="M20 100 A80 80 0 0 1 180 100" stroke={color} strokeWidth={14} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: Math.max(frac, 0.001) }} transition={SPRING} style={{ transition: "stroke 0.3s ease" }} />
          </svg>
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-center" style={{ gap: 2 }}>
            {showValue && (
              <span aria-hidden="true" className="font-semibold leading-none tracking-[-0.03em] tabular-nums" style={{ color: p.text, fontSize: s.big }}>
                {text}
              </span>
            )}
            {label && (
              <span id={`${uid}-label`} className="font-medium" style={{ color: p.muted, fontSize: s.font - 1.5 }}>
                {label}
              </span>
            )}
          </div>
        </div>
      )}

      {description && (
        <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4, textAlign: variant === "gauge" ? "center" : undefined }}>{description}</span>
      )}
    </div>
  );
}
