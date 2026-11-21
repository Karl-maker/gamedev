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
  return { title: entry.title, description: entry.excerpt, keywords: entry.tags, authors: [{ name: getWebsiteConfig().company.name }], alternates: { canonical: `/news/${slug}` }, openGraph: { type: "article", title: entry.title, description: entry.excerpt, publishedTime: entry.publishedAt, modifiedTime: entry.updatedAt, tags: entry.tags, images: entry.cover ? [{ url: entry.cover, alt: `Cover image for ${entry.title}` }] : undefined } };
}
export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const entry = await getContent("news", (await params).slug).catch(() => null);
  if (!entry) notFound();
  return <ContentArticle entry={entry} />;
}
