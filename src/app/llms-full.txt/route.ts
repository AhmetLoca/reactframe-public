import { buildLlmsLines } from "@/lib/llms-content";

// The "everything inlined" companion to /llms.txt (see that route for the
// concise index) — same catalog data, but every free component's AI
// rebuild prompt is written out in full instead of linked to, so an agent
// can get a component's full rebuild spec from this one file without a
// second fetch per component.
export const dynamic = "force-static";

export async function GET() {
  return new Response(buildLlmsLines(true).join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
