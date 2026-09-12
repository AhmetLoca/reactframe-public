# ReactFrame

Open-source, shadcn/ui-compatible component registry. React + TypeScript +
Tailwind CSS + Motion. Every component installs with:

```bash
npx shadcn@latest add https://reactframe.com/r/[slug].json
```

## Structure

```
registry.json                        # root registry manifest (shadcn schema)
registry/new-york/[slug]/[slug].tsx  # component source, one folder per item
src/registry-preview/index.tsx       # slug -> live preview element (docs site only)
src/lib/catalog-data.ts              # slug -> display metadata (name, description, category)
src/app/components/[slug]/page.tsx   # docs page: install command + live preview + code tab
public/r/[slug].json                 # generated — do not edit, do not commit
```

`npm run registry:build` (also runs automatically before `dev`/`build`) reads
`registry.json` + the files it points to and writes the consumable
`public/r/*.json` files via the `shadcn build` CLI.

## Adding a component (migrating from Frameze)

Each of the ~130 Framer components gets converted once, by hand, following
this checklist:

1. **Convert the source.** Start from the Framer `.tsx`, strip
   `addPropertyControls` / `useIsStaticRenderer` / Framer-only APIs, replace
   inline `style={{}}` with Tailwind classes, and rebuild interactive/canvas
   demo panels as plain props instead. Reference
   `registry/new-york/animated-stats/animated-stats.tsx` as the pattern:
   `"use client"`, named export, a typed `Props` interface, `cn()` from
   `@/lib/utils`, and the shared `paper` / `ink` / `border` / `ease-signature`
   tokens from `globals.css` instead of hardcoded colors.
2. **Save it** to `registry/new-york/[slug]/[slug].tsx`.
3. **Register it** — add an entry to `registry.json` (`name`, `type:
   "registry:component"`, `title`, `description`, `files`, plus
   `registryDependencies`/`dependencies` if it needs other registry items or
   npm packages).
4. **Preview it** — add `"[slug]": () => <Component />` to
   `src/registry-preview/index.tsx` with sensible example props.
5. **List it** — add an entry to `components` in `src/lib/catalog-data.ts`
   (drives the `/components` grid and the detail page's title/description).
6. Run `npm run registry:build` and `npm run dev`, check
   `/components/[slug]` renders and animates correctly in both themes.
7. Sanity-check the real install path: `npx shadcn@latest add
   http://localhost:3000/r/[slug].json` in a scratch Next.js project.

## Design system

`paper` / `ink` / `glass` — carried over from Frameze for brand consistency.
Light theme = paper (`#f5f4f1`) background, near-black ink (`#0a0a0a`) text.
Dark theme = near-black paper (`#0e0e0e`), near-white ink (`#f5f4f1`) text
(class `.dark`, via `next-themes`). `.glass` is the translucent blurred-panel
utility. `ease-signature` (`cubic-bezier(0.16,1,0.3,1)`) / `animate-rise` are
the shared motion tokens — use them instead of ad-hoc easing curves so every
component feels like part of one family. `--shadow-soft` is the ambient
"floating card" shadow (soft blur + hairline ring, tuned per theme) — apply
via `style={{ boxShadow: "var(--shadow-soft)" }}`. All defined in
`src/app/globals.css`.

Components that ship their own self-contained light/dark palette (product
cards, testimonial/marketing sections meant to drop into any page — see
`testimonial-slider.tsx` as the reference) should use these exact hex values
rather than inheriting the host project's shadcn tokens, so the component
keeps its ReactFrame look regardless of what theme the consumer's project has.
Small utility/primitive components (toggle, badge, rating) can instead use
semantic Tailwind classes (`bg-background`, `text-foreground`, `border`) so
they blend into the consumer's own theme — see `README` "Adding a component"
step 1 for which pattern applies.

Recurring visual patterns — reuse these, don't reinvent them per component:

- **Eyebrow / section label**: a `✦` glyph (not an icon font) + uppercase
  text at `11px`, `font-semibold`, `tracking-wider`, at ~38% ink opacity in
  light / ~36% in dark. The `✦` itself sits at higher opacity (near-solid).
- **Nav button pair**: secondary/prev = low-opacity ink fill (`~7-8%`) with a
  mid-opacity icon (`~50%`); primary/next = solid ink fill with a paper
  (inverted) icon. Both `whileHover={{ scale: 1.1 }}` / `whileTap={{ scale:
  0.91 }}` via `motion`.
- **Decorative giant quote mark**: a literal `"` character (not an SVG) at a
  very large font size, colored at ~4-4.5% ink opacity, positioned absolute
  and layered behind the real text.
- **Dividers**: 1px hairline at ink 7-8% opacity — never a visible gray line.
- **Counters / metadata text**: tabular-nums, ink at ~26-32% opacity.
- Keep it monochrome. Accent color, when a component needs one at all, comes
  from a single `accentColor`-style prop the consumer sets — don't invent
  multi-hue palettes (rainbow tone kits, neon gradients, mood themes) inside
  a component's own defaults. If in doubt, look at how spare the reference
  components are before adding another color.
