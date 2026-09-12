"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DotImageLoaderSaberPreset = "blue" | "red" | "green" | "white" | "purple" | "custom";

export interface DotImageLoaderProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  image?: string;
  preparingText?: string;
  dotSpacing?: number;
  dotMaxSize?: number;
  dotColor?: string;
  backgroundColor?: string;
  saberPreset?: DotImageLoaderSaberPreset;
  saberColorCustom?: string;
  textColor?: string;
  animationSpeed?: number;
}

const SABER_PRESETS: Record<Exclude<DotImageLoaderSaberPreset, "custom">, string> = {
  blue: "#4d8fff",
  red: "#ff2244",
  green: "#00ff88",
  white: "#ddeeff",
  purple: "#cc44ff",
};

function coverDims(nw: number, nh: number, cw: number, ch: number) {
  const scale = Math.max(cw / nw, ch / nh);
  const w = nw * scale;
  const h = nh * scale;
  return { w, h, x: (cw - w) / 2, y: (ch - h) / 2 };
}

type Phase = "idle" | "build" | "loop";

export function DotImageLoader({
  image,
  preparingText = "Preparing your profile",
  dotSpacing = 4,
  dotMaxSize = 3,
  dotColor = "#1a1205",
  backgroundColor = "#f0ece4",
  saberPreset = "blue",
  saberColorCustom = "#4d8fff",
  textColor = "#2a2a2a",
  animationSpeed = 1,
  className,
  style,
  ...props
}: DotImageLoaderProps) {
  const saberColor = saberPreset === "custom" ? saberColorCustom : (SABER_PRESETS[saberPreset] ?? "#4d8fff");

  const imageAreaRef = React.useRef<HTMLDivElement>(null);
  const dotCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgObjRef = React.useRef<HTMLImageElement | null>(null);
  const dotsDataRef = React.useRef<{ x: number; y: number; r: number }[]>([]);

  const [canvasSize, setCanvasSize] = React.useState({ w: 0, h: 0 });
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [sliderPos, setSliderPos] = React.useState(0.02);
  const [dotCount, setDotCount] = React.useState(0);
  const [imgDims, setImgDims] = React.useState<{ w: number; h: number; x: number; y: number } | null>(null);

  React.useEffect(() => {
    const el = imageAreaRef.current;
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

  React.useEffect(() => {
    const { w, h } = canvasSize;
    if (!image || !dotCanvasRef.current || w === 0 || h === 0) return;

    setPhase("idle");
    setSliderPos(0.02);
    setImgDims(null);
    dotsDataRef.current = [];

    const canvas = dotCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, w, h);

    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgObjRef.current = img;
      const dims = coverDims(img.naturalWidth, img.naturalHeight, w, h);
      setImgDims(dims);

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
        setPhase("loop");
        return;
      }

      const dots: { x: number; y: number; r: number }[] = [];
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
          dots.push({ x: col, y: row, r });
        }
      }
      dotsDataRef.current = dots;
      setPhase("build");
    };
    img.onerror = () => setPhase("idle");
    img.src = image;
  }, [image, canvasSize.w, canvasSize.h, dotSpacing, dotMaxSize, backgroundColor]);

  React.useEffect(() => {
    if (phase !== "build") return;
    const canvas = dotCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    const start = performance.now();
    const DURATION = 1800;

    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / DURATION);
      const p = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
      const saberX = 0.02 + p * 0.94;

      setSliderPos(saberX);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = dotColor;
      const frontX = saberX * canvas.width;

      for (const dot of dotsDataRef.current) {
        if (dot.x <= frontX) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        for (const dot of dotsDataRef.current) {
          if (dot.x > frontX) {
            ctx.beginPath();
            ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        setPhase("loop");
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, backgroundColor, dotColor]);

  React.useEffect(() => {
    if (phase !== "loop") return;
    let raf: number;
    let t = Math.PI / 2;
    const tick = () => {
      t += animationSpeed * 0.007;
      setSliderPos(0.5 + 0.46 * Math.sin(t));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, animationSpeed]);

  React.useEffect(() => {
    const id = setInterval(() => setDotCount((d) => (d + 1) % 4), 500);
    return () => clearInterval(id);
  }, []);

  const imgStyle: React.CSSProperties = imgDims
    ? { position: "absolute", left: imgDims.x, top: imgDims.y, width: imgDims.w, height: imgDims.h, pointerEvents: "none" }
    : { display: "none" };

  const pct = `${sliderPos * 100}%`;
  const ellipsis = ".".repeat(dotCount);

  return (
    <div className={cn("relative flex h-full w-full flex-col overflow-hidden rounded-xl", className)} style={{ backgroundColor, ...style }} {...props}>
      <style>{`
        @keyframes dil-core { 0%, 100% { opacity: 1; } 50% { opacity: .82; } }
        @keyframes dil-aura { 0%, 100% { opacity: .5; transform: translateX(-50%) scaleX(1); } 50% { opacity: .8; transform: translateX(-50%) scaleX(1.4); } }
        @keyframes dil-spin { to { transform: rotate(360deg); } }
      `}</style>

      <div ref={imageAreaRef} className="relative flex-1 overflow-hidden">
        <canvas ref={dotCanvasRef} className="absolute inset-0 block h-full w-full" />

        {phase !== "idle" && imgDims && (
          <div className="pointer-events-none absolute inset-0" style={{ clipPath: `inset(0 0 0 ${sliderPos * 100}%)` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} crossOrigin="anonymous" alt="" style={imgStyle} />
          </div>
        )}

        {phase !== "idle" && (
          <div className="pointer-events-none absolute top-0 z-[4] h-full w-0 -translate-x-1/2" style={{ left: pct }}>
            <div
              className="absolute top-0 left-1/2 h-full w-7 -translate-x-1/2"
              style={{ background: `radial-gradient(ellipse at center, ${saberColor}3a 0%, transparent 72%)`, animation: "dil-aura 2.2s ease-in-out infinite" }}
            />
            <div
              className="absolute left-1/2 w-[3px] -translate-x-1/2"
              style={{
                top: "1%",
                bottom: "1%",
                background: "linear-gradient(to bottom, transparent 0%, #fff 8%, #fff 92%, transparent 100%)",
                clipPath: "polygon(50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%, 0% 8%)",
                filter: `drop-shadow(0 0 3px white) drop-shadow(0 0 8px ${saberColor}) drop-shadow(0 0 18px ${saberColor}88)`,
                animation: "dil-core 2.2s ease-in-out infinite",
              }}
            />
          </div>
        )}

        {!image && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#bbb]">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21,15 16,10 5,21" />
            </svg>
            <span className="text-xs font-medium tracking-[0.04em]" style={{ fontFamily: "Inter, sans-serif" }}>
              Connect an image
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center justify-center gap-3.5 px-5 pt-6 pb-7">
        <p className="m-0 text-center text-[17px] leading-[1.4] font-medium tracking-[-0.01em]" style={{ color: textColor, fontFamily: "Inter, sans-serif" }}>
          {preparingText}
          <span className="inline-block w-[1.8ch] text-left">{ellipsis}</span>
        </p>
        <div className="h-[22px] w-[22px] rounded-full" style={{ border: `2px solid ${dotColor}22`, borderTopColor: dotColor, animation: "dil-spin 0.9s linear infinite" }} />
      </div>
    </div>
  );
}
