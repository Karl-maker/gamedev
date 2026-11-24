import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ContentArticle } from "@/components/content/content-article";
import { getContent, listContent } from "@/lib/integrations/notion/content-repository";
import { relatedContent } from "@/lib/integrations/content/related";
import { contentRouteKey } from "@/lib/integrations/content/path";
import { buildContentMetadata } from "@/lib/seo/content-metadata";

export const revalidate = 300;
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = await getContent("news", slug).catch(() => null);
  if (!entry) return {};
  return buildContentMetadata(entry);
}
export default async function NewsArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [entry, candidates] = await Promise.all([
    getContent("news", slug).catch(() => null),
    listContent("news", 12).catch(() => [])
  ]);
  if (!entry) notFound();
  if (slug !== contentRouteKey(entry)) permanentRedirect(`/news/${contentRouteKey(entry)}`);
  return <ContentArticle entry={entry} related={relatedContent(entry, candidates)} />;
}
