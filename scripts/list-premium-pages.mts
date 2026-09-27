// Prints the slugs of premium (free: false) full pages, one per line. Used by
// publish-public-mirror.sh to keep src/app/pages/preview/<slug>/ (the page's whole source) out of
// the public mirror, the same way list-premium-slugs.mts does for registry components.
import { REAL_PAGES } from "../src/lib/pages-data.ts";

for (const p of REAL_PAGES) {
  if (!p.free) console.log(p.slug);
}
