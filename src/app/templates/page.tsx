import type { Metadata } from "next";
import { TemplatesPage } from "./templates-page";

export const metadata: Metadata = {
  title: "Templates",
  description: "Complete, themed landing page builds — built end to end from ReactFrame components.",
};

export default function Page() {
  return <TemplatesPage />;
}
