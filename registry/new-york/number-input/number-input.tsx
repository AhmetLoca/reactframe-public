"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type NumberInputSize = "sm" | "md" | "lg";

export interface NumberInputProps {
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  prefix?: string;
  suffix?: string;
  thousandSeparator?: boolean;
  locale?: string;
  layout?: "split" | "stacked";
  allowEmpty?: boolean;
  placeholder?: string;
  label?: string;
  helperText?: string;
  size?: NumberInputSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", btn: "rgba(255,255,255,0.06)", btnHover: "rgba(255,255,255,0.13)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", btn: "rgba(10,10,10,0.05)", btnHover: "rgba(10,10,10,0.1)", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)" },
};

const SIZES: Record<NumberInputSize, { font: number; height: number; radius: number; btn: number; icon: number }> = {
  sm: { font: 13, height: 36, radius: 11, btn: 26, icon: 12 },
  md: { font: 14.5, height: 44, radius: 13, btn: 32, icon: 14 },
  lg: { font: 16.5, height: 52, radius: 15, btn: 38, icon: 16 },
};

function Icon({ kind, size }: { kind: "minus" | "plus" | "up" | "down"; size: number }) {
  const d = { minus: "M3.5 8H12.5", plus: "M3.5 8H12.5M8 3.5V12.5", up: "M4 10L8 6L12 10", down: "M4 6L8 10L12 6" }[kind];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const decimals = (n: number) => (String(n).split(".")[1] ?? "").length;

export function NumberInput({
  value,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  precision,
  prefix,
  suffix,
  thousandSeparator = false,
  locale = "en-US",
  layout = "split",
  allowEmpty = true,
  placeholder = "0",
  label,
  helperText,
  size = "md",
  theme = "dark",
  width = 220,
  disabled = false,
  className,
}: NumberInputProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState<number | null>(defaultValue);
  const [draft, setDraft] = React.useState<string | null>(null);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const current = controlled ? value : internal;
  const valueRef = React.useRef<number | null>(current);
  React.useEffect(() => {
    valueRef.current = current;
  }, [current]);
  const timers = React.useRef<{ t?: ReturnType<typeof setTimeout>; i?: ReturnType<typeof setInterval> }>({});

  const prec = precision ?? Math.max(decimals(step), 0);
  const clamp = React.useCallback(
    (n: number) => {
      let r = n;
      if (min !== undefined) r = Math.max(min, r);
      if (max !== undefined) r = Math.min(max, r);
      return Number(r.toFixed(prec));
    },
    [min, max, prec],
  );
  const fmt = React.useMemo(() => new Intl.NumberFormat(locale, { minimumFractionDigits: prec, maximumFractionDigits: prec, useGrouping: thousandSeparator }), [locale, prec, thousandSeparator]);

  const commit = React.useCallback(
    (next: number | null) => {
      if (next === valueRef.current) return;
      valueRef.current = next;
      if (!controlled) setInternal(next);
      onValueChange?.(next);
    },
    [controlled, onValueChange],
  );

  const stepBy = React.useCallback(
    (dir: 1 | -1, mult = 1) => {
      const base = valueRef.current ?? (min !== undefined && dir === 1 ? min - step * mult : max !== undefined && dir === -1 ? max + step * mult : 0);
      commit(clamp(base + dir * step * mult));
      setDraft(null);
    },
    [clamp, commit, min, max, step],
  );

  const stopRepeat = React.useCallback(() => {
    clearTimeout(timers.current.t);
    clearInterval(timers.current.i);
  }, []);
  React.useEffect(() => stopRepeat, [stopRepeat]);

  const startRepeat = (dir: 1 | -1) => {
    if (disabled) return;
    stepBy(dir);
    stopRepeat();
    timers.current.t = setTimeout(() => {
      let ticks = 0;
      timers.current.i = setInterval(() => {
        ticks++;
        stepBy(dir, ticks > 25 ? 10 : 1);
      }, 65);
    }, 380);
  };

  const parse = (raw: string) => {
    const cleaned = raw.replace(/,/g, "").replace(/[^\d.\-]/g, "");
    if (cleaned === "" || cleaned === "-" || cleaned === ".") return null;
    const n = parseFloat(cleaned);
    return Number.isFinite(n) ? n : null;
  };

  const finish = () => {
    if (draft !== null) {
      const n = parse(draft);
      if (n === null) commit(allowEmpty && draft.trim() === "" ? null : valueRef.current);
      else commit(clamp(n));
    }
    setDraft(null);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
    if (e.key === "ArrowUp") { e.preventDefault(); finishDraftThen(() => stepBy(1, mult)); }
    else if (e.key === "ArrowDown") { e.preventDefault(); finishDraftThen(() => stepBy(-1, mult)); }
    else if (e.key === "PageUp") { e.preventDefault(); finishDraftThen(() => stepBy(1, 10)); }
    else if (e.key === "PageDown") { e.preventDefault(); finishDraftThen(() => stepBy(-1, 10)); }
    else if (e.key === "Home" && min !== undefined && draft === null) { e.preventDefault(); commit(min); }
    else if (e.key === "End" && max !== undefined && draft === null) { e.preventDefault(); commit(max); }
    else if (e.key === "Enter") finish();
    else if (e.key === "Escape") setDraft(null);
  };

  // apply a pending typed draft first so arrow stepping continues from what the user typed
  const finishDraftThen = (fn: () => void) => {
    if (draft !== null) {
      const n = parse(draft);
      if (n !== null) valueRef.current = clamp(n);
    }
    fn();
  };

  const display = draft ?? (current === null ? "" : fmt.format(current));
  const atMin = current !== null && min !== undefined && current <= min;
  const atMax = current !== null && max !== undefined && current >= max;
  const borderColor = focused ? p.focus : hovered ? p.borderHover : p.border;

  const stepBtn = (kind: "minus" | "plus", blocked: boolean, extra?: React.CSSProperties) => (
    <motion.button
      type="button"
      tabIndex={-1}
      aria-label={kind === "plus" ? "Increase" : "Decrease"}
      disabled={disabled || blocked}
      onPointerDown={(e) => {
        e.preventDefault();
        inputRef.current?.focus();
        startRepeat(kind === "plus" ? 1 : -1);
      }}
      onPointerUp={stopRepeat}
      onPointerLeave={stopRepeat}
      onPointerCancel={stopRepeat}
      whileTap={{ scale: 0.9 }}
      className="flex shrink-0 cursor-pointer items-center justify-center border-none outline-none disabled:cursor-default disabled:opacity-30"
      style={{ width: s.btn, height: s.btn, borderRadius: s.radius - 5, background: p.btn, color: p.text, transition: "background 0.14s ease", ...extra }}
      onMouseEnter={(e) => !blocked && (e.currentTarget.style.background = p.btnHover)}
      onMouseLeave={(e) => (e.currentTarget.style.background = p.btn)}
    >
      <Icon kind={layout === "stacked" ? (kind === "plus" ? "up" : "down") : kind} size={layout === "stacked" ? s.icon - 2 : s.icon} />
    </motion.button>
  );

  const stacked = layout === "stacked";

  return (
    <div className={cn("inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label htmlFor={`${uid}-input`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => inputRef.current?.focus()}
        className="flex items-center"
        style={{ height: s.height, padding: stacked ? `0 4px 0 14px` : "0 5px", gap: 6, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.18s ease, box-shadow 0.18s ease", cursor: disabled ? "default" : "text" }}
      >
        {!stacked && stepBtn("minus", atMin)}

        <div className="flex min-w-0 flex-1 items-center justify-center" style={{ gap: 4, fontSize: s.font, color: p.text }}>
          {prefix && <span style={{ color: p.muted, fontWeight: 500 }}>{prefix}</span>}
          <input
            ref={inputRef}
            id={`${uid}-input`}
            role="spinbutton"
            type="text"
            inputMode={prec > 0 || (min !== undefined && min < 0) ? "decimal" : "numeric"}
            autoComplete="off"
            disabled={disabled}
            value={display}
            placeholder={placeholder}
            aria-valuenow={current ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-describedby={helperText ? `${uid}-help` : undefined}
            onChange={(e) => setDraft(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              stopRepeat();
              finish();
            }}
            onKeyDown={onKeyDown}
            className={cn("min-w-0 border-none bg-transparent p-0 font-semibold tabular-nums outline-none", stacked && "flex-1")}
            style={{ color: p.text, fontSize: s.font, textAlign: stacked ? "left" : "center", width: stacked ? "100%" : `${Math.max(display.length, placeholder.length, 1) + 0.5}ch`, maxWidth: "100%" }}
          />
          {suffix && <span style={{ color: p.muted, fontWeight: 500 }}>{suffix}</span>}
        </div>

        {stacked ? (
          <div className="flex flex-col" style={{ gap: 2 }}>
            {stepBtn("plus", atMax, { width: s.btn - 4, height: (s.height - 12) / 2, borderRadius: s.radius - 7 })}
            {stepBtn("minus", atMin, { width: s.btn - 4, height: (s.height - 12) / 2, borderRadius: s.radius - 7 })}
          </div>
        ) : (
          stepBtn("plus", atMax)
        )}
      </div>

      {helperText && (
        <span id={`${uid}-help`} style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
