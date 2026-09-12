"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type TestimonialVideoWallRatio = "9/16" | "3/4" | "1/1" | "4/3" | "16/9";

export interface TestimonialVideoWallTextCard {
  type: "text";
  name: string;
  company?: string;
  rating?: number;
  logo?: string;
  logoHeight?: number;
  quote: string;
  highlight?: string;
}

export interface TestimonialVideoWallVideoCard {
  type: "video";
  name: string;
  company?: string;
  rating?: number;
  thumbnail?: string;
  videoUrl: string;
  videoRatio?: TestimonialVideoWallRatio;
  verified?: boolean;
  socialHandle?: string;
  followers?: string;
}

export type TestimonialVideoWallCard = TestimonialVideoWallTextCard | TestimonialVideoWallVideoCard;

export interface TestimonialVideoWallProps extends Omit<React.ComponentPropsWithoutRef<"div">, "children"> {
  items?: TestimonialVideoWallCard[];
  columns?: number;
  gap?: number;
  borderRadius?: number;
  cardBg?: string;
  cardBorderColor?: string;
  highlightColor?: string;
  starColor?: string;
  ratingColor?: string;
  quoteSize?: number;
  quoteColor?: string;
  nameSize?: number;
  nameColor?: string;
  companySize?: number;
  companyColor?: string;
  accentColor?: string;
  glassBlur?: number;
  startMuted?: boolean;
}

const DEFAULT_ITEMS: TestimonialVideoWallCard[] = [
  {
    type: "text",
    rating: 5,
    quote: "This product completely changed how we run our business. We saw real growth in traffic, leads and most importantly revenue.",
    highlight: "real growth in traffic, leads and most importantly revenue",
    name: "Sarah Johnson",
    company: "CEO @ Acme Corp",
  },
  {
    type: "video",
    thumbnail: "https://picsum.photos/seed/testimonial2/600/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    videoRatio: "3/4",
    name: "Dhanya CV",
    verified: true,
    company: "NOA Dental Clinic",
    socialHandle: "@noadentalclinic.dubai",
    followers: "3.8K",
    rating: 5,
  },
  {
    type: "text",
    rating: 5,
    quote: "We just opened a new branch and it was really helpful to have high-quality leads coming in consistently. I would definitely recommend them.",
    highlight: "high-quality leads coming in consistently",
    name: "Emma Davis",
    company: "Marketing Director @ GrowthCo",
  },
  {
    type: "video",
    thumbnail: "https://picsum.photos/seed/testimonial1/600/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    videoRatio: "3/4",
    name: "Dr. Jack Yang",
    verified: true,
    company: "CEO @ Infinity Dental",
    socialHandle: "@drjackyang",
    followers: "40.8K followers",
    rating: 5,
  },
  {
    type: "text",
    rating: 5,
    quote: "Working with this team has been a game changer. The AI works for us 24 hours a day, seven days a week, 365 days a year.",
    highlight: "The AI works for us 24 hours a day, seven days a week, 365 days a year",
    name: "Michael Chen",
    company: "Founder @ TechStart",
  },
  {
    type: "video",
    thumbnail: "https://picsum.photos/seed/testimonial3/600/800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    videoRatio: "3/4",
    name: "Dr. Linish S.",
    verified: true,
    company: "NOA Dental Clinic",
    socialHandle: "@noadentalclinic.dubai",
    followers: "3.8K",
    rating: 5,
  },
];

function getYouTubeId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
  return m?.[1] ?? null;
}

function getVimeoId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

