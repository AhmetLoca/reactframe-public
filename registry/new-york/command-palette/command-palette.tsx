"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  keywords?: string[];
  disabled?: boolean;
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  items?: CommandItem[];
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSelectItem?: (item: CommandItem) => void;
  placeholder?: string;
  emptyText?: string;
  /** Key that toggles the palette together with Cmd/Ctrl. Pass false to disable. */
  hotkey?: string | false;
  closeOnSelect?: boolean;
  theme?: "dark" | "light";
  contained?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.3)", bg: "#0E0E0E", border: "rgba(255,255,255,0.1)", divider: "rgba(255,255,255,0.08)", active: "rgba(255,255,255,0.09)", chip: "rgba(255,255,255,0.08)", chipBorder: "rgba(255,255,255,0.12)", overlay: "rgba(0,0,0,0.6)", mark: "#FFFFFF", shadow: "0 32px 90px rgba(0,0,0,0.65)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.3)", bg: "#FFFFFF", border: "rgba(10,10,10,0.14)", divider: "rgba(10,10,10,0.08)", active: "rgba(10,10,10,0.06)", chip: "rgba(10,10,10,0.05)", chipBorder: "rgba(10,10,10,0.12)", overlay: "rgba(10,10,10,0.35)", mark: "#000000", shadow: "0 28px 80px rgba(0,0,0,0.22)" },
};

const GLYPHS: Record<string, string> = {
  file: "M5 2.5h6l3 3v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1ZM11 2.5v3h3",
  folder: "M2.5 5.5a1 1 0 0 1 1-1h4l1.5 2h7a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-12.5a1 1 0 0 1-1-1v-9Z",
  search: "M8.5 14a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11ZM12.5 12.5L16.5 16.5",
  user: "M10 9.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM4 16.5c0-2.8 2.7-4.5 6-4.5s6 1.7 6 4.5",
  settings: "M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM10 2.5v2M10 15.5v2M2.5 10h2M15.5 10h2M4.7 4.7l1.4 1.4M13.9 13.9l1.4 1.4M4.7 15.3l1.4-1.4M13.9 6.1l1.4-1.4",
  moon: "M16 11.5A6.5 6.5 0 0 1 8.5 4a6.5 6.5 0 1 0 7.5 7.5Z",
  logout: "M8 3.5H5a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h3M12 6.5l3.5 3.5L12 13.5M15.5 10H8",
  plus: "M10 4v12M4 10h12",
  link: "M8.5 11.5a3 3 0 0 0 4.2 0l2.5-2.5a3 3 0 0 0-4.2-4.2L9.8 5.8M11.5 8.5a3 3 0 0 0-4.2 0L4.8 11a3 3 0 0 0 4.2 4.2l1.2-1.2",
  home: "M3 9.5L10 3.5l7 6M5 8.5v7a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-7",
  bell: "M5.5 8a4.5 4.5 0 0 1 9 0c0 4 1.5 5 1.5 5H4s1.5-1 1.5-5ZM8.5 16a1.5 1.5 0 0 0 3 0",
};

export function CommandGlyph({ name, size = 16 }: { name: keyof typeof GLYPHS | string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={GLYPHS[name] ?? GLYPHS.file} />
    </svg>
  );
}

export const DEFAULT_COMMANDS: CommandItem[] = [
  { id: "new-file", label: "New file", group: "Actions", icon: <CommandGlyph name="plus" />, shortcut: ["N"] },
  { id: "new-folder", label: "New folder", group: "Actions", icon: <CommandGlyph name="folder" />, shortcut: ["⇧", "N"] },
  { id: "search", label: "Search in project", group: "Actions", icon: <CommandGlyph name="search" />, shortcut: ["⇧", "F"], keywords: ["find"] },
  { id: "copy-link", label: "Copy share link", group: "Actions", icon: <CommandGlyph name="link" />, shortcut: ["L"] },
  { id: "home", label: "Go to dashboard", group: "Navigation", icon: <CommandGlyph name="home" />, shortcut: ["G", "D"] },
  { id: "files", label: "Go to files", group: "Navigation", icon: <CommandGlyph name="file" />, shortcut: ["G", "F"] },
  { id: "notifications", label: "Open notifications", group: "Navigation", icon: <CommandGlyph name="bell" />, keywords: ["inbox"] },
  { id: "profile", label: "Edit profile", group: "Settings", icon: <CommandGlyph name="user" /> },
  { id: "theme", label: "Toggle dark mode", group: "Settings", icon: <CommandGlyph name="moon" />, shortcut: ["D"], keywords: ["theme", "appearance"] },
  { id: "settings", label: "Preferences", group: "Settings", icon: <CommandGlyph name="settings" />, shortcut: [","], keywords: ["config"] },
  { id: "logout", label: "Sign out", group: "Settings", icon: <CommandGlyph name="logout" /> },
];

