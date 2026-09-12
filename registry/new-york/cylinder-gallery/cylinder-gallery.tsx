"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface CylinderGalleryImage {
  src: string;
  alt?: string;
}

export interface CylinderGalleryProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  images?: CylinderGalleryImage[];
  rows?: number;
  columns?: number;
  cylinderRadius?: number;
  cardWidth?: number;
  cardHeight?: number;
  gap?: number;
  borderRadius?: number;
  rotationSpeed?: number;
  tiltAngle?: number;
}

const DEFAULT_IMAGES: CylinderGalleryImage[] = [
  { src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=600&q=80" },
  { src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600&q=80" },
];

export function CylinderGallery({
  images = DEFAULT_IMAGES,
  rows = 3,
  columns = 6,
  cylinderRadius = 320,
  cardWidth = 320,
  cardHeight = 280,
  gap = 16,
  borderRadius = 18,
  rotationSpeed = 2.2,
  tiltAngle = -12,
  className,
  ...props
}: CylinderGalleryProps) {
  const cylinderRef = React.useRef<HTMLDivElement>(null);
  const cardRefs = React.useRef<(HTMLDivElement | null)[]>([]);
  const rafRef = React.useRef<number | null>(null);
  const autoRotRef = React.useRef(0);
  const smoothRotRef = React.useRef(0);
  const lastTimeRef = React.useRef<number | null>(null);

  const rotationSpeedRef = React.useRef(rotationSpeed);
  const tiltAngleRef = React.useRef(tiltAngle);
  React.useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
    tiltAngleRef.current = tiltAngle;
  }, [rotationSpeed, tiltAngle]);

  const { effectiveColumns, angleStep, totalCells } = React.useMemo(() => {
    const effectiveColumns = images.length > 0 ? Math.max(columns, Math.ceil(images.length / rows)) : columns;
    return { effectiveColumns, angleStep: 360 / effectiveColumns, totalCells: rows * effectiveColumns };
  }, [images.length, columns, rows]);

  const { totalRowHeight, autoHeight } = React.useMemo(() => {
    const totalRowHeight = rows * cardHeight + (rows - 1) * gap;
    return { totalRowHeight, autoHeight: totalRowHeight + Math.max(160, cylinderRadius * 0.25) };
  }, [rows, cardHeight, gap, cylinderRadius]);

  const cardCells = React.useMemo(() => {
    return Array.from({ length: totalCells }, (_, cellIndex) => {
      const rowIndex = Math.floor(cellIndex / effectiveColumns);
      const colIndex = cellIndex % effectiveColumns;
      const angle = colIndex * angleStep;
      const rad = (angle * Math.PI) / 180;
      return { cellIndex, angle, x: Math.sin(rad) * cylinderRadius, z: Math.cos(rad) * cylinderRadius, rowY: rowIndex * (cardHeight + gap) };
    });
  }, [totalCells, effectiveColumns, angleStep, cylinderRadius, cardHeight, gap]);

  const filled: (CylinderGalleryImage | null)[] = React.useMemo(
    () => Array.from({ length: totalCells }, (_, i) => (images.length > 0 ? images[i % images.length] : null)),
    [images, totalCells],
  );

  // A fresh ref-callback per cell on every render would make React null out
  // and immediately reattach every card ref on every re-render (identity
  // change, not an actual DOM change) — cheap in isolation, but needless
  // churn the RAF loop's own read of cardRefs.current has no reason to pay.
  // One stable closure per cellIndex, regenerated only when totalCells
  // itself changes — which is also when the RAF effect below restarts, so
  // the two stay in lockstep.
  const refCallbacks = React.useMemo(
    () =>
      Array.from({ length: totalCells }, (_, cellIndex) => (el: HTMLDivElement | null) => {
        cardRefs.current[cellIndex] = el;
      }),
    [totalCells],
  );

  React.useEffect(() => {
    const prev = cardRefs.current;
    cardRefs.current = Array.from({ length: totalCells }, (_, i) => prev[i] ?? null);
    autoRotRef.current = smoothRotRef.current;

    const angleStepLocal = 360 / effectiveColumns;

    const tick = (timestamp: number) => {
      const delta = lastTimeRef.current ? Math.min((timestamp - lastTimeRef.current) / 1000, 0.1) : 0.016;
      lastTimeRef.current = timestamp;

      autoRotRef.current += delta * rotationSpeedRef.current * 18;
      smoothRotRef.current += (autoRotRef.current - smoothRotRef.current) * 0.06;

      const rot = smoothRotRef.current;

      if (cylinderRef.current) {
        cylinderRef.current.style.transform = `rotateX(${tiltAngleRef.current}deg) rotateY(${rot}deg)`;
      }

      cardRefs.current.forEach((card, idx) => {
        if (!card) return;
        const colIndex = idx % effectiveColumns;
        const angle = colIndex * angleStepLocal;
        const effectiveAngle = (((angle + rot) % 360) + 360) % 360;
        const distFromFront = effectiveAngle > 180 ? 360 - effectiveAngle : effectiveAngle;
        const fadeStart = 30;
        const visibilityThreshold = 50;
        const opacity = distFromFront <= fadeStart ? 1 : distFromFront >= visibilityThreshold ? 0 : 1 - (distFromFront - fadeStart) / (visibilityThreshold - fadeStart);
        card.style.opacity = String(opacity);
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTimeRef.current = null;
    };
  }, [effectiveColumns, totalCells]);

  return (
    <div
      className={cn("flex w-full items-center justify-center overflow-visible", className)}
      style={{ height: autoHeight, perspective: `${cylinderRadius * 2.8}px`, perspectiveOrigin: "50% 50%" }}
      {...props}
    >
      <div
        ref={cylinderRef}
        className="relative will-change-transform"
        style={{ width: cardWidth, height: totalRowHeight, transformStyle: "preserve-3d", transform: `rotateX(${tiltAngle}deg) rotateY(0deg)` }}
      >
        {cardCells.map(({ cellIndex, angle, x, z, rowY }) => {
          const img = filled[cellIndex];
          const src = img?.src ?? "";

          return (
            <div
              key={cellIndex}
              ref={refCallbacks[cellIndex]}
              className="absolute top-0 left-1/2 overflow-hidden will-change-[opacity]"
              style={{
                width: cardWidth,
                height: cardHeight,
                marginTop: rowY,
                marginLeft: -cardWidth / 2,
                transform: `translate3d(${x}px,0px,${z}px) rotateY(${angle}deg)`,
                transformStyle: "preserve-3d",
                borderRadius,
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                backfaceVisibility: "hidden",
              }}
            >
              {src ? (
                <img src={src} alt={img?.alt || ""} draggable={false} className="pointer-events-none block h-full w-full object-cover select-none" />
              ) : (
                <div className="flex h-full w-full items-center justify-center" style={{ background: `hsl(${(cellIndex * 43) % 360},18%,${10 + (cellIndex % 5) * 3}%)` }}>
                  <span className="font-mono text-[13px] text-white/12">{cellIndex + 1}</span>
                </div>
              )}
              <div className="pointer-events-none absolute inset-0" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.08) 0%,transparent 40%,rgba(0,0,0,0.25) 100%)", borderRadius }} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
