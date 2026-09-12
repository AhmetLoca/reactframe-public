"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NoiseBlob {
  x: number;
  y: number;
  rx: number;
  ry: number;
  color: string;
  opacity: number;
}

interface NoiseTheme {
  backgroundColor: string;
  blobs: NoiseBlob[];
}

const THEMES: Record<string, NoiseTheme> = {
  cognac: {
    backgroundColor: "#040302",
    blobs: [
      { x: 0.84, y: 0.25, rx: 0.5, ry: 0.7, color: "#c83c0a", opacity: 0.62 },
      { x: 0.12, y: 0.72, rx: 0.42, ry: 0.6, color: "#b03008", opacity: 0.4 },
    ],
  },
  crimson: {
    backgroundColor: "#040202",
    blobs: [
      { x: 0.82, y: 0.2, rx: 0.48, ry: 0.66, color: "#8a0000", opacity: 0.6 },
      { x: 0.16, y: 0.7, rx: 0.4, ry: 0.58, color: "#700000", opacity: 0.38 },
    ],
  },
  orchid: {
    backgroundColor: "#040208",
    blobs: [
      { x: 0.14, y: 0.22, rx: 0.48, ry: 0.66, color: "#700090", opacity: 0.58 },
      { x: 0.84, y: 0.72, rx: 0.4, ry: 0.58, color: "#580070", opacity: 0.38 },
    ],
  },
  forest: {
    backgroundColor: "#020402",
    blobs: [
      { x: 0.16, y: 0.25, rx: 0.48, ry: 0.66, color: "#005522", opacity: 0.58 },
      { x: 0.84, y: 0.74, rx: 0.4, ry: 0.58, color: "#004018", opacity: 0.38 },
    ],
  },
  midnight: {
    backgroundColor: "#020306",
    blobs: [
      { x: 0.85, y: 0.22, rx: 0.5, ry: 0.68, color: "#001278", opacity: 0.62 },
      { x: 0.12, y: 0.74, rx: 0.42, ry: 0.6, color: "#001580", opacity: 0.38 },
    ],
  },
  slate: {
    backgroundColor: "#030508",
    blobs: [
      { x: 0.84, y: 0.2, rx: 0.46, ry: 0.64, color: "#1a2e5a", opacity: 0.58 },
      { x: 0.14, y: 0.72, rx: 0.38, ry: 0.56, color: "#122650", opacity: 0.36 },
    ],
  },
  obsidian: { backgroundColor: "#070707", blobs: [] },
};

export type NoiseBackgroundTheme = keyof typeof THEMES | "custom";

export interface NoiseBackgroundProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  colorTheme?: NoiseBackgroundTheme;
  backgroundColor?: string;
  blobColor?: string;
  blobX?: number;
  blobY?: number;
  blobRadiusX?: number;
  blobRadiusY?: number;
  blobOpacity?: number;
  noiseOpacity?: number;
  noiseSpeed?: number;
  grainSize?: number;
  blendMode?: "soft-light" | "screen";
  vignetteEnabled?: boolean;
  vignetteIntensity?: number;
  animateBlobs?: boolean;
  animateSpeed?: number;
}

function hexToRgb(hex: string): [number, number, number] {
  const c = (hex || "#000000").replace("#", "");
  const full = c.length === 3 ? c.split("").map((x) => x + x).join("") : c;
  return [parseInt(full.slice(0, 2), 16) || 0, parseInt(full.slice(2, 4), 16) || 0, parseInt(full.slice(4, 6), 16) || 0];
}

