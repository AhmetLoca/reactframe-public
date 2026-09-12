"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type MotionGalleryAnimation = "blur" | "slide" | "fade" | "scale";

export interface MotionGalleryItem {
  image: string;
  caption?: string;
}

export interface MotionGalleryGridProps extends Omit<React.ComponentPropsWithoutRef<"section">, "children"> {
  items?: MotionGalleryItem[];
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  theme?: "dark" | "light";
  animationType?: MotionGalleryAnimation;
  columns?: number;
  showOverlay?: boolean;
}

const THEMES = {
  dark: { overlayBg: "rgba(12,12,12,0.78)", overlayBorder: "rgba(255,255,255,0.1)", title: "#ffffff", subtitle: "rgba(255,255,255,0.6)", buttonBg: "#ffffff", buttonText: "#121212", imageBg: "rgba(30,30,30,0.6)" },
  light: { overlayBg: "rgba(255,255,255,0.88)", overlayBorder: "rgba(18,18,18,0.08)", title: "#121212", subtitle: "rgba(18,18,18,0.55)", buttonBg: "#121212", buttonText: "#ffffff", imageBg: "rgba(240,240,240,0.8)" },
};

const VARIANTS: Record<MotionGalleryAnimation, Variants> = {
  blur: { hidden: { opacity: 0, y: 20, filter: "blur(10px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)" } },
  slide: { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1 } },
};

const DEFAULT_ITEMS: MotionGalleryItem[] = Array.from({ length: 12 }).map((_, i) => ({
  image: `https://images.unsplash.com/photo-${["1461896836934-ffe607ba8211", "1517649763962-0c623066013b", "1500530855697-b586d89ba3ee", "1518611012118-696072aa579a", "1552674605-db6ffd4facb5", "1571019613454-1cb2f99b2d8b", "1519861531473-9200262188bf", "1517836357463-d25dfeac3438", "1541534741688-6078c6bfb5c5", "1546519638-68e109498ffc", "1483721310020-03333e577078", "1465101162946-4377e57745c3"][i % 12]}?w=600&q=80`,
}));

const NOISE_BG = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
)}")`;

function useContainerWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = React.useState(1100);
  React.useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return width;
}

export function MotionGalleryGrid({
  items = DEFAULT_ITEMS,
  title = "Motion,\nCaptured in Stillness",
  subtitle = "A visual study of speed, discipline, and the athletes who chase both.",
  buttonText = "Explore the Series",
  buttonLink = "#",
  theme = "dark",
  animationType = "fade",
  columns = 4,
  showOverlay = true,
  className,
  style,
  ...props
}: MotionGalleryGridProps) {
  const t = THEMES[theme];
  const variant = VARIANTS[animationType];
  const titleId = React.useId();
  const rootRef = React.useRef<HTMLElement>(null);
  const containerWidth = useContainerWidth(rootRef);
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth < 900;
  const effectiveColumns = isMobile ? 2 : isTablet ? 3 : columns;
  const titleText = title.replace(/\n/g, " ");

  return (
    <section
      ref={rootRef}
      aria-labelledby={showOverlay ? titleId : undefined}
      aria-label={showOverlay ? undefined : titleText}
      className={cn("relative w-full overflow-hidden", className)}
      style={style}
      {...props}
    >
      <motion.div
        className="grid w-full gap-3 p-3"
        style={{ gridTemplateColumns: `repeat(${effectiveColumns}, 1fr)` }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        transition={{ staggerChildren: 0.06 }}
      >
        {items.map((item, i) => (
          <motion.div
            key={i}
            variants={variant}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-square overflow-hidden rounded-[16px]"
            style={{ background: t.imageBg }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.caption || ""} loading="lazy" className="block h-full w-full object-cover" />
          </motion.div>
        ))}
      </motion.div>

      {showOverlay && (
        <motion.div
          initial={{ ...variant.hidden, x: "-50%", y: "-50%" }}
          whileInView={{ ...variant.show, x: "-50%", y: "-50%" }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className={cn("absolute top-1/2 left-1/2 z-10 flex w-max flex-col items-center gap-4.5 overflow-hidden rounded-[40px] border text-center backdrop-blur-2xl", isMobile ? "max-w-[85%] px-7 py-9" : "max-w-[420px] px-11 py-12")}
          style={{ background: t.overlayBg, borderColor: t.overlayBorder, boxShadow: theme === "dark" ? "0 20px 60px rgba(0,0,0,0.5)" : "0 16px 48px rgba(0,0,0,0.1)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ backgroundImage: NOISE_BG, backgroundSize: "140px 140px", mixBlendMode: "overlay", opacity: theme === "dark" ? 0.07 : 0.04 }}
          />
          <h2 id={titleId} className="m-0 text-[48px] leading-[1.15] font-medium tracking-[-0.03em] whitespace-pre-line" style={{ color: t.title }}>
            {title}
          </h2>
          {subtitle && (
            <p className="m-0 max-w-[320px] text-[15px] leading-[1.5]" style={{ color: t.subtitle }}>
              {subtitle}
            </p>
          )}
          {buttonText && (
            <a
              href={buttonLink}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium tracking-[0.02em] no-underline transition-transform hover:scale-[1.04]"
              style={{ background: t.buttonBg, color: t.buttonText }}
            >
              {buttonText}
            </a>
          )}
        </motion.div>
      )}
    </section>
  );
}
