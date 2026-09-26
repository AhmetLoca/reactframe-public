import { REAL_PAGES } from "@/lib/pages-data";

export function PageAccessBadge({ slug }: { slug: string }) {
  const free = REAL_PAGES.find((p) => p.slug === slug)?.free ?? true;
  return free ? (
    <span className="rounded-full border border-[#00A92A]/50 bg-black/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#00A92A] normal-case shadow-[0_0_10px_rgba(0,169,42,0.3)] backdrop-blur-sm [text-shadow:0_0_6px_rgba(0,169,42,0.65)]">
      Free
    </span>
  ) : (
    <span className="rounded-full bg-foreground px-2 py-0.5 text-[10px] font-semibold tracking-wide text-background normal-case">Premium</span>
  );
}
