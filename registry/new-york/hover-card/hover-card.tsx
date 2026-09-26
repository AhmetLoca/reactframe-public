"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type HoverCardPlacement = "top" | "bottom" | "left" | "right";
export type HoverCardAlign = "start" | "center" | "end";

export interface HoverCardProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Delay before opening once the trigger is hovered, in ms. */
  openDelay?: number;
  /** Delay before closing once the pointer leaves the trigger and the card, in ms. */
  closeDelay?: number;
  placement?: HoverCardPlacement;
  align?: HoverCardAlign;
  offset?: number;
  arrow?: boolean;
  width?: number;
  theme?: "dark" | "light";
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.1)", text: "#F5F4F1", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.12)", text: "#0A0A0A", shadow: "0 20px 50px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)" },
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Position {
  left: number;
  top: number;
  placement: HoverCardPlacement;
}

export function HoverCard({
  children,
  content,
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 300,
  closeDelay = 150,
  placement = "bottom",
  align = "center",
  offset = 10,
  arrow = true,
  width = 300,
  theme = "dark",
  disabled = false,
  className,
}: HoverCardProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const openTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [internal, setInternal] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<Position | null>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internal;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const scheduleOpen = (delay: number) => {
    if (disabled) return;
    clearTimers();
    openTimer.current = setTimeout(() => setOpen(true), delay);
  };

  const scheduleClose = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };

  const measure = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let place = placement;
    if (place === "top" && r.top < 200) place = "bottom";
    else if (place === "bottom" && window.innerHeight - r.bottom < 200) place = "top";
    else if (place === "left" && r.left < width + 40) place = "right";
    else if (place === "right" && window.innerWidth - r.right < width + 40) place = "left";
    const horizontal = place === "top" || place === "bottom";
    const along = horizontal ? (align === "start" ? r.left : align === "end" ? r.right : r.left + r.width / 2) : align === "start" ? r.top : align === "end" ? r.bottom : r.top + r.height / 2;
    const map: Record<HoverCardPlacement, Position> = {
      top: { left: along, top: r.top - offset, placement: "top" },
      bottom: { left: along, top: r.bottom + offset, placement: "bottom" },
      left: { left: r.left - offset, top: along, placement: "left" },
      right: { left: r.right + offset, top: along, placement: "right" },
    };
    setPos(map[place]);
  }, [placement, align, offset, width]);

  React.useEffect(() => {
    if (!isOpen) return;
    measure();
    const id = setTimeout(() => setMounted(true), 0);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(id);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, measure]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearTimers();
        setOpen(false);
        triggerRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, setOpen]);

  React.useEffect(() => () => clearTimers(), []);

  const onTriggerBlur = (e: React.FocusEvent) => {
    const next = e.relatedTarget as Node | null;
    if (next && (triggerRef.current?.contains(next) || cardRef.current?.contains(next))) return;
    scheduleClose();
  };

  const place = pos?.placement ?? placement;
  const horizontal = place === "top" || place === "bottom";
  const tx = horizontal ? (align === "start" ? "0%" : align === "end" ? "-100%" : "-50%") : place === "left" ? "-100%" : "0%";
  const ty = !horizontal ? (align === "start" ? "0%" : align === "end" ? "-100%" : "-50%") : place === "top" ? "-100%" : "0%";
  const origin: Record<HoverCardPlacement, string> = { top: "bottom center", bottom: "top center", left: "center right", right: "center left" };
  const arrowPos = horizontal ? (align === "start" ? { left: 18 } : align === "end" ? { right: 18 } : { left: "50%", marginLeft: -5 }) : align === "start" ? { top: 18 } : align === "end" ? { bottom: 18 } : { top: "50%", marginTop: -5 };
  const arrowSide: Record<HoverCardPlacement, React.CSSProperties> = {
    top: { bottom: -6, borderRight: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` },
    bottom: { top: -6, borderLeft: `1px solid ${p.border}`, borderTop: `1px solid ${p.border}` },
    left: { right: -6, borderTop: `1px solid ${p.border}`, borderRight: `1px solid ${p.border}` },
    right: { left: -6, borderBottom: `1px solid ${p.border}`, borderLeft: `1px solid ${p.border}` },
  };

  return (
    <>
      <span
        ref={triggerRef}
        tabIndex={0}
        role="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-controls={isOpen ? `${uid}-card` : undefined}
        className={cn("inline-flex cursor-default outline-none", className)}
        onMouseEnter={() => scheduleOpen(openDelay)}
        onMouseLeave={scheduleClose}
        onFocus={() => scheduleOpen(0)}
        onBlur={onTriggerBlur}
      >
        {children}
      </span>

      {mounted &&
        createPortal(
          <AnimatePresence onExitComplete={() => setMounted(false)}>
            {isOpen && pos && (
              <motion.div
                key="hover-card"
                id={`${uid}-card`}
                ref={cardRef}
                role="dialog"
                onMouseEnter={() => clearTimers()}
                onMouseLeave={scheduleClose}
                className="fixed z-[9999]"
                style={{ left: pos.left, top: pos.top, width, x: tx, y: ty, transformOrigin: origin[place] }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
              >
                <div className="relative" style={{ padding: 16, borderRadius: 16, background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow, color: p.text, fontFamily: "Inter, sans-serif" }}>
                  {content}
                  {arrow && <span aria-hidden="true" className="absolute" style={{ width: 10, height: 10, background: p.bg, transform: "rotate(45deg)", ...arrowPos, ...arrowSide[place] }} />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
