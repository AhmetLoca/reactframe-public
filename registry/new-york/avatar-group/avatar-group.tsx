"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AvatarGroupSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarGroupShape = "circle" | "rounded";

export interface AvatarGroupUser {
  name: string;
  src?: string;
}

export interface AvatarGroupProps {
  users?: AvatarGroupUser[];
  max?: number;
  size?: AvatarGroupSize | number;
  shape?: AvatarGroupShape;
  overlap?: number;
  expandOnHover?: boolean;
  showTooltip?: boolean;
  theme?: "dark" | "light";
  onOverflowClick?: () => void;
  className?: string;
}

const SIZE_PX: Record<AvatarGroupSize, number> = { xs: 24, sm: 32, md: 44, lg: 56, xl: 72 };
const FALLBACK_COLORS = ["#87FFE3", "#F2A841", "#FF7A6B", "#8FB8FF", "#B8A6FF", "#F59EC5", "#C4F26B"];

const DEFAULT_USERS: AvatarGroupUser[] = [
  { name: "Ada Lovelace" },
  { name: "Grace Hopper" },
  { name: "Alan Turing" },
  { name: "Katherine Johnson" },
  { name: "Margaret Hamilton" },
  { name: "Linus Torvalds" },
];

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

function Face({ user, px, radius, cut }: { user: AvatarGroupUser; px: number; radius: string | number; cut: string }) {
  const [failed, setFailed] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [prevSrc, setPrevSrc] = React.useState(user.src);
  if (user.src !== prevSrc) {
    setPrevSrc(user.src);
    setFailed(false);
    setLoaded(false);
  }
  const showImage = Boolean(user.src) && !failed;
  return (
    <span
      className="relative flex items-center justify-center overflow-hidden font-semibold"
      style={{ width: px, height: px, borderRadius: radius, background: showImage && loaded ? "transparent" : FALLBACK_COLORS[hash(user.name) % FALLBACK_COLORS.length], color: "#0A0A0A", fontSize: px * 0.36, fontFamily: "Inter, sans-serif", boxShadow: `0 0 0 ${Math.max(2, px * 0.06)}px ${cut}` }}
    >
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={(el) => {
            if (el?.complete) {
              if (el.naturalWidth > 0) setLoaded(true);
              else setFailed(true);
            }
          }}
          src={user.src}
          alt={user.name}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s ease" }}
        />
      )}
      {(!showImage || !loaded) && initialsOf(user.name)}
    </span>
  );
}

export function AvatarGroup({ users = DEFAULT_USERS, max = 4, size = "md", shape = "circle", overlap = 0.2, expandOnHover = true, showTooltip = true, theme = "dark", onOverflowClick, className }: AvatarGroupProps) {
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const cut = theme === "dark" ? "#0E0E0E" : "#FFFFFF";
  const radius = shape === "circle" ? "50%" : px * 0.28;
  const visible = users.slice(0, max);
  const extra = users.length - visible.length;
  const [groupHover, setGroupHover] = React.useState(false);
  const [hoverIdx, setHoverIdx] = React.useState<number | null>(null);
  const gap = -px * overlap;
  const spread = expandOnHover && groupHover ? gap * 0.35 : gap;
  const tipBg = theme === "dark" ? "#F5F4F1" : "#0A0A0A";
  const tipText = theme === "dark" ? "#0A0A0A" : "#F5F4F1";

  return (
    <div
      role="group"
      aria-label={`${users.length} people`}
      className={cn("inline-flex items-center", className)}
      style={{ padding: 4 }}
      onMouseEnter={() => setGroupHover(true)}
      onMouseLeave={() => {
        setGroupHover(false);
        setHoverIdx(null);
      }}
    >
      {visible.map((user, i) => (
        <motion.div
          key={`${user.name}-${i}`}
          className="relative"
          style={{ zIndex: hoverIdx === i ? visible.length + 2 : visible.length - i }}
          animate={{ marginLeft: i === 0 ? 0 : spread, y: hoverIdx === i ? -4 : 0, scale: hoverIdx === i ? 1.08 : 1 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          onMouseEnter={() => setHoverIdx(i)}
          onMouseLeave={() => setHoverIdx(null)}
          title={showTooltip ? undefined : user.name}
        >
          <Face user={user} px={px} radius={radius} cut={cut} />
          <AnimatePresence>
            {showTooltip && hoverIdx === i && (
              <motion.span
                className="pointer-events-none absolute left-1/2 rounded-md font-semibold whitespace-nowrap"
                style={{ bottom: "100%", marginBottom: 8, x: "-50%", padding: "4px 8px", background: tipBg, color: tipText, fontSize: 12, fontFamily: "Inter, sans-serif", zIndex: 50 }}
                initial={{ opacity: 0, y: 4, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.14 }}
              >
                {user.name}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {extra > 0 && (
        <motion.button
          type="button"
          aria-label={`${extra} more`}
          onClick={onOverflowClick}
          className="relative flex shrink-0 items-center justify-center border-none font-semibold outline-none focus-visible:ring-2"
          style={{ zIndex: 0, width: px, height: px, borderRadius: radius, cursor: onOverflowClick ? "pointer" : "default", background: theme === "dark" ? "#1C1C1C" : "#F0F0F0", color: theme === "dark" ? "rgba(245,244,241,0.75)" : "rgba(10,10,10,0.65)", fontSize: px * 0.34, fontFamily: "Inter, sans-serif", boxShadow: `0 0 0 ${Math.max(2, px * 0.06)}px ${cut}` }}
          animate={{ marginLeft: spread }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          whileHover={onOverflowClick ? { scale: 1.06 } : undefined}
        >
          +{extra}
        </motion.button>
      )}
    </div>
  );
}
