"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ToolbarIconName =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "alignLeft"
  | "alignCenter"
  | "alignRight"
  | "link"
  | "code"
  | "list"
  | "undo"
  | "redo"
  | "image"
  | "share"
  | "comment"
  | "more";

export type ToolbarOrientation = "horizontal" | "vertical";
export type ToolbarVariant = "solid" | "floating" | "ghost";
export type ToolbarSize = "sm" | "md" | "lg";

interface ToolbarItemBase {
  id: string;
  label: string;
  icon?: ToolbarIconName | React.ReactNode;
  /** Visible text next to the icon. The label is still used for the tooltip and aria-label. */
  text?: string;
  /** Shown inside the tooltip, e.g. "⌘B". */
  shortcut?: string;
  disabled?: boolean;
}

export interface ToolbarButton extends ToolbarItemBase {
  type: "button";
  onClick?: () => void;
}

export interface ToolbarToggle extends ToolbarItemBase {
  type: "toggle";
  /** Toggles sharing a group behave like a radio set: exactly one stays pressed. */
  group?: string;
}

export interface ToolbarSeparator {
  type: "separator";
}

export type ToolbarEntry = ToolbarButton | ToolbarToggle | ToolbarSeparator;

export interface ToolbarProps {
  items: ToolbarEntry[];
  /** Ids of the pressed toggles (controlled). */
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  orientation?: ToolbarOrientation;
  variant?: ToolbarVariant;
  size?: ToolbarSize;
  radius?: number;
  showTooltips?: boolean;
  theme?: "dark" | "light";
  accentColor?: string;
  ariaLabel?: string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.1)", text: "rgba(245,244,241,0.62)", strong: "#F5F4F1", hover: "rgba(255,255,255,0.08)", sep: "rgba(255,255,255,0.12)", tipBg: "#F5F4F1", tipText: "#0A0A0A", tipMuted: "rgba(10,10,10,0.5)", shadow: "0 18px 44px rgba(0,0,0,0.5)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.1)", text: "rgba(10,10,10,0.6)", strong: "#0A0A0A", hover: "rgba(10,10,10,0.06)", sep: "rgba(10,10,10,0.12)", tipBg: "#0A0A0A", tipText: "#F5F4F1", tipMuted: "rgba(245,244,241,0.55)", shadow: "0 18px 44px rgba(10,10,10,0.14)" },
};

const SIZES: Record<ToolbarSize, { item: number; icon: number; font: number; pad: number; gap: number }> = {
  sm: { item: 30, icon: 15, font: 12, pad: 3, gap: 2 },
  md: { item: 36, icon: 17, font: 13, pad: 4, gap: 2 },
  lg: { item: 44, icon: 20, font: 14, pad: 5, gap: 3 },
};

const ICON_PATHS: Record<ToolbarIconName, string> = {
  bold: "M4.5 2.5h3.9a2.5 2.5 0 0 1 0 5H4.5z M4.5 7.5h4.5a2.75 2.75 0 0 1 0 5.5H4.5z",
  italic: "M10.5 2.5H6.5 M9.5 13.5h-4 M9.4 2.5 6.6 13.5",
  underline: "M4.5 2.5v5a3.5 3.5 0 0 0 7 0v-5 M3.5 13.5h9",
  strike: "M3 8h10 M10.6 4.8C10.3 3.5 9.3 2.8 8 2.8c-1.6 0-2.6.9-2.6 2.1 0 .9.5 1.4 1.6 2 M5.4 11.3c.3 1.3 1.3 1.9 2.6 1.9 1.6 0 2.6-.9 2.6-2.1 0-.5-.2-.9-.6-1.2",
  alignLeft: "M2.5 3.5h11 M2.5 6.5h7 M2.5 9.5h11 M2.5 12.5h7",
  alignCenter: "M2.5 3.5h11 M4.5 6.5h7 M2.5 9.5h11 M4.5 12.5h7",
  alignRight: "M2.5 3.5h11 M6.5 6.5h7 M2.5 9.5h11 M6.5 12.5h7",
  link: "M6.8 9.2a2.6 2.6 0 0 0 3.7 0l2-2a2.6 2.6 0 0 0-3.7-3.7l-.6.6 M9.2 6.8a2.6 2.6 0 0 0-3.7 0l-2 2a2.6 2.6 0 0 0 3.7 3.7l.6-.6",
  code: "M5.5 4.5 2 8l3.5 3.5 M10.5 4.5 14 8l-3.5 3.5",
  list: "M6 4h7.5 M6 8h7.5 M6 12h7.5 M2.5 4h.01 M2.5 8h.01 M2.5 12h.01",
  undo: "M3.5 6.5h6a3.5 3.5 0 0 1 0 7H6 M6 3.5 3 6.5l3 3",
  redo: "M12.5 6.5h-6a3.5 3.5 0 0 0 0 7H10 M10 3.5l3 3-3 3",
  image: "M4.5 3h7A2 2 0 0 1 13.5 5v6a2 2 0 0 1-2 2h-7A2 2 0 0 1 2.5 11V5A2 2 0 0 1 4.5 3z M2.7 11.2l3.3-3 2.8 2.4 1.9-1.5 2.8 2.2 M6 6.2h.01",
  share: "M8 10V2.5 M5 5.2 8 2.5l3 2.7 M3.5 8.5v3.5a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8.5",
  comment: "M3.5 3.5h9a1 1 0 0 1 1 1v5.5a1 1 0 0 1-1 1H8.5L5.5 13.5V11h-2a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z",
  more: "M3.5 8h.01 M8 8h.01 M12.5 8h.01",
};

