import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/content-index";
import { listContent } from "@/lib/integrations/notion/content-repository";

export const metadata: Metadata = { title: "News", description: "Company news and updates from our legal technology and workflow automation team.", alternates: { canonical: "/news" } };
export const revalidate = 300;
export default async function NewsPage() { return <ContentIndex type="news" entries={await listContent("news", 24).catch(() => [])} />; }
