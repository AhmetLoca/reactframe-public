export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string; // ISO date, e.g. "2026-08-18"
  readTime: string; // e.g. "4 min read"
  coverImage?: string; // put images in public/blog/
  // Markdown (GFM) — ## / ### headings, paragraphs, links, bold, and
  // tables all render. Rendered via BlogContent in [slug]/page.tsx.
  content: string;
}

// Add new posts here, newest first. Delete the example post once you have
// real ones — it exists only so the blog layout isn't empty by default.
export const posts: BlogPost[] = [
  {
    slug: "welcome-to-the-reactframe-blog",
    title: "Welcome to the ReactFrame blog",
    excerpt:
      "Notes on building components, shipping fast, and what's coming next for the library.",
    category: "Announcement",
    date: "2026-08-18",
    readTime: "2 min read",
    content: `This is where component breakdowns, build notes, and everything new in the ReactFrame library will show up going forward.

Expect short, practical posts: how a component was built, what changed in an update, and the occasional look at what's next. Nothing long-winded — just notes worth reading before your next build.

More soon.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const sameCategory = posts.filter((p) => p.slug !== post.slug && p.category === post.category);
  const rest = posts.filter((p) => p.slug !== post.slug && p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function formatPostDate(date: string): string {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
