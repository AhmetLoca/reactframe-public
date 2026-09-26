import { readFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import type { ComponentCode } from "@/components/component-preview";
import { REAL_PAGES } from "@/lib/pages-data";

// The Code tab of a /pages/preview/[slug] page shows the real source of that
// page's view (src/app/pages/preview/<slug>/view/page.tsx), read from disk at
// build/request time so it can never drift from what the preview renders.
// Two things are removed first because they only exist for the docs site's
// iframe preview: the PreviewViewFrame import and the wrapper element itself.
// The JavaScript variant is the same file with the types stripped.
const SLUG = /^[a-z0-9-]+$/;

export function cleanPageSource(source: string): string {
  return source
    .replace(/^import \{ PreviewViewFrame \} from "[^"]+";\n/m, "")
    .replace(/<PreviewViewFrame slug="[^"]+">/, "<>")
    .replace(/<\/PreviewViewFrame>/, "</>");
}

export async function getPageCode(slug: string): Promise<ComponentCode | null> {
  if (!SLUG.test(slug)) return null;
  // Pro pages: the source is never read, so it can't reach the client. The Code tab shows a Buy button instead.
  if (REAL_PAGES.find((p) => p.slug === slug)?.free === false) return null;
  try {
    const filePath = path.join(process.cwd(), "src", "app", "pages", "preview", slug, "view", "page.tsx");
    const tsTailwind = cleanPageSource(await readFile(filePath, "utf-8"));
    const jsTailwind = ts.transpileModule(tsTailwind, {
      compilerOptions: { jsx: ts.JsxEmit.Preserve, target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
    }).outputText;
    return { tsTailwind, jsTailwind };
  } catch {
    return null;
  }
}
