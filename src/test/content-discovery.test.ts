import { describe, expect, it } from "vitest";
import { contentPath, contentRouteKey, notionIdFromRouteKey, slugFromRouteKey } from "@/lib/integrations/content/path";
import { relatedContent } from "@/lib/integrations/content/related";
import { contentSummary } from "@/lib/integrations/content/summary";
import type { ContentBlock, ContentEntry } from "@/lib/integrations/content/types";

const entry: ContentEntry = {
  id: "12345678-1234-1234-1234-1234567890ab",
  slug: "a-useful-article",
  title: "A useful article",
  excerpt: "Useful summary",
  publishedAt: "2026-11-20T12:00:00.000Z",
  updatedAt: "2026-11-21T12:00:00.000Z",
  tags: ["Automation"],
  type: "blog"
};

describe("content discovery helpers", () => {
  it("builds stable routes from the Notion page ID", () => {
    const key = contentRouteKey(entry);
    expect(key).toBe("a-useful-article-123456781234123412341234567890ab");
    expect(contentPath(entry)).toBe(`/blog/${key}`);
    expect(notionIdFromRouteKey(key)).toBe("123456781234123412341234567890ab");
    expect(slugFromRouteKey(key)).toBe("a-useful-article");
  });

  it("uses article text when a summary property is absent", () => {
    const blocks: ContentBlock[] = [{
      id: "paragraph-1",
      type: "paragraph",
      paragraph: {
        rich_text: [{ plain_text: "The first useful lines of the article explain the subject clearly for readers and search previews." }]
      }
    }];
    expect(contentSummary("", blocks, entry.title)).toContain("first useful lines");
    expect(contentSummary("A supplied summary", blocks, entry.title)).toBe("A supplied summary");
  });

  it("personalizes first_name in article-derived summaries", () => {
    const blocks: ContentBlock[] = [{
      id: "paragraph-1",
      type: "paragraph",
      paragraph: {
        rich_text: [
          { plain_text: "Hi {{first_" },
          { plain_text: "name}}, welcome to this update." }
        ]
      }
    }];
    expect(contentSummary("", blocks, entry.title)).toBe("Hi Reader, welcome to this update.");
  });

  it("prioritizes related entries that share article tags", () => {
    const related = relatedContent(entry, [
      { ...entry, id: "different-1", slug: "newer", tags: ["Other"], publishedAt: "2026-11-23T12:00:00.000Z" },
      { ...entry, id: "different-2", slug: "matching", tags: ["Automation"], publishedAt: "2026-11-19T12:00:00.000Z" }
    ], 1);
    expect(related[0].slug).toBe("matching");
  });
});
