"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TagInputSize = "sm" | "md" | "lg";

export interface TagInputProps {
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  suggestions?: string[];
  maxTags?: number;
  allowDuplicates?: boolean;
  addOnBlur?: boolean;
  delimiters?: string[];
  validate?: (tag: string) => string | null | undefined;
  size?: TagInputSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", chip: "rgba(255,255,255,0.09)", chipBorder: "rgba(255,255,255,0.1)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.08)", highlight: "rgba(255,255,255,0.07)", error: "#FF7A6B", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", chip: "rgba(10,10,10,0.06)", chipBorder: "rgba(10,10,10,0.1)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.12)", highlight: "rgba(10,10,10,0.05)", error: "#E5484D", shadow: "0 20px 50px rgba(0,0,0,0.16)" },
};

const SIZES: Record<TagInputSize, { font: number; chipH: number; padX: number; padY: number; gap: number; radius: number }> = {
  sm: { font: 13, chipH: 24, padX: 10, padY: 6, gap: 6, radius: 12 },
  md: { font: 14, chipH: 28, padX: 12, padY: 8, gap: 7, radius: 14 },
  lg: { font: 15.5, chipH: 34, padX: 14, padY: 10, gap: 8, radius: 16 },
};

export function TagInput({
  value,
  defaultValue = [],
  onValueChange,
  placeholder = "Add a tag...",
  label,
  helperText,
  suggestions = [],
  maxTags,
  allowDuplicates = false,
  addOnBlur = true,
  delimiters = [",", ";"],
  validate,
  size = "md",
  theme = "dark",
  width = 420,
  disabled = false,
  className,
}: TagInputProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState<string[]>(defaultValue);
  const [draft, setDraft] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const isControlled = value !== undefined;
  const tags = isControlled ? value : internal;
  const full = maxTags !== undefined && tags.length >= maxTags;
  const tagKeys = React.useMemo(() => {
    const seen = new Map<string, number>();
    return tags.map((t) => {
      const n = seen.get(t) ?? 0;
      seen.set(t, n + 1);
      return `${t}#${n}`;
    });
  }, [tags]);

  const commit = (next: string[]) => {
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const addTags = (rawList: string[]) => {
    const next = [...tags];
    let problem: string | null = null;
    for (const raw of rawList) {
      const t = raw.trim();
      if (!t) continue;
      if (maxTags !== undefined && next.length >= maxTags) {
        problem = `Up to ${maxTags} tags allowed`;
        break;
      }
      if (!allowDuplicates && next.some((x) => x.toLowerCase() === t.toLowerCase())) {
        problem = `"${t}" is already added`;
        continue;
      }
      const invalid = validate?.(t);
      if (invalid) {
        problem = invalid;
        continue;
      }
      next.push(t);
    }
    if (next.length !== tags.length) commit(next);
    setError(problem);
    return next.length !== tags.length || !problem;
  };

  const splitByDelimiters = (text: string) => text.split(new RegExp(`[${delimiters.map((d) => d.replace(/[\]\\^-]/g, "\\$&")).join("")}\\n]`));

  const matches = React.useMemo(() => {
    const q = draft.trim().toLowerCase();
    return suggestions.filter((sug) => (allowDuplicates || !tags.some((t) => t.toLowerCase() === sug.toLowerCase())) && (!q || sug.toLowerCase().includes(q))).slice(0, 6);
  }, [draft, suggestions, tags, allowDuplicates]);
  const showMenu = focused && !disabled && !full && matches.length > 0;

  const removeAt = (i: number) => {
    commit(tags.filter((_, idx) => idx !== i));
    setError(null);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (showMenu && activeIndex >= 0) {
        addTags([matches[activeIndex]]);
        setDraft("");
        setActiveIndex(-1);
      } else if (draft.trim()) {
        if (addTags([draft])) setDraft("");
      }
    } else if (delimiters.includes(e.key)) {
      e.preventDefault();
      if (draft.trim() && addTags([draft])) setDraft("");
    } else if (e.key === "Backspace" && !draft && tags.length > 0) {
      removeAt(tags.length - 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (!showMenu) return;
      e.preventDefault();
      const dir = e.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((i) => (i === -1 ? (dir === 1 ? 0 : matches.length - 1) : (i + dir + matches.length) % matches.length));
    } else if (e.key === "Escape") {
      setActiveIndex(-1);
      setError(null);
    }
  };

  const onPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    if (!/[,;\n]/.test(text) && delimiters.every((d) => !text.includes(d))) return;
    e.preventDefault();
    addTags(splitByDelimiters(text));
    setDraft("");
  };

  const borderColor = error ? p.error : focused ? p.focus : hovered ? p.borderHover : p.border;

  return (
    <div className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label htmlFor={`${uid}-input`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div className="relative">
      <div
        onClick={() => !disabled && inputRef.current?.focus()}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-wrap items-center"
        style={{ gap: s.gap, padding: `${s.padY}px ${s.padX}px`, minHeight: s.chipH + s.padY * 2, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: focused ? `0 0 0 3px ${error ? `color-mix(in srgb, ${p.error} 25%, transparent)` : `color-mix(in srgb, ${p.focus} 14%, transparent)`}` : "0 0 0 0 transparent", cursor: disabled ? "default" : "text", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
      >
        <AnimatePresence initial={false}>
          {tags.map((tag, i) => (
            <motion.span
              key={tagKeys[i]}
              layout
              className="inline-flex items-center font-semibold whitespace-nowrap"
              style={{ height: s.chipH, gap: 6, paddingLeft: s.padX - 2, paddingRight: 6, borderRadius: 999, background: p.chip, border: `1px solid ${p.chipBorder}`, color: p.text, fontSize: s.font - 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: "spring", stiffness: 500, damping: 32 }}
            >
              {tag}
              <button
                type="button"
                aria-label={`Remove ${tag}`}
                disabled={disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                className="flex shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 opacity-60 transition-opacity outline-none hover:opacity-100 focus-visible:opacity-100"
                style={{ width: s.chipH - 10, height: s.chipH - 10, color: p.text }}
              >
                <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                  <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          id={`${uid}-input`}
          type="text"
          role={suggestions.length ? "combobox" : undefined}
          aria-expanded={suggestions.length ? showMenu : undefined}
          aria-controls={suggestions.length ? `${uid}-list` : undefined}
          aria-activedescendant={showMenu && activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined}
          aria-invalid={error ? true : undefined}
          value={draft}
          disabled={disabled || full}
          placeholder={tags.length === 0 || !full ? placeholder : ""}
          onChange={(e) => {
            setDraft(e.target.value);
            setActiveIndex(-1);
            if (error) setError(null);
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setActiveIndex(-1);
            if (addOnBlur && draft.trim() && addTags([draft])) setDraft("");
          }}
          className="min-w-[90px] flex-1 border-none bg-transparent p-0 outline-none placeholder:text-[color:var(--ti-placeholder)]"
          style={{ color: p.text, fontSize: s.font, height: s.chipH, ["--ti-placeholder" as string]: p.muted }}
        />
      </div>

      <AnimatePresence>
        {showMenu && (
          <motion.ul
            id={`${uid}-list`}
            role="listbox"
            className="absolute left-0 z-50 m-0 w-full list-none p-1.5"
            style={{ top: "calc(100% + 8px)", borderRadius: s.radius, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top center" }}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            {matches.map((sug, i) => (
              <li
                key={sug}
                id={`${uid}-opt-${i}`}
                role="option"
                aria-selected={i === activeIndex}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  addTags([sug]);
                  setDraft("");
                  setActiveIndex(-1);
                }}
                className="cursor-pointer"
                style={{ padding: `${s.padY}px ${s.padX - 2}px`, borderRadius: s.radius - 5, background: i === activeIndex ? p.highlight : "transparent", color: p.text, fontSize: s.font, transition: "background 0.12s ease" }}
              >
                {sug}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      </div>

      {(error || helperText || maxTags !== undefined) && (
        <div className="flex items-start justify-between gap-3" style={{ fontSize: s.font - 1.5, lineHeight: 1.4 }} role={error ? "alert" : undefined}>
          <span style={{ color: error ? p.error : p.muted }}>{error ?? helperText}</span>
          {maxTags !== undefined && (
            <span className="shrink-0 tabular-nums" style={{ color: p.muted }}>
              {tags.length}/{maxTags}
            </span>
          )}
        </div>
      )}

    </div>
  );
}
