"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type SalesTicketTheme = "dark" | "light" | "gradient" | "neon" | "outline";
export type SalesTicketCorner = "bottom-right" | "bottom-left" | "top-right" | "top-left";
export type SalesTicketTrigger = "immediate" | "delay" | "scroll";
export type SalesTicketAnimationStyle = "slide" | "scale" | "bounce";

export interface SalesTicketPopupProps {
  fixed?: boolean;
  emoji?: string;
  kicker?: string;
  badgeText?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  onButtonClick?: () => void;
  onClose?: () => void;
  theme?: SalesTicketTheme;
  accent?: string;
  radius?: number;
  texture?: boolean;
  corner?: SalesTicketCorner;
  offsetX?: number;
  offsetY?: number;
  maxWidth?: number;
  trigger?: SalesTicketTrigger;
  delaySeconds?: number;
  scrollPercent?: number;
  animationStyle?: SalesTicketAnimationStyle;
  dismissible?: boolean;
  autoHide?: boolean;
  autoHideSeconds?: number;
  rememberDismiss?: boolean;
  dismissKey?: string;
  className?: string;
}

interface Palette {
  outerBg: string;
  outerStrong: string;
  outerMuted: string;
  outerTexture: string;
  outerBorder?: string;
  innerBg: string;
  innerText: string;
  innerTexture: string;
  innerBorder?: string;
  stubBg: string;
  stubText: string;
  stubBorder?: string;
  buttonBg: string;
  buttonText: string;
  buttonBorder?: string;
  shadow: string;
}

const THEMES: Record<SalesTicketTheme, Palette> = {
  dark: {
    outerBg: "#ffffff",
    outerStrong: "#18181b",
    outerMuted: "#71717a",
    outerTexture: "rgba(0,0,0,0.05)",
    innerBg: "#0b0b0d",
    innerText: "#ffffff",
    innerTexture: "rgba(255,255,255,0.08)",
    stubBg: "#ffffff",
    stubText: "#0b0b0d",
    buttonBg: "#111114",
    buttonText: "#ffffff",
    shadow: "0 24px 60px rgba(0,0,0,0.18), 0 4px 16px rgba(0,0,0,0.08)",
  },
  light: {
    outerBg: "#f4f4f5",
    outerStrong: "#18181b",
    outerMuted: "#71717a",
    outerTexture: "rgba(0,0,0,0.04)",
    innerBg: "#ffffff",
    innerText: "#111114",
    innerTexture: "rgba(0,0,0,0.05)",
    innerBorder: "1px solid rgba(17,17,20,0.08)",
    stubBg: "#111114",
    stubText: "#ffffff",
    buttonBg: "#111114",
    buttonText: "#ffffff",
    shadow: "0 20px 50px rgba(17,17,20,0.12)",
  },
  gradient: {
    outerBg: "#ffffff",
    outerStrong: "#18181b",
    outerMuted: "#71717a",
    outerTexture: "rgba(124,58,237,0.05)",
    innerBg: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
    innerText: "#ffffff",
    innerTexture: "rgba(255,255,255,0.12)",
    stubBg: "#ffffff",
    stubText: "#7c3aed",
    buttonBg: "linear-gradient(135deg, #7c3aed 0%, #db2777 100%)",
    buttonText: "#ffffff",
    shadow: "0 24px 55px rgba(124,58,237,0.25)",
  },
  neon: {
    outerBg: "#0a0f0c",
    outerStrong: "#eafff4",
    outerMuted: "rgba(202,255,228,0.6)",
    outerTexture: "rgba(57,255,138,0.05)",
    innerBg: "#06140d",
    innerText: "#39ff8a",
    innerTexture: "rgba(57,255,138,0.1)",
    stubBg: "#39ff8a",
    stubText: "#06180d",
    buttonBg: "#39ff8a",
    buttonText: "#06180d",
    shadow: "0 0 0 1px rgba(57,255,138,0.25), 0 24px 60px rgba(57,255,138,0.15)",
  },
  outline: {
    outerBg: "#ffffff",
    outerStrong: "#111114",
    outerMuted: "#6b7280",
    outerTexture: "transparent",
    outerBorder: "1.5px solid #111114",
    innerBg: "transparent",
    innerText: "#111114",
    innerTexture: "transparent",
    innerBorder: "1.5px dashed #111114",
    stubBg: "transparent",
    stubText: "#111114",
    stubBorder: "1.5px solid #111114",
    buttonBg: "transparent",
    buttonText: "#111114",
    buttonBorder: "1.5px solid #111114",
    shadow: "0 16px 40px rgba(17,17,20,0.1)",
  },
};