function fmt(secs: number): string {
  if (!secs || Number.isNaN(secs) || !Number.isFinite(secs)) return "0:00";
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function IPlay({ size = 20, color = "#1a1a2e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IPause({ size = 20, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  );
}

function IVolOn({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function IVolOff({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="white">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function IReplay({ size = 28, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </svg>
  );
}

function IClose({ size = 13, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function VerifiedIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#3b82f6" />
      <path d="M7.5 12.5l3 3 6-6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon({ size = 13, color = "rgba(255,255,255,0.75)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.5" cy="6.5" r="1" fill={color} stroke="none" />
    </svg>
  );
}

function StarIcon({ size = 16, color = "#f59e0b" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function GBtn({ onClick, title, size = 32, children }: { onClick?: (e: React.MouseEvent) => void; title?: string; size?: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      title={title}
      className="flex shrink-0 items-center justify-center border border-white/15 bg-white/10 text-white outline-none hover:bg-[rgba(255,255,255,0.22)]"
      style={{ width: size, height: size, borderRadius: Math.round(size * 0.32), backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", transition: "background 0.15s ease" }}
    >
      {children}
    </button>
  );
}

function HighlightedQuote({ text, highlight, highlightColor }: { text: string; highlight?: string; highlightColor: string }) {
  if (!highlight || !highlight.trim() || !text.includes(highlight)) return <>{text}</>;
  const parts = text.split(highlight);
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className="rounded-[2px] px-px" style={{ backgroundColor: `${highlightColor}22`, borderBottom: `2px solid ${highlightColor}66` }}>
              {highlight}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

function TextCard({
  item,
  borderRadius,
  cardBg,
  cardBorderColor,
  highlightColor,
  starColor,
  quoteSize,
  quoteColor,
  nameSize,
  nameColor,
  companySize,
  companyColor,
  ratingColor,
}: {
  item: TestimonialVideoWallTextCard;
  borderRadius: number;
  cardBg: string;
  cardBorderColor: string;
  highlightColor: string;
  starColor: string;
  quoteSize: number;
  quoteColor: string;
  nameSize: number;
  nameColor: string;
  companySize: number;
  companyColor: string;
  ratingColor: string;
}) {
  return (
    <div
      className="flex flex-col gap-3.5 border"
      style={{ background: cardBg, borderRadius, borderColor: cardBorderColor, boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 6px 24px rgba(0,0,0,0.05)", padding: "20px 22px 22px" }}
    >
      <div className="flex min-h-8 items-center justify-between gap-2">
        {item.logo ? <img src={item.logo} alt="" draggable={false} className="w-auto max-w-[130px] object-contain" style={{ height: item.logoHeight || 28 }} /> : <div />}
        {(item.rating ?? 0) > 0 && (
          <div className="flex shrink-0 items-center" style={{ gap: 5 }}>
            <span className="text-[15px] leading-none font-bold" style={{ color: ratingColor }}>
              {Number(item.rating).toFixed(1)}
            </span>
            <StarIcon size={16} color={starColor} />
          </div>
        )}
      </div>

      {item.quote && (
        <p className="m-0 leading-relaxed" style={{ color: quoteColor, fontSize: quoteSize }}>
          &ldquo;
          <HighlightedQuote text={item.quote} highlight={item.highlight} highlightColor={highlightColor} />
          &rdquo;
        </p>
      )}

      <div className="flex flex-col gap-0.5">
        {item.name && (
          <div className="leading-tight" style={{ color: nameColor, fontSize: nameSize }}>
            {item.name}
          </div>
        )}
        {item.company && (
          <div className="leading-snug" style={{ color: companyColor, fontSize: companySize }}>
            {item.company}
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCard({
  item,
  borderRadius,
  accentColor,
  glassBlur,
  startMuted,
  isActive,
  onActivate,
  onDeactivate,
  starColor,
}: {
  item: TestimonialVideoWallVideoCard;
  borderRadius: number;
  accentColor: string;
  glassBlur: number;
  startMuted: boolean;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
  starColor: string;
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const seekRef = React.useRef<HTMLDivElement>(null);
  const hideTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const isDragging = React.useRef(false);

  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(startMuted);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [showControls, setShowControls] = React.useState(true);
  const [seekHov, setSeekHov] = React.useState(false);
  const [showPauseFlash, setShowPauseFlash] = React.useState(false);
  const [hasStarted, setHasStarted] = React.useState(false);
  const [ended, setEnded] = React.useState(false);
  const [hovering, setHovering] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const rawSrc = item.videoUrl || "";
  const ytId = getYouTubeId(rawSrc);
  const vimeoId = !ytId ? getVimeoId(rawSrc) : null;
  const isYouTube = !!ytId;
  const isVimeo = !isYouTube && !!vimeoId;
  const isNative = !isYouTube && !isVimeo && !!rawSrc;

  const ytEmbedSrc = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=1&controls=1&rel=0&modestbranding=1&playsinline=1` : "";
  const vimeoEmbedSrc = vimeoId ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&controls=1&title=0&byline=0&portrait=0&dnt=1` : "";

  const rating = Math.round(item.rating ?? 0);
  const cardAspect = item.videoRatio || "3/4";

  React.useEffect(() => {
    if (!isActive) {
      setPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      setShowPauseFlash(false);
      setHasStarted(false);
      setEnded(false);
      setShowControls(true);
      setLoading(false);
    }
  }, [isActive]);

  React.useEffect(() => {
    if (isActive && isNative) setLoading(true);
  }, [isActive, isNative]);

  React.useEffect(() => {
    if (isActive && isNative && videoRef.current) {
      const v = videoRef.current;
      v.currentTime = 0;
      v.muted = muted;
      v.play().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isNative]);

  React.useEffect(() => {
    if (playing) {
      setHasStarted(true);
      setEnded(false);
      setLoading(false);
    }
  }, [playing]);

  React.useEffect(() => {
    if (!isNative || !isActive) return;
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);
    const onEnd = () => {
      setPlaying(false);
      setEnded(true);
    };
    const onWaiting = () => setLoading(true);
    const onReady = () => setLoading(false);
    const onError = () => setLoading(false);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadedmetadata", onMeta);
    v.addEventListener("ended", onEnd);
    v.addEventListener("waiting", onWaiting);
    v.addEventListener("canplay", onReady);
    v.addEventListener("playing", onReady);
    v.addEventListener("error", onError);
    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadedmetadata", onMeta);
      v.removeEventListener("ended", onEnd);
      v.removeEventListener("waiting", onWaiting);
      v.removeEventListener("canplay", onReady);
      v.removeEventListener("playing", onReady);
      v.removeEventListener("error", onError);
    };
  }, [isNative, isActive]);

  const doSeek = React.useCallback(
    (clientX: number) => {
      const el = seekRef.current;
      if (!el || !duration) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const time = ratio * duration;
      setEnded(false);
      if (videoRef.current) videoRef.current.currentTime = time;
      setCurrentTime(time);
    },
    [duration],
  );

  React.useEffect(() => {
    const mv = (e: MouseEvent) => {
      if (isDragging.current) doSeek(e.clientX);
    };
    const up = () => {
      isDragging.current = false;
    };
    window.addEventListener("mousemove", mv);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", up);
    };
  }, [doSeek]);

  const togglePlay = React.useCallback((e?: React.MouseEvent | React.SyntheticEvent) => {
    e?.stopPropagation?.();
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().catch(() => {});
    } else {
      setShowPauseFlash(true);
      setTimeout(() => setShowPauseFlash(false), 650);
      v.pause();
    }
  }, []);

  const toggleMute = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  const handleReplay = React.useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEnded(false);
    setCurrentTime(0);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const resetHide = React.useCallback(() => {
    setShowControls(true);
    clearTimeout(hideTimerRef.current);
    if (playing) hideTimerRef.current = setTimeout(() => setShowControls(false), 2600);
  }, [playing]);

  React.useEffect(() => {
    if (!playing) {
      setShowControls(true);
      clearTimeout(hideTimerRef.current);
    } else {
      hideTimerRef.current = setTimeout(() => setShowControls(false), 2600);
    }
    return () => clearTimeout(hideTimerRef.current);
  }, [playing]);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const showPlayBtn = isActive && isNative && !playing && !showPauseFlash && !ended && !loading;
  const showLoading = isActive && isNative && loading && !ended;
  const showOverlayInfo = !isActive || (isNative && !hasStarted);

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        if (isActive && playing) setShowControls(false);
      }}
      onMouseMove={() => isActive && resetHide()}
      onClick={() => {
        if (!isActive) onActivate();
      }}
      className="relative w-full overflow-hidden bg-[#0c0c14]"
      style={{ aspectRatio: cardAspect, borderRadius, cursor: isActive ? (isNative && playing && !showControls ? "none" : "default") : "pointer" }}
    >
      {item.thumbnail && showOverlayInfo && (
        <img
          src={item.thumbnail}
          alt={item.name || ""}
          draggable={false}
          className="absolute inset-0 block h-full w-full object-cover"
          style={{ transform: !isActive && hovering ? "scale(1.045)" : "scale(1)", transition: "transform 0.5s ease" }}
        />
      )}

      {isActive && isNative && <video ref={videoRef} src={rawSrc} playsInline onClick={togglePlay} className="absolute inset-0 block h-full w-full cursor-pointer object-cover" />}

      {isActive && isYouTube && (
        <iframe src={ytEmbedSrc} className="absolute inset-0 h-full w-full border-none" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title={item.name ? `${item.name} video` : "Video"} />
      )}

      {isActive && isVimeo && (
        <iframe src={vimeoEmbedSrc} className="absolute inset-0 h-full w-full border-none" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen title={item.name ? `${item.name} video` : "Video"} />
      )}

      {isActive && isNative && <div onClick={togglePlay} className="absolute inset-0 z-[1] cursor-pointer" />}

      <div className="pointer-events-none absolute inset-0 z-[1]" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.45) 62%, rgba(0,0,0,0.88) 100%)" }} />

      {!isActive && (
        <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/95"
            style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.35)" }}
          >
            <IPlay size={22} color="#1a1a2e" />
          </motion.div>
        </div>
      )}

      {showOverlayInfo && (
        <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-[2] flex flex-col gap-1 px-4 pt-4 pb-5">
          {item.name && (
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-white" style={{ lineHeight: 1.2, fontFamily: "Inter, sans-serif" }}>{item.name}</span>
              {item.verified && <VerifiedIcon size={17} />}
            </div>
          )}
          {item.company && <div className="text-[13px] text-white/82" style={{ lineHeight: 1.4, fontFamily: "Inter, sans-serif" }}>{item.company}</div>}
          {(item.socialHandle || item.followers) && (
            <div className="mt-0.5 flex items-center" style={{ gap: 5 }}>
              <InstagramIcon size={13} />
              {item.socialHandle && <span className="text-[13px] text-white/75" style={{ fontFamily: "Inter, sans-serif" }}>{item.socialHandle}</span>}
              {item.followers && (
                <>
                  <span className="text-[13px] leading-none text-white/45">•</span>
                  <span className="text-[13px] text-white/75" style={{ fontFamily: "Inter, sans-serif" }}>{item.followers}</span>
                </>
              )}
            </div>
          )}
          {rating > 0 && (
            <div className="mt-1 flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <StarIcon key={s} size={16} color={s <= rating ? starColor : "rgba(255,255,255,0.18)"} />
              ))}
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {showLoading && (
          <motion.div key="spinner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              className="h-[38px] w-[38px] rounded-full border-[3px] border-white/22"
              style={{ borderTopColor: accentColor }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPlayBtn && (
          <motion.div
            key="play-circle"
            initial={{ opacity: 0, scale: 0.72 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={togglePlay}
            className="absolute inset-0 z-[3] flex cursor-pointer items-center justify-center"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/15 bg-black/42 backdrop-blur-[14px]"
            >
              <IPlay size={28} color={accentColor} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPauseFlash && (
          <motion.div
            key="pause-flash"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.3 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-[3] flex items-center justify-center"
          >
            <IPause size={40} color={accentColor} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {ended && (
          <motion.div
            key="replay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={handleReplay}
            className="absolute inset-0 z-[4] flex cursor-pointer flex-col items-center justify-center gap-2.5 bg-black/55"
          >
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/12 backdrop-blur-[14px]"
            >
              <IReplay size={28} color={accentColor} />
            </motion.div>
            <span className="text-xs font-semibold tracking-[0.08em] text-white/85 uppercase select-none">Watch Again</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isActive && (
        <div className="absolute top-2.5 right-2.5 z-[5]">
          <GBtn onClick={onDeactivate} title="Close" size={32}>
            <IClose size={13} />
          </GBtn>
        </div>
      )}

      <AnimatePresence>
        {isActive && isNative && showControls && (
          <motion.div
            key="controls"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 bottom-0 left-0 z-[4] px-2 pb-2"
          >
            <div onClick={(e) => e.stopPropagation()} className="border border-white/10 bg-black/28 px-2.5 pt-2 pb-2.5" style={{ borderRadius: 14, backdropFilter: `blur(${glassBlur}px) saturate(190%)` }}>
              <div
                ref={seekRef}
                onMouseEnter={() => setSeekHov(true)}
                onMouseLeave={() => setSeekHov(false)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  isDragging.current = true;
                  doSeek(e.clientX);
                }}
                className="relative mb-2 cursor-pointer rounded"
                style={{ height: seekHov ? 6 : 4, transition: "height 0.15s ease" }}
              >
                <div className="absolute inset-0 rounded bg-white/22" />
                <div className="absolute top-0 bottom-0 left-0 rounded" style={{ background: accentColor, width: `${progress}%`, transition: "width 0.08s linear" }} />
                <div
                  className="pointer-events-none absolute top-1/2 rounded-full bg-white"
                  style={{ left: `${progress}%`, transform: "translate(-50%, -50%)", width: seekHov ? 14 : 11, height: seekHov ? 14 : 11, boxShadow: "0 1px 6px rgba(0,0,0,0.38)", transition: "width 0.15s, height 0.15s" }}
                />
              </div>

              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5">
                  <GBtn onClick={togglePlay} title={playing ? "Pause" : "Play"} size={32}>
                    {playing ? <IPause size={15} /> : <IPlay size={15} color="white" />}
                  </GBtn>
                  <span className="text-xs font-medium whitespace-nowrap text-white/88 tabular-nums">
                    {fmt(currentTime)} / {fmt(duration)}
                  </span>
                </div>
                <GBtn onClick={toggleMute} title={muted ? "Unmute" : "Mute"} size={32}>
                  {muted ? <IVolOff size={15} /> : <IVolOn size={15} />}
                </GBtn>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function TestimonialVideoWall({
  items = DEFAULT_ITEMS,
  columns = 3,
  gap = 16,
  borderRadius = 20,
  cardBg = "#ffffff",
  cardBorderColor = "rgba(0,0,0,0.07)",
  highlightColor = "#3b82f6",
  starColor = "#f59e0b",
  ratingColor = "#111827",
  quoteSize = 15,
  quoteColor = "#1f2937",
  nameSize = 14,
  nameColor = "#111827",
  companySize = 13,
  companyColor = "#6b7280",
  accentColor = "#ffffff",
  glassBlur = 20,
  startMuted = false,
  className,
  ...props
}: TestimonialVideoWallProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <div className={cn("w-full", className)} style={{ columnCount: columns, columnGap: gap }} {...props}>
      {items.map((item, i) => (
        <div key={i} className="mb-4 break-inside-avoid" style={{ marginBottom: gap }}>
          {item.type === "video" ? (
            <VideoCard
              item={item}
              borderRadius={borderRadius}
              accentColor={accentColor}
              glassBlur={glassBlur}
              startMuted={startMuted}
              isActive={activeIndex === i}
              onActivate={() => setActiveIndex(i)}
              onDeactivate={() => setActiveIndex(null)}
              starColor={starColor}
            />
          ) : (
            <TextCard
              item={item}
              borderRadius={borderRadius}
              cardBg={cardBg}
              cardBorderColor={cardBorderColor}
              highlightColor={highlightColor}
              starColor={starColor}
              quoteSize={quoteSize}
              quoteColor={quoteColor}
              nameSize={nameSize}
              nameColor={nameColor}
              companySize={companySize}
              companyColor={companyColor}
              ratingColor={ratingColor}
            />
          )}
        </div>
      ))}
    </div>
  );
}
