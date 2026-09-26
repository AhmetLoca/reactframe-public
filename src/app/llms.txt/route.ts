import { buildLlmsLines } from "@/lib/llms-content";

// Emerging convention (llmstxt.org) for helping AI crawlers, answer engines
// and coding agents understand a site's content without having to
// render/parse full HTML pages — a plain-text sitemap-for-LLMs. This is the
// concise index; src/app/llms-full.txt/route.ts is the same data with every
// free component's AI rebuild prompt inlined instead of linked out to.
export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsLines(false).join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
