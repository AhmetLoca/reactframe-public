"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface QrCodeWidgetProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  title?: string;
  description?: string;
  hintText?: string;
  buttonText?: string;
  qrImage?: string;
  linkUrl?: string;
  asPopup?: boolean;
  position?: "center" | "bottom-right" | "bottom-left";
  theme?: "dark" | "light";
  maxWidth?: number;
  cardRadius?: number;
}

export function QrCodeWidget({
  title = "Scan to Connect",
  description = "Share this page, a menu, or any link in a camera-friendly format.",
  hintText = "Point your camera here",
  buttonText = "Open link",
  qrImage = "",
  linkUrl = "https://example.com",
  asPopup = false,
  position = "center",
  theme = "dark",
  maxWidth = 340,
  cardRadius = 20,
  className,
  style,
  ...props
}: QrCodeWidgetProps) {
  const uid = React.useId();
  const [popupOpen, setPopupOpen] = React.useState(false);
  const isDark = theme === "dark";

  const cardBg = isDark ? "rgba(20, 20, 24, 0.92)" : "#ffffff";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const titleColor = isDark ? "#f4f4f5" : "#18181b";
  const descColor = isDark ? "rgba(244,244,245,0.65)" : "rgba(24,24,27,0.65)";
  const hintColor = isDark ? "rgba(244,244,245,0.5)" : "rgba(24,24,27,0.5)";
  const buttonBg = "#3b82f6";
  const buttonColor = "#ffffff";
  const closeColor = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)";

  const cardContent = (
    <>
      <h2 id={`${uid}-title`} className="m-0 mb-2 text-center text-xl font-bold" style={{ color: titleColor, fontFamily: "Inter, system-ui, sans-serif" }}>
        {title}
      </h2>
      <p className="m-0 mb-6 text-center text-sm leading-[1.5] opacity-90" style={{ color: descColor, fontFamily: "Inter, system-ui, sans-serif" }}>
        {description}
      </p>

      <div className="mb-4 flex justify-center">
        <div className="flex h-[200px] w-[200px] items-center justify-center overflow-hidden rounded-[14px] border" style={{ borderColor: cardBorder, background: isDark ? "rgba(255,255,255,0.03)" : "#ffffff" }}>
          {qrImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={qrImage} alt={`QR code for ${title}`} className="h-full w-full object-contain p-3" />
          ) : (
            <div className="p-5 text-center text-[13px]" style={{ color: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)" }}>
              Upload QR image
            </div>
          )}
        </div>
      </div>

      <p className="m-0 mb-5 text-center text-[13px] opacity-75" style={{ color: hintColor, fontFamily: "Inter, system-ui, sans-serif" }}>
        {hintText}
      </p>

      <motion.a
        href={linkUrl || undefined}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={linkUrl ? `${buttonText} (opens in a new tab)` : buttonText}
        aria-disabled={!linkUrl}
        onClick={(e) => {
          if (!linkUrl) e.preventDefault();
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="box-border flex h-[46px] w-full items-center justify-center rounded-[12px] border-none text-sm font-semibold no-underline"
        style={{ background: buttonBg, color: buttonColor, cursor: linkUrl ? "pointer" : "default", opacity: linkUrl ? 1 : 0.5, fontFamily: "Inter, system-ui, sans-serif" }}
      >
        {buttonText}
      </motion.a>
    </>
  );

  const cardBox = (
    <div
      className="relative border p-7 backdrop-blur-[20px]"
      style={{ background: cardBg, borderColor: cardBorder, borderRadius: cardRadius, boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.45)" : "0 20px 60px rgba(0,0,0,0.1)", fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {cardContent}
    </div>
  );

  if (!asPopup) {
    return (
      <div className={cn("flex w-full justify-center", className)} style={style} {...props}>
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: "100%", maxWidth }}
        >
          {cardBox}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn("relative w-full", className)} style={style} {...props}>
      <div className={cn("flex", position === "center" ? "justify-center" : position === "bottom-left" ? "justify-start" : "justify-end")}>
        <motion.button
          type="button"
          aria-label={`Open ${title}`}
          onClick={() => setPopupOpen(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex cursor-pointer items-center gap-2.5 rounded-full border py-2 pr-4.5 pl-2 backdrop-blur-[20px]"
          style={{ background: cardBg, borderColor: cardBorder, boxShadow: isDark ? "0 12px 32px rgba(0,0,0,0.4)" : "0 12px 32px rgba(0,0,0,0.12)", fontFamily: "system-ui, -apple-system, sans-serif" }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ background: buttonBg }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <rect x="1" y="1" width="6" height="6" rx="1" fill={buttonColor} />
              <rect x="11" y="1" width="6" height="6" rx="1" fill={buttonColor} />
              <rect x="1" y="11" width="6" height="6" rx="1" fill={buttonColor} />
              <rect x="11" y="11" width="6" height="6" rx="1" fill={buttonColor} />
            </svg>
          </span>
          <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: titleColor }}>
            {title}
          </span>
        </motion.button>
      </div>

      <AnimatePresence>
        {popupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setPopupOpen(false);
            }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-5"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={`${uid}-title`}
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === "Escape") setPopupOpen(false);
              }}
              initial={{ opacity: 0, scale: 0.94, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full"
              style={{ maxWidth }}
            >
              <div className="relative border p-7 backdrop-blur-[20px]" style={{ background: cardBg, borderColor: cardBorder, borderRadius: cardRadius, boxShadow: isDark ? "0 20px 60px rgba(0,0,0,0.45)" : "0 20px 60px rgba(0,0,0,0.1)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setPopupOpen(false)}
                  className="absolute top-3.5 right-3.5 flex h-7 w-7 items-center justify-center rounded-[8px] border-none bg-transparent opacity-60"
                  style={{ color: closeColor }}
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                    <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                {cardContent}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
