import type { MetadataRoute } from "next";
import { getWebsiteConfig } from "@/config";
import { contentPath } from "@/lib/integrations/content/path";
import { contentImagePath } from "@/lib/seo/content-metadata";
import { listContent } from "@/lib/integrations/notion/content-repository";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getWebsiteConfig().company.url.replace(/\/$/, "");
  const staticPaths = ["", "/about", "/services", "/contact", "/blog", "/news", "/privacy", "/cookies", "/terms", "/accessibility"];
  const staticEntries = staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.7 }));
  const content = await Promise.all([listContent("blog", 10_000), listContent("news", 10_000)]).then((groups) => groups.flat()).catch(() => []);
  return [...staticEntries, ...content.map((entry) => ({
    url: `${base}${contentPath(entry)}`,
    lastModified: new Date(entry.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    ...(entry.cover ? { images: [`${base}${contentImagePath(entry)}`] } : {})
  }))];
}
