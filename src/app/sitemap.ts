import type { MetadataRoute } from "next";
import { components } from "@/lib/catalog-data";
import { posts } from "@/lib/blog-data";

const siteUrl = "https://reactframe.com";

const STATIC_ROUTES = [
  "",
  "/components",
  "/elements",
  "/blocks",
  "/pages",
  "/templates",
  "/dashboards",
  "/docs",
  "/changelog",
  "/blog",
  "/support",
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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/components" ? "daily" : "weekly",
    priority: path === "" ? 1 : path === "/components" ? 0.9 : 0.6,
  }));

  const componentEntries: MetadataRoute.Sitemap = components.map((c) => ({
    url: `${siteUrl}/components/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticEntries, ...componentEntries, ...blogEntries];
}
