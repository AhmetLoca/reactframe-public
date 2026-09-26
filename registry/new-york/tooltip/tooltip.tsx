"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  placement?: TooltipPlacement;
  delay?: number;
  offset?: number;
  arrow?: boolean;
  shortcut?: string;
  theme?: "dark" | "light";
  maxWidth?: number;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#161616", border: "rgba(255,255,255,0.12)", text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", kbdBg: "rgba(255,255,255,0.08)", shadow: "0 12px 32px rgba(0,0,0,0.5)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.1)", text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", kbdBg: "rgba(10,10,10,0.05)", shadow: "0 12px 32px rgba(0,0,0,0.16)" },
};

interface Position {
  left: number;
  top: number;
  placement: TooltipPlacement;
}

export function Tooltip({ content, children, placement = "top", delay = 20, offset = 10, arrow = true, shortcut, theme = "dark", maxWidth = 240, disabled = false, className }: TooltipProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  const [pos, setPos] = React.useState<Position | null>(null);

  const measure = React.useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let place = placement;
    if (place === "top" && r.top < 80) place = "bottom";
    else if (place === "bottom" && window.innerHeight - r.bottom < 80) place = "top";
    else if (place === "left" && r.left < 200) place = "right";
    else if (place === "right" && window.innerWidth - r.right < 200) place = "left";
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const map: Record<TooltipPlacement, Position> = {
      top: { left: cx, top: r.top - offset, placement: "top" },
      bottom: { left: cx, top: r.bottom + offset, placement: "bottom" },
      left: { left: r.left - offset, top: cy, placement: "left" },
      right: { left: r.right + offset, top: cy, placement: "right" },
    };
    setPos(map[place]);
  }, [placement, offset]);

  const show = (immediate = false) => {
    if (disabled) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(
      () => {
        measure();
        setMounted(true);
        setOpen(true);
      },
      immediate ? 0 : delay,
    );
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [open, measure]);

  React.useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const place = pos?.placement ?? placement;
  const translate: Record<TooltipPlacement, { x: string; y: string }> = {
    top: { x: "-50%", y: "-100%" },
    bottom: { x: "-50%", y: "0%" },
    left: { x: "-100%", y: "-50%" },
    right: { x: "0%", y: "-50%" },
  };
  const origin: Record<TooltipPlacement, string> = { top: "bottom center", bottom: "top center", left: "center right", right: "center left" };
  const arrowStyle: Record<TooltipPlacement, React.CSSProperties> = {
    top: { bottom: -5, left: "50%", marginLeft: -4.5, borderRight: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` },
    bottom: { top: -5, left: "50%", marginLeft: -4.5, borderLeft: `1px solid ${p.border}`, borderTop: `1px solid ${p.border}` },
    left: { right: -5, top: "50%", marginTop: -4.5, borderTop: `1px solid ${p.border}`, borderRight: `1px solid ${p.border}` },
    right: { left: -5, top: "50%", marginTop: -4.5, borderBottom: `1px solid ${p.border}`, borderLeft: `1px solid ${p.border}` },
  };

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex", className)}
        aria-describedby={open ? `${uid}-tip` : undefined}
        onMouseEnter={() => show()}
        onMouseLeave={hide}
        onFocus={(e) => {
          if ((e.target as HTMLElement).matches?.(":focus-visible")) show(true);
        }}
        onBlur={hide}
        onMouseDown={hide}
      >
        {children}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.div
                key="tooltip"
                id={`${uid}-tip`}
                role="tooltip"
                className="pointer-events-none fixed z-[9999] flex items-center gap-2"
                style={{
                  left: pos.left,
                  top: pos.top,
                  x: translate[place].x,
                  y: translate[place].y,
                  maxWidth,
                  padding: "7px 11px",
                  borderRadius: 10,
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  boxShadow: p.shadow,
                  color: p.text,
                  fontFamily: "Inter, sans-serif",
                  fontSize: 12.5,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  transformOrigin: origin[place],
                }}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>{content}</span>
                {shortcut && (
                  <span className="shrink-0 rounded-md font-semibold" style={{ padding: "1px 6px", background: p.kbdBg, color: p.muted, fontSize: 11 }}>
                    {shortcut}
                  </span>
                )}
                {arrow && <span aria-hidden="true" className="absolute block" style={{ width: 9, height: 9, background: p.bg, transform: "rotate(45deg)", ...arrowStyle[place] }} />}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
