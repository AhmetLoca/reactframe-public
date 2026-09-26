# ReactFrame Design Guide for AI Builders

> Read this before you build a site or page from ReactFrame components. It is the shared rulebook that makes a page assembled from many components look like one designer made it: one palette, one type scale, one spacing rhythm, one image style.

**Priority when rules conflict:** the user's brief → this guide → a component's own defaults. Component defaults exist so a component looks good on its own; on a real page they must be overridden to match the page.

**Catalog and prices:** https://reactframe.com/llms.txt · JSON: https://reactframe.com/api/catalog · Quote: https://reactframe.com/api/quote?slugs=a,b,c

---

## 1. Principles

1. **One accent color per site.** Everything else is neutral: background, surface, text, muted text, border. The accent marks what matters: primary CTAs, active states, key numbers, one highlighted word in a headline.
2. **Generous, consistent space.** Sections breathe. Use the spacing scale in §4 and nothing in between.
3. **Few type sizes, used consistently.** One display size, one section-heading size, one body size. Hierarchy comes from size, weight and color, never from five different fonts.
4. **Motion is seasoning.** One memorable animated moment per screen (usually the hero), quiet everywhere else. Respect `prefers-reduced-motion`.
5. **Real content, not filler.** Write copy for the user's actual business. No lorem ipsum, no "Feature 1 / Feature 2".
6. **Mobile is not an afterthought.** Every section must work at 375 px wide with 16 px side gutters and no horizontal scroll.

---

## 2. Setup

ReactFrame components are React + TypeScript + Tailwind CSS v4 + Motion (`motion/react`). Install free components with the shadcn CLI:

```bash
npx shadcn@latest add https://reactframe.com/r/<slug>.json
```

Put the design tokens below in your global CSS (for example `app/globals.css`) once, before building any section.

```css
@import "tailwindcss";

:root {
  /* Surfaces */
  --background: #f5f4f1;   /* page */
  --surface: #ffffff;      /* cards, panels */
  --surface-2: #ebe9e6;    /* subtle fills, inputs, hover */
  /* Text */
  --foreground: #0a0a0a;
  --muted: rgb(10 10 10 / 60%);
  --faint: rgb(10 10 10 / 40%);
  /* Lines */
  --border: rgb(10 10 10 / 10%);
  /* Brand */
  --accent: #f2a841;
  --accent-foreground: #0a0a0a;  /* text on an accent fill */
  /* Shape and motion */
  --radius: 16px;
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
}

.dark {
  --background: #0e0e0e;
  --surface: #141414;
  --surface-2: #1a1a1a;
  --foreground: #f5f4f1;
  --muted: rgb(245 244 241 / 60%);
  --faint: rgb(245 244 241 / 40%);
  --border: rgb(255 255 255 / 10%);
  --accent: #f2a841;
  --accent-foreground: #0a0a0a;
}

@theme inline {
  --color-background: var(--background);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-faint: var(--faint);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --ease-signature: var(--ease);
}

body {
  background: var(--background);
  color: var(--foreground);
}
```

Then use `bg-background`, `bg-surface`, `text-muted`, `border-border`, `bg-accent`, `text-accent-foreground` and so on in your own markup.

---

## 3. Color

### 3.1 Palettes

Pick **one** palette from the brief. If the brief gives a brand color, use it as `--accent` and keep the neutrals of the closest palette. Values are `light / dark`.

| Palette | Best for | background | surface | foreground | accent | accent-foreground |
|---|---|---|---|---|---|---|
| **Ink & Amber** (default) | SaaS, studios, general | `#f5f4f1` / `#0e0e0e` | `#ffffff` / `#141414` | `#0a0a0a` / `#f5f4f1` | `#f2a841` | `#0a0a0a` |
| **Midnight** | Tech, AI, developer tools, fintech | `#f4f6fb` / `#0b0e14` | `#ffffff` / `#121722` | `#0b1020` / `#eef2ff` | `#6d8bff` | `#ffffff` |
| **Forest** | Wellness, food, outdoor, sustainability | `#f3f4ef` / `#0f120e` | `#ffffff` / `#161a14` | `#141a12` / `#eef1e8` | `#4f8a4b` | `#ffffff` |
| **Terracotta** | Cafés, restaurants, hospitality, craft | `#f7f2ec` / `#14100d` | `#fffaf5` / `#1c1612` | `#1f1510` / `#f6ede4` | `#c44b2b` | `#ffffff` |
| **Rose** | Beauty, fashion, lifestyle | `#faf5f5` / `#130e10` | `#ffffff` / `#1b1417` | `#1c1216` / `#f8eef1` | `#d9577f` | `#ffffff` |
| **Mono** | Portfolios, architecture, luxury | `#ffffff` / `#000000` | `#f6f6f6` / `#0d0d0d` | `#000000` / `#ffffff` | `#000000` / `#ffffff` | `#ffffff` / `#000000` |

