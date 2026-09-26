import type { Metadata } from "next";
import Link from "next/link";
import { COLLECTIONS, collectionMembers } from "@/lib/collections";

export const metadata: Metadata = {
  alternates: { canonical: "/collections" },
  title: "React Component Collections by Use Case",
  description:
    "ReactFrame components grouped by what you're building: AI voice and chat, testimonials and reviews, galleries, carousels, backgrounds, navbars, footers, heroes, charts and more.",
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Collections</p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance md:text-4xl">React components by use case</h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-foreground/60 md:text-base">
        Every ReactFrame component for a job in one place, with advice on which to pick. Looking for sets that share one design language instead? See{" "}
        <Link href="/kits" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
          Kits
        </Link>
        .
      </p>

      <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTIONS.map((collection) => {
          const members = collectionMembers(collection);
          const free = members.filter((c) => c.free).length;
          return (
            <li key={collection.slug}>
              <Link
                href={`/collections/${collection.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors duration-300 ease-signature hover:border-foreground/20"
              >
                <span className="text-[15px] font-semibold tracking-tight">{collection.title}</span>
                <span className="mt-2 text-sm leading-relaxed text-foreground/60">{collection.metaDescription}</span>
                <span className="mt-auto pt-4 text-xs text-foreground/45">
                  {members.length} components · {free === members.length ? "all free" : free === 0 ? "premium" : `${free} free`}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
