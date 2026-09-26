"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CurrencyInputSize = "sm" | "md" | "lg";

export interface CurrencyInputProps {
  /** The amount as a number, or null when empty. */
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null, currency: string) => void;
  /** ISO 4217 code, controlled. */
  currency?: string;
  defaultCurrency?: string;
  onCurrencyChange?: (currency: string) => void;
  /** Codes offered in the menu; pass a single code (or showCurrencySelect={false}) for a fixed currency. */
  currencies?: string[];
  showCurrencySelect?: boolean;
  /** Controls the separators and names, e.g. "en-US" (1,234.56) or "de-DE" (1.234,56). */
  locale?: string;
  min?: number;
  max?: number;
  /** ArrowUp/ArrowDown step; Shift multiplies it by 10. */
  step?: number;
  allowNegative?: boolean;
  label?: string;
  placeholder?: string;
  helperText?: string;
  size?: CurrencyInputSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_CURRENCIES = ["USD", "EUR", "GBP", "TRY", "JPY", "CHF", "CAD", "AUD", "CNY", "INR", "BRL", "MXN", "SEK", "KRW", "AED"];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.3)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", chip: "rgba(255,255,255,0.07)", chipHover: "rgba(255,255,255,0.12)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.08)", highlight: "rgba(255,255,255,0.07)", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.3)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", chip: "rgba(10,10,10,0.05)", chipHover: "rgba(10,10,10,0.09)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.12)", highlight: "rgba(10,10,10,0.05)", shadow: "0 20px 50px rgba(0,0,0,0.16)" },
};

const SIZES: Record<CurrencyInputSize, { font: number; height: number; padX: number; radius: number }> = {
  sm: { font: 13, height: 36, padX: 12, radius: 11 },
  md: { font: 14.5, height: 44, padX: 14, radius: 13 },
  lg: { font: 16, height: 52, padX: 16, radius: 15 },
};

function currencyMeta(code: string, locale: string) {
  const fmt = new Intl.NumberFormat(locale, { style: "currency", currency: code, currencyDisplay: "narrowSymbol" });
  const symbol = fmt.formatToParts(0).find((part) => part.type === "currency")?.value ?? code;
  const decimals = fmt.resolvedOptions().maximumFractionDigits ?? 2;
  let name = code;
  try {
    name = new Intl.DisplayNames([locale], { type: "currency" }).of(code) ?? code;
  } catch {
    // Older engines without Intl.DisplayNames just show the code.
  }
  return { code, symbol, decimals, name };
}

function separators(locale: string) {
  const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
  return { group: parts.find((p) => p.type === "group")?.value ?? ",", decimal: parts.find((p) => p.type === "decimal")?.value ?? "." };
}

/**
 * Turns raw text into a clean draft ("-1234.5", "." as the decimal) while the person types: group
 * separators and other characters drop out, the locale's decimal separator starts the fraction, and
 * the fraction is capped at the currency's decimals.
 */
function toDraft(raw: string, decimalSep: string, decimals: number, allowNegative: boolean) {
  const negative = allowNegative && raw.trim().startsWith("-");
  const [intRaw, ...rest] = raw.split(decimalSep);
  const int = intRaw.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  const hasDecimal = decimals > 0 && rest.length > 0;
  const frac = hasDecimal ? rest.join("").replace(/\D/g, "").slice(0, decimals) : "";
  return `${negative ? "-" : ""}${int}${hasDecimal ? `.${frac}` : ""}`;
}

/** Shows a draft with the locale's separators, keeping a trailing decimal or zeros the person typed. */
function displayDraft(draft: string, locale: string, decimalSep: string) {
  if (draft === "" || draft === "-") return draft;
  const negative = draft.startsWith("-");
  const [int, frac] = draft.replace("-", "").split(".");
  const grouped = int === "" ? "" : new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: true }).format(BigInt(int));
  return `${negative ? "-" : ""}${grouped || (frac !== undefined ? "0" : "")}${frac !== undefined ? `${decimalSep}${frac}` : ""}`;
}

// The caret is restored by counting these "meaningful" characters (digits, the decimal separator and
// a minus); group separators come and go as the number is reformatted, so they don't count.
const isMark = (ch: string, decimalSep: string) => /\d/.test(ch) || ch === decimalSep || ch === "-";
const countMarks = (text: string, decimalSep: string) => [...text].filter((ch) => isMark(ch, decimalSep)).length;

const draftToNumber = (draft: string) => (draft === "" || draft === "-" || draft === "." ? null : Number(draft));

