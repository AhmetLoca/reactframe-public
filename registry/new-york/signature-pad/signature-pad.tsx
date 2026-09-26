"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SignaturePadSize = "sm" | "md" | "lg";

export interface SignatureResult {
  isEmpty: boolean;
  /** PNG data URL on a transparent background, drawn in exportColor. Null when empty. */
  dataUrl: string | null;
  /** Standalone SVG markup, drawn in exportColor. Null when empty. */
  svg: string | null;
  mode: "draw" | "type";
  /** The typed name in type mode. */
  typedName: string;
}

export interface SignaturePadProps {
  onChange?: (result: SignatureResult) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  /** Offer a "Type" tab that renders the typed name in a script face. */
  allowTyping?: boolean;
  /** Ink colour on screen; defaults to the theme's text colour. */
  penColor?: string;
  /** Colour used in the exported PNG and SVG, so a signature drawn in dark mode still shows on white paper. */
  exportColor?: string;
  minWidth?: number;
  maxWidth?: number;
  height?: number;
  size?: SignaturePadSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.28)", bg: "rgba(255,255,255,0.03)", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", line: "rgba(245,244,241,0.22)", hover: "rgba(255,255,255,0.07)", sel: "#F5F4F1", selText: "#0A0A0A", track: "rgba(255,255,255,0.06)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.28)", bg: "#FFFFFF", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", line: "rgba(10,10,10,0.2)", hover: "rgba(10,10,10,0.05)", sel: "#0A0A0A", selText: "#FFFFFF", track: "rgba(10,10,10,0.05)" },
};

const SIZES: Record<SignaturePadSize, { font: number; radius: number; btn: number }> = {
  sm: { font: 13, radius: 11, btn: 30 },
  md: { font: 14.5, radius: 13, btn: 34 },
  lg: { font: 16, radius: 15, btn: 38 },
};

const SCRIPT_FONT = '"Snell Roundhand", "Segoe Script", "Brush Script MT", "Apple Chancery", cursive';

interface Point {
  x: number;
  y: number;
  w: number;
}
type Stroke = Point[];

// Draws one stroke as a chain of quadratic curves through the midpoints, each segment at its own width.
function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke, color: string) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  if (stroke.length === 1) {
    ctx.beginPath();
    ctx.arc(stroke[0].x, stroke[0].y, stroke[0].w / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }
  for (let i = 1; i < stroke.length; i++) {
    const a = stroke[i - 1];
    const b = stroke[i];
    const prev = stroke[i - 2] ?? a;
    const start = { x: (prev.x + a.x) / 2, y: (prev.y + a.y) / 2 };
    const end = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    ctx.lineWidth = (a.w + b.w) / 2;
    ctx.beginPath();
    ctx.moveTo(i === 1 ? a.x : start.x, i === 1 ? a.y : start.y);
    ctx.quadraticCurveTo(a.x, a.y, end.x, end.y);
    ctx.stroke();
  }
  const last = stroke[stroke.length - 1];
  const beforeLast = stroke[stroke.length - 2];
  ctx.lineWidth = last.w;
  ctx.beginPath();
  ctx.moveTo((beforeLast.x + last.x) / 2, (beforeLast.y + last.y) / 2);
  ctx.lineTo(last.x, last.y);
  ctx.stroke();
}

function strokesToSvg(strokes: Stroke[], w: number, h: number, color: string) {
  const paths = strokes
    .map((s) => {
      if (s.length === 1) return `<circle cx="${s[0].x.toFixed(1)}" cy="${s[0].y.toFixed(1)}" r="${(s[0].w / 2).toFixed(2)}" fill="${color}"/>`;
      let d = `M${s[0].x.toFixed(1)} ${s[0].y.toFixed(1)}`;
      for (let i = 1; i < s.length; i++) {
        const a = s[i - 1];
        const b = s[i];
        d += ` Q${a.x.toFixed(1)} ${a.y.toFixed(1)} ${((a.x + b.x) / 2).toFixed(1)} ${((a.y + b.y) / 2).toFixed(1)}`;
      }
      const avg = s.reduce((sum, p) => sum + p.w, 0) / s.length;
      return `<path d="${d}" fill="none" stroke="${color}" stroke-width="${avg.toFixed(2)}" stroke-linecap="round" stroke-linejoin="round"/>`;
    })
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" width="${Math.round(w)}" height="${Math.round(h)}">${paths}</svg>`;
}

