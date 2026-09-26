"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A minimal self-contained tooltip just for a collapsed row's icon —
// registry components ship as a single file, so this doesn't reach for
// the separate Tooltip element even though the two would otherwise share
// a lot of code.
function RailTooltip({ label, theme, children }: { label: string; theme: "dark" | "light"; children: React.ReactElement }) {
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(null);
  const dark = theme === "dark";

  const show = () => {
    timer.current = setTimeout(() => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (r) setPos({ top: r.top + r.height / 2, left: r.right + 10 });
      setOpen(true);
    }, 150);
  };
  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(false);
  };
  React.useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  return (
    <span ref={wrapRef} onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} className="block w-full">
      {children}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && pos && (
              <motion.span
                role="tooltip"
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="fixed z-[9999] font-medium whitespace-nowrap"
                style={{ top: pos.top, left: pos.left, transform: "translateY(-50%)", padding: "5px 9px", borderRadius: 8, background: dark ? "#161616" : "#FFFFFF", border: `1px solid ${dark ? "rgba(255,255,255,0.12)" : "rgba(10,10,10,0.1)"}`, color: dark ? "#F5F4F1" : "#0A0A0A", fontSize: 12.5, boxShadow: dark ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.16)" }}
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </span>
  );
}

export type SidebarSize = "sm" | "md" | "lg";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
  onClick?: () => void;
}

export interface SidebarSection {
  id: string;
  label?: string;
  items: SidebarItem[];
}

export interface SidebarUser {
  name: string;
  subtitle?: string;
  initials?: string;
  onClick?: () => void;
}

export interface SidebarProps {
  sections: SidebarSection[];
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  collapsible?: boolean;
  header?: React.ReactNode;
  user?: SidebarUser;
  width?: number;
  collapsedWidth?: number;
  height?: number | string;
  size?: SidebarSize;
  theme?: "dark" | "light";
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.32)", bg: "#0E0E0E", border: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.06)", active: "#F5F4F1", activeText: "#0A0A0A", divider: "rgba(255,255,255,0.08)", badge: "rgba(255,255,255,0.1)", avatarBg: "rgba(255,255,255,0.1)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.32)", bg: "#FFFFFF", border: "rgba(10,10,10,0.12)", hover: "rgba(10,10,10,0.05)", active: "#0A0A0A", activeText: "#FFFFFF", divider: "rgba(10,10,10,0.08)", badge: "rgba(10,10,10,0.06)", avatarBg: "rgba(10,10,10,0.08)" },
};

const SIZES: Record<SidebarSize, { font: number; icon: number; rowH: number; padX: number; radius: number }> = {
  sm: { font: 12.5, icon: 16, rowH: 32, padX: 10, radius: 9 },
  md: { font: 13.5, icon: 18, rowH: 36, padX: 12, radius: 10 },
  lg: { font: 15, icon: 20, rowH: 40, padX: 14, radius: 11 },
};

function CollapseIcon({ collapsed, size }: { collapsed: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="12" height="10" rx="2" />
      <path d="M6.5 3v10" />
      <path d={collapsed ? "M9.5 6.5L11.5 8L9.5 9.5" : "M11 6.5L9 8L11 9.5"} />
    </svg>
  );
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "?";
}

