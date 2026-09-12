import type { Metadata } from "next";
import { changelog } from "@/lib/changelog-data";

export const metadata: Metadata = {
  title: "Changelog",
  description: "What's new in ReactFrame — new components, features, and site updates.",
};

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Changelog</h1>
      <p className="mt-3 max-w-xl text-foreground/60">
        Every notable update to the component catalog and the site itself, newest first.
      </p>

      <div className="mt-12 flex flex-col gap-12">
        {changelog.map((entry) => (
          <div key={entry.date} className="grid grid-cols-1 gap-3 sm:grid-cols-[140px_1fr] sm:gap-8">
            <div className="font-mono text-xs text-foreground/40 sm:pt-1">{formatDate(entry.date)}</div>
            <div>
              <h2 className="text-lg font-semibold">{entry.title}</h2>
              <ul className="mt-3 flex flex-col gap-2 text-sm text-foreground/60">
                {entry.items.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-foreground/25">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
