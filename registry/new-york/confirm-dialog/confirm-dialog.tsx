"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ConfirmDialogVariant = "default" | "warning" | "danger";

export interface ConfirmDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: ConfirmDialogVariant;
  icon?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Can return a promise; the dialog shows a spinner and disables both buttons until it settles, then closes on success and stays open (with the thrown message) on failure. */
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  theme?: "dark" | "light";
  contained?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", border: "rgba(255,255,255,0.08)", text: "#F5F4F1", muted: "rgba(245,244,241,0.6)", overlay: "rgba(0,0,0,0.62)", shadow: "0 40px 100px rgba(0,0,0,0.6)", ghostBorder: "rgba(255,255,255,0.14)", ghostHover: "rgba(255,255,255,0.06)" },
  light: { bg: "#FFFFFF", border: "rgba(10,10,10,0.08)", text: "#0A0A0A", muted: "rgba(10,10,10,0.6)", overlay: "rgba(10,10,10,0.4)", shadow: "0 40px 100px rgba(0,0,0,0.22)", ghostBorder: "rgba(10,10,10,0.14)", ghostHover: "rgba(10,10,10,0.05)" },
};

const ACCENTS: Record<ConfirmDialogVariant, { dark: string; light: string }> = {
  default: { dark: "#F5F4F1", light: "#0A0A0A" },
  warning: { dark: "#F2A841", light: "#B7791F" },
  danger: { dark: "#FF7A6B", light: "#E5484D" },
};

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

function VariantIcon({ variant, size }: { variant: ConfirmDialogVariant; size: number }) {
  if (variant === "danger") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M7.3 7.3l5.4 5.4M12.7 7.3l-5.4 5.4" />
        <circle cx="10" cy="10" r="7.5" />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10 2.8l7.2 12.4H2.8L10 2.8Z" strokeLinejoin="round" />
        <path d="M10 7.5v3.6M10 13.8v.01" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="7.5" />
      <path d="M10 9v4.2M10 6.3v.01" />
    </svg>
  );
}

function Spinner({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ animation: "confirm-dialog-spin 0.7s linear infinite" }} aria-hidden="true">
      <circle cx="12" cy="12" r="9.5" stroke={color} strokeOpacity="0.22" strokeWidth="2.5" />
      <path d="M21.5 12a9.5 9.5 0 0 0-9.5-9.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <style>{"@keyframes confirm-dialog-spin { to { transform: rotate(360deg); } }"}</style>
    </svg>
  );
}

export function ConfirmDialog({
  open,
  defaultOpen = false,
  onOpenChange,
  title = "Are you sure?",
  description,
  variant = "default",
  icon,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  closeOnBackdrop = true,
  closeOnEscape = true,
  theme = "dark",
  contained = false,
  className,
}: ConfirmDialogProps) {
  const p = PALETTES[theme];
  const accent = ACCENTS[variant][theme];
  const uid = React.useId();
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const confirmRef = React.useRef<HTMLButtonElement>(null);
  const [internal, setInternal] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(contained);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
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

  // Clear a stale error the moment the dialog re-opens, rather than in an
  // effect: the component never unmounts between opens (only AnimatePresence
  // toggles its child), so old state would otherwise linger into the next
  // confirmation. This is React's documented pattern for adjusting state
  // during render in response to a prop change.
  const [wasOpen, setWasOpen] = React.useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setError(null);
  }

  const cancel = React.useCallback(() => {
    if (loading) return;
    onCancel?.();
    setOpen(false);
  }, [loading, onCancel, setOpen]);

  const confirm = async () => {
    if (loading) return;
    setError(null);
    try {
      const result = onConfirm?.();
      if (result && typeof (result as Promise<void>).then === "function") {
        setLoading(true);
        await result;
        setLoading(false);
      }
      setOpen(false);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  React.useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusTimer = setTimeout(() => {
      const target = variant === "default" ? confirmRef.current : cancelRef.current;
      (target ?? dialogRef.current)?.focus({ preventScroll: true });
    }, 30);
    const prevOverflow = document.body.style.overflow;
    if (!contained) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && closeOnEscape) {
        e.stopPropagation();
        cancel();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      if (!contained) document.body.style.overflow = prevOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen, closeOnEscape, contained, variant, cancel]);

  const onDialogKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab") return;
    const el = dialogRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (items.length === 0) return;
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

  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="confirm-dialog-root"
          className={cn(contained ? "absolute" : "fixed", "inset-0 z-[9998] flex items-center justify-center p-4")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (closeOnBackdrop && e.target === e.currentTarget) cancel();
          }}
          style={{ background: p.overlay, backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        >
          <motion.div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`${uid}-title`}
            aria-describedby={description ? `${uid}-desc` : undefined}
            tabIndex={-1}
            onKeyDown={onDialogKeyDown}
            className={cn("relative w-full", className)}
            style={{ maxWidth: 400, borderRadius: 20, background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow, color: p.text, fontFamily: "Inter, sans-serif", padding: 24 }}
            initial={{ opacity: 0, scale: 0.94, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 6 }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
          >
            <span className="flex items-center justify-center rounded-full" style={{ width: 44, height: 44, marginBottom: 16, color: accent, background: `color-mix(in srgb, ${accent} 14%, transparent)` }}>
              {icon ?? <VariantIcon variant={variant} size={22} />}
            </span>

            <h2 id={`${uid}-title`} className="m-0 font-semibold tracking-[-0.015em]" style={{ fontSize: 17, lineHeight: 1.35, color: p.text }}>
              {title}
            </h2>
            {description && (
              <p id={`${uid}-desc`} className="m-0" style={{ marginTop: 8, fontSize: 14, lineHeight: 1.55, color: p.muted }}>
                {description}
              </p>
            )}

            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  role="alert"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 10 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="m-0 overflow-hidden"
                  style={{ fontSize: 13, lineHeight: 1.5, color: ACCENTS.danger[theme] }}
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-end" style={{ gap: 10, marginTop: 22 }}>
              <button
                ref={cancelRef}
                type="button"
                disabled={loading}
                onClick={cancel}
                className="cursor-pointer font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
                style={{ height: 38, padding: "0 16px", borderRadius: 11, background: "transparent", border: `1px solid ${p.ghostBorder}`, color: p.text, fontSize: 13.5, ["--tw-ring-color" as string]: accent }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.background = p.ghostHover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {cancelLabel}
              </button>
              <button
                ref={confirmRef}
                type="button"
                disabled={loading}
                onClick={confirm}
                className="flex cursor-pointer items-center justify-center font-semibold outline-none focus-visible:ring-2 disabled:cursor-not-allowed"
                style={{ height: 38, padding: "0 18px", gap: 8, borderRadius: 11, border: "none", background: accent, color: theme === "dark" ? "#0A0A0A" : "#FFFFFF", fontSize: 13.5, opacity: loading ? 0.75 : 1, ["--tw-ring-color" as string]: accent }}
              >
                {loading && <Spinner size={14} color={theme === "dark" ? "#0A0A0A" : "#FFFFFF"} />}
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (contained) return node;
  if (!mounted) return null;
  return createPortal(node, document.body);
}
