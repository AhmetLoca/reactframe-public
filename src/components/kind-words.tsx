import { testimonials, type Testimonial } from "@/lib/testimonials-data";

function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FramerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  );
}

function VerifiedBadge() {
  return (
    <svg viewBox="0 0 22 22" className="h-4 w-4 shrink-0">
      <path
        fill="#1d9bf0"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.018-1.273.215-1.813.57-.54.354-.972.851-1.245 1.44-.607-.223-1.264-.27-1.897-.14-.634.132-1.218.437-1.687.882-.445.47-.75 1.053-.882 1.687-.13.633-.083 1.29.14 1.897-.587.274-1.084.706-1.438 1.246C1.82 9.725 1.622 10.354 1.604 11c.018.646.215 1.273.57 1.813.354.54.851.972 1.438 1.246-.223.607-.27 1.264-.14 1.897.131.634.437 1.218.882 1.687.47.446 1.053.751 1.687.882.633.13 1.29.083 1.897-.14.274.588.705 1.085 1.245 1.44.54.354 1.167.551 1.813.569.646-.018 1.273-.215 1.813-.57.54-.354.972-.851 1.245-1.44.607.223 1.264.27 1.897.14.634-.132 1.217-.437 1.687-.882.445-.47.75-1.053.882-1.687.13-.634.083-1.29-.14-1.897.588-.274 1.085-.705 1.44-1.245.354-.54.551-1.167.569-1.813z"
      />
      <path fill="#fff" d="M9.662 14.85l-3.429-3.428 1.293-1.293 2.136 2.136 4.44-4.44 1.293 1.293-5.733 5.732z" />
    </svg>
  );
}

function Card({ t }: { t: Testimonial }) {
  return (
    <a
      href={t.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group/card relative block w-72 shrink-0 overflow-hidden rounded-2xl border border-border bg-card p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-foreground/[0.06]">
            {t.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-foreground/40">{t.name.charAt(0)}</div>
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-medium">{t.name}</p>
              {t.verified && <VerifiedBadge />}
              {t.badge && <span className="shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-foreground/50">{t.badge}</span>}
            </div>
            {t.handle && <p className="truncate text-xs text-foreground/45">{t.handle}</p>}
          </div>
        </div>
        {t.source === "framer" ? <FramerLogo className="h-4 w-4 shrink-0 text-foreground/25" /> : <XLogo className="h-4 w-4 shrink-0 text-foreground/25" />}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-foreground/70">{t.quote}</p>

      <div className="absolute inset-0 flex items-center justify-center bg-card/90 opacity-0 backdrop-blur-[2px] transition-opacity duration-300 ease-signature group-hover/card:opacity-100">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background">
          {t.source === "framer" ? "View Review" : "View Tweet"}
          <svg viewBox="0 0 12 12" className="h-3 w-3">
            <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </a>
  );
}

function Row({ items, duration, direction = "left" }: { items: Testimonial[]; duration: number; direction?: "left" | "right" }) {
  return (
    <div className="group/row relative w-full min-w-0 overflow-hidden">
      <div
        className={`flex w-max gap-4 group-hover/row:[animation-play-state:paused] ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

function splitInto<T>(items: T[], n: number): T[][] {
  const size = Math.ceil(items.length / n);
  return Array.from({ length: n }, (_, i) => items.slice(i * size, i * size + size));
}

export function KindWords() {
  const [row1, row2] = splitInto(testimonials, 2);

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-6xl px-6 text-center">
        <p className="font-mono text-xs tracking-[0.2em] text-foreground/50 uppercase">Kind words</p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          Trusted by <span className="text-foreground/50">Creators</span>
        </h2>
      </div>

      <div className="relative mx-auto mt-12 flex max-w-6xl flex-col gap-4">
        <Row items={row1} duration={38} direction="left" />
        <Row items={row2} duration={44} direction="right" />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent sm:w-40" />
      </div>
    </section>
  );
}
