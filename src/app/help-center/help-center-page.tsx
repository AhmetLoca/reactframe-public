"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  {
    href: "/faq",
    label: "Frequently Asked Questions",
    description: "Answers to common questions about components, licensing, and setup.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9.2a2.5 2.5 0 0 1 4.8 1c0 1.6-2.3 1.9-2.3 3.3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    href: "/license",
    label: "License",
    description: "What free and premium components let you do in your own projects.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3v3.5L5.5 10 3 12.5 9 18.5l2.5-2.5" />
        <path d="M13 5l6 6-8 8-6-6z" />
        <path d="M14.5 9.5l-5 5" />
      </svg>
    ),
  },
  {
    href: "/refund-policy",
    label: "Payment",
    description: "Refunds, billing, and how premium unlocks work.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2.5" y="5.5" width="19" height="13" rx="2" />
        <path d="M2.5 9.5h19" />
        <path d="M6 14.5h4" />
      </svg>
    ),
  },
  {
    href: "/support",
    label: "Support",
    description: "Stuck on something? Email us directly and get a real reply.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 6.5h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z" />
        <path d="M3 7.5l9 6.5 9-6.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function HelpCenterPage() {
  const [query, setQuery] = React.useState("");

  const q = query.trim().toLowerCase();
  const visible = q ? CATEGORIES.filter((c) => c.label.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : CATEGORIES;

  return (
    <main className="mx-auto max-w-3xl px-6 pt-20 pb-24 text-center md:pt-28">
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">Help Center</span>

      <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">Hi, how can we help?</h1>

      <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-foreground/60">
        Search below, or jump straight into FAQs, License terms, Payment, or Support.
      </p>

      <div className="relative mx-auto mt-8 max-w-xl">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-foreground/35"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for help…"
          className="w-full rounded-full border border-border bg-transparent py-3 pr-4 pl-11 text-sm text-foreground placeholder:text-foreground/35 focus:border-foreground/30 focus:outline-none"
        />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 text-left sm:grid-cols-2">
        {visible.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-colors duration-300 ease-signature hover:border-foreground/20"
          >
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-full border border-border text-foreground/70", "group-hover:text-foreground")}>
              {c.icon}
            </div>
            <div className="mt-4 font-medium text-foreground">{c.label}</div>
            <p className="mt-1 text-sm text-foreground/50">{c.description}</p>
          </Link>
        ))}

        {visible.length === 0 && <p className="col-span-full py-6 text-sm text-foreground/45">No matches for &ldquo;{query}&rdquo;.</p>}
      </div>
    </main>
  );
}
