"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ImageCropperSize = "sm" | "md" | "lg";

export interface CropArea {
  /** In the image's natural pixels. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropResult {
  area: CropArea;
  /** The cropped image as a data URL, or null if the image can't be read (a cross-origin image without CORS). */
  dataUrl: string | null;
}

export interface AspectOption {
  label: string;
  /** width / height; null means free. */
  value: number | null;
}

export interface ImageCropperProps {
  /** Image URL. Leave empty to start with a drop zone. */
  src?: string;
  /** Called when a crop settles (after a drag, a key press or an aspect change). */
  onChange?: (result: CropResult) => void;
  /** Called with a newly chosen file, in case you want to upload the original too. */
  onFileChange?: (file: File) => void;
  aspectOptions?: AspectOption[];
  defaultAspect?: number | null;
  /** "circle" masks the crop for avatars and exports a round PNG. Forces a 1:1 aspect. */
  shape?: "rect" | "circle";
  /** Longest side of the exported image, in pixels. */
  maxOutputSize?: number;
  outputType?: "image/png" | "image/jpeg" | "image/webp";
  label?: string;
  helperText?: string;
  height?: number;
  size?: ImageCropperSize;
  theme?: "dark" | "light";
  width?: number | string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_ASPECTS: AspectOption[] = [
  { label: "Free", value: null },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", faint: "rgba(245,244,241,0.3)", bg: "rgba(255,255,255,0.03)", stage: "#050505", border: "rgba(255,255,255,0.12)", borderHover: "rgba(255,255,255,0.24)", focus: "rgba(245,244,241,0.85)", hover: "rgba(255,255,255,0.07)", sel: "#F5F4F1", selText: "#0A0A0A", track: "rgba(255,255,255,0.06)", shade: "rgba(0,0,0,0.62)" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", faint: "rgba(10,10,10,0.3)", bg: "#FFFFFF", stage: "#F2F2F0", border: "rgba(10,10,10,0.16)", borderHover: "rgba(10,10,10,0.3)", focus: "rgba(10,10,10,0.85)", hover: "rgba(10,10,10,0.05)", sel: "#0A0A0A", selText: "#FFFFFF", track: "rgba(10,10,10,0.05)", shade: "rgba(0,0,0,0.5)" },
};

const SIZES: Record<ImageCropperSize, { font: number; radius: number; btn: number }> = {
  sm: { font: 13, radius: 11, btn: 30 },
  md: { font: 14.5, radius: 13, btn: 34 },
  lg: { font: 16, radius: 15, btn: 38 },
};

// Crop box in fractions of the image (0–1), so it survives resizes of the stage.
interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}
type Handle = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Largest centred box of the aspect (in natural pixels) covering `cover` of the image. */
function initialBox(natW: number, natH: number, aspect: number | null, cover = 0.8): Box {
  if (!aspect) return { x: (1 - cover) / 2, y: (1 - cover) / 2, w: cover, h: cover };
  let wPx = natW * cover;
  let hPx = wPx / aspect;
  if (hPx > natH * cover) {
    hPx = natH * cover;
    wPx = hPx * aspect;
  }
  const w = wPx / natW;
  const h = hPx / natH;
  return { x: (1 - w) / 2, y: (1 - h) / 2, w, h };
}

