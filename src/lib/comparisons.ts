// Honest head-to-head pages (/compare/<slug>) for the libraries people most often weigh ReactFrame
// against. Competitor facts come from their own sites and GitHub on CHECKED_ON; re-check them before
// editing, and keep the "choose them if" column as fair as the "choose ReactFrame if" one.

export const CHECKED_ON = "September 2026";

export interface ComparisonRow {
  feature: string;
  reactframe: string;
  them: string;
}

export interface Comparison {
  slug: string;
  name: string;
  url: string;
  sources: string[];
  /** One-paragraph neutral summary of the competitor. */
  about: string;
  rows: ComparisonRow[];
  chooseThem: string[];
  chooseUs: string[];
  faq: { q: string; a: string }[];
}

/** ReactFrame's side of every table, so the numbers match across pages. {components}, {free} are filled at render. */
export const REACTFRAME_FACTS = {
  size: "{components} components, blocks and elements, plus Pro pages",
  free: "{free} free components for personal and commercial use",
  paid: "Premium components one by one ($4 to $8 each), or All-Access at $49 (launch price, regularly $129) for 12 months of access",
  install: "shadcn CLI from a registry URL, or copy the source",
  stack: "React, TypeScript, Tailwind CSS, Motion",
  ai: "llms.txt, a JSON catalog, an MCP server, and a quote endpoint that prices the premium components an assistant picks",
};

