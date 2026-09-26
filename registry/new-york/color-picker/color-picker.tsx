"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ColorPickerSize = "sm" | "md" | "lg";

export interface ColorPickerProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (hex: string) => void;
  showAlpha?: boolean;
  showEyeDropper?: boolean;
  presets?: string[];
  label?: string;
  helperText?: string;
  size?: ColorPickerSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

interface HSVA {
  h: number;
  s: number;
  v: number;
  a: number;
}

const DEFAULT_PRESETS = ["#F5F4F1", "#0A0A0A", "#87FFE3", "#F2A841", "#FF7A6B", "#8FB8FF", "#B8A6FF", "#4ADE80", "#FACC15", "#F472B6"];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", field: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", menuBg: "#0E0E0E", menuBorder: "rgba(255,255,255,0.1)", hover: "rgba(255,255,255,0.08)", swatchRing: "rgba(255,255,255,0.18)", thumbRing: "#FFFFFF", shadow: "0 24px 60px rgba(0,0,0,0.55)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", field: "rgba(10,10,10,0.04)", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", menuBg: "#FFFFFF", menuBorder: "rgba(10,10,10,0.14)", hover: "rgba(10,10,10,0.06)", swatchRing: "rgba(10,10,10,0.16)", thumbRing: "#FFFFFF", shadow: "0 20px 50px rgba(0,0,0,0.18)" },
};

const SIZES: Record<ColorPickerSize, { font: number; height: number; padX: number; radius: number; swatch: number }> = {
  sm: { font: 13, height: 36, padX: 8, radius: 11, swatch: 22 },
  md: { font: 14.5, height: 44, padX: 10, radius: 13, swatch: 28 },
  lg: { font: 16, height: 52, padX: 12, radius: 15, swatch: 34 },
};

const clamp = (n: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, n));

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  return [Math.round(f(5) * 255), Math.round(f(3) * 255), Math.round(f(1) * 255)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : d / max, max];
}

const hex2 = (n: number) => Math.round(n).toString(16).padStart(2, "0").toUpperCase();

function toHex({ h, s, v, a }: HSVA, withAlpha: boolean) {
  const [r, g, b] = hsvToRgb(h, s, v);
  return `#${hex2(r)}${hex2(g)}${hex2(b)}${withAlpha && a < 1 ? hex2(a * 255) : ""}`;
}

function parseHex(input: string): HSVA | null {
  let x = input.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3,4}$/i.test(x)) x = x.split("").map((c) => c + c).join("");
  if (!/^([0-9a-f]{6}|[0-9a-f]{8})$/i.test(x)) return null;
  const r = parseInt(x.slice(0, 2), 16);
  const g = parseInt(x.slice(2, 4), 16);
  const b = parseInt(x.slice(4, 6), 16);
  const a = x.length === 8 ? parseInt(x.slice(6, 8), 16) / 255 : 1;
  const [h, s, v] = rgbToHsv(r, g, b);
  return { h, s, v, a };
}

const CHECKER = "repeating-conic-gradient(#8884 0% 25%, transparent 0% 50%) 50% / 10px 10px";

const subscribeNoop = () => () => {};
const detectEyeDropper = () => typeof window !== "undefined" && "EyeDropper" in window;

function useDrag(onMove: (x: number, y: number) => void) {
  const ref = React.useRef<HTMLDivElement>(null);
  const handle = (e: React.PointerEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    onMove(clamp((e.clientX - r.left) / r.width), clamp((e.clientY - r.top) / r.height));
  };
  return {
    ref,
    onPointerDown: (e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      handle(e);
    },
    onPointerMove: (e: React.PointerEvent) => {
      if (e.buttons === 1) handle(e);
    },
  };
}

