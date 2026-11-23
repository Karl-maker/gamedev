import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/content-index";
import { listContent } from "@/lib/integrations/notion/content-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";

const description = "Research and practical guidance for improving workflows, software systems and operational decisions.";
export const metadata: Metadata = buildPageMetadata({ title: "Insights", description, path: "/blog", keywords: ["workflow automation insights", "custom software articles"] });
export const revalidate = 300;
export default async function BlogPage() { return <ContentIndex type="blog" entries={await listContent("blog", 24).catch(() => [])} />; }
