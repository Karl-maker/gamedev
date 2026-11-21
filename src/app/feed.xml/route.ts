import { getWebsiteConfig } from "@/config";
import { listContent } from "@/lib/integrations/notion/content-repository";

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
    const url = `${base}/${entry.type}/${entry.slug}`;
    return `<item><title>${escapeXml(entry.title)}</title><link>${escapeXml(url)}</link><guid isPermaLink="true">${escapeXml(url)}</guid><description>${escapeXml(entry.excerpt)}</description><pubDate>${new Date(entry.publishedAt).toUTCString()}</pubDate><category>${entry.type}</category></item>`;
  }).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(company.name)}</title><link>${escapeXml(base)}</link><description>${escapeXml(company.description)}</description><language>en</language><lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8", "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
