"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AnimatedLoaderVariant = "lines" | "ring" | "dual-ring" | "dots";

export interface AnimatedLoaderProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  variant?: AnimatedLoaderVariant;
  lineCount?: 8 | 12;
  color?: string;
  trackColor?: string;
  background?: string;
  size?: number;
  thickness?: number;
  speed?: number;
}

function LinesLoader({ count, color, size, thickness, speed }: { count: number; color: string; size: number; thickness: number; speed: number }) {
  const barHeight = size * 0.26;
  const radius = size / 2 - barHeight / 2 - 2;

  return (
    <motion.div style={{ position: "relative", width: size, height: size }} animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: "linear" }}>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        const opacity = 1 - (i / count) * 0.82;
        return (
          <div
            key={i}
            className="absolute top-1/2 left-1/2"
            style={{ width: thickness, height: barHeight, borderRadius: thickness, backgroundColor: color, opacity, transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-${radius}px)` }}
          />
        );
      })}
    </motion.div>
  );
}

function RingLoader({ color, trackColor, size, thickness, speed }: { color: string; trackColor: string; size: number; thickness: number; speed: number }) {
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * 0.26;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={thickness} />
      </svg>
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: "linear" }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash}`} />
        </svg>
      </motion.div>
    </div>
  );
}

function DualRingLoader({ color, size, thickness, speed }: { color: string; size: number; thickness: number; speed: number }) {
  const outerR = (size - thickness) / 2;
  const innerR = Math.max(outerR - thickness * 2.4, thickness);
  const outerC = 2 * Math.PI * outerR;
  const innerC = 2 * Math.PI * innerR;
  const outerDash = outerC * 0.28;
  const innerDash = innerC * 0.28;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <motion.div className="absolute inset-0" animate={{ rotate: 360 }} transition={{ duration: speed, repeat: Infinity, ease: "linear" }}>
        <svg width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={outerR} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${outerDash} ${outerC - outerDash}`} />
        </svg>
      </motion.div>
      <motion.div className="absolute inset-0" animate={{ rotate: -360 }} transition={{ duration: speed * 0.75, repeat: Infinity, ease: "linear" }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={innerR}
            fill="none"
            stroke={color}
            strokeOpacity={0.35}
            strokeWidth={Math.max(thickness * 0.7, 1.5)}
            strokeLinecap="round"
            strokeDasharray={`${innerDash} ${innerC - innerDash}`}
          />
        </svg>
      </motion.div>
    </div>
  );
}

function DotsLoader({ color, size, thickness, speed }: { color: string; size: number; thickness: number; speed: number }) {
  const dotSize = thickness * 2.4;
  const gap = dotSize * 0.85;
  const duration = speed * 0.6;

  return (
    <div className="flex items-center justify-center" style={{ width: size, height: size, gap }}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="rounded-full"
          style={{ width: dotSize, height: dotSize, backgroundColor: color }}
          animate={{ y: [0, -dotSize * 1.1, 0], opacity: [0.35, 1, 0.35] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: i * (duration / 3) }}
        />
      ))}
    </div>
  );
}

function renderLoader(variant: AnimatedLoaderVariant, color: string, trackColor: string, size: number, thickness: number, speed: number, lineCount: number) {
  switch (variant) {
    case "ring":
      return <RingLoader color={color} trackColor={trackColor} size={size} thickness={thickness} speed={speed} />;
    case "dual-ring":
      return <DualRingLoader color={color} size={size} thickness={thickness} speed={speed} />;
    case "dots":
      return <DotsLoader color={color} size={size} thickness={thickness} speed={speed} />;
    default:
      return <LinesLoader count={lineCount} color={color} size={size} thickness={thickness} speed={speed} />;
  }
}

export function AnimatedLoader({
  variant = "lines",
  lineCount = 8,
  color = "#7c3aed",
  trackColor = "#e5e7eb",
  background = "rgba(0,0,0,0)",
  size = 56,
  thickness = 4,
  speed = 1.2,
  className,
  style,
  ...props
}: AnimatedLoaderProps) {
  return (
    <div className={cn("inline-flex items-center justify-center", className)} style={{ backgroundColor: background, ...style }} {...props}>
      {renderLoader(variant, color, trackColor, size, thickness, speed, lineCount)}
    </div>
  );
}
