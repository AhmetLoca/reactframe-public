"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RotatingGalleryImage {
  src: string;
  title?: string;
}

export interface RotatingGalleryProps {
  images?: RotatingGalleryImage[];
  cardWidth?: number;
  cardHeight?: number;
  radius?: number;
  rotationSpeed?: number;
  perspectiveDepth?: number;
  borderRadius?: number;
  showLabels?: boolean;
  labelColor?: string;
  labelSize?: number;
  labelFont?: string;
  backgroundColor?: string;
  shadowColor?: string;
  className?: string;
}

const DEFAULT_IMAGES: RotatingGalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80", title: "Studio" },
  { src: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80", title: "Workspace" },
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80", title: "Detail" },
  { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80", title: "Product" },
  { src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&q=80", title: "Craft" },
  { src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80", title: "Materials" },
];

export function RotatingGallery({
  images = DEFAULT_IMAGES,
  cardWidth = 360,
  cardHeight = 360,
  radius = 520,
  rotationSpeed = 1.4,
  perspectiveDepth = 1000,
  borderRadius = 24,
  showLabels = true,
  labelColor = "#1a1a1a",
  labelSize = 20,
  labelFont = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  backgroundColor = "transparent",
  shadowColor = "rgba(0,0,0,0.18)",
  className,
}: RotatingGalleryProps) {
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const labelRef = React.useRef<HTMLSpanElement>(null);
  const rafRef = React.useRef<number | null>(null);
  const rotRef = React.useRef(0);
  const lastTimeRef = React.useRef<number | null>(null);
  const speedRef = React.useRef(rotationSpeed);
  const prevFrontRef = React.useRef(-1);

  React.useEffect(() => {
    speedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  const count = images.length;

  React.useEffect(() => {
    if (count === 0) return;

    const step = 360 / count;
    const DEG = Math.PI / 180;
    prevFrontRef.current = -1;

    const applyFrame = (rot: number) => {
      let frontIdx = 0;
      let maxZ = -Infinity;

      for (let i = 0; i < count; i++) {
        const card = cardRefs.current[i];
        if (!card) continue;

        const totalDeg = i * step - rot;
        const angle = totalDeg * DEG;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;

        card.style.transform = `translate3d(${x.toFixed(2)}px,0px,${z.toFixed(2)}px) rotateY(${(-totalDeg).toFixed(2)}deg)`;
        card.style.zIndex = String(Math.round(z + radius + 10));

        if (z > maxZ) {
          maxZ = z;
          frontIdx = i;
        }
      }

      if (showLabels && labelRef.current) {
        if (frontIdx !== prevFrontRef.current) {
          prevFrontRef.current = frontIdx;
          labelRef.current.textContent = images[frontIdx]?.title ?? "";
        }
      }
    };

    const tick = (ts: number) => {
      const delta = lastTimeRef.current ? Math.min((ts - lastTimeRef.current) / 1000, 0.1) : 0.016;
      lastTimeRef.current = ts;
      rotRef.current += delta * speedRef.current * 15;
      applyFrame(rotRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [count, radius, showLabels, images]);

  if (count === 0) {
    return (
      <div className={cn("flex h-full w-full items-center justify-center rounded-[12px] border-[1.5px] border-dashed border-black/15 bg-black/[0.04]", className)}>
        <span className="text-center text-sm leading-[1.6] text-black/40">
          Add images to the
          <br />
          images prop
        </span>
      </div>
    );
  }

  const labelAreaHeight = showLabels ? 56 : 0;

  return (
    <div className={cn("relative flex w-full flex-col items-center justify-start", className)} style={{ height: cardHeight + labelAreaHeight, backgroundColor }}>
      <div className="relative w-full overflow-hidden" style={{ height: cardHeight, perspective: `${perspectiveDepth}px`, perspectiveOrigin: "50% 50%" }}>
        <div className="absolute top-0 left-1/2 w-0" style={{ height: cardHeight, transformStyle: "preserve-3d" }}>
          {images.map((img, i) => {
            const stepDeg = 360 / count;
            const angle = i * stepDeg * (Math.PI / 180);
            const x = Math.sin(angle) * radius;
            const z = Math.cos(angle) * radius;

            return (
              <div
                key={i}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute top-0 left-0 shrink-0 cursor-default overflow-hidden [backface-visibility:hidden]"
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  marginLeft: -cardWidth / 2,
                  borderRadius,
                  transform: `translate3d(${x.toFixed(2)}px,0px,${z.toFixed(2)}px) rotateY(${(-i * stepDeg).toFixed(2)}deg)`,
                  boxShadow: `0 16px 48px ${shadowColor}`,
                  willChange: "transform",
                }}
              >
                {img.src ? (
                  <img src={img.src} alt={img.title || ""} className="block h-full w-full object-cover select-none" draggable={false} />
                ) : (
                  <div className="flex h-full w-full items-center justify-center" style={{ background: `hsl(${Math.round((i * 360) / count)},30%,62%)` }}>
                    <span className="text-[15px] text-white/75">{img.title || i + 1}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showLabels && (
        <div className="flex items-center justify-center pt-1" style={{ height: labelAreaHeight }}>
          <span ref={labelRef} className="leading-none font-medium whitespace-nowrap" style={{ fontSize: labelSize, color: labelColor, fontFamily: labelFont, letterSpacing: "-0.01em" }}>
            {images[0]?.title ?? ""}
          </span>
        </div>
      )}
    </div>
  );
}
