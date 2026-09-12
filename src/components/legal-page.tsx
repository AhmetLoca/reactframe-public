export function LegalPage({ title, lastUpdated, paragraphs }: { title: string; lastUpdated: string; paragraphs: string[] }) {
  return (
    <div className="mx-auto max-w-2xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      <p className="mt-3 font-mono text-xs tracking-[0.15em] text-foreground/40 uppercase">Last updated: {lastUpdated}</p>
      <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-foreground/70">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
