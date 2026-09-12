"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type LinearProgressCapStyle = "glow" | "dot" | "line" | "none";
export type LinearProgressValueStyle = "side" | "chip" | "none";

export interface LinearProgressThresholds {
  lowMax: number;
  lowColor: string;
  midMax: number;
  midColor: string;
  highColor: string;
}

export interface LinearProgressProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  value: number;
  label?: string;
  labelSub?: string;
  valueLabel?: string;
  icon?: React.ReactNode;
  colorStart?: string;
  colorEnd?: string;
  height?: number;
  capStyle?: LinearProgressCapStyle;
  shimmer?: boolean;
  milestones?: number;
  subtitle?: string;
  inline?: boolean;
  duration?: number;
  /** Animate the fill in only once it scrolls into view. Defaults to true. */
  revealOnScroll?: boolean;
  /**
   * How the percentage value is displayed: inline next to the label, in a
   * floating chip that tracks the fill's leading edge, or hidden. Only
   * applies when `valueLabel` isn't supplied. Defaults to "side".
   */
  valueStyle?: LinearProgressValueStyle;
  /** Animate the displayed percentage counting up from 0. Defaults to true. */
  countUp?: boolean;
  /** Overrides colorStart/colorEnd with a color picked by value range. */
  thresholds?: LinearProgressThresholds;
  /** Flash a pulsing ring around the track once the fill reaches 100%. */
  completionPulse?: boolean;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function LinearProgress({
  value,
  label,
  labelSub,
  valueLabel,
  icon,
  colorStart = "#0A0A0A",
  colorEnd = "#0A0A0A",
  height = 8,
  capStyle = "none",
  shimmer = false,
  milestones = 0,
  subtitle,
  inline = false,
  duration = 1.2,
  revealOnScroll = true,
  valueStyle = "side",
  countUp = true,
  thresholds,
  completionPulse = false,
  className,
  ...props
}: LinearProgressProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const animated = revealOnScroll ? isInView : true;

  const pct = Math.min(100, Math.max(0, value));
  const target = animated ? pct : 0;
  const isComplete = pct === 100;

  const [displayValue, setDisplayValue] = React.useState(0);
  const [pulseKey, setPulseKey] = React.useState(0);

  React.useEffect(() => {
    if (!animated) return;
    if (!countUp) {
      setDisplayValue(pct);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const durationMs = duration * 1000;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setDisplayValue(Math.round(easeOutCubic(t) * pct));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [animated, countUp, pct, duration]);

  React.useEffect(() => {
    if (!animated || !isComplete || !completionPulse) return;
    const t = setTimeout(() => setPulseKey((k) => k + 1), duration * 1000 + 100);
    return () => clearTimeout(t);
  }, [animated, isComplete, completionPulse, duration]);

  let activeColorStart = colorStart;
  let activeColorEnd = colorEnd;
  if (thresholds) {
    const color = pct < thresholds.lowMax ? thresholds.lowColor : pct < thresholds.midMax ? thresholds.midColor : thresholds.highColor;
    activeColorStart = color;
    activeColorEnd = color;
  }

  const bg = activeColorStart === activeColorEnd ? activeColorStart : `linear-gradient(90deg, ${activeColorStart}, ${activeColorEnd})`;
  const cap = activeColorEnd;
  const ease: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
  const computedValueLabel = valueLabel ?? (valueStyle === "side" ? `${displayValue}%` : undefined);

  const milePositions =
    milestones > 1 ? Array.from({ length: milestones - 1 }, (_, i) => Math.round(((i + 1) / milestones) * 100)) : [];

  const track = (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative overflow-visible rounded-full bg-[#1a1a1a]", inline ? "flex-1" : "w-full")}
      style={{ height, marginTop: valueStyle === "chip" ? 38 : undefined }}
    >
      {milePositions.map((pos) => (
        <div
          key={pos}
          className="pointer-events-none absolute top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-[1px] bg-white/10"
          style={{ left: `${pos}%`, width: 1.5, height: height * 0.55 }}
        />
      ))}

      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
        style={{ background: bg }}
        initial={{ width: "0%" }}
        animate={{ width: `${target}%` }}
        transition={{ duration, ease }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ height: "45%", background: "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,transparent 100%)" }}
        />
        {shimmer && (
          <motion.div
            className="pointer-events-none absolute inset-y-0"
            style={{ width: "55%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35) 50%,transparent)" }}
            animate={{ x: ["-120%", "320%"] }}
            transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {capStyle !== "none" && (
        <motion.div
          className="pointer-events-none absolute top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2"
          initial={{ left: "0%" }}
          animate={{ left: `${target}%` }}
          transition={{ duration, ease }}
        >
          {capStyle === "glow" && (
            <div
              className="rounded-full border-2 bg-white"
              style={{ width: height + 4, height: height + 4, borderColor: cap, boxShadow: `0 0 0 3px ${cap}33,0 0 14px 5px ${cap}55` }}
            />
          )}
          {capStyle === "dot" && (
            <div
              className="rounded-full border-2 bg-white shadow-[0_2px_6px_rgba(0,0,0,0.16)]"
              style={{ width: height + 4, height: height + 4, borderColor: cap }}
            />
          )}
          {capStyle === "line" && <div className="rounded-[2px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)]" style={{ width: 3, height: height + 6 }} />}
        </motion.div>
      )}

      {valueStyle === "chip" && (
        <motion.div
          className="pointer-events-none absolute -top-9 z-[4] flex -translate-x-1/2 flex-col items-center"
          initial={{ left: "0%", opacity: 0 }}
          animate={{ left: `${target}%`, opacity: animated ? 1 : 0 }}
          transition={{ duration, ease }}
        >
          <div className="rounded-full bg-[#f5f4f1] px-2.5 py-[3px] text-xs font-bold tracking-tight whitespace-nowrap tabular-nums text-[#0e0e0e] shadow-[0_2px_10px_rgba(0,0,0,0.15),0_1px_3px_rgba(0,0,0,0.1)]">
            {displayValue}%
          </div>
          <div className="mt-px h-0 w-0 border-x-[5px] border-t-[5px] border-x-transparent border-t-foreground" />
        </motion.div>
      )}

      {completionPulse && isComplete && pulseKey > 0 && (
        <motion.div
          key={pulseKey}
          className="pointer-events-none absolute z-[5] rounded-full"
          style={{ inset: -3, border: `2px solid ${cap}` }}
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      )}
    </div>
  );

  if (inline) {
    return (
      <div className={cn("flex items-center gap-2.5", className)} {...props}>
        {label && <span className="whitespace-nowrap text-[13.5px] font-medium tracking-[-0.01em] text-[#f5f4f1]">{label}</span>}
        {track}
        {computedValueLabel && <span className="whitespace-nowrap text-[13px] font-semibold tabular-nums tracking-tight text-[#f5f4f1]/80">{computedValueLabel}</span>}
        {icon}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-[7px]", className)} {...props}>
      {(label || computedValueLabel || icon) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-[5px] overflow-hidden">
            {label && <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[13.5px] font-medium tracking-[-0.01em] text-[#f5f4f1]">{label}</span>}
            {labelSub && <span className="shrink-0 whitespace-nowrap text-xs text-[#f5f4f1]/50">{labelSub}</span>}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {computedValueLabel && <span className="text-[13px] font-semibold tabular-nums tracking-tight text-[#f5f4f1]/80">{computedValueLabel}</span>}
            {icon}
          </div>
        </div>
      )}
      {track}
      {subtitle && <span className="text-[11.5px] tracking-[-0.005em] text-[#f5f4f1]/50">{subtitle}</span>}
    </div>
  );
}
