import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { COLLECTIONS, collectionMembers, fillCollectionIntro } from "@/lib/collections";
import { KITS } from "@/lib/kits";
import { componentPrice } from "@/lib/quote";
import { CatalogCard } from "@/components/components-catalog";

const SITE_URL = "https://reactframe.com";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return {};
  return {
    alternates: { canonical: `/collections/${slug}` },
    title: collection.title,
    description: collection.metaDescription,
  };
}

const linkClass = "underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground";

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  const members = collectionMembers(collection);
  const freeMembers = members.filter((c) => c.free);
  const kit = collection.kit ? KITS.find((k) => k.slug === collection.kit) : undefined;
  const related = collection.related.map((r) => COLLECTIONS.find((c) => c.slug === r)).filter((c) => c !== undefined);

  const faq = [
    ...collection.faq,
    {
      q: "Are these components free?",
      a:
        freeMembers.length === 0
          ? "These are premium components, sold one by one or all together with All-Access."
          : freeMembers.length === members.length
            ? "Yes, every component in this collection is free to use in personal and commercial projects."
            : `${freeMembers.length} of the ${members.length} are free (${freeMembers.map((c) => c.name).join(", ")}); the others are premium, sold one by one or all together with All-Access.`,
    },
    {
      q: "How do I install them?",
      a: "Free components install with the shadcn CLI, for example: npx shadcn@latest add https://reactframe.com/r/<slug>.json. You get the full React + Tailwind source in your project, with Motion as the only animation dependency.",
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: collection.title,
      numberOfItems: members.length,
      itemListElement: members.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, url: `${SITE_URL}/components/${c.slug}` })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Collections", item: `${SITE_URL}/collections` },
        { "@type": "ListItem", position: 2, name: collection.title, item: `${SITE_URL}/collections/${collection.slug}` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="text-sm text-foreground/50">
        <Link href="/collections" className="transition-colors hover:text-foreground">
          Collections
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/70">{collection.shortTitle}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">{collection.title}</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-foreground/70 md:text-base">{fillCollectionIntro(collection)}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/components"
            className="inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
          >
            Browse all components
          </Link>
          {kit && (
            <Link href={`/kits/${kit.slug}`} className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
              See the {kit.name} kit
            </Link>
          )}
        </div>
      </header>

      <section className="mt-12 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tight">How to choose</h2>
        <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-foreground/70">
          {collection.howToChoose.map((tip) => (
            <li key={tip} className="flex gap-3">
              <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
              {tip}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-xl font-semibold tracking-tight">
          All {members.length} components
        </h2>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((component) => (
            <CatalogCard key={component.slug} component={component} returnPath={`/collections/${collection.slug}`} />
          ))}
        </div>

        {/* The same list as text, with price and install command: what a crawler or AI assistant reads. */}
        <dl className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card px-5 md:px-6">
          {members.map((c) => (
            <div key={c.slug} className="py-4">
              <dt className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <Link href={`/components/${c.slug}`} className="text-[15px] font-medium hover:underline">
                  {c.name}
                </Link>
                <span className={`text-xs font-medium ${c.free ? "text-[#00A92A]" : "text-foreground/55"}`}>{c.free ? "Free" : `Premium · ${componentPrice(c.slug) ?? ""}`}</span>
              </dt>
              <dd className="mt-1 text-sm leading-relaxed text-foreground/60">{c.description}</dd>
              {c.free && (
                <dd className="mt-2 overflow-x-auto font-mono text-xs whitespace-nowrap text-foreground/50">npx shadcn@latest add {SITE_URL}/r/{c.slug}.json</dd>
              )}
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 max-w-3xl">
        <h2 className="text-xl font-semibold tracking-tight">Questions</h2>
        <dl className="mt-5 divide-y divide-border rounded-2xl border border-border bg-card px-5 md:px-6">
          {faq.map(({ q, a }) => (
            <div key={q} className="py-5">
              <dt className="text-[15px] font-medium">{q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-foreground/65">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold tracking-tight">Related collections</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link href={`/collections/${r.slug}`} className="inline-flex rounded-full border border-border px-3.5 py-1.5 text-sm text-foreground/75 transition-colors hover:bg-accent">
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <p className="mt-12 text-sm text-foreground/55">
        Want a whole page built from these?{" "}
        <Link href="/docs/ai" className={linkClass}>
          Ask your AI to build it with ReactFrame
        </Link>
        .
      </p>
    </div>
  );
}
