import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/content-index";
import { listContent } from "@/lib/integrations/notion/content-repository";

export const metadata: Metadata = { title: "Insights", description: "Research and practical guidance for evaluating products and making stronger catalog decisions.", alternates: { canonical: "/blog" } };
export const revalidate = 300;
export default async function BlogPage() { return <ContentIndex type="blog" entries={await listContent("blog", 24).catch(() => [])} />; }
