import { components } from "@/lib/catalog-data";

// AI usage policy, machine-readable. There's no ratified standard for this
// yet, so this follows the robots.txt-like convention used by sites such
// as spawning.ai's opt-out list: plain User-agent/Allow/Disallow directives,
// plus a human-readable explanation, published at /ai.txt. It states a
// licensing position (see /license) that's stronger than what robots.txt
// alone can express — robots.txt says who *may fetch*; this says what a
// successful fetch may be *used for*, which matters even for crawlers that
// ignore user-agent blocks or for source obtained by a paying customer.
export const dynamic = "force-static";

const SITE_URL = "https://reactframe.com";

export async function GET() {
  const premiumSlugs = components.filter((c) => !c.free).map((c) => c.slug);

  const lines = [
    "# reactframe.com, AI usage policy",
    "#",
    "# Free components are MIT-licensed (see /license), explicitly free to read,",
    "# run, reuse, and train on, same as any MIT-licensed code. They're inlined in",
    `# ${SITE_URL}/llms.txt and ${SITE_URL}/llms-full.txt, and fetchable one by one at`,
    `# ${SITE_URL}/r/<slug>.json.`,
    "#",
    "# Premium components are commercial products, sold individually. Their source",
    "# is NOT licensed for AI or ML training, dataset inclusion, or bulk",
    "# reproduction, whether obtained by a crawler or copied from a paying",
    `# customer's download. Full terms: ${SITE_URL}/license`,
    "#",
    "# Real-time, on-demand access by a coding agent acting for one human user",
    "# e.g. our MCP server (npm: reactframe-mcp) or a direct /llms.txt fetch, is",
    "# fine for free components, the same as a human browsing the site. This file",
    "# and robots.txt are both about bulk/offline crawling for model training.",
    "",
    "User-agent: *",
    "Allow: /r/",
    "Allow: /llms.txt",
    "Allow: /llms-full.txt",
    "Allow: /api/catalog",
    "Allow: /ai-sitemap.xml",
    "",
    "# Premium component pages, not licensed for AI training (see above).",
    ...premiumSlugs.map((slug) => `Disallow: /components/${slug}`),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
