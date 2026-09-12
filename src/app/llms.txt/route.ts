import { components } from "@/lib/catalog-data";

// Emerging convention (llmstxt.org) for helping AI crawlers and answer
// engines understand a site's content without having to render/parse full
// HTML pages — a plain-text sitemap-for-LLMs. Generated from the same
// catalog-data.ts used everywhere else, so it stays in sync automatically
// as components are added.
const siteUrl = "https://reactframe.com";

export const dynamic = "force-static";

export async function GET() {
  const byCategory = new Map<string, typeof components>();
  for (const c of components) {
    const list = byCategory.get(c.category) ?? [];
    list.push(c);
    byCategory.set(c.category, list);
  }
  const categories = Array.from(byCategory.keys()).sort((a, b) => a.localeCompare(b));

  const lines: string[] = [
    "# ReactFrame",
    "",
    `> ReactFrame is a catalog of ${components.length}+ free and premium React components — buttons, cards, carousels, charts, mockups, and more — built with React, TypeScript, Tailwind CSS, and Motion. Every component ships as plain source in shadcn/ui's registry format: no package to install, no runtime dependency on ReactFrame itself. Copy the code, paste it into your project, and own it from there.`,
    "",
    `- Browse the full catalog: ${siteUrl}/components`,
    `- Small UI primitives (buttons, inputs, badges): ${siteUrl}/elements`,
    `- Composed marketing sections (hero, footer, testimonials): ${siteUrl}/blocks`,
    `- Documentation: ${siteUrl}/docs`,
    "",
    "## Components",
    "",
  ];

  for (const category of categories) {
    lines.push(`### ${category}`);
    lines.push("");
    for (const c of byCategory.get(category)!) {
      lines.push(`- [${c.name}](${siteUrl}/components/${c.slug})${c.free ? "" : " (Premium)"}: ${c.description}`);
    }
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
