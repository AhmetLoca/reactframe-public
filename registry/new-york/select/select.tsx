"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  helperText?: string;
  theme?: "dark" | "light";
  disabled?: boolean;
  size?: number;
  radius?: number;
  width?: number;
  accentColor?: string;
  maxMenuHeight?: number;
  className?: string;
}

const DEFAULT_OPTIONS: SelectOption[] = [
  {
    value: "design",
    label: "Design",
    description: "Interfaces, systems and motion",
  },
  {
    value: "engineering",
    label: "Engineering",
    description: "Frontend, backend and infra",
  },
  {
    value: "product",
    label: "Product",
    description: "Strategy, research and roadmaps",
  },
  {
    value: "marketing",
    label: "Marketing",
    description: "Growth, content and brand",
  },
  {
    value: "support",
    label: "Support",
    description: "Help center and success",
    disabled: true,
  },
];

const PALETTES = {
  dark: {
    triggerBg: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.12)",
    borderHover: "rgba(255,255,255,0.24)",
    text: "#F5F4F1",
    muted: "rgba(245,244,241,0.5)",
    menuBg: "#0E0E0E",
    menuBorder: "rgba(255,255,255,0.08)",
    highlight: "rgba(255,255,255,0.06)",
    shadow: "0 24px 60px rgba(0,0,0,0.55)",
  },
  light: {
    triggerBg: "#FFFFFF",
    border: "rgba(10,10,10,0.14)",
    borderHover: "rgba(10,10,10,0.28)",
    text: "#0A0A0A",
    muted: "rgba(10,10,10,0.5)",
    menuBg: "#FFFFFF",
    menuBorder: "rgba(10,10,10,0.08)",
    highlight: "rgba(10,10,10,0.05)",
    shadow: "0 24px 60px rgba(0,0,0,0.18)",
  },
};

function ChevronIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 6.2L8 10L12 6.2"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CheckIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <motion.path
        d="M3 8.2L6.4 11.6L13 4.4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </svg>
  );
}

