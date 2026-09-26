"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CopyButtonVariant = "ghost" | "outline" | "solid";
export type CopyButtonSize = "sm" | "md" | "lg";
type CopyState = "idle" | "copied" | "error";

export interface CopyButtonProps {
  /** The text to copy, or a function (sync or async) that produces it lazily, evaluated on click. */
  value: string | (() => string | Promise<string>);
  /** Shown next to the icon; omit for an icon-only button. */
  label?: string;
  copiedLabel?: string;
  errorLabel?: string;
  variant?: CopyButtonVariant;
  size?: CopyButtonSize;
  theme?: "dark" | "light";
  accentColor?: string;
  /** How long the copied/error state is shown before reverting, in ms. */
  resetDelay?: number;
  /** Icon-only buttons show a small floating tooltip on hover/focus by default. */
  showTooltip?: boolean;
  onCopy?: (value: string) => void;
  onError?: (error: unknown) => void;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.6)", border: "rgba(255,255,255,0.14)", hover: "rgba(255,255,255,0.08)", solidBg: "#F5F4F1", solidText: "#0A0A0A", tooltipBg: "#161616", tooltipBorder: "rgba(255,255,255,0.12)", error: "#FF7A6B", success: "#87FFE3" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.6)", border: "rgba(10,10,10,0.16)", hover: "rgba(10,10,10,0.06)", solidBg: "#0A0A0A", solidText: "#FFFFFF", tooltipBg: "#FFFFFF", tooltipBorder: "rgba(10,10,10,0.1)", error: "#E5484D", success: "#0F9F7F" },
};

const SIZES: Record<CopyButtonSize, { height: number; padX: number; font: number; icon: number; radius: number; gap: number }> = {
  sm: { height: 30, padX: 10, font: 12.5, icon: 14, radius: 9, gap: 6 },
  md: { height: 36, padX: 12, font: 13.5, icon: 15, radius: 10, gap: 7 },
  lg: { height: 42, padX: 15, font: 14.5, icon: 17, radius: 11, gap: 8 },
};

type Palette = (typeof PALETTES)["dark"];

function StateIcon({ state, size }: { state: CopyState; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {state === "copied" ? (
        <path d="M3 8.4L6.2 11.5L13 4.3" />
      ) : state === "error" ? (
        <path d="M4 4L12 12M12 4L4 12" />
      ) : (
        <>
          <rect x="5.7" y="5.7" width="8.3" height="8.8" rx="1.6" />
          <path d="M3.7 10.8A1.5 1.5 0 0 1 2.2 9.3V3.7A1.5 1.5 0 0 1 3.7 2.2h5.6a1.5 1.5 0 0 1 1.5 1.5" />
        </>
      )}
    </svg>
  );
}

function Tooltip({ label, anchorRef, p }: { label: string; anchorRef: React.RefObject<HTMLElement | null>; p: Palette }) {
  const [pos, setPos] = React.useState<{ x: number; bottom: number } | null>(null);
  React.useEffect(() => {
    const r = anchorRef.current?.getBoundingClientRect();
    // Anchored with `bottom` (from the viewport's bottom edge) rather than
    // `top` + a -100% transform: this component also animates `y` for its
    // little entrance slide, and Motion's animated y/scale/x replace
    // whatever `y` the style prop provides rather than composing with it —
    // so a static y:"-100%" anchor would just get clobbered by animate's
    // y:0 the moment the entrance finishes. `bottom` needs no y at all.
    if (r) setPos({ x: r.left + r.width / 2, bottom: window.innerHeight - r.top + 8 });
  }, [anchorRef]);
  if (typeof document === "undefined" || !pos) return null;
  return createPortal(
    <motion.span
      role="tooltip"
      initial={{ opacity: 0, y: 4, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 4, scale: 0.94 }}
      transition={{ duration: 0.12 }}
      className="pointer-events-none fixed z-[9999] font-medium whitespace-nowrap"
      style={{ left: pos.x, bottom: pos.bottom, x: "-50%", padding: "4px 8px", borderRadius: 7, background: p.tooltipBg, border: `1px solid ${p.tooltipBorder}`, color: p.text, fontSize: 12 }}
    >
      {label}
    </motion.span>,
    document.body,
  );
}

export function CopyButton({
  value,
  label,
  copiedLabel = "Copied",
  errorLabel = "Failed to copy",
  variant = "ghost",
  size = "md",
  theme = "dark",
  accentColor,
  resetDelay = 1600,
  showTooltip = true,
  onCopy,
  onError,
  disabled = false,
  className,
}: CopyButtonProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const iconOnly = !label;
  const [state, setState] = React.useState<CopyState>("idle");
  const [hovered, setHovered] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const settle = (next: CopyState) => {
    setState(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), resetDelay);
  };

  const handleClick = async () => {
    if (disabled || state !== "idle") return;
    try {
      const resolved = typeof value === "function" ? await value() : value;
      const cb = navigator.clipboard;
      if (!cb || typeof cb.writeText !== "function") throw new Error("Clipboard API unavailable");
      await cb.writeText(resolved);
      settle("copied");
      onCopy?.(resolved);
    } catch (err) {
      // clipboard can be blocked inside an embedded frame, or the value
      // function itself can throw/reject
      settle("error");
      onError?.(err);
    }
  };

  const stateColor = state === "copied" ? p.success : state === "error" ? p.error : undefined;
  const text = state === "copied" ? copiedLabel : state === "error" ? errorLabel : label;

  const variantStyle: React.CSSProperties =
    variant === "solid"
      ? { background: p.solidBg, color: p.solidText, border: "1px solid transparent" }
      : variant === "outline"
        ? { background: "transparent", color: p.text, border: `1px solid ${p.border}` }
        : { background: "transparent", color: p.text, border: "1px solid transparent" };

  const tooltipLabel = state === "copied" ? copiedLabel : state === "error" ? errorLabel : "Copy";

  return (
    <span className="relative inline-flex">
      <motion.button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={handleClick}
        aria-label={iconOnly ? tooltipLabel : undefined}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        whileTap={disabled ? undefined : { scale: 0.94 }}
        className={cn("inline-flex cursor-pointer items-center justify-center outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-45", className)}
        style={{
          height: s.height,
          width: iconOnly ? s.height : undefined,
          padding: iconOnly ? 0 : `0 ${s.padX}px`,
          borderRadius: s.radius,
          gap: s.gap,
          fontSize: s.font,
          fontWeight: 500,
          fontFamily: "Inter, sans-serif",
          color: stateColor ?? variantStyle.color,
          background: variant === "ghost" && hovered && state === "idle" ? p.hover : variantStyle.background,
          border: variantStyle.border,
          borderColor: variant === "outline" ? (stateColor ?? p.border) : undefined,
          transition: "background 0.14s ease, color 0.14s ease, border-color 0.14s ease",
          ["--tw-ring-color" as string]: accentColor ?? p.text,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={state} initial={{ opacity: 0, scale: 0.6, rotate: -20 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 0.6 }} transition={{ type: "spring", stiffness: 500, damping: 28 }} className="flex shrink-0 items-center justify-center">
            <StateIcon state={state} size={s.icon} />
          </motion.span>
        </AnimatePresence>
        {!iconOnly && (
          <span className="whitespace-nowrap" style={{ minWidth: 0 }}>
            {text}
          </span>
        )}
      </motion.button>
      {iconOnly && showTooltip && (
        <AnimatePresence>{hovered && !disabled && <Tooltip label={tooltipLabel} anchorRef={btnRef} p={p} />}</AnimatePresence>
      )}
    </span>
  );
}
