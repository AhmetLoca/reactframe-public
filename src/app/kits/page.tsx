import type { Metadata } from "next";
import Link from "next/link";
import { KITS } from "@/lib/kits";
import { getKitEntries } from "@/lib/llms-content";
import { KitCard } from "@/components/kit-card";

export const metadata: Metadata = {
  alternates: { canonical: "/kits" },
  title: "React UI Kits: Component Sets That Work Together",
  description:
    "Curated sets of React + Tailwind components that share one design language: a full marketing site, reviews, AI product UI, dashboards, mockups and growth popups.",
};

export default function KitsPage() {
  const entries = getKitEntries();
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Kits</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">Component sets that work together</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/60 md:text-base">
        Each kit groups components that share one design language, so a page built from it looks like one designer made it. Pick a kit, or{" "}
        <Link href="/docs/ai" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
          ask your AI to build with one
        </Link>
        .
      </p>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {entries.map((kit) => (
          <KitCard key={kit.slug} kit={kit} cover={KITS.find((k) => k.slug === kit.slug)!.cover} />
        ))}
      </div>
    </div>
  );
}
