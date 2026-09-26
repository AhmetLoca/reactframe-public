import type { Metadata } from "next";
import Link from "next/link";
import { allAccessOffer } from "@/lib/quote";

export const metadata: Metadata = {
  alternates: { canonical: "/docs/ai" },
  title: "Build a Site with Your AI: ReactFrame for Claude, ChatGPT and Cursor",
  description:
    "Connect ReactFrame to Claude, ChatGPT, Cursor or any AI coding assistant and ask it to build a website from free and premium React components, with a price for the premium picks.",
};

const MCP_COMMAND = "claude mcp add reactframe -- npx -y reactframe-mcp";
const MCP_JSON = `{
  "mcpServers": {
    "reactframe": {
      "command": "npx",
      "args": ["-y", "reactframe-mcp"]
    }
  }
}`;

const PROMPTS = [
  "Build me a landing page for my coffee shop using ReactFrame components. Warm colors, a hero, a menu section, reviews and a footer.",
  "Using ReactFrame, create a portfolio site for a product designer: project gallery, about section, testimonials and contact.",
  "Make a SaaS pricing page with ReactFrame components and tell me what the premium ones would cost.",
];

const FAQ = [
  {
    q: "Which AI assistants does this work with?",
    a: "Any assistant that can read a web page or use MCP tools: Claude, Claude Code, ChatGPT, Cursor, Windsurf, GitHub Copilot and others. MCP gives the smoothest result because the assistant can search, install and price components directly.",
  },
  {
    q: "Will the AI copy premium components?",
    a: "No. Premium source isn't public, and ReactFrame tells assistants not to recreate premium components from their previews. They leave a marked placeholder instead and include the component in the quote, so you decide what to buy.",
  },
  {
    q: "What does it cost?",
    a: `Free components cost nothing. Premium components are paid once, and All-Access is ${allAccessOffer().price} for every premium component, block and Pro page plus 12 months of new releases. The assistant recommends All-Access when it's the cheaper option.`,
  },
];

const linkClass = "underline decoration-foreground/20 underline-offset-4 hover:decoration-foreground";

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-border bg-card px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground/85">
      <code>{children}</code>
    </pre>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="flex items-center gap-3 text-xl font-semibold tracking-tight">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-foreground text-sm text-background">{n}</span>
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-foreground/70">{children}</div>
    </section>
  );
}

export default function DocsAiPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map(({ q, a }) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
          }),
        }}
      />

      <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Docs · AI</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Build a site with your AI</h1>
      <p className="mt-5 text-[17px] leading-relaxed text-foreground/65">
        Ask Claude, ChatGPT, Cursor or any AI coding assistant to build a website from ReactFrame components. It picks the components that fit, installs
        the free ones into your project, marks where premium ones go, and finishes with a price for them.
      </p>

      <Step n={1} title="Connect your assistant">
        <p>
          <strong className="font-semibold text-foreground">Claude Code</strong>, one command:
        </p>
        <Code>{MCP_COMMAND}</Code>
        <p>
          <strong className="font-semibold text-foreground">Cursor, Windsurf and other MCP clients</strong>, add this to your MCP config (for Cursor,{" "}
          <code className="font-mono text-[13px]">~/.cursor/mcp.json</code>):
        </p>
        <Code>{MCP_JSON}</Code>
        <p>
          <strong className="font-semibold text-foreground">ChatGPT, Claude.ai and assistants without MCP</strong>: nothing to install. Start your prompt
          with &ldquo;Read{" "}
          <a href="/llms.txt" className={linkClass}>
            reactframe.com/llms.txt
          </a>
          , then&hellip;&rdquo; and the assistant gets the whole catalog, the install commands and the pricing.
        </p>
      </Step>

      <Step n={2} title="Ask for a site">
        <p>Describe what you want in plain words. A few to start from:</p>
        <ul className="space-y-3">
          {PROMPTS.map((prompt) => (
            <li key={prompt} className="rounded-xl border border-border bg-card px-4 py-3 text-foreground/80">
              &ldquo;{prompt}&rdquo;
            </li>
          ))}
        </ul>
      </Step>

      <Step n={3} title="Get the site and a quote">
        <p>
          Free components are installed with the shadcn CLI and wired up with your content. Premium components aren&apos;t copied: the assistant leaves a
          marked placeholder where each one goes, then ends with a short quote listing them, their prices and the total.
        </p>
        <p>
          Buy the ones you want from their component pages, or get{" "}
          <Link href="/premium" className={linkClass}>
            All-Access
          </Link>{" "}
          for {allAccessOffer().price} when the total is higher. Paste each premium source in place of its placeholder and the site is done.
        </p>
      </Step>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">Questions</h2>
        <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card px-6">
          {FAQ.map(({ q, a }) => (
            <div key={q} className="py-5">
              <dt className="text-[15px] font-medium">{q}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-foreground/65">{a}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="mt-10 text-sm text-foreground/50">
        Prefer to pick by hand?{" "}
        <Link href="/components" className={linkClass}>
          Browse the components
        </Link>
        .
      </p>
    </div>
  );
}
