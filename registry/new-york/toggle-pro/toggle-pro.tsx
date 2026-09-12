"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TogglePropProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
  helperText?: string;
  fontFamily?: string;
  width?: number;
  height?: number;
  padding?: number;
  trackOnColor?: string;
  trackOffColor?: string;
  thumbColor?: string;
  ringColor?: string;
  ringWidth?: number;
  duration?: number;
  squish?: number;
  className?: string;
}

export interface ToggleVisualProps {
  isOn: boolean;
  disabled: boolean;
  ring: boolean;
  width: number;
  height: number;
  padding: number;
  trackOnColor: string;
  trackOffColor: string;
  thumbColor: string;
  ringColor: string;
  ringWidth: number;
  duration: number;
  squish: number;
}

export function ToggleVisual({ isOn, disabled, ring, width, height, padding, trackOnColor, trackOffColor, thumbColor, ringColor, ringWidth, duration, squish }: ToggleVisualProps) {
  const thumbSize = Math.max(4, height - padding * 2);
  const maxX = Math.max(padding, width - thumbSize - padding);
  const thumbX = isOn ? maxX : padding;

  return (
    <motion.div
      className="relative box-border shrink-0"
      style={{ width, height, borderRadius: height / 2, opacity: disabled ? 0.45 : 1 }}
      initial={false}
      animate={{
        backgroundColor: isOn ? trackOnColor : trackOffColor,
        boxShadow: ring ? `0 0 0 ${ringWidth}px ${ringColor}` : "0 0 0 0px rgba(0,0,0,0)",
      }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={{ duration }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{ top: padding, left: 0, width: thumbSize, height: thumbSize, backgroundColor: thumbColor, boxShadow: "0 1px 2px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.15)" }}
        initial={false}
        animate={{ x: thumbX, scaleX: [1, 1 + squish, 1], scaleY: [1, 1 - squish * 0.6, 1] }}
        transition={{ duration, times: [0, 0.45, 1], ease: "easeInOut" }}
      />
    </motion.div>
  );
}

export function TogglePro({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  label,
  labelPosition = "right",
  helperText,
  fontFamily = "Inter, system-ui, sans-serif",
  width = 52,
  height = 30,
  padding = 3,
  trackOnColor = "#0A0A0A",
  trackOffColor = "#D1D5DB",
  thumbColor = "#FFFFFF",
  ringColor = "rgba(10,10,10,0.25)",
  ringWidth = 3,
  duration = 0.35,
  squish = 0.35,
  className,
}: TogglePropProps) {
  const isControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const isOn = isControlled ? checked : internalChecked;
  const [focused, setFocused] = React.useState(false);

  const handleToggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
  };

  return (
    <label
      className={cn(
        "inline-flex items-center gap-2.5 select-none",
        disabled ? "cursor-default" : "cursor-pointer",
        labelPosition === "left" && "flex-row-reverse",
        className,
      )}
    >
      <span className="relative shrink-0" style={{ width, height }}>
        <input
          type="checkbox"
          role="switch"
          aria-checked={isOn}
          checked={isOn}
          disabled={disabled}
          onChange={handleToggle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-label={label || "toggle"}
          className={cn("absolute inset-0 m-0 h-full w-full opacity-0", disabled ? "cursor-default" : "cursor-pointer")}
        />
        <ToggleVisual
          isOn={isOn}
          disabled={disabled}
          ring={focused}
          width={width}
          height={height}
          padding={padding}
          trackOnColor={trackOnColor}
          trackOffColor={trackOffColor}
          thumbColor={thumbColor}
          ringColor={ringColor}
          ringWidth={ringWidth}
          duration={duration}
          squish={squish}
        />
      </span>

      {label && (
        <span className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[#f5f4f1]" style={{ fontFamily }}>
            {label}
          </span>
          {helperText && (
            <span className="text-[13px] leading-snug text-[#f5f4f1]/60" style={{ fontFamily }}>
              {helperText}
            </span>
          )}
        </span>
      )}
    </label>
  );
}