### 3.2 Rules

- **60 / 30 / 10:** about 60% background, 30% surfaces and text, 10% accent. If more than one element per screen shouts in the accent, demote some to `foreground`.
- **Contrast:** body text at least 4.5:1 against its background, large headings at least 3:1. `--muted` text is for secondary copy only, never for anything the user must read to act.
- **Light or dark:** choose from the brief. Default to dark for tech, AI, gaming, nightlife and developer products, light for food, wellness, education, retail and local services. Keep the whole page in one mode; don't alternate light and dark sections unless the brief asks for it.
- **Gradients:** only on the accent (for example `from-accent to-[a slightly warmer or cooler shade]`), only on one or two elements (a highlighted headline word, the primary CTA).
- **Never** use a component's default accent if it differs from the site's accent. See §6.

---

## 4. Spacing and layout

### 4.1 Scale

Use Tailwind's 4 px scale, restricted to these steps: `1 2 3 4 5 6 8 10 12 16 20 24 28 32` (4 px to 128 px). Nothing else.

| Use | Mobile | Desktop |
|---|---|---|
| Section vertical padding | `py-16` (64 px) | `md:py-24` (96 px); hero `md:py-32` |
| Container | `mx-auto max-w-6xl px-4 sm:px-6` | same (1152 px max) |
| Narrow text container | `max-w-2xl` | same |
| Card padding | `p-5` | `md:p-6` or `md:p-8` |
| Grid gap, cards | `gap-4` | `md:gap-6` |
| Grid gap, large media | `gap-3` | `md:gap-4` |

### 4.2 Vertical rhythm inside a section header

```
eyebrow        text-xs uppercase tracking-[0.2em] text-muted
  ↓ mt-3
heading        28–32 px (2× the description, §5)
  ↓ mt-4
description    text-sm md:text-base text-muted max-w-2xl (14–16 px)
  ↓ mt-8
actions        CTA buttons, gap-3
  ↓ mt-12 (md:mt-16)
content        the component(s)
```

```tsx
<section className="py-16 md:py-24">
  <div className="mx-auto max-w-6xl px-4 sm:px-6">
    <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">Testimonials</p>
    <h2 className="mt-3 max-w-2xl text-[28px] leading-[1.15] font-semibold tracking-tight text-balance md:text-[32px]">Loved by 2,000 teams</h2>
    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">Short supporting sentence that says why this section matters.</p>
    <div className="mt-12 md:mt-16">{/* ReactFrame component */}</div>
  </div>
</section>
```

### 4.3 Layout rules

- **Alignment:** left-align section headers on content-heavy pages; center them on landing pages. Pick one and keep it for the whole page. The hero may differ.
- **Full-bleed components** (marquees, galleries, backgrounds, video heroes) sit outside the container; everything else sits inside it.
- **Adjacent sections** with the same background need the full section padding between them. Never stack two components with no space between them.
- **Grids:** 1 column on mobile, 2 at `sm`/`md`, 3 (or 4 for small items) at `lg`. Never more than 4.
- **Heights:** components that need a height (carousels, galleries, canvas backgrounds) get an explicit one: `h-[420px] md:h-[560px]` for media sections, `min-h-[80vh]` or `min-h-screen` for heroes.

---

## 5. Typography

### 5.1 Fonts

Use **one** family for everything (two at most: a display face for headings plus one for text). Load with `next/font` and apply on `<body>`.

| Pairing | Mood | Heading | Body |
|---|---|---|---|
| **Geist** (default) | Clean, modern, technical | Geist 600 | Geist 400 |
| **Inter** | Neutral, product, dashboards | Inter 600 | Inter 400 |
| **Manrope** | Friendly, rounded, startups | Manrope 700 | Manrope 400 |
| **Instrument Serif + Inter** | Editorial, hospitality, luxury | Instrument Serif 400 | Inter 400 |
| **Space Grotesk + Inter** | Bold, creative, agencies | Space Grotesk 600 | Inter 400 |

