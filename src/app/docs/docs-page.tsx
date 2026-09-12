"use client";

import * as React from "react";
import Link from "next/link";
import { HookSidebar } from "@/components/ui/hook-sidebar";

const SECTIONS: { title: string; body: React.ReactNode }[] = [
  {
    title: "Introduction",
    body: (
      <>
        <p>
          ReactFrame is a library of React components, blocks, pages, and templates, built with Tailwind CSS. There&apos;s no package to install and no
          runtime dependency on ReactFrame itself — every piece ships as plain React source you copy into your own project and own from there.
        </p>
        <p>
          Free components are ready to use immediately. Premium ones require unlocking access to the source first — see{" "}
          <Link href="/license" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            License
          </Link>{" "}
          for what that unlock covers.
        </p>
      </>
    ),
  },
  {
    title: "Installation",
    body: (
      <>
        <p>
          Open any component&apos;s page and switch to the Code tab. You&apos;ll get the full source in TypeScript + Tailwind by default, with JavaScript
          and plain-CSS variants available from the same panel — pick whichever matches your project, then copy and paste it in.
        </p>
        <p>Each component page also lists an Install command and a Usage example showing how it&apos;s typically wired up with props.</p>
        <p>The only requirement is a React project with Tailwind CSS configured — no ReactFrame-specific setup, CLI, or config file needed.</p>
      </>
    ),
  },
  {
    title: "Components",
    body: (
      <>
        <p>
          The{" "}
          <Link href="/components" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            Components
          </Link>{" "}
          catalog is the core of ReactFrame — individual, self-contained pieces (widgets, cards, charts, games, and more) organized by category, with a
          live interactive preview and a Free/Premium filter in the sidebar.
        </p>
        <p>Every component page shows the same three things: a live Preview across desktop/tablet/mobile widths, the Code tab, and a Usage example.</p>
      </>
    ),
  },
  {
    title: "Blocks",
    body: (
      <>
        <p>
          Blocks are larger, ready-to-compose sections — marketing sections, dashboard/application layouts, eCommerce, authentication, data tables, and
          AI/chat blocks. They&apos;re built from the same components but assembled into a section you&apos;d drop straight into a page.
        </p>
        <p>Browse them from the Blocks menu in the header, filtered by category, or jump straight to the free ones.</p>
      </>
    ),
  },
  {
    title: "Pages",
    body: (
      <>
        <p>Pages are full, multi-section layouts — a complete landing page or app screen built by combining several blocks and components together.</p>
        <p>Use a Page as a starting point for a whole route in your project, then swap out individual blocks as needed.</p>
      </>
    ),
  },
  {
    title: "Templates",
    body: (
      <>
        <p>
          Templates are complete, themed builds — currently organized into Landing Pages and Dashboards from the Templates menu in the header. They go a
          step further than a single Page: a full, cohesively-styled product built from ReactFrame components end to end.
        </p>
      </>
    ),
  },
  {
    title: "Elements",
    body: (
      <>
        <p>
          Elements are the smallest building blocks — buttons, badges, inputs, and other primitives components and blocks are built from. Start here if
          you&apos;re assembling something from scratch rather than starting from a pre-built component.
        </p>
      </>
    ),
  },
  {
    title: "Code variants",
    body: (
      <>
        <p>Every component&apos;s Code tab offers up to four variants of the same source, so you&apos;re never stuck adapting it by hand:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>TypeScript + Tailwind (the default)</li>
          <li>JavaScript + Tailwind</li>
          <li>TypeScript + plain CSS</li>
          <li>JavaScript + plain CSS</li>
        </ul>
        <p>All four render pixel-identically — pick whichever matches your project&apos;s language and styling setup.</p>
      </>
    ),
  },
  {
    title: "License",
    body: (
      <>
        <p>
          Free and premium components are both licensed for use in your own projects, personal or commercial, with no attribution required. Premium
          access unlocks the source — it doesn&apos;t transfer ownership, and reselling or repackaging a component&apos;s source isn&apos;t covered.
        </p>
        <p>
          Full terms are on the{" "}
          <Link href="/license" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            License
          </Link>{" "}
          page.
        </p>
      </>
    ),
  },
  {
    title: "Support",
    body: (
      <>
        <p>
          Stuck on a component, found a bug, or have a question about how something works? Visit{" "}
          <Link href="/support" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            Support
          </Link>{" "}
          and email us directly — no ticket system, just a real reply.
        </p>
        <p>
          For quick answers first, check the{" "}
          <Link href="/faq" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            FAQ
          </Link>{" "}
          or the{" "}
          <Link href="/help-center" className="underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground">
            Help Center
          </Link>
          .
        </p>
      </>
    ),
  },
];

export function DocsPage() {
  const [active, setActive] = React.useState(0);
  const items = SECTIONS.map((s) => s.title);
  const section = SECTIONS[active];

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <HookSidebar label="Getting Started" items={items} value={active} onChange={setActive} color="var(--primary)" />
        </aside>

        <main className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight">{section.title}</h1>
          <div className="mt-6 max-w-2xl space-y-4 text-[15px] leading-relaxed text-foreground/70">{section.body}</div>
        </main>
      </div>
    </div>
  );
}
