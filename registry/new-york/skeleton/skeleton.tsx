"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SkeletonVariant = "rect" | "text" | "circle" | "card";
export type SkeletonAnimation = "shimmer" | "pulse" | "none";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  lines?: number;
  radius?: number;
  animation?: SkeletonAnimation;
  theme?: "dark" | "light";
  accentColor?: string;
  loading?: boolean;
  children?: React.ReactNode;
  className?: string;
}

const PALETTES = {
  dark: { base: "rgba(255,255,255,0.07)", shine: "rgba(255,255,255,0.12)" },
  light: { base: "rgba(10,10,10,0.07)", shine: "rgba(255,255,255,0.75)" },
};

interface BoneProps {
  width?: number | string;
  height?: number | string;
  radius: number | string;
  base: string;
  shine: string;
  animation: SkeletonAnimation;
  reduced: boolean;
  delay?: number;
  style?: React.CSSProperties;
}

function Bone({ width = "100%", height = 14, radius, base, shine, animation, reduced, delay = 0, style }: BoneProps) {
  const still = reduced || animation === "none";
  return (
    <motion.div
      aria-hidden="true"
      className="relative shrink-0 overflow-hidden"
      style={{ width, height, borderRadius: radius, background: base, ...style }}
      animate={animation === "pulse" && !still ? { opacity: [1, 0.5, 1] } : undefined}
      transition={animation === "pulse" ? { duration: 1.6, ease: "easeInOut", repeat: Infinity, delay } : undefined}
    >
      {animation === "shimmer" && !still && (
        <motion.div
          className="absolute inset-0"
          style={{ background: `linear-gradient(100deg, transparent 20%, ${shine} 50%, transparent 80%)` }}
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.2, delay }}
        />
      )}
    </motion.div>
  );
}

export function Skeleton({
  variant = "rect",
  width,
  height,
  lines = 3,
  radius = 10,
  animation = "shimmer",
  theme = "dark",
  accentColor,
  loading = true,
  children,
  className,
}: SkeletonProps) {
  const reduced = useReducedMotion() ?? false;
  const p = PALETTES[theme];
  const shine = accentColor ? `color-mix(in srgb, ${accentColor} 22%, transparent)` : p.shine;
  const bone = { base: p.base, shine, animation, reduced };

  if (!loading) {
    return (
      <motion.div className={className} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        {children}
      </motion.div>
    );
  }

  let content: React.ReactNode;
  if (variant === "circle") {
    const size = width ?? height ?? 48;
    content = <Bone {...bone} width={size} height={size} radius="50%" />;
  } else if (variant === "text") {
    content = (
      <div className="flex flex-col" style={{ gap: 10, width: width ?? "100%" }}>
        {Array.from({ length: lines }).map((_, i) => (
          <Bone key={i} {...bone} height={height ?? 14} radius={Math.min(radius, 8)} width={i === lines - 1 && lines > 1 ? "62%" : "100%"} delay={i * 0.12} />
        ))}
      </div>
    );
  } else if (variant === "card") {
    content = (
      <div className="flex flex-col" style={{ gap: 16, width: width ?? 320, padding: 16, borderRadius: radius + 8, border: `1px solid ${theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(10,10,10,0.08)"}` }}>
        <div className="flex items-center" style={{ gap: 12 }}>
          <Bone {...bone} width={44} height={44} radius="50%" />
          <div className="flex flex-1 flex-col" style={{ gap: 8 }}>
            <Bone {...bone} width="55%" height={12} radius={6} delay={0.1} />
            <Bone {...bone} width="35%" height={10} radius={6} delay={0.2} />
          </div>
        </div>
        <Bone {...bone} height={height ?? 150} radius={radius} delay={0.15} />
        <div className="flex flex-col" style={{ gap: 9 }}>
          {Array.from({ length: lines }).map((_, i) => (
            <Bone key={i} {...bone} height={12} radius={6} width={i === lines - 1 ? "58%" : "100%"} delay={0.2 + i * 0.1} />
          ))}
        </div>
      </div>
    );
  } else {
    content = <Bone {...bone} width={width ?? "100%"} height={height ?? 120} radius={radius} />;
  }

  return (
    <div role="status" aria-busy="true" aria-live="polite" className={cn("inline-block max-w-full", className)} style={variant === "rect" || variant === "text" ? { width: width ?? "100%" } : undefined}>
      <span className="sr-only">Loading…</span>
      {content}
    </div>
  );
}