Monospace (code, numbers in tables, eyebrows if the brand is technical): Geist Mono or JetBrains Mono.

### 5.2 Scale

**The core rule:** descriptions and body text are **14–16 px**; headings are **twice that, 28–32 px**. Keep this 2× ratio between a heading and the description under it everywhere on the page.

| Role | Size | Classes | Notes |
|---|---|---|---|
| Heading (hero h1, section h2) | 28 → 32 px | `text-[28px] md:text-[32px] font-semibold tracking-tight leading-[1.15]` | `text-balance`, `max-w-2xl`. One `h1` per page. |
| Description / lead | 14 → 16 px | `text-sm md:text-base text-muted leading-relaxed` | Directly under a heading, `max-w-2xl`. |
| Body | 14 → 16 px | `text-sm md:text-base leading-relaxed` | Max 65–75 characters per line (`max-w-prose`). |
| Card or feature title (h3) | 18 → 20 px | `text-lg md:text-xl font-semibold tracking-tight` | Sits over a 14 px card description. |
| Card description | 14 px | `text-sm text-muted leading-relaxed` | |
| Small / meta | 12–13 px | `text-xs text-muted` or `text-[13px] text-muted` | Dates, captions, legal. |
| Eyebrow | 12 px | `text-xs font-medium uppercase tracking-[0.2em] text-muted` | Above headings. |
| Button | 14 px | `text-sm font-medium` | |

- Don't go below 14 px for anything the user has to read to understand the page, or above 32 px for headings.
- Headings: tight tracking, `font-semibold` (600). Never `font-bold` and `font-semibold` on the same level.
- One highlighted word per headline at most, in the accent or accent gradient.
- Numbers in stats and prices: `tabular-nums`.

### 5.3 Headings and SEO

Every page you build **must** have exactly one `<h1>`, and every template in §7 starts with one.

- **Where:** the hero's main heading is the `<h1>`. It must be real HTML text, never text inside an image, a canvas or an SVG.
- **What:** the page's primary keyword plus what makes it specific (the business name, the city, the audience). Write it for a person first; it should still read naturally. Keep it under about 60 characters.
- **Size:** same as other headings (28–32 px, §5.2). Its SEO weight comes from being the `<h1>`, not from being bigger.
- **Outline:** `h1` → one `h2` per section → `h3` for cards and features inside a section. Never skip a level (no `h3` directly under the `h1`), and never pick a heading level for its size; style it with classes instead.
- **Distinct from `<title>`:** related but not identical. The `<title>` adds the brand (`Specialty Coffee in Kadıköy | Moda Roasters`); the `<h1>` reads like a headline (`Specialty coffee, roasted every morning in Kadıköy`).
- **Components that render their own `<h1>`:** `about-founder-section`, `cards-gallery-ring`, `error-404-page-section`, `fullpage-photos`, `hero-scroll-gallery`, `marquee-hero-section`, `product-detail`, `rotary-card-carousel`, `your-cart-page`. Use them only as the page's hero (and then don't add another `<h1>`), or pick a different component for lower sections. `coverflow-services-hero` takes a `headingLevel` prop; set it to `"h1"` when it's the hero and `"h2"` otherwise.
- **Check before handing over:** `document.querySelectorAll("h1").length === 1`.

---

## 6. Wiring ReactFrame components to the page

ReactFrame components are self-contained, so they carry their own look through props. Most of them expose the same few styling props; set them on **every** component you place.

