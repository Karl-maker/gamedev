import type { MetadataRoute } from "next";
import { getWebsiteConfig } from "@/config";
import { listContent } from "@/lib/integrations/notion/content-repository";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getWebsiteConfig().company.url.replace(/\/$/, "");
  const staticPaths = ["", "/about", "/services", "/contact", "/blog", "/news", "/privacy", "/cookies", "/terms", "/accessibility"];
  const staticEntries = staticPaths.map((path) => ({ url: `${base}${path}`, changeFrequency: path === "" ? "weekly" as const : "monthly" as const, priority: path === "" ? 1 : 0.7 }));
  const content = await Promise.all([listContent("blog", 10_000), listContent("news", 10_000)]).then((groups) => groups.flat()).catch(() => []);
  return [...staticEntries, ...content.map((entry) => ({ url: `${base}/${entry.type}/${entry.slug}`, lastModified: new Date(entry.updatedAt), changeFrequency: "monthly" as const, priority: 0.8 }))];
}