export function Select({
  options = DEFAULT_OPTIONS,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Select a team",
  label,
  helperText,
  theme = "dark",
  disabled = false,
  size = 15,
  radius = 14,
  width = 320,
  accentColor = "#F2A841",
  maxMenuHeight = 320,
  className,
}: SelectProps) {
  const p = PALETTES[theme];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue,
  );
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [focusVisible, setFocusVisible] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(-1);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;
  const selected = options.find((o) => o.value === current);
  const listId = `${uid}-list`;
  const height = Math.round(size * 2.9);

  const enabledIndexes = options
    .map((o, i) => (o.disabled ? -1 : i))
    .filter((i) => i >= 0);

  const commit = (opt: SelectOption) => {
    if (opt.disabled) return;
    if (!isControlled) setInternalValue(opt.value);
    onValueChange?.(opt.value);
    setOpen(false);
  };

  const openMenu = () => {
    if (disabled) return;
    const selectedIndex = options.findIndex((o) => o.value === current);
    setActiveIndex(
      selectedIndex >= 0 ? selectedIndex : (enabledIndexes[0] ?? -1),
    );
    setOpen(true);
  };

  const move = (dir: 1 | -1) => {
    if (enabledIndexes.length === 0) return;
    const pos = enabledIndexes.indexOf(activeIndex);
    const nextPos =
      pos === -1
        ? dir === 1
          ? 0
          : enabledIndexes.length - 1
        : (pos + dir + enabledIndexes.length) % enabledIndexes.length;
    setActiveIndex(enabledIndexes[nextPos]);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) openMenu();
      else move(e.key === "ArrowDown" ? 1 : -1);
    } else if (e.key === "Home" && open) {
      e.preventDefault();
      setActiveIndex(enabledIndexes[0] ?? -1);
    } else if (e.key === "End" && open) {
      e.preventDefault();
      setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!open) openMenu();
      else if (activeIndex >= 0) commit(options[activeIndex]);
    } else if (e.key === "Escape" && open) {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1 && /\S/.test(e.key)) {
      const start = open ? activeIndex + 1 : 0;
      const ordered = [...options.slice(start), ...options.slice(0, start)];
      const hit = ordered.find(
        (o) =>
          !o.disabled && o.label.toLowerCase().startsWith(e.key.toLowerCase()),
      );
      if (hit) {
        const idx = options.indexOf(hit);
        if (open) setActiveIndex(idx);
        else commit(hit);
      }
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const borderColor = open ? accentColor : hovered ? p.borderHover : p.border;

  return (
    <div
      ref={rootRef}
      className={cn("relative inline-flex flex-col gap-2", className)}
      style={{ width, fontFamily: "Inter, sans-serif" }}
    >
      {label && (
        <label
          id={`${uid}-label`}
          className="font-semibold tracking-[-0.01em]"
          style={{ color: p.text, fontSize: size * 0.9 }}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <button
          type="button"
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={label ? `${uid}-label` : undefined}
          aria-activedescendant={
            open && activeIndex >= 0 ? `${uid}-opt-${activeIndex}` : undefined
          }
          disabled={disabled}
          onClick={() => (open ? setOpen(false) : openMenu())}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocus={(e) =>
            setFocusVisible(e.currentTarget.matches(":focus-visible"))
          }
          onBlur={() => setFocusVisible(false)}
          className="flex w-full items-center justify-between gap-3 text-left outline-none"
          style={{
            height,
            padding: `0 ${size * 0.95}px`,
            borderRadius: radius,
            border: `1px solid ${borderColor}`,
            background: p.triggerBg,
            color: selected ? p.text : p.muted,
            fontSize: size,
            fontWeight: 500,
            cursor: disabled ? "default" : "pointer",
            opacity: disabled ? 0.5 : 1,
            boxShadow:
              focusVisible || open
                ? `0 0 0 3px color-mix(in srgb, ${accentColor} 25%, transparent)`
                : "0 0 0 0 transparent",
            transition: "border-color 0.18s ease, box-shadow 0.18s ease",
          }}
        >
          <span className="truncate">
            {selected ? selected.label : placeholder}
          </span>
          <motion.span
            className="flex shrink-0"
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
          >
            <ChevronIcon
              size={size * 1.1}
              color={open ? accentColor : p.muted}
            />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              id={listId}
              role="listbox"
              aria-labelledby={label ? `${uid}-label` : undefined}
              className="absolute left-0 z-50 m-0 w-full list-none overflow-auto p-1.5"
              style={{
                top: "calc(100% + 8px)",
                maxHeight: maxMenuHeight,
                borderRadius: radius + 2,
                border: `1px solid ${p.menuBorder}`,
                background: p.menuBg,
                boxShadow: p.shadow,
                transformOrigin: "top center",
              }}
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              {options.map((opt, i) => {
                const isSelected = opt.value === current;
                const isActive = i === activeIndex;
                return (
                  <li
                    key={opt.value}
                    id={`${uid}-opt-${i}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={opt.disabled}
                    onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                    onClick={() => commit(opt)}
                    className="flex items-center justify-between gap-3"
                    style={{
                      padding: `${size * 0.6}px ${size * 0.75}px`,
                      borderRadius: radius - 4,
                      background: isActive ? p.highlight : "transparent",
                      opacity: opt.disabled ? 0.4 : 1,
                      cursor: opt.disabled ? "default" : "pointer",
                      transition: "background 0.12s ease",
                    }}
                  >
                    <div className="flex min-w-0 flex-col gap-0.5">
                      <span
                        className="truncate font-medium"
                        style={{
                          color: isSelected ? accentColor : p.text,
                          fontSize: size,
                        }}
                      >
                        {opt.label}
                      </span>
                      {opt.description && (
                        <span
                          className="truncate"
                          style={{ color: p.muted, fontSize: size * 0.8 }}
                        >
                          {opt.description}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="flex shrink-0">
                        <CheckIcon size={size} color={accentColor} />
                      </span>
                    )}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {helperText && (
        <span style={{ color: p.muted, fontSize: size * 0.8, lineHeight: 1.4 }}>
          {helperText}
        </span>
      )}
    </div>
  );
}
