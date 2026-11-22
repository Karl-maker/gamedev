import path from "node:path";
import type { WebsiteConfig } from "@/config/schema";

export const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[char]!);

export function logoAttachment() {
  return {
    filename: "brand-logo.png",
    path: path.join(process.cwd(), "public", "email-logo.png"),
    cid: "syncpoly-brand-logo"
  };
}

export function brandedEmailFrame({
  config,
  baseUrl,
  preheader,
  eyebrow,
  title,
  content,
  unsubscribeUrl
}: {
  config: WebsiteConfig;
  baseUrl: string;
  preheader: string;
  eyebrow: string;
  title: string;
  content: string;
  unsubscribeUrl?: string;
}) {
  const company = escapeHtml(config.company.name);
  const legalName = escapeHtml(config.company.legalName);
  const address = escapeHtml(config.company.address);
  const supportEmail = escapeHtml(config.company.email);
  const websiteUrl = escapeHtml(baseUrl.replace(/\/$/, ""));
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
