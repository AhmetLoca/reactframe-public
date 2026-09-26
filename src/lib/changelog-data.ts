export interface ChangelogEntry {
  date: string; // YYYY-MM-DD
  title: string;
  items: string[];
}

// Newest entry first. Add a new entry at the top whenever components ship or
// the site changes in a way users would notice — this is what powers the
// /changelog page and signals that the catalog is actively maintained.
export const changelog: ChangelogEntry[] = [
  {
    date: "2026-09-26",
    title: "ReactFrame is live on reactframe.com",
    items: [
      "The site now lives at reactframe.com, with a new homepage headline: Creative React Components. Build beautiful interfaces. Faster.",
      "Premium items whose checkout isn't open yet now show a Coming soon label with their price instead of a Buy button that led nowhere.",
    ],
  },
  {
    date: "2026-09-26",
    title: "Component pages now document every prop",
    items: [
      "Every component page has a new Installation section with the shadcn CLI command and the npm dependencies, and a Props table listing each prop's type and default value. Union types are spelled out (for example \"primary\" | \"secondary\" | \"outline\" | \"ghost\") so you can see what to pass without opening the source.",
      "25 of the most-used components (including Button, Select, Combobox, Date Picker, Modal, Data Table, AI Chat, and 3D Carousel) also get a short When to use guide and an FAQ.",
      "Related components now appear at the bottom of every page, followed by Previous and Next links that walk through Elements, Blocks, or Components in the same order as the catalog. The left and right arrow keys work too.",
    ],
  },
  {
    date: "2026-09-26",
    title: "Hover previews for 30 Elements",
    items: [
      "Hovering an Element card now plays a short clip of it in use: typing into Search Bar, filtering Combobox, flipping months in Date Picker, dragging Slider, uploading in File Upload, and more.",
      "Now covered: every Form & Input and every Feedback & Status element (including Tooltip, Skeleton, Callout, Meter, and Animated Loader), plus Tabs. Each clip loops seamlessly from the card's still thumbnail.",
    ],
  },
  {
    date: "2026-09-26",
    title: "New: AI Chat and AI Chat Panel",
    items: [
      "AI Chat is a floating chat widget: a particle-orb launcher in the corner of the page that morphs into a chat panel, with a teaser bubble, an auto-playing sample conversation, and a typing indicator. Connect onSend to your own model to make it a real assistant.",
      "AI Chat Panel is a self-contained AI messaging thread with a dotted-orb avatar, a soft rotating glow, and a pill-shaped composer. It is the first real block in Blocks › AI & Chat.",
      "Fixed: blocks in the Authentication, Data & Tables, AI & Chat, and Dashboard categories were showing up under Marketing instead of their own tab.",
    ],
  },
  {
    date: "2026-09-25",
    title: "Blocks roadmap: 44 new Soon blocks across every category",
    items: [
      "Marketing, Dashboard / Application, eCommerce, Authentication, Data & Tables, and AI & Chat now show named coming-soon blocks (previously empty tabs just showed one generic message).",
      "Highlights: Pricing Table Block, AI Chat Panel, Sign In Card, Multi-step Form Block, Workflow Builder Block, Inbox / Message List Block, Product Quick View Block, Bento Grid Block, and an in-app What's New widget and Referral widget.",
      "Category counts in the sidebar now match what each tab actually shows.",
    ],
  },
  {
    date: "2026-09-25",
    title: "Five new pages, and All is now the default in Elements, Blocks, and Pages",
    items: [
      "New pages: Pricing (monthly and yearly toggle), Contact (validated form), Sign In (split screen with show and hide password), Privacy Policy (sticky section menu), and 404 / Error Page (search and quick links). Privacy Policy and the 404 page are free; the other three are Pro.",
      "Elements, Blocks, and Pages now open on All, with All as the first category, the same as Components. Before, Blocks and Pages opened on the Free filter, and turning that filter off sent you straight back to it. That is fixed.",
      "The Pages category counts now match the section headings.",
      "Commerce pages are on the roadmap in seven groups: Commerce, Product Pages, Cart and Checkout, Account and Orders, Storefronts, Campaigns, and Marketplace. Pricing and Features were added under Marketing.",
    ],
  },
  {
    date: "2026-09-25",
    title: "ReactFrame is now built for AI agents",
    items: [
      "New MCP server on npm (reactframe-mcp): search the catalog, fetch a free component's full source, and get its AI rebuild prompt straight from your coding agent. Add it with: claude mcp add reactframe -- npx -y reactframe-mcp",
      "Richer /llms.txt plus a full /llms-full.txt with every free component's rebuild prompt, and a JSON catalog at /api/catalog. All generated from the same data as the site, so they never drift.",
      "New /ai.txt and /ai-sitemap.xml describe what AI systems may use: free (MIT) components are open, premium source is not licensed for AI training. robots.txt now blocks known AI training crawlers, while search bots and real-time agent access stay allowed.",
      "The License page has a new clause covering AI and machine-learning training of premium source.",
      "sitemap.xml now lists all 11 pages under /pages/preview.",
    ],
  },
  {
    date: "2026-09-25",
    title: "Pro pages are locked, Pages cards redesigned",
    items: [
      "Six pages are now Pro (About Us, About Us 01, About Us 02, Career Page 01, Career Page 02, Case Study). Their source never leaves the server: the Code tab shows a Buy button instead.",
      "Terms of Service, Roadmap, FAQ, Documentation, and Blog stay free.",
      "Page cards now match Components and Elements: the name on the left, Free or the price on the right, no corner badge.",
    ],
  },
  {
    date: "2026-09-25",
    title: "21 components are now free",
    items: [
      "Now free: AI Asistant, AI Voice 01, AI Voice 05, AI Image Loader 03, AI Dynamic Island 01, AI Answer 03, AI Edit Review, Business Hours, 3D Carousel, Tilted Carousel, Diagonal Carousel, Glide Carousel, Desktop Mockup Carousel, Review Card Portrait, Tilt Text, Text Scramble Pro, Liquid Text, Word Reveal, Dice Discount Popup, Scratch Card Popup, and Logo Marquee.",
      "Fixed 27 premium components that were showing their full source with no paywall. Every premium component is now locked behind its Buy button.",
    ],
  },
  {
    date: "2026-09-25",
    title: "3D Carousel: Pro, $4, new demo images",
    items: [
      "3D Carousel is a Pro component again, available as a one-time $4 purchase.",
      "The default slides now use five black-and-white portraits, and the preview, Code tab, and thumbnail all match.",
      "Demo mode defaults updated: curve 700, width 190, radius 18, overlay 35.",
    ],
  },
  {
    date: "2026-09-25",
    title: "Hover preview videos for Button, Input, Textarea, and 3D Carousel",
    items: [
      "Cards for these four now play a 3-second demo when you hover them: hover, press, and loading for Button; typing with a focus ring for Input and Textarea; next and back for 3D Carousel.",
      "Each clip is 15 to 90 KB and only loads when you hover the card.",
    ],
  },
  {
    date: "2026-09-25",
    title: "Catalog updates",
    items: [
      "Hero Slider Carousel moved to Blocks, under eCommerce.",
      "Removed Dropdown Menu Pro, Social Post Simulator, and Circular Links Menu.",
      "Aspect Ratio's demo now shows ratio labels (1:1, 16:9, 21:9, 9:16) instead of photos, with a new option to switch images back on in demo mode.",
      "Line Chart: the value badges at the end of each line no longer get cut off, and long labels now shorten with an ellipsis.",
      "Refreshed thumbnails for Bar Chart, Line Chart, Pie Chart, the social widgets, Scroll Zoom Mosaic Gallery (new canvas color and image), and 3D Carousel.",
      "About Founder Section's preview now grows to fit its content instead of scrolling inside a fixed box.",
    ],
  },
  {
    date: "2026-09-25",
    title: "New homepage and header",
    items: [
      "New tagline, UI for the AI era., with the tools shown as logos (React, TypeScript, Tailwind CSS, shadcn/ui). Hover a logo to see its name.",
      "The header button now reads Get All-Access.",
      "Featured components on the homepage use the same cards as the Components page, with the price or Free label on the right.",
      "Removed em dashes from site copy, component descriptions, and the Code tab variants.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Curved Nav Carousel rebuilt with themes",
    items: [
      "Rebuilt with four themes, Desk Dark (default), Desk Light, Original, and Custom colors, plus a card padding option and accessible names/descriptions.",
      "Video slides now use a frame from their first seconds as the thumbnail and poster (configurable with posterTime), and only the active slide's video plays.",
      "Keyboard support: arrow keys, Home and End move between slides; thumbnails are focusable and open with Enter or Space.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Coverflow Services Hero: text and color controls",
    items: [
      "Added per-text uppercase toggles (eyebrow, heading, description, buttons, slide titles) and color props for the buttons, slide number, and tag pill.",
      "Cursor parallax is now off by default, and slide images fill the whole card, they no longer leave a gap on one side.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Phone Analytics Mockup now includes Phone Stats Showcase",
    items: [
      "Merged Phone Stats Showcase into Phone Analytics Mockup: an avatar, username, and verified badge overlay now sits at the top of the screen, and the bottom username pill is gone.",
      "Added a light/dark theme for all floating analytics cards. Phone Stats Showcase has been removed.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Glass Navigation is now Navbar 02",
    items: [
      "Renamed to Navbar 02 and switched from a frosted-glass look to solid light and dark backgrounds. The glassBlur prop has been removed.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Dropdown Menu Pro moved to Elements",
    items: ["Dropdown Menu Pro now lives under Elements → Overlay instead of the Components list."],
  },
  {
    date: "2026-09-24",
    title: "Popup and widget fixes",
    items: [
      "Dice Roll Discount Popup: the launcher button is now a white circle pinned to the bottom-right of the page, with a gift icon that stays readable. Its card background is a flat #080808.",
      "Dice Roll Discount Popup and Spin to Win Wheel: turning Popup Mode on in the demo no longer leaves the popup open. Both also gained live Theme, Mode, and Popup Mode controls.",
      "Wheel Spin Discount Popup: card background is now a flat #080808.",
      "Memory Cards Widget: the header no longer overflows on narrow widths, it wraps to two rows on mobile and stays on one row on desktop and tablet.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Smaller polish",
    items: [
      "Service List Cursor Preview: the image that follows the cursor is now optional (showPreviewImage), and headings are smaller.",
      "Footer Columns: link hover shows only the underline, without a box around the link.",
      "Compare Slider preview now uses the same before/after photos as its thumbnail.",
      "Phone Mockup preview now plays three reel clips.",
      "Testimonial Slider preview is centered with space on both sides.",
      "Bubble Cursor, Review Card Portrait, and Glass Navigation previews now use the shared #080808 canvas.",
      "The homepage now shows Kind Words before All-Access.",
      "The docs Playground gained a text input control.",
    ],
  },
  {
    date: "2026-09-24",
    title: "Removed 13 components",
    items: [
      "Retired Bento Flip Grid, Card Stack, Cinematic Scroll Story, Circular Spinning Text, Circular Title Carousel, Code Scanner Stream, Decision Tree Diagram, Fluid Wave, Hero Centered, Hero Video Glass, Laptop Reel Showcase, Phone Reel Showcase, and Wave Marquee, they are no longer listed in the catalog or the registry.",
    ],
  },
  {
    date: "2026-09-24",
    title: "New thumbnails",
    items: ["Added preview thumbnails for about 35 more components, so most of the catalog now has a real thumbnail."],
  },
  {
    date: "2026-09-23",
    title: "New: AI Edit Review",
    items: [
      "Added AI Edit Review, an AI text editor that rewrites a selected passage, streams a word-level diff review with accept/reject actions, and morphs a dock through writing, review, and applied states.",
    ],
  },
  {
    date: "2026-09-23",
    title: "AI Chat Prompt: new Metal theme",
    items: [
      "Added a third theme, Metal, alongside Custom and Silver, brushed grain texture, a moving specular light sweep, a chrome edge ring, and embossed buttons.",
    ],
  },
  {
    date: "2026-09-23",
    title: "Removed AI Agent Wave",
    items: ["Retired this element, it's no longer listed in Elements or the registry."],
  },
  {
    date: "2026-09-23",
    title: "Dark/light mode toggle is back",
    items: [
      "Re-added the theme toggle button to the site nav. The site still defaults to dark, but visitors can now switch to light mode again.",
    ],
  },
  {
    date: "2026-09-23",
    title: "Social widgets moved into their own category",
    items: [
      "WhatsApp, Discord, Telegram, Messenger, Instagram, and X (Twitter) widgets now live under a dedicated \"Social Media Widget\" category on the Components page, and are no longer cross-listed under Elements.",
    ],
  },
  {
    date: "2026-09-23",
    title: "Animated Checkbox and Toggle Pro now default to orange",
    items: ["Both components' default accent color switched from violet/black to orange, matching their Playground demos."],
  },
  {
    date: "2026-09-23",
    title: "More consistent preview backgrounds across Elements and Components",
    items: ["Normalized preview canvas backgrounds to a single dark shade (#080808) across nearly every component and element preview, including several that previously had no explicit background at all."],
  },
  {
    date: "2026-09-18",
    title: "Scroll Swatch Showcase: dark/light theming, a second button, and a smarter image box",
    items: [
      "Added dark/light theme support (defaults to dark), the headline, description, and tag pills now automatically switch to a readable color for whichever theme is active.",
      "Added a second, outlined button alongside the existing one, for a primary/secondary CTA pair.",
      "The image no longer force-crops to a fixed ratio or leaves visible gaps on the sides, the image box now sizes itself to the photos' own proportions, so the headline, description, full photo, and its caption are all visible together without scrolling.",
      "Refreshed the demo photos and copy to a 4-room interior set.",
    ],
  },
  {
    date: "2026-09-18",
    title: "Hotspot Carousel: new 7-slide interior tour",
    items: [
      "Replaced the shoe/headphone/desk placeholder slides with a 7-room home tour (living room, kitchen, dining room, balcony, kids' room, home gym, bedroom), each with its own shoppable hotspots.",
      "Captions are now shown by default, positioned top-left over each photo.",
    ],
  },
  {
    date: "2026-09-18",
    title: "Fullpage Photos: fixed scroll leaking to the page behind it",
    items: [
      "Scrolling inside the component was also scrolling the page behind it, because the wheel listener couldn't block the browser's default scroll. Fixed by trapping wheel scroll so it stays contained to the canvas.",
      "Removed the Title Color control from the demo Playground, the underlying prop is unchanged and still usable, just no longer surfaced as a live control.",
    ],
  },
  {
    date: "2026-09-18",
    title: "Sticky Scroll Reveal: new content set",
    items: [
      "Replaced the generic gradient placeholder items with 5 real video/image items and matching headlines.",
      "Default background switched to black.",
    ],
  },
  {
    date: "2026-09-18",
    title: "Fluid Wave: cursor visibility toggle",
    items: ["Added a Cursor on/off control to the demo Playground, defaulting to on."],
  },
  {
    date: "2026-09-18",
    title: "Cards Gallery Ring: taller preview, more cards, and a full photo refresh",
    items: [
      "Increased the demo preview height and raised the default number of cards in the ring from 12 to 64.",
      "Replaced the architecture-project placeholder list with a full motion-photography set.",
    ],
  },
  {
    date: "2026-09-18",
    title: "Cards Hover Marquee, Wave Gallery Page, Social Reels Grid, Liquid Image Effect, Focus Frame: refreshed default media and copy",
    items: [
      "Swapped remote stock placeholders (images, a sample video, brand-logo thumbnails) for local photos and video across all 5 components, with titles, subtitles, and captions written to match what's actually shown.",
    ],
  },
  {
    date: "2026-09-16",
    title: "Removed the site's smooth-scroll library, it was causing scroll to freeze",
    items: [
      "Scrolling could intermittently stall partway down the homepage and catalog pages, caused by a conflict between the smooth-scroll library and components with their own internal scroll behavior.",
      "Removed it entirely, every page now uses plain, native browser scroll, which fixes the freeze and removes a whole class of bugs around it for good.",
    ],
  },
  {
    date: "2026-09-16",
    title: "Arc Mood Carousel: fixed image clipping on tilted cards, added a Tilt toggle",
    items: [
      "Fixed images bleeding past a card's rounded corners at a tilt, a rendering quirk from combining a rotate transform with overflow-hidden and border-radius on the same element.",
      "Added a tilt prop (and a Tilt toggle in the Preview) that keeps the arc's fanned layout but lets cards stay upright instead of rotating.",
      "Removed the mouse-parallax hover effect and switched to a plain edge-to-edge image fill, so images now sit flush in every card.",
      "Refreshed the default image set and gave each slide a title/subtitle that actually matches its photo.",
    ],
  },
  {
    date: "2026-09-16",
    title: "Mood Gallery: fixed images repeating in an obvious pattern",
    items: [
      "Each column's image order was a simple repeating cycle, so scrolling made the same handful of photos march past in a visibly repetitive sequence.",
      "Replaced it with a per-column shuffle, no image repeats near itself anymore, including at the seam where the scroll loop wraps back to the start.",
    ],
  },
  /* HIDDEN-UNTIL-LAUNCH (templates, dashboards): this entry only describes the two hidden pages
  {
    date: "2026-09-16",
    title: "New Industry and Dashboard categories: AI, Fintech, Cybersecurity, and more",
    items: [
      "Added Artificial Intelligence, Fintech, Cybersecurity, Health Tech, Agri Tech, and Sports Tech to the Templates page's Industry filter.",
      "Added Cybersecurity and Sports Tech as new categories on the Dashboards page.",
    ],
  },
  */
  {
    date: "2026-09-16",
    title: "Blocks: pricing added for 32 components",
    items: ["Every marketing-section block, footers, testimonial sections, feature showcases, hero sections, and more, now shows a price on its catalog card."],
  },
  {
    date: "2026-09-16",
    title: "Homepage: Featured components is now a 3×3 grid",
    items: ["Expanded from 6 to 9 featured components on the homepage."],
  },
  {
    date: "2026-09-12",
    title: "Free components are now MIT licensed",
    items: [
      "Every free component ships under the MIT License, use, modify, and redistribute it freely, including in your own open-source projects.",
      "Premium components are unaffected and remain under the existing one-time-purchase license.",
      "Published an open-source mirror containing every free component's source.",
    ],
  },
  {
    date: "2026-09-12",
    title: "Every component is now fully self-contained, no shared files, no leftover demo code",
    items: [
      "Inlined the small class-merging helper directly into all 251 components, copying a component into your own project no longer requires creating a separate utils file first.",
      "Replaced a handful of site-only theme colors and a custom hover effect (across 15 components) with plain, portable equivalents, they now look correct dropped into any project, not just this site.",
      "Finished removing the last of the internal demo-only scaffolding from every component's source, so what you copy is exactly what ships.",
    ],
  },
  {
    date: "2026-08-30",
    title: "App Store, eBay, Etsy & Facebook Reviews: rebuilt with theming, fractional ratings, and a demo panel",
    items: [
      "Rebuilt all 4 components with a richer feature set, light/dark/custom theming with per-color overrides, per-text font overrides, fractional star ratings, schema.org markup for SEO, and a responsive arrow offset with a light-theme shadow.",
      "Added a live demo control panel (theme, rating, review count, cards-per-view, arrows) in the Preview for each, matching the rest of the catalog's convention.",
      "All 4 now have complete code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, joining Google Reviews and Airbnb Reviews as the full social-proof carousel family.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Airbnb Reviews: rebuilt with theming, fractional ratings, and a demo panel",
    items: [
      "Rebuilt the component with a richer feature set, light/dark/custom theming with per-color overrides, per-text font overrides, fractional star ratings, schema.org markup for SEO, and a responsive arrow offset with a subtle shadow in light theme.",
      "Added a live demo control panel (theme, rating, review count, cards-per-view, arrows) in the Preview, matching the rest of the catalog's convention.",
      "Airbnb Reviews now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example.",
      "Also backported the light-theme arrow shadow to Google Reviews for consistency between the two sibling components.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Google Reviews: rebuilt with theming, fractional ratings, and a demo panel",
    items: [
      "Rebuilt the component with a richer feature set, light/dark/custom theming with per-color overrides, per-text font overrides, fractional star ratings, schema.org markup for SEO, and a responsive arrow offset.",
      "Added a live demo control panel (theme, rating, review count, cards-per-view, arrows) in the Preview, matching the rest of the catalog's convention.",
      "Google Reviews now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and an updated Usage example.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Tilt Text: rebuilt to match the latest Framer source",
    items: [
      "Rebuilt the component to match the current Framer source, dropped the shine highlight, layered shadow extrusion, and idle float/breathe animations that had drifted from it, keeping just the 3D tilt + scale-on-hover.",
      "Restored the live demo control panel (tilt strength) in the Preview, matching the Framer source, and removed the now-redundant separate Idle playground control.",
      "Tilt Text now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Particle Text: full Code tab treatment",
    items: [
      "Particle Text now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Hover Gallery: mobile layout fix, take two",
    items: [
      "The previous mobile fix shrank individual items and relied on horizontal scroll, but images could still end up clipped at the edges with no visible way to scroll.",
      "Replaced that with a single scale transform on the whole strip, below its resting width, the strip now scales down as a unit to fit the container exactly, with no cropping and no scrolling required.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Profile Flip Card: fixed hover not flipping the card",
    items: [
      "Hover was gated on the card's container width being over 480px, so it silently did nothing in the Preview's 340px-wide card, even with the demo panel's Hover switch set to On.",
      "Hover now checks actual input capability instead, so mouse users get hover-to-flip regardless of container width, while touch devices still use tap without getting stuck mid-hover.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Profile Flip Card: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (transition style, flip on hover, tag) in the Preview, matching the original Framer source.",
      "Profile Flip Card now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Hover Gallery: fixed mobile layout",
    items: [
      "Below ~560px wide, the coverflow strip now shrinks its items and scrolls horizontally instead of clipping most of the images off-screen.",
      "The demo control panel is more compact on narrow screens so it no longer overlaps the strip.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Hover Gallery: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (radius, gap, parallax) in the Preview, matching the original Framer source.",
      "Replaced the placeholder preview images with a real 12-photo set (equestrian, rowing, weightlifting, F1 pit crew, cycling, hiking, HYROX, sprinting, swimming, skiing, football) with titles, tags, and descriptions.",
      "Hover Gallery now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Text Scramble Pro: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (reveal mode, loop, text color) in the Preview, matching the original Framer source, and removed the now-redundant separate playground control.",
      "Text Scramble Pro now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Accordion Cards: full Code tab treatment",
    items: [
      "Accordion Cards now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Rating Stars: demo panel restored + full Code tab treatment",
    items: [
      "Restored the live demo control panel (size, glow, label style, bar, animation, wave, theme) in the Preview, matching the original Framer source.",
      "Rating Stars now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Shooting Stars: full Code tab treatment + preview fix",
    items: [
      "Shooting Stars now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
      "Fixed the live theme/meteor-style playground in the Preview tab forcing an internal scrollbar, the preview box now fits within the iframe's height cap.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Logo Spin: full Code tab treatment",
    items: [
      "Logo Spin now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching the rest of the catalog.",
      "Dropped the Marquee mode and switched the default to Orbit, Logo Spin is now Flat or Orbit only.",
    ],
  },
  {
    date: "2026-08-30",
    title: "Soft Background: full Code tab treatment + live demo panel",
    items: [
      "Soft Background now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching Animated Stats and Countdown Timer.",
      "Restored the live customization panel (preset, orb count, noise, vignette) in the Preview so visitors can see the full range of the component in action.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Countdown Timer: full Code tab treatment",
    items: [
      "Countdown Timer now has all 4 code variants (TypeScript/JavaScript × Tailwind/CSS) and a Usage example, matching Animated Stats.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Usage examples on the Code tab",
    items: [
      "Added a Usage card between Install and Code showing a minimal, realistic call site for a component, separate from its full source. Starting with Animated Stats.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Language and style switcher on the Code tab",
    items: [
      "The Code tab now supports switching between TypeScript/JavaScript and Tailwind/CSS variants for components that have them, starting with Animated Stats.",
      "All remaining Turkish copy across the site (paywall, install command, premium page) has been translated to English.",
    ],
  },
  {
    date: "2026-08-29",
    title: "Rebrand: Loca UI is now ReactFrame",
    items: ["New name, new logo, new domain (reactframe.com), same library, same catalog, nothing else changes."],
  },
  {
    date: "2026-08-19",
    title: "All-Access pricing section",
    items: [
      "Added an All-Access pricing panel above the Kind Words section, flanked by scrolling columns of real component thumbnails, links through to the Premium page.",
    ],
  },
  {
    date: "2026-08-19",
    title: "Kind Words testimonial wall",
    items: [
      "Added a horizontally scrolling testimonial section right above the footer, with edge fade masks and two rows animating in opposite directions.",
    ],
  },
  {
    date: "2026-08-19",
    title: "Cookie consent, footer overhaul, and legal pages",
    items: [
      "Added a cookie consent card and Privacy Policy, Terms, Refund Policy, Accessibility, and Cookie Policy pages.",
      "Rebuilt the site footer with a 4-column layout, Products, Resources, and Legal links alongside the logo and GitHub link.",
    ],
  },
  {
    date: "2026-08-18",
    title: "Blog and Support pages",
    items: [
      "Added a Blog with markdown-rendered posts, and a Support page with a contact form (component picker, category, and direct email) backed by a Resend-powered API route.",
    ],
  },
  {
    date: "2026-08-18",
    title: "Search, price filter, and 78 new components",
    items: [
      "Migrated 78 additional components into the catalog, games (Snake, Tower Blocks, Maze Runner, Space Invaders, and more), WebGL/Three.js effects (Globe Studio, bubble cursor, cursor reveal), platform review carousels, and dozens of sections and layouts.",
      "Added a search box and a Free/Premium price filter to the components page, alongside the existing category filters.",
      "Category tabs now scroll the page back to the top when switched.",
    ],
  },
];
