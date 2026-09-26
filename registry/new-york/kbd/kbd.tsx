"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type KbdVariant = "raised" | "flat" | "outline";
export type KbdSize = "sm" | "md" | "lg";

export interface KbdProps {
  combo?: string;
  children?: React.ReactNode;
  variant?: KbdVariant;
  size?: KbdSize;
  theme?: "dark" | "light";
  separator?: boolean;
  listen?: boolean;
  className?: string;
}

const PALETTES = {
  dark: {
    raised: { bg: "linear-gradient(180deg, #1C1C1C, #141414)", border: "rgba(255,255,255,0.12)", shadow: "0 2px 0 0 rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)", pressedShadow: "0 0 0 0 rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.04)" },
    flat: { bg: "rgba(255,255,255,0.07)", border: "transparent", shadow: "none", pressedShadow: "none" },
    outline: { bg: "transparent", border: "rgba(255,255,255,0.22)", shadow: "none", pressedShadow: "none" },
    text: "#F5F4F1",
    muted: "rgba(245,244,241,0.4)",
    pressedBg: "rgba(255,255,255,0.16)",
  },
  light: {
    raised: { bg: "linear-gradient(180deg, #FFFFFF, #F5F4F1)", border: "rgba(10,10,10,0.14)", shadow: "0 2px 0 0 rgba(10,10,10,0.14), inset 0 1px 0 rgba(255,255,255,0.9)", pressedShadow: "0 0 0 0 rgba(10,10,10,0.14), inset 0 1px 0 rgba(255,255,255,0.6)" },
    flat: { bg: "rgba(10,10,10,0.06)", border: "transparent", shadow: "none", pressedShadow: "none" },
    outline: { bg: "transparent", border: "rgba(10,10,10,0.25)", shadow: "none", pressedShadow: "none" },
    text: "#0A0A0A",
    muted: "rgba(10,10,10,0.4)",
    pressedBg: "rgba(10,10,10,0.12)",
  },
};

const SIZES: Record<KbdSize, { height: number; font: number; padX: number; radius: number }> = {
  sm: { height: 22, font: 11, padX: 6, radius: 6 },
  md: { height: 26, font: 12.5, padX: 8, radius: 7 },
  lg: { height: 32, font: 14, padX: 10, radius: 9 },
};

const SYMBOLS: Record<string, { mac?: string; other?: string; both?: string }> = {
  mod: { mac: "⌘", other: "Ctrl" },
  cmd: { both: "⌘" },
  command: { both: "⌘" },
  meta: { mac: "⌘", other: "Win" },
  ctrl: { mac: "⌃", other: "Ctrl" },
  control: { mac: "⌃", other: "Ctrl" },
  shift: { both: "⇧" },
  alt: { mac: "⌥", other: "Alt" },
  option: { mac: "⌥", other: "Alt" },
  enter: { both: "↵" },
  return: { both: "↵" },
  esc: { both: "Esc" },
  escape: { both: "Esc" },
  tab: { both: "⇥" },
  backspace: { both: "⌫" },
  delete: { both: "Del" },
  space: { both: "Space" },
  up: { both: "↑" },
  down: { both: "↓" },
  left: { both: "←" },
  right: { both: "→" },
};

const subscribe = () => () => {};
const getMac = () => typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent);

function labelFor(token: string, mac: boolean) {
  const entry = SYMBOLS[token.toLowerCase()];
  if (entry) return entry.both ?? (mac ? entry.mac : entry.other) ?? token;
  return token.length === 1 ? token.toUpperCase() : token;
}

function eventToken(e: KeyboardEvent): string {
  const k = e.key;
  if (k === "Meta") return "cmd";
  if (k === "Control") return "ctrl";
  if (k === "Shift") return "shift";
  if (k === "Alt") return "alt";
  if (k === " ") return "space";
  if (k === "Escape") return "esc";
  if (k.startsWith("Arrow")) return k.slice(5).toLowerCase();
  return k.toLowerCase();
}

function normalizeToken(token: string, mac: boolean) {
  const t = token.toLowerCase();
  if (t === "mod") return mac ? "cmd" : "ctrl";
  if (t === "command" || t === "meta") return "cmd";
  if (t === "control") return "ctrl";
  if (t === "option") return "alt";
  if (t === "escape") return "esc";
  if (t === "return") return "enter";
  return t;
}

export function Kbd({ combo, children, variant = "raised", size = "md", theme = "dark", separator = false, listen = false, className }: KbdProps) {
  const mac = React.useSyncExternalStore(subscribe, getMac, () => false);
  const p = PALETTES[theme];
  const v = p[variant];
  const s = SIZES[size];
  const tokens = combo ? combo.split("+").map((t) => t.trim()).filter(Boolean) : [];
  const [pressed, setPressed] = React.useState<Set<string>>(() => new Set());

  React.useEffect(() => {
    if (!listen) return;
    const down = (e: KeyboardEvent) => setPressed((prev) => new Set(prev).add(eventToken(e)));
    const up = (e: KeyboardEvent) =>
      setPressed((prev) => {
        const next = new Set(prev);
        next.delete(eventToken(e));
        return next;
      });
    const clear = () => setPressed(new Set());
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
    };
  }, [listen]);

  const cap = (label: React.ReactNode, isPressed: boolean, key: string) => (
    <kbd
      key={key}
      className="inline-flex items-center justify-center font-semibold select-none"
      style={{
        minWidth: s.height,
        height: s.height,
        padding: `0 ${s.padX}px`,
        borderRadius: s.radius,
        fontSize: s.font,
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        lineHeight: 1,
        color: p.text,
        background: isPressed ? p.pressedBg : v.bg,
        border: `1px solid ${v.border}`,
        boxShadow: isPressed ? v.pressedShadow : v.shadow,
        transform: isPressed ? "translateY(2px)" : "translateY(0)",
        transition: "transform 0.08s ease, box-shadow 0.08s ease, background 0.08s ease",
      }}
    >
      {label}
    </kbd>
  );

  if (tokens.length === 0) {
    return <span className={cn("inline-flex", className)}>{cap(children, false, "single")}</span>;
  }

  return (
    <span className={cn("inline-flex items-center", className)} style={{ gap: separator ? 6 : 4 }} aria-label={tokens.join(" + ")}>
      {tokens.map((token, i) => (
        <React.Fragment key={`${token}-${i}`}>
          {cap(labelFor(token, mac), listen && pressed.has(normalizeToken(token, mac)), `${token}-${i}`)}
          {separator && i < tokens.length - 1 && (
            <span aria-hidden="true" style={{ color: p.muted, fontSize: s.font, fontFamily: "Inter, sans-serif" }}>
              +
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  );
}
