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

// Scrolls a focused row into view within its own menu panel only. Plain
// scrollIntoView can walk up to the document and scroll the whole page
// (including horizontally, to reveal a flyout submenu near the viewport
// edge), which visibly shifts unrelated content — so this only ever
// touches the panel's own scrollTop.
function scrollRowIntoView(el: HTMLElement | null) {
  if (!el) return;
  const panel = el.closest('[role="menu"]') as HTMLElement | null;
  if (!panel) return;
  const panelRect = panel.getBoundingClientRect();
  const rowRect = el.getBoundingClientRect();
  if (rowRect.top < panelRect.top) panel.scrollTop -= panelRect.top - rowRect.top;
  else if (rowRect.bottom > panelRect.bottom) panel.scrollTop += rowRect.bottom - panelRect.bottom;
}

export type MenubarItemKind = "item" | "checkbox" | "radio" | "separator" | "label" | "submenu";
export type MenubarSize = "sm" | "md" | "lg";

export interface MenubarItem {
  id: string;
  kind: MenubarItemKind;
  label?: string;
  shortcut?: string;
  checked?: boolean;
  disabled?: boolean;
  danger?: boolean;
  items?: MenubarItem[];
}

export interface MenubarMenu {
  id: string;
  label: string;
  items: MenubarItem[];
  disabled?: boolean;
}

export interface MenubarProps {
  menus: MenubarMenu[];
  onSelect?: (menuId: string, item: MenubarItem) => void;
  size?: MenubarSize;
  theme?: "dark" | "light";
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bar: "rgba(255,255,255,0.03)", barBorder: "rgba(255,255,255,0.08)", hover: "rgba(255,255,255,0.08)", active: "rgba(255,255,255,0.12)", panelBg: "#0E0E0E", panelBorder: "rgba(255,255,255,0.1)", separator: "rgba(255,255,255,0.08)", kbdBg: "rgba(255,255,255,0.06)", kbdBorder: "rgba(255,255,255,0.1)", danger: "#FF7A6B", check: "#F5F4F1", checkFg: "#0A0A0A", shadow: "0 20px 50px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bar: "#FFFFFF", barBorder: "rgba(10,10,10,0.1)", hover: "rgba(10,10,10,0.06)", active: "rgba(10,10,10,0.08)", panelBg: "#FFFFFF", panelBorder: "rgba(10,10,10,0.12)", separator: "rgba(10,10,10,0.08)", kbdBg: "rgba(10,10,10,0.04)", kbdBorder: "rgba(10,10,10,0.1)", danger: "#E5484D", check: "#0A0A0A", checkFg: "#FFFFFF", shadow: "0 18px 44px rgba(0,0,0,0.16)" },
};

const SIZES: Record<MenubarSize, { font: number; triggerH: number; padX: number; rowH: number; radius: number }> = {
  sm: { font: 13, triggerH: 30, padX: 10, rowH: 30, radius: 9 },
  md: { font: 14, triggerH: 34, padX: 12, rowH: 33, radius: 10 },
  lg: { font: 15, triggerH: 38, padX: 14, rowH: 36, radius: 11 },
};

type Palette = (typeof PALETTES)["dark"];

function isFocusable(item: MenubarItem) {
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
  item: MenubarItem;
  s: (typeof SIZES)["md"];
  p: Palette;
  focused: boolean;
  submenuOpen: boolean;
  onHover: () => void;
  onActivate: () => void;
  setRef: (el: HTMLDivElement | null) => void;
}

