"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Icons ───────────────────────────────────────────────────────────────────

function Spinner({ color, active }: { color: string; active: boolean }) {
  return (
    <motion.svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      style={{ flexShrink: 0, willChange: "transform" }}
      animate={active ? { rotate: 360 } : { rotate: 0 }}
      transition={{ duration: 1.1, repeat: active ? Infinity : 0, ease: "linear" }}
    >
      <circle cx="8" cy="8" r="6" stroke={color} strokeOpacity="0.22" strokeWidth="2.2" />
      <path d="M14 8A6 6 0 0 0 8 2" stroke={color} strokeWidth="2.2" strokeLinecap="round" />
    </motion.svg>
  );
}

function CheckCircle({ color }: { color: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
      <path d="M5.5 9.5 8 12l4.5-5.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XCircle({ color }: { color: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="9" cy="9" r="8" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5" />
      <path d="M6 6l6 6M12 6l-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CloseX({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <path d="M3 3l8 8M11 3l-8 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InfoDot({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6.2" stroke={color} strokeWidth="1.2" />
      <circle cx="7" cy="4.6" r="0.72" fill={color} />
      <path d="M7 6.5v3.2" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function RowIcon({ icon, color, active }: { icon?: LinearProgressBarRow["icon"]; color: string; active: boolean }) {
  if (icon === "spinner") return <Spinner color={color} active={active} />;
  if (icon === "check") return <CheckCircle color={color} />;
  if (icon === "x") return <XCircle color={color} />;
  if (icon === "close") return <CloseX color={color} />;
  return null;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LinearProgressRatioRow {
  kind: "ratio";
  label: string;
  value: number;
  maxValue: number;
  colorStart: string;
  colorEnd: string;
  height?: number;
}

export interface LinearProgressBarRow {
  kind: "bar";
  label?: string;
  labelSub?: string;
  labelRight?: string;
  pct: number;
  colorStart: string;
  colorEnd: string;
  height?: number;
  capStyle?: "glow" | "dot" | "line" | "none";
  capColor?: string;
  shimmer?: boolean;
  milestones?: number;
  subtitle?: string;
  subtitleColor?: string;
  inline?: boolean;
  duration?: number;
  showInfo?: boolean;
  icon?: "spinner" | "check" | "x" | "close" | "none";
}

export type LinearProgressRow = LinearProgressRatioRow | LinearProgressBarRow;

export interface LinearProgressBarsProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: "light" | "dark";
  scrollReveal?: boolean;
  animationDuration?: number;
  rows?: LinearProgressRow[];
  cardBg?: string;
  cardRadius?: number;
  cardBorderWidth?: number;
  cardBorderColor?: string;
  cardShadow?: "none" | "soft" | "medium" | "strong";
  cardPaddingY?: number;
  cardPaddingX?: number;
}

function buildDefaultRows(animationDuration: number): LinearProgressRow[] {
  return [
    { kind: "ratio", label: "Progress A", value: 368, maxValue: 500, colorStart: "#34d399", colorEnd: "#10b981", height: 9 },
    { kind: "ratio", label: "Progress B", value: 211, maxValue: 500, colorStart: "#fb923c", colorEnd: "#f97316", height: 9 },
    { kind: "ratio", label: "Progress C", value: 96, maxValue: 500, colorStart: "#f87171", colorEnd: "#ef4444", height: 9 },
    {
      kind: "bar",
      label: "brand-assets.zip",
      labelSub: "(21.2 MB)",
      labelRight: "67%",
      pct: 67,
      colorStart: "#6366f1",
      colorEnd: "#8b5cf6",
      height: 8,
      subtitle: "14.2 MB of 21.2 MB · 8 seconds remaining",
      showInfo: true,
      icon: "spinner",
      capStyle: "glow",
      shimmer: true,
    },
    {
      kind: "bar",
      label: "quarterly-report.pdf",
      labelRight: "100%",
      pct: 100,
      colorStart: "#10b981",
      colorEnd: "#10b981",
      height: 8,
      subtitle: "12.8 MB · Saved to Cloud Storage",
      showInfo: true,
      icon: "check",
      duration: animationDuration * 0.75,
    },
    {
      kind: "bar",
      label: "prototype-v4.fig",
      pct: 38,
      colorStart: "#ef4444",
      colorEnd: "#f87171",
      height: 8,
      subtitle: "Upload interrupted · Tap to retry",
      subtitleColor: "#ef4444",
      showInfo: true,
      icon: "x",
      duration: animationDuration * 0.5,
    },
    {
      kind: "bar",
      label: "Cloud Storage",
      labelRight: "24.8 GB / 100 GB",
      pct: 25,
      colorStart: "#3b82f6",
      colorEnd: "#06b6d4",
      height: 10,
      milestones: 4,
      subtitle: "Est. full in 18 months",
      duration: animationDuration * 0.92,
    },
    {
      kind: "bar",
      label: "Generating design tokens",
      labelRight: "318 / 400 tasks",
      pct: 79,
      colorStart: "#f59e0b",
      colorEnd: "#ef4444",
      height: 10,
      subtitle: "~22 seconds remaining",
      capStyle: "dot",
    },
    {
      kind: "bar",
      label: "Bandwidth",
      labelRight: "61%",
      pct: 61,
      colorStart: "#06b6d4",
      colorEnd: "#8b5cf6",
      height: 7,
      showInfo: true,
      icon: "spinner",
      shimmer: true,
      inline: true,
      duration: animationDuration * 0.92,
    },
    {
      kind: "bar",
      label: "Monthly Transfer",
      labelRight: "1.2 TB / 2 TB",
      pct: 61,
      colorStart: "#ec4899",
      colorEnd: "#f97316",
      height: 10,
      subtitle: "(650 GB / 1.12 TB) · 17 days remaining",
      icon: "close",
      capStyle: "line",
      shimmer: true,
    },
  ];
}

// ─── Track (shared bar visual) ───────────────────────────────────────────────

function Track({
  pct,
  colorStart,
  colorEnd,
  height,
  capStyle,
  capColor,
  shimmer,
  milestones,
  inline,
  duration,
  animated,
  isDark,
  label,
}: {
  pct: number;
  colorStart: string;
  colorEnd: string;
  height: number;
  capStyle: "glow" | "dot" | "line" | "none";
  capColor?: string;
  shimmer: boolean;
  milestones: number;
  inline: boolean;
  duration: number;
  animated: boolean;
  isDark: boolean;
  label?: string;
}) {
  const trackBg = isDark ? "#1e1e1e" : "#f0f0f8";
  const bg = colorStart === colorEnd ? colorStart : `linear-gradient(90deg, ${colorStart}, ${colorEnd})`;
  const cap = capColor ?? colorEnd;
  const target = animated ? pct : 0;
  const ease = [0.25, 0.46, 0.45, 0.94] as const;
  const tr = { duration, ease };

  const milePositions = milestones > 1 ? Array.from({ length: milestones - 1 }, (_, i) => Math.round(((i + 1) / milestones) * 100)) : [];

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn("relative rounded-full overflow-visible", inline ? "flex-1" : "w-full")}
      style={{ height, backgroundColor: trackBg }}
    >
      {milePositions.map((pos) => (
        <div
          key={pos}
          className="absolute top-1/2 z-[2] -translate-x-1/2 -translate-y-1/2 rounded-[1px] pointer-events-none"
          style={{ left: `${pos}%`, width: 1.5, height: height * 0.55, backgroundColor: isDark ? "#3a3a3a" : "#d1d5db" }}
        />
      ))}

      <motion.div
        className="absolute inset-y-0 left-0 overflow-hidden rounded-full"
        style={{ background: bg }}
        initial={{ width: "0%" }}
        animate={{ width: `${target}%` }}
        transition={tr}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ height: "45%", background: "linear-gradient(180deg,rgba(255,255,255,0.22) 0%,transparent 100%)" }}
        />
        {shimmer && (
          <motion.div
            className="pointer-events-none absolute top-0 bottom-0"
            style={{ width: "55%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,0.35) 50%,transparent)" }}
            animate={{ x: ["-120%", "320%"] }}
            transition={{ repeat: Infinity, repeatDelay: 2.2, duration: 1.5, ease: "easeInOut" }}
          />
        )}
      </motion.div>

      {capStyle !== "none" && (
        <motion.div
          className="absolute top-1/2 z-[3] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ left: "0%" }}
          animate={{ left: `${target}%` }}
          transition={tr}
        >
          {capStyle === "glow" && (
            <div
              className="rounded-full bg-white"
              style={{ width: height + 4, height: height + 4, border: `2px solid ${cap}`, boxShadow: `0 0 0 3px ${cap}33,0 0 14px 5px ${cap}55` }}
            />
          )}
          {capStyle === "dot" && (
            <div className="rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.16)]" style={{ width: height + 4, height: height + 4, border: `2px solid ${cap}` }} />
          )}
          {capStyle === "line" && <div className="rounded-[2px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.18)]" style={{ width: 3, height: height + 6 }} />}
        </motion.div>
      )}
    </div>
  );
}

