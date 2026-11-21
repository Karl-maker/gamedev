import { describe, expect, it } from "vitest";
import { leadSchema } from "@/lib/validation/lead";

const validLead = {
  firstName: "Asha",
  lastName: "James",
  company: "Example Ltd",
  workEmail: "asha@example.com",
  callingCode: "+1868",
  phone: "555 0101",
  preferredContactMethod: "Email",
  companySize: "11–50",
  industry: "Professional services",
  country: "Trinidad and Tobago",
  message: "We need to compare three options for a regional rollout.",
  consent: true,
  experimentAssignments: { "home-hero-message": "evidence" },
  website: "",
  startedAt: Date.now() - 5000
};

describe("lead validation", () => {
  it("accepts a complete lead", () => expect(leadSchema.safeParse(validLead).success).toBe(true));
  it("rejects bots filling the honeypot", () => expect(leadSchema.safeParse({ ...validLead, website: "spam" }).success).toBe(false));
  it("rejects invalid contact details", () => expect(leadSchema.safeParse({ ...validLead, workEmail: "bad", phone: "12" }).success).toBe(false));
  it("requires explicit consent", () => expect(leadSchema.safeParse({ ...validLead, consent: false }).success).toBe(false));
});
