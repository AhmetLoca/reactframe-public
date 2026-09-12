// Runs after `shadcn build`. That build step turns every entry in
// registry.json into a public, unauthenticated static file under
// public/r/<slug>.json — including premium components, since shadcn has no
// concept of gating. This deletes the generated file for any component
// marked `free: false` in catalog-data.ts, so `npx shadcn add
// .../r/<slug>.json` 404s for premium items instead of silently handing out
// the full source.
//
// This only closes the "official install command" distribution path. The
// component's .tsx source still lives in this repo's git tree — if this
// repo's remote is public, someone can still read it on GitHub. Real
// protection requires moving premium component source out of this
// repository before it's pushed anywhere public.
import { existsSync, rmSync } from "node:fs";
import path from "node:path";
import { components } from "../src/lib/catalog-data.ts";

const registryDir = path.join(process.cwd(), "public", "r");
const premiumSlugs = components.filter((c) => !c.free).map((c) => c.slug);

for (const slug of premiumSlugs) {
  const file = path.join(registryDir, `${slug}.json`);
  if (existsSync(file)) {
    rmSync(file);
    console.log(`- Removed public registry file for premium component: ${slug}`);
  }
}
