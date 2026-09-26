"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, type TargetAndTransition } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ModalSize = "sm" | "md" | "lg";
export type ModalAnimation = "scale" | "slide-up" | "fade";

export interface ModalProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: ModalSize;
  animation?: ModalAnimation;
  theme?: "dark" | "light";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  blur?: boolean;
  contained?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.08)", text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", overlay: "rgba(0,0,0,0.62)", closeBg: "rgba(255,255,255,0.06)", shadow: "0 40px 100px rgba(0,0,0,0.6)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.08)", text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", overlay: "rgba(10,10,10,0.4)", closeBg: "rgba(10,10,10,0.05)", shadow: "0 40px 100px rgba(0,0,0,0.25)" },
};

const WIDTHS: Record<ModalSize, number> = { sm: 380, md: 480, lg: 640 };

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const VARIANTS: Record<ModalAnimation, { initial: TargetAndTransition; animate: TargetAndTransition; exit: TargetAndTransition }> = {
  scale: { initial: { opacity: 0, scale: 0.94, y: 10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.96, y: 6 } },
  "slide-up": { initial: { opacity: 0, y: 48 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: 32 } },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
};

export function Modal({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = "md",
  animation = "scale",
  theme = "dark",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  blur = true,
  contained = false,
  className,
}: ModalProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const [internal, setInternal] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(contained);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internal;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  React.useEffect(() => {
    if (isOpen && !mounted) {
      const id = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(id);
    }
  }, [isOpen, mounted]);

  React.useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusTimer = setTimeout(() => {
      const el = dialogRef.current;
      if (!el) return;
      const first = el.querySelector<HTMLElement>(FOCUSABLE);
      (first ?? el).focus({ preventScroll: true });
    }, 30);
    const prevOverflow = document.body.style.overflow;
    if (!contained) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      if (!contained) document.body.style.overflow = prevOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen, closeOnEscape, contained, setOpen]);

  const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const el = dialogRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) {
      e.preventDefault();
      el.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const activeEl = document.activeElement;
    if (e.shiftKey && (activeEl === first || activeEl === el)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && activeEl === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const v = VARIANTS[animation];
  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal-root"
          className={cn(contained ? "absolute" : "fixed", "inset-0 z-[9998] flex items-center justify-center p-4")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) setOpen(false);
          }}
          style={{ background: p.overlay, backdropFilter: blur ? "blur(6px)" : undefined, WebkitBackdropFilter: blur ? "blur(6px)" : undefined }}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? `${uid}-title` : undefined}
            aria-describedby={description ? `${uid}-desc` : undefined}
            tabIndex={-1}
            onKeyDown={onDialogKeyDown}
            className={cn("relative w-full outline-none", className)}
            style={{ maxWidth: WIDTHS[size], maxHeight: "calc(100% - 8px)", overflow: "auto", borderRadius: 20, background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow, color: p.text, fontFamily: "Inter, sans-serif", padding: 24 }}
            initial={v.initial}
            animate={v.animate}
            exit={v.exit}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute flex cursor-pointer items-center justify-center rounded-full border-none outline-none focus-visible:ring-2"
                style={{ top: 16, right: 16, width: 30, height: 30, background: p.closeBg, color: p.muted }}
              >
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            )}
            {(title || description) && (
              <div style={{ paddingRight: showCloseButton ? 36 : 0, marginBottom: children || footer ? 16 : 0 }}>
                {title && (
                  <h2 id={`${uid}-title`} className="m-0 font-semibold tracking-[-0.015em]" style={{ fontSize: 19, lineHeight: 1.3, color: p.text }}>
                    {title}
                  </h2>
                )}
                {description && (
                  <p id={`${uid}-desc`} className="m-0" style={{ marginTop: 6, fontSize: 14, lineHeight: 1.55, color: p.muted }}>
                    {description}
                  </p>
                )}
              </div>
            )}
            {children && <div style={{ fontSize: 14, lineHeight: 1.6, color: p.text }}>{children}</div>}
            {footer && <div className="flex flex-wrap items-center justify-end gap-2.5" style={{ marginTop: 22 }}>{footer}</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (contained) return node;
  if (!mounted) return null;
  return createPortal(node, document.body);
}
