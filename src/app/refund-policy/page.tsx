import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "ReactFrame's refund policy.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated="August 18, 2026"
      paragraphs={[
        "Due to the digital nature of this product, all sales are final and refunds are not available. Please review the product details carefully before purchasing. If you have any questions, feel free to contact me before placing your order.",
      ]}
    />
  );
}
