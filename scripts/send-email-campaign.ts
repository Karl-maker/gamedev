import { parseArgs } from "node:util";
import { Client } from "@notionhq/client";
import nodemailer from "nodemailer";
import { getRuntimeWebsiteConfig } from "../src/config/runtime";
import {
  fetchNotionEmailPage,
  inlineEmailImages,
  loadRecipientsCsv,
  personalize,
  renderNotionEmail,
  selectRecipients
} from "../src/lib/integrations/email/campaign";
import {
  brandedEmailFrame,
  escapeHtml,
  logoAttachment
} from "../src/lib/integrations/email/branded-template";
import { createUnsubscribeToken } from "../src/lib/unsubscribe/token";

async function main() {
const { values } = parseArgs({
  options: {
    csv: { type: "string" },
    id: { type: "string" },
    industry: { type: "string" },
    "base-url": { type: "string" },
    subject: { type: "string" },
    eyebrow: { type: "string", default: "A note from our team" },
    preheader: { type: "string" },
    "dry-run": { type: "boolean", default: false }
  },
  strict: true
});

for (const option of ["csv", "id", "industry", "base-url"] as const) {
  if (!values[option]) throw new Error(`Missing required --${option} option.`);
}
if (!process.env.NOTION_TOKEN) throw new Error("NOTION_TOKEN is not configured.");

const baseUrl = new URL(values["base-url"]!).toString().replace(/\/$/, "");
process.env.BASE_URL = baseUrl;
const config = getRuntimeWebsiteConfig();
const recipients = await loadRecipientsCsv(values.csv!);
const selected = selectRecipients(recipients, values.industry!);
const skipped = recipients.filter((recipient) => recipient.skip).length;
const industryExcluded = recipients.length - selected.length - skipped;
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const page = await fetchNotionEmailPage(notion, values.id!);
const rendered = renderNotionEmail(page.blocks, baseUrl);
const subjectTemplate = values.subject || page.title;
const preheaderTemplate = values.preheader || subjectTemplate;

console.log(`Loaded ${recipients.length} CSV rows; selected ${selected.length} for "${values.industry}" (${skipped} skipped, ${Math.max(0, industryExcluded)} outside selection or duplicate).`);

if (values["dry-run"]) {
  for (const recipient of selected) {
    console.log(`[dry-run] ${recipient.email}: ${personalize(subjectTemplate, recipient)}`);
  }
  process.exit(0);
}

if (!process.env.SMTP_HOST) throw new Error("SMTP_HOST is not configured.");
if (!process.env.SMTP_NEWSLETTER_FROM) throw new Error("SMTP_NEWSLETTER_FROM is not configured.");
const inlined = await inlineEmailImages(rendered.html);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: process.env.SMTP_USER
    ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    : undefined
});
const supportEmail = config.company.email;
let sent = 0;
const failures: string[] = [];

for (const recipient of selected) {
  const subject = personalize(subjectTemplate, recipient);
  const unsubscribeUrl = `${baseUrl}/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(recipient.email))}`;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_NEWSLETTER_FROM,
      to: recipient.email,
      replyTo: supportEmail,
      subject,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${supportEmail}?subject=Unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
      },
      attachments: [logoAttachment(), ...inlined.attachments],
      text: [
        personalize(rendered.text, recipient),
        "",
        `Website: ${baseUrl}`,
        `Support: ${supportEmail}`,
        `Unsubscribe: ${unsubscribeUrl}`
      ].join("\n"),
      html: brandedEmailFrame({
        config,
        baseUrl,
        preheader: personalize(preheaderTemplate, recipient),
        eyebrow: personalize(values.eyebrow!, recipient),
        title: subject,
        content: personalize(inlined.html, recipient, escapeHtml),
        unsubscribeUrl
      })
    });
    sent++;
    console.log(`Sent ${recipient.email}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`${recipient.email}: ${message}`);
    console.error(`Failed ${recipient.email}: ${message}`);
  }
}

console.log(`Campaign complete: ${sent} sent, ${failures.length} failed.`);
if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
