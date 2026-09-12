"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/elements", label: "Elements" },
  { href: "/components", label: "Components" },
  { href: "/blocks", label: "Blocks" },
  { href: "/pages", label: "Pages" },
  { href: "/templates", label: "Templates" },
  { href: "/dashboards", label: "Dashboards" },
];

// A page is "active" for its own route and anything nested under it
// (e.g. /components/countdown-timer should highlight "Components"), but
// never for "/" itself — every route starts with "/" so that prefix
// check would otherwise light up every tab at once.
function isActivePath(pathname: string, href: string) {
  return href !== "/" && (pathname === href || pathname.startsWith(`${href}/`));
}

const UPDATES_LINKS = [
  { href: "/docs", label: "Documentation", description: "How to install and use everything" },
  { href: "/changelog", label: "Changelog", description: "What's new in the catalog" },
  { href: "/blog", label: "Blog", description: "Notes on design engineering" },
  { href: "/support", label: "Support", description: "FAQs and getting help" },
  { href: "/license", label: "License", description: "Terms for using components" },
  { href: "/help-center", label: "Help Center", description: "Search FAQs, license and payment info" },
];

function UpdatesMenu() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const active = UPDATES_LINKS.some((link) => isActivePath(pathname, link.href));

  React.useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cn(
          "flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors duration-200 ease-signature",
          active ? "bg-foreground/10 font-medium text-foreground" : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground",
        )}
      >
        Updates
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn("h-3.5 w-3.5 transition-transform duration-200 ease-signature", open && "rotate-180")}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-1/2 mt-3 w-56 -translate-x-1/2 rounded-xl border border-border bg-card p-1.5 shadow-lg">
          {UPDATES_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 transition-colors hover:bg-foreground/5"
            >
              <div className="text-sm font-medium text-foreground">{link.label}</div>
              <div className="mt-0.5 text-xs text-foreground/45">{link.description}</div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Nav() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 text-sm text-foreground/60 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 transition-colors duration-200 ease-signature",
                  active ? "bg-foreground/10 font-medium text-foreground" : "hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <UpdatesMenu />
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/components"
            className="hidden rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80 md:block"
          >
            Browse Components
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border md:hidden"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none">
              {mobileOpen ? (
                <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              ) : (
                <path d="M2.5 2.5h11M2.5 8h7.5M2.5 13.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-6 py-4 text-sm md:hidden">
          {NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2 py-2.5 transition-colors",
                  active ? "bg-foreground/10 font-medium text-foreground" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <p className="mt-2 px-2 font-mono text-xs tracking-[0.15em] text-foreground/40 uppercase">Updates</p>
          {UPDATES_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-2 py-2.5 transition-colors",
                  active ? "bg-foreground/10 font-medium text-foreground" : "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
