import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  alternates: { canonical: "/cookies" },
  title: "Cookie Policy",
  description: "How ReactFrame uses cookies.",
};

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      lastUpdated="September 26, 2026"
      paragraphs={[
        "ReactFrame uses a small number of cookies and browser storage entries. This policy explains what each one is for and how you can control them.",
        "Cookies are small text files a website stores on your device; local storage is a similar browser feature. Neither gives us access to your device or to any information you haven't chosen to share.",
        "Essential storage: we keep your cookie choice and your light or dark theme in your browser's local storage, so the cookie banner doesn't come back on every visit and the theme stays the way you set it. Some interactive component demos, such as the games, the spin-to-win wheel and the discount popups, also save their state there (for example a high score or the spins you have left). This data stays in your browser and is not sent to us.",
        "Analytics cookies help us understand how visitors interact with the site. We use Google Analytics for this, with IP anonymization turned on, and it only loads after you choose \"Accept\" in the cookie banner; if you choose \"Decline\", no analytics cookies are set. Google processes this data as described in its privacy policy at policies.google.com/privacy.",
        "We don't use advertising or marketing cookies.",
        "You can change your mind at any time. Clear this site's data in your browser settings and the cookie banner will ask again on your next visit. You can also block or delete cookies through your browser; the site works without analytics cookies, and without local storage it only forgets your theme and banner choice.",
        "We may update this page from time to time; the \"Last updated\" date at the top always reflects the current version.",
      ]}
    />
  );
}