export function Sidebar({
  sections,
  activeId,
  defaultActiveId,
  onActiveChange,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsible = true,
  header,
  user,
  width = 240,
  collapsedWidth = 72,
  height = 560,
  size = "md",
  theme = "dark",
  className,
}: SidebarProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const navRef = React.useRef<HTMLDivElement>(null);
  const itemRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const allItems = React.useMemo(() => sections.flatMap((sec) => sec.items), [sections]);
  const isActiveControlled = activeId !== undefined;
  const [internalActive, setInternalActive] = React.useState(defaultActiveId ?? allItems.find((i) => !i.disabled)?.id ?? "");
  const currentActive = isActiveControlled ? activeId : internalActive;

  const isCollapsedControlled = collapsed !== undefined;
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);
  const isCollapsed = isCollapsedControlled ? collapsed! : internalCollapsed;

  const [focusedId, setFocusedId] = React.useState(currentActive || allItems.find((i) => !i.disabled)?.id || "");

  const setCollapsed = (next: boolean) => {
    if (!isCollapsedControlled) setInternalCollapsed(next);
    onCollapsedChange?.(next);
  };

  const activate = (item: SidebarItem) => {
    if (item.disabled) return;
    if (!isActiveControlled) setInternalActive(item.id);
    setFocusedId(item.id);
    onActiveChange?.(item.id);
    item.onClick?.();
  };

  const focusableIds = allItems.filter((i) => !i.disabled).map((i) => i.id);
  const move = (dir: 1 | -1) => {
    if (focusableIds.length === 0) return;
    const i = focusableIds.indexOf(focusedId);
    const next = focusableIds[(i + dir + focusableIds.length) % focusableIds.length];
    setFocusedId(next);
    itemRefs.current[next]?.focus({ preventScroll: true });
  };

  const onNavKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (focusableIds.length) {
        setFocusedId(focusableIds[0]);
        itemRefs.current[focusableIds[0]]?.focus({ preventScroll: true });
      }
    } else if (e.key === "End") {
      e.preventDefault();
      if (focusableIds.length) {
        const last = focusableIds[focusableIds.length - 1];
        setFocusedId(last);
        itemRefs.current[last]?.focus({ preventScroll: true });
      }
    }
  };

  const row = (item: SidebarItem) => {
    const active = item.id === currentActive;
    const btn = (
      <button
        key={item.id}
        ref={(el) => {
          itemRefs.current[item.id] = el;
        }}
        type="button"
        role="button"
        aria-current={active ? "page" : undefined}
        aria-label={isCollapsed ? item.label : undefined}
        aria-disabled={item.disabled || undefined}
        disabled={item.disabled}
        tabIndex={item.id === focusedId ? 0 : -1}
        onClick={() => activate(item)}
        onFocus={() => setFocusedId(item.id)}
        className="relative flex w-full cursor-pointer items-center border-none bg-transparent outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
        style={{ height: s.rowH, padding: isCollapsed ? 0 : `0 ${s.padX}px`, justifyContent: isCollapsed ? "center" : "flex-start", gap: 10, borderRadius: s.radius, color: active ? p.activeText : p.text, fontSize: s.font, fontWeight: 500, ["--tw-ring-color" as string]: p.text }}
        onMouseEnter={(e) => {
          if (!active) e.currentTarget.style.background = p.hover;
        }}
        onMouseLeave={(e) => {
          if (!active) e.currentTarget.style.background = "transparent";
        }}
      >
        {active && (
          <motion.span
            layoutId={`${uid}-active-pill`}
            aria-hidden="true"
            className="absolute inset-0"
            style={{ borderRadius: s.radius, background: p.active }}
            transition={{ type: "spring", stiffness: 500, damping: 40 }}
          />
        )}
        <span className="relative flex shrink-0 items-center justify-center" style={{ width: s.icon, height: s.icon, color: active ? p.activeText : p.muted }}>
          {item.icon}
          {isCollapsed && item.badge !== undefined && <span aria-hidden="true" className="absolute rounded-full" style={{ top: -3, right: -3, width: 7, height: 7, background: active ? p.activeText : p.text, border: `1.5px solid ${p.bg}` }} />}
        </span>
        {!isCollapsed && (
          <>
            <span className="relative min-w-0 flex-1 truncate text-left">{item.label}</span>
            {item.badge !== undefined && (
              <span className="relative shrink-0 rounded-full px-1.5 py-px font-semibold tabular-nums" style={{ background: active ? "rgba(0,0,0,0.12)" : p.badge, color: active ? p.activeText : p.muted, fontSize: s.font - 3 }}>
                {item.badge}
              </span>
            )}
          </>
        )}
      </button>
    );
    return isCollapsed ? (
      <RailTooltip key={item.id} label={item.label} theme={theme}>
        {btn}
      </RailTooltip>
    ) : (
      btn
    );
  };

  return (
    <motion.div
      role="navigation"
      aria-label="Sidebar"
      className={cn("flex flex-col overflow-hidden", className)}
      style={{ height, borderRadius: 18, background: p.bg, border: `1px solid ${p.border}`, fontFamily: "Inter, sans-serif" }}
      animate={{ width: isCollapsed ? collapsedWidth : width }}
      transition={{ type: "spring", stiffness: 360, damping: 36 }}
    >
      <div className="flex shrink-0 items-center" style={{ height: 52, padding: `0 ${isCollapsed ? 0 : 14}px`, justifyContent: isCollapsed ? "center" : "space-between", borderBottom: `1px solid ${p.divider}` }}>
        {!isCollapsed && header && <div className="min-w-0 flex-1 truncate" style={{ color: p.text, fontSize: s.font + 1.5, fontWeight: 700 }}>{header}</div>}
        {collapsible && (
          <button
            type="button"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed(!isCollapsed)}
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none bg-transparent outline-none focus-visible:ring-2"
            style={{ width: 28, height: 28, color: p.muted, ["--tw-ring-color" as string]: p.text }}
            onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <CollapseIcon collapsed={isCollapsed} size={s.icon - 2} />
          </button>
        )}
      </div>

      <div ref={navRef} onKeyDown={onNavKeyDown} className="flex min-h-0 flex-1 flex-col overflow-y-auto" style={{ padding: 10, gap: 16 }}>
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col" style={{ gap: 2 }}>
            <AnimatePresence initial={false}>
              {!isCollapsed && section.label && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.16 }}
                  className="overflow-hidden font-semibold uppercase"
                  style={{ padding: "4px 10px 6px", color: p.faint, fontSize: s.font - 3, letterSpacing: "0.07em" }}
                >
                  {section.label}
                </motion.div>
              )}
            </AnimatePresence>
            {section.items.map(row)}
          </div>
        ))}
      </div>

      {user && (
        <div className="shrink-0" style={{ borderTop: `1px solid ${p.divider}`, padding: isCollapsed ? "10px 0" : 10 }}>
          <button
            type="button"
            onClick={user.onClick}
            className="flex w-full cursor-pointer items-center border-none bg-transparent outline-none focus-visible:ring-2"
            style={{ gap: 10, padding: isCollapsed ? 0 : "6px 8px", justifyContent: isCollapsed ? "center" : "flex-start", borderRadius: s.radius, ["--tw-ring-color" as string]: p.text }}
            onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span className="flex shrink-0 items-center justify-center rounded-full font-semibold" style={{ width: 30, height: 30, background: p.avatarBg, color: p.text, fontSize: s.font - 2 }}>
              {user.initials ?? initialsOf(user.name)}
            </span>
            {!isCollapsed && (
              <span className="flex min-w-0 flex-1 flex-col items-start" style={{ gap: 1 }}>
                <span className="w-full truncate text-left font-semibold" style={{ color: p.text, fontSize: s.font - 0.5 }}>
                  {user.name}
                </span>
                {user.subtitle && (
                  <span className="w-full truncate text-left" style={{ color: p.muted, fontSize: s.font - 3 }}>
                    {user.subtitle}
                  </span>
                )}
              </span>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}
