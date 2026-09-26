"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { hasThumbnailImage, hasThumbnailVideo } from "@/lib/thumbnails";

// Every card shows a static thumbnail (public/thumbnails/<slug>.webp) rather
// than mounting the live registry preview — grid cards otherwise run canvas
// loops, WebGL contexts, and rAF-driven motion for every visible card at
// once, which pegs the CPU as you scroll a catalog of 150+ components, and
// pulls the entire registry (4MB+ of source across every component) into the
// bundle of whatever page renders the grid. Slugs without a thumbnail file
// yet show a plain placeholder icon instead — thumbnails are rolled out
// incrementally, no code change needed here as they land.
//
// hasThumbnailImage/hasThumbnailVideo come from a build-time manifest (see
// scripts/generate-thumbnail-manifest.mts) rather than just trying the <img>/
// <video> and catching the error — a catalog page mounts 100+ of these at
// once, and firing a doomed request per missing file for each of them was
// what made /components' load event take ~2.5s instead of a few hundred ms.
export function ComponentCardMedia({
  slug,
  previewWrapperClassName,
  hovering = false,
}: {
  slug: string;
  /** Padding/centering classes for the no-thumbnail-yet placeholder's outer box. */
  previewWrapperClassName?: string;
  /**
   * Controlled from the parent card, not tracked internally — the card's
   * click-through overlay `<Link>` sits above this component in z-order, so
   * a mouseenter/mouseleave bound here would never fire. The parent's outer
   * card element is the nearest ancestor that actually receives hover.
   */
  hovering?: boolean;
}) {
  const knownImage = hasThumbnailImage(slug);
  const knownVideo = hasThumbnailVideo(slug);

  const [thumbnailFailed, setThumbnailFailed] = React.useState(false);
  const [videoFailed, setVideoFailed] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (!knownImage || thumbnailFailed) return;
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
  }, [knownImage, thumbnailFailed, slug]);

  // A hover-preview clip (public/thumbnails/<slug>.mp4) is optional, same
  // incremental-rollout deal as the static thumbnail: try it, and if it
  // 404s, quietly fall back to the plain static image with no code change
  // needed elsewhere. preload="metadata" keeps the fallback cheap — the
  // clip's body is never fetched unless this specific card is hovered.
  React.useEffect(() => {
    if (!knownVideo || videoFailed) return;
    const video = videoRef.current;
    if (!video) return;
    const handleError = () => setVideoFailed(true);
    video.addEventListener("error", handleError);
    return () => video.removeEventListener("error", handleError);
  }, [knownVideo, videoFailed, slug]);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video || !knownVideo || videoFailed) return;
    if (hovering) {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [hovering, knownVideo, videoFailed]);

  if (knownImage && !thumbnailFailed) {
    return (
      <div ref={ref} className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          src={`/thumbnails/${slug}.webp`}
          alt=""
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {knownVideo && !videoFailed && (
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

  // No thumbnail yet for this slug. Previously this fell back to mounting
  // the real live registry preview (canvas loops, WebGL, rAF motion) right
  // in the grid card, which pegs the CPU once enough cards are on screen at
  // once. Thumbnails are supplied for every slug as they're ready, so this
  // is just an inert placeholder in the meantime.
  return (
    <div
      ref={ref}
      className={cn("pointer-events-none flex h-full w-full items-center justify-center overflow-hidden bg-[#080808]", previewWrapperClassName)}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/15" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    </div>
  );
}
