"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ImageDeck3DShape = "rectangle" | "circle" | "diamond" | "hexagon" | "triangle" | "pentagon" | "star" | "squircle" | "blob";

export interface ImageDeck3DProps {
  image: string;
  alt?: string;
  layerCount?: number;
  shape?: ImageDeck3DShape;
  enableColor?: boolean;
  enableOpacity?: boolean;
  enableParallax?: boolean;
  enable3D?: boolean;
  idleAnimation?: boolean;
  radius?: number;
  tilt?: number;
  pan?: number;
  depth?: number;
  amplify?: number;
  className?: string;
}

const CLIP_PATHS: Record<ImageDeck3DShape, string> = {
  rectangle: "inset(0px round 0px)",
  circle: "circle(45% at 50% 50%)",
  diamond: "polygon(50% 0%, 14.1% 50%, 50% 100%, 85.9% 50%)",
  hexagon: "polygon(25% 6.7%, 75% 6.7%, 100% 50%, 75% 93.3%, 25% 93.3%, 0% 50%)",
  triangle: "polygon(50% 0%, 100% 100%, 0% 100%)",
  pentagon: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
  star: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  squircle: "none",
  blob: "none",
};

const BORDER_RADII: Partial<Record<ImageDeck3DShape, string>> = {
  squircle: "32%",
  blob: "62% 38% 34% 66% / 62% 32% 68% 38%",
};

const getBorderRadius = (s: ImageDeck3DShape) => BORDER_RADII[s];
const getClipPath = (s: ImageDeck3DShape, radius: number) => (s === "rectangle" ? `inset(0px round ${radius}px)` : CLIP_PATHS[s]);

const SCALE_INTERVAL = 0.06;
const OPACITY_INTERVAL = 0.05;
const OPACITY_FALLOFF = 0.1;
const SCALE_3D = 0.07;

const STAGGER_MS = 90;
const OPACITY_DURATION_MS = 700;
const TRANSFORM_DURATION_MS = 300;
const OPACITY_EASE = "cubic-bezier(0.65, 0.05, 0.36, 1)";
const TRANSFORM_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const FOLLOW_STRENGTH = 0.15;

const getScale = (i: number) => Math.max(1 - SCALE_INTERVAL * i, 0);
const getOpacity = (i: number, opacityOn: boolean) => (!opacityOn ? 1 : Math.max(1 - OPACITY_INTERVAL * i, 0.1));
const getFilterColor = (i: number, colorOn: boolean) => {
  if (!colorOn) return "";
  if (i === 0) return "grayscale(1)";
  const t = Math.min(i * 0.15, 1);
  return `grayscale(${1 - t}) saturate(${1 + t * 0.5})`;
};
const get3DOpacity = (i: number, opacityOn: boolean) => {
  const base = Math.max(1 - OPACITY_FALLOFF * i, 0.25);
  return opacityOn ? Math.max(base - OPACITY_INTERVAL * i, 0.1) : base;
};
const get3DScale = (i: number) => Math.max(1 - i * SCALE_3D, 0.35);

