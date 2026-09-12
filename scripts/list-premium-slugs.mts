// Prints premium (free: false) component slugs, one per line. Used by
// publish-public-mirror.sh to know which registry/new-york/<slug> folders
// must never be copied into the public mirror repo.
import { components } from "../src/lib/catalog-data.ts";

for (const c of components) {
  if (!c.free) console.log(c.slug);
}