function Row({ item, s, p, focused, submenuOpen, onHover, onActivate, setRef }: RowProps) {
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
      role={item.kind === "checkbox" ? "menuitemcheckbox" : item.kind === "radio" ? "menuitemradio" : "menuitem"}
      aria-checked={isCheck ? Boolean(item.checked) : undefined}
      aria-haspopup={item.kind === "submenu" ? "menu" : undefined}
      aria-expanded={item.kind === "submenu" ? submenuOpen : undefined}
      aria-disabled={item.disabled || undefined}
      tabIndex={-1}
      onMouseEnter={item.disabled ? undefined : onHover}
      onClick={item.disabled ? undefined : onActivate}
      className="mx-1.5 flex cursor-pointer items-center outline-none select-none"
      style={{ gap: 9, height: s.rowH, padding: `0 10px`, borderRadius: s.radius - 2, background: focused || submenuOpen ? p.hover : "transparent", color: item.disabled ? p.faint : item.danger ? p.danger : p.text, fontSize: s.font - 0.5, fontWeight: 500, cursor: item.disabled ? "default" : "pointer" }}
    >
      {item.kind === "checkbox" && (
        <span className="flex shrink-0 items-center justify-center rounded" style={{ width: 14, height: 14, border: `1.5px solid ${item.checked ? p.check : p.barBorder}`, background: item.checked ? p.check : "transparent" }}>
          {item.checked && <CheckGlyph p={p} />}
        </span>
      )}
      {item.kind === "radio" && (
        <span className="flex shrink-0 items-center justify-center rounded-full" style={{ width: 14, height: 14, border: `1.5px solid ${item.checked ? p.check : p.barBorder}` }}>
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
  items: MenubarItem[];
  s: (typeof SIZES)["md"];
  p: Palette;
  width: number;
  placement: "below" | "right";
  /** Viewport rect of the row that opened this flyout; required (and only used) when placement is "right", since that panel is portaled to the body to escape the parent panel's own scroll clipping. */
  anchorRect?: DOMRect | null;
  autoFocus: "first" | "last" | "none";
  onActivate: (item: MenubarItem) => void;
  onClose: () => void;
  onCloseAll: () => void;
  onSiblingNav?: (dir: 1 | -1) => void;
}

function MenuList({ items, s, p, width, placement, anchorRect, autoFocus, onActivate, onClose, onCloseAll, onSiblingNav }: MenuListProps) {
  const focusableIds = items.filter(isFocusable).map((n) => n.id);
  const [focusedId, setFocusedId] = React.useState<string | null>(autoFocus === "last" ? (focusableIds[focusableIds.length - 1] ?? null) : (focusableIds[0] ?? null));
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null);
  const [submenuAnchor, setSubmenuAnchor] = React.useState<DOMRect | null>(null);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  useIsomorphicLayoutEffect(() => {
    setSubmenuAnchor(openSubmenu ? (rowRefs.current[openSubmenu]?.getBoundingClientRect() ?? null) : null);
  }, [openSubmenu]);

  React.useEffect(() => {
    // For a "right" flyout, the panel renders nothing (see the early return
    // below) until anchorRect is measured, so rootRef.current is still null
    // on this effect's first pass; re-running once anchorRect lands makes
    // sure focus actually reaches the now-real DOM node.
    if (autoFocus !== "none") rootRef.current?.focus({ preventScroll: true });
  }, [autoFocus, anchorRect]);

  const move = (dir: 1 | -1) => {
    if (focusableIds.length === 0) return;
    const i = focusedId ? focusableIds.indexOf(focusedId) : -1;
    const next = (i + dir + focusableIds.length) % focusableIds.length;
    setFocusedId(focusableIds[next]);
  };

  const activate = (item: MenubarItem) => {
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
      } else if (placement === "below" && onSiblingNav) {
        e.preventDefault();
        onSiblingNav(1);
      }
    } else if (e.key === "ArrowLeft") {
      if (placement === "right") {
        e.preventDefault();
        onClose();
      } else if (onSiblingNav) {
        e.preventDefault();
        onSiblingNav(-1);
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

  React.useEffect(() => {
    if (focusedId) scrollRowIntoView(rowRefs.current[focusedId]);
  }, [focusedId]);

  // A flyout (placement "right") is portaled to the body and positioned in
  // fixed viewport coordinates from anchorRect, instead of CSS-anchoring to
  // its trigger row: that row lives inside a panel with overflow-y:auto,
  // and a browser can't scroll one axis while leaving the other visible —
  // overflow-x would get forced to hidden too and clip the flyout.
  if (placement === "right" && !anchorRect) return null;

  const node = (
    <motion.div
      ref={rootRef}
      role="menu"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      className={placement === "below" ? "absolute overflow-hidden outline-none" : "fixed overflow-hidden outline-none"}
      style={{
        top: placement === "below" ? "calc(100% + 6px)" : (anchorRect?.top ?? 0) - 8,
        left: placement === "below" ? 0 : (anchorRect?.right ?? 0) + 6,
        width,
        maxHeight: 360,
        overflowY: "auto",
        padding: 6,
        borderRadius: s.radius + 4,
        background: p.panelBg,
        border: `1px solid ${p.panelBorder}`,
        boxShadow: p.shadow,
        zIndex: 50,
      }}
      initial={{ opacity: 0, scale: 0.96, y: placement === "below" ? -4 : 0 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
    >
      {items.map((item) => (
        <div key={item.id} className="relative">
          <Row
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
                autoFocus="first"
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

  return placement === "right" ? createPortal(node, document.body) : node;
}

export function Menubar({ menus, onSelect, size = "md", theme = "dark", className }: MenubarProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const [openId, setOpenId] = React.useState<string | null>(null);
  const [focusIndex, setFocusIndex] = React.useState(0);
  const enabledIndexes = menus.map((m, i) => (m.disabled ? -1 : i)).filter((i) => i >= 0);

  const closeAll = (returnFocus = true) => {
    setOpenId(null);
    if (returnFocus) {
      const id = menus[focusIndex]?.id;
      if (id) triggerRefs.current[id]?.focus({ preventScroll: true });
    }
  };

  React.useEffect(() => {
    if (!openId) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpenId(null);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [openId]);

  const openMenuAt = (index: number) => {
    const menu = menus[index];
    if (!menu || menu.disabled) return;
    setFocusIndex(index);
    setOpenId(menu.id);
  };

  const siblingNav = (dir: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(focusIndex);
    const next = enabledIndexes[(pos === -1 ? 0 : pos + dir + enabledIndexes.length) % enabledIndexes.length];
    openMenuAt(next);
  };

  const onTriggerKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const pos = enabledIndexes.indexOf(index);
      const next = enabledIndexes[(pos + 1) % enabledIndexes.length];
      setFocusIndex(next);
      triggerRefs.current[menus[next].id]?.focus({ preventScroll: true });
      if (openId) openMenuAt(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const pos = enabledIndexes.indexOf(index);
      const next = enabledIndexes[(pos - 1 + enabledIndexes.length) % enabledIndexes.length];
      setFocusIndex(next);
      triggerRefs.current[menus[next].id]?.focus({ preventScroll: true });
      if (openId) openMenuAt(next);
    } else if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openMenuAt(index);
    } else if (e.key === "Escape") {
      setOpenId(null);
    }
  };

  const handleActivate = (menuId: string) => (item: MenubarItem) => {
    onSelect?.(menuId, item);
    closeAll();
  };

  return (
    <div
      ref={rootRef}
      role="menubar"
      aria-orientation="horizontal"
      className={cn("inline-flex items-center", className)}
      style={{ gap: 2, padding: 4, borderRadius: s.radius + 4, background: p.bar, border: `1px solid ${p.barBorder}`, fontFamily: "Inter, sans-serif" }}
    >
      {menus.map((menu, index) => {
        const isOpen = openId === menu.id;
        return (
          <div key={menu.id} className="relative">
            <button
              ref={(el) => {
                triggerRefs.current[menu.id] = el;
              }}
              type="button"
              role="menuitem"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              disabled={menu.disabled}
              tabIndex={index === focusIndex ? 0 : -1}
              onClick={() => (isOpen ? setOpenId(null) : openMenuAt(index))}
              onMouseEnter={() => openId && !menu.disabled && openMenuAt(index)}
              onKeyDown={(e) => onTriggerKeyDown(e, index)}
              className="cursor-pointer border-none bg-transparent font-medium outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-40"
              style={{ height: s.triggerH, padding: `0 ${s.padX}px`, borderRadius: s.radius, color: p.text, fontSize: s.font, background: isOpen ? p.active : "transparent", ["--tw-ring-color" as string]: p.text }}
              onMouseDown={(e) => e.preventDefault()}
            >
              {menu.label}
            </button>
            <AnimatePresence>
              {isOpen && (
                <MenuList
                  items={menu.items}
                  s={s}
                  p={p}
                  width={220}
                  placement="below"
                  autoFocus="first"
                  onActivate={handleActivate(menu.id)}
                  onClose={() => setOpenId(null)}
                  onCloseAll={() => closeAll()}
                  onSiblingNav={siblingNav}
                />
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
