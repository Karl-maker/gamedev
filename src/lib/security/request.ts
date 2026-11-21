import { createHash } from "node:crypto";

export function requestFingerprint(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded ?? request.headers.get("x-real-ip") ?? "unknown";
  return createHash("sha256").update(ip).digest("hex");
}

export function isAllowedOrigin(request: Request, canonicalUrl?: string) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const configured =
    canonicalUrl ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? process.env.VERCEL_URL.startsWith("http")
        ? process.env.VERCEL_URL
        : `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  const allowed = [
    configured,
    ...(process.env.ALLOWED_ORIGINS ?? "").split(",").map((value) => value.trim()).filter(Boolean)
  ];
  try {
    const requestHost = new URL(origin).host;
    return allowed.some((value) => new URL(value).host === requestHost);
  } catch {
    return false;
  }
}
