import Image from "next/image";
import Link from "next/link";
import { ArticleShare } from "./article-share";
import { ContentCard } from "./content-card";
import { NotionRenderer } from "./notion-renderer";
import type { ContentEntry } from "@/lib/integrations/content/types";
import { contentPath } from "@/lib/integrations/content/path";
import { contentWordCount } from "@/lib/integrations/content/summary";
import { contentImagePath } from "@/lib/seo/content-metadata";
import { getWebsiteConfig } from "@/config";

export function ContentArticle({ entry, related = [] }: { entry: ContentEntry; related?: ContentEntry[] }) {
  const { company, seo } = getWebsiteConfig();
  const base = company.url.replace(/\/$/, "");
  const articleUrl = `${base}${contentPath(entry)}`;
  const imageUrl = entry.cover
    ? new URL(contentImagePath(entry), base).toString()
    : new URL("/opengraph-image", base).toString();
  const sectionName = entry.type === "blog" ? "Insights" : "News";
  const wordCount = contentWordCount(entry.blocks);
  const schema = {
    "@context": "https://schema.org",
    "@type": entry.type === "news" ? "NewsArticle" : "BlogPosting",
    headline: entry.title,
    description: entry.excerpt,
    inLanguage: seo.locale.replace("_", "-"),
    keywords: entry.tags.join(", "),
    image: [imageUrl],
    thumbnailUrl: imageUrl,
    datePublished: entry.publishedAt,
    dateModified: entry.updatedAt,
    author: { "@type": "Organization", "@id": `${base}/#organization`, name: company.name, url: base },
    publisher: {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: company.name,
      logo: { "@type": "ImageObject", url: new URL(company.logoUrl, base).toString() }
    },
    articleSection: sectionName,
    isAccessibleForFree: true,
    ...(wordCount ? { wordCount } : {}),
    ...(entry.tags.length ? { about: entry.tags.map((name) => ({ "@type": "Thing", name })) } : {}),
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    url: articleUrl,
    potentialAction: { "@type": "ReadAction", target: articleUrl }
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
  return (
    <>
      <article className="article">
        <header className="article-header container narrow">
          <nav className="article-breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link><span aria-hidden="true">/</span>
            <Link href={`/${entry.type}`}>{sectionName}</Link>
          </nav>
          <span className="eyebrow">{entry.type === "blog" ? "Insight" : "Company news"}</span>
          <h1>{entry.title}</h1>
          <p>{entry.excerpt}</p>
          <div className="article-meta">
            <time dateTime={entry.publishedAt}>{new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(new Date(entry.publishedAt))}</time>
            {entry.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          </div>
        </header>
        {entry.cover && (
          <figure className="article-cover container">
            <Image
              unoptimized
              priority
              src={contentImagePath(entry)}
              alt={entry.coverAlt || `Featured image for ${entry.title}`}
              width={1200}
              height={675}
              sizes="(max-width: 1240px) calc(100vw - 28px), 1184px"
            />
          </figure>
        )}
        <div className="container prose">
          <ArticleShare title={entry.title} summary={entry.excerpt} url={articleUrl} />
          {entry.blocks && <NotionRenderer blocks={entry.blocks} excludeImageUrl={entry.cover} articleTitle={entry.title} />}
          <footer className="article-footer">
            <p>Explore more useful ideas and updates from {company.name}.</p>
            <div>
              <Link href={`/${entry.type}`} className="button button-secondary">More {sectionName.toLowerCase()}</Link>
              <Link href={entry.type === "blog" ? "/news" : "/blog"} className="text-link">
                {entry.type === "blog" ? "See company news" : "Read our insights"} →
              </Link>
            </div>
          </footer>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
      </article>
      {related.length > 0 && (
        <aside className="article-related section" aria-labelledby="related-content-title">
          <div className="container">
            <div className="section-heading">
              <span className="eyebrow">Keep exploring</span>
              <h2 id="related-content-title">Related {sectionName.toLowerCase()}</h2>
              <p>More context, practical ideas and recent updates.</p>
            </div>
            <div className="content-grid">{related.map((item) => <ContentCard entry={item} key={item.id} />)}</div>
          </div>
        </aside>
      )}
    </>
  );
}
