import type { Metadata } from "next";
import Link from "next/link";
import { CHECKED_ON, COMPARISONS } from "@/lib/comparisons";

export const metadata: Metadata = {
  alternates: { canonical: "/compare" },
  title: "ReactFrame Compared: Aceternity UI, Magic UI and React Bits Alternatives",
  description:
    "Honest comparisons of ReactFrame with Aceternity UI, Magic UI and React Bits: library size, free tiers, pricing, installation and AI tooling.",
};

export default function CompareIndexPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Compare</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">How ReactFrame compares</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/60 md:text-base">
        Side-by-side comparisons with the animated React component libraries people most often weigh ReactFrame against, including when the other one is the
        better pick. Competitor facts were checked in {CHECKED_ON}.
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPARISONS.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/compare/${c.slug}`}
              className="flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-300 ease-signature hover:border-foreground/20"
            >
              <span className="text-[15px] font-semibold tracking-tight">ReactFrame vs {c.name}</span>
              <span className="mt-2 text-sm leading-relaxed text-foreground/60">{c.about}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
