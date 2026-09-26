"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DescriptionListLayout = "stacked" | "inline" | "grid";
export type DescriptionListSize = "sm" | "md" | "lg";

export interface DescriptionListItem {
  id: string;
  term: string;
  description: React.ReactNode;
  icon?: React.ReactNode;
  /** Plain-text value to copy; defaults to `description` when that's a string. Showing this (or setting copyable) adds a copy button. */
  copyValue?: string;
  copyable?: boolean;
}

export interface DescriptionListProps {
  items: DescriptionListItem[];
  layout?: DescriptionListLayout;
  title?: string;
  /** Wraps the list in a bordered card. */
  bordered?: boolean;
  dividers?: boolean;
  /** Column count for "grid" layout. */
  columns?: number;
  size?: DescriptionListSize;
  theme?: "dark" | "light";
  accentColor?: string;
  width?: number | string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.09)", divider: "rgba(255,255,255,0.08)", text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", faint: "rgba(245,244,241,0.3)", iconBg: "rgba(255,255,255,0.06)", hover: "rgba(255,255,255,0.06)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.1)", divider: "rgba(10,10,10,0.08)", text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", faint: "rgba(10,10,10,0.3)", iconBg: "rgba(10,10,10,0.05)", hover: "rgba(10,10,10,0.05)" },
};

const SIZES: Record<DescriptionListSize, { term: number; desc: number; icon: number; padY: number; gap: number }> = {
  sm: { term: 11.5, desc: 13, icon: 24, padY: 10, gap: 3 },
  md: { term: 12.5, desc: 14, icon: 28, padY: 12, gap: 4 },
  lg: { term: 13.5, desc: 15.5, icon: 32, padY: 14, gap: 5 },
};

type Palette = (typeof PALETTES)["dark"];
type Size = (typeof SIZES)["md"];

function CopyGlyph({ copied, size }: { copied: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {copied ? (
        <path d="M3.5 8.3L6.3 11.2L12.5 4.5" />
      ) : (
        <>
          <rect x="5.5" y="5.5" width="8" height="8.5" rx="1.5" />
          <path d="M3.5 10.5A1.5 1.5 0 0 1 2 9V3.5A1.5 1.5 0 0 1 3.5 2H9a1.5 1.5 0 0 1 1.5 1.5" />
        </>
      )}
    </svg>
  );
}

function CopyButton({ value, p, size, onCopied }: { value: string; p: Palette; size: number; onCopied: () => void }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const copy = () => {
    try {
      const cb = navigator.clipboard;
      if (cb && typeof cb.writeText === "function") {
        void cb.writeText(value).then(
          () => {
            setCopied(true);
            onCopied();
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 1400);
          },
          () => undefined,
        );
      }
    } catch {
      // clipboard can be blocked inside an embedded frame
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy value"}
      className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-none bg-transparent align-middle outline-none focus-visible:ring-2"
      style={{ width: size, height: size, color: copied ? p.text : p.muted, ["--tw-ring-color" as string]: p.text }}
      onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(copied)} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.7 }} transition={{ duration: 0.14 }} className="flex items-center justify-center">
          <CopyGlyph copied={copied} size={size - 12} />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

function Row({ item, layout, s, p }: { item: DescriptionListItem; layout: DescriptionListLayout; s: Size; p: Palette }) {
  const copyValue = item.copyValue ?? (item.copyable && typeof item.description === "string" ? item.description : undefined);
  const inline = layout === "inline";
  // The copy button only fades in on hover/focus (via the CSS group below),
  // but that would also hide the "Copied" confirmation the instant the
  // pointer leaves right after a click — force it visible for the same
  // window the button itself shows the checkmark.
  const [justCopied, setJustCopied] = React.useState(false);
  const clearTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => () => {
    if (clearTimer.current) clearTimeout(clearTimer.current);
  }, []);
  const handleCopied = () => {
    setJustCopied(true);
    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => setJustCopied(false), 1400);
  };

  return (
    <div
      className={cn("group/row relative flex", inline ? "items-center justify-between" : "flex-col")}
      style={{ padding: `${s.padY}px 0`, gap: inline ? 12 : s.gap }}
    >
      <dt className="flex shrink-0 items-center font-medium" style={{ gap: 8, color: p.muted, fontSize: s.term, letterSpacing: inline ? undefined : "0.04em", textTransform: inline ? undefined : "uppercase" }}>
        {item.icon && (
          <span className="flex shrink-0 items-center justify-center rounded-lg" style={{ width: s.icon, height: s.icon, background: p.iconBg, color: p.text }}>
            {item.icon}
          </span>
        )}
        {item.term}
      </dt>
      <dd className={cn("m-0 flex min-w-0 items-center", inline ? "justify-end text-right" : "justify-start text-left")} style={{ gap: 6, color: p.text, fontSize: s.desc, fontWeight: 500, lineHeight: 1.5 }}>
        <span className="min-w-0 truncate">{item.description}</span>
        {copyValue && (
          <span
            className={cn("shrink-0 transition-opacity duration-150 group-hover/row:opacity-100 group-focus-within/row:opacity-100", justCopied ? "opacity-100" : "opacity-0")}
          >
            <CopyButton value={copyValue} p={p} size={s.icon - 4} onCopied={handleCopied} />
          </span>
        )}
      </dd>
    </div>
  );
}

export function DescriptionList({
  items,
  layout = "stacked",
  title,
  bordered = true,
  dividers = true,
  columns = 2,
  size = "md",
  theme = "dark",
  accentColor,
  width,
  className,
}: DescriptionListProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const isGrid = layout === "grid";

  return (
    <div
      className={cn("flex flex-col", className)}
      style={{ width, maxWidth: "100%", padding: bordered ? 18 : 0, borderRadius: bordered ? 16 : 0, background: bordered ? p.bg : "transparent", border: bordered ? `1px solid ${p.border}` : "none", fontFamily: "Inter, sans-serif" }}
    >
      {title && (
        <h3 id={`${uid}-title`} className="m-0 font-semibold tracking-[-0.01em]" style={{ color: accentColor ?? p.text, fontSize: s.desc + 1.5, marginBottom: 10 }}>
          {title}
        </h3>
      )}
      <dl aria-labelledby={title ? `${uid}-title` : undefined} className={cn("m-0", isGrid && "grid")} style={isGrid ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 24, rowGap: s.padY } : undefined}>
        {items.map((item, i) => (
          <div key={item.id} style={!isGrid && dividers && i < items.length - 1 ? { borderBottom: `1px solid ${p.divider}` } : undefined}>
            <Row item={item} layout={isGrid ? "stacked" : layout} s={s} p={p} />
          </div>
        ))}
      </dl>
    </div>
  );
}
