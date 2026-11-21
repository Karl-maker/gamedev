import { NextResponse } from "next/server";
import { getWebsiteConfig } from "@/config";
import { NodemailerLeadMailer } from "@/lib/integrations/email/nodemailer-mailer";
import { NotionLeadRepository } from "@/lib/integrations/notion/lead-repository";
import { rateLimit } from "@/lib/security/rate-limit";
import { isAllowedOrigin, requestFingerprint } from "@/lib/security/request";
import { leadSchema } from "@/lib/validation/lead";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const config = getWebsiteConfig();
  if (!isAllowedOrigin(request, config.company.url)) {
    return NextResponse.json({ message: "This request could not be verified." }, { status: 403 });
  }
  if (Number(request.headers.get("content-length") ?? 0) > 20_000) {
    return NextResponse.json({ message: "That submission is too large." }, { status: 413 });
  }
  const limit = rateLimit(requestFingerprint(request));
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "We could not read that submission." }, { status: 400 });
  }
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const fields = parsed.error.flatten().fieldErrors;
    return NextResponse.json(
      { message: "Please check the highlighted fields.", fields },
      { status: 400 }
    );
  }
  if (Date.now() - parsed.data.startedAt < 2500) {
    return NextResponse.json({ message: "Please take a moment to review your details." }, { status: 400 });
  }

  const lead = {
    ...parsed.data,
    submittedAt: new Date().toISOString(),
    sourceUrl: request.headers.get("referer") ?? config.company.url,
    userAgent: request.headers.get("user-agent") ?? undefined,
    targetConfig: config.target,
    productInterest: config.target.productCatalog
  };

  try {
    const repository = new NotionLeadRepository();
    const mailer = new NodemailerLeadMailer(config);
    const saved = await repository.create(lead);
    const emailResults = await Promise.allSettled([
      mailer.sendAcknowledgement(lead),
      mailer.sendInternalNotification(lead)
    ]);
    emailResults.forEach((result) => {
      if (result.status === "rejected") console.error("Lead email failed", result.reason);
    });
    return NextResponse.json({ ok: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json(
      { message: "We couldn’t send your request right now. Please email us instead." },
      { status: 503 }
    );
  }
}
