import type { Metadata } from "next";
import { Error404PageSection } from "../../registry/new-york/error-404-page-section/error-404-page-section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

// Rendered for every unmatched URL and every notFound() call (e.g. an unknown /components/[slug] or
// hidden component). It sits inside the root layout, so the site nav and footer stay around it, and
// theme="auto" makes it follow the site's dark / light theme.
export default function NotFound() {
  return (
    <Error404PageSection
      theme="auto"
      heading="Page not found"
      description="The page you're looking for doesn't exist or may have been moved."
      buttonLabel="Back to home"
      buttonHref="/"
      secondaryLabel="Browse components"
      secondaryHref="/components"
      className="min-h-[72vh]"
    />
  );
}
