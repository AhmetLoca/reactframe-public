"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type HoverScanTheme = "dark" | "warm" | "navy" | "rose" | "custom";
export type HoverScanSweepDirection = "left-to-right" | "right-to-left" | "top-to-bottom" | "bottom-to-top";
export type HoverScanBadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";
export type HoverScanSaberColor = "blue" | "red" | "green" | "white" | "purple";

export interface HoverScanCardProps {
  image: string;
  title?: string;
  price?: string;
  description?: string;
  buttonText?: string;
  href?: string;
  badgeText?: string;
  badgePosition?: HoverScanBadgePosition;
  theme?: HoverScanTheme;
  customOverlayColor?: string;
  overlayOpacity?: number;
  blurAmount?: number;
  borderRadius?: number;
  sweepDirection?: HoverScanSweepDirection;
  sweepSpeed?: number;
  dotSpacing?: number;
  dotMaxSize?: number;
  dotColor?: string;
  dotBgColor?: string;
  saberColor?: HoverScanSaberColor;
  className?: string;
}

const THEMES: Record<HoverScanTheme, { gradient: string; badgeBg: string; badgeColor: string; btnBg: string; btnColor: string }> = {
  dark: { gradient: "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.58) 100%)", badgeBg: "rgba(255,255,255,0.18)", badgeColor: "#ffffff", btnBg: "#ffffff", btnColor: "#111111" },
  warm: { gradient: "linear-gradient(to bottom, rgba(101,67,33,0.08) 0%, rgba(101,67,33,0.62) 100%)", badgeBg: "rgba(255,220,170,0.28)", badgeColor: "#fff5e6", btnBg: "#f5deb3", btnColor: "#5c3a1e" },
  navy: { gradient: "linear-gradient(to bottom, rgba(15,30,60,0.08) 0%, rgba(15,30,60,0.65) 100%)", badgeBg: "rgba(100,150,255,0.22)", badgeColor: "#e0eaff", btnBg: "#dce8ff", btnColor: "#0f1e3c" },
  rose: { gradient: "linear-gradient(to bottom, rgba(160,50,80,0.08) 0%, rgba(160,50,80,0.58) 100%)", badgeBg: "rgba(255,180,200,0.22)", badgeColor: "#fff0f4", btnBg: "#ffd6e0", btnColor: "#7a1530" },
  custom: { gradient: "", badgeBg: "rgba(255,255,255,0.18)", badgeColor: "#ffffff", btnBg: "#ffffff", btnColor: "#111111" },
};

function hexToRgb(hex: string): [number, number, number] {
  const h = (hex || "#000000").replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function buildGradient(theme: HoverScanTheme, customColor: string, opacity: number): string {
  if (theme === "custom") {
    const [r, g, b] = hexToRgb(customColor);
    const lo = opacity / 100;
    return `linear-gradient(to bottom, rgba(${r},${g},${b},${lo * 0.25}) 0%, rgba(${r},${g},${b},${lo}) 100%)`;
  }
  return THEMES[theme].gradient.replace(/rgba\((\d+),(\d+),(\d+),([\d.]+)\) 100%/, (_, r, g, b) => `rgba(${r},${g},${b},${opacity / 100}) 100%`);
}

const SABER_COLORS: Record<HoverScanSaberColor, string> = { blue: "#4d8fff", red: "#ff2244", green: "#00ff88", white: "#ddeeff", purple: "#cc44ff" };
const BADGE_POS: Record<HoverScanBadgePosition, React.CSSProperties> = {
  "top-left": { top: 20, left: 20 },
  "top-right": { top: 20, right: 20 },
  "bottom-left": { bottom: 20, left: 20 },
  "bottom-right": { bottom: 20, right: 20 },
};

function coverDims(nw: number, nh: number, cw: number, ch: number) {
  const scale = Math.max(cw / nw, ch / nh);
  const w = nw * scale;
  const h = nh * scale;
  return { w, h, x: (cw - w) / 2, y: (ch - h) / 2 };
}

function isHorizontalDir(dir: HoverScanSweepDirection) {
  return dir === "top-to-bottom" || dir === "bottom-to-top";
}

function getClipPath(dir: HoverScanSweepDirection, pos: number): string {
  const pct = `${(1 - pos) * 100}%`;
  switch (dir) {
    case "left-to-right":
      return `inset(0 ${pct} 0 0)`;
    case "right-to-left":
      return `inset(0 0 0 ${pct})`;
    case "top-to-bottom":
      return `inset(0 0 ${pct} 0)`;
    case "bottom-to-top":
      return `inset(${pct} 0 0 0)`;
  }
}

function getSaberContainerStyle(dir: HoverScanSweepDirection, pos: number): React.CSSProperties {
  switch (dir) {
    case "left-to-right":
      return { position: "absolute", top: 0, left: `${pos * 100}%`, height: "100%", width: 0, transform: "translateX(-50%)" };
    case "right-to-left":
      return { position: "absolute", top: 0, left: `${(1 - pos) * 100}%`, height: "100%", width: 0, transform: "translateX(-50%)" };
    case "top-to-bottom":
      return { position: "absolute", left: 0, top: `${pos * 100}%`, width: "100%", height: 0, transform: "translateY(-50%)" };
    case "bottom-to-top":
      return { position: "absolute", left: 0, top: `${(1 - pos) * 100}%`, width: "100%", height: 0, transform: "translateY(-50%)" };
  }
}

type Phase = "idle" | "sweeping" | "revealed" | "hiding";

function stagger(i: number) {
  return {
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 8 },
    transition: { duration: 0.34, delay: 0.02 + i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] as const },
  };
}

