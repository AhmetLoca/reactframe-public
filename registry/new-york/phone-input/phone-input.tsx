"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface PhoneCountry {
  /** ISO 3166-1 alpha-2 code, e.g. "US". */
  code: string;
  name: string;
  /** Calling code without the plus, e.g. "1". */
  dial: string;
  /** National number layout; each # is a digit. Its # count is the longest accepted number. */
  mask: string;
  /** Shortest accepted national number, for countries with variable lengths. Defaults to the mask length. */
  min?: number;
  /** Numbers here keep a leading 0 (Italian landlines); elsewhere a typed trunk 0 is dropped. */
  keepLeadingZero?: boolean;
}

export interface PhoneValueMeta {
  country: string;
  /** National significant number, digits only. */
  nationalNumber: string;
  /** True when the number has a valid length for the country. */
  isValid: boolean;
}

export type PhoneInputSize = "sm" | "md" | "lg";

export interface PhoneInputProps {
  /** E.164 number, e.g. "+14155550123", or "" when empty. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string, meta: PhoneValueMeta) => void;
  /** Selected country (ISO code), controlled. */
  country?: string;
  defaultCountry?: string;
  onCountryChange?: (country: string) => void;
  /** Limit the menu to these ISO codes. */
  countries?: string[];
  /** Pinned to the top of the menu, in this order. */
  preferredCountries?: string[];
  label?: string;
  placeholder?: string;
  helperText?: string;
  /** Forces an error state with this message. */
  errorText?: string;
  /** Shown after the field loses focus with an incomplete number; set to "" to turn the check off. */
  invalidText?: string;
  /** Name for a hidden input carrying the E.164 value, for plain form posts. */
  name?: string;
  size?: PhoneInputSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { code: "US", name: "United States", dial: "1", mask: "(###) ###-####" },
  { code: "CA", name: "Canada", dial: "1", mask: "(###) ###-####" },
  { code: "GB", name: "United Kingdom", dial: "44", mask: "#### ######" },
  { code: "TR", name: "Türkiye", dial: "90", mask: "### ### ## ##" },
  { code: "DE", name: "Germany", dial: "49", mask: "### ########", min: 10 },
  { code: "FR", name: "France", dial: "33", mask: "# ## ## ## ##" },
  { code: "ES", name: "Spain", dial: "34", mask: "### ## ## ##" },
  { code: "IT", name: "Italy", dial: "39", mask: "### ### ####", min: 9, keepLeadingZero: true },
  { code: "NL", name: "Netherlands", dial: "31", mask: "# ########" },
  { code: "BE", name: "Belgium", dial: "32", mask: "### ## ## ##", min: 8 },
  { code: "CH", name: "Switzerland", dial: "41", mask: "## ### ## ##" },
  { code: "AT", name: "Austria", dial: "43", mask: "### ########", min: 7 },
  { code: "SE", name: "Sweden", dial: "46", mask: "##-### ## ##", min: 7 },
  { code: "NO", name: "Norway", dial: "47", mask: "### ## ###" },
  { code: "DK", name: "Denmark", dial: "45", mask: "## ## ## ##" },
  { code: "FI", name: "Finland", dial: "358", mask: "## ### #####", min: 6 },
  { code: "IE", name: "Ireland", dial: "353", mask: "## ### ####" },
  { code: "PT", name: "Portugal", dial: "351", mask: "### ### ###" },
  { code: "PL", name: "Poland", dial: "48", mask: "### ### ###" },
  { code: "CZ", name: "Czechia", dial: "420", mask: "### ### ###" },
  { code: "GR", name: "Greece", dial: "30", mask: "### ### ####" },
  { code: "RO", name: "Romania", dial: "40", mask: "### ### ###" },
  { code: "HU", name: "Hungary", dial: "36", mask: "## ### ####", min: 8 },
  { code: "UA", name: "Ukraine", dial: "380", mask: "## ### ## ##" },
  { code: "RU", name: "Russia", dial: "7", mask: "(###) ###-##-##" },
  { code: "IL", name: "Israel", dial: "972", mask: "##-###-####", min: 8 },
  { code: "AE", name: "United Arab Emirates", dial: "971", mask: "## ### ####", min: 8 },
  { code: "SA", name: "Saudi Arabia", dial: "966", mask: "## ### ####" },
  { code: "EG", name: "Egypt", dial: "20", mask: "### ### ####", min: 9 },
  { code: "ZA", name: "South Africa", dial: "27", mask: "## ### ####" },
  { code: "NG", name: "Nigeria", dial: "234", mask: "### ### ####" },
  { code: "KE", name: "Kenya", dial: "254", mask: "### ######" },
  { code: "IN", name: "India", dial: "91", mask: "#####-#####" },
  { code: "PK", name: "Pakistan", dial: "92", mask: "### #######" },
  { code: "BD", name: "Bangladesh", dial: "880", mask: "####-######" },
  { code: "CN", name: "China", dial: "86", mask: "### #### ####" },
  { code: "JP", name: "Japan", dial: "81", mask: "##-####-####", min: 9 },
  { code: "KR", name: "South Korea", dial: "82", mask: "##-####-####", min: 9 },
  { code: "SG", name: "Singapore", dial: "65", mask: "#### ####" },
  { code: "MY", name: "Malaysia", dial: "60", mask: "##-#### ####", min: 9 },
  { code: "ID", name: "Indonesia", dial: "62", mask: "###-####-#####", min: 9 },
  { code: "PH", name: "Philippines", dial: "63", mask: "### ### ####" },
  { code: "TH", name: "Thailand", dial: "66", mask: "## ### ####", min: 8 },
  { code: "VN", name: "Vietnam", dial: "84", mask: "## ### ## ##" },
  { code: "AU", name: "Australia", dial: "61", mask: "### ### ###" },
  { code: "NZ", name: "New Zealand", dial: "64", mask: "## ### ####", min: 8 },
  { code: "BR", name: "Brazil", dial: "55", mask: "(##) #####-####", min: 10 },
  { code: "MX", name: "Mexico", dial: "52", mask: "### ### ####" },
  { code: "AR", name: "Argentina", dial: "54", mask: "## ####-####" },
  { code: "CL", name: "Chile", dial: "56", mask: "# #### ####" },
  { code: "CO", name: "Colombia", dial: "57", mask: "### ### ####" },
  { code: "PE", name: "Peru", dial: "51", mask: "### ### ###" },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", divider: "rgba(255,255,255,0.1)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.08)", highlight: "rgba(255,255,255,0.07)", hover: "rgba(255,255,255,0.06)", error: "#FF7A6B", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", divider: "rgba(10,10,10,0.1)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.12)", highlight: "rgba(10,10,10,0.05)", hover: "rgba(10,10,10,0.04)", error: "#E5484D", shadow: "0 20px 50px rgba(0,0,0,0.16)" },
};

