import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "License",
  description: "What you can and can't do with ReactFrame's free and premium components.",
};

export default function LicensePage() {
  return (
    <LegalPage
      title="License"
      lastUpdated="September 12, 2026"
      paragraphs={[
        "Every component on ReactFrame — free or premium — is licensed for use inside your own projects, personal or commercial, for yourself or a client. You can copy it, modify it, restyle it, and ship it as many times as you like. No attribution is required and no per-project or per-seat fee applies once a component is unlocked.",
        "Free components are licensed under the MIT License — no unlock step required. Beyond the terms above, MIT also lets you redistribute, sublicense, or resell a free component's source on its own, as long as the copyright notice is preserved. The full MIT text ships in this repo's LICENSE file and applies only to free components — not to premium ones, which stay under the terms below.",
        "Premium components require unlocking access to the source before you can install them. That unlock grants you a license to use the component in your own projects; it does not transfer ownership of the underlying design or code. You may not resell, redistribute, or repackage a premium component's source — on its own or bundled into a competing component library, UI kit, or template marketplace — whether modified or not.",
        "You may not claim authorship of a component's original design when redistributing derivative works publicly (a fork of an open-source project, a public code snippet, and similar). Using a component privately inside a client project or product you ship does not require any credit.",
        "This license covers the component source code and any assets shipped alongside it (icons, sample data, and the like). It does not cover third-party content you supply yourself — images, fonts, copy, or API integrations you add when adapting a component to your project remain governed by their own licenses.",
        "Components are provided as-is, without warranty of fitness for a particular purpose — see the Terms of Service for the full disclaimer. If a component's behavior doesn't match its documentation, that's a Support issue, not a license one; reach out and we'll sort it out.",
        "We may update this License from time to time. The \"Last updated\" date above always reflects the current version, and it applies retroactively to components you've already unlocked — the terms you're licensed under are whatever this page says today, not whatever it said on the day you unlocked a given component.",
      ]}
    />
  );
}
