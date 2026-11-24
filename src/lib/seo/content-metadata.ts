import type { Metadata } from "next";
import { getWebsiteConfig } from "@/config";
import { contentPath, contentRouteKey } from "@/lib/integrations/content/path";
import type { ContentEntry } from "@/lib/integrations/content/types";

export function contentImagePath(entry: ContentEntry) {
  return `/content-image/${entry.type}/${contentRouteKey(entry)}`;
}

export function buildContentMetadata(entry: ContentEntry): Metadata {
  const config = getWebsiteConfig();
  const path = contentPath(entry);
  const image = {
    url: entry.cover ? contentImagePath(entry) : "/opengraph-image",
    alt: entry.coverAlt || `Featured image for ${entry.title}`
  };
  const section = entry.type === "news" ? "Company news" : "Insights";
  return {
    title: entry.title,
    description: entry.excerpt,
    keywords: [...new Set([...entry.tags, ...config.seo.keywords])],
    authors: [{ name: config.company.name, url: config.company.url }],
    creator: config.company.name,
    publisher: config.company.legalName,
    category: section,
    alternates: {
      canonical: path,
      types: { "application/rss+xml": [{ url: "/feed.xml", title: `${config.company.name} articles and news` }] }
    },
    openGraph: {
      type: "article",
      locale: config.seo.locale,
      siteName: config.company.name,
      url: path,
      title: entry.title,
      description: entry.excerpt,
      publishedTime: entry.publishedAt,
      modifiedTime: entry.updatedAt,
      authors: [config.company.name],
      section,
      tags: entry.tags,
      images: [image]
    },
    twitter: {
      card: "summary_large_image",
      title: entry.title,
      description: entry.excerpt,
      images: [image]
    }
  };
}
