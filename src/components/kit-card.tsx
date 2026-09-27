import Link from "next/link";
import type { CatalogKitEntry } from "@/lib/llms-content";

// A kit's cover: one large thumbnail on the left, two stacked on the right, taken from the kit's `cover`
// slugs. Static images only (like catalog cards), so a grid of kits stays cheap to render.
export function KitCard({ kit, cover }: { kit: CatalogKitEntry; cover: [string, string, string] }) {
  return (
    <Link
      href={`/kits/${kit.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
    >
      <div className="m-3 grid h-[168px] grid-cols-[3fr_2fr] grid-rows-2 gap-2">
        {cover.map((slug, i) => (
          <div key={slug} className={`overflow-hidden rounded-xl bg-background/60 ${i === 0 ? "row-span-2" : ""}`}>
            <img
              src={`/thumbnails/${slug}.webp`}
              alt=""
              loading="lazy"
              decoding="async"
              // Thumbnails leave generous margins around the component; zoom the small tiles in so the UI stays legible.
              className={`h-full w-full object-cover transition-transform duration-500 ease-signature ${i === 0 ? "scale-[1.08] group-hover:scale-[1.12]" : "scale-[1.4] group-hover:scale-[1.46]"}`}
            />
          </div>
        ))}
      </div>
      {/* Same footer as the component cards (name left, green free count right), plus the kit's tagline. */}
      <div className="flex flex-1 flex-col px-4 pt-1 pb-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="truncate font-mono text-sm font-semibold">{kit.name}</h3>
          <span className="shrink-0 text-sm font-semibold text-[#00A92A]">{kit.premiumCount === 0 ? "Free" : `${kit.freeCount} free`}</span>
        </div>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/60">{kit.tagline}</p>
      </div>
    </Link>
  );
}
