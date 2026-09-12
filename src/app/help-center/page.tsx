import type { Metadata } from "next";
import { HelpCenterPage } from "./help-center-page";

export const metadata: Metadata = {
  title: "Help Center",
  description: "Search FAQs, or jump into License, Payment, and Support.",
};

export default function Page() {
  return <HelpCenterPage />;
}
