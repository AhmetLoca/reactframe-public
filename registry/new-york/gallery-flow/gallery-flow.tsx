"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type GalleryFlowCardSize = "small" | "medium" | "large";
export type GalleryFlowDirection = "up" | "down" | "left" | "right";
export type GalleryFlowCursorMode = "none" | "repel" | "attract";

export interface GalleryFlowProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  images?: string[];
  backgroundColor?: string;
  speed?: number;
  cardShadow?: boolean;
  borderRadius?: number;
  rotationAmount?: number;
  cardSize?: GalleryFlowCardSize;
  overlapAmount?: number;
  scrollDirection?: GalleryFlowDirection;
  pauseOnHover?: boolean;
  pauseAllOnHover?: boolean;
  cursorMode?: GalleryFlowCursorMode;
  cursorStrength?: number;
}

interface FlowItem {
  x: number;
  y: number;
  w: number;
  h: number;
  rot: number;
  dirX: number;
  dirY: number;
  speedMult: number;
  zIndex: number;
}

const SIZE_MAP: Record<GalleryFlowCardSize, number> = { small: 0.75, medium: 1, large: 1.35 };

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
  "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80",
  "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
  "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&q=80",
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80",
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80",
  "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80",
];

function useContainerSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = React.useState({ w: 900, h: 600 });
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return size;
}

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