const SIZES: Record<PhoneInputSize, { font: number; height: number; padX: number; radius: number }> = {
  sm: { font: 13, height: 36, padX: 12, radius: 11 },
  md: { font: 14.5, height: 44, padX: 14, radius: 13 },
  lg: { font: 16, height: 52, padX: 16, radius: 15 },
};

const EXAMPLE_DIGITS = "2015550123456";
const digitsIn = (s: string) => s.replace(/\D/g, "");
const maxLength = (c: PhoneCountry) => (c.mask.match(/#/g) ?? []).length;
const isValidLength = (c: PhoneCountry, digits: string) => digits.length >= (c.min ?? maxLength(c)) && digits.length <= maxLength(c);

/** Lays digits into the mask and stops after the last one, so no trailing separators show. */
function formatNational(c: PhoneCountry, digits: string) {
  let out = "";
  let i = 0;
  for (const ch of c.mask) {
    if (i >= digits.length) break;
    if (ch === "#") out += digits[i++];
    else out += ch;
  }
  return out;
}

const flagOf = (code: string) => String.fromCodePoint(...[...code.toUpperCase()].map((ch) => 0x1f1a5 + ch.charCodeAt(0)));

/** Longest calling-code match for an international number, preferring `current` when codes tie (US/CA). */
function detectCountry(list: PhoneCountry[], digits: string, current: PhoneCountry) {
  const matches = list.filter((c) => digits.startsWith(c.dial));
  if (matches.length === 0) return null;
  const longest = Math.max(...matches.map((c) => c.dial.length));
  const best = matches.filter((c) => c.dial.length === longest);
  return best.find((c) => c.code === current.code) ?? best[0];
}

function parseE164(list: PhoneCountry[], value: string | undefined, fallback: PhoneCountry) {
  if (!value || !value.startsWith("+")) return { country: fallback, national: digitsIn(value ?? "") };
  const digits = digitsIn(value);
  const c = detectCountry(list, digits, fallback) ?? fallback;
  return { country: c, national: digits.slice(c.dial.length) };
}

function Chevron({ open, color }: { open: boolean; color: string }) {
  return (
    <motion.span aria-hidden="true" className="flex shrink-0" animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 420, damping: 28 }} style={{ color }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6.2L8 10L12 6.2" />
      </svg>
    </motion.span>
  );
}

function Check({ color, size = 15 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
      <motion.path d="M3 8.2L6.4 11.6L13 4.4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease: "easeOut" }} />
    </svg>
  );
}

const FLAG_FONT = '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';

export function PhoneInput({
  value,
  defaultValue = "",
  onValueChange,
  country: countryProp,
  defaultCountry = "US",
  onCountryChange,
  countries,
  preferredCountries = [],
  label,
  placeholder,
  helperText,
  errorText,
  invalidText = "Enter a valid phone number",
  name,
  size = "md",
  theme = "dark",
  width = 320,
  disabled = false,
  className,
}: PhoneInputProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const searchRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const caretDigits = React.useRef<number | null>(null);

  const list = React.useMemo(() => {
    const base = countries ? PHONE_COUNTRIES.filter((c) => countries.includes(c.code)) : PHONE_COUNTRIES;
    return base.length ? base : PHONE_COUNTRIES;
  }, [countries]);
  const byCode = (code?: string) => list.find((c) => c.code === code?.toUpperCase());
  const fallback = byCode(defaultCountry) ?? list[0];

  // The picked country is kept even when `value` is controlled, so choosing one on an empty field sticks.
  const [initial] = React.useState(() => parseE164(list, defaultValue, fallback));
  const [countryState, setCountryState] = React.useState(initial.country);
  const [nationalState, setNationalState] = React.useState(initial.national);
  const isControlled = value !== undefined;
  const fromValue = isControlled && value ? parseE164(list, value, byCode(countryProp) ?? countryState) : null;
  const country = byCode(countryProp) ?? fromValue?.country ?? byCode(countryState.code) ?? fallback;
  const national = isControlled ? (fromValue?.national ?? "") : nationalState;

  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [touched, setTouched] = React.useState(false);

  const valid = isValidLength(country, national);
  const e164 = national ? `+${country.dial}${national}` : "";

  const emit = (c: PhoneCountry, digits: string) => {
    const next = digits.slice(0, maxLength(c));
    if (!countryProp) setCountryState(c);
    if (!isControlled) setNationalState(next);
    if (c.code !== country.code) onCountryChange?.(c.code);
    onValueChange?.(next ? `+${c.dial}${next}` : "", { country: c.code, nationalNumber: next, isValid: isValidLength(c, next) });
  };

  const onInput = (raw: string, caret: number | null) => {
    // "+44 7911…" (typed or pasted) switches country by its calling code.
    if (raw.trim().startsWith("+")) {
      const all = digitsIn(raw);
      const c = detectCountry(list, all, country);
      if (c) {
        caretDigits.current = null;
        return emit(c, all.slice(c.dial.length));
      }
    }
    let digits = digitsIn(raw);
    let before = caret === null ? digits.length : digitsIn(raw.slice(0, caret)).length;
    if (digits.startsWith("0") && !country.keepLeadingZero) {
      digits = digits.slice(1);
      before = Math.max(0, before - 1);
    }
    caretDigits.current = before;
    emit(country, digits);
  };

  // Put the caret back after the same number of digits once the text is reformatted.
  const formatted = formatNational(country, national);
  React.useLayoutEffect(() => {
    const el = inputRef.current;
    const n = caretDigits.current;
    if (!el || n === null || document.activeElement !== el) return;
    let pos = 0;
    let seen = 0;
    while (pos < formatted.length && seen < n) {
      if (/\d/.test(formatted[pos])) seen++;
      pos++;
    }
    el.setSelectionRange(pos, pos);
    caretDigits.current = null;
  }, [formatted]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Backspace right after a separator deletes the digit before it instead of doing nothing.
    const el = e.currentTarget;
    const start = el.selectionStart ?? 0;
    if (e.key === "Backspace" && start === el.selectionEnd && start > 0 && !/\d/.test(el.value[start - 1])) {
      e.preventDefault();
      const digitIndex = digitsIn(el.value.slice(0, start)).length - 1;
      if (digitIndex < 0) return;
      caretDigits.current = digitIndex;
      emit(country, national.slice(0, digitIndex) + national.slice(digitIndex + 1));
    }
  };

  const ordered = React.useMemo(() => {
    const pinned = preferredCountries.map((code) => list.find((c) => c.code === code)).filter((c): c is PhoneCountry => Boolean(c));
    return { pinned, rest: list.filter((c) => !pinned.includes(c)) };
  }, [list, preferredCountries]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase().replace(/^\+/, "");
    if (!q) return [...ordered.pinned, ...ordered.rest];
    return list.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase() === q || c.dial.startsWith(q));
  }, [query, ordered, list]);
  const showPinnedDivider = !query.trim() && ordered.pinned.length > 0;

  const openMenu = () => {
    if (disabled) return;
    setQuery("");
    const all = [...ordered.pinned, ...ordered.rest];
    setActiveIndex(Math.max(0, all.findIndex((c) => c.code === country.code)));
    setOpen(true);
  };

  const closeMenu = (focusInput = true) => {
    setOpen(false);
    if (focusInput) inputRef.current?.focus();
  };

  const pick = (c: PhoneCountry) => {
    emit(c, national);
    closeMenu();
  };

  const onSearchKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (filtered.length) setActiveIndex((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + filtered.length) % filtered.length);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      setActiveIndex(e.key === "Home" ? 0 : filtered.length - 1);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) pick(filtered[activeIndex]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      closeMenu();
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
    const t = setTimeout(() => searchRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("mousedown", onDown);
      clearTimeout(t);
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const showInvalid = Boolean(errorText) || (Boolean(invalidText) && touched && !focused && national.length > 0 && !valid);
  const message = errorText || (showInvalid ? invalidText : helperText);
  const active = focused || open;
  const borderColor = showInvalid ? p.error : active ? p.focus : hovered ? p.borderHover : p.border;
  const ringColor = showInvalid ? p.error : p.focus;
  const shownPlaceholder = placeholder ?? formatNational(country, EXAMPLE_DIGITS.slice(0, maxLength(country)));

  return (
    <div ref={rootRef} className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label htmlFor={`${uid}-input`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}
      {name && <input type="hidden" name={name} value={e164} />}

      <div className="relative">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex items-center"
          style={{ height: s.height, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: active || showInvalid ? `0 0 0 3px color-mix(in srgb, ${ringColor} 14%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-label={`Country: ${country.name} +${country.dial}`}
            disabled={disabled}
            onClick={() => (open ? closeMenu() : openMenu())}
            className="flex h-full shrink-0 cursor-pointer items-center border-none bg-transparent outline-none focus-visible:ring-2"
            style={{ gap: 6, padding: `0 8px 0 ${s.padX - 2}px`, borderRadius: `${s.radius}px 0 0 ${s.radius}px`, color: p.text, fontSize: s.font, fontWeight: 500, cursor: disabled ? "default" : "pointer", ["--tw-ring-color" as string]: p.focus }}
          >
            <span aria-hidden="true" style={{ fontFamily: FLAG_FONT, fontSize: s.font + 3, lineHeight: 1 }}>
              {flagOf(country.code)}
            </span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>+{country.dial}</span>
            <Chevron open={open} color={open ? p.text : p.muted} />
          </button>
          <span aria-hidden="true" className="shrink-0" style={{ width: 1, height: s.height * 0.46, background: p.divider }} />
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            disabled={disabled}
            value={formatted}
            placeholder={shownPlaceholder}
            aria-invalid={showInvalid || undefined}
            aria-describedby={message ? `${uid}-msg` : undefined}
            onChange={(e) => onInput(e.target.value, e.target.selectionStart)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              setTouched(true);
            }}
            className="h-full min-w-0 flex-1 border-none bg-transparent outline-none placeholder:text-[color:var(--pi-placeholder)]"
            style={{ padding: `0 ${valid ? 6 : s.padX}px 0 10px`, color: p.text, fontSize: s.font, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em", ["--pi-placeholder" as string]: p.faint }}
          />
          <AnimatePresence>
            {valid && (
              <motion.span key="ok" className="flex shrink-0" style={{ paddingRight: s.padX }} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ duration: 0.16 }} aria-hidden="true">
                <Check color={p.text} size={s.font + 1} />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="absolute left-0 z-50 w-full overflow-hidden"
              style={{ top: "calc(100% + 8px)", borderRadius: s.radius + 2, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top center" }}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center" style={{ gap: 8, padding: `0 ${s.padX - 2}px`, height: s.height - 4, borderBottom: `1px solid ${p.menuBorder}` }}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={p.muted} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="M10.5 10.5L14 14" />
                </svg>
                <input
                  ref={searchRef}
                  type="text"
                  role="combobox"
                  aria-expanded
                  aria-controls={`${uid}-list`}
                  aria-activedescendant={filtered[activeIndex] ? `${uid}-c-${filtered[activeIndex].code}` : undefined}
                  aria-label="Search countries"
                  autoComplete="off"
                  spellCheck={false}
                  value={query}
                  placeholder="Search country or code"
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  onKeyDown={onSearchKey}
                  className="min-w-0 flex-1 border-none bg-transparent p-0 outline-none placeholder:text-[color:var(--pi-placeholder)]"
                  style={{ color: p.text, fontSize: s.font - 1, fontWeight: 500, ["--pi-placeholder" as string]: p.muted }}
                />
              </div>
              <ul ref={listRef} id={`${uid}-list`} role="listbox" aria-label="Countries" className="m-0 list-none overflow-auto p-1.5" style={{ maxHeight: 264 }}>
                {filtered.length === 0 ? (
                  <li role="presentation" className="text-center" style={{ padding: "18px 12px", color: p.muted, fontSize: s.font - 0.5 }}>
                    No countries found
                  </li>
                ) : (
                  filtered.map((c, i) => {
                    const isSelected = c.code === country.code;
                    return (
                      <React.Fragment key={c.code}>
                        {showPinnedDivider && i === ordered.pinned.length && <li role="presentation" aria-hidden="true" style={{ height: 1, margin: "6px 8px", background: p.menuBorder }} />}
                        <li
                          id={`${uid}-c-${c.code}`}
                          data-index={i}
                          role="option"
                          aria-selected={isSelected}
                          onMouseEnter={() => setActiveIndex(i)}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => pick(c)}
                          className="flex cursor-pointer items-center"
                          style={{ gap: 10, padding: `${s.height * 0.18}px ${s.padX - 4}px`, borderRadius: s.radius - 4, background: i === activeIndex ? p.highlight : "transparent", color: p.text, transition: "background 0.12s ease" }}
                        >
                          <span aria-hidden="true" style={{ fontFamily: FLAG_FONT, fontSize: s.font + 2, lineHeight: 1 }}>
                            {flagOf(c.code)}
                          </span>
                          <span className="min-w-0 flex-1 truncate" style={{ fontSize: s.font - 0.5, fontWeight: isSelected ? 700 : 500 }}>
                            {c.name}
                          </span>
                          <span style={{ fontSize: s.font - 1.5, color: p.muted, fontVariantNumeric: "tabular-nums" }}>+{c.dial}</span>
                          <span className="flex shrink-0 justify-end" style={{ width: 15 }}>
                            {isSelected && <Check color={p.text} size={14} />}
                          </span>
                        </li>
                      </React.Fragment>
                    );
                  })
                )}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {message && (
          <motion.span key={showInvalid ? "error" : "helper"} id={`${uid}-msg`} role={showInvalid ? "alert" : undefined} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.16 }} style={{ color: showInvalid ? p.error : p.muted, fontSize: s.font - 1.5, lineHeight: 1.4, visibility: open ? "hidden" : "visible" }}>
            {message}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
