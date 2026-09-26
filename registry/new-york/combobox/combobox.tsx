"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export type ComboboxSize = "sm" | "md" | "lg";

export interface ComboboxProps {
  options?: ComboboxOption[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  emptyText?: string;
  clearable?: boolean;
  size?: ComboboxSize;
  theme?: "dark" | "light";
  width?: number | string;
  maxMenuHeight?: number;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_OPTIONS: ComboboxOption[] = [
  { value: "react", label: "React", description: "A library for building user interfaces" },
  { value: "vue", label: "Vue", description: "The progressive JavaScript framework" },
  { value: "svelte", label: "Svelte", description: "Cybernetically enhanced web apps" },
  { value: "solid", label: "SolidJS", description: "Simple and performant reactivity" },
  { value: "angular", label: "Angular", description: "Platform for building web apps" },
  { value: "astro", label: "Astro", description: "Content-driven websites, fast by default" },
  { value: "next", label: "Next.js", description: "The React framework for production" },
  { value: "remix", label: "Remix", description: "Full stack web framework", disabled: true },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.08)", highlight: "rgba(255,255,255,0.07)", clearBg: "rgba(255,255,255,0.08)", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.12)", highlight: "rgba(10,10,10,0.05)", clearBg: "rgba(10,10,10,0.06)", shadow: "0 20px 50px rgba(0,0,0,0.16)" },
};

const SIZES: Record<ComboboxSize, { font: number; height: number; padX: number; radius: number }> = {
  sm: { font: 13, height: 36, padX: 12, radius: 11 },
  md: { font: 14.5, height: 44, padX: 14, radius: 13 },
  lg: { font: 16, height: 52, padX: 16, radius: 15 },
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

export function Combobox({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue = null,
  onValueChange,
  placeholder = "Select a framework...",
  label,
  helperText,
  emptyText = "No results found",
  clearable = true,
  size = "md",
  theme = "dark",
  width = 340,
  maxMenuHeight = 300,
  disabled = false,
  className,
}: ComboboxProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLUListElement>(null);
  const [internal, setInternal] = React.useState<string | null>(defaultValue);
  const [query, setQuery] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const selected = options.find((o) => o.value === current) ?? null;

  const filtered = React.useMemo(() => {
    const q = (query ?? "").trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  const commit = (next: string | null) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const close = () => {
    setOpen(false);
    setQuery(null);
    setActiveIndex(-1);
  };

  const pick = (opt: ComboboxOption) => {
    if (opt.disabled) return;
    commit(opt.value);
    close();
  };

  const firstEnabled = (list: ComboboxOption[]) => list.findIndex((o) => !o.disabled);

  const openMenu = () => {
    if (disabled) return;
    setOpen(true);
    const idx = filtered.findIndex((o) => o.value === current);
    setActiveIndex(idx >= 0 ? idx : firstEnabled(filtered));
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
        pick(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        close();
      }
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActiveIndex(firstEnabled(filtered));
    } else if (e.key === "End" && open) {
      e.preventDefault();
      const rev = [...filtered].reverse().findIndex((o) => !o.disabled);
      if (rev >= 0) setActiveIndex(filtered.length - 1 - rev);
    } else if (e.key === "Tab") {
      close();
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery(null);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  React.useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const displayValue = query !== null ? query : (selected?.label ?? "");
  const borderColor = open ? p.focus : hovered ? p.borderHover : p.border;
  const showClear = clearable && !disabled && (selected !== null || (query ?? "") !== "");

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
          style={{ height: s.height, gap: 8, padding: `0 ${s.padX}px`, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: open ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", cursor: disabled ? "default" : "text", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
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
            value={displayValue}
            placeholder={placeholder}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setActiveIndex(0);
            }}
            onFocus={() => !open && openMenu()}
            onKeyDown={onKeyDown}
            className="min-w-0 flex-1 border-none bg-transparent p-0 outline-none placeholder:text-[color:var(--cb-placeholder)]"
            style={{ color: p.text, fontSize: s.font, fontWeight: 500, ["--cb-placeholder" as string]: p.muted }}
          />
          {showClear && (
            <button
              type="button"
              aria-label="Clear selection"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                commit(null);
                setQuery(null);
                inputRef.current?.focus();
              }}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full border-none p-0 outline-none"
              style={{ width: 20, height: 20, background: p.clearBg, color: p.muted }}
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
              className="absolute left-0 z-50 m-0 w-full list-none overflow-auto p-1.5"
              style={{ top: "calc(100% + 8px)", maxHeight: maxMenuHeight, borderRadius: s.radius + 2, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top center" }}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {filtered.length === 0 ? (
                <li role="presentation" className="text-center" style={{ padding: "18px 12px", color: p.muted, fontSize: s.font }}>
                  {emptyText}
                </li>
              ) : (
                filtered.map((opt, i) => {
                  const isSelected = opt.value === current;
                  return (
                    <li
                      key={opt.value}
                      id={`${uid}-opt-${i}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={opt.disabled}
                      onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pick(opt)}
                      className="flex items-center justify-between gap-3"
                      style={{ padding: `${s.height * 0.2}px ${s.padX - 4}px`, borderRadius: s.radius - 4, background: i === activeIndex ? p.highlight : "transparent", opacity: opt.disabled ? 0.4 : 1, cursor: opt.disabled ? "default" : "pointer", color: p.text, transition: "background 0.12s ease" }}
                    >
                      <div className="flex min-w-0 flex-col" style={{ gap: 2 }}>
                        <span className="truncate" style={{ fontSize: s.font, fontWeight: isSelected ? 700 : 500 }}>
                          {highlightMatch(opt.label, query ?? "")}
                        </span>
                        {opt.description && (
                          <span className="truncate" style={{ fontSize: s.font * 0.82, color: p.muted }}>
                            {opt.description}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shrink-0" aria-hidden="true">
                          <motion.path d="M3 8.2L6.4 11.6L13 4.4" stroke={p.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25, ease: "easeOut" }} />
                        </svg>
                      )}
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
