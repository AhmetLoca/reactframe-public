"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { registryPreviews, registryPlaygroundPreviews } from "@/registry-preview";
import { cn } from "@/lib/utils";

// Rendered inside an <iframe> by the component detail page's device
// switcher. An iframe gets its own real viewport, so Tailwind's sm:/md:
// breakpoints inside the previewed component respond to the iframe's
// actual width — a plain resized <div> in the parent document can't do
// that, since those breakpoints are media queries against the top-level
// viewport. Reports its content height to the parent via postMessage so
// the iframe can be sized to fit without an internal scrollbar.
export default function PreviewPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const isPlayground = slug in registryPlaygroundPreviews;
  const preview = registryPlaygroundPreviews[slug] ?? registryPreviews[slug];
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // The iframe's own box is sized (by the parent) to match this document's
    // natural content height, so there's normally nothing left to scroll
    // inside it — but a cross-document iframe never chain-scrolls wheel
    // input to its parent page on its own. With no help, a mouse sitting
    // anywhere over the iframe (near-guaranteed for the page's tallest
    // previews, which can run past 2000px) simply can't scroll the outer
    // page at all. Forward wheel input to the parent whenever this document
    // is already at its own top/bottom edge — which, since it has no
    // scrollable room of its own in the common case, is on effectively
    // every tick. The handful of genuinely scroll-jacked components (which
    // *do* have real internal scroll room, deliberately capped short) keep
    // their own scroll until they hit their own edge, same as any nested
    // scrollable element would.
    const onWheel = (e: WheelEvent) => {
      const doc = document.documentElement;
      const atTop = doc.scrollTop <= 0;
      const atBottom = doc.scrollTop + doc.clientHeight >= doc.scrollHeight - 1;
      if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
        e.preventDefault();
        window.parent.postMessage({ type: "loca-preview-wheel", slug, deltaY: e.deltaY }, "*");
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });

    if (!ref.current) return () => window.removeEventListener("wheel", onWheel);
    const report = () => {
      window.parent.postMessage({ type: "loca-preview-height", slug, height: document.documentElement.scrollHeight }, "*");
    };
    const ro = new ResizeObserver(report);
    ro.observe(ref.current);
    // ResizeObserver only fires when the observed box's own size changes —
    // a dropdown/tooltip/popover positioned absolutely (e.g. navbar-menu)
    // extends past the wrapper without growing its bounding box, so it
    // wouldn't be caught by ResizeObserver alone. A MutationObserver on the
    // whole subtree catches that: any attribute/style change opening such a
    // panel re-triggers a measurement of documentElement.scrollHeight, which
    // does include absolutely-positioned overflow.
    const mo = new MutationObserver(report);
    mo.observe(ref.current, { attributes: true, childList: true, subtree: true });
    report();
    return () => {
      window.removeEventListener("wheel", onWheel);
      ro.disconnect();
      mo.disconnect();
    };
  }, [slug]);

  return (
    <div
      ref={ref}
      className={cn(
        // p-6 (24px) matches the outer page's own container padding
        // (max-w-6xl px-6 in the detail page), so at the Mobile device
        // width — where the iframe's own viewport is only 375px — this
        // wrapper's left/right edges line up with the page's text above
        // it instead of adding another 32px on top and reading as an
        // extra, unexplained indent. sm:p-8 keeps the roomier padding at
        // Tablet/Desktop widths where 32px is a small enough fraction of
        // the total width to not read as misaligned.
        "flex min-h-[400px] flex-col items-center p-6 sm:p-8",
        // Playground already renders its own separate, bordered canvas and
        // controls boxes — boxing this outer wrapper too would nest a third
        // box around both of them. Non-Playground previews have no box of
        // their own, so this wrapper is the only one and needs it.
        isPlayground ? "bg-background" : "rounded-xl border border-border bg-card",
      )}
    >
      {/*
        items-center here only centers horizontally (this is a column flex
        container, so items-center is the cross-axis). Deliberately not
        vertically centered: components like card-stack manage their own
        full-viewport-height scroll-jacked section, and vertically centering
        the flex main axis would push roughly half of that tall child above
        the fold — at iframe scrollTop 0 you'd see the section's middle
        instead of its start. Small components still look fine top-aligned
        with the p-8 padding; this trades a little centering polish for
        correctness on components that need real scroll position 0 to mean
        "start of section".

        min-h-[400px] (a fixed floor), not min-h-screen: this div is the one
        ResizeObserver/MutationObserver measure below to report content
        height back to the parent, which resizes *this iframe's own*
        viewport in response. min-h-screen (100vh) would resolve against
        that same iframe viewport, so growing the iframe would grow the
        vh basis, which would grow the reported scrollHeight, which would
        grow the iframe again — a feedback loop that converges wherever
        it happens to start rather than at the component's real content
        height (verified: it froze short chat-widget popups mid-render).
        A fixed px floor has no such loop. Components using h-screen/100vh
        internally (e.g. card-stack) are unaffected — that still resolves
        against the iframe's real live viewport, independent of this
        wrapper's own min-height.
      */}
      {preview ? preview() : null}
    </div>
  );
}