export function GalleryFlow({
  images = DEFAULT_IMAGES,
  backgroundColor = "#ffffff",
  speed = 0.4,
  cardShadow = true,
  borderRadius = 12,
  rotationAmount = 6,
  cardSize = "medium",
  overlapAmount = 0.4,
  scrollDirection = "up",
  pauseOnHover = true,
  pauseAllOnHover = false,
  cursorMode = "none",
  cursorStrength = 80,
  className,
  ...props
}: GalleryFlowProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { w: cw, h: ch } = useContainerSize(containerRef);
  const isMobile = cw <= 480;
  const isTablet = cw <= 768 && cw > 480;
  const responsiveSizeMult = isMobile ? 1.4 : isTablet ? 1.15 : 1;

  const srcs = images.filter((s): s is string => Boolean(s));
  const count = srcs.length;

  const [lightbox, setLightbox] = React.useState<string | null>(null);
  const [lightboxIn, setLightboxIn] = React.useState(false);
  const [hoveredIdx, setHoveredIdx] = React.useState<number | null>(null);
  const [galleryPaused, setGalleryPaused] = React.useState(false);
  const hoveredIdxRef = React.useRef<number | null>(null);
  const galleryPausedRef = React.useRef(false);
  const cursorRef = React.useRef<{ x: number; y: number } | null>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
    if (!lightbox) return;
    const id = requestAnimationFrame(() => setLightboxIn(true));
    return () => cancelAnimationFrame(id);
  }, [lightbox]);

  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeLightbox = () => {
    setLightboxIn(false);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = setTimeout(() => setLightbox(null), 400);
  };
  React.useEffect(
    () => () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    },
    [],
  );

  const sizeMult = SIZE_MAP[cardSize] * responsiveSizeMult;

  const items = React.useMemo<FlowItem[]>(() => {
    return Array.from({ length: count }, (_, i) => {
      const r = (s: number) => seededRandom(i * 17 + s);
      const maxCols = isMobile ? 2 : isTablet ? 3 : 4;
      const cols = Math.min(count <= 4 ? 2 : count <= 6 ? 3 : count <= 9 ? 3 : 4, maxCols);
      const rows = Math.ceil(count / cols);
      const col = i % cols;
      const row = Math.floor(i / cols);

      const sizeVariant = r(3);
      const baseW = sizeVariant < 0.33 ? 0.13 : sizeVariant < 0.66 ? 0.17 : 0.2;
      const w = baseW * sizeMult;
      const h = w * (r(4) * 0.5 + 0.9);

      const cellW = 1 / cols;
      const cellH = 1 / rows;
      const jitterX = (r(1) - 0.5) * cellW * overlapAmount * 0.8;
      const jitterY = (r(2) - 0.5) * cellH * overlapAmount * 0.8;
      const x = (col + 0.5) * cellW + jitterX - w / 2;
      const y = (row + 0.5) * cellH + jitterY - h / 2;

      const rot = (r(5) - 0.5) * rotationAmount * 2 * (isMobile ? 0.5 : 1);
      const isHorizontal = scrollDirection === "left" || scrollDirection === "right";
      const dirX = isHorizontal ? (scrollDirection === "left" ? -1 : 1) : (r(6) - 0.5) * 0.3;
      const dirY = isHorizontal ? (r(7) - 0.5) * 0.3 : scrollDirection === "down" ? 1 : -1;
      const speedMult = r(8) * 0.6 + 0.7;
      const zIndex = Math.floor(r(9) * 10) + 1;
      return { x, y, w, h, rot, dirX, dirY, speedMult, zIndex };
    });
  }, [count, isMobile, isTablet, sizeMult, overlapAmount, rotationAmount, scrollDirection]);

  const offsetsRef = React.useRef<{ x: number; y: number }[]>(items.map((item) => ({ x: item.x * 900, y: item.y * 600 })));
  const rafRef = React.useRef<number | undefined>(undefined);

  React.useEffect(() => {
    offsetsRef.current = items.map((item, i) => ({ x: item.x * cw, y: item.y * ch + (i / count) * ch * 0.2 }));
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const off = offsetsRef.current[i];
      card.style.left = off.x + "px";
      card.style.top = off.y + "px";
    });
  }, [cw, ch, count, items]);

  React.useEffect(() => {
    const animate = () => {
      if (!galleryPausedRef.current) {
        offsetsRef.current = offsetsRef.current.map((off, i) => {
          if (pauseOnHover && hoveredIdxRef.current === i) return off;
          const item = items[i];
          const itemW = item.w * cw;
          const itemH = item.h * ch;
          let nx = off.x + item.dirX * speed * item.speedMult * 0.4;
          let ny = off.y + item.dirY * speed * item.speedMult * 0.4;

          if (cursorMode !== "none" && cursorRef.current) {
            const cx = cursorRef.current.x;
            const cy = cursorRef.current.y;
            const dx = nx + itemW / 2 - cx;
            const dy = ny + itemH / 2 - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDist = cursorStrength * 2.5;
            if (dist < maxDist && dist > 0) {
              const force = (1 - dist / maxDist) * cursorStrength * 0.08;
              const dir = cursorMode === "repel" ? 1 : -1;
              nx += (dx / dist) * force * dir;
              ny += (dy / dist) * force * dir;
            }
          }
          if (nx > cw + itemW) nx = -itemW;
          if (nx < -itemW) nx = cw + itemW;
          if (ny > ch + itemH) ny = -itemH;
          if (ny < -itemH) ny = ch + itemH;

          const card = cardRefs.current[i];
          if (card) {
            card.style.left = nx + "px";
            card.style.top = ny + "px";
          }
          return { x: nx, y: ny };
        });
      }
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [speed, cursorMode, cursorStrength, cw, ch, items, pauseOnHover]);

  if (count < 3) {
    return (
      <div ref={containerRef} className={cn("flex h-full w-full items-center justify-center", className)} style={{ background: backgroundColor }} {...props}>
        <span className="text-[13px] text-black/30" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
          Add at least 3 images
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("relative h-full w-full", className)}
      onMouseMove={(e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      }}
      onMouseEnter={() => {
        if (pauseAllOnHover) {
          galleryPausedRef.current = true;
          setGalleryPaused(true);
        }
      }}
      onMouseLeave={() => {
        galleryPausedRef.current = false;
        setGalleryPaused(false);
        setHoveredIdx(null);
        hoveredIdxRef.current = null;
        cursorRef.current = null;
      }}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ background: backgroundColor }}>
        {srcs.map((src, i) => {
          const item = items[i];
          const initOff = { x: item.x * cw, y: item.y * ch };
          const isHovered = hoveredIdx === i;
          const iw = item.w * cw;
          const ih = item.h * ch;

          return (
            <div
              key={i}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              onMouseEnter={() => {
                setHoveredIdx(i);
                hoveredIdxRef.current = i;
              }}
              onMouseLeave={() => {
                setHoveredIdx(null);
                hoveredIdxRef.current = null;
              }}
              onClick={() => {
                setLightboxIn(false);
                setLightbox(src);
              }}
              className="absolute cursor-pointer overflow-hidden transition-[transform,box-shadow] duration-[400ms] will-change-transform"
              style={{
                left: initOff.x,
                top: initOff.y,
                width: iw,
                height: ih,
                borderRadius,
                zIndex: isHovered ? 99 : item.zIndex,
                transform: `rotate(${isHovered ? item.rot * 0.3 : item.rot}deg) scale(${isHovered ? 1.04 : 1})`,
                transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1), ease",
                boxShadow: cardShadow ? (isHovered ? "0 24px 60px rgba(0,0,0,0.28), 0 8px 20px rgba(0,0,0,0.16)" : "0 8px 30px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)") : "none",
              }}
            >
              <img
                src={src}
                alt=""
                className="pointer-events-none block h-full w-full object-cover transition-transform duration-[600ms]"
                style={{ transform: isHovered ? "scale(1.08)" : "scale(1)", transitionTimingFunction: "cubic-bezier(0.34,1.1,0.64,1)" }}
              />
              <div className="pointer-events-none absolute inset-0 transition-colors duration-300 ease-[ease]" style={{ background: isHovered ? "rgba(0,0,0,0.08)" : "transparent" }} />
            </div>
          );
        })}

        {galleryPaused && pauseAllOnHover && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-black/45 px-3.5 py-[5px] text-[10px] tracking-[0.12em] text-white/70 uppercase backdrop-blur-sm" style={{ fontFamily: "'Helvetica Neue', sans-serif" }}>
            Paused
          </div>
        )}
      </div>

      
      {lightbox && (
        <div onClick={closeLightbox} className="absolute inset-0 z-[200] flex cursor-zoom-out items-center justify-center bg-black/85 backdrop-blur-lg">
          <button onClick={closeLightbox} aria-label="Close" className="absolute top-5 right-5 z-[201] cursor-pointer border-0 bg-transparent p-2 text-[22px] leading-none text-white/50 transition-colors duration-200 ease-[ease] hover:text-white">
            ✕
          </button>
          <img
            src={lightbox}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="block cursor-default object-contain transition-[opacity,transform] duration-[400ms]"
            style={{
              maxWidth: isMobile ? "92%" : "75%",
              maxHeight: isMobile ? "78vh" : "80vh",
              borderRadius: borderRadius * 1.5,
              boxShadow: "0 40px 120px rgba(0,0,0,0.7)",
              opacity: lightboxIn ? 1 : 0,
              transform: lightboxIn ? "scale(1)" : "scale(0.92)",
              transitionTimingFunction: "cubic-bezier(0.34,1.2,0.64,1)",
            }}
          />
        </div>
      )}
    </div>
  );
}
