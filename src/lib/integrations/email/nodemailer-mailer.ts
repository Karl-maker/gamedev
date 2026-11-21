import "server-only";
import path from "node:path";
import nodemailer, { type Transporter } from "nodemailer";
import type { WebsiteConfig } from "@/config/schema";
import type { LeadRecord } from "@/lib/integrations/leads/types";
import { createUnsubscribeToken } from "@/lib/unsubscribe/token";
import type { LeadMailer } from "./types";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);

export class NodemailerLeadMailer implements LeadMailer {
  private readonly transporter: Transporter;
  private readonly baseUrl: string;

  constructor(private readonly config: WebsiteConfig) {
    this.baseUrl = (process.env.BASE_URL || process.env.SITE_URL || config.company.url).replace(/\/$/, "");
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined
    });
  }

  private logoAttachment() {
    return {
      filename: "brand-logo.png",
      path: path.join(process.cwd(), "public", "email-logo.png"),
      cid: "syncpoly-brand-logo"
    };
  }

  private frame({
    preheader,
    eyebrow,
    title,
    content,
    unsubscribeUrl
  }: {
    preheader: string;
    eyebrow: string;
    title: string;
    content: string;
    unsubscribeUrl?: string;
  }) {
    const company = escapeHtml(this.config.company.name);
    const legalName = escapeHtml(this.config.company.legalName);
    const address = escapeHtml(this.config.company.address);
    const supportEmail = escapeHtml(this.config.company.email);
    const websiteUrl = escapeHtml(this.baseUrl);
    const unsubscribe = unsubscribeUrl
      ? `&nbsp;&nbsp;·&nbsp;&nbsp;<a href="${escapeHtml(unsubscribeUrl)}" style="color:#60756f;text-decoration:underline">Unsubscribe</a>`
      : "";

    return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f3f5f3;color:#18332c;font-family:Arial,'Helvetica Neue',sans-serif;-webkit-font-smoothing:antialiased">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${escapeHtml(preheader)}</div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#f3f5f3">
    <tr><td align="center" style="padding:34px 14px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#fff;border:1px solid #e3e9e6;border-radius:18px;overflow:hidden;box-shadow:0 14px 42px rgba(24,51,44,.08)">
        <tr><td style="height:5px;background:#dc6b3f;font-size:0;line-height:0">&nbsp;</td></tr>
        <tr><td style="padding:25px 34px;border-bottom:1px solid #edf1ef">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0"><tr>
            <td width="46" valign="middle"><img src="cid:syncpoly-brand-logo" width="38" height="38" alt="${company} logo" style="display:block;width:38px;height:38px;object-fit:contain"></td>
            <td valign="middle"><a href="${websiteUrl}" style="color:#153b32;text-decoration:none;font-size:20px;line-height:1;font-weight:750;letter-spacing:-.4px">${company}</a></td>
            <td align="right" valign="middle"><a href="${websiteUrl}" style="color:#60756f;text-decoration:none;font-size:12px">Visit website&nbsp;→</a></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:42px 38px 38px">
          <p style="margin:0 0 12px;color:#c65d39;font-size:11px;line-height:1.4;font-weight:700;letter-spacing:1.35px;text-transform:uppercase">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0 0 20px;color:#153b32;font-size:30px;line-height:1.18;letter-spacing:-.8px;font-weight:720">${escapeHtml(title)}</h1>
          ${content}
        </td></tr>
        <tr><td style="padding:25px 34px;background:#f7f9f8;border-top:1px solid #e7ece9;color:#60756f;font-size:11px;line-height:1.65">
          <strong style="color:#294b43">${legalName}</strong><br>${address}<br>
          <a href="mailto:${supportEmail}" style="color:#405f57;text-decoration:underline">${supportEmail}</a>
          &nbsp;&nbsp;·&nbsp;&nbsp;<a href="${websiteUrl}/privacy" style="color:#60756f;text-decoration:underline">Privacy</a>${unsubscribe}
        </td></tr>
      </table>
      <p style="margin:18px auto 0;max-width:600px;color:#84938f;font-size:10px;line-height:1.5">This message was sent because an enquiry was submitted to ${company}.</p>
    </td></tr>
  </table>
</body>
</html>`;
  }

  async sendAcknowledgement(lead: LeadRecord) {
    const token = createUnsubscribeToken(lead.workEmail);
    const unsubscribeUrl = `${this.baseUrl}/unsubscribe?token=${encodeURIComponent(token)}`;
    const supportEmail = this.config.company.email;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || `${this.config.company.name} <${supportEmail}>`,
      to: lead.workEmail,
      replyTo: supportEmail,
      subject: `We received your request — ${this.config.company.name}`,
      headers: {
        "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${supportEmail}?subject=Unsubscribe>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click"
      },
      attachments: [this.logoAttachment()],
      text: [
        `Thanks, ${lead.firstName}.`,
        "",
        "We received your request.",
        "A member of our team will review it and reply within two business days.",
        "",
        "Your message:",
        lead.message,
        "",
        `Website: ${this.baseUrl}`,
        `Support: ${supportEmail}`,
        `Unsubscribe from non-essential email: ${unsubscribeUrl}`
      ].join("\n"),
      html: this.frame({
        preheader: "Your request is safely with our team. Here is what happens next.",
        eyebrow: "Request received",
        title: `Thanks, ${lead.firstName}. We’ll take it from here.`,
        unsubscribeUrl,
        content: `
          <p style="margin:0 0 24px;color:#4e665f;font-size:16px;line-height:1.72">Hello ${escapeHtml(lead.firstName)}, your request is safely with our team. We’ll review the details and reply within two business days.</p>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 28px;background:#f6f8f7;border:1px solid #e3e9e6;border-radius:13px">
            <tr><td style="padding:22px 24px">
              <p style="margin:0 0 9px;color:#294b43;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px">Your message</p>
              <p style="margin:0;color:#526861;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
            </td></tr>
          </table>
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 30px">
            <tr>
              <td width="34" valign="top" style="padding:2px 12px 15px 0"><span style="display:block;width:28px;height:28px;border-radius:50%;background:#e7f0ed;color:#153b32;text-align:center;line-height:28px;font-size:12px;font-weight:700">1</span></td>
              <td valign="top" style="padding:0 0 15px"><strong style="display:block;margin-bottom:4px;color:#24483f;font-size:14px">We review the workflow</strong><span style="color:#667b75;font-size:13px;line-height:1.55">We’ll look at the information you shared and identify the most useful next step.</span></td>
            </tr>
            <tr>
              <td width="34" valign="top" style="padding:2px 12px 0 0"><span style="display:block;width:28px;height:28px;border-radius:50%;background:#fff0ea;color:#b85231;text-align:center;line-height:28px;font-size:12px;font-weight:700">2</span></td>
              <td valign="top"><strong style="display:block;margin-bottom:4px;color:#24483f;font-size:14px">A person follows up</strong><span style="color:#667b75;font-size:13px;line-height:1.55">You’ll receive a direct reply—not an automated sales sequence.</span></td>
            </tr>
          </table>
          <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="border-radius:9px;background:#d9653e">
            <a href="${escapeHtml(`${this.baseUrl}/services`)}" style="display:inline-block;padding:13px 20px;color:#fff;text-decoration:none;font-size:13px;font-weight:700">Explore our legal workflows&nbsp;→</a>
          </td></tr></table>`
      })
    });
  }

  async sendInternalNotification(lead: LeadRecord) {
    if (!process.env.LEAD_NOTIFICATION_EMAIL) return;
    const supportEmail = this.config.company.email;
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM || `${this.config.company.name} <${supportEmail}>`,
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      replyTo: lead.workEmail,
      subject: `New website lead: ${lead.company}`,
      attachments: [this.logoAttachment()],
      text: [
        `New lead: ${lead.firstName} ${lead.lastName}`,
        `Company: ${lead.company}`,
        `Email: ${lead.workEmail}`,
        `Phone: ${lead.callingCode} ${lead.phone}`,
        `Preferred contact: ${lead.preferredContactMethod}`,
        `Firm: ${lead.companySize} · ${lead.industry} · ${lead.country}`,
        `Interest: ${lead.productInterest}`,
        "",
        lead.message,
        "",
        `Target: ${lead.targetConfig.id} · ${lead.targetConfig.campaign} · ${lead.targetConfig.audience}`,
        `Experiments: ${JSON.stringify(lead.experimentAssignments)}`
      ].join("\n"),
      html: this.frame({
        preheader: `${lead.firstName} ${lead.lastName} from ${lead.company} submitted a new enquiry.`,
        eyebrow: "New website lead",
        title: `${lead.firstName} ${lead.lastName} — ${lead.company}`,
        content: `
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;background:#f6f8f7;border:1px solid #e3e9e6;border-radius:13px">
            <tr><td style="padding:22px 24px;color:#526861;font-size:14px;line-height:1.75">
              <strong style="color:#24483f">Contact</strong><br>
              <a href="mailto:${escapeHtml(lead.workEmail)}" style="color:#c65d39">${escapeHtml(lead.workEmail)}</a> · ${escapeHtml(lead.callingCode)} ${escapeHtml(lead.phone)}<br>
              Prefers ${escapeHtml(lead.preferredContactMethod)}<br><br>
              <strong style="color:#24483f">Firm</strong><br>
              ${escapeHtml(lead.companySize)} · ${escapeHtml(lead.industry)} · ${escapeHtml(lead.country)}
            </td></tr>
          </table>
          <p style="margin:0 0 8px;color:#294b43;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.8px">Request</p>
          <p style="margin:0 0 24px;color:#526861;font-size:14px;line-height:1.7;white-space:pre-wrap">${escapeHtml(lead.message)}</p>
          <p style="margin:0;color:#7a8d87;font-size:11px;line-height:1.6"><strong>Target:</strong> ${escapeHtml(lead.targetConfig.id)} · ${escapeHtml(lead.targetConfig.campaign)} · ${escapeHtml(lead.targetConfig.audience)}<br><strong>Experiment assignments:</strong> ${escapeHtml(JSON.stringify(lead.experimentAssignments))}</p>`
      })
    });
  }
}
