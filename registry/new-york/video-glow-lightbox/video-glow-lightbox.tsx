"use client";

import * as React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&\n?#]+)/);
  return m?.[1] ?? null;
}

function getVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(?:.*\/)?(?:video\/)?(\d+)/);
  return m?.[1] ?? null;
}

const PlayIcon = React.memo(function PlayIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="40" fill="rgba(0,0,0,0.42)" />
      <circle cx="40" cy="40" r="38.5" stroke="rgba(255,255,255,0.16)" strokeWidth="1" />
      <path d="M32 26l22 14-22 14V26z" fill={color} />
    </svg>
  );
});

const CloseIcon = React.memo(function CloseIcon() {
  return (
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 1l14 14M15 1L1 15" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
});

type DemoSourceType = "youtube" | "vimeo" | "file";

const DEMO_SWITCHER_OPTIONS: { key: DemoSourceType; label: string }[] = [
  { key: "youtube", label: "Youtube" },
  { key: "vimeo", label: "Vimeo" },
  { key: "file", label: "Upload" },
];

const DemoSwitcher = React.memo(function DemoSwitcher({ active, onChange }: { active: DemoSourceType; onChange: (type: DemoSourceType) => void }) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/[0.08] px-6.5 py-3.5 shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-[20px] backdrop-saturate-[180%]" style={{ background: "rgba(28,28,30,0.55)" }}>
      {DEMO_SWITCHER_OPTIONS.map((opt, i) => {
        const isActive = active === opt.key;
        return (
          <div key={opt.key} className="flex items-center">
            {i > 0 && <div aria-hidden="true" className="mx-[22px] h-[30px] w-px bg-white/10" />}
            <button
              type="button"
              aria-pressed={isActive}
              onClick={(e) => {
                e.stopPropagation();
                onChange(opt.key);
              }}
              className="flex flex-col items-center gap-2.5 border-none bg-transparent p-0"
            >
              <span className="text-[10px] font-semibold tracking-[0.14em] text-white/45 uppercase">{opt.label}</span>
              <div className="relative h-[22px] w-10 rounded-full transition-colors" style={{ background: isActive ? "#ffffff" : "rgba(255,255,255,0.14)" }}>
                <div
                  className="absolute top-0.5 h-[18px] w-[18px] rounded-full transition-[left,background-color]"
                  style={{ left: isActive ? 20 : 2, background: isActive ? "#0a0a0a" : "rgba(255,255,255,0.4)" }}
                />
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
});

export type VideoGlowLightboxType = "url" | "youtube" | "vimeo" | "file";
export type VideoGlowLightboxTransition = "morph" | "fade";

export interface VideoGlowLightboxProps {
  videoType?: VideoGlowLightboxType;
  videoUrl?: string;
  videoFile?: string;
  thumbnailImage?: string;
  glowColor?: string;
  glowIntensity?: number;
  glowBlur?: number;
  glowSpread?: number;
  glowAnimation?: boolean;
  glowAnimationSpeed?: number;
  borderRadius?: number;
  borderWidth?: number;
  borderColor?: string;
  frameBackground?: string;
  overlayColor?: string;
  lightboxBorderRadius?: number;
  lightboxMaxWidth?: number;
  lightboxGlow?: boolean;
  lightboxTransition?: VideoGlowLightboxTransition;
  aspectRatio?: string;
  innerGlowSize?: number;
  showPlayButton?: boolean;
  playButtonSize?: number;
  playButtonColor?: string;
  showCursorLabel?: boolean;
  cursorLabelText?: string;
  cursorLabelBg?: string;
  cursorLabelColor?: string;
  enableHoverPreview?: boolean;
  hoverPreviewDelay?: number;
  soundReactiveGlow?: boolean;
  soundReactiveIntensity?: number;
  /**
   * Shows a floating control bar so people can flip between YouTube/Vimeo/
   * Upload demo sources live, with a muted autoplay preview per source.
   * It's a showcase affordance, not required — delete this prop and the
   * demo* props below once you've picked your final video source.
   */
  showDemoSwitcher?: boolean;
  demoYoutubeUrl?: string;
  demoVimeoUrl?: string;
  demoFileUrl?: string;
  demoYoutubeThumbnail?: string;
  demoVimeoThumbnail?: string;
  demoFileThumbnail?: string;
  className?: string;
}

function FrameWrapper({ layoutId, style, children }: { layoutId: string | undefined; style: React.CSSProperties; children: React.ReactNode }) {
  return (
    <motion.div layoutId={layoutId} style={style}>
      {children}
    </motion.div>
  );
}

export function VideoGlowLightbox({
  videoType = "url",
  videoUrl = "",
  videoFile = "",
  thumbnailImage,
  glowColor = "#3633FF",
  glowIntensity = 55,
  glowBlur = 48,
  glowSpread = 20,
  glowAnimation = true,
  glowAnimationSpeed = 3,
  borderRadius = 16,
  borderWidth = 1.5,
  borderColor = "rgba(107, 51, 255, 0.5)",
  frameBackground = "#000000",
  overlayColor = "rgba(0,0,0,0.88)",
  lightboxBorderRadius = 14,
  lightboxMaxWidth = 900,
  lightboxGlow = true,
  lightboxTransition = "morph",
  aspectRatio = "16/9",
  innerGlowSize = 18,
  showPlayButton = true,
  playButtonSize = 64,
  playButtonColor = "#ffffff",
  showCursorLabel = false,
  cursorLabelText = "Watch",
  cursorLabelBg = "#ffffff",
  cursorLabelColor = "#0a0a0a",
  enableHoverPreview = false,
  hoverPreviewDelay = 400,
  soundReactiveGlow = false,
  soundReactiveIntensity = 3.5,
  showDemoSwitcher = false,
  demoYoutubeUrl = "",
  demoVimeoUrl = "",
  demoFileUrl = "",
  demoYoutubeThumbnail,
  demoVimeoThumbnail,
  demoFileThumbnail,
  className,
}: VideoGlowLightboxProps) {
  const [prefersReduced, setPrefersReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (!mq) return;
    const t = setTimeout(() => setPrefersReduced(mq.matches), 0);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handleChange);
    return () => {
      clearTimeout(t);
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  const overlayRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const triggerRef = React.useRef<HTMLDivElement>(null);
  const previewTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpenRef = React.useRef(false);
  const reactId = React.useId().replace(/[^a-zA-Z0-9-]/g, "");

  const [isOpen, setIsOpen] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [previewActive, setPreviewActive] = React.useState(false);
  const [demoActiveType, setDemoActiveType] = React.useState<DemoSourceType>(videoType === "vimeo" ? "vimeo" : videoType === "file" ? "file" : "youtube");

  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const labelX = useSpring(cursorX, { stiffness: 300, damping: 30, mass: 0.4 });
  const labelY = useSpring(cursorY, { stiffness: 300, damping: 30, mass: 0.4 });

  const audioLevel = useMotionValue(0);

  const thumbSrc = showDemoSwitcher
    ? demoActiveType === "file"
      ? demoFileThumbnail
      : demoActiveType === "youtube"
        ? demoYoutubeThumbnail
        : demoVimeoThumbnail
    : thumbnailImage;

  const rawSrc = showDemoSwitcher
    ? demoActiveType === "file"
      ? demoFileUrl
      : demoActiveType === "youtube"
        ? demoYoutubeUrl
        : demoVimeoUrl
    : videoType === "file"
      ? videoFile
      : videoUrl;

  const open = React.useCallback(() => {
    if (!rawSrc) return;
    setIsOpen(true);
    setPreviewActive(false);
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
  }, [rawSrc]);
  const close = React.useCallback(() => setIsOpen(false), []);

  React.useEffect(() => {
    if (isOpen) {
      overlayRef.current?.focus();
      wasOpenRef.current = true;
    } else if (wasOpenRef.current) {
      triggerRef.current?.focus();
      wasOpenRef.current = false;
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) return;
    const el = overlayRef.current;
    if (!el) return;
    const getFocusable = () =>
      Array.from(el.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')).filter((n) => !n.hasAttribute("disabled"));
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const nodes = getFocusable();
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    el.addEventListener("keydown", handleTab);
    return () => el.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleMouseEnter = React.useCallback(() => {
    setHovered(true);
    if (enableHoverPreview) {
      previewTimerRef.current = setTimeout(() => setPreviewActive(true), hoverPreviewDelay);
    }
  }, [enableHoverPreview, hoverPreviewDelay]);

  const handleMouseLeave = React.useCallback(() => {
    setHovered(false);
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    setPreviewActive(false);
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!showCursorLabel) return;
      const rect = e.currentTarget.getBoundingClientRect();
      cursorX.set(e.clientX - rect.left);
      cursorY.set(e.clientY - rect.top);
    },
    [showCursorLabel, cursorX, cursorY]
  );

  React.useEffect(() => {
    return () => {
      if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
    };
  }, []);

  const ytId = getYouTubeId(rawSrc || "");
  const vimeoId = getVimeoId(rawSrc || "");
  const isYouTube = showDemoSwitcher ? demoActiveType === "youtube" : videoType === "youtube" || (videoType === "url" && !!ytId);
  const isVimeo = showDemoSwitcher ? demoActiveType === "vimeo" : videoType === "vimeo" || (videoType === "url" && !isYouTube && !!vimeoId);
  const isEmbed = isYouTube || isVimeo;

  const playbackSrc = isYouTube
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0&modestbranding=1&color=white`
    : isVimeo
      ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&title=0&byline=0&portrait=0`
      : rawSrc;

  const previewSrc = isYouTube
    ? `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&controls=0&modestbranding=1&playsinline=1&rel=0`
    : isVimeo
      ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&background=1&controls=0`
      : rawSrc;

  const glowAlpha = Math.max(0, Math.min(1, glowIntensity / 100));
  const showPreview = previewActive && !isOpen && !!rawSrc;
  const demoPreviewActive = showDemoSwitcher && !!rawSrc;
  const useMorph = lightboxTransition === "morph";
  const frameLayoutId = `vgl-frame-${reactId}`;

  React.useEffect(() => {
    if (!isOpen || !soundReactiveGlow || isEmbed) return;
    const videoEl = videoRef.current;
    if (!videoEl) return;

    let rafId = 0;
    let cancelled = false;
    let audioCtx: AudioContext | null = null;

    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new Ctx();
      const source = audioCtx.createMediaElementSource(videoEl);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.82;
      source.connect(analyser);
      analyser.connect(audioCtx.destination);

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        if (cancelled) return;
        analyser.getByteFrequencyData(data);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i];
        const level = (sum / data.length / 255) * soundReactiveIntensity;
        audioLevel.set(Math.min(1, level));
        rafId = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // Cross-origin audio or unsupported API — glow stays static
    }

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
      audioLevel.set(0);
      if (audioCtx) audioCtx.close().catch(() => {});
    };
  }, [isOpen, soundReactiveGlow, isEmbed, soundReactiveIntensity, audioLevel]);

  return (
    <div className={cn("relative flex h-full w-full flex-col", className)} style={{ gap: showDemoSwitcher ? 16 : 0 }}>
      {showDemoSwitcher && (
        <div className="flex shrink-0 justify-center">
          <DemoSwitcher active={demoActiveType} onChange={setDemoActiveType} />
        </div>
      )}

      <div
        ref={triggerRef}
        className="relative w-full flex-1"
        style={{ minHeight: 0, cursor: rawSrc ? "pointer" : "default" }}
        role="button"
        tabIndex={rawSrc ? 0 : -1}
        aria-label="Play video"
        aria-disabled={!rawSrc ? true : undefined}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute z-0"
          style={{ inset: -glowSpread, background: glowColor, borderRadius: borderRadius + glowSpread, filter: `blur(${glowBlur}px)` }}
          animate={{
            opacity: hovered
              ? Math.min(glowAlpha * 1.85, 0.95)
              : glowAnimation && !prefersReduced
                ? [glowAlpha * 0.6, glowAlpha * 1.05, glowAlpha * 0.6]
                : glowAlpha * 0.8,
          }}
          transition={hovered ? { duration: 0.3, ease: "easeOut" } : glowAnimation && !prefersReduced ? { duration: glowAnimationSpeed, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
        />

        <FrameWrapper layoutId={useMorph ? frameLayoutId : undefined} style={{ position: "relative", width: "100%", height: "100%", borderRadius, border: `${borderWidth}px solid ${borderColor}`, overflow: "hidden", background: frameBackground, zIndex: 1 }}>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 left-0 z-[4]"
            style={{ height: "45%", background: "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)", borderRadius: `${Math.max(0, borderRadius - 1)}px ${Math.max(0, borderRadius - 1)}px 0 0` }}
          />

          {thumbSrc ? (
            <motion.img
              src={thumbSrc}
              alt=""
              draggable={false}
              className="block h-full w-full object-cover select-none"
              animate={{ scale: hovered ? 1.04 : 1 }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          ) : demoPreviewActive ? (
            isEmbed ? (
              <iframe key={demoActiveType} src={previewSrc} className="pointer-events-none block h-full w-full border-none" allow="autoplay; fullscreen" title="Demo preview" />
            ) : (
              <video key={demoActiveType} src={previewSrc} muted autoPlay loop playsInline className="block h-full w-full object-cover" />
            )
          ) : (
            <div aria-hidden="true" className="h-full w-full" style={{ background: "linear-gradient(145deg, #0e0e1c 0%, #1a0f30 45%, #0c1a38 100%)" }} />
          )}

          {enableHoverPreview && !showDemoSwitcher && (
            <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] bg-black" animate={{ opacity: showPreview ? 1 : 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
              {showPreview &&
                (isEmbed ? (
                  <iframe key={previewSrc} src={previewSrc} className="pointer-events-none block h-full w-full border-none" allow="autoplay; fullscreen" title="Preview" />
                ) : (
                  <video key={previewSrc} src={previewSrc} muted autoPlay loop playsInline className="block h-full w-full object-cover" />
                ))}
            </motion.div>
          )}

          {innerGlowSize > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[5] opacity-70"
              style={{ borderRadius: Math.max(0, borderRadius - borderWidth), boxShadow: `inset 0 0 ${innerGlowSize}px ${Math.ceil(innerGlowSize / 5)}px ${glowColor}` }}
            />
          )}

          <motion.div aria-hidden="true" className="absolute inset-0 z-[2]" style={{ background: "rgba(0,0,0,0.22)" }} animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.22 }} />

          {showPlayButton && (
            <div className="absolute inset-0 z-[3] flex items-center justify-center">
              <motion.div
                animate={{ scale: hovered ? 1.12 : 1, opacity: hovered ? 1 : 0.88 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                style={{ filter: "drop-shadow(0 6px 20px rgba(0,0,0,0.55))" }}
              >
                <PlayIcon size={playButtonSize} color={playButtonColor} />
              </motion.div>
            </div>
          )}
        </FrameWrapper>

        {showCursorLabel && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute z-[6] rounded-full text-[13px] font-semibold whitespace-nowrap"
            style={{ left: labelX, top: labelY, x: "-50%", y: "-50%", padding: "11px 24px", background: cursorLabelBg, color: cursorLabelColor, letterSpacing: "0.02em", boxShadow: "0 8px 24px rgba(0,0,0,0.25)" }}
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {cursorLabelText}
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="vgl-overlay"
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-label="Video player"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            onClick={(e) => e.target === e.currentTarget && close()}
            onKeyDown={(e) => e.key === "Escape" && close()}
            className="fixed inset-0 z-[99999] flex items-center justify-center p-6 outline-none backdrop-blur-[18px]"
            style={{ background: overlayColor }}
          >
            {lightboxGlow && (
              <motion.div
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.75 }}
                animate={{ opacity: 0.28, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="pointer-events-none absolute w-[65%]"
                style={{ maxWidth: lightboxMaxWidth, aspectRatio, background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 68%)`, filter: "blur(48px)" }}
              />
            )}

            {lightboxGlow && soundReactiveGlow && !isEmbed && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute w-[65%]"
                style={{ maxWidth: lightboxMaxWidth, aspectRatio, background: `radial-gradient(ellipse at center, ${glowColor} 0%, transparent 68%)`, filter: "blur(48px)", opacity: audioLevel }}
              />
            )}

            <motion.button
              key="vgl-close"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ delay: 0.1, duration: 0.2 }}
              onClick={close}
              aria-label="Close video"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-6 right-6 z-[2] flex h-11 w-11 items-center justify-center rounded-full border border-white/18 bg-white/10 backdrop-blur-[10px]"
            >
              <CloseIcon />
            </motion.button>

            <motion.div
              key="vgl-video"
              layoutId={useMorph ? frameLayoutId : undefined}
              initial={useMorph ? false : { opacity: 0, scale: 0.86, y: 44 }}
              animate={useMorph ? undefined : { opacity: 1, scale: 1, y: 0 }}
              exit={useMorph ? { opacity: 1 } : { opacity: 0, scale: 0.9, y: 24 }}
              transition={useMorph ? { type: "spring", damping: 28, stiffness: 260 } : { type: "spring", damping: 26, stiffness: 320, delay: 0.04 }}
              className="relative w-full overflow-hidden bg-black shadow-[0_36px_90px_rgba(0,0,0,0.85)]"
              style={{ maxWidth: lightboxMaxWidth, aspectRatio, borderRadius: lightboxBorderRadius, border: `${borderWidth}px solid ${borderColor}` }}
            >
              {innerGlowSize > 0 && (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 z-[3] opacity-70"
                  style={{ borderRadius: Math.max(0, lightboxBorderRadius - borderWidth), boxShadow: `inset 0 0 ${innerGlowSize}px ${Math.ceil(innerGlowSize / 5)}px ${glowColor}` }}
                />
              )}

              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-0 right-0 left-0 z-[2]"
                style={{ height: "42%", background: "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 100%)", borderRadius: `${Math.max(0, lightboxBorderRadius - 1)}px ${Math.max(0, lightboxBorderRadius - 1)}px 0 0` }}
              />

              {isEmbed ? (
                <iframe
                  key={playbackSrc}
                  src={playbackSrc}
                  className="block h-full w-full border-none"
                  allow="autoplay; fullscreen; picture-in-picture; accelerometer; encrypted-media; gyroscope"
                  allowFullScreen
                  title="Video"
                />
              ) : (
                <video
                  key={playbackSrc}
                  ref={videoRef}
                  src={playbackSrc}
                  title="Video"
                  crossOrigin={soundReactiveGlow && (showDemoSwitcher ? demoActiveType === "file" : videoType === "file") ? "anonymous" : undefined}
                  autoPlay
                  controls
                  playsInline
                  className="block h-full w-full bg-black"
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