export function NoiseBackground({
  colorTheme = "cognac",
  backgroundColor = "#060403",
  blobColor = "#c84010",
  blobX = 0.2,
  blobY = 0.5,
  blobRadiusX = 0.5,
  blobRadiusY = 0.8,
  blobOpacity = 0.7,
  noiseOpacity = 0.1,
  noiseSpeed = 24,
  grainSize = 150,
  blendMode = "soft-light",
  vignetteEnabled = true,
  vignetteIntensity = 0.62,
  animateBlobs = false,
  animateSpeed = 0.5,
  className,
  ...props
}: NoiseBackgroundProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const liveRef = React.useRef({
    backgroundColor,
    blobs: [] as NoiseBlob[],
    noiseOpacity,
    noiseSpeed,
    grainSize,
    blendMode,
    vignetteEnabled,
    vignetteIntensity,
    animateBlobs,
    animateSpeed,
  });
  const stateRef = React.useRef({
    time: 0,
    lastNoiseUpdate: -99999,
    lastGrainSize: -1,
    cachedPattern: null as CanvasPattern | null,
    width: 0,
    height: 0,
  });

  const theme = colorTheme !== "custom" ? THEMES[colorTheme] : null;
  const customBlobs: NoiseBlob[] = [{ x: blobX, y: blobY, rx: blobRadiusX, ry: blobRadiusY, color: blobColor, opacity: blobOpacity }];

  React.useEffect(() => {
    liveRef.current = {
      backgroundColor: theme?.backgroundColor ?? backgroundColor,
      blobs: theme?.blobs ?? customBlobs,
      noiseOpacity,
      noiseSpeed,
      grainSize,
      blendMode,
      vignetteEnabled,
      vignetteIntensity,
      animateBlobs,
      animateSpeed,
    };
  });

  React.useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const noiseCanvas = document.createElement("canvas");
    const noiseCtx = noiseCanvas.getContext("2d");
    if (!noiseCtx) return;

    const buildNoise = (size: number) => {
      noiseCanvas.width = size;
      noiseCanvas.height = size;
      const id = noiseCtx.createImageData(size, size);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i + 1] = d[i + 2] = v;
        d[i + 3] = 255;
      }
      noiseCtx.putImageData(id, 0, 0);
      stateRef.current.cachedPattern = ctx.createPattern(noiseCanvas, "repeat");
    };

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stateRef.current.width = w;
      stateRef.current.height = h;
      stateRef.current.cachedPattern = null;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let lastTs = 0;
    let rafId = 0;

    const loop = (ts: number) => {
      const dt = Math.min((ts - lastTs) / 1000, 0.05);
      lastTs = ts;

      const s = stateRef.current;
      const live = liveRef.current;
      const { width: w, height: h } = s;

      if (!w || !h) {
        rafId = requestAnimationFrame(loop);
        return;
      }

      s.time += dt;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = live.backgroundColor;
      ctx.fillRect(0, 0, w, h);

      for (let i = 0; i < live.blobs.length; i++) {
        const blob = live.blobs[i];
        const driftX = live.animateBlobs ? Math.sin(s.time * 0.08 * live.animateSpeed + i * 2.4) * 0.06 : 0;
        const driftY = live.animateBlobs ? Math.cos(s.time * 0.06 * live.animateSpeed + i * 1.7) * 0.04 : 0;
        const bx = (blob.x + driftX) * w;
        const by = (blob.y + driftY) * h;
        const rx = blob.rx * w;
        const ry = blob.ry * w;
        if (rx <= 0 || ry <= 0) continue;

        const [r, g, b] = hexToRgb(blob.color);

        ctx.save();
        ctx.translate(bx, by);
        ctx.scale(rx / ry, 1);

        const o = blob.opacity;
        const grd = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
        grd.addColorStop(0, `rgba(${r},${g},${b},${o})`);
        grd.addColorStop(0.22, `rgba(${r},${g},${b},${o * 0.72})`);
        grd.addColorStop(0.45, `rgba(${r},${g},${b},${o * 0.38})`);
        grd.addColorStop(0.68, `rgba(${r},${g},${b},${o * 0.12})`);
        grd.addColorStop(0.86, `rgba(${r},${g},${b},${o * 0.03})`);
        grd.addColorStop(1, `rgba(${r},${g},${b},0)`);

        ctx.beginPath();
        ctx.arc(0, 0, ry, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.restore();
      }

      const intervalMs = live.noiseSpeed > 0 ? 1000 / live.noiseSpeed : Infinity;
      const grainChanged = s.lastGrainSize !== live.grainSize;
      const shouldAnimate = live.noiseSpeed > 0 && ts - s.lastNoiseUpdate > intervalMs;
      if (s.cachedPattern === null || grainChanged || shouldAnimate) {
        buildNoise(live.grainSize);
        s.lastNoiseUpdate = ts;
        s.lastGrainSize = live.grainSize;
      }

      if (s.cachedPattern && live.noiseOpacity > 0) {
        ctx.save();
        ctx.globalAlpha = live.noiseOpacity;
        ctx.globalCompositeOperation = live.blendMode;
        ctx.fillStyle = s.cachedPattern;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
      }

      if (live.vignetteEnabled && live.vignetteIntensity > 0) {
        const innerR = Math.min(w, h) * 0.15;
        const outerR = Math.sqrt(w * w + h * h) * 0.65;
        const vgrd = ctx.createRadialGradient(w / 2, h / 2, innerR, w / 2, h / 2, outerR);
        vgrd.addColorStop(0, "rgba(0,0,0,0)");
        vgrd.addColorStop(1, `rgba(0,0,0,${live.vignetteIntensity})`);
        ctx.fillStyle = vgrd;
        ctx.fillRect(0, 0, w, h);
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={cn("relative w-full h-full overflow-hidden", className)} {...props}>
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          </div>
  );
}
