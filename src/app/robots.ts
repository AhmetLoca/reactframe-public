import type { MetadataRoute } from "next";

// Blocks known bulk/offline AI *training* crawlers site-wide — premium
// component source is a commercial product, not training data (see the
// AI/ML clause in /license and the machine-readable /ai.txt). This doesn't
// touch search or answer-engine bots (Googlebot, Bingbot, OAI-SearchBot,
// PerplexityBot, ...), and has nothing to do with our MCP server or
// /llms.txt — those are real-time, on-demand fetches made by a human's
// agent, not indiscriminate crawling, and stay fully allowed below.
const AI_TRAINING_BOTS = [
  "GPTBot",
  "CCBot",
  "Google-Extended",
  "Bytespider",
  "Applebot-Extended",
  "meta-externalagent",
  "Amazonbot",
  "ClaudeBot",
  "Diffbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      {
        userAgent: AI_TRAINING_BOTS,
        disallow: "/",
      },
    ],
    sitemap: ["https://reactframe.com/sitemap.xml", "https://reactframe.com/ai-sitemap.xml"],
  };
}
