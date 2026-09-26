"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TimePickerSize = "sm" | "md" | "lg";

export interface TimePickerProps {
  /** 24-hour "HH:mm", e.g. "09:30" or "17:45". */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  hourCycle?: 12 | 24;
  minuteStep?: number;
  /** Earliest selectable time, "HH:mm". */
  minTime?: string;
  /** Latest selectable time, "HH:mm". */
  maxTime?: string;
  placeholder?: string;
  label?: string;
  helperText?: string;
  clearable?: boolean;
  size?: TimePickerSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.08)", sel: "#F5F4F1", selText: "#0A0A0A", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.14)", hover: "rgba(10,10,10,0.06)", sel: "#0A0A0A", selText: "#FFFFFF", shadow: "0 20px 50px rgba(0,0,0,0.18)" },
};

const SIZES: Record<TimePickerSize, { font: number; height: number; padX: number; radius: number; cell: number; col: number }> = {
  sm: { font: 13, height: 36, padX: 12, radius: 11, cell: 30, col: 46 },
  md: { font: 14.5, height: 44, padX: 14, radius: 13, cell: 34, col: 52 },
  lg: { font: 16, height: 52, padX: 16, radius: 15, cell: 38, col: 58 },
};

// Rows visible in each column; the selected row scrolls to the middle one.
const VISIBLE_ROWS = 5;

const pad = (n: number) => String(n).padStart(2, "0");

/** "HH:mm" -> minutes since midnight, or null if it isn't a valid time. */
function parseTime(value?: string | null): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value ?? "");
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  return h < 24 && min < 60 ? h * 60 + min : null;
}

const toValue = (t: number) => `${pad(Math.floor(t / 60))}:${pad(t % 60)}`;

function formatTime(t: number, hourCycle: 12 | 24) {
  const h = Math.floor(t / 60);
  const m = t % 60;
  if (hourCycle === 24) return `${pad(h)}:${pad(m)}`;
  return `${h % 12 || 12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`;
}

function ClockIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="8" cy="8" r="5.75" />
      <path d="M8 5v3.25l2 1.25" />
    </svg>
  );
}

interface ColumnItem {
  key: string;
  label: string;
  disabled: boolean;
}

interface ColumnProps {
  id: string;
  label: string;
  /** Small caption above the column; the AM/PM column has none. */
  heading?: string;
  items: ColumnItem[];
  selectedKey: string | null;
  onSelect: (key: string) => void;
  onEnter: () => void;
  columnRef: (el: HTMLDivElement | null) => void;
  p: (typeof PALETTES)["dark"];
  s: (typeof SIZES)["md"];
}

