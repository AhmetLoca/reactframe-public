"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type MultiSelectSize = "sm" | "md" | "lg";

export interface MultiSelectProps {
  options?: MultiSelectOption[];
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  emptyText?: string;
  maxSelected?: number;
  maxVisibleTags?: number;
  showSelectAll?: boolean;
  clearable?: boolean;
  size?: MultiSelectSize;
  theme?: "dark" | "light";
  width?: number | string;
  maxMenuHeight?: number;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_OPTIONS: MultiSelectOption[] = [
  { value: "design", label: "Design", description: "Interfaces, systems and motion" },
  { value: "engineering", label: "Engineering", description: "Frontend, backend and infra" },
  { value: "product", label: "Product", description: "Strategy, research and roadmaps" },
  { value: "marketing", label: "Marketing", description: "Growth, content and brand" },
  { value: "sales", label: "Sales", description: "Pipeline and partnerships" },
  { value: "support", label: "Support", description: "Help center and success" },
  { value: "legal", label: "Legal", description: "Contracts and compliance", disabled: true },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", chip: "rgba(255,255,255,0.09)", chipBorder: "rgba(255,255,255,0.1)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.08)", highlight: "rgba(255,255,255,0.07)", box: "rgba(255,255,255,0.28)", boxOn: "#F5F4F1", boxOnText: "#0A0A0A", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", chip: "rgba(10,10,10,0.06)", chipBorder: "rgba(10,10,10,0.1)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.12)", highlight: "rgba(10,10,10,0.05)", box: "rgba(10,10,10,0.3)", boxOn: "#0A0A0A", boxOnText: "#FFFFFF", shadow: "0 20px 50px rgba(0,0,0,0.16)" },
};

const SIZES: Record<MultiSelectSize, { font: number; chipH: number; padX: number; padY: number; gap: number; radius: number }> = {
  sm: { font: 13, chipH: 24, padX: 10, padY: 6, gap: 6, radius: 12 },
  md: { font: 14, chipH: 28, padX: 12, padY: 8, gap: 7, radius: 14 },
  lg: { font: 15.5, chipH: 34, padX: 14, padY: 10, gap: 8, radius: 16 },
};

