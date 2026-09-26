import * as React from "react";

// Everything on this card is derived from the page's own source, so it stays
// correct when the page changes: which packages it imports, which constants
// hold its copy and data, which image paths it points at and which fonts it
// loads through next/font.

export function getPagePackages(source: string): string[] {
  const found = new Set<string>();
  for (const match of source.matchAll(/^import[^;]*?from "([^"]+)";/gm)) {
    const spec = match[1];
    if (spec.startsWith(".") || spec.startsWith("@/") || spec === "react" || spec.startsWith("next/") || spec === "next") continue;
    if (spec === "motion/react") found.add("motion");
    else found.add(spec.startsWith("@") ? spec.split("/").slice(0, 2).join("/") : spec.split("/")[0]);
  }
  return [...found];
}

function getFonts(source: string): string[] {
  const match = source.match(/import \{([^}]+)\} from "next\/font\/google";/);
  if (!match) return [];
  return match[1].split(",").map((name) => name.trim().replace(/_/g, " ")).filter(Boolean);
}

function getConstants(source: string): string[] {
  return [...new Set([...source.matchAll(/^const ([A-Z][A-Z0-9_]+)\s*(?::|=)/gm)].map((m) => m[1]))];
}

function getImages(source: string): string[] {
  return [...new Set([...source.matchAll(/"(\/[^"\s]+\.(?:webp|png|jpe?g|svg|avif|gif))"/g)].map((m) => m[1]))];
}

function Code({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-foreground/[0.07] px-1.5 py-0.5 font-mono text-[12px] text-foreground/85">{children}</code>;
}

function List({ items, max }: { items: string[]; max: number }) {
  const shown = items.slice(0, max);
  const rest = items.length - shown.length;
  return (
    <>
      {shown.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && ", "}
          <Code>{item}</Code>
        </React.Fragment>
      ))}
      {rest > 0 && <span className="text-foreground/50"> and {rest} more</span>}
    </>
  );
}

export function PageUsage({ slug, source }: { slug: string; source: string }) {
  const constants = getConstants(source);
  const images = getImages(source);
  const fonts = getFonts(source);

  const steps: React.ReactNode[] = [
    <>
      Save the code below as a route in your Next.js app, for example <Code>{`app/${slug}/page.tsx`}</Code> (<Code>page.jsx</Code> for the JavaScript version). It is a
      client component and adapts to the width of its container, so it also works inside a layout.
    </>,
  ];
  if (constants.length > 0) {
    steps.push(
      <>
        Edit the content. All copy and data sit in constants at the top of the file: <List items={constants} max={6} />.
      </>,
    );
  }
  if (images.length > 0) {
    steps.push(
      <>
        Swap the demo images for your own. They are referenced by path: <List items={images} max={4} />.
      </>,
    );
  }
  if (fonts.length > 0) {
    steps.push(
      <>
        The page loads <List items={fonts} max={4} /> with <Code>next/font/google</Code>. Change the font calls, or delete them to inherit your site&apos;s font.
      </>,
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="px-4 py-3">
        <span className="text-sm font-semibold text-foreground">Usage</span>
      </div>
      <ol className="m-0 list-none space-y-3 border-t border-border px-4 py-4">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-foreground/70">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border text-[11px] font-medium text-foreground/60">{i + 1}</span>
            <span className="min-w-0">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
