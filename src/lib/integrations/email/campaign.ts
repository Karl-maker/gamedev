import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";
import type { Client } from "@notionhq/client";
import type { ContentBlock, RichText } from "@/lib/integrations/content/types";
import { escapeHtml } from "./branded-template";

export type CampaignRecipient = {
  email: string;
  industry: string;
  first_name: string;
  last_name: string;
  last_sent: string;
  skip: boolean;
  fields: Record<string, string>;
};

export type NotionEmailPage = {
  title: string;
  blocks: ContentBlock[];
};

export type InlineImageAttachment = {
  filename: string;
  cid: string;
  content: Buffer;
  contentType?: string;
};

const truthy = new Set(["true", "1", "yes", "y", "on"]);
const falsy = new Set(["", "false", "0", "no", "n", "off"]);
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeHeader = (value: string) =>
  value.trim().toLowerCase().replace(/[\s-]+/g, "_");

function parseSkip(value: string, row: number) {
  const normalized = value.trim().toLowerCase();
  if (truthy.has(normalized)) return true;
  if (falsy.has(normalized)) return false;
  throw new Error(`CSV row ${row} has an invalid skip value "${value}". Use TRUE or FALSE.`);
}

export function parseRecipientsCsv(content: string): CampaignRecipient[] {
  const records = parse(content, {
    bom: true,
    columns: (headers: string[]) => headers.map(normalizeHeader),
    skip_empty_lines: true,
    trim: true
  }) as Record<string, string>[];

  if (!records.length) return [];
  const headers = new Set(Object.keys(records[0]));
  for (const required of ["email", "industry", "skip"]) {
    if (!headers.has(required)) throw new Error(`CSV is missing the required "${required}" column.`);
  }

  return records.map((record, index) => {
    const row = index + 2;
    const fields = Object.fromEntries(
      Object.entries(record).map(([key, value]) => [normalizeHeader(key), String(value ?? "").trim()])
    );
    fields.first_name = fields.first_name || "Reader";
    const email = fields.email.toLowerCase();
    if (!emailPattern.test(email)) throw new Error(`CSV row ${row} has an invalid email address.`);
    return {
      email,
      industry: fields.industry,
      first_name: fields.first_name ?? "",
      last_name: fields.last_name ?? "",
      last_sent: fields.last_sent ?? "",
      skip: parseSkip(fields.skip, row),
      fields
    };
  });
}

export async function loadRecipientsCsv(filePath: string) {
  return parseRecipientsCsv(await readFile(filePath, "utf8"));
}

export function selectRecipients(recipients: CampaignRecipient[], industry: string) {
  const expected = industry.trim().toLocaleLowerCase();
  const seen = new Set<string>();
  return recipients.filter((recipient) => {
    if (recipient.skip || recipient.industry.trim().toLocaleLowerCase() !== expected || seen.has(recipient.email)) {
      return false;
    }
    seen.add(recipient.email);
    return true;
  });
}

export function personalize(
  template: string,
  recipient: CampaignRecipient,
  encode: (value: string) => string = (value) => value
) {
  return template.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (placeholder, rawKey: string) => {
    const key = normalizeHeader(rawKey);
    return Object.hasOwn(recipient.fields, key) ? encode(recipient.fields[key]) : placeholder;
  });
}

type NotionClient = Pick<Client, "pages" | "blocks">;

async function fetchBlocks(notion: NotionClient, blockId: string): Promise<ContentBlock[]> {
  const blocks: ContentBlock[] = [];
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
      blocks.push(block.has_children
        ? { ...block, children: await fetchBlocks(notion, block.id) }
        : block);
    }
    cursor = response.has_more && response.next_cursor ? response.next_cursor : undefined;
  } while (cursor);
  return blocks;
}

function notionPageTitle(page: unknown) {
  if (!page || typeof page !== "object" || !("properties" in page)) return "";
  const properties = (page as { properties: Record<string, { type?: string; title?: RichText[] }> }).properties;
  const title = Object.values(properties).find((property) => property.type === "title");
  return title?.title?.map((item) => item.plain_text).join("").trim() ?? "";
}

export async function fetchNotionEmailPage(notion: NotionClient, pageId: string): Promise<NotionEmailPage> {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return {
    title: notionPageTitle(page) || "A message from our team",
    blocks: await fetchBlocks(notion, pageId)
  };
}

type BlockData = Record<string, unknown> & {
  rich_text?: RichText[];
  caption?: RichText[];
  url?: string;
  external?: { url?: string };
  file?: { url?: string };
};

function blockData(block: ContentBlock): BlockData {
  return (block[block.type] as BlockData | undefined) ?? {};
}

function absoluteUrl(value: string, baseUrl: string) {
  try {
    return new URL(value, `${baseUrl.replace(/\/$/, "")}/`).toString();
  } catch {
    return value;
  }
}

