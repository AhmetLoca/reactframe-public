# reactframe-mcp

An MCP (Model Context Protocol) server for [ReactFrame](https://reactframe.com) — search and pull the full source of free React + Tailwind CSS + Motion components, blocks and pages directly into a coding agent, with no browser round-trip.

It wraps the same public data as [reactframe.com/llms.txt](https://reactframe.com/llms.txt) and the `r/<slug>.json` registry mirror shadcn's CLI already uses. Free components install straight into your project. Premium components show up in search with their price; their source isn't fetchable from here, so the agent leaves a placeholder and prices them with `get_quote` instead.

## Build a site with it

Ask your agent something like *"Build me a landing page for my coffee shop with ReactFrame components."* It picks components from the catalog, installs the free ones, marks where premium ones go, and ends with a quote: which premium components the design uses, what they cost, and whether All-Access is the better deal.

## Tools

- **search_components** — keyword search across name/description/category/slug, with `category`, `type` (`element` / `block` / `component` / `page`) and `freeOnly` filters. Premium results include their price.
- **get_component** — fetch a free component's full source (files, npm deps, install command) in shadcn registry format, by slug.
- **get_rebuild_prompt** — fetch the ready-made "rebuild this from scratch" AI prompt for the free components that ship one.
- **list_categories** — list every category with component/page counts, useful before a targeted search.
- **get_quote** — price every component and page a build uses in one call: free items with their install command, premium ones with their price, the premium total, and whether All-Access is cheaper.

## Add it to Claude Code

```bash
claude mcp add reactframe -- npx -y reactframe-mcp
```

## Add it to Cursor / other MCP clients

Add to your MCP config (e.g. `~/.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "reactframe": {
      "command": "npx",
      "args": ["-y", "reactframe-mcp"]
    }
  }
}
```

## Local development

```bash
npm install
npm run build
REACTFRAME_BASE_URL=http://localhost:3000 npm run test:tools
```

`REACTFRAME_BASE_URL` overrides the default `https://reactframe.com` — point it at a local `npm run dev` of the main app while iterating. `npm run test:tools` spawns the built server over stdio with the real MCP SDK client and calls every tool, the same way a real client would.
