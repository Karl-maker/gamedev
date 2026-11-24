import type { Metadata } from "next";
import { getWebsiteConfig } from "@/config";

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = []
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  const config = getWebsiteConfig();
  const url = path.startsWith("/") ? path : `/${path}`;
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: `${title} — ${config.company.name}` };
  return {
    title,
    description,
    keywords: [...new Set([...keywords, ...config.seo.keywords])],
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: "/feed.xml", title: `${config.company.name} articles and news` }] }
    },
    openGraph: {
      type: "website",
      locale: config.seo.locale,
      siteName: config.company.name,
      title,
      description,
      url,
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"]
    }
  };
}
