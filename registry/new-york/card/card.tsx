"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CardVariant = "default" | "elevated" | "outline" | "filled";
export type CardOrientation = "vertical" | "horizontal";

export interface CardProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  media?: string;
  mediaAlt?: string;
  mediaRatio?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: CardVariant;
  orientation?: CardOrientation;
  interactive?: boolean;
  spotlight?: boolean;
  href?: string;
  onClick?: () => void;
  radius?: number;
  padding?: number;
  width?: number | string;
  theme?: "dark" | "light";
  accentColor?: string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", filled: "#141414", border: "rgba(255,255,255,0.09)", text: "#F5F4F1", muted: "rgba(245,244,241,0.58)", mediaBg: "rgba(255,255,255,0.05)", badgeBg: "rgba(10,10,10,0.7)", badgeText: "#F5F4F1", elevated: "0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)" },
  light: { bg: "#FFFFFF", filled: "#F5F4F1", border: "rgba(10,10,10,0.12)", text: "#0A0A0A", muted: "rgba(10,10,10,0.58)", mediaBg: "rgba(10,10,10,0.05)", badgeBg: "rgba(255,255,255,0.85)", badgeText: "#0A0A0A", elevated: "0 20px 50px rgba(0,0,0,0.16), 0 4px 12px rgba(0,0,0,0.08)" },
};

export function Card({
  title,
  description,
  media,
  mediaAlt = "",
  mediaRatio = "16 / 10",
  badge,
  action,
  children,
  footer,
  variant = "default",
  orientation = "vertical",
  interactive = false,
  spotlight = false,
  href,
  onClick,
  radius = 20,
  padding = 20,
  width,
  theme = "dark",
  accentColor = "#F2A841",
  className,
}: CardProps) {
  const p = PALETTES[theme];
  const rootRef = React.useRef<HTMLElement | null>(null);
  const [hovered, setHovered] = React.useState(false);
  const horizontal = orientation === "horizontal";
  const clickable = interactive || Boolean(href) || Boolean(onClick);

  const onMove = (e: React.PointerEvent) => {
    const el = rootRef.current;
    if (!el || !spotlight) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const surface: React.CSSProperties = {
    borderRadius: radius,
    background: variant === "filled" ? p.filled : variant === "outline" ? "transparent" : p.bg,
    border: `1px solid ${hovered && clickable ? `color-mix(in srgb, ${accentColor} 45%, transparent)` : variant === "filled" ? "transparent" : p.border}`,
    boxShadow: variant === "elevated" ? p.elevated : undefined,
    color: p.text,
    fontFamily: "Inter, sans-serif",
    width,
    transition: "border-color 0.2s ease",
  };

  const inner = (
    <>
      {spotlight && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          style={{ opacity: hovered ? 1 : 0, transition: "opacity 0.25s ease", background: `radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, ${accentColor} 16%, transparent), transparent 70%)` }}
        />
      )}

      {media && (
        <div className="relative shrink-0 overflow-hidden" style={horizontal ? { width: "38%", alignSelf: "stretch", minHeight: 140 } : { aspectRatio: mediaRatio, background: p.mediaBg }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={media} alt={mediaAlt} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ transform: hovered && clickable ? "scale(1.05)" : "scale(1)", transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)" }} />
          {badge && (
            <span className="absolute font-semibold backdrop-blur" style={{ top: 12, left: 12, padding: "4px 10px", borderRadius: 999, fontSize: 11.5, background: p.badgeBg, color: p.badgeText }}>
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="relative z-[2] flex min-w-0 flex-1 flex-col" style={{ padding, gap: 12 }}>
        {(title || description || action) && (
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              {title && (
                <h3 className="m-0 font-semibold tracking-[-0.015em]" style={{ fontSize: 17, lineHeight: 1.3 }}>
                  {title}
                </h3>
              )}
              {description && (
                <p className="m-0" style={{ marginTop: 6, fontSize: 14, lineHeight: 1.55, color: p.muted }}>
                  {description}
                </p>
              )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        )}
        {children && <div style={{ fontSize: 14, lineHeight: 1.6, color: p.muted }}>{children}</div>}
        {footer && <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-1">{footer}</div>}
      </div>
    </>
  );

  const shared = {
    className: cn("relative flex overflow-hidden text-left no-underline outline-none focus-visible:ring-2", horizontal ? "flex-row" : "flex-col", clickable && "cursor-pointer", className),
    style: { ...surface, ["--tw-ring-color" as string]: accentColor } as React.CSSProperties,
    onPointerEnter: () => setHovered(true),
    onPointerLeave: () => setHovered(false),
    onPointerMove: onMove,
    whileHover: clickable ? { y: -3 } : undefined,
    whileTap: clickable ? { scale: 0.99 } : undefined,
    transition: { type: "spring" as const, stiffness: 420, damping: 30 },
  };

  if (href) {
    return (
      <motion.a ref={(el) => { rootRef.current = el; }} href={href} {...shared}>
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div
      ref={(el) => {
        rootRef.current = el;
      }}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onClick()) : undefined}
      {...shared}
    >
      {inner}
    </motion.div>
  );
}
