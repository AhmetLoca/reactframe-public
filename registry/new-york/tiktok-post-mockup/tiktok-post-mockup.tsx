"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface TikTokPostMockupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  background?: string;
  borderRadius?: number;
  username?: string;
  userAvatar?: string;
  description?: string;
  likesCount?: number;
  commentsCount?: number;
  bookmarksCount?: number;
  sharesCount?: number;
  allowLike?: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toLocaleString();
}

const TtHeart = ({ filled, size = 32 }: { filled: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fe2c55" : "white"}>
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);
const TtComment = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M12 2C6.49 2 2 5.94 2 10.8c0 2.76 1.46 5.21 3.77 6.83-.12.91-.5 2.2-1.47 3.43-.2.26.02.63.35.57 2.16-.37 3.78-1.34 4.78-2.12.83.17 1.69.27 2.57.27 5.51 0 10-3.94 10-8.8S17.51 2 12 2z" />
    <circle cx="8.3" cy="10.8" r="1.15" fill="rgba(0,0,0,0.35)" />
    <circle cx="12" cy="10.8" r="1.15" fill="rgba(0,0,0,0.35)" />
    <circle cx="15.7" cy="10.8" r="1.15" fill="rgba(0,0,0,0.35)" />
  </svg>
);
const TtBookmark = ({ filled, size = 32 }: { filled: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#fe2c55" : "white"}>
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z" />
  </svg>
);
const TtShare = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
    <path d="M14 9.5V5.6c0-.86.99-1.34 1.66-.8l7.05 5.65c.52.42.52 1.21 0 1.63l-7.05 5.65c-.67.54-1.66.06-1.66-.8v-3.9c-5.04.13-8.6 1.8-11.05 5.4-.3.44-.95.2-.92-.33C2.46 12.1 6.6 9.62 14 9.5z" />
  </svg>
);

const HOME_ICON_PATH = "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z";
const FRIENDS_ICON_PATH =
  "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z";
const INBOX_ICON_PATH = "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z";
const PROFILE_ICON_PATH = "M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z";

export function TikTokPostMockup({
  background,
  borderRadius = 20,
  username = "cagla",
  userAvatar,
  description = "Re25sken #you #fyp✈️",
  likesCount = 133_700,
  commentsCount = 1_056,
  bookmarksCount = 10_200,
  sharesCount = 8_647,
  allowLike = true,
  className,
  ...props
}: TikTokPostMockupProps) {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);

  const likes = liked ? likesCount + 1 : likesCount;
  const books = bookmarked ? bookmarksCount + 1 : bookmarksCount;

  return (
    <div
      className={cn("relative w-full overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]", className)}
      style={{ aspectRatio: "9 / 16", borderRadius, background: "#111" }}
      {...props}
    >
      {background ? (
        <img src={background} alt="" role="presentation" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div className="absolute inset-0" style={{ background: "linear-gradient(160deg,#1a0a2e 0%,#2d1b4e 40%,#0f2a3f 100%)" }} />
      )}
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg,rgba(0,0,0,0.25) 0%,transparent 25%,transparent 50%,rgba(0,0,0,0.75) 100%)" }} />

      <div className="absolute top-4.5 right-0 left-0 flex justify-center gap-7">
        {["Following", "For You"].map((tab) => (
          <span
            key={tab}
            className="pb-1 text-[17px]"
            style={{ color: tab === "For You" ? "#fff" : "rgba(255,255,255,0.55)", fontWeight: tab === "For You" ? 700 : 400, borderBottom: tab === "For You" ? "2.5px solid #fff" : "none" }}
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="absolute right-2.5 bottom-[90px] flex flex-col items-center gap-5">
        <div className="relative mb-1.5">
          <div className="h-[46px] w-[46px] overflow-hidden rounded-full border-[2.5px] border-white" style={{ background: "#555" }}>
            {userAvatar && <img src={userAvatar} alt={username} className="block h-full w-full object-cover" />}
          </div>
          <div className="absolute bottom-[-11px] left-1/2 flex h-[22px] w-[22px] -translate-x-1/2 items-center justify-center rounded-full" style={{ background: "#fe2c55" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </div>
        </div>

        <button onClick={() => allowLike && setLiked((v) => !v)} aria-label={liked ? "Unlike" : "Like"} aria-pressed={liked} className="flex flex-col items-center gap-1 border-0 bg-transparent p-0 cursor-pointer">
          <TtHeart filled={liked} size={30} />
          <span className="text-xs font-semibold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {fmt(likes)}
          </span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <TtComment size={30} />
          <span className="text-xs font-semibold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {fmt(commentsCount)}
          </span>
        </div>

        <button
          onClick={() => setBookmarked((v) => !v)}
          aria-label={bookmarked ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={bookmarked}
          className="flex cursor-pointer flex-col items-center gap-1 border-0 bg-transparent p-0"
        >
          <TtBookmark filled={bookmarked} size={30} />
          <span className="text-xs font-semibold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {fmt(books)}
          </span>
        </button>

        <div className="flex flex-col items-center gap-1">
          <TtShare size={30} />
          <span className="text-xs font-semibold text-white" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
            {fmt(sharesCount)}
          </span>
        </div>
      </div>

      <div className="absolute bottom-5 left-3.5" style={{ right: 70 }}>
        <div className="overflow-hidden text-base font-bold text-ellipsis whitespace-nowrap text-white" style={{ marginBottom: 5, textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}>
          @{username}
        </div>
        <div
          className="mb-2.5 text-sm leading-[1.4] text-white"
          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)", display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 2, overflow: "hidden" }}
        >
          {description}
        </div>
        <div className="box-border flex max-w-full items-center gap-2 rounded-[20px] bg-white/18 px-3 py-1.5 backdrop-blur-[10px]">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="white" className="shrink-0">
            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
          </svg>
          <span className="overflow-hidden text-xs text-ellipsis whitespace-nowrap text-white">Original sound – {username}</span>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 flex h-14 items-center justify-around bg-black/85 backdrop-blur-md">
        {[
          { label: "Home", path: HOME_ICON_PATH, active: true },
          { label: "Friends", path: FRIENDS_ICON_PATH, active: false },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <svg width={22} height={22} viewBox="0 0 24 24" fill={item.active ? "#fff" : "rgba(255,255,255,0.5)"}>
              <path d={item.path} />
            </svg>
            <span className="text-[10px]" style={{ color: item.active ? "#fff" : "rgba(255,255,255,0.5)" }}>
              {item.label}
            </span>
          </div>
        ))}
        <div className="flex h-7 w-11 items-center justify-center rounded-[8px]" style={{ background: "linear-gradient(90deg,#69c9d0,#ee1d52)" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="white">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        </div>
        {[
          { label: "Inbox", path: INBOX_ICON_PATH },
          { label: "Profile", path: PROFILE_ICON_PATH },
        ].map((item) => (
          <div key={item.label} className="flex flex-col items-center gap-0.5">
            <svg width={22} height={22} viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)">
              <path d={item.path} />
            </svg>
            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
