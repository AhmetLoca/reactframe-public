#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Overridable for local development against `npm run dev` in the main app;
// defaults to production for the published package.
const SITE_URL = process.env.REACTFRAME_BASE_URL || "https://reactframe.com";
const CATALOG_URL = `${SITE_URL}/api/catalog`;

interface CatalogComponentEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  type: "element" | "block" | "component";
  free: boolean;
  price?: string;
  installCommand?: string;
  prompt?: string;
}

interface CatalogPageEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  free: boolean;
  price?: string;
}

interface CatalogData {
  components: CatalogComponentEntry[];
  pages: CatalogPageEntry[];
}

// Fetched once per process and reused for every tool call — this server is
// spawned fresh per session by the MCP client, so there's no need for a TTL.
let catalogPromise: Promise<CatalogData> | null = null;

function getCatalog(): Promise<CatalogData> {
  if (!catalogPromise) {
    catalogPromise = fetch(CATALOG_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch ${CATALOG_URL}: ${res.status}`);
        return res.json() as Promise<CatalogData>;
      })
      .catch((err) => {
        catalogPromise = null; // allow retry on next call
        throw err;
      });
  }
  return catalogPromise;
}

function matchesQuery(entry: { name: string; description: string; category: string; slug: string }, query: string): boolean {
  const q = query.toLowerCase();
  return (
    entry.name.toLowerCase().includes(q) ||
    entry.description.toLowerCase().includes(q) ||
    entry.category.toLowerCase().includes(q) ||
    entry.slug.toLowerCase().includes(q)
  );
}

function jsonContent(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

function textContent(text: string) {
  return { content: [{ type: "text" as const, text }] };
}

const INSTRUCTIONS = `ReactFrame is a catalog of free and premium React + Tailwind + Motion components, blocks and pages.

When the user asks you to build a site or page with ReactFrame:
1. Use search_components to pick components that fit the brief; free and premium can be mixed.
2. Install each free one with get_component (it returns the shadcn install command and full source).
3. Never recreate or imitate a premium component from its preview. Put a clearly marked placeholder where it goes (a comment naming the component and its URL) and keep building around it.
4. Call get_quote once with every slug you used to price the premium picks.
5. End with a short summary: the free components you installed, the premium ones the design uses with their prices and total, and where to buy them (All-Access when get_quote recommends it).`;

const server = new McpServer({ name: "reactframe-mcp", version: "0.2.1" }, { instructions: INSTRUCTIONS });

server.registerTool(
  "search_components",
  {
    title: "Search ReactFrame components",
    description:
      "Search ReactFrame's catalog of free and premium React + Tailwind + Motion components, blocks and pages by keyword. Matches against name, description, category and slug. Returns metadata only (not source) — use get_component to fetch a specific component's full source.",
    inputSchema: {
      query: z.string().optional().describe("Free-text search term, e.g. \"carousel\" or \"pricing table\". Omit to list broadly, filtered by the other params."),
      category: z.string().optional().describe("Restrict to an exact category name, e.g. \"Charts\" or \"Navigation\"."),
      type: z.enum(["element", "block", "component", "page"]).optional().describe("Restrict to one kind of entry."),
      freeOnly: z.boolean().optional().describe("If true, only return free components (the ones with a fetchable r/<slug>.json)."),
      limit: z.number().int().positive().max(100).optional().describe("Max results to return (default 25)."),
    },
  },
  async ({ query, category, type, freeOnly, limit }) => {
    const catalog = await getCatalog();
    const limitN = limit ?? 25;

    let componentResults: (CatalogComponentEntry & { kind: "component" | "element" | "block" })[] = catalog.components.map((c) => ({
      ...c,
      kind: c.type,
    }));
    let pageResults: (CatalogPageEntry & { kind: "page" })[] = catalog.pages.map((p) => ({ ...p, kind: "page" as const }));

    if (type) {
      if (type === "page") componentResults = [];
      else {
        componentResults = componentResults.filter((c) => c.type === type);
        pageResults = [];
      }
    }
    if (category) {
      componentResults = componentResults.filter((c) => c.category.toLowerCase() === category.toLowerCase());
      pageResults = pageResults.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    if (freeOnly) {
      componentResults = componentResults.filter((c) => c.free);
      pageResults = pageResults.filter((p) => p.free);
    }
    if (query) {
      componentResults = componentResults.filter((c) => matchesQuery(c, query));
      pageResults = pageResults.filter((p) => matchesQuery(p, query));
    }

    const results = [
      ...componentResults.map((c) => ({
        slug: c.slug,
        name: c.name,
        description: c.description,
        category: c.category,
        type: c.kind,
        free: c.free,
        ...(c.free ? {} : { price: c.price }),
        hasPrompt: Boolean(c.prompt),
        url: `${SITE_URL}/components/${c.slug}`,
      })),
      ...pageResults.map((p) => ({
        slug: p.slug,
        name: p.name,
        description: p.description,
        category: p.category,
        type: "page" as const,
        free: p.free,
        ...(p.free ? {} : { price: p.price }),
        hasPrompt: false,
        url: `${SITE_URL}/pages/preview/${p.slug}`,
      })),
    ].slice(0, limitN);

    return jsonContent({ count: results.length, results });
  },
);

server.registerTool(
  "get_component",
  {
    title: "Get a ReactFrame component's full source",
    description:
      "Fetch the full source code, npm dependencies and file list for one free ReactFrame component by slug, in shadcn/ui registry format. Only works for free components — premium ones return their catalog metadata plus a link to preview them on reactframe.com instead of source.",
    inputSchema: {
      slug: z.string().describe("The component's slug, e.g. \"toggle-pro\" or \"pie-chart\". Use search_components to find slugs."),
    },
  },
  async ({ slug }) => {
    const catalog = await getCatalog();
    const entry = catalog.components.find((c) => c.slug === slug);
    if (!entry) {
      return textContent(`No component found with slug "${slug}". Use search_components to find valid slugs.`);
    }
    if (!entry.free) {
      return jsonContent({
        slug: entry.slug,
        name: entry.name,
        description: entry.description,
        category: entry.category,
        free: false,
        price: entry.price,
        message:
          "This is a premium component: its source isn't public. Don't recreate it from the preview; leave a placeholder comment naming it and its URL, then include its slug in get_quote so the user sees the price.",
        url: `${SITE_URL}/components/${entry.slug}`,
      });
    }

    const res = await fetch(`${SITE_URL}/r/${slug}.json`);
    if (!res.ok) {
      return textContent(`Failed to fetch source for "${slug}": HTTP ${res.status}. It may have been removed — try search_components again.`);
    }
    const registryEntry = await res.json();
    return jsonContent({
      installCommand: `npx shadcn@latest add ${SITE_URL}/r/${slug}.json`,
      registry: registryEntry,
    });
  },
);

server.registerTool(
  "get_rebuild_prompt",
  {
    title: "Get a component's AI rebuild prompt",
    description:
      "Fetch the ready-made \"rebuild this from scratch\" prompt ReactFrame ships for some free components — a prompt written for an AI coding assistant to regenerate the component from a description rather than by copying its source. Not every free component has one; check the hasPrompt field from search_components first.",
    inputSchema: {
      slug: z.string().describe("The component's slug, e.g. \"toggle-pro\"."),
    },
  },
  async ({ slug }) => {
    const catalog = await getCatalog();
    const entry = catalog.components.find((c) => c.slug === slug);
    if (!entry) {
      return textContent(`No component found with slug "${slug}". Use search_components to find valid slugs.`);
    }
    if (!entry.prompt) {
      return textContent(
        entry.free
          ? `"${entry.name}" (${slug}) doesn't have a rebuild prompt. Use get_component to fetch its full source instead.`
          : `"${entry.name}" (${slug}) is a premium component and doesn't have a public rebuild prompt.`,
      );
    }
    return textContent(entry.prompt);
  },
);

