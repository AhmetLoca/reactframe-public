export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO date, e.g. "2026-08-18"
  readTime: string; // e.g. "4 min read"
  coverImage?: string; // put images in public/blog/
  // Markdown (GFM) — ## / ### headings, paragraphs, links, bold, and
  // tables all render. Rendered via BlogContent in [slug]/page.tsx.
  content: string;
}

// Add new posts here, newest first. Delete the example post once you have
// real ones — it exists only so the blog layout isn't empty by default.
export const posts: BlogPost[] = [
  {
    slug: "how-to-build-an-ai-voice-assistant-ui-in-react",
    title: "How to build an AI voice assistant UI in React",
    excerpt:
      "Build a working voice assistant interface in React with a free animated voice component and the browser's Web Speech API, then connect your own model.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "4 min read",
    content: `A voice assistant needs three things: something that listens, something that answers, and an interface that shows which of the two is happening. This tutorial builds all three in React with no API keys: the browser's built-in Web Speech API does the listening and speaking, and ReactFrame's free [AI Voice 01](/components/ai-voice-01) component is the interface.

By the end you'll have a voice pill that turns on when you tap it, shows a live audio visualizer while you talk, answers out loud, and goes back to idle when it's done. Swapping the canned answer for a real model is one function.

## 1. Install the component

AI Voice 01 is free and installs with the shadcn CLI:

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/ai-voice-01.json
\`\`\`

It drops the full source into \`components/ai-voice-01.tsx\` and installs its two small dependencies, \`clsx\` and \`tailwind-merge\`.

## 2. How the component thinks

The component has three states, \`idle\`, \`listening\` and \`speaking\`, and two ways to change them:

- **Your code** sets the \`status\` prop.
- **The user** taps the pill, which toggles between idle and listening and fires \`onStart\` (leaving idle) or \`onStop\` (back to idle).

Out of the box it also runs a demo flow that walks through the states on a timer. For a real assistant, turn that off with \`autoFlow={false}\` so only you and the user move it.

Two more props matter here: \`input="microphone"\` makes the visualizer follow the real microphone level while listening, and \`transcript={false}\` hides the demo sentences it types by default, so you can show what was actually heard.

## 3. Wire it to the Web Speech API

\`\`\`tsx
"use client";

import * as React from "react";
import { AiVoice01 } from "@/components/ai-voice-01";

type Status = "idle" | "listening" | "speaking";

// Replace this with a call to your model (an API route that calls OpenAI, Anthropic, and so on).
async function getReply(text: string): Promise<string> {
  return \`You said: \${text}\`;
}

export function VoiceAssistant() {
  const [status, setStatus] = React.useState<Status>("idle");
  const [heard, setHeard] = React.useState("");
  const recognition = React.useRef<any>(null);

  const listen = () => {
    const Recognition = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!Recognition) {
      setHeard("Speech recognition isn't supported in this browser.");
      return;
    }
    const r = new Recognition();
    r.lang = "en-US";
    r.onresult = async (event: any) => {
      if (recognition.current !== r) return; // stopped before the result arrived
      const text = event.results[0][0].transcript;
      setHeard(text);
      const reply = await getReply(text);
      if (recognition.current !== r) return;
      setStatus("speaking");
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.onend = () => setStatus("idle");
      speechSynthesis.speak(utterance);
    };
    r.onerror = () => setStatus("idle");
    recognition.current = r;
    r.start();
  };

  const stop = () => {
    recognition.current?.abort();
    recognition.current = null;
    speechSynthesis.cancel();
    setStatus("idle");
  };

  return (
    <div className="flex w-full max-w-[380px] flex-col items-center gap-4">
      <div className="h-24 w-full">
        <AiVoice01 status={status} autoFlow={false} input="microphone" transcript={false} onStart={listen} onStop={stop} />
      </div>
      {heard && <p className="text-sm text-neutral-500">{heard}</p>}
    </div>
  );
}
\`\`\`

What happens when you tap the pill:

1. The pill moves to \`listening\` and calls \`onStart\`, which starts speech recognition. The visualizer follows your voice.
2. When recognition returns a sentence, we show it, get a reply, and set \`status\` to \`speaking\`.
3. The browser reads the reply out loud; when it finishes, \`status\` goes back to \`idle\`.
4. Tapping again at any point calls \`onStop\`, which cancels everything; the \`recognition.current !== r\` checks make sure a late result from a cancelled session is ignored.

## 4. Connect a real model

Only \`getReply\` needs to change. Point it at an API route so your key stays on the server:

\`\`\`ts
async function getReply(text: string): Promise<string> {
  const res = await fetch("/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  return data.reply;
}
\`\`\`

For lower latency and more natural voices, replace the Web Speech API with a realtime speech API (OpenAI Realtime, ElevenLabs, Deepgram and others). The component doesn't change: keep setting \`status\` from whatever your audio pipeline is doing.

## Browser support and tips

- Speech recognition works in Chrome, Edge and Safari; Firefox doesn't support it yet, so show a fallback (a text input) there.
- The microphone needs a secure context: \`localhost\` or HTTPS.
- Keep one voice control per screen, and give it a clear label (the \`idleText\` prop) so people know it's tappable.

## Other voice styles

AI Voice 01 draws flowing curves. The same API powers the rest of the family, so you can swap the look without changing your code: a waveform, a dot matrix, a 3D particle orb, or a full-size portrait card. See them all in [React AI Voice Assistant Components](/collections/react-ai-voice-components).`,
  },
  {
    slug: "build-a-website-with-your-ai-and-reactframe",
    title: "How to build a website with Claude, ChatGPT or Cursor using ReactFrame components",
    excerpt:
      "Connect your AI assistant to ReactFrame, give it a good prompt, and get a site assembled from tested components plus a price for the premium parts.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "3 min read",
    content: `You can ask Claude, ChatGPT or Cursor to build a website out of ReactFrame components the same way you'd ask a designer: describe the business, and it picks the sections, installs the components and writes the copy. This post shows the setup, a prompt that works well, and what you get back.

## What the assistant can see

ReactFrame publishes everything an AI assistant needs to work with the catalog without guessing:

- [llms.txt](/llms.txt), a plain-text map of every component, kit and collection, with prices.
- A [design guide](/ai/design-guide.md) with the tokens, type scale, spacing, image rules and page recipes the assistant should follow, so a page made of many components still looks like one design.
- An MCP server, \`reactframe-mcp\`, that lets the assistant search components, install free ones and price premium ones.
- A quote endpoint that prices a list of components in one request.

## 1. Connect your assistant

**Claude Code**, one command:

\`\`\`bash
claude mcp add reactframe -- npx -y reactframe-mcp
\`\`\`

**Cursor and other MCP clients**, add this to your MCP config:

\`\`\`json
{
  "mcpServers": {
    "reactframe": { "command": "npx", "args": ["-y", "reactframe-mcp"] }
  }
}
\`\`\`

**ChatGPT or Claude.ai** without MCP: nothing to install. Start your prompt with "Read reactframe.com/llms.txt and reactframe.com/ai/design-guide.md, then…".

## 2. Ask for the site

Be specific about the business, the audience and the sections you want. For example:

\`\`\`text
Build a one-page website for "Moda Roasters", a specialty coffee shop in Kadıköy, Istanbul,
using ReactFrame components. Warm, calm look, light mode. Sections: hero, our coffees,
gallery, Google reviews, opening hours, location and footer. Follow the ReactFrame design
guide, and tell me what any premium components would cost.
\`\`\`

## 3. What comes back

A good run looks like this:

1. **Picks a kit or recipe.** For a café the design guide suggests the local business recipe: a photo hero, a menu section, a gallery, reviews and [Business Hours](/components/business-hours).
2. **Installs the free components** with the shadcn CLI and fills them with your content, one palette and one type scale across all of them.
3. **Leaves placeholders for premium components** instead of copying them, with a comment naming the component and its link, so the page structure is complete.
4. **Ends with a quote**: which premium components the design uses, their prices, the total, and whether All-Access is the cheaper option.

## 4. Review it like a designer would

Before you ship, check the things assistants most often get wrong:

- **One accent color.** Every component should use the site's accent, not its own default.
- **One h1.** The hero heading should be the only \`<h1>\`, with your main keyword in it.
- **Real content.** Replace placeholder photos and any invented numbers.
- **Mobile.** Open it at phone width and scroll the whole page.

## Why this works better than "make me a website"

A general-purpose assistant building from scratch invents a new design system every time. Giving it a catalog of finished, tested components plus a rulebook for combining them turns the job into assembly: the assistant chooses and connects pieces, and each piece is already responsive, themeable and animated.

Start from [Build a site with your AI](/docs/ai), or browse the [kits](/kits) to see which components are designed to go together.`,
  },
  {
    slug: "spin-to-win-wheel-popup-in-react",
    title: "How to add a spin-to-win wheel popup to a React site",
    excerpt:
      "Add a gamified discount wheel to your React site as an inline block or a timed popup, then set your own prizes, odds and campaign.",
    category: "Tutorial",
    date: "2026-09-26",
    readTime: "4 min read",
    content: `A spin-to-win wheel turns an email or discount popup into a small game: visitors spin, win a code, and are far more likely to use it than a plain "10% off" banner. This tutorial adds one to a React site with ReactFrame's free [Spin to Win Wheel](/components/spin-to-win-wheel), then shows how to set your own prizes and odds.

## 1. Install

\`\`\`bash
npx shadcn@latest add https://reactframe.com/r/spin-to-win-wheel.json
\`\`\`

The component lands in \`components/spin-to-win-wheel.tsx\` with its full source, so every prize and label is yours to edit.

## 2. Drop it on the page

Inline, for example on a promotions page:

\`\`\`tsx
import { SpinToWinWheel } from "@/components/spin-to-win-wheel";

export function Promo() {
  return (
    <div className="w-full max-w-[420px]">
      <SpinToWinWheel theme="ecommerce" freeSpins={3} />
    </div>
  );
}
\`\`\`

Or as a popup that opens a few seconds after the visitor arrives:

\`\`\`tsx
<SpinToWinWheel asPopup trigger="delay" delaySeconds={8} theme="ecommerce" />
\`\`\`

The props that shape the popup:

| Prop | What it does |
|---|---|
| \`asPopup\` | Shows a corner launcher and opens the wheel in a popup instead of inline. |
| \`trigger\` | \`"manual"\` (only the launcher opens it), \`"delay"\` (opens after \`delaySeconds\`) or \`"scroll"\` (opens when the spot where you placed it scrolls into view). |
| \`freeSpins\` | How many spins each visitor gets. |
| \`theme\` | One of the built-in themes, each with its own title, colors and prizes: \`ecommerce\`, \`campaign\`, \`restaurant\`, \`saas\`, \`event\`. |
| \`storageKey\` | Spins left and rewards won are saved in the visitor's browser, so a reload doesn't hand out fresh spins. Give each campaign its own key so a new campaign starts fresh. |
| \`widgetPosition\` | \`"bottom-right"\` or \`"bottom-left"\` for the launcher. |

## 3. Set your own prizes and odds

Prizes live in the \`THEMES\` object at the top of the component file. Each segment has a label, the code it reveals and a \`weight\`:

\`\`\`ts
segments: [
  { label: "5% off", code: "SPIN5", weight: 3 },
  { label: "10% off", code: "SPIN10", weight: 3 },
  { label: "15% off", code: "SPIN15", weight: 2 },
  { label: "20% off", code: "SPIN20", weight: 2 },
  // ...
],
\`\`\`

The weight is relative: a segment with weight 3 comes up three times as often as one with weight 1. Keep generous prizes rare. Every theme also has a "Try Again" slot that reveals no discount, which makes the real prizes feel earned.

Edit the theme you're using (or copy it into a new one) with your real codes, title and button text.

## 4. Make the codes real

The wheel shows codes; your checkout decides whether they're valid. Create the same codes in your store or payment provider, and validate them on the server when they're applied. Anything in the browser can be inspected, so treat the wheel as a way to hand out codes, not as the place that enforces them.

## Tips that keep it friendly

- **One popup per visit.** Don't stack a wheel on top of a newsletter popup and a cookie banner.
- **Give people a moment first.** A delay of 8 to 15 seconds, or the scroll trigger, converts better than opening instantly and annoys fewer visitors.
- **Say what you're collecting.** If you ask for an email before the spin, say so plainly and link your privacy policy.

## Other ways to gamify an offer

The same idea comes in other shapes: a scratch card, a dice roll and a ticket-style promo popup, plus an announcement bar and countdown for urgency. See them side by side in [Spin to Win Wheel and Discount Popups for React](/collections/react-discount-popups), or the [Growth kit](/kits/growth).`,
  },
  {
    slug: "welcome-to-the-reactframe-blog",
    title: "Welcome to the ReactFrame blog",
    excerpt:
      "Notes on building components, shipping fast, and what's coming next for the library.",
    category: "Announcement",
    date: "2026-08-18",
    readTime: "2 min read",
    content: `This is where component breakdowns, build notes, and everything new in the ReactFrame library will show up going forward.

Expect short, practical posts: how a component was built, what changed in an update, and the occasional look at what's next. Nothing long-winded, just notes worth reading before your next build.

More soon.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const sameCategory = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
