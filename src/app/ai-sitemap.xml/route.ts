import { components } from "@/lib/catalog-data";
import { REAL_PAGES } from "@/lib/pages-data";
import { KITS } from "@/lib/kits";
import { COLLECTIONS } from "@/lib/collections";
import { COMPARISONS } from "@/lib/comparisons";

// A curated companion to /sitemap.xml, scoped to exactly what's licensed
// for AI use: free (MIT) components and pages only. Standard sitemap.xml
// lists premium URLs too (their marketing page is still meant to be
// indexed by search engines), but an AI crawler working off just this file
// never even sees a premium slug to consider training on — a positive
// allow-list alongside /ai.txt's disallow-list and robots.txt's bot block.
export const dynamic = "force-static";

const SITE_URL = "https://reactframe.com";

function urlEntry(loc: string): string {
  return `  <url><loc>${loc}</loc></url>`;
}

export async function GET() {
  const freeComponentUrls = components.filter((c) => c.free).map((c) => urlEntry(`${SITE_URL}/components/${c.slug}`));
  const freePageUrls = REAL_PAGES.filter((p) => p.free).map((p) => urlEntry(`${SITE_URL}/pages/preview/${p.slug}`));

  const staticUrls = [
    urlEntry(SITE_URL),
    urlEntry(`${SITE_URL}/components`),
    urlEntry(`${SITE_URL}/elements`),
    urlEntry(`${SITE_URL}/blocks`),
    urlEntry(`${SITE_URL}/pages`),
    urlEntry(`${SITE_URL}/docs`),
    urlEntry(`${SITE_URL}/docs/ai`),
    urlEntry(`${SITE_URL}/kits`),
    ...KITS.map((kit) => urlEntry(`${SITE_URL}/kits/${kit.slug}`)),
    urlEntry(`${SITE_URL}/collections`),
    ...COLLECTIONS.map((c) => urlEntry(`${SITE_URL}/collections/${c.slug}`)),
    urlEntry(`${SITE_URL}/compare`),
    ...COMPARISONS.map((c) => urlEntry(`${SITE_URL}/compare/${c.slug}`)),
  ];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticUrls,
    ...freeComponentUrls,
    ...freePageUrls,
    "</urlset>",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
