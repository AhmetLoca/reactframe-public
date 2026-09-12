import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts, formatPostDate } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Blog",
  description: "Component breakdowns, build notes, and updates from the ReactFrame library.",
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-3 max-w-xl text-foreground/60">Component breakdowns, build notes, and whatever else is worth writing down along the way.</p>

      <div className="mt-12">
        {posts.length === 0 ? (
          <p className="py-16 text-center text-sm text-foreground/50">No posts yet — check back soon.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-colors duration-300 ease-signature hover:border-foreground/20"
              >
                <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-foreground/[0.03] text-xs text-foreground/30">
                  {post.coverImage ? (
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      loading="lazy"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-signature group-hover:scale-[1.03]"
                    />
                  ) : (
                    post.category
                  )}
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs tracking-[0.15em] text-foreground/40 uppercase">
                    {post.category} · {formatPostDate(post.date)}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold tracking-tight">{post.title}</h2>
                  <p className="mt-2 line-clamp-2 text-sm text-foreground/60">{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
