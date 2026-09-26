"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type FormFieldSize = "sm" | "md" | "lg";
export type FormFieldStatus = "idle" | "validating" | "success" | "error";

/** Props wired onto the control inside the field, for custom children. */
export interface FormFieldControlProps {
  id: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-required"?: boolean;
}

export interface FormFieldProps {
  label: string;
  /** A line under the label, e.g. what the value is used for. */
  description?: string;
  /** Shown in a small tooltip on the info icon next to the label. */
  info?: string;
  required?: boolean;
  /** Marks the label "(optional)"; ignored when required. */
  optional?: boolean;
  helperText?: string;
  /** Forces an error message (e.g. from the server). */
  errorText?: string;
  /** Shown in the success state, e.g. "Username is available". */
  successText?: string;
  /** Runs on blur, then on every change once an error has shown. Return a message or null. May be async. */
  validate?: (value: string) => string | null | undefined | Promise<string | null | undefined>;
  /** Shows the counter; the built-in input also stops at this length. */
  maxLength?: number;
  /** Built-in input only. */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  type?: "text" | "email" | "password" | "url" | "search" | "tel";
  placeholder?: string;
  multiline?: boolean;
  name?: string;
  autoComplete?: string;
  /** Your own control. A single element gets id and aria props cloned in; a function receives them. */
  children?: React.ReactElement | ((control: FormFieldControlProps) => React.ReactNode);
  size?: FormFieldSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.3)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", tipBg: "#161616", tipBorder: "rgba(255,255,255,0.12)", error: "#FF7A6B", success: "#F5F4F1" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.3)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", tipBg: "#FFFFFF", tipBorder: "rgba(10,10,10,0.12)", error: "#E5484D", success: "#0A0A0A" },
};

const SIZES: Record<FormFieldSize, { font: number; height: number; padX: number; radius: number }> = {
  sm: { font: 13, height: 36, padX: 12, radius: 11 },
  md: { font: 14.5, height: 44, padX: 14, radius: 13 },
  lg: { font: 16, height: 52, padX: 16, radius: 15 },
};

function Spinner({ color, size }: { color: string; size: number }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}>
      <circle cx="8" cy="8" r="6" stroke={color} strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