function richHtml(items: RichText[] = [], baseUrl: string) {
  return items.map((item) => {
    let value = escapeHtml(item.plain_text).replace(/\n/g, "<br>");
    if (item.annotations?.code) value = `<code style="padding:2px 5px;background:#f0f3f1;border-radius:4px;font-family:monospace">${value}</code>`;
    if (item.annotations?.bold) value = `<strong>${value}</strong>`;
    if (item.annotations?.italic) value = `<em>${value}</em>`;
    if (item.annotations?.strikethrough) value = `<s>${value}</s>`;
    if (item.annotations?.underline) value = `<u>${value}</u>`;
    if (item.href) {
      value = `<a href="${escapeHtml(absoluteUrl(item.href, baseUrl))}" style="color:#c65d39;text-decoration:underline">${value}</a>`;
    }
    return value;
  }).join("");
}

const richText = (items: RichText[] = []) => items.map((item) => item.plain_text).join("");
const childrenHtml = (block: ContentBlock, baseUrl: string) => renderNotionEmail(block.children ?? [], baseUrl).html;
const childrenText = (block: ContentBlock, baseUrl: string) => renderNotionEmail(block.children ?? [], baseUrl).text;

function mediaUrl(data: BlockData) {
  return data.external?.url ?? data.file?.url ?? data.url ?? "";
}

function renderSingleBlock(block: ContentBlock, baseUrl: string): { html: string; text: string } {
  const data = blockData(block);
  const htmlRich = richHtml(data.rich_text, baseUrl);
  const textRich = richText(data.rich_text);
  const nestedHtml = childrenHtml(block, baseUrl);
  const nestedText = childrenText(block, baseUrl);
  const paragraphStyle = "margin:0 0 20px;color:#4e665f;font-size:16px;line-height:1.72";
  const headingStyle = "margin:30px 0 14px;color:#153b32;line-height:1.25;letter-spacing:-.3px";

  switch (block.type) {
    case "paragraph":
      return { html: `<p style="${paragraphStyle}">${htmlRich}${nestedHtml}</p>`, text: `${textRich}\n${nestedText}` };
    case "heading_1":
      return { html: `<h2 style="${headingStyle};font-size:25px">${htmlRich}</h2>${nestedHtml}`, text: `${textRich}\n${nestedText}` };
    case "heading_2":
      return { html: `<h2 style="${headingStyle};font-size:22px">${htmlRich}</h2>${nestedHtml}`, text: `${textRich}\n${nestedText}` };
    case "heading_3":
      return { html: `<h3 style="${headingStyle};font-size:18px">${htmlRich}</h3>${nestedHtml}`, text: `${textRich}\n${nestedText}` };
    case "bulleted_list_item":
    case "numbered_list_item":
      return { html: `<li style="margin:0 0 8px">${htmlRich}${nestedHtml}</li>`, text: `${textRich}\n${nestedText}` };
    case "to_do": {
      const checked = Boolean(data.checked);
      return {
        html: `<p style="${paragraphStyle}">${checked ? "☑" : "☐"}&nbsp; ${htmlRich}</p>${nestedHtml}`,
        text: `${checked ? "[x]" : "[ ]"} ${textRich}\n${nestedText}`
      };
    }
    case "toggle":
      return {
        html: `<div style="margin:0 0 20px"><strong style="color:#294b43">${htmlRich}</strong>${nestedHtml}</div>`,
        text: `${textRich}\n${nestedText}`
      };
    case "quote":
      return {
        html: `<blockquote style="margin:24px 0;padding:5px 0 5px 20px;border-left:4px solid #dc6b3f;color:#526861;font-size:17px;line-height:1.65">${htmlRich}${nestedHtml}</blockquote>`,
        text: `> ${textRich}\n${nestedText}`
      };
    case "callout": {
      const icon = typeof data.icon === "object" && data.icon && "emoji" in data.icon
        ? escapeHtml(String((data.icon as { emoji: string }).emoji))
        : "•";
      return {
        html: `<div style="margin:24px 0;padding:18px 20px;background:#f6f8f7;border:1px solid #e3e9e6;border-radius:10px;color:#526861;font-size:15px;line-height:1.65">${icon}&nbsp; ${htmlRich}${nestedHtml}</div>`,
        text: `${textRich}\n${nestedText}`
      };
    }
    case "divider":
      return { html: '<hr style="margin:28px 0;border:0;border-top:1px solid #e3e9e6">', text: "\n---\n" };
    case "code":
      return {
        html: `<pre style="margin:24px 0;padding:18px;overflow:auto;background:#153b32;color:#f7f9f8;border-radius:9px;font:13px/1.6 monospace;white-space:pre-wrap"><code>${htmlRich}</code></pre>`,
        text: `${textRich}\n`
      };
    case "equation": {
      const expression = escapeHtml(String(data.expression ?? ""));
      return { html: `<p style="${paragraphStyle};font-family:serif">${expression}</p>`, text: `${String(data.expression ?? "")}\n` };
    }
    case "image": {
      const url = mediaUrl(data);
      const captionHtml = richHtml(data.caption, baseUrl);
      const captionText = richText(data.caption);
      return url ? {
        html: `<figure style="margin:26px 0"><img src="${escapeHtml(absoluteUrl(url, baseUrl))}" alt="${escapeHtml(captionText || "Email image")}" style="display:block;width:100%;max-width:100%;height:auto;border:0;border-radius:9px">${captionHtml ? `<figcaption style="margin-top:8px;color:#7a8d87;font-size:12px;line-height:1.5">${captionHtml}</figcaption>` : ""}</figure>`,
        text: captionText ? `[Image: ${captionText}]\n` : "[Image]\n"
      } : { html: "", text: "" };
    }
    case "video":
    case "audio":
    case "file":
    case "pdf":
    case "bookmark":
    case "embed":
    case "link_preview": {
      const url = mediaUrl(data);
      const label = richText(data.caption) || url;
      return url ? {
        html: `<p style="${paragraphStyle}"><a href="${escapeHtml(absoluteUrl(url, baseUrl))}" style="color:#c65d39;text-decoration:underline">${escapeHtml(label)}</a></p>`,
        text: `${label}: ${absoluteUrl(url, baseUrl)}\n`
      } : { html: nestedHtml, text: nestedText };
    }
    case "table_row": {
      const cells = (data.cells as RichText[][] | undefined) ?? [];
      return {
        html: `<tr>${cells.map((cell) => `<td style="padding:10px;border:1px solid #dfe6e3;color:#526861;font-size:13px;line-height:1.5">${richHtml(cell, baseUrl)}</td>`).join("")}</tr>`,
        text: `${cells.map(richText).join("\t")}\n`
      };
    }
    case "table":
      return {
        html: `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0;border-collapse:collapse">${nestedHtml}</table>`,
        text: `${nestedText}\n`
      };
    case "child_page":
    case "child_database": {
      const title = escapeHtml(String(data.title ?? ""));
      return { html: title ? `<p style="${paragraphStyle}"><strong>${title}</strong></p>${nestedHtml}` : nestedHtml, text: `${String(data.title ?? "")}\n${nestedText}` };
    }
    default:
      return {
        html: htmlRich ? `<p style="${paragraphStyle}">${htmlRich}</p>${nestedHtml}` : nestedHtml,
        text: `${textRich}\n${nestedText}`
      };
  }
}

