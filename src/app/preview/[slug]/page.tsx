"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { registryPreviews, registryPlaygroundPreviews } from "@/registry-preview";
import { getComponent } from "@/lib/catalog-data";
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
  // Hidden (unpublished) components are absent from the catalog, so their preview 404s too.
  const preview = getComponent(slug) ? (registryPlaygroundPreviews[slug] ?? registryPreviews[slug]) : undefined;
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
    const isScrollable = (el: Element) => {
      const style = window.getComputedStyle(el);
      return /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight;
    };

    const onWheel = (e: WheelEvent) => {
      // A component (e.g. a wheel-driven carousel) already used this event, so it must not scroll the page too.
      if (e.defaultPrevented) return;
      const doc = document.documentElement;

      // A "scroll-jacked" component (scroll-zoom-media-reveal and siblings)
      // owns a nested overflow-y-auto region with real scroll room of its
      // own. That inner region should keep consuming wheel input until IT
      // hits its own edge, same as any nested scrollable element would —
      // only once it's exhausted should the event fall through to this
      // document's own edge check below. Without this, the outer document
      // (which rarely needs to scroll at all for a short demo) reports
      // atTop/atBottom as permanently true and preventDefault()s every
      // tick before the inner region ever gets a chance to move.
      let node: Element | null = e.target as Element | null;
      while (node && node !== doc) {
        if (isScrollable(node)) {
          const atInnerTop = node.scrollTop <= 0;
          const atInnerBottom = node.scrollTop + node.clientHeight >= node.scrollHeight - 1;
          if ((e.deltaY < 0 && !atInnerTop) || (e.deltaY > 0 && !atInnerBottom)) return;
          break;
        }
        node = node.parentElement;
      }

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
        // No padding at any breakpoint: the preview should fill its frame
        // edge to edge — the full content column at the Desktop device
        // width, and the device frame's own border at Tablet/Mobile —
        // rather than floating inside it with a gap.
        "flex min-h-[400px] flex-col items-center",
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