export function ImageDeck3D({
  image,
  alt = "",
  layerCount = 10,
  shape = "rectangle",
  enableColor = false,
  enableOpacity = false,
  enableParallax = false,
  enable3D = false,
  idleAnimation = true,
  radius = 0,
  tilt = 45,
  pan = 88,
  depth = 36,
  amplify = 54,
  className,
}: ImageDeck3DProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const stackRef = React.useRef<HTMLDivElement>(null);
  const layerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  const [isHovered, setIsHovered] = React.useState(false);

  const rectRef = React.useRef<DOMRect | null>(null);
  const rafRef = React.useRef<number | null>(null);
  const pendingRef = React.useRef<{ x: number; y: number } | null>(null);
  const [inView, setInView] = React.useState(true);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      rectRef.current = el.getBoundingClientRect();
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  React.useEffect(
    () => () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  const idleRafRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    const shouldRun = idleAnimation && enable3D && !isHovered && inView;

    if (!shouldRun) {
      if (idleRafRef.current != null) {
        cancelAnimationFrame(idleRafRef.current);
        idleRafRef.current = null;
      }
      return;
    }

    const amplitudeDeg = Math.min(tilt * 0.25, 10);
    const start = performance.now();

    const tick = (now: number) => {
      const t = (now - start) / 1000;
      if (stackRef.current) {
        stackRef.current.style.setProperty("--ry", `${Math.sin(t * 0.4) * amplitudeDeg}deg`);
        stackRef.current.style.setProperty("--rx", `${Math.cos(t * 0.3) * amplitudeDeg * 0.6}deg`);
      }
      idleRafRef.current = requestAnimationFrame(tick);
    };
    idleRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (idleRafRef.current != null) {
        cancelAnimationFrame(idleRafRef.current);
        idleRafRef.current = null;
      }
    };
  }, [idleAnimation, enable3D, isHovered, inView, tilt]);

  const resetOffsets = React.useCallback(() => {
    if (stackRef.current) {
      stackRef.current.style.setProperty("--ry", "0deg");
      stackRef.current.style.setProperty("--rx", "0deg");
      stackRef.current.style.setProperty("--sx", "0px");
      stackRef.current.style.setProperty("--sy", "0px");
    }
    layerRefs.current.forEach((el) => {
      if (!el) return;
      el.style.setProperty("--px", "0px");
      el.style.setProperty("--py", "0px");
    });
  }, []);

  const processMove = React.useCallback(() => {
    rafRef.current = null;
    const ev = pendingRef.current;
    const rect = rectRef.current;
    if (!ev || !rect) return;

    const nx = ((ev.x - rect.left) / rect.width - 0.5) * 2;
    const ny = ((ev.y - rect.top) / rect.height - 0.5) * 2;

    if (enable3D && stackRef.current) {
      const amplifyFactor = amplify / 100;
      const tiltDeg = tilt * amplifyFactor;
      const panPx = pan * amplifyFactor;
      stackRef.current.style.setProperty("--ry", `${nx * tiltDeg}deg`);
      stackRef.current.style.setProperty("--rx", `${-ny * tiltDeg}deg`);
      stackRef.current.style.setProperty("--sx", `${nx * panPx}px`);
      stackRef.current.style.setProperty("--sy", `${ny * panPx}px`);
    } else if (enableParallax) {
      layerRefs.current.forEach((el, i) => {
        if (!el || i === 0) return;
        const sv = 1 - SCALE_INTERVAL * i;
        const mult = sv > 0 ? (1 - sv) * 3 + 0.2 : 1;
        const x = nx * rect.width * FOLLOW_STRENGTH * mult;
        const y = ny * rect.height * FOLLOW_STRENGTH * mult;
        el.style.setProperty("--px", `${x}px`);
        el.style.setProperty("--py", `${y}px`);
      });
    }
  }, [enable3D, enableParallax, tilt, pan, amplify]);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!isHovered || (!enable3D && !enableParallax)) return;
      pendingRef.current = { x: e.clientX, y: e.clientY };
      if (rafRef.current == null) {
        rafRef.current = requestAnimationFrame(processMove);
      }
    },
    [isHovered, enable3D, enableParallax, processMove],
  );

  const handleMouseEnter = React.useCallback(() => {
    rectRef.current = containerRef.current?.getBoundingClientRect() ?? null;
    setIsHovered(true);
  }, []);

  const handleMouseLeave = React.useCallback(() => {
    setIsHovered(false);
    resetOffsets();
  }, [resetOffsets]);

  const layerStyles = React.useMemo(() => {
    const styles: React.CSSProperties[] = [];
    for (let i = 0; i < layerCount; i++) {
      const delayMs = isHovered ? (layerCount - 1 - i) * STAGGER_MS : i * STAGGER_MS;

      const scale = enable3D ? get3DScale(i) : isHovered ? getScale(i) : i === 0 ? 1 : 0.95;

      const opacity = enable3D ? get3DOpacity(i, enableOpacity) : i === 0 ? 1 : isHovered ? getOpacity(i, enableOpacity) : 0;

      const translateZ = enable3D ? i * depth : 0;
      const filter = getFilterColor(i, enableColor) || "none";

      styles.push({
        transform: `translateZ(${translateZ}px) scale(${scale}) translate(var(--px, 0px), var(--py, 0px))`,
        opacity,
        filter,
        transitionProperty: "transform, opacity, filter",
        transitionDuration: `${TRANSFORM_DURATION_MS}ms, ${OPACITY_DURATION_MS}ms, ${OPACITY_DURATION_MS}ms`,
        transitionTimingFunction: `${TRANSFORM_EASE}, ${OPACITY_EASE}, ${OPACITY_EASE}`,
        transitionDelay: `0ms, ${delayMs}ms, ${delayMs}ms`,
      } as React.CSSProperties);
    }
    return styles;
  }, [layerCount, isHovered, enable3D, enableOpacity, enableColor, depth]);

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div
        ref={containerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        className="relative h-full w-full cursor-pointer border border-white/15"
        style={{
          overflow: enable3D ? "visible" : "hidden",
          borderRadius: radius,
          perspective: enable3D ? 1600 : undefined,
          perspectiveOrigin: "50% 50%",
          isolation: enable3D ? "isolate" : undefined,
        }}
      >
        <img src={image} alt={alt} className="sr-only" />
        <div
          ref={stackRef}
          aria-hidden="true"
          className="absolute inset-0"
          style={
            {
              transformStyle: enable3D ? "preserve-3d" : "flat",
              transform: "rotateY(var(--ry, 0deg)) rotateX(var(--rx, 0deg)) translate(var(--sx, 0px), var(--sy, 0px))",
              transition: "transform 0.3s ease",
              willChange: "transform",
            } as React.CSSProperties
          }
        >
          {Array.from({ length: layerCount }).map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                layerRefs.current[i] = el;
              }}
              style={
                {
                  position: "absolute",
                  inset: 0,
                  backgroundImage: `url(${JSON.stringify(image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backfaceVisibility: "hidden",
                  willChange: "transform, opacity",
                  clipPath: getClipPath(i === 0 ? "rectangle" : shape, radius),
                  borderRadius: getBorderRadius(i === 0 ? "rectangle" : shape),
                  ...layerStyles[i],
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
