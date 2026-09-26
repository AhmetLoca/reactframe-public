"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface ButtonProps {
  label?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fontFamily?: string;
  height?: number;
  paddingX?: number;
  fontSize?: number;
  radius?: number;
  gap?: number;
  accentColor?: string;
  accentTextColor?: string;
  secondaryColor?: string;
  secondaryTextColor?: string;
  borderWidth?: number;
  ringColor?: string;
  ringWidth?: number;
  duration?: number;
  className?: string;
}

function Spinner({ size, color }: { size: number; color: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
    >
      <circle cx="8" cy="8" r="6.5" stroke={color} strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14.5 8a6.5 6.5 0 0 0-6.5-6.5" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </motion.svg>
  );
}

export function Button({
  label = "Button",
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  iconPosition = "left",
  fontFamily = "Inter, system-ui, sans-serif",
  height = 40,
  paddingX,
  fontSize,
  radius,
  gap,
  accentColor = "#f59e0b",
  accentTextColor = "#ffffff",
  secondaryColor = "#f3f4f6",
  secondaryTextColor = "#111827",
  borderWidth = 1.5,
  ringColor = "rgba(245,158,11,0.25)",
  ringWidth = 3,
  duration = 0.18,
  className,
}: ButtonProps) {
  const [focused, setFocused] = React.useState(false);
  const isInactive = disabled || loading;

  const resolvedPaddingX = paddingX ?? height * 0.55;
  const resolvedFontSize = fontSize ?? height * 0.35;
  const resolvedRadius = radius ?? height * 0.28;
  const resolvedGap = gap ?? height * 0.2;
  const spinnerSize = resolvedFontSize * 1.05;

  const variantStyle: React.CSSProperties =
    variant === "primary"
      ? { backgroundColor: accentColor, color: accentTextColor, border: "none" }
      : variant === "secondary"
        ? { backgroundColor: secondaryColor, color: secondaryTextColor, border: "none" }
        : variant === "outline"
          ? { backgroundColor: "transparent", color: accentColor, border: `${borderWidth}px solid ${accentColor}` }
          : { backgroundColor: "transparent", color: accentColor, border: "none" };

  const iconColor = variant === "primary" ? accentTextColor : variant === "secondary" ? secondaryTextColor : accentColor;

  const content = (
    <>
      {loading ? (
        <Spinner size={spinnerSize} color={iconColor} />
      ) : (
        icon && iconPosition === "left" && (
          <span className="flex shrink-0 items-center" style={{ color: iconColor }}>
            {icon}
          </span>
        )
      )}
      <span className="leading-none whitespace-nowrap">{label}</span>
      {!loading && icon && iconPosition === "right" && (
        <span className="flex shrink-0 items-center" style={{ color: iconColor }}>
          {icon}
        </span>
      )}
    </>
  );

  return (
    <motion.button
      type={type}
      onClick={isInactive ? undefined : onClick}
      disabled={isInactive}
      aria-busy={loading || undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={cn("box-border inline-flex items-center justify-center font-semibold select-none", fullWidth ? "w-full" : "w-fit", isInactive ? "cursor-not-allowed" : "cursor-pointer", className)}
      style={{
        height,
        paddingLeft: resolvedPaddingX,
        paddingRight: resolvedPaddingX,
        gap: resolvedGap,
        borderRadius: resolvedRadius,
        fontFamily,
        fontSize: resolvedFontSize,
        opacity: disabled ? 0.5 : loading ? 0.85 : 1,
        ...variantStyle,
      }}
      initial={false}
      animate={{ boxShadow: focused ? `0 0 0 ${ringWidth}px ${ringColor}` : "0 0 0 0px rgba(0,0,0,0)" }}
      whileHover={isInactive ? undefined : { scale: 1.02 }}
      whileTap={isInactive ? undefined : { scale: 0.96 }}
      transition={{ duration }}
    >
      {content}
    </motion.button>
  );
}
