import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentArticle } from "@/components/content/content-article";
import { getContent } from "@/lib/integrations/notion/content-repository";
import { getWebsiteConfig } from "@/config";

export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContent("news", slug).catch(() => null);
  if (!entry) return {};
  const config = getWebsiteConfig();
  const image = entry.cover ? [{ url: entry.cover, alt: `Cover image for ${entry.title}` }] : [{ url: "/opengraph-image", alt: config.company.name }];
  return { title: entry.title, description: entry.excerpt, keywords: [...new Set([...entry.tags, ...config.seo.keywords])], authors: [{ name: config.company.name, url: config.company.url }], alternates: { canonical: `/news/${slug}` }, openGraph: { type: "article", locale: config.seo.locale, siteName: config.company.name, url: `/news/${slug}`, title: entry.title, description: entry.excerpt, publishedTime: entry.publishedAt, modifiedTime: entry.updatedAt, tags: entry.tags, images: image }, twitter: { card: "summary_large_image", title: entry.title, description: entry.excerpt, images: [entry.cover || "/opengraph-image"] } };
}
export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const entry = await getContent("news", (await params).slug).catch(() => null);
  if (!entry) notFound();
  return <ContentArticle entry={entry} />;
}
