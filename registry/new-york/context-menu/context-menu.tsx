"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// useLayoutEffect logs a warning when it runs server-side (no DOM to
// measure before paint there); fall back to useEffect there and only
// take the synchronous-before-paint measurement in the browser.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

export type ContextMenuItemKind = "item" | "checkbox" | "radio" | "separator" | "label" | "submenu";
export type ContextMenuSize = "sm" | "md" | "lg";

export interface ContextMenuItem {
  id: string;
  kind: ContextMenuItemKind;
  label?: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  danger?: boolean;
  items?: ContextMenuItem[];
}

export interface ContextMenuProps {
  items: ContextMenuItem[];
  children: React.ReactNode;
  onSelect?: (item: ContextMenuItem) => void;
  disabled?: boolean;
  size?: ContextMenuSize;
  width?: number;
  theme?: "dark" | "light";
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", panelBg: "#0E0E0E", panelBorder: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.08)", separator: "rgba(255,255,255,0.08)", kbdBg: "rgba(255,255,255,0.06)", kbdBorder: "rgba(255,255,255,0.1)", danger: "#FF7A6B", check: "#F5F4F1", checkFg: "#0A0A0A", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", panelBg: "#FFFFFF", panelBorder: "rgba(10,10,10,0.12)", hover: "rgba(10,10,10,0.06)", separator: "rgba(10,10,10,0.08)", kbdBg: "rgba(10,10,10,0.04)", kbdBorder: "rgba(10,10,10,0.1)", danger: "#E5484D", check: "#0A0A0A", checkFg: "#FFFFFF", shadow: "0 20px 50px rgba(0,0,0,0.18)" },
};

const SIZES: Record<ContextMenuSize, { font: number; rowH: number; radius: number }> = {
  sm: { font: 13, rowH: 30, radius: 9 },
  md: { font: 14, rowH: 33, radius: 10 },
  lg: { font: 15, rowH: 36, radius: 11 },
};

type Palette = (typeof PALETTES)["dark"];
type Size = (typeof SIZES)["md"];

function isFocusable(item: ContextMenuItem) {
  return item.kind !== "separator" && item.kind !== "label" && !item.disabled;
}

function Kbd({ children, p }: { children: string; p: Palette }) {
  return (
    <span className="inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-md font-medium" style={{ height: 18, padding: "0 5px", background: p.kbdBg, border: `1px solid ${p.kbdBorder}`, color: p.muted, fontSize: 10.5 }}>
      {children}
    </span>
  );
}

