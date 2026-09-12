"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type InstagramPostMockupTheme = "light" | "dark";

export interface InstagramPostMockupProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  theme?: InstagramPostMockupTheme;
  borderRadius?: number;
  username?: string;
  userAvatar?: string;
  showVerified?: boolean;
  location?: string;
  showLocation?: boolean;
  postDescription?: string;
  timePosted?: string;
  media?: string[];
  maxMedia?: number;
  likesCount?: number;
  showLikes?: boolean;
  likedByUsername?: string;
  showLikedBy?: boolean;
  showLikeCount?: boolean;
  commentsCount?: number;
  showComments?: boolean;
  showCounter?: boolean;
  allowLike?: boolean;
  doubleTapLike?: boolean;
  allowBookmark?: boolean;
  showCommentIcon?: boolean;
  showRepost?: boolean;
  showShare?: boolean;
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(".0", "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(".0", "") + "K";
  return n.toLocaleString();
}

const HEART_BURST_CSS = `@keyframes ig-heart-burst {
  0% { transform: scale(0); opacity: 0; }
  15% { transform: scale(1.2); opacity: 1; }
  35% { transform: scale(0.95); opacity: 1; }
  80% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 0; }
}`;

const IgHeart = ({ filled, size = 26, dark = false }: { filled: boolean; size?: number; dark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#ed4956" : "none"} stroke={filled ? "#ed4956" : dark ? "#fff" : "#262626"} strokeWidth="2" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const IgComment = ({ size = 26, dark = false }: { size?: number; dark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={dark ? "#fff" : "#262626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z" />
  </svg>
);
const IgRepost = ({ size = 26, dark = false }: { size?: number; dark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={dark ? "#fff" : "#262626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 1l4 4-4 4" />
    <path d="M3 11V9a4 4 0 0 1 4-4h14" />
    <path d="M7 23l-4-4 4-4" />
    <path d="M21 13v2a4 4 0 0 1-4 4H3" />
  </svg>
);
const IgSend = ({ size = 26, dark = false }: { size?: number; dark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={dark ? "#fff" : "#262626"} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.36 8.175 L19.64 2.825 Q22 2 21.175 4.36 L15.825 19.64 Q15 22 13.985 19.715 L12.015 15.285 Q11 13 8.715 11.985 L4.285 10.015 Q2 9 4.36 8.175 Z" />
    <line x1="22" y1="2" x2="11" y2="13" />
  </svg>
);
const IgBookmark = ({ filled, size = 26, dark = false }: { filled: boolean; size?: number; dark?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? (dark ? "#fff" : "#262626") : "none"} stroke={dark ? "#fff" : "#262626"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const IgDots = ({ dark = false }: { dark?: boolean }) => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill={dark ? "#fff" : "#262626"}>
    <circle cx="5" cy="12" r="1.8" />
    <circle cx="12" cy="12" r="1.8" />
    <circle cx="19" cy="12" r="1.8" />
  </svg>
);
const IgVerified = () => (
  <svg width={14} height={14} viewBox="0 0 24 24" fill="#0095f6">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
);

export function InstagramPostMockup({
  theme = "light",
  borderRadius = 12,
  username = "rensato",
  userAvatar,
  showVerified = false,
  location = "Tokyo, Japan",
  showLocation = true,
  postDescription = "dream architecture",
  timePosted = "September 19",
  media = [],
  maxMedia = 8,
  likesCount = 44686,
  showLikes = true,
  likedByUsername = "kaitowatanabe",
  showLikedBy = true,
  showLikeCount = true,
  commentsCount = 9,
  showComments = true,
  showCounter = true,
  allowLike = true,
  doubleTapLike = true,
  allowBookmark = true,
  showCommentIcon = true,
  showRepost = true,
  showShare = true,
  className,
  ...props
}: InstagramPostMockupProps) {
  const [liked, setLiked] = React.useState(false);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [idx, setIdx] = React.useState(0);
  const [dragOffset, setDragOffset] = React.useState(0);
  const [dragging, setDragging] = React.useState(false);
  const [burst, setBurst] = React.useState(false);
  const dragStartX = React.useRef<number | null>(null);
  const mediaRef = React.useRef<HTMLDivElement>(null);
  const burstTimer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const dark = theme === "dark";
  const bg = dark ? "#000" : "#fff";
  const text = dark ? "#fff" : "#262626";
  const sub = dark ? "#a8a8a8" : "#737373";
  const border = dark ? "#262626" : "#dbdbdb";

  const items = media.slice(0, maxMedia);
  const total = items.length;
  const multi = total > 1;
  const likes = liked ? likesCount + 1 : likesCount;

  const onDragStart = (e: React.PointerEvent) => {
    if (!multi) return;
    if ((e.target as HTMLElement)?.closest?.("button, [data-no-drag]")) {
      dragStartX.current = null;
      return;
    }
    dragStartX.current = e.clientX;
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    if (!dragging) {
      if (Math.abs(delta) < 6) return;
      setDragging(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    setDragOffset(delta);
  };
  const onDragEnd = () => {
    if (dragStartX.current === null) return;
    if (dragging) {
      const width = mediaRef.current?.offsetWidth ?? 1;
      const threshold = width * 0.18;
      if (dragOffset < -threshold && idx < total - 1) setIdx((i) => i + 1);
      else if (dragOffset > threshold && idx > 0) setIdx((i) => i - 1);
    }
    dragStartX.current = null;
    setDragOffset(0);
    setDragging(false);
  };
  const onDoubleTapLike = () => {
    if (!doubleTapLike || !allowLike) return;
    setLiked(true);
    setBurst(false);
    requestAnimationFrame(() => setBurst(true));
    if (burstTimer.current) clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => setBurst(false), 1000);
  };

  React.useEffect(() => {
    return () => {
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, []);

  return (
    <>
      <style>{HEART_BURST_CSS}</style>
      <div
        className={cn("box-border w-full overflow-hidden font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif]", className)}
        style={{ background: bg, borderRadius, border: `1px solid ${border}` }}
        {...props}
      >
        <div className="flex items-center gap-2.5 px-3.5 py-2.5">
          <div className="box-border h-10 w-10 shrink-0 rounded-full p-0.5" style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)" }}>
            {userAvatar ? (
              <img src={userAvatar} alt={username} className="block h-full w-full rounded-full object-cover" />
            ) : (
              <div className="h-full w-full rounded-full" style={{ background: dark ? "#333" : "#ddd" }} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-1">
              <span className="overflow-hidden text-sm font-semibold text-ellipsis whitespace-nowrap" style={{ color: text }}>
                {username}
              </span>
              {showVerified && <IgVerified />}
            </div>
            {showLocation && location && (
              <div className="overflow-hidden text-[11px] text-ellipsis whitespace-nowrap" style={{ color: sub }}>
                {location}
              </div>
            )}
          </div>
          <IgDots dark={dark} />
        </div>

        {total > 0 ? (
          <div
            ref={mediaRef}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
            onPointerLeave={onDragEnd}
            onDoubleClick={onDoubleTapLike}
            className="relative w-full overflow-hidden bg-black select-none"
            style={{ aspectRatio: "1 / 1", touchAction: multi ? "pan-y" : undefined, cursor: multi ? (dragging ? "grabbing" : "grab") : "default" }}
          >
            <div className="flex h-full" style={{ width: `${total * 100}%`, transform: `translateX(calc(-${(idx / total) * 100}% + ${dragOffset}px))`, transition: dragging ? "none" : "transform 0.3s cubic-bezier(.4,0,.2,1)" }}>
              {items.map((src, i) => (
                <div key={i} className="h-full shrink-0" style={{ width: `${100 / total}%` }}>
                  <img src={src} alt={`${username} post photo ${i + 1} of ${total}`} draggable={false} className="pointer-events-none block h-full w-full object-cover" />
                </div>
              ))}
            </div>
            {multi && showCounter && (
              <div className="absolute top-3 right-3 rounded-full bg-black/60 px-2.5 py-[3px] text-xs font-semibold text-white">
                {idx + 1}/{total}
              </div>
            )}
            {multi && idx > 0 && (
              <button
                onClick={() => setIdx((i) => i - 1)}
                aria-label="Previous photo"
                className="absolute top-1/2 left-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/90 p-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            )}
            {multi && idx < total - 1 && (
              <button
                onClick={() => setIdx((i) => i + 1)}
                aria-label="Next photo"
                className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-0 bg-white/90 p-0"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#262626" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            )}
            {multi && (
              <div data-no-drag className="absolute right-0 bottom-2.5 left-0 flex justify-center gap-1">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIdx(i)}
                    aria-label={`Go to photo ${i + 1}`}
                    aria-current={i === idx}
                    className="cursor-pointer rounded-full border-0 p-0 transition-all duration-200 ease-[ease]"
                    style={{ width: i === idx ? 6 : 5, height: i === idx ? 6 : 5, background: i === idx ? "#0095f6" : "rgba(255,255,255,0.7)" }}
                  />
                ))}
              </div>
            )}
            {burst && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <svg width="90" height="90" viewBox="0 0 24 24" fill="#fff" style={{ filter: "drop-shadow(0 2px 10px rgba(0,0,0,0.25))", animation: "ig-heart-burst 0.9s ease-out forwards" }}>
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </div>
            )}
          </div>
        ) : (
          <div className="flex w-full items-center justify-center" style={{ aspectRatio: "1 / 1", background: dark ? "#1a1a1a" : "#efefef" }}>
            <span className="text-[13px]" style={{ color: sub }}>
              Add images via Media Items
            </span>
          </div>
        )}

        <div className="flex items-center gap-3.5 px-3.5 pt-2.5 pb-0.5">
          <button
            onClick={() => allowLike && setLiked((v) => !v)}
            aria-label={liked ? "Unlike" : "Like"}
            aria-pressed={liked}
            className="flex border-0 bg-transparent p-0 transition-transform duration-[120ms] ease-[ease]"
            style={{ cursor: allowLike ? "pointer" : "default", transform: liked ? "scale(1.15)" : "scale(1)" }}
          >
            <IgHeart filled={liked} size={23} dark={dark} />
          </button>
          {showCommentIcon && (
            <button aria-label="Comment" className="flex cursor-pointer border-0 bg-transparent p-0">
              <IgComment size={23} dark={dark} />
            </button>
          )}
          {showRepost && (
            <button aria-label="Repost" className="flex cursor-pointer border-0 bg-transparent p-0">
              <IgRepost size={23} dark={dark} />
            </button>
          )}
          {showShare && (
            <button aria-label="Share" className="flex cursor-pointer border-0 bg-transparent p-0">
              <IgSend size={23} dark={dark} />
            </button>
          )}
          <div className="flex-1" />
          <button
            onClick={() => allowBookmark && setBookmarked((v) => !v)}
            aria-label={bookmarked ? "Remove from saved" : "Save"}
            aria-pressed={bookmarked}
            className="flex border-0 bg-transparent p-0"
            style={{ cursor: allowBookmark ? "pointer" : "default" }}
          >
            <IgBookmark filled={bookmarked} size={23} dark={dark} />
          </button>
        </div>

        {showLikes && (
          <div className="px-3.5 py-0.5 text-sm font-semibold" style={{ color: text }}>
            {showLikedBy && showLikeCount ? (
              <span>
                Liked by <strong>{likedByUsername}</strong> and <strong>{fmt(likes)} others</strong>
              </span>
            ) : showLikedBy ? (
              <span>
                Liked by <strong>{likedByUsername}</strong>
              </span>
            ) : showLikeCount ? (
              <strong>{fmt(likes)} likes</strong>
            ) : null}
          </div>
        )}

        {postDescription && (
          <div className="px-3.5 py-1 text-sm leading-[1.5]" style={{ color: text }}>
            <strong>{username}</strong> {postDescription}
          </div>
        )}

        {showComments && commentsCount > 0 && (
          <div className="cursor-pointer px-3.5 py-0.5 text-sm" style={{ color: sub }}>
            View all {fmt(commentsCount)} comments
          </div>
        )}

        <div className="px-3.5 pt-1 pb-3.5 text-[11px] tracking-[0.3px] uppercase" style={{ color: sub }}>
          {timePosted}
        </div>
      </div>
    </>
  );
}
