"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CalloutVariant = "info" | "success" | "warning" | "danger" | "neutral";
export type CalloutAppearance = "soft" | "outline" | "bar";
export type CalloutSize = "sm" | "md" | "lg";

export interface CalloutProps {
  variant?: CalloutVariant;
  appearance?: CalloutAppearance;
  title?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  dismissible?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  action?: { label: string; onClick?: () => void };
  size?: CalloutSize;
  theme?: "dark" | "light";
  width?: number | string;
  className?: string;
}

const ACCENTS: Record<CalloutVariant, { dark: string; light: string }> = {
  info: { dark: "#8FB8FF", light: "#2563EB" },
  success: { dark: "#87FFE3", light: "#0F9F7F" },
  warning: { dark: "#F2A841", light: "#B7791F" },
  danger: { dark: "#FF7A6B", light: "#E5484D" },
  neutral: { dark: "#F5F4F1", light: "#0A0A0A" },
};

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.62)", card: "#0E0E0E", hover: "rgba(255,255,255,0.08)", focus: "rgba(245,244,241,0.85)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.62)", card: "#FFFFFF", hover: "rgba(10,10,10,0.06)", focus: "rgba(10,10,10,0.85)" },
};

const SIZES: Record<CalloutSize, { font: number; pad: number; radius: number; icon: number; gap: number }> = {
  sm: { font: 13, pad: 12, radius: 12, icon: 16, gap: 10 },
  md: { font: 14.5, pad: 16, radius: 16, icon: 18, gap: 12 },
  lg: { font: 16, pad: 20, radius: 20, icon: 22, gap: 14 },
};

const ICON_PATHS: Record<CalloutVariant, string[]> = {
  info: ["M10 9v5", "M10 6.2v.01"],
  success: ["M6.2 10.4l2.6 2.6 5-5.6"],
  warning: ["M10 6.5v4.2", "M10 13.6v.01"],
  danger: ["M7.3 7.3l5.4 5.4", "M12.7 7.3l-5.4 5.4"],
  neutral: ["M6.5 10h7", "M10 6.5v7"],
};

function VariantIcon({ variant, size, animateKey }: { variant: CalloutVariant; size: number; animateKey: string }) {
  const draw = { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 }, transition: { duration: 0.5, ease: "easeOut" as const } };
  const shape = variant === "warning" ? <motion.path d="M10 2.8l7.2 12.4H2.8L10 2.8Z" strokeLinejoin="round" {...draw} /> : <motion.circle cx="10" cy="10" r="7.6" {...draw} />;
  return (
    <svg key={animateKey} width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      {shape}
      {ICON_PATHS[variant].map((d, i) => (
        <motion.path key={d} d={d} initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.35, delay: 0.3 + i * 0.12, ease: "easeOut" }} />
      ))}
    </svg>
  );
}

export function Callout({
  variant = "info",
  appearance = "soft",
  title,
  children,
  icon,
  dismissible = false,
  open,
  defaultOpen = true,
  onOpenChange,
  action,
  size = "md",
  theme = "dark",
  width = 480,
  className,
}: CalloutProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const accent = ACCENTS[variant][theme];
  const controlled = open !== undefined;
  const [internal, setInternal] = React.useState(defaultOpen);
  const visible = controlled ? open : internal;
  const [btnHover, setBtnHover] = React.useState(false);

  const setOpen = (next: boolean) => {
    if (!controlled) setInternal(next);
    onOpenChange?.(next);
  };

  const assertive = variant === "danger" || variant === "warning";
  const tint = (pct: number) => `color-mix(in srgb, ${accent} ${pct}%, transparent)`;

  const background = appearance === "soft" ? tint(theme === "dark" ? 9 : 8) : p.card;
  const border = appearance === "outline" ? tint(55) : appearance === "soft" ? tint(theme === "dark" ? 22 : 24) : theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(10,10,10,0.12)";

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          key="callout"
          role={assertive ? "alert" : "status"}
          initial={{ opacity: 0, height: 0, y: -6 }}
          animate={{ opacity: 1, height: "auto", y: 0 }}
          exit={{ opacity: 0, height: 0, y: -6 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          className={cn("overflow-hidden", className)}
          style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif" }}
        >
          <div className="relative flex items-start" style={{ gap: s.gap, padding: s.pad, paddingLeft: appearance === "bar" ? s.pad + 4 : s.pad, borderRadius: s.radius, background, border: `1px solid ${border}` }}>
            {appearance === "bar" && (
              <motion.span aria-hidden="true" className="absolute" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} style={{ left: 0, top: s.pad * 0.75, bottom: s.pad * 0.75, width: 3, borderRadius: 3, background: accent, transformOrigin: "top" }} />
            )}

            <span className="flex shrink-0 items-center justify-center" style={{ color: accent, width: s.icon + 2, height: s.icon + 2, marginTop: 1 }}>
              {icon ?? <VariantIcon variant={variant} size={s.icon + 2} animateKey={`${variant}-${visible}`} />}
            </span>

            <div className="flex min-w-0 flex-1 flex-col" style={{ gap: 4 }}>
              {title && (
                <div className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font + 0.5, lineHeight: 1.4 }}>
                  {title}
                </div>
              )}
              {children && (
                <div style={{ color: p.muted, fontSize: s.font, lineHeight: 1.55 }}>{children}</div>
              )}
              {action && (
                <button
                  type="button"
                  onClick={action.onClick}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  className="mt-2 inline-flex w-fit cursor-pointer items-center border-none bg-transparent p-0 font-semibold outline-none focus-visible:ring-2"
                  style={{ color: accent, fontSize: s.font - 0.5, gap: 4, borderRadius: 6, ["--tw-ring-color" as string]: p.focus }}
                >
                  <span style={{ textDecoration: btnHover ? "underline" : "none", textUnderlineOffset: 3 }}>{action.label}</span>
                  <motion.span animate={{ x: btnHover ? 3 : 0 }} transition={{ type: "spring", stiffness: 500, damping: 26 }} aria-hidden="true">
                    →
                  </motion.span>
                </button>
              )}
            </div>

            {dismissible && (
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setOpen(false)}
                className="-mr-1 -mt-1 flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent outline-none focus-visible:ring-2"
                style={{ width: 28, height: 28, color: p.muted, transition: "background 0.14s ease", ["--tw-ring-color" as string]: p.focus }}
                onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
