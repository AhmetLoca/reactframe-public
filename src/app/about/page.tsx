import type { Metadata } from "next";
import Link from "next/link";
import { components } from "@/lib/catalog-data";
import { REAL_PAGES } from "@/lib/pages-data";
import { KITS } from "@/lib/kits";
import { allAccessOffer, componentPrice, priceToCents } from "@/lib/quote";

const SITE_URL = "https://reactframe.com";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About ReactFrame: Animated React Components for Tailwind and shadcn/ui",
  description:
    "What ReactFrame is, what's free and what's paid, how licensing works, and how to install components by hand, with the shadcn CLI or through your AI assistant.",
};

// Every number on this page comes from the catalog, so it stays right as components are added.
function catalogFacts() {
  const of = (type?: "element" | "block") => components.filter((c) => (type ? c.type === type : !c.type));
  const count = (list: { free: boolean }[]) => ({ total: list.length, free: list.filter((i) => i.free).length });
  const premiumCents = components.filter((c) => !c.free).map((c) => priceToCents(componentPrice(c.slug))).filter((c) => c > 0);
  const dollars = (cents: number) => `$${cents / 100}`;
  return {
    components: count(of()),
    elements: count(of("element")),
    blocks: count(of("block")),
    pages: count(REAL_PAGES),
    freeTotal: components.filter((c) => c.free).length + REAL_PAGES.filter((p) => p.free).length,
    premiumRange: premiumCents.length ? `${dollars(Math.min(...premiumCents))} to ${dollars(Math.max(...premiumCents))}` : null,
    allAccess: allAccessOffer(),
  };
}

const link = "text-foreground underline decoration-foreground/25 underline-offset-4 transition-colors hover:decoration-foreground";

export default function AboutPage() {
  const f = catalogFacts();
  const facts: [string, React.ReactNode][] = [
    ["What it is", "A library of animated React components, page sections and full page templates, built with TypeScript, Tailwind CSS and Motion."],
    ["Catalog", `${f.components.total} components (${f.components.free} free), ${f.elements.total} UI elements (all free), ${f.blocks.total} blocks (${f.blocks.free} free) and ${f.pages.total} page templates (${f.pages.free} free).`],
    ["Free tier", `${f.freeTotal} items are free under the MIT License, with no account and no sign-up.`],
    ["Premium", `${f.premiumRange ? `Premium components cost ${f.premiumRange} each, paid once. ` : ""}All-Access is ${f.allAccess.price} for every premium item plus 12 months of new releases, with no subscription.`],
    ["Install", "Copy the source, or install free components with the shadcn CLI from their registry URLs. The code lands in your project, so there's no ReactFrame package at runtime."],
    ["AI assistants", "Claude, ChatGPT, Cursor and other assistants can search, install and price components through llms.txt and the reactframe-mcp server, which is listed in the official MCP Registry."],
    ["Themes", "Most components take theme and colour props, and the kits group ones that share a look so a page built from many of them still reads as one design."],
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "ReactFrame",
                url: SITE_URL,
                logo: `${SITE_URL}/icon.svg`,
                description: "Animated React components, blocks and page templates for Tailwind CSS and shadcn/ui, with a free MIT tier.",
                sameAs: ["https://github.com/AhmetLoca/reactframe-public", "https://www.npmjs.com/package/reactframe-mcp"],
              },
              {
                "@type": "AboutPage",
                url: `${SITE_URL}/about`,
                name: "About ReactFrame",
                about: { "@id": `${SITE_URL}/#organization` },
              },
            ],
          }),
        }}
      />

      <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">About</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance md:text-4xl">About ReactFrame</h1>
      <p className="mt-5 text-[15px] leading-relaxed text-foreground/70 md:text-base">
        ReactFrame is a catalog of animated React components you can drop into a site and own outright. Everything is plain React, TypeScript and Tailwind CSS with
        Motion for animation, so the code you install is the code you ship: readable, editable and free of a runtime dependency on this site.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">At a glance</h2>
      <dl className="mt-5 divide-y divide-border rounded-2xl border border-border">
        {facts.map(([term, detail]) => (
          <div key={term} className="grid gap-1 px-5 py-4 sm:grid-cols-[150px_1fr] sm:gap-6">
            <dt className="text-sm font-semibold">{term}</dt>
            <dd className="text-sm leading-relaxed text-foreground/70">{detail}</dd>
          </div>
        ))}
      </dl>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">What you get</h2>
      <ul className="mt-4 flex list-disc flex-col gap-2.5 pl-5 text-[15px] leading-relaxed text-foreground/70">
        <li>
          <strong className="font-semibold text-foreground">Source you own.</strong> Every component installs as a file in your project. Change anything, keep it
          forever.
        </li>
        <li>
          <strong className="font-semibold text-foreground">A free tier that stands on its own.</strong> All {f.elements.total} UI elements, from buttons and
          selects to date, time and phone pickers, are free, along with {f.components.free} components.
        </li>
        <li>
          <strong className="font-semibold text-foreground">Sets that match.</strong> {KITS.length} <Link href="/kits" className={link}>kits</Link> group components
          that share one design language, for landing pages, dashboards, AI products and local businesses.
        </li>
        <li>
          <strong className="font-semibold text-foreground">Built for AI-assisted work.</strong> Your assistant can read the catalog, follow the{" "}
          <Link href="/docs/ai" className={link}>design guide</Link>, install free components and quote premium ones.
        </li>
      </ul>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Licensing in one paragraph</h2>
      <p className="mt-4 text-[15px] leading-relaxed text-foreground/70">
        Free items are MIT licensed. Premium items can be used in unlimited personal and client projects once unlocked, but their source can&apos;t be resold,
        redistributed or used to train AI models. The full terms are on the <Link href="/license" className={link}>License</Link> page.
      </p>

      <h2 className="mt-12 text-xl font-semibold tracking-tight">Where to start</h2>
      <ul className="mt-4 flex flex-col gap-2 text-[15px] text-foreground/70">
        <li>
          <Link href="/elements" className={link}>Elements</Link>: free form controls and UI primitives.
        </li>
        <li>
          <Link href="/components" className={link}>Components</Link> and <Link href="/blocks" className={link}>Blocks</Link>: animated sections and page parts.
        </li>
        <li>
          <Link href="/docs/ai" className={link}>Build a site with your AI</Link>: connect Claude, ChatGPT or Cursor.
        </li>
        <li>
          <Link href="/premium" className={link}>Premium and All-Access</Link>: pricing for the paid catalog.
        </li>
        <li>
          <Link href="/faq" className={link}>FAQ</Link> and <Link href="/support" className={link}>Support</Link>.
        </li>
      </ul>
    </div>
  );
}
