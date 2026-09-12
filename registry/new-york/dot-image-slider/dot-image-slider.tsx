"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface DotImageSliderProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  image?: string;
  dotSpacing?: number;
  dotMaxSize?: number;
  dotColor?: string;
  backgroundColor?: string;
  saberColor?: string;
}

function coverDims(nw: number, nh: number, cw: number, ch: number) {
  const scale = Math.max(cw / nw, ch / nh);
  const w = nw * scale;
  const h = nh * scale;
  return { w, h, x: (cw - w) / 2, y: (ch - h) / 2 };
}

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1000&q=80";

export function DotImageSlider({
  image = DEFAULT_IMAGE,
  dotSpacing = 4,
  dotMaxSize = 3,
  dotColor = "#1a1205",
  backgroundColor = "#f0ece4",
  saberColor = "#88aaff",
  className,
  style,
  ...props
}: DotImageSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dotCanvasRef = React.useRef<HTMLCanvasElement>(null);

  const [canvasSize, setCanvasSize] = React.useState({ w: 0, h: 0 });
  const [sliderPos, setSliderPos] = React.useState(0.5);
  const [isDragging, setIsDragging] = React.useState(false);
  const [imageReady, setImageReady] = React.useState(false);
  const [imgNatural, setImgNatural] = React.useState<{ w: number; h: number } | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (w > 0 && h > 0) setCanvasSize({ w, h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { w: canvasW, h: canvasH } = canvasSize;
  React.useEffect(() => {
    const w = canvasW;
    const h = canvasH;
    if (!image || !dotCanvasRef.current || w === 0 || h === 0) return;
    setImageReady(false);

    const canvas = dotCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
      const dims = coverDims(img.naturalWidth, img.naturalHeight, w, h);

      const tmp = document.createElement("canvas");
      tmp.width = w;
      tmp.height = h;
      const tmpCtx = tmp.getContext("2d");
      if (!tmpCtx) return;

      tmpCtx.fillStyle = backgroundColor;
      tmpCtx.fillRect(0, 0, w, h);
      tmpCtx.drawImage(img, dims.x, dims.y, dims.w, dims.h);

      let pd: Uint8ClampedArray;
      try {
        pd = tmpCtx.getImageData(0, 0, w, h).data;
      } catch {
        ctx.drawImage(img, dims.x, dims.y, dims.w, dims.h);
        setImageReady(true);
        return;
      }

      ctx.fillStyle = dotColor;
      const half = dotSpacing / 2;
      for (let row = half; row < h; row += dotSpacing) {
        for (let col = half; col < w; col += dotSpacing) {
          const px = Math.round(col);
          const py = Math.round(row);
          if (px >= w || py >= h) continue;
          const i = (py * w + px) * 4;
          const lum = (0.299 * pd[i] + 0.587 * pd[i + 1] + 0.114 * pd[i + 2]) / 255;
          const a = pd[i + 3] / 255;
          if (a < 0.05) continue;
          const r = dotMaxSize * Math.pow(1 - lum, 0.78) * a;
          if (r < 0.22) continue;
          ctx.beginPath();
          ctx.arc(col, row, r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      setImageReady(true);
    };
    img.onerror = () => setImageReady(false);
    img.src = image;
  }, [image, canvasW, canvasH, dotSpacing, dotMaxSize, dotColor, backgroundColor]);

  const updatePos = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSliderPos(Math.max(0.02, Math.min(0.98, (clientX - rect.left) / rect.width)));
  }, []);

  const onPointerDown = React.useCallback(
    (e: React.PointerEvent) => {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      setIsDragging(true);
      updatePos(e.clientX);
    },
    [updatePos],
  );

  const onPointerMove = React.useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      updatePos(e.clientX);
    },
    [isDragging, updatePos],
  );

  const onPointerUp = React.useCallback(() => setIsDragging(false), []);

  const getImgStyle = (): React.CSSProperties => {
    if (!imgNatural) return { display: "none" };
    const { w, h, x, y } = coverDims(imgNatural.w, imgNatural.h, canvasSize.w, canvasSize.h);
    return { position: "absolute", left: x, top: y, width: w, height: h, pointerEvents: "none" };
  };

  const pct = `${sliderPos * 100}%`;

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      className={cn("relative w-full h-full overflow-hidden rounded-xl select-none touch-none", isDragging ? "cursor-grabbing" : "cursor-ew-resize", className)}
      style={{ backgroundColor, ...style }}
      {...props}
    >
      <style>{`
        @keyframes dis-core { 0%,100% { opacity: 1; } 50% { opacity: .82; } }
        @keyframes dis-aura { 0%,100% { opacity: .5; transform: translateX(-50%) scaleX(1); } 50% { opacity: .8; transform: translateX(-50%) scaleX(1.4); } }
        @keyframes dis-knob { 0%,100% { box-shadow: 0 0 10px 3px ${saberColor}88, 0 2px 12px rgba(0,0,0,.18); } 50% { box-shadow: 0 0 18px 6px ${saberColor}bb, 0 2px 16px rgba(0,0,0,.22); } }
      `}</style>

      <canvas ref={dotCanvasRef} className="absolute inset-0 block h-full w-full" />

      {imageReady && (
        <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 ${(1 - sliderPos) * 100}% 0 0)` }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} crossOrigin="anonymous" alt="" style={getImgStyle()} />
        </div>
      )}

      {imageReady && (
        <div className="pointer-events-none absolute top-0 z-[4] h-full w-0 -translate-x-1/2" style={{ left: pct }}>
          <div
            className="absolute top-0 left-1/2 h-full w-7 -translate-x-1/2"
            style={{ background: `radial-gradient(ellipse at center, ${saberColor}3a 0%, transparent 72%)`, animation: "dis-aura 2.2s ease-in-out infinite" }}
          />
          <div
            className="absolute top-[3%] bottom-[3%] left-1/2 w-0.5 -translate-x-1/2 rounded-[2px]"
            style={{
              background: "linear-gradient(to bottom, transparent 0%, #fff 7%, #fff 93%, transparent 100%)",
              boxShadow: `0 0 5px 2px #fff, 0 0 14px 5px ${saberColor}, 0 0 32px 10px ${saberColor}66`,
              animation: "dis-core 2.2s ease-in-out infinite",
            }}
          />
        </div>
      )}

      {imageReady && (
        <div
          className="pointer-events-none absolute top-1/2 z-[5] flex h-[42px] w-[42px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/93 backdrop-blur-[12px]"
          style={{ left: pct, animation: "dis-knob 2.2s ease-in-out infinite" }}
        >
          <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
            <path d="M1 7H21M1 7L5 3M1 7L5 11M21 7L17 3M21 7L17 11" stroke="#3a3a3a" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}

      {!image && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#bbb]">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <span className="text-xs font-medium tracking-[0.04em]" style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}>
            Connect an image
          </span>
        </div>
      )}
    </div>
  );
}
