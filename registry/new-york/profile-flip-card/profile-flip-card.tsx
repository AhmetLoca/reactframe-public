"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ProfileFlipCardTransition = "flipY" | "flipX" | "spring" | "fade";

export interface ProfileFlipCardProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  src?: string;
  name?: string;
  role?: string;
  bio?: string;
  accentColor?: string;
  bgBack?: string;
  nameColorFront?: string;
  nameColorBack?: string;
  roleColorFront?: string;
  roleColorBack?: string;
  bioColor?: string;
  animationSpeed?: number;
  tag?: string;
  tagColor?: string;
  tagBg?: string;
  borderRadius?: number;
  borderColor?: string;
  flipOnHover?: boolean;
  flipTransition?: ProfileFlipCardTransition;
}

function useContainerWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = React.useState(9999);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

export function ProfileFlipCard({
  src,
  name = "Takahashi Aya",
  role = "CEO, Pentaclay",
  bio = "I'm focused on growing my brand, improving my products, and finding smarter ways to market and package my work. I'm driven, curious, and committed to turning my design skills into something bigger.",
  accentColor = "#cccccc",
  bgBack = "#ffffff",
  nameColorFront = "#ffffff",
  nameColorBack = "#0a0a0a",
  roleColorFront = "#ffffff",
  roleColorBack = "#0a0a0a",
  bioColor = "#333333",
  animationSpeed = 0.7,
  tag = "",
  tagColor = "#0a0a0a",
  tagBg = "#ffffff",
  borderRadius = 20,
  borderColor = "rgba(0,0,0,0.08)",
  flipOnHover = false,
  flipTransition = "flipY",
  className,
  ...props
}: ProfileFlipCardProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerWidth = useContainerWidth(containerRef);
  const isMobile = containerWidth <= 480;

  // Whether hover flips the card is about input capability, not layout
  // width — a mouse user viewing this at a narrow width should still get
  // hover, while a touchscreen shouldn't get "stuck" hover from a tap.
  const [canHover, setCanHover] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const [flipped, setFlipped] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const touchStartX = React.useRef(0);
  const touchStartY = React.useRef(0);

  const rNameSizeFront = isMobile ? 22 : 26;
  const rNameSizeBack = isMobile ? 16 : 18;
  const rBioSize = isMobile ? 13 : 14;

  const is3D = flipTransition !== "fade";
  const flipAxis = flipTransition === "flipX" ? "rotateX" : "rotateY";

  const flipEasing: Record<string, string> = React.useMemo(
    () => ({
      flipY: `transform ${animationSpeed}s cubic-bezier(0.77,0,0.175,1)`,
      flipX: `transform ${animationSpeed}s cubic-bezier(0.77,0,0.175,1)`,
      spring: `transform ${animationSpeed * 1.6}s cubic-bezier(0.34,1.56,0.64,1)`,
    }),
    [animationSpeed],
  );

  const frontStyle: React.CSSProperties = is3D
    ? { position: "absolute", inset: 0, borderRadius, overflow: "hidden", outline: `1px solid ${borderColor}`, outlineOffset: "-1px", backfaceVisibility: "hidden" }
    : {
        position: "absolute",
        inset: 0,
        borderRadius,
        overflow: "hidden",
        outline: `1px solid ${borderColor}`,
        outlineOffset: "-1px",
        opacity: flipped ? 0 : 1,
        transition: "opacity 0.5s ease",
        zIndex: 2,
        pointerEvents: flipped ? "none" : "auto",
      };

  const backStyle: React.CSSProperties = is3D
    ? {
        position: "absolute",
        inset: 0,
        borderRadius,
        overflow: "hidden",
        background: bgBack,
        outline: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        backfaceVisibility: "hidden",
        transform: `${flipAxis}(180deg)`,
      }
    : {
        position: "absolute",
        inset: 0,
        borderRadius,
        overflow: "hidden",
        background: bgBack,
        outline: `1px solid ${borderColor}`,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        opacity: flipped ? 1 : 0,
        transition: "opacity 0.5s ease",
        zIndex: 1,
        pointerEvents: flipped ? "auto" : "none",
      };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape" && flipped) setFlipped(false);
      }}
      className={cn("flex h-full w-full items-stretch gap-3 outline-none", isMobile ? "flex-col" : "flex-row", className)}
      {...props}
    >
      <div
        className="order-1 flex-1 cursor-pointer"
        style={{ perspective: is3D ? "1200px" : "none" }}
        onClick={() => {
          if (!canHover) return;
          if (!flipOnHover) setFlipped((f) => !f);
        }}
        onMouseEnter={() => {
          if (canHover) {
            setHovered(true);
            if (flipOnHover) setFlipped(true);
          }
        }}
        onMouseLeave={() => {
          if (canHover) {
            setHovered(false);
            if (flipOnHover) setFlipped(false);
          }
        }}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
          touchStartY.current = e.touches[0].clientY;
        }}
        onTouchEnd={(e) => {
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          const dy = e.changedTouches[0].clientY - touchStartY.current;
          if ((Math.abs(dx) > 40 && Math.abs(dy) < 60) || (Math.abs(dx) < 10 && Math.abs(dy) < 10)) setFlipped((f) => !f);
        }}
      >
        <div
          className="relative h-full w-full"
          style={{
            transformStyle: is3D ? "preserve-3d" : "flat",
            transform: is3D ? (flipped ? `${flipAxis}(180deg)` : `${flipAxis}(0deg)`) : "none",
            transition: is3D ? flipEasing[flipTransition] || flipEasing.flipY : "none",
          }}
        >
          {/* Front */}
          <div style={{ ...frontStyle, ...(is3D ? { opacity: flipped ? 0 : 1, transition: `opacity 0s ${animationSpeed / 2}s` } : {}) }}>
            {src && (
              <img
                src={src}
                alt={name}
                className="absolute inset-0 block h-full w-full object-cover"
                style={{
                  transform: hovered && !flipped ? "scale(1.06)" : "scale(1)",
                  filter: hovered && !flipped ? "blur(6px) brightness(0.75)" : "blur(0px) brightness(1)",
                  transition: "transform 0.6s ease, filter 0.4s ease",
                }}
              />
            )}
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
            {tag && (
              <div
                className="absolute top-4 left-4 z-10 rounded-full text-[10px] font-semibold tracking-[0.12em] uppercase"
                style={{ padding: "4px 10px", background: tagBg, color: tagColor }}
              >
                {tag}
              </div>
            )}
            <div className="absolute top-1/2 right-0 left-0 z-10 flex -translate-y-1/2 flex-col items-center gap-1.5 px-5">
              <div className="relative flex items-center justify-center">
                <span className="text-center leading-[1.1] font-extrabold tracking-[0.04em] uppercase" style={{ fontSize: rNameSizeFront, color: nameColorFront }}>
                  {name}
                </span>
                {!isMobile && (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 18 18"
                    fill="none"
                    className="absolute -right-6 transition-[opacity,transform] duration-300"
                    style={{ opacity: hovered && !flipped ? 1 : 0, transform: hovered && !flipped ? "translateX(0)" : "translateX(-4px)" }}
                  >
                    <path d="M3 9H15M9 3L15 9L9 15" stroke={nameColorFront} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className="text-center tracking-[0.01em]" style={{ fontSize: isMobile ? 12 : 13, color: roleColorFront, opacity: 0.7 }}>
                {role}
              </span>
              {isMobile && !flipped && (
                <div className="mt-2.5 flex items-center gap-1.5 opacity-50">
                  <svg width="12" height="12" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9H15M9 3L15 9L9 15" stroke={nameColorFront} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-[10px] tracking-[0.08em]" style={{ color: nameColorFront }}>
                    Tap to flip
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Back */}
          <div style={{ ...backStyle, ...(is3D ? { opacity: !flipped ? 0 : 1, transition: `opacity 0s ${animationSpeed / 2}s` } : {}) }}>
            <div
              className="absolute top-4 left-4 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-transform duration-300"
              style={{ background: nameColorBack, transform: hovered && flipped ? "scale(1.12)" : "scale(1)" }}
              onClick={(e) => {
                e.stopPropagation();
                setFlipped(false);
              }}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M15 9H3M9 3L3 9L9 15" stroke={bgBack} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div
              className="relative flex shrink-0 flex-col justify-end overflow-hidden"
              style={{ width: isMobile ? "100%" : "42%", height: isMobile ? "38%" : "100%", background: accentColor, padding: isMobile ? "12px 16px" : "20px 18px" }}
            >
              {src && (
                <div className="absolute inset-0 opacity-35">
                  <img src={src} alt={name} className="h-full w-full object-cover" />
                </div>
              )}
              <div className="relative z-[1]">
                <div className="mb-1 leading-[1.1] font-extrabold tracking-[0.04em] uppercase" style={{ fontSize: rNameSizeBack, color: nameColorBack }}>
                  {name}
                </div>
                <div className="tracking-[0.02em]" style={{ fontSize: 11, color: roleColorBack, opacity: 0.6 }}>
                  {role}
                </div>
              </div>
            </div>

            <div className="relative min-w-0 flex-1 overflow-hidden" style={{ background: bgBack, padding: isMobile ? "14px 16px" : "20px 20px 20px 18px" }}>
              <div className="absolute top-3.5 right-4">
                <svg width="32" height="26" viewBox="0 0 48 40" fill="none">
                  <path d="M0 40V24C0 14 4 6 12 0L16 4C10 8 7 14 7 22H14V40H0ZM26 40V24C26 14 30 6 38 0L42 4C36 8 33 14 33 22H40V40H26Z" fill="#e8e8e8" />
                </svg>
              </div>
              <div
                className="leading-[1.65] tracking-[-0.01em]"
                style={{ fontSize: rBioSize, color: bioColor, display: "-webkit-box", WebkitLineClamp: isMobile ? 4 : 99, WebkitBoxOrient: "vertical", overflow: "hidden" }}
              >
                {bio}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