function highlightMatch(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ fontWeight: 700, textDecoration: "underline", textUnderlineOffset: 3, textDecorationThickness: 1.5 }}>{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

export function MultiSelect({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Select teams...",
  label,
  helperText,
  emptyText = "No results found",
  maxSelected,
  maxVisibleTags = 3,
  showSelectAll = true,
  clearable = true,
  size = "md",
  theme = "dark",
  width = 420,
  maxMenuHeight = 300,
  disabled = false,
  className,
}: MultiSelectProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const isControlled = value !== undefined;
  const selected = isControlled ? value : internal;
  const atLimit = maxSelected !== undefined && selected.length >= maxSelected;

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const enabledFiltered = filtered.filter((o) => !o.disabled);
  const allSelected = enabledFiltered.length > 0 && enabledFiltered.every((o) => selected.includes(o.value));

  const commit = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const toggle = (opt: MultiSelectOption) => {
    if (opt.disabled) return;
    if (selected.includes(opt.value)) commit(selected.filter((v) => v !== opt.value));
    else if (!atLimit) commit([...selected, opt.value]);
    setQuery("");
    inputRef.current?.focus();
  };

  const toggleAll = () => {
    if (allSelected) commit(selected.filter((v) => !enabledFiltered.some((o) => o.value === v)));
    else {
      const add = enabledFiltered.map((o) => o.value).filter((v) => !selected.includes(v));
      const room = maxSelected !== undefined ? Math.max(0, maxSelected - selected.length) : add.length;
      commit([...selected, ...add.slice(0, room)]);
    }
    inputRef.current?.focus();
  };

  const closeMenu = () => {
    setOpen(false);
    setQuery("");
    setActiveIndex(-1);
  };

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex((i) => (i >= 0 ? i : filtered.findIndex((o) => !o.disabled)));
  };

  const move = (dir: 1 | -1) => {
    const enabled = filtered.map((o, i) => (o.disabled ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) return;
    const pos = enabled.indexOf(activeIndex);
    const next = pos === -1 ? (dir === 1 ? 0 : enabled.length - 1) : (pos + dir + enabled.length) % enabled.length;
    setActiveIndex(enabled[next]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openMenu();
      else move(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Enter") {
      if (open && activeIndex >= 0 && filtered[activeIndex]) {
        e.preventDefault();
        toggle(filtered[activeIndex]);
      }
    } else if (e.key === "Backspace" && !query && selected.length > 0) {
      commit(selected.slice(0, -1));
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        closeMenu();
      }
    } else if (e.key === "Tab") {
      closeMenu();
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const chips = selected.map((v) => options.find((o) => o.value === v)).filter((o): o is MultiSelectOption => Boolean(o));
  const visibleChips = open ? chips : chips.slice(0, maxVisibleTags);
  const hiddenCount = chips.length - visibleChips.length;
  const borderColor = open ? p.focus : hovered ? p.borderHover : p.border;

  return (
    <div ref={rootRef} className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label htmlFor={`${uid}-input`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div className="relative">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={() => {
            inputRef.current?.focus();
            if (!open) openMenu();
          }}
          className="flex items-center"
          style={{ gap: 8, padding: `${s.padY}px ${s.padX}px`, minHeight: s.chipH + s.padY * 2, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: open ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", cursor: disabled ? "default" : "text", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
          <div className="flex min-w-0 flex-1 flex-wrap items-center" style={{ gap: s.gap }}>
            <AnimatePresence initial={false}>
              {visibleChips.map((opt) => (
                <motion.span
                  key={opt.value}
                  layout
                  className="inline-flex items-center font-semibold whitespace-nowrap"
                  style={{ height: s.chipH, gap: 6, paddingLeft: s.padX - 2, paddingRight: 6, borderRadius: 999, background: p.chip, border: `1px solid ${p.chipBorder}`, color: p.text, fontSize: s.font - 1 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                >
                  {opt.label}
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    disabled={disabled}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={(e) => {
                      e.stopPropagation();
                      commit(selected.filter((v) => v !== opt.value));
                    }}
                    className="flex shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 opacity-60 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100"
                    style={{ width: s.chipH - 10, height: s.chipH - 10, color: p.text }}
                  >
                    <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  </button>
                </motion.span>
              ))}
              {hiddenCount > 0 && (
                <motion.span key="more" layout className="inline-flex items-center font-semibold" style={{ height: s.chipH, padding: `0 ${s.padX - 2}px`, borderRadius: 999, color: p.muted, fontSize: s.font - 1 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  +{hiddenCount} more
                </motion.span>
              )}
            </AnimatePresence>
            <input
              ref={inputRef}
              id={`${uid}-input`}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={`${uid}-list`}
              aria-autocomplete="list"
              aria-activedescendant={open && activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
              autoComplete="off"
              spellCheck={false}
              disabled={disabled}
              value={query}
              placeholder={selected.length === 0 ? placeholder : ""}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIndex(0);
              }}
              onFocus={() => !open && openMenu()}
              onKeyDown={onKeyDown}
              className="min-w-[60px] flex-1 border-none bg-transparent p-0 outline-none placeholder:text-[color:var(--ms-placeholder)]"
              style={{ color: p.text, fontSize: s.font, height: s.chipH, ["--ms-placeholder" as string]: p.muted }}
            />
          </div>

          {clearable && !disabled && selected.length > 0 && (
            <button
              type="button"
              aria-label="Clear all"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                commit([]);
                inputRef.current?.focus();
              }}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full border-none p-0 outline-none"
              style={{ width: 20, height: 20, background: p.chip, color: p.muted }}
            >
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          )}
          <motion.span aria-hidden="true" className="flex shrink-0" animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 420, damping: 28 }} style={{ color: open ? p.text : p.muted }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 6.2L8 10L12 6.2" />
            </svg>
          </motion.span>
        </div>

        <AnimatePresence>
          {open && (
            <motion.ul
              ref={listRef}
              id={`${uid}-list`}
              role="listbox"
              aria-multiselectable="true"
              className="absolute left-0 z-50 m-0 w-full list-none overflow-auto p-1.5"
              style={{ top: "calc(100% + 8px)", maxHeight: maxMenuHeight, borderRadius: s.radius + 2, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top center" }}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {(showSelectAll || maxSelected !== undefined) && filtered.length > 0 && (
                <li role="presentation" className="flex items-center justify-between" style={{ padding: `${s.padY - 2}px ${s.padX - 4}px ${s.padY}px`, color: p.muted, fontSize: s.font - 1.5 }}>
                  <span className="tabular-nums">{maxSelected !== undefined ? `${selected.length}/${maxSelected} selected` : `${selected.length} selected`}</span>
                  {showSelectAll && (
                    <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={toggleAll} className="cursor-pointer border-none bg-transparent p-0 font-semibold outline-none hover:underline" style={{ color: p.text, fontSize: "inherit" }}>
                      {allSelected ? "Clear" : "Select all"}
                    </button>
                  )}
                </li>
              )}
              {filtered.length === 0 ? (
                <li role="presentation" className="text-center" style={{ padding: "18px 12px", color: p.muted, fontSize: s.font }}>
                  {emptyText}
                </li>
              ) : (
                filtered.map((opt, i) => {
                  const on = selected.includes(opt.value);
                  const blocked = opt.disabled || (!on && atLimit);
                  return (
                    <li
                      key={opt.value}
                      id={`${uid}-opt-${i}`}
                      data-index={i}
                      role="option"
                      aria-selected={on}
                      aria-disabled={blocked || undefined}
                      onMouseEnter={() => !blocked && setActiveIndex(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => !blocked && toggle(opt)}
                      className="flex items-center"
                      style={{ gap: 12, padding: `${s.padY + 1}px ${s.padX - 4}px`, borderRadius: s.radius - 4, background: i === activeIndex ? p.highlight : "transparent", opacity: blocked ? 0.4 : 1, cursor: blocked ? "default" : "pointer", color: p.text, transition: "background 0.12s ease" }}
                    >
                      <span className="flex shrink-0 items-center justify-center" style={{ width: 18, height: 18, borderRadius: 5, border: `1.5px solid ${on ? p.boxOn : p.box}`, background: on ? p.boxOn : "transparent", transition: "background 0.15s ease, border-color 0.15s ease" }}>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <motion.path d="M3 8.2L6.4 11.6L13 4.4" stroke={p.boxOnText} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" initial={false} animate={{ pathLength: on ? 1 : 0, opacity: on ? 1 : 0 }} transition={{ duration: 0.2 }} />
                        </svg>
                      </span>
                      <div className="flex min-w-0 flex-col" style={{ gap: 2 }}>
                        <span className="truncate" style={{ fontSize: s.font, fontWeight: 500 }}>
                          {highlightMatch(opt.label, query)}
                        </span>
                        {opt.description && (
                          <span className="truncate" style={{ fontSize: s.font * 0.85, color: p.muted }}>
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </li>
                  );
                })
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {helperText && <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>{helperText}</span>}
    </div>
  );
}