export function SignaturePad({
  onChange,
  label,
  helperText,
  placeholder = "Sign here",
  allowTyping = true,
  penColor,
  exportColor = "#0A0A0A",
  minWidth = 1.1,
  maxWidth = 3.4,
  height = 200,
  size = "md",
  theme = "dark",
  width = 440,
  disabled = false,
  className,
}: SignaturePadProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const ink = penColor ?? p.text;
  const uid = React.useId();
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const strokesRef = React.useRef<Stroke[]>([]);
  const drawing = React.useRef<{ last: { x: number; y: number; t: number }; w: number } | null>(null);
  const [strokeCount, setStrokeCount] = React.useState(0);
  const [mode, setMode] = React.useState<"draw" | "type">("draw");
  const [typed, setTyped] = React.useState("");
  const [hovered, setHovered] = React.useState(false);
  const [box, setBox] = React.useState({ w: 0, h: height });

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokesRef.current.forEach((st) => drawStroke(ctx, st, ink));
  }, [ink]);

  // Keep the canvas sharp and the right size; strokes are stored in CSS pixels and redrawn.
  React.useEffect(() => {
    const el = wrapRef.current;
    const canvas = canvasRef.current;
    if (!el || !canvas) return;
    const fit = () => {
      const w = el.clientWidth;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${height}px`;
      setBox({ w, h: height });
      redraw();
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [height, redraw]);

  const exportTyped = (name: string): SignatureResult => {
    const clean = name.trim();
    if (!clean) return { isEmpty: true, dataUrl: null, svg: null, mode: "type", typedName: "" };
    const fontSize = Math.min(64, (box.w * 1.6) / Math.max(clean.length, 6));
    const off = document.createElement("canvas");
    off.width = Math.round(box.w * 2);
    off.height = Math.round(box.h * 2);
    const ctx = off.getContext("2d");
    if (ctx) {
      ctx.scale(2, 2);
      ctx.fillStyle = exportColor;
      ctx.font = `${fontSize}px ${SCRIPT_FONT}`;
      ctx.textBaseline = "alphabetic";
      ctx.fillText(clean, 36, box.h * 0.66);
    }
    const escaped = clean.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${Math.round(box.w)} ${Math.round(box.h)}" width="${Math.round(box.w)}" height="${Math.round(box.h)}"><text x="36" y="${(box.h * 0.66).toFixed(1)}" font-family='${SCRIPT_FONT.replace(/'/g, "")}' font-size="${fontSize.toFixed(1)}" fill="${exportColor}">${escaped}</text></svg>`;
    return { isEmpty: false, dataUrl: off.toDataURL("image/png"), svg, mode: "type", typedName: clean };
  };

  const exportDrawn = (): SignatureResult => {
    const strokes = strokesRef.current;
    if (strokes.length === 0) return { isEmpty: true, dataUrl: null, svg: null, mode: "draw", typedName: "" };
    const off = document.createElement("canvas");
    off.width = Math.round(box.w * 2);
    off.height = Math.round(box.h * 2);
    const ctx = off.getContext("2d");
    if (ctx) {
      ctx.scale(2, 2);
      strokes.forEach((st) => drawStroke(ctx, st, exportColor));
    }
    return { isEmpty: false, dataUrl: off.toDataURL("image/png"), svg: strokesToSvg(strokes, box.w, box.h, exportColor), mode: "draw", typedName: "" };
  };

  const notify = () => onChange?.(exportDrawn());

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top, t: e.timeStamp };
  };

  // Faster movement draws a thinner line, like a real pen; pen pressure scales it when available.
  const widthFor = (from: { x: number; y: number; t: number }, to: { x: number; y: number; t: number }, prevW: number, pressure: number, pointerType: string) => {
    const dist = Math.hypot(to.x - from.x, to.y - from.y);
    const velocity = dist / Math.max(1, to.t - from.t);
    const target = Math.max(minWidth, maxWidth - velocity * (maxWidth - minWidth) * 0.9);
    const withPressure = pointerType === "pen" && pressure > 0 ? target * (0.5 + pressure) : target;
    return prevW * 0.65 + withPressure * 0.35;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (disabled || mode !== "draw" || (e.pointerType === "mouse" && e.button !== 0)) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = point(e);
    const w = (minWidth + maxWidth) / 2;
    drawing.current = { last: pt, w };
    strokesRef.current = [...strokesRef.current, [{ x: pt.x, y: pt.y, w }]];
    setStrokeCount(strokesRef.current.length);
    redraw();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const d = drawing.current;
    if (!d) return;
    const events = typeof e.nativeEvent.getCoalescedEvents === "function" ? e.nativeEvent.getCoalescedEvents() : [e.nativeEvent];
    const r = e.currentTarget.getBoundingClientRect();
    const stroke = strokesRef.current[strokesRef.current.length - 1];
    for (const ev of events.length ? events : [e.nativeEvent]) {
      const pt = { x: ev.clientX - r.left, y: ev.clientY - r.top, t: ev.timeStamp };
      if (Math.hypot(pt.x - d.last.x, pt.y - d.last.y) < 1.2) continue;
      d.w = widthFor(d.last, pt, d.w, ev.pressure, ev.pointerType);
      stroke.push({ x: pt.x, y: pt.y, w: d.w });
      d.last = pt;
    }
    redraw();
  };

  const endStroke = () => {
    if (!drawing.current) return;
    drawing.current = null;
    notify();
  };

  const clear = () => {
    strokesRef.current = [];
    setStrokeCount(0);
    setTyped("");
    redraw();
    onChange?.({ isEmpty: true, dataUrl: null, svg: null, mode, typedName: "" });
  };

  const undo = () => {
    strokesRef.current = strokesRef.current.slice(0, -1);
    setStrokeCount(strokesRef.current.length);
    redraw();
    notify();
  };

  const switchMode = (next: "draw" | "type") => {
    if (next === mode) return;
    setMode(next);
    onChange?.(next === "type" ? exportTyped(typed) : exportDrawn());
  };

  const hasInk = mode === "draw" ? strokeCount > 0 : typed.trim().length > 0;
  const typedSize = Math.min(56, (box.w * 1.5) / Math.max(typed.trim().length, 6));

  return (
    <div className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {(label || allowTyping) && (
        <div className="flex items-center justify-between" style={{ gap: 12 }}>
          {label ? (
            <span id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
              {label}
            </span>
          ) : (
            <span />
          )}
          {allowTyping && (
            <div role="tablist" aria-label="Signature method" className="relative flex" style={{ padding: 3, borderRadius: 10, background: p.track }}>
              {(["draw", "type"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  disabled={disabled}
                  onClick={() => switchMode(m)}
                  className="relative cursor-pointer border-none bg-transparent font-medium capitalize outline-none focus-visible:ring-2"
                  style={{ height: s.btn - 8, padding: "0 12px", borderRadius: 8, color: mode === m ? p.selText : p.muted, fontSize: s.font - 2, ["--tw-ring-color" as string]: p.focus }}
                >
                  {mode === m && <motion.span layoutId={`${uid}-mode`} className="absolute inset-0" style={{ borderRadius: 8, background: p.sel }} transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span className="relative">{m}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div
        ref={wrapRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative overflow-hidden"
        style={{ height, borderRadius: s.radius, background: p.bg, border: `1px solid ${hovered && mode === "draw" && !disabled ? p.borderHover : p.border}`, transition: "border-color 0.18s ease" }}
      >
        {/* Signing line with an ×, like paper forms. */}
        <div aria-hidden="true" className="pointer-events-none absolute flex items-end" style={{ left: 22, right: 22, bottom: height * 0.26, gap: 10 }}>
          <span style={{ color: p.faint, fontSize: s.font + 2, lineHeight: 1 }}>×</span>
          <span className="flex-1" style={{ height: 1, background: p.line }} />
        </div>

        <AnimatePresence>
          {!hasInk && (
            <motion.span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 text-center"
              style={{ top: height * 0.38, color: p.faint, fontSize: s.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              {mode === "draw" ? placeholder : "Your name appears here"}
            </motion.span>
          )}
        </AnimatePresence>

        <canvas
          ref={canvasRef}
          role="img"
          aria-label={hasInk && mode === "draw" ? "Signature drawn" : "Signature area, draw with a mouse, finger or pen"}
          aria-labelledby={label ? `${uid}-label` : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
          className="absolute inset-0"
          style={{ touchAction: "none", cursor: disabled ? "default" : "crosshair", visibility: mode === "draw" ? "visible" : "hidden" }}
        />

        {mode === "type" && (
          <div aria-hidden="true" className="pointer-events-none absolute flex items-end overflow-hidden" style={{ left: 36, right: 22, bottom: height * 0.26 + 6, height: height * 0.6 }}>
            <AnimatePresence mode="popLayout">
              <motion.span key={typed.trim() === "" ? "empty" : "name"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="whitespace-nowrap" style={{ color: ink, fontFamily: SCRIPT_FONT, fontSize: typedSize, lineHeight: 1.1 }}>
                {typed.trim()}
              </motion.span>
            </AnimatePresence>
          </div>
        )}

        <div className="absolute flex items-center" style={{ top: 8, right: 8, gap: 4 }}>
          {mode === "draw" && (
            <button
              type="button"
              aria-label="Undo last stroke"
              disabled={disabled || strokeCount === 0}
              onClick={undo}
              className="flex cursor-pointer items-center justify-center border-none bg-transparent outline-none focus-visible:ring-2 disabled:cursor-default disabled:opacity-30"
              style={{ width: s.btn - 4, height: s.btn - 4, borderRadius: 8, color: p.muted, ["--tw-ring-color" as string]: p.focus }}
              onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4.5 6.5h5.25a3.25 3.25 0 0 1 0 6.5H7M6.75 3.75 4 6.5l2.75 2.75" />
              </svg>
            </button>
          )}
          <button
            type="button"
            disabled={disabled || !hasInk}
            onClick={clear}
            className="cursor-pointer border-none bg-transparent font-medium outline-none focus-visible:ring-2 disabled:cursor-default disabled:opacity-30"
            style={{ height: s.btn - 4, padding: "0 10px", borderRadius: 8, color: p.muted, fontSize: s.font - 2, ["--tw-ring-color" as string]: p.focus }}
            onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Clear
          </button>
        </div>
      </div>

      {mode === "type" && (
        <input
          type="text"
          aria-label="Type your full name"
          autoComplete="name"
          disabled={disabled}
          value={typed}
          placeholder="Type your full name"
          onChange={(e) => {
            setTyped(e.target.value);
            onChange?.(exportTyped(e.target.value));
          }}
          className="w-full border-none outline-none placeholder:text-[color:var(--sp-placeholder)] focus-visible:ring-2"
          style={{ height: s.btn + 8, padding: "0 14px", borderRadius: s.radius, background: p.bg, border: `1px solid ${p.border}`, color: p.text, fontSize: s.font, ["--sp-placeholder" as string]: p.faint, ["--tw-ring-color" as string]: p.focus }}
        />
      )}

      {helperText && <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>{helperText}</span>}
    </div>
  );
}
