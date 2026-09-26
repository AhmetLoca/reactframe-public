"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TagColor = "neutral" | "amber" | "mint" | "coral" | "blue" | "lavender";
export type TagVariant = "soft" | "solid" | "outline";
export type TagSize = "sm" | "md" | "lg";

export interface TagProps {
  children?: React.ReactNode;
  variant?: TagVariant;
  color?: TagColor;
  size?: TagSize;
  theme?: "dark" | "light";
  dot?: boolean;
  pulse?: boolean;
  icon?: React.ReactNode;
  count?: number;
  selected?: boolean;
  defaultSelected?: boolean;
  onSelectedChange?: (selected: boolean) => void;
  removable?: boolean;
  onRemove?: () => void;
  disabled?: boolean;
  radius?: number;
  className?: string;
}

const COLORS: Record<"dark" | "light", Record<TagColor, string>> = {
  dark: { neutral: "#F5F4F1", amber: "#F2A841", mint: "#87FFE3", coral: "#FF7A6B", blue: "#8FB8FF", lavender: "#B8A6FF" },
  light: { neutral: "#0A0A0A", amber: "#D9822B", mint: "#0E9F80", coral: "#E5484D", blue: "#3B6FD8", lavender: "#7C5CE0" },
};

const SIZES: Record<TagSize, { height: number; padX: number; font: number; gap: number; icon: number }> = {
  sm: { height: 22, padX: 8, font: 11.5, gap: 5, icon: 11 },
  md: { height: 28, padX: 11, font: 13, gap: 6, icon: 13 },
  lg: { height: 34, padX: 14, font: 14.5, gap: 8, icon: 15 },
};

function readableTextOn(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0A0A0A" : "#FFFFFF";
}

export function Tag({
  children,
  variant = "soft",
  color = "amber",
  size = "md",
  theme = "dark",
  dot = false,
  pulse = false,
  icon,
  count,
  selected,
  defaultSelected = false,
  onSelectedChange,
  removable = false,
  onRemove,
  disabled = false,
  radius = 999,
  className,
}: TagProps) {
  const s = SIZES[size];
  const accent = COLORS[theme][color];
  const isNeutral = color === "neutral";
  const [internalSelected, setInternalSelected] = React.useState(defaultSelected);
  const [hidden, setHidden] = React.useState(false);
  const interactive = selected !== undefined || onSelectedChange !== undefined;
  const isSelected = selected !== undefined ? selected : internalSelected;

  const asSolid = variant === "solid" || (interactive && isSelected);
  const background = asSolid ? accent : variant === "outline" ? "transparent" : isNeutral ? (theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(10,10,10,0.06)") : `color-mix(in srgb, ${accent} 14%, transparent)`;
  const textColor = asSolid ? readableTextOn(accent) : accent;
  const borderColor = asSolid ? accent : variant === "outline" ? `color-mix(in srgb, ${accent} ${isNeutral ? 32 : 45}%, transparent)` : `color-mix(in srgb, ${accent} ${isNeutral ? 12 : 22}%, transparent)`;

  const toggle = () => {
    if (disabled || !interactive) return;
    const next = !isSelected;
    if (selected === undefined) setInternalSelected(next);
    onSelectedChange?.(next);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    setHidden(true);
    onRemove?.();
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.span
          layout
          role={interactive ? "button" : undefined}
          aria-pressed={interactive ? isSelected : undefined}
          aria-disabled={disabled || undefined}
          tabIndex={interactive && !disabled ? 0 : undefined}
          onClick={toggle}
          onKeyDown={(e) => {
            if (interactive && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              toggle();
            }
          }}
          className={cn("inline-flex items-center whitespace-nowrap font-semibold tracking-[-0.005em] outline-none select-none", interactive && !disabled && "cursor-pointer", className)}
          style={{
            height: s.height,
            gap: s.gap,
            padding: `0 ${s.padX}px`,
            fontSize: s.font,
            fontFamily: "Inter, sans-serif",
            borderRadius: radius,
            background,
            color: textColor,
            border: `1px solid ${borderColor}`,
            opacity: disabled ? 0.45 : 1,
            transition: "background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease",
          }}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: disabled ? 0.45 : 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileTap={interactive && !disabled ? { scale: 0.94 } : undefined}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
        >
          {dot && (
            <span className="relative flex shrink-0" style={{ width: s.icon * 0.55, height: s.icon * 0.55 }}>
              {pulse && (
                <motion.span className="absolute inset-0 rounded-full" style={{ background: textColor }} animate={{ scale: [1, 2.4], opacity: [0.5, 0] }} transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }} />
              )}
              <span className="relative rounded-full" style={{ width: "100%", height: "100%", background: textColor }} />
            </span>
          )}
          {icon && (
            <span className="flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.icon }}>
              {icon}
            </span>
          )}
          {children}
          {count !== undefined && (
            <span className="rounded-full font-bold tabular-nums" style={{ padding: "0 5px", minWidth: s.icon * 1.25, textAlign: "center", fontSize: s.font * 0.85, lineHeight: `${s.icon * 1.25}px`, background: asSolid ? "rgba(0,0,0,0.14)" : `color-mix(in srgb, ${accent} 20%, transparent)` }}>
              {count}
            </span>
          )}
          {removable && (
            <button
              type="button"
              aria-label="Remove"
              onClick={handleRemove}
              disabled={disabled}
              className="-mr-1 flex shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 opacity-70 transition-opacity hover:opacity-100"
              style={{ width: s.icon + 2, height: s.icon + 2, color: textColor }}
            >
              <svg width={s.icon * 0.7} height={s.icon * 0.7} viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
