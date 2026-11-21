import "server-only";
import { unstable_cache } from "next/cache";
import type { ContentBlock, ContentEntry, ContentRepository, RichText } from "@/lib/integrations/content/types";
import { getNotionClient } from "./client";

type NotionProperty = {
  type: string;
  title?: RichText[];
  rich_text?: RichText[];
  date?: { start: string } | null;
  select?: { name: string } | null;
  multi_select?: { name: string }[];
  checkbox?: boolean;
  url?: string | null;
  status?: { name: string } | null;
};
type NotionPage = {
  id: string;
  last_edited_time: string;
  cover?: { type: "external" | "file"; external?: { url: string }; file?: { url: string } } | null;
  properties: Record<string, NotionProperty>;
};

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
  const statusProperty = property(page, "Status", "Publication Status");
  const status = (statusProperty?.status?.name ?? statusProperty?.select?.name)?.toLowerCase();
  const published = property(page, "Published")?.checkbox;
  const unpublishedStatuses = ["draft", "unpublished", "private", "archived"];
  if (!title || !slug || published === false || (status && unpublishedStatuses.includes(status))) return null;
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
  const notion = getNotionClient();
  const result: ContentBlock[] = [];
  let cursor: string | undefined;
  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      page_size: 100,
      ...(cursor ? { start_cursor: cursor } : {})
    });
    for (const item of response.results) {
      if (item.object !== "block" || !("type" in item)) continue;
      const block = item as unknown as ContentBlock & { has_children?: boolean };
      result.push(block.has_children ? { ...block, children: await getBlocks(block.id) } : block);
    }
    cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
  } while (cursor);
  return result;
}

export class NotionContentRepository implements ContentRepository {
  async list(type: "blog" | "news", limit = 12) {
    const databaseId = type === "blog" ? process.env.NOTION_BLOG_DATABASE_ID : process.env.NOTION_NEWS_DATABASE_ID;
    if (!databaseId || !process.env.NOTION_TOKEN) return [];
    const notion = getNotionClient();
    const database = await notion.databases.retrieve({ database_id: databaseId });
    if (!("data_sources" in database) || !database.data_sources[0]) return [];
    const dataSourceId = database.data_sources[0].id;
    const entries: ContentEntry[] = [];
    let cursor: string | undefined;
    do {
      const response = await notion.dataSources.query({
        data_source_id: dataSourceId,
        page_size: 100,
        ...(cursor ? { start_cursor: cursor } : {}),
        sorts: [{ timestamp: "last_edited_time", direction: "descending" }],
        result_type: "page"
      });
      entries.push(...response.results
        .filter((result) => result.object === "page" && "properties" in result)
        .map((page) => mapPage(page as NotionPage, type))
        .filter((entry): entry is ContentEntry => Boolean(entry)));
      cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
    } while (cursor && entries.length < limit);
    return entries
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);
  }

  async findBySlug(type: "blog" | "news", slug: string) {
    const entries = await this.list(type, 10_000);
    const entry = entries.find((candidate) => candidate.slug === slug);
    return entry ? { ...entry, blocks: await getBlocks(entry.id) } : null;
  }
}

const repository = new NotionContentRepository();
export const listContent = unstable_cache(
  async (type: "blog" | "news", limit?: number) => {
    try {
      return await repository.list(type, limit);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const message = error instanceof Error ? error.message : "Unknown Notion error";
        console.warn(`[Notion] ${type} content unavailable: ${message}`);
      }
      return [];
    }
  },
  ["notion-content-list"],
  { revalidate: 300, tags: ["notion-content"] }
);
export const getContent = unstable_cache(
  async (type: "blog" | "news", slug: string) => {
    try {
      return await repository.findBySlug(type, slug);
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        const message = error instanceof Error ? error.message : "Unknown Notion error";
        console.warn(`[Notion] ${type} entry unavailable: ${message}`);
      }
      return null;
    }
  },
  ["notion-content-entry"],
  { revalidate: 300, tags: ["notion-content"] }
);
