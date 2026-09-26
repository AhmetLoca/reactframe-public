"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type LiquidTextPreset = "liquid" | "melt" | "blob" | "ghost" | "crystal";
export type LiquidTextGradientDirection = "horizontal" | "vertical" | "radial";

interface PresetDef {
  bfx: number;
  bfy: number;
  octaves: number;
  turbType: "fractalNoise" | "turbulence";
  baseScale: number;
  morphRadius: number;
  blurStd: number;
  breatheAmp: number;
  breatheSpeed: number;
  evolveX: number;
  evolveY: number;
}

const PRESETS: Record<LiquidTextPreset, PresetDef> = {
  liquid: { bfx: 0.014, bfy: 0.011, octaves: 3, turbType: "fractalNoise", baseScale: 16, morphRadius: 0, blurStd: 0, breatheAmp: 8, breatheSpeed: 0.45, evolveX: 0.006, evolveY: 0.004 },
  melt: { bfx: 0.009, bfy: 0.022, octaves: 2, turbType: "fractalNoise", baseScale: 28, morphRadius: 0, blurStd: 0, breatheAmp: 14, breatheSpeed: 0.25, evolveX: 0.003, evolveY: 0.009 },
  blob: { bfx: 0.018, bfy: 0.018, octaves: 2, turbType: "fractalNoise", baseScale: 10, morphRadius: 5, blurStd: 1.5, breatheAmp: 5, breatheSpeed: 0.9, evolveX: 0.007, evolveY: 0.007 },
  ghost: { bfx: 0.022, bfy: 0.022, octaves: 4, turbType: "fractalNoise", baseScale: 22, morphRadius: 0, blurStd: 3.5, breatheAmp: 18, breatheSpeed: 0.35, evolveX: 0.009, evolveY: 0.007 },
  crystal: { bfx: 0.038, bfy: 0.038, octaves: 1, turbType: "turbulence", baseScale: 20, morphRadius: 0, blurStd: 0, breatheAmp: 12, breatheSpeed: 1.3, evolveX: 0.015, evolveY: 0.012 },
};

export interface LiquidTextProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  text?: string;
  fontSize?: number;
  autoFit?: boolean;
  fitPadding?: number;
  fontWeight?: string;
  fontFamily?: string;
  letterSpacing?: number;
  textColor?: string;
  backgroundColor?: string;
  useGradient?: boolean;
  gradientColorTo?: string;
  gradientDirection?: LiquidTextGradientDirection;
  preset?: LiquidTextPreset;
  scaleMultiplier?: number;
  mouseEnabled?: boolean;
  mouseStrength?: number;
  mouseRadius?: number;
  clickBurst?: boolean;
  burstStrength?: number;
  useGlow?: boolean;
  glowColor?: string;
  glowRadius?: number;
}

