"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type XPostMockupTheme = "dark" | "light";

export interface XPostMockupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: XPostMockupTheme;
  borderRadius?: number;
  username?: string;
  handle?: string;
  userAvatar?: string;
  showVerified?: boolean;
  tweetText?: string;
  mediaImage?: string;
  likesCount?: number;
  retweetsCount?: number;
  repliesCount?: number;
  viewsCount?: number;
  timePosted?: string;
  datePosted?: string;
  allowLike?: boolean;
  allowRetweet?: boolean;
  allowBookmark?: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toLocaleString();
}

const XLogo = ({ size = 18, color = "#e7e9ea" }: { size?: number; color?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
const XReply = ({ size = 20, c = "currentColor" }: { size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const XRetweet = ({ filled, size = 20, c = "currentColor" }: { filled: boolean; size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={filled ? "#00ba7c" : c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <polyline points="7 23 3 19 7 15" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const XHeart = ({ filled, size = 20, c = "currentColor" }: { filled: boolean; size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#f91880" : "none"} stroke={filled ? "#f91880" : c} strokeWidth="1.8" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const XViews = ({ size = 20, c = "currentColor" }: { size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={c}>
    <path d="M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z" />
  </svg>
);
const XBookmark = ({ filled, size = 20, c = "currentColor" }: { filled: boolean; size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#1d9bf0" : "none"} stroke={filled ? "#1d9bf0" : c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const XUpload = ({ size = 20, c = "currentColor" }: { size?: number; c?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);
const XVerified = ({ dark = false }: { dark?: boolean }) => (
  <svg width={18} height={18} viewBox="0 0 24 24" fill={dark ? "#fff" : "#1d9bf0"}>
    <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
  </svg>
);

function ActionButton({
  icon,
  label,
  ariaLabel,
  onClick,
  active = false,
  activeColor,
  sub,
}: {
  icon: React.ReactNode;
  label?: number;
  ariaLabel: string;
  onClick?: () => void;
  active?: boolean;
  activeColor?: string;
  sub: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={onClick ? active : undefined}
      className="flex items-center rounded-full border-0 bg-transparent px-1.5 py-1 text-[13px]"
      style={{ cursor: onClick ? "pointer" : "default", color: active ? activeColor : sub, gap: 5 }}
    >
      {icon}
      {label != null && <span className="tabular-nums">{fmt(label)}</span>}
    </button>
  );
}

export function XPostMockup({
  theme = "dark",
  borderRadius = 16,
  username = "Akem",
  handle = "AkemyDesign",
  userAvatar,
  showVerified = true,
  tweetText = "Slow mornings, warm light, and a kitchen that finally feels like home. 🤍",
  mediaImage,
  likesCount = 688,
  retweetsCount = 15,
  repliesCount = 9,
  viewsCount = 5_600_000,
  timePosted = "15:51",
  datePosted = "Jun 4, 2026",
  allowLike = true,
  allowRetweet = true,
  allowBookmark = true,
  className,
  ...props
}: XPostMockupProps) {
  const [liked, setLiked] = React.useState(false);
  const [retweeted, setRetweeted] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  const dark = theme !== "light";
  const bg = dark ? "#16181c" : "#fff";
  const text = dark ? "#e7e9ea" : "#0f1419";
  const sub = dark ? "#71767b" : "#536471";
  const border = dark ? "#2f3336" : "#eff3f4";

  const likes = liked ? likesCount + 1 : likesCount;
  const rts = retweeted ? retweetsCount + 1 : retweetsCount;

  return (
    <div
      className={cn("box-border w-full overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]", className)}
      style={{ background: bg, borderRadius, border: `1px solid ${border}` }}
      {...props}
    >
      <div className="px-4 pt-3.5">
        <div className="mb-2 flex items-start gap-2.5">
          <div className="h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full" style={{ background: dark ? "#333" : "#ddd" }}>
            {userAvatar && <img src={userAvatar} alt={username} className="block h-full w-full object-cover" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1">
              <span className="overflow-hidden text-[15px] font-bold text-ellipsis whitespace-nowrap" style={{ color: text }}>
                {username}
              </span>
              {showVerified && <XVerified dark={dark} />}
            </div>
            <div className="overflow-hidden text-sm text-ellipsis whitespace-nowrap" style={{ color: sub }}>
              @{handle}
            </div>
          </div>
          <XLogo size={20} color={dark ? "#e7e9ea" : "#0f1419"} />
        </div>

        <div className="mb-3 text-[15px] leading-[1.55] whitespace-pre-wrap" style={{ color: text }}>
          {tweetText}
        </div>

        {mediaImage && (
          <div className="mb-3 overflow-hidden rounded-[14px]" style={{ border: `1px solid ${border}` }}>
            <img src={mediaImage} alt="Post media" className="block max-h-80 w-full object-cover" />
          </div>
        )}

        <div className="mb-2.5 text-sm" style={{ color: sub }}>
          {[timePosted, datePosted].filter(Boolean).join(" · ")}
        </div>

        <div className="-mx-4 h-px" style={{ background: border }} />

        <div className="flex flex-wrap justify-between gap-1" style={{ padding: "2px 0 6px" }}>
          <ActionButton icon={<XReply size={18} c={sub} />} label={repliesCount} ariaLabel="Reply" sub={sub} />
          <ActionButton
            icon={<XRetweet filled={retweeted} size={18} c={sub} />}
            label={rts}
            onClick={() => allowRetweet && setRetweeted((v) => !v)}
            active={retweeted}
            activeColor="#00ba7c"
            ariaLabel={retweeted ? "Undo Retweet" : "Retweet"}
            sub={sub}
          />
          <ActionButton
            icon={<XHeart filled={liked} size={18} c={sub} />}
            label={likes}
            onClick={() => allowLike && setLiked((v) => !v)}
            active={liked}
            activeColor="#f91880"
            ariaLabel={liked ? "Unlike" : "Like"}
            sub={sub}
          />
          <ActionButton icon={<XViews size={18} c={sub} />} label={viewsCount} ariaLabel="Views" sub={sub} />
          <div className="flex">
            <ActionButton
              icon={<XBookmark filled={bookmarked} size={18} c={sub} />}
              onClick={() => allowBookmark && setBookmarked((v) => !v)}
              active={bookmarked}
              activeColor="#1d9bf0"
              ariaLabel={bookmarked ? "Remove Bookmark" : "Bookmark"}
              sub={sub}
            />
            <ActionButton icon={<XUpload size={18} c={sub} />} ariaLabel="Share" sub={sub} />
          </div>
        </div>
      </div>
    </div>
  );
}
