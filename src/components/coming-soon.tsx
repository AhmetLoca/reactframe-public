import Link from "next/link";

export function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pt-20 pb-24 text-center md:pt-28">
      <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-xs font-medium">Coming Soon</span>

      <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">{title}</h1>

      <p className="mx-auto mt-6 max-w-lg text-[17px] leading-relaxed text-foreground/60">{description}</p>

      <p className="mx-auto mt-3 max-w-lg text-sm text-foreground/40">We&apos;re still building this section — check back soon.</p>

      <Link
        href="/components"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity duration-300 ease-signature hover:opacity-80"
      >
        Browse Components
      </Link>
    </main>
  );
}
