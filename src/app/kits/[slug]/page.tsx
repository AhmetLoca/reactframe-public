import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { components } from "@/lib/catalog-data";
import { KITS } from "@/lib/kits";
import { getKitEntries } from "@/lib/llms-content";
import { allAccessOffer } from "@/lib/quote";
import { CatalogCard } from "@/components/components-catalog";

export function generateStaticParams() {
  return KITS.map((kit) => ({ slug: kit.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const kit = KITS.find((k) => k.slug === slug);
  if (!kit) return {};
  return {
    alternates: { canonical: `/kits/${slug}` },
    title: `${kit.name} Kit: React Components That Work Together`,
    description: `${kit.tagline} ${kit.description}`.slice(0, 158),
  };
}

const linkClass = "underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground";

export default async function KitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kit = KITS.find((k) => k.slug === slug);
  const entry = getKitEntries().find((k) => k.slug === slug);
  if (!kit || !entry) notFound();
  const allAccess = allAccessOffer();

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <Link href="/kits" className="text-sm text-foreground/50 transition-colors hover:text-foreground">
        &larr; All kits
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Kit</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">{kit.name}</h1>
        <p className="mt-3 text-lg text-foreground/75">{kit.tagline}</p>
        <p className="mt-4 text-[15px] leading-relaxed text-foreground/60">{kit.description}</p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {kit.bestFor.map((use) => (
            <li key={use} className="rounded-full border border-border px-3 py-1 text-xs text-foreground/70">
              {use}
            </li>
          ))}
        </ul>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-[0.15em] text-foreground/45 uppercase">Keep it consistent</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">{kit.consistency}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5">
            <p className="text-xs font-medium tracking-[0.15em] text-foreground/45 uppercase">What&apos;s inside</p>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              {entry.freeCount + entry.premiumCount} components: {entry.freeCount} free
              {entry.premiumCount > 0 && (
                <>
                  , {entry.premiumCount} premium ({entry.premiumTotal} one by one, or all of them with{" "}
                  <Link href="/premium" className={linkClass}>
                    All-Access
                  </Link>{" "}
                  for {allAccess.price})
                </>
              )}
              .
            </p>
          </div>
        </div>
      </header>

      {kit.sections.map((section) => {
        const members = section.slugs.map((s) => components.find((c) => c.slug === s)).filter((c) => c !== undefined);
        if (members.length === 0) return null;
        return (
          <section key={section.role} className="mt-16">
            <h2 className="text-xl font-semibold tracking-tight">{section.role}</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((component) => (
                <CatalogCard key={component.slug} component={component} returnPath={`/kits/${kit.slug}`} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-20 rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-xl font-semibold tracking-tight">Build a site with this kit</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/65">
          Ask Claude, ChatGPT or Cursor: &ldquo;Build me a website using ReactFrame&apos;s {kit.name} kit.&rdquo; See{" "}
          <Link href="/docs/ai" className={linkClass}>
            Build a site with your AI
          </Link>{" "}
          for the one-line setup.
        </p>
      </section>
    </div>
  );
}
