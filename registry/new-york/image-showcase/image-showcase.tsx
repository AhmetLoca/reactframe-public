"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ImageShowcaseImage {
  src: string;
  alt?: string;
}

export interface ImageShowcaseProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  images?: ImageShowcaseImage[];
  height?: number;
  thumbnailHeight?: number;
  thumbnailGap?: number;
  borderRadius?: number;
  showCounter?: boolean;
  showReset?: boolean;
  accentColor?: string;
}

function ChevronIcon({ direction, color }: { direction: "left" | "right"; color: string }) {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

function ResetIcon({ color }: { color: string }) {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  );
}

export function ImageShowcase({
  images = [],
  height = 700,
  thumbnailHeight = 80,
  thumbnailGap = 8,
  borderRadius = 12,
  showCounter = true,
  showReset = true,
  accentColor = "#ffffff",
  className,
  style,
  ...props
}: ImageShowcaseProps) {
  const [current, setCurrent] = React.useState(0);
  const total = images.length;

  const prev = React.useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);
  const next = React.useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
  const reset = React.useCallback(() => setCurrent(0), []);

  if (total === 0) {
    return (
      <div
        className={cn("flex w-full items-center justify-center bg-[#1a1a1a] font-sans text-sm text-[#666]", className)}
        style={{ height: height + thumbnailHeight + thumbnailGap + 16, borderRadius, ...style }}
        {...props}
      >
        No images connected
      </div>
    );
  }

  const mainImg = images[current];

  return (
    <div className={cn("flex w-full select-none flex-col", className)} style={{ gap: thumbnailGap, ...style }} {...props}>
      <div className="relative w-full shrink-0 overflow-hidden bg-[#111]" style={{ height, borderRadius }}>
        {mainImg?.src ? (
          <img key={current} src={mainImg.src} alt={mainImg.alt ?? `Image ${current + 1}`} className="block h-full w-full object-cover transition-opacity duration-[250ms] ease-[ease]" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#222] font-sans text-sm text-[#555]">No image</div>
        )}

        <button
          onClick={prev}
          aria-label="Previous image"
          className="absolute top-1/2 left-5 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 backdrop-blur-[6px] transition-colors duration-200 ease-[ease] hover:bg-black/75"
        >
          <ChevronIcon direction="left" color={accentColor} />
        </button>
        <button
          onClick={next}
          aria-label="Next image"
          className="absolute top-1/2 right-5 z-10 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/55 backdrop-blur-[6px] transition-colors duration-200 ease-[ease] hover:bg-black/75"
        >
          <ChevronIcon direction="right" color={accentColor} />
        </button>

        {showCounter && (
          <div
            className="absolute top-4 z-10 rounded-full bg-black/55 px-3 py-1 font-sans text-[13px] font-semibold tracking-[0.02em] backdrop-blur-[6px]"
            style={{ right: showReset ? 60 : 16, color: accentColor }}
          >
            {current + 1} / {total}
          </div>
        )}

        {showReset && (
          <button
            onClick={reset}
            title="Reset to first"
            aria-label="Reset to first image"
            className="absolute top-3 right-3.5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/55 backdrop-blur-[6px]"
          >
            <ResetIcon color={accentColor} />
          </button>
        )}
      </div>

      {total > 1 && (
        <div className="flex overflow-x-auto pb-0.5 [scrollbar-width:none]" style={{ gap: thumbnailGap }}>
          {images.map((img, idx) => (
            <div
              key={idx}
              onClick={() => setCurrent(idx)}
              className="shrink-0 cursor-pointer overflow-hidden bg-[#111] transition-[border-color,opacity] duration-200 ease-[ease]"
              style={{
                width: thumbnailHeight * 1.6,
                height: thumbnailHeight,
                borderRadius: borderRadius * 0.6,
                border: idx === current ? `2.5px solid ${accentColor}` : "2.5px solid transparent",
                opacity: idx === current ? 1 : 0.65,
              }}
            >
              {img?.src ? (
                <img src={img.src} alt={img.alt ?? `Thumb ${idx + 1}`} className="block h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full bg-[#333]" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
