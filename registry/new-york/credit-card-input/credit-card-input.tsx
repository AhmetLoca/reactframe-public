"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CardBrand = "visa" | "mastercard" | "amex" | "discover" | "troy" | "unknown";

export interface CreditCardValue {
  /** Digits only. */
  number: string;
  /** "MM/YY", possibly partial while typing. */
  expiry: string;
  cvc: string;
  name: string;
  brand: CardBrand;
  /** Every shown field is filled in and passes its check (Luhn, future expiry, CVC length). */
  isComplete: boolean;
}

export type CreditCardInputSize = "sm" | "md" | "lg";

export interface CreditCardInputProps {
  value?: Partial<CreditCardValue>;
  defaultValue?: Partial<CreditCardValue>;
  onValueChange?: (value: CreditCardValue) => void;
  /** Adds a cardholder name row above the number. */
  showName?: boolean;
  label?: string;
  helperText?: string;
  size?: CreditCardInputSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.3)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", divider: "rgba(255,255,255,0.09)", chip: "rgba(255,255,255,0.08)", error: "#FF7A6B" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.3)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", divider: "rgba(10,10,10,0.09)", chip: "rgba(10,10,10,0.06)", error: "#E5484D" },
};

const SIZES: Record<CreditCardInputSize, { font: number; row: number; padX: number; radius: number }> = {
  sm: { font: 13, row: 38, padX: 12, radius: 11 },
  md: { font: 14.5, row: 46, padX: 14, radius: 13 },
  lg: { font: 16, row: 54, padX: 16, radius: 15 },
};

const BRANDS: { brand: Exclude<CardBrand, "unknown">; test: RegExp; lengths: number[]; gaps: number[]; cvc: number }[] = [
  { brand: "amex", test: /^3[47]/, lengths: [15], gaps: [4, 10], cvc: 4 },
  { brand: "troy", test: /^9792/, lengths: [16], gaps: [4, 8, 12], cvc: 3 },
  { brand: "visa", test: /^4/, lengths: [13, 16, 19], gaps: [4, 8, 12], cvc: 3 },
  { brand: "mastercard", test: /^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/, lengths: [16], gaps: [4, 8, 12], cvc: 3 },
  { brand: "discover", test: /^(6011|64[4-9]|65)/, lengths: [16, 19], gaps: [4, 8, 12], cvc: 3 },
];
const UNKNOWN = { brand: "unknown" as const, lengths: [16, 19], gaps: [4, 8, 12], cvc: 3 };

const brandInfo = (digits: string) => BRANDS.find((b) => b.test.test(digits)) ?? UNKNOWN;
// Length at which the number is "done" and focus moves on: 16 where allowed (Visa also allows 13/19), else the only length.
const typicalLength = (lengths: number[]) => (lengths.includes(16) ? 16 : lengths[0]);

const digitsIn = (s: string) => s.replace(/\D/g, "");

function luhn(digits: string) {
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = Number(digits[digits.length - 1 - i]);
    if (i % 2 === 1) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  return digits.length > 0 && sum % 10 === 0;
}

function formatNumber(digits: string, gaps: number[]) {
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (gaps.includes(i)) out += " ";
    out += digits[i];
  }
  return out;
}

/** "4" -> "04", "13" -> "1" (month can't be 13), always shown as "MM / YY". */
function normaliseExpiry(raw: string) {
  let d = digitsIn(raw);
  if (d.length === 1 && Number(d) > 1) d = `0${d}`;
  if (d.length >= 2 && (Number(d.slice(0, 2)) > 12 || d.slice(0, 2) === "00")) d = d.slice(0, 1);
  return d.slice(0, 4);
}
const showExpiry = (d: string) => (d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d);

function expiryState(d: string): "empty" | "partial" | "past" | "ok" {
  if (!d) return "empty";
  if (d.length < 4) return "partial";
  const month = Number(d.slice(0, 2));
  const year = 2000 + Number(d.slice(2));
  const now = new Date();
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1) ? "ok" : "past";
}

function BrandMark({ brand, color }: { brand: CardBrand; color: string }) {
  if (brand === "mastercard") {
    return (
      <svg width="26" height="16" viewBox="0 0 26 16" fill="none" aria-hidden="true">
        <circle cx="9" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
        <circle cx="17" cy="8" r="6.5" stroke={color} strokeWidth="1.5" />
      </svg>
    );
  }
  if (brand === "unknown") {
    return (
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke={color} strokeWidth="1.4" aria-hidden="true">
        <rect x="1" y="1" width="22" height="14" rx="2.5" />
        <path d="M1 5.5h22M4.5 11h5" strokeLinecap="round" />
      </svg>
    );
  }
  const words: Record<string, { text: string; italic?: boolean; spacing?: string }> = {
    visa: { text: "VISA", italic: true, spacing: "0.02em" },
    amex: { text: "AMEX", spacing: "0.06em" },
    discover: { text: "DISC", spacing: "0.04em" },
    troy: { text: "troy", spacing: "0" },
  };
  const w = words[brand];
  return (
    <span aria-hidden="true" style={{ color, fontSize: 11, fontWeight: 800, fontStyle: w.italic ? "italic" : "normal", letterSpacing: w.spacing, lineHeight: "16px" }}>
      {w.text}
    </span>
  );
}

function CardBackIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="16" viewBox="0 0 24 16" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="22" height="14" rx="2.5" stroke={color} strokeWidth="1.4" />
      <rect x="1" y="3.5" width="22" height="3" fill={color} />
      <rect x="14.5" y="9" width="6" height="3.5" rx="1" stroke={color} strokeWidth="1.2" />
    </svg>
  );
}

type Field = "name" | "number" | "expiry" | "cvc";

export function CreditCardInput({
  value,
  defaultValue,
  onValueChange,
  showName = false,
  label,
  helperText,
  size = "md",
  theme = "dark",
  width = 360,
  disabled = false,
  className,
}: CreditCardInputProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  // Fields are found by id when focus has to move, so no refs are read while rendering.
  const fieldEl = (f: Field) => document.getElementById(`${uid}-${f}`) as HTMLInputElement | null;
  const [internal, setInternal] = React.useState({
    number: digitsIn(defaultValue?.number ?? ""),
    expiry: normaliseExpiry(defaultValue?.expiry ?? ""),
    cvc: digitsIn(defaultValue?.cvc ?? ""),
    name: defaultValue?.name ?? "",
  });
  const isControlled = value !== undefined;
  const cur = isControlled
    ? { number: digitsIn(value.number ?? ""), expiry: normaliseExpiry(value.expiry ?? ""), cvc: digitsIn(value.cvc ?? ""), name: value.name ?? "" }
    : internal;

  const [focused, setFocused] = React.useState<Field | null>(null);
  const [touched, setTouched] = React.useState<Partial<Record<Field, boolean>>>({});
  const [hovered, setHovered] = React.useState(false);

  const info = brandInfo(cur.number);
  const maxLen = Math.max(...info.lengths);
  const numberOk = info.lengths.includes(cur.number.length) && luhn(cur.number);
  const exp = expiryState(cur.expiry);
  const cvcOk = cur.cvc.length === info.cvc;
  const nameOk = !showName || cur.name.trim().length > 1;

  const errors: Partial<Record<Field, string>> = {};
  if (touched.name && focused !== "name" && showName && cur.name && !nameOk) errors.name = "Enter the name on the card";
  if (touched.number && focused !== "number" && cur.number && !numberOk) errors.number = info.lengths.includes(cur.number.length) || cur.number.length >= maxLen ? "Card number is invalid" : "Card number is incomplete";
  if (touched.expiry && focused !== "expiry" && exp === "partial") errors.expiry = "Expiry date is incomplete";
  if (exp === "past") errors.expiry = "Expiry date is in the past";
  if (touched.cvc && focused !== "cvc" && cur.cvc && !cvcOk) errors.cvc = "Security code is incomplete";
  const firstError = (["name", "number", "expiry", "cvc"] as Field[]).map((f) => errors[f]).find(Boolean);

  const update = (patch: Partial<typeof cur>) => {
    const next = { ...cur, ...patch };
    if (!isControlled) setInternal(next);
    const b = brandInfo(next.number);
    const complete = b.lengths.includes(next.number.length) && luhn(next.number) && expiryState(next.expiry) === "ok" && next.cvc.length === b.cvc && (!showName || next.name.trim().length > 1);
    onValueChange?.({ ...next, expiry: next.expiry.length > 2 ? `${next.expiry.slice(0, 2)}/${next.expiry.slice(2)}` : next.expiry, brand: b.brand, isComplete: complete });
  };

  const focusField = (f: Field) => fieldEl(f)?.focus();

  const onNumber = (raw: string) => {
    const digits = digitsIn(raw);
    const b = brandInfo(digits);
    const next = digits.slice(0, Math.max(...b.lengths));
    update({ number: next, cvc: cur.cvc.slice(0, b.cvc) });
    if (next.length === typicalLength(b.lengths) && luhn(next)) focusField("expiry");
  };

  const onExpiry = (raw: string) => {
    const next = normaliseExpiry(raw);
    update({ expiry: next });
    if (next.length === 4 && expiryState(next) === "ok") focusField("cvc");
  };

  const onCvc = (raw: string) => update({ cvc: digitsIn(raw).slice(0, info.cvc) });

  // Backspace in an empty field goes back to the end of the previous one (named in data-prev).
  const onBackspace = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const prev = e.currentTarget.dataset.prev as Field | undefined;
    if (e.key !== "Backspace" || e.currentTarget.value !== "" || !prev) return;
    const el = fieldEl(prev);
    if (!el) return;
    e.preventDefault();
    el.focus();
    requestAnimationFrame(() => el.setSelectionRange(el.value.length, el.value.length));
  };

  const blur = (f: Field) => () => {
    setFocused((cur) => (cur === f ? null : cur));
    setTouched((t) => ({ ...t, [f]: true }));
  };

  const active = focused !== null;
  const hasError = Boolean(firstError);
  const borderColor = hasError ? p.error : active ? p.focus : hovered ? p.borderHover : p.border;
  const ring = hasError ? p.error : p.focus;

  const inputBase = "h-full min-w-0 flex-1 border-none bg-transparent outline-none placeholder:text-[color:var(--cc-placeholder)]";
  const inputStyle = (field: Field): React.CSSProperties => ({ color: errors[field] ? p.error : p.text, fontSize: s.font, fontWeight: 500, fontVariantNumeric: "tabular-nums", letterSpacing: field === "number" ? "0.04em" : "0.01em", ["--cc-placeholder" as string]: p.faint });

  const iconKey = focused === "cvc" ? "cvc" : info.brand;

  return (
    <div className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label htmlFor={`${uid}-number`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div
        role="group"
        aria-label={label ?? "Card details"}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="overflow-hidden"
        style={{ borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: active || hasError ? `0 0 0 3px color-mix(in srgb, ${ring} 14%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
      >
        {showName && (
          <div className="flex items-center" style={{ height: s.row, padding: `0 ${s.padX}px`, borderBottom: `1px solid ${p.divider}` }}>
            <input
              id={`${uid}-name`}
              type="text"
              autoComplete="cc-name"
              aria-label="Name on card"
              aria-invalid={Boolean(errors.name) || undefined}
              disabled={disabled}
              value={cur.name}
              placeholder="Name on card"
              onChange={(e) => update({ name: e.target.value })}
              onFocus={() => setFocused("name")}
              onBlur={blur("name")}
              className={inputBase}
              style={{ ...inputStyle("name"), letterSpacing: 0, fontVariantNumeric: "normal" }}
            />
          </div>
        )}

        <div className="flex items-center" style={{ height: s.row, padding: `0 ${s.padX}px`, gap: 12, borderBottom: `1px solid ${p.divider}` }}>
          <span className="relative flex shrink-0 items-center justify-center" style={{ width: 38, height: 24, borderRadius: 5, background: p.chip }}>
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span key={iconKey} className="flex" initial={{ opacity: 0, y: 6, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -6, rotateX: 60 }} transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}>
                {iconKey === "cvc" ? <CardBackIcon color={p.text} /> : <BrandMark brand={info.brand} color={info.brand === "unknown" ? p.muted : p.text} />}
              </motion.span>
            </AnimatePresence>
          </span>
          <input
            id={`${uid}-number`}
            type="text"
            inputMode="numeric"
            autoComplete="cc-number"
            aria-label={label ? undefined : "Card number"}
            aria-invalid={Boolean(errors.number) || undefined}
            aria-describedby={firstError ? `${uid}-msg` : undefined}
            disabled={disabled}
            value={formatNumber(cur.number, info.gaps)}
            placeholder="1234 1234 1234 1234"
            onChange={(e) => onNumber(e.target.value)}
            data-prev={showName ? "name" : undefined}
            onKeyDown={onBackspace}
            onFocus={() => setFocused("number")}
            onBlur={blur("number")}
            className={inputBase}
            style={inputStyle("number")}
          />
          <span className="sr-only" aria-live="polite">
            {info.brand !== "unknown" ? `${info.brand} card` : ""}
          </span>
        </div>

        <div className="flex" style={{ height: s.row }}>
          <div className="flex flex-1 items-center" style={{ padding: `0 ${s.padX}px`, borderRight: `1px solid ${p.divider}` }}>
            <input
              id={`${uid}-expiry`}
              type="text"
              inputMode="numeric"
              autoComplete="cc-exp"
              aria-label="Expiry date, month and year"
              aria-invalid={Boolean(errors.expiry) || undefined}
              disabled={disabled}
              value={showExpiry(cur.expiry)}
              placeholder="MM / YY"
              onChange={(e) => onExpiry(e.target.value)}
              data-prev="number"
              onKeyDown={onBackspace}
              onFocus={() => setFocused("expiry")}
              onBlur={blur("expiry")}
              className={inputBase}
              style={inputStyle("expiry")}
            />
          </div>
          <div className="flex flex-1 items-center" style={{ padding: `0 ${s.padX}px`, gap: 8 }}>
            <input
              id={`${uid}-cvc`}
              type="text"
              inputMode="numeric"
              autoComplete="cc-csc"
              aria-label={`Security code, ${info.cvc} digits`}
              aria-invalid={Boolean(errors.cvc) || undefined}
              disabled={disabled}
              value={cur.cvc}
              placeholder={info.cvc === 4 ? "CVC (4)" : "CVC"}
              onChange={(e) => onCvc(e.target.value)}
              data-prev="expiry"
              onKeyDown={onBackspace}
              onFocus={() => setFocused("cvc")}
              onBlur={blur("cvc")}
              className={inputBase}
              style={inputStyle("cvc")}
            />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {(firstError || helperText) && (
          <motion.span key={firstError ?? "helper"} id={`${uid}-msg`} role={firstError ? "alert" : undefined} initial={{ opacity: 0, y: -3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }} transition={{ duration: 0.16 }} style={{ color: firstError ? p.error : p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>
            {firstError ?? helperText}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
