"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TestimonialLogo {
  brandName: string;
  logoImage?: string;
}

export interface TestimonialLogosProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  trustLabel?: string;
  trustRating?: number;
  logos?: TestimonialLogo[];
  logoSpeed?: number;
  theme?: "dark" | "light";
}

const DEFAULT_LOGOS: TestimonialLogo[] = [
  { brandName: "Northline" },
  { brandName: "Vertex" },
  { brandName: "Orbit" },
  { brandName: "Lumen" },
  { brandName: "Pulse" },
  { brandName: "Cascade" },
];

function Stars({ count, color }: { count: number; color: string }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="18" height="18" viewBox="0 0 24 24" fill={i < count ? color : "rgba(128,128,128,0.25)"} aria-hidden="true">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialLogos({
  trustLabel = "Helped over 180+ teams",
  trustRating = 5,
  logos = DEFAULT_LOGOS,
  logoSpeed = 28,
  theme = "dark",
  className,
  style,
  ...props
}: TestimonialLogosProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = React.useState(false);
  const isDark = theme === "dark";
  const starColor = isDark ? "#FBBF24" : "#F59E0B";
  const trustColor = isDark ? "rgba(244,244,245,0.55)" : "rgba(24,24,27,0.45)";
  const track = [...logos, ...logos];

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className={cn("w-full", className)} style={style} {...props}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
        transition={{ duration: 0.5 }}
        className="flex w-full flex-col items-center gap-3"
      >
      <div className="flex flex-col items-center gap-2">
        <Stars count={trustRating} color={starColor} />
        <span className="text-[13px] font-medium opacity-75" style={{ color: trustColor, fontFamily: "Inter, system-ui, sans-serif" }}>
          {trustLabel}
        </span>
      </div>

      <div
        className="relative w-full max-w-[520px] overflow-hidden"
        style={{ maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)" }}
      >
        <motion.div
          className="flex w-max gap-9"
          animate={isVisible ? { x: ["0%", "-50%"] } : undefined}
          transition={{ x: { duration: logoSpeed, ease: "linear", repeat: Infinity, repeatType: "loop" } }}
        >
          {track.map((logo, i) => (
            <div key={i} className="flex h-6 min-w-[70px] shrink-0 items-center justify-center">
              {logo.logoImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.logoImage}
                  alt={logo.brandName}
                  loading="lazy"
                  className="h-[18px] w-auto max-w-[90px] object-contain opacity-70"
                  style={{ filter: isDark ? "brightness(0) invert(1)" : "none" }}
                />
              ) : (
                <span className="text-[13px] font-semibold tracking-[0.04em] whitespace-nowrap uppercase opacity-55" style={{ color: trustColor, fontFamily: "Inter, system-ui, sans-serif" }}>
                  {logo.brandName}
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
      </motion.div>
    </div>
  );
}
