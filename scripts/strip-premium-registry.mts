// Runs after `shadcn build`. That build step turns every entry in
// registry.json into a public, unauthenticated static file under
// public/r/<slug>.json — including premium components, since shadcn has no
// concept of gating. This deletes the generated file for any component
// marked `free: false` (or `hidden: true`) in catalog-data.ts, so `npx shadcn add
// .../r/<slug>.json` 404s for premium items instead of silently handing out
// the full source.
//
// This only closes the "official install command" distribution path. The
// component's .tsx source still lives in this repo's git tree — if this
// repo's remote is public, someone can still read it on GitHub. Real
// protection requires moving premium component source out of this
// repository before it's pushed anywhere public.
import { existsSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { allComponents } from "../src/lib/catalog-data.ts";

const registryDir = path.join(process.cwd(), "public", "r");
// Premium (free: false) and hidden (unpublished) components are both kept out of the public registry.
const premiumSlugs = allComponents.filter((c) => !c.free || c.hidden).map((c) => c.slug);

for (const slug of premiumSlugs) {
  const file = path.join(registryDir, `${slug}.json`);
  if (existsSync(file)) {
    rmSync(file);
    console.log(`- Removed public registry file for premium component: ${slug}`);
  }
}

// The index file (public/r/registry.json) still lists every item, so the shadcn CLI, the registry
// directory's health checks and anyone browsing it would see premium and hidden entries that 404.
// Keep only the items whose public file actually exists.
const indexFile = path.join(registryDir, "registry.json");
if (existsSync(indexFile)) {
  const index = JSON.parse(readFileSync(indexFile, "utf8")) as { items: { name: string }[] };
  const before = index.items.length;
  index.items = index.items.filter((item) => existsSync(path.join(registryDir, `${item.name}.json`)));
  writeFileSync(indexFile, JSON.stringify(index, null, 2) + "\n");
  console.log(`registry.json: ${index.items.length} public items (dropped ${before - index.items.length} premium/hidden)`);
}
