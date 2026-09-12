import type { Metadata } from "next";
import { DocsPage } from "./docs-page";

export const metadata: Metadata = {
  title: "Documentation",
  description: "How to install and use ReactFrame's components, blocks, pages, and templates.",
};

export default function Page() {
  return <DocsPage />;
}
