import { getWebsiteConfig } from "@/config";
import { contentPath } from "@/lib/integrations/content/path";
import { listContent } from "@/lib/integrations/notion/content-repository";
import { contentImagePath } from "@/lib/seo/content-metadata";

export const revalidate = 300;

function escapeXml(value: string) {
  return value.replace(/[<>&'"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character]!);
}

export async function GET() {
  const { company } = getWebsiteConfig();
  const base = company.url.replace(/\/$/, "");
  const entries = await Promise.all([listContent("blog", 100), listContent("news", 100)])
    .then((groups) => groups.flat().sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)))
    .catch(() => []);
  const items = entries.map((entry) => {
    const url = `${base}${contentPath(entry)}`;
    const categories = [entry.type, ...entry.tags].map((category) => `<category>${escapeXml(category)}</category>`).join("");
    const image = entry.cover ? `<media:content url="${escapeXml(`${base}${contentImagePath(entry)}`)}" medium="image" />` : "";
    return `<item><title>${escapeXml(entry.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(entry.excerpt)}</description><pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate>${categories}${image}</item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/"><channel><title>${escapeXml(company.name)}</title><link>${escapeXml(base)}</link><atom:link href="${escapeXml(`${base}/feed.xml`)}" rel="self" type="application/rss+xml" /><description>${escapeXml(company.description)}</description><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
