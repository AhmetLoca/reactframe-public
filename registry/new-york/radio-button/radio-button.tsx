"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RadioButtonOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface RadioButtonProps {
  options?: RadioButtonOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  label?: string;
  direction?: "vertical" | "horizontal";
  variant?: "default" | "card";
  disabled?: boolean;
  size?: number;
  borderWidth?: number;
  borderColor?: string;
  accentColor?: string;
  dotColor?: string;
  labelColor?: string;
  helperColor?: string;
  ringColor?: string;
  ringWidth?: number;
  cardRadius?: number;
  duration?: number;
  className?: string;
}

const DEFAULT_OPTIONS: RadioButtonOption[] = [
  { value: "starter", label: "Starter", description: "For side projects and quick experiments" },
  { value: "pro", label: "Pro", description: "For teams shipping every week" },
  { value: "scale", label: "Scale", description: "Unlimited seats and priority support" },
];

interface RadioVisualProps {
  isChecked: boolean;
  disabled: boolean;
  ring: boolean;
  size: number;
  borderWidth: number;
  borderColor: string;
  accentColor: string;
  dotColor: string;
  ringColor: string;
  ringWidth: number;
  duration: number;
}

function RadioVisual({ isChecked, disabled, ring, size, borderWidth, borderColor, accentColor, dotColor, ringColor, ringWidth, duration }: RadioVisualProps) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 box-border flex items-center justify-center rounded-full"
      style={{
        borderWidth,
        borderStyle: "solid",
        borderColor: isChecked ? accentColor : borderColor,
        backgroundColor: isChecked ? accentColor : "transparent",
        boxShadow: ring ? `0 0 0 ${ringWidth}px ${ringColor}` : "0 0 0 0 transparent",
        opacity: disabled ? 0.45 : 1,
        transition: `border-color ${duration}s ease, background-color ${duration}s ease, box-shadow ${duration}s ease`,
      }}
      initial={false}
      whileTap={disabled ? undefined : { scale: 0.9 }}
    >
      <AnimatePresence>
        {isChecked && (
          <motion.span
            key="ripple"
            className="absolute inset-0 rounded-full"
            style={{ border: `${borderWidth}px solid ${accentColor}` }}
            initial={{ scale: 1, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.span
        className="block rounded-full"
        style={{ width: size * 0.4, height: size * 0.4, backgroundColor: dotColor }}
        initial={false}
        animate={{ scale: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
        transition={{ type: "spring", stiffness: 520, damping: 22 }}
      />
    </motion.div>
  );
}

export function RadioButton({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  name,
  label,
  direction = "vertical",
  variant = "default",
  disabled = false,
  size = 20,
  borderWidth = 1.5,
  borderColor = "color-mix(in srgb, currentColor 32%, transparent)",
  accentColor = "#F2A841",
  dotColor = "#0A0A0A",
  labelColor = "currentColor",
  helperColor = "color-mix(in srgb, currentColor 55%, transparent)",
  ringColor = "color-mix(in srgb, #F2A841 30%, transparent)",
  ringWidth = 3,
  cardRadius = 16,
  duration = 0.2,
  className,
}: RadioButtonProps) {
  const autoName = React.useId();
  const groupName = name ?? autoName;
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue ?? options[0]?.value);
  const [focusedValue, setFocusedValue] = React.useState<string | null>(null);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;
  const labelSize = size * 0.72;
  const helperSize = size * 0.62;
  const isCard = variant === "card";

  const select = (next: string) => {
    if (disabled) return;
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <div role="radiogroup" aria-label={label} aria-disabled={disabled} className={cn("inline-flex flex-col gap-3", className)} style={{ fontFamily: "Inter, sans-serif", color: labelColor }}>
      {label && (
        <div className="font-semibold tracking-[-0.01em]" style={{ fontSize: labelSize, color: labelColor }}>
          {label}
        </div>
      )}
      <div className={cn("flex", direction === "horizontal" ? "flex-row flex-wrap" : "flex-col")} style={{ gap: isCard ? 10 : size * 0.7 }}>
        {options.map((opt) => {
          const isChecked = current === opt.value;
          const isDisabled = disabled || opt.disabled;
          return (
            <label
              key={opt.value}
              className={cn("relative flex select-none items-start", isDisabled ? "cursor-default" : "cursor-pointer", isCard && "min-w-[220px]")}
              style={{
                gap: size * 0.55,
                padding: isCard ? size * 0.7 : 0,
                borderRadius: cardRadius,
                border: isCard ? `1px solid ${isChecked ? accentColor : "color-mix(in srgb, currentColor 14%, transparent)"}` : undefined,
                backgroundColor: isCard && isChecked ? `color-mix(in srgb, ${accentColor} 8%, transparent)` : undefined,
                opacity: opt.disabled && !disabled ? 0.5 : 1,
                transition: `border-color ${duration}s ease, background-color ${duration}s ease`,
              }}
            >
              <div className="relative shrink-0" style={{ width: size, height: size }}>
                <input
                  type="radio"
                  name={groupName}
                  value={opt.value}
                  checked={isChecked}
                  disabled={isDisabled}
                  onChange={() => select(opt.value)}
                  onFocus={(e) => setFocusedValue(e.currentTarget.matches(":focus-visible") ? opt.value : null)}
                  onBlur={() => setFocusedValue(null)}
                  className="absolute inset-0 m-0 h-full w-full opacity-0"
                  style={{ cursor: isDisabled ? "default" : "pointer" }}
                />
                <RadioVisual
                  isChecked={isChecked}
                  disabled={Boolean(isDisabled)}
                  ring={focusedValue === opt.value}
                  size={size}
                  borderWidth={borderWidth}
                  borderColor={borderColor}
                  accentColor={accentColor}
                  dotColor={dotColor}
                  ringColor={ringColor}
                  ringWidth={ringWidth}
                  duration={duration}
                />
              </div>
              <div className="flex flex-col gap-1" style={{ paddingTop: Math.max(0, (size - labelSize * 1.3) / 2) }}>
                <span className="leading-[1.3] font-semibold tracking-[-0.01em]" style={{ color: labelColor, fontSize: labelSize }}>
                  {opt.label}
                </span>
                {opt.description && (
                  <span className="leading-[1.4]" style={{ color: helperColor, fontSize: helperSize }}>
                    {opt.description}
                  </span>
                )}
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