export const COMPARISONS: Comparison[] = [
  {
    slug: "reactframe-vs-aceternity-ui",
    name: "Aceternity UI",
    url: "https://ui.aceternity.com",
    sources: ["https://ui.aceternity.com", "https://ui.aceternity.com/pricing"],
    about:
      "Aceternity UI is one of the best-known animated React component libraries, founded in 2023. It offers 116+ free copy-paste components and an All-Access plan with 200+ premium blocks and 12+ full templates, all built with React, Next.js, Tailwind CSS and Motion.",
    rows: [
      { feature: "Library size", reactframe: "size", them: "116+ free components, 200+ premium blocks, 12+ templates" },
      { feature: "Free tier", reactframe: "free", them: "116+ free components, personal and commercial use" },
      { feature: "Paid options", reactframe: "paid", them: "All-Access: $169 per year, $199 lifetime, $1,590 for teams" },
      { feature: "Buy a single component", reactframe: "Yes, $4 to $8", them: "No, paid content comes with All-Access" },
      { feature: "Installation", reactframe: "install", them: "shadcn CLI (@aceternity namespace), or copy the source; templates as zip downloads" },
      { feature: "Stack", reactframe: "stack", them: "React, Next.js, TypeScript, Tailwind CSS, Motion" },
      { feature: "Tools for AI assistants", reactframe: "ai", them: "An MCP server, llms.txt and an AI recommendations page" },
    ],
    chooseThem: [
      "You want full multi-page templates today (12+ ready to download).",
      "You prefer lifetime access over a 12-month window.",
      "You value a large, established community and many third-party tutorials.",
    ],
    chooseUs: [
      "You only need a few premium pieces and would rather pay $4 to $8 each than $169+.",
      "You want the cheapest route to everything: All-Access is $49 at launch.",
      "You build with an AI assistant and want it to tell you what the premium parts of a design cost before you buy anything.",
      "You want less common pieces: AI voice and chat UI, review widgets, chat bubbles, mini games, discount popups and device mockups.",
    ],
    faq: [
      {
        q: "Is ReactFrame a free alternative to Aceternity UI?",
        a: "Partly. ReactFrame has a large free tier, and its premium pieces cost far less, either one by one or through All-Access. For animated backgrounds, text effects, cards and carousels, both libraries cover similar ground.",
      },
      {
        q: "Can I use ReactFrame and Aceternity UI in the same project?",
        a: "Yes. Both ship plain React + Tailwind source into your project, so components from both can live side by side; align their colors and spacing so the page stays consistent.",
      },
    ],
  },
  {
    slug: "reactframe-vs-magic-ui",
    name: "Magic UI",
    url: "https://magicui.design",
    sources: ["https://magicui.design", "https://pro.magicui.design", "https://github.com/magicuidesign/magicui"],
    about:
      "Magic UI is a free, MIT-licensed library of animated components and effects for design engineers (22,000+ GitHub stars). Magic UI Pro adds 50+ components, sections and landing page templates for a one-time $199.",
    rows: [
      { feature: "Library size", reactframe: "size", them: "Free open-source library, plus 50+ Pro components, sections and templates" },
      { feature: "Free tier", reactframe: "free", them: "The whole core library, MIT licensed" },
      { feature: "Paid options", reactframe: "paid", them: "Magic UI Pro: $199 one-time, lifetime access" },
      { feature: "Buy a single component", reactframe: "Yes, $4 to $8", them: "No, Pro is one bundle" },
      { feature: "Installation", reactframe: "install", them: "shadcn CLI (@magicui namespace), or copy the source" },
      { feature: "Stack", reactframe: "stack", them: "React, TypeScript, Tailwind CSS, Motion" },
      { feature: "Source on GitHub", reactframe: "No; free components are served from the public registry (r/<slug>.json)", them: "Yes, the open-source core" },
      { feature: "Tools for AI assistants", reactframe: "ai", them: "An official MCP server and llms.txt" },
    ],
    chooseThem: [
      "You want everything free and MIT licensed with the source on GitHub.",
      "You want polished landing page templates with lifetime access.",
      "You want an open-source library with a large GitHub community behind it.",
    ],
    chooseUs: [
      "You need more than effects: ReactFrame also has full blocks (footers, heroes, testimonials, e-commerce) and Pro pages.",
      "You want to pay only for the premium pieces you use, from $4 each.",
      "You build with an AI assistant and want it to price the premium picks in a design, not just install components.",
      "You need SEO-ready components that emit structured data for reviews, teams, products and articles.",
    ],
    faq: [
      {
        q: "Is Magic UI or ReactFrame better for a landing page?",
        a: "Both work. Magic UI Pro is strongest if you want a finished landing page template; ReactFrame is strongest if you want to assemble your own page from blocks and kits, or have an AI assistant do it.",
      },
    ],
  },
  {
    slug: "reactframe-vs-react-bits",
    name: "React Bits",
    url: "https://reactbits.dev",
    sources: ["https://reactbits.dev", "https://pro.reactbits.dev", "https://github.com/DavidHDev/react-bits"],
    about:
      "React Bits is a very popular open-source collection of 200+ animated, interactive React components and micro-interactions (48,000+ GitHub stars). React Bits Pro adds 150 components, 280 page blocks, 300 app UI blocks, 15 templates and an AI agent kit, sold as one-time tiers from $129 to $349.",
    rows: [
      { feature: "Library size", reactframe: "size", them: "200+ free components; Pro: 150 components, 580 blocks, 15 templates" },
      { feature: "Free tier", reactframe: "free", them: "The 200+ open-source components" },
      { feature: "Paid options", reactframe: "paid", them: "React Bits Pro: one-time tiers from $129 to $349, lifetime updates" },
      { feature: "Buy a single component", reactframe: "Yes, $4 to $8", them: "No, Pro is sold in tiers" },
      { feature: "Installation", reactframe: "install", them: "shadcn CLI or jsrepo, or copy the source" },
      { feature: "Stack", reactframe: "stack", them: "React, in four variants per component: JS or TS, with CSS or Tailwind" },
      { feature: "Tools for AI assistants", reactframe: "ai", them: "llms.txt; Pro includes an AI agent kit" },
    ],
    chooseThem: [
      "You want the largest free collection of creative effects and micro-interactions.",
      "You need a huge number of page and app blocks in one purchase.",
      "You want JavaScript and plain-CSS variants of every component.",
    ],
    chooseUs: [
      "You want a small number of premium pieces without buying a $129+ tier.",
      "You want kits and use-case collections that tell you which components work together.",
      "You want SEO-ready components and AI tooling that prices a build for you.",
    ],
    faq: [
      {
        q: "Are React Bits and ReactFrame the same kind of library?",
        a: "Both are copy-into-your-project React component libraries with a strong focus on animation. React Bits leans toward creative effects and micro-interactions; ReactFrame adds full blocks, pages, widgets and kits for assembling whole sites.",
      },
    ],
  },
];
