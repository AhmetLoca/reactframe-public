import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms and conditions for using ReactFrame.",
};

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated="August 18, 2026"
      paragraphs={[
        "By using the ReactFrame website, you agree to the following terms and conditions. If you do not agree with any part of these terms, please do not use the site. These terms apply to all visitors and users of reactframe.com.",
        "All content on this website — including text, images, graphics, design, layout, and the component source code offered here — is the intellectual property of ReactFrame and is protected by applicable copyright and intellectual property laws. Purchasing premium access grants you a license to use the components in your own projects; it does not grant you the right to resell, redistribute, or repackage the source code itself as a competing product. Unauthorized use of our content may result in legal action.",
        "The ReactFrame website and its content are provided \"as-is\" without warranties of any kind, either express or implied. While we work hard to ensure accuracy and quality, we do not guarantee that the site will be error-free, uninterrupted, or suitable for any particular purpose. ReactFrame shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of — or inability to use — this website, or any component obtained through it.",
        "You are responsible for how you use and interact with this website. Any information, content, or data you submit through our forms or communications is your responsibility to ensure it is accurate, lawful, and does not infringe on the rights of any third party. ReactFrame is not responsible for any consequences arising from information you provide to us or actions you take based on content found on this site.",
        "This website offers free and premium React/Tailwind components. Purchases are processed through our payment provider and are subject to our Refund Policy. Nothing on this website constitutes a warranty that a component will be compatible with every possible project beyond what's described on its own component page.",
        "This site may contain links to third-party websites for reference or convenience. ReactFrame is not responsible for the content, accuracy, or practices of any external sites. Visiting those links is at your own discretion and risk.",
        "We may update these Terms of Service from time to time to reflect changes in our practices, products, or legal requirements. The \"Last updated\" date at the top of this page will always reflect the most recent version. By continuing to use the ReactFrame website after any updates, you accept the revised terms. We encourage you to review this page periodically.",
      ]}
    />
  );
}
