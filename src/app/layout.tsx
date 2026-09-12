import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/site-chrome";
import { Nav } from "@/components/nav";
import { SiteFooter } from "@/components/site-footer";
import { CookieConsent } from "@/components/cookie-consent";
import { components } from "@/lib/catalog-data";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://reactframe.com";
const title = "ReactFrame — UI library for Design Engineers";
const description = `${components.length}+ free and premium React components and effects built with React, TypeScript, Tailwind CSS and Motion. Ships in shadcn/ui's registry format — copy, paste, own the code.`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s — ReactFrame",
  },
  description,
  keywords: [
    "shadcn/ui components",
    "React components",
    "Tailwind CSS components",
    "animated components",
    "component registry",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ReactFrame",
    title,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SiteChrome nav={<Nav />} footer={<SiteFooter />}>
            {children}
          </SiteChrome>
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
