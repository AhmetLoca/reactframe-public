"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface GlassNavItem {
  label: string;
  url: string;
  badge?: string;
}

export interface GlassSocialLink {
  name: string;
  url: string;
}

export interface GlassNavCta {
  text: string;
  url: string;
  background: string;
  color: string;
  height: number;
  width: number;
  paddingX: number;
}

export type GlassNavColorScheme = "auto" | "light" | "dark";

export interface GlassNavigationProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  logoText?: string;
  logoImage?: string;
  logoUrl?: string;
  logoHeight?: number;
  navItems?: GlassNavItem[];
  activePage?: string;
  onNavClick?: (item: GlassNavItem, index: number) => void;
  showCTA?: boolean;
  cta?: GlassNavCta;
  tagline?: string;
  showTagline?: boolean;
  socialLinks?: GlassSocialLink[];
  colorScheme?: GlassNavColorScheme;
  glassBackground?: string;
  glassBorderColor?: string;
  textColor?: string;
  darkGlassBackground?: string;
  darkGlassBorderColor?: string;
  darkTextColor?: string;
  badgeBackground?: string;
  badgeTextColor?: string;
  glassBlur?: number;
  pillBorderRadius?: number;
  panelBorderRadius?: number;
  navFontSize?: number;
  mobileFontSize?: number;
  mobileBreakpoint?: number;
  navbarHeight?: number;
  className?: string;
}

const HEIGHT_SPRING = { type: "spring" as const, damping: 30, stiffness: 320, mass: 0.8 };

const DEFAULT_NAV_ITEMS: GlassNavItem[] = [
  { label: "Home", url: "/" },
  { label: "Work", url: "/work" },
  { label: "Studio", url: "/studio" },
  { label: "Contact", url: "/contact" },
];

const DEFAULT_CTA: GlassNavCta = {
  text: "Get in touch",
  url: "/contact",
  background: "radial-gradient(circle, rgba(255,255,255,0.24) 18%, #FFA220 100%)",
  color: "#ffffff",
  height: 36,
  width: 0,
  paddingX: 18,
};

const DEFAULT_SOCIAL_LINKS: GlassSocialLink[] = [
  { name: "Instagram", url: "" },
  { name: "LinkedIn", url: "" },
  { name: "Twitter / X", url: "" },
];

