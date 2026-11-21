import "server-only";
import nodemailer, { type Transporter } from "nodemailer";
import type { WebsiteConfig } from "@/config/schema";
import type { LeadRecord } from "@/lib/integrations/leads/types";
import type { LeadMailer } from "./types";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);

export class NodemailerLeadMailer implements LeadMailer {
  private readonly transporter: Transporter;

  constructor(private readonly config: WebsiteConfig) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT ?? 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined
    });
  }

  private frame(content: string) {
    const company = escapeHtml(this.config.company.name);
    return `<!doctype html><html><body style="margin:0;background:#f4f7f5;font-family:Arial,sans-serif;color:#17332c">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td style="padding:32px 16px">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;margin:auto;background:#fff;border-radius:16px;overflow:hidden">
      <tr><td style="background:#133d34;padding:24px;color:#fff;font-size:21px;font-weight:700">${company}</td></tr>
      <tr><td style="padding:32px;line-height:1.65">${content}</td></tr>
      <tr><td style="padding:20px 32px;background:#edf4f1;color:#547068;font-size:12px">${escapeHtml(this.config.company.address)}</td></tr>
      </table></td></tr></table></body></html>`;
  }

  async sendAcknowledgement(lead: LeadRecord) {
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: lead.workEmail,
      subject: `We received your request — ${this.config.company.name}`,
      html: this.frame(`<h1 style="font-size:26px">Thanks, ${escapeHtml(lead.firstName)}.</h1>
        <p>We received your note about <strong>${escapeHtml(lead.productInterest)}</strong>. A member of our team will review it and reply within two business days.</p>
        <p>For your records, you told us:</p><blockquote style="border-left:3px solid #dc6b3f;margin:20px 0;padding:4px 16px;color:#52655f">${escapeHtml(lead.message)}</blockquote>`)
    });
  }

  async sendInternalNotification(lead: LeadRecord) {
    if (!process.env.LEAD_NOTIFICATION_EMAIL) return;
    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.LEAD_NOTIFICATION_EMAIL,
      replyTo: lead.workEmail,
      subject: `New website lead: ${lead.company}`,
      html: this.frame(`<h1 style="font-size:24px">New lead</h1>
        <p><strong>${escapeHtml(lead.firstName)} ${escapeHtml(lead.lastName)}</strong> from ${escapeHtml(lead.company)}</p>
        <p>${escapeHtml(lead.workEmail)} · ${escapeHtml(lead.callingCode)} ${escapeHtml(lead.phone)} · Prefers ${escapeHtml(lead.preferredContactMethod)}</p>
        <p>${escapeHtml(lead.companySize)} · ${escapeHtml(lead.industry)} · ${escapeHtml(lead.country)}</p>
        <p><strong>Interest:</strong> ${escapeHtml(lead.productInterest)}</p><p>${escapeHtml(lead.message)}</p>
        <p><strong>Target:</strong> ${escapeHtml(lead.targetConfig.id)} · ${escapeHtml(lead.targetConfig.campaign)} · ${escapeHtml(lead.targetConfig.audience)}</p>
        <p><strong>Experiment assignments:</strong> ${escapeHtml(JSON.stringify(lead.experimentAssignments))}</p>`)
    });
  }
}
