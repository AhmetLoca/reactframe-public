import type { Metadata } from "next";
import { TemplatesPage } from "./templates-page";

export const metadata: Metadata = {
  alternates: { canonical: "/templates" },
  // Hidden until launch: kept out of the index (and the sitemap) until it ships.
  robots: { index: false, follow: true },
  title: "Templates",
  description: "Complete, themed landing page builds, built end to end from ReactFrame components.",
};

export default function Page() {
  return <TemplatesPage />;
}
