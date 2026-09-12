"use client";

import * as React from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

const COLLAPSED_HEIGHT = 240;
const EXPANDED_HEIGHT = 560;

export function CodeSurface({
  code,
  className,
  bare = false,
}: {
  code: string;
  className?: string;
  /** True when already nested inside a titled card — skips the pre's own border/rounded/bg so it doesn't double up with the parent's. */
  bare?: boolean;
}) {
  const preRef = React.useRef<HTMLPreElement>(null);
  const [canScrollUp, setCanScrollUp] = React.useState(false);
  const [canScrollDown, setCanScrollDown] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);

  const updateScrollState = React.useCallback(() => {
    const el = preRef.current;
    if (!el) return;
    setCanScrollUp(el.scrollTop > 4);
    setCanScrollDown(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = preRef.current;
    if (!el) return;
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [code, expanded, updateScrollState]);

  // Reset to collapsed whenever the code itself changes (e.g. switching
  // TS/JS or Tailwind/CSS variant) — expanding one variant shouldn't leave
  // the next one already expanded.
  React.useEffect(() => {
    setExpanded(false);
  }, [code]);

  return (
    <div className={cn("relative", className)}>
      <pre
        ref={preRef}
        onScroll={updateScrollState}
        data-lenis-prevent={expanded || undefined}
        style={{ maxHeight: expanded ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT }}
        className={cn(
          "code-scrollbar p-4 text-[13px] leading-relaxed transition-[max-height] duration-300 ease-signature",
          // Collapsed: no scrolling at all — the chevron button is the only
          // way to reveal more, so a wheel/trackpad gesture over the short
          // box shouldn't silently scroll its hidden content. Only once
          // expanded does it become a real scrollable box (and opt out of
          // the page's Lenis smooth-scroll so wheel actually reaches it).
          expanded ? "overflow-auto" : "overflow-hidden",
          bare ? "rounded-b-xl border-t border-border" : "rounded-xl border border-border bg-card",
        )}
      >
        <code className="font-mono text-foreground/80">{code}</code>
      </pre>

      {/* Fade hint that there's more code above to scroll back to. */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-card to-transparent transition-opacity duration-300 ease-signature",
          bare ? "" : "rounded-t-xl",
          canScrollUp ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Fade + chevron below — while collapsed this doubles as an "expand"
          button (the box's own scrollbar is thin/subtle by design, so a
          flat cut-off otherwise reads as "that's the whole file"). Once
          expanded it's just a scroll hint again. */}
      {!expanded && canScrollDown ? (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label="Show more code"
          className="absolute inset-x-0 bottom-0 flex h-12 items-end justify-center rounded-b-xl bg-gradient-to-t from-card to-transparent pb-1.5 opacity-100 transition-opacity duration-300 ease-signature hover:from-card"
        >
          <ChevronDown className="h-3.5 w-3.5 animate-bounce text-foreground/40" />
        </button>
      ) : (
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 flex h-12 items-end justify-center rounded-b-xl bg-gradient-to-t from-card to-transparent pb-1.5 transition-opacity duration-300 ease-signature",
            canScrollDown ? "opacity-100" : "opacity-0",
          )}
        >
          <ChevronDown className="h-3.5 w-3.5 animate-bounce text-foreground/40" />
        </div>
      )}
    </div>
  );
}

export function CodeBlock({ code, className }: { code: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied (permissions, insecure context) —
      // fail quietly rather than surface an unhandled rejection.
    }
  }

  return (
    <div className={cn("relative", className)}>
      <button
        onClick={copy}
        aria-label="Copy code"
        className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background/80 text-foreground/60 backdrop-blur transition-colors duration-300 ease-signature hover:text-foreground"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
      <CodeSurface code={code} />
    </div>
  );
}
