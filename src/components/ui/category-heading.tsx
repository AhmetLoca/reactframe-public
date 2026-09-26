export function slugifyLabel(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Section heading used above a group of catalog cards — "Category [count]", matching
 *  the site's existing small muted heading style. Give it an `id` to make it a scroll
 *  target for a sidebar "jump to section" link. */
export function CategoryHeading({ id, title, count }: { id?: string; title: string; count: number }) {
  return (
    <h2 id={id} className="scroll-mt-24 text-sm font-semibold tracking-wide text-foreground/80">
      {title} [{count}]
    </h2>
  );
}
