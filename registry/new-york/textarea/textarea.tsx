"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TextareaVariant = "outline" | "filled" | "underline";
export type TextareaResize = "none" | "vertical" | "both";

export interface TextareaProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  optionalText?: boolean;
  infoText?: string;
  label?: string;
  helperText?: string;
  errorText?: string;
  variant?: TextareaVariant;
  rows?: number;
  autoResize?: boolean;
  maxLength?: number;
  showCounter?: boolean;
  resize?: TextareaResize;
  fontFamily?: string;
  paddingX?: number;
  paddingY?: number;
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

export function Textarea({
  value,
  defaultValue = "",
  onChange,
  placeholder,
  disabled = false,
  required = false,
  optionalText = false,
  infoText,
  label,
  helperText,
  errorText,
  variant = "outline",
  rows = 4,
  autoResize = false,
  maxLength,
  showCounter = false,
  resize = "vertical",
  fontFamily = "Inter, system-ui, sans-serif",
  paddingX = 14,
  paddingY = 10,
  fontSize = 14,
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
}: TextareaProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const generatedId = React.useId();
  const textareaId = id ?? `textarea-${generatedId}`;
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const hasError = Boolean(errorText);

  const resolvedRadius = radius ?? (variant === "underline" ? 0 : 10);
  const labelSize = fontSize * 0.95;
  const helperSize = fontSize * 0.85;

  const activeBorderColor = hasError ? errorColor : focused ? accentColor : borderColor;
  const activeRingColor = hasError ? "rgba(239,68,68,0.25)" : ringColor;

  const variantStyle: React.CSSProperties =
    variant === "filled"
      ? { backgroundColor: backgroundColor ?? "color-mix(in srgb, currentColor 6%, transparent)", border: "none", borderBottom: `${borderWidth}px solid ${activeBorderColor}`, borderRadius: `${resolvedRadius}px ${resolvedRadius}px 0 0` }
      : variant === "underline"
        ? { backgroundColor: backgroundColor ?? "transparent", border: "none", borderBottom: `${borderWidth}px solid ${activeBorderColor}`, borderRadius: 0 }
        : { backgroundColor: backgroundColor ?? "transparent", border: `${borderWidth}px solid ${activeBorderColor}`, borderRadius: resolvedRadius };

  const autoSize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el || !autoResize) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize]);

  React.useEffect(() => {
    autoSize();
  }, [autoSize, currentValue]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const resolvedResize = autoResize ? "none" : resize;
  const counterText = maxLength ? `${currentValue.length} / ${maxLength}` : `${currentValue.length}`;

  return (
    <div className={cn("flex flex-col gap-1.5", fullWidth ? "w-full" : "w-fit", className)} style={{ fontFamily }}>
      {label && (
        <label htmlFor={textareaId} className="flex items-center gap-1.5">
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
        className={cn("box-border", fullWidth ? "w-full" : "w-fit")}
        style={{ opacity: disabled ? 0.5 : 1, ...variantStyle }}
        initial={false}
        animate={{ boxShadow: focused ? `0 0 0 ${ringWidth}px ${activeRingColor}` : "0 0 0 0px rgba(0,0,0,0)" }}
        transition={{ duration }}
      >
        <textarea
          ref={textareaRef}
          id={textareaId}
          name={name}
          value={currentValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          aria-invalid={hasError || undefined}
          aria-describedby={errorText || helperText || showCounter ? `${textareaId}-desc` : undefined}
          className="block w-full border-none bg-transparent outline-none placeholder-[color:var(--textarea-placeholder)]"
          style={{
            color: textColor,
            fontSize,
            fontFamily,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            paddingTop: paddingY,
            paddingBottom: paddingY,
            resize: resolvedResize,
            cursor: disabled ? "default" : "text",
            ["--textarea-placeholder" as string]: placeholderColor,
          }}
        />
      </motion.div>

      {(errorText || helperText || showCounter) && (
        <div id={`${textareaId}-desc`} className="flex items-start justify-between gap-2">
          <span className="leading-[1.4]" style={{ color: hasError ? errorColor : helperColor, fontSize: helperSize }}>
            {errorText || helperText}
          </span>
          {showCounter && (
            <span className="shrink-0 leading-[1.4] tabular-nums" style={{ color: mutedColor, fontSize: helperSize }}>
              {counterText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
