"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SearchBarProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  suggestions?: string[];
  maxSuggestions?: number;
  shortcut?: string;
  enableShortcut?: boolean;
  loading?: boolean;
  disabled?: boolean;
  theme?: "dark" | "light";
  size?: number;
  radius?: number;
  width?: number;
  accentColor?: string;
  className?: string;
}

const PALETTES = {
  dark: {
    bg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.12)",
    borderHover: "rgba(255,255,255,0.24)",
    text: "#F5F4F1",
    muted: "rgba(245,244,241,0.5)",
    kbdBg: "rgba(255,255,255,0.06)",
    kbdBorder: "rgba(255,255,255,0.1)",
    menuBg: "#0E0E0E",
    menuBorder: "rgba(255,255,255,0.08)",
    highlight: "rgba(255,255,255,0.06)",
    shadow: "0 24px 60px rgba(0,0,0,0.55)",
  },
  light: {
    bg: "#FFFFFF",
    border: "rgba(10,10,10,0.14)",
    borderHover: "rgba(10,10,10,0.28)",
    text: "#0A0A0A",
    muted: "rgba(10,10,10,0.5)",
    kbdBg: "rgba(10,10,10,0.04)",
    kbdBorder: "rgba(10,10,10,0.1)",
    menuBg: "#FFFFFF",
    menuBorder: "rgba(10,10,10,0.08)",
    highlight: "rgba(10,10,10,0.05)",
    shadow: "0 24px 60px rgba(0,0,0,0.18)",
  },
};

function SearchIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="4.6" stroke={color} strokeWidth="1.6" />
      <path d="M10.6 10.6L13.6 13.6" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Spinner({ size, color }: { size: number; color: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}>
      <circle cx="8" cy="8" r="5.6" stroke={color} strokeOpacity="0.25" strokeWidth="1.6" />
      <path d="M8 2.4A5.6 5.6 0 0 1 13.6 8" stroke={color} strokeWidth="1.6" strokeLinecap="round" />
    </motion.svg>
  );
}

function highlightMatch(text: string, query: string, color: string) {
  const q = query.trim();
  if (!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <span style={{ color, fontWeight: 700 }}>{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

export function SearchBar({
  value,
  defaultValue = "",
  onValueChange,
  onSearch,
  placeholder = "Search components...",
  suggestions = [],
  maxSuggestions = 6,
  shortcut = "⌘K",
  enableShortcut = true,
  loading = false,
  disabled = false,
  theme = "dark",
  size = 15,
  radius = 14,
  width = 360,
  accentColor = "#F2A841",
  className,
}: SearchBarProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState(defaultValue);
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const isControlled = value !== undefined;
  const text = isControlled ? value : internal;
  const height = Math.round(size * 3);
  const listId = `${uid}-list`;

  const matches = React.useMemo(() => {
    const q = text.trim().toLowerCase();
    const list = q ? suggestions.filter((s) => s.toLowerCase().includes(q) && s.toLowerCase() !== q) : suggestions;
    return list.slice(0, maxSuggestions);
  }, [text, suggestions, maxSuggestions]);
  const showMenu = menuOpen && focused && matches.length > 0;

  const setText = (next: string) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const submit = (v: string) => {
    onSearch?.(v);
    setMenuOpen(false);
    setActiveIndex(-1);
  };

  const pick = (s: string) => {
    setText(s);
    submit(s);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (matches.length === 0) return;
      e.preventDefault();
      setMenuOpen(true);
      const dir = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) => (i === -1 ? (dir === 1 ? 0 : matches.length - 1) : (i + dir + matches.length) % matches.length));
    } else if (e.key === "Enter") {
      if (showMenu && activeIndex >= 0) pick(matches[activeIndex]);
      else submit(text);
    } else if (e.key === "Escape") {
      if (showMenu) setMenuOpen(false);
      else if (text) setText("");
      else inputRef.current?.blur();
    }
  };

  React.useEffect(() => {
    if (!enableShortcut || disabled) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enableShortcut, disabled]);

  React.useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [menuOpen]);

  const borderColor = focused ? accentColor : hovered ? p.borderHover : p.border;
  const showKbd = shortcut && !focused && !text && !loading;

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)} style={{ width, fontFamily: "Inter, sans-serif" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => inputRef.current?.focus()}
        className="flex items-center"
        style={{
          height,
          gap: size * 0.7,
          padding: `0 ${size * 0.85}px`,
          borderRadius: radius,
          border: `1px solid ${borderColor}`,
          background: p.bg,
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? "default" : "text",
          boxShadow: focused ? `0 0 0 3px color-mix(in srgb, ${accentColor} 25%, transparent)` : "0 0 0 0 transparent",
          transition: "border-color 0.18s ease, box-shadow 0.18s ease",
        }}
      >
        <span className="flex shrink-0" style={{ width: size * 1.15, height: size * 1.15 }}>
          {loading ? <Spinner size={size * 1.15} color={accentColor} /> : <SearchIcon size={size * 1.15} color={focused ? accentColor : p.muted} />}
        </span>

        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={showMenu}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showMenu && activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
          value={text}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(e) => {
            setText(e.target.value);
            setMenuOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => {
            setFocused(true);
            setMenuOpen(true);
          }}
          onBlur={() => setFocused(false)}
          onKeyDown={onKeyDown}
          className="min-w-0 flex-1 border-none bg-transparent p-0 outline-none placeholder:text-[color:var(--sb-placeholder)]"
          style={{ color: p.text, fontSize: size, fontWeight: 500, ["--sb-placeholder" as string]: p.muted }}
        />

        <AnimatePresence initial={false}>
          {text && !disabled && (
            <motion.button
              key="clear"
              type="button"
              aria-label="Clear search"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setText("");
                inputRef.current?.focus();
              }}
              className="flex shrink-0 cursor-pointer items-center justify-center rounded-full border-none p-0"
              style={{ width: size * 1.35, height: size * 1.35, background: p.kbdBg, color: p.muted }}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.14 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>

        {showKbd && (
          <span className="shrink-0 rounded-md font-medium" style={{ padding: `${size * 0.2}px ${size * 0.5}px`, background: p.kbdBg, border: `1px solid ${p.kbdBorder}`, color: p.muted, fontSize: size * 0.8 }}>
            {shortcut}
          </span>
        )}
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.ul
            id={listId}
            role="listbox"
            className="absolute left-0 z-50 m-0 w-full list-none p-1.5"
            style={{ top: "calc(100% + 8px)", borderRadius: radius + 2, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top center" }}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {matches.map((s, i) => (
              <li
                key={s}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(s)}
                className="flex cursor-pointer items-center"
                style={{ gap: size * 0.7, padding: `${size * 0.6}px ${size * 0.75}px`, borderRadius: radius - 4, background: i === activeIndex ? p.highlight : "transparent", color: p.text, fontSize: size, transition: "background 0.12s ease" }}
              >
                <SearchIcon size={size * 0.95} color={p.muted} />
                <span className="truncate">{highlightMatch(s, text, accentColor)}</span>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
