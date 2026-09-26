// Prints the slugs that must stay out of the public mirror — premium (free: false)
// and hidden (unpublished) components — one per line. Used by
// publish-public-mirror.sh to know which registry/new-york/<slug> folders
// must never be copied into the public mirror repo.
import { allComponents } from "../src/lib/catalog-data.ts";

for (const c of allComponents) {
  if (!c.free || c.hidden) console.log(c.slug);
}
