"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type MotionValue } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DockSize = "sm" | "md" | "lg";

export interface DockItem {
  id: string;
  kind?: "item" | "separator";
  label?: string;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export interface DockProps {
  items: DockItem[];
  onSelect?: (item: DockItem) => void;
  size?: DockSize;
  /** How much the icon under the cursor scales up, as a multiplier of the base size. */
  magnification?: number;
  /** How far (in px) the magnification effect reaches on either side of the cursor. */
  distance?: number;
  theme?: "dark" | "light";
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", bar: "rgba(255,255,255,0.06)", border: "rgba(255,255,255,0.12)", tile: "rgba(255,255,255,0.08)", tileActive: "rgba(255,255,255,0.16)", dot: "#F5F4F1", divider: "rgba(255,255,255,0.14)", tipBg: "#161616", tipBorder: "rgba(255,255,255,0.12)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", bar: "rgba(255,255,255,0.7)", border: "rgba(10,10,10,0.1)", tile: "rgba(10,10,10,0.05)", tileActive: "rgba(10,10,10,0.1)", dot: "#0A0A0A", divider: "rgba(10,10,10,0.12)", tipBg: "#FFFFFF", tipBorder: "rgba(10,10,10,0.1)" },
};

const SIZES: Record<DockSize, { base: number; radius: number; gap: number; padY: number; padX: number }> = {
  sm: { base: 40, radius: 12, gap: 10, padY: 8, padX: 10 },
  md: { base: 48, radius: 14, gap: 12, padY: 10, padX: 12 },
  lg: { base: 56, radius: 16, gap: 14, padY: 12, padX: 14 },
};

type Palette = (typeof PALETTES)["dark"];

function DockTip({ label, theme, show, pos }: { label: string; theme: "dark" | "light"; show: boolean; pos: { x: number; y: number } }) {
  const p = PALETTES[theme];
  return typeof document === "undefined"
    ? null
    : createPortal(
        <AnimatePresence>
          {show && (
            <motion.span
              role="tooltip"
              initial={{ opacity: 0, y: 4, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.94 }}
              transition={{ duration: 0.12 }}
              className="pointer-events-none fixed z-[9999] font-medium whitespace-nowrap"
              style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -100%)", padding: "5px 9px", borderRadius: 8, background: p.tipBg, border: `1px solid ${p.tipBorder}`, color: p.text, fontSize: 12.5, boxShadow: theme === "dark" ? "0 12px 32px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.16)" }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>,
        document.body,
      );
}

interface DockIconProps {
  item: DockItem;
  mouseX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  distance: number;
  radius: number;
  p: Palette;
  theme: "dark" | "light";
  tabIndex: number;
  onFocus: () => void;
  onActivate: () => void;
  setRef: (el: HTMLButtonElement | null) => void;
}

function DockIcon({ item, mouseX, baseSize, magnification, distance, radius, p, theme, tabIndex, onFocus, onActivate, setRef }: DockIconProps) {
  const ref = React.useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = React.useState(false);
  // Magnify on keyboard focus only: a mouse click also focuses the button, and that focus would
  // otherwise keep the icon enlarged after the pointer has left.
  const [keyboardFocus, setKeyboardFocus] = React.useState(false);
  const [tipPos, setTipPos] = React.useState({ x: 0, y: 0 });

  const dist = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return distance * 2;
    return val - (bounds.left + bounds.width / 2);
  });
  const sizeSync = useTransform(dist, [-distance, 0, distance], [baseSize, baseSize * magnification, baseSize]);
  const springSize = useSpring(sizeSync, { mass: 0.15, stiffness: 300, damping: 18 });
  const size = keyboardFocus ? baseSize * magnification : springSize;

  const updateTip = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setTipPos({ x: r.left + r.width / 2, y: r.top - 10 });
  };

  return (
    <div className="relative flex flex-col items-center" style={{ gap: 5 }}>
      <motion.button
        ref={(el) => {
          ref.current = el;
          setRef(el);
        }}
        type="button"
        aria-label={item.label}
        aria-disabled={item.disabled || undefined}
        aria-pressed={item.active || undefined}
        disabled={item.disabled}
        tabIndex={tabIndex}
        onFocus={(e) => {
          onFocus();
          updateTip();
          setHovered(true);
          setKeyboardFocus(e.currentTarget.matches(":focus-visible"));
        }}
        onBlur={() => {
          setHovered(false);
          setKeyboardFocus(false);
        }}
        onMouseEnter={() => {
          updateTip();
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        onClick={onActivate}
        className="relative flex shrink-0 cursor-pointer items-center justify-center border-none outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-35"
        style={{ width: size, height: size, borderRadius: radius, background: item.active ? p.tileActive : p.tile, color: p.text, ["--tw-ring-color" as string]: p.text }}
      >
        <span className="flex items-center justify-center" style={{ width: "58%", height: "58%" }}>
          {item.icon}
        </span>
      </motion.button>
      <span aria-hidden="true" className="rounded-full" style={{ width: 4, height: 4, background: item.active ? p.dot : "transparent" }} />
      <DockTip label={item.label ?? ""} theme={theme} show={hovered && Boolean(item.label)} pos={tipPos} />
    </div>
  );
}

export function Dock({ items, onSelect, size = "md", magnification = 1.7, distance = 140, theme = "dark", className }: DockProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const mouseX = useMotionValue(Infinity);
  const [focusedId, setFocusedId] = React.useState<string | null>(null);
  const enabledIds = items.filter((i) => i.kind !== "separator" && !i.disabled).map((i) => i.id);
  const btnRefs = React.useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (dir: 1 | -1) => {
    if (enabledIds.length === 0) return;
    const i = focusedId ? enabledIds.indexOf(focusedId) : -1;
    const next = enabledIds[(i + dir + enabledIds.length) % enabledIds.length];
    setFocusedId(next);
    btnRefs.current[next]?.focus({ preventScroll: true });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      move(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      move(-1);
    } else if (e.key === "Home") {
      e.preventDefault();
      if (enabledIds.length) {
        setFocusedId(enabledIds[0]);
        btnRefs.current[enabledIds[0]]?.focus({ preventScroll: true });
      }
    } else if (e.key === "End") {
      e.preventDefault();
      if (enabledIds.length) {
        const last = enabledIds[enabledIds.length - 1];
        setFocusedId(last);
        btnRefs.current[last]?.focus({ preventScroll: true });
      }
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Dock"
      onKeyDown={onKeyDown}
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn("inline-flex items-end", className)}
      style={{ gap: s.gap, padding: `${s.padY}px ${s.padX}px`, borderRadius: s.radius + 12, background: p.bar, border: `1px solid ${p.border}`, backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", fontFamily: "Inter, sans-serif" }}
    >
      {items.map((item) =>
        item.kind === "separator" ? (
          <div key={item.id} aria-hidden="true" className="self-stretch" style={{ width: 1, margin: `0 ${s.gap / 4}px`, background: p.divider }} />
        ) : (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            baseSize={s.base}
            magnification={magnification}
            distance={distance}
            radius={s.radius}
            p={p}
            theme={theme}
            tabIndex={item.id === (focusedId ?? enabledIds[0]) ? 0 : -1}
            onFocus={() => setFocusedId(item.id)}
            onActivate={() => {
              if (item.disabled) return;
              setFocusedId(item.id);
              onSelect?.(item);
              item.onClick?.();
            }}
            setRef={(el) => {
              btnRefs.current[item.id] = el;
            }}
          />
        ),
      )}
    </div>
  );
}
