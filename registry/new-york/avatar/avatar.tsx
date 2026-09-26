"use client";

import * as React from "react";
import { motion } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
export type AvatarStatus = "online" | "offline" | "busy" | "away";

export interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize | number;
  shape?: AvatarShape;
  status?: AvatarStatus;
  pulse?: boolean;
  ring?: boolean;
  ringColor?: string;
  theme?: "dark" | "light";
  color?: string;
  onClick?: () => void;
  className?: string;
}

const SIZE_PX: Record<AvatarSize, number> = { xs: 24, sm: 32, md: 44, lg: 56, xl: 80 };

const FALLBACK_COLORS = ["#87FFE3", "#F2A841", "#FF7A6B", "#8FB8FF", "#B8A6FF", "#F59EC5", "#C4F26B"];

const STATUS_COLORS: Record<"dark" | "light", Record<AvatarStatus, string>> = {
  dark: { online: "#87FFE3", offline: "#7A7A7A", busy: "#FF7A6B", away: "#F2A841" },
  light: { online: "#0E9F80", offline: "#9A9A9A", busy: "#E5484D", away: "#D9822B" },
};

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function PersonIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.6" />
      <path d="M4.8 20c.9-3.6 3.7-5.6 7.2-5.6s6.3 2 7.2 5.6" />
    </svg>
  );
}

export function Avatar({ src, alt, name, size = "md", shape = "circle", status, pulse = false, ring = false, ringColor = "#F2A841", theme = "dark", color, onClick, className }: AvatarProps) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [prevSrc, setPrevSrc] = React.useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setFailed(false);
    setLoaded(false);
  }
  const showImage = Boolean(src) && !failed;
  const bg = color ?? (name ? FALLBACK_COLORS[hash(name) % FALLBACK_COLORS.length] : theme === "dark" ? "rgba(255,255,255,0.1)" : "rgba(10,10,10,0.08)");
  const fg = color ? "#0A0A0A" : name ? "#0A0A0A" : theme === "dark" ? "rgba(245,244,241,0.6)" : "rgba(10,10,10,0.5)";
  const radius = shape === "circle" ? "50%" : shape === "rounded" ? px * 0.28 : px * 0.08;
  const cut = theme === "dark" ? "#0E0E0E" : "#FFFFFF";
  const dot = Math.max(8, Math.round(px * 0.27));
  const interactive = Boolean(onClick);
  const Tag = interactive ? motion.button : motion.span;

  return (
    <Tag
      {...(interactive ? { type: "button" as const, onClick } : {})}
      role={showImage ? undefined : "img"}
      aria-label={alt ?? name ?? "Avatar"}
      className={cn("relative inline-flex shrink-0 select-none border-none bg-transparent p-0 outline-none", interactive && "cursor-pointer focus-visible:ring-2", className)}
      style={{ width: px, height: px, ["--tw-ring-color" as string]: ringColor }}
      whileHover={interactive ? { scale: 1.06 } : undefined}
      whileTap={interactive ? { scale: 0.95 } : undefined}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
    >
      <span
        className="relative flex h-full w-full items-center justify-center overflow-hidden font-semibold"
        style={{
          borderRadius: radius,
          background: showImage && loaded ? "transparent" : bg,
          color: fg,
          fontSize: px * 0.38,
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.01em",
          boxShadow: ring ? `0 0 0 2px ${cut}, 0 0 0 ${2 + Math.max(2, px * 0.05)}px ${ringColor}` : undefined,
          transition: "box-shadow 0.2s ease",
        }}
      >
        {showImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            ref={(el) => {
              if (el?.complete) {
                if (el.naturalWidth > 0) setLoaded(true);
                else setFailed(true);
              }
            }}
            src={src}
            alt={alt ?? name ?? ""}
            draggable={false}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
          />
        ) : null}
        {(!showImage || !loaded) && (name ? <span>{initialsOf(name)}</span> : <PersonIcon size={px * 0.56} />)}
      </span>

      {status && (
        <span className="absolute" style={{ right: shape === "circle" ? px * 0.02 : -dot * 0.15, bottom: shape === "circle" ? px * 0.02 : -dot * 0.15, width: dot, height: dot }} aria-label={status}>
          {pulse && status === "online" && (
            <motion.span className="absolute inset-0 rounded-full" style={{ background: STATUS_COLORS[theme][status] }} animate={{ scale: [1, 2.3], opacity: [0.5, 0] }} transition={{ duration: 1.6, ease: "easeOut", repeat: Infinity }} />
          )}
          <span className="absolute inset-0 rounded-full" style={{ background: STATUS_COLORS[theme][status], boxShadow: `0 0 0 ${Math.max(2, dot * 0.2)}px ${cut}` }} />
        </span>
      )}
    </Tag>
  );
}
