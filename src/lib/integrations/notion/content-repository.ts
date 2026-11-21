import "server-only";
import { unstable_cache } from "next/cache";
import type { ContentBlock, ContentEntry, ContentRepository, RichText } from "@/lib/integrations/content/types";

type NotionProperty = {
  type: string;
  title?: RichText[];
  rich_text?: RichText[];
  date?: { start: string } | null;
  select?: { name: string } | null;
  multi_select?: { name: string }[];
  checkbox?: boolean;
  url?: string | null;
};
type NotionPage = {
  id: string;
  last_edited_time: string;
  cover?: { type: "external" | "file"; external?: { url: string }; file?: { url: string } } | null;
  properties: Record<string, NotionProperty>;
};

const notionVersion = "2022-06-28";

async function notionFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!process.env.NOTION_TOKEN) throw new Error("NOTION_TOKEN is not configured.");
  const response = await fetch(`https://api.notion.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": notionVersion,
      "Content-Type": "application/json",
      ...init?.headers
    }
  });
  if (!response.ok) throw new Error(`Notion request failed (${response.status}).`);
  return response.json() as Promise<T>;
}

const text = (property?: NotionProperty) =>
  (property?.title ?? property?.rich_text ?? []).map((item) => item.plain_text).join("");

function property(page: NotionPage, ...names: string[]) {
  const found = Object.entries(page.properties).find(([name]) =>
    names.some((candidate) => name.toLowerCase() === candidate.toLowerCase())
  );
  return found?.[1];
}

function mapPage(page: NotionPage, type: "blog" | "news"): ContentEntry | null {
  const title = text(property(page, "Title", "Name"));
  const slug = text(property(page, "Slug")) || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const publishedAt = property(page, "Published At", "Publish Date", "Date")?.date?.start;
  const status = property(page, "Status")?.select?.name?.toLowerCase();
  const published = property(page, "Published")?.checkbox;
  if (!title || !slug || (!publishedAt && !published) || (status && status !== "published")) return null;
  const coverProperty = property(page, "Cover", "Cover Image")?.url ?? undefined;
  const pageCover = page.cover?.external?.url ?? page.cover?.file?.url;
  return {
    id: page.id,
    slug,
    title,
    excerpt: text(property(page, "Excerpt", "Summary", "Description")),
    publishedAt: publishedAt ?? page.last_edited_time,
    updatedAt: page.last_edited_time,
    cover: coverProperty ?? pageCover,
    tags: property(page, "Tags", "Categories")?.multi_select?.map((tag) => tag.name) ?? [],
    type
  };
}

async function getBlocks(blockId: string): Promise<ContentBlock[]> {
  const result: ContentBlock[] = [];
  let cursor: string | undefined;
  do {
    const query = cursor ? `?page_size=100&start_cursor=${encodeURIComponent(cursor)}` : "?page_size=100";
    const response = await notionFetch<{
      results: Array<ContentBlock & { has_children?: boolean }>;
      has_more: boolean;
      next_cursor?: string;
    }>(`/blocks/${blockId}/children${query}`);
    for (const block of response.results) {
      result.push(block.has_children ? { ...block, children: await getBlocks(block.id) } : block);
    }
    cursor = response.has_more ? response.next_cursor : undefined;
  } while (cursor);
  return result;
}

export class NotionContentRepository implements ContentRepository {
  async list(type: "blog" | "news", limit = 12) {
    const databaseId = type === "blog" ? process.env.NOTION_BLOG_DATABASE_ID : process.env.NOTION_NEWS_DATABASE_ID;
    if (!databaseId || !process.env.NOTION_TOKEN) return [];
    const entries: ContentEntry[] = [];
    let cursor: string | undefined;
    do {
      const response = await notionFetch<{
        results: NotionPage[];
        has_more: boolean;
        next_cursor?: string | null;
      }>(`/databases/${databaseId}/query`, {
        method: "POST",
        body: JSON.stringify({
          page_size: 100,
          ...(cursor ? { start_cursor: cursor } : {}),
          sorts: [{ property: "Published At", direction: "descending" }]
        })
      });
      entries.push(...response.results.map((page) => mapPage(page, type)).filter((entry): entry is ContentEntry => Boolean(entry)));
      cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
    } while (cursor && entries.length < limit);
    return entries.slice(0, limit);
  }

  async findBySlug(type: "blog" | "news", slug: string) {
    const entries = await this.list(type, 10_000);
    const entry = entries.find((candidate) => candidate.slug === slug);
    return entry ? { ...entry, blocks: await getBlocks(entry.id) } : null;
  }
}

const repository = new NotionContentRepository();
export const listContent = unstable_cache(
  (type: "blog" | "news", limit?: number) => repository.list(type, limit),
  ["notion-content-list"],
  { revalidate: 300, tags: ["notion-content"] }
);
export const getContent = unstable_cache(
  (type: "blog" | "news", slug: string) => repository.findBySlug(type, slug),
  ["notion-content-entry"],
  { revalidate: 300, tags: ["notion-content"] }
);
