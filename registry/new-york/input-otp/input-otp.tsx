"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type InputOTPSize = "sm" | "md" | "lg";
export type InputOTPStatus = "idle" | "error" | "success";

export interface InputOTPProps {
  length?: number;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  type?: "numeric" | "alphanumeric";
  mask?: boolean;
  groupSize?: number;
  status?: InputOTPStatus;
  label?: string;
  helperText?: string;
  errorText?: string;
  size?: InputOTPSize;
  theme?: "dark" | "light";
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", filled: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.9)", error: "#FF7A6B", success: "#F5F4F1" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", filled: "rgba(10,10,10,0.04)", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.9)", error: "#E5484D", success: "#0A0A0A" },
};

const SIZES: Record<InputOTPSize, { w: number; h: number; font: number; radius: number; gap: number; label: number }> = {
  sm: { w: 36, h: 44, font: 18, radius: 11, gap: 8, label: 13 },
  md: { w: 46, h: 56, font: 24, radius: 14, gap: 10, label: 14.5 },
  lg: { w: 56, h: 68, font: 30, radius: 16, gap: 12, label: 16 },
};

export function InputOTP({
  length = 6,
  value,
  defaultValue = "",
  onValueChange,
  onComplete,
  type = "numeric",
  mask = false,
  groupSize,
  status = "idle",
  label,
  helperText,
  errorText,
  size = "md",
  theme = "dark",
  autoFocus = false,
  disabled = false,
  className,
}: InputOTPProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(-1);
  const [shakeKey, setShakeKey] = React.useState(0);
  const [prevStatus, setPrevStatus] = React.useState(status);
  const controlled = value !== undefined;

  const sanitize = React.useCallback(
    (raw: string) => (type === "numeric" ? raw.replace(/\D/g, "") : raw.replace(/[^a-zA-Z0-9]/g, "")).slice(0, length),
    [type, length],
  );
  const current = sanitize(controlled ? value : internal);

  if (status !== prevStatus) {
    setPrevStatus(status);
    if (status === "error") setShakeKey((k) => k + 1);
  }

  const commit = (next: string) => {
    if (next === current) return;
    if (!controlled) setInternal(next);
    onValueChange?.(next);
    if (next.length === length) onComplete?.(next);
  };

  const activeIndex = Math.min(current.length, length - 1);
  const isError = status === "error";
  const isSuccess = status === "success";

  const groups = groupSize && groupSize > 0 && groupSize < length ? groupSize : 0;

  return (
    <div className={cn("inline-flex flex-col gap-3", className)} style={{ fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label id={`${uid}-label`} htmlFor={`${uid}-input`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.label }}>
          {label}
        </label>
      )}

      <motion.div
        key={shakeKey}
        className="relative inline-flex items-center"
        style={{ gap: s.gap }}
        animate={shakeKey > 0 ? { x: [0, -9, 9, -6, 6, -3, 3, 0] } : undefined}
        transition={{ duration: 0.42, ease: "easeOut" }}
        onClick={() => !disabled && inputRef.current?.focus()}
      >
        {Array.from({ length }).map((_, i) => {
          const char = current[i];
          const isActive = focused && !disabled && i === activeIndex;
          const showCaret = focused && i === current.length && current.length < length;
          const ring = isError ? p.error : isSuccess ? p.success : isActive ? p.focus : hovered === i ? p.borderHover : p.border;
          return (
            <React.Fragment key={i}>
              {groups > 0 && i > 0 && i % groups === 0 && (
                <span aria-hidden="true" style={{ width: Math.round(s.gap * 0.9), height: 2, borderRadius: 2, background: p.faint, flexShrink: 0 }} />
              )}
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(-1)}
                className="relative flex items-center justify-center"
                style={{ width: s.w, height: s.h, borderRadius: s.radius, background: char ? p.filled : p.bg, border: `1px solid ${ring}`, boxShadow: isActive || isError || isSuccess ? `0 0 0 3px color-mix(in srgb, ${ring} 16%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.16s ease, box-shadow 0.16s ease, background 0.16s ease", cursor: disabled ? "default" : "text" }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  {char && (
                    <motion.span
                      key={`${i}-${char}`}
                      initial={{ scale: 0.4, opacity: 0, y: 6 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.6, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 520, damping: 26 }}
                      className="font-semibold tabular-nums"
                      style={{ color: p.text, fontSize: mask ? s.font * 0.6 : s.font, lineHeight: 1 }}
                    >
                      {mask ? "●" : char}
                    </motion.span>
                  )}
                </AnimatePresence>
                {showCaret && (
                  <motion.span aria-hidden="true" className="absolute" style={{ width: 2, height: s.font, borderRadius: 2, background: p.text }} animate={{ opacity: [1, 1, 0, 0] }} transition={{ duration: 1.05, repeat: Infinity, times: [0, 0.5, 0.5, 1] }} />
                )}
              </div>
            </React.Fragment>
          );
        })}

        <input
          ref={inputRef}
          id={`${uid}-input`}
          value={current}
          disabled={disabled}
          autoFocus={autoFocus}
          autoComplete="one-time-code"
          inputMode={type === "numeric" ? "numeric" : "text"}
          maxLength={length * 2}
          aria-label={label ? undefined : "One-time code"}
          aria-describedby={helperText || errorText ? `${uid}-help` : undefined}
          aria-invalid={isError || undefined}
          onChange={(e) => commit(sanitize(e.target.value))}
          onFocus={(e) => {
            setFocused(true);
            const end = e.currentTarget.value.length;
            requestAnimationFrame(() => e.currentTarget.setSelectionRange(end, end));
          }}
          onBlur={() => setFocused(false)}
          onSelect={(e) => {
            const el = e.currentTarget;
            if (el.selectionStart !== el.value.length || el.selectionEnd !== el.value.length) el.setSelectionRange(el.value.length, el.value.length);
          }}
          className="absolute inset-0 h-full w-full cursor-text border-none bg-transparent opacity-0 outline-none"
          style={{ caretColor: "transparent", color: "transparent" }}
        />
      </motion.div>

      <AnimatePresence mode="wait" initial={false}>
        {(isError && errorText) || helperText ? (
          <motion.span key={isError && errorText ? "err" : "help"} id={`${uid}-help`} role={isError ? "alert" : undefined} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} style={{ color: isError && errorText ? p.error : p.muted, fontSize: s.label - 1.5, lineHeight: 1.4 }}>
            {isError && errorText ? errorText : helperText}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
