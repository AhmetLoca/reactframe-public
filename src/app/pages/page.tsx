import type { Metadata } from "next";
import { PagesPage } from "./pages-page";

export const metadata: Metadata = {
  title: "Pages",
  description: "Full, multi-section page layouts built by combining blocks and components together.",
};

export default function Page() {
  return <PagesPage />;
}
