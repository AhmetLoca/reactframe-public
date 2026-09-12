"use client";

import * as React from "react";

// Wraps a /templates/preview/[slug]/view or /pages/preview/[slug]/view
// page's content. These render inside LayoutPreview's device-frame
// iframe, which has its own real scroll — but a cross-document iframe
// never chain-scrolls wheel input to its parent page on its own, so once
// this document hits its own top/bottom edge, further scroll input just
// does nothing until the visitor moves their mouse off the frame. Two
// message types handle the two ways scroll needs to cross that boundary:
//
// - "loca-preview-scroll-into" (parent → child): while the frame is the
//   dominant thing in the outer viewport, LayoutPreview's DeviceFrame
//   captures wheel input at the window level (not dependent on the
//   cursor sitting exactly over the iframe box — Lenis eases the outer
//   page's scroll for ~1s after the last tick, so the frame keeps
//   drifting under a stationary cursor and precise hit-testing isn't
//   reliable) and forwards it here. Apply as much of it as this document
//   has room for.
// - "loca-preview-wheel" (child → parent): whatever's left over after
//   applying that — because this document is already at the edge in
//   that direction — goes back to the parent, which is what actually
//   resumes the outer page's own scroll once this content runs out. The
//   same message also covers the simpler case: wheel input received
//   directly (cursor genuinely over the frame) once already at an edge.
export function PreviewViewFrame({ slug, children }: { slug: string; children: React.ReactNode }) {
  React.useEffect(() => {
    const forwardOverflow = (deltaY: number) => {
      window.parent.postMessage({ type: "loca-preview-wheel", slug, deltaY }, "*");
    };

    const onWheel = (e: WheelEvent) => {
      const doc = document.documentElement;
      const atTop = doc.scrollTop <= 0;
      const atBottom = doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
        forwardOverflow(e.deltaY);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    const onMessage = (e: MessageEvent) => {
      if (e.data?.type !== "loca-preview-scroll-into" || e.data.slug !== slug) return;
      const doc = document.documentElement;
      const maxScrollTop = doc.scrollHeight - doc.clientHeight;
      const target = Math.min(maxScrollTop, Math.max(0, doc.scrollTop + e.data.deltaY));
      const consumed = target - doc.scrollTop;
      doc.scrollTop = target;
      const overflow = e.data.deltaY - consumed;
      if (overflow !== 0) forwardOverflow(overflow);
    };
    window.addEventListener("message", onMessage);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("message", onMessage);
    };
  }, [slug]);

  return <>{children}</>;
}
