import { getCatalogData } from "@/lib/llms-content";

// The machine-readable (JSON, not markdown) sibling of /llms.txt and
// /llms-full.txt — same underlying catalog data, shaped for a program to
// search rather than an LLM to read as prose. This is what mcp-server/
// (the ReactFrame MCP server) fetches once per process and caches, so its
// search_components/get_rebuild_prompt tools don't have to parse markdown.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(getCatalogData());
}
