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

// Hand-picked, shown in this order.
const FEATURED_SLUGS = [
  "living-orb-ai",
  "ai-voice-02",
  "ai-image-loader-01",
  "orbit-logo-wheel",
  "ai-chat-prompt",
  "gallery-curve",
];

export default function Home() {
  const featured = FEATURED_SLUGS.map((slug) => components.find((c) => c.slug === slug)).filter(
    (c): c is (typeof components)[number] => c !== undefined,
  );

  return (
    <>
      <Hero />

      <section id="components" className="mx-auto max-w-6xl px-6 pb-16 pt-28">
        <div className="mb-12 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Handpicked</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Featured <span className="text-foreground/50">Components</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((component) => (
            <CatalogCard key={component.slug} component={component} mediaClassName="aspect-[4/3]" />
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
        <div className="mb-12 text-center">
          <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Kits</p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
            Start from a <span className="text-foreground/50">Kit</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-balance text-foreground/60">
            Sets of components that share one design language, so the page looks like one designer made it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* The six design-led kits; UI Elements lives on /kits and /elements. */}
          {getKitEntries()
            .filter((kit) => kit.slug !== "ui-elements")
            .map((kit) => (
              <KitCard key={kit.slug} kit={kit} cover={KITS.find((k) => k.slug === kit.slug)!.cover} />
            ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/kits"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
          >
            See All Kits
          </Link>
        </div>
      </section>

      <KindWords />
      <AllAccessPricing />
    </>
  );
}
