import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "ReactFrame's commitment to an accessible website.",
};

export default function AccessibilityStatementPage() {
  return (
    <LegalPage
      title="Accessibility Statement"
      lastUpdated="August 18, 2026"
      paragraphs={[
        "ReactFrame is committed to making our website accessible to everyone — including people with disabilities. We strive to provide an inclusive experience that works for all visitors, regardless of ability or the technology they use. We aim to meet Web Content Accessibility Guidelines (WCAG) standards wherever possible, and we continue to improve as the web evolves.",
        "We've built this site with accessibility in mind from the ground up. This includes semantic HTML structure, sufficient color contrast, keyboard-friendly navigation, alt text for all images, screen reader support, logical heading hierarchy, and descriptive link labels.",
        "We regularly review and test our site to identify and address accessibility issues. We recognize that some areas may not yet be fully accessible — and we're actively working to close those gaps. This statement will be updated as we make progress.",
        "If you've found an accessibility issue, tell us the page URL and the assistive technology you're using — we'll get on it. locaahmet@gmail.com",
      ]}
    />
  );
}
