"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type CompareSliderTheme = "paper" | "glass";
export type CompareSliderDirection = "horizontal" | "vertical";

export interface CompareSliderProps {
  theme?: CompareSliderTheme;
  direction?: CompareSliderDirection;
  beforeImage?: string;
  afterImage?: string;
  beforeImagePosition?: string;
  afterImagePosition?: string;
  showLabels?: boolean;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  accentColor?: string;
  className?: string;
}

function clamp(v: number) {
  return Math.min(100, Math.max(0, v));
}

export function CompareSlider({
  theme = "paper",
  direction = "horizontal",
  beforeImage,
  afterImage,
  beforeImagePosition = "50% 50%",
  afterImagePosition = "50% 50%",
  showLabels = true,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  accentColor = "#c44b2b",
  className,
}: CompareSliderProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const isGlass = theme === "glass";
  const isVertical = direction === "vertical";

  const [position, setPosition] = React.useState(() => clamp(initialPosition));
  const [dragging, setDragging] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const draggingRef = React.useRef(false);

  React.useEffect(() => {
    if (!draggingRef.current) setPosition(clamp(initialPosition));
  }, [initialPosition]);

  const positionFromEvent = React.useCallback(
    (clientX: number, clientY: number) => {
      const track = trackRef.current;
      if (!track) return 0;
      const rect = track.getBoundingClientRect();
      const pct = isVertical ? ((clientY - rect.top) / rect.height) * 100 : ((clientX - rect.left) / rect.width) * 100;
      return clamp(pct);
    },
    [isVertical],
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    draggingRef.current = true;
    setDragging(true);
    setPosition(positionFromEvent(e.clientX, e.clientY));
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setPosition(positionFromEvent(e.clientX, e.clientY));
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    setDragging(false);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  React.useEffect(() => {
    if (!dragging) return;
    const handleUp = () => {
      draggingRef.current = false;
      setDragging(false);
    };
    document.addEventListener("pointerup", handleUp);
    document.addEventListener("pointercancel", handleUp);
    return () => {
      document.removeEventListener("pointerup", handleUp);
      document.removeEventListener("pointercancel", handleUp);
    };
  }, [dragging]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (isVertical) {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setPosition((p) => clamp(p - step));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setPosition((p) => clamp(p + step));
      }
    } else {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setPosition((p) => clamp(p - step));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setPosition((p) => clamp(p + step));
      }
    }
    if (e.key === "Home") {
      e.preventDefault();
      setPosition(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      setPosition(100);
    }
  };

  const safePosition = Math.max(2, position);
  const clipTransition = dragging ? "none" : `${isVertical ? "height" : "width"} 150ms ease`;

  return (
    <div
      className={cn(
        "relative flex w-full items-center justify-center p-6 sm:p-12",
        !isGlass && "bg-[#0e0e0e] text-[#f5f4f1]",
        isGlass && "text-[#f5f4f1]",
        className,
      )}
      style={{
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
        ...(isGlass && {
          backgroundColor: "rgba(14,14,14,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(245,244,241,0.08)",
        }),
      }}
    >
      <div
        ref={trackRef}
        role="slider"
        aria-label="Before/after comparison position"
        aria-valuenow={Math.round(position)}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onKeyDown={handleKeyDown}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "relative h-full w-full max-w-[900px] touch-none overflow-hidden rounded border border-[#f5f4f1]/8 bg-[#f5f4f1]/[0.04] outline-none select-none",
          dragging ? "cursor-grabbing" : isVertical ? "cursor-ns-resize" : "cursor-ew-resize",
        )}
      >
        {afterImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={afterImage}
            alt="After"
            draggable={false}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: afterImagePosition }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-xs opacity-30">After</div>
        )}

        {/* Before — clipped to the slider position. The image is scaled beyond
            the clip boundary so the visible region never distorts as the
            divider moves. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ ...(isVertical ? { height: `${position}%`, width: "100%" } : { width: `${position}%`, height: "100%" }), transition: clipTransition }}
        >
          {beforeImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={beforeImage}
              alt="Before"
              draggable={false}
              className="pointer-events-none absolute inset-0 max-w-none object-cover"
              style={{
                objectPosition: beforeImagePosition,
                ...(isVertical
                  ? { width: "100%", height: position > 0 ? `${(100 / safePosition) * 100}%` : "100%" }
                  : { width: position > 0 ? `${(100 / safePosition) * 100}%` : "100%", height: "100%" }),
              }}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-[#f5f4f1]/[0.04] text-xs opacity-30"
              style={isVertical ? { height: position > 0 ? `${(100 / safePosition) * 100}%` : "100%" } : { width: position > 0 ? `${(100 / safePosition) * 100}%` : "100%" }}
            >
              Before
            </div>
          )}
        </div>

        <div
          className="pointer-events-none absolute bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.15)]"
          style={isVertical ? { left: 0, right: 0, top: `${position}%`, height: 2, marginTop: -1 } : { top: 0, bottom: 0, left: `${position}%`, width: 2, marginLeft: -1 }}
        />

        <div
          className="pointer-events-none absolute flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.25)] transition-transform duration-200"
          style={{
            ...(isVertical ? { top: `${position}%`, left: "50%", marginTop: -18, marginLeft: -18 } : { top: "50%", left: `${position}%`, marginLeft: -18, marginTop: -18 }),
            border: focused ? `2px solid ${accentColor}` : "1px solid rgba(0,0,0,0.1)",
            transform: dragging ? "scale(1.08)" : "scale(1)",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" stroke="#0d0d0d" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" fill="none" style={{ transform: isVertical ? "rotate(90deg)" : "none" }}>
            <path d="M9 6 L4 12 L9 18 M15 6 L20 12 L15 18" />
          </svg>
        </div>

        {showLabels && beforeLabel && (
          <div
            className="absolute top-3 left-3 z-10 rounded-full border border-[#f5f4f1]/8 px-2.5 py-1 text-[11px] font-semibold tracking-widest uppercase backdrop-blur-sm"
            style={{ background: isGlass ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.72)", color: isGlass ? "#fff" : "#0d0d0d", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            {beforeLabel}
          </div>
        )}
        {showLabels && afterLabel && (
          <div
            className={cn("absolute z-10 rounded-full border border-[#f5f4f1]/8 px-2.5 py-1 text-[11px] font-semibold tracking-widest uppercase backdrop-blur-sm", isVertical ? "bottom-3 left-3" : "top-3 right-3")}
            style={{ background: isGlass ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.72)", color: isGlass ? "#fff" : "#0d0d0d", fontFamily: "'Helvetica Neue', Arial, sans-serif" }}
          >
            {afterLabel}
          </div>
        )}
      </div>

          </div>
  );
}
