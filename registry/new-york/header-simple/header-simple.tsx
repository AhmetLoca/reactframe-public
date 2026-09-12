"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface HeaderSimpleNavItem {
  label: string;
  url: string;
}

export interface HeaderSimpleProps extends Omit<React.ComponentPropsWithoutRef<"header">, "children"> {
  logoImage?: string;
  logoText?: string;
  logoUrl?: string;
  logoSize?: number;
  navItems?: HeaderSimpleNavItem[];
  activePage?: string;
  ctaShow?: boolean;
  ctaText?: string;
  ctaUrl?: string;
  ctaBackground?: string;
  ctaTextColor?: string;
  ctaRadius?: number;
  ctaFontSize?: number;
  ctaFontWeight?: number;
  ctaFontFamily?: string;
  backgroundColor?: string;
  borderColor?: string;
  showBorder?: boolean;
  textColor?: string;
  navFontSize?: number;
  navGap?: number;
  horizontalPadding?: number;
  headerHeight?: number;
  desktopBreakpoint?: number;
  mobileBreakpoint?: number;
  menuBackground?: string;
  menuTextColor?: string;
  menuDividerColor?: string;
  hamburgerBackground?: string;
  isSticky?: boolean;
  fontFamily?: string;
}

const PANEL_SPRING = { type: "spring" as const, damping: 30, stiffness: 320, mass: 0.8 };

const DEFAULT_NAV_ITEMS: HeaderSimpleNavItem[] = [
  { label: "Templates", url: "#" },
  { label: "Components", url: "#" },
  { label: "All-Access", url: "#" },
  { label: "Blog", url: "#" },
];

