"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PopoverPlacement = "top" | "bottom" | "left" | "right";
export type PopoverAlign = "start" | "center" | "end";

export interface PopoverProps {
  children: React.ReactNode;
  content: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: "click" | "hover";
  placement?: PopoverPlacement;
  align?: PopoverAlign;
  offset?: number;
  arrow?: boolean;
  width?: number;
  theme?: "dark" | "light";
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.1)", text: "#F5F4F1", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", text: "#0A0A0A", shadow: "0 20px 50px rgba(0,0,0,0.22), 0 4px 12px rgba(0,0,0,0.1)" },
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface Position {
  left: number;
  top: number;
  placement: PopoverPlacement;
}

export function Popover({ children, content, open, defaultOpen = false, onOpenChange, trigger = "click", placement = "bottom", align = "center", offset = 10, arrow = true, width = 280, theme = "dark", className }: PopoverProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
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
    const map: Record<PopoverPlacement, Position> = {
      top: { left: along, top: r.top - offset, placement: "top" },
      bottom: { left: along, top: r.bottom + offset, placement: "bottom" },
      left: { left: r.left - offset, top: along, placement: "left" },
      right: { left: r.right + offset, top: along, placement: "right" },
    };
    setPos(map[place]);
  }, [placement, align, offset, width]);

  React.useEffect(() => {
    if (!isOpen) return;
    const id = setTimeout(() => {
      measure();
      setMounted(true);
    }, 0);
    const focusId = setTimeout(() => {
      if (trigger === "click") contentRef.current?.focus({ preventScroll: true });
    }, 60);
    return () => {
      clearTimeout(id);
      clearTimeout(focusId);
    };
  }, [isOpen, measure, trigger]);

  React.useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || contentRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [isOpen, measure, setOpen]);

  React.useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  const place = pos?.placement ?? placement;
  const horizontal = place === "top" || place === "bottom";
  const tx = horizontal ? (align === "start" ? "0%" : align === "end" ? "-100%" : "-50%") : place === "left" ? "-100%" : "0%";
  const ty = !horizontal ? (align === "start" ? "0%" : align === "end" ? "-100%" : "-50%") : place === "top" ? "-100%" : "0%";
  const origin: Record<PopoverPlacement, string> = { top: "bottom center", bottom: "top center", left: "center right", right: "center left" };
  const arrowPos = horizontal ? (align === "start" ? { left: 18 } : align === "end" ? { right: 18 } : { left: "50%", marginLeft: -5 }) : align === "start" ? { top: 18 } : align === "end" ? { bottom: 18 } : { top: "50%", marginTop: -5 };
  const arrowSide: Record<PopoverPlacement, React.CSSProperties> = {
    top: { bottom: -6, borderRight: `1px solid ${p.border}`, borderBottom: `1px solid ${p.border}` },
    bottom: { top: -6, borderLeft: `1px solid ${p.border}`, borderTop: `1px solid ${p.border}` },
    left: { right: -6, borderTop: `1px solid ${p.border}`, borderRight: `1px solid ${p.border}` },
    right: { left: -6, borderBottom: `1px solid ${p.border}`, borderLeft: `1px solid ${p.border}` },
  };

  const hoverHandlers =
    trigger === "hover"
      ? {
          onMouseEnter: () => {
            if (closeTimer.current) clearTimeout(closeTimer.current);
            setOpen(true);
          },
          onMouseLeave: () => {
            closeTimer.current = setTimeout(() => setOpen(false), 140);
          },
        }
      : {};

  return (
    <>
      <span
        ref={triggerRef}
        className={cn("inline-flex", className)}
        onClick={trigger === "click" ? () => setOpen(!isOpen) : undefined}
        {...hoverHandlers}
      >
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
              "aria-haspopup": "dialog",
              "aria-expanded": isOpen,
              "aria-controls": isOpen ? `${uid}-pop` : undefined,
            })
          : children}
      </span>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && pos && (
              <motion.div
                key="popover"
                ref={contentRef}
                id={`${uid}-pop`}
                role="dialog"
                tabIndex={-1}
                onMouseEnter={trigger === "hover" ? () => closeTimer.current && clearTimeout(closeTimer.current) : undefined}
                onMouseLeave={trigger === "hover" ? () => (closeTimer.current = setTimeout(() => setOpen(false), 140)) : undefined}
                className="fixed z-[9999] outline-none"
                style={{ left: pos.left, top: pos.top, x: tx, y: ty, width, maxWidth: "calc(100vw - 24px)", borderRadius: 16, padding: 16, background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow, color: p.text, fontFamily: "Inter, sans-serif", fontSize: 14, lineHeight: 1.55, transformOrigin: origin[place] }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                {content}
                {arrow && <span aria-hidden="true" className="absolute block" style={{ width: 10, height: 10, background: p.bg, transform: "rotate(45deg)", ...arrowSide[place], ...arrowPos }} />}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
