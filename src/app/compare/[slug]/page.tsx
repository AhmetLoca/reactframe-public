import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { components } from "@/lib/catalog-data";
import { CHECKED_ON, COMPARISONS, REACTFRAME_FACTS } from "@/lib/comparisons";

const SITE_URL = "https://reactframe.com";

export function generateStaticParams() {
  return COMPARISONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = COMPARISONS.find((x) => x.slug === slug);
  if (!c) return {};
  return {
    alternates: { canonical: `/compare/${slug}` },
    title: `ReactFrame vs ${c.name}: Features, Pricing and Which to Choose`,
    description: `An honest comparison of ReactFrame and ${c.name}: library size, free tier, pricing, installation and AI tooling, and which one fits your project.`,
  };
}

function fill(text: string): string {
  const free = components.filter((c) => c.free).length;
  return text.replace("{components}", String(components.length)).replace("{free}", String(free));
}

/** A row's ReactFrame cell is either a key of REACTFRAME_FACTS (shared across pages) or literal text. */
function ourCell(value: string): string {
  return fill(value in REACTFRAME_FACTS ? REACTFRAME_FACTS[value as keyof typeof REACTFRAME_FACTS] : value);
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = COMPARISONS.find((x) => x.slug === slug);
  if (!c) notFound();
  const others = COMPARISONS.filter((x) => x.slug !== c.slug);

  const faq = [
    ...c.faq,
    {
      q: `How much cheaper is ReactFrame than ${c.name}?`,
      a: `ReactFrame's All-Access is $49 at launch (regularly $129) for 12 months, and single premium components cost $4 to $8. See the table above for ${c.name}'s current pricing; note that ReactFrame's access runs for 12 months, while some of ${c.name}'s plans are lifetime.`,
    },
  ];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Compare", item: `${SITE_URL}/compare` },
        { "@type": "ListItem", position: 2, name: `ReactFrame vs ${c.name}`, item: `${SITE_URL}/compare/${c.slug}` },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-6 py-16 md:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <nav aria-label="Breadcrumb" className="text-sm text-foreground/50">
        <Link href="/compare" className="transition-colors hover:text-foreground">
          Compare
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground/70">{c.name}</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-balance md:text-4xl">ReactFrame vs {c.name}</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-foreground/70 md:text-base">
          Both are libraries of animated React + Tailwind components you copy into your own project. {c.about} ReactFrame has{" "}
          {fill(REACTFRAME_FACTS.size)}, sells premium pieces one by one or all together, and is built for building sites with an AI assistant. Here is how
          they compare, and when each is the better choice.
        </p>
        <p className="mt-3 text-xs text-foreground/45">
          Facts about {c.name} checked on its website in {CHECKED_ON}. Prices and counts change; see{" "}
          <a href={c.url} target="_blank" rel="noopener noreferrer" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            {c.url.replace("https://", "")}
          </a>{" "}
          for the latest.
        </p>
      </header>

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">At a glance</h2>
        <div className="mt-5 overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full min-w-[620px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs font-medium tracking-wide text-foreground/45 uppercase">
                <th className="w-[22%] px-5 py-4 font-medium" />
                <th className="px-5 py-4 font-medium text-foreground/80">ReactFrame</th>
                <th className="px-5 py-4 font-medium">{c.name}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row) => (
                <tr key={row.feature} className="border-t border-border align-top">
                  <th scope="row" className="px-5 py-4 font-medium text-foreground/80">
                    {row.feature}
                  </th>
                  <td className="px-5 py-4 leading-relaxed text-foreground/75">{ourCell(row.reactframe)}</td>
                  <td className="px-5 py-4 leading-relaxed text-foreground/65">{row.them}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-12 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold tracking-tight">Choose {c.name} if</h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/70">
            {c.chooseThem.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold tracking-tight">Choose ReactFrame if</h2>
          <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-foreground/70">
            {c.chooseUs.map((item) => (
              <li key={item} className="flex gap-3">
                <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                {item}
              </li>
            ))}
          </ul>
        </div>
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

      <section className="mt-16 flex flex-wrap items-center gap-3">
        <Link
          href="/components"
          className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
        >
          Browse ReactFrame components
        </Link>
        <Link href="/collections" className="inline-flex items-center rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
          Collections by use case
        </Link>
      </section>

      {others.length > 0 && (
        <p className="mt-10 text-sm text-foreground/55">
          Also compare:{" "}
          {others.map((o, i) => (
            <span key={o.slug}>
              {i > 0 && ", "}
              <Link href={`/compare/${o.slug}`} className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
                ReactFrame vs {o.name}
              </Link>
            </span>
          ))}
          .
        </p>
      )}
    </div>
  );
}