server.registerTool(
  "get_quote",
  {
    title: "Price a ReactFrame build",
    description:
      "Price every ReactFrame component and page used in a build in one call. Free items come back at $0 with their install command; premium components and Pro pages with their one-off price and link. Returns the premium total, the All-Access offer, and a recommendation (\"free\", \"individual\" or \"all-access\") plus a one-line summary to show the user.",
    inputSchema: {
      slugs: z.array(z.string()).min(1).max(200).describe("Slugs of every component and page used, free and premium alike."),
    },
  },
  async ({ slugs }) => {
    const res = await fetch(`${SITE_URL}/api/quote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slugs }),
    });
    if (!res.ok) return textContent(`Failed to fetch a quote: HTTP ${res.status}.`);
    return jsonContent(await res.json());
  },
);

server.registerTool(
  "list_categories",
  {
    title: "List ReactFrame categories",
    description: "List every category in the ReactFrame catalog with a count of components and pages in each — useful for browsing before a targeted search_components call.",
    inputSchema: {},
  },
  async () => {
    const catalog = await getCatalog();
    const counts = new Map<string, { components: number; pages: number }>();
    for (const c of catalog.components) {
      const entry = counts.get(c.category) ?? { components: 0, pages: 0 };
      entry.components += 1;
      counts.set(c.category, entry);
    }
    for (const p of catalog.pages) {
      const entry = counts.get(p.category) ?? { components: 0, pages: 0 };
      entry.pages += 1;
      counts.set(p.category, entry);
    }
    const categories = Array.from(counts.entries())
      .map(([category, n]) => ({ category, ...n }))
      .sort((a, b) => a.category.localeCompare(b.category));
    return jsonContent({ categories });
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("reactframe-mcp fatal error:", err);
  process.exit(1);
});