export function HeaderSimple({
  logoImage,
  logoText = "Brand",
  logoUrl = "/",
  logoSize = 28,
  navItems = DEFAULT_NAV_ITEMS,
  activePage = "",
  ctaShow = true,
  ctaText = "Get All Access",
  ctaUrl = "#",
  ctaBackground = "#161616",
  ctaTextColor = "#ffffff",
  ctaRadius = 99,
  ctaFontSize = 14,
  ctaFontWeight = 500,
  ctaFontFamily = "",
  backgroundColor = "#f2f2f2",
  borderColor = "rgba(0,0,0,0.08)",
  showBorder = false,
  textColor = "#161616",
  navFontSize = 15,
  navGap = 32,
  horizontalPadding = 32,
  headerHeight = 72,
  desktopBreakpoint = 900,
  mobileBreakpoint = 540,
  menuBackground = "#ffffff",
  menuTextColor = "#161616",
  menuDividerColor = "rgba(0,0,0,0.08)",
  hamburgerBackground = "rgba(0,0,0,0.06)",
  isSticky = false,
  fontFamily = "Manrope, sans-serif",
  className,
  style,
  ...props
}: HeaderSimpleProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [hoveredNav, setHoveredNav] = React.useState<number | null>(null);

  const wrapRef = React.useRef<HTMLElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(1200);

  React.useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setContainerWidth(el.getBoundingClientRect().width);
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const isDesktop = containerWidth >= desktopBreakpoint;
  const isMobile = containerWidth < mobileBreakpoint;
  const isTablet = !isDesktop && !isMobile;

  const showInlineNav = isDesktop;
  const showInlineCTA = isDesktop || isTablet;
  const showHamburger = !isDesktop;

  const close = React.useCallback(() => {
    setIsOpen(false);
    setHoveredNav(null);
  }, []);

  React.useEffect(() => {
    if (!isDesktop) return;
    const t = setTimeout(close, 0);
    return () => clearTimeout(t);
  }, [isDesktop, close]);

  const isActive = (item: HeaderSimpleNavItem) => activePage !== "" && (item.url === activePage || item.label === activePage);

  const ctaButton = (
    <motion.a
      href={ctaUrl || "#"}
      onClick={close}
      whileHover={{ opacity: 0.88 }}
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="inline-flex h-[42px] items-center rounded-full whitespace-nowrap no-underline select-none"
      style={{ background: ctaBackground, color: ctaTextColor, padding: "0 22px", borderRadius: ctaRadius, fontSize: ctaFontSize, fontWeight: ctaFontWeight, fontFamily: ctaFontFamily || "inherit", letterSpacing: -0.1 }}
    >
      {ctaText}
    </motion.a>
  );

  return (
    <header
      ref={wrapRef}
      className={cn("w-full", isSticky ? "sticky top-0 z-[1000]" : "relative", className)}
      style={{ fontFamily, ...style }}
      {...props}
    >
      <div
        className="relative z-[2] box-border flex items-center justify-between"
        style={{ height: headerHeight, padding: `0 ${horizontalPadding}px`, background: backgroundColor, borderBottom: showBorder ? `1px solid ${borderColor}` : "none" }}
      >
        <a href={logoUrl || "/"} onClick={close} className="flex shrink-0 items-center gap-2.5 no-underline">
          {logoImage && <img src={logoImage} alt={logoText || ""} className="block w-auto" style={{ height: logoSize }} />}
          {logoText && (
            <span className="leading-none font-bold select-none" style={{ fontSize: 18, color: textColor, letterSpacing: -0.3 }}>
              {logoText}
            </span>
          )}
        </a>

        {showInlineNav && (
          <nav className="absolute left-1/2 flex -translate-x-1/2 items-center" style={{ gap: navGap }}>
            {navItems.map((item, i) => {
              const active = isActive(item);
              return (
                <a
                  key={i}
                  href={item.url || "#"}
                  onMouseEnter={() => setHoveredNav(i)}
                  onMouseLeave={() => setHoveredNav(null)}
                  className="flex items-center gap-1.5 whitespace-nowrap no-underline transition-opacity duration-150 ease-[ease] select-none"
                  style={{ fontSize: navFontSize, fontWeight: active ? 700 : 500, color: textColor, opacity: hoveredNav === i ? 0.7 : 1 }}
                >
                  {active && <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: textColor }} />}
                  {item.label}
                </a>
              );
            })}
          </nav>
        )}

        <div className="flex shrink-0 items-center gap-3">
          {showInlineCTA && ctaShow && ctaText && ctaButton}

          {showHamburger && (
            <motion.button
              onClick={() => setIsOpen((o) => !o)}
              whileTap={{ scale: 0.88 }}
              transition={{ duration: 0.12 }}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              className="relative flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full border-none outline-none"
              style={{ background: hamburgerBackground }}
            >
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 0 : -3.5 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="absolute block h-[1.5px] w-[18px] rounded-[2px]"
                style={{ background: textColor }}
              />
              <motion.span
                animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? 0 : 3.5 }}
                transition={{ type: "spring", damping: 22, stiffness: 300 }}
                className="absolute block h-[1.5px] w-[18px] rounded-[2px]"
                style={{ background: textColor }}
              />
            </motion.button>
          )}
        </div>
      </div>

      {showHamburger && (
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={PANEL_SPRING}
          className="relative z-[1] overflow-hidden"
          style={{ background: menuBackground }}
        >
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col"
                style={{ padding: `8px ${horizontalPadding}px 20px` }}
              >
                {navItems.map((item, i) => {
                  const active = isActive(item);
                  return (
                    <a
                      key={i}
                      href={item.url || "#"}
                      onClick={close}
                      className="flex items-center gap-2 py-3 no-underline select-none"
                      style={{
                        fontSize: navFontSize + 1,
                        fontWeight: active ? 700 : 500,
                        color: menuTextColor,
                        borderBottom: i < navItems.length - 1 ? `1px solid ${menuDividerColor}` : "none",
                      }}
                    >
                      {active && <span className="h-[5px] w-[5px] shrink-0 rounded-full" style={{ background: menuTextColor }} />}
                      {item.label}
                    </a>
                  );
                })}

                {!showInlineCTA && ctaShow && ctaText && <div className="mt-4">{ctaButton}</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </header>
  );
}
