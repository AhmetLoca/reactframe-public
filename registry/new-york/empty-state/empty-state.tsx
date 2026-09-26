"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type EmptyStatePreset = "inbox" | "search" | "folder" | "cart" | "error";
export type EmptyStateVariant = "plain" | "card" | "dashed";
export type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps {
  preset?: EmptyStatePreset;
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  variant?: EmptyStateVariant;
  size?: EmptyStateSize;
  theme?: "dark" | "light";
  float?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.55)", border: "rgba(255,255,255,0.1)", card: "#0E0E0E", tile: "rgba(255,255,255,0.05)", tileBorder: "rgba(255,255,255,0.1)", icon: "rgba(245,244,241,0.85)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.55)", border: "rgba(10,10,10,0.14)", card: "#FFFFFF", tile: "rgba(10,10,10,0.04)", tileBorder: "rgba(10,10,10,0.1)", icon: "rgba(10,10,10,0.8)" },
};

const SIZES: Record<EmptyStateSize, { tile: number; icon: number; title: number; desc: number; gap: number; pad: number; maxWidth: number }> = {
  sm: { tile: 52, icon: 24, title: 15, desc: 13, gap: 14, pad: 28, maxWidth: 300 },
  md: { tile: 68, icon: 30, title: 18, desc: 14, gap: 18, pad: 40, maxWidth: 380 },
  lg: { tile: 88, icon: 38, title: 22, desc: 15.5, gap: 22, pad: 56, maxWidth: 460 },
};

const DEFAULTS: Record<EmptyStatePreset, { title: string; description: string }> = {
  inbox: { title: "Your inbox is empty", description: "New messages will show up here. Enjoy the quiet while it lasts." },
  search: { title: "No results found", description: "Try a different keyword or remove some filters to see more results." },
  folder: { title: "No files yet", description: "Upload a file or create a new folder to get started." },
  cart: { title: "Your cart is empty", description: "Looks like you haven't added anything yet. Browse the catalog to find something you like." },
  error: { title: "Something went wrong", description: "We couldn't load this content. Check your connection and try again." },
};

function PresetIcon({ preset, size }: { preset: EmptyStatePreset; size: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (preset) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="10.5" cy="10.5" r="6.2" />
          <path d="M15.2 15.2L20 20" />
          <path d="M8 10.5h5" />
        </svg>
      );
    case "folder":
      return (
        <svg {...common}>
          <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2.2h7a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
          <path d="M12 11.5v4M10 13.5h4" />
        </svg>
      );
    case "cart":
      return (
        <svg {...common}>
          <path d="M3.5 4.5h2.2l1.6 9.2a1.6 1.6 0 0 0 1.6 1.3h7.5a1.6 1.6 0 0 0 1.6-1.2l1.3-5.3H6.6" />
          <circle cx="9.5" cy="19" r="1.2" />
          <circle cx="16.5" cy="19" r="1.2" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <path d="M12 3.5l9 15.5H3z" />
          <path d="M12 9.5v4.2M12 16.6v.1" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M3.5 13.5l2.4-7.2a2 2 0 0 1 1.9-1.4h8.4a2 2 0 0 1 1.9 1.4l2.4 7.2" />
          <path d="M3.5 13.5V18a1.5 1.5 0 0 0 1.5 1.5h14a1.5 1.5 0 0 0 1.5-1.5v-4.5h-5.2a1.8 1.8 0 0 0-1.7 1.2 1.8 1.8 0 0 1-1.7 1.2 1.8 1.8 0 0 1-1.7-1.2 1.8 1.8 0 0 0-1.7-1.2z" />
        </svg>
      );
  }
}

export function EmptyState({ preset = "inbox", icon, title, description, action, secondaryAction, variant = "plain", size = "md", theme = "dark", float = true, className }: EmptyStateProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const reduced = useReducedMotion() ?? false;
  const d = DEFAULTS[preset];
  const heading = title === undefined ? d.title : title;
  const body = description === undefined ? d.description : description;
  const rise = (delay: number) => ({ initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] as const } });

  return (
    <div
      role="status"
      className={cn("flex flex-col items-center text-center", className)}
      style={{
        gap: s.gap,
        padding: variant === "plain" ? 0 : s.pad,
        maxWidth: "100%",
        width: variant === "plain" ? undefined : s.maxWidth + s.pad * 2,
        borderRadius: 22,
        background: variant === "card" ? p.card : "transparent",
        border: variant === "card" ? `1px solid ${p.border}` : variant === "dashed" ? `1.5px dashed ${p.border}` : undefined,
        fontFamily: "Inter, sans-serif",
        color: p.text,
      }}
    >
      <motion.div className="relative flex items-center justify-center" {...rise(0)}>
        <motion.span
          className="relative flex items-center justify-center"
          style={{ width: s.tile, height: s.tile, borderRadius: s.tile * 0.32, background: p.tile, border: `1px solid ${p.tileBorder}`, color: p.icon }}
          animate={float && !reduced ? { y: [0, -5, 0] } : undefined}
          transition={float && !reduced ? { duration: 3.4, ease: "easeInOut", repeat: Infinity } : undefined}
        >
          {icon ?? <PresetIcon preset={preset} size={s.icon} />}
        </motion.span>
      </motion.div>

      {(heading || body) && (
        <motion.div style={{ maxWidth: s.maxWidth }} {...rise(0.08)}>
          {heading && (
            <h3 className="m-0 font-semibold tracking-[-0.015em]" style={{ fontSize: s.title, lineHeight: 1.3 }}>
              {heading}
            </h3>
          )}
          {body && (
            <p className="m-0" style={{ marginTop: 8, fontSize: s.desc, lineHeight: 1.6, color: p.muted }}>
              {body}
            </p>
          )}
        </motion.div>
      )}

      {(action || secondaryAction) && (
        <motion.div className="flex flex-wrap items-center justify-center gap-2.5" {...rise(0.16)}>
          {action}
          {secondaryAction}
        </motion.div>
      )}
    </div>
  );
}
