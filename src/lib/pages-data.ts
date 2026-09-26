// Single source of truth for the Pages catalog, shared between the client
// Pages listing (src/app/pages/pages-page.tsx) and the server-rendered
// llms.txt / llms-full.txt routes — mirrors how catalog-data.ts is the
// shared source for Components/Elements/Blocks.

export const PAGE_GROUPS: { title: string; items: string[] }[] = [
  { title: "Marketing", items: ["Landing Page", "Pricing", "Features", "About Us", "Contact", "Career Page 01", "Blog Page", "Blog Post", "Case Study Page", "Coming Soon / Waitlist", "Integrations", "Comparison Page", "Use Cases", "Partners", "Job Detail", "Book a Demo", "Contact Sales", "Webinar / Event Landing", "Customer Story Index", "Press Kit", "Services Page", "Portfolio Page", "Team Page"] },
  // Whole-site templates for the briefs people most often give an AI builder (see public/ai/design-guide.md).
  { title: "Local Business", items: ["Restaurant / Café", "Salon & Spa", "Clinic / Dental", "Gym / Fitness Studio", "Hotel / Booking", "Real Estate Listing", "Event / Conference"] },
  { title: "Personal", items: ["Personal Portfolio", "Photographer Portfolio", "Resume / CV", "Link in Bio", "Creator / Newsletter"] },
  { title: "Auth", items: ["Sign In", "Sign Up", "Forgot Password", "Reset Password", "Onboarding", "Verify Email", "Two-Factor Authentication", "SSO / Enterprise Login"] },
  { title: "App / Dashboard", items: ["Dashboard Overview", "Settings", "Profile", "Notifications", "Billing / Invoices", "404 / Error Page", "Empty State", "Team / Workspace Settings", "API Keys", "Getting Started Checklist", "Usage & Limits", "Webhooks", "Maintenance / Server Error", "Integrations (Connected Apps)", "Activity / Audit Log"] },
  // E-commerce is split into seven groups so the catalog can cover the whole shop:
  // the core storefront, product-page variants, the cart-to-checkout flow, the
  // customer account, industry storefronts, campaigns, and marketplace vendors.
  { title: "Commerce", items: ["Store Homepage", "Collection Page", "Category Hub", "New Arrivals", "Best Sellers", "Wishlist", "Compare Products", "Size Guide", "Store Locator", "Sold Out / Notify Me", "Size & Fit Quiz"] },
  { title: "Product Pages", items: ["Product Detail", "Product Detail, Gallery", "Product Configurator", "Bundle Product", "Digital Product", "Subscription Product", "Pre-order Product", "Single Product Landing", "Product Reviews", "Build Your Own Bundle"] },
  { title: "Cart & Checkout", items: ["Cart", "Empty Cart", "Checkout", "Checkout, Multi-step", "Guest Checkout", "Payment Failed", "Order Confirmation"] },
  { title: "Account & Orders", items: ["Order History", "Order Detail", "Order Tracking", "Returns & Refunds", "Subscription Management", "Saved Addresses", "Payment Methods", "Loyalty & Rewards", "Order Cancellation", "Order Invoice", "Store Credit Balance"] },
  { title: "Storefronts", items: ["Fashion Store", "Electronics Store", "Beauty & Skincare Store", "Furniture & Home Store", "Grocery & Food Delivery", "Jewelry Store", "Sports & Outdoors Store", "Kids & Toys Store", "Pet Supplies Store", "Art Print Shop", "Subscription Box Store"] },
  { title: "Campaigns", items: ["Sale / Promo Landing", "Black Friday Landing", "Flash Sale", "Product Drop Launch", "Gift Cards", "Lookbook", "Referral Program", "Affiliate Program", "Loyalty Program Landing"] },
  { title: "Marketplace", items: ["Vendor Storefront", "Vendor Directory", "Seller Onboarding", "Seller Dashboard", "Multi-vendor Cart"] },
  { title: "Content", items: ["Search Results", "FAQ Page", "Changelog", "Testimonials Wall", "Resource Library", "Blog Category / Archive", "Glossary", "Tutorials / Guides Index"] },
  { title: "Legal", items: ["Terms of Service", "Privacy Policy", "Cookie Policy", "Accessibility Statement", "Refund Policy", "Security / Trust Center"] },
  { title: "Docs / Knowledge Base", items: ["Documentation Page", "Doc Article", "API Reference", "Community / Forum"] },
  { title: "Status / Roadmap", items: ["Status Page", "Roadmap Page", "Incident History"] },
  { title: "Education", items: ["Course Landing Page", "Course Detail", "Lesson Player", "Certificate", "Instructor Profile", "Student Dashboard"] },
];

