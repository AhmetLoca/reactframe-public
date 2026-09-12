"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type LinkedInPostMockupTheme = "light" | "dark";

export interface LinkedInPostMockupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: LinkedInPostMockupTheme;
  borderRadius?: number;
  username?: string;
  headline?: string;
  userAvatar?: string;
  timePosted?: string;
  postText?: string;
  mediaImage?: string;
  likesCount?: number;
  commentsCount?: number;
  repostsCount?: number;
  showCounts?: boolean;
  allowLike?: boolean;
  allowRepost?: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toLocaleString();
}

const LiThumbsUp = ({ filled, size = 20, c = "currentColor" }: { filled: boolean; size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#0a66c2" : "none"} stroke={filled ? "#0a66c2" : c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3v11zm3 0h7.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14V5a3 3 0 0 0-3-3l-4 9v11z" />
  </svg>
);
const LiComment = ({ size = 20, c = "currentColor" }: { size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);
const LiGlobe = ({ size = 12, c = "currentColor" }: { size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);
const LiDots = ({ dark = false }: { dark?: boolean }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill={dark ? "#fff" : "#262626"}>
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);
const LiRepost = ({ size = 26, dark = false, active = false }: { size?: number; dark?: boolean; active?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={active ? "#00ba7c" : dark ? "#fff" : "#262626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const LiSend = ({ size = 26, dark = false }: { size?: number; dark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={dark ? "#fff" : "#262626"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.36 8.175 L19.64 2.825 Q22 2 21.175 4.36 L15.825 19.64 Q15 22 13.985 19.715 L12.015 15.285 Q11 13 8.715 11.985 L4.285 10.015 Q2 9 4.36 8.175 Z" />
    <line x1="22" y1="2" x2="11" y2="13" />
  </svg>
);

function ActionButton({ icon, label, onClick, active, sub }: { icon: React.ReactNode; label: string; onClick?: () => void; active?: boolean; sub: string }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1.5 rounded border-0 bg-transparent px-1 py-2.5 text-sm font-semibold"
      style={{ cursor: onClick ? "pointer" : "default", color: active ? "#0a66c2" : sub }}
    >
      {icon}
      {label}
    </button>
  );
}

export function LinkedInPostMockup({
  theme = "light",
  borderRadius = 8,
  username = "Joshua Json",
  headline = "Product Designer at Framer",
  userAvatar,
  timePosted = "2h",
  postText = "Excited to share that we just launched our new product 🚀 Big thanks to the team for the hard work!",
  mediaImage,
  likesCount = 482,
  commentsCount = 36,
  repostsCount = 8,
  showCounts = true,
  allowLike = true,
  allowRepost = true,
  className,
  style,
  ...props
}: LinkedInPostMockupProps) {
  const [liked, setLiked] = React.useState(false);
  const [reposted, setReposted] = React.useState(false);

  const dark = theme === "dark";
  const bg = dark ? "#1b1f23" : "#fff";
  const text = dark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.9)";
  const sub = dark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const border = dark ? "#38434f" : "#e9e5df";

  const likes = liked ? likesCount + 1 : likesCount;
  const reposts = reposted ? repostsCount + 1 : repostsCount;

  return (
    <div
      className={cn("box-border w-full overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]", className)}
      style={{ background: bg, borderRadius, border: `1px solid ${border}`, ...style }}
      {...props}
    >
      <div className="flex items-start gap-2.5 px-4 pt-3 pb-2">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full" style={{ background: dark ? "#333" : "#ddd" }}>
          {userAvatar && <img src={userAvatar} alt={username} className="block h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold" style={{ color: text }}>
            {username}
          </div>
          {headline && (
            <div className="mt-px text-xs leading-[1.35]" style={{ color: sub }}>
              {headline}
            </div>
          )}
          <div className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: sub }}>
            <span>{timePosted}</span>
            <span>·</span>
            <LiGlobe size={12} c={sub} />
          </div>
        </div>
        <LiDots dark={dark} />
      </div>

      {postText && (
        <div className="px-4 pb-2.5 text-sm leading-[1.5] whitespace-pre-wrap" style={{ color: text }}>
          {postText}
        </div>
      )}

      {mediaImage && <img src={mediaImage} alt="Post media" className="block max-h-[360px] w-full object-cover" />}

      {showCounts && (likes > 0 || commentsCount > 0 || reposts > 0) && (
        <div className="flex items-center justify-between px-4 pt-2.5 pb-2 text-xs" style={{ color: sub }}>
          <div className="flex items-center gap-[5px]">
            {likes > 0 && (
              <>
                <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full" style={{ background: "#0a66c2" }}>
                  <LiThumbsUp filled size={10} />
                </div>
                <span>{fmt(likes)}</span>
              </>
            )}
          </div>
          <div>{[commentsCount > 0 ? `${fmt(commentsCount)} comments` : null, reposts > 0 ? `${fmt(reposts)} reposts` : null].filter(Boolean).join(" · ")}</div>
        </div>
      )}

      <div className="mx-4 h-px" style={{ background: border }} />

      <div className="flex px-2 py-0.5">
        <ActionButton icon={<LiThumbsUp filled={liked} size={18} c={sub} />} label="Like" active={liked} onClick={() => allowLike && setLiked((v) => !v)} sub={sub} />
        <ActionButton icon={<LiComment size={18} c={sub} />} label="Comment" sub={sub} />
        <ActionButton icon={<LiRepost size={18} dark={dark} />} label="Repost" active={reposted} onClick={() => allowRepost && setReposted((v) => !v)} sub={sub} />
        <ActionButton icon={<LiSend size={18} dark={dark} />} label="Send" sub={sub} />
      </div>
    </div>
  );
}
