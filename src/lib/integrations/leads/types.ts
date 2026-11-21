import type { LeadInput } from "@/lib/validation/lead";
import type { WebsiteConfig } from "@/config/schema";

export interface LeadRecord extends LeadInput {
  submittedAt: string;
  sourceUrl: string;
  userAgent?: string;
  targetConfig: WebsiteConfig["target"];
  productInterest: string;
}

/** Storage boundary: route handlers depend on this interface, never on Notion directly. */
export interface LeadRepository {
  create(lead: LeadRecord): Promise<{ id: string }>;
}
