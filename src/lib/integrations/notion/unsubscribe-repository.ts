import "server-only";
import type { Client } from "@notionhq/client";
import { getNotionClient } from "./client";

type PageCreateArgs = Parameters<Client["pages"]["create"]>[0];
type PageProperties = NonNullable<PageCreateArgs["properties"]>;
type PropertySchema = Record<string, { type: string }>;

const text = (content: string) => [{ type: "text" as const, text: { content } }];

function property(schema: PropertySchema, names: string[], types: string[]) {
  return Object.entries(schema).find(
    ([name, value]) =>
      names.some((candidate) => candidate.toLowerCase() === name.toLowerCase()) &&
      types.includes(value.type)
  );
}

export class NotionUnsubscribeRepository {
  constructor(
    private readonly databaseId =
      process.env.NOTION_UNSUBSCRIBE_DATABASE_ID || process.env.NOTION_LEAD_DATABASE_ID
  ) {}

  async create(record: { email: string; source: string; submittedAt: string }) {
    if (!this.databaseId) throw new Error("A Notion unsubscribe database is not configured.");

    const notion = getNotionClient();
    const database = await notion.databases.retrieve({ database_id: this.databaseId });
    if (!("data_sources" in database) || !database.data_sources[0]) {
      throw new Error("The configured Notion unsubscribe database has no accessible data source.");
    }

    const dataSourceId = database.data_sources[0].id;
    const dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
    if (!("properties" in dataSource)) throw new Error("The unsubscribe data source schema could not be read.");

    const schema = dataSource.properties as PropertySchema;
    const properties: PageProperties = {};
    const title = Object.entries(schema).find(([, value]) => value.type === "title");
    if (!title) throw new Error("The Notion unsubscribe database needs a title property.");
    properties[title[0]] = { title: text(`Unsubscribe — ${record.email}`) };

    const email = property(schema, ["Email", "Contact"], ["email", "rich_text"]);
    if (email) {
      properties[email[0]] = email[1].type === "email"
        ? { email: record.email }
        : { rich_text: text(record.email) };
    }
    const status = property(schema, ["Status", "Preference"], ["select", "rich_text"]);
    if (status) {
      properties[status[0]] = status[1].type === "select"
        ? { select: { name: "Unsubscribed" } }
        : { rich_text: text("Unsubscribed") };
    }
    const submittedAt = property(schema, ["Submitted At", "Date", "Created At"], ["date"]);
    if (submittedAt) properties[submittedAt[0]] = { date: { start: record.submittedAt } };
    const source = property(schema, ["Source", "Source URL"], ["url", "rich_text"]);
    if (source) {
      properties[source[0]] = source[1].type === "url"
        ? { url: record.source }
        : { rich_text: text(record.source) };
    }

    const page = await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties,
      children: [
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: text(`Email: ${record.email}`) }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: text("Preference: Unsubscribed from non-essential email") }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: text(`Submitted at: ${record.submittedAt}`) }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: { rich_text: text(`Source: ${record.source}`) }
        }
      ]
    });

    return { id: page.id };
  }
}
