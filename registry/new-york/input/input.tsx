"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type InputVariant = "outline" | "filled" | "underline";
export type InputType = "text" | "email" | "password" | "number" | "search" | "tel" | "url";

export interface InputProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  type?: InputType;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  optionalText?: boolean;
  infoText?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: InputVariant;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fontFamily?: string;
  height?: number;
  paddingX?: number;
  fontSize?: number;
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  textColor?: string;
  placeholderColor?: string;
  labelColor?: string;
  helperColor?: string;
  mutedColor?: string;
  requiredColor?: string;
  errorColor?: string;
  accentColor?: string;
  ringColor?: string;
  ringWidth?: number;
  duration?: number;
  fullWidth?: boolean;
  className?: string;
  id?: string;
  name?: string;
}

export function InfoIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="8" cy="8" r="6.75" stroke={color} strokeWidth="1.4" />
      <line x1="8" y1="7.2" x2="8" y2="11.2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="8" cy="4.7" r="0.9" fill={color} />
    </svg>
  );
}

function EyeIcon({ color, size = 16, off }: { color: string; size?: number; off: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path d="M1 8s2.5-4.5 7-4.5S15 8 15 8s-2.5 4.5-7 4.5S1 8 1 8Z" stroke={color} strokeWidth="1.4" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" stroke={color} strokeWidth="1.4" />
      {off && <line x1="2" y1="14" x2="14" y2="2" stroke={color} strokeWidth="1.4" strokeLinecap="round" />}
    </svg>
  );
}

export function Input({
  value,
  defaultValue = "",
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  optionalText = false,
  infoText,
  label,
  helperText,
  errorText,
  variant = "outline",
  leadingIcon,
  trailingIcon,
  fontFamily = "Inter, system-ui, sans-serif",
  height = 40,
  paddingX,
  fontSize,
  radius,
  borderWidth = 1.5,
  borderColor = "#d1d5db",
  backgroundColor,
  textColor = "currentColor",
  placeholderColor = "color-mix(in srgb, currentColor 40%, transparent)",
  labelColor = "currentColor",
  helperColor = "color-mix(in srgb, currentColor 60%, transparent)",
  mutedColor = "color-mix(in srgb, currentColor 45%, transparent)",
  requiredColor = "#ef4444",
  errorColor = "#ef4444",
  accentColor = "#f59e0b",
  ringColor = "rgba(245,158,11,0.25)",
  ringWidth = 3,
  duration = 0.18,
  fullWidth = true,
  className,
  id,
  name,
}: InputProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const generatedId = React.useId();
  const inputId = id ?? `input-${generatedId}`;
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasError = Boolean(errorText);

  const resolvedFontSize = fontSize ?? height * 0.35;
  const resolvedPaddingX = paddingX ?? height * 0.4;
  const resolvedRadius = radius ?? (variant === "underline" ? 0 : height * 0.22);
  const labelSize = resolvedFontSize * 0.95;
  const helperSize = resolvedFontSize * 0.85;
  const iconSize = resolvedFontSize * 1.05;

  const activeBorderColor = hasError ? errorColor : focused ? accentColor : borderColor;
  const activeRingColor = hasError ? "rgba(239,68,68,0.25)" : ringColor;

  const variantStyle: React.CSSProperties =
    variant === "filled"
      ? { backgroundColor: backgroundColor ?? "color-mix(in srgb, currentColor 6%, transparent)", border: "none", borderBottom: `${borderWidth}px solid ${activeBorderColor}`, borderRadius: `${resolvedRadius}px ${resolvedRadius}px 0 0` }
      : variant === "underline"
        ? { backgroundColor: backgroundColor ?? "transparent", border: "none", borderBottom: `${borderWidth}px solid ${activeBorderColor}`, borderRadius: 0 }
        : { backgroundColor: backgroundColor ?? "transparent", border: `${borderWidth}px solid ${activeBorderColor}`, borderRadius: resolvedRadius };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const resolvedType = type === "password" ? (revealed ? "text" : "password") : type;
  const showPasswordToggle = type === "password" && !trailingIcon;

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit", className)} style={{ fontFamily }}>
      {label && (
        <label htmlFor={inputId} className="flex items-center gap-1.5">
          <span className="font-semibold tracking-[-0.01em]" style={{ color: labelColor, fontSize: labelSize }}>
            {label}
          </span>
          {optionalText && (
            <span className="font-normal" style={{ color: mutedColor, fontSize: labelSize }}>
              (optional)
            </span>
          )}
          {required && (
            <span className="font-semibold" style={{ color: requiredColor, fontSize: labelSize }}>
              *
            </span>
          )}
          {infoText && (
            <span title={infoText} className="flex">
              <InfoIcon color={mutedColor} size={labelSize} />
            </span>
          )}
        </label>
      )}

      <motion.div
        className={cn("box-border flex items-center", fullWidth ? "w-full" : "w-fit")}
        style={{ height, paddingLeft: resolvedPaddingX, paddingRight: resolvedPaddingX, gap: resolvedPaddingX * 0.5, opacity: disabled ? 0.5 : 1, ...variantStyle }}
        initial={false}
        animate={{ boxShadow: focused ? `0 0 0 ${ringWidth}px ${activeRingColor}` : "0 0 0 0px rgba(0,0,0,0)" }}
        transition={{ duration }}
      >
        {leadingIcon && (
          <span className="flex shrink-0 items-center" style={{ color: mutedColor }}>
            {leadingIcon}
          </span>
        )}
        <input
          id={inputId}
          name={name}
          type={resolvedType}
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={errorText || helperText ? `${inputId}-desc` : undefined}
          className="h-full min-w-0 flex-1 border-none bg-transparent outline-none placeholder-[color:var(--input-placeholder)]"
          style={{ color: textColor, fontSize: resolvedFontSize, cursor: disabled ? "default" : "text", ["--input-placeholder" as string]: placeholderColor }}
        />
        {showPasswordToggle ? (
          <button
            type="button"
            onClick={() => setRevealed((r) => !r)}
            tabIndex={-1}
            aria-label={revealed ? "Hide password" : "Show password"}
            className="flex shrink-0 cursor-pointer items-center border-none bg-transparent p-0"
            style={{ color: mutedColor }}
          >
            <EyeIcon color={mutedColor} size={iconSize} off={revealed} />
          </button>
        ) : (
          trailingIcon && (
            <span className="flex shrink-0 items-center" style={{ color: mutedColor }}>
              {trailingIcon}
            </span>
          )
        )}
      </motion.div>

      {(errorText || helperText) && (
        <span id={`${inputId}-desc`} className="leading-[1.4]" style={{ color: hasError ? errorColor : helperColor, fontSize: helperSize }}>
          {errorText || helperText}
        </span>
      )}
    </div>
  );
}
