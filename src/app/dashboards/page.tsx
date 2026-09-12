import type { Metadata } from "next";
import { DashboardsPage } from "./dashboards-page";

export const metadata: Metadata = {
  title: "Dashboards",
  description: "Complete, themed dashboard builds — built end to end from ReactFrame components.",
};

export default function Page() {
  return <DashboardsPage />;
}
