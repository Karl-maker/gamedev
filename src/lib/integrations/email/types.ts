import type { LeadRecord } from "@/lib/integrations/leads/types";

export interface LeadMailer {
  sendAcknowledgement(lead: LeadRecord): Promise<void>;
  sendInternalNotification(lead: LeadRecord): Promise<void>;
}
