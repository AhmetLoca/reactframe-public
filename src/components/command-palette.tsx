"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { components } from "@/lib/catalog-data";
import { cn } from "@/lib/utils";

type Result = {
  id: string;
  label: string;
  sublabel?: string;
  href: string;
  group: "Pages" | "Components";
};

const PAGE_RESULTS: Result[] = [
  { id: "home", label: "Home", href: "/", group: "Pages" },
  { id: "components", label: "Components", sublabel: "251+ free and premium", href: "/components", group: "Pages" },
  { id: "elements", label: "Elements", href: "/elements", group: "Pages" },
  { id: "blocks", label: "Blocks", href: "/blocks", group: "Pages" },
  { id: "pages", label: "Pages", href: "/pages", group: "Pages" },
  { id: "templates", label: "Templates", href: "/templates", group: "Pages" },
  { id: "docs", label: "Documentation", href: "/docs", group: "Pages" },
  { id: "changelog", label: "Changelog", href: "/changelog", group: "Pages" },
  { id: "blog", label: "Blog", href: "/blog", group: "Pages" },
  { id: "faq", label: "FAQ", href: "/faq", group: "Pages" },
  { id: "help-center", label: "Help Center", href: "/help-center", group: "Pages" },
  { id: "support", label: "Support", href: "/support", group: "Pages" },
  { id: "license", label: "License", href: "/license", group: "Pages" },
  { id: "premium", label: "Premium", href: "/premium", group: "Pages" },
];

const COMPONENT_RESULTS: Result[] = components.map((c) => ({
  id: `component-${c.slug}`,
  label: c.name,
  sublabel: c.category,
  href: `/components/${c.slug}`,
  group: "Components",
}));

const ALL_RESULTS = [...PAGE_RESULTS, ...COMPONENT_RESULTS];
const MAX_RESULTS = 8;

function isTypingTarget(el: EventTarget | null) {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || el.isContentEditable;
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PAGE_RESULTS.slice(0, MAX_RESULTS);
    return ALL_RESULTS.filter((r) => r.label.toLowerCase().includes(q) || r.sublabel?.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
  }, [query]);

  const close = React.useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  const go = React.useCallback(
    (href: string) => {
      close();
      router.push(href);
    },
    [close, router],
  );

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
        return;
      }
      if (e.key === "/" && !open && !isTypingTarget(e.target)) {
        e.preventDefault();
        setOpen(true);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  React.useEffect(() => {
    if (open) requestAnimationFrame(() => inputRef.current?.focus());
  }, [open]);

  const handleQueryChange = (next: string) => {
    setQuery(next);
    setActiveIndex(0);
  };

  const handleDialogKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = results[activeIndex];
      if (r) go(r.href);
    }
  };

  const grouped = React.useMemo(() => {
    const groups = new Map<Result["group"], Result[]>();
    for (const r of results) {
      const list = groups.get(r.group) ?? [];
      list.push(r);
      groups.set(r.group, list);
    }
    return groups;
  }, [results]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="hidden items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm text-foreground/45 transition-colors hover:border-foreground/30 hover:text-foreground/70 md:flex"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-3.5 w-3.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        Search
        <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground/40">⌘K</kbd>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/60 px-4 pt-[15vh] backdrop-blur-sm" onClick={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleDialogKeyDown}
            className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4 shrink-0 text-foreground/35">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder="Search components, docs, pages…"
                className="w-full bg-transparent py-3.5 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none"
              />
              <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-foreground/35 sm:block">ESC</kbd>
            </div>

            <div className="max-h-80 overflow-y-auto p-1.5">
              {results.length === 0 && <p className="px-3 py-8 text-center text-sm text-foreground/40">No results for &ldquo;{query}&rdquo;.</p>}

              {Array.from(grouped.entries()).map(([group, items]) => (
                <div key={group} className="mb-1 last:mb-0">
                  <div className="px-3 py-1.5 text-[11px] font-medium tracking-wide text-foreground/35 uppercase">{group}</div>
                  {items.map((r) => {
                    const globalIndex = results.indexOf(r);
                    const active = globalIndex === activeIndex;
                    return (
                      <button
                        key={r.id}
                        type="button"
                        onMouseEnter={() => setActiveIndex(globalIndex)}
                        onClick={() => go(r.href)}
                        className={cn(
                          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors",
                          active ? "bg-foreground/8 text-foreground" : "text-foreground/70",
                        )}
                      >
                        <span>{r.label}</span>
                        {r.sublabel && <span className="text-xs text-foreground/35">{r.sublabel}</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
