"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type DividerOrientation = "horizontal" | "vertical";
export type DividerVariant = "solid" | "dashed" | "dotted" | "gradient";
export type DividerLabelPosition = "start" | "center" | "end";

export interface DividerProps {
  orientation?: DividerOrientation;
  variant?: DividerVariant;
  label?: React.ReactNode;
  labelPosition?: DividerLabelPosition;
  thickness?: number;
  spacing?: number;
  accent?: boolean;
  accentColor?: string;
  animated?: boolean;
  theme?: "dark" | "light";
  className?: string;
}

const PALETTES = {
  dark: { line: "rgba(255,255,255,0.14)", text: "rgba(245,244,241,0.5)" },
  light: { line: "rgba(10,10,10,0.16)", text: "rgba(10,10,10,0.5)" },
};

export function Divider({ orientation = "horizontal", variant = "solid", label, labelPosition = "center", thickness = 1, spacing = 16, accent = false, accentColor = "#F2A841", animated = false, theme = "dark", className }: DividerProps) {
  const p = PALETTES[theme];
  const vertical = orientation === "vertical";
  const color = accent ? accentColor : p.line;

  const dotRadius = Math.max(1.2, thickness * 0.75);
  const dotTile = Math.ceil(dotRadius * 2 + 1);
  const lineBackground = (side: "start" | "end" | "full"): string => {
    const dir = vertical ? "to bottom" : "to right";
    if (variant === "dashed") return `repeating-linear-gradient(${dir}, ${color} 0 7px, transparent 7px 12px)`;
    if (variant === "dotted") return `radial-gradient(circle at center, ${color} ${dotRadius}px, transparent ${dotRadius + 0.6}px)`;
    if (variant === "gradient") {
      const solid = accent ? accentColor : theme === "dark" ? "rgba(255,255,255,0.32)" : "rgba(10,10,10,0.3)";
      if (side === "start") return `linear-gradient(${dir}, transparent, ${solid})`;
      if (side === "end") return `linear-gradient(${dir}, ${solid}, transparent)`;
      return `linear-gradient(${dir}, transparent, ${solid}, transparent)`;
    }
    return color;
  };

  const renderLine = (side: "start" | "end" | "full", origin: string, flex: number) => (
    <motion.span
      key={side}
      aria-hidden="true"
      className="block"
      style={{
        flex,
        ...(vertical ? { width: variant === "dotted" ? dotTile : thickness, minHeight: 8 } : { height: variant === "dotted" ? dotTile : thickness, minWidth: 8 }),
        borderRadius: variant === "dotted" ? 0 : thickness,
        background: variant === "solid" ? color : undefined,
        backgroundImage: variant === "solid" ? undefined : lineBackground(side),
        ...(variant === "dotted" ? { backgroundSize: vertical ? `${dotTile}px 8px` : `8px ${dotTile}px`, backgroundRepeat: vertical ? "repeat-y" : "repeat-x" } : {}),
        transformOrigin: origin,
      }}
      initial={animated ? (vertical ? { scaleY: 0 } : { scaleX: 0 }) : false}
      whileInView={animated ? (vertical ? { scaleY: 1 } : { scaleX: 1 }) : undefined}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    />
  );

  const labelEl = label ? (
    <span className="shrink-0 font-medium" style={{ color: accent ? accentColor : p.text, fontSize: 12.5, letterSpacing: "0.04em", fontFamily: "Inter, sans-serif", textTransform: typeof label === "string" ? "uppercase" : undefined }}>
      {label}
    </span>
  ) : null;

  const startFlex = labelPosition === "start" ? 0.12 : 1;
  const endFlex = labelPosition === "end" ? 0.12 : 1;

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn("flex items-center", vertical ? "h-full flex-col self-stretch" : "w-full", className)}
      style={{ gap: 14, ...(vertical ? { marginLeft: spacing, marginRight: spacing } : { marginTop: spacing, marginBottom: spacing }) }}
    >
      {label ? (
        <>
          {renderLine("start", vertical ? "bottom" : "right", startFlex)}
          {labelEl}
          {renderLine("end", vertical ? "top" : "left", endFlex)}
        </>
      ) : (
        renderLine("full", vertical ? "top" : "left", 1)
      )}
    </div>
  );
}
