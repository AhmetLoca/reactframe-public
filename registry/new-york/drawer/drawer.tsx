"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useDragControls, type PanInfo } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DrawerSide = "left" | "right" | "top" | "bottom";
export type DrawerSize = "sm" | "md" | "lg";

export interface DrawerProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  side?: DrawerSide;
  size?: DrawerSize;
  theme?: "dark" | "light";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  swipeToClose?: boolean;
  blur?: boolean;
  contained?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.08)", text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", overlay: "rgba(0,0,0,0.6)", closeBg: "rgba(255,255,255,0.06)", grab: "rgba(255,255,255,0.2)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.08)", text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", overlay: "rgba(10,10,10,0.4)", closeBg: "rgba(10,10,10,0.05)", grab: "rgba(10,10,10,0.2)" },
};

const EXTENT: Record<DrawerSize, number> = { sm: 320, md: 420, lg: 560 };
const EXTENT_VERTICAL: Record<DrawerSize, number> = { sm: 240, md: 340, lg: 460 };

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function Drawer({
  open,
  defaultOpen = false,
  onOpenChange,
  title,
  description,
  children,
  footer,
  side = "right",
  size = "md",
  theme = "dark",
  closeOnBackdrop = true,
  closeOnEscape = true,
  showCloseButton = true,
  swipeToClose = true,
  blur = false,
  contained = false,
  className,
}: DrawerProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const panelRef = React.useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [internal, setInternal] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(contained);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internal;
  const vertical = side === "top" || side === "bottom";

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
      const el = panelRef.current;
      if (!el) return;
      (el.querySelector<HTMLElement>(FOCUSABLE) ?? el).focus({ preventScroll: true });
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

  const onPanelKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const el = panelRef.current;
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

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const dist = vertical ? info.offset.y : info.offset.x;
    const vel = vertical ? info.velocity.y : info.velocity.x;
    const closing = side === "right" || side === "bottom" ? 1 : -1;
    if (dist * closing > 90 || vel * closing > 500) setOpen(false);
  };

  const offscreen = side === "right" ? { x: "100%" } : side === "left" ? { x: "-100%" } : side === "top" ? { y: "-100%" } : { y: "100%" };
  const extent = vertical ? EXTENT_VERTICAL[size] : EXTENT[size];
  const panelBox: React.CSSProperties = vertical
    ? { left: 0, right: 0, height: extent, maxHeight: "100%", ...(side === "top" ? { top: 0, borderBottomLeftRadius: 22, borderBottomRightRadius: 22 } : { bottom: 0, borderTopLeftRadius: 22, borderTopRightRadius: 22 }) }
    : { top: 0, bottom: 0, width: extent, maxWidth: "100%", ...(side === "left" ? { left: 0, borderTopRightRadius: 22, borderBottomRightRadius: 22 } : { right: 0, borderTopLeftRadius: 22, borderBottomLeftRadius: 22 }) };

  const startDrag = (e: React.PointerEvent) => {
    if (swipeToClose) dragControls.start(e);
  };

  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="drawer-root"
          className={cn(contained ? "absolute" : "fixed", "inset-0 z-[9998]")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) setOpen(false);
          }}
          style={{ background: p.overlay, backdropFilter: blur ? "blur(6px)" : undefined, WebkitBackdropFilter: blur ? "blur(6px)" : undefined }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? `${uid}-title` : undefined}
            aria-describedby={description ? `${uid}-desc` : undefined}
            tabIndex={-1}
            onKeyDown={onPanelKeyDown}
            drag={swipeToClose ? (vertical ? "y" : "x") : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
            dragElastic={{ top: side === "top" ? 0.5 : 0, bottom: side === "bottom" ? 0.5 : 0, left: side === "left" ? 0.5 : 0, right: side === "right" ? 0.5 : 0 }}
            onDragEnd={onDragEnd}
            className={cn("absolute flex flex-col outline-none", className)}
            style={{ ...panelBox, background: p.bg, border: `1px solid ${p.border}`, color: p.text, fontFamily: "Inter, sans-serif", boxShadow: "0 0 80px rgba(0,0,0,0.5)" }}
            initial={offscreen}
            animate={{ x: 0, y: 0 }}
            exit={offscreen}
            transition={{ type: "spring", stiffness: 380, damping: 38 }}
          >
            {vertical && swipeToClose && (
              <div onPointerDown={startDrag} className="flex shrink-0 cursor-grab justify-center touch-none" style={{ padding: "10px 0 2px", order: side === "bottom" ? 0 : 99 }}>
                <span style={{ width: 40, height: 4, borderRadius: 4, background: p.grab }} />
              </div>
            )}
            {(title || description || showCloseButton) && (
              <div onPointerDown={startDrag} className={cn("relative shrink-0", swipeToClose && "touch-none")} style={{ padding: "20px 24px 0", paddingRight: showCloseButton ? 64 : 24, cursor: swipeToClose ? "grab" : undefined }}>
                {title && (
                  <h2 id={`${uid}-title`} className="m-0 font-semibold tracking-[-0.015em]" style={{ fontSize: 18, lineHeight: 1.3 }}>
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
            {showCloseButton && (
              <button
                type="button"
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="absolute z-10 flex cursor-pointer items-center justify-center rounded-full border-none outline-none focus-visible:ring-2"
                style={{ top: 16, right: 16, width: 30, height: 30, background: p.closeBg, color: p.muted }}
              >
                <svg width="13" height="13" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            )}
            <div className="min-h-0 flex-1 overflow-auto" style={{ padding: "16px 24px", fontSize: 14, lineHeight: 1.6 }}>
              {children}
            </div>
            {footer && (
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-2.5" style={{ padding: "14px 24px 20px", borderTop: `1px solid ${p.border}` }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (contained) return node;
  if (!mounted) return null;
  return createPortal(node, document.body);
}
