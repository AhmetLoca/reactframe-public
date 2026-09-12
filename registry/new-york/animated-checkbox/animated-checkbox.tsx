"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AnimatedCheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  style?: "checkbox" | "toggle";
  label?: string;
  optionalText?: boolean;
  required?: boolean;
  infoText?: string;
  helperText?: string;
  size?: number;
  radius?: number;
  borderWidth?: number;
  borderColor?: string;
  accentColor?: string;
  checkColor?: string;
  labelColor?: string;
  helperColor?: string;
  mutedColor?: string;
  requiredColor?: string;
  ringColor?: string;
  ringWidth?: number;
  duration?: number;
  className?: string;
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

export interface CheckboxVisualProps {
  isChecked: boolean;
  disabled: boolean;
  ring: boolean;
  style: "checkbox" | "toggle";
  size: number;
  radius: number;
  borderWidth: number;
  borderColor: string;
  accentColor: string;
  checkColor: string;
  ringColor: string;
  ringWidth: number;
  duration: number;
}

export function CheckboxVisual({ isChecked, disabled, ring, style, size, radius, borderWidth, borderColor, accentColor, checkColor, ringColor, ringWidth, duration }: CheckboxVisualProps) {
  const isToggle = style === "toggle";
  const iconSize = size * (isToggle ? 0.6 : 0.64);
  const checkStrokeWidth = isToggle ? 2.5 : 2;

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 box-border flex items-center justify-center"
      style={{ borderRadius: radius, border: `${borderWidth}px solid`, opacity: disabled ? 0.45 : 1 }}
      initial={false}
      animate={{
        backgroundColor: isChecked ? accentColor : "rgba(0,0,0,0)",
        borderColor: isChecked ? accentColor : borderColor,
        boxShadow: ring ? `0 0 0 ${ringWidth}px ${ringColor}` : "0 0 0 0px rgba(0,0,0,0)",
      }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={{ duration }}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 16 16" className="absolute">
        <motion.path
          d="M3 8.2L6.4 11.6L13 4.4"
          fill="none"
          stroke={checkColor}
          strokeWidth={checkStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ pathLength: isChecked ? 1 : 0, opacity: isChecked ? 1 : 0 }}
          transition={{ duration, ease: "easeInOut" }}
        />
      </svg>
    </motion.div>
  );
}

export function AnimatedCheckbox({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  style = "checkbox",
  label = "Accept terms and conditions",
  optionalText = false,
  required = false,
  infoText,
  helperText,
  size = 20,
  radius = 6,
  borderWidth = 1.5,
  borderColor = "#d1d5db",
  accentColor = "#7c3aed",
  checkColor = "#ffffff",
  labelColor = "#111111",
  helperColor = "#6b7280",
  mutedColor = "#9ca3af",
  requiredColor = "#ef4444",
  ringColor = "rgba(124,58,237,0.25)",
  ringWidth = 3,
  duration = 0.18,
  className,
}: AnimatedCheckboxProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const [focused, setFocused] = React.useState(false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <label
      aria-disabled={disabled}
      className={cn("inline-flex select-none gap-2.5", disabled ? "cursor-default" : "cursor-pointer", label ? "items-start" : "items-center", className)}
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <input
          type="checkbox"
          role={style === "toggle" ? "switch" : undefined}
          aria-checked={style === "toggle" ? isChecked : undefined}
          checked={isChecked}
          disabled={disabled}
          onChange={handleToggle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={label || "checkbox"}
          className="absolute inset-0 m-0 h-full w-full opacity-0"
          style={{ cursor: disabled ? "default" : "pointer" }}
        />
        <CheckboxVisual
          isChecked={isChecked}
          disabled={disabled}
          ring={focused}
          style={style}
          size={size}
          radius={radius}
          borderWidth={borderWidth}
          borderColor={borderColor}
          accentColor={accentColor}
          checkColor={checkColor}
          ringColor={ringColor}
          ringWidth={ringWidth}
          duration={duration}
        />
      </div>

      {label && (
        <div className="flex flex-col gap-1" style={{ paddingTop: Math.max(0, (size - 18) / 2) }}>
          <div className="flex items-center gap-1.5">
            <span className="text-sm leading-[1.3] font-semibold tracking-[-0.01em]" style={{ color: labelColor }}>
              {label}
            </span>
            {optionalText && (
              <span className="text-sm font-normal" style={{ color: mutedColor }}>
                (optional)
              </span>
            )}
            {required && (
              <span className="text-sm font-semibold" style={{ color: requiredColor }}>
                *
              </span>
            )}
            {infoText && (
              <span title={infoText} className="flex">
                <InfoIcon color={mutedColor} />
              </span>
            )}
          </div>
          {helperText && (
            <span className="text-[13px] leading-[1.4]" style={{ color: helperColor }}>
              {helperText}
            </span>
          )}
        </div>
      )}
    </label>
  );
}