export function ToolbarIcon({ name, size = 16 }: { name: ToolbarIconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}

type PalettePart = (typeof PALETTES)["dark"];

function isActionable(entry: ToolbarEntry): entry is ToolbarButton | ToolbarToggle {
  return entry.type !== "separator";
}

export function Toolbar({
  items,
  value,
  defaultValue,
  onValueChange,
  orientation = "horizontal",
  variant = "solid",
  size = "md",
  radius = 12,
  showTooltips = true,
  theme = "dark",
  accentColor = "#F2A841",
  ariaLabel = "Toolbar",
  className,
}: ToolbarProps) {
  const p: PalettePart = PALETTES[theme];
  const s = SIZES[size];
  const vertical = orientation === "vertical";
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const tipTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const [inner, setInner] = React.useState<string[]>(defaultValue ?? []);
  const pressedIds = value ?? inner;
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [hoverId, setHoverId] = React.useState<string | null>(null);
  const [tipId, setTipId] = React.useState<string | null>(null);

  const actionable = items.filter(isActionable);
  const enabled = actionable.filter((i) => !i.disabled);
  const rovingId = activeId && enabled.some((i) => i.id === activeId) ? activeId : (enabled[0]?.id ?? null);

  React.useEffect(
    () => () => {
      if (tipTimer.current) clearTimeout(tipTimer.current);
    },
    [],
  );

  const commit = (next: string[]) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };

  const press = (item: ToolbarButton | ToolbarToggle) => {
    if (item.type === "button") {
      item.onClick?.();
      return;
    }
    const isOn = pressedIds.includes(item.id);
    if (item.group) {
      if (isOn) return;
      const siblings = actionable.filter((i): i is ToolbarToggle => i.type === "toggle" && i.group === item.group).map((i) => i.id);
      commit([...pressedIds.filter((id) => !siblings.includes(id)), item.id]);
    } else {
      commit(isOn ? pressedIds.filter((id) => id !== item.id) : [...pressedIds, item.id]);
    }
  };

  const showTip = (id: string, delay: number) => {
    if (!showTooltips) return;
    if (tipTimer.current) clearTimeout(tipTimer.current);
    if (delay === 0) setTipId(id);
    else tipTimer.current = setTimeout(() => setTipId(id), delay);
  };

  const hideTip = () => {
    if (tipTimer.current) clearTimeout(tipTimer.current);
    setTipId(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const next = vertical ? "ArrowDown" : "ArrowRight";
    const prev = vertical ? "ArrowUp" : "ArrowLeft";
    if (e.key !== next && e.key !== prev && e.key !== "Home" && e.key !== "End") return;
    const nodes = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>("[data-toolbar-item]:not([disabled])") ?? []);
    if (nodes.length === 0) return;
    const idx = nodes.findIndex((n) => n === document.activeElement);
    let target = idx;
    if (e.key === "Home") target = 0;
    else if (e.key === "End") target = nodes.length - 1;
    else if (e.key === next) target = (idx + 1) % nodes.length;
    else target = (idx - 1 + nodes.length) % nodes.length;
    e.preventDefault();
    nodes[target]?.focus();
  };

  const surface: React.CSSProperties =
    variant === "ghost"
      ? { background: "transparent" }
      : variant === "floating"
        ? { background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow }
        : { background: p.bg, border: `1px solid ${p.border}` };

  const itemRadius = Math.max(4, radius - s.pad - 1);

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      onKeyDown={onKeyDown}
      onPointerLeave={() => {
        setHoverId(null);
        hideTip();
      }}
      className={cn("inline-flex max-w-full flex-wrap items-center", vertical ? "flex-col" : "flex-row", className)}
      style={{ ...surface, gap: s.gap, padding: s.pad, borderRadius: radius, fontFamily: "Inter, sans-serif" }}
    >
      {items.map((entry, index) => {
        if (entry.type === "separator") {
          return (
            <div
              key={`sep-${index}`}
              role="separator"
              aria-orientation={vertical ? "horizontal" : "vertical"}
              style={vertical ? { height: 1, width: s.item * 0.6, margin: `${s.gap + 2}px 0`, background: p.sep } : { width: 1, height: s.item * 0.55, margin: `0 ${s.gap + 2}px`, background: p.sep }}
            />
          );
        }
        const pressed = entry.type === "toggle" && pressedIds.includes(entry.id);
        const icon = typeof entry.icon === "string" && entry.icon in ICON_PATHS ? <ToolbarIcon name={entry.icon as ToolbarIconName} size={s.icon} /> : entry.icon;
        const hovered = hoverId === entry.id && !entry.disabled;
        return (
          <div key={entry.id} className="relative" onPointerEnter={() => { if (!entry.disabled) { setHoverId(entry.id); showTip(entry.id, 380); } }}>
            <motion.button
              type="button"
              data-toolbar-item=""
              disabled={entry.disabled}
              aria-label={entry.label}
              aria-pressed={entry.type === "toggle" ? pressed : undefined}
              tabIndex={rovingId === entry.id ? 0 : -1}
              onFocus={(e) => {
                setActiveId(entry.id);
                if (e.currentTarget.matches(":focus-visible")) showTip(entry.id, 0);
              }}
              onBlur={hideTip}
              onClick={() => press(entry)}
              whileTap={entry.disabled ? undefined : { scale: 0.92 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="relative flex cursor-pointer items-center justify-center border-none bg-transparent outline-none focus-visible:ring-2 disabled:cursor-not-allowed"
              style={{
                minWidth: s.item,
                height: s.item,
                padding: entry.text ? `0 ${Math.round(s.item * 0.3)}px` : 0,
                gap: 6,
                borderRadius: itemRadius,
                fontSize: s.font,
                fontWeight: 500,
                fontFamily: "inherit",
                opacity: entry.disabled ? 0.35 : 1,
                color: pressed ? accentColor : hovered ? p.strong : p.text,
                background: pressed ? `color-mix(in srgb, ${accentColor} 16%, transparent)` : "transparent",
                transition: "color 0.15s, background 0.15s",
                ["--tw-ring-color" as string]: accentColor,
              }}
            >
              {hovered && !pressed && (
                <motion.span
                  layoutId={`${uid}-hl`}
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{ borderRadius: itemRadius, background: p.hover }}
                  transition={{ type: "spring", stiffness: 520, damping: 38 }}
                />
              )}
              <span className="relative flex items-center" style={{ gap: 6 }}>
                {icon}
                {entry.text && <span>{entry.text}</span>}
              </span>
            </motion.button>

            <AnimatePresence>
              {tipId === entry.id && (
                <div
                  aria-hidden="true"
                  className={cn("pointer-events-none absolute z-50 flex", vertical ? "inset-y-0 left-full items-center" : "inset-x-0 top-full justify-center")}
                  style={vertical ? { paddingLeft: 10 } : { paddingTop: 10 }}
                >
                  <motion.div
                    initial={vertical ? { opacity: 0, x: -4 } : { opacity: 0, y: -4 }}
                    animate={vertical ? { opacity: 1, x: 0 } : { opacity: 1, y: 0 }}
                    exit={{ opacity: 0, transition: { duration: 0.1 } }}
                    transition={{ duration: 0.14, ease: "easeOut" }}
                    className="flex items-center whitespace-nowrap"
                    style={{ gap: 8, padding: "5px 9px", borderRadius: 8, background: p.tipBg, color: p.tipText, fontSize: 12, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
                  >
                    {entry.label}
                    {entry.shortcut && <span style={{ color: p.tipMuted, fontSize: 11 }}>{entry.shortcut}</span>}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
