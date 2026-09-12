import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BlogContent } from "@/components/blog-content";
import { posts, getPostBySlug, getRelatedPosts, formatPostDate } from "@/lib/blog-data";

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${post.slug}`,
      type: "article",
      publishedTime: post.date,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `https://reactframe.com/blog/${post.slug}`,
    author: { "@type": "Organization", name: "ReactFrame" },
    ...(post.coverImage ? { image: [`https://reactframe.com${post.coverImage}`] } : {}),
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Link href="/blog" className="text-sm text-foreground/50 underline decoration-foreground/20 underline-offset-4 hover:text-foreground hover:decoration-foreground">
        ← All posts
      </Link>

      <p className="mt-6 font-mono text-xs tracking-[0.15em] text-foreground/40 uppercase">
        {post.category} · {formatPostDate(post.date)} · {post.readTime}
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{post.title}</h1>

      {post.coverImage && (
        <div className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
          <Image src={post.coverImage} alt={post.title} fill sizes="(min-width: 768px) 768px, 100vw" priority className="object-cover" />
        </div>
      )}

      <BlogContent content={post.content} />

      {related.length > 0 && (
        <div className="mt-20">
          <p className="font-mono text-xs tracking-[0.15em] text-foreground/40 uppercase">More posts</p>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/blog/${r.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-foreground/[0.03] text-xs text-foreground/30">
                  {r.coverImage ? (
                    <Image src={r.coverImage} alt={r.title} fill loading="lazy" sizes="(min-width: 640px) 33vw, 100vw" className="object-cover" />
                  ) : (
                    r.category
                  )}
                </div>
                <div className="p-4">
                  <p className="font-mono text-sm">{r.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