// ─── Ratio row ────────────────────────────────────────────────────────────────

function RatioRow({ row, animated, isDark, duration }: { row: LinearProgressRatioRow; animated: boolean; isDark: boolean; duration: number }) {
  const textPrimary = isDark ? "#f3f4f6" : "#111827";
  const textValue = isDark ? "#d1d5db" : "#374151";
  const trackBg = isDark ? "#1e1e1e" : "#efefef";
  const pct = row.maxValue > 0 ? Math.min(100, Math.max(0, (row.value / row.maxValue) * 100)) : 0;
  const target = animated ? pct : 0;
  const bg = row.colorStart === row.colorEnd ? row.colorStart : `linear-gradient(90deg, ${row.colorStart}, ${row.colorEnd})`;
  const height = row.height ?? 9;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span style={{ fontSize: 14.5, fontWeight: 500, color: textPrimary, letterSpacing: "-0.015em" }}>{row.label}</span>
        <span style={{ fontSize: 14.5, fontWeight: 600, color: textValue, letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>{row.value}</span>
      </div>
      <div role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={row.label} className="relative rounded-full overflow-hidden" style={{ height, backgroundColor: trackBg }}>
        <motion.div className="absolute inset-y-0 left-0 rounded-full" style={{ background: bg }} initial={{ width: "0%" }} animate={{ width: `${target}%` }} transition={{ duration, ease: [0.25, 0.46, 0.45, 0.94] }} />
      </div>
    </div>
  );
}

// ─── Bar row ──────────────────────────────────────────────────────────────────

function BarRow({ row, animated, isDark, defaultDuration, closeIconColor }: { row: LinearProgressBarRow; animated: boolean; isDark: boolean; defaultDuration: number; closeIconColor: string }) {
  const textPrimary = isDark ? "#f3f4f6" : "#111827";
  const textMuted = isDark ? "#6b7280" : "#9ca3af";
  const textValue = isDark ? "#d1d5db" : "#374151";
  const subColor = row.subtitleColor ?? textMuted;
  const height = row.height ?? 8;
  const iconColor = row.icon === "spinner" ? row.colorEnd : row.colorStart;

  const icon = row.icon && row.icon !== "none" ? <RowIcon icon={row.icon} color={row.icon === "close" ? closeIconColor : iconColor} active={animated} /> : null;

  const track = (
    <Track
      pct={row.pct}
      colorStart={row.colorStart}
      colorEnd={row.colorEnd}
      height={height}
      capStyle={row.capStyle ?? "none"}
      capColor={row.capColor}
      shimmer={row.shimmer ?? false}
      milestones={row.milestones ?? 0}
      inline={row.inline ?? false}
      duration={row.duration ?? defaultDuration}
      animated={animated}
      isDark={isDark}
      label={row.label}
    />
  );

  if (row.inline) {
    return (
      <div className="flex items-center gap-2.5">
        {row.label && (
          <div className="flex items-center gap-1.5">
            <span style={{ fontSize: 13.5, fontWeight: 500, color: textPrimary, whiteSpace: "nowrap", letterSpacing: "-0.01em" }}>{row.label}</span>
            {row.showInfo && <InfoDot color={textMuted} />}
          </div>
        )}
        {track}
        {row.labelRight && (
          <span style={{ fontSize: 13, fontWeight: 600, color: textValue, whiteSpace: "nowrap", letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>{row.labelRight}</span>
        )}
        {icon}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      {(row.label || row.labelRight || icon) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-1.5 overflow-hidden">
            {row.label && <span style={{ fontSize: 13.5, fontWeight: 500, color: textPrimary, letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.label}</span>}
            {row.showInfo && <InfoDot color={textMuted} />}
            {row.labelSub && <span style={{ fontSize: 12, color: textMuted, whiteSpace: "nowrap", flexShrink: 0 }}>{row.labelSub}</span>}
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            {row.labelRight && <span style={{ fontSize: 13, fontWeight: 600, color: textValue, letterSpacing: "-0.025em", fontVariantNumeric: "tabular-nums" }}>{row.labelRight}</span>}
            {icon}
          </div>
        </div>
      )}
      {track}
      {row.subtitle && <span style={{ fontSize: 11.5, color: subColor, letterSpacing: "-0.005em" }}>{row.subtitle}</span>}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export function LinearProgressBars({
  theme = "light",
  scrollReveal = true,
  animationDuration = 1.2,
  rows,
  cardBg = "#ffffff",
  cardRadius = 20,
  cardBorderWidth = 0,
  cardBorderColor = "#e5e7eb",
  cardShadow = "medium",
  cardPaddingY = 28,
  cardPaddingX = 32,
  className,
  ...props
}: LinearProgressBarsProps) {
  const isDark = theme === "dark";
  const resolvedRows = rows ?? buildDefaultRows(animationDuration);
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [animated, setAnimated] = React.useState(!scrollReveal);

  React.useEffect(() => {
    if (!scrollReveal || !isInView) return;
    const id = setTimeout(() => setAnimated(true), 0);
    return () => clearTimeout(id);
  }, [scrollReveal, isInView]);

  const shadowValue = {
    none: "none",
    soft: isDark ? "0 8px 24px rgba(0,0,0,0.45)" : "0 4px 16px rgba(0,0,0,0.06)",
    medium: isDark ? "0 0 0 1px rgba(255,255,255,0.07), 0 32px 64px rgba(0,0,0,0.7)" : "0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.07)",
    strong: isDark ? "0 0 0 1px rgba(255,255,255,0.09), 0 48px 96px rgba(0,0,0,0.85)" : "0 0 0 1px rgba(0,0,0,0.08), 0 32px 80px rgba(0,0,0,0.15)",
  }[cardShadow];

  const dividerColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.055)";
  const closeIconColor = isDark ? "#5b6370" : "#9ca3af";

  return (
    <div
      ref={ref}
      className={cn("flex w-full flex-col gap-5 box-border", className)}
      style={{
        backgroundColor: cardBg,
        borderRadius: cardRadius,
        padding: `${cardPaddingY}px ${cardPaddingX}px`,
        border: cardBorderWidth > 0 ? `${cardBorderWidth}px solid ${cardBorderColor}` : "none",
        boxShadow: shadowValue,
      }}
      {...props}
    >
      {resolvedRows.map((row, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div style={{ height: 1, background: dividerColor }} />}
          {row.kind === "ratio" ? (
            <RatioRow row={row} animated={animated} isDark={isDark} duration={animationDuration} />
          ) : (
            <BarRow row={row} animated={animated} isDark={isDark} defaultDuration={animationDuration} closeIconColor={closeIconColor} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