const CORNER_STYLE: Record<SalesTicketCorner, React.CSSProperties> = {
  "bottom-right": { bottom: 0, right: 0 },
  "bottom-left": { bottom: 0, left: 0 },
  "top-right": { top: 0, right: 0 },
  "top-left": { top: 0, left: 0 },
};

const STUB_HEIGHT = 42;

function zigzagPolygon(height: number, teeth = 6, depthPct = 6) {
  const seg = height / (teeth * 2);
  const pts: string[] = ["0% 0px", "100% 0px"];
  for (let i = 1; i < teeth * 2; i++) {
    const x = i % 2 === 1 ? `${100 - depthPct}%` : "100%";
    pts.push(`${x} ${i * seg}px`);
  }
  pts.push(`100% ${height}px`, `0% ${height}px`);
  for (let i = teeth * 2 - 1; i >= 1; i--) {
    const x = i % 2 === 1 ? `${depthPct}%` : "0%";
    pts.push(`${x} ${i * seg}px`);
  }
  return `polygon(${pts.join(",")})`;
}

function renderRichText(text: string, strongColor: string) {
  return text.split(/(\*\*.*?\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} style={{ fontWeight: 800, color: strongColor }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function NoiseTexture({ color }: { color: string }) {
  if (color === "transparent") return null;
  return <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`, backgroundSize: "6px 6px" }} />;
}

function exitOffset(corner: SalesTicketCorner, style: SalesTicketAnimationStyle) {
  if (style === "scale") return { opacity: 0, scale: 0.85 };
  if (style === "bounce") return { opacity: 0, y: 40, scale: 0.9 };
  const isLeft = corner.includes("left");
  const isTop = corner.includes("top");
  return { opacity: 0, x: isLeft ? -60 : 60, y: isTop ? -10 : 10 };
}

function enterTransition(style: SalesTicketAnimationStyle) {
  if (style === "bounce") return { type: "spring" as const, stiffness: 320, damping: 16, mass: 0.9 };
  if (style === "scale") return { type: "spring" as const, stiffness: 260, damping: 22 };
  return { type: "spring" as const, stiffness: 240, damping: 26 };
}

function TicketCard({
  emoji,
  kicker,
  badgeText,
  description,
  buttonLabel,
  accent,
  radius,
  texture,
  palette,
  onClose,
  onButtonClick,
  buttonHref,
  dismissible,
  maxWidth,
}: {
  emoji: string;
  kicker: string;
  badgeText: string;
  description: string;
  buttonLabel: string;
  accent: string;
  radius: number;
  texture: boolean;
  palette: Palette;
  onClose: () => void;
  onButtonClick?: () => void;
  buttonHref?: string;
  dismissible: boolean;
  maxWidth: number;
}) {
  const stubBg = accent || palette.stubBg;
  const buttonBg = accent || palette.buttonBg;

  const handleClick = () => {
    onButtonClick?.();
    if (buttonHref) window.open(buttonHref, "_blank");
  };

  return (
    <div
      className="relative overflow-hidden p-3.5"
      style={{
        width: maxWidth,
        borderRadius: radius,
        background: palette.outerBg,
        boxShadow: palette.shadow,
        border: palette.outerBorder,
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Roboto, sans-serif",
      }}
    >
      {texture && <NoiseTexture color={palette.outerTexture} />}

      {dismissible && (
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-2.5 right-2.5 z-[2] flex h-6 w-6 items-center justify-center rounded-full border-none bg-[rgba(127,127,127,0.18)] text-xs leading-none"
          style={{ color: palette.outerStrong }}
        >
          ✕
        </button>
      )}

      <div className="relative z-[1] overflow-hidden px-4.5 pt-6.5 pb-7.5" style={{ borderRadius: Math.max(radius - 8, 8), background: palette.innerBg, border: palette.innerBorder }}>
        {texture && <NoiseTexture color={palette.innerTexture} />}

        <div className="relative z-[1] flex items-center justify-center gap-2 text-[26px] font-extrabold tracking-[1px] uppercase" style={{ color: palette.innerText }}>
          {emoji && <span className="text-[22px]">{emoji}</span>}
          {kicker}
        </div>

        <div
          className="relative z-[1] mx-auto mt-3.5 flex items-center justify-center text-sm font-extrabold whitespace-nowrap"
          style={{ width: "64%", height: STUB_HEIGHT, background: stubBg, border: palette.stubBorder, clipPath: zigzagPolygon(STUB_HEIGHT), color: palette.stubText, letterSpacing: 0.3 }}
        >
          {badgeText}
        </div>
      </div>

      <div className="relative z-[1] px-2 pt-4.5 pb-1.5 text-center">
        <div className="mb-4 text-[13.5px] leading-[1.5]" style={{ color: palette.outerMuted }}>
          {renderRichText(description, palette.outerStrong)}
        </div>
        <button onClick={handleClick} className="w-full rounded-full border-none px-[26px] py-[11px] text-[13.5px] font-bold" style={{ background: buttonBg, color: palette.buttonText, border: palette.buttonBorder }}>
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}

export function SalesTicketPopup({
  fixed = true,
  emoji = "",
  kicker = "SALE",
  badgeText = "30% OFF",
  description = "Checkout to enjoy **30% off** your order.",
  buttonLabel = "Buy Now",
  buttonHref = "",
  onButtonClick,
  onClose,
  theme = "dark",
  accent = "",
  radius = 26,
  texture = true,
  corner = "bottom-right",
  offsetX = 24,
  offsetY = 24,
  maxWidth = 270,
  trigger = "delay",
  delaySeconds = 2,
  scrollPercent = 50,
  animationStyle = "slide",
  dismissible = true,
  autoHide = false,
  autoHideSeconds = 8,
  rememberDismiss = false,
  dismissKey = "sales-ticket-dismissed",
  className,
}: SalesTicketPopupProps) {
  const [visible, setVisible] = React.useState(!fixed);
  const [dismissed, setDismissed] = React.useState(false);

  const handleClose = React.useCallback(() => {
    setVisible(false);
    onClose?.();
    if (rememberDismiss) window.localStorage.setItem(dismissKey, "1");
  }, [onClose, rememberDismiss, dismissKey]);

  React.useEffect(() => {
    if (!fixed) return;

    if (rememberDismiss && window.localStorage.getItem(dismissKey) === "1") {
      const id = setTimeout(() => setDismissed(true), 0);
      return () => clearTimeout(id);
    }

    if (trigger === "immediate") {
      const id = setTimeout(() => setVisible(true), 0);
      return () => clearTimeout(id);
    }

    if (trigger === "delay") {
      const t = setTimeout(() => setVisible(true), delaySeconds * 1000);
      return () => clearTimeout(t);
    }

    if (trigger === "scroll") {
      const handler = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const pct = max > 0 ? (window.scrollY / max) * 100 : 100;
        if (pct >= scrollPercent) {
          setVisible(true);
          window.removeEventListener("scroll", handler);
        }
      };
      window.addEventListener("scroll", handler);
      return () => window.removeEventListener("scroll", handler);
    }
  }, [fixed, trigger, delaySeconds, scrollPercent, rememberDismiss, dismissKey]);

  React.useEffect(() => {
    if (!fixed || !visible || !autoHide) return;
    const t = setTimeout(handleClose, autoHideSeconds * 1000);
    return () => clearTimeout(t);
  }, [fixed, visible, autoHide, autoHideSeconds, handleClose]);

  const palette = THEMES[theme];

  if (!fixed) {
    return (
      <div className={cn("inline-block", className)}>
        <TicketCard
          emoji={emoji}
          kicker={kicker}
          badgeText={badgeText}
          description={description}
          buttonLabel={buttonLabel}
          accent={accent}
          radius={radius}
          texture={texture}
          palette={palette}
          onClose={() => {}}
          onButtonClick={onButtonClick}
          buttonHref={buttonHref}
          dismissible={dismissible}
          maxWidth={maxWidth}
        />
      </div>
    );
  }

  if (dismissed) return null;

  return (
    <div className={cn("fixed z-[9999] pointer-events-none", className)} style={{ ...CORNER_STYLE[corner], margin: `${offsetY}px ${offsetX}px` }}>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="pointer-events-auto"
            initial={exitOffset(corner, animationStyle)}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={exitOffset(corner, animationStyle)}
            transition={enterTransition(animationStyle)}
          >
            <TicketCard
              emoji={emoji}
              kicker={kicker}
              badgeText={badgeText}
              description={description}
              buttonLabel={buttonLabel}
              accent={accent}
              radius={radius}
              texture={texture}
              palette={palette}
              onClose={handleClose}
              onButtonClick={onButtonClick}
              buttonHref={buttonHref}
              dismissible={dismissible}
              maxWidth={maxWidth}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
