import type { Metadata } from "next";
import { DashboardsPage } from "./dashboards-page";

export const metadata: Metadata = {
  alternates: { canonical: "/dashboards" },
  // Hidden until launch: kept out of the index (and the sitemap) until it ships.
  robots: { index: false, follow: true },
  title: "Dashboards",
  description: "Complete, themed dashboard builds, built end to end from ReactFrame components.",
};

export default function Page() {
  return <DashboardsPage />;
}
