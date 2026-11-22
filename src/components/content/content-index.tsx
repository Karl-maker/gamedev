import { ContentCard } from "./content-card";
import type { ContentEntry } from "@/lib/integrations/content/types";

export function ContentIndex({ type, entries }: { type: "blog" | "news"; entries: ContentEntry[] }) {
  const title = type === "blog" ? "The latest from our team" : "The latest from our team";
  return <><section className="page-hero"><div className="container narrow"><span className="eyebrow">{type === "blog" ? "Company news" : "Company news"}</span><h1>{title}</h1><p>Practical guidance on AI and software workflows.</p></div></section><section className="section container">{entries.length ? <div className="content-grid">{entries.map((entry) => <ContentCard key={entry.id} entry={entry} />)}</div> : <div className="empty-state"><h2>Fresh thinking is on the way.</h2><p>Published Notion entries will appear here automatically.</p></div>}</section></>;
}