export function ColorPicker({
  value,
  defaultValue = "#F2A841",
  onValueChange,
  showAlpha = false,
  showEyeDropper = true,
  presets = DEFAULT_PRESETS,
  label,
  helperText,
  size = "md",
  theme = "dark",
  width = 260,
  disabled = false,
  className,
}: ColorPickerProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const rootRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const controlled = value !== undefined;
  const [hsva, setHsva] = React.useState<HSVA>(() => parseHex(value ?? defaultValue) ?? { h: 0, s: 0, v: 0, a: 1 });
  const [open, setOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [draft, setDraft] = React.useState<string | null>(null);
  const canPick = React.useSyncExternalStore(subscribeNoop, detectEyeDropper, () => false);

  const hex = toHex(hsva, showAlpha);
  if (controlled) {
    const incoming = parseHex(value);
    if (incoming && toHex(incoming, showAlpha) !== hex) setHsva(incoming);
  }

  const update = (patch: Partial<HSVA> | HSVA) => {
    const next = { ...hsva, ...patch };
    setHsva(next);
    setDraft(null);
    onValueChange?.(toHex(next, showAlpha));
  };

  const [r, g, b] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const pure = `hsl(${Math.round(hsva.h)} 100% 50%)`;
  const solid = `rgb(${r} ${g} ${b})`;

  const area = useDrag((x, y) => update({ s: x, v: 1 - y }));
  const hueDrag = useDrag((x) => update({ h: x * 360 }));
  const alphaDrag = useDrag((x) => update({ a: Math.round(x * 100) / 100 }));

  const onAreaKey = (e: React.KeyboardEvent) => {
    const d = e.shiftKey ? 0.1 : 0.01;
    const map: Record<string, Partial<HSVA>> = {
      ArrowLeft: { s: clamp(hsva.s - d) },
      ArrowRight: { s: clamp(hsva.s + d) },
      ArrowUp: { v: clamp(hsva.v + d) },
      ArrowDown: { v: clamp(hsva.v - d) },
    };
    if (map[e.key]) {
      e.preventDefault();
      update(map[e.key]);
    }
  };
  const onSliderKey = (key: "h" | "a") => (e: React.KeyboardEvent) => {
    const unit = key === "h" ? 360 : 1;
    const d = (e.shiftKey ? 0.1 : 0.01) * unit;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = hsva[key] + d;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = hsva[key] - d;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = unit;
    if (next === null) return;
    e.preventDefault();
    update({ [key]: clamp(next, 0, unit) } as Partial<HSVA>);
  };

  const commitDraft = () => {
    if (draft === null) return;
    const parsed = parseHex(draft);
    if (parsed) update(showAlpha ? parsed : { ...parsed, a: 1 });
    setDraft(null);
  };

  const pickWithEyeDropper = async () => {
    try {
      const Ctor = (window as unknown as { EyeDropper: new () => { open: () => Promise<{ sRGBHex: string }> } }).EyeDropper;
      const res = await new Ctor().open();
      const parsed = parseHex(res.sRGBHex);
      if (parsed) update({ ...parsed, a: hsva.a });
    } catch {
      /* user cancelled */
    }
  };

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const borderColor = open ? p.focus : hovered ? p.borderHover : p.border;
  const thumbStyle: React.CSSProperties = { position: "absolute", width: 16, height: 16, borderRadius: 999, border: `2.5px solid ${p.thumbRing}`, boxShadow: "0 0 0 1px rgba(0,0,0,0.35), 0 2px 6px rgba(0,0,0,0.4)", transform: "translate(-50%, -50%)", pointerEvents: "none" };

  return (
    <div ref={rootRef} className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <label id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </label>
      )}

      <div className="relative">
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-labelledby={label ? `${uid}-label` : undefined}
          aria-label={label ? undefined : "Choose color"}
          disabled={disabled}
          onClick={() => setOpen((o) => !o)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="flex w-full items-center text-left outline-none"
          style={{ height: s.height, gap: 10, padding: `0 ${s.padX + 4}px 0 ${s.padX}px`, borderRadius: s.radius, background: p.bg, border: `1px solid ${borderColor}`, boxShadow: open ? `0 0 0 3px color-mix(in srgb, ${p.focus} 14%, transparent)` : "0 0 0 0 transparent", color: p.text, fontSize: s.font, fontWeight: 600, cursor: disabled ? "default" : "pointer", transition: "border-color 0.18s ease, box-shadow 0.18s ease" }}
        >
          <span className="relative shrink-0 overflow-hidden" style={{ width: s.swatch, height: s.swatch, borderRadius: s.radius - 5, boxShadow: `inset 0 0 0 1px ${p.swatchRing}`, background: CHECKER }}>
            <span className="absolute inset-0" style={{ background: `rgb(${r} ${g} ${b} / ${hsva.a})` }} />
          </span>
          <span className="min-w-0 flex-1 truncate font-mono tabular-nums" style={{ letterSpacing: "0.02em" }}>
            {hex}
          </span>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke={p.muted} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
            <path d="M4 6L8 10L12 6" />
          </svg>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="Color picker"
              className="absolute left-0 z-50 flex flex-col"
              style={{ top: "calc(100% + 8px)", width: Math.max(280, typeof width === "number" ? width : 280), gap: 12, padding: 12, borderRadius: s.radius + 6, border: `1px solid ${p.menuBorder}`, background: p.menuBg, boxShadow: p.shadow, transformOrigin: "top left" }}
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            >
              <div
                {...area}
                role="slider"
                tabIndex={0}
                aria-label="Saturation and brightness"
                aria-valuetext={`Saturation ${Math.round(hsva.s * 100)}%, brightness ${Math.round(hsva.v * 100)}%`}
                aria-valuenow={Math.round(hsva.s * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                onKeyDown={onAreaKey}
                className="relative cursor-crosshair touch-none rounded-xl outline-none focus-visible:ring-2"
                style={{ height: 150, background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, ${pure})`, ["--tw-ring-color" as string]: p.focus }}
              >
                <span style={{ ...thumbStyle, left: `${hsva.s * 100}%`, top: `${(1 - hsva.v) * 100}%`, background: solid }} />
              </div>

              <div className="flex items-center" style={{ gap: 12 }}>
                {canPick && showEyeDropper && (
                  <button type="button" aria-label="Pick color from screen" onClick={pickWithEyeDropper} className="flex shrink-0 cursor-pointer items-center justify-center rounded-lg border-none outline-none focus-visible:ring-2" style={{ width: 32, height: 32, background: p.field, color: p.text, ["--tw-ring-color" as string]: p.focus }}>
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M10.5 2.5l3 3-2 2-3-3 2-2ZM8.5 4.5l-5.2 5.2a1 1 0 0 0-.3.7V13h2.6a1 1 0 0 0 .7-.3L11.5 7.5" />
                    </svg>
                  </button>
                )}
                <div className="flex flex-1 flex-col" style={{ gap: 10 }}>
                  <div
                    {...hueDrag}
                    role="slider"
                    tabIndex={0}
                    aria-label="Hue"
                    aria-valuemin={0}
                    aria-valuemax={360}
                    aria-valuenow={Math.round(hsva.h)}
                    onKeyDown={onSliderKey("h")}
                    className="relative cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2"
                    style={{ height: 12, background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)", ["--tw-ring-color" as string]: p.focus }}
                  >
                    <span style={{ ...thumbStyle, top: "50%", left: `${(hsva.h / 360) * 100}%`, background: pure }} />
                  </div>
                  {showAlpha && (
                    <div
                      {...alphaDrag}
                      role="slider"
                      tabIndex={0}
                      aria-label="Opacity"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(hsva.a * 100)}
                      onKeyDown={onSliderKey("a")}
                      className="relative cursor-pointer touch-none rounded-full outline-none focus-visible:ring-2"
                      style={{ height: 12, background: CHECKER, ["--tw-ring-color" as string]: p.focus }}
                    >
                      <span className="absolute inset-0 rounded-full" style={{ background: `linear-gradient(to right, rgb(${r} ${g} ${b} / 0), rgb(${r} ${g} ${b}))` }} />
                      <span style={{ ...thumbStyle, top: "50%", left: `${hsva.a * 100}%`, background: `rgb(${r} ${g} ${b} / ${hsva.a})` }} />
                    </div>
                  )}
                </div>
              </div>

              <input
                aria-label="Hex value"
                value={draft ?? hex}
                spellCheck={false}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commitDraft}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitDraft();
                  else if (e.key === "Escape") {
                    e.stopPropagation();
                    setDraft(null);
                  }
                }}
                className="w-full rounded-lg border-none font-mono font-semibold uppercase tabular-nums outline-none focus-visible:ring-2"
                style={{ height: 34, padding: "0 10px", background: p.field, color: p.text, fontSize: s.font - 1.5, letterSpacing: "0.04em", ["--tw-ring-color" as string]: p.focus }}
              />

              {presets.length > 0 && (
                <div className="flex flex-wrap justify-between" style={{ gap: 6 }} role="group" aria-label="Preset colors">
                  {presets.map((c) => {
                    const active = hex.slice(0, 7).toUpperCase() === c.toUpperCase();
                    return (
                      <button
                        key={c}
                        type="button"
                        aria-label={`Use ${c}`}
                        aria-pressed={active}
                        onClick={() => {
                          const parsed = parseHex(c);
                          if (parsed) update({ ...parsed, a: hsva.a });
                        }}
                        className="cursor-pointer rounded-full border-none outline-none focus-visible:ring-2"
                        style={{ width: 20, height: 20, background: c, boxShadow: active ? `0 0 0 2px ${p.menuBg}, 0 0 0 4px ${p.text}` : `inset 0 0 0 1px ${p.swatchRing}`, transition: "box-shadow 0.15s ease, transform 0.15s ease", ["--tw-ring-color" as string]: p.focus }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.12)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
                      />
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {helperText && <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>{helperText}</span>}
    </div>
  );
}
