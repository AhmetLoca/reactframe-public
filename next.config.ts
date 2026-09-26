import type { NextConfig } from "next";

const NOINDEX = [{ key: "X-Robots-Tag", value: "noindex" }];

const nextConfig: NextConfig = {
  // Iframe-only render targets: the component detail page and the page previews embed these, so they'd
  // otherwise get indexed as thin duplicates of the pages that frame them.
  async headers() {
    return [
      { source: "/preview/:path*", headers: NOINDEX },
      { source: "/pages/preview/:slug/view", headers: NOINDEX },
    ];
  },
};

export default nextConfig;