const HANDLES: Exclude<Handle, "move">[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

export function ImageCropper({
  src,
  onChange,
  onFileChange,
  aspectOptions = DEFAULT_ASPECTS,
  defaultAspect = null,
  shape = "rect",
  maxOutputSize = 2048,
  outputType = "image/png",
  label,
  helperText,
  height = 340,
  size = "md",
  theme = "dark",
  width = 560,
  disabled = false,
  className,
}: ImageCropperProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const uid = React.useId();
  const stageRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const drag = React.useRef<{ handle: Handle; startX: number; startY: number; box: Box } | null>(null);
  const [uploaded, setUploaded] = React.useState<string | null>(null);
  const imageSrc = uploaded ?? src ?? null;
  const circle = shape === "circle";
  const [aspect, setAspect] = React.useState<number | null>(circle ? 1 : defaultAspect);
  const activeAspect = circle ? 1 : aspect;
  const [nat, setNat] = React.useState<{ w: number; h: number } | null>(null);
  const [stage, setStage] = React.useState({ w: 0, h: height });
  const [box, setBox] = React.useState<Box>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 });
  const [dragging, setDragging] = React.useState(false);
  const [dropHover, setDropHover] = React.useState(false);

  React.useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setStage({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Where the image sits inside the stage (object-fit: contain).
  const view = React.useMemo(() => {
    if (!nat || !stage.w) return null;
    const scale = Math.min(stage.w / nat.w, stage.h / nat.h);
    const w = nat.w * scale;
    const h = nat.h * scale;
    return { x: (stage.w - w) / 2, y: (stage.h - h) / 2, w, h };
  }, [nat, stage]);

  const areaFor = (b: Box, size = nat): CropArea | null => (size ? { x: Math.round(b.x * size.w), y: Math.round(b.y * size.h), width: Math.round(b.w * size.w), height: Math.round(b.h * size.h) } : null);

  // `size` lets the first export run in the same tick the image loads, before `nat` is in state.
  const exportCrop = (b: Box, size = nat) => {
    const img = imgRef.current;
    const area = areaFor(b, size);
    if (!img || !area || !onChange) return;
    let dataUrl: string | null = null;
    try {
      const scale = Math.min(1, maxOutputSize / Math.max(area.width, area.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(area.width * scale));
      canvas.height = Math.max(1, Math.round(area.height * scale));
      const ctx = canvas.getContext("2d");
      if (ctx) {
        if (circle) {
          ctx.beginPath();
          ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2, 0, Math.PI * 2);
          ctx.clip();
        }
        ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL(circle ? "image/png" : outputType, 0.92);
      }
    } catch {
      dataUrl = null; // tainted canvas: the image was served without CORS headers
    }
    onChange({ area, dataUrl });
  };

  const setAndExport = (b: Box) => {
    setBox(b);
    exportCrop(b);
  };

  const onImageLoad = () => {
    const img = imgRef.current;
    if (!img) return;
    const size = { w: img.naturalWidth, h: img.naturalHeight };
    setNat(size);
    const b = initialBox(size.w, size.h, activeAspect);
    setBox(b);
    exportCrop(b, size);
  };

  // An image that finished loading before hydration never fires onLoad, so catch that case here.
  React.useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) onImageLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc]);

  const loadFile = (file: File | undefined) => {
    if (!file || !file.type.startsWith("image/")) return;
    onFileChange?.(file);
    const reader = new FileReader();
    reader.onload = () => setUploaded(String(reader.result));
    reader.readAsDataURL(file);
  };

  // Keep the box's aspect (in natural pixels) when resizing with a locked ratio.
  const fracAspect = activeAspect && nat ? (activeAspect * nat.h) / nat.w : null;
  const minFrac = view ? { w: 40 / view.w, h: 40 / view.h } : { w: 0.05, h: 0.05 };

  const resize = (start: Box, handle: Handle, dx: number, dy: number): Box => {
    if (handle === "move") {
      return { ...start, x: clamp(start.x + dx, 0, 1 - start.w), y: clamp(start.y + dy, 0, 1 - start.h) };
    }
    let { x, y, w, h } = start;
    const right = x + w;
    const bottom = y + h;
    if (handle.includes("e")) w = clamp(w + dx, minFrac.w, 1 - x);
    if (handle.includes("w")) {
      const nx = clamp(x + dx, 0, right - minFrac.w);
      w = right - nx;
      x = nx;
    }
    if (handle.includes("s")) h = clamp(h + dy, minFrac.h, 1 - y);
    if (handle.includes("n")) {
      const ny = clamp(y + dy, 0, bottom - minFrac.h);
      h = bottom - ny;
      y = ny;
    }
    if (fracAspect) {
      // Follow the dragged dimension, then fit the other one; shrink both if that runs off the image.
      const horizontal = handle === "e" || handle === "w" || (handle.length === 2 && Math.abs(dx) >= Math.abs(dy));
      if (horizontal) h = w / fracAspect;
      else w = h * fracAspect;
      if (handle === "n" || handle === "s") x = start.x + (start.w - w) / 2;
      if (handle === "e" || handle === "w") y = start.y + (start.h - h) / 2;
      if (handle.includes("n")) y = bottom - h;
      if (handle.includes("w")) x = right - w;
      const fit = Math.min(1, x < 0 ? (w + x) / w : 1, y < 0 ? (h + y) / h : 1, x + w > 1 ? (1 - x) / w : 1, y + h > 1 ? (1 - y) / h : 1);
      if (fit < 1) {
        const nw = w * fit;
        const nh = h * fit;
        if (handle.includes("w")) x = right - nw;
        if (handle.includes("n")) y = bottom - nh;
        w = nw;
        h = nh;
      }
      x = clamp(x, 0, 1 - w);
      y = clamp(y, 0, 1 - h);
    }
    return { x, y, w, h };
  };

  // One handler for the box and every handle; which one was grabbed comes from data-handle.
  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (disabled || !view) return;
    const handle = (e.currentTarget.dataset.handle ?? "move") as Handle;
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    drag.current = { handle, startX: e.clientX, startY: e.clientY, box };
    setDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || !view) return;
    setBox(resize(d.box, d.handle, (e.clientX - d.startX) / view.w, (e.clientY - d.startY) / view.h));
  };

  const onPointerUp = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    exportCrop(box);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!view) return;
    const step = (e.shiftKey ? 10 : 1) / view.w;
    const stepY = (e.shiftKey ? 10 : 1) / view.h;
    const dirs: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -stepY], ArrowDown: [0, stepY] };
    const d = dirs[e.key];
    if (!d) return;
    e.preventDefault();
    // Alt resizes from the bottom-right corner; plain arrows move the box.
    setAndExport(e.altKey ? resize(box, "se", d[0], d[1]) : resize(box, "move", d[0], d[1]));
  };

  const pickAspect = (value: number | null) => {
    setAspect(value);
    if (!nat) return;
    setAndExport(initialBox(nat.w, nat.h, value));
  };

  const area = areaFor(box);
  const rect = view ? { left: view.x + box.x * view.w, top: view.y + box.y * view.h, width: box.w * view.w, height: box.h * view.h } : null;

  return (
    <div className={cn("relative inline-flex flex-col gap-2", className)} style={{ width, maxWidth: "100%", fontFamily: "Inter, sans-serif", opacity: disabled ? 0.5 : 1 }}>
      {label && (
        <span id={`${uid}-label`} className="font-semibold tracking-[-0.01em]" style={{ color: p.text, fontSize: s.font }}>
          {label}
        </span>
      )}

      <div
        ref={stageRef}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragOver={(e) => {
          e.preventDefault();
          setDropHover(true);
        }}
        onDragLeave={() => setDropHover(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDropHover(false);
          loadFile(e.dataTransfer.files[0]);
        }}
        className="relative overflow-hidden select-none"
        style={{ height, borderRadius: s.radius, background: p.stage, border: `1px solid ${dropHover ? p.focus : p.border}`, transition: "border-color 0.18s ease" }}
      >
        {imageSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt=""
              crossOrigin={imageSrc.startsWith("data:") ? undefined : "anonymous"}
              draggable={false}
              onLoad={onImageLoad}
              className="pointer-events-none absolute"
              style={view ? { left: view.x, top: view.y, width: view.w, height: view.h } : { opacity: 0 }}
            />
            {rect && (
              <>
                {/* Shade outside the crop: one huge box-shadow around the crop hole. */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute"
                  style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, borderRadius: circle ? "50%" : 0, boxShadow: `0 0 0 9999px ${p.shade}`, transition: dragging ? "none" : "left 0.18s ease, top 0.18s ease, width 0.18s ease, height 0.18s ease" }}
                />
                <div
                  role="group"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={`Crop area${area ? `, ${area.width} by ${area.height} pixels` : ""}. Arrow keys move it, Shift for bigger steps, Alt with arrows resizes.`}
                  aria-labelledby={label ? `${uid}-label` : undefined}
                  data-handle="move"
                  onPointerDown={onPointerDown}
                  onKeyDown={onKeyDown}
                  className="absolute outline-none focus-visible:ring-2"
                  style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height, cursor: disabled ? "default" : dragging ? "grabbing" : "grab", border: "1px solid rgba(255,255,255,0.9)", borderRadius: circle ? "50%" : 0, ["--tw-ring-color" as string]: "rgba(255,255,255,0.9)", transition: dragging ? "none" : "left 0.18s ease, top 0.18s ease, width 0.18s ease, height 0.18s ease" }}
                >
                  <AnimatePresence>
                    {dragging && (
                      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                        {[1, 2].map((i) => (
                          <React.Fragment key={i}>
                            <span className="absolute top-0 bottom-0" style={{ left: `${(i * 100) / 3}%`, width: 1, background: "rgba(255,255,255,0.45)" }} />
                            <span className="absolute right-0 left-0" style={{ top: `${(i * 100) / 3}%`, height: 1, background: "rgba(255,255,255,0.45)" }} />
                          </React.Fragment>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {!disabled &&
                    HANDLES.filter((h) => !circle || h.length === 2).map((h) => {
                      const corner = h.length === 2;
                      const pos: React.CSSProperties = {
                        top: h.includes("n") ? -6 : h.includes("s") ? undefined : "50%",
                        bottom: h.includes("s") ? -6 : undefined,
                        left: h.includes("w") ? -6 : h.includes("e") ? undefined : "50%",
                        right: h.includes("e") ? -6 : undefined,
                        marginTop: h === "e" || h === "w" ? -10 : undefined,
                        marginLeft: h === "n" || h === "s" ? -10 : undefined,
                      };
                      const cursor = { n: "ns", s: "ns", e: "ew", w: "ew", ne: "nesw", sw: "nesw", nw: "nwse", se: "nwse" }[h];
                      return (
                        <span
                          key={h}
                          aria-hidden="true"
                          data-handle={h}
                          onPointerDown={onPointerDown}
                          className="absolute"
                          style={{ ...pos, width: corner ? 12 : h === "n" || h === "s" ? 20 : 6, height: corner ? 12 : h === "e" || h === "w" ? 20 : 6, borderRadius: corner ? 3 : 3, background: "#FFFFFF", boxShadow: "0 1px 3px rgba(0,0,0,0.4)", cursor: `${cursor}-resize`, touchAction: "none" }}
                        />
                      );
                    })}
                </div>
              </>
            )}
          </>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center border-none bg-transparent outline-none focus-visible:ring-2"
            style={{ gap: 10, color: p.muted, fontSize: s.font, ["--tw-ring-color" as string]: p.focus }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="3" />
              <circle cx="9" cy="10" r="1.8" />
              <path d="m21 16-5-5-8 9" />
            </svg>
            <span>
              <span style={{ color: p.text, fontWeight: 600 }}>Choose an image</span> or drop it here
            </span>
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => loadFile(e.target.files?.[0])} />

      <div className="flex flex-wrap items-center justify-between" style={{ gap: 10 }}>
        {!circle && aspectOptions.length > 1 ? (
          <div role="radiogroup" aria-label="Aspect ratio" className="relative flex" style={{ padding: 3, borderRadius: 10, background: p.track }}>
            {aspectOptions.map((o) => {
              const on = o.value === aspect;
              return (
                <button
                  key={o.label}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  disabled={disabled || !imageSrc}
                  onClick={() => pickAspect(o.value)}
                  className="relative cursor-pointer border-none bg-transparent font-medium outline-none focus-visible:ring-2 disabled:cursor-default"
                  style={{ height: s.btn - 8, padding: "0 11px", borderRadius: 8, color: on ? p.selText : p.muted, fontSize: s.font - 2, fontVariantNumeric: "tabular-nums", ["--tw-ring-color" as string]: p.focus }}
                >
                  {on && <motion.span layoutId={`${uid}-aspect`} className="absolute inset-0" style={{ borderRadius: 8, background: p.sel }} transition={{ type: "spring", stiffness: 500, damping: 36 }} />}
                  <span className="relative">{o.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <span />
        )}
        <div className="flex items-center" style={{ gap: 4 }}>
          {area && (
            <span style={{ color: p.faint, fontSize: s.font - 2.5, fontVariantNumeric: "tabular-nums", marginRight: 6 }} aria-live="polite">
              {area.width} × {area.height} px
            </span>
          )}
          {imageSrc && (
            <button
              type="button"
              disabled={disabled || !nat}
              onClick={() => nat && setAndExport(initialBox(nat.w, nat.h, activeAspect))}
              className="cursor-pointer border-none bg-transparent font-medium outline-none focus-visible:ring-2"
              style={{ height: s.btn - 4, padding: "0 10px", borderRadius: 8, color: p.muted, fontSize: s.font - 2, ["--tw-ring-color" as string]: p.focus }}
              onMouseEnter={(e) => (e.currentTarget.style.background = p.hover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Reset
            </button>
          )}
          <button
            type="button"
            disabled={disabled}
            onClick={() => fileRef.current?.click()}
            className="cursor-pointer border-none font-medium outline-none focus-visible:ring-2"
            style={{ height: s.btn - 4, padding: "0 12px", borderRadius: 8, background: p.track, color: p.text, fontSize: s.font - 2, ["--tw-ring-color" as string]: p.focus }}
          >
            {imageSrc ? "Replace" : "Choose image"}
          </button>
        </div>
      </div>

      {helperText && <span style={{ color: p.muted, fontSize: s.font - 1.5, lineHeight: 1.4 }}>{helperText}</span>}
    </div>
  );
}
