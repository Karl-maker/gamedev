import Image from "next/image";
import Link from "next/link";
import { NotionRenderer } from "./notion-renderer";
import type { ContentEntry } from "@/lib/integrations/content/types";
import { getWebsiteConfig } from "@/config";

export function ContentArticle({ entry }: { entry: ContentEntry }) {
  const { company } = getWebsiteConfig();
  const base = company.url.replace(/\/$/, "");
  const articleUrl = `${base}/${entry.type}/${entry.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": entry.type === "news" ? "NewsArticle" : "BlogPosting",
    headline: entry.title,
    description: entry.excerpt,
    image: entry.cover ? [entry.cover] : undefined,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    author: { "@type": "Organization", name: company.name, url: base },
    publisher: {
      "@type": "Organization",
      name: company.name,
      logo: { "@type": "ImageObject", url: new URL(company.logoUrl, base).toString() }
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    url: articleUrl
  };
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: base },
      { "@type": "ListItem", position: 2, name: entry.type === "blog" ? "Insights" : "News", item: `${base}/${entry.type}` },
      { "@type": "ListItem", position: 3, name: entry.title, item: articleUrl }
    ]
  };
  return <article className="article"><header className="article-header container narrow"><Link className="eyebrow" href={`/${entry.type}`}>← {entry.type === "blog" ? "All insights" : "All news"}</Link><h1>{entry.title}</h1><p>{entry.excerpt}</p><div><time dateTime={entry.publishedAt}>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(entry.publishedAt))}</time>{entry.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}</div></header>{entry.cover && <div className="article-cover container"><Image unoptimized src={entry.cover} alt={`Cover image for ${entry.title}`} width={1400} height={780} priority /></div>}<div className="container prose">{entry.blocks && <NotionRenderer blocks={entry.blocks} />}</div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} /></article>;
}
