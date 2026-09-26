"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Neighbour = { slug: string; name: string };

// Previous / next through the listing this page belongs to (Elements, Blocks or Components), with
// the arrow keys as a shortcut. Keys only fire when nothing is focused, so typing in a field or
// driving a demo that uses the arrow keys (sliders, carousels, tabs) never changes the page.
export function SequenceNav({ label, position, total, prev, next }: { label: string; position: number; total: number; prev: Neighbour; next: Neighbour }) {
  const router = useRouter();

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
      const active = document.activeElement;
      if (active && active !== document.body) return;
      if (e.key === "ArrowLeft") router.push(`/components/${prev.slug}`);
      if (e.key === "ArrowRight") router.push(`/components/${next.slug}`);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, prev.slug, next.slug]);

  return (
    <nav aria-label={`${label} navigation`} className="mt-10">
      <p className="mb-3 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        {label} · {position} of {total}
      </p>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Link
          href={`/components/${prev.slug}`}
          rel="prev"
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors duration-300 ease-signature hover:border-foreground/20 sm:px-5"
        >
          <ArrowLeft className="size-4 shrink-0 text-foreground/40 transition-transform duration-300 ease-signature group-hover:-translate-x-0.5 group-hover:text-foreground" />
          <span className="min-w-0">
            <span className="block text-xs text-foreground/40">Previous</span>
            <span className="block truncate text-sm font-medium">{prev.name}</span>
          </span>
        </Link>
        <Link
          href={`/components/${next.slug}`}
          rel="next"
          className="group flex items-center justify-end gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-right transition-colors duration-300 ease-signature hover:border-foreground/20 sm:px-5"
        >
          <span className="min-w-0">
            <span className="block text-xs text-foreground/40">Next</span>
            <span className="block truncate text-sm font-medium">{next.name}</span>
          </span>
          <ArrowRight className="size-4 shrink-0 text-foreground/40 transition-transform duration-300 ease-signature group-hover:translate-x-0.5 group-hover:text-foreground" />
        </Link>
      </div>
      <p className="mt-2 hidden text-center text-xs text-foreground/30 sm:block">
        Tip: use the <kbd className="font-mono">←</kbd> <kbd className="font-mono">→</kbd> keys
      </p>
    </nav>
  );
}
