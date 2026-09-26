import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Standalone verification harness — spawns the compiled server exactly as a
// real MCP client (Claude Code, Cursor, ...) would, over stdio, and calls
// every registered tool. Not part of the published package (not in "files").

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, "..", "dist", "index.js");

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: [serverPath],
    env: { ...process.env, REACTFRAME_BASE_URL: process.env.REACTFRAME_BASE_URL ?? "" } as Record<string, string>,
  });
  const client = new Client({ name: "reactframe-mcp-test", version: "0.0.1" });
  await client.connect(transport);

  const tools = await client.listTools();
  console.log(
    "tools:",
    tools.tools.map((t) => t.name),
  );

  const list = await client.callTool({ name: "list_categories", arguments: {} });
  console.log("\nlist_categories ->", JSON.stringify(list.content).slice(0, 300));

  const search = await client.callTool({
    name: "search_components",
    arguments: { query: "chart", freeOnly: true },
  });
  const searchText = (search.content as { type: string; text: string }[])[0].text;
  const searchJson = JSON.parse(searchText);
  console.log("\nsearch_components(chart, freeOnly) -> count:", searchJson.count);
  console.log(searchJson.results.slice(0, 3));

  const searchAll = await client.callTool({ name: "search_components", arguments: { limit: 3 } });
  console.log(
    "\nsearch_components(no filters, limit 3) -> count:",
    JSON.parse((searchAll.content as { type: string; text: string }[])[0].text).count,
  );

  const searchType = await client.callTool({ name: "search_components", arguments: { type: "page", limit: 5 } });
  const pagesJson = JSON.parse((searchType.content as { type: string; text: string }[])[0].text);
  console.log("\nsearch_components(type=page, limit 5) -> count:", pagesJson.count, "sample:", pagesJson.results[0]);

  const freeSlug = searchJson.results[0]?.slug as string | undefined;
  if (freeSlug) {
    const comp = await client.callTool({ name: "get_component", arguments: { slug: freeSlug } });
    const compText = (comp.content as { type: string; text: string }[])[0].text;
    const compJson = JSON.parse(compText);
    console.log(
      `\nget_component(${freeSlug}) -> installCommand:`,
      compJson.installCommand,
      "| files:",
      compJson.registry?.files?.map((f: { path: string }) => f.path),
    );
  }

  // Find a premium slug to confirm gating.
  const premiumSearch = await client.callTool({ name: "search_components", arguments: { limit: 100 } });
  const premiumJson = JSON.parse((premiumSearch.content as { type: string; text: string }[])[0].text);
  const premiumEntry = premiumJson.results.find((r: { free: boolean }) => !r.free);
  if (premiumEntry) {
    const comp = await client.callTool({ name: "get_component", arguments: { slug: premiumEntry.slug } });
    console.log(`\nget_component(${premiumEntry.slug}) [premium] ->`, (comp.content as { type: string; text: string }[])[0].text.slice(0, 250));
  }

  const promptEntry = premiumJson.results.find((r: { hasPrompt: boolean }) => r.hasPrompt);
  if (promptEntry) {
    const prompt = await client.callTool({ name: "get_rebuild_prompt", arguments: { slug: promptEntry.slug } });
    console.log(`\nget_rebuild_prompt(${promptEntry.slug}) ->`, (prompt.content as { type: string; text: string }[])[0].text.slice(0, 200));
  }

  const missing = await client.callTool({ name: "get_component", arguments: { slug: "not-a-real-slug" } });
  console.log("\nget_component(not-a-real-slug) ->", (missing.content as { type: string; text: string }[])[0].text);

  console.log("\ninstructions ->", client.getInstructions()?.split("\n")[0]);

  const quote = await client.callTool({ name: "get_quote", arguments: { slugs: ["button", "google-reviews", "pricing-page", "not-a-real-slug"] } });
  const quoteJson = JSON.parse((quote.content as { type: string; text: string }[])[0].text);
  console.log("\nget_quote ->", quoteJson.recommendation, quoteJson.premiumTotal, "unknown:", quoteJson.unknownSlugs, "|", quoteJson.summary);

  await client.close();
  console.log("\nAll tool calls completed without throwing.");
}

main().catch((err) => {
  console.error("test-client failed:", err);
  process.exit(1);
});
