import "server-only";
import type { LeadRecord, LeadRepository } from "@/lib/integrations/leads/types";
import { getNotionClient } from "./client";

const title = (content: string) => ({ title: [{ text: { content } }] });
const richText = (content: string) => ({ rich_text: [{ text: { content } }] });
const select = (name: string) => ({ select: { name } });

/**
 * Notion implementation of LeadRepository.
 * Property names intentionally match docs/notion-setup.md and can be changed here
 * without leaking Notion concepts into the form or API route.
 */
export class NotionLeadRepository implements LeadRepository {
  constructor(private readonly databaseId = process.env.NOTION_LEAD_DATABASE_ID) {}

  async create(lead: LeadRecord): Promise<{ id: string }> {
    if (!this.databaseId) throw new Error("NOTION_LEAD_DATABASE_ID is not configured.");
    const contactDetails = {
      email: lead.workEmail,
      phone: `${lead.callingCode} ${lead.phone}`,
      preferredMethod: lead.preferredContactMethod
    };
    const page = await getNotionClient().pages.create({
      parent: { database_id: this.databaseId },
      properties: {
        Name: title(`${lead.firstName} ${lead.lastName}`),
        Company: richText(lead.company),
        Email: { email: lead.workEmail },
        Phone: { phone_number: `${lead.callingCode} ${lead.phone}` },
        "Preferred Contact": select(lead.preferredContactMethod),
        "Contact Details": richText(JSON.stringify(contactDetails)),
        "Company Size": select(lead.companySize),
        Industry: select(lead.industry),
        Country: select(lead.country),
        "Product Interest": richText(lead.productInterest),
        Message: richText(lead.message),
        "A/B Assignments": richText(JSON.stringify(lead.experimentAssignments)),
        Target: richText(lead.targetConfig.id),
        "Target Config": richText(JSON.stringify(lead.targetConfig)),
        "Source URL": { url: lead.sourceUrl },
        "Submitted At": { date: { start: lead.submittedAt } },
        Consent: { checkbox: lead.consent }
      }
    });
    return { id: page.id };
  }
}
