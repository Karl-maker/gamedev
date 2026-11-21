import { z } from "zod";
import { companySizes, countries, industries } from "@/data/options";

const cleanText = (max: number) =>
  z.string().trim().min(2, "Please enter at least 2 characters.").max(max, `Please keep this under ${max} characters.`);

export const leadSchema = z.object({
  firstName: cleanText(80),
  lastName: cleanText(80),
  company: cleanText(120),
  workEmail: z.string().trim().email("Please enter a valid work email.").max(160),
  callingCode: z.string().regex(/^\+\d{0,4}$/, "Choose a valid calling code."),
  phone: z.string().trim().regex(/^[\d\s()-]{6,24}$/, "Please enter a valid phone number."),
  preferredContactMethod: z.enum(["Email", "Phone", "Either"], { message: "Please choose how we should contact you." }),
  companySize: z.enum(companySizes as [string, ...string[]], { message: "Please choose a company size." }),
  industry: z.enum(industries as [string, ...string[]], { message: "Please choose an industry." }),
  country: z.enum(countries as [string, ...string[]], { message: "Please choose a country." }),
  message: z.string().trim().min(10, "Tell us a little more so we can help.").max(2000),
  consent: z.literal(true, { message: "Please agree before sending your request." }),
  experimentAssignments: z.record(z.string(), z.string()).default({}),
  website: z.string().max(0, "Submission rejected."),
  startedAt: z.number().int().positive()
});

export type LeadInput = z.infer<typeof leadSchema>;
