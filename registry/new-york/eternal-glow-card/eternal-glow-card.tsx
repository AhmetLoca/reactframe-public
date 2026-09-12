"use client";

import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type EternalGlowCardTheme = "dark" | "warm" | "navy" | "rose" | "custom";
export type EternalGlowCardBadgePosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface EternalGlowCardProps {
  image?: string;
  title?: string;
  titleSize?: number;
  description?: string;
  showDescription?: boolean;
  price?: string;
  showPrice?: boolean;
  buttonText?: string;
  href?: string;
  showBadge?: boolean;
  badgeText?: string;
  badgePosition?: EternalGlowCardBadgePosition;
  theme?: EternalGlowCardTheme;
  customOverlayColor?: string;
  overlayOpacity?: number;
  blurAmount?: number;
  className?: string;
}

const THEMES: Record<Exclude<EternalGlowCardTheme, "custom">, { gradient: string; badgeBg: string; badgeColor: string; btnBg: string; btnColor: string }> = {
  dark: { gradient: "linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.58) 100%)", badgeBg: "rgba(255,255,255,0.18)", badgeColor: "#ffffff", btnBg: "#ffffff", btnColor: "#111111" },
  warm: { gradient: "linear-gradient(to bottom, rgba(101,67,33,0.08) 0%, rgba(101,67,33,0.62) 100%)", badgeBg: "rgba(255,220,170,0.28)", badgeColor: "#fff5e6", btnBg: "#f5deb3", btnColor: "#5c3a1e" },
  navy: { gradient: "linear-gradient(to bottom, rgba(15,30,60,0.08) 0%, rgba(15,30,60,0.65) 100%)", badgeBg: "rgba(100,150,255,0.22)", badgeColor: "#e0eaff", btnBg: "#dce8ff", btnColor: "#0f1e3c" },
  rose: { gradient: "linear-gradient(to bottom, rgba(160,50,80,0.08) 0%, rgba(160,50,80,0.58) 100%)", badgeBg: "rgba(255,180,200,0.22)", badgeColor: "#fff0f4", btnBg: "#ffd6e0", btnColor: "#7a1530" },
};

const CUSTOM_THEME_UI = { badgeBg: "rgba(255,255,255,0.18)", badgeColor: "#ffffff", btnBg: "#ffffff", btnColor: "#111111" };

const BADGE_POS: Record<EternalGlowCardBadgePosition, React.CSSProperties> = {
  "top-left": { top: 20, left: 20 },
  "top-right": { top: 20, right: 20 },
  "bottom-left": { bottom: 20, left: 20 },
  "bottom-right": { bottom: 20, right: 20 },
};

function hexToRgb(hex: string) {
  const h = (hex || "#000000").replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function buildGradient(theme: EternalGlowCardTheme, customColor: string, opacity: number) {
  if (theme === "custom") {
    const [r, g, b] = hexToRgb(customColor);
    const lo = opacity / 100;
    return `linear-gradient(to bottom, rgba(${r},${g},${b},${lo * 0.25}) 0%, rgba(${r},${g},${b},${lo}) 100%)`;
  }
  return THEMES[theme].gradient.replace(/rgba\((\d+),(\d+),(\d+),([\d.]+)\) 100%/, (_m, r, g, b) => `rgba(${r},${g},${b},${opacity / 100}) 100%`);
}

const stagger = (i: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: { duration: 0.36, delay: 0.03 + i * 0.055, ease: [0.25, 0.46, 0.45, 0.94] as const },
});

export function EternalGlowCard({
  image = "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800",
  title = "Eternal Glow",
  titleSize = 36,
  description = "Unveil your natural radiance with our vitamin-rich serums designed to hydrate and illuminate.",
  showDescription = true,
  price = "$48.00",
  showPrice = true,
  buttonText = "Shop the Glow",
  href,
  showBadge = true,
  badgeText = "New",
  badgePosition = "top-right",
  theme = "dark",
  customOverlayColor = "#000000",
  overlayOpacity = 55,
  blurAmount = 12,
  className,
}: EternalGlowCardProps) {
  const [hovered, setHovered] = React.useState(false);
  const [tapped, setTapped] = React.useState(false);
  const [isTouch, setIsTouch] = React.useState(false);

  React.useEffect(() => {
    setIsTouch(window.matchMedia("(hover: none) and (pointer: coarse)").matches);
  }, []);

  const active = hovered || tapped;
  const themeUi = theme === "custom" ? CUSTOM_THEME_UI : THEMES[theme];
  const gradient = buildGradient(theme, customOverlayColor, overlayOpacity);

  const handleCardClick = () => {
    if (href && !isTouch) {
      window.open(href, "_blank", "noopener");
      return;
    }
    if (isTouch) setTapped((v) => !v);
  };

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden rounded-3xl select-none", href && !isTouch ? "cursor-pointer" : "cursor-default", className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
    >
      <motion.img
        src={image}
        alt={title}
        animate={{ scale: active ? 1.06 : 1 }}
        transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="block h-full w-full object-cover"
      />

      {showBadge && badgeText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute z-10 rounded-full border border-white/22 px-3.5 py-1.5 text-[11px] font-bold tracking-[0.07em] uppercase backdrop-blur-sm"
          style={{ ...BADGE_POS[badgePosition], background: themeUi.badgeBg, color: themeUi.badgeColor }}
        >
          {badgeText}
        </motion.div>
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.36, ease: "easeOut" }}
            className="absolute inset-0"
            style={{ backdropFilter: `blur(${blurAmount}px)`, WebkitBackdropFilter: `blur(${blurAmount}px)`, background: gradient }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <motion.div key="content" className="absolute inset-0 flex flex-col justify-end gap-2.5 px-8 pt-9 pb-9">
            <motion.h2 {...stagger(0)} className="m-0 leading-[1.1] font-bold tracking-[-0.4px] text-white" style={{ fontSize: titleSize }}>
              {title}
            </motion.h2>

            {showPrice && price && (
              <motion.span {...stagger(1)} className="m-0 text-lg font-semibold text-white/95">
                {price}
              </motion.span>
            )}

            {showDescription && description && (
              <motion.p {...stagger(showPrice && price ? 2 : 1)} className="m-0 max-w-[340px] text-[15px] leading-[1.55] text-white/82">
                {description}
              </motion.p>
            )}

            <motion.button
              {...stagger(3)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="mt-2 flex items-center gap-2 self-start rounded-full border-none px-6.5 py-3.5 text-sm font-bold tracking-[0.01em]"
              style={{ background: themeUi.btnBg, color: themeUi.btnColor }}
            >
              {buttonText}
              <motion.span animate={{ x: active ? 3 : 0 }} transition={{ duration: 0.28 }} className="text-[17px]">
                →
              </motion.span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

          </div>
  );
}
