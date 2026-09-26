"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PaginationVariant = "solid" | "soft" | "compact";
export type PaginationSize = "sm" | "md" | "lg";

export interface PaginationProps {
  totalPages?: number;
  page?: number;
  defaultPage?: number;
  onPageChange?: (page: number) => void;
  siblingCount?: number;
  boundaryCount?: number;
  variant?: PaginationVariant;
  size?: PaginationSize;
  theme?: "dark" | "light";
  accentColor?: string;
  showLabels?: boolean;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", border: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.07)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", border: "rgba(10,10,10,0.1)", hover: "rgba(10,10,10,0.06)" },
};

const SIZES: Record<PaginationSize, { box: number; font: number; gap: number; icon: number }> = {
  sm: { box: 30, font: 12.5, gap: 4, icon: 14 },
  md: { box: 38, font: 14, gap: 6, icon: 16 },
  lg: { box: 46, font: 15.5, gap: 8, icon: 18 },
};

function readableTextOn(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0A0A0A" : "#FFFFFF";
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, i) => start + i);
}

function getItems(page: number, total: number, sibling: number, boundary: number): (number | "start-ellipsis" | "end-ellipsis")[] {
  const startPages = range(1, Math.min(boundary, total));
  const endPages = range(Math.max(total - boundary + 1, boundary + 1), total);
  const siblingsStart = Math.max(Math.min(page - sibling, total - boundary - sibling * 2 - 1), boundary + 2);
  const siblingsEnd = Math.min(Math.max(page + sibling, boundary + sibling * 2 + 2), endPages.length > 0 ? endPages[0] - 2 : total - 1);
  const out: (number | "start-ellipsis" | "end-ellipsis")[] = [...startPages];
  if (siblingsStart > boundary + 2) out.push("start-ellipsis");
  else if (boundary + 1 < total - boundary) out.push(boundary + 1);
  out.push(...range(siblingsStart, siblingsEnd));
  if (siblingsEnd < total - boundary - 1) out.push("end-ellipsis");
  else if (total - boundary > boundary) out.push(total - boundary);
  out.push(...endPages);
  return out;
}

function Arrow({ dir, size }: { dir: "left" | "right"; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "M10 3.5L5.5 8L10 12.5" : "M6 3.5L10.5 8L6 12.5"} />
    </svg>
  );
}

export function Pagination({
  totalPages = 12,
  page,
  defaultPage = 1,
  onPageChange,
  siblingCount = 1,
  boundaryCount = 1,
  variant = "solid",
  size = "md",
  theme = "dark",
  accentColor = "#F2A841",
  showLabels = false,
  disabled = false,
  className,
}: PaginationProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const total = Math.max(1, totalPages);
  const [internal, setInternal] = React.useState(defaultPage);
  const isControlled = page !== undefined;
  const current = Math.min(total, Math.max(1, isControlled ? page : internal));

  const go = (next: number) => {
    const n = Math.min(total, Math.max(1, next));
    if (disabled || n === current) return;
    if (!isControlled) setInternal(n);
    onPageChange?.(n);
  };

  const items = getItems(current, total, siblingCount, boundaryCount);
  const activeBg = variant === "soft" ? `color-mix(in srgb, ${accentColor} 16%, transparent)` : accentColor;
  const activeText = variant === "soft" ? accentColor : readableTextOn(accentColor);
  const activeBorder = variant === "soft" ? `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)` : "1px solid transparent";

  const navBtn = (dir: "left" | "right") => {
    const isPrev = dir === "left";
    const off = disabled || (isPrev ? current <= 1 : current >= total);
    return (
      <button
        type="button"
        aria-label={isPrev ? "Previous page" : "Next page"}
        disabled={off}
        onClick={() => go(current + (isPrev ? -1 : 1))}
        className="flex shrink-0 items-center justify-center border-none outline-none focus-visible:ring-2"
        style={{
          height: s.box,
          minWidth: s.box,
          gap: 6,
          padding: showLabels ? `0 ${s.box * 0.35}px` : 0,
          borderRadius: 10,
          background: "transparent",
          border: `1px solid ${p.border}`,
          color: off ? p.muted : p.text,
          opacity: off ? 0.45 : 1,
          fontSize: s.font,
          fontWeight: 600,
          cursor: off ? "default" : "pointer",
          transition: "background 0.15s ease, opacity 0.15s ease",
          ["--tw-ring-color" as string]: accentColor,
        }}
        onMouseEnter={(e) => !off && (e.currentTarget.style.background = p.hover)}
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      >
        {isPrev && <Arrow dir="left" size={s.icon} />}
        {showLabels && <span>{isPrev ? "Previous" : "Next"}</span>}
        {!isPrev && <Arrow dir="right" size={s.icon} />}
      </button>
    );
  };

  return (
    <nav aria-label="Pagination" className={cn("inline-block max-w-full", className)} style={{ fontFamily: "Inter, sans-serif", opacity: disabled ? 0.6 : 1 }}>
      <div className="flex flex-wrap items-center" style={{ gap: s.gap }}>
        {navBtn("left")}

        {variant === "compact" ? (
          <span className="flex items-center justify-center font-semibold tabular-nums" style={{ minWidth: s.box * 2.6, padding: "0 10px", fontSize: s.font, color: p.text }} aria-live="polite">
            Page {current} <span style={{ color: p.muted, fontWeight: 500, margin: "0 6px" }}>of</span> {total}
          </span>
        ) : (
          items.map((it) => {
            if (typeof it === "string") {
              return (
                <span key={it} aria-hidden="true" className="flex items-center justify-center font-semibold" style={{ width: s.box, height: s.box, color: p.muted, fontSize: s.font }}>
                  …
                </span>
              );
            }
            const active = it === current;
            return (
              <button
                key={it}
                type="button"
                aria-label={`Page ${it}`}
                aria-current={active ? "page" : undefined}
                disabled={disabled}
                onClick={() => go(it)}
                className="relative flex shrink-0 items-center justify-center border-none bg-transparent font-semibold tabular-nums outline-none focus-visible:ring-2"
                style={{
                  width: s.box,
                  height: s.box,
                  borderRadius: 10,
                  fontSize: s.font,
                  color: active ? activeText : p.muted,
                  cursor: disabled ? "default" : active ? "default" : "pointer",
                  transition: "color 0.2s ease, background 0.15s ease",
                  ["--tw-ring-color" as string]: accentColor,
                }}
                onMouseEnter={(e) => !active && !disabled && ((e.currentTarget.style.background = p.hover), (e.currentTarget.style.color = p.text))}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = active ? activeText : p.muted;
                }}
              >
                {active && <motion.span layoutId={`${uid}-active`} className="absolute inset-0" style={{ borderRadius: 10, background: activeBg, border: activeBorder }} transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
                <span className="relative">{it}</span>
              </button>
            );
          })
        )}

        {navBtn("right")}
      </div>
    </nav>
  );
}