export function renderNotionEmail(blocks: ContentBlock[], baseUrl: string) {
  const html: string[] = [];
  const text: string[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.type === "bulleted_list_item" || block.type === "numbered_list_item") {
      const type = block.type;
      const items: { html: string; text: string }[] = [];
      while (blocks[index]?.type === type) {
        items.push(renderSingleBlock(blocks[index], baseUrl));
        index++;
      }
      index--;
      const tag = type === "bulleted_list_item" ? "ul" : "ol";
      html.push(`<${tag} style="margin:0 0 22px;padding-left:24px;color:#4e665f;font-size:16px;line-height:1.65">${items.map((item) => item.html).join("")}</${tag}>`);
      text.push(items.map((item, itemIndex) => `${tag === "ol" ? `${itemIndex + 1}.` : "-"} ${item.text.trim()}`).join("\n"));
      continue;
    }
    const rendered = renderSingleBlock(block, baseUrl);
    html.push(rendered.html);
    text.push(rendered.text);
  }
  return {
    html: html.join(""),
    text: text.join("\n").replace(/\n{3,}/g, "\n\n").trim()
  };
}

function decodeAttribute(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function imageExtension(contentType: string | null) {
  const subtype = contentType?.split(";")[0].split("/")[1]?.toLowerCase();
  if (!subtype) return "bin";
  if (subtype === "jpeg") return "jpg";
  if (subtype === "svg+xml") return "svg";
  return subtype.replace(/[^a-z0-9]/g, "") || "bin";
}

export async function inlineEmailImages(
  html: string,
  fetcher: typeof fetch = fetch
): Promise<{ html: string; attachments: InlineImageAttachment[] }> {
  const urls = [...html.matchAll(/<img\b[^>]*\bsrc="(https?:\/\/[^"]+)"/gi)]
    .map((match) => decodeAttribute(match[1]));
  const uniqueUrls = [...new Set(urls)];
  const attachments: InlineImageAttachment[] = [];
  let output = html;

  for (const [index, url] of uniqueUrls.entries()) {
    const response = await fetcher(url);
    if (!response.ok) throw new Error(`Could not download email image (${response.status}): ${url}`);
    const contentType = response.headers.get("content-type");
    const cid = `notion-image-${index}@syncpoly`;
    attachments.push({
      filename: `notion-image-${index}.${imageExtension(contentType)}`,
      cid,
      content: Buffer.from(await response.arrayBuffer()),
      ...(contentType ? { contentType: contentType.split(";")[0] } : {})
    });
    output = output.replaceAll(escapeHtml(url), `cid:${cid}`);
  }

  return { html: output, attachments };
}
