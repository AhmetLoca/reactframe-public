import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { components, getComponent } from "@/lib/catalog-data";
import { ComponentPreview, type ComponentCode } from "@/components/component-preview";
import { BackToComponentsLink } from "@/components/back-to-components-link";
import { codeVariants } from "@/lib/code-variants";
import { usageExamples } from "@/lib/usage-examples";
import { checkoutLinks } from "@/lib/checkout-links";

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

const siteUrl = "https://reactframe.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};
  const url = `${siteUrl}/components/${slug}`;
  const title = `${component.name} — React ${component.category} Component`;
  return {
    title,
    description: component.description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: component.description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: component.description,
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
    code = { tsTailwind, ...codeVariants[slug] };
  }

  const url = `${siteUrl}/components/${slug}`;
  const jsonLd = [
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
      </div>
      <h1 className="text-3xl font-semibold tracking-tight">{component.name}</h1>
      <p className="mt-3 max-w-xl text-foreground/60">{component.description}</p>

      <div className="mt-8">
        <ComponentPreview slug={slug} code={code} usage={usageExamples[slug]} free={unlocked} checkout={checkout} />
      </div>
    </div>
  );
}
