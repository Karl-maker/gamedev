import { NextResponse } from "next/server";
import { getWebsiteConfig } from "@/config";
import { NotionUnsubscribeRepository } from "@/lib/integrations/notion/unsubscribe-repository";
import { rateLimit } from "@/lib/security/rate-limit";
import { requestFingerprint } from "@/lib/security/request";
import { readUnsubscribeToken } from "@/lib/unsubscribe/token";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 4_000) {
    return NextResponse.json({ message: "That request is too large." }, { status: 413 });
  }
  const limit = rateLimit(`unsubscribe:${requestFingerprint(request)}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Too many attempts. Please wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  let token = new URL(request.url).searchParams.get("token") ?? "";
  const contentType = request.headers.get("content-type") ?? "";
  if (!token && contentType.includes("application/json")) {
    const body = await request.json().catch(() => null) as { token?: unknown } | null;
    token = typeof body?.token === "string" ? body.token : "";
  }
  if (!token && contentType.includes("application/x-www-form-urlencoded")) {
    const body = await request.formData().catch(() => null);
    const value = body?.get("token");
    token = typeof value === "string" ? value : "";
  }

  const email = token ? readUnsubscribeToken(token) : null;
  if (!email) {
    return NextResponse.json({ message: "This unsubscribe link is invalid." }, { status: 400 });
  }

  const config = getWebsiteConfig();
  const source = `${config.company.url.replace(/\/$/, "")}/unsubscribe`;
  try {
    const saved = await new NotionUnsubscribeRepository().create({
      email,
      source,
      submittedAt: new Date().toISOString()
    });
    return NextResponse.json({ ok: true, id: saved.id });
  } catch (error) {
    console.error("Unsubscribe request failed", error);
    return NextResponse.json(
      { message: `We couldn’t update this preference. Please email ${config.company.email}.` },
      { status: 503 }
    );
  }
}
