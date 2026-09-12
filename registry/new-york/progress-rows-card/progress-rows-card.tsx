"use client";

import * as React from "react";
import { motion, useInView } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ProgressRow {
  visible?: boolean;
  label: string;
  value: number;
  maxValue: number;
  colorStart: string;
  colorEnd: string;
  height?: number;
}

export interface ProgressRowsCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: "light" | "dark";
  scrollReveal?: boolean;
  animDuration?: number;
  rows?: ProgressRow[];
  bgColor?: string;
  borderRadius?: number;
  shadow?: "none" | "soft" | "medium" | "strong";
}

const DEFAULT_ROWS: ProgressRow[] = [
  { visible: true, label: "Class A", value: 368, maxValue: 500, colorStart: "#34D399", colorEnd: "#10B981", height: 9 },
  { visible: true, label: "Class B", value: 211, maxValue: 500, colorStart: "#FB923C", colorEnd: "#F97316", height: 9 },
  { visible: true, label: "Class C", value: 96, maxValue: 500, colorStart: "#F87171", colorEnd: "#EF4444", height: 9 },
];

function ProgressRowItem({
  row,
  animated,
  duration,
  isDark,
}: {
  row: ProgressRow;
  animated: boolean;
  duration: number;
  isDark: boolean;
}) {
  const { label, value, maxValue, colorStart, colorEnd, height = 9 } = row;
  const textPrimary = isDark ? "#F3F4F6" : "#111827";
  const textValue = isDark ? "#D1D5DB" : "#374151";
  const trackBg = isDark ? "#262626" : "#EFEFEF";

  const pct = maxValue > 0 ? Math.min(100, Math.max(0, (value / maxValue) * 100)) : 0;
  const target = animated ? pct : 0;
  const bg = colorStart === colorEnd ? colorStart : `linear-gradient(90deg, ${colorStart}, ${colorEnd})`;

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[14.5px] font-medium tracking-[-0.015em]" style={{ color: textPrimary }}>
          {label}
        </span>
        <span className="text-[14.5px] font-semibold tracking-[-0.02em] tabular-nums" style={{ color: textValue }}>
          {value}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-full" style={{ height, backgroundColor: trackBg }}>
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full"
          style={{ background: bg }}
          initial={{ width: "0%" }}
          animate={{ width: `${target}%` }}
          transition={{ duration, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

export function ProgressRowsCard({
  theme = "light",
  scrollReveal = true,
  animDuration = 1.2,
  rows = DEFAULT_ROWS,
  bgColor,
  borderRadius = 20,
  shadow = "medium",
  className,
  style,
  ...props
}: ProgressRowsCardProps) {
  const isDark = theme === "dark";
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [animated, setAnimated] = React.useState(!scrollReveal);

  React.useEffect(() => {
    if (!scrollReveal) {
      setAnimated(true);
      return;
    }
    if (isInView) setAnimated(true);
  }, [scrollReveal, isInView]);

  const resolvedBg = bgColor ?? (isDark ? "#171717" : "#FFFFFF");

  const shadowValue = {
    none: "none",
    soft: isDark ? "0 8px 24px rgba(0,0,0,0.45)" : "0 4px 16px rgba(0,0,0,0.06)",
    medium: isDark ? "0 0 0 1px rgba(255,255,255,0.07), 0 32px 64px rgba(0,0,0,0.7)" : "0 0 0 1px rgba(0,0,0,0.05), 0 20px 60px rgba(0,0,0,0.07)",
    strong: isDark ? "0 0 0 1px rgba(255,255,255,0.09), 0 48px 96px rgba(0,0,0,0.85)" : "0 0 0 1px rgba(0,0,0,0.08), 0 32px 80px rgba(0,0,0,0.15)",
  }[shadow];

  const visibleRows = rows.filter((r) => r.visible !== false);

  return (
    <div
      ref={ref}
      className={cn("flex w-full flex-col gap-5 px-8 py-7 font-sans box-border", className)}
      style={{ backgroundColor: resolvedBg, borderRadius, boxShadow: shadowValue, ...style }}
      {...props}
    >
      {visibleRows.map((row, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className="h-px" style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)" }} />}
          <ProgressRowItem row={row} animated={animated} duration={animDuration} isDark={isDark} />
        </React.Fragment>
      ))}
    </div>
  );
}
