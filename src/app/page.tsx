import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/hero";
import { AllAccessPricing } from "@/components/all-access-pricing";
import { KindWords } from "@/components/kind-words";
import { components } from "@/lib/catalog-data";
import { CatalogCard } from "@/components/components-catalog";
import { KitCard } from "@/components/kit-card";
import { KITS } from "@/lib/kits";
import { getKitEntries } from "@/lib/llms-content";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const FEATURED_COUNT = 9;

export default function Home() {
  const featured = components.slice(0, FEATURED_COUNT);

  return (
    <>
      <Hero />

      <section id="components" className="mx-auto max-w-6xl px-6 pb-16 pt-28">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured components
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((component) => (
            <CatalogCard key={component.slug} component={component} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
          >
            See All Components
          </Link>
        </div>
      </section>

      <section id="kits" className="mx-auto max-w-6xl px-6 pb-16 pt-16">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Start from a kit</h2>
            <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-foreground/60">
              Sets of components that share one design language, so the page looks like one designer made it.
            </p>
          </div>
          <Link href="/kits" className="text-sm font-medium text-foreground/60 transition-colors hover:text-foreground">
            All kits &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* The six design-led kits; UI Elements lives on /kits and /elements. */}
          {getKitEntries()
            .filter((kit) => kit.slug !== "ui-elements")
            .map((kit) => (
              <KitCard key={kit.slug} kit={kit} cover={KITS.find((k) => k.slug === kit.slug)!.cover} />
            ))}
        </div>
      </section>

      <KindWords />
      <AllAccessPricing />
    </>
  );
}
