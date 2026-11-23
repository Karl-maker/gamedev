import type { Metadata } from "next";
import { ContentIndex } from "@/components/content/content-index";
import { listContent } from "@/lib/integrations/notion/content-repository";
import { buildPageMetadata } from "@/lib/seo/metadata";

const description = "Company news and updates from our software, automation and digital systems team.";
export const metadata: Metadata = buildPageMetadata({ title: "News", description, path: "/news", keywords: ["company news", "software company updates"] });
export const revalidate = 300;
export default async function NewsPage() { return <ContentIndex type="news" entries={await listContent("news", 24).catch(() => [])} />; }
