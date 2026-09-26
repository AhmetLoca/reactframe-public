"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SegmentedControlSize = "sm" | "md" | "lg";

export interface SegmentedOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface SegmentedControlProps {
  options?: SegmentedOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: "solid" | "soft";
  orientation?: "horizontal" | "vertical";
  fullWidth?: boolean;
  iconOnly?: boolean;
  label?: string;
  size?: SegmentedControlSize;
  theme?: "dark" | "light";
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", track: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.1)", hover: "rgba(245,244,241,0.9)", thumb: "#F5F4F1", thumbText: "#0A0A0A", soft: "rgba(255,255,255,0.12)", softBorder: "rgba(255,255,255,0.14)", focus: "rgba(245,244,241,0.85)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", track: "rgba(10,10,10,0.05)", border: "rgba(10,10,10,0.12)", hover: "#0A0A0A", thumb: "#0A0A0A", thumbText: "#FFFFFF", soft: "#FFFFFF", softBorder: "rgba(10,10,10,0.14)", focus: "rgba(10,10,10,0.85)" },
};

const SIZES: Record<SegmentedControlSize, { font: number; h: number; padX: number; radius: number; gap: number; icon: number }> = {
  sm: { font: 13, h: 30, padX: 12, radius: 10, gap: 6, icon: 14 },
  md: { font: 14.5, h: 36, padX: 16, radius: 12, gap: 7, icon: 16 },
  lg: { font: 16, h: 44, padX: 20, radius: 14, gap: 8, icon: 18 },
};

const DEFAULT_OPTIONS: SegmentedOption[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export function SegmentedControl({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  variant = "solid",
  orientation = "horizontal",
  fullWidth = false,
  iconOnly = false,
  label,
  size = "md",
  theme = "dark",
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: SegmentedControlProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue ?? options.find((o) => !o.disabled)?.value ?? "");
  const [hovered, setHovered] = React.useState<string | null>(null);
  const current = controlled ? value : internal;
  const vertical = orientation === "vertical";
  const pad = 4;

  const select = (v: string) => {
    if (v === current) return;
    if (!controlled) setInternal(v);
    onValueChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    let dir = 0;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") dir = 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") dir = -1;
    let target = -1;
    if (dir !== 0) {
      for (let step = 1; step <= options.length; step++) {
        const i = (index + dir * step + options.length * 2) % options.length;
        if (!options[i].disabled) { target = i; break; }
      }
    } else if (e.key === "Home") target = options.findIndex((o) => !o.disabled);
    else if (e.key === "End") target = options.length - 1 - [...options].reverse().findIndex((o) => !o.disabled);
    if (target < 0) return;
    e.preventDefault();
    refs.current[target]?.focus();
    select(options[target].value);
  };

  const hasCurrent = options.some((o) => o.value === current && !o.disabled);
  const tabStop = hasCurrent ? current : options.find((o) => !o.disabled)?.value;

  return (
    <div className={cn("inline-flex flex-col gap-2", fullWidth && "w-full", className)} style={{ fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <span id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </span>
      )}
      <div
        role="radiogroup"
        aria-labelledby={label ? `${uid}-label` : undefined}
        aria-label={label ? undefined : (ariaLabel ?? "Options")}
        aria-orientation={orientation}
        className={cn("relative", vertical ? "inline-flex flex-col" : "inline-flex", fullWidth && "w-full")}
        style={{ padding: pad, gap: 2, borderRadius: s.radius + pad, background: p.track, border: `1px solid ${p.border}`, pointerEvents: disabled ? "none" : undefined }}
      >
        {options.map((o, i) => {
          const selected = o.value === current;
          const isHover = hovered === o.value && !selected && !o.disabled;
          const textColor = selected ? (variant === "solid" ? p.thumbText : p.text) : isHover ? p.hover : p.muted;
          return (
            <button
              key={o.value}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={iconOnly ? o.label : undefined}
              title={iconOnly ? o.label : undefined}
              disabled={o.disabled || disabled}
              tabIndex={o.value === tabStop ? 0 : -1}
              onClick={() => select(o.value)}
              onKeyDown={(e) => onKeyDown(e, i)}
              onMouseEnter={() => setHovered(o.value)}
              onMouseLeave={() => setHovered(null)}
              className={cn("relative flex cursor-pointer items-center justify-center border-none bg-transparent font-semibold outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40", fullWidth && !vertical && "flex-1", vertical && "w-full justify-start")}
              style={{ height: s.h, padding: iconOnly ? `0 ${Math.round(s.padX * 0.65)}px` : `0 ${s.padX}px`, borderRadius: s.radius, gap: s.gap, fontSize: s.font, color: textColor, transition: "color 0.2s ease", ["--tw-ring-color" as string]: p.focus }}
            >
              {selected && (
                <motion.span
                  layoutId={`${uid}-thumb`}
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ borderRadius: s.radius, background: variant === "solid" ? p.thumb : p.soft, border: variant === "soft" ? `1px solid ${p.softBorder}` : "1px solid transparent", boxShadow: variant === "solid" ? "0 2px 10px rgba(0,0,0,0.25)" : theme === "light" ? "0 1px 4px rgba(0,0,0,0.1)" : "none" }}
                  transition={{ type: "spring", stiffness: 520, damping: 38 }}
                />
              )}
              {o.icon && (
                <span className="relative z-10 flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.icon }}>
                  {o.icon}
                </span>
              )}
              {!iconOnly && <span className="relative z-10 whitespace-nowrap">{o.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
