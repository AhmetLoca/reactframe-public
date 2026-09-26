"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DateRange {
  from?: Date;
  to?: Date;
}

export type DatePickerSize = "sm" | "md" | "lg";

export interface DatePickerProps {
  mode?: "single" | "range";
  value?: Date | null;
  defaultValue?: Date | null;
  onValueChange?: (value: Date | null) => void;
  range?: DateRange;
  defaultRange?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  minDate?: Date;
  maxDate?: Date;
  isDateDisabled?: (date: Date) => boolean;
  weekStartsOn?: 0 | 1;
  locale?: string;
  clearable?: boolean;
  closeOnSelect?: boolean;
  size?: DatePickerSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.08)", band: "rgba(255,255,255,0.09)", sel: "#F5F4F1", selText: "#0A0A0A", today: "rgba(245,244,241,0.55)", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.14)", hover: "rgba(10,10,10,0.06)", band: "rgba(10,10,10,0.07)", sel: "#0A0A0A", selText: "#FFFFFF", today: "rgba(10,10,10,0.5)", shadow: "0 20px 50px rgba(0,0,0,0.18)" },
};

const SIZES: Record<DatePickerSize, { font: number; height: number; padX: number; radius: number; cell: number }> = {
  sm: { font: 13, height: 36, padX: 12, radius: 11, cell: 34 },
  md: { font: 14.5, height: 44, padX: 14, radius: 13, cell: 38 },
  lg: { font: 16, height: 52, padX: 16, radius: 15, cell: 42 },
};

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const addMonths = (d: Date, n: number) => {
  const target = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate();
  return new Date(target.getFullYear(), target.getMonth(), Math.min(d.getDate(), last));
};
const sameDay = (a?: Date | null, b?: Date | null) => Boolean(a && b) && a!.getFullYear() === b!.getFullYear() && a!.getMonth() === b!.getMonth() && a!.getDate() === b!.getDate();
const sameMonth = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
const dayKey = (d: Date) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;

function CalendarIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2.5" y="3.5" width="11" height="10" rx="2" />
      <path d="M2.5 7h11M5.5 2v3M10.5 2v3" />
    </svg>
  );
}

function Chevron({ dir, size }: { dir: "left" | "right"; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={dir === "left" ? "M10 3.5L5.5 8L10 12.5" : "M6 3.5L10.5 8L6 12.5"} />
    </svg>
  );
}