| Prop (where it exists) | Set it to |
|---|---|
| `theme` | `"dark"` or `"light"`, matching the page mode. Some components use other names (`"paper"`, `"glass"`); pick the one that matches the page's light or dark mode. |
| `accentColor` | The site's `--accent` hex. Components default to different accents (`#F2A841`, `#ffffff`, `#c44b2b`, ...), so leaving it out breaks the palette. |
| `backgroundColor` / `background` | The section's surface: page background or `--surface`. Many default to pure black `#000000`, which clashes with a `#0e0e0e` page. Use `"transparent"` when the component sits on the section background. |
| `textColor`, `mutedColor`, `borderColor` | `--foreground`, `--muted`, `--border` (hex/rgba values, not CSS variables, unless the prop's docs say variables work). |
| `fontFamily` / `font` | `"inherit"` (or the site's font stack), so the component uses the page font instead of its default Inter/Manrope. |
| `fontSize`, `titleSize`, `quoteFontSize`, `descriptionSize` and similar | Descriptions, quotes and body 14–16, titles and headings 28–32 (card titles 18–20), per §5.2. Component defaults often differ. |
| `radius`, `borderRadius`, `cardRadius` | From the radius scale: small controls 8–10, cards 16–20, large media 24. Keep one value for all cards on the page. |
| `autoPlay`, `speed`, `loop` | Keep autoplay only on the one or two components that are the point of their section. Slow marquees down (`speed` lower) when several are visible. |

Before wiring a component, read its props: the table on `https://reactframe.com/components/<slug>` or the source in `https://reactframe.com/r/<slug>.json`. Replace every piece of placeholder content (names, quotes, images, prices, links) with the user's content or clearly marked realistic stand-ins.

**Structured data:** components marked "SEO-ready" emit schema.org data for the user's own content. For review components, pass `reviewSubject` (the business or product being reviewed).

---

## 7. Page recipes

### 7.0 Start from a kit

ReactFrame groups components that share one design language into **kits** (full list with components per page slot: https://reactframe.com/llms.txt#kits, or `kits` in https://reactframe.com/api/catalog). When a brief fits a kit, take most of the page from it and follow the kit's consistency note; mixing in components from outside the kit is fine as long as you apply §3–§6 to them.

| Kit | Use it for |
|---|---|
| **Paper & Glass** | A whole marketing site (navbar to footer) in one theme system: agencies, SaaS, portfolios. |
| **Social Proof** | Platform review carousels and testimonials, with review structured data. |
| **AI Product** | Prompt, answer, voice and chat interfaces for AI products. |
| **Dashboard** | Admin and analytics screens; all free. |
| **Showcase** | Device and social post mockups for launches and case studies. |
| **Growth** | Announcement bar, countdown and discount popups for sales and lead capture. |
| **UI Elements** | Form controls and primitives for any page; all free. |

The recipes below mix kits by page type.

Section order for common briefs. **Free** components can be installed right away; **Premium** ones get a placeholder and go into the quote (see §11). Offer the premium option when it clearly fits the brief better, not by default.

### 7.1 SaaS / product landing page

**H1 formula:** `[What the product does] for [audience]`, e.g. *"Invoicing that runs itself for freelance designers"*.

| Section | Free | Premium upgrade |
|---|---|---|
| Header | `header-simple`, `glass-navigation` | `navbar-menu` ($6) |
| Hero | Your own hero markup over `cosmic-background` or `noise-background` | `marquee-hero-section` ($6), `scroll-zoom-media-reveal` ($6), `soft-background` ($5) behind your markup |
| Logos | `logo-marquee` | `orbit-logo-wheel` ($6) |
| Features | A grid of `card` elements | `feature-grid-mosaic` ($6), `feature-showcase` ($6), `process-spotlight` ($6), `sticky-scroll-reveal` ($6) |
| Product visuals | `browser-mockup`, `phone-mockup`, `desktop-mockup-carousel` | `sticky-phone-scroll` ($6) |
| Metrics | `stat-feature` | `animated-stats` ($5) |
| Testimonials | `testimonial-spotlight`, `testimonial-pills`, `review-card-portrait` | `testimonial-wall` ($6), `testimonial-bento` ($6) |
| Pricing | Your own pricing cards built from `card` | `comparison-table` ($8), `side-marquee-pricing-cta` ($6) |
| FAQ | `accordion` | |
| Footer | `footer-section`, `footer-premium` | `footer-wordmark` ($6), `footer-cta` ($6) |

### 7.2 Local business (café, restaurant, salon, studio)

**H1 formula:** `[Business type or signature offer] in [neighbourhood / city]`, e.g. *"Specialty coffee, roasted every morning in Kadıköy"*. Local searches include the place, so the H1 should too.

| Section | Free | Premium upgrade |
|---|---|---|
| Header | `header-simple` | |
| Hero | Full-bleed photo hero (your markup, §8) | `hero-scroll-gallery` ($6) |
| Menu / services | `accordion` or `card` grid | `accordion-services-list` ($6), `service-list-cursor-preview` ($6) |
| Gallery | `gallery-flow`, `motion-gallery-grid`, `cinematic-stacked-gallery` | `mood-gallery` ($6), `premium-bento-grid` ($8) |
| Reviews | `airbnb-reviews`, `etsy-reviews`, `ebay-reviews` (pick the platform the business actually uses) | `google-reviews` ($6), `facebook-reviews` ($6) |
| Opening hours | `business-hours` | |
| Location / contact | Map embed + `qr-code-widget` | |
| Footer | `footer-section` | |

### 7.3 Portfolio (designer, photographer, developer)

**H1 formula:** `[Name], [role] [in city / for niche]`, e.g. *"Elif Kaya, product designer for fintech teams"*.

| Section | Free | Premium upgrade |
|---|---|---|
| Header | `glass-navigation` | |
| Hero | Big name + role in the display size, `word-reveal` or `text-scramble-pro` for the headline | `kinetic-typography-showcase` ($5) |
| Work | `expand-card-grid`, `cylinder-gallery`, `motion-gallery-grid` | `project-index-list` ($6), `gallery-reveal` ($6), `cards-gallery-ring` ($8) |
| About | `profile-flip-card` | `about-founder-section` ($5) |
| Testimonials | `review-card-portrait` | `review-showcase` ($6) |
| Footer | `footer-premium` | `footer-wordmark` ($6) |

### 7.4 Agency / services

**H1 formula:** `[Service] [agency / studio] for [industry or city]`, e.g. *"Brand and web design studio for hospitality"*.

| Section | Free | Premium upgrade |
|---|---|---|
| Hero | Your markup over `noise-background` | `coverflow-services-hero` ($6), `dot-field-grid` ($6) behind your markup |
| Services | `accordion` | `accordion-services-list` ($6), `process-steps-rail` ($6) |
| Case studies | `card` grid | `case-study-section` ($6), `feature-showcase-split` ($6) |
| Team | `profile-flip-card` | `team-list` ($6), `meet-the-team` ($6), `team-carousel` ($6) |
| Clients | `logo-marquee` | `logo-spin` ($6) |
| Testimonials | `testimonial-spotlight` | `testimonial-bento` ($6) |
| Footer | `footer-premium` | `footer-mega` ($6) |

### 7.5 E-commerce

**H1 formula:** home page `[What you sell] [differentiator]`, e.g. *"Handmade ceramic tableware, shipped across Europe"*; category page: the category name (`Linen shirts`); product page: the product name (`product-detail` renders it as the `<h1>` for you).

| Section | Free | Premium upgrade |
|---|---|---|
| Promo bar | | `announcement-banner` ($5) |
| Hero | Your markup | `hero-slider-carousel` ($8) |
| Products | `product-grid-section`, `product-list` | `hotspot-carousel` ($8) |
| Product page | `product-detail` | |
| Cart / checkout | `your-cart-page` | |
| Reviews | `etsy-reviews`, `ebay-reviews` | `app-store-reviews` ($6) |
| Footer | `footer-section` | `footer-columns` ($6) |

### 7.6 Complete pages

**H1:** each ready-made page already has one heading slot for its `<h1>`; fill it with the page's topic (`Frequently asked questions about Moda Roasters`, `Pricing`, `Contact us`).


Some briefs match a ready-made page: `faq-page`, `blog-page`, `roadmap-page`, `documentation-page`, `privacy-policy`, `terms-of-service`, `error-page` are free. `about-us`, `pricing-page`, `contact-page`, `sign-in-page`, `career-page-01`, `case-study-page` are Pro ($8). See https://reactframe.com/pages.

---

## 8. Images

### 8.1 Sources, in order of preference
1. **The user's own images.** Ask for them or leave clearly named placeholders (`/images/hero.jpg`) and list them in your summary.
2. **Unsplash** for realistic stand-ins. Use images from one photographer or one color mood across the page. Always pass size and format parameters:
   `https://images.unsplash.com/photo-<id>?w=1600&q=80&auto=format&fit=crop`
   Tell the user these are placeholders to replace before launch.
3. **Brand logos:** Simple Icons (`https://cdn.simpleicons.org/<brand>/<hex-without-#>`) for known brands, set to one neutral color so logo rows look uniform.
4. **Avatars:** real people's photos only with permission; otherwise initials (most ReactFrame components fall back to initials when no image is given).

### 8.2 Sizes and ratios
| Slot | Ratio | Width to request |
|---|---|---|
| Full-bleed hero | 16:9 (mobile 4:5) | 2000 |
| Section media, feature image | 4:3 or 3:2 | 1400 |
| Card thumbnail | 4:3 or 1:1 | 800 |
| Gallery tile | mix of 3:4, 1:1 and 4:3 | 1000 |
| Avatar | 1:1 | 160 |
| Blog cover | 16:9 | 1400 |
| Open Graph image | 1200×630 | 1200 |

### 8.3 Rules
- Every image has meaningful `alt` text (empty `alt=""` only for decoration).
- Give images explicit `width`/`height` or an aspect-ratio box so the layout doesn't jump. Use `next/image` in Next.js projects.
- Above the fold: `priority` (Next) / `fetchpriority="high"`. Below: `loading="lazy"`.
- No text baked into images. Put text in HTML over the image with a gradient scrim (`bg-gradient-to-t from-black/60`) for contrast.
- Videos: always a `poster`, muted, `playsInline`, and no autoplay on mobile data-heavy sections unless it's the hero.

---

## 9. Motion

- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` for entrances and layout changes.
- **Durations:** hover and press 150–250 ms; entrances 500–900 ms; stagger 60–100 ms between items.
- **Budget:** one hero-level animation (a WebGL background, a 3D carousel, kinetic type) per viewport. Don't put two canvas/WebGL components on screen at once.
- **Autoplay:** at most two auto-moving components per page (for example a logo marquee and a testimonial wall).
- **Reduced motion:** wrap custom animations in `motion-safe:` / check `useReducedMotion()`; ReactFrame components already respect it.

---

## 10. Copy

- **Headlines:** 3–8 words, concrete and benefit-first ("Coffee roasted every morning" beats "Welcome to our website").
- **Leads:** one or two sentences, what it is and for whom.
- **CTAs:** a verb plus an outcome ("Book a table", "Start free trial"). One primary CTA per section; the secondary one is an outline or text link.
- **Numbers and names:** realistic and marked as placeholders when invented (`2,000+ customers` → tell the user to confirm).
- **Language:** write in the user's language. Keep one tone for the whole site.

---

## 11. Accessibility, SEO, performance

- One `<h1>` per page (§5.3), headings in order, landmarks (`header`, `nav`, `main`, `footer`).
- Visible focus states; everything reachable by keyboard.
- `<title>` under 60 characters and a meta description under 155, both specific to the page.
- Lazy-load heavy components below the fold (`next/dynamic` with `ssr: false` for canvas/WebGL ones).
- Keep the page's total JS reasonable: prefer one heavy visual component over several.

---

## 12. Premium components and the quote

- Never recreate, imitate or reverse-engineer a premium component from its preview.
- Where a premium component belongs, leave a placeholder:
  ```tsx
  {/* ReactFrame premium: google-reviews ($6), https://reactframe.com/components/google-reviews */}
  ```
  Keep the surrounding section (heading, spacing) in place so the page still reads correctly.
- Price every premium pick with one request: `https://reactframe.com/api/quote?slugs=<slug>,<slug>` (or the MCP `get_quote` tool). Recommend All-Access when the quote says so.

---

## 13. Before you hand over: checklist

- [ ] One palette, one accent; every component's `theme` and `accentColor` set.
- [ ] Component backgrounds match their section (no stray `#000000` boxes on a `#0e0e0e` page).
- [ ] Section padding and container width identical across sections.
- [ ] One font family (two at most); descriptions 14–16 px, headings 28–32 px (2×), sizes only from §5.2.
- [ ] No placeholder content left from component defaults.
- [ ] Images sized, with alt text, from one visual mood; placeholders listed for the user.
- [ ] Exactly one `<h1>` (keyword + what makes it specific), then `h2` per section and `h3` inside; no skipped levels.
- [ ] Works at 375 px wide, no horizontal scroll; tap targets at least 44 px.
- [ ] At most one heavy animated component per viewport; reduced motion respected.
- [ ] Premium placeholders in place and a quote in the summary.
- [ ] Summary for the user: free components installed, premium ones used with prices and total, images and copy to replace.
