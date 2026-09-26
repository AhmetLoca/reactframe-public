"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TiltTextGradientDirection = "horizontal" | "vertical" | "diagonal" | "radial";

export interface TiltTextProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  text?: string;
  fontSize?: number;
  autoFit?: boolean;
  fitPadding?: number;
  fontWeight?: string;
  fontFamily?: string;
  letterSpacing?: number;
  lineHeight?: number;
  textColor?: string;
  backgroundColor?: string;
  useGradient?: boolean;
  gradientColorTo?: string;
  gradientDirection?: TiltTextGradientDirection;
  perspectiveDepth?: number;
  tiltStrength?: number;
  smoothing?: number;
  scaleOnHover?: boolean;
  scaleAmount?: number;
}

export function TiltText({
  text = "WOAH THERE",
  fontSize = 140,
  autoFit = false,
  fitPadding = 8,
  fontWeight = "700",
  fontFamily = "Inter, sans-serif",
  letterSpacing = -3,
  lineHeight = 1.1,
  textColor = "#ffffff",
  backgroundColor = "#0a0a0a",
  useGradient = false,
  gradientColorTo = "#ff55ee",
  gradientDirection = "horizontal",
  perspectiveDepth = 900,
  tiltStrength = 60,
  smoothing = 0.08,
  scaleOnHover = true,
  scaleAmount = 1.05,
  className,
  style,
  ...props
}: TiltTextProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const mouseRef = React.useRef({ x: -9999, y: -9999, over: false });
  // Single object for all animated values — updated each frame, never triggers re-render.
  const animRef = React.useRef({ rotX: 0, rotY: 0, scale: 1 });
  const rafRef = React.useRef(0);

  const [computedFontSize, setComputedFontSize] = React.useState(fontSize);

  // Live config ref — written every render, read inside the RAF loop.
  const live = React.useRef({
    tiltStrength: tiltStrength,
    perspectiveDepth,
    smoothing,
    scaleOnHover,
    scaleAmount,
  });
  React.useEffect(() => {
    const lc = live.current;
    lc.tiltStrength = tiltStrength;
    lc.perspectiveDepth = perspectiveDepth;
    lc.smoothing = smoothing;
    lc.scaleOnHover = scaleOnHover;
    lc.scaleAmount = scaleAmount;
  }, [tiltStrength, perspectiveDepth, smoothing, scaleOnHover, scaleAmount]);

  const computeFontSizeFn = React.useCallback(() => {
    if (!autoFit) return;
    const el = containerRef.current;
    if (!el) return;
    const cw = el.offsetWidth;
    const ch = el.offsetHeight;
    if (!cw || !ch) return;
    const off = document.createElement("canvas");
    const ctx = off.getContext("2d")!;
    ctx.font = `${fontWeight} 100px ${fontFamily}`;
    const w100 = ctx.measureText(text).width;
    if (w100 === 0) return;
    const padded = cw * (1 - (fitPadding * 2) / 100);
    setComputedFontSize(Math.min(Math.floor((padded / w100) * 100), Math.floor(ch * 0.85)));
  }, [autoFit, fontWeight, fontFamily, text, fitPadding]);

  React.useEffect(() => {
    if (!autoFit) {
      setComputedFontSize(fontSize);
      return;
    }
    const el = containerRef.current;
    if (!el) return;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(computeFontSizeFn, 80);
    });
    ro.observe(el);
    computeFontSizeFn();
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [autoFit, fontSize, computeFontSizeFn]);

  // Animation loop — mounted once.
  React.useEffect(() => {
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const cfg = live.current;
      const anim = animRef.current;
      const { x: mx, y: my, over } = mouseRef.current;

      let tRotX = 0,
        tRotY = 0,
        tScale = 1;

      if (over && mx > -9000 && containerRef.current) {
        const w = containerRef.current.offsetWidth;
        const h = containerRef.current.offsetHeight;
        // Normalize cursor position to [-1, 1] from element center.
        const nx = (mx / w - 0.5) * 2;
        const ny = (my / h - 0.5) * 2;
        tRotX = -ny * cfg.tiltStrength;
        tRotY = nx * cfg.tiltStrength;
        tScale = cfg.scaleOnHover ? cfg.scaleAmount : 1;
      }

      const sm = Math.min(1, Math.max(0.01, cfg.smoothing));
      anim.rotX += (tRotX - anim.rotX) * sm;
      anim.rotY += (tRotY - anim.rotY) * sm;
      anim.scale += (tScale - anim.scale) * sm;

      // Write directly to the DOM — zero React overhead in the hot path.
      if (sceneRef.current) {
        sceneRef.current.style.transform = [
          `perspective(${cfg.perspectiveDepth}px)`,
          `rotateX(${anim.rotX.toFixed(4)}deg)`,
          `rotateY(${anim.rotY.toFixed(4)}deg)`,
          `scale(${anim.scale.toFixed(5)})`,
        ].join(" ");
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const gradientDir = gradientDirection === "vertical" ? "180deg" : gradientDirection === "diagonal" ? "135deg" : "90deg";

  const sharedTextProps: React.CSSProperties = {
    fontSize: computedFontSize,
    fontWeight,
    fontFamily,
    letterSpacing: `${letterSpacing}px`,
    lineHeight,
    whiteSpace: "pre-line",
    textAlign: "center",
    userSelect: "none",
    pointerEvents: "none",
  };

  const mainTextStyle: React.CSSProperties = {
    ...sharedTextProps,
    display: "block",
    position: "relative",
    ...(useGradient
      ? {
          background: gradientDirection === "radial" ? `radial-gradient(circle, ${textColor}, ${gradientColorTo})` : `linear-gradient(${gradientDir}, ${textColor}, ${gradientColorTo})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }
      : { color: textColor }),
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden", className)}
      style={{ backgroundColor, ...style }}
      onPointerMove={(e) => {
        const r = containerRef.current!.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top, over: true };
      }}
      onPointerEnter={() => {
        mouseRef.current = { ...mouseRef.current, over: true };
      }}
      onPointerLeave={() => {
        mouseRef.current = { x: -9999, y: -9999, over: false };
      }}
      {...props}
    >
      {/* 3D scene — all transforms applied here */}
      <div ref={sceneRef} className="relative flex h-full w-full items-center justify-center [transform-style:preserve-3d] [will-change:transform]">
        <span style={mainTextStyle}>{text}</span>
      </div>

    </div>
  );
}
