import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ReactFrame collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated="August 18, 2026"
      paragraphs={[
        "By using the ReactFrame website, you agree to the following privacy policy. If you do not agree with any part of this policy, please do not use the site. This policy applies to all visitors and users of reactframe.com.",
        "When you interact with our website — including purchasing premium access, or contacting support — we may collect personal information such as your name, email address, and payment details processed through our payment provider. We do not collect any sensitive personal data beyond what's required to complete a purchase, and we only collect information you voluntarily provide to us.",
        "The information you provide is used solely to fulfil your order, respond to your inquiry, or send you relevant information about ReactFrame's products. We do not sell, rent, or share your personal information with third parties for marketing purposes.",
        "This website may use cookies and analytics tools to understand how visitors interact with our site. This data is collected anonymously and is used only to improve the website experience. You can disable cookies at any time through your browser settings.",
        "Your information is stored securely and accessed only by ReactFrame. Payment details are handled entirely by our payment processor — we do not store your card information. While we take reasonable measures to protect your data, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
        "Our website may contain links to third-party platforms or tools. ReactFrame is not responsible for the privacy practices of any external services. We encourage you to review the privacy policies of any third-party sites you visit.",
        "You have the right to request access to, correction of, or deletion of any personal information we hold about you. To make such a request, please contact us at locaahmet@gmail.com.",
        "We may update this Privacy Policy from time to time. The \"Last updated\" date at the top of this page will always reflect the most recent version. Continued use of the site after any changes constitutes your acceptance of the updated policy.",
        "If you have any questions about this Privacy Policy, please contact us at locaahmet@gmail.com.",
      ]}
    />
  );
}
