import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How ReactFrame uses cookies.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="August 18, 2026"
      paragraphs={[
        "ReactFrame uses cookies and similar technologies to improve your experience on our website. This policy explains what cookies are, how we use them, and how you can manage them. By continuing to use this site, you consent to our use of cookies as described below.",
        "Cookies are small text files stored on your device when you visit a website. They help us understand how you navigate our site, remember your preferences, and ensure certain features work correctly. Cookies do not give us access to your device or any personal information beyond what you choose to share.",
        "We use three types of cookies. Essential cookies are required for the site to function — they cover security, basic navigation, and core features, and cannot be disabled. Analytics cookies help us understand how visitors interact with the site; all data is anonymous and never personally identifiable. Marketing cookies are only active if you've opted in to promotional content, and help us show you relevant information based on your interests.",
        "You are in control. You can manage or disable cookies at any time through your browser settings. Most browsers allow you to block, delete, or be notified when cookies are set. Please note that disabling essential cookies may prevent certain parts of the site from functioning properly. Analytics and marketing cookies can be turned off without affecting your core browsing experience.",
        "By continuing to use the ReactFrame website, you consent to our use of cookies as described in this policy. We may update this page from time to time — the \"Last updated\" date at the top will always reflect the current version.",
      ]}
    />
  );
}