export function LiquidText({
  text = "Liquid",
  fontSize = 120,
  autoFit = false,
  fitPadding = 5,
  fontWeight = "700",
  fontFamily = "Inter, sans-serif",
  letterSpacing = -2,
  textColor = "#87FFE3",
  backgroundColor = "#000000",
  useGradient = false,
  gradientColorTo = "#ff55ee",
  gradientDirection = "horizontal",
  preset = "liquid",
  scaleMultiplier = 1,
  mouseEnabled = true,
  mouseStrength = 2,
  mouseRadius = 300,
  clickBurst = false,
  burstStrength = 3,
  useGlow = false,
  glowColor = "#87FFE3",
  glowRadius = 20,
  className,
  style,
  ...props
}: LiquidTextProps) {
  const filterId = `blob-fx-${React.useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const containerRef = React.useRef<HTMLDivElement>(null);
  const turbRef = React.useRef<SVGFETurbulenceElement>(null);
  const dispRef = React.useRef<SVGFEDisplacementMapElement>(null);
  const morphRef = React.useRef<SVGFEMorphologyElement>(null);
  const mouseRef = React.useRef({ x: -9999, y: -9999 });
  const currentScaleRef = React.useRef(PRESETS[preset].baseScale);
  const burstRef = React.useRef({ active: false, startTime: 0, strength: 0 });
  const rafRef = React.useRef(0);

  const [computedFontSize, setComputedFontSize] = React.useState(fontSize);

  const live = React.useRef({ preset, scaleMultiplier, mouseEnabled, mouseStrength, mouseRadius, clickBurst, burstStrength });
  React.useEffect(() => {
    const lc = live.current;
    lc.preset = preset;
    lc.scaleMultiplier = scaleMultiplier;
    lc.mouseEnabled = mouseEnabled;
    lc.mouseStrength = mouseStrength;
    lc.mouseRadius = mouseRadius;
    lc.clickBurst = clickBurst;
    lc.burstStrength = burstStrength;
  }, [preset, scaleMultiplier, mouseEnabled, mouseStrength, mouseRadius, clickBurst, burstStrength]);

  React.useEffect(() => {
    currentScaleRef.current = PRESETS[preset].baseScale;
  }, [preset]);

  const computeFontSizeFn = React.useCallback(() => {
    if (!autoFit) return;
    const container = containerRef.current;
    if (!container) return;
    const cw = container.offsetWidth;
    const ch = container.offsetHeight;
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
    if (!autoFit) return;
    const container = containerRef.current;
    if (!container) return;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = window.setTimeout(computeFontSizeFn, 80);
    });
    ro.observe(container);
    computeFontSizeFn();
    return () => {
      ro.disconnect();
      clearTimeout(timer);
    };
  }, [autoFit, computeFontSizeFn]);

  const resolvedFontSize = autoFit ? computedFontSize : fontSize;

  React.useEffect(() => {
    let alive = true;

    const tick = (ts: number) => {
      if (!alive) return;

      const cfg = live.current;
      const p = PRESETS[cfg.preset];
      const t = ts * 0.001;

      const bfx = p.bfx + Math.sin(t * p.evolveX * 10) * p.bfx * 0.4;
      const bfy = p.bfy + Math.cos(t * p.evolveY * 10 * 0.77) * p.bfy * 0.35;

      const breathe = Math.sin(t * p.breatheSpeed) * p.breatheAmp;

      let mouseBoost = 0;
      if (cfg.mouseEnabled) {
        const { x: mx, y: my } = mouseRef.current;
        if (mx > -9000 && containerRef.current) {
          const w = containerRef.current.offsetWidth;
          const h = containerRef.current.offsetHeight;
          const dist = Math.sqrt((mx - w * 0.5) ** 2 + (my - h * 0.5) ** 2);
          const proximity = Math.max(0, 1 - dist / Math.max(1, cfg.mouseRadius));
          mouseBoost = proximity * cfg.mouseStrength * p.baseScale * 0.5;
        }
      }

      let burstBoost = 0;
      if (burstRef.current.active) {
        const elapsed = t - burstRef.current.startTime;
        const dur = 0.75;
        if (elapsed < dur) {
          burstBoost = Math.pow(1 - elapsed / dur, 2) * burstRef.current.strength * p.baseScale;
        } else {
          burstRef.current.active = false;
        }
      }

      const targetScale = (p.baseScale + breathe + mouseBoost + burstBoost) * cfg.scaleMultiplier;
      currentScaleRef.current += (targetScale - currentScaleRef.current) * 0.08;

      turbRef.current?.setAttribute("baseFrequency", `${bfx.toFixed(5)} ${bfy.toFixed(5)}`);
      dispRef.current?.setAttribute("scale", `${currentScaleRef.current.toFixed(2)}`);

      if (morphRef.current) {
        if (p.morphRadius > 0) {
          const r = p.morphRadius + Math.sin(t * p.breatheSpeed * 1.3) * p.morphRadius * 0.3;
          morphRef.current.setAttribute("radius", r.toFixed(2));
        } else {
          morphRef.current.setAttribute("radius", "0");
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const textStyle: React.CSSProperties = {
    display: "block",
    fontSize: resolvedFontSize,
    fontWeight,
    fontFamily,
    letterSpacing: `${letterSpacing}px`,
    lineHeight: 1.1,
    textAlign: "center",
    whiteSpace: "pre-line",
    userSelect: "none",
    pointerEvents: "none",
    ...(useGradient
      ? {
          background:
            gradientDirection === "radial"
              ? `radial-gradient(circle, ${textColor}, ${gradientColorTo})`
              : `linear-gradient(${gradientDirection === "vertical" ? "180deg" : "90deg"}, ${textColor}, ${gradientColorTo})`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }
      : { color: textColor }),
    ...(useGlow ? { textShadow: `0 0 ${glowRadius}px ${glowColor}, 0 0 ${glowRadius * 2.2}px ${glowColor}55` } : {}),
  };

  return (
    <div
      ref={containerRef}
      className={cn("relative flex h-full w-full items-center justify-center overflow-hidden [touch-action:none]", className)}
      style={{ backgroundColor, cursor: clickBurst ? "pointer" : "default", ...style }}
      onPointerMove={(e) => {
        const r = containerRef.current!.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
      }}
      onPointerLeave={() => {
        mouseRef.current = { x: -9999, y: -9999 };
      }}
      onPointerUp={(e) => {
        if (e.pointerType === "touch") mouseRef.current = { x: -9999, y: -9999 };
        if (live.current.clickBurst) {
          burstRef.current = { active: true, startTime: performance.now() * 0.001, strength: live.current.burstStrength };
        }
      }}
      {...props}
    >
      <svg width="0" height="0" className="absolute overflow-visible" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%" colorInterpolationFilters="sRGB">
            <feTurbulence ref={turbRef} type={PRESETS[preset].turbType} baseFrequency={`${PRESETS[preset].bfx} ${PRESETS[preset].bfy}`} numOctaves={PRESETS[preset].octaves} seed="2" result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale={String(PRESETS[preset].baseScale)} xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feMorphology ref={morphRef} operator="dilate" radius={String(PRESETS[preset].morphRadius)} in="displaced" result="morphed" />
            <feGaussianBlur stdDeviation={String(PRESETS[preset].blurStd)} in="morphed" />
          </filter>
        </defs>
      </svg>

      <div className="box-border flex h-full w-full items-center justify-center p-[60px] [will-change:filter]" style={{ filter: `url(#${filterId})` }}>
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  );
}