export type RealPage = { slug: string; name: string; description: string; category: string; free: boolean; thumbnail: string };

// The real, built pages — composed end to end from ReactFrame components.
// Everything else in PAGE_GROUPS above is still "Coming Soon" (no route,
// nothing to fetch), so it's deliberately kept out of this list and out of
// llms.txt/llms-full.txt.
export const REAL_PAGES: RealPage[] = [
  { slug: "about-us", name: "About Us", description: "An editorial about page with a serif headline, hero image, impact stats and a team grid.", category: "Marketing", free: false, thumbnail: "/demo/pages/about-us-thumb.webp" },
  { slug: "about-us-01", name: "About Us 01", description: "An about page with a founded-year mark, serif manifesto, full-bleed photo strip, timeline and overlapping team avatars.", category: "Marketing", free: false, thumbnail: "/demo/pages/about-us-01-thumb.webp" },
  { slug: "about-us-02", name: "About Us 02", description: "An about page with an uppercase serif hero, tilted overlapping polaroids, a big stat with a story, and a round-avatar team row.", category: "Marketing", free: false, thumbnail: "/demo/pages/about-us-02-thumb.webp" },
  { slug: "career-page-01", name: "Career Page 01", description: "A hiring page with a serif headline, four value cards and a list of open positions.", category: "Marketing", free: false, thumbnail: "/demo/pages/career-page-01-thumb.webp" },
  { slug: "career-page-02", name: "Career Page 02", description: "A careers page with a photo hero, a scrolling values marquee, a life-at-work photo gallery and department-filtered open positions.", category: "Marketing", free: false, thumbnail: "/demo/pages/career-page-02-thumb.webp" },
  { slug: "case-study-page", name: "Case Study Page", description: "A customer story with a serif headline, headline stats, a pull quote with author, challenge and solution columns, and a closing call to action.", category: "Marketing", free: false, thumbnail: "/demo/pages/case-study-page-thumb.webp" },
  { slug: "faq-page", name: "FAQ Page", description: "A FAQ page with a serif headline, category tabs and an accordion of questions and answers.", category: "Content", free: true, thumbnail: "/demo/pages/faq-page-thumb.webp" },
  { slug: "terms-of-service", name: "Terms of Service", description: "A terms of service page with a sticky section sidebar that follows your scroll and eleven numbered sections.", category: "Legal", free: true, thumbnail: "/demo/pages/terms-of-service-thumb.webp" },
  { slug: "roadmap-page", name: "Roadmap Page", description: "A public roadmap board with type filters and Planned, In Progress and Shipped columns.", category: "Status / Roadmap", free: true, thumbnail: "/demo/pages/roadmap-page-thumb.webp" },
  { slug: "documentation-page", name: "Documentation Page", description: "A docs hub with a serif headline, live search, six topic cards and a list of popular articles.", category: "Docs / Knowledge Base", free: true, thumbnail: "/demo/pages/documentation-page-thumb.webp" },
  { slug: "blog-page", name: "Blog Page", description: "A blog page with a serif headline, a featured post and a responsive grid of article cards.", category: "Marketing", free: true, thumbnail: "/demo/pages/blog-page-thumb.webp" },
  { slug: "pricing-page", name: "Pricing", description: "A pricing page with a serif headline, a monthly and yearly toggle, and three plan cards with a highlighted Pro tier.", category: "Marketing", free: false, thumbnail: "/demo/pages/pricing-page-thumb.webp" },
  { slug: "contact-page", name: "Contact", description: "A contact page with a serif headline, company details and a validated message form with a success state.", category: "Marketing", free: false, thumbnail: "/demo/pages/contact-page-thumb.webp" },
  { slug: "sign-in-page", name: "Sign In", description: "A split-screen sign-in page with a customer quote, social buttons, a password field with show and hide, and a loading state.", category: "Auth", free: false, thumbnail: "/demo/pages/sign-in-page-thumb.webp" },
  { slug: "privacy-policy", name: "Privacy Policy", description: "A privacy policy page with a sticky section sidebar that follows your scroll and eleven numbered sections.", category: "Legal", free: true, thumbnail: "/demo/pages/privacy-policy-thumb.webp" },
  { slug: "error-page", name: "404 / Error Page", description: "A 404 page with a large gradient number, a search field and quick links back to key pages.", category: "App / Dashboard", free: true, thumbnail: "/demo/pages/error-page-thumb.webp" },
];