function StatusIcon({ status, color }: { status: "error" | "success"; color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true" style={{ marginTop: 1 }}>
      <circle cx="8" cy="8" r="6.75" stroke={color} strokeWidth="1.4" />
      {status === "success" ? (
        <motion.path d="M5 8.2L7.1 10.3L11 6" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease: "easeOut" }} />
      ) : (
        <path d="M8 4.8V8.6M8 11.1v.1" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

function InfoTip({ text, p, uid }: { text: string; p: (typeof PALETTES)["dark"]; uid: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label="More info"
        aria-describedby={open ? `${uid}-tip` : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="flex cursor-help items-center justify-center rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2"
        style={{ width: 16, height: 16, color: p.muted, ["--tw-ring-color" as string]: p.focus }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.4" />
          <path d="M8 7.2v4M8 4.7v.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            id={`${uid}-tip`}
            role="tooltip"
            className="absolute left-1/2 z-50 font-normal"
            style={{ bottom: "calc(100% + 8px)", width: "max-content", maxWidth: 240, padding: "7px 10px", borderRadius: 9, background: p.tipBg, border: `1px solid ${p.tipBorder}`, color: p.text, fontSize: 12.5, lineHeight: 1.45, letterSpacing: 0, boxShadow: "0 12px 30px rgba(0,0,0,0.3)", x: "-50%" }}
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.14 }}
          >
            {text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export function FormField({
  label,
  description,
  info,
  required = false,
  optional = false,
  helperText,
  errorText,
  successText,
  validate,
  maxLength,
  value,
  defaultValue = "",
  onValueChange,
  type = "text",
  placeholder,
  multiline = false,
  name,
  autoComplete,
  children,
  size = "md",
  theme = "dark",
  width = 340,
  disabled = false,
  className,
}: FormFieldProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const controlId = `${uid}-control`;
  const [internal, setInternal] = React.useState(defaultValue);
  const text = value !== undefined ? value : internal;
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);
  const [status, setStatus] = React.useState<FormFieldStatus>("idle");
  const [shaking, setShaking] = React.useState(0);
  const run = React.useRef(0);

  // "Reward early, punish late": check on blur; once an error is showing, re-check on every change
  // so it clears the moment the value is fixed.
  const check = async (v: string, fromBlur: boolean) => {
    if (!validate && !required) return;
    const id = ++run.current;
    const requiredMsg = required && v.trim() === "" ? `${label} is required` : null;
    let result: string | null | undefined = requiredMsg;
    if (!requiredMsg && validate) {
      const out = validate(v);
      if (out instanceof Promise) {
        setStatus("validating");
        result = await out;
      } else result = out;
    }
    if (id !== run.current) return;
    setMessage(result ?? null);
    if (result) {
      if (fromBlur && status !== "error") setShaking((n) => n + 1);
      setStatus("error");
    } else setStatus(v.trim() !== "" && successText ? "success" : "idle");
  };

  const onChange = (v: string) => {
    const next = maxLength ? v.slice(0, maxLength) : v;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    // Once the field has been checked (error, pending or success), keep it in sync while typing.
    if (status !== "idle") void check(next, false);
  };

  const shownError = errorText ?? (status === "error" ? message : null);
  const shownSuccess = !shownError && status === "success" ? successText : null;
  const msg = shownError ?? shownSuccess ?? helperText ?? null;
  const msgKind: "error" | "success" | "helper" = shownError ? "error" : shownSuccess ? "success" : "helper";

  const describedBy = [description ? `${uid}-desc` : null, msg ? `${uid}-msg` : null].filter(Boolean).join(" ") || undefined;
  const controlProps: FormFieldControlProps = { id: controlId, "aria-describedby": describedBy, "aria-invalid": shownError ? true : undefined, "aria-required": required || undefined };

  const count = text.length;
  const near = maxLength ? count / maxLength >= 0.9 : false;
  const borderColor = shownError ? p.error : focused ? p.focus : hovered ? p.borderHover : p.border;
  const ring = shownError ? p.error : p.focus;

  let control: React.ReactNode;
  if (typeof children === "function") control = children(controlProps);
  else if (children && React.isValidElement(children)) control = React.cloneElement(children as React.ReactElement<FormFieldControlProps>, controlProps);
  else {
    const inputClass = "w-full border-none bg-transparent outline-none placeholder:text-[color:var(--ff-placeholder)]";
    const inputStyle: React.CSSProperties = { color: p.text, fontSize: s.font, fontWeight: 500, fontFamily: "inherit", ["--ff-placeholder" as string]: p.faint };
    const onBlur = () => {
      setFocused(false);
      void check(text, true);
    };
    control = (
      <motion.div
        key={shaking}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={shaking ? { x: [0, -6, 5, -3, 2, 0] } : undefined}
        transition={{ duration: 0.36 }}
        className="flex items-center"
        style={{ minHeight: s.height, padding: multiline ? `${s.padX * 0.7}px ${s.padX}px` : `0 ${s.padX}px`, gap: 8, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: focused || shownError ? `0 0 0 3px color-mix(in srgb, ${ring} 14%, transparent)` : "0 0 0 0 transparent", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
      >
        {multiline ? (
          <textarea {...controlProps} name={name} autoComplete={autoComplete} disabled={disabled} placeholder={placeholder} value={text} maxLength={maxLength} rows={4} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={onBlur} className={cn(inputClass, "resize-y")} style={{ ...inputStyle, lineHeight: 1.5 }} />
        ) : (
          <input {...controlProps} type={type} name={name} autoComplete={autoComplete} disabled={disabled} placeholder={placeholder} value={text} maxLength={maxLength} onChange={(e) => onChange(e.target.value)} onFocus={() => setFocused(true)} onBlur={onBlur} className={inputClass} style={{ ...inputStyle, height: s.height - 2 }} />
        )}
        <AnimatePresence>
          {status === "validating" && (
            <motion.span key="spin" className="flex shrink-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Spinner color={p.muted} size={s.font} />
            </motion.span>
          )}
          {status === "success" && (
            <motion.span key="ok" className="flex shrink-0" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.6 }}>
              <svg width={s.font + 1} height={s.font + 1} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <motion.path d="M3 8.2L6.4 11.6L13 4.4" stroke={p.success} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className={cn("inline-flex flex-col", className)} style={{ width, maxWidth: "100%", gap: 8, fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      <div className="flex flex-col" style={{ gap: 3 }}>
        <div className="flex items-center" style={{ gap: 6 }}>
          <label htmlFor={controlId} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
            {label}
            {required && (
              <span aria-hidden="true" style={{ color: p.error, marginLeft: 3 }}>
                *
              </span>
            )}
            {!required && optional && <span style={{ color: p.muted, fontWeight: 500, marginLeft: 6, fontSize: s.font - 1.5 }}>(optional)</span>}
          </label>
          {info && <InfoTip text={info} p={p} uid={uid} />}
          <span className="flex-1" />
          {maxLength !== undefined && (
            <motion.span aria-live="polite" animate={{ color: count >= maxLength ? p.error : near ? p.text : p.faint }} transition={{ duration: 0.2 }} style={{ fontSize: s.font - 2.5, fontVariantNumeric: "tabular-nums", fontWeight: 500 }}>
              <span className="sr-only">{`${count} of ${maxLength} characters`}</span>
              <span aria-hidden="true">
                {count}/{maxLength}
              </span>
            </motion.span>
          )}
        </div>
        {description && (
          <span id={`${uid}-desc`} style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.45 }}>
            {description}
          </span>
        )}
      </div>

      {control}

      <div style={{ minHeight: helperText || validate || required || errorText ? s.font * 1.4 : 0 }}>
        <AnimatePresence initial={false} mode="wait">
          {msg && (
            <motion.span
              key={`${msgKind}-${msg}`}
              id={`${uid}-msg`}
              role={msgKind === "error" ? "alert" : undefined}
              className="flex items-start"
              style={{ gap: 6, color: msgKind === "error" ? p.error : msgKind === "success" ? p.success : p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
            >
              {msgKind !== "helper" && <StatusIcon status={msgKind} color={msgKind === "error" ? p.error : p.success} />}
              {msg}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
