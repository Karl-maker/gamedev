import type { Metadata, Viewport } from "next";
import "@fontsource-variable/manrope";
import "@fontsource-variable/sora";
import { Analytics } from "@/components/analytics/analytics";
import { ExperimentProvider } from "@/components/experiments/experiment-provider";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CookieBanner } from "@/components/privacy/cookie-banner";
import { getWebsiteConfig } from "@/config";
import "./globals.css";

const config = getWebsiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(config.company.url),
  title: { default: `${config.company.name} | ${config.hero.eyebrow}`, template: `%s | ${config.company.name}` },
  description: config.company.description,
  keywords: config.seo.keywords,
  applicationName: config.company.name,
  authors: [{ name: config.company.name, url: config.company.url }],
  creator: config.company.name,
  publisher: config.company.legalName,
  category: "business",
  classification: "Business software and technology services",
  formatDetection: { email: false, address: false, telephone: false },
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": [{ url: "/feed.xml", title: `${config.company.name} articles and news` }] }
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  icons: { icon: config.company.faviconUrl },
  openGraph: {
    type: "website",
    siteName: config.company.name,
    locale: config.seo.locale,
    title: config.company.name,
    description: config.company.description,
    url: "/",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: config.company.name }]
  },
  twitter: { card: "summary_large_image", title: config.company.name, description: config.company.description, images: ["/opengraph-image"] },
  ...(config.seo.googleSiteVerification ? { verification: { google: config.seo.googleSiteVerification } } : {})
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#133d34", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${config.company.url.replace(/\/$/, "")}/#organization`,
    name: config.company.name,
    legalName: config.company.legalName,
    url: config.company.url,
    logo: new URL(config.company.logoUrl, config.company.url).toString(),
    email: config.company.email,
    telephone: config.company.phone,
    address: config.company.address,
    sameAs: Object.values(config.social).filter(Boolean),
    areaServed: config.seo.areaServed,
    knowsAbout: config.seo.knowsAbout,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: config.seo.contactType,
      email: config.company.email,
      telephone: config.company.phone,
      areaServed: config.seo.areaServed,
      availableLanguage: ["English"]
    }
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.company.name,
    url: config.company.url,
    description: config.company.description,
    inLanguage: config.seo.locale.replace("_", "-"),
    "@id": `${config.company.url.replace(/\/$/, "")}/#website`,
    publisher: { "@id": `${config.company.url.replace(/\/$/, "")}/#organization` }
  };
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <ExperimentProvider experiments={config.experiments}>
          <Header config={config} />
          <main id="main">{children}</main>
          <Footer config={config} />
        </ExperimentProvider>
        <CookieBanner />
        <Analytics />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}
