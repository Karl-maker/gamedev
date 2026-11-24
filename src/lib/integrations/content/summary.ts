import type { ContentBlock, RichText } from "./types";
import { personalizePublicContent } from "./personalization";

const summaryBlockTypes = new Set([
  "paragraph",
  "heading_1",
  "heading_2",
  "heading_3",
  "bulleted_list_item",
  "numbered_list_item",
  "quote",
  "callout"
]);

export function richTextValue(items: RichText[] = []) {
  return personalizePublicContent(items.map((item) => item.plain_text).join(""))
    .replace(/\s+/g, " ")
    .trim();
}

export function contentBlockText(block: ContentBlock, includeChildren = true): string {
  const data = block[block.type] as { rich_text?: RichText[] } | undefined;
  const ownText = summaryBlockTypes.has(block.type) ? richTextValue(data?.rich_text) : "";
  const childText = includeChildren
    ? block.children?.map((child) => contentBlockText(child)).filter(Boolean).join(" ") ?? ""
    : "";
  return [ownText, childText].filter(Boolean).join(" ").trim();
}

export function contentText(blocks: ContentBlock[] = []) {
  return blocks.map((block) => contentBlockText(block)).filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export function shortenSummary(value: string, maxLength = 190) {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  const candidate = normalized.slice(0, maxLength + 1);
  const sentenceEnd = Math.max(candidate.lastIndexOf(". "), candidate.lastIndexOf("? "), candidate.lastIndexOf("! "));
  if (sentenceEnd >= Math.floor(maxLength * 0.55)) return candidate.slice(0, sentenceEnd + 1);
  const wordEnd = candidate.lastIndexOf(" ");
  return `${candidate.slice(0, wordEnd > 0 ? wordEnd : maxLength).replace(/[,:;–—-]+$/, "")}…`;
}

export function contentSummary(preferred: string, blocks: ContentBlock[] = [], title = "") {
  const source = preferred.trim() || contentText(blocks);
  if (source) return shortenSummary(source);
  return title ? `Read the latest update: ${title}.` : "Read the latest update.";
}

export function contentWordCount(blocks: ContentBlock[] = []) {
  const text = contentText(blocks);
  return text ? text.split(/\s+/).length : 0;
}
