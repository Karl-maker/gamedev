import "server-only";
import { Client } from "@notionhq/client";

let notion: Client | undefined;

export function getNotionClient(): Client {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN is not configured.");
  notion ??= new Client({ auth: token });
  return notion;
}
