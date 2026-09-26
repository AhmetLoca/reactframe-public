"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PasswordInputSize = "sm" | "md" | "lg";

export interface PasswordInputProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  minLength?: number;
  showStrength?: boolean;
  showRequirements?: boolean;
  size?: PasswordInputSize;
  theme?: "dark" | "light";
  width?: number | string;
  name?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.16)", bg: "rgba(255,255,255,0.03)", hover: "rgba(255,255,255,0.08)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", warn: "#F2A841", checkBg: "#F5F4F1", checkFg: "#0A0A0A" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.12)", bg: "#FFFFFF", hover: "rgba(10,10,10,0.06)", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", warn: "#B7791F", checkBg: "#0A0A0A", checkFg: "#FFFFFF" },
};

const SIZES: Record<PasswordInputSize, { font: number; height: number; radius: number; padX: number; icon: number }> = {
  sm: { font: 13, height: 36, radius: 11, padX: 12, icon: 15 },
  md: { font: 14.5, height: 44, radius: 13, padX: 14, icon: 17 },
  lg: { font: 16.5, height: 52, radius: 15, padX: 16, icon: 19 },
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];

function EyeIcon({ size, hidden }: { size: number; hidden: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1.8 10S5 4.5 10 4.5 18.2 10 18.2 10 15 15.5 10 15.5 1.8 10 1.8 10Z" />
      <circle cx="10" cy="10" r="2.5" />
      <motion.path d="M3.5 16.5L16.5 3.5" initial={false} animate={{ pathLength: hidden ? 1 : 0, opacity: hidden ? 1 : 0 }} transition={{ duration: 0.22, ease: "easeOut" }} />
    </svg>
  );
}

export function checkPassword(pw: string, minLength = 8) {
  const rules = [
    { id: "length", label: `At least ${minLength} characters`, ok: pw.length >= minLength },
    { id: "case", label: "Upper and lower case letters", ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
    { id: "number", label: "A number", ok: /\d/.test(pw) },
    { id: "symbol", label: "A symbol (e.g. ! @ #)", ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const passed = rules.filter((r) => r.ok).length;
  const score = pw.length === 0 ? 0 : Math.max(1, Math.min(4, passed - (pw.length < minLength ? 1 : 0) + (pw.length >= 14 && passed >= 3 ? 1 : 0)));
  return { rules, score };
}

export function PasswordInput({
  value,
  defaultValue = "",
  onValueChange,
  placeholder = "Enter your password",
  label,
  helperText,
  minLength = 8,
  showStrength = true,
  showRequirements = true,
  size = "md",
  theme = "dark",
  width = 340,
  name,
  autoComplete = "new-password",
  autoFocus,
  disabled = false,
  className,
}: PasswordInputProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const controlled = value !== undefined;
  const [internal, setInternal] = React.useState(defaultValue);
  const [visible, setVisible] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [caps, setCaps] = React.useState(false);
  const pw = controlled ? value : internal;
  const { rules, score } = React.useMemo(() => checkPassword(pw, minLength), [pw, minLength]);
  const borderColor = focused ? p.focus : hovered ? p.borderHover : p.border;
  const showPanel = (showStrength || showRequirements) && pw.length > 0;

  const update = (next: string) => {
    if (!controlled) setInternal(next);
    onValueChange?.(next);
  };

  const trackCaps = (e: React.KeyboardEvent<HTMLInputElement>) => setCaps(e.getModifierState?.("CapsLock") ?? false);

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
        style={{ height: s.height, padding: `0 6px 0 ${s.padX}px`, gap: 8, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.18s ease, box-shadow 0.18s ease", cursor: disabled ? "default" : "text" }}
      >
        <input
          ref={inputRef}
          id={`${uid}-input`}
          name={name}
          type={visible ? "text" : "password"}
          value={pw}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          disabled={disabled}
          spellCheck={false}
          autoCapitalize="off"
          aria-describedby={showPanel || helperText ? `${uid}-help` : undefined}
          onChange={(e) => update(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setCaps(false);
          }}
          onKeyDown={trackCaps}
          onKeyUp={trackCaps}
          className="min-w-0 flex-1 border-none bg-transparent p-0 font-medium outline-none placeholder:opacity-45"
          style={{ color: p.text, fontSize: s.font, letterSpacing: !visible && pw ? "0.12em" : undefined, ["--tw-placeholder-color" as string]: p.muted }}
        />

        <motion.button
          type="button"
          disabled={disabled}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setVisible((v) => !v)}
          whileTap={{ scale: 0.88 }}
          className="flex shrink-0 cursor-pointer items-center justify-center border-none bg-transparent outline-none focus-visible:ring-2 disabled:cursor-default"
          style={{ width: s.height - 14, height: s.height - 14, borderRadius: s.radius - 5, color: visible ? p.text : p.muted, transition: "background 0.14s ease, color 0.14s ease", ["--tw-ring-color" as string]: p.focus }}
          onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <EyeIcon size={s.icon} hidden={visible} />
        </motion.button>
      </div>

      <AnimatePresence initial={false}>
        {caps && (
          <motion.div key="caps" role="status" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.16 }} className="overflow-hidden">
            <div className="flex items-center gap-1.5" style={{ color: p.warn, fontSize: s.font - 1.5 }}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M8 2L3 8h3v3h4V8h3L8 2ZM6 13.5h4" />
              </svg>
              Caps Lock is on
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div id={`${uid}-help`} className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {showPanel && showStrength && (
            <motion.div key="strength" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="flex items-center gap-3 pt-0.5">
                <div className="flex flex-1 gap-1.5" role="meter" aria-label="Password strength" aria-valuemin={0} aria-valuemax={4} aria-valuenow={score} aria-valuetext={STRENGTH_LABELS[score]}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="relative h-1 flex-1 overflow-hidden rounded-full" style={{ background: p.faint }}>
                      <motion.div className="absolute inset-0 rounded-full" style={{ background: p.text, originX: 0 }} initial={false} animate={{ scaleX: score >= i ? 1 : 0, opacity: 0.35 + score * 0.16 }} transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                    </div>
                  ))}
                </div>
                <span className="w-11 text-right font-semibold" style={{ color: p.text, fontSize: s.font - 2 }} aria-hidden="true">
                  {STRENGTH_LABELS[score]}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false}>
          {showPanel && showRequirements && (
            <motion.ul key="rules" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="m-0 flex list-none flex-col gap-1.5 overflow-hidden p-0">
              {rules.map((r) => (
                <li key={r.id} className="flex items-center gap-2" style={{ color: r.ok ? p.text : p.muted, fontSize: s.font - 2, transition: "color 0.2s ease" }}>
                  <span className="relative flex shrink-0 items-center justify-center rounded-full" style={{ width: 15, height: 15, border: `1.5px solid ${r.ok ? p.checkBg : p.border}`, background: r.ok ? p.checkBg : "transparent", transition: "background 0.2s ease, border-color 0.2s ease" }}>
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <motion.path d="M2.5 6.5L5 9L9.5 3.5" stroke={p.checkFg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: r.ok ? 1 : 0, opacity: r.ok ? 1 : 0 }} transition={{ duration: 0.22, ease: "easeOut" }} />
                    </svg>
                  </span>
                  <span>{r.label}</span>
                  <span className="sr-only">{r.ok ? "(met)" : "(not met)"}</span>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>

        {helperText && !showPanel && <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>{helperText}</span>}
      </div>
    </div>
  );
}
