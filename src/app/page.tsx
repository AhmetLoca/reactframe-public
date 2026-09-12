"use client";

import Link from "next/link";
import { Hero } from "@/components/hero";
import { AllAccessPricing } from "@/components/all-access-pricing";
import { KindWords } from "@/components/kind-words";
import { components } from "@/lib/catalog-data";
import { registryPreviews } from "@/registry-preview";
import { ComponentCardMedia } from "@/components/component-card-media";

const FEATURED_COUNT = 6;

export default function Home() {
  const featured = components.slice(0, FEATURED_COUNT);

  return (
    <>
      <Hero />

      <section id="components" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured components
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {featured.map((component) => {
            const preview = registryPreviews[component.slug];
            return (
              <div
                key={component.slug}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
              >
                {/*
                  This overlay Link (not a wrapping one) is deliberate: several
                  previews (footers, navbar-menu) render their own real <a>
                  tags, and nesting an <a> inside a wrapping Link's <a> is
                  invalid HTML that breaks hydration. An absolutely-positioned
                  sibling link keeps the whole card clickable without nesting.
                */}
                <Link
                  href={`/components/${component.slug}`}
                  className="absolute inset-0 z-10"
                  aria-label={component.name}
                />
                <div className="relative m-3 h-[204px] overflow-hidden rounded-xl bg-background/60">
                  {!component.free && (
                    <span className="pointer-events-none absolute top-2.5 right-2.5 z-20 rounded-full bg-foreground px-3 py-1.5 text-[11px] font-bold tracking-wide text-background uppercase shadow-lg">
                      Pro
                    </span>
                  )}
                  {preview ? (
                    <ComponentCardMedia
                      slug={component.slug}
                      render={preview}
                      previewWrapperClassName="p-5"
                      previewScaleClassName="w-[480px] max-w-none origin-center scale-[0.62] sm:scale-[0.78]"
                    />
                  ) : null}
                </div>
                <div className="px-4 pt-1 pb-4">
                  <div className="font-mono text-sm font-semibold">{component.name}</div>
                  <div className="mt-1 text-xs text-foreground/40">{component.category}</div>
                </div>
              </div>
            );
          })}
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

      <AllAccessPricing />
      <KindWords />
    </>
  );
}
