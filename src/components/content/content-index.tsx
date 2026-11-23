import { ContentCard } from "./content-card";
import { PageJsonLd } from "@/components/seo/page-json-ld";
import { getWebsiteConfig } from "@/config";
import type { ContentEntry } from "@/lib/integrations/content/types";

export function ContentIndex({ type, entries }: { type: "blog" | "news"; entries: ContentEntry[] }) {
  const config = getWebsiteConfig();
  const title = type === "blog" ? "The latest from our team" : "The latest from our team";
  const pageTitle = type === "blog" ? "Insights" : "News";
  const description = type === "blog"
    ? "Research and practical guidance for improving workflows, software systems and operational decisions."
    : "Company news and updates from our software, automation and digital systems team.";
  return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">{type === "blog" ? "Company news" : "Company news"}</span><h1>{title}</h1><p>Practical guidance on AI and software workflows.</p></div></section><section className="section container">{entries.length ? <div className="content-grid">{entries.map((entry) => <ContentCard key={entry.id} entry={entry} />)}</div> : <div className="empty-state"><h2>Fresh thinking is on the way.</h2><p>Published Notion entries will appear here automatically.</p></div>}</section><PageJsonLd baseUrl={config.company.url} path={`/${type}`} title={pageTitle} description={description} type="CollectionPage" /></>;
}
