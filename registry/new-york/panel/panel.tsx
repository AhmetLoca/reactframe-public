"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type PanelVariant = "outline" | "filled" | "elevated";
export type PanelPadding = "sm" | "md" | "lg";

export interface PanelProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Small leading element next to the title, e.g. an icon. */
  icon?: React.ReactNode;
  /** Rendered on the right of the header (buttons, badges…). Stays clickable when collapsible. */
  actions?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  variant?: PanelVariant;
  padding?: PanelPadding;
  /** Draw hairlines between header, body and footer. */
  dividers?: boolean;
  /** A thin accent line along the top edge. */
  accentBar?: boolean;
  /** Cap the body height and scroll its content. */
  maxBodyHeight?: number;
  radius?: number;
  theme?: "dark" | "light";
  accentColor?: string;
  width?: number | string;
  className?: string;
}

const PALETTES = {
  dark: { bg: "#0E0E0E", filled: "#151515", border: "rgba(255,255,255,0.1)", title: "#F5F4F1", text: "rgba(245,244,241,0.62)", hover: "rgba(255,255,255,0.06)", shadow: "0 24px 60px rgba(0,0,0,0.5)" },
  light: { bg: "#FFFFFF", filled: "#F4F4F2", border: "rgba(10,10,10,0.1)", title: "#0A0A0A", text: "rgba(10,10,10,0.6)", hover: "rgba(10,10,10,0.05)", shadow: "0 24px 60px rgba(10,10,10,0.12)" },
};

const PADDING: Record<PanelPadding, { x: number; y: number; title: number; desc: number }> = {
  sm: { x: 14, y: 12, title: 14, desc: 12 },
  md: { x: 20, y: 16, title: 15, desc: 13 },
  lg: { x: 28, y: 22, title: 17, desc: 14 },
};

function Chevron({ open, color }: { open: boolean; color: string }) {
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="shrink-0"
    >
      <path d="M4 6.5 8 10.5 12 6.5" />
    </motion.svg>
  );
}

export function Panel({
  title,
  description,
  icon,
  actions,
  children,
  footer,
  collapsible = false,
  defaultCollapsed = false,
  collapsed,
  onCollapsedChange,
  variant = "outline",
  padding = "md",
  dividers = true,
  accentBar = false,
  maxBodyHeight,
  radius = 16,
  theme = "dark",
  accentColor = "#F2A841",
  width,
  className,
}: PanelProps) {
  const p = PALETTES[theme];
  const pad = PADDING[padding];
  const uid = React.useId();
  const reduce = useReducedMotion();
  const [innerCollapsed, setInnerCollapsed] = React.useState(defaultCollapsed);
  const isCollapsed = collapsible && (collapsed ?? innerCollapsed);
  const open = !isCollapsed;
  const hasHeader = title != null || description != null || icon != null || actions != null;

  const toggle = () => {
    const next = !isCollapsed;
    if (collapsed === undefined) setInnerCollapsed(next);
    onCollapsedChange?.(next);
  };

  const surface: React.CSSProperties =
    variant === "filled"
      ? { background: p.filled, border: "1px solid transparent" }
      : variant === "elevated"
        ? { background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow }
        : { background: p.bg, border: `1px solid ${p.border}` };

  const heading = (
    <>
      {icon && (
        <span className="flex shrink-0 items-center justify-center" style={{ width: 32, height: 32, borderRadius: 9, background: p.hover, color: p.title }}>
          {icon}
        </span>
      )}
      <span className="flex min-w-0 flex-col" style={{ gap: 2 }}>
        {title != null && (
          <span className="truncate font-semibold" style={{ color: p.title, fontSize: pad.title, letterSpacing: "-0.01em" }}>
            {title}
          </span>
        )}
        {description != null && (
          <span style={{ color: p.text, fontSize: pad.desc, lineHeight: 1.45 }}>{description}</span>
        )}
      </span>
    </>
  );

  return (
    <section
      className={cn("relative overflow-hidden", className)}
      style={{ width, maxWidth: "100%", borderRadius: radius, fontFamily: "Inter, sans-serif", ...surface }}
    >
      {accentBar && <div aria-hidden="true" className="absolute inset-x-0 top-0" style={{ height: 2, background: accentColor }} />}

      {hasHeader && (
        <div className="flex items-center" style={{ gap: 12, padding: `${pad.y}px ${pad.x}px`, borderBottom: dividers && open && children != null ? `1px solid ${p.border}` : "1px solid transparent", transition: "border-color 0.2s" }}>
          {collapsible ? (
            <button
              type="button"
              onClick={toggle}
              aria-expanded={open}
              aria-controls={`${uid}-body`}
              className="-m-1.5 flex min-w-0 flex-1 cursor-pointer items-center border-none bg-transparent p-1.5 text-left outline-none transition-colors focus-visible:ring-2"
              style={{ gap: 12, borderRadius: Math.max(6, radius - 6), fontFamily: "inherit", ["--tw-ring-color" as string]: accentColor }}
              onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {heading}
              <span className="ml-auto flex shrink-0 items-center pl-2">
                <Chevron open={open} color={p.text} />
              </span>
            </button>
          ) : (
            <div className="flex min-w-0 flex-1 items-center" style={{ gap: 12 }}>
              {heading}
            </div>
          )}
          {actions != null && <div className="flex shrink-0 items-center" style={{ gap: 8 }}>{actions}</div>}
        </div>
      )}

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${uid}-body`}
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={reduce ? { duration: 0 } : { height: { type: "spring", stiffness: 380, damping: 38 }, opacity: { duration: 0.18 } }}
            style={{ overflow: "hidden" }}
          >
            {children != null && (
              <div style={{ padding: `${pad.y}px ${pad.x}px`, color: p.text, fontSize: pad.desc + 1, lineHeight: 1.55, maxHeight: maxBodyHeight, overflowY: maxBodyHeight ? "auto" : undefined }}>
                {children}
              </div>
            )}
            {footer != null && (
              <div className="flex items-center" style={{ gap: 8, padding: `${pad.y - 2}px ${pad.x}px`, borderTop: dividers ? `1px solid ${p.border}` : "1px solid transparent", color: p.text, fontSize: pad.desc }}>
                {footer}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
