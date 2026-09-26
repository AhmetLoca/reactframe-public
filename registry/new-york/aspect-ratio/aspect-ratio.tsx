"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AspectRatioPreset = "square" | "video" | "portrait" | "wide" | "golden";
export type AspectRatioObjectFit = "cover" | "contain" | "fill" | "none";

export interface AspectRatioProps {
  /** width / height, e.g. 16 / 9. Overrides `preset` when given. */
  ratio?: number;
  preset?: AspectRatioPreset;
  children?: React.ReactNode;
  /** Applied automatically to a single <img> or <video> child. */
  objectFit?: AspectRatioObjectFit;
  radius?: number;
  bordered?: boolean;
  theme?: "dark" | "light";
  width?: number | string;
  className?: string;
}

const PRESETS: Record<AspectRatioPreset, number> = {
  square: 1,
  video: 16 / 9,
  portrait: 3 / 4,
  wide: 21 / 9,
  golden: 1.618,
};

const PALETTES = {
  dark: { bg: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.1)" },
  light: { bg: "rgba(10,10,10,0.03)", border: "rgba(10,10,10,0.1)" },
};

function isMediaElement(node: React.ReactNode): node is React.ReactElement<{ className?: string }> {
  return React.isValidElement(node) && (node.type === "img" || node.type === "video");
}

export function AspectRatio({
  ratio,
  preset = "video",
  children,
  objectFit = "cover",
  radius = 12,
  bordered = false,
  theme = "dark",
  width,
  className,
}: AspectRatioProps) {
  const p = PALETTES[theme];
  const resolvedRatio = ratio ?? PRESETS[preset];

  const content = isMediaElement(children)
    ? React.cloneElement(children, {
        className: cn("block h-full w-full", `object-${objectFit}`, children.props.className),
      })
    : children;

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{
        width,
        maxWidth: "100%",
        aspectRatio: resolvedRatio,
        borderRadius: radius,
        background: children ? undefined : p.bg,
        border: bordered ? `1px solid ${p.border}` : undefined,
      }}
    >
      {content}
    </div>
  );
}