export function DatePicker({
  mode = "single",
  value,
  defaultValue = null,
  onValueChange,
  range,
  defaultRange,
  onRangeChange,
  placeholder,
  label,
  helperText,
  minDate,
  maxDate,
  isDateDisabled,
  weekStartsOn = 0,
  locale = "en-US",
  clearable = true,
  closeOnSelect = true,
  size = "md",
  theme = "dark",
  width = 320,
  disabled = false,
  className,
}: DatePickerProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const isRange = mode === "range";
  const [internalDate, setInternalDate] = React.useState<Date | null>(defaultValue);
  const [internalRange, setInternalRange] = React.useState<DateRange>(defaultRange ?? {});
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focusDate, setFocusDate] = React.useState<Date>(() => startOfDay(defaultValue ?? defaultRange?.from ?? new Date()));
  const [viewMonth, setViewMonth] = React.useState<Date>(() => new Date(focusDate.getFullYear(), focusDate.getMonth(), 1));
  const [direction, setDirection] = React.useState(1);
  const [hoverDate, setHoverDate] = React.useState<Date | null>(null);
  const isControlledDate = value !== undefined;
  const isControlledRange = range !== undefined;
  const date = isControlledDate ? value : internalDate;
  const rng = isControlledRange ? range : internalRange;

  const fmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }), [locale]);
  const monthFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }), [locale]);
  const weekdayFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);
  const longFmt = React.useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: "full" }), [locale]);

  const outOfRange = (d: Date) => Boolean((minDate && startOfDay(d) < startOfDay(minDate)) || (maxDate && startOfDay(d) > startOfDay(maxDate)) || isDateDisabled?.(d));

  const weekdays = Array.from({ length: 7 }, (_, i) => {
    const base = new Date(2023, 0, 1 + ((i + weekStartsOn) % 7));
    return weekdayFmt.format(base).slice(0, 2);
  });

  const days = React.useMemo(() => {
    const first = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1);
    const offset = (first.getDay() - weekStartsOn + 7) % 7;
    const start = addDays(first, -offset);
    return Array.from({ length: 42 }, (_, i) => addDays(start, i));
  }, [viewMonth, weekStartsOn]);

  const goMonth = (n: number) => {
    setDirection(n);
    setViewMonth((m) => addMonths(m, n));
  };

  const moveFocus = (next: Date) => {
    setFocusDate(next);
    if (!sameMonth(next, viewMonth)) {
      setDirection(next > viewMonth ? 1 : -1);
      setViewMonth(new Date(next.getFullYear(), next.getMonth(), 1));
    }
    requestAnimationFrame(() => gridRef.current?.querySelector<HTMLElement>(`[data-day="${dayKey(next)}"]`)?.focus());
  };

  const openMenu = () => {
    if (disabled) return;
    const base = startOfDay((isRange ? rng.from : date) ?? new Date());
    setFocusDate(base);
    setViewMonth(new Date(base.getFullYear(), base.getMonth(), 1));
    setOpen(true);
  };

  const closeMenu = (returnFocus = true) => {
    setOpen(false);
    setHoverDate(null);
    if (returnFocus) triggerRef.current?.focus();
  };

  const pick = (d: Date) => {
    if (outOfRange(d)) return;
    const day = startOfDay(d);
    if (!isRange) {
      if (!isControlledDate) setInternalDate(day);
      onValueChange?.(day);
      if (closeOnSelect) closeMenu();
      return;
    }
    let next: DateRange;
    if (!rng.from || (rng.from && rng.to)) next = { from: day };
    else next = day < rng.from ? { from: day, to: rng.from } : { from: rng.from, to: day };
    if (!isControlledRange) setInternalRange(next);
    onRangeChange?.(next);
    if (next.from && next.to && closeOnSelect) closeMenu();
  };

  const clear = () => {
    if (isRange) {
      if (!isControlledRange) setInternalRange({});
      onRangeChange?.({});
    } else {
      if (!isControlledDate) setInternalDate(null);
      onValueChange?.(null);
    }
  };

  const onGridKeyDown = (e: React.KeyboardEvent) => {
    let next: Date | null = null;
    const d = focusDate;
    if (e.key === "ArrowLeft") next = addDays(d, -1);
    else if (e.key === "ArrowRight") next = addDays(d, 1);
    else if (e.key === "ArrowUp") next = addDays(d, -7);
    else if (e.key === "ArrowDown") next = addDays(d, 7);
    else if (e.key === "PageUp") next = addMonths(d, e.shiftKey ? -12 : -1);
    else if (e.key === "PageDown") next = addMonths(d, e.shiftKey ? 12 : 1);
    else if (e.key === "Home") next = addDays(d, -((d.getDay() - weekStartsOn + 7) % 7));
    else if (e.key === "End") next = addDays(d, 6 - ((d.getDay() - weekStartsOn + 7) % 7));
    if (next) {
      e.preventDefault();
      moveFocus(next);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setHoverDate(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setHoverDate(null);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => gridRef.current?.querySelector<HTMLElement>(`[data-day="${dayKey(focusDate)}"]`)?.focus(), 40);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const today = startOfDay(new Date());
  const rangeEnd = isRange ? (rng.to ?? (rng.from && hoverDate ? hoverDate : undefined)) : undefined;
  const lo = isRange && rng.from && rangeEnd ? (rng.from < rangeEnd ? rng.from : rangeEnd) : undefined;
  const hi = isRange && rng.from && rangeEnd ? (rng.from < rangeEnd ? rangeEnd : rng.from) : undefined;

  const hasValue = isRange ? Boolean(rng.from) : Boolean(date);
  const text = isRange ? (rng.from ? `${fmt.format(rng.from)}${rng.to ? ` – ${fmt.format(rng.to)}` : " – …"}` : "") : date ? fmt.format(date) : "";
  const shownPlaceholder = placeholder ?? (isRange ? "Pick a date range" : "Pick a date");
  const borderColor = open ? p.focus : hovered ? p.borderHover : p.border;
  const cellPad = 2;

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
          style={{ height: s.height, gap: 10, padding: `0 ${s.padX}px`, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: open ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", color: hasValue ? p.text : p.muted, fontSize: s.font, fontWeight: 500, cursor: disabled ? "default" : "pointer", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
          <span className="flex shrink-0" style={{ color: p.muted }}>
            <CalendarIcon size={s.font + 2} />
          </span>
          <span className="min-w-0 flex-1 truncate">{hasValue ? text : shownPlaceholder}</span>
          {clearable && hasValue && !disabled && (
            <span
              role="button"
              tabIndex={-1}
              aria-label="Clear date"
              onClick={(e) => {
                e.stopPropagation();
                clear();
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
              aria-label="Choose date"
              className="absolute left-0 z-50"
              style={{ top: "calc(100% + 8px)", padding: 14, borderRadius: s.radius + 6, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top left", width: s.cell * 7 + 28 + cellPad * 14 }}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
                <button type="button" aria-label="Previous month" onClick={() => goMonth(-1)} className="flex cursor-pointer items-center justify-center rounded-lg border-none bg-transparent outline-none focus-visible:ring-2" style={{ width: 30, height: 30, color: p.muted, ["--tw-ring-color" as string]: p.focus }} onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <Chevron dir="left" size={16} />
                </button>
                <div className="relative overflow-hidden text-center" style={{ height: 22, minWidth: 140 }} aria-live="polite">
                  <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div key={`${viewMonth.getFullYear()}-${viewMonth.getMonth()}`} custom={direction} initial={{ opacity: 0, y: direction * 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: direction * -10 }} transition={{ duration: 0.18 }} className="font-semibold" style={{ color: p.text, fontSize: s.font, lineHeight: "22px" }}>
                      {monthFmt.format(viewMonth)}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <button type="button" aria-label="Next month" onClick={() => goMonth(1)} className="flex cursor-pointer items-center justify-center rounded-lg border-none bg-transparent outline-none focus-visible:ring-2" style={{ width: 30, height: 30, color: p.muted, ["--tw-ring-color" as string]: p.focus }} onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)} onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <Chevron dir="right" size={16} />
                </button>
              </div>

              <div className="grid" style={{ gridTemplateColumns: `repeat(7, ${s.cell + cellPad * 2}px)` }} aria-hidden="true">
                {weekdays.map((w, i) => (
                  <div key={i} className="text-center font-medium" style={{ height: 26, lineHeight: "26px", color: p.faint, fontSize: s.font - 2.5 }}>
                    {w}
                  </div>
                ))}
              </div>

              <div ref={gridRef} role="grid" onKeyDown={onGridKeyDown} className="grid" style={{ gridTemplateColumns: `repeat(7, ${s.cell + cellPad * 2}px)` }}>
                {days.map((d) => {
                  const inMonth = sameMonth(d, viewMonth);
                  const dis = outOfRange(d);
                  const isSel = isRange ? sameDay(d, rng.from) || sameDay(d, rng.to) : sameDay(d, date);
                  const inBand = Boolean(lo && hi && d > lo && d < hi);
                  const isEdgeLo = Boolean(lo && sameDay(d, lo) && hi && !sameDay(lo, hi));
                  const isEdgeHi = Boolean(hi && sameDay(d, hi) && lo && !sameDay(lo, hi));
                  const isToday = sameDay(d, today);
                  const isFocus = sameDay(d, focusDate);
                  return (
                    <div key={dayKey(d)} role="gridcell" aria-selected={isSel || undefined} className="relative flex items-center justify-center" style={{ height: s.cell + cellPad * 2 }}>
                      {(inBand || isEdgeLo || isEdgeHi) && <span aria-hidden="true" className="absolute" style={{ top: cellPad, bottom: cellPad, left: isEdgeLo ? "50%" : 0, right: isEdgeHi ? "50%" : 0, background: p.band }} />}
                      <button
                        type="button"
                        data-day={dayKey(d)}
                        tabIndex={isFocus ? 0 : -1}
                        disabled={dis}
                        aria-label={longFmt.format(d)}
                        aria-current={isToday ? "date" : undefined}
                        onClick={() => pick(d)}
                        onFocus={() => setFocusDate(d)}
                        onMouseEnter={() => isRange && rng.from && !rng.to && setHoverDate(d)}
                        className="relative flex items-center justify-center rounded-full border-none outline-none focus-visible:ring-2"
                        style={{ width: s.cell, height: s.cell, fontSize: s.font - 1, fontWeight: isSel ? 700 : 500, background: isSel ? p.sel : "transparent", color: isSel ? p.selText : inMonth ? p.text : p.faint, opacity: dis ? 0.3 : 1, cursor: dis ? "default" : "pointer", boxShadow: isToday && !isSel ? `inset 0 0 0 1.5px ${p.today}` : undefined, transition: "background 0.12s ease", ["--tw-ring-color" as string]: p.focus }}
                        onMouseOver={(e) => !isSel && !dis && (e.currentTarget.style.background = p.hover)}
                        onMouseOut={(e) => !isSel && (e.currentTarget.style.background = "transparent")}
                      >
                        {d.getDate()}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between" style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${p.menuBorder}` }}>
                <button
                  type="button"
                  onClick={() => {
                    setDirection(today > viewMonth ? 1 : -1);
                    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
                    moveFocus(today);
                  }}
                  className="cursor-pointer border-none bg-transparent p-0 font-semibold outline-none hover:underline"
                  style={{ color: p.text, fontSize: s.font - 1.5 }}
                >
                  Today
                </button>
                {clearable && hasValue && (
                  <button type="button" onClick={clear} className="cursor-pointer border-none bg-transparent p-0 font-medium outline-none hover:underline" style={{ color: p.muted, fontSize: s.font - 1.5 }}>
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
