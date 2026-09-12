"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type BadgeTone = "neutral" | "success" | "error" | "warning" | "info" | "purple" | "orange" | "indigo" | "custom";
type BadgePaletteTone = Exclude<BadgeTone, "custom">;
export type BadgeIconType = "none" | "check" | "cross" | "minus" | "dot" | "spinner" | "custom";
export type BadgeSize = "sm" | "md" | "lg";
export type BadgeTheme = "light" | "dark";

interface ColorSet {
  bg: string;
  text: string;
  border: string;
}

export interface BadgeProps {
  label: string;
  icon?: BadgeIconType;
  customIcon?: React.ReactNode;
  tone?: BadgeTone;
  /** Used when `tone="custom"`; falls back to the neutral palette if omitted. */
  customColors?: ColorSet;
  size?: BadgeSize;
  theme?: BadgeTheme;
  fontFamily?: string;
  fontWeight?: number | string;
  closable?: boolean;
  onClose?: () => void;
  className?: string;
}

const TONE_PALETTES: Record<BadgePaletteTone, { light: ColorSet; dark: ColorSet }> = {
  neutral: { light: { bg: "#F4F4F5", text: "#52525B", border: "#E4E4E7" }, dark: { bg: "#27272A", text: "#D4D4D8", border: "#3F3F46" } },
  success: { light: { bg: "#EAFBF0", text: "#16A34A", border: "#D1F4DF" }, dark: { bg: "#0F2A1C", text: "#6EE7B7", border: "#1C4A30" } },
  error: { light: { bg: "#FDF1F4", text: "#D6336C", border: "#FBD9E3" }, dark: { bg: "#321019", text: "#FB91B5", border: "#56202E" } },
  warning: { light: { bg: "#FFF9E6", text: "#B45309", border: "#FCEFC7" }, dark: { bg: "#2E2410", text: "#FCD34D", border: "#4D3D14" } },
  info: { light: { bg: "#EFF6FF", text: "#2563EB", border: "#DBEAFE" }, dark: { bg: "#0E1F36", text: "#93C5FD", border: "#1E3A5F" } },
  purple: { light: { bg: "#FAF5FF", text: "#9333EA", border: "#F3E8FF" }, dark: { bg: "#271A38", text: "#D8B4FE", border: "#3E2A57" } },
  orange: { light: { bg: "#FFF4ED", text: "#C2410C", border: "#FFE4D5" }, dark: { bg: "#2E1A0E", text: "#FDBA86", border: "#4A2A15" } },
  indigo: { light: { bg: "#EEF1FF", text: "#4338CA", border: "#E0E4FF" }, dark: { bg: "#1A1F3A", text: "#A5B4FC", border: "#2E335C" } },
};

const SIZE_PRESETS: Record<BadgeSize, { height: number; fontSize: number; paddingX: number; iconSize: number; gap: number }> = {
  sm: { height: 22, fontSize: 11, paddingX: 9, iconSize: 11, gap: 4 },
  md: { height: 27, fontSize: 12.5, paddingX: 11, iconSize: 12.5, gap: 5 },
  lg: { height: 33, fontSize: 14, paddingX: 14, iconSize: 14, gap: 6 },
};

const ICON_PATHS: Record<"check" | "cross" | "minus", string> = {
  check: "M3 8.3L6.3 11.6L13 4.3",
  cross: "M4 4L12 12M12 4L4 12",
  minus: "M3.5 8H12.5",
};

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return reduced;
}

function SpinnerIcon({ size, color }: { size: number; color: string }) {
  const r = size * 0.4;
  const c = 2 * Math.PI * r;
  const dash = c * 0.28;
  const reducedMotion = usePrefersReducedMotion();
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0"
      animate={reducedMotion ? { rotate: 0 } : { rotate: 360 }}
      transition={reducedMotion ? { duration: 0 } : { duration: 0.85, repeat: Infinity, ease: "linear" }}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={1.6} strokeOpacity={0.25} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`} />
    </motion.svg>
  );
}

function BadgeIcon({ icon, customIcon, size, color }: { icon: BadgeIconType; customIcon?: React.ReactNode; size: number; color: string }) {
  switch (icon) {
    case "none":
      return null;
    case "dot":
      return <span className="shrink-0 rounded-full" style={{ width: size * 0.5, height: size * 0.5, backgroundColor: color }} />;
    case "spinner":
      return <SpinnerIcon size={size} color={color} />;
    case "custom":
      return (
        <span className="inline-flex shrink-0 items-center leading-none" style={{ fontSize: size * 1.1 }}>
          {customIcon}
        </span>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className="shrink-0">
          <path d={ICON_PATHS[icon]} stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}

export function Badge({
  label,
  icon = "none",
  customIcon,
  tone = "neutral",
  customColors,
  size = "md",
  theme = "light",
  fontFamily = "Inter, sans-serif",
  fontWeight = 600,
  closable = false,
  onClose,
  className,
}: BadgeProps) {
  const [visible, setVisible] = React.useState(true);
  const [hover, setHover] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const palette = tone === "custom" ? (customColors ?? TONE_PALETTES.neutral[theme]) : TONE_PALETTES[tone][theme];
  const dims = SIZE_PRESETS[size];

  const dismiss = () => {
    setVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.span
          initial={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-full border leading-none", className)}
          style={{
            gap: dims.gap,
            height: dims.height,
            padding: `0 ${dims.paddingX}px`,
            backgroundColor: palette.bg,
            borderColor: palette.border,
            color: palette.text,
            fontSize: dims.fontSize,
            fontFamily,
            fontWeight,
          }}
        >
          <BadgeIcon icon={icon} customIcon={customIcon} size={dims.iconSize} color={palette.text} />
          {label}
          {closable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                dismiss();
              }}
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              aria-label="Dismiss"
              className="-mr-0.5 inline-flex shrink-0 items-center justify-center rounded-full border-0 p-0 transition-[opacity,background-color,box-shadow] duration-150"
              style={{
                width: dims.iconSize + 8,
                height: dims.iconSize + 8,
                opacity: hover || focused ? 1 : 0.55,
                backgroundColor: hover || focused ? "rgba(128,128,128,0.18)" : "transparent",
                boxShadow: focused ? `0 0 0 2px ${palette.text}` : "none",
              }}
            >
              <X style={{ width: dims.iconSize * 0.85, height: dims.iconSize * 0.85 }} color={palette.text} />
            </button>
          )}
        </motion.span>
      )}
    </AnimatePresence>
  );
}
