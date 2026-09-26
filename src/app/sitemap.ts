import type { MetadataRoute } from "next";
import { components } from "@/lib/catalog-data";
import { posts } from "@/lib/blog-data";
import { REAL_PAGES } from "@/lib/pages-data";
import { KITS } from "@/lib/kits";
import { COLLECTIONS } from "@/lib/collections";
import { COMPARISONS } from "@/lib/comparisons";

const siteUrl = "https://reactframe.com";

const STATIC_ROUTES = [
  "",
  "/components",
  "/elements",
  "/blocks",
  "/pages",
  // HIDDEN-UNTIL-LAUNCH (templates, dashboards)
  // "/templates",
  // "/dashboards",
  "/docs",
  "/docs/ai",
  "/kits",
  ...KITS.map((kit) => `/kits/${kit.slug}`),
  "/collections",
  ...COLLECTIONS.map((c) => `/collections/${c.slug}`),
  "/compare",
  ...COMPARISONS.map((c) => `/compare/${c.slug}`),
  "/changelog",
  "/blog",
  "/support",
  "/about",
  "/faq",
  "/help-center",
  "/license",
  "/premium",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/accessibility",
  "/cookies",
];

// No lastModified on static/component/page entries: stamping every URL with the build time tells
// crawlers everything changed on every deploy, and they learn to ignore the field. Blog posts carry
// their real publish date.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: path === "" || path === "/components" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/components" ? 0.9 : 0.6,
  }));

  const componentEntries: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${siteUrl}/components/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const pageEntries: MetadataRoute.Sitemap = REAL_PAGES.map((p) => ({
    url: `${siteUrl}/pages/preview/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...componentEntries, ...blogEntries, ...pageEntries];
}