function numberToDraft(n: number | null | undefined, decimals: number) {
  if (n === null || n === undefined || Number.isNaN(n)) return "";
  return decimals > 0 ? n.toFixed(decimals) : String(Math.round(n));
}

function Chevron({ open, color }: { open: boolean; color: string }) {
  return (
    <motion.span aria-hidden="true" className="flex" animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 420, damping: 28 }} style={{ color }}>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6.2L8 10L12 6.2" />
      </svg>
    </motion.span>
  );
}

export function CurrencyInput({
  value,
  defaultValue = null,
  onValueChange,
  currency: currencyProp,
  defaultCurrency = "USD",
  onCurrencyChange,
  currencies = DEFAULT_CURRENCIES,
  showCurrencySelect = true,
  locale = "en-US",
  min,
  max,
  step = 1,
  allowNegative = false,
  label,
  placeholder,
  helperText,
  size = "md",
  theme = "dark",
  width = 300,
  disabled = false,
  className,
}: CurrencyInputProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const caretDigits = React.useRef<number | null>(null);

  const [currencyState, setCurrencyState] = React.useState(defaultCurrency);
  const code = (currencyProp ?? currencyState).toUpperCase();
  const meta = React.useMemo(() => currencyMeta(code, locale), [code, locale]);
  const menu = React.useMemo(() => currencies.map((c) => currencyMeta(c, locale)), [currencies, locale]);
  const { decimal: decimalSep } = React.useMemo(() => separators(locale), [locale]);

  const isControlled = value !== undefined;
  const [draft, setDraft] = React.useState(() => numberToDraft(defaultValue, meta.decimals));
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);

  // A controlled value that changes from outside replaces the draft, unless it's what the draft already says.
  const shownDraft = isControlled && draftToNumber(draft) !== (value ?? null) ? numberToDraft(value, meta.decimals) : draft;

  const clamp = (n: number) => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));

  const commitDraft = (next: string) => {
    setDraft(next);
    onValueChange?.(draftToNumber(next), code);
  };

  const onInput = (raw: string, caret: number | null) => {
    const next = toDraft(raw, decimalSep, meta.decimals, allowNegative);
    caretDigits.current = caret === null ? null : countMarks(raw.slice(0, caret), decimalSep);
    commitDraft(next);
  };

  const shown = focused ? displayDraft(shownDraft, locale, decimalSep) : shownDraft === "" ? "" : new Intl.NumberFormat(locale, { minimumFractionDigits: meta.decimals, maximumFractionDigits: meta.decimals }).format(Number(shownDraft));

  React.useLayoutEffect(() => {
    const el = inputRef.current;
    const n = caretDigits.current;
    if (!el || n === null || document.activeElement !== el) return;
    let pos = 0;
    let seen = 0;
    while (pos < shown.length && seen < n) {
      if (isMark(shown[pos], decimalSep)) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  }, [shown, decimalSep]);

  const nudge = (dir: 1 | -1, big: boolean) => {
    const current = draftToNumber(shownDraft) ?? 0;
    const next = clamp(Math.round((current + dir * step * (big ? 10 : 1)) * 10 ** meta.decimals) / 10 ** meta.decimals);
    if (!allowNegative && next < 0) return;
    commitDraft(numberToDraft(next, meta.decimals));
  };

  const onBlur = () => {
    setFocused(false);
    const n = draftToNumber(shownDraft);
    if (n === null) return commitDraft("");
    commitDraft(numberToDraft(clamp(n), meta.decimals));
  };

  const pickCurrency = (c: string) => {
    if (!currencyProp) setCurrencyState(c);
    onCurrencyChange?.(c);
    setOpen(false);
    const d = currencyMeta(c, locale).decimals;
    const n = draftToNumber(shownDraft);
    if (n !== null) {
      const next = numberToDraft(n, d);
      setDraft(next);
      onValueChange?.(draftToNumber(next), c);
    }
    inputRef.current?.focus();
  };

  const onMenuKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setActiveIndex(Math.max(0, menu.findIndex((m) => m.code === code)));
        return setOpen(true);
      }
      setActiveIndex((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + menu.length) % menu.length);
    } else if ((e.key === "Enter" || e.key === " ") && open) {
      e.preventDefault();
      pickCurrency(menu[activeIndex].code);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const active = focused || open;
  const borderColor = active ? p.focus : hovered ? p.borderHover : p.border;
  const selectable = showCurrencySelect && currencies.length > 1;
  const shownPlaceholder = placeholder ?? new Intl.NumberFormat(locale, { minimumFractionDigits: meta.decimals, maximumFractionDigits: meta.decimals }).format(0);

  return (
    <div ref={rootRef} className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label htmlFor={`${uid}-input`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div className="relative">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => inputRef.current?.focus()}
          className="flex items-center"
          style={{ height: s.height, gap: 8, padding: `0 ${selectable ? 6 : s.padX}px 0 ${s.padX}px`, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: active ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", cursor: disabled ? "default" : "text", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
          <span className="relative flex shrink-0 justify-center overflow-hidden" style={{ minWidth: s.font * 0.8, height: s.font * 1.5, color: shownDraft ? p.text : p.muted, fontSize: s.font, fontWeight: 600 }} aria-hidden="true">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={meta.symbol} initial={{ y: "100%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "-100%", opacity: 0 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }} style={{ lineHeight: `${s.font * 1.5}px` }}>
                {meta.symbol}
              </motion.span>
            </AnimatePresence>
          </span>
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-describedby={helperText ? `${uid}-help` : undefined}
            aria-label={label ? undefined : `Amount in ${meta.name}`}
            disabled={disabled}
            value={shown}
            placeholder={shownPlaceholder}
            onChange={(e) => onInput(e.target.value, e.target.selectionStart)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                nudge(e.key === "ArrowUp" ? 1 : -1, e.shiftKey);
              }
            }}
            onFocus={() => setFocused(true)}
            onBlur={onBlur}
            className="h-full min-w-0 flex-1 border-none bg-transparent p-0 outline-none placeholder:text-[color:var(--ci-placeholder)]"
            style={{ color: p.text, fontSize: s.font, fontWeight: 500, fontVariantNumeric: "tabular-nums", ["--ci-placeholder" as string]: p.faint }}
          />
          {selectable ? (
            <button
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={`${uid}-list`}
              aria-activedescendant={open ? `${uid}-c-${menu[activeIndex]?.code}` : undefined}
              aria-label={`Currency: ${meta.name}`}
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(Math.max(0, menu.findIndex((m) => m.code === code)));
                setOpen((o) => !o);
              }}
              onKeyDown={onMenuKey}
              className="flex shrink-0 cursor-pointer items-center border-none outline-none focus-visible:ring-2"
              style={{ gap: 5, height: s.height - 12, padding: "0 9px", borderRadius: s.radius - 5, background: open ? p.chipHover : p.chip, color: p.text, fontSize: s.font - 1.5, fontWeight: 600, letterSpacing: "0.02em", transition: "background 0.15s ease", ["--tw-ring-color" as string]: p.focus }}
              onMouseEnter={(e) => (e.currentTarget.style.background = p.chipHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = open ? p.chipHover : p.chip)}
            >
              {code}
              <Chevron open={open} color={p.muted} />
            </button>
          ) : (
            <span className="shrink-0" style={{ color: p.muted, fontSize: s.font - 1.5, fontWeight: 600, letterSpacing: "0.02em" }}>
              {code}
            </span>
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              id={`${uid}-list`}
              role="listbox"
              aria-label="Currency"
              className="absolute right-0 z-50 m-0 list-none overflow-auto p-1.5"
              style={{ top: "calc(100% + 8px)", width: "min(100%, 280px)", maxHeight: 272, borderRadius: s.radius + 2, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top right" }}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {menu.map((m, i) => {
                const isSelected = m.code === code;
                return (
                  <li
                    key={m.code}
                    id={`${uid}-c-${m.code}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => pickCurrency(m.code)}
                    className="flex cursor-pointer items-center"
                    style={{ gap: 10, padding: `${s.height * 0.16}px ${s.padX - 6}px`, borderRadius: s.radius - 4, background: i === activeIndex ? p.highlight : "transparent", color: p.text, transition: "background 0.12s ease" }}
                  >
                    <span className="flex shrink-0 items-center justify-center" style={{ width: 30, height: 24, borderRadius: 7, background: p.chip, fontSize: m.symbol.length > 2 ? s.font - 5 : s.font - 2, fontWeight: 600 }}>
                      {m.symbol}
                    </span>
                    <span style={{ fontSize: s.font - 1, fontWeight: isSelected ? 700 : 600, letterSpacing: "0.02em" }}>{m.code}</span>
                    <span className="min-w-0 flex-1 truncate" style={{ fontSize: s.font - 2, color: p.muted }}>
                      {m.name}
                    </span>
                    <span className="flex shrink-0 justify-end" style={{ width: 14 }}>
                      {isSelected && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <motion.path d="M3 8.2L6.4 11.6L13 4.4" stroke={p.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease: "easeOut" }} />
                        </svg>
                      )}
                    </span>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {helperText && (
        <span id={`${uid}-help`} style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4, visibility: open ? "hidden" : "visible" }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
