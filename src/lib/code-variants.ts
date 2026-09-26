import { readFile } from "node:fs/promises";
import path from "node:path";

// Each component's alternate Code-tab variants (plain JS+Tailwind, TS+CSS,
// JS+CSS) live as one small JSON file per slug in registry-code-variants/,
// read from disk on demand for the single component page being requested —
// mirroring how the primary tsTailwind source is already read from
// registry/new-york/<slug>/<slug>.tsx in src/app/components/[slug]/page.tsx.
// This used to be a single ~13MB codeVariants object statically imported
// into every build of that page, which made Turbopack re-parse the whole
// file on every edit to any one component's variant and pegged the dev
// server's CPU. Splitting it into per-slug files on disk means an edit only
// touches (and only costs recompiling) that one small file.
export interface CodeVariants {
  jsTailwind?: string;
  tsCss?: string;
  jsCss?: string;
}

export async function getCodeVariants(slug: string): Promise<CodeVariants> {
  try {
    const filePath = path.join(process.cwd(), "registry-code-variants", `${slug}.json`);
    const raw = await readFile(filePath, "utf-8");
    return JSON.parse(raw) as CodeVariants;
  } catch {
    return {};
  }
}
