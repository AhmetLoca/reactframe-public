"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface StepperStep {
  label: string;
  description?: string;
  error?: boolean;
}

export type StepperOrientation = "horizontal" | "vertical";
export type StepperVariant = "numbered" | "minimal";
export type StepperSize = "sm" | "md" | "lg";

export interface StepperProps {
  steps?: StepperStep[];
  currentStep?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  orientation?: StepperOrientation;
  variant?: StepperVariant;
  size?: StepperSize;
  theme?: "dark" | "light";
  accentColor?: string;
  clickable?: boolean;
  className?: string;
}

const DEFAULT_STEPS: StepperStep[] = [
  { label: "Account", description: "Create your login" },
  { label: "Profile", description: "Tell us about you" },
  { label: "Workspace", description: "Name your team" },
  { label: "Launch", description: "Review and go live" },
];

const PALETTES = {
  dark: { text: "#F5F4F1", muted: "rgba(245,244,241,0.5)", line: "rgba(255,255,255,0.12)", ring: "rgba(255,255,255,0.22)", error: "#FF7A6B" },
  light: { text: "#0A0A0A", muted: "rgba(10,10,10,0.5)", line: "rgba(10,10,10,0.12)", ring: "rgba(10,10,10,0.22)", error: "#E5484D" },
};

const SIZES: Record<StepperSize, { circle: number; font: number; label: number; desc: number; gap: number }> = {
  sm: { circle: 26, font: 12, label: 13, desc: 11.5, gap: 8 },
  md: { circle: 34, font: 14, label: 14.5, desc: 12.5, gap: 10 },
  lg: { circle: 42, font: 16, label: 16, desc: 13.5, gap: 12 },
};

function readableTextOn(hex: string): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? "#0A0A0A" : "#FFFFFF";
}

export function Stepper({ steps = DEFAULT_STEPS, currentStep, defaultStep = 0, onStepChange, orientation = "horizontal", variant = "numbered", size = "md", theme = "dark", accentColor = "#F2A841", clickable = false, className }: StepperProps) {
  const p = PALETTES[theme];
  const s = SIZES[size];
  const [internal, setInternal] = React.useState(defaultStep);
  const isControlled = currentStep !== undefined;
  const current = Math.min(steps.length - 1, Math.max(0, isControlled ? currentStep : internal));
  const vertical = orientation === "vertical";
  const minimal = variant === "minimal";
  const circle = minimal ? Math.round(s.circle * 0.42) : s.circle;
  const onAccent = readableTextOn(accentColor);

  const go = (i: number) => {
    if (!clickable || i === current) return;
    if (!isControlled) setInternal(i);
    onStepChange?.(i);
  };

  return (
    <ol className={cn("m-0 flex list-none p-0", vertical ? "flex-col" : "w-full", className)} style={{ fontFamily: "Inter, sans-serif" }}>
      {steps.map((step, i) => {
        const complete = i < current;
        const active = i === current;
        const color = step.error ? p.error : accentColor;
        const last = i === steps.length - 1;
        const filled = complete && !step.error;

        const circleEl = (
          <span
            className="relative flex shrink-0 items-center justify-center rounded-full font-bold tabular-nums"
            style={{
              width: circle,
              height: circle,
              fontSize: s.font,
              color: filled ? onAccent : step.error ? p.error : active ? color : p.muted,
              background: filled ? color : active || step.error ? `color-mix(in srgb, ${color} 14%, transparent)` : "transparent",
              border: `${minimal ? 2 : 1.5}px solid ${filled || active || step.error ? color : p.ring}`,
              boxShadow: active && !minimal ? `0 0 0 4px color-mix(in srgb, ${color} 18%, transparent)` : "0 0 0 0 transparent",
              transition: "background 0.25s ease, border-color 0.25s ease, color 0.25s ease, box-shadow 0.25s ease",
            }}
          >
            {!minimal && (
              <>
                {filled ? (
                  <svg width={circle * 0.5} height={circle * 0.5} viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <motion.path d="M3 8.2L6.4 11.6L13 4.4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.28, ease: "easeOut" }} />
                  </svg>
                ) : step.error ? (
                  "!"
                ) : (
                  i + 1
                )}
              </>
            )}
            {minimal && active && <motion.span className="absolute rounded-full" style={{ inset: -6, border: `1.5px solid ${color}` }} initial={{ scale: 0.7, opacity: 0.8 }} animate={{ scale: 1.25, opacity: 0 }} transition={{ duration: 1.4, ease: "easeOut", repeat: Infinity }} />}
            {minimal && filled && <span className="block rounded-full" style={{ width: circle * 0.5, height: circle * 0.5, background: onAccent }} />}
          </span>
        );

        const text = (
          <span className={cn("flex flex-col", vertical ? "items-start text-left" : "items-center text-center")} style={{ gap: 2 }}>
            <span className="font-semibold tracking-[-0.01em]" style={{ fontSize: s.label, color: active || complete ? p.text : p.muted, transition: "color 0.25s ease" }}>
              {step.label}
            </span>
            {step.description && (
              <span style={{ fontSize: s.desc, color: p.muted, lineHeight: 1.4 }}>{step.description}</span>
            )}
          </span>
        );

        const body = clickable ? (
          <button type="button" onClick={() => go(i)} aria-current={active ? "step" : undefined} className={cn("flex cursor-pointer border-none bg-transparent p-0 outline-none focus-visible:ring-2 rounded-lg", vertical ? "flex-row items-start" : "flex-col items-center")} style={{ gap: s.gap, ["--tw-ring-color" as string]: accentColor }}>
            {circleEl}
            {text}
          </button>
        ) : (
          <div aria-current={active ? "step" : undefined} className={cn("flex", vertical ? "flex-row items-start" : "flex-col items-center")} style={{ gap: s.gap }}>
            {circleEl}
            {text}
          </div>
        );

        if (vertical) {
          return (
            <li key={i} className="relative flex" style={{ paddingBottom: last ? 0 : 26 }}>
              {body}
              {!last && (
                <span aria-hidden="true" className="absolute overflow-hidden" style={{ left: circle / 2 - 1, top: circle + 6, bottom: 6, width: 2, borderRadius: 2, background: p.line }}>
                  <motion.span key="v" className="block w-full" style={{ background: accentColor, originY: 0, height: "100%" }} initial={false} animate={{ scaleY: complete ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
                </span>
              )}
            </li>
          );
        }

        return (
          <li key={i} className="relative flex flex-1 justify-center">
            {body}
            {!last && (
              <span aria-hidden="true" className="absolute overflow-hidden" style={{ top: circle / 2 - 1, left: `calc(50% + ${circle / 2 + 10}px)`, right: `calc(-50% + ${circle / 2 + 10}px)`, height: 2, borderRadius: 2, background: p.line }}>
                <motion.span key="h" className="block h-full" style={{ background: accentColor, originX: 0, width: "100%" }} initial={false} animate={{ scaleX: complete ? 1 : 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
