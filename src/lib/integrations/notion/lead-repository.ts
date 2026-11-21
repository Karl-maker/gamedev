import "server-only";
import type { Client } from "@notionhq/client";
import type { LeadRecord, LeadRepository } from "@/lib/integrations/leads/types";
import { getNotionClient } from "./client";

type PageCreateArgs = Parameters<Client["pages"]["create"]>[0];
type PageProperties = NonNullable<PageCreateArgs["properties"]>;
type PageChildren = NonNullable<PageCreateArgs["children"]>;
type PropertySchema = Record<string, { type: string }>;

const plainText = (content: string) => [{ type: "text" as const, text: { content } }];

function findProperty(schema: PropertySchema, names: string[], allowedTypes: string[]) {
  return Object.entries(schema).find(
    ([name, property]) =>
      names.some((candidate) => candidate.toLowerCase() === name.toLowerCase()) &&
      allowedTypes.includes(property.type)
  );
}

function setTextProperty(
  properties: PageProperties,
  schema: PropertySchema,
  names: string[],
  value: string
) {
  const match = findProperty(schema, names, ["rich_text", "email", "phone_number", "url", "select", "multi_select"]);
  if (!match || !value) return;
  const [name, definition] = match;
  if (definition.type === "email") properties[name] = { email: value };
  else if (definition.type === "phone_number") properties[name] = { phone_number: value };
  else if (definition.type === "url") properties[name] = { url: value };
  else if (definition.type === "select") properties[name] = { select: { name: value } };
  else if (definition.type === "multi_select") properties[name] = { multi_select: [{ name: value }] };
  else properties[name] = { rich_text: plainText(value.slice(0, 2000)) };
}

function paragraph(content: string): PageChildren[number] {
  return {
    object: "block",
    type: "paragraph",
    paragraph: { rich_text: plainText(content) }
  };
}

function leadBody(lead: LeadRecord): PageChildren {
  const details = [
    `Name: ${lead.firstName} ${lead.lastName}`,
    `Company: ${lead.company}`,
    `Email: ${lead.workEmail}`,
    `Phone: ${lead.callingCode} ${lead.phone}`,
    `Preferred contact: ${lead.preferredContactMethod}`,
    `Company size: ${lead.companySize}`,
    `Industry: ${lead.industry}`,
    `Country: ${lead.country}`,
    `Product interest: ${lead.productInterest}`,
    `Message: ${lead.message}`,
    `A/B assignments: ${JSON.stringify(lead.experimentAssignments)}`,
    `Target: ${lead.targetConfig.id}`,
    `Target config: ${JSON.stringify(lead.targetConfig)}`,
    `Source URL: ${lead.sourceUrl}`,
    `Submitted at: ${lead.submittedAt}`,
    `Consent: ${lead.consent ? "Yes" : "No"}`
  ];

  return details.flatMap((detail) => {
    const chunks = detail.match(/[\s\S]{1,1900}/g) ?? [detail];
    return chunks.map(paragraph);
  });
}

/**
 * Schema-aware Notion implementation of the LeadRepository boundary.
 *
 * Only compatible database properties are populated. Every submitted value is
 * also stored in the page body, so a database with only a title property still
 * captures the full lead, A/B assignment, and deployment target configuration.
 */
export class NotionLeadRepository implements LeadRepository {
  constructor(private readonly databaseId = process.env.NOTION_LEAD_DATABASE_ID) {}

  async create(lead: LeadRecord): Promise<{ id: string }> {
    if (!this.databaseId) throw new Error("NOTION_LEAD_DATABASE_ID is not configured.");

    const notion = getNotionClient();
    const database = await notion.databases.retrieve({ database_id: this.databaseId });
    if (!("data_sources" in database) || !database.data_sources[0]) {
      throw new Error("The configured Notion database has no accessible data source.");
    }

    const dataSourceId = database.data_sources[0].id;
    const dataSource = await notion.dataSources.retrieve({ data_source_id: dataSourceId });
    if (!("properties" in dataSource)) {
      throw new Error("The Notion data source schema could not be read.");
    }

    const schema = dataSource.properties as PropertySchema;
    const properties: PageProperties = {};
    const titleProperty = Object.entries(schema).find(([, property]) => property.type === "title");
    if (!titleProperty) throw new Error("The Notion lead database needs a title property.");
    properties[titleProperty[0]] = { title: plainText(`${lead.firstName} ${lead.lastName}`) };

    const phone = `${lead.callingCode} ${lead.phone}`;
    setTextProperty(properties, schema, ["Company", "Organisation", "Organization"], lead.company);
    setTextProperty(properties, schema, ["Email", "Work Email"], lead.workEmail);
    setTextProperty(properties, schema, ["Phone", "Phone Number"], phone);
    setTextProperty(properties, schema, ["Preferred Contact", "Contact Method"], lead.preferredContactMethod);
    setTextProperty(properties, schema, ["Contact Details"], JSON.stringify({
      email: lead.workEmail,
      phone,
      preferredMethod: lead.preferredContactMethod
    }));
    setTextProperty(properties, schema, ["Company Size", "Firm Size"], lead.companySize);
    setTextProperty(properties, schema, ["Industry", "Practice Area"], lead.industry);
    setTextProperty(properties, schema, ["Country", "Location"], lead.country);
    setTextProperty(properties, schema, ["Product Interest", "Interest"], lead.productInterest);
    setTextProperty(properties, schema, ["Message", "Request", "Notes"], lead.message);
    setTextProperty(properties, schema, ["A/B Assignments", "Experiments"], JSON.stringify(lead.experimentAssignments));
    setTextProperty(properties, schema, ["Target", "Campaign"], lead.targetConfig.id);
    setTextProperty(properties, schema, ["Target Config", "Campaign Config"], JSON.stringify(lead.targetConfig));
    setTextProperty(properties, schema, ["Source URL", "Source"], lead.sourceUrl);

    const submittedAt = findProperty(schema, ["Submitted At", "Created At"], ["date"]);
    if (submittedAt) properties[submittedAt[0]] = { date: { start: lead.submittedAt } };
    const consent = findProperty(schema, ["Consent", "GDPR Consent"], ["checkbox"]);
    if (consent) properties[consent[0]] = { checkbox: lead.consent };

    const page = await notion.pages.create({
      parent: { type: "data_source_id", data_source_id: dataSourceId },
      properties,
      children: leadBody(lead)
    });
    return { id: page.id };
  }
}