// One scrollable listbox (hours, minutes or AM/PM). The selected row gets a filled pill that slides
// between rows (shared layoutId), and ArrowUp/ArrowDown step through the enabled rows.
function Column({ id, label, heading = label, items, selectedKey, onSelect, onEnter, columnRef, p, s }: ColumnProps) {
  const enabled = items.filter((it) => !it.disabled);
  const step = (dir: 1 | -1 | "first" | "last") => {
    if (enabled.length === 0) return;
    if (dir === "first") return onSelect(enabled[0].key);
    if (dir === "last") return onSelect(enabled[enabled.length - 1].key);
    const i = enabled.findIndex((it) => it.key === selectedKey);
    const next = i === -1 ? (dir === 1 ? 0 : enabled.length - 1) : (i + dir + enabled.length) % enabled.length;
    onSelect(enabled[next].key);
  };

  return (
    <div className="flex flex-col items-center" style={{ width: s.col }}>
      <div className="font-medium" style={{ height: 24, lineHeight: "24px", color: p.faint, fontSize: s.font - 2.5 }} aria-hidden="true">
        {heading}
      </div>
      <div
        ref={columnRef}
        role="listbox"
        aria-label={label}
        tabIndex={0}
        aria-activedescendant={selectedKey ? `${id}-${selectedKey}` : undefined}
        onKeyDown={(e) => {
          const keys: Record<string, 1 | -1 | "first" | "last"> = { ArrowDown: 1, ArrowUp: -1, Home: "first", End: "last" };
          if (e.key in keys) {
            e.preventDefault();
            step(keys[e.key]);
          } else if (e.key === "Enter") {
            e.preventDefault();
            onEnter();
          }
        }}
        className="group/col relative w-full overflow-y-auto outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{
          height: s.cell * VISIBLE_ROWS,
          paddingBlock: s.cell * Math.floor(VISIBLE_ROWS / 2),
          maskImage: "linear-gradient(to bottom, transparent, #000 32%, #000 68%, transparent)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent, #000 32%, #000 68%, transparent)",
          // The fade mask would clip a ring drawn around the column, so keyboard focus rings the
          // selected pill instead (see the pill below).
          ["--tp-ring" as string]: p.focus,
          ["--tp-gap" as string]: p.menuBg,
        }}
      >
        {items.map((it) => {
          const isSel = it.key === selectedKey;
          return (
            <div
              key={it.key}
              id={`${id}-${it.key}`}
              role="option"
              aria-selected={isSel}
              aria-disabled={it.disabled || undefined}
              onClick={() => !it.disabled && onSelect(it.key)}
              className="relative flex items-center justify-center rounded-full"
              style={{ height: s.cell, margin: "0 4px", fontSize: s.font - 0.5, fontWeight: isSel ? 700 : 500, fontVariantNumeric: "tabular-nums", color: isSel ? p.selText : p.text, opacity: it.disabled ? 0.3 : 1, cursor: it.disabled ? "default" : "pointer", transition: "color 0.15s ease, background 0.12s ease" }}
              onMouseOver={(e) => !isSel && !it.disabled && (e.currentTarget.style.background = p.hover)}
              onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {isSel && <motion.span layoutId={`${id}-pill`} aria-hidden="true" className="absolute inset-0 rounded-full group-focus-visible/col:[box-shadow:0_0_0_2px_var(--tp-gap),0_0_0_3.5px_var(--tp-ring)]" style={{ background: p.sel }} transition={{ type: "spring", stiffness: 520, damping: 38 }} />}
              <span className="relative">{it.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimePicker({
  value,
  defaultValue = null,
  onValueChange,
  hourCycle = 12,
  minuteStep = 5,
  minTime,
  maxTime,
  placeholder = "Pick a time",
  label,
  helperText,
  clearable = true,
  size = "md",
  theme = "dark",
  width = 240,
  disabled = false,
  className,
}: TimePickerProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const columnRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const isControlled = value !== undefined;
  const time = parseTime(isControlled ? value : internal);

  const lo = parseTime(minTime) ?? 0;
  const hi = parseTime(maxTime) ?? 24 * 60 - 1;
  const step = Math.min(Math.max(1, Math.round(minuteStep)), 30);
  const allowed = (t: number) => t >= lo && t <= hi;

  const minutes = React.useMemo(() => {
    const list = Array.from({ length: Math.ceil(60 / step) }, (_, i) => i * step);
    // A controlled value off the step grid (say 09:07) still gets its own row.
    if (time !== null && !list.includes(time % 60)) list.push(time % 60);
    return list.sort((a, b) => a - b);
  }, [step, time]);

  const hour24 = time === null ? null : Math.floor(time / 60);
  const minute = time === null ? null : time % 60;
  const isPm = hour24 !== null && hour24 >= 12;

  const commit = (t: number | null) => {
    const next = t === null ? null : toValue(t);
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  // Keep the chosen hour/minute when possible; if that lands outside min/max, take the closest
  // allowed minute in the same hour instead.
  const setTime = (h: number, m: number) => {
    let t = h * 60 + m;
    if (!allowed(t)) {
      const inHour = minutes.map((mm) => h * 60 + mm).filter(allowed);
      if (inHour.length === 0) return;
      t = inHour.reduce((best, c) => (Math.abs(c - t) < Math.abs(best - t) ? c : best));
    }
    commit(t);
  };

  const hourAllowed = (h: number) => minutes.some((mm) => allowed(h * 60 + mm));
  const hourValues = hourCycle === 24 ? Array.from({ length: 24 }, (_, i) => i) : [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const to24 = (h: number, pm: boolean) => (hourCycle === 24 ? h : (h % 12) + (pm ? 12 : 0));

  const hourItems: ColumnItem[] = hourValues.map((h) => ({ key: String(h), label: hourCycle === 24 ? pad(h) : String(h), disabled: !hourAllowed(to24(h, isPm)) }));
  const minuteItems: ColumnItem[] = minutes.map((mm) => ({ key: String(mm), label: pad(mm), disabled: !allowed((hour24 ?? Math.floor(lo / 60)) * 60 + mm) }));
  const periodItems: ColumnItem[] = ["AM", "PM"].map((k) => ({ key: k, label: k, disabled: !hourValues.some((h) => hourAllowed(to24(h, k === "PM"))) }));

  const firstAllowedHour = () => hourValues.map((h) => to24(h, isPm)).find(hourAllowed) ?? Math.floor(lo / 60);

  const pickHour = (key: string) => setTime(to24(Number(key), isPm), minute ?? 0);
  const pickMinute = (key: string) => setTime(hour24 ?? firstAllowedHour(), Number(key));
  const pickPeriod = (key: string) => {
    const pm = key === "PM";
    const h = hour24 === null ? (pm ? 12 : 0) : (hour24 % 12) + (pm ? 12 : 0);
    if (hourAllowed(h)) return setTime(h, minute ?? 0);
    const first = hourValues.map((hv) => to24(hv, pm)).find(hourAllowed);
    if (first !== undefined) setTime(first, minute ?? 0);
  };

  const now = () => {
    const d = new Date();
    const t = d.getHours() * 60 + Math.floor(d.getMinutes() / step) * step;
    commit(Math.min(Math.max(t, lo), hi));
  };

  const openedAt = React.useRef(0);
  const openMenu = () => {
    if (disabled) return;
    openedAt.current = performance.now();
    setOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const selectedKeys = [hour24 === null ? null : String(hourCycle === 24 ? hour24 : hour24 % 12 || 12), minute === null ? null : String(minute), hour24 === null ? null : isPm ? "PM" : "AM"];

  // Centre each column on its selected row: instantly when the menu opens, smoothly afterwards.
  React.useEffect(() => {
    if (!open) return;
    const instant = performance.now() - openedAt.current < 80;
    columnRefs.current.forEach((col, i) => {
      const key = selectedKeys[i];
      if (!col || key === null) return;
      const row = col.querySelector<HTMLElement>(`[id="${uid}-c${i}-${key}"]`);
      if (!row) return;
      const top = row.offsetTop - (col.clientHeight - row.offsetHeight) / 2;
      col.scrollTo({ top, behavior: instant ? "auto" : "smooth" });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, time, hourCycle]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => columnRefs.current[0]?.focus({ preventScroll: true }), 40);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const hasValue = time !== null;
  const borderColor = open ? p.focus : hovered ? p.borderHover : p.border;
  const columns = hourCycle === 12 ? 3 : 2;

  return (
    <div ref={rootRef} className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={label ? `${uid}-label` : undefined}
          disabled={disabled}
          onClick={() => (open ? closeMenu(false) : openMenu())}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex w-full items-center text-left outline-none"
          style={{ height: s.height, gap: 10, padding: `0 ${s.padX}px`, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: open ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", color: hasValue ? p.text : p.muted, fontSize: s.font, fontWeight: 500, fontVariantNumeric: "tabular-nums", cursor: disabled ? "default" : "pointer", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
          <span className="flex shrink-0" style={{ color: p.muted }}>
            <ClockIcon size={s.font + 2} />
          </span>
          <span className="min-w-0 flex-1 truncate">{hasValue ? formatTime(time, hourCycle) : placeholder}</span>
          {clearable && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear time"
              onClick={(e) => {
                e.stopPropagation();
                commit(null);
              }}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full"
              style={{ width: 20, height: 20, background: p.hover, color: p.muted }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
          )}
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="Choose time"
              className="absolute left-0 z-50"
              style={{ top: "calc(100% + 8px)", padding: 12, borderRadius: s.radius + 6, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top left" }}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex" style={{ gap: 4, width: columns * s.col + (columns - 1) * 4 }}>
                <Column id={`${uid}-c0`} label="Hour" items={hourItems} selectedKey={selectedKeys[0]} onSelect={pickHour} onEnter={() => closeMenu()} columnRef={(el) => (columnRefs.current[0] = el)} p={p} s={s} />
                <Column id={`${uid}-c1`} label="Min" items={minuteItems} selectedKey={selectedKeys[1]} onSelect={pickMinute} onEnter={() => closeMenu()} columnRef={(el) => (columnRefs.current[1] = el)} p={p} s={s} />
                {hourCycle === 12 && <Column id={`${uid}-c2`} label="AM or PM" heading="" items={periodItems} selectedKey={selectedKeys[2]} onSelect={pickPeriod} onEnter={() => closeMenu()} columnRef={(el) => (columnRefs.current[2] = el)} p={p} s={s} />}
              </div>

              <div className="flex items-center justify-between" style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${p.menuBorder}` }}>
                <button type="button" onClick={now} className="cursor-pointer border-none bg-transparent p-0 font-semibold outline-none hover:underline" style={{ color: p.text, fontSize: s.font - 1.5 }}>
                  Now
                </button>
                {clearable && hasValue && (
                  <button type="button" onClick={() => commit(null)} className="cursor-pointer border-none bg-transparent p-0 font-medium outline-none hover:underline" style={{ color: p.muted, fontSize: s.font - 1.5 }}>
                    Clear
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {helperText && <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>{helperText}</span>}
    </div>
  );
}