/** Case-insensitive fuzzy match. Returns matched character indices and a score, or null. */
function fuzzy(query: string, text: string): { score: number; indices: number[] } | null {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  const at = t.indexOf(q);
  if (at >= 0) {
    return { score: 100 - at + (at === 0 ? 30 : t[at - 1] === " " ? 15 : 0), indices: Array.from({ length: q.length }, (_, i) => at + i) };
  }
  const indices: number[] = [];
  let from = 0;
  let score = 0;
  for (const ch of q) {
    const i = t.indexOf(ch, from);
    if (i === -1) return null;
    score += i === from ? 4 : 1;
    indices.push(i);
    from = i + 1;
  }
  return { score, indices };
}

function Highlight({ text, indices, color }: { text: string; indices: number[]; color: string }) {
  if (indices.length === 0) return <>{text}</>;
  const set = new Set(indices);
  return (
    <>
      {Array.from(text).map((ch, i) =>
        set.has(i) ? (
          <span key={i} style={{ color, fontWeight: 700 }}>
            {ch}
          </span>
        ) : (
          <React.Fragment key={i}>{ch}</React.Fragment>
        ),
      )}
    </>
  );
}

const subscribeNoop = () => () => {};
const isMacSnapshot = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

export function CommandPalette({
  items = DEFAULT_COMMANDS,
  open,
  defaultOpen = false,
  onOpenChange,
  onSelectItem,
  placeholder = "Type a command or search...",
  emptyText = "No results found.",
  hotkey = "k",
  closeOnSelect = true,
  theme = "dark",
  contained = false,
  className,
}: CommandPaletteProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [internal, setInternal] = React.useState(defaultOpen);
  const [mounted, setMounted] = React.useState(contained);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const controlled = open !== undefined;
  const isOpen = controlled ? open : internal;
  const isMac = React.useSyncExternalStore(subscribeNoop, isMacSnapshot, () => false);

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!controlled) setInternal(next);
      onOpenChange?.(next);
      if (!next) {
        setQuery("");
        setActiveIndex(0);
      }
    },
    [controlled, onOpenChange],
  );

  const results = React.useMemo(() => {
    const q = query.trim();
    const rows = items
      .map((item, order) => {
        if (!q) return { item, order, score: 0, indices: [] as number[] };
        const label = fuzzy(q, item.label);
        if (label) return { item, order, score: label.score, indices: label.indices };
        const kw = item.keywords?.map((k) => fuzzy(q, k)).find(Boolean);
        return kw ? { item, order, score: kw.score * 0.4, indices: [] as number[] } : null;
      })
      .filter((r): r is { item: CommandItem; order: number; score: number; indices: number[] } => r !== null);
    const groupOrder: string[] = [];
    rows.forEach((r) => {
      const g = r.item.group ?? "";
      if (!groupOrder.includes(g)) groupOrder.push(g);
    });
    const groups = groupOrder.map((g) => ({
      name: g,
      rows: rows.filter((r) => (r.item.group ?? "") === g).sort((a, b) => (q ? b.score - a.score : a.order - b.order)),
    }));
    return { groups, flat: groups.flatMap((g) => g.rows) };
  }, [items, query]);

  const enabledIndexes = results.flat.map((r, i) => (r.item.disabled ? -1 : i)).filter((i) => i >= 0);
  const safeActive = Math.min(activeIndex, Math.max(results.flat.length - 1, 0));

  const run = (index: number) => {
    const row = results.flat[index];
    if (!row || row.item.disabled) return;
    row.item.onSelect?.();
    onSelectItem?.(row.item);
    if (closeOnSelect) setOpen(false);
  };

  const move = (dir: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(safeActive);
    const next = pos === -1 ? 0 : (pos + dir + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[next]);
  };

  React.useEffect(() => {
    if (isOpen && !mounted) {
      const id = setTimeout(() => setMounted(true), 0);
      return () => clearTimeout(id);
    }
  }, [isOpen, mounted]);

  React.useEffect(() => {
    if (hotkey === false) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === hotkey.toLowerCase()) {
        e.preventDefault();
        setOpen(!isOpen);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [hotkey, isOpen, setOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 30);
    const prevOverflow = document.body.style.overflow;
    if (!contained) document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      if (!contained) document.body.style.overflow = prevOverflow;
      previous?.focus?.({ preventScroll: true });
    };
  }, [isOpen, contained]);

  React.useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${safeActive}"]`)?.scrollIntoView({ block: "nearest" });
  }, [safeActive, results.flat.length]);

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
    else if (e.key === "Home") { e.preventDefault(); if (enabledIndexes.length) setActiveIndex(enabledIndexes[0]); }
    else if (e.key === "End") { e.preventDefault(); if (enabledIndexes.length) setActiveIndex(enabledIndexes[enabledIndexes.length - 1]); }
    else if (e.key === "Enter") { e.preventDefault(); run(safeActive); }
    else if (e.key === "Escape") { e.preventDefault(); e.stopPropagation(); setOpen(false); }
    else if (e.key === "Tab") e.preventDefault();
  };

  const kbd = (k: string, i: number) => (
    <kbd key={i} className="inline-flex items-center justify-center font-sans font-semibold" style={{ minWidth: 20, height: 20, padding: "0 5px", borderRadius: 6, background: p.chip, border: `1px solid ${p.chipBorder}`, color: p.muted, fontSize: 11 }}>
      {k}
    </kbd>
  );

  const node = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="palette-root"
          className={cn(contained ? "absolute" : "fixed", "inset-0 z-[9998] flex items-start justify-center px-4", className)}
          style={{ background: p.overlay, backdropFilter: "blur(5px)", WebkitBackdropFilter: "blur(5px)", paddingTop: contained ? 40 : "14vh" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <motion.div
            role="dialog"
            aria-label="Command palette"
            aria-modal={contained ? undefined : true}
            className="flex w-full flex-col overflow-hidden"
            style={{ maxWidth: 560, maxHeight: contained ? "calc(100% - 56px)" : "min(460px, 72vh)", borderRadius: 18, background: p.bg, border: `1px solid ${p.border}`, boxShadow: p.shadow, color: p.text, fontFamily: "Inter, sans-serif" }}
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -6 }}
            transition={{ type: "spring", stiffness: 460, damping: 34 }}
          >
            <div className="flex shrink-0 items-center" style={{ gap: 12, padding: "0 18px", height: 56, borderBottom: `1px solid ${p.divider}` }}>
              <span style={{ color: p.muted }}>
                <CommandGlyph name="search" size={18} />
              </span>
              <input
                ref={inputRef}
                value={query}
                placeholder={placeholder}
                role="combobox"
                aria-expanded="true"
                aria-controls={`${uid}-list`}
                aria-activedescendant={results.flat.length ? `${uid}-opt-${safeActive}` : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                className="min-w-0 flex-1 border-none bg-transparent p-0 font-medium outline-none placeholder:opacity-45"
                style={{ color: p.text, fontSize: 16, ["--tw-placeholder-color" as string]: p.muted }}
              />
              {kbd("esc", 0)}
            </div>

            <div ref={listRef} id={`${uid}-list`} role="listbox" aria-label="Commands" className="min-h-0 flex-1 overflow-y-auto" style={{ padding: 8, scrollbarWidth: "thin" }}>
              {results.flat.length === 0 && (
                <div className="text-center" style={{ padding: "36px 12px", color: p.muted, fontSize: 14 }}>
                  {emptyText}
                </div>
              )}
              {results.groups.map((g) => (
                <div key={g.name || "_"} role="group" aria-label={g.name || undefined} style={{ marginBottom: 4 }}>
                  {g.name && (
                    <div className="font-semibold uppercase" style={{ padding: "10px 12px 6px", color: p.faint, fontSize: 11, letterSpacing: "0.08em" }}>
                      {g.name}
                    </div>
                  )}
                  {g.rows.map((r) => {
                    const index = results.flat.indexOf(r);
                    const active = index === safeActive;
                    return (
                      <div
                        key={r.item.id}
                        id={`${uid}-opt-${index}`}
                        data-index={index}
                        role="option"
                        aria-selected={active}
                        aria-disabled={r.item.disabled || undefined}
                        onMouseMove={() => !r.item.disabled && !active && setActiveIndex(index)}
                        onClick={() => run(index)}
                        className="relative flex items-center"
                        style={{ gap: 12, height: 42, padding: "0 12px", borderRadius: 11, cursor: r.item.disabled ? "not-allowed" : "pointer", opacity: r.item.disabled ? 0.4 : 1 }}
                      >
                        {active && <motion.span layoutId={`${uid}-active`} aria-hidden="true" className="absolute inset-0" style={{ borderRadius: 11, background: p.active }} transition={{ type: "spring", stiffness: 600, damping: 42 }} />}
                        {r.item.icon && (
                          <span className="relative flex shrink-0 items-center justify-center" style={{ width: 20, color: active ? p.text : p.muted, transition: "color 0.12s ease" }}>
                            {r.item.icon}
                          </span>
                        )}
                        <span className="relative min-w-0 flex-1 truncate" style={{ fontSize: 14.5, fontWeight: 500, color: active ? p.text : p.muted, transition: "color 0.12s ease" }}>
                          <Highlight text={r.item.label} indices={r.indices} color={p.mark} />
                        </span>
                        {r.item.shortcut && <span className="relative flex shrink-0 items-center" style={{ gap: 4 }}>{r.item.shortcut.map(kbd)}</span>}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="flex shrink-0 items-center justify-between" style={{ padding: "0 18px", height: 40, borderTop: `1px solid ${p.divider}`, color: p.faint, fontSize: 12 }}>
              <span className="flex items-center" style={{ gap: 14 }}>
                <span className="flex items-center" style={{ gap: 5 }}>
                  {kbd("↑", 0)}
                  {kbd("↓", 1)} navigate
                </span>
                <span className="flex items-center" style={{ gap: 5 }}>
                  {kbd("↵", 0)} select
                </span>
              </span>
              {hotkey !== false && <span>{isMac ? "⌘" : "Ctrl"} {hotkey.toUpperCase()} to toggle</span>}
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
