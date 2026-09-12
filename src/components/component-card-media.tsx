"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Prefer a static thumbnail (public/thumbnails/<slug>.webp) over mounting the
// live registry preview — grid cards otherwise run canvas loops, WebGL
// contexts, and rAF-driven motion for every visible card at once, which pegs
// the CPU as you scroll a catalog of 150+ components. Falls back to the real
// live preview automatically when no thumbnail file exists yet for a slug,
// so thumbnails can be rolled out incrementally without code changes.
export function ComponentCardMedia({
  slug,
  render,
  lazy = false,
  previewScaleClassName,
  previewWrapperClassName,
  hovering = false,
}: {
  slug: string;
  render: () => React.ReactNode;
  lazy?: boolean;
  /**
   * Applied only around the live-preview fallback, not the thumbnail image —
   * live registry previews render at their natural (often ~480px+) width and
   * need a `w-[…] scale-[…]` wrapper to shrink into a card. The thumbnail
   * itself always fills the panel edge-to-edge via object-cover instead.
   */
  previewScaleClassName?: string;
  /** Padding/centering classes for the live-preview fallback's outer box. */
  previewWrapperClassName?: string;
  /**
   * Controlled from the parent card, not tracked internally — the card's
   * click-through overlay `<Link>` sits above this component in z-order, so
   * a mouseenter/mouseleave bound here would never fire. The parent's outer
   * card element is the nearest ancestor that actually receives hover.
   */
  hovering?: boolean;
}) {
  const [thumbnailFailed, setThumbnailFailed] = React.useState(false);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = React.useState(!lazy);

  React.useEffect(() => {
    if (!lazy || visible) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { rootMargin: "200px 0px", threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [lazy, visible]);

  React.useEffect(() => {
    if (thumbnailFailed) return;
    const img = imgRef.current;
    if (!img) return;
    // Bound imperatively (not via the JSX onError prop) — React's synthetic
    // error-event delegation was unreliable for this element in testing.
    if (img.complete && img.naturalWidth === 0) {
      setThumbnailFailed(true);
      return;
    }
    const handleError = () => setThumbnailFailed(true);
    img.addEventListener("error", handleError);
    return () => img.removeEventListener("error", handleError);
  }, [thumbnailFailed, slug]);

  // A hover-preview clip (public/thumbnails/<slug>.mp4) is optional, same
  // incremental-rollout deal as the static thumbnail: try it, and if it
  // 404s, quietly fall back to the plain static image with no code change
  // needed elsewhere. preload="metadata" keeps the fallback cheap — the
  // clip's body is never fetched unless this specific card is hovered.
  React.useEffect(() => {
    if (videoFailed) return;
    const video = videoRef.current;
    if (!video) return;
    const handleError = () => setVideoFailed(true);
    video.addEventListener("error", handleError);
    return () => video.removeEventListener("error", handleError);
  }, [videoFailed, slug]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || videoFailed) return;
    if (hovering) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hovering, videoFailed]);

  if (!thumbnailFailed) {
    return (
      <div ref={ref} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={`/thumbnails/${slug}.webp`}
          alt=""
          className="h-full w-full object-cover"
        />
        {!videoFailed && (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={`/thumbnails/${slug}.webp`}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-200",
              hovering ? "opacity-100" : "opacity-0",
            )}
          >
            <source src={`/thumbnails/${slug}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={cn("pointer-events-none flex h-full w-full items-center justify-center overflow-hidden", previewWrapperClassName)}
      // Some live previews (video-scroll-story, container-scroll-ipad,
      // scroll-card-stack, discord-chat-widget, etc.) have their own
      // internal overflow-y-auto scroll container for a scroll-jacked or
      // chat-style demo. `pointer-events-none` is supposed to make this
      // whole subtree untargetable, but wheel/trackpad events aren't
      // reliably blocked by pointer-events across all browsers — when they
      // aren't, the nested container hijacks the scroll gesture and the
      // page appears to "freeze" mid-scroll. Intercept wheel in the capture
      // phase (before it can reach any nested scrollable child) and forward
      // it to the window directly, so this preview can never eat page scroll.
      onWheelCapture={(e) => {
        e.preventDefault();
        window.scrollBy({ top: e.deltaY, left: e.deltaX });
      }}
    >
      <div className={previewScaleClassName}>{visible ? render() : null}</div>
    </div>
  );
}
