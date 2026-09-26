import Link from "next/link";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { components, getComponent } from "@/lib/catalog-data";
import { ComponentPreview, type ComponentCode } from "@/components/component-preview";
import { BackToComponentsLink } from "@/components/back-to-components-link";
import { getCodeVariants } from "@/lib/code-variants";
import { usageExamples } from "@/lib/usage-examples";
import { checkoutLinks } from "@/lib/checkout-links";
import { CatalogCard } from "@/components/components-catalog";
import { ComponentApi } from "@/components/component-api";
import { getComponentGuide } from "@/lib/component-guides";
import { SequenceNav } from "@/components/sequence-nav";
import { collectionsForComponent } from "@/lib/collections";
import { KITS, kitSlugs } from "@/lib/kits";
import { SchemaBadge } from "@/components/schema-badge";
import { getSequence, SEQUENCE_LABELS } from "@/lib/catalog-order";
import registry from "../../../../registry.json";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

const siteUrl = "https://reactframe.com";

const DEPENDENCIES = new Map(registry.items.map((item) => [item.name, "dependencies" in item ? (item.dependencies as string[]) : []]));

const RELATED_PER_SIDE = 3;

// The 3 neighbours on each side in a ring of same-type components grouped by category, so related links
// stay on-topic and every component is linked from its neighbours, no orphan pages.
function getRelated(slug: string) {
  const self = getComponent(slug);
  if (!self) return [];
  const pool = components.filter((c) => (c.type ?? null) === (self.type ?? null));
  const firstSeen = new Map<string, number>();
  pool.forEach((c, i) => {
    if (!firstSeen.has(c.category)) firstSeen.set(c.category, i);
  });
  const ring = [...pool].sort((a, b) => firstSeen.get(a.category)! - firstSeen.get(b.category)!);
  const at = ring.findIndex((c) => c.slug === slug);
  const picked = new Map<string, (typeof ring)[number]>();
  for (let d = 1; d <= RELATED_PER_SIDE; d++) {
    for (const i of [at + d, at - d]) {
      const c = ring[(i + ring.length) % ring.length];
      if (c.slug !== slug) picked.set(c.slug, c);
    }
  }
  const related = [...picked.values()];
  return [...related.filter((c) => c.category === self.category), ...related.filter((c) => c.category !== self.category)];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};
  const url = `${siteUrl}/components/${slug}`;
  // Leads with the words people search ("react time picker"), then "free" (which lifts clicks on free
  // items) and the stack; the layout template appends ", ReactFrame".
  const title = component.free ? `React ${component.name} Component: Free, Tailwind & shadcn/ui` : `React ${component.name} Component (Tailwind, shadcn/ui)`;
  const description = `${component.free ? "Free" : "Premium"} ${component.name} React component built with Tailwind CSS, shadcn/ui compatible. ${component.description}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) notFound();

  // Premium gate is switched off site-wide for now (no checkout to send
  // people to yet for most components) — every component's code and
  // install command are unlocked regardless of its `free` flag, EXCEPT
  // the handful with a real Lemon Squeezy product in checkoutLinks, which
  // is the pilot for selling components individually. Flip this back to
  // `component.free` once every premium component has somewhere real to
  // send people.
  const related = getRelated(slug);
  const sequence = getSequence(slug);
  const checkout = checkoutLinks[slug];
  const unlocked = !checkout;

  // Premium component source never leaves the server — the Code tab and
  // install command render a paywall instead when `code` is null.
  let code: ComponentCode | null = null;
  if (unlocked) {
    const filePath = path.join(
      process.cwd(),
      "registry",
      "new-york",
      slug,
      `${slug}.tsx`,
    );
    const tsTailwind = await readFile(filePath, "utf-8");
    code = { tsTailwind, ...(await getCodeVariants(slug)) };
  }

  const url = `${siteUrl}/components/${slug}`;
  const guide = getComponentGuide(slug);
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: component.name,
      description: component.description,
      url,
      programmingLanguage: "TypeScript",
      runtimePlatform: "React",
      codeSampleType: "snippet",
      isAccessibleForFree: component.free,
      about: { "@type": "Thing", name: component.category },
      isPartOf: { "@type": "WebSite", name: "ReactFrame", url: siteUrl },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
        { "@type": "ListItem", position: 2, name: "Components", item: `${siteUrl}/components` },
        { "@type": "ListItem", position: 3, name: component.category, item: `${siteUrl}/components?category=${encodeURIComponent(component.category)}` },
        { "@type": "ListItem", position: 4, name: component.name, item: url },
      ],
    },
  ];
  if (guide) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: guide.faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      {jsonLd.map((entry, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }} />
      ))}

      <BackToComponentsLink />

      <div className="mb-2 flex items-center gap-2 text-xs font-medium tracking-wider text-foreground/40 uppercase">
        {component.category}
        {component.free ? (
          <span className="rounded-full border border-[#00A92A]/50 bg-black/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#00A92A] normal-case shadow-[0_0_10px_rgba(0,169,42,0.3)] backdrop-blur-sm [text-shadow:0_0_6px_rgba(0,169,42,0.65)]">
            Free
          </span>
        ) : (
          <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background normal-case">
            Premium
          </span>
        )}
        <SchemaBadge slug={slug} detailed className="border border-[#2563EB]/30 bg-[#2563EB]/[0.07] text-[#1D4ED8] normal-case dark:border-[#60A5FA]/40 dark:bg-[#60A5FA]/10 dark:text-[#7DB5FF]" />
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">
        {component.name} <span className="text-foreground/35">React component</span>
      </h1>
      <p className="mt-3 max-w-xl text-foreground/60">{component.description}</p>

      <div className="mt-8">
        <ComponentPreview slug={slug} code={code} usage={usageExamples[slug]} free={unlocked} checkout={checkout} prompt={component.prompt} />
      </div>

      <ComponentApi slug={slug} name={component.name} unlocked={unlocked} checkout={checkout} dependencies={DEPENDENCIES.get(slug) ?? []} />

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight">
            {related.every((c) => c.category === component.category) ? `More ${component.category} components` : "Related components"}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <CatalogCard key={c.slug} component={c} />
            ))}
          </div>
        </section>
      )}

      <FeaturedIn slug={slug} />

      {sequence && (
        <SequenceNav
          label={SEQUENCE_LABELS[sequence.kind]}
          position={sequence.position}
          total={sequence.total}
          prev={{ slug: sequence.prev.slug, name: sequence.prev.name }}
          next={{ slug: sequence.next.slug, name: sequence.next.name }}
        />
      )}
    </div>
  );
}

// Links from a component to the use-case collections and kits it belongs to (UI Elements excluded: it
// lists every element, so it says nothing about this one).
function FeaturedIn({ slug }: { slug: string }) {
  const links = [
    ...collectionsForComponent(slug).map((c) => ({ href: `/collections/${c.slug}`, label: c.title })),
    ...KITS.filter((k) => k.slug !== "ui-elements" && kitSlugs(k).includes(slug)).map((k) => ({ href: `/kits/${k.slug}`, label: `${k.name} kit` })),
  ];
  if (links.length === 0) return null;
  return (
    <section className="mt-12">
      <h2 className="text-sm font-semibold tracking-wide text-foreground/70">Featured in</h2>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground/75 transition-colors hover:bg-accent">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