function CheckGlyph({ p }: { p: Palette }) {
  return (
    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 6.3L4.8 8.6L9.5 3.5" stroke={p.checkFg} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface RowProps {
  id: string;
  item: ContextMenuItem;
  s: Size;
  p: Palette;
  focused: boolean;
  submenuOpen: boolean;
  onHover: () => void;
  onActivate: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

function Row({ id, item, s, p, focused, submenuOpen, onHover, onActivate, setRef }: RowProps) {
  if (item.kind === "separator") return <div role="separator" style={{ margin: "5px 8px", height: 1, background: p.separator }} />;
  if (item.kind === "label")
    return (
      <div className="font-semibold uppercase" style={{ padding: "7px 12px 4px", color: p.faint, fontSize: 10.5, letterSpacing: "0.07em" }}>
        {item.label}
      </div>
    );

  const isCheck = item.kind === "checkbox" || item.kind === "radio";
  return (
    <div
      ref={setRef}
      id={id}
      role={item.kind === "checkbox" ? "menuitemcheckbox" : item.kind === "radio" ? "menuitemradio" : "menuitem"}
      aria-checked={isCheck ? Boolean(item.checked) : undefined}
      aria-haspopup={item.kind === "submenu" ? "menu" : undefined}
      aria-expanded={item.kind === "submenu" ? submenuOpen : undefined}
      aria-disabled={item.disabled || undefined}
      tabIndex={-1}
      onMouseEnter={item.disabled ? undefined : onHover}
      onClick={item.disabled ? undefined : onActivate}
      className="mx-1.5 flex cursor-pointer items-center outline-none select-none"
      style={{ gap: 9, height: s.rowH, padding: "0 10px", borderRadius: s.radius - 2, background: focused || submenuOpen ? p.hover : "transparent", color: item.disabled ? p.faint : item.danger ? p.danger : p.text, fontSize: s.font - 0.5, fontWeight: 500, cursor: item.disabled ? "default" : "pointer" }}
    >
      {item.kind === "checkbox" && (
        <span className="flex shrink-0 items-center justify-center rounded" style={{ width: 14, height: 14, border: `1.5px solid ${item.checked ? p.check : p.panelBorder}`, background: item.checked ? p.check : "transparent" }}>
          {item.checked && <CheckGlyph p={p} />}
        </span>
      )}
      {item.kind === "radio" && (
        <span className="flex shrink-0 items-center justify-center rounded-full" style={{ width: 14, height: 14, border: `1.5px solid ${item.checked ? p.check : p.panelBorder}` }}>
          {item.checked && <span style={{ width: 6, height: 6, borderRadius: 999, background: p.check }} />}
        </span>
      )}
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {item.shortcut && <Kbd p={p}>{item.shortcut}</Kbd>}
      {item.kind === "submenu" && (
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke={p.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3.5L10.5 8L6 12.5" />
        </svg>
      )}
    </div>
  );
}

interface MenuListProps {
  items: ContextMenuItem[];
  s: Size;
  p: Palette;
  width: number;
  /** "point": fixed at a raw {x,y}, clamped to the viewport (the root menu). "right": a flyout portaled next to its trigger row. */
  placement: "point" | "right";
  point?: { x: number; y: number };
  anchorRect?: DOMRect | null;
  onActivate: (item: ContextMenuItem) => void;
  onClose: () => void;
  onCloseAll: () => void;
}

function MenuList({ items, s, p, width, placement, point, anchorRect, onActivate, onClose, onCloseAll }: MenuListProps) {
  const uid = React.useId();
  const focusableIds = items.filter(isFocusable).map((n) => n.id);
  const [focusedId, setFocusedId] = React.useState<string | null>(focusableIds[0] ?? null);
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
  const [submenuAnchor, setSubmenuAnchor] = React.useState<DOMRect | null>(null);
  const [pos, setPos] = React.useState<{ left: number; top: number } | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  useIsomorphicLayoutEffect(() => {
    setSubmenuAnchor(openSubmenu ? (rowRefs.current[openSubmenu]?.getBoundingClientRect() ?? null) : null);
  }, [openSubmenu]);

  // Clamp the root menu to the viewport: it renders once at the raw click
  // point, gets measured before paint, then is nudged left/up if it would
  // overflow the right or bottom edge.
  useIsomorphicLayoutEffect(() => {
    if (placement !== "point" || !point) return;
    const el = rootRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const pad = 8;
    let left = point.x;
    let top = point.y;
    if (left + r.width > window.innerWidth - pad) left = Math.max(pad, window.innerWidth - pad - r.width);
    if (top + r.height > window.innerHeight - pad) top = Math.max(pad, window.innerHeight - pad - r.height);
    setPos({ left, top });
  }, [placement, point]);

  useIsomorphicLayoutEffect(() => {
    // For a "right" flyout, the panel renders nothing (see the early return
    // below) until anchorRect is measured, so rootRef.current is still null
    // on this effect's first pass; re-running once anchorRect lands makes
    // sure focus actually reaches the now-real DOM node. preventScroll stops
    // the browser from auto-scrolling an ancestor to reveal it (which would
    // otherwise shift unrelated content — the same issue a plain scrollable
    // menu panel runs into with a flyout escaping its bounds).
    rootRef.current?.focus({ preventScroll: true });
  }, [anchorRect]);

  const move = (dir: 1 | -1) => {
    if (focusableIds.length === 0) return;
    const i = focusedId ? focusableIds.indexOf(focusedId) : -1;
    const next = (i + dir + focusableIds.length) % focusableIds.length;
    setFocusedId(focusableIds[next]);
  };

  const activate = (item: ContextMenuItem) => {
    if (item.disabled) return;
    if (item.kind === "submenu") {
      setOpenSubmenu(item.id);
      return;
    }
    onActivate(item);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (openSubmenu !== null) {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenSubmenu(null);
      }
      return;
    }
    const focusedItem = items.find((n) => n.id === focusedId);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "ArrowRight") {
      if (focusedItem?.kind === "submenu") {
        e.preventDefault();
        setOpenSubmenu(focusedItem.id);
      }
    } else if (e.key === "ArrowLeft") {
      if (placement === "right") {
        e.preventDefault();
        onClose();
      }
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (focusedItem) activate(focusedItem);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onCloseAll();
    } else if (e.key === "Home") {
      e.preventDefault();
      if (focusableIds.length) setFocusedId(focusableIds[0]);
    } else if (e.key === "End") {
      e.preventDefault();
      if (focusableIds.length) setFocusedId(focusableIds[focusableIds.length - 1]);
    }
  };

  if (placement === "right" && !anchorRect) return null;

  const style: React.CSSProperties =
    placement === "point"
      ? { left: pos?.left ?? point?.x ?? 0, top: pos?.top ?? point?.y ?? 0 }
      : { left: (anchorRect?.right ?? 0) + 4, top: (anchorRect?.top ?? 0) - 8 };

  const node = (
    <motion.div
      ref={rootRef}
      role="menu"
      tabIndex={-1}
      aria-activedescendant={focusedId ? `${uid}-${focusedId}` : undefined}
      onKeyDown={onKeyDown}
      className="fixed z-[9999] overflow-y-auto overflow-x-hidden outline-none"
      style={{ ...style, width, maxHeight: 360, padding: 6, borderRadius: s.radius + 4, background: p.panelBg, border: `1px solid ${p.panelBorder}`, boxShadow: p.shadow }}
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      {items.map((item) => (
        <div key={item.id} className="relative">
          <Row
            id={`${uid}-${item.id}`}
            item={item}
            s={s}
            p={p}
            focused={item.id === focusedId}
            submenuOpen={item.id === openSubmenu}
            onHover={() => {
              setFocusedId(item.id);
              setOpenSubmenu(item.kind === "submenu" ? item.id : null);
            }}
            onActivate={() => activate(item)}
            setRef={(el) => {
              rowRefs.current[item.id] = el;
            }}
          />
          <AnimatePresence>
            {item.id === openSubmenu && item.items && (
              <MenuList
                items={item.items}
                s={s}
                p={p}
                width={width}
                placement="right"
                anchorRect={submenuAnchor}
                onActivate={onActivate}
                onClose={() => {
                  setOpenSubmenu(null);
                  rootRef.current?.focus({ preventScroll: true });
                }}
                onCloseAll={onCloseAll}
              />
            )}
          </AnimatePresence>
        </div>
      ))}
    </motion.div>
  );

  return createPortal(node, document.body);
}

export function ContextMenu({ items, children, onSelect, disabled = false, size = "md", width = 220, theme = "dark", className }: ContextMenuProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const [point, setPoint] = React.useState<{ x: number; y: number } | null>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const open = point !== null;

  const close = React.useCallback(() => setPoint(null), []);

  const onContextMenu = (e: React.MouseEvent) => {
    if (disabled) return;
    e.preventDefault();
    setPoint({ x: e.clientX, y: e.clientY });
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = () => close();
    const onScroll = () => close();
    // The mousedown that opens a NEW context menu (right-click) shouldn't
    // also immediately close it via this same listener, so it's attached a
    // tick later.
    const id = setTimeout(() => {
      document.addEventListener("mousedown", onDown);
      document.addEventListener("contextmenu", onDown);
    }, 0);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(id);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("contextmenu", onDown);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, close]);

  const handleActivate = (item: ContextMenuItem) => {
    onSelect?.(item);
    close();
  };

  return (
    <>
      <div ref={triggerRef} onContextMenu={onContextMenu} className={cn("contents", className)}>
        {children}
      </div>
      <AnimatePresence>
        {open && point && (
          <MenuList items={items} s={s} p={p} width={width} placement="point" point={point} onActivate={handleActivate} onClose={close} onCloseAll={close} />
        )}
      </AnimatePresence>
    </>
  );
}