export function GlassNavigation({
  logoText = "Brand",
  logoImage,
  logoUrl = "/",
  logoHeight = 26,
  navItems = DEFAULT_NAV_ITEMS,
  activePage = "",
  onNavClick,
  showCTA = true,
  cta = DEFAULT_CTA,
  tagline = "Building digital experiences that move people forward.",
  showTagline = true,
  socialLinks = DEFAULT_SOCIAL_LINKS,
  colorScheme = "auto",
  glassBackground = "rgba(255,255,255,0.68)",
  glassBorderColor = "rgba(255,255,255,0.6)",
  textColor = "#111111",
  darkGlassBackground = "rgba(14,14,20,0.85)",
  darkGlassBorderColor = "rgba(255,255,255,0.08)",
  darkTextColor = "#f2f2f2",
  badgeBackground = "#6366f1",
  badgeTextColor = "#ffffff",
  glassBlur = 20,
  pillBorderRadius = 20,
  panelBorderRadius = 28,
  navFontSize = 60,
  mobileFontSize = 36,
  mobileBreakpoint = 560,
  navbarHeight = 68,
  className,
  style,
  ...props
}: GlassNavigationProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredNav, setHoveredNav] = React.useState<number | null>(null);
  const [hoveredSocial, setHoveredSocial] = React.useState<number | null>(null);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(680);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isMobile = containerWidth < mobileBreakpoint;

  const [systemDark, setSystemDark] = React.useState(false);

  React.useEffect(() => {
    if (colorScheme !== "auto") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const t = setTimeout(() => setSystemDark(mq.matches), 0);
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", handler);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", handler);
    };
  }, [colorScheme]);

  const isDark = colorScheme === "dark" || (colorScheme === "auto" && systemDark);

  const bg = isDark ? darkGlassBackground : glassBackground;
  const border = isDark ? darkGlassBorderColor : glassBorderColor;
  const text = isDark ? darkTextColor : textColor;
  const divider = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  const close = React.useCallback(() => {
    setIsOpen(false);
    setHoveredNav(null);
  }, []);

  React.useEffect(() => {
    if (isOpen && panelRef.current) panelRef.current.focus();
  }, [isOpen]);

  const handleNavClick = React.useCallback(
    (item: GlassNavItem, index: number, e: React.MouseEvent<HTMLAnchorElement>) => {
      onNavClick?.(item, index);
      if (item.url?.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(item.url);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      close();
    },
    [onNavClick, close],
  );

  const isActive = (item: GlassNavItem) => activePage !== "" && (item.url === activePage || item.label === activePage);

  const glassStyle: React.CSSProperties = {
    background: bg,
    backdropFilter: `blur(${glassBlur}px) saturate(190%)`,
    WebkitBackdropFilter: `blur(${glassBlur}px) saturate(190%)`,
    border: `1px solid ${border}`,
  };

  const items = navItems;
  const socials = socialLinks;

  const hPad = isMobile ? "0 16px" : "0 24px";
  const cPad = isMobile ? "4px 18px 28px" : "4px 32px 36px";
  const fontSize = isMobile ? mobileFontSize : navFontSize;
  const letterSpacing = isMobile ? -0.5 : -2;
  const arrowSize = isMobile ? 20 : 26;

  return (
    <div ref={wrapRef} className={cn("relative w-full", className)} style={{ height: navbarHeight, ...style }} {...props}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={close}
            className="fixed inset-0 z-[99997]"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{
          borderRadius: isOpen ? panelBorderRadius : pillBorderRadius,
          boxShadow: isOpen
            ? isDark
              ? "0 20px 72px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.3)"
              : "0 20px 72px rgba(0,0,0,0.14), 0 4px 20px rgba(0,0,0,0.07)"
            : isDark
              ? "0 2px 24px rgba(0,0,0,0.4)"
              : "0 2px 24px rgba(0,0,0,0.07)",
        }}
        transition={{
          borderRadius: { type: "spring", damping: 32, stiffness: 360 },
          boxShadow: { duration: 0.42, ease: [0.16, 1, 0.3, 1] },
        }}
        className="absolute top-0 right-0 left-0 z-[99998] overflow-hidden"
        style={{ ...glassStyle, borderRadius: pillBorderRadius }}
      >
        <div className="box-border flex shrink-0 items-center justify-between" style={{ height: navbarHeight, padding: hPad }}>
          <a href={logoUrl || "/"} className="flex items-center gap-2.5 no-underline" onClick={close}>
            {logoImage && <img src={logoImage} alt={logoText || ""} className="block h-auto" style={{ height: logoHeight }} />}
            {logoText && (
              <span className="leading-none font-bold select-none" style={{ fontSize: 18, color: text, letterSpacing: -0.3 }}>
                {logoText}
              </span>
            )}
          </a>

          <div className="flex items-center" style={{ gap: isMobile ? 8 : 12 }}>
            {showCTA && cta.text && (
              <motion.a
                href={cta.url || "#"}
                whileHover={{ scale: 1.04, opacity: 0.92 }}
                whileTap={{ scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="box-border flex shrink-0 items-center justify-center leading-none font-semibold select-none no-underline"
                style={{
                  background: cta.background,
                  color: cta.color,
                  height: cta.height,
                  width: cta.width > 0 ? cta.width : "auto",
                  paddingLeft: cta.paddingX,
                  paddingRight: cta.paddingX,
                  borderRadius: 99,
                  fontSize: isMobile ? 12 : 13,
                  letterSpacing: -0.2,
                }}
              >
                {cta.text}
              </motion.a>
            )}

            <motion.button
              onClick={() => setIsOpen((o) => !o)}
              whileTap={{ scale: 0.86 }}
              transition={{ duration: 0.12 }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="relative flex h-[38px] w-[38px] shrink-0 items-center justify-center border-none bg-transparent p-2 outline-none"
            >
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -3.5 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="absolute block h-[1.5px] w-[22px] rounded-[2px]"
                style={{ background: text }}
              />
              <motion.span
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 3.5 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="absolute block h-[1.5px] w-[22px] rounded-[2px]"
                style={{ background: text }}
              />
            </motion.button>
          </div>
        </div>

        <motion.div initial={false} animate={{ height: isOpen ? "auto" : 0 }} transition={HEIGHT_SPRING} className="overflow-hidden">
          <div ref={panelRef} tabIndex={-1} onKeyDown={(e) => e.key === "Escape" && close()} className="outline-none" aria-hidden={!isOpen}>
            <motion.div
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: isOpen ? 0.22 : 0.1, delay: isOpen ? 0.05 : 0, ease: "easeOut" }}
            >
              <div className="h-px" style={{ background: divider, margin: isMobile ? "0 18px" : "0 32px" }} />

              <div className="flex" style={{ flexDirection: isMobile ? "column" : "row", padding: cPad }}>
                <div className="flex flex-col" style={{ flex: isMobile ? "none" : "0 0 62%", paddingRight: isMobile ? 0 : 32 }}>
                  {items.map((item, i) => {
                    const active = isActive(item);
                    const dimmed = hoveredNav !== null && hoveredNav !== i;

                    return (
                      <div key={`nav-${i}`}>
                        <motion.div
                          animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 20 }}
                          transition={{
                            opacity: { duration: isOpen ? 0.3 : 0.1, delay: isOpen ? 0.08 + i * 0.055 : 0, ease: "easeOut" },
                            y: { type: "spring", damping: 26, stiffness: 280, delay: isOpen ? 0.08 + i * 0.055 : 0 },
                          }}
                        >
                          <a
                            href={item.url || "#"}
                            onClick={(e) => handleNavClick(item, i, e)}
                            onMouseEnter={() => setHoveredNav(i)}
                            onMouseLeave={() => setHoveredNav(null)}
                            tabIndex={isOpen ? 0 : -1}
                            className="flex items-center justify-between no-underline transition-opacity duration-[180ms] ease-[ease]"
                            style={{
                              paddingTop: isMobile ? 11 : 15,
                              paddingBottom: isMobile ? 11 : 15,
                              opacity: dimmed ? (active ? 0.5 : 0.22) : 1,
                            }}
                          >
                            <span className="flex min-w-0 items-center gap-2.5">
                              {active && <span className="mb-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: text }} />}
                              <span
                                className="leading-[1.08] select-none"
                                style={{ fontSize, fontWeight: active ? 700 : 600, color: text, letterSpacing }}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className="mb-0.5 shrink-0 self-center rounded-full font-bold tracking-wide select-none"
                                  style={{
                                    fontSize: isMobile ? 9 : 10,
                                    background: badgeBackground,
                                    color: badgeTextColor,
                                    padding: "3px 8px",
                                    lineHeight: 1.4,
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </span>

                            <motion.span
                              animate={{ opacity: hoveredNav === i ? 1 : 0, x: hoveredNav === i ? 0 : -10 }}
                              transition={{ duration: 0.16, ease: "easeOut" }}
                              className="shrink-0 leading-none"
                              style={{ fontSize: arrowSize, color: text }}
                            >
                              ↗
                            </motion.span>
                          </a>
                        </motion.div>

                        {i < items.length - 1 && <div className="h-px" style={{ background: divider }} />}
                      </div>
                    );
                  })}
                </div>

                <div
                  className="flex flex-col justify-between"
                  style={{
                    flex: isMobile ? "none" : 1,
                    paddingTop: isMobile ? 0 : 20,
                    paddingLeft: isMobile ? 0 : 32,
                    borderLeft: isMobile ? "none" : `1px solid ${divider}`,
                    borderTop: isMobile ? `1px solid ${divider}` : "none",
                    marginTop: isMobile ? 4 : 0,
                  }}
                >
                  {showTagline && tagline && (
                    <motion.p
                      animate={{ opacity: isOpen ? 0.65 : 0, y: isOpen ? 0 : 10 }}
                      transition={{ duration: isOpen ? 0.34 : 0.1, delay: isOpen ? 0.14 : 0, ease: [0.22, 1, 0.36, 1] }}
                      className="m-0 font-normal"
                      style={{
                        fontSize: isMobile ? 14 : 17,
                        lineHeight: 1.6,
                        color: text,
                        maxWidth: isMobile ? "100%" : 280,
                        padding: isMobile ? "16px 0 14px" : "0",
                      }}
                    >
                      {tagline}
                    </motion.p>
                  )}

                  {socials.length > 0 && (
                    <motion.div animate={{ opacity: isOpen ? 1 : 0 }} transition={{ duration: isOpen ? 0.32 : 0.1, delay: isOpen ? 0.22 : 0 }}>
                      <div className="h-px" style={{ background: divider }} />
                      {socials.map((link, i) => (
                        <div key={`social-${i}`}>
                          <a
                            href={link.url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={isOpen ? 0 : -1}
                            onMouseEnter={() => setHoveredSocial(i)}
                            onMouseLeave={() => setHoveredSocial(null)}
                            className="flex items-center justify-between font-normal no-underline transition-opacity duration-[180ms] ease-[ease]"
                            style={{
                              paddingTop: isMobile ? 9 : 11,
                              paddingBottom: isMobile ? 9 : 11,
                              color: text,
                              fontSize: isMobile ? 14 : 15,
                              opacity: hoveredSocial !== null && hoveredSocial !== i ? 0.32 : 1,
                            }}
                          >
                            <span className="select-none">{link.name}</span>
                            <motion.span
                              animate={{ opacity: hoveredSocial === i ? 1 : 0, x: hoveredSocial === i ? 0 : -6 }}
                              transition={{ duration: 0.15 }}
                              className="text-[13px]"
                            >
                              ↗
                            </motion.span>
                          </a>
                          <div className="h-px" style={{ background: divider }} />
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
