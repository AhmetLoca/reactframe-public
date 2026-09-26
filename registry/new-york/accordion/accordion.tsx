"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface AccordionItem {
  value: string;
  title: React.ReactNode;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export type AccordionVariant = "default" | "card" | "filled";
export type AccordionSize = "sm" | "md" | "lg";

export interface AccordionProps {
  items?: AccordionItem[];
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: boolean;
  variant?: AccordionVariant;
  size?: AccordionSize;
  indicator?: "chevron" | "plus";
  theme?: "dark" | "light";
  width?: number | string;
  className?: string;
}

const DEFAULT_ITEMS: AccordionItem[] = [
  { value: "install", title: "How do I install a component?", content: "Copy the source into your project or run the shadcn CLI command shown on each component page. There are no runtime dependencies beyond motion, clsx and tailwind-merge." },
  { value: "customize", title: "Can I customize the design?", content: "Everything is plain React and Tailwind, so you own the code. Most components also expose props for colors, sizes and behavior." },
  { value: "license", title: "What license do the components use?", content: "Free components are MIT licensed. Premium components come with a commercial license for unlimited personal and client projects." },
  { value: "support", title: "Where can I get help?", content: "Open an issue on GitHub or reach out through the support page. We usually reply within a day." },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.6)", line: "rgba(255,255,255,0.1)", card: "#0E0E0E", filled: "rgba(255,255,255,0.05)", hover: "rgba(255,255,255,0.04)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.6)", line: "rgba(10,10,10,0.12)", card: "#FFFFFF", filled: "rgba(10,10,10,0.04)", hover: "rgba(10,10,10,0.03)" },
};

const SIZES: Record<AccordionSize, { title: number; body: number; padX: number; padY: number; icon: number }> = {
  sm: { title: 14, body: 13, padX: 14, padY: 12, icon: 16 },
  md: { title: 15.5, body: 14, padX: 18, padY: 16, icon: 18 },
  lg: { title: 17, body: 15, padX: 22, padY: 20, icon: 20 },
};

function Indicator({ kind, open, size, color }: { kind: "chevron" | "plus"; open: boolean; size: number; color: string }) {
  if (kind === "plus") {
    return (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M3 8h10" />
        <motion.path d="M8 3v10" initial={false} animate={{ scaleY: open ? 0 : 1, opacity: open ? 0 : 1 }} style={{ transformOrigin: "8px 8px" }} transition={{ duration: 0.2 }} />
      </svg>
    );
  }
  return (
    <motion.svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" initial={false} animate={{ rotate: open ? 180 : 0 }} transition={{ type: "spring", stiffness: 420, damping: 28 }}>
      <path d="M4 6.2L8 10L12 6.2" />
    </motion.svg>
  );
}

export function Accordion({ items = DEFAULT_ITEMS, type = "single", value, defaultValue, onValueChange, collapsible = true, variant = "default", size = "md", indicator = "chevron", theme = "dark", width = 870, className }: AccordionProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const [internal, setInternal] = React.useState<string[]>(defaultValue ?? (items[0] ? [items[0].value] : []));
  const isControlled = value !== undefined;
  const openValues = isControlled ? value : internal;
  const headerRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});
  const card = variant === "card";

  const toggle = (v: string) => {
    let next: string[];
    const isOpen = openValues.includes(v);
    if (type === "multiple") next = isOpen ? openValues.filter((x) => x !== v) : [...openValues, v];
    else next = isOpen ? (collapsible ? [] : [v]) : [v];
    if (!isControlled) setInternal(next);
    onValueChange?.(next);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, v: string) => {
    const enabled = items.filter((i) => !i.disabled).map((i) => i.value);
    const idx = enabled.indexOf(v);
    let target: string | undefined;
    if (e.key === "ArrowDown") target = enabled[(idx + 1) % enabled.length];
    else if (e.key === "ArrowUp") target = enabled[(idx - 1 + enabled.length) % enabled.length];
    else if (e.key === "Home") target = enabled[0];
    else if (e.key === "End") target = enabled[enabled.length - 1];
    if (!target) return;
    e.preventDefault();
    headerRefs.current[target]?.focus();
  };

  return (
    <div className={cn("flex flex-col", card && "gap-2.5", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", color: p.text, ...(variant === "default" ? { borderTop: `1px solid ${p.line}` } : {}) }}>
      {items.map((item) => {
        const open = openValues.includes(item.value);
        return (
          <div
            key={item.value}
            style={{
              borderStyle: "solid",
              borderColor: card && open ? `color-mix(in srgb, ${p.text} 35%, transparent)` : p.line,
              borderTopWidth: card ? 1 : 0,
              borderRightWidth: card ? 1 : 0,
              borderBottomWidth: card || variant === "default" ? 1 : 0,
              borderLeftWidth: card ? 1 : 0,
              borderRadius: card ? 16 : variant === "filled" ? 14 : 0,
              background: card ? p.card : variant === "filled" ? p.filled : "transparent",
              marginBottom: variant === "filled" ? 8 : undefined,
              transition: "border-color 0.2s ease",
              overflow: "hidden",
            }}
          >
            <h3 className="m-0">
              <button
                ref={(el) => {
                  headerRefs.current[item.value] = el;
                }}
                type="button"
                id={`${uid}-h-${item.value}`}
                aria-expanded={open}
                aria-controls={`${uid}-p-${item.value}`}
                disabled={item.disabled}
                onClick={() => toggle(item.value)}
                onKeyDown={(e) => onKeyDown(e, item.value)}
                className="flex w-full items-center justify-between gap-4 border-none bg-transparent text-left font-semibold tracking-[-0.01em] outline-none focus-visible:ring-2 focus-visible:ring-inset"
                style={{ padding: `${s.padY}px ${s.padX}px`, fontSize: s.title, lineHeight: `${Math.round(s.title * 1.4)}px`, color: p.text, cursor: item.disabled ? "default" : "pointer", opacity: item.disabled ? 0.4 : 1, ["--tw-ring-color" as string]: p.text }}
              >
                <span className="flex items-center gap-3">
                  {item.icon && <span className="flex shrink-0" style={{ width: s.icon, height: s.icon, color: open ? p.text : p.muted, transition: "color 0.2s ease" }}>{item.icon}</span>}
                  {item.title}
                </span>
                <span className="flex shrink-0">
                  <Indicator kind={indicator} open={open} size={s.icon} color={open ? p.text : p.muted} />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="panel"
                  id={`${uid}-p-${item.value}`}
                  role="region"
                  aria-labelledby={`${uid}-h-${item.value}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ height: { duration: 0.28, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.2 } }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{ padding: `0 ${s.padX}px ${s.padY}px`, fontSize: s.body, lineHeight: `${Math.round(s.body * 1.65)}px`, color: p.muted }}>{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
