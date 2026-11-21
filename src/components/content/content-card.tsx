import Image from "next/image";
import Link from "next/link";
import type { ContentEntry } from "@/lib/integrations/content/types";

export function ContentCard({ entry }: { entry: ContentEntry }) {
  return (
    <article className="content-card">
      <Link href={`/${entry.type}/${entry.slug}`} className="card-image">
        {entry.cover ? <Image unoptimized src={entry.cover} alt={`Cover for ${entry.title}`} fill sizes="(max-width: 700px) 100vw, 33vw" /> : <div className="image-placeholder" />}
      </Link>
      <div className="card-copy">
        <div className="eyebrow">{entry.type === "blog" ? "Insight" : "News"} · <time dateTime={entry.publishedAt}>{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(entry.publishedAt))}</time></div>
        <h2><Link href={`/${entry.type}/${entry.slug}`}>{entry.title}</Link></h2>
        <p>{entry.excerpt}</p>
        <Link className="text-link" href={`/${entry.type}/${entry.slug}`}>Read more <span aria-hidden="true">→</span></Link>
      </div>
    </article>
  );
}
