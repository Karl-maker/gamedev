import Link from "next/link";
import { ContentCard } from "./content-card";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { getWebsiteConfig } from "@/config";
import type { ContentEntry } from "@/lib/integrations/content/types";
import { contentPath } from "@/lib/integrations/content/path";
import { contentImagePath } from "@/lib/seo/content-metadata";

export function ContentIndex({ type, entries }: { type: "blog" | "news"; entries: ContentEntry[] }) {
  const config = getWebsiteConfig();
  const base = config.company.url.replace(/\/$/, "");
  const title = type === "blog" ? "Ideas for better digital operations" : "The latest from our team";
  const pageTitle = type === "blog" ? "Insights" : "News";
  const description = type === "blog"
    ? "Research and practical guidance for improving workflows, software systems and operational decisions."
    : "Company news and updates from our software, automation and digital systems team.";
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${config.company.name} ${pageTitle}`,
    numberOfItems: entries.length,
    itemListElement: entries.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${base}${contentPath(entry)}`,
      item: {
        "@type": entry.type === "news" ? "NewsArticle" : "BlogPosting",
        headline: entry.title,
        description: entry.excerpt,
        datePublished: entry.publishedAt,
        ...(entry.cover ? { image: `${base}${contentImagePath(entry)}` } : {})
      }
    }))
  };
  return (
    <>
      <section className="page-hero">
        <div className="container narrow">
          <span className="eyebrow">{type === "blog" ? "Insights & practical guides" : "Company news & updates"}</span>
          <h1>{title}</h1>
          <p>{description}</p>
          <div className="content-index-links">
            <a className="button button-secondary" href="/feed.xml">Follow via RSS</a>
            <Link className="text-link" href={type === "blog" ? "/news" : "/blog"}>
              {type === "blog" ? "See company news" : "Browse practical insights"} →
            </Link>
          </div>
        </div>
      </section>
      <section className="section container">
        {entries.length
          ? <div className="content-grid">{entries.map((entry) => <ContentCard key={entry.id} entry={entry} />)}</div>
          : <div className="empty-state"><h2>Fresh thinking is on the way.</h2><p>Published Notion entries will appear here automatically.</p></div>}
      </section>
      <PageJsonLd baseUrl={config.company.url} path={`/${type}`} title={pageTitle} description={description} type="CollectionPage" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList).replace(/</g, "\\u003c") }} />
    </>
  );
}