export function HoverScanCard({
  image,
  title = "Eternal Glow",
  price = "$48.00",
  description = "Unveil your natural radiance with our vitamin-rich serums designed to hydrate and illuminate.",
  buttonText = "Shop the Glow",
  href,
  badgeText = "New",
  badgePosition = "top-right",
  theme = "dark",
  customOverlayColor = "#000000",
  overlayOpacity = 55,
  blurAmount = 12,
  borderRadius = 24,
  sweepDirection = "left-to-right",
  sweepSpeed = 1,
  dotSpacing = 5,
  dotMaxSize = 3,
  dotColor = "#1a1205",
  dotBgColor = "#f0ece4",
  saberColor = "white",
  className,
}: HoverScanCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const dotCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgObjRef = React.useRef<HTMLImageElement | null>(null);
  const phaseRef = React.useRef<Phase>("idle");
  const saberPosRef = React.useRef(0);
  const rafRef = React.useRef(0);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const lastPointerTypeRef = React.useRef("mouse");

  const [canvasSize, setCanvasSize] = React.useState({ w: 0, h: 0 });
  const [phase, setPhaseState] = React.useState<Phase>("idle");
  const [saberPos, setSaberPosState] = React.useState(0);
  const [, forceRerender] = React.useState(0);

  const setPhase = (p: Phase) => {
    phaseRef.current = p;
    setPhaseState(p);
  };
  const setSaberPos = (v: number) => {
    saberPosRef.current = v;
    setSaberPosState(v);
  };

  const resolvedSaberColor = SABER_COLORS[saberColor];
  const isH = isHorizontalDir(sweepDirection);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.round(rect.width);
      const h = Math.round(rect.height);
      if (w > 0 && h > 0) setCanvasSize({ w, h });
    };
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  React.useEffect(() => {
    const { w, h } = canvasSize;
    if (!image || !dotCanvasRef.current || w === 0 || h === 0) return;
    let cancelled = false;
    const canvas = dotCanvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = w;
    canvas.height = h;
    ctx.fillStyle = dotBgColor;
    ctx.fillRect(0, 0, w, h);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (cancelled) return;
      imgObjRef.current = img;
      forceRerender((n) => n + 1);
      const dims = coverDims(img.naturalWidth, img.naturalHeight, w, h);
      const tmp = document.createElement("canvas");
      tmp.width = w;
      tmp.height = h;
      const tmpCtx = tmp.getContext("2d");
      if (!tmpCtx) return;
      tmpCtx.fillStyle = dotBgColor;
      tmpCtx.fillRect(0, 0, w, h);
      tmpCtx.drawImage(img, dims.x, dims.y, dims.w, dims.h);
      let pd: Uint8ClampedArray;
      try {
        pd = tmpCtx.getImageData(0, 0, w, h).data;
      } catch {
        ctx.drawImage(img, dims.x, dims.y, dims.w, dims.h);
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
    };
    img.src = image;
    return () => {
      cancelled = true;
    };
  }, [image, canvasSize.w, canvasSize.h, dotSpacing, dotMaxSize, dotColor, dotBgColor]);

  React.useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(hideTimerRef.current);
    };
  }, []);

  const doReveal = () => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(hideTimerRef.current);
    const from = saberPosRef.current;
    const remaining = 1 - from;
    if (remaining <= 0) {
      setPhase("revealed");
      return;
    }
    setPhase("sweeping");
    const start = performance.now();
    const duration = Math.max(60, remaining * (550 / sweepSpeed));
    const tick = (now: number) => {
      const raw = Math.min(1, (now - start) / duration);
      const eased = raw < 0.5 ? 2 * raw * raw : -1 + (4 - 2 * raw) * raw;
      setSaberPos(from + remaining * eased);
      if (raw < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setSaberPos(1);
        setPhase("revealed");
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const doHide = () => {
    cancelAnimationFrame(rafRef.current);
    clearTimeout(hideTimerRef.current);
    setPhase("hiding");
    hideTimerRef.current = setTimeout(() => {
      setPhase("idle");
      setSaberPos(0);
    }, 450);
  };

  const handlePointerEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (phaseRef.current === "idle" || phaseRef.current === "hiding") doReveal();
  };
  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (phaseRef.current === "sweeping" || phaseRef.current === "revealed") doHide();
  };
  const handlePointerDown = (e: React.PointerEvent) => {
    lastPointerTypeRef.current = e.pointerType;
  };
  const handleClick = () => {
    if (lastPointerTypeRef.current !== "mouse") {
      if (phaseRef.current === "idle" || phaseRef.current === "hiding") doReveal();
      else doHide();
      return;
    }
    if (href && phaseRef.current === "revealed") {
      window.open(href, href.startsWith("http") ? "_blank" : "_self", "noopener");
    }
  };

  const t = THEMES[theme];
  const gradient = buildGradient(theme, customOverlayColor, overlayOpacity);
  const showOriginal = phase !== "idle";
  const isHiding = phase === "hiding";
  const showContent = phase === "revealed";
  const rScale = Math.min(1, Math.max(0.6, (canvasSize.w || 420) / 420));
  const r = (base: number, min: number) => Math.max(min, Math.round(base * rScale));

  const getImgStyle = (): React.CSSProperties => {
    const img = imgObjRef.current;
    if (!img) return { display: "none" };
    const { w, h, x, y } = coverDims(img.naturalWidth, img.naturalHeight, canvasSize.w, canvasSize.h);
    return { position: "absolute", left: x, top: y, width: w, height: h, pointerEvents: "none" };
  };

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn("relative select-none overflow-hidden", href && "cursor-pointer", className)}
      style={{ borderRadius, backgroundColor: dotBgColor, touchAction: "manipulation" }}
    >
      <style>{`
        @keyframes hsc-core{0%,100%{opacity:1}50%{opacity:.82}}
        @keyframes hsc-aura-v{0%,100%{opacity:.5;transform:translateX(-50%) scaleX(1)}50%{opacity:.8;transform:translateX(-50%) scaleX(1.4)}}
        @keyframes hsc-aura-h{0%,100%{opacity:.5;transform:translateY(-50%) scaleY(1)}50%{opacity:.8;transform:translateY(-50%) scaleY(1.4)}}
      `}</style>

      <canvas ref={dotCanvasRef} className="absolute -left-px -top-px block" style={{ width: "calc(100% + 2px)", height: "calc(100% + 2px)" }} />

      {showOriginal && imgObjRef.current && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ clipPath: getClipPath(sweepDirection, saberPos), opacity: isHiding ? 0 : 1, transition: isHiding ? "opacity 0.4s ease" : undefined }}
        >
          <img src={image} crossOrigin="anonymous" alt={title} style={getImgStyle()} />
        </div>
      )}

      <AnimatePresence>
        {phase === "sweeping" && (
          <motion.div
            key="saber"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeOut" } }}
            className="pointer-events-none z-[4]"
            style={getSaberContainerStyle(sweepDirection, saberPos)}
          >
            <div
              style={
                isH
                  ? { position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", height: 28, width: "100%", background: `radial-gradient(ellipse at center, ${resolvedSaberColor}3a 0%, transparent 72%)`, animation: "hsc-aura-h 2.2s ease-in-out infinite" }
                  : { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 28, height: "100%", background: `radial-gradient(ellipse at center, ${resolvedSaberColor}3a 0%, transparent 72%)`, animation: "hsc-aura-v 2.2s ease-in-out infinite" }
              }
            />
            <div
              style={
                isH
                  ? {
                      position: "absolute", left: "1%", right: "1%", top: "50%", transform: "translateY(-50%)", height: 3,
                      background: "linear-gradient(to right, transparent 0%, #fff 8%, #fff 92%, transparent 100%)",
                      clipPath: "polygon(0% 50%, 8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%)",
                      filter: `drop-shadow(0 0 3px white) drop-shadow(0 0 8px ${resolvedSaberColor}) drop-shadow(0 0 18px ${resolvedSaberColor}88)`,
                      animation: "hsc-core 2.2s ease-in-out infinite",
                    }
                  : {
                      position: "absolute", top: "1%", bottom: "1%", left: "50%", transform: "translateX(-50%)", width: 3,
                      background: "linear-gradient(to bottom, transparent 0%, #fff 8%, #fff 92%, transparent 100%)",
                      clipPath: "polygon(50% 0%, 100% 8%, 100% 92%, 50% 100%, 0% 92%, 0% 8%)",
                      filter: `drop-shadow(0 0 3px white) drop-shadow(0 0 8px ${resolvedSaberColor}) drop-shadow(0 0 18px ${resolvedSaberColor}88)`,
                      animation: "hsc-core 2.2s ease-in-out infinite",
                    }
              }
            />
          </motion.div>
        )}
      </AnimatePresence>

      {badgeText && (
        <div
          className="absolute z-10 rounded-full border px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.07em] backdrop-blur-sm"
          style={{ ...BADGE_POS[badgePosition], background: t.badgeBg, color: t.badgeColor, borderColor: "rgba(255,255,255,0.22)", fontFamily: "Inter, sans-serif" }}
        >
          {badgeText}
        </div>
      )}

      <AnimatePresence>
        {showContent && (
          <motion.div key="overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: "easeOut" }} className="absolute inset-0" style={{ backdropFilter: `blur(${blurAmount}px)`, background: gradient }} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showContent && (
          <motion.div key="content" className="absolute inset-0 z-[5] flex flex-col justify-end" style={{ padding: `${r(36, 20)}px ${r(32, 16)}px`, gap: r(10, 6) }}>
            <motion.h2
              {...stagger(0)}
              className="m-0 font-bold leading-[1.1] text-white"
              style={{ fontSize: r(36, 16), letterSpacing: "-0.4px", fontFamily: "Inter, sans-serif" }}
            >
              {title}
            </motion.h2>
            {price && (
              <motion.span
                {...stagger(1)}
                className="m-0 font-semibold text-white/95"
                style={{ fontSize: r(18, 13), fontFamily: "Inter, sans-serif" }}
              >
                {price}
              </motion.span>
            )}
            {description && (
              <motion.p
                {...stagger(price ? 2 : 1)}
                className="m-0 leading-[1.55] text-white/82"
                style={{ fontSize: r(15, 11), fontFamily: "Inter, sans-serif" }}
              >
                {description}
              </motion.p>
            )}
            <motion.button
              {...stagger(3)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={(e) => {
                e.stopPropagation();
                if (href) window.open(href, href.startsWith("http") ? "_blank" : "_self", "noopener");
              }}
              className="flex items-center self-start rounded-full font-bold"
              style={{
                marginTop: r(8, 4),
                padding: `${r(13, 9)}px ${r(26, 16)}px`,
                background: t.btnBg,
                color: t.btnColor,
                fontSize: r(14, 11),
                gap: r(8, 5),
                cursor: "pointer",
                letterSpacing: "0.01em",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {buttonText}
              <motion.span animate={{ x: 3 }} transition={{ duration: 0.28 }} style={{ fontSize: r(17, 13) }}>
                →
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
