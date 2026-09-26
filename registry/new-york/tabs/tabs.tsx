"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  disabled?: boolean;
  content?: React.ReactNode;
}

export type TabsVariant = "underline" | "pill" | "segmented";
export type TabsSize = "sm" | "md" | "lg";

export interface TabsProps {
  items?: TabItem[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  size?: TabsSize;
  theme?: "dark" | "light";
  accentColor?: string;
  fullWidth?: boolean;
  className?: string;
}

const DEFAULT_ITEMS: TabItem[] = [
  { value: "overview", label: "Overview", content: "A quick summary of your workspace: recent activity, open tasks and what changed since yesterday." },
  { value: "analytics", label: "Analytics", content: "Traffic, conversion and retention trends, broken down by channel and cohort." },
  { value: "reports", label: "Reports", content: "Scheduled and on-demand reports you can export or share with your team." },
  { value: "settings", label: "Settings", content: "Members, billing, integrations and workspace preferences." },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", line: "rgba(255,255,255,0.1)", track: "rgba(255,255,255,0.05)", thumb: "#F5F4F1", thumbText: "#0A0A0A", panelText: "rgba(245,244,241,0.7)", badge: "rgba(255,255,255,0.08)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", line: "rgba(10,10,10,0.1)", track: "rgba(10,10,10,0.05)", thumb: "#FFFFFF", thumbText: "#0A0A0A", panelText: "rgba(10,10,10,0.7)", badge: "rgba(10,10,10,0.06)" },
};

const SIZES: Record<TabsSize, { font: number; padX: number; padY: number; gap: number; icon: number }> = {
  sm: { font: 13, padX: 12, padY: 7, gap: 6, icon: 14 },
  md: { font: 14, padX: 16, padY: 9, gap: 7, icon: 16 },
  lg: { font: 15.5, padX: 20, padY: 11, gap: 8, icon: 18 },
};

export function Tabs({ items = DEFAULT_ITEMS, value, defaultValue, onValueChange, variant = "underline", size = "md", theme = "dark", accentColor = "#F2A841", fullWidth = false, className }: TabsProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const firstEnabled = items.find((i) => !i.disabled)?.value ?? items[0]?.value;
  const [internal, setInternal] = React.useState(defaultValue ?? firstEnabled);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const tabRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const activeItem = items.find((i) => i.value === current);
  const hasPanels = items.some((i) => i.content !== undefined);

  const select = (v: string) => {
    if (!isControlled) setInternal(v);
    onValueChange?.(v);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const enabled = items.filter((i) => !i.disabled);
    if (enabled.length === 0) return;
    const idx = enabled.findIndex((i) => i.value === current);
    let next: TabItem | undefined;
    if (e.key === "ArrowRight") next = enabled[(idx + 1) % enabled.length];
    else if (e.key === "ArrowLeft") next = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") next = enabled[0];
    else if (e.key === "End") next = enabled[enabled.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next.value);
    tabRefs.current[next.value]?.focus();
  };

  const listStyle: React.CSSProperties =
    variant === "underline"
      ? { borderBottom: `1px solid ${p.line}` }
      : variant === "segmented"
        ? { background: p.track, padding: 4, borderRadius: 14, border: `1px solid ${p.line}` }
        : { gap: 4 };

  return (
    <div className={cn(fullWidth ? "flex w-full flex-col" : "inline-flex flex-col", className)} style={{ fontFamily: "Inter, sans-serif" }}>
      <div role="tablist" aria-orientation="horizontal" onKeyDown={onKeyDown} className={cn("relative flex", fullWidth ? "w-full" : "w-fit max-w-full overflow-x-auto")} style={listStyle}>
        {items.map((item) => {
          const active = item.value === current;
          return (
            <button
              key={item.value}
              ref={(el) => {
                tabRefs.current[item.value] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${item.value}`}
              aria-selected={active}
              aria-controls={hasPanels ? `${uid}-panel-${item.value}` : undefined}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              onClick={() => !item.disabled && select(item.value)}
              className="relative flex shrink-0 items-center justify-center border-none bg-transparent font-semibold tracking-[-0.01em] whitespace-nowrap outline-none focus-visible:z-10"
              style={{
                flex: fullWidth ? 1 : undefined,
                gap: s.gap,
                padding: `${s.padY}px ${s.padX}px`,
                fontSize: s.font,
                color: variant === "segmented" && active ? p.thumbText : variant === "pill" && active ? accentColor : active ? p.text : p.muted,
                borderRadius: variant === "segmented" ? 10 : variant === "pill" ? 999 : 0,
                cursor: item.disabled ? "default" : "pointer",
                opacity: item.disabled ? 0.4 : 1,
                transition: "color 0.2s ease",
              }}
            >
              {active && variant === "underline" && (
                <motion.span layoutId={`${uid}-indicator`} className="absolute right-0 bottom-[-1px] left-0" style={{ height: 2, borderRadius: 2, background: accentColor }} transition={{ type: "spring", stiffness: 520, damping: 38 }} />
              )}
              {active && variant === "pill" && (
                <motion.span layoutId={`${uid}-indicator`} className="absolute inset-0" style={{ borderRadius: 999, background: `color-mix(in srgb, ${accentColor} 16%, transparent)`, border: `1px solid color-mix(in srgb, ${accentColor} 30%, transparent)` }} transition={{ type: "spring", stiffness: 520, damping: 38 }} />
              )}
              {active && variant === "segmented" && (
                <motion.span layoutId={`${uid}-indicator`} className="absolute inset-0" style={{ borderRadius: 10, background: p.thumb, boxShadow: "0 1px 4px rgba(0,0,0,0.25)" }} transition={{ type: "spring", stiffness: 520, damping: 38 }} />
              )}
              {item.icon && (
                <span className="relative flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.icon }}>
                  {item.icon}
                </span>
              )}
              <span className="relative">{item.label}</span>
              {item.count !== undefined && (
                <span className="relative rounded-full font-bold tabular-nums" style={{ padding: "0 6px", fontSize: s.font * 0.78, lineHeight: `${s.font * 1.25}px`, background: active && variant !== "segmented" ? `color-mix(in srgb, ${accentColor} 20%, transparent)` : variant === "segmented" && active ? "rgba(0,0,0,0.08)" : p.badge, color: active && variant !== "segmented" ? accentColor : "inherit" }}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {hasPanels && (
        <AnimatePresence mode="wait" initial={false}>
          {activeItem && (
            <motion.div
              key={activeItem.value}
              role="tabpanel"
              id={`${uid}-panel-${activeItem.value}`}
              aria-labelledby={`${uid}-tab-${activeItem.value}`}
              tabIndex={0}
              className="outline-none"
              style={{ paddingTop: 18, color: p.panelText, fontSize: s.font, lineHeight: 1.6 }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeItem.content}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
